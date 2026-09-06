# Adora — Style Reference
> impressionist museum behind frosted glass

**Theme:** light

Adora wraps a precise product-analytics interface inside an impressionist gallery — white cards and crisp dashboards sit on canvas-like backgrounds of swirling oil-paint color, with hand-drawn squiggle underlines giving headings a notebook-becoming-poster feel. The color story is white-surface discipline broken by a single vivid violet for action and a palette of pastel accents (sky blue, lime, bubblegum pink, hot magenta) that are used as small confetti, not washes. Shapes are confidently rounded: cards and the product frame are very generous (40-64px), badges and the floating nav pill are stadium-rounded, buttons are gently rounded (8-12px). Typography pairs a custom display face (PolySans) at heavy weights for headlines against Plus Jakarta Sans at 400-500 for UI, with universal -0.02em tracking pulling the whole system tight and contemporary.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Electric Violet | `#592eff` | `--color-electric-violet` | Primary action background, filled CTA buttons, active link borders, selected badge strokes — the single saturated chromatic that drives every conversion and active state |
| Midnight Plum | `#21164c` | `--color-midnight-plum` | Headline text color, display-weight typography — deep violet-ink that reads as near-black but carries a violet undertone matching the primary |
| Obsidian Charcoal | `#353241` | `--color-obsidian-charcoal` | Body text, paragraph copy, list items, icon strokes, default borders and dividers — the workhorse neutral that defines almost all interface line work |
| Slate Smoke | `#5f5f69` | `--color-slate-smoke` | Secondary body text, muted helper copy, supporting metadata |
| Pearl Mist | `#e0e0db` | `--color-pearl-mist` | Hairline borders on buttons, cards, and inputs; subtle structural dividers |
| Soft Concrete | `#eeeeee` | `--color-soft-concrete` | Subtle surface fills, secondary button backgrounds, disabled or recessed controls |
| Pure White | `#ffffff` | `--color-pure-white` | Page and card surfaces, button text on violet fills, nav-pill and elevated panel backgrounds |
| Sky Tint | `#bcf2ff` | `--color-sky-tint` | Decorative pastel accent — painterly background fills, soft highlight washes, illustrative splashes |
| Lime Spritz | `#dfff9d` | `--color-lime-spritz` | Decorative pastel accent — painterly background fills, squiggle underline fills, product card surface variation |
| Cotton Candy | `#ffaae6` | `--color-cotton-candy` | Decorative pastel accent — soft pink washes, squiggle underline highlights, atmospheric card backgrounds |
| Neon Cyan | `#2ed6ff` | `--color-neon-cyan` | Badge stroke and informational icon accent — vivid, used in tag outlines and feature flags |
| Lime Pop | `#a2ea13` | `--color-lime-pop` | Badge stroke and positive/success-leaning icon accent — vivid green used in tag outlines |
| Magenta Pulse | `#f843c2` | `--color-magenta-pulse` | Badge stroke and energetic icon accent — hot pink for tag outlines and feature highlights |

## Tokens — Typography

### PolySans — Display and headline face — custom geometric sans used exclusively for page titles, section headers, and hero copy at heavy weights. The 68px hero size with weight 700 and tight -0.02em tracking is the system's signature: it reads architectural and confident, not friendly. Substitute with General Sans Bold or Plus Jakarta Sans 700 if unavailable. · `--font-polysans`
- **Substitute:** General Sans Bold
- **Weights:** 600, 700
- **Sizes:** 18px, 28px, 38px, 58px, 68px
- **Line height:** 1.10, 1.20
- **Letter spacing:** -0.02em
- **Role:** Display and headline face — custom geometric sans used exclusively for page titles, section headers, and hero copy at heavy weights. The 68px hero size with weight 700 and tight -0.02em tracking is the system's signature: it reads architectural and confident, not friendly. Substitute with General Sans Bold or Plus Jakarta Sans 700 if unavailable.

### Plus Jakarta Sans — Body, UI, and supporting type — paragraphs at 18px/1.6 weight 400, button labels and nav links at 16px weight 500, badges at 14px, medium emphasis at 500. The 32px size at tight 1.10 line-height appears in sub-section headings. Universal -0.02em tracking pulls it into the same family feel as PolySans. · `--font-plus-jakarta-sans`
- **Substitute:** Inter
- **Weights:** 400, 500, 600, 700
- **Sizes:** 14px, 16px, 18px, 20px, 32px
- **Line height:** 1.00, 1.10, 1.60
- **Letter spacing:** -0.02em
- **Role:** Body, UI, and supporting type — paragraphs at 18px/1.6 weight 400, button labels and nav links at 16px weight 500, badges at 14px, medium emphasis at 500. The 32px size at tight 1.10 line-height appears in sub-section headings. Universal -0.02em tracking pulls it into the same family feel as PolySans.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 14px | 1.6 | -0.28px | `--text-caption` |
| body-sm | 16px | 1.6 | -0.32px | `--text-body-sm` |
| body | 18px | 1.6 | -0.36px | `--text-body` |
| subheading | 20px | 1.6 | -0.4px | `--text-subheading` |
| heading-sm | 32px | 1.1 | -0.64px | `--text-heading-sm` |
| heading | 38px | 1.1 | -0.76px | `--text-heading` |
| heading-lg | 58px | 1.1 | -1.16px | `--text-heading-lg` |
| display | 68px | 1.1 | -1.36px | `--text-display` |

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
| 48 | 48px | `--spacing-48` |
| 60 | 60px | `--spacing-60` |
| 100 | 100px | `--spacing-100` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 40px |
| badges | 200px |
| buttons | 8px |
| navPill | 40px |
| productFrame | 64px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 32px
- **Element gap:** 12px

## Components

### Floating Navigation Pill
**Role:** Top-of-page primary navigation

White pill-shaped container with 40px radius, floating above content with a subtle hairline border in #e0e0db. Contains logo lockup, nav links (Product, Resources with chevron dropdowns, Pricing, Request demo, Login) in #353241 at 16px Plus Jakarta 500, and a filled violet Get Started button on the right. The pill form is a signature — nav is never a full-bleed bar.

### Primary Action Button
**Role:** Filled CTA for highest-priority conversion

Background #592eff, white text, Plus Jakarta Sans 16px weight 500, padding 10px 20px, border-radius 8px. No border. The single chromatic filled button in the system.

### Ghost Action Button
**Role:** Secondary action with icon, paired with primary CTA

Transparent background, 1px #e0e0db border, #353241 text, 16px Plus Jakarta 500, padding 10px 20px, border-radius 8px. Icon prefix (e.g. play triangle) in #353241. Used for Watch demo, Learn more patterns.

### Learn More Ghost Link
**Role:** Textual entry point to feature detail

Underlined text link in #353241, Plus Jakarta 500 at 16px, no background, no border. Acts as the feature-card call-to-action when a filled button would over-weight the layout.

### Feature Card
**Role:** Three-up feature block in product sections

White background, 1px #e0e0db border, border-radius 40px, padding 32px. Contains a large rounded product-screenshot image at top, heading in #21164c at PolySans 700 28-32px, body in #353241 at 18px/1.6, and a Learn More ghost link at bottom. Cards are roomy and image-led.

### Product Showcase Frame
**Role:** Large hero/feature visual with painterly backdrop

Oversized rounded container (radius 40-64px) holding a screenshot of the product dashboard. Sits on top of an impressionist oil-painting background that bleeds in pastel swatches of #bcf2ff, #dfff9d, and #ffaae6. The painted backdrop is decorative-only and never appears behind text blocks.

### Squiggle Underline
**Role:** Decorative emphasis on key words in headlines

Hand-drawn wavy underline (SVG stroke) applied beneath one or two words in a display heading, filled in a pastel (#ffaae6 pink, #bcf2ff blue, or #dfff9d lime). The squiggle sits below the baseline and extends 4-8px past the word edges, giving an editorial, notebook-feel accent.

### Tag Badge
**Role:** Status, category, or filtering label

Stadium-pill (200px radius), small padding 6px 12px, transparent or very light fill, 1px chromatic border in #2ed6ff, #a2ea13, or #f843c2. Label text in matching chromatic at 14px Plus Jakarta 500. Used inline in copy and at the top of content cards.

### Logo Lockup
**Role:** Brand identity in nav and footer

Adora wordmark with a small abstract spiral/swirl icon prefix in #592eff. Icon is a single continuous curved line, wordmark is Plus Jakarta Sans 600 at 20px in #21164c.

### Social Proof Logo Strip
**Role:** Trust signal beneath hero

Centered horizontal row of partner logos (Linktree, Canva, Replit, Granola, Chess.com etc.) rendered in monochrome #353241, evenly distributed with consistent visual weight, no logo larger than 28px tall. Optional kicker text above in #5f5f69 14px uppercase.

### Input Field
**Role:** Text input for forms and search

White background, 1px #e0e0db border, border-radius 12px, padding 12px 16px. Placeholder text in #5f5f69. Focus state thickens border to 1.5px #592eff with no glow ring.

### Section Divider
**Role:** Structural break between content blocks

No visible rule — sections are separated by generous vertical spacing (80px section gap) and alternation between white canvas and painterly-wash backgrounds. Divider lines are reserved for inside cards and lists.

## Do's and Don'ts

### Do
- Use Electric Violet (#592eff) only for one filled CTA per viewport, plus active-link borders and selected badge strokes — never as a large background wash
- Set display headings at PolySans 700 in #21164c (Midnight Plum), not pure black, so the violet undertone links to the action color
- Apply -0.02em letter-spacing universally across all type sizes — it is the single typographic move that unifies PolySans and Plus Jakarta
- Use the 40px and 64px border-radii on cards and product frames — generous rounding is the system, not a 16px default
- Limit the pastel accents (#bcf2ff, #dfff9d, #ffaae6) to painterly backgrounds and squiggle underlines — they should never appear as solid button fills or large text colors
- Place hand-drawn squiggle underlines beneath 1-2 words in a display heading to add the editorial accent — never under body copy or UI labels
- Keep the floating nav as a white pill with 40px radius; never convert it to a full-bleed header bar

### Don't
- Do not use #592eff on text or as a page-background tint — it is an action color, not a brand wash
- Do not use #bcf2ff, #dfff9d, or #ffaae6 as filled button backgrounds or large text colors — they are decoration only
- Do not mix rounded buttons (8-12px) with sharp square cards — the system trusts large radius on containers and small radius on controls
- Do not set body text in pure #000000 — use #353241 so the neutral has a violet undertone that ties to the brand
- Do not add drop shadows to elevate cards — depth comes from white-on-white layering and generous radius, not shadow stacks
- Do not introduce a third display font or a serif — PolySans for headlines and Plus Jakarta for everything else is a closed pair
- Do not extend the painterly background behind text blocks — it belongs only behind product frames and image containers, never behind reading content

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Page Canvas | `#ffffff` | Primary page background, most reading surfaces |
| 1 | Elevated Card | `#ffffff` | Feature cards, product frame, nav pill, content panels |
| 2 | Recessed Surface | `#eeeeee` | Secondary button backgrounds, subtle alt bands |
| 3 | Atmospheric Wash | `#bcf2ff` | Painterly decorative background bleeding behind product frames |

## Imagery

The visual language mixes two distinct modes: (1) clean product-screenshot crops inside large rounded frames, always shown against a layered backdrop and never decorated with lifestyle context — the UI is the hero, and (2) impressionist oil-painting swatches in pastel sky blue, lime, and pink that bleed behind product frames as soft atmospheric washes. Illustrations are limited to hand-drawn squiggle SVG underlines beneath headline words. Icons in the product UI are thin-stroke line icons in #353241, 1.5px weight, geometric and functional. No photography, no 3D renders, no stock imagery. The painterly texture is a single repeating decorative asset, not a per-section illustration set.

## Layout

Max-width 1200px centered content column with a floating pill nav at the top. The hero is a centered text stack (headline, subhead, dual-button row) on white canvas with the product showcase frame directly below, extending full-bleed to the viewport edges so the painterly background can bleed past the container. Sections are vertically separated by ~80px gaps with no dividers. Feature blocks use a 3-column equal grid of feature cards with generous internal padding. The social proof band sits centered as a single horizontal logo strip with a small kicker above. Overall rhythm: open and spacious, with painterly color used as punctuation between otherwise quiet white bands.

## Agent Prompt Guide

## Quick Color Reference
- text: #353241 (body), #21164c (display headings), #5f5f69 (muted)
- background: #ffffff (canvas and cards), #eeeeee (recessed surfaces)
- border: #e0e0db (hairlines), #353241 (strong structural)
- accent: #592eff (action), #bcf2ff / #dfff9d / #ffaae6 (decorative pastels)
- primary action: #592eff (filled action)

## Example Component Prompts

1. **Hero with squiggle headline**
   Centered column on white #ffffff. Headline at 68px PolySans weight 700, color #21164c, letter-spacing -1.36px. Underline the last word with a wavy SVG stroke filled #ffaae6, 2px thick, extending 6px past the word on each side. Subhead at 18px Plus Jakarta 400, color #353241, line-height 1.6, max-width 640px. Two buttons centered with 8px gap: filled #592eff (white text, 8px radius, 10px 20px padding) and ghost with 1px #e0e0db border (#353241 text, 16px Plus Jakarta 500, play-icon prefix). 80px top and bottom padding.

2. **Feature Card**
   White #ffffff background, 1px #e0e0db border, border-radius 40px, padding 32px. Top: a product screenshot image with its own 26px border-radius. Heading at 28px PolySans 700 in #21164c, 16px below the image. Body at 18px Plus Jakarta 400 in #353241, line-height 1.6, 12px below heading. Learn More ghost link at the bottom in underlined #353241 16px Plus Jakarta 500.

3. **Floating Nav Pill**
   White #ffffff background, 1px #e0e0db border, border-radius 40px, horizontal padding 20px, height ~56px, centered at the top with a 16px gap below. Left: logo (spiral icon in #592eff + Adora wordmark in #21164c, Plus Jakarta 600 20px). Center: nav items in #353241 16px Plus Jakarta 500, 24px gap between items, chevron after Product and Resources. Right: filled #592eff Get started button (white text, 8px radius, 10px 20px padding).

4. **Product Showcase Frame**
   Full-bleed painterly background using #bcf2ff, #dfff9d, and #ffaae6 as soft blended swatches (use a background image or layered divs with 200px+ radius). Centered white frame at max-width 1100px, border-radius 64px, overflow hidden, containing a product dashboard screenshot at 12px padding inset. No border, no shadow.

5. **Stadium Badge Tag**
   Transparent background, 1px border in #2ed6ff (or #a2ea13 / #f843c2), border-radius 200px, padding 6px 12px. Label text 14px Plus Jakarta 500 in the same chromatic color as the border. Inline placement beside headings or in card headers.

## Color Behavior Rules

The system runs on restraint: the page is ~87% achromatic (whites, the #353241/#21164c text neutrals, and #e0e0db hairlines). The single saturated chromatic — Electric Violet #592eff — is rationed to one filled CTA per viewport and a few active states. Pastel tones (#bcf2ff sky, #dfff9d lime, #ffaae6 pink) appear as decorative confetti only: painterly backdrops, squiggle underlines, and the occasional card surface variation. They never become button fills, text colors, or large structural shapes. The vivid badge colors (#2ed6ff, #a2ea13, #f843c2) are likewise confined to tag outlines and small icon accents. This hierarchy — neutral → violet action → pastel decoration — is what makes the interface feel calm with one sharp accent.

## Elevation Philosophy

Adora avoids drop shadows almost entirely. Elevation is achieved through three moves only: (1) a 1px #e0e0db hairline border to separate a card from the canvas, (2) generous border-radius (40-64px) to make surfaces feel soft rather than boxy, and (3) layered white-on-white for nav pills and modal-like overlays. When shadows do appear, they are extremely soft and low-opacity (rgba neutrals at 4-8%) to add the barest hint of lift without competing with the painterly decoration. Never use heavy multi-stop shadow stacks.

## Similar Brands

- **Linear** — Same tight -0.02em letter-spacing, same 8px button radius paired with generous card rounding, and the same discipline of using a single saturated brand color against a near-monochrome neutral palette
- **Framer** — Same floating pill nav pattern, same painterly gradient washes behind product screenshots, and the same hand-drawn squiggle accents under display headlines
- **Pitch** — Same custom-display + geometric-body font pairing, same generous card radii, and the same preference for bold violet/navy as the primary text color over pure black
- **Arc** — Same commitment to a single vivid chromatic action color against a white-and-neutral canvas, with decorative color appearing only as small confetti accents
- **Raycast** — Same 40px-range card radii, same 8px control radius, and the same quiet surface treatment where depth comes from layering and rounding rather than shadow

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-electric-violet: #592eff;
  --color-midnight-plum: #21164c;
  --color-obsidian-charcoal: #353241;
  --color-slate-smoke: #5f5f69;
  --color-pearl-mist: #e0e0db;
  --color-soft-concrete: #eeeeee;
  --color-pure-white: #ffffff;
  --color-sky-tint: #bcf2ff;
  --color-lime-spritz: #dfff9d;
  --color-cotton-candy: #ffaae6;
  --color-neon-cyan: #2ed6ff;
  --color-lime-pop: #a2ea13;
  --color-magenta-pulse: #f843c2;

  /* Typography — Font Families */
  --font-polysans: 'PolySans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-plus-jakarta-sans: 'Plus Jakarta Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.6;
  --tracking-caption: -0.28px;
  --text-body-sm: 16px;
  --leading-body-sm: 1.6;
  --tracking-body-sm: -0.32px;
  --text-body: 18px;
  --leading-body: 1.6;
  --tracking-body: -0.36px;
  --text-subheading: 20px;
  --leading-subheading: 1.6;
  --tracking-subheading: -0.4px;
  --text-heading-sm: 32px;
  --leading-heading-sm: 1.1;
  --tracking-heading-sm: -0.64px;
  --text-heading: 38px;
  --leading-heading: 1.1;
  --tracking-heading: -0.76px;
  --text-heading-lg: 58px;
  --leading-heading-lg: 1.1;
  --tracking-heading-lg: -1.16px;
  --text-display: 68px;
  --leading-display: 1.1;
  --tracking-display: -1.36px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
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
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-60: 60px;
  --spacing-100: 100px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 32px;
  --element-gap: 12px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-2xl-2: 20px;
  --radius-3xl: 26px;
  --radius-3xl-2: 30px;
  --radius-3xl-3: 40px;
  --radius-full: 48px;
  --radius-full-2: 64px;
  --radius-full-3: 200px;
  --radius-full-4: 800px;

  /* Named Radii */
  --radius-cards: 40px;
  --radius-badges: 200px;
  --radius-buttons: 8px;
  --radius-navpill: 40px;
  --radius-productframe: 64px;

  /* Surfaces */
  --surface-page-canvas: #ffffff;
  --surface-elevated-card: #ffffff;
  --surface-recessed-surface: #eeeeee;
  --surface-atmospheric-wash: #bcf2ff;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-electric-violet: #592eff;
  --color-midnight-plum: #21164c;
  --color-obsidian-charcoal: #353241;
  --color-slate-smoke: #5f5f69;
  --color-pearl-mist: #e0e0db;
  --color-soft-concrete: #eeeeee;
  --color-pure-white: #ffffff;
  --color-sky-tint: #bcf2ff;
  --color-lime-spritz: #dfff9d;
  --color-cotton-candy: #ffaae6;
  --color-neon-cyan: #2ed6ff;
  --color-lime-pop: #a2ea13;
  --color-magenta-pulse: #f843c2;

  /* Typography */
  --font-polysans: 'PolySans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-plus-jakarta-sans: 'Plus Jakarta Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.6;
  --tracking-caption: -0.28px;
  --text-body-sm: 16px;
  --leading-body-sm: 1.6;
  --tracking-body-sm: -0.32px;
  --text-body: 18px;
  --leading-body: 1.6;
  --tracking-body: -0.36px;
  --text-subheading: 20px;
  --leading-subheading: 1.6;
  --tracking-subheading: -0.4px;
  --text-heading-sm: 32px;
  --leading-heading-sm: 1.1;
  --tracking-heading-sm: -0.64px;
  --text-heading: 38px;
  --leading-heading: 1.1;
  --tracking-heading: -0.76px;
  --text-heading-lg: 58px;
  --leading-heading-lg: 1.1;
  --tracking-heading-lg: -1.16px;
  --text-display: 68px;
  --leading-display: 1.1;
  --tracking-display: -1.36px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-60: 60px;
  --spacing-100: 100px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-2xl-2: 20px;
  --radius-3xl: 26px;
  --radius-3xl-2: 30px;
  --radius-3xl-3: 40px;
  --radius-full: 48px;
  --radius-full-2: 64px;
  --radius-full-3: 200px;
  --radius-full-4: 800px;
}
```
