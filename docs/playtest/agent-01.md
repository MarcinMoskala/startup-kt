# agent-01 report: 3-player balance and fun

Focus: 3 players (base deck: every card appears exactly once, all 45 cards are dealt, 36 are picked, 9 discarded).
Final ruleset: `final-def.json` (= `defs/v5.json`), validated; `./gradlew test` passes.
Played: 21 games personally (2 of them hot-seat with all 3 seats). Simulated: ~220,000 bot games.

## Tools / code changes (my copy only)
- `engine/Model.kt` + `engine/Engine.kt`: new rule `maxFreelancersPerBuild` (default 99 = old behaviour). One line in `payment()`.
- `sim/Simulator.kt` + `cli/Main.kt`: comeback stats (P(win) of the leader / last player after Sprint 1 and after Sprint 2).
- `bots/Bots.kt`: bot name `p<w>` (e.g. `p5`) = balanced-style heuristic with production weight `w` (for strategy sweeps; no new logic).
- `tools/sim.py` (7 bot mixes, startups, card lifts, comeback), `tools/strat.sh` (strategy-viability matrix), `tools/sweep.sh`, `tools/variant.py` + `v2.py`/`v3.py` (def patches). Helpers `n.sh`, `a.sh`, `h.sh` (hot-seat).

## Rulesets
- **base** = `base-def.json`.
- **v2a**: freelancer 1💰, max 2 freelancers per build, extra library chains, B2B = free freelancers.
- **v3**: v2a + B2B/Valuation reworks, Tech Lead & Multi-agent Workflow → Sprint 2, MCP Server → S3 feature, First Customers → S3.
- **v3a**: v3 + NullSafe Bank produces 🖥.
- **v4c**: v3a + Junie / Claude Code cost 3💰.
- **v5 = final**: v4c + Accessibility costs 📱📱📱, Product Hunt Launch costs 📱🖥🖥 (no 🤖).

## Games
| # | ruleset | opponents | my result | note |
|---|---|---|---|---|
| 1 | base | balanced, engine | 1st 38 / 33 / 29 | 2 agents + seniors → every S3 card free; S3 = "take the biggest number" |
| 2 | base | engine, ai-fan | 1st 35 / 31 / 28 | NullSafe 🤖 start; Ktor wasted (REST API taken by a player buying freelancers) |
| 3 | base | greedy, engine | 1st 35 / 34 / 25 | NullSafe, almost no Team; Koog→AI Assistant near-guaranteed (nobody else has 🤖🤖) |
| 4 | base | ai-fan, engine | 1st 41 / 38 / 24 | Junie + MCP Server (3 agents) = whole S3 free |
| 5 | base | engine, engine | 2nd 32 / 34 / 28 | 0💰 and no 📱: with 2💰 freelancers a broke player cannot act |
| 6 | v2a | engine, balanced | 2nd 37 / 40 / 32 | B2B "free freelancers" = I never paid again (too strong); Valuation at 3💰 = +0 |
| 7 | v3a | balanced, ai-fan | 1st 41 / 37 / 34 | Multi-agent Workflow in S2 is a real decision now; IPO worth +7 |
| 8 | v3a | hot-seat (lib / engine / points) | lib 36, engine 32, points 29 | 3 strategies within 7⭐; engine was 5⭐ after S2 and came back to 32 |
| 9 | v3a | engine, greedy | 2nd 34 / 36 / 32 | 3 libraries; both S2 targets taken before I saw them |
| 10 | v3a | engine, ai-fan | 3rd 31 / 35 / 35 | over-built Team; bots now competitive |
| 11 | v3a | balanced, librarian | 1st 41 / 38 / 34 | all three tied at 27 two picks before the end |
| 12 | v3a | hoarder, engine | 1st 42 / 30 / 29 | IPO +8; hoarder got 12⭐ from 24💰 via Valuation |
| 13 | v3a | engine, engine | 3rd 34 / 36 / 35 | 3-way finish within 2⭐ |
| 14 | v3a | ai-fan, balanced | 1st 39 / 36 / 36 | 34-34 before the last pick |
| 15 | v4c | balanced, engine | 2nd 36 / 36 (lost on coins) / 29 | last after S2 (10 vs 15/15), tied for 1st at the end |
| 16 | v4c | ai-fan, librarian | 2nd 35 / 42 / 34 | three of my chain targets in one S3 hand, could take only one |
| 17 | v4c | hot-seat (lib / AI / money) | money 35, AI 33, lib 32 | library seat hit 0💰 twice and had to sell |
| 18 | v4c | engine, balanced | 2nd 34 / 35 / 33 | last after S2 (9 vs 17), lost by 1 |
| 19 | v4c | greedy, ai-fan | 1st 39 / 35 / 35 | last after S2 (10 vs 17/17) and won |
| 20 | v4c | balanced, hoarder | 1st 29 / 27 / 26 | no agents: my last 2 S3 hands were 100% 🤖-only cards → v5 change |
| 21 | v5 | engine, ai-fan | 2nd 35 / 39 / 32 | 3 of my 6 chain targets taken by others |
Base: 4 wins of 5. New rulesets (single seat): 7 wins of 14, more close finishes, comebacks from last place after S2 (games 15, 18, 19).

## Simulations (3 players)

### Baseline problems
- balanced/engine/greedy: engine **0.78**, balanced 0.16, greedy 0.06; close games (≤2⭐) 28%.
- Production sweep (`pW` vs two `p5`): p0 0.04, p1 0.04, p2 0.10, p3 0.16, p4–p12 ≈0.33; `p5` vs two `p1`: **0.72**. Building people is the dominant strategy.
- NullSafe Bank (🤖 start) **0.48–0.51**, other startups 0.27–0.32 (2p 0.62, 4p 0.42, 5p 0.37).
- Dead cards: Multi-agent Workflow (built in 0% of games), Tech Lead 1%, MCP Server 9%, Series A 9%, Full-stack Senior 19%; Valuation win-lift 0.05, Hackathon 0.32. Card win-lifts range 0.00–2.52; Junie, Claude Code and the 🤖 S3 features have the highest lifts.
- Comeback: in mixed games, the leader after S1 wins 3–23% (the S1 scoreboard is meaningless because engines score 0 early).

### Levers (strategy matrix, 400 games/cell; win rate of the first bot vs 2× the second; ideal ≈0.33)
| variant | p1vsP5 | p2.5vsP5 | p5vsP1 | ai-fan | librarian | hoarder | greedy |
|---|---|---|---|---|---|---|---|
| base | 0.04 | 0.10 | 0.72 | 0.27 | 0.03 | 0.05 | – |
| freelancer 1💰 | 0.31 | 0.24 | 0.19 | 0.39 | 0.09 | 0.58 | – |
| fl 1 + sell 2 | 0.22 | 0.16 | 0.27 | 0.34 | 0.06 | 0.61 | 0.48 |
| Team +1💰 | 0.13 | 0.23 | 0.60 | 0.32 | 0.09 | 0.19 | 0.15 |
| fl 1, max 1/build | 0.02 | 0.06 | 0.90 | 0.35 | 0.02 | 0.00 | 0.00 |
| fl 1, max 2/build | 0.20 | 0.17 | 0.47 | 0.40 | 0.04 | 0.20 | 0.29 |
| fl 2, max 2/build | 0.02 | 0.09 | 0.82 | 0.27 | 0.02 | 0.01 | 0.02 |
| v2a | 0.28 | 0.31 | 0.40 | 0.44 | 0.16 | 0.25 | 0.32 |
| v3 | 0.34 | 0.38 | 0.39 | 0.45 | 0.14 | 0.26 | 0.32 |
| v3a | 0.30 | 0.36 | 0.50 | 0.46 | 0.13 | 0.18 | 0.25 |
| v4a (juniors 1💰) | 0.33 | 0.38 | 0.40 | 0.54 | 0.13 | 0.20 | 0.30 |
| v4c (agents 3💰) | 0.38 | 0.49 | 0.41 | 0.50 | 0.17 | 0.23 | 0.32 |
| **v5 (final)** | 0.42 | 0.50 | **0.34** | 0.47 | 0.18 | 0.29 | 0.48 |
Also tried, little effect: +1⭐ on S1/S2 features, −1⭐ on S3 features, −1⭐ on Keynote/AI Assistant (engine still 0.51–0.73).

### Final ruleset (1500 games per mix)
| mix | base | final |
|---|---|---|
| balanced/engine/greedy | engine 0.79, bal 0.16, greedy 0.05 | engine 0.37, greedy 0.34, bal 0.29 |
| engine/ai-fan/librarian | 0.60 / 0.35 / 0.05 | 0.41 / 0.44 / 0.15 |
| balanced/hoarder/ai-fan | 0.31 / 0.09 / 0.60 | 0.48 / 0.07 / 0.45 |
| balanced/engine/librarian | 0.19 / 0.77 / 0.04 | 0.56 / 0.34 / 0.10 |
| engine/engine/greedy | greedy 0.02 | greedy 0.34 |
| close games (≤2⭐), mix 1 | 28% | 52% |
| startups | NullSafe 0.49, others 0.27–0.31 | 0.32–0.34 all |
| card win-lift range | 0.00–2.52 | 0.50–1.40; nothing built in <8% of games (Series A 8%, niche) |
- Comeback, balanced×3 mirror: leader after S1 wins 0.36, last after S1 0.32, leader after S2 0.51, last after S2 0.19 (base 0.32/0.35/0.50/0.17). Mixed bots: last after S1 wins 0.31–0.46 (base 0.47–0.71, because engines start at 0⭐).
- Skill vs luck: random vs 2 balanced = 0.00 win; the 3-balanced mirror has 48% close games. Skill decides between a novice and a decent player; card flow decides between equals.
- Other player counts (500 games): 4p engine 0.17–0.40 (base 0.44–0.61), close games 51–55% (base 38–42%); 5p engine 0.16 (base 0.46), NullSafe 0.19–0.21 (base 0.37–0.42); 2p engine vs balanced 0.53 (base 0.78).

## Changes in the final ruleset (with reasons)
1. **Freelancer costs 1💰, at most 2 freelancers per build.** Rule text: "Missing up to two 📱/🖥? Hire freelancers, 1💰 each." Production was the only winning plan (p5 beats p1 72%). 1💰 alone overshoots (cash wins 48–63%). The cap keeps Team cards necessary for 4-cost S3 cards.
2. **NullSafe Bank produces 🖥 (not 🤖).** 🤖 cannot be bought, so a 🤖 start locked in 4–5 S3 cards: 0.48–0.58 win rate → 0.33.
3. **Junie and Claude Code cost 3💰** (AI subscription plus tokens). Agent cards had the highest win-lifts; engine 0.55 → 0.44.
4. **Accessibility: 📱📱📱** (still free with Compose Multiplatform). **Product Hunt Launch: 📱🖥🖥.** Neither really needs an AI agent; 5 of 15 S3 cards required 🤖, so a player without agents had dead hands (game 20). Engine 0.44 → 0.37, greedy-vs-engine 0.18 → 0.34.
5. **Tech Lead → Sprint 2, 3💰; Multi-agent Workflow → Sprint 2, 2💰** (copies [3]). Producers in Sprint 3 are useless (0–1% built); in S2 they were built 27–57%.
6. **MCP Server → Sprint 3 Feature**: 🖥🖥🤖, 5⭐, free with Ktor (the Kotlin MCP SDK runs on Ktor). An MCP server is something you build, not a team member. Copies [3,5].
7. **First Customers → Sprint 3** (copies [3,4]). "+1💰 per ⭐ card" is worth less than selling in S2 (2–3 features) and fine in S3 (5–7).
8. **More library chains**: Push Notifications free with kotlinx.coroutines (Flow), Accessibility free with Compose Multiplatform (semantics API), Onboarding free with Koin. At 3p each target exists once and often goes to someone else (games 2, 9, 16, 21). Two targets per library give the library plan a chance (game 8: the library seat won).
9. **Kontrakt B2B: +1💰, +2💰 per your 👥** (body-leasing your devs). The old effect (1💰 freelancers) is meaningless when freelancers cost 1💰; "free freelancers" was too strong (game 6).
10. **Valuation: also +3💰 immediately.** Win-lift 0.05 → 0.50; it enables the money plan (game 12 hoarder 12⭐ from coins; game 17 the money seat won).

## Findings not fully solved
- **Library chains at 3p** are still the weakest plan (librarian bot 0.10–0.18). In my games I lost about half of my chain targets to other players. Possible next step: library = 2⭐, or chain = "costs 2 fewer resources" so a partial chain still helps.
- **IPO** is the strongest single S3 pick (+6 to +8 in my games, always taken). Suggestion (not tested): IPO costs 2💰, or "1⭐ per 2 ⭐ cards + 3⭐".
- **Sprint 3 with a big engine** is still mostly "take the highest number"; the cap of 2 freelancers helps only players without an engine.
- **Being broke (0💰)** is very punishing because selling costs a whole pick (games 5, 17). The new B2B and Valuation help.
- **Series A** (8% built) is fine as a niche card but could give +1💰 per 👥 plus 1⭐.

## Bot notes (for the central AI work)
- `engine` (production weight 4.5) was dominant in base only because of the rules; it is roughly even now.
- `librarian` (library weight 3) is the weakest: it over-pays for libraries whose targets go to others.
- `hoarder` (coin weight 2) sells too often and ends with a large pile of 💰 that turns into points at 3:1 (2:1 with Valuation).
- `greedy` became competitive with the new rules (0.34 vs engines).
- All heuristic bots ignore hand rotation. They don't deny chain targets to the next player, they don't see which cards will wheel (pick-1 hand returns at pick 4 at 3p), and they sometimes leave free chain cards on the table (game 4: ai-fan skipped a free Real-time Chat). A human beats them at about 50% in 3p on the new rules (about 80% on base).

## Flavour / realism suggestions
- MCP Server is a server (feature), not a team member; Kotlin MCP SDK + Ktor makes the Ktor chain authentic.
- Accessibility needs Compose UI work (📱📱📱), not an AI agent; Compose semantics make the CMP chain authentic.
- Product Hunt Launch needs a working app + backend (📱🖥🖥), not AI.
- AI agents cost more (3💰: subscription + tokens) but stay wildcards. This matches "flexible but not free".
- NullSafe Bank as a backend-heavy bank (🖥) is more believable than an AI-first bank.
- Card names mix Polish and English (Ekran profilu, Płatności, Wycena...). For KotlinConf print, use one language (English).
