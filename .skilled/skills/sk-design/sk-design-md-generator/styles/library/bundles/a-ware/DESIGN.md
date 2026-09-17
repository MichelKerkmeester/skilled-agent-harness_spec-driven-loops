# A-WARE — Style Reference
> Apothecary editorial on warm parchment. A alpine athlete's apothecary spread: cream paper, black ink, one bronze seal, and dark glass canisters floating in generous whitespace.

**Theme:** light

A-WARE speaks in the quiet language of an editorial apothecary: vast off-white parchment surfaces, black ink typography, and a single warm bronze accent that only appears as functional punctuation. The interface is almost entirely achromatic — cream canvas, near-black text, hairline rules — letting the product photography (dark matte canisters against bright void) carry the visual weight. A condensed display face whispers authority rather than shouting it; body text uses a clean grotesk with generous tracking on labels (0.10em uppercase) to evoke pharmaceutical precision. Components are spare and geometric: ghost pill buttons, thin black dividers, product cards that float as if pinned to the page, and almost no elevation. Every screen should feel like a page torn from a premium sports-science magazine.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Obsidian Ink | `#000000` | `--color-obsidian-ink` | Primary text, hairline borders, icon strokes, button outlines — the near-total absence of color in the UI makes pure black the structural backbone |
| Paper White | `#ffffff` | `--color-paper-white` | Primary canvas, card surfaces, button text on dark fills |
| Parchment | `#f7f5ee` | `--color-parchment` | Warm off-white surface layer above the page — hero overlays, section backgrounds, and elevated product zones |
| Linen | `#ece9df` | `--color-linen` | Subtle surface step for footers and the deepest background band — barely darker than Parchment, used to create quiet zone separation |
| Graphite | `#403e3c` | `--color-graphite` | Body text secondary, form field borders — a soft black that softens dense body copy |
| Stone | `#888783` | `--color-stone` | Medium-contrast borders, control outlines, and structural separators. |
| Mist | `#b9b8b3` | `--color-mist` | Disabled borders and ultra-subtle dividers |
| Bronze Seal | `#a77a41` | `--color-bronze-seal` | Sole chromatic accent — product award seals, premium badges, decorative icon strokes. Warm against matte black, evokes a pharmacist's stamp on a label |
| Alpine Forest | `#205f4b` | `--color-alpine-forest` | Green wash for highlight backgrounds, decorative bands, and soft emphasis behind content |

## Tokens — Typography

### plantin — Display and hero headlines. The condensed proportions with extreme negative tracking (-0.43em at display sizes) create a fashion-editorial compression — a custom-feeling face that is the brand's signature. Weight 300 dominates to keep display type quiet and sophisticated rather than loud · `--font-plantin`
- **Substitute:** Playfair Display, Cormorant Garamond, or Bodoni Moda at tight tracking
- **Weights:** 300, 400
- **Sizes:** 24px, 38px
- **Line height:** 1.05–1.33
- **Letter spacing:** -0.43em at display sizes (extreme tightening), -0.02em at body display sizes
- **Role:** Display and hero headlines. The condensed proportions with extreme negative tracking (-0.43em at display sizes) create a fashion-editorial compression — a custom-feeling face that is the brand's signature. Weight 300 dominates to keep display type quiet and sophisticated rather than loud

### practice — The workhorse sans — body copy (18px/400), sub-headlines (23–25px/600), section titles (36–38px/600), and the massive 88px hero lockup. All-caps labels use 0.10em tracking to read as pharmaceutical or sports-science signage · `--font-practice`
- **Substitute:** Inter, Söhne, or Neue Haas Grotesk
- **Weights:** 400, 600
- **Sizes:** 14px, 16px, 18px, 23px, 25px, 36px, 38px, 88px
- **Line height:** 1.00–1.45
- **Letter spacing:** -0.02em (body), 0.02em (small caps), 0.04em (buttons), 0.10em (uppercase labels)
- **Role:** The workhorse sans — body copy (18px/400), sub-headlines (23–25px/600), section titles (36–38px/600), and the massive 88px hero lockup. All-caps labels use 0.10em tracking to read as pharmaceutical or sports-science signage

### lab-mono — Micro-labels, tag prefixes (NEU, VEGAN-HYBRID), ingredient metadata, footer fine print. The monospaced face reads as laboratory notepad, reinforcing the scientific-formulation angle · `--font-lab-mono`
- **Substitute:** JetBrains Mono, IBM Plex Mono, or Space Mono
- **Weights:** 400
- **Sizes:** 12px
- **Line height:** 1.33
- **Letter spacing:** -0.0200em
- **Role:** Micro-labels, tag prefixes (NEU, VEGAN-HYBRID), ingredient metadata, footer fine print. The monospaced face reads as laboratory notepad, reinforcing the scientific-formulation angle

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.33 | — | `--text-caption` |
| body-sm | 14px | 1.4 | 0.4px | `--text-body-sm` |
| body | 16px | 1.45 | -0.32px | `--text-body` |
| subheading | 23px | 1.2 | -0.46px | `--text-subheading` |
| heading-sm | 25px | 1.19 | -0.5px | `--text-heading-sm` |
| heading | 38px | 1.05 | -16.34px | `--text-heading` |
| display | 88px | 1 | -37.84px | `--text-display` |

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
| 48 | 48px | `--spacing-48` |
| 64 | 64px | `--spacing-64` |
| 72 | 72px | `--spacing-72` |
| 80 | 80px | `--spacing-80` |
| 96 | 96px | `--spacing-96` |
| 160 | 160px | `--spacing-160` |
| 220 | 220px | `--spacing-220` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 12px |
| badges | 6px |
| images | 6px |
| inputs | 6px |
| buttons | 32px |

### Layout

- **Page max-width:** 1400px
- **Section gap:** 96px
- **Card padding:** 32px
- **Element gap:** 24px

## Components

### Ghost Pill Button
**Role:** Primary action (CTA, navigation to shop, learn more)

32px border-radius, 12px vertical / 24px horizontal padding, 1px Obsidian Ink border, transparent fill, practice 600 at 16px with 0.04em tracking uppercase, Obsidian Ink text. Arrow icon appended. The pill geometry with thin black outline is the brand's signature interactive element.

### Outlined Image Card (Product Category)
**Role:** Hero product showcase — Protein, Hydration lines

Two-column split with 50/50 division, no border or shadow on the container itself. Each side features a centered product image (dark canister) floating on Parchment surface, oversized plantin wordmark (PROTEINE, HYDRATION) behind/around the product, bulleted feature list in practice 400/16, ghost pill 'MEHR' button below.

### Announcement Bar
**Role:** Top-of-page shipping/notice strip

Alpine Forest (#205f4b) full-width bar, 8–12px vertical padding, practice 400/12–14px white text, centered. Delivers operational information without competing with the hero.

### Product Canister Card
**Role:** Individual product showcase in collection grids

Three-column row on Parchment background. Canister image rendered at ~200px wide with a soft diffuse shadow (rgba(0,0,0,0.08) 20px blur, 8px y-offset), angled diagonally tag (lab-mono 12px uppercase, 0.10em tracking), product name in practice 600/16px below.

### Editorial Header (IAG. Lockup)
**Role:** Centered section header with custom wordmark

Stacks the brand mark (A-WARE) above a bold fragment (IAG.) in plantin or practice 600/38px, followed by a centered serif-style intro sentence at 23–25px/1.4 max-width ~640px. All centered, max-width 720px container.

### Minimal Top Nav
**Role:** Primary site navigation

Transparent over hero, white background on scroll. Three left-aligned links (SHOP, ABOUT, BLOG), brand mark centered, three right-aligned icons (LOGIN, search, cart). Practice 600/14px uppercase with 0.04em tracking. No background fill when over hero photography.

### Diagonal Category Tag
**Role:** Annotation badge for new or special products

lab-mono 12px uppercase, 0.10em tracking, rotated -8 to -12 degrees, positioned at top-left of product image. No background — just rotated text. Signals 'NEU' or 'VEGAN-HYBRID' with editorial restraint.

### Hero Photography Block
**Role:** Full-bleed brand imagery backdrop

Full viewport width, 60–80vh height, dark-treated outdoor photography. Massive practice 88px white wordmark (A-WARE) overlaid at slight angle or left-aligned, practice 600/36–38px sub-headline at bottom-left, ghost pill button at bottom-right. No gradient overlay — the text sits directly on the photograph.

### Feature Bulleted List
**Role:** Product benefits and specs inline

Unordered list with custom checkmark prefix in Obsidian Ink. Practice 400/16px, -0.02em tracking, line-height 1.45. Items prefixed by a small geometric tick (√ or +). No background, tight vertical rhythm at 8px row gap.

### Footer
**Role:** Site footer

Linen (#ece9df) background, simple column structure with practice 400/14px links, lab-mono 12px copyright. Generous vertical padding (64–80px). Hairline Obsidian Ink 1px top border.

## Do's and Don'ts

### Do
- Use 32px border-radius for all interactive elements (buttons, tags) — the pill shape is the brand's interactive signature
- Keep 0.10em letter-spacing on all uppercase labels (lab-mono 12px or practice 14px) — this tracking reads as pharmaceutical signage
- Reserve #a77a41 Bronze Seal exclusively for award badges and product seals on the product itself — never use it for UI buttons, text, or backgrounds
- Set body text to practice 400/16–18px with -0.02em tracking — the slight tightening is essential to the editorial feel
- Use #f7f5ee Parchment for any section that introduces a product or feature set — white is for content, parchment is for showcase
- Apply the diagonal lab-mono tag (-10° rotation) to any product labeled new, limited, or vegan-hybrid
- Let product photography carry the color and mood — never overlay gradients, tints, or color washes on hero images

### Don't
- Don't use filled colored buttons — every action is a Ghost Pill with black outline, including CTAs
- Don't introduce additional accent colors — the entire system is achromatic plus one Bronze Seal
- Don't use heavy drop shadows on cards or containers — products float with a soft diffuse shadow only
- Don't set headlines in bold weights above 600 — the brand whispers authority through plantin 300 and practice 600
- Don't break the two-tone surface system (white and Parchment) with grays for backgrounds — use only these two for content zones
- Don't use the Bronze Seal on text, links, or hover states — it is a physical-seal metaphor, not an interactive accent
- Don't use centered or right-aligned body paragraphs — editorial body copy is always left-aligned and max-width 640–720px

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Page Canvas | `#ffffff` | Base background for most product and content sections |
| 1 | Parchment Zone | `#f7f5ee` | Warm cream band used for product showcases, category dividers, and elevated content blocks |
| 2 | Linen Band | `#ece9df` | Footer and deepest background tier — used sparingly for zone separation |
| 3 | Alpine Bar | `#205f4b` | Top announcement strip only |

## Elevation

Elevation is achieved through product photography and generous whitespace, not drop shadows. The only consistent shadow is a soft diffuse beneath product canister images, giving the impression of objects floating on the page rather than sitting inside a card.

## Imagery

Photography is the dominant visual element — dark, moody, outdoor lifestyle imagery (cyclists, mountain landscapes) treated at full-bleed with no overlay, allowing the natural lighting to create contrast against white type. Product photography features matte black cylindrical canisters (PRO, ELITE, ADD+) shot straight-on on pure Parchment surfaces with soft directional shadows that make the containers feel pinned to the page. No illustration, no 3D renders, no abstract graphics. The single chromatic accent (#a77a41 Bronze Seal) appears only as a circular award badge on the ELITE Hydration canister — otherwise the system is purely photographic and typographic.

## Layout

Full-bleed editorial layout: hero photography stretches edge-to-edge at 60–80vh, then transitions to centered max-width 1400px content sections on Parchment or white. Product showcases use 50/50 two-column splits rather than grid systems. Below the fold, three-column product rows introduce rhythm. Navigation is a minimal transparent bar that becomes white on scroll. Generous vertical section gaps (80–120px) between major bands create a magazine-spread pace. Content alternates between full-bleed image bands, centered editorial blocks, and split text+product sections — never repeating the same layout twice in succession.

## Agent Prompt Guide

**Quick Color Reference**
- text: #000000 Obsidian Ink
- background: #ffffff Paper White (canvas), #f7f5ee Parchment (elevated zone)
- border: #000000 Obsidian Ink (hairline 1px)
No distinct primary action color was observed; use the extracted neutral button treatments instead of inventing a filled CTA color.
- primary action: no distinct CTA color

**Example Component Prompts**
1. Build a Ghost Pill Button: 32px border-radius, 1px solid #000000 border, transparent background, 12px 24px padding, practice 600/16px uppercase, 0.04em letter-spacing, #000000 text, arrow icon trailing. No fill, ever.
2. Build a Product Canister Card: centered on #f7f5ee Parchment surface, 200px product image with soft shadow (0 8px 20px rgba(0,0,0,0.08)), lab-mono 12px diagonal tag at top-left (-10° rotation, 'NEU' or similar), product name in practice 600/16px below image, #000000 text.
3. Build a Hero Photography Block: full-bleed, 70vh, dark outdoor photograph as background. Overlay practice 600/88px white 'A-WARE' wordmark at top-left, practice 600/36px white sub-headline at bottom-left, Ghost Pill Button at bottom-right with white border and white text.
4. Build an Editorial Section Header: centered, max-width 720px. Brand mark in plantin 300/38px, bold fragment below in practice 600/38px, intro sentence in plantin or practice 400/23px line-height 1.4, all in #000000 on Parchment background.
5. Build a Feature Bulleted List: no background, practice 400/16px, -0.02em tracking, each item prefixed with a small #000000 checkmark glyph, 8px vertical gap between items, #000000 text.

## Similar Brands

- **On Running** — Same premium athletic aesthetic — full-bleed dark outdoor photography, all-caps minimalist nav, single-color product line, and editorial restraint
- **Aesop** — Apothecary-philosophy design with off-white surfaces, serif display type, monochrome product photography, and pill-shaped ghost buttons
- **Maap** — Cycling-apparel brand with massive condensed display type overlaid on dark photography and ultra-minimal achromatic product UI
- **Eight Sleep** — Premium hardware brand using ghost outlined CTAs, cream surfaces, condensed display serif, and single accent color discipline

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-obsidian-ink: #000000;
  --color-paper-white: #ffffff;
  --color-parchment: #f7f5ee;
  --color-linen: #ece9df;
  --color-graphite: #403e3c;
  --color-stone: #888783;
  --color-mist: #b9b8b3;
  --color-bronze-seal: #a77a41;
  --color-alpine-forest: #205f4b;

  /* Typography — Font Families */
  --font-plantin: 'plantin', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-practice: 'practice', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-lab-mono: 'lab-mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.33;
  --text-body-sm: 14px;
  --leading-body-sm: 1.4;
  --tracking-body-sm: 0.4px;
  --text-body: 16px;
  --leading-body: 1.45;
  --tracking-body: -0.32px;
  --text-subheading: 23px;
  --leading-subheading: 1.2;
  --tracking-subheading: -0.46px;
  --text-heading-sm: 25px;
  --leading-heading-sm: 1.19;
  --tracking-heading-sm: -0.5px;
  --text-heading: 38px;
  --leading-heading: 1.05;
  --tracking-heading: -16.34px;
  --text-display: 88px;
  --leading-display: 1;
  --tracking-display: -37.84px;

  /* Typography — Weights */
  --font-weight-light: 300;
  --font-weight-regular: 400;
  --font-weight-semibold: 600;

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
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-72: 72px;
  --spacing-80: 80px;
  --spacing-96: 96px;
  --spacing-160: 160px;
  --spacing-220: 220px;

  /* Layout */
  --page-max-width: 1400px;
  --section-gap: 96px;
  --card-padding: 32px;
  --element-gap: 24px;

  /* Border Radius */
  --radius-md: 6px;
  --radius-xl: 12px;
  --radius-3xl: 32px;

  /* Named Radii */
  --radius-cards: 12px;
  --radius-badges: 6px;
  --radius-images: 6px;
  --radius-inputs: 6px;
  --radius-buttons: 32px;

  /* Surfaces */
  --surface-page-canvas: #ffffff;
  --surface-parchment-zone: #f7f5ee;
  --surface-linen-band: #ece9df;
  --surface-alpine-bar: #205f4b;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-obsidian-ink: #000000;
  --color-paper-white: #ffffff;
  --color-parchment: #f7f5ee;
  --color-linen: #ece9df;
  --color-graphite: #403e3c;
  --color-stone: #888783;
  --color-mist: #b9b8b3;
  --color-bronze-seal: #a77a41;
  --color-alpine-forest: #205f4b;

  /* Typography */
  --font-plantin: 'plantin', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-practice: 'practice', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-lab-mono: 'lab-mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.33;
  --text-body-sm: 14px;
  --leading-body-sm: 1.4;
  --tracking-body-sm: 0.4px;
  --text-body: 16px;
  --leading-body: 1.45;
  --tracking-body: -0.32px;
  --text-subheading: 23px;
  --leading-subheading: 1.2;
  --tracking-subheading: -0.46px;
  --text-heading-sm: 25px;
  --leading-heading-sm: 1.19;
  --tracking-heading-sm: -0.5px;
  --text-heading: 38px;
  --leading-heading: 1.05;
  --tracking-heading: -16.34px;
  --text-display: 88px;
  --leading-display: 1;
  --tracking-display: -37.84px;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-36: 36px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-72: 72px;
  --spacing-80: 80px;
  --spacing-96: 96px;
  --spacing-160: 160px;
  --spacing-220: 220px;

  /* Border Radius */
  --radius-md: 6px;
  --radius-xl: 12px;
  --radius-3xl: 32px;
}
```
