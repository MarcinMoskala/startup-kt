package startupkt.ui

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.size
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clipToBounds
import androidx.compose.ui.geometry.CornerRadius
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.drawscope.DrawScope
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.graphics.lerp
import androidx.compose.ui.unit.Dp
import startupkt.engine.Card
import kotlin.math.PI
import kotlin.math.cos
import kotlin.math.min
import kotlin.math.sin

/*
 * Flat vector illustrations for every card and a logo for every startup.
 * Everything is drawn on a Canvas (no image assets), in a 100×100 unit square, with a small palette per card:
 * W = paper white, L = light accent, A = accent, D = dark accent, K = ink, plus resource colours.
 */

/** Drawing helper working in a 100×100 unit square placed at ([ox], [oy]) with scale [s] px per unit. */
class Pen(val ds: DrawScope, val ox: Float, val oy: Float, val s: Float, val accent: Color) {
    val W = Color(0xFFF7F5FF)
    val L = lerp(accent, Color.White, 0.5f)
    val A = accent
    val D = lerp(accent, Color.Black, 0.45f)
    val K = Color(0xFF1E1F22)
    val F = Palette.frontend
    val B = Palette.backend
    val R = Palette.agent
    val G = Palette.gold
    /** Approximate band background, used to "cut" shapes (e.g. a cookie bite). */
    val BG = lerp(accent, Palette.surface, 0.62f)

    private fun o(x: Float, y: Float) = Offset(ox + x * s, oy + y * s)

    fun rect(x: Float, y: Float, w: Float, h: Float, c: Color, r: Float = 0f) =
        ds.drawRoundRect(c, o(x, y), Size(w * s, h * s), CornerRadius(r * s))

    fun frame(x: Float, y: Float, w: Float, h: Float, c: Color, r: Float = 0f, sw: Float = 3f) =
        ds.drawRoundRect(c, o(x, y), Size(w * s, h * s), CornerRadius(r * s), style = Stroke(sw * s))

    fun circle(x: Float, y: Float, r: Float, c: Color) = ds.drawCircle(c, r * s, o(x, y))

    fun ring(x: Float, y: Float, r: Float, c: Color, sw: Float = 3f) = ds.drawCircle(c, r * s, o(x, y), style = Stroke(sw * s))

    fun line(x1: Float, y1: Float, x2: Float, y2: Float, c: Color, sw: Float = 3f) =
        ds.drawLine(c, o(x1, y1), o(x2, y2), sw * s, cap = StrokeCap.Round)

    fun poly(c: Color, vararg p: Float) {
        val path = Path()
        for (i in p.indices step 2) {
            val q = o(p[i], p[i + 1])
            if (i == 0) path.moveTo(q.x, q.y) else path.lineTo(q.x, q.y)
        }
        path.close()
        ds.drawPath(path, c)
    }

    fun polyline(c: Color, sw: Float, vararg p: Float) {
        for (i in 0 until p.size - 2 step 2) line(p[i], p[i + 1], p[i + 2], p[i + 3], c, sw)
    }

    fun arc(x: Float, y: Float, r: Float, start: Float, sweep: Float, c: Color, sw: Float = 3f) =
        ds.drawArc(c, start, sweep, false, o(x - r, y - r), Size(2 * r * s, 2 * r * s), style = Stroke(sw * s, cap = StrokeCap.Round))

    fun pie(x: Float, y: Float, r: Float, start: Float, sweep: Float, c: Color) =
        ds.drawArc(c, start, sweep, true, o(x - r, y - r), Size(2 * r * s, 2 * r * s))

    fun star(x: Float, y: Float, r: Float, c: Color) {
        val path = Path()
        for (i in 0 until 10) {
            val rr = if (i % 2 == 0) r else r * 0.42f
            val a = -PI / 2 + i * PI / 5
            val q = o(x + (rr * cos(a)).toFloat(), y + (rr * sin(a)).toFloat())
            if (i == 0) path.moveTo(q.x, q.y) else path.lineTo(q.x, q.y)
        }
        path.close()
        ds.drawPath(path, c)
    }

    // ---------- Building blocks ----------

    /** A person bust; [glasses] marks seniors. */
    fun person(x: Float, y: Float, k: Float = 1f, shirt: Color = A, glasses: Boolean = false) {
        rect(x - 17 * k, y + 8 * k, 34 * k, 26 * k, shirt, 14 * k)
        circle(x, y - 6 * k, 12 * k, Color(0xFFF1C9A5))
        // hair
        pie(x, y - 8 * k, 12.5f * k, 180f, 180f, Color(0xFF4A3426))
        if (glasses) {
            ring(x - 5 * k, y - 4 * k, 3.6f * k, K, 1.6f * k)
            ring(x + 5 * k, y - 4 * k, 3.6f * k, K, 1.6f * k)
            line(x - 1.4f * k, y - 4 * k, x + 1.4f * k, y - 4 * k, K, 1.4f * k)
        } else {
            circle(x - 4.5f * k, y - 4 * k, 1.5f * k, K)
            circle(x + 4.5f * k, y - 4 * k, 1.5f * k, K)
        }
    }

    fun phone(x: Float, y: Float, k: Float = 1f, c: Color = F, screen: Color = K) {
        rect(x - 10 * k, y - 18 * k, 20 * k, 36 * k, c, 4 * k)
        rect(x - 7.5f * k, y - 14 * k, 15 * k, 25 * k, screen, 1.5f * k)
        circle(x, y + 14.5f * k, 1.6f * k, screen)
    }

    fun server(x: Float, y: Float, k: Float = 1f, c: Color = B) {
        for (i in 0..2) {
            val top = y - 16 * k + i * 11 * k
            rect(x - 15 * k, top, 30 * k, 9 * k, c, 2.5f * k)
            circle(x - 10 * k, top + 4.5f * k, 1.6f * k, K)
            line(x + 1 * k, top + 4.5f * k, x + 10 * k, top + 4.5f * k, K, 1.6f * k)
        }
    }

    fun robot(x: Float, y: Float, k: Float = 1f, c: Color = R) {
        line(x, y - 20 * k, x, y - 12 * k, c, 2.4f * k)
        circle(x, y - 21 * k, 3 * k, G)
        rect(x - 15 * k, y - 12 * k, 30 * k, 24 * k, c, 7 * k)
        rect(x - 10 * k, y - 6 * k, 20 * k, 10 * k, K, 4 * k)
        circle(x - 5 * k, y - 1 * k, 2.4f * k, Color(0xFF7CF5D2))
        circle(x + 5 * k, y - 1 * k, 2.4f * k, Color(0xFF7CF5D2))
        rect(x - 18 * k, y - 3 * k, 3 * k, 8 * k, c, 1.5f * k)
        rect(x + 15 * k, y - 3 * k, 3 * k, 8 * k, c, 1.5f * k)
    }

    fun laptop(x: Float, y: Float, k: Float = 1f) {
        rect(x - 18 * k, y - 14 * k, 36 * k, 24 * k, W, 3 * k)
        rect(x - 15 * k, y - 11 * k, 30 * k, 18 * k, K, 1.5f * k)
        rect(x - 23 * k, y + 10 * k, 46 * k, 5 * k, L, 2.5f * k)
    }

    fun window(x: Float, y: Float, w: Float, h: Float, body: Color = W) {
        rect(x, y, w, h, body, 4f)
        rect(x, y, w, 8f, D, 4f)
        rect(x, y + 4f, w, 4f, D)
        circle(x + 5f, y + 4f, 1.5f, Palette.red)
        circle(x + 10f, y + 4f, 1.5f, G)
        circle(x + 15f, y + 4f, 1.5f, Palette.green)
    }

    fun coin(x: Float, y: Float, r: Float) {
        circle(x, y, r, G)
        ring(x, y, r * 0.72f, Color(0xFFB8862A), r * 0.14f)
        rect(x - r * 0.12f, y - r * 0.4f, r * 0.24f, r * 0.8f, Color(0xFFB8862A), r * 0.06f)
    }

    fun bubble(x: Float, y: Float, w: Float, h: Float, c: Color, tailLeft: Boolean = true) {
        rect(x, y, w, h, c, 6f)
        if (tailLeft) poly(c, x + 6, y + h - 1, x + 6, y + h + 7, x + 14, y + h - 1)
        else poly(c, x + w - 6, y + h - 1, x + w - 6, y + h + 7, x + w - 14, y + h - 1)
    }

    fun cylinder(x: Float, y: Float, w: Float, h: Float, c: Color) {
        rect(x - w / 2, y - h / 2, w, h, c)
        ds.drawOval(lerp(c, Color.White, 0.35f), o(x - w / 2, y - h / 2 - 5), Size(w * s, 10 * s))
        ds.drawOval(c, o(x - w / 2, y + h / 2 - 5), Size(w * s, 10 * s))
        ds.drawArc(lerp(c, Color.Black, 0.25f), 0f, 180f, false, o(x - w / 2, y - 5), Size(w * s, 10 * s), style = Stroke(1.6f * s))
    }

    fun gear(x: Float, y: Float, r: Float, c: Color, hole: Color = K) {
        for (i in 0 until 8) {
            val a = i * PI / 4
            val cx = x + (r * cos(a)).toFloat()
            val cy = y + (r * sin(a)).toFloat()
            circle(cx, cy, r * 0.28f, c)
        }
        circle(x, y, r * 0.95f, c)
        circle(x, y, r * 0.4f, hole)
    }
}

/** Draws the illustration of card [id]. */
private fun Pen.drawCardArt(id: String) {
    when (id) {
        // ---------------- Team ----------------
        "junior-compose-dev" -> { person(40f, 50f); phone(72f, 54f, 0.8f); star(86f, 26f, 5f, G) }
        "junior-backend-dev" -> { person(38f, 50f); server(72f, 56f, 0.8f) }
        "mid-fullstack-dev" -> { person(30f, 52f, 0.9f); laptop(68f, 58f, 0.8f); phone(84f, 34f, 0.4f); server(56f, 26f, 0.35f) }
        "junie" -> {
            robot(50f, 56f, 1.2f)
            polyline(W, 3f, 16f, 30f, 10f, 38f, 16f, 46f)
            polyline(W, 3f, 84f, 30f, 90f, 38f, 84f, 46f)
        }
        "claude-code" -> {
            rect(16f, 22f, 68f, 54f, K, 6f)
            rect(16f, 22f, 68f, 10f, D, 6f); rect(16f, 27f, 68f, 5f, D)
            polyline(Color(0xFF7CF5D2), 3.5f, 26f, 44f, 34f, 50f, 26f, 56f)
            line(40f, 57f, 54f, 57f, W, 3.5f)
            for (i in 0 until 8) {
                val a = i * PI / 4
                line(70f, 50f, 70f + (8 * cos(a)).toFloat(), 50f + (8 * sin(a)).toFloat(), Color(0xFFE07A5F), 2.6f)
            }
        }
        "ui-designer" -> {
            person(36f, 52f, 0.9f, shirt = Color(0xFFE25C8A))
            circle(72f, 52f, 17f, W)
            circle(66f, 45f, 3.5f, Palette.red); circle(75f, 42f, 3.5f, G); circle(81f, 50f, 3.5f, F); circle(76f, 59f, 3.5f, Palette.green)
            circle(66f, 58f, 4f, K)
        }
        "senior-compose-dev" -> { person(36f, 50f, glasses = true); phone(68f, 54f, 0.7f); phone(82f, 50f, 0.7f) }
        "senior-backend-dev" -> { person(34f, 50f, glasses = true); server(70f, 46f, 0.6f); server(70f, 70f, 0.6f) }
        "fullstack-senior" -> { person(34f, 50f, glasses = true); phone(66f, 52f, 0.7f); server(84f, 54f, 0.5f) }
        "agents-with-mcp" -> {
            robot(26f, 56f, 0.8f); robot(74f, 56f, 0.8f)
            line(41f, 58f, 59f, 58f, W, 3f)
            rect(45f, 52f, 10f, 12f, G, 2f)
            line(48f, 48f, 48f, 52f, G, 2f); line(52f, 48f, 52f, 52f, G, 2f)
        }
        "qa-engineer" -> {
            // bug
            ds.drawOval(Palette.red, Offset(ox + 30 * s, oy + 38 * s), Size(24 * s, 30 * s))
            circle(42f, 36f, 7f, K)
            for (dy in listOf(44f, 52f, 60f)) { line(30f, dy, 22f, dy - 4, K, 2f); line(54f, dy, 62f, dy - 4, K, 2f) }
            line(42f, 40f, 42f, 66f, K, 1.6f)
            // magnifier
            ring(58f, 44f, 14f, W, 4f)
            line(68f, 54f, 80f, 66f, W, 6f)
        }
        "tech-lead" -> {
            person(26f, 58f, 0.65f, shirt = L); person(74f, 58f, 0.65f, shirt = L)
            person(50f, 50f, 1f, glasses = true)
            line(68f, 18f, 68f, 36f, W, 2.4f)
            poly(G, 68f, 18f, 82f, 22f, 68f, 27f)
        }

        // ---------------- Libraries ----------------
        "compose-multiplatform" -> {
            rect(14f, 30f, 46f, 32f, W, 3f); rect(17f, 33f, 40f, 26f, K, 1.5f); rect(30f, 62f, 14f, 6f, L)
            rect(46f, 36f, 26f, 36f, L, 4f); rect(49f, 40f, 20f, 28f, K, 1.5f)
            phone(80f, 58f, 0.65f)
            rect(21f, 37f, 14f, 4f, A, 2f); rect(21f, 44f, 22f, 3f, L, 1.5f)
        }
        "ktor" -> {
            server(40f, 52f, 1f)
            polyline(G, 4f, 74f, 26f, 64f, 46f, 76f, 46f, 66f, 68f)
        }
        "kotlinx-coroutines" -> {
            for ((i, c) in listOf(F, B, R).withIndex()) {
                val y = 34f + i * 16f
                line(16f, y, 84f, y, L, 2f)
                circle(30f + i * 14f, y, 5f, c); circle(62f + i * 6f, y, 5f, c)
            }
            poly(W, 84f, 26f, 92f, 34f, 84f, 42f)
        }
        "kotlinx-serialization" -> {
            rect(26f, 18f, 48f, 62f, W, 4f)
            polyline(A, 3.5f, 38f, 30f, 33f, 34f, 33f, 46f, 29f, 49f, 33f, 52f, 33f, 64f, 38f, 68f)
            polyline(A, 3.5f, 62f, 30f, 67f, 34f, 67f, 46f, 71f, 49f, 67f, 52f, 67f, 64f, 62f, 68f)
            line(42f, 40f, 58f, 40f, D, 3f); line(42f, 49f, 54f, 49f, D, 3f); line(42f, 58f, 58f, 58f, D, 3f)
        }
        "exposed" -> { cylinder(42f, 52f, 36f, 36f, W); rect(54f, 48f, 32f, 20f, K, 3f); line(59f, 55f, 80f, 55f, Color(0xFF7CF5D2), 2.4f); line(59f, 61f, 72f, 61f, L, 2.4f) }
        "koin" -> {
            rect(18f, 36f, 30f, 30f, W, 5f); rect(52f, 36f, 30f, 30f, L, 5f)
            circle(48f, 51f, 7f, W)
            circle(52f, 51f, 5f, K)
            coin(33f, 51f, 8f)
        }
        "sqldelight" -> { cylinder(36f, 54f, 34f, 34f, W); phone(72f, 52f, 0.8f); line(52f, 54f, 62f, 54f, G, 3f) }
        "koog" -> { robot(40f, 56f, 1f); gear(74f, 36f, 10f, W, D); line(58f, 52f, 68f, 44f, W, 3f) }
        "kotlin-wasm" -> {
            window(14f, 22f, 72f, 56f)
            val hx = 50f; val hy = 54f
            poly(A, hx, hy - 16, hx + 14, hy - 8, hx + 14, hy + 8, hx, hy + 16, hx - 14, hy + 8, hx - 14, hy - 8)
            poly(W, hx, hy - 8, hx + 7, hy - 4, hx + 7, hy + 4, hx, hy + 8, hx - 7, hy + 4, hx - 7, hy - 4)
        }
        "amper" -> { gear(42f, 50f, 16f, W, A); rect(66f, 34f, 18f, 14f, L, 2f); rect(66f, 54f, 18f, 14f, G, 2f) }

        // ---------------- Sprint I features ----------------
        "login-screen" -> {
            phone(50f, 50f, 1.35f, c = W, screen = D)
            rect(40f, 40f, 20f, 15f, G, 3f)
            arc(50f, 40f, 7f, 180f, 180f, G, 3.2f)
            circle(50f, 47f, 2f, K)
            rect(40f, 60f, 20f, 3f, L, 1.5f)
        }
        "dark-mode" -> {
            circle(50f, 50f, 22f, W)
            circle(62f, 40f, 19f, BG)
            star(24f, 28f, 5f, G); star(80f, 70f, 4f, G); star(76f, 24f, 3f, W)
        }
        "profile-screen" -> {
            phone(50f, 50f, 1.35f, c = W, screen = D)
            circle(50f, 40f, 8f, L)
            rect(40f, 52f, 20f, 3f, W, 1.5f); rect(43f, 58f, 14f, 3f, L, 1.5f)
        }
        "health-check" -> {
            circle(38f, 44f, 14f, Palette.red); circle(62f, 44f, 14f, Palette.red)
            poly(Palette.red, 25f, 50f, 75f, 50f, 50f, 76f)
            polyline(W, 3.5f, 14f, 52f, 34f, 52f, 40f, 40f, 48f, 62f, 54f, 48f, 86f, 48f)
        }
        "settings-screen" -> {
            for (i in 0..2) {
                val y = 30f + i * 18f
                rect(22f, y, 56f, 12f, W, 6f)
                circle(if (i == 1) 34f else 66f, y + 6f, 4.5f, if (i == 1) L else A)
            }
        }

        // ---------------- Sprint II features ----------------
        "ios-app" -> { phone(40f, 52f, 1.2f, c = W); phone(64f, 54f, 1f, c = F); circle(40f, 48f, 5f, A) }
        "rest-api" -> {
            rect(12f, 34f, 26f, 30f, W, 4f); server(72f, 52f, 0.75f)
            line(42f, 44f, 58f, 44f, G, 3f); poly(G, 58f, 39f, 64f, 44f, 58f, 49f)
            line(42f, 56f, 58f, 56f, L, 3f); poly(L, 42f, 51f, 36f, 56f, 42f, 61f)
            polyline(A, 2.6f, 20f, 42f, 17f, 49f, 20f, 56f); polyline(A, 2.6f, 30f, 42f, 33f, 49f, 30f, 56f)
        }
        "payments" -> {
            rect(16f, 28f, 62f, 40f, W, 5f)
            rect(16f, 36f, 62f, 8f, D)
            rect(24f, 52f, 12f, 9f, G, 2f)
            coin(76f, 66f, 11f)
        }
        "push-notifications" -> {
            poly(W, 34f, 62f, 66f, 62f, 62f, 54f, 62f, 40f, 50f, 28f, 38f, 40f, 38f, 54f)
            circle(50f, 40f, 12f, W)
            circle(50f, 67f, 5f, W)
            circle(66f, 30f, 7f, Palette.red)
        }
        "onboarding" -> {
            rect(16f, 30f, 22f, 36f, L, 3f); rect(39f, 24f, 22f, 42f, W, 3f); rect(62f, 30f, 22f, 36f, L, 3f)
            circle(50f, 40f, 6f, A)
            circle(42f, 76f, 2.5f, W); circle(50f, 76f, 2.5f, L); circle(58f, 76f, 2.5f, L)
        }
        "search" -> { ring(44f, 44f, 18f, W, 6f); line(57f, 57f, 74f, 74f, W, 9f); line(36f, 40f, 44f, 34f, L, 3f) }
        "map-view" -> {
            poly(L, 14f, 34f, 38f, 26f, 62f, 34f, 86f, 26f, 86f, 70f, 62f, 78f, 38f, 70f, 14f, 78f)
            line(38f, 26f, 38f, 70f, A, 1.6f); line(62f, 34f, 62f, 78f, A, 1.6f)
            circle(50f, 40f, 11f, Palette.red)
            poly(Palette.red, 40.5f, 44f, 59.5f, 44f, 50f, 62f)
            circle(50f, 40f, 4f, W)
        }
        "crash-reporting" -> {
            poly(G, 50f, 20f, 82f, 74f, 18f, 74f)
            rect(47f, 38f, 6f, 20f, K, 3f); circle(50f, 65f, 3.5f, K)
        }

        // ---------------- Sprint III features ----------------
        "ai-assistant" -> { phone(36f, 52f, 1.2f, c = W); bubble(52f, 24f, 34f, 22f, R, tailLeft = true); star(69f, 35f, 6f, W) }
        "multi-agent-workflow" -> {
            robot(50f, 34f, 0.6f); robot(24f, 66f, 0.6f); robot(76f, 66f, 0.6f)
            line(40f, 44f, 30f, 54f, W, 2.4f); line(60f, 44f, 70f, 54f, W, 2.4f); line(36f, 70f, 64f, 70f, W, 2.4f)
        }
        "realtime-chat" -> {
            bubble(12f, 24f, 46f, 24f, W, tailLeft = true)
            bubble(42f, 50f, 46f, 24f, L, tailLeft = false)
            for (i in 0..2) { circle(26f + i * 9f, 36f, 2.6f, A); circle(56f + i * 9f, 62f, 2.6f, D) }
        }
        "offline-mode" -> {
            circle(36f, 52f, 14f, W); circle(54f, 44f, 18f, W); circle(70f, 54f, 12f, W)
            rect(30f, 52f, 44f, 14f, W)
            line(24f, 26f, 78f, 76f, Palette.red, 5f)
        }
        "web-version" -> {
            window(12f, 22f, 76f, 56f)
            rect(18f, 36f, 20f, 36f, L, 2f); rect(42f, 36f, 40f, 16f, A, 2f); rect(42f, 56f, 18f, 16f, L, 2f); rect(64f, 56f, 18f, 16f, L, 2f)
        }
        "scale-to-1m" -> {
            poly(W, 50f, 14f, 62f, 34f, 62f, 62f, 38f, 62f, 38f, 34f)
            circle(50f, 38f, 6f, F)
            poly(Palette.red, 38f, 50f, 26f, 66f, 38f, 62f); poly(Palette.red, 62f, 50f, 74f, 66f, 62f, 62f)
            poly(G, 42f, 64f, 58f, 64f, 50f, 84f)
        }
        "app-store-featured" -> {
            rect(36f, 62f, 28f, 8f, G, 2f); rect(42f, 56f, 16f, 8f, G)
            pie(50f, 30f, 20f, 0f, 180f, G)
            ring(26f, 36f, 7f, G, 3f); ring(74f, 36f, 7f, G, 3f)
            star(50f, 40f, 9f, W)
        }
        "admin-panel" -> {
            rect(14f, 22f, 72f, 56f, W, 4f)
            rect(14f, 22f, 16f, 56f, D, 4f)
            for ((i, h) in listOf(14f, 24f, 18f, 30f).withIndex()) rect(38f + i * 11f, 62f - h, 7f, h, A, 1.5f)
            line(38f, 68f, 80f, 68f, L, 2.5f)
        }
        "kotlinconf-keynote" -> {
            poly(Color(0x55FFFFFF), 50f, 10f, 30f, 72f, 70f, 72f)
            rect(14f, 72f, 72f, 8f, D, 2f)
            person(50f, 52f, 0.75f, shirt = A)
            line(64f, 50f, 64f, 70f, W, 2f); circle(64f, 48f, 3f, W)
        }
        "accessibility" -> {
            circle(50f, 50f, 30f, W)
            circle(50f, 32f, 5f, A)
            line(34f, 42f, 66f, 42f, A, 4f)
            line(50f, 42f, 50f, 58f, A, 5f)
            line(50f, 58f, 42f, 72f, A, 4f); line(50f, 58f, 58f, 72f, A, 4f)
        }
        "home-widgets" -> {
            phone(50f, 50f, 1.4f, c = W, screen = D)
            rect(40f, 32f, 9f, 9f, A, 2f); rect(51f, 32f, 9f, 9f, G, 2f); rect(40f, 43f, 20f, 9f, L, 2f); rect(40f, 54f, 9f, 9f, F, 2f); rect(51f, 54f, 9f, 9f, Palette.green, 2f)
        }
        "security-audit" -> {
            poly(W, 50f, 16f, 76f, 26f, 74f, 52f, 50f, 80f, 26f, 52f, 24f, 26f)
            polyline(Palette.green, 5f, 38f, 48f, 47f, 58f, 64f, 38f)
        }
        "localization" -> {
            circle(42f, 54f, 22f, W)
            ring(42f, 54f, 22f, A, 2f)
            ds.drawOval(A, Offset(ox + 32 * s, oy + 32 * s), Size(20 * s, 44 * s), style = Stroke(2f * s))
            line(20f, 54f, 64f, 54f, A, 2f)
            bubble(58f, 18f, 28f, 22f, G, tailLeft = true)
            polyline(K, 3f, 66f, 34f, 72f, 23f, 78f, 34f); line(68f, 30f, 76f, 30f, K, 2.4f)
        }
        "gdpr-compliance" -> {
            circle(50f, 50f, 26f, Color(0xFFD9A066))
            circle(74f, 32f, 11f, BG)
            for ((x, y) in listOf(40f to 40f, 56f to 50f, 44f to 62f, 60f to 66f, 34f to 54f)) circle(x, y, 3.6f, Color(0xFF5B3A1E))
        }
        "product-hunt-launch" -> {
            circle(50f, 50f, 28f, W)
            poly(Color(0xFFDA552F), 50f, 30f, 66f, 54f, 34f, 54f)
            rect(44f, 54f, 12f, 14f, Color(0xFFDA552F), 2f)
        }
        "dokka-docs" -> {
            rect(26f, 18f, 44f, 60f, W, 4f)
            poly(L, 58f, 18f, 70f, 30f, 58f, 30f)
            polyline(A, 3f, 40f, 34f, 34f, 40f, 40f, 46f); polyline(A, 3f, 52f, 34f, 58f, 40f, 52f, 46f)
            line(34f, 56f, 62f, 56f, L, 3f); line(34f, 64f, 56f, 64f, L, 3f)
        }
        "wear-os-app" -> {
            rect(40f, 14f, 20f, 72f, D, 6f)
            circle(50f, 50f, 20f, W)
            circle(50f, 50f, 16f, K)
            line(50f, 50f, 50f, 40f, Color(0xFF7CF5D2), 2.6f); line(50f, 50f, 58f, 54f, W, 2.6f)
        }

        // ---------------- Business ----------------
        "seed-round" -> {
            rect(34f, 62f, 32f, 16f, D, 3f)
            line(50f, 62f, 50f, 36f, Palette.green, 4f)
            ds.drawOval(Palette.green, Offset(ox + 30 * s, oy + 30 * s), Size(20 * s, 12 * s))
            ds.drawOval(Palette.green, Offset(ox + 50 * s, oy + 24 * s), Size(20 * s, 12 * s))
            coin(74f, 54f, 9f)
        }
        "outsourcing-partner" -> {
            rect(18f, 28f, 32f, 50f, W, 3f)
            for (r in 0..3) for (c in 0..1) rect(23f + c * 13f, 33f + r * 11f, 9f, 7f, L, 1.5f)
            line(56f, 40f, 82f, 40f, G, 3.5f); poly(G, 82f, 34f, 90f, 40f, 82f, 46f)
            line(56f, 60f, 82f, 60f, L, 3.5f); poly(L, 56f, 54f, 48f, 60f, 56f, 66f)
        }
        "hackathon" -> {
            poly(Color(0xFFF2C14E), 30f, 24f, 74f, 30f, 46f, 80f)
            arc(52f, 27f, 22f, 190f, 30f, Color(0xFFC8873A), 6f)
            poly(Color(0xFFC8873A), 28f, 20f, 76f, 26f, 74f, 32f, 30f, 26f)
            for ((x, y) in listOf(46f to 40f, 58f to 42f, 48f to 56f)) circle(x, y, 4f, Palette.red)
        }
        "angel-investor" -> {
            ds.drawOval(W, Offset(ox + 12 * s, oy + 34 * s), Size(30 * s, 18 * s))
            ds.drawOval(W, Offset(ox + 58 * s, oy + 34 * s), Size(30 * s, 18 * s))
            coin(50f, 50f, 17f)
            ring(50f, 24f, 9f, G, 2.6f)
        }
        "eu-grant" -> {
            circle(50f, 50f, 32f, Color(0xFF2A4BB8))
            for (i in 0 until 12) {
                val a = i * PI / 6
                star(50f + (22 * cos(a)).toFloat(), 50f + (22 * sin(a)).toFloat(), 4f, G)
            }
        }
        "series-a" -> {
            for (i in 0..3) coin(30f, 70f - i * 8f, 11f)
            for (i in 0..5) coin(58f, 70f - i * 8f, 11f)
            line(70f, 64f, 86f, 28f, Palette.green, 4f); poly(Palette.green, 80f, 28f, 88f, 22f, 90f, 32f)
        }
        "first-paying-customers" -> {
            poly(W, 26f, 36f, 74f, 36f, 70f, 78f, 30f, 78f)
            arc(50f, 36f, 12f, 180f, 180f, W, 4f)
            coin(50f, 58f, 11f)
        }
        "kotlinconf-talk" -> {
            rect(40f, 16f, 20f, 34f, W, 10f)
            for (i in 0..3) line(43f, 24f + i * 6f, 57f, 24f + i * 6f, L, 1.6f)
            arc(50f, 40f, 18f, 0f, 180f, W, 3.5f)
            line(50f, 58f, 50f, 72f, W, 3.5f); line(38f, 74f, 62f, 74f, W, 4f)
        }
        "kotlin-workshop" -> {
            rect(16f, 18f, 68f, 46f, W, 3f)
            line(30f, 64f, 22f, 84f, D, 3f); line(70f, 64f, 78f, 84f, D, 3f)
            // Kotlin-style "K" made of triangles, plus a small chart
            poly(A, 24f, 26f, 34f, 26f, 34f, 56f, 24f, 56f)
            poly(Color(0xFFE25C8A), 34f, 41f, 48f, 26f, 58f, 26f, 40f, 44f)
            poly(Palette.orange, 34f, 41f, 40f, 38f, 58f, 56f, 48f, 56f)
            polyline(Palette.green, 3f, 62f, 52f, 68f, 42f, 74f, 46f, 80f, 30f)
        }
        "accelerator" -> {
            arc(50f, 62f, 30f, 180f, 180f, W, 8f)
            arc(50f, 62f, 30f, 300f, 60f, Palette.red, 8f)
            line(50f, 62f, 70f, 42f, G, 4f)
            circle(50f, 62f, 5f, G)
        }
        "ipo" -> {
            rect(16f, 20f, 68f, 56f, K, 4f)
            for (i in 0..4) line(16f, 30f + i * 11f, 84f, 30f + i * 11f, D, 1f)
            polyline(Palette.green, 3.5f, 22f, 66f, 36f, 56f, 48f, 60f, 62f, 40f, 78f, 28f)
            poly(Palette.green, 72f, 26f, 82f, 24f, 80f, 34f)
        }
        "acquihire" -> {
            arc(50f, 36f, 20f, 0f, 180f, Palette.red, 12f)
            rect(24f, 26f, 12f, 12f, W, 1f); rect(64f, 26f, 12f, 12f, W, 1f)
            person(30f, 72f, 0.45f, shirt = L); person(50f, 76f, 0.45f, shirt = L); person(70f, 72f, 0.45f, shirt = L)
        }
        "unicorn-valuation" -> {
            poly(Color(0xFFB9F3FF), 30f, 40f, 40f, 26f, 60f, 26f, 70f, 40f, 50f, 76f)
            poly(Color(0xFF7FD9F0), 30f, 40f, 70f, 40f, 50f, 76f)
            poly(Color(0xFFE9FCFF), 40f, 26f, 50f, 40f, 60f, 26f)
            star(24f, 24f, 5f, W); star(78f, 62f, 6f, G); star(80f, 24f, 3.5f, W)
        }
        "open-source-maintainer" -> {
            line(34f, 22f, 34f, 78f, W, 4f)
            line(34f, 62f, 64f, 40f, W, 4f)
            line(64f, 40f, 64f, 26f, W, 4f)
            circle(34f, 24f, 7f, A); circle(34f, 50f, 6f, L); circle(34f, 76f, 7f, A)
            circle(64f, 26f, 7f, G)
            star(72f, 66f, 9f, G)
        }
        else -> star(50f, 50f, 20f, W)
    }
}

/** The card's art band: tinted background with Kotlin-style diagonal stripes and the card's illustration. */
@Composable
fun CardArt(card: Card, height: Dp, modifier: Modifier = Modifier) {
    val accent = Palette.of(card.type)
    Canvas(modifier.fillMaxWidth().height(height).clipToBounds()) {
        drawRect(Brush.verticalGradient(listOf(lerp(accent, Palette.surface, 0.55f), lerp(accent, Palette.surface, 0.8f))))
        // Diagonal stripes, like the Kotlin logo's slanted cut.
        val stripe = Color.White.copy(alpha = 0.05f)
        var x = -size.height
        while (x < size.width) {
            val p = Path().apply {
                moveTo(x, size.height); lineTo(x + size.height, 0f); lineTo(x + size.height + 10f, 0f); lineTo(x + 10f, size.height); close()
            }
            drawPath(p, stripe)
            x += 28f
        }
        val side = min(size.height * 1.18f, size.width)
        val pen = Pen(this, (size.width - side) / 2, (size.height - side) / 2, side / 100f, accent)
        pen.drawCardArt(card.id)
    }
}

// ============================== Startup logos ==============================

fun startupColor(id: String): Color = when (id) {
    "companion" -> Color(0xFFE25C8A)
    "suspend-fun-travel" -> Color(0xFF2F9BEA)
    "sealed-deals" -> Color(0xFFE08A2E)
    "by-lazy-studio" -> Color(0xFF7F52FF)
    "nullsafe-bank" -> Color(0xFF1FA383)
    else -> Palette.kotlin
}

private fun Pen.drawLogo(id: String) {
    when (id) {
        "companion" -> { // heart in a chat bubble
            bubble(16f, 18f, 68f, 52f, W, tailLeft = true)
            circle(41f, 40f, 10f, A); circle(59f, 40f, 10f, A)
            poly(A, 31.5f, 44f, 68.5f, 44f, 50f, 62f)
        }
        "suspend-fun-travel" -> { // paper plane with a dotted path
            poly(W, 18f, 46f, 84f, 20f, 58f, 80f)
            poly(L, 84f, 20f, 44f, 54f, 50f, 72f)
            for (i in 0..3) circle(14f + i * 6f, 70f + i * 2f, 2f, W)
        }
        "sealed-deals" -> { // parcel with a sealed tape
            poly(W, 50f, 16f, 84f, 32f, 50f, 48f, 16f, 32f)
            poly(L, 16f, 32f, 50f, 48f, 50f, 86f, 16f, 70f)
            poly(Color(0xFFFFE3C4), 84f, 32f, 50f, 48f, 50f, 86f, 84f, 70f)
            poly(D, 31f, 24f, 65f, 40f, 65f, 52f, 31f, 36f)
        }
        "by-lazy-studio" -> { // game pad
            rect(12f, 32f, 76f, 38f, W, 19f)
            rect(24f, 47f, 18f, 6f, A, 2f); rect(30f, 41f, 6f, 18f, A, 2f)
            circle(66f, 44f, 4.5f, Palette.orange); circle(74f, 54f, 4.5f, Palette.green)
        }
        "nullsafe-bank" -> { // shield with a coin
            poly(W, 50f, 12f, 82f, 24f, 80f, 54f, 50f, 88f, 20f, 54f, 18f, 24f)
            coin(50f, 48f, 16f)
        }
        else -> star(50f, 50f, 30f, W)
    }
}

/** Rounded-square startup logo. */
@Composable
fun StartupLogo(id: String, size: Dp, modifier: Modifier = Modifier) {
    val c = startupColor(id)
    Canvas(modifier.size(size)) {
        val r = this.size.width * 0.24f
        drawRoundRect(Brush.linearGradient(listOf(lerp(c, Color.White, 0.15f), lerp(c, Color.Black, 0.25f))), cornerRadius = CornerRadius(r))
        val pad = this.size.width * 0.16f
        val side = this.size.width - 2 * pad
        Pen(this, pad, pad, side / 100f, c).drawLogo(id)
    }
}

/** Wide startup banner for the company board: gradient, big logo, light pattern. */
@Composable
fun StartupBanner(id: String, height: Dp, modifier: Modifier = Modifier) {
    val c = startupColor(id)
    Box(modifier) {
        Canvas(Modifier.fillMaxWidth().height(height)) {
            drawRect(Brush.horizontalGradient(listOf(lerp(c, Color.Black, 0.35f), lerp(c, Palette.surface, 0.55f))))
            val dot = Color.White.copy(alpha = 0.07f)
            var y = 8f
            while (y < size.height) {
                var x = 8f
                while (x < size.width) { drawCircle(dot, 2.2f, Offset(x, y)); x += 18f }
                y += 18f
            }
            val side = size.height * 0.8f
            Pen(this, size.width - side - size.height * 0.15f, (size.height - side) / 2, side / 100f, c).drawLogo(id)
        }
    }
}
