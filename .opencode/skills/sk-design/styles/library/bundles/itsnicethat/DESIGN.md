# Itsnicethat — Style Reference
> Art-school broadsheet on a desk. A near-white page dressed in monochrome type, with one violet accent for navigation and vivid Risograph prints exploding through the grid.

**Theme:** light

It's Nice That operates as a quiet editorial newsroom: a near-white canvas with a single violet pulse. Almost every surface is achromatic — warm off-white, pure white, near-black text — and color is rationed like ink, appearing only as functional punctuation on the search button, on hover, or in full-bleed editorial photography. Typography does the heavy lifting: a wide-tracked display face (LabilVariable) floats generous air around every headline and label, creating a magazine-like cadence, while Bradford sets compact body and UI text tight to the grid. Components are deliberately flat and compact — no shadows, pill-shaped controls at 75px radius, tight 10–20px padding — so the colorful illustration and photography content always reads as the hero. The result feels like flipping through a printed art-school broadsheet: restrained chrome, loud art.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Page Mist | `#f0efef` | `--color-page-mist` | Page canvas — the warm off-white that holds the entire site. Cards and content float on top of this |
| Card White | `#ffffff` | `--color-card-white` | Card surfaces, input fields, elevated panels — the brighter layer stacked above Page Mist |
| Ink | `#2b2b2b` | `--color-ink` | Primary text, body copy, headings, icons, link defaults. Slightly softer than pure black, warming the type against the off-white canvas |
| Graphite | `#676767` | `--color-graphite` | Secondary text, metadata (dates, bylines), footer labels, muted descriptions |
| Slate | `#555555` | `--color-slate` | Tertiary text, image captions, disabled-adjacent labels |
| Faint Line | `#c2c2c2` | `--color-faint-line` | Hairline dividers, subtle borders between feed items and card edges |
| Ash | `#929292` | `--color-ash` | Placeholder text, low-emphasis labels, very muted helper copy |
| Banner Cream | `#faead9` | `--color-banner-cream` | Top promotional bar background, soft warm callouts. The only non-violet warmth in the system |
| Signal Violet | `#8147ff` | `--color-signal-violet` | Violet supporting accent for decorative details and low-frequency emphasis. Do not promote it to the primary CTA color |
| Deep Iris | `#6219ff` | `--color-deep-iris` | Pressed/hover state of Signal Violet, chromatic text emphasis, link text in article contexts. Sits one step darker on the same hue |
| Hi-Vis Yellow | `#ffd519` | `--color-hi-vis-yellow` | Yellow supporting accent for decorative details and low-frequency emphasis. Do not promote it to the primary CTA color |

## Tokens — Typography

### LabilVariable — Display and heading face. Set at 40px for article hero titles and 25px for section headings, with aggressively wide tracking (up to 0.091em at display size). The wide letter-spacing is the single most recognizable typographic signal of the brand — it forces whitespace between letters, giving headlines a printed-poster cadence. Also used for navigation labels, tags, and the floating nav bar. · `--font-labilvariable`
- **Substitute:** Inter Tight (variable), or DM Sans with letter-spacing manually opened
- **Weights:** 400
- **Sizes:** 11px, 13px, 15px, 18px, 25px, 40px
- **Line height:** 1.20–1.73
- **Letter spacing:** 3.64px at 40px (0.091em), tapering down to 0.33px at 11px (0.025em)
- **Role:** Display and heading face. Set at 40px for article hero titles and 25px for section headings, with aggressively wide tracking (up to 0.091em at display size). The wide letter-spacing is the single most recognizable typographic signal of the brand — it forces whitespace between letters, giving headlines a printed-poster cadence. Also used for navigation labels, tags, and the floating nav bar.

### Bradford — Body and UI face. Tight tracking (0.005–0.027em) at 15–17px for article descriptions, card metadata, button labels, and dense UI chrome. The contrast with LabilVariable's wide tracking is deliberate: LabilVariable announces, Bradford explains. Weight 500 appears for emphasis in metadata and button labels. · `--font-bradford`
- **Substitute:** Inter, or Söhne (close to Bradford's proportions)
- **Weights:** 400, 500
- **Sizes:** 11px, 15px, 17px
- **Line height:** 1.15–2.27
- **Letter spacing:** 0.46px at 17px (0.027em), 0.08px at 15px (0.005em), 0.09px at 11px (0.008em)
- **Role:** Body and UI face. Tight tracking (0.005–0.027em) at 15–17px for article descriptions, card metadata, button labels, and dense UI chrome. The contrast with LabilVariable's wide tracking is deliberate: LabilVariable announces, Bradford explains. Weight 500 appears for emphasis in metadata and button labels.

### Labil — Masthead and logo lockup, plus secondary UI labels. A static companion to LabilVariable — same family, different cuts — used where the variable axis isn't needed (wordmark, fixed-size badges). · `--font-labil`
- **Substitute:** Inter Tight, or DM Sans
- **Weights:** 400, 500
- **Sizes:** 11px, 13px, 17px
- **Line height:** 1.40–1.47
- **Letter spacing:** 0.09px at 11px to 1.55px at 17px (up to 0.091em)
- **Role:** Masthead and logo lockup, plus secondary UI labels. A static companion to LabilVariable — same family, different cuts — used where the variable axis isn't needed (wordmark, fixed-size badges).

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 11px | 1.47 | 0.09px | `--text-caption` |
| body | 15px | 1.53 | 0.08px | `--text-body` |
| heading | 25px | 1.2 | 1.93px | `--text-heading` |
| display | 40px | 1.2 | 3.64px | `--text-display` |

## Tokens — Spacing & Shapes

**Density:** compact

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 5 | 5px | `--spacing-5` |
| 8 | 8px | `--spacing-8` |
| 10 | 10px | `--spacing-10` |
| 12 | 12px | `--spacing-12` |
| 13 | 13px | `--spacing-13` |
| 15 | 15px | `--spacing-15` |
| 16 | 16px | `--spacing-16` |
| 20 | 20px | `--spacing-20` |
| 30 | 30px | `--spacing-30` |
| 40 | 40px | `--spacing-40` |
| 60 | 60px | `--spacing-60` |
| 80 | 80px | `--spacing-80` |
| 113 | 113px | `--spacing-113` |
| 191 | 191px | `--spacing-191` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 75px |
| cards | 0px |
| inputs | 0px |
| buttons | 75px |
| navPills | 75px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 40px
- **Card padding:** 20px
- **Element gap:** 10px

## Components

### Top Partner Banner
**Role:** Full-width warm strip at the very top of the page, promoting partner content sections.

Background #faead9, 40px tall, centered max-width content. Three link clusters left/center/right: bold text in #2b2b2b (Bradford 500, 11px) with a lighter descriptor below (Bradford 400, 11px, #676767). No border, no shadow — just a warm horizontal band separating the masthead from the feed.

### Masthead with Wordmark
**Role:** Centered brand identity block below the partner banner.

Page Mist (#f0efef) background. Wordmark 'It's Nice That' in Labil 400, large weight, with tagline 'Inspiring Creativity Since 2001' below in Labil 400 at ~11px with wide tracking. Hamburger menu icon at right in #2b2b2b. No border or divider below — whitespace provides separation.

### The Nice Feed Header
**Role:** Label row for the horizontal feed of latest articles.

Background #ffffff or #f0efef. Left-aligned label 'The Nice Feed' in Labil 400 bold-ish, followed by 'Refreshed 22h ago' in #676767. Right-aligned 'Explore All' link in #2b2b2b with a small dark square icon. Padding 10px vertical, minimal horizontal.

### Feed Article Card (Horizontal Row)
**Role:** Compact article preview in the top horizontal feed.

Square thumbnail (no radius), article title in Bradford 500 ~15px #2b2b2b, source attribution in Labil 400 ~11px #2b2b2b, small page-number indicator at right. 10px gap between thumbnail and text. No card background, no border — items sit directly on the page surface.

### Editorial Feature Triptych
**Role:** Full-width three-panel image grid showcasing a visual story.

Three equal-width panels with no gap, each with a solid background (saturated purple, blue, olive) and a centered illustrated postcard. This is the loudest visual moment on the page — the only place where large color blocks appear. No text overlay, no captions inside the panels.

### Featured Article (Large Title Block)
**Role:** Lead story with oversized headline and description.

Left column: display headline in LabilVariable 400 at 40px, #2b2b2b, letter-spacing 3.64px, line-height ~1.20. Right column: 2-3 line description in Bradford 400 at 15px, #2b2b2b. Below description: '4 days ago' in Labil 400 at 11px, #676767. Tags appear as pill badges.

### Article Card Grid (3-Column)
**Role:** Standard article listing grid below the featured story.

Three columns, equal width, 16–20px row gap. Each card: vertical thumbnail on top (no border-radius), title in Bradford 500 ~15px #2b2b2b below, date in Labil 400 ~11px #676767 at the bottom, optional category tag. No card background or border — the white card surface is the thumbnail frame itself, set against the #f0efef page.

### Category Tag Pill
**Role:** Small badge labeling an article's category.

Pill shape with 75px border-radius, no background fill (transparent). Text in Labil 400 at 11px, #6219ff or #2b2b2b depending on context. Sometimes a #ffd519 left border (2px) to mark highlighted tags. Padding 5px 10px.

### Floating Bottom Nav Bar
**Role:** Pill-shaped navigation docked to the bottom center of the viewport.

White (#ffffff) background, 75px border-radius (full pill), sits floating above content with no shadow. Contains 4 category links in Labil 400 at 13px, #2b2b2b, separated by '·' dots, followed by a violet Search button at the right end. The pill shape and absence of shadow is the signature — it reads as a physical chip resting on the page.

### Violet Search Button
**Role:** Primary interactive element in the floating nav.

Background #8147ff, 75px border-radius, padding 10px 20px. Icon (magnifying glass) + 'Search' label in Labil 400 at 13px, #ffffff. This is the only filled-violet button in the system — its rarity makes it the most clickable thing on screen.

### Navigation Category Link
**Role:** Text-only link in the floating nav bar.

No background, no border. Labil 400 at 13px, #2b2b2b, letter-spacing ~0.33px. Active/hover state: #6219ff text. Padding 10px horizontal for tap target, no vertical background change.

### Article Image Thumbnail
**Role:** Visual preview for each article card.

No border-radius, no border, no shadow. The image fills its frame edge-to-edge. Aspect ratio roughly 1:1 in the feed row, roughly 4:3 or 3:4 in the card grid. The image IS the card chrome — there is no padding or frame around it.

## Do's and Don'ts

### Do
- Use LabilVariable for any headline or display text, with tracking opening from 0.025em at 11px up to 0.091em at 40px — the wide spacing is non-negotiable.
- Set all buttons, tags, and nav pills to 75px border-radius — the pill shape is the system's primary control signature.
- Use Signal Violet (#8147ff) exclusively for the search button and active states; let the rest of the interface stay achromatic.
- Stack surfaces by lightness alone: #f0efef canvas → #ffffff cards → #faead9 warm bands. Never use shadows to create depth.
- Set body copy in Bradford at 15–17px with tight tracking (0.005–0.027em) — the contrast with LabilVariable's wide tracking is the typographic rhythm.
- Keep vertical rhythm compact: 10px element gaps, 20px card padding, 40px section gaps. The site is an editorial feed, not a landing page.
- Let photography and illustration carry all visual color. Resist the urge to add chromatic UI elements — the art is the color.

### Don't
- Don't apply drop shadows, glows, or blur to any component. Depth comes from surface value, not elevation.
- Don't use Signal Violet for decorative purposes (backgrounds, borders, illustrations) — it signals interactivity and loses meaning if scattered.
- Don't set body or UI text with wide tracking — reserve LabilVariable's open spacing for headlines, tags, and nav labels only.
- Don't add border-radius to cards, images, or thumbnails. The 75px pill is reserved for interactive controls.
- Don't introduce new neutrals — work within the existing scale: #2b2b2b (primary), #676767 (secondary), #555555 (tertiary), #c2c2c2 (dividers), #929292 (placeholders).
- Don't use bright chromatic colors on text, borders, or backgrounds outside the editorial photography itself.
- Don't stretch line-height above 1.53 for body text — the compact vertical rhythm is core to the feed-density feel.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Page Canvas | `#f0efef` | Warm off-white base that fills the viewport behind all content. |
| 2 | Card White | `#ffffff` | Article cards, image frames, input fields — the primary content surface. |
| 3 | Banner Cream | `#faead9` | Top promotional partner bar, soft warm zone separating the masthead from the feed. |

## Elevation

The design intentionally avoids shadows. Depth is communicated purely through surface-value contrast (#f0efef canvas vs #ffffff cards vs #faead9 banner). No drop shadows, no glow effects — the layout reads as flat editorial print rather than a skeuomorphic software UI. This keeps the colorful illustration and photography content visually unshadowed and unambiguous.

## Imagery

Photography and illustration are the primary content and the dominant source of all color in the system. The editorial feed is image-heavy: square and rectangular thumbnails carry every article card, and the triptych feature panels are full-bleed illustrated Risograph prints on saturated color grounds (violet, cyan, olive). Photography is product-and-process-focused — studio shots of printed matter, artist hands, tools, objects — rather than lifestyle imagery. Color treatment is full-saturation, not desaturated or duotone; the images arrive vivid and the UI recedes to let them speak. Icons are monochrome (filled, no outline style), small, and functional. No 3D renders, no abstract gradient graphics outside editorial content. The visual density of imagery relative to text is high — roughly 50/50 in card grids, tipping toward image-dominant in the triptych sections.

## Layout

Centered, max-width 1200px content column on a #f0efef page canvas. The page reads top-to-bottom as a continuous editorial feed rather than discrete marketing sections. The top 40px is a full-width warm cream banner (#faead9) with three partner link clusters. Below: a centered masthead with wordmark and tagline, no nav bar above content. The first content zone is a horizontal 3-item feed row with square thumbnails. Then a full-bleed triptych: three edge-to-edge image panels with no gaps, each on a saturated color ground. Then a featured article block: two-column with oversized headline left, description and tags right. Then a 3-column article card grid with vertical thumbnails, repeating downward. A floating pill-shaped nav bar (75px radius, white) sits docked at bottom-center of the viewport, persistent across the page. The overall rhythm alternates between wide horizontal bands (triptych) and compact grid blocks (article cards), with 40px vertical spacing between zones. Navigation is minimal — a single hamburger in the masthead plus the floating bottom pill bar — no top nav, no sidebar, no mega-menu.

## Agent Prompt Guide

## Quick Color Reference
- canvas: #f0efef (Page Mist)
- card surface: #ffffff (Card White)
- text primary: #2b2b2b (Ink)
- text secondary: #676767 (Graphite)
- border/divider: #c2c2c2 (Faint Line)
- brand accent: #8147ff (Signal Violet) — used only for the search button and active state
- primary action: no distinct CTA color

## Example Component Prompts

**Floating Bottom Nav Bar:** A white (#ffffff) pill-shaped bar, 75px border-radius, floating at bottom-center of the viewport. Contains 4 category links set in LabilVariable 400 at 13px, #2b2b2b, letter-spacing 0.33px, separated by middle dots. Right end: a violet (#8147ff) search button, 75px radius, padding 10px 20px, white magnifying glass icon + 'Search' label in Labil 400 13px #ffffff. No shadow on the pill.

**Featured Article Block:** Two-column layout. Left: display headline in LabilVariable 400 at 40px, #2b2b2b, letter-spacing 3.64px, line-height 1.20. Right: 2-line description in Bradford 400 at 15px, #2b2b2b, tight letter-spacing 0.08px. Below description: '4 days ago' in Labil 400 at 11px, #676767. Two category tag pills below: transparent background, 75px radius, Labil 400 11px, 5px 10px padding, one with a 2px #ffd519 left border.

**Article Card Grid Item:** Vertical card on #f0efef page. Top: full-bleed thumbnail with no border-radius, aspect ratio ~4:3. Below: title in Bradford 500 at 15px, #2b2b2b, letter-spacing 0.08px. Bottom: date in Labil 400 at 11px, #676767. No card background, no border, no shadow — the image is the visual frame.

**Editorial Triptych Panel:** Full-bleed image panel, one-third viewport width, no gap between panels. Background in a saturated editorial color (violet #8147ff, cyan, or olive). Centered Risograph-style illustration or print filling most of the frame. No text overlay.

**Top Partner Banner:** Full-width strip, #faead9 background, 40px tall, centered max-width content. Three link clusters in a row: bold label in Bradford 500 11px #2b2b2b with a lighter sub-label in Bradford 400 11px #676767 directly below.

## Editorial Tone

This is a creative-discovery publication, not a product interface. Pages should feel like browsing a curated magazine — every screen is a feed of stories, not a funnel. The UI chrome should be quiet enough that the artwork and photography dominate. If a page section doesn't feature rich visual content, it's probably over-designed. The floating bottom nav is the only persistent UI; everything else is content-first.

## Similar Brands

- **It's Nice That** — Same custom-display-typeface-with-wide-tracking approach on a near-white canvas, single violet accent for interactive controls, pill-shaped navigation as the sole persistent UI element.
- **Dezeen** — Editorial media layout with a 3-column article grid, achromatic chrome, and full-bleed editorial photography carrying all the color.
- **Are.na** — Same near-white canvas philosophy, compact content density, and restraint in using color — the content blocks are the visual interest.
- **The Creative Independent** — Similar quiet editorial layout with wide-tracked display type, compact body text, and warm off-white background tones.
- **WePresent (by WeTransfer)** — Same editorial-discovery feel with monochrome UI, vivid editorial photography as the hero, and pill-shaped interactive controls.

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-page-mist: #f0efef;
  --color-card-white: #ffffff;
  --color-ink: #2b2b2b;
  --color-graphite: #676767;
  --color-slate: #555555;
  --color-faint-line: #c2c2c2;
  --color-ash: #929292;
  --color-banner-cream: #faead9;
  --color-signal-violet: #8147ff;
  --color-deep-iris: #6219ff;
  --color-hi-vis-yellow: #ffd519;

  /* Typography — Font Families */
  --font-labilvariable: 'LabilVariable', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-bradford: 'Bradford', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-labil: 'Labil', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 11px;
  --leading-caption: 1.47;
  --tracking-caption: 0.09px;
  --text-body: 15px;
  --leading-body: 1.53;
  --tracking-body: 0.08px;
  --text-heading: 25px;
  --leading-heading: 1.2;
  --tracking-heading: 1.93px;
  --text-display: 40px;
  --leading-display: 1.2;
  --tracking-display: 3.64px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-5: 5px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-13: 13px;
  --spacing-15: 15px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-30: 30px;
  --spacing-40: 40px;
  --spacing-60: 60px;
  --spacing-80: 80px;
  --spacing-113: 113px;
  --spacing-191: 191px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 40px;
  --card-padding: 20px;
  --element-gap: 10px;

  /* Border Radius */
  --radius-full: 75px;

  /* Named Radii */
  --radius-tags: 75px;
  --radius-cards: 0px;
  --radius-inputs: 0px;
  --radius-buttons: 75px;
  --radius-navpills: 75px;

  /* Surfaces */
  --surface-page-canvas: #f0efef;
  --surface-card-white: #ffffff;
  --surface-banner-cream: #faead9;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-page-mist: #f0efef;
  --color-card-white: #ffffff;
  --color-ink: #2b2b2b;
  --color-graphite: #676767;
  --color-slate: #555555;
  --color-faint-line: #c2c2c2;
  --color-ash: #929292;
  --color-banner-cream: #faead9;
  --color-signal-violet: #8147ff;
  --color-deep-iris: #6219ff;
  --color-hi-vis-yellow: #ffd519;

  /* Typography */
  --font-labilvariable: 'LabilVariable', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-bradford: 'Bradford', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-labil: 'Labil', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 11px;
  --leading-caption: 1.47;
  --tracking-caption: 0.09px;
  --text-body: 15px;
  --leading-body: 1.53;
  --tracking-body: 0.08px;
  --text-heading: 25px;
  --leading-heading: 1.2;
  --tracking-heading: 1.93px;
  --text-display: 40px;
  --leading-display: 1.2;
  --tracking-display: 3.64px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-5: 5px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-13: 13px;
  --spacing-15: 15px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-30: 30px;
  --spacing-40: 40px;
  --spacing-60: 60px;
  --spacing-80: 80px;
  --spacing-113: 113px;
  --spacing-191: 191px;

  /* Border Radius */
  --radius-full: 75px;
}
```
