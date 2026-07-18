# Pally — Style Reference
> violet signals in a dark void. A single white pill floats in a near-black observatory, with the product's purple glass UI glowing softly below like an instrument panel lit from within.

**Theme:** dark

Pally's marketing site is a near-monochrome dark canvas where the product is the only source of color. The page reads as a quiet, editorial space: a deep navy void, white display type set in a custom grotesque with aggressive negative tracking, and a single white pill CTA that functions as the lone bright object on screen. Color is entirely deferred to the in-app screenshot — violet glass panels, indigo chat bubbles, pink-to-purple gradient halos behind floating platform icons — which makes the product UI itself feel like the brand's chromatic moment. The layout favors centered compositions, generous negative space, and minimal section count: one hero, one animated platform constellation, one social proof strip. Every component is reduced to its essential silhouette — pill nav, pill button, flat cards, organic glowing blobs — and the absence of shadows, borders, or decorative chrome is the point.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Deep Navy Void | `#161e29` | `--color-deep-navy-void` | Page canvas, hero background, full-bleed sections — the near-black stage on which every other element sits |
| Bone White | `#fefcfb` | `--color-bone-white` | Primary text, pill CTA fill, highlight strokes — the only fully bright object against the dark canvas |
| Warm Card Stock | `#eae5dd` | `--color-warm-card-stock` | Isolated card or panel surface when a warm off-white is needed against the dark void |
| Ink Black | `#1e1d1d` | `--color-ink-black` | Deep text and border color for headings and body copy, warm-tinted alternative to pure black |
| Carbon Border | `#000000` | `--color-carbon-border` | Hairline borders, image edges, structural dividers — pure black defines outlines where the navy canvas needs edge |
| Ash Gray | `#b8b9bc` | `--color-ash-gray` | Muted body text and subdued borders for secondary information |
| Silver Gray | `#d0d0d1` | `--color-silver-gray` | Lighter body text and hairline borders for de-emphasized copy and inactive states |
| Pewter | `#a1a3a7` | `--color-pewter` | Sub-label, footer micro-text, disabled-state typography |
| Smoke | `#8a8d92` | `--color-smoke` | Tertiary metadata, timestamps, dimmed annotations |
| Violet Aura | `linear-gradient(180deg, #e9b3f2 0%, #9868cc 50%, #5f4dbd 100%)` | `--color-violet-aura` | Deepest stop in the brand gradient — appears as the terminal indigo in the product UI mockup and the base of floating icon halos |
| Lilac Wash | `#e9b3f2` | `--color-lilac-wash` | Top stop of the brand gradient — the soft pink-violet that opens the glow behind floating platform icons and tints the product's glass panels |

## Tokens — Typography

### sans-serif — sans-serif — detected in extracted data but not described by AI · `--font-sans-serif`
- **Weights:** 400
- **Sizes:** 12px
- **Line height:** 1.2
- **Role:** sans-serif — detected in extracted data but not described by AI

### Untitled Sans — Sole brand typeface used for everything from 14px body to 64px display. Custom Klim Type grotesque; the signature is consistent 400 weight across the entire scale paired with aggressively negative tracking that tightens as size increases (-0.02em at body, -0.06em at display). This single-weight, tight-tracked approach is deliberate: without weight contrast, the hierarchy is carried by size and tracking alone, which gives the page its quiet, editorial monotone. System sans-serif and Inter appear only as functional fallbacks for micro-labels. · `--font-untitled-sans`
- **Substitute:** Inter, Söhne, General Sans
- **Weights:** 400
- **Sizes:** 14px, 16px, 18px, 19px, 24px, 26px, 28px, 48px, 64px
- **Line height:** 0.90, 1.00, 1.10, 1.20, 1.40
- **Letter spacing:** -0.02em at 14–24px, -0.04em at 26–48px, -0.06em at 64px
- **Role:** Sole brand typeface used for everything from 14px body to 64px display. Custom Klim Type grotesque; the signature is consistent 400 weight across the entire scale paired with aggressively negative tracking that tightens as size increases (-0.02em at body, -0.06em at display). This single-weight, tight-tracked approach is deliberate: without weight contrast, the hierarchy is carried by size and tracking alone, which gives the page its quiet, editorial monotone. System sans-serif and Inter appear only as functional fallbacks for micro-labels.

### Inter — Inter — detected in extracted data but not described by AI · `--font-inter`
- **Weights:** 500
- **Sizes:** 14px
- **Line height:** 1.4
- **Role:** Inter — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.2 | — | `--text-caption` |
| body-sm | 14px | 1.4 | -0.28px | `--text-body-sm` |
| body | 16px | 1.4 | -0.32px | `--text-body` |
| subheading | 19px | 1.1 | -0.38px | `--text-subheading` |
| heading-sm | 24px | 1.2 | -0.48px | `--text-heading-sm` |
| heading | 28px | 1.1 | -1.12px | `--text-heading` |
| heading-lg | 48px | 1 | -1.92px | `--text-heading-lg` |
| display | 64px | 0.9 | -3.84px | `--text-display` |

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
| 14 | 14px | `--spacing-14` |
| 15 | 15px | `--spacing-15` |
| 18 | 18px | `--spacing-18` |
| 20 | 20px | `--spacing-20` |
| 24 | 24px | `--spacing-24` |
| 28 | 28px | `--spacing-28` |
| 30 | 30px | `--spacing-30` |
| 32 | 32px | `--spacing-32` |
| 40 | 40px | `--spacing-40` |
| 80 | 80px | `--spacing-80` |
| 200 | 200px | `--spacing-200` |

### Border Radius

| Element | Value |
|---------|-------|
| nav | 100px |
| cards | 12px |
| images | 12px |
| buttons | 100px |
| organicShapes | 117-180px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 16px
- **Element gap:** 10px

## Components

### Floating Pill Navigation
**Role:** Sticky top nav anchored as an isolated pill shape

Semi-transparent dark surface (#161e29 at ~80% opacity with backdrop blur), fully rounded at 100px radius, horizontal padding ~16px, vertically centered. Logo 'Pally' on the left with a small starburst icon, 2–3 inline links in 14px Untitled Sans, white pill CTA 'Join the waitlist' on the right with Bone White fill and Deep Navy Void text. The nav floats above content without a visible container edge — its silhouette is the only boundary.

### Hero Headline Block
**Role:** Centered display copy on the dark canvas

64px Untitled Sans weight 400, Bone White, letter-spacing -3.84px, line-height 0.9, centered. A small inline violet starburst glyph sits in the middle of the second line as the only chromatic punctuation. Subtext in 18px weight 400, Silver Gray, sits 16-24px below. The block is vertically centered in the first viewport.

### Ghost Pill CTA
**Role:** Primary call-to-action button

Bone White fill (#fefcfb), Deep Navy Void text (#161e29), 14px Untitled Sans weight 400, 10px vertical / 16px horizontal padding, 100px border-radius (fully pill). No border, no shadow. Optionally includes a small leading icon (envelope or arrow) at 12px. On hover, background dims to ~95% opacity.

### Product Screenshot Card
**Role:** Full app UI mockup embedded in the hero

Large rectangular card with 12px border-radius, slight rotation (-2°) for visual energy. Contains a glassmorphic in-app interface: sidebar with platform icons, message list with avatar circles, chat thread with indigo (#5f4dbd) message bubbles on the right, and a right-hand profile panel. Inner surfaces use the violet gradient (lilac → indigo) at low opacity. No drop shadow — the card is defined by its content density and the subtle gradient backdrop.

### Logo Cloud Strip
**Role:** Social proof row at the page bottom

Single horizontal row of partner/exec logos in light gray (#d0d0d1) on the dark canvas, preceded by a small label 'Loved by founders and executives at' in 12px Silver Gray. Logos are monochrome, ~60–80% opacity, evenly spaced with ~10px gaps, no dividers between them.

### Platform Constellation
**Role:** Animated cluster of third-party messaging platform icons

Organic arrangement of 6–8 platform icon tiles (Instagram, Messenger, LinkedIn, X, etc.) floating in the center of a dark section. Each tile is roughly 40–60px square with 19–30px corner radius, set against a soft violet glow halo (gradient from #e9b3f2 at 40% to transparent, blur ~60px). Icons drift slowly in idle animation. Surrounding copy 'All your chats' is split across the canvas ('All' left, 'your' center, 'chats' right) in 19–24px Bone White.

### Message Thread Avatar
**Role:** Circular avatar in the in-app product mockup

40px circle, image fill with thin (1px) Ash Gray border, positioned left of a name/timestamp row. Names in 14px Bone White weight 400, timestamps in 12px Smoke weight 400.

### In-App Chat Bubble
**Role:** Outgoing message bubble inside the product UI

Rounded rectangle, ~12px corner radius on all but one corner, indigo fill (#5f4dbd), Bone White text 14px, 10px padding. Incoming bubbles are transparent with a thin (#1e1d1d or rgba(254,252,251,0.1)) hairline border and Bone White text.

### Sidebar Platform Icon
**Role:** Vertical icon rail in the product mockup

32px square, 8px radius, placed in a 56px-wide left sidebar. Active state shows a lilac/violet tint (#9868cc at 20% opacity) behind the icon. Inactive icons are Ash Gray (#b8b9bc) at 60% opacity.

### Contact Profile Panel
**Role:** Right-side detail panel in the product UI

~280px wide vertical panel, no visible border, contains a large avatar at top, name and handle in 16px Bone White, then tabbed sections (Close friends / Founders) with small underlined text, followed by stats rows in 14px Silver Gray separated by 10px gaps.

### Section Divider
**Role:** Implicit separator between full-bleed sections

No visible line. Sections are separated purely by 80px vertical breathing room and the consistent Deep Navy Void background. The void itself is the divider.

## Do's and Don'ts

### Do
- Use Untitled Sans weight 400 exclusively across the entire type scale — let size and negative tracking carry hierarchy, never introduce bold weights.
- Set display text at 64px with -3.84px letter-spacing, line-height 0.9 — the headline must feel optically tight and editorial, not comfortable.
- Place all primary actions as 100px-radius pill buttons in Bone White (#fefcfb) on Deep Navy Void (#161e29) — this is the only button shape and color combination in the system.
- Use the violet gradient (lilac #e9b3f2 → mid #9868cc → indigo #5f4dbd) only inside the product UI mockup or as halos behind floating platform icons — never on marketing-page surfaces.
- Center every hero-level composition horizontally and let the 80px section gap create rhythm — no asymmetric layouts at the page level.
- Default to Deep Navy Void (#161e29) for every full-bleed background and rely on 12px-radius cards with the gradient backdrop to distinguish product surfaces.
- Use 10px for element gaps and 16px for card padding — the system is compact, and wider spacing breaks the dark-room intimacy.

### Don't
- Don't introduce any chromatic color outside the violet gradient stops — the monochrome discipline is the brand.
- Don't use box-shadows to elevate cards or buttons — the system relies on gradient backdrops and silhouette, not drop shadows.
- Don't use border-radius values other than 12px (cards/images), 100px (buttons/nav), or the organic 117–180px range (floating animated shapes).
- Don't switch to bold or semibold weights for emphasis — bump size and tighten tracking instead.
- Don't add visible section dividers, horizontal rules, or bordered cards on the marketing surface — let the void be continuous.
- Don't apply letter-spacing: normal to any heading — all display and heading text must carry negative tracking.
- Don't use bright accent colors for badges, tags, or status indicators — the only color punctuation is the violet gradient inside product contexts.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Void Canvas | `#161e29` | Full-bleed page background for all sections |
| 1 | Glass Panel | `#161e29` | Product UI sidebar, message list, and chat thread surfaces inside the embedded screenshot — defined by the violet gradient backdrop, not by their own fill |
| 2 | Gradient Highlight | `#9868cc` | Mid-stop of the lilac-to-indigo gradient that washes over product panels and floating icon halos |
| 3 | Active Tile | `#5f4dbd` | Active sidebar item tint, outgoing message bubble fill, deepest gradient stop |

## Elevation

- **Floating Pill Navigation:** `0 8px 32px rgba(0,0,0,0.35), inset 0 1px 0 rgba(254,252,251,0.06)`
- **Product Screenshot Card:** `0 24px 60px rgba(95,77,189,0.25), 0 8px 24px rgba(0,0,0,0.4)`

## Imagery

Imagery is minimal and entirely functional. The hero contains one large embedded product screenshot rendered with a slight tilt, glassmorphic transparency, and a violet gradient wash — it carries the full chromatic weight of the page. The middle section uses no photography or illustration, only floating platform icon tiles (Instagram, Messenger, LinkedIn, X) each blurred into a soft violet halo, drifting in a loose constellation. A logo cloud of partner marks sits at the bottom in flat monochrome. There is no lifestyle photography, no product renders, no human imagery — the visual language is app-UI-as-art and icon-as-constellation.

## Layout

The page follows a vertical scroll through three full-bleed dark sections, each separated by 80px of pure navy void. Section one is a centered hero: floating pill nav pinned to the top center, 64px display headline centered with a small inline violet glyph, subtext below, a single white pill CTA, and the large tilted product screenshot card spanning ~70% of the viewport width. Section two is a sparse animation frame — just the words 'All', 'your', 'chats' split left/center/right around the floating platform constellation. Section three is the logo cloud, a single full-width row of partner marks under a small label. There is no sidebar, no multi-column content, no grid of feature cards — the page is essentially a series of centered, single-focus compositions.

## Agent Prompt Guide

## Quick Color Reference
- text (primary): #fefcfb (Bone White)
- text (secondary): #b8b9bc (Ash Gray)
- text (muted): #d0d0d1 (Silver Gray)
- background (page): #161e29 (Deep Navy Void)
- border (hairline): #000000 or rgba(254,252,251,0.08)
- accent (gradient stops only): #e9b3f2 → #9868cc → #5f4dbd
- primary action: no distinct CTA color

## Example Component Prompts
1. **Hero Headline Block**: Centered 64px Untitled Sans weight 400, color #fefcfb, letter-spacing -3.84px, line-height 0.9. Insert a small 24px violet starburst glyph (#9868cc) inline between two words. Subtext below at 18px weight 400, #b8b9bc, centered.

No distinct primary action color was observed; use the extracted neutral button treatments instead of inventing a filled CTA color.


4. **Product Screenshot Card**: 12px radius rectangle, ~2° counter-clockwise rotation, containing a glassmorphic in-app UI: 56px left sidebar with 32px square platform icons (8px radius), 280px message list column with 40px circular avatars and 14px contact names, central chat thread with 12px-radius outgoing bubbles in #5f4dbd and incoming bubbles transparent with a #fefcfb 1px border, 280px right profile panel. Background of the card uses a linear-gradient(180deg, #e9b3f2 0%, #9868cc 50%, #5f4dbd 100%) at 20% opacity.

5. **Platform Constellation Tile**: 50px square platform icon (Instagram/Messenger/LinkedIn/X), 19px border-radius, positioned in a loose cluster at the center of a dark section. Behind it, a 200px blurred halo using the lilac-to-indigo gradient at 30% opacity (filter: blur(60px)). Surrounding copy in 24px Untitled Sans #fefcfb with -0.48px letter-spacing, split into three positions: left ('All'), center ('your'), right ('chats').

## Similar Brands

- **Linear** — Same dark-mode restraint with a single sans-serif typeface, negative tracking on display sizes, and pill-shaped CTAs — but Linear adds more typographic weight contrast where Pally stays monotone at 400.
- **Arc Browser** — Same centered hero with full-bleed dark canvas, embedded product showcase as the visual focal point, and minimal section count — Arc leans on colorful gradients more aggressively where Pally confines color to the product UI.
- **Vercel** — Same near-black canvas, single-weight grotesque typography, and the discipline of letting the product demo carry the color — Vercel uses more geometric grid layouts where Pally stays centered and single-column.
- **Nothing (nothing.tech)** — Same dot-matrix / pixel aesthetic, dark void background, and the use of a small iconographic glyph (Pally's starburst, Nothing's dot grid) as the only inline color accent.

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-deep-navy-void: #161e29;
  --color-bone-white: #fefcfb;
  --color-warm-card-stock: #eae5dd;
  --color-ink-black: #1e1d1d;
  --color-carbon-border: #000000;
  --color-ash-gray: #b8b9bc;
  --color-silver-gray: #d0d0d1;
  --color-pewter: #a1a3a7;
  --color-smoke: #8a8d92;
  --color-violet-aura: #5f4dbd;
  --gradient-violet-aura: linear-gradient(180deg, #e9b3f2 0%, #9868cc 50%, #5f4dbd 100%);
  --color-lilac-wash: #e9b3f2;

  /* Typography — Font Families */
  --font-sans-serif: 'sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-untitled-sans: 'Untitled Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.2;
  --text-body-sm: 14px;
  --leading-body-sm: 1.4;
  --tracking-body-sm: -0.28px;
  --text-body: 16px;
  --leading-body: 1.4;
  --tracking-body: -0.32px;
  --text-subheading: 19px;
  --leading-subheading: 1.1;
  --tracking-subheading: -0.38px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: -0.48px;
  --text-heading: 28px;
  --leading-heading: 1.1;
  --tracking-heading: -1.12px;
  --text-heading-lg: 48px;
  --leading-heading-lg: 1;
  --tracking-heading-lg: -1.92px;
  --text-display: 64px;
  --leading-display: 0.9;
  --tracking-display: -3.84px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-5: 5px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-14: 14px;
  --spacing-15: 15px;
  --spacing-18: 18px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-28: 28px;
  --spacing-30: 30px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-80: 80px;
  --spacing-200: 200px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 16px;
  --element-gap: 10px;

  /* Border Radius */
  --radius-md: 5px;
  --radius-xl: 12px;
  --radius-2xl: 19px;
  --radius-3xl: 30px;
  --radius-full: 100px;
  --radius-full-2: 117px;
  --radius-full-3: 180px;
  --radius-full-4: 1000px;
  --radius-full-5: 3000px;

  /* Named Radii */
  --radius-nav: 100px;
  --radius-cards: 12px;
  --radius-images: 12px;
  --radius-buttons: 100px;
  --radius-organicshapes: 117-180px;

  /* Surfaces */
  --surface-void-canvas: #161e29;
  --surface-glass-panel: #161e29;
  --surface-gradient-highlight: #9868cc;
  --surface-active-tile: #5f4dbd;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-deep-navy-void: #161e29;
  --color-bone-white: #fefcfb;
  --color-warm-card-stock: #eae5dd;
  --color-ink-black: #1e1d1d;
  --color-carbon-border: #000000;
  --color-ash-gray: #b8b9bc;
  --color-silver-gray: #d0d0d1;
  --color-pewter: #a1a3a7;
  --color-smoke: #8a8d92;
  --color-violet-aura: #5f4dbd;
  --color-lilac-wash: #e9b3f2;

  /* Typography */
  --font-sans-serif: 'sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-untitled-sans: 'Untitled Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.2;
  --text-body-sm: 14px;
  --leading-body-sm: 1.4;
  --tracking-body-sm: -0.28px;
  --text-body: 16px;
  --leading-body: 1.4;
  --tracking-body: -0.32px;
  --text-subheading: 19px;
  --leading-subheading: 1.1;
  --tracking-subheading: -0.38px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: -0.48px;
  --text-heading: 28px;
  --leading-heading: 1.1;
  --tracking-heading: -1.12px;
  --text-heading-lg: 48px;
  --leading-heading-lg: 1;
  --tracking-heading-lg: -1.92px;
  --text-display: 64px;
  --leading-display: 0.9;
  --tracking-display: -3.84px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-5: 5px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-14: 14px;
  --spacing-15: 15px;
  --spacing-18: 18px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-28: 28px;
  --spacing-30: 30px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-80: 80px;
  --spacing-200: 200px;

  /* Border Radius */
  --radius-md: 5px;
  --radius-xl: 12px;
  --radius-2xl: 19px;
  --radius-3xl: 30px;
  --radius-full: 100px;
  --radius-full-2: 117px;
  --radius-full-3: 180px;
  --radius-full-4: 1000px;
  --radius-full-5: 3000px;
}
```
