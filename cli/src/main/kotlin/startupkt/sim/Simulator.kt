package startupkt.sim

import kotlinx.serialization.Serializable
import startupkt.bots.BotContext
import startupkt.bots.Bots
import startupkt.engine.*
import java.util.concurrent.Executors
import java.util.concurrent.Future
import kotlin.random.Random

@Serializable
data class BotStats(
    val bot: String, val seats: Int, val wins: Double, val winRate: Double,
    /** winRate × players: 1.0 = average, 2.0 = wins twice as often as an average seat. */
    val winLift: Double,
    val avgScore: Double, val avgRank: Double,
)

@Serializable
data class CardStats(
    val id: String, val name: String, val type: CardType, val sprint: Int,
    val built: Int, val sold: Int,
    /** Win rate of players who built the card, divided by the baseline win rate (1/players). >1 = correlated with winning. */
    val winLift: Double,
    val avgScoreOfBuilders: Double,
)

/** "Is it still interesting till the end?" metrics. Probabilities are win probabilities (ties split). */
@Serializable
data class TensionStats(
    val winIfLeadingAfterSprint1: Double,
    val winIfLastAfterSprint1: Double,
    val winIfLeadingAfterSprint2: Double,
    val winIfLastAfterSprint2: Double,
    /** Share of games where the final winner was not leading after the second-to-last sprint. */
    val lateLeadChangePct: Double,
)

@Serializable
data class SimulationReport(
    val games: Int,
    val players: Int,
    val bots: List<String>,
    val randomTables: Boolean,
    val baselineWinRate: Double,
    val avgWinningScore: Double,
    val avgScore: Double,
    val avgMarginFirstToSecond: Double,
    val closeGamesPct: Double,
    val avgSpreadFirstToLast: Double,
    val tension: TensionStats,
    val avgComponents: Map<String, Double>,
    val avgBuiltByType: Map<String, Double>,
    val avgSells: Double,
    val avgFreelancers: Double,
    val avgFreeBuilds: Double,
    val startupWinRate: Map<String, Double>,
    val seatWinRate: List<Double>,
    val botStats: List<BotStats>,
    /** How players built their startup (classified from final tableau): share of players and their win rate. */
    val archetypes: Map<String, ArchetypeStats>,
    /** Completed roadmap stages at game end: share of players and their win rate. */
    val stages: Map<Int, ArchetypeStats> = emptyMap(),
    val avgStages: Double = 0.0,
    val cards: List<CardStats>,
)

@Serializable
data class ArchetypeStats(val share: Double, val winRate: Double)

/** Classifies a finished tableau into a coarse strategy archetype. */
fun archetypeOf(ruleset: Ruleset, p: PlayerState, freeBuilds: Int): String {
    val cards = p.built.map { ruleset.card(it) }
    val agents = (ruleset.startup(p.startup).produces + cards.flatMap { it.produces }).count { Res.AGENT in it }
    return when {
        cards.count { it.type == CardType.LIBRARY } >= 2 || freeBuilds >= 2 -> "libraries"
        agents >= 2 -> "ai"
        cards.count { it.type == CardType.BUSINESS } >= 3 -> "business"
        cards.count { it.type == CardType.TEAM } >= 3 -> "team"
        else -> "features"
    }
}

/** Result of one finished game plus score snapshots at the end of each sprint. */
class GameRecord(val seating: List<String>, val state: GameState, val sprintTotals: List<List<Int>>)

class Simulator(private val engine: Engine) {
    private val ruleset = engine.ruleset

    fun playGame(botNames: List<String>, seed: Long): GameRecord {
        val bots = botNames.map { Bots.create(it) }
        val rng = Random(seed * 31 + 7)
        var state = engine.newGame(botNames.size, seed, botNames.mapIndexed { i, b -> "$b#$i" })
        val snapshots = mutableListOf<List<Int>>()
        while (!state.finished) {
            val sprint = state.sprint
            for (seat in state.players.indices) {
                state = engine.submit(state, seat, bots[seat].choose(BotContext.of(engine, state, seat, rng)))
            }
            if (state.finished || state.sprint != sprint) {
                snapshots += engine.scores(state).map { it.total }
            }
        }
        return GameRecord(botNames, state, snapshots)
    }

    /**
     * Runs [games] games. With [randomTables] = false the bot mix is fixed and rotated across seats each game;
     * with true every table draws its bots at random from [botPool] (without replacement when the pool is big enough).
     */
    fun run(games: Int, players: Int, botPool: List<String>, seed: Long, randomTables: Boolean = false, threads: Int = 1): SimulationReport {
        val fixed = (0 until players).map { botPool[it % botPool.size] }
        val seatings = (0 until games).map { g ->
            if (!randomTables) (0 until players).map { fixed[(it + g) % players] }
            else {
                val r = Random(seed * 1_000_003 + g)
                if (botPool.size >= players) botPool.shuffled(r).take(players) else List(players) { botPool.random(r) }
            }
        }
        val records: List<GameRecord> = if (threads <= 1) {
            seatings.mapIndexed { g, s -> playGame(s, seed + g) }
        } else {
            val pool = Executors.newFixedThreadPool(threads)
            try {
                val futures: List<Future<GameRecord>> = seatings.mapIndexed { g, s -> pool.submit<GameRecord> { playGame(s, seed + g) } }
                futures.map { it.get() }
            } finally {
                pool.shutdown()
            }
        }
        return report(records, players, if (randomTables) botPool else fixed, randomTables)
    }

    private fun winShares(totals: List<Int>, coins: List<Int>): List<Double> {
        val best = totals.indices.filter { i -> totals.indices.none { j -> totals[j] > totals[i] || (totals[j] == totals[i] && coins[j] > coins[i]) } }
        return totals.indices.map { if (it in best) 1.0 / best.size else 0.0 }
    }

    private fun report(records: List<GameRecord>, players: Int, bots: List<String>, randomTables: Boolean): SimulationReport {
        val botAcc = mutableMapOf<String, DoubleArray>() // seats, wins, scoreSum, rankSum
        val cardBuilt = mutableMapOf<String, Int>()
        val cardSold = mutableMapOf<String, Int>()
        val cardWins = mutableMapOf<String, Double>()
        val cardScore = mutableMapOf<String, Double>()
        val startupAcc = mutableMapOf<String, DoubleArray>()
        val archAcc = mutableMapOf<String, DoubleArray>()
        val stageAcc = sortedMapOf<Int, DoubleArray>()
        var stageSum = 0.0
        val seatWins = DoubleArray(players)
        val comps = mutableMapOf<String, Double>()
        val byType = mutableMapOf<String, Double>()
        var winSum = 0.0; var scoreSum = 0.0; var marginSum = 0.0; var close = 0; var spread = 0.0
        var sells = 0.0; var freelancers = 0.0; var freeBuilds = 0.0
        val tension = DoubleArray(8) // [lead1 wins, lead1 n, last1 wins, last1 n, lead2 wins, lead2 n, last2 wins, last2 n]
        var lateChange = 0.0
        val sprints = ruleset.rules.sprints

        for (rec in records) {
            val state = rec.state
            val scores = engine.scores(state)
            val ranks = engine.ranks(state)
            val wins = winShares(scores.map { it.total }, scores.map { it.coins })
            val totals = scores.map { it.total }.sortedDescending()
            winSum += totals.first(); scoreSum += totals.sum()
            if (totals.size > 1) {
                marginSum += totals[0] - totals[1]
                if (totals[0] - totals[1] <= 2) close++
            }
            spread += totals.first() - totals.last()
            fun track(snapshot: List<Int>, base: Int) {
                val max = snapshot.max(); val min = snapshot.min()
                if (max == min) return
                snapshot.indices.forEach { i ->
                    if (snapshot[i] == max) { tension[base] += wins[i]; tension[base + 1]++ }
                    if (snapshot[i] == min) { tension[base + 2] += wins[i]; tension[base + 3]++ }
                }
            }
            rec.sprintTotals.getOrNull(0)?.let { track(it, 0) }
            rec.sprintTotals.getOrNull(sprints - 2)?.let { snap ->
                track(snap, 4)
                val leaders = snap.indices.filter { snap[it] == snap.max() }
                lateChange += 1.0 - leaders.sumOf { wins[it] }
            }
            state.players.forEach { p ->
                val s = scores[p.seat]
                val win = wins[p.seat]
                val free = state.log.count { it.contains(" ${p.name} built ") && "for free via" in it }
                archAcc.getOrPut(archetypeOf(ruleset, p, free)) { DoubleArray(2) }.let { it[0]++; it[1] += win }
                botAcc.getOrPut(rec.seating[p.seat]) { DoubleArray(4) }.let { it[0]++; it[1] += win; it[2] += s.total; it[3] += ranks[p.seat] }
                startupAcc.getOrPut(p.startup) { DoubleArray(2) }.let { it[0]++; it[1] += win }
                stageAcc.getOrPut(p.stagesDone) { DoubleArray(2) }.let { it[0]++; it[1] += win }
                stageSum += p.stagesDone
                comps.merge("roadmap", s.roadmap.toDouble(), Double::plus)
                seatWins[p.seat] += win
                comps.merge("features", s.features.toDouble(), Double::plus)
                comps.merge("libraries", s.libraries.toDouble(), Double::plus)
                comps.merge("business", s.business.toDouble(), Double::plus)
                comps.merge("bonuses", s.bonuses.toDouble(), Double::plus)
                comps.merge("money", s.money.toDouble(), Double::plus)
                comps.merge("coinsLeft", s.coins.toDouble(), Double::plus)
                p.built.forEach { id ->
                    cardBuilt.merge(id, 1, Int::plus)
                    cardWins.merge(id, win, Double::plus)
                    cardScore.merge(id, s.total.toDouble(), Double::plus)
                    byType.merge(ruleset.card(id).type.name, 1.0, Double::plus)
                }
                p.sold.forEach { cardSold.merge(it, 1, Int::plus) }
                sells += p.sold.size
                freelancers += p.freelancersHired
            }
            freeBuilds += state.log.count { "for free via" in it }
        }
        val games = records.size
        val pg = (games * players).toDouble()
        val baseline = 1.0 / players
        fun ratio(w: Double, n: Double) = if (n == 0.0) 0.0 else w / n
        return SimulationReport(
            games = games,
            players = players,
            bots = bots,
            randomTables = randomTables,
            baselineWinRate = baseline,
            avgWinningScore = winSum / games,
            avgScore = scoreSum / pg,
            avgMarginFirstToSecond = marginSum / games,
            closeGamesPct = 100.0 * close / games,
            avgSpreadFirstToLast = spread / games,
            tension = TensionStats(
                ratio(tension[0], tension[1]), ratio(tension[2], tension[3]),
                ratio(tension[4], tension[5]), ratio(tension[6], tension[7]),
                100.0 * lateChange / games,
            ),
            avgComponents = comps.mapValues { it.value / pg },
            avgBuiltByType = byType.mapValues { it.value / pg },
            avgSells = sells / pg,
            avgFreelancers = freelancers / pg,
            avgFreeBuilds = freeBuilds / pg,
            startupWinRate = startupAcc.mapValues { it.value[1] / it.value[0] },
            seatWinRate = seatWins.map { it / games },
            botStats = botAcc.map { (b, a) -> BotStats(b, a[0].toInt(), a[1], a[1] / a[0], a[1] / a[0] * players, a[2] / a[0], a[3] / a[0]) }
                .sortedByDescending { it.winRate },
            archetypes = archAcc.mapValues { (_, a) -> ArchetypeStats(a[0] / pg, a[1] / a[0]) },
            stages = stageAcc.mapValues { (_, a) -> ArchetypeStats(a[0] / pg, a[1] / a[0]) },
            avgStages = stageSum / pg,
            cards = ruleset.cards.filter { cardBuilt.containsKey(it.id) || cardSold.containsKey(it.id) }.map { c ->
                val b = cardBuilt[c.id] ?: 0
                CardStats(
                    c.id, c.name, c.type, c.sprint, b, cardSold[c.id] ?: 0,
                    winLift = if (b == 0) 0.0 else (cardWins.getValue(c.id) / b) / baseline,
                    avgScoreOfBuilders = if (b == 0) 0.0 else cardScore.getValue(c.id) / b,
                )
            }.sortedByDescending { it.winLift },
        )
    }
}
