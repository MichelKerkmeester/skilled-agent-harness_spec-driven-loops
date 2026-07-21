# Foodnoms — Style Reference
> Sunlit fruit market on white porcelain — warm orange, fresh green, and generous rounded forms

**Theme:** light

Foodnoms presents a sunlit nutrition-tracker marketing language: pure white canvas, oversized phone mockups as the visual anchor, and a playful chromatic vocabulary where color codes nutrients and progress. The two-tone headline convention (one color for the win word, dark graphite for the rest) makes the value proposition scannable in a glance. The system leans on a single custom display face (Aquawax Pro) with a distinctly rounded, geometric character that softens the dense data-heavy app screens. Most surfaces are flat and shadowless; a uniform 26px corner radius gives buttons, cards, and tags a friendly, pillow-like feel that makes health tracking feel approachable rather than clinical.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Ember Orange | `#ff5406` | `--color-ember-orange` | Orange supporting accent for decorative details and low-frequency emphasis. Do not promote it to the primary CTA color |
| Verdant Green | `#00b33f` | `--color-verdant-green` | Green supporting accent for decorative details and low-frequency emphasis |
| Signal Red-Orange | `#ff3400` | `--color-signal-red-orange` | Secondary warm accent visible in app screen UI elements and supporting brand moments. Sits one step hotter than Ember Orange for emphasis on selected or active app states |
| Sky Blue | `#00a9dd` | `--color-sky-blue` | Cool counter-accent for app-internal data categories (carbs/protein/other nutrient groupings). Balances the warm-dominant palette inside phone mockups |
| Mist Blue | `#72a2c5` | `--color-mist-blue` | Muted cool accent — softens Sky Blue for secondary data labels and chart backgrounds inside the app surfaces |
| Sunset Orange | `#ff6d00` | `--color-sunset-orange` | Warm accent for secondary headings and emphasis text within the marketing pages |
| Amber | `#945300` | `--color-amber` | Deep warm accent for data-heavy text and chart labels in the app's nutrition displays |
| Alert Red | `#ff001e` | `--color-alert-red` | Red supporting accent for decorative details and low-frequency emphasis |
| Plum | `#bd4be5` | `--color-plum` | Accent for the carbs/protein/fat macro rings and category tags inside the app interface |
| Iris | `#5856de` | `--color-iris` | Accent for headings and emphasis text on supporting pages, and for specific data categories inside the app |
| Electric Blue | `#0099f9` | `--color-electric-blue` | Accent for bold headings and highlighted text on supporting pages |
| Graphite | `#2f2f2f` | `--color-graphite` | Primary text, dark buttons (App Store badge), and icon strokes. The dominant non-white color in headings and body copy |
| Charcoal | `#000000` | `--color-charcoal` | Maximum-emphasis text and icon fills. Used sparingly — reserved for the darkest typographic moments and SVG icon details |
| Fog | `#f5f5f5` | `--color-fog` | Alternate canvas for cards, feature sections, and soft UI containers. Distinguishes elevated content blocks from the white page |
| Paper White | `#ffffff` | `--color-paper-white` | Dominant page background, button text, and card surfaces. The base layer of the entire visual system |

## Tokens — Typography

### Aquawax Pro Medium — Aquawax Pro Medium — detected in extracted data but not described by AI · `--font-aquawax-pro-medium`
- **Weights:** 500
- **Sizes:** 17px, 20px
- **Line height:** 1.6, 1.8
- **OpenType features:** `"blwf", "cv03", "cv04", "cv09", "cv11", "dlig", "ss01", "ss02", "ss03"`
- **Role:** Aquawax Pro Medium — detected in extracted data but not described by AI

### Aquawax Pro — Primary brand typeface used across all display, heading, and body contexts. The custom face has a wide x-height, rounded geometric forms, and friendly proportions. Bold (700) is used for the 60px display and 30px section headlines — these are the system's typographic anchors. DemiBold (600) handles subheadings and button labels at 14–16px. Medium (500) carries body copy at 17–20px with generous 1.6–1.8 line-height for comfortable reading. · `--font-aquawax-pro`
- **Substitute:** Nunito Sans, or DM Sans
- **Weights:** 700, 500, 600
- **Sizes:** 12, 14, 16, 17, 18, 20, 22, 30, 60
- **Line height:** 1.2 / 1.4 / 1.6 / 1.8
- **OpenType features:** `"blwf", "cv03", "cv04", "cv09", "cv11", "dlig", "ss01", "ss02", "ss03", "ss07"`
- **Role:** Primary brand typeface used across all display, heading, and body contexts. The custom face has a wide x-height, rounded geometric forms, and friendly proportions. Bold (700) is used for the 60px display and 30px section headlines — these are the system's typographic anchors. DemiBold (600) handles subheadings and button labels at 14–16px. Medium (500) carries body copy at 17–20px with generous 1.6–1.8 line-height for comfortable reading.

### System sans-serif — Fallback for very small UI text and icon labels. Aquawax Pro is not used at micro sizes; system font handles them to keep render weight low. · `--font-system-sans-serif`
- **Weights:** 400, 700
- **Sizes:** 12
- **Line height:** 1.2
- **Role:** Fallback for very small UI text and icon labels. Aquawax Pro is not used at micro sizes; system font handles them to keep render weight low.

### Aquawax Pro DemiBold — Aquawax Pro DemiBold — detected in extracted data but not described by AI · `--font-aquawax-pro-demibold`
- **Weights:** 600
- **Sizes:** 14px, 16px
- **Line height:** 1.2, 1.4
- **OpenType features:** `"blwf", "cv03", "cv04", "cv09", "cv11", "dlig", "ss01", "ss02", "ss03", "ss07"; "blwf", "cv03", "cv04", "cv09", "cv11", "dlig", "ss01", "ss02", "ss03"`
- **Role:** Aquawax Pro DemiBold — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| tiny | 12px | 1.2 | — | `--text-tiny` |
| caption | 14px | 1.2 | — | `--text-caption` |
| body-sm | 16px | 1.4 | — | `--text-body-sm` |
| subheading | 20px | 1.8 | — | `--text-subheading` |
| heading-sm | 22px | 1.2 | — | `--text-heading-sm` |
| heading | 30px | 1.2 | — | `--text-heading` |
| display | 60px | 1.2 | — | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 8px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 8 | 8px | `--spacing-8` |
| 24 | 24px | `--spacing-24` |
| 32 | 32px | `--spacing-32` |
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |
| 56 | 56px | `--spacing-56` |
| 64 | 64px | `--spacing-64` |
| 96 | 96px | `--spacing-96` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 26px |
| cards | 26px |
| inputs | 26px |
| buttons | 26px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 96px
- **Card padding:** 32px
- **Element gap:** 20px

## Components

### Brand Wordmark
**Role:** Site identity in header and footer

Logomark: a rounded orange square (color: Ember Orange) containing a white bar-chart icon. Wordmark: 'Foodnoms' in Aquawax Pro Bold, 18px, Graphite (#2f2f2f), sitting to the right of the icon. Total lockup height ~32px.

### Header Filled Button
**Role:** Primary brand action in the navigation bar

Filled Ember Orange (#ff5406) background, white text 'Get the App' in Aquawax Pro DemiBold at ~16px, arrow icon after label. 26px border-radius, ~12px vertical padding, ~20px horizontal padding. Sits at the far right of the header.

### Ghost Nav Link
**Role:** Secondary navigation items

No background, Graphite (#2f2f2f) text, Aquawax Pro Medium ~16–17px, no underline. Hover/active state not detected; default is text-only.

### App Store Badge
**Role:** Download CTA in the hero

Dark Graphite (#2f2f2f) rounded rectangle (~26px radius), Apple logo in white, 'Download on the App Store' text in white Aquawax Pro. ~56px tall. Sits centered beneath the hero subheadline.

### Two-Tone Display Headline
**Role:** Hero page title

60px Aquawax Pro Bold, line-height 1.2. First phrase ('Lose Weight') in Verdant Green (#00b33f), second phrase ('with Foodnoms') in Graphite (#2f2f2f). Center-aligned, max-width constrained to keep the color split legible.

### Section Accent Heading
**Role:** Feature section titles

30px Aquawax Pro Bold. Often appears in Ember Orange (#ff5406) or a mix of two chromatic colors to maintain the brand's two-tone headline pattern. 'Effortlessly' in one accent, 'Scan Food' in another.

### Phone Mockup Carousel
**Role:** Visual showcase of the app interface

Full device-frame iPhone renders at ~280px width, fanned out with slight overlap and rotation. No background card — they float directly on the white page. Contain the full app UI including status bar, navigation, and content screens.

### Press Logo Grid
**Role:** Social proof / media mentions

2-row × 3-column grid of grayscale publication logos (MacStories, iMore, 9TO5Mac, POPSUGAR, Good Housekeeping, Prevention). Rendered in Charcoal (#000000) or Graphite (#2f2f2f), evenly spaced with ~64px column gap. Heading 'As Featured By' in Ember Orange above.

### Download CTA Card
**Role:** Sticky promotional banner

White card with subtle Fog (#f5f5f5) background, 26px radius, ~32px padding. Contains a headline ('Get Started with Foodnoms Today'), subtext, and a filled Ember Orange 'Download' button with arrow icon. Sits at the bottom of the page above feature sections.

### App-Internal Data Card
**Role:** Nutrition summary panel (shown inside phone mockups)

White card with ~26px radius, light gray dividers. Contains large bold metric (e.g. '57g' for fat grams) in Verdant Green or Signal Red-Orange depending on positive/negative status, with secondary label text in Graphite at ~12–14px.

### Macro Category Ring
**Role:** Circular progress indicator for nutrition goals

Circular ring showing progress toward a macro goal (Calories, Carbs, Fat, Protein). Each category has a distinct color: Signal Red-Orange for Calories, Sky Blue for Carbs, Verdant Green for Fat, Plum for Protein. Ring stroke ~8px, centered numeric value inside in Aquawax Pro Bold.

### Food Log Entry Row
**Role:** List item showing a logged food

White background row with bottom hairline border in Fog (#f5f5f5). Left side: food name in Graphite Aquawax Pro Medium ~17px, with macro subtext below in lighter gray ~14px. Right side: colored dot indicating macro category, with point values in matching color.

### Tab Bar
**Role:** Bottom navigation in the app

White bar with three tab icons (Food Log, Insights, Library), separated by thin gray dividers. Active tab indicated by Ember Orange fill/icon color and small dot indicator. Right edge has a floating Ember Orange circular '+' button for adding food.

### Goal Setup Card
**Role:** Onboarding/setting screen container

White card, 26px radius, ~40px padding. Contains a heading, body text explaining the goal option, and a filled Ember Orange button ('Use Recommended Goal') stacked above a text-style 'Choose a Custom Goal' link. Decorative donut/breakfast icon at top.

## Do's and Don'ts

### Do
- Use 26px border-radius on every interactive element and card — this is the system's signature softness
- Apply the two-tone headline pattern: one color for the outcome word, Graphite (#2f2f2f) for the rest
- Use Aquawax Pro Bold at 60px for hero displays and 30px for section headings — never interpolate intermediate sizes
- Pair Verdant Green (#00b33f) with positive/progress data and Signal Red-Orange (#ff3400) with negative/overage data inside app screens
- Use generous 96px section gaps between major page sections to let phone mockups breathe
- Keep all text on white or Fog (#f5f5f5) — never place chromatic text on chromatic backgrounds
- Show 3+ phone mockups side-by-side in the hero, slightly overlapping, to demonstrate the breadth of the app experience

### Don't
- Don't use box-shadows or drop-shadows anywhere — the system is deliberately flat
- Don't use a border-radius other than 26px on buttons, cards, tags, or inputs
- Don't call any color a 'CTA' or 'primary action' in the token system — describe them by their brand role instead
- Don't use Aquawax Pro at sizes below 12px — fall back to system sans-serif for micro UI
- Don't place chromatic text on a chromatic background — always pair color text with white or Fog
- Don't use gradient backgrounds or gradient buttons — the system is solid color only
- Don't introduce new chromatic colors for marketing pages — the warm-primary + cool-accent + app-data palette is complete

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Paper White | `#ffffff` | Dominant page canvas and base surface |
| 1 | Fog | `#f5f5f5` | Alternate canvas for feature sections and soft card containers |
| 2 | Graphite | `#2f2f2f` | Dark inverted surface for the App Store download badge |
| 3 | Ember Orange | `#ff5406` | High-emphasis filled surface for the primary header button |

## Elevation

The system is deliberately flat. No box-shadows are used anywhere — depth is created through color contrast and the 26px radius instead of drop shadows. This keeps the page feeling light, fast, and friendly.

## Imagery

The visual language is dominated by high-fidelity iPhone device-frame mockups showing the live app interface — these are the heroes, not stock photography. The mockups are rendered at near-full opacity, fanned out with slight overlap and gentle rotation, floating directly on white. Inside the mockups, the app's own UI provides all the visual richness: nutrition data, food photos, macro rings, and colorful category tags. The only photographic content is user-submitted food imagery visible within the app's 'Scan Your Food' camera screen. No lifestyle photography, no abstract illustrations, no decorative graphics. The brand identity is carried entirely by the custom typeface, the orange/green/dark color system, and the app's own interface.

## Layout

The page is a single-column, centered max-width layout (~1200px) with generous vertical rhythm. The header is a thin top bar with logo left, nav center, and filled orange action button right. The hero is a centered stack: two-tone display headline, single-line subhead, App Store badge, then a row of 3–5 phone mockups fanned across the full width. Below the hero, a centered 'As Featured By' press logo section in a 2×3 grid. Feature sections follow in a repeating pattern: two-column text + phone mockup, alternating sides, with section accent headings in orange/green. The final element before the footer is a full-width download CTA card. Section gaps are large (96px) creating a spacious, gallery-like feel. The navigation is a minimal top bar — no sidebar, no mega-menu.

## Agent Prompt Guide

## Quick Color Reference

- Primary text: #2f2f2f (Graphite)
- Background: #ffffff (Paper White)
- Alternate surface: #f5f5f5 (Fog)
- Brand accent (filled button, logo, heading color): #ff5406 (Ember Orange)
- Achievement accent (headline color, positive data): #00b33f (Verdant Green)
- App-internal cool accent: #00a9dd (Sky Blue)
- primary action: no distinct CTA color

## Example Component Prompts

1. **Hero Section**: White (#ffffff) background. Two-tone headline at 60px Aquawax Pro Bold, line-height 1.2: first phrase in Verdant Green (#00b33f), second phrase in Graphite (#2f2f2f), centered. Subtext in Graphite Aquawax Pro Medium 17px, line-height 1.6. Dark Graphite (#2f2f2f) App Store badge below, 26px radius, ~56px tall. Row of 3–5 iPhone mockups fanned across the width below.

2. **Feature Section Heading**: 30px Aquawax Pro Bold, line-height 1.2, in Ember Orange (#ff5406) for the first word and Graphite (#2f2f2f) for the second word, left-aligned. 96px top padding from previous section.

3. **Filled Brand Button**: Ember Orange (#ff5406) background, white text in Aquawax Pro DemiBold 16px, line-height 1.2, 26px border-radius, 12px vertical padding, 20px horizontal padding, with a small white arrow icon after the label.

4. **Press Logo Grid**: 2 rows × 3 columns of grayscale publication logos in Charcoal (#000000) or Graphite (#2f2f2f), 64px column gap, centered. Heading 'As Featured By' above in Ember Orange (#ff5406) at 20px Aquawax Pro Medium.

No distinct primary action color was observed; use the extracted neutral button treatments instead of inventing a filled CTA color.

## Two-Tone Headline System

A signature convention across the site: split a headline into two phrases, color the first (the verb/outcome) in a chromatic accent and the second (the object/brand) in Graphite. The accent color signals the *action* or *result*, while the dark second phrase anchors the sentence. Typical pairings: Verdant Green + Graphite for the hero (growth/winning), Ember Orange + Graphite for feature sections (action/enablement), or Ember Orange + Verdant Green for dual-accent section titles like 'Effortlessly Scan Food / Faster with AI'. Never use two chromatic colors as solid blocks of equal weight — the dark phrase is always the longer one.

## Similar Brands

- **MyFitnessPal** — Same single-column marketing page structure with phone mockup hero rows and two-tone headlines over a white canvas
- **Cronometer** — Similar large rounded display typography and warm-primary + cool-accent color logic for nutrition data dashboards
- **Yazio** — Same generous 26px+ corner radius treatment and friendly geometric sans-serif display type for health tracking
- **Notion** — Same flat-shadowless white-canvas approach with colorful accent typography and device-frame product showcases

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-ember-orange: #ff5406;
  --color-verdant-green: #00b33f;
  --color-signal-red-orange: #ff3400;
  --color-sky-blue: #00a9dd;
  --color-mist-blue: #72a2c5;
  --color-sunset-orange: #ff6d00;
  --color-amber: #945300;
  --color-alert-red: #ff001e;
  --color-plum: #bd4be5;
  --color-iris: #5856de;
  --color-electric-blue: #0099f9;
  --color-graphite: #2f2f2f;
  --color-charcoal: #000000;
  --color-fog: #f5f5f5;
  --color-paper-white: #ffffff;

  /* Typography — Font Families */
  --font-aquawax-pro-medium: 'Aquawax Pro Medium', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-aquawax-pro: 'Aquawax Pro', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-system-sans-serif: 'System sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-aquawax-pro-demibold: 'Aquawax Pro DemiBold', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-tiny: 12px;
  --leading-tiny: 1.2;
  --text-caption: 14px;
  --leading-caption: 1.2;
  --text-body-sm: 16px;
  --leading-body-sm: 1.4;
  --text-subheading: 20px;
  --leading-subheading: 1.8;
  --text-heading-sm: 22px;
  --leading-heading-sm: 1.2;
  --text-heading: 30px;
  --leading-heading: 1.2;
  --text-display: 60px;
  --leading-display: 1.2;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-unit: 8px;
  --spacing-8: 8px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-56: 56px;
  --spacing-64: 64px;
  --spacing-96: 96px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 96px;
  --card-padding: 32px;
  --element-gap: 20px;

  /* Border Radius */
  --radius-3xl: 26px;

  /* Named Radii */
  --radius-tags: 26px;
  --radius-cards: 26px;
  --radius-inputs: 26px;
  --radius-buttons: 26px;

  /* Surfaces */
  --surface-paper-white: #ffffff;
  --surface-fog: #f5f5f5;
  --surface-graphite: #2f2f2f;
  --surface-ember-orange: #ff5406;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-ember-orange: #ff5406;
  --color-verdant-green: #00b33f;
  --color-signal-red-orange: #ff3400;
  --color-sky-blue: #00a9dd;
  --color-mist-blue: #72a2c5;
  --color-sunset-orange: #ff6d00;
  --color-amber: #945300;
  --color-alert-red: #ff001e;
  --color-plum: #bd4be5;
  --color-iris: #5856de;
  --color-electric-blue: #0099f9;
  --color-graphite: #2f2f2f;
  --color-charcoal: #000000;
  --color-fog: #f5f5f5;
  --color-paper-white: #ffffff;

  /* Typography */
  --font-aquawax-pro-medium: 'Aquawax Pro Medium', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-aquawax-pro: 'Aquawax Pro', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-system-sans-serif: 'System sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-aquawax-pro-demibold: 'Aquawax Pro DemiBold', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-tiny: 12px;
  --leading-tiny: 1.2;
  --text-caption: 14px;
  --leading-caption: 1.2;
  --text-body-sm: 16px;
  --leading-body-sm: 1.4;
  --text-subheading: 20px;
  --leading-subheading: 1.8;
  --text-heading-sm: 22px;
  --leading-heading-sm: 1.2;
  --text-heading: 30px;
  --leading-heading: 1.2;
  --text-display: 60px;
  --leading-display: 1.2;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-56: 56px;
  --spacing-64: 64px;
  --spacing-96: 96px;

  /* Border Radius */
  --radius-3xl: 26px;
}
```
