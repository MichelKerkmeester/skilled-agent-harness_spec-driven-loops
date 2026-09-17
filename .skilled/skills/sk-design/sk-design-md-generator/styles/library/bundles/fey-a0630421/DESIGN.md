# Fey — Style Reference
> Nocturnal Bloomberg terminal, matte-black with luminous type

**Theme:** dark

Fey operates in a nocturnal financial terminal aesthetic: deep matte-black canvas, a single typographic voice (calibre) doing all the heavy lifting, and chromatic color deployed as signal rather than decoration. The interface feels like a Bloomberg terminal redesigned by an Apple hardware team — data-dense product surfaces float on near-black, white type glows with AAA contrast, and orange/blue/green appear only where meaning demands attention (accented words, price direction, status pills). Components are built from generous 16px card radii and pill-shaped 99px controls, with soft black halos creating depth instead of hard elevation. The signature move is typographic: tight tracking on large display sizes (-0.08em) compresses confident statements into compact, premium-feeling headlines, while weight 400 does most of the work — there is no shouting, only calm authority. Every surface lives in the #0b0b0b→#191919 range, making any chromatic accent feel intentionally switched on.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Fey White | `#ffffff` | `--color-fey-white` | Primary text, decorative borders, hairlines — the dominant color of the system, used for typography and 554+ border occurrences |
| Fey Ink | `#0b0b0b` | `--color-fey-ink` | Primary canvas and card surfaces — the near-black that everything floats on |
| Fey Charcoal | `#191919` | `--color-fey-charcoal` | Elevated card surface, secondary panels — one step lighter than the canvas for nested depth |
| Fey Obsidian | `#131313` | `--color-fey-obsidian` | Tertiary surface, input backgrounds, subtle elevated layers |
| Fey Graphite | `#868f97` | `--color-fey-graphite` | Muted secondary text, subdued borders, disabled labels — the workhorse mid-gray for everything that is not the headline |
| Fey Mist | `#cccccc` | `--color-fey-mist` | Icon strokes, subtle links, tertiary borders — a step brighter than Graphite for elements that need more presence |
| Fey Smoke | `#525252` | `--color-fey-smoke` | Deep dividers, shadow-tinted borders, very low-emphasis strokes |
| Fey Pale | `#e6e6e6` | `--color-fey-pale` | Subtle body borders, ghost button outlines, light strokes — the lightest non-white neutral |
| Fey Ash | `#999999` | `--color-fey-ash` | Low-emphasis borders and secondary text — sits between Graphite and Smoke |
| Fey Ember | `linear-gradient(97.13deg, rgb(255, 161, 108) 8.47%, rgb(85, 27, 16) 108.41%)` | `--color-fey-ember` | Warm accent for highlighted headline words and warm gradient terminus — orange-on-black reads as urgency and premium warmth; Warm hero gradient — Ember fading into deep brown for product showcase atmosphere |
| Fey Signal | `#479ffa` | `--color-fey-signal` | Navigation underline, active link border, cool accent — vivid blue draws the eye to current location and trust indicators |
| Fey Growth | `#4ebe96` | `--color-fey-growth` | Green outline accent for tags, dividers, and focused UI edges. Use as a supporting accent, not as a status color |
| Fey Abyss | `#000000` | `--color-fey-abyss` | Shadow base color, deepest possible background — used in 0.8-opacity halos and gradient termini |
| Fey Frost | `linear-gradient(96.44deg, rgb(182, 214, 255) 6.12%, rgb(57, 63, 86) 110.28%)` | `--color-fey-frost` | Cool gradient accent — pale blue fading into slate for secondary product showcase |
| Fey Volt | `linear-gradient(96.44deg, rgb(214, 254, 81) 6.12%, rgb(88, 81, 11) 110.28%)` | `--color-fey-volt` | Highlight gradient — electric yellow-green fading into deep olive for standout elements |

## Tokens — Typography

### Calibre — The sole typeface — a geometric sans with slightly compressed proportions. Weight 400 carries body and most UI; 500–600 for nav and labels; 700 reserved for large display headlines. Tight tracking at -0.08em on 48–54px display creates the premium, compressed feel. Letter-spacing of -0.053em applies to mid-range headings. No secondary font family is used — Calibre does all roles from 10px captions to 54px heroes · `--font-calibre`
- **Substitute:** Inter, Satoshi, General Sans
- **Weights:** 400, 500, 600, 700
- **Sizes:** 10px, 11px, 12px, 14px, 15px, 16px, 18px, 24px, 26px, 48px, 54px
- **Line height:** 1.00–1.58
- **Letter spacing:** -0.08em at 48–54px, -0.053em at 24–26px
- **OpenType features:** `"ss01" on, "tnum" on`
- **Role:** The sole typeface — a geometric sans with slightly compressed proportions. Weight 400 carries body and most UI; 500–600 for nav and labels; 700 reserved for large display headlines. Tight tracking at -0.08em on 48–54px display creates the premium, compressed feel. Letter-spacing of -0.053em applies to mid-range headings. No secondary font family is used — Calibre does all roles from 10px captions to 54px heroes

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 10px | 1.5 | — | `--text-caption` |
| body | 14px | 1.5 | — | `--text-body` |
| heading-sm | 18px | 1.32 | — | `--text-heading-sm` |
| heading | 24px | 1.25 | -1.27px | `--text-heading` |
| heading-lg | 26px | 1.2 | -1.38px | `--text-heading-lg` |
| display | 48px | 1.1 | -3.84px | `--text-display` |
| display-lg | 54px | 1 | -4.32px | `--text-display-lg` |

## Tokens — Spacing & Shapes

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 6 | 6px | `--spacing-6` |
| 8 | 8px | `--spacing-8` |
| 10 | 10px | `--spacing-10` |
| 14 | 14px | `--spacing-14` |
| 15 | 15px | `--spacing-15` |
| 16 | 16px | `--spacing-16` |
| 18 | 18px | `--spacing-18` |
| 20 | 20px | `--spacing-20` |
| 21 | 21px | `--spacing-21` |
| 24 | 24px | `--spacing-24` |
| 28 | 28px | `--spacing-28` |
| 32 | 32px | `--spacing-32` |
| 40 | 40px | `--spacing-40` |
| 42 | 42px | `--spacing-42` |
| 103 | 103px | `--spacing-103` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 16px |
| icons | 6px |
| small | 10px |
| buttons | 99px |
| featured | 275px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| xl | `rgba(0, 0, 0, 0.8) 0px 0px 44px 0px` | `--shadow-xl` |
| subtle | `rgba(0, 0, 0, 0.85) 0px 1px 0px 0px` | `--shadow-subtle` |
| md | `rgba(255, 255, 255, 0.25) 0px 0px 14px 0px` | `--shadow-md` |
| xl-2 | `rgba(0, 0, 0, 0.5) 0px 0px 35px 0px` | `--shadow-xl-2` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 64px
- **Card padding:** 18-24px
- **Element gap:** 10-16px

## Components

### Pill Navigation Button
**Role:** Top-bar nav items, tag filters, status indicators

Fully rounded at 99px radius, transparent background, white text at 12–14px Calibre 500. Active state shows a Fey Signal (#479ffa) 1px bottom border. Inactive items sit in Fey Graphite (#868f97). No fill — the pill shape alone signals interactivity.

### Primary Action Button
**Role:** Primary call-to-action (e.g. 'Learn more')

99px border-radius, transparent or Fey Ink (#0b0b0b) background with subtle 1px shadow line, white text 12–14px Calibre 500. Glows with a soft white halo (rgba(255,255,255,0.25) 0px 0px 14px). Ghost-style — the button is defined by shape and light, not fill.

### Product Showcase Card
**Role:** Hero product mockups, feature card images

16px border-radius, Fey Charcoal (#191919) background, wrapped in a heavy black shadow halo (rgba(0,0,0,0.8) 0px 0px 44px). The card itself is dark; the shadow creates the illusion of it floating in space. Contains sub-product UI: charts, tickers, news feeds in miniature.

### Insider Transaction Card
**Role:** Executive/insider buy/sell cards

16px border-radius, Fey Ink (#0b0b0b) or Fey Charcoal (#191919) surface. Left side: circular avatar. Center: name in white Calibre 600 + company in Fey Graphite. Right: Buy pill (Fey Growth #4ebe96 background, white text) or Sell pill (subtle red/gray). The color of the action pill is the only chromatic punctuation.

### Feature Section Card
**Role:** Three-up feature grid cards in highlights section

275px border-radius on outer featured card for distinctive pill shape. Inner content: Calibre 400 body text in Fey Mist (#cccccc) on Fey Ink (#0b0b0b). Each card in the row gets a caption label below (e.g. 'Beautiful Stock and ETF pages') in Fey Graphite 12px.

### Dock Navigation Bar
**Role:** Floating icon dock in product showcase section

Pill-shaped (99px radius) horizontal container with Fey Charcoal (#191919) background and 1px Fey Mist (#cccccc) border. Houses 7–8 monoline icons (home, compass, calendar, bookmark, mail, telescope, gear) plus a separated search button. Icons are white outlined strokes at ~20px. The dock floats over a product showcase image with a dotted leader line connecting to annotation text.

### Status Badge (Buy/Sell)
**Role:** Insider transaction action tags

Small pill (99px radius) with colored background: Fey Growth (#4ebe96) for Buy, desaturated warm tone for Sell. White text 10–11px Calibre 500 uppercase. Minimal padding (4px 8px). The badge is the primary color carrier in a sea of monochrome.

### Ticker Display
**Role:** Stock price, percentage change, portfolio value

Large white Calibre 700 at 48px for price values. Fey Growth green for positive change, desaturated red for negative. Portfolio name in Fey Graphite 11px caption above. Tighter tracking (-0.08em) on the large numbers makes them feel like real financial terminals.

### Section Headline
**Role:** Primary page headlines ('Make better investments.')

Calibre 700 at 48–54px, white, letter-spacing -0.08em, line-height 1.0–1.1. Centered or left-aligned. Period at end of short statements is deliberate punctuation. The extreme tightness of tracking is the signature — words feel compressed into a confident block.

### Highlighted Word
**Role:** Accent words within headlines

A single word in a headline rendered in Fey Ember (#ffa16c) or Fey Signal (#479ffa) instead of white. Creates a visual pulse — the eye is drawn to the colored word while the rest of the headline stays in white. Usage is sparing: one colored word per headline maximum.

### News Recap Card
**Role:** AI-generated market news summaries in product mockup

Fey Charcoal (#191919) surface, 10px border-radius, contains: ticker badge (small Fey Growth-bordered tag), headline in Calibre 500 white 14px, summary in Fey Mist (#cccccc) 12px, timestamp in Fey Graphite 10px right-aligned. Ghost border on active/focused card.

### Carousel Navigation Arrow
**Role:** Section-pagination controls (left/right chevrons)

Circular ghost button, Fey Ink (#0b0b0b) background, 1px Fey Mist (#cccccc) border, white chevron icon centered. ~40px diameter. Sits to the right of section content to scroll the feature card row.

## Do's and Don'ts

### Do
- Use 99px border-radius for all interactive controls (buttons, nav items, badges) — the pill shape is a load-bearing identity choice
- Set display headlines at 48–54px with -0.08em letter-spacing and Calibre 700 — this compressed tracking is the signature typographic move
- Use Fey Ink (#0b0b0b) as the primary canvas; layer Fey Charcoal (#191919) and Fey Obsidian (#131313) for nested card depth
- Apply chromatic accents (Ember orange, Signal blue, Growth green) only as meaning-carriers: highlighted words, status pills, price direction — never as decorative fills
- Use 16px border-radius for all content cards and product mockup surfaces
- Pair every dark surface with a heavy black shadow halo (rgba(0,0,0,0.8) 0px 0px 44px) to create the floating-in-space depth
- Default body text to Fey Graphite (#868f97) for secondary information; reserve pure white for headlines and primary values

### Don't
- Do not use filled chromatic buttons — Fey has no distinct CTA fill color; all actions are ghost or text-style on dark surfaces
- Do not introduce a secondary typeface — Calibre carries every role from 10px captions to 54px display
- Do not apply letter-spacing of 0 or positive values on display sizes — the negative tracking is essential to the premium compressed feel
- Do not use flat #000000 as the page background — always use Fey Ink (#0b0b0b) which is warmer and pairs better with the white type
- Do not use blue (#479ffa) for informational/semantic meaning — it is a navigation accent, not a status indicator
- Do not add more than one chromatic accent per headline or card — the restraint is what makes the color feel intentional
- Do not use heavy elevation (multi-layer drop shadows) — the system relies on a single deep black halo, not stacked shadows

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas | `#0b0b0b` | Full-page background — the matte-black that everything sits on |
| 1 | Card | `#191919` | Product mockup cards, feature panels — one tonal step up for separation |
| 2 | Elevated | `#131313` | Nested cards, input wells, subtle elevated containers |
| 3 | Overlay | `#000000cc` | Modal/overlay backdrop — heavy black wash for focus states |

## Elevation

- **Product mockup cards:** `rgba(0, 0, 0, 0.8) 0px 0px 44px 0px`
- **Primary button:** `rgba(0, 0, 0, 0.85) 0px 1px 0px 0px, rgba(255, 255, 255, 0.25) 0px 0px 14px 0px`
- **Featured card:** `rgba(0, 0, 0, 0.5) 0px 0px 35px 0px`

## Imagery

The site uses product UI mockups as its primary visual — not lifestyle photography, not abstract illustration, but actual screens of the Fey application rendered as floating cards. The hero shows a full stock-portfolio dashboard with charts, news feeds, and insider transactions. Feature cards show individual product surfaces (stock pages, insider lists, market-cap graphs). A second visual motif is a 3D-rendered rough stone/rock sculpture used as a backdrop for the dock navigation section, lit dramatically against black with warm orange/cool blue side lighting. Icon style is uniformly monoline outlined (1.5–2px stroke), white or Fey Mist on dark, used in nav, dock, and inline annotations. No stock photography of people; when faces appear they are circular avatar crops of public figures (Jensen Huang, Elon Musk, etc.) for insider-transaction cards. Overall density is image-dominant in the hero and feature sections, with whitespace carrying the rest.

## Layout

Page model is centered max-width ~1200px on a full-bleed dark canvas. The hero is a full-width product showcase — a large device-framed dashboard mockup floats centered, with a two-line headline ('Make better investments.') left-aligned below. Navigation is a minimal top bar: logo left, 5 nav links center-left, a contextual pill ('Hey has joined Wealthsimple') plus a 'Learn more' button on the right. Sections alternate between full-width dark bands and centered constrained content. The Highlights section uses a left-aligned headline + description with right-aligned carousel arrows, followed by a horizontally scrollable row of 3 product cards. Vertical rhythm is generous: ~64px between sections, with sections feeling like discrete dark rooms. Card grids are always 3-up for feature showcases. Navigation patterns: top bar only — no sticky header, no sidebar. The dock section uses a centered dock component floating over a dramatic product image, with annotation text connected via dotted leader lines to the right.

## Agent Prompt Guide

**Quick Color Reference**
- text: #ffffff (primary), #868f97 (secondary), #cccccc (tertiary)
- background: #0b0b0b (canvas), #191919 (card), #131313 (elevated)
- border: #868f97 (default), #cccccc (emphasis), #e6e6e6 (subtle)
- accent: #ffa16c (warm), #479ffa (cool), #4ebe96 (positive)
- primary action: no distinct CTA color

**Example Component Prompts**

1. **Pill Nav Button**: 99px border-radius, transparent background, text 12px Calibre 500 #868f97. Active state: 1px bottom border in #479ffa, text becomes #ffffff. No fill, no shadow.

2. **Product Showcase Card**: 16px border-radius, #191919 background, wrapped in shadow rgba(0,0,0,0.8) 0px 0px 44px. Contains a miniature dashboard UI with chart, ticker (48px Calibre 700 white), and Fey Growth green percentage change. Caption below: 12px Calibre 400 #868f97.

3. **Insider Transaction Row**: 16px border-radius card, #0b0b0b surface. Left: 48px circular avatar. Center: name 16px Calibre 600 #ffffff, company 12px Calibre 400 #868f97. Right: Buy pill — 99px radius, #4ebe96 background, white text 10px Calibre 500 uppercase.

4. **Section Headline**: 48px Calibre 700, #ffffff, letter-spacing -0.08em (-3.84px), line-height 1.1. One word optionally colored #ffa16c. Period at end of statement.

5. **Dock Navigation**: 99px border-radius pill, #191919 background, 1px #cccccc border. Contains 7 monoline icons (20px, #ffffff stroke) evenly spaced with 24px gaps. Separated search button at right. Floats over dark product image with dotted leader line to annotation text.

## Similar Brands

- **Robinhood** — Dark-mode fintech with single-color accent signals (green for gains) and dense product-UI mockups in the hero — same terminal-adjacent aesthetic
- **Bloomberg Terminal** — High-contrast white-on-black with chromatic price-direction indicators and compressed headline typography — Fey is the consumer-friendly descendant
- **Linear** — Dark canvas, monoline icons, pill-shaped controls, and restrained chromatic accents used only for status — same philosophy of monochrome with strategic color
- **Vercel** — Near-black surfaces, generous border-radius on cards, white type with tight tracking, and heavy black halos for depth on dark product mockups
- **Arc Browser** — Dark product-showcase aesthetic with floating UI cards, soft glow shadows, and a premium restrained palette punctuated by vivid accents

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-fey-white: #ffffff;
  --color-fey-ink: #0b0b0b;
  --color-fey-charcoal: #191919;
  --color-fey-obsidian: #131313;
  --color-fey-graphite: #868f97;
  --color-fey-mist: #cccccc;
  --color-fey-smoke: #525252;
  --color-fey-pale: #e6e6e6;
  --color-fey-ash: #999999;
  --color-fey-ember: #ffa16c;
  --gradient-fey-ember: linear-gradient(97.13deg, rgb(255, 161, 108) 8.47%, rgb(85, 27, 16) 108.41%);
  --color-fey-signal: #479ffa;
  --color-fey-growth: #4ebe96;
  --color-fey-abyss: #000000;
  --color-fey-frost: #b6d6ff;
  --gradient-fey-frost: linear-gradient(96.44deg, rgb(182, 214, 255) 6.12%, rgb(57, 63, 86) 110.28%);
  --color-fey-volt: #d6fe51;
  --gradient-fey-volt: linear-gradient(96.44deg, rgb(214, 254, 81) 6.12%, rgb(88, 81, 11) 110.28%);

  /* Typography — Font Families */
  --font-calibre: 'Calibre', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.5;
  --text-body: 14px;
  --leading-body: 1.5;
  --text-heading-sm: 18px;
  --leading-heading-sm: 1.32;
  --text-heading: 24px;
  --leading-heading: 1.25;
  --tracking-heading: -1.27px;
  --text-heading-lg: 26px;
  --leading-heading-lg: 1.2;
  --tracking-heading-lg: -1.38px;
  --text-display: 48px;
  --leading-display: 1.1;
  --tracking-display: -3.84px;
  --text-display-lg: 54px;
  --leading-display-lg: 1;
  --tracking-display-lg: -4.32px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-6: 6px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-14: 14px;
  --spacing-15: 15px;
  --spacing-16: 16px;
  --spacing-18: 18px;
  --spacing-20: 20px;
  --spacing-21: 21px;
  --spacing-24: 24px;
  --spacing-28: 28px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-42: 42px;
  --spacing-103: 103px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 64px;
  --card-padding: 18-24px;
  --element-gap: 10-16px;

  /* Border Radius */
  --radius-md: 3.2px;
  --radius-md-2: 6px;
  --radius-lg: 10px;
  --radius-xl: 13.9806px;
  --radius-2xl: 16px;
  --radius-full: 50px;
  --radius-full-2: 99px;
  --radius-full-3: 275px;

  /* Named Radii */
  --radius-cards: 16px;
  --radius-icons: 6px;
  --radius-small: 10px;
  --radius-buttons: 99px;
  --radius-featured: 275px;

  /* Shadows */
  --shadow-xl: rgba(0, 0, 0, 0.8) 0px 0px 44px 0px;
  --shadow-subtle: rgba(0, 0, 0, 0.85) 0px 1px 0px 0px;
  --shadow-md: rgba(255, 255, 255, 0.25) 0px 0px 14px 0px;
  --shadow-xl-2: rgba(0, 0, 0, 0.5) 0px 0px 35px 0px;

  /* Surfaces */
  --surface-canvas: #0b0b0b;
  --surface-card: #191919;
  --surface-elevated: #131313;
  --surface-overlay: #000000cc;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-fey-white: #ffffff;
  --color-fey-ink: #0b0b0b;
  --color-fey-charcoal: #191919;
  --color-fey-obsidian: #131313;
  --color-fey-graphite: #868f97;
  --color-fey-mist: #cccccc;
  --color-fey-smoke: #525252;
  --color-fey-pale: #e6e6e6;
  --color-fey-ash: #999999;
  --color-fey-ember: #ffa16c;
  --color-fey-signal: #479ffa;
  --color-fey-growth: #4ebe96;
  --color-fey-abyss: #000000;
  --color-fey-frost: #b6d6ff;
  --color-fey-volt: #d6fe51;

  /* Typography */
  --font-calibre: 'Calibre', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.5;
  --text-body: 14px;
  --leading-body: 1.5;
  --text-heading-sm: 18px;
  --leading-heading-sm: 1.32;
  --text-heading: 24px;
  --leading-heading: 1.25;
  --tracking-heading: -1.27px;
  --text-heading-lg: 26px;
  --leading-heading-lg: 1.2;
  --tracking-heading-lg: -1.38px;
  --text-display: 48px;
  --leading-display: 1.1;
  --tracking-display: -3.84px;
  --text-display-lg: 54px;
  --leading-display-lg: 1;
  --tracking-display-lg: -4.32px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-6: 6px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-14: 14px;
  --spacing-15: 15px;
  --spacing-16: 16px;
  --spacing-18: 18px;
  --spacing-20: 20px;
  --spacing-21: 21px;
  --spacing-24: 24px;
  --spacing-28: 28px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-42: 42px;
  --spacing-103: 103px;

  /* Border Radius */
  --radius-md: 3.2px;
  --radius-md-2: 6px;
  --radius-lg: 10px;
  --radius-xl: 13.9806px;
  --radius-2xl: 16px;
  --radius-full: 50px;
  --radius-full-2: 99px;
  --radius-full-3: 275px;

  /* Shadows */
  --shadow-xl: rgba(0, 0, 0, 0.8) 0px 0px 44px 0px;
  --shadow-subtle: rgba(0, 0, 0, 0.85) 0px 1px 0px 0px;
  --shadow-md: rgba(255, 255, 255, 0.25) 0px 0px 14px 0px;
  --shadow-xl-2: rgba(0, 0, 0, 0.5) 0px 0px 35px 0px;
}
```
