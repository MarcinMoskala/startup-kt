# REPORT agent-10: startups (starting cards) and first-game experience

Rulesets: **base** = shipped default. **v5** = startup abilities, first version. **v7c** = final (`final-def.json`): v5 retuned plus 4 dead-card fixes.
Win rates below are **normalized**: startup win rate x players, so 1.00 is fair.
Bot mix: balanced, engine, greedy, ai-fan, librarian (first N used, rotated). 2000-3000 games per cell.

## Games I played (20)
Seat 0 was me; all other seats were bots. Columns: config, my result, note.

| # | config (players, ruleset, my startup vs bots) | result | note |
|---|---|---|---|
| 1 | 3p base, suspend fun (🖥) vs balanced,engine | WIN 39-33-29 | 4x🤖 rush; AI Assistant came back unclaimed at pick 4 - 🤖 wildcard makes everything free |
| 2 | 2p base, NullSafe Bank (🤖) vs balanced | WIN 36-28 | 🤖 start + Claude Code + Junie = all S2 features free; bot sold AI Assistant to deny me |
| 3 | 4p v5, Bank (🖥, 1⭐/2💰, 5💰) vs bal,engine,ai-fan | WIN 37-35-33-30 | money gave 6⭐ instead of 4; Valuation is a dead card for Bank |
| 4 | 5p v5, Bank vs bal,eng,ai-fan,greedy | WIN 36-34-30-29-27 | last pick = two Tech Leads, dead (S3 team cards useless on last picks) |
| 5 | 2p v5, Companion vs engine | WIN 39-30 | free Junie + free Full-stack Senior felt great; 2p hate-drafting very strong (hand returns) |
| 6 | 3p v5, Sealed Deals vs engine,ai-fan | LOSS 31 (3rd) vs 40 | sold only 2 cards; ability rarely triggers; lost AI Assistant though I had Koog |
| 7 | 3p v5, by lazy (libs +2💰) vs balanced,engine | LOSS 35-36 | 5 libraries = 6⭐+10💰; 2 of my chains (REST API, Real-time Chat) sniped by bots - tense, close |
| 8 | 4p v5, suspend fun vs bal,engine,ai-fan | LOSS 35 (3rd; 36-36 top) | led 17-11 after S2, lost to IPO/Acquihire bonuses; leftover +1💰 is forgettable; 2x Tech Lead dead at last pick again |
| 9 | 5p v5, Sealed Deals vs bal,engine,ai-fan,bal | WIN 34-34-34 (tiebreak on 💰) | comeback from 13 vs 20 after S2; sold Series A + KUG Meetup for 4 each - KUG Meetup (+3💰) is a dead card (= selling) |
| 10 | 2p v5, by lazy vs ai-fan | WIN 35-35 (tiebreak) | played as naive newbie (points first): no 🤖 meant Keynote/Product Hunt unbuildable - newbie confusion 'why no AI freelancer?'; still tied |
| 11 | 3p v5, Companion vs engine,balanced | WIN 37-37 (tiebreak) | comeback from 9 vs 16 after S2: 7 production units with free teams -> 4 big S3 features; Companion felt good (MCP for 1💰, Full-stack Senior free) |
| 12 | 4p v5, by lazy + B2B Contract vs ai-fan,bal,engine | WIN 36-36 (tiebreak) | B2B (freelancers 1💰) + 🤖 made Search/Push nearly free; all 4 within 2⭐ after S2 - great tension |
| 13 | 5p v5, Companion vs bal,engine,ai-fan,librarian | WIN 36-35 | 13 vs 16 after S2, won via App Store + Acquihire; a S3 hand with 2x Accessibility + Tech Lead + Valuation felt flat |
| 14 | 3p v7c, suspend fun vs balanced,engine | WIN 39-33-32 | 4x🤖 (Claude Code, Junie, MCP) = every S3 feature free; 🤖 still the strongest engine; Multi-agent/Tech Lead now worth considering (2⭐) |
| 15 | 2p v7c, Sealed Deals vs engine | WIN 38-36 | sold Junie pick 1 (deny) and Series A; 13 vs 17 after S2 -> won in S3; Valuation (+3💰 now) was a real option |
| 16 | 4p v7c, NullSafe Bank vs bal,engine,ai-fan | WIN 40-33-33-26 | money track (Seed, Hackathon, Talk) then MCP + Senior Backend -> 3 big S3 features + IPO; Bank's 1⭐/2💰 made every coin decision interesting |
| 17 | 5p v7c, by lazy vs bal,engine,greedy,librarian | LOSS 37 (2nd) vs 43 | engine bot (Junie+Senior Compose) ran away with 42 feature pts; librarian bot last (23) - pure library strategy weak; by lazy ability only gave +4💰 |
| 18 | 2p v7c, Companion vs engine | LOSS 30-36 | slow start (2 libraries + Seed Round), 8 vs 19 after S2; S3 comeback (Web, AI Assistant) not enough. 2p swingy: opponent got both my S2 hands' best cards |
| 19 | 3p v7c, NullSafe Bank (money-first) vs ai-fan,engine | LOSS 35-38 | no 🤖 at all: 3 S3 cards (Product Hunt, Accessibility, AI Assistant) unbuildable; for Bank, selling (3💰=1.5⭐) beats building a 1⭐ library |
| 20 | 4p v7c, Sealed Deals + B2B Contract vs bal,engine,ai-fan | WIN 41-31-30-24 | feature rush (5 features by S2) + IPO for 8⭐; Angel Investor (+4💰) is pointless for Sealed (= selling) |

Record: 14 wins and 6 losses. I usually beat the bots, so I judged balance from simulations and fun from my own games.

## Problem 1: NullSafe Bank (🤖 start) was strictly the best startup
- Base, normalized startup win rate: Bank **1.24 / 1.41 / 1.52 / 1.81** at 2/3/4/5 players. The other four were 0.76 to 1.01.
- Why: 🤖 can stand in for 📱 or 🖥, and it is the only resource you cannot hire. A 🤖 start is therefore a strictly better resource. It also opens the 🤖 features (In-app AI Assistant, KotlinConf Keynote Demo, Product Hunt Launch). In g01/g02, a 🤖 start plus Junie and Claude Code made every Sprint 2 feature free.

## Change: each startup gets 1 resource, its start 💰, and one tiny pun ability
No startup produces 🤖 any more. Code fields in `Startup`: `ability`, `startCoins`, `sellValue`, `teamDiscount`, `leftoverCoins`, `libraryCoins`, `coinsPerPoint`.

| Startup | Res | Start | Ability (card text) |
|---|---|---|---|
| Companion (dating app) | 📱 | 5💰 | companion object: your Team 👥 cards cost 1💰 less (it matches you with hires) |
| suspend fun Travel (booking) | 🖥 | 4💰 | suspend fun: at the end of each Sprint, +1💰 for your leftover card (the trip is resumed, not cancelled) |
| Sealed Deals (e-commerce) | 🖥 | 6💰 | sealed deals: selling a card gives you 4💰 (not 3) |
| by lazy Studio (games) | 📱 | 3💰 | by lazy: +2💰 whenever you build a Library 📚 (lazy devs reuse libraries) |
| NullSafe Bank (fintech) | 🖥 | 6💰 | null-safe savings: at the end, 1⭐ per 2💰 (not 3) |

### Normalized startup win rate, base vs final

| players | base: lazy / comp / bank / sealed / suspend (max dev) | final v7c (max dev) |
|---|---|---|
| 2 | 0.99 / 0.87 / **1.24** / 0.97 / 0.93 (0.24) | 0.93 / 0.93 / 1.04 / 1.07 / 1.04 (0.07) |
| 3 | 0.82 / 0.82 / **1.41** / 0.94 / 1.01 (0.41) | 1.06 / 0.77 / 0.99 / 1.07 / 1.11 (0.23) |
| 4 | 0.89 / 0.83 / **1.52** / 0.86 / 0.89 (0.52) | 1.02 / 1.02 / 0.90 / 1.04 / 1.03 (0.10) |
| 5 | 0.76 / 0.82 / **1.81** / 0.80 / 0.81 (0.81) | 0.94 / 1.03 / 1.04 / 1.03 / 0.95 (0.06) |

The one remaining outlier is Companion at 3 players (0.77).

### Iterations, all simulated
| version | change | result |
|---|---|---|
| v1 | leftover 3💰, sell 4, team -1, by lazy = 📱/🖥 choice, Bank 🖥 + 6💰 | suspend fun 1.42 to 2.02. Leftover 3💰 per Sprint is far too strong |
| v2 | leftover 1, sell 5, team -2 | Sealed 1.43 at 3 players |
| v3a/b | leftover 2; by lazy library +2💰 | suspend 1.24 to 1.46 |
| v4a | Bank 🖥 + 7💰, others tuned | max dev 0.04 to 0.18, but Bank had only coins and no ability |
| v5 | Bank: 1⭐ per 2💰 (thematic) | max dev 0.11 to 0.22. Played g03 to g13 on it |
| v6 | dead-card fixes (below) | Companion 1.23 to 1.29, because Team cards became worth ⭐ |
| v7c | Companion -1💰 on Teams with 5💰 start; Bank 6💰; Sealed 6💰 | final |
| v8 | everyone starts with the same 💰 | max dev 0.31 to 0.75. Per-startup start 💰 is the tuning knob, printed on the card |

## Dead cards found while playing (fixed in final)
Base data: 4 players, 3000 games.
- **Multi-agent Workflow**: built 1 time, sold 1277 times. **Tech Lead**: built 152, sold 2325. Two Tech Leads were my dead last pick in g04 and g08. Production in Sprint III comes too late to use. Fix: Tech Lead 2⭐; Multi-agent Workflow 2⭐ and 2💰. After: built 2436 and 1004 times.
- **KUG Meetup (+3💰)**: identical to selling the card. Fix: +4💰. After: built 1819 vs sold 158 (was 478 vs 709).
- **Valuation**: built 463, sold 1039. Fix: also +3💰 immediately. After: built 1751 vs sold 129. In g15 and g18 it was a real choice.

## The coordinator's criteria (mirror matches: all seats balanced, 1500 games)
Values are P(win) divided by the fair rate 1/players.

| | lastS1 | leadS1 | lastS2 | leadS2 | close (≤2⭐) | balanced beats random | engine bot vs 3-4 greedy |
|---|---|---|---|---|---|---|---|
| base 4 players | 1.13 | 0.92 | 0.38 | 1.74 | 43% | 0.96 | **0.52** |
| final 4 players | 1.02 | 0.98 | 0.36 | 1.87 | 52% | 0.97 | 0.25 |
| final 5 players | 1.14 | 0.98 | 0.31 | 2.10 | 55% | 0.95 | 0.20 |

- **Comebacks.** Being last after Sprint I costs nothing. I won 6 games from behind after Sprint II: g09 (13 vs 20), g11 (9 vs 16), g13, g15 and others. Being last after Sprint II still wins about 1/3 of the fair rate.
- **Skill vs luck.** Skill matters: the balanced bot beats random bots about 95% of the time. Luck still matters: 5-10% of games end in an exact tie at the top, decided on 💰.
- **Several viable strategies.** In base the engine bot dominated: 46-59% wins at 5 players against a 20% baseline. In final, engine and greedy are about even. Strategies that won my games: 🤖 rush, library chains (lost 35-36), money/Bank, B2B Contract + feature rush + IPO (41), team-heavy Companion.
- **Strong bots in final:** ai-fan (39-41% at 5 players) and engine. **Weak bots:** librarian (3%), greedy and hoarder. The pure-library and pure-hoard heuristics are poor.

## Game length (len_* files, 1500 games)
- **9 picks** (hand 4, 3 picks): closer games, 46-55% close. More luck: balanced beats random only 0.80-0.94. Scores around 26.
- **15 picks** (hand 5, 5 picks, no discard): more skill, fewer close games (29-43%). The suspend fun ability does nothing (0.68-0.81).
- **Recommendation: keep 12 picks.** It is about 15-20 minutes and each pick is a real decision.

## Onboarding (KotlinConf newcomer)
1. **Mixed Polish and English names** ("Stażysta", "Płatności", "Wycena"). Final has English names for all cards.
2. **"Resources are not spent"** is the main 7 Wonders-style hurdle. Say it explicitly on the rules card.
3. **"Why can't I hire an AI freelancer?"** (g10, g19). The rule must be on the card. 🤖 is now the scarce, strategic resource.
4. **Library cards don't show what they unlock.** Ktor should say "→ REST API free". Proposed print: `📚 Ktor → REST API`.
5. Startup abilities are one line each, they trigger often (Companion, Bank) or are passive (suspend fun). Newcomers forget suspend fun; that is acceptable because it is tiny.
6. Add the tie-break line: more 💰 wins. Ties happened in 4 of my 20 games.

## Final one-card rules
```
STARTUP.KT LITE · 2-5 players · 20 min · Most ⭐ wins.
SETUP  Everyone gets a random Startup: it produces 1 resource, shows your starting 💰
       and has one small ability. Shuffle the I / II / III decks separately.
SPRINT Deal 5 cards each. Everyone secretly picks 1 card, all reveal together, then:
       BUILD it - pay its cost and keep it in front of you, or
       SELL it  - discard it and take 3💰.
       Pass the rest of your hand left. After 4 picks, discard the last card. 3 Sprints.
COSTS  📱 Frontend 🖥 Backend 🤖 AI Agent come from your Startup and 👥 Team cards.
       They are never spent: each build you may use each of them once.
       🤖 can stand in for 📱 or 🖥. Missing 📱/🖥? Hire a freelancer: 2💰 each.
       🤖 can't be hired. "Free with X": costs nothing if you have built X.
       No two copies of the same card.
END    ⭐ on cards + end bonuses + 1⭐ per 3💰. Tie: more 💰 wins.
```

## Other suggestions (not verified)
- 🤖 is still the strongest engine: Claude Code / Junie win lift is about 1.7-1.8, and ai-fan is the top bot in final. Consider making Junie / Claude Code cost 3💰. Flavour: agents are expensive tokens.
- Angel Investor (+4💰) is pointless for Sealed Deals (same as selling). That is minor.

## Code changes
- `engine/Model.kt`: optional ability fields on `Startup`.
- `engine/Engine.kt`: start coins, per-player sell value, Team discount, Library coins, leftover coins, startup coin rate.
- `cli/Main.kt`: prints the startup ability.
- `sim/Simulator.kt`: `comeback` metrics (leader/last after Sprint I and II, tied top).
- `EngineTest.kt`: new `startupAbilities` test. All tests pass.
- Scripts: `sim.py` (per-startup table), `skill.py` (comeback/skill), `mk5.py`, `tweak.py`.
