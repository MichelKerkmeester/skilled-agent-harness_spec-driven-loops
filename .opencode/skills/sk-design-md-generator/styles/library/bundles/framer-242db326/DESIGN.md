# Framer — Style Reference
> cinematic black gallery. Pure black canvases cradle white editorial type and one electric blue accent that traces edges rather than filling space.

**Theme:** dark

Framer operates in absolute darkness: a pure black canvas (#000000) where white typography and one electric blue (#0099ff) do all the talking. The design language is cinematic and confident — oversized condensed display type (GT Walsheim at 85–110px) anchors every section, while the rest of the interface dissolves into near-black surface layers. The signature rhythm is alternating maximalist hero typography against minimal, gridded screenshots of customer sites, all bordered by hairline dividers and powered by compact 10px spacing. The blue accent never fills buttons; it traces edges, outlines cards, and fires on micro-interactions like text selection and link hover — restrained, never decorative. Components are weightless: pill-shaped controls, thin borders, and barely-there elevation that lets the photography and editorial typography carry the weight.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Void | `#000000` | `--color-void` | Page background, primary canvas — the void that everything else sits on. Also used for filled primary buttons, nav background, card borders, and the vast majority of interface borders |
| Carbon | `#080808` | `--color-carbon` | Card surface layer, elevated panels, secondary background — barely lifted from the void to suggest depth without leaving the dark family |
| Obsidian | `#111111` | `--color-obsidian` | Higher elevation cards and modal surfaces — the second step up from the page |
| Graphite | `#171717` | `--color-graphite` | Top-tier surface for popovers, tooltips, and deeply nested panels |
| Slate | `#242424` | `--color-slate` | Mid-tone fills, hover states, subtle panel backgrounds |
| Fog | `#333333` | `--color-fog` | Button hover, pressed states, and darker UI fills |
| Ash | `#666666` | `--color-ash` | Muted text, secondary labels, disabled states, subtle borders |
| Smoke | `#8c8c8c` | `--color-smoke` | Helper text, tertiary metadata, thin dividers |
| Silver | `#999999` | `--color-silver` | Secondary text, body copy at lower emphasis, border dividers |
| Bone | `#cccccc` | `--color-bone` | Light borders, subtle dividers on dark surfaces |
| Paper | `#ffffff` | `--color-paper` | Primary text, headings, filled button backgrounds, light-on-dark iconography — the dominant foreground against the void |
| Deep Harbor | `#021f33` | `--color-deep-harbor` | Deep blue-black for box-shadows and subtle tinted surface washes — carries the brand's cool undertone into elevation |
| Electric Cyan | `#0099ff` | `--color-electric-cyan` | Brand accent: link underlines, active nav state, focus rings, outlined button borders, decorative card borders, and text selection — appears only on edges and micro-states, never as a fill |

## Tokens — Typography

### sans-serif — sans-serif — detected in extracted data but not described by AI · `--font-sans-serif`
- **Weights:** 400
- **Sizes:** 12px
- **Line height:** 1.2
- **Role:** sans-serif — detected in extracted data but not described by AI

### GT Walsheim — Display and hero headlines. The ultra-condensed geometric character with aggressive negative tracking at 85–110px creates the editorial, almost cinematic weight that defines Framer's voice. At 110px the line-height compresses to 0.85, letting the headline feel like a single block of mass. Substitute: Inter Tight or Mona Sans as a free alternative. · `--font-gt-walsheim`
- **Weights:** 500
- **Sizes:** 32px, 62px, 85px
- **Line height:** 0.85–1.13
- **Letter spacing:** -0.0500em to -0.0310em
- **OpenType features:** `"ss02", "tnum"`
- **Role:** Display and hero headlines. The ultra-condensed geometric character with aggressive negative tracking at 85–110px creates the editorial, almost cinematic weight that defines Framer's voice. At 110px the line-height compresses to 0.85, letting the headline feel like a single block of mass. Substitute: Inter Tight or Mona Sans as a free alternative.

### Inter Variable — Primary UI and body font. The extensive character variant alternates (cv01–cv11, ss02–ss07) tune individual glyphs — switching between straight and curved tails, alternate g shapes, and stylistic sets depending on context. Body text uses subtle negative tracking (-0.01em to -0.02em); uppercase labels use positive tracking (0.03em). Substitute: Inter (Google Fonts) with matching feature settings. · `--font-inter-variable`
- **Weights:** 400
- **Sizes:** 8px, 12px, 13px, 14px, 15px, 18px, 24px
- **Line height:** 0.80–1.40
- **Letter spacing:** -0.0200em to 0.0300em
- **OpenType features:** `"cv01", "cv05", "cv09", "cv11", "dlig"; "cv06", "cv11"`
- **Role:** Primary UI and body font. The extensive character variant alternates (cv01–cv11, ss02–ss07) tune individual glyphs — switching between straight and curved tails, alternate g shapes, and stylistic sets depending on context. Body text uses subtle negative tracking (-0.01em to -0.02em); uppercase labels use positive tracking (0.03em). Substitute: Inter (Google Fonts) with matching feature settings.

### Inter — Secondary text, nav items, links, form labels, and button text. Weights 500–700 for emphasized UI elements. Tracking tightens dramatically at larger sizes (22px at -0.05em). Substitute: Inter from Google Fonts. · `--font-inter`
- **Weights:** 400, 500, 600, 700
- **Sizes:** 10px, 12px, 13px, 14px, 20px, 22px
- **Line height:** 0.83–1.60
- **Letter spacing:** -0.0530em to 0.0200em
- **OpenType features:** `"cv01", "tnum"`
- **Role:** Secondary text, nav items, links, form labels, and button text. Weights 500–700 for emphasized UI elements. Tracking tightens dramatically at larger sizes (22px at -0.05em). Substitute: Inter from Google Fonts.

### Mona Sans — Secondary display and text accents. Used at 62px for section headers, with extremely tight tracking (-0.05em) giving it a dense, graphic feel. Substitute: Mona Sans (GitHub). · `--font-mona-sans`
- **Weights:** 500
- **Sizes:** 12px, 13px, 17px, 18px, 62px
- **Line height:** 1.00–2.28
- **Letter spacing:** -0.0500em to -0.0460em
- **Role:** Secondary display and text accents. Used at 62px for section headers, with extremely tight tracking (-0.05em) giving it a dense, graphic feel. Substitute: Mona Sans (GitHub).

### Open Runde — Micro-labels and oversized tagline micro-text. Substitute: Inter at 600 weight. · `--font-open-runde`
- **Weights:** 600
- **Sizes:** 9px
- **Line height:** 1.11
- **OpenType features:** `"cv01", "cv09"`
- **Role:** Micro-labels and oversized tagline micro-text. Substitute: Inter at 600 weight.

### GT Walsheim Framer Medium — GT Walsheim Framer Medium — detected in extracted data but not described by AI · `--font-gt-walsheim-framer-medium`
- **Weights:** 500
- **Sizes:** 110px
- **Line height:** 0.85
- **Letter spacing:** -0.05
- **Role:** GT Walsheim Framer Medium — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| body | 14px | 1.3 | -0.14px | `--text-body` |
| subheading | 18px | 1.4 | -0.18px | `--text-subheading` |
| heading-sm | 24px | 1.2 | -0.48px | `--text-heading-sm` |
| heading | 32px | 1 | -1.6px | `--text-heading` |
| heading-lg | 62px | 0.95 | -3.1px | `--text-heading-lg` |
| display | 85px | 0.95 | -4.25px | `--text-display` |
| display-xl | 110px | 0.85 | -5.5px | `--text-display-xl` |

## Tokens — Spacing & Shapes

**Density:** compact

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 5 | 5px | `--spacing-5` |
| 6 | 6px | `--spacing-6` |
| 7 | 7px | `--spacing-7` |
| 8 | 8px | `--spacing-8` |
| 10 | 10px | `--spacing-10` |
| 12 | 12px | `--spacing-12` |
| 14 | 14px | `--spacing-14` |
| 15 | 15px | `--spacing-15` |
| 20 | 20px | `--spacing-20` |
| 30 | 30px | `--spacing-30` |
| 40 | 40px | `--spacing-40` |
| 47 | 47px | `--spacing-47` |
| 60 | 60px | `--spacing-60` |
| 80 | 80px | `--spacing-80` |
| 160 | 160px | `--spacing-160` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 100px |
| cards | 15px |
| icons | 8px |
| images | 8-12px |
| inputs | 8px |
| buttons | 100px |
| large-panels | 20-30px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| subtle | `rgba(0, 0, 0, 0.25) 0px 1px 2px 0px` | `--shadow-subtle` |
| subtle-2 | `rgb(9, 9, 9) 0px 0px 0px 2px` | `--shadow-subtle-2` |
| subtle-3 | `rgba(255, 255, 255, 0.1) 0px 0.5px 0px 0.5px, rgba(0, 0, ...` | `--shadow-subtle-3` |
| md | `rgba(0, 0, 0, 0.3) 0px 10px 10px 0px` | `--shadow-md` |
| lg | `rgba(0, 0, 0, 0.2) 0px 10px 20px 0px, rgba(0, 0, 0, 0.25)...` | `--shadow-lg` |
| lg-2 | `rgba(0, 0, 0, 0.6) -10px 10px 20px 10px` | `--shadow-lg-2` |
| md-2 | `rgba(0, 0, 0, 0.25) 0px 5px 10px 0px` | `--shadow-md-2` |
| subtle-4 | `rgba(255, 255, 255, 0.1) 0px 0px 0px 1px` | `--shadow-subtle-4` |
| xl | `rgba(0, 0, 0, 0.65) 0px 20px 30px 0px` | `--shadow-xl` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 60-80px
- **Card padding:** 20-24px
- **Element gap:** 10px

## Components

### Primary Filled Button
**Role:** Highest-emphasis action (e.g. 'Sign up', 'Start for free')

White background (#ffffff), black text (#000000), 100px pill radius, 10px 20px padding, Inter at 14px weight 500. No shadow. Borderless. This is the only button that fills with a solid color — everything else stays ghosted.

### Ghost/Outlined Button
**Role:** Secondary action beside primary (e.g. 'Start with AI')

Transparent background, 1px white border (rgba 10-20% white), white text, 100px pill radius, 10px 20px padding, Inter at 14px weight 500. Sits level with the void; border is the only signal.

### Electric Outlined Action
**Role:** Brand-tinted secondary action or focus/active state

Transparent background, 1px border in #0099ff, #0099ff text, 100px pill radius. Used sparingly for the rare moment the blue accent gets to act as a control — not for the default CTA.

### Hero Display Headline
**Role:** Page-top headline anchoring the visual identity

GT Walsheim Medium at 85–110px, weight 500, white (#ffffff), letter-spacing -0.05em, line-height 0.85–0.95. Centered. This is the dominant visual mass of any page — the oversized type is non-negotiable.

### Customer Site Card
**Role:** Showcase tiles in the logo wall / portfolio grid

Screenshot or render at 8–12px radius, contained within a grid with 10px gaps. No border by default; on hover, 1px #0099ff or #333 border may appear. Background is always the void (#000000) with the image doing all the work.

### Testimonial Card
**Role:** Social proof block with quote, attribution, and supporting visual

Carbon (#080808) or transparent background, no border, large white pull-quote at 24–32px GT Walsheim Medium, attribution at 12–14px Inter in #999999. Paired with a product screenshot on the right at 12px radius.

### Top Navigation Bar
**Role:** Persistent site navigation

#000000 background, logo at left, center nav links in Inter 14px weight 500 white, right side has ghost 'Log in' link and filled white 'Sign up' button (100px radius). Fixed/sticky at top. No visible border.

### Announcement Banner
**Role:** Thin strip above hero linking to reports, events, or promotions

Transparent over black, Inter 12px weight 500 white text, centered, no background fill. Optional • separator. Minimal — no pill, no background.

### Logo Grid (Customer Wall)
**Role:** Trust strip showing brands using the product

3-4 column grid on desktop, brand logos rendered in #999999 or #ffffff on #000000, even spacing at 40-60px gaps, no card chrome. Logos are monochrome to dissolve into the void.

### Section Heading
**Role:** Mid-page section titles (e.g. 'Powering ambitious teams worldwide')

GT Walsheim Medium at 62px or Inter at 32–40px, white, letter-spacing -0.03 to -0.05em, left-aligned with generous left padding. No subtitle decoration.

### Dark Image Container
**Role:** Framed media (screenshots, renders, video)

12px or 15px radius, #000000 or #080808 background behind the image, 1px border in #242424 or #333 to separate from void. Padding 0-8px between border and image edge.

### Subtle Overlay Wash
**Role:** Decorative gradient overlay for section transitions

linear-gradient(rgba(5, 255, 159, 0) 0%, rgba(0, 0, 0, 0.06) 100%) — an almost invisible downward darkening used to separate sections without hard dividers.

## Do's and Don'ts

### Do
- Set page background to #000000 and let all text be #ffffff by default — the void is the brand
- Use GT Walsheim at 85–110px for hero headlines with letter-spacing -0.05em and line-height 0.85
- Use 100px pill radius for all buttons and tags — never square buttons
- Use 10px as the standard element gap; only reach 20-24px for card padding and 60-80px for section gaps
- Apply Electric Cyan (#0099ff) only to edges: borders, underlines, focus rings, and active states — never as a fill
- Use Inter at 14px weight 400 for body text with letter-spacing -0.01em
- Express elevation through surface color progression (Carbon → Obsidian → Graphite) rather than heavy shadows

### Don't
- Don't introduce any background color other than the black-to-charcoal surface stack — no grays, no tinted backgrounds, no warm tones
- Don't use Electric Cyan (#0099ff) as a filled button background — it is an edge accent only
- Don't use box shadows with offset greater than 10px on regular cards — the design is flat-by-default
- Don't set border-radius below 8px on any container — the minimum visual softness is 8px
- Don't use font-weight above 500 for display type — GT Walsheim at 500 is already commanding; going heavier breaks the voice
- Don't add decorative gradients, glows, or colored backgrounds to sections — sections transition through pure black
- Don't use color for body text — keep all text in #ffffff, #999999, or #666666 only

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Void | `#000000` | Page background — the base canvas everything sits on |
| 1 | Carbon | `#080808` | Card surfaces, nested containers, secondary background |
| 2 | Obsidian | `#111111` | Elevated cards, modal backgrounds |
| 3 | Graphite | `#171717` | Top-level elevation, popovers, deeply nested panels |
| 4 | Slate | `#242424` | Hover states, interactive fills, subtle overlays |

## Elevation

- **Card:** `rgba(0, 0, 0, 0.25) 0px 1px 2px 0px`
- **Elevated Panel:** `rgba(0, 0, 0, 0.25) 0px 10px 30px 0px, rgba(255, 255, 255, 0.1) 0px 0.5px 0px 0.5px`
- **Modal:** `rgba(0, 0, 0, 0.6) -10px 10px 20px 10px`

## Imagery

Photography and product renders do the heavy lifting in a nearly text-free design. Customer site showcases appear as contained screenshots in a 5-column tile grid, each at 8–12px radius, floating on pure black. Section visuals pair a large product render or editorial photograph (e.g. a creative professional portrait) with a dark overlay card containing UI chrome. Photography is high-contrast, editorial in quality, and always set against dark or neutral environments — no lifestyle clutter, no bright studio setups. Decorative gradients are nearly invisible (6% black overlay). Icons are minimal and outlined at 1px stroke weight in white or Electric Cyan. There are no illustrated characters, no 3D mascots, and no abstract geometric decorations — the visual restraint is total.

## Layout

Full-bleed dark canvas with max-width 1200px content containers. The hero is centered text-only: announcement strip → 110px headline → 3-line subhead → twin CTA row (filled + ghost). Below the hero, a full-bleed 5-column customer site tile grid bleeds edge-to-edge, breaking the container. Subsequent sections use a max-width 1200px left-aligned model: 62px section heading followed by single-column testimonial cards that are 2-column (quote-left / product-render-right). Navigation is a sticky top bar with centered nav links. Vertical rhythm is consistent: 60–80px section gaps, 10px within-card gaps. The page breathes — large blocks of negative space between editorial-type sections create a gallery-walk feeling.

## Agent Prompt Guide

## Quick Color Reference
- Background: #000000
- Surface elevated: #080808
- Primary text: #ffffff
- Muted text: #999999
- Border / divider: #242424
- Accent (edges only): #0099ff
- primary action: #ffffff (filled action)

## Example Component Prompts

1. **Hero Section**: Full-bleed #000000 background. Centered headline in GT Walsheim 85px weight 500, #ffffff, letter-spacing -4.25px, line-height 0.95. Subtext in Inter 18px weight 400, #999999. Two buttons centered below: a filled white pill button ('Start for free', #ffffff bg, #000000 text, 100px radius, 10px 20px padding) beside a ghost outlined pill ('Start with AI', transparent bg, 1px rgba(255,255,255,0.2) border, #ffffff text, 100px radius).

2. **Customer Site Tile Grid**: Full-bleed section, #000000 background, 5-column grid with 10px gaps. Each tile is a screenshot image at 8px radius, no border, no padding — the image fills the tile. Below the grid, a row of monochrome customer logos in #999999 Inter 18px weight 500.

3. **Testimonial Block**: #000000 background, left-aligned content within 1200px max-width. Section heading in GT Walsheim 62px weight 500, #ffffff, letter-spacing -3.1px. Below, a 2-column layout: left column has a 24px GT Walsheim pull-quote in #ffffff with 12px Inter attribution in #999999; right column has a product screenshot in a dark container at 12px radius, 1px #242424 border, #080808 padding.

4. **Top Navigation**: Sticky, #000000 background, 0 border. Left: 24px white logo. Center: Inter 14px weight 500 nav links in #ffffff, 24px gap. Right: ghost 'Log in' link (#999999, 14px) beside a filled 'Sign up' pill button (#ffffff bg, #000000 text, 100px radius, 8px 16px padding).

5. **Section Divider**: No visible divider. Instead, use 60-80px of #000000 negative space between sections. For subtle separation, apply a linear-gradient(rgba(5,255,159,0) 0%, rgba(0,0,0,0.06) 100%) overlay at the bottom edge of a section.

## Typography Philosophy

Two type systems coexist: GT Walsheim (display, editorial, commanding) and Inter (UI, body, precise). GT Walsheim at 500 weight — never bolder — carries the hero. Inter handles everything from 9px micro-labels to 24px subheads with consistent weight 400-500. Character variants (cv01-cv11, ss02-ss07) are used per-context to tune glyph aesthetics: some sections use straight-tailed a/g, others use curved; some use tabular numerals (tnum), others proportional. This per-context typographic tuning is a hidden signature of the system — it's why the font feels custom without actually being custom in most places.

## Similar Brands

- **Linear** — Same pure-black dark mode, pill-shaped controls, and oversized condensed display type at hero — both treat black as a first-class brand color
- **Vercel** — Identical philosophy: monochrome palette, hairline borders, compact spacing, and editorial-scale typography that dominates the layout
- **Raycast** — Same dark surface stack progression (near-black layers), compact 10px rhythm, and restrained single-color accent on edges rather than fills
- **Arc Browser** — Both use cinematic dark canvases with bold display type, customer/portfolio wall grids, and let a single accent color trace edges rather than fill shapes

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-void: #000000;
  --color-carbon: #080808;
  --color-obsidian: #111111;
  --color-graphite: #171717;
  --color-slate: #242424;
  --color-fog: #333333;
  --color-ash: #666666;
  --color-smoke: #8c8c8c;
  --color-silver: #999999;
  --color-bone: #cccccc;
  --color-paper: #ffffff;
  --color-deep-harbor: #021f33;
  --color-electric-cyan: #0099ff;

  /* Typography — Font Families */
  --font-sans-serif: 'sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-gt-walsheim: 'GT Walsheim', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter-variable: 'Inter Variable', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-mona-sans: 'Mona Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-open-runde: 'Open Runde', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-gt-walsheim-framer-medium: 'GT Walsheim Framer Medium', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-body: 14px;
  --leading-body: 1.3;
  --tracking-body: -0.14px;
  --text-subheading: 18px;
  --leading-subheading: 1.4;
  --tracking-subheading: -0.18px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: -0.48px;
  --text-heading: 32px;
  --leading-heading: 1;
  --tracking-heading: -1.6px;
  --text-heading-lg: 62px;
  --leading-heading-lg: 0.95;
  --tracking-heading-lg: -3.1px;
  --text-display: 85px;
  --leading-display: 0.95;
  --tracking-display: -4.25px;
  --text-display-xl: 110px;
  --leading-display-xl: 0.85;
  --tracking-display-xl: -5.5px;

  /* Typography — Weights */
  --font-weight-thin: 100;
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-5: 5px;
  --spacing-6: 6px;
  --spacing-7: 7px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-14: 14px;
  --spacing-15: 15px;
  --spacing-20: 20px;
  --spacing-30: 30px;
  --spacing-40: 40px;
  --spacing-47: 47px;
  --spacing-60: 60px;
  --spacing-80: 80px;
  --spacing-160: 160px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 60-80px;
  --card-padding: 20-24px;
  --element-gap: 10px;

  /* Border Radius */
  --radius-sm: 1px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-xl-2: 15px;
  --radius-2xl: 20px;
  --radius-3xl: 30px;
  --radius-3xl-2: 40px;
  --radius-full: 50px;
  --radius-full-2: 100px;
  --radius-full-3: 200px;

  /* Named Radii */
  --radius-tags: 100px;
  --radius-cards: 15px;
  --radius-icons: 8px;
  --radius-images: 8-12px;
  --radius-inputs: 8px;
  --radius-buttons: 100px;
  --radius-large-panels: 20-30px;

  /* Shadows */
  --shadow-subtle: rgba(0, 0, 0, 0.25) 0px 1px 2px 0px;
  --shadow-subtle-2: rgb(9, 9, 9) 0px 0px 0px 2px;
  --shadow-subtle-3: rgba(255, 255, 255, 0.1) 0px 0.5px 0px 0.5px, rgba(0, 0, 0, 0.25) 0px 10px 30px 0px;
  --shadow-md: rgba(0, 0, 0, 0.3) 0px 10px 10px 0px;
  --shadow-lg: rgba(0, 0, 0, 0.2) 0px 10px 20px 0px, rgba(0, 0, 0, 0.25) 0px 2px 4px 0px;
  --shadow-lg-2: rgba(0, 0, 0, 0.6) -10px 10px 20px 10px;
  --shadow-md-2: rgba(0, 0, 0, 0.25) 0px 5px 10px 0px;
  --shadow-subtle-4: rgba(255, 255, 255, 0.1) 0px 0px 0px 1px;
  --shadow-xl: rgba(0, 0, 0, 0.65) 0px 20px 30px 0px;

  /* Surfaces */
  --surface-void: #000000;
  --surface-carbon: #080808;
  --surface-obsidian: #111111;
  --surface-graphite: #171717;
  --surface-slate: #242424;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-void: #000000;
  --color-carbon: #080808;
  --color-obsidian: #111111;
  --color-graphite: #171717;
  --color-slate: #242424;
  --color-fog: #333333;
  --color-ash: #666666;
  --color-smoke: #8c8c8c;
  --color-silver: #999999;
  --color-bone: #cccccc;
  --color-paper: #ffffff;
  --color-deep-harbor: #021f33;
  --color-electric-cyan: #0099ff;

  /* Typography */
  --font-sans-serif: 'sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-gt-walsheim: 'GT Walsheim', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter-variable: 'Inter Variable', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-mona-sans: 'Mona Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-open-runde: 'Open Runde', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-gt-walsheim-framer-medium: 'GT Walsheim Framer Medium', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-body: 14px;
  --leading-body: 1.3;
  --tracking-body: -0.14px;
  --text-subheading: 18px;
  --leading-subheading: 1.4;
  --tracking-subheading: -0.18px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: -0.48px;
  --text-heading: 32px;
  --leading-heading: 1;
  --tracking-heading: -1.6px;
  --text-heading-lg: 62px;
  --leading-heading-lg: 0.95;
  --tracking-heading-lg: -3.1px;
  --text-display: 85px;
  --leading-display: 0.95;
  --tracking-display: -4.25px;
  --text-display-xl: 110px;
  --leading-display-xl: 0.85;
  --tracking-display-xl: -5.5px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-5: 5px;
  --spacing-6: 6px;
  --spacing-7: 7px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-14: 14px;
  --spacing-15: 15px;
  --spacing-20: 20px;
  --spacing-30: 30px;
  --spacing-40: 40px;
  --spacing-47: 47px;
  --spacing-60: 60px;
  --spacing-80: 80px;
  --spacing-160: 160px;

  /* Border Radius */
  --radius-sm: 1px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-xl-2: 15px;
  --radius-2xl: 20px;
  --radius-3xl: 30px;
  --radius-3xl-2: 40px;
  --radius-full: 50px;
  --radius-full-2: 100px;
  --radius-full-3: 200px;

  /* Shadows */
  --shadow-subtle: rgba(0, 0, 0, 0.25) 0px 1px 2px 0px;
  --shadow-subtle-2: rgb(9, 9, 9) 0px 0px 0px 2px;
  --shadow-subtle-3: rgba(255, 255, 255, 0.1) 0px 0.5px 0px 0.5px, rgba(0, 0, 0, 0.25) 0px 10px 30px 0px;
  --shadow-md: rgba(0, 0, 0, 0.3) 0px 10px 10px 0px;
  --shadow-lg: rgba(0, 0, 0, 0.2) 0px 10px 20px 0px, rgba(0, 0, 0, 0.25) 0px 2px 4px 0px;
  --shadow-lg-2: rgba(0, 0, 0, 0.6) -10px 10px 20px 10px;
  --shadow-md-2: rgba(0, 0, 0, 0.25) 0px 5px 10px 0px;
  --shadow-subtle-4: rgba(255, 255, 255, 0.1) 0px 0px 0px 1px;
  --shadow-xl: rgba(0, 0, 0, 0.65) 0px 20px 30px 0px;
}
```
