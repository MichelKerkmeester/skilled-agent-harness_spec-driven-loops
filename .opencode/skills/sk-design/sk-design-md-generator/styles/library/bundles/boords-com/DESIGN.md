# boords.com — Style Reference
> Warm storyboard studio on cream paper — a cream canvas, amber pencil accents, and flat geometric type that feels hand-drawn even when it's pure UI.

**Theme:** light

Boords operates in a warm, paper-like visual register: a cream canvas (#fafaf5) sits beneath pure white surfaces, with a single amber accent that feels more like a pencil highlight than a digital CTA. The custom 'matter' typeface carries a geometric, friendly character at every scale, with positive tracking on small-caps eyebrows and tight, confident headlines at 32–60px. The interface is deliberately flat — 6px corners are the default radius, shadows are nearly absent, and one dark section (the developer/API area) breaks the cream monotony without disrupting the calm. The aesthetic borrows from the storyboard world it serves: warm neutrals, soft radii, amber-warm action colors, and a hand-drawn quality in the product imagery that makes the UI feel like a creative tool rather than a productivity app.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Warm Cream | `#fafaf5` | `--color-warm-cream` | Page canvas, base surface — replaces pure white to give the interface a paper-like warmth |
| Pure White | `#ffffff` | `--color-pure-white` | Card surfaces, product UI panels, elevated content blocks |
| Ink Black | `#121212` | `--color-ink-black` | Primary text, dark section background, filled nav button, high-contrast borders |
| Stone Gray | `#e9e9e7` | `--color-stone-gray` | Section dividers, subtle alternating surfaces, input field backgrounds |
| Pebble Border | `#cecdca` | `--color-pebble-border` | Hairline borders on cards, dividers between sections, table separators |
| Graphite | `#4d4d4d` | `--color-graphite` | Secondary text, muted body copy, supporting labels |
| Mid Gray | `#7d7d7d` | `--color-mid-gray` | Tertiary text, icon strokes, disabled states, caption metadata |
| Muted Ash | `#898989` | `--color-muted-ash` | Placeholder text, subtle borders, low-emphasis text |
| Warm Gold | `#e8aa42` | `--color-warm-gold` | Primary CTA buttons, active state highlights — the amber pencil-mark accent that makes the single action feel warm and inviting rather than corporate |
| Deep Amber | `#eb6c00` | `--color-deep-amber` | Orange decorative accent for icons, marks, and small graphic details. Do not promote it to the primary CTA color |
| Burnt Honey | `#b77a1e` | `--color-burnt-honey` | Yellow decorative accent for icons, marks, and small graphic details. Do not promote it to the primary CTA color |
| Storyboard Blue | `#214c7e` | `--color-storyboard-blue` | Blue accent for outlined action borders, linked labels, and lightweight interactive emphasis |
| Sketch Blue | `#daeef8` | `--color-sketch-blue` | Hairline borders, dividers, input outlines, and card edges on light surfaces |

## Tokens — Typography

### matter — Primary typeface — custom geometric sans-serif with friendly proportions, used across all UI, body, and display contexts. Weight 400–500 for body and UI, 600–700 for headings and emphasis. · `--font-matter`
- **Substitute:** Inter or DM Sans
- **Weights:** 400, 500, 600, 700
- **Sizes:** 10px, 11px, 12px, 14px, 16px, 17px, 19px, 20px, 24px, 32px, 40px, 60px
- **Line height:** 1.10–1.70 depending on size
- **Letter spacing:** 0.025em at caption (10px), 0.05em at body-sm (12px), 0.1em for small-caps eyebrows (12–14px)
- **Role:** Primary typeface — custom geometric sans-serif with friendly proportions, used across all UI, body, and display contexts. Weight 400–500 for body and UI, 600–700 for headings and emphasis.

### ui-monospace — System monospace for code blocks, API endpoint paths, and technical metadata in the dark developer section · `--font-ui-monospace`
- **Substitute:** SF Mono, Menlo, Consolas
- **Weights:** 400, 500, 600
- **Sizes:** 9px, 11px, 16px
- **Line height:** 1.50
- **Role:** System monospace for code blocks, API endpoint paths, and technical metadata in the dark developer section

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 10px | 1.5 | 0.25px | `--text-caption` |
| body-lg | 17px | 1.5 | — | `--text-body-lg` |
| subheading | 20px | 1.45 | 1.2px | `--text-subheading` |
| heading-sm | 24px | 1.45 | — | `--text-heading-sm` |
| heading | 32px | 1.25 | — | `--text-heading` |
| heading-lg | 40px | 1.2 | — | `--text-heading-lg` |
| display | 60px | 1.1 | — | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** compact

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
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |
| 56 | 56px | `--spacing-56` |
| 64 | 64px | `--spacing-64` |
| 80 | 80px | `--spacing-80` |
| 104 | 104px | `--spacing-104` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 6px |
| pills | 9999px |
| badges | 6px |
| images | 6px |
| inputs | 6px |
| buttons | 6px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| lg | `rgba(255, 255, 255, 0.03) 0px 0px 24px 0px` | `--shadow-lg` |
| subtle | `rgba(108, 188, 244, 0.5) 0px 0px 0px 1px` | `--shadow-subtle` |
| subtle-2 | `rgba(255, 255, 255, 0.1) 0px 0px 0px 1px inset` | `--shadow-subtle-2` |
| sm | `rgba(0, 0, 0, 0.1) 0px 2px 8px 0px` | `--shadow-sm` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 64px
- **Card padding:** 16px
- **Element gap:** 8px

## Components

### Amber CTA Button
**Role:** Primary action button used for the main conversion point (Try Boords Free, Sign Up)

Filled with #e8aa42, text in #121212, 6px border-radius, 10px vertical and 20px horizontal padding, matter 500 at 16px. Single warm-gold button per view — never paired with a second amber button on the same screen.

### Dark Filled Button
**Role:** Secondary navigation action (Log in, dashboard access)

Filled with #121212, text in #ffffff, 6px border-radius, 10px vertical and 20px horizontal padding, matter 500 at 16px. Used in the nav bar for authenticated actions.

### Ghost Text Link
**Role:** Inline link or supplementary action (Watch the demo, Explore API docs)

No background or border, text in #121212 (light theme) or #ffffff (dark section), matter 500 at 16px, underline on text-only links, right-arrow character (→) after text for navigational links. Padding: 0px.

### Storyboard Frame Card
**Role:** Product UI element showing an individual storyboard frame with metadata

White (#ffffff) background, 1px #cecdca border, 6px border-radius, 12px padding. Contains a pencil-sketch image (grayscale), frame number badge, title text (matter 500, 14px), and a small 'IMAGE GENERATOR' label with icon at the bottom. No shadow.

### Comment Thread Item
**Role:** Client feedback comment in the storyboard review interface

White (#ffffff) background, 1px #cecdca border, 6px border-radius, 16px padding. Contains user avatar (24px circle), name (matter 600, 14px, #121212), timestamp (matter 400, 12px, #7d7d7d), and comment text (matter 400, 14px, #4d4d4d). Highlighted replies use #e8aa42 text color for the quoted portion.

### Status Badge
**Role:** Project or frame status indicator (In Progress, Approved, Changes Requested)

6px border-radius, 4px vertical and 10px horizontal padding. Default state: #daeef8 background with #214c7 text and a 6px colored dot prefix. Text in matter 600 at 11px with 0.05em letter-spacing.

### API Endpoint Row
**Role:** HTTP endpoint display in the dark developer section

Dark surface (#121212 background) with HTTP method tag (GET, POST, PATCH, DELETE) as a small pill in the left margin, endpoint path in ui-monospace 400 at 11px in #cecdca, and description text in matter 400 at 12px in #7d7d7d. Method tags use muted semantic colors (green for GET, blue for POST, yellow for PATCH, red for DELETE) at low saturation. 6px border-radius on the overall row card.

### Section Eyebrow Label
**Role:** Small-caps category label above section headlines (e.g., '11 YEARS OF VIDEO PREPRODUCTION SIGN-OFF')

Matter 600 at 11px, uppercase, #7d7d7d text color, 0.1em letter-spacing. No background or border. Sits 12px above the section heading.

### Testimonial Card
**Role:** Social proof quote from a customer

Cream (#fafaf5) background — sits on the white section to create subtle separation, no border, 6px border-radius, 24px padding. Quote text in matter 400 at 16px, #4d4d4d. Company name below in matter 600 at 14px, #121212.

### Logo Bar Item
**Role:** Customer/studio logo in the social proof strip

Monochrome black (#121212) treatment, no background or border, contained within the cream section. Logos are rendered at uniform height (~24px) with consistent spacing (32px between items) in a single horizontal row.

## Do's and Don'ts

### Do
- Use #fafaf5 as the page canvas — the warm cream is the brand's defining surface and should never be replaced with pure white at the base layer.
- Reserve #e8aa42 exclusively for the single primary CTA per view. No secondary amber buttons, no amber icons in the same frame as the CTA.
- Use 6px border-radius as the default for all cards, buttons, inputs, and images. Only use 9999px for pill-shaped tags and the optional pill button variant.
- Apply positive letter-spacing (0.05–0.1em) only to small-caps eyebrows and labels. Body and display text use normal tracking.
- Keep the interface flat: separate layers with 1px #cecdca borders, not drop shadows. The only acceptable shadow is rgba(0,0,0,0.1) 0px 2px 8px for floating product screenshots.
- Use matter at 400 for body, 500 for UI and links, 600–700 for headings. Never set matter below 400 — the typeface loses character at light weights.
- Use ui-monospace only in the dark developer section for API endpoints and code. Body text is always matter.

### Don't
- Don't use #ffffff as the page background — the cream canvas (#fafaf5) is the brand signature, not pure white.
- Don't use #214c7 (storyboard blue) for CTA buttons — it's for links, status badges, and informational accents only. The CTA is always amber.
- Don't apply drop shadows to cards or panels — use 1px borders or the cream-to-white surface difference for separation.
- Don't use border-radius above 12px for cards or panels — 6px is the maximum standard radius. Larger radii break the flat, workspace-like feel.
- Don't place chromatic colors as decoration — every saturated color must serve a function (CTA, link, status, icon accent).
- Don't extend the dark section beyond the developer/API area — the rest of the interface stays on cream and white.
- Don't use the excluded content/code colors (#e5f2d5, #f8dfe6, #ffd1c9, #b6defa) outside of code block and syntax-highlighting contexts.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Cream Canvas | `#fafaf5` | Page-level base — the warm paper-like ground that defines the entire interface |
| 2 | White Card | `#ffffff` | Product UI panels, storyboard frame cards, and elevated content blocks that need to feel crisp against the cream |
| 3 | Stone Section | `#e9e9e7` | Alternate section background for subtle visual separation without a hard border |
| 4 | Dark Workspace | `#121212` | Developer/API section background — the only dark surface, used for the integration showcase |

## Elevation

Boords avoids elevation almost entirely. Cards use 1px pebble borders (#cecdca) rather than shadows to separate from the cream canvas. The only meaningful shadow is rgba(0, 0, 0, 0.1) 0px 2px 8px 0px used sparingly on floating product screenshots. In the dark developer section, surfaces are defined by inner highlights (rgba(255, 255, 255, 0.1) 1px inset) rather than drop shadows. Focus states use a 1px blue ring (rgba(108, 188, 244, 0.5)) rather than glow. The flatness is intentional: it keeps the interface feeling like a workspace rather than a layered app.

## Imagery

The visual language is illustration-first, rooted in the storyboard medium. Product screenshots show hand-drawn pencil-sketch frames — grayscale line art with light washes, evoking animator's thumbnails. The product UI itself is the hero imagery: the storyboard editor, comment threads, and API panel are shown as large embedded screenshots rather than abstract graphics. No photography, no stock imagery, no 3D renders. The only decorative graphics are the hand-drawn storyboard frames within the product UI. Logo bar items (Vidico, Digital Brew, Framestore, etc.) are monochrome black treatment on the cream background, reinforcing the flat, restrained aesthetic. Image treatment: contained within rounded cards (6px radius), never full-bleed except in the hero product showcase.

## Layout

Max-width 1200px centered container, light theme throughout except one dark developer section. Navigation is a simple top bar with left-aligned logo, centered nav links (Features, Resources, About, Pricing), and right-aligned actions (Log in + amber CTA). Hero pattern: text-left, product-screenshot-below, no full-viewport imagery — the headline and subtext sit on the cream canvas with a generous product screenshot spanning the full content width beneath. Section rhythm: consistent vertical breathing room (64px section gaps) with seamless flow between cream and white surfaces. Content arrangement alternates between centered text stacks (hero) and 3-column grids (testimonials, feature cards, logo bar). The dark developer section breaks the pattern: full-width #121212 background with embedded API code panels. Grid usage: 3-column testimonial grid, 3-column logo bar, single-column storyboard frame grid within the product UI. Navigation: minimal top bar, no sticky behavior, no mega-menu.

## Agent Prompt Guide

**Quick Color Reference**
- Text: #121212 (primary), #4d4d4d (secondary), #7d7d7d (tertiary)
- Background: #fafaf5 (canvas), #ffffff (card surface)
- Border: #cecdca (hairline), #e9e9e7 (subtle divider)
- Accent: #214c7e (links, status)
- primary action: #e8aa42 (outlined action border)

**Example Component Prompts**

1. Create an Outlined Primary Action: Transparent background, #e8aa42 border and text, 9999px radius, compact pill padding. Use it for the main CTA instead of a filled button.

2. *Create a storyboard frame card:* White (#ffffff) background, 1px #cecdca border, 6px radius, 12px padding. Placeholder image area (grayscale sketch style) at top. Frame number badge (6px radius, #daeef8 bg, #214c7e text, 11px matter 600). Title at 14px matter 500, #121212. 'IMAGE GENERATOR' label at 11px matter 600, #7d7d7d with small icon.

3. *Create a status badge:* 6px radius, 4px 10px padding, #daeef8 background, 6px #214c7e dot prefix, text 'In Progress' in matter 600 at 11px with 0.05em letter-spacing, #214c7e color.

4. *Create a testimonial card:* #fafaf5 background (sits on a white section), 6px radius, 24px padding, no border. Quote text at 16px matter 400, #4d4d4d. Company name at 14px matter 600, #121212 below the quote.

5. *Create a navigation bar:* White (#ffffff) background, 64px height, matter 500 at 16px nav links in #121212. Left: logo (black 'BOORDS' wordmark). Right: 'Log in' dark filled button (#121212 bg, #ffffff text, 6px radius) and 'Try Boords Free' amber button (#e8aa42 bg, #121212 text, 6px radius).

## Similar Brands

- **Pitch** — Shares the warm cream canvas, amber/gold primary accent, and geometric sans-serif typography — the same paper-like workspace aesthetic
- **Frame.io** — Same light-theme product UI with flat cards, hairline borders, and minimal shadows — both serve video production professionals with clean, tool-like interfaces
- **Linear** — Compact density, 6px radii, nearly shadowless flat surfaces, and a restrained chromatic palette with one functional accent color
- **Notion** — Warm neutral palette, minimal elevation, and a workspace-like flatness that makes the interface feel like a document rather than an app
- **Figma** — Creative-tool aesthetic with contained product UI panels, monochrome logo bars, and a light-theme-first design with minimal decorative chrome

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-warm-cream: #fafaf5;
  --color-pure-white: #ffffff;
  --color-ink-black: #121212;
  --color-stone-gray: #e9e9e7;
  --color-pebble-border: #cecdca;
  --color-graphite: #4d4d4d;
  --color-mid-gray: #7d7d7d;
  --color-muted-ash: #898989;
  --color-warm-gold: #e8aa42;
  --color-deep-amber: #eb6c00;
  --color-burnt-honey: #b77a1e;
  --color-storyboard-blue: #214c7e;
  --color-sketch-blue: #daeef8;

  /* Typography — Font Families */
  --font-matter: 'matter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-ui-monospace: 'ui-monospace', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.5;
  --tracking-caption: 0.25px;
  --text-body-lg: 17px;
  --leading-body-lg: 1.5;
  --text-subheading: 20px;
  --leading-subheading: 1.45;
  --tracking-subheading: 1.2px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.45;
  --text-heading: 32px;
  --leading-heading: 1.25;
  --text-heading-lg: 40px;
  --leading-heading-lg: 1.2;
  --text-display: 60px;
  --leading-display: 1.1;

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
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-56: 56px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-104: 104px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 64px;
  --card-padding: 16px;
  --element-gap: 8px;

  /* Border Radius */
  --radius-md: 6px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-2xl-2: 21.6px;
  --radius-full: 9999px;

  /* Named Radii */
  --radius-cards: 6px;
  --radius-pills: 9999px;
  --radius-badges: 6px;
  --radius-images: 6px;
  --radius-inputs: 6px;
  --radius-buttons: 6px;

  /* Shadows */
  --shadow-lg: rgba(255, 255, 255, 0.03) 0px 0px 24px 0px;
  --shadow-subtle: rgba(108, 188, 244, 0.5) 0px 0px 0px 1px;
  --shadow-subtle-2: rgba(255, 255, 255, 0.1) 0px 0px 0px 1px inset;
  --shadow-sm: rgba(0, 0, 0, 0.1) 0px 2px 8px 0px;

  /* Surfaces */
  --surface-cream-canvas: #fafaf5;
  --surface-white-card: #ffffff;
  --surface-stone-section: #e9e9e7;
  --surface-dark-workspace: #121212;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-warm-cream: #fafaf5;
  --color-pure-white: #ffffff;
  --color-ink-black: #121212;
  --color-stone-gray: #e9e9e7;
  --color-pebble-border: #cecdca;
  --color-graphite: #4d4d4d;
  --color-mid-gray: #7d7d7d;
  --color-muted-ash: #898989;
  --color-warm-gold: #e8aa42;
  --color-deep-amber: #eb6c00;
  --color-burnt-honey: #b77a1e;
  --color-storyboard-blue: #214c7e;
  --color-sketch-blue: #daeef8;

  /* Typography */
  --font-matter: 'matter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-ui-monospace: 'ui-monospace', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.5;
  --tracking-caption: 0.25px;
  --text-body-lg: 17px;
  --leading-body-lg: 1.5;
  --text-subheading: 20px;
  --leading-subheading: 1.45;
  --tracking-subheading: 1.2px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.45;
  --text-heading: 32px;
  --leading-heading: 1.25;
  --text-heading-lg: 40px;
  --leading-heading-lg: 1.2;
  --text-display: 60px;
  --leading-display: 1.1;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-28: 28px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-56: 56px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-104: 104px;

  /* Border Radius */
  --radius-md: 6px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-2xl-2: 21.6px;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-lg: rgba(255, 255, 255, 0.03) 0px 0px 24px 0px;
  --shadow-subtle: rgba(108, 188, 244, 0.5) 0px 0px 0px 1px;
  --shadow-subtle-2: rgba(255, 255, 255, 0.1) 0px 0px 0px 1px inset;
  --shadow-sm: rgba(0, 0, 0, 0.1) 0px 2px 8px 0px;
}
```
