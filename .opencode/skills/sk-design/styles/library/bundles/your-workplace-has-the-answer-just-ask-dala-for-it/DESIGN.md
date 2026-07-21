# Your workplace has the answer. Just ask Dala for it. — Style Reference
> constellation floating on black velvet

**Theme:** dark

Dala operates as a dark-stage environment where black voids meet a single vivid violet accent, punctuated by amber sparks. Typography is monolithic and weightless — PPNeueMontreal at weight 400 dominates every heading at outsized scales (78–113px) with aggressive negative tracking, so headlines feel sculptural rather than informational. The visual centerpiece is a constellation of tiny multicolored triangular particles forming an organic brain shape, which acts as the brand's signature gesture: knowledge visualized as distributed intelligence rather than hierarchical data. Layout follows a spacious two-column rhythm — oversized left-aligned headlines paired with generous body copy, floating on pure black with no panels, borders, or cards. Components are intentionally reduced to their most essential form: one violet pill button, ghost text links, and large-format text blocks.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Void | `#000000` | `--color-void` | Page canvas, section backgrounds, negative space — pure black is the dominant surface, not dark gray, creating the void that lets chromatic accents float |
| Bone White | `#ffffff` | `--color-bone-white` | Headlines, body text, icon fills, nav active state — the only typographic color, carrying maximum hierarchy on black |
| Ash Gray | `#9a9a9a` | `--color-ash-gray` | Muted nav text, ghost link color, secondary labels — recedes behind primary text without going invisible |
| Silver Mist | `#bdbdbd` | `--color-silver-mist` | Tertiary body text, caption-level information — the quietest readable gray, for supporting context |
| Electric Iris | `#8052ff` | `--color-electric-iris` | Primary action buttons, logo mark, brand accents — the single saturated violet that signals interactivity and brand identity against the black void |
| Saffron Spark | `#ffb829` | `--color-saffron-spark` | Highlight emphasis text, accent links, attention punctuation — warm yellow against violet creates the brand's chromatic tension |
| Deep Verdant | `#15846e` | `--color-deep-verdant` | Secondary surface tint, logo gradient stop — appears as the deeper end of the brand gradient and in subtle accent washes |

## Tokens — Typography

### PPNeueMontreal — Single typeface across all UI contexts. Display sizes (78–113px) carry headlines at weight 400 with -0.04em tracking — the same weight as body text but massive scale creates hierarchy. Weight 200 (ultra-light) is reserved for 18px body copy, a signature choice: most AI/SaaS sites use 400 for body, but Dala strips weight to make paragraphs feel airy and non-aggressive. Weight 600 at 14px with 0.025em tracking and uppercase serves nav and small labels. The number 400 doing both 113px display and 15px body is unusual — it means the brand trusts scale, not weight, for hierarchy. · `--font-ppneuemontreal`
- **Substitute:** Inter
- **Weights:** 200, 400, 600, 700
- **Sizes:** 12, 14, 15, 18, 24, 27, 36, 42, 48, 78, 113px
- **Line height:** 0.81, 0.90, 1.00, 1.10, 1.20, 1.25, 1.30, 1.50
- **Letter spacing:** -4.52px at 113px, -3.12px at 78px, -1.68px at 42px, -0.48px at 24px, normal at 18px body; 0.025em at 14px uppercase nav
- **OpenType features:** `"ss01" on`
- **Role:** Single typeface across all UI contexts. Display sizes (78–113px) carry headlines at weight 400 with -0.04em tracking — the same weight as body text but massive scale creates hierarchy. Weight 200 (ultra-light) is reserved for 18px body copy, a signature choice: most AI/SaaS sites use 400 for body, but Dala strips weight to make paragraphs feel airy and non-aggressive. Weight 600 at 14px with 0.025em tracking and uppercase serves nav and small labels. The number 400 doing both 113px display and 15px body is unusual — it means the brand trusts scale, not weight, for hierarchy.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.5 | — | `--text-caption` |
| nav-label | 14px | 1.2 | 0.35px | `--text-nav-label` |
| body | 18px | 1.5 | — | `--text-body` |
| heading-2xs | 24px | 1.25 | -0.48px | `--text-heading-2xs` |
| heading-xs | 27px | 1 | — | `--text-heading-xs` |
| subheading | 36px | 1.2 | — | `--text-subheading` |
| heading-sm | 42px | 1.2 | -1.68px | `--text-heading-sm` |
| heading | 48px | 1.1 | -1.68px | `--text-heading` |
| heading-lg | 78px | 1.1 | -3.12px | `--text-heading-lg` |
| display | 113px | 1.1 | -4.52px | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 6px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 6 | 6px | `--spacing-6` |
| 12 | 12px | `--spacing-12` |
| 18 | 18px | `--spacing-18` |
| 24 | 24px | `--spacing-24` |
| 30 | 30px | `--spacing-30` |
| 36 | 36px | `--spacing-36` |
| 60 | 60px | `--spacing-60` |
| 96 | 96px | `--spacing-96` |
| 120 | 120px | `--spacing-120` |

### Border Radius

| Element | Value |
|---------|-------|
| nav | 24px |
| tags | 9999px |
| cards | 24px |
| buttons | 24px |

### Layout

- **Page max-width:** 1280px
- **Section gap:** 60-120px
- **Card padding:** 24-38px
- **Element gap:** 6-18px

## Components

### Primary Action Button
**Role:** Filled violet pill, the sole interactive CTA

Background #8052ff (Electric Iris), white text, 22.5px border-radius (pill), 14.4px vertical padding × 15.96px horizontal padding. PPNeueMontreal 14px weight 400 or 600, uppercase with 0.025em tracking. The high radius (22.5px on ~45px height) creates a full pill shape — soft, friendly, unmistakable as the primary action.

### Ghost Text Button
**Role:** Underlined or bare text link, secondary action

No background, no border, color #ffffff or #9a9a9a. PPNeueMontreal 14px weight 400. Used for nav items and inline links. The absence of any container means visual hierarchy comes entirely from type weight and tracking.

### Logo Lockup
**Role:** Brand mark + wordmark in header

Small triangular icon in #8052ff (violet) with a gradient fade through #15846 (teal), paired with 'Dala' wordmark in white. The icon is a stylized angular fragment — geometric, sharp-edged, echoing the triangular particles in the hero visualization.

### Team Member Card
**Role:** Portrait + name + role display

No background, no border, no shadow. Large rounded-rectangle portrait photo (~24px corner radius) with role label in 12px uppercase #8052ff and name in large white display type below. Social icons (Twitter, LinkedIn) appear as small inline glyphs. Cards float on the black canvas with only whitespace separation.

### Carousel Navigation Dot
**Role:** Indicator for slide position in team/investor carousels

Small filled circle ~8px diameter, #8052ff violet for active state. Inactive dots are dimmer or omitted. Padding is minimal — sits directly in the content flow without a container.

### Hero Constellation Visualization
**Role:** Signature brand imagery — brain-shape particle cloud

Thousands of tiny triangular glyphs (outlined, 1-2px) in a full spectrum of vivid colors (violet, amber, teal, magenta, blue) forming an organic brain or cloud shape against pure black. Individual particles are scattered/ambient across the surrounding space as well. This is the site's defining visual — not a static image but an animated field of point-lights.

### Section Headline Block
**Role:** Oversized left-aligned headline + supporting copy

Two-column asymmetric layout: headline at 78–113px weight 400 PPNeueMontreal in white with -0.04em tracking, occupying left half. Body copy at 18px weight 200 (ultra-light) in white or silver, with a small uppercase label (#ffb829 amber) above the body. No boxes, no borders — pure typographic composition on black.

### Navigation Bar
**Role:** Top-aligned site navigation

Transparent background sitting directly on black canvas. Logo left, nav links center/right (Manifesto, Team, Blog) in 14px uppercase PPNeueMontreal with 0.025em tracking. Active or hover state: white. Inactive: #9a9a9a. Request Access button (filled violet pill) anchors the right edge. No border, no backdrop blur on the nav itself.

### Ambient Particle Field
**Role:** Decorative scattered triangle glyphs

Small outlined triangles in various chromatic colors (#8052ff violet, #ffb829 amber, #15846 teal, plus assorted purples and blues) scattered at low opacity across the background outside the main constellation. Creates atmospheric depth without competing with the central visualization.

## Do's and Don'ts

### Do
- Use #8052ff (Electric Iris) exclusively for filled action buttons — no other saturated color should appear as a button background
- Set every headline at weight 400, never bold — Dala achieves hierarchy through scale (78–113px) and tracking (-0.04em), not font weight
- Use PPNeueMontreal weight 200 for 18px body text — the ultra-light weight is a signature, do not substitute weight 400
- Maintain pure #000000 black as every section background — never use dark gray panels or card surfaces; the void is the design
- Apply -0.04em letter-spacing on all display sizes 42px and above, converting to approximately -4.52px at 113px
- Use 24px border-radius for buttons, cards, and nav elements as the consistent radius token — pill shapes only at very small sizes
- Let the particle constellation be the only hero imagery — do not introduce photography, illustrations, or product screenshots into the hero region

### Don't
- Do not use filled violet (#8052ff) for large background blocks or full sections — it is a button and accent color, not a surface
- Do not set body text at weight 400 — Dala's signature ultra-light (200) body copy is what distinguishes the reading experience
- Do not introduce card containers with borders, shadows, or background fills — elements float on black with whitespace alone
- Do not use color #0000ee (default browser link blue) — never specify it; use #ffb829 amber or #ffffff for links
- Do not add gradients to UI components — Dala's palette is flat; gradients belong only in the logo and the particle visualization
- Do not use system fonts as substitutes when PPNeueMontreal-equivalent geometry matters — use Inter as fallback but preserve the weight 200 body and weight 400 headline convention
- Do not place multiple filled buttons in proximity — the violet pill is reserved for singular primary actions per view

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Void Canvas | `#000000` | Full-page background, all section backgrounds, the base void |
| 1 | Deep Verdant Tint | `#15846` | Subtle accent surface for brand gradient and logo depth |
| 2 | Electric Iris | `#8052ff` | Highest surface — filled buttons, active interactive elements only |

## Elevation

Dala uses no shadows or elevation. All hierarchy is achieved through scale, color contrast, and whitespace on a flat black canvas. The absence of cards-with-shadows is deliberate — the void is the design, and any shadow would break the floating-in-space quality of the typography and particle constellation.

## Imagery

Imagery is entirely procedural and abstract — no photography except team portraits. The signature visual is a dense cloud of thousands of tiny outlined triangular particles in a full vivid spectrum (violets, ambers, teals, magentas, blues) forming an organic brain/neural shape. This particle field is animated and acts as both hero art and brand identity. Surrounding ambient particles drift at lower density across the page background. Triangles are outlined, 1–2px stroke, sharp-edged, in saturated chromatic colors — never grayscale. Team portraits appear as large rounded-rectangle crops (24px radius) without frames or overlays. No product screenshots, no lifestyle photography, no 3D renders — the particle system IS the visual brand.

## Layout

Full-bleed sections on pure black canvas, max content width ~1280px centered. Hero is a two-column asymmetric split: oversized left-aligned headline (113px) with body copy and CTA on the left half, particle brain visualization occupying the right half at massive scale. Subsequent sections alternate the two-column composition (visual-left/text-right, then text-left/visual-right) creating a zigzag reading rhythm. Section gaps are generous (60–120px vertical). No card grids, no pricing tables, no multi-column feature blocks — content lives in spacious two-column text+visual arrangements. Navigation is a minimal transparent top bar, no sidebar, no mega-menu. Density is extremely spacious — one or two elements per viewport, never information-dense.

## Agent Prompt Guide

## Quick Color Reference
- Text: #ffffff (primary), #9a9a9a (secondary), #bdbdbd (tertiary)
- Background: #000000 (canvas only)
- Border: none — Dala uses no visible borders or dividers
- Accent: #ffb829 (Saffron Spark) for emphasis highlights
- primary action: #8052ff (filled action)

## Example Component Prompts

1. **Hero Section**: Full-bleed #000000 canvas. Two-column split. Left: headline at 78px PPNeueMontreal weight 400, #ffffff, letter-spacing -3.12px, reading 'Unlock collective wisdom.' Body copy at 18px weight 200 PPNeueMontreal, #ffffff, max-width 480px. Above body, a small uppercase label at 14px weight 600, #ffb829 amber, letter-spacing 0.35px. Below body, a filled violet pill button: #8052ff background, white text, 14px weight 600 uppercase, 22.5px border-radius, 14.4px vertical padding × 16px horizontal padding. Right: large particle constellation visualization (thousands of tiny colored triangles forming a brain shape).

2. **Section Headline + Body**: #000000 background. Left-aligned headline at 42px PPNeueMontreal weight 400, #ffffff, letter-spacing -1.68px. Supporting body text at 18px weight 200 PPNeueMontreal, #bdbdbd, max-width 520px. No boxes, no borders, no cards — text floats on void.

3. **Navigation Bar**: Transparent background on black. Left: small violet (#8052ff) triangular logo icon + 'Dala' wordmark in #ffffff 14px. Right: nav links 'Manifesto', 'Team', 'Blog' in 14px PPNeueMontreal weight 600, uppercase, 0.025em letter-spacing, color #9a9a9a (inactive) or #ffffff (active). Far right: filled violet pill 'Request Access' button — #8052ff background, white text, 22.5px radius, 14px weight 600 uppercase.

4. **Team Card**: No background, no border. Large portrait photo with 24px border-radius. Above name: role label 'CO FOUNDER & CTO' at 12px PPNeueMontreal weight 400, #8052ff, uppercase. Below photo: name 'Joel Kang' at 27px PPNeueMontreal weight 400, #ffffff. Social icons inline as small glyphs in #9a9a9a.

5. **Carousel Indicator**: Two small dots ~8px, filled #8052ff for active position, no background or border around the dot container. Sits centered below carousel content with 30px gap.

## Similar Brands

- **Linear** — Same dark-void aesthetic with oversized weight-400 display type, generous whitespace, and a single saturated accent (violet/blue) reserved for action — both treat black as an active design material rather than a fallback
- **Vercel** — Identical pattern: pure black canvas, geometric minimalism, single brand color, weight-400 typography at massive display sizes with aggressive negative tracking — both make black the hero
- **Anthropic** — Dark mode-first philosophy with serif-free geometric sans, restrained color palette where one accent dominates, and a typographic system that trusts scale over weight for hierarchy
- **Runway** — Dark void aesthetic with particle/constellation-style generative visuals as brand identity, combined with ultra-light body type and single vivid accent color for CTAs

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-void: #000000;
  --color-bone-white: #ffffff;
  --color-ash-gray: #9a9a9a;
  --color-silver-mist: #bdbdbd;
  --color-electric-iris: #8052ff;
  --color-saffron-spark: #ffb829;
  --color-deep-verdant: #15846e;

  /* Typography — Font Families */
  --font-ppneuemontreal: 'PPNeueMontreal', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --text-nav-label: 14px;
  --leading-nav-label: 1.2;
  --tracking-nav-label: 0.35px;
  --text-body: 18px;
  --leading-body: 1.5;
  --text-heading-2xs: 24px;
  --leading-heading-2xs: 1.25;
  --tracking-heading-2xs: -0.48px;
  --text-heading-xs: 27px;
  --leading-heading-xs: 1;
  --text-subheading: 36px;
  --leading-subheading: 1.2;
  --text-heading-sm: 42px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: -1.68px;
  --text-heading: 48px;
  --leading-heading: 1.1;
  --tracking-heading: -1.68px;
  --text-heading-lg: 78px;
  --leading-heading-lg: 1.1;
  --tracking-heading-lg: -3.12px;
  --text-display: 113px;
  --leading-display: 1.1;
  --tracking-display: -4.52px;

  /* Typography — Weights */
  --font-weight-extralight: 200;
  --font-weight-regular: 400;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-unit: 6px;
  --spacing-6: 6px;
  --spacing-12: 12px;
  --spacing-18: 18px;
  --spacing-24: 24px;
  --spacing-30: 30px;
  --spacing-36: 36px;
  --spacing-60: 60px;
  --spacing-96: 96px;
  --spacing-120: 120px;

  /* Layout */
  --page-max-width: 1280px;
  --section-gap: 60-120px;
  --card-padding: 24-38px;
  --element-gap: 6-18px;

  /* Border Radius */
  --radius-3xl: 24px;
  --radius-full: 9999px;

  /* Named Radii */
  --radius-nav: 24px;
  --radius-tags: 9999px;
  --radius-cards: 24px;
  --radius-buttons: 24px;

  /* Surfaces */
  --surface-void-canvas: #000000;
  --surface-deep-verdant-tint: #15846;
  --surface-electric-iris: #8052ff;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-void: #000000;
  --color-bone-white: #ffffff;
  --color-ash-gray: #9a9a9a;
  --color-silver-mist: #bdbdbd;
  --color-electric-iris: #8052ff;
  --color-saffron-spark: #ffb829;
  --color-deep-verdant: #15846e;

  /* Typography */
  --font-ppneuemontreal: 'PPNeueMontreal', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --text-nav-label: 14px;
  --leading-nav-label: 1.2;
  --tracking-nav-label: 0.35px;
  --text-body: 18px;
  --leading-body: 1.5;
  --text-heading-2xs: 24px;
  --leading-heading-2xs: 1.25;
  --tracking-heading-2xs: -0.48px;
  --text-heading-xs: 27px;
  --leading-heading-xs: 1;
  --text-subheading: 36px;
  --leading-subheading: 1.2;
  --text-heading-sm: 42px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: -1.68px;
  --text-heading: 48px;
  --leading-heading: 1.1;
  --tracking-heading: -1.68px;
  --text-heading-lg: 78px;
  --leading-heading-lg: 1.1;
  --tracking-heading-lg: -3.12px;
  --text-display: 113px;
  --leading-display: 1.1;
  --tracking-display: -4.52px;

  /* Spacing */
  --spacing-6: 6px;
  --spacing-12: 12px;
  --spacing-18: 18px;
  --spacing-24: 24px;
  --spacing-30: 30px;
  --spacing-36: 36px;
  --spacing-60: 60px;
  --spacing-96: 96px;
  --spacing-120: 120px;

  /* Border Radius */
  --radius-3xl: 24px;
  --radius-full: 9999px;
}
```
