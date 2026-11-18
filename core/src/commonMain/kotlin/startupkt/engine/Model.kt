package startupkt.engine

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

/** Resources produced by Team cards and startups. AGENT can stand in for FRONTEND or BACKEND, never the other way round. */
@Serializable
enum class Res(val icon: String) {
    FRONTEND("📱"), BACKEND("🖥"), AGENT("🤖");
}

@Serializable
enum class CardType(val icon: String) {
    TEAM("👥"), FEATURE("⭐"), LIBRARY("📚"), BUSINESS("💼");
}

/** Effects that cannot be expressed with plain points/coins/production. */
@Serializable
sealed interface Special {
    /** Immediately gain [coins] for each card of [type] you already have built. */
    @Serializable
    @SerialName("coinsPer")
    data class CoinsPer(val type: CardType, val coins: Int) : Special

    /** At game end gain [points] for each card of [type] you have built. */
    @Serializable
    @SerialName("pointsPer")
    data class PointsPer(val type: CardType, val points: Int) : Special

    /** Freelancers cost you [price] coins instead of the default. */
    @Serializable
    @SerialName("freelancerPrice")
    data class FreelancerPrice(val price: Int) : Special

    /** At game end your coins are worth 1 point per [coinsPerPoint] coins. */
    @Serializable
    @SerialName("coinRate")
    data class CoinRate(val coinsPerPoint: Int) : Special
}

/**
 * A card definition. One definition may appear several times in a deck:
 * [copies] lists, per copy, the minimal player count at which that copy is included (e.g. `[3, 5]`).
 */
@Serializable
data class Card(
    val id: String,
    val name: String,
    val type: CardType,
    val sprint: Int,
    val copies: List<Int> = listOf(3),
    val costCoins: Int = 0,
    val cost: List<Res> = emptyList(),
    /** Id of a card (usually a Library) that makes this card free to build. */
    val freeWith: String? = null,
    /** Each element is one produced unit; a unit with several entries is a choice ("📱 or 🖥"). */
    val produces: List<List<Res>> = emptyList(),
    val points: Int = 0,
    val coins: Int = 0,
    val special: Special? = null,
    /** One-line flavour text printed on the card. */
    val description: String = "",
)

/**
 * One step of a startup's roadmap (like a 7 Wonders wonder stage). Pay its cost and tuck any card from your hand
 * face down under your startup. Stages are done in order; each can be done once.
 */
@Serializable
data class RoadmapStage(
    val name: String,
    val cost: List<Res> = emptyList(),
    val costCoins: Int = 0,
    val points: Int = 0,
    /** Gained immediately. */
    val coins: Int = 0,
    /** From now on Team cards cost this many 💰 less. */
    val teamDiscount: Int = 0,
    /** From now on selling gives this many 💰. */
    val sellValue: Int? = null,
    /** From now on gain this many 💰 whenever you build a Library. */
    val libraryCoins: Int = 0,
    /** From now on gain this many 💰 at the end of every Sprint (including the one in which the stage was done). */
    val sprintCoins: Int = 0,
    /** Same meaning as on cards: CoinsPer (immediately), PointsPer (end), FreelancerPrice, CoinRate. */
    val special: Special? = null,
    /** Effect text printed on the startup board. */
    val text: String = "",
)

/** A starting card: one resource, starting money and a roadmap (v4) or a tiny ability (v3). */
@Serializable
data class Startup(
    val id: String,
    val name: String,
    val produces: List<List<Res>>,
    /** Overrides [Rules.startCoins]. */
    val startCoins: Int? = null,
    /** Team cards cost this many 💰 less (not below 0). */
    val teamDiscount: Int = 0,
    /** Overrides [Rules.sellValue]. */
    val sellValue: Int? = null,
    /** Gain this many 💰 whenever you build a Library. */
    val libraryCoins: Int = 0,
    /** Gain this many 💰 at the end of every sprint in which a card was left over in your hand. */
    val leftoverCoins: Int = 0,
    /** At game end your coins are worth 1⭐ per this many 💰 (best rate applies). */
    val coinsPerPoint: Int? = null,
    /** Ability text printed on the card. */
    val ability: String = "",
    /** Roadmap stages (v4). Empty = no roadmap action. */
    val stages: List<RoadmapStage> = emptyList(),
    val description: String = "",
)

@Serializable
data class Rules(
    val sprints: Int = 3,
    val handSize: Int = 5,
    val picksPerSprint: Int = 4,
    val startCoins: Int = 3,
    val sellValue: Int = 3,
    val freelancerPrice: Int = 2,
    val coinsPerPoint: Int = 3,
    val minPlayers: Int = 2,
    val maxPlayers: Int = 5,
    /** Smallest deck variant. With fewer players the deck for this count is used and leftovers stay unused. */
    val baseDeckPlayers: Int = 3,
    /** Optional catch-up ("bridge round"): at the end of every sprint except the last, the player(s) with the fewest ⭐ gain this many 💰. */
    val catchUpCoins: Int = 0,
    /** Optional: pass hands to the other side in even sprints (as in 7 Wonders). */
    val alternatePassing: Boolean = false,
    /** When a 🤖 does 📱/🖥 work you pay this many 💰 in tokens. 0 = free substitution. */
    val agentTokenCost: Int = 0,
    /** 2-player duel: use the deck for [duelDeckPlayers], deal [duelHandSize] cards, and every pick also discards one card face down. */
    val duel: Boolean = false,
    val duelHandSize: Int = 8,
    val duelDeckPlayers: Int = 4,
    /** Roadmap: at most one stage per Sprint (so nobody rushes to Exit in Sprint I). */
    val oneStagePerSprint: Boolean = false,
    /** Price of hiring a 🤖 freelancer for a 🤖 slot; 0 = 🤖 cannot be hired. */
    val agentFreelancerPrice: Int = 0,
) {
    fun isDuel(players: Int) = duel && players == 2
    fun handSize(players: Int) = if (isDuel(players)) duelHandSize else handSize
}

/** Everything that defines the game content: rules, cards and startups. Exportable to / importable from JSON for balance experiments. */
@Serializable
data class Ruleset(
    val rules: Rules,
    val cards: List<Card>,
    val startups: List<Startup>,
) {
    val cardsById: Map<String, Card> by lazy { cards.associateBy { it.id } }

    fun card(id: String): Card = cardsById[id] ?: error("Unknown card '$id'")
    fun startup(id: String): Startup = startups.first { it.id == id }

    fun deckFor(sprint: Int, players: Int): List<String> {
        val n = if (rules.isDuel(players)) rules.duelDeckPlayers else maxOf(players, rules.baseDeckPlayers)
        return cards.filter { it.sprint == sprint }.flatMap { c -> c.copies.filter { it <= n }.map { c.id } }
    }

    /** Returns a list of problems; empty means valid. */
    fun validate(): List<String> = buildList {
        val ids = cards.map { it.id }
        ids.groupBy { it }.filter { it.value.size > 1 }.keys.forEach { add("Duplicate card id '$it' (use 'copies' instead)") }
        cards.forEach { c ->
            if (c.freeWith != null && c.freeWith !in cardsById) add("Card '${c.id}' freeWith unknown card '${c.freeWith}'")
            if (c.sprint !in 1..rules.sprints) add("Card '${c.id}' has sprint ${c.sprint} outside 1..${rules.sprints}")
            if (c.copies.isEmpty()) add("Card '${c.id}' has no copies")
        }
        if (startups.size < rules.maxPlayers) add("Need at least ${rules.maxPlayers} startups, have ${startups.size}")
        for (p in rules.minPlayers..rules.maxPlayers) for (s in 1..rules.sprints) {
            val size = deckFor(s, p).size
            if (size < p * rules.handSize(p)) add("Sprint $s deck for $p players has $size cards, needs ${p * rules.handSize(p)}")
        }
        if (rules.picksPerSprint > rules.handSize) add("picksPerSprint > handSize")
        if (rules.duel && rules.picksPerSprint * 2 > rules.duelHandSize) add("duel needs duelHandSize >= 2 * picksPerSprint")
    }
}

@Serializable
sealed interface Action {
    val cardId: String
    /** Duel only: the card discarded face down in the same pick. */
    val discard: String?

    @Serializable
    @SerialName("build")
    data class Build(override val cardId: String, override val discard: String? = null) : Action

    @Serializable
    @SerialName("sell")
    data class Sell(override val cardId: String, override val discard: String? = null) : Action

    /** Tuck [cardId] under your startup to complete the next roadmap stage. */
    @Serializable
    @SerialName("stage")
    data class Stage(override val cardId: String, override val discard: String? = null) : Action

    fun withDiscard(id: String?): Action = when (this) {
        is Build -> copy(discard = id)
        is Sell -> copy(discard = id)
        is Stage -> copy(discard = id)
    }

    fun encode(): String = when (this) {
        is Build -> "build:$cardId"
        is Sell -> "sell:$cardId"
        is Stage -> "stage:$cardId"
    } + (discard?.let { ",discard:$it" } ?: "")

    companion object {
        /** Parses `build:<id>` / `sell:<id>`, optionally followed by `,discard:<id>` (duel). */
        fun parse(text: String): Action {
            val parts = text.trim().split(",").map { it.trim() }
            val (verb, id) = parts[0].split(":", limit = 2).takeIf { it.size == 2 }
                ?: throw IllegalArgumentException("Action must look like 'build:<cardId>', 'sell:<cardId>' or 'stage:<cardId>' (duel: add ',discard:<cardId>'), got '$text'")
            val discard = parts.getOrNull(1)?.let { d ->
                val (k, v) = d.split(":", limit = 2).takeIf { it.size == 2 && it[0] in setOf("discard", "burn", "d") }
                    ?: throw IllegalArgumentException("Expected ',discard:<cardId>', got '$d'")
                v
            }
            return when (verb.lowercase()) {
                "build", "b" -> Build(id, discard)
                "sell", "s" -> Sell(id, discard)
                "stage", "roadmap", "r" -> Stage(id, discard)
                else -> throw IllegalArgumentException("Unknown action verb '$verb' (use build, sell or stage)")
            }
        }
    }
}

@Serializable
data class PlayerState(
    val seat: Int,
    val name: String,
    val startup: String,
    val coins: Int,
    val hand: List<String>,
    val built: List<String> = emptyList(),
    val sold: List<String> = emptyList(),
    val freelancersHired: Int = 0,
    /** Cards tucked under the startup; its size is the number of completed roadmap stages. */
    val tucked: List<String> = emptyList(),
    /** Sprint in which the last roadmap stage was completed (0 = none yet). */
    val lastStageSprint: Int = 0,
) {
    val stagesDone: Int get() = tucked.size
}

@Serializable
data class GameState(
    val players: List<PlayerState>,
    val sprint: Int,
    /** 1-based pick within the current sprint. */
    val pick: Int,
    /** Pre-shuffled decks for every sprint (index = sprint - 1); the game uses no randomness after setup. */
    val decks: List<List<String>>,
    val discard: List<String> = emptyList(),
    /** Actions already submitted for the current pick, keyed by seat. Hidden from other players. */
    val pending: Map<Int, Action> = emptyMap(),
    /** Public event log. */
    val log: List<String> = emptyList(),
    val finished: Boolean = false,
) {
    fun player(seat: Int) = players[seat]
}

/** What it costs to build a card. Null payment = cannot build. */
@Serializable
data class Payment(
    val free: Boolean,
    val coins: Int,
    /** Resources bought from freelancers (bank). */
    val freelancers: List<Res>,
    /** How many times a 🤖 did 📱/🖥 work (each costs [Rules.agentTokenCost]). */
    val agentTokens: Int = 0,
)

@Serializable
data class Option(
    val action: String,
    val card: Card,
    val payment: Payment? = null,
    val gain: Int = 0,
    /** For `stage:` options: the roadmap stage this completes (1-based) and its definition. */
    val stageNumber: Int = 0,
    val stage: RoadmapStage? = null,
)

@Serializable
data class Score(
    val seat: Int,
    val features: Int,
    val libraries: Int,
    val business: Int,
    val bonuses: Int,
    val money: Int,
    val coins: Int,
    /** ⭐ printed on completed roadmap stages. */
    val roadmap: Int = 0,
) {
    val total: Int get() = features + libraries + business + bonuses + money + roadmap
}
