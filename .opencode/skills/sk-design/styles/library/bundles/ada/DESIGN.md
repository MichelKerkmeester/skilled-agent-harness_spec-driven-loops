# Ada — Style Reference
> Daylight gallery with pastel punctuation — a quiet off-white room where four jewel-tone colors are allowed to speak, and everything else stays in charcoal.

**Theme:** light

Ada operates as a daylight gallery: an off-white canvas with generous breathing room, a single humanist sans-serif doing all the voice work, and jewel-toned accent colors that appear only as deliberate punctuation marks. The visual system resists decoration — no gradients on buttons, no drop shadows on cards, no chrome competing with content. Instead, identity comes from a small, disciplined palette (forest green, periwinkle blue, candy pink, butter yellow) used as left-edge accent bars on stat cards and as filled pill buttons. Hierarchy is built through size contrast and whitespace, not color volume. Surfaces sit on a warm #f9f9f9 ground with #ffffff cards floating above. The hero's defining move is a heavily blurred photographic background that feels like looking through frosted glass — it adds warmth and depth without competing with the white headline that reads like editorial typography.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Inkstone | `#0a0b0c` | `--color-inkstone` | Primary text, body copy, headings, hairline borders, dark UI surfaces — the near-black backbone of the entire interface, used at massive scale for borders and typography |
| Bone | `#f9f9f9` | `--color-bone` | Page canvas, section backgrounds, subtle surface tier beneath cards — a warm off-white that softens the contrast of the interface |
| Paper | `#ffffff` | `--color-paper` | Card surfaces, elevated panels, chat widget container, inputs — the brightest tier of the surface stack |
| Ash | `#d8d8d8` | `--color-ash` | Decorative SVG fills, disabled input borders, neutral dividers |
| Plum Ash | `#392c38` | `--color-plum-ash` | Muted card borders and dark surface tints — a desaturated plum that appears on secondary containers |
| Forest Depth | `#00543d` | `--color-forest-depth` | Primary brand identity, filled dark buttons, dark accent bar on stat cards, announcement bar background — deep green that signals authority and trust without corporate blandness |
| Periwinkle | `#abcbf9` | `--color-periwinkle` | Blue action color for filled buttons, selected navigation states, and focused conversion moments. |
| Candy Pink | `#ffbbfc` | `--color-candy-pink` | Accent bar on stat cards, decorative soft surface washes — the most playful of the four accents, used sparingly to add warmth |
| Butter | `#fce88b` | `--color-butter` | Accent bar on stat cards, warmth punctuation — the warmest accent, appearing only on the 4th stat card as a visual rhythm closer |

## Tokens — Typography

### Roobert — Sole typeface across the entire interface — body, headings, buttons, nav, footer, cards, inputs. Weight stays at 400 throughout; hierarchy is built purely through size, not bold/light contrast. The geometric humanist proportions give headlines a literary quality while the single weight forces restraint. · `--font-roobert`
- **Substitute:** Inter, DM Sans, or Söhne
- **Weights:** 400
- **Sizes:** 12, 14, 15, 16, 18, 20, 24, 32, 36, 48, 60, 72
- **Line height:** 1.00–1.56
- **Letter spacing:** normal at all sizes — the typeface's own proportions carry the rhythm
- **Role:** Sole typeface across the entire interface — body, headings, buttons, nav, footer, cards, inputs. Weight stays at 400 throughout; hierarchy is built purely through size, not bold/light contrast. The geometric humanist proportions give headlines a literary quality while the single weight forces restraint.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.4 | — | `--text-caption` |
| body-sm | 14px | 1.43 | — | `--text-body-sm` |
| body | 16px | 1.56 | — | `--text-body` |
| subheading | 20px | 1.38 | — | `--text-subheading` |
| heading-sm | 24px | 1.33 | — | `--text-heading-sm` |
| heading | 32px | 1.25 | — | `--text-heading` |
| heading-lg | 48px | 1.11 | — | `--text-heading-lg` |
| display | 72px | 1 | — | `--text-display` |

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
| 36 | 36px | `--spacing-36` |
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |
| 72 | 72px | `--spacing-72` |
| 96 | 96px | `--spacing-96` |
| 112 | 112px | `--spacing-112` |
| 120 | 120px | `--spacing-120` |
| 160 | 160px | `--spacing-160` |
| 176 | 176px | `--spacing-176` |

### Border Radius

| Element | Value |
|---------|-------|
| nav | 32px |
| cards | 8px |
| inputs | 4px |
| buttons | 9999px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 24px
- **Element gap:** 8-16px

## Components

### Announcement Bar
**Role:** Full-width dark utility bar at the very top of the page

Background #0a0b0c, full-bleed height ~40px, white text at 14px Roobert 400, left-aligned label text, right-aligned dark pill button (#00543d background, white text, 9999px radius, 8px 16px padding) with a subtle border.

### Primary Navigation
**Role:** Sticky top navigation with logo, dropdown menus, and primary CTA

White background, ~64px height, Ada wordmark logo at left, horizontal nav links in #0a0b0c at 15px with dropdown chevrons, user avatar icon, and a dark pill CTA button ('Speak to an expert') with #0a0b0c background, white text, 9999px radius, 12px 24px padding, and a circular arrow icon.

### Hero Section
**Role:** Full-viewport landing area with headline, subtext, and product demo

Full-bleed background with heavily blurred photographic gradient (warm amber/teal organic shapes — feels like frosted glass over a landscape). Left column: massive headline at 60-72px Roobert 400 in #0a0b0c, letter-spacing normal, line-height ~1.05, stacked vertically. Subtext at 18px in #0a0b0c at 70% opacity. Right column: floating white card (8px radius, subtle 1px #f9f9f9 border) showing a chat widget with brand partner logo, avatar dots, and a dark pill button ('Listen to a real call') with arrow icon.

### Logo Strip
**Role:** Social proof band showing enterprise customer logos

Horizontal row of 7-8 monochrome partner logos on #f9f9f9 background, evenly spaced, each rendered in #0a0b0c at low contrast (around 60% opacity), 40-60px tall, no accompanying heading on the strip itself.

### Stat Card (4-Color Variant Set)
**Role:** Metric showcase cards with signature colored left-edge accent bars

White card (#ffffff) with 8px radius, no shadow, 24px padding. A 4px-wide vertical color bar runs the full left edge — the bar color is the defining visual: #00543d Forest, #ffbbfc Candy Pink, #abcbf9 Periwinkle, #fce88b Butter — one card per color, creating a four-beat rhythm. Inside: large metric number at 36-48px Roobert 400 in #0a0b0c, followed by a two-line descriptor at 14-16px in #0a0b0c at 70% opacity.

### Feature Card (Image Variant)
**Role:** Full-bleed image card with overlay text and circular arrow CTA

Rectangular card filling its grid column, full-bleed photographic image (no padding around the image), dark gradient overlay at the bottom (transparent to ~40% #0a0b0c) so text remains legible. White text at 32px Roobert 400 for the card title, body at 14-16px white at 85% opacity. A 48px circular dark button (#0a0b0c, white right-arrow icon) sits in the bottom-right corner with 8px radius.

### Circular Arrow Button
**Role:** Reusable CTA element on cards and content blocks

48px diameter circle, #0a0b0c background, white right-pointing arrow (→) at 18px, 8px radius (appears fully rounded). Used consistently as a secondary action affordance on feature cards.

### Section Heading Block
**Role:** Centered text block introducing a new content section

Centered headline at 36-48px Roobert 400 in #0a0b0c, line-height ~1.2, one or two lines max. Optional subtext at 18px below in #0a0b0c at 65% opacity, max-width 640px, centered. No decorative elements, no eyebrow tag.

### Chat Widget Card
**Role:** Floating product demo card in the hero

White card with 8px radius, subtle 1px #f9f9f9 border, generous padding (~24px). Contains a partner brand wordmark at top-left, a row of small status dots at top-right, a 32px medium-weight label ('AI agent'), and 2-3 lines of monospace-style conversation text at 14px in #0a0b0c. A dark pill button is attached or positioned adjacent.

## Do's and Don'ts

### Do
- Use Roobert 400 at every size — never switch to bold/light to create hierarchy; let size alone do the work.
- Apply the four accent colors (#00543d, #abcbf9, #ffbbfc, #fce88b) only as 4px left-edge bars on stat cards or as single filled action surfaces — never as broad background fills.
- Set card radius to 8px, input radius to 4px, and button radius to 9999px (pill) — the three-tier radius system is non-negotiable.
- Keep the canvas at #f9f9f9 and elevate cards to #ffffff — this two-tier surface system is the only elevation the design needs.
- Use #0a0b0c for all borders at 1px — the design relies on hairline borders, not shadows, to define regions.
- Maintain generous section gaps of 80px between content bands; never compress below 48px.
- Anchor every full-bleed image card with a dark gradient overlay (transparent → ~40% #0a0b0c) so overlaid text stays legible.

### Don't
- Do not introduce drop shadows on cards or buttons — the design is flat by philosophy, relying on hairline borders and surface color contrast.
- Do not use the four accent colors as text colors — they are decorative bars and surface fills only, never for body copy or headings.
- Do not apply gradients to buttons, cards, or navigation — the only gradient in the system is the hero background.
- Do not use a second typeface or introduce bold/light weights of Roobert — the single-weight discipline is a signature choice.
- Do not place color on more than one element per viewport section — the system breathes through restraint; clustering accents destroys the rhythm.
- Do not use #ffffff as a page background — it kills the warmth; always use #f9f9f9 for the canvas and #ffffff only for elevated cards.
- Do not add decorative dividers, icon badges, or section eyebrows — section transitions are whitespace-driven, no visual chrome needed.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Canvas | `#f9f9f9` | Page background, section bands, the base layer everything sits on |
| 2 | Card | `#ffffff` | Elevated card surfaces, chat widget, feature panels — floats above the canvas |
| 3 | Dark Surface | `#0a0b0c` | Announcement bar, pill buttons, circular arrow CTAs, image overlay gradient end — the only dark surface in the system |
| 4 | Accent Wash | `#abcbf9` | Soft tinted backgrounds for highlighted regions, nav chips, soft callouts |

## Elevation

The design system deliberately avoids drop shadows as an elevation mechanism. Depth and hierarchy are established through a three-step surface stack (#f9f9f9 canvas → #ffffff card → #0a0b0c dark surface) combined with 1px #0a0b0c hairline borders at extremely low opacity. The result is a flat, editorial feel where the only depth cue is surface color contrast — no shadow blur, no z-axis simulation.

## Imagery

Imagery is used in two distinct registers. The hero background is a heavily blurred photographic gradient (organic amber/teal/blue shapes) that reads as atmospheric warmth rather than literal subject — it functions as a colored ground, not a picture. Feature cards use full-bleed editorial photography: people in collaborative settings, a person presenting at a screen, hands on a laptop showing a product UI — always cropped tight, always treated with a dark gradient overlay at the bottom for text legibility. There is no illustration system; no flat graphics, no icon-based storytelling. Partner logos in the social-proof strip are rendered in monochrome #0a0b0c at reduced opacity, creating a quiet horizontal rhythm.

## Layout

The page follows a max-width 1200px centered column model with full-bleed section bands that break out to the viewport edges. The hero is a two-column split: oversized editorial headline left (60% width), product demo card floating right (40% width), both vertically centered against the full-bleed blurred background. Below the hero, sections alternate between #f9f9f9 and #ffffff bands with 80px vertical gaps. The stat block uses a 4-column equal grid with each card holding one accent color bar. The feature section uses a 3-column equal grid of full-bleed image cards. Headlines are consistently centered and oversized (36-72px); body text is left-aligned within cards but centered in section intros. Navigation is a clean horizontal bar with dropdown menus — no sidebar, no mega-menu chrome. The overall rhythm is spacious and editorial: each content block gets full visual breathing room before the next begins.

## Agent Prompt Guide

**Quick Color Reference**
- text: #0a0b0c
- background: #f9f9f9
- card surface: #ffffff
- border: #0a0b0c at 1px (use at 8-15% opacity for subtle hairlines)
- dark surface / button: #0a0b0c
- primary action: #abcbf9 (filled action)

**Example Component Prompts**
1. *Hero with frosted background*: Full-bleed background using a linear-gradient(oklch(0.5555 0 0), oklch(0.331 0.0104 253.98)) overlaid on a blurred organic photographic wash. Left column: headline at 72px Roobert 400, #0a0b0c, line-height 1.05. Subtext at 18px Roobert 400, #0a0b0c at 70% opacity. Right column: white card (#ffffff, 8px radius, 1px #f9f9f9 border, 24px padding) containing a 14px conversation block in monospace-style Roobert and a dark pill button (#0a0b0c, white text, 9999px radius, 12px 24px padding) with a 16px right-arrow icon.

2. *Stat card with accent bar*: White card (#ffffff, 8px radius, no shadow, 24px padding). A 4px-wide vertical bar in #ffbbfc runs the full left edge. Metric number at 48px Roobert 400, #0a0b0c. Descriptor at 14px Roobert 400, #0a0b0c at 70% opacity, two lines max.

3. *Feature image card*: Full-bleed photographic image filling the card (no internal padding around the image). Bottom 40% of the card covered by a linear-gradient(transparent, rgba(10,11,12,0.5)) overlay. White title at 32px Roobert 400, white body at 14px Roobert 400 at 85% opacity. A 48px circular dark button (#0a0b0c, 8px radius, white → arrow) positioned at bottom-right with 16px margin.

4. Create a Primary Action Button: #abcbf9 background, #0a0b0c text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.

5. *Section intro*: Centered headline at 48px Roobert 400, #0a0b0c, max-width 720px. Subtext at 18px Roobert 400, #0a0b0c at 65% opacity, max-width 640px, centered below. 40px gap between headline and subtext. No eyebrow, no decorative line.

## Similar Brands

- **Linear** — Same single-weight humanist sans-serif discipline, flat surfaces with hairline borders, and restrained accent color usage that appears as deliberate punctuation
- **Pitch** — Same editorial oversized-headline approach on generous whitespace, with a single dark pill button as the primary action pattern
- **Notion** — Same warm off-white canvas (#f9f9f9 feel) with flat cards floating above, and a humanist sans doing all the voice work at a single weight
- **Arc Browser** — Same playful use of pastel accent colors as small visual punctuation against a near-monochrome base, with oversized editorial typography

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-inkstone: #0a0b0c;
  --color-bone: #f9f9f9;
  --color-paper: #ffffff;
  --color-ash: #d8d8d8;
  --color-plum-ash: #392c38;
  --color-forest-depth: #00543d;
  --color-periwinkle: #abcbf9;
  --color-candy-pink: #ffbbfc;
  --color-butter: #fce88b;

  /* Typography — Font Families */
  --font-roobert: 'Roobert', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.4;
  --text-body-sm: 14px;
  --leading-body-sm: 1.43;
  --text-body: 16px;
  --leading-body: 1.56;
  --text-subheading: 20px;
  --leading-subheading: 1.38;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.33;
  --text-heading: 32px;
  --leading-heading: 1.25;
  --text-heading-lg: 48px;
  --leading-heading-lg: 1.11;
  --text-display: 72px;
  --leading-display: 1;

  /* Typography — Weights */
  --font-weight-regular: 400;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-36: 36px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-72: 72px;
  --spacing-96: 96px;
  --spacing-112: 112px;
  --spacing-120: 120px;
  --spacing-160: 160px;
  --spacing-176: 176px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 24px;
  --element-gap: 8-16px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-3xl: 28px;
  --radius-3xl-2: 32px;

  /* Named Radii */
  --radius-nav: 32px;
  --radius-cards: 8px;
  --radius-inputs: 4px;
  --radius-buttons: 9999px;

  /* Surfaces */
  --surface-canvas: #f9f9f9;
  --surface-card: #ffffff;
  --surface-dark-surface: #0a0b0c;
  --surface-accent-wash: #abcbf9;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-inkstone: #0a0b0c;
  --color-bone: #f9f9f9;
  --color-paper: #ffffff;
  --color-ash: #d8d8d8;
  --color-plum-ash: #392c38;
  --color-forest-depth: #00543d;
  --color-periwinkle: #abcbf9;
  --color-candy-pink: #ffbbfc;
  --color-butter: #fce88b;

  /* Typography */
  --font-roobert: 'Roobert', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.4;
  --text-body-sm: 14px;
  --leading-body-sm: 1.43;
  --text-body: 16px;
  --leading-body: 1.56;
  --text-subheading: 20px;
  --leading-subheading: 1.38;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.33;
  --text-heading: 32px;
  --leading-heading: 1.25;
  --text-heading-lg: 48px;
  --leading-heading-lg: 1.11;
  --text-display: 72px;
  --leading-display: 1;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-36: 36px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-72: 72px;
  --spacing-96: 96px;
  --spacing-112: 112px;
  --spacing-120: 120px;
  --spacing-160: 160px;
  --spacing-176: 176px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-3xl: 28px;
  --radius-3xl-2: 32px;
}
```
