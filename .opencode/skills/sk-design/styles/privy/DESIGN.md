# Privy — Style Reference
> ink-on-marble editorial spread. White marble canvas, black serif headlines compressed tight, a single violet banner cutting across the top — restraint as authority.

**Theme:** light

Privy operates as an editorial crypto-fintech system: a near-monochrome canvas interrupted by a single vivid violet announcement band and one heavy near-black button. Typography carries the brand more than color — a custom display face (ABC Favorit) sets headlines in weight 400 at remarkably tight tracking (-0.03em) and very tight line-heights (1.03–1.15), giving even the 56px+ words a compressed, journalistic presence rather than a tech-SaaS feel. Surfaces stay flat and high-contrast: white canvas, near-black ink (#010110) for body and primary actions, with dark mode introduced selectively as full-bleed bands rather than a themable surface. Components are minimal — pill buttons (100px radius), 8px-radius cards, 1px hairline borders — letting the custom serif and the violet accent do the heavy lifting.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Canvas | `#ffffff` | `--color-canvas` | Page background, card surfaces, input fields — the dominant neutral that everything else sits on |
| Obsidian Ink | `#010110` | `--color-obsidian-ink` | Primary text, nav borders, icon strokes, filled primary buttons, input borders — the structural near-black that reads as pure black at body sizes |
| Carbon | `#111117` | `--color-carbon` | Dark-mode card surfaces, elevated dark panels, secondary dark backgrounds |
| Graphite | `#22222a` | `--color-graphite` | Highest elevation in dark mode — feature card backgrounds, overlaid panels |
| Fog | `#73737c` | `--color-fog` | Muted helper text, secondary body copy, subtle borders — the only neutral that drops to medium contrast intentionally |
| Ash | `#d9d9d9` | `--color-ash` | Decorative dot pattern, hairline dividers, inactive surface washes |
| Iris Pulse | `#635bff` | `--color-iris-pulse` | Announcement bar fill, link hover states, the single chromatic accent — violet against monochrome creates a strobe effect that draws the eye to time-sensitive copy |
| Deep Teal | `#072723` | `--color-deep-teal` | Decorative illustration fills, abstract graphic washes inside hero imagery — carries no UI function, lives only in artwork |

## Tokens — Typography

### sans-serif — sans-serif — detected in extracted data but not described by AI · `--font-sans-serif`
- **Weights:** 400
- **Sizes:** 12px
- **Line height:** 1.2
- **Role:** sans-serif — detected in extracted data but not described by AI

### ABC Favorit Variable — Display and heading face — used for hero headlines (52–76px), section headings (26–28px), and the occasional large inline link. The weight-400 setting is anti-convention: most fintech sites use 600–700 for headlines, but Favorit's high-contrast serifs at regular weight deliver authority through typographic personality rather than stroke weight. Letter-spacing -0.03em at 56px gives a compressed, editorial feel — words read as dense blocks of ink. · `--font-abc-favorit-variable`
- **Substitute:** GT Super, Tiempos Headline, or Source Serif 4 (closest free match for the high-contrast serif feel)
- **Weights:** 400
- **Sizes:** 16px, 26px, 28px, 52px, 56px, 76px
- **Line height:** 1.03–1.29
- **Letter spacing:** -0.03em at all display sizes (≈ -1.68px at 56px, -2.28px at 76px)
- **Role:** Display and heading face — used for hero headlines (52–76px), section headings (26–28px), and the occasional large inline link. The weight-400 setting is anti-convention: most fintech sites use 600–700 for headlines, but Favorit's high-contrast serifs at regular weight deliver authority through typographic personality rather than stroke weight. Letter-spacing -0.03em at 56px gives a compressed, editorial feel — words read as dense blocks of ink.

### Inter — Body, UI, and navigation face — used for paragraphs (16–18px), nav items (14–15px), buttons (14–16px), captions (12–13px), and the occasional subheading (20–21px). Weight 500 for emphasized inline text, 700 reserved for small-caps-style labels and tag-like UI. Letter-spacing -0.02em tightens the geometric sans so it doesn't feel too generic next to Favorit. · `--font-inter`
- **Substitute:** Inter (already Google-hosted)
- **Weights:** 400, 500, 700
- **Sizes:** 12px, 13px, 14px, 15px, 16px, 17px, 18px, 20px, 21px, 38px
- **Line height:** 1.20–1.90
- **Letter spacing:** -0.02em (≈ -0.28px at 14px, -0.32px at 16px, -0.36px at 18px)
- **Role:** Body, UI, and navigation face — used for paragraphs (16–18px), nav items (14–15px), buttons (14–16px), captions (12–13px), and the occasional subheading (20–21px). Weight 500 for emphasized inline text, 700 reserved for small-caps-style labels and tag-like UI. Letter-spacing -0.02em tightens the geometric sans so it doesn't feel too generic next to Favorit.

### ABC Favorit Unlicensed Trial — ABC Favorit Unlicensed Trial — detected in extracted data but not described by AI · `--font-abc-favorit-unlicensed-trial`
- **Weights:** 400
- **Sizes:** 56px
- **Line height:** 1.07
- **Letter spacing:** -0.03
- **Role:** ABC Favorit Unlicensed Trial — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.4 | -0.24px | `--text-caption` |
| body-sm | 14px | 1.5 | -0.28px | `--text-body-sm` |
| body | 16px | 1.5 | -0.32px | `--text-body` |
| subheading | 20px | 1.4 | -0.4px | `--text-subheading` |
| heading-sm | 26px | 1.13 | -0.78px | `--text-heading-sm` |
| heading | 38px | 1.15 | -1.14px | `--text-heading` |
| heading-lg | 56px | 1.07 | -1.68px | `--text-heading-lg` |
| display | 76px | 1.03 | -2.28px | `--text-display` |

## Tokens — Spacing & Shapes

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 5 | 5px | `--spacing-5` |
| 6 | 6px | `--spacing-6` |
| 8 | 8px | `--spacing-8` |
| 10 | 10px | `--spacing-10` |
| 12 | 12px | `--spacing-12` |
| 15 | 15px | `--spacing-15` |
| 16 | 16px | `--spacing-16` |
| 17 | 17px | `--spacing-17` |
| 19 | 19px | `--spacing-19` |
| 20 | 20px | `--spacing-20` |
| 24 | 24px | `--spacing-24` |
| 28 | 28px | `--spacing-28` |
| 30 | 30px | `--spacing-30` |
| 32 | 32px | `--spacing-32` |
| 70 | 70px | `--spacing-70` |

### Border Radius

| Element | Value |
|---------|-------|
| nav | 8px |
| tags | 9999px |
| cards | 8px |
| images | 8px |
| buttons | 100px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 24px
- **Element gap:** 12-16px

## Components

### Primary Filled Button
**Role:** Main action button — 'Get started' in the hero

Fill #010110, text #ffffff at 15px Inter weight 500, letter-spacing -0.02em. Padding 12px 20px. Radius 100px (full pill). No border. No shadow — the dark fill against white canvas is the elevation. Arrow icon (→) at 14px in the same color as text, 6px gap from label.

### Ghost Outline Button
**Role:** Secondary action — 'Talk to sales', 'Learn more'

Transparent fill, 1px border in #010110. Text #010110 at 15px Inter weight 500. Padding 12px 20px. Radius 100px. On hover: fill #010110, text inverts to #ffffff.

### Pill Link Button (Header)
**Role:** Inline link styled as pill — 'Learn more' in announcement bar

Transparent fill, 1px border in #ffffff. Text #ffffff at 13–14px Inter. Padding 6px 14px. Radius 100px.

### Announcement Bar
**Role:** Top-of-page banner with time-sensitive copy

Full-width band, fill #635bff (Iris Pulse violet). Text #ffffff at 13px Inter weight 500, centered. Inline pill link on the right with 1px white border. Padding 10px 24px. The violet against the white canvas below creates the only chromatic break in the system.

### Navigation Bar
**Role:** Primary site navigation

White background (#ffffff), 1px bottom border in #010110 at 10–20% opacity. Logo left (16px Inter weight 700, #010110), nav links center (15px Inter weight 400, #010110, 10px row-gap between icon+label clusters). Right cluster: text links + outlined 'Log in' button (1px #010110 border, 100px radius, 15px Inter). Height ~64px.

### Dark Feature Card
**Role:** Three-up grid card in dark sections ('Secure by design', 'Whitelabel and modular', 'Scales as you grow')

Background #22222a (Graphite) on a #111117 (Carbon) section background — subtle 1-tone separation. 8px radius. Padding 24–32px. 3D isometric illustration at top in #333333-to-#444444 line art. Heading in Inter weight 500 at 18–20px, #ffffff. Body in Inter weight 400 at 14–15px, #73737c (Fog). No border, no shadow.

### Phone Mockup Card
**Role:** Product UI shown over hero artwork

White device frame with 24–32px radius. Internal UI uses #ffffff background, #010110 text, 8px radii for inner elements. Sits over a textured green/teal abstract background with subtle gradient washes.

### Dashboard Preview Panel
**Role:** Desktop product screenshot overlay in hero

White surface (#ffffff) with 8px radius. Internal cards use #ffffff on #f7f7f7 backgrounds. Data tables with 1px #d9d9d9 row dividers. Mini chart elements use #635bff stroke for accent lines on a #ffffff background.

### Footer
**Role:** Site footer with link columns and decorative pattern

White background with a light dotted/halftone pattern overlay in #d9d9d9 at 20% opacity covering the upper half. Four-column link grid: headings 14px Inter weight 700 #010110, links 14px Inter weight 400 #73737c, 10px row-gap. Bottom row: copyright + social icons (16px, #010110) + brand quote in 14px Inter.

### Text Link
**Role:** Inline and standalone links

Color #010110, no underline by default. 1px underline appears on hover. Arrow glyph (→) in same color, used for directional/CTA links. Transitions are 150ms ease.

### Logo Wordmark
**Role:** Brand mark in nav and footer

Small dot (8px circle #010110) + 'privy' in Inter weight 700 at 16px, #010110, letter-spacing -0.02em. Optional '/stripe company' suffix at 13px Inter weight 400 in #73737c.

## Do's and Don'ts

### Do
- Use ABC Favorit (or GT Super / Source Serif 4 substitute) for all display headlines 26px and above — never substitute Inter at display sizes, the typographic contrast is the brand
- Set display headlines at weight 400 with -0.03em letter-spacing and line-height 1.03–1.15 — the tight tracking and light weight are the signature, do not bold them
- Use #010110 (Obsidian Ink) for all filled primary buttons, not #635bff — the violet is reserved for the announcement bar and links only
- Reserve #635bff (Iris Pulse) for exactly three contexts: announcement bar fill, inline link hover, and decorative chart strokes — never use it for body text, borders, or large fills
- Use pill radius (100px) for all buttons and tags, 8px radius for all cards and images, 2px for icons — do not mix additional radius values into the system
- Use hairline 1px borders in #010110 at reduced opacity for dividers and card edges, not colored borders or shadows for separation
- Place the Iris Pulse announcement bar as a full-bleed band above the nav, not inside it — the chromatic break must hit before any other UI

### Don't
- Do not use #635bff as a CTA button fill — the primary action is always #010110; violet belongs only in the announcement band and link contexts
- Do not set headlines in Inter at 40px+ — the custom serif (or its substitute) is mandatory for display sizes
- Do not add drop shadows to cards or buttons — the system relies on flat surfaces, hairline borders, and background tone shifts for hierarchy
- Do not introduce additional accent colors (greens, blues, oranges) — the palette is monochrome plus one violet, period
- Do not use letter-spacing above -0.02em for body text or above -0.03em for display — the system is aggressively tight-tracked
- Do not use the dark surface palette (#111117, #22222a) on light-mode pages — dark is a sectional choice, not a theme toggle
- Do not mix radius values between 8px and 100px — cards and images get exactly 8px, buttons and tags get exactly 100px

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas | `#ffffff` | Primary page background, dominant surface |
| 1 | Card | `#ffffff` | Product preview cards, dashboard panels — same as canvas with 8px radius and internal structure |
| 2 | Subtle Wash | `#d9d9d9` | Decorative pattern overlay, hairline dividers, inactive states |
| 3 | Carbon | `#111117` | Dark mode section background — full-bleed band |
| 4 | Graphite | `#22222a` | Dark mode elevated card — one tone above Carbon |

## Elevation

Elevation is communicated through background tone shifts and hairline borders, never shadows. Dark mode uses a two-tone stack (#111117 base → #22222a cards) for depth. Light mode relies on the contrast between #ffffff cards and #d9d9d9 decorative patterns. This flatness is deliberate — it keeps focus on the custom display typography.

## Imagery

Imagery is minimal and editorial: a single large abstract green/teal painted wash appears in the hero behind phone mockups, giving the only organic texture on the page. The dark feature section uses 3D isometric line-art illustrations in near-black-on-near-black (#333–#444 on #22222a) — these are geometric, architectural, not playful. Product mockups (phone and dashboard) are shown at a slight angle, overlapping the abstract wash, with realistic UI inside white frames. Iconography is monochrome outlined at 16–20px, stroke weight 1.5px. No photography, no lifestyle imagery, no decorative gradients.

## Layout

Max-width 1200px centered content with full-bleed background bands. The hero uses a two-column split: left half holds the headline (Favorit 56–76px), subtext (Inter 18px), and dual CTAs (filled + ghost, pill-shaped); right half is dominated by the abstract painted wash with overlapping phone and dashboard mockups. Below the hero, a horizontal logo strip of partner brands on white. Mid-page switches to a full-bleed dark section with centered headline and a 3-column feature card grid. Footer returns to white with a dotted halftone pattern across the upper portion and a 4-column link grid. Section gaps are ~80px. The layout rhythm alternates white → dark band → white, with the dark band as the only tonal break.

## Agent Prompt Guide

Quick Color Reference:
- text: #010110 (Obsidian Ink)
- background: #ffffff (Canvas)
- border: #010110 at 1px (hairline)
- accent: #635bff (Iris Pulse — announcement bar and links only)
- muted text: #73737c (Fog)
- primary action: #010110 (filled action)

3-5 Example Component Prompts:
1. Create a hero section: white #ffffff background, max-width 1200px centered. Headline in ABC Favorit weight 400, 56px, #010110, letter-spacing -1.68px, line-height 1.07. Subtext in Inter weight 400, 18px, #73737c. primary action: #010110 (filled action)
2. Create a dark feature section: full-bleed #111117 background, centered headline in ABC Favorit weight 400, 38px, #ffffff, letter-spacing -1.14px. Below: a 3-column grid of dark feature cards. Each card: #22222a background, 8px radius, padding 24px. Isometric line-art icon at top in #444444 strokes. Card heading in Inter weight 500, 18px, #ffffff. Card body in Inter weight 400, 14px, #73737c.
3. Create a top announcement bar: full-width #635bff background, padding 10px 24px, centered text in Inter weight 500, 13px, #ffffff reading an announcement. Right-aligned inline pill link: transparent fill, 1px #ffffff border, #ffffff text 13px Inter, padding 6px 14px, radius 100px, with a → arrow glyph.
4. Create a footer: white #ffffff background with a #d9d9d9 dotted halftone pattern at 20% opacity covering the top 60%. Below: a 4-column grid of link groups. Group headings in Inter weight 700, 14px, #010110. Links in Inter weight 400, 14px, #73737c, row-gap 10px. Bottom row: copyright in Inter 12px #73737c, social icons (16px, #010110) right-aligned.
5. Create a navigation bar: white #ffffff background, 1px bottom border in #010110 at 15% opacity, height 64px. Logo left: 8px black dot + 'privy' in Inter weight 700, 16px, #010110. Center nav: 4 items, each with a 14px icon above a 13px Inter label, 10px row-gap, #010110. Right cluster: 'Docs' and 'Demo' text links in Inter 14px #010110, then a 'Log in' ghost pill button: transparent fill, 1px #010110 border, 15px Inter weight 500, padding 8px 18px, radius 100px.

## Similar Brands

- **Stripe** — Same near-monochrome palette with a single accent color, same custom-feeling display type, same pill buttons and restrained flat surfaces
- **Linear** — Both use a single chromatic accent against a monochrome canvas, both favor custom display type over system fonts, both keep components flat and minimal
- **Vercel** — Same editorial-restraint aesthetic: black-and-white default, high-contrast typography, hairline borders, no decorative shadows
- **Plaid** — Similar fintech infrastructure positioning expressed through editorial type and monochrome surfaces with a single blue accent
- **Rainbow (Web3 wallet)** — Same crypto-infrastructure audience, same product-mockup-over-abstract-graphic hero treatment

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-canvas: #ffffff;
  --color-obsidian-ink: #010110;
  --color-carbon: #111117;
  --color-graphite: #22222a;
  --color-fog: #73737c;
  --color-ash: #d9d9d9;
  --color-iris-pulse: #635bff;
  --color-deep-teal: #072723;

  /* Typography — Font Families */
  --font-sans-serif: 'sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-abc-favorit-variable: 'ABC Favorit Variable', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-abc-favorit-unlicensed-trial: 'ABC Favorit Unlicensed Trial', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.4;
  --tracking-caption: -0.24px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.5;
  --tracking-body-sm: -0.28px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.32px;
  --text-subheading: 20px;
  --leading-subheading: 1.4;
  --tracking-subheading: -0.4px;
  --text-heading-sm: 26px;
  --leading-heading-sm: 1.13;
  --tracking-heading-sm: -0.78px;
  --text-heading: 38px;
  --leading-heading: 1.15;
  --tracking-heading: -1.14px;
  --text-heading-lg: 56px;
  --leading-heading-lg: 1.07;
  --tracking-heading-lg: -1.68px;
  --text-display: 76px;
  --leading-display: 1.03;
  --tracking-display: -2.28px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-5: 5px;
  --spacing-6: 6px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-15: 15px;
  --spacing-16: 16px;
  --spacing-17: 17px;
  --spacing-19: 19px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-28: 28px;
  --spacing-30: 30px;
  --spacing-32: 32px;
  --spacing-70: 70px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 24px;
  --element-gap: 12-16px;

  /* Border Radius */
  --radius-sm: 2px;
  --radius-lg: 8px;
  --radius-lg-2: 10.2px;
  --radius-3xl: 41px;
  --radius-full: 48px;
  --radius-full-2: 100px;
  --radius-full-3: 951px;

  /* Named Radii */
  --radius-nav: 8px;
  --radius-tags: 9999px;
  --radius-cards: 8px;
  --radius-images: 8px;
  --radius-buttons: 100px;

  /* Surfaces */
  --surface-canvas: #ffffff;
  --surface-card: #ffffff;
  --surface-subtle-wash: #d9d9d9;
  --surface-carbon: #111117;
  --surface-graphite: #22222a;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-canvas: #ffffff;
  --color-obsidian-ink: #010110;
  --color-carbon: #111117;
  --color-graphite: #22222a;
  --color-fog: #73737c;
  --color-ash: #d9d9d9;
  --color-iris-pulse: #635bff;
  --color-deep-teal: #072723;

  /* Typography */
  --font-sans-serif: 'sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-abc-favorit-variable: 'ABC Favorit Variable', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-abc-favorit-unlicensed-trial: 'ABC Favorit Unlicensed Trial', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.4;
  --tracking-caption: -0.24px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.5;
  --tracking-body-sm: -0.28px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.32px;
  --text-subheading: 20px;
  --leading-subheading: 1.4;
  --tracking-subheading: -0.4px;
  --text-heading-sm: 26px;
  --leading-heading-sm: 1.13;
  --tracking-heading-sm: -0.78px;
  --text-heading: 38px;
  --leading-heading: 1.15;
  --tracking-heading: -1.14px;
  --text-heading-lg: 56px;
  --leading-heading-lg: 1.07;
  --tracking-heading-lg: -1.68px;
  --text-display: 76px;
  --leading-display: 1.03;
  --tracking-display: -2.28px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-5: 5px;
  --spacing-6: 6px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-15: 15px;
  --spacing-16: 16px;
  --spacing-17: 17px;
  --spacing-19: 19px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-28: 28px;
  --spacing-30: 30px;
  --spacing-32: 32px;
  --spacing-70: 70px;

  /* Border Radius */
  --radius-sm: 2px;
  --radius-lg: 8px;
  --radius-lg-2: 10.2px;
  --radius-3xl: 41px;
  --radius-full: 48px;
  --radius-full-2: 100px;
  --radius-full-3: 951px;
}
```
