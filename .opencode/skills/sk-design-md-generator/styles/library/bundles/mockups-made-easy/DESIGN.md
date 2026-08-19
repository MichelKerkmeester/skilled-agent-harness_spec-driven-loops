# Mockups made easy — Style Reference
> Editorial design studio on white paper

**Theme:** light

Maneken's visual system is gallery-first: a near-white canvas lets photographic mockup work dominate while a single saturated blue acts as the only chromatic voice in the interface. Typography does the heavy lifting — a custom display face (TWKEverett) towers over the page in oversized 77–110px headlines with tight 1.0–1.2 leading, creating an editorial magazine feel rather than a typical SaaS dashboard. Inter handles everything functional at compact 14–18px sizes, creating a deliberate tension between theatrical display type and utilitarian UI. Surfaces stay flat with 10px radii, borders lean heavily on pure black hairlines, and elevation is reserved for the image content itself via soft, multi-layer drop shadows.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Signal Blue | `#0050b7` | `--color-signal-blue` | Primary action buttons, logo dot accent, active nav strokes — the only chromatic color in the system creates unmistakable focus against the monochrome frame |
| Ink | `#000000` | `--color-ink` | Primary text, icon fills, hairline borders, image outlines — true black anchors the monochrome structure with maximum contrast (21:1 on white) |
| Paper | `#ffffff` | `--color-paper` | Card surfaces, button text on dark, image backgrounds — the bright surface that makes photographic content pop |
| Carbon | `#10151c` | `--color-carbon` | Dark surface backgrounds, body text on light cards, nav bar fills — near-black with a barely-perceptible blue undertone that warms the deep neutral |
| Fog | `#f4f4f4` | `--color-fog` | Page canvas background, hero section fill, soft card surfaces — the warm off-white that separates page chrome from white content cards |
| Ash | `#eaeaea` | `--color-ash` | Hairline dividers, subtle section borders, input outlines — sits between fog and white for the gentlest structural separation |
| Graphite | `#86868b` | `--color-graphite` | Muted subheadings, secondary metadata, heading accents — the mid-gray that steps text down without going fully gray |
| Graphite Smoke | `#3e3e3e` | `--color-graphite-smoke` | Alternate button background, dark UI surface variant — a warm dark gray for secondary filled actions when blue is too prominent |
| Stone | `#a6a6a6` | `--color-stone` | Nav background overlays, tertiary surface tint — lightest functional gray for layering context |

## Tokens — Typography

### Inter — All UI chrome: navigation, buttons, body text, card labels, footer, links, inputs, icons. Weight 800 for the MANEKEN wordmark and key emphasis; weight 500 for nav items; weight 400 as the UI default. The 200px instance is a decorative oversized treatment, not a working type size. · `--font-inter`
- **Substitute:** system-ui or -apple-system as fallback
- **Weights:** 400, 500, 600, 800
- **Sizes:** 10px, 14px, 15px, 18px, 24px, 28px, 40px, 200px
- **Line height:** 1.00, 1.20, 1.25, 1.40
- **Letter spacing:** normal
- **Role:** All UI chrome: navigation, buttons, body text, card labels, footer, links, inputs, icons. Weight 800 for the MANEKEN wordmark and key emphasis; weight 500 for nav items; weight 400 as the UI default. The 200px instance is a decorative oversized treatment, not a working type size.

### TWKEverett — Display headlines and hero copy at 55–110px with near-zero leading (1.0–1.1). The custom serif-grotesque hybrid gives the page editorial weight — headlines behave like magazine covers, not SaaS cards. Used at 22–28px for lead paragraphs where Inter would feel too neutral. · `--font-twkeverett`
- **Substitute:** GT Sectra, Recoleta, or Tiempos Headline
- **Weights:** 400, 500
- **Sizes:** 16px, 22px, 24px, 28px, 55px, 60px, 77px, 110px
- **Line height:** 1.00, 1.10, 1.20, 1.45
- **Letter spacing:** normal (no tracking adjustment — the tight sizes and condensed letterforms provide their own density)
- **Role:** Display headlines and hero copy at 55–110px with near-zero leading (1.0–1.1). The custom serif-grotesque hybrid gives the page editorial weight — headlines behave like magazine covers, not SaaS cards. Used at 22–28px for lead paragraphs where Inter would feel too neutral.

### Arial — Arial — detected in extracted data but not described by AI · `--font-arial`
- **Weights:** 400, 500
- **Sizes:** 13px
- **Line height:** 1.2
- **Role:** Arial — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 10px | 1.2 | — | `--text-caption` |
| body-sm | 14px | 1.4 | — | `--text-body-sm` |
| body-lg | 18px | 1.4 | — | `--text-body-lg` |
| subheading | 22px | 1.2 | — | `--text-subheading` |
| heading-sm | 28px | 1.2 | — | `--text-heading-sm` |
| heading | 40px | 1.25 | — | `--text-heading` |
| heading-lg | 55px | 1.1 | — | `--text-heading-lg` |
| display | 77px | 1 | — | `--text-display` |
| display-xl | 110px | 1 | — | `--text-display-xl` |

## Tokens — Spacing & Shapes

**Density:** compact

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 6 | 6px | `--spacing-6` |
| 8 | 8px | `--spacing-8` |
| 10 | 10px | `--spacing-10` |
| 12 | 12px | `--spacing-12` |
| 16 | 16px | `--spacing-16` |
| 20 | 20px | `--spacing-20` |
| 22 | 22px | `--spacing-22` |
| 24 | 24px | `--spacing-24` |
| 28 | 28px | `--spacing-28` |
| 30 | 30px | `--spacing-30` |
| 32 | 32px | `--spacing-32` |
| 40 | 40px | `--spacing-40` |
| 50 | 50px | `--spacing-50` |
| 80 | 80px | `--spacing-80` |
| 140 | 140px | `--spacing-140` |

### Border Radius

| Element | Value |
|---------|-------|
| hero | 15px |
| cards | 10px |
| icons | 3px |
| pills | 100px |
| images | 10px |
| buttons | 10px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| xl | `rgba(0, 0, 0, 0.01) 0px 90px 40px 0px, rgba(0, 0, 0, 0.05...` | `--shadow-xl` |
| xl-2 | `rgba(0, 0, 0, 0.01) 0px 550px 220px 0px, rgba(0, 0, 0, 0....` | `--shadow-xl-2` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 20px
- **Element gap:** 10px

## Components

### Primary Action Button
**Role:** Filled CTA — single chromatic anchor for conversion moments

Background #0050b7, white text (#ffffff), Inter weight 500 at 15px. Padding 10px 20px. Border-radius 10px. No border, no shadow. Suffix arrow character (→) in same white. This is the only filled chromatic button in the system — use sparingly to preserve its signal value.

### Secondary Outline Button
**Role:** Ghost/outline variant for less emphatic CTAs

Transparent background, 1px solid #000000 border, black text Inter weight 500 at 15px. Padding 10px 20px. Border-radius 10px. Used when the primary blue button already exists on the page and a second action is needed.

### Navigation Link
**Role:** Top nav menu items

Inter weight 500 at 15px, color #000000, no underline. Horizontal padding 6–10px. Spacing between nav items 18–20px. Active state not visually decorated — relies on context.

### Logo Lockup
**Role:** Brand mark in header

"MANEKEN" set in Inter weight 800, all caps, tightly tracked, color #000000. Followed by a 4px solid #0050b7 circular dot at baseline level. The blue dot is the only chromatic mark in the wordmark.

### Display Headline
**Role:** Hero and section titles — the page's signature type moment

TWKEverett weight 400 at 77–110px, line-height 1.0, color #000000. Two-line stacks are common ("Mockups / made easy"). The first line carries the noun, the second the verb — creates a reading pause. No italic, no gradient, no decoration.

### Section Subtitle
**Role:** Supporting line under a display headline

Inter weight 400 at 18–24px, color #86868b or #000000, centered, max-width ~600px. Tightens the relationship between hero headline and CTA below.

### Mockup Image Card
**Role:** Gallery tiles showing creator output

Full-bleed photographic image, no padding inside, 10px border-radius, 1px solid #000000 border. Layered soft drop shadow: rgba(0,0,0,0.01) 0px 90px 40px, rgba(0,0,0,0.05) 0px 50px 30px, rgba(0,0,0,0.09) 0px 20px 20px, rgba(0,0,0,0.1) 0px 6px 10px. Shadow is wide and gentle, not sharp — it lifts images off the canvas without theatrical depth.

### Creator Profile Card
**Role:** Image with creator attribution overlay

Same 10px radius and border as the image card. Attribution row sits below or overlays the bottom: small Inter 14px label with a 20px circular avatar (or pill). No box shadow on the card itself — shadow only on the image.

### Section Header Block
**Role:** Centered text block introducing a gallery or feature section

Display headline (TWKEverett 40–60px) + subtitle (Inter 18px #86868b) + optional primary CTA button, all centered. 80px vertical padding above and below. The block creates a clear breath between visual galleries.

### Cookie Consent Banner
**Role:** Bottom-left dismissible notice

White (#ffffff) background, 10px border-radius, subtle 1px border. Two-line body text (Inter 14px black) + filled black "Okay" button (Inter 500 white text, 10px radius). Fixed to bottom-left with ~16px margin from viewport edge.

### Top Navigation Bar
**Role:** Sticky/fixed site header

White (#ffffff) or transparent background, no border in scrolled state, full-width with centered nav links. Logo flush left, auth actions flush right ("Log in" text + filled blue "Sign up" button). Nav items horizontally centered as a group. Min-height ~56px.

## Do's and Don'ts

### Do
- Use TWKEverett at 77–110px with line-height 1.0 for hero and section display headlines — its tight leading is the signature of the page
- Reserve #0050b7 Signal Blue for primary action buttons, the logo dot, and active states only; never use it for body text, icons, or decorative borders
- Apply 10px border-radius to all cards, buttons, images, and interactive surfaces as the universal corner language
- Layer the four-stop soft drop shadow stack on photographic image cards to lift them off the #f4f4f4 canvas
- Set Inter body text at 14–18px weight 400–500 — the UI voice is compact and functional, never theatrical
- Use #000000 for hairlines, icons, and text — true black at 1px provides the structural skeleton of the layout
- Keep section gaps at 80px to create editorial breathing room between content bands

### Don't
- Don't introduce additional accent colors — the system is monochromatic plus one blue; a second hue breaks the signal
- Don't use sharp, high-alpha shadows on UI elements — soft, low-alpha, large-radius shadows are reserved for photographic content only
- Don't set display headlines in Inter — TWKEverett is the only face permitted above 40px; using Inter at 77px flattens the editorial moment
- Don't use filled blue buttons for secondary actions; ghost/outline (#000000 border) preserves the blue's scarcity
- Don't add gradients, glows, or glassmorphism — the system is flat with single-layer surfaces
- Don't reduce border-radius below 10px for primary surfaces; the 10px corner is the system baseline, not 8px or 6px
- Don't use color for information hierarchy — rely on type weight, size, and the #86868b Graphite step to step text down, not chromatic variation

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas | `#f4f4f4` | Page background — warm off-white that distinguishes chrome from content |
| 1 | Card | `#ffffff` | Content surfaces, image cards, navigation bar, modals |
| 2 | Dark Surface | `#10151c` | Dark mode cards, dark section backgrounds, near-black text on light cards |

## Elevation

- **Image Card:** `rgba(0, 0, 0, 0.01) 0px 90px 40px 0px, rgba(0, 0, 0, 0.05) 0px 50px 30px 0px, rgba(0, 0, 0, 0.09) 0px 20px 20px 0px, rgba(0, 0, 0, 0.1) 0px 6px 10px 0px`
- **Elevated Card:** `rgba(0, 0, 0, 0.01) 0px 550px 220px 0px, rgba(0, 0, 0, 0.05) 0px 310px 190px 0px, rgba(0, 0, 0, 0.09) 0px 140px 140px 0px, rgba(0, 0, 0, 0.1) 0px 35px 75px 0px`

## Imagery

Photography is the product. Every section beyond the hero is a dense image grid showing mockup output on real-world surfaces — coffee cups, tote bags, billboards, laptops, signage, apparel, packaging. Images are tightly cropped on their subjects with no lifestyle staging, no stock photography warmth. The grid uses 4–5 columns at desktop width with 8–10px gaps so tiles feel like a contact sheet rather than a card gallery. Images carry a 1px black border plus the four-layer soft shadow, which is the only border treatment in the system. There is no illustration, no abstract graphic, no product screenshot of the editor itself in the visible surface — the mockups ARE the product story.

## Layout

Full-bleed page canvas in #f4f4f4 with content centered at a max-width of ~1200px. The hero is a centered text stack: massive two-line display headline, single-line Inter subtitle, and one filled blue CTA — no hero image, no side-by-side split. Below the hero, the page alternates between a full-bleed edge-to-edge image grid and centered section header blocks. The first gallery shows 4 columns of tightly packed mockup tiles with minimal gap; later sections use 4-column creator cards with attribution. Navigation is a fixed top bar with centered links, logo flush left, auth actions flush right. Section rhythm is generous: 80px vertical padding separates every band. The overall page reads top-to-bottom as headline → gallery → headline → gallery, like an editorial portfolio rather than a feature checklist.

## Agent Prompt Guide

**Quick Color Reference**
- text: #000000
- background: #f4f4f4 (canvas) / #ffffff (surface)
- border: #000000 (hairline) / #eaeaea (subtle divider)
- accent: #0050b7 (Signal Blue — logo dot, active states)
- primary action: #0050b7 (filled action)
- dark surface: #10151c

**3-5 Example Component Prompts**

1. *Create a hero section*: #f4f4f4 background. Headline at 110px TWKEverett weight 400, #000000, line-height 1.0. Two lines. Subtitle at 18px Inter weight 400, #86868b, centered, max-width 600px. Primary CTA: 10px radius, #0050b7 background, #ffffff text at 15px Inter weight 500, 10px 20px padding, white "→" suffix.

2. *Create a mockup image card*: full-bleed photographic image filling the card, 10px border-radius, 1px solid #000000 border, layered soft shadow (four-stop rgba black at 0.01/0.05/0.09/0.1, blur radii 90/50/20/6px). No internal padding.

3. Create a Primary Action Button: #0050b7 background, #ffffff text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.

4. *Create a section header block*: centered. TWKEverett 55px weight 400 #000000 headline. Inter 18px weight 400 #86868b subtitle below with 20px gap. Optional primary CTA button 30px below subtitle. 80px padding above and below the block.

5. *Create a ghost button*: transparent background, 1px solid #000000 border, 10px border-radius, Inter 15px weight 500 #000000 text, 10px 20px padding. No shadow.

## Similar Brands

- **Linear** — Same monochrome-first approach with a single saturated blue accent on an off-white canvas; both use compact Inter-based UI type paired with oversized display moments
- **Framer** — Editorial gallery-driven landing page with image grids as the primary content surface, tight spacing, and restrained chromatic palette
- **Read.cv** — Magazine-style layout rhythm with centered text stacks, large editorial headlines, and dense image grids below the fold
- **Are.na** — Quiet, white-canvas design tool aesthetic that lets user-generated visual content dominate while chrome stays minimal and functional

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-signal-blue: #0050b7;
  --color-ink: #000000;
  --color-paper: #ffffff;
  --color-carbon: #10151c;
  --color-fog: #f4f4f4;
  --color-ash: #eaeaea;
  --color-graphite: #86868b;
  --color-graphite-smoke: #3e3e3e;
  --color-stone: #a6a6a6;

  /* Typography — Font Families */
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-twkeverett: 'TWKEverett', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-arial: 'Arial', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.2;
  --text-body-sm: 14px;
  --leading-body-sm: 1.4;
  --text-body-lg: 18px;
  --leading-body-lg: 1.4;
  --text-subheading: 22px;
  --leading-subheading: 1.2;
  --text-heading-sm: 28px;
  --leading-heading-sm: 1.2;
  --text-heading: 40px;
  --leading-heading: 1.25;
  --text-heading-lg: 55px;
  --leading-heading-lg: 1.1;
  --text-display: 77px;
  --leading-display: 1;
  --text-display-xl: 110px;
  --leading-display-xl: 1;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-extrabold: 800;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-6: 6px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-22: 22px;
  --spacing-24: 24px;
  --spacing-28: 28px;
  --spacing-30: 30px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-50: 50px;
  --spacing-80: 80px;
  --spacing-140: 140px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 20px;
  --element-gap: 10px;

  /* Border Radius */
  --radius-sm: 3px;
  --radius-lg: 10px;
  --radius-xl: 15px;
  --radius-2xl: 18px;
  --radius-full: 100px;

  /* Named Radii */
  --radius-hero: 15px;
  --radius-cards: 10px;
  --radius-icons: 3px;
  --radius-pills: 100px;
  --radius-images: 10px;
  --radius-buttons: 10px;

  /* Shadows */
  --shadow-xl: rgba(0, 0, 0, 0.01) 0px 90px 40px 0px, rgba(0, 0, 0, 0.05) 0px 50px 30px 0px, rgba(0, 0, 0, 0.09) 0px 20px 20px 0px, rgba(0, 0, 0, 0.1) 0px 6px 10px 0px;
  --shadow-xl-2: rgba(0, 0, 0, 0.01) 0px 550px 220px 0px, rgba(0, 0, 0, 0.05) 0px 310px 190px 0px, rgba(0, 0, 0, 0.09) 0px 140px 140px 0px, rgba(0, 0, 0, 0.1) 0px 35px 75px 0px;

  /* Surfaces */
  --surface-canvas: #f4f4f4;
  --surface-card: #ffffff;
  --surface-dark-surface: #10151c;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-signal-blue: #0050b7;
  --color-ink: #000000;
  --color-paper: #ffffff;
  --color-carbon: #10151c;
  --color-fog: #f4f4f4;
  --color-ash: #eaeaea;
  --color-graphite: #86868b;
  --color-graphite-smoke: #3e3e3e;
  --color-stone: #a6a6a6;

  /* Typography */
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-twkeverett: 'TWKEverett', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-arial: 'Arial', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.2;
  --text-body-sm: 14px;
  --leading-body-sm: 1.4;
  --text-body-lg: 18px;
  --leading-body-lg: 1.4;
  --text-subheading: 22px;
  --leading-subheading: 1.2;
  --text-heading-sm: 28px;
  --leading-heading-sm: 1.2;
  --text-heading: 40px;
  --leading-heading: 1.25;
  --text-heading-lg: 55px;
  --leading-heading-lg: 1.1;
  --text-display: 77px;
  --leading-display: 1;
  --text-display-xl: 110px;
  --leading-display-xl: 1;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-6: 6px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-22: 22px;
  --spacing-24: 24px;
  --spacing-28: 28px;
  --spacing-30: 30px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-50: 50px;
  --spacing-80: 80px;
  --spacing-140: 140px;

  /* Border Radius */
  --radius-sm: 3px;
  --radius-lg: 10px;
  --radius-xl: 15px;
  --radius-2xl: 18px;
  --radius-full: 100px;

  /* Shadows */
  --shadow-xl: rgba(0, 0, 0, 0.01) 0px 90px 40px 0px, rgba(0, 0, 0, 0.05) 0px 50px 30px 0px, rgba(0, 0, 0, 0.09) 0px 20px 20px 0px, rgba(0, 0, 0, 0.1) 0px 6px 10px 0px;
  --shadow-xl-2: rgba(0, 0, 0, 0.01) 0px 550px 220px 0px, rgba(0, 0, 0, 0.05) 0px 310px 190px 0px, rgba(0, 0, 0, 0.09) 0px 140px 140px 0px, rgba(0, 0, 0, 0.1) 0px 35px 75px 0px;
}
```
