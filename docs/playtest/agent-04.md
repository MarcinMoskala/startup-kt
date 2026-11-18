# Agent-04 report: 2-player duel

Focus: 2 players (two people at a conference table). 20 games played personally (17 on duel variants, 3 baseline),
about 130k bot games simulated.

## 1. Problems with the current rules at 2 players
- 2p uses the 3p deck but deals 2 hands of 5. You see hand A (5), B (4), A (3), B (2), so after pick 1 you know every card you
  will be offered. 5 of the 15 cards per sprint are never used. In baseline games g01, g02, g10 and g14 I built on every pick,
  and the hands always came back to me. The only real decision was "take the best card now or next time".
- There is almost no denial. The g14 baseline ended 35-18, with a broke bot that could not afford anything in my hands.
- At 2p fewer strategies are viable (baseline sims, 1000 games each): engine beats balanced 80%, librarian 92%, hoarder 88%.
  The leader after Sprint 2 wins 73% (engine mirror). Only 27% of games are close (within 2 points), against about 40% at 3-5p.
- NullSafe Bank (🤖 start) wins 62-63% at 2p.

## 2. Rule change (code): DUEL variant (2 players only)
Rule card text: **"2 players: use the 4+ cards. Deal 8 cards each. On your turn play one card (build or sell) AND
discard one other card face down, then pass the rest."** With 8 cards this is exactly 4 × (play 1 + discard 1).
The 4th "discard" is the leftover card, so the rule has no exceptions.
Implemented as `rules.duel = {handSize 8, picksPerSprint 4, deckPlayers 4, burn 1}`. The action is `build:x,burn:y`.

Variants compared (2p, 1000 games per matchup):

| ruleset | close games (engine mirror) | lead after S2 wins | engine vs balanced | engine vs ai-fan | greedy vs balanced | hoarder vs balanced |
|---|---|---|---|---|---|---|
| base (hand 5) | 27% | 73% | 80/20 | 65/35 | 38/62 | 39/61 |
| big9 (hand 9, no burn) | 33% | 85% | 94/6 | 87/14 | 14/86 | 32/68 |
| duel7 (3p deck, hand 7, 3 picks) | 39% | 67% | 77/23 | 65/35 | 44/56 | 63/37 |
| duel9 (hand 9 + burn) | 28% | 70% | 82/18 | 65/35 | 54/46 | 48/52 |
| **duel8 (hand 8 + burn)** | 32% | 75% | 74/26 | 54/46 | 56/44 | 42/58 |
| **final (duel8 + card tweaks)** | 34% | 74% | 75/25 | 57/43 | 64/36 | 44/56 |

- Bigger hands without a burn (big9) make the engine strategy dominant. The **burn** is what creates interaction.
- Skill matters: an engine bot that burns to deny the opponent beats the same bot that burns only cards it does not need, **73-27**.
  Against a random bot: balanced wins 100%.
- duel7 is the closest but feels short (only 3 builds per sprint, so engine cards barely pay off; g06).
- Comebacks: "last after Sprint 1 wins" is 45-55% at 2p, because a weak Sprint 1 score usually means you invested in production.
  "Leader after Sprint 2 wins" is about 66-75% (base 73%). In my own games I came back from 8-15 (g08, lost 30-32)
  and 5-9 (g17, won 28-25).
- Seat balance: 49/51.

## 3. Card/startup tweaks in final-def.json
- **Tech Lead: +2⭐** (still 2💰, produces 📱🖥🤖). Before the change it was built 4 times and sold 469 times (2p).
  After the change it was built 356 times and sold 196 times, and at 4p it was built 741 times and sold 304 times.
  A Sprint 3 team card had no use. With 2⭐, Tech Lead is now "a senior who also ships".
- **Multi-agent Workflow: 2💰, +2⭐** (was 3💰, 0⭐). Before the change it was built 0 times in any configuration.
- **NullSafe Bank starts with 1💰** (new optional `Startup.coins`). 2p win rate went from 62% to 54%,
  3p from about 40% to 37% (baseline 33%), and 4p to 30% (baseline 25%). With 0💰 it is too weak (47% at 2p, 25% at 3p).
  Flavour: compliance ate the budget, but it starts with an agent.
- The changes are neutral or slightly positive at 3-5p: close games 41/43/45% vs 40/42/42%.

## 4. Games played
| # | config | ruleset | result | note |
|---|---|---|---|---|
| 1 | vs engine | base | W 39-30 | Junie, Claude Code and MCP; from Sprint 2 every card was free; perfect info after pick 1 |
| 2 | vs ai-fan | base | W 42-27 | the same; one nice denial moment (Offline vs Scale), otherwise autopilot |
| 3 | vs engine | duel9 | W 32-29 | the burn felt meaningful; the bot burned my REST API and AI Assistant chain cards |
| 4 | vs balanced | duel8 | L 26-31 | the money strategy (Seed Round, Angel) was too passive; two Tech Leads were dead at the end |
| 5 | vs ai-fan | duel9 | L 32-34 | no-agent backend + B2B strategy; the bot burned my Payments chain; the opponent's IPO scored 7 |
| 6 | vs engine | duel7 | T 28-28 | 3 picks per sprint felt short |
| 7 | vs engine (seat 1) | duel8 | W 30-24 | I took one IPO and burned the other: a great duel moment |
| 8 | vs ai-fan | duel8 | L 30-32 | came back from 8 vs 15 after S2; the last pick was 2× Tech Lead (dead) |
| 9 | vs engine | v2 (duel8+TL/MAW) | W 28-27 | Multi-agent Workflow is now a real last pick; the bot burned my AI Assistant |
| 10 | vs balanced | base | W 36-29 | a broke opponent meant every hand came back intact |
| 11 | vs hoarder | v2 | W 28-23 | the hoarder buys features with freelancers (viable); Acquihire was worth 6 |
| 12 | vs engine | v3 | W 30-28 | took one 🤖 and burned the other 🤖 at pick 1 |
| 13 | vs greedy | v3 | W 30-28 | library strategy: 2 of 4 chains came through, 2 were burned |
| 14 | vs engine (seat 1) | base | W 35-18 | a blowout; base 2p has no tension |
| 15 | vs ai-fan | v3 | W 32-28 | the bot burned my Acquihire (team strategy); 9 production in S3 made everything free |
| 16 | vs engine (seat 1) | v3 | W 33-32 | opponent was NullSafe Bank with 1💰; burning Angel left it unable to afford agents |
| 17 | vs balanced | v3 | W 28-25 | the opponent collected 4 libraries; I denied the chains |
| 18 | vs engine (as NullSafe) | v3 | W 34-22 | 4×🤖 still made all of S3 free even with a 1💰 start |
| 19 | vs ai-fan | v3 | L 27-31 | no-🤖 strategy: 4 Sprint 3 features were impossible for me; the bot burned both App Stores |
| 20 | vs engine | v3 | W 32-30 | burned the IPO twice when the opponent had 5 features |

## 5. Not solved (cross-player-count issues)
- 🤖 is too strong: it stands in for anything and production is never used up. By Sprint 3, 4 or more units make every card free.
  Without 🤖 you are locked out of Keynote, AI Assistant, Accessibility and Product Hunt (g19).
- At 2p the bots still favour engine (75% vs balanced). The librarian bot is weak (10%) because chains get hate-burned,
  but by hand the library strategy worked (g13, g17).
- IPO is often worth 5-7 points for 0 cost. In the duel, burning it is the counterplay.
