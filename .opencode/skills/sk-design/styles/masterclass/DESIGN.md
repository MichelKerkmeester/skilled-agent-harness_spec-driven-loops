# MasterClass — Style Reference
> black-box stage lit by magenta spotlights

**Theme:** dark

MasterClass reads as a darkened gallery wall — a near-black canvas where editorial type and portrait photography do the heavy lifting. The visual hierarchy is built on extreme contrast: a hot magenta primary action (#e32652) and warm gold accents (#eed37f) punctuate an otherwise monochrome stage, creating the feeling of spotlights on a black-box stage. Typography is the system's true voice — ultra-condensed display faces at 64–80px with sub-unity line-heights deliver cinematic headline presence, while Sohne at restrained sizes keeps the interface calm and editorial. Surfaces stay nearly invisible: cards sit on a slightly elevated dark plate with thin hairline borders rather than shadows, letting portrait imagery own the page. The overall register is premium, quiet, and theatrical — content first, chrome last.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Obsidian | `#222326` | `--color-obsidian` | Page canvas and primary background — the stage floor from which all content rises |
| Carbon | `#0d0d0e` | `--color-carbon` | Elevated surface for secondary panels and the sticky bottom promotional bar |
| Charcoal Plate | `#272c33` | `--color-charcoal-plate` | Card surfaces and raised containers — one step lighter than canvas to define interactive zones |
| Slate Body | `#191c21` | `--color-slate-body` | Nested surface for body blocks and form panels within cards |
| Bone White | `#f4f4f5` | `--color-bone-white` | Secondary text, hairline borders, and inactive outlines on dark surfaces |
| Ash Mute | `#9ea0a9` | `--color-ash-mute` | Muted helper text, icon strokes, and low-emphasis dividers |
| Smoke | `#43454c` | `--color-smoke` | Inactive button fills and dormant control surfaces |
| Paper | `#ffffff` | `--color-paper` | Primary text, icon fills, and high-contrast borders — the dominant ink on the dark stage |
| Magenta Spotlight | `#e32652` | `--color-magenta-spotlight` | Primary action buttons, active states, and key interactive accents — warm crimson against matte black creates theatrical urgency |
| Editorial Gold | `#eed37f` | `--color-editorial-gold` | Decorative category pill borders, subtle brand warmth, and section highlights — adds luxury through restraint |
| Neon Volt | `#dcff00` | `--color-neon-volt` | Green action color for filled buttons, selected navigation states, and focused conversion moments. |

## Tokens — Typography

### Sohne — Primary UI and body typeface. Sohne handles navigation, buttons, form fields, body copy, card titles, and subheadings up to 32px. Weight 400 for body, 600 for buttons and emphasis. The wide range of sizes (8px micro-labels to 48px section heads) with consistent tracking gives the system editorial flexibility without changing its visual key. · `--font-sohne`
- **Substitute:** Inter
- **Weights:** 400, 600
- **Sizes:** 8px, 12px, 14px, 16px, 20px, 22px, 24px, 32px, 48px
- **Line height:** 1.00–2.50 (role-dependent: 1.25 for body, 1.00 for micro)
- **Letter spacing:** 0.0100em–0.0390em (positive tracking scales with size; looser at display sizes for legibility)
- **OpenType features:** `"ss01" on, "cv11" on`
- **Role:** Primary UI and body typeface. Sohne handles navigation, buttons, form fields, body copy, card titles, and subheadings up to 32px. Weight 400 for body, 600 for buttons and emphasis. The wide range of sizes (8px micro-labels to 48px section heads) with consistent tracking gives the system editorial flexibility without changing its visual key.

### Sohne Schmal — Hero and display headlines. The condensed (Schmal = 'narrow') cut with sub-unity line-height creates dramatic vertical compression — headlines stack tight and feel architectural rather than airy. Used at full 80px for the primary hero statement, 64px for section openers. This is the system's most distinctive type choice: it says 'editorial magazine' more than 'SaaS product'. · `--font-sohne-schmal`
- **Substitute:** Inter Tight or Oswald
- **Weights:** 500
- **Sizes:** 64px, 80px
- **Line height:** 0.85–0.90
- **Letter spacing:** -0.0100em to 0.0100em (tight at 80px, neutral at 64px)
- **Role:** Hero and display headlines. The condensed (Schmal = 'narrow') cut with sub-unity line-height creates dramatic vertical compression — headlines stack tight and feel architectural rather than airy. Used at full 80px for the primary hero statement, 64px for section openers. This is the system's most distinctive type choice: it says 'editorial magazine' more than 'SaaS product'.

### Ivar Display Condensed — Alternative display face for editorial sub-headlines and class-section titles. The serif contrast adds old-money texture to an otherwise grotesque system — a deliberate pairing of new (Sohne) and classic (Ivar) for genre contrast. · `--font-ivar-display-condensed`
- **Substitute:** Playfair Display Condensed
- **Weights:** 400
- **Sizes:** 64px
- **Line height:** 1.10
- **Letter spacing:** 0.0050em
- **Role:** Alternative display face for editorial sub-headlines and class-section titles. The serif contrast adds old-money texture to an otherwise grotesque system — a deliberate pairing of new (Sohne) and classic (Ivar) for genre contrast.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.5 | 0.012px | `--text-caption` |
| body-sm | 14px | 1.45 | 0.01px | `--text-body-sm` |
| body | 16px | 1.5 | 0.01px | `--text-body` |
| subheading | 20px | 1.33 | 0.02px | `--text-subheading` |
| heading-sm | 24px | 1.25 | 0.023px | `--text-heading-sm` |
| heading | 32px | 1.25 | 0.027px | `--text-heading` |
| heading-lg | 48px | 1.1 | 0.039px | `--text-heading-lg` |
| display | 80px | 0.85 | -0.8px | `--text-display` |

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
| 32 | 32px | `--spacing-32` |
| 48 | 48px | `--spacing-48` |
| 64 | 64px | `--spacing-64` |
| 80 | 80px | `--spacing-80` |
| 96 | 96px | `--spacing-96` |
| 112 | 112px | `--spacing-112` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 20px |
| cards | 12px |
| badges | 20px |
| images | 12px |
| inputs | 4px |
| buttons | 8px (default) or 48px (pill variant) |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| subtle | `rgb(148, 154, 164) 0px 0px 0px 2px inset` | `--shadow-subtle` |
| subtle-2 | `rgb(39, 44, 51) 0px 0px 0px 1px inset` | `--shadow-subtle-2` |
| subtle-3 | `rgb(67, 69, 76) 0px 0px 0px 2px inset` | `--shadow-subtle-3` |
| subtle-4 | `rgb(148, 154, 164) 0px 0px 0px 1px inset` | `--shadow-subtle-4` |

### Layout

- **Page max-width:** 1280px
- **Section gap:** 64-80px
- **Card padding:** 16-24px
- **Element gap:** 12-16px

## Components

### Magenta Primary Button
**Role:** Primary conversion action across the site

Filled #e32652 background, white #ffffff text, Sohne weight 600 at 16px, horizontal padding 24px, vertical padding 12px, border-radius 8px. No border, no shadow. Used for 'Get MasterClass', 'Continue', and all top-of-funnel CTAs.

### Ghost Outline Button
**Role:** Secondary action paired with the primary

Transparent background, 1px solid #ffffff border, white text, Sohne weight 600 at 16px, padding 12px 24px, border-radius 8px. Used for 'Gift' and 'Watch Trailer' — sits beside the magenta primary without competing.

### Category Pill Button
**Role:** Inline category filters

Transparent fill, 1px solid #eed37f gold border, #eed37f text, Sohne weight 400 at 14px, padding 8px 16px, border-radius 20px (pill). Gold rather than white to add visual warmth and differentiate navigation from action. Active state fills with #eed37f.

### Onboarding Checkbox Card
**Role:** Hero-level interactive form item

Dark surface #191c21, 1px solid #f4f4f5 border at ~20% opacity, border-radius 8px, padding 16px 20px, full-width row. Contains a small square checkbox (8×8) and Sohne 400 16px text in #f4f4f5. Stacks vertically in a list of 7.

### Instructor Portrait Card
**Role:** Hero and carousel visual unit

Full-bleed instructor photo, border-radius 12px, no visible border or shadow. Occupies a 2×2 grid slot in the hero and a 1:1 ratio card in carousels. The photo is the entire card — no text overlay, no padding.

### Membership Feature Row
**Role:** Mid-page membership value props

Horizontal rows with a small gold icon (#eed37f) on the left, Sohne 400 16px text in #f4f4f5. No card background, no dividers — sits directly on the dark canvas. Generous 16px row gap.

### Class Hero Block
**Role:** Featured class detail header

Large landscape photo (16:9) as background with overlaid text. Sohne Schmal 48px headline in white, subhead in #f4f4f5, and a white outlined 'Watch Trailer' button with a play triangle. Photo has border-radius 12px and extends nearly full-width of the content well.

### Sticky Bottom Promo Bar
**Role:** Persistent conversion overlay

Fixed to viewport bottom, background #0d0d0, full width, 80px tall. Contains a row of 5 small instructor avatar circles (32px, border-radius 50%), white headline text at 16px, subhead at 12px in #9ea0a9, and a magenta 'Get MasterClass' button right-aligned. Overlays page content with no shadow — visually distinct only by its darker fill.

### Navigation Bar
**Role:** Primary site navigation

Top-fixed bar, transparent background (shows page canvas through), max-width 1280px centered. Left: row of small text links in Sohne 14px #f4f4f5. Center: white Sohne logo. Right: utility text links plus the magenta primary CTA.

### Search Input
**Role:** Global search in nav

Dark #0d0d0 fill, 1px solid #9ea0a9 border, border-radius 4px, padding 10px 16px, Sohne 400 14px placeholder text in #9ea0a9. Left-side magnifying glass icon in #9ea0a9. Width ~320px.

### Class Thumbnail Card
**Role:** Catalog browsing unit

Portrait-ratio image with border-radius 12px, class title in Sohne 600 16px white below, instructor name in Sohne 400 14px #9ea0a9. No card background or border — floats directly on canvas. Optional small 'New' badge in top-right corner: #dcff00 fill, black text, border-radius 20px.

### Video Player Surface
**Role:** Inline video playback container

16:9 dark frame, background #000000, centered play button (white circle with magenta triangle), border-radius 12px. No controls visible in the static state.

## Do's and Don'ts

### Do
- Use #e32652 Magenta Spotlight exclusively for the single most important action on any screen — never for decorative elements, icons, or secondary buttons.
- Set hero and section headlines in Sohne Schmal at 64–80px with line-height 0.85–0.90 to achieve the compressed editorial feel; this is the system's most recognizable typographic signature.
- Define surface boundaries with 1px inset hairline borders in #272c33 or #f4f4f5 — never use drop shadows, which are invisible against the dark canvas anyway.
- Apply 12px border-radius to all images and media cards; this is the default image treatment and makes instructor portraits feel like framed prints rather than web thumbnails.
- Use #eed37f Editorial Gold for category pills, decorative icons, and section accents — it provides warmth that pure white or gray cannot.
- Maintain 64–80px vertical gaps between major sections to preserve the theatrical pacing; compact spacing breaks the gallery-wall metaphor.
- Keep body copy in Sohne weight 400 at 16px with 1.50 line-height — this is the most readable and on-brand reading experience.
- Pair every primary magenta CTA with at most one ghost outline secondary button; never stack multiple filled buttons of competing colors.

### Don't
- Don't apply drop shadows to any element — the design system uses inset borders exclusively for elevation.
- Don't use #dcff00 Neon Volt for large areas or buttons; it is an accent only, reserved for stamps and 'New' badges.
- Don't use rounded radii above 12px for cards or images — the system is sharp-but-soft, not pillowy.
- Don't set body text below 14px or headlines below 32px; the type scale is deliberately wide-jumped for editorial contrast.
- Don't introduce new accent colors outside the magenta-gold-volt triad; the dark stage discipline depends on chromatic restraint.
- Don't use Sohne Schmal for body copy or UI labels — its condensed proportions destroy legibility below 48px.
- Don't place light or white backgrounds anywhere in the interface; the entire experience is a single dark stage.
- Don't use borders thicker than 2px; the system communicates structure through hairlines, not heavy strokes.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Obsidian Canvas | `#222326` | Base page background |
| 2 | Carbon Panel | `#0d0d0` | Elevated bars, sticky footers, modal backdrops |
| 3 | Slate Body | `#191c21` | Nested content blocks within cards |
| 4 | Charcoal Plate | `#272c33` | Card containers and interactive surfaces |

## Elevation

- **Card:** `rgb(39, 44, 51) 0px 0px 0px 1px inset — hairline inset border, no drop shadow`
- **Input Field (focus):** `rgb(148, 154, 164) 0px 0px 0px 2px inset — 2px inner ring`
- **Input Field (default):** `rgb(148, 154, 164) 0px 0px 0px 1px inset — 1px hairline`
- **Active Button / Link:** `rgb(67, 69, 76) 0px 0px 0px 2px inset — 2px inner highlight ring`

## Imagery

Portrait photography is the dominant visual asset — large, tight crops of instructors filling the right half of the hero and subsequent sections. Photos are high-contrast with rich color (red jacket, blue denim, yellow sweater) and are presented in a 2-column grid with 12px rounded corners. No lifestyle staging, no product shots, no illustrations: the instructor face is the product. Category icons are simple line glyphs in #eed37f gold. A large ambient background photo appears behind class detail sections. The video player appears as a darkened thumbnail with a centered play button.

## Agent Prompt Guide

## Quick Color Reference
- text primary: #ffffff
- text secondary: #f4f4f5
- text muted: #9ea0a9
- background canvas: #222326
- surface elevated: #272c33
- border hairline: rgba(244,244,245,0.2) or #272c33
- accent gold: #eed37f
- primary action: #e32652 (filled action)

## Example Component Prompts
1. **Hero Section**: Dark canvas #222326. Two-column layout (text left, 2×2 instructor photo grid right). Headline in Sohne Schmal weight 500 at 80px, line-height 0.85, letter-spacing -0.8px, color #ffffff, all-caps. Subhead in Sohne weight 400 at 16px, #f4f4f5. Magenta CTA button (#e32652 fill, white text, 8px radius, 12px 24px padding). Instructor photos at 12px border-radius, full-bleed, no overlay.

2. **Onboarding Form Card**: Background #191c21, 1px border #272c33, 8px radius, 20px padding. Stack of 7 checkbox rows, each with 8px square checkbox and Sohne 16px #f4f4f5 text. Magenta 'Continue' button at bottom.

3. **Category Pill Row**: Horizontal row of pill buttons, 1px border #eed37f, text #eed37f, Sohne 400 14px, 8px 16px padding, 20px radius. Transparent background. Gold provides warmth against the dark canvas.

4. **Membership Feature List**: Left-aligned rows with 16px gold icon (#eed37f) and Sohne 16px #f4f4f5 text. 16px row gap. No card background, no dividers — sits directly on #222326 canvas.

5. **Sticky Bottom Promo Bar**: Fixed to viewport bottom, 80px tall, background #0d0d0e, full width. Left: row of 5 circular avatars (32px, border-radius 50%). Center: headline in Sohne 600 16px white, subhead in Sohne 400 12px #9ea0a9. Right: magenta 'Get MasterClass' button (#e32652, 8px radius).

## Similar Brands

- **Apple TV+** — Same dark-stage presentation of talent and original content with a single warm accent color driving all primary actions
- **Netflix (marketing pages)** — Editorial dark canvas with large portrait photography and condensed display type for show titles
- **Substack** — Minimal dark UI that lets content and creator imagery dominate; restrained accent palette with a single warm CTA color
- **The Criterion Channel** — Curated media catalog with gallery-wall dark theme, portrait thumbnails, and serif/condensed display typography for editorial authority

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-obsidian: #222326;
  --color-carbon: #0d0d0e;
  --color-charcoal-plate: #272c33;
  --color-slate-body: #191c21;
  --color-bone-white: #f4f4f5;
  --color-ash-mute: #9ea0a9;
  --color-smoke: #43454c;
  --color-paper: #ffffff;
  --color-magenta-spotlight: #e32652;
  --color-editorial-gold: #eed37f;
  --color-neon-volt: #dcff00;

  /* Typography — Font Families */
  --font-sohne: 'Sohne', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-sohne-schmal: 'Sohne Schmal', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-ivar-display-condensed: 'Ivar Display Condensed', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --tracking-caption: 0.012px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.45;
  --tracking-body-sm: 0.01px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: 0.01px;
  --text-subheading: 20px;
  --leading-subheading: 1.33;
  --tracking-subheading: 0.02px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.25;
  --tracking-heading-sm: 0.023px;
  --text-heading: 32px;
  --leading-heading: 1.25;
  --tracking-heading: 0.027px;
  --text-heading-lg: 48px;
  --leading-heading-lg: 1.1;
  --tracking-heading-lg: 0.039px;
  --text-display: 80px;
  --leading-display: 0.85;
  --tracking-display: -0.8px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-96: 96px;
  --spacing-112: 112px;

  /* Layout */
  --page-max-width: 1280px;
  --section-gap: 64-80px;
  --card-padding: 16-24px;
  --element-gap: 12-16px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-2xl-2: 20px;
  --radius-full: 48px;

  /* Named Radii */
  --radius-tags: 20px;
  --radius-cards: 12px;
  --radius-badges: 20px;
  --radius-images: 12px;
  --radius-inputs: 4px;
  --radius-buttons: 8px (default) or 48px (pill variant);

  /* Shadows */
  --shadow-subtle: rgb(148, 154, 164) 0px 0px 0px 2px inset;
  --shadow-subtle-2: rgb(39, 44, 51) 0px 0px 0px 1px inset;
  --shadow-subtle-3: rgb(67, 69, 76) 0px 0px 0px 2px inset;
  --shadow-subtle-4: rgb(148, 154, 164) 0px 0px 0px 1px inset;

  /* Surfaces */
  --surface-obsidian-canvas: #222326;
  --surface-carbon-panel: #0d0d0;
  --surface-slate-body: #191c21;
  --surface-charcoal-plate: #272c33;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-obsidian: #222326;
  --color-carbon: #0d0d0e;
  --color-charcoal-plate: #272c33;
  --color-slate-body: #191c21;
  --color-bone-white: #f4f4f5;
  --color-ash-mute: #9ea0a9;
  --color-smoke: #43454c;
  --color-paper: #ffffff;
  --color-magenta-spotlight: #e32652;
  --color-editorial-gold: #eed37f;
  --color-neon-volt: #dcff00;

  /* Typography */
  --font-sohne: 'Sohne', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-sohne-schmal: 'Sohne Schmal', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-ivar-display-condensed: 'Ivar Display Condensed', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --tracking-caption: 0.012px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.45;
  --tracking-body-sm: 0.01px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: 0.01px;
  --text-subheading: 20px;
  --leading-subheading: 1.33;
  --tracking-subheading: 0.02px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.25;
  --tracking-heading-sm: 0.023px;
  --text-heading: 32px;
  --leading-heading: 1.25;
  --tracking-heading: 0.027px;
  --text-heading-lg: 48px;
  --leading-heading-lg: 1.1;
  --tracking-heading-lg: 0.039px;
  --text-display: 80px;
  --leading-display: 0.85;
  --tracking-display: -0.8px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-96: 96px;
  --spacing-112: 112px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-2xl-2: 20px;
  --radius-full: 48px;

  /* Shadows */
  --shadow-subtle: rgb(148, 154, 164) 0px 0px 0px 2px inset;
  --shadow-subtle-2: rgb(39, 44, 51) 0px 0px 0px 1px inset;
  --shadow-subtle-3: rgb(67, 69, 76) 0px 0px 0px 2px inset;
  --shadow-subtle-4: rgb(148, 154, 164) 0px 0px 0px 1px inset;
}
```
