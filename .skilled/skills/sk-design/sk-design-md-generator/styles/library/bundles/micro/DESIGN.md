# Micro — Style Reference
> sunrise over a digital meadow — a calm horizon gradient holding a quiet, ink-on-paper workspace beneath it.

**Theme:** light

Micro is a sunrise productivity workspace: a chromatic blue-to-teal gradient sky opens the page, then drops into a quiet, neutral canvas of warm off-white with a near-black ink text color. The signature typographic move pairs a chunky editorial display face (perfectlyNineties) for oversized headlines with a neutral workhorse (haffer) for the dense product UI — giving marketing pages a magazine-cover gravity and product screens a calm, readable density. Color is used as functional punctuation: one azure blue (#518bdb) for actions, plus a pastel accent system (mint, peach, lavender, teal-mist) for soft surface washes and a small multicolor icon palette (teal, pink, red, orange, green) that signals connectivity and categories. Components are flat-first, bordered and gently shadowed rather than heavily elevated; radii cluster at 8px and 14px, with 18px for the larger product cards. The overall feel is a software product that has been allowed to breathe — open, friendly, slightly nostalgic in its display type, but precise in its data-rich product surfaces.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Ink Black | `#221f1c` | `--color-ink-black` | Primary text, dark CTA backgrounds, dark icon fills — warm near-black rather than neutral black keeps the palette from feeling clinical |
| Paper White | `#f5f5f5` | `--color-paper-white` | Page canvas, card backgrounds, subtle surface fills — the warm off-white that gives the product its paper-like base |
| Pure White | `#ffffff` | `--color-pure-white` | Elevated product card surfaces inside the app UI (inbox, context graph nodes) — one level above Paper White |
| Stone Gray | `#797267` | `--color-stone-gray` | Secondary text, icon strokes, muted body copy — warm gray that stays in the same family as Ink Black |
| Pebble | `#8c8a88` | `--color-pebble` | Tertiary text, disabled states, low-emphasis icons |
| Slate Edge | `#27272a` | `--color-slate-edge` | Hairline borders on cards and inputs, subtle dividers |
| Azure Action | `linear-gradient(to right in oklab, rgb(81, 139, 219) 0%, rgb(54, 186, 184) 100%)` | `--color-azure-action` | Primary action background, focused links, active states, key icon accents — the one chromatic CTA color, vivid enough to register against the warm neutrals; Hero background gradient (Azure Action → Teal Pulse, left to right in oklab) — the signature opening visual |
| Teal Pulse | `#36bab8` | `--color-teal-pulse` | Teal text accent for links, tags, and emphasized short phrases. Do not promote it to the primary CTA color |
| Mint Wash | `#cbfbf1` | `--color-mint-wash` | Soft pastel surface tint for feature cards and highlight washes |
| Peach Wash | `#f8ebd8` | `--color-peach-wash` | Soft pastel surface tint, warm counterpart to Mint Wash |
| Lavender Wash | `#ede9fe` | `--color-lavender-wash` | Soft pastel surface tint for alternate feature blocks |
| Teal Mist | `#cff2ef` | `--color-teal-mist` | Subtle teal-tinted surface, bridges brand teal and neutral canvas |
| Coral Marker | `#ed6d68` | `--color-coral-marker` | Red text accent for links, tags, and emphasized short phrases |
| Amber Marker | `#e5a057` | `--color-amber-marker` | Warm icon accent, category color in the multicolor icon palette |
| Orchid Marker | `#bf89cd` | `--color-orchid-marker` | Purple-toned icon accent, category color, decorative node edges in the context graph |
| Forest Edge | `#1a3a12` | `--color-forest-edge` | Dark green border for the live-product mockup's edge treatment, deep botanical accent |
| Signal Green | `#3a6b2a` | `--color-signal-green` | Green wash for highlight backgrounds, decorative bands, and soft emphasis behind content. Use as a supporting accent, not as a status color |
| Live Lime | `#7efa55` | `--color-live-lime` | Green wash for highlight backgrounds, decorative bands, and soft emphasis behind content. Use as a supporting accent, not as a status color |

## Tokens — Typography

### perfectlyNineties — Display and editorial headlines (hero, section H1/H2, large marketing statements) — a chunky 70s/80s display face that gives the page magazine-cover weight. The 0.02em positive tracking at large sizes is a deliberate anti-trend: most modern display faces go tight, this one breathes open. · `--font-perfectlynineties`
- **Substitute:** Druk Wide, Climate Crisis, Recoleta, or a heavy condensed serif like Playfair Display 900
- **Weights:** 400, 700, 800, 900
- **Sizes:** 14px, 24px, 30px, 36px, 48px, 72px
- **Line height:** 1.00, 1.20, 1.25
- **Letter spacing:** 0.0200em
- **Role:** Display and editorial headlines (hero, section H1/H2, large marketing statements) — a chunky 70s/80s display face that gives the page magazine-cover weight. The 0.02em positive tracking at large sizes is a deliberate anti-trend: most modern display faces go tight, this one breathes open.

### haffer — Primary workhorse for body, UI labels, buttons, nav, product chrome, card content, and the 96px hero brand mark. The tight -0.025em tracking at 24px+ creates compact, confident headings; the 0.10em tracking on 8-10px eyebrow/uppercase labels adds editorial rhythm. · `--font-haffer`
- **Substitute:** Inter, Söhne, General Sans, or Geist Sans
- **Weights:** 400, 500, 600, 700, 900
- **Sizes:** 8px, 9px, 10px, 11px, 12px, 14px, 16px, 18px, 20px, 24px, 96px
- **Line height:** 1.00, 1.25, 1.33, 1.40, 1.43, 1.50, 1.56, 1.63
- **Letter spacing:** -0.0250em at display sizes; 0.10em at micro/eyebrow sizes
- **Role:** Primary workhorse for body, UI labels, buttons, nav, product chrome, card content, and the 96px hero brand mark. The tight -0.025em tracking at 24px+ creates compact, confident headings; the 0.10em tracking on 8-10px eyebrow/uppercase labels adds editorial rhythm.

### ui-monospace — Monospace for timestamps, email addresses, technical metadata in inbox rows, and AI prompt placeholder text. The system-stack choice signals these are data, not prose. · `--font-ui-monospace`
- **Substitute:** JetBrains Mono, IBM Plex Mono, or any system monospace
- **Weights:** 400, 500
- **Sizes:** 8px, 14px, 16px
- **Line height:** 1.43, 1.50, 1.71
- **Role:** Monospace for timestamps, email addresses, technical metadata in inbox rows, and AI prompt placeholder text. The system-stack choice signals these are data, not prose.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| eyebrow | 10px | 1.4 | 1px | `--text-eyebrow` |
| caption | 12px | 1.4 | — | `--text-caption` |
| body-sm | 14px | 1.5 | — | `--text-body-sm` |
| body | 16px | 1.5 | — | `--text-body` |
| subheading | 18px | 1.5 | — | `--text-subheading` |
| heading-sm | 24px | 1.4 | -0.6px | `--text-heading-sm` |
| heading | 30px | 1.25 | 0.6px | `--text-heading` |
| heading-lg | 48px | 1.2 | 0.96px | `--text-heading-lg` |
| display | 72px | 1 | 1.44px | `--text-display` |
| hero-mark | 96px | 1 | -2.4px | `--text-hero-mark` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** compact

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 8 | 8px | `--spacing-8` |
| 12 | 12px | `--spacing-12` |
| 16 | 16px | `--spacing-16` |
| 20 | 20px | `--spacing-20` |
| 24 | 24px | `--spacing-24` |
| 32 | 32px | `--spacing-32` |
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |
| 52 | 52px | `--spacing-52` |
| 64 | 64px | `--spacing-64` |
| 80 | 80px | `--spacing-80` |
| 96 | 96px | `--spacing-96` |
| 128 | 128px | `--spacing-128` |
| 192 | 192px | `--spacing-192` |
| 240 | 240px | `--spacing-240` |

### Border Radius

| Element | Value |
|---------|-------|
| pills | 9999px |
| inputs | 8px |
| buttons | 8px |
| nav-pills | 8px |
| large-cards | 18px |
| small-cards | 14px |
| feature-blocks | 18px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| subtle | `rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.1) 0p...` | `--shadow-subtle` |
| subtle-2 | `oklab(0.241527 0.00279061 0.00670661 / 0.065) 0px 0px 0px...` | `--shadow-subtle-2` |
| subtle-3 | `rgba(0, 0, 0, 0.08) 0px 1px 2px 0px` | `--shadow-subtle-3` |
| md | `rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.1)...` | `--shadow-md` |
| subtle-4 | `rgba(0, 0, 0, 0.2) 0px -2px 0px 0px inset` | `--shadow-subtle-4` |
| md-2 | `oklab(0 0 0 / 0.065) 0px 10px 15px -3px, oklab(0 0 0 / 0....` | `--shadow-md-2` |
| sm | `rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.1) 0...` | `--shadow-sm` |
| subtle-5 | `rgba(0, 0, 0, 0.15) 0px 1px 2px 0px` | `--shadow-subtle-5` |
| subtle-6 | `rgb(212, 212, 212) 0px 1px 0px 0px, rgb(208, 208, 208) 0p...` | `--shadow-subtle-6` |
| subtle-7 | `oklab(0.241527 0.00279061 0.00670661 / 0.1) 0px 0px 0px 1...` | `--shadow-subtle-7` |
| xl | `rgba(0, 0, 0, 0.1) 0px 20px 25px -5px, rgba(0, 0, 0, 0.1)...` | `--shadow-xl` |
| subtle-8 | `rgba(0, 0, 0, 0.15) 0px 1px 2px 0px, rgba(0, 0, 0, 0.04) ...` | `--shadow-subtle-8` |
| subtle-9 | `oklab(0 0 0 / 0.065) 0px 1px 3px 0px, oklab(0 0 0 / 0.065...` | `--shadow-subtle-9` |
| xl-2 | `oklab(0 0 0 / 0.15) 0px 25px 50px -12px` | `--shadow-xl-2` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 64px
- **Card padding:** 16px
- **Element gap:** 8px

## Components

### Dark Filled Button
**Role:** Primary action button on light backgrounds (Sign up, Get started)

Background #221f1c (Ink Black), text #ffffff, radius 8px, padding 10px 16px, haffer 500 at 14px, 1.4 line-height. Optional inset 0 -2px 0 0 rgba(0,0,0,0.2) for pressed state. Inverts to white-on-dark when used on the gradient hero.

### White Filled Button
**Role:** Secondary action on the gradient hero (Talk to sales)

Background #ffffff, text #221f1c, radius 8px, padding 10px 16px, haffer 500 at 14px. No border, no shadow — relies on the gradient backdrop for contrast.

### Ghost Text Button
**Role:** Tertiary / nav action (Log in, Learn more)

Transparent background, text #221f1c (or #ffffff on dark), radius 8px, padding 8px 12px, haffer 500 at 14px. No visible border; relies on hover state to reveal affordance.

### Pill Nav Tab
**Role:** Top-bar navigation items (Product, Resources, Pricing, Careers)

Transparent background, text #221f1c haffer 500 14px, trailing 6px chevron icon in #797267, padding 6px 12px, radius 8px. Active state: #f5f5f5 fill. Lighter and more compact than buttons — nav reads as a row of whispers, not shouts.

### Product Card (App UI)
**Role:** Inbox row, task row, person/company record inside the product

Background #ffffff, border 1px solid rgba(0,0,0,0.065), radius 14px, padding 12px 16px, haffer 400 at 14px for primary text and #797267 for secondary timestamps. Left-side avatar/initial in a 32px circle, optional unread dot in #518bdb.

### Context Graph Node
**Role:** Floating data card in the 'personal context graph' visualization

Background #ffffff, radius 18px, padding 16px, haffer 500-700 at 12-14px, a 2-3px accent border in one of the marker colors (Teal Pulse, Coral Marker, Orchid Marker, Azure Action). Connected by thin 1px lines in #797267 at 0.4 opacity. The accent border color is the categorical signal — same data shape, different domain.

### Soft Pastel Feature Block
**Role:** Marketing feature card with tinted background

Background one of the pastel washes (#cbfbf1, #f8ebd8, #ede9fe, #cff2ef), radius 18px, padding 32px, no border, no shadow. Headline in haffer 600 at 20-24px in #221f1c, supporting body in haffer 400 at 14px in #797267. The pastel fill IS the visual interest — no icons or illustrations needed inside.

### Search / Prompt Input
**Role:** AI ask-bar at top of the product ('Ask Micro AI anything...') and search fields

Background #ffffff, border 1px solid #27272a at low opacity, radius 8px, padding 10px 14px, haffer 400 at 14px, placeholder in #8c8a88. Focus state: 2px ring in #518bdb. Left-side icon (search or sparkle) in #797267, optional right-side mic icon.

### Sidebar Nav Item
**Role:** Left-rail navigation inside the product (Home, Inbox, People, Companies, Tasks)

Transparent background, 20px row height, 12px horizontal padding, radius 8px, 14px haffer 400 in #221f1c. Active state: #f5f5f5 fill, haffer 500 weight. Leading 16px icon in #797267 (active: #221f1c). Generous vertical breathing room — sidebar is quiet chrome, not a feature wall.

### Badge / Tag
**Role:** Category tags, status pills (Important, VIPs, All DMs)

Background transparent or #f5f5f5, text #221f1c, radius 9999px, padding 4px 10px, haffer 500 at 12px. For colored status: background in marker color at 0.15 opacity, text in the same marker color at full opacity. No border.

### Logo Strip
**Role:** Social-proof row of customer/investor logos

Single horizontal row, 5-6 monochrome logos in #221f1c, evenly spaced with 48-64px gap. Each logo is a simple geometric mark + wordmark at 18-20px haffer 600. No background card — logos float on the canvas.

### Floating Audio Player
**Role:** Bottom-right media player widget (New Computer track card)

Background #ffffff, radius 14px, shadow 0px 10px 15px -3px rgba(0,0,0,0.1), padding 8px 12px, 280-320px wide. 40px album art on left, track title in haffer 600 12px #221f1c, artist in haffer 400 10px #797267, transport controls on the right in #797267 with one accent (play) in #221f1c.

### Hero Product Mockup Container
**Role:** The floating app screenshot that overlaps the gradient sky and the green field below the fold

No visible card chrome — the screenshot is presented edge-to-edge with a subtle 0px 10px 15px shadow, 18px corner radius, and a 1px #1a3a12 (Forest Edge) border that gives it a framed-on-the-meadow feel. The border color is the signature: it ties the product UI to the green ground beneath it.

### Section Eyebrow Pill
**Role:** Small label above headlines (e.g., 'Watch the launch video')

Background #ffffff at 0.9 opacity, radius 9999px, padding 4px 12px, haffer 500 at 12px in #221f1c, optional leading icon at 12px. Floats above the headline with 16px gap.

## Do's and Don'ts

### Do
- Use the blue→teal gradient only on the hero; it is the single saturated viewport in the system and defines the brand opening
- Set hero and section display headlines in perfectlyNineties at 30-72px with 0.02em positive tracking — the open tracking is the signature
- Set body and product UI in haffer, not in the display face — the contrast between editorial and neutral is the typographic identity
- Use 8px radius for buttons, inputs, and nav; 14px for product rows; 18px for feature blocks and graph nodes — do not mix freely
- Keep product surfaces #ffffff with a 1px border and the subtle two-layer shadow — never heavy elevation
- Reach for the pastel washes (#cbfbf1, #f8ebd8, #ede9fe, #cff2ef) for marketing feature blocks; let the canvas stay #f5f5f5
- Color icons categorically with Teal Pulse, Coral Marker, Amber Marker, Orchid Marker, and Azure Action — never monochrome the icon set

### Don't
- Do not apply the gradient sky to anything other than the top of the page — repeating it kills the opening impact
- Do not use perfectlyNineties for body text, buttons, nav, or product UI — it is a display face only and will crush at small sizes
- Do not skip the 1px border on product cards — the system relies on hairline edges, not shadows, to define surfaces
- Do not use 4px radius on feature cards or marketing blocks — 4px is reserved for small chrome and icons, the card hierarchy starts at 8px
- Do not introduce new chromatic accents beyond the named marker palette — the multicolor icon system is closed
- Do not center body copy in the product UI — left-align data; the only centered text is the hero headline and section H1s
- Do not use pure black #000000 for text — use #221f1c Ink Black; the warm undertone is part of the paper-on-ink feel

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas | `#f5f5f5` | Page background, the warm off-white base layer |
| 1 | Card | `#ffffff` | Product UI cards, feature blocks, elevated content panels |
| 2 | Pastel Wash | `#cbfbf1` | Soft tinted surface for highlight features and category blocks |
| 3 | Gradient Sky | `#518bdb` | Hero-only gradient background, the one place saturated color fills the viewport |

## Elevation

- **Default card:** `0px 1px 3px rgba(0,0,0,0.1), 0px 1px 2px -1px rgba(0,0,0,0.1)`
- **Bordered card:** `0px 0px 0px 1px oklab(0.24 0.003 0.007 / 0.065), 0px 1px 3px rgba(0,0,0,0.1), 0px 1px 2px -1px rgba(0,0,0,0.1)`
- **Elevated product mockup / floating panel:** `0px 10px 15px -3px rgba(0,0,0,0.1), 0px 4px 6px -4px rgba(0,0,0,0.1)`
- **Pressed button / active link:** `inset 0px -2px 0px 0px rgba(0,0,0,0.2)`

## Imagery

Imagery is sparse and product-led: no lifestyle photography, no stock imagery. The hero is a full-bleed gradient sky over a green field, with a single floating product mockup that overlaps the horizon line — the product is the hero. Subsequent sections rely on large product UI screenshots (inbox, context graph) presented as floating cards with subtle shadows. The context graph is the most distinctive visual: a constellation of white data nodes connected by hairline lines, each node ringed in a different marker color, creating a network-as-illustration effect. Icons are multicolor line-and-fill marks in the brand palette. A small audio player widget (album art + transport) sits in the bottom-right corner as a persistent, almost decorative UI element. No 3D, no illustration system — the visual richness comes from data visualization and product UI itself.

## Layout

Page is max-width ~1200px centered, with the hero breaking full-bleed for the gradient sky. The hero itself is a vertical stack: centered eyebrow pill, centered oversized display headline in perfectlyNineties, centered subhead in haffer, centered button pair, then the product mockup floating at the bottom edge, overlapping the transition to the white canvas below. Below the hero, sections follow a consistent rhythm: centered section H1, centered supporting copy, then content arranged in 2-column (text + visual) or 3-4 column card grids. The context graph section is the most distinctive layout — a wide horizontal data visualization that fills the content width, followed by a 4-column feature grid below it. Social proof is a single centered row of monochrome logos. Navigation is a top bar with a left-aligned wordmark, centered nav pills, and right-aligned auth buttons. The product UI itself, shown in screenshots, has a fixed left sidebar (~200px), a top utility bar, and a main content area — a classic 3-zone productivity app shell.

## Agent Prompt Guide

Quick Color Reference:
- text: #221f1c (Ink Black)
- background: #f5f5f5 (Paper White)
- card surface: #ffffff
- border: #27272a (Slate Edge) at low opacity
- accent: #518bdb (Azure Action)
- primary action: #518bdb (filled action)

Example Component Prompts:

1. Create a hero section: full-bleed blue-to-teal gradient background (linear-gradient(to right, #518bdb, #36bab8)). Centered eyebrow pill (#ffffff at 0.9 opacity, 9999px radius, 12px haffer 500 #221f1c). Headline in perfectlyNineties 700 at 72px, #ffffff, letter-spacing 1.44px, line-height 1.0, reading 'One place for work that works for you'. Subhead in haffer 400 at 18px, #ffffff at 0.9 opacity, line-height 1.5. Button pair: dark filled 'Sign up' (#221f1c bg, #ffffff text, 8px radius, 10px 16px padding) and white filled 'Talk to sales' (#ffffff bg, #221f1c text, same shape). 32px gap between buttons.

2. Create a Primary Action Button: #518bdb background, #f5f5f5 text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.

3. Create a soft pastel feature block: background #cbfbf1 (or rotate through #f8ebd8, #ede9fe, #cff2ef), 18px radius, 32px padding, no border, no shadow. Headline in haffer 600 20px #221f1c, body in haffer 400 14px #797267. Icon optional, 24px, in #221f1c.

4. Create a context graph node: white background, 18px radius, 16px padding, 2px solid border in one marker color (Teal Pulse #36bab8, Coral Marker #ed6d68, or Azure Action #518bdb). Title in haffer 600 12px #221f1c, 2-3 metadata rows in haffer 400 11px #797267. Connect to other nodes with 1px lines in #797267 at 0.4 opacity.

5. Create a search input: white background, 1px border in rgba(0,0,0,0.1), 8px radius, 10px 14px padding, haffer 400 14px, placeholder in #8c8a88. Leading 16px search icon in #797267. Focus state: 2px ring in #518bdb.

## Similar Brands

- **Notion** — Same warm off-white canvas with near-black ink text, product-led hero with a single bold headline, and a similar reliance on subtle 1px borders rather than heavy shadows
- **Linear** — Compact product UI density, dark filled primary buttons on light backgrounds, and a multicolor accent system used categorically across icons and tags
- **Arc Browser** — Bold gradient hero paired with a quieter product surface below, and a willingness to use a distinctive display typeface (not just another geometric sans) for brand personality
- **Figma** — Pastel-tinted feature blocks floating on a neutral canvas, with the product UI itself doing the visual heavy lifting rather than illustration or photography

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-ink-black: #221f1c;
  --color-paper-white: #f5f5f5;
  --color-pure-white: #ffffff;
  --color-stone-gray: #797267;
  --color-pebble: #8c8a88;
  --color-slate-edge: #27272a;
  --color-azure-action: #518bdb;
  --gradient-azure-action: linear-gradient(to right in oklab, rgb(81, 139, 219) 0%, rgb(54, 186, 184) 100%);
  --color-teal-pulse: #36bab8;
  --color-mint-wash: #cbfbf1;
  --color-peach-wash: #f8ebd8;
  --color-lavender-wash: #ede9fe;
  --color-teal-mist: #cff2ef;
  --color-coral-marker: #ed6d68;
  --color-amber-marker: #e5a057;
  --color-orchid-marker: #bf89cd;
  --color-forest-edge: #1a3a12;
  --color-signal-green: #3a6b2a;
  --color-live-lime: #7efa55;

  /* Typography — Font Families */
  --font-perfectlynineties: 'perfectlyNineties', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-haffer: 'haffer', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-ui-monospace: 'ui-monospace', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-eyebrow: 10px;
  --leading-eyebrow: 1.4;
  --tracking-eyebrow: 1px;
  --text-caption: 12px;
  --leading-caption: 1.4;
  --text-body-sm: 14px;
  --leading-body-sm: 1.5;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-subheading: 18px;
  --leading-subheading: 1.5;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.4;
  --tracking-heading-sm: -0.6px;
  --text-heading: 30px;
  --leading-heading: 1.25;
  --tracking-heading: 0.6px;
  --text-heading-lg: 48px;
  --leading-heading-lg: 1.2;
  --tracking-heading-lg: 0.96px;
  --text-display: 72px;
  --leading-display: 1;
  --tracking-display: 1.44px;
  --text-hero-mark: 96px;
  --leading-hero-mark: 1;
  --tracking-hero-mark: -2.4px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
  --font-weight-extrabold: 800;
  --font-weight-black: 900;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-52: 52px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-96: 96px;
  --spacing-128: 128px;
  --spacing-192: 192px;
  --spacing-240: 240px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 64px;
  --card-padding: 16px;
  --element-gap: 8px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-xl: 14px;
  --radius-2xl: 18px;
  --radius-2xl-2: 22px;
  --radius-3xl: 32px;
  --radius-3xl-2: 40px;
  --radius-full: 9999px;

  /* Named Radii */
  --radius-pills: 9999px;
  --radius-inputs: 8px;
  --radius-buttons: 8px;
  --radius-nav-pills: 8px;
  --radius-large-cards: 18px;
  --radius-small-cards: 14px;
  --radius-feature-blocks: 18px;

  /* Shadows */
  --shadow-subtle: rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.1) 0px 1px 2px -1px;
  --shadow-subtle-2: oklab(0.241527 0.00279061 0.00670661 / 0.065) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.1) 0px 1px 2px -1px;
  --shadow-subtle-3: rgba(0, 0, 0, 0.08) 0px 1px 2px 0px;
  --shadow-md: rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.1) 0px 4px 6px -4px;
  --shadow-subtle-4: rgba(0, 0, 0, 0.2) 0px -2px 0px 0px inset;
  --shadow-md-2: oklab(0 0 0 / 0.065) 0px 10px 15px -3px, oklab(0 0 0 / 0.065) 0px 4px 6px -4px;
  --shadow-sm: rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.1) 0px 2px 4px -2px;
  --shadow-subtle-5: rgba(0, 0, 0, 0.15) 0px 1px 2px 0px;
  --shadow-subtle-6: rgb(212, 212, 212) 0px 1px 0px 0px, rgb(208, 208, 208) 0px 4px 0px 0px, rgba(0, 0, 0, 0.1) 0px 4px 4px 0px, rgba(0, 0, 0, 0.12) 0px 8px 16px -4px;
  --shadow-subtle-7: oklab(0.241527 0.00279061 0.00670661 / 0.1) 0px 0px 0px 1px, oklab(0 0 0 / 0.25) 0px 25px 50px -12px;
  --shadow-xl: rgba(0, 0, 0, 0.1) 0px 20px 25px -5px, rgba(0, 0, 0, 0.1) 0px 8px 10px -6px;
  --shadow-subtle-8: rgba(0, 0, 0, 0.15) 0px 1px 2px 0px, rgba(0, 0, 0, 0.04) 0px 0px 0px 3px;
  --shadow-subtle-9: oklab(0 0 0 / 0.065) 0px 1px 3px 0px, oklab(0 0 0 / 0.065) 0px 1px 2px -1px;
  --shadow-xl-2: oklab(0 0 0 / 0.15) 0px 25px 50px -12px;

  /* Surfaces */
  --surface-canvas: #f5f5f5;
  --surface-card: #ffffff;
  --surface-pastel-wash: #cbfbf1;
  --surface-gradient-sky: #518bdb;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-ink-black: #221f1c;
  --color-paper-white: #f5f5f5;
  --color-pure-white: #ffffff;
  --color-stone-gray: #797267;
  --color-pebble: #8c8a88;
  --color-slate-edge: #27272a;
  --color-azure-action: #518bdb;
  --color-teal-pulse: #36bab8;
  --color-mint-wash: #cbfbf1;
  --color-peach-wash: #f8ebd8;
  --color-lavender-wash: #ede9fe;
  --color-teal-mist: #cff2ef;
  --color-coral-marker: #ed6d68;
  --color-amber-marker: #e5a057;
  --color-orchid-marker: #bf89cd;
  --color-forest-edge: #1a3a12;
  --color-signal-green: #3a6b2a;
  --color-live-lime: #7efa55;

  /* Typography */
  --font-perfectlynineties: 'perfectlyNineties', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-haffer: 'haffer', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-ui-monospace: 'ui-monospace', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-eyebrow: 10px;
  --leading-eyebrow: 1.4;
  --tracking-eyebrow: 1px;
  --text-caption: 12px;
  --leading-caption: 1.4;
  --text-body-sm: 14px;
  --leading-body-sm: 1.5;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-subheading: 18px;
  --leading-subheading: 1.5;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.4;
  --tracking-heading-sm: -0.6px;
  --text-heading: 30px;
  --leading-heading: 1.25;
  --tracking-heading: 0.6px;
  --text-heading-lg: 48px;
  --leading-heading-lg: 1.2;
  --tracking-heading-lg: 0.96px;
  --text-display: 72px;
  --leading-display: 1;
  --tracking-display: 1.44px;
  --text-hero-mark: 96px;
  --leading-hero-mark: 1;
  --tracking-hero-mark: -2.4px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-52: 52px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-96: 96px;
  --spacing-128: 128px;
  --spacing-192: 192px;
  --spacing-240: 240px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-xl: 14px;
  --radius-2xl: 18px;
  --radius-2xl-2: 22px;
  --radius-3xl: 32px;
  --radius-3xl-2: 40px;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-subtle: rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.1) 0px 1px 2px -1px;
  --shadow-subtle-2: oklab(0.241527 0.00279061 0.00670661 / 0.065) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.1) 0px 1px 2px -1px;
  --shadow-subtle-3: rgba(0, 0, 0, 0.08) 0px 1px 2px 0px;
  --shadow-md: rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.1) 0px 4px 6px -4px;
  --shadow-subtle-4: rgba(0, 0, 0, 0.2) 0px -2px 0px 0px inset;
  --shadow-md-2: oklab(0 0 0 / 0.065) 0px 10px 15px -3px, oklab(0 0 0 / 0.065) 0px 4px 6px -4px;
  --shadow-sm: rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.1) 0px 2px 4px -2px;
  --shadow-subtle-5: rgba(0, 0, 0, 0.15) 0px 1px 2px 0px;
  --shadow-subtle-6: rgb(212, 212, 212) 0px 1px 0px 0px, rgb(208, 208, 208) 0px 4px 0px 0px, rgba(0, 0, 0, 0.1) 0px 4px 4px 0px, rgba(0, 0, 0, 0.12) 0px 8px 16px -4px;
  --shadow-subtle-7: oklab(0.241527 0.00279061 0.00670661 / 0.1) 0px 0px 0px 1px, oklab(0 0 0 / 0.25) 0px 25px 50px -12px;
  --shadow-xl: rgba(0, 0, 0, 0.1) 0px 20px 25px -5px, rgba(0, 0, 0, 0.1) 0px 8px 10px -6px;
  --shadow-subtle-8: rgba(0, 0, 0, 0.15) 0px 1px 2px 0px, rgba(0, 0, 0, 0.04) 0px 0px 0px 3px;
  --shadow-subtle-9: oklab(0 0 0 / 0.065) 0px 1px 3px 0px, oklab(0 0 0 / 0.065) 0px 1px 2px -1px;
  --shadow-xl-2: oklab(0 0 0 / 0.15) 0px 25px 50px -12px;
}
```
