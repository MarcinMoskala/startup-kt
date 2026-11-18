package startupkt.engine

import kotlinx.serialization.Serializable
import kotlin.random.Random

class IllegalActionException(message: String) : IllegalArgumentException(message)

/** Public information about another player. */
@Serializable
data class OpponentView(
    val seat: Int,
    val name: String,
    val startup: String,
    val coins: Int,
    val built: List<String>,
    val handSize: Int,
    val scoreSoFar: Int,
)

/** Everything one seat is allowed to know. Safe to hand to a bot or an AI agent. */
@Serializable
data class PlayerView(
    val seat: Int,
    val sprint: Int,
    val sprints: Int,
    val pick: Int,
    val picksPerSprint: Int,
    val finished: Boolean,
    val waitingForYou: Boolean,
    /** 2-player duel: every action must also name a card to discard (`build:x,discard:y`). */
    val mustDiscard: Boolean = false,
    val startup: Startup,
    val coins: Int,
    val production: List<List<Res>>,
    val freelancerPrice: Int,
    val built: List<Card>,
    val hand: List<Card>,
    val options: List<Option>,
    val scoreSoFar: Score,
    val opponents: List<OpponentView>,
    val recentLog: List<String>,
)

class Engine(val ruleset: Ruleset = DefaultRuleset.ruleset) {
    private val rules get() = ruleset.rules

    init {
        val problems = ruleset.validate()
        require(problems.isEmpty()) { "Invalid ruleset:\n" + problems.joinToString("\n") }
    }

    fun newGame(players: Int, seed: Long, names: List<String>? = null): GameState {
        require(players in rules.minPlayers..rules.maxPlayers) { "Players must be in ${rules.minPlayers}..${rules.maxPlayers}" }
        val rng = Random(seed)
        val startups = ruleset.startups.shuffled(rng).take(players)
        val decks = (1..rules.sprints).map { ruleset.deckFor(it, players).shuffled(rng) }
        val ps = (0 until players).map { seat ->
            PlayerState(
                seat = seat,
                name = names?.getOrNull(seat) ?: "P$seat",
                startup = startups[seat].id,
                coins = startups[seat].startCoins ?: rules.startCoins,
                hand = emptyList(),
            )
        }
        val state = GameState(players = ps, sprint = 1, pick = 1, decks = decks, log = listOf("Game started: $players players, seed $seed"))
        return deal(state)
    }

    private fun deal(state: GameState): GameState {
        val deck = state.decks[state.sprint - 1]
        val n = state.players.size
        val h = rules.handSize(n)
        check(deck.size >= n * h)
        val players = state.players.mapIndexed { i, p -> p.copy(hand = deck.subList(i * h, (i + 1) * h)) }
        return state.copy(players = players, log = state.log + "--- Sprint ${state.sprint} begins ---")
    }

    // ---------- Derived player info ----------

    fun production(p: PlayerState): List<List<Res>> =
        ruleset.startup(p.startup).produces + p.built.flatMap { ruleset.card(it).produces }

    fun freelancerPrice(p: PlayerState): Int =
        (p.built.mapNotNull { (ruleset.card(it).special as? Special.FreelancerPrice)?.price } + rules.freelancerPrice).min()

    fun coinsPerPoint(p: PlayerState): Int =
        (p.built.mapNotNull { (ruleset.card(it).special as? Special.CoinRate)?.coinsPerPoint } +
            listOfNotNull(rules.coinsPerPoint, ruleset.startup(p.startup).coinsPerPoint)).min()

    fun sellValue(p: PlayerState): Int = ruleset.startup(p.startup).sellValue ?: rules.sellValue

    /** Coin part of a card's cost for this player (startup discounts applied). */
    fun coinCost(p: PlayerState, card: Card): Int =
        if (card.type == CardType.TEAM) maxOf(0, card.costCoins - ruleset.startup(p.startup).teamDiscount) else card.costCoins

    /** Cheapest way to build [card], or null when impossible (duplicate, missing 🤖, or not enough coins). */
    fun payment(p: PlayerState, card: Card): Payment? {
        if (card.id in p.built) return null
        if (card.freeWith != null && card.freeWith in p.built) return Payment(free = true, coins = 0, freelancers = emptyList())
        val plan = cheapestPlan(production(p), card.cost, freelancerPrice(p)) ?: return null
        val coins = coinCost(p, card) + plan.coins
        if (coins > p.coins) return null
        return Payment(free = false, coins = coins, freelancers = plan.freelancers, agentTokens = plan.agentTokens)
    }

    data class Plan(val coins: Int, val freelancers: List<Res>, val agentTokens: Int)

    /**
     * Cheapest assignment of produced units to the cost (each unit once per build). A 🤖 unit may do 📱/🖥 work for
     * [Rules.agentTokenCost]; missing 📱/🖥 are bought from freelancers; a 🤖 slot can only be filled by a 🤖 unit.
     * Exhaustive search — costs have at most ~5 symbols. Ties prefer fewer 🤖 substitutions.
     */
    fun cheapestPlan(units: List<List<Res>>, cost: List<Res>, freelancer: Int): Plan? {
        val slots = cost.sortedBy { if (it == Res.AGENT) 0 else 1 }
        val used = BooleanArray(units.size)
        var best: Plan? = null
        val token = rules.agentTokenCost
        fun rec(i: Int, coins: Int, bought: List<Res>, subs: Int) {
            val b = best
            if (b != null && coins > b.coins) return
            if (i == slots.size) {
                if (b == null || coins < b.coins || (coins == b.coins && subs < b.agentTokens)) best = Plan(coins, bought, subs)
                return
            }
            val r = slots[i]
            for (u in units.indices) {
                if (used[u]) continue
                val native = r in units[u]
                val sub = !native && r != Res.AGENT && Res.AGENT in units[u]
                if (!native && !sub) continue
                used[u] = true
                rec(i + 1, coins + if (sub) token else 0, bought, subs + if (sub) 1 else 0)
                used[u] = false
            }
            if (r != Res.AGENT) rec(i + 1, coins + freelancer, bought + r, subs)
        }
        rec(0, 0, emptyList(), 0)
        return best
    }

    /**
     * Matches required resources to produced units (each unit used once per build).
     * 🤖 units can cover 📱/🖥. Returns resources that must be bought, or null if an unmatched 🤖 is required.
     * Kuhn's algorithm processing 🤖 slots first keeps them matched whenever possible (transversal matroid greedy).
     */
    fun missingResources(units: List<List<Res>>, cost: List<Res>): List<Res>? {
        val slots = cost.sortedBy { if (it == Res.AGENT) 0 else 1 }
        val unitMatch = IntArray(units.size) { -1 }
        fun fits(u: Int, r: Res) = r in units[u] || (r != Res.AGENT && Res.AGENT in units[u])
        fun augment(slot: Int, seen: BooleanArray): Boolean {
            for (u in units.indices) {
                if (seen[u] || !fits(u, slots[slot])) continue
                seen[u] = true
                if (unitMatch[u] == -1 || augment(unitMatch[u], seen)) {
                    unitMatch[u] = slot
                    return true
                }
            }
            return false
        }
        val missing = slots.indices.filterNot { augment(it, BooleanArray(units.size)) }.map { slots[it] }
        return if (Res.AGENT in missing) null else missing
    }

    /** Coins gained immediately when building. */
    fun immediateCoins(p: PlayerState, card: Card): Int {
        val per = (card.special as? Special.CoinsPer)?.let { s -> p.built.count { ruleset.card(it).type == s.type } * s.coins } ?: 0
        val lib = if (card.type == CardType.LIBRARY) ruleset.startup(p.startup).libraryCoins else 0
        return card.coins + per + lib
    }

    fun options(state: GameState, seat: Int): List<Option> {
        val p = state.player(seat)
        if (state.finished || seat in state.pending) return emptyList()
        return p.hand.distinct().flatMap { id ->
            val card = ruleset.card(id)
            val build = payment(p, card)?.let { Option(Action.Build(id).encode(), card, it, immediateCoins(p, card)) }
            listOfNotNull(build, Option(Action.Sell(id).encode(), card, null, sellValue(p)))
        }
    }

    fun legalActions(state: GameState, seat: Int): List<Action> = options(state, seat).map { Action.parse(it.action) }

    // ---------- Turn flow ----------

    fun submit(state: GameState, seat: Int, action: Action): GameState {
        if (state.finished) throw IllegalActionException("Game is finished")
        if (seat !in state.players.indices) throw IllegalActionException("No seat $seat")
        if (seat in state.pending) throw IllegalActionException("Seat $seat already submitted an action for this pick")
        val p = state.player(seat)
        if (action.cardId !in p.hand) throw IllegalActionException("Card '${action.cardId}' is not in seat $seat's hand ${p.hand}")
        if (action is Action.Build) {
            val card = ruleset.card(action.cardId)
            if (card.id in p.built) throw IllegalActionException("Seat $seat already has '${card.id}' built")
            payment(p, card) ?: throw IllegalActionException("Seat $seat cannot afford '${card.id}'")
        }
        if (rules.isDuel(state.players.size)) {
            val d = action.discard ?: throw IllegalActionException("Duel: also discard one card, e.g. '${action.encode()},discard:<cardId>'")
            val rest = p.hand.toMutableList().apply { remove(action.cardId) }
            if (d !in rest) throw IllegalActionException("Discard '$d' is not another card in seat $seat's hand")
        } else if (action.discard != null) {
            throw IllegalActionException("Discarding is only used in the 2-player duel")
        }
        val next = state.copy(pending = state.pending + (seat to action))
        return if (next.pending.size == next.players.size) resolve(next) else next
    }

    private fun resolve(state: GameState): GameState {
        var discard = state.discard
        val log = mutableListOf<String>()
        val header = "S${state.sprint}P${state.pick}"
        val afterActions = state.players.map { p ->
            val action = state.pending.getValue(p.seat)
            val card = ruleset.card(action.cardId)
            val hand = p.hand.toMutableList().apply { remove(card.id); action.discard?.let { remove(it) } }
            action.discard?.let { discard = discard + it }
            when (action) {
                is Action.Build -> {
                    val pay = payment(p, card)!!
                    val gained = immediateCoins(p, card)
                    val how = when {
                        pay.free -> " for free via ${card.freeWith}"
                        pay.coins > 0 -> " paying ${pay.coins}💰" +
                            (if (pay.freelancers.isNotEmpty()) " (freelancers ${pay.freelancers.joinToString("") { it.icon }})" else "") +
                            (if (pay.agentTokens > 0) " (🤖 tokens x${pay.agentTokens})" else "")
                        else -> ""
                    }
                    log += "$header ${p.name} built ${card.name}$how" + if (gained > 0) ", +$gained💰" else ""
                    p.copy(
                        coins = p.coins - pay.coins + gained,
                        hand = hand,
                        built = p.built + card.id,
                        freelancersHired = p.freelancersHired + pay.freelancers.size,
                    )
                }
                is Action.Sell -> {
                    discard = discard + card.id
                    log += "$header ${p.name} sold a card, +${sellValue(p)}💰"
                    p.copy(coins = p.coins + sellValue(p), hand = hand, sold = p.sold + card.id)
                }
            }
        }
        var next = state.copy(players = afterActions, pending = emptyMap(), discard = discard, log = state.log + log)
        next = if (next.pick < rules.picksPerSprint) {
            passHands(next).copy(pick = next.pick + 1)
        } else {
            endSprint(next)
        }
        return next
    }

    /** Every hand moves to the next seat ("to the right"): seat i receives the hand of seat i-1 (reversed in even sprints if alternatePassing). */
    private fun passHands(state: GameState): GameState {
        val n = state.players.size
        val from = if (rules.alternatePassing && state.sprint % 2 == 0) 1 else n - 1
        return state.copy(players = state.players.mapIndexed { i, p -> p.copy(hand = state.players[(i + from) % n].hand) })
    }

    private fun endSprint(state: GameState): GameState {
        val leftovers = state.players.flatMap { it.hand }
        var cleared = state.copy(
            players = state.players.map { p ->
                val bonus = if (p.hand.isNotEmpty()) ruleset.startup(p.startup).leftoverCoins else 0
                p.copy(hand = emptyList(), coins = p.coins + bonus)
            },
            discard = state.discard + leftovers,
        )
        if (rules.catchUpCoins > 0 && state.sprint < rules.sprints) {
            val totals = scores(cleared).map { it.total }
            val min = totals.min()
            if (totals.any { it != min }) {
                val losers = totals.indices.filter { totals[it] == min }
                cleared = cleared.copy(
                    players = cleared.players.map { if (it.seat in losers) it.copy(coins = it.coins + rules.catchUpCoins) else it },
                    log = cleared.log + "Bridge round: ${losers.joinToString { cleared.player(it).name }} +${rules.catchUpCoins}💰",
                )
            }
        }
        return if (state.sprint >= rules.sprints) {
            val scores = scores(cleared)
            cleared.copy(finished = true, log = cleared.log + "--- Game over --- " +
                scores.sortedByDescending { it.total }.joinToString(", ") { "${state.player(it.seat).name}: ${it.total}⭐" })
        } else {
            deal(cleared.copy(sprint = state.sprint + 1, pick = 1))
        }
    }

    // ---------- Scoring ----------

    fun score(state: GameState, seat: Int): Score {
        val p = state.player(seat)
        val cards = p.built.map { ruleset.card(it) }
        fun sumOf(type: CardType) = cards.filter { it.type == type }.sumOf { it.points }
        val bonuses = cards.sumOf { c ->
            (c.special as? Special.PointsPer)?.let { s -> cards.count { it.type == s.type } * s.points } ?: 0
        }
        return Score(
            seat = seat,
            features = sumOf(CardType.FEATURE),
            libraries = sumOf(CardType.LIBRARY),
            business = sumOf(CardType.BUSINESS) + sumOf(CardType.TEAM),
            bonuses = bonuses,
            money = p.coins / coinsPerPoint(p),
            coins = p.coins,
        )
    }

    fun scores(state: GameState): List<Score> = state.players.indices.map { score(state, it) }

    /** Seats ordered by placement: most points, then most coins. Ties share the same rank (returned as rank per seat, 1 = best). */
    fun ranks(state: GameState): List<Int> {
        val s = scores(state)
        return s.map { me -> 1 + s.count { o -> o.total > me.total || (o.total == me.total && o.coins > me.coins) } }
    }

    /**
     * A plausible full game state consistent with what [seat] knows: other players' hands and all undealt cards are
     * reshuffled (within their sprint), and other seats' hidden submissions are dropped. Used by search-based AIs so they
     * never peek at hidden information.
     */
    fun determinize(state: GameState, seat: Int, rng: Random): GameState {
        val n = state.players.size
        val dealt = n * rules.handSize(n)
        val current = state.decks[state.sprint - 1]
        val othersPool = (state.players.filter { it.seat != seat }.flatMap { it.hand } + current.drop(dealt)).shuffled(rng)
        var idx = 0
        val players = state.players.map { p ->
            if (p.seat == seat) p else p.copy(hand = othersPool.subList(idx, idx + p.hand.size).also { idx += p.hand.size })
        }
        val decks = state.decks.mapIndexed { i, d -> if (i + 1 > state.sprint) d.shuffled(rng) else d }
        return state.copy(
            players = players,
            decks = decks,
            pending = state.pending.filterKeys { it == seat },
            log = emptyList(),
        )
    }

    fun view(state: GameState, seat: Int, logLines: Int = 12): PlayerView {
        val p = state.player(seat)
        return PlayerView(
            seat = seat,
            sprint = state.sprint,
            sprints = rules.sprints,
            pick = state.pick,
            picksPerSprint = rules.picksPerSprint,
            finished = state.finished,
            waitingForYou = !state.finished && seat !in state.pending,
            mustDiscard = rules.isDuel(state.players.size),
            startup = ruleset.startup(p.startup),
            coins = p.coins,
            production = production(p),
            freelancerPrice = freelancerPrice(p),
            built = p.built.map { ruleset.card(it) },
            hand = p.hand.map { ruleset.card(it) },
            options = options(state, seat),
            scoreSoFar = score(state, seat),
            opponents = state.players.filter { it.seat != seat }.map {
                OpponentView(it.seat, it.name, it.startup, it.coins, it.built, it.hand.size, score(state, it.seat).total)
            },
            recentLog = state.log.takeLast(logLines),
        )
    }
}
