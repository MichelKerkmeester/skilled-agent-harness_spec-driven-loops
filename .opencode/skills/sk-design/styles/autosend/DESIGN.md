# AutoSend — Style Reference
> Warm stone atelier with a single violet spark — where serif headlines and electric-indigo CTAs share the same quiet off-white room.

**Theme:** light

AutoSend reads like a warm-technical workspace: a stone-warm off-white canvas, restrained chrome, and one vivid electric-violet accent that makes actions feel switched on. The hero headline is a Cooper serif at near-display size, pairing upright with italic for a single emphasis word — this humanist serif is the anti-Sans-Helvetica SaaS move and defines the page's voice. UI chrome stays monochrome and calm; color is punctuation, not wallpaper, appearing on the CTA, card borders, and icon strokes. Components are flat and weightless: 8–16px radii, hairline stone borders, and a single soft drop shadow reserved for elevated product surfaces.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Warm Bone | `#fafaf9` | `--color-warm-bone` | Page canvas, button secondary fills, section backgrounds — the warm off-white that prevents the page from feeling clinical |
| Paper White | `#ffffff` | `--color-paper-white` | Card surfaces, elevated panels, primary button text, input fills — layered above Warm Bone for subtle separation |
| Stone Mist | `#e7e5e4` | `--color-stone-mist` | Hairline borders, dividers, button outlines, list separators — the structural linework that holds the layout together |
| Bark Grey | `#79716b` | `--color-bark-grey` | Muted body text, secondary labels, icon strokes, placeholder copy — warm rather than cool grey |
| Charcoal | `#292524` | `--color-charcoal` | Primary text, headings, active nav, dominant border color — the near-black that carries every important word |
| Obsidian | `#0c0a09` | `--color-obsidian` | Deepest text and edge cases requiring maximum contrast |
| Pebble | `#a6a09b` | `--color-pebble` | Tertiary text, disabled states, subtle icon tints |
| Electric Indigo | `#615fff` | `--color-electric-indigo` | Primary CTA fill, active links, brand marks — the singular chromatic accent that makes the sign-up button feel switched on |
| Deep Violet | `#4f39f6` | `--color-deep-violet` | Hover and pressed states for Electric Indigo, decorative borders, illustration strokes |
| Terracotta | `#d97757` | `--color-terracotta` | Secondary accent — warm orange used sparingly on card borders, decorative icons, and highlight strokes to soften the indigo/grey palette |
| Lichen Green | `#5ea500` | `--color-lichen-green` | Green outline accent for tags, dividers, and focused UI edges. Use as a supporting accent, not as a status color |
| Tide Teal | `#22b8cd` | `--color-tide-teal` | Teal decorative accent for icons, marks, and small graphic details. Use as a supporting accent, not as a status color |
| Alarm Red | `#ff0000` | `--color-alarm-red` | Red accent for outlined action borders, linked labels, and lightweight interactive emphasis. Use as a supporting accent, not as a status color |
| Sapphire Link | `#007ebb` | `--color-sapphire-link` | Standard text links within body copy — the one blue that behaves like a link |

## Tokens — Typography

### Geist — Primary UI and body font — nav items, buttons, card copy, subheadings; weight 400 for body, 600 for emphasis and button labels; the 40px weight 600 carries the largest non-display heading tier · `--font-geist`
- **Substitute:** Inter, Manrope, or system-ui sans-serif
- **Weights:** 400, 600
- **Sizes:** 12px, 14px, 16px, 18px, 20px, 40px
- **Line height:** 1.20–1.56
- **Role:** Primary UI and body font — nav items, buttons, card copy, subheadings; weight 400 for body, 600 for emphasis and button labels; the 40px weight 600 carries the largest non-display heading tier

### Cooper LtBT — Display headlines and hero copy only — the warm book-weight serif with italic for emphasis words is the signature voice of the brand; substitutes for body would dilute the effect · `--font-cooper-ltbt`
- **Substitute:** Playfair Display, Cormorant Garamond, or Lora
- **Weights:** 400
- **Sizes:** 18px, 80px
- **Line height:** 1.10–1.33
- **Letter spacing:** normal
- **Role:** Display headlines and hero copy only — the warm book-weight serif with italic for emphasis words is the signature voice of the brand; substitutes for body would dilute the effect

### Geist Mono — Code, API labels, uppercase section tags (e.g. 'EMAILS SENT BY BIG AND SMALL COMPANIES ALIKE!'), button micro-labels — tracked out at 0.04–0.10em to read as tag/label type rather than body · `--font-geist-mono`
- **Substitute:** JetBrains Mono, IBM Plex Mono, or Space Mono
- **Weights:** 400, 500, 600
- **Sizes:** 12px, 13px, 14px, 16px
- **Line height:** 1.00–1.54
- **Letter spacing:** 0.04em–0.10em (wider for uppercase tags)
- **Role:** Code, API labels, uppercase section tags (e.g. 'EMAILS SENT BY BIG AND SMALL COMPANIES ALIKE!'), button micro-labels — tracked out at 0.04–0.10em to read as tag/label type rather than body

### dataType — Numeric stat values in the metrics bar (755,470 / 96.82% / 1.87s / 3.10%) — a dedicated monospaced-figure family so digits align · `--font-datatype`
- **Substitute:** JetBrains Mono or Geist Mono at 24px
- **Weights:** 400
- **Sizes:** 24px
- **Line height:** 1.33
- **Role:** Numeric stat values in the metrics bar (755,470 / 96.82% / 1.87s / 3.10%) — a dedicated monospaced-figure family so digits align

### ui-sans-serif — ui-sans-serif — detected in extracted data but not described by AI · `--font-ui-sans-serif`
- **Weights:** 400
- **Sizes:** 16px
- **Line height:** 1.5
- **Role:** ui-sans-serif — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.33 | 0.48px | `--text-caption` |
| body-sm | 14px | 1.43 | — | `--text-body-sm` |
| body | 16px | 1.5 | — | `--text-body` |
| subheading | 18px | 1.56 | — | `--text-subheading` |
| heading-sm | 20px | 1.38 | — | `--text-heading-sm` |
| heading | 40px | 1.2 | — | `--text-heading` |
| display | 80px | 1.1 | — | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 8px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 8 | 8px | `--spacing-8` |
| 16 | 16px | `--spacing-16` |
| 24 | 24px | `--spacing-24` |
| 32 | 32px | `--spacing-32` |
| 40 | 40px | `--spacing-40` |
| 64 | 64px | `--spacing-64` |
| 80 | 80px | `--spacing-80` |
| 120 | 120px | `--spacing-120` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 8px |
| cards | 16px |
| links | 8px |
| pills | 9999px |
| inputs | 12px |
| buttons | 8px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| xl | `rgba(0, 0, 0, 0.1) 0px 20px 25px -5px, rgba(0, 0, 0, 0.1)...` | `--shadow-xl` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 24px
- **Element gap:** 16px

## Components

### Primary Filled Button
**Role:** The single most important action on any screen — sign up, submit, confirm

Background #615fff (Electric Indigo), text #ffffff in Geist 14px weight 600 uppercase with 0.04em tracking. Horizontal padding 16px, vertical 10–12px. Border radius 8px. No visible border; relies on fill for definition. On hover deepen to #4f39f6 (Deep Violet).

### Ghost Outline Button
**Role:** Secondary actions that share the page with a primary CTA (e.g. BOOK A DEMO beside SIGN UP)

Transparent background, 1px border in #e7e5e4 (Stone Mist) or #292524 (Charcoal), text #292524 in Geist 14px weight 600 uppercase with 0.04em tracking. Padding 12px vertical, 16–24px horizontal. Radius 8px. Hover: border darkens to #292524.

### Top Navigation Bar
**Role:** Sticky site navigation

Full-width bar on #fafaf9 (Warm Bone) with no visible bottom border — content sits on the canvas. Left: club-suit logomark + 'AUTOSEND' in Geist 14px weight 600 uppercase. Center: nav links in Geist 14px weight 400 Charcoal with dropdown carets on SOLUTIONS and DOCS. Right: LOG IN ghost button (no border, text only) followed by SIGN UP filled violet button. Vertical padding ~16px, horizontal padding 24px. Max width 1200px centered.

### Hero Section
**Role:** First screen above the fold

Centered single-column on #fafaf9. Headline at 80px Cooper LtBT weight 400 in #292524, line-height 1.10, with the word 'teams' set in italic Cooper for emphasis. Below: subtext in Geist 18px weight 400 #79716b (Bark Grey) across two short lines. CTA pair: Ghost 'BOOK A DEMO' + Filled 'SIGN UP' stacked horizontally with 16px gap. Vertical breathing room ~80px top and bottom.

### Product Showcase Card
**Role:** Visual proof — a screenshot or illustrated surface showing the product in use

Full-width card on #ffffff with 1px #e7e5e4 border, radius 16px, soft shadow `0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)`. Contains a photographic or product-render image that bleeds to the card edges with no inner padding on the image area. 24px internal padding around overlaid text or controls.

### Feature Card (3-column grid)
**Role:** Tile describing a product capability (Email API, MCP, skill.md)

White (#ffffff) card with 1px #e7e5e4 border, radius 8px, 24px padding. Title in Geist 18px weight 600 #292524. Body in Geist 14px weight 400 #79716b, 1.43 line-height. Footer row: 'DOCS →' link in Geist Mono 12px weight 500 uppercase tracked 0.04em, color #292524, with a trailing arrow glyph. Cards sit in a 3-column grid with 24px gaps.

### Arrow Link
**Role:** Inline link that should read as 'go somewhere' — used in card footers and section endings

Text in Geist Mono 12px weight 500–600 uppercase, tracked 0.04em, color #292524. Trailing arrow (→) in the same color. No underline by default; opacity drops to 0.6 on hover. When used as the only action in a card footer, sits flush right with 12px top margin separated by a 1px #e7e5e4 divider.

### Stats Bar
**Role:** Row of credibility metrics

White background, 1px top/bottom #e7e5e4 border, no vertical padding on the outer rule. Four equal-width columns separated by vertical 1px #e7e5e4 dividers. Each column: large number in dataType 24px weight 400 #292524 centered, label below in Geist 12px weight 400 #79716b. Column padding 24px vertical, 16px horizontal.

### Section Label Tag
**Role:** Uppercase eyebrow text introducing a section (e.g. 'EMAILS SENT BY BIG AND SMALL COMPANIES ALIKE!')

Geist Mono 12px weight 500–600, tracked 0.10em (the widest tracking in the system), color #79716b or #292524, centered. Sits alone or above a logo strip with 16–24px vertical margin.

### Logo Strip
**Role:** Social proof — customer/partner logos

Single row of greyscale or muted-color logos, evenly distributed, each logo max-height ~24px. Logos use their own brand colors but appear at reduced opacity (~0.6) to read as a unified band. 40px vertical padding above and below.

### Text Input
**Role:** Form fields for email capture and similar

Background #ffffff, 1px #e7e5e4 border, radius 12px, padding 12px 16px. Text in Geist 16px weight 400 #292524. Placeholder in #a6a09b (Pebble). Focus state: border shifts to #615fff (Electric Indigo), 2px ring `0 0 0 3px rgba(97,95,255,0.15)`.

### Code Block
**Role:** Inline or block code samples

Geist Mono 14px weight 400 in #292524, background #fafaf9 or transparent, 1px #e7e5e4 border, radius 8px, 16px padding. Optional copy-to-clipboard icon top-right in Bark Grey.

## Do's and Don'ts

### Do
- Set the hero headline in Cooper LtBT 80px weight 400 and italicize exactly one emphasis word per line
- Use #615fff fill + #ffffff text as the only primary CTA — never use #292524 or any neutral for the primary action
- Use #fafaf9 as the page canvas and #ffffff as the card surface; never invert the warm-off-white / pure-white relationship
- Apply 8px radius to buttons and links, 16px radius to cards, 12px radius to inputs
- Set uppercase tags and labels in Geist Mono with 0.04–0.10em tracking
- Separate sections with 1px #e7e5e4 hairlines or 80px vertical gaps, not with colored bands
- Keep all non-CTA text in the warm-grey family (#292524, #79716b, #a6a09b) — never use a chromatic color for body copy

### Don't
- Don't use #4f39f6 (Deep Violet) as a button fill — it is the hover/pressed state of the primary CTA, not a separate accent
- Don't set body text in the serif — Cooper is reserved for the display headline tier
- Don't add drop shadows to buttons, nav bars, or feature cards — the product showcase card is the only shadowed surface
- Don't introduce new chromatic colors for status states — reuse the existing palette (#5ea500 green, #22b8cd teal, #ff0000 red) at 1px stroke or icon weight
- Don't use #d97757 (Terracotta) for interactive elements — it is a decorative accent for borders and icon strokes only
- Don't center body copy below the hero — the headline is the only centered text; everything else left-aligns within its column
- Don't use letter-spacing wider than 0.10em or narrower than normal — the two values (0.04em tags, 0.10em eyebrows) are the only tracking steps

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Warm Bone Canvas | `#fafaf9` | Base page background — warm off-white that gives the entire site its calm, paper-like atmosphere |
| 1 | Paper White Card | `#ffffff` | Elevated card and panel surfaces, input fills, button text on dark fills |
| 2 | Stone Mist Border | `#e7e5e4` | Hairline dividers between sections and around cards — separation by line, not fill |

## Elevation

- **Product Showcase Card:** `0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)`

## Imagery

Imagery is sparse and high-trust: a single landscape photograph (mountain ridges, muted blue-green) anchors the product showcase card, full-bleed within the card. No lifestyle photography, no people, no stock illustrations. Decorative icons appear as 1px stroked outlines in Geist-compatible proportions, colored in the same palette as text and borders (Bark Grey, Charcoal, or the single violet/terracotta accent). Logos in the social-proof strip are small and sit at reduced opacity — they decorate, they do not dominate.

## Layout

Max-width 1200px centered content on a full-bleed #fafaf9 canvas. Hero is a single centered column with generous vertical padding (~80px). Product showcase is full-width within the max-width with 16px radius and soft shadow. Below it, a 3-column card grid for features with 24px gaps. A horizontal stats bar spans the full content width, divided into 4 equal columns by vertical hairlines. Navigation is a single sticky top bar with no visible bottom border, giving a floating-on-canvas feeling. The page never breaks the centered symmetry on desktop — every section aligns to the same vertical center axis. Section rhythm is consistent: 80px gap between major sections, 40px between closely related blocks.

## Agent Prompt Guide

**Quick Color Reference**
- canvas: #fafaf9
- card surface: #ffffff
- border / hairline: #e7e5e4
- primary text: #292524
- muted text: #79716b
- primary action: #615fff (filled action)

**Example Component Prompts**

1. Create a Primary Action Button: #615fff background, #ffffff text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.

2. *Feature card* — White (#ffffff) card, 1px #e7e5e4 border, 8px radius, 24px padding. Title in Geist 18px weight 600 #292524. Body in Geist 14px weight 400 #79716b, line-height 1.43. Footer separator: 1px #e7e5e4 hairline, 12px top margin. Footer text: 'DOCS →' in Geist Mono 12px weight 500 uppercase 0.04em, #292524.

3. *Product showcase card* — Full-width within 1200px max, white surface, 1px #e7e5e4 border, 16px radius, shadow `0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)`. Image bleeds to card edges. 24px internal padding around any overlaid UI.

4. *Stats bar* — Full-width white band, 1px #e7e5e4 top and bottom borders, no outer padding. Four equal columns separated by 1px #e7e5e4 vertical dividers. Each column: dataType 24px weight 400 #292524 number on top, Geist 12px weight 400 #79716b label below, 24px vertical padding.

5. *Section eyebrow tag* — Centered Geist Mono 12px weight 600 uppercase, tracking 0.10em, color #79716b. 16px below it: a row of logos at max-height 24px, opacity 0.6, evenly spaced across the 1200px content width.

## Similar Brands

- **Resend** — Same warm-stone canvas, same single electric accent for the primary CTA, same hairline-bordered cards and minimal shadowing
- **Loops** — Developer-focused email tool with comparable off-white background, violet/indigo action color, and uppercase mono labels with wide tracking
- **Cal.com** — Warm off-white surfaces, 1px stone-toned borders, and a single saturated accent reserved for the primary button
- **Plausible Analytics** — Restrained warm-neutral palette, no decorative imagery, large centered serif-feeling headlines paired with compact sans body

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-warm-bone: #fafaf9;
  --color-paper-white: #ffffff;
  --color-stone-mist: #e7e5e4;
  --color-bark-grey: #79716b;
  --color-charcoal: #292524;
  --color-obsidian: #0c0a09;
  --color-pebble: #a6a09b;
  --color-electric-indigo: #615fff;
  --color-deep-violet: #4f39f6;
  --color-terracotta: #d97757;
  --color-lichen-green: #5ea500;
  --color-tide-teal: #22b8cd;
  --color-alarm-red: #ff0000;
  --color-sapphire-link: #007ebb;

  /* Typography — Font Families */
  --font-geist: 'Geist', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-cooper-ltbt: 'Cooper LtBT', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-geist-mono: 'Geist Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-datatype: 'dataType', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-ui-sans-serif: 'ui-sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.33;
  --tracking-caption: 0.48px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.43;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-subheading: 18px;
  --leading-subheading: 1.56;
  --text-heading-sm: 20px;
  --leading-heading-sm: 1.38;
  --text-heading: 40px;
  --leading-heading: 1.2;
  --text-display: 80px;
  --leading-display: 1.1;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;

  /* Spacing */
  --spacing-unit: 8px;
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-120: 120px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 24px;
  --element-gap: 16px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;

  /* Named Radii */
  --radius-tags: 8px;
  --radius-cards: 16px;
  --radius-links: 8px;
  --radius-pills: 9999px;
  --radius-inputs: 12px;
  --radius-buttons: 8px;

  /* Shadows */
  --shadow-xl: rgba(0, 0, 0, 0.1) 0px 20px 25px -5px, rgba(0, 0, 0, 0.1) 0px 8px 10px -6px;

  /* Surfaces */
  --surface-warm-bone-canvas: #fafaf9;
  --surface-paper-white-card: #ffffff;
  --surface-stone-mist-border: #e7e5e4;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-warm-bone: #fafaf9;
  --color-paper-white: #ffffff;
  --color-stone-mist: #e7e5e4;
  --color-bark-grey: #79716b;
  --color-charcoal: #292524;
  --color-obsidian: #0c0a09;
  --color-pebble: #a6a09b;
  --color-electric-indigo: #615fff;
  --color-deep-violet: #4f39f6;
  --color-terracotta: #d97757;
  --color-lichen-green: #5ea500;
  --color-tide-teal: #22b8cd;
  --color-alarm-red: #ff0000;
  --color-sapphire-link: #007ebb;

  /* Typography */
  --font-geist: 'Geist', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-cooper-ltbt: 'Cooper LtBT', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-geist-mono: 'Geist Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-datatype: 'dataType', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-ui-sans-serif: 'ui-sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.33;
  --tracking-caption: 0.48px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.43;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-subheading: 18px;
  --leading-subheading: 1.56;
  --text-heading-sm: 20px;
  --leading-heading-sm: 1.38;
  --text-heading: 40px;
  --leading-heading: 1.2;
  --text-display: 80px;
  --leading-display: 1.1;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-120: 120px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;

  /* Shadows */
  --shadow-xl: rgba(0, 0, 0, 0.1) 0px 20px 25px -5px, rgba(0, 0, 0, 0.1) 0px 8px 10px -6px;
}
```
