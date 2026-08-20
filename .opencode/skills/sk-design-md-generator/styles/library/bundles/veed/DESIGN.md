# VEED — Style Reference
> white gallery wall with neon-green ignition buttons

**Theme:** light

VEED reads as a creator's studio on a clean white wall: calm matte surfaces, a single electric lime accent that ignites action, and a typographic contrast between a clinical neo-grotesque UI face and an editorial serif that lends unexpected sophistication. The page breathes — generous white canvas interrupted by full-bleed dark bands and large media cards — but the controls themselves stay compact and tool-like, sitting close together inside pill-shaped and softly rounded containers. Color is rationed: greens are reserved for active states, the AI creation prompt, and hero CTAs, while 99% of the interface stays achromatic. The signature move is the interplay between the vivid neon green and the warm near-black text (#0c0a09) — a creator-tool energy crossed with editorial polish.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Lime Spark | `#96ff1a` | `--color-lime-spark` | Primary CTA fills, active toggle states, the AI creation prompt accent — an electric green that functions as the brand's ignition switch, impossible to miss on the white canvas |
| Spring Wash | `#d6ffa6` | `--color-spring-wash` | Green wash for highlight backgrounds, decorative bands, and soft emphasis behind content. Do not promote it to the primary CTA color |
| Forest Ink | `#083300` | `--color-forest-ink` | Deep brand green used for borders, icon strokes, and text on light green washes — the anchor tone that gives the lime palette a grounded counterweight |
| Mint Mist | `#e6ffc8` | `--color-mint-mist` | Subtle tint for secondary button hovers and soft highlight zones — the palest breath of the green family |
| Carbon | `#0c0a09` | `--color-carbon` | Primary heading and body text — a warm near-black with a whisper of brown that pairs with the lime accent without reading as dead-black |
| Charcoal | `#323232` | `--color-charcoal` | Workhorse text, secondary borders, link undertones — the most-used neutral across borders and structural lines |
| Graphite | `#292a2e` | `--color-graphite` | Dark surface fills, button text on light backgrounds, icon strokes — the primary dark tone for elevated dark sections |
| Onyx | `#121212` | `--color-onyx` | Dark section backgrounds, heading text on light surfaces — the deepest neutral for full-bleed dark bands |
| Slate | `#4d4d51` | `--color-slate` | Icon borders, secondary structural lines — a mid-gray for non-content boundaries |
| Smoke | `#71737a` | `--color-smoke` | Muted helper text, link borders, placeholder text — the voice of secondary information |
| Ash | `#444446` | `--color-ash` | Tertiary borders, icon detail strokes — a bridge tone between slate and charcoal |
| Mist | `#f2f1f0` | `--color-mist` | Secondary surface fills, button backgrounds on hero areas, subtle tonal dividers |
| Fog | `#e6e6e7` | `--color-fog` | Hairline borders on light surfaces, divider lines |
| Paper | `#ffffff` | `--color-paper` | Page canvas, card surfaces, button fills — the dominant light surface |

## Tokens — Typography

### SwissNow — The universal workhorse — handles all UI, body, navigation, button labels, inputs, footer, and most headings. A neo-grotesque with tight geometry and very tight tracking at large sizes (-0.05em at display, easing to near-normal at body). Its neutrality lets the lime accent and editorial serif carry the personality. · `--font-swissnow`
- **Substitute:** Inter, Geist, or DM Sans
- **Weights:** 400, 500, 600
- **Sizes:** 11px, 12px, 13px, 14px, 16px, 40px, 44px, 54px
- **Line height:** 0.88–1.80
- **Letter spacing:** -0.05em at 54px, -0.04em at 44px, -0.025em at 40px, -0.016em at 16px, -0.005em at 14px, -0.002em at 12px, 0.01em at 11px
- **Role:** The universal workhorse — handles all UI, body, navigation, button labels, inputs, footer, and most headings. A neo-grotesque with tight geometry and very tight tracking at large sizes (-0.05em at display, easing to near-normal at body). Its neutrality lets the lime accent and editorial serif carry the personality.

### PPEditorialNew — The editorial display serif reserved exclusively for top-tier section headings. A high-contrast didone-influenced face with extremely tight tracking (-0.05em at 54px) and near-zero leading (0.88–1.0) — it whispers luxury into a tool that could otherwise feel utilitarian. The contrast between SwissNow and PPEditorialNew is the brand's typographic signature. · `--font-ppeditorialnew`
- **Substitute:** Playfair Display, DM Serif Display, or GT Super
- **Weights:** 400
- **Sizes:** 40px, 44px, 54px
- **Line height:** 0.88–1.00
- **Letter spacing:** -0.05em at 54px, -0.04em at 44px, -0.03em at 40px
- **Role:** The editorial display serif reserved exclusively for top-tier section headings. A high-contrast didone-influenced face with extremely tight tracking (-0.05em at 54px) and near-zero leading (0.88–1.0) — it whispers luxury into a tool that could otherwise feel utilitarian. The contrast between SwissNow and PPEditorialNew is the brand's typographic signature.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 11px | 1.5 | 0.01px | `--text-caption` |
| body | 16px | 1.5 | -0.016px | `--text-body` |
| subheading | 40px | 1 | -0.025px | `--text-subheading` |
| heading | 44px | 0.9 | -0.04px | `--text-heading` |
| display | 54px | 0.88 | -0.05px | `--text-display` |

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
| 96 | 96px | `--spacing-96` |
| 100 | 100px | `--spacing-100` |
| 120 | 120px | `--spacing-120` |
| 140 | 140px | `--spacing-140` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 16px |
| pills | 9999px |
| inputs | 10px |
| buttons | 10px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| subtle | `rgba(68, 68, 70, 0.15) 0px 1px 2px -1px, rgba(68, 68, 70,...` | `--shadow-subtle` |
| subtle-2 | `oklch(0.3171 0 0) 0px 0px 0px 0px` | `--shadow-subtle-2` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 16px
- **Element gap:** 16px

## Components

### Top Navigation Bar
**Role:** Primary site navigation — fixed top, white background, hairline bottom border

White (#ffffff) background, 8px vertical padding, horizontal layout with logo (left), nav links with dropdown chevrons (center: Product, Use Cases, AI, APIs, Resources, Enterprise, Pricing), and a Login text link + black Sign Up pill button (right). Nav links in SwissNow 14px weight 500 in #323232. The 'Sign Up' button is #0c0a09 fill, white text, 10px radius, 8px 16px padding. The nav has a barely-visible hairline border in #e6e6e7.

### Hero Headline Block
**Role:** Centered hero with rating badge, primary headline, and subtext

A trust badge (5-star rating + review count in SwissNow 12px) sits above a 54px PPEditorialNew headline in #0c0a09 with -0.05em tracking, line-height 0.88 — extremely tight, almost display-poster feel. Subtext in SwissNow 16px weight 400 in #71737a, max-width ~560px, centered. Generous 64px+ vertical padding above and below.

### Hero CTA Pair (Lime + Ghost)
**Role:** The dual-action prompt — primary creation + secondary edit

Two buttons side by side, centered. Primary: #96ff1a fill, #083300 border (1px), #083300 text, 10px radius, SwissNow 14px weight 600, 14px 24px padding, with a small inline icon (camera/play). Secondary ('AI Edit'): no fill, #323232 text, 10px radius, same dimensions, with a sparkle/stars icon. The lime-on-white with deep-green text is the brand's primary ignition moment.

### AI Prompt Input
**Role:** The signature creation input — a rounded container that invites the user to type a video idea

White (#ffffff) background, 16px radius, 1px border in #e6e6e7, 24px padding. Placeholder text 'Describe or edit a product video' in SwissNow 16px weight 400 in #71737a. A '+' add button and 'Character' dropdown chip sit at the bottom-left in pill form (10px radius). The submit arrow is a circular #96ff1a button (28px circle) at the right. This is the most visually important interactive element on the page.

### Use Case Category Card
**Role:** Video template/use-case tiles in a horizontal scroll row

Portrait-oriented card, 10px radius, full-bleed video/image fill. A small category label (e.g. 'Explainer', 'Product Demo', 'Ad', 'Testimonials', 'Thought Leadership') sits top-left in white text on a subtle dark gradient overlay. Cards are ~220px wide, ~350px tall, arranged in a horizontal row with 16px gaps. The middle card ('Ad') contains a green-accented product mockup with the lime green as a functional UI color.

### Partner Logo Strip
**Role:** Social proof — trusted-by enterprise brand logos

A simple row of monochrome (black) partner logos on white: PENTAX, Ventura Foods, P&G, BBC, TARGET, Meta, Amazon. SwissNow or matched sans-serif, weight 500, ~14-16px equivalents, in #323232. Logos are evenly distributed across the full width, separated by generous whitespace. Section heading above in SwissNow 40px weight 500 in #0c0a09.

### Dark Feature Section Header
**Role:** Full-bleed dark band that introduces a new content group

Background #121212 (Onyx), 80px+ vertical padding. Centered headline in PPEditorialNew 54px weight 400 in #ffffff, tracking -0.05em. This full-width dark band creates a dramatic visual break from the light sections — a structural rhythm device that alternates throughout the page.

### Feature Showcase Card (Asymmetric Grid)
**Role:** Large video/feature cards arranged in an asymmetric 1-large + 2-stacked layout

Left: one large 16:9 card with full-bleed video and a small lime play button (#96ff1a, 32px circle) plus headline in SwissNow 14px weight 500 white. Right: two stacked smaller cards, same treatment. The asymmetric layout (60/40 split) is a signature composition pattern. Cards have 16px radius, no border, content is video-driven with text overlay.

### Pill Navigation Dot
**Role:** Carousel pagination indicator

Horizontal row of 8px circular dots, 8px gap. Active dot is #0c0a09 (10px), inactive dots are #e6e6e7 (8px). Centered below the card carousel. Flanked by small circular left/right arrow buttons (32px, #ffffff fill, 1px #e6e6e7 border).

### Category Tag Chip
**Role:** Small inline labels for use-case categories overlaid on cards

White text on semi-transparent dark background (rgba(0,0,0,0.4) or gradient). SwissNow 12px weight 500, 4px 8px padding, 4px radius. Positioned top-left of media cards. The pill is small, almost a whisper — not the focal point.

### CTA Pill Button (Dark)
**Role:** Secondary action — sign up / start free

Solid #0c0a09 background, white text, 9999px radius (true pill), SwissNow 14px weight 600, 8px 20px padding. Used in the top nav and end-of-section conversion moments. The contrast between this dark pill and the lime CTA creates a clear hierarchy: lime = creation, black = conversion.

## Do's and Don'ts

### Do
- Use #96ff1a only for the primary creation action and active/selected states — it is rationed, not decorative.
- Pair display headlines in PPEditorialNew 54px with -0.05em tracking and 0.88 line-height to maintain the editorial signature.
- Apply 10px radius to buttons, inputs, and small cards; 16px radius to large media cards; 9999px only for true pill buttons.
- Alternate full-bleed #121212 dark bands with #ffffff light sections to create the page's structural rhythm.
- Set body and heading text in #0c0a09 (warm near-black) rather than pure #000 — the slight warmth is part of the brand's editorial character.
- Use #d6ffa6 as a soft wash behind text or icons when extending the lime family without competing with the CTA.
- Keep all body copy and UI labels in SwissNow weight 400-500; reserve weight 600 for button labels and active states.

### Don't
- Don't use #96ff1a for large backgrounds, section fills, or non-action decoration — it must remain a spark, not a wash.
- Don't apply PPEditorialNew to body text, button labels, or any UI smaller than 40px — it is display-only.
- Don't use pure #000 for text — always use #0c0a09 to preserve the warm editorial tone.
- Don't add drop shadows to cards — VEED uses borders and surface contrast for separation, not elevation shadows.
- Don't introduce additional accent colors — the system is monochrome with a single lime ignition; adding a second hue breaks the discipline.
- Don't set letter-spacing to normal or positive on headlines — the tight tracking (-0.025em to -0.05em) is signature.
- Don't mix border radii within the same component group — stay consistent: 10px for compact controls, 16px for media cards.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Paper | `#ffffff` | Page canvas, primary background |
| 1 | Mist | `#f2f1f0` | Subtle elevated surface for hero input surrounds and tonal sections |
| 2 | Spring Wash | `#d6ffa6` | Brand-tinted card backgrounds and feature highlight zones |
| 3 | Onyx | `#121212` | Full-bleed dark bands for structural rhythm breaks |
| 4 | Graphite | `#292a2` | Deepest elevated dark surface for nested dark-mode content |

## Imagery

Photography-dominant with a creator-casual tone: real people in real environments (home offices, studios, outdoor greenery), shot in warm natural light, candid mid-action poses (eating, sitting on floors, gesturing). Video thumbnails use full-bleed framing with category labels overlaid top-left. Product mockups appear in the AI tool context with the lime green as the interactive accent (keyboard keys, buttons). No illustrations, no abstract 3D, no stock-lifestyle glossiness — the imagery feels shot-by-the-team, not stock-photo. Icons are minimal, used only inside buttons and the input bar.

## Agent Prompt Guide

## Quick Color Reference
- Text: #0c0a09
- Background: #ffffff
- Border: #e6e6e7
- Accent (brand): #96ff1a
- Muted text: #71737a
- Dark surface: #121212
- primary action: #96ff1a (filled action)

## Example Component Prompts

1. **Hero Headline Section**: White #ffffff background, 80px top padding. Display headline at 54px PPEditorialNew weight 400, color #0c0a09, letter-spacing -0.05em, line-height 0.88. Subtext at 16px SwissNow weight 400, color #71737a, max-width 560px, centered.

2. Create a Primary Action Button: #96ff1a background, #0c0a09 text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.

3. **AI Prompt Input**: Background #ffffff, border 1px solid #e6e6e7, border-radius 16px, padding 24px. Placeholder text at 16px SwissNow weight 400, color #71737a. Submit arrow: 32px circle, background #96ff1a, dark arrow icon centered.

4. **Dark Feature Band**: Background #121212, padding 80px vertical. Centered headline at 54px PPEditorialNew weight 400, color #ffffff, letter-spacing -0.05em, line-height 0.88.

5. **Use Case Card**: Full-bleed video/image, border-radius 10px. Top-left category label: 12px SwissNow weight 500, white text, 4px 8px padding, 4px radius, semi-transparent dark background. Card width ~220px, height ~350px.

## Typographic Signature

The dual-font system is the brand's strongest visual signal. SwissNow handles every functional pixel with clinical precision; PPEditorialNew arrives only at display sizes (40px+) to add editorial gravitas. The contrast is not decorative — it signals that VEED is a serious creative tool with cultural taste, not just a utility. Maintain the discipline: PPEditorialNew never appears below 40px, and never in any functional/UI context. SwissNow at display sizes (40-54px) is the fallback for sub-headings that don't need editorial weight.

## Similar Brands

- **Descript** — Same light-canvas + single electric accent + media-heavy creator tool aesthetic with rounded cards and prominent video/portrait imagery
- **Runway** — Same monochrome base with a single vivid color ignition, large media-driven hero cards, and creator-focused minimalism
- **Framer** — Same disciplined palette (white canvas + near-black text + one accent), editorial-style display headings, and pill/rounded component language
- **CapCut** — Same video-creation tool positioning with lime-green accent, dark-mode feature bands, and card-based use-case browsing
- **Linear** — Same clean neo-grotesque UI typography, tight letter-spacing, and pill-button + monochrome discipline with color reserved for primary action

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-lime-spark: #96ff1a;
  --color-spring-wash: #d6ffa6;
  --color-forest-ink: #083300;
  --color-mint-mist: #e6ffc8;
  --color-carbon: #0c0a09;
  --color-charcoal: #323232;
  --color-graphite: #292a2e;
  --color-onyx: #121212;
  --color-slate: #4d4d51;
  --color-smoke: #71737a;
  --color-ash: #444446;
  --color-mist: #f2f1f0;
  --color-fog: #e6e6e7;
  --color-paper: #ffffff;

  /* Typography — Font Families */
  --font-swissnow: 'SwissNow', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-ppeditorialnew: 'PPEditorialNew', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 11px;
  --leading-caption: 1.5;
  --tracking-caption: 0.01px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.016px;
  --text-subheading: 40px;
  --leading-subheading: 1;
  --tracking-subheading: -0.025px;
  --text-heading: 44px;
  --leading-heading: 0.9;
  --tracking-heading: -0.04px;
  --text-display: 54px;
  --leading-display: 0.88;
  --tracking-display: -0.05px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;

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
  --spacing-96: 96px;
  --spacing-100: 100px;
  --spacing-120: 120px;
  --spacing-140: 140px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 16px;
  --element-gap: 16px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 10px;
  --radius-2xl: 16px;
  --radius-3xl: 32px;
  --radius-full: 58px;

  /* Named Radii */
  --radius-cards: 16px;
  --radius-pills: 9999px;
  --radius-inputs: 10px;
  --radius-buttons: 10px;

  /* Shadows */
  --shadow-subtle: rgba(68, 68, 70, 0.15) 0px 1px 2px -1px, rgba(68, 68, 70, 0.05) 0px 2px 5px 0px;
  --shadow-subtle-2: oklch(0.3171 0 0) 0px 0px 0px 0px;

  /* Surfaces */
  --surface-paper: #ffffff;
  --surface-mist: #f2f1f0;
  --surface-spring-wash: #d6ffa6;
  --surface-onyx: #121212;
  --surface-graphite: #292a2;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-lime-spark: #96ff1a;
  --color-spring-wash: #d6ffa6;
  --color-forest-ink: #083300;
  --color-mint-mist: #e6ffc8;
  --color-carbon: #0c0a09;
  --color-charcoal: #323232;
  --color-graphite: #292a2e;
  --color-onyx: #121212;
  --color-slate: #4d4d51;
  --color-smoke: #71737a;
  --color-ash: #444446;
  --color-mist: #f2f1f0;
  --color-fog: #e6e6e7;
  --color-paper: #ffffff;

  /* Typography */
  --font-swissnow: 'SwissNow', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-ppeditorialnew: 'PPEditorialNew', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 11px;
  --leading-caption: 1.5;
  --tracking-caption: 0.01px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.016px;
  --text-subheading: 40px;
  --leading-subheading: 1;
  --tracking-subheading: -0.025px;
  --text-heading: 44px;
  --leading-heading: 0.9;
  --tracking-heading: -0.04px;
  --text-display: 54px;
  --leading-display: 0.88;
  --tracking-display: -0.05px;

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
  --spacing-96: 96px;
  --spacing-100: 100px;
  --spacing-120: 120px;
  --spacing-140: 140px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 10px;
  --radius-2xl: 16px;
  --radius-3xl: 32px;
  --radius-full: 58px;

  /* Shadows */
  --shadow-subtle: rgba(68, 68, 70, 0.15) 0px 1px 2px -1px, rgba(68, 68, 70, 0.05) 0px 2px 5px 0px;
  --shadow-subtle-2: oklch(0.3171 0 0) 0px 0px 0px 0px;
}
```
