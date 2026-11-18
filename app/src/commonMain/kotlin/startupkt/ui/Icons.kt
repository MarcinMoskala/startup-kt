package startupkt.ui

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.text.BasicText
import androidx.compose.foundation.text.InlineTextContent
import androidx.compose.foundation.text.appendInlineContent
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.CornerRadius
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.drawscope.DrawScope
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.text.AnnotatedString
import androidx.compose.ui.text.Placeholder
import androidx.compose.ui.text.PlaceholderVerticalAlign
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.buildAnnotatedString
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.TextUnit
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.em
import androidx.compose.ui.unit.sp
import startupkt.engine.CardType
import startupkt.engine.Res
import kotlin.math.PI
import kotlin.math.cos
import kotlin.math.sin

/** All icons are drawn as vectors: the browser canvas font has no emoji glyphs. */
enum class Glyph { FRONTEND, BACKEND, AGENT, COIN, STAR, TEAM, FEATURE, LIBRARY, BUSINESS, CHAIN }

fun glyphOf(r: Res) = when (r) {
    Res.FRONTEND -> Glyph.FRONTEND
    Res.BACKEND -> Glyph.BACKEND
    Res.AGENT -> Glyph.AGENT
}

fun glyphOf(t: CardType) = when (t) {
    CardType.TEAM -> Glyph.TEAM
    CardType.FEATURE -> Glyph.FEATURE
    CardType.LIBRARY -> Glyph.LIBRARY
    CardType.BUSINESS -> Glyph.BUSINESS
}

@Composable
fun Icon(g: Glyph, size: Dp = 16.dp, tint: Color? = null, modifier: Modifier = Modifier) {
    Canvas(modifier.size(size)) { drawGlyph(g, tint) }
}

private fun DrawScope.drawGlyph(g: Glyph, tint: Color?) {
    val w = size.width
    val h = size.height
    val sw = w * 0.11f
    when (g) {
        Glyph.FRONTEND -> { // phone
            val c = tint ?: Palette.frontend
            drawRoundRect(c, Offset(w * 0.24f, h * 0.06f), Size(w * 0.52f, h * 0.88f), CornerRadius(w * 0.12f))
            drawRoundRect(Palette.bg, Offset(w * 0.32f, h * 0.17f), Size(w * 0.36f, h * 0.56f), CornerRadius(w * 0.04f))
            drawCircle(Palette.bg, radius = w * 0.06f, center = Offset(w * 0.5f, h * 0.83f))
        }
        Glyph.BACKEND -> { // server rack
            val c = tint ?: Palette.backend
            for (i in 0..2) {
                val top = h * (0.08f + i * 0.30f)
                drawRoundRect(c, Offset(w * 0.1f, top), Size(w * 0.8f, h * 0.24f), CornerRadius(w * 0.06f))
                drawCircle(Palette.bg, radius = w * 0.05f, center = Offset(w * 0.25f, top + h * 0.12f))
            }
        }
        Glyph.AGENT -> { // robot head
            val c = tint ?: Palette.agent
            drawLine(c, Offset(w * 0.5f, h * 0.06f), Offset(w * 0.5f, h * 0.24f), strokeWidth = sw)
            drawCircle(c, radius = w * 0.08f, center = Offset(w * 0.5f, h * 0.08f))
            drawRoundRect(c, Offset(w * 0.12f, h * 0.24f), Size(w * 0.76f, h * 0.66f), CornerRadius(w * 0.18f))
            drawCircle(Palette.bg, radius = w * 0.09f, center = Offset(w * 0.36f, h * 0.52f))
            drawCircle(Palette.bg, radius = w * 0.09f, center = Offset(w * 0.64f, h * 0.52f))
            drawRoundRect(Palette.bg, Offset(w * 0.34f, h * 0.70f), Size(w * 0.32f, h * 0.07f), CornerRadius(w * 0.03f))
        }
        Glyph.COIN -> {
            val c = tint ?: Palette.gold
            drawCircle(c, radius = w * 0.46f)
            drawCircle(Color(0xFFB8862A), radius = w * 0.34f, style = Stroke(width = w * 0.07f))
            drawRoundRect(Color(0xFFB8862A), Offset(w * 0.44f, h * 0.30f), Size(w * 0.12f, h * 0.40f), CornerRadius(w * 0.03f))
        }
        Glyph.STAR, Glyph.FEATURE -> {
            val c = tint ?: if (g == Glyph.STAR) Palette.gold else Palette.of(CardType.FEATURE)
            drawPath(starPath(w, h), c)
        }
        Glyph.TEAM -> { // person
            val c = tint ?: Palette.of(CardType.TEAM)
            drawCircle(c, radius = w * 0.2f, center = Offset(w * 0.5f, h * 0.3f))
            drawRoundRect(c, Offset(w * 0.16f, h * 0.56f), Size(w * 0.68f, h * 0.4f), CornerRadius(w * 0.3f))
        }
        Glyph.LIBRARY -> { // book
            val c = tint ?: Palette.of(CardType.LIBRARY)
            drawRoundRect(c, Offset(w * 0.14f, h * 0.1f), Size(w * 0.72f, h * 0.8f), CornerRadius(w * 0.08f))
            drawRect(Palette.bg, Offset(w * 0.26f, h * 0.1f), Size(w * 0.06f, h * 0.8f))
            drawRect(Palette.bg, Offset(w * 0.42f, h * 0.3f), Size(w * 0.32f, h * 0.06f))
            drawRect(Palette.bg, Offset(w * 0.42f, h * 0.45f), Size(w * 0.24f, h * 0.06f))
        }
        Glyph.CHAIN -> { // two links
            val c = tint ?: Palette.kotlinLight
            val st = Stroke(width = w * 0.13f)
            drawRoundRect(c, Offset(w * 0.06f, h * 0.36f), Size(w * 0.5f, h * 0.3f), CornerRadius(w * 0.15f), style = st)
            drawRoundRect(c, Offset(w * 0.44f, h * 0.36f), Size(w * 0.5f, h * 0.3f), CornerRadius(w * 0.15f), style = st)
        }
        Glyph.BUSINESS -> { // briefcase
            val c = tint ?: Palette.of(CardType.BUSINESS)
            drawRoundRect(c, Offset(w * 0.34f, h * 0.14f), Size(w * 0.32f, h * 0.2f), CornerRadius(w * 0.06f), style = Stroke(width = sw))
            drawRoundRect(c, Offset(w * 0.08f, h * 0.3f), Size(w * 0.84f, h * 0.58f), CornerRadius(w * 0.1f))
            drawRect(Palette.bg, Offset(w * 0.08f, h * 0.52f), Size(w * 0.84f, h * 0.05f))
        }
    }
}

private fun starPath(w: Float, h: Float): Path {
    val path = Path()
    val cx = w / 2
    val cy = h * 0.54f
    val outer = w * 0.48f
    val inner = w * 0.2f
    for (i in 0 until 10) {
        val r = if (i % 2 == 0) outer else inner
        val a = -PI / 2 + i * PI / 5
        val x = cx + (r * cos(a)).toFloat()
        val y = cy + (r * sin(a)).toFloat()
        if (i == 0) path.moveTo(x, y) else path.lineTo(x, y)
    }
    path.close()
    return path
}

private val tokens: Map<String, Glyph> = mapOf(
    "📱" to Glyph.FRONTEND, "🖥" to Glyph.BACKEND, "🤖" to Glyph.AGENT, "💰" to Glyph.COIN,
    "⭐" to Glyph.STAR, "👥" to Glyph.TEAM, "📚" to Glyph.LIBRARY, "💼" to Glyph.BUSINESS,
)

/** Text where emoji tokens (📱🖥🤖💰⭐👥📚💼) are replaced by inline vector icons. */
@Composable
fun RichText(text: String, style: TextStyle = Type.body, modifier: Modifier = Modifier, maxLines: Int = Int.MAX_VALUE) {
    val clean = text.replace("️", "")
    val used = mutableSetOf<Glyph>()
    val annotated: AnnotatedString = buildAnnotatedString {
        var i = 0
        while (i < clean.length) {
            val match = tokens.keys.firstOrNull { clean.startsWith(it, i) }
            if (match != null) {
                val g = tokens.getValue(match)
                used += g
                appendInlineContent(g.name, "[${g.name}]")
                i += match.length
            } else {
                append(clean[i]); i++
            }
        }
    }
    val inline = used.associate { g ->
        g.name to InlineTextContent(Placeholder(1.15.em, 1.15.em, PlaceholderVerticalAlign.TextCenter)) {
            Canvas(Modifier.fillMaxSize()) { drawGlyph(g, null) }
        }
    }
    BasicText(annotated, modifier, style = style, maxLines = maxLines, overflow = androidx.compose.ui.text.style.TextOverflow.Ellipsis, inlineContent = inline)
}

/** A number with an icon, e.g. "6 ★" or (iconFirst) "★ 6". */
@Composable
fun Amount(value: Int, glyph: Glyph, size: TextUnit = 14.sp, color: Color = Palette.text, prefix: String = "", iconFirst: Boolean = false) {
    androidx.compose.foundation.layout.Row(verticalAlignment = Alignment.CenterVertically) {
        val gap = (size.value * 0.25f).dp
        if (iconFirst) { Icon(glyph, (size.value * 1.15f).dp); androidx.compose.foundation.layout.Spacer(Modifier.size(gap)) }
        BasicText("$prefix$value", style = TextStyle(color = color, fontSize = size, fontWeight = FontWeight.Bold))
        if (!iconFirst) { androidx.compose.foundation.layout.Spacer(Modifier.size(gap)); Icon(glyph, (size.value * 1.15f).dp) }
    }
}
