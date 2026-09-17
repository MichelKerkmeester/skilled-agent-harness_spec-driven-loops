# Ease Health — Style Reference
> Botanical greenhouse on cream paper

**Theme:** light

Ease Health uses a clinical-botanical language: a warm cream canvas layered with soft sage, keylime, and slate-blue panels that feel like a greenhouse rendered on paper. Typography carries the entire personality — weight 300 serif headlines (Faire Octave) paired against a humanist sans (Suisse Intl) create a hushed, editorial authority unusual for healthtech. A single deep forest green (#0f3e17) anchors every action and heading, reading like ink on watercolor. Surfaces are flat and shadowless; depth comes from layered tinted panels and generous padding, not elevation. Components are rounded (~14px) and pill-shaped for tags, keeping the whole system soft and approachable without losing clinical seriousness.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Forest Ink | `#0f3e17` | `--color-forest-ink` | Primary action buttons, headings, links, icon strokes — deep botanical green reads as ink, the only saturated dark in the system |
| Sage Mist | `#b1dbb8` | `--color-sage-mist` | Mid-tone card backgrounds and decorative washes, panel-level surfaces |
| Keylime Wash | `#e1f4df` | `--color-keylime-wash` | Hero panel background, light card surfaces — the dominant tinted canvas tone |
| Mint Veil | `#cfe7d3` | `--color-mint-veil` | Accent card surfaces, soft section dividers between sage and keylime layers |
| Slate Hush | `#b6ced5` | `--color-slate-hush` | Cool counter-balance panel for product preview and feature blocks — breaks the green monotony with desaturated blue-gray |
| Cream Paper | `#fffefc` | `--color-cream-paper` | Page background, badge backgrounds, button text — warm off-white that softens every green |
| Charcoal | `#222222` | `--color-charcoal` | Navigation text and minor UI strokes — restrained secondary ink |
| Border Mist | `#efeeeb` | `--color-border-mist` | Hairline dividers and subtle borders throughout the layout |
| Forest Shadow | `#0c2f10` | `--color-forest-shadow` | Supporting palette color for small decorative accents when the core palette needs contrast. Do not promote it to the primary CTA color |

## Tokens — Typography

### Faire Octave — Display serif for all section headings and hero copy · `--font-faire-octave`
- **Substitute:** Cormorant Garamond, Playfair Display
- **Weights:** 300
- **Sizes:** 40px, 56px, 74px
- **Line height:** 1.05–1.35
- **Letter spacing:** -0.01em at 40px, -0.03em at 56–74px
- **Role:** Display serif for all section headings and hero copy

### Suisse Intl — Body, navigation, UI labels, buttons, captions — humanist sans at whisper weight for feature lists and normal weight for copy · `--font-suisse-intl`
- **Substitute:** Inter, Söhne, Helvetica Neue
- **Weights:** 300, 400, 600
- **Sizes:** 10px, 11px, 12px, 14px, 18px, 23px, 28px, 56px
- **Line height:** 1.00–1.61
- **Letter spacing:** 0.08em uppercase at 11px/600 (eyebrow labels); natural tracking otherwise
- **Role:** Body, navigation, UI labels, buttons, captions — humanist sans at whisper weight for feature lists and normal weight for copy

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 10px | 1.61 | — | `--text-caption` |
| body | 14px | 1.5 | — | `--text-body` |
| subheading | 18px | 1.3 | — | `--text-subheading` |
| heading-sm | 23px | 1.5 | — | `--text-heading-sm` |
| heading | 40px | 1.35 | -0.4px | `--text-heading` |
| heading-lg | 56px | 1.2 | -1.68px | `--text-heading-lg` |
| display | 74px | 1.05 | -2.22px | `--text-display` |

## Tokens — Spacing & Shapes

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 7 | 7px | `--spacing-7` |
| 9 | 9px | `--spacing-9` |
| 11 | 11px | `--spacing-11` |
| 14 | 14px | `--spacing-14` |
| 18 | 18px | `--spacing-18` |
| 21 | 21px | `--spacing-21` |
| 28 | 28px | `--spacing-28` |
| 35 | 35px | `--spacing-35` |
| 42 | 42px | `--spacing-42` |
| 49 | 49px | `--spacing-49` |
| 56 | 56px | `--spacing-56` |
| 70 | 70px | `--spacing-70` |
| 76 | 76px | `--spacing-76` |
| 99 | 99px | `--spacing-99` |
| 156 | 156px | `--spacing-156` |

### Border Radius

| Element | Value |
|---------|-------|
| nav | 7px |
| cards | 14px |
| badges | 999px |
| buttons | 14px |
| sections | 9999px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 64-96px
- **Card padding:** 28-42px
- **Element gap:** 14-21px

## Components

### Primary Forest Button
**Role:** Filled CTA for demos, explores, and form submits

Background #0f3e17, text #fffefc, 14px border-radius, padding 14px 21px, Suisse Intl 14px/400. Arrow icon in white at trailing edge. Hover transitions to #0c2f10.

### Large Forest Button
**Role:** Hero-scale CTA with generous breathing room

Same Forest Ink fill and white text, but padding scales to 42px all sides for hero placement. Rounded 14px corners. Used sparingly for maximum-weight calls to action.

### Pill Badge / Tag
**Role:** Category labels, CRM/EHR/RCM module tags, status indicators

Background #fffefc, text Forest Ink #0f3e17, 999px border-radius (full pill), padding 9px 14px, Suisse Intl 14px/400. Inverted cream-on-green relationship makes tags feel like paper labels.

### Sage Feature Card
**Role:** Heavier-tinted content panel for feature highlights

Background Sage Mist #b1dbb8, 14px border-radius, 42px padding all sides, no shadow. Hosts illustration or product preview content. Flat surface — depth comes from color not elevation.

### Keylime Soft Card
**Role:** Light-tinted content panel for secondary features

Background Keylime Wash #e1f4df, 14px border-radius, 28px padding, no shadow. Tighter padding than sage variant for compact content blocks.

### Slate Product Panel
**Role:** Cool-toned container for product UI screenshots and demos

Background Slate Hush #b6ced5, 14px border-radius, 42px padding, no shadow. Provides cool visual counterpoint to warm green panels — the only non-green tinted surface.

### Product Preview Card (Inner)
**Role:** White floating card within Slate Product Panel

Background Cream Paper #fffefc, 14px border-radius, 28px padding, no border or shadow. Represents a product screen mockup (CRM, EHR, RCM). Sits on the Slate panel like a printed screenshot.

### Navigation Bar
**Role:** Top-level site navigation

Transparent over cream canvas, text Charcoal #222222, Suisse Intl 14px/400, 7px radius on interactive items. 'Book a Demo' CTA pill on the right uses Forest Ink fill.

### Eyebrow Label
**Role:** Section category tag above headings

Suisse Intl 11px/600, letter-spacing 0.08em, uppercase, Forest Ink color. Tiny typographic marker that labels each section's theme (e.g. 'QUICK ANSWER').

### FAQ Row
**Role:** Two-column question/answer layout

Left column: Faire Octave 40px/300 in Forest Ink for question. Right column: Suisse Intl 14px/400 in Charcoal for answer. 1px Border Mist divider between rows.

### Investor Logo Strip
**Role:** Social proof row of VC logos

Single horizontal row, monochrome treatment in Charcoal #222222 on cream canvas, generous vertical padding (42px+). No decorative borders — relies on whitespace for rhythm.

## Do's and Don'ts

### Do
- Use Forest Ink (#0f3e17) for every CTA, heading, and primary link — it is the only saturated dark and must remain singular
- Set all display headings in Faire Octave weight 300 with tight tracking (-0.03em at 56–74px) — never bold the serif
- Pair serif questions with sans-serif answers in FAQ and feature blocks to create typographic contrast
- Layer surfaces using cream → keylime → mint → sage → slate in order to create depth without shadows
- Use 14px border-radius on all cards and buttons, 999px on all badges and tags — consistency is non-negotiable
- Apply 0.08em letter-spacing with uppercase and 600 weight for eyebrow labels only — nowhere else
- Keep the Slate Hush panel as the exclusive home for product screenshots — it provides the cool counterbalance to warm green panels

### Don't
- Never add box-shadow to cards — the system communicates elevation through tinted layers only
- Don't use Forest Ink as a background tint — it is too dark for surface washes; reserve for text and action fills only
- Avoid mixing multiple heading weights — everything is weight 300 in Faire Octave; bold would break the hushed editorial tone
- Don't place colored borders on cards — depth comes from fill contrast, not strokes
- Never use more than one serif at a time — Faire Octave owns display, Suisse Intl owns everything else
- Don't introduce new accent hues — the palette is strictly botanical greens + slate; any other color breaks the greenhouse metaphor
- Avoid tight padding under 21px on cards — generous 28–42px padding is essential to the soft, breathing-room aesthetic
- Don't use the sage or keylime tones for text — they are surface colors only and fail contrast for copy

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Cream Paper | `#fffefc` | Base page background — warm off-white dominates the canvas |
| 1 | Keylime Wash | `#e1f4df` | Primary tinted panel — hero left column, light feature blocks |
| 2 | Mint Veil | `#cfe7d3` | Mid-tone section surface between keylime and sage |
| 3 | Sage Mist | `#b1dbb8` | Heavier tinted panels — hero accents, feature highlights |
| 4 | Slate Hush | `#b6ced5` | Cool counter-panel for product showcases and visual contrast |

## Elevation

The system deliberately avoids shadows entirely — boxShadow=none on all card variants. Depth and hierarchy are communicated through layered tinted surfaces (cream → keylime → sage → slate) rather than elevation. This keeps the interface feeling like watercolor paper rather than glassmorphic UI, matching the botanical-greenhouse metaphor.

## Imagery

Imagery is product-first and UI-native: floating product screenshots (CRM cards, EHR patient views, RCM revenue graphs) rendered as crisp white cards on Slate Hush panels. No lifestyle photography, no stock imagery. Iconography is minimal stroke-based, rendered in Forest Ink. Illustrations, where present, use the same sage/keylime palette to stay on-system. The visual density is text-dominant with product mockups serving as proof, not decoration.

## Layout

Max-width 1200px centered container with 64–96px vertical section gaps. Hero is a two-column split: left panel tinted Keylime Wash with serif headline + body + CTA; right panel tinted Slate Hush housing three product preview cards (CRM, EHR, RCM) in a row. Below the hero, sections alternate between cream canvas and tinted panels in a botanical rhythm. FAQ uses a two-column text grid (serif question left, sans answer right). The investor logo strip is a single full-width row on cream. Navigation is minimal — left-aligned logo, centered text links, right-aligned CTA pill — no sticky behavior or mega-menu. The overall page rhythm is generous and editorial rather than dense.

## Agent Prompt Guide

**Quick Color Reference**
- Text/Heading: #0f3e17 (Forest Ink)
- Page background: #fffefc (Cream Paper)
- Hero/light panel: #e1f4df (Keylime Wash)
- Feature panel: #b1dbb8 (Sage Mist)
- Product showcase panel: #b6ced5 (Slate Hush)
- Border: #efeeeb
- primary action: #0f3e17 (filled action)

**Example Component Prompts**
1. Create a Primary Action Button: #0f3e17 background, #fffefc text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.

2. **Feature card**: Sage Mist #b1dbb8 background, 14px border-radius, 42px padding all sides, no shadow. Eyebrow label in Suisse Intl 11px/600 uppercase with 0.08em tracking, Forest Ink color. Heading in Faire Octave 40px/300, Forest Ink. Body in Suisse Intl 14px/400, Charcoal #222222.

3. **Pill badge**: Background Cream Paper #fffefc, text Forest Ink #0f3e17, 999px border-radius, padding 9px 14px, Suisse Intl 14px/400. Place above section headings as a category tag.

4. **FAQ row**: Two-column grid. Left: Faire Octave 40px/300 question in Forest Ink. Right: Suisse Intl 14px/400 answer in Charcoal #222222. Separator: 1px solid Border Mist #efeeeb below each row.


## Type Pairing Philosophy

The serif/sans split is the system's defining typographic move. Faire Octave (or Cormorant Garamond as substitute) handles ALL headings at weight 300 — never bold. Suisse Intl (or Inter) handles ALL UI and body text. The whisper-weight serif creates editorial calm unusual in healthtech, where most competitors use bold geometric sans headlines. Tracking tightens as size grows: -0.01em at 40px, -0.03em at 56–74px. Body text uses natural tracking. The only uppercase treatment is 11px/600 eyebrows at 0.08em — these are navigational markers, not decorative caps.

## Similar Brands

- **Headspace** — Same botanical palette approach with sage greens and soft tinted panels, plus serif-leaning editorial calm and generous breathing room
- **Calm** — Nature-inspired muted greens against cream, generous whitespace, flat surfaces without shadows, and a serene clinical-adjacent tone
- **Mercury** — Deep single-color ink (#0f3e17 forest vs Mercury's near-black) against a warm off-white canvas with editorial serif display type at weight 300
- **Spring Health** — Behavioral health branding with green-dominant palette, soft panel layering, and humanist sans body type paired with serif accents
- **Grow Therapy** — Healthcare SaaS using sage and mint greens against cream, with rounded components and a botanical rather than clinical visual mood

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-forest-ink: #0f3e17;
  --color-sage-mist: #b1dbb8;
  --color-keylime-wash: #e1f4df;
  --color-mint-veil: #cfe7d3;
  --color-slate-hush: #b6ced5;
  --color-cream-paper: #fffefc;
  --color-charcoal: #222222;
  --color-border-mist: #efeeeb;
  --color-forest-shadow: #0c2f10;

  /* Typography — Font Families */
  --font-faire-octave: 'Faire Octave', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-suisse-intl: 'Suisse Intl', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.61;
  --text-body: 14px;
  --leading-body: 1.5;
  --text-subheading: 18px;
  --leading-subheading: 1.3;
  --text-heading-sm: 23px;
  --leading-heading-sm: 1.5;
  --text-heading: 40px;
  --leading-heading: 1.35;
  --tracking-heading: -0.4px;
  --text-heading-lg: 56px;
  --leading-heading-lg: 1.2;
  --tracking-heading-lg: -1.68px;
  --text-display: 74px;
  --leading-display: 1.05;
  --tracking-display: -2.22px;

  /* Typography — Weights */
  --font-weight-light: 300;
  --font-weight-regular: 400;
  --font-weight-semibold: 600;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-7: 7px;
  --spacing-9: 9px;
  --spacing-11: 11px;
  --spacing-14: 14px;
  --spacing-18: 18px;
  --spacing-21: 21px;
  --spacing-28: 28px;
  --spacing-35: 35px;
  --spacing-42: 42px;
  --spacing-49: 49px;
  --spacing-56: 56px;
  --spacing-70: 70px;
  --spacing-76: 76px;
  --spacing-99: 99px;
  --spacing-156: 156px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 64-96px;
  --card-padding: 28-42px;
  --element-gap: 14-21px;

  /* Border Radius */
  --radius-lg: 7.04px;
  --radius-xl: 14.08px;
  --radius-full: 999px;
  --radius-full-2: 9999px;

  /* Named Radii */
  --radius-nav: 7px;
  --radius-cards: 14px;
  --radius-badges: 999px;
  --radius-buttons: 14px;
  --radius-sections: 9999px;

  /* Surfaces */
  --surface-cream-paper: #fffefc;
  --surface-keylime-wash: #e1f4df;
  --surface-mint-veil: #cfe7d3;
  --surface-sage-mist: #b1dbb8;
  --surface-slate-hush: #b6ced5;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-forest-ink: #0f3e17;
  --color-sage-mist: #b1dbb8;
  --color-keylime-wash: #e1f4df;
  --color-mint-veil: #cfe7d3;
  --color-slate-hush: #b6ced5;
  --color-cream-paper: #fffefc;
  --color-charcoal: #222222;
  --color-border-mist: #efeeeb;
  --color-forest-shadow: #0c2f10;

  /* Typography */
  --font-faire-octave: 'Faire Octave', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-suisse-intl: 'Suisse Intl', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.61;
  --text-body: 14px;
  --leading-body: 1.5;
  --text-subheading: 18px;
  --leading-subheading: 1.3;
  --text-heading-sm: 23px;
  --leading-heading-sm: 1.5;
  --text-heading: 40px;
  --leading-heading: 1.35;
  --tracking-heading: -0.4px;
  --text-heading-lg: 56px;
  --leading-heading-lg: 1.2;
  --tracking-heading-lg: -1.68px;
  --text-display: 74px;
  --leading-display: 1.05;
  --tracking-display: -2.22px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-7: 7px;
  --spacing-9: 9px;
  --spacing-11: 11px;
  --spacing-14: 14px;
  --spacing-18: 18px;
  --spacing-21: 21px;
  --spacing-28: 28px;
  --spacing-35: 35px;
  --spacing-42: 42px;
  --spacing-49: 49px;
  --spacing-56: 56px;
  --spacing-70: 70px;
  --spacing-76: 76px;
  --spacing-99: 99px;
  --spacing-156: 156px;

  /* Border Radius */
  --radius-lg: 7.04px;
  --radius-xl: 14.08px;
  --radius-full: 999px;
  --radius-full-2: 9999px;
}
```
