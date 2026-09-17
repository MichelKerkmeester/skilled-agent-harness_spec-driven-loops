# Quo (formerly OpenPhone) — Style Reference
> highlighter on newsprint — a single chartreuse stroke against stark black-and-white editorial layout.

**Theme:** light

Quo runs on an almost ruthlessly monochromatic system — white and off-white canvases, black ink, hairline borders, near-zero elevation — with a single chartreuse accent that behaves like a highlighter, not a decoration. Headlines are editorial in scale (Roobert at up to 88px, tight -0.02em tracking) while UI stays compact in Inter, producing a newspaper-meets-app rhythm: massive confident display type above dense functional surfaces. Components are flat and rectangular with 10px corners; depth is communicated by product screenshots and one soft shadow rather than stacking. The chartreuse (#edfc47) never fills a button — it highlights words inside headlines, tags icons, and draws the eye to emphasis, making the primary action (a black filled button) feel like the default rather than a colorful exception.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Newsprint | `#f7f6f5` | `--color-newsprint` | Page canvas and ambient background — warm off-white that softens the stark black type |
| Paper | `#ffffff` | `--color-paper` | Card surfaces, product screenshot frames, nav background — the raised, clean tier above the canvas |
| Press Black | `#000000` | `--color-press-black` | High-contrast neutral action fill for primary buttons on light surfaces. |
| Midnight | `#0a0a0c` | `--color-midnight` | Announcement bar and dark band backgrounds — near-black for the slim top promo strip |
| Graphite | `#4d4d4d` | `--color-graphite` | Body text and secondary headings — readable but recedes against Press Black for hierarchy |
| Ash | `#808080` | `--color-ash` | Muted helper text, icon strokes, tertiary metadata |
| Silver | `#cccccc` | `--color-silver` | Hairline borders, dividers, inactive UI edges — the only border color in the system |
| Highlighter | `#edfc47` | `--color-highlighter` | Emphasis accent on words inside headlines, icon fills, tag highlights — chartreuse that never fills a button, only marks what matters |

## Tokens — Typography

### Roobert — All display and heading copy — geometric sans with tight tracking that lets headlines read as editorial blocks. Weight 500 (not 700) keeps the large sizes from feeling like a poster; the restraint is the point. · `--font-roobert`
- **Substitute:** DM Sans, General Sans, or Manrope at matching weights
- **Weights:** 500
- **Sizes:** 20px, 24px, 40px, 48px, 56px, 64px, 88px
- **Line height:** 0.90–1.20
- **Letter spacing:** -0.02em at 48–88px, -0.01em at 20–24px
- **OpenType features:** `"ss01" on, "ss02" on`
- **Role:** All display and heading copy — geometric sans with tight tracking that lets headlines read as editorial blocks. Weight 500 (not 700) keeps the large sizes from feeling like a poster; the restraint is the point.

### Inter — Body, nav, buttons, badges, labels, icons — the workhorse UI face. 400 for body, 500 for nav and labels, 600 for button text and emphasized UI. · `--font-inter`
- **Substitute:** Inter (already free via Google Fonts)
- **Weights:** 400, 500, 600
- **Sizes:** 12px, 14px, 16px, 18px, 20px
- **Line height:** 1.20–1.50
- **Role:** Body, nav, buttons, badges, labels, icons — the workhorse UI face. 400 for body, 500 for nav and labels, 600 for button text and emphasized UI.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| small | 12px | 1.3 | — | `--text-small` |
| caption | 14px | 1.5 | — | `--text-caption` |
| body-sm | 16px | 1.5 | — | `--text-body-sm` |
| body | 18px | 1.5 | — | `--text-body` |
| body-lg | 20px | 1.3 | -0.2px | `--text-body-lg` |
| subheading | 24px | 1.2 | -0.24px | `--text-subheading` |
| heading-sm | 48px | 1.1 | -0.96px | `--text-heading-sm` |
| heading | 56px | 1.1 | -1.12px | `--text-heading` |
| heading-lg | 64px | 1.05 | -1.28px | `--text-heading-lg` |
| display | 88px | 1 | -1.76px | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** comfortable

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
| 64 | 64px | `--spacing-64` |
| 72 | 72px | `--spacing-72` |
| 100 | 100px | `--spacing-100` |
| 128 | 128px | `--spacing-128` |

### Border Radius

| Element | Value |
|---------|-------|
| nav | 6px |
| cards | 10px |
| pills | 100px |
| inputs | 10px |
| buttons | 10px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| lg | `rgba(0, 0, 0, 0.1) 0px 11px 17px -10px` | `--shadow-lg` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 64-80px
- **Card padding:** 24-32px
- **Element gap:** 16px

## Components

### Primary Filled Button
**Role:** Main conversion action (Try for free, Get started)

Black fill (#000000), white text in Inter 600 at 16px, 10px radius, 12px vertical / 20px horizontal padding, no border. The only chromatic-free filled button in the system — when something must be clicked, it's black.

### Ghost Button
**Role:** Secondary action (See how it works, Talk to Sales)

Transparent fill, Press Black text in Inter 500 at 16px, 10px radius, 12px/20px padding, no visible border. Sits beside the primary button with a small play or arrow glyph to signal it opens a demo.

### Nav Login Link
**Role:** Tertiary nav action

Plain Inter 500 text in Press Black at 14px, no fill, no border, 6px radius if it ever wraps a pill. Sits flush in the nav row.

### Announcement Bar
**Role:** Top-of-page promo strip

Midnight (#0a0a0c) full-bleed bar, white Inter 500 text at 14px, a small chartreuse emoji/icon, and a right-side close (×) in white. Sits above the main nav as a separate band.

### Top Navigation Bar
**Role:** Primary site navigation

Paper (#ffffff) background, 6px radius on any bordered element, Inter 500 nav links in Press Black at 14px with dropdown chevrons, Quo wordmark left, login + Talk to Sales + Try for free right. No visible bottom border, floats on the canvas.

### Hero Section
**Role:** Above-the-fold value proposition

Centered on Newsprint canvas. Trust line (★ 4.7 stars, review count) in Inter 500 at 14px. Headline in Roobert 500 at 88px with -1.76px tracking, Press Black, with one or two words wrapped in a chartreuse highlighter rectangle (#edfc47) for emphasis. Subtext in Graphite Inter 400 at 18px. Primary + ghost button pair centered below. Platform availability line in Ash Inter 400 at 14px.

### Product Screenshot Frame
**Role:** App preview shown below the hero

Paper (#ffffff) surface with 10px radius, the single soft shadow (rgba(0,0,0,0.1) 0px 11px 17px -10px), and the full app UI rendered inside. Acts as the visual proof point — the only 'image' most sections need.

### Feature Card (3-Column Grid)
**Role:** Product capability tiles

Paper (#ffffff) card on Newsprint canvas, 10px radius, no shadow, no border, 24-32px internal padding. Headline in Roobert 500 at 24px (-0.24px tracking), Press Black. A small UI illustration or product crop fills the lower half. Cards align in a 3-column grid with 16px gaps.

### Tab/Pill Nav
**Role:** In-section feature switcher

Three pill-shaped tabs (100px radius) in a row: first tab is filled Paper with subtle Silver border and Press Black text, others are ghost with Ash text. 8px vertical / 16px horizontal padding, Inter 500 at 14px.

### Chat Bubble — Sent
**Role:** In-app message UI element

Solid blue fill (#007bff range) with white Inter 400 text at 14px, 10px radius on all corners, 12px padding. Appears inside product screenshots to demo the inbox.

### Chat Bubble — Received
**Role:** In-app message UI element

Light gray fill (#f0f0f0 range) with Press Black text, 10px radius, 12px padding. Pairs with sent bubble to show conversation.

### Logo Bar
**Role:** Social proof / customer logos

Single row of customer logos in Ash (#808080) or Graphite, evenly spaced, centered on a Paper or Newsprint band. Logos are monochrome — no brand color leaks into the system.

### Phone Number Row
**Role:** Trust/feature list item inside a card

Each row pairs a small flag icon, a Press Black phone number in Inter 500 at 16px, and a region label in Ash Inter 400 at 14px. Rows separated by hairline Silver borders, 12-16px vertical padding.

### Stat Card
**Role:** Highlighted metric tile

Paper background, 10px radius, large number in Roobert 500 at 48px in Press Black, label in Ash Inter 400 at 14px below. No border, no shadow.

### Footer Link Column
**Role:** Site footer navigation

Column heading in Inter 600 Press Black at 14px, link list in Inter 400 Graphite at 14px with 8px row gap. No bullets, no underlines until hover.

## Do's and Don'ts

### Do
- Use #edfc47 chartreuse only as an emphasis stroke — a highlight rectangle behind a word in a headline, an icon fill, a tag — never as a button background or large surface fill
- Set headlines in Roobert 500 at 48-88px with -0.02em tracking; the geometric lowercase and tight tracking are what make the editorial scale work
- Use #000000 filled buttons as the only primary action; the system has exactly one button fill color
- Reach for the single soft shadow (rgba(0,0,0,0.1) 0px 11px 17px -10px) only on product screenshot frames; everything else stays flat with a Silver hairline or no border
- Separate type systems by role: Roobert 500 for all headings 20px and above, Inter for everything at 18px and below — never mix them at the same size
- Keep the canvas at #f7f6f5 Newsprint for full-page backgrounds and use #ffffff Paper for cards, nav, and product frames to build the two-tier surface stack
- Use 10px radius for cards and buttons, 6px for nav, 100px for pills — the three radii carry the entire shape language

### Don't
- Don't fill buttons with chartreuse — the accent is for emphasis, not action
- Don't use multiple colors of buttons; the system is monochrome with one accent, so a colored button would break the visual contract
- Don't add colored gradients, drop shadows, or glow effects to UI surfaces — the design is intentionally flat
- Don't set body copy in Roobert; it's a display face and loses legibility under 24px
- Don't use letter-spacing looser than -0.01em on headings — the tight tracking is part of the editorial feel
- Don't introduce a second accent color; even subtle blue/green additions compete with the chartreuse and dilute the system
- Don't stack elevation: no card-on-card, no modals with heavy shadows, no hover-lift transforms — use color contrast and hairline borders instead
- Don't set display headlines below 40px; the Roobert 500 weight needs the scale to register as editorial

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Newsprint | `#f7f6f5` | Page canvas |
| 2 | Paper | `#ffffff` | Cards, nav, product frames |
| 3 | Press Black | `#000000` | Filled buttons, dark CTAs |
| 4 | Midnight | `#0a0a0c` | Announcement bar, dark promo strips |

## Elevation

- **Product screenshot card:** `rgba(0, 0, 0, 0.1) 0px 11px 17px -10px`

## Imagery

Visuals are dominated by product screenshots — the actual Quo app UI rendered inside Paper frames with one soft shadow. No lifestyle photography, no stock imagery, no abstract graphics. The only illustrative element is the chartreuse highlighter rectangle placed over words in headlines, which functions as both decoration and emphasis. Icons throughout the UI are simple line-style glyphs in Press Black or Ash, never multicolored. The product screenshots do the heavy lifting of showing what the product does, while the editorial type and highlighter accents do the brand work.

## Layout

Centered, max-width 1200px page model on a Newsprint (#f7f6f5) canvas. The hero is a centered stack: trust line, 88px headline, subtext, dual-button row, platform line, then a full-width product screenshot frame below. Below the hero, the page settles into a 3-column feature card grid with 16px gaps and generous vertical breathing room (64-80px between sections). Feature card headlines sit top-left in each tile, with a product crop or UI illustration filling the lower half. A logo bar in a single row breaks up the section rhythm. Navigation is a clean top bar with no sticky shadow — it floats on the canvas. The overall rhythm alternates between centered editorial blocks and structured 3-column grids, never side-by-side text+image split layouts.

## Agent Prompt Guide

**Quick Color Reference**
- Text: #000000 (Press Black)
- Background: #f7f6f5 (Newsprint canvas), #ffffff (Paper cards)
- Border: #cccccc (Silver hairlines)
- Accent: #edfc47 (Highlighter — emphasis only)
- Body text: #4d4d4d (Graphite)
- Muted text: #808080 (Ash)
- primary action: #000000 (filled action)

**3-5 Example Component Prompts**

1. Create a Primary Action Button: #000000 background, #ffffff text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.

2. *Create a 3-column feature card row:* Three Paper (#ffffff) cards on a Newsprint canvas, 10px radius, no shadow, 24px internal padding, 16px gap between cards. Each card has a Roobert 500 headline at 24px (-0.24px tracking) in #000000, an Inter 400 description at 16px in #4d4d4d below, and a product UI crop filling the lower 60% of the card. The card headlines are left-aligned, not centered.

3. *Create a top navigation bar:* Paper (#ffffff) background, full-width, 64px tall. Left: Quo wordmark in Roobert 500 at 20px #000000. Center: nav links in Inter 500 at 14px #000000 with small dropdown chevrons. Right: 'Log in' as plain Inter 500 #000000 text, 'Talk to Sales' as ghost button (transparent, #000000 text, 6px radius), 'Try for free' as filled #000000 button with white Inter 600 text, 10px radius. No bottom border.

4. *Create an announcement bar:* Midnight (#0a0a0c) full-bleed strip, 40px tall, centered white text in Inter 500 at 14px reading 'New: Quo's Claude connector →' with a small chartreuse #edfc47 icon to the left and a white × close button to the right.

5. *Create a logo bar:* Single horizontal row of 8-10 customer logos in #808080 Ash, evenly spaced and centered, on a Paper (#ffffff) band with 48px vertical padding. Logos are monochrome — no original brand colors survive. Section heading above in Inter 500 at 14px Ash: 'Powering conversations for 90,000+ businesses'.

## Similar Brands

- **Linear** — Same near-monochromatic palette with a single vivid accent color, flat surfaces, and editorial-scale headlines that prioritize type over chrome
- **Mercury** — Same restrained black-on-warm-white fintech aesthetic with Inter UI type and a quiet, confident tone
- **Vercel** — Same black/white minimalism with precise typographic hierarchy and product-screenshot-as-hero visual strategy
- **Notion** — Same product-UI-screenshot-driven marketing where the app itself is the primary visual asset rather than staged photography
- **Stripe** — Same editorial display type treatment and confidence in letting a single sentence headline carry an entire hero section

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-newsprint: #f7f6f5;
  --color-paper: #ffffff;
  --color-press-black: #000000;
  --color-midnight: #0a0a0c;
  --color-graphite: #4d4d4d;
  --color-ash: #808080;
  --color-silver: #cccccc;
  --color-highlighter: #edfc47;

  /* Typography — Font Families */
  --font-roobert: 'Roobert', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-small: 12px;
  --leading-small: 1.3;
  --text-caption: 14px;
  --leading-caption: 1.5;
  --text-body-sm: 16px;
  --leading-body-sm: 1.5;
  --text-body: 18px;
  --leading-body: 1.5;
  --text-body-lg: 20px;
  --leading-body-lg: 1.3;
  --tracking-body-lg: -0.2px;
  --text-subheading: 24px;
  --leading-subheading: 1.2;
  --tracking-subheading: -0.24px;
  --text-heading-sm: 48px;
  --leading-heading-sm: 1.1;
  --tracking-heading-sm: -0.96px;
  --text-heading: 56px;
  --leading-heading: 1.1;
  --tracking-heading: -1.12px;
  --text-heading-lg: 64px;
  --leading-heading-lg: 1.05;
  --tracking-heading-lg: -1.28px;
  --text-display: 88px;
  --leading-display: 1;
  --tracking-display: -1.76px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;

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
  --spacing-64: 64px;
  --spacing-72: 72px;
  --spacing-100: 100px;
  --spacing-128: 128px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 64-80px;
  --card-padding: 24-32px;
  --element-gap: 16px;

  /* Border Radius */
  --radius-md: 6px;
  --radius-lg: 10px;
  --radius-full: 100px;

  /* Named Radii */
  --radius-nav: 6px;
  --radius-cards: 10px;
  --radius-pills: 100px;
  --radius-inputs: 10px;
  --radius-buttons: 10px;

  /* Shadows */
  --shadow-lg: rgba(0, 0, 0, 0.1) 0px 11px 17px -10px;

  /* Surfaces */
  --surface-newsprint: #f7f6f5;
  --surface-paper: #ffffff;
  --surface-press-black: #000000;
  --surface-midnight: #0a0a0c;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-newsprint: #f7f6f5;
  --color-paper: #ffffff;
  --color-press-black: #000000;
  --color-midnight: #0a0a0c;
  --color-graphite: #4d4d4d;
  --color-ash: #808080;
  --color-silver: #cccccc;
  --color-highlighter: #edfc47;

  /* Typography */
  --font-roobert: 'Roobert', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-small: 12px;
  --leading-small: 1.3;
  --text-caption: 14px;
  --leading-caption: 1.5;
  --text-body-sm: 16px;
  --leading-body-sm: 1.5;
  --text-body: 18px;
  --leading-body: 1.5;
  --text-body-lg: 20px;
  --leading-body-lg: 1.3;
  --tracking-body-lg: -0.2px;
  --text-subheading: 24px;
  --leading-subheading: 1.2;
  --tracking-subheading: -0.24px;
  --text-heading-sm: 48px;
  --leading-heading-sm: 1.1;
  --tracking-heading-sm: -0.96px;
  --text-heading: 56px;
  --leading-heading: 1.1;
  --tracking-heading: -1.12px;
  --text-heading-lg: 64px;
  --leading-heading-lg: 1.05;
  --tracking-heading-lg: -1.28px;
  --text-display: 88px;
  --leading-display: 1;
  --tracking-display: -1.76px;

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
  --spacing-64: 64px;
  --spacing-72: 72px;
  --spacing-100: 100px;
  --spacing-128: 128px;

  /* Border Radius */
  --radius-md: 6px;
  --radius-lg: 10px;
  --radius-full: 100px;

  /* Shadows */
  --shadow-lg: rgba(0, 0, 0, 0.1) 0px 11px 17px -10px;
}
```
