package startupkt.ui

import kotlinx.browser.localStorage

private const val KEY = "startupkt.game.v3"

actual object SaveStore {
    actual fun read(): String? = localStorage.getItem(KEY)
    actual fun write(text: String) = localStorage.setItem(KEY, text)
    actual fun clear() = localStorage.removeItem(KEY)
}
