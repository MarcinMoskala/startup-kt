@file:OptIn(ExperimentalFoundationApi::class)

package startupkt.ui

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.ExperimentalFoundationApi
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.border
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
import androidx.compose.ui.draw.clipToBounds
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.input.pointer.PointerIcon
import androidx.compose.ui.input.pointer.pointerHoverIcon
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.TextUnit
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import org.jetbrains.compose.resources.painterResource
import startupkt.engine.*
import kotlin.math.max
import kotlin.math.min

/*
 * The in-game card, drawn after the printed card (print/cards.js): coloured type header with cost box, name and ⭐,
 * IDE window with the card art (exported from the print design), effect blocks, flavor code and sprint footer.
 * All sizes are in card millimetres (a 63 mm wide card) scaled to the composable width.
 */

private val CardBg = Color(0xFF1E1F22)
private val CodeBg = Color(0xFF18191B)
private val Surface2 = Color(0xFF393B40)
private val Chain = Color(0xFFA98BFF)
private val TeamLabel = Color(0xFF4FD1B0)
private val GoldDark = Color(0xFFB8862A)
private val Ink = Color(0xFF3A2A05)

private fun gradientOf(t: CardType) = when (t) {
    CardType.TEAM -> listOf(Color(0xFF33BE9F), Color(0xFF1C8A72))
    CardType.FEATURE -> listOf(Color(0xFF9D74FF), Color(0xFF6B3FE0))
    CardType.LIBRARY -> listOf(Color(0xFF4C97FF), Color(0xFF2F6FD6))
    CardType.BUSINESS -> listOf(Color(0xFFF0AA3E), Color(0xFFC97F18))
}

private val SPRINT_NAMES = mapOf(1 to "HELLO, WORLD", 2 to "BETA", 3 to "RELEASE 1.0")

/** Millimetre scale of one card: [u] dp per mm; text sizes are clamped to stay readable on small cards. */
private class Mm(val u: Float, val compact: Boolean) {
    fun dp(mm: Float): Dp = (mm * u).dp
    fun sp(mm: Float, min: Float = 0f): TextUnit = max(mm * u, min).sp
    fun line(mm: Float = 0.35f): Dp = max(mm * u, 1f).dp
}

/** Diagonal light stripes over the header, like the printed card. */
@Composable
private fun Stripes(modifier: Modifier) = Canvas(modifier) {
    val step = size.height / 6f
    var x = -size.height
    while (x < size.width) {
        drawLine(Color.White.copy(alpha = 0.05f), Offset(x, size.height), Offset(x + size.height * 0.7f, 0f), strokeWidth = step / 3f)
        x += step
    }
}

/** A gold coin with its amount, as on the printed cards. */
@Composable
fun CoinBadge(n: Int?, size: Dp) = Box(Modifier.size(size), contentAlignment = Alignment.Center) {
    Canvas(Modifier.fillMaxSize()) {
        drawCircle(Palette.gold, radius = this.size.width * 0.46f)
        drawCircle(GoldDark, radius = this.size.width * 0.35f, style = Stroke(this.size.width * 0.06f))
    }
    if (n != null) BasicText("$n", style = TextStyle(color = Ink, fontSize = (size.value * 0.56f).sp, fontWeight = FontWeight.ExtraBold, fontFamily = Fonts.mono))
}

/** A gold star with its amount. */
@Composable
fun StarBadge(n: Int?, size: Dp, fontScale: Float = 0.4f) = Box(Modifier.size(size), contentAlignment = Alignment.Center) {
    Icon(Glyph.STAR, size)
    if (n != null) BasicText(
        "$n", Modifier.padding(top = size * 0.08f),
        style = TextStyle(color = Ink, fontSize = (size.value * fontScale).sp, fontWeight = FontWeight.ExtraBold, fontFamily = Fonts.mono),
    )
}

/** A card-type square (colour + white glyph); features use the purple star. */
@Composable
private fun TypeSquare(t: CardType, size: Dp) {
    if (t == CardType.FEATURE) { Icon(Glyph.STAR, size, tint = Palette.of(t)); return }
    Box(Modifier.size(size).clip(RoundedCornerShape(size * 0.2f)).background(Palette.of(t)), contentAlignment = Alignment.Center) {
        Icon(glyphOf(t), size * 0.72f, tint = Color.White)
    }
}

@Composable
private fun CostBox(card: Card, m: Mm) {
    val items: List<Pair<Glyph?, Int?>> = buildList {
        if (card.costCoins > 0) add(null to card.costCoins)
        card.cost.forEach { add(glyphOf(it) to null) }
    }
    Box(Modifier.size(m.dp(12.4f), m.dp(15f))) {
        Box(Modifier.fillMaxSize().clip(RoundedCornerShape(m.dp(1.8f))).background(CardBg), contentAlignment = Alignment.TopCenter) {
            @Composable fun item(it: Pair<Glyph?, Int?>, s: Dp) = if (it.first == null) CoinBadge(it.second, s) else Icon(it.first!!, s)
            when {
                items.isEmpty() -> Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                    BasicText("FREE", style = TextStyle(color = Palette.text, fontSize = m.sp(2.6f, 8f), fontWeight = FontWeight.ExtraBold, fontFamily = Fonts.mono))
                }
                items.size == 1 -> Box(Modifier.padding(top = m.dp(1f))) { item(items[0], m.dp(8f)) }
                else -> Column(Modifier.padding(top = m.dp(if (items.size <= 2) 3.6f else 1.1f)), verticalArrangement = Arrangement.spacedBy(m.dp(0.3f)),
                    horizontalAlignment = Alignment.CenterHorizontally) {
                    items.chunked(2).forEach { row -> Row(horizontalArrangement = Arrangement.spacedBy(m.dp(0.4f))) { row.forEach { item(it, m.dp(5f)) } } }
                }
            }
            if (items.isNotEmpty() && !m.compact) BasicText(
                "COST", Modifier.align(Alignment.BottomCenter).padding(bottom = m.dp(0.7f)),
                style = TextStyle(color = Palette.muted, fontSize = m.sp(1.9f), fontWeight = FontWeight.Bold, fontFamily = Fonts.mono, letterSpacing = m.sp(0.15f)),
            )
        }
        if (card.freeWith != null) Box(
            Modifier.align(Alignment.BottomEnd).offset(m.dp(2.4f), m.dp(1.8f)).size(m.dp(4.8f)).clip(CircleShape)
                .background(CardBg).padding(m.dp(0.5f)).clip(CircleShape).background(Palette.kotlin),
            contentAlignment = Alignment.Center,
        ) { Icon(Glyph.CHAIN, m.dp(3.4f), tint = Color.White) }
    }
}

/** Name in 1 line, or 2 balanced lines (also breaking after "." or "/"), like nameBlock() in print/cards.js. */
private fun nameLines(name: String, maxW: Float): Pair<List<String>, Float> {
    val one = min(7f, maxW / (name.length * 0.6f))
    val breaks = buildList {
        for (i in 1 until name.length - 1) when (name[i]) {
            ' ' -> add(name.substring(0, i) to name.substring(i + 1))
            '.', '/' -> add(name.substring(0, i + 1) to name.substring(i + 1))
        }
    }
    if (one >= 4f || breaks.isEmpty()) return listOf(name) to one
    val minM = breaks.minOf { max(it.first.length, it.second.length) }
    val best = breaks.filter { max(it.first.length, it.second.length) <= minM + 1 }.maxBy { it.first.length }
    val m = max(best.first.length, best.second.length)
    return listOf(best.first, best.second) to min(4.6f, maxW / (m * 0.6f))
}

@Composable
private fun Header(card: Card, m: Mm) {
    Box(Modifier.fillMaxWidth().height(m.dp(19.5f)).background(Brush.linearGradient(gradientOf(card.type)))) {
        Stripes(Modifier.matchParentSize())
        Box(Modifier.padding(start = m.dp(3f), top = m.dp(3f))) { CostBox(card, m) }
        val (lines, size) = nameLines(card.name, if (card.points > 0) 27.6f else 41f)
        Column(Modifier.fillMaxHeight().padding(start = m.dp(18.2f), top = m.dp(if (lines.size == 1) 4.2f else 3.2f), bottom = m.dp(1.2f),
            end = m.dp(if (card.points > 0) 17f else 3f)), verticalArrangement = Arrangement.spacedBy(0.dp)) {
            if (!m.compact) Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(glyphOf(card.type), m.dp(3.2f), tint = Color.White)
                Spacer(Modifier.width(m.dp(0.7f)))
                BasicText(typeName(card.type).uppercase(), style = TextStyle(color = Color.White.copy(alpha = 0.85f), fontSize = m.sp(2.3f),
                    fontWeight = FontWeight.Bold, fontFamily = Fonts.mono, letterSpacing = m.sp(0.35f)))
            }
            // The name block fills the rest of the header; 2-line names get a slightly smaller size so they never overflow it.
            Box(Modifier.weight(1f), contentAlignment = Alignment.CenterStart) {
                val sz = if (lines.size == 1) size else min(size, 4.2f)
                BasicText(lines.joinToString("\n"), style = TextStyle(color = Color.White, fontSize = m.sp(sz, 9f), fontWeight = FontWeight.ExtraBold,
                    fontFamily = Fonts.mono, lineHeight = m.sp(sz * 1.05f, 9.5f)), maxLines = lines.size, overflow = TextOverflow.Clip)
            }
        }
        if (card.points > 0) Box(Modifier.align(Alignment.TopEnd).padding(top = m.dp(2.6f), end = m.dp(3.4f))) {
            StarBadge(card.points, m.dp(13f), fontScale = 0.315f)
        }
    }
}

// ----- effect blocks -----

private sealed interface Block
private class Produces(val units: List<List<Res>>) : Block
private class Tile(val star: Boolean, val amount: Int, val label: String, val text: String) : Block
private class Chips(val label: String, val chips: List<Card>) : Block

private fun typeWord(t: CardType) = typeName(t)

private fun blocksOf(card: Card, ruleset: Ruleset): List<Block> = buildList {
    if (card.produces.isNotEmpty()) add(Produces(card.produces))
    if (card.coins > 0) add(Tile(false, card.coins, "NOW", "+${card.coins} coins from the bank"))
    when (val s = card.special) {
        is Special.CoinsPer -> add(Tile(false, s.coins, "NOW", "per your ${s.type.icon} ${typeWord(s.type)} card"))
        is Special.PointsPer -> add(Tile(true, s.points, "AT GAME END", "per your ${s.type.icon} ${typeWord(s.type)} card"))
        is Special.FreelancerPrice -> add(Tile(false, s.price, "ALWAYS", "Each freelancer costs you ${s.price}💰"))
        is Special.CoinRate -> add(Tile(true, 1, "AT GAME END", "per ${s.coinsPerPoint}💰"))
        null -> {}
    }
    val unlocks = ruleset.cards.filter { it.freeWith == card.id }
    if (unlocks.isNotEmpty()) add(Chips("MAKES FREE FOR YOU", unlocks))
    card.freeWith?.let { id -> ruleset.cardsById[id]?.let { add(Chips("FREE IF YOU BUILT", listOf(it))) } }
}

@Composable
private fun ProducesTile(b: Produces, m: Mm) {
    Row(
        Modifier.fillMaxWidth().height(m.dp(10f)).clip(RoundedCornerShape(m.dp(1.3f))).background(Palette.surface)
            .border(m.line(), Palette.of(CardType.TEAM), RoundedCornerShape(m.dp(1.3f))).padding(horizontal = m.dp(2f)),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        if (!m.compact) Column {
            Icon(Glyph.TEAM, m.dp(3f), tint = TeamLabel)
            BasicText("PRODUCES", style = TextStyle(color = TeamLabel, fontSize = m.sp(2.15f), fontWeight = FontWeight.Bold,
                fontFamily = Fonts.mono, letterSpacing = m.sp(0.2f)))
        }
        Row(Modifier.weight(1f), horizontalArrangement = Arrangement.spacedBy(m.dp(3f), Alignment.CenterHorizontally),
            verticalAlignment = Alignment.CenterVertically) {
            b.units.forEach { unit ->
                if (unit.size == 1) Icon(glyphOf(unit[0]), m.dp(7f))
                else Row(
                    Modifier.clip(RoundedCornerShape(m.dp(4f))).background(CardBg).border(m.line(0.3f), Palette.border, RoundedCornerShape(m.dp(4f)))
                        .padding(horizontal = m.dp(1.2f), vertical = m.dp(0.5f)),
                    verticalAlignment = Alignment.CenterVertically,
                ) {
                    unit.forEachIndexed { i, r ->
                        if (i > 0) BasicText("/", Modifier.padding(horizontal = m.dp(0.5f)), style = TextStyle(color = Palette.muted, fontSize = m.sp(3.4f)))
                        Icon(glyphOf(r), m.dp(7f))
                    }
                }
            }
        }
    }
}

@Composable
private fun EffectTile(b: Tile, m: Mm) {
    Row(
        Modifier.fillMaxWidth().heightIn(min = m.dp(9.6f)).clip(RoundedCornerShape(m.dp(1.3f))).background(Palette.surface)
            .border(m.line(), if (b.star) Palette.gold else GoldDark, RoundedCornerShape(m.dp(1.3f)))
            .padding(horizontal = m.dp(1.7f), vertical = m.dp(0.8f)),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        if (b.star) StarBadge(b.amount, m.dp(7f)) else CoinBadge(b.amount, m.dp(7f))
        Spacer(Modifier.width(m.dp(2.2f)))
        Column {
            if (!m.compact) BasicText(b.label, style = TextStyle(color = Palette.muted, fontSize = m.sp(1.9f), fontWeight = FontWeight.Bold,
                fontFamily = Fonts.mono, letterSpacing = m.sp(0.2f)))
            RichText(b.text, TextStyle(color = Palette.text, fontSize = m.sp(2.7f, 9f), fontWeight = FontWeight.Bold, fontFamily = Fonts.mono), maxLines = 2)
        }
    }
}

@Composable
private fun ChipRow(c: Card, m: Mm, inlineLabel: String?, owned: Boolean) {
    val shape = RoundedCornerShape(m.dp(1.3f))
    Row(
        Modifier.fillMaxWidth().height(m.dp(6.6f)).clip(shape).background(Palette.surface)
            .border(m.line(), if (owned) Palette.green else Palette.of(c.type), shape).padding(horizontal = m.dp(1.6f)),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        TypeSquare(c.type, m.dp(4.1f))
        Spacer(Modifier.width(m.dp(1.6f)))
        Column(Modifier.weight(1f)) {
            if (inlineLabel != null && !m.compact) BasicText(inlineLabel, style = TextStyle(color = Chain, fontSize = m.sp(1.65f),
                fontWeight = FontWeight.Bold, fontFamily = Fonts.mono, letterSpacing = m.sp(0.15f)))
            BasicText(c.name, style = TextStyle(color = Palette.text, fontSize = m.sp(if (inlineLabel != null) 2.6f else 2.9f, 9f),
                fontWeight = FontWeight.Bold, fontFamily = Fonts.mono), maxLines = 1, overflow = TextOverflow.Ellipsis)
        }
        if (!m.compact) BasicText("SPRINT ${roman(c.sprint)}", style = TextStyle(color = Palette.muted, fontSize = m.sp(2f),
            fontFamily = Fonts.mono, letterSpacing = m.sp(0.2f)))
    }
}

@Composable
private fun EffectBlocks(card: Card, ruleset: Ruleset, m: Mm, freeWithOwned: Boolean) {
    val blocks = blocksOf(card, ruleset)
    val compactChips = blocks.count { it is Chips } > 1 || m.compact
    Column(verticalArrangement = Arrangement.spacedBy(m.dp(1.6f))) {
        blocks.forEach { b ->
            when (b) {
                is Produces -> ProducesTile(b, m)
                is Tile -> EffectTile(b, m)
                is Chips -> Column(verticalArrangement = Arrangement.spacedBy(m.dp(1.2f))) {
                    if (!compactChips) Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(Glyph.CHAIN, m.dp(3.6f), tint = Chain)
                        Spacer(Modifier.width(m.dp(0.8f)))
                        BasicText(b.label, style = TextStyle(color = Chain, fontSize = m.sp(2.15f), fontWeight = FontWeight.Bold,
                            fontFamily = Fonts.mono, letterSpacing = m.sp(0.2f)))
                    }
                    val owned = b.label.startsWith("FREE IF") && freeWithOwned
                    b.chips.forEach { ChipRow(it, m, if (compactChips) b.label else null, owned) }
                }
            }
        }
    }
}

@Composable
private fun FlavorCode(card: Card, f: PrintFlavor, m: Mm) {
    Row(Modifier.fillMaxWidth().height(m.dp(8.4f)).clip(RoundedCornerShape(m.dp(1.2f))).background(CodeBg)) {
        Box(Modifier.width(m.dp(0.6f)).fillMaxHeight().background(Palette.of(card.type)))
        Column(Modifier.padding(horizontal = m.dp(1.3f)).fillMaxHeight(), verticalArrangement = Arrangement.Center) {
            val code = androidx.compose.ui.text.buildAnnotatedString {
                f.code.forEach { (c, s) -> pushStyle(androidx.compose.ui.text.SpanStyle(color = c)); append(s); pop() }
            }
            BasicText(code, style = TextStyle(fontSize = m.sp(1.95f), fontFamily = Fonts.mono), maxLines = 1, overflow = TextOverflow.Clip)
            BasicText("// ${f.comment}", style = TextStyle(color = Syntax.faint, fontSize = m.sp(1.85f), fontStyle = FontStyle.Italic, fontFamily = Fonts.mono),
                maxLines = 1, overflow = TextOverflow.Ellipsis)
        }
    }
}

enum class Mark { NONE, SELECTED, DISCARD }

/**
 * The playing card, the same template as the printed one (print/cards.js).
 * [status] is a one-line footer for the hand (can you build it and for how much).
 */
@Composable
fun CardView(
    card: Card,
    ruleset: Ruleset,
    width: Dp,
    height: Dp = width * 1.4f,
    status: String? = null,
    statusColor: Color = Palette.muted,
    freeWithOwned: Boolean = false,
    mark: Mark = Mark.NONE,
    dimmed: Boolean = false,
    onClick: (() -> Unit)? = null,
    /** Phone: long-press to inspect the card. */
    onLongClick: (() -> Unit)? = null,
    /** Inspection mode (preview popup): the card is shown large with all its text. */
    expanded: Boolean = false,
) {
    val m = Mm(width.value / 63f, compact = width < 170.dp && !expanded)
    val shape = RoundedCornerShape(m.dp(3f))
    val borderColor = when (mark) {
        Mark.SELECTED -> Palette.orange
        Mark.DISCARD -> Palette.red
        Mark.NONE -> Palette.border
    }
    val flavor = printFlavors[card.id]
    Column(
        Modifier.width(width).height(height)
            .alpha(if (dimmed) 0.4f else 1f)
            .clip(shape)
            .background(CardBg)
            .border(if (mark == Mark.NONE) 1.dp else 2.5.dp, borderColor, shape)
            .then(
                when {
                    onLongClick != null -> Modifier.combinedClickable(onClick = { onClick?.invoke() }, onLongClick = onLongClick).pointerHoverIcon(PointerIcon.Hand)
                    onClick != null -> Modifier.clickable(onClick = onClick).pointerHoverIcon(PointerIcon.Hand)
                    else -> Modifier
                }
            ),
    ) {
        Header(card, m)
        Column(Modifier.weight(1f).fillMaxWidth().padding(horizontal = m.dp(3.5f)).clipToBounds()) {
            Spacer(Modifier.height(m.dp(2.5f)))
            if (flavor != null) Image(
                painterResource(flavor.art), contentDescription = card.name,
                modifier = Modifier.fillMaxWidth().height(m.dp(30f)).clip(RoundedCornerShape(m.dp(1.4f))),
                contentScale = ContentScale.Crop,
            ) else CardArt(card, m.dp(30f))
            Spacer(Modifier.height(m.dp(2.6f)))
            EffectBlocks(card, ruleset, m, freeWithOwned)
            // Flavor code and sprint footer take the space that is left; they are dropped on small cards.
            BoxWithConstraints(Modifier.weight(1f).fillMaxWidth(), contentAlignment = Alignment.BottomStart) {
                val needFooter = m.dp(6f)
                val needCode = m.dp(10.2f)
                val room = maxHeight
                Column {
                    if (flavor != null && !m.compact && room >= needFooter + needCode) FlavorCode(card, flavor, m)
                    if (room >= needFooter) Row(Modifier.padding(top = m.dp(1.8f), bottom = m.dp(1.5f)), verticalAlignment = Alignment.CenterVertically) {
                        Box(Modifier.clip(RoundedCornerShape(m.dp(0.8f))).background(Surface2).padding(horizontal = m.dp(1.5f), vertical = m.dp(0.3f))) {
                            BasicText(roman(card.sprint), style = TextStyle(color = Palette.text, fontSize = m.sp(2.1f, 7f), fontWeight = FontWeight.ExtraBold, fontFamily = Fonts.mono))
                        }
                        Spacer(Modifier.width(m.dp(1.6f)))
                        BasicText(SPRINT_NAMES[card.sprint] ?: "", style = TextStyle(color = Palette.muted, fontSize = m.sp(2f, 7f), fontFamily = Fonts.mono, letterSpacing = m.sp(0.15f)))
                    }
                }
            }
        }
        if (status != null) {
            Box(Modifier.fillMaxWidth().background(Palette.bg.copy(alpha = 0.6f)).padding(horizontal = 9.dp, vertical = 6.dp)) {
                RichText(status, Type.mono.copy(color = statusColor, fontSize = 11.sp, fontWeight = FontWeight.Bold), maxLines = 1)
            }
        }
    }
}

/** A built card in a tableau: a slim version of the printed header (type colour, name, ⭐). */
@Composable
fun Strip(card: Card, modifier: Modifier = Modifier, highlight: Boolean = false, height: Dp = 26.dp, font: TextUnit = 12.sp) {
    val shape = RoundedCornerShape(5.dp)
    Box(
        modifier.height(height).clip(shape).background(Brush.linearGradient(gradientOf(card.type)))
            .then(if (highlight) Modifier.border(1.5.dp, Color.White, shape) else Modifier),
    ) {
        Stripes(Modifier.matchParentSize())
        Row(Modifier.fillMaxSize().padding(horizontal = 7.dp), verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(5.dp)) {
            Icon(glyphOf(card.type), (font.value).dp, tint = Color.White.copy(alpha = 0.9f))
            BasicText(
                card.name, Modifier.weight(1f),
                style = TextStyle(color = Color.White, fontSize = font, fontWeight = FontWeight.ExtraBold, fontFamily = Fonts.mono),
                maxLines = 1, overflow = TextOverflow.Ellipsis,
            )
            if (card.points > 0) StarBadge(card.points, (font.value * 1.9f).dp, fontScale = 0.42f)
        }
    }
}
