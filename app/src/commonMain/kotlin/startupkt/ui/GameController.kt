package startupkt.ui

import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import kotlinx.serialization.Serializable
import kotlinx.serialization.json.Json
import startupkt.bots.Bot
import startupkt.bots.BotContext
import startupkt.bots.Bots
import startupkt.engine.*
import kotlin.random.Random
import kotlin.time.Duration.Companion.milliseconds
import kotlin.time.TimeSource

enum class Difficulty(val botName: String, val label: String, val blurb: String) {
    EASY("easy", "Easy", "Makes plenty of mistakes. Good for learning the rules."),
    MEDIUM("medium", "Medium", "Plays a solid plan without looking ahead."),
    HARD("hard", "Hard", "Simulates the rest of the game before every pick."),
    EXPERT("expert", "Expert", "Thinks longer and hate-drafts. Bring your A-game."),
}

@Serializable
data class WebSave(val state: GameState, val difficulty: Difficulty, val players: Int)

/** One played pick as seen by everyone: who did what (sells are hidden, as on a real table). */
data class Reveal(val sprint: Int, val pick: Int, val lines: List<String>)

class GameController(private val scope: CoroutineScope) {
    val engine = Engine()
    val humanSeat = 0

    var state by mutableStateOf<GameState?>(null); private set
    var difficulty by mutableStateOf(Difficulty.MEDIUM)
    var players by mutableStateOf(3)
    var thinking by mutableStateOf<Set<Int>>(emptySet()); private set
    var reveal by mutableStateOf<Reveal?>(null); private set
    var error by mutableStateOf<String?>(null)

    private var bots: Map<Int, Bot> = emptyMap()
    private var botJob: Job? = null
    private val rng = Random(Random.nextLong())
    private val json = Json { ignoreUnknownKeys = true; classDiscriminator = "kind" }

    val inGame get() = state != null

    init {
        load()
    }

    fun newGame() {
        botJob?.cancel()
        val names = listOf("You") + BOT_NAMES.shuffled(rng).take(players - 1)
        state = engine.newGame(players, rng.nextLong(), names)
        reveal = null
        error = null
        createBots()
        save()
        startBots()
    }

    fun quit() {
        botJob?.cancel()
        state = null
        reveal = null
        thinking = emptySet()
        try { SaveStore.clear() } catch (_: Throwable) {}
    }

    fun submitHuman(action: Action) {
        val s = state ?: return
        try {
            submit(s, humanSeat, action)
        } catch (e: IllegalArgumentException) {
            error = e.message
        }
    }

    fun waitingForHuman(): Boolean = state?.let { !it.finished && humanSeat !in it.pending } ?: false

    private fun createBots() {
        val n = state?.players?.size ?: 0
        bots = (1 until n).associateWith { Bots.create(difficulty.botName) }
    }

    private fun submit(before: GameState, seat: Int, action: Action) {
        val after = engine.submit(before, seat, action)
        state = after
        if (after.finished || after.pick != before.pick || after.sprint != before.sprint) {
            val header = "S${before.sprint}P${before.pick} "
            reveal = Reveal(before.sprint, before.pick, after.log.drop(before.log.size).filter { it.startsWith(header) }.map { it.removePrefix(header) })
            save()
            if (!after.finished) startBots()
        } else {
            save()
        }
    }

    /** Bots decide one after another, yielding to the browser so the UI stays responsive. */
    private fun startBots() {
        botJob?.cancel()
        val snapshot = state ?: return
        val todo = bots.keys.filter { it !in snapshot.pending }.sorted()
        thinking = todo.toSet()
        botJob = scope.launch {
            delay(60) // let the UI render the new pick first
            for (seat in todo) {
                var mark = TimeSource.Monotonic.markNow()
                val started = TimeSource.Monotonic.markNow()
                var yielded = kotlin.time.Duration.ZERO
                val pause: suspend () -> Unit = {
                    if (mark.elapsedNow() > 40.milliseconds) {
                        val y = TimeSource.Monotonic.markNow()
                        delay(1)
                        yielded += y.elapsedNow()
                        mark = TimeSource.Monotonic.markNow()
                    }
                }
                val ctx = BotContext.of(engine, snapshot, seat, rng)
                val action = bots.getValue(seat).chooseAsync(ctx, pause)
                val total = started.elapsedNow()
                println("[bot] ${snapshot.player(seat).name} (${difficulty.botName}) S${snapshot.sprint}P${snapshot.pick}: compute ${(total - yielded).inWholeMilliseconds} ms, total ${total.inWholeMilliseconds} ms")
                thinking = thinking - seat
                val current = state ?: return@launch
                if (current.sprint != snapshot.sprint || current.pick != snapshot.pick) return@launch
                submit(current, seat, action)
            }
        }
    }

    private fun save() {
        val s = state ?: return
        try { SaveStore.write(json.encodeToString(WebSave.serializer(), WebSave(s, difficulty, players))) } catch (_: Throwable) {}
    }

    private fun load() {
        try {
            val text = SaveStore.read() ?: return
            val saved = json.decodeFromString(WebSave.serializer(), text)
            difficulty = saved.difficulty
            players = saved.players
            state = saved.state
            createBots()
            if (!saved.state.finished) startBots()
        } catch (_: Throwable) {
            try { SaveStore.clear() } catch (_: Throwable) {}
        }
    }

    companion object {
        private val BOT_NAMES = listOf("Ada", "Grace", "Linus", "Margaret", "Dennis", "Barbara", "Ken", "Frances")
    }
}
