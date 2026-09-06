# Memorisely — Style Reference
> Architect's drafting table on warm parchment — a quiet, monochrome workspace where every element is a typographic decision.

**Theme:** light

Memorisely reads as a typographer's workspace: a warm cream canvas, pure white card surfaces, and a single near-black that serves as both text and primary action. The system is deliberately zero-chromatic — no blue, no green, no accent hue — letting Inter's weight contrast and tight negative tracking carry all hierarchy. Components stay flat and pill-leaning: a floating nav bar, 8px button corners, and 100px-radius interactive elements create a designed-by-a-designer feel without ornament. Separation comes from hairline borders in warm linen (#f2f0e9) and the cream-to-white surface jump, not from shadows or color.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Warm Parchment | `#faf9f6` | `--color-warm-parchment` | Page canvas, body background — the base layer that gives the entire site its designed-by-hand warmth |
| Paper White | `#ffffff` | `--color-paper-white` | Card surfaces, floating navigation, elevated content blocks — pure white sits one step above the cream canvas |
| Soft Linen | `#f2f0e9` | `--color-soft-linen` | Hairline borders, subtle dividers, muted background washes — the warm-tinted replacement for #e5e5e5 |
| Ink Black | `#171717` | `--color-ink-black` | Primary text, primary action button background, strong heading borders — the workhorse near-black that unifies copy and CTAs |
| Jet Black | `#000000` | `--color-jet-black` | Maximum-contrast icon strokes, dense border treatments where absolute weight is needed |
| Carbon | `#212121` | `--color-carbon` | Strong body borders, emphasis dividers — one shade softer than Ink Black for structural lines |
| Stone | `#6e6e6e` | `--color-stone` | Muted body text, secondary copy, ghost link color — the first step down from primary text |
| Ash | `#878787` | `--color-ash` | Tertiary text, helper labels, company-logo grayscale treatment — the quietest readable gray |
| Graphite | `#414141` | `--color-graphite` | Heading borders, emphasis underlines — a mid-dark accent for typographic rules |

## Tokens — Typography

### sans-serif — sans-serif — detected in extracted data but not described by AI · `--font-sans-serif`
- **Weights:** 400
- **Sizes:** 12px
- **Line height:** 1.2
- **Role:** sans-serif — detected in extracted data but not described by AI

### Inter — The sole typeface across the system. Inter at 600/56px (-3.36px tracking) carries the display headline; 500/22px handles section headings; 400/16px is body. The weight ladder stops at 600 — semibold is the ceiling, which keeps the type from feeling corporate or heavy. · `--font-inter`
- **Substitute:** system-ui, -apple-system, 'Segoe UI', sans-serif
- **Weights:** 400, 500, 600
- **Sizes:** 10, 13, 14, 15, 16, 18, 22, 32, 56
- **Line height:** 1.14–1.50
- **Letter spacing:** -0.06em at 56px display, -0.04em at 22–32px headings, normal at body sizes
- **Role:** The sole typeface across the system. Inter at 600/56px (-3.36px tracking) carries the display headline; 500/22px handles section headings; 400/16px is body. The weight ladder stops at 600 — semibold is the ceiling, which keeps the type from feeling corporate or heavy.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| micro | 10px | 1.2 | — | `--text-micro` |
| caption | 13px | 1.5 | — | `--text-caption` |
| body | 16px | 1.45 | — | `--text-body` |
| heading-sm | 18px | 1.38 | -0.72px | `--text-heading-sm` |
| heading | 22px | 1.27 | -0.88px | `--text-heading` |
| heading-lg | 32px | 1.25 | -1.28px | `--text-heading-lg` |
| display | 56px | 1.14 | -3.36px | `--text-display` |

## Tokens — Spacing & Shapes

**Density:** compact

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 6 | 6px | `--spacing-6` |
| 7 | 7px | `--spacing-7` |
| 8 | 8px | `--spacing-8` |
| 10 | 10px | `--spacing-10` |
| 12 | 12px | `--spacing-12` |
| 16 | 16px | `--spacing-16` |
| 20 | 20px | `--spacing-20` |
| 24 | 24px | `--spacing-24` |
| 26 | 26px | `--spacing-26` |
| 32 | 32px | `--spacing-32` |
| 40 | 40px | `--spacing-40` |
| 56 | 56px | `--spacing-56` |
| 64 | 64px | `--spacing-64` |
| 80 | 80px | `--spacing-80` |
| 120 | 120px | `--spacing-120` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 8px |
| badges | 100px |
| buttons | 8px |
| navPill | 100px |
| productCards | 16px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| subtle | `rgba(110, 110, 110, 0.1) 0px 0px 0px 1px, rgba(110, 110, ...` | `--shadow-subtle` |
| lg | `rgba(191, 191, 191, 0.25) 0px 1px 20px 0px` | `--shadow-lg` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 16px
- **Element gap:** 10px

## Components

### Floating Pill Navigation
**Role:** Top-level site navigation

A floating horizontal bar centered on the page, not full-width. White (#ffffff) background, 100px border-radius for a perfect pill, subtle 1px outer ring shadow. Contains the brand mark on the left, nav links (Inter 500, 14px, #171717) centered, and no visible CTAs. Sits 24–32px from the viewport top with generous horizontal margin.

### Primary Dark Button
**Role:** Main call-to-action (Browse bootcamps, Enroll, etc.)

Filled button with #171717 background and #ffffff text. Inter weight 500, 14–15px, padding 10px 20px. 8px border-radius. Subtle outer-ring shadow at rgba(110,110,110,0.1). No hover state shift in color — the contrast against the cream canvas is already the entire statement.

### Ghost Text Link Button
**Role:** Secondary action (Upcoming workshops, Learn more)

No fill, no border. Inter weight 500, 15px, #171717 color, 1px underline offset 4px. Padding 10px 0. Sits beside the primary button at a 12–16px gap. The underline is the affordance — no box, no background.

### New Announcement Pill
**Role:** Inline announcement above the hero headline

Small horizontal pill (100px radius), #171717 background, #ffffff text. Inter weight 500, 12–13px. Contains the word 'New' in a tiny lighter weight, then the announcement copy. Padding 4px 10px. Acts as a typographic label rather than a badge.

### Hero Centered Text Stack
**Role:** Primary above-the-fold content block

Display headline (Inter 600, 56px, -3.36px tracking, #171717) on one or two lines, max-width ~800px, centered. Subtext at 18px, weight 400, #6e6e6, max-width ~560px. Vertical rhythm: 16px between headline and subtext, 24px before the CTA pair, 32px before social proof.

### Social Proof Cluster
**Role:** Trust signal under hero CTAs

Stacked avatar circles (28–32px, slight overlap, 1.5px white border) on the left, then a row of 5 small filled stars (Inter-rendered ★ glyphs or icons) and a rating line like '4.8 (20k+)' in Inter 500, 14px, #171717. Below in smaller text: 'Trusted by 20k+ Designers' at 13px, #6e6e6e.

### Company Logo Strip
**Role:** Enterprise credibility band

Single horizontal row of grayscale corporate logos (IBM, ebay, Netflix, Wise, Shopify, Slack, Google, Atlassian). All rendered in #878787 or #a0a0a0 to strip brand color. Vertically centered with the label 'Upskilling teams in 150+ countries' (Inter 500, 13px, #171717) on the left. Generous horizontal gap (40–64px) between logos.

### Section Heading Pair
**Role:** Section opener for content blocks

Eyebrow label (Inter 500, 12–13px, #171717, often with a small ↗ or → suffix) on top, then a left-aligned heading (Inter 600, 32px, -1.28px tracking, #171717) and an optional subtext (Inter 400, 18px, #6e6e6, max-width ~520px). Stacks vertically with 8–12px gaps between elements.

### LIVE Product Card
**Role:** Workshop/bootcamp preview in a 3-column grid

16px border-radius card with a dark product screenshot as the visual (code editor or video call interface). A small '● LIVE' badge pinned top-left: red dot glyph + 'LIVE' in Inter 500, 12px, #171717 on a white pill. Card has no visible border — the dark image itself defines the card edge. Spacing between cards: 24px column gap, 32px row gap.

### Code Editor Preview Frame
**Role:** Product showcase image

Mac-window chrome (red/yellow/green dots top-left) wrapping a dark-themed VS Code-style editor. Editor background near #1e1e1, syntax highlighting in muted colors. Always contained within a 16px-radius frame, never full-bleed. Sits on a #ffffff card surface to make the dark UI pop.

### Avatar Stack
**Role:** Inline social proof within cards or lists

3–5 overlapping circular avatars (28–32px), each with a 1.5–2px white border (#ffffff) to separate them. Avatars are real photos, not initials. The border color matches the card surface so overlap reads as clean separation regardless of background.

### Star Rating Inline
**Role:** Numeric rating display

Five small filled stars (★) in #171717 at 12–14px, immediately followed by '4.8 (20k+)' in Inter 500 at 13–14px, #171717. Stars are rendered as a single row with 1–2px gaps. No outline, no half-star styling visible — flat filled glyphs only.

## Do's and Don'ts

### Do
- Set the page canvas to #faf9f6 (Warm Parchment) — never use pure white as the page background; pure white is reserved for card surfaces and the floating nav.
- Use #171717 for both primary text and primary action button fills — the shared near-black is what makes the monochrome system feel intentional rather than default.
- Set display headlines to 56px / Inter 600 / -3.36px letter-spacing; the tight negative tracking on large sizes is signature.
- Use 8px border-radius for cards and most buttons, 100px for pills (nav, badges, tags), 16px for product image cards — these three radii cover the entire system.
- Separate sections with 1px #f2f0e9 hairline borders or a cream-to-white surface jump, not with drop shadows.
- Keep all spacing on the 10px element gap / 16px card padding / 80px section gap rhythm; the density should feel compact within components and spacious between them.
- Render all company logos and secondary imagery in grayscale (Ash #878787 range) to preserve the zero-chromatic palette.

### Don't
- Don't introduce any chromatic color — the system is deliberately zero-hue. No blue links, no green success states, no red error accents. Use grayscale weight shifts instead.
- Don't use 0px letter-spacing on display or heading sizes — the negative tracking (-0.04em to -0.06em) is what gives Inter its tightened, premium read at scale.
- Don't apply drop shadows for elevation beyond the three signature uses (nav ring, button ring, product image glow). The system is flat by default.
- Don't set Inter weight above 600 — the weight ladder stops at semibold; going to 700/800 breaks the typographic restraint.
- Don't use border-radius below 8px on interactive elements; 4px or 0px corners will read as a different (sharper, more corporate) system.
- Don't use #ffffff as the page background — it will flatten the warm parchment character of the entire site.
- Don't stack multiple surfaces of the same color (e.g., white card on white section) — the cream-to-white jump is the only surface elevation available.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Warm Parchment | `#faf9f6` | Page canvas — every section sits on this warm cream base |
| 1 | Paper White | `#ffffff` | Card surfaces, floating nav, product preview containers |
| 2 | Linen Wash | `#f2f0e9` | Subtle background tints, soft section dividers |

## Elevation

- **Floating Pill Navigation:** `rgba(110, 110, 110, 0.1) 0px 0px 0px 1px, rgba(110, 110, 110, 0.2) 0px 1px 0px 0px`
- **Primary Dark Button:** `rgba(110, 110, 110, 0.1) 0px 0px 0px 1px, rgba(110, 110, 110, 0.2) 0px 1px 0px 0px`
- **Product Image Cards:** `rgba(191, 191, 191, 0.25) 0px 1px 20px 0px`

## Imagery

The visual language is product-screenshot-led rather than photographic: dark-themed code editor windows (VS Code-style) dominate, shown in realistic workflow states with syntax highlighting and file trees. When people appear, they are candid workshop-style portraits of instructors in home/office settings — natural light, no staging, no lifestyle gloss. All images are contained within 16px-radius frames on white card surfaces, never full-bleed. Icons are minimal line-based monochrome glyphs. No illustrations, no 3D renders, no abstract graphics. The role of imagery is product proof — showing real workflows, real editors, real sessions — not decoration.

## Layout

Max-width 1200px centered on a Warm Parchment (#faf9f6) canvas. The hero is a centered text stack: eyebrow pill → 56px display headline → 18px subtext → dual CTA row (filled + ghost) → social proof cluster → grayscale company logo strip. Below the fold, the layout shifts to left-aligned section heading pairs followed by 3-column product card grids with 24px column gaps and 32px row gaps. The floating pill nav is the only persistent chrome — no full-width header, no sidebar. Section rhythm is consistent: ~80px vertical gap between sections, each section opening with an eyebrow + heading pair. Content density is compact within cards and breathing-room-generous between sections.

## Agent Prompt Guide

**Quick Color Reference**
- Canvas: #faf9f6
- Card surface: #ffffff
- Border / divider: #f2f0e9
- Primary text: #171717
- Muted text: #6e6e6e
- primary action: no distinct CTA color

**3–5 Example Component Prompts**

1. *Floating pill navigation bar*: White (#ffffff) background, 100px border-radius, subtle outer-ring shadow (rgba(110,110,110,0.1) 0 0 0 1px, rgba(110,110,110,0.2) 0 1px 0 0). Centered horizontally, 24px from viewport top, max-width ~640px. Brand mark left in #171717 at 16px Inter 600. Nav links (Inter 500, 14px, #171717) spaced 24px apart in the center.

2. *Hero section*: Warm Parchment (#faf9f6) background. Display headline 'Actionable AI Design Engineering & Vibe Coding Training' in Inter 600, 56px, letter-spacing -3.36px, #171717, centered, max-width 800px. Subtext 18px Inter 400, #6e6e6e, max-width 560px. Below: a small 'New' announcement pill (#171717 bg, #ffffff text, 100px radius) floating above the headline.

No distinct primary action color was observed; use the extracted neutral button treatments instead of inventing a filled CTA color.

4. *LIVE product card grid*: Three columns, 24px gap. Each card is 16px border-radius with no visible border, containing a dark code-editor screenshot (near-black #1e1e10 editor chrome) as the visual. '● LIVE' badge top-left: white pill background, red dot glyph, 'LIVE' in Inter 500 12px #171717.

5. *Section heading pair*: Left-aligned, no centered text below the fold. Eyebrow label in Inter 500 13px #171717 (e.g., 'AI Design Bootcamps ↗'), then heading in Inter 600 32px -1.28px tracking #171717, then optional subtext in Inter 400 18px #6e6e6e. 8px gap between eyebrow and heading, 12px between heading and subtext.

## Similar Brands

- **Linear** — Same near-black text + monochrome palette philosophy with tight typographic tracking, though Linear leans dark-mode-first
- **Vercel** — Shared designer-engineer aesthetic with achromatic palette and large display headlines in a single sans-serif weight
- **Notion** — Warm off-white canvas with hairline borders replacing shadows, and text-as-interface restraint
- **Rauno Freiberg** — Same flat-surface-on-warm-canvas approach with Inter as the sole typeface and zero chromatic color
- **Stripe Press** — Editorial restraint — warm paper background, near-black type, pill-shaped UI elements, and complete absence of accent color

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-warm-parchment: #faf9f6;
  --color-paper-white: #ffffff;
  --color-soft-linen: #f2f0e9;
  --color-ink-black: #171717;
  --color-jet-black: #000000;
  --color-carbon: #212121;
  --color-stone: #6e6e6e;
  --color-ash: #878787;
  --color-graphite: #414141;

  /* Typography — Font Families */
  --font-sans-serif: 'sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-micro: 10px;
  --leading-micro: 1.2;
  --text-caption: 13px;
  --leading-caption: 1.5;
  --text-body: 16px;
  --leading-body: 1.45;
  --text-heading-sm: 18px;
  --leading-heading-sm: 1.38;
  --tracking-heading-sm: -0.72px;
  --text-heading: 22px;
  --leading-heading: 1.27;
  --tracking-heading: -0.88px;
  --text-heading-lg: 32px;
  --leading-heading-lg: 1.25;
  --tracking-heading-lg: -1.28px;
  --text-display: 56px;
  --leading-display: 1.14;
  --tracking-display: -3.36px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-6: 6px;
  --spacing-7: 7px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-26: 26px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-56: 56px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-120: 120px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 16px;
  --element-gap: 10px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-3xl: 24px;
  --radius-3xl-2: 28px;
  --radius-3xl-3: 44px;
  --radius-full: 100px;

  /* Named Radii */
  --radius-cards: 8px;
  --radius-badges: 100px;
  --radius-buttons: 8px;
  --radius-navpill: 100px;
  --radius-productcards: 16px;

  /* Shadows */
  --shadow-subtle: rgba(110, 110, 110, 0.1) 0px 0px 0px 1px, rgba(110, 110, 110, 0.2) 0px 1px 0px 0px;
  --shadow-lg: rgba(191, 191, 191, 0.25) 0px 1px 20px 0px;

  /* Surfaces */
  --surface-warm-parchment: #faf9f6;
  --surface-paper-white: #ffffff;
  --surface-linen-wash: #f2f0e9;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-warm-parchment: #faf9f6;
  --color-paper-white: #ffffff;
  --color-soft-linen: #f2f0e9;
  --color-ink-black: #171717;
  --color-jet-black: #000000;
  --color-carbon: #212121;
  --color-stone: #6e6e6e;
  --color-ash: #878787;
  --color-graphite: #414141;

  /* Typography */
  --font-sans-serif: 'sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-micro: 10px;
  --leading-micro: 1.2;
  --text-caption: 13px;
  --leading-caption: 1.5;
  --text-body: 16px;
  --leading-body: 1.45;
  --text-heading-sm: 18px;
  --leading-heading-sm: 1.38;
  --tracking-heading-sm: -0.72px;
  --text-heading: 22px;
  --leading-heading: 1.27;
  --tracking-heading: -0.88px;
  --text-heading-lg: 32px;
  --leading-heading-lg: 1.25;
  --tracking-heading-lg: -1.28px;
  --text-display: 56px;
  --leading-display: 1.14;
  --tracking-display: -3.36px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-6: 6px;
  --spacing-7: 7px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-26: 26px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-56: 56px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-120: 120px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-3xl: 24px;
  --radius-3xl-2: 28px;
  --radius-3xl-3: 44px;
  --radius-full: 100px;

  /* Shadows */
  --shadow-subtle: rgba(110, 110, 110, 0.1) 0px 0px 0px 1px, rgba(110, 110, 110, 0.2) 0px 1px 0px 0px;
  --shadow-lg: rgba(191, 191, 191, 0.25) 0px 1px 20px 0px;
}
```
