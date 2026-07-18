# Thisispam — Style Reference
> butter-yellow editorial broadsheet — a Swiss-press layout where a single warm cream stock, razor-sharp type, and a zero-chrome surface system turn each scroll into a printed page.

**Theme:** light

Thisispam operates as a Swiss-influenced editorial design system: a warm butter-yellow canvas paired with stark black ink typography and almost zero chrome. The visual language borrows from print broadsheets — large, confident display headlines sit in tight uppercase clusters, while project images float in a strict grid with caption-level metadata beneath. Color is used with extreme discipline: #fff3b8 functions as both page ground and emphasis highlight, leaving black to carry all text and white to separate content blocks. No shadows, no rounding, no gradients — the system relies on typographic scale, generous whitespace, and the unusual warm background to create atmosphere. Sections alternate between yellow paper, pure white, and ink black, creating a rhythmic editorial flow.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Butter Paper | `#fff3b8` | `--color-butter-paper` | Dominant page canvas for entire sections, emphasis text on dark photographic backgrounds, hairline link borders, and the third band in the surface stack — a warm cream that replaces white as the design's atmospheric ground |
| Ink Black | `#000000` | `--color-ink-black` | Primary text color across all surfaces, hairlines and structural borders, the footer and dark-band background — every word, rule, and icon reads as solid ink on the cream or white ground |
| Paper White | `#ffffff` | `--color-paper-white` | White section backgrounds and card surfaces that separate the yellow bands, inverse text on the black footer, and the language modal surface |
| Wheat | `#f1e4a4` | `--color-wheat` | Muted input-field fill used on the yellow canvas — a slightly darker cream that lets form fields recede into the warm ground without losing the surface hierarchy |
| Signal Red | `#ff0000` | `--color-signal-red` | Active-state and current-section indicator in the hamburger nav menu — a single red dash marks the present position in the menu, the only chromatic departure from the black-on-cream system |

## Tokens — Typography

### OT Neue Montreal — Primary workhorse covering display headlines, navigation, buttons, and labels — the 58px weight-700 lockup with 0.90 leading is the signature editorial poster voice; uppercase treatment is consistent across all sizes. · `--font-ot-neue-montreal`
- **Substitute:** Space Grotesk or Neue Haas Grotesk Display
- **Weights:** 500, 700
- **Sizes:** 11px, 16px, 32px, 58px
- **Line height:** 0.90–2.55 (0.90 at display, 1.00 at heading, 1.20 at subheading, 1.43 at body, 2.55 at airy list labels)
- **Role:** Primary workhorse covering display headlines, navigation, buttons, and labels — the 58px weight-700 lockup with 0.90 leading is the signature editorial poster voice; uppercase treatment is consistent across all sizes.

### ABC Diatype — Secondary humanist sans for body copy, footer details, input fields, and the modal message — slightly warmer and more legible than the geometric Montreal, used where long-form reading or quieter hierarchy is required. · `--font-abc-diatype`
- **Substitute:** Inter or Söhne
- **Weights:** 400, 700
- **Sizes:** 13px, 14px
- **Line height:** 1.20–2.15
- **Role:** Secondary humanist sans for body copy, footer details, input fields, and the modal message — slightly warmer and more legible than the geometric Montreal, used where long-form reading or quieter hierarchy is required.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 11px | 1.43 | — | `--text-caption` |
| heading | 32px | 1 | — | `--text-heading` |
| display | 58px | 0.9 | — | `--text-display` |

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
| 40 | 40px | `--spacing-40` |
| 160 | 160px | `--spacing-160` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 0px |
| inputs | 2px |
| modals | 0px |
| buttons | 0px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 64px
- **Card padding:** 0px
- **Element gap:** 12px

## Components

### Top Navigation Bar
**Role:** Minimal site header with logo and menu trigger

Fixed top bar on a transparent or yellow background. Left: 'PAM' wordmark at 11px OT Neue Montreal weight 500, #000000, uppercase, with a 1px ink-black hairline beneath. Right: 24px hamburger icon (three 1px #000000 lines). Height ~56px, horizontal padding 24px.

### Hamburger Menu Icon
**Role:** Menu trigger button in the nav

Three stacked 1px #000000 horizontal lines, 24px wide, 2px gap between lines. No background, no border, no hover state other than a #ff0000 indicator line that appears beneath it when active.

### Full-Bleed Hero Section
**Role:** Opening editorial image with overlaid display headline

Edge-to-edge photograph (no border-radius) with a bottom-left or bottom-center display headline. Headline at 58px OT Neue Montreal weight 700, #ffffff, line-height 0.90, uppercase. A single emphasis phrase in #fff3b8 sits inline within the white text. Optional 11px caption above the headline at weight 500.

### Project Grid Card
**Role:** Portfolio project tile in the work grid

White surface (#ffffff) with 0px radius and no shadow. Full-width contained image (not full-bleed, maintains column width). Below the image: project label at 11px OT Neue Montreal weight 500 uppercase, #000000, 4px top margin. Right-aligned stat counter at 32px weight 700, #000000. No border between image and caption.

### Stat Counter
**Role:** Numeric badge paired with a project card or section

Right-aligned number at 32px OT Neue Montreal weight 700, #000000 (e.g. '4K+', '16+', '300+'). Paired vertically with the project label caption at 11px weight 500. On yellow sections the stat stays #000000.

### Brand Directory List
**Role:** Centered column of client or partner names on the yellow canvas

Sits on #fff3b8 background. Centered single column, max-width ~360px. Each item at 13px ABC Diatype weight 400, #000000, uppercase, 8px row gap. No bullet, no link underline — names read as a flat typographic column.

### Section Display Heading
**Role:** Large opening headline for a new page section

OT Neue Montreal weight 700 at 32–58px, line-height 0.90–1.00, uppercase, #000000 on white/yellow bands, #ffffff on the black footer. The 58px size appears only in the hero; 32px serves all subsequent section openers.

### Dark Footer Block
**Role:** Contact and project block closing the page

Full-width #000000 band with 24–48px vertical padding. Display heading at 32px weight 700, #ffffff, uppercase, left-aligned. Three-column contact block at 13px ABC Diatype weight 400, #ffffff, with column headers at weight 700. No dividers between columns.

### Input Field (Yellow Context)
**Role:** Form input on the butter-yellow canvas

Fill #f1e4a4, 1px #000000 border, 2px radius, 16px horizontal padding, 12px vertical padding. Placeholder and value text at 14px ABC Diatype weight 400, #000000. No focus ring — the border thickens or the fill darkens on focus.

### Language Switcher Modal
**Role:** Centered overlay prompting the user to view the site in English

#ffffff card, centered on viewport, 0px radius, 24px padding, no shadow, no border. Message at 14px ABC Diatype weight 400, #000000. Two action options ('Yes' / 'No') at 14px weight 700, #000000, separated by ~80px of space — no buttons, just text links.

### Emphasis Inline Text
**Role:** Highlighted phrase within a display headline

A substring of a #ffffff display headline recolored to #fff3b8 (e.g. 'VOTRE MARQUE' within 'DESIGN PRÉCIS ET EXIGEANT, AU SERVICE DE VOTRE MARQUE'). Same font, weight, and size as the surrounding text — color is the only differentiator.

### Nav Active Indicator
**Role:** Marks the current item in the hamburger menu

A 1px #ff0000 horizontal line beneath the active menu item. Appears only in the open menu state; no other red is used anywhere on the site.

## Do's and Don'ts

### Do
- Use #fff3b8 as the dominant canvas for entire page sections, not as a small accent
- Set border-radius to 0px on cards, buttons, and modals; reserve 2px for input fields only
- Apply uppercase to all navigation, button, and label text at every size
- Set display headlines to 58px OT Neue Montreal weight 700 with 0.90 line-height for the editorial poster voice
- Alternate section backgrounds between #fff3b8, #ffffff, and #000000 to create the printed-page rhythm
- Use #fff3b8 as inline emphasis text on dark photographic or black backgrounds
- Use 1px #000000 hairlines for all borders; rely on color contrast and bands, not shadows, for layer separation

### Don't
- Don't add box-shadows, drop-shadows, or any elevation beyond 1px borders
- Don't introduce new chromatic colors — the system is black, white, cream, and a single red indicator
- Don't use light gray neutrals — stay at full #000000 for text and borders or full #ffffff for surfaces
- Don't use letter-spacing adjustments; keep tracking at normal across all sizes and weights
- Don't center body copy — keep editorial text left-aligned even within centered compositional blocks
- Don't mix more than two type families on a single screen
- Don't fill interactive elements with #fff3b8 as a solid button background — yellow is a canvas and emphasis color, not a button fill

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Yellow Paper | `#fff3b8` | Dominant warm canvas for the brand-list and alternate sections |
| 2 | Paper White | `#ffffff` | White section bands and card surfaces, the lightest level above the yellow ground |
| 3 | Wheat Fill | `#f1e4a4` | Input field surfaces on the yellow canvas |
| 4 | Ink Black | `#000000` | Dark footer and inverse sections — the deepest band in the page rhythm |

## Elevation

Zero shadow by design. The system rejects elevation entirely — separation between layers is achieved through alternating color bands (yellow → white → black) and hairline 1px ink-black borders, never through shadow depth. The only observed non-zero radius in the codebase is 2px on a single input field.

## Imagery

High-quality editorial photography is the sole visual medium: warm-toned lifestyle and product shots (a phone on a ceramic tray with a cocktail glass, a tote bag with a printed brand mark, clothing on a figure). Treatment is full-bleed for the hero, contained within grid columns for the work section. No illustrations, no abstract graphics, no 3D renders. Icons are minimal — only the hamburger and a small arrow glyph, both 1px outlined. The photography is the atmosphere; type is the structure.

## Layout

The page is a vertically scrolling editorial broadsheet with a strict three-band rhythm. The hero is a full-bleed photograph with a bottom-aligned uppercase display headline. The work section sits on #ffffff in a 3-column grid of full-width images with caption-level metadata beneath each tile. The brand list is a centered single column on the #fff3b8 canvas. The page closes with a #000000 dark footer in 3 columns. Section breaks are made by full-width color band switches, not by visible dividers. Content is left-aligned for editorial readability; only the brand list and the display headings are centered. Navigation is a minimal top bar with a left-aligned wordmark and a right-aligned hamburger trigger.

## Agent Prompt Guide

**Quick Color Reference**
- Background: #fff3b8 (butter-yellow canvas)
- Surface: #ffffff (white section)
- Text: #000000 (ink black)
- Inverse Text: #ffffff (on black band)
- Accent (emphasis text, link border): #fff3b8
- primary action: #fff3b8 (filled action)

**Example Component Prompts**
1. **Hero Section:** Full-bleed photograph background with no radius. Bottom-aligned display headline at 58px OT Neue Montreal weight 700, #ffffff, line-height 0.90, uppercase. One emphasis substring in #fff3b8 inline within the white text. Optional 11px caption above the headline at weight 500, #ffffff.
2. **Project Grid Card:** #ffffff surface, 0px radius, no shadow. Full-column-width contained image. Project label at 11px OT Neue Montreal weight 500 uppercase, #000000, 4px gap above. Stat counter at 32px weight 700, #000000, right-aligned.
3. **Brand Directory List:** #fff3b8 background, centered single column, max-width 360px. Each item at 13px ABC Diatype weight 400, #000000, uppercase, 8px row gap. No bullets, no underlines.
4. **Dark Footer Block:** #000000 background, 48px vertical padding. Display heading at 32px OT Neue Montreal weight 700, #ffffff, uppercase, left-aligned. Three columns of contact details at 13px ABC Diatype weight 400, #ffffff, with column titles at weight 700.
5. **Language Switcher Modal:** #ffffff card centered on viewport, 0px radius, 24px padding, no shadow, no border. Message at 14px ABC Diatype weight 400, #000000. Two text options at 14px weight 700, #000000 separated by 80px of space — no button chrome, just text.

## Color Discipline Rule

The system runs on exactly three surface tones (#fff3b8, #ffffff, #000000) plus a single 1px ink rule. The butter yellow is not a brand color in the conventional sense — it is the page stock. Every section is one of three backgrounds, and the design's identity comes from the rhythm of switching between them, not from decorative use of color. Any new surface must be one of these three, and any accent must already exist in the palette.

## Typography Discipline Rule

OT Neue Montreal at weight 700 is the display and heading voice at every size from 32px upward; weight 500 handles labels, captions, and nav. ABC Diatype is reserved for body copy, footer details, and form fields at 13–14px. Both are always set uppercase for UI chrome (nav, buttons, labels) and sentence case only for long-form body paragraphs. Letter-spacing is always normal — never tracked out or in. Line-height contracts as size increases: 1.43 at body, 1.20 at subheading, 1.00 at heading, 0.90 at display.

## Similar Brands

- **Pentagram** — Same Swiss-grid editorial system with uppercase geometric sans-serif display type and full-bleed project imagery
- **Bureau Cool** — Shared warm-cream canvas, hairline borders, and zero-shadow card surfaces with large editorial display headlines
- **Anagrama** — Same agency-portfolio rhythm: alternating color bands, sharp-cornered grid cards, and a single brand-color emphasis technique
- **Made Thought** — Identical restraint: a three-color palette, generous vertical breathing room, and display type set in tight uppercase clusters over photography

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-butter-paper: #fff3b8;
  --color-ink-black: #000000;
  --color-paper-white: #ffffff;
  --color-wheat: #f1e4a4;
  --color-signal-red: #ff0000;

  /* Typography — Font Families */
  --font-ot-neue-montreal: 'OT Neue Montreal', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-abc-diatype: 'ABC Diatype', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 11px;
  --leading-caption: 1.43;
  --text-heading: 32px;
  --leading-heading: 1;
  --text-display: 58px;
  --leading-display: 0.9;

  /* Typography — Weights */
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
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-160: 160px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 64px;
  --card-padding: 0px;
  --element-gap: 12px;

  /* Border Radius */
  --radius-sm: 2px;

  /* Named Radii */
  --radius-cards: 0px;
  --radius-inputs: 2px;
  --radius-modals: 0px;
  --radius-buttons: 0px;

  /* Surfaces */
  --surface-yellow-paper: #fff3b8;
  --surface-paper-white: #ffffff;
  --surface-wheat-fill: #f1e4a4;
  --surface-ink-black: #000000;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-butter-paper: #fff3b8;
  --color-ink-black: #000000;
  --color-paper-white: #ffffff;
  --color-wheat: #f1e4a4;
  --color-signal-red: #ff0000;

  /* Typography */
  --font-ot-neue-montreal: 'OT Neue Montreal', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-abc-diatype: 'ABC Diatype', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 11px;
  --leading-caption: 1.43;
  --text-heading: 32px;
  --leading-heading: 1;
  --text-display: 58px;
  --leading-display: 0.9;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-160: 160px;

  /* Border Radius */
  --radius-sm: 2px;
}
```
