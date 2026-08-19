# Fabric — Style Reference
> editorial manuscript on a drafting table

**Theme:** light

Fabric uses an editorial-document language: white canvas, near-monochrome surfaces, and a single editorial serif headline that gives the workspace a literary, almost manuscript-like gravity. The product lives in a tight grayscale world — black text, white surfaces, hairline borders, and almost no color — punctuated by a single vivid electric-violet glow that appears as soft shadows, focus halos, and accent washes rather than fills. Inter handles all UI and body text at compact, confident sizes, while GT Alpina Light whispers the brand promise in weight-300 serif at 80px. Components are paper-thin: cards with 16px radii, dark filled CTAs (#0a0a0a) with 8px radii, ghost links drawn in deep indigo with a 1px underline, and shadows so subtle they register as paper grain rather than elevation. The system feels like a writer's drafting table — calm, restrained, deeply considered, with one bright violet mark on the page.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Electric Violet | `#1100ff` | `--color-electric-violet` | Brand accent — vivid glow halos behind product cards, focus ring washes, decorative shadow tint. Appears sparingly as a soft aura, never as a filled surface or text color |
| Ink Violet | `#19154e` | `--color-ink-violet` | Link color and ghost-action border — underlined hyperlinks, outlined action borders, link text. The only chromatic text color in the system |
| Press Black | `#0a0a0a` | `--color-press-black` | Primary action background, heading text, nav backgrounds. Used for filled CTA buttons and the heaviest typographic weight in the system |
| Carbon | `#000000` | `--color-carbon` | Universal border color and high-emphasis text. The system draws most structural borders in pure black at hairline weights |
| Paper White | `#ffffff` | `--color-paper-white` | Page canvas, card surfaces, button text on dark fills, inverse text. The dominant background throughout |
| Newsprint | `#f3f3f3` | `--color-newsprint` | Subtle surface lift — secondary card backgrounds, hover fills, input resting states. One step off white for quiet differentiation |
| Graphite | `#666666` | `--color-graphite` | Muted body text, helper text, secondary labels, nav inactive items. The workhorse gray for de-emphasized content |
| Slate | `#333333` | `--color-slate` | Secondary heading text, emphasized body copy, card titles. One step lighter than Press Black for sub-headlines |
| Pewter | `#404040` | `--color-pewter` | Tertiary text, nav secondary items, metadata. Between Graphite and Slate in the gray scale |
| Ash | `#b3b3b3` | `--color-ash` | Medium-contrast borders, control outlines, and structural separators. Do not promote it to the primary CTA color |
| Smoke | `#737373` | `--color-smoke` | Subtle borders, icon stroke at reduced weight, tertiary metadata text |

## Tokens — Typography

### sans-serif — sans-serif — detected in extracted data but not described by AI · `--font-sans-serif`
- **Weights:** 400
- **Sizes:** 12px
- **Line height:** 1.2
- **OpenType features:** `"ccmp", "cv05", "cv11", "kern", "salt"`
- **Role:** sans-serif — detected in extracted data but not described by AI

### GT Alpina Light — Display serif for hero headlines and section titles — the signature typographic choice. Weight 300 at 80px with -0.02em letter-spacing creates a literary, anti-SaaS gravity. No other productivity app uses a light serif at this scale; it positions Fabric as a thinking tool, not a dashboard. · `--font-gt-alpina-light`
- **Substitute:** Cormorant Garamond Light, Lora Light, Playfair Display
- **Weights:** 300, 400
- **Sizes:** 32px, 52px, 80px
- **Line height:** 1.08, 1.40
- **Letter spacing:** -0.02em at all display sizes
- **Role:** Display serif for hero headlines and section titles — the signature typographic choice. Weight 300 at 80px with -0.02em letter-spacing creates a literary, anti-SaaS gravity. No other productivity app uses a light serif at this scale; it positions Fabric as a thinking tool, not a dashboard.

### Inter — Body, UI labels, nav items, button text, and subheadings. Weight 400 for body, 500 for emphasis, 600 for button labels and strong UI elements. Negative tracking (-0.01em to -0.02em) at larger sizes tightens the geometric forms for a compact, efficient feel. · `--font-inter`
- **Substitute:** system-ui, -apple-system, Segoe UI
- **Weights:** 400, 500, 600
- **Sizes:** 11px, 15px, 16px, 17px, 18px, 26px, 28px
- **Line height:** 1.20, 1.30, 1.40, 1.45, 1.50, 1.60, 2.00
- **Letter spacing:** -0.02em at 28px, -0.015em at 26px, -0.01em at 18px, +0.01em at 11px
- **Role:** Body, UI labels, nav items, button text, and subheadings. Weight 400 for body, 500 for emphasis, 600 for button labels and strong UI elements. Negative tracking (-0.01em to -0.02em) at larger sizes tightens the geometric forms for a compact, efficient feel.

### Manrope — Decorative heading weight — appears in badge labels and small-caps-style category tags. Used sparingly to add visual weight without serif gravitas. · `--font-manrope`
- **Substitute:** Plus Jakarta Sans Bold, Space Grotesk Bold
- **Weights:** 700, 900
- **Sizes:** 18px
- **Line height:** 1.40
- **Role:** Decorative heading weight — appears in badge labels and small-caps-style category tags. Used sparingly to add visual weight without serif gravitas.

### system-ui — Micro-copy and icon-adjacent labels. System fallback ensures pixel-perfect rendering for tiny utility text. · `--font-system-ui`
- **Weights:** 400
- **Sizes:** 
- **Line height:** 1.20
- **OpenType features:** `"ccmp", "cv05", "cv11", "kern", "salt"`
- **Role:** Micro-copy and icon-adjacent labels. System fallback ensures pixel-perfect rendering for tiny utility text.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 11px | 1.2 | 0.11px | `--text-caption` |
| body | 16px | 1.5 | -0.16px | `--text-body` |
| body-lg | 18px | 1.4 | -0.18px | `--text-body-lg` |
| subheading | 28px | 1.3 | -0.56px | `--text-subheading` |
| heading | 52px | 1.08 | -1.04px | `--text-heading` |
| display | 80px | 1.08 | -1.6px | `--text-display` |

## Tokens — Spacing & Shapes

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 5 | 5px | `--spacing-5` |
| 6 | 6px | `--spacing-6` |
| 7 | 7px | `--spacing-7` |
| 10 | 10px | `--spacing-10` |
| 12 | 12px | `--spacing-12` |
| 14 | 14px | `--spacing-14` |
| 16 | 16px | `--spacing-16` |
| 20 | 20px | `--spacing-20` |
| 24 | 24px | `--spacing-24` |
| 30 | 30px | `--spacing-30` |
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |
| 80 | 80px | `--spacing-80` |
| 100 | 100px | `--spacing-100` |
| 200 | 200px | `--spacing-200` |

### Border Radius

| Element | Value |
|---------|-------|
| nav | 8px |
| tags | 40px |
| cards | 16px |
| images | 4px |
| buttons | 8px |
| largeCards | 24px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| subtle | `rgba(0, 0, 0, 0.1) 0px 1px 1px 0px, rgba(0, 0, 0, 0.05) 0...` | `--shadow-subtle` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 40px
- **Card padding:** 12px
- **Element gap:** 10px

## Components

### Primary CTA Button
**Role:** Filled action button — the system's only filled interactive element

Background #0a0a0a, text #ffffff, 8px border-radius, Inter weight 600 at 15-16px. Padding 10px 12px. Subtle shadow: rgba(0,0,0,0.1) 0px 1px 1px, rgba(0,0,0,0.05) 0px 2px 4px. No hover state changes color — it deepens to #000000 or adds slight lift. Used for "Get Fabric free" and all conversion actions.

### Ghost Link Button
**Role:** Text link with optional outlined ghost border — secondary navigation

No background fill. Text and 1px border in #19154 (Ink Violet). 8px-16px border-radius depending on whether it's a text link or bordered action. Underlined by default. Used for "Log in" and inline navigation.

### Nav Bar
**Role:** Top-level site navigation

White background (#ffffff), hairline #000000 1px bottom border. Logo left (Fabric serif wordmark). Center nav items in Inter weight 500 at 15px, #0a0a0a. Right side: ghost text link + primary CTA button. Height ~56px, horizontal padding 24px.

### Hero Section
**Role:** Above-the-fold brand statement with editorial typography

White (#ffffff) background. Centered layout, max-width 800px for headline. Display serif (GT Alpina Light 300) at 80px, #0a0a0a, letter-spacing -1.6px. Supporting subtext in Inter weight 400 at 16-18px, #666666, centered. Rating row above headline: Inter 400 at 15px with 5 gold star icons (#fff500 fill).

### Product Preview Card
**Role:** Tilted screenshot card floating in the hero composition

Rounded image with 16px-24px border-radius, subtle shadow or electric-violet (#1100ff) glow halo behind. Slight rotation (-5° to +5°) for editorial scrapbook feel. Contains app UI screenshot with white background. Multiple cards overlap with z-index layering.

### Document Editor Surface
**Role:** Core product view — white document canvas with editing tools

White (#ffffff) document area, 16px border-radius. Toolbar at top with icon controls (search, magic wand, menu, close) in #0a0a0a. Body text in Inter weight 400 at 16px, #0a0a0a. Comment annotations in #19154 (Ink Violet) with author pills (colored circles + name labels in 11px Inter weight 500).

### AI Assistant Panel
**Role:** Right-sidebar AI companion — the differentiating product surface

White (#ffffff) panel, 16px border-radius, separated from document by 12px gap. Header with assistant name ("Fabric AI") and icon controls. Content blocks: action buttons (white bg, #0a0a0a border, 8px radius, Inter 500 14px), update notes in #f3f3f3 background with 12px radius, "Apply changes" in #f3f3f3 ghost button, "Reject changes" in #d4d4d4 ghost button. Note input at bottom with "+ Actions" trigger.

### Star Rating Display
**Role:** Social proof element in the hero

Score (4.7) in Inter weight 600 at 15px, #0a0a0a. Five star icons filled in #fff500 (gold). Count text ("2.4K+ app ratings") in Inter weight 400 at 15px, #666666. Horizontal row layout with 8px gap between elements.

### Link with Underline
**Role:** Inline text link in body content

Inter weight 500 at body size, color #19154, 1px bottom border in #19154e. No background, no padding. Hover state deepens color to #1100ff or adds slight underline weight.

### Tag/Badge (Pill)
**Role:** Category labels, feature tags, version markers

40px border-radius (full pill). Background #f3f3f3 or transparent. Text in Inter weight 500-600 at 11-15px, #0a0a0a. Padding 5px 12px. Optional 1px border in #000000 at hairline weight.

### Annotation Marker
**Role:** Inline comment indicator in the document editor

Small colored circle (8-12px diameter) in brand colors (violet, coral, etc.) positioned in the text margin. Adjacent pill label with author name in Inter weight 500 at 11px, white text on colored background, 40px border-radius.

### Meeting Recording Card
**Role:** Floating UI element showing recorded meeting metadata

White (#ffffff) background, 16px border-radius, subtle shadow. Contains meeting title in Inter 600 at 15px, #0a0a0a. Status badge (Recording) in #0a0a0a with red dot. Duration counter with waveform icon. Body text in Inter 400 at 13px, #666666.

### Landing Feature Card
**Role:** Content card in feature sections below the hero

White (#ffffff) background, 16px-24px border-radius, optional 1px #000000 border. Padding 12-24px. Content: serif heading (GT Alpina Light 32-52px), Inter body text, optional CTA link in #19154e.

## Do's and Don'ts

### Do
- Use #0a0a0a for all filled action buttons — it is the system's only filled surface and defines the CTA hierarchy.
- Set hero headlines in GT Alpina Light weight 300 at 52-80px with -0.02em letter-spacing — the serif is the brand signature.
- Draw all structural borders at 1px in #000000 — the system uses hairline black borders, not colored or thick rules.
- Apply 8px radius to buttons and nav elements, 16px to cards, 24px to large feature cards — this three-tier radius scale creates visual hierarchy.
- Use #19154 (Ink Violet) for all link text and outlined-action borders — never use #1100ff for text.
- Keep the palette 98% achromatic — let #1100ff appear only as soft glow halos, focus rings, and shadow tints behind product cards.
- Use Inter weight 400 for body, 500 for UI labels, 600 for button text and emphasized metadata — never go above 600 in UI.

### Don't
- Don't use #1100ff as a filled button background or body text — it is a glow/halo color only.
- Don't use sans-serif for the hero headline — the GT Alpina Light serif is the brand's signature and must not be substituted with Inter Bold.
- Don't apply heavy drop shadows — the system uses only rgba(0,0,0,0.1) 0px 1px 1px and rgba(0,0,0,0.05) 0px 2px 4px as a paper-grain effect.
- Don't introduce new chromatic colors — the 2% colorfulness is intentional; every new hue dilutes the editorial restraint.
- Don't use 40px border-radius on cards — it is reserved for pill tags and badge elements only.
- Don't set body text below 15px or above 18px — the UI type scale stays compact and confident.
- Don't use blue link colors (#0000ee or similar) — all links must be #19154 with a 1px border underline.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Page Canvas | `#ffffff` | Primary background for all pages and sections |
| 1 | Card Surface | `#ffffff` | Elevated content cards, modals, and product preview containers |
| 2 | Subtle Wash | `#f3f3f3` | Secondary surface for update notes, hover states, and input resting backgrounds |
| 3 | Inverted Surface | `#0a0a0a` | Primary action buttons and dark UI panels |

## Elevation

- **Primary CTA Button:** `rgba(0, 0, 0, 0.1) 0px 1px 1px 0px, rgba(0, 0, 0, 0.05) 0px 2px 4px 0px`
- **Nav Bar:** `rgba(0, 0, 0, 0.1) 0px 1px 1px 0px, rgba(0, 0, 0, 0.05) 0px 2px 4px 0px`
- **Product Preview Card:** `rgba(17, 0, 255, 0.15) 0px 0px 40px 0px`

## Imagery

The site uses tilted product screenshot cards as decorative hero elements — real UI captures rotated -5° to +5°, overlapping with z-index layering to create a scrapbook editorial feel. Photography is absent; the product UI screenshots are the visual content. The AI assistant panel screenshot shows a document editor with a right-sidebar AI companion, comment annotations with colored author pills, and action buttons. Imagery is purely product-as-hero — no lifestyle photography, no abstract graphics, no illustrations. Icons are minimal and appear only as utility controls (search, magic wand, menu, waveform, star).

## Layout

Max-width 1200px centered container with 24px horizontal padding. The hero is a centered text stack (max-width ~800px for headline) with tilted product cards floating in the surrounding space. Navigation is a single top bar with left logo, center links, right CTA cluster. Below the hero, sections alternate between full-width white bands and content-max-width blocks at 40-80px vertical gaps. The product detail section (second screenshot) shows a max-width ~1000px white document editor with a right-sidebar AI panel, separated by 12px gap. Overall rhythm: spacious hero → tight product demo → spacious feature sections.

## Agent Prompt Guide

## Quick Color Reference
- Text: #0a0a0a (primary), #666666 (muted), #19154e (links)
- Background: #ffffff (canvas), #f3f3f3 (subtle wash)
- Border: #000000 (1px hairline)
- Accent: #1100ff (glow halos only)
- primary action: #0a0a0a (filled action)

## Example Component Prompts

1. Create a Primary Action Button: #0a0a0a background, #ffffff text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.

2. **Document Editor + AI Sidebar**: Two-panel layout. Left: white (#ffffff) document with 16px radius, Inter 400 at 16px body text in #0a0a0a, inline annotation pills (8px circles in violet/coral + author name labels in 11px Inter 500 on colored backgrounds, 40px radius). Right sidebar: 16px radius white panel, 12px gap from document. Contains action buttons (white bg, #0a0a0a 1px border, 8px radius, Inter 500 at 14px), an update note block with #f3f3f3 background and 12px radius, "Apply changes" ghost button in #f3f3f3, and a note input at bottom with "+ Actions" trigger.

3. **Product Preview Card Cluster**: Three white image cards with 24px border-radius, slightly rotated (-5°, 0°, +5°), overlapping with z-index layering. Each contains a product UI screenshot. Behind the cluster, a soft glow: rgba(17,0,255,0.15) 0px 0px 40px. Cards have 1px #000000 hairline borders.

4. **Nav Bar**: White (#ffffff) background, 1px #000000 bottom border. Left: "Fabric" serif wordmark in GT Alpina Light at 20px #0a0a0a. Center: nav items in Inter 500 at 15px #0a0a0a (Teams, Features▾, Download▾, Pricing). Right: "Log in" ghost link in #19154e with 1px underline, then "Get Fabric free" primary button (#0a0a0a bg, white text, 8px radius, Inter 600 at 15px). Height 56px, padding 0 24px.

5. **Feature Section Card**: White (#ffffff) background, 16px radius, optional 1px #000000 border. Padding 24px. Heading in GT Alpina Light 32px weight 300 at #0a0a0a, letter-spacing -0.64px. Body text in Inter 400 at 16px #666666. Bottom-right link in Inter 500 at 15px #19154e with 1px underline.

## Border System

The system draws almost all structural separation with 1px #000000 hairline borders — on cards, nav, input fields, and image frames. There are no colored borders and no 2px+ weights in the standard system. When a card or surface needs to stand out without a border, use a subtle #f3f3f3 fill instead. The only exception is the electric-violet glow, which appears as an ambient shadow, not a border.

## Similar Brands

- **Notion** — Same white-canvas productivity aesthetic with minimal color and product-screenshot-as-hero composition, though Notion uses sans-serif and Fabric uses an editorial serif headline
- **Obsidian** — Similar near-monochrome interface with dark CTA buttons and a focus on writing/thinking tools, though Obsidian defaults to dark mode and uses heavier borders
- **Craft** — Same document-centric workspace with restrained palette and emphasis on editorial typography, though Craft uses more color in its UI states
- **Reflect** — Same minimalist productivity app aesthetic with near-black CTAs and monochrome surfaces, though Reflect uses a more traditional sans-serif throughout
- **Tana** — Similar knowledge-workspace category with white backgrounds and single-accent-color restraint, though Tana uses a warm orange accent where Fabric uses electric violet

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-electric-violet: #1100ff;
  --color-ink-violet: #19154e;
  --color-press-black: #0a0a0a;
  --color-carbon: #000000;
  --color-paper-white: #ffffff;
  --color-newsprint: #f3f3f3;
  --color-graphite: #666666;
  --color-slate: #333333;
  --color-pewter: #404040;
  --color-ash: #b3b3b3;
  --color-smoke: #737373;

  /* Typography — Font Families */
  --font-sans-serif: 'sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-gt-alpina-light: 'GT Alpina Light', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-manrope: 'Manrope', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-system-ui: 'system-ui', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 11px;
  --leading-caption: 1.2;
  --tracking-caption: 0.11px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.16px;
  --text-body-lg: 18px;
  --leading-body-lg: 1.4;
  --tracking-body-lg: -0.18px;
  --text-subheading: 28px;
  --leading-subheading: 1.3;
  --tracking-subheading: -0.56px;
  --text-heading: 52px;
  --leading-heading: 1.08;
  --tracking-heading: -1.04px;
  --text-display: 80px;
  --leading-display: 1.08;
  --tracking-display: -1.6px;

  /* Typography — Weights */
  --font-weight-light: 300;
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
  --font-weight-black: 900;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-5: 5px;
  --spacing-6: 6px;
  --spacing-7: 7px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-14: 14px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-30: 30px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-80: 80px;
  --spacing-100: 100px;
  --spacing-200: 200px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 40px;
  --card-padding: 12px;
  --element-gap: 10px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-2xl-2: 20px;
  --radius-3xl: 24px;
  --radius-3xl-2: 40px;

  /* Named Radii */
  --radius-nav: 8px;
  --radius-tags: 40px;
  --radius-cards: 16px;
  --radius-images: 4px;
  --radius-buttons: 8px;
  --radius-largecards: 24px;

  /* Shadows */
  --shadow-subtle: rgba(0, 0, 0, 0.1) 0px 1px 1px 0px, rgba(0, 0, 0, 0.05) 0px 2px 4px 0px;

  /* Surfaces */
  --surface-page-canvas: #ffffff;
  --surface-card-surface: #ffffff;
  --surface-subtle-wash: #f3f3f3;
  --surface-inverted-surface: #0a0a0a;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-electric-violet: #1100ff;
  --color-ink-violet: #19154e;
  --color-press-black: #0a0a0a;
  --color-carbon: #000000;
  --color-paper-white: #ffffff;
  --color-newsprint: #f3f3f3;
  --color-graphite: #666666;
  --color-slate: #333333;
  --color-pewter: #404040;
  --color-ash: #b3b3b3;
  --color-smoke: #737373;

  /* Typography */
  --font-sans-serif: 'sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-gt-alpina-light: 'GT Alpina Light', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-manrope: 'Manrope', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-system-ui: 'system-ui', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 11px;
  --leading-caption: 1.2;
  --tracking-caption: 0.11px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.16px;
  --text-body-lg: 18px;
  --leading-body-lg: 1.4;
  --tracking-body-lg: -0.18px;
  --text-subheading: 28px;
  --leading-subheading: 1.3;
  --tracking-subheading: -0.56px;
  --text-heading: 52px;
  --leading-heading: 1.08;
  --tracking-heading: -1.04px;
  --text-display: 80px;
  --leading-display: 1.08;
  --tracking-display: -1.6px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-5: 5px;
  --spacing-6: 6px;
  --spacing-7: 7px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-14: 14px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-30: 30px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-80: 80px;
  --spacing-100: 100px;
  --spacing-200: 200px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-2xl-2: 20px;
  --radius-3xl: 24px;
  --radius-3xl-2: 40px;

  /* Shadows */
  --shadow-subtle: rgba(0, 0, 0, 0.1) 0px 1px 1px 0px, rgba(0, 0, 0, 0.05) 0px 2px 4px 0px;
}
```
