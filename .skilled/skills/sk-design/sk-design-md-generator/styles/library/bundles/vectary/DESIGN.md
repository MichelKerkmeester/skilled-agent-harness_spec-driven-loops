# Vectary — Style Reference
> Graphite blueprint with violet signal

**Theme:** light

Vectary operates on a near-monochromatic canvas: white surfaces, graphite-scale text from #252525 down to #949494, and zero chromatic noise until action is required. Visual hierarchy is built from weight and size, not color — Inter at weight 900 reserves itself for display moments, weight 700 for section headings, weight 400 for everything else. A single vivid violet (#6100ff) functions as the system's only color, appearing exclusively on the gradient CTA to signal the one thing the user can do. Components stay flat with hairline restraint, and the overall feeling is that of a precise drafting instrument rather than a decorated product.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Graphite | `#252525` | `--color-graphite` | Supporting neutral for secondary UI, dividers, and muted labels. Do not promote it to the primary CTA color |
| Charcoal | `#313131` | `--color-charcoal` | Secondary dark surface, nav panel background |
| Slate | `#595959` | `--color-slate` | Body text, secondary headings — the readable gray for paragraph copy |
| Fog | `#949494` | `--color-fog` | Muted helper text, captions, links at rest |
| Paper | `#ffffff` | `--color-paper` | Page background, text on dark fills |
| Electric Violet | `#6100ff` | `--color-electric-violet` | Violet supporting accent for decorative details and low-frequency emphasis. Do not promote it to the primary CTA color |
| Soft Violet | `#9d50ff` | `--color-soft-violet` | Supporting palette color for small decorative accents when the core palette needs contrast. Do not promote it to the primary CTA color |

## Tokens — Typography

### Inter — Single-family system: weight 400 for body and UI labels, weight 700 for section headings and button text, weight 900 reserved for display headlines (83px). The dramatic jump from 26px to 83px creates a two-tier hierarchy — page-heading-class copy lives at 22–26px, and only true hero moments reach 83px. Negative letter-spacing tightens with size: -0.012em at 14px scaling linearly to -0.039em at 83px, so display text optically squares up while small text stays crisp. · `--font-inter`
- **Substitute:** system-ui, -apple-system, 'Segoe UI', sans-serif
- **Weights:** 400, 700, 900
- **Sizes:** 14, 16, 18, 22, 26, 83px
- **Line height:** 1.00–1.69
- **Letter spacing:** -0.17px at 14px, -0.30px at 16px, -0.45px at 18px, -0.66px at 22px, -0.88px at 26px, -3.24px at 83px
- **OpenType features:** `"ss01" on, "cv11" on`
- **Role:** Single-family system: weight 400 for body and UI labels, weight 700 for section headings and button text, weight 900 reserved for display headlines (83px). The dramatic jump from 26px to 83px creates a two-tier hierarchy — page-heading-class copy lives at 22–26px, and only true hero moments reach 83px. Negative letter-spacing tightens with size: -0.012em at 14px scaling linearly to -0.039em at 83px, so display text optically squares up while small text stays crisp.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 14px | 1.69 | -0.17px | `--text-caption` |
| body-sm | 16px | 1.5 | -0.3px | `--text-body-sm` |
| body | 18px | 1.4 | -0.45px | `--text-body` |
| subheading | 22px | 1.3 | -0.66px | `--text-subheading` |
| heading | 26px | 1.09 | -0.88px | `--text-heading` |
| display | 83px | 1 | -3.24px | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 6px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 6 | 6px | `--spacing-6` |
| 9 | 9px | `--spacing-9` |
| 10 | 10px | `--spacing-10` |
| 16 | 16px | `--spacing-16` |
| 20 | 20px | `--spacing-20` |
| 30 | 30px | `--spacing-30` |
| 53 | 53px | `--spacing-53` |
| 60 | 60px | `--spacing-60` |

### Border Radius

| Element | Value |
|---------|-------|
| nav | 8px |
| tags | 8px |
| cards | 8px |
| buttons | 8px |

### Layout

- **Page max-width:** 800px
- **Section gap:** 60px
- **Card padding:** 30px
- **Element gap:** 20px

## Components

### Primary CTA Button
**Role:** Single conversion action on the page

Sign Up button: linear-gradient(129deg, #6100ff, #9d50ff) background, 14px Inter weight 700 in #ffffff, 8px border-radius, padding 12px 24px. No border, no shadow. The gradient is the only place chromatic color appears in the interface.

### Secondary Filled Button
**Role:** Lower-emphasis dark action paired with the primary CTA

Login button: #252525 solid background, 14px Inter weight 700 in #ffffff, 8px border-radius, padding 12px 24px. Sits left of the violet CTA to create a clear primary/secondary pairing without introducing a second accent color.

### Top Navigation Bar
**Role:** Persistent site header

White background, 60px vertical padding, logo at far left, four center-aligned text links (Product, Solutions, Enterprise, Resources, Pricing) at 14px Inter weight 400 in #252525 with chevron dropdowns, action buttons at far right. No visible border-bottom — the nav floats on white.

### Nav Dropdown Link
**Role:** Center-section menu items with sub-navigation

14px Inter weight 400 in #252525 with a 6px-down chevron icon in #595959. Hover state shifts to #6100ff text — the only moment violet touches the nav, signaling that the accent color can also function as an interactive indicator.

### Display Heading
**Role:** Hero-level headline (homepage/marketing only)

83px Inter weight 900 in #252525, line-height 1.00, letter-spacing -3.24px. Extreme weight plus extreme size plus tight tracking — this is the loudest element in the system and should appear at most once per page.

### Section Heading
**Role:** Page-title and sub-section labels

26px Inter weight 700 in #252525, line-height 1.09, letter-spacing -0.88px. Used for the main page title ("Acceptable Use Policy") and numbered section labels ("1. Intended Purpose of AI Features"). The high weight at moderate size reads as confident and structural rather than dramatic.

### Body Text Block
**Role:** Paragraph copy and legal prose

18px Inter weight 400 in #595959, line-height 1.40, letter-spacing -0.45px. Generous line-height for readability; the slate gray (#595959) on pure white keeps body text present without competing with headings.

### Bulleted List
**Role:** Enumerated constraints and requirements

18px Inter weight 400 in #595959, 6px vertical gap between items, bullet markers rendered as small dots in #949494. Indent ~24px from the left edge. Matches body text exactly — the list is purely structural, not visually distinct.

### Inline Text Link
**Role:** Reference links within body copy

Same size and weight as surrounding body text (18px / 400) but in #6100ff — violet is permitted inside body copy when it's functioning as a navigation affordance, though on this AUP page no inline links appear.

### Date/Metadata Label
**Role:** Secondary status line under page title

"Last Updated:" prefix in 18px Inter weight 400 #595959, followed by the date in same weight/color. Sits between the H1 and the intro paragraph, creating a small typographic bridge.

### Brand Logo
**Role:** Wordmark in nav

Stylized 'V' mark in #252525 followed by 'VECTARY' wordmark in tracked-out 14px Inter weight 700, all caps. Logo + wordmark lockup sits at the nav's left edge with no padding beyond the container margin.

## Do's and Don'ts

### Do
- Use Inter exclusively across the entire interface; never substitute a second typeface family
- Set border-radius to 8px on every rounded element — buttons, cards, nav containers, tags all share the same radius for a unified geometric language
- Reserve the violet gradient (linear-gradient(129deg, #6100ff, #9d50ff)) for the single primary CTA per screen; never duplicate it
- Use weight 900 only at the display size (83px); weights 400 and 700 cover everything else
- Apply negative letter-spacing at every size: -0.17px at 14px scaling to -3.24px at 83px
- Build vertical rhythm from the 6px base unit: 30px for card padding, 60px for section gaps, 20px between inline elements
- Keep the page background pure #ffffff; the system has no tinted canvas variants

### Don't
- Do not introduce a second chromatic accent — the system is monochromatic plus one violet, and adding red/green/blue/yellow breaks the drafting-tool identity
- Do not use weight 900 for body, labels, or section headings; it is loud and will flatten the hierarchy
- Do not add drop shadows, glows, or blur effects — the design language is flat; elevation comes from background tone, not shadow
- Do not use #6100ff on decorative icons, tags, illustrations, or non-action UI — the violet earns its place by being scarce
- Do not use #313131 as a page or card background; it is a nav-level surface only
- Do not set letter-spacing to 0 or positive values — the system always tightens, even at 14px body size
- Do not place violet text on a violet gradient background; the gradient already carries the brand and needs white text for contrast

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Paper | `#ffffff` | Page canvas — the default background for all content pages |
| 2 | Nav Panel | `#313131` | Dark navigation surface (used on sections of the site that flip to a dark header) |
| 3 | Graphite Fill | `#252525` | Secondary dark surface for filled buttons and inverted UI moments |

## Elevation

The system is intentionally flat. No drop shadows, no glow effects, no blur. Hierarchy is achieved through type weight, size, and background tone — a dark filled button (#252525) sits visually above body text not because it casts a shadow, but because its solid fill is darker than the white canvas. When separation is needed between stacked elements, use a 1px hairline border in a light neutral rather than introducing shadow.

## Imagery

This page is text-only — no photography, illustration, or product imagery appears on content/legal surfaces. The Vectary brand identity is built for a 3D design tool, so marketing and product pages likely feature rendered 3D models and product screenshots as the primary visual content, treated as contained compositions on the white canvas. Iconography is minimal and geometric, using thin stroke weights in #595959 or #252525. The overall imagery philosophy is 'the canvas is white, the product fills it' — imagery earns its place by demonstrating capability, not by decorating the page.

## Agent Prompt Guide

Quick Color Reference:
- text: #252525
- background: #ffffff
- muted text: #595959 / #949494
- primary action: no distinct CTA color
- dark surface: #252525

Example Component Prompts:
No distinct primary action color was observed; use the extracted neutral button treatments instead of inventing a filled CTA color.
2. Create a secondary dark button: #252525 background, 14px Inter weight 700, white text, 8px border-radius, padding 12px 24px.
3. Create a display heading: 83px Inter weight 900, #252525, line-height 1.0, letter-spacing -3.24px. Use once per page maximum.
4. Create a section heading: 26px Inter weight 700, #252525, line-height 1.09, letter-spacing -0.88px.
5. Create a body text block: 18px Inter weight 400, #595959, line-height 1.40, letter-spacing -0.45px, on #ffffff background.

## Similar Brands

- **Figma** — Same white-canvas + single-accent philosophy; both use Inter (or a near-identical geometric sans) and rely on weight contrast rather than color to build hierarchy
- **Linear** — Shares the restrained monochromatic palette with one vivid accent, though Linear goes dark-mode-first where Vectary stays light
- **Framer** — Clean light surface, tight Inter-style typography, and a single gradient CTA as the only chromatic moment on the page
- **Sketch** — Design-tool identity built on a quiet, near-monochrome interface where the product (not chrome) is the visual focus

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-graphite: #252525;
  --color-charcoal: #313131;
  --color-slate: #595959;
  --color-fog: #949494;
  --color-paper: #ffffff;
  --color-electric-violet: #6100ff;
  --color-soft-violet: #9d50ff;

  /* Typography — Font Families */
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.69;
  --tracking-caption: -0.17px;
  --text-body-sm: 16px;
  --leading-body-sm: 1.5;
  --tracking-body-sm: -0.3px;
  --text-body: 18px;
  --leading-body: 1.4;
  --tracking-body: -0.45px;
  --text-subheading: 22px;
  --leading-subheading: 1.3;
  --tracking-subheading: -0.66px;
  --text-heading: 26px;
  --leading-heading: 1.09;
  --tracking-heading: -0.88px;
  --text-display: 83px;
  --leading-display: 1;
  --tracking-display: -3.24px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-bold: 700;
  --font-weight-black: 900;

  /* Spacing */
  --spacing-unit: 6px;
  --spacing-6: 6px;
  --spacing-9: 9px;
  --spacing-10: 10px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-30: 30px;
  --spacing-53: 53px;
  --spacing-60: 60px;

  /* Layout */
  --page-max-width: 800px;
  --section-gap: 60px;
  --card-padding: 30px;
  --element-gap: 20px;

  /* Border Radius */
  --radius-lg: 8px;

  /* Named Radii */
  --radius-nav: 8px;
  --radius-tags: 8px;
  --radius-cards: 8px;
  --radius-buttons: 8px;

  /* Surfaces */
  --surface-paper: #ffffff;
  --surface-nav-panel: #313131;
  --surface-graphite-fill: #252525;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-graphite: #252525;
  --color-charcoal: #313131;
  --color-slate: #595959;
  --color-fog: #949494;
  --color-paper: #ffffff;
  --color-electric-violet: #6100ff;
  --color-soft-violet: #9d50ff;

  /* Typography */
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.69;
  --tracking-caption: -0.17px;
  --text-body-sm: 16px;
  --leading-body-sm: 1.5;
  --tracking-body-sm: -0.3px;
  --text-body: 18px;
  --leading-body: 1.4;
  --tracking-body: -0.45px;
  --text-subheading: 22px;
  --leading-subheading: 1.3;
  --tracking-subheading: -0.66px;
  --text-heading: 26px;
  --leading-heading: 1.09;
  --tracking-heading: -0.88px;
  --text-display: 83px;
  --leading-display: 1;
  --tracking-display: -3.24px;

  /* Spacing */
  --spacing-6: 6px;
  --spacing-9: 9px;
  --spacing-10: 10px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-30: 30px;
  --spacing-53: 53px;
  --spacing-60: 60px;

  /* Border Radius */
  --radius-lg: 8px;
}
```
