# Startup.kt: zlecenie druku

Gra karciana: 75 kart + 5 plansz startupów na jeden komplet. Nakład: **___ kompletów**.

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

## 3. Informacje techniczne o plikach

- **Kolor:** pliki są w RGB (sRGB). Proszę o konwersję do CMYK po stronie drukarni i o **proof / wydruk próbny** przed nakładem.
  - Karty mają ciemne tło (#1E1F22). Proszę zwrócić uwagę, żeby nie wyszło szare ani nie zalało detali.
- **Grafika i fonty:** grafika jest wektorowa (PDF). Font JetBrains Mono (licencja OFL) jest osadzony w PDF.
- **Znaczniki cięcia:** pliki nie mają znaczników, bo impozycja jest po stronie drukarni.
- **Arkusze A4:** w folderze `home-print/` są arkusze A4 ze znacznikami do wydruku próbnego w domu. Nie są przeznaczone dla drukarni.

## 4. Pytania do drukarni

1. Czy przyjmujecie pliki RGB, czy mam dostarczyć CMYK (z jakim profilem, np. ISO Coated v2 / FOGRA39)?
2. Czy spad 3 mm jest OK?
3. Jaki jest minimalny nakład i czy możliwy jest jeden komplet próbny?
4. Czy robicie zaokrąglanie narożników i jakie promienie macie (R 3 / R 3,5 mm)?
5. Czy możecie dodatkowo zapakować komplet (folia/banderola), albo jakie pudełko polecacie dla 75 kart + 5 plansz 195 × 100 mm?
