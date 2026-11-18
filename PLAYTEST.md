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

---

# v4.1: drobne poprawki po kolejnej rundzie testów

## Jak testowałem
- **3 agentów AI** rozegrało 14 pełnych gier przez CLI: pojedynek 2p, 5 graczy z naciskiem na odrabianie strat, oraz „przypadkowy gracz” przeciw botom `hard`/`expert` przy 3–4 graczach.
- **Lustrzane boty `hard`**, 600 gier na liczbę graczy (seed 7), oraz pojedynek na 1500 gier (seed 11). Turniej umiejętności przy 4 graczach: 400 gier.
- Sprawdziłem 13 wariantów, łącznie około 17 tys. gier.

## Co się zmieniło (tylko karty, bez nowych zasad)
| Zmiana | Dlaczego |
|---|---|
| **Senior Backend Dev** kosztuje 0💰 (było 1💰) | Był częściej sprzedawany niż budowany. Przy 4 graczach: zbudowany 69 razy, sprzedany 54 razy; teraz 193 i 48. |
| **QA Engineer** (tylko przy 5 graczach) kosztuje 1💰 (było 2💰) | Prawie nikt go nie budował: 5 razy zbudowany, 30 razy sprzedany; teraz 76 i 26. |
| **Login Screen → GDPR Compliance**, **Health-check → Security Audit**, **Dark Mode → Accessibility** („free with” jak przy bibliotekach) | Agenci zgłosili, że małe funkcje ze Sprintu I służą tylko do chowania pod startup. Teraz ustawiają plan na Sprint III. Health-check i Dark Mode są budowane ponad 2 razy częściej, a Security Audit rzadziej utyka w ręce. |
| **Compose Multiplatform** odblokowuje teraz iOS App i **Localization** (wcześniej Accessibility) | Accessibility przeszła do Dark Mode. Localization z 🤖 była martwą kartą, a teraz jest budowana o połowę częściej. Zasoby Compose są tu realistyczne. |

Silnik dostał opcjonalną zasadę `oneStagePerSprint` (domyślnie wyłączoną): najwyżej jeden etap roadmapy na Sprint.

## Wyniki (600 lustrzanych gier `hard`; w nawiasie v4 na tym samym seedzie)
| | 2p | 3p | 4p | 5p |
|---|---|---|---|---|
| Wyrównane gry (różnica ≤2⭐) | 62% (56%) | 77% (78%) | 83% (83%) | 84% (84%) |
| Wygrana gracza ostatniego po Sprincie I | 58% (57%) | 38% (36%) | 29% (27%) | 23% (21%) |
| Wygrana gracza ostatniego przed finałowym Sprintem | 31% (31%) | 20% (23%) | 15% (15%) | 11% (10%) |
| Zwycięzca nie prowadził przed finałowym Sprintem | 27% (28%) | 45% (46%) | 52% (53%) | 56% (55%) |
| Odsetek wygranych startupów | 43–59% (43–58%) | 27–38% (27–38%) | 20–29% (23–26%) | 18–22% (18–24%) |

- **Archetypy przy 4 graczach:** biblioteki 25%, funkcje 27%, biznes 21% (było 18%), zespół 28%, AI 29% (było 22%).
- **Umiejętności (4 graczy):** `expert` 68% (69%), `hard` 23% (22%), `medium` 8% (8%), `easy` 1% (2%). Bez zmian w granicach szumu.

## Sprawdzone i odrzucone
| Wariant | Wynik | Decyzja |
|---|---|---|
| **Companion:** +2⭐, +3💰 albo 1⭐ za funkcję zamiast za 👥 przy Product-Market Fit | Każde wzmocnienie robi z niego faworyta: 36–41% przy 5 graczach, 74–82% w pojedynku. | Bez zmian (szczegóły niżej). |
| **Runda pomostowa** (`catchUpCoins` 2 lub 3) | Odrabianie strat przy 5 graczach rośnie tylko z 10% do 11%. Na umiejętności nie wpływa. | Nie warto dodawać zasady. |
| **Jeden etap roadmapy na Sprint** | `medium` wygrywa 12% zamiast 8%, ale odrabianie strat przy 5 graczach spada do 7–8%, a etapów jest mniej (1,5–1,7). W połączeniu z resztą zmian zysk znika. | Zostaje jako opcja w silniku. |
| **Wynajęcie 🤖 za 3💰** | Bez wpływu na umiejętności. `expert` wygrywa 72%. | Usunięte. |
| **+1💰 na start** albo **Exit +1⭐** | Bez poprawy. Exit +1⭐ obniża wyrównanie w pojedynku do 54%. | Odrzucone. |
| **Inne wagi bota `medium`** (etapy, produkcja, szum) | Wszystkie warianty wygrywają ze zwykłym `medium` najwyżej o 2–3 pp. | Bot jest już blisko optimum heurystyki. |

## Otwarte kwestie v4.1
- **Companion nie wymaga zmiany.** Przy 1500 grach w pojedynku wygrywa 57–59%, przy 4–5 graczach 19–21%. Wcześniejsze 61% i 16% to głównie szum przy 600 grach (±3–4 pp). Agent grający w pojedynek ocenił jego zdolność na 5–6⭐, czyli tyle co Exit.
- **Pojedynek:** NullSafe Bank wygrywa 55–58%, a Sealed Deals i by lazy Studio około 44%. Wynik powtarza się na różnych seedach. Zmiany dla jednego startupu działają na wszystkie liczby graczy, więc to temat na osobną rundę, np. inna wartość startowa w pojedynku.
- **Różnica umiejętności** wynika z różnicy między botami heurystycznymi a Monte Carlo, a nie z zasad. Żadna zmiana kart ani zasad nie przesunęła `medium` powyżej 10–12%. Jeśli przeciwnik online ma być mocniejszy, `medium` mógłby być małym Monte Carlo (np. 4 światy) zamiast heurystyki.
- **Odrabianie strat przy 5 graczach** (11% przy średniej 20%) to cecha liczby graczy. Proporcja do średniej jest podobna jak przy 3–4 graczach, a tania runda pomostowa niewiele zmienia.
- **Pośpiech z roadmapą:** dwóch agentów widziało boty kończące Exit już w Sprincie I. Statystycznie się to nie opłaca (gracze z 3 etapami wygrywają tyle co reszta), ale przy stole może to wyglądać na „samograj”.
- **Outsourcing Partner** (freelancer za 1💰) agent grający w pojedynek nazwał najmocniejszą kartą pojedynku. Warto to sprawdzić w kolejnej rundzie.
