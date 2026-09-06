# Sandclock — Style Reference
> DeFi command terminal at midnight — green signal lights on a matte black console

**Theme:** dark

Sandclock is a DeFi yield terminal dressed in matte black: near-zero chrome, one vivid mint-green signal color, and typography that does all the work. The interface reads like a Bloomberg terminal reimagined for DeFi — dark canvas (#0a0a0a), hairline graphite borders (#222222), flat surfaces with no decorative elevation, and Inter for utility text paired with a custom Aeonik display face for the rare 72px headline. Green (#3fe280) appears as functional punctuation only: active nav underline, primary CTAs, and accent borders on live stat cards. Every other surface stays achromatic so the green reads as a live signal, not decoration. Components feel like a trading dashboard — compact, information-dense in numbers, but breathing with generous section gaps. No gradients, no drop shadows beyond a single subtle button lift, no colorful illustration chrome. Trust is communicated through restraint: the design says 'your money is here' by staying quiet.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Abyss | `#0a0a0a` | `--color-abyss` | Page canvas and primary background — the entire site lives on this near-black surface so the mint accent reads as a live signal against pure darkness |
| Carbon | `#171717` | `--color-carbon` | Elevated card and panel surface — used for stat cards, security badges, and announcement containers that need to lift off the canvas without introducing color |
| Graphite | `#222222` | `--color-graphite` | Hairline borders, dividers, and the highest-frequency structural color in the system. Carries 356 borderColor uses — it is the wireframe that defines every container |
| Ash | `#9b9b9b` | `--color-ash` | Muted secondary text, helper labels, and de-emphasized nav items. The only non-white text color — reserves #ffffff for content that must be read first |
| Chalk | `#ffffff` | `--color-chalk` | Primary text, icons, and the Connect Wallet button fill. Maximum contrast against Abyss (19.8:1) ensures legibility on the darkest possible surface |
| Signal Mint | `#3fe280` | `--color-signal-mint` | Sole chromatic accent — active nav underline, primary CTA fills (Start Earning), and the highlight border on the TVL stat card. Appears sparingly so each instance reads as a live, money-moving action rather than decoration |

## Tokens — Typography

### Aeonik — Display headlines (hero). Used exactly once on the page at 72px — custom face with tight tracking makes the financial-app statement feel engineered rather than templated. The 400 weight at this size is the signature choice: other finance sites use 600-800 bold; Sandclock whispers authority instead. · `--font-aeonik`
- **Substitute:** Satoshi (Indian Type Foundry) or General Sans
- **Weights:** 400
- **Sizes:** 72px
- **Line height:** 1.00
- **Letter spacing:** -0.025em
- **Role:** Display headlines (hero). Used exactly once on the page at 72px — custom face with tight tracking makes the financial-app statement feel engineered rather than templated. The 400 weight at this size is the signature choice: other finance sites use 600-800 bold; Sandclock whispers authority instead.

### Inter — All UI text — body, buttons, nav, card content, subheadings, and section headings. The positive 0.05em tracking on Inter is unusual for body copy and gives labels a slightly technical, instrument-panel quality rather than editorial warmth. Weight 500 is reserved for emphasis (CTA labels, section titles); 400 carries everything else. · `--font-inter`
- **Substitute:** DM Sans or system-ui
- **Weights:** 400, 500
- **Sizes:** 14px, 16px, 20px, 24px, 36px
- **Line height:** 1.11, 1.33, 1.40, 1.43, 1.50
- **Letter spacing:** 0.05em
- **Role:** All UI text — body, buttons, nav, card content, subheadings, and section headings. The positive 0.05em tracking on Inter is unusual for body copy and gives labels a slightly technical, instrument-panel quality rather than editorial warmth. Weight 500 is reserved for emphasis (CTA labels, section titles); 400 carries everything else.

### DM Sans — Minimal secondary usage — likely a single element or fallback. Not a primary type voice. · `--font-dm-sans`
- **Substitute:** Inter
- **Weights:** 500
- **Sizes:** 16px
- **Line height:** 1.20
- **Role:** Minimal secondary usage — likely a single element or fallback. Not a primary type voice.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 14px | 1.43 | 0.7px | `--text-caption` |
| body | 16px | 1.5 | 0.8px | `--text-body` |
| subheading | 20px | 1.4 | 1px | `--text-subheading` |
| heading-sm | 24px | 1.33 | 1.2px | `--text-heading-sm` |
| heading | 36px | 1.11 | 1.8px | `--text-heading` |
| display | 72px | 1 | -1.8px | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 8px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 8 | 8px | `--spacing-8` |
| 16 | 16px | `--spacing-16` |
| 24 | 24px | `--spacing-24` |
| 32 | 32px | `--spacing-32` |
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |
| 64 | 64px | `--spacing-64` |
| 80 | 80px | `--spacing-80` |
| 112 | 112px | `--spacing-112` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 12px |
| pills | 9999px |
| buttons | 16px |
| heroButton | 64px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| subtle | `rgba(24, 39, 75, 0.08) 0px 2px 3px 0px` | `--shadow-subtle` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 48-64px
- **Card padding:** 16px
- **Element gap:** 16px

## Components

### Primary CTA Button
**Role:** Filled button for the single most important action on a page (Start Earning, Connect)

Background #3fe280 (Signal Mint), text #0a0a0a (Abyss) for inverted contrast. Inter 500 at 16px, letter-spacing 0.05em. Padding 12px 24px. Border-radius 16px. No shadow. Green-on-dark makes the button pop as the only colored element on screen — visual priority is immediate.

### Ghost Button
**Role:** Secondary action paired with a Primary CTA (Buy QUARTZ)

Transparent background, 1px border in #222222 (Graphite), text #ffffff. Inter 500 at 16px. Padding 12px 24px. Border-radius 16px. A small icon precedes the label. Reads as a quiet companion to the green CTA — same shape, muted chrome.

### Connect Wallet Button
**Role:** Persistent wallet-connection action in the top-right nav

White fill #ffffff with #0a0a0a text — inverted from the rest of the dark UI. Inter 500 at 16px. Border-radius 9999px (full pill). The white pill in a sea of dark surfaces is the only high-contrast non-CTA on the page; it functions as a global utility, not a content action.

### Navigation Link
**Role:** Top-bar nav items (Home, Earn, Staking, Docs)

Inter 400 at 16px, #ffffff text. Active state: 3px solid #3fe280 bottom border — the only place green appears in nav. Inactive links carry no underline. The green underline is a live signal that mirrors the mint CTAs below.

### TVL Stat Card
**Role:** Highlighted live-data card showing protocol metrics

Background #171717 (Carbon), 1px border #3fe280 (Signal Mint) — the green border is the signal. Internal layout: small Ash label (14px, uppercase tracking) above a large white value (36px Inter 500). Padding 16-24px. Border-radius 12px. The green border should be reserved for cards showing live, money-bearing numbers.

### Generic Card
**Role:** Default elevated container for content groups

Background #171717 (Carbon), 1px border #222222 (Graphite). Border-radius 12px. Padding 16px. No shadow. Hairline border rather than elevation — the system communicates layer depth with color shift, not drop shadow.

### Announcement Card
**Role:** News/partner tiles with image hero and text body

Background #171717, border-radius 12px. Top half: full-bleed image or gradient artwork (allowed break from the no-imagery rule — external partnership visuals). Bottom half: small pill badge (Announcement / Security) in Graphite with white text, then heading (20px Inter 500, white) and body (14px Inter 400, Ash). Padding 16px on text block.

### Security Badge Tile
**Role:** Trust-signal cards (Safe data, SOC2 Compliant, Insured by Schwarzs child)

Background #171717, border-radius 12px. Centered icon in a small circle at top, single line of white label text below. No border, no shadow. Icon color: #ffffff or accent blue (the SOC2 badge uses a brand-blue circle as the one permissible color exception for third-party certification marks).

### Announcement Tag
**Role:** Small pill badge above announcement card headings

Background #222222 (Graphite), text #ffffff, Inter 500 at 12px. Padding 4px 12px. Border-radius 9999px (pill). Used to categorize cards (Announcement, Security) — never colored, always neutral.

### Partner Logo Strip
**Role:** Horizontal row of third-party protocol logos (AAVE, LIDO, Compound, Morpho)

White logos (#ffffff) on Abyss canvas, evenly distributed across full width. No borders, no separators — just the logos and breathing room. Functions as a trust-by-association strip below the hero.

### Feature Icon Block
**Role:** Small icon-plus-label units used in feature lists

White or Signal Mint icon (16-20px) paired with white label text (14px Inter 400). 4-8px gap between icon and text. Aligned to a vertical rhythm. No background or border — lives directly on the canvas.

## Do's and Don'ts

### Do
- Use Signal Mint #3fe280 only for: primary CTAs, active nav indicators, and the border on live-data stat cards. Every other surface stays achromatic.
- Set Inter letter-spacing to 0.05em on all text — this technical tracking is what differentiates the type from generic SaaS body copy.
- Use 12px border-radius for all cards and 16px for all buttons. Do not mix in 8px or 4px — the 12/16 split is the geometry signature.
- Use Aeonik 400 at 72px for hero-level display text only. Never use Aeonik for subheadings or body — it is reserved for the single statement moment per page.
- Default to #0a0a0a canvas with #171717 cards and #222222 hairline borders. Communicate layer depth with color shift, not shadow.
- Apply generous 48-64px section gaps. The density reads 'comfortable,' not compact — money products need breathing room.
- Place the Connect Wallet action as a white pill (9999px radius) in the top-right — it is the only inverted-color UI element allowed in nav.

### Don't
- Do not use Signal Mint for body text, icons, or decorative shapes. Green is a signal, not a theme color.
- Do not introduce drop shadows on cards, modals, or panels. Flat surfaces are a deliberate financial-trust convention.
- Do not use gradients. The system is deliberately flat; a gradient would break the terminal aesthetic.
- Do not set Inter letter-spacing to normal or negative. The 0.05em positive tracking is a signature choice.
- Do not use Ash #9b9b9b for anything longer than a short helper label — reserve it for de-emphasized text only.
- Do not apply border-radius below 12px on containers or below 16px on buttons. The system is geometrically opinionated.
- Do not use Aeonik weights above 400. The display face works at 400 because the size (72px) carries the weight; bolding would over-shout.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Abyss | `#0a0a0a` | Full-bleed page canvas |
| 1 | Carbon | `#171717` | Cards, stat panels, and announcement containers |
| 2 | Graphite | `#222222` | Hairline borders and divider lines |

## Elevation

- **Primary CTA Button:** `rgba(24, 39, 75, 0.08) 0px 2px 3px 0px`

## Imagery

Imagery is minimal and used only for partnership/announcement content. The site has no product photography, no lifestyle imagery, no illustration chrome — it is a text-and-data UI. The only visual content comes from third-party announcement cards (earth/aurora gradients, certification marks) which are external assets, not system design. The hero and core product surfaces are pure typography on Abyss. Icons throughout are monochrome line icons in white, used sparingly as functional markers. The overall density is text-dominant with data (TVL, stETH Exposure) taking visual priority over decorative imagery.

## Layout

Max-width ~1200px centered container on a full-bleed Abyss canvas. Hero follows a two-column split: large 72px Aeonik headline left, supporting copy + dual CTA stack right. Below the hero, a partner logo strip spans full container width with even horizontal distribution. Content sections are single-column, centered headings, with feature/icon blocks in 2-3 column grids. The TVL stat card is full-width with green border emphasis. Announcement cards use a 3-column grid. Vertical rhythm is generous — 48-64px between major sections. Navigation is a minimal top bar with left-aligned logo, center-left nav links, and a right-aligned Connect Wallet pill. No sticky behavior is evident beyond the standard top bar.

## Agent Prompt Guide

Quick Color Reference:
- canvas: #0a0a0a
- card surface: #171717
- border: #222222
- primary text: #ffffff
- muted text: #9b9b9b
- accent: #3fe280
- primary action: #3fe280 (filled action)

Example Component Prompts:

1. Create a Primary Action Button: #3fe280 background, #0a0a0a text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.

2. Create a TVL stat card: #171717 background, 1px #3fe280 border, 12px radius, 24px padding. Small uppercase label in #9b9b9b 14px Inter 400 above a large value in #ffffff 36px Inter 500.

3. Create a generic content card: #171717 background, 1px #222222 border, 12px radius, 16px padding. White 20px Inter 500 heading, Ash #9b9b9b 14px Inter 400 body.

4. Create a security badge tile: #171717 background, 12px radius, centered layout. 24px white line icon at top, 14px Inter 400 white label below. No border.

5. Create a nav link with active state: 16px Inter 400 #ffffff text, 3px solid #3fe280 bottom border on active. Inactive links have no underline.

## Similar Brands

- **Aave** — Same DeFi dark-mode terminal aesthetic with hairline borders, flat surfaces, and a single accent color reserved for live protocol signals
- **Lido Finance** — Identical financial-product restraint — Abyss canvas, white-on-dark typography hierarchy, generous spacing, and zero decorative imagery
- **Yearn Finance** — Same vault-product visual language: compact data cards, green as a money-movement signal, and Inter for utility text
- **Coinbase Advanced** — Similar trading-desk dark UI with monospace-leaning typography and Signal-Mint-style accent for active actions

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-abyss: #0a0a0a;
  --color-carbon: #171717;
  --color-graphite: #222222;
  --color-ash: #9b9b9b;
  --color-chalk: #ffffff;
  --color-signal-mint: #3fe280;

  /* Typography — Font Families */
  --font-aeonik: 'Aeonik', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-dm-sans: 'DM Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.43;
  --tracking-caption: 0.7px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: 0.8px;
  --text-subheading: 20px;
  --leading-subheading: 1.4;
  --tracking-subheading: 1px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.33;
  --tracking-heading-sm: 1.2px;
  --text-heading: 36px;
  --leading-heading: 1.11;
  --tracking-heading: 1.8px;
  --text-display: 72px;
  --leading-display: 1;
  --tracking-display: -1.8px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;

  /* Spacing */
  --spacing-unit: 8px;
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-112: 112px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 48-64px;
  --card-padding: 16px;
  --element-gap: 16px;

  /* Border Radius */
  --radius-md: 6px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-full: 64px;
  --radius-full-2: 9999px;

  /* Named Radii */
  --radius-cards: 12px;
  --radius-pills: 9999px;
  --radius-buttons: 16px;
  --radius-herobutton: 64px;

  /* Shadows */
  --shadow-subtle: rgba(24, 39, 75, 0.08) 0px 2px 3px 0px;

  /* Surfaces */
  --surface-abyss: #0a0a0a;
  --surface-carbon: #171717;
  --surface-graphite: #222222;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-abyss: #0a0a0a;
  --color-carbon: #171717;
  --color-graphite: #222222;
  --color-ash: #9b9b9b;
  --color-chalk: #ffffff;
  --color-signal-mint: #3fe280;

  /* Typography */
  --font-aeonik: 'Aeonik', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-dm-sans: 'DM Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.43;
  --tracking-caption: 0.7px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: 0.8px;
  --text-subheading: 20px;
  --leading-subheading: 1.4;
  --tracking-subheading: 1px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.33;
  --tracking-heading-sm: 1.2px;
  --text-heading: 36px;
  --leading-heading: 1.11;
  --tracking-heading: 1.8px;
  --text-display: 72px;
  --leading-display: 1;
  --tracking-display: -1.8px;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-112: 112px;

  /* Border Radius */
  --radius-md: 6px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-full: 64px;
  --radius-full-2: 9999px;

  /* Shadows */
  --shadow-subtle: rgba(24, 39, 75, 0.08) 0px 2px 3px 0px;
}
```
