# Join Parker — Style Reference
> Banker's ledger meets indie magazine — white paper, electric blue ink, one italic flourish that rewrites the headline.

**Theme:** light

Parker operates as a confident fintech command center: white parchment canvas, single electric-blue primary, and a quiet italic serif that interrupts the all-sans orthodoxy. The dual-typeface system — Inter for everything functional, Gambetta italic for a single word of emphasis — is the signature: a sans headline reads as utility, but 'Powers Your Growth' in italic serif turns the value prop into editorial copy. Components are generously rounded (24px cards, 9999px pills) giving the dense financial UI a soft, approachable feel. A full-bleed electric-blue feature section breaks the white rhythm and re-establishes the brand as the visual anchor. Color is used sparingly and functionally: blue for action and brand surfaces, orange for one conversion-critical CTA, warm parchment and sand for soft surfaces that keep the page from feeling sterile.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Electric Blue | `#5196fe` | `--color-electric-blue` | Primary brand color — filled CTAs, full-bleed feature section background, icon accents, the credit card product visual's gradient. Carries 80% of brand recognition |
| Ember Orange | `#f9754e` | `--color-ember-orange` | Orange action color for filled buttons, selected navigation states, and focused conversion moments. |
| Ink Black | `#1b1d20` | `--color-ink-black` | Primary text, dark card surfaces (the credit card mockup, the dark feature section), heavy borders. Not pure black — sits slightly warm |
| Midnight | `#101828` | `--color-midnight` | Secondary text and dark borders when Ink Black feels too heavy in tight contexts |
| Paper White | `#ffffff` | `--color-paper-white` | Primary canvas, card surfaces, button text, input fills — the bright default that lets blue and orange speak |
| Parchment | `#f2f1ec` | `--color-parchment` | Warm card surface alternative — used when a card needs to feel softer than pure white, typically for feature blocks or stat panels |
| Sand | `#e1dfd8` | `--color-sand` | Warm hairline border, parchment-adjacent dividers, subtle card outlines that need warmth without darkness |
| Graphite | `#27272a` | `--color-graphite` | Border color for dark elements, secondary dividers on dark surfaces |
| Steel | `#6e6e6e` | `--color-steel` | Muted helper text, quiet borders, icon strokes that need to recede |
| Ash | `#797876` | `--color-ash` | Muted text and borders on warm surfaces, slightly lighter than Steel for secondary hierarchy |
| Fog | `#a3a3a3` | `--color-fog` | Input default border — the resting state before focus activates the Electric Blue ring |

## Tokens — Typography

### Inter — Primary typeface for all functional UI: body, nav, buttons, labels, stats, card titles. Weight 600 for headings, 500 for sub-labels, 400 for body, 700 for stat numbers. The workhorse that does 95% of the work. · `--font-inter`
- **Substitute:** DM Sans, IBM Plex Sans
- **Weights:** 400, 500, 600, 700
- **Sizes:** 14, 16, 18, 19, 20, 32, 48, 64
- **Line height:** 1.05–1.55
- **Letter spacing:** -0.1000em, -0.0600em, -0.0300em, -0.0230em, -0.0200em, 0.0080em
- **Role:** Primary typeface for all functional UI: body, nav, buttons, labels, stats, card titles. Weight 600 for headings, 500 for sub-labels, 400 for body, 700 for stat numbers. The workhorse that does 95% of the work.

### Gambetta — Italic display serif reserved for the single most important word in the hero headline — a deliberate voice break that turns a product descriptor into editorial copy. Used at most once per page. · `--font-gambetta`
- **Substitute:** Source Serif 4 Italic, Newsreader Italic
- **Weights:** 500
- **Sizes:** 51, 64
- **Line height:** 1.05, 1.16
- **Letter spacing:** -0.04em at 51px, -0.08em at 64px
- **Role:** Italic display serif reserved for the single most important word in the hero headline — a deliberate voice break that turns a product descriptor into editorial copy. Used at most once per page.

### system-ui — system-ui — detected in extracted data but not described by AI · `--font-system-ui`
- **Weights:** 400, 500, 600
- **Sizes:** 14px, 16px
- **Line height:** 1.42, 1.5
- **Role:** system-ui — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 14px | 1.5 | -0.14px | `--text-caption` |
| body-sm | 16px | 1.5 | -0.32px | `--text-body-sm` |
| body | 18px | 1.43 | -0.36px | `--text-body` |
| subheading | 20px | 1.42 | -0.46px | `--text-subheading` |
| heading-sm | 32px | 1.16 | -0.96px | `--text-heading-sm` |
| heading | 48px | 1.13 | -2.88px | `--text-heading` |
| display | 64px | 1.05 | -6.4px | `--text-display` |

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
| 64 | 64px | `--spacing-64` |
| 80 | 80px | `--spacing-80` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 24px |
| badges | 12.8px |
| inputs | 12.8px |
| buttons | 9999px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| md | `rgba(0, 0, 0, 0.1) 0px 2px 10px 0px` | `--shadow-md` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 64-80px
- **Card padding:** 24px
- **Element gap:** 8-16px

## Components

### Primary Pill Button
**Role:** Main conversion action

Electric Blue (#5196fe) fill, white text, 9999px border-radius, 16px 24px padding, Inter 500 at 16px. Used for the dominant action on a page — 'Get Started', 'Sign Up'. The pill shape (1584px radius) is the most repeated shape on the site.

### Ember CTA Button
**Role:** High-stakes conversion accent

Ember Orange (#f9754e) fill, white text, 9999px border-radius, 16px 24px padding. Used sparingly — at most once per page — to break the blue monotony on a critical conversion moment. The orange CTA in the hero email capture is the canonical example.

### Ghost Pill Button
**Role:** Secondary navigation action

Transparent fill, Ink Black (#1b1d20) 1px border, Ink Black text, 9999px border-radius, 16px 24px padding. Used for 'Sign In' in the header and other non-primary navigation actions.

### Email Input
**Role:** Hero email capture and form fields

White fill, Fog (#a3a3a3) 1px border, 12.8px border-radius, 16px vertical padding, Inter 400 at 16px. Focus state tightens to Electric Blue border. Always paired inline with a primary pill button.

### Feature Card
**Role:** Product capability showcase on blue background

White fill, 24px border-radius, 24px padding. Contains a rounded-square Electric Blue icon at top-left, bold subheading (Inter 600, 18-20px, Ink Black), supporting body text (Inter 400, 16px, Steel). Lifts off the blue background purely by color contrast — no shadow.

### Stat Block
**Role:** Quantitative proof points

Large stat number in Inter 700 at 48-64px, Ink Black, with tight -0.06em tracking. Caption below in Inter 400 at 14px, Steel, with optional superscript footnote marker. Arranged in a 4-column row, separated by thin vertical dividers.

### Announcement Banner
**Role:** Top-of-page funding/news strip

Electric Blue (#5196fe) full-bleed bar, white text at 14px Inter 500, centered. Includes a 'Learn more' link (white, underlined) and a dismiss 'x' icon. 40-48px vertical height.

### Credit Card Product Visual
**Role:** Hero showcase of the actual product

Dark Ink Black card body with a multi-color gradient overlay (blue → orange → pink/coral). Realistic card proportions (~1.586:1 ratio), 20-24px border-radius, sits inside a light blue rounded container in the hero. This is the brand's most distinctive visual asset.

### Dark Section Panel
**Role:** Contrast block between white sections

Full-bleed Ink Black (#1b1d20) background, white text, 24px inner radius on contained content blocks. Used to create vertical rhythm breaks — the 'financial system wasn't built for internet businesses' section is the pattern.

### Feature Icon Tile
**Role:** Icon-first category markers in feature cards

Rounded square (12-16px radius) Electric Blue fill at low opacity or with the icon as Electric Blue stroke on white. Small (40-48px), sits above card title. Two-tone: blue icon container, darker blue or black glyph.

### Navigation Header
**Role:** Sticky top navigation

White background, Ink Black wordmark 'Parker' at 500 weight 20px, horizontal nav links (Home, Treasury, Cards, Bill Pay, Intelligence, Blog) in Inter 500 16px Steel. Ghost 'Sign In' pill button anchored right.

### Tagline Badge
**Role:** Pre-headline context pill

Ink Black (#1b1d20) fill, white text, 12.8px border-radius, 8px 12px padding, Inter 500 at 14px. Contains a small icon (e.g., business briefcase) before the text. Used above hero headlines to set context — 'Join +1000 scaling businesses'.

## Do's and Don'ts

### Do
- Use Inter for all functional text. Reserve Gambetta italic for at most one word per headline, always in the most semantically loaded position.
- Use 9999px border-radius (1584px token) for all buttons, tags, and pill-shaped controls. This is the site's most repeated shape — deviation breaks identity.
- Use 24px border-radius for all card surfaces — feature cards, stat panels, and content containers.
- Let Electric Blue (#5196fe) own the brand expression: filled CTAs, full-bleed feature sections, icon accents. Don't dilute it with secondary chromatic colors.
- Use Ember Orange (#f9754e) at most once per page, and only for a single high-stakes conversion CTA. The scarcity is what makes it convert.
- Use warm neutrals (Parchment #f2f1ec, Sand #e1dfd8) for surfaces that need softness. The page is a white paper, not a white screen — warm tones prevent sterility.
- Track headlines tight: -0.06em at 48px, -0.10em at 64px, -0.03em at 32px. Inter at large sizes needs aggressive negative tracking to feel confident.

### Don't
- Don't add a second italic serif word or use Gambetta outside the hero. The signature is restraint, not decoration.
- Don't use square or 4-8px border-radius on primary surfaces. The 24px card and 9999px pill are non-negotiable identity markers.
- Don't apply drop shadows to feature cards on the blue section. They lift purely by color contrast — adding shadows breaks the flat, confident tone.
- Don't use pure black (#000000) for text. Ink Black (#1b1d20) carries a subtle warmth that pure black flattens.
- Don't introduce additional accent hues (green, purple, red) for status states. If state colors are needed, use opacity shifts of the existing palette or restrict to inline icons.
- Don't use a full-width gradient background on any section. Gradients appear only on the product card visual — not as page-level treatment.
- Don't center-align body paragraphs longer than two lines. Parker is left-aligned and confident; centering is reserved for hero headlines and stat numbers.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Page Canvas | `#ffffff` | Default page background — the white paper on which all other surfaces sit. |
| 2 | Soft Card | `#f2f1ec` | Warm alternative for stat panels and content blocks that need visual softness without a border. |
| 3 | Card | `#ffffff` | Feature cards, product cards, and content containers with 24px radius — sit on Parchment or Blue. |
| 4 | Brand Surface | `#5196fe` | Full-bleed feature section background that reverses the page to color — breaks white rhythm, re-establishes brand dominance. |
| 5 | Dark Surface | `#1b1d20` | Ink Black sections that create high-contrast rhythm breaks; the product card mockup and dark feature panels. |

## Elevation

Parker avoids drop shadows as a default. Elevation is communicated through color contrast — white cards on Electric Blue, dark cards on white, Parchment blocks on white. The single shadow token (rgba(0,0,0,0.1) 0px 2px 10px 0px) is reserved for the occasional elevated card that needs physical lift, not decorative depth. The philosophy: this is a financial product, not a physical object — shadows imply weight, and weight implies friction.

## Imagery

Imagery is dominated by the hero credit card product visual — a dark card with a blue-to-orange-to-coral gradient overlay, presented as the literal product being sold. Supporting visuals are abstract: blue gradient shapes behind feature cards, soft light-blue washes behind the product card. No photography, no lifestyle imagery, no human faces. Icon style is filled or stroked geometric marks in Electric Blue on white tile containers (12-16px radius). The visual language is product-centric and financial — the card IS the hero, the icons explain features, the abstract gradients add atmosphere without distraction.

## Layout

Layout is max-width 1200px centered with generous outer padding. The page rhythm is: full-bleed Electric Blue announcement bar → sticky white header with horizontal nav → two-column hero (text-left, credit card visual-right) on white → four-column stat row with vertical dividers → dark Ink Black section with centered headline → Electric Blue full-bleed feature section with 3-column card grid → additional content sections. Sections alternate between white, dark, and blue backgrounds to create vertical rhythm without relying on visual dividers. Cards are always 24px radius, buttons always pill-shaped. The grid is 12-column with 24px gutters; feature sections use 3-column card grids. Navigation is minimal top-bar only — no sidebar, no mega-menu. Density is comfortable: 64-80px between sections, 24px card padding, 8-16px element gaps.

## Agent Prompt Guide

**Quick Color Reference**
- Text: #1b1d20
- Background: #ffffff
- Soft surface: #f2f1ec
- Border: #e1dfd8
- Accent / brand: #5196fe
- primary action: #f9754e (filled action)

**3 Example Component Prompts**

1. *Hero announcement bar*: Full-bleed Electric Blue (#5196fe) strip, 44px tall, centered white text at Inter 500 14px. Include a 'Learn more here' link (white, underlined) mid-sentence and a white '×' dismiss icon at the right edge. Padding: 0 24px.

2. *Feature card on blue section*: White card, 24px border-radius, 24px padding. Top: Electric Blue (#5196fe) icon container, 48×48px, 12px radius, with a white stroked icon glyph. Below: Inter 600 20px Ink Black (#1b1d20) subheading, then Inter 400 16px Steel (#6e6e6e) body text. No shadow — lift by color contrast alone.

3. *Pill navigation button (ghost)*: Transparent fill, Ink Black (#1b1d20) 1px border, 9999px border-radius, 16px 24px padding. Text: Inter 500 16px Ink Black. Used for 'Sign In' style secondary nav actions in the header.

## Type System Signature

Parker's type system is a two-family composition, not a single-family hierarchy. Inter carries 95% of the work at all functional roles. Gambetta italic enters once — in the hero headline — to italicize a single word or short phrase that carries the value proposition ('Powers Your Growth'). The italic serif is not decorative; it's editorial. It signals that this is a company with a point of view, not a feature checklist. When generating new pages, default to Inter for everything; reach for Gambetta italic only for the single most important word in the single most important headline on the page.

## Similar Brands

- **Brex** — Same fintech audience, same blue-dominant color strategy, same full-bleed colored feature sections breaking up white canvas, same pill-button convention.
- **Ramp** — Same confident sans-serif body with tight tracking, same generous card radii, same single-accent-color approach with a warm secondary for key CTAs.
- **Mercury** — Same warm-neutral surface treatment (parchment-like cards on white), same minimal iconography, same product-card-as-hero visual strategy.
- **Pipe** — Same gradient-on-product-card visual signature (dark card with vivid gradient), same electric blue brand color, same dual-typeface display treatment.

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-electric-blue: #5196fe;
  --color-ember-orange: #f9754e;
  --color-ink-black: #1b1d20;
  --color-midnight: #101828;
  --color-paper-white: #ffffff;
  --color-parchment: #f2f1ec;
  --color-sand: #e1dfd8;
  --color-graphite: #27272a;
  --color-steel: #6e6e6e;
  --color-ash: #797876;
  --color-fog: #a3a3a3;

  /* Typography — Font Families */
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-gambetta: 'Gambetta', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-system-ui: 'system-ui', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.5;
  --tracking-caption: -0.14px;
  --text-body-sm: 16px;
  --leading-body-sm: 1.5;
  --tracking-body-sm: -0.32px;
  --text-body: 18px;
  --leading-body: 1.43;
  --tracking-body: -0.36px;
  --text-subheading: 20px;
  --leading-subheading: 1.42;
  --tracking-subheading: -0.46px;
  --text-heading-sm: 32px;
  --leading-heading-sm: 1.16;
  --tracking-heading-sm: -0.96px;
  --text-heading: 48px;
  --leading-heading: 1.13;
  --tracking-heading: -2.88px;
  --text-display: 64px;
  --leading-display: 1.05;
  --tracking-display: -6.4px;

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
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-80: 80px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 64-80px;
  --card-padding: 24px;
  --element-gap: 8-16px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-xl: 12.8px;
  --radius-2xl: 20px;
  --radius-3xl: 24px;
  --radius-full: 1584px;

  /* Named Radii */
  --radius-cards: 24px;
  --radius-badges: 12.8px;
  --radius-inputs: 12.8px;
  --radius-buttons: 9999px;

  /* Shadows */
  --shadow-md: rgba(0, 0, 0, 0.1) 0px 2px 10px 0px;

  /* Surfaces */
  --surface-page-canvas: #ffffff;
  --surface-soft-card: #f2f1ec;
  --surface-card: #ffffff;
  --surface-brand-surface: #5196fe;
  --surface-dark-surface: #1b1d20;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-electric-blue: #5196fe;
  --color-ember-orange: #f9754e;
  --color-ink-black: #1b1d20;
  --color-midnight: #101828;
  --color-paper-white: #ffffff;
  --color-parchment: #f2f1ec;
  --color-sand: #e1dfd8;
  --color-graphite: #27272a;
  --color-steel: #6e6e6e;
  --color-ash: #797876;
  --color-fog: #a3a3a3;

  /* Typography */
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-gambetta: 'Gambetta', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-system-ui: 'system-ui', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.5;
  --tracking-caption: -0.14px;
  --text-body-sm: 16px;
  --leading-body-sm: 1.5;
  --tracking-body-sm: -0.32px;
  --text-body: 18px;
  --leading-body: 1.43;
  --tracking-body: -0.36px;
  --text-subheading: 20px;
  --leading-subheading: 1.42;
  --tracking-subheading: -0.46px;
  --text-heading-sm: 32px;
  --leading-heading-sm: 1.16;
  --tracking-heading-sm: -0.96px;
  --text-heading: 48px;
  --leading-heading: 1.13;
  --tracking-heading: -2.88px;
  --text-display: 64px;
  --leading-display: 1.05;
  --tracking-display: -6.4px;

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
  --spacing-64: 64px;
  --spacing-80: 80px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-xl: 12.8px;
  --radius-2xl: 20px;
  --radius-3xl: 24px;
  --radius-full: 1584px;

  /* Shadows */
  --shadow-md: rgba(0, 0, 0, 0.1) 0px 2px 10px 0px;
}
```
