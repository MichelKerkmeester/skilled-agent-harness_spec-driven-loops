# Shopify — Style Reference
> midnight bazaar under mint lanterns

**Theme:** dark

Shopify's design language reads as a midnight marketplace lit by mint-green signals: a near-black canvas with a faint forest tint, white typography at whisper-light weights (330) that lets generous letter-spacing carry the voice, and a single vivid mint accent that functions as functional punctuation rather than decoration. Surfaces stack in subtle dark-green tints (#02090a → #041e18 → #072720) so that cards feel like panels lifted from the same material, separated by hairline borders rather than heavy shadows. The primary action is a high-contrast white pill button — the green never fills an action — which keeps the brand hue available for inline highlights, key phrases, and iconography where it reads as confidence rather than urgency. Layout alternates between cinematic full-bleed photography and dark content bands with rounded media cards (12px radius), creating a rhythm of spectacle and catalog.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Abyssal Ink | `#02090a` | `--color-abyssal-ink` | Page canvas and hero backgrounds — near-black with a green undertone makes the mint accent glow rather than fight |
| Forest Floor | `#041e18` | `--color-forest-floor` | Card and elevated surface — one step up from canvas, reads as a panel cut from the same dark material |
| Deep Canopy | `#072720` | `--color-deep-canopy` | Secondary card surface and nav backgrounds — provides a second elevation step above Forest Floor |
| Midnight Tinge | `#000a1e` | `--color-midnight-tinge` | Sectional backgrounds where a cooler, blue-tinted dark is needed for variation |
| Moss Border | `#093329` | `--color-moss-border` | List dividers and inset borders on dark surfaces — green-tinted so dividers feel atmospheric, not structural |
| Iron Veil | `#1e2c31` | `--color-iron-veil` | Hairline borders and card outlines — the most-used divider color, bridges green and neutral tones |
| Pure White | `#ffffff` | `--color-pure-white` | Light supporting surface for subtle backgrounds and section separation. Do not promote it to the primary CTA color |
| Ghost White | `#e5e7eb` | `--color-ghost-white` | Secondary surface highlights, subtle borders, and inactive iconography on light or dark contexts |
| Ash Label | `#a1a1aa` | `--color-ash-label` | Muted helper text, footer metadata, and secondary nav labels |
| Slate Caption | `#71717a` | `--color-slate-caption` | Tertiary text and inactive state captions |
| Sea Mist | `#9dabad` | `--color-sea-mist` | Body text in teal-tinted sections and secondary paragraph copy |
| Tide Pool | `#99b3ad` | `--color-tide-pool` | Muted body copy and link text where a subtle green-gray harmonizes with the brand hue |
| Mint Signal | `#36f4a4` | `--color-mint-signal` | Green supporting accent for decorative details and low-frequency emphasis. Do not promote it to the primary CTA color |
| Cyan Pulse | `#30deee` | `--color-cyan-pulse` | Secondary accent for gradient washes, decorative icons, and teal-tinted emphasis text |
| Aurora Gradient | `linear-gradient(126.17deg, rgb(95, 213, 182) 32.74%, rgb(134, 92, 255) 100%)` | `--color-aurora-gradient` | Decorative gradient that sweeps from mint to violet, used in feature highlights and brand flourishes |
| Twilight Wash | `linear-gradient(rgb(36, 71, 73) 0%, rgb(24, 46, 47) 100%)` | `--color-twilight-wash` | Decorative surface gradient — dark teal to deeper teal for atmospheric panels and section backgrounds |

## Tokens — Typography

### NeueHaasGrotesk — Primary typeface for all display, heading, and body text. Weight 330 at 70-96px is the signature choice: most brands shout at 700+, Shopify whispers at 330 with generous letter-spacing (0.015-0.04em), creating authority through restraint. The  · `--font-neuehaasgrotesk`
- **Weights:** 330, 400, 500, 550, 600
- **Sizes:** 14, 16, 18, 20, 24, 28, 48, 55, 70, 96
- **Line height:** 1.25, 1.28, 1.40, 1.49, 1.50
- **Letter spacing:** 0.0150em, 0.0200em, 0.0400em
- **OpenType features:** `"ss03"`
- **Role:** Primary typeface for all display, heading, and body text. Weight 330 at 70-96px is the signature choice: most brands shout at 700+, Shopify whispers at 330 with generous letter-spacing (0.015-0.04em), creating authority through restraint. The 

### Inter-Variable — Secondary typeface for nav, buttons, footer, and micro-copy where Inter's narrower proportions and tighter letter-spacing (0.06em uppercase) suit compact UI contexts · `--font-inter-variable`
- **Substitute:** Inter, system-ui, or Roboto
- **Weights:** 400, 420, 450, 550
- **Sizes:** 12, 14, 16, 18, 20
- **Line height:** 1.20, 1.29, 1.43, 1.50, 1.56
- **Letter spacing:** 0.06em for uppercase labels and button text
- **OpenType features:** `\"ss03\"`
- **Role:** Secondary typeface for nav, buttons, footer, and micro-copy where Inter's narrower proportions and tighter letter-spacing (0.06em uppercase) suit compact UI contexts

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.5 | 0.72px | `--text-caption` |
| body-sm | 14px | 1.5 | 0.56px | `--text-body-sm` |
| body | 16px | 1.5 | 0.64px | `--text-body` |
| subheading | 20px | 1.4 | 0.4px | `--text-subheading` |
| heading-sm | 24px | 1.4 | 0.48px | `--text-heading-sm` |
| heading | 28px | 1.4 | 0.56px | `--text-heading` |
| heading-lg | 48px | 1.25 | 0.96px | `--text-heading-lg` |
| display | 70px | 1.14 | 1.05px | `--text-display` |
| display-lg | 96px | 1 | 1.44px | `--text-display-lg` |

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
| 32 | 32px | `--spacing-32` |
| 40 | 40px | `--spacing-40` |
| 52 | 52px | `--spacing-52` |
| 56 | 56px | `--spacing-56` |
| 64 | 64px | `--spacing-64` |
| 80 | 80px | `--spacing-80` |
| 128 | 128px | `--spacing-128` |
| 208 | 208px | `--spacing-208` |

### Border Radius

| Element | Value |
|---------|-------|
| nav | 8px |
| cards | 12px |
| pills | 9999px |
| buttons | 9999px |
| asymmetric | 20px |
| smallButtons | 4px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| sm | `rgba(0, 0, 0, 0.1) 0px 8px 8px 0px, rgba(0, 0, 0, 0.1) 0p...` | `--shadow-sm` |
| md | `rgba(0, 0, 0, 0.2) 10px 13px 12px 2px` | `--shadow-md` |
| subtle | `rgba(255, 255, 255, 0.05) 0px 1px 2px 0px, rgba(255, 255,...` | `--shadow-subtle` |
| xl | `rgba(5, 24, 19, 0.05) 0px 20px 60px 0px, rgb(19, 59, 50) ...` | `--shadow-xl` |

### Layout

- **Page max-width:** 1280px
- **Section gap:** 64-96px
- **Card padding:** 20-24px
- **Element gap:** 16px

## Components

### Primary Action Button
**Role:** Filled white pill button for the main CTA on each section

Background #ffffff, text #02090a, border-radius 9999px, padding 12px 24px, font Inter-Variable 16px weight 550, letter-spacing 0.06em uppercase. Renders as a high-contrast white capsule against the dark canvas — the green accent never fills an action.

### Ghost Outline Button
**Role:** Secondary action paired with the primary CTA

Background transparent, border 1px #ffffff with opacity ~0.4, text #ffffff, border-radius 9999px, padding 12px 24px, font Inter-Variable 16px weight 550. Sits beside the primary action as a quieter alternative.

### Small Rectangular Button
**Role:** Compact buttons inside cards, calculators, and inline forms

Background #333333, text #ffffff, border-radius 4px, padding 8px 16px, font Inter-Variable 14px weight 550. Used for form submissions and card-level actions where the pill shape would feel too soft.

### Content Card
**Role:** Image-forward card in feature grids and brand showcase sections

Background #041e18, border-radius 12px, overflow hidden. Contains a full-bleed image with 12px radius inheriting to the image. No visible border — the image and rounded corner are the card's identity. Shadow: rgba(5,24,19,0.05) 0px 20px 60px 0px for subtle lift.

### Elevated Feature Card
**Role:** Cards with product previews, shipping calculators, and interactive demos

Background #041e18 or #072720, border 1px solid #1e2c31, border-radius 12px, padding 20-24px, shadow: multi-layer black 0.1 opacity with inset white 0.03 highlight. The layered shadow with inset white creates a subtle glass-edge effect against the dark surface.

### Asymmetric Media Card
**Role:** Cards with 20px top-left and bottom-right radii, creating a dynamic shape

Border-radius 20px on opposite corners only (asymmetric), background #041e18. Used for hero-adjacent media blocks where a standard rounded card would feel static.

### Navigation Bar
**Role:** Top-level site navigation with logo, links, and action buttons

Background transparent or #072720 on scroll, logo with green Shopify bag icon, nav links in Inter-Variable 14px weight 400 with #ffffff or #a1a1aa color, right-aligned action buttons. Border-radius 8px on the nav container itself.

### Hero Overlay Text
**Role:** Large display headline overlaid on full-bleed photography

NeueHaasGrotesk weight 330 at 70-96px, color #ffffff, line-height 1.0-1.14, letter-spacing 0.015-0.04em. The whisper-weight headlines over dramatic photography create a contrast between restraint and spectacle.

### Inline Keyword Highlight
**Role:** Brand-colored emphasis within body text and headings

Text color #36f4a4 applied to key phrases (product names, value propositions) within otherwise white paragraphs. The mint green appears only as semantic emphasis — never decorative.

### Shipping Calculator Widget
**Role:** Interactive form embedded in feature sections

Background #ffffff, border-radius 12px, padding 16px. Contains labeled form fields with #02090a text, a green highlighted total row (background #36f4a4 or similar mint), and a dark submit button at the bottom.

### Country Selector Flag
**Role:** Vertical list of country flags in the international section

Each flag in a square container ~40px with #072720 background, border-radius 4px, separated by 8px gap. Active flag has a brighter border or background lift.

### Section Gradient Background
**Role:** Atmospheric background for feature and international sections

Linear gradient from rgb(36,71,73) to rgb(24,46,47) or radial gradient with teal center fading to canvas. Creates a subtle teal glow that differentiates sections without breaking the dark-mode cohesion.

### Footer Link Group
**Role:** Column-based footer navigation with category headings and links

Category headings in Inter-Variable 12px weight 550 uppercase with 0.06em letter-spacing and #a1a1aa color. Links in 14px weight 400 with #ffffff or #9dabad color, 8-12px vertical spacing between items.

## Do's and Don'ts

### Do
- Use weight 330 for display headlines (70-96px) with 0.015-0.04em letter-spacing — this whisper-weight is the brand's signature voice
- Set primary action buttons to white fill (#ffffff) with #02090a text, never mint green — the green accent is for text emphasis, not CTAs
- Apply #36f4a4 only to inline keyword highlights and the wordmark — it should appear as semantic punctuation, not decoration
- Use border-radius 12px for all content cards and 9999px for action buttons — mixing these creates the card/button hierarchy
- Layer dark surfaces in the order #02090a → #041e18 → #072720 — each step must carry a green tint to maintain atmospheric cohesion
- Use the 
- ss03" font feature setting on all NeueHaasGrotesk and Inter text — it enables alternate glyphs that define the brand's letter personality"
- Pair multi-layer soft shadows (black 0.1 + white 0.03 inset) on dark cards for a glass-edge effect rather than heavy drop shadows

### Don't
- Never use weight 700+ for display headlines — the brand's authority comes from restraint at 330, not volume at 700
- Never fill a button with #36f4a4 — the mint green is a text and accent color, not an action color
- Never use light/neutral backgrounds — the system is dark-first; cards, sections, and the canvas all carry green-tinted darks
- Never use border-radius larger than 12px on cards — the pill shape (9999px) is reserved exclusively for buttons and tags
- Never use a pure neutral gray (#808080 or similar) — all grays must carry a green or teal tint to harmonize with the dark surfaces
- Never apply heavy drop shadows for elevation — rely on surface tint steps and hairline borders instead, with only soft layered shadows for interactive elements
- Never use more than one accent color per view — mint green for emphasis, cyan teal only in gradients, never both competing for attention

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Abyssal Ink | `#02090a` | Page canvas and full-bleed hero backgrounds |
| 1 | Midnight Tinge | `#000a1` | Sectional bands where a cooler dark is needed |
| 2 | Forest Floor | `#041e18` | Card panels and content containers |
| 3 | Deep Canopy | `#072720` | Elevated cards, nav backgrounds, and hover-state surfaces |

## Elevation

- **Content Card:** `rgba(0, 0, 0, 0.1) 0px 8px 8px 0px, rgba(0, 0, 0, 0.1) 0px 4px 4px 0px, rgba(0, 0, 0, 0.1) 0px 2px 2px 0px, rgba(0, 0, 0, 0.1) 0px 0px 0px 1px, rgba(255, 255, 255, 0.03) 0px 1px 0px 0px inset`
- **Interactive Demo Card:** `rgba(5, 24, 19, 0.05) 0px 20px 60px 0px, rgb(19, 59, 50) 0px 1px 0px 0px inset`

## Imagery

Full-bleed cinematic photography dominates the hero: tightly cropped, high-energy crowd and event imagery (the Nasdaq/Allbells celebration shot) with no lifestyle staging — the moment IS the content. Product and brand imagery in secondary sections appears in rounded media cards (12px radius) with full-bleed crops, no padding around images. The visual strategy alternates between spectacle (hero photography) and catalog (brand logo grids, product screenshots in cards). Gradients with teal and green washes appear behind map graphics and feature sections to create atmospheric depth without literal imagery. Icons are minimal and outlined, used only for functional UI affordances.

## Layout

Full-bleed page model with no visible max-width constraint at the canvas level. The hero is a full-viewport photographic image with overlaid display text left-aligned in the lower-left quadrant, creating an asymmetric composition where the visual dominates and the text anchors. Below the hero, sections shift to a dark content area with max-width ~1280px centered. Content sections alternate between left-aligned text + right-aligned media blocks and centered headline + grid layouts (3-column image card grids for brand showcases, 2-column layouts for feature explanations). The international section uses a full-bleed dark teal-tinted background with centered content. Navigation is a minimal top bar: logo left, nav links center-left, login + CTA right, transparent over the hero and solid dark on scroll. Spacing between sections is generous (64-96px) to let the dark background breathe.

## Agent Prompt Guide

**Quick Color Reference**\n- text: #ffffff (primary), #99b3ad (body muted), #a1a1aa (helper)\n- background: #02090a (canvas), #041e18 (card), #072720 (elevated)\n- border: #1e2c31 (hairline), #093329 (inset)\n- accent: #36f4a4 (mint — text emphasis only)\n- secondary accent: #30deee (teal — gradients only)\n- primary action: no distinct CTA color

## Similar Brands

- **Linear** — Same dark-mode-first approach with near-black canvas, whisper-light weight display headlines, and pill-shaped action buttons
- **Vercel** — Similar generous letter-spacing on large display text and minimal color palette where a single accent color functions as semantic emphasis rather than decoration
- **Stripe** — Shared use of light-weight typography at large sizes, pill-shaped CTAs, and a dark surface stack with subtle tint variations
- **Notion** — Same restrained accent color usage — a single brand hue appears only for emphasis and brand identity, never as a filled action
- **Arc Browser** — Dark canvas with green-tinted neutrals and full-bleed photographic hero sections with overlaid display text

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-abyssal-ink: #02090a;
  --color-forest-floor: #041e18;
  --color-deep-canopy: #072720;
  --color-midnight-tinge: #000a1e;
  --color-moss-border: #093329;
  --color-iron-veil: #1e2c31;
  --color-pure-white: #ffffff;
  --color-ghost-white: #e5e7eb;
  --color-ash-label: #a1a1aa;
  --color-slate-caption: #71717a;
  --color-sea-mist: #9dabad;
  --color-tide-pool: #99b3ad;
  --color-mint-signal: #36f4a4;
  --color-cyan-pulse: #30deee;
  --color-aurora-gradient: #5fd5b6;
  --gradient-aurora-gradient: linear-gradient(126.17deg, rgb(95, 213, 182) 32.74%, rgb(134, 92, 255) 100%);
  --color-twilight-wash: #244749;
  --gradient-twilight-wash: linear-gradient(rgb(36, 71, 73) 0%, rgb(24, 46, 47) 100%);

  /* Typography — Font Families */
  --font-neuehaasgrotesk: 'NeueHaasGrotesk', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter-variable: 'Inter-Variable', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --tracking-caption: 0.72px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.5;
  --tracking-body-sm: 0.56px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: 0.64px;
  --text-subheading: 20px;
  --leading-subheading: 1.4;
  --tracking-subheading: 0.4px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.4;
  --tracking-heading-sm: 0.48px;
  --text-heading: 28px;
  --leading-heading: 1.4;
  --tracking-heading: 0.56px;
  --text-heading-lg: 48px;
  --leading-heading-lg: 1.25;
  --tracking-heading-lg: 0.96px;
  --text-display: 70px;
  --leading-display: 1.14;
  --tracking-display: 1.05px;
  --text-display-lg: 96px;
  --leading-display-lg: 1;
  --tracking-display-lg: 1.44px;

  /* Typography — Weights */
  --font-weight-w330: 330;
  --font-weight-regular: 400;
  --font-weight-w420: 420;
  --font-weight-w450: 450;
  --font-weight-medium: 500;
  --font-weight-w550: 550;
  --font-weight-semibold: 600;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-52: 52px;
  --spacing-56: 56px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-128: 128px;
  --spacing-208: 208px;

  /* Layout */
  --page-max-width: 1280px;
  --section-gap: 64-96px;
  --card-padding: 20-24px;
  --element-gap: 16px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-2xl-2: 20px;
  --radius-full: 48px;
  --radius-full-2: 340px;
  --radius-full-3: 405px;
  --radius-full-4: 9999px;

  /* Named Radii */
  --radius-nav: 8px;
  --radius-cards: 12px;
  --radius-pills: 9999px;
  --radius-buttons: 9999px;
  --radius-asymmetric: 20px;
  --radius-smallbuttons: 4px;

  /* Shadows */
  --shadow-sm: rgba(0, 0, 0, 0.1) 0px 8px 8px 0px, rgba(0, 0, 0, 0.1) 0px 4px 4px 0px, rgba(0, 0, 0, 0.1) 0px 2px 2px 0px, rgba(0, 0, 0, 0.1) 0px 0px 0px 1px, rgba(255, 255, 255, 0.03) 0px 1px 0px 0px inset;
  --shadow-md: rgba(0, 0, 0, 0.2) 10px 13px 12px 2px;
  --shadow-subtle: rgba(255, 255, 255, 0.05) 0px 1px 2px 0px, rgba(255, 255, 255, 0.04) 0px 1px 0px 0px inset;
  --shadow-xl: rgba(5, 24, 19, 0.05) 0px 20px 60px 0px, rgb(19, 59, 50) 0px 1px 0px 0px inset;

  /* Surfaces */
  --surface-abyssal-ink: #02090a;
  --surface-midnight-tinge: #000a1;
  --surface-forest-floor: #041e18;
  --surface-deep-canopy: #072720;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-abyssal-ink: #02090a;
  --color-forest-floor: #041e18;
  --color-deep-canopy: #072720;
  --color-midnight-tinge: #000a1e;
  --color-moss-border: #093329;
  --color-iron-veil: #1e2c31;
  --color-pure-white: #ffffff;
  --color-ghost-white: #e5e7eb;
  --color-ash-label: #a1a1aa;
  --color-slate-caption: #71717a;
  --color-sea-mist: #9dabad;
  --color-tide-pool: #99b3ad;
  --color-mint-signal: #36f4a4;
  --color-cyan-pulse: #30deee;
  --color-aurora-gradient: #5fd5b6;
  --color-twilight-wash: #244749;

  /* Typography */
  --font-neuehaasgrotesk: 'NeueHaasGrotesk', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter-variable: 'Inter-Variable', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --tracking-caption: 0.72px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.5;
  --tracking-body-sm: 0.56px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: 0.64px;
  --text-subheading: 20px;
  --leading-subheading: 1.4;
  --tracking-subheading: 0.4px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.4;
  --tracking-heading-sm: 0.48px;
  --text-heading: 28px;
  --leading-heading: 1.4;
  --tracking-heading: 0.56px;
  --text-heading-lg: 48px;
  --leading-heading-lg: 1.25;
  --tracking-heading-lg: 0.96px;
  --text-display: 70px;
  --leading-display: 1.14;
  --tracking-display: 1.05px;
  --text-display-lg: 96px;
  --leading-display-lg: 1;
  --tracking-display-lg: 1.44px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-52: 52px;
  --spacing-56: 56px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-128: 128px;
  --spacing-208: 208px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-2xl-2: 20px;
  --radius-full: 48px;
  --radius-full-2: 340px;
  --radius-full-3: 405px;
  --radius-full-4: 9999px;

  /* Shadows */
  --shadow-sm: rgba(0, 0, 0, 0.1) 0px 8px 8px 0px, rgba(0, 0, 0, 0.1) 0px 4px 4px 0px, rgba(0, 0, 0, 0.1) 0px 2px 2px 0px, rgba(0, 0, 0, 0.1) 0px 0px 0px 1px, rgba(255, 255, 255, 0.03) 0px 1px 0px 0px inset;
  --shadow-md: rgba(0, 0, 0, 0.2) 10px 13px 12px 2px;
  --shadow-subtle: rgba(255, 255, 255, 0.05) 0px 1px 2px 0px, rgba(255, 255, 255, 0.04) 0px 1px 0px 0px inset;
  --shadow-xl: rgba(5, 24, 19, 0.05) 0px 20px 60px 0px, rgb(19, 59, 50) 0px 1px 0px 0px inset;
}
```
