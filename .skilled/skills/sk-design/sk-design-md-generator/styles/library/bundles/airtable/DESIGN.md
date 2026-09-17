# Airtable — Style Reference
> warm workshop with color-coded chapters

**Theme:** light

Airtable presents as a warm, editorial workspace rather than a cold SaaS dashboard. The canvas is a soft cream parchment (#faf5e8) — never stark white — which gives the whole site a paper-like, almost printed feel. Typography is bold and unapologetic: a custom display face at near-900 weight for hero headlines pairs with a workhorse sans for body and UI. Buttons are pure black, not the expected brand-blue, giving the page an architectural, almost print-publication confidence. The signature move is color-coded feature cards — each use case gets its own saturated hue (terracotta, deep blue, forest green, peach, pink) functioning as chapter dividers in a visual catalog. The overall effect is a creative studio notebook: warm, organized, opinionated, and human.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Parchment Cream | `#faf5e8` | `--color-parchment-cream` | Page canvas — the warm off-white that defines the entire site's atmosphere, replacing standard pure-white backgrounds |
| Pure White | `#ffffff` | `--color-pure-white` | Light supporting surface for subtle backgrounds and section separation. Do not promote it to the primary CTA color |
| Frost White | `#f8fafc` | `--color-frost-white` | Alternate light surface for nested elements, subtle nav backgrounds |
| Onyx | `#181d26` | `--color-onyx` | Supporting neutral for secondary UI, dividers, and muted labels. Do not promote it to the primary CTA color |
| Charcoal | `#333840` | `--color-charcoal` | Body text, secondary text levels, border accents — the workhorse dark neutral |
| Graphite | `#525965` | `--color-graphite` | Muted text, sub-labels, less prominent body copy |
| Steel | `#9297a0` | `--color-steel` | Placeholder text, disabled states, low-emphasis labels |
| Silver Border | `#e0e2e6` | `--color-silver-border` | Hairline dividers, card borders, subtle structural separators |
| Midnight Indigo | `#040e20` | `--color-midnight-indigo` | Deepest heading text, near-black with cool bias for maximum editorial weight |
| Cobalt Blue | `#1b61c9` | `--color-cobalt-blue` | Blue supporting accent for decorative details and low-frequency emphasis. Do not promote it to the primary CTA color |
| Sapphire | `#254fad` | `--color-sapphire` | Violet supporting accent for decorative details and low-frequency emphasis. |
| Terracotta | `#aa2d00` | `--color-terracotta` | Orange supporting accent for decorative details and low-frequency emphasis. |
| Burnt Sienna | `#912e1f` | `--color-burnt-sienna` | Dark terracotta variant for card backgrounds and text on warm sections |
| Peach Glow | `#fcab79` | `--color-peach-glow` | Soft warm wash for highlight panels, accent backgrounds |
| Forest Ink | `#0a2e0e` | `--color-forest-ink` | Green supporting accent for decorative details and low-frequency emphasis. |
| Moss | `#214224` | `--color-moss` | Secondary green text and border accents on green-themed sections |
| Petal Pink | `#fa91e0` | `--color-petal-pink` | Playful accent for tags, category chips, illustration color |
| Marigold | `#fcb42a` | `--color-marigold` | Warm accent for badges, tag chips, category highlights |
| Pale Sky | `#c7e5f2` | `--color-pale-sky` | Light supporting surface for subtle backgrounds and section separation |

## Tokens — Typography

### Haas Groot Disp — Display headlines — the custom serif/slab face used for hero statements and large section titles, driven by 900 weight for editorial weight · `--font-haas-groot-disp`
- **Substitute:** GT Sectra Display, Tiempos Headline, or Roboto Slab 900
- **Weights:** 400, 900
- **Sizes:** 20px, 48px
- **Line height:** 1.50
- **Letter spacing:** normal
- **Role:** Display headlines — the custom serif/slab face used for hero statements and large section titles, driven by 900 weight for editorial weight

### Haas — Body, nav, buttons, subheadings, UI labels — the workhorse sans-serif at 400 for body, 500 for emphasis, 600 for buttons and labels; slight positive tracking opens up at larger sizes · `--font-haas`
- **Substitute:** Inter, Söhne, or Neue Haas Grotesk
- **Weights:** 400, 500, 600
- **Sizes:** 14px, 16px, 18px, 20px, 24px, 32px, 40px
- **Line height:** 1.15, 1.20, 1.25, 1.30, 1.35, 1.50
- **Letter spacing:** 0.0050em at 14px, 0.0060em at 16px, 0.0070em at 18px, 0.0100em at 20px, 0.0110em at 24px, 0.0200em at 32px+
- **Role:** Body, nav, buttons, subheadings, UI labels — the workhorse sans-serif at 400 for body, 500 for emphasis, 600 for buttons and labels; slight positive tracking opens up at larger sizes

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 14px | 1.35 | 0.07px | `--text-caption` |
| body-sm | 16px | 1.3 | 0.096px | `--text-body-sm` |
| body | 18px | 1.35 | 0.126px | `--text-body` |
| subheading | 20px | 1.3 | 0.2px | `--text-subheading` |
| heading-sm | 24px | 1.25 | 0.264px | `--text-heading-sm` |
| heading | 32px | 1.2 | 0.64px | `--text-heading` |
| heading-lg | 40px | 1.15 | 0.8px | `--text-heading-lg` |
| display | 48px | 1.5 | — | `--text-display` |

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
| 48 | 48px | `--spacing-48` |
| 64 | 64px | `--spacing-64` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 32px |
| cards | 16px |
| buttons | 12px |
| featureCards | 24px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| subtle | `rgba(0, 0, 0, 0.32) 0px 0px 1px 0px, rgba(0, 0, 0, 0.08) ...` | `--shadow-subtle` |
| lg | `rgba(15, 48, 106, 0.05) 0px 0px 20px 0px` | `--shadow-lg` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 64px
- **Card padding:** 24px
- **Element gap:** 16px

## Components

### Primary CTA Button
**Role:** Main conversion action

Filled #181d26 (Onyx) background, white text, Haas 600 at 16px, 12px border-radius, 16px vertical and 24px horizontal padding. Sits on cream canvas with a subtle multi-layer blue-tinted shadow giving it dimensional weight.

### Secondary Ghost Button
**Role:** Secondary action or alternative CTA

White #ffffff background, 1px #181d26 border, black text, Haas 600 at 16px, 12px border-radius, identical padding to primary. Used for 'Book demo' actions paired with primary CTAs.

### Top Navigation Bar
**Role:** Primary site navigation

White #ffffff background with subtle blue-tinted drop shadow (rgba(15,48,106,0.05) 0px 0px 20px). Logo left (Airtable mark), centered nav links in Haas 400 at 16px with chevron dropdowns, right-aligned 'Book Demo' ghost button and 'Sign up for free' primary button plus 'Log in' text link.

### Hero Section
**Role:** First-screen value proposition

Centered on parchment cream canvas, 48px Haas Groot Disp 900 headline in #040e20, 18px Haas 400 subtext in #333840, dual CTAs (primary + ghost) centered below, followed by a dark #181d26 product screenshot container with 16px radius showing the app interface.

### Logo Trust Bar
**Role:** Social proof and credibility

Single row of customer logos in muted monochrome on parchment background, preceded by a small caption 'Trusted by 500,000 leading teams' in Haas 400.

### Tabbed Feature Section
**Role:** Product capability deep-dive

Two-column layout: left side has numbered tab list (01–04) in Haas 500, active tab in #181d26 weight 600, inactive tabs in muted #9297a0. Right side has a large saturated color block (e.g. #aa2d00 Terracotta) with white inner card containing heading, body text, and ghost 'Learn more' button.

### Color-Coded Feature Card
**Role:** Use case showcase

Large card with 24px radius, saturated background color (Terracotta, Sapphire, Forest, Pale Sky), inner white panel showing app screenshot or data. Each use case gets its own color identity — terracotta for campaigns, sapphire for opportunities, forest for localization, pale sky for attendee lists.

### Product Screenshot Frame
**Role:** Dark app preview container

#181d26 background container with 16px radius, holds full app UI screenshots with their native dark theme, creating contrast against the warm cream page.

### Prompt Input Bar
**Role:** AI prompt interaction

White rounded pill input on dark product surface, contains prompt text in Haas 400, trailing circular dark submit button with arrow icon.

### Category Chip / Tag
**Role:** Label or filter indicator

Pill-shaped, 32px border-radius, small text in Haas 500, vivid color background (Marigold, Petal Pink) with contrasting text — used for status, category, and filter labels.

### Announcement Banner
**Role:** Top-of-page promotional strip

Full-width thin bar at page top, light background, centered text in Haas 400 with inline link in Cobalt Blue (#1b61c9) and a dismiss close button on the right.

## Do's and Don'ts

### Do
- Use Parchment Cream (#faf5e8) as the base canvas — never pure #ffffff for full-page backgrounds
- Pair every primary filled CTA with a ghost outlined button as the secondary action
- Use 12px border-radius for all buttons and 24px for large feature cards to create the rounded-but-architectural feel
- Give each major use case section its own saturated color identity (terracotta, sapphire, forest, peach, pink)
- Use Haas Groot Disp 900 for hero and section headlines, reserving it for sizes 40px+
- Apply the 8px base unit consistently: 8, 16, 24, 32, 40, 64 for padding, gaps, and section rhythm
- Anchor interactive elements with Onyx (#181d26) rather than a brand-colored fill

### Don't
- Don't use pure #ffffff as a page background — always use Parchment Cream (#faf5e8) for the canvas
- Don't use a brand-blue or chromatic color for CTA buttons — Onyx black is the convention
- Don't apply letter-spacing to display headlines in Haas Groot Disp — the custom face is designed for tight tracking
- Don't use sharp corners (0px radius) on any interactive or card element — minimum 12px
- Don't mix more than 2 text weights in a single body paragraph — stay at 400 or 500
- Don't place white cards directly on the cream canvas with zero padding — always 16-24px internal padding
- Don't use the saturated feature card colors for text body or small UI elements — they're meant for section-scale surfaces only

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Parchment Canvas | `#faf5e8` | Page-wide warm background that sets the editorial tone |
| 1 | White Card | `#ffffff` | Primary card surface sitting on parchment |
| 2 | Frost White | `#f8fafc` | Subtle alternate surface for nested elements |
| 3 | Pale Sky | `#c7e5f2` | Tinted surface for soft section differentiation |
| 4 | Onyx Frame | `#181d26` | Dark product screenshot containers and dark CTA fills |

## Elevation

- **Primary CTA Button:** `rgba(0, 0, 0, 0.32) 0px 0px 1px 0px, rgba(0, 0, 0, 0.08) 0px 0px 2px 0px, rgba(45, 127, 249, 0.28) 0px 1px 3px 0px, rgba(0, 0, 0, 0.06) 0px 0px 0px 0.5px inset`
- **Top Navigation:** `rgba(15, 48, 106, 0.05) 0px 0px 20px 0px`

## Imagery

Product screenshots dominate as the primary visual content — full dark-mode app UI frames embedded in the light cream page create strong contrast. The screenshots show data tables, kanban boards, calendar views, and AI prompt inputs at full fidelity. Supporting imagery includes small inline product crops (sneaker photos, portrait images) within feature cards. No lifestyle photography, no abstract illustrations. Logo bar uses muted monochrome customer logos. The visual language is product-showcase: the app interface IS the hero, framed by warm editorial typography.

## Layout

Centered, max-width 1200px content column on a warm cream canvas. Hero is centered text stack over a dark product screenshot that breaks below the content edge. Sections flow vertically with consistent 64px gaps, alternating between text-forward editorial sections and visual-heavy product demo sections. Feature areas use a 2-column pattern: left side has a vertical numbered tab list (01–04), right side has a large saturated color block. The bottom section uses a 2-column grid of color-coded use-case cards, each filling roughly half the width. Navigation is a clean top bar with logo left, centered links, and CTAs right. Dense information architecture is avoided — sections breathe with generous whitespace, and each block serves a single purpose.

## Agent Prompt Guide

**Quick Color Reference**
- text: #181d26 (Onyx)
- background: #faf5e8 (Parchment Cream)
- border: #e0e2e6 (Silver Border)
- accent: #1b61c9 (Cobalt Blue) for links
- primary action: no distinct CTA color
- section accents: #aa2d00 (Terracotta), #254fad (Sapphire), #0a2e0e (Forest), #fcab79 (Peach)

**Example Component Prompts**

No distinct primary action color was observed; use the extracted neutral button treatments instead of inventing a filled CTA color.

2. Create a color-coded feature card: 24px border-radius, background #aa2d00 (Terracotta), inner white #ffffff panel with 16px padding containing a heading at 24px Haas weight 600 #181d26, body text at 16px Haas weight 400 #333840, and a ghost button (white fill, 1px #181d26 border, 12px radius) labeled 'Learn more'.


4. Create a tabbed feature section: 2-column layout. Left column has numbered tabs (01–04) in Haas 500, active tab in #181d26 weight 600 with a left indicator bar, inactive tabs in #9297a0 weight 400. Right column is a large #aa2d00 (Terracotta) block with a white inner card containing the feature content and a ghost 'Learn more' button.

5. Create an announcement banner: full-width strip, #f8fafc background, 12px vertical padding, centered text in Haas 400 at 14px #333840 with an inline link in #1b61c9 (Cobalt Blue) and a small dismiss '×' button on the far right.

## Similar Brands

- **Notion** — Same warm neutral canvas approach, same generous whitespace, same centered hero-with-screenshot pattern, though Notion leans more monochromatic
- **Linear** — Similar clean editorial typography and confident use of near-black for primary actions, but Linear is dark-mode-first and more geometric
- **Webflow** — Shared pattern of color-coded feature/use-case sections with saturated accent blocks, though Webflow uses purple as a stronger single brand anchor
- **Figma** — Similar product-screenshot-as-hero visual strategy and a multi-hue accent system rather than a single brand color

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-parchment-cream: #faf5e8;
  --color-pure-white: #ffffff;
  --color-frost-white: #f8fafc;
  --color-onyx: #181d26;
  --color-charcoal: #333840;
  --color-graphite: #525965;
  --color-steel: #9297a0;
  --color-silver-border: #e0e2e6;
  --color-midnight-indigo: #040e20;
  --color-cobalt-blue: #1b61c9;
  --color-sapphire: #254fad;
  --color-terracotta: #aa2d00;
  --color-burnt-sienna: #912e1f;
  --color-peach-glow: #fcab79;
  --color-forest-ink: #0a2e0e;
  --color-moss: #214224;
  --color-petal-pink: #fa91e0;
  --color-marigold: #fcb42a;
  --color-pale-sky: #c7e5f2;

  /* Typography — Font Families */
  --font-haas-groot-disp: 'Haas Groot Disp', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-haas: 'Haas', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.35;
  --tracking-caption: 0.07px;
  --text-body-sm: 16px;
  --leading-body-sm: 1.3;
  --tracking-body-sm: 0.096px;
  --text-body: 18px;
  --leading-body: 1.35;
  --tracking-body: 0.126px;
  --text-subheading: 20px;
  --leading-subheading: 1.3;
  --tracking-subheading: 0.2px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.25;
  --tracking-heading-sm: 0.264px;
  --text-heading: 32px;
  --leading-heading: 1.2;
  --tracking-heading: 0.64px;
  --text-heading-lg: 40px;
  --leading-heading-lg: 1.15;
  --tracking-heading-lg: 0.8px;
  --text-display: 48px;
  --leading-display: 1.5;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-black: 900;

  /* Spacing */
  --spacing-unit: 8px;
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-64: 64px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 64px;
  --card-padding: 24px;
  --element-gap: 16px;

  /* Border Radius */
  --radius-sm: 2px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-2xl-2: 20px;
  --radius-3xl: 24px;
  --radius-3xl-2: 32px;

  /* Named Radii */
  --radius-tags: 32px;
  --radius-cards: 16px;
  --radius-buttons: 12px;
  --radius-featurecards: 24px;

  /* Shadows */
  --shadow-subtle: rgba(0, 0, 0, 0.32) 0px 0px 1px 0px, rgba(0, 0, 0, 0.08) 0px 0px 2px 0px, rgba(45, 127, 249, 0.28) 0px 1px 3px 0px, rgba(0, 0, 0, 0.06) 0px 0px 0px 0.5px inset;
  --shadow-lg: rgba(15, 48, 106, 0.05) 0px 0px 20px 0px;

  /* Surfaces */
  --surface-parchment-canvas: #faf5e8;
  --surface-white-card: #ffffff;
  --surface-frost-white: #f8fafc;
  --surface-pale-sky: #c7e5f2;
  --surface-onyx-frame: #181d26;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-parchment-cream: #faf5e8;
  --color-pure-white: #ffffff;
  --color-frost-white: #f8fafc;
  --color-onyx: #181d26;
  --color-charcoal: #333840;
  --color-graphite: #525965;
  --color-steel: #9297a0;
  --color-silver-border: #e0e2e6;
  --color-midnight-indigo: #040e20;
  --color-cobalt-blue: #1b61c9;
  --color-sapphire: #254fad;
  --color-terracotta: #aa2d00;
  --color-burnt-sienna: #912e1f;
  --color-peach-glow: #fcab79;
  --color-forest-ink: #0a2e0e;
  --color-moss: #214224;
  --color-petal-pink: #fa91e0;
  --color-marigold: #fcb42a;
  --color-pale-sky: #c7e5f2;

  /* Typography */
  --font-haas-groot-disp: 'Haas Groot Disp', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-haas: 'Haas', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.35;
  --tracking-caption: 0.07px;
  --text-body-sm: 16px;
  --leading-body-sm: 1.3;
  --tracking-body-sm: 0.096px;
  --text-body: 18px;
  --leading-body: 1.35;
  --tracking-body: 0.126px;
  --text-subheading: 20px;
  --leading-subheading: 1.3;
  --tracking-subheading: 0.2px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.25;
  --tracking-heading-sm: 0.264px;
  --text-heading: 32px;
  --leading-heading: 1.2;
  --tracking-heading: 0.64px;
  --text-heading-lg: 40px;
  --leading-heading-lg: 1.15;
  --tracking-heading-lg: 0.8px;
  --text-display: 48px;
  --leading-display: 1.5;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-64: 64px;

  /* Border Radius */
  --radius-sm: 2px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-2xl-2: 20px;
  --radius-3xl: 24px;
  --radius-3xl-2: 32px;

  /* Shadows */
  --shadow-subtle: rgba(0, 0, 0, 0.32) 0px 0px 1px 0px, rgba(0, 0, 0, 0.08) 0px 0px 2px 0px, rgba(45, 127, 249, 0.28) 0px 1px 3px 0px, rgba(0, 0, 0, 0.06) 0px 0px 0px 0.5px inset;
  --shadow-lg: rgba(15, 48, 106, 0.05) 0px 0px 20px 0px;
}
```
