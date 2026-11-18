package startupkt.cli

import kotlinx.serialization.Serializable
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json
import startupkt.bots.Bots
import startupkt.engine.*
import startupkt.sim.Simulator
import java.io.File
import kotlin.random.Random
import kotlin.system.exitProcess

/** Everything needed to continue a game from a file: content, bot seats and state. */
@Serializable
data class SavedGame(val ruleset: Ruleset, val seed: Long, val bots: Map<Int, String>, val state: GameState)

val json = Json { prettyPrint = true; encodeDefaults = true; ignoreUnknownKeys = true; classDiscriminator = "kind" }

private const val HELP = """Startup.kt — headless engine CLI

Commands:
  cards     [--def FILE] [--json]                 List cards in the ruleset
  export    [--def FILE]                          Print the full ruleset (rules+cards+startups) as JSON; edit it and pass with --def
  validate  --def FILE                            Check a ruleset file
  new       --state FILE --players N [--seed S] [--bots 1=greedy,2=balanced] [--def FILE]
            Seats not listed in --bots are controlled by you (the agent). Bots act automatically.
  view      --state FILE --seat N [--json]        Show what seat N sees and its legal actions
  act       --state FILE --seat N --action build:<cardId>|sell:<cardId> [--discard <cardId>] [--json]
            (2-player duel: every action also discards one other card from your hand)
            Submit an action; when all seats have acted the pick resolves. Prints the new view.
  status    --state FILE                          Sprint/pick, who still has to act, scores
  simulate  --games N --players N --bots a,b,c [--random-tables] [--threads T] [--seed S] [--def FILE] [--json]
            --random-tables: each game draws its bots at random from the --bots pool (strategy tournaments).
            Bot-vs-bot simulation with balance statistics. Bots: ${'$'}BOTS
"""

fun main(args: Array<String>) {
    if (args.isEmpty() || args[0] in setOf("help", "--help", "-h")) {
        println(HELP.replace("\$BOTS", Bots.all.keys.joinToString()))
        return
    }
    val opts = parseOpts(args.drop(1))
    try {
        when (args[0]) {
            "cards" -> cards(loadRuleset(opts["def"]), "json" in opts)
            "export" -> println(json.encodeToString(loadRuleset(opts["def"])))
            "validate" -> loadRuleset(opts.req("def")).validate().let { p -> println(if (p.isEmpty()) "OK" else p.joinToString("\n")); if (p.isNotEmpty()) exitProcess(1) }
            "new" -> newGame(opts)
            "view" -> withGame(opts) { g, e -> printView(e, g, opts.req("seat").toInt(), "json" in opts) }
            "act" -> act(opts)
            "status" -> withGame(opts) { g, e -> status(e, g) }
            "simulate" -> simulate(opts)
            else -> fail("Unknown command '${args[0]}'. Run 'help'.")
        }
    } catch (e: IllegalArgumentException) {
        fail(e.message ?: e.toString())
    } catch (e: IllegalStateException) {
        fail(e.message ?: e.toString())
    }
}

private fun fail(msg: String): Nothing {
    System.err.println("ERROR: $msg")
    exitProcess(1)
}

private fun parseOpts(rest: List<String>): Map<String, String> {
    val m = mutableMapOf<String, String>()
    var i = 0
    while (i < rest.size) {
        val k = rest[i]
        require(k.startsWith("--")) { "Expected --option, got '$k'" }
        val key = k.removePrefix("--")
        if (i + 1 < rest.size && !rest[i + 1].startsWith("--")) { m[key] = rest[i + 1]; i += 2 } else { m[key] = "true"; i++ }
    }
    return m
}

private fun Map<String, String>.req(key: String) = this[key] ?: throw IllegalArgumentException("Missing --$key")

private fun loadRuleset(path: String?): Ruleset =
    if (path == null) DefaultRuleset.ruleset else json.decodeFromString<Ruleset>(File(path).readText())

private fun withGame(opts: Map<String, String>, block: (SavedGame, Engine) -> Unit) {
    val file = File(opts.req("state"))
    require(file.exists()) { "State file ${file.path} does not exist. Create one with 'new'." }
    val g = json.decodeFromString<SavedGame>(file.readText())
    block(g, Engine(g.ruleset))
}

private fun save(path: String, g: SavedGame) = File(path).writeText(json.encodeToString(g))

/** Lets every bot seat that has not acted yet submit; repeats while picks resolve. */
private fun runBots(engine: Engine, g: SavedGame): SavedGame {
    var state = g.state
    var progressed = true
    while (progressed && !state.finished) {
        progressed = false
        for ((seat, name) in g.bots.toSortedMap()) {
            if (state.finished || seat in state.pending) continue
            val rng = Random(g.seed * 7919 + state.sprint * 1000 + state.pick * 10 + seat)
            val before = state.pick to state.sprint
            state = engine.submit(state, seat, Bots.create(name).choose(startupkt.bots.BotContext.of(engine, state, seat, rng)))
            if ((state.pick to state.sprint) != before || state.finished) progressed = true
        }
    }
    return g.copy(state = state)
}

private fun newGame(opts: Map<String, String>) {
    val ruleset = loadRuleset(opts["def"])
    val engine = Engine(ruleset)
    val players = opts.req("players").toInt()
    val seed = opts["seed"]?.toLong() ?: Random.nextLong(1, 1_000_000)
    val bots = opts["bots"]?.split(",")?.filter { it.isNotBlank() }?.associate {
        val (s, b) = it.split("=").also { p -> require(p.size == 2) { "Bot spec must be seat=bot, got '$it'" } }
        Bots.create(b); s.trim().toInt() to b.trim()
    } ?: emptyMap()
    require(bots.keys.all { it in 0 until players }) { "Bot seat out of range" }
    val names = (0 until players).map { bots[it]?.let { b -> "$b#$it" } ?: "agent#$it" }
    var g = SavedGame(ruleset, seed, bots, engine.newGame(players, seed, names))
    g = runBots(engine, g)
    save(opts.req("state"), g)
    val humans = (0 until players).filter { it !in bots }
    println("New game: $players players, seed $seed. Your seats: $humans. Bots: $bots")
    humans.firstOrNull()?.let { printView(engine, g, it, "json" in opts) }
}

private fun act(opts: Map<String, String>) = withGame(opts) { g0, engine ->
    val seat = opts.req("seat").toInt()
    require(seat !in g0.bots) { "Seat $seat is a bot" }
    val action = Action.parse(opts.req("action")).let { a -> opts["discard"]?.let { a.withDiscard(it) } ?: a }
    var g = g0.copy(state = engine.submit(g0.state, seat, action))
    g = runBots(engine, g)
    save(opts.req("state"), g)
    val waiting = g.state.players.indices.filter { it !in g.state.pending && it !in g.bots && !g.state.finished }
    if (seat in waiting || g.state.finished) printView(engine, g, seat, "json" in opts)
    else println("Submitted ${action.encode()}. Waiting for seats: $waiting")
}

private fun res(units: List<List<Res>>) = units.joinToString(" ") { u -> u.joinToString("/") { it.icon } }.ifEmpty { "-" }

private fun cardLine(c: Card, r: Ruleset? = null, withDescription: Boolean = false): String {
    val cost = buildList {
        if (c.costCoins > 0) add("${c.costCoins}💰")
        if (c.cost.isNotEmpty()) add(c.cost.joinToString("") { it.icon })
    }.joinToString(" ").ifEmpty { "free" }
    val effect = buildList {
        if (c.produces.isNotEmpty()) add("produces ${res(c.produces)}")
        if (c.points != 0) add("${c.points}⭐")
        if (c.coins != 0) add("+${c.coins}💰")
        when (val s = c.special) {
            is Special.CoinsPer -> add("+${s.coins}💰 per your ${s.type.icon}")
            is Special.PointsPer -> add("end: ${s.points}⭐ per your ${s.type.icon}")
            is Special.FreelancerPrice -> add("freelancers cost ${s.price}💰")
            is Special.CoinRate -> add("end: 1⭐ per ${s.coinsPerPoint}💰")
            null -> {}
        }
    }.joinToString(", ")
    val free = c.freeWith?.let { " [free with $it]" } ?: ""
    val unlocks = r?.cards?.filter { it.freeWith == c.id }?.takeIf { it.isNotEmpty() }?.let { u -> " | makes free: " + u.joinToString { it.id } } ?: ""
    val desc = if (withDescription && c.description.isNotEmpty()) "\n      \"${c.description}\"" else ""
    return "${c.type.icon} ${c.name} (${c.id}) | cost: $cost$free | $effect$unlocks$desc"
}

private fun cards(r: Ruleset, asJson: Boolean) {
    if (asJson) { println(json.encodeToString(r.cards)); return }
    for (s in 1..r.rules.sprints) {
        println("== Sprint $s ==")
        r.cards.filter { it.sprint == s }.forEach { println("  ${cardLine(it, r, withDescription = true)}  copies@${it.copies}") }
    }
    println("== Startups ==")
    r.startups.forEach {
        println("  ${it.name} (${it.id}) produces ${res(it.produces)}, starts with ${it.startCoins ?: r.rules.startCoins}💰. ${it.ability}")
        if (it.description.isNotEmpty()) println("      \"${it.description}\"")
    }
}

private fun printView(engine: Engine, g: SavedGame, seat: Int, asJson: Boolean) {
    val v = engine.view(g.state, seat)
    if (asJson) { println(json.encodeToString(v)); return }
    println(if (v.finished) "=== GAME OVER ===" else "=== Sprint ${v.sprint}/${v.sprints}, pick ${v.pick}/${v.picksPerSprint} — seat $seat (${v.startup.name}) ===")
    println("Coins: ${v.coins}💰  Production: ${res(v.production)}  Freelancer: ${v.freelancerPrice}💰  Score so far: ${v.scoreSoFar.total}⭐")
    if (v.startup.ability.isNotEmpty()) println("Startup ability: ${v.startup.ability}")
    println("Built: " + v.built.joinToString(", ") { it.id }.ifEmpty { "-" })
    v.opponents.forEach { o -> println("  seat ${o.seat} ${o.name} [${o.startup}] ${o.coins}💰 ${o.scoreSoFar}⭐ built: ${o.built.joinToString(",").ifEmpty { "-" }}") }
    if (v.finished) {
        val ranks = engine.ranks(g.state)
        engine.scores(g.state).sortedBy { ranks[it.seat] }.forEach {
            println("#${ranks[it.seat]} seat ${it.seat} ${g.state.player(it.seat).name}: ${it.total}⭐ (features ${it.features}, libs ${it.libraries}, business ${it.business}, bonuses ${it.bonuses}, money ${it.money}; ${it.coins}💰)")
        }
        return
    }
    println("Recent: " + v.recentLog.takeLast(g.state.players.size).joinToString(" | "))
    println("Hand:")
    v.hand.forEach { println("  ${cardLine(it, engine.ruleset)}") }
    if (!v.waitingForYou) { println("(already submitted, waiting for others)"); return }
    println("Legal actions:" + if (v.mustDiscard) " (DUEL: also discard another card: --discard <cardId> or append ',discard:<cardId>')" else "")
    v.options.forEach { o ->
        val pay = o.payment
        val note = when {
            pay == null -> "+${o.gain}💰"
            pay.free -> "FREE (chain)" + if (o.gain > 0) ", +${o.gain}💰" else ""
            else -> "pay ${pay.coins}💰" + (if (pay.freelancers.isNotEmpty()) " incl. freelancers ${pay.freelancers.joinToString("") { it.icon }}" else "") +
                (if (pay.agentTokens > 0) " incl. 🤖 tokens x${pay.agentTokens}" else "") + if (o.gain > 0) ", +${o.gain}💰" else ""
        }
        println("  ${o.action}  ($note)")
    }
}

private fun status(engine: Engine, g: SavedGame) {
    val s = g.state
    println(if (s.finished) "Finished" else "Sprint ${s.sprint}, pick ${s.pick}. Still to act: ${s.players.indices.filter { it !in s.pending }}")
    engine.scores(s).forEach { println("  seat ${it.seat} ${s.player(it.seat).name}: ${it.total}⭐, ${it.coins}💰") }
}

private fun simulate(opts: Map<String, String>) {
    val engine = Engine(loadRuleset(opts["def"]))
    val players = opts.req("players").toInt()
    val bots = (opts["bots"] ?: "balanced").split(",").map { it.trim() }.onEach { Bots.create(it) }
    val r = Simulator(engine).run(
        games = opts["games"]?.toInt() ?: 500,
        players = players,
        botPool = bots,
        seed = opts["seed"]?.toLong() ?: 1L,
        randomTables = "random-tables" in opts,
        threads = opts["threads"]?.toInt() ?: Runtime.getRuntime().availableProcessors(),
    )
    if ("json" in opts) { println(json.encodeToString(r)); return }
    fun d(x: Double) = "%.2f".format(java.util.Locale.ROOT, x)
    println("Games: ${r.games}, players: ${r.players}, bots: ${r.bots}${if (r.randomTables) " (random tables)" else " (rotated seats)"}, baseline win rate ${d(r.baselineWinRate)}")
    println("Avg winning score ${d(r.avgWinningScore)}, avg score ${d(r.avgScore)}, margin 1st-2nd ${d(r.avgMarginFirstToSecond)}, close games (≤2⭐) ${d(r.closeGamesPct)}%, spread 1st-last ${d(r.avgSpreadFirstToLast)}")
    r.tension.let { t ->
        println("Tension: P(win | leading after S1) ${d(t.winIfLeadingAfterSprint1)}, P(win | last after S1) ${d(t.winIfLastAfterSprint1)}, " +
            "P(win | leading before last sprint) ${d(t.winIfLeadingAfterSprint2)}, P(win | last before last sprint) ${d(t.winIfLastAfterSprint2)}, late lead change ${d(t.lateLeadChangePct)}%")
    }
    println("Avg points by source: " + r.avgComponents.entries.joinToString { "${it.key} ${d(it.value)}" })
    println("Avg cards built by type: " + r.avgBuiltByType.entries.joinToString { "${it.key} ${d(it.value)}" } + "; sells ${d(r.avgSells)}, freelancers ${d(r.avgFreelancers)}, free chain builds ${d(r.avgFreeBuilds)}")
    println("Seat win rate: " + r.seatWinRate.joinToString { d(it) })
    println("Startup win rate: " + r.startupWinRate.entries.joinToString { "${it.key} ${d(it.value)}" })
    println("Strategy archetypes (share of players → win rate): " + r.archetypes.entries.sortedByDescending { it.value.share }
        .joinToString { "${it.key} ${d(it.value.share * 100)}% → ${d(it.value.winRate)}" })
    println("Bots:")
    r.botStats.forEach { println("  ${it.bot.padEnd(10)} winRate ${d(it.winRate)}  winLift ${d(it.winLift)}  avgScore ${d(it.avgScore)}  avgRank ${d(it.avgRank)}  (${it.seats} seats)") }
    println("Cards (winLift = builders' win rate / baseline; built, sold):")
    r.cards.forEach { println("  ${d(it.winLift).padStart(5)}  ${it.id.padEnd(24)} S${it.sprint} ${it.type.icon}  built ${it.built}, sold ${it.sold}, avgScore ${d(it.avgScoreOfBuilders)}") }
}
