package startupkt.bots

import startupkt.engine.*
import kotlin.random.Random

/**
 * What a bot may use to decide. [view] is the seat's legal information; [sampleWorld] returns a full game state in which
 * all hidden information (other hands, undealt cards, others' pending picks) has been re-randomized, so search-based bots
 * can simulate without cheating.
 */
class BotContext(
    val engine: Engine,
    val view: PlayerView,
    val rng: Random,
    private val sampler: (Random) -> GameState,
) {
    val ruleset: Ruleset get() = engine.ruleset
    fun sampleWorld(r: Random = rng): GameState = sampler(r)

    companion object {
        fun of(engine: Engine, state: GameState, seat: Int, rng: Random) =
            BotContext(engine, engine.view(state, seat), rng) { r -> engine.determinize(state, seat, r) }
    }
}

fun interface Bot {
    fun choose(ctx: BotContext): Action

    /**
     * Cooperative variant for single-threaded UIs (browser): long-running bots call [pause] between chunks of work
     * so the UI can render. Default: same as [choose].
     */
    suspend fun chooseAsync(ctx: BotContext, pause: suspend () -> Unit): Action = choose(ctx)
}

object RandomBot : Bot {
    override fun choose(ctx: BotContext): Action {
        val a = Action.parse(ctx.view.options.random(ctx.rng).action)
        if (!ctx.view.mustDiscard) return a
        val rest = ctx.view.hand.map { it.id }.toMutableList().apply { remove(a.cardId) }
        return a.withDiscard(rest.random(ctx.rng))
    }
}

/**
 * Duel discard: throw away the card that would help the opponent most (they receive this hand next),
 * discounted by how useful it would be to us when the hand comes back.
 */
fun chooseDiscard(engine: Engine, state: GameState, seat: Int, main: Action, policy: HeuristicBot): String {
    val me = state.player(seat)
    val rest = me.hand.toMutableList().apply { remove(main.cardId) }
    val opp = state.players.first { it.seat != seat }
    val r = engine.ruleset
    fun valueFor(p: PlayerState, id: String): Double {
        val card = r.card(id)
        val pay = engine.payment(p, card)
        val opt = if (pay != null) Option("build:$id", card, pay, engine.immediateCoins(p, card)) else Option("sell:$id", card, null, engine.sellValue(p))
        return policy.value(opt, r, state.sprint, state.pick, r.rules.sprints, r.rules.picksPerSprint, p.coins, p.built.map(r::card))
    }
    return rest.maxBy { valueFor(opp, it) - 0.5 * valueFor(me, it) }
}

/**
 * Scores every option with a value function and picks the best (with a bit of noise).
 * Weights express a strategy ("personality"); [noise] lowers skill.
 */
class HeuristicBot(
    val productionWeight: Double,
    val agentBonus: Double = 0.0,
    val libraryWeight: Double = 0.5,
    val coinWeight: Double = 1.0,
    val featureBonus: Double = 0.0,
    val noise: Double = 0.15,
    /** How much the bot likes roadmap stages (1.0 = neutral estimate). */
    val roadmapWeight: Double = 0.7,
) : Bot {
    override fun choose(ctx: BotContext): Action {
        val v = ctx.view
        val a = pick(ctx.engine.ruleset, v.options, v.sprint, v.pick, v.sprints, v.picksPerSprint, v.coins, v.built, ctx.rng)
        if (!v.mustDiscard) return a
        return a.withDiscard(chooseDiscard(ctx.engine, ctx.sampleWorld(), v.seat, a, this))
    }

    /** Fast path for rollouts: uses only the acting seat's own information (plus public tableaux for duel discards). */
    fun chooseFast(engine: Engine, state: GameState, seat: Int, rng: Random): Action {
        val p = state.player(seat)
        val r = engine.ruleset
        val a = pick(r, engine.options(state, seat), state.sprint, state.pick, r.rules.sprints, r.rules.picksPerSprint, p.coins, p.built.map(r::card), rng)
        return if (r.rules.isDuel(state.players.size)) a.withDiscard(chooseDiscard(engine, state, seat, a, this)) else a
    }

    private fun pick(
        ruleset: Ruleset, options: List<Option>, sprint: Int, pick: Int, sprints: Int, picks: Int,
        coins: Int, built: List<Card>, rng: Random,
    ): Action {
        val best = options.maxBy { value(it, ruleset, sprint, pick, sprints, picks, coins, built) + rng.nextDouble() * noise }
        return Action.parse(best.action)
    }

    fun value(o: Option, ruleset: Ruleset, sprint: Int, pick: Int, sprints: Int, picks: Int, coins: Int, built: List<Card>): Double {
        val rate = ruleset.rules.coinsPerPoint.toDouble()
        val total = (sprints * picks).toDouble()
        val remaining = ((sprints - sprint) * picks + (picks - pick)).toDouble()
        val frac = remaining / total
        if (o.payment == null) return o.gain / rate * coinWeight
        o.stage?.let { return stageValue(o, it, ruleset, sprint, sprints, remaining, frac, coins, built) }
        val c = o.card
        var v = c.points.toDouble()
        if (c.type == CardType.FEATURE) v += featureBonus
        v += (o.gain - o.payment.coins) / rate * coinWeight
        v += c.produces.size * productionWeight * frac
        v += c.produces.count { Res.AGENT in it } * agentBonus * frac
        when (val s = c.special) {
            is Special.PointsPer -> v += (built.count { it.type == s.type } + remaining * 0.4) * s.points
            is Special.FreelancerPrice -> v += productionWeight * frac * 1.5
            is Special.CoinRate -> v += coins / s.coinsPerPoint.toDouble() - coins / rate + remaining * 0.3
            else -> {}
        }
        if (c.type == CardType.LIBRARY) {
            val builtIds = built.map { it.id }.toSet()
            val unlocks = ruleset.cards.filter { it.freeWith == c.id && it.sprint >= sprint && it.id !in builtIds }
            v += libraryWeight * unlocks.sumOf { it.points } / 3.0
        }
        return v
    }

    /** Estimated value of completing a roadmap stage now (the tucked card is lost, so prefer burying a strong card). */
    private fun stageValue(
        o: Option, st: RoadmapStage, ruleset: Ruleset, sprint: Int, sprints: Int, remaining: Double, frac: Double, coins: Int, built: List<Card>,
    ): Double {
        val rate = ruleset.rules.coinsPerPoint.toDouble()
        val sprintEnds = (sprints - sprint + 1).toDouble()
        var v = st.points.toDouble()
        v += (o.gain - o.payment!!.coins) / rate * coinWeight
        v += st.sprintCoins * sprintEnds / rate * coinWeight
        st.sellValue?.let { v += (it - ruleset.rules.sellValue) * remaining * 0.25 / rate }
        v += st.teamDiscount * remaining * 0.15 / rate
        v += st.libraryCoins * remaining * 0.1 / rate
        when (val s = st.special) {
            is Special.PointsPer -> v += (built.count { it.type == s.type } + remaining * if (s.type == CardType.LIBRARY) 0.12 else 0.3) * s.points
            is Special.CoinRate -> v += coins / s.coinsPerPoint.toDouble() - coins / rate + remaining * 0.3
            is Special.FreelancerPrice -> v += productionWeight * frac * 1.5
            is Special.CoinsPer -> {}
            null -> {}
        }
        // Completing a stage opens the next one.
        v += 0.8 * frac
        return v * roadmapWeight + 0.05 * o.card.points
    }
}

/**
 * Determinized Monte Carlo search: for each legal action it samples [worlds] plausible hidden states, plays the game
 * to the end with a fast heuristic policy for everyone, and picks the action with the best average utility
 * (win bonus + point margin over the best opponent). Same worlds and seeds are used for every action (common random numbers).
 */
class MonteCarloBot(
    private val worlds: Int,
    private val rolloutPolicy: HeuristicBot = HeuristicBot(productionWeight = 2.5, libraryWeight = 1.0, noise = 1.0),
    private val candidateLimit: Int = 8,
) : Bot {
    private class Plan(val actions: List<Action>, val samples: List<Pair<GameState, Long>>)

    /** Returns either a forced action or the candidates and sampled worlds to evaluate. */
    private fun prepare(ctx: BotContext): Pair<Action?, Plan?> {
        val engine = ctx.engine
        val seat = ctx.view.seat
        var actions = ctx.view.options.map { Action.parse(it.action) }
        if (actions.size == 1) {
            val only = actions.first()
            return (if (ctx.view.mustDiscard) only.withDiscard(chooseDiscard(engine, ctx.sampleWorld(), seat, only, rolloutPolicy)) else only) to null
        }
        // Prune to the most promising candidates by heuristic to spend rollouts where it matters; always keep one sell.
        // Roadmap options differ only in the tucked card, so keep at most two of them.
        run {
            val v = ctx.view
            val ranked = v.options.sortedByDescending {
                rolloutPolicy.value(it, ctx.ruleset, v.sprint, v.pick, v.sprints, v.picksPerSprint, v.coins, v.built)
            }.map { Action.parse(it.action) }
            val stages = ranked.filterIsInstance<Action.Stage>().take(2)
            val trimmed = ranked.filter { it !is Action.Stage || it in stages }
            if (trimmed.size > candidateLimit || trimmed.size < ranked.size) {
                actions = (trimmed.take(candidateLimit - 1) + trimmed.first { it is Action.Sell }).distinct()
            }
        }
        if (ctx.view.mustDiscard) {
            val world = ctx.sampleWorld()
            actions = actions.map { it.withDiscard(chooseDiscard(engine, world, seat, it, rolloutPolicy)) }
        }
        return null to Plan(actions, List(worlds) { ctx.sampleWorld() to ctx.rng.nextLong() })
    }

    override fun choose(ctx: BotContext): Action {
        val (forced, plan) = prepare(ctx)
        if (forced != null) return forced
        plan!!
        return plan.actions.maxBy { a -> plan.samples.sumOf { (w, seed) -> rollout(ctx.engine, w, ctx.view.seat, a, Random(seed)) } }
    }

    override suspend fun chooseAsync(ctx: BotContext, pause: suspend () -> Unit): Action {
        val (forced, plan) = prepare(ctx)
        if (forced != null) return forced
        plan!!
        var best: Action = plan.actions.first()
        var bestValue = Double.NEGATIVE_INFINITY
        for (a in plan.actions) {
            var total = 0.0
            for ((w, seed) in plan.samples) {
                total += rollout(ctx.engine, w, ctx.view.seat, a, Random(seed))
                pause()
            }
            if (total > bestValue) { bestValue = total; best = a }
        }
        return best
    }

    private fun rollout(engine: Engine, world: GameState, seat: Int, first: Action, rng: Random): Double {
        var s = engine.submit(world, seat, first)
        while (!s.finished) {
            for (p in s.players.indices) {
                if (s.finished) break
                if (p !in s.pending) s = engine.submit(s, p, rolloutPolicy.chooseFast(engine, s, p, rng))
            }
        }
        return utility(engine, s, seat)
    }

    companion object {
        fun utility(engine: Engine, s: GameState, seat: Int): Double {
            val scores = engine.scores(s)
            val me = scores[seat]
            val best = scores.filter { it.seat != seat }.maxOf { it.total }
            val win = when {
                me.total > best -> 1.0
                me.total == best -> 0.5
                else -> 0.0
            }
            return win * 10 + (me.total - best)
        }
    }
}

object Bots {
    /** Strategy "personalities" of similar skill — used to check that many strategies are viable. */
    val strategies = listOf("greedy", "balanced", "engine", "ai-fan", "librarian", "hoarder")

    val all: Map<String, () -> Bot> = linkedMapOf(
        "random" to { RandomBot },
        // Difficulty levels for online play
        "easy" to { HeuristicBot(productionWeight = 1.5, libraryWeight = 0.5, noise = 4.0) },
        "medium" to { HeuristicBot(productionWeight = 2.5, libraryWeight = 1.0, noise = 0.8) },
        "hard" to { MonteCarloBot(worlds = 24) },
        "expert" to { MonteCarloBot(worlds = 80, candidateLimit = 10) },
        // Strategy personalities
        "greedy" to { HeuristicBot(productionWeight = 0.0, libraryWeight = 0.0, featureBonus = 0.5) },
        "balanced" to { HeuristicBot(productionWeight = 2.5, libraryWeight = 1.0) },
        "engine" to { HeuristicBot(productionWeight = 4.5, libraryWeight = 0.5) },
        "ai-fan" to { HeuristicBot(productionWeight = 2.5, agentBonus = 2.0, libraryWeight = 1.0) },
        "librarian" to { HeuristicBot(productionWeight = 2.0, libraryWeight = 3.0) },
        "hoarder" to { HeuristicBot(productionWeight = 1.0, coinWeight = 2.0, libraryWeight = 0.5) },
    )

    fun create(name: String): Bot = all[name]?.invoke()
        ?: throw IllegalArgumentException("Unknown bot '$name'. Available: ${all.keys.joinToString()}")
}
