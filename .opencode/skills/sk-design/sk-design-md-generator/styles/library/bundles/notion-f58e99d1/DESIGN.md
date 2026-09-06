# Notion — Style Reference
> midnight workspace, warm paper below

**Theme:** mixed

Notion operates as a midnight workspace that hands you the keys to a clean editorial room. The first screen is a deep navy stage (#02093a) where a single bold headline commands attention, surrounded by subtle violet glows and product screenshots that float like objects under glass. Below the fold, the page lightens into a warm white editorial canvas (#f6f5f4) where product cards, testimonials, and feature blocks read like a well-designed magazine spread. Typography carries the personality: NotionInter does the utilitarian work at compact confident sizes, while Lyon Text appears as occasional editorial accent — a serif whisper that signals 'this is thoughtful, not just functional.' The color system is mostly cool blue and violet for the dark surfaces, with the brand's identity expressed through the midnight canvas itself rather than a single bright accent — a deliberate inversion of the typical SaaS color hierarchy.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Midnight Ink | `#02093a` | `--color-midnight-ink` | Hero canvas, top-of-page surface, and the brand's defining dark stage — deep navy reads as serious, focused, almost like an editor's darkroom before the content lights up |
| Signal Blue | `#0075de` | `--color-signal-blue` | Primary action buttons, filled CTA backgrounds, active link emphasis — the one bright blue that makes actions feel switched on against the midnight canvas |
| Sky Tint | `#62aef0` | `--color-sky-tint` | Decorative gradient stops, illustrated icon accents, soft highlight washes around headlines and product mockups — light blue provides the air around the heavy midnight |
| Royal Violet | `#2537b1` | `--color-royal-violet` | Decorative gradient accent, illustrated aura around product screenshots, secondary brand surface in dark mode navigation |
| Periwinkle | `#455dd3` | `--color-periwinkle` | Secondary action variant, outlined button fill, dark mode card surface elevation — sits between the midnight and signal blue as a bridge tone |
| Cerulean | `#097fe8` | `--color-cerulean` | Info badges, new-feature tags, inline highlight labels — cooler than Signal Blue, reserved for status and informational context |
| Paper White | `#f6f5f4` | `--color-paper-white` | Light section canvas, card surface on light backgrounds, the warm off-white that gives below-the-fold sections a printed-page quality |
| Pure White | `#ffffff` | `--color-pure-white` | Elevated card surface above Paper White, input field background, reversed text on dark buttons — only used where maximum contrast or stacking is needed |
| Onyx | `#000000` | `--color-onyx` | Primary text on light surfaces, hairline borders, icon strokes — the default ink for everything that needs to be read |
| Graphite | `#0b0b0b` | `--color-graphite` | Secondary text on light surfaces, high-contrast borders, card edges — slightly softer than pure black for visual comfort in long-form copy |
| Warm Gray | `#615d59` | `--color-warm-gray` | Muted helper text, secondary metadata, inactive icon strokes — warm undertone distinguishes it from cold grays in other SaaS systems |
| Stone | `#a39e98` | `--color-stone` | Muted icon strokes, separators, and secondary graphic details. Do not promote it to the primary CTA color |
| Smoke | `#c6c6c5` | `--color-smoke` | Divider lines, subtle separators between content blocks on light surfaces |
| Faint Line | `#dddddd` | `--color-faint-line` | Input field borders, form element outlines, the lightest structural divider |
| Charcoal | `#31302e` | `--color-charcoal` | Dark mode nav borders, text on dark surfaces, low-contrast dividers in the midnight stage |

## Tokens — Typography

### NotionInter — The workhorse — covers all body copy, UI labels, navigation, and most headings from 12px captions up to 64px display. Weight 500 dominates body and UI, weight 600 for emphasized headlines, weight 700 reserved for the hero display. Tight negative tracking at large sizes (-0.036em at 64px) prevents the large forms from feeling airy; at 14px the tracking opens slightly positive. The 'lnum' and 'locl' features lock tabular numerals and locale forms — critical for product UI numbers and dates · `--font-notioninter`
- **Substitute:** Inter
- **Weights:** 400, 500, 600, 700
- **Sizes:** 12, 14, 15, 16, 20, 22, 24, 26, 40, 42, 54, 64
- **Line height:** 1.20–1.50 for body, 1.00–1.14 for display
- **Letter spacing:** -0.036em at 64px scaling to 0.01em at 12px; display sizes tighten aggressively, body sizes stay near zero or slightly open
- **OpenType features:** `"lnum", "locl" 0`
- **Role:** The workhorse — covers all body copy, UI labels, navigation, and most headings from 12px captions up to 64px display. Weight 500 dominates body and UI, weight 600 for emphasized headlines, weight 700 reserved for the hero display. Tight negative tracking at large sizes (-0.036em at 64px) prevents the large forms from feeling airy; at 14px the tracking opens slightly positive. The 'lnum' and 'locl' features lock tabular numerals and locale forms — critical for product UI numbers and dates

### Lyon Text — Editorial accent — a serif heading that appears sparingly on feature section titles. The 32px size and 1.25 line-height give it a magazine-pull-quote quality. Its presence signals a shift from product UI to narrative content. Only weight 400, used as a moment of visual pause in an otherwise sans-serif system · `--font-lyon-text`
- **Substitute:** Source Serif Pro
- **Weights:** 400
- **Sizes:** 32
- **Line height:** 1.25
- **Role:** Editorial accent — a serif heading that appears sparingly on feature section titles. The 32px size and 1.25 line-height give it a magazine-pull-quote quality. Its presence signals a shift from product UI to narrative content. Only weight 400, used as a moment of visual pause in an otherwise sans-serif system

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.5 | 0.12px | `--text-caption` |
| body-sm | 14px | 1.43 | -0.084px | `--text-body-sm` |
| body | 16px | 1.5 | -0.16px | `--text-body` |
| subheading | 20px | 1.4 | -0.22px | `--text-subheading` |
| heading-sm | 24px | 1.33 | -0.264px | `--text-heading-sm` |
| heading | 40px | 1.2 | -0.88px | `--text-heading` |
| heading-lg | 54px | 1.04 | -1.89px | `--text-heading-lg` |
| display | 64px | 1 | -2.3px | `--text-display` |

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
| 36 | 36px | `--spacing-36` |
| 40 | 40px | `--spacing-40` |
| 64 | 64px | `--spacing-64` |
| 80 | 80px | `--spacing-80` |
| 180 | 180px | `--spacing-180` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 9999px |
| cards | 12px |
| small | 5px |
| badges | 9999px |
| inputs | 8px |
| buttons | 8px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| subtle | `rgba(0, 0, 0, 0.01) 0px 1px 3px 0px, rgba(0, 0, 0, 0.02) ...` | `--shadow-subtle` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 24px
- **Element gap:** 16px

## Components

### Filled CTA Button
**Role:** Primary action — the 'Get Notion free' button in the hero and nav

Signal Blue (#0075de) background, Pure White text, 8px border-radius, 16px horizontal × 6-10px vertical padding, NotionInter weight 500 at 14-15px. Used for the single most important action on each page. On dark backgrounds it pops; on light backgrounds it remains the only chromatic element that demands attention.

### Ghost/Text Button
**Role:** Secondary action — 'Request a demo', 'Log in'

No background fill, white or dark text matching the surface, 8px border-radius, 14-15px NotionInter weight 500. Sits beside the filled CTA at equal weight in the hero. On dark surfaces, text is white; on light surfaces, text is Onyx (#000000).

### Hero Display Headline
**Role:** Page-opening headline

NotionInter weight 700 at 64px, Pure White on midnight canvas, line-height 1.00, letter-spacing -2.3px. Centered. The tight tracking and single weight create a single decisive visual moment that anchors the entire page.

### Editorial Section Heading
**Role:** Below-the-fold section title — 'Keep work moving 24/7'

NotionInter weight 600 at 40-54px, Onyx (#000000) on Paper White, left-aligned, letter-spacing -0.88 to -1.89px. Sits at the top of light sections with generous bottom margin before content.

### Product Screenshot Card
**Role:** Hero and feature section visual centerpiece

Large rounded-rectangle screenshot of Notion UI, 12px border-radius, floating on midnight or paper surface. The hero version uses the deep multi-layer shadow stack to lift it off the navy background. Feature-section versions sit on white cards with no shadow, relying on the border-radius for definition.

### Testimonial Quote Card
**Role:** Customer proof — 'Trusted by teams that ship'

Pure White background, 1px Onyx (#000000) hairline border or 12px radius, 24px padding. Company name in weight 600 at 16px, quote text in NotionInter 400 at 20px line-height 1.4, 'Read the full story →' link in Signal Blue weight 500. The featured card spans full width with a video thumbnail; smaller cards stack in 3-column grid.

### Logo Grid
**Role:** Social proof band — 'Trusted by 98% of the Forbes Cloud 100'

Company logos arranged in a single horizontal row on midnight canvas, Pure White or light gray fill at consistent height (~24px), generous 40-60px horizontal spacing. No card backgrounds, no borders — logos float directly on the dark surface.

### Feature Block Card
**Role:** Product feature showcase — Custom Agents, Office Q&A

Two-column layout: left side has heading + description on white, right side has a product UI screenshot on a subtly tinted card (peach/blue tint). 12px radius on the screenshot container, no shadow, 24px padding inside the card. Creates a split visual rhythm down the page.

### Pill Badge / Tag
**Role:** Status labels — 'New' badge, category tags

9999px border-radius (full pill), small horizontal padding (10-12px), 4-5px vertical padding. NotionInter weight 500 at 12px. Faint blue background (#f2f9ff) with Cerulean (#097fe8) text for 'New' labels. Used sparingly as visual punctuation.

### Navigation Bar
**Role:** Top-level site navigation

Transparent or midnight background, fixed/sticky at top. Logo (Notion 'N' mark) far left, nav links center (Product, AI, Solutions, Resources, Enterprise, Pricing, Request a demo) in NotionInter 500 at 14px, filled Signal Blue CTA + ghost Log in far right. Charcoal (#31302e) 1px bottom border for separation.

### Cookie Consent Banner
**Role:** GDPR/privacy notice overlay

Fixed bottom-center on white, 1px Onyx border, 8px radius, 16px padding. Body text in NotionInter 400 at 14px, 'Accept all' as filled blue button, 'Reject all' as outlined blue button, 'More options' as text link.

## Do's and Don'ts

### Do
- Use 12px border-radius for all cards, images, and product mockup containers
- Use 8px border-radius for buttons, inputs, and interactive controls
- Use 9999px border-radius exclusively for pill-shaped badges and tags
- Use Signal Blue (#0075de) as the single filled CTA color — never introduce a second chromatic button color
- Set hero headlines at 64px NotionInter weight 700 with -2.3px letter-spacing
- Use 80px vertical gaps between major page sections to create the dark-to-light stage transition
- Use NotionInter weight 500 (not 600 or 700) for all UI labels, nav links, and button text
- Use Pure White (#ffffff) only for elevated surfaces or reversed text — default to Paper White (#f6f5f4) for light page backgrounds
- Use Lyon Text sparingly — at most once per page, at 32px, for editorial accent headings

### Don't
- Do not use Lyon Text for product UI labels, navigation, or anything below 24px — it's an editorial signal, not a utility font
- Do not use pure black (#000000) as a background — Midnight Ink (#02093a) is the dark surface; pure black appears only as text and borders
- Do not use 5px or smaller border-radius on cards or images — reserve 5px for small chips and inline elements only
- Do not place chromatic buttons on chromatic backgrounds — Signal Blue CTAs require midnight or paper-white surfaces to maintain contrast
- Do not set body text below 14px or above 20px — the 12px size is for captions and metadata only
- Do not mix the dark and light surface treatments within a single card — a card is either midnight-stage or paper-stage, never both
- Do not use multiple heading weights in the same section — pick 600 for editorial headings, 700 for hero, never both
- Do not add gradients to text, borders, or small UI elements — gradients appear only as large decorative auras around product mockups

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Midnight Canvas | `#02093a` | Hero and top-of-page dark stage |
| 1 | Periwinkle Surface | `#455dd3` | Dark mode card surface, secondary nav background |
| 2 | Royal Violet | `#2537b1` | Illustrated aura and decorative accent layer |
| 3 | Paper White | `#f6f5f4` | Below-the-fold light section canvas |
| 4 | Pure White | `#ffffff` | Elevated cards and input fields on Paper White |

## Elevation

- **Hero product mockup:** `rgba(0, 0, 0, 0.01) 0px 1px 3px 0px, rgba(0, 0, 0, 0.02) 0px 3px 7px 0px, rgba(0, 0, 0, 0.02) 0px 7px 15px 0px, rgba(0, 0, 0, 0.04) 0px 14px 28px 0px, rgba(0, 0, 0, 0.05) 0px 23px 52px 0px`

## Imagery

The site mixes real product screenshots with minimal illustrated accents. The hero displays a large Notion workspace UI screenshot floating on the midnight canvas, surrounded by small illustrated mascot characters (cat, fox, robot) in circular badge frames. Below the fold, product UI cards show actual Notion interface screens cropped to feature specific workflows (kanban boards, databases, AI features). There is no lifestyle photography — the product IS the hero imagery. The editorial sections use no decorative illustrations, only typography and clean card layouts. Icons are minimal and line-style, appearing only in navigation and feature labels. The visual density is moderate: large typographic moments with product screenshots occupying generous space, never crowded with decorative graphics.

## Layout

The page follows a max-width 1200px centered column with full-bleed dark and light bands that extend edge to edge. The hero is a full-viewport-height midnight navy section with centered headline, subtext, and dual CTA buttons (filled + ghost), with a large product screenshot overlapping the bottom edge of the hero. Below: a dark band of company logos in a grid, then a sharp transition to a white section with a large left-aligned heading and product cards in a 2-column layout. Further down: a testimonial section on white with a featured large card spanning the top row and smaller quote cards in a 3-column grid below. Navigation is a minimal top bar with logo left, links center, and two buttons right (filled blue 'Get Notion free' + ghost 'Log in'). The section rhythm alternates dark → light with generous 80px vertical gaps, creating a distinct stage-to-paper transition that defines the page's reading flow.

## Agent Prompt Guide

Quick Color Reference:
- text (primary): #000000
- text (on dark): #ffffff
- background (hero/dark): #02093a
- background (light sections): #f6f5f4
- border: #000000 (hairline)
- accent (Signal Blue): #0075de
- primary action: #ffffff (filled action)

Example Component Prompts:
1. Hero headline block: Midnight Ink (#02093a) background, 64px NotionInter weight 700, Pure White text, letter-spacing -2.3px, line-height 1.00, centered. Subtext below at 20px NotionInter weight 400, Pure White, max-width 560px, centered. Filled Signal Blue (#0075de) button 'Get Notion free' — 8px radius, Pure White text weight 500 at 15px, 16px × 10px padding. Ghost 'Request a demo' button beside it — no fill, Pure White text, same sizing.

2. Feature section card: Paper White (#f6f5f4) background, left-aligned heading at 54px NotionInter weight 600, Onyx (#000000) text, letter-spacing -1.89px. Right-side product screenshot container — Pure White (#ffffff) background, 12px border-radius, 24px padding inside, no shadow.

3. Testimonial card: Pure White (#ffffff) background, 1px Onyx (#000000) border, 12px border-radius, 24px padding. Company name at 16px NotionInter weight 600. Quote at 20px NotionInter weight 400, line-height 1.4. 'Read full story →' link in Signal Blue (#0075de) weight 500 at 15px.

4. Create a Primary Action Button: #ffffff background, #000000 text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.

5. Pill badge: Faint blue (#f2f9ff) background, Cerulean (#097fe8) text, 9999px radius, 12px horizontal × 4px vertical padding, NotionInter weight 500 at 12px.

## Surface Philosophy

The design operates on a two-stage metaphor: the midnight stage and the paper page. The midnight stage (#02093a) is for hero moments, navigation, and the first impression — it signals 'we are serious, focused, and this is product software, not a toy.' The paper page (#f6f5f4) is for everything below the fold — features, testimonials, product details — it signals 'now sit down and read.' The warm off-white tone of Paper White is deliberate: pure white would feel clinical and generic; the slight warmth makes long-form sections feel like a well-designed editorial spread rather than a dashboard. Never blend the two stages within a single component — a card is either midnight-stage or paper-stage. The transition between them is always sharp (no gradient bridges) and accompanied by 80px of vertical breathing room.

## Similar Brands

- **Linear** — Same midnight-canvas-to-light-content transition with blue accent CTAs and compact confident Inter-style typography
- **Vercel** — Dark hero stage with centered typographic headline, minimal decoration, and a single vivid blue for primary action
- **Loom** — Warm off-white light sections contrasting with a dark hero, editorial heading scale, and product screenshot as the hero visual
- **Stripe** — Gradient auras around product mockups, multi-layer soft shadows on floating UI screenshots, and blue-violet accent palette in dark mode

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-midnight-ink: #02093a;
  --color-signal-blue: #0075de;
  --color-sky-tint: #62aef0;
  --color-royal-violet: #2537b1;
  --color-periwinkle: #455dd3;
  --color-cerulean: #097fe8;
  --color-paper-white: #f6f5f4;
  --color-pure-white: #ffffff;
  --color-onyx: #000000;
  --color-graphite: #0b0b0b;
  --color-warm-gray: #615d59;
  --color-stone: #a39e98;
  --color-smoke: #c6c6c5;
  --color-faint-line: #dddddd;
  --color-charcoal: #31302e;

  /* Typography — Font Families */
  --font-notioninter: 'NotionInter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-lyon-text: 'Lyon Text', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --tracking-caption: 0.12px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.43;
  --tracking-body-sm: -0.084px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.16px;
  --text-subheading: 20px;
  --leading-subheading: 1.4;
  --tracking-subheading: -0.22px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.33;
  --tracking-heading-sm: -0.264px;
  --text-heading: 40px;
  --leading-heading: 1.2;
  --tracking-heading: -0.88px;
  --text-heading-lg: 54px;
  --leading-heading-lg: 1.04;
  --tracking-heading-lg: -1.89px;
  --text-display: 64px;
  --leading-display: 1;
  --tracking-display: -2.3px;

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
  --spacing-28: 28px;
  --spacing-32: 32px;
  --spacing-36: 36px;
  --spacing-40: 40px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-180: 180px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 24px;
  --element-gap: 16px;

  /* Border Radius */
  --radius-md: 5px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-full: 9999px;

  /* Named Radii */
  --radius-tags: 9999px;
  --radius-cards: 12px;
  --radius-small: 5px;
  --radius-badges: 9999px;
  --radius-inputs: 8px;
  --radius-buttons: 8px;

  /* Shadows */
  --shadow-subtle: rgba(0, 0, 0, 0.01) 0px 1px 3px 0px, rgba(0, 0, 0, 0.02) 0px 3px 7px 0px, rgba(0, 0, 0, 0.02) 0px 7px 15px 0px, rgba(0, 0, 0, 0.04) 0px 14px 28px 0px, rgba(0, 0, 0, 0.05) 0px 23px 52px 0px;

  /* Surfaces */
  --surface-midnight-canvas: #02093a;
  --surface-periwinkle-surface: #455dd3;
  --surface-royal-violet: #2537b1;
  --surface-paper-white: #f6f5f4;
  --surface-pure-white: #ffffff;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-midnight-ink: #02093a;
  --color-signal-blue: #0075de;
  --color-sky-tint: #62aef0;
  --color-royal-violet: #2537b1;
  --color-periwinkle: #455dd3;
  --color-cerulean: #097fe8;
  --color-paper-white: #f6f5f4;
  --color-pure-white: #ffffff;
  --color-onyx: #000000;
  --color-graphite: #0b0b0b;
  --color-warm-gray: #615d59;
  --color-stone: #a39e98;
  --color-smoke: #c6c6c5;
  --color-faint-line: #dddddd;
  --color-charcoal: #31302e;

  /* Typography */
  --font-notioninter: 'NotionInter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-lyon-text: 'Lyon Text', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --tracking-caption: 0.12px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.43;
  --tracking-body-sm: -0.084px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.16px;
  --text-subheading: 20px;
  --leading-subheading: 1.4;
  --tracking-subheading: -0.22px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.33;
  --tracking-heading-sm: -0.264px;
  --text-heading: 40px;
  --leading-heading: 1.2;
  --tracking-heading: -0.88px;
  --text-heading-lg: 54px;
  --leading-heading-lg: 1.04;
  --tracking-heading-lg: -1.89px;
  --text-display: 64px;
  --leading-display: 1;
  --tracking-display: -2.3px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-28: 28px;
  --spacing-32: 32px;
  --spacing-36: 36px;
  --spacing-40: 40px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-180: 180px;

  /* Border Radius */
  --radius-md: 5px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-subtle: rgba(0, 0, 0, 0.01) 0px 1px 3px 0px, rgba(0, 0, 0, 0.02) 0px 3px 7px 0px, rgba(0, 0, 0, 0.02) 0px 7px 15px 0px, rgba(0, 0, 0, 0.04) 0px 14px 28px 0px, rgba(0, 0, 0, 0.05) 0px 23px 52px 0px;
}
```
