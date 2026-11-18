# agent-08 report: card realism, names and descriptions

Ruleset versions: **base** = original; **v2** = realism pass + NullSafe Bank 📱/🖥 + S3 team fixes; **v3** = v2 with NullSafe Bank 🖥;
**v5** = v3 + seniors 2💰 + Scale to 1M cloud bill (= `final-def.json`); **+agentLimit1** = v5 with optional rule "max one 🤖 stand-in per build".
Generator: `gen.py` (base-def.json + patches/variants), sim summary: `sim.py`, raw outputs in `sims/`.

## Games played personally: 20 (7 wins, 7 seconds, 4 thirds, 2 fourths), 2p x5, 3p x6, 4p x6, 5p x5 (g01 base, g02 v2, g03-g07 v3, g08-g20 v5 / v5+agentLimit1)
| # | Config (players, my seat, opponents) | Ruleset | My result | Note |
|---|---|---|---|---|
| g01 | 4p seat0 vs balanced,engine,ai-fan | base | 3rd 32 (win 38 ai-fan NullSafe🤖) | S3 pick3 hand = 2x Tech Lead + Valuation: dead hand, forced sell |
| g02 | 3p seat0 vs engine,ai-fan | v2 (bank 📱/🖥) | 1st 40-38 | full-stack production made all S3 features free; Offline Mode came back to me at pick 4 (3p memory is nice) |
| g03 | 5p seat0 vs engine,ai-fan,balanced,engine | v3 | 2nd 33 (34-33-33-32-32) | tried early points + cash (login, angel, seed, first customers +6): viable; Tech Lead (2⭐+🤖) unlocked Keynote on last pick |
| g04 | 2p seat0 vs engine | v3 | 1st 40-28 | 2p hand swap: you see what opponent is denied; MCP agents -> AI Assistant 7⭐; Valuation tempting at 14💰 |
| g05 | 4p seat2 vs balanced,ai-fan,engine | v3 | 2nd 36-37 | Claude Code + seed/angel cash; Scale to 1M free with 🤖-as-🖥; Valuation +3⭐ last pick |
| g06 | 3p seat0 vs balanced,librarian | v3 | 1st 33-30 (last after S1: 3⭐ vs 6/6) | ran out of cash -> could not buy 1 freelancer for App Store; Valuation (+3💰) as rescue then Tech Lead's 📱 made App Store free on last pick |
| g07 | 5p seat2 vs greedy,engine,ai-fan,balanced | v3 | 3rd 32 (35/32/32/30/26) | team-heavy S2 (Series A, 2 seniors) left me 6⭐ vs 18⭐ after S2, caught up to 32 in S3 with 8 production; never saw Acquihire |
| g08 | 4p seat0 vs engine,engine,ai-fan | v5 | 2nd 35-40 | took Ktor+serialization but both REST API and Payments were built by others without chain (chains feel unreliable at 4p); Scale to 1M with the 2💰 cloud bill felt right; 🤖🤖🤖 made App Store 📱📱📱📱 free (agents doing pixel polish is unrealistic) |
| g09 | 2p seat0 vs ai-fan | v5 | 1st 36-29 | Outsourcing Partner (freelancers 1💰) + few devs: every S3 card cost 1💰; ran dry once in S2 (forced sell); denied opponent's Ktor chain by building REST API myself |
| g10 | 4p seat1 vs greedy,hoarder,engine | v5 | 4th 28 (35/30/29/28) | over-built team in S1-S2 (3⭐ after S2 vs 15-16); 7 units made all S3 cards free but 4 picks can't close a 12⭐ gap; a hand of 3 seniors only = no real choice |
| g11 | 3p seat0 vs engine,hoarder | v5 | 2nd 31-36 | no 🤖 all game: last hand was Keynote + Multi-agent Workflow, both unbuildable -> forced sell; Scale to 1M unaffordable with 1💰 (cloud bill matters); hoarder (pure cash) 23⭐ |
| g12 | 5p seat3 vs balanced,ai-fan,engine,librarian | v5 | 4th 29 (32/30/30/29/27) | Junie + chains (serialization->Payments); Tech Lead in S3 enabled Scale+Keynote; Multi-agent Workflow on last pick = 1⭐ filler. Very close 5p game |
| g13 | 2p seat0 vs balanced | v5 | 1st 29-28 | 2p: hand comes back at pick 3, so you plan 2 picks ahead and deny chains (took Scale, left Chat to the coroutines owner); IPO as last pick 4⭐ |
| g14 | 4p seat0 vs engine,balanced,ai-fan | v5 | 1st 40 (40/32/28/27) | cash strategy: Seed+Angel = 12💰 by end S1, then bought freelancers (App Store 8⭐ for 6💰) + IPO 6⭐; leader after S2 and held |
| g15 | 5p seat0 vs engine,ai-fan,balanced,greedy | v5 | 2nd 32-34 | last after S2 (8⭐ vs 11-18) and came back to 2nd: Keynote, Widgets, Web App, Chat all free from 5 units; Outsourcing barely used |
| g16 | 3p seat1 vs ai-fan,engine | v5 | 1st 35 (3-way tie 35/35/35, won on 💰) | agent-heavy (Claude Code + Agents with MCP = 🖥🤖🤖🤖): Web App 📱📱📱🖥 and Keynote free; three 🤖 doing all the UI feels unrealistic |
| g17 | 4p seat0 vs ai-fan,engine,balanced | v5+agentLimit1 | 2nd 31-35 | one Claude Code under the 'max one 🤖 stand-in per build' rule still felt great (App Store = 📱📱📱+🤖); hate-drafted Scale to 1M from the Spring Boot owner (leader) — he still won |
| g18 | 2p seat1 vs engine | v5+agentLimit1 | 2nd 28-33 | Outsourcing + full-stack; REST API never appeared (2p deals 10 of 15 cards, my Ktor was dead); 0💰 blocked Scale (cloud bill) until Unicorn Valuation's +3💰 paid for it two picks later — nice combo |
| g19 | 3p seat0 vs balanced,ai-fan | v5 | 3rd 30 (33/31/30) | cash route (Seed+Hackathon 10💰); chose Unicorn Valuation over Tech Lead and the last hand was Keynote + AI Assistant, both 🤖-only -> sold. Real tension: Tech Lead would have won it |
| g20 | 5p seat2 vs engine,balanced,ai-fan,engine | v5 | 3rd 30 (35/32/30/30/28) | Claude Code + Agents with MCP; first S3 hand had zero features (IPO, Acquihire, 2x Multi-agent Workflow, Valuation) -> took Acquihire 4⭐; AI Assistant 7⭐ with 3 🤖 |

## Simulations (~135k bot games total)
Mix: 2p balanced+engine; 3p/5p balanced,engine,ai-fan,librarian(,greedy); 4p balanced,engine,ai-fan,librarian. 2000 games per count.
`cb` = comeback stats (new in Simulator): L1 = leader after Sprint 1 wins %, L2 = leader after Sprint 2 wins %, last1 = last after Sprint 1 wins %.

| | base | final-def |
|---|---|---|
| NullSafe Bank win rate 3p / 4p / 5p | 0.48 / 0.42 / 0.34 | 0.33 / 0.25 / 0.19 (others 0.17-0.34) |
| close games (≤2⭐) 3p / 4p / 5p | 38 / 42 / 41 % | 41 / 45 / 49 % |
| Multi-agent Workflow built (8k games) | 2 | 1211 (lift 0.91) |
| Tech Lead built | 143 (lift 0.45) | 5740 (lift 0.52) |
| Unicorn Valuation lift | 0.17 | 0.48 |
| Hackathon lift | 0.60 | 0.79 |
| greedy bot win 5p | 0.03 | 0.10 |
| comeback 4p L1 / L2 / last1 | 20 / 44 / 39 % | 20 / 43 / 37 % |
| comeback 5p L1 / L2 / last1 | 6 / 17 / 41 % | 12 / 23 / 39 % |
| engine vs random (2p) | 0.99 / 0.01 | 0.99 / 0.01 |
| 4p engine/balanced/greedy/random | .62/.32/.06/.00 | .54/.27/.19/.00 |

Optional rule "agents need a human reviewer" (agentSubstituteLimit=1): balance ~unchanged (4p close 46%, startups 0.23-0.26), Agents with MCP lift 1.52 -> 0.92, ai-fan bot 0.32 -> 0.27 at 4p. Limit 2 is almost a no-op.

## Changes (final-def.json) and reasons
Realism / cost logic:
- **Login Screen 📱 2⭐ -> 📱🖥 3⭐** (auth needs a backend); **Dark Mode 📱📱 3⭐ -> 📱 2⭐** (it's a theme switch, not a profile screen); **Profile Screen 📱🖥 -> 📱📱** (UI-heavy; backend already exists). S1 📱/🖥 demand unchanged.
- **Seniors cost 2💰** (were 1💰; Full-stack Senior stays 2💰): price per unit of output is now consistent (junior free trainee, mid 1💰/1 flexible unit, senior 2💰/2 units, agents 2-3💰). Full-stack Senior at 3💰 was tested and died (built 378/4000).
- **Scale to 1M Users: 🖥🖥🖥🖥 -> 🖥🖥🖥 + 2💰 cloud bill**, free with **Spring Boot** (new S2 4p library, replaces Exposed's slot). Only-backend is right for scaling; the money cost makes it feel like infra. In g11/g18 it was blocked by 0💰, in g18 Valuation's +3💰 paid for it later - good decision space.
- **Admin Panel free with Exposed** (Exposed moved to S1 5p replacing **Koin**): Koin (DI) enabled no real feature; a CRUD admin over SQL tables is exactly Exposed.
- **NullSafe Bank produces 🖥 instead of 🤖**: banks are backend shops, and the 🤖 startup was dominant (0.42 at 4p vs ~0.2). 📱/🖥 choice was tested: still 0.31.
- **Tech Lead: 2💰, 📱 🖥 🤖 + 2⭐** (was no ⭐): late hires need immediate value; a TL "ships less but makes others ship" -> points. Was dead (143 builds), now a real S3 choice (g03, g06, g09 it unlocked the last pick).
- **Multi-agent Workflow: costs 🤖 (needs an agent to orchestrate), 0💰, produces 🤖🤖 + 1⭐** (was 3💰): was never built (0-2 of 8000).
- **First Paying Customers +2💰 per ⭐ feature** (was +1): lift 0.47 -> 1.24; customers pay for features.
- **Hackathon 1⭐ +3💰** (was +2), **Unicorn Valuation +3💰 now** plus 1⭐/2💰: both were near-dead (0.39 / 0.17).
Names (whole deck in English for KotlinConf): Stażysta Full-stack -> **Mid Full-stack Dev** (an intern costing more than a junior was odd), Kontrakt B2B -> **Outsourcing Partner**, Anioł biznesu -> Angel Investor, MCP Server -> **Agents with MCP** (MCP is a protocol for tools, not a worker), Meetup KUG (+3💰) -> **Paid Kotlin Workshop** (meetups don't pay), Pierwsi klienci -> First Paying Customers, Wycena -> Unicorn Valuation, Wersja Web -> Web App, plus direct translations (iOS App, Payments, Search, Map View, Profile/Settings Screen, In-app AI Assistant, Scale to 1M Users, Featured on the App Store, Admin Panel, KotlinConf Keynote Demo, Product Hunt Launch, Home Screen Widgets, Dokka Docs), startups "(dating)", "(games)". Renamed cards also got matching ids.
Every card and startup has a one-sentence `description` (see `startup cards --def final-def.json`).

## Code changes
- `engine/Model.kt`: `Card.description`, `Startup.description` (default ""), `Rules.agentSubstituteLimit` (default -1 = unchanged rules).
- `engine/Engine.kt`: `missingResourcesLimited` (at most N 🤖 units stand in for 📱/🖥 per build); used by `payment`.
- `sim/Simulator.kt` + `cli/Main.kt`: comeback stats (leader after S1/S2, last after S1 win %); `cards` prints descriptions.
- `EngineTest.kt`: test for the agent limit. All tests pass.

## Findings
1. Agents (🤖) are still the strongest engine: Claude Code / Junie / Keynote / Dokka / AI Assistant have the top win-lift (1.5-1.7). In my games 3 🤖 built Web App (📱📱📱🖥) and App Store (📱📱📱📱) alone - unrealistic. The optional limit rule fixes the flavour and nerfs MCP stacking without hurting balance; recommended if one more rule line is acceptable.
2. Comebacks: being last after Sprint 1 is *good* (37-46% win at 3-5p vs 20-33% baseline): investing in team beats early points. Leader after S2 wins only ~2x baseline; 5p S3 is very swingy (L2 = 23%). Yet skill clearly matters (random bot never wins; engine 54% at 4p).
3. Strategies that won my games: early cash + freelancers (g14 40⭐), Outsourcing Partner (g09), full-stack engine (g02), agents (g16), chains are unreliable at 4-5p (g08: both my chain targets built by others).
4. 2p uses only 10 of 15 cards per sprint: libraries often have no target (g18 Ktor dead).
5. Bot heuristics: `engine` strongest everywhere (production weight 4.5); `ai-fan` 2nd; `balanced` mid; `greedy` weak but improved in final-def; `librarian` and `hoarder` very weak (libraries' lift 0.5-0.65 because bots value them only by chain points); `random` never wins.
6. Not verified: real-human feel of the agent limit beyond 2 games; library values (other agents' focus).
