# FRANKY'S — Style Reference
> Retro arcade kiosk on a skate-shop counter.

**Theme:** light

Franky's is a retro arcade-meets-skate-shop visual language: a warm cream canvas (#f3e5df) wrapped in hard pixel-art borders, an omnipresent black-and-white checkerboard, and a single Arcade pixel font carrying every word on the site. The palette is deliberately impoverished — only two chromatic colors survive (signal-orange #faa21f for the marquee bar and a punchy green #128e44 for the buy button), with all hierarchy expressed through the Arcade font's weight jump from 400 to 700 and through black-on-cream contrast. Surfaces stay flat and monolithic; depth comes only from a 1px inset cream line on buttons and the checkerboard's tonal play. Components feel like 1990s shopfront sprites: thick black borders, tight 6–12px radii, compact 4–8px internal padding, and 3D/AR toggles that read as pixel icons rather than chrome. New pages should preserve the arcade cabinet feel: no gradients except the orange marquee, no soft shadows, no decorative typography — just cream paper, black pixel rules, and one warm orange call.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Arcade Cream | `#f3e5df` | `--color-arcade-cream` | Page background, product card surfaces, inset highlights on buttons |
| Ink Black | `#000000` | `--color-ink-black` | Primary text, checkerboard tiles, all UI borders, card outlines, icon strokes |
| Pixel Gray | `#e5e7eb` | `--color-pixel-gray` | Hairline borders, card dividers, structural rules between grid cells |
| Charcoal | `#333333` | `--color-charcoal` | Secondary surface tone, checkerboard shadow squares, shadow color |
| Carbon | `#151515` | `--color-carbon` | Deep neutral for illustration fills and the densest checkerboard tiles |
| Muted Gray | `#737373` | `--color-muted-gray` | Disabled/muted text on buttons and body copy |
| Marquee Orange | `#faa21f` | `--color-marquee-orange` | Top notification bar, marquee accents, brand signature |
| Buy Green | `#128e44` | `--color-buy-green` | Filled ADD TO CART button — the only green purchase action |

## Tokens — Typography

### Arcade — Sole typeface across the entire interface — every heading, label, price, button, body and icon is set in Arcade. The 400/700 weight jump is the only hierarchy tool; using a second typeface would shatter the kiosk illusion. · `--font-arcade`
- **Substitute:** VT323, Press Start 2P (Google Fonts pixel set) — match the 8-bit, all-caps-leaning look
- **Weights:** 400, 700
- **Sizes:** 10px, 14px, 16px, 18px
- **Line height:** 1.25, 1.43, 1.50, 1.56
- **Letter spacing:** normal across all sizes — the font's bitmap grid is the rhythm, not tracking
- **Role:** Sole typeface across the entire interface — every heading, label, price, button, body and icon is set in Arcade. The 400/700 weight jump is the only hierarchy tool; using a second typeface would shatter the kiosk illusion.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 10px | 1.5 | — | `--text-caption` |
| body-sm | 14px | 1.43 | — | `--text-body-sm` |
| body | 16px | 1.5 | — | `--text-body` |
| subheading | 18px | 1.56 | — | `--text-subheading` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** compact

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 8 | 8px | `--spacing-8` |
| 12 | 12px | `--spacing-12` |
| 24 | 24px | `--spacing-24` |
| 44 | 44px | `--spacing-44` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 9999px |
| cards | 12px |
| buttons | 6px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| subtle | `rgb(243, 229, 223) 0px 1px 0px 0px inset` | `--shadow-subtle` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 43-61px
- **Card padding:** 12px
- **Element gap:** 4-8px

## Components

### Marquee Announcement Bar
**Role:** Top-of-page strip

Full-width band filled with the Marquee Sheen gradient (orange → cream → orange). Arcade 14px/400, letter-spacing normal, black or dark-brown text. Height ~36px, flush with the top of the viewport. It is the only decorative chromatic surface on the page.

### Header Bar
**Role:** Primary navigation

Cream (#f3e5df) background, 1px solid #000000 bottom border. Wordmark 'franky's' set in Arcade 18px/700 in #000000 with a small black cross pixel-icon. Hamburger menu on the right (three 2px black lines, 16px apart). No drop shadow, no sticky elevation — it sits flat on the cream canvas.

### Product Showcase Panel (3D/AR)
**Role:** Hero product viewer

Large left-hand panel (roughly 55% of viewport width) with a black-and-cream checkerboard floor receding in perspective. A charcoal (#333333) cap floats centered with a soft #333333 shadow. Bottom-center contains two pill toggles: '3D' and 'AR', each 6px radius, 1px inset cream highlight (#f3e5df 0px 1px 0px 0px inset), 2px 8px padding, Arcade 14px/400.

### Product Card
**Role:** Grid cell for one SKU

Cream (#f3e5df) background, 12px radius, 1px solid #e5e7eb border. Internal padding 12px. Product image fills the top ~70% of the card on a pure cream backdrop. Title (e.g. 'FRANKY'S GREEN 665') in Arcade 14px/700 #000000 at the bottom-left, price in Arcade 14px/400 #000000 at the bottom-right. Two stacked controls under the title area: ghost 'TRY IN AR' button and filled or ghost 'ADD TO CART' / 'OUT OF STOCK' button.

### Try In AR Button (Ghost)
**Role:** 3D/AR preview trigger

6px radius, transparent fill, 1px solid #000000 border, Arcade 14px/400 #000000. Padding 4px 12px. The 'AR' suffix is wrapped in a tiny pill (9999px) to read as a badge.

### Add To Cart Button (Filled Green)
**Role:** Primary purchase action

6px radius, #128e44 background, Arcade 14px/700 #ffffff (white) text, fully uppercase. Padding 8px 12px. Optional 1px inset cream highlight (#f3e5df 0px 1px 0px 0px inset) to keep the arcade-button feel. This is the only green surface in the system.

### Out Of Stock Button (Disabled Ghost)
**Role:** Depleted SKU state

6px radius, transparent fill, 1px solid #737373 border, Arcade 14px/400 #737373 text. Same dimensions as the live Add-To-Cart button so the grid stays uniform.

### Marquee Tag (Pill Badge)
**Role:** Inline label inside buttons and cards

9999px radius, 1px solid #000000 border, Arcade 10px/400 #000000, padding 2px 8px. Used for suffixes like 'AR' or sub-tags inside cards.

### Footer Strip
**Role:** Bottom-of-page info bar

1px solid #e5e7eb top border on cream. Left: '© FRANKY'S AMSTERDAM 2023' in Arcade 14px/400 #000000. Right: 'SUBSCRIBE' and 'SHIPPING' in Arcade 14px/700 #000000 acting as ghost links.

### Checkerboard Surface
**Role:** Hero texture / brand pattern

Repeating two-tone square grid in #f3e5df and #000000 (or #333333 for shadowed variants). Square size ~48px. Used as the hero panel backdrop and as decorative banding; never as a functional UI surface.

## Do's and Don'ts

### Do
- Use Arcade 400 for body, labels, prices, and captions; jump to Arcade 700 only for titles, nav items, and the footer links — the weight shift is the entire hierarchy.
- Set every CTA, tag, and toggle to a 6px radius (or 9999px for the inline 'AR' pill) and add the 1px inset cream highlight (#f3e5df 0px 1px 0px 0px inset) to keep the arcade-button bevel.
- Use Buy Green (#128e44) only for the filled Add-To-Cart button; never reuse it for links, borders, or hover states.
- Anchor the page on Arcade Cream (#f3e5df); use Pixel Gray (#e5e7eb) for 1px structural rules and card borders, Ink Black (#000000) for text and checkerboard contrast.
- Reserve Marquee Orange (#faa21f) for the top announcement bar and the optional Marquee Sheen gradient — it should never appear as a button fill or large text color.
- Keep vertical rhythm in 4px increments; element gaps live at 4–8px, card padding at 12px, and section gaps at 43–61px.
- Pair every product card with a Try-In-AR ghost button stacked above the Add-To-Cart (or Out-Of-Stock) button so the right-hand grid stays uniform.

### Don't
- Don't introduce a second typeface — no system fonts, no sans-serifs, no display scripts. Arcade is the brand.
- Don't use soft drop shadows; the only shadow allowed is the 1px inset cream highlight on buttons and the flat #333333 under the floating cap.
- Don't round cards above 12px or buttons below 6px — the 6/12/9999px triad is the only permitted radius vocabulary.
- Don't place Buy Green (#128e44) on a non-purchase element, and don't pair it with the Marquee Sheen gradient in the same component.
- Don't dilute the checkerboard — it must read as pure #000000 against #f3e5df (or #333333 for shadow tones), never as a tinted gray or blurred pattern.
- Don't use dark-mode backgrounds; the canvas is always Arcade Cream, even inside cards and modals.
- Don't exceed 18px on any text or drop below 10px — the Arcade font's bitmap grid breaks outside that range.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Arcade Cream | `#f3e5df` | Page canvas — warm off-white that makes the pixel font breathe |
| 2 | Pixel Gray | `#e5e7eb` | Grid gutter tone and product card background variation |
| 3 | Charcoal | `#333333` | Checkerboard shadow squares and tertiary surface |
| 4 | Carbon | `#151515` | Deepest checkerboard tone, near-black illustration fills |

## Elevation

- **Add To Cart / Ghost buttons:** `inset 0 1px 0 0 #f3e5df — 1px cream pixel-highlight at the top edge`
- **Floating product cap in hero:** `flat #333333 drop, no blur, sits directly under the product`

## Imagery

Photography of caps on a pure cream backdrop, centered and tightly cropped, with a soft charcoal contact shadow beneath. No lifestyle, no models, no context — the cap is the hero. The checkerboard behind the hero doubles as a graphic surface. No illustrations, no 3D renders beyond the AR toggle, no decorative icons beyond the pixel cross in the wordmark.

## Layout

Full-bleed single-screen product page on desktop, max-width 1200px centered. Top-to-bottom rhythm: orange marquee bar → cream header with black rule → two-column split (55% hero checkerboard / 45% 2-column product card grid) → cream footer strip. On mobile, the hero collapses to a full-width checkerboard and the grid becomes a single column. Cards are evenly distributed in a 2-column grid with Pixel Gray (#e5e7eb) hairline dividers between them. Section gaps are tight (43–61px) and the interface never uses full-bleed dark bands — the cream canvas runs uninterrupted.

## Agent Prompt Guide

Quick Color Reference:
- text: #000000 on #f3e5df
- background: #f3e5df (Arcade Cream)
- border: #e5e7eb hairline, #000000 for structural rules
- accent: #faa21f (Marquee Orange — top bar only)
- primary action: #128e44 (filled action)
- disabled/muted: #737373 text on ghost button

Example Component Prompts:
1. Product Card — Cream (#f3e5df) background, 12px radius, 1px solid #e5e7eb border, 12px padding. Title 'FRANKY'S GREEN 665' in Arcade 14px/700 #000000 bottom-left, price '€65' in Arcade 14px/400 #000000 bottom-right. Stacked controls: a ghost 'TRY IN AR' button (6px radius, transparent fill, 1px #000000 border, Arcade 14px/400, 4px 12px padding) with the 'AR' suffix in a 9999px pill, above a filled Add-To-Cart button (#128e44, Arcade 14px/700 white, 6px radius, 8px 12px padding, 1px inset #f3e5df highlight).
2. Marquee Announcement Bar — Full-width strip, 36px tall, filled with linear-gradient(to right, #faa21f, #fef3c7, #faa21f). Text 'KIN. STORE. COUPONS' in Arcade 14px/400 #000000, centered.
3. Header Bar — Cream (#f3e5df) background, 1px solid #000000 bottom border, 44px tall. Wordmark 'franky's' with pixel-cross icon in Arcade 18px/700 #000000 left-aligned, three 2px black horizontal lines (16px apart) right-aligned as a hamburger.
4. 3D/AR Hero Panel — 55% viewport width, filled with a 48px repeating #f3e5df / #000000 checkerboard. A charcoal (#333333) cap centered with a flat #333333 contact shadow. Two pill toggles '3D' and 'AR' centered at the bottom: 6px radius, transparent fill, 1px #000000 border, Arcade 14px/400, 1px inset #f3e5df highlight, 2px 8px padding.
5. Footer Strip — 1px solid #e5e7eb top border on #f3e5df, 32px tall. Left: '© FRANKY'S AMSTERDAM 2023' in Arcade 14px/400 #000000. Right: 'SUBSCRIBE' and 'SHIPPING' in Arcade 14px/700 #000000 with 24px gap between them.

## Similar Brands

- **Polar Skate Co.** — Same flat cream canvas, bold black-bordered product cards, and a single warm accent (Polar's red, Franky's orange) on a marquee bar
- **Palace Skateboards** — Pixel/bitmap-influenced type system, checkerboard product framing, and the 6px-radius beveled button look
- **Stüssy** — Compact cream-and-black product grid with tight padding and a single chromatic CTA color
- **Aimé Leon Dore** — Warm off-white surfaces, monospaced/pixel-adjacent labels, and minimal-but-precise card radii

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-arcade-cream: #f3e5df;
  --color-ink-black: #000000;
  --color-pixel-gray: #e5e7eb;
  --color-charcoal: #333333;
  --color-carbon: #151515;
  --color-muted-gray: #737373;
  --color-marquee-orange: #faa21f;
  --color-buy-green: #128e44;

  /* Typography — Font Families */
  --font-arcade: 'Arcade', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.5;
  --text-body-sm: 14px;
  --leading-body-sm: 1.43;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-subheading: 18px;
  --leading-subheading: 1.56;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-24: 24px;
  --spacing-44: 44px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 43-61px;
  --card-padding: 12px;
  --element-gap: 4-8px;

  /* Border Radius */
  --radius-md: 6px;
  --radius-xl: 12px;
  --radius-full: 9999px;

  /* Named Radii */
  --radius-tags: 9999px;
  --radius-cards: 12px;
  --radius-buttons: 6px;

  /* Shadows */
  --shadow-subtle: rgb(243, 229, 223) 0px 1px 0px 0px inset;

  /* Surfaces */
  --surface-arcade-cream: #f3e5df;
  --surface-pixel-gray: #e5e7eb;
  --surface-charcoal: #333333;
  --surface-carbon: #151515;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-arcade-cream: #f3e5df;
  --color-ink-black: #000000;
  --color-pixel-gray: #e5e7eb;
  --color-charcoal: #333333;
  --color-carbon: #151515;
  --color-muted-gray: #737373;
  --color-marquee-orange: #faa21f;
  --color-buy-green: #128e44;

  /* Typography */
  --font-arcade: 'Arcade', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.5;
  --text-body-sm: 14px;
  --leading-body-sm: 1.43;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-subheading: 18px;
  --leading-subheading: 1.56;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-24: 24px;
  --spacing-44: 44px;

  /* Border Radius */
  --radius-md: 6px;
  --radius-xl: 12px;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-subtle: rgb(243, 229, 223) 0px 1px 0px 0px inset;
}
```
