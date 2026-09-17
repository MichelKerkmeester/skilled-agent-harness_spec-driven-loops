# BelArosa Chalet — Style Reference
> dusk on alpine vellum

**Theme:** mixed

The BelArosa Chalet system channels alpine luxury through a restrained two-color palette: deep mountain teal (#193741) dominates as the signature surface and structural border color, while warm honey gold (#eac486) appears only in the monogram and decorative accents, never as a functional fill. Typography pairs a humanist sans (Avenir) for all UI, navigation, and body text with a transitional serif (ITC Giovanni) exclusively for editorial headlines — this duality is the site's defining signature, creating an editorial-luxury identity where serif moments feel like pull quotes in a travel magazine. Layout alternates between full-bleed dark teal hero sections and warm parchment content bands, using 80px pill-radius outlined buttons and generous 64–80px section gaps to create a slow, breathing rhythm. The design is flat and architectural: no drop shadows, depth communicated entirely through color contrast and hairline borders. The colorfulness of just 5% is intentional — restraint is the luxury signal.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Mountain Slate | `#193741` | `--color-mountain-slate` | Dominant structural color — hero backgrounds, dark section surfaces, primary text, navigation links, and the most-used border color in the system. The near-gray teal reads as atmospheric depth rather than saturated color |
| Deep Teal | `#1d414d` | `--color-deep-teal` | Slightly lifted variant of Mountain Slate for outlined action borders, hover states, and secondary dark surfaces. Provides subtle differentiation from the primary teal without introducing a new hue family |
| Honey Gold | `#eac486` | `--color-honey-gold` | Yellow decorative accent for icons, marks, and small graphic details. Do not promote it to the primary CTA color |
| Snow White | `#ffffff` | `--color-snow-white` | Primary page canvas, navigation bar, light content section backgrounds, and ghost button text on dark surfaces |
| Warm Parchment | `#ebe7e1` | `--color-warm-parchment` | Cream surface for content bands — sits between pure white and the dark teal sections to create a soft warm middle tone. Reads as aged paper or natural linen |
| Stone Gray | `#8c9ba0` | `--color-stone-gray` | Muted text, secondary borders, and subdued UI elements. A cool desaturated gray that sits comfortably between the warm cream and deep teal |
| Charcoal | `#222222` | `--color-charcoal` | Rare dark accent for button text and select borders where pure black feels too harsh against the teal-and-cream system |
| Ink Black | `#000000` | `--color-ink-black` | Input field borders, fine icon fills. Used sparingly as a true-black anchor |

## Tokens — Typography

### Avenir LT Pro Roman — All UI, navigation, body copy, buttons, form labels, and small headlines up to 28px. The humanist geometry gives the system a calm, European-civic clarity. Uppercase usage carries generous tracking (0.125em–0.167em) for editorial feel. · `--font-avenir-lt-pro-roman`
- **Substitute:** Nunito Sans, Avenir Next, or Mulish
- **Weights:** 400
- **Sizes:** 12px, 14px, 16px, 20px, 24px, 28px, 40px
- **Line height:** 1.0–1.71 (context-dependent: 1.50 for UI labels, 1.40 for body, 1.20–1.25 for larger sans text)
- **Letter spacing:** 0.1250em, 0.1670em
- **Role:** All UI, navigation, body copy, buttons, form labels, and small headlines up to 28px. The humanist geometry gives the system a calm, European-civic clarity. Uppercase usage carries generous tracking (0.125em–0.167em) for editorial feel.

### ITC Giovanni Std Bold — Exclusively for editorial display headlines, section titles, and large pull quotes. The transitional serif with a bold weight creates contrast against the sans body — a serif headline signals "this is a moment" in the page rhythm. Never used below 16px. · `--font-itc-giovanni-std-bold`
- **Substitute:** Playfair Display, Cormorant Garamond, or DM Serif Display
- **Weights:** 700
- **Sizes:** 16px, 18px, 28px, 48px, 64px
- **Line height:** 1.10–1.40 (tight at display sizes: 1.10 at 64px)
- **Role:** Exclusively for editorial display headlines, section titles, and large pull quotes. The transitional serif with a bold weight creates contrast against the sans body — a serif headline signals "this is a moment" in the page rhythm. Never used below 16px.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.5 | 1.5px | `--text-caption` |
| body-sm | 14px | 1.43 | 2.34px | `--text-body-sm` |
| body | 16px | 1.4 | 2px | `--text-body` |
| subheading | 20px | 1.25 | — | `--text-subheading` |
| heading-sm | 24px | 1.2 | — | `--text-heading-sm` |
| heading | 28px | 1.2 | — | `--text-heading` |
| heading-lg | 40px | 1.25 | — | `--text-heading-lg` |
| display | 48px | 1.2 | — | `--text-display` |
| display-lg | 64px | 1.1 | — | `--text-display-lg` |

## Tokens — Spacing & Shapes

**Base unit:** 8px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 8 | 8px | `--spacing-8` |
| 16 | 16px | `--spacing-16` |
| 24 | 24px | `--spacing-24` |
| 32 | 32px | `--spacing-32` |
| 48 | 48px | `--spacing-48` |
| 64 | 64px | `--spacing-64` |
| 80 | 80px | `--spacing-80` |
| 120 | 120px | `--spacing-120` |
| 160 | 160px | `--spacing-160` |
| 240 | 240px | `--spacing-240` |

### Border Radius

| Element | Value |
|---------|-------|
| links | 12px |
| badges | 80px |
| buttons | 80px |
| nav-pills | 80px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 64-80px
- **Card padding:** 32-48px
- **Element gap:** 24px

## Components

### Header Navigation Bar
**Role:** Site-wide top bar

White (#ffffff) background, full-width. Left: hamburger icon + 'MENU' label in Avenir 12px uppercase tracked. Center: BelArosa logo with Honey Gold monogram and dark teal wordmark. Right: globe icon + 'BOOK' outlined pill button. Fixed/sticky position with no shadow.

### Outlined Teal Pill Button (Primary CTA)
**Role:** Primary action button on light surfaces

Border: 1.5px solid #193741. Background: transparent. Text: #193741, Avenir 12–14px uppercase, letter-spacing 0.167em. Border-radius: 80px (full pill). Padding: 12px 28px. Hover: fills with #193741, text becomes #ffffff. Used for 'BOOK', 'Mehr erfahren' on light sections.

### Ghost White Button
**Role:** Action button on dark teal sections

Border: 1.5px solid #ffffff. Background: transparent. Text: #ffffff, Avenir uppercase tracked. Border-radius: 80px. Same padding as teal variant. Hover: fills white, text becomes #193741.

### Hero Section
**Role:** Full-bleed dark opening section

Background: #193741 full-bleed. Centered layout. Small uppercase eyebrow in Avenir 12px white (0.167em tracking) above serif display headline. Headline: ITC Giovanni Bold 48–64px, white, line-height 1.10. Two circular/teal-tinted photograph frames flanking the text. No scroll-indicator border on the image circles — they bleed into the teal canvas.

### Seasonal Badge
**Role:** Floating circular callout

Circular shape, 80px border-radius. Background: #193741. Text: white, Avenir 12–14px centered. Positioned top-left of hero. Functions as a decorative informational medallion.

### Eyebrow Label
**Role:** Small uppercase category marker above headlines

Avenir 12–14px, uppercase, letter-spacing 0.125–0.167em, color matches the section's text color. Examples: 'THE BELAROSA CHALET', 'CUISINE', 'PHILOSOPHY'. Always paired with a serif headline below.

### Sub-Navigation Menu
**Role:** Category links below main nav

Horizontal bar on white or light background. Items: Avenir 12–14px uppercase, letter-spacing 0.125em, color #193741. Items: PHILOSOPHY, CHALETS, CUISINE, WELLNESS, FRIENDS & FAMILY, GALLERY, EXPERIENCES. Active state: Honey Gold underline or subtle border-bottom. Even spacing across the full bar width.

### Split Content Section (Dark)
**Role:** Two-column text + image on dark teal background

Full-bleed #193741 background. 50/50 grid: one side large lifestyle photograph with no border-radius (raw edges into the teal), other side centered text block with eyebrow + serif heading + body paragraph + ghost white CTA. Vertical centering. 64–80px padding top/bottom.

### Editorial Content Card
**Role:** Centered content unit on light sections

Warm Parchment or white background. Centered large photograph (constrained width ~600–700px) above serif headline (ITC Giovanni 28–40px) in #193741. No card border or shadow. Generous whitespace around the unit. 48–64px vertical padding.

### Logo Lockup
**Role:** Brand identity mark

Centered. Monogram 'B' in ITC Giovanni Bold or custom italic serif, Honey Gold #eac486. Below: 'BelArosa' in Avenir or similar geometric sans, #193741, 16–18px, letter-spacing 0.05em. Below: 'CHALET' in Avenir 10px uppercase, #193741, letter-spacing 0.3em. Stacked vertically, centered alignment.

### Cookie Consent Banner
**Role:** Fixed overlay notice

Background: Honey Gold #eac486 at 95% opacity. Fixed bottom-right. Avenir 14px body text in #193741. 'MEHR ERFAHREN' as uppercase tracked link. Close icon (×) top-right. Warm tone signals non-intrusive, on-brand notification.

### Scroll Indicator
**Role:** Bottom-left scroll prompt

Small downward chevron icon in a diamond/rhombus frame, white stroke, with 'SCROLL' label in Avenir 12px uppercase white, letter-spacing 0.167em. Positioned bottom-left of the hero.

## Do's and Don'ts

### Do
- Use 80px border-radius on all buttons, tags, and pill-shaped elements — the full pill is a signature shape, not a stylistic choice
- Pair every serif headline with an uppercase tracked eyebrow label above it — the eyebrow-to-serif rhythm is the editorial structure
- Use Mountain Slate #193741 as both surface color and border color interchangeably — the system blurs the line between background and edge
- Maintain 64–80px vertical gaps between major sections; the design breathes slowly and never feels dense
- Use the sans (Avenir) for all UI, body, and navigation text; the serif (ITC Giovanni) appears only in display headlines 16px and above
- Apply 0.125–0.167em letter-spacing to all uppercase text in Avenir — tight tracking would break the editorial-luxury tone
- Keep the colorfulness at 5% or below; color appears only in the monogram, seasonal badge, and cookie banner — never as a functional fill

### Don't
- Never use drop shadows anywhere in the system — depth comes from color contrast and 1px borders, not elevation
- Never use the Honey Gold #eac486 as a CTA fill, hover state, or interactive surface — it is decorative only
- Never mix the serif and sans within the same text block; they serve distinct roles and must not compete
- Never use the sans for display headlines above 28px — large sans text breaks the serif-pull-quote rhythm
- Never create filled colored buttons; all CTAs are outlined/ghost pills, even the primary action
- Never use the deep teal #1d414d for large surface fills — it is a border and hover-state variant, not a section background
- Never compress section padding below 48px; the slow vertical rhythm is what gives the site its unhurried, luxury pacing

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Snow White Canvas | `#ffffff` | Page background, navigation bar, light content sections |
| 1 | Warm Parchment | `#ebe7e1` | Cream content bands between dark sections, soft alternating rhythm |
| 2 | Mountain Slate | `#193741` | Dark hero, full-bleed section backgrounds (cuisine, philosophy) |
| 3 | Deep Teal | `#1d414d` | Subtle elevation variant for cards or panels on dark teal sections |

## Elevation

Deliberately shadowless. Depth is achieved exclusively through color contrast — dark teal against warm cream creates visual separation, and 1px hairline borders define edges. No drop shadows appear anywhere in the system. This flatness gives the design an architectural, editorial quality rather than a digital-app feel.

## Imagery

Photography dominates the visual language: warm-toned, lifestyle-focused alpine imagery — people relaxing on chalet balconies, food preparation close-ups, natural mountain light. Treatment varies: hero photographs appear in circular frames with a teal color overlay creating a monochromatic mood-board effect, while content section photographs are full-color, warm, and unframed, bleeding into their background. No illustration, no product screenshots, no abstract graphics. Photography is the only visual content beyond typography. Icon style is minimal — thin line icons in white or teal, used sparingly (globe, hamburger, chevron, close). Imagery occupies roughly 50-60% of the visual space in content sections, alternating with text blocks in editorial spreads.

## Layout

Full-bleed dark hero section (100vw) with centered headline over Mountain Slate, flanked by two circular photo insets. Below the hero, a fixed white navigation bar with horizontal sub-menu. Content sections alternate between dark teal full-bleed bands and warm parchment/white contained sections. Dark sections use 2-column split layouts (50/50, text + full-bleed-edge photograph). Light sections use centered editorial stacks (single image, then serif title below) or generous 2-column arrangements. Section gaps are large (64–80px), creating a slow vertical rhythm. Grid usage is minimal — most layouts are 1 or 2 columns, with no card grids or masonry. The overall density is spacious and editorial, never information-dense. Navigation is a top bar (sticky) with a sub-category row below it.

## Agent Prompt Guide

**Quick Color Reference**
- text: #193741
- background: #ffffff
- border: #193741
- accent: #eac486
- dark surface: #193741
- primary action: #1d414d (outlined action border)

**3 Example Component Prompts**

1. Create a hero section: full-bleed #193741 background, centered. Eyebrow in Avenir 12px uppercase white, letter-spacing 0.167em. Display headline in ITC Giovanni Bold 64px white, line-height 1.10: 'Nestled in nature'. Two circular photo insets (200px diameter) on left and right with a teal overlay. Scroll indicator (chevron + 'SCROLL' label in Avenir 12px white) at bottom-left.

2. Create a dark cuisine section: full-bleed #193741 background, 50/50 grid. Left: large food-prep photograph with raw edges into the teal, no border-radius. Right: centered text block. Eyebrow: 'CUISINE' in Avenir 14px uppercase white, letter-spacing 0.125em. Heading: 'Only the finest: our dining philosophy.' in ITC Giovanni Bold 40px white. Body paragraph: Avenir 16px white at line-height 1.40. Ghost white outlined button: border 1.5px #ffffff, border-radius 80px, padding 12px 28px, text 'Mehr erfahren' in Avenir 12px uppercase white.

3. Create an editorial content card on light section: #ffffff background, max-width 700px centered. Full-width lifestyle photograph (mountain balcony scene) above. Title below: 'Summer Escape' in ITC Giovanni Bold 28px, #193741, centered. No border, no shadow, no card background — the whitespace IS the card.

## Similar Brands

- **Aman Resorts** — Same editorial-luxury approach: full-bleed dark sections alternating with warm cream content bands, serif display headlines, and ultra-restrained color palettes where a single accent appears only in the monogram.
- **Belmond** — Shared dual-typeface system pairing a geometric sans for UI with a transitional serif for editorial headlines, plus the same generous 64–80px section padding and pill-shaped outlined CTAs.
- **Six Senses Hotels** — Same architectural flatness — no drop shadows, depth from color contrast and hairline borders — combined with uppercase-tracked navigation labels and nature-driven lifestyle photography.
- **The Chedi Andermatt** — Mountain hospitality aesthetic with dark teal/forest brand color, warm parchment surfaces, and the same slow vertical rhythm that lets photography and serif typography breathe.
- **Rosewood Hotels** — Editorial magazine-style layout with centered serif headlines over generous whitespace, and a near-achromatic palette that lets lifestyle photography carry the color.

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-mountain-slate: #193741;
  --color-deep-teal: #1d414d;
  --color-honey-gold: #eac486;
  --color-snow-white: #ffffff;
  --color-warm-parchment: #ebe7e1;
  --color-stone-gray: #8c9ba0;
  --color-charcoal: #222222;
  --color-ink-black: #000000;

  /* Typography — Font Families */
  --font-avenir-lt-pro-roman: 'Avenir LT Pro Roman', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-itc-giovanni-std-bold: 'ITC Giovanni Std Bold', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --tracking-caption: 1.5px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.43;
  --tracking-body-sm: 2.34px;
  --text-body: 16px;
  --leading-body: 1.4;
  --tracking-body: 2px;
  --text-subheading: 20px;
  --leading-subheading: 1.25;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.2;
  --text-heading: 28px;
  --leading-heading: 1.2;
  --text-heading-lg: 40px;
  --leading-heading-lg: 1.25;
  --text-display: 48px;
  --leading-display: 1.2;
  --text-display-lg: 64px;
  --leading-display-lg: 1.1;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-unit: 8px;
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-120: 120px;
  --spacing-160: 160px;
  --spacing-240: 240px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 64-80px;
  --card-padding: 32-48px;
  --element-gap: 24px;

  /* Border Radius */
  --radius-xl: 12px;
  --radius-full: 80px;

  /* Named Radii */
  --radius-links: 12px;
  --radius-badges: 80px;
  --radius-buttons: 80px;
  --radius-nav-pills: 80px;

  /* Surfaces */
  --surface-snow-white-canvas: #ffffff;
  --surface-warm-parchment: #ebe7e1;
  --surface-mountain-slate: #193741;
  --surface-deep-teal: #1d414d;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-mountain-slate: #193741;
  --color-deep-teal: #1d414d;
  --color-honey-gold: #eac486;
  --color-snow-white: #ffffff;
  --color-warm-parchment: #ebe7e1;
  --color-stone-gray: #8c9ba0;
  --color-charcoal: #222222;
  --color-ink-black: #000000;

  /* Typography */
  --font-avenir-lt-pro-roman: 'Avenir LT Pro Roman', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-itc-giovanni-std-bold: 'ITC Giovanni Std Bold', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --tracking-caption: 1.5px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.43;
  --tracking-body-sm: 2.34px;
  --text-body: 16px;
  --leading-body: 1.4;
  --tracking-body: 2px;
  --text-subheading: 20px;
  --leading-subheading: 1.25;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.2;
  --text-heading: 28px;
  --leading-heading: 1.2;
  --text-heading-lg: 40px;
  --leading-heading-lg: 1.25;
  --text-display: 48px;
  --leading-display: 1.2;
  --text-display-lg: 64px;
  --leading-display-lg: 1.1;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-120: 120px;
  --spacing-160: 160px;
  --spacing-240: 240px;

  /* Border Radius */
  --radius-xl: 12px;
  --radius-full: 80px;
}
```
