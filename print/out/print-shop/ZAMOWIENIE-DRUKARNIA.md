# Startup.kt: zlecenie druku

Gra karciana. Jeden komplet: **75 kart, 5 plansz startupów, instrukcja (12 stron) i pudełko (dno + wieko)**. Nakład: **___ kompletów**.

## 1. Karty

| | |
|---|---|
| Format netto (po cięciu) | **63 × 88 mm** (standard pokerowy) |
| Format brutto (plik) | **69 × 94 mm**, spad 3 mm z każdej strony |
| Strefa bezpieczna | 3 mm od linii cięcia (cała treść mieści się w 57 × 82 mm) |
| Ilość w komplecie | **75 kart**, każda karta jest innym wzorem awersu |
| Druk | **4+4** (dwustronnie, pełny kolor) |
| Rewersy | **3 wzory** (Sprint I, II, III), po 25 kart każdy |
| Narożniki | **zaokrąglone, R 3 mm** |
| Materiał (propozycja) | karton 300–330 g/m², najlepiej „black core” (nieprzezroczysty), kreda matowa |
| Uszlachetnienie (propozycja) | folia matowa lub lakier płócienny (linen) na obie strony |

**Pliki kart:**
- `cards-fronts-69x94mm.pdf`: 75 stron, jedna strona to jeden awers.
- `cards-backs-69x94mm.pdf`: 75 stron. Strona *n* to rewers karty ze strony *n* pliku awersów.
- Alternatywnie PNG 300 dpi (815 × 1110 px, ze spadem):
  - `png/cards/NN-<id>-<gracze>plus.png`: awersy,
  - `png/backs/back-1..3.png`: 3 wzory rewersu.
  - Który rewers należy do którego awersu, podaje `cards-manifest.csv` (kolumna `back`).

## 2. Plansze startupów

| | |
|---|---|
| Format netto | **195 × 100 mm** (poziomo) |
| Format brutto (plik) | **201 × 106 mm**, spad 3 mm |
| Strefa bezpieczna | 3 mm od linii cięcia |
| Ilość w komplecie | **5 plansz**, 5 różnych wzorów |
| Druk | **4+0** (jednostronnie) |
| Narożniki | zaokrąglone, R 3 mm |
| Materiał (propozycja) | karton 400–450 g/m² z folią matową. Wersja premium: tektura 1,5–2 mm oklejona wydrukiem |

**Pliki plansz:** `boards-201x106mm.pdf` (5 stron) albo `png/boards/*.png` (300 dpi, 2374 × 1252 px).

Na dolnej krawędzi planszy znajdują się 3 pola, każde szerokości karty (63 mm). Gracze wsuwają pod nie karty, więc plansza musi być sztywna i mieć równo przyciętą dolną krawędź.

## 3. Instrukcja

| | |
|---|---|
| Format netto | **100 × 190 mm** (pionowo) |
| Format brutto (plik) | **106 × 196 mm**, spad 3 mm |
| Objętość | **12 stron**, w tym okładka (strona 1 i 12) |
| Oprawa | **zeszytowa**, 2 zszywki (szycie drutem) |
| Druk | 4+4, pełny kolor, ciemne tło na wszystkich stronach |
| Materiał (propozycja) | środek kreda mat 150–170 g/m². Okładka może być z tego samego papieru (self-cover) albo 250 g/m² z folią matową |

**Plik:** `rules-12-pages-106x196mm.pdf`, 12 stron w kolejności czytania. Impozycja jest po stronie drukarni.

## 4. Pudełko

| | |
|---|---|
| Typ | **dwuczęściowe, z nasuwanym wiekiem** (dno + wieko). Każda część to jeden wykrojnik z klapkami klejonymi w narożnikach |
| Wnętrze dna | **203 × 108 × 32 mm** (mieści plansze 195 × 100 mm, 75 kart w dwóch stosach i instrukcję) |
| Wymiary zewnętrzne po zamknięciu | ok. **208 × 111 × 33 mm** |
| Arkusz dna (ze spadem) | **275 × 179 mm** |
| Arkusz wieka (ze spadem) | **273 × 176 mm** |
| Materiał (założenie) | karton 350–400 g/m², grubość ok. **0,5 mm**. Przy innej grubości wykrojnik trzeba przeliczyć |
| Druk | 4+0 (zewnątrz). Środek bez druku |
| Uszlachetnienie | folia matowa. **Bez folii i lakieru na klapkach do klejenia** (pomarańczowe pola na wykrojniku) albo klej do folii |

**Pliki pudełka** (osobno dla dna `base` i wieka `lid`, wszystkie w tych samych współrzędnych arkusza):
- `box-<część>-art.pdf`: sama grafika ze spadem.
- `box-<część>-dieline.pdf`: sam wykrojnik. Linie:
  - cięcie: ciągła magenta #EC008C,
  - big: przerywana cyan #00AEEF,
  - klej: pomarańczowe kreskowanie.
- `box-<część>-proof.pdf`: grafika z nałożonym wykrojnikiem, do sprawdzenia.
- `BOX-NOTES.md`: wymiary, legenda wykrojnika i kolejność składania.

Jeśli drukarnia ma własny standardowy wykrojnik pudełka z wiekiem o tych wymiarach, można go użyć, a grafikę dopasować do niego.

## 5. Informacje techniczne o plikach

- **Kolor:** pliki są w RGB (sRGB). Proszę o konwersję do CMYK po stronie drukarni i o **proof / wydruk próbny** przed nakładem.
  - Karty mają ciemne tło (#1E1F22). Proszę zwrócić uwagę, żeby nie wyszło szare ani nie zalało detali.
- **Grafika i fonty:** grafika jest wektorowa (PDF). Fonty JetBrains Mono i Inter (licencja OFL) są osadzone w PDF.
- **Znaczniki cięcia:** pliki nie mają znaczników, bo impozycja jest po stronie drukarni.
- **Arkusze A4:** w folderze `home-print/` są arkusze A4 ze znacznikami do wydruku próbnego w domu. Nie są przeznaczone dla drukarni.

## 6. Pytania do drukarni

1. Czy przyjmujecie pliki RGB, czy mam dostarczyć CMYK (z jakim profilem, np. ISO Coated v2 / FOGRA39)?
2. Czy spad 3 mm jest OK?
3. Jaki jest minimalny nakład i czy możliwy jest jeden komplet próbny?
4. Czy robicie zaokrąglanie narożników i jakie promienie macie (R 3 / R 3,5 mm)?
5. Czy zrobicie pudełko z mojego wykrojnika (czy macie ploter tnący lub wykrojnik), czy wolicie swój standardowy? Jaki karton i jaka grubość?
6. Instrukcja: czy szyjecie zeszytowo format 100 × 190 mm i jaki papier polecacie przy ciemnym tle?
