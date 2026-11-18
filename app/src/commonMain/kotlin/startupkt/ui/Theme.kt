package startupkt.ui

import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.sp
import startupkt.engine.CardType
import startupkt.engine.Res

object Palette {
    val bg = Color(0xFF15131C)
    val surface = Color(0xFF211E2A)
    val surface2 = Color(0xFF2B2736)
    val border = Color(0xFF3A3547)
    val text = Color(0xFFEDEAF5)
    val muted = Color(0xFFA49FB5)
    val kotlin = Color(0xFF7F52FF)
    val kotlinLight = Color(0xFFB79CFF)
    val orange = Color(0xFFFF8A3D)
    val gold = Color(0xFFF7C04A)
    val green = Color(0xFF4CC38A)
    val red = Color(0xFFFF6B6B)

    val frontend = Color(0xFF4FB3F6)
    val backend = Color(0xFF5FCB8B)
    val agent = Color(0xFFD08CF2)

    fun of(type: CardType) = when (type) {
        CardType.TEAM -> Color(0xFF2BB5A0)
        CardType.FEATURE -> Color(0xFF7F52FF)
        CardType.LIBRARY -> Color(0xFF3D8BFD)
        CardType.BUSINESS -> Color(0xFFE59A2F)
    }

    fun of(res: Res) = when (res) {
        Res.FRONTEND -> frontend
        Res.BACKEND -> backend
        Res.AGENT -> agent
    }
}

object Type {
    val title = TextStyle(color = Palette.text, fontSize = 28.sp, fontWeight = FontWeight.Bold)
    val h2 = TextStyle(color = Palette.text, fontSize = 18.sp, fontWeight = FontWeight.Bold)
    val h3 = TextStyle(color = Palette.text, fontSize = 15.sp, fontWeight = FontWeight.SemiBold)
    val body = TextStyle(color = Palette.text, fontSize = 14.sp)
    val small = TextStyle(color = Palette.text, fontSize = 12.sp)
    val muted = TextStyle(color = Palette.muted, fontSize = 12.sp)
    val flavor = TextStyle(color = Palette.muted, fontSize = 11.sp, fontStyle = FontStyle.Italic)
    val button = TextStyle(color = Color.White, fontSize = 15.sp, fontWeight = FontWeight.SemiBold)
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
