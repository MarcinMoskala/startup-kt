package startupkt

import startupkt.engine.Engine
import startupkt.sim.Simulator
import kotlin.test.Test
import kotlin.test.assertEquals

class SimulatorTest {
    @Test
    fun simulationIsDeterministic() {
        val engine = Engine()
        val a = Simulator(engine).run(20, 4, listOf("balanced", "greedy"), 5)
        val b = Simulator(engine).run(20, 4, listOf("balanced", "greedy"), 5)
        assertEquals(a, b)
    }
}
