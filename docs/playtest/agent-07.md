# Agent-07 report: libraries and free-build chains (freeWith)
Final ruleset: final-def.json (= defs/v3.json with English names). Validates; gradle tests pass.

## Games (20 played by me; other seats bots)
| # | Config | Ruleset | Result | Note |
|---|---|---|---|---|
| 1 | 3p vs engine,balanced | base | 1st 36 | Won with 0 libraries; 6 production units -> every S3 card buildable, chains irrelevant |
| 2 | 5p | base | 1st 40 | Ktor->REST API free while I had only 🤖: one real chain moment; Koog target buildable anyway |
| 3 | 4p | base | 1st 38 | No libraries again; engine took CMP owner's iOS App |
| 4 | 2p vs engine | v1 (2 targets,+2) | 1st 40-35 | Hate-sold opponent's Scale (coroutines chain), read that Web would return |
| 5 | 3p | v1 | 1st 38 | ai-fan built 5 libs, landed 2 chains |
| 6 | 5p | v1 | 1st 42 | Amper + Koog chains landed |
| 7 | 4p | v1 | 2nd 40 (tie, coins) | SQLDelight target stolen; target cards can be undealt |
| 8 | 2p | base | 1st 34-33 | Koog made 🤖🤖 AI Assistant possible; B2B kills chain value |
| 9 | 3p | v2 | 1st 46 | Read that only I could use AI Assistant; it came back; 4 chains |
| 10 | 5p | v2 | 2nd 37 (39 NSB) | Koin chained twice but saves little (cheap targets) |
| 11 | 4p | v2 | 2nd 37 (38) | 0 libraries; lost by 1 to library player: both viable |
| 12 | 2p | v2 | 1st 31-25 | Hate-sell 9-pt chain card; my Exposed target stolen |
| 13 | 3p | v2 | 3rd 31 (42) | 4 libs, too little 📱: libraries are not an auto-win |
| 14 | 4p | v2 | 1st 41 | Out of coins -> libraries only affordable picks; Search+Web chains |
| 15 | 5p | v2 | 4th 34 (43 NSB) | Last after S1 (0⭐), recovered only to 4th |
| 16 | 3p (I was NSB) | v2 | 1st 42 | NullSafe's 🤖 pays any 1-res library: natural library engine |
| 17 | 2p | v2 | 1st 35-25 | Read opponent couldn't build Scale; it returned |
| 18 | 4p (NSB, no libs) | v2 | 2nd 39 (44 lib player) | Stole 3 chain targets but lost to 4-lib player |
| 19 | 5p | v2 | 4th 28 (40 NSB) | No 🤖 -> 4 S3 cards unbuildable |
| 20 | 3p | base | 3rd 26 (34) | Control: 1⭐ library never beat a 2⭐ screen |

## Simulations (1000-3000 games per cell)
Head-to-head bots differing only in library weight (engine-lib 1.2 / engine 0.5 / engine-nolib -3), relative win (1.0 = fair):
| Ruleset | 2p lib/nolib | 3p lib/eng/nolib | 4p | 5p | chain payoff/library |
|---|---|---|---|---|---|
| base | 0.54/1.46 | 0.49/0.92/1.58 | 0.72/1.53/1.54 | 0.68/1.55/1.52 | 0.39-0.51 |
| 2 targets only | 0.30/1.70 | 0.34/0.82/1.84 | 0.37/1.22/1.97 | - | 0.59-0.69 |
| 2 targets + lib 2⭐ | 0.64/1.36 | 0.58/0.85/1.56 | - | - | 0.55-0.68 |
| final (2 targets, lib 2⭐, chain +1⭐) | 1.13/0.87 | 1.36/1.10/0.54 | 0.98/1.33/0.91 | 0.88/1.18/0.92 | 0.73-0.94 |

Standard mix (balanced,engine,ai-fan,greedy,hoarder), base -> final:
| | 2p | 3p | 4p | 5p |
|---|---|---|---|---|
| free chain builds/player | 0.78->2.1 | 0.98->2.6 | 0.70->1.9 | 0.51->1.6 |
| engine rel. win | 1.63->1.13 | 1.70->0.80 | 1.77->1.06 | 2.72->1.39 |
| balanced rel. win | 0.37->0.87 | 0.41->1.06 | 0.75->1.33 | 0.58->1.05 |
| close games | 19->28% | 39->37% | 41->40% | 41->46% |
| last after S1 wins | 0.75->0.56 | 0.53->0.28 | 0.41->0.26 | 0.49->0.25 |
| leader after S2 wins | 0.61->0.66 | 0.45->0.51 | 0.19->0.38 | 0.16->0.37 |
| avg winning score | 34.7->39.1 | 36.7->42.3 | 35.4->40.6 | 34.9->39.3 |

## Changes
1. Two chain targets per library: CMP->iOS App, Accessibility; Ktor->REST API, Real-time Chat; coroutines->Push, Scale to 1M; serialization->Payments, Search; Koin->Onboarding, Map View; SQLDelight->Offline Mode, Home Widgets; Koog->AI Assistant; Kotlin/Wasm->Web Version, KotlinConf Keynote Demo; Exposed->Admin Panel; Amper->Product Hunt, Dokka.
2. Library 2⭐ (was 1).
3. Rule chainBonusPoints=1: feature built via its library is free and +1⭐.
4. Copy fixes (exact 15/20/25 decks): serialization@3, Exposed@3, Koin@4, Amper@4, Home Widgets@3, Dokka@4, Product Hunt@5, Hackathon@4, Splash@5, First Customers@4, KUG Meetup@5.
5. Keynote moved from Koog to Wasm (Koog + two 🤖-gated targets was too strong).
6. English card names.

## Code changes
Model.kt/Engine.kt (Rules.chainBonusPoints), Simulator.kt/Main.kt (chain payoff, comeback stats), Bots.kt (engine-lib, engine-nolib; bots value the chain bonus). Scripts: mk.py, sim.py, sim2.py, sim3.py, p.sh.

## Other findings
NullSafe Bank wins 1.4-2.1x its fair share (still 1.5x as 📱/🖥). Multi-agent Workflow was built 0 times in all sims. B2B Contract devalues chains. 🤖 lock makes S3 frustrating. In 2p, 1/3 of cards are undealt.
