package startupkt.engine

import startupkt.engine.CardType.*
import startupkt.engine.Res.*

private val F = FRONTEND
private val B = BACKEND
private val A = AGENT

private fun team(
    id: String, name: String, sprint: Int, coins: Int, vararg units: List<Res>,
    points: Int = 0, freeWith: String? = null, copies: List<Int> = listOf(3), desc: String,
) = Card(id, name, TEAM, sprint, copies, costCoins = coins, produces = units.toList(), points = points, freeWith = freeWith, description = desc)

private fun feature(
    id: String, name: String, sprint: Int, cost: List<Res>, points: Int,
    freeWith: String? = null, coins: Int = 0, copies: List<Int> = listOf(3), desc: String,
) = Card(id, name, FEATURE, sprint, copies, costCoins = coins, cost = cost, points = points, freeWith = freeWith, description = desc)

private fun library(
    id: String, name: String, sprint: Int, cost: List<Res>, points: Int = 2,
    freeWith: String? = null, copies: List<Int> = listOf(3), desc: String,
) = Card(id, name, LIBRARY, sprint, copies, cost = cost, points = points, freeWith = freeWith, description = desc)

private fun business(
    id: String, name: String, sprint: Int,
    coins: Int = 0, points: Int = 0, cost: List<Res> = emptyList(), special: Special? = null, copies: List<Int> = listOf(3), desc: String,
) = Card(id, name, BUSINESS, sprint, copies, cost = cost, coins = coins, points = points, special = special, description = desc)

/**
 * "Startup.kt" v3 content (English, print-ready).
 * Merged from 10 playtest reports + Monte Carlo balance runs. Every library unlocks two features (its "free with" targets);
 * all chain targets exist at every player count where their library does.
 */
object DefaultRuleset {
    val cards: List<Card> = listOf(
        // ======================= Sprint I: "Hello, World" =======================
        team("junior-compose-dev", "Junior Compose Dev", 1, 0, listOf(F), copies = listOf(3, 4),
            desc = "Knows Modifier.padding() by heart; still learning why everything recomposes."),
        team("junior-backend-dev", "Junior Backend Dev", 1, 0, listOf(B), copies = listOf(3, 4),
            desc = "Writes !! \"just for now\" and ships the endpoint anyway."),
        team("mid-fullstack-dev", "Mid Full-stack Dev", 1, 2, listOf(F, B), copies = listOf(3, 5),
            desc = "Happy on either side of the API, as long as nobody asks about Gradle."),
        team("junie", "Junie", 1, 2, listOf(A),
            desc = "JetBrains' coding agent: reads the whole project before touching a line, which is more than most of us do."),
        team("claude-code", "Claude Code", 1, 2, listOf(A),
            desc = "Lives in your terminal, writes the tests you skipped, and asks before it runs rm -rf."),
        team("ui-designer", "Product Designer", 1, 0, listOf(F), copies = listOf(5),
            desc = "Hands you a Figma file with 47 shades of grey and one of them is the brand colour."),

        library("compose-multiplatform", "Compose Multiplatform", 1, listOf(F),
            desc = "One @Composable UI for Android, iOS, desktop and web."),
        library("ktor", "Ktor", 1, listOf(B),
            desc = "embeddedServer(Netty) { routing { } }: a whole backend in one expression."),
        library("kotlinx-coroutines", "kotlinx.coroutines", 1, listOf(B),
            desc = "Launch 100,000 coroutines and your laptop won't notice; Flow makes them talk."),
        library("kotlinx-serialization", "kotlinx.serialization", 1, listOf(B),
            desc = "@Serializable on a data class, and JSON stops being a source of bugs."),
        library("exposed", "Exposed", 1, listOf(B), copies = listOf(4),
            desc = "transaction { Users.selectAll() }: SQL with type-safe Kotlin."),
        library("koin", "Koin", 1, listOf(F), copies = listOf(5),
            desc = "single { Repository(get()) }: dependency injection without annotation processing."),

        feature("login-screen", "Login Screen", 1, listOf(F, B), 3,
            desc = "Two text fields, one button and three weeks of OAuth edge cases."),
        feature("dark-mode", "Dark Mode", 1, listOf(F), 2,
            desc = "darkColorScheme() and you're done, until design comes back with notes."),
        feature("profile-screen", "Profile Screen", 1, listOf(F, F), 3,
            desc = "Avatar, bio, an Edit button and a surprising number of TextField states."),
        feature("health-check", "Health-check Endpoint", 1, listOf(B), 2, copies = listOf(4),
            desc = "get(\"/health\") { call.respondText(\"OK\") }: the most reliable code you will ever ship."),
        feature("settings-screen", "Settings Screen", 1, listOf(F, B), 3, copies = listOf(5),
            desc = "Every toggle is a product decision someone avoided making."),

        business("seed-round", "Seed Round", 1, coins = 5,
            desc = "Ten slides, one TAM chart and the word Kotlin on every one of them."),
        business("outsourcing-partner", "Outsourcing Partner", 1, special = Special.FreelancerPrice(1),
            desc = "A software house on speed dial: the same pixels and endpoints at half the invoice."),
        business("hackathon", "Hackathon", 1, coins = 3, points = 1,
            desc = "48 hours, a pizza budget and a prize cheque; the prototype quietly becomes the product."),
        business("angel-investor", "Angel Investor", 1, coins = 4, copies = listOf(4),
            desc = "Believes in you, in Kotlin, and in 10% of the company."),
        business("eu-grant", "EU Innovation Grant", 1, coins = 4, copies = listOf(5),
            desc = "Free money, after a 40-page form about your 'digital transformation impact'."),

        // ======================= Sprint II: "Beta" =======================
        team("senior-compose-dev", "Senior Compose Dev", 2, 1, listOf(F), listOf(F), copies = listOf(3, 4),
            desc = "Has opinions about remember vs rememberSaveable, and they are right."),
        team("senior-backend-dev", "Senior Backend Dev", 2, 1, listOf(B), listOf(B), copies = listOf(3, 4),
            desc = "Knows why the database is slow before you finish describing the bug."),
        team("fullstack-senior", "Full-stack Senior", 2, 2, listOf(F), listOf(B), copies = listOf(3, 5),
            desc = "The unicorn hire: equally at home in a Composable and in a query plan."),
        team("agents-with-mcp", "Agents with MCP", 2, 3, listOf(A), listOf(A), freeWith = "claude-code",
            desc = "Give your agents real tools over MCP and they stop guessing and start shipping."),

        team("qa-engineer", "QA Engineer", 2, 2, listOf(F, B), copies = listOf(5),
            desc = "Finds the bug in the feature you demoed yesterday, on both platforms."),

        library("sqldelight", "SQLDelight", 2, listOf(F, B),
            desc = "Write SQL, get type-safe Kotlin; the compiler reviews your queries."),
        library("koog", "Koog", 2, listOf(A, B), freeWith = "junie",
            desc = "JetBrains' Kotlin framework for agents that call tools, not just chat."),
        library("kotlin-wasm", "Kotlin/Wasm", 2, listOf(F, F),
            desc = "Your Compose app in the browser at near-native speed; the JS folks pretend not to be impressed."),
        library("amper", "Amper", 2, listOf(F, B), copies = listOf(5),
            desc = "JetBrains' build tool: a short YAML file instead of 300 lines of build.gradle.kts."),

        feature("ios-app", "iOS App", 2, listOf(F, F, B), 5, freeWith = "compose-multiplatform",
            desc = "Same Compose code, now in Swift-land; App Review still takes a week."),
        feature("rest-api", "REST API", 2, listOf(B, B, F), 4, freeWith = "ktor",
            desc = "Ktor routes plus a client in the app: everything else talks to this."),
        feature("payments", "Payments", 2, listOf(B, B, B), 5, freeWith = "kotlinx-serialization",
            desc = "Webhooks are just JSON you must never, ever get wrong."),
        feature("push-notifications", "Push Notifications", 2, listOf(F, B, B), 4, freeWith = "kotlinx-coroutines",
            desc = "FCM, APNs and a backend queue, so you can say \"We miss you!\" on two platforms."),
        feature("onboarding", "Onboarding", 2, listOf(F, F), 3, freeWith = "koin",
            desc = "Three swipeable screens nobody reads, A/B-tested twelve times."),
        feature("search", "Search", 2, listOf(B, B, F), 4, freeWith = "kotlinx-serialization", copies = listOf(4),
            desc = "Full-text search: easy for ten rows, a career for ten million."),
        feature("map-view", "Map View", 2, listOf(F, F, B), 4, freeWith = "exposed", copies = listOf(4),
            desc = "A map in a Composable, plus a backend that knows where everything is."),
        feature("crash-reporting", "Crash Reporting", 2, listOf(F, B), 3, copies = listOf(5),
            desc = "Finally you know about the crash before the one-star review does."),

        business("series-a", "Series A", 2, special = Special.CoinsPer(TEAM, 2),
            desc = "VCs invest in teams: every hire on the slide is worth more cash."),
        business("first-paying-customers", "First Paying Customers", 2, special = Special.CoinsPer(FEATURE, 2),
            desc = "They pay for features, so every shipped feature finally earns money."),
        business("kotlinconf-talk", "KotlinConf Talk", 2, coins = 2, points = 2, cost = listOf(F, B),
            desc = "A live demo on stage: needs a working app, earns a following."),
        business("kotlin-workshop", "Paid Kotlin Workshop", 2, special = Special.CoinsPer(LIBRARY, 2), copies = listOf(4),
            desc = "Teach coroutines to a room of enterprise devs for a day; invoice per library you know."),
        business("accelerator", "Startup Accelerator", 2, coins = 4, copies = listOf(5),
            desc = "Three months of mentors, demo day and free cloud credits for 7% of your company."),

        // ======================= Sprint III: "Release 1.0" =======================
        team("tech-lead", "Tech Lead", 3, 1, listOf(F), listOf(B), listOf(A), points = 3, copies = listOf(3, 4),
            desc = "Writes less code than before and somehow makes everyone ship more."),

        feature("ai-assistant", "In-app AI Assistant", 3, listOf(A, A, F, B), 6, freeWith = "koog",
            desc = "A Koog agent inside your app that actually calls your backend."),
        feature("multi-agent-workflow", "Multi-agent Workflow", 3, listOf(A, A, B), 6, freeWith = "agents-with-mcp",
            desc = "One agent plans, one codes, one reviews; you approve the pull requests."),
        feature("realtime-chat", "Real-time Chat", 3, listOf(B, B, F, F), 6, freeWith = "ktor",
            desc = "A Flow of messages over WebSockets: collect {} and never miss a word."),
        feature("offline-mode", "Offline Mode", 3, listOf(F, F, B), 6, freeWith = "sqldelight",
            desc = "Works in the metro: a local SQLDelight cache syncing when the signal returns."),
        feature("web-version", "Web App", 3, listOf(F, F, F, B), 7, freeWith = "kotlin-wasm",
            desc = "The same Compose UI compiled to Wasm and running in every browser."),
        feature("scale-to-1m", "Scale to 1M Users", 3, listOf(B, B, B), 8, coins = 2, freeWith = "kotlinx-coroutines",
            desc = "Structured concurrency, caches, queues and a cloud bill with a comma in it."),
        feature("app-store-featured", "Featured on the App Store", 3, listOf(F, F, F), 8, coins = 2,
            desc = "Polish every pixel and pay for the launch video until Apple's editors notice."),
        feature("admin-panel", "Admin Panel", 3, listOf(F, B, B), 5, freeWith = "exposed",
            desc = "A CRUD screen over every table: the most-used feature nobody outside sees."),
        feature("kotlinconf-keynote", "KotlinConf Keynote Demo", 3, listOf(B, B, A), 6, freeWith = "kotlin-wasm",
            desc = "Your agent live-codes a Wasm app on the main stage; the Wi-Fi holds."),
        feature("accessibility", "Accessibility", 3, listOf(F, F, A), 5, freeWith = "compose-multiplatform",
            desc = "contentDescription everywhere, with an agent auditing every screen."),
        feature("home-widgets", "Home Screen Widgets", 3, listOf(F, F, F), 5, freeWith = "sqldelight", copies = listOf(4),
            desc = "Your app, glanceable without opening it, fed from the local database."),
        feature("security-audit", "Security Audit", 3, listOf(B, B, A), 5, copies = listOf(4),
            desc = "An agent fuzzes every endpoint; the auditor still finds the password in application.yaml."),
        feature("localization", "Localization", 3, listOf(F, A), 4, copies = listOf(4),
            desc = "An agent translates every string into 30 languages; German still overflows the button."),
        feature("gdpr-compliance", "GDPR Compliance", 3, listOf(B, B, F), 5, copies = listOf(5),
            desc = "A cookie banner, a data export endpoint and a lawyer who finally smiles."),
        feature("product-hunt-launch", "Product Hunt Launch", 3, listOf(F, B, A), 5, freeWith = "amper", copies = listOf(5),
            desc = "One Amper build for every platform and a launch-day upvote army."),
        feature("dokka-docs", "Dokka Docs", 3, listOf(B, F, A), 5, freeWith = "amper", copies = listOf(5),
            desc = "KDoc on every public API, mostly written by agents, finally published."),
        feature("wear-os-app", "Wear OS App", 3, listOf(F, F, B), 5, freeWith = "koin", copies = listOf(5),
            desc = "Your app on a 1.4-inch screen; the Compose code mostly just works."),

        business("ipo", "IPO", 3, special = Special.PointsPer(FEATURE, 1), copies = listOf(3, 4),
            desc = "Wall Street counts shipped features, not lines of code."),
        business("acquihire", "Acquihire", 3, points = 2, special = Special.PointsPer(TEAM, 1), copies = listOf(3, 5),
            desc = "Big Tech buys you for the team; the product is a rounding error."),
        business("unicorn-valuation", "Unicorn Valuation", 3, points = 2, special = Special.PointsPer(BUSINESS, 1),
            desc = "Every deal on the slide adds another zero to the valuation."),
        business("open-source-maintainer", "Open Source Maintainer", 3, special = Special.PointsPer(LIBRARY, 2),
            desc = "Your GitHub stars finally count: you know these libraries from the inside."),
    )

    val startups: List<Startup> = listOf(
        Startup(
            "companion", "Companion (dating)", listOf(listOf(F)), startCoins = 5, teamDiscount = 1,
            ability = "Team cards cost you 1💰 less.",
            description = "companion object: the one you always come back to. A dating app that lives and dies by its UI.",
        ),
        Startup(
            "suspend-fun-travel", "suspend fun Travel", listOf(listOf(B)), startCoins = 4, leftoverCoins = 1,
            ability = "When a card is left over at the end of a Sprint, gain 1💰.",
            description = "Bookings that suspend politely while the airline API thinks about it.",
        ),
        Startup(
            "sealed-deals", "Sealed Deals (e-commerce)", listOf(listOf(B)), startCoins = 6, sellValue = 4,
            ability = "Selling a card gives you 4💰.",
            description = "sealed class Order: every state handled, no else branch, no lost parcels.",
        ),
        Startup(
            "by-lazy-studio", "by lazy Studio (games)", listOf(listOf(F)), startCoins = 3, libraryCoins = 2,
            ability = "Gain 2💰 whenever you build a Library.",
            description = "Assets load by lazy, and so does the team on Fridays.",
        ),
        Startup(
            "nullsafe-bank", "NullSafe Bank", listOf(listOf(B)), startCoins = 4, coinsPerPoint = 2,
            ability = "At the end, your 💰 are worth 1⭐ per 2💰.",
            description = "A fintech where every balance is non-null and every ledger lives on the backend.",
        ),
    )

    val ruleset: Ruleset = Ruleset(Rules(agentTokenCost = 1, duel = true), cards, startups)
}
