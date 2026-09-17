# Tesla — Style Reference
> Automotive Showroom on Screen. High-fidelity product visuals dominate, framed by a minimal, functional interface that gets out of the way.

**Theme:** light

The design operates like a premium automotive showroom translated to the screen. Every section is a full-bleed, cinematic product photograph, with UI elements acting as minimal, functional plaques. The palette is starkly achromatic, save for a single, electric Tesla Blue (#3e6ae1) reserved exclusively for primary calls-to-action, functioning like an ignition button. Typography is neutral and technical, serving information without asserting its own personality. This systematic subordination of UI to imagery ensures the product—the car, the solar panel—is always the undisrupted hero.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Tesla Blue | `#3e6ae1` | `--color-tesla-blue` | Primary CTAs ('Order Now') — a single, focused point of saturated color in an otherwise grayscale environment, creating an unmissable action prompt. |
| Pure White | `#ffffff` | `--color-pure-white` | Primary page backgrounds, card surfaces, text on dark/blue buttons. |
| Off-White | `#eeeeee` | `--color-off-white` | Secondary content cards, subtle dividers between white sections. |
| Parchment | `#e5e3df` | `--color-parchment` | Rare alternative background color for specific sections. |
| Light Border | `#cccccc` | `--color-light-border` | Inactive UI element borders, subtle dividers. |
| Subtle Gray | `#8e8e8` | `--color-subtle-gray` | Placeholder text, tertiary UI details. |
| Steel | `#5c5e62` | `--color-steel` | Secondary text, footer links, icon fills. |
| Charcoal | `#393c41` | `--color-charcoal` | Primary body text, text on light buttons, header navigation. |
| Onyx | `#171a20` | `--color-onyx` | Primary heading text, dark button backgrounds. |
| Carbon | `#000000` | `--color-carbon` | SVG icon fills, text overlays on light images. |

## Tokens — Typography

### Universal Sans Display — Used for all major headings and product titles. Its clean, geometric form provides a technical and confident voice that feels engineered, not decorated. · `--font-universal-sans-display`
- **Substitute:** Inter, Manrope
- **Weights:** 400, 500
- **Sizes:** 12px, 20px, 28px, 34px, 40px, 48px
- **Line height:** 1.17-1.41
- **Role:** Used for all major headings and product titles. Its clean, geometric form provides a technical and confident voice that feels engineered, not decorated.

### Universal Sans Text — The workhorse font for body copy, buttons, navigation, and all UI text. Chosen for its supreme legibility and neutrality, it delivers information efficiently without distracting from the product visuals. · `--font-universal-sans-text`
- **Substitute:** Inter, SF Pro Text
- **Weights:** 400, 500
- **Sizes:** 12px, 14px, 17px
- **Line height:** 1.00-1.67
- **Role:** The workhorse font for body copy, buttons, navigation, and all UI text. Chosen for its supreme legibility and neutrality, it delivers information efficiently without distracting from the product visuals.

### Roboto — Reserved for fine print, legal disclaimers, and other low-hierarchy text where utility is the sole concern. · `--font-roboto`
- **Substitute:** Roboto, system-ui
- **Weights:** 400, 500
- **Sizes:** 11px
- **Line height:** 1.20
- **Role:** Reserved for fine print, legal disclaimers, and other low-hierarchy text where utility is the sole concern.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 11px | 1.2 | — | `--text-caption` |
| body | 14px | 1.43 | — | `--text-body` |
| heading-sm | 20px | 1.4 | — | `--text-heading-sm` |
| heading | 28px | 1.29 | — | `--text-heading` |
| heading-lg | 40px | 1.2 | — | `--text-heading-lg` |
| display | 48px | 1.17 | — | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** compact

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 8 | 8px | `--spacing-8` |
| 16 | 16px | `--spacing-16` |
| 24 | 24px | `--spacing-24` |
| 32 | 32px | `--spacing-32` |
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 8px |
| inputs | 4px |
| modals | 8px |
| buttons | 4px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| sm | `rgba(0, 0, 0, 0.25) 0px 4px 4px 0px` | `--shadow-sm` |
| subtle | `rgb(255, 255, 255) 0px 2px 0px -1px` | `--shadow-subtle` |

### Layout

- **Card padding:** 24px
- **Element gap:** 8-16px

## Components

### Primary CTA Button
**Role:** The main action button for ordering or engaging.

Solid Tesla Blue (#3e6ae1) background with Pure White (#ffffff) text. 4px border radius. Padding is 4px top/bottom, 24px left/right.

### Secondary Ghost Button
**Role:** Secondary action like 'Learn More' or 'Demo'.

Transparent background with a thin Onyx (#171a20) border. Text is also Onyx (#171a20). 4px border radius. Padding is 4px top/bottom, 16px left/right.

### Modal Button (White)
**Role:** Secondary option within a modal or pop-up.

Solid Off-White (#eeeeee) background with Charcoal (#393c41) text. 4px border radius. Padding is 4px top/bottom, 24px left/right.

### Header Navigation Link
**Role:** Main site navigation.

Unstyled text link with Charcoal (#393c41) color. No background or borders.

### Footer Navigation Link
**Role:** Tertiary links in the site footer.

Unstyled text link with Steel (#5c5e62) color. Appears smaller than header navigation.

### Product Hero Section
**Role:** Full-screen container showcasing a single product.

Full-bleed background image. Contains a centered, stacked group of a Display heading (Onyx #171a20 or White #ffffff depending on image), Subheading text, and a pair of Primary/Secondary CTA buttons.

## Do's and Don'ts

### Do
- Always lead with a full-bleed, high-quality product image for every major section.
- Center-align text and CTAs over background images.
- Use Tesla Blue (#3e6ae1) exclusively for primary, high-priority actions like 'Order Now'.
- Pair a filled primary CTA with a white or ghost secondary CTA.
- Maintain a strict achromatic palette (white, grays, black) for all UI outside of the primary CTA.
- Use the 4px base unit for all padding, margins, and radii (e.g., 4px, 8px, 16px, 24px).
- Keep UI chrome, like headers and footers, visually minimal and unobtrusive.

### Don't
- Don't use Tesla Blue (#3e6ae1) for text, headlines, or decorative elements.
- Don't introduce any other saturated colors into the UI palette.
- Don't use complex components; prefer simple, stacked text and button layouts.
- Don't use large shadows, gradients, or heavy visual effects on UI elements.
- Don't create layouts where text dominates over imagery.
- Don't use border radii larger than 8px.
- Don't use serif or expressive display fonts; maintain a neutral, technical typographic voice.

## Imagery

The visual language is defined by cinematic, high-fidelity product photography. Every image is treated as a hero shot, typically full-bleed, occupying the entire viewport. The photography style is sharp, clean, and often aspirational, showing products in ideal contexts (a car on an open road, solar panels on a modern home). Color grading is natural and vibrant to make the product pop against the neutral UI. The density is image-dominant; text and UI exist only to support the visual narrative established by the photos.

## Layout

The page structure is a vertical series of full-screen, edge-to-edge content blocks, creating a 'scrolling presentation' experience. The dominant pattern is a centered stack: a large headline, supporting subtext, and action buttons overlaid directly onto a full-bleed background image. There is no visible page container; the browser viewport is the frame. Navigation is confined to a thin, non-sticky header bar at the very top, preserving maximum screen real estate for product visuals. Section transitions are seamless, with no visible gaps or dividers.

## Agent Prompt Guide

### Quick Color Reference
- **Text (Heading):** `#171a20` (Onyx)
- **Text (Body):** `#393c41` (Charcoal)
- **Background:** `#ffffff` (Pure White)
- **CTA (Primary):** `#3e6ae1` (Tesla Blue)
- **CTA (Secondary):** Transparent with `#171a20` (Onyx) border
- **Card Background:** `#eeeeee` (Off-White)

### Example Component Prompts
1.  **Product Hero Section:** "Create a full-screen hero section with a high-resolution image of a car on a desert road. Overlay a centered headline 'Model Y' using Universal Sans Display at 40px, weight 500, color #171a20. Below it, add a subheading 'Lease From $459/mo' in Universal Sans Text at 17px, weight 400, color #393c41. Add two buttons below with 16px gap: a primary button with text 'Order Now', background #3e6ae1, text color #ffffff, 4px radius, 4px 24px padding; and a secondary ghost button with text 'Learn More', transparent background, #171a20 border, #171a20 text color, 4px radius, 4px 24px padding."
2.  **Informational Card:** "Design an informational card with a background color of #eeeeee and an 8px border-radius. Padding should be 24px. Inside, place a left-aligned heading 'Current Offers' in Universal Sans Display at 28px, weight 500, color #171a20. Below it, add body text using Universal Sans Text at 14px, color #393c41. To the right of the text, place a squarish product image. Below the text, add a single secondary ghost button with text 'Learn More'."
3.  **Primary Button:** "Generate a primary call-to-action button. Set background to #3e6ae1, text color to #ffffff. Font should be Universal Sans Text, 14px, weight 500. Add a 4px border-radius. Set padding to 4px top/bottom and 24px left/right."

## Similar Brands

- **Apple** — Identical product-as-hero philosophy with full-bleed imagery, minimal UI, and a clean, technical sans-serif typography.
- **Rivian** — Direct competitor using a similar full-screen, scroll-based storytelling layout with centered text over aspirational vehicle photography.
- **Sonos** — Shares the use of pristine product shots on clean, achromatic backgrounds with minimal, functional UI components.
- **DJI** — Employs a similar high-tech, premium aesthetic with cinematic product visuals and a dark/light minimalist interface.

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-tesla-blue: #3e6ae1;
  --color-pure-white: #ffffff;
  --color-off-white: #eeeeee;
  --color-parchment: #e5e3df;
  --color-light-border: #cccccc;
  --color-subtle-gray: #8e8e8;
  --color-steel: #5c5e62;
  --color-charcoal: #393c41;
  --color-onyx: #171a20;
  --color-carbon: #000000;

  /* Typography — Font Families */
  --font-universal-sans-display: 'Universal Sans Display', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-universal-sans-text: 'Universal Sans Text', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-roboto: 'Roboto', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 11px;
  --leading-caption: 1.2;
  --text-body: 14px;
  --leading-body: 1.43;
  --text-heading-sm: 20px;
  --leading-heading-sm: 1.4;
  --text-heading: 28px;
  --leading-heading: 1.29;
  --text-heading-lg: 40px;
  --leading-heading-lg: 1.2;
  --text-display: 48px;
  --leading-display: 1.17;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;

  /* Layout */
  --card-padding: 24px;
  --element-gap: 8-16px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;

  /* Named Radii */
  --radius-cards: 8px;
  --radius-inputs: 4px;
  --radius-modals: 8px;
  --radius-buttons: 4px;

  /* Shadows */
  --shadow-sm: rgba(0, 0, 0, 0.25) 0px 4px 4px 0px;
  --shadow-subtle: rgb(255, 255, 255) 0px 2px 0px -1px;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-tesla-blue: #3e6ae1;
  --color-pure-white: #ffffff;
  --color-off-white: #eeeeee;
  --color-parchment: #e5e3df;
  --color-light-border: #cccccc;
  --color-subtle-gray: #8e8e8;
  --color-steel: #5c5e62;
  --color-charcoal: #393c41;
  --color-onyx: #171a20;
  --color-carbon: #000000;

  /* Typography */
  --font-universal-sans-display: 'Universal Sans Display', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-universal-sans-text: 'Universal Sans Text', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-roboto: 'Roboto', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 11px;
  --leading-caption: 1.2;
  --text-body: 14px;
  --leading-body: 1.43;
  --text-heading-sm: 20px;
  --leading-heading-sm: 1.4;
  --text-heading: 28px;
  --leading-heading: 1.29;
  --text-heading-lg: 40px;
  --leading-heading-lg: 1.2;
  --text-display: 48px;
  --leading-display: 1.17;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;

  /* Shadows */
  --shadow-sm: rgba(0, 0, 0, 0.25) 0px 4px 4px 0px;
  --shadow-subtle: rgb(255, 255, 255) 0px 2px 0px -1px;
}
```
