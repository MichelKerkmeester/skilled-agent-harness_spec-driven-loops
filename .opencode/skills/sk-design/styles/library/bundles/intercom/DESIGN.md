# Intercom — Style Reference
> Warm cream editorial spread

**Theme:** light

Intercom's design language reads like an editorial magazine printed on warm cream paper: an off-white canvas (#faf9f6) replaces the cold SaaS gray, all body and display type sits at weight 300 for a whisper-light confidence, and a single vivid violet (#0007cb) does nearly all the chromatic work in small, deliberate doses. Sharp 4px corners on every control reject the rounded-softness trend in favor of architectural precision, and SaansMono at wide tracking acts as a labeling system — the way captions and tags function in print. Serrif at 300 weight appears inside body copy as a quiet editorial counterpoint, the one concession to typographic richness in an otherwise austere system. Components feel weightless: thin hairline borders in warm stone (#dedbd6), no decorative shadows, black-filled primary buttons that anchor without weight.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Electric Violet | `#0007cb` | `--color-electric-violet` | Brand accent — used sparingly for emphasis moments, selected icon strokes, and tag punctuation; the only saturated color in the system creates instant focus when it appears against the warm neutral canvas |
| Pure White | `#ffffff` | `--color-pure-white` | Card surfaces, product screenshot backgrounds, inverted button text |
| Canvas Cream | `#faf9f6` | `--color-canvas-cream` | Primary page canvas — the warm off-white that defines the entire surface temperature; every screen lives on this tone |
| Linen | `#f1eee9` | `--color-linen` | Secondary surface for sectioned blocks, elevated cards, and alternating content bands — one step warmer than canvas |
| Stone | `#d3cec6` | `--color-stone` | Decorative texture wash, large background fields, subtle warmth blocks |
| Hairline | `#dedbd6` | `--color-hairline` | Hairline borders, dividers, input outlines, nav separators — the warm border tone that never feels cold |
| Ink | `#111111` | `--color-ink` | Primary text, headings, body copy — slightly softer than pure black for comfortable reading on cream |
| Carbon | `#000000` | `--color-carbon` | Dark supporting neutral for text, icons, and strong contrast. Do not promote it to the primary CTA color |
| Iron | `#414141` | `--color-iron` | Secondary text, supporting copy, muted descriptions |
| Graphite | `#585858` | `--color-graphite` | Tertiary text, helper copy, less-prominent body |
| Smoke | `#888888` | `--color-smoke` | Disabled state text, placeholder copy, very muted labels |
| Ash | `#a0a0a0` | `--color-ash` | Muted headings in secondary contexts, low-emphasis text |
| Silver | `#b8b8b8` | `--color-silver` | Icon strokes in resting state, low-emphasis glyphs |

## Tokens — Typography

### Saans — Primary typeface for everything — display headlines at weight 300 (80px/54px/40px), headings at 300 (32px/24px), body at 400 (16px/20px). The 300-weight display is the signature: most brands shout at 700–800, Intercom whispers at 300 and achieves authority through restraint. Use weight 400 only for body and supporting text where readability is paramount. · `--font-saans`
- **Substitute:** Inter, Söhne, Untitled Sans
- **Weights:** 300, 400
- **Sizes:** 14px, 16px, 20px, 24px, 32px, 40px, 54px, 80px
- **Line height:** 0.95–1.50
- **Letter spacing:** -2.4px at 80px, -1.62px at 54px, -1.2px at 40px, -0.64px at 32px, -0.48px at 24px, -0.2px at 20px, -0.16px at 16px
- **OpenType features:** `"ss01" on, "tnum" on`
- **Role:** Primary typeface for everything — display headlines at weight 300 (80px/54px/40px), headings at 300 (32px/24px), body at 400 (16px/20px). The 300-weight display is the signature: most brands shout at 700–800, Intercom whispers at 300 and achieves authority through restraint. Use weight 400 only for body and supporting text where readability is paramount.

### SaansMono — Monospace labeling system — nav micro-labels, tab labels, tag chips, section metadata. Always paired with wide positive tracking to function as typographic badges. The 100em spacing on 12px is a 'shout' weight for the smallest text, making it readable as a label rather than body copy. · `--font-saansmono`
- **Substitute:** JetBrains Mono, IBM Plex Mono, Geist Mono
- **Weights:** 300, 400, 500
- **Sizes:** 12px, 14px
- **Line height:** 1.00–1.40
- **Letter spacing:** 0.7px at 14px, 1.2px at 12px
- **Role:** Monospace labeling system — nav micro-labels, tab labels, tag chips, section metadata. Always paired with wide positive tracking to function as typographic badges. The 100em spacing on 12px is a 'shout' weight for the smallest text, making it readable as a label rather than body copy.

### Serrif — Editorial counterpoint — appears in select body paragraphs and pull quotes at 16px/300 to add a humanist, almost literary quality. The contrast of serif at 300 against Saans display at 300 creates the magazine-spread rhythm that defines Intercom's voice. · `--font-serrif`
- **Substitute:** Source Serif Pro, Newsreader, Tiempos Text
- **Weights:** 300
- **Sizes:** 16px
- **Line height:** 1.40
- **Letter spacing:** -0.0100em
- **Role:** Editorial counterpoint — appears in select body paragraphs and pull quotes at 16px/300 to add a humanist, almost literary quality. The contrast of serif at 300 against Saans display at 300 creates the magazine-spread rhythm that defines Intercom's voice.

### MediumLL — Secondary utility face for small UI labels and nav micro-copy where a condensed, tight feel is needed. Used sparingly — only 15 occurrences. · `--font-mediumll`
- **Substitute:** Inter, Söhne
- **Weights:** 400
- **Sizes:** 14px, 16px
- **Line height:** 0.94–1.29
- **Letter spacing:** -0.0250em, -0.0060em, 0.0350em
- **Role:** Secondary utility face for small UI labels and nav micro-copy where a condensed, tight feel is needed. Used sparingly — only 15 occurrences.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.4 | 1.2px | `--text-caption` |
| body-sm | 14px | 1.4 | — | `--text-body-sm` |
| body | 16px | 1.5 | -0.16px | `--text-body` |
| subheading | 20px | 1.25 | -0.2px | `--text-subheading` |
| heading-sm | 24px | 1.4 | -0.48px | `--text-heading-sm` |
| heading | 32px | 1.43 | -0.64px | `--text-heading` |
| heading-lg | 40px | 1.25 | -1.2px | `--text-heading-lg` |
| display | 54px | 1 | -1.62px | `--text-display` |
| display-lg | 80px | 0.95 | -2.4px | `--text-display-lg` |

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
| 64 | 64px | `--spacing-64` |
| 80 | 80px | `--spacing-80` |
| 96 | 96px | `--spacing-96` |
| 112 | 112px | `--spacing-112` |
| 216 | 216px | `--spacing-216` |

### Border Radius

| Element | Value |
|---------|-------|
| nav | 4px |
| tags | 4px |
| cards | 4px |
| inputs | 4px |
| buttons | 4px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 64-96px
- **Card padding:** 24-32px
- **Element gap:** 8-16px

## Components

### Filled Primary Button
**Role:** Primary action trigger (e.g., 'Start free trial')

Background #000000, text #ffffff, 4px border-radius, padding 14px 16px, Saans 14px/400. No shadow, no gradient — just a solid black block that anchors visually against the warm cream canvas. The starkness of the black-on-cream pairing is the signature.

### Ghost Text Button
**Role:** Secondary action (e.g., 'View demo', 'Contact sales')

No background, text #111111, 4px optional border, padding 14px 16px, Saans 14px/400. Renders as plain text or with a thin outline; never filled. Sits beside the filled primary without competing for weight.

### Outlined CTA Button
**Role:** High-emphasis secondary action (e.g., 'Fin AI Agent')

White background #ffffff, 1px solid #111111 border, 4px radius, padding 14px 16px, Saans 14px/400 with #111111 text. Used for product-feature CTAs that need to stand apart from the standard filled/ghost pair.

### Announcement Banner
**Role:** Top-of-page promotional strip

Full-width band, light neutral background (#f1eee9 or #faf9f6), Saans 12–14px body text in #111111 with an inline link underlined. Dismissible with × icon at right. No background color — sits as a quiet info layer.

### Top Navigation Bar
**Role:** Primary site navigation

White or transparent over canvas, 4px radius on interactive elements. Left: logo mark + 4 nav items (Product, Customers, Resources, Pricing) with dropdown carets. Right: icon, 'Contact sales', 'View demo', filled black 'Start free trial', outlined 'Fin AI Agent →'. Saans 14px/400, 16px horizontal padding in nav items.

### Hero Display Headline
**Role:** Primary page-level headline

Saans weight 300, 80px on desktop, 54px tablet, line-height 0.95, letter-spacing -2.4px at 80px, color #111111. Multi-line, left-aligned, fills roughly 60% of viewport width. The whisper-weight at extreme size is the defining Intercom signature — no other SaaS brand uses 300 at this scale.

### Hero Subtext Block
**Role:** Supporting description beside the headline

Saans 16px/1.5 or Serrif 16px/1.4 weight 300, color #414141 or #585858, max-width 380–420px. Sits to the right of the headline or below it, constrained to a narrow column to preserve the editorial feel.

### Image Grid Strip
**Role:** Decorative/brand imagery showcase

6–7 image tiles in a single horizontal row, each ~120–160px square, full-bleed, no gap or 4px gap. Mix of photography, illustration, and abstract art. Serves as visual texture and social proof of the brand's human side.

### Tab Navigation
**Role:** Section-level content switcher

Horizontal row of 4 tab labels, Saans 14–16px/400, active tab has a black underline bar (2px) beneath. Inactive tabs in #888888. No background change — the underline is the only state indicator.

### Product Screenshot Panel
**Role:** In-context product UI showcase

Large rounded container (4px radius) holding a product screenshot on a warm background (#f1eee9 or textured). Screenshot itself has subtle internal 4px radius. The warm surround makes the product UI feel embedded, not floating.

### Customer Logo Grid
**Role:** Social proof and brand association

6-column grid of customer wordmarks, each rendered in #b8b8b8 or #888888 (monochrome gray), no color logos. Saans 16–20px display weight. The grayscale treatment is intentional — it prevents competing brand colors from polluting the warm cream system.

### Two-Column Feature Section
**Role:** Text + image editorial block

50/50 split. Left column: Saans 300 display headline (40–54px) + body copy (Serrif 16px/300 or Saans 400) + button pair. Right column: editorial illustration or product visual on warm background. Generous 64–96px vertical padding above and below.

### Nav Dropdown Caret
**Role:** Dropdown indicator on nav items

Tiny downward chevron icon, 8px, stroke 1.5px, color #111111. No background, no border — just the glyph appended to nav labels with 6px spacing.

### Section Divider
**Role:** Visual break between content blocks

Invisible — no lines, no gradients. Sections are separated purely by warm background tone shifts (#faf9f6 → #f1eee9 → #d3cec6) and vertical spacing (64–96px). The absence of hard dividers reinforces the editorial flow.

## Do's and Don'ts

### Do
- Set all display headlines at weight 300, not 400 or 700 — the whisper-weight is the brand's most recognizable choice
- Use warm cream (#faf9f6) as the default page background, not pure white or cool gray — the warmth is non-negotiable
- Apply SaansMono at 12px with 1.2px letter-spacing for any tag, label, or micro-copy element
- Use black (#000000) for filled primary buttons — never the brand violet, never a tinted neutral
- Apply 4px border-radius universally — buttons, nav, cards, inputs, tags all share the same sharp radius
- Allow display headlines to reach 80px with line-height 0.95 and letter-spacing -2.4px — extreme size at light weight needs the tight tracking to remain readable
- Pair Saans display with Serrif 300 in body copy to create editorial contrast within the same weight register
- Use the vivid violet (#0007cb) sparingly — maximum once or twice per screen, in small functional doses (icons, emphasis links, tag accents)
- Set section vertical gaps at 64–96px to create the slow, editorial page rhythm
- Render all third-party customer logos in grayscale (#b8b8b8 or #888888) to maintain system color discipline

### Don't
- Never set display type at weight 700 or above — the 300-weight whisper is the entire identity
- Never use pure white (#ffffff) as the primary page canvas — always use warm cream (#faf9f6)
- Never apply border-radius above 4px — no 8px, no 12px, no 9999px pills
- Never use cool grays (blue-tinted) for neutrals — all grays must have a warm undertone to live in the cream system
- Never use the brand violet as a button fill — it is an accent, not an action color
- Never use shadows or drop-shadows on cards, buttons, or panels — depth comes from background tone shifts, not elevation
- Never render customer logos in their native brand colors — grayscale only to prevent color pollution
- Never add a hard divider line between sections — let background tone and spacing create separation
- Never set body copy above 20px or below 14px — the editorial scale is tight
- Never use a gradient — the entire system is flat, warm, and untextured except for the surface tone progression

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas | `#faf9f6` | Primary page background — warm off-white that defines the system's temperature |
| 1 | Section Warm | `#f1eee9` | Alternating section background — one step warmer, creates slow visual rhythm down the page |
| 2 | Textured Stone | `#d3cec6` | Accent block background — used for large warm fields, decorative texture, and feature surrounds |
| 3 | Card White | `#ffffff` | Inverted surface for product screenshots, cards on cream backgrounds, and embedded media |

## Elevation

Intercom deliberately avoids shadows. Depth and separation are achieved through warm background tone progression (#faf9f6 → #f1eee9 → #d3cec6) and generous whitespace, not through box-shadow elevation. This flat-warm approach is an explicit rejection of the Material/elevation trend and reinforces the editorial paper-on-paper metaphor.

## Imagery

Intercom's visual language mixes editorial photography, hand-drawn illustration, and product screenshots with equal weight. Photography tends toward warm, lifestyle-framed human shots (portraits, sunsets, candid scenes) with natural color grading — never stock-clinical. Illustrations are loose, organic, often black-and-white ink-style (sketched figures, abstract line art) that echo the serif typography's humanist warmth. Product screenshots are always presented on warm cream backgrounds, never floating on white, to keep them embedded in the system's tone. The customer logo grid is treated as a quiet social-proof band in muted gray rather than as a visual centerpiece. Overall density is text-dominant — imagery serves as punctuation and atmosphere, not as the hero. Icons throughout are thin-stroke, 1.5px, monochromatic in #111111 or #b8b8b8.

## Layout

Intercom uses a max-width 1200px centered container with generous side padding (48–80px). The page rhythm is: thin announcement bar → transparent nav bar → 80px display headline hero (left-aligned, 60% width) with subtext column to the right → horizontal image strip → tabbed product section → 6-column customer logo grid → alternating 2-column editorial feature blocks (text+image, 50/50 split). Section vertical spacing is 64–96px, creating slow, measured scrolling. No full-bleed sections — everything sits within the contained column. Navigation is a single top bar (not sticky in the data shown), with no sidebar or mega-menu complexity. The layout philosophy is editorial-magazine: every section is a 'spread' with clear top and bottom margins, and content alternates which column carries the image.

## Agent Prompt Guide

**Quick Color Reference**
- text primary: #111111
- background canvas: #faf9f6
- border hairline: #dedbd6
- accent: #0007cb
- primary action: no distinct CTA color

**3-5 Example Component Prompts**

1. Create a hero section: canvas background #faf9f6. Display headline at 80px Saans weight 300, color #111111, letter-spacing -2.4px, line-height 0.95. Subtext in a 400px column to the right at 16px Saans weight 400, color #414141. Below: filled black button (bg #000000, text #ffffff, 4px radius, padding 14px 16px) + ghost text button (no bg, text #111111) side by side with 8px gap.

2. Create a customer logo grid: 6-column layout, each cell centered, logos rendered at 16px in #b8b8b8 (no native brand colors). 32px row gap, 24px column gap. Section sits on #faf9f6 canvas with 64px padding above and below.

3. Create a tab navigation row: 4 tab labels in Saans 14px/400, active tab has a 2px solid #111111 underline bar, inactive tabs in #888888. Tabs separated by 32px horizontal gap. On a #faf9f6 background, no container border.

4. Create a product screenshot panel: container with 4px border-radius, background #f1eee9 (warm stone), padding 32px. Inside: a product UI screenshot at full container width, internal 4px radius, no shadow. Add a section label above in SaansMono 12px/1.2px tracking, color #585858.

5. Create a two-column editorial feature block: left column (50%) with Saans 54px/300 headline (#111111, letter-spacing -1.62px) + Serrif 16px/300 body copy (#414141) + filled black button. Right column (50%) with an illustration on #f1eee9 background, 4px radius. 96px vertical padding around the entire block.

## Typographic Voice

Intercom's typographic system is defined by what it does NOT do: it never sets display type at weight 700. The entire identity rests on the counterintuitive choice of weight 300 at 80px — a whisper where competitors shout. This creates authority through restraint, not volume. The secondary signature is the SaansMono labeling system: monospace at 12px with 1.2px (100em) letter-spacing creates typographic badges that function like print magazine captions. The Serrif 300 body copy is the third voice — a humanist, almost literary counterpoint that prevents the system from feeling purely corporate. Never mix more than two of these voices on a single screen.

## Similar Brands

- **Linear** — Same whisper-weight display typography (300 at large sizes) and sharp 4px-radius controls, though Linear operates in dark mode
- **Vercel** — Monochrome restraint with minimal color use, sharp corners, and editorial-feeling display headlines
- **Stripe** — Editorial white-paper aesthetic with warm-neutral backgrounds, restrained color palette, and generous section spacing
- **Notion** — Flat surfaces, no shadows, warm off-white canvas, and typographic confidence at large display sizes
- **Arc browser** — Editorial typography choices, warm canvas tones, and willingness to use weight 300 as a brand signature

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-electric-violet: #0007cb;
  --color-pure-white: #ffffff;
  --color-canvas-cream: #faf9f6;
  --color-linen: #f1eee9;
  --color-stone: #d3cec6;
  --color-hairline: #dedbd6;
  --color-ink: #111111;
  --color-carbon: #000000;
  --color-iron: #414141;
  --color-graphite: #585858;
  --color-smoke: #888888;
  --color-ash: #a0a0a0;
  --color-silver: #b8b8b8;

  /* Typography — Font Families */
  --font-saans: 'Saans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-saansmono: 'SaansMono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-serrif: 'Serrif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-mediumll: 'MediumLL', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.4;
  --tracking-caption: 1.2px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.4;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.16px;
  --text-subheading: 20px;
  --leading-subheading: 1.25;
  --tracking-subheading: -0.2px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.4;
  --tracking-heading-sm: -0.48px;
  --text-heading: 32px;
  --leading-heading: 1.43;
  --tracking-heading: -0.64px;
  --text-heading-lg: 40px;
  --leading-heading-lg: 1.25;
  --tracking-heading-lg: -1.2px;
  --text-display: 54px;
  --leading-display: 1;
  --tracking-display: -1.62px;
  --text-display-lg: 80px;
  --leading-display-lg: 0.95;
  --tracking-display-lg: -2.4px;

  /* Typography — Weights */
  --font-weight-light: 300;
  --font-weight-regular: 400;
  --font-weight-medium: 500;

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
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-96: 96px;
  --spacing-112: 112px;
  --spacing-216: 216px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 64-96px;
  --card-padding: 24-32px;
  --element-gap: 8-16px;

  /* Border Radius */
  --radius-md: 4px;

  /* Named Radii */
  --radius-nav: 4px;
  --radius-tags: 4px;
  --radius-cards: 4px;
  --radius-inputs: 4px;
  --radius-buttons: 4px;

  /* Surfaces */
  --surface-canvas: #faf9f6;
  --surface-section-warm: #f1eee9;
  --surface-textured-stone: #d3cec6;
  --surface-card-white: #ffffff;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-electric-violet: #0007cb;
  --color-pure-white: #ffffff;
  --color-canvas-cream: #faf9f6;
  --color-linen: #f1eee9;
  --color-stone: #d3cec6;
  --color-hairline: #dedbd6;
  --color-ink: #111111;
  --color-carbon: #000000;
  --color-iron: #414141;
  --color-graphite: #585858;
  --color-smoke: #888888;
  --color-ash: #a0a0a0;
  --color-silver: #b8b8b8;

  /* Typography */
  --font-saans: 'Saans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-saansmono: 'SaansMono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-serrif: 'Serrif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-mediumll: 'MediumLL', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.4;
  --tracking-caption: 1.2px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.4;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.16px;
  --text-subheading: 20px;
  --leading-subheading: 1.25;
  --tracking-subheading: -0.2px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.4;
  --tracking-heading-sm: -0.48px;
  --text-heading: 32px;
  --leading-heading: 1.43;
  --tracking-heading: -0.64px;
  --text-heading-lg: 40px;
  --leading-heading-lg: 1.25;
  --tracking-heading-lg: -1.2px;
  --text-display: 54px;
  --leading-display: 1;
  --tracking-display: -1.62px;
  --text-display-lg: 80px;
  --leading-display-lg: 0.95;
  --tracking-display-lg: -2.4px;

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
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-96: 96px;
  --spacing-112: 112px;
  --spacing-216: 216px;

  /* Border Radius */
  --radius-md: 4px;
}
```
