# Redbrick Coffee — Style Reference
> Scarlet ink editorial on butcher paper

**Theme:** light

Redbrick is an editorial coffee storefront printed in scarlet ink on warm white pages. The system is defined by a single aggressive red (#e82c2a) that saturates every interactive surface — logo, nav text, section labels, borders, arrows, and the announcement bar — while the page canvas stays creamy white and cards sit on soft #f2f2f2 surfaces. Display headlines are a weight-300 didone-adjacent serif (Editorial Old) at extraordinary sizes (100–150px) with near-1.0 line-height, letting the letterforms breathe without bold weight. Body and UI copy use a humanist sans (Surt) with consistent positive tracking, giving even short labels a printed, typeset quality. Photography is overhead lifestyle — wooden tables, open books, espresso machines, hands cradling cups — warm and editorial rather than glossy e-commerce. Layout alternates half-width image and text blocks, anchored by tiny uppercase section labels and right-aligned arrow links that behave like magazine running heads.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Brick Red | `#e82c2a` | `--color-brick-red` | Red accent for outlined action borders, linked labels, and lightweight interactive emphasis. Do not promote it to the primary CTA color |
| Press Black | `#212529` | `--color-press-black` | Primary body and paragraph text, hero supporting text, and darkest surface accents where deeper contrast than white-on-red is needed |
| Cream White | `#ffffff` | `--color-cream-white` | Page canvas, image backgrounds, nav fill, and card surface base — the warm white that makes Brick Red feel printed rather than digital |
| Soft Grey | `#f2f2f2` | `--color-soft-grey` | Product card surface and elevated panels, one subtle step below the white canvas to separate scrolled content blocks |
| Carbon | `#121212` | `--color-carbon` | Dark anchor for footer, inverse panels, and the few dark-on-light UI elements that need more weight than Press Black provides |

## Tokens — Typography

### Surt — Body, nav links, buttons, card labels, and all functional UI. Positive tracking (0.013–0.05em) is consistent across sizes, giving the type a typeset, slightly old-style feel that pairs with the editorial display serif. Replaces body and UI text at every level. · `--font-surt`
- **Substitute:** Söhne, Inter, or Untitled Sans
- **Weights:** 400
- **Sizes:** 15px, 20px, 30px, 35px
- **Line height:** 1.00–1.50
- **Letter spacing:** 0.013em at 15px, 0.017em at 20px, 0.03em at 30px, 0.04em at 35px
- **Role:** Body, nav links, buttons, card labels, and all functional UI. Positive tracking (0.013–0.05em) is consistent across sizes, giving the type a typeset, slightly old-style feel that pairs with the editorial display serif. Replaces body and UI text at every level.

### Editorial Old — Display headlines only. The weight-300 thin serif at 100–150px with ~1.0 line-height is the signature — anti-convention, never bold, letting the letterforms carry the page rather than weight. Enable 'clig' and 'liga' for contextual alternates. · `--font-editorial-old`
- **Substitute:** Playfair Display, GT Super, or PP Editorial Old (paid)
- **Weights:** 300
- **Sizes:** 100px, 105px, 150px
- **Line height:** 0.99–1.20
- **Letter spacing:** near-zero (-0.005em to 0.006em)
- **OpenType features:** `"clig" on, "liga" on`
- **Role:** Display headlines only. The weight-300 thin serif at 100–150px with ~1.0 line-height is the signature — anti-convention, never bold, letting the letterforms carry the page rather than weight. Enable 'clig' and 'liga' for contextual alternates.

### GTStandard-M — Micro-labels and uppercase taglines (e.g. 'For Coffee Drinkers' banner). Tight 10px with 0.06em tracking mimics letterpress taglines. · `--font-gtstandard-m`
- **Substitute:** GT Standard Mono, JetBrains Mono, or system-ui mono
- **Weights:** 400
- **Sizes:** 10px
- **Line height:** 1.50
- **Letter spacing:** 0.0600em
- **Role:** Micro-labels and uppercase taglines (e.g. 'For Coffee Drinkers' banner). Tight 10px with 0.06em tracking mimics letterpress taglines.

### system-ui — system-ui — detected in extracted data but not described by AI · `--font-system-ui`
- **Weights:** 400
- **Sizes:** 10px
- **Line height:** 1.5
- **Letter spacing:** 0.06
- **Role:** system-ui — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 10px | 1.5 | 0.6px | `--text-caption` |
| body-sm | 15px | 1.5 | 0.195px | `--text-body-sm` |
| body | 20px | 1.3 | 0.34px | `--text-body` |
| subheading | 30px | 1.2 | 0.9px | `--text-subheading` |
| heading-sm | 35px | 1.2 | 1.4px | `--text-heading-sm` |
| display | 100px | 0.99 | -0.5px | `--text-display` |
| display-lg | 150px | 1.1 | 0.9px | `--text-display-lg` |

## Tokens — Spacing & Shapes

**Density:** compact

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 5 | 5px | `--spacing-5` |
| 8 | 8px | `--spacing-8` |
| 10 | 10px | `--spacing-10` |
| 12 | 12px | `--spacing-12` |
| 15 | 15px | `--spacing-15` |
| 20 | 20px | `--spacing-20` |
| 30 | 30px | `--spacing-30` |
| 50 | 50px | `--spacing-50` |
| 117 | 117px | `--spacing-117` |
| 234 | 234px | `--spacing-234` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 25px |
| links | 3.75px |
| images | 25px |
| inputs | 50px |
| buttons | 50px |

### Layout

- **Section gap:** 50px
- **Card padding:** 30px
- **Element gap:** 10px

## Components

### Announcement Bar
**Role:** Full-width top banner

Full-bleed #e82c2a background spanning the viewport edge-to-edge. Center-aligned tagline in 10px GTStandard-M white text with 0.06em tracking. Right side holds secondary nav links (About, Wholesale, Office Coffee, Contact) in same micro type. Height ~30px. Acts as a red frame that bleeds into the logo and nav below.

### Brick Logo Mark + Wordmark
**Role:** Brand identity in header

A small 3D red house/brick icon paired with 'REDBRICK' in Surt 400, ~20px, 0.017em tracking, all #e82c2a. The icon and wordmark are vertically aligned, left-padded from the viewport edge with ~30px. The red is the same Brick Red as everything else — no logo-specific variant.

### Primary Nav Link
**Role:** Top-level navigation items

Surt 400, ~15px, 0.013em tracking, color #e82c2a. Horizontal list spaced ~30px apart. No underline by default, no background. On hover, color stays red (no color shift) — the only state change is opacity. No dropdowns in the primary tier.

### Secondary Nav Row
**Role:** Sub-category navigation strip

Horizontal list of product categories (Coffee Coffee, Good Day, Rogue Coffee, Dark Coffee, Decaf Coffee) in Surt 400 ~15px #e82c2a, separated by ~30px padding. Sits below primary nav, separated by a 1px #e82c2a rule.

### Editorial Display Headline
**Role:** Hero and section headlines

Editorial Old weight 300, 100–150px, line-height ~1.0, color #e82c2a. Sits as the left column in a 50/50 image+text split. Never bold, never condensed. Allows the letterforms to dominate the viewport — the thin weight is the anti-statement that becomes the statement.

### Section Label
**Role:** Magazine-style running head for content blocks

Tiny 10px uppercase-style label in Surt 400, color #e82c2a, 0.06em tracking. Sits flush left at the top of a content section, above a 1px red rule, paired with a right-aligned 'Shop blends →' arrow link at the same size.

### Arrow Link
**Role:** Editorial cross-link with directional indicator

10–15px Surt 400 #e82c2a, right-aligned, with a thin '→' or '⟶' arrow character after the label. 3.75px border-radius (effectively a thin underline). Used to navigate between collections, e.g. 'Shop blends →', 'Stock up →', 'Enquire →'.

### Product Card
**Role:** Blend and single-serve product tiles

Rounded card with 25px border-radius, #f2f2f2 background fill, and 30px padding all sides. Contains a centered product package image (bag or sachet) on a pastel or colored background. Below the image sits a product name in Surt 400 20px #212529 and small descriptors. No drop shadow — the 25px radius does the work of separation.

### Lifestyle Image Block
**Role:** Full-bleed hero photography

Rounded 25px radius, full-bleed within its grid column. Photography is overhead or waist-level, warm-toned, featuring coffee on wooden tables, books, magazines, espresso machines, and hands. No overlays, no text on image — the image is a stand-alone visual paragraph.

### Split Text Block
**Role:** Companion copy for an image block

Right or left column of a 50/50 split. Contains the Editorial Old display headline (already specified) followed by a 20px Surt 400 #212529 paragraph at 1.3 line-height, max-width ~480px. Whitespace above and below the text is generous (~50px) to let the serif breathe.

### Outlined Action Link
**Role:** Ghost-style CTA inside content blocks

Ghost/outlined action in 1px #e82c2a border, 3.75px radius, 10–15px Surt 400 #e82c2a text, 10px vertical / 20px horizontal padding. No fill. Functions as the system's primary action style — no filled buttons exist in this system.

### Footer Mini-Nav
**Role:** Bottom utility links

Horizontal list in Surt 400 15px #e82c2a, separated by ~30px padding, sits at the foot of a dark (#121212) or light panel. No icons, no grouping — just inline text links.

## Do's and Don'ts

### Do
- Use Brick Red #e82c2a for every interactive text element, every section label, and every outlined action — the system is monochrome with a single chromatic thread.
- Set display headlines in Editorial Old weight 300 at 100–150px with line-height ~1.0; never bold, never weight 400+.
- Apply consistent positive tracking to Surt: 0.013em at 15px, 0.017em at 20px, 0.03em at 30px, 0.04em at 35px, 0.06em at 10px labels.
- Use 25px border-radius for all cards and image blocks; 50px for pill buttons and inputs; 3.75px for inline text links.
- Pair every image block with a text block in a 50/50 split — the system is editorial, not full-bleed spectacle.
- Use 10px GTStandard-M with 0.06em tracking for running heads, announcement text, and arrow links — never a larger size for utility labels.
- Keep product cards on a #f2f2f2 surface with 30px padding; no drop shadows, let the 25px radius do the elevation work.

### Don't
- Do not introduce a filled (solid background) button style — Redbrick's only action surface is the outlined chromatic link.
- Do not bold the display headline; weight 300 thin serif IS the hierarchy, increasing weight destroys the brand.
- Do not add a second brand color; the system is red-on-cream, not multi-color.
- Do not use drop shadows on cards or images; elevation is expressed by 25px radius and the #f2f2f2 surface shift.
- Do not center the display headline in narrow columns — it belongs in a wide left/right split with generous left padding.
- Do not place white text directly on the #f2c2f2 surface (low contrast) or on the announcement bar with anything other than pure white.
- Do not use stock product-on-white e-commerce photography; imagery must be warm overhead lifestyle with wooden surfaces, books, and hands.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Cream White Canvas | `#ffffff` | Page base background for all sections and the dominant reading surface |
| 1 | Soft Grey Card | `#f2f2f2` | Product card and content block surface, one tonal step below the canvas |
| 2 | Brick Red Panel | `#e82c2a` | Top announcement bar and occasional full-width red bands |
| 3 | Carbon Panel | `#121212` | Dark footer and inverse panels |

## Elevation

The system avoids drop shadows entirely. Elevation is communicated through (1) the 25px border-radius on cards and images, (2) the one-step surface shift from #ffffff canvas to #f2f2f2 card, and (3) the full-bleed red band as a chromatic divider. Shadows would read as e-commerce convention and undermine the editorial identity.

## Imagery

Photography is warm overhead lifestyle — wooden tables, open books, magazines, espresso machines, hands cradling cups. Shots are tightly cropped and feel like magazine spreads. Product packaging is shown on pastel or branded colored backgrounds within the card frame. There is no white-cyc product photography, no studio lighting, no model shots — the coffee and its context are the hero. Color treatment is warm and slightly desaturated, leaning into amber and cream tones that harmonize with the Brick Red and cream-white palette.

## Layout

Full-bleed sections with edge-to-edge content; the canvas is unconstrained horizontally. The dominant pattern is a 50/50 split of lifestyle image and editorial text, alternating left/right as the user scrolls. Section rhythm is marked by tiny uppercase red labels with a hairline rule and a right-aligned 'Shop blends →' arrow link — like magazine running heads. The top of the page has a full-width red announcement bar, then a white nav strip, then a hero split. A product card row (4–5 cards) appears at major intervals. A secondary sub-nav row sits between the primary nav and the hero. The page feels like a printed broadsheet, not a typical online store.

## Agent Prompt Guide

Quick Color Reference:
- text: #212529 (Press Black for body), #e82c2a (Brick Red for interactive/headlines), #ffffff (Cream White for canvas)
- background: #ffffff canvas, #f2f2f2 card surface, #e82c2a red band, #121212 dark panel
- border: #e82c2a at 1px for rules, section dividers, and outlined actions
- accent: #e82c2a is the single accent — used for logo, nav, labels, arrows, display headlines
- primary action: #e82c2a (outlined action border)

3–5 Example Component Prompts:

1. Create a hero section in the Redbrick style: full-bleed white background. Left half holds an Editorial Old weight 300 headline at 100px line-height 1.0 in #e82c2a, tracking -0.5px. Below the headline, a 20px Surt weight 400 paragraph in #212529, max-width 480px, line-height 1.3, tracking 0.017em. Right half holds a rounded-25px lifestyle image of a coffee cup on a wooden table.

2. Create a product blend card grid: 4 cards in a row on #f2f2f2 surface, 25px radius, 30px padding. Each card has a centered product bag image, a 20px Surt 400 product name in #212529 below (tracking 0.017em), and tiny 10px Surt 400 #e82c2a descriptor text (tracking 0.06em). No drop shadow.

3. Create a section divider with running head: a 1px #e82c2a hairline rule, a 10px Surt 400 #e82c2a section label left-aligned above the rule (tracking 0.06em), and a right-aligned 'Shop blends →' arrow link in the same type, using the 3.75px radius underlined link style.

4. Create an outlined action link: 1px #e82c2a border, 3.75px border-radius, 10px vertical and 20px horizontal padding, text is 15px Surt 400 #e82c2a (tracking 0.013em). No fill, no shadow. Reads as the primary interactive surface in this system.

5. Create the top announcement bar: full-bleed #e82c2a background, ~30px tall, centered 10px GTStandard-M white text at 0.06em tracking. Right side holds About / Wholesale / Office Coffee / Contact as the same white micro-type, evenly spaced.

## Similar Brands

- **Aesop** — Same editorial typography pairing — thin serif display + tracked sans body — and a single restrained color thread throughout the interface.
- **Goop** — Magazine-spread layout language with alternating image+text splits, serif display headlines at huge sizes, and tiny tracked section labels.
- **Blue Bottle Coffee** — Same coffee brand restraint — generous whitespace, warm lifestyle photography, and editorial section rhythm over product-grid density.
- **Fellow Products** — Same thin-serif-at-scale display treatment paired with a clean humanist sans for body, and warm product photography on neutral surfaces.
- **MoMA Design Store** — Same full-bleed editorial storefront — image-led halves, hairline section rules, and arrow-link navigation that reads like a print catalog.

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-brick-red: #e82c2a;
  --color-press-black: #212529;
  --color-cream-white: #ffffff;
  --color-soft-grey: #f2f2f2;
  --color-carbon: #121212;

  /* Typography — Font Families */
  --font-surt: 'Surt', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-editorial-old: 'Editorial Old', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-gtstandard-m: 'GTStandard-M', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-system-ui: 'system-ui', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.5;
  --tracking-caption: 0.6px;
  --text-body-sm: 15px;
  --leading-body-sm: 1.5;
  --tracking-body-sm: 0.195px;
  --text-body: 20px;
  --leading-body: 1.3;
  --tracking-body: 0.34px;
  --text-subheading: 30px;
  --leading-subheading: 1.2;
  --tracking-subheading: 0.9px;
  --text-heading-sm: 35px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: 1.4px;
  --text-display: 100px;
  --leading-display: 0.99;
  --tracking-display: -0.5px;
  --text-display-lg: 150px;
  --leading-display-lg: 1.1;
  --tracking-display-lg: 0.9px;

  /* Typography — Weights */
  --font-weight-light: 300;
  --font-weight-regular: 400;

  /* Spacing */
  --spacing-5: 5px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-15: 15px;
  --spacing-20: 20px;
  --spacing-30: 30px;
  --spacing-50: 50px;
  --spacing-117: 117px;
  --spacing-234: 234px;

  /* Layout */
  --section-gap: 50px;
  --card-padding: 30px;
  --element-gap: 10px;

  /* Border Radius */
  --radius-md: 3.75px;
  --radius-3xl: 25px;
  --radius-full: 50px;

  /* Named Radii */
  --radius-cards: 25px;
  --radius-links: 3.75px;
  --radius-images: 25px;
  --radius-inputs: 50px;
  --radius-buttons: 50px;

  /* Surfaces */
  --surface-cream-white-canvas: #ffffff;
  --surface-soft-grey-card: #f2f2f2;
  --surface-brick-red-panel: #e82c2a;
  --surface-carbon-panel: #121212;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-brick-red: #e82c2a;
  --color-press-black: #212529;
  --color-cream-white: #ffffff;
  --color-soft-grey: #f2f2f2;
  --color-carbon: #121212;

  /* Typography */
  --font-surt: 'Surt', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-editorial-old: 'Editorial Old', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-gtstandard-m: 'GTStandard-M', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-system-ui: 'system-ui', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.5;
  --tracking-caption: 0.6px;
  --text-body-sm: 15px;
  --leading-body-sm: 1.5;
  --tracking-body-sm: 0.195px;
  --text-body: 20px;
  --leading-body: 1.3;
  --tracking-body: 0.34px;
  --text-subheading: 30px;
  --leading-subheading: 1.2;
  --tracking-subheading: 0.9px;
  --text-heading-sm: 35px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: 1.4px;
  --text-display: 100px;
  --leading-display: 0.99;
  --tracking-display: -0.5px;
  --text-display-lg: 150px;
  --leading-display-lg: 1.1;
  --tracking-display-lg: 0.9px;

  /* Spacing */
  --spacing-5: 5px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-15: 15px;
  --spacing-20: 20px;
  --spacing-30: 30px;
  --spacing-50: 50px;
  --spacing-117: 117px;
  --spacing-234: 234px;

  /* Border Radius */
  --radius-md: 3.75px;
  --radius-3xl: 25px;
  --radius-full: 50px;
}
```
