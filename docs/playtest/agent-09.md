# Agent-09 report: fun, tension and player interaction

Focus: is the draft interesting, is there tension/comeback, and do 1–2 small interaction mechanics earn their rules text?

## Tooling added (code, my copy only)
- `engine/Model.kt` `Rules`: optional variants, all OFF by default
  - `passAlternate` (hands pass the other way in Sprint II)
  - `demoDayPoints`, `demoDayLoss`, `demoDaySprintOnly` ("Demo Day": compare Features with each neighbour at sprint end)
  - `raceFeatures` (target count), `racePoints` (prizes in claim order), `raceType` (card type counted) = public milestone race
  - `PlayerState.eventPoints/milestone`, `GameState.raceAwards`, `Score.events` (included in total)
- `engine/Engine.kt`: `passDirection`, `milestoneRace` (checked after every pick, simultaneous claimers share the prize), `demoDay` (end of sprint), view fields.
- `bots/Bots.kt`: bots value Demo Day / race points (`eventValue`, `raceValue`), so the sims reflect the variants.
- `sim/Simulator.kt` + CLI: new tension metrics: leader after S1/S2 wins %, **last after S1 wins %**, last-after-S2 finishes top-2 %, % "obvious picks" (best option ≥2⭐ better than the next, per balanced evaluator), viable options/pick, event ⭐/player.
- Tests: `libraryRaceAwardsFirstPlayerOnce`, `alternatingPassReversesInSprintTwo` (all tests pass).
- `final-def.json` = default content + `raceFeatures=3, racePoints=[3], raceType=LIBRARY`. NOTE: the stock engine ignores these unknown keys (ignoreUnknownKeys), so it only has an effect with this copy's code.

## Games I played (20)
| # | config | ruleset | result | note |
|---|---|---|---|---|
| 1 | 3p seed101 me vs balanced,engine | base | 1st 36-33-31 | S2 gamble (Senior Backend over Payments) lost Payments; S3 = take biggest ⭐ each pick; hate-drafted Web Version from neighbour w/ Wasm |
| 2 | 4p seed202 me vs balanced,engine,ai-fan | base | 1st 40-33-31-27 | took production early (free Juniors), then every S3 pick = biggest free ⭐; hate-drafted Scale-to-1M from Exposed owner |
| 3 | 2p seed303 me vs engine | base | 2nd 31-37 | 2p hands return: real tactics (denied AI Assistant to Koog owner), but opp got REST API+iOS chains free; I misjudged last S3 picks |
| 4 | 5p seed404 me vs bal,eng,ai,lib | alt+lib3 | 3rd 34 (eng 43) | Library race created a real S2 dilemma (iOS 5⭐ vs Exposed for race+chain); won race +3. Lost to engine's IPO=10⭐ (10 features). Cash-starved all game |
| 5 | 4p seed505 me vs eng,ai,bal | race3x (features 3: 3/2/1) | 3rd 32 (ai 40) | Feature race [3,2,1]: 3 of 4 players scored a prize — no tension, just +⭐ for what you do anyway. Without any 🤖 I could build only 1 of 5 S3 cards in a hand (🤖 not buyable) = feel-bad lockout |
| 6 | 3p seed606 me vs eng,bal | demoS (sprint-only Demo Day 1/2/3) | 1st 49-48-27 | Exciting knife-edge between top two (counted neighbours' features every pick), but 3rd player got 0 event ⭐ — Demo Day widens the gap to the weak player |
| 7 | 2p seed707 me vs ai-fan | lib3 | 2nd 40-44 | Won library race (+3) via Koog; 2p tactical gambles on what returns; lost to opponent's IPO (+8). IPO feels swingy/dominant |
| 8 | 5p seed808 me vs eng,ai,bal,eng | base | 1st 40-36-30-26-22 | Bought 🤖 early, then S2 & S3 all 8 picks were 'biggest free ⭐' — S3 on autopilot once engine is done |
| 9 | 4p seed909 me vs eng,lib,ai | alt+lib3 | 3rd 33 (39-39 tie on coins) | Passing Wasm to ai-fan handed them the race (+3) which created the 39-39 tie: race added a 'don't feed the neighbour' consideration. Alternating pass noticeable: S2 I fed a different neighbour |
| 10 | 3p seed1010 me vs ai,eng | alt+lib3 | 2nd (3-way tie 31-31-31, lost on coins) | Library race +3 decided a three-way tie for ai-fan — dramatic finish; I skipped Koog for iOS and the race went elsewhere |
| 11 | 4p seed1111 me vs eng,bal,eng | lib3only (first to 3📚 +3⭐) | 1st 33-32-31-27 | Best dilemma of the session: REST API (free) vs Payments (free) vs Exposed (3rd 📚 = race). Took Exposed; tied race with balanced (both +3). +3 was the winning margin |
| 12 | 3p seed1212 me vs eng,eng | lib3only | 1st 39-35-31 | Library/chain strategy (Ktor, CMP, Koog → REST, AI Assistant free) with only 3 production units won; race grabbed at S2P1. Library strategy viable for a human |
| 13 | 4p seed1313 me vs eng,ai,bal | demoFinal (S3 features vs neighbours, +2 each) | 1st 40-34-34-30 | Final Demo Day made S3 less autopilot (Admin Panel for demo count vs IPO), but I was already leading and +4 widened it. S2 demo row with 0⭐ is log noise |
| 14 | 2p seed1414 me vs balanced | base | 1st 27-20 | B2B (freelancers 1💰) money strategy works OK; 2p low scores, hate-draft (Offline Mode from SQLDelight owner) is the main interaction; no 🤖 until Tech Lead locked 2 of 5 S3 cards |
| 15 | 5p seed1515 me vs eng,ai,lib,bal | lib3only | 3rd 32 (33-33-32-30-23) | Race was claimed already in Sprint I at 5p (5 S1 libraries in deck) — less interesting at 5p; very close finish; Series A/First Customers were my money fix |
| 16 | 2p seed1616 me vs engine | lib3only | 1st 35-34 | Nobody reached 3📚 in 2p (race silent, harmless). Knife-edge finish decided by reading what opponent can't afford (AI Assistant came back) |
| 17 | 3p seed1717 me vs bal,eng | base | 3rd 28 (35-28-28) | Deliberate points-first opening: led S1 8⭐ vs 1⭐, finished last. No 🤖 → last 2 S3 picks were forced sells. Early points are a newbie trap |
| 18 | 4p seed1818 me vs ai,eng,lib | lib3only | 3rd 30 (ai 41) | Passed Exposed (took Payments) → neighbour completed 3📚 race. S3 Team cards (Tech Lead, Multi-agent Workflow) were dead last picks |
| 19 | 4p seed1919 me vs bal,eng,ai | alt (pass direction flips in S2) | 2nd 35 (36) | Alternating pass barely changed any of my decisions; bots ignore neighbours anyway. Close finish |
| 20 | 3p seed2020 me vs ai,bal | lib3only | 3rd 30 (38-35-30) | B2B+libraries plan failed (hand had no libs); balanced won race at S2P1 via passed CMP/Ktor/SQLDelight; hate-drafted Offline Mode |

Result summary: 9 wins, 4 seconds, 7 thirds-or-worse; 9 of 20 games were decided by ≤3⭐ between 1st and 2nd (incl. a 3-way tie and two 2-way ties broken on coins).

## Simulations (≈150k games total)
Bot mixes: 2p balanced,engine; 3p +ai-fan; 4p +librarian; 5p +greedy. 4000 games each, seed 999.

| ruleset | p | close ≤2⭐ | spread | last after S1 wins | leader after S2 wins | last after S2 → top2 | obvious picks | event ⭐/pl |
|---|---|---|---|---|---|---|---|---|
| base | 2 | 18.55% | 7.45 | 70.78% | 64.70% | 91.05% | 28.56% | 0.00 |
| base | 3 | 37.75% | 8.40 | 55.25% | 49.63% | 60.53% | 27.98% | 0.00 |
| base | 4 | 42.10% | 11.40 | 45.08% | 48.05% | 33.48% | 29.80% | 0.00 |
| base | 5 | 45.38% | 12.04 | 47.30% | 21.85% | 33.40% | 27.27% | 0.00 |
| lib3only | 2 | 21.10% | 6.99 | 69.73% | 61.60% | 91.33% | 30.00% | 0.95 |
| lib3only | 3 | 38.33% | 8.25 | 54.43% | 48.15% | 63.93% | 29.36% | 0.96 |
| lib3only | 4 | 43.25% | 10.59 | 44.30% | 45.70% | 38.58% | 30.91% | 0.80 |
| lib3only | 5 | 46.05% | 11.65 | 44.18% | 23.13% | 39.35% | 28.64% | 0.71 |
| alt | 2 | 18.55% | 7.45 | 70.78% | 64.70% | 91.05% | 28.56% | 0.00 |
| alt | 3 | 36.90% | 8.76 | 57.65% | 52.75% | 57.03% | 27.88% | 0.00 |
| alt | 4 | 40.10% | 11.76 | 46.18% | 51.70% | 31.70% | 29.62% | 0.00 |
| alt | 5 | 39.30% | 12.97 | 49.33% | 31.90% | 28.58% | 27.22% | 0.00 |
| demoFinal | 2 | 15.05% | 8.64 | 73.03% | 60.83% | 91.05% | 29.86% | 0.80 |
| demoFinal | 3 | 28.70% | 10.54 | 57.85% | 40.80% | 68.25% | 30.10% | 1.50 |
| demoFinal | 4 | 34.85% | 13.55 | 49.70% | 37.88% | 41.05% | 32.27% | 1.44 |
| demoFinal | 5 | 36.25% | 14.45 | 51.40% | 16.20% | 40.70% | 29.23% | 1.49 |

Earlier variants (2000/1500 games, same mixes, see `sims/`):
- Demo Day on cumulative Features 1/2/3⭐ per neighbour (`demo123`): close games 38→18% (3p), 42→24% (4p); spread +6⭐; obvious picks 28→40%. Runaway. Rejected.
- Demo Day on Features built *this sprint* (`demoS`): close games 38→23% (3p), 42→27% (4p). Rejected. With −1 loss (`demoS_L`) same.
- Feature race "first to 3 Features" [3] / [3,2,1] / "5 features" [4,2]: neutral to slightly worse closeness; in my game 3 of 4 players got a prize = no tension. Rejected (it also rewards the type that already makes ~80% of all points).
- Team race (first to 4 👥): neutral. Library race targets 2/3/4 and prizes [3],[3,1],[2,1],[4,2]: all similar; [3] at 3 libraries is the simplest with the full effect.

Skill vs luck (4p engine,greedy,balanced,random, 3000 games): base engine 80%/balanced 15%/greedy 5%/random 0%; with library race engine 74%/balanced 23%/greedy 3%/random 0%. Skill clearly matters; the race slightly lowers the dominance of the single best strategy.

## Findings
1. **No runaway leader — the opposite: early points are a trap.** The player *last* after Sprint I wins 44–56% of 3–5p games (70% in 2p); the S1 leader wins only 7–28%. The leader after Sprint II wins ~48% (3–4p), 22% (5p). In game 17 I deliberately led S1 8⭐ vs 1⭐ with cheap features and finished last. Comebacks exist, but the running score misleads new players (bad for a KotlinConf handout). Suggest a rules-card tip: "Sprint I: build your team, points come later".
2. **Sprint III is autopilot once your engine is built.** Resources are not consumed, so with 5–6 units incl. 🤖 every S3 pick is "take the biggest free ⭐" (games 1, 2, 8). The only remaining decision is hate-drafting a neighbour's free chain card (Web Version from the Wasm owner, Offline Mode from the SQLDelight owner, AI Assistant from the Koog owner) — which is the best interaction the game currently has, and works great in 2p.
3. **🤖 lockout feels bad.** Without any 🤖 (it can't be hired), 5 of ~11 S3 Features are unbuildable; in games 5, 14, 17 I sold 1–2 of my last picks.
4. **Dead late cards**: Tech Lead and Multi-agent Workflow (S3 Teams) are almost always sold (4p: 56 built vs 2542 sold; 3 vs 1275) — production in the final sprint has no time to pay off. Valuation also (winLift 0.13, sold 3:1). IPO is built in almost every game (neutral winLift ~1.0, but often 8–10⭐: games 4, 7).
5. **The library race is the one mechanic that earned its rules.** One sentence ("The first player to have 3 📚 Libraries gets +3⭐; ties share it"). It created the best moments in my games: G11 (REST API vs Payments vs Exposed for the race — Exposed won me the game by 1⭐), G4/G7/G12 (Koog as the 3rd library), G9/G10/G18 (passing a library handed a neighbour the race → tie/3-way tie). Sims: closeness +0.5–2.5pp at 2–5p, spread −0.4 to −0.8, "last after S2 finishes top-2" 60→64% (3p), 33→39% (4p), 33→39% (5p), leader-after-S2 wins 48→46% (4p); librarian bot avg score 27.1→29.0 (more viable strategies). At 2p usually nobody claims it (harmless); at 5p it is often claimed already in S1 (5 S1 libraries in the deck).
6. **Demo Day (neighbour comparison) is dramatic but anti-catch-up.** In G6 it made a 49–48 knife-edge between the top two, but the weak player got 0 event ⭐; in sims it always widens spread and cuts close games by 8–20pp because it rewards the dominant axis (Features). A final-sprint-only version (`demoFinal`, +2⭐ per neighbour beaten in S3 features) is the best comeback tool measured (leader after S2 wins 50→41% 3p, 48→38% 4p; last-after-S2 top-2 60→68% / 33→41%) and makes S3 less automatic (G13: Admin Panel vs IPO for the count), but costs closeness (38→29%, 42→35%). Not recommended for the base game; possible "advanced/party" variant.
7. **Alternating pass direction**: zero effect on any metric (identical in 2p by definition, ±1–3pp noise elsewhere, at 5p leader-after-S2 wins rose 22→32%). In my G19 it changed none of my picks. Not worth even one line.

## Recommendations
- ADOPT: Library race `first to 3📚 → +3⭐` (simultaneous claimers both score). Printable as a public "Open Source Contributor" milestone card in the middle of the table.
- REJECT: Demo Day (all forms) for the base game; optional variant "Final Demo Day" only if a swingier finish is wanted.
- REJECT: alternating pass; REJECT: feature race.
- For other agents/balance (observed, not changed by me): make S3 Teams useful (e.g. Tech Lead: produce + 2⭐, or move to S2), give Valuation a reason (e.g. 1⭐/2💰 *and* +3💰), cap IPO (e.g. 1⭐ per S2/S3 Feature), soften 🤖 lockout (allow hiring 🤖 for 3💰, or fewer 🤖-required S3 cards). The "Sprint I = team" tip on the rules card.

## Flavour notes
- Library race card name: "Open Source Contributor" or "Maintainer of the Year" (+3⭐ to the first with 3 libraries) — fits KotlinConf.
- Final Demo Day (if used): "KotlinConf Demo Day / Keynote slot".
- Card names mix Polish and English (Stażysta Full-stack, Ekran profilu, Płatności, Wycena…) — for KotlinConf use English everywhere.
- Multi-agent Workflow / Tech Lead in S3: thematically "hiring at release" is late; consider "Release Manager" giving points instead.

## Bots
Strong: `engine` (production first) — wins 42–82% in mixes; `ai-fan` second. Weak: `greedy` (points now), `librarian` (it even skipped its 3rd library for a Meetup in G9), `random` never wins. Bots never hate-draft and don't watch neighbours, which is the main human skill in this game (hate-draft chains, deny the race). All bots understand my variants via `eventValue`/`raceValue`.

## Could not verify
- Human perception of the race on a printed card (does "3 📚" read clearly?). Effects are small in absolute terms (1–3pp) — the main value is the decisions it creates, which I saw in most of my 10 games with it.
- How the race interacts with other agents' balance changes (e.g. library costs/copies).
