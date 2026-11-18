# agent-05 report: the economy (💰)

Final ruleset: `final-def.json` (= v3e), validated. 20 personal games, ~60k simulated games.

## Rule versions
| ver | changes vs previous |
|---|---|
| base | original |
| v1 | sellValue 3→2; Series A +2💰/👥 (was +1); Pierwsi klienci +2💰/⭐card (was +1); KUG Meetup: +2💰 per 📚 (was flat +3); Wycena: end 1⭐ per 1💰 (was per 2💰) |
| v2a (rejected) | v1 + coinsPerPoint 2 → engine 80% at 3p, margins up |
| v2b | v1 + S3 "launch/marketing budgets": Featured w App Store +3💰, Product Hunt +2💰, Keynote +2💰, Skalowanie do 1M +2💰 (coin cost on top of resources; chains still free) |
| v3a | v2b + Hackathon 1⭐ +3💰 (was +2) |
| v3b | v3a + Tech Lead and Multi-agent Workflow give 2⭐ |
| v3c | v3b + startCoins 3→4 |
| v3e = final | v3c + Acquihire: 1⭐ + 1⭐ per 👥 |

## Games (me = seat 0, others bots)
| # | config | rules | result | note |
|---|---|---|---|---|
| 1 | 4p engine,balanced,ai-fan | base | 2nd 32 vs 41 | Series A gave +3 = exactly a sell; KUG = sell; Pierwsi klienci +1; Wycena w/ 1💰 useless |
| 2 | 3p engine,ai-fan | base | WON 37-35 | Seed→MCP; S3 everything free, ended with 6💰 unused |
| 3 | 5p engine,balanced,ai-fan,librarian | v1 | 3rd 34 (39) | Series A +6 vs senior devs = real choice; but 8💰 unused at end (no S3 sink) |
| 4 | 4p engine,hoarder,ai-fan | v2b | WON tie 30 on coins | broke in S3: could not afford Featured (3💰) – money finally mattered late |
| 5 | 3p hoarder,engine | v2b | WON 37 (27) | last after S1; Seed+Series A paid Scale/Featured/PH, ended 0💰 |
| 6 | 5p hoarder,engine,ai-fan,balanced | v2b | 3rd 31 (38) | B2B contractor line; Tech Lead (2💰) unlocked PH |
| 7 | 4p ai-fan,engine,hoarder | v2b | 3rd 30 (31,30) | lost coin tiebreak at 0💰; Series A +6 vs Search 5 dilemma |
| 8 | 3p engine,balanced | v2b | WON tie 34 on coins | money line: Wycena with 7💰 → 9⭐; after it each sell = 2⭐ |
| 9 | 4p ai-fan,engine,balanced | v3e | 2nd 33 vs 34 | S2 hand of 4 business cards – choosing between them was fun |
| 10 | 5p ai-fan,engine,balanced,hoarder | v3e | 3rd 28 (32) | broke at S1P4 (0💰, couldn't hire 1💰 intern) |
| 11 | 3p ai-fan,hoarder | v3e | WON 36-35 | last after S1 and S2, came back |
| 12 | 4p hoarder,engine,greedy | v3e | WON 37 (30) | 4 teams → Series A +8 |
| 13 | 5p hoarder,engine,ai-fan,greedy | v3e | 2nd 29 (37) | hate-drafted Wycena from hoarder (13💰); contractor can't buy 🤖 |
| 14 | 3p engine,ai-fan | v3e | WON 33-32 | Tech Lead (2⭐) finally a sensible S3 pick |
| 15 | 4p engine,ai-fan,hoarder | base | 3rd 34 (39,39) | base S3 = autopilot, everything free; hoarder 24💰 = 8⭐ |
| 16 | 4p balanced,ai-fan,engine | v3e | WON 34 (32) | features-first: Pierwsi klienci +8, IPO 6; out of money on last pick |
| 17 | 5p balanced,ai-fan,engine,hoarder | v3e | WON 35-34 | Series A funded Scale+Keynote; bot got KUG +8 |
| 18 | 3p engine,hoarder | v3e | 3rd 31 (33,33) | library route; Wycena hate-draft only +2 for me |
| 19 | 4p engine,librarian,ai-fan | v3e | 3rd 29 (37) | took MCP over Series A → couldn't afford Featured/Keynote: wrong call punished |
| 20 | 5p engine,ai-fan,balanced,greedy | v3e | 3rd 30 (31,31) | Series A +8 spent to exactly 0💰 |
Record: 8 wins / 20; 3 losses by 1⭐.

## Simulations (2000 games/player count; 3p engine,ai-fan,hoarder; 4p +balanced; 5p +librarian)
| metric | base | final |
|---|---|---|
| bot win rate 3p (engine / ai-fan / hoarder) | .58 / .35 / .07 | .32 / .38 / .30 |
| bot win rate 4p (engine / ai-fan / hoarder / balanced) | .48 / .31 / .07 / .15 | .25 / .35 / .25 / .15 |
| bot win rate 5p (engine / ai-fan / balanced / hoarder / librarian) | .52 / .23 / .20 / .02 / .03 | .31 / .34 / .20 / .11 / .03 |
| 2p engine vs hoarder | .88 / .12 | .66 / .34 |
| close games (≤2⭐) 3p/4p/5p | 37/43/39% | 47/48/45% |
| leader after S2 wins 3p/4p/5p | 47/40/43% | 56/47/43% |
| last after S1 wins 3p/4p/5p | 59/48/51% | 37/32/36% |
| coins left at end | 5.1–5.8 | 3.6–3.8 |
| random bot win rate | 0% | 0% |

Card build/sold ratio and winLift (sum 3–5p), base → final:
Series A 0.23 (1.86) → 1.50 (1.56); Pierwsi klienci 0.22 → 16; KUG 0.97 (0.46) → 2.9 (0.82);
Wycena 2.65 (lift 0.03) → 29 (0.97); Seed 0.33 → 0.91 lift; Angel 0.30 → 0.82; Hackathon 0.37 → 0.96;
Tech Lead 0.02 → 1.19; Multi-agent Workflow 0.00 → 0.25 (lift 0.57, still weak); Acquihire 0.80 → 0.69 lift (always built).

## Findings
1. Base: selling = 3💰 = 1⭐ is a floor that makes most money cards equal to "sell any card" (Series A +3 with 3 teams, KUG +3, Pierwsi klienci +1–3).
2. Base: no coin sink in Sprint 3. Once production is flexible (🤖/intern), money only converts at 3:1 → hoarding is a losing line (hoarder 2–7%).
3. Adding coin costs to marketing/launch features (Featured, PH, Keynote, Scale) creates the sink; funding rounds now pay for launches, which is both realistic and creates late tension ("broke at the last pick").
4. Comeback: in base, "last after S1 wins" ~50% because the engine line is deliberately last; final ~35% (≈ fair share), leader-after-S2 wins 43–56%.

## Code changes
- `bots/Bots.kt`: CoinRate valuation used a hard-coded 2; now uses the card's `coinsPerPoint`.
- `sim/Simulator.kt`: new report fields `lastAfterS1WinPct`, `leaderAfterS2WinPct` (comeback metrics).
Tests pass. Helper scripts: `mk.py` (variant builder), `sim.py` (3/4/5p summary), `a.sh`/`v.sh` (play helpers). Per-game notes: `notes.txt`.
