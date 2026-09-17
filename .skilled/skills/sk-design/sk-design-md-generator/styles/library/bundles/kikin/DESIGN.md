# Kikin — Style Reference
> Vintage park-poster on cream paper — a financial product wearing a patch jacket.

**Theme:** mixed

Kikin operates in the visual register of a vintage national-park poster that grew up and learned to do invoice financing. The system alternates between a deep forest-green hero and a warm cream content canvas, with one vivid grass-green (#55dd4a) acting as the single switch-on accent for every primary action. Headlines are set in Deacon, an ultra-condensed display sans pushed to absurd scale (up to 259px) with line-height compressed to 0.8 — type is treated as a landscape feature, not a label. Everything else is grounded: Graphik handles body, illustrations are limited-palette line-and-fill patches of mountains, trees and water, and circular illustrated badges float around content like enamel pins on a hiking jacket. The result is warm, environmental, slightly handmade, but with a serious financial product underneath — the green is a meadow, not a neon.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Forest Ink | `#122315` | `--color-forest-ink` | Hero canvas, primary heading text, nav bar surface, footer — the dominant dark that anchors every green-on-green moment |
| Meadow | `#55dd4a` | `--color-meadow` | Primary action fill (GET FUNDING), accent headline words, tag fills — one switch-on green against both dark and cream surfaces |
| Sage Border | `#566053` | `--color-sage-border` | Muted green-gray for secondary borders, dividers on cream, subhead accents — lets Meadow read as the only chromatic action |
| Lichen | `#77e46e` | `--color-lichen` | Outlined/ghost action border, hover-state ring — a softer Meadow for non-filled interactive states |
| Paper Cream | `#f3ede4` | `--color-paper-cream` | Main content canvas after the hero, card surface on dark hero, ghost-button fill — warm off-white that replaces typical SaaS white |
| Charcoal | `#333333` | `--color-charcoal` | Body text on cream, hairline borders, image overlays — the workhorse neutral that keeps #122315 reserved for display moments |
| Slate | `#141414` | `--color-slate` | Icon strokes, near-black text, very dark UI fills when Forest Ink would be too green |
| Frost | `#e5e7eb` | `--color-frost` | Subtle dividers on cream, secondary card edges — quieter than Sage Border |
| Moss Gray | `#999c91` | `--color-moss-gray` | Helper text, metadata, low-emphasis captions on cream |
| Driftwood | `#626d66` | `--color-driftwood` | Dark borders and separators for elevated surfaces and inverted UI. Do not promote it to the primary CTA color |
| River Blue | `#73d3eb` | `--color-river-blue` | Illustration accent for water and sky in the hero artwork and badge illustrations, small data-viz highlight |
| Sun Yellow | `#ffed52` | `--color-sun-yellow` | Illustration accent for suns and warm callouts in the patch artwork, limited to decorative moments |
| Deep Navy | `#0a071b` | `--color-deep-navy` | Illustration dark fills, badge backgrounds where Forest Ink would blend with the canvas |

## Tokens — Typography

### Deacon — Display and headline family. The signature choice: an ultra-condensed sans scaled from 58px subheads up to 259px hero lines, with line-height compressed to 0.8 so two-line headlines read as a single block. Weight 900 for hero and section openers, 700 for mid-page headings, 400 for badge labels and small caps callouts. This is the only voice allowed to be loud. · `--font-deacon`
- **Substitute:** Oswald (700, 900), Antonio (700, 900), or Bebas Neue — any tall condensed sans with tight tracking
- **Weights:** 400, 700, 900
- **Sizes:** 14, 24, 32, 58, 72, 101, 137, 259
- **Line height:** 0.80–0.90
- **Letter spacing:** -2.85px at 259px, -2.06px at 137px, -2.12px at 101px, -1.87px at 72px, -0.83px at 32px, -0.55px at 24px
- **OpenType features:** `"ss01" on if available`
- **Role:** Display and headline family. The signature choice: an ultra-condensed sans scaled from 58px subheads up to 259px hero lines, with line-height compressed to 0.8 so two-line headlines read as a single block. Weight 900 for hero and section openers, 700 for mid-page headings, 400 for badge labels and small caps callouts. This is the only voice allowed to be loud.

### Graphik — Body, UI, and small-text family. Weight 400 for paragraphs, captions, and nav; weight 500 for button labels, tag text, and emphasized subheads. The geometric humanist sans provides the quiet counterweight to Deacon's shouting display — every sentence is calm, every headline is compressed. Use at -0.4px tracking at 24px and above. · `--font-graphik`
- **Substitute:** Inter (400, 500), Manrope (400, 500), or DM Sans (400, 500)
- **Weights:** 400, 500
- **Sizes:** 12, 14, 15, 16, 24, 32
- **Line height:** 1.20–1.43
- **Letter spacing:** -0.96px at 24px, -0.16px at 16px, 0.22px at 12px (positive tracking reserved for uppercase tags and eyebrow labels)
- **Role:** Body, UI, and small-text family. Weight 400 for paragraphs, captions, and nav; weight 500 for button labels, tag text, and emphasized subheads. The geometric humanist sans provides the quiet counterweight to Deacon's shouting display — every sentence is calm, every headline is compressed. Use at -0.4px tracking at 24px and above.

### Arial — System fallback and chart/dashboard data labels where a neutral numeric voice is needed; 40px reserved for stat readouts in the dashboard preview · `--font-arial`
- **Substitute:** Helvetica, system-ui
- **Weights:** 400
- **Sizes:** 14, 16, 40
- **Line height:** 1.25–1.43
- **Role:** System fallback and chart/dashboard data labels where a neutral numeric voice is needed; 40px reserved for stat readouts in the dashboard preview

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.4 | 0.22px | `--text-caption` |
| body-sm | 14px | 1.43 | — | `--text-body-sm` |
| body | 16px | 1.43 | -0.16px | `--text-body` |
| subheading | 24px | 1.2 | -0.96px | `--text-subheading` |
| heading-sm | 32px | 1.13 | -0.83px | `--text-heading-sm` |
| heading | 58px | 0.9 | -1.51px | `--text-heading` |
| heading-lg | 72px | 0.85 | -1.87px | `--text-heading-lg` |
| display | 137px | 0.8 | -2.06px | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 8 | 8px | `--spacing-8` |
| 12 | 12px | `--spacing-12` |
| 16 | 16px | `--spacing-16` |
| 20 | 20px | `--spacing-20` |
| 24 | 24px | `--spacing-24` |
| 32 | 32px | `--spacing-32` |
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |
| 64 | 64px | `--spacing-64` |
| 80 | 80px | `--spacing-80` |
| 100 | 100px | `--spacing-100` |
| 120 | 120px | `--spacing-120` |
| 164 | 164px | `--spacing-164` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 20px |
| badges | 20px |
| buttons | 10px |
| stickerBadges | 9999px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 96px
- **Card padding:** 32px
- **Element gap:** 16px

## Components

### Filled Primary Button
**Role:** The single GET FUNDING action across hero, mid-page, and final conversion moments

Meadow (#55dd4a) fill, Forest Ink (#122315) text, Graphik 500 at 14px, uppercase tracked +0.18em, 10px radius, 14px 28px padding. No border. Hovers deepen to #45c43a.

### Ghost Navigation Button
**Role:** Secondary nav action (LOG IN) sitting next to the primary CTA

Transparent fill on dark hero, 1px solid #f3ede4 (Paper Cream) border, Paper Cream text, Graphik 500 14px uppercase +0.18em, 10px radius, 10px 20px padding. Inverts to Forest Ink border on Paper Cream sections.

### Circular Carousel Arrow
**Role:** Testimonial and content carousel controls

64px circle, 1px Lichen (#77e46e) border on Paper Cream, centered chevron in Lichen. No fill, no shadow — a quiet navigational pin.

### Display Headline Block
**Role:** Section openers and hero title — the loudest voice in the system

Deacon 900 at 137px (hero) or 72px (section opener), line-height 0.80–0.85, tracking -2px or -1.87px, Forest Ink on cream or Paper Cream on dark. The second line of a hero can swap to Meadow to create a two-color sentence.

### Eyebrow Step Label
**Role:** Small numeral or kicker above section openers (01, 02, 03)

Graphik 400 14px, tracking +0.22em, uppercase, Meadow text. Sits 24px above the display headline with a 1px Sage Border underline.

### Illustrated Patch Badge
**Role:** Circular floating badges around the mission section — the system's signature decorative motif

120–160px circle, limited-palette illustration (Deep Navy fill, Meadow/River Blue/Sun Yellow accents, Paper Cream linework), 2px Paper Cream outer ring, caption in Deacon 400 curving around the edge or Graphik 400 10px underneath. Float with 8–12px rotation for handmade feel.

### Sticker Badge
**Role:** Overlapping rectangular or circular callouts on testimonial photos (PRIORITY PLANET, WORK TOGETHER)

Rectangular: Meadow fill, Forest Ink text, Graphik 500 12px uppercase, 0px radius (sharp corners), 4°–8° rotation. Circular variant: Deep Navy fill with Paper Cream type, 9999px radius. Must overlap the parent image by at least 20%.

### Dashboard Preview Card
**Role:** Product screenshot card in feature sections

20px radius, Paper Cream surface, 1px Sage Border, 32px internal padding, subtle 0 12px 40px rgba(10,7,27,0.12) shadow. Contains Graphik data labels and a soft River Blue chart area.

### Testimonial Quote Card
**Role:** Customer story layout with photo, quote, and attribution

Two-column on cream: 5:7 split, product photo left (full-bleed within column, no radius), quote right. Quote in Graphik 400 18px Charcoal, attribution in Deacon 400 14px Forest Ink with 1.2em letter-spacing. No card chrome — cream canvas is the surface.

### Floating Calculate Funding Chip
**Role:** Persistent bottom-right conversion pin

White fill, Forest Ink text, 20px radius, 12px 20px padding, Graphik 500 13px, with a small thumbs-up icon in Meadow. Lifts with 0 8px 24px rgba(10,7,27,0.18). Stays fixed across scroll.

### Top Navigation Bar
**Role:** Sticky header across all screens

Forest Ink fill on hero, Paper Cream on content sections. Kikin wordmark left in Graphik 500 18px, center nav links in Graphik 400 12px uppercase +0.18em, right cluster holds Ghost + Filled Primary buttons. 64px tall, no bottom border.

### Numbered Feature Section
**Role:** Mid-page explainer blocks (GROW WITH… 01, 02, 03)

Single column on cream: 01 eyebrow in Meadow, Deacon 900 72px section title, Graphik 400 16px body, optional dashboard card below. 96px vertical breathing between blocks.

### Hero Landscape Illustration
**Role:** Full-bleed decorative scene anchoring the hero

Mountains, pine forest, sunset, water, and a backpacker — built from limited palette (Deep Navy, Meadow, River Blue, Sun Yellow, Paper Cream linework) with no gradients and no photographic realism. Hand-drawn line quality, no perspective vanishing. Anchors the bottom 40% of the hero canvas.

## Do's and Don'ts

### Do
- Use Deacon 900 between 58px and 259px for any display moment — its compressed geometry is the system, not a decoration
- Reserve Meadow (#55dd4a) for exactly two roles: primary action fill and the second line of a two-color hero headline
- Set line-height at 0.80–0.90 on every Deacon block — letting it breathe at 1.2 destroys the condensed silhouette
- Default body canvas to Paper Cream (#f3ede4); pure white is a violation of the warm, paper-poster mood
- Use the Patch Badge motif whenever illustrating an abstract concept (sustainability, impact, values) — it is the system's native decoration
- Rotate sticker badges 4–8° and let them overlap images by 20%+ to keep the handmade feel
- Keep illustration palette to Deep Navy + Meadow + River Blue + Sun Yellow + Paper Cream — adding a sixth hue breaks the poster cohesion

### Don't
- Don't introduce a second chromatic accent — Meadow is the only green, River Blue is illustration-only, Sun Yellow is decorative-only
- Don't set Deacon at line-height above 0.95 or weight below 700 for headings — the quietness comes from the compressed line, not the weight
- Don't use pure black (#000000) for text on cream — use Charcoal (#333333) or Forest Ink (#122315) to keep the warm tone
- Don't apply shadows to patch badges or sticker badges — they should feel printed on the page, not floating
- Don't use gradients — the system is flat poster-ink, not glass-morphism
- Don't round cards at more than 20px or buttons at more than 10px — both radii are extracted from the source
- Don't place a filled Meadow button on a Meadow or Lichen background — there is no chromatic action contrast in that pairing, use Ghost or a dark surface

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Hero Canvas | `#122315` | Dark forest ink for the hero, nav, and any full-bleed dark band |
| 1 | Content Paper | `#f3ede4` | Warm cream for all body content, replacing typical SaaS white |
| 2 | Ink Card | `#0a071b` | Dark surface for testimonial quote cards and badge sticker backgrounds |
| 3 | Sage Tint | `#566053` | Muted surface for secondary cards sitting on cream where a pure white would feel cold |

## Elevation

- **Floating action chip (Calculate Your Funding):** `0 8px 24px rgba(10, 7, 27, 0.18)`
- **Dashboard preview card:** `0 12px 40px rgba(10, 7, 27, 0.12)`
- **Testimonial card:** `none — relies on cream canvas contrast, not shadow`

## Imagery

Illustrations dominate over photography. The hero and all section accents use hand-drawn limited-palette line-and-fill scenes (mountains, forests, sunsets, rivers, backpackers, a hiker raising a fist on a summit) built from Deep Navy, Meadow, River Blue, Sun Yellow, and Paper Cream linework — no gradients, no perspective vanishing points, slightly naïve in proportion. Photography appears only in the testimonial section as tight, high-contrast product crops (a blue water bottle mid-splash) that pop against the cream canvas. Decorative circular 'patch' badges — enamel-pin style illustrations of trees, logs, suns, and globes — float around hero-adjacent sections at slight rotations. The system never uses lifestyle photography, never uses stock imagery, and never uses duotone treatments.

## Layout

Hero is full-bleed dark Forest Ink with the Kikin wordmark top-left, centered nav, and centered action cluster top-right. Headline sits centered above the hero, then a full-width illustrated landscape anchors the bottom 40%. The rest of the page alternates between Paper Cream content bands and occasional Forest Ink feature bands. Content is max-width 1200px centered, with two-column splits (text-left/image-right or vice versa) and 96px vertical breathing between sections. Numbered feature blocks stack single-column on cream. The Calculate Funding chip floats fixed bottom-right across the entire page, riding over every section.

## Agent Prompt Guide

QUICK COLOR REFERENCE
- text: #122315 (Forest Ink) on cream, #f3ede4 (Paper Cream) on dark
- background: #f3ede4 (Paper Cream) for content, #122315 (Forest Ink) for hero
- border: #566053 (Sage Border) on cream, #f3ede4 on dark
- accent: #55dd4a (Meadow) — display words and eyebrow labels only
- primary action: #55dd4a (filled action)
- illustration accents: #73d3eb River Blue, #ffed52 Sun Yellow, #0a071b Deep Navy

EXAMPLE COMPONENT PROMPTS

1. Create a Primary Action Button: #55dd4a background, #141414 text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.


3. Numbered feature block on cream. Eyebrow '01' in Graphik 400 14px #55dd4a with +0.22em tracking. Section title in Deacon 900 72px #122315, line-height 0.85. Body in Graphik 400 16px #333333, max-width 640px. Dashboard preview card to the right: 20px radius, #f3ede4 surface, 1px #566053 border, 32px padding, soft 0 12px 40px rgba(10,7,27,0.12) shadow.

4. Testimonial block on cream. Two-column 5:7 split. Left column: product photo of a blue bottle on a water splash, full-bleed within the column, no radius. Right column: section title in Deacon 900 58px #122315, quote in Graphik 400 18px #333333, attribution in Deacon 400 14px #122315 with 1.2em tracking. Sticker Badge overlapping the bottom-left of the photo: 4° rotated rectangle, #55dd4a fill, #122315 text, 0px radius. Circular carousel arrows (64px, 1px #77e46e border, transparent fill) below the attribution.

5. Floating Calculate Funding chip. Fixed bottom-right, 24px from edges. White fill, #122315 text, Graphik 500 13px, 20px radius, 12px 20px padding, thumbs-up icon in #55dd4a to the left of the text. Shadow: 0 8px 24px rgba(10,7,27,0.18).

## Similar Brands

- **Allbirds** — Same earth-tone palette and environmental brand storytelling with cream-and-forest coloring, but Kikin keeps the condensed-display poster energy
- **Patagonia** — Shared nature-illustration visual language and warm cream content surfaces paired with a single bold accent
- **Watershed** — Climate-fintech crossover with the same dark-to-cream section rhythm and single bright green for primary action
- **Cuvva** — Uses an ultra-condensed display sans at massive scale over warm cream content — the same 'shout headlines, calm body' typographic duet

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-forest-ink: #122315;
  --color-meadow: #55dd4a;
  --color-sage-border: #566053;
  --color-lichen: #77e46e;
  --color-paper-cream: #f3ede4;
  --color-charcoal: #333333;
  --color-slate: #141414;
  --color-frost: #e5e7eb;
  --color-moss-gray: #999c91;
  --color-driftwood: #626d66;
  --color-river-blue: #73d3eb;
  --color-sun-yellow: #ffed52;
  --color-deep-navy: #0a071b;

  /* Typography — Font Families */
  --font-deacon: 'Deacon', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-graphik: 'Graphik', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-arial: 'Arial', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.4;
  --tracking-caption: 0.22px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.43;
  --text-body: 16px;
  --leading-body: 1.43;
  --tracking-body: -0.16px;
  --text-subheading: 24px;
  --leading-subheading: 1.2;
  --tracking-subheading: -0.96px;
  --text-heading-sm: 32px;
  --leading-heading-sm: 1.13;
  --tracking-heading-sm: -0.83px;
  --text-heading: 58px;
  --leading-heading: 0.9;
  --tracking-heading: -1.51px;
  --text-heading-lg: 72px;
  --leading-heading-lg: 0.85;
  --tracking-heading-lg: -1.87px;
  --text-display: 137px;
  --leading-display: 0.8;
  --tracking-display: -2.06px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-bold: 700;
  --font-weight-black: 900;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-100: 100px;
  --spacing-120: 120px;
  --spacing-164: 164px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 96px;
  --card-padding: 32px;
  --element-gap: 16px;

  /* Border Radius */
  --radius-lg: 10px;
  --radius-2xl: 20px;

  /* Named Radii */
  --radius-cards: 20px;
  --radius-badges: 20px;
  --radius-buttons: 10px;
  --radius-stickerbadges: 9999px;

  /* Surfaces */
  --surface-hero-canvas: #122315;
  --surface-content-paper: #f3ede4;
  --surface-ink-card: #0a071b;
  --surface-sage-tint: #566053;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-forest-ink: #122315;
  --color-meadow: #55dd4a;
  --color-sage-border: #566053;
  --color-lichen: #77e46e;
  --color-paper-cream: #f3ede4;
  --color-charcoal: #333333;
  --color-slate: #141414;
  --color-frost: #e5e7eb;
  --color-moss-gray: #999c91;
  --color-driftwood: #626d66;
  --color-river-blue: #73d3eb;
  --color-sun-yellow: #ffed52;
  --color-deep-navy: #0a071b;

  /* Typography */
  --font-deacon: 'Deacon', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-graphik: 'Graphik', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-arial: 'Arial', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.4;
  --tracking-caption: 0.22px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.43;
  --text-body: 16px;
  --leading-body: 1.43;
  --tracking-body: -0.16px;
  --text-subheading: 24px;
  --leading-subheading: 1.2;
  --tracking-subheading: -0.96px;
  --text-heading-sm: 32px;
  --leading-heading-sm: 1.13;
  --tracking-heading-sm: -0.83px;
  --text-heading: 58px;
  --leading-heading: 0.9;
  --tracking-heading: -1.51px;
  --text-heading-lg: 72px;
  --leading-heading-lg: 0.85;
  --tracking-heading-lg: -1.87px;
  --text-display: 137px;
  --leading-display: 0.8;
  --tracking-display: -2.06px;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-100: 100px;
  --spacing-120: 120px;
  --spacing-164: 164px;

  /* Border Radius */
  --radius-lg: 10px;
  --radius-2xl: 20px;
}
```
