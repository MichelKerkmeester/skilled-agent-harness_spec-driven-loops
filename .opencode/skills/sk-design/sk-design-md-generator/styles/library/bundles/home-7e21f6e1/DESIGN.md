# Home — Style Reference
> Primary-color toy aisle — the brightness of a freshly opened set box on a white table.

**Theme:** light

LEGO's digital storefront feels like a toy aisle rendered in pixels — primary colors deployed with zero restraint, product photography doing all the emotional lifting against white and near-black surfaces. The yellow (#FFD502) is the brand's pulse: it appears on badges, nav highlights, and the logo bar, a single chromatic constant amid a white/off-black neutral scaffold. The orange CTA (#F47D20) on 999px pill buttons is the only call to action color — warm, rounded, immediately readable against product whites. The dark footer (#201D48) anchors the page in LEGO's classic deep navy, grounding a page that otherwise lives in bright daylight. Type is entirely Cera Pro, a custom geometric rounded sans that echoes brick curves — weight 700 for headings at tight tracking, weight 400 for body, nothing else.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| LEGO Yellow | `#FFD502` | `--color-lego-yellow` | Logo background, badges, active nav indicators, brand accent — the single chromatic constant that appears regardless of page section, making every badge feel like a price sticker on a toy box. |
| Brick Orange | `#F47D20` | `--color-brick-orange` | Primary CTA buttons ('Buy now', 'Add to Bag', 'Become a member') — warm against white product backgrounds, the only pill button fill color for purchase actions. |
| Ember Dark | `#E96F14` | `--color-ember-dark` | Orange hover/pressed state for CTA buttons — 1 step darker than Brick Orange. |
| LEGO Navy | `#201D48` | `--color-lego-navy` | Footer background, deep brand surface — the only dark chromatic surface, anchoring the page bottom with brand identity. |
| Link Blue | `#006DB7` | `--color-link-blue` | Body copy links, inline hyperlinks within editorial text — vivid blue on white for maximum contrast. |
| Action Blue | `#005AD2` | `--color-action-blue` | Secondary action buttons ('Become a member', 'Learn more'), interactive link emphasis — the outlined pill button border and text color. |
| Flag Red | `#D0021B` | `--color-flag-red` | 'New' nav badge text — used sparingly to flag newness in navigation. |
| Off Black | `#141414` | `--color-off-black` | Primary text, card titles, prices, icon fills — the dominant foreground color across all light surfaces. |
| Graphite | `#2C2C2C` | `--color-graphite` | Secondary text, badge labels, footer body text, nav items. |
| Pitch | `#000000` | `--color-pitch` | Button label text on orange CTAs, heavy borders on ghost buttons. |
| Snow | `#FFFFFF` | `--color-snow` | Page background, card surfaces, input backgrounds, text on dark surfaces. |
| Fog | `#F2F2F2` | `--color-fog` | Secondary button fill (icon-only circular buttons, wishlist/cart controls), subtle surface backgrounds. |
| Pebble | `#F6F6F6` | `--color-pebble` | Page section backgrounds, list row fills — one step warmer than pure white. |
| Steel | `#757575` | `--color-steel` | Disabled state text, muted borders, helper text. |
| Silver | `#E0E0E0` | `--color-silver` | Input borders in default state. |

## Tokens — Typography

### Cera Pro — The only typeface on the site. Weight 700 at 24–37px for headings with -0.02em tracking — the negative spacing compensates for the geometric roundness of Cera Pro at large sizes, preventing letters from floating apart. Weight 500 for subheadings and labels. Weight 400 for body, nav links, and badge text. The custom geometric rounded sans directly mirrors LEGO brick corner geometry — a system font would read as generic where Cera Pro reads as branded. · `--font-cera-pro`
- **Substitute:** Nunito, Poppins
- **Weights:** 400, 500, 700
- **Sizes:** 12px, 14px, 16px, 18px, 19px, 20px, 24px, 30px, 37px
- **Line height:** 1.15–1.62 (display: 1.15, body: 1.50–1.58)
- **Letter spacing:** -0.02em at display/heading sizes, -0.01em at mid sizes, +0.01em at caption sizes
- **OpenType features:** `normal`
- **Role:** The only typeface on the site. Weight 700 at 24–37px for headings with -0.02em tracking — the negative spacing compensates for the geometric roundness of Cera Pro at large sizes, preventing letters from floating apart. Weight 500 for subheadings and labels. Weight 400 for body, nav links, and badge text. The custom geometric rounded sans directly mirrors LEGO brick corner geometry — a system font would read as generic where Cera Pro reads as branded.

### Cera Pro Italic — Caption-level italic, used for fine-print disclaimers and legal copy only. · `--font-cera-pro-italic`
- **Substitute:** Nunito Italic
- **Weights:** 400
- **Sizes:** 12px
- **Line height:** 1.58
- **Letter spacing:** normal
- **Role:** Caption-level italic, used for fine-print disclaimers and legal copy only.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.58 | 0.12px | `--text-caption` |
| body-sm | 14px | 1.56 | — | `--text-body-sm` |
| body | 16px | 1.5 | — | `--text-body` |
| subheading | 18px | 1.36 | — | `--text-subheading` |
| heading-sm | 20px | 1.35 | — | `--text-heading-sm` |
| heading | 24px | 1.19 | -0.48px | `--text-heading` |
| heading-lg | 30px | 1.15 | -0.3px | `--text-heading-lg` |
| display | 37px | 1.15 | -0.74px | `--text-display` |

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
| 192 | 192px | `--spacing-192` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 4px |
| cards | 8px |
| badges | 0px |
| inputs | 0px |
| buttons | 999px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| sm | `rgba(0, 0, 0, 0.54) 0px 2px 4px 0px` | `--shadow-sm` |

### Layout

- **Page max-width:** 1280px
- **Section gap:** 48-64px
- **Element gap:** 8-16px

## Components

### Primary CTA Pill Button
**Role:** Purchase actions: 'Add to Bag', 'Buy now', 'Become a member'

Background #F47D20, text #000000, font Cera Pro 700 16px, border-radius 999px, padding 10px 16px. No border. Hover/pressed state adds rgba(0,0,0,0.54) 0px 2px 4px shadow and shifts to #E96F14 background. Icon (shopping bag) inline-left at 12px gap. The orange-on-white contrast ratio is visually loud — deliberate for a toy retail context.

### Outlined Pill Button
**Role:** Secondary actions: 'Learn more', 'Shop all new', 'Join LEGO® Insiders'

Background transparent, text #141414, border 1px solid rgba(0,0,0,0.67), border-radius 999px, padding 10px 16px. Font Cera Pro 500 16px. Trailing chevron icon in 14px. On dark hero surfaces this border reads clearly against the image background.

### Circular Icon Button
**Role:** Wishlist, cart, carousel controls

Background #F2F2F2, border-radius 999px, 40×40px fixed size (padding 0). Icon centered in #141414. No border, no shadow. Used for wishlist hearts on product cards and prev/next carousel arrows.

### Ghost Text Button
**Role:** Inline navigation actions, tab underlines

Background transparent, text #000000, border-radius 0px, no padding. Font Cera Pro 400 16px. Bottom-border underline style for active tab states (3px solid #141414). Zero radius signals this is a flat navigation control, not a CTA.

### New/Exclusives Badge
**Role:** Product card status labels, hero content tags

Background #FFD502, text #141414, border-radius 0px, padding 4px 12px. Font Cera Pro 700 12px, letter-spacing +0.01em. Sharp corners are intentional — the badge reads like a price sticker, reinforcing the physical retail metaphor. Appears top-left of product card images.

### Category Navigation Tile
**Role:** Theme/category browsing grid below hero tabs

Square tile with full-bleed product photography, category label in Cera Pro 700 16px white text overlaid top-center. No border-radius (0px). Hover state not visible in static data but tile grid is 8-column at desktop. Tiles for licensed categories (Pokémon, TMNT) use character art backgrounds.

### Search Input
**Role:** Global site search in header

Background #FFFFFF, border 1px solid #E0E0E0, border-radius 0px (sharp), padding 18px 20px. Font Cera Pro 400 16px #141414. Search icon (magnifier) at left edge. Full-width within header search zone. The sharp radius contrasts with all the 999px pill buttons — search is a field, not an action.

### Tab Navigation
**Role:** Section content switcher ('What's new / Gifting / Themes', 'Featured / Formula 1®')

Underline tab pattern: active tab has 3px bottom border #141414, inactive tabs #757575 text, no border. Font Cera Pro 500 16px. Padding 0 0 12px 0. Row gap 16px between tabs. No background fill on any state — pure text + underline system.

### Announcement Banner
**Role:** Promotional message bar at top of page

Background #141414, text #FFFFFF, Cera Pro 400 14px. Left: 'PLAY ZONE' in yellow pill tag (#FFD502, 0px radius). Center: offer copy with inline 'Shop now' link in #FFFFFF underlined. Prev/next arrow controls in #FFFFFF. Full-bleed width, ~40px height.

### Insiders Membership Card Row
**Role:** Benefit showcase in membership section

3-column row of benefit tiles: each tile has a full-bleed colored image (red, yellow, green backgrounds with product photography), 16px label Cera Pro 700 below, 14px description Cera Pro 400 #2C2C2C. No card border or shadow — tiles are visually separated by 16px gap on white section background.

### Site Footer
**Role:** Global navigation footer

Background #201D48, text #FFFFFF, Cera Pro 400 14px. 5-column link grid: section headers in Cera Pro 700 12px uppercase letter-spacing +0.01em, links at 400 14px. LEGO logo in white on yellow (#FFD502) square badge at top-left. Footer sits in strong visual contrast to the white page body — the navy is the only dark chromatic surface on the page.

## Do's and Don'ts

### Do
- Use 999px border-radius for all interactive buttons — CTA, secondary, and icon-only circular controls without exception.
- Place #FFD502 badges with 0px border-radius and padding 4px 12px on product imagery — never round the badge corners.
- Use #F47D20 exclusively for primary purchase CTA buttons; reserve #005AD2 for secondary/informational pill buttons.
- Set Cera Pro 700 with letter-spacing -0.02em for all headings at 24px and above.
- Keep product cards border-radius 8px with split construction: image area top-rounded, content area bottom-rounded, white fill, no box-shadow — rely on #F6F6F6 page background for contrast.
- Use #141414 as the default text color on all light surfaces; never substitute with pure #000000 for body text.
- Maintain the yellow (#FFD502) header bar and square LEGO logo block as the only chromatic navigation surface — never introduce colored top nav backgrounds.

### Don't
- Never use border-radius on badge/label elements — 0px sharp corners are the sticker/price-tag signature for status labels.
- Never apply box-shadow to product cards — elevation through background color contrast only (#FFFFFF card on #F6F6F6 base).
- Never use more than one CTA button color per page section — all purchase CTAs are #F47D20, all secondary CTAs are outlined or #005AD2.
- Never set Cera Pro at weight 300 — the site uses only 400, 500, and 700; sub-regular weights are off-brand.
- Never place text-heavy content over hero imagery without a sufficient semi-transparent scrim or white card overlay — the hero text block uses a white background panel, not text-over-image.
- Never use rounded inputs — search and form fields are 0px radius to visually distinguish data-entry from interactive controls.
- Never use the LEGO Navy (#201D48) as a section background mid-page — it belongs exclusively to the footer anchor.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Page Base | `#F6F6F6` | Overall page background, section fills between content blocks |
| 1 | Card Surface | `#FFFFFF` | Product card backgrounds, content panels, input fields |
| 2 | Header Bar | `#FFD502` | Primary navigation bar, brand stripe |
| 3 | Dark Tray | `#141414` | Promotional announcement bar at top of page |
| 4 | Footer Well | `#201D48` | Site footer, deep brand anchor surface |

## Elevation

- **Primary CTA Button (pressed/hover state):** `rgba(0, 0, 0, 0.54) 0px 2px 4px 0px`

## Imagery

Product photography is the dominant visual medium — tight shots of assembled LEGO sets on clean gradient or white backgrounds, presented at a slight 3/4 angle to show depth. Hero section uses full-bleed composite photography blending physical models with illustrated sky backgrounds, creating a staged narrative around licensed products (PAN AM Airliner floating against a blue sky). Category tiles use full-bleed character art and product compositions. Minifigure photography appears as lifestyle elements in the hero — arranged like a cast photo. Icons are filled mono-color glyphs (shopping bag, heart, star, minifigure) at 16-20px, brand-colored (#141414 on light, #FFFFFF on dark). No lifestyle photography of humans — products and characters are always the subject. Image density is very high in the hero and category grid, then drops to white-background product isolation in the product card grid.

## Layout

Max-width ~1280px centered on page, but hero and announcement bar are full-bleed. Navigation bar is sticky, 3-zone: yellow LEGO logo square left, horizontal nav links center, utility icons (search, wishlist, cart) right. Hero is full-viewport-height image composite with overlaid text and pill button CTAs centered-left over the imagery. Below hero: tab navigation row (3 tabs) followed by an 8-column category tile grid, full-width. Product card section uses a 5-column card grid on white/fog background with horizontal scroll carousel controls. Membership section is a 2-column layout (text-left, 3-column benefit tiles right). Footer is a 5-column link grid on #201D48. Section rhythm alternates: dark announcement bar → yellow nav → full-bleed hero → dark secondary nav strip → white category grid → white product grid → light gray membership → white → navy footer. Vertical section spacing 48-64px. Comfortable density — significant white space between product cards.

## Agent Prompt Guide

**Quick Color Reference**
- Page background: #F6F6F6
- Card surface: #FFFFFF
- Primary text: #141414
- CTA button fill: #F47D20
- Brand badge / nav bar: #FFD502
- Links / secondary action: #005AD2
- Footer background: #201D48
- Border (input): #E0E0E0

**Example Component Prompts**

1. **Product Card**: White card (border-radius 8px 8px 0 0 image area, 0 0 8px 8px content area) on #F6F6F6. Image full-width, no padding. Overlay #FFD502 badge (0px radius, padding 4px 12px, Cera Pro 700 12px #141414) top-left. Content area: padding 24px 16px. Product name Cera Pro 500 16px #141414. Price Cera Pro 700 16px #141414. Metadata (age/pieces/rating) Cera Pro 400 12px #757575. 'Add to Bag' pill button (#F47D20, #000000 text, 999px radius, padding 10px 16px, Cera Pro 700 14px) full-width. Wishlist icon (circular #F2F2F2 40×40px, 999px radius) right of button.

2. **Hero Section**: Full-bleed composite product photography background. Centered-left overlay: #FFD502 + outlined pill badges ('New', 'Exclusives', 0px radius, Cera Pro 700 12px). Headline Cera Pro 700 37px #141414 letter-spacing -0.74px. Subtext Cera Pro 400 16px #141414. Two pill buttons row: 'Buy now' (#F47D20 fill, #000000, 999px radius, 10px 16px) + 'Shop all new' (transparent, #000000 border rgba(0,0,0,0.67), 999px radius, 10px 16px).

3. **Category Tile Grid**: 8-column grid, no gap or 2px gap. Each tile: full-bleed image, category label Cera Pro 700 16px #FFFFFF centered-top overlay. 0px border-radius. Hover state: slight image scale (1.03).

4. **Announcement Banner**: Full-bleed #141414 bar ~40px. Left: 'PLAY ZONE' tag #FFD502 0px radius Cera Pro 700 12px #141414 padding 4px 8px. Center: Cera Pro 400 14px #FFFFFF offer text + 'Shop now' #FFFFFF underline link. Prev/next #FFFFFF chevron arrows flanking center text.

5. **Footer**: #201D48 background. LEGO logo: #FFD502 square 48×48px with white logo SVG. 5-column link grid, Cera Pro 700 12px #FFFFFF uppercase letter-spacing +0.01em section headers, Cera Pro 400 14px #FFFFFF links, 8px row gap.

## Badge System

LEGO uses exactly two badge shapes: (1) Status stickers — 0px radius, #FFD502 background, #141414 text, Cera Pro 700 12px, padding 4px 12px. Used for 'New', 'Exclusives', 'Offers' on product cards and hero overlays. (2) Tab underline indicators — no background, 3px bottom border #141414, active state only. The 0px radius is non-negotiable — rounded badges undermine the sticker metaphor that ties digital badges to physical LEGO price tags.

## Similar Brands

- **Hasbro Shop** — Same product-photography-first card grid with orange/yellow accent CTA buttons and white dominant background
- **Mattel Shop** — Identical pill-button + hero-composite-image pattern with licensed character product art
- **Nintendo Store** — Branded yellow/red primary color system with category tile grid and full-bleed hero imagery
- **Target** — Same red/orange CTA pill button on white product card grid with sticky utility nav
- **Funko** — Character-forward product photography in category tile browsing grid with bright accent badges

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-lego-yellow: #FFD502;
  --color-brick-orange: #F47D20;
  --color-ember-dark: #E96F14;
  --color-lego-navy: #201D48;
  --color-link-blue: #006DB7;
  --color-action-blue: #005AD2;
  --color-flag-red: #D0021B;
  --color-off-black: #141414;
  --color-graphite: #2C2C2C;
  --color-pitch: #000000;
  --color-snow: #FFFFFF;
  --color-fog: #F2F2F2;
  --color-pebble: #F6F6F6;
  --color-steel: #757575;
  --color-silver: #E0E0E0;

  /* Typography — Font Families */
  --font-cera-pro: 'Cera Pro', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-cera-pro-italic: 'Cera Pro Italic', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.58;
  --tracking-caption: 0.12px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.56;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-subheading: 18px;
  --leading-subheading: 1.36;
  --text-heading-sm: 20px;
  --leading-heading-sm: 1.35;
  --text-heading: 24px;
  --leading-heading: 1.19;
  --tracking-heading: -0.48px;
  --text-heading-lg: 30px;
  --leading-heading-lg: 1.15;
  --tracking-heading-lg: -0.3px;
  --text-display: 37px;
  --leading-display: 1.15;
  --tracking-display: -0.74px;

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
  --spacing-192: 192px;

  /* Layout */
  --page-max-width: 1280px;
  --section-gap: 48-64px;
  --element-gap: 8-16px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-2xl: 20px;
  --radius-full: 999px;

  /* Named Radii */
  --radius-tags: 4px;
  --radius-cards: 8px;
  --radius-badges: 0px;
  --radius-inputs: 0px;
  --radius-buttons: 999px;

  /* Shadows */
  --shadow-sm: rgba(0, 0, 0, 0.54) 0px 2px 4px 0px;

  /* Surfaces */
  --surface-page-base: #F6F6F6;
  --surface-card-surface: #FFFFFF;
  --surface-header-bar: #FFD502;
  --surface-dark-tray: #141414;
  --surface-footer-well: #201D48;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-lego-yellow: #FFD502;
  --color-brick-orange: #F47D20;
  --color-ember-dark: #E96F14;
  --color-lego-navy: #201D48;
  --color-link-blue: #006DB7;
  --color-action-blue: #005AD2;
  --color-flag-red: #D0021B;
  --color-off-black: #141414;
  --color-graphite: #2C2C2C;
  --color-pitch: #000000;
  --color-snow: #FFFFFF;
  --color-fog: #F2F2F2;
  --color-pebble: #F6F6F6;
  --color-steel: #757575;
  --color-silver: #E0E0E0;

  /* Typography */
  --font-cera-pro: 'Cera Pro', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-cera-pro-italic: 'Cera Pro Italic', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.58;
  --tracking-caption: 0.12px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.56;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-subheading: 18px;
  --leading-subheading: 1.36;
  --text-heading-sm: 20px;
  --leading-heading-sm: 1.35;
  --text-heading: 24px;
  --leading-heading: 1.19;
  --tracking-heading: -0.48px;
  --text-heading-lg: 30px;
  --leading-heading-lg: 1.15;
  --tracking-heading-lg: -0.3px;
  --text-display: 37px;
  --leading-display: 1.15;
  --tracking-display: -0.74px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-192: 192px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-2xl: 20px;
  --radius-full: 999px;

  /* Shadows */
  --shadow-sm: rgba(0, 0, 0, 0.54) 0px 2px 4px 0px;
}
```
