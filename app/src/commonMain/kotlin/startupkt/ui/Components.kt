@file:OptIn(ExperimentalFoundationApi::class)

package startupkt.ui

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.ExperimentalFoundationApi
import androidx.compose.foundation.clickable
import androidx.compose.foundation.combinedClickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicText
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.input.pointer.PointerIcon
import androidx.compose.ui.input.pointer.pointerHoverIcon
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.TextUnit
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import startupkt.engine.*

@Composable
fun Btn(
    text: String,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    enabled: Boolean = true,
    color: Color = Palette.kotlin,
    outlined: Boolean = false,
    small: Boolean = false,
) {
    val shape = RoundedCornerShape(8.dp)
    val base = modifier
        .clip(shape)
        .then(
            if (outlined) Modifier.border(1.5.dp, if (enabled) color else Palette.border, shape)
            else Modifier.background(if (enabled) color else Palette.surface2)
        )
        .then(if (enabled) Modifier.clickable(onClick = onClick).pointerHoverIcon(PointerIcon.Hand) else Modifier)
        .padding(horizontal = if (small) 12.dp else 18.dp, vertical = if (small) 7.dp else 12.dp)
    Box(base, contentAlignment = Alignment.Center) {
        RichText(
            text,
            style = (if (small) Type.button.copy(fontSize = 13.sp) else Type.button)
                .copy(color = if (!enabled) Palette.muted else if (outlined) color else Color.White),
            maxLines = 1,
        )
    }
}

@Composable
fun Panel(
    modifier: Modifier = Modifier,
    label: String? = null,
    accent: Color? = null,
    trailing: (@Composable () -> Unit)? = null,
    padding: Dp = 14.dp,
    content: @Composable ColumnScope.() -> Unit,
) {
    val shape = RoundedCornerShape(10.dp)
    Column(
        modifier
            .clip(shape)
            .background(Palette.surface)
            .border(if (accent != null) 1.5.dp else 1.dp, accent ?: Palette.border, shape)
            .padding(padding),
        verticalArrangement = Arrangement.spacedBy(8.dp),
    ) {
        if (label != null || trailing != null) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                if (label != null) BasicText(label, Modifier.weight(1f), style = Type.label.copy(color = accent ?: Palette.muted), maxLines = 1, overflow = TextOverflow.Ellipsis)
                trailing?.invoke()
            }
        }
        content()
    }
}

@Composable
fun Segmented(options: List<String>, selected: Int, onSelect: (Int) -> Unit, modifier: Modifier = Modifier) {
    Row(
        modifier.clip(RoundedCornerShape(8.dp)).background(Palette.bg).border(1.dp, Palette.border, RoundedCornerShape(8.dp)).padding(3.dp),
        horizontalArrangement = Arrangement.spacedBy(3.dp),
    ) {
        options.forEachIndexed { i, label ->
            val sel = i == selected
            Box(
                Modifier.weight(1f)
                    .clip(RoundedCornerShape(6.dp))
                    .background(if (sel) Palette.kotlin else Color.Transparent)
                    .clickable { onSelect(i) }
                    .pointerHoverIcon(PointerIcon.Hand)
                    .padding(vertical = 8.dp),
                contentAlignment = Alignment.Center,
            ) {
                BasicText(label, style = Type.mono.copy(color = if (sel) Color.White else Palette.muted, fontSize = 13.sp, fontWeight = FontWeight.Bold))
            }
        }
    }
}

/** Production as a row of icons, alternatives shown as "📱/🖥". */
@Composable
fun ProductionRow(units: List<List<Res>>, size: Dp = 16.dp) {
    if (units.isEmpty()) { BasicText("-", style = Type.muted); return }
    Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(3.dp)) {
        units.forEach { u ->
            if (u.size == 1) Icon(glyphOf(u[0]), size)
            else Row(
                Modifier.clip(RoundedCornerShape(4.dp)).background(Palette.surface2).padding(horizontal = 2.dp),
                verticalAlignment = Alignment.CenterVertically,
            ) {
                u.forEachIndexed { i, r ->
                    if (i > 0) BasicText("/", style = Type.muted.copy(fontSize = 10.sp))
                    Icon(glyphOf(r), size * 0.85f)
                }
            }
        }
    }
}

@OptIn(ExperimentalLayoutApi::class)
@Composable
fun FlowRowCompat(modifier: Modifier = Modifier, spacing: Dp = 8.dp, content: @Composable () -> Unit) {
    FlowRow(
        modifier,
        horizontalArrangement = Arrangement.spacedBy(spacing),
        verticalArrangement = Arrangement.spacedBy(spacing),
    ) { content() }
}

/** A coin amount in a small dark pill, like the cost chips on the printed card. */
@Composable
fun CoinChip(value: Int, size: Dp = 16.dp) {
    Row(
        Modifier.clip(RoundedCornerShape(50)).background(Palette.surface2).padding(start = 2.dp, end = 6.dp, top = 1.dp, bottom = 1.dp),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(3.dp),
    ) {
        Icon(Glyph.COIN, size)
        BasicText("$value", style = Type.mono.copy(fontWeight = FontWeight.Bold, fontSize = 12.sp))
    }
}

@Composable
fun CostRow(card: Card, iconSize: Dp = 17.dp) {
    Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(3.dp)) {
        if (card.costCoins == 0 && card.cost.isEmpty()) BasicText("FREE", style = Type.label.copy(color = Palette.text, fontWeight = FontWeight.Bold))
        else BasicText("COST", style = Type.label.copy(fontSize = 10.sp))
        Spacer(Modifier.width(2.dp))
        if (card.costCoins > 0) CoinChip(card.costCoins, iconSize - 3.dp)
        card.cost.forEach { Icon(glyphOf(it), iconSize) }
    }
}

/** Effect lines with emoji tokens, rendered through [RichText]. */
fun effectLines(card: Card): List<String> = buildList {
    if (card.produces.isNotEmpty()) add("Produces " + card.produces.joinToString(" ") { u -> u.joinToString("/") { it.icon } })
    if (card.coins > 0) add("+${card.coins}💰 now")
    when (val s = card.special) {
        is Special.CoinsPer -> add("+${s.coins}💰 per your ${typeName(s.type)} card")
        is Special.PointsPer -> add("End: +${s.points}⭐ per your ${typeName(s.type)} card")
        is Special.FreelancerPrice -> add("Freelancers cost you ${s.price}💰")
        is Special.CoinRate -> add("End: 1⭐ per ${s.coinsPerPoint}💰")
        null -> {}
    }
}

enum class Mark { NONE, SELECTED, DISCARD }

/**
 * The playing card, the same template as the printed one:
 * coloured header (type, name, ⭐) · art band · cost · effect · "free with" chain · flavor.
 * [status] is a one-line footer for the hand (can you build it and for how much).
 */
@Composable
fun CardView(
    card: Card,
    ruleset: Ruleset,
    width: Dp,
    height: Dp = width * 1.5f,
    status: String? = null,
    statusColor: Color = Palette.muted,
    freeWithOwned: Boolean = false,
    mark: Mark = Mark.NONE,
    dimmed: Boolean = false,
    onClick: (() -> Unit)? = null,
    /** Phone: long-press to inspect the card. */
    onLongClick: (() -> Unit)? = null,
    /** Inspection mode (preview popup): nothing is truncated, flavor text is larger. */
    expanded: Boolean = false,
) {
    val accent = Palette.of(card.type)
    val shape = RoundedCornerShape(10.dp)
    val borderColor = when (mark) {
        Mark.SELECTED -> Palette.orange
        Mark.DISCARD -> Palette.red
        Mark.NONE -> Palette.border
    }
    val compact = width < 160.dp
    Column(
        Modifier.width(width).height(height)
            .alpha(if (dimmed) 0.4f else 1f)
            .clip(shape)
            .background(Palette.surface)
            .border(if (mark == Mark.NONE) 1.dp else 2.5.dp, borderColor, shape)
            .then(
                when {
                    onLongClick != null -> Modifier.combinedClickable(onClick = { onClick?.invoke() }, onLongClick = onLongClick).pointerHoverIcon(PointerIcon.Hand)
                    onClick != null -> Modifier.clickable(onClick = onClick).pointerHoverIcon(PointerIcon.Hand)
                    else -> Modifier
                }
            ),
    ) {
        // Header
        Row(
            Modifier.fillMaxWidth().heightIn(min = 46.dp).background(accent).padding(horizontal = 8.dp, vertical = 6.dp),
            verticalAlignment = Alignment.CenterVertically,
        ) {
            Icon(glyphOf(card.type), 15.dp, tint = Color.White)
            Spacer(Modifier.width(6.dp))
            BasicText(
                card.name,
                Modifier.weight(1f),
                style = TextStyle(color = Color.White, fontSize = if (compact) 12.sp else 13.sp, fontWeight = FontWeight.Bold, lineHeight = 15.sp),
                maxLines = 2,
                overflow = TextOverflow.Ellipsis,
            )
            if (card.points > 0) {
                Spacer(Modifier.width(4.dp))
                Icon(Glyph.STAR, 15.dp)
                BasicText("${card.points}", style = TextStyle(color = Color.White, fontSize = 17.sp, fontWeight = FontWeight.Bold))
            }
        }
        // Art band
        CardArt(card, if (expanded) 110.dp else if (compact) 58.dp else 76.dp)
        // Body
        Column(
            Modifier.weight(1f).fillMaxWidth().padding(horizontal = 9.dp, vertical = 8.dp),
            verticalArrangement = Arrangement.spacedBy(5.dp),
        ) {
            CostRow(card, if (compact) 14.dp else 16.dp)
            effectLines(card).forEach { RichText(it, Type.small.copy(lineHeight = 16.sp)) }
            card.freeWith?.let { id ->
                val lib = ruleset.cardsById[id]?.name ?: id
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(Glyph.CHAIN, 12.dp, tint = if (freeWithOwned) Palette.green else Palette.kotlinLight)
                    Spacer(Modifier.width(4.dp))
                    BasicText(
                        "Free with $lib",
                        style = Type.small.copy(fontSize = 11.sp, color = if (freeWithOwned) Palette.green else Palette.kotlinLight, fontWeight = FontWeight.SemiBold),
                        maxLines = 2,
                    )
                }
            }
            val unlocks = ruleset.cards.filter { it.freeWith == card.id }
            if (unlocks.isNotEmpty()) {
                RichText("Makes free: " + unlocks.joinToString(", ") { it.name }, Type.small.copy(fontSize = 11.sp, color = Palette.kotlinLight), maxLines = if (expanded) Int.MAX_VALUE else 3)
            }
            // Flavor text takes all the space that is left (ellipsis only if it really does not fit).
            if (card.description.isNotEmpty()) {
                Box(Modifier.weight(1f).fillMaxWidth(), contentAlignment = Alignment.BottomStart) {
                    BasicText(
                        card.description,
                        style = if (expanded) Type.flavor.copy(fontSize = 12.sp, lineHeight = 17.sp, color = Palette.muted)
                        else Type.flavor.copy(lineHeight = 13.sp),
                        overflow = TextOverflow.Ellipsis,
                    )
                }
            } else Spacer(Modifier.weight(1f))
        }
        if (status != null) {
            Box(Modifier.fillMaxWidth().background(Palette.bg.copy(alpha = 0.6f)).padding(horizontal = 9.dp, vertical = 6.dp)) {
                RichText(status, Type.mono.copy(color = statusColor, fontSize = 11.sp, fontWeight = FontWeight.Bold), maxLines = 1)
            }
        }
    }
}

/** A built card in a tableau: a coloured strip with the name and ⭐. */
@Composable
fun Strip(card: Card, modifier: Modifier = Modifier, highlight: Boolean = false, height: Dp = 26.dp, font: TextUnit = 12.sp) {
    val c = Palette.of(card.type)
    Row(
        modifier.height(height).clip(RoundedCornerShape(5.dp)).background(c)
            .then(if (highlight) Modifier.border(1.5.dp, Color.White, RoundedCornerShape(5.dp)) else Modifier)
            .padding(horizontal = 7.dp),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(5.dp),
    ) {
        Icon(glyphOf(card.type), (font.value).dp, tint = Color.White.copy(alpha = 0.9f))
        BasicText(
            card.name, Modifier.weight(1f),
            style = TextStyle(color = Color.White, fontSize = font, fontWeight = FontWeight.SemiBold),
            maxLines = 1, overflow = TextOverflow.Ellipsis,
        )
        if (card.points > 0) {
            Icon(Glyph.STAR, (font.value - 1).dp)
            BasicText("${card.points}", style = TextStyle(color = Color.White, fontSize = font, fontWeight = FontWeight.Bold))
        }
    }
}

/** Built cards grouped like a sprint board: Team | Libraries on top, Features | Business below. */
@Composable
fun Tableau(engine: Engine, built: List<String>, newest: String? = null, empty: String = "// nothing built yet") {
    if (built.isEmpty()) { BasicText(empty, style = Type.label.copy(color = Palette.faint)); return }
    val cards = built.map { engine.ruleset.card(it) }
    fun of(t: CardType) = cards.filter { it.type == t }
    val rows = listOf(of(CardType.TEAM) to of(CardType.LIBRARY), of(CardType.FEATURE) to of(CardType.BUSINESS))
    Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
        rows.filter { it.first.isNotEmpty() || it.second.isNotEmpty() }.forEach { (left, right) ->
            Row(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                Column(Modifier.weight(1f), verticalArrangement = Arrangement.spacedBy(4.dp)) {
                    left.forEach { Strip(it, Modifier.fillMaxWidth(), it.id == newest) }
                }
                Column(Modifier.weight(1f), verticalArrangement = Arrangement.spacedBy(4.dp)) {
                    right.forEach { Strip(it, Modifier.fillMaxWidth(), it.id == newest) }
                }
            }
        }
    }
}

@Composable
fun Avatar(name: String, seat: Int, size: Dp = 30.dp) {
    Box(
        Modifier.size(size).clip(CircleShape).background(if (seat == 0) Palette.orange else Palette.avatars[(seat) % Palette.avatars.size].let { if (it == Palette.orange) Palette.kotlin else it }),
        contentAlignment = Alignment.Center,
    ) {
        BasicText(name.take(1).uppercase(), style = TextStyle(color = Color.White, fontSize = (size.value * 0.45f).sp, fontWeight = FontWeight.Bold))
    }
}

/** Player card in the top strip: avatar, name, startup, status, ⭐, 💰 and production. */
@Composable
fun PlayerBadge(
    name: String, seat: Int, startup: String, stars: Int, coins: Int, production: List<List<Res>>,
    status: String?, statusColor: Color, isYou: Boolean, lastAction: String?, modifier: Modifier = Modifier, compact: Boolean = false,
    startupId: String? = null,
) {
    val shape = RoundedCornerShape(10.dp)
    Column(
        modifier.clip(shape).background(Palette.surface)
            .border(if (isYou) 1.5.dp else 1.dp, if (isYou) Palette.orange else Palette.border, shape)
            .padding(horizontal = 10.dp, vertical = if (compact) 7.dp else 9.dp),
        verticalArrangement = Arrangement.spacedBy(if (compact) 4.dp else 6.dp),
    ) {
        Row(verticalAlignment = Alignment.CenterVertically) {
            if (startupId != null) StartupLogo(startupId, if (compact) 26.dp else 32.dp) else Avatar(name, seat, if (compact) 24.dp else 30.dp)
            Spacer(Modifier.width(8.dp))
            Column(Modifier.weight(1f)) {
                BasicText(name, style = Type.h3, maxLines = 1, overflow = TextOverflow.Ellipsis)
                if (compact) BasicText(status ?: " ", style = Type.label.copy(color = statusColor, fontSize = 10.sp), maxLines = 1)
                else BasicText(startup, style = Type.muted.copy(fontSize = 11.sp), maxLines = 1, overflow = TextOverflow.Ellipsis)
            }
            if (status != null && !compact) BasicText(status, style = Type.label.copy(color = statusColor, fontSize = 10.sp), maxLines = 1)
        }
        Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            Amount(stars, Glyph.STAR, 14.sp, iconFirst = true)
            Amount(coins, Glyph.COIN, 14.sp, iconFirst = true)
            if (!compact) ProductionRow(production, 14.dp)
        }
        if (lastAction != null && !compact) {
            RichText(lastAction, Type.label.copy(fontSize = 10.sp, color = Palette.faint), maxLines = 1)
        }
    }
}
