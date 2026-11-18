package startupkt.ui

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicText
import androidx.compose.foundation.verticalScroll
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.input.pointer.PointerIcon
import androidx.compose.ui.input.pointer.pointerHoverIcon
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import startupkt.engine.*

@Composable
fun App() {
    LoadFonts()
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
            Modifier.widthIn(max = 560.dp).fillMaxWidth().padding(horizontal = 16.dp, vertical = 32.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp),
        ) {
            Logo(big = true)
            BasicText("// sprint planning for your Kotlin startup", style = Type.label.copy(fontSize = 13.sp))
            BasicText(
                "Hire people and AI agents, ship features, collect GitHub stars. A 20-minute drafting card game.",
                style = Type.body.copy(color = Palette.muted),
            )
            Panel(label = "PLAYERS") {
                Segmented(listOf("2", "3", "4", "5"), controller.players - 2, { controller.players = it + 2 })
                BasicText(
                    if (controller.players == 2) "Duel: 8 cards each, every pick you also discard one card face down."
                    else "You play against ${controller.players - 1} bots.",
                    style = Type.muted,
                )
            }
            Panel(label = "BOT DIFFICULTY") {
                Segmented(Difficulty.entries.map { it.label }, controller.difficulty.ordinal, { controller.difficulty = Difficulty.entries[it] })
                BasicText(controller.difficulty.blurb, style = Type.muted)
            }
            Btn("Start game", onClick = { controller.newGame() }, modifier = Modifier.fillMaxWidth(), color = Palette.orange)
            Btn("How to play", onClick = onRules, modifier = Modifier.fillMaxWidth(), outlined = true, color = Palette.muted)
            Panel(label = "IN ONE MINUTE") {
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
        val style = if (big) Type.title.copy(fontSize = 32.sp) else Type.title.copy(fontSize = 22.sp)
        BasicText("Startup", style = style)
        BasicText(".kt", style = style.copy(color = Palette.orange))
    }
}

// ============================== Game logic helpers ==============================

data class BuildInfo(
    val option: Option?,
    /** Short footer for the card in hand. */
    val label: String,
    /** Longer explanation for the action bar. */
    val explain: String,
    val buttonLabel: String,
    val color: Color,
    val sellGain: Int,
)

fun buildInfo(engine: Engine, state: GameState, seat: Int, card: Card): BuildInfo {
    val p = state.player(seat)
    val options = engine.options(state, seat)
    val build = options.firstOrNull { it.card.id == card.id && it.payment != null }
    val sell = options.firstOrNull { it.card.id == card.id && it.payment == null }?.gain ?: engine.sellValue(p)
    if (build != null) {
        val pay = build.payment!!
        if (pay.free) {
            val lib = card.freeWith?.let { engine.ruleset.cardsById[it]?.name } ?: "your library"
            return BuildInfo(build, "▸ FREE", "Free: you have $lib", "Build · free", Palette.green, sell)
        }
        if (pay.coins == 0) {
            return BuildInfo(build, "▸ free to build", "Your team covers the whole cost", "Build · free", Palette.green, sell)
        }
        val parts = buildList {
            val c = engine.coinCost(p, card)
            if (c > 0) add("card ${c}💰")
            if (pay.freelancers.isNotEmpty()) add("freelancer ${pay.freelancers.joinToString("") { it.icon }} ${pay.freelancers.size * engine.freelancerPrice(p)}💰")
            if (pay.agentTokens > 0) add("🤖 tokens ${pay.agentTokens * engine.ruleset.rules.agentTokenCost}💰")
        }
        return BuildInfo(
            build, "▸ build for ${pay.coins}💰", "Pay ${pay.coins}💰 = " + parts.joinToString(" + "),
            "Build · ${pay.coins}💰", Palette.text, sell,
        )
    }
    val reason = when {
        card.id in p.built -> "Already built"
        engine.cheapestPlan(engine.production(p), card.cost, engine.freelancerPrice(p)) == null -> "Needs a 🤖 Agent on your team"
        else -> {
            val plan = engine.cheapestPlan(engine.production(p), card.cost, engine.freelancerPrice(p))!!
            "Needs ${engine.coinCost(p, card) + plan.coins}💰, you have ${p.coins}💰"
        }
    }
    val short = when {
        card.id in p.built -> "✕ already built"
        reason.startsWith("Needs a") -> "✕ needs 🤖"
        else -> "✕ too expensive"
    }
    return BuildInfo(null, short, reason, "Can't build", Palette.red, sell)
}

/** Seats in passing order, ending with you: e.g. Ada → Linus → Grace → You. */
fun tableOrder(state: GameState, me: Int, reversed: Boolean): List<Int> {
    val n = state.players.size
    val step = if (reversed) n - 1 else 1
    return (1..n).map { (me + it * step) % n }
}

fun passesReversed(engine: Engine, state: GameState) = engine.ruleset.rules.alternatePassing && state.sprint % 2 == 0

/** "built Ktor" for a seat, taken from the last revealed pick. */
fun lastActionOf(controller: GameController, name: String): String? =
    controller.reveal?.lines?.firstOrNull { it.startsWith("$name ") }?.removePrefix("$name ")

// ============================== Game screen ==============================

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

    val onCardClick: (String) -> Unit = { id ->
        if (waiting) {
            if (pendingMain != null) {
                if (id != pendingMain!!.cardId || hand.count { it == id } > 1) discard = id
            } else selected = if (selected == id) null else id
        }
    }
    val actionBar: @Composable (Boolean) -> Unit = { stacked ->
        ActionBar(
            controller, state, selectedCard, pendingMain, discard, duel, waiting, stacked,
            onChoose = ::choose,
            onConfirmDuel = {
                val main = pendingMain
                val d = discard
                if (main != null && d != null) { controller.submitHuman(main.withDiscard(d)); selected = null; pendingMain = null; discard = null }
            },
            onCancel = { pendingMain = null; discard = null },
        )
    }

    BoxWithConstraints(Modifier.fillMaxSize()) {
        val mobile = maxWidth < 720.dp
        if (mobile) {
            MobileTable(controller, state, hand, selected, pendingMain, discard, waiting, duel, onRules, onCardClick, actionBar)
        } else {
            DesktopTable(controller, state, hand, selected, pendingMain, discard, waiting, duel, onRules, onCardClick, actionBar, maxWidth)
        }
    }
}

@Composable
private fun DesktopTable(
    controller: GameController, state: GameState, hand: List<String>,
    selected: String?, pendingMain: Action?, discard: String?, waiting: Boolean, duel: Boolean,
    onRules: () -> Unit, onCardClick: (String) -> Unit, actionBar: @Composable (Boolean) -> Unit, width: Dp,
) {
    val pad = if (width >= 1100.dp) 28.dp else 18.dp
    val inner = width - pad * 2
    val wide = width >= 1100.dp
    Column(Modifier.fillMaxSize()) {
        Column(
            Modifier.weight(1f).fillMaxWidth().verticalScroll(rememberScrollState()).padding(horizontal = pad, vertical = 20.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp),
        ) {
            TopBar(controller, state, onRules, compact = false)
            PlayerStrip(controller, state)
            OpponentBoards(controller, state, inner)
            if (wide) {
                val companyW = 380.dp
                Row(horizontalArrangement = Arrangement.spacedBy(18.dp)) {
                    CompanyPanel(controller, state, Modifier.width(companyW))
                    Column(Modifier.weight(1f), verticalArrangement = Arrangement.spacedBy(12.dp)) {
                        HandHeader(controller, state, waiting, pendingMain, duel)
                        HandGrid(controller, state, hand, inner - companyW - 18.dp, selected, pendingMain, discard, waiting, onCardClick)
                    }
                }
            } else {
                HandHeader(controller, state, waiting, pendingMain, duel)
                HandGrid(controller, state, hand, inner, selected, pendingMain, discard, waiting, onCardClick)
                CompanyPanel(controller, state, Modifier.fillMaxWidth())
            }
        }
        Box(
            Modifier.fillMaxWidth().background(Palette.surface).border(1.dp, Palette.border)
                .padding(horizontal = pad, vertical = 12.dp),
        ) { actionBar(false) }
    }
}

@Composable
private fun MobileTable(
    controller: GameController, state: GameState, hand: List<String>,
    selected: String?, pendingMain: Action?, discard: String?, waiting: Boolean, duel: Boolean,
    onRules: () -> Unit, onCardClick: (String) -> Unit, actionBar: @Composable (Boolean) -> Unit,
) {
    val engine = controller.engine
    var tab by remember { mutableStateOf(controller.humanSeat) }
    Column(Modifier.fillMaxSize()) {
        Column(
            Modifier.weight(1f).fillMaxWidth().verticalScroll(rememberScrollState()).padding(vertical = 12.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp),
        ) {
            Box(Modifier.padding(horizontal = 14.dp)) { TopBar(controller, state, onRules, compact = true) }
            Row(
                Modifier.horizontalScroll(rememberScrollState()).padding(horizontal = 14.dp),
                horizontalArrangement = Arrangement.spacedBy(6.dp),
                verticalAlignment = Alignment.CenterVertically,
            ) {
                PlayerBadges(controller, state, compact = true) { Modifier.width(128.dp) }
            }
            controller.reveal?.let { r ->
                RichText(
                    "// last pick: " + r.lines.joinToString(" · "),
                    Type.label.copy(fontSize = 10.sp, color = Palette.faint),
                    Modifier.padding(horizontal = 14.dp), maxLines = 2,
                )
            }
            Box(Modifier.padding(horizontal = 14.dp)) { HandHeader(controller, state, waiting, pendingMain, duel, compact = true) }
            Row(
                Modifier.horizontalScroll(rememberScrollState()).padding(horizontal = 14.dp),
                horizontalArrangement = Arrangement.spacedBy(10.dp),
            ) {
                HandCards(controller, state, hand, 150.dp, 236.dp, selected, pendingMain, discard, waiting, onCardClick)
            }
            if (hand.isEmpty()) BasicText("// dealing the next Sprint...", Modifier.padding(horizontal = 14.dp), style = Type.label)
            // Company tabs
            val order = listOf(controller.humanSeat) + tableOrder(state, controller.humanSeat, passesReversed(engine, state)).filter { it != controller.humanSeat }
            Row(
                Modifier.horizontalScroll(rememberScrollState()).padding(horizontal = 14.dp),
                horizontalArrangement = Arrangement.spacedBy(6.dp),
            ) {
                order.forEach { seat ->
                    val sel = seat == tab
                    val name = state.player(seat).name
                    Box(
                        Modifier.clip(RoundedCornerShape(50))
                            .background(if (sel) (if (seat == controller.humanSeat) Palette.orange else Palette.kotlin) else Palette.surface)
                            .border(1.dp, if (sel) Color.Transparent else Palette.border, RoundedCornerShape(50))
                            .clickable { tab = seat }.pointerHoverIcon(PointerIcon.Hand)
                            .padding(horizontal = 14.dp, vertical = 7.dp),
                    ) { BasicText(name, style = Type.mono.copy(fontSize = 13.sp, fontWeight = FontWeight.Bold, color = if (sel) Color.White else Palette.muted)) }
                }
            }
            Box(Modifier.padding(horizontal = 14.dp)) {
                if (tab == controller.humanSeat) CompanyPanel(controller, state, Modifier.fillMaxWidth())
                else OpponentBoard(controller, state, tab, Modifier.fillMaxWidth(), showAbility = true)
            }
        }
        Box(
            Modifier.fillMaxWidth().background(Palette.surface)
                .border(1.dp, Palette.border)
                .padding(horizontal = 14.dp, vertical = 10.dp),
        ) { actionBar(true) }
    }
}

// ============================== Pieces ==============================

@Composable
fun TopBar(controller: GameController, state: GameState, onRules: () -> Unit, compact: Boolean) {
    if (compact) {
        Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Logo()
                Spacer(Modifier.weight(1f))
                Btn("Rules", onRules, outlined = true, small = true, color = Palette.muted)
                Spacer(Modifier.width(6.dp))
                Btn("Quit", { controller.quit() }, outlined = true, small = true, color = Palette.muted)
            }
            SprintPill(controller, state)
        }
    } else {
        Row(verticalAlignment = Alignment.CenterVertically) {
            Logo()
            Spacer(Modifier.width(18.dp))
            BasicText("// sprint planning for your Kotlin startup", Modifier.weight(1f), style = Type.label.copy(fontSize = 12.sp), maxLines = 1, overflow = TextOverflow.Ellipsis)
            SprintPill(controller, state)
            Spacer(Modifier.width(14.dp))
            Btn("Rules", onRules, outlined = true, small = true, color = Palette.muted)
            Spacer(Modifier.width(8.dp))
            Btn("Quit", { controller.quit() }, outlined = true, small = true, color = Palette.muted)
        }
    }
}

@Composable
fun SprintPill(controller: GameController, state: GameState) {
    val picks = controller.engine.ruleset.rules.picksPerSprint
    Row(
        Modifier.clip(RoundedCornerShape(50)).background(Palette.surface).border(1.dp, Palette.border, RoundedCornerShape(50))
            .padding(horizontal = 14.dp, vertical = 7.dp),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        val text = if (state.finished) "GAME OVER" else "SPRINT ${roman(state.sprint)} · ${sprintName(state.sprint).uppercase()}"
        BasicText(text, style = Type.label.copy(color = Palette.text, fontSize = 12.sp))
        if (!state.finished) {
            Spacer(Modifier.width(10.dp))
            for (i in 1..picks) {
                Box(
                    Modifier.padding(horizontal = 2.5.dp).size(7.dp).clip(CircleShape)
                        .background(if (i <= state.pick) Palette.orange else Palette.surface2)
                )
            }
        }
    }
}

@Composable
private fun PlayerBadges(controller: GameController, state: GameState, compact: Boolean, modifierFor: @Composable RowScope.(Int) -> Modifier) {
    val engine = controller.engine
    val me = controller.humanSeat
    val reversed = passesReversed(engine, state)
    val order = tableOrder(state, me, reversed)
    Row(verticalAlignment = Alignment.CenterVertically) {
        order.forEachIndexed { i, seat ->
            if (i > 0) BasicText(if (compact) "›" else "→", Modifier.padding(horizontal = if (compact) 2.dp else 8.dp), style = Type.h2.copy(color = Palette.faint, fontSize = if (compact) 14.sp else 16.sp))
            val p = state.player(seat)
            val (status, color) = when {
                state.finished -> null to Palette.muted
                seat in controller.thinking -> "thinking…" to Palette.kotlinLight
                seat == me && controller.waitingForHuman() -> "your pick" to Palette.orange
                seat in state.pending -> "ready" to Palette.green
                else -> null to Palette.muted
            }
            PlayerBadge(
                name = p.name, seat = seat, startup = engine.ruleset.startup(p.startup).name,
                stars = engine.score(state, seat).total, coins = p.coins, production = engine.production(p),
                status = status, statusColor = color, isYou = seat == me,
                lastAction = lastActionOf(controller, p.name),
                modifier = modifierFor(seat), compact = compact,
            )
        }
    }
}

@Composable
fun PlayerStrip(controller: GameController, state: GameState) {
    PlayerBadges(controller, state, compact = false) { Modifier.weight(1f) }
}

@Composable
fun OpponentBoards(controller: GameController, state: GameState, width: Dp) {
    val me = controller.humanSeat
    val opponents = tableOrder(state, me, passesReversed(controller.engine, state)).filter { it != me }
    val gap = 14.dp
    val perRow = maxOf(1, minOf(opponents.size, ((width + gap) / (300.dp + gap)).toInt()))
    val w = (width - gap * (perRow - 1)) / perRow
    FlowRowCompat(spacing = gap) {
        opponents.forEach { OpponentBoard(controller, state, it, Modifier.width(w)) }
    }
}

@Composable
fun OpponentBoard(controller: GameController, state: GameState, seat: Int, modifier: Modifier, showAbility: Boolean = false) {
    val engine = controller.engine
    val p = state.player(seat)
    val startup = engine.ruleset.startup(p.startup)
    val last = lastActionOf(controller, p.name)
    val newest = if (last?.startsWith("built") == true) p.built.lastOrNull() else null
    Panel(modifier, label = "${p.name.uppercase()} · ${startup.name}") {
        if (showAbility) {
            RichText(startup.ability, Type.muted)
            Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                Amount(engine.score(state, seat).total, Glyph.STAR, 14.sp, iconFirst = true)
                Amount(p.coins, Glyph.COIN, 14.sp, iconFirst = true)
                ProductionRow(engine.production(p), 15.dp)
            }
        }
        Tableau(engine, p.built, newest)
    }
}

@Composable
fun CompanyPanel(controller: GameController, state: GameState, modifier: Modifier) {
    val engine = controller.engine
    val me = state.player(controller.humanSeat)
    val startup = engine.ruleset.startup(me.startup)
    val score = engine.score(state, controller.humanSeat)
    val last = lastActionOf(controller, me.name)
    val newest = if (last?.startsWith("built") == true) me.built.lastOrNull() else null
    Panel(modifier, label = "YOUR COMPANY", accent = Palette.orange, padding = 16.dp) {
        BasicText(startup.name, style = Type.h2.copy(fontSize = 21.sp))
        RichText(startup.ability, Type.small.copy(color = Palette.muted, lineHeight = 17.sp))
        Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            BasicText("Produces", style = Type.small.copy(color = Palette.muted, fontWeight = FontWeight.SemiBold))
            ProductionRow(engine.production(me), 17.dp)
        }
        RichText(
            "freelancer ${engine.freelancerPrice(me)}💰 · 🤖 token ${engine.ruleset.rules.agentTokenCost}💰 · 1⭐ per ${engine.coinsPerPoint(me)}💰",
            Type.label.copy(fontSize = 11.sp),
        )
        Spacer(Modifier.height(2.dp))
        Tableau(engine, me.built, newest, empty = "// build your team first: 👥 cards produce forever")
        Spacer(Modifier.height(2.dp))
        ScoreLine(score)
    }
}

@Composable
fun ScoreLine(s: Score) {
    RichText(
        "${s.total}⭐ = features ${s.features} + libs ${s.libraries} + business ${s.business} + bonus ${s.bonuses} + 💰 ${s.money}",
        Type.label.copy(fontSize = 11.sp, color = Palette.muted),
    )
}

@Composable
fun HandHeader(controller: GameController, state: GameState, waiting: Boolean, pendingMain: Action?, duel: Boolean, compact: Boolean = false) {
    val engine = controller.engine
    val n = state.players.size
    val me = controller.humanSeat
    val to = state.player(if (passesReversed(engine, state)) (me + n - 1) % n else (me + 1) % n).name
    val title = when {
        state.finished -> "Game over"
        !waiting -> if (compact) "Waiting..." else "Your hand — waiting for the others"
        pendingMain != null -> "Now pick a card to discard"
        else -> if (compact) "Pick one card" else "Your hand — pick one card"
    }
    Row(verticalAlignment = Alignment.CenterVertically) {
        BasicText(title, Modifier.weight(1f), style = Type.h2, maxLines = 2)
        Spacer(Modifier.width(8.dp))
        BasicText(
            (if (duel) "duel · " else "") + "passes to $to →",
            style = Type.label.copy(color = if (duel) Palette.orange else Palette.muted),
            maxLines = 1,
        )
    }
}

@Composable
fun HandGrid(
    controller: GameController, state: GameState, hand: List<String>, width: Dp,
    selected: String?, pendingMain: Action?, discard: String?, waiting: Boolean, onCardClick: (String) -> Unit,
) {
    if (hand.isEmpty()) { BasicText("// dealing the next Sprint...", style = Type.label); return }
    val gap = 12.dp
    val perRow = maxOf(2, ((width + gap) / (168.dp + gap)).toInt())
    val cardW = ((width - gap * (perRow - 1)) / perRow).coerceAtMost(200.dp)
    FlowRowCompat(spacing = gap) {
        HandCards(controller, state, hand, cardW, maxOf(268.dp, cardW * 1.45f), selected, pendingMain, discard, waiting, onCardClick)
    }
}

@Composable
fun HandCards(
    controller: GameController, state: GameState, hand: List<String>, width: Dp, height: Dp,
    selected: String?, pendingMain: Action?, discard: String?, waiting: Boolean, onCardClick: (String) -> Unit,
) {
    val engine = controller.engine
    val me = state.player(controller.humanSeat)
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
                card, engine.ruleset, width, height,
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

@Composable
fun ActionBar(
    controller: GameController, state: GameState, card: Card?, pendingMain: Action?, discard: String?,
    duel: Boolean, waiting: Boolean, stacked: Boolean,
    onChoose: (Action) -> Unit, onConfirmDuel: () -> Unit, onCancel: () -> Unit,
) {
    val engine = controller.engine
    val shell: @Composable (@Composable () -> Unit) -> Unit = { content ->
        Box(Modifier.fillMaxWidth().heightIn(min = 46.dp), contentAlignment = Alignment.CenterStart) { content() }
    }
    if (state.finished) return
    shell {
        when {
            !waiting -> {
                val names = controller.thinking.map { state.player(it).name }
                BasicText(
                    if (names.isEmpty()) "// revealing..." else "// waiting for ${names.joinToString(", ")}...",
                    Modifier.padding(vertical = 8.dp),
                    style = Type.mono.copy(color = Palette.kotlinLight, fontSize = 13.sp),
                )
            }
            pendingMain != null -> {
                val verb = if (pendingMain is Action.Build) "Build" else "Sell"
                val mainName = engine.ruleset.card(pendingMain.cardId).name
                ActionLayout(
                    stacked,
                    title = "$verb $mainName",
                    subtitle = "then discard: " + (discard?.let { engine.ruleset.card(it).name } ?: "tap another card"),
                    subtitleColor = if (discard != null) Palette.red else Palette.muted,
                ) { m ->
                    Btn("Confirm", onConfirmDuel, m(1.4f), enabled = discard != null, color = Palette.orange)
                    Btn("Back", onCancel, m(1f), outlined = true, color = Palette.muted)
                }
            }
            card == null -> BasicText(
                if (duel) "// tap a card, choose Build or Sell, then pick a card to discard"
                else "// tap a card to build it or sell it",
                Modifier.padding(vertical = 8.dp),
                style = Type.mono.copy(color = Palette.muted, fontSize = 13.sp),
            )
            else -> {
                val info = buildInfo(engine, state, controller.humanSeat, card)
                ActionLayout(stacked, title = card.name, subtitle = info.explain, subtitleColor = info.color) { m ->
                    Btn(info.buttonLabel, { onChoose(Action.Build(card.id)) }, m(1.4f), enabled = info.option != null, color = Palette.kotlin)
                    Btn("Sell · +${info.sellGain}💰", { onChoose(Action.Sell(card.id)) }, m(1f), outlined = true, color = Palette.orange)
                }
            }
        }
    }
}

@Composable
private fun ActionLayout(
    stacked: Boolean, title: String, subtitle: String, subtitleColor: Color,
    buttons: @Composable RowScope.(m: (Float) -> Modifier) -> Unit,
) {
    val text: @Composable (Modifier) -> Unit = { mod ->
        Column(mod) {
            BasicText(title, style = Type.h2.copy(fontSize = 16.sp), maxLines = 1, overflow = TextOverflow.Ellipsis)
            RichText(subtitle, Type.small.copy(color = subtitleColor), maxLines = 2)
        }
    }
    if (stacked) {
        Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
            text(Modifier)
            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) { buttons { Modifier.weight(it) } }
        }
    } else {
        Row(verticalAlignment = Alignment.CenterVertically) {
            text(Modifier.weight(1f))
            Spacer(Modifier.width(12.dp))
            Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) { buttons { Modifier } }
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
