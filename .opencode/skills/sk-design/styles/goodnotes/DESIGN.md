# Goodnotes — Style Reference
> Paper-white command canvas — a blank notebook page where every tool snap into place without decoration.

**Theme:** light

Goodnotes runs on a white canvas with near-zero visual noise: almost no shadow, no gradient, and a deliberately spare chromatic palette. The one saturated color — a cyan/aqua (#57d2ee) — appears exclusively on the primary CTA button, making action feel switched-on against an otherwise monochrome field. Typography is done entirely in Roobert, a custom rounded geometric sans, with pronounced negative tracking at display sizes (−0.05em) that pulls large headlines tight. Product UI screenshots carry the visual weight; the surrounding page chrome stays flat, text-forward, and densely typeset at small sizes. Borders rather than shadows define surfaces, and the single 10px radius applies universally to buttons, cards, and UI chrome.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Pure Canvas | `#ffffff` | `--color-pure-canvas` | Page background, card backgrounds, button text on cyan CTA |
| Midnight Ink | `#000000` | `--color-midnight-ink` | Primary headlines, body text, borders on UI chrome |
| Deep Charcoal | `#1e1e1e` | `--color-deep-charcoal` | Ghost button text and borders, secondary headings, icon strokes |
| Graphite | `#111213` | `--color-graphite` | Dark nav backgrounds, dark section surfaces, link text in dark contexts |
| Slate | `#565656` | `--color-slate` | Body copy on cards, secondary descriptive text |
| Fog | `#888889` | `--color-fog` | Muted helper text, captions, de-emphasised labels |
| Ash | `#666666` | `--color-ash` | Tertiary text, subtle UI labels |
| Steel | `#333333` | `--color-steel` | Badge text, mid-weight secondary content |
| Border Medium | `#e8e8e8` | `--color-border-medium` | Tab underlines, nav separators, light hairline dividers |
| Border Soft | `#bebebe` | `--color-border-soft` | Card outlines, modal borders, container edges |
| Aqua Spark | `#57d2ee` | `--color-aqua-spark` | Blue action color for filled buttons, selected navigation states, and focused conversion moments. |
| Teal Deep | `#45bfdb` | `--color-teal-deep` | Brand surface wash, teal background sections |
| Cyan Mist | `#bcedf8` | `--color-cyan-mist` | Outlined button borders, soft teal ring accents |
| Cyan Text | `#6dd9f2` | `--color-cyan-text` | Blue outline accent for tags, dividers, and focused UI edges. |
| Sky Link | `#0299e0` | `--color-sky-link` | Hyperlinks and underline accents in body copy |
| Highlighter Yellow | `#f2e6b3` | `--color-highlighter-yellow` | Text highlight wash — mimics physical highlighter pen on note-taking UI screenshots |

## Tokens — Typography

### Roobert — Single-font system — every piece of UI copy, from 10px captions to 48px hero headlines, is Roobert. The rounded geometric forms mirror the tablet/handwriting brand; weight 700 at 48px with −0.05em tracking creates dense, close-set display text that reads like a confident pencil stroke rather than a digital shout. · `--font-roobert`
- **Substitute:** Plus Jakarta Sans, DM Sans
- **Weights:** 400, 500, 600, 700
- **Sizes:** 10px, 14px, 15px, 16px, 18px, 20px, 22px, 24px, 40px, 48px
- **Line height:** 1.00–1.60 (1.00 at 48px display, 1.40 at body sizes, 1.60 at small captions)
- **Letter spacing:** -0.05em at 48px, -0.042em at 40px, -0.02em at 24px, -0.016em at 20-22px; body and small sizes track at normal
- **OpenType features:** `normal`
- **Role:** Single-font system — every piece of UI copy, from 10px captions to 48px hero headlines, is Roobert. The rounded geometric forms mirror the tablet/handwriting brand; weight 700 at 48px with −0.05em tracking creates dense, close-set display text that reads like a confident pencil stroke rather than a digital shout.

### Font Awesome 6 Brands — Social/brand icon glyph set used in badges and footer; monochromatic, no resizing · `--font-font-awesome-6-brands`
- **Substitute:** Simple Icons (SVG)
- **Weights:** 400
- **Sizes:** 15px
- **Line height:** 1.00
- **Role:** Social/brand icon glyph set used in badges and footer; monochromatic, no resizing

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 10px | 1.6 | — | `--text-caption` |
| body-sm | 14px | 1.43 | — | `--text-body-sm` |
| body | 16px | 1.4 | — | `--text-body` |
| subheading | 18px | 1.38 | — | `--text-subheading` |
| heading-sm | 22px | 1.25 | -0.35px | `--text-heading-sm` |
| heading | 24px | 1.2 | -0.48px | `--text-heading` |
| heading-lg | 40px | 1.11 | -1.68px | `--text-heading-lg` |
| display | 48px | 1 | -2.4px | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** comfortable

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
| 32 | 32px | `--spacing-32` |
| 40 | 40px | `--spacing-40` |
| 60 | 60px | `--spacing-60` |
| 64 | 64px | `--spacing-64` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 10px |
| cards | 10px |
| links | 4px |
| inputs | 10px |
| buttons | 10px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 24px
- **Element gap:** 24px

## Components

### Primary CTA Button (Aqua Fill)
**Role:** Main conversion action — "Start Free"

Background #57d2ee, text #111213 (near-black for contrast), border-radius 10px, padding 8px 16px, font Roobert 500 15–16px. No shadow. The only filled chromatic button on the page — its cyan immediately locates the action in an otherwise monochrome layout.

### Ghost Navigation Button
**Role:** Dropdown triggers in top navigation (Product, Built For, Resources)

Background transparent, text #1e1e1, border 1px solid #1e1e1, border-radius 10px, padding 10px 12px, Roobert 400 14–15px. Restrained — reads as secondary control beside the cyan CTA.

### Teal Tinted Feature Button
**Role:** Tab or section-switch controls within feature sections

Background rgba(87,210,238,0.1), border 1px solid rgba(87,210,222,0.4), text #222222, border-radius 0px, padding 20px 30px, Roobert 500 16px. Flat-radius tabs that span full section width; the low-opacity cyan fill ties them to brand without competing with the CTA.

### White Content Card
**Role:** Feature and benefit cards in grid sections

Background #ffffff, border 0.5px solid #bebebe, border-radius 10px, padding 24px on all sides, no box-shadow. Body text #565656 at 16px/1.4. Headline #000000 at 20–24px weight 600.

### Tab Navigation Strip
**Role:** In-page content switcher (Whiteboard / PDF Annotation / Documents / Notebooks)

Tabs share a horizontal strip with #e8e8e8 bottom border. Active tab has #000000 2px underline and text #000000 weight 600. Inactive tabs #666666, weight 400. Border-radius 0px on the strip; individual tab padding 10px 20px.

### Product UI Screenshot Card
**Role:** Product showcase: embedded screenshot of the Goodnotes app interface

Contained within a white card (border-radius 10px, border 1px solid #bebebe) or floating on white background. Screenshot edges are rounded at 10px when shown as a card inset. No shadow added by the page — the screenshot provides its own visual depth.

### Logo Marquee Strip
**Role:** Social-proof partner/customer logos in horizontal scrolling ticker

White background, no border, logos in #000000 or neutral grayscale. Animated with marquee-scroll (28s linear infinite). Padding 20px 0. Logos separated by consistent 40px+ column gap. No card wrapping — logos float directly on white.

### Highlighter Text Accent
**Role:** Inline emphasis within body copy, mimicking physical highlighter pen

Inline span with background #f2e6b3 applied as link/span backgroundColor. No border-radius (0px). Used to visually connect to the note-taking metaphor inside product screenshots and marketing copy alike.

### "Learn More" Text Link
**Role:** Secondary navigation within feature sections

Text #6dd9f2 on teal-background sections, #0299e0 on white sections, Roobert 500 14–16px. Includes "→" arrow. No underline by default; border-radius 4px on focus ring.

### Section Heading Block
**Role:** Top of each page section — centered or left-aligned headline + subtext

Heading: Roobert 700, 40–48px, #000000, letter-spacing −0.042 to −0.05em, line-height 1.0–1.11. Subheading: Roobert 400, 18px, #565656 or #666666, line-height 1.4. Vertical gap between heading and subheading: 16–24px.

## Do's and Don'ts

### Do
- Use #57d2ee exclusively for the primary filled CTA button — no other UI element should share this fill color, keeping it as the sole chromatic action signal.
- Apply Roobert at weight 700 with letter-spacing −0.05em (−2.4px) for all 48px display headlines; tighten tracking proportionally down the scale to −0.016em at 20–22px.
- Define card and container edges with 0.5–1px solid #bebebe or #e8e8e8 borders — never use box-shadow for surface elevation.
- Use 10px border-radius universally across buttons, cards, inputs, and UI chrome; reserve 4px only for focus/link rings.
- Keep body copy at #565656 or #666666 on white cards — reserve #000000 for headings and primary labels only.
- Use #f2e6b3 as an inline background highlight on emphasized text spans — apply it flat (no radius) to mirror a physical highlighter stroke.
- Separate section content with 80px vertical gaps on desktop; use 24px element gap within card grids and between grouped UI elements.

### Don't
- Never add box-shadow to cards, modals, or buttons — all surface separation must come from borders, not elevation.
- Never use a second chromatic fill color for buttons; ghost (#1e1e1 border) and tinted-teal (rgba(87,210,238,0.1)) variants must stay visually subordinate to the cyan CTA.
- Never set headline letter-spacing to 0 or positive values at sizes above 24px — the negative tracking is the signature of the display voice.
- Never substitute a different typeface for Roobert; if the custom font fails to load, fall back to Plus Jakarta Sans or DM Sans — not Inter or system-ui.
- Never use #0299e0 (Sky Link) as a button fill or a section color — it is reserved for inline hyperlinks and "Learn more" text in white-background contexts only.
- Never apply the teal tinted button (rgba(87,210,238,0.1)) with a border-radius — it is a 0px radius tab control, not a pill or rounded button.
- Never center-align body copy paragraphs beyond 600px width — long centered text breaks readability; left-align body text in two-column feature sections.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Page Canvas | `#ffffff` | Default page background; all sections begin here |
| 2 | Card Surface | `#ffffff` | Elevated cards defined by #bebebe or #e8e8e8 border (0.5–1px solid), not shadow |
| 3 | Warm Off-White | `#f6f5ee` | Alternate section background per CSS token --_color---background-warm; used for warm-tinted feature bands |
| 4 | Dark Shell | `#111213` | Dark nav bar, dark footer sections, full-bleed dark feature blocks |
| 5 | Teal Wash | `#45bfdb` | Brand-colored surface for feature callouts and highlighted section bands |

## Elevation

Goodnotes uses zero box-shadow throughout. Elevation is expressed purely through borders: cards sit on white with a 0.5–1px solid #bebebe or #e8e8e8 outline. This makes the UI feel like paper stacked on paper — no depth illusion, just crisp-edged layering consistent with the notebook metaphor.

## Imagery

Goodnotes uses contained product UI screenshots as the primary visual device — no lifestyle photography, no abstract illustration. Screenshots are shown as overlapping layered document stacks (strategic expansion proposal v1/v2/v3 effect) or as a single dominant app view inside a rounded-card frame. On the handwriting section, a tablet-canvas screenshot with actual hand-drawn strokes, arrows, and annotations appears at roughly 40% of the section width. Illustration is absent; all visual complexity is offloaded to the real product UI. Icons (toolbar actions) are filled, compact, and monochromatic at 15–20px — no outlined or multicolor icon style. Partner/customer logos in the marquee strip are black-on-white, unglamoured. The overall density is image-moderate: one large product screenshot per section, surrounded by generous white space, with text doing explanatory work rather than decorative imagery.

## Layout

Max-width 1200px centered on a white canvas. The hero is a centered-headline layout: large Roobert 700 headline, one sentence of subtext, and a single cyan CTA button, with a tabbed product screenshot panel directly below spanning ~70% of content width. Below the hero, a horizontal logo marquee runs full-bleed with a subtle overflow mask. Feature sections follow a 2-column text-left / product-right alternating pattern at desktop widths, switching to centered stacks at mobile. The "Built for any kind of work" and AI sections use full-width tab controls (0px radius) as in-section navigation, with content panels that swap beneath them. Sections are separated by 80px vertical gaps with no visual dividers — white space is the only separator. A 3-column card grid appears in the tools/features section. Navigation is a sticky top bar with logo left, nav links center-right, and the cyan CTA pinned to the far right.

## Agent Prompt Guide

**Quick Color Reference**
- text (primary): #000000
- text (secondary): #565656
- background: #ffffff
- border: #bebebe (cards), #e8e8e8 (dividers/tabs)
- accent / brand: #57d2ee
- primary action: #57d2ee (filled action)

**Example Component Prompts**

1. Create a Primary Action Button: #57d2ee background, #000000 text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.

2. **White Feature Card**: Background #ffffff, border 1px solid #bebebe, border-radius 10px, padding 24px. Card title: Roobert 600, 22px, #000000, letter-spacing −0.35px. Body: Roobert 400, 16px, #565656, line-height 1.4. "Learn more →" link: #0299e0, Roobert 500, 14px.

3. **Tab Navigation Strip**: Full-width strip, border-bottom 1px solid #e8e8e8, no radius. Active tab: Roobert 600, 16px, #000000, border-bottom 2px solid #000000, padding 10px 20px. Inactive: Roobert 400, 16px, #666666, padding 10px 20px.

4. **Ghost Nav Button**: Background transparent, text #1e1e1e, border 1px solid #1e1e1e, border-radius 10px, padding 10px 12px, Roobert 400, 15px. Used for dropdown triggers — no fill, no shadow.

5. **Section Heading Block**: Roobert 700, 40px, #000000, letter-spacing −1.68px, line-height 1.11, centered. Below it: Roobert 400, 18px, #666666, line-height 1.4, centered, max-width 560px. Vertical gap between heading and subtext: 16px.

## Similar Brands

- **Notion** — Same white-canvas minimal page, black headline typography, monochrome palette with a single saturated accent on the primary CTA
- **Craft Docs** — Shared note-taking UI-screenshot-as-hero approach, light flat card surfaces defined by border not shadow, Roobert-adjacent rounded sans type
- **Miro** — Tablet/whiteboard product showcase with teal/cyan brand accent against white background, tab-based in-page navigation for feature sections
- **Loom** — Single-font rounded sans system, cyan/aqua CTA against predominantly neutral page, product screenshots doing visual heavy lifting
- **Linear** — No-shadow border-only card elevation philosophy, tight negative-tracked display headlines, minimalist action hierarchy with one standout CTA color

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-pure-canvas: #ffffff;
  --color-midnight-ink: #000000;
  --color-deep-charcoal: #1e1e1e;
  --color-graphite: #111213;
  --color-slate: #565656;
  --color-fog: #888889;
  --color-ash: #666666;
  --color-steel: #333333;
  --color-border-medium: #e8e8e8;
  --color-border-soft: #bebebe;
  --color-aqua-spark: #57d2ee;
  --color-teal-deep: #45bfdb;
  --color-cyan-mist: #bcedf8;
  --color-cyan-text: #6dd9f2;
  --color-sky-link: #0299e0;
  --color-highlighter-yellow: #f2e6b3;

  /* Typography — Font Families */
  --font-roobert: 'Roobert', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-font-awesome-6-brands: 'Font Awesome 6 Brands', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.6;
  --text-body-sm: 14px;
  --leading-body-sm: 1.43;
  --text-body: 16px;
  --leading-body: 1.4;
  --text-subheading: 18px;
  --leading-subheading: 1.38;
  --text-heading-sm: 22px;
  --leading-heading-sm: 1.25;
  --tracking-heading-sm: -0.35px;
  --text-heading: 24px;
  --leading-heading: 1.2;
  --tracking-heading: -0.48px;
  --text-heading-lg: 40px;
  --leading-heading-lg: 1.11;
  --tracking-heading-lg: -1.68px;
  --text-display: 48px;
  --leading-display: 1;
  --tracking-display: -2.4px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-28: 28px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-60: 60px;
  --spacing-64: 64px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 24px;
  --element-gap: 24px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 10px;

  /* Named Radii */
  --radius-tags: 10px;
  --radius-cards: 10px;
  --radius-links: 4px;
  --radius-inputs: 10px;
  --radius-buttons: 10px;

  /* Surfaces */
  --surface-page-canvas: #ffffff;
  --surface-card-surface: #ffffff;
  --surface-warm-off-white: #f6f5ee;
  --surface-dark-shell: #111213;
  --surface-teal-wash: #45bfdb;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-pure-canvas: #ffffff;
  --color-midnight-ink: #000000;
  --color-deep-charcoal: #1e1e1e;
  --color-graphite: #111213;
  --color-slate: #565656;
  --color-fog: #888889;
  --color-ash: #666666;
  --color-steel: #333333;
  --color-border-medium: #e8e8e8;
  --color-border-soft: #bebebe;
  --color-aqua-spark: #57d2ee;
  --color-teal-deep: #45bfdb;
  --color-cyan-mist: #bcedf8;
  --color-cyan-text: #6dd9f2;
  --color-sky-link: #0299e0;
  --color-highlighter-yellow: #f2e6b3;

  /* Typography */
  --font-roobert: 'Roobert', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-font-awesome-6-brands: 'Font Awesome 6 Brands', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.6;
  --text-body-sm: 14px;
  --leading-body-sm: 1.43;
  --text-body: 16px;
  --leading-body: 1.4;
  --text-subheading: 18px;
  --leading-subheading: 1.38;
  --text-heading-sm: 22px;
  --leading-heading-sm: 1.25;
  --tracking-heading-sm: -0.35px;
  --text-heading: 24px;
  --leading-heading: 1.2;
  --tracking-heading: -0.48px;
  --text-heading-lg: 40px;
  --leading-heading-lg: 1.11;
  --tracking-heading-lg: -1.68px;
  --text-display: 48px;
  --leading-display: 1;
  --tracking-display: -2.4px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-28: 28px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-60: 60px;
  --spacing-64: 64px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 10px;
}
```
