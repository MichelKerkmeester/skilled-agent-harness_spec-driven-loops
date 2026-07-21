# Trawelt — Style Reference
> Boarding pass on black marble

**Theme:** mixed

Trawelt is a high-contrast, editorial luxury system that alternates between dramatic black canvases and warm cream surfaces, stitched together by a single saturated forest-green accent. The typography pairing is deliberate tension: a sharp neo-grotesk (Labour Grotesk) carries all functional text at one voice — weight 400, tight tracking, no italics — while an ultra-light contemporary serif (Reckless Neue at 250) appears only on large display headings to whisper rather than shout. The mint-green pill navigation bar acts as a constant brand anchor, persisting across both dark and light sections like a boarding-pass stub. Surfaces are flat and paper-like; elevation is replaced by border weight (predominantly 1px black) and generous whitespace, giving the system a print-magazine logic rather than a typical app-dashboard logic.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Forest Command | `#2d9b4c` | `--color-forest-command` | Primary CTA fills, active nav indicators, footer link accents, tag chips — the single chromatic heartbeat of the system; warm green against matte black creates urgency without aggression |
| Mint Boarding Pass | `#d3ffc3` | `--color-mint-boarding-pass` | Green wash for highlight backgrounds, decorative bands, and soft emphasis behind content. |
| Champagne Beige | `#e7d5ba` | `--color-champagne-beige` | Hero illustration backdrop and premium accent panel — warm near-neutral that introduces tonal warmth inside predominantly black/green compositions |
| Linen Cream | `#e4e9dc` | `--color-linen-cream` | Light-section page background — slightly green-tinted off-white that keeps light pages feeling on-brand rather than clinical |
| Parchment | `#efefe7` | `--color-parchment` | Card surfaces in light sections, secondary fills, ghost-button borders — warmer than pure white, pairs with linen cream for a two-tier light surface stack |
| Obsidian | `#000000` | `--color-obsidian` | Dominant dark canvas, 1px structural borders everywhere, button text on green fills, all text on light surfaces — the structural black that carries the system |
| Paper White | `#ffffff` | `--color-paper-white` | Headline and body text on dark sections, card surfaces elevated above black backgrounds, reverse borders on light sections |
| Carbon | `#020202` | `--color-carbon` | Near-black variant for subtle text/background differentiation where pure #000 would be too flat — imperceptible shift that softens edges in dense text blocks |

## Tokens — Typography

### Labour Grotesk — Primary system font at a single weight — used for navigation, body, buttons, card titles, footer, and the massive 435px hero display. The decision to lock to weight 400 instead of ranging 300–700 is the signature: it forces hierarchy through size and tracking, not weight, producing a uniform, confident, almost monoline voice. The 435px size is a single decorative display moment, not a functional text size. · `--font-labour-grotesk`
- **Substitute:** Inter, DM Sans, General Sans
- **Weights:** 400
- **Sizes:** 16px, 20px, 23px, 28px, 31px, 39px, 43px, 53px, 435px
- **Line height:** 0.80–1.50
- **Letter spacing:** -0.072em at display (435px), -0.01em at 39–53px, +0.01em at small body (16–23px)
- **Role:** Primary system font at a single weight — used for navigation, body, buttons, card titles, footer, and the massive 435px hero display. The decision to lock to weight 400 instead of ranging 300–700 is the signature: it forces hierarchy through size and tracking, not weight, producing a uniform, confident, almost monoline voice. The 435px size is a single decorative display moment, not a functional text size.

### Reckless Neue — Editorial serif at ultra-light 250 weight — appears only on large blog and content headings. The choice of weight 250 (near-hairline) instead of the conventional 400–500 is anti-SaaS: headlines whisper rather than declare authority, creating a magazine-editorial contrast against Labour Grotesk's steady functional voice. · `--font-reckless-neue`
- **Substitute:** PP Editorial New, Cormorant Garamond Light, Source Serif Light
- **Weights:** 250
- **Sizes:** 20px, 39px, 43px, 53px
- **Line height:** 1.10–1.30
- **Letter spacing:** -0.01em
- **Role:** Editorial serif at ultra-light 250 weight — appears only on large blog and content headings. The choice of weight 250 (near-hairline) instead of the conventional 400–500 is anti-SaaS: headlines whisper rather than declare authority, creating a magazine-editorial contrast against Labour Grotesk's steady functional voice.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 16px | 1.5 | 0.01px | `--text-caption` |
| body-sm | 20px | 1.5 | — | `--text-body-sm` |
| body | 23px | 1.3 | — | `--text-body` |
| subheading | 28px | 1.2 | — | `--text-subheading` |
| heading-sm | 31px | 1.2 | — | `--text-heading-sm` |
| heading | 39px | 1.1 | -0.01px | `--text-heading` |
| heading-lg | 43px | 1.1 | -0.01px | `--text-heading-lg` |
| display | 53px | 1 | -0.01px | `--text-display` |
| mega-display | 435px | 0.8 | -0.072px | `--text-mega-display` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** spacious

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 5 | 5px | `--spacing-5` |
| 10 | 10px | `--spacing-10` |
| 15 | 15px | `--spacing-15` |
| 17 | 17px | `--spacing-17` |
| 18 | 18px | `--spacing-18` |
| 22 | 22px | `--spacing-22` |
| 27 | 27px | `--spacing-27` |
| 30 | 30px | `--spacing-30` |
| 32 | 32px | `--spacing-32` |
| 37 | 37px | `--spacing-37` |
| 57 | 57px | `--spacing-57` |
| 63 | 63px | `--spacing-63` |
| 83 | 83px | `--spacing-83` |
| 120 | 120px | `--spacing-120` |
| 127 | 127px | `--spacing-127` |
| 187 | 187px | `--spacing-187` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 15.04px |
| buttons | 10.08px |
| navPill | 9999px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 120-187px
- **Card padding:** 22-37px
- **Element gap:** 15-27px

## Components

### Persistent Navigation Pill
**Role:** Sticky top navigation bar present on every section

Mint Boarding Pass (#d3ffc3) background, full-width pill with significant internal padding (~27px horizontal, ~15px vertical). Contains the Trawelt wordmark + circular arrow-up badge on the left, and a horizontal nav link list + black-filled 'Get in touch' pill button on the right. Border-radius approximately 15px. The mint green bar persists across dark and light sections, acting as a constant brand anchor.

### Forest CTA Button (filled)
**Role:** Primary action button

Forest Command (#2d9b4c) fill, white text, Labour Grotesk 400 at ~16px, padding ~10px 18px, border-radius 10.08px. No shadow. Black 1px border optional. The saturated green against the otherwise black/cream system makes this button feel like a power switch — small, filled, and unmistakable.

### Black Pill Button
**Role:** Secondary action / nav CTA ('Get in touch')

Black (#000000) fill, white text, Labour Grotesk 400 at ~16px, padding ~10px 22px, border-radius 9999px (full pill). Sits inside the mint navigation bar, creating a high-contrast punch against the pastel green.

### Ghost Arrow Button
**Role:** Carousel/pagination navigation

Circular 48px button, 1px black border on white fill (inactive) or filled black with white arrow (active/hover). Used for blog post carousel arrows. No background, no shadow — purely outline-driven.

### Hero Service Card (dark)
**Role:** Horizontal-scrolling service category card on dark canvas

Full-bleed image card with category label overlay in white text, Labour Grotesk 400. The image fills the card with no padding; text sits at the top-left with ~27px padding. Cards are part of a horizontal scroll row — no visible card border, the image is the card.

### Centered White Feature Card
**Role:** Promotional callout floating on dark hero

White (#ffffff) card with significant padding (~37px), large Labour Grotesk text spanning multiple lines ('Upgrade your Tour operator to first class.'), and a Forest Command CTA button inset at the bottom right. Border-radius 15.04px. Acts as a paper card on the black canvas — the only bright object in the dark hero.

### Boarding Pass Card
**Role:** Branded illustration/promotional asset

Forest Command green card mimicking a physical boarding pass with perforated/torn edges and rounded corners ~15px. Contains bold Trawelt wordmark, small descriptor text, and a separate card stub for URL display. Black text on green. Used as a decorative/brand moment in the dark section transition.

### Blog Feature Card
**Role:** Editorial blog post preview on light section

Two-column layout: large image on left (~50% width, full-bleed to card edge), text block on right with title in Reckless Neue 250 weight ~39px in Obsidian black, excerpt in Labour Grotesk 400 ~16px in a muted dark. White card surface on Linen Cream page background. No border, generous ~37px internal padding.

### Tag/Chip
**Role:** Inline metadata label

Small inline element using Labour Grotesk 400 at 16px, Forest Command text color or 1px black border with black text. No fill. Used for category labels and language tags.

### Logo Mark
**Role:** Brand wordmark in navigation

Trawelt set in Labour Grotesk 400 at ~23px, black on mint nav background. Accompanied by a circular badge icon with an upward arrow (~40px diameter, black 1px border, white fill). The mark is always locked with the badge — never the wordmark alone in the nav.

### Section Heading (serif)
**Role:** Large editorial heading on light sections

Reckless Neue at 250 weight, sizes 39–53px, Obsidian black (#000000), line-height 1.10–1.20, letter-spacing -0.01em. Appears only on light cream backgrounds. The ultra-light serif weight is the signature — it gives blog/editorial sections a print-magazine authority that contrasts the grotesk-led functional UI.

### Section Heading (grotesk)
**Role:** Large functional heading on dark sections

Labour Grotesk 400 at 39–53px, white (#ffffff) on Obsidian black, line-height 1.10–1.20, letter-spacing -0.01em. Used for hero copy and section titles on dark canvases. Single weight across all sizes — hierarchy comes from size alone.

### Footer Link Group
**Role:** Site footer navigation and legal links

Obsidian black or Linen Cream background, Labour Grotesk 400 at 16px, Forest Command link color for active items, white or black for inactive. Items arranged in a multi-column grid with generous row gaps.

## Do's and Don'ts

### Do
- Use Forest Command (#2d9b4c) as the only chromatic fill in the system — never introduce secondary accent colors
- Lock the persistent Mint Boarding Pass (#d3ffc3) nav pill at the top of every page, both dark and light sections
- Set all body and UI text in Labour Grotesk weight 400 — build hierarchy through size and tracking, never through weight variation
- Use Reckless Neue weight 250 only for editorial headings on light cream sections; never pair it with bold or italic variants
- Communicate elevation by canvas inversion (white card on black page) or 1px black borders — never use box-shadows
- Apply 15.04px radius to all cards and panels, 10.08px to all buttons and small inputs, 9999px to nav pills and tags
- Alternate full-bleed dark and light section bands with 120–187px vertical gaps between them

### Don't
- Don't introduce a second or third accent color — green is the only chromatic heartbeat
- Don't use font-weight 600/700 anywhere — the system is intentionally monoline at weight 400
- Don't use box-shadows, drop-shadows, or glow effects on any element
- Don't use the mega-display 435px size for functional text — reserve it for a single decorative moment per page
- Don't place Reckless Neue on dark backgrounds — it is a light-section exclusive
- Don't use pure white (#ffffff) as a page background — light sections should always be Linen Cream (#e4e9dc) or Parchment (#efefe7)
- Don't break the nav pill — it must remain a single continuous mint-green bar across all sections

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Obsidian Canvas | `#000000` | Base dark canvas for hero, feature, and CTA sections |
| 1 | Paper Card | `#ffffff` | Elevated card surface floating on dark sections |
| 2 | Linen Page | `#e4e9dc` | Light-section page background for blog and editorial content |
| 3 | Parchment Card | `#efefe7` | Card surfaces sitting on linen cream pages |

## Elevation

- **White feature card on dark hero:** `none — elevation conveyed by contrast inversion, not shadow`
- **Blog card on cream section:** `none — flat paper-on-paper`
- **Navigation pill:** `none — the persistent pill is its own elevation signal`

## Imagery

Imagery follows a luxury-hospitality editorial logic: tight, well-lit interior and architectural photography of hotels, lounges, and boutique spaces. Treatment is naturalistic with warm tones (leather, wood, natural light) — never duotone, never overlaid with brand color. Images are used at two scales: (1) full-bleed in horizontal service-category cards where the image IS the card, and (2) large 50%-width crops in blog posts. No lifestyle people-photography, no staged scenes, no abstract gradients. Where illustration appears, it's the boarding-pass green card — a flat, two-color, die-cut shape rather than a drawn illustration. Icons are minimal: a single arrow-up badge in the nav and circular arrow buttons for pagination. The visual language is restrained, photographic, and print-magazine in its crop discipline.

## Layout

Trawelt uses a max-width ~1200px content frame centered on the page, but the canvas itself is full-bleed. The page is structured as alternating dark/light bands: the hero and feature sections sit on a full-bleed Obsidian black canvas, then the blog/editorial section flips to full-bleed Linen Cream. Within the dark canvas, content alternates between centered text stacks (headline + subhead) and full-bleed horizontal-scrolling card rows. Within the light canvas, content is a two-column blog grid (image-left, text-right) with generous gutters. Vertical rhythm is spacious — section gaps of 120–187px between major bands create a slow, scroll-as-flipping-pages cadence. The persistent mint-green nav pill floats over everything, breaking the band structure and acting as a constant brand rail.

## Theme Architecture

The system is dual-theme by design: a 'Dark Mode' (Obsidian canvas + Paper White text + Forest accents) for hero, features, and conversion moments, and a 'Light Mode' (Linen Cream canvas + Obsidian text + Champagne accents) for editorial/blog content. Both modes share the same typography scale, same border-radius tokens, and the same green accent — the inversion is in canvas only. A page may freely alternate between modes section by section. The persistent mint nav bridges both themes unchanged.

## Radius System

Two production radii plus one structural radius: 10.08px for buttons and small interactive elements, 15.04px for cards and panels, 9999px for the persistent nav pill and tag chips. The near-identical 10/15 values (instead of the typical 4/8/16) give the system a softer, more rounded feel than most SaaS, but stop short of the squircle/iOS-style 20–24px. The result is a radius that feels editorial — rounded enough to be warm, sharp enough to be confident.

## Agent Prompt Guide

Quick Color Reference:
- text: #000000 (on light) / #ffffff (on dark)
- background: #e4e9dc (light sections) / #000000 (dark sections)
- border: #000000 (dominant 1px structural)
- accent: #2d9b4c (Forest Command)
- nav surface: #d3ffc3 (Mint Boarding Pass)
- primary action: #2d9b4c (filled action)

Example Component Prompts:

1. Build a hero section on a full-bleed Obsidian (#000000) canvas. Headline in Labour Grotesk weight 400, size 53px, color #ffffff, letter-spacing -0.01em, line-height 1.0. Subhead beneath at 23px, same font/weight, color #ffffff. Below, a horizontal scroll row of 4 service cards, each a full-bleed image with a 27px-padded white label in the top-left corner.

2. Create a persistent navigation pill at the top of the page: full-width, height ~70px, background #d3ffc3, border-radius 9999px. Left side: 'Trawelt' wordmark in Labour Grotesk 400 at 23px, color #000000, followed by a 40px circular badge with a 1px black border, white fill, and a black upward arrow. Right side: nav links 'Services', 'About', 'Projects', 'AgentForce', 'Blog' in Labour Grotesk 400 at 16px, color #000000, followed by a black pill button with white text 'Get in touch', padding 10px 22px, border-radius 9999px.

3. Build a blog section on a Linen Cream (#e4e9dc) full-bleed canvas. Section heading in Reckless Neue weight 250, size 39px, color #000000, letter-spacing -0.01em. Below, a two-column blog card: left column a full-bleed image, right column white (#ffffff) card with 37px padding, post title in Reckless Neue 250 at 31px color #000000, excerpt in Labour Grotesk 400 at 16px color #000000.

4. Create a centered white feature card floating on a dark hero: background #ffffff, border-radius 15.04px, padding 37px. Large text in Labour Grotesk 400 at 43px, color #000000, letter-spacing -0.01em, spanning multiple lines. A Forest Command (#2d9b4c) filled button inset at the bottom right, white text at 16px, border-radius 10.08px, padding 10px 18px.

5. Build a ghost arrow pagination button: 48px circle, 1px black border, white fill, black right-pointing arrow centered inside. Used in pairs for carousel navigation. No shadow, no fill on the inactive state.

## Similar Brands

- **Linear** — Same dark-canvas + single-accent-color discipline with very tight typographic control; both lock to a constrained weight range and use size alone for hierarchy
- **Studio Bergini** — Editorial serif headings paired with a clean grotesk for body, and the same print-magazine sectioning logic with alternating dark/light bands
- **Resend** — Persistent pill navigation, generous whitespace, and the same restraint of using one chromatic accent against an achromatic base
- **Pentagram** — Ultra-light serif display weights on large headings and a flat, border-driven (not shadow-driven) elevation philosophy

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-forest-command: #2d9b4c;
  --color-mint-boarding-pass: #d3ffc3;
  --color-champagne-beige: #e7d5ba;
  --color-linen-cream: #e4e9dc;
  --color-parchment: #efefe7;
  --color-obsidian: #000000;
  --color-paper-white: #ffffff;
  --color-carbon: #020202;

  /* Typography — Font Families */
  --font-labour-grotesk: 'Labour Grotesk', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-reckless-neue: 'Reckless Neue', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 16px;
  --leading-caption: 1.5;
  --tracking-caption: 0.01px;
  --text-body-sm: 20px;
  --leading-body-sm: 1.5;
  --text-body: 23px;
  --leading-body: 1.3;
  --text-subheading: 28px;
  --leading-subheading: 1.2;
  --text-heading-sm: 31px;
  --leading-heading-sm: 1.2;
  --text-heading: 39px;
  --leading-heading: 1.1;
  --tracking-heading: -0.01px;
  --text-heading-lg: 43px;
  --leading-heading-lg: 1.1;
  --tracking-heading-lg: -0.01px;
  --text-display: 53px;
  --leading-display: 1;
  --tracking-display: -0.01px;
  --text-mega-display: 435px;
  --leading-mega-display: 0.8;
  --tracking-mega-display: -0.072px;

  /* Typography — Weights */
  --font-weight-w250: 250;
  --font-weight-regular: 400;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-5: 5px;
  --spacing-10: 10px;
  --spacing-15: 15px;
  --spacing-17: 17px;
  --spacing-18: 18px;
  --spacing-22: 22px;
  --spacing-27: 27px;
  --spacing-30: 30px;
  --spacing-32: 32px;
  --spacing-37: 37px;
  --spacing-57: 57px;
  --spacing-63: 63px;
  --spacing-83: 83px;
  --spacing-120: 120px;
  --spacing-127: 127px;
  --spacing-187: 187px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 120-187px;
  --card-padding: 22-37px;
  --element-gap: 15-27px;

  /* Border Radius */
  --radius-lg: 10.08px;
  --radius-2xl: 15.04px;

  /* Named Radii */
  --radius-cards: 15.04px;
  --radius-buttons: 10.08px;
  --radius-navpill: 9999px;

  /* Surfaces */
  --surface-obsidian-canvas: #000000;
  --surface-paper-card: #ffffff;
  --surface-linen-page: #e4e9dc;
  --surface-parchment-card: #efefe7;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-forest-command: #2d9b4c;
  --color-mint-boarding-pass: #d3ffc3;
  --color-champagne-beige: #e7d5ba;
  --color-linen-cream: #e4e9dc;
  --color-parchment: #efefe7;
  --color-obsidian: #000000;
  --color-paper-white: #ffffff;
  --color-carbon: #020202;

  /* Typography */
  --font-labour-grotesk: 'Labour Grotesk', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-reckless-neue: 'Reckless Neue', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 16px;
  --leading-caption: 1.5;
  --tracking-caption: 0.01px;
  --text-body-sm: 20px;
  --leading-body-sm: 1.5;
  --text-body: 23px;
  --leading-body: 1.3;
  --text-subheading: 28px;
  --leading-subheading: 1.2;
  --text-heading-sm: 31px;
  --leading-heading-sm: 1.2;
  --text-heading: 39px;
  --leading-heading: 1.1;
  --tracking-heading: -0.01px;
  --text-heading-lg: 43px;
  --leading-heading-lg: 1.1;
  --tracking-heading-lg: -0.01px;
  --text-display: 53px;
  --leading-display: 1;
  --tracking-display: -0.01px;
  --text-mega-display: 435px;
  --leading-mega-display: 0.8;
  --tracking-mega-display: -0.072px;

  /* Spacing */
  --spacing-5: 5px;
  --spacing-10: 10px;
  --spacing-15: 15px;
  --spacing-17: 17px;
  --spacing-18: 18px;
  --spacing-22: 22px;
  --spacing-27: 27px;
  --spacing-30: 30px;
  --spacing-32: 32px;
  --spacing-37: 37px;
  --spacing-57: 57px;
  --spacing-63: 63px;
  --spacing-83: 83px;
  --spacing-120: 120px;
  --spacing-127: 127px;
  --spacing-187: 187px;

  /* Border Radius */
  --radius-lg: 10.08px;
  --radius-2xl: 15.04px;
}
```
