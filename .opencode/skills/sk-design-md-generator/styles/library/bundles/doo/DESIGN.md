# Doo — Style Reference
> pastel sticky notes drifting on white linen

**Theme:** light

Doo reads as an empty notebook waiting to be filled: nearly all-white canvas, cool-gray hairline borders, charcoal type, and a single deep-indigo CTA acting as the page's only saturated punctuation. The visual system is deliberately monochrome on the surface while the product itself is colorful — colored category tags, pastel task cards, and a tri-color logo carry the warmth. Layout is centered, symmetrical, and Apple-like in its discipline: a single headline, one button, then product imagery doing all the visual work. Components are pill-shaped controls with generous radius, text-first hierarchy, and almost no decoration — no shadows, no gradients, no background tints behind content. The mood is calm, organized, and unhurried.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Indigo Pulse | `#3b3996` | `--color-indigo-pulse` | Supporting palette color for small decorative accents when the core palette needs contrast. Do not promote it to the primary CTA color |
| Slate | `#6e6d7a` | `--color-slate` | Hairline borders, dividers, secondary text, list separators — the structural gray that quietly defines the page grid |
| Graphite | `#383938` | `--color-graphite` | Navigation text, heading text, dark UI elements — the primary readable dark on white |
| Ink | `#111111` | `--color-ink` | Headline color, strongest body emphasis, near-black for maximum contrast on light surfaces |
| Paper | `#ffffff` | `--color-paper` | Page background, card surfaces, text on dark/indigo fills — the dominant canvas |
| Mist | `#edeef3` | `--color-mist` | Elevated panels, subtle background washes, light borders — the cool-tinted off-white that lifts content above the page |
| Cloud | `#f7f7f7` | `--color-cloud` | Secondary card surfaces, quiet content panels |
| Mint Whisper | `#c3f5dd` | `--color-mint-whisper` | Task category tag accent (product UI), logo green dot — pastel annotation, not interface chrome |
| Lavender Drift | `#d1cafa` | `--color-lavender-drift` | Task category tag accent (product UI), logo blue dot — pastel annotation |

## Tokens — Typography

### Avenir Next — Sole typeface across the entire system — nav, body, headings, display. Avenir Next's geometric humanism gives the page a calm, friendly, Apple-adjacent feel. Weight 400 carries everything; weight 600 is reserved for navigation and small emphases. Display headlines at 65px with negative tracking create a compressed, confident presence rather than shouting. · `--font-avenir-next`
- **Substitute:** Nunito Sans, Quicksand, or system-ui
- **Weights:** 400, 600
- **Sizes:** 13, 16, 17, 20, 29, 39, 65
- **Line height:** 1.0, 1.2, 1.8
- **Letter spacing:** -0.04em for display/headings (29px+), 0.1em for small caps/labels (13px)
- **Role:** Sole typeface across the entire system — nav, body, headings, display. Avenir Next's geometric humanism gives the page a calm, friendly, Apple-adjacent feel. Weight 400 carries everything; weight 600 is reserved for navigation and small emphases. Display headlines at 65px with negative tracking create a compressed, confident presence rather than shouting.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 13px | 1.2 | 1.3px | `--text-caption` |
| body-sm | 16px | 1.8 | — | `--text-body-sm` |
| subheading | 20px | 1.2 | — | `--text-subheading` |
| heading-sm | 29px | 1.2 | -1.16px | `--text-heading-sm` |
| heading | 39px | 1.2 | -1.56px | `--text-heading` |
| display | 65px | 1 | -2.6px | `--text-display` |

## Tokens — Spacing & Shapes

**Density:** spacious

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 5 | 5px | `--spacing-5` |
| 10 | 10px | `--spacing-10` |
| 13 | 13px | `--spacing-13` |
| 19 | 19px | `--spacing-19` |
| 20 | 20px | `--spacing-20` |
| 21 | 21px | `--spacing-21` |
| 26 | 26px | `--spacing-26` |
| 33 | 33px | `--spacing-33` |
| 39 | 39px | `--spacing-39` |
| 49 | 49px | `--spacing-49` |
| 78 | 78px | `--spacing-78` |
| 86 | 86px | `--spacing-86` |
| 90 | 90px | `--spacing-90` |
| 108 | 108px | `--spacing-108` |
| 130 | 130px | `--spacing-130` |
| 217 | 217px | `--spacing-217` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 20px |
| cards | 30px |
| buttons | 39px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 100-140px
- **Card padding:** 30px
- **Element gap:** 20-26px

## Components

### Primary CTA Button
**Role:** Single conversion action per screen

Pill-shaped (39px radius), filled with Indigo Pulse (#3b3996), white text in Avenir Next 600 at 16px. Horizontal padding 26px, vertical padding 13px. No shadow, no border. Width hugs content. The only colored filled element on the marketing page.

### Navigation Bar
**Role:** Top-level site navigation

Full-width, height ~50px, transparent over white background. Logo (tri-color dots) left-aligned, nav links right-aligned. Links in Graphite (#383938) at 13px Avenir Next 600, separated by 26-39px horizontal gaps. Active state uses bold/600 weight, no underline, no color change.

### Hero Section
**Role:** Above-the-fold value proposition

Centered single column, generous vertical padding (100-140px top/bottom). Display headline at 65px Avenir Next 400 in Ink (#111111), tracking -2.6px. Subhead at 20px in Slate (#6e6d7a). Single Primary CTA below with 33px margin-top. No background imagery above the fold.

### Product Showcase Frame
**Role:** Multi-device product display

Large product screenshot or device render, centered, near-full-bleed within the 1200px container. No frame chrome, no device bezels added. Sits on white with generous breathing room above and below.

### Task Card (Product UI)
**Role:** Individual task/reminder item within the app

White card, 30px radius, 20px internal padding. Left edge has a small colored category tag (16-20px wide, pill-shaped, in Mint Whisper, Lavender Drift, yellow, or brown). Task title in Avenir Next 400 at 17px Ink (#111111). Due date in 13px Slate (#6e6d7a). Optional trailing action icon in Indigo Pulse.

### Category Color Tag
**Role:** Task categorization indicator

Small pill or rounded square (20px radius) in a pastel color (Mint, Lavender, yellow, brown). Functions as a color-coded identifier on the left of task cards. Never used as a button or interactive element — purely decorative categorization.

### Press Logo Strip
**Role:** Social proof / press mentions

Three-column grid of publication logos (TNW, WIRED, BuzzFeed style) in black/Ink (#111111) on white, evenly spaced. Below each logo, a short pull-quote in 13-16px Slate (#6e6d7a) Avenir Next 400. Logos are monochrome, no color treatment.

### Feature Section
**Role:** Product capability showcase with large headline

Centered or single-column layout. Eyebrow label in 13px Avenir Next 600 with 0.1em tracking (small caps style) in Slate (#6e6d7a). Headline at 39px Avenir Next 400 in Ink. Supporting text at 17px in Slate. Large product UI screenshot below with 33px gap.

### Logo Mark
**Role:** Brand identity anchor

Three small overlapping circles, left-to-right: Mint Whisper (#c3f5dd), Lavender Drift (#d1cafa), and a mid-blue. Each circle ~12px diameter, slight overlap. Sits top-left of the page in the nav.

### Section Divider
**Role:** Visual separation between content blocks

Full-width hairline (1px) in Slate (#6e6d7a) at very low opacity, or generous whitespace alone. No decorative dividers, no gradient fades.

## Do's and Don'ts

### Do
- Use Indigo Pulse (#3b3996) for exactly one CTA per screen — it is the only saturated fill color on the marketing surface and loses power if overused
- Set all buttons and links to 39px border-radius for the pill shape; set all cards to 30px radius — these two radii are the system's only curves
- Use Avenir Next 400 for all display and body text; reserve weight 600 for nav items and small labels only
- Apply -0.04em letter-spacing to any text 29px and above; use 0.1em tracking on 13px labels for a small-caps eyebrow effect
- Achieve separation with whitespace and Slate (#6e6d7a) hairlines — never with drop shadows
- Keep the marketing surface monochrome; let the product UI's pastel category tags carry all color in screenshots
- Center-align hero and feature headlines; use max-width 1200px container for all content blocks

### Don't
- Don't introduce additional chromatic UI colors on the marketing page — Indigo Pulse is the only saturated fill permitted
- Don't use drop shadows, gradients, or glow effects — the design is deliberately flat and paper-like
- Don't use any border-radius value other than 30px (cards) or 39px (buttons/links/pills)
- Don't use weight 700 or 800 — Avenir Next caps at 600 in this system, and the whisper-weight 400 headlines are the signature
- Don't add background colors to content sections — the page stays Paper white; use Mist (#edeef3) only for specific elevated panels
- Don't use icons or decorative graphics on the marketing page — product photography and the tri-dot logo are the only visual elements
- Don't use tight column grids; the layout is centered and spacious, not information-dense

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Paper | `#ffffff` | Page background — dominant canvas |
| 1 | Cloud | `#f7f7f7` | Quiet card/panel surfaces, nearly invisible elevation |
| 2 | Mist | `#edeef3` | Elevated panels, light tinted sections, hairline border base |

## Elevation

The design deliberately avoids drop shadows. All separation between elements is achieved through whitespace, hairline borders in Slate (#6e6d7a), and subtle background tints. When depth is needed, it is tonal, not cast — a card in Cloud (#f7f7f7) on a Paper (#ffffff) page, or a Mist (#edeef3) panel lifting above white. The only visual weight comes from type size, not elevation. This creates the 'paper notebook' feel — flat, printed, calm.

## Imagery

Product photography is the sole visual content: large device renders (iMac, iPhone, Apple Watch) showing the Doo app, and close-up product UI screenshots of task cards. No lifestyle photography, no abstract graphics, no illustration. Device shots are clean, unstyled, and full-bleed within the content container. The product UI itself contains the only color: pastel category tags in mint, lavender, yellow, and brown on white cards. The mood is 'app store hero shot' — product-first, context-free, with the device as the hero.

## Layout

Centered single-column layout with a 1200px max-width container. The hero is a vertically centered text block (headline → subhead → CTA) with generous padding (100-140px). Below the fold, a full-bleed product showcase spans the container width. A press logo section follows in a 3-column grid. Feature sections alternate between centered text-then-screenshot blocks and large product UI close-ups. Navigation is a minimal top bar with logo left and links right, transparent over white. The rhythm is: generous whitespace, centered headlines, single CTA, product image, repeat. No sidebar, no two-column asymmetric layouts, no dark sections.

## Agent Prompt Guide

## Quick Color Reference
- text (primary): #111111
- text (secondary): #6e6d7a
- background: #ffffff
- surface elevated: #edeef3
- border / divider: #6e6d7a
- primary action: no distinct CTA color
- accent: #c3f5dd (mint), #d1cafa (lavender)

## Example Component Prompts

No distinct primary action color was observed; use the extracted neutral button treatments instead of inventing a filled CTA color.

2. **Task Card**: White (#ffffff) background, 30px border-radius, 20px padding. Left-edge category tag: 20px border-radius pill, background #c3f5dd (mint). Task title at 17px Avenir Next 400, color #111111. Due date at 13px Avenir Next 400, color #6e6d7a.

3. **Navigation Bar**: Transparent over white. Logo (three overlapping 12px circles: #c3f5dd, #d1cafa, mid-blue) left-aligned. Nav links right-aligned: "Overview", "Features", "Support", "Download" at 13px Avenir Next 600, color #383938, 26-39px horizontal gaps. Active link uses weight 600, no underline.

4. **Feature Section**: Centered. Eyebrow label "TASK CREATION" at 13px Avenir Next 600, letter-spacing 1.3px, color #6e6d7a. Headline "Made for speed" at 39px Avenir Next 400, color #111111, letter-spacing -1.56px. 33px gap to product UI screenshot below. 1200px max-width container.

5. **Press Logo Strip**: Three-column grid, centered. Publication logos in #111111, evenly spaced across the 1200px container. Below each, a pull-quote in 16px Avenir Next 400, color #6e6d7a, italicized.

## Similar Brands

- **Things (Cultured Code)** — Same monochrome marketing surface with product-as-hero photography, centered headlines, and a single restrained CTA — both projects sell calm through visual quiet
- **Notion** — Similar centered single-column hero, generous whitespace, and product screenshots doing the visual work rather than abstract illustration
- **Hey (Basecamp)** — Same large-weight-400 display headlines, single brand accent color against an otherwise achromatic page, and pill-shaped CTA buttons
- **Bear (notes app)** — Same paper-white canvas with cool-gray borders, pastel product UI accent colors, and a disciplined typographic hierarchy with no decorative shadows

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-indigo-pulse: #3b3996;
  --color-slate: #6e6d7a;
  --color-graphite: #383938;
  --color-ink: #111111;
  --color-paper: #ffffff;
  --color-mist: #edeef3;
  --color-cloud: #f7f7f7;
  --color-mint-whisper: #c3f5dd;
  --color-lavender-drift: #d1cafa;

  /* Typography — Font Families */
  --font-avenir-next: 'Avenir Next', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 13px;
  --leading-caption: 1.2;
  --tracking-caption: 1.3px;
  --text-body-sm: 16px;
  --leading-body-sm: 1.8;
  --text-subheading: 20px;
  --leading-subheading: 1.2;
  --text-heading-sm: 29px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: -1.16px;
  --text-heading: 39px;
  --leading-heading: 1.2;
  --tracking-heading: -1.56px;
  --text-display: 65px;
  --leading-display: 1;
  --tracking-display: -2.6px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-semibold: 600;

  /* Spacing */
  --spacing-5: 5px;
  --spacing-10: 10px;
  --spacing-13: 13px;
  --spacing-19: 19px;
  --spacing-20: 20px;
  --spacing-21: 21px;
  --spacing-26: 26px;
  --spacing-33: 33px;
  --spacing-39: 39px;
  --spacing-49: 49px;
  --spacing-78: 78px;
  --spacing-86: 86px;
  --spacing-90: 90px;
  --spacing-108: 108px;
  --spacing-130: 130px;
  --spacing-217: 217px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 100-140px;
  --card-padding: 30px;
  --element-gap: 20-26px;

  /* Border Radius */
  --radius-3xl: 30px;
  --radius-3xl-2: 39px;

  /* Named Radii */
  --radius-tags: 20px;
  --radius-cards: 30px;
  --radius-buttons: 39px;

  /* Surfaces */
  --surface-paper: #ffffff;
  --surface-cloud: #f7f7f7;
  --surface-mist: #edeef3;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-indigo-pulse: #3b3996;
  --color-slate: #6e6d7a;
  --color-graphite: #383938;
  --color-ink: #111111;
  --color-paper: #ffffff;
  --color-mist: #edeef3;
  --color-cloud: #f7f7f7;
  --color-mint-whisper: #c3f5dd;
  --color-lavender-drift: #d1cafa;

  /* Typography */
  --font-avenir-next: 'Avenir Next', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 13px;
  --leading-caption: 1.2;
  --tracking-caption: 1.3px;
  --text-body-sm: 16px;
  --leading-body-sm: 1.8;
  --text-subheading: 20px;
  --leading-subheading: 1.2;
  --text-heading-sm: 29px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: -1.16px;
  --text-heading: 39px;
  --leading-heading: 1.2;
  --tracking-heading: -1.56px;
  --text-display: 65px;
  --leading-display: 1;
  --tracking-display: -2.6px;

  /* Spacing */
  --spacing-5: 5px;
  --spacing-10: 10px;
  --spacing-13: 13px;
  --spacing-19: 19px;
  --spacing-20: 20px;
  --spacing-21: 21px;
  --spacing-26: 26px;
  --spacing-33: 33px;
  --spacing-39: 39px;
  --spacing-49: 49px;
  --spacing-78: 78px;
  --spacing-86: 86px;
  --spacing-90: 90px;
  --spacing-108: 108px;
  --spacing-130: 130px;
  --spacing-217: 217px;

  /* Border Radius */
  --radius-3xl: 30px;
  --radius-3xl-2: 39px;
}
```
