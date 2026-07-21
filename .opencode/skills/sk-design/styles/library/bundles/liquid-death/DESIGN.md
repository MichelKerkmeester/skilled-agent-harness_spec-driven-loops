# Liquid Death — Style Reference
> Heavy Metal Vending Machine

**Theme:** mixed

This design system feels like a heavy metal concert flyer brought to life as a direct-to-consumer brand. The aesthetic is built on brutalist principles: a stark palette of pure black and white, zero rounded corners, and aggressive, uppercase typography. This creates a hard, confrontational edge, deliberately rejecting the soft, approachable look of typical beverage companies. Splashes of antique gold in logos and links are the only moments of warmth, acting like a glint of metal on a matte black surface. The layout uses full-bleed, high-contrast sections, creating a jarring, powerful rhythm that mirrors the brand's 'Murder Your Thirst' tagline.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Death Black | `#000000` | `--color-death-black` | Primary text, core UI backgrounds, filled buttons. Establishes the dominant, aggressive tone. |
| Bone White | `#ffffff` | `--color-bone-white` | Text on dark backgrounds, primary page backgrounds. |
| Off-Black | `#151515` | `--color-off-black` | Body copy on light backgrounds, secondary UI elements. |
| Ash Gray | `#e3e3e3` | `--color-ash-gray` | Product grid background, subtle dividers. |
| Gravel Gray | `#727272` | `--color-gravel-gray` | Secondary text, disabled states, placeholder text. |
| Light Ash | `#f5f5f5` | `--color-light-ash` | Alternative light background color for section differentiation. |
| Charcoal | `#232323` | `--color-charcoal` | Hover states on dark elements. |
| Input Border | `#999999` | `--color-input-border` | Default border color for text input fields. |
| Polished Gold | `#d2ac5a` | `--color-polished-gold` | Accents, special links, logotype details — a premium, metallic highlight against the stark monochrome. |
| Antique Gold | `#8a6d35` | `--color-antique-gold` | Hover state for gold accents, secondary logotype details. |

## Tokens — Typography

### Acumin Pro — The single, dominant typeface used for everything from massive uppercase headlines to body copy. Its clean, geometric form provides a brutalist, no-nonsense foundation. Extensive use of uppercase at 700 weight for headings is the brand's signature voice. · `--font-acumin-pro`
- **Substitute:** 'Inter', 'Roboto', sans-serif
- **Weights:** 400, 500, 700
- **Sizes:** 12px, 14px, 16px, 18px, 20px, 24px, 32px, 36px, 40px, 56px, 60px
- **Line height:** 1.00, 1.05, 1.13, 1.20, 1.29, 1.50, 1.67, 2.00
- **Letter spacing:** 0.0200em, 0.0310em, 0.0560em, 0.0630em
- **Role:** The single, dominant typeface used for everything from massive uppercase headlines to body copy. Its clean, geometric form provides a brutalist, no-nonsense foundation. Extensive use of uppercase at 700 weight for headings is the brand's signature voice.

### acumin-pro-condensed — Used sparingly for subtitles and calorie counts where horizontal space is limited. Maintains the core Acumin feel in a more compact format. · `--font-acumin-pro-condensed`
- **Substitute:** 'Roboto Condensed', sans-serif
- **Weights:** 400, 700
- **Sizes:** 10px, 16px, 18px, 20px, 45px
- **Line height:** 1.00, 1.05, 1.20, 1.30
- **Letter spacing:** 0.0560em
- **Role:** Used sparingly for subtitles and calorie counts where horizontal space is limited. Maintains the core Acumin feel in a more compact format.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 10px | 1 | — | `--text-caption` |
| body-sm | 14px | 1.5 | — | `--text-body-sm` |
| body | 16px | 1.67 | — | `--text-body` |
| subheading | 24px | 1.2 | — | `--text-subheading` |
| heading-sm | 36px | 1.13 | — | `--text-heading-sm` |
| heading | 45px | 1.05 | — | `--text-heading` |
| display | 60px | 1 | — | `--text-display` |

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

### Border Radius

| Element | Value |
|---------|-------|
| tags | 0px |
| cards | 0px |
| inputs | 0px |
| buttons | 0px |

### Layout

- **Card padding:** 24px

## Components

### Primary Action Button
**Role:** Key CTAs like 'Shop Now' or 'Add to Cart'.

A solid rectangle with background: `Death Black` (#000000), text: `Bone White` (#ffffff), padding: 8px 16px, and border-radius: 0px. Text is uppercase `Acumin Pro`.

### Secondary Action Button
**Role:** Less prominent actions like 'Join the Contest'.

An outlined rectangle with background: transparent, text & 1px border: `Death Black` (#000000), padding: 13px, and border-radius: 0px. Text is uppercase `Acumin Pro`.

### Full-Width Banner CTA
**Role:** Major section-level calls to action, e.g., 'Join the Club'.

A full-width block link with background: `Death Black` (#000000), text: `Bone White` (#ffffff), and a right-aligned chevron. It is always rectangular with a 0px radius.

### Text Input Field
**Role:** For email capture and forms.

A sharp-cornered field with background: `Bone White` (#ffffff), text: `Death Black` (#000000), and a 1px border in `Input Border` (#999999). Padding is typically 8px 12px with 0px radius.

### Navigation Link
**Role:** Main site navigation items.

Uppercase text in `Acumin Pro` 500, color `Off-Black` (#151515). No underline or background decoration on hover.

### Modal Overlay
**Role:** Popup for email signup or promotions.

A semi-transparent `Gravel Gray` (#727272) layer covers the page, with a centered rectangular container in `Ash Gray` (#e3e3e3) holding the content. All corners are sharp (0px radius).

## Do's and Don'ts

### Do
- Use 0px border-radius for all buttons, inputs, cards, and containers.
- Set all major headlines in uppercase `Acumin Pro`.
- Rely on stark `Death Black` and `Bone White` for primary backgrounds and text.
- Use full-bleed, high-contrast black and white sections to structure the page.
- Reserve `Polished Gold` and `Antique Gold` for logotypes and hyper-specific accents.
- Maintain high-contrast text accessibility (AAA) for all body copy.
- Use sharp, rectangular product imagery on solid `Ash Gray` backgrounds.

### Don't
- Never use rounded corners on any element.
- Do not use drop shadows or gradients for elevation.
- Avoid using sentence case for primary headlines.
- Don't use the gold colors for standard UI components like buttons or inputs.
- Do not introduce any soft or playful colors into the palette.
- Avoid subtle gray-on-gray text combinations.
- Don't use lifestyle photography; focus on the product or provocative concepts.

## Elevation

This design actively avoids drop shadows. Depth and hierarchy are achieved exclusively through high-contrast color blocking—placing `Bone White` elements on `Death Black` backgrounds or vice versa. This creates a flat, graphic, and intentionally harsh layering style.

## Imagery

The visual language is provocative and product-focused, mirroring a heavy-metal aesthetic. Photography is high-contrast, often featuring stark product shots on plain backgrounds, or humorous, slightly absurd concepts (like drinking from a faucet). Imagery is used in full-bleed sections or as contained, sharp-edged blocks. There are no lifestyle photos; the can is the hero. Graphic elements include detailed, skull-based logotypes reminiscent of band art, rendered in black, white, and gold.

## Layout

The layout is built on a foundation of alternating, full-bleed content bands. The page structure often starts with a complex hero and transitions into a series of stark black, white, or light gray sections with a strong vertical rhythm. Content within sections is typically centered and max-width, creating a pillar of text and visuals down the screen. Grids are used for product listings, following a simple, rigid 3 or 4-column structure with no frills. The overall impression is one of powerful, rhythmic, and confrontational organization.

## Agent Prompt Guide

### Quick Color Reference
- **Page Background**: `#ffffff` (Bone White) / `#e3e3e3` (Ash Gray)
- **Dark Section Background**: `#000000` (Death Black)
- **Text**: `#151515` (Off-Black) on light, `#ffffff` (Bone White) on dark
- **CTA Button**: `#000000` background, `#ffffff` text
- **Accent**: `#d2ac5a` (Polished Gold)

### Example Component Prompts
1.  **"Create a primary CTA button with the text 'MURDER NOW'. It must have a `Death Black` (#000000) background, `Bone White` (#ffffff) uppercase text, 0px border-radius, and padding of 8px 16px. Use the `Acumin Pro` font at 700 weight."**
2.  **"Generate a product grid section on an `Ash Gray` (#e3e3e3) background. Each card should have 0px radius, no border, and no shadow. The product title should be uppercase `Acumin Pro` weight 700 in `Death Black` (#000000)."**
3.  **"Design a full-width promotional banner. The background is `Death Black` (#000000). The headline 'JOIN THE CLUB' should be in `Bone White` (#ffffff), uppercase `Acumin Pro` font, centered, with a small white chevron to the right."**

## Similar Brands

- **MSCHF** — Similar counter-culture, internet-native brand voice with a stark, often brutalist digital presence.
- **Thrasher Magazine** — Shares a gritty, unapologetic aesthetic rooted in a subculture, with bold, often gothic typography.
- **Balenciaga (under Demna)** — Employs a similar brutalist web design with stark typography, minimal color, and a focus on product in a harsh context.
- **Kith** — High-end streetwear e-commerce with a similar product-first, grid-based layout and monochrome palette, though Kith is less aggressive.

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-death-black: #000000;
  --color-bone-white: #ffffff;
  --color-off-black: #151515;
  --color-ash-gray: #e3e3e3;
  --color-gravel-gray: #727272;
  --color-light-ash: #f5f5f5;
  --color-charcoal: #232323;
  --color-input-border: #999999;
  --color-polished-gold: #d2ac5a;
  --color-antique-gold: #8a6d35;

  /* Typography — Font Families */
  --font-acumin-pro: 'Acumin Pro', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-acumin-pro-condensed: 'acumin-pro-condensed', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1;
  --text-body-sm: 14px;
  --leading-body-sm: 1.5;
  --text-body: 16px;
  --leading-body: 1.67;
  --text-subheading: 24px;
  --leading-subheading: 1.2;
  --text-heading-sm: 36px;
  --leading-heading-sm: 1.13;
  --text-heading: 45px;
  --leading-heading: 1.05;
  --text-display: 60px;
  --leading-display: 1;

  /* Typography — Weights */
  --font-weight-light: 300;
  --font-weight-regular: 400;
  --font-weight-medium: 500;
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

  /* Layout */
  --card-padding: 24px;

  /* Border Radius */
  --radius-sm: 2px;
  --radius-md: 5px;

  /* Named Radii */
  --radius-tags: 0px;
  --radius-cards: 0px;
  --radius-inputs: 0px;
  --radius-buttons: 0px;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-death-black: #000000;
  --color-bone-white: #ffffff;
  --color-off-black: #151515;
  --color-ash-gray: #e3e3e3;
  --color-gravel-gray: #727272;
  --color-light-ash: #f5f5f5;
  --color-charcoal: #232323;
  --color-input-border: #999999;
  --color-polished-gold: #d2ac5a;
  --color-antique-gold: #8a6d35;

  /* Typography */
  --font-acumin-pro: 'Acumin Pro', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-acumin-pro-condensed: 'acumin-pro-condensed', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1;
  --text-body-sm: 14px;
  --leading-body-sm: 1.5;
  --text-body: 16px;
  --leading-body: 1.67;
  --text-subheading: 24px;
  --leading-subheading: 1.2;
  --text-heading-sm: 36px;
  --leading-heading-sm: 1.13;
  --text-heading: 45px;
  --leading-heading: 1.05;
  --text-display: 60px;
  --leading-display: 1;

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

  /* Border Radius */
  --radius-sm: 2px;
  --radius-md: 5px;
}
```
