# July Fund — Style Reference
> dark gallery monograph with chromatic chapter cards

**Theme:** dark

July Fund is an editorial venture-capital mosaic rendered in a dark, museum-like gallery space. The base is near-black (#000000 and #433e3c warm charcoals), and content is built from individual themed cards — each one a saturated color field acting as a chapter in a visual index. Typography is deliberately split: a high-contrast custom serif (Portrait) sets headlines that feel like gallery wall text, while compact Helvetica Neue runs the labels, metadata, and body copy underneath in a quiet, typewriter-precise voice. The system reads as a printed monograph made interactive — generous padding inside cards, pill-shaped controls, uppercase letter-spaced badges, and zero decorative shadow. Color is not decoration here; it is categorization. Each chromatic card (forest green, twilight violet, olive, solar yellow, ember red) signals a different fund vertical or post type, so the grid itself becomes a navigation system.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Obsidian | `#000000` | `--color-obsidian` | Page canvas, deepest card base, and the void between sections — the room the cards hang in |
| Coffee Bean | `#433e3c` | `--color-coffee-bean` | Dominant border color across cards, badges, and dividers — the hairline that frames every chromatic block |
| Cream Paper | `#f0e7e4` | `--color-cream-paper` | Light card surface for the hero/about panel and inverted buttons — a warm off-white that reads as printed paper on the dark canvas |
| Charcoal | `#2b2b2b` | `--color-charcoal` | Secondary surface and elevated card base for monochrome content blocks |
| Espresso | `#221f1e` | `--color-espresso` | Button background for primary text controls on dark surfaces — one shade deeper than the card it sits in |
| Stone Gray | `#898989` | `--color-stone-gray` | Muted body copy, list markers, and supporting metadata — the whisper tier below primary text |
| Paper White | `#ffffff` | `--color-paper-white` | Headline color on dark cards, badge text on chromatic fills, and link highlights |
| Forest Floor | `#113619` | `--color-forest-floor` | Themed card surface for nature/climate/sustainability chapters — the deepest chromatic field, reads as moss or deep canopy |
| Twilight Violet | `#322b66` | `--color-twilight-violet` | Themed card surface for space, frontier, and science verticals — saturated enough to dominate a grid cell, dark enough to hold white type |
| Olive Depth | `#2e2909` | `--color-olive-depth` | Themed card surface for energy and industry chapters — a near-black ochre that glows against the canvas |
| Solar Yellow | `#fde440` | `--color-solar-yellow` | High-impact accent card fill for transformation and thesis verticals — the loudest single block in the system, used sparingly to punctuate the grid |
| Mint Chip | `#56d270` | `--color-mint-chip` | Small uppercase tag/badge fill for news and announcement labels — the only saturated green used at small scale |
| Lavender Mist | `#c6bffa` | `--color-lavender-mist` | Soft accent for secondary badges and highlight borders on the violet card family |
| Ember Red | `#b9534a` | `--color-ember-red` | Reserved research and analytical-content badge fill — used almost never; its rarity makes it register as a category marker |

## Tokens — Typography

### Portrait — Display and heading serif used for the wordmark, section titles, and card headlines. Portrait is a high-contrast didone-style serif; its hairline strokes and sharp serifs give the site its monograph feel. A single weight (400) is used — no bold headlines, authority comes from size and contrast alone. · `--font-portrait`
- **Substitute:** DM Serif Display, Playfair Display, or Cormorant Garamond
- **Weights:** 400
- **Sizes:** 18px, 30px, 34px, 35px, 40px
- **Line height:** 1.20
- **Letter spacing:** normal
- **Role:** Display and heading serif used for the wordmark, section titles, and card headlines. Portrait is a high-contrast didone-style serif; its hairline strokes and sharp serifs give the site its monograph feel. A single weight (400) is used — no bold headlines, authority comes from size and contrast alone.

### Helvetica Neue — Body, UI, badges, buttons, and metadata. Tight 400 for body, 700 for emphasis. The wide letter-spacing at small sizes (0.20–0.25em) is the defining micro-typography move: even 8px labels read as intentional, not afterthoughts. · `--font-helvetica-neue`
- **Substitute:** Inter, Neue Haas Grotesk, or system-ui sans
- **Weights:** 400, 700
- **Sizes:** 8px, 10px, 15px, 16px, 18px
- **Line height:** 1.15, 1.20, 1.30
- **Letter spacing:** 0.20em at 10px, 0.25em at 8px
- **Role:** Body, UI, badges, buttons, and metadata. Tight 400 for body, 700 for emphasis. The wide letter-spacing at small sizes (0.20–0.25em) is the defining micro-typography move: even 8px labels read as intentional, not afterthoughts.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| body-lg | 16px | 1.3 | — | `--text-body-lg` |
| subheading | 18px | 1.3 | — | `--text-subheading` |
| heading-sm | 30px | 1.2 | — | `--text-heading-sm` |
| heading | 35px | 1.2 | — | `--text-heading` |
| heading-lg | 40px | 1.2 | — | `--text-heading-lg` |
| display | 96px | 1.05 | — | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 12 | 12px | `--spacing-12` |
| 16 | 16px | `--spacing-16` |
| 20 | 20px | `--spacing-20` |
| 40 | 40px | `--spacing-40` |
| 60 | 60px | `--spacing-60` |
| 80 | 80px | `--spacing-80` |
| 100 | 100px | `--spacing-100` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 20px |
| badges | 8px |
| images | 12px |
| buttons | 24px |
| smallControls | 5px |

### Layout

- **Page max-width:** 1280px
- **Section gap:** 80px
- **Card padding:** 40px
- **Element gap:** 20px

## Components

### Themed Category Card
**Role:** Primary content unit — each card carries a single saturated background and acts as a chapter in the grid.

Background is one of the chromatic fields (Forest Floor #113619, Twilight Violet #322b66, Olive Depth #2e2909, Solar Yellow #fde440, or Charcoal #2b2b2b). Border-radius 20px. Inner padding 40px on the dominant axis. Headline set in Portrait 30–35px, white (#ffffff) on dark fields, Coffee Bean (#433e3c) on Solar Yellow. No shadow. Contains a 12px-radius image block anchored top or center, a 9px-padded uppercase badge near the headline, and supporting body copy in Helvetica Neue 15px at Stone Gray (#898989).

### Cream Hero Panel
**Role:** Light inverted opening section that introduces the fund before the dark grid begins.

Full-bleed Cream Paper (#f0e7e4) surface against the Obsidian canvas. 20px radius. 40px padding. Wordmark 'July Fund' set in Portrait 96px at Coffee Bean (#433e3c) — the single largest type on the site. Mint Chip (#56d270) tag pill sits above the wordmark. A two-column footer block (label + paragraph) lives beneath the headline with 45px column gap.

### Portfolio Founder Card
**Role:** Monochrome card introducing an individual team member.

Charcoal (#2b2b2b) background, 20px radius, 40px padding. Mint Chip (#56d270) uppercase label badge at the top. Portrait 30px name headline in white. Body description in Helvetica Neue 15px, Stone Gray. Single pill ghost button (See LinkedIn) at the bottom.

### News Article Card
**Role:** Editorial post preview with a photographic image, date, excerpt, and read-more control.

Cream Paper (#f0e7e4) or Charcoal background, 20px radius. 12px-radius image block at the top. Mint Chip tag badge. Portrait 30–35px headline. Date stamp in Helvetica Neue 8–10px, 0.25em letter-spacing, Stone Gray. Ghost pill button at the bottom (Read More).

### Category Tag Badge
**Role:** Uppercase label that classifies a card's content vertical.

8px border-radius (softly rounded rectangle). 9px vertical padding, 16px horizontal padding. Background is the badge's semantic color: Mint Chip (#56d270) for news, Lavender Mist (#c6bffa) for cosmic/frontier, Ember Red (#b9534a) for research, Solar Yellow (#fde440) for theses. Text is Helvetica Neue 8–10px weight 700, letter-spacing 0.25em, set in Coffee Bean or Obsidian depending on background luminance.

### Ghost Pill Button
**Role:** Default text control for navigation, read-more, and secondary actions.

24px border-radius (full pill). 5px vertical padding, 22px horizontal padding. Transparent background. 1px Coffee Bean (#433e3c) border on dark surfaces, or 1px Cream Paper (#f0e7e4) border on light surfaces. Label in Helvetica Neue 8–10px weight 700, 0.25em letter-spacing, uppercase.

### Filled Pill Button
**Role:** Rare primary action — used only where a strong CTA is needed.

24px border-radius. Espresso (#221f1e) or Cream Paper (#f0e7e4) background. No border. 5/22px padding. Helvetica Neue 8–10px weight 700, 0.25em letter-spacing, uppercase. Inverted text color against the fill.

### Location Card
**Role:** Compact monochrome card displaying a city and weather metadata.

Charcoal (#2b2b2b) or Obsidian background, 20px radius. Small outlined weather icon (1.5px stroke, Coffee Bean or Cream). City name in Portrait 30–35px. Weather condition in Helvetica Neue 8–10px uppercase, 0.25em letter-spacing, Stone Gray.

### Image Tile
**Role:** Inset photographic or illustrative block within a card.

12px border-radius. Sits at the top or center of a card. Full-width of the card's inner padding. No caption — the image stands alone as visual evidence.

### Map Tile
**Role:** Light-surface map preview for location-based content.

Cream Paper or white background, 12px radius. Full-bleed street map render. No border. Functions as a content image inside a larger card.

### Fund Thesis Statement Block
**Role:** Long-form text card on a solid chromatic field that explains a fund vertical.

Solar Yellow (#fde440), Lavender Mist (#c6bffa), or Charcoal background. 20px radius. 40px padding. Headline in Portrait 30–35px. Body paragraph in Helvetica Neue 15px. Optional 'Core Theme' or 'Rent' badge at the top.

### Footer Link Block
**Role:** Closing navigation and contact region on the dark canvas.

Obsidian background, no panel. Coffee Bean 1px hairline divider above. Helvetica Neue 10–15px, 0.20em letter-spacing, uppercase labels in Stone Gray, links in Cream Paper.

## Do's and Don'ts

### Do
- Use Portrait 400 at 30–96px for every heading — never substitute a sans-serif headline.
- Set all uppercase labels (badges, buttons, metadata) at 8–10px with 0.20–0.25em letter-spacing and weight 700.
- Let each card pick exactly one chromatic field (Forest Floor, Twilight Violet, Olive Depth, Solar Yellow, or Charcoal) as its background — no gradients, no images-as-backgrounds inside cards.
- Use 20px radius for cards, 24px for buttons (full pill), 8px for badges, 12px for images.
- Pair Mint Chip (#56d270) badges only with dark or neutral cards; reserve Solar Yellow (#fde440) for the single loudest thesis card in any grid.
- Keep 40px card padding on the dominant axis and 20px on the minor axis; 45px column gap between paired text columns.
- Separate sections with 80px of Obsidian void — never use a divider line between cards, the radius and the gap are the separator.

### Don't
- Don't add box-shadow, glow, or blur to any element — the system is flat by design.
- Don't use bold weights for Portrait headlines; authority comes from size, not weight.
- Don't mix two chromatic fills inside a single card — pick one field and commit.
- Don't place body copy in a chromatic color other than Stone Gray (#898989), Paper White, or Coffee Bean — no accent text.
- Don't use buttons with square or 8px corners; the 24px pill is non-negotiable.
- Don't set background gradients on text-forward cards — gradients are reserved for the radial accent washes in hero/empty states.
- Don't center body paragraphs or labels; left-align everything except the wordmark.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Obsidian Canvas | `#000000` | The void between every grid cell and the outer page background. |
| 1 | Charcoal Card | `#2b2b2b` | Default monochrome card surface for text-forward content. |
| 2 | Cream Panel | `#f0e7e4` | Inverted hero/about card — the only light surface in the system, acts as a full-bleed opener. |
| 3 | Themed Chromatic Field | `#113619` | Category cards that substitute the neutral surface for a saturated chapter color (also #322b66, #2e2909, #fde440). |

## Elevation

The system is entirely flat. No box-shadows, no glows, no blurs. Depth is communicated exclusively through chromatic contrast — a Solar Yellow card sitting next to a Forest Floor card next to an Obsidian void creates the sense of layered paper without any rendered shadow. The single visual exception is the occasional radial-gradient wash in empty hero states, which simulates spotlight on a gallery wall rather than a UI drop shadow.

## Imagery

Imagery is used as documentary evidence, not decoration. Article cards carry full-color editorial photography (copper mines, oil rigs, glacial fields, aerial urban shots) clipped to 12px-radius tiles. Some cards use flat geometric illustrations (a constellation diagram for the Berlin card, a wind-turbine sketch for the Sakana AI card) — these are monochrome line art in Coffee Bean on a chromatic fill. Icons are line-only, ~1.5px stroke, and sit inside Location cards. There are no full-bleed hero photographs, no overlapping layers, no masked edges — every image lives inside a 12px-radius rectangle inside a 20px-radius card. The visual language is closer to a printed annual report than a SaaS landing page.

## Layout

The page is an asymmetric, masonry-flavored grid of themed cards on an Obsidian canvas. The hero is a single full-width Cream Paper panel (one card spanning the grid) containing the Portrait wordmark and a two-column meta block beneath. Below the hero, the layout breaks into a responsive 3-column card grid that itself becomes the navigation: each card is a destination, and the chromatic fills form a color-coded index. Cards are not uniform in height — a tall Cream Panel sits next to a shorter Charcoal card next to a full-bleed Solar Yellow thesis block. Column gaps are ~20px, row gaps are ~25–40px, and the outer page is centered within a 1280px max-width container. Section breaks are achieved with 80px of empty Obsidian space, never with a divider line.

## Agent Prompt Guide

## Quick Color Reference
- text: #433e3c (Coffee Bean) on light cards, #ffffff (Paper White) on dark cards, #898989 (Stone Gray) for muted body
- background: #000000 (Obsidian) for page canvas, #f0e7e4 (Cream Paper) for hero panel, #2b2b2b (Charcoal) for monochrome cards
- border: #433e3c (Coffee Bean) hairlines at 1px on dark, #f0e7e4 (Cream Paper) hairlines on light
- accent: #56d270 (Mint Chip) for news badges, #c6bffa (Lavender Mist) for secondary tags
- primary action: no distinct CTA color
- thematic fields (one per card, never combined): #113619 Forest Floor, #322b66 Twilight Violet, #2e2909 Olive Depth, #fde440 Solar Yellow

## Example Component Prompts

1. **Themed Category Card** — Create a card on an Obsidian (#000000) page. Card background: Twilight Violet (#322b66), 20px radius, 40px padding. Mint Chip (#56d270) badge at top: 8px radius, 9px/16px padding, Helvetica Neue 8px weight 700, 0.25em letter-spacing, uppercase, text color #113619. Headline in Portrait 34px, line-height 1.20, color #ffffff. Body in Helvetica Neue 15px, line-height 1.30, color #898989. Bottom: Ghost Pill Button (24px radius, 5/22px padding, 1px #f0e7e4 border, label 'READ MORE' in Helvetica Neue 8px weight 700, 0.25em letter-spacing, #f0e7e4).

2. **Cream Hero Panel** — Full-width panel, background #f0e7e4 (Cream Paper), 20px radius, 40px padding. Center a Mint Chip (#56d270) badge at top center, 8px radius, '2026' label in Helvetica Neue 8px weight 700, 0.25em, color #113619. Below: 'July Fund' wordmark in Portrait 96px, line-height 1.05, color #433e3c, left-aligned. Beneath the wordmark, a two-column row with 45px column gap: left column 'About' in Portrait 30px #433e3c, right column paragraph in Helvetica Neue 15px #898989.

3. **News Article Card** — Card on Obsidian canvas, background #2b2b2b (Charcoal), 20px radius, 40px padding. 12px-radius image tile at top, full inner width. Mint Chip badge below image: 'NEWS', 8px radius, Helvetica Neue 8px weight 700, 0.25em, #113619. Headline in Portrait 30px, #ffffff. Date in Helvetica Neue 8px, 0.25em, #898989. Body excerpt in Helvetica Neue 15px, #898989. Ghost Pill Button at bottom: 'READ MORE', 24px radius, 1px #f0e7e4 border, #f0e7e4 text.

4. **Location Card** — Compact card, background #2b2b2b, 20px radius, 40px padding. Centered line-art sun icon (1.5px stroke, #f0e7e4) at top. City name in Portrait 30px, #ffffff, centered. Weather label in Helvetica Neue 8px weight 700, 0.25em, uppercase, #898989, centered.

5. **Solar Thesis Card** — Loud accent card, background #fde440 (Solar Yellow), 20px radius, 40px padding. Charcoal (#433e3c) badge at top: 'CORE THEME', 8px radius. Headline in Portrait 34px, line-height 1.20, #433e3c. Body paragraph in Helvetica Neue 15px, #433e3c.

## Similar Brands

- **Andreessen Horowitz (a16z)** — Same dark canvas with thematic color-coded content cards and a single oversized serif wordmark anchoring the hero.
- **Cyan Banister's blog / Future Fund** — Same editorial card-grid-as-index pattern, where each card's background color signals a different fund vertical or post type.
- **Substack's publication directory** — Similar tight card grid with chromatic fills per publication, pill-shaped read buttons, and uppercase 0.25em metadata labels.
- **Pitchbook / Crunchbase editorial** — Same monograph-on-dark approach — quiet body typography, oversized serif headlines, and cards that function as chapters rather than widgets.

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-obsidian: #000000;
  --color-coffee-bean: #433e3c;
  --color-cream-paper: #f0e7e4;
  --color-charcoal: #2b2b2b;
  --color-espresso: #221f1e;
  --color-stone-gray: #898989;
  --color-paper-white: #ffffff;
  --color-forest-floor: #113619;
  --color-twilight-violet: #322b66;
  --color-olive-depth: #2e2909;
  --color-solar-yellow: #fde440;
  --color-mint-chip: #56d270;
  --color-lavender-mist: #c6bffa;
  --color-ember-red: #b9534a;

  /* Typography — Font Families */
  --font-portrait: 'Portrait', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-helvetica-neue: 'Helvetica Neue', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-body-lg: 16px;
  --leading-body-lg: 1.3;
  --text-subheading: 18px;
  --leading-subheading: 1.3;
  --text-heading-sm: 30px;
  --leading-heading-sm: 1.2;
  --text-heading: 35px;
  --leading-heading: 1.2;
  --text-heading-lg: 40px;
  --leading-heading-lg: 1.2;
  --text-display: 96px;
  --leading-display: 1.05;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-40: 40px;
  --spacing-60: 60px;
  --spacing-80: 80px;
  --spacing-100: 100px;

  /* Layout */
  --page-max-width: 1280px;
  --section-gap: 80px;
  --card-padding: 40px;
  --element-gap: 20px;

  /* Border Radius */
  --radius-sm: 1px;
  --radius-md: 5px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 20px;
  --radius-3xl: 24px;

  /* Named Radii */
  --radius-cards: 20px;
  --radius-badges: 8px;
  --radius-images: 12px;
  --radius-buttons: 24px;
  --radius-smallcontrols: 5px;

  /* Surfaces */
  --surface-obsidian-canvas: #000000;
  --surface-charcoal-card: #2b2b2b;
  --surface-cream-panel: #f0e7e4;
  --surface-themed-chromatic-field: #113619;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-obsidian: #000000;
  --color-coffee-bean: #433e3c;
  --color-cream-paper: #f0e7e4;
  --color-charcoal: #2b2b2b;
  --color-espresso: #221f1e;
  --color-stone-gray: #898989;
  --color-paper-white: #ffffff;
  --color-forest-floor: #113619;
  --color-twilight-violet: #322b66;
  --color-olive-depth: #2e2909;
  --color-solar-yellow: #fde440;
  --color-mint-chip: #56d270;
  --color-lavender-mist: #c6bffa;
  --color-ember-red: #b9534a;

  /* Typography */
  --font-portrait: 'Portrait', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-helvetica-neue: 'Helvetica Neue', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-body-lg: 16px;
  --leading-body-lg: 1.3;
  --text-subheading: 18px;
  --leading-subheading: 1.3;
  --text-heading-sm: 30px;
  --leading-heading-sm: 1.2;
  --text-heading: 35px;
  --leading-heading: 1.2;
  --text-heading-lg: 40px;
  --leading-heading-lg: 1.2;
  --text-display: 96px;
  --leading-display: 1.05;

  /* Spacing */
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-40: 40px;
  --spacing-60: 60px;
  --spacing-80: 80px;
  --spacing-100: 100px;

  /* Border Radius */
  --radius-sm: 1px;
  --radius-md: 5px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 20px;
  --radius-3xl: 24px;
}
```
