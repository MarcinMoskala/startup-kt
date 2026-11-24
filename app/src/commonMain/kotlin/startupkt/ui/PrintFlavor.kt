package startupkt.ui

import androidx.compose.ui.graphics.Color
import org.jetbrains.compose.resources.DrawableResource
import startupkt.ui.res.Res
import startupkt.ui.res.*

// GENERATED from print/cards.js + print/data/*.js by print/export-app.sh. Do not edit by hand.

/** IntelliJ-like syntax colours used in the card flavor code (same as the printed cards). */
object Syntax {
    val fn = Color(0xFF57AAF7)
    val kw = Color(0xFFCF8E6D)
    val str = Color(0xFF6AAB73)
    val cls = Color(0xFFC77DBB)
    val text = Color(0xFFDFE1E5)
    val faint = Color(0xFF7A7E85)
    val muted = Color(0xFF9DA0A8)
}

/** Per-card print design data: IDE tab file name, one line of flavor code (coloured tokens) and a comment. */
class PrintFlavor(val file: String, val code: List<Pair<Color, String>>, val comment: String, val art: DrawableResource)

val printFlavors: Map<String, PrintFlavor> by lazy {
    mapOf(
        "junior-compose-dev" to PrintFlavor(
            "Greeting.kt",
            listOf(Syntax.fn to "Text", Syntax.text to "(", Syntax.str to "\"Hi\"", Syntax.text to ", ", Syntax.cls to "Modifier", Syntax.text to ".", Syntax.fn to "padding", Syntax.text to "(16.dp))"),
            "still learning why it recomposes",
            Res.drawable.art_junior_compose_dev,
        ),
        "junior-backend-dev" to PrintFlavor(
            "Endpoint.kt",
            listOf(Syntax.kw to "val", Syntax.text to " user = repo.", Syntax.fn to "find", Syntax.text to "(id)!!"),
            "!! \"just for now\", shipped anyway",
            Res.drawable.art_junior_backend_dev,
        ),
        "mid-fullstack-dev" to PrintFlavor(
            "App.kt",
            listOf(Syntax.text to "client.", Syntax.fn to "get", Syntax.text to "(", Syntax.str to "\"/api\"", Syntax.text to ").", Syntax.fn to "body", Syntax.text to "<", Syntax.cls to "User", Syntax.text to ">()"),
            "either side of the API, just not Gradle",
            Res.drawable.art_mid_fullstack_dev,
        ),
        "junie" to PrintFlavor(
            "Agent.kt",
            listOf(Syntax.text to "project.files.", Syntax.fn to "forEach", Syntax.text to " { ", Syntax.fn to "read", Syntax.text to "(it) }"),
            "reads the whole project first",
            Res.drawable.art_junie,
        ),
        "claude-code" to PrintFlavor(
            "Terminal.kt",
            listOf(Syntax.cls to "@Test", Syntax.kw to " fun", Syntax.fn to " `the one you skipped`", Syntax.text to "()"),
            "asks before it runs rm -rf",
            Res.drawable.art_claude_code,
        ),
        "ui-designer" to PrintFlavor(
            "Theme.kt",
            listOf(Syntax.kw to "val", Syntax.text to " Brand = ", Syntax.fn to "Color", Syntax.text to "(0xFF7F52FF)"),
            "47 shades of grey, one is the brand",
            Res.drawable.art_ui_designer,
        ),
        "ktor" to PrintFlavor(
            "Server.kt",
            listOf(Syntax.fn to "embeddedServer", Syntax.text to "(", Syntax.cls to "Netty", Syntax.text to ") { ", Syntax.fn to "routing", Syntax.text to " { } }"),
            "a whole backend in one expression",
            Res.drawable.art_ktor,
        ),
        "compose-multiplatform" to PrintFlavor(
            "App.kt",
            listOf(Syntax.cls to "@Composable ", Syntax.kw to "fun ", Syntax.fn to "App", Syntax.text to "() { ", Syntax.fn to "Greeting", Syntax.text to "() }"),
            "one UI for Android, iOS, desktop, web",
            Res.drawable.art_compose_multiplatform,
        ),
        "kotlinx-coroutines" to PrintFlavor(
            "Workers.kt",
            listOf(Syntax.fn to "repeat", Syntax.text to "(", Syntax.fn to "100_000", Syntax.text to ") { ", Syntax.fn to "launch", Syntax.text to " { ", Syntax.fn to "work", Syntax.text to "() } }"),
            "100,000 coroutines, your laptop shrugs",
            Res.drawable.art_kotlinx_coroutines,
        ),
        "kotlinx-serialization" to PrintFlavor(
            "User.kt",
            listOf(Syntax.cls to "@Serializable ", Syntax.kw to "data class ", Syntax.cls to "User", Syntax.text to "(…)"),
            "and JSON stops being a source of bugs",
            Res.drawable.art_kotlinx_serialization,
        ),
        "exposed" to PrintFlavor(
            "Users.kt",
            listOf(Syntax.fn to "transaction", Syntax.text to " { ", Syntax.cls to "Users", Syntax.text to ".", Syntax.fn to "selectAll", Syntax.text to "() }"),
            "SQL with type-safe Kotlin",
            Res.drawable.art_exposed,
        ),
        "koin" to PrintFlavor(
            "AppModule.kt",
            listOf(Syntax.fn to "single", Syntax.text to " { ", Syntax.cls to "Repository", Syntax.text to "(", Syntax.fn to "get", Syntax.text to "()) }"),
            "DI without annotation processing",
            Res.drawable.art_koin,
        ),
        "login-screen" to PrintFlavor(
            "Login.kt",
            listOf(Syntax.fn to "authenticate", Syntax.text to "(", Syntax.str to "\"oauth\"", Syntax.text to ") { ", Syntax.fn to "login", Syntax.text to "() }"),
            "three weeks of OAuth edge cases",
            Res.drawable.art_login_screen,
        ),
        "dark-mode" to PrintFlavor(
            "Theme.kt",
            listOf(Syntax.fn to "MaterialTheme", Syntax.text to "(", Syntax.fn to "darkColorScheme", Syntax.text to "()) { }"),
            "done, until design comes back with notes",
            Res.drawable.art_dark_mode,
        ),
        "profile-screen" to PrintFlavor(
            "Profile.kt",
            listOf(Syntax.fn to "OutlinedTextField", Syntax.text to "(bio, { bio = it })"),
            "a surprising number of TextField states",
            Res.drawable.art_profile_screen,
        ),
        "health-check" to PrintFlavor(
            "Health.kt",
            listOf(Syntax.fn to "get", Syntax.text to "(", Syntax.str to "\"/health\"", Syntax.text to ") { call.", Syntax.fn to "respond", Syntax.text to "(", Syntax.str to "\"OK\"", Syntax.text to ") }"),
            "the most reliable code you'll ever ship",
            Res.drawable.art_health_check,
        ),
        "settings-screen" to PrintFlavor(
            "Settings.kt",
            listOf(Syntax.fn to "Switch", Syntax.text to "(checked, onCheckedChange = {})"),
            "each toggle: a decision someone dodged",
            Res.drawable.art_settings_screen,
        ),
        "seed-round" to PrintFlavor(
            "Pitch.kt",
            listOf(Syntax.text to "slides.", Syntax.fn to "forEach", Syntax.text to " { it.", Syntax.fn to "add", Syntax.text to "(", Syntax.str to "\"Kotlin\"", Syntax.text to ") }"),
            "ten slides, one TAM chart, all Kotlin",
            Res.drawable.art_seed_round,
        ),
        "outsourcing-partner" to PrintFlavor(
            "Vendors.kt",
            listOf(Syntax.kw to "val ", Syntax.text to "rate = ", Syntax.text to "agency.", Syntax.fn to "quote", Syntax.text to "() / ", Syntax.fn to "2"),
            "same endpoints at half the invoice",
            Res.drawable.art_outsourcing_partner,
        ),
        "hackathon" to PrintFlavor(
            "Hackathon.kt",
            listOf(Syntax.fn to "withTimeout", Syntax.text to "(", Syntax.fn to "48", Syntax.text to ".hours) { ", Syntax.fn to "prototype", Syntax.text to "() }"),
            "the prototype becomes the product",
            Res.drawable.art_hackathon,
        ),
        "angel-investor" to PrintFlavor(
            "CapTable.kt",
            listOf(Syntax.text to "equity -= ", Syntax.cls to "Angel", Syntax.text to "(", Syntax.str to "\"believer\"", Syntax.text to ").", Syntax.fn to "share"),
            "believes in you, and in 10% of you",
            Res.drawable.art_angel_investor,
        ),
        "eu-grant" to PrintFlavor(
            "Grant.kt",
            listOf(Syntax.fn to "require", Syntax.text to "(form.pages >= ", Syntax.fn to "40", Syntax.text to ") { ", Syntax.str to "\"impact\"", Syntax.text to " }"),
            "free money, after a 40-page form",
            Res.drawable.art_eu_grant,
        ),
        "senior-compose-dev" to PrintFlavor(
            "Screen.kt",
            listOf(Syntax.fn to "rememberSaveable", Syntax.text to " { ", Syntax.fn to "mutableStateOf", Syntax.text to "(", Syntax.str to "\"\"", Syntax.text to ") }"),
            "opinions on remember, and they are right",
            Res.drawable.art_senior_compose_dev,
        ),
        "senior-backend-dev" to PrintFlavor(
            "Queries.kt",
            listOf(Syntax.fn to "withContext", Syntax.text to "(", Syntax.cls to "Dispatchers", Syntax.text to ".IO) { ", Syntax.fn to "query", Syntax.text to "() }"),
            "knows why the database is slow",
            Res.drawable.art_senior_backend_dev,
        ),
        "fullstack-senior" to PrintFlavor(
            "FullStack.kt",
            listOf(Syntax.cls to "@Composable", Syntax.text to " ", Syntax.kw to "fun", Syntax.text to " ", Syntax.fn to "App", Syntax.text to "() = ", Syntax.fn to "Users", Syntax.text to "(api)"),
            "the unicorn hire: UI and query plans",
            Res.drawable.art_fullstack_senior,
        ),
        "agents-with-mcp" to PrintFlavor(
            "McpTools.kt",
            listOf(Syntax.text to "server.", Syntax.fn to "addTool", Syntax.text to "(", Syntax.str to "\"build\"", Syntax.text to ") { ", Syntax.fn to "gradle", Syntax.text to "() }"),
            "real tools: no more guessing, just ship",
            Res.drawable.art_agents_with_mcp,
        ),
        "qa-engineer" to PrintFlavor(
            "LoginTest.kt",
            listOf(Syntax.cls to "@Test", Syntax.text to " ", Syntax.kw to "fun", Syntax.text to " ", Syntax.fn to "`works on both platforms`", Syntax.text to "()"),
            "finds the bug in yesterday's demo",
            Res.drawable.art_qa_engineer,
        ),
        "sqldelight" to PrintFlavor(
            "NoteQueries.kt",
            listOf(Syntax.text to "queries.", Syntax.fn to "selectAll", Syntax.text to "().", Syntax.fn to "executeAsList", Syntax.text to "()"),
            "write SQL, the compiler reviews it",
            Res.drawable.art_sqldelight,
        ),
        "koog" to PrintFlavor(
            "Agent.kt",
            listOf(Syntax.cls to "AIAgent", Syntax.text to "(executor, toolRegistry = tools)"),
            "agents that call tools, not just chat",
            Res.drawable.art_koog,
        ),
        "kotlin-wasm" to PrintFlavor(
            "Main.kt",
            listOf(Syntax.fn to "kotlin", Syntax.text to " { ", Syntax.fn to "wasmJs", Syntax.text to " { ", Syntax.fn to "browser", Syntax.text to "() } }"),
            "your Compose app, in the browser",
            Res.drawable.art_kotlin_wasm,
        ),
        "amper" to PrintFlavor(
            "module.yaml",
            listOf(Syntax.kw to "product", Syntax.text to ": { ", Syntax.kw to "type", Syntax.text to ": ", Syntax.str to "app", Syntax.text to ", ", Syntax.kw to "platforms", Syntax.text to ": [", Syntax.str to "jvm", Syntax.text to "] }"),
            "300 lines of Gradle become a short YAML",
            Res.drawable.art_amper,
        ),
        "rest-api" to PrintFlavor(
            "Routes.kt",
            listOf(Syntax.fn to "get", Syntax.text to "(", Syntax.str to "\"/users\"", Syntax.text to ") { ", Syntax.text to "call.", Syntax.fn to "respond", Syntax.text to "(users) }"),
            "everything else talks to this",
            Res.drawable.art_rest_api,
        ),
        "ios-app" to PrintFlavor(
            "MainViewController.kt",
            listOf(Syntax.fn to "ComposeUIViewController", Syntax.text to " { ", Syntax.fn to "App", Syntax.text to "() }"),
            "same Compose code, now in Swift-land",
            Res.drawable.art_ios_app,
        ),
        "payments" to PrintFlavor(
            "Webhooks.kt",
            listOf(Syntax.text to "json.", Syntax.fn to "decodeFromString", Syntax.text to "<", Syntax.cls to "Payment", Syntax.text to ">(body)"),
            "JSON you must never, ever get wrong",
            Res.drawable.art_payments,
        ),
        "push-notifications" to PrintFlavor(
            "Notifier.kt",
            listOf(Syntax.fn to "launch", Syntax.text to " { queue.", Syntax.fn to "consumeEach", Syntax.text to " { ", Syntax.fn to "push", Syntax.text to "(it) } }"),
            "\"We miss you!\" on two platforms",
            Res.drawable.art_push_notifications,
        ),
        "onboarding" to PrintFlavor(
            "Onboarding.kt",
            listOf(Syntax.fn to "HorizontalPager", Syntax.text to "(state) { ", Syntax.fn to "Slide", Syntax.text to "(it) }"),
            "three swipeable screens nobody reads",
            Res.drawable.art_onboarding,
        ),
        "search" to PrintFlavor(
            "Search.kt",
            listOf(Syntax.text to "rows.", Syntax.fn to "filter", Syntax.text to " { query ", Syntax.kw to "in", Syntax.text to " it.title }"),
            "easy for 10 rows, a career for 10M",
            Res.drawable.art_search,
        ),
        "map-view" to PrintFlavor(
            "MapScreen.kt",
            listOf(Syntax.fn to "MapView", Syntax.text to "(markers = places.", Syntax.fn to "near", Syntax.text to "(me))"),
            "a backend that knows where everything is",
            Res.drawable.art_map_view,
        ),
        "crash-reporting" to PrintFlavor(
            "CrashHandler.kt",
            listOf(Syntax.kw to "catch", Syntax.text to " (e: ", Syntax.cls to "Throwable", Syntax.text to ") { ", Syntax.fn to "report", Syntax.text to "(e) }"),
            "you know before the one-star review does",
            Res.drawable.art_crash_reporting,
        ),
        "series-a" to PrintFlavor(
            "SeriesA.kt",
            listOf(Syntax.kw to "val ", Syntax.text to "raise = team.", Syntax.fn to "sumOf", Syntax.text to " { ", Syntax.fn to "2", Syntax.text to ".coins }"),
            "every hire on the slide is worth cash",
            Res.drawable.art_series_a,
        ),
        "first-paying-customers" to PrintFlavor(
            "Billing.kt",
            listOf(Syntax.kw to "val ", Syntax.text to "mrr = shipped.", Syntax.fn to "sumOf", Syntax.text to " { it.price }"),
            "every shipped feature finally earns",
            Res.drawable.art_first_paying_customers,
        ),
        "kotlinconf-talk" to PrintFlavor(
            "Talk.kt",
            listOf(Syntax.kw to "suspend fun ", Syntax.fn to "liveDemo", Syntax.text to "() = app.", Syntax.fn to "run", Syntax.text to "()"),
            "a live demo needs a working app",
            Res.drawable.art_kotlinconf_talk,
        ),
        "kotlin-workshop" to PrintFlavor(
            "Workshop.kt",
            listOf(Syntax.fn to "launch", Syntax.text to " { ", Syntax.fn to "teach", Syntax.text to "(", Syntax.str to "\"coroutines\"", Syntax.text to ") }"),
            "invoice per library you know",
            Res.drawable.art_kotlin_workshop,
        ),
        "accelerator" to PrintFlavor(
            "Accelerator.kt",
            listOf(Syntax.text to "startup.", Syntax.fn to "apply", Syntax.text to " { equity -= ", Syntax.fn to "7", Syntax.text to ".pct }"),
            "mentors, demo day and cloud credits",
            Res.drawable.art_accelerator,
        ),
        "tech-lead" to PrintFlavor(
            "TechLead.kt",
            listOf(Syntax.text to "team.", Syntax.fn to "forEach", Syntax.text to " { it.", Syntax.fn to "unblock", Syntax.text to "() }"),
            "writes less code, everyone ships more",
            Res.drawable.art_tech_lead,
        ),
        "ai-assistant" to PrintFlavor(
            "Assistant.kt",
            listOf(Syntax.text to "agent.", Syntax.fn to "run", Syntax.text to "(", Syntax.str to "\"Where is my order?\"", Syntax.text to ")"),
            "an agent that actually calls your API",
            Res.drawable.art_ai_assistant,
        ),
        "multi-agent-workflow" to PrintFlavor(
            "Workflow.kt",
            listOf(Syntax.fn to "listOf", Syntax.text to "(planner, coder, reviewer)"),
            "one plans, one codes, you approve PRs",
            Res.drawable.art_multi_agent_workflow,
        ),
        "realtime-chat" to PrintFlavor(
            "Chat.kt",
            listOf(Syntax.text to "messages.", Syntax.fn to "collect", Syntax.text to " { ", Syntax.fn to "show", Syntax.text to "(it) }"),
            "Flow over WebSockets: never miss a word",
            Res.drawable.art_realtime_chat,
        ),
        "offline-mode" to PrintFlavor(
            "OfflineSync.kt",
            listOf(Syntax.text to "db.queries.", Syntax.fn to "selectAll", Syntax.text to "().", Syntax.fn to "asFlow", Syntax.text to "()"),
            "works in the metro, syncs when back",
            Res.drawable.art_offline_mode,
        ),
        "web-version" to PrintFlavor(
            "WebMain.kt",
            listOf(Syntax.fn to "ComposeViewport", Syntax.text to " { ", Syntax.fn to "App", Syntax.text to "() }"),
            "the same Compose UI, in every browser",
            Res.drawable.art_web_version,
        ),
        "scale-to-1m" to PrintFlavor(
            "Scale.kt",
            listOf(Syntax.fn to "repeat", Syntax.text to "(", Syntax.fn to "1_000_000", Syntax.text to ") { ", Syntax.fn to "launch", Syntax.text to " { ", Syntax.fn to "serve", Syntax.text to "() } }"),
            "and a cloud bill with a comma in it",
            Res.drawable.art_scale_to_1m,
        ),
        "app-store-featured" to PrintFlavor(
            "Launch.kt",
            listOf(Syntax.kw to "val ", Syntax.text to "video = ", Syntax.fn to "shoot", Syntax.text to "(takes = ", Syntax.fn to "47", Syntax.text to ")"),
            "polish every pixel until editors notice",
            Res.drawable.art_app_store_featured,
        ),
        "admin-panel" to PrintFlavor(
            "Admin.kt",
            listOf(Syntax.cls to "Users", Syntax.text to ".", Syntax.fn to "selectAll", Syntax.text to "().", Syntax.fn to "forEach", Syntax.text to "(::row)"),
            "the most-used screen nobody outside sees",
            Res.drawable.art_admin_panel,
        ),
        "kotlinconf-keynote" to PrintFlavor(
            "Keynote.kt",
            listOf(Syntax.fn to "check", Syntax.text to "(wifi.isUp) { ", Syntax.str to "\"pray\"", Syntax.text to " }"),
            "live-coded on the main stage, Wi-Fi held",
            Res.drawable.art_kotlinconf_keynote,
        ),
        "accessibility" to PrintFlavor(
            "A11y.kt",
            listOf(Syntax.fn to "Icon", Syntax.text to "(cart, contentDescription = ", Syntax.str to "\"Buy\"", Syntax.text to ")"),
            "an agent audits every single screen",
            Res.drawable.art_accessibility,
        ),
        "home-widgets" to PrintFlavor(
            "Widget.kt",
            listOf(Syntax.kw to "class", Syntax.text to " TasksWidget : ", Syntax.cls to "GlanceAppWidget", Syntax.text to "()"),
            "glanceable without opening the app",
            Res.drawable.art_home_widgets,
        ),
        "security-audit" to PrintFlavor(
            "Audit.kt",
            listOf(Syntax.text to "routes.", Syntax.fn to "forEach", Syntax.text to " { agent.", Syntax.fn to "fuzz", Syntax.text to "(it) }"),
            "password still in application.yaml",
            Res.drawable.art_security_audit,
        ),
        "localization" to PrintFlavor(
            "Strings.kt",
            listOf(Syntax.fn to "Text", Syntax.text to "(", Syntax.fn to "stringResource", Syntax.text to "(Res.string.buy))"),
            "30 languages; German still overflows",
            Res.drawable.art_localization,
        ),
        "gdpr-compliance" to PrintFlavor(
            "Privacy.kt",
            listOf(Syntax.fn to "get", Syntax.text to "(", Syntax.str to "\"/me/export\"", Syntax.text to ") { call.", Syntax.fn to "respond", Syntax.text to "(me) }"),
            "a cookie banner and a smiling lawyer",
            Res.drawable.art_gdpr_compliance,
        ),
        "product-hunt-launch" to PrintFlavor(
            "Launch.kt",
            listOf(Syntax.fn to "repeat", Syntax.text to "(", Syntax.fn to "1_000", Syntax.text to ") { ", Syntax.fn to "launch", Syntax.text to " { ", Syntax.fn to "upvote", Syntax.text to "() } }"),
            "one build, every platform, upvote army",
            Res.drawable.art_product_hunt_launch,
        ),
        "dokka-docs" to PrintFlavor(
            "Docs.kt",
            listOf(Syntax.str to "/** Returns the user with this [id]. */"),
            "KDoc everywhere, mostly by agents",
            Res.drawable.art_dokka_docs,
        ),
        "wear-os-app" to PrintFlavor(
            "Watch.kt",
            listOf(Syntax.fn to "ScalingLazyColumn", Syntax.text to " { ", Syntax.fn to "item", Syntax.text to " { ", Syntax.fn to "Chip", Syntax.text to "() } }"),
            "your app on a 1.4-inch screen",
            Res.drawable.art_wear_os_app,
        ),
        "ipo" to PrintFlavor(
            "Ipo.kt",
            listOf(Syntax.text to "points += features.", Syntax.fn to "size"),
            "Wall Street counts features, not LOC",
            Res.drawable.art_ipo,
        ),
        "acquihire" to PrintFlavor(
            "Acquisition.kt",
            listOf(Syntax.text to "bigTech.", Syntax.fn to "hire", Syntax.text to "(team); product.", Syntax.fn to "sunset", Syntax.text to "()"),
            "the product is a rounding error",
            Res.drawable.art_acquihire,
        ),
        "unicorn-valuation" to PrintFlavor(
            "Valuation.kt",
            listOf(Syntax.text to "valuation *= ", Syntax.fn to "10.0", Syntax.text to ".", Syntax.fn to "pow", Syntax.text to "(deals.size)"),
            "every deal adds another zero",
            Res.drawable.art_unicorn_valuation,
        ),
        "open-source-maintainer" to PrintFlavor(
            "Maintainer.kt",
            listOf(Syntax.text to "points += ", Syntax.fn to "2", Syntax.text to " * libraries.", Syntax.fn to "size"),
            "you know these libraries from the inside",
            Res.drawable.art_open_source_maintainer,
        ),
    )
}
