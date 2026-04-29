# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

Stonehill Visuals on Elias Kivimäen valokuvausyrityksen verkkosivusto (stonehillvisuals.fi, Seinäjoki). Koko sivusto on yhdessä tiedostossa: `index.html`. Ei buildvaihetta, ei paketteja, ei frameworkeja — pelkkää HTML/CSS/JS.

## Kansiorakenne

```
Stonehill Visuals/
├── index.html              # koko sivusto
├── kuvat ja videot/        # kaikki mediasisältö
│   ├── _DSC9541.jpg        # OG-kuva (käytetty meta/schema-tageissa)
│   ├── _DSC*.jpg           # portfolio-kuvat (yritys- ja henkilökuvaus)
│   ├── DSC*.jpg            # lisää portfolio-kuvia
│   ├── C8053T01.jpg        # portfolio-kuva
│   ├── Kärkkäisen avajaiset.mp4
│   ├── Kärkkäisen katto.mp4
│   └── Powerofsun vidi.mov
└── CLAUDE.md
```

Kun lisäät uusia kuvia tai videoita portfolioon, tallenna ne `kuvat ja videot/`-kansioon ja viittaa niihin `index.html`:ssä polulla `kuvat ja videot/tiedostonimi.jpg`.

## Architecture

`index.html` sisältää kaiken:
- **`<head>`** — SEO-metatiedot, Schema.org JSON-LD (LocalBusiness, Person, WebSite, FAQPage), Google Fonts
- **`<style>`** — kaikki CSS sisäisenä, ei erillistä tyylitiedostoa
- **`<body>`** — kaksi sivunäkymää: `#page-home` ja `#page-portfolio`, joita vaihdetaan `showPage(id)` -funktiolla (`display:none` / `.active`)
- **`<script>`** — kaikki JavaScript sivun lopussa

## Key JS functions

| Funktio | Tarkoitus |
|---|---|
| `showPage(id)` | Vaihtaa sivunäkymän (home / portfolio) |
| `scrollToSection(id)` | Scrollaa osioon, vaihtaa tarvittaessa ensin home-näkymään |
| `goToPortfolio(cat)` | Avaa portfolio-näkymän tietyllä kategorialla |
| `filterPort(cat, btn)` | Suodattaa portfolio-itemit kategorian mukaan |
| `toggleLang()` | Vaihtaa FI/EN-kielen — lukee `data-fi`/`data-en`-attribuutit elementeistä |
| `submitForm(e)` | Lähettää varauslomakkeen Formspree-endpointiin (async fetch) |
| `openLightbox(src)` / `closeLightbox(e)` | Video-lightbox |
| `initReveal()` | IntersectionObserver scroll-reveal (`.rv` → `.rv.on`) |

## Styling conventions

- CSS-muuttujat: `--blue:#00AEEF`, `--black:#050508`, `--gray:#0a0a0f`, `--nav:88px`
- Fontit: Bebas Neue (otsikot), Instrument Sans (body), Cormorant Garamond (lainaukset)
- Reveal-animaatio: lisää elementille `.rv`-luokka, optionaalisesti `.d1`/`.d2`/`.d3` viiveelle
- Nappiluokat: `.btn-p` (sininen CTA), `.btn-s` (läpinäkyvä/outline), `.btn-dark` (musta)

## Language toggle (FI/EN)

Kielenvaihdossa `toggleLang()` iteroi elementit, joilla on `data-fi` ja `data-en` -attribuutit, ja asettaa niiden `textContent`/`innerHTML` oikean kielen arvoon. Uusille tekstisisällöille lisää aina molemmat attribuutit. Nav-napin teksti ja meta description päivitetään erikseen koodissa.

## Deployment

Staattinen hosting — tiedostojen muokkaaminen riittää, ei buildvaihetta. Lomake käyttää Formspree-endpointia (muuttuja `FORMSPREE_ENDPOINT` scriptin alussa).
