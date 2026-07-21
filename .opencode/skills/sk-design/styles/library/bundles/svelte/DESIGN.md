# Svelte — Style Reference
> Editorial broadsheet on white marble — serif voice, single ember accent

**Theme:** light

Svelte's site reads like a literary broadsheet translated into a framework landing page. Serif typography — EB Garamond for running text, DM Serif Display for hero headlines — carries the voice while a tight sans-serif (Fira Sans) handles the chrome: nav, buttons, tags, search. The canvas is pure white, surfaces are rare, and elevation is almost nonexistent; hierarchy comes from type size and weight rather than cards or shadows. A single vivid orange (#d43008) punctuates the monochrome page: it owns the logo, the GET STARTED arrow, the /svelte/ wordmark, and the documentary link. CTAs are arrow-suffixed text links, never boxed buttons. The site breathes — generous vertical rhythm, centered serif headlines, grayscale sponsor logos, and very little ornamentation between sections.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Svelte Ember | `#d43008` | `--color-svelte-ember` | Orange supporting accent for decorative details and low-frequency emphasis. Do not promote it to the primary CTA color |
| Ink | `#262626` | `--color-ink` | Primary text, nav items, body copy, button labels — soft black that avoids the harshness of #000 while preserving 15:1 contrast on white |
| Carbon | `#141414` | `--color-carbon` | Headlines and display copy — slightly heavier than Ink to give the serif wordmarks visual weight against the white canvas |
| Paper | `#ffffff` | `--color-paper` | Page canvas, card surfaces, nav background — the dominant background everywhere |
| Fog | `#f2f2f2` | `--color-fog` | Subtle surface elevation, button hover wash, search/input field background |
| Slate | `#666666` | `--color-slate` | Muted secondary text, helper labels, breadcrumb text |
| Ash | `#808080` | `--color-ash` | Deemphasized text, disabled labels, tertiary metadata |
| Obsidian | `#000000` | `--color-obsidian` | Input field borders, form focus states, text input text |

## Tokens — Typography

### EB Garamond — Body text and section copy — Garamond gives the framework a literary, editorial voice that no sans-serif system font can replicate; 22px at line-height 1.5 is the site's reading rhythm, uncharacteristically large and serif for a devtool site · `--font-eb-garamond`
- **Substitute:** Source Serif Pro, Crimson Pro, Lora
- **Weights:** 400
- **Sizes:** 10px, 22px
- **Line height:** 1.50
- **Role:** Body text and section copy — Garamond gives the framework a literary, editorial voice that no sans-serif system font can replicate; 22px at line-height 1.5 is the site's reading rhythm, uncharacteristically large and serif for a devtool site

### Fira Sans — All UI chrome — nav links, search input, button labels, the ADJECTIVE tag, section eyebrows. Fira Sans is the workspace font; it keeps interactive elements quiet so the serif voice can lead · `--font-fira-sans`
- **Substitute:** Inter, system-ui, -apple-system
- **Weights:** 400
- **Sizes:** 10px, 12px, 13px, 14px, 16px, 20px
- **Line height:** 1.00–1.70
- **Role:** All UI chrome — nav links, search input, button labels, the ADJECTIVE tag, section eyebrows. Fira Sans is the workspace font; it keeps interactive elements quiet so the serif voice can lead

### DM Serif Display — Hero and section display headlines — used sparingly (only 4 occurrences on the page) as a typographic exclamation point; the heavy serif slab at 54px contrasts with the lighter Garamond body to create editorial tension · `--font-dm-serif-display`
- **Substitute:** Playfair Display, Cormorant Garamond Bold
- **Weights:** 500
- **Sizes:** 54px
- **Line height:** 1.20
- **Role:** Hero and section display headlines — used sparingly (only 4 occurrences on the page) as a typographic exclamation point; the heavy serif slab at 54px contrasts with the lighter Garamond body to create editorial tension

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 10px | 1.5 | — | `--text-caption` |
| subheading | 20px | 1.2 | — | `--text-subheading` |
| body | 22px | 1.5 | — | `--text-body` |
| display | 54px | 1.2 | — | `--text-display` |

## Tokens — Spacing & Shapes

**Density:** compact

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 5 | 5px | `--spacing-5` |
| 7 | 7px | `--spacing-7` |
| 8 | 8px | `--spacing-8` |
| 10 | 10px | `--spacing-10` |
| 17 | 17px | `--spacing-17` |
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |
| 100 | 100px | `--spacing-100` |
| 115 | 115px | `--spacing-115` |

### Border Radius

| Element | Value |
|---------|-------|
| nav | 56px |
| tags | 4px |
| inputs | 4px |
| buttons | 4px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 40px
- **Card padding:** 48px
- **Element gap:** 10px

## Components

### Text Link CTA
**Role:** Primary action

UPPERCASE Svelte Ember (#d43008) text, 14px Fira Sans weight 400, letter-spacing slightly wide, followed by a right arrow (→). No background, no border, no padding. The arrow animates on hover by nudging right. Examples: 'GET STARTED', 'Watch the full Svelte Origins documentary'.

### Ghost Navigation Link
**Role:** Top nav item

Fira Sans 14px, Ink (#262626) color, no underline by default, underline appears on hover. Items: Docs (with dropdown caret), Tutorial, Packages, Playground, Blog. Right-aligned: search field, Discord, GitHub, Open collective, Apple icon.

### Search Field
**Role:** Site search

Pill-shaped (56px radius), Fog (#f2f2f2) background, Ink (#141414) placeholder text reading 'search', 8px horizontal padding, ~32px height. Cmd+K shortcut hint shown inside.

### Adjective Tag
**Role:** Highlight label

Small pill adjacent to the /svelte/ wordmark: dark Ink (#262626) background, white text, Fira Sans 10-12px uppercase, 4px radius, 5px vertical / 8px horizontal padding. Reads 'ADJECTIVE' as a templated fill-in.

### Section Heading
**Role:** Display headline

DM Serif Display weight 500 at 54px, Carbon (#141414) color, centered alignment. Line-height 1.2. Used for hero ('web development for the rest of us') and sponsor section ('used by companies you've heard of').

### Body Paragraph
**Role:** Editorial copy

EB Garamond 22px weight 400, Ink (#262626), line-height 1.5. Justified or left-aligned depending on column. Generous measure (~600-680px wide). The Svelte Ember color highlights inline terms like '/svelte/'.

### Code Terminal Card
**Role:** Product screenshot frame

Dark Ink (#262626) or near-black background, monospace syntax highlighting inside, subtle 4px radius, no shadow. Contains REPL or framework comparison output. Sits beside editorial text in a two-column layout.

### Logo Grid
**Role:** Social proof

Single horizontal row of grayscale sponsor logos (overflow, yelp, Square, Apple, Spotify, NYT, IKEA) at uniform size, spaced ~115px apart. All logos desaturated to ~50% gray. Centered in section with headline above.

### Hero Illustration
**Role:** Brand visual

3D isometric render of a factory production line in Svelte Ember (#d43008) and Ink, with the Svelte 'S' logo as a building. Sits in the right half of the hero on a very light blue-gray gradient canvas. Full-color, dimensional, photoreal rendering style.

### Two-Column Content Section
**Role:** Feature explanation

Left column: /svelte/ wordmark (DM Serif Display, Ember orange) + Adjective Tag + 2-3 paragraphs of EB Garamond body. Right column: stacked code terminal cards and chart screenshots. 48px horizontal padding within columns.

### Footer Link
**Role:** Secondary navigation

Fira Sans 14px, Ink (#262626), no decoration, hover underline. Left-aligned in footer band.

## Do's and Don'ts

### Do
- Use EB Garamond 22px / line-height 1.5 for all paragraph copy — the serif body is the site's voice
- Use Svelte Ember #d43008 exclusively for the brand wordmark, in-text links, and arrow CTAs — never as a fill color for buttons or cards
- Set hero and section headlines in DM Serif Display weight 500 at 54px, centered, in Carbon #141414
- Use Fira Sans 14px for all UI chrome: nav, buttons, tags, inputs, helper text
- Build CTAs as uppercase text links with a trailing arrow, not boxed buttons — 'GET STARTED →' not 'Get Started' on a colored fill
- Keep the canvas pure white #ffffff and let Fog #f2f2f2 handle the only surface variation (inputs, hover washes)
- Maintain 40px between sections and 48px horizontal padding inside content columns

### Don't
- Don't use DM Serif Display for body text — reserve it for display headlines at 54px only
- Don't add drop shadows, card elevations, or gradient backgrounds — the design is flat and relies on whitespace for separation
- Don't use boxed primary buttons with fills — actions are text links with arrows
- Don't introduce additional accent colors — Svelte Ember is the only chromatic token; everything else is grayscale
- Don't use border-radius above 4px on content elements; 56px is reserved for the search pill only
- Don't left-align section display headlines like 'used by companies you've heard of' — center them
- Don't use sans-serif fonts for headlines — the serif/serif contrast between Garamond body and DM Serif Display is signature

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Paper | `#ffffff` | Primary page canvas and default surface |
| 2 | Fog | `#f2f2f2` | Input fields, button hover states, subtle dividers |
| 3 | Slate | `#666666` | Inverted surface for dark code blocks or footer panels |
| 4 | Ink | `#262626` | Dark code terminal and product screenshot frames |

## Elevation

The site avoids shadows entirely. Visual hierarchy is achieved through typographic weight (Garamond 22px body vs. DM Serif 54px display) and whitespace (40px section gaps), not elevation. The only depth comes from product screenshots and the 3D hero illustration, which are pre-rendered assets — not UI elevation.

## Imagery

Imagery is sparse and deliberate. The hero uses a single large 3D isometric illustration of a production-line factory in Svelte Ember orange and dark gray, filling the right half of the viewport on a near-white blue-gray canvas. Product screenshots (REPL, framework comparison charts) appear as framed code-terminal cards with dark backgrounds. The sponsor section uses desaturated grayscale logos in a single row. No lifestyle photography, no stock imagery — the visual language is illustration + product UI, nothing else. Icon style throughout is minimal: outlined 16-20px line icons in nav (search, Discord, GitHub, etc.), no filled icon variants.

## Layout

Centered single-column with a max-width around 1200px. The hero is a two-column split: left half holds the headline and GET STARTED arrow, right half holds the 3D illustration. Below, sections alternate between centered display-headline + content and two-column text+product-screenshot layouts. The sponsor logos section is a single horizontal row of grayscale marks with the display headline centered above. Navigation is a single fixed-height top bar with logo + 5 nav items left-aligned and search + social icons right-aligned. Vertical rhythm is generous: ~100px top/bottom padding on major sections, 40px between stacked elements. The page reads top-to-bottom in one uninterrupted scroll with no sidebar, no modals visible.

## Agent Prompt Guide

## Quick Color Reference
- text: #262626 (Ink) / #141414 (Carbon for headlines)
- background: #ffffff (Paper)
- border: #000000 (Obsidian, for inputs)
- accent / link: #d43008 (Svelte Ember)
- muted text: #666666 (Slate)
- primary action: no distinct CTA color

## Example Component Prompts
1. **Hero Section**: White (#ffffff) background. Left column: headline 'web development for the rest of us' in DM Serif Display weight 500, 54px, #141414, line-height 1.2. Below it, a text link 'GET STARTED →' in Fira Sans 14px uppercase, #d43008. Right column: 3D isometric Svelte factory illustration filling the column. 48px horizontal padding, 100px vertical padding.
2. **Sponsor Logos Row**: Centered DM Serif Display 54px headline 'used by companies you've heard of' in #141414. Below, a single horizontal row of 7 sponsor logos (overflow, yelp, Square, Apple, Spotify, NYT, IKEA), all desaturated to grayscale, uniformly sized at ~60px height, spaced 115px apart, centered.
3. **Two-Column Feature Section**: Left column (60% width): /svelte/ wordmark in DM Serif Display 54px #d43008, followed by a small dark tag 'ADJECTIVE' (4px radius, #262626 background, white text, Fira Sans 10px), then 2-3 paragraphs of EB Garamond 22px #262626, line-height 1.5. Right column (40% width): a dark code terminal card (#262626 background, 4px radius) containing a screenshot of the Svelte REPL or framework comparison.
4. **Top Navigation**: Single row, white background, 56px height. Left: Svelte Ember logo + 'SVELTE' wordmark, then Fira Sans 14px links (Docs▾, Tutorial, Packages, Playground, Blog) in #262626. Right: pill-shaped search field (56px radius, #f2f2f2 background, 8px padding) followed by icon links (Discord, GitHub, Open collective, Apple).
5. **Footer Link Group**: Fira Sans 14px #262626 links, left-aligned, 10px gap between items, separated from content above by a 1px #f2f2f2 hairline divider. No background fill, no border.

## Similar Brands

- **Evan You's personal site / Vite** — Same editorial serif-headline + monochrome-canvas approach with a single accent color, very restrained UI
- **Astro** — Both are devtool sites that reject the typical dark dashboard aesthetic, using generous whitespace and serif/sans typographic contrast
- **Stripe Press** — Same literary-broadsheet language — serif display headlines, restrained color, white canvas, type-driven hierarchy
- **Observable** — Both use centered serif display headlines over content, with product screenshots as the primary visual element

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-svelte-ember: #d43008;
  --color-ink: #262626;
  --color-carbon: #141414;
  --color-paper: #ffffff;
  --color-fog: #f2f2f2;
  --color-slate: #666666;
  --color-ash: #808080;
  --color-obsidian: #000000;

  /* Typography — Font Families */
  --font-eb-garamond: 'EB Garamond', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-fira-sans: 'Fira Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-dm-serif-display: 'DM Serif Display', ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.5;
  --text-subheading: 20px;
  --leading-subheading: 1.2;
  --text-body: 22px;
  --leading-body: 1.5;
  --text-display: 54px;
  --leading-display: 1.2;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;

  /* Spacing */
  --spacing-5: 5px;
  --spacing-7: 7px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-17: 17px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-100: 100px;
  --spacing-115: 115px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 40px;
  --card-padding: 48px;
  --element-gap: 10px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-full: 56px;

  /* Named Radii */
  --radius-nav: 56px;
  --radius-tags: 4px;
  --radius-inputs: 4px;
  --radius-buttons: 4px;

  /* Surfaces */
  --surface-paper: #ffffff;
  --surface-fog: #f2f2f2;
  --surface-slate: #666666;
  --surface-ink: #262626;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-svelte-ember: #d43008;
  --color-ink: #262626;
  --color-carbon: #141414;
  --color-paper: #ffffff;
  --color-fog: #f2f2f2;
  --color-slate: #666666;
  --color-ash: #808080;
  --color-obsidian: #000000;

  /* Typography */
  --font-eb-garamond: 'EB Garamond', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-fira-sans: 'Fira Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-dm-serif-display: 'DM Serif Display', ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.5;
  --text-subheading: 20px;
  --leading-subheading: 1.2;
  --text-body: 22px;
  --leading-body: 1.5;
  --text-display: 54px;
  --leading-display: 1.2;

  /* Spacing */
  --spacing-5: 5px;
  --spacing-7: 7px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-17: 17px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-100: 100px;
  --spacing-115: 115px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-full: 56px;
}
```
