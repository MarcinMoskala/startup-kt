# Agent-02 report: 4-player balance & fun

## Games played (personally)
| # | config | ruleset | my result | note |
|---|---|---|---|---|
| 1 | 4p seed101, me=seat0 suspend-fun-travel vs balanced/engine/ai-fan | v0 (default) | 3rd, 31 (win 38 NullSafe ai-fan) | free iOS via CMP, REST via Ktor; Tech Lead x2 + Valuation dead hand at S3P3; KUG Meetup == sell |
| 2 | 4p seed202, me=NullSafe Bank vs engine/ai-fan/balanced | v0 | 1st, 34 vs 32/29/26 | B2B + Seed Round; IPO = 6⭐; App Store Featured 8⭐ free with 📱📱📱+🤖 |
| 3 | 4p seed303, me=NullSafe Bank vs ai-fan/balanced/engine | v0 | 1st, 39 vs 32/28/21 | 2x🤖 + choice unit made Search/Payments/App Store/AI all free; S3P1 had 4 free features -> "just take the biggest number" |
| 4 | 4p seed404, me=suspend-fun-travel vs engine/engine/ai-fan | v0 | 2nd, 32 vs 37 | Seed Round + Ktor opening; bot sniped REST API (Ktor wasted); weak S1 hand (Hackathon/Splash/Angel) |
| 5 | 4p seed505, me=Sealed Deals vs engine/ai-fan/balanced(NullSafe 0💰) | v1 | 2nd, 36 vs 37/36/30 | very close finish; IPO on last pick swung engine from 29 to 37; ai-fan's KUG (2⭐/lib) = 6⭐ |
| 6 | 4p seed606, me=Sealed Deals vs balanced/engine/greedy | v1 | 4th, 30 vs 37/36/32 | library strategy: 5 libs but Payments, Scale-to-1M and Real-time Chat all sniped by engine bot; greedy won with First Customers(+2/feature)+IPO |
| 7 | 4p seed707, me=by lazy Studio vs ai-fan/engine/balanced | v2 | 1st, 39 vs 38/38/32 | Ktor(2⭐)->REST, Acquihire (2⭐/team)=6⭐, IPO 5⭐; very close; but Intern (📱/🖥, 1💰) now strictly beats Junior (📱, 1💰) |
| 8 | 4p seed808, me=Sealed Deals vs hoarder/librarian/ai-fan | v2 | 4th, 32 vs 39/37/34 | Valuation at 1⭐/💰 is broken: hoarder held 18-24💰, I had to hate-draft it (cost me ~5⭐); librarian won with 2⭐ libs |
| 9 | 4p seed909, me=by lazy Studio vs engine/hoarder/balanced | v3 | 2nd, 35 vs 36/34/33 | comeback: I was last after S2 (9 vs 19) and finished 1⭐ behind; hoarder's Valuation spiked to 31⭐ at S3P2 (19💰) - exciting but swingy |
| 10 | 4p seed1010, me=Companion vs ai-fan/ai-fan/engine | v3 | 2nd, 34 vs 37/32/31 | no-agent frontend build viable; both my chains (Offline, Real-time Chat) sniped by ai-fan; last hand = two 2💰 teams I couldn't afford -> forced sell |
| 11 | 4p seed1111, me=suspend fun Travel vs balanced/librarian/engine | v3 | 1st, 38 vs 30/28/27 | money opening (Angel+Seed+Hackathon=15💰 after S1) then bought Claude Code + MCP: 3x🤖 made all of S3 free -> money->agents is a strong line |
| 12 | 4p seed1212, me=by lazy Studio vs engine/balanced/ai-fan | v3 | 2nd, 34 vs 38/29/27 | feature-rush (4 S1 features, led 9⭐ after S1) + First Customers (+6💰); engine overtook in S3; Valuation as "3💰->6⭐" endgame consolation |
| 13 | 4p seed1313, me=Companion vs greedy/engine/ai-fan | v3 | 1st, 38 vs 37/33/26 | balanced engine (7 units incl. 1🤖) -> Scale+App Store free in S3; CMP chain sniped by engine (iOS) |
| 14 | 4p seed1414, me=Sealed Deals vs 3x engine | v3 | 1st, 37 vs 33/33/31 | hate-drafted Payments away from serialization owner; Acquihire 6⭐; last pick = 2x IPO (nobody else wanted IPO) |
| 15 | 4p seed1515, me=Companion vs ai-fan/librarian/hoarder | v3 | 1st, 36 vs 34/33/33 | B2B + First Customers + MCP: cheap freelancers + 🤖🤖 made S3 easy; hoarder again landed Valuation (17💰) but ended 33 - strong but beatable |
| 16 | 4p seed1616, me=NullSafe Bank (0💰) vs balanced/ai-fan/engine | v3 | 2nd, 35 vs 43/33/33 | 0💰 start felt tight but fine (Ktor/Seed/Angel); 7⭐ after S2 (3rd) -> 28⭐ in S3 with 8 units; S3 is where games are decided |
| 17 | 4p seed1717, me=by lazy Studio vs librarian/balanced/ai-fan | v3 | 1st, 39 vs 38/35/26 | hate-drafted Payments from serialization owner, Scale from Exposed owner; my CMP chain sniped (iOS); IPO came as the last card again |
| 18 | 4p seed1818, me=NullSafe Bank (0💰) vs engine/ai-fan/balanced | v3 | 2nd, 36 vs 38/35/30 | team strategy: 5 teams -> Acquihire 8⭐ + Tech Lead (3⭐+2) used dead coins; S3 Tech Lead now a real choice |
| 19 | 4p seed1919, me=suspend fun Travel vs greedy/hoarder/librarian | v3 | 2nd, 34 vs 35 (hoarder) | hoarder landed Valuation with 22💰 and won by 1; 3rd game where Valuation 1⭐/💰 produced a 15-20⭐ swing -> needs a cap |
| 20 | 4p seed2020, me=Companion vs hoarder/ai-fan/engine | v4 | 1st, 37 vs 36/33/28 | Valuation now capped: hoarder had 17-20💰 but got 10⭐ max -> finished 4th instead of a 20⭐ swing; my Coroutines chain sniped again |

Summary of my 20 games: 9 wins, 9 seconds, 1 third, 1 fourth (I am clearly stronger than the bots, so my win rate says little about balance; the notes do).

## Simulations (4 players, 2000-3000 games each; ~60k bot games total incl. variants)
| metric | v0 (default) | v4 (final) |
|---|---|---|
| startup win rate, mixed bots (baseline 25%) | NullSafe 38%, others 21-22% | 21-28% (NullSafe 26%) |
| startup win rate, 4x balanced | NullSafe 49%, others 18-21% | NullSafe 30%, others 22-25% |
| bot win rates (balanced/engine/greedy/ai-fan) | engine 43 / ai-fan 31 / balanced 21 / greedy 5 | ai-fan 38 / engine 24 / balanced 24 / greedy 13 |
| bot win rates (engine/ai-fan/balanced/librarian) | - | ai-fan 35 / engine 26 / balanced 24 / librarian 15 |
| hoarder (with balanced/engine/ai-fan) | ~7% | 14% |
| random bot win rate | 0.2% | 0.0-0.3% (skill matters) |
| close games (margin <=2) | 43% | 53% |
| margin 1st-2nd / spread 1st-last | 3.74 / 9.4 | 2.86 / 8.3 |
| leader after S1 wins (mixed / mirror) | 5% / 23% | 17% / 25% |
| last after S1 wins (mixed / mirror) | 39% / 28% | 24% / 24% |
| leader after S2 wins (mixed / mirror) | 20% / 44% | 39% / 45% |
| last after S2 wins (mixed / mirror) | 17% / 10% | 14% / 11% |
| dead cards (built ~never) | Tech Lead (36/2000 games), Multi-agent Workflow (0), Valuation (lift 0.08), KUG Meetup = sell | none; all card winLifts within ~0.6-1.6 |
| points: features / libraries / business / bonuses | 24.6 / 1.6 / 0.6 / 2.6 | 23.4 / 3.5 / 1.6 / 4.3 |

Other counts with v4 (not my focus): 2p startups 47-54%, engine 62% vs balanced (v0: 81%); 3p startups 29-38% (backend startups 38%, frontend 30-32%: worth a look); 5p startups 18-21% (v0 NullSafe 34%).

## Changes (v0 -> v4), with reasons
1. **Startup coins** (code: `Startup.coins`): everyone starts with 4💰, NullSafe Bank (🤖) starts with 0💰. 🤖 start won 38-49%; agents are wildcards AND gate 6 cards. 0💰 brings it to 26-30%.
2. **Team price ladder**: Junior devs 1💰 (were free), Full-stack Intern 2💰 (was 1), Junie/Claude Code 3💰 (were 2), MCP Server 4💰 (was 3), Full-stack Senior 1💰 (was 2). Clean ladder "1 fixed unit 1💰 / choice 2💰 / 🤖 3💰". Free production made engine-building a no-brainer (engine bot 43%); with v2 juniors=1 and intern=1 the intern strictly dominated the juniors (seen in game 7).
3. **S3 team cards give 3⭐** (Tech Lead, Multi-agent Workflow; MAW now 2💰). They were never built (3 picks left can't repay production). Now a real option, esp. with Acquihire (game 18).
4. **Acquihire 2⭐ per 👥** (was 1): lift 0.45 -> 0.9; enables a "team" strategy.
5. **Libraries 2⭐** (were 1). Chains get sniped constantly at 4p (games 6, 10, 13, 17, 20: the free-with target is built by whoever has the resources), so library strategy was dead (librarian bot 8%). Now 15-22%.
6. **KUG Meetup: end 2⭐ per your 📚** (was +3💰 = exactly a sell). Gives libraries a payoff card; community flavour.
7. **First Customers +2💰 per ⭐ feature** (was +1): lift 0.47 -> ~1.2; supports the feature-rush plan (games 6, 12).
8. **Search 4⭐** (was 5): it had the same cost as Push Notifications (4⭐) and REST API without needing a library.
9. **Valuation: +3💰 now, end: 1⭐ per 1💰 (max 10⭐)** (code: `CoinRate.maxPoints`). The old 1⭐/2💰 was dead (lift 0.08). Uncapped 1:1 caused 15-20⭐ swings (games 8, 9, 15, 19: hoarder at 17-24💰 jumped to 29-31⭐; I had to hate-draft it). The cap keeps money viable (hoarder 7% -> 14%) without one card deciding the game.

## Not changed / open
- Splash Screen is an exact clone of Login Screen (📱 -> 2⭐); harmless but adds nothing.
- Hand passing is always one direction; chain targets are single copies, so chains are mostly hate-draft fodder at 4p. That is OK as drafting tension, but players should be told that a library is "2⭐ now, maybe a free feature later".
- ai-fan bot is the strongest now (35-38%): 🤖 cards still a bit strong; MCP Server still has the highest lift.

## Bot heuristics: what is strong or weak
- engine (high production weight): best in v0 (43%) because free juniors and 1💰 seniors are underpriced; drops to ~25% in v4.
- ai-fan (balanced + 🤖 bonus): best in v4 (35-38%). 🤖 is worth more than its price suggests.
- greedy (immediate points only): weak (5% -> 13%). It never builds production, so it is a floor, not a real "feature rush" player.
- librarian: weak (8% -> 15%). It overvalues libraries whose chain targets get sniped.
- hoarder: about 7% without Valuation; only wins by landing uncapped Valuation.
- No bot hate-drafts. Humans do (I won several games by denying chain targets or Valuation), so real games will have more interaction than the sims show.

## Code changes (agent-02 copy only)
- engine/Model.kt: `Startup.coins: Int? = null` (per-startup starting coins); `Special.CoinRate.maxPoints: Int? = null`.
- engine/Engine.kt: uses startup coins; `moneyPoints()` applies the capped CoinRate.
- cli/Main.kt: shows "(max N⭐)" on capped Valuation.
- sim/Simulator.kt: comeback stats (leader or last after S1/S2 -> final win %).
- helper scripts: play.sh, newg.sh, sim.py, mkdef.py.
