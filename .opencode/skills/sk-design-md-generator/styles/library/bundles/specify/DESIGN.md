# Specify — Style Reference
> Black studio wall with neon violet sign

**Theme:** mixed

Specify operates as a dark-to-light narrative canvas: pitch-black hero sections with luminous violet gradient headlines command the top of the page, then flip to clean white surfaces for content and social proof. The visual identity is restrained SaaS geometry — compact 8px-grid spacing, Inter at every weight, subtle dual-layer shadows — with one signal breaking the monochrome: a vivid violet (#624de3) that lives inside text, icon strokes, and a handful of accent fills. Buttons are squat pills (40px radius) rather than the more common 6px chamfer; cards are 16px-rounded; the overall feel is dense, confident, and slightly editorial. The brand voice reads as engineer-adjacent: a product page for people who build design systems, not people who buy them.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Iris | `#624de3` | `--color-iris` | Primary brand color — gradient headline text, icon strokes, accent borders, focal links. The only chromatic voice in the system; appears sparingly to make accents feel like punctuation rather than decoration |
| Soft Iris | `#8d4af7` | `--color-soft-iris` | Gradient tail for the brand violet — the lighter stop in hero headline gradients. Paired with #1d58c0 and #009639 only inside the carousel card color-blocks, not in chrome |
| Studio Slate | `#1a1d1e` | `--color-studio-slate` | Primary text, dark filled buttons, body borders, heading strokes. The working near-black that carries 90% of the interface's weight |
| Obsidian | `#151718` | `--color-obsidian` | Hero and section background fill — the deep dark behind the gradient headline and 3D illustration. Slightly cooler/lighter than pure black to keep the violet legible |
| Pure White | `#ffffff` | `--color-pure-white` | Light-theme canvas, card surfaces, button text on dark fills, hero overlay text |
| Cloud | `#f6f7f9` | `--color-cloud` | Soft alternate surface — sits beneath white cards for subtle banding between content sections |
| Mist | `#ebedef` | `--color-mist` | Hairline card and stroke surface, secondary card backgrounds in quiet zones |
| Graphite | `#8d8e8f` | `--color-graphite` | Medium-contrast borders, control outlines, and structural separators. |
| Iron | `#5f6162` | `--color-iron` | Secondary text and secondary borders — one step stronger than Graphite for body sub-copy that still needs to recede |
| Noir | `#000000` | `--color-noir` | Highest-contrast text and the dominant border color across all surfaces. Used where maximum legibility or definition is needed |
| Cobalt Pop | `#1d58c0` | `--color-cobalt-pop` | Carousel testimonial card accent background — appears as a solid color block beside the violet and green variants, not used in chrome |
| Fern Pop | `#009639` | `--color-fern-pop` | Carousel testimonial card accent background — third slot in the rotating brand color trio. Decorative only |
| Lilac Wash | `#f1eefe` | `--color-lilac-wash` | Soft purple-tinted card surface used in the testimonial carousel — echoes the brand violet at 8% saturation |
| Mint Wash | `#e5fbeb` | `--color-mint-wash` | Soft green-tinted card surface in the testimonial carousel — companion to the Fern Pop color block |
| Apricot Wash | `#feeadd` | `--color-apricot-wash` | Soft warm card surface in the testimonial carousel — third pastel slot matching the apricot color block |

## Tokens — Typography

### sans-serif — sans-serif — detected in extracted data but not described by AI · `--font-sans-serif`
- **Weights:** 400
- **Sizes:** 12px
- **Line height:** 1.2
- **Role:** sans-serif — detected in extracted data but not described by AI

### Inter — The single typeface for the entire system. Regular (400) for body and micro-copy, Medium (500) for emphasized inline, SemiBold (600) for subheadings and UI labels at -0.031em tracking, Bold (700) reserved for the two display headlines (48px and 64px) at -0.021em / -0.016em. The negative letter-spacing on large sizes is what gives the wordmark its tight, poster-like feel; smaller sizes stay at normal tracking. · `--font-inter`
- **Substitute:** system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif
- **Weights:** 400, 500, 600, 700
- **Sizes:** 8px, 10px, 12px, 14px, 16px, 20px, 24px, 32px, 48px, 64px
- **Line height:** 1.13–3.00 (tight for display, loose for body)
- **Letter spacing:** -0.016em to -0.031em on 24px+; normal below
- **OpenType features:** `"cv11", "ss01"`
- **Role:** The single typeface for the entire system. Regular (400) for body and micro-copy, Medium (500) for emphasized inline, SemiBold (600) for subheadings and UI labels at -0.031em tracking, Bold (700) reserved for the two display headlines (48px and 64px) at -0.021em / -0.016em. The negative letter-spacing on large sizes is what gives the wordmark its tight, poster-like feel; smaller sizes stay at normal tracking.

### Fira Code — Inline code and token-name strings in the product mockup illustration. The only monospace voice; appears only inside the hero 3D scene, not in body copy. · `--font-fira-code`
- **Substitute:** 'JetBrains Mono', 'Source Code Pro', monospace
- **Weights:** 400
- **Sizes:** 14px
- **Line height:** 1.57
- **Role:** Inline code and token-name strings in the product mockup illustration. The only monospace voice; appears only inside the hero 3D scene, not in body copy.

### Inter-Medium — Inter-Medium — detected in extracted data but not described by AI · `--font-inter-medium`
- **Weights:** 500
- **Sizes:** 8px, 12px, 14px, 16px
- **Line height:** 1.5, 1.71, 2, 3
- **Role:** Inter-Medium — detected in extracted data but not described by AI

### Inter-SemiBold — Inter-SemiBold — detected in extracted data but not described by AI · `--font-inter-semibold`
- **Weights:** 600
- **Sizes:** 8px, 12px, 14px, 16px, 20px, 24px, 32px
- **Line height:** 1, 1.2, 1.25, 1.5, 1.6, 1.71, 2, 3
- **Letter spacing:** -0.031
- **Role:** Inter-SemiBold — detected in extracted data but not described by AI

### Inter-Bold — Inter-Bold — detected in extracted data but not described by AI · `--font-inter-bold`
- **Weights:** 700
- **Sizes:** 48px, 64px
- **Line height:** 1.13, 1.17
- **Letter spacing:** -0.021, -0.016
- **Role:** Inter-Bold — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.5 | — | `--text-caption` |
| body-sm | 14px | 1.71 | — | `--text-body-sm` |
| body | 16px | 1.5 | — | `--text-body` |
| subheading | 20px | 1.6 | — | `--text-subheading` |
| heading-sm | 24px | 1.25 | -0.74px | `--text-heading-sm` |
| heading | 32px | 1.2 | -0.99px | `--text-heading` |
| display | 64px | 1.13 | -1.34px | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 8px

**Density:** compact

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 8 | 8px | `--spacing-8` |
| 16 | 16px | `--spacing-16` |
| 24 | 24px | `--spacing-24` |
| 40 | 40px | `--spacing-40` |
| 64 | 64px | `--spacing-64` |
| 80 | 80px | `--spacing-80` |
| 120 | 120px | `--spacing-120` |
| 160 | 160px | `--spacing-160` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 100px |
| cards | 16px |
| icons | 6px |
| inputs | 6px |
| buttons | 40px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| subtle | `rgba(0, 0, 0, 0.2) 0px 1px 2px 0px, rgba(0, 0, 0, 0.08) 0...` | `--shadow-subtle` |
| subtle-2 | `rgba(0, 0, 0, 0.08) 0px 1px 2px 0px, rgba(0, 0, 0, 0.06) ...` | `--shadow-subtle-2` |
| subtle-3 | `rgba(255, 255, 255, 0.2) 0px 1px 0px 0px inset, rgba(0, 0...` | `--shadow-subtle-3` |
| subtle-4 | `rgba(0, 0, 0, 0.1) 0px 3px 2px -1px, rgba(0, 0, 0, 0.12) ...` | `--shadow-subtle-4` |
| sm | `rgba(0, 0, 0, 0.14) 0px 4px 6px -2px, rgba(0, 0, 0, 0.16)...` | `--shadow-sm` |
| sm-2 | `rgba(0, 0, 0, 0.12) 0px 8px 8px -4px, rgba(0, 0, 0, 0.18)...` | `--shadow-sm-2` |
| lg | `rgba(0, 0, 0, 0.08) 0px 12px 24px 0px, rgba(0, 0, 0, 0.06...` | `--shadow-lg` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 24px
- **Element gap:** 8px

## Components

### Pill Filled Button
**Role:** Primary action on light surfaces

Dark fill (#1a1d1e), white text, Inter SemiBold 14px, padding 10px 20px, 40px radius, dual-layer shadow rgba(0,0,0,0.2) 0 1px 2px / rgba(0,0,0,0.08) 0 6px 16px. Used for 'Read vision', 'Watch video', 'Case study'.

### White Outlined Button
**Role:** Action on dark hero backgrounds

1px #ffffff border, white text, Inter SemiBold 14px, padding 10px 20px, 40px radius. Used for 'Sign in' and as a secondary action in the hero.

### Pill Badge
**Role:** Status / announcement label

White fill (#ffffff) with dark text (#1a1d1e), Inter Medium 14px, padding 6px 16px, 100px (full) radius. Optional small dot or icon to the left. Used for 'Saying Goodbye: The End of Specify'.

### Gradient Headline
**Role:** Hero display text

Inter Bold 64px at -0.016em, gradient fill running from #8d4af7 through #624de3 to #1d58c0 (270°). Sits on dark canvas (#151718). The gradient direction (left-to-right) is the signature.

### Light Section Headline
**Role:** H1 on white content sections

Inter Bold 48px at -0.021em, color #1a1d1, centered, max-width ~720px. Followed by Inter Regular 16px sub-copy in #5f6162.

### Navigation Bar
**Role:** Top-level site navigation

White background, 1px bottom border (#ebedef), height ~64px. Left: brand mark (violet hexagon + wordmark). Center: Solutions / Resources / Pricing text links with chevron-down icons. Right: 'Sign in' ghost button and 'Get started' filled button. Sticky on scroll.

### Logo Bar
**Role:** Social proof — client logos

Dark canvas (#151718) band, single row of 7–8 monochrome white logos with 'Specify is loved by' label above in Inter Medium 14px #8d8e8f. Logos sit at uniform height (~24px) with 40–80px gaps.

### Testimonial Carousel Card
**Role:** Rotating case-study spotlight

Three-card horizontal layout. Side cards: solid color block (Cobalt / Fern / Iris) with white client wordmark and 'Case study →' pill button. Center card: white surface, large quote in Inter SemiBold 16px #1a1d1, attribution beneath. Cards are 16px radius with subtle shadow rgba(0,0,0,0.08) 0 1px 2px / rgba(0,0,0,0.06) 0 4px 8px.

### Token Workflow Illustration
**Role:** Hero product visualization

3D isometric scene on dark canvas. Dark gray rounded squares (16px radius) connected by pipe/conduit segments, with a glowing orange-yellow cube cluster at left and a code-output panel at right reading 'Success14: File created tokens/text-styles'. Token names shown in Fira Code 14px inside the connector modules.

### Section Header with CTA
**Role:** Reusable section opener

Centered Inter Bold 48px headline, then 16px body in #5f6162, then a single pill button centered below with 40px margin-top. Pattern repeats across all white content sections.

### Brand Mark
**Role:** Logo lockup

Violet (#624de3) hexagon with internal cube/hex pattern glyph, followed by 'Specify' wordmark in Inter SemiBold 16px #1a1d1e. The hex pattern echoes the 3D illustration in the hero.

## Do's and Don'ts

### Do
- Use Inter Bold 48–64px with -0.016em to -0.021em letter-spacing for every section and hero headline
- Use the pill button (40px radius, 10px 20px padding, Inter SemiBold 14px) as the default action shape
- Reserve #624de3 for accent text, icon strokes, and focal highlights — never as a full surface fill in chrome
- Stack the surface hierarchy as #151718 (dark hero) → #ffffff (content) → #f6f7f9 (banded sections) → #f1eefe / #e5fbeb / #feeadd (testimonial cards)
- Apply the dual-layer shadow stack (1px contact + 4–16px ambient) to all interactive elements
- Keep spacing on the 8px grid — 8px element gap, 24px card padding, 40–80px section gap
- Match button radius to 40px pills and card radius to 16px — never mix sharp 4px corners into a card or button

### Don't
- Don't use solid violet (#624de3) as a full filled-button background — the primary action is the dark slate (#1a1d1e) pill
- Don't introduce a second chromatic accent outside the iris/fern/cobalt trio used in the testimonial carousel
- Don't apply heavy blur shadows — keep shadows to the 1–2px + 4–8px dual-layer pattern
- Don't set body text above 16px or below 14px on white surfaces — the type scale is intentional
- Don't use the soft pastel surface colors (#f1eefe, #e5fbeb, #feeadd) outside the testimonial carousel context
- Don't use letter-spacing on sizes below 24px — negative tracking is only for display and heading levels
- Don't add photography, gradients-as-backgrounds, or decorative illustration outside the hero 3D scene

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Dark Canvas | `#151718` | Hero band, logo bar, and any dark storytelling sections |
| 1 | Light Canvas | `#ffffff` | Default content background for all white sections |
| 2 | Soft Band | `#f6f7f9` | Alternate section background to create rhythm without heavy dividers |
| 3 | Tinted Card | `#f1eefe` | Pastel card surface in testimonial carousel |

## Elevation

- **Filled button:** `rgba(0, 0, 0, 0.2) 0px 1px 2px 0px, rgba(0, 0, 0, 0.08) 0px 6px 16px 0px`
- **Card:** `rgba(0, 0, 0, 0.08) 0px 1px 2px 0px, rgba(0, 0, 0, 0.06) 0px 4px 8px 0px`

## Imagery

Imagery is dominated by a single hero-scale 3D illustration: an isometric dark-surface workflow diagram of connected rounded tiles, glowing accent cubes, and a code output panel. Beyond the hero, the site is nearly text-only — monochrome client logos in the social-proof band, small app-icon glyphs in the carousel card footers, and icon-only navigation. No photography, no lifestyle imagery. The 3D scene is the brand's visual voice; everything else stays flat and typographic.

## Layout

The page alternates between full-bleed dark bands and centered max-width-1200px white content bands. The hero is a full-viewport dark canvas with a centered gradient headline and the 3D illustration occupying the lower 50%. Below the hero, a dark logo bar runs edge-to-edge. All subsequent content sits in a centered 1200px container with 80px vertical section gaps: large centered headlines, then 2- or 3-column arrangements of text and cards. The testimonial carousel breaks the single-column rhythm with a 3-card horizontal spread. Navigation is a sticky top bar with no sidebar. The overall rhythm is generous on the dark sections and compact (8–24px gaps) inside the white content sections.

## Agent Prompt Guide

**Quick Color Reference**
- text: #1a1d1e
- background: #ffffff
- border: #ebedef
- accent: #624de3
- dark surface: #151718
- primary action: #1a1d1e (filled action)

**Example Component Prompts**
1. *Hero section*: #151718 full-bleed background. Centered gradient headline 'Your Design Token Engine' in Inter Bold 64px, letter-spacing -1.34px, fill running 270° from #8d4af7 → #624de3 → #1d58c0. White sub-copy in Inter Regular 16px, max-width 560px. Below, a 3D isometric illustration of dark rounded tiles connected by pipes, occupying the lower 50% of the viewport.
2. *Pill button*: #1a1d1e fill, white text, Inter SemiBold 14px, padding 10px 20px, border-radius 40px, shadow rgba(0,0,0,0.2) 0 1px 2px / rgba(0,0,0,0.08) 0 6px 16px.
3. *Testimonial card*: white surface, 16px radius, padding 24px, shadow rgba(0,0,0,0.08) 0 1px 2px / rgba(0,0,0,0.06) 0 4px 8px. Quote in Inter SemiBold 16px #1a1d1e, attribution in Inter Regular 14px #5f6162.
4. *Pill badge*: #ffffff fill, Inter Medium 14px #1a1d1e, padding 6px 16px, border-radius 100px, with a small #624de3 dot to the left.
5. *Navigation bar*: #ffffff background, 1px bottom border #ebedef, height 64px. Left: violet hex brand mark + 'Specify' wordmark in Inter SemiBold 16px. Right: 'Sign in' ghost button (1px #1a1d1e border, 40px radius) and 'Get started' filled pill (#1a1d1e fill, white text, 40px radius).

## Similar Brands

- **Linear** — Same dual-theme dark-hero-to-white-content narrative, Inter typeface, and pill-shaped dark filled buttons with subtle dual-layer shadows
- **Supabase** — Identical compact 8px-grid density, Inter type stack, and near-black (#1a1d1e) primary action pills on white surfaces
- **Vercel** — Same editorial use of bold gradient text on a dark hero, followed by restrained monochrome content sections with generous section gaps
- **Figma Config** — Mirrors the 3D-isometric product hero, dark logo bar, and large centered Inter Bold headlines for section openers
- **Cal.com** — Shares the dense 8px spacing rhythm, pill button (40px radius) primary action, and Inter SemiBold subheadings on near-black

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-iris: #624de3;
  --color-soft-iris: #8d4af7;
  --color-studio-slate: #1a1d1e;
  --color-obsidian: #151718;
  --color-pure-white: #ffffff;
  --color-cloud: #f6f7f9;
  --color-mist: #ebedef;
  --color-graphite: #8d8e8f;
  --color-iron: #5f6162;
  --color-noir: #000000;
  --color-cobalt-pop: #1d58c0;
  --color-fern-pop: #009639;
  --color-lilac-wash: #f1eefe;
  --color-mint-wash: #e5fbeb;
  --color-apricot-wash: #feeadd;

  /* Typography — Font Families */
  --font-sans-serif: 'sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-fira-code: 'Fira Code', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-inter-medium: 'Inter-Medium', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter-semibold: 'Inter-SemiBold', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter-bold: 'Inter-Bold', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --text-body-sm: 14px;
  --leading-body-sm: 1.71;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-subheading: 20px;
  --leading-subheading: 1.6;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.25;
  --tracking-heading-sm: -0.74px;
  --text-heading: 32px;
  --leading-heading: 1.2;
  --tracking-heading: -0.99px;
  --text-display: 64px;
  --leading-display: 1.13;
  --tracking-display: -1.34px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-unit: 8px;
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-40: 40px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-120: 120px;
  --spacing-160: 160px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 24px;
  --element-gap: 8px;

  /* Border Radius */
  --radius-md: 6px;
  --radius-2xl: 16px;
  --radius-2xl-2: 20px;
  --radius-3xl: 40px;
  --radius-full: 50px;
  --radius-full-2: 100px;
  --radius-full-3: 1000px;

  /* Named Radii */
  --radius-tags: 100px;
  --radius-cards: 16px;
  --radius-icons: 6px;
  --radius-inputs: 6px;
  --radius-buttons: 40px;

  /* Shadows */
  --shadow-subtle: rgba(0, 0, 0, 0.2) 0px 1px 2px 0px, rgba(0, 0, 0, 0.08) 0px 6px 16px 0px;
  --shadow-subtle-2: rgba(0, 0, 0, 0.08) 0px 1px 2px 0px, rgba(0, 0, 0, 0.06) 0px 4px 8px 0px;
  --shadow-subtle-3: rgba(255, 255, 255, 0.2) 0px 1px 0px 0px inset, rgba(0, 0, 0, 0.08) 0px 1px 2px 0px, rgba(0, 0, 0, 0.06) 0px 4px 8px 0px;
  --shadow-subtle-4: rgba(0, 0, 0, 0.1) 0px 3px 2px -1px, rgba(0, 0, 0, 0.12) 0px 1px 1px -1px;
  --shadow-sm: rgba(0, 0, 0, 0.14) 0px 4px 6px -2px, rgba(0, 0, 0, 0.16) 0px 12px 16px -4px;
  --shadow-sm-2: rgba(0, 0, 0, 0.12) 0px 8px 8px -4px, rgba(0, 0, 0, 0.18) 0px 20px 24px -4px;
  --shadow-lg: rgba(0, 0, 0, 0.08) 0px 12px 24px 0px, rgba(0, 0, 0, 0.06) 0px 2px 4px 0px;

  /* Surfaces */
  --surface-dark-canvas: #151718;
  --surface-light-canvas: #ffffff;
  --surface-soft-band: #f6f7f9;
  --surface-tinted-card: #f1eefe;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-iris: #624de3;
  --color-soft-iris: #8d4af7;
  --color-studio-slate: #1a1d1e;
  --color-obsidian: #151718;
  --color-pure-white: #ffffff;
  --color-cloud: #f6f7f9;
  --color-mist: #ebedef;
  --color-graphite: #8d8e8f;
  --color-iron: #5f6162;
  --color-noir: #000000;
  --color-cobalt-pop: #1d58c0;
  --color-fern-pop: #009639;
  --color-lilac-wash: #f1eefe;
  --color-mint-wash: #e5fbeb;
  --color-apricot-wash: #feeadd;

  /* Typography */
  --font-sans-serif: 'sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-fira-code: 'Fira Code', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-inter-medium: 'Inter-Medium', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter-semibold: 'Inter-SemiBold', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter-bold: 'Inter-Bold', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --text-body-sm: 14px;
  --leading-body-sm: 1.71;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-subheading: 20px;
  --leading-subheading: 1.6;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.25;
  --tracking-heading-sm: -0.74px;
  --text-heading: 32px;
  --leading-heading: 1.2;
  --tracking-heading: -0.99px;
  --text-display: 64px;
  --leading-display: 1.13;
  --tracking-display: -1.34px;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-40: 40px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-120: 120px;
  --spacing-160: 160px;

  /* Border Radius */
  --radius-md: 6px;
  --radius-2xl: 16px;
  --radius-2xl-2: 20px;
  --radius-3xl: 40px;
  --radius-full: 50px;
  --radius-full-2: 100px;
  --radius-full-3: 1000px;

  /* Shadows */
  --shadow-subtle: rgba(0, 0, 0, 0.2) 0px 1px 2px 0px, rgba(0, 0, 0, 0.08) 0px 6px 16px 0px;
  --shadow-subtle-2: rgba(0, 0, 0, 0.08) 0px 1px 2px 0px, rgba(0, 0, 0, 0.06) 0px 4px 8px 0px;
  --shadow-subtle-3: rgba(255, 255, 255, 0.2) 0px 1px 0px 0px inset, rgba(0, 0, 0, 0.08) 0px 1px 2px 0px, rgba(0, 0, 0, 0.06) 0px 4px 8px 0px;
  --shadow-subtle-4: rgba(0, 0, 0, 0.1) 0px 3px 2px -1px, rgba(0, 0, 0, 0.12) 0px 1px 1px -1px;
  --shadow-sm: rgba(0, 0, 0, 0.14) 0px 4px 6px -2px, rgba(0, 0, 0, 0.16) 0px 12px 16px -4px;
  --shadow-sm-2: rgba(0, 0, 0, 0.12) 0px 8px 8px -4px, rgba(0, 0, 0, 0.18) 0px 20px 24px -4px;
  --shadow-lg: rgba(0, 0, 0, 0.08) 0px 12px 24px 0px, rgba(0, 0, 0, 0.06) 0px 2px 4px 0px;
}
```
