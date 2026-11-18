# agent-06 report: AI agents (🤖)

## Rulesets
- **base**: original export (`base-def.json`).
- **final = ag1** (`final-def.json`, identical to `ag1.json`):
  1. 🤖 *tokens*: `rules.agentSubCost = 1`, i.e. when a 🤖 stands in for 📱/🖥 you pay 1💰. A 🤖 used in a 🤖 slot is free. 🤖 still cannot be bought.
  2. Claude Code → MCP Server chain (`mcp-server.freeWith = claude-code`; Anthropic created MCP).
  3. Junie → Koog chain (`koog.freeWith = junie`; both JetBrains). Koog → AI Assistant chain stays.
  4. Multi-agent Workflow: was a dead S3 team card (built 0 times in 2000 games). Now an S3 FEATURE: cost 🤖🤖🖥, 7⭐, free with MCP Server.
- Rejected variants: ag2/ag3 (🤖 can be rented for 2💰/3💰: no gain, adds a rule), ag4 (NullSafe starts with 4💰: NSB back to 0.33 at 4p with balanced bots),
  ag5 (Tech Lead +3⭐: lift only goes 0.2→0.7), max1 (max one 🤖 substitution per build: no effect, NSB still 0.48),
  nowild (🤖 is never a wildcard: balanced, but agents lose their identity), ag6/ag7 (Junie = "📱/🤖", Claude Code = "🖥/🤖", 2💰/3💰: nice flavour and no new symbol, but it pushes agent card win-lift back to 1.5 to 1.75).

## Code changes (my copy only)
- `engine/Model.kt`: `Rules.agentSubCost`, `Rules.maxAgentSubsPerBuild`, `Rules.agentRentExtra` (experimental), `Startup.coins` (optional starting-coins override), `Payment.agentSubs`.
- `engine/Engine.kt`: payment is now an exhaustive cheapest-plan search (costs are at most 4 slots), counting freelancers and 🤖 substitutions. Defaults reproduce the old rules exactly.
- `sim/Simulator.kt` + `cli/Main.kt`: comeback metrics (per-player win % of the last player after S1, the leader after S1 and the leader after S2); the CLI shows "🤖 tokens xN".
- `EngineTest.kt`: test for the token rule. All tests pass.

## Simulations (startup win rates, `balanced` in every seat, 2000 games per player count)
| ruleset | 2p NSB / others | 3p | 4p | 5p |
|---|---|---|---|---|
| base | 0.65 / 0.45-0.48 | 0.57 / 0.25-0.29 | 0.49 / 0.17-0.20 | 0.40 / 0.14-0.15 |
| NSB = 📱/🖥 choice | 0.58 | 0.43 | 0.33 | 0.26 |
| tok1 (token rule only) | 0.50 / 0.49-0.52 | 0.35 / 0.31-0.35 | 0.26 / 0.23-0.26 | 0.25 / 0.18-0.20 |
| **final (ag1)** | 0.51 / 0.46-0.51 | 0.34 / 0.29-0.37 | 0.27 / 0.23-0.25 | 0.25 / 0.17-0.20 |
Mixed bots (engine, ai-fan, balanced), final: NSB 0.49/0.26/0.23/0.21 at 2/3/4/5p, others 0.46-0.54/0.33-0.38/0.24-0.27/0.19-0.22.
Single bot type at 4p, final: NSB 0.20 (engine), 0.17 (ai-fan), 0.25 (librarian), 0.27 (balanced), 0.11 (greedy). It is slightly weak for bots that never invest, but no longer dominant.

Agent card win-lift (4p, balanced+engine+greedy+ai-fan), base → final:
claude-code 1.71→1.23, junie 1.61→1.13, mcp-server 1.80→1.15, ai-assistant 1.77→1.34, keynote 1.79→1.30, accessibility 1.59→1.18, PH launch 1.49→1.24, koog 1.53→0.92, multi-agent-workflow never built→1.17.
2p: claude/junie 1.70/1.67 → 1.31/1.36.

Comeback / skill (4p): last after S1 wins about 28-38% per player (baseline 25%), the leader after S2 wins about 40-42% with balanced bots (about 24% in mixed games, where the greedy bot leads early).
Close games (margin ≤2⭐): 4p balanced 44% → 50%. With random,balanced,engine,greedy at 4p: random wins 0%, engine 69%→65%. Skill dominates and luck is moderate.

## Games played (by me): 20
| # | config | ruleset | my seat / startup | result | note |
|---|---|---|---|---|---|
| 1 | 4p, balanced/engine/ai-fan | base | suspend-fun-travel | 1st 37 (36,34,27) | One Junie = wildcard; by S3 every card was free, so S3 was just "take the biggest number". |
| 2 | 3p, balanced/engine | base | NullSafe | 1st 37 (30,29) | Claude Code + Junie = 3 wildcards in S1, so I could build anything for free. 3 agent features came to me uncontested. |
| 3 | 5p, ai-fan/engine/balanced/ai-fan | base | suspend-fun-travel | 1st 38 (34,33,30,24) | Human team only, no agents. |
| 4 | 2p vs engine | ag1 | NullSafe | 1st 31-25 | Tokens bite: I hit 0💰 in S1. The free MCP via Claude Code felt great. In 2p, agent-only features are exclusive and can be picked late. |
| 5 | 4p engine/ai-fan/balanced | ag1 | sealed-deals | 1st 38 (32,29,25) | Human engine. The NSB bot ended S1 with 0💰. |
| 6 | 3p engine/engine | ag1 | NullSafe | 1st 38 (35,33) | Junie route; a Claude Code bot sniped Koog. Every token was a real money decision. |
| 7 | 5p ai-fan/engine/ai-fan/balanced | ag1 | by-lazy | 2nd 33 (NSB engine 36) | MCP for 3💰 as a non-NSB; Multi-agent went around the table and came back to me. |
| 8 | 2p hot-seat (agents vs humans) | ag1 | both | agents 34-31 | Agent seat was at 2⭐ vs 12⭐ mid-game and won through exclusive S3 agent cards. |
| 9 | 4p engine/engine/balanced | ag1 | NullSafe | 1st 40 | NSB + humans; tokens used sparingly. |
| 10 | 3p ai-fan/balanced | ag1 | suspend-fun-travel | 1st 40 | Claude Code→MCP→Multi-agent chain: strong but costly early. |
| 11 | 3p hot-seat (agents / B2B humans / money) | ag1 | all | 36-36-24 | Tie, broken on coins. Seat 2 sold Multi-agent to deny the agent player. |
| 12 | 5p engine x2/balanced/ai-fan | ag1 | companion | 1st 36 | Human route; agent features were available to me only through selling. |
| 13 | 4p engine/ai-fan/balanced | ag6 | companion | 1st 36 | Junie as "📱/🤖" was flavourful and made App Store free. |
| 14 | 2p vs ai-fan | ag1 | by-lazy | 1st 33-23 | Non-agent seat; one dead last pick (keynote). |
| 15 | 4p engine x3 | ag1 | NullSafe | 1st 39 (34,32,21) | Agent-only cards came to me uncontested at the end. |
| 16 | same seed as 15 | base | NullSafe | 1st 38 | Base: MCP gave 5 wildcards, every pick was "pay 0", no decisions. |
| 17 | 3p engine/ai-fan | ag1 | sealed-deals | 2nd 32 (NSB engine 37) | NSB is still viable. |
| 18 | 2p hot-seat (humans vs Junie) | ag1 | both | agents 35-29 | The human seat sold Koog and Keynote to deny, but got a hand of 4 agent-only cards (dead hand). |
| 19 | 5p engine x4 | ag1 | suspend-fun-travel | 1st 37 (35,33,32,27) | Came back from 11 vs 17 after S2. |
| 20 | 3p engine x2 (seed of g2) | ag1 | NullSafe | 1st 36 (32,30) | Pure-agent opening starved me of money; I needed humans (seniors). "Agents need people" emerges without a new rule. |

## Findings
1. 🤖 as a free wildcard is too strong. A 🤖 is strictly better than 📱 or 🖥, never needs to be bought, and also unlocks exclusive 🤖-cost cards. NullSafe starts with one: 2x the baseline win rate at 3-5p.
   About half of the edge comes from the wildcard (NSB = 📱/🖥 choice still wins 0.33 at 4p) and half from exclusive access.
2. With free wildcards, from mid S2 every option shows "pay 0💰": S3 becomes "take the highest number". Tokens bring the coin decision back.
3. Multi-agent Workflow (S3 team, 3💰) and Tech Lead (S3 team) are dead: producing resources in S3 is almost worthless. Multi-agent is now a feature reward. Tech Lead still needs a fix (a suggestion for whoever owns team cards).
4. Exclusivity: cards that need 🤖 can't be built without 🤖 (🤖 can't be bought). In 2p and 3p the only agent player can pick them late, and non-agent players can get dead hands (g18).
   This is acceptable: selling to deny is a real counterplay. Could be softened by renting 🤖 for 3💰 (ag3 is fine balance-wise), but that adds a rule exception, so I left it out.
5. Bots: `engine` (production-heavy) is the strongest (0.43-0.82 win rate). `greedy` (immediate points only) is the weakest. `ai-fan` was good in base but bad with tokens, because it values 🤖 flat and ignores token costs.
   fullstack-intern (1💰, 📱/🖥 choice) has the highest win-lift of all cards (about 2.0) in every ruleset. That is a balance issue outside my focus.

## Flavour / naming suggestions
- Token rule text: "🤖 can do 📱 or 🖥 work, but each such use costs 1💰 in tokens." Fits on the rule card.
- Junie: "JetBrains' coding agent in your IDE." Chain icon → Koog. Claude Code: "Agentic coding in your terminal." Chain icon → MCP Server.
- MCP Server: "Give your agents tools." Multi-agent Workflow: "Agents orchestrating agents." AI Assistant: "Built with Koog."
- Optional flavour variant (tested, ag6): Junie produces "📱/🤖", Claude Code "🖥/🤖". Each is free in its home domain and costs tokens elsewhere.
- For KotlinConf print, translate the remaining Polish names: Stażysta Full-stack → Full-stack Intern, Ekran profilu → Profile Screen, Kontrakt B2B → B2B Contract,
  Anioł biznesu → Angel Investor, Płatności → Payments, Wyszukiwarka → Search, Widok mapy → Map View, Pierwsi klienci → First Customers, Talk na KotlinConf → KotlinConf Talk,
  AI Assistant w aplikacji → In-app AI Assistant, Wersja Web → Web Version, Skalowanie do 1M userów → Scale to 1M Users, Featured w App Store → App Store Feature,
  Panel admina → Admin Panel, Demo w keynote KotlinConf → KotlinConf Keynote Demo, Launch na Product Hunt → Product Hunt Launch, Widgety → Home-screen Widgets,
  Dokumentacja w Dokka → Dokka Docs, Wycena → Valuation, Ekran ustawień → Settings Screen.

## Final verification (2000 games per player count, seed 7)
Balanced bots in every seat: base NSB 0.65/0.57/0.49/0.40 → final 0.49/0.34/0.26/0.25 (others in final: 0.49-0.52 / 0.32-0.35 / 0.23-0.26 / 0.18-0.20).
Close games ≤2⭐ (balanced): base 31/40/44/50% → final 32/43/50/52%.
Mixed (balanced,engine,greedy,ai-fan): base NSB 0.62/0.47/0.40/0.34 → final 0.45/0.30/0.19/0.20 (others 0.49-0.54/0.32-0.38/0.26-0.27/0.18-0.22).
Comeback, final, 4p balanced: last after S1 wins 28.6% (baseline 25%), leader after S2 41.6%. These are almost unchanged from base, so the token rule does not hurt tension.
Total simulated games: about 190,000.
