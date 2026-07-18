# WhatsApp.com — Style Reference
> sunlit coffee shop conversation

**Theme:** light

WhatsApp's site reads like a warm, human messaging app brought to a marketing canvas: a soft cream backdrop (#fcf5eb) carries the entire page, letting large full-bleed photography and oversized typography do the talking while a single vivid green (#25d366) punctuates every action. The type system is deliberately dramatic — a custom display face scales to 80px hero headlines — balanced by a quiet 16px body that stays out of the way. Components are generous and soft: pill-shaped buttons at 50px radius, generously rounded image cards at 25px, and minimal use of borders or shadows. The color palette is ruthlessly restrained — one chromatic brand color, one link blue, and a near-black text color over cream — making every green CTA feel like a deliberate act of invitation rather than noise. The overall feel is less 'SaaS product page' and more 'sunlit conversation' — warm tones, organic photo crops, chat bubbles floating freely, and nothing chrome-like or angular.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| WhatsApp Green | `#25d366` | `--color-whatsapp-green` | Primary CTA buttons, active state highlights, and the singular chromatic accent across the entire system — used sparingly to make every action feel like a deliberate invitation rather than a recurring brand color |
| Link Blue | `#0373e9` | `--color-link-blue` | Blue accent for outlined action borders, linked labels, and lightweight interactive emphasis. |
| Charcoal | `#1c1e21` | `--color-charcoal` | High-contrast neutral action fill for primary buttons on light surfaces. |
| Ink Black | `#111b21` | `--color-ink-black` | Deepest text and icon color, input borders, icon strokes — slightly darker than Charcoal for elements that need maximum weight or definition |
| Cream Canvas | `#fcf5eb` | `--color-cream-canvas` | Page background across all sections — warm off-white that gives the entire site its sunlit, approachable atmosphere instead of stark pure white |
| Pure White | `#ffffff` | `--color-pure-white` | Card surfaces, button fills for outlined variants, nav background, and chat-bubble fills — the elevated surface layer sitting on the cream canvas |
| Warm Gray | `#5e5e5e` | `--color-warm-gray` | Secondary/muted body text and subtle borders — used for helper text, disclaimers, and de-emphasized labels |
| Pale Blue Wash | `#f0f4f9` | `--color-pale-blue-wash` | Hairline borders, dividers, input outlines, and card edges on light surfaces. Do not promote it to the primary CTA color |

## Tokens — Typography

### WhatsApp Sans Var — Sole typeface across the entire system — body text and UI at 400, headlines and display at 700. The display sizes reaching 80px are uncommonly large for a product marketing site and create a magazine-like confidence. Custom font so no exact substitute, but Inter or Söhne are close fallback options · `--font-whatsapp-sans-var`
- **Substitute:** Inter
- **Weights:** 400, 700
- **Sizes:** 12px, 16px, 18px, 48px, 60px, 80px
- **Line height:** 1.10–1.39
- **Letter spacing:** normal
- **Role:** Sole typeface across the entire system — body text and UI at 400, headlines and display at 700. The display sizes reaching 80px are uncommonly large for a product marketing site and create a magazine-like confidence. Custom font so no exact substitute, but Inter or Söhne are close fallback options

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.38 | — | `--text-caption` |
| body | 16px | 1.34 | — | `--text-body` |
| body-lg | 18px | 1.39 | — | `--text-body-lg` |
| heading-sm | 48px | 1.2 | — | `--text-heading-sm` |
| heading | 60px | 1.1 | — | `--text-heading` |
| display | 80px | 1 | — | `--text-display` |

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
| 56 | 56px | `--spacing-56` |
| 88 | 88px | `--spacing-88` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 16px |
| small | 8px |
| images | 25px |
| inputs | 50px |
| buttons | 50px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 120-160px
- **Card padding:** 32px
- **Element gap:** 16-24px

## Components

### Primary CTA Button (Pill)
**Role:** Main download and action button — the sole filled button in the system

50px border-radius (full pill), 16px vertical / 28px horizontal padding, #25d366 background, white text at 16px weight 700. Compact vertical padding of ~10-12px with generous horizontal padding makes it feel like a friendly capsule, not a corporate rectangle. Appears with a small download icon (↓) adjacent to label.

### Ghost Nav Button (Log In)
**Role:** Secondary navigation action in the header

50px border-radius, 14-16px vertical / 24-28px horizontal padding, transparent background with a thin 1px #1c1e21 border, dark text at 16px weight 400. Includes a right-arrow chevron icon. Reads as a secondary action — present but understated against the green primary CTA.

### Inline Link with Arrow
**Role:** 'Learn more' affordance in feature sections

No button chrome — 16-18px text in #0373e9 at weight 400, underlined, followed by a right-arrow (›) icon in the same blue. Underline on the text portion only. Sits inline within body copy, not as a standalone button element.

### Chat Bubble (Incoming)
**Role:** Decorative UI element showing message flow

White (#ffffff) background, 8px border-radius on outer corners with 2px on the tail corner, Charcoal (#1c1e21) text at 12-14px, small timestamp in Warm Gray at 11px right-aligned. Float freely on the cream canvas as part of atmospheric layouts. Tail points toward the sender.

### Chat Bubble (Outgoing)
**Role:** Decorative UI element for the user's own messages

Light green (#d9fdd3) background matching the WhatsApp app, 8px border-radius, dark text. Tails on the right side. Used to visually communicate two-way conversation in hero and feature sections.

### Feature Image Card (Rounded)
**Role:** Full-bleed photo in feature sections

25px border-radius on photographic content, no border or shadow — the rounded shape alone separates the image from the cream canvas. Images bleed edge-to-edge within the radius. No padding inside the card — the photo fills the shape.

### Phone Mockup Container
**Role:** Vertical phone-shaped visual frame for app screenshots

Tall portrait container with 25px border-radius, containing a full-bleed app screenshot. Includes a subtle location pin badge at the bottom ('Pebble Beach') in a small pill. No shadow — relies on the warm cream background to make the shape float.

### Group Avatar Stack
**Role:** Small circular avatar cluster for group chat UI

Three to four overlapping circular profile images, each 32-40px diameter with 2px white border to create separation between overlapping circles. Accompanied by '& 4 others' text in small Charcoal type.

### Group Join Badge
**Role:** Small green pill indicating group membership action

50px border-radius, #25d366 background, white text at 12px weight 400, compact 4-8px padding. Includes a small group icon to the left of the label ('Join'). Sits as an overlay element on hero/group imagery.

### Navigation Bar (Header)
**Role:** Top-level site navigation

Sits on white (#ffffff) background with 20px horizontal padding per nav item, 18px vertical spacing. Logo (WhatsApp wordmark + green phone icon) on the left, nav links centered or left-aligned (Features, Privacy, Help Center, Blog, For Business, Apps), Ghost Log In button and Green Download CTA on the right. Clean horizontal rule or no border — separation is achieved through the white-on-cream contrast.

## Do's and Don'ts

### Do
- Use #25d366 only for the single primary CTA per viewport — never two competing green buttons on the same screen
- Set display headlines at 48-80px weight 700 — undersized headlines break the magazine-scale confidence of the type system
- Use 50px border-radius for all buttons and tags — the pill shape is core to the friendly, approachable feel
- Let the cream #fcf5eb canvas show through generously — do not tile white cards over the entire page; cream is a design choice, not a fallback
- Use 25px border-radius on all imagery and phone mockups — generous rounding matches the softness of the pill buttons
- Keep #0373e9 exclusively for inline text links — never use it as a background fill or icon color to maintain CTA hierarchy
- Pair body text at 16px with line-height 1.34-1.39 — the slightly generous leading is part of the relaxed reading rhythm

### Don't
- Do not use #25d366 for non-action elements like icons, illustrations, or decorative shapes — it must remain a signal for clickable actions only
- Do not introduce new chromatic colors — the 2% colorfulness is deliberate restraint, not an oversight
- Do not use sharp corners (0-4px radius) on any interactive element — angular geometry contradicts the conversational warmth
- Do not add drop shadows to cards or images — the system relies on the warm cream canvas to create depth through contrast, not elevation
- Do not set headlines below 48px — the 60-80px display scale is a signature choice; anything smaller reads as apologetic
- Do not use #000000 for text — #1c1e21 and #111b21 are the system's true blacks and carry a slightly warmer tone that matches the cream background
- Do not stack the cream canvas behind a white card on white card — the warm backdrop should be visible to anchor each section

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Cream Canvas | `#fcf5eb` | Base page background spanning the full viewport |
| 2 | Pure White | `#ffffff` | Card surfaces, chat bubbles, and elevated panels on top of the cream canvas |
| 3 | Pale Blue | `#f0f4f9` | Input fields and interactive surface differentiation |

## Elevation

This design system intentionally avoids drop shadows and box-shadow elevation. Depth is created entirely through surface contrast: the cream canvas (#fcf5eb) reads as recessed, white cards and chat bubbles (#ffffff) float above it, and photographic content sits at the topmost layer. The only 'elevation' cue is the natural shadow cast by full-bleed photography against the cream, which is provided by the image content itself rather than CSS. Components rely on border-radius and color contrast alone to distinguish themselves — no shadow tokens exist in the system.

## Imagery

Full-bleed editorial photography dominates the visual language: warm, natural-light portraits of people using phones in real settings (street markets, cafes, outdoors). No studio shots, no staged product photography — the images feel candid and human, often with golden-hour or dappled light. Photo treatment is natural color with no filters or duotones. Chat bubbles, avatar stacks, and group join badges float over the photography as native UI overlays rather than separate mockup elements. The phone mockup in feature sections shows actual app screens with a location badge overlay. No illustration system — everything is photographic or native UI. Iconography is minimal: a small green phone-receiver mark in the logo, download arrows in CTAs, and right-chevrons in ghost buttons. The overall image-to-text ratio is high in the hero (60/40 visual) and balanced in feature sections (50/50).

## Layout

Full-bleed hero with a massive photographic background image and overlaid headline/CTA stack, transitioning to generous vertical whitespace on the cream canvas for feature sections. Max content width of ~1200px centered, with sections using 120-160px vertical gaps to create breathing room. Hero is a full-viewport image with text anchored to the left third and chat-bubble UI floating on the right. Feature sections alternate between centered headline blocks (with floating chat-bubble constellations) and asymmetric two-column layouts (image-left, text-right). Navigation is a clean top bar: logo left, nav links center-left, Log In ghost button + green Download CTA right. No sidebar, no mega-menu, no sticky behavior beyond the header. The page flows top-to-bottom in a single column with alternating photographic and text-driven sections, never splitting into complex grid systems.

## Agent Prompt Guide

**Quick Color Reference**
- text: #1c1e21
- background: #fcf5eb (cream canvas) / #ffffff (card surfaces)
- border: #1c1e21 (dark borders) / #f0f4f9 (soft dividers)
- accent: #0373e9 (link blue)
- primary action: #25d366 (filled action)

**3-5 Example Component Prompts**
1. Create a hero section: cream #fcf5eb page background. Headline at 80px WhatsApp Sans Var weight 700, #1c1e21, line-height 1.0. Subtext at 18px weight 400, #1c1e21, line-height 1.39. Green CTA button: #25d366 fill, white text at 16px weight 700, 50px radius, 12px 28px padding, with a small download arrow icon.

2. Create a ghost nav button: transparent background, 1px #1c1e21 border, #1c1e21 text at 16px weight 400, 50px radius, 10px 24px padding, with a right-chevron (›) icon at the end of the label.

3. Create an inline text link: 18px weight 400, #0373e9 color, underlined, followed by a #0373e9 right-arrow (›) at the same size. Sits inline within body copy — no button chrome.

4. Create a feature image card: full-bleed photograph inside a 25px-radius container, no border, no shadow, no internal padding. The photo fills the rounded shape edge-to-edge. Sits on the cream #fcf5eb canvas with 32px card padding to text content beside it.

5. Create a chat-bubble overlay (incoming): white #ffffff background, 8px border-radius (2px on the tail corner), #1c1e21 text at 14px, timestamp at 11px in #5e5e5e right-aligned. Tail points left. Floats freely over photographic or cream backgrounds as a decorative UI element.

## Type Scale Philosophy

WhatsApp's type system is defined by extreme scale contrast: 80px display headlines sit next to 16px body text — a 5x size jump that most design systems would consider too dramatic. This is deliberate. The custom variable font (WhatsApp Sans Var) supports a wide weight range, and the system uses only two weights (400 for body/UI, 700 for display) to keep decisions binary. The 1.0-1.1 line-heights on display sizes are aggressive — the type is meant to fill space confidently, not breathe politely. Body text at 1.34-1.39 is the only place the system relaxes. No italic, no light weight, no condensed variant. If a screen needs hierarchy beyond size, it gets it from color (Charcoal vs Warm Gray) or the single chromatic accent, never from typographic ornamentation.

## Similar Brands

- **Apple Product Pages** — Same full-bleed editorial photography with oversized centered headlines on warm backgrounds, same extreme display-vs-body type contrast, same restraint to a single accent color per page
- **Headspace** — Warm cream/off-white canvas, generous whitespace, soft rounded shapes, and a single saturated brand color used only for primary actions
- **Duolingo** — Playful brand identity expressed through large-scale custom typography, pill-shaped buttons, and a vivid single-color accent over warm neutral backgrounds
- **Notion** — Minimal component vocabulary with generous spacing, soft rounded corners on imagery, and a near-monochrome palette that lets content and photography carry the visual weight

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-whatsapp-green: #25d366;
  --color-link-blue: #0373e9;
  --color-charcoal: #1c1e21;
  --color-ink-black: #111b21;
  --color-cream-canvas: #fcf5eb;
  --color-pure-white: #ffffff;
  --color-warm-gray: #5e5e5e;
  --color-pale-blue-wash: #f0f4f9;

  /* Typography — Font Families */
  --font-whatsapp-sans-var: 'WhatsApp Sans Var', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.38;
  --text-body: 16px;
  --leading-body: 1.34;
  --text-body-lg: 18px;
  --leading-body-lg: 1.39;
  --text-heading-sm: 48px;
  --leading-heading-sm: 1.2;
  --text-heading: 60px;
  --leading-heading: 1.1;
  --text-display: 80px;
  --leading-display: 1;

  /* Typography — Weights */
  --font-weight-regular: 400;
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
  --spacing-56: 56px;
  --spacing-88: 88px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 120-160px;
  --card-padding: 32px;
  --element-gap: 16-24px;

  /* Border Radius */
  --radius-3xl: 25px;
  --radius-full: 50px;

  /* Named Radii */
  --radius-cards: 16px;
  --radius-small: 8px;
  --radius-images: 25px;
  --radius-inputs: 50px;
  --radius-buttons: 50px;

  /* Surfaces */
  --surface-cream-canvas: #fcf5eb;
  --surface-pure-white: #ffffff;
  --surface-pale-blue: #f0f4f9;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-whatsapp-green: #25d366;
  --color-link-blue: #0373e9;
  --color-charcoal: #1c1e21;
  --color-ink-black: #111b21;
  --color-cream-canvas: #fcf5eb;
  --color-pure-white: #ffffff;
  --color-warm-gray: #5e5e5e;
  --color-pale-blue-wash: #f0f4f9;

  /* Typography */
  --font-whatsapp-sans-var: 'WhatsApp Sans Var', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.38;
  --text-body: 16px;
  --leading-body: 1.34;
  --text-body-lg: 18px;
  --leading-body-lg: 1.39;
  --text-heading-sm: 48px;
  --leading-heading-sm: 1.2;
  --text-heading: 60px;
  --leading-heading: 1.1;
  --text-display: 80px;
  --leading-display: 1;

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
  --spacing-56: 56px;
  --spacing-88: 88px;

  /* Border Radius */
  --radius-3xl: 25px;
  --radius-full: 50px;
}
```
