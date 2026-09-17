# wix.com — Style Reference
> Daylight gallery wall with electric blue signposts

**Theme:** light

Wix's visual system reads as a spacious, air-filled workspace on a bright white canvas, where oversized headlines in the custom Madefor Display typeface set a confident but airy tone. The palette is overwhelmingly achromatic — black text, white surfaces, hairline gray borders — with a single saturated electric blue (#166aea) reserved for primary action buttons and a secondary black-filled pill as the alternative action. Color appears as intentional punctuation: a lime-green surface wash, a soft lavender gradient, a yellow highlight, a violet accent — each used sparingly to mark sections, not to decorate. Components are flat, rounded, and lightweight: pill buttons at 50px radius, cards at 20px, images at 8.9px, minimal shadows. The grid breathes — generous section gaps near 80px, centered hero compositions, alternating product mockups that feel like editorial spreads rather than SaaS screenshots.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Pure Canvas | `#ffffff` | `--color-pure-canvas` | Neutral form states, badge text, and quiet UI feedback where color should stay understated. Do not promote it to the primary CTA color |
| Slate Mist | `#f1f5f9` | `--color-slate-mist` | Elevated surface tier, input backgrounds, subtle section panels |
| Carbon Ink | `#000000` | `--color-carbon-ink` | Primary text, icon strokes, borders, dark button fills — the typographic and structural black |
| Graphite | `#1c1d21` | `--color-graphite` | Headline text alternative — slightly softened black for display type where pure black feels too clinical |
| Ash Border | `#d0d0d0` | `--color-ash-border` | Hairline dividers, card borders, structural separators |
| Fog Border | `#e8e6e6` | `--color-fog-border` | Subtle borders on less prominent elements |
| Electric Blue | `#166aea` | `--color-electric-blue` | Primary action button fill, selected nav indicator, link accents — the only saturated action color in the system |
| Deep Violet | `#101585` | `--color-deep-violet` | Brand violet for headings, link underlines, decorative accent — anchors the identity when blue is too functional |
| Indigo Pulse | `#2c34af` | `--color-indigo-pulse` | Gradient endpoint, section heading accent — lighter companion to Deep Violet for layered brand moments |
| Lime Highlight | `#dff994` | `--color-lime-highlight` | Surface wash, background tints, decorative highlight zones — injects energy into otherwise monochrome sections |
| Lemon Note | `#fdf4a1` | `--color-lemon-note` | Subtle highlight wash on text and borders, callout markers — warm counterpoint to cool brand colors |
| Lavender Mist | `#bfc8e8` | `--color-lavender-mist` | Soft section background gradient start, card shadow tint — atmospheric color for gradient washes |
| Input Blue | `#538ab6` | `--color-input-blue` | Input border on focus/active state — cool desaturated blue for form interactivity |

## Tokens — Typography

### Arial — System fallback for icon labels, micro-UI tags, and utility text at 10–13px. Functions as the safety net for extremely small UI where custom fonts may not load. · `--font-arial`
- **Substitute:** system-ui or Arial
- **Weights:** 400
- **Sizes:** 10px, 13px
- **Line height:** 1.20
- **Role:** System fallback for icon labels, micro-UI tags, and utility text at 10–13px. Functions as the safety net for extremely small UI where custom fonts may not load.

### madefor-display — All display headlines from 21px sub-headings up to 184px hero text. Geometric, slightly condensed sans-serif with wide apertures. The negative letter-spacing (-0.01em to -0.03em) tightens as size grows, creating a distinctive compressed display look at 82–184px. Substantial line-height range (0.85 at 184px) lets oversized type sit close together — a signature of editorial display use. · `--font-madefor-display`
- **Substitute:** Inter, DM Sans, or Space Grotesk
- **Weights:** 400
- **Sizes:** 10px, 13px, 14px, 16px, 21px, 24px, 31px, 48px, 82px, 89px, 104px, 184px
- **Line height:** 0.85, 1.00, 1.10, 1.20, 1.30, 1.40, 1.48, 1.50, 1.60
- **Letter spacing:** -0.03em at 82px+, -0.02em at 31–48px, -0.01em at 21–24px
- **Role:** All display headlines from 21px sub-headings up to 184px hero text. Geometric, slightly condensed sans-serif with wide apertures. The negative letter-spacing (-0.01em to -0.03em) tightens as size grows, creating a distinctive compressed display look at 82–184px. Substantial line-height range (0.85 at 184px) lets oversized type sit close together — a signature of editorial display use.

### madefor-text — Body text, nav links, list items, input fields, descriptions. Slightly looser than display at -0.01em. Generous line-heights (1.5–1.71) give body copy an airy, readable cadence. Pairs with display variant to create typographic contrast without switching families. · `--font-madefor-text`
- **Substitute:** Inter, IBM Plex Sans, or Noto Sans
- **Weights:** 400
- **Sizes:** 10px, 13px, 14px, 15px, 16px, 18px, 21px, 25px
- **Line height:** 1.29, 1.30, 1.50, 1.60, 1.71
- **Letter spacing:** -0.0100em
- **Role:** Body text, nav links, list items, input fields, descriptions. Slightly looser than display at -0.01em. Generous line-heights (1.5–1.71) give body copy an airy, readable cadence. Pairs with display variant to create typographic contrast without switching families.

### madefor-text-mediumbold — Semi-emphasis body and small headings (12–24px). Functions as the medium weight for nav, subheadings, and labeled sections where extra weight is needed without going to a full bold. · `--font-madefor-text-mediumbold`
- **Substitute:** Inter Medium, or DM Sans Medium
- **Weights:** 400
- **Sizes:** 12px, 14px, 15px, 16px, 18px, 20px, 21px, 23px, 24px
- **Line height:** 1.10, 1.20, 1.30, 1.50, 1.60, 1.71
- **Letter spacing:** -0.0100em
- **Role:** Semi-emphasis body and small headings (12–24px). Functions as the medium weight for nav, subheadings, and labeled sections where extra weight is needed without going to a full bold.

### wix-madefor-display-v2 — Alternate display variant for section headings at 53px and body emphasis at 20–21px. Provides a slightly different geometry for variety within sections. · `--font-wix-madefor-display-v2`
- **Substitute:** Inter or Space Grotesk
- **Weights:** 400, 500
- **Sizes:** 20px, 21px, 53px
- **Line height:** 1.00, 1.10, 1.20
- **Role:** Alternate display variant for section headings at 53px and body emphasis at 20–21px. Provides a slightly different geometry for variety within sections.

### wix-madefor-text-v2 — Secondary text body for links and supporting copy where the primary text variant is too dense. · `--font-wix-madefor-text-v2`
- **Substitute:** Inter or DM Sans
- **Weights:** 400
- **Sizes:** 15px, 21px
- **Line height:** 1.30, 1.35, 1.50
- **Role:** Secondary text body for links and supporting copy where the primary text variant is too dense.

### madefor-text-bold — madefor-text-bold — detected in extracted data but not described by AI · `--font-madefor-text-bold`
- **Weights:** 400
- **Sizes:** 15px
- **Line height:** 1.6
- **Role:** madefor-text-bold — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 13px | 1.2 | -0.13px | `--text-caption` |
| body | 16px | 1.5 | -0.16px | `--text-body` |
| subheading | 21px | 1.3 | -0.21px | `--text-subheading` |
| heading-sm | 31px | 1.2 | -0.62px | `--text-heading-sm` |
| heading | 48px | 1.1 | -0.96px | `--text-heading` |
| heading-lg | 82px | 1 | -2.46px | `--text-heading-lg` |
| display | 104px | 0.95 | -3.12px | `--text-display` |

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
| 36 | 36px | `--spacing-36` |
| 40 | 40px | `--spacing-40` |
| 44 | 44px | `--spacing-44` |
| 48 | 48px | `--spacing-48` |
| 52 | 52px | `--spacing-52` |
| 68 | 68px | `--spacing-68` |
| 84 | 84px | `--spacing-84` |
| 144 | 144px | `--spacing-144` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 20px |
| cards | 20px |
| images | 8.9px |
| buttons | 50px |
| navPills | 50px |
| buttonsAlt | 20px |
| cardsSmall | 8.9px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| subtle | `rgba(0, 0, 0, 0.1) 0px -1px 0px 0px` | `--shadow-subtle` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 24px
- **Element gap:** 12px

## Components

### Primary Action Button
**Role:** Main CTA (Get Started, Sign Up)

Filled electric blue (#166aea) with white text. Pill shape at 50px border-radius. Padding 12px right/left, Madefor Text 16px. Single chromatic action in the system — use sparingly, one per section maximum.

### Secondary Action Button
**Role:** Alternative CTA when primary is unavailable

Filled black (#000000) with white text. Same 50px pill radius, 12px horizontal padding, Madefor Text 16px. Sits next to or replaces the blue primary on dark-background sections.

### Ghost Button
**Role:** Tertiary action, navigation controls

Transparent background with 1px border (#000000 or contextual color), Madefor Text 15–16px. 50px pill radius. Used for less important actions or on sections with strong colored backgrounds.

### Rounded Button (20px)
**Role:** Compact action for cards and tight layouts

20px border-radius variant of the action buttons. Same color system (blue/black/ghost) but with a softer rectangular feel. Common in card overlays and inline actions.

### Template Preview Card
**Role:** Showcase website templates in grid

20px border-radius, 8.9px inner image radius, no visible border, soft shadow. Image fills most of card with a small text label below (eCommerce →, Portfolio →). Arranged in 4-column grid on desktop.

### Product Mockup Card
**Role:** Display product UI screenshots in hero/sections

8.9px border-radius for sharp tech feel, subtle border or no border, sits directly on canvas. Often shows browser chrome (URL bar, page controls) to feel like a real product capture.

### Navigation Bar
**Role:** Top-level site navigation

Transparent or white background, Wix logo left, nav items center (Product, Solutions, Resources, Pricing), utility items right (Login, Get Started). Clean horizontal layout with dropdown indicators (▾). Get Started is a blue pill button, Login is a ghost text link.

### Input Field
**Role:** Text input for prompts, search, forms

White or Slate Mist (#f1f5f9) background, 1px border transitioning to #538ab6 on focus, Madefor Text 15–16px. 8–12px border-radius. Placeholder text in light gray. Rounded but not pill-shaped.

### Hero Headline Block
**Role:** Page-level H1 with subtitle

Centered or left-aligned Madefor Display 82–104px, line-height 0.95–1.0, letter-spacing -2.46 to -3.12px. Subtitle in Madefor Text 18–21px below. CTA button positioned below subtitle with 24–32px gap.

### Section Heading
**Role:** H2 for content sections

Madefor Display 48px, line-height 1.1, letter-spacing -0.96px. Left-aligned with supporting paragraph to the right or below. Sets a quieter tone than hero display.

### Gradient Section Background
**Role:** Atmospheric section differentiation

Vertical or angled gradient from Lavender Mist (#bfc8e8) fading to white. Applied as full-bleed background to alternate sections, creating visual rhythm without hard dividers.

### Badge / Tag
**Role:** Category labels, status indicators

Small pill or 20px-radius tag with optional colored fill. Madefor Text 13–14px. Used for template categories, feature tags, and metadata. Often appears as ghost (border only) rather than filled.

### Side Panel (AI Assistant)
**Role:** Contextual tools panel (Aria AI)

White card on right side of screen, subtle shadow or border, 20px radius. Contains chat interface or tool controls. Fixed positioning, collapsible. Header with close button.

## Do's and Don'ts

### Do
- Use Madefor Display at 48–104px for all headlines; the negative letter-spacing (-0.02em to -0.03em) is signature
- Reserve #166aea electric blue exclusively for primary action buttons; never use it for text, icons, or decoration
- Set border-radius to 50px for all interactive buttons and tags — the pill shape is a defining system trait
- Apply generous section gaps of 80px between content blocks; the air-filled rhythm is critical to the feel
- Use the Lavender Mist gradient (#bfc8e8 → white) as a full-bleed section background to break up white-on-white sections
- Set images and product mockups to 8.9px border-radius for a slightly rounded tech-product feel
- Pair black filled buttons with blue filled buttons as the two-tier action system; never use three different button fill colors in one section

### Don't
- Don't use Deep Violet (#101585) or Indigo Pulse (#2c34af) for action buttons — they are brand/heading colors only
- Don't add visible drop shadows to cards or buttons; the system relies on flat surfaces with hairline borders, not elevation
- Don't use border-radius below 8px on cards or 20px on buttons — sharp corners break the rounded, friendly tone
- Don't set headline line-height above 1.2 at 48px+; the tight leading (0.95–1.1) is what makes the display type feel editorial
- Don't apply Lime Highlight (#dff994) or Lemon Note (#fdf4a1) to text longer than a word; they are wash/accent colors, not text backgrounds
- Don't introduce new accent colors beyond the defined palette; the system's restraint is its strength
- Don't center body text longer than a subtitle; the layout is left-aligned for paragraphs and right-aligned for supporting metadata

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas | `#ffffff` | Primary page background, default state for all sections |
| 1 | Mist | `#f1f5f9` | Elevated panels, input fields, subtle section differentiation |
| 2 | Lime Wash | `#dff994` | Accent surface for highlight sections, feature callouts |
| 3 | Lavender Fade | `#bfc8e8` | Gradient section backgrounds, atmospheric color zones |

## Elevation

- **Navigation bar:** `rgba(0, 0, 0, 0.1) 0px -1px 0px 0px`

## Imagery

Product mockups dominate the visual language: browser-framed screenshots of the Wix editor, template previews with real photography (furniture, fashion, architecture), and UI captures showing the AI prompt interface. Photography is lifestyle-oriented for templates (eCommerce, portfolio examples) and product-focused for the editor demos. Gradients are abstract and atmospheric — soft lavender washes and periwinkle glows that fill hero spaces without competing with content. No heavy illustration system; visuals are either real UI captures or smooth gradient backgrounds. Icons are minimal, mostly stroke-based at 1px, appearing in nav and feature lists.

## Layout

Max-width 1200px centered content with full-bleed gradient sections. Hero is left-aligned headline + centered subtitle, CTA below. Alternating section rhythm: white canvas → lavender gradient → white canvas. Content blocks use a 2-column pattern (headline left, supporting text + CTA right) for feature sections. Template gallery is a 4-column equal-width grid. Generous vertical breathing room — 80px between sections, 24–32px between elements within sections. Navigation is a single horizontal bar, transparent on hero, white on scroll. Product mockups are centered below their headline, often overlapping into the next section's gradient to create flow.

## Agent Prompt Guide

**Quick Color Reference:**
- text: #000000
- background: #ffffff
- border: #d0d0d0
- accent: #dff994 (lime wash)
- primary action: #000000 (filled action)
- brand violet: #101585

**3-5 Example Component Prompts:**

1. Create a Primary Action Button: #000000 background, #ffffff text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.

2. Create a template gallery section: white background. Section heading at 48px madefor-display, #000000, letter-spacing -0.96px. 4-column grid of template cards (20px radius, no border, 8.9px image radius). Each card has a label below in madefor-text 16px with an arrow (→).


4. Create a navigation bar: white background, transparent until scroll. Wix logo left, nav links center (madefor-text 15px, #000000), Login ghost link + blue Get Started pill button right (50px radius, #166aea).

5. Create an input field for AI prompt: white background, 1px border #d0d0d0 transitioning to #538ab6 on focus, 8px border-radius, madefor-text 16px placeholder text in gray. Blue generate button (50px radius, #166aea) inside or adjacent.

## Typography Philosophy

The Madefor font family (custom, Wix-internal) defines the brand's typographic identity. Display variant for headlines, Text variant for body, both sharing geometric DNA but optimized for their roles. Key signatures: (1) negative letter-spacing intensifies with size — -0.01em at body, -0.02em at subheadings, -0.03em at display 82px+. (2) Display line-height compresses to 0.85–1.0 at 104–184px, creating editorial density. (3) Weight stays at 400 throughout — no bold variants. The absence of bold is deliberate; hierarchy comes from size, spacing, and letter-spacing, not weight. This creates a quiet, confident voice that contrasts with the loud display type.

## Gradient System

Gradients serve as atmospheric section dividers, not decoration. Two primary patterns: (1) vertical fades from Lavender Mist (#bfc8e8) to white — used for full-bleed section backgrounds to break white-on-white monotony. (2) Brand gradients (Deep Violet → Lime → Deep Violet at 106deg) — used sparingly for special banners or accent elements. The Periwinkle Glow gradient (#8fa3ff → #bdc9ff) appears in hero backgrounds as a subtle blue warmth. All gradients are low-saturation and low-contrast — they should feel like light, not color.

## Similar Brands

- **Squarespace** — Same oversized serif/sans-serif display headlines, generous white space, single-color accent strategy, and template-driven hero compositions
- **Linear** — Shared pill-button geometry, monochrome-dominant palette with one electric accent color, and the discipline of flat surfaces without shadows
- **Figma** — Similar spacious landing pages with large editorial display type, gradient section backgrounds, and a product-mockup-as-hero approach
- **Webflow** — Same visual rhythm — centered/left-aligned headlines over product screenshots, pill-shaped CTAs, and the template gallery grid pattern
- **Framer** — Shared custom geometric sans-serif typography, black-and-white-first design with strategic color pops, and the spacious editorial layout language

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-pure-canvas: #ffffff;
  --color-slate-mist: #f1f5f9;
  --color-carbon-ink: #000000;
  --color-graphite: #1c1d21;
  --color-ash-border: #d0d0d0;
  --color-fog-border: #e8e6e6;
  --color-electric-blue: #166aea;
  --color-deep-violet: #101585;
  --color-indigo-pulse: #2c34af;
  --color-lime-highlight: #dff994;
  --color-lemon-note: #fdf4a1;
  --color-lavender-mist: #bfc8e8;
  --color-input-blue: #538ab6;

  /* Typography — Font Families */
  --font-arial: 'Arial', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-madefor-display: 'madefor-display', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-madefor-text: 'madefor-text', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-madefor-text-mediumbold: 'madefor-text-mediumbold', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-wix-madefor-display-v2: 'wix-madefor-display-v2', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-wix-madefor-text-v2: 'wix-madefor-text-v2', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-madefor-text-bold: 'madefor-text-bold', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 13px;
  --leading-caption: 1.2;
  --tracking-caption: -0.13px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.16px;
  --text-subheading: 21px;
  --leading-subheading: 1.3;
  --tracking-subheading: -0.21px;
  --text-heading-sm: 31px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: -0.62px;
  --text-heading: 48px;
  --leading-heading: 1.1;
  --tracking-heading: -0.96px;
  --text-heading-lg: 82px;
  --leading-heading-lg: 1;
  --tracking-heading-lg: -2.46px;
  --text-display: 104px;
  --leading-display: 0.95;
  --tracking-display: -3.12px;

  /* Typography — Weights */
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
  --spacing-36: 36px;
  --spacing-40: 40px;
  --spacing-44: 44px;
  --spacing-48: 48px;
  --spacing-52: 52px;
  --spacing-68: 68px;
  --spacing-84: 84px;
  --spacing-144: 144px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 24px;
  --element-gap: 12px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8.90625px;
  --radius-lg-2: 11px;
  --radius-xl: 14.4px;
  --radius-2xl: 20px;
  --radius-2xl-2: 22.2656px;
  --radius-3xl: 24.4922px;
  --radius-3xl-2: 29.6875px;
  --radius-3xl-3: 33px;
  --radius-3xl-4: 40px;
  --radius-full: 50px;
  --radius-full-2: 59.375px;
  --radius-full-3: 89.0625px;
  --radius-full-4: 99px;
  --radius-full-5: 667.969px;
  --radius-full-6: 999px;

  /* Named Radii */
  --radius-tags: 20px;
  --radius-cards: 20px;
  --radius-images: 8.9px;
  --radius-buttons: 50px;
  --radius-navpills: 50px;
  --radius-buttonsalt: 20px;
  --radius-cardssmall: 8.9px;

  /* Shadows */
  --shadow-subtle: rgba(0, 0, 0, 0.1) 0px -1px 0px 0px;

  /* Surfaces */
  --surface-canvas: #ffffff;
  --surface-mist: #f1f5f9;
  --surface-lime-wash: #dff994;
  --surface-lavender-fade: #bfc8e8;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-pure-canvas: #ffffff;
  --color-slate-mist: #f1f5f9;
  --color-carbon-ink: #000000;
  --color-graphite: #1c1d21;
  --color-ash-border: #d0d0d0;
  --color-fog-border: #e8e6e6;
  --color-electric-blue: #166aea;
  --color-deep-violet: #101585;
  --color-indigo-pulse: #2c34af;
  --color-lime-highlight: #dff994;
  --color-lemon-note: #fdf4a1;
  --color-lavender-mist: #bfc8e8;
  --color-input-blue: #538ab6;

  /* Typography */
  --font-arial: 'Arial', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-madefor-display: 'madefor-display', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-madefor-text: 'madefor-text', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-madefor-text-mediumbold: 'madefor-text-mediumbold', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-wix-madefor-display-v2: 'wix-madefor-display-v2', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-wix-madefor-text-v2: 'wix-madefor-text-v2', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-madefor-text-bold: 'madefor-text-bold', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 13px;
  --leading-caption: 1.2;
  --tracking-caption: -0.13px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.16px;
  --text-subheading: 21px;
  --leading-subheading: 1.3;
  --tracking-subheading: -0.21px;
  --text-heading-sm: 31px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: -0.62px;
  --text-heading: 48px;
  --leading-heading: 1.1;
  --tracking-heading: -0.96px;
  --text-heading-lg: 82px;
  --leading-heading-lg: 1;
  --tracking-heading-lg: -2.46px;
  --text-display: 104px;
  --leading-display: 0.95;
  --tracking-display: -3.12px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-36: 36px;
  --spacing-40: 40px;
  --spacing-44: 44px;
  --spacing-48: 48px;
  --spacing-52: 52px;
  --spacing-68: 68px;
  --spacing-84: 84px;
  --spacing-144: 144px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8.90625px;
  --radius-lg-2: 11px;
  --radius-xl: 14.4px;
  --radius-2xl: 20px;
  --radius-2xl-2: 22.2656px;
  --radius-3xl: 24.4922px;
  --radius-3xl-2: 29.6875px;
  --radius-3xl-3: 33px;
  --radius-3xl-4: 40px;
  --radius-full: 50px;
  --radius-full-2: 59.375px;
  --radius-full-3: 89.0625px;
  --radius-full-4: 99px;
  --radius-full-5: 667.969px;
  --radius-full-6: 999px;

  /* Shadows */
  --shadow-subtle: rgba(0, 0, 0, 0.1) 0px -1px 0px 0px;
}
```
