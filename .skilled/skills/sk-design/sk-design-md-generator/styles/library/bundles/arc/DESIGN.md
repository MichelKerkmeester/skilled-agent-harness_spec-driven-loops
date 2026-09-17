# Arc — Style Reference
> Scalloped editorial playground

**Theme:** light

Arc's site reads like a warm editorial spread sliced with a craft-paper cutter: vanilla cream canvases, scalloped section edges that ripple between every band, and a single vivid violet that floods large blocks like a color-soaked page turn. Serif headlines (Marlin) pair with clean sans-serif UI (Inter) to create an editorial-meets-product tension, while the browser itself — not photography — is the hero, rendered as large interactive mockups with sidebar spaces, folders, and inline chat. The palette is mostly paper and ink; the violet is atmospheric punctuation rather than interactive color, and the wavy dividers do most of the personality work that shadows and gradients do on other sites.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Electric Iris | `#3139fb` | `--color-electric-iris` | Full-bleed section backgrounds, brand atmosphere, sidebar chrome inside the browser mockup — a single high-saturation violet floods entire bands so the page reads as editorial color blocking, not UI state |
| Deep Violet | `#2702c2` | `--color-deep-violet` | Darker accent layer within violet sections, pressed or active states inside the brand color, secondary headings on violet — deepens the iris without shifting hue |
| Oat | `#fffadd` | `--color-oat` | Primary page canvas and hero gradient base — warm cream that reads as paper rather than screen white, the default surface everything else sits on |
| Linen | `#fffcec` | `--color-linen` | Secondary warm surface for cards, nav backgrounds, and footer — a half-step warmer than Oat, used when a layer needs to lift off the canvas without going white |
| Paper White | `#ffffff` | `--color-paper-white` | Pure white for browser-mockup card interiors, text on dark surfaces, and the scalloped divider ridges that separate colored bands |
| Obsidian | `#000000` | `--color-obsidian` | Dark supporting neutral for text, icons, and strong contrast. Do not promote it to the primary CTA color |
| Granite | `#696969` | `--color-granite` | Muted body copy, secondary descriptions, and helper text — mid-gray that recedes against Oat without disappearing |
| Olive Stone | `#595853` | `--color-olive-stone` | Subtle secondary text and warm-leaning gray for fine print — slightly olive-shifted to harmonize with the cream canvas instead of fighting it |

## Tokens — Typography

### Marlin Soft SQ — Softer variant of Marlin for nav, subheadings, and secondary display sizes (28–40px) — the rounded terminals feel friendly against Marlin's sharper display cuts · `--font-marlin-soft-sq`
- **Substitute:** GT Sectra Soft, Söhne Soft, or Inter Display
- **Weights:** 500, 700
- **Sizes:** 14px, 16px, 28px, 40px, 46px
- **Line height:** 0.93, 0.98, 1.07, 1.10, 1.20
- **Letter spacing:** -0.05em, -0.04em, -0.02em
- **Role:** Softer variant of Marlin for nav, subheadings, and secondary display sizes (28–40px) — the rounded terminals feel friendly against Marlin's sharper display cuts

### Marlin — Primary display serif for hero headlines and large editorial pull-quotes at 46px; weight 400 for body 16px — the contrast between hairline serif body and heavy serif display is the site's typographic signature · `--font-marlin`
- **Substitute:** GT Sectra, Tiempos Headline, or DM Serif Display
- **Weights:** 400, 700, 800
- **Sizes:** 16px, 46px
- **Line height:** 0.93, 1.20
- **Letter spacing:** -0.04em
- **Role:** Primary display serif for hero headlines and large editorial pull-quotes at 46px; weight 400 for body 16px — the contrast between hairline serif body and heavy serif display is the site's typographic signature

### InterVariable — UI text, labels, and interface annotations — the workhorse sans for everything inside the browser mockup and supporting copy around the page · `--font-intervariable`
- **Substitute:** Inter, Söhne, or General Sans
- **Weights:** 500, 600, 700
- **Sizes:** 12px, 17px
- **Line height:** 1.20, 1.50
- **Letter spacing:** 0.033em
- **Role:** UI text, labels, and interface annotations — the workhorse sans for everything inside the browser mockup and supporting copy around the page

### ABC Favorit Mono — Micro-labels, tags, and category markers at 12px with wide tracking (up to 0.15em) — the monospaced rhythm breaks the serif/sans pattern and signals 'metadata' · `--font-abc-favorit-mono`
- **Substitute:** JetBrains Mono, ABC Diatype Mono, or IBM Plex Mono
- **Weights:** 400, 700
- **Sizes:** 12px
- **Line height:** 1.20
- **Letter spacing:** 0.033em, 0.05em, 0.15em
- **Role:** Micro-labels, tags, and category markers at 12px with wide tracking (up to 0.15em) — the monospaced rhythm breaks the serif/sans pattern and signals 'metadata'

### ABC Oracle — Secondary serif body at 20–24px for longer descriptive paragraphs that sit between the Marlin display headlines — bridges display and UI without switching families · `--font-abc-oracle`
- **Substitute:** ABC Diatype, Source Serif, or Tiempos Text
- **Weights:** 400
- **Sizes:** 20px, 24px
- **Line height:** 1.20
- **Letter spacing:** normal
- **Role:** Secondary serif body at 20–24px for longer descriptive paragraphs that sit between the Marlin display headlines — bridges display and UI without switching families

### Exposure VAR — Tight display headline at 36px with 1.0 line-height — used sparingly for emphasis where a more compressed cut is needed than Marlin provides · `--font-exposure-var`
- **Substitute:** ABC Diatype Display Tight, Druk, or Söhne Breit
- **Weights:** 700
- **Sizes:** 36px
- **Line height:** 1.00
- **Letter spacing:** -0.02em
- **Role:** Tight display headline at 36px with 1.0 line-height — used sparingly for emphasis where a more compressed cut is needed than Marlin provides

### -apple-system — -apple-system — detected in extracted data but not described by AI · `--font-apple-system`
- **Weights:** 600
- **Sizes:** 14px
- **Line height:** 2.07
- **Letter spacing:** -0.01
- **Role:** -apple-system — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.2 | 0.4px | `--text-caption` |
| body-sm | 14px | 1.2 | -0.14px | `--text-body-sm` |
| heading-sm | 24px | 1.2 | — | `--text-heading-sm` |
| heading | 28px | 1.1 | -0.56px | `--text-heading` |
| heading-lg | 40px | 1.07 | -1.6px | `--text-heading-lg` |
| display | 46px | 0.98 | -2.3px | `--text-display` |

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
| 128 | 128px | `--spacing-128` |

### Border Radius

| Element | Value |
|---------|-------|
| nav | 8px |
| cards | 8px |
| links | 4px |
| pills | 22px |
| buttons | 8px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| sm | `rgba(0, 0, 0, 0.1) 0px 5px 5px 0px` | `--shadow-sm` |
| sm-2 | `rgba(0, 0, 0, 0.25) 0px 2px 8px 0px` | `--shadow-sm-2` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 48px
- **Card padding:** 24px
- **Element gap:** 24px

## Components

### Scalloped Section Divider
**Role:** The signature boundary between every colored band

Wavy scalloped edge that separates sections — rendered as a series of semicircular cutouts along the bottom of each band, creating a craft-paper or stamp-edge effect. Color is Paper White (#ffffff) when bridging a violet section, or Oat (#fffadd) when bridging a cream section. The scallops are uniform circles, approximately 16–20px diameter, creating a repeating rhythm that replaces the standard hard edge. This is the single most distinctive visual element on the site.

### Dark CTA Button
**Role:** Primary call-to-action — the 'Try Dia' button

Obsidian (#000000) fill with Paper White (#ffffff) text, 8px border-radius, shadow rgba(0,0,0,0.1) 0px 5px 5px 0px. Horizontal padding 16px, vertical padding 10px. Includes a small Arc rainbow icon to the left of the label and a right-arrow after the text. Font: Marlin Soft SQ 500 at 14px. The dark button against the cream canvas creates strong contrast without needing chromatic color.

### Top Navigation Bar
**Role:** Sticky header across all sections

Sits on top of the Electric Iris (#3139fb) band. Transparent or Linen (#fffcec) background with no visible border. Left: Arc rainbow icon. Center/right: nav links (Max, Mobile, Developers, Students, Blog) in Paper White, 14px, with small arrow icons. Horizontal padding 32px. The nav maintains the same scalloped bottom edge that defines the rest of the site.

### Browser Product Mockup
**Role:** Hero visual — the Arc browser rendered as a large interactive element

Full browser window with traffic-light buttons (red/yellow/green circles), URL bar showing 'Dia — New Chat', and a split layout: left sidebar for spaces/folders, right content area. Window has 8px radius, subtle shadow rgba(0,0,0,0.25) 0px 2px 8px 0px. Internal surfaces use Paper White (#ffffff) on Linen (#fffcec) sidebar. This mockup replaces product photography as the primary visual.

### Browser Sidebar
**Role:** Left-rail navigation within the browser mockup

Linen (#fffcec) background, 8px radius on interactive items. Contains space tabs (small icon + label) and folder items. Active space has Obsidian (#000000) text and bold weight; inactive items use Granite (#696969). 12px Inter Variable 500 for labels. Vertical padding 8px between items. The sidebar changes background color per section — Linen in cream sections, Electric Iris in violet sections.

### Space Tab
**Role:** Individual space or folder item in the browser sidebar

Small icon (Gmail, Calendar, etc.) + label. 8px radius, 10px horizontal padding, 8px vertical padding. Inactive: Granite text, transparent background. Active: Obsidian text, Paper White background with subtle border. The icon is a brand-colored thumbnail — a saturated miniature of the service's visual identity.

### Chat Bubble — User
**Role:** User-typed message in the AI chat interface

Electric Iris (#3139fb) background with Paper White (#ffffff) text, 22px border-radius (pill shape). Font: Inter Variable 500 at 16px, line-height 1.50. Right-aligned. Padding 12px 20px. The vivid violet against the white content area makes the user's message pop without needing an avatar.

### Chat Bubble — AI Response
**Role:** AI-generated response in the chat interface

No background fill — sits directly on Paper White (#ffffff). Text in Obsidian (#000000), 16px Marlin Soft SQ 500, line-height 1.20. Left-aligned. A small 'Thought for 5 seconds' meta-label in Granite (#696969) at 12px sits above. Bold inline emphasis on key phrases.

### Workspace Panel (Violet Section Sidebar)
**Role:** Left navigation inside the violet brand section

Solid Electric Iris (#3139fb) background. Space icons in Paper White at 40×40px with 8px radius. Section headers ('Work', 'Personal') in Paper White at 12px, letter-spacing 0.033em. Folder items below in Paper White at 14px. The active workspace (e.g., 'onetwothree') has a Paper White pill background with Electric Iris text — inverted contrast.

### Testimonial Marquee Strip
**Role:** Horizontal scrolling press quotes at the bottom of sections

Full-width band on Paper White (#ffffff) background. Quote text in Obsidian (#000000) at 17px Marlin Soft SQ 500. Source attribution (Bloomberg, Inverse, Inc.) in Granite (#696969) with a closing quotation mark. Separated by bullet points. The strip auto-scrolls horizontally and sits between scalloped dividers.

### Category Micro-Label
**Role:** Monospaced tag or category marker

ABC Favorit Mono 400 at 12px, letter-spacing 0.15em (wide tracking), uppercase. Text in Obsidian (#000000) or Paper White (#ffffff) depending on background. No background fill — just tracked text that signals 'metadata' or 'category'. Used sparingly to label sections without creating visual weight.

### Hero Gradient Banner
**Role:** The cream-to-pink gradient behind the hero headline

Soft horizontal gradient from Oat (#fffadd) on the left through a very pale pink/lavender to a slightly cooler cream on the right. Applied as the hero section background. The gradient is subtle — the warm-to-cool shift is felt more than seen. Below the headline sits the Dark CTA Button centered.

## Do's and Don'ts

### Do
- Use the scalloped divider as the boundary between every colored section — never a hard horizontal line or thin border
- Set display headlines at 46px Marlin 400/700/800 with letter-spacing -2.3px; the tight tracking on the serif is what makes the editorial voice work
- Use Electric Iris (#3139fb) for full-bleed section backgrounds only — never for text, icons, or small UI elements
- Pair serif headlines (Marlin) with sans-serif UI (Inter Variable) — the typographic contrast carries the editorial-meets-product tension
- Default to 8px border-radius for cards, buttons, and nav items; reach for 22px only for pill-shaped chat bubbles and the occasional tag
- Use ABC Favorit Mono at 12px with 0.15em tracking for micro-labels and category markers — the wide tracking on mono breaks the serif/sans pattern and signals metadata
- Keep shadows minimal: rgba(0,0,0,0.1) 0px 5px 5px 0px for buttons, rgba(0,0,0,0.25) 0px 2px 8px 0px for elevated mockups — let the scalloped dividers and color blocking do the spatial work

### Don't
- Don't use Electric Iris (#3139fb) for CTA buttons or interactive accents — it's atmospheric, not interactive; buttons stay dark
- Don't add gradients to UI components — the site has no detected gradients; the only gradient is the hero cream-to-pink wash
- Don't use 0px or 4px border-radius on cards or buttons — the minimum visible radius is 8px; sharp corners break the craft-paper feel
- Don't pair two serif families on the same line — Marlin and Marlin Soft SQ are the only serifs; mixing with ABC Oracle is fine for body but never two display serifs
- Don't use bright white (#ffffff) as the page canvas — the warm Oat (#fffadd) cream is the default; white is reserved for mockup interiors and scalloped ridges
- Don't apply heavy drop shadows to text or small elements — shadows appear only on buttons and the browser mockup window
- Don't replace the scalloped dividers with SVG waves, diagonal cuts, or straight lines — the semicircular scallop rhythm is the site's single most recognizable feature

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Oat Canvas | `#fffadd` | Default page background; warm cream reads as paper |
| 1 | Linen Card | `#fffcec` | Secondary surface that lifts off the canvas with a half-step warmer tone |
| 2 | Paper White | `#ffffff` | Pure white for browser-mockup card interiors and scalloped divider ridges |
| 3 | Electric Iris Band | `#3139fb` | Full-bleed brand section background — atmospheric color blocking |
| 4 | Deep Violet Layer | `#2702c2` | Deeper accent within violet sections for hierarchy |

## Elevation

- **Dark CTA Button:** `rgba(0, 0, 0, 0.1) 0px 5px 5px 0px`
- **Browser Product Mockup:** `rgba(0, 0, 0, 0.25) 0px 2px 8px 0px`

## Imagery

The browser product mockup IS the imagery. No product photography, no lifestyle shots, no illustration — the Arc browser rendered as a large interactive window (traffic lights, URL bar, sidebar spaces, inline chat) is the primary visual on every section. Within the mockup, real content fills the viewport: a flower photograph in MMMHome, an architectural blueprint in the violet section, a calendar/event card. These are screen-captured UI states, not staged photos. The mockup is full-width, sits on the section's colored background, and casts a single soft shadow. No icons system visible — the product IS the icon.

## Layout

Full-bleed colored bands stack vertically with scalloped transitions between each. The page is not a single scrollable canvas with sections — it's a sequence of color-blocked plates (cream → violet → cream → violet) that each feel like a page turn. Within each band, content is max-width ~1200px and centered. The hero is a centered headline stack (h1 + subtext + CTA) over a cream gradient with a large browser mockup below. Violet sections split into a left workspace sidebar (250–300px) and a right content area showing the full browser viewport. The scalloped edge runs the full width at the bottom of every band, creating a continuous wavy rhythm down the page. Navigation is a minimal top bar that persists across all sections, sitting on the first violet band.

## Agent Prompt Guide

## Quick Color Reference
- text: #000000 (Obsidian)
- background: #fffadd (Oat cream canvas)
- border: #bfbdb1 (subtle warm hairline) / #696969 (visible divider)
- accent: #3139fb (Electric Iris — atmospheric section fills only)
- secondary surface: #fffcec (Linen — cards and nav)
- primary action: no distinct CTA color

## Example Component Prompts

No distinct primary action color was observed; use the extracted neutral button treatments instead of inventing a filled CTA color.

2. **Violet Brand Section**: Electric Iris (#3139fb) full-bleed background. Scalloped white divider at the top edge. Left sidebar: 280px wide, solid #3139fb, space icons (40×40px, Paper White, 8px radius), section headers in Paper White 12px ABC Favorit Mono with 0.15em tracking. Active workspace has Paper White pill background with #3139fb text. Right area: browser viewport showing workspace content — white card on #fffadd interior, bold serif heading at 28px Marlin Soft SQ 700, body at 16px ABC Oracle 400 in Obsidian.

3. **Chat Interface Card**: Paper White (#ffffff) background, 8px radius, 24px padding. User message: right-aligned, Electric Iris (#3139fb) background, Paper White text, 22px radius pill, 12px 20px padding, Inter Variable 500 at 16px. AI response below: left-aligned, no background, Obsidian text, 16px Marlin Soft SQ 500. Meta-label above AI response: 'Thought for 5 seconds' in Granite (#696969) at 12px Inter Variable 500 with 0.033em tracking.

4. **Testimonial Strip**: Full-width Paper White (#ffffff) band between scalloped dividers. Horizontal scrolling row. Each quote: Obsidian text at 17px Marlin Soft SQ 500, followed by source name in Granite (#696969). Separator: bullet point. 32px vertical padding, 48px horizontal padding.

5. **Category Micro-Label**: No background. Text only: ABC Favorit Mono 400 at 12px, letter-spacing 0.15em, uppercase, Obsidian (#000000). Used above section titles as a metadata tag. 4px bottom margin to the headline below.

## Scalloped Divider System

The scalloped edge is the site's single most recognizable design element and must be treated as a first-class component, not a decorative afterthought.

**Geometry**: A repeating pattern of semicircular cutouts along the bottom edge of a colored band. Each scallop is approximately 16–20px in diameter, evenly spaced. The pattern runs the full width of the viewport.

**Color rules**:
- When the band above is Electric Iris (#3139fb), the scallops are filled with Paper White (#ffffff) to create a bright wave against the violet.
- When the band above is Oat (#fffadd) or Linen (#fffcec), the scallops are filled with Electric Iris (#3139fb) to echo the next violet section.
- Never use the same color for the band and its scallop ridge — the scallop must always contrast with its parent band.

**Implementation**: Use an SVG mask or a CSS clip-path with a repeating-radial-gradient pattern. The scallops should be perfectly circular, not elliptical. Do not vary the scallop size across the page — uniformity is what creates the rhythm.

**When NOT to use**: Inside the browser mockup or on any UI component. The scallop is a page-level architectural element, not a card or button treatment.

## Similar Brands

- **Notion** — Same warm cream canvas with playful editorial layouts, serif-meets-sans typography pairing, and minimal use of shadow
- **Figma** — Same product-as-hero approach where the app interface replaces photography, paired with bold single-color section blocks
- **Linear** — Same tight letter-spacing on display headings and commitment to a single vivid accent color for atmospheric depth
- **Gumroad** — Same craft-paper warmth, playful irregular section boundaries, and willingness to break clean-SaaS conventions
- **Stripe** — Same editorial typography discipline — serif display headlines paired with clean sans body, high contrast, generous spacing

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-electric-iris: #3139fb;
  --color-deep-violet: #2702c2;
  --color-oat: #fffadd;
  --color-linen: #fffcec;
  --color-paper-white: #ffffff;
  --color-obsidian: #000000;
  --color-granite: #696969;
  --color-olive-stone: #595853;

  /* Typography — Font Families */
  --font-marlin-soft-sq: 'Marlin Soft SQ', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-marlin: 'Marlin', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-intervariable: 'InterVariable', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-abc-favorit-mono: 'ABC Favorit Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-abc-oracle: 'ABC Oracle', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-exposure-var: 'Exposure VAR', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-apple-system: '-apple-system', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.2;
  --tracking-caption: 0.4px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.2;
  --tracking-body-sm: -0.14px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.2;
  --text-heading: 28px;
  --leading-heading: 1.1;
  --tracking-heading: -0.56px;
  --text-heading-lg: 40px;
  --leading-heading-lg: 1.07;
  --tracking-heading-lg: -1.6px;
  --text-display: 46px;
  --leading-display: 0.98;
  --tracking-display: -2.3px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
  --font-weight-extrabold: 800;

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
  --spacing-128: 128px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 48px;
  --card-padding: 24px;
  --element-gap: 24px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-2xl: 22px;

  /* Named Radii */
  --radius-nav: 8px;
  --radius-cards: 8px;
  --radius-links: 4px;
  --radius-pills: 22px;
  --radius-buttons: 8px;

  /* Shadows */
  --shadow-sm: rgba(0, 0, 0, 0.1) 0px 5px 5px 0px;
  --shadow-sm-2: rgba(0, 0, 0, 0.25) 0px 2px 8px 0px;

  /* Surfaces */
  --surface-oat-canvas: #fffadd;
  --surface-linen-card: #fffcec;
  --surface-paper-white: #ffffff;
  --surface-electric-iris-band: #3139fb;
  --surface-deep-violet-layer: #2702c2;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-electric-iris: #3139fb;
  --color-deep-violet: #2702c2;
  --color-oat: #fffadd;
  --color-linen: #fffcec;
  --color-paper-white: #ffffff;
  --color-obsidian: #000000;
  --color-granite: #696969;
  --color-olive-stone: #595853;

  /* Typography */
  --font-marlin-soft-sq: 'Marlin Soft SQ', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-marlin: 'Marlin', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-intervariable: 'InterVariable', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-abc-favorit-mono: 'ABC Favorit Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-abc-oracle: 'ABC Oracle', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-exposure-var: 'Exposure VAR', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-apple-system: '-apple-system', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.2;
  --tracking-caption: 0.4px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.2;
  --tracking-body-sm: -0.14px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.2;
  --text-heading: 28px;
  --leading-heading: 1.1;
  --tracking-heading: -0.56px;
  --text-heading-lg: 40px;
  --leading-heading-lg: 1.07;
  --tracking-heading-lg: -1.6px;
  --text-display: 46px;
  --leading-display: 0.98;
  --tracking-display: -2.3px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-48: 48px;
  --spacing-128: 128px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-2xl: 22px;

  /* Shadows */
  --shadow-sm: rgba(0, 0, 0, 0.1) 0px 5px 5px 0px;
  --shadow-sm-2: rgba(0, 0, 0, 0.25) 0px 2px 8px 0px;
}
```
