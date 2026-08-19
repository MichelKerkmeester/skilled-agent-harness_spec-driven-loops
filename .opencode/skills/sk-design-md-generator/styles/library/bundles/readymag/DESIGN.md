# Readymag — Style Reference
> Designer's editorial playground — a restrained white shell around bold, magazine-grade color blocks.

**Theme:** light

Readymag is a designer's editorial playground: a white-canvas product shell wrapped around an unmistakably bold, magazine-grade visual identity. The interface stays restrained — pure white background, near-black text, hairline borders — so the real work happens in feature blocks painted in saturated solid panels (electric violet, cobalt blue, ember orange, pure black, signal yellow). Typography carries enormous personality: a custom geometric display face at 30–80px with aggressively tight negative tracking does the heavy lifting for headlines, while a quieter workhorse sans handles body and UI. Components feel hand-set rather than templated — pill-shaped CTAs, thick section margins, and card surfaces that confidently fill their panels with color instead of nudging content forward with elevation. The result reads less like SaaS and more like a creative agency's homepage.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Electric Violet | `#8800ff` | `--color-electric-violet` | Headline accents, decorative strokes, feature callouts — vivid violet against the white canvas makes typographic moments feel electric and editorial rather than corporate |
| Deep Violet | `#2c0fb1` | `--color-deep-violet` | Secondary violet accent, decorative borders and outlines paired with the primary violet for layered brand moments |
| Ember Orange | `#ff5000` | `--color-ember-orange` | Orange supporting accent for decorative details and low-frequency emphasis. Do not promote it to the primary CTA color |
| Burnt Orange | `#ec520b` | `--color-burnt-orange` | Orange supporting accent for decorative details and low-frequency emphasis. Do not promote it to the primary CTA color |
| Signal Yellow | `#ffcc00` | `--color-signal-yellow` | Decorative full-bleed accent bands and section dividers — appears in few places but dominates attention where it does |
| Cobalt Blue | `#1551ff` | `--color-cobalt-blue` | Supporting palette color for small decorative accents when the core palette needs contrast. Do not promote it to the primary CTA color |
| Ink Black | `#000000` | `--color-ink-black` | Pure black for solid feature card backgrounds and the strongest typographic moments — makes colored cards feel printed, not screen-painted |
| Graphite | `#282828` | `--color-graphite` | Primary text color for body copy, links, and most UI text — the workhorse near-black that keeps reading comfortable without going full contrast |
| Carbon | `#141414` | `--color-carbon` | Slightly deeper text tone used in specific body and border contexts for a richer near-black |
| Near Black | `#0f0e0e` | `--color-near-black` | Heading text color — pushed darker than body for stronger hierarchy against the white canvas |
| Paper White | `#ffffff` | `--color-paper-white` | Light supporting surface for subtle backgrounds and section separation. Do not promote it to the primary CTA color |
| Fog Gray | `#f4f4f4` | `--color-fog-gray` | Subtle surface elevation for inputs, inactive controls, and the softest card backgrounds |
| Mist Gray | `#e7e7e7` | `--color-mist-gray` | Hairline borders, dividers, placeholder fills — the minimum-contrast separator |
| Steel Gray | `#808080` | `--color-steel-gray` | Muted helper text, icon stroke, and secondary metadata — sits between body text and true gray for ambient labels |

## Tokens — Typography

### -apple-system — -apple-system — detected in extracted data but not described by AI · `--font-apple-system`
- **Weights:** 400
- **Sizes:** 16px
- **Line height:** 1, 1.25
- **Letter spacing:** -0.006
- **OpenType features:** `"dlig" 0, "hlig" 0, "liga" 0, "rlig" 0, "smcp" 0`
- **Role:** -apple-system — detected in extracted data but not described by AI

### Readymag Display (custom) — Headlines, display copy, and large feature titles. The signature choice: a geometric sans pushed to 80px with -0.067em tracking, which makes letters visually touch and creates a tightly-set editorial title block. The 0.88 line-height on the 16px bold variant ('xgnl') is anti-conventional and creates stacked, compressed display moments in feature panels. Use for anything that needs to feel like magazine cover type. · `--font-readymag-display-custom`
- **Substitute:** Suisse Int'l
- **Weights:** 400, 700
- **Sizes:** 12, 14, 18, 30, 32, 40, 80
- **Line height:** 0.88, 1.00, 1.43, 1.83, 2.67, 2.70
- **Letter spacing:** -0.067em at 80px, -0.053em at 40px, -0.05em at 32px, -0.044em at 30px, -0.027em at 18px, -0.025em at 14px, -0.014em at 12px
- **OpenType features:** `"dlig" 0, "liga" 0`
- **Role:** Headlines, display copy, and large feature titles. The signature choice: a geometric sans pushed to 80px with -0.067em tracking, which makes letters visually touch and creates a tightly-set editorial title block. The 0.88 line-height on the 16px bold variant ('xgnl') is anti-conventional and creates stacked, compressed display moments in feature panels. Use for anything that needs to feel like magazine cover type.

### Graphik — Secondary body and link face for utilitarian contexts where the system stack would feel too generic but full display weight would be wasteful. Its near-zero tracking keeps body paragraphs tight and modern. · `--font-graphik`
- **Substitute:** Inter
- **Weights:** 400
- **Sizes:** 12, 16
- **Line height:** 1.50, 2.00
- **Letter spacing:** -0.003em at 16px, -0.002em at 12px
- **Role:** Secondary body and link face for utilitarian contexts where the system stack would feel too generic but full display weight would be wasteful. Its near-zero tracking keeps body paragraphs tight and modern.

### System UI — Default body and UI text fallback — quietly supports the custom faces rather than competing. Tiny negative tracking (-0.006em) keeps it from feeling like a default browser font. · `--font-system-ui`
- **Substitute:** -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif
- **Weights:** 400
- **Sizes:** 16
- **Line height:** 1.00, 1.25
- **Letter spacing:** -0.006em at 16px
- **OpenType features:** `"liga" 0, "rlig" 0`
- **Role:** Default body and UI text fallback — quietly supports the custom faces rather than competing. Tiny negative tracking (-0.006em) keeps it from feeling like a default browser font.

### custom_37866 — custom_37866 — detected in extracted data but not described by AI · `--font-custom37866`
- **Weights:** 400, 700
- **Sizes:** 12px, 14px, 18px, 30px, 32px, 40px, 80px
- **Line height:** 1, 1.43, 1.83, 2.67, 2.7
- **Letter spacing:** -0.067, -0.053, -0.05, -0.044, -0.027, -0.025, -0.014
- **OpenType features:** `"dlig" 0, "hlig" 0, "liga" 0, "rlig" 0, "smcp" 0`
- **Role:** custom_37866 — detected in extracted data but not described by AI

### xgnl — xgnl — detected in extracted data but not described by AI · `--font-xgnl`
- **Weights:** 700
- **Sizes:** 16px
- **Line height:** 0.88
- **Letter spacing:** -0.056
- **OpenType features:** `"dlig" 0, "hlig" 0, "liga" 0, "rlig" 0, "smcp" 0`
- **Role:** xgnl — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1 | -0.168px | `--text-caption` |
| body-sm | 14px | 1.43 | -0.35px | `--text-body-sm` |
| body | 16px | 1.5 | -0.048px | `--text-body` |
| subheading | 18px | 2.67 | -0.486px | `--text-subheading` |
| heading-sm | 30px | 2.7 | -1.32px | `--text-heading-sm` |
| heading | 32px | 1.83 | -1.6px | `--text-heading` |
| heading-lg | 40px | 1.43 | -2.12px | `--text-heading-lg` |
| display | 80px | 0.88 | -5.36px | `--text-display` |

## Tokens — Spacing & Shapes

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 6 | 6px | `--spacing-6` |
| 14 | 14px | `--spacing-14` |
| 15 | 15px | `--spacing-15` |
| 16 | 16px | `--spacing-16` |
| 20 | 20px | `--spacing-20` |
| 24 | 24px | `--spacing-24` |
| 30 | 30px | `--spacing-30` |
| 86 | 86px | `--spacing-86` |
| 201 | 201px | `--spacing-201` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 16px |
| pills | 200px |
| small | 10px |
| panels | 20px |
| buttons | 200px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 86px
- **Card padding:** 24px
- **Element gap:** 6px

## Components

### Primary Pill CTA
**Role:** Filled call-to-action button (Sign up, Try Readymag)

Pill shape at 200px border-radius, filled in #ff5000 Ember Orange with Paper White text in the custom display face at 14–16px, weight 700. Padding roughly 12px vertical, 24px horizontal. The only warm, saturated button in the system — it must stand alone, not be repeated in clusters.

### Outlined Pill Button
**Role:** Secondary action button (Log in)

Pill shape at 200px border-radius, transparent or white fill, 1.5px border in #0f0e0 Near Black, text in #0f0e0e. Same dimensions as the primary pill so they pair cleanly in a nav row. Never fill the outlined variant with color — its job is to sit beside the orange and not compete.

### Ghost Nav Pill
**Role:** Navigation menu items (Solutions, Pricing, Examples, Templates, Learn)

Same pill radius (200px) but with no visible border or fill at rest, becoming a subtle background on hover. Text in Graphik or system at 14–16px, weight 400, Graphite. The shared pill shape across all interactive elements is the key — it creates a visual vocabulary of capsules floating in the header.

### Solid Color Feature Card
**Role:** Large content card for feature sections (Attract with interactivity, Streamline teamwork)

Full panel filled with #000000 Ink Black or #ff5000 Ember Orange, no shadow, no border. Headline sits directly on the color at 30–40px display weight with white or near-black text. Padding 40–60px. These cards occupy generous screen real estate and are the signature visual element — never reduce them to a compact widget.

### Interactive Demo Panel
**Role:** Editor preview surfaces (drag-and-drop, snap controls)

Filled with #1551ff Cobalt Blue or another saturated brand color, 16–20px corner radius, contains floating UI controls in white pills (Snap, Sizes, Guides, Grid) with small caption text. The panel demonstrates the product by being the product — a self-aware showcase surface.

### Yellow Accent Band
**Role:** Full-bleed horizontal section divider and feature highlight

Saturated #ffcc00 Signal Yellow filling the full width of a section, paired with a white or off-white text panel offset to the right or left. Used sparingly — one or two per page — to break visual rhythm and create a print-magazine page-turn moment.

### Project Showcase Tile
**Role:** Portfolio/grid items in the hero masonry

Variable aspect-ratio rectangles filled with project thumbnails, minimal 4–10px radius, no border, no shadow. Arranged in a loose grid that mimics a designer's moodboard rather than a uniform product gallery. The tiles are the content — no chrome around them.

### Section Heading Block
**Role:** Large left-aligned section title with supporting body text

Display face at 30–40px, Near Black #0f0e0, tight tracking. Body copy below in Graphik 16px Graphite. Optional small eyebrow label above in uppercase caption. Generous top/bottom margin (86px section gap) to let the heading breathe.

### Caption / Eyebrow Label
**Role:** Small uppercase or tight-set labels above headings or inside feature panels

Display face at 12–14px, weight 700, tracking tightened further (-0.025em). Sits above section headlines as a category tag. Sometimes reversed to white on dark cards.

### Layered Display Type Stack
**Role:** Multi-line headline treatment inside solid color cards (Collaborate / Connect domain / Publish / Delete)

Each line in the custom display face at 30–40px, with a small circular bullet or icon marker on one line, and lines layered with partial opacity or overlapping positioning. This is the editorial signature — headlines that feel set in a layout program, not typeset in CSS.

### Footer / Body Link
**Role:** Inline text links in body copy

Graphite #282828 text at 16px Graphik with a subtle underline on hover, or underlined at rest for important inline links. No buttons-as-links; links stay as text.

## Do's and Don'ts

### Do
- Use the 200px pill radius for every button in the system — outline, filled, and ghost controls all share the capsule shape to create a unified button vocabulary
- Reach for the custom display face at 30px or above for any heading; body and subheading sizes (12–18px) belong to Graphik and the system stack, never the display face
- Fill feature cards with solid color (#000000, #ff5000, #1551ff) instead of adding shadows — depth comes from saturation against the white canvas
- Apply the 86px section margin between major page sections to create print-magazine page-turn rhythm rather than SaaS compact spacing
- Use #ff5000 Ember Orange sparingly and only on primary CTAs — one filled orange button per viewport maximum so the signal stays hot
- Tighten tracking aggressively on display sizes: -0.067em at 80px, -0.05em at 32px, -0.014em at 12px — the negative tracking is what makes the display face feel set rather than typed
- Pair any saturated brand panel with white or near-black text only — never put colored text on colored panels, and never put mid-gray on a black card

### Don't
- Do not add drop shadows to cards or panels — Readymag separates elements with solid color, not elevation
- Do not use a corner radius other than the defined scale (10, 16, 20, 200) — avoid 4px or 8px defaults that would read as generic SaaS
- Do not use the orange #ff5000 for anything other than the primary action fill; do not paint large sections with it unless it is a deliberate brand-moment panel
- Do not use the display face below 18px — it loses its geometric personality and starts to feel like a body font that forgot to be quiet
- Do not stack multiple filled colored buttons next to each other in a row — the orange must be alone so the eye lands on it
- Do not put two solid-color feature cards of the same hue adjacent — alternate between black, orange, blue, and violet panels across the page
- Do not use system font for any heading or display moment — even at small sizes the custom face is what makes the brand feel editorial

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Paper White | `#ffffff` | Default page canvas and card surface |
| 2 | Fog Gray | `#f4f4f4` | Subtle elevation for inputs and inactive controls |
| 3 | Mist Gray | `#e7e7e7` | Borders, dividers, and soft card backgrounds |
| 4 | Solid Color Panels | `#000000` | Feature card backgrounds and full-bleed dark sections that break the white canvas |
| 5 | Saturated Brand Panels | `#ff5000` | Full-bleed ember orange feature blocks |
| 6 | Interactive Canvas | `#1551ff` | Cobalt blue interactive demo surfaces |

## Elevation

Readymag avoids shadow-based elevation almost entirely. Instead of lifting cards off the surface, it fills cards with solid color — black, orange, violet, cobalt — and lets the color contrast against the white page do the separation work. Depth comes from color saturation, not drop shadows. Hairline borders at #e7e7e7 handle the rare cases where a neutral surface needs to read as a discrete component. This is a print-editorial approach to depth: full-bleed panels, not floating cards.

## Imagery

Readymag's visual language is dominated by its own UI and product showcase rather than traditional photography. The hero is a masonry of user-project screenshots — the platform's own canvas is the imagery, presented without padding, captions, or attribution chrome. Where photography appears, it tends to be high-contrast portrait crops on saturated color backgrounds (the purple-hooded figure in the hero tile) treated as graphic objects rather than lifestyle imagery. There is no illustration system in the traditional sense — instead, the interface uses large solid-color panels and oversized typography as visual content. Icons are minimal: a small filled X (back/close) mark, circular bullet markers, and abstract glyph-like UI controls in the demo panels. Decorative treatment is flat, full-bleed, and unframed — nothing sits inside a card with a border or shadow.

## Layout

The page follows an editorial, magazine-grade vertical scroll. The hero is a full-bleed masonry of project tiles (roughly 3–4 rows, mixed aspect ratios) with no padding from the viewport edges, creating a wall-of-work first impression. Below the hero, the page settles into a max-width ~1200px centered column for the main headline and CTA, then alternates into large, full-bleed colored feature blocks — a black card next to an orange card, a cobalt blue interactive demo — that break out of the centered column. Section rhythm is generous (86px gaps) with occasional full-bleed yellow bands acting as page-turn dividers. The grid is 2-column for feature comparisons and 1-column for solo statements. Navigation is a minimal floating top bar: logo X-mark on the left, a horizontal row of pill-shaped nav items centered or left-aligned, and the outlined Log in + filled orange Sign up pair on the right. No sidebar, no mega-menu, no sticky header pattern beyond a standard fixed nav.

## Agent Prompt Guide

**Quick Color Reference**
- Text (primary): #282828 Graphite
- Text (headings): #0f0e0e Near Black
- Background: #ffffff Paper White
- Border: #e7e7e7 Mist Gray
- Accent (brand): #8800ff Electric Violet
- primary action: no distinct CTA color

**Example Component Prompts**

No distinct primary action color was observed; use the extracted neutral button treatments instead of inventing a filled CTA color.


3. **Black feature card** — Full panel, background #000000, padding 48px, headline in custom display face 40px weight 700 at -0.053em tracking in #ffffff, body copy in Graphik 16px in #e7e7e7. No border, no shadow.

4. **Section heading** — Left-aligned, custom display face 40px weight 400 at -0.053em in #0f0e0e, 86px margin top, followed by Graphik 16px body in #282828. On a #ffffff canvas with no enclosing container.

5. **Cobalt interactive demo panel** — Full-width rectangle, fill #1551ff, 16px corner radius, containing four floating white pill controls (Snap, Sizes, Guides, Grid) at 200px radius with 12px text in #1551ff, arranged in a 2x2 grid offset to the upper left.

## Editorial Type System

Readymag's type behaves like a magazine masthead, not a product interface. The custom display face is the only face that should be used at 30px and above — at those sizes, its tight tracking (-0.067em at 80px down to -0.044em at 30px) creates a visual density where letters nearly touch, which gives headlines a printed, set-in-stone quality. Below 30px, switch to Graphik at 16px or the system stack at 12–14px; the display face at small sizes loses the geometric confidence and starts to look like a slightly awkward body font. The dramatic line-height on 30px and 40px sizes (2.67 and 1.43) is deliberate — it leaves generous air between lines for breathing room and lets the tight tracking do its work without crowding. Headlines should never be centered unless deliberately emulating the layered display type stack inside a solid color card; left-alignment is the default editorial mode.

## Color Block Philosophy

The single most distinctive design decision in Readymag's system is the refusal to use shadows for depth. Instead, depth is created by filling entire regions with saturated color — #000000, #ff5000, #1551ff, #8800ff, #ffcc00 — and letting those solid panels sit directly on the white canvas. This gives the page a print-editorial quality where each section feels like a magazine spread rather than a stacked web component. When designing new pages: identify the feature or message that deserves a 'spread', fill it with one of the saturated brand colors, and place a single large headline on top in white or near-black. Do not decorate the panel further — no patterns, no gradients, no inner cards. The flatness is the design.

## Similar Brands

- **Squarespace** — Same editorial, design-forward homepage with full-bleed project tiles, oversized headlines, and a single warm accent CTA color against a white canvas
- **Webflow** — Same bold display typography with tight tracking, generous section spacing, and a confident single-color accent (Webflow's blue, Readymag's orange) that drives primary action
- **Framer** — Same restraint of the surrounding shell (white, near-black text) contrasted with saturated full-bleed feature panels, and the same pill-shaped navigation controls
- **Krea** — Same dark canvas moments inside an otherwise light page, and the same creative-tool brand confidence expressed through solid color blocks rather than illustrative decoration
- **Cargo** — Same portfolio-platform editorial heritage — full-bleed masonry of user work as the hero, and the same print-magazine typographic attitude in section headlines

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-electric-violet: #8800ff;
  --color-deep-violet: #2c0fb1;
  --color-ember-orange: #ff5000;
  --color-burnt-orange: #ec520b;
  --color-signal-yellow: #ffcc00;
  --color-cobalt-blue: #1551ff;
  --color-ink-black: #000000;
  --color-graphite: #282828;
  --color-carbon: #141414;
  --color-near-black: #0f0e0e;
  --color-paper-white: #ffffff;
  --color-fog-gray: #f4f4f4;
  --color-mist-gray: #e7e7e7;
  --color-steel-gray: #808080;

  /* Typography — Font Families */
  --font-apple-system: '-apple-system', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-readymag-display-custom: 'Readymag Display (custom)', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-graphik: 'Graphik', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-system-ui: 'System UI', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-custom37866: 'custom_37866', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-xgnl: 'xgnl', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1;
  --tracking-caption: -0.168px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.43;
  --tracking-body-sm: -0.35px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.048px;
  --text-subheading: 18px;
  --leading-subheading: 2.67;
  --tracking-subheading: -0.486px;
  --text-heading-sm: 30px;
  --leading-heading-sm: 2.7;
  --tracking-heading-sm: -1.32px;
  --text-heading: 32px;
  --leading-heading: 1.83;
  --tracking-heading: -1.6px;
  --text-heading-lg: 40px;
  --leading-heading-lg: 1.43;
  --tracking-heading-lg: -2.12px;
  --text-display: 80px;
  --leading-display: 0.88;
  --tracking-display: -5.36px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-6: 6px;
  --spacing-14: 14px;
  --spacing-15: 15px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-30: 30px;
  --spacing-86: 86px;
  --spacing-201: 201px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 86px;
  --card-padding: 24px;
  --element-gap: 6px;

  /* Border Radius */
  --radius-lg: 10px;
  --radius-2xl: 16px;
  --radius-2xl-2: 20px;
  --radius-3xl: 30px;
  --radius-full: 102px;
  --radius-full-2: 200px;

  /* Named Radii */
  --radius-cards: 16px;
  --radius-pills: 200px;
  --radius-small: 10px;
  --radius-panels: 20px;
  --radius-buttons: 200px;

  /* Surfaces */
  --surface-paper-white: #ffffff;
  --surface-fog-gray: #f4f4f4;
  --surface-mist-gray: #e7e7e7;
  --surface-solid-color-panels: #000000;
  --surface-saturated-brand-panels: #ff5000;
  --surface-interactive-canvas: #1551ff;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-electric-violet: #8800ff;
  --color-deep-violet: #2c0fb1;
  --color-ember-orange: #ff5000;
  --color-burnt-orange: #ec520b;
  --color-signal-yellow: #ffcc00;
  --color-cobalt-blue: #1551ff;
  --color-ink-black: #000000;
  --color-graphite: #282828;
  --color-carbon: #141414;
  --color-near-black: #0f0e0e;
  --color-paper-white: #ffffff;
  --color-fog-gray: #f4f4f4;
  --color-mist-gray: #e7e7e7;
  --color-steel-gray: #808080;

  /* Typography */
  --font-apple-system: '-apple-system', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-readymag-display-custom: 'Readymag Display (custom)', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-graphik: 'Graphik', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-system-ui: 'System UI', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-custom37866: 'custom_37866', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-xgnl: 'xgnl', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1;
  --tracking-caption: -0.168px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.43;
  --tracking-body-sm: -0.35px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.048px;
  --text-subheading: 18px;
  --leading-subheading: 2.67;
  --tracking-subheading: -0.486px;
  --text-heading-sm: 30px;
  --leading-heading-sm: 2.7;
  --tracking-heading-sm: -1.32px;
  --text-heading: 32px;
  --leading-heading: 1.83;
  --tracking-heading: -1.6px;
  --text-heading-lg: 40px;
  --leading-heading-lg: 1.43;
  --tracking-heading-lg: -2.12px;
  --text-display: 80px;
  --leading-display: 0.88;
  --tracking-display: -5.36px;

  /* Spacing */
  --spacing-6: 6px;
  --spacing-14: 14px;
  --spacing-15: 15px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-30: 30px;
  --spacing-86: 86px;
  --spacing-201: 201px;

  /* Border Radius */
  --radius-lg: 10px;
  --radius-2xl: 16px;
  --radius-2xl-2: 20px;
  --radius-3xl: 30px;
  --radius-full: 102px;
  --radius-full-2: 200px;
}
```
