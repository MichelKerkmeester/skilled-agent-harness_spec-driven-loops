# Glossier — Style Reference
> Sunlit beauty editorial — paper white, ink black, one flash of yellow

**Theme:** light

Glossier operates as a digital beauty magazine: a near-monochrome canvas of paper-white and ink-black, disrupted by one electric yellow accent that functions as both the brand wordmark and the singular call to action. The system is editorial in restraint — huge Apercu headlines, generous breathing room, full-bleed lifestyle photography that carries most of the emotional weight — and utilitarian in execution, with flat product cards, hairline borders, and zero decorative ornament. The yellow is not a secondary brand color; it IS the brand, deployed sparingly so each appearance feels like a flashbulb. Everything else must recede: neutrals are warm grays with a faint blush undertone, borders are barely-there, type is tight and compressed. The result is a storefront that reads as confident, understated, and unapologetically modern.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Glossier Yellow | `#fff116` | `--color-glossier-yellow` | Yellow supporting accent for decorative details and low-frequency emphasis. Do not promote it to the primary CTA color |
| Ink | `#000000` | `--color-ink` | Primary text, nav links, body copy, footer text, icon strokes, hairline borders; the dominant typographic and structural color |
| Paper | `#ffffff` | `--color-paper` | Product card surfaces, input fills, elevated panels; the brightest surface level in the stack |
| Fog | `#f7f7f7` | `--color-fog` | Page canvas, section backgrounds, image-to-page transitions; the base surface the entire site sits on |
| Blush | `#faf2f4` | `--color-blush` | Footer background, soft warm section breaks; a barely-perceptible pink-tinted off-white that adds warmth to the bottom of pages |
| Mist | `#f0f0f0` | `--color-mist` | Light supporting surface for subtle backgrounds and section separation. Do not promote it to the primary CTA color |
| Ash | `#e8e8e8` | `--color-ash` | Input borders, badge backgrounds, hairline dividers; the structural border color for cards and form elements |
| Graphite | `#666666` | `--color-graphite` | Secondary text, helper copy, muted labels, form placeholder text; the only mid-gray for typographic hierarchy |
| Slate | `#464545` | `--color-slate` | Product list and card swatch fills; the darkest functional gray for catalog imagery placeholders |
| Cobalt Tag | `#0600ff` | `--color-cobalt-tag` | Violet supporting accent for decorative details and low-frequency emphasis |

## Tokens — Typography

### Apercu — Primary typeface across all UI — body at 16px/400, navigation and labels at 12–14px/500, subheadings at 20px/500, editorial headlines at 32px/700. Apercu's geometric humanist construction gives the brand its compressed, contemporary voice; the near-zero letter-spacing (0.002–0.003em) keeps type tight and magazine-like rather than airy or friendly. Weight 700 is reserved for editorial display moments, not UI chrome. · `--font-apercu`
- **Substitute:** Inter, Suisse Int'l, or Söhne
- **Weights:** 400, 500, 700
- **Sizes:** 12, 14, 16, 20, 32
- **Line height:** 1.00–1.70
- **Letter spacing:** 0.0020em to 0.0030em at body sizes; 0.0400em on small caps/eyebrow labels
- **Role:** Primary typeface across all UI — body at 16px/400, navigation and labels at 12–14px/500, subheadings at 20px/500, editorial headlines at 32px/700. Apercu's geometric humanist construction gives the brand its compressed, contemporary voice; the near-zero letter-spacing (0.002–0.003em) keeps type tight and magazine-like rather than airy or friendly. Weight 700 is reserved for editorial display moments, not UI chrome.

### Apercu Mono — Micro-utility typography for order metadata, tracking numbers, and code-adjacent labels; the monospaced cousin creates technical texture against the proportional body face · `--font-apercu-mono`
- **Substitute:** JetBrains Mono or IBM Plex Mono
- **Weights:** 400
- **Sizes:** 12
- **Line height:** 1.40
- **Role:** Micro-utility typography for order metadata, tracking numbers, and code-adjacent labels; the monospaced cousin creates technical texture against the proportional body face

### GTStandard-M — GTStandard-M — detected in extracted data but not described by AI · `--font-gtstandard-m`
- **Weights:** 400
- **Sizes:** 16px
- **Line height:** 1.5
- **Role:** GTStandard-M — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.4 | 0.48px | `--text-caption` |
| body-sm | 14px | 1.43 | — | `--text-body-sm` |
| body | 16px | 1.5 | — | `--text-body` |
| subheading | 20px | 1.3 | -0.06px | `--text-subheading` |
| heading | 32px | 1.2 | -0.1px | `--text-heading` |

## Tokens — Spacing & Shapes

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 5 | 5px | `--spacing-5` |
| 6 | 6px | `--spacing-6` |
| 7 | 7px | `--spacing-7` |
| 8 | 8px | `--spacing-8` |
| 9 | 9px | `--spacing-9` |
| 10 | 10px | `--spacing-10` |
| 11 | 11px | `--spacing-11` |
| 14 | 14px | `--spacing-14` |
| 15 | 15px | `--spacing-15` |
| 16 | 16px | `--spacing-16` |
| 20 | 20px | `--spacing-20` |
| 32 | 32px | `--spacing-32` |
| 34 | 34px | `--spacing-34` |
| 40 | 40px | `--spacing-40` |
| 41 | 41px | `--spacing-41` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 0px |
| badges | 0px |
| inputs | 0px |
| buttons | 0px |

### Layout

- **Page max-width:** 1440px
- **Section gap:** 64px
- **Card padding:** 24px
- **Element gap:** 8px

## Components

### Yellow Primary Button
**Role:** The sole call-to-action style across the site

Filled #fff116 background, #000000 text in Apercu 14px/500, uppercase tracking at 0.04em, 0px border-radius, padding 12px 24px, no shadow. This button is the loudest thing on any page and must be used sparingly — one per viewport maximum.

### Ghost Text Link
**Role:** Default inline and navigation links

No background, #000000 text in Apercu 14–16px/400, underline appears on hover only. Inherits color from parent when nested in muted contexts.

### Outlined Secondary Button
**Role:** Secondary actions like 'Choose set' on product cards

Transparent background, 1px solid #000000 border, #000000 text in Apercu 14px/500, 0px radius, full-width within card, padding 14px 16px. Sits below the product card as a full-width action strip.

### Product Card
**Role:** Catalog item in grid views

#ffffff background, 0px border-radius, no shadow. Product image fills the card top with 1:1 or 4:5 aspect ratio. Below image: product name in Apercu 16px/500 #000000, short descriptor in 14px/400 #666666, price in 16px/500 #000000. No card border — whitespace separates cards from the #f7f7f7 page background.

### NEW Badge
**Role:** Editorial product tag

Solid #0600ff background, white text in Apercu 12px/700 uppercase, 0px radius, 4px 8px padding. Positioned top-left of product images.

### Utility Announcement Bar
**Role:** Site-wide promotional strip

Full-bleed #000000 background, #ffffff text in Apercu 12px/400, centered, 1px paddingTop and paddingBottom. Houses shipping announcements and promotional copy.

### Top Navigation
**Role:** Primary site navigation

White background, #000000 logo in Apercu bold (left), horizontal category links in Apercu 12px/500 uppercase (center), utility icons and account links (right). Sticky on scroll, 0px radius, 1px solid #e8e8e8 bottom border on scroll.

### Hero Overlay Card
**Role:** Contextual product callout over hero imagery

White background card with no border or radius, floating top-left over a full-bleed lifestyle photograph. Contains eyebrow label (Apercu 12px/500 uppercase), headline (20–32px/700), body copy (14px/400 #666666), and yellow CTA button. Creates editorial magazine cover energy.

### Text Input
**Role:** Form fields for email, search, checkout

#ffffff background, 1px solid #e8e8e8 border, 0px radius, padding 12px 16px, Apercu 14px/400 #000000 text. Placeholder in #666666. Focus state thickens border to 2px solid #000000.

### Full-Bleed Image Section
**Role:** Lifestyle and atmospheric photography blocks

Edge-to-edge photograph, no padding, no border. The Glossier wordmark in #fff116 Apercu 700 overlays at massive scale (200px+), often bleeding off-screen edges for editorial drama.

### Two-Column Image Split
**Role:** Side-by-side category navigation blocks

Two 50/50 panels, each a full-bleed photograph with a white text card centered: eyebrow label in Apercu 12px/500 uppercase, CTA in 14px/500. Separates skincare from makeup categories with no visible border — only the image seam.

### Footer
**Role:** Site footer with navigation, newsletter, legal

#faf2f4 warm blush background, 0px radius, generous 64px top padding. Apercu 14px/400 #000000 link lists in 4-column grid, newsletter signup inline, copyright in 12px/400 #666666.

## Do's and Don'ts

### Do
- Use #fff116 exclusively for the primary action button and the brand wordmark — never as a background, border, or text color elsewhere
- Maintain the 0px border-radius across all components — cards, buttons, badges, and inputs must remain sharp-edged
- Set body text at 16px/400 in Apercu with 0.002–0.003em letter-spacing; reserve 32px/700 for editorial display headlines only
- Use full-bleed lifestyle photography as the primary visual element; the page background #f7f7f7 should be visible only at section edges and around card grids
- Keep product cards on pure #ffffff with no borders or shadows — let whitespace and the #f7f7f7 canvas create separation
- Uppercase Apercu 12px/500 with 0.04em tracking for all eyebrow labels, category names, and nav items
- Use #0600ff Cobalt only for NEW or status badges — never as a CTA, link, or decorative accent

### Don't
- Don't introduce rounded corners, drop shadows, or gradients — the system is deliberately flat and sharp
- Don't use #fff116 as a hover state, border, or background fill for non-button elements — it dilutes the primary action's power
- Don't use color to create typographic hierarchy — rely on Apercu weight (400/500/700) and size steps instead
- Don't add borders or backgrounds to product cards; the #ffffff surface against #f7f7f7 canvas provides all needed separation
- Don't use #666666 for primary text; reserve it for helper copy, metadata, and placeholders only
- Don't center-align body copy or product descriptions — left-align everything except hero display type and section intros
- Don't use more than one yellow element per viewport; the accent's power depends on its scarcity

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Page Canvas | `#f7f7f7` | Base background for the entire site; visible behind product grids, between sections, and as the default body color |
| 1 | Product Card | `#ffffff` | Elevated surface for catalog items and content blocks; sits one step above the canvas without borders or shadows |
| 2 | Footer | `#faf2f4` | Warm blush-tinted surface for the footer; adds subtle color temperature shift at the page bottom |
| 3 | Accent | `#fff116` | Brand signal surface — appears only as the CTA button fill and the wordmark, never as a sustained background |

## Imagery

Photography is the dominant visual language. Full-bleed lifestyle and portrait images fill the viewport — warm golden-hour backlighting, soft skin close-ups, hands holding product bottles against sun flares. The color palette within photography is warm and desaturated: peach skies, terracotta skin tones, deep ocean blues. Images are always edge-to-edge with no rounded corners, no borders, and no overlays except for white text cards or the yellow wordmark. Product photography on catalog cards is shot on pure white seamless with flat, even lighting. The ratio of image to text is approximately 70/30 — images carry emotion, text carries function. No illustrations, no abstract graphics, no 3D renders.

## Layout

The page is a vertically stacked series of full-bleed sections, each designed as a standalone editorial spread. The hero is a full-viewport photograph with a floating white overlay card (top-left) and a massive yellow wordmark bleeding across the bottom. Below the hero, sections alternate between full-bleed imagery and contained card grids. A two-column 50/50 image split separates category zones (skincare/makeup) with no visible border — only the image seam divides them. Product catalog uses a 4-column grid of square cards on the #f7f7f7 canvas. Navigation is a minimal top bar with a utility announcement strip above it. Section gaps are generous (64px) but the between-section transitions are seamless — no dividers, no alternating background colors except the warm footer. The overall rhythm is: photograph, text, photograph, grid, photograph — like flipping through a fashion magazine.

## Agent Prompt Guide

## Quick Color Reference
- Text: #000000 (Ink)
- Background: #f7f7f7 (Fog)
- Border: #e8e8e8 (Ash)
- Accent: #fff116 (Glossier Yellow)
- Surface: #ffffff (Paper)
- Muted text: #666666 (Graphite)
- primary action: no distinct CTA color

## Example Component Prompts

No distinct primary action color was observed; use the extracted neutral button treatments instead of inventing a filled CTA color.

2. **Product Card**: White #ffffff surface, no border or shadow, 0px radius. Product image fills top at 4:5 aspect ratio. Product name in Apercu 16px weight 500 #000000, descriptor in 14px weight 400 #666666, price in 16px weight 500 #000000. Below card, a full-width outlined button: transparent background, 1px solid #000000 border, 0px radius, Apercu 14px weight 500, padding 14px 16px.


4. **Utility Bar**: Full-bleed #000000 background, #ffffff text in Apercu 12px weight 400, centered, padding 4px vertical.

5. **NEW Badge**: Solid #0600ff background, white text in Apercu 12px weight 700 uppercase, 0px radius, padding 4px 8px, positioned top-left of product images.

## Similar Brands

- **Aesop** — Same editorial restraint with warm-neutral palette, serif-adjacent sans-serif typography, and photography that occupies the full viewport
- **Goop** — Similar DTC beauty aesthetic with full-bleed lifestyle photography, generous whitespace, and a single accent color anchoring the brand
- **Mejuri** — Clean product grid layouts with white cards on warm-gray canvas, minimal chrome, and high-contrast black-and-white photography
- **Aesop / Mansur Gavriel / & Other Stories** — Shared flat 0px-radius component language and a design philosophy where restraint and whitespace carry more weight than ornamentation

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-glossier-yellow: #fff116;
  --color-ink: #000000;
  --color-paper: #ffffff;
  --color-fog: #f7f7f7;
  --color-blush: #faf2f4;
  --color-mist: #f0f0f0;
  --color-ash: #e8e8e8;
  --color-graphite: #666666;
  --color-slate: #464545;
  --color-cobalt-tag: #0600ff;

  /* Typography — Font Families */
  --font-apercu: 'Apercu', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-apercu-mono: 'Apercu Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-gtstandard-m: 'GTStandard-M', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.4;
  --tracking-caption: 0.48px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.43;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-subheading: 20px;
  --leading-subheading: 1.3;
  --tracking-subheading: -0.06px;
  --text-heading: 32px;
  --leading-heading: 1.2;
  --tracking-heading: -0.1px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-5: 5px;
  --spacing-6: 6px;
  --spacing-7: 7px;
  --spacing-8: 8px;
  --spacing-9: 9px;
  --spacing-10: 10px;
  --spacing-11: 11px;
  --spacing-14: 14px;
  --spacing-15: 15px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-32: 32px;
  --spacing-34: 34px;
  --spacing-40: 40px;
  --spacing-41: 41px;

  /* Layout */
  --page-max-width: 1440px;
  --section-gap: 64px;
  --card-padding: 24px;
  --element-gap: 8px;

  /* Named Radii */
  --radius-cards: 0px;
  --radius-badges: 0px;
  --radius-inputs: 0px;
  --radius-buttons: 0px;

  /* Surfaces */
  --surface-page-canvas: #f7f7f7;
  --surface-product-card: #ffffff;
  --surface-footer: #faf2f4;
  --surface-accent: #fff116;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-glossier-yellow: #fff116;
  --color-ink: #000000;
  --color-paper: #ffffff;
  --color-fog: #f7f7f7;
  --color-blush: #faf2f4;
  --color-mist: #f0f0f0;
  --color-ash: #e8e8e8;
  --color-graphite: #666666;
  --color-slate: #464545;
  --color-cobalt-tag: #0600ff;

  /* Typography */
  --font-apercu: 'Apercu', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-apercu-mono: 'Apercu Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-gtstandard-m: 'GTStandard-M', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.4;
  --tracking-caption: 0.48px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.43;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-subheading: 20px;
  --leading-subheading: 1.3;
  --tracking-subheading: -0.06px;
  --text-heading: 32px;
  --leading-heading: 1.2;
  --tracking-heading: -0.1px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-5: 5px;
  --spacing-6: 6px;
  --spacing-7: 7px;
  --spacing-8: 8px;
  --spacing-9: 9px;
  --spacing-10: 10px;
  --spacing-11: 11px;
  --spacing-14: 14px;
  --spacing-15: 15px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-32: 32px;
  --spacing-34: 34px;
  --spacing-40: 40px;
  --spacing-41: 41px;
}
```
