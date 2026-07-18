# Rive — Style Reference
> Precision Night Vision. The interface is a specialized lens, cutting through darkness to focus on technical details with absolute clarity.

**Theme:** dark

The design feels like a high-end piece of creative software, a focused digital workshop cloaked in darkness. A pure black #000000 canvas eliminates all distraction, forcing attention onto the content and UI. The technical, wide-set 'Tomorrow' typeface is the defining visual signature, establishing a futuristic, blueprint-like quality for all headings. A single, warm 'Ignition Orange' accent appears only on primary CTAs, acting as a functional guidance point in the monochromatic environment. Elevation is conveyed not by shadows but by subtle shifts in dark gray surfaces, creating depth like nested panels on a piece of precision hardware.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Ignition Orange | `#ffa41c` | `--color-ignition-orange` | Primary CTAs and eyebrow labels — the sole warm accent, providing a clear, unmissable call to action. |
| Obsidian | `#000000` | `--color-obsidian` | Primary page background. |
| Charcoal | `#111111` | `--color-charcoal` | Secondary surfaces, like contained button backgrounds. |
| Graphite | `#1d1d1d` | `--color-graphite` | Tertiary surfaces, small button backgrounds. |
| Tarmac | `#262626` | `--color-tarmac` | Interactive element backgrounds. |
| Stark White | `#ffffff` | `--color-stark-white` | Headline text, icon fills. |
| Cloud | `#f1f1f1` | `--color-cloud` | High-emphasis body text. |
| Ash | `#aaaaaa` | `--color-ash` | Standard body text. |
| Dusk Gray | `#999999` | `--color-dusk-gray` | Secondary text, navigation links. |

## Tokens — Typography

### Tomorrow — All headings, subheadings, and prominent UI labels. Its technical, semi-monospace structure and distinctive letter-spacing define the brand's futuristic, tool-like identity. · `--font-tomorrow`
- **Substitute:** Share Tech Mono, Roboto Mono
- **Weights:** 400, 500
- **Sizes:** 11px, 12px, 14px, 20px, 24px, 40px
- **Line height:** 1.00, 1.20, 1.30, 1.40, 1.60
- **Letter spacing:** Negative at large sizes (-1.32px at 40px) for tight headlines, positive at small sizes (+1.1px at 11px) for legible UI labels.
- **Role:** All headings, subheadings, and prominent UI labels. Its technical, semi-monospace structure and distinctive letter-spacing define the brand's futuristic, tool-like identity.

### Inter — All body copy and long-form text. Its neutrality provides a readable foundation that complements the stylized 'Tomorrow' headlines. · `--font-inter`
- **Substitute:** Inter, Roboto, sans-serif
- **Weights:** 400, 500, 600
- **Sizes:** 13px, 16px
- **Line height:** 1.20, 1.60, 1.70
- **Role:** All body copy and long-form text. Its neutrality provides a readable foundation that complements the stylized 'Tomorrow' headlines.

### sans-serif — Fallback and utilitarian text in less prominent contexts. · `--font-sans-serif`
- **Substitute:** System UI
- **Weights:** 400
- **Sizes:** 12px
- **Line height:** 1.20
- **Role:** Fallback and utilitarian text in less prominent contexts.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 11px | 1.1 | 1.1px | `--text-caption` |
| body | 16px | 1.6 | — | `--text-body` |
| subheading | 20px | 1.3 | 0.2px | `--text-subheading` |
| heading-sm | 24px | 1.2 | 0.19px | `--text-heading-sm` |
| heading-lg | 40px | 1 | -1.32px | `--text-heading-lg` |

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
| 16 | 16px | `--spacing-16` |
| 20 | 20px | `--spacing-20` |
| 24 | 24px | `--spacing-24` |
| 27 | 27px | `--spacing-27` |
| 30 | 30px | `--spacing-30` |
| 32 | 32px | `--spacing-32` |
| 39 | 39px | `--spacing-39` |
| 40 | 40px | `--spacing-40` |
| 60 | 60px | `--spacing-60` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 4-8px |
| cards | 8px |
| inputs | 8px |
| buttons | 8px |

### Layout

- **Section gap:** 80-120px
- **Card padding:** 16px
- **Element gap:** 8-16px

## Components

### Primary CTA Button
**Role:** The main call to action in a view.

Background: Ignition Orange (#ffa41c). Text: Stark White (#ffffff). Padding: 12px 24px. Radius: 8px. Font: Inter Bold.

### Secondary CTA Button
**Role:** Secondary action, like downloads or alternative options.

Background: Charcoal (#111111) or Graphite (#1d1d1d). Text: Stark White (#ffffff). Padding: 12px 24px. Radius: 8px. Font: Inter.

### Tertiary Button
**Role:** Small, supplemental actions like 'Learn More' or 'Features'.

Background: Graphite (#1d1d1d). Text: Stark White (#ffffff) or Ash (#aaaaaa). Padding: 8px 10px. Radius: 8px. Font: Tomorrow or Inter, often with an icon.

### Navigation Link
**Role:** Header and footer navigation items.

Text-only button. Text color: Dusk Gray (#999999). Hover/Active color: Stark White (#ffffff). Font: Tomorrow 500.

### Eyebrow Label
**Role:** A small label preceding a major headline.

Text color: Ignition Orange (#ffa41c). Font: Tomorrow 500, all-caps. Often paired with a small icon.

### Category Tag Card
**Role:** Interactive tags for filtering or navigation, seen in a grid.

Background: Graphite (#1d1d1d). Border: 1px solid Tarmac (#262626). Text: Dusk Gray (#999999). Radius: 8px. On hover, background lightens and text turns white.

### Hero Headline
**Role:** The main H1 on the page.

Font: Tomorrow 500 at a large size (e.g., 40px+). Color: Stark White (#ffffff). Tightly tracked letter-spacing.

## Do's and Don'ts

### Do
- Use the 'Tomorrow' font for all headings, subheadings, and nav items.
- Reserve 'Ignition Orange' (#ffa41c) exclusively for a single primary CTA per view.
- Build all layouts on a pure 'Obsidian' (#000000) background.
- Differentiate interactive surfaces using the neutral palette progression: #111111, #1d1d1d, #262626.
- Maintain an 8px border-radius on all primary interactive components like buttons and cards.
- Apply specific letter-spacing rules for the 'Tomorrow' font: negative for large sizes, positive for small.
- Use 'Stark White' (#ffffff) for headlines and 'Ash' (#aaaaaa) or 'Dusk Gray' (#999999) for body copy.

### Don't
- Don't use drop shadows. Use colored surfaces for elevation.
- Don't introduce any new saturated colors. The palette is strictly monochromatic plus one orange accent.
- Don't use 'Ignition Orange' for text, borders, or non-interactive decorations.
- Don't use pill-shaped or fully-rounded buttons. Stick to the 8px radius.
- Don't use light backgrounds. The entire brand experience is dark.
- Don't use 'Tomorrow' for long paragraphs of body text; use 'Inter'.
- Don't use gradients. The aesthetic is solid color blocks.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Base | `#000000` | Page background |
| 1 | Raised | `#111111` | Secondary interactive surfaces |
| 2 | Overlay | `#1d1d1d` | Tertiary buttons and interactive tags |

## Elevation

Elevation is achieved through layered, near-black surfaces (#111111, #1d1d1d) on a pure black (#000000) base, not box shadows. This creates a subtle, self-contained depth reminiscent of physical hardware panels rather than floating UI cards.

## Imagery

Imagery is minimal to non-existent, placing full emphasis on the product's UI and capabilities. The visual language is defined by typography and stark color contrasts, not photography or illustration. Dark, empty containers act as placeholders, suggesting potential for embedded animations or product demos, but the core identity remains text- and UI-centric.

## Layout

The layout is full-bleed and centered, creating an immersive, focused environment. The hero section occupies the entire viewport with a large, centered headline stack. Subsequent content is presented in simple, centered text blocks or contained grid-like structures for tags and categories. Vertical rhythm is spacious, allowing each piece of information to stand alone in the expansive dark space.

## Agent Prompt Guide

### Quick Color Reference:
- **Background:** `Obsidian (#000000)`
- **Text (Headlines):** `Stark White (#ffffff)`
- **Text (Body):** `Ash (#aaaaaa)`
- **Primary CTA:** `Ignition Orange (#ffa41c)`
- **Secondary Button BG:** `Charcoal (#111111)`
- **Borders/Dividers:** `Tarmac (#262626)`

### Example Component Prompts:
1.  **Hero Section:** "Create a hero section with a full-screen `Obsidian (#000000)` background. Add a headline 'DESIGN, CODE, ANIMATE' set in `Tomorrow` font at `40px` with `-1.32px` letter-spacing, color `Stark White (#ffffff)`. Below it, add a primary CTA button: 'Get Started', background `Ignition Orange (#ffa41c)`, text `Stark White (#ffffff)`, `8px` radius, `12px 24px` padding."
2.  **Eyebrow + Heading Block:** "Create a text block. Start with an eyebrow label 'RIVE EDITOR' in all-caps, `Tomorrow` font, `12px`, `Ignition Orange (#ffa41c)` color, `+0.84px` letter-spacing. Below it, add the main heading 'The Real Thing' in `Tomorrow` font, `24px`, `Stark White (#ffffff)`, `+0.19px` letter-spacing. Finally, add paragraph text in `Inter`, `16px`, `Ash (#aaaaaa)` color."
3.  **Tertiary Button Group:** "Create a horizontal group of two small buttons with 16px spacing between them. Button style: `Graphite (#1d1d1d)` background, `Stark White (#ffffff)` text, `8px 10px` padding, `8px` radius. Label them 'Learn More' and 'Features'."

## Similar Brands

- **Linear** — Shares the developer-tool aesthetic with a dark-mode UI, sharp typography, and minimal accent colors.
- **Vercel** — Similar use of a pitch-black background, sharp sans-serif typography, and a minimalist, tech-focused identity.
- **Raycast** — Evokes a similar command-line utility feel with a dark UI, focus on function, and sparse use of color.
- **GitHub Codespaces** — Also uses a dark, code-editor-inspired theme that prioritizes text and function over decorative elements.

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-ignition-orange: #ffa41c;
  --color-obsidian: #000000;
  --color-charcoal: #111111;
  --color-graphite: #1d1d1d;
  --color-tarmac: #262626;
  --color-stark-white: #ffffff;
  --color-cloud: #f1f1f1;
  --color-ash: #aaaaaa;
  --color-dusk-gray: #999999;

  /* Typography — Font Families */
  --font-tomorrow: 'Tomorrow', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-sans-serif: 'sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 11px;
  --leading-caption: 1.1;
  --tracking-caption: 1.1px;
  --text-body: 16px;
  --leading-body: 1.6;
  --text-subheading: 20px;
  --leading-subheading: 1.3;
  --tracking-subheading: 0.2px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: 0.19px;
  --text-heading-lg: 40px;
  --leading-heading-lg: 1;
  --tracking-heading-lg: -1.32px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;

  /* Spacing */
  --spacing-5: 5px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-15: 15px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-27: 27px;
  --spacing-30: 30px;
  --spacing-32: 32px;
  --spacing-39: 39px;
  --spacing-40: 40px;
  --spacing-60: 60px;

  /* Layout */
  --section-gap: 80-120px;
  --card-padding: 16px;
  --element-gap: 8-16px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-2xl: 20px;

  /* Named Radii */
  --radius-tags: 4-8px;
  --radius-cards: 8px;
  --radius-inputs: 8px;
  --radius-buttons: 8px;

  /* Surfaces */
  --surface-base: #000000;
  --surface-raised: #111111;
  --surface-overlay: #1d1d1d;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-ignition-orange: #ffa41c;
  --color-obsidian: #000000;
  --color-charcoal: #111111;
  --color-graphite: #1d1d1d;
  --color-tarmac: #262626;
  --color-stark-white: #ffffff;
  --color-cloud: #f1f1f1;
  --color-ash: #aaaaaa;
  --color-dusk-gray: #999999;

  /* Typography */
  --font-tomorrow: 'Tomorrow', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-sans-serif: 'sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 11px;
  --leading-caption: 1.1;
  --tracking-caption: 1.1px;
  --text-body: 16px;
  --leading-body: 1.6;
  --text-subheading: 20px;
  --leading-subheading: 1.3;
  --tracking-subheading: 0.2px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: 0.19px;
  --text-heading-lg: 40px;
  --leading-heading-lg: 1;
  --tracking-heading-lg: -1.32px;

  /* Spacing */
  --spacing-5: 5px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-15: 15px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-27: 27px;
  --spacing-30: 30px;
  --spacing-32: 32px;
  --spacing-39: 39px;
  --spacing-40: 40px;
  --spacing-60: 60px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-2xl: 20px;
}
```
