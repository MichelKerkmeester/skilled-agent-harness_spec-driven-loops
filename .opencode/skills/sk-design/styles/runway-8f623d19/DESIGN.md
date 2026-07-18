# Runway — Style Reference
> monochrome research studio — a printer's tray of cinematic stills on cold white paper

**Theme:** light

Runway operates as a precision research lab on white canvas — almost entirely monochrome, with a single deep cobalt accent reserved for promotional banners and the occasional highlight. Typography does the heavy lifting: a neo-grotesque sans with tightly tracked headlines carries editorial weight, reading as research statements rather than marketing copy. Components are deliberately minimal — ghost buttons, hairline dividers, image cards that sit flat against the page, no decorative elevation. The page breathes like a long-form magazine spread where AI-generated research output is the visual content itself. Every interface decision is in service of letting the work speak: no gradients, no shadows, no ornament.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Ink Black | `#0c0c0c` | `--color-ink-black` | Dark supporting neutral for text, icons, and strong contrast. Do not promote it to the primary CTA color |
| Carbon | `#1a1a1a` | `--color-carbon` | Supporting neutral for secondary UI, dividers, and muted labels. Do not promote it to the primary CTA color |
| Graphite | `#2a2a2a` | `--color-graphite` | Secondary dark surface, button hover states |
| Slate | `#404040` | `--color-slate` | Body text, secondary headings, dense paragraph copy |
| Steel | `#6b7280` | `--color-steel` | Muted helper text, tertiary metadata, subdued links |
| Silver | `#999999` | `--color-silver` | Disabled states, placeholder text, low-priority captions |
| Bone | `#e5e7eb` | `--color-bone` | Hairline borders, divider lines, card outlines, structural separators |
| Cloud | `#eef1f5` | `--color-cloud` | Subtle background wash, hover state for neutral surfaces |
| Pure White | `#ffffff` | `--color-pure-white` | Page canvas, card surfaces, button text on dark fills |
| Cobalt Signal | `#2b22fa` | `--color-cobalt-signal` | Promotional announcement bar, brand accent — the only chromatic moment in the system, used sparingly to signal news or offers without competing with the research content |

## Tokens — Typography

### abcNormal — Sole typeface across the entire interface — navigation, body, buttons, and display headlines. Weight 450 (a half-step) and 500 carry most UI text; 600 is reserved for emphasis. The tight tracking on large sizes (-0.025em at 48px) prevents headlines from feeling airy, keeping them grounded as editorial statements rather than marketing shouts. The positive tracking at 11px (+0.025em) compensates for small-size readability. Weight 400 for body keeps long research paragraphs light on the eye. · `--font-abcnormal`
- **Substitute:** Söhne
- **Weights:** 400, 450, 500, 600
- **Sizes:** 11, 13, 14, 16, 20, 24, 36, 40, 48
- **Line height:** 1.00–1.50
- **Letter spacing:** -1.2px at 48px (display), -0.96px at 40px, -0.60px at 36px, -0.12px at 20px, -0.10px at 16px, -0.07px at 14px, +0.28px at 11px (caption)
- **Role:** Sole typeface across the entire interface — navigation, body, buttons, and display headlines. Weight 450 (a half-step) and 500 carry most UI text; 600 is reserved for emphasis. The tight tracking on large sizes (-0.025em at 48px) prevents headlines from feeling airy, keeping them grounded as editorial statements rather than marketing shouts. The positive tracking at 11px (+0.025em) compensates for small-size readability. Weight 400 for body keeps long research paragraphs light on the eye.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 11px | 1.43 | 0.28px | `--text-caption` |
| body-lg | 16px | 1.5 | -0.1px | `--text-body-lg` |
| subheading | 20px | 1.3 | -0.12px | `--text-subheading` |
| heading-sm | 24px | 1.25 | -0.24px | `--text-heading-sm` |
| heading | 36px | 1.1 | -0.6px | `--text-heading` |
| heading-lg | 40px | 1.1 | -0.96px | `--text-heading-lg` |
| display | 48px | 1 | -1.2px | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** compact

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 8 | 8px | `--spacing-8` |
| 12 | 12px | `--spacing-12` |
| 16 | 16px | `--spacing-16` |
| 20 | 20px | `--spacing-20` |
| 24 | 24px | `--spacing-24` |
| 28 | 28px | `--spacing-28` |
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |
| 64 | 64px | `--spacing-64` |
| 80 | 80px | `--spacing-80` |
| 96 | 96px | `--spacing-96` |
| 160 | 160px | `--spacing-160` |
| 176 | 176px | `--spacing-176` |
| 240 | 240px | `--spacing-240` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 4px |
| cards | 0px |
| images | 0px |
| inputs | 8px |
| buttons | 8px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80-120px
- **Card padding:** 16-24px
- **Element gap:** 8-16px

## Components

### Promotional Announcement Bar
**Role:** Top-of-page promotional strip

Full-bleed bar at the very top of the page. Background #2b22fa (Cobalt Signal), text #ffffff, centered, 11-13px weight 400-500, 0.025em positive tracking. Contains a short promotional message with an underlined link and a small ghost-style 'Try Now' button on the right.

### Primary Navigation Bar
**Role:** Site-wide top navigation

White background, 1px #e5e7eb bottom border. Logo (Runway wordmark, #0c0c0c) flush left. Center nav items in a horizontal row: RESEARCH, PRODUCT, RESOURCES, SOLUTIONS, COMPANY — 13px weight 500, #0c0c0c, uppercase. Right cluster: 'Enterprise Sales' and 'Log in' as ghost text links, then 'Try Runway' as a filled dark button (#0c0c0c bg, #ffffff text, 8px radius, ~10px 20px padding).

### Ghost Text Link
**Role:** Low-emphasis navigation or action

No background, no border. Text #0c0c0c, 13-14px weight 500. Used for 'Log in', 'Enterprise Sales', and inline links. Hover state: text color shifts to #404040 or underline appears.

### Primary Dark Button (Filled)
**Role:** Main call-to-action

Background #0c0c0c, text #ffffff, 8px border-radius, padding 10px 20px. Font: 14px weight 500. No border. Used for 'Try Runway' in the nav. Sits with high contrast against the white canvas; the only filled button style in the system.

### Ghost Button with Arrow
**Role:** Secondary action or section entry point

No background, no border. Text #0c0c0c, 14px weight 500. Followed by a chevron arrow (→). Padding 8px 0. Used for 'Get Started >' in the hero. The arrow gives directional momentum without requiring visual weight.

### Learn More Pill Button
**Role:** Research feature call-to-action

Background #0c0c0c or #1a1a1a, text #ffffff, 8px radius (approaching pill), padding 10px 18px. Font: 14px weight 500. Used to drive traffic from research feature blocks to detail pages. Rounded but not fully pill — sits between sharp and soft.

### Logo Trust Strip
**Role:** Social proof via partner/brand logos

Horizontal row of company logos (CBS, NVIDIA, Adobe, Allstate, GUT, Legendary, Lionsgate) in grayscale. Rendered in #404040 or #999999 to blend with the page. No logos in full color — the monochromatic treatment signals 'this is a system' not 'these are ads'. Vertically centered, equal spacing.

### Editorial Display Headline
**Role:** Section or page title

Font 48px weight 400-450, line-height 1.00, letter-spacing -0.025em. Color #0c0c0c. Left-aligned, max-width ~900px. Reads as a research statement, not a marketing slogan. The tight tracking and light weight are anti-convention — most sites would use 600-700 here.

### Research Image Card
**Role:** Showcase of a research project or product

Image at top (full-bleed within card, no radius — sharp corners), project title below in 20px weight 500 #0c0c0c, short description in 14px weight 400 #404040. No card border, no shadow. Arranged in a 2-column grid with ~24px gap. The image IS the visual treatment.

### Alternating Feature Row
**Role:** Research or product detail section

Two-column layout, alternating image-left/text-right and image-right/text-left. Image takes ~50% width, no radius. Text column: heading 36px weight 400, body 16px weight 400 #404040, then a 'Learn more' pill button. ~80-120px vertical padding between rows. The alternation creates reading rhythm.

### Image-Only Feature Block
**Role:** Full-width research visual

Single image spanning the content width, no border, no overlay. Sometimes followed by a text block, sometimes standalone. Used for hero product shots or keyframe stills from AI-generated video. The image is the message.

### Hairline Divider
**Role:** Section separator

1px solid #e5e7eb line, full content width. Used between major sections where white space alone isn't enough. No double lines, no dashes — always a single hairline.

### Inline Underlined Link
**Role:** Mid-emphasis link in body copy

Text inherits body color (#0c0c0c or #404040), 1px underline, no color change. Underline offset ~2px. Hover: underline thickens or color shifts to Cobalt Signal #2b22fa for the rare colored link.

## Do's and Don'ts

### Do
- Use the neo-grotesque sans at weight 400-450 for headlines — the light weight is the signature; never bold up to 600-700 for display copy
- Maintain the 8px radius for all buttons and the 4px radius for tags — keep corners subtly soft but never pill-shaped
- Reserve #2b22fa Cobalt Signal exclusively for the announcement bar and one or two promotional moments per page — it must remain scarce to carry weight
- Use 1px #e5e7eb hairlines or white space to separate sections — never reach for drop shadows or elevation
- Left-align all body copy and headlines; the design is editorial, not centered-marketing
- Set letter-spacing to -0.025em at 48px and scale linearly down — tight tracking is part of the typographic identity
- Keep the page at 1% colorfulness: monochrome first, accent only as punctuation

### Don't
- Do not introduce drop shadows, glow effects, or any elevation system — the flat print-like surface is the look
- Do not add gradients — the design is purely flat color
- Do not use the Cobalt Signal blue for buttons, links, or icons outside the announcement bar — it will lose its scarcity
- Do not center body text or long-form copy — left-alignment is structural, not stylistic
- Do not add secondary accent colors (green, purple, red) — there is no room in a 1% colorfulness system for a second chromatic voice
- Do not use rounded corners larger than 8px on buttons or 12px on any container — the sharp/minimal geometry defines the feel
- Do not increase body weight above 500 — the interface is calibrated for airy 400-450 text; heavier weights break the editorial register

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Page Canvas | `#ffffff` | Base background for the entire site |
| 1 | Card Surface | `#ffffff` | Research project cards, feature blocks — sit flat against the page, distinguished by content not elevation |
| 2 | Soft Wash | `#eef1f5` | Subtle section backgrounds, hover states for neutral elements |
| 3 | Announcement Bar | `#2b22fa` | Promotional banner — the only chromatic surface, signals news/offers above the fold |

## Elevation

The design deliberately avoids shadows. Cards and content blocks are separated from the page by hairlines (1px #e5e7eb borders) or by white space alone, never by drop shadows or elevation. This flat, print-like treatment keeps the page reading as editorial rather than app-like, and ensures that the AI-generated imagery and research content remain the only sources of visual depth.

## Imagery

Imagery is the centerpiece of every page: the AI-generated video stills and research keyframes ARE the visual content. Images are full-bleed within their containers, sharp-cornered (no border-radius), high-resolution, and often cinematic in framing — wide aspect ratios, dramatic lighting, surreal or hyperreal subject matter. The product page leads with a video or still frame; research pages alternate text blocks with generated imagery. No stock photography, no lifestyle shots, no decorative illustrations — the visual language is 'our AI made this, look at it.' Photography treatment is unfiltered: true colors, full saturation, no duotone or color grading overlay. The only branded visual treatment is the monochromatic logo strip, which uses grayscale to signal partner ecosystem without competing with the product imagery.

## Layout

Max-width 1200px centered content column with full-bleed bands for the announcement bar and hero media. The hero is a near-empty white canvas with a single 'Get Started >' ghost link — deliberate restraint before the logo strip. Below the trust strip, a large editorial headline (left-aligned, ~900px) introduces a 2-column image card grid showcasing research projects. Deeper sections use alternating left-right image+text rows at 50/50 split, with ~80-120px vertical rhythm between rows. No sticky sidebar, no mega-menu — navigation is a simple centered top bar. Density is compact but the overall page is long-form editorial: you scroll through research stories like a magazine. Section transitions are marked by 1px hairlines or simply by white space, never by contrasting background bands.

## Agent Prompt Guide

**Quick Color Reference**
- text: #0c0c0c
- background: #ffffff
- border: #e5e7eb
- muted text: #404040
- accent (promotional only): #2b22fa
- primary action: no distinct CTA color

**Example Component Prompts**

1. Create a top announcement bar: full-bleed #2b22fa background, centered 13px weight 500 #ffffff text reading 'New release available. Get 50% off with code EXAMPLE. Terms apply.', followed by a small ghost 'Try Now' button (#ffffff text, 1px #ffffff border, 4px radius, 8px 14px padding).

2. Create a primary navigation bar: white background, 1px #e5e7eb bottom border, 1200px max-width centered. Left: 'Runway' wordmark logo in #0c0c0c at 20px weight 500. Center: nav items 'RESEARCH, PRODUCT, RESOURCES, SOLUTIONS, COMPANY' in 13px weight 500 #0c0c0c, uppercase, 32px gap. Right: 'Enterprise Sales' and 'Log in' as ghost text links in #0c0c0c, then 'Try Runway' as a filled button (#0c0c0c bg, #ffffff text, 8px radius, 10px 20px padding).

3. Create an editorial headline section: 80px top padding, 1200px max-width, headline 'AI is changing how stories are told, how scientific progress is made and how the next frontiers of humanity are reached.' in 48px weight 400 #0c0c0c, letter-spacing -1.2px, line-height 1.0, left-aligned, max-width 900px.

4. Create a research feature row: two-column layout, 50/50 split, 24px gap. Left: product image (full-bleed, no radius). Right: text column with heading 'Introducing GWM-1' in 36px weight 400 #0c0c0c, body paragraph in 16px weight 400 #404040, then a 'Learn more' button (#1a1a1a bg, #ffffff text, 8px radius, 10px 18px padding).

5. Create a logo trust strip: horizontal row of 7 partner logos in #999999 grayscale, equal 48px gap, vertically centered, no background, no border, sitting between two sections separated by 1px #e5e7eb hairlines.

## Editorial Proportions

The page follows a strict 1.00–1.10 line-height for display sizes (48px, 40px, 36px) — headlines stack tightly, almost touching, as if typeset. Body copy opens up to 1.43–1.50. This compression-to-expansion ratio is what makes the page read as editorial print rather than screen UI. Never normalize line-heights to 1.5 across the board — the typographic contrast is the point.

## Similar Brands

- **Stability AI** — Same monochrome research-publication aesthetic — white canvas, single bold headline, image-led research showcase, no decorative elevation or gradients
- **Midjourney** — Editorial AI research presentation with full-bleed AI-generated imagery as primary content, minimal UI chrome, neo-grotesque typography with tight tracking
- **Anthropic** — Restrained monochromatic interface with editorial weight — large left-aligned headlines, ghost navigation, research-forward content blocks alternating with imagery
- **Figma Config** — Large-scale editorial layout language — generous section gaps, alternating image+text rows, single brand accent reserved for announcements, flat surfaces without shadows

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-ink-black: #0c0c0c;
  --color-carbon: #1a1a1a;
  --color-graphite: #2a2a2a;
  --color-slate: #404040;
  --color-steel: #6b7280;
  --color-silver: #999999;
  --color-bone: #e5e7eb;
  --color-cloud: #eef1f5;
  --color-pure-white: #ffffff;
  --color-cobalt-signal: #2b22fa;

  /* Typography — Font Families */
  --font-abcnormal: 'abcNormal', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 11px;
  --leading-caption: 1.43;
  --tracking-caption: 0.28px;
  --text-body-lg: 16px;
  --leading-body-lg: 1.5;
  --tracking-body-lg: -0.1px;
  --text-subheading: 20px;
  --leading-subheading: 1.3;
  --tracking-subheading: -0.12px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.25;
  --tracking-heading-sm: -0.24px;
  --text-heading: 36px;
  --leading-heading: 1.1;
  --tracking-heading: -0.6px;
  --text-heading-lg: 40px;
  --leading-heading-lg: 1.1;
  --tracking-heading-lg: -0.96px;
  --text-display: 48px;
  --leading-display: 1;
  --tracking-display: -1.2px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-w450: 450;
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
  --spacing-28: 28px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-96: 96px;
  --spacing-160: 160px;
  --spacing-176: 176px;
  --spacing-240: 240px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80-120px;
  --card-padding: 16-24px;
  --element-gap: 8-16px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-xl: 12px;

  /* Named Radii */
  --radius-tags: 4px;
  --radius-cards: 0px;
  --radius-images: 0px;
  --radius-inputs: 8px;
  --radius-buttons: 8px;

  /* Surfaces */
  --surface-page-canvas: #ffffff;
  --surface-card-surface: #ffffff;
  --surface-soft-wash: #eef1f5;
  --surface-announcement-bar: #2b22fa;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-ink-black: #0c0c0c;
  --color-carbon: #1a1a1a;
  --color-graphite: #2a2a2a;
  --color-slate: #404040;
  --color-steel: #6b7280;
  --color-silver: #999999;
  --color-bone: #e5e7eb;
  --color-cloud: #eef1f5;
  --color-pure-white: #ffffff;
  --color-cobalt-signal: #2b22fa;

  /* Typography */
  --font-abcnormal: 'abcNormal', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 11px;
  --leading-caption: 1.43;
  --tracking-caption: 0.28px;
  --text-body-lg: 16px;
  --leading-body-lg: 1.5;
  --tracking-body-lg: -0.1px;
  --text-subheading: 20px;
  --leading-subheading: 1.3;
  --tracking-subheading: -0.12px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.25;
  --tracking-heading-sm: -0.24px;
  --text-heading: 36px;
  --leading-heading: 1.1;
  --tracking-heading: -0.6px;
  --text-heading-lg: 40px;
  --leading-heading-lg: 1.1;
  --tracking-heading-lg: -0.96px;
  --text-display: 48px;
  --leading-display: 1;
  --tracking-display: -1.2px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-28: 28px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-96: 96px;
  --spacing-160: 160px;
  --spacing-176: 176px;
  --spacing-240: 240px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-xl: 12px;
}
```
