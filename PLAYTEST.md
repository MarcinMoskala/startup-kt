# Raport z testów: od v1 do v4

## Skala testów
- **10 agentów AI** rozegrało osobiście **201 pełnych gier**. Każdy miał inny obszar: 2/3/4/5 graczy, ekonomię, agentów 🤖, biblioteki, realizm kart, zabawę i interakcję, startupy i pierwszą grę. Raporty są w [`docs/playtest/`](docs/playtest/).
- Agenci zgłosili też około 1,2 mln gier botów w symulacjach, a ja dołożyłem kilkadziesiąt tysięcy własnych przy strojeniu.
- Weryfikację v3 robiłem na lustrzanych meczach botów `hard` (Monte Carlo) i turniejach strategii heurystycznych.

## Najważniejsze problemy v1 i jak je rozwiązano
| Problem v1 | Dowód | Rozwiązanie w v3 |
|---|---|---|
| NullSafe Bank (start z 🤖) za silny | 40–63% wygranych | startupy bez 🤖 + zdolności startupów |
| 🤖 jako darmowy joker robił Sprint III „samograjem” | zgłosili to agenci 01, 04, 06, 08, 09 | **tokeny**: 🤖 robiący pracę 📱/🖥 kosztuje 1💰 |
| budowanie zespołu jedyną dobrą strategią | bot `engine` wygrywał 46–79% | droższe karty AI, mocniejsze funkcje i biznes |
| biblioteki to pułapka | budowano je rzadziej, niż sprzedawano | 2⭐ + dwie funkcje za darmo, karta Open Source Maintainer |
| martwe karty (Tech Lead, Multi-agent Workflow, Wycena, Series A) | 0–5% budowań | punkty / zmiana typu / skalowanie z tableau |
| gra na 2 osoby bez napięcia | 27% wyrównanych gier | **pojedynek**: 8 kart, zagraj jedną i odrzuć jedną |
| duplikaty przy 5 graczach, polskie nazwy | agenci 03 i 08 | unikalne karty 4+/5+, angielskie nazwy, opisy |

## Wyniki v3 (200 lustrzanych gier botów `hard` na każdą liczbę graczy)
| | 2p | 3p | 4p | 5p |
|---|---|---|---|---|
| Wyrównane gry (różnica ≤2⭐) | 58% | 76% | 75% | 80% |
| Wygrana gracza ostatniego po Sprincie I (średnia: 50/33/25/20%) | 40% | 29% | 23% | 13% |
| Wygrana gracza ostatniego przed finałowym Sprintem | 28% | 24% | 15% | 9% |
| Zwycięzca nie prowadził przed finałowym Sprintem | 25% | 43% | 54% | 54% |
| Odsetek wygranych startupów | 33–61% | 25–38% | 23–28% | 18–22% |

**Wpływ umiejętności (4 graczy, każdy poziom AI na innym miejscu):** `expert` wygrywa 56%, `hard` 27%, `medium` 13%, `easy` 5%. Umiejętności się liczą, ale słabszy gracz nadal czasem wygrywa.

**Różnorodność strategii (boty `hard`):** wygrywa się bibliotekami, AI, biznesem, zespołem i funkcjami. Każdy z tych stylów ma 15–42% wygranych, zależnie od liczby graczy.

## Otwarte kwestie
- **2 graczy:** startupy są jeszcze nierówne (by lazy Studio 33%, NullSafe Bank 61% przy średniej 50%; przy 200 grach szum to około ±6 pp). Kandydaci do zmiany: zdolność by lazy Studio (przeciwnik odrzuca biblioteki) i 💰 na start NullSafe Bank w pojedynku.
- **Senior Backend Dev** jest częściej sprzedawany niż budowany.
- **Odrabianie strat przy 5 graczach** jest słabsze (9%). Gdyby to przeszkadzało, runda pomostowa (`catchUpCoins`) jest gotowa jako opcja.
- **Boty heurystyczne nie blokują sąsiadów.** Robią to tylko `hard` i `expert`. Ludzie robią to często, więc biblioteki będą przy prawdziwym stole słabsze niż w symulacjach.
- **Brak testów z ludźmi.** Najważniejszy następny krok to rozgrywki z wydrukowanym prototypem.

---

# v4: roadmapa startupów

## Co się zmieniło
- Nowa, trzecia akcja: kartę z ręki można **schować pod startup**, żeby osiągnąć kolejny etap roadmapy (MVP → Product-Market Fit → Exit). Etap opłaca się jak kartę: zespołem, freelancerami albo tokenami 🤖.
- Pasywne zdolności startupów przeszły do etapu II, więc zasad nie przybyło. Etap I daje 💰 i 1⭐, a etap III 4–5⭐.
- Karty są takie same jak w v3. Ruleset v3 nadal działa: `--def rulesets/v3.json`.

## Strojenie
- Wypróbowałem 11 wariantów etapów. Każdy grały lustrzane boty `hard`, łącznie około 20 tys. gier na wszystkich liczbach graczy.
- Największe zmiany:
  - suspend fun Travel: dochód na koniec Sprintu zmniejszony z 3💰 do 2💰 (przy 3💰 wygrywał 57%);
  - by lazy Studio: zamiast 2⭐ za każdą bibliotekę dostaje 3⭐ od razu i 1⭐ za bibliotekę. Teraz mniej zależy od liczby graczy;
  - Sealed Deals: MVP daje 4💰.
- Heurystyczne boty za bardzo lubiły etapy (`roadmapWeight` 1.0 → 0.7). Wyniki poniżej są już po tej poprawce.

## Wyniki v4 (600 lustrzanych gier botów `hard` na każdą liczbę graczy)
| | 2p | 3p | 4p | 5p |
|---|---|---|---|---|
| Wyrównane gry (różnica ≤2⭐) | 61% (v3: 58%) | 77% (76%) | 82% (75%) | 80% (80%) |
| Wygrana gracza ostatniego po Sprincie I | 57% (40%) | 36% (29%) | 26% (23%) | 22% (13%) |
| Wygrana gracza ostatniego przed finałowym Sprintem | 34% (28%) | 22% (24%) | 15% (15%) | 11% (9%) |
| Zwycięzca nie prowadził przed finałowym Sprintem | 29% (25%) | 44% (43%) | 53% (54%) | 56% (54%) |
| Odsetek wygranych startupów | 45–61% (33–61%) | 28–39% (25–38%) | 21–26% (23–28%) | 16–24% (18–22%) |
| Średnia liczba etapów roadmapy | 2,65 | 1,88 | 2,04 | 2,33 |

- **Roadmapa jest opcją, a nie obowiązkiem.** Gracze z 0, 1, 2 i 3 etapami wygrywają mniej więcej tak samo często, np. przy 4 graczach 29/22/28/24%. Około połowy graczy robi wszystkie trzy, co szósty żadnego.
- **Różnorodność strategii (boty `hard`, 4 graczy):** biblioteki 25%, funkcje 27%, zespół 29%, AI 31%, biznes 18% wygranych.
- **Umiejętności (4 graczy):** `expert` wygrywa 65% (v3: 56%), `hard` 26% (27%), `medium` 6% (13%), `easy` 3% (5%). Trzecia akcja daje więcej decyzji, w których liczy się umiejętność, więc słabszy gracz wygrywa rzadziej niż w v3.

## Otwarte kwestie v4
- **Companion** jest za mocny w pojedynku (61%), a słabszy przy 5 graczach (16%).
- **Odrabianie strat przy 5 graczach** to nadal tylko 11%.
- **Boty `medium` i `easy`** wygrywają rzadziej niż w v3. Jako przeciwnicy online są przez to łatwiejsi. Jeśli ma to być bardziej loteria, można dodać im szumu albo nauczyć je lepiej oceniać etapy.
- Zakryte karty pod startupem to nowy element do druku: karta startupu musi stać się małą planszą z trzema polami.
