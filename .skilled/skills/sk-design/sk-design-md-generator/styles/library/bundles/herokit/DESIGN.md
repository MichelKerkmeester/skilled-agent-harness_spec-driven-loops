# HeroKit — Style Reference
> Pale lemon neon on an obsidian void — an editorial poster that happens to be a product page.

**Theme:** dark

HeroKit uses an obsidian-canvas, neon-punctuation language: pure black surfaces swallow the page, and a single pale lemon yellow #ffffa7 is the entire chromatic vocabulary for action and brand identity. Display type is huge, tight-tracked PP Neue Montreal at 100–120px with negative tracking around -4.8px, giving headlines a compressed, editorial-poster feel that dominates the hero and section openers. The product speaks through 3D bubbly, organic renders rather than photography or flat illustration, floating against the void like jellyfish under spotlight. Components stay light: thin borders, 8px radii, no drop shadows, no gradients — structure is implied through contrast and whitespace rather than elevation. Density is generous; the site breathes because the product visuals do the heavy work.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Pale Lemon | `#ffffa7` | `--color-pale-lemon` | Primary action fill, brand accent, hero section wash, badge labels — the single chromatic voice of the entire system |
| Electric Yellow | `#fddd05` | `--color-electric-yellow` | Yellow outline accent for tags, dividers, and focused UI edges. Do not promote it to the primary CTA color |
| Obsidian | `#000000` | `--color-obsidian` | Page canvas, card surfaces, text on light fills, hairline dividers, image borders — the base everything floats on |
| Paper | `#ffffff` | `--color-paper` | Primary text on dark, card surface alt, heading strokes, inverted button text |
| Graphite | `#333333` | `--color-graphite` | Muted heading strokes, de-emphasized outline text, secondary borders on dark |
| Mist | `#999999` | `--color-mist` | Body subtext, link idle state, tertiary metadata — the only neutral that softens body copy without going silver |
| Steel | `#808080` | `--color-steel` | Captions, helper text, dense metadata rows, low-emphasis body |

## Tokens — Typography

### PP Neue Montreal — Primary face across body, navigation, subheadings, and display. The custom geometric grotesque carries the entire brand voice: tight tracking at display sizes (up to -4.8px at 120px) compresses headlines into editorial-poster blocks, while relaxed tracking at body keeps 16px reading clean. Single weight 400 used throughout — weight does not differentiate hierarchy; size and color do. · `--font-pp-neue-montreal`
- **Substitute:** Inter, General Sans, Satoshi
- **Weights:** 400
- **Sizes:** 16px, 20px, 30px, 32px, 50px, 120px, 144px
- **Line height:** 1.0–1.4
- **Letter spacing:** -0.0100em at body, -0.0200em at subheading/heading, -0.0400em at display
- **Role:** Primary face across body, navigation, subheadings, and display. The custom geometric grotesque carries the entire brand voice: tight tracking at display sizes (up to -4.8px at 120px) compresses headlines into editorial-poster blocks, while relaxed tracking at body keeps 16px reading clean. Single weight 400 used throughout — weight does not differentiate hierarchy; size and color do.

### PP Neue Montreal Medium — Navigation and select body emphasis at the 16px size — the only place a medium weight appears, used to give nav links a subtle lift over body text without breaking the single-weight visual rhythm · `--font-pp-neue-montreal-medium`
- **Substitute:** Inter Medium, General Sans Medium
- **Weights:** 500
- **Sizes:** 16px
- **Line height:** 1.2
- **Letter spacing:** -0.0100em
- **Role:** Navigation and select body emphasis at the 16px size — the only place a medium weight appears, used to give nav links a subtle lift over body text without breaking the single-weight visual rhythm

### ABC Monument Grotesk — Alternate display face for the largest hero statement — a wider, more architectural grotesque that provides a second editorial voice at maximum scale without competing with PP Neue Montreal elsewhere · `--font-abc-monument-grotesk`
- **Substitute:** Druk Wide, NB Architekt
- **Weights:** 400
- **Sizes:** 120px
- **Line height:** 1.0
- **Letter spacing:** -0.0400em
- **Role:** Alternate display face for the largest hero statement — a wider, more architectural grotesque that provides a second editorial voice at maximum scale without competing with PP Neue Montreal elsewhere

### System Sans-Serif — Micro labels, copyright, legal footnotes — the only size at which the system stack appears, keeping fine print neutral and invisible · `--font-system-sans-serif`
- **Substitute:** system-ui, -apple-system, Segoe UI
- **Weights:** 400
- **Sizes:** 12px
- **Line height:** 1.2
- **Role:** Micro labels, copyright, legal footnotes — the only size at which the system stack appears, keeping fine print neutral and invisible

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.2 | — | `--text-caption` |
| body-sm | 16px | 1.4 | -0.16px | `--text-body-sm` |
| body | 20px | 1.3 | -0.2px | `--text-body` |
| subheading | 30px | 1.2 | -0.6px | `--text-subheading` |
| heading | 32px | 1.2 | -0.64px | `--text-heading` |
| heading-lg | 50px | 1.08 | -1px | `--text-heading-lg` |
| display | 120px | 1 | -4.8px | `--text-display` |
| display-lg | 144px | 1 | -4.8px | `--text-display-lg` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 8 | 8px | `--spacing-8` |
| 12 | 12px | `--spacing-12` |
| 16 | 16px | `--spacing-16` |
| 20 | 20px | `--spacing-20` |
| 24 | 24px | `--spacing-24` |
| 32 | 32px | `--spacing-32` |
| 36 | 36px | `--spacing-36` |
| 40 | 40px | `--spacing-40` |
| 64 | 64px | `--spacing-64` |
| 80 | 80px | `--spacing-80` |
| 128 | 128px | `--spacing-128` |
| 192 | 192px | `--spacing-192` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 8px |
| cards | 8px |
| images | 8px |
| inputs | 8px |
| buttons | 8px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 20px
- **Element gap:** 10px

## Components

### Primary Filled Button (Pale Lemon)
**Role:** Default action for sign-up, CTA on the hero, and product entry points

Background #ffffa7, text #000000, 8px radius, 14px 20px padding, PP Neue Montreal 16px weight 400, letter-spacing -0.16px. No border. The Pale Lemon fill against Obsidian creates the system's only color contrast — this button should appear sparingly, one per viewport maximum.

### Primary Filled Button (Electric Yellow)
**Role:** High-emphasis CTA in the navigation bar (Try for free)

Background #fddd05, text #000000, 8px radius, 8px 16px padding, 16px weight 400. Sits in the top-right nav. Slightly smaller and more saturated than the Pale Lemon variant — this is the always-visible conversion entry point.

### Ghost Navigation Link
**Role:** Nav items: How it works, Pricing, Login

No background, text #ffffff, PP Neue Montreal Medium 16px, 14px padding vertical. Underline absent. Hover state inverts to Pale Lemon fill with #000000 text.

### Outlined Ghost Button
**Role:** Secondary action, e.g. 'Get started for free' on dark sections

Background transparent, border 1px #ffffff, text #ffffff, 8px radius, 8px 16px padding. Used when a Pale Lemon filled button would steal too much attention on a dark section.

### Product Gallery Card
**Role:** Showcase individual 3D hero assets in the gallery grid

Background #000000, 1px border #333333, 8px radius, 20px padding. Image fills the card body edge-to-edge. Footer row contains a Pale Lemon status dot, small 'HERO' label in #ffffff, and an asset name in #999999. Card is inert — no hover elevation, no scale.

### Hero Section
**Role:** Above-the-fold headline + visual introduction

Full-bleed Pale Lemon #ffffa7 background. Display headline at 120px PP Neue Montreal, #000000, line-height 1.0, letter-spacing -4.8px. Subhead at 20px weight 400 #000000 max-width ~480px. CTA button group below. Right side occupied by a floating 3D render (warm amber bubbles) that bleeds off the canvas edges. 80px section padding.

### Browser Frame Mockup
**Role:** Display product screenshots inside a stylized browser chrome

Black 1px border, 8px radius, dark interior #0a0a0a. Top bar contains three traffic-light dots in #808080. Content area fills with a product screenshot or animation. The frame sits centered on the Obsidian canvas with generous 80–120px margin.

### Logo Sticker Strip
**Role:** Social proof — platforms HeroKit integrates with

Single horizontal row of platform logos (Wix, Squarespace, WordPress, Framer, Webflow) rendered in white on Obsidian. Small caption 'Works with your favorite site builder' at 12px above. No cards, no borders, no hover — logos float directly on the canvas.

### Status Badge Dot
**Role:** Inline indicator on cards and metadata rows

6px filled circle in Pale Lemon #ffffa7 paired with 12px uppercase label in #ffffff. No border, no padding around the dot. Signals 'live' or 'new' state on product entries.

### Asset Tag (HERO label)
**Role:** Category label on each product gallery card

12px PP Neue Montreal weight 400 uppercase, text #ffffff, bullet separator between dot and label. Appears in the footer of every Product Gallery Card.

### Sticky Top Navigation
**Role:** Persistent site-wide header

Height ~56px, background transparent or Obsidian #000000 on scroll, full-bleed. Left: HeroKit wordmark in white with small lemon-yellow bolt icon. Right: three ghost nav links + Electric Yellow 'Try for free' button, 10px gap between elements. No drop shadow, no border bottom.

### 3D Product Render
**Role:** Primary visual content — the product IS the imagery

Tight crop of a 3D asset (bubbles, blobs, abstract organic forms) rendered in warm amber/peach or saturated single-hue palettes. Always contained within 8px radius frames on gallery cards, or full-bleed in hero/section openers. No lifestyle context, no human subjects — the object is the hero.

## Do's and Don'ts

### Do
- Use Pale Lemon #ffffa7 as the only chromatic action color — one filled button per viewport, maximum
- Set display headlines at 100–120px with letter-spacing -4.8px and line-height 1.0 for editorial compression
- Apply 8px radius to every interactive element and card — never mix in larger curves
- Keep the canvas pure #000000 for all non-hero sections; reserve Pale Lemon background for at most one full-bleed section per page
- Differentiate hierarchy through size and color, not weight — PP Neue Montreal ships at 400 only
- Let 3D renders bleed off canvas edges in hero/section openers; contain them in 8px-radius cards inside the gallery
- Maintain 80px section gaps and 10px element gaps; the generous negative space is what makes the minimal palette feel premium

### Don't
- Never introduce a second chromatic accent — the brand speaks in lemon yellow, obsidian, and paper only
- Never use drop shadows or scale-on-hover to imply elevation; use 1px #333333 borders or color contrast instead
- Never set body type below 16px or above 20px — the scale jumps from 20px body to 30px subheading deliberately
- Never mix multiple border radii; 8px is the only value across buttons, cards, tags, and inputs
- Never place Pale Lemon on a light section background — the contrast only works against Obsidian #000000
- Never add gradients to UI surfaces; the product sells flat 3D renders, the chrome must stay matte
- Never center-align body copy or nav items; the system is left-anchored, editorial-style

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Obsidian Void | `#000000` | Page canvas, product gallery backdrop, full-bleed sections |
| 1 | Card Surface | `#000000` | Product cards and feature tiles — distinguished from canvas by 1px border, not by a lighter fill |
| 2 | Inverted Surface | `#ffffff` | Rare light sections, footer blocks, inverted control backgrounds |
| 3 | Pale Lemon Wash | `#ffffa7` | Hero section background — a single full-bleed chromatic moment that signals the brand's only color |

## Elevation

- **Product Gallery Card:** `none — distinguished by 1px #333333 border only`
- **Navigation Bar:** `none — flat against canvas`
- **Hero Section:** `none — Pale Lemon background defines its own plane`
- **Browser Frame Mockup:** `none — 1px border only`

## Imagery

The visual language is entirely 3D-rendered abstract forms: warm amber bubble clusters, metallic sculptural blobs, kinetic typographic shapes, and fractal gradient washes. These are the product — the site sells 3D hero assets, so every illustration is a self-referential showcase. Treatment is tight-crop, contained within 8px radius frames on gallery cards, or full-bleed in hero/section openers with forms bleeding off the canvas edge. No photography, no flat illustration, no human subjects. Icon style is minimal: small monogram-style logos for partner platforms, a single brand bolt icon, and tiny status dots — all mono, no decoration.

## Layout

Full-bleed sections that alternate between Obsidian #000000 and rare Pale Lemon #ffffa7 washes. The hero is a split layout: headline+CTA anchored left at max-width 480px, floating 3D render bleeding off the right edge. Below the hero, sections stack vertically with 80px gaps, content centered at max-width 1200px. Product gallery is a 3-column grid of cards with 10px gutters, allowing the dark cards to create a subtle grid pattern against the canvas. Navigation is a single sticky top bar, minimal and transparent. The page rhythm is: bold hero → trust strip → product showcase → feature deep-dives → CTA close. No sidebar, no mega-menu, no secondary nav.

## Agent Prompt Guide

Quick Color Reference:
- text: #000000 (on light) or #ffffff (on dark)
- background: #000000 (page), #ffffa7 (hero wash)
- border: #333333 (subtle), #ffffff (inverted)
- accent: #ffffa7 (brand single accent)
- primary action: #ffffa7 (filled action)

Example Component Prompts:

1. Create a Primary Action Button: #ffffa7 background, #000000 text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.

2. Create a product gallery card: #000000 background, 1px #333333 border, 8px radius, 20px padding. 3D render fills the card body. Footer row with a 6px #ffffa7 status dot, 12px 'HERO' label in #ffffff, asset name in #999999. No hover state, no shadow.

3. Create the sticky top navigation: transparent background over Obsidian canvas, height 56px. Left: 'HeroKit' wordmark in #ffffff with a small lemon bolt icon. Right: three ghost links (#ffffff text, 16px PP Neue Montreal Medium) spaced 10px apart, then an Electric Yellow #fddd05 'Try for free' button with #000000 text, 8px radius, 8px 16px padding.

4. Create a browser frame mockup: 1px #ffffff border, 8px radius, dark #0a0a0a interior, centered on Obsidian canvas with 100px top/bottom margin. Top bar contains three 6px #808080 traffic-light dots. Content area shows a product screenshot filling the frame.

5. Create a section divider: full-bleed #000000, 80px vertical padding, centered PP Neue Montreal 50px weight 400 headline in #ffffff with letter-spacing -1.0px, followed by a single Pale Lemon #ffffa7 filled CTA button below.

## Typography Rhythm

The type system is built on extreme size jumps: 12px → 16px → 20px → 30px → 50px → 120px. There are no intermediate sizes. This creates a poster-like rhythm where body and display are visually far apart, forcing clear sectioning. Tracking tightens as size grows: -0.16px at body, -0.6px at subheading, -4.8px at display. Negative space between type sizes is part of the visual language — never bridge the gap with a 24px or 40px size.

## Single-Color Brand Discipline

Pale Lemon #ffffa7 carries the entire brand identity. It appears as: hero section background, primary button fill, status dot, logo accent, and the sole chromatic note in an otherwise monochrome system. The discipline is to never dilute it — if a screen needs more color, the answer is grayscale contrast, not a second hue. This is what makes HeroKit instantly recognizable in a feed of dark-mode SaaS sites: it commits to one color the way a print magazine commits to one ink.

## Similar Brands

- **Spline** — Same Obsidian-canvas + single neon accent approach, 3D product renders as primary visual content, tight geometric display type
- **Linear** — Same near-monochrome dark palette with one chromatic punctuation color, editorial-poster display headlines, zero drop shadows
- **Vercel** — Same black-canvas minimalism with sparse bright accent, thin borders over elevation, geometric grotesque typography
- **Stripe** — Same tight-tracked large display type and generous negative space; both treat whitespace as a primary design material
- **Framer** — Same product-as-imagery ethos where 3D renders and animated visuals float on a dark canvas with minimal chrome

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-pale-lemon: #ffffa7;
  --color-electric-yellow: #fddd05;
  --color-obsidian: #000000;
  --color-paper: #ffffff;
  --color-graphite: #333333;
  --color-mist: #999999;
  --color-steel: #808080;

  /* Typography — Font Families */
  --font-pp-neue-montreal: 'PP Neue Montreal', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-pp-neue-montreal-medium: 'PP Neue Montreal Medium', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-abc-monument-grotesk: 'ABC Monument Grotesk', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-system-sans-serif: 'System Sans-Serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.2;
  --text-body-sm: 16px;
  --leading-body-sm: 1.4;
  --tracking-body-sm: -0.16px;
  --text-body: 20px;
  --leading-body: 1.3;
  --tracking-body: -0.2px;
  --text-subheading: 30px;
  --leading-subheading: 1.2;
  --tracking-subheading: -0.6px;
  --text-heading: 32px;
  --leading-heading: 1.2;
  --tracking-heading: -0.64px;
  --text-heading-lg: 50px;
  --leading-heading-lg: 1.08;
  --tracking-heading-lg: -1px;
  --text-display: 120px;
  --leading-display: 1;
  --tracking-display: -4.8px;
  --text-display-lg: 144px;
  --leading-display-lg: 1;
  --tracking-display-lg: -4.8px;

  /* Typography — Weights */
  --font-weight-regular: 400;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-36: 36px;
  --spacing-40: 40px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-128: 128px;
  --spacing-192: 192px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 20px;
  --element-gap: 10px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-2xl: 16px;

  /* Named Radii */
  --radius-tags: 8px;
  --radius-cards: 8px;
  --radius-images: 8px;
  --radius-inputs: 8px;
  --radius-buttons: 8px;

  /* Surfaces */
  --surface-obsidian-void: #000000;
  --surface-card-surface: #000000;
  --surface-inverted-surface: #ffffff;
  --surface-pale-lemon-wash: #ffffa7;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-pale-lemon: #ffffa7;
  --color-electric-yellow: #fddd05;
  --color-obsidian: #000000;
  --color-paper: #ffffff;
  --color-graphite: #333333;
  --color-mist: #999999;
  --color-steel: #808080;

  /* Typography */
  --font-pp-neue-montreal: 'PP Neue Montreal', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-pp-neue-montreal-medium: 'PP Neue Montreal Medium', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-abc-monument-grotesk: 'ABC Monument Grotesk', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-system-sans-serif: 'System Sans-Serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.2;
  --text-body-sm: 16px;
  --leading-body-sm: 1.4;
  --tracking-body-sm: -0.16px;
  --text-body: 20px;
  --leading-body: 1.3;
  --tracking-body: -0.2px;
  --text-subheading: 30px;
  --leading-subheading: 1.2;
  --tracking-subheading: -0.6px;
  --text-heading: 32px;
  --leading-heading: 1.2;
  --tracking-heading: -0.64px;
  --text-heading-lg: 50px;
  --leading-heading-lg: 1.08;
  --tracking-heading-lg: -1px;
  --text-display: 120px;
  --leading-display: 1;
  --tracking-display: -4.8px;
  --text-display-lg: 144px;
  --leading-display-lg: 1;
  --tracking-display-lg: -4.8px;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-36: 36px;
  --spacing-40: 40px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-128: 128px;
  --spacing-192: 192px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-2xl: 16px;
}
```
