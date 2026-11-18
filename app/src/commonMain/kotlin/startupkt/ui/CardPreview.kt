package startupkt.ui

import androidx.compose.foundation.hoverable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.interaction.collectIsHoveredAsState
import androidx.compose.foundation.layout.Box
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.IntOffset
import androidx.compose.ui.unit.IntRect
import androidx.compose.ui.unit.IntSize
import androidx.compose.ui.unit.LayoutDirection
import androidx.compose.ui.unit.dp
import androidx.compose.ui.window.Popup
import androidx.compose.ui.window.PopupPositionProvider
import androidx.compose.ui.window.PopupProperties
import kotlinx.coroutines.delay
import startupkt.engine.Card
import startupkt.engine.Ruleset

/** Places a popup above (or else below) its anchor, kept inside the window. */
private class NearAnchor(private val gapPx: Int) : PopupPositionProvider {
    override fun calculatePosition(anchorBounds: IntRect, windowSize: IntSize, layoutDirection: LayoutDirection, popupContentSize: IntSize): IntOffset {
        val x = (anchorBounds.left + anchorBounds.width / 2 - popupContentSize.width / 2)
            .coerceIn(8, maxOf(8, windowSize.width - popupContentSize.width - 8))
        val above = anchorBounds.top - popupContentSize.height - gapPx
        val below = anchorBounds.bottom + gapPx
        val y = when {
            above >= 8 -> above
            below + popupContentSize.height <= windowSize.height - 8 -> below
            else -> (windowSize.height - popupContentSize.height - 8).coerceAtLeast(8)
        }
        return IntOffset(x, y)
    }
}

/**
 * Wraps [content]; hovering it for a moment shows the full card ([card]) enlarged next to it, with all its text.
 * [enabled] = false turns the preview off (e.g. while dragging).
 */
@Composable
fun CardHoverPreview(card: Card, ruleset: Ruleset, modifier: Modifier = Modifier, enabled: Boolean = true, content: @Composable () -> Unit) =
    HoverPopup(modifier, enabled, popup = { CardView(card, ruleset, 250.dp, 360.dp, expanded = true) }, content = content)

/** Shows [popup] next to [content] after hovering it for a moment. */
@Composable
fun HoverPopup(modifier: Modifier = Modifier, enabled: Boolean = true, delayMs: Long = 350, popup: @Composable () -> Unit, content: @Composable () -> Unit) {
    val source = remember { MutableInteractionSource() }
    val hovered by source.collectIsHoveredAsState()
    var show by remember { mutableStateOf(false) }
    LaunchedEffect(hovered, enabled) {
        if (hovered && enabled) { delay(delayMs); show = true } else show = false
    }
    Box(modifier.hoverable(source)) {
        content()
        if (show) {
            Popup(popupPositionProvider = NearAnchor(10), properties = PopupProperties(focusable = false)) { popup() }
        }
    }
}

/** Phone: the long-pressed card shown large in the middle of the screen; tap anywhere to close. */
@Composable
fun CardInspectOverlay(card: Card, ruleset: Ruleset, onClose: () -> Unit) {
    Scrim(onDismiss = onClose) { CardView(card, ruleset, 280.dp, 440.dp, expanded = true, onClick = onClose) }
}
