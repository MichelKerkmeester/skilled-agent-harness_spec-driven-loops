# Hartzler Family Dairy — Style Reference
> Creamery billboard at golden hour — the products are the type and the type is the room.

**Theme:** light

Hartzler Family Dairy uses a sunlit country-creamery aesthetic where product photography is the hero and display type does the branding. Massive Work Sans 900 headlines (290–333px) at 0.70 line-height stretch behind and around product photos, acting as architectural color blocks — teal 'DAIRY' and butter-yellow 'FRESH' alternate as section identifiers while a single deep forest green anchors all chrome, logos, and interactive borders. The interface is intentionally sparse: white canvas, minimal nav (just a 'MENU' link), no decorative gradients, no shadows — the bottles, butter sticks, and ice cream scoops are the visual content. Accent colors appear ONLY in oversized display text and small category tags; everything else is charcoal text and forest-green outlines, creating the feel of a vintage dairy billboard stripped of clutter.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Forest Heritage | `#035542` | `--color-forest-heritage` | Teal accent for outlined action borders, linked labels, and lightweight interactive emphasis. Do not promote it to the primary CTA color |
| Billboard Blue | `#2b7bb9` | `--color-billboard-blue` | Outlined link and button borders, secondary decorative strokes on product imagery. Never a filled background — always a 1–2px stroke that reads as an old-school printed link underline |
| Cream Teal | `#56dddb` | `--color-cream-teal` | Teal outline accent for tags, dividers, and focused UI edges. |
| Butter Yellow | `#f9e9a9` | `--color-butter-yellow` | Yellow outline accent for tags, dividers, and focused UI edges. |
| Charcoal Press | `#333333` | `--color-charcoal-press` | Primary text, all UI borders, image outlines. This is the workhorse neutral — the 644 border usages show that almost every edge in the system is charcoal, giving the site a hand-printed, ink-stamped quality |
| Cream White | `#ffffff` | `--color-cream-white` | Page canvas, card surfaces, button fills when a neutral surface button is needed. The interface is unapologetically blank — white lets the product photography and oversized colored type do all the work |

## Tokens — Typography

### Work Sans — The entire visual identity runs on a single Work Sans family. Weight 400 carries body, captions, and category tags. Weight 500 is used for slightly emphasized labels and the nav 'MENU' word. Weight 900 at 290–333px with 0.70 line-height is the signature move — this is not a 'big headline' UI, it's a typographic billboard where letters stack into color blocks that frame product photography. The slight -0.0100em tracking (-2.9px at 290px, -3.3px at 333px) tightens the massive type so it feels inked, not airy. · `--font-work-sans`
- **Substitute:** Inter (for 400/500), Archivo Black or Anton (for 900 display alternative)
- **Weights:** 400, 500, 900
- **Sizes:** 14px, 17px, 18px, 40px, 290px, 333px
- **Line height:** 0.70 (display) / 1.00–1.06 (headings) / 1.45 (body)
- **Letter spacing:** -0.0100em across all sizes (≈-0.14px at 14px, -2.9px at 290px, -3.3px at 333px)
- **Role:** The entire visual identity runs on a single Work Sans family. Weight 400 carries body, captions, and category tags. Weight 500 is used for slightly emphasized labels and the nav 'MENU' word. Weight 900 at 290–333px with 0.70 line-height is the signature move — this is not a 'big headline' UI, it's a typographic billboard where letters stack into color blocks that frame product photography. The slight -0.0100em tracking (-2.9px at 290px, -3.3px at 333px) tightens the massive type so it feels inked, not airy.

### Font Awesome 5 Brands — Font Awesome 5 Brands — detected in extracted data but not described by AI · `--font-font-awesome-5-brands`
- **Weights:** 400
- **Sizes:** 40px
- **Line height:** 1
- **Role:** Font Awesome 5 Brands — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 14px | 1.45 | -0.14px | `--text-caption` |
| body-sm | 17px | 1.45 | -0.17px | `--text-body-sm` |
| subheading | 40px | 1.06 | -0.4px | `--text-subheading` |
| display | 290px | 0.7 | -2.9px | `--text-display` |
| display-xl | 333px | 0.7 | -3.33px | `--text-display-xl` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 10 | 10px | `--spacing-10` |
| 12 | 12px | `--spacing-12` |
| 15 | 15px | `--spacing-15` |
| 20 | 20px | `--spacing-20` |
| 24 | 24px | `--spacing-24` |
| 30 | 30px | `--spacing-30` |
| 50 | 50px | `--spacing-50` |

### Border Radius

| Element | Value |
|---------|-------|
| body | 4px |
| tags | 0px |
| buttons | 20px |
| pillButtons | 100px |

### Layout

- **Page max-width:** 1400px
- **Section gap:** 50px
- **Card padding:** 20px
- **Element gap:** 20px

## Components

### Billboard Display Headline
**Role:** Section-identifying typographic hero

Massive Work Sans 900 at 290–333px, line-height 0.70, letter-spacing -0.01em. Fill alternates between #56dddb (teal) and #f9e9a9 (butter yellow) depending on the section's category word. Sits as a background color block behind/around product photography — the text is architecture, not just a heading. No drop shadow, no gradient — flat color type.

### Product Hero Panel
**Role:** Showcase for a single product line (milk bottle, butter box, ice cream)

White background (#ffffff), product photo centered or left-aligned, overlaid with a small category tag. No card border, no shadow — the product image IS the card. Pair with a 3-product grid layout where each product gets equal horizontal space.

### Category Tag
**Role:** Short product-category label (CHOCOLATE MILK, CLASSIC MILK, ICE CREAM, BUTTER)

Work Sans 500 at 14px, uppercase, Forest Heritage #035542 text on white #ffffff, no border, no background fill. Padding 10px vertical, 0px horizontal. Sits as a small text block adjacent to the product, often with a chevron or simple horizontal line as a visual anchor.

### Circular Featured Seal
**Role:** Featured-content stamp

Circular badge ~120px diameter, Forest Heritage #035542 outline (2px), Forest Heritage text 'FEATURED' set in a curve or stacked, serif-free, all-caps Work Sans 500 at 12–14px. Centered icon or mark. No fill — outlined stamp that reads as a rubber-stamp impression.

### Outlined Link Button
**Role:** Primary interactive element across the site

Work Sans 500 at 14–17px, Forest Heritage #035542 text, 1–2px Forest Heritage border, 20px border-radius, 20px horizontal padding × 10–12px vertical padding. White #ffffff background. No fill state, no shadow — the border IS the button. Billboard Blue #2b7bb9 may appear as an alternate outlined link color for secondary actions.

### Pill Button
**Role:** Secondary round-ended button for prominent CTAs

Work Sans 500 at 14–17px, 100px border-radius (fully pill), Forest Heritage #035542 text, transparent or white fill, 1–2px Forest Heritage border, 20px vertical × 24px horizontal padding. Used sparingly for the most important page-level action.

### Brand Wordmark
**Role:** Site logo in script-style mark

Hartzler rendered in a flowing italic/script face (or italicized Work Sans 900 as substitute) at 40–60px, Forest Heritage #035542. Always paired with small-caps 'FAMILY DAIRY' sub-label in Work Sans 500 at 10–12px tracked out. The wordmark is the only ornate typographic element — everything else is geometric sans.

### Section Caption Label
**Role:** Small all-caps descriptor under a product

Work Sans 400 at 14px, uppercase, letter-spacing 0.05em, Charcoal Press #333333. Padding 20px top. Centered or left-aligned under the product image. Example style: 'WORLD'S BEST CHOCOLATE MILK' or 'HAND-SCOOPED IN WOOSTER OHIO'.

### Minimal Nav
**Role:** Site navigation

Top-right anchored 'MENU' word in Work Sans 500 at 17px, Forest Heritage #035542, with a simple three-line hamburger icon. No background bar, no sticky shadow — just a floating word and icon on the white canvas.

### Three-Product Row
**Role:** Layout component for the dairy showcase

Three equal-width columns across the page max-width, each containing a centered product photo, a Category Tag, and a Section Caption beneath. No dividers between columns — the white space does the separation. 20px gap between columns.

### Decorative Wave Glyph
**Role:** Inline brand flourish

Small repeating chevron/wave mark in Cream Teal #56dddb or Forest Heritage #035542, used as a decorative element between sections or as a divider. Geometric, no curves — angular hand-drawn line quality.

## Do's and Don'ts

### Do
- Set section-identifying display headlines at 290–333px in Work Sans 900, line-height 0.70, alternating between #56dddb and #f9e9a9 — the teal/yellow swap signals a new product category.
- Use Forest Heritage #035542 for every outlined button border, link text, logo, and category tag — it is the only interactive color in the system.
- Pair every product photo with a small all-caps Section Caption in Work Sans 400 at 14px, Charcoal #333333, 20px padding-top.
- Render the brand wordmark 'Hartzler' in an italic/script style at 40–60px in #035542 with a tracked-out 'FAMILY DAIRY' sub-label.
- Use 20px border-radius for standard buttons and 100px for pill buttons — never mix intermediate values like 50px or 8px.
- Keep the page canvas pure #ffffff with no decorative gradients, textures, or background patterns.
- Stamp the circular 'FEATURED' seal in 2px Forest Heritage outline on top-left of any featured content block.

### Don't
- Never use filled colored buttons with #2b7bb9 or #035542 as a solid background — all interactive elements are outlined or text-only with borders.
- Don't apply drop shadows, glows, or elevation to cards or buttons — depth comes from type and photo scale, not from CSS shadows.
- Don't use display sizes (290–333px) for body UI text — these sizes are reserved exclusively for the billboard-style section identifier words.
- Never pair teal #56dddb or butter yellow #f9e9a9 with UI text under 40px — these colors are display-only accents, not functional UI colors.
- Don't introduce gradients, glassmorphism, or modern SaaS conventions like sticky shadow-on-scroll headers.
- Don't use intermediate border-radius values like 8px, 12px, or 50px — the system has exactly 4px (body), 20px (buttons), 100px (pill), 0px (tags).
- Don't add illustration, icon sets, or abstract graphics to product sections — the bottle photography and oversized type carry the entire visual identity.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Cream White Canvas | `#ffffff` | Page background — pure white, untextured, lets the oversized colored type and product photos carry the visual weight. |
| 1 | Forest Heritage Surface | `#035542` | Occasional inverted surface for the circular seal stamps and any dark moment — appears in small concentrated areas, never as a full section background. |

## Elevation

The design intentionally avoids drop shadows. Depth and hierarchy are built through oversized colored type acting as background blocks, product photography scale, and generous white-space separation — not through lifted cards or glowing buttons. This keeps the aesthetic flat, printed, and billboard-like.

## Imagery

Product photography is the entirety of the visual language: glass milk bottles with metal caps, a stick of butter in its printed wrapper, a pint cup overflowing with hand-scooped ice cream. Photos are shot on pure white, no lifestyle context, no hands, no kitchen — the product IS the hero. Treatment is high-key, bright, with crisp detail (you can see condensation and texture on the ice cream). The wordmark, category tags, and section captions sit flat on top with no overlap effects. No illustration, no abstract graphics, no 3D renders — the bottle photography carries all atmosphere.

## Layout

Full-bleed white canvas with no fixed page max-width constraint; the three-product row visually caps around 1400px but the type bleeds beyond. The hero pattern is a three-column product showcase with massive billboard display type stretching behind the products. Sections alternate by switching the display-type color (teal 'DAIRY' → yellow 'FRESH' → teal 'ICE CREAM') — the type color IS the section divider. A 'FEATURED' circular seal stamps the top-left of any featured block. No alternating light/dark bands, no card grids beyond the product row, no sidebar. Navigation is a single floating 'MENU' in the top-right corner. Vertical rhythm: 50px section gaps, 20px element gaps, with the oversized type creating visual breathing room on its own.

## Agent Prompt Guide

**Quick Color Reference**
- text: #333333 (Charcoal Press)
- background: #ffffff (Cream White)
- border: #333333 default, #035542 interactive
- accent: #56dddb (Cream Teal) for display type, #f9e9a9 (Butter Yellow) for alternate display type
- primary action: #2b7bb9 (outlined action border)
- logo/wordmark: #035542 Forest Heritage

**Example Component Prompts**
1. **Build a product showcase section**: White #ffffff background, full canvas. Centered Work Sans 900 headline at 290px, line-height 0.70, letter-spacing -2.9px, fill #56dddb, displaying the word 'DAIRY'. Behind/over the headline, three product photos in a row, each 33% width. Below each photo, a Work Sans 500 14px uppercase Category Tag in #035542 (e.g. 'CHOCOLATE MILK'). Below the tag, a Work Sans 400 14px uppercase caption in #333333 with 20px padding-top.

2. **Build an outlined link button**: Work Sans 500 17px, color #035542, 1.5px solid #035542 border, 20px border-radius, 20px horizontal × 12px vertical padding, background #ffffff. No shadow, no fill on hover — the border is the entire visual treatment.

3. **Build the FEATURED seal**: 120px circle, 2px solid #035542 border, white background. Inside, the word 'FEATURED' repeated twice in a circular layout using Work Sans 500 12px, color #035542, letter-spacing 0.05em. Centered small mark or dot.

4. **Build the minimal nav**: Top-right corner, floating. Three-line hamburger icon (3px tall, 24px wide, 4px gap between lines) in #035542, followed by the word 'MENU' in Work Sans 500 17px, color #035542, 12px to the left of the icon. No background bar, no border, no shadow.

5. **Build an alternate-section billboard block**: White canvas, Work Sans 900 at 333px, line-height 0.70, letter-spacing -3.33px, fill #f9e9a9, word 'FRESH' centered. To the left-top, the circular FEATURED seal in 2px #035542 outline. Below the headline, a single large product photo (butter box) centered at 50% page width.

## Typography Philosophy

Work Sans is the only typeface in the system. Its versatility — geometric grotesque at body size, compressed-when-tightened at display size — is what allows one family to carry both 14px product captions and 333px billboard words. The signature is the 0.70 line-height at display scale: this is below 1.0, meaning descenders and ascenders of stacked lines begin to touch or overlap, creating a dense color-block effect where the text reads more as a graphic shape than as readable words. Pair this with -0.0100em tracking and weight 900, and the display type behaves like inked poster lettering rather than digital UI.

## Color Pairing Rules

The system has exactly two display-type color states: teal #56dddb (dairy/cold-storage categories: milk, ice cream) and butter yellow #f9e9a9 (freshness/pantry categories: butter, cheese, eggs). A section's category determines which color its billboard word uses. Forest Heritage #035542 is the constant anchor — every logo, every interactive outline, every seal. Billboard Blue #2b7bb9 is reserved for inline link underlines and decorative product-image strokes; it should never appear at display scale or as a button fill. The contrast between the warm cream-and-yellow palette and the deep forest green is what gives the brand its vintage dairy character.

## Similar Brands

- **Jeni's Splendid Ice Creams** — Same product-photography-as-hero approach with oversized display type and a single warm accent color used in large flat blocks behind the products.
- **Tillamook** — Heritage dairy brand aesthetic with deep green primary color, clean white canvas, and minimal UI chrome that lets the products dominate.
- **Straus Family Creamery** — Small-batch dairy brand using a single deep brand color for logo and links, paired with generous white space and minimal decorative UI.
- **King Arthur Baking** — Heritage food brand combining a script wordmark, all-caps serif-free labels, and billboard-style display type alternating between warm accent colors per section.

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-forest-heritage: #035542;
  --color-billboard-blue: #2b7bb9;
  --color-cream-teal: #56dddb;
  --color-butter-yellow: #f9e9a9;
  --color-charcoal-press: #333333;
  --color-cream-white: #ffffff;

  /* Typography — Font Families */
  --font-work-sans: 'Work Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-font-awesome-5-brands: 'Font Awesome 5 Brands', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.45;
  --tracking-caption: -0.14px;
  --text-body-sm: 17px;
  --leading-body-sm: 1.45;
  --tracking-body-sm: -0.17px;
  --text-subheading: 40px;
  --leading-subheading: 1.06;
  --tracking-subheading: -0.4px;
  --text-display: 290px;
  --leading-display: 0.7;
  --tracking-display: -2.9px;
  --text-display-xl: 333px;
  --leading-display-xl: 0.7;
  --tracking-display-xl: -3.33px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-black: 900;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-15: 15px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-30: 30px;
  --spacing-50: 50px;

  /* Layout */
  --page-max-width: 1400px;
  --section-gap: 50px;
  --card-padding: 20px;
  --element-gap: 20px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-2xl: 20px;
  --radius-full: 100px;

  /* Named Radii */
  --radius-body: 4px;
  --radius-tags: 0px;
  --radius-buttons: 20px;
  --radius-pillbuttons: 100px;

  /* Surfaces */
  --surface-cream-white-canvas: #ffffff;
  --surface-forest-heritage-surface: #035542;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-forest-heritage: #035542;
  --color-billboard-blue: #2b7bb9;
  --color-cream-teal: #56dddb;
  --color-butter-yellow: #f9e9a9;
  --color-charcoal-press: #333333;
  --color-cream-white: #ffffff;

  /* Typography */
  --font-work-sans: 'Work Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-font-awesome-5-brands: 'Font Awesome 5 Brands', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.45;
  --tracking-caption: -0.14px;
  --text-body-sm: 17px;
  --leading-body-sm: 1.45;
  --tracking-body-sm: -0.17px;
  --text-subheading: 40px;
  --leading-subheading: 1.06;
  --tracking-subheading: -0.4px;
  --text-display: 290px;
  --leading-display: 0.7;
  --tracking-display: -2.9px;
  --text-display-xl: 333px;
  --leading-display-xl: 0.7;
  --tracking-display-xl: -3.33px;

  /* Spacing */
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-15: 15px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-30: 30px;
  --spacing-50: 50px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-2xl: 20px;
  --radius-full: 100px;
}
```
