package startupkt.ui

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
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
    val shape = RoundedCornerShape(10.dp)
    val base = modifier
        .clip(shape)
        .then(if (outlined) Modifier.border(1.dp, if (enabled) color else Palette.border, shape) else Modifier.background(if (enabled) color else Palette.surface2))
        .then(if (enabled) Modifier.clickable(onClick = onClick).pointerHoverIcon(PointerIcon.Hand) else Modifier)
        .padding(horizontal = if (small) 10.dp else 16.dp, vertical = if (small) 6.dp else 11.dp)
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
fun Panel(modifier: Modifier = Modifier, title: String? = null, trailing: (@Composable () -> Unit)? = null, content: @Composable ColumnScope.() -> Unit) {
    Column(
        modifier
            .clip(RoundedCornerShape(14.dp))
            .background(Palette.surface)
            .border(1.dp, Palette.border, RoundedCornerShape(14.dp))
            .padding(14.dp),
        verticalArrangement = Arrangement.spacedBy(8.dp),
    ) {
        if (title != null || trailing != null) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                if (title != null) RichText(title, Type.h3, Modifier.weight(1f))
                trailing?.invoke()
            }
        }
        content()
    }
}

@Composable
fun Segmented(options: List<String>, selected: Int, onSelect: (Int) -> Unit, modifier: Modifier = Modifier) {
    Row(
        modifier.clip(RoundedCornerShape(10.dp)).background(Palette.surface2).padding(3.dp),
        horizontalArrangement = Arrangement.spacedBy(3.dp),
    ) {
        options.forEachIndexed { i, label ->
            val sel = i == selected
            Box(
                Modifier.weight(1f)
                    .clip(RoundedCornerShape(8.dp))
                    .background(if (sel) Palette.kotlin else Color.Transparent)
                    .clickable { onSelect(i) }
                    .pointerHoverIcon(PointerIcon.Hand)
                    .padding(vertical = 9.dp),
                contentAlignment = Alignment.Center,
            ) {
                BasicText(label, style = Type.h3.copy(color = if (sel) Color.White else Palette.muted, fontSize = 14.sp))
            }
        }
    }
}

@Composable
fun ProductionRow(units: List<List<Res>>, size: Dp = 18.dp) {
    if (units.isEmpty()) { BasicText("-", style = Type.muted); return }
    FlowRowCompat(spacing = 4.dp) {
        units.forEach { u ->
            Row(
                Modifier.clip(RoundedCornerShape(6.dp)).background(Palette.surface2).padding(horizontal = 4.dp, vertical = 2.dp),
                verticalAlignment = Alignment.CenterVertically,
            ) {
                u.forEachIndexed { i, r ->
                    if (i > 0) BasicText("/", style = Type.muted)
                    Icon(glyphOf(r), size)
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

@Composable
fun CostRow(card: Card) {
    Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(2.dp)) {
        if (card.costCoins == 0 && card.cost.isEmpty()) BasicText("Free", style = Type.small.copy(color = Palette.muted))
        if (card.costCoins > 0) Amount(card.costCoins, Glyph.COIN, 13.sp)
        if (card.costCoins > 0 && card.cost.isNotEmpty()) Spacer(Modifier.width(4.dp))
        card.cost.forEach { Icon(glyphOf(it), 17.dp) }
    }
}

/** Effect lines with emoji tokens, rendered through [RichText]. */
fun effectLines(card: Card, ruleset: Ruleset): List<String> = buildList {
    if (card.produces.isNotEmpty()) add("Produces " + card.produces.joinToString(" ") { u -> u.joinToString("/") { it.icon } })
    if (card.coins > 0) add("+${card.coins}💰 now")
    when (val s = card.special) {
        is Special.CoinsPer -> add("+${s.coins}💰 per your ${typeName(s.type)} card")
        is Special.PointsPer -> add("End: +${s.points}⭐ per your ${typeName(s.type)} card")
        is Special.FreelancerPrice -> add("Freelancers cost you ${s.price}💰")
        is Special.CoinRate -> add("End: 1⭐ per ${s.coinsPerPoint}💰")
        null -> {}
    }
    val unlocks = ruleset.cards.filter { it.freeWith == card.id }
    if (unlocks.isNotEmpty()) add("Makes free: " + unlocks.joinToString(", ") { it.name })
}

enum class Mark { NONE, SELECTED, DISCARD }

/** A full playing card. [status] is a short line at the bottom (cost to build for you, or why you can't). */
@Composable
fun CardView(
    card: Card,
    ruleset: Ruleset,
    width: Dp,
    status: String? = null,
    statusColor: Color = Palette.muted,
    freeWithOwned: Boolean = false,
    mark: Mark = Mark.NONE,
    dimmed: Boolean = false,
    onClick: (() -> Unit)? = null,
) {
    val accent = Palette.of(card.type)
    val shape = RoundedCornerShape(12.dp)
    val borderColor = when (mark) {
        Mark.SELECTED -> Palette.orange
        Mark.DISCARD -> Palette.red
        Mark.NONE -> Palette.border
    }
    Column(
        Modifier.width(width)
            .alpha(if (dimmed) 0.45f else 1f)
            .clip(shape)
            .background(Palette.surface)
            .border(if (mark == Mark.NONE) 1.dp else 3.dp, borderColor, shape)
            .then(if (onClick != null) Modifier.clickable(onClick = onClick).pointerHoverIcon(PointerIcon.Hand) else Modifier),
    ) {
        Row(
            Modifier.fillMaxWidth().background(accent.copy(alpha = 0.22f)).padding(horizontal = 8.dp, vertical = 6.dp),
            verticalAlignment = Alignment.CenterVertically,
        ) {
            Icon(glyphOf(card.type), 16.dp)
            Spacer(Modifier.width(6.dp))
            BasicText(
                card.name,
                Modifier.weight(1f),
                style = TextStyle(color = Palette.text, fontSize = 13.sp, fontWeight = FontWeight.Bold),
                maxLines = 2,
                overflow = TextOverflow.Ellipsis,
            )
            if (card.points > 0) Amount(card.points, Glyph.STAR, 15.sp)
        }
        Column(Modifier.padding(horizontal = 8.dp, vertical = 6.dp), verticalArrangement = Arrangement.spacedBy(4.dp)) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                BasicText("Cost ", style = Type.muted)
                CostRow(card)
            }
            card.freeWith?.let { id ->
                val lib = ruleset.cardsById[id]?.name ?: id
                BasicText(
                    "Free with $lib",
                    style = Type.small.copy(color = if (freeWithOwned) Palette.green else Palette.kotlinLight, fontWeight = FontWeight.SemiBold),
                )
            }
            effectLines(card, ruleset).forEach { RichText(it, Type.small) }
            if (card.description.isNotEmpty()) {
                BasicText(card.description, style = Type.flavor, maxLines = 3, overflow = TextOverflow.Ellipsis)
            }
        }
        Spacer(Modifier.weight(1f, fill = false))
        if (status != null) {
            Box(Modifier.fillMaxWidth().background(Palette.surface2).padding(horizontal = 8.dp, vertical = 5.dp)) {
                RichText(status, Type.small.copy(color = statusColor, fontWeight = FontWeight.SemiBold), maxLines = 2)
            }
        }
    }
}

/** Compact chip for built cards in a tableau. */
@Composable
fun MiniCard(card: Card) {
    Row(
        Modifier.clip(RoundedCornerShape(7.dp))
            .background(Palette.surface2)
            .border(1.dp, Palette.of(card.type).copy(alpha = 0.6f), RoundedCornerShape(7.dp))
            .padding(horizontal = 6.dp, vertical = 3.dp),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(4.dp),
    ) {
        Icon(glyphOf(card.type), 12.dp)
        BasicText(card.name, style = Type.small, maxLines = 1)
        if (card.points > 0) Amount(card.points, Glyph.STAR, 11.sp, Palette.gold)
        card.produces.forEach { u -> u.forEach { Icon(glyphOf(it), 12.dp) } }
    }
}
