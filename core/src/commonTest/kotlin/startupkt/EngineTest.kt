package startupkt

import startupkt.engine.*
import startupkt.engine.Res.*
import kotlin.test.*

class EngineTest {
    private val engine = Engine()

    @Test
    fun defaultRulesetIsValid() {
        assertEquals(emptyList(), DefaultRuleset.ruleset.validate())
    }

    @Test
    fun deckSizesMatchPlayerCounts() {
        for (p in 3..5) for (s in 1..3) assertEquals(p * 5, DefaultRuleset.ruleset.deckFor(s, p).size, "sprint $s, $p players")
    }

    @Test
    fun agentCoversFrontendOrBackendButNotViceVersa() {
        assertEquals(emptyList(), engine.missingResources(listOf(listOf(AGENT), listOf(BACKEND)), listOf(FRONTEND, BACKEND)))
        assertNull(engine.missingResources(listOf(listOf(FRONTEND), listOf(BACKEND)), listOf(AGENT)))
        assertEquals(listOf(FRONTEND), engine.missingResources(listOf(listOf(BACKEND)), listOf(FRONTEND, BACKEND)))
    }

    @Test
    fun agentIsReservedForAgentSlotsWhenPossible() {
        // 🤖 must go to the 🤖 slot, 📱 gets bought, rather than failing.
        assertEquals(listOf(FRONTEND), engine.missingResources(listOf(listOf(AGENT)), listOf(FRONTEND, AGENT)))
        // Choice unit 📱/🖥 plus 🤖 covers 📱🖥.
        assertEquals(emptyList(), engine.missingResources(listOf(listOf(FRONTEND, BACKEND), listOf(AGENT)), listOf(BACKEND, FRONTEND)))
    }

    @Test
    fun freeChainAndDuplicateRules() {
        val p = PlayerState(0, "x", "companion", coins = 0, hand = emptyList(), built = listOf("ktor"))
        assertEquals(true, engine.payment(p, engine.ruleset.card("rest-api"))?.free)
        assertNull(engine.payment(p, engine.ruleset.card("ktor")))
    }

    @Test
    fun freelancerCostsCoinsAndB2BDiscounts() {
        val p = PlayerState(0, "x", "companion", coins = 4, hand = emptyList())
        assertEquals(4, engine.payment(p, engine.ruleset.card("profile-screen"))?.coins.let { it?.plus(2) }) // 📱 own, 🖥 bought for 2
        val withB2b = p.copy(built = listOf("outsourcing-partner"))
        assertEquals(1, engine.payment(withB2b, engine.ruleset.card("profile-screen"))?.coins)
    }

    @Test
    fun fullGameRunsAndHandsRotate() {
        var s = engine.newGame(3, 42)
        val firstHand1 = s.player(0).hand
        repeat(3) { seat -> s = engine.submit(s, seat, Action.Sell(s.player(seat).hand.first())) }
        assertEquals(2, s.pick)
        assertEquals(firstHand1.drop(1), s.player(1).hand, "seat 1 receives seat 0's hand")
        while (!s.finished) for (seat in 0..2) s = engine.submit(s, seat, engine.legalActions(s, seat).first())
        assertEquals(3 * 3 * 4, s.players.sumOf { it.built.size + it.sold.size })
    }

    @Test
    fun cannotActTwiceOrWithForeignCard() {
        var s = engine.newGame(3, 1)
        val foreign = s.player(1).hand.first()
        assertFailsWith<IllegalActionException> { engine.submit(s, 0, Action.Sell(foreign)) }
        s = engine.submit(s, 0, Action.Sell(s.player(0).hand.first()))
        assertFailsWith<IllegalActionException> { engine.submit(s, 0, Action.Sell(s.player(0).hand.first())) }
    }

    @Test
    fun agentDoingHumanWorkCostsTokens() {
        // NullSafe Bank produces 🖥; with Junie (🤖) a 📱🖥 card costs 1💰 in tokens instead of 2💰 for a freelancer.
        val p = PlayerState(0, "x", "nullsafe-bank", coins = 5, hand = emptyList(), built = listOf("junie"))
        val pay = engine.payment(p, engine.ruleset.card("login-screen"))!!
        assertEquals(1, pay.coins)
        assertEquals(1, pay.agentTokens)
        // A 🤖 in a 🤖 slot is free.
        val q = p.copy(built = listOf("junie", "senior-backend-dev"))
        assertEquals(0, engine.payment(q, engine.ruleset.card("kotlinconf-keynote"))!!.coins)
    }

    @Test
    fun roadmapStagesInOrder() {
        val sealed = PlayerState(0, "x", "sealed-deals", coins = 5, hand = emptyList())
        assertEquals(3, engine.sellValue(sealed))
        // MVP needs 🖥🖥: the startup makes one 🖥, the other comes from a freelancer.
        assertEquals(2, engine.stagePayment(sealed)!!.coins)
        val pmf = sealed.copy(tucked = listOf("a"))
        assertEquals("Product-Market Fit", engine.nextStage(pmf)!!.name)
        assertEquals(5, engine.sellValue(sealed.copy(tucked = listOf("a", "b"))))
        val done = sealed.copy(tucked = listOf("a", "b", "c"))
        assertEquals(null, engine.nextStage(done))
        assertEquals(null, engine.stagePayment(done))
    }

    @Test
    fun stageActionTucksCardAndScores() {
        var s = engine.newGame(3, 11)
        s = s.copy(players = s.players.map { it.copy(coins = 20) })
        val card = s.player(0).hand.first()
        assertTrue(engine.options(s, 0).any { it.action == "stage:$card" })
        s = engine.submit(s, 0, Action.Stage(card))
        repeat(2) { seat -> s = engine.submit(s, seat + 1, Action.Sell(s.player(seat + 1).hand.first())) }
        assertEquals(listOf(card), s.player(0).tucked)
        assertEquals(1, engine.score(s, 0).roadmap)
        assertEquals(Action.Stage("ktor"), Action.parse("stage:ktor"))
    }

    @Test
    fun duelStageWithDiscard() {
        var s = engine.newGame(2, 5)
        s = s.copy(players = s.players.map { it.copy(coins = 20) })
        val h0 = s.player(0).hand
        val h1 = s.player(1).hand
        s = engine.submit(s, 0, Action.parse("stage:${h0[0]},discard:${h0[1]}"))
        s = engine.submit(s, 1, Action.Sell(h1[0], discard = h1[1]))
        assertEquals(listOf(h0[0]), s.player(0).tucked)
        assertEquals(6, s.player(1).hand.size)
    }

    @Test
    fun duelDealsEightAndRequiresDiscard() {
        var s = engine.newGame(2, 3)
        assertEquals(8, s.player(0).hand.size)
        val hand = s.player(0).hand
        assertFailsWith<IllegalActionException> { engine.submit(s, 0, Action.Sell(hand[0])) }
        s = engine.submit(s, 0, Action.Sell(hand[0], discard = hand[1]))
        s = engine.submit(s, 1, Action.Sell(s.player(1).hand[0], discard = s.player(1).hand[1]))
        assertEquals(6, s.player(0).hand.size)
        while (!s.finished) for (seat in 0..1) {
            val a = engine.legalActions(s, seat).first()
            val d = s.player(seat).hand.first { it != a.cardId }
            s = engine.submit(s, seat, a.withDiscard(d))
        }
        assertEquals(2 * 3 * 4, s.players.sumOf { it.built.size + it.sold.size })
    }

    @Test
    fun actionParsingWithDiscard() {
        assertEquals(Action.Build("ktor", "junie"), Action.parse("build:ktor,discard:junie"))
        assertEquals("sell:ktor,discard:junie", Action.Sell("ktor", "junie").encode())
    }
}
