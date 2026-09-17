# Apple (España) — Style Reference
> obsidian gallery vitrine — a dark showroom where a single titanium object glows against pure black

**Theme:** mixed

Apple's product page is a cinematic dark-stage that lets hardware speak first: full-bleed near-black canvas, a single hero product floating in negative space, white SF Pro Display headlines at massive scale, and one vivid blue Buy button as the only saturated action color on the page. The page alternates between black feature stages and white detail bands, using generous 28px card radii and 36–980px pill buttons to feel premium and tactile. Color is used as functional punctuation: orange for category eyebrows, blue for links and the single CTA, violet/teal for other product categories. Typography is the only chrome — heavy negative letter-spacing, tight line-heights, and weight contrast between SF Pro Text body and SF Pro Display headlines carry all the hierarchy.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Obsidian | `#1d1d1f` | `--color-obsidian` | Primary dark canvas, card surfaces on dark sections, primary text on light backgrounds — the signature near-black that defines Apple's product stage |
| Frost White | `#f5f5f7` | `--color-frost-white` | Primary text on dark backgrounds, light section surfaces, subtle dividers — slightly warm white that softens contrast against pure black |
| Pure Black | `#000000` | `--color-pure-black` | Deepest dark canvas for hero and feature stages, footer background — used where absolute darkness amplifies product photography |
| Paper White | `#ffffff` | `--color-paper-white` | Light section backgrounds, button text on dark fills, icon fills — the bright counterweight in alternating dark/light page rhythm |
| Carbon | `#111111` | `--color-carbon` | Elevated surface above black, badge backgrounds — sits one step lighter than pure black for subtle layered depth |
| Platinum | `#86868b` | `--color-platinum` | Muted body text, secondary descriptions, subtitle lines, caption text — the conversational gray that recedes behind primary copy |
| Graphite | `#333336` | `--color-graphite` | Subtle elevated surfaces, secondary button backgrounds, nav dividers — quiet structural tone between obsidian and black |
| Silver Mist | `#cccccc` | `--color-silver-mist` | Nav borders, button outlines, inactive UI chrome — the lightest neutral that still reads as structural rather than decorative |
| Smoke | `#424245` | `--color-smoke` | Hairline borders, low-contrast dividers on dark sections |
| Apple Blue | `#0071e3` | `--color-apple-blue` | Primary CTA fill (Comprar button), primary action background — the single filled chromatic button color on the page, vivid saturated blue against black creates unmistakable tap target |
| Link Blue | `#0066cc` | `--color-link-blue` | Text links, inline link text, Learn more arrows — deeper than Apple Blue, optimized for readability on white |
| Halo Blue | `#2997ff` | `--color-halo-blue` | Lighter link variant, accent text on dark backgrounds, secondary link color — brighter blue for dark-surface legibility |
| Signal Orange | `#f56900` | `--color-signal-orange` | Orange outline accent for tags, dividers, and focused UI edges. Do not promote it to the primary CTA color |
| Iris Violet | `#8668ff` | `--color-iris-violet` | Secondary category accent, alternate product-line color coding — used sparingly to differentiate categories from the orange-tagged ones |
| Reef Teal | `#00a1b3` | `--color-reef-teal` | Tertiary category accent, alternate product-line color coding — cool counterpoint to the warm orange/iris palette |

## Tokens — Typography

### SF Pro Display — All headlines, display text, section titles, hero copy. Used at dramatic scale (56–80px) for hero and section openers, contracting to 19–32px for feature card titles. Weight 600–700 with heavy negative letter-spacing creates the signature Apple headline density — characters pull tight at large sizes. · `--font-sf-pro-display`
- **Substitute:** Inter, system-ui
- **Weights:** 600, 700
- **Sizes:** 19, 21, 24, 28, 32, 56, 80
- **Line height:** 1.00, 1.05, 1.13, 1.14, 1.17, 1.19, 1.21
- **Letter spacing:** -0.015em at 19px → -0.003em at 80px (tighter as size increases)
- **OpenType features:** `"numr"`
- **Role:** All headlines, display text, section titles, hero copy. Used at dramatic scale (56–80px) for hero and section openers, contracting to 19–32px for feature card titles. Weight 600–700 with heavy negative letter-spacing creates the signature Apple headline density — characters pull tight at large sizes.

### SF Pro Text — Body copy, navigation, buttons, captions, footnotes, legal text. The utility face for everything below headlines. Weight 400 for body paragraphs, 600 for nav items, buttons, and labels. Generous line-height (1.47–1.83) for body creates breathing room; tight (1.00–1.24) for nav/buttons keeps interactive elements compact. · `--font-sf-pro-text`
- **Substitute:** Inter, system-ui
- **Weights:** 400, 600
- **Sizes:** 10, 12, 14, 17, 20, 44
- **Line height:** 1.00, 1.18, 1.24, 1.33, 1.43, 1.47, 1.83
- **Letter spacing:** -0.037em at 10px → -0.010em at 20px (progressively looser as size shrinks)
- **OpenType features:** `"numr"`
- **Role:** Body copy, navigation, buttons, captions, footnotes, legal text. The utility face for everything below headlines. Weight 400 for body paragraphs, 600 for nav items, buttons, and labels. Generous line-height (1.47–1.83) for body creates breathing room; tight (1.00–1.24) for nav/buttons keeps interactive elements compact.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 10px | 1.83 | -0.37px | `--text-caption` |
| body | 14px | 1.43 | -0.22px | `--text-body` |
| heading-sm | 19px | 1.21 | -0.28px | `--text-heading-sm` |
| heading | 24px | 1.17 | -0.24px | `--text-heading` |
| heading-lg | 32px | 1.14 | -0.32px | `--text-heading-lg` |
| display | 56px | 1.07 | -0.84px | `--text-display` |
| hero | 80px | 1.05 | -0.24px | `--text-hero` |

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
| 28 | 28px | `--spacing-28` |
| 32 | 32px | `--spacing-32` |
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |
| 60 | 60px | `--spacing-60` |
| 76 | 76px | `--spacing-76` |
| 80 | 80px | `--spacing-80` |
| 96 | 96px | `--spacing-96` |
| 104 | 104px | `--spacing-104` |
| 160 | 160px | `--spacing-160` |

### Border Radius

| Element | Value |
|---------|-------|
| nav | 980px |
| pill | 980px |
| cards | 28px |
| links | 10px |
| buttons | 36px |

### Layout

- **Page max-width:** 1440px
- **Section gap:** 88-120px
- **Card padding:** 28px
- **Element gap:** 10-12px

## Components

### Hero Stage
**Role:** Full-viewport product showcase

Full-bleed Pure Black (#000000) background, 1440px max-width centered. Product image occupies 50–60% of the viewport height, rendered at extreme scale. No visible card chrome — the product floats directly on the canvas. Headline sits bottom-left at 80px SF Pro Display 700, Frost White (#f5f5f7), letter-spacing -0.24px. Eyebrow label at 17px SF Pro Text 600, Frost White, preceded by a small Apple logo glyph. Price text and CTA cluster aligned below the headline.

### Primary CTA Button (Apple Blue Filled)
**Role:** Single conversion action — Comprar

Filled pill button: background #0071e3, text #ffffff, 36px border-radius, 10px vertical / 20px horizontal padding, SF Pro Text 14px weight 600, letter-spacing -0.22px. The only filled chromatic button on the page. Sits beside a ghost price label ("Desde 899 €") in a inline flex row.

### Ghost Price Label
**Role:** Price indicator next to CTA

Borderless text button: text #ffffff on dark stages, SF Pro Text 14px weight 400, 36px border-radius, transparent background, 10px vertical / 20px horizontal padding. Visually quieter than the filled CTA to avoid competing.

### Category Eyebrow Tag
**Role:** Sport/activity category label (e.g. 'Running')

Plain text label in Signal Orange (#f56900), SF Pro Text 17px weight 600, letter-spacing -0.19px. No background, no border, no chip chrome — color alone signals category. Sits above a feature headline, left-aligned.

### Feature Card (Dark Stage)
**Role:** Large image card on dark sections

Full-bleed card on dark sections: 28px border-radius, internal padding ~28px, contains a full-width photograph (B&W product-in-use) with white text overlay positioned in the upper-left quadrant. Overlay text: SF Pro Text 14–17px Frost White, max 3 lines. No visible card border or shadow — the rounded photo edge is the only container cue.

### Light Section Content Block
**Role:** Detail content on white backgrounds

Paper White (#ffffff) background, text-left/image-right or image-left/text-right two-column layout. Image is full-bleed within its column with no border-radius (edge-to-edge). Text column: orange eyebrow tag, 56px SF Pro Display 700 headline in Obsidian (#1d1d1f), body in Platinum (#86868b) 14–17px, optional inline sub-feature link with arrow icon.

### Top Navigation Bar
**Role:** Global site navigation

Pure Black (#000000) background, 980px pill border-radius, 10px vertical padding, full-width sticky. Apple logo glyph left, nav items centered as SF Pro Text 12px weight 400 Frost White with 8–10px horizontal gaps, search and bag icons right. Semi-transparent on scroll with backdrop blur.

### Promo Banner
**Role:** Education pricing announcement bar

Slim bar above nav: Obsidian (#1d1d1f) background, centered SF Pro Text 12px Frost White text with inline blue link "Comprobar >" in Link Blue (#0066cc). 3px vertical padding, no border-radius.

### Section Headline (Dark)
**Role:** Section opener on dark stages

Large left-aligned headline: SF Pro Display 600–700 at 56–80px, Frost White (#f5f5f7), letter-spacing -0.84px at 56px. Minimal surrounding padding — generous negative space above and below. No subtitle, no eyebrow — the headline stands alone.

### Inline Feature Link
**Role:** Sub-feature callout with icon

Horizontal row: small circular icon (ArrowUpRight or compass) in Obsidian (#1d1d1f) on a white circle, followed by two-line label in SF Pro Text 17px weight 600 Obsidian. Appears below body copy in light sections as a tertiary drill-in.

### Watch Complication Display
**Role:** Product UI preview on the watch face

The watch screen in hero shows a wayfinding face: black background, neon green (#a3e635 approximately) digital numerals and compass markers, white time display in SF Pro Display at ~44px. Multiple data complications arranged in concentric rings.

## Do's and Don'ts

### Do
- Use #0071e3 Apple Blue as the filled CTA fill on #000000 backgrounds — it is the only filled chromatic button color permitted
- Use 28px border-radius for all photo cards and content containers; 36px for standard buttons; 980px for pill nav and chip elements
- Set headline type to SF Pro Display 600–700 at 56–80px with negative letter-spacing (-0.84px at 56px, -0.24px at 80px)
- Alternate between Pure Black (#000000) feature stages and Paper White (#ffffff) detail bands with 88–120px section gaps
- Tag category content with Signal Orange (#f56900) eyebrows at 17px SF Pro Text 600 — never apply orange to body text or buttons
- Render all body text in Platinum (#86868b) on white sections and Frost White (#f5f5f7) on dark sections — never use pure #ffffff for paragraph copy
- Use 980px border-radius for the top navigation bar and any pill-shaped interactive elements like chips or toggle selectors

### Don't
- Do not use drop shadows, box-shadows, or any CSS elevation — depth comes from surface contrast between #000000, #111111, and #1d1d1f only
- Do not place more than one filled chromatic button in the same viewport — Apple Blue is the single CTA color
- Do not use card grids, masonry layouts, or multi-column text blocks — content is always single-subject or two-column image+text
- Do not apply the orange/violet/teal accent colors to text paragraphs, backgrounds, or large surfaces — they are category labels only
- Do not use #ffffff for body paragraph text on white backgrounds — use Frost White (#f5f5f7) or Platinum (#86868b) to soften contrast
- Do not add gradients, textures, or decorative backgrounds — the only gradient in the system is the subtle #000000→#111111 black-to-carbon surface transition
- Do not use border-radius values outside the defined set (10px, 28px, 32px, 36px, 980px) — Apple's radii are deliberately restricted

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Pure Black Stage | `#000000` | Hero, feature stages, dramatic product photography backgrounds |
| 1 | Carbon Layer | `#111111` | Elevated badges, subtle layering above pure black |
| 2 | Obsidian Card | `#1d1d1f` | Card surfaces on dark sections, footer, content panels over black |
| 3 | Graphite Surface | `#333336` | Subtle elevated panels, secondary button fills on dark |
| 4 | Frost White Panel | `#f5f5f7` | Light section content blocks, subtle off-white bands |
| 5 | Paper White | `#ffffff` | Full light sections, clean product detail bands |

## Elevation

Apple avoids drop shadows entirely. Depth is created through surface contrast — alternating Pure Black (#000000) and Obsidian (#1d1d1f) backgrounds create layered card surfaces, and 28px border-radius on photos defines container edges. The product itself casts a subtle gradient shadow directly onto the canvas via photography, not CSS. No box-shadow is used in the interface; flat is the signature.

## Imagery

Photography is the dominant visual element. Product shots are rendered on pure black (#000000) with dramatic studio lighting that creates soft metallic highlights on the titanium case. Lifestyle photography is shot in high-contrast black and white (desaturated, no color) to avoid competing with the color product shots — runners, athletes, hands on wrists. No illustration, no abstract graphics, no stock photography. Images are full-bleed within their containers with 28px border-radius on cards or edge-to-edge in light sections. Icon style is minimal: outlined SF Symbols in single-weight strokes, monochrome Frost White on dark and Obsidian on light. The visual density is image-heavy in the hero (product occupies 50%+ of viewport) and text-light in detail bands (photographs on one side, copy on the other).

## Layout

Full-bleed dark canvas with max-width 1440px content centering. The hero is a full-viewport product showcase — large product image centered, headline and CTA cluster bottom-left, enormous negative space dominating the composition. Below the hero, dark feature sections stack vertically with 88–120px gaps, each containing a large rounded photo card (28px radius) with overlaid white text. The page transitions to white sections partway through, maintaining the same max-width but inverting the surface to Paper White (#ffffff) with two-column image+text layouts. Navigation is a sticky pill bar (980px radius) at the top. Section rhythm alternates dark → dark → light, creating a cinematic three-act structure. Content is always left-aligned text with images either full-bleed-column or centered as oversized single subjects — never card grids, never multi-column text.

## Agent Prompt Guide

**Quick Color Reference**
- text on dark: #f5f5f7 (Frost White)
- text on light: #1d1d1f (Obsidian)
- background dark: #000000 (Pure Black)
- background light: #ffffff (Paper White)
- border/divider: #333336 (dark) / #d2d2d7 (light)
- primary action: #0071e3 (filled action)
- accent/category: #f56900 (Signal Orange)
- link text: #0066cc

**5 Example Component Prompts**

1. **Hero Stage**: Full-bleed #000000 background, max-width 1440px centered. Product photo at 60% viewport height, centered. Bottom-left content stack: Apple logo + "WATCH ULTRA 3" eyebrow in SF Pro Text 17px weight 600 #f5f5f7, then headline "Una fuerza de la naturaleza." at SF Pro Display 80px weight 700 #f5f5f7 letter-spacing -0.24px, then inline row of price text "Desde 899 €" (SF Pro Text 14px #ffffff) and filled pill button #0071e3 background, #ffffff text, SF Pro Text 14px weight 600, 36px radius, 10px 20px padding.

2. **Category Eyebrow + Headline + Body Block (Light Section)**: White #ffffff background. Orange eyebrow "Running" in SF Pro Text 17px weight 600 #f56900, letter-spacing -0.19px. Below: headline "Tus retos piden paso." in SF Pro Display 56px weight 700 #1d1d1f, letter-spacing -0.84px. Body paragraph: SF Pro Text 17px weight 400 #86868b, line-height 1.47, max-width 460px.

3. **Feature Card (Dark Stage)**: Obsidian #1d1d1f background. Card with 28px border-radius, internal padding 28px. Full-width B&W photograph inside. White overlay text top-left: SF Pro Text 14px weight 400 #f5f5f7, max-width 340px, 3 lines max.

4. **Section Headline (Dark)**: Pure Black #000000 background with 120px vertical padding. Left-aligned SF Pro Display 56px weight 700 #f5f5f7, letter-spacing -0.84px, max-width 980px. No subtitle, no eyebrow.

5. **Inline Sub-Feature Link**: Horizontal flex row. Small 32px circular icon container with #f5f5f7 border, inside an outlined arrow/compass icon in #1d1d1f stroke. Then 2-line text in SF Pro Text 17px weight 600 #1d1d1f on light background.

## Page Rhythm

The page follows a three-act cinematic structure: (1) Dark hero — full-bleed product on black with one CTA; (2) Dark feature stages — stacked rounded photo cards on obsidian with overlaid white text, 88–120px vertical gaps; (3) Light detail band — two-column image+copy on white with orange category labels. Never break this dark→dark→light cadence. Never use card grids. Never use multi-column text. One subject per viewport, generous negative space, color appears only in the CTA and category eyebrows.

## Contrast & Type Density

The typographic signature is aggressive negative letter-spacing that increases with size: -0.037em at 10px caption tightens to -0.003em at 80px hero display. This means display text feels optically dense and weighty while small text remains crisp. Line-heights are tight for display (1.05–1.14) and generous for body (1.43–1.83). The "numr" font feature is used for tabular numerals in product specs and pricing — always use it for any numeric data.

## Similar Brands

- **Bang & Olufsen** — Same cinematic product-on-black hero staging with massive negative space, single hero subject, and minimal white headline typography
- **Tesla (vehicle configurator pages)** — Full-bleed dark backgrounds with floating product photography, single vivid blue action color, and two-column dark-then-light section alternation
- **Sonos** — Dark product showcase pages with generous 28px card radii, SF-style sans-serif headlines at extreme scale, and orange accent for category tags
- **Dyson** — Product-first page architecture: large dark hero with centered product, white headline overlay, single filled CTA, and high-contrast B&W lifestyle photography in dark feature sections
- **Leica** — Premium dark-canvas product pages with minimal text chrome, dramatic product photography as the visual anchor, and pill-shaped nav bar at 980px radius

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-obsidian: #1d1d1f;
  --color-frost-white: #f5f5f7;
  --color-pure-black: #000000;
  --color-paper-white: #ffffff;
  --color-carbon: #111111;
  --color-platinum: #86868b;
  --color-graphite: #333336;
  --color-silver-mist: #cccccc;
  --color-smoke: #424245;
  --color-apple-blue: #0071e3;
  --color-link-blue: #0066cc;
  --color-halo-blue: #2997ff;
  --color-signal-orange: #f56900;
  --color-iris-violet: #8668ff;
  --color-reef-teal: #00a1b3;

  /* Typography — Font Families */
  --font-sf-pro-display: 'SF Pro Display', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-sf-pro-text: 'SF Pro Text', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.83;
  --tracking-caption: -0.37px;
  --text-body: 14px;
  --leading-body: 1.43;
  --tracking-body: -0.22px;
  --text-heading-sm: 19px;
  --leading-heading-sm: 1.21;
  --tracking-heading-sm: -0.28px;
  --text-heading: 24px;
  --leading-heading: 1.17;
  --tracking-heading: -0.24px;
  --text-heading-lg: 32px;
  --leading-heading-lg: 1.14;
  --tracking-heading-lg: -0.32px;
  --text-display: 56px;
  --leading-display: 1.07;
  --tracking-display: -0.84px;
  --text-hero: 80px;
  --leading-hero: 1.05;
  --tracking-hero: -0.24px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-28: 28px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-60: 60px;
  --spacing-76: 76px;
  --spacing-80: 80px;
  --spacing-96: 96px;
  --spacing-104: 104px;
  --spacing-160: 160px;

  /* Layout */
  --page-max-width: 1440px;
  --section-gap: 88-120px;
  --card-padding: 28px;
  --element-gap: 10-12px;

  /* Border Radius */
  --radius-lg: 10px;
  --radius-3xl: 28px;
  --radius-3xl-2: 32px;
  --radius-3xl-3: 36px;
  --radius-full: 980px;

  /* Named Radii */
  --radius-nav: 980px;
  --radius-pill: 980px;
  --radius-cards: 28px;
  --radius-links: 10px;
  --radius-buttons: 36px;

  /* Surfaces */
  --surface-pure-black-stage: #000000;
  --surface-carbon-layer: #111111;
  --surface-obsidian-card: #1d1d1f;
  --surface-graphite-surface: #333336;
  --surface-frost-white-panel: #f5f5f7;
  --surface-paper-white: #ffffff;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-obsidian: #1d1d1f;
  --color-frost-white: #f5f5f7;
  --color-pure-black: #000000;
  --color-paper-white: #ffffff;
  --color-carbon: #111111;
  --color-platinum: #86868b;
  --color-graphite: #333336;
  --color-silver-mist: #cccccc;
  --color-smoke: #424245;
  --color-apple-blue: #0071e3;
  --color-link-blue: #0066cc;
  --color-halo-blue: #2997ff;
  --color-signal-orange: #f56900;
  --color-iris-violet: #8668ff;
  --color-reef-teal: #00a1b3;

  /* Typography */
  --font-sf-pro-display: 'SF Pro Display', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-sf-pro-text: 'SF Pro Text', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.83;
  --tracking-caption: -0.37px;
  --text-body: 14px;
  --leading-body: 1.43;
  --tracking-body: -0.22px;
  --text-heading-sm: 19px;
  --leading-heading-sm: 1.21;
  --tracking-heading-sm: -0.28px;
  --text-heading: 24px;
  --leading-heading: 1.17;
  --tracking-heading: -0.24px;
  --text-heading-lg: 32px;
  --leading-heading-lg: 1.14;
  --tracking-heading-lg: -0.32px;
  --text-display: 56px;
  --leading-display: 1.07;
  --tracking-display: -0.84px;
  --text-hero: 80px;
  --leading-hero: 1.05;
  --tracking-hero: -0.24px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-28: 28px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-60: 60px;
  --spacing-76: 76px;
  --spacing-80: 80px;
  --spacing-96: 96px;
  --spacing-104: 104px;
  --spacing-160: 160px;

  /* Border Radius */
  --radius-lg: 10px;
  --radius-3xl: 28px;
  --radius-3xl-2: 32px;
  --radius-3xl-3: 36px;
  --radius-full: 980px;
}
```
