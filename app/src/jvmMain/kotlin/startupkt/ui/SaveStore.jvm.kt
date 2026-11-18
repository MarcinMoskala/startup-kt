package startupkt.ui

import java.io.File

private val file = File(System.getProperty("user.home"), ".startupkt/game-v3.json")

actual object SaveStore {
    actual fun read(): String? = file.takeIf { it.exists() }?.readText()
    actual fun write(text: String) { file.parentFile.mkdirs(); file.writeText(text) }
    actual fun clear() { file.delete() }
}
