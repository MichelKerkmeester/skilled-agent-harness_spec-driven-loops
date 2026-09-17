# Visual — Style Reference
> Warm editorial zine. Cream paper, serif posters, mono marginalia, a single yellow highlighter mark.

**Theme:** light

Visual speaks an editorial design dialect: a warm cream canvas (#f6f6f4) holds a high-contrast modern serif at near-poster sizes (64–96px) paired with monospaced UI text at 12–16px. The palette is near-monochrome — warm blacks, olive-sage neutrals, and a single vivid yellow (#fff347) deployed as decorative punctuation on accent bars and highlight washes. Surfaces stay flat with hairline 1px borders; visual hierarchy comes from color contrast and generous 80px section gaps, never from shadows. Components are lightweight and geometric: 8px-radius cards, 3px-radius nav, tiny all-caps mono labels, and a neutral dark button that reads as 'next' rather than 'buy now'. The overall feel is a design museum catalog that happens to contain a product — confident, restrained, and slightly cerebral.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Vellum | `#f6f6f4` | `--color-vellum` | Page background — the warm off-white that defines the entire canvas tone |
| Paper | `#ffffff` | `--color-paper` | Card surfaces, elevated panels, product mockup backgrounds |
| Ink | `#000000` | `--color-ink` | Primary text, heavy structural borders, nav bar outlines |
| Carbon | `#2c2c26` | `--color-carbon` | Warm near-black for dark panels, footer background, and neutral filled button fill — the only filled button in the system |
| Ash | `#d0d0c8` | `--color-ash` | Light hairline borders, card outlines, subtle dividers |
| Olive Char | `#57584b` | `--color-olive-char` | Mid-dark structural borders, heavier dividers between sections |
| Lichen | `#6d6e5e` | `--color-lichen` | Body text, secondary borders, muted paragraph copy |
| Sage | `#979886` | `--color-sage` | Nav link text, muted UI labels, breadcrumb text |
| Moss | `#aaab9c` | `--color-moss` | Icon strokes and fills, tertiary text, decorative icon tint |
| Bone | `#e8e7d9` | `--color-bone` | Subtle warm tint surface for tag backgrounds, soft highlight washes |
| Highlighter Yellow | `#fff347` | `--color-highlighter-yellow` | Single accent — decorative bars, highlight washes, emphasis marks. Appears 3–4 times per page maximum, always as a 4–6px stroke or small fill block |
| Khaki Olive | `#aaa674` | `--color-khaki-olive` | Muted accent for tag borders, secondary button outlines, warm-tinted surface washes — the restrained sibling of the highlighter |

## Tokens — Typography

### Serif (custom — resembles a high-contrast modern editorial serif like Reckless Neue, GT Sectra, or PP Editorial New) — All display and heading copy. Used at poster sizes (64–96px) for hero headlines and product section titles. The weight 300 at 96px is the signature move — whisper-thin strokes at near-poster scale create authority through restraint, not volume. Tight tracking (-0.05em) at all sizes; line-heights under 1.1 let letterspacing do the vertical work · `--font-serif-custom-resembles-a-high-contrast-modern-editorial-serif-like-reckless-neue-gt-sectra-or-pp-editorial-new`
- **Substitute:** Fraunces (Google Fonts) — closest free match for the modern editorial feel. Instrument Serif as a lighter alternative
- **Weights:** 300, 400
- **Sizes:** 24, 32, 48, 64, 96
- **Line height:** 0.94–1.13
- **Letter spacing:** -0.05em at 24px and above (-1.2px at 24px, -4.8px at 96px)
- **Role:** All display and heading copy. Used at poster sizes (64–96px) for hero headlines and product section titles. The weight 300 at 96px is the signature move — whisper-thin strokes at near-poster scale create authority through restraint, not volume. Tight tracking (-0.05em) at all sizes; line-heights under 1.1 let letterspacing do the vertical work

### Mono (custom — clean geometric monospace) — All UI text: navigation, buttons, labels, body copy, metadata, footer links. The mono choice is deliberate — it makes every UI element feel like terminal output or code annotation, contrasting the serif's editorial softness. Weight 400 dominates; 500 for button text; 300 reserved for large mono headings (28–48px range) · `--font-mono-custom-clean-geometric-monospace`
- **Substitute:** IBM Plex Mono (Google Fonts) — closest free match. JetBrains Mono as alternative
- **Weights:** 300, 400, 500
- **Sizes:** 12, 14, 16, 20, 28, 48
- **Line height:** 1.00, 1.33, 1.41, 1.50
- **Letter spacing:** -0.067em for 12–16px body and nav text; -0.025em for 20px+ mono
- **Role:** All UI text: navigation, buttons, labels, body copy, metadata, footer links. The mono choice is deliberate — it makes every UI element feel like terminal output or code annotation, contrasting the serif's editorial softness. Weight 400 dominates; 500 for button text; 300 reserved for large mono headings (28–48px range)

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 17 | -0.8px | `--text-caption` |
| body-sm | 14px | 19 | -0.94px | `--text-body-sm` |
| body | 16px | 24 | -1.07px | `--text-body` |
| subheading | 20px | 30 | -0.5px | `--text-subheading` |
| heading-sm | 24px | 24 | -1.2px | `--text-heading-sm` |
| heading | 32px | 32 | -1.6px | `--text-heading` |
| heading-lg | 48px | 54 | -2.4px | `--text-heading-lg` |
| display-sm | 64px | 64 | -3.2px | `--text-display-sm` |
| display | 96px | 90 | -4.8px | `--text-display` |

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
| 24 | 24px | `--spacing-24` |
| 32 | 32px | `--spacing-32` |
| 64 | 64px | `--spacing-64` |
| 80 | 80px | `--spacing-80` |
| 128 | 128px | `--spacing-128` |

### Border Radius

| Element | Value |
|---------|-------|
| nav | 3px |
| tags | 3px |
| cards | 8px |
| buttons | 3px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 24px
- **Element gap:** 8px

## Components

### Top Navigation Bar
**Role:** Primary site navigation

Full-width bar on #f6f6f4 background. Logo cluster left (VISUAL wordmark + small icon), centered nav links (mono 14px, #000000), 'WAITLIST' button right. Height ~56px. No drop shadow — separation from page via 1px #d0d0c8 bottom border. 3px radius on all interactive elements.

### Neutral Filled Button
**Role:** Primary action trigger (Waitlist, Join, Submit)

Background #2c2c26, text #ffffff, mono 14px weight 500, padding 8px 16px, radius 3px. No shadow, no gradient. The only filled button in the system — its restraint is the point.

### Ghost Outline Button
**Role:** Secondary action (Learn More, Read More)

Background transparent, border 1px #000000, text #000000, mono 14px weight 500, padding 8px 16px, radius 3px. Sits beside the filled button with 8px gap.

### Section Eyebrow Label
**Role:** Small all-caps category marker above headlines

Mono 12px weight 500, uppercase, tracking -0.067em, color #6d6e5e. Examples: 'VISUAL', 'PRODUCT / OVERVIEW', 'STOP WASTING TIME WITH MANUAL UPDATES'. Always centered above the section heading, 16–24px gap.

### Centered Section Header
**Role:** Primary headline block for each page section

Serif display text centered on the canvas. Display sizes (64–96px) for hero, heading-lg (48px) for product sections, heading (32px) for sub-sections. Weight 300, tracking -0.05em, color #000000. Subtitle below in mono 14px, #6d6e5, max-width ~560px centered.

### Feature Split Card
**Role:** Side-by-side feature comparison blocks

Two equal panels side by side, each on #ffffff with 1px #d0d0c8 border and 8px radius. Left panel: mono UI mockup (chat interface) on #ffffff. Right panel: dark product screenshot on #2c2c26. Gap between panels: 24px. Each panel has its own eyebrow label in the top corner (mono 12px, #6d6e5e).

### Dark Product Panel
**Role:** Product UI showcase with dark background

Inner card with #2c2c26 background, 8px radius, 1px #57584b border. Contains product UI mockup (chat bubbles, file attachments, status indicators) rendered in #d0d0c8 and #aaab9c. Accent: #fff347 appears as a small highlight on the agent avatar or status dot.

### Blog Card
**Role:** Article preview in blog grid

8px radius, no border, image on top (square or 4:3, may use checkerboard transparency for editorial effect), title in serif heading-sm (24px, weight 400) below, date and author in mono 12px #979886. Three-column grid with 24px gap. Card background is transparent (sits directly on #f6f6f4).

### Dark Footer
**Role:** Site footer with links and branding

Full-width #2c2c26 background, text #ffffff and #979886. Three-column layout: VISUAL wordmark left, RESOURCES and COMPANY link columns center/right, WAITLIST button far right. Mono 14px links, 12px headings. Padding 64px vertical. No border-top — the color shift from #f6f6f4 to #2c2c26 is the separator.

### Accent Bar Decoration
**Role:** Decorative yellow + black line clusters

Horizontal composition of 2–3 thin bars: one 2px #000000 stroke, one 4px #fff347 stroke, varying widths (40–120px). Positioned as decorative accents near hero visuals or section transitions. Not a functional element — pure editorial punctuation.

### Olive Tag/Badge
**Role:** Category tag, status indicator

Background transparent or #e8e7d9, border 1px #aaa674, text #6d6e5, mono 12px weight 500, padding 4px 8px, radius 3px. Used sparingly for categorization and status labels.

### Checkerboard Hero Visual
**Role:** 3D-rendered hero centerpiece

A photorealistic 3D render (chrome/metallic organic form — resembles a heart or molar shape) placed over a transparent checkerboard pattern. The checkerboard signals 'this is a 3D asset, not a photograph' and echoes design-tool transparency grids. Accent bars in #fff347 and #000000 overlay at left and right.

## Do's and Don'ts

### Do
- Use the serif at 64–96px weight 300 for all hero and section headlines — the thin strokes at poster scale are the signature
- Set page background to #f6f6f4 and card surfaces to #ffffff — the warm cream is non-negotiable, never use pure #ffffff as the page canvas
- Pair the neutral filled button (#2c2c26 fill, #ffffff text) with the ghost outline button (1px #000000 border) — they always appear as a 2-button cluster with 8px gap
- Use mono at 12–16px with tracking -0.067em for all UI text, nav, buttons, and body copy — this creates the terminal/code-margin feel
- Separate sections with 80px vertical gaps, not with borders or background color shifts — the whitespace is the structure
- Place the #fff347 accent as 2–4px strokes or small fill blocks (max ~120px wide), never as large fills or backgrounds
- Use 8px radius on cards and 3px radius on buttons, tags, and nav elements — the radius contrast is deliberate

### Don't
- Don't use pure #ffffff as the page background — always #f6f6f4 for the warm cream canvas
- Don't add drop shadows to cards or buttons — the system is intentionally flat, separation comes from 1px borders and color contrast
- Don't use the serif at body sizes (16px or below) — it is a display-only face; body copy must be mono
- Don't apply #fff347 to text, large backgrounds, or filled buttons — it is a decorative accent only, not an action color
- Don't use cool grays (blues or true neutrals) — the entire palette runs warm: olive-sage tones, warm blacks (#2c2c26 not #000000 for surfaces), and cream whites
- Don't use gradients — the system is flat color only, with the one exception of the 3D hero render which contains its own internal gradients
- Don't exceed 4 instances of #fff347 per screen — the accent loses impact if it appears more than 3–4 times on a single page

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Vellum | `#f6f6f4` | Page background — the warm cream that defines the entire visual temperature |
| 1 | Paper | `#ffffff` | Card surfaces, elevated content blocks, light product mockup panels |
| 2 | Carbon | `#2c2c26` | Dark panels, product screenshot cards, footer, neutral filled buttons |
| 3 | Highlighter | `#fff347` | Accent highlight washes — appears as small decorative fills, never large surfaces |
| 4 | Bone | `#e8e7d9` | Subtle warm tint for tag backgrounds and soft highlight zones |

## Elevation

The system is intentionally flat. No drop shadows exist anywhere — visual hierarchy comes from three mechanisms only: (1) 1px hairline borders in #d0d0c8 or #57584b, (2) color contrast between the warm cream canvas and dark #2c2c26 panels, and (3) generous 80px section gaps. This flatness is a deliberate editorial choice — the design reads like a printed catalog or zine, not a software product. Adding shadows would break the typographic, print-inspired system.

## Imagery

Imagery is sparse and editorial. The hero features a single photorealistic 3D render — a chrome/metallic organic form (resembling a heart or molar) with reflective surface treatment, placed over a transparency-grid checkerboard pattern that signals '3D asset' rather than 'photograph'. The checkerboard is a design-tool convention used here as aesthetic. Accent bars (2–4px strokes in #fff347 and #000000) overlay the hero as decorative punctuation. Blog cards use square or 4:3 editorial photography with a slightly desaturated, high-key treatment. No lifestyle photography, no stock imagery, no product screenshots in the marketing sense — only the 3D render and editorial blog photos. Icons are minimal mono-weight geometric marks, not illustrations.

## Layout

Page model is max-width 1200px centered, with full-bleed sections inside that constraint. The hero is a centered stack: small mono eyebrow label, massive serif headline (96px), mono subtitle, two-button cluster, then the 3D hero visual below. Section rhythm is seamless — no dividers or background color shifts between most sections, just 80px vertical gaps. Content arrangement alternates between centered stacks (hero, section headers) and split layouts (feature cards: text-left/mockup-right). The product showcase uses a dark-on-light contrast: light canvas with a #2c2c26 dark panel containing the product UI mockup. Blog section uses a 3-column card grid with 24px gap. Footer is the only full-width color shift (cream to dark). Navigation is a single thin top bar, not sticky or complex — minimal, editorial, not app-like.

## Agent Prompt Guide

**Quick Color Reference**
- text: #000000
- background: #f6f6f4
- card surface: #ffffff
- border: #d0d0c8
- dark surface: #2c2c26
- accent: #fff347
- primary action: #2c2c26 (filled action)

**Example Component Prompts**

1. Create a hero section: #f6f6f4 background, centered. Eyebrow label at 12px mono weight 500, #6d6e5e, uppercase, tracking -0.8px, text 'VISUAL'. Headline at 96px serif weight 300, #000000, tracking -4.8px, line-height 0.94, text 'Design Agents for Revenue Teams'. Subtitle at 14px mono, #6d6e5e, max-width 560px centered, line-height 1.33. Button cluster below: neutral filled button (#2c2c26, #ffffff text, 14px mono weight 500, padding 8px 16px, radius 3px) reading 'JOIN WAITLIST', ghost outline button (transparent, 1px #000000 border, #000000 text, same dimensions) reading 'LEARN MORE', 8px gap between them. 3D hero visual centered below with 80px margin-top.

2. Create a blog card grid: 3-column grid with 24px gap on #f6f6f4 background. Each card: 8px radius, no border, square image on top, serif title at 24px weight 400 #000000, tracking -1.2px below image with 16px margin-top, date and author in 12px mono #979886 below title with 8px margin-top. No card padding — image bleeds to card edges.

3. Create a feature split card: two equal panels side by side with 24px gap. Left panel: #ffffff background, 1px #d0d0c8 border, 8px radius, 24px padding, contains mono UI mockup (chat interface with avatar circle, message bubbles, file attachment chips). Right panel: #2c2c26 background, 8px radius, contains dark product screenshot mockup. Each panel has an eyebrow label in top corner: 12px mono weight 500 #6d6e5e (left) and #979886 (right), uppercase.

4. Create a section header: centered on #f6f6f4. Mono eyebrow at 12px weight 500 #6d6e5e uppercase, tracking -0.8px. Serif headline at 48px weight 300 #000000, tracking -2.4px, line-height 1.13 below, 16px margin-top. Mono subtitle at 14px #6d6e5e, max-width 480px centered, 8px margin-top.

5. Create the dark footer: full-width #2c2c26 background, 64px vertical padding. Three-column layout: 'VISUAL' wordmark in mono 14px weight 500 #ffffff left-aligned, two link columns center (RESOURCES / COMPANY headings in 12px mono #979886, links in 14px mono #ffffff), neutral filled button (#2c2c26 background, 1px #ffffff border, #ffffff text, 14px mono weight 500, padding 8px 16px, radius 3px) reading 'WAITLIST' far right.

## Similar Brands

- **Linear** — Same mono-as-body-text approach with tight tracking, minimal palette discipline, and hairline-border flat surfaces — though Linear runs dark, Visual runs cream
- **Stripe Press** — Same editorial warmth — serif display headlines, generous whitespace, cream/off-white canvas, and the sense that the marketing site is a design object in its own right
- **Rauno Freiberg** — Same mono + serif pairing, same restraint with color (near-monochrome with one accent), same typographic confidence at poster scale
- **Arc Browser** — Same editorial-magazine-meets-product energy: serif headlines, mono UI, warm neutrals, and decorative accent marks used as visual punctuation
- **Semplice (by Spatzek)** — Same design-portfolio-meets-product language: serif display type, generous 80px+ section gaps, cream backgrounds, and the confidence to let whitespace do the work

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-vellum: #f6f6f4;
  --color-paper: #ffffff;
  --color-ink: #000000;
  --color-carbon: #2c2c26;
  --color-ash: #d0d0c8;
  --color-olive-char: #57584b;
  --color-lichen: #6d6e5e;
  --color-sage: #979886;
  --color-moss: #aaab9c;
  --color-bone: #e8e7d9;
  --color-highlighter-yellow: #fff347;
  --color-khaki-olive: #aaa674;

  /* Typography — Font Families */
  --font-serif-custom-resembles-a-high-contrast-modern-editorial-serif-like-reckless-neue-gt-sectra-or-pp-editorial-new: 'Serif (custom — resembles a high-contrast modern editorial serif like Reckless Neue, GT Sectra, or PP Editorial New)', ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
  --font-mono-custom-clean-geometric-monospace: 'Mono (custom — clean geometric monospace)', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 17;
  --tracking-caption: -0.8px;
  --text-body-sm: 14px;
  --leading-body-sm: 19;
  --tracking-body-sm: -0.94px;
  --text-body: 16px;
  --leading-body: 24;
  --tracking-body: -1.07px;
  --text-subheading: 20px;
  --leading-subheading: 30;
  --tracking-subheading: -0.5px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 24;
  --tracking-heading-sm: -1.2px;
  --text-heading: 32px;
  --leading-heading: 32;
  --tracking-heading: -1.6px;
  --text-heading-lg: 48px;
  --leading-heading-lg: 54;
  --tracking-heading-lg: -2.4px;
  --text-display-sm: 64px;
  --leading-display-sm: 64;
  --tracking-display-sm: -3.2px;
  --text-display: 96px;
  --leading-display: 90;
  --tracking-display: -4.8px;

  /* Typography — Weights */
  --font-weight-light: 300;
  --font-weight-regular: 400;
  --font-weight-medium: 500;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-128: 128px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 24px;
  --element-gap: 8px;

  /* Border Radius */
  --radius-sm: 3px;
  --radius-lg: 8px;

  /* Named Radii */
  --radius-nav: 3px;
  --radius-tags: 3px;
  --radius-cards: 8px;
  --radius-buttons: 3px;

  /* Surfaces */
  --surface-vellum: #f6f6f4;
  --surface-paper: #ffffff;
  --surface-carbon: #2c2c26;
  --surface-highlighter: #fff347;
  --surface-bone: #e8e7d9;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-vellum: #f6f6f4;
  --color-paper: #ffffff;
  --color-ink: #000000;
  --color-carbon: #2c2c26;
  --color-ash: #d0d0c8;
  --color-olive-char: #57584b;
  --color-lichen: #6d6e5e;
  --color-sage: #979886;
  --color-moss: #aaab9c;
  --color-bone: #e8e7d9;
  --color-highlighter-yellow: #fff347;
  --color-khaki-olive: #aaa674;

  /* Typography */
  --font-serif-custom-resembles-a-high-contrast-modern-editorial-serif-like-reckless-neue-gt-sectra-or-pp-editorial-new: 'Serif (custom — resembles a high-contrast modern editorial serif like Reckless Neue, GT Sectra, or PP Editorial New)', ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
  --font-mono-custom-clean-geometric-monospace: 'Mono (custom — clean geometric monospace)', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 17;
  --tracking-caption: -0.8px;
  --text-body-sm: 14px;
  --leading-body-sm: 19;
  --tracking-body-sm: -0.94px;
  --text-body: 16px;
  --leading-body: 24;
  --tracking-body: -1.07px;
  --text-subheading: 20px;
  --leading-subheading: 30;
  --tracking-subheading: -0.5px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 24;
  --tracking-heading-sm: -1.2px;
  --text-heading: 32px;
  --leading-heading: 32;
  --tracking-heading: -1.6px;
  --text-heading-lg: 48px;
  --leading-heading-lg: 54;
  --tracking-heading-lg: -2.4px;
  --text-display-sm: 64px;
  --leading-display-sm: 64;
  --tracking-display-sm: -3.2px;
  --text-display: 96px;
  --leading-display: 90;
  --tracking-display: -4.8px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-128: 128px;

  /* Border Radius */
  --radius-sm: 3px;
  --radius-lg: 8px;
}
```
