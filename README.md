# Startup.kt

Strategiczna gra karciana o budowaniu startupu w Kotlinie (draft w stylu 7 Wonders).
Projekt ma trzy moduły:
- `core` (Kotlin Multiplatform: JVM + Wasm): silnik, zasady, karty i boty;
- `cli` (JVM): CLI dla agentów i symulator balansu;
- `app` (Compose Multiplatform: Wasm + desktop JVM): gra z botami w przeglądarce (desktop i mobile) oraz jako aplikacja desktopowa.

## Zagraj
- Online: https://marcinmoskala.github.io/startup-kt/
- Desktop: `./gradlew :app:run`

## Gra w przeglądarce
```bash
./run-web.sh        # buduje i serwuje na http://localhost:8779
```
Publikacja na GitHub Pages: `./deploy-pages.sh`. Do pracy nad UI: `./gradlew :app:wasmJsBrowserDevelopmentRun` (dev server z przeładowaniem).
Gra zapisuje się w `localStorage`, więc odświeżenie strony nie przerywa partii.
Boty myślą w przeglądarce (Monte Carlo, kooperacyjnie z UI). W konsoli logują, ile czasu zajęła każda decyzja.

## Zasady
Aktualne zasady (v3, po angielsku, do druku) są w [RULES.md](RULES.md). Pełna zawartość kart jest w
`engine/Cards.kt` oraz w `rulesets/v3.json`. Wyniki testów opisuje [PLAYTEST.md](PLAYTEST.md).

## Budowanie
```bash
./gradlew :core:jvmTest :cli:test :cli:installDist      # CLI: cli/build/install/startup/bin/startup
```

## CLI
```bash
B=cli/build/install/startup/bin/startup
$B help
$B cards                                   # lista kart
$B export > def.json                       # pełny ruleset (zasady + karty + startupy) do edycji
$B validate --def def.json
$B simulate --games 2000 --players 4 --bots balanced,engine,greedy,ai-fan [--def def.json]
$B new --state g.game.json --players 3 --seed 1 --bots 1=balanced,2=engine [--def def.json]
$B view --state g.game.json --seat 0       # co widzi seat 0 i jakie ma legalne akcje
$B act  --state g.game.json --seat 0 --action build:ktor   # albo sell:<id>
$B status --state g.game.json
```
Miejsca bez bota są sterowane przez Ciebie (możesz grać kilkoma naraz, hot-seat). Boty ruszają się automatycznie.
`--json` przy `view`, `act` i `simulate` daje wyjście maszynowe.

Boty:
- poziomy trudności do gry online: `easy`, `medium`, `hard` i `expert`. Dwa ostatnie to Monte Carlo z ukrytą informacją, więc nie podglądają cudzych kart;
- „osobowości” strategii: `greedy`, `balanced`, `engine`, `ai-fan`, `librarian`, `hoarder`;
- `random`.
`simulate --random-tables` losuje boty do każdego stołu (turnieje strategii).
W 2-osobowym pojedynku każda akcja odrzuca też kartę: `--discard <id>` albo `build:x,discard:y`.

## Struktura
- `core/.../engine/Model.kt`: karty, zasoby, stan, akcje (wszystko `@Serializable`)
- `core/.../engine/Cards.kt`: zawartość v3 (`DefaultRuleset`)
- `core/.../engine/Engine.kt`: reguły, płatność (najtańszy plan z tokenami 🤖), tury, punktacja, widok gracza, pojedynek
- `core/.../bots/Bots.kt`: boty heurystyczne i Monte Carlo (także w wersji `chooseAsync` dla przeglądarki)
- `cli/.../sim/Simulator.kt`: statystyki balansu (wpływ kart na wygraną, startupy, odrabianie strat, style gry)
- `cli/.../cli/Main.kt`: CLI ze stanem w pliku JSON
- `app/src/commonMain/.../ui/`: wspólne UI w Compose (`App.kt`, `Components.kt`, `Icons.kt` z wektorowymi ikonami, `GameController.kt`)
