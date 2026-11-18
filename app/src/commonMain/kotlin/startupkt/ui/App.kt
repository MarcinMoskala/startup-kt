package startupkt.ui

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicText
import androidx.compose.foundation.verticalScroll
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import startupkt.engine.*

@Composable
fun App() {
    val scope = rememberCoroutineScope()
    val controller = remember { GameController(scope) }
    var showRules by remember { mutableStateOf(false) }

    Box(Modifier.fillMaxSize().background(Palette.bg)) {
        if (!controller.inGame) {
            SetupScreen(controller, onRules = { showRules = true })
        } else {
            GameScreen(controller, onRules = { showRules = true })
            val s = controller.state
            if (s != null && s.finished) ResultOverlay(controller, s)
        }
        if (showRules) RulesOverlay(onClose = { showRules = false })
    }
}

// ============================== Setup ==============================

@Composable
fun SetupScreen(controller: GameController, onRules: () -> Unit) {
    Box(Modifier.fillMaxSize().verticalScroll(rememberScrollState()), contentAlignment = Alignment.TopCenter) {
        Column(
            Modifier.widthIn(max = 560.dp).fillMaxWidth().padding(horizontal = 16.dp, vertical = 28.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp),
        ) {
            Logo(big = true)
            BasicText(
                "Build a Kotlin startup: hire people and AI agents, ship features, collect GitHub stars. " +
                    "A 20-minute drafting card game.",
                style = Type.body.copy(color = Palette.muted),
            )
            Panel(title = "Players") {
                Segmented(listOf("2", "3", "4", "5"), controller.players - 2, { controller.players = it + 2 })
                BasicText(
                    if (controller.players == 2) "Duel: 8 cards each, every pick you also discard one card face down."
                    else "You play against ${controller.players - 1} bots.",
                    style = Type.muted,
                )
            }
            Panel(title = "Bot difficulty") {
                Segmented(Difficulty.entries.map { it.label }, controller.difficulty.ordinal, { controller.difficulty = Difficulty.entries[it] })
                BasicText(controller.difficulty.blurb, style = Type.muted)
            }
            Btn("Start game", onClick = { controller.newGame() }, modifier = Modifier.fillMaxWidth(), color = Palette.orange)
            Btn("How to play", onClick = onRules, modifier = Modifier.fillMaxWidth(), outlined = true)
            Panel(title = "In one minute") {
                RichText("• Pick one card each turn, then pass your hand to the next player.", Type.small)
                RichText("• Build it (pay its cost) or sell it for 3💰.", Type.small)
                RichText("• 👥 Team cards produce 📱 🖥 🤖 forever. Missing 📱/🖥? A freelancer costs 2💰.", Type.small)
                RichText("• 🤖 does 📱/🖥 work for 1💰 in tokens. 📚 Libraries make two features free.", Type.small)
                RichText("• Most ⭐ after 3 Sprints wins. Tip: build your team in Sprint I.", Type.small)
            }
        }
    }
}

@Composable
fun Logo(big: Boolean = false) {
    Row(verticalAlignment = Alignment.CenterVertically) {
        Box(
            Modifier.size(if (big) 40.dp else 28.dp).clip(RoundedCornerShape(8.dp)).background(Palette.kotlin),
            contentAlignment = Alignment.Center,
        ) { Icon(Glyph.STAR, if (big) 24.dp else 16.dp, tint = Color.White) }
        Spacer(Modifier.width(10.dp))
        BasicText("Startup", style = (if (big) Type.title else Type.h2))
        BasicText(".kt", style = (if (big) Type.title else Type.h2).copy(color = Palette.orange))
    }
}

// ============================== Game ==============================

data class BuildInfo(val option: Option?, val label: String, val color: Color, val sellGain: Int)

fun buildInfo(engine: Engine, state: GameState, seat: Int, card: Card): BuildInfo {
    val p = state.player(seat)
    val options = engine.options(state, seat)
    val build = options.firstOrNull { it.card.id == card.id && it.payment != null }
    val sell = options.firstOrNull { it.card.id == card.id && it.payment == null }?.gain ?: engine.sellValue(p)
    if (build != null) {
        val pay = build.payment!!
        val label = when {
            pay.free -> "FREE thanks to your library"
            pay.coins == 0 -> "Build for free"
            else -> buildString {
                append("Build: ${pay.coins}💰")
                val extras = buildList {
                    if (pay.freelancers.isNotEmpty()) add("hire " + pay.freelancers.joinToString("") { it.icon })
                    if (pay.agentTokens > 0) add("🤖 tokens")
                }
                if (extras.isNotEmpty()) append(" · " + extras.joinToString(", "))
            }
        }
        return BuildInfo(build, label, if (pay.free || pay.coins == 0) Palette.green else Palette.text, sell)
    }
    val reason = when {
        card.id in p.built -> "Already built"
        engine.cheapestPlan(engine.production(p), card.cost, engine.freelancerPrice(p)) == null -> "Needs a 🤖 Agent"
        else -> {
            val plan = engine.cheapestPlan(engine.production(p), card.cost, engine.freelancerPrice(p))!!
            "Needs ${engine.coinCost(p, card) + plan.coins}💰, you have ${p.coins}💰"
        }
    }
    return BuildInfo(null, reason, Palette.red, sell)
}

@Composable
fun GameScreen(controller: GameController, onRules: () -> Unit) {
    val state = controller.state ?: return
    val engine = controller.engine
    val me = controller.humanSeat
    var selected by remember { mutableStateOf<String?>(null) }
    var pendingMain by remember { mutableStateOf<Action?>(null) }
    var discard by remember { mutableStateOf<String?>(null) }
    val duel = engine.ruleset.rules.isDuel(state.players.size)
    val waiting = controller.waitingForHuman()

    // Reset the selection whenever a new pick starts.
    LaunchedEffect(state.sprint, state.pick, state.finished) { selected = null; pendingMain = null; discard = null }

    val hand = state.player(me).hand
    val selectedCard = selected?.let { engine.ruleset.card(it) }

    fun choose(action: Action) {
        if (duel) { pendingMain = action; discard = null } else { controller.submitHuman(action); selected = null }
    }

    BoxWithConstraints(Modifier.fillMaxSize()) {
        val wide = maxWidth >= 980.dp
        val compactHeader = maxWidth < 620.dp
        val pad = if (wide) 20.dp else 12.dp
        val handArea = if (wide) maxWidth * 0.62f - pad * 2 else maxWidth - pad * 2
        val perRow = when {
            handArea >= 900.dp -> 5
            handArea >= 700.dp -> 4
            handArea >= 520.dp -> 3
            else -> 2
        }
        val cardWidth: Dp = (handArea - 10.dp * (perRow - 1)) / perRow

        val handSection: @Composable () -> Unit = {
            HandSection(
                controller, state, hand, cardWidth, selected, pendingMain, discard, waiting, duel,
                onCardClick = { id ->
                    if (!waiting) return@HandSection
                    if (pendingMain != null) {
                        if (id != pendingMain!!.cardId || hand.count { it == id } > 1) discard = id
                    } else selected = if (selected == id) null else id
                },
            )
        }
        val actionBar: @Composable () -> Unit = {
            ActionBar(
                controller, state, selectedCard, pendingMain, discard, duel, waiting,
                onChoose = ::choose,
                onConfirmDuel = {
                    val main = pendingMain
                    val d = discard
                    if (main != null && d != null) { controller.submitHuman(main.withDiscard(d)); selected = null; pendingMain = null; discard = null }
                },
                onCancel = { pendingMain = null; discard = null },
            )
        }

        Column(Modifier.fillMaxSize()) {
            Header(controller, state, onRules, pad, compact = compactHeader)
            if (wide) {
                Row(Modifier.weight(1f).fillMaxWidth().padding(horizontal = pad), horizontalArrangement = Arrangement.spacedBy(16.dp)) {
                    Column(
                        Modifier.weight(0.62f).fillMaxHeight().verticalScroll(rememberScrollState()).padding(bottom = 20.dp),
                        verticalArrangement = Arrangement.spacedBy(12.dp),
                    ) {
                        handSection()
                        actionBar()
                        MyBoard(controller, state)
                    }
                    Column(
                        Modifier.weight(0.38f).fillMaxHeight().verticalScroll(rememberScrollState()).padding(bottom = 20.dp),
                        verticalArrangement = Arrangement.spacedBy(12.dp),
                    ) {
                        RevealPanel(controller)
                        Opponents(controller, state)
                    }
                }
            } else {
                Column(
                    Modifier.weight(1f).fillMaxWidth().verticalScroll(rememberScrollState()).padding(horizontal = pad).padding(bottom = 12.dp),
                    verticalArrangement = Arrangement.spacedBy(12.dp),
                ) {
                    RevealPanel(controller)
                    handSection()
                    MyBoard(controller, state)
                    Opponents(controller, state)
                }
                Box(Modifier.fillMaxWidth().background(Palette.surface).padding(horizontal = pad, vertical = 10.dp)) { actionBar() }
            }
        }
    }
}

@Composable
fun Header(controller: GameController, state: GameState, onRules: () -> Unit, pad: Dp, compact: Boolean = false) {
    val engine = controller.engine
    val me = state.player(controller.humanSeat)
    val score = engine.score(state, controller.humanSeat)
    val sprintLine = if (state.finished) "Game over" else "Sprint ${state.sprint}/3 · ${sprintName(state.sprint)}"
    val pickLine = if (state.finished) "" else "Pick ${state.pick} of ${engine.ruleset.rules.picksPerSprint}"
    Column(Modifier.fillMaxWidth().background(Palette.surface).padding(horizontal = pad, vertical = if (compact) 8.dp else 10.dp)) {
        Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(if (compact) 8.dp else 12.dp)) {
            Logo()
            if (!compact) {
                Column(Modifier.weight(1f)) {
                    BasicText(sprintLine, style = Type.h3, maxLines = 1)
                    if (pickLine.isNotEmpty()) BasicText(pickLine, style = Type.muted)
                }
            } else Spacer(Modifier.weight(1f))
            Amount(me.coins, Glyph.COIN, 16.sp)
            Amount(score.total, Glyph.STAR, 16.sp)
            Btn("Rules", onRules, outlined = true, small = true, color = Palette.muted)
            Btn("Quit", { controller.quit() }, outlined = true, small = true, color = Palette.muted)
        }
        if (compact) {
            Spacer(Modifier.height(4.dp))
            BasicText(if (pickLine.isEmpty()) sprintLine else "$sprintLine · $pickLine", style = Type.small.copy(color = Palette.muted), maxLines = 1)
        }
    }
}

@Composable
fun HandSection(
    controller: GameController, state: GameState, hand: List<String>, cardWidth: Dp,
    selected: String?, pendingMain: Action?, discard: String?, waiting: Boolean, duel: Boolean,
    onCardClick: (String) -> Unit,
) {
    val engine = controller.engine
    val me = state.player(controller.humanSeat)
    val title = when {
        !waiting -> "Your hand (waiting for the others)"
        pendingMain != null -> "Now pick a card to discard"
        else -> "Your hand: pick one card"
    }
    Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
        Row(verticalAlignment = Alignment.CenterVertically) {
            BasicText(title, style = Type.h2, modifier = Modifier.weight(1f))
            if (duel) BasicText("Duel", style = Type.small.copy(color = Palette.orange, fontWeight = FontWeight.Bold))
        }
        if (hand.isEmpty()) {
            BasicText("No cards: the next Sprint is being dealt.", style = Type.muted)
        }
        FlowRowCompat(spacing = 10.dp) {
            hand.forEachIndexed { index, id ->
                val card = engine.ruleset.card(id)
                val info = buildInfo(engine, state, controller.humanSeat, card)
                val mark = when {
                    pendingMain != null && id == discard -> Mark.DISCARD
                    id == selected -> Mark.SELECTED
                    else -> Mark.NONE
                }
                key(index, id) {
                    CardView(
                        card, engine.ruleset, cardWidth,
                        status = info.label,
                        statusColor = info.color,
                        freeWithOwned = card.freeWith != null && card.freeWith in me.built,
                        mark = mark,
                        dimmed = !waiting || (pendingMain != null && id == pendingMain.cardId && hand.count { it == id } == 1),
                        onClick = { onCardClick(id) },
                    )
                }
            }
        }
    }
}

@Composable
fun ActionBar(
    controller: GameController, state: GameState, card: Card?, pendingMain: Action?, discard: String?,
    duel: Boolean, waiting: Boolean,
    onChoose: (Action) -> Unit, onConfirmDuel: () -> Unit, onCancel: () -> Unit,
) {
    val engine = controller.engine
    when {
        state.finished -> {}
        !waiting -> WaitingLine(controller, state)
        pendingMain != null -> {
            val verb = if (pendingMain is Action.Build) "Build" else "Sell"
            val mainName = engine.ruleset.card(pendingMain.cardId).name
            Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                BasicText(
                    "$verb $mainName, then discard: " + (discard?.let { engine.ruleset.card(it).name } ?: "tap a card"),
                    style = Type.body,
                )
                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    Btn("Confirm", onConfirmDuel, Modifier.weight(1f), enabled = discard != null, color = Palette.orange)
                    Btn("Back", onCancel, outlined = true, color = Palette.muted)
                }
            }
        }
        card == null -> BasicText(
            if (duel) "Tap a card, choose Build or Sell, then pick a card to discard." else "Tap a card to build it or sell it.",
            style = Type.muted,
        )
        else -> {
            val info = buildInfo(engine, state, controller.humanSeat, card)
            Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                BasicText(card.name, style = Type.h3)
                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    Btn(
                        if (info.option != null) info.label else info.label,
                        { onChoose(Action.Build(card.id)) },
                        Modifier.weight(1.4f),
                        enabled = info.option != null,
                        color = Palette.kotlin,
                    )
                    Btn("Sell +${info.sellGain}💰", { onChoose(Action.Sell(card.id)) }, Modifier.weight(1f), color = Palette.orange)
                }
            }
        }
    }
}

@Composable
fun WaitingLine(controller: GameController, state: GameState) {
    val names = controller.thinking.map { state.player(it).name }
    BasicText(
        if (names.isEmpty()) "Revealing..." else "Waiting for ${names.joinToString(", ")} to pick...",
        style = Type.body.copy(color = Palette.kotlinLight),
    )
}

@Composable
fun RevealPanel(controller: GameController) {
    val r = controller.reveal ?: return
    Panel(title = "Last pick · Sprint ${r.sprint}, pick ${r.pick}") {
        r.lines.forEach { RichText(it, Type.small) }
    }
}

@Composable
fun MyBoard(controller: GameController, state: GameState) {
    val engine = controller.engine
    val me = state.player(controller.humanSeat)
    val startup = engine.ruleset.startup(me.startup)
    val score = engine.score(state, controller.humanSeat)
    Panel(title = "Your startup: ${startup.name}") {
        RichText(startup.ability, Type.small.copy(color = Palette.kotlinLight))
        Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(10.dp)) {
            BasicText("Production", style = Type.muted)
            ProductionRow(engine.production(me))
        }
        RichText(
            "Freelancer ${engine.freelancerPrice(me)}💰 · 🤖 token ${engine.ruleset.rules.agentTokenCost}💰 · coins worth 1⭐ per ${engine.coinsPerPoint(me)}💰",
            Type.muted,
        )
        ScoreLine(score)
        BuiltCards(engine, me.built)
    }
}

@Composable
fun ScoreLine(s: Score) {
    RichText(
        "${s.total}⭐ = features ${s.features} + libraries ${s.libraries} + business ${s.business} + bonuses ${s.bonuses} + money ${s.money}",
        Type.small,
    )
}

@Composable
fun BuiltCards(engine: Engine, built: List<String>) {
    if (built.isEmpty()) { BasicText("Nothing built yet.", style = Type.muted); return }
    FlowRowCompat(spacing = 6.dp) {
        built.map { engine.ruleset.card(it) }.sortedBy { it.type.ordinal }.forEach { MiniCard(it) }
    }
}

@Composable
fun Opponents(controller: GameController, state: GameState) {
    val engine = controller.engine
    state.players.filter { it.seat != controller.humanSeat }.forEach { p ->
        val score = engine.score(state, p.seat)
        val startup = engine.ruleset.startup(p.startup)
        Panel(
            title = "${p.name} · ${startup.name}",
            trailing = {
                Row(horizontalArrangement = Arrangement.spacedBy(10.dp), verticalAlignment = Alignment.CenterVertically) {
                    if (p.seat in controller.thinking) BasicText("thinking...", style = Type.muted.copy(color = Palette.kotlinLight))
                    Amount(p.coins, Glyph.COIN, 13.sp)
                    Amount(score.total, Glyph.STAR, 13.sp)
                }
            },
        ) {
            RichText(startup.ability, Type.muted)
            ProductionRow(engine.production(p), 15.dp)
            BuiltCards(engine, p.built)
        }
    }
}

// ============================== Results ==============================

@Composable
fun ResultOverlay(controller: GameController, state: GameState) {
    val engine = controller.engine
    val ranks = engine.ranks(state)
    val scores = engine.scores(state).sortedBy { ranks[it.seat] }
    val myRank = ranks[controller.humanSeat]
    Scrim {
        Column(
            Modifier.widthIn(max = 560.dp).fillMaxWidth().padding(16.dp)
                .clip(RoundedCornerShape(16.dp)).background(Palette.surface).border(1.dp, Palette.border, RoundedCornerShape(16.dp))
                .padding(18.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp),
        ) {
            BasicText(
                when (myRank) { 1 -> "You won! Your startup is a unicorn."; 2 -> "2nd place: a solid exit."; else -> "Place $myRank: time to pivot." },
                style = Type.h2.copy(fontSize = 22.sp),
            )
            scores.forEach { s ->
                val p = state.player(s.seat)
                Column(
                    Modifier.fillMaxWidth().clip(RoundedCornerShape(10.dp))
                        .background(if (s.seat == controller.humanSeat) Palette.kotlin.copy(alpha = 0.25f) else Palette.surface2)
                        .padding(10.dp),
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        BasicText("#${ranks[s.seat]}  ${p.name}", style = Type.h3, modifier = Modifier.weight(1f))
                        Amount(s.total, Glyph.STAR, 16.sp)
                    }
                    BasicText(engine.ruleset.startup(p.startup).name, style = Type.muted)
                    ScoreLine(s)
                }
            }
            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                Btn("Play again", { controller.newGame() }, Modifier.weight(1f), color = Palette.orange)
                Btn("Change setup", { controller.quit() }, outlined = true, color = Palette.muted)
            }
        }
    }
}

@Composable
fun Scrim(onDismiss: (() -> Unit)? = null, content: @Composable () -> Unit) {
    Box(
        Modifier.fillMaxSize().background(Color(0xCC0B0A10))
            .clickable(interactionSource = remember { MutableInteractionSource() }, indication = null) { onDismiss?.invoke() },
        contentAlignment = Alignment.Center,
    ) {
        Box(Modifier.clickable(interactionSource = remember { MutableInteractionSource() }, indication = null) {}) { content() }
    }
}

// ============================== Rules ==============================

@Composable
fun RulesOverlay(onClose: () -> Unit) {
    Scrim(onDismiss = onClose) {
        Column(
            Modifier.widthIn(max = 640.dp).fillMaxWidth().fillMaxHeight(0.9f).padding(12.dp)
                .clip(RoundedCornerShape(16.dp)).background(Palette.surface).border(1.dp, Palette.border, RoundedCornerShape(16.dp)),
        ) {
            Row(Modifier.fillMaxWidth().padding(16.dp), verticalAlignment = Alignment.CenterVertically) {
                BasicText("How to play", style = Type.h2, modifier = Modifier.weight(1f))
                Btn("Close", onClose, small = true, outlined = true, color = Palette.muted)
            }
            Column(
                Modifier.weight(1f).verticalScroll(rememberScrollState()).padding(horizontal = 16.dp).padding(bottom = 16.dp),
                verticalArrangement = Arrangement.spacedBy(10.dp),
            ) {
                RULES.forEach { (title, lines) ->
                    BasicText(title, style = Type.h3.copy(color = Palette.orange))
                    lines.forEach { RichText(it, Type.body) }
                }
            }
        }
    }
}

private val RULES: List<Pair<String, List<String>>> = listOf(
    "Goal" to listOf("Build a Kotlin startup and collect the most ⭐ GitHub Stars after 3 Sprints."),
    "Resources" to listOf(
        "📱 Frontend and 🖥 Backend come from people (👥 Team cards). 🤖 Agents fill 🤖 slots for free.",
        "A 🤖 can also do 📱 or 🖥 work: you pay 1💰 in tokens each time.",
        "Resources are never spent: your team works on every build.",
        "Missing 📱 or 🖥? Hire a freelancer for 2💰. You can't hire a 🤖.",
    ),
    "A pick" to listOf(
        "Everyone picks one card from their hand at the same time.",
        "Build it (pay its cost) or Sell it for 3💰.",
        "Then hands are passed to the next player. After 4 picks the last card is discarded and a new Sprint is dealt.",
    ),
    "Cards" to listOf(
        "👥 Team: produces 📱 🖥 🤖 for the rest of the game.",
        "⭐ Feature: costs resources, scores ⭐.",
        "📚 Library: scores 2⭐ and makes two features free for you.",
        "💼 Business: 💰 now, or ⭐ at the end for what you built.",
        "You can't build the same card twice.",
    ),
    "Scoring" to listOf("⭐ from cards and bonuses, plus 1⭐ per 3💰. On a tie, more 💰 wins."),
    "Startups" to listOf(
        "Each player starts with a startup: one resource, some 💰 and a small ability printed on it.",
    ),
    "Two players: the Duel" to listOf("You get 8 cards. Every pick you play one card and discard another face down, then pass."),
    "Tips" to listOf(
        "Sprint I: build your team, the ⭐ come later.",
        "Watch what your neighbour needs: selling a card also keeps it away from them.",
    ),
)
