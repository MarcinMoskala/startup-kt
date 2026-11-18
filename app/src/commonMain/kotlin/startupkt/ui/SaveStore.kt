package startupkt.ui

/** Where the current game is saved between sessions: localStorage in the browser, a file on desktop. */
expect object SaveStore {
    fun read(): String?
    fun write(text: String)
    fun clear()
}
