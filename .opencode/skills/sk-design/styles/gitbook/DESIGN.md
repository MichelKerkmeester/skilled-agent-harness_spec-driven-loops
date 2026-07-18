# Gitbook — Style Reference
> warm-white architecture studio with orange highlighter marks

**Theme:** light

GitBook projects the calm authority of a well-edited reference book: warm-white pages, generous breathing room, and near-black type that commands without shouting. A single vivid orange acts as a highlighter — appearing only in badges, the 'New' pill, the floating Ask widget, and the kinetic 3D shapes that bleed into the hero screenshot. The interface stays almost entirely monochromatic; color is punctuation, not atmosphere. Typography is the visual identity: a geometric bold display face at 45-55px with tight negative tracking creates editorial weight, while Inter handles the dense body copy. Components are paper-like — flat cards, hairline borders, pill buttons, minimal shadow. Everything reads as a knowledge product: structured, legible, confident.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Flame Orange | `#fe551b` | `--color-flame-orange` | Orange outline accent for tags, dividers, and focused UI edges. |
| Ink | `#1c1917` | `--color-ink` | Primary action buttons, headlines, body text, primary borders — warm near-black replaces pure black for a softer, editorial feel |
| Paper | `#ffffff` | `--color-paper` | Page canvas, button text on dark fills, card surfaces — the dominant background |
| Bone | `#fafaf9` | `--color-bone` | Card backgrounds, subtle surface elevation above the white canvas, link/button ghost states |
| Pebble | `#efeeed` | `--color-pebble` | Nested surface backgrounds, secondary card layers, muted button backgrounds |
| Charcoal | `#57534d` | `--color-charcoal` | Secondary body text, muted borders, description copy — warm gray for paragraph content |
| Stone | `#79716b` | `--color-stone` | Tertiary text, placeholder text, inactive labels, subtle borders |
| Ash | `#948d89` | `--color-ash` | Disabled states, very muted helper text, subtle dividers |
| True Black | `#000000` | `--color-true-black` | SVG icon fills, sharp borders where maximum contrast is needed, logo marks |

## Tokens — Typography

### sans-serif — sans-serif — detected in extracted data but not described by AI · `--font-sans-serif`
- **Weights:** 400
- **Sizes:** 12px, 16px
- **Line height:** 1.2
- **Role:** sans-serif — detected in extracted data but not described by AI

### General Sans Variable — All display headlines, section headings, card titles, button labels, and emphasis text. Weight 700 is the single weight used — GitBook leans into geometric bold for its editorial authority. Negative tracking tightens at scale: -0.04em at 55px, -0.03em at 45px, -0.02em at 32px. This is the primary visual identity font. · `--font-general-sans-variable`
- **Substitute:** Inter Tight, Switzer, Satoshi, or DM Sans (700)
- **Weights:** 700
- **Sizes:** 18px
- **Line height:** 1.00-1.60
- **Letter spacing:** -0.04em at 55px, -0.03em at 45px, -0.02em at 30-38px, -0.01em at 20-24px, normal at 12-16px
- **OpenType features:** `"blwf", "cv03", "cv04", "cv09", "cv11"`
- **Role:** All display headlines, section headings, card titles, button labels, and emphasis text. Weight 700 is the single weight used — GitBook leans into geometric bold for its editorial authority. Negative tracking tightens at scale: -0.04em at 55px, -0.03em at 45px, -0.02em at 32px. This is the primary visual identity font.

### General Sans — Lead paragraph and subheading body copy. Weight 500 (medium) is heavier than typical body text — this is the descriptive copy directly under headlines, giving it subtle emphasis without crossing into heading territory. · `--font-general-sans`
- **Substitute:** Inter (500), Switzer (500)
- **Weights:** 500
- **Sizes:** 18px
- **Line height:** 1.60
- **Letter spacing:** -0.01em
- **Role:** Lead paragraph and subheading body copy. Weight 500 (medium) is heavier than typical body text — this is the descriptive copy directly under headlines, giving it subtle emphasis without crossing into heading territory.

### Inter — Body text, paragraph copy, table data, dense information areas, and any secondary UI text. Inter is the workhorse — used wherever content density matters. Open-source, system-fallback friendly. · `--font-inter`
- **Substitute:** Inter is already free — use directly or fall back to system-ui
- **Weights:** 400, 500, 600
- **Sizes:** 10px, 11px, 12px, 14px, 15px, 16px, 20px
- **Line height:** 1.08-1.60
- **Letter spacing:** -0.03em at 10px, -0.01em at larger sizes
- **OpenType features:** `"blwf", "cv03", "cv04", "cv09", "cv11"`
- **Role:** Body text, paragraph copy, table data, dense information areas, and any secondary UI text. Inter is the workhorse — used wherever content density matters. Open-source, system-fallback friendly.

### Geist Mono — Code snippets, technical labels, keyboard shortcuts, and monospaced data. Weight 600 gives code blocks presence against the Inter body. · `--font-geist-mono`
- **Substitute:** JetBrains Mono, IBM Plex Mono, Fira Code (600)
- **Weights:** 600
- **Sizes:** 10px, 14px
- **Line height:** 1.00, 1.30
- **Letter spacing:** -0.0200em
- **Role:** Code snippets, technical labels, keyboard shortcuts, and monospaced data. Weight 600 gives code blocks presence against the Inter body.

### General Sans Variable Variable Bold — General Sans Variable Variable Bold — detected in extracted data but not described by AI · `--font-general-sans-variable-variable-bold`
- **Weights:** 700
- **Sizes:** 12px, 14px, 16px, 20px, 24px, 30px, 32px, 38px, 45px, 55px
- **Line height:** 1, 1.2, 1.3, 1.4, 1.5, 1.6
- **Letter spacing:** -0.04, -0.03, -0.02, 0.01
- **OpenType features:** `"blwf", "cv03", "cv04", "cv09", "cv11"`
- **Role:** General Sans Variable Variable Bold — detected in extracted data but not described by AI

### Space Mono — Space Mono — detected in extracted data but not described by AI · `--font-space-mono`
- **Weights:** 400
- **Sizes:** 8px
- **Line height:** 1.3
- **Role:** Space Mono — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 10px | 1.3 | -0.03px | `--text-caption` |
| body-sm | 14px | 1.4 | — | `--text-body-sm` |
| body | 16px | 1.5 | — | `--text-body` |
| subheading | 18px | 1.6 | -0.01px | `--text-subheading` |
| heading-sm | 20px | 1.4 | -0.01px | `--text-heading-sm` |
| heading | 24px | 1.3 | -0.01px | `--text-heading` |
| heading-lg | 32px | 1.2 | -0.02px | `--text-heading-lg` |
| display | 45px | 1.1 | -0.03px | `--text-display` |
| hero | 55px | 1 | -0.04px | `--text-hero` |

## Tokens — Spacing & Shapes

**Density:** compact

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 5 | 5px | `--spacing-5` |
| 6 | 6px | `--spacing-6` |
| 8 | 8px | `--spacing-8` |
| 10 | 10px | `--spacing-10` |
| 12 | 12px | `--spacing-12` |
| 14 | 14px | `--spacing-14` |
| 15 | 15px | `--spacing-15` |
| 16 | 16px | `--spacing-16` |
| 20 | 20px | `--spacing-20` |
| 24 | 24px | `--spacing-24` |
| 32 | 32px | `--spacing-32` |
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |
| 64 | 64px | `--spacing-64` |
| 80 | 80px | `--spacing-80` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 99px |
| cards | 8-16px |
| images | 4-8px |
| inputs | 8px |
| buttons | 99px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| subtle | `rgba(0, 0, 0, 0.25) 0px 1px 2px 0px` | `--shadow-subtle` |
| md | `rgba(0, 0, 0, 0.15) 0px 4px 12px 0px` | `--shadow-md` |
| subtle-2 | `rgba(0, 0, 0, 0.05) 0px 1px 3px 0px, rgba(0, 0, 0, 0.05) ...` | `--shadow-subtle-2` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 64-80px
- **Card padding:** 16-24px
- **Element gap:** 10-12px

## Components

### Announcement Banner
**Role:** Top-of-page promotion strip

Centered, minimal-height bar with small orange badge (Flame Orange background, white text, 99px radius, ~4px 10px padding), 12px caption text in Charcoal, and right arrow. Full-width on white background, ~36-40px height.

### New/Beta Badge
**Role:** Status tag on features and sections

Pill badge, Flame Orange (#fe551b) background, white text, General Sans Variable 700 at 10-12px, 99px border-radius, ~3px 8px padding. Always paired with a label like 'New' or 'Beta' in Charcoal.

### Primary Action Button
**Role:** Main CTA — 'Start for free', 'Read the story'

Ink (#1c1917) background, white text, General Sans Variable 700 at 14-16px, 99px border-radius, 10px 16px padding. Includes right arrow icon. No shadow, flat fill. This is the only filled button variant used for primary actions.

### Ghost Button
**Role:** Secondary action — 'Talk to us', 'View the docs'

Transparent background, no border, Charcoal (#57534d) text at 14-16px, 99px border-radius, same padding as primary. Paired with primary button to create visual hierarchy through weight, not color.

### Feature Card
**Role:** Content card for product features

Bone (#fafaf9) background, 16px border-radius, 0 border, no shadow (or very subtle rgba(0,0,0,0.05) 0px 1px 3px). Contains: orange eyebrow label (10-12px uppercase General Sans 700), heading (General Sans 700 at 20-24px, Ink), body text (Inter 400 at 14-16px, Charcoal), and optional ghost/light CTA link.

### Product Screenshot Card
**Role:** Hero product UI mockup container

Rounded frame (~8px radius) with subtle shadow rgba(0,0,0,0.15) 0px 4px 12px, contains a full product UI screenshot on white background. Orange 3D decorative shapes bleed out from edges.

### Navigation Bar
**Role:** Top-level site navigation

White background, no shadow, left-aligned logo (GitBook wordmark with orange dot accent), centered nav links (Inter 400 at 14px, Ink), right-aligned utility actions: text 'Login' (Charcoal), ghost 'Got a demo' pill button, and filled 'Start for free' button. ~64px height.

### Logo Bar
**Role:** Social proof — trusted-by companies

Horizontal row of 6-7 company logos (NVIDIA, Ericsson, Carto, Verifone, Cisco, FreedomPay) rendered in grayscale. Equal spacing, centered, ~60-80px height. Logos sit flat with no backgrounds.

### Testimonial Card
**Role:** Customer quote with attribution

Left-aligned avatar (rounded, ~64px), large quote text (Inter 400 at 18-20px, Ink), attribution (General Sans 500 at 14px, Charcoal with company name in Ink), two action buttons (filled 'Read the story' + ghost 'View the docs'). White background, no card chrome.

### Section Heading Block
**Role:** Section-level title and description

Left-aligned, no centering. Heading: General Sans Variable 700 at 32-38px, Ink, -0.02em tracking. Subhead: Inter 400 at 16-18px, Charcoal, max-width ~560px. Generous space below before content grid.

### Floating Ask Widget
**Role:** Persistent help/chat trigger

Fixed bottom-right, Flame Orange (#fe551b) background, white 'Ask' text with small icon, ~36-40px height, 99px border-radius. Acts as a floating accent element — the only persistent splash of color.

### Pill Tag/Label
**Role:** Small categorical labels

99px border-radius, 2-4px 8-10px padding, 10-12px General Sans 700 text. Variants: orange fill with white text (New/Beta), transparent with Ink border, or Bone background with Charcoal text.

## Do's and Don'ts

### Do
- Use General Sans Variable 700 for all display text and headlines; the geometric bold weight IS the brand identity
- Use Ink (#1c1917) for primary action buttons and all primary text — never pure black (#000000) for UI chrome, only for SVG fills
- Use 99px border-radius for every button, tag, and pill element to maintain the capsule-button identity
- Apply negative letter-spacing at scale: -0.04em at 55px, -0.03em at 45px, tightening as type size increases
- Use Flame Orange (#fe551b) sparingly — only for badges, the floating Ask widget, and decorative 3D elements, never for body text or backgrounds of large areas
- Keep the interface monochromatic by default; let orange be punctuation, not atmosphere
- Use Bone (#fafaf9) for card surfaces to create paper-on-paper elevation without shadows

### Don't
- Don't use chromatic colors for buttons or actions — the primary CTA is always neutral dark (Ink), not orange or blue
- Don't use border-radius values between 12-24px on cards — stick to 8px or 16px from the design system
- Don't use pure black (#000000) for text or backgrounds — use Ink (#1c1917) for warmth
- Don't apply shadows to cards — use background color shifts (white → Bone → Pebble) for elevation
- Don't use General Sans below 20px for headings — it loses impact at small sizes; switch to Inter
- Don't add decorative gradients — the system is flat; depth comes from surface color hierarchy
- Don't use multiple accent colors — orange is the single chromatic accent; resist adding secondary colors

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas | `#ffffff` | Primary page background, the dominant white space |
| 1 | Card | `#fafaf9` | Elevated card surfaces, product screenshot containers, subtle differentiation from canvas |
| 2 | Nested | `#efeeed` | Deeper nested surfaces, secondary card layers, muted backgrounds |

## Elevation

- **Product Screenshot Card:** `rgba(0, 0, 0, 0.15) 0px 4px 12px 0px`
- **Floating Ask Widget:** `rgba(0, 0, 0, 0.25) 0px 1px 2px 0px`
- **Primary Action Button:** `rgba(0, 0, 0, 0.05) 0px 1px 3px 0px, rgba(0, 0, 0, 0.05) 0px 1px 2px -1px`

## Imagery

Minimal photography. The visual identity relies on a 3D product mockup (the Acme docs UI screenshot) with kinetic orange gradient shapes bleeding from behind it. Abstract 3D decorative elements (ribbed spheres, rounded organic forms in Flame Orange) are used in feature card illustrations. Company logos in the social proof bar are grayscale. The overall tone is product-focused and clean — the product UI IS the hero, not lifestyle photography.

## Layout

Max-width 1200px centered container with generous horizontal padding. Hero is centered headline over subtext, then a full-bleed product screenshot that extends beyond the container with orange shapes bleeding off the edges. Below the hero: a centered grayscale logo bar for social proof, then alternating full-width white and Bone sections. Feature sections use 2-column card grids (not 3 or 4 — keeps content scannable). Section headings are left-aligned, not centered, creating a editorial left-rail reading rhythm. The page is spacious with large vertical gaps (64-80px) between sections despite the compact element-level spacing. Navigation is a simple top bar, no sidebar or mega-menu.

## Agent Prompt Guide

Quick Color Reference:
- Text (primary): #1c1917 (Ink)
- Text (secondary): #57534d (Charcoal)
- Text (muted/placeholder): #79716b (Stone)
- Background (canvas): #ffffff
- Background (card/surface): #fafaf9 (Bone)
- Border (subtle): #efeeed (Pebble)
- Accent: #fe551b (Flame Orange)
- primary action: #1c1917 (filled action)

Example Component Prompts:

1. Create a hero section: #ffffff background. Centered announcement pill (Flame Orange badge 'New' + Charcoal text + arrow, 99px radius, 10px 16px padding). Headline at 55px General Sans Variable weight 700, #1c1917, letter-spacing -0.04em, line-height 1.0. Subtext at 18px General Sans weight 500, #57534d, line-height 1.6. Two buttons: filled Ink (#1c1917) with white text 'Start for free →' (99px radius, 10px 16px padding) and ghost with Charcoal text 'Talk to us' (99px radius, no border). Below: full-width product screenshot card (8px radius, rgba(0,0,0,0.15) 0px 4px 12px shadow) with Flame Orange 3D shapes bleeding from behind.

2. Create a feature card: #fafaf9 background, 16px border-radius, no shadow. Orange eyebrow label (10px General Sans Variable 700, Flame Orange background, white text, 99px radius, 3px 8px padding). Card heading at 24px General Sans Variable 700, #1c1917, letter-spacing -0.01em. Body text at 16px Inter weight 400, #57534d, line-height 1.5. 24px padding all sides.

3. Create a navigation bar: #ffffff background, no shadow, 64px height. Left: logo with orange dot accent. Center: nav links in Inter 400 at 14px, #1c1917. Right: 'Login' text link in #57534d, ghost button 'Got a demo' (99px radius, Charcoal text), filled button 'Start for free' (99px radius, #1c1917 background, white text, 10px 16px padding).

4. Create a testimonial block: #ffffff background, no card chrome. Left: 64px circular avatar. Right: quote at 20px Inter weight 400, #1c1917, line-height 1.5. Attribution: 14px General Sans weight 500, #57534d with company name in #1c1917. Two action buttons below: filled 'Read the story →' (Ink) and ghost 'View the docs' (Charcoal), both 99px radius.

5. Create a logo bar: #ffffff background, centered horizontal row of 6 grayscale company logos (rendered in #79716b), equal 40-60px spacing, ~60px total height. No borders or backgrounds on logos.

## Surface Philosophy

GitBook's surface system is paper-like, not digital-skeuomorphic. The stack goes: white canvas → Bone (#fafaf9) for first-level cards → Pebble (#efeeed) for nested elements. Each surface shift is subtle (differences of 5-10 luminance points) to create hierarchy without visual noise. There is no glass morphism, no blur, no gradient fills on surfaces. Cards sit on the page like printed pages on a desk.

## Similar Brands

- **Linear** — Same monochromatic light theme with a single vivid accent color (purple/blue for Linear, orange for GitBook), geometric bold display type, pill buttons, and flat minimal surfaces
- **Notion** — Same documentation/knowledge-base aesthetic with warm off-white backgrounds, clean geometric typography, and paper-like card surfaces without heavy shadows
- **Vercel** — Same editorial large-headline approach with negative letter-spacing at scale, monochromatic palette with black primary action, and minimal chrome
- **Stripe** — Same generous whitespace rhythm, large confident headlines as the primary visual element, and grayscale social proof logos
- **Figma** — Same product-screenshot-as-hero approach where the actual product UI serves as the primary visual content, with colorful decorative elements supporting rather than competing

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-flame-orange: #fe551b;
  --color-ink: #1c1917;
  --color-paper: #ffffff;
  --color-bone: #fafaf9;
  --color-pebble: #efeeed;
  --color-charcoal: #57534d;
  --color-stone: #79716b;
  --color-ash: #948d89;
  --color-true-black: #000000;

  /* Typography — Font Families */
  --font-sans-serif: 'sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-general-sans-variable: 'General Sans Variable', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-general-sans: 'General Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-geist-mono: 'Geist Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-general-sans-variable-variable-bold: 'General Sans Variable Variable Bold', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-space-mono: 'Space Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.3;
  --tracking-caption: -0.03px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.4;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-subheading: 18px;
  --leading-subheading: 1.6;
  --tracking-subheading: -0.01px;
  --text-heading-sm: 20px;
  --leading-heading-sm: 1.4;
  --tracking-heading-sm: -0.01px;
  --text-heading: 24px;
  --leading-heading: 1.3;
  --tracking-heading: -0.01px;
  --text-heading-lg: 32px;
  --leading-heading-lg: 1.2;
  --tracking-heading-lg: -0.02px;
  --text-display: 45px;
  --leading-display: 1.1;
  --tracking-display: -0.03px;
  --text-hero: 55px;
  --leading-hero: 1;
  --tracking-hero: -0.04px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-5: 5px;
  --spacing-6: 6px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-14: 14px;
  --spacing-15: 15px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-80: 80px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 64-80px;
  --card-padding: 16-24px;
  --element-gap: 10-12px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-2xl: 16px;
  --radius-3xl: 24px;
  --radius-3xl-2: 28px;
  --radius-full: 88px;
  --radius-full-2: 99px;
  --radius-full-3: 1000px;

  /* Named Radii */
  --radius-tags: 99px;
  --radius-cards: 8-16px;
  --radius-images: 4-8px;
  --radius-inputs: 8px;
  --radius-buttons: 99px;

  /* Shadows */
  --shadow-subtle: rgba(0, 0, 0, 0.25) 0px 1px 2px 0px;
  --shadow-md: rgba(0, 0, 0, 0.15) 0px 4px 12px 0px;
  --shadow-subtle-2: rgba(0, 0, 0, 0.05) 0px 1px 3px 0px, rgba(0, 0, 0, 0.05) 0px 1px 2px -1px;

  /* Surfaces */
  --surface-canvas: #ffffff;
  --surface-card: #fafaf9;
  --surface-nested: #efeeed;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-flame-orange: #fe551b;
  --color-ink: #1c1917;
  --color-paper: #ffffff;
  --color-bone: #fafaf9;
  --color-pebble: #efeeed;
  --color-charcoal: #57534d;
  --color-stone: #79716b;
  --color-ash: #948d89;
  --color-true-black: #000000;

  /* Typography */
  --font-sans-serif: 'sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-general-sans-variable: 'General Sans Variable', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-general-sans: 'General Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-geist-mono: 'Geist Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-general-sans-variable-variable-bold: 'General Sans Variable Variable Bold', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-space-mono: 'Space Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.3;
  --tracking-caption: -0.03px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.4;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-subheading: 18px;
  --leading-subheading: 1.6;
  --tracking-subheading: -0.01px;
  --text-heading-sm: 20px;
  --leading-heading-sm: 1.4;
  --tracking-heading-sm: -0.01px;
  --text-heading: 24px;
  --leading-heading: 1.3;
  --tracking-heading: -0.01px;
  --text-heading-lg: 32px;
  --leading-heading-lg: 1.2;
  --tracking-heading-lg: -0.02px;
  --text-display: 45px;
  --leading-display: 1.1;
  --tracking-display: -0.03px;
  --text-hero: 55px;
  --leading-hero: 1;
  --tracking-hero: -0.04px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-5: 5px;
  --spacing-6: 6px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-14: 14px;
  --spacing-15: 15px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-80: 80px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-2xl: 16px;
  --radius-3xl: 24px;
  --radius-3xl-2: 28px;
  --radius-full: 88px;
  --radius-full-2: 99px;
  --radius-full-3: 1000px;

  /* Shadows */
  --shadow-subtle: rgba(0, 0, 0, 0.25) 0px 1px 2px 0px;
  --shadow-md: rgba(0, 0, 0, 0.15) 0px 4px 12px 0px;
  --shadow-subtle-2: rgba(0, 0, 0, 0.05) 0px 1px 3px 0px, rgba(0, 0, 0, 0.05) 0px 1px 2px -1px;
}
```
