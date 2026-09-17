# Playdate — Style Reference
> A yellow Game Boy under museum lights. Playdate's whole identity is that single bright product held against neutral gray, with one violet spark doing all the interactive work.

**Theme:** mixed

Playdate reads like a sunlit toy-store catalog: saturated yellow bands alternate with cool gray and white sections, each one a stage for the bright handheld itself. A single violet accent does all the talking — buttons, links, the nav buy-pill — while the rest of the UI stays quiet on warm charcoal text and bone-white cards. Roobert carries the tone: an oversized lowercase wordmark in sunflower yellow is the brand's signature, body copy sits at a confident 22px in a humanist geometric, and line-height is generous enough to feel handmade. Components are intentionally weightless: 2.85px corners on game cards, no decorative borders, and CTAs that float as purple pills with soft drop-shadows. The rhythm is full-bleed sections stacked vertically, each one swapping palette so the page reads like a printed product brochure rather than a typical SaaS landing.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Sunbeam Yellow | `#ffc500` | `--color-sunbeam-yellow` | Section backgrounds, the product itself, display wordmarks — the page's primary brand canvas and the loudest single color in the system |
| Electric Violet | `linear-gradient(180deg, rgb(148, 0, 255), rgb(92, 0, 255))` | `--color-electric-violet` | Violet supporting accent for decorative details and low-frequency emphasis. Do not promote it to the primary CTA color |
| Carbon | `#312f27` | `--color-carbon` | Body text, heading text, icon strokes, form labels — a warm near-black chosen over pure #000 to sit comfortably against yellow and white without vibrating |
| Paper White | `#ffffff` | `--color-paper-white` | Card surfaces, text on violet buttons, text on dark bands — the default light surface |
| Slate Gray | `#788086` | `--color-slate-gray` | Hero section background — a desaturated mid-gray that lets the yellow product pop without competing with it |
| Fog | `#efefef` | `--color-fog` | Light alternate surface, input fill on white sections, subtle dividers |
| Sand | `#e9e4d9` | `--color-sand` | Input backgrounds, callout bubbles, warm light surface — bridges between the cool neutrals and the yellow brand |
| Ash | `#b1afa7` | `--color-ash` | Muted helper text, secondary borders, subdued metadata — the quietest visible neutral |

## Tokens — Typography

### Roobert — Sole typeface across the system — a humanist geometric that handles the 68px 'playdate' wordmark and 22px body copy in the same family. Weight 400 carries UI and running text; weight 700/800 anchors display words, prices, and CTAs. The custom -0.007em tracking is applied globally so even body text sits a touch tighter than system defaults. · `--font-roobert`
- **Substitute:** Manrope, Inter, or DM Sans at matching weights
- **Weights:** 400, 700, 800
- **Sizes:** 19, 21, 22, 24, 29, 33, 34, 40, 51, 57, 68
- **Line height:** 1.0–2.0 (display 1.0, body 1.3, generous blocks 2.0)
- **Letter spacing:** -0.0070em
- **Role:** Sole typeface across the system — a humanist geometric that handles the 68px 'playdate' wordmark and 22px body copy in the same family. Weight 400 carries UI and running text; weight 700/800 anchors display words, prices, and CTAs. The custom -0.007em tracking is applied globally so even body text sits a touch tighter than system defaults.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 19px | 25 | -0.13px | `--text-caption` |
| body-sm | 21px | 27 | -0.15px | `--text-body-sm` |
| subheading | 24px | 29 | -0.17px | `--text-subheading` |
| heading-sm | 29px | 35 | -0.2px | `--text-heading-sm` |
| heading | 34px | 41 | -0.24px | `--text-heading` |
| heading-lg | 40px | 44 | -0.28px | `--text-heading-lg` |
| display | 51px | 56 | -0.36px | `--text-display` |
| display-lg | 57px | 63 | -0.4px | `--text-display-lg` |
| hero | 68px | 68 | -0.48px | `--text-hero` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 12 | 12px | `--spacing-12` |
| 20 | 20px | `--spacing-20` |
| 24 | 24px | `--spacing-24` |
| 28 | 28px | `--spacing-28` |
| 40 | 40px | `--spacing-40` |
| 60 | 60px | `--spacing-60` |
| 100 | 100px | `--spacing-100` |
| 120 | 120px | `--spacing-120` |
| 232 | 232px | `--spacing-232` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 28.5px |
| cards | 2.85px |
| inputs | 6px |
| buttons | 28.5px |
| navButtons | 22px |
| heroButtons | 34.2px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 60px
- **Card padding:** 24px
- **Element gap:** 11-19px

## Components

### Primary CTA Pill (Order Now)
**Role:** Main purchase action on hero and landing sections

Violet #7700ff background, white text, 28-34px border-radius (fully pill-shaped), 14px 28px padding, 21-22px Roobert weight 700, subtle 0 2px 8px rgba(0,0,0,0.15) drop shadow. The shadow lifts the pill off whatever section color it sits on — yellow, white, or gray — without darkening the page.

### Nav Buy Pill (Buy Now)
**Role:** Persistent purchase action in the top navigation

Compact version of the primary CTA: violet #7700ff fill, white text, 22px radius, 8px 16px padding, 19-21px Roobert weight 700. Sits in the rightmost nav slot on a light background.

### Game Card
**Role:** Individual game tile in the seasonal showcase grid

White #ffffff surface, 2.85px border-radius (almost square — the 1-bit game art fills edge-to-edge), no border, no shadow. Aspect ratio follows the source art; 3 columns on desktop, stacking to 1 column on mobile.

### Yellow Section Band
**Role:** Full-bleed content section with the brand yellow as canvas

#ffc500 fills the full viewport width with no internal border. Body text inside reverts to Carbon #312f27. Used for the 'We made Playdate just for fun' wordmark band and the game showcase section.

### Hero Display Wordmark
**Role:** Headline-scale brand statement on the landing hero

Renders 'playdate' in lowercase Roobert at 68px, weight 800, line-height 1.0, color Sunbeam Yellow #ffc500 on the gray hero. Fills nearly the full content width; the lowercase + extra-bold combo is the brand's most recognizable typographic moment.

### Hero Subhead
**Role:** White-text tagline under the hero product image

34-40px Roobert weight 700, color #ffffff, sits on the Slate Gray #788086 hero band. One line, sentence-case, no punctuation — the band itself carries the weight.

### Inline Body Copy
**Role:** Standard running paragraph text on yellow and white sections

22px Roobert weight 400, line-height ~1.3, color Carbon #312f27. Paragraphs are short (2-3 sentences), centered or left-aligned to a ~640px measure.

### Inline Link
**Role:** In-prose hyperlinks and emphasized phrases

Electric Violet #7700ff at body weight 400, no underline at rest, underline appears on hover. Used sparingly — most emphasis is achieved through weight changes instead.

### Speech-Bubble Callout
**Role:** Conversational annotation boxes (e.g. 'Wait! No spoilers, please!')

Light Sand #e9e4d9 fill, Carbon #312f27 text, 6-10px border-radius, small triangular tail. 19-21px Roobert weight 400, bold spans inside for emphasis. Acts as a playful UI voice — the only place where the warm neutral appears as a fill.

### Input Field
**Role:** Form input on light and yellow sections

Fog #efefef or Sand #e9e4d9 background, 6px border-radius, 1px subtle border, Carbon text. Padding ~12px 16px, 21px Roobert. No visible focus ring color — focus state uses a 2px violet outline.

### Top Navigation Bar
**Role:** Persistent site navigation

Sits at top of every page. Left: white 'playdate' wordmark in Roobert weight 700. Center/right: icon-prefixed text links in Carbon, evenly spaced. Far right: the violet Buy Now pill. No background fill — the nav is transparent over whatever section color is behind it.

### Footer
**Role:** Bottom-of-page utility links and brand mark

Full-width band, typically Carbon or violet background depending on the previous section. White or violet text, small 19px Roobert, grouped links separated by thin dividers.

## Do's and Don'ts

### Do
- Use Electric Violet #7700ff exclusively for interactive elements — buttons, links, and the nav pill. Never apply it to body text or decorative shapes.
- Apply 28-34px pill radii to all primary CTAs; use 2.85px for game cards and content tiles. These two radius values define the system's contrast between bold action and quiet content.
- Render the brand wordmark 'playdate' in lowercase Roobert at display sizes (51-68px), weight 800, in Sunbeam Yellow on neutral backgrounds.
- Set body copy at 22px Roobert weight 400 in Carbon #312f27 with line-height ~1.3. Apply the global -0.007em tracking to all Roobert usage.
- Alternate section backgrounds vertically: Slate Gray hero → yellow band → white band → yellow band. Each section is full-bleed with no borders between them.
- Use Sunbeam Yellow #ffc500 as a full-bleed section background, never as a small accent fill on a card or button.
- Keep game cards flat and borderless — the 1-bit game art is the content; adding shadows or borders would compete with it.

### Don't
- Don't use Electric Violet for body text, headings, or background fills larger than a button — its role is interactive punctuation, not chrome.
- Don't apply heavy drop shadows to cards, images, or text. The single 0 2px 8px rgba(0,0,0,0.15) belongs only on CTA pills.
- Don't mix in additional accent hues. The system is intentionally bichromatic (yellow + violet) on a warm-neutral base.
- Don't use pure #000000 for text — Carbon #312f27 is warmer and sits correctly on both yellow and white without edge vibration.
- Don't render the brand wordmark in uppercase, serif, or non-Roobert faces. The lowercase geometric is the signature.
- Don't add borders or backgrounds to game cards. The 2.85px radius alone is the only frame the art needs.
- Don't apply letter-spacing wider than the global -0.007em — the type is designed tight, and opening it up breaks the geometric rhythm.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Slate Gray Hero Canvas | `#788086` | Full-bleed hero section background, lets the yellow product and white text read with maximum contrast |
| 2 | Sunbeam Yellow Band | `#ffc500` | Primary brand section background, alternates with white bands to create a catalog-style rhythm |
| 3 | Paper White Card | `#ffffff` | Card surfaces on yellow and gray backgrounds — the lightest surface, used for game tiles and content blocks |
| 4 | Sand Callout | `#e9e4d9` | Warm neutral fill for speech-bubble annotations and softer content surfaces |
| 5 | Fog Alternate | `#efefef` | Coolest neutral, used for input fills and the most recessed surface treatment |

## Elevation

- **Primary CTA Pill:** `0 2px 8px rgba(0, 0, 0, 0.15)`
- **Nav Buy Pill:** `0 1px 4px rgba(0, 0, 0, 0.2)`

## Imagery

Product photography dominates: the yellow handheld is shot on a neutral gray background, framed large and centered, with no lifestyle context — the object itself is the hero. Game showcase cards use high-contrast 1-bit black-and-white pixel art at native resolution, giving a deliberately retro/Game Boy feel. The device appears as both a photograph and a 3D render (you can see the smooth shading and crisp edges on the hero shot), with the crank handle and button details rendered in vector-clean precision. No lifestyle photography, no human subjects, no environmental scenes — the visual language is 'product on a stage' across the board. Icon style is minimal mono-stroke line icons in nav (search, games, dev, education, help, sign-in) at 1.5-2px stroke weight.

## Layout

Full-bleed vertical sections, each one swapping background color (Slate Gray → Sunbeam Yellow → Paper White → Sunbeam Yellow). The hero is a centered stack: product image at the visual center, white subhead beneath, then the page scrolls into the giant yellow 'playdate' wordmark with a violet order pill directly below it. Content max-width sits around 1200px, centered. The game showcase uses a strict 3-column card grid (3×3 visible) with no gutters between cards — they tile edge-to-edge as a single image wall. Body paragraphs are centered or left-aligned to a ~640px measure within the wider container. Navigation is a thin transparent top bar, not a heavy header. No sticky elements, no sidebars, no mega-menus — the layout is brochure-flat from top to bottom.

## Agent Prompt Guide

**Quick Color Reference**
- text: #312f27 (Carbon)
- background: #ffc500 (yellow bands) / #ffffff (cards) / #788086 (hero gray)
- border: #b1afa7 (Ash, muted dividers only)
- accent: #7700ff (Electric Violet)
- primary action: no distinct CTA color
- font: Roobert (substitute: Manrope or Inter), weights 400/700/800, global -0.007em tracking

**Example Component Prompts**
No distinct primary action color was observed; use the extracted neutral button treatments instead of inventing a filled CTA color.
2. **Game showcase card** — White #ffffff surface, 2.85px border-radius, no border, no shadow. The 1-bit black-and-white game art fills edge-to-edge. Tile 3 across with no gutter.
3. **Hero display wordmark** — 'playdate' in lowercase Roobert at 68px, weight 800, line-height 1.0, color #ffc500. Sits on a #788086 gray background.
4. **Speech-bubble callout** — #e9e4d9 fill, #312f27 text, 6-10px border-radius, small triangular tail pointing to the subject. 19-21px Roobert weight 400 with bold spans for emphasized words.
5. **Section background band** — Full-bleed #ffc500 yellow with no internal borders. 60px vertical padding. Body text inside is #312f27 at 22px, centered or left-aligned to ~640px.

## Similar Brands

- **Teenage Engineering** — Same playful colored product-as-hero approach, with bold lowercase wordmarks, generous whitespace, and bichromatic product photography on neutral backgrounds
- **Analogue** — Retro gaming hardware presentation — the device floats on a neutral stage, with sparse UI and 1-bit-era visual references in supporting artwork
- **Nothing (nothing.tech)** — Bichromatic brand identity built on a single vivid accent color against monochrome surfaces, with confident display type and minimal chrome
- **Bored Ape / Yuga Labs** — Yellow-and-purple playful tech branding, oversized lowercase display type, and an overall toy-aisle energy applied to a digital product

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-sunbeam-yellow: #ffc500;
  --color-electric-violet: #7700ff;
  --gradient-electric-violet: linear-gradient(180deg, rgb(148, 0, 255), rgb(92, 0, 255));
  --color-carbon: #312f27;
  --color-paper-white: #ffffff;
  --color-slate-gray: #788086;
  --color-fog: #efefef;
  --color-sand: #e9e4d9;
  --color-ash: #b1afa7;

  /* Typography — Font Families */
  --font-roobert: 'Roobert', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 19px;
  --leading-caption: 25;
  --tracking-caption: -0.13px;
  --text-body-sm: 21px;
  --leading-body-sm: 27;
  --tracking-body-sm: -0.15px;
  --text-subheading: 24px;
  --leading-subheading: 29;
  --tracking-subheading: -0.17px;
  --text-heading-sm: 29px;
  --leading-heading-sm: 35;
  --tracking-heading-sm: -0.2px;
  --text-heading: 34px;
  --leading-heading: 41;
  --tracking-heading: -0.24px;
  --text-heading-lg: 40px;
  --leading-heading-lg: 44;
  --tracking-heading-lg: -0.28px;
  --text-display: 51px;
  --leading-display: 56;
  --tracking-display: -0.36px;
  --text-display-lg: 57px;
  --leading-display-lg: 63;
  --tracking-display-lg: -0.4px;
  --text-hero: 68px;
  --leading-hero: 68;
  --tracking-hero: -0.48px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-bold: 700;
  --font-weight-extrabold: 800;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-12: 12px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-28: 28px;
  --spacing-40: 40px;
  --spacing-60: 60px;
  --spacing-100: 100px;
  --spacing-120: 120px;
  --spacing-232: 232px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 60px;
  --card-padding: 24px;
  --element-gap: 11-19px;

  /* Border Radius */
  --radius-sm: 2.85px;
  --radius-md: 6px;
  --radius-lg: 10px;
  --radius-2xl: 21.945px;
  --radius-3xl: 28.5px;
  --radius-3xl-2: 34.2px;
  --radius-3xl-3: 37.3065px;
  --radius-3xl-4: 39.9px;
  --radius-full: 152.19px;

  /* Named Radii */
  --radius-tags: 28.5px;
  --radius-cards: 2.85px;
  --radius-inputs: 6px;
  --radius-buttons: 28.5px;
  --radius-navbuttons: 22px;
  --radius-herobuttons: 34.2px;

  /* Surfaces */
  --surface-slate-gray-hero-canvas: #788086;
  --surface-sunbeam-yellow-band: #ffc500;
  --surface-paper-white-card: #ffffff;
  --surface-sand-callout: #e9e4d9;
  --surface-fog-alternate: #efefef;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-sunbeam-yellow: #ffc500;
  --color-electric-violet: #7700ff;
  --color-carbon: #312f27;
  --color-paper-white: #ffffff;
  --color-slate-gray: #788086;
  --color-fog: #efefef;
  --color-sand: #e9e4d9;
  --color-ash: #b1afa7;

  /* Typography */
  --font-roobert: 'Roobert', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 19px;
  --leading-caption: 25;
  --tracking-caption: -0.13px;
  --text-body-sm: 21px;
  --leading-body-sm: 27;
  --tracking-body-sm: -0.15px;
  --text-subheading: 24px;
  --leading-subheading: 29;
  --tracking-subheading: -0.17px;
  --text-heading-sm: 29px;
  --leading-heading-sm: 35;
  --tracking-heading-sm: -0.2px;
  --text-heading: 34px;
  --leading-heading: 41;
  --tracking-heading: -0.24px;
  --text-heading-lg: 40px;
  --leading-heading-lg: 44;
  --tracking-heading-lg: -0.28px;
  --text-display: 51px;
  --leading-display: 56;
  --tracking-display: -0.36px;
  --text-display-lg: 57px;
  --leading-display-lg: 63;
  --tracking-display-lg: -0.4px;
  --text-hero: 68px;
  --leading-hero: 68;
  --tracking-hero: -0.48px;

  /* Spacing */
  --spacing-12: 12px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-28: 28px;
  --spacing-40: 40px;
  --spacing-60: 60px;
  --spacing-100: 100px;
  --spacing-120: 120px;
  --spacing-232: 232px;

  /* Border Radius */
  --radius-sm: 2.85px;
  --radius-md: 6px;
  --radius-lg: 10px;
  --radius-2xl: 21.945px;
  --radius-3xl: 28.5px;
  --radius-3xl-2: 34.2px;
  --radius-3xl-3: 37.3065px;
  --radius-3xl-4: 39.9px;
  --radius-full: 152.19px;
}
```
