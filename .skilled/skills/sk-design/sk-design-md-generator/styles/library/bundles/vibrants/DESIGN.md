# Vibrants — Style Reference
> Skyborne apothecary on white marble — the dark navy ink is the mortar, the rainbow spectrum is the medicine.

**Theme:** light

Vibrants reads as a bright, clinical wellness counter: white canvas, a deep-navy ink that does the heavy lifting for text and primary buttons, and a full-spectrum rainbow that lives only on the product surface. The visual grammar is deliberately quiet outside the hero and product imagery — almost monochrome structure with a single vivid green punctuating sales, badges, and confirmations. Headlines use a custom serif that leans editorial and trustworthy, while body copy and UI stay in geometric sans-serifs that feel pharmaceutical-precise. Components are flat with hairline borders, soft 8px corners, and minimal elevation; depth comes from color contrast and generous whitespace rather than shadow. The sky-blue gradient hero and floating product mockup set a calm, optimistic tone that the rest of the page sustains through airy spacing and restrained typography.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Deep Navy | `#021422` | `--color-deep-navy` | Primary text, primary filled buttons, nav backgrounds, heading ink, footer surface — near-black that reads as ink rather than pure black, grounding the page while staying soft enough to pair with white |
| Vibrant Green | `#00852e` | `--color-vibrant-green` | Sale badges, discount pills, success indicators, single-use accents — the only vivid hue that touches the chrome; every other chromatic surface belongs to a product |
| Midnight Navy | `#001f38` | `--color-midnight-navy` | Secondary text emphasis, card border accent on hero product, heading hierarchy step below Deep Navy — slightly bluer for tonal variation without leaving the family |
| Sky Wash | `#91c3ff` | `--color-sky-wash` | Outlined button borders, icon accents, link highlights — light blue that whispers rather than shouts, used for ghost controls that still need chromatic definition |
| Snow | `#ffffff` | `--color-snow` | Page canvas, card surface, button text on dark fills, badge text — the dominant background |
| Cloud | `#f2f6ff` | `--color-cloud` | Cool-tinted surface for elevated cards, subtle wash behind testimonials, very-light-blue backdrop panels — the cool side of the surface stack |
| Warm Sand | `#fff6ea` | `--color-warm-sand` | Warm-tinted surface for promotional or seasonal highlight cards, sale callout backgrounds — the warm counterpoint to Cloud |
| Silver Mist | `#ccd2d7` | `--color-silver-mist` | Card borders, badge backgrounds, hairline dividers — the structural gray that separates white-on-white layers |
| E6e8e9 | `#e6e8e9` | `--color-e6e8e9` | Navigation dividers, secondary hairline borders — slightly lighter than Silver Mist for less prominent edges |
| Iron Gray | `#808f9c` | `--color-iron-gray` | Muted card borders, secondary borders, de-emphasized card outlines — cool gray with a blue undertone |
| Slate | `#6a7c89` | `--color-slate` | Muted body text, helper text, de-emphasized metadata — readable but clearly secondary to Deep Navy |
| Graphite | `#67727a` | `--color-graphite` | Heading sub-labels, nav secondary text, card meta text — middle gray for informational hierarchy |
| Charcoal | `#262626` | `--color-charcoal` | Icon fills, micro-typography, fine SVG strokes — soft black that never hits pure #000 |
| Spectrum Gradient | `linear-gradient(90deg, rgba(114,77,153,0.05) 0%, rgba(58,61,138,0.05) 17%, rgba(2,175,224,0.05) 35%, rgba(95,183,62,0.05) 51%, rgba(255,237,0,0.05) 67%, rgba(237,116,43,0.05) 83%, rgba(222,39,53,0.05) 100%)` | `--color-spectrum-gradient` | Decorative product-spectrum gradient flowing violet → indigo → cyan → green → yellow → orange → red — used only in hero wash and product card colorways, never on UI chrome |

## Tokens — Typography

### Montserrat — Label, badge-support, and footer-typography family. Used for uppercase labels at 10–12px with wide tracking (0.10–0.13em), and for body copy that needs a geometric neutral tone. The wide letter-spacing on small sizes is the defining move for category labels and section eyebrows. · `--font-montserrat`
- **Substitute:** Montserrat, Work Sans, or Space Grotesk
- **Weights:** 400, 500, 600, 700
- **Sizes:** 10px, 12px, 14px, 15px, 16px, 20px
- **Line height:** 1.14–1.80
- **Letter spacing:** 0.10em at 10px, 0.13em at 12px
- **Role:** Label, badge-support, and footer-typography family. Used for uppercase labels at 10–12px with wide tracking (0.10–0.13em), and for body copy that needs a geometric neutral tone. The wide letter-spacing on small sizes is the defining move for category labels and section eyebrows.

### New Kansas — Primary display and heading family — a custom serif with warmth and editorial credibility. Carries the 36–48px headlines, 20–28px subheads, and 16–20px emphasized body. The serif choice over a geometric sans is the brand's signature typographic decision: it reads apothecary and trustworthy rather than tech-SaaS. Weight 600 is the default for headlines; 500 for italic-feeling emphasis. · `--font-new-kansas`
- **Substitute:** Fraunces, Playfair Display, or DM Serif Display
- **Weights:** 400, 500, 600, 700
- **Sizes:** 14px, 15px, 16px, 18px, 20px, 22px, 24px, 28px, 32px, 36px, 44px, 48px
- **Line height:** 1.00–2.00
- **Letter spacing:** -0.02em at 48px, -0.01em at 24–32px, normal below 20px
- **Role:** Primary display and heading family — a custom serif with warmth and editorial credibility. Carries the 36–48px headlines, 20–28px subheads, and 16–20px emphasized body. The serif choice over a geometric sans is the brand's signature typographic decision: it reads apothecary and trustworthy rather than tech-SaaS. Weight 600 is the default for headlines; 500 for italic-feeling emphasis.

### Inter — UI and body family for cards, navigation, links, and small functional text. Negative letter-spacing tightens at body sizes (-0.022em at 16px, -0.01em at 14px) for a clean, screen-optimized read. Stepping in where New Kansas would feel too editorial — tabs, micro-copy, card metadata. · `--font-inter`
- **Substitute:** Inter, DM Sans, or system-ui
- **Weights:** 400, 500, 600
- **Sizes:** 12px, 13px, 14px, 16px
- **Line height:** 1.00–1.33
- **Letter spacing:** -0.022em at 16px, -0.01em at 14px, -0.008em at 12px
- **Role:** UI and body family for cards, navigation, links, and small functional text. Negative letter-spacing tightens at body sizes (-0.022em at 16px, -0.01em at 14px) for a clean, screen-optimized read. Stepping in where New Kansas would feel too editorial — tabs, micro-copy, card metadata.

### Rift Soft — Exclusive to sale-badge and discount-pill text. A condensed display face with 0.063em tracking that gives promotional copy a stamp-like, authoritative weight. Never used outside discount contexts — this is the badge voice, not the heading voice. · `--font-rift-soft`
- **Substitute:** Bebas Neue, Oswald, or Anton
- **Weights:** 600
- **Sizes:** 16px
- **Line height:** 1.00
- **Letter spacing:** 0.063em
- **OpenType features:** `"ss01" on`
- **Role:** Exclusive to sale-badge and discount-pill text. A condensed display face with 0.063em tracking that gives promotional copy a stamp-like, authoritative weight. Never used outside discount contexts — this is the badge voice, not the heading voice.

### Arial — Arial — detected in extracted data but not described by AI · `--font-arial`
- **Weights:** 400
- **Sizes:** 13px
- **Line height:** 1.2
- **Role:** Arial — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 10px | 1.2 | 1.3px | `--text-caption` |
| label | 12px | 1.2 | 1.56px | `--text-label` |
| body-sm | 14px | 1.43 | -0.14px | `--text-body-sm` |
| body | 16px | 1.5 | -0.35px | `--text-body` |
| body-lg | 20px | 1.5 | -0.1px | `--text-body-lg` |
| subheading | 24px | 1.33 | -0.24px | `--text-subheading` |
| heading-sm | 32px | 1.25 | -0.32px | `--text-heading-sm` |
| heading | 36px | 1.17 | -0.54px | `--text-heading` |
| heading-lg | 44px | 1.14 | -0.88px | `--text-heading-lg` |
| display | 48px | 1.13 | -0.96px | `--text-display` |

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
| 36 | 36px | `--spacing-36` |
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |
| 56 | 56px | `--spacing-56` |
| 64 | 64px | `--spacing-64` |
| 72 | 72px | `--spacing-72` |
| 80 | 80px | `--spacing-80` |
| 128 | 128px | `--spacing-128` |

### Border Radius

| Element | Value |
|---------|-------|
| nav | 12px |
| tags | 3px |
| cards | 8px |
| pills | 20px |
| badges | 3px |
| inputs | 8px |
| buttons | 8px |
| hero-panels | 12px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 48px
- **Card padding:** 16px
- **Element gap:** 16px

## Components

### Primary Filled Button (Shop Patches)
**Role:** Primary CTA — high-contrast navy fill with white text, used once per section for the dominant action

Deep Navy (#021422) background, white (#ffffff) text, 8px border-radius, 18px vertical padding, 24px horizontal padding. New Kansas weight 600, 14–16px, uppercase tracking 0.10em. No shadow. Sits as a solid block — the only filled button in the system.

### Secondary Outlined Button (Shop Now)
**Role:** Secondary action — ghost variant for supporting CTAs

Transparent background, 1px #021422 border, 8px radius, 16–18px padding, Deep Navy text. New Kansas weight 600 at 14px with uppercase 0.10em tracking. Used when a primary filled button already exists on the page.

### Sky Ghost Button
**Role:** Tertiary action — light blue outlined variant for low-emphasis links-as-buttons

Transparent fill, 1px Sky Wash (#91c3ff) border, 8px radius, 14–16px padding, Deep Navy text. Inter weight 500. The chromatic border signals interactivity without competing with the primary CTA.

### Sale Badge (45% OFF)
**Role:** Promotional discount pill overlaid on product cards

Vibrant Green (#00852e) background, white text, 3px border-radius (sharp-cornered rectangle, not pill), 3px vertical / 6px horizontal padding. Rift Soft weight 600, ~10–12px, uppercase 0.063em tracking. Sits top-left of product card. The sharp 3px corner distinguishes badges from all other rounded elements in the system.

### Star Rating Row
**Role:** Social proof indicator — inline with customer count

Five gold star icons (system default gold) at 12px, followed by Inter weight 400 at 13px in Slate (#6a7c89) for the count text. No container — floats inline with surrounding copy.

### Product Card
**Role:** E-commerce product tile in carousels and grids

White surface, 1px Silver Mist (#ccd2d7) border, 8px radius, 16px padding. Image area is the full-bleed colored product (green/blue/red variants). Product name in New Kansas weight 600 at 18px Deep Navy, variant label in Inter 14px Slate, price in New Kansas 16px Deep Navy with strikethrough original in Slate.

### Hero Product Mockup Panel
**Role:** 3D-illustrated product showcase floating in the hero

Stacked colored product boxes (green, dark blue, red, sky blue) with white inner cards, 8px radius on each box, subtle 1px borders. No container — floats directly over the sky-blue gradient hero background.

### Testimonial Chat Bubble
**Role:** Customer review rendered as a chat-message UI element

White fill, 1px Silver Mist border, 16–20px radius (rounded but not pill), 12–16px padding. Inter weight 400 at 14px Deep Navy. Small circular avatar with colored background attached bottom-right. Two bubbles stacked on a Cloud (#f2f6ff) tinted background panel.

### Sticky Cart Notification
**Role:** Bottom-left toast confirming a product was added

White surface, 1px #ccd2d7 border, 8px radius, 12px padding. Contains small green shield icon, Inter 12px body text with linked product name in Vibrant Green. Slides in from left, persists in lower-left corner.

### Top Announcement Bar
**Role:** Sitewide promo strip above the nav

Deep Navy (#021422) background, white text, centered, 8–12px padding. Inter or Montserrat weight 600 at 12–14px, uppercase 0.10em tracking. The only full-bleed dark band on the page.

### Section Header (Our Patches)
**Role:** Large editorial section title

New Kansas weight 600 at 36–44px, Deep Navy (#021422), no eyebrow or subtitle unless paired with a carousel control. Left-aligned, generous space below before the grid begins.

### Nav Header
**Role:** Sticky top navigation bar

White background, 1px #e6e8e9 bottom border, 12px padding vertical. Logo (heart-icon + wordmark) left, nav links center (New Kansas or Inter 14–16px, Deep Navy), account/cart icons right. No drop shadow — a clean hairline separator defines the edge.

### Footer
**Role:** Dark site footer with link columns and social icons

Deep Navy (#021422) background, 40–48px vertical padding, 3–4 column link grid. Column headers in Montserrat 12px Vibrant Green, uppercase 0.10em. Links in Inter 14px white at 60% opacity. Social icons (Instagram, Facebook, TikTok, Pinterest) as white outlined glyphs, right-aligned.

### Circular Stamp Badge
**Role:** Decorative approval/seal element in the 'Feel the Difference' section

White or very-light fill, 1px Deep Navy border, circular shape with text wrapping the circumference (Rift Soft or Montserrat 10–12px uppercase). Centered above section heading, used as a trust-signal device.

## Do's and Don'ts

### Do
- Use Deep Navy (#021422) for all primary filled buttons and primary text — it is the structural ink, not just a dark color
- Use New Kansas for every heading 20px and above; the serif is the brand's editorial signature
- Use 8px border-radius on all cards, buttons, and inputs as the default; only badges break to 3px and only specific decorative elements push to 12px or 20px
- Reserve Vibrant Green (#00852e) exclusively for sale badges, discount pills, and success confirmations — never for body copy or decorative fills
- Use Sky Wash (#91c3ff) as the chromatic border for outlined/ghost controls when a light blue accent is needed
- Keep page chrome near-monochrome; let product imagery and the hero gradient carry all spectrum color
- Use Montserrat with 0.10–0.13em letter-spacing for uppercase category labels and section eyebrows
- Pair the sky-blue gradient hero wash only with product imagery or the hero mockup — never extend it into card or section backgrounds
- Use 16px as the base spacing unit for card padding and element gaps; 48px for section separation
- Use Inter with negative letter-spacing (-0.022em at 16px) for all UI body and link text to maintain screen-readable density

### Don't
- Do not use pure black (#000000) for body text or icons — Deep Navy (#021422) and Charcoal (#262626) are the dark choices
- Do not use the rainbow spectrum gradient on UI chrome, buttons, or non-product surfaces — it belongs only on product cards and the hero wash
- Do not use Rift Soft for anything other than sale-badge and discount-pill text — it is a stamp face, not a body face
- Do not create filled buttons in chromatic colors other than Deep Navy; the only secondary chromatic fill is the green badge
- Do not use shadows for elevation; the design relies on hairline borders (#ccd2d7) and surface tint differences
- Do not use radius values outside the established scale (3, 8, 12, 20, 32px) — consistency is what makes the system feel intentional
- Do not center body copy or card content; left-align text blocks unless the section is a single centered statement
- Do not add more than one filled primary button per viewport — secondary actions must be outlined or ghost variants
- Do not mix New Kansas and Inter at the same size for the same role — New Kansas owns 20px+, Inter owns below
- Do not use Warm Sand (#fff6ea) and Cloud (#f2f6ff) as full-page backgrounds; they are panel-only surface tints

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas | `#ffffff` | Page background — the dominant white that everything else floats on |
| 1 | Cloud | `#f2f6ff` | Cool-tinted panel for testimonial sections, feature callouts, soft elevation without shadow |
| 2 | Warm Sand | `#fff6ea` | Warm-tinted promotional or seasonal card surface — the warm counterpart to Cloud |
| 3 | Cream Highlight | `#ffe9c9` | Accent surface for hero highlights or featured-product callouts (rarely used) |

## Elevation

The design deliberately avoids drop shadows. Depth is constructed through three layered techniques: hairline 1px borders in Silver Mist (#ccd2d7) for card edges, surface tint shifts from white to Cloud (#f2f6ff) or Warm Sand (#fff6ea) for panel separation, and contrast between Deep Navy filled elements and white surfaces. This produces a flat, editorial, apothecary-counter feel where nothing floats — everything sits precisely on a plane. The single detected box-shadow is a 1px tinted hairline (#f2f6ff), not a true elevation effect.

## Imagery

The visual language is dominated by product photography of physical bio-frequency patches rendered as saturated colored boxes — green, sky blue, deep navy, red — each labeled in white serif type on the box face. The hero features a 3D-illustrated mockup of these boxes stacked at angles on white pedestals against a soft sky-blue gradient, creating a product-as-architecture feel. The rainbow spectrum gradient appears as a faint decorative wash in the hero only. Testimonials use small circular avatar illustrations (flat, colored backgrounds, no photo realism). Social proof icons (star rating) are standard gold glyphs. The overall photographic style is high-key, studio-clean, and product-isolated: every object is shot on pure white or pure color, no lifestyle context, no human subjects — the patch is the hero. The sky-blue cloud-textured hero background is the only atmospheric/environmental image in the system.

## Layout

The page model is max-width contained at ~1200px, centered, with the top announcement bar and footer as full-bleed bands. The hero is a split composition: text column left (occupying ~40% width) with a left-aligned headline stack and CTA, and a right-side floating 3D product mockup occupying the remaining ~60% over a sky-blue gradient that extends to the hero container edges. Sections below the hero follow a consistent rhythm: white canvas sections alternate with very-light tinted (Cloud) sections to create visual breathing. Product showcases use horizontal carousels with circular arrow controls top-right. The 'Feel the Difference' section returns to a split layout — centered text + CTA on the left, stacked testimonial chat bubbles on the right against a Cloud-tinted panel. Grids are predominantly 3–4 column card layouts for products. Navigation is a single sticky white bar with hairline bottom border, no mega-menu, no sidebar. Density is comfortable throughout with generous 48px+ section gaps.

## Agent Prompt Guide

Quick Color Reference:
- text (primary): #021422
- background (canvas): #ffffff
- border (hairline): #ccd2d7
- accent: #91c3ff
- sale/badge: #00852e
- primary action: #00852e (filled action)

3-5 Example Component Prompts:

1. Build a hero section on a sky-blue gradient background (#c4e4fb to #f2f6ff). Left column: New Kansas weight 600, 48px, #021422, letter-spacing -0.02em headline. Below it, Inter 16px, #021422 body copy. Below that, a filled navy button (#021422 background, white text, 8px radius, 18px/24px padding, New Kansas 14px uppercase 0.10em). Right column: a floating arrangement of four colored product cards (green #00852e, navy #001f38, red #c43030, sky #4ba3d8) at slight angles, each with a white inner panel.

2. Build a product card: white background, 1px #ccd2d7 border, 8px radius, 16px padding. A Vibrant Green (#00852e) sale badge with 3px radius, Rift Soft 12px uppercase 0.063em, white text sits top-left over the image. Product name in New Kansas 18px weight 600 #021422. Variant label in Inter 14px #6a7c89. Price in New Kansas 16px #021422 with strikethrough original in #6a7c89.

3. Build a testimonial panel: #f2f6ff background, 20px radius, 24px padding. Two stacked white chat bubbles with 1px #ccd2d7 border, 16px radius, 16px padding, Inter 14px #021422 body text. Each bubble has a small circular avatar (32px, solid colored background) bottom-right.

4. Build the sticky cart notification: white surface, 1px #ccd2d7 border, 8px radius, 12px padding. Green shield icon (16px) on the left, then Inter 12px text with the product name linked in #00852e. Positioned fixed bottom-left.

5. Build a footer: #021422 background, 48px vertical padding, 4-column grid. Column headers in Montserrat 12px #00852e uppercase 0.13em. Links in Inter 14px white at 60% opacity, 8px row gap. Social icons (Instagram, Facebook, TikTok, Pinterest) as white 20px outlined glyphs in the rightmost column.

## Gradient System

Two gradient families coexist but serve different purposes. The spectrum gradient (violet → indigo → cyan → green → yellow → orange → red at 5% opacity) appears exclusively in the hero as a faint atmospheric wash — it signals the product range's chromatic variety without ever overwhelming. The striped diagonal gradients (white-to-gray and #021422 alternating 6–8px bands) are decorative stripe patterns used as small accent details, not as backgrounds. A third sky-gradient (light blue #c4e4fb fading to white) appears behind the hero product mockup. No gradient should be applied to UI chrome, buttons, cards, or section backgrounds.

## Iconography & Glyphs

Icons are minimal and functional: line-based, 1.5px stroke, Deep Navy (#021422) or white-on-dark fill, at 16–20px sizes. The brand mark combines a stylized heart glyph with the wordmark 'Vibrants'. Social icons (Instagram, Facebook, TikTok, Pinterest) are standard platform glyphs rendered as white outlines on the dark footer. Star icons for ratings use default gold (#f5b500 range) at 12px. The circular stamp badge in the 'Feel the Difference' section uses a ring of text following a circular path, rendered in Rift Soft or Montserrat 10–12px uppercase. No icon set dominates — the system is restrained, using icons only where they carry functional weight (cart, account, navigation arrows, social platforms).

## Similar Brands

- **Hims** — Same clinical-wellness visual register — light canvas, deep-navy ink for primary text and CTAs, and a single chromatic accent (green) reserved for promotional badges and confirmations
- **Athletic Greens / AG1** — Editorial serif headlines paired with a clean white surface, narrow palette that lets product imagery carry all color, and uppercase tracked labels for section eyebrows
- **Ritual** — Minimalist supplement-brand language with a near-monochrome chrome, hairline borders, soft 8px corners, and a product carousel pattern that puts the colored product as the only chromatic element on each card
- **Care/of** — Warm-meets-clinical wellness feel: light page with occasional cool tinted surface panels, serif display type, and restrained use of green for trust/sale signals

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-deep-navy: #021422;
  --color-vibrant-green: #00852e;
  --color-midnight-navy: #001f38;
  --color-sky-wash: #91c3ff;
  --color-snow: #ffffff;
  --color-cloud: #f2f6ff;
  --color-warm-sand: #fff6ea;
  --color-silver-mist: #ccd2d7;
  --color-e6e8e9: #e6e8e9;
  --color-iron-gray: #808f9c;
  --color-slate: #6a7c89;
  --color-graphite: #67727a;
  --color-charcoal: #262626;
  --color-spectrum-gradient: #724d99;
  --gradient-spectrum-gradient: linear-gradient(90deg, rgba(114,77,153,0.05) 0%, rgba(58,61,138,0.05) 17%, rgba(2,175,224,0.05) 35%, rgba(95,183,62,0.05) 51%, rgba(255,237,0,0.05) 67%, rgba(237,116,43,0.05) 83%, rgba(222,39,53,0.05) 100%);

  /* Typography — Font Families */
  --font-montserrat: 'Montserrat', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-new-kansas: 'New Kansas', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-rift-soft: 'Rift Soft', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-arial: 'Arial', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.2;
  --tracking-caption: 1.3px;
  --text-label: 12px;
  --leading-label: 1.2;
  --tracking-label: 1.56px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.43;
  --tracking-body-sm: -0.14px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.35px;
  --text-body-lg: 20px;
  --leading-body-lg: 1.5;
  --tracking-body-lg: -0.1px;
  --text-subheading: 24px;
  --leading-subheading: 1.33;
  --tracking-subheading: -0.24px;
  --text-heading-sm: 32px;
  --leading-heading-sm: 1.25;
  --tracking-heading-sm: -0.32px;
  --text-heading: 36px;
  --leading-heading: 1.17;
  --tracking-heading: -0.54px;
  --text-heading-lg: 44px;
  --leading-heading-lg: 1.14;
  --tracking-heading-lg: -0.88px;
  --text-display: 48px;
  --leading-display: 1.13;
  --tracking-display: -0.96px;

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
  --spacing-36: 36px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-56: 56px;
  --spacing-64: 64px;
  --spacing-72: 72px;
  --spacing-80: 80px;
  --spacing-128: 128px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 48px;
  --card-padding: 16px;
  --element-gap: 16px;

  /* Border Radius */
  --radius-sm: 3px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-2xl-2: 20px;
  --radius-3xl: 32px;
  --radius-full: 50px;

  /* Named Radii */
  --radius-nav: 12px;
  --radius-tags: 3px;
  --radius-cards: 8px;
  --radius-pills: 20px;
  --radius-badges: 3px;
  --radius-inputs: 8px;
  --radius-buttons: 8px;
  --radius-hero-panels: 12px;

  /* Surfaces */
  --surface-canvas: #ffffff;
  --surface-cloud: #f2f6ff;
  --surface-warm-sand: #fff6ea;
  --surface-cream-highlight: #ffe9c9;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-deep-navy: #021422;
  --color-vibrant-green: #00852e;
  --color-midnight-navy: #001f38;
  --color-sky-wash: #91c3ff;
  --color-snow: #ffffff;
  --color-cloud: #f2f6ff;
  --color-warm-sand: #fff6ea;
  --color-silver-mist: #ccd2d7;
  --color-e6e8e9: #e6e8e9;
  --color-iron-gray: #808f9c;
  --color-slate: #6a7c89;
  --color-graphite: #67727a;
  --color-charcoal: #262626;
  --color-spectrum-gradient: #724d99;

  /* Typography */
  --font-montserrat: 'Montserrat', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-new-kansas: 'New Kansas', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-rift-soft: 'Rift Soft', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-arial: 'Arial', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.2;
  --tracking-caption: 1.3px;
  --text-label: 12px;
  --leading-label: 1.2;
  --tracking-label: 1.56px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.43;
  --tracking-body-sm: -0.14px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.35px;
  --text-body-lg: 20px;
  --leading-body-lg: 1.5;
  --tracking-body-lg: -0.1px;
  --text-subheading: 24px;
  --leading-subheading: 1.33;
  --tracking-subheading: -0.24px;
  --text-heading-sm: 32px;
  --leading-heading-sm: 1.25;
  --tracking-heading-sm: -0.32px;
  --text-heading: 36px;
  --leading-heading: 1.17;
  --tracking-heading: -0.54px;
  --text-heading-lg: 44px;
  --leading-heading-lg: 1.14;
  --tracking-heading-lg: -0.88px;
  --text-display: 48px;
  --leading-display: 1.13;
  --tracking-display: -0.96px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-28: 28px;
  --spacing-32: 32px;
  --spacing-36: 36px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-56: 56px;
  --spacing-64: 64px;
  --spacing-72: 72px;
  --spacing-80: 80px;
  --spacing-128: 128px;

  /* Border Radius */
  --radius-sm: 3px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-2xl-2: 20px;
  --radius-3xl: 32px;
  --radius-full: 50px;
}
```
