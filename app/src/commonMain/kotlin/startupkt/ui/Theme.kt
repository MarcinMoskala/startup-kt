package startupkt.ui

import androidx.compose.runtime.Composable
import androidx.compose.runtime.SideEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.sp
import org.jetbrains.compose.resources.Font
import startupkt.engine.CardType
import startupkt.engine.Res
import startupkt.ui.res.Res as R
import startupkt.ui.res.jetbrainsmono_bold
import startupkt.ui.res.jetbrainsmono_regular

/** "Dark IDE" theme: IntelliJ-like greys, Kotlin purple, orange for "you". */
object Palette {
    val bg = Color(0xFF1E1F22)
    val surface = Color(0xFF2B2D30)
    val surface2 = Color(0xFF393B40)
    val border = Color(0xFF43454A)
    val text = Color(0xFFDFE1E5)
    val muted = Color(0xFF9DA0A8)
    val faint = Color(0xFF6F737A)
    val kotlin = Color(0xFF7F52FF)
    val kotlinLight = Color(0xFFA98BFF)
    val orange = Color(0xFFF08A3E)
    val gold = Color(0xFFF5C451)
    val green = Color(0xFF5FB865)
    val red = Color(0xFFF26D6D)

    val frontend = Color(0xFF4FB3F6)
    val backend = Color(0xFF5FCB8B)
    val agent = Color(0xFFC77DFF)

    fun of(type: CardType) = when (type) {
        CardType.TEAM -> Color(0xFF26A68A)
        CardType.FEATURE -> Color(0xFF8B5CF6)
        CardType.LIBRARY -> Color(0xFF3D8BFD)
        CardType.BUSINESS -> Color(0xFFE29A2F)
    }

    fun of(res: Res) = when (res) {
        Res.FRONTEND -> frontend
        Res.BACKEND -> backend
        Res.AGENT -> agent
    }

    val avatars = listOf(Color(0xFFF08A3E), Color(0xFF7F52FF), Color(0xFF3D8BFD), Color(0xFF26A68A), Color(0xFFE25C8A))
}

/** Font families; the mono font loads asynchronously on the web, so it lives in snapshot state. */
object Fonts {
    var mono: FontFamily by mutableStateOf(FontFamily.Monospace)
}

@Composable
fun LoadFonts() {
    val family = FontFamily(
        Font(R.font.jetbrainsmono_regular, FontWeight.Normal),
        Font(R.font.jetbrainsmono_bold, FontWeight.Bold),
    )
    SideEffect { Fonts.mono = family }
}

object Type {
    val title get() = TextStyle(color = Palette.text, fontSize = 26.sp, fontWeight = FontWeight.Bold, fontFamily = Fonts.mono)
    val h2 get() = TextStyle(color = Palette.text, fontSize = 17.sp, fontWeight = FontWeight.Bold, fontFamily = Fonts.mono)
    val h3 = TextStyle(color = Palette.text, fontSize = 14.sp, fontWeight = FontWeight.SemiBold)
    val body = TextStyle(color = Palette.text, fontSize = 14.sp)
    val small = TextStyle(color = Palette.text, fontSize = 12.sp)
    val muted = TextStyle(color = Palette.muted, fontSize = 12.sp)
    /** Code comment / section label: `// like this` or `ADA · NULLSAFE BANK`. */
    val label get() = TextStyle(color = Palette.muted, fontSize = 11.sp, fontFamily = Fonts.mono, letterSpacing = 0.6.sp)
    val mono get() = TextStyle(color = Palette.text, fontSize = 12.sp, fontFamily = Fonts.mono)
    val flavor get() = TextStyle(color = Palette.faint, fontSize = 10.sp, fontStyle = FontStyle.Italic, fontFamily = Fonts.mono)
    val button = TextStyle(color = Color.White, fontSize = 14.sp, fontWeight = FontWeight.SemiBold)
}

fun typeName(t: CardType) = when (t) {
    CardType.TEAM -> "Team"
    CardType.FEATURE -> "Feature"
    CardType.LIBRARY -> "Library"
    CardType.BUSINESS -> "Business"
}

fun sprintName(s: Int) = when (s) {
    1 -> "Hello, World"
    2 -> "Beta"
    3 -> "Release 1.0"
    else -> ""
}

fun roman(s: Int) = when (s) { 1 -> "I"; 2 -> "II"; 3 -> "III"; else -> s.toString() }
