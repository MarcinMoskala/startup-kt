package startupkt.ui

import androidx.compose.animation.core.animateDpAsState
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicText
import androidx.compose.foundation.verticalScroll
import androidx.compose.foundation.gestures.detectDragGestures
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.key
import androidx.compose.runtime.mutableStateMapOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Rect
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.layout.boundsInRoot
import androidx.compose.ui.layout.onGloballyPositioned
import androidx.compose.ui.layout.positionInRoot
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.unit.IntOffset
import kotlin.math.roundToInt
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.TextUnit
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import startupkt.engine.*

/*
 * Desktop "card table" layout, top to bottom:
 *   1. top bar
 *   2. the other players' seats (their companies, roughly in passing order)
 *   3. your company: startup board with roadmap + the cards you played, grouped by type
 *   4. your hand at the bottom, with the selected card lifted and the action panel next to it
 */

// ============================== Drag and drop ==============================

/** Where a dragged hand card can be dropped. */
enum class DropZone { TABLE, ROADMAP, SELL }

/** Drag state of a card from your hand. Positions are in root pixels. */
class HandDrag {
    var cardId by mutableStateOf<String?>(null)
    var pointer by mutableStateOf(Offset.Zero)
    /** Pointer position inside the card when the drag started. */
    var grab by mutableStateOf(Offset.Zero)
    val zones = mutableStateMapOf<DropZone, Rect>()

    val active get() = cardId != null
    fun hovered(): DropZone? = if (!active) null else zones.entries.firstOrNull { it.value.contains(pointer) }?.key
}

/** The action a drop on [zone] means for [card], or null when it is not legal right now. */
fun dropAction(engine: Engine, state: GameState, seat: Int, card: Card, zone: DropZone): Action? {
    val options = engine.options(state, seat).filter { it.card.id == card.id }
    return when (zone) {
        DropZone.TABLE -> options.firstOrNull { it.action.startsWith("build:") }?.let { Action.Build(card.id) }
        DropZone.ROADMAP -> options.firstOrNull { it.action.startsWith("stage:") }?.let { Action.Stage(card.id) }
        DropZone.SELL -> Action.Sell(card.id)
    }
}

/** Highlight for a drop zone while a card is dragged: green = legal, red = not legal; brighter when hovered. */
@Composable
private fun Modifier.dropZone(drag: HandDrag, zone: DropZone, legal: Boolean, shape: RoundedCornerShape): Modifier {
    val base = this.onGloballyPositioned { drag.zones[zone] = it.boundsInRoot() }
    if (!drag.active) return base
    val hovered = drag.hovered() == zone
    val c = if (legal) Palette.green else Palette.red
    return base.border(if (hovered) 3.dp else 2.dp, c.copy(alpha = if (hovered) 1f else 0.55f), shape)
        .background(c.copy(alpha = if (hovered) 0.12f else 0.05f), shape)
}

/** Status chip text for a seat: thinking / ready / your pick. */
fun seatStatus(controller: GameController, state: GameState, seat: Int): Pair<String?, Color> = when {
    state.finished -> null to Palette.muted
    seat in controller.thinking -> "thinking…" to Palette.kotlinLight
    seat == controller.humanSeat && controller.waitingForHuman() -> "your pick" to Palette.orange
    seat in state.pending -> "ready" to Palette.green
    else -> null to Palette.muted
}

@Composable
fun CardTable(
    controller: GameController, state: GameState, hand: List<String>,
    selected: String?, pendingMain: Action?, discard: String?, waiting: Boolean, duel: Boolean,
    onRules: () -> Unit, onCardClick: (String) -> Unit, actionBar: @Composable (BarLayout) -> Unit,
    width: Dp, height: Dp, onDropAction: (String, Action) -> Unit = { _, _ -> },
) {
    val engine = controller.engine
    val drag = remember { HandDrag() }
    val dragCard = drag.cardId?.let { engine.ruleset.card(it) }
    fun legal(zone: DropZone) = dragCard != null && dropAction(engine, state, controller.humanSeat, dragCard, zone) != null
    val pad = if (width >= 1200.dp) 24.dp else 16.dp
    val inner = width - pad * 2
    // Hand geometry: as many cards as the hand holds, side by side, next to a fixed action panel.
    val sidePanel = width >= 1180.dp
    val actionW = 300.dp
    val gap = 12.dp
    val handSlots = maxOf(hand.size, if (duel) 6 else 4)
    val handAreaW = if (sidePanel) inner - actionW - 20.dp else inner
    val cardW = ((handAreaW - gap * (handSlots - 1)) / handSlots).coerceIn(120.dp, 186.dp)
    val cardH = (cardW * 1.42f).coerceAtMost(262.dp).coerceAtMost(maxOf(210.dp, height * 0.34f))
    // Tall window: everything fits and your company takes the free space.
    // Short window: the hand stays pinned at the bottom and the table above it scrolls.
    val fits = height >= 760.dp

    var origin by remember { mutableStateOf(Offset.Zero) }
    Box(Modifier.fillMaxSize().onGloballyPositioned { origin = it.positionInRoot() }) {
    Column(
        Modifier.fillMaxSize()
            .background(Brush.verticalGradient(listOf(Palette.bg, Color(0xFF191A1D))))
            .padding(horizontal = pad, vertical = 14.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp),
    ) {
        Column(
            Modifier.weight(1f).fillMaxWidth().then(if (fits) Modifier else Modifier.verticalScroll(rememberScrollState())),
            verticalArrangement = Arrangement.spacedBy(12.dp),
        ) {
            TopBar(controller, state, onRules, compact = false)
            OpponentSeats(controller, state, inner)
            YourCompany(
                controller, state,
                if (fits) Modifier.weight(1f).fillMaxWidth() else Modifier.fillMaxWidth().heightIn(min = 240.dp),
                scrollInside = fits,
                drag = drag, tableLegal = legal(DropZone.TABLE), roadmapLegal = legal(DropZone.ROADMAP),
            )
        }
        // Hand + action panel
        Column(verticalArrangement = Arrangement.spacedBy(6.dp)) {
            HandHeader(controller, state, waiting, pendingMain, duel)
            if (!sidePanel) {
                Box(Modifier.fillMaxWidth().clip(RoundedCornerShape(10.dp)).background(Palette.surface).border(1.dp, Palette.border, RoundedCornerShape(10.dp)).padding(horizontal = 14.dp, vertical = 8.dp)) {
                    actionBar(BarLayout.ROW)
                }
            }
            Row(verticalAlignment = Alignment.Bottom, horizontalArrangement = Arrangement.spacedBy(20.dp)) {
                Box(Modifier.width(handAreaW)) {
                    HandFan(
                        controller, state, hand, cardW, cardH, gap, selected, pendingMain, discard, waiting, onCardClick,
                        drag = drag,
                        onDrop = { id ->
                            val zone = drag.hovered()
                            val card = engine.ruleset.card(id)
                            val action = zone?.let { dropAction(engine, state, controller.humanSeat, card, it) }
                            // Illegal drop or no zone: just select the card so the action panel explains why.
                            if (action != null) onDropAction(id, action) else if (zone != null && selected != id) onCardClick(id)
                        },
                    )
                }
                if (sidePanel) {
                    val panelShape = RoundedCornerShape(12.dp)
                    Box(
                        Modifier.width(actionW).height(cardH).clip(panelShape).background(Palette.surface)
                            .border(1.dp, if (selected != null && waiting) Palette.orange else Palette.border, panelShape)
                            .dropZone(drag, DropZone.SELL, legal = dragCard != null, panelShape)
                            .padding(14.dp),
                        contentAlignment = Alignment.Center,
                    ) {
                        if (dragCard != null) {
                            val gain = engine.sellValue(state.player(controller.humanSeat))
                            Column(horizontalAlignment = Alignment.CenterHorizontally, verticalArrangement = Arrangement.spacedBy(6.dp)) {
                                RichText("Drop here to sell", Type.h2.copy(fontSize = 15.sp))
                                RichText("+${gain}💰", Type.h2.copy(color = Palette.gold))
                            }
                        } else actionBar(BarLayout.PANEL)
                    }
                }
            }
        }
    }
    // The dragged card follows the pointer above everything else.
    if (dragCard != null) {
        val zone = drag.hovered()
        val p = drag.pointer - drag.grab - origin
        Box(Modifier.offset { IntOffset(p.x.roundToInt(), p.y.roundToInt()) }.alpha(0.92f)) {
            val info = buildInfo(engine, state, controller.humanSeat, dragCard)
            val hint = when (zone) {
                DropZone.TABLE -> if (legal(DropZone.TABLE)) "▸ drop: " + info.buttonLabel.lowercase() else "✕ can't build"
                DropZone.ROADMAP -> stageButton(engine, state, controller.humanSeat)?.let { (l, ok) -> if (ok) "▸ drop: ${l.lowercase()}" else "✕ can't reach the next stage" } ?: "✕ roadmap done"
                DropZone.SELL -> "▸ drop: sell"
                null -> info.label
            }
            CardView(dragCard, engine.ruleset, cardW, cardH, status = hint,
                statusColor = when { zone == null -> info.color; zone == DropZone.SELL || legal(zone) -> Palette.green; else -> Palette.red },
                mark = Mark.SELECTED)
        }
    }
    }
}

/** Your hand laid out at the bottom of the table; the selected card rises. */
@Composable
private fun HandFan(
    controller: GameController, state: GameState, hand: List<String>, cardW: Dp, cardH: Dp, gap: Dp,
    selected: String?, pendingMain: Action?, discard: String?, waiting: Boolean, onCardClick: (String) -> Unit,
    drag: HandDrag, onDrop: (String) -> Unit,
) {
    val lift = 16.dp
    if (hand.isEmpty()) {
        Box(Modifier.fillMaxWidth().height(cardH + lift), contentAlignment = Alignment.Center) {
            BasicText("// dealing the next Sprint...", style = Type.label)
        }
        return
    }
    val engine = controller.engine
    val me = state.player(controller.humanSeat)
    Row(Modifier.fillMaxWidth().height(cardH + lift), horizontalArrangement = Arrangement.spacedBy(gap, Alignment.CenterHorizontally), verticalAlignment = Alignment.Bottom) {
        hand.forEachIndexed { index, id ->
            val card = engine.ruleset.card(id)
            val info = buildInfo(engine, state, controller.humanSeat, card)
            val raised = (id == selected && pendingMain == null) || (pendingMain != null && id == discard)
            val offset by animateDpAsState(if (raised) -lift else 0.dp)
            val mark = when {
                pendingMain != null && id == discard -> Mark.DISCARD
                id == selected -> Mark.SELECTED
                else -> Mark.NONE
            }
            key(index, id) {
                var bounds by remember { mutableStateOf(Rect.Zero) }
                val canDrag = waiting && pendingMain == null
                Box(
                    Modifier.offset(y = offset)
                        .onGloballyPositioned { bounds = it.boundsInRoot() }
                        .alpha(if (drag.cardId == id) 0.25f else 1f)
                        .then(
                            if (!canDrag) Modifier else Modifier.pointerInput(id, state.sprint, state.pick) {
                                detectDragGestures(
                                    onDragStart = { at -> drag.grab = at; drag.pointer = bounds.topLeft + at; drag.cardId = id },
                                    onDrag = { change, amount -> change.consume(); drag.pointer += amount },
                                    onDragEnd = { drag.cardId?.let(onDrop); drag.cardId = null },
                                    onDragCancel = { drag.cardId = null },
                                )
                            }
                        ),
                ) {
                    CardHoverPreview(card, engine.ruleset, enabled = !drag.active) {
                    CardView(
                        card, engine.ruleset, cardW, cardH,
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
}

// ============================== Opponents ==============================

@Composable
private fun OpponentSeats(controller: GameController, state: GameState, width: Dp) {
    val engine = controller.engine
    val me = controller.humanSeat
    val opponents = tableOrder(state, me, passesReversed(engine, state)).filter { it != me }
    val arrowW = 18.dp
    val w = (width - arrowW * (opponents.size - 1)) / opponents.size
    Row(verticalAlignment = Alignment.Top) {
        opponents.forEachIndexed { i, seat ->
            if (i > 0) Box(Modifier.width(arrowW).padding(top = 18.dp), contentAlignment = Alignment.Center) {
                BasicText("→", style = Type.h2.copy(color = Palette.faint, fontSize = 15.sp))
            }
            OpponentSeat(controller, state, seat, Modifier.width(w))
        }
    }
}

@Composable
private fun OpponentSeat(controller: GameController, state: GameState, seat: Int, modifier: Modifier) {
    val engine = controller.engine
    val p = state.player(seat)
    val startup = engine.ruleset.startup(p.startup)
    val (status, statusColor) = seatStatus(controller, state, seat)
    val last = lastActionOf(controller, p.name)
    val newest = if (last?.startsWith("built") == true) p.built.lastOrNull() else null
    val shape = RoundedCornerShape(12.dp)
    Column(
        modifier.clip(shape).background(Palette.surface).border(1.dp, Palette.border, shape).padding(10.dp),
        verticalArrangement = Arrangement.spacedBy(7.dp),
    ) {
        HoverPopup(popup = { SeatHistory(controller, state, seat) }) {
            Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                StartupLogo(p.startup, 30.dp)
                Column(Modifier.weight(1f)) {
                    BasicText(p.name, style = Type.h3, maxLines = 1, overflow = TextOverflow.Ellipsis)
                    BasicText(startup.name + " · hover for history", style = Type.muted.copy(fontSize = 11.sp), maxLines = 1, overflow = TextOverflow.Ellipsis)
                }
                if (status != null) StatusChip(status, statusColor)
            }
        }
        Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(10.dp)) {
            Amount(engine.score(state, seat).total, Glyph.STAR, 14.sp, iconFirst = true)
            Amount(p.coins, Glyph.COIN, 14.sp, iconFirst = true)
            ProductionRow(engine.production(p), 14.dp)
            Spacer(Modifier.weight(1f))
            if (startup.stages.isNotEmpty()) StageDots(p.stagesDone, startup.stages.size)
        }
        RichText(last ?: " ", Type.label.copy(fontSize = 10.sp, color = Palette.faint), maxLines = 1)
        TypeColumns(engine, p.built, newest, stripHeight = 19.dp, font = 10.sp, gap = 3.dp, showHeaders = false)
    }
}

/** Popup for an opponent: their startup roadmap and everything they did so far, newest first. */
@Composable
private fun SeatHistory(controller: GameController, state: GameState, seat: Int) {
    val engine = controller.engine
    val p = state.player(seat)
    val startup = engine.ruleset.startup(p.startup)
    val moves = state.log.mapNotNull { line ->
        val m = Regex("^S(\\d+)P(\\d+) ${Regex.escape(p.name)} (.*)$").find(line) ?: return@mapNotNull null
        "S${m.groupValues[1]}·${m.groupValues[2]}" to m.groupValues[3]
    }.reversed()
    val shape = RoundedCornerShape(12.dp)
    Column(
        Modifier.width(340.dp).clip(shape).background(Palette.surface).border(1.dp, Palette.kotlin, shape).padding(14.dp),
        verticalArrangement = Arrangement.spacedBy(8.dp),
    ) {
        Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(10.dp)) {
            StartupLogo(p.startup, 40.dp)
            Column(Modifier.weight(1f)) {
                BasicText(p.name, style = Type.h2.copy(fontSize = 16.sp))
                BasicText(startup.name, style = Type.muted)
            }
        }
        BasicText(startup.description, style = Type.flavor.copy(fontSize = 11.sp))
        Roadmap(engine, p)
        BasicText("// moves, newest first", style = Type.label)
        if (moves.isEmpty()) BasicText("// no moves yet", style = Type.label.copy(color = Palette.faint))
        moves.take(14).forEach { (at, what) ->
            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                BasicText(at, Modifier.width(44.dp), style = Type.mono.copy(fontSize = 11.sp, color = Palette.faint))
                RichText(what, Type.small.copy(fontSize = 12.sp), maxLines = 2)
            }
        }
    }
}

@Composable
fun StatusChip(text: String, color: Color) {
    Box(
        Modifier.clip(RoundedCornerShape(50)).background(color.copy(alpha = 0.16f)).padding(horizontal = 8.dp, vertical = 3.dp),
    ) { BasicText(text, style = Type.label.copy(color = color, fontSize = 10.sp), maxLines = 1) }
}

@Composable
fun StageDots(done: Int, total: Int) {
    Row(horizontalArrangement = Arrangement.spacedBy(3.dp), verticalAlignment = Alignment.CenterVertically) {
        for (i in 0 until total) {
            Box(
                Modifier.size(9.dp).clip(CircleShape)
                    .background(if (i < done) Palette.gold else Palette.surface2)
                    .border(1.dp, if (i < done) Palette.gold else Palette.border, CircleShape),
            )
        }
    }
}

/** Played cards in four columns by type (Team · Library · Feature · Business), like cards laid out on a table. */
@Composable
fun TypeColumns(
    engine: Engine, built: List<String>, newest: String?, stripHeight: Dp, font: TextUnit, gap: Dp,
    showHeaders: Boolean, empty: String = "// nothing built yet",
) {
    if (built.isEmpty() && !showHeaders) { BasicText(empty, style = Type.label.copy(color = Palette.faint, fontSize = 10.sp)); return }
    val cards = built.map { engine.ruleset.card(it) }
    val types = listOf(CardType.TEAM, CardType.LIBRARY, CardType.FEATURE, CardType.BUSINESS)
    Row(horizontalArrangement = Arrangement.spacedBy(gap * 2)) {
        types.forEach { t ->
            val of = cards.filter { it.type == t }
            Column(Modifier.weight(1f), verticalArrangement = Arrangement.spacedBy(gap)) {
                if (showHeaders) {
                    Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(5.dp)) {
                        Icon(glyphOf(t), 12.dp)
                        BasicText(
                            when (t) { CardType.TEAM -> "TEAM"; CardType.LIBRARY -> "LIBRARIES"; CardType.FEATURE -> "FEATURES"; CardType.BUSINESS -> "BUSINESS" } +
                                if (of.isNotEmpty()) " · ${of.size}" else "",
                            style = Type.label.copy(fontSize = 10.sp, color = Palette.of(t)),
                        )
                    }
                }
                of.forEach { c ->
                    CardHoverPreview(c, engine.ruleset, Modifier.fillMaxWidth()) { Strip(c, Modifier.fillMaxWidth(), c.id == newest, stripHeight, font) }
                }
                if (showHeaders && of.isEmpty()) {
                    Box(
                        Modifier.fillMaxWidth().height(stripHeight).clip(RoundedCornerShape(5.dp))
                            .border(1.dp, Palette.border, RoundedCornerShape(5.dp)),
                    )
                }
            }
        }
    }
}

// ============================== Your company ==============================

@Composable
private fun YourCompany(
    controller: GameController, state: GameState, modifier: Modifier, scrollInside: Boolean,
    drag: HandDrag, tableLegal: Boolean, roadmapLegal: Boolean,
) {
    val engine = controller.engine
    val me = state.player(controller.humanSeat)
    val startup = engine.ruleset.startup(me.startup)
    val score = engine.score(state, controller.humanSeat)
    val last = lastActionOf(controller, me.name)
    val newest = if (last?.startsWith("built") == true) me.built.lastOrNull() else null
    val shape = RoundedCornerShape(14.dp)
    Row(
        modifier.then(if (scrollInside) Modifier else Modifier.height(IntrinsicSize.Min))
            .clip(shape).background(Palette.surface).border(1.5.dp, Palette.orange.copy(alpha = 0.7f), shape),
    ) {
        // Startup board
        Column(
            Modifier.width(330.dp).fillMaxHeight().background(Palette.surface2.copy(alpha = 0.35f))
                .dropZone(drag, DropZone.ROADMAP, roadmapLegal, RoundedCornerShape(topStart = 14.dp, bottomStart = 14.dp))
                .then(if (scrollInside) Modifier.verticalScroll(rememberScrollState()) else Modifier)
                .padding(14.dp),
            verticalArrangement = Arrangement.spacedBy(9.dp),
        ) {
            Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                StartupLogo(me.startup, 46.dp)
                Column(Modifier.weight(1f)) {
                    BasicText("YOUR COMPANY", style = Type.label.copy(color = Palette.orange, fontSize = 10.sp))
                    BasicText(startup.name, style = Type.h2.copy(fontSize = 17.sp), maxLines = 2)
                }
            }
            Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                Amount(score.total, Glyph.STAR, 18.sp, iconFirst = true)
                Amount(me.coins, Glyph.COIN, 18.sp, iconFirst = true)
                ProductionRow(engine.production(me), 17.dp)
            }
            RichText(
                "freelancer ${engine.freelancerPrice(me)}💰 · 🤖 token ${engine.ruleset.rules.agentTokenCost}💰 · 1⭐ per ${engine.coinsPerPoint(me)}💰",
                Type.label.copy(fontSize = 10.sp),
            )
            Roadmap(engine, me)
        }
        Box(Modifier.width(1.dp).fillMaxHeight().background(Palette.border))
        // Played cards
        Column(
            Modifier.weight(1f).fillMaxHeight()
                .dropZone(drag, DropZone.TABLE, tableLegal, RoundedCornerShape(topEnd = 14.dp, bottomEnd = 14.dp))
                .then(if (scrollInside) Modifier.verticalScroll(rememberScrollState()) else Modifier)
                .padding(14.dp),
            verticalArrangement = Arrangement.spacedBy(10.dp),
        ) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                BasicText(
                    if (drag.active) (if (tableLegal) "// drop here to build" else "// can't build this card") else "// on the table · drag a card here to build it",
                    style = Type.label.copy(color = if (drag.active) (if (tableLegal) Palette.green else Palette.red) else Palette.muted),
                    modifier = Modifier.weight(1f),
                )
                if (last != null) RichText("you $last", Type.label.copy(fontSize = 10.sp, color = Palette.faint), maxLines = 1)
            }
            TypeColumns(engine, me.built, newest, stripHeight = 28.dp, font = 12.sp, gap = 5.dp, showHeaders = true)
            if (me.built.isEmpty()) BasicText("// build your team first: 👥 cards produce forever".replace("👥", "Team"), style = Type.label.copy(color = Palette.faint))
            ScoreLine(score)
        }
    }
}
