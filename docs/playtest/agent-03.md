# agent-03 report: 5-player focus

## Rulesets
- **R1** = original default (`def-base.json`)
- Change scripts: `mk.py` (named patches v1..v12 applied to `def-base.json`), `sim.sh`; all rulesets in `defs/`, sim outputs in `sims/`.
- **R2** = R1 + NullSafe Bank starts with 0💰 (v1c) + S2 libraries (except Koog) 2⭐ (v3b) + S3 teams give 2⭐ & cheaper (Tech Lead 1💰, Multi-agent 2💰) (v6) + stronger business cards (Hackathon 2⭐+2💰, Angel +5💰, KUG Meetup 1⭐+2💰, First Customers +2💰 per ⭐) (v7)
- **R3** = R2 + more chain targets (Accessibility←Compose MP, Keynote←Ktor, Push←coroutines, Search←serialization, Widgets←Koin)
- **R4** = R3 + Valuation costs 3💰, 1⭐ per 1💰 (rejected: unusable in play, money is spent by S3)
- **R5** = R3 + Valuation 2⭐ per 💼 card (rejected: greedy bot 41-43% at 3-4p, runaway leaders)
- **R6 = final** (`final-def.json`) = R3 + Valuation: 2⭐ + 1⭐ per your 💼 card (free) + Angel back to +4💰 + English card names. Code: Business icon 💰→💼.

## Games played (seat 0 = me unless noted)
| # | config | rules | result | note |
|---|---|---|---|---|
| 1 | 5p, me vs engine,balanced,ai-fan,engine | R1 | 4th (29 vs 35) | Overbuilt production in S2 (2 teams); S3 = "take biggest ⭐", last pick two dead team cards |
| 2 | 5p same mix | R1 | 1st (40 vs 38) | NullSafe Bank; Koog→AI Assistant free + MCP Server = every S3 card buildable |
| 3 | 5p | R1 | 2nd (34 vs 38) | Bank, money-first (seed+angel) then 3 teams; 2x Tech Lead in one hand, both dead |
| 4 | 5p | R2 | 1st (43 vs 33) | ~5 production incl. MCP; Ktor chain wasted (could build REST API anyway) |
| 5 | 5p | R2 | 3rd-ish (32 vs 36, 4 players within 5⭐) | No-teams money strategy: leading after S1 (8⭐) but broke by S3; Amper→Product Hunt chain saved me |
| 6 | 5p hot-seat: me seats 0 (B2B+agents) & 2 (libraries) vs engine,balanced,ai-fan | R2 | seat0 1st 37, seat2 3rd 29 | Seat 0 took Scale to 1M (seat 2's Exposed target) simply because it was the best card: in 5p chain targets are often taken before they reach you |
| 7 | 5p vs 4x engine | R2 | 2nd on tiebreak (33 vs 35; three players at 33) | Very tense finish. Both my S2 library chains (Koog, Amper) were sniped by engines before reaching me |
| 8 | 5p vs engine,balanced,ai-fan,greedy | R4 | 1st (38 vs 32) | Last after S1 (1⭐, greedy had 10) → 1st after S2 via B2B + chains (REST, Payments, Push free). Valuation (3💰) unaffordable at the end |
| 9 | 4p vs engine,ai-fan,balanced | R4 | 2nd (34 vs 44) | Balanced bot hit CMP→iOS + serialization→Search+Payments chains, First Customers, IPO 7⭐; my Exposed target sniped. Weak S2 opening hand of 4 business cards |
| 10 | 3p vs engine,balanced | R4 | 2nd (36 vs 37) | Lost by 1. In 3p your first hand returns at pick 4, so planning is easier. Valuation (3💰, 1⭐/💰) useless with 3💰 left |
| 11 | 5p vs engine,greedy,balanced,ai-fan | R6 | 2nd (38 vs 42) | Libraries: Serialization→Payments hit, Search missed; SQLDelight target (Offline) sniped. Last after S1 (1⭐) → 2nd. NullSafe Bank bot (0💰 start) still won |
| 12 | 2p vs engine | R6 | 1st (40 vs 30) | 2p: you see each hand twice, chains reliable (iOS, Keynote, Accessibility free). Noticed 💰 icon used both for coins and Business type ("1⭐ per your 💰") – confusing; changed Business icon to 💼 |
| 13 | 5p vs balanced,engine,greedy,ai-fan | R6 | 1st (43 vs 33) | Business mix (Seed, Talk) + Valuation (2⭐+1/💼 = 5) + IPO (which is itself 💼): nice end-game combo decisions |
| 14 | 5p vs engine,engine,balanced,balanced | R6 | 1st on coin tiebreak (35 vs 35) | No MCP, 5 mixed production; last pick Tech Lead (2⭐) instead of dead card |
| 15 | 5p vs ai-fan,engine,greedy,balanced | R6 | 2nd= (35 vs 39) | Both Serialization targets (Search, Payments) sniped upstream – 5p library frustration again. Final picks had real choices (App Store via 4💰 freelancers vs free Product Hunt) |
| 16 | 5p vs engine,ai-fan,engine,balanced | R6 | 2nd= (33 vs 34; 4 players within 3⭐) | NullSafe Bank at 0💰: playable, but being broke in S3 meant I could not afford Scale to 1M (needed one 2💰 freelancer) |
| 17 | 5p vs greedy,balanced,engine,ai-fan | R6 | 1st (39 vs 38) | Koin targets (Admin Panel, Widgets) both taken upstream; two IPOs in one 5p hand. Close finish |
| 18 | 5p vs engine,balanced,ai-fan,greedy | R6 | 3rd (37 vs 38/38) | Bank at 0💰: first pick only Health-check affordable (awkward but fine). Lost by 1; Kotlin/Wasm target taken by greedy. IPO as last pick = 5⭐ |
| 19 | 5p vs balanced,ai-fan,engine,engine | R6 | 2nd (34 vs 41) | Spent S2 on production (Senior Compose, MCP), 4th at 9⭐ after S2 → 2nd. Exposed target (Scale) sniped; S2 leader won |
| 20 | 4p vs engine,greedy,balanced | R6 | 2nd (37 vs 40) | Ktor chain gave REST API + Keynote free (2 targets helps); Coroutines target (Real-time Chat) sniped |

## Simulations (5000 games each, bots balanced,engine,greedy,ai-fan,librarian rotated over seats)
| metric | R1 2p | R6 2p | R1 3p | R6 3p | R1 4p | R6 4p | R1 5p | R6 5p |
|---|---|---|---|---|---|---|---|---|
| close games ≤2⭐ | 19% | 34% | 28% | 52% | 43% | 55% | 42% | 56% |
| spread 1st-last | 7.4 | 4.7 | 9.0 | 5.9 | 9.4 | 7.8 | 12.3 | 9.5 |
| NullSafe Bank win | 0.61 | 0.45 | 0.47 | 0.31 | 0.39 | 0.25 | 0.33 | 0.20 |
| other startups | .45-.48 | .49-.53 | .29-.31 | .32-.36 | .21-.22 | .24-.26 | .16-.17 | .19-.21 |
| best/worst bot | eng .83 / bal .17 | .63/.37 | eng .79 / greedy .05 | .42/.28 | eng .43 / greedy .04 | .27/.22 | eng .45 / greedy .03 | eng .34 / lib .12 |
| last after S1 wins (baseline 1/n) | .74 | .59 | .73 | .39 | .40 | .24 | .38 | .28 |
| leader after S2 wins | .60 | .64 | .18 | .41 | .22 | .40 | .27 | .35 |

Comeback metrics were added to the simulator (code). In R1 the S1 leader almost never wins (5%): early points are a trap, engine-first is dominant. In R6 every phase matters a bit but leads are not decisive.
Skill check (5p, engine,balanced,hoarder,random,greedy): random bot wins 0% in both R1 and R6 → decisions matter. All-engine mirror 5p R6: close games 53%, leader-after-S2 wins 51% (2.5x baseline) – S3 can swing, but a lead after S2 is meaningful.

Card health 5p (winLift, R1 → R6): Tech Lead 0.38 (built 126/5000 games) → 0.62 (built 6216); Multi-agent Workflow built 4 → 3190; Valuation 0.10 → 1.05; Hackathon 0.48 → 0.97; Angel 0.55 → 0.81; S1 libraries 0.56-0.65 → 0.60-0.89.

## Changes and reasons
1. NullSafe Bank starts with 0💰 (startup-level `startCoins`, code change). 🤖 start = free wildcard + access to 🤖 cards; won 33-61% at all counts. 0💰 → 0.20-0.45; 1💰 tested and still 0.26 at 5p / 0.42 at 3p.
2. S3 team cards: Tech Lead 1💰 + 2⭐, Multi-agent Workflow 2💰 + 2⭐. Previously dead in S3 (production with 3 picks left is worthless; I sold/discarded them in every game).
3. S2 libraries (not Koog) 2⭐: they cost 2 resources, as much as a 3⭐ feature.
4. Extra chain targets for S1 libraries. In 5p a target card is often taken upstream before it reaches you (I lost 1-2 chains in games 6,7,9,11,15,17,18,19,20). Two targets per library halves that frustration; library lift 0.57→0.86.
5. Business buffs: Hackathon 2⭐+2💰, KUG Meetup 1⭐+2💰, First Customers +2💰 per ⭐. Valuation → 2⭐ + 1⭐ per 💼 (mirrors IPO/Acquihire, no new rule). Greedy/hoarder bots went from 3-5% to 14-29%.
6. Business icon 💼 instead of 💰 (code). "1⭐ per your 💰" read as "per coin".
7. Rejected: freelancer price 1 (greedy then dominates and leader-after-S2 wins 49%); Acquihire 2/👥 (engine 42%); Valuation coin-based (dead card in practice).
