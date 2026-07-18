# Relieve Furniture — Style Reference
> Living moss on warm stone — a grounded, organic palette where a single deep forest-teal holds the structure and chartreuse sparks punctuate the silence.

**Theme:** light

Relieve Furniture uses a warm-stone canvas with a single deep forest-teal structural color and bright chartreuse sparks of sustainability energy. The visual language is grounded and organic: borders carry brand weight more than fills, the typeface is a whisper-thin neo-grotesque (Planar, weights 200-400), and surfaces are stacked as warm stone → mist → pure white. A vivid violet provides secondary energy for the asset calculator card and link accents. Components feel light and architectural — thin teal strokes, 8px radii, soft shadows used sparingly, and a 9999px pill for sustainability badges. Color appears as punctuation (lime badges, violet link underlines, teal borders) rather than as a painted backdrop; the page reads as an editorial product on limestone rather than a marketing surface.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Forest Ink | `#0b392f` | `--color-forest-ink` | Primary brand color — carries borders, navigation strokes, heading underlines, card edges, and structural outlines. This teal defines the design more than any fill color; surfaces stay warm and neutral while the Forest Ink draws the architecture |
| Iris | `#6f52d3` | `--color-iris` | Vivid violet accent — link underlines, secondary call-out card backgrounds (asset calculator), heading emphasis, and selective section highlights. Acts as a counterpoint to Forest Ink, used when a block needs energy without the sustainability context of lime |
| Deep Iris | `#6043ba` | `--color-deep-iris` | Pressed iris for button backgrounds or filled actions where a chromatic state is needed without warmth — denser than Iris, used as the active/filled counterpart of the violet family |
| Soft Iris | `#7f6de1` | `--color-soft-iris` | Tinted violet for softer card washes or large surface blocks that need chromatic presence without the saturation of Iris |
| Lime Spark | `#abf625` | `--color-lime-spark` | Green wash for highlight backgrounds, decorative bands, and soft emphasis behind content |
| Mint Pulse | `#0cea9e` | `--color-mint-pulse` | Vivid mint for the rare filled chromatic button or interactive state — used when a CTA needs to feel switched on without being violet |
| Deep Moss | `#0b704e` | `--color-deep-moss` | Mid-green for body text emphasis and border details that need botanical warmth without the full weight of Forest Ink |
| Warm Stone | `#e7e5e4` | `--color-warm-stone` | Page canvas, primary section backgrounds, and the dominant neutral surface — this warm limestone tone gives the site its grounded, tactile character and sets off both the teal structure and lime accents |
| Mist | `#f6f7f7` | `--color-mist` | Card surfaces and button fills that need to lift off the stone canvas without becoming bright white — a cool, slightly desaturated light gray for quieter elevated layers |
| Pure | `#ffffff` | `--color-pure` | Highest surface — chat widget, product cards, nav bar background, button borders. Reserved for surfaces that need to read as paper or screen-white against the stone canvas |
| Charcoal | `#171c1b` | `--color-charcoal` | Primary text and strongest heading color — near-black with a barely-perceptible green undertone that aligns it with the Forest Ink palette rather than reading as neutral gray |
| Sage Gray | `#9caca6` | `--color-sage-gray` | Muted helper text, secondary body copy, and low-priority labels — a desaturated sage that keeps the neutral family botanically tinted |
| Lichen | `#778a83` | `--color-lichen` | Body text and nav links at reduced hierarchy, plus nav borders — a middle gray-green for content that needs to be readable but not assertive |
| Slate Dark | `#333c39` | `--color-slate-dark` | High-contrast neutral action fill for primary buttons on light surfaces. |
| Onyx | `#000000` | `--color-onyx` | Icon fills and absolute-contrast accents — the cart icon, logo mark, and any element that must read as a sharp silhouette against the warm canvas |

## Tokens — Typography

### Planar — Sole typeface — a custom neo-grotesque used across all surfaces. The signature choice is the whisper-thin 200/300 weights: headlines at weight 200 feel drawn rather than typeset, giving a refined editorial voice unusual for a B2B marketplace. Weight 400 handles body and nav; 200–300 carries all display and heading sizes. Letter-spacing is consistently tight (-0.025em) at display sizes and slightly positive (+0.018em) at small body labels for optical balance. · `--font-planar`
- **Substitute:** Söhne, Inter, General Sans, or Suisse Int'l — any neo-grotesque with a refined thin weight
- **Weights:** 200, 300, 400
- **Sizes:** 10px, 11px, 12px, 13px, 14px, 16px, 17px, 20px, 22px, 24px, 26px, 32px, 36px
- **Line height:** 1.0–2.0 (1.0 for display, 1.15 for large headings, 1.4–1.5 for body, 2.0 for loose lists)
- **Letter spacing:** -0.025em at display sizes (32px+), +0.018em at 10–12px label sizes, 0 at body sizes
- **Role:** Sole typeface — a custom neo-grotesque used across all surfaces. The signature choice is the whisper-thin 200/300 weights: headlines at weight 200 feel drawn rather than typeset, giving a refined editorial voice unusual for a B2B marketplace. Weight 400 handles body and nav; 200–300 carries all display and heading sizes. Letter-spacing is consistently tight (-0.025em) at display sizes and slightly positive (+0.018em) at small body labels for optical balance.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 10px | 1.4 | 0.18px | `--text-caption` |
| body | 14px | 1.5 | — | `--text-body` |
| heading-sm | 22px | 1.2 | -0.55px | `--text-heading-sm` |
| heading | 26px | 1.15 | -0.65px | `--text-heading` |
| heading-lg | 32px | 1.15 | -0.8px | `--text-heading-lg` |
| display | 36px | 1 | -0.9px | `--text-display` |

## Tokens — Spacing & Shapes

**Density:** compact

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 5 | 5px | `--spacing-5` |
| 8 | 8px | `--spacing-8` |
| 10 | 10px | `--spacing-10` |
| 13 | 13px | `--spacing-13` |
| 15 | 15px | `--spacing-15` |
| 20 | 20px | `--spacing-20` |
| 25 | 25px | `--spacing-25` |
| 30 | 30px | `--spacing-30` |
| 40 | 40px | `--spacing-40` |
| 61 | 61px | `--spacing-61` |
| 100 | 100px | `--spacing-100` |
| 134 | 134px | `--spacing-134` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 12px |
| pills | 9999px |
| small | 4px |
| images | 8px |
| buttons | 8px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| md | `rgba(0, 0, 0, 0.25) 0px 0px 15px 0px` | `--shadow-md` |
| subtle | `rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.1) 0p...` | `--shadow-subtle` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 40px
- **Card padding:** 20px
- **Element gap:** 8-10px

## Components

### Primary Navigation Bar
**Role:** Top-level site navigation

White (#ffffff) bar with a Forest Ink (#0b392f) 1px bottom border. Left: square Forest Ink logo block. Center: nav links (Solutions, Removals, Furnish, Shop, Case Studies) in Planar 14px weight 400 Charcoal (#171c1b). Right: outlined 'Sign up' button, filled dark 'Log in' button, and a cart icon. Height approximately 64px.

### Outlined CTA Button
**Role:** Primary call to action (e.g. 'I want to remove furniture', 'I want to browse circular furniture')

Planar 14px weight 400 Charcoal text. 1px Charcoal (#171c1b) border, 8px radius, 10px 20px padding. No fill — transparent over Warm Stone canvas. Two buttons sit side by side as equal-weight options rather than one dominant action.

### Filled Dark Button (Log in)
**Role:** Account/secondary action

Planar 14px weight 400 white text on Slate Dark (#333c39) fill. 8px radius, 8px 20px padding. Small and dense — the only filled button in the primary nav.

### Sustainability Stat Badge
**Role:** Hero metric highlight (CO₂ saved counter)

Lime Spark (#abf625) pill background, Charcoal (#171c1b) text in Planar 14px. 9999px border radius. Sits above the hero headline as a small status chip with a check/leaf icon prefix.

### Hero Headline
**Role:** Primary value proposition

Planar weight 200 at 36px, Charcoal (#171c1b), letter-spacing -0.9px, line-height 1.0. Centered on Warm Stone canvas. One word ('sustainable offices') underlined with Forest Ink as a link.

### Feature Image Card (Removals, Flexible Furnishing)
**Role:** Two-up category entry points

8px radius image fills full card width. White overlay label at bottom-left in Planar 16px weight 400 white text on a subtle dark gradient scrim. 12px card radius. Cards sit side by side with 20px gap.

### Asset Calculator Callout Card
**Role:** Interactive tool promotion

Iris (#6f52d3) background filling the card area, white text, 12px radius. Headline in Planar 22px weight 300 white, body in Planar 14px weight 400 at 90% white. Contains a 'Run a simulation' ghost button with white border and a small circular avatar image top-right.

### Inventory Management Card with NEW Tag
**Role:** Product feature highlight

Full-bleed image card (8px radius) with bottom overlay label. A Lime Spark (#abf625) NEW tag in Planar 12px weight 400 Charcoal sits top-left of the label — uses the same chartreuse as the sustainability badge to signal freshness and life-cycle continuity.

### Testimonial Quote Card
**Role:** Social proof — client testimonial

White card on Warm Stone canvas. 12px radius, 20px padding. Body text Planar 14px weight 400 Charcoal, attribution in Planar 12px weight 400 Sage Gray (#9caca6) with role/title, and a client logo in Forest Ink at the bottom.

### Chat Support Widget
**Role:** Persistent sales/help chat

Floating bottom-right white card with 12px radius and soft shadow (rgba(0,0,0,0.1) 0px 1px 3px). Avatar top-left, bold greeting in Planar 14px weight 400 Charcoal, body in Sage Gray, and a Slate Dark filled 'Book a free call' button. A separate Lime Spark (#abf625) or Mint Pulse circular chat trigger sits at bottom-right with a white chat icon.

### Top Announcement Bar
**Role:** Site-wide promotional banner

Slim bar above the nav, Warm Stone fill, Planar 12px weight 400 Charcoal text centered, with a small 'Find us' link/button in Forest Ink outlined style.

### Ghost Action Button on Violet Card
**Role:** Secondary action inside the asset calculator block

1px white border, white text, transparent fill. 8px radius, 8px 16px padding. Planar 14px weight 400. Right arrow icon suffix in white.

## Do's and Don'ts

### Do
- Use Warm Stone (#e7e5e4) as the page canvas for the majority of sections; only switch to white when a block must read as a distinct paper surface (nav, product cards, chat widget).
- Carry brand weight with Forest Ink (#0b392f) strokes — 1px borders on cards, nav, and section dividers — rather than filling large surfaces with color.
- Set display and heading copy in Planar weight 200–300 at -0.025em letter-spacing; the whisper-thin headline is the signature voice.
- Reserve Lime Spark (#abf625) for sustainability outcomes, NEW tags, and high-energy stat highlights — never as a decorative fill or large surface.
- Use the Iris (#6f52d3) violet family for secondary call-out blocks and link emphasis; pair it with white text and 12px radius.
- Keep card radii at 12px and button radii at 8px; reserve 9999px exclusively for sustainability badges and the chat trigger.
- Default to 8–10px element gaps and 20px card padding; the layout should feel compact and editorial, not airy.

### Don't
- Don't fill large surfaces with Forest Ink — it reads as structural outline color, not paint. Use it for borders, nav strokes, and the logo mark.
- Don't set body or paragraph text in weight 200; reserve thin weights for display/heading and keep body at 400 for legibility.
- Don't place Lime Spark on white-on-white blocks or as a full-width background — it loses its sustainability-signal meaning at scale.
- Don't use directional drop shadows to separate cards; the system reads through warm-stone contrast and Forest Ink borders, not depth.
- Don't introduce a new accent hue — the palette is intentionally limited to Forest Ink, Iris, and Lime; chromatic variety should come from saturation shifts within those families.
- Don't use bright white for card surfaces on the Warm Stone canvas when Mist (#f6f7f7) achieves the same lift with less glare.
- Don't underline or colorize body copy with Iris unless it is a link; the violet's role is interactive, not decorative.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Warm Stone Canvas | `#e7e5e4` | Page background — dominant tone |
| 1 | Mist | `#f6f7f7` | Card and button surfaces that lift from the stone |
| 2 | Pure | `#ffffff` | Nav bar, product cards, chat widget — paper-white surface |
| 3 | Slate Dark | `#333c39` | Filled dark buttons and the highest functional surface |

## Elevation

- **Chat widget card:** `rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.1) 0px 1px 2px -1px`
- **Hover-elevated cards and buttons:** `rgba(0, 0, 0, 0.25) 0px 0px 15px 0px`

## Imagery

Imagery is photography-led and product-focused: full-bleed office environments, human hands interacting with product (a phone showing the catalog, a laptop on a desk), and warm interior shots of furnished workspaces. Images are treated with soft natural light and slightly desaturated tones that harmonize with the Warm Stone canvas. The product photo IS the hero — text labels overlay directly on photographs in white Planar 16px rather than sitting in separate card frames. There are no illustrations, no abstract graphics, and no 3D renders. Iconography is minimal and monochrome (Forest Ink or Onyx, line-based at ~1.5px stroke). The chat widget avatar is the only circular photographic portrait. Overall density: image-heavy in the lower feature grid, text-dominant in the hero and announcement bands.

## Layout

The page is max-width contained at approximately 1200px, centered on a Warm Stone canvas. The hero is a centered single-column stack: announcement bar → nav → sustainability badge → whisper-thin headline → two equal-weight outlined CTAs. Below the hero, content alternates between two-up full-bleed image cards and 1:1 text+media or pure-color callout blocks (the violet asset calculator sits in this rhythm). Section spacing runs 40px; the site reads as one continuous canvas with internal sections delineated by card edges and subtle background shifts rather than hard dividers. Navigation is a single slim top bar — no sidebar, no mega-menu, no sticky behavior visible. Card grids are 2-column at this breakpoint; testimonials appear in a 4-column row at the same width.

## Agent Prompt Guide

## Quick Color Reference
- text (primary): #171c1b Charcoal
- text (muted): #9caca6 Sage Gray
- background (canvas): #e7e5e4 Warm Stone
- background (surface): #ffffff Pure / #f6f7f7 Mist
- border (brand): #0b392f Forest Ink
- accent (sustainability): #abf625 Lime Spark
- primary action: #0cea9e (filled action)

## Example Component Prompts
1. **Sustainability stat badge above a hero headline**: 9999px radius pill, #abf625 Lime Spark fill, Planar 14px weight 400 #171c1b Charcoal text, 8px 16px padding, small leaf or check icon prefix in Charcoal. Centered, sits 24px above the headline.

2. **Outlined brand button on Warm Stone canvas**: transparent fill, 1px #171c1b Charcoal border, 8px radius, 10px 20px padding, Planar 14px weight 400 Charcoal label. Hover: fills with #f6f7f7 Mist and gains a soft rgba(0,0,0,0.25) 0px 0px 15px 0px ambient glow.

3. **Full-bleed image card with overlay label**: 8px radius, photograph fills card 100%, bottom 40% darkened with a subtle linear gradient scrim to rgba(0,0,0,0.5), label sits bottom-left in Planar 16px weight 400 white with 20px inset padding.

4. **Violet asset calculator callout card**: #6f52d3 Iris fill, 12px radius, 20px padding, Planar 22px weight 300 white headline, Planar 14px weight 400 rgba(255,255,255,0.9) body, ghost white-bordered 'Run a simulation' button with right arrow at 8px 16px padding.

5. **Top nav bar**: #ffffff white background, 1px #0b392f Forest Ink bottom border, 64px height, left-aligned 32×32 Forest Ink logo square, center-aligned nav links in Planar 14px weight 400 Charcoal with 20px gaps, right-aligned outlined 'Sign up' + filled #333c39 Slate Dark 'Log in' button + cart icon.

## Similar Brands

- **The RealReal** — Same warm-stone and bone-canvas foundation with a single deep brand stroke (teal/burgundy) carrying structure through borders rather than fills.
- **Floyd Furniture** — Editorial furniture marketplace with whisper-thin display typography, photography-heavy cards, and a quiet neutral palette punctuated by a single vivid accent.
- **Vitsœ** — Same restrained neo-grotesque typography and 1px structural borders defining product cards; the warm canvas and weight-200 headlines are a near match.
- **Olive Lab (sustainability B2B)** — Chartreuse accent on near-stone neutral canvas, thin display type, and a single deep brand color holding navigation and card edges.
- **Aesop (digital)** — Warm off-white canvas, whisper-light headlines, and a single botanical accent color — the structural use of 1px brand-colored borders instead of fills is shared.

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-forest-ink: #0b392f;
  --color-iris: #6f52d3;
  --color-deep-iris: #6043ba;
  --color-soft-iris: #7f6de1;
  --color-lime-spark: #abf625;
  --color-mint-pulse: #0cea9e;
  --color-deep-moss: #0b704e;
  --color-warm-stone: #e7e5e4;
  --color-mist: #f6f7f7;
  --color-pure: #ffffff;
  --color-charcoal: #171c1b;
  --color-sage-gray: #9caca6;
  --color-lichen: #778a83;
  --color-slate-dark: #333c39;
  --color-onyx: #000000;

  /* Typography — Font Families */
  --font-planar: 'Planar', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.4;
  --tracking-caption: 0.18px;
  --text-body: 14px;
  --leading-body: 1.5;
  --text-heading-sm: 22px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: -0.55px;
  --text-heading: 26px;
  --leading-heading: 1.15;
  --tracking-heading: -0.65px;
  --text-heading-lg: 32px;
  --leading-heading-lg: 1.15;
  --tracking-heading-lg: -0.8px;
  --text-display: 36px;
  --leading-display: 1;
  --tracking-display: -0.9px;

  /* Typography — Weights */
  --font-weight-extralight: 200;
  --font-weight-light: 300;
  --font-weight-regular: 400;

  /* Spacing */
  --spacing-5: 5px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-13: 13px;
  --spacing-15: 15px;
  --spacing-20: 20px;
  --spacing-25: 25px;
  --spacing-30: 30px;
  --spacing-40: 40px;
  --spacing-61: 61px;
  --spacing-100: 100px;
  --spacing-134: 134px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 40px;
  --card-padding: 20px;
  --element-gap: 8-10px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-full: 9999px;

  /* Named Radii */
  --radius-cards: 12px;
  --radius-pills: 9999px;
  --radius-small: 4px;
  --radius-images: 8px;
  --radius-buttons: 8px;

  /* Shadows */
  --shadow-md: rgba(0, 0, 0, 0.25) 0px 0px 15px 0px;
  --shadow-subtle: rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.1) 0px 1px 2px -1px;

  /* Surfaces */
  --surface-warm-stone-canvas: #e7e5e4;
  --surface-mist: #f6f7f7;
  --surface-pure: #ffffff;
  --surface-slate-dark: #333c39;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-forest-ink: #0b392f;
  --color-iris: #6f52d3;
  --color-deep-iris: #6043ba;
  --color-soft-iris: #7f6de1;
  --color-lime-spark: #abf625;
  --color-mint-pulse: #0cea9e;
  --color-deep-moss: #0b704e;
  --color-warm-stone: #e7e5e4;
  --color-mist: #f6f7f7;
  --color-pure: #ffffff;
  --color-charcoal: #171c1b;
  --color-sage-gray: #9caca6;
  --color-lichen: #778a83;
  --color-slate-dark: #333c39;
  --color-onyx: #000000;

  /* Typography */
  --font-planar: 'Planar', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.4;
  --tracking-caption: 0.18px;
  --text-body: 14px;
  --leading-body: 1.5;
  --text-heading-sm: 22px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: -0.55px;
  --text-heading: 26px;
  --leading-heading: 1.15;
  --tracking-heading: -0.65px;
  --text-heading-lg: 32px;
  --leading-heading-lg: 1.15;
  --tracking-heading-lg: -0.8px;
  --text-display: 36px;
  --leading-display: 1;
  --tracking-display: -0.9px;

  /* Spacing */
  --spacing-5: 5px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-13: 13px;
  --spacing-15: 15px;
  --spacing-20: 20px;
  --spacing-25: 25px;
  --spacing-30: 30px;
  --spacing-40: 40px;
  --spacing-61: 61px;
  --spacing-100: 100px;
  --spacing-134: 134px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-md: rgba(0, 0, 0, 0.25) 0px 0px 15px 0px;
  --shadow-subtle: rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.1) 0px 1px 2px -1px;
}
```
