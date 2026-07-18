# Warp — Style Reference
> Moonlit terminal behind amber glass

**Theme:** dark

Warp operates as a dimmed control room: warm near-black canvases, terminal-derived product surfaces, and tight geometric typography that reads like a command line rendered in print. The palette is almost entirely achromatic with a warm undertone — no cool blues or sterile grays — giving every screen the amber cast of a late-night coding session. Accent color is rationed ruthlessly: a single muted gold and a single blue-gray appear only where the terminal needs syntax punctuation or a link must surface. Components are flat, dense, and weightless — no decorative shadows, no skeuomorphic depth, no rounded pillowy buttons. Every element earns its place through typographic precision and generous negative tracking at display sizes.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Warm Off-White | `#faf9f6` | `--color-warm-off-white` | Primary headlines, body text, nav links — the warm cream reads softer than pure white against the charcoal canvas |
| Bone Gray | `#868684` | `--color-bone-gray` | Secondary text, captions, muted labels — the midtone that separates from Off-White without losing warmth |
| Pale Stone | `#b4b4b2` | `--color-pale-stone` | Tertiary text, ghost button labels, low-emphasis copy |
| Faint Linen | `#e3e2e0` | `--color-faint-linen` | Hairline borders, subtle dividers, selected state outlines |
| Smoke Charcoal | `#2f2f2f` | `--color-smoke-charcoal` | Card surfaces, nested panels, terminal window backgrounds |
| Iron Veil | `#383838` | `--color-iron-veil` | Supporting neutral for secondary UI, dividers, and muted labels. Do not promote it to the primary CTA color |
| Slate Hearth | `#40403f` | `--color-slate-hearth` | Highest surface elevation — modal overlays, floating panels |
| Deep Ember | `#121212` | `--color-deep-ember` | Page canvas, section backgrounds — the warm near-black that grounds the whole system |
| Smoked Onyx | `#1e1e1d` | `--color-smoked-onyx` | Footer, banded section backgrounds, subtle vertical shifts |
| Absolute | `#000000` | `--color-absolute` | Deepest dark, nav text, icon strokes, image masks |
| Ink Black | `#080808` | `--color-ink-black` | Deep text, hairline borders that must disappear into the canvas |
| Gold Leaf | `#bd9f65` | `--color-gold-leaf` | Code syntax strings, keyword highlights, inline emphasis — appears only inside terminal content, never as a UI button |
| Muted Cobalt | `#6f839f` | `--color-muted-cobalt` | Code syntax identifiers, secondary link text, tag accents — the cool counterpoint to the warm gold |

## Tokens — Typography

### sans-serif — sans-serif — detected in extracted data but not described by AI · `--font-sans-serif`
- **Weights:** 400
- **Sizes:** 12px
- **Line height:** 1.2
- **Role:** sans-serif — detected in extracted data but not described by AI

### Matter — Primary typeface for all UI text — headlines, body, nav, and labels. Custom geometric grotesque with mechanical rhythm; the signature custom font. Letter-spacing tightens aggressively at display sizes (-0.030em at 56-68px) and opens wide for tracked small caps (0.200em at 11px), giving the system two distinct voices from one family. · `--font-matter`
- **Substitute:** Söhne (premium) or Inter (free fallback)
- **Weights:** 400, 500
- **Sizes:** 16px, 19px
- **Line height:** 0.91-1.40
- **Letter spacing:** -0.030em at 40-68px, -0.020em at 20-32px, -0.010em at 18-19px, 0 to +0.020em at 14-16px, +0.100em at 12px, +0.200em at 11px
- **OpenType features:** `"ss01" on, "tnum" on`
- **Role:** Primary typeface for all UI text — headlines, body, nav, and labels. Custom geometric grotesque with mechanical rhythm; the signature custom font. Letter-spacing tightens aggressively at display sizes (-0.030em at 56-68px) and opens wide for tracked small caps (0.200em at 11px), giving the system two distinct voices from one family.

### Geist Mono — Command-line strings inside buttons and inline code chips — the only monospace that touches user-facing UI · `--font-geist-mono`
- **Substitute:** JetBrains Mono or IBM Plex Mono
- **Weights:** 400
- **Sizes:** 16px
- **Line height:** 1.00
- **Role:** Command-line strings inside buttons and inline code chips — the only monospace that touches user-facing UI

### Matter Mono — Monospaced variant of Matter for code blocks and product mockup bodies · `--font-matter-mono`
- **Substitute:** JetBrains Mono
- **Weights:** 400
- **Sizes:** 16px
- **Line height:** 1.00
- **Letter spacing:** -0.0120em
- **Role:** Monospaced variant of Matter for code blocks and product mockup bodies

### Inter — Secondary support face for body copy where Matter licensing is unavailable; rare in the system · `--font-inter`
- **Substitute:** Inter
- **Weights:** 400, 500
- **Sizes:** 14px, 16px
- **Line height:** 1.00-1.38
- **Letter spacing:** -0.0140em, -0.0120em
- **Role:** Secondary support face for body copy where Matter licensing is unavailable; rare in the system

### Matter Regular — Matter Regular — detected in extracted data but not described by AI · `--font-matter-regular`
- **Weights:** 400
- **Sizes:** 11px, 12px, 14px, 16px, 18px, 19px, 20px, 22px, 24px, 32px, 40px, 48px, 56px, 68px
- **Line height:** 0.91, 1, 1.1, 1.15, 1.19, 1.2, 1.3, 1.35, 1.38, 1.4
- **Letter spacing:** -0.03, -0.02, -0.01, 0.01, 0.02, 0.1, 0.2
- **Role:** Matter Regular — detected in extracted data but not described by AI

### Matter SQ Regular — Matter SQ Regular — detected in extracted data but not described by AI · `--font-matter-sq-regular`
- **Weights:** 400
- **Sizes:** 16px, 42px
- **Line height:** 1, 1.2, 1.4
- **Letter spacing:** 0.01
- **Role:** Matter SQ Regular — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption-tracked | 11px | 1.2 | 2.2px | `--text-caption-tracked` |
| body-sm | 14px | 1.38 | 0.14px | `--text-body-sm` |
| body | 16px | 1.38 | 0.16px | `--text-body` |
| subheading | 20px | 1.3 | -0.2px | `--text-subheading` |
| heading-sm | 24px | 1.2 | -0.48px | `--text-heading-sm` |
| heading | 32px | 1.19 | -0.64px | `--text-heading` |
| heading-lg | 48px | 1.1 | -1.44px | `--text-heading-lg` |
| display | 68px | 1 | -2.04px | `--text-display` |

## Tokens — Spacing & Shapes

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 6 | 6px | `--spacing-6` |
| 8 | 8px | `--spacing-8` |
| 10 | 10px | `--spacing-10` |
| 11 | 11px | `--spacing-11` |
| 12 | 12px | `--spacing-12` |
| 14 | 14px | `--spacing-14` |
| 16 | 16px | `--spacing-16` |
| 24 | 24px | `--spacing-24` |
| 30 | 30px | `--spacing-30` |
| 32 | 32px | `--spacing-32` |
| 36 | 36px | `--spacing-36` |
| 40 | 40px | `--spacing-40` |
| 44 | 44px | `--spacing-44` |
| 64 | 64px | `--spacing-64` |
| 66 | 66px | `--spacing-66` |

### Border Radius

| Element | Value |
|---------|-------|
| nav | 4px |
| cards | 8px |
| icons | 8px |
| pills | 50px |
| images | 20px |
| buttons | 4px |
| heroMask | 110px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| xl | `rgba(33, 126, 255, 0.5) 0px 0px 32px 10px` | `--shadow-xl` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80-120px
- **Card padding:** 20-24px
- **Element gap:** 10px

## Components

### Primary Download Button
**Role:** Hero CTA — filled, white-on-white terminal command feel

Solid #faf9f6 fill, #121212 text, Matter Medium 500 at 16px, 4px radius, 10px 16px padding. Includes a small downward-arrow icon (16px) to the right of the label. No shadow, no border. Sits flat against the dark canvas as the only luminous element on the page.

### Ghost Nav Link
**Role:** Secondary nav items and the "Contact sales" link

Transparent fill, #faf9f6 text, Matter Regular 400 at 14-16px, no border, no padding. Color shifts to #b4b4b2 on hover. Inherits the nav's 4px radius on any pill-shaped variant.

### Terminal Product Mockup
**Role:** Hero visual asset — the product, rendered

Dark window with rounded 8px corners, #2f2f2f body, #383838 chrome bar at top. Three macOS traffic-light circles (red/yellow/green) at 10px in the top-left. Code rendered in Geist Mono or Matter Mono at 12-14px, with syntax colored using #bd9f65 for strings and #6f839f for identifiers, all on the smoke charcoal panel.

### Top Navigation Bar
**Role:** Persistent site header

#000000 background, 4px corner radius on its container. Left side: brand mark (Apple-shaped Warp glyph at 18px in #faf9f6) + nav items in Matter at 16px. Right side: ghost "Contact sales" link + filled "Download for Mac" button. Sits above an announcement banner.

### Announcement Banner
**Role:** Top-of-page news strip

Thin band, #000000 fill, centered Matter Regular text at 12-14px in #faf9f6, with an inline "Learn more" link in slightly heavier weight or underlined. 1px bottom border in #2f2f2f.

### Section Heading Block
**Role:** Section openers like "Coding Tools"

Matter Regular 400 at 48-68px, #6f839f (blue-gray) or #faf9f6 color, letter-spacing -1.44px to -2.04px. Sits left-aligned with a generous left margin. The cool blue-gray tint on the heading distinguishes it from the warm cream body, creating a deliberate chromatic pivot at section level.

### Hero Block
**Role:** Above-the-fold split layout

Two-column on desktop (text left, terminal visual right) with text block capped at ~520px. Headline at 68px Matter Regular, #faf9f6, -2.04px tracking. Sub-headline at 18-20px Matter Regular, #b4b4b2. CTA stack: filled white button above a `brew install` command line in Geist Mono 16px with a green command-prompt glyph.

### Brew Install Command Chip
**Role:** Inline developer-flavored CTA

Transparent background, Geist Mono 400 at 16px, #faf9f6 text, prefixed with a small green circle (#7ba564) acting as a prompt indicator. No border, no background — sits as raw terminal text under the Download button.

### Footer
**Role:** Site footer

#1e1e1d background, multi-column link grid, Matter Regular at 14px in #b4b4b2 for links, #868684 for column headers, #e3e2e0 thin top border. Tight 8-10px row gaps between links.

### Atmospheric Hero Image
**Role:** Background image treatment for hero

Full-bleed landscape photograph (mountains, mist) with dark warm grading — the entire image is treated to live behind a #121212 overlay at ~40% opacity so the photo reads as mood, not content. Masked corners at 110px on the terminal mockup that floats over it. Image is not decorative wallpaper; it carries the brand's nocturnal mood.

## Do's and Don'ts

### Do
- Use Matter (or Söhne as a paid substitute, Inter as a free fallback) for all UI text — never substitute a slab or humanist sans
- Set display headlines at 48-68px with letter-spacing between -1.44px and -2.04px; the negative tracking is what makes the type feel engineered, not editorial
- Use 0.200em tracking (2.2px) on 11px uppercase labels for the system's tracked-eyebrow voice
- Reach for #bd9f65 (Gold Leaf) and #6f839f (Muted Cobalt) only inside terminal/code contexts — never on UI buttons, tags, or badges
- Maintain the warm-gray palette: every neutral from #2f2f2f upward should have a slight amber undertone, not a cool blue cast
- Use 4px radius on all buttons and nav elements, 8px on cards and icons, 20px+ on images — the small-but-not-sharp radius defines the system's quiet precision
- Pair the white filled button with a ghost text link beside it for primary actions; avoid stacking two filled buttons

### Don't
- Don't introduce a bright primary brand color — the system's power comes from restraint; chromatic accents are syntax-only
- Don't add drop shadows to cards, modals, or buttons — the blue glow is reserved for one signature element, not generic elevation
- Don't use pure #ffffff for text on the dark canvas — always use #faf9f6, the warm off-white, to preserve the system's amber cast
- Don't apply rounded pill shapes (9999px) to buttons — Warp uses 4px, never fully rounded; the sharp-cornered button is part of the identity
- Don't break the 10px element-gap rhythm with 15px or 18px — the system breathes in multiples of 2 and 10
- Don't use the cool blue-gray #6f839f for body text or UI chrome — it lives exclusively inside terminal code and section headings
- Don't insert icons that aren't mono-weight and outlined — icons should match the precision of the type, not soften it

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas | `#121212` | Full-page background, hero and section grounds |
| 1 | Banded Section | `#1e1e1d` | Footer and alternating section bands |
| 2 | Card | `#2f2f2f` | Terminal mockup panels, product card containers |
| 3 | Elevated Control | `#383838` | Button fills, hover surfaces |
| 4 | Floating Panel | `#40403f` | Modals, popovers, sticky overlays |

## Elevation

- **Signature glow accent:** `0 0 32px 10px rgba(33, 126, 255, 0.5)`

## Imagery

Warp blends two visual registers: atmospheric landscape photography and terminal screenshots. The hero uses a full-bleed dark mountain photograph (treated with a warm #121212 overlay at roughly 40% opacity) that sets a nocturnal, contemplative mood — uncommon for a developer tool and deliberately cinematic. Product imagery is the IDE/terminal itself, shown as full macOS window mockups with traffic-light controls, rendered in Geist Mono and Matter Mono with gold and blue-gray syntax. Icons are thin-stroke, outlined, and mono-colored in #faf9f6. No illustrations, no 3D renders, no stock photography of people — the visual language is terminal + landscape, nothing in between.

## Layout

Warp uses a 1200px max-width centered container with comfortable vertical breathing room (80-120px section gaps). The hero is a two-column split: text block left (capped ~520px) with a headline, sub-headline, filled CTA, and inline brew-install command; full-bleed terminal mockup floating right with a 110px masked corner. Subsequent sections shift to centered text + centered terminal mockup stacks, with feature headings (in cool #6f839f) offset left to break the centered pattern. Navigation is a sticky top bar with an announcement banner above it. No sidebar, no mega-menu, no card grid — sections are vertical stacks of headline + screenshot, letting the terminal imagery carry visual weight.

## Agent Prompt Guide

**Quick Color Reference**
- background: #121212
- surface card: #2f2f2f
- text primary: #faf9f6
- text secondary: #868684
- text muted: #b4b4b2
- border hairline: #e3e2e0
- primary action: no distinct CTA color

**Example Component Prompts**

1. **Hero section**: Background #121212. Headline at 68px Matter weight 400, #faf9f6, letter-spacing -2.04px, line-height 1.00. Subheadline at 20px Matter weight 400, #b4b4b2, letter-spacing -0.2px. primary action: no distinct CTA color

2. **Terminal product mockup**: 8px radius, #2f2f2f body, 32px #383838 title bar with three 10px traffic-light circles (red #ff5f57, yellow #febc20, green #28c840) in the top-left. Code body in Geist Mono 13px, #faf9f6 base text, #bd9f65 string values, #6f839f identifiers. Drop shadow: none.

No distinct primary action color was observed; use the extracted neutral button treatments instead of inventing a filled CTA color.

4. **Section heading + terminal stack**: Centered column, max-width 900px. Eyebrow label at 11px Matter 400, +2.2px letter-spacing, #b4b4b2, all caps. Heading at 48px Matter 400, #6f839f, letter-spacing -1.44px. Sub-copy at 18px Matter 400, #868684, max 60ch line length. Below: terminal mockup at full column width.

5. **Ghost nav link**: Transparent fill, #faf9f6 text, Matter 400 16px, no border, 8px horizontal padding. On hover: text shifts to #b4b4b2. Inherits the nav's 4px radius only when wrapped in a pill container.

## Warm-Cool Chromatic Tension

Warp's most distinctive choice is refusing the cool blue-gray that dominates developer-tool design. Every neutral is warm (amber-tinged grays from #e3e2e0 to #080808), but the two chromatic accents are cool: #bd9f65 is a warm gold and #6f839f is a cool blue-gray. The system lives in this single warm-cool seam — gold strings on cool identifiers inside warm panels on a warm canvas. When in doubt, ask: does this color lean toward the candle or the moon? The candle is the surface, the moon is the code.

## Similar Brands

- **Linear** — Same dark-canvas premium typography with custom geometric sans and aggressive negative tracking on display sizes; both ration chromatic color and let white-on-dark carry hierarchy
- **Raycast** — Developer tool with a similar warm dark palette and product-forward hero composition; both foreground the IDE/terminal as the hero visual rather than abstract marketing imagery
- **Vercel** — Tight geometric grotesque, 4px button radius, 1200px max-width content, flat surfaces without drop shadows — the same restraint-first approach to dark mode
- **Arc Browser** — Warm dark canvas with high-contrast cream typography and a single restrained accent palette; both treat the terminal/command-line aesthetic as a visual language

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-warm-off-white: #faf9f6;
  --color-bone-gray: #868684;
  --color-pale-stone: #b4b4b2;
  --color-faint-linen: #e3e2e0;
  --color-smoke-charcoal: #2f2f2f;
  --color-iron-veil: #383838;
  --color-slate-hearth: #40403f;
  --color-deep-ember: #121212;
  --color-smoked-onyx: #1e1e1d;
  --color-absolute: #000000;
  --color-ink-black: #080808;
  --color-gold-leaf: #bd9f65;
  --color-muted-cobalt: #6f839f;

  /* Typography — Font Families */
  --font-sans-serif: 'sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-matter: 'Matter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-geist-mono: 'Geist Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-matter-mono: 'Matter Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-matter-regular: 'Matter Regular', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-matter-sq-regular: 'Matter SQ Regular', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption-tracked: 11px;
  --leading-caption-tracked: 1.2;
  --tracking-caption-tracked: 2.2px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.38;
  --tracking-body-sm: 0.14px;
  --text-body: 16px;
  --leading-body: 1.38;
  --tracking-body: 0.16px;
  --text-subheading: 20px;
  --leading-subheading: 1.3;
  --tracking-subheading: -0.2px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: -0.48px;
  --text-heading: 32px;
  --leading-heading: 1.19;
  --tracking-heading: -0.64px;
  --text-heading-lg: 48px;
  --leading-heading-lg: 1.1;
  --tracking-heading-lg: -1.44px;
  --text-display: 68px;
  --leading-display: 1;
  --tracking-display: -2.04px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-6: 6px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-11: 11px;
  --spacing-12: 12px;
  --spacing-14: 14px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-30: 30px;
  --spacing-32: 32px;
  --spacing-36: 36px;
  --spacing-40: 40px;
  --spacing-44: 44px;
  --spacing-64: 64px;
  --spacing-66: 66px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80-120px;
  --card-padding: 20-24px;
  --element-gap: 10px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-xl: 14px;
  --radius-2xl: 20px;
  --radius-full: 50px;
  --radius-full-2: 110px;

  /* Named Radii */
  --radius-nav: 4px;
  --radius-cards: 8px;
  --radius-icons: 8px;
  --radius-pills: 50px;
  --radius-images: 20px;
  --radius-buttons: 4px;
  --radius-heromask: 110px;

  /* Shadows */
  --shadow-xl: rgba(33, 126, 255, 0.5) 0px 0px 32px 10px;

  /* Surfaces */
  --surface-canvas: #121212;
  --surface-banded-section: #1e1e1d;
  --surface-card: #2f2f2f;
  --surface-elevated-control: #383838;
  --surface-floating-panel: #40403f;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-warm-off-white: #faf9f6;
  --color-bone-gray: #868684;
  --color-pale-stone: #b4b4b2;
  --color-faint-linen: #e3e2e0;
  --color-smoke-charcoal: #2f2f2f;
  --color-iron-veil: #383838;
  --color-slate-hearth: #40403f;
  --color-deep-ember: #121212;
  --color-smoked-onyx: #1e1e1d;
  --color-absolute: #000000;
  --color-ink-black: #080808;
  --color-gold-leaf: #bd9f65;
  --color-muted-cobalt: #6f839f;

  /* Typography */
  --font-sans-serif: 'sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-matter: 'Matter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-geist-mono: 'Geist Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-matter-mono: 'Matter Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-matter-regular: 'Matter Regular', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-matter-sq-regular: 'Matter SQ Regular', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption-tracked: 11px;
  --leading-caption-tracked: 1.2;
  --tracking-caption-tracked: 2.2px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.38;
  --tracking-body-sm: 0.14px;
  --text-body: 16px;
  --leading-body: 1.38;
  --tracking-body: 0.16px;
  --text-subheading: 20px;
  --leading-subheading: 1.3;
  --tracking-subheading: -0.2px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: -0.48px;
  --text-heading: 32px;
  --leading-heading: 1.19;
  --tracking-heading: -0.64px;
  --text-heading-lg: 48px;
  --leading-heading-lg: 1.1;
  --tracking-heading-lg: -1.44px;
  --text-display: 68px;
  --leading-display: 1;
  --tracking-display: -2.04px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-6: 6px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-11: 11px;
  --spacing-12: 12px;
  --spacing-14: 14px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-30: 30px;
  --spacing-32: 32px;
  --spacing-36: 36px;
  --spacing-40: 40px;
  --spacing-44: 44px;
  --spacing-64: 64px;
  --spacing-66: 66px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-xl: 14px;
  --radius-2xl: 20px;
  --radius-full: 50px;
  --radius-full-2: 110px;

  /* Shadows */
  --shadow-xl: rgba(33, 126, 255, 0.5) 0px 0px 32px 10px;
}
```
