# Textla — Style Reference
> Sunlit retro botanical almanac — a cream-yellow page printed in deep forest green, illustrated with cactus line art, stamped with hard offset shadows.

**Theme:** light

Textla wraps an SMS marketing product in a sunlit retro botanical almanac: a warm cream-yellow canvas (#f2ee98) carries every page, with deep forest green (#10380b) doing the work of ink, border, shadow, and brand mark. Typography is the loudest voice — a condensed display face (National 2 Condensed) drives oversized italicized headlines up to 180px while a heavy sans (RethinkSans, 600-800) handles all UI at 16-20px, giving the system a printed-poster confidence. Components lean neobrutalist: hard 8px offset shadows in the brand green, 1440px pill controls, 40px-rounded cards, and star ratings in vivid marigold yellow. Hand-drawn line illustrations of cacti, clouds, and desert figures fill the negative space, making the product feel like a vintage field guide rather than a dashboard.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Sunlit Cream | `#f2ee98` | `--color-sunlit-cream` | Page canvas and section background — the warm desert-light base that sets the system's botanical mood |
| Forest Ink | `#10380b` | `--color-forest-ink` | Primary text, pill button fills, icon strokes, hard offset shadow, and brand mark — the single deep green that does 80% of structural work |
| Marigold | `#fce519` | `--color-marigold` | Yellow state accent for badges, validation surfaces, and short status labels. Do not promote it to the primary CTA color |
| Sage Wash | `#dbe8ac` | `--color-sage-wash` | Muted card and surface tint — a soft botanical green used for subtle panel differentiation on the cream canvas |
| Vivid Fern | `#30be60` | `--color-vivid-fern` | Green outline accent for tags, dividers, and focused UI edges. Do not promote it to the primary CTA color |
| Parchment | `#fefde6` | `--color-parchment` | Lighter card surface that sits one level above Sunlit Cream — used for product mockup cards, testimonial cards, and elevated panels |
| Snowcap | `#ffffff` | `--color-snowcap` | Pure white for high-contrast text on Forest Ink backgrounds and for thin icon strokes inside the product UI mockup |

## Tokens — Typography

### National 2 Condensed — Display and heading face — oversized condensed headlines up to 180px drive the poster-like visual identity. Tight -0.03em letter-spacing at all sizes, very tight 0.8 line-height at display weights, creating compressed stacked headlines. Hero 'Unbeatable' appears in italic 800. · `--font-national-2-condensed`
- **Substitute:** Bebas Neue, Oswald, Antonio
- **Weights:** 600, 700, 800
- **Sizes:** 16px, 18px, 20px, 24px, 32px, 40px, 48px, 56px, 64px, 86px, 104px, 156px, 180px
- **Line height:** 0.80–1.30
- **Letter spacing:** -0.03em
- **Role:** Display and heading face — oversized condensed headlines up to 180px drive the poster-like visual identity. Tight -0.03em letter-spacing at all sizes, very tight 0.8 line-height at display weights, creating compressed stacked headlines. Hero 'Unbeatable' appears in italic 800.

### RethinkSans — Body and UI face — already starts at weight 600, so no light weights exist. The system treats type as a structural element: 16px for nav and small UI, 18px for body, 20px for emphasized body. Line-height 1.0 for inline icons/badges, 1.5-1.71 for readable paragraphs. · `--font-rethinksans`
- **Substitute:** Inter, Manrope, Plus Jakarta Sans
- **Weights:** 600, 700, 800
- **Sizes:** 16px, 18px, 20px
- **Line height:** 1.00–1.71
- **Role:** Body and UI face — already starts at weight 600, so no light weights exist. The system treats type as a structural element: 16px for nav and small UI, 18px for body, 20px for emphasized body. Line-height 1.0 for inline icons/badges, 1.5-1.71 for readable paragraphs.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 16px | 24 | — | `--text-caption` |
| body | 18px | 28 | — | `--text-body` |
| subheading | 20px | 32 | — | `--text-subheading` |
| heading-sm | 24px | 30 | -0.72px | `--text-heading-sm` |
| heading | 32px | 38 | -0.96px | `--text-heading` |
| heading-lg | 56px | 62 | -1.68px | `--text-heading-lg` |
| display | 86px | 70 | -2.58px | `--text-display` |
| display-xl | 180px | 144 | -5.4px | `--text-display-xl` |

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
| 40 | 40px | `--spacing-40` |
| 64 | 64px | `--spacing-64` |
| 80 | 80px | `--spacing-80` |
| 120 | 120px | `--spacing-120` |
| 160 | 160px | `--spacing-160` |

### Border Radius

| Element | Value |
|---------|-------|
| nav | 16px |
| tags | 40px |
| cards | 40px |
| badges | 1440px |
| images | 40px |
| inputs | 1440px |
| buttons | 1440px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| subtle | `rgb(16, 56, 11) 8px 8px 0px 0px` | `--shadow-subtle` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80-120px
- **Card padding:** 24-40px
- **Element gap:** 24px

## Components

### Marigold Pill CTA
**Role:** Primary hero action button — the signature filled button in the hero section

1440px radius pill, #fce519 (Marigold) background, #10380b (Forest Ink) text at 16-18px RethinkSans weight 700, padding 12px 28px. Optional 4px margin to ghost sibling button. No shadow.

### Forest Pill Button
**Role:** Primary dark action button used on light surfaces

1440px radius pill, #10380b (Forest Ink) background, #f2ee98 (Sunlit Cream) text at 16-18px RethinkSans weight 700, padding 12px 28px.

### Ghost Text Button
**Role:** Secondary inline action paired beside a filled CTA

No background, no border, #10380b (Forest Ink) text at 16-18px RethinkSans weight 600, trailing chevron icon. Padding 8px 4px.

### Outlined Call Button
**Role:** Phone number CTA in nav

1440px radius pill, 1px solid #10380b (Forest Ink) border, transparent fill, Forest Ink text with leading phone icon. Padding 8px 20px.

### Parchment Testimonial Card
**Role:** Customer quote card on cream canvas

#fefde6 (Parchment) background, 40px border-radius, 24-40px padding. Contains avatar (circular), name in 20px RethinkSans 700, role in 16px weight 600, quote in 24-32px National 2 Condensed weight 700 Forest Ink. Optional hard offset shadow `8px 8px 0 0 #10380b`.

### Product Dashboard Card
**Role:** Hero product UI mockup and embedded screenshots

White or #fefde6 (Parchment) background, 40px border-radius, 1px solid #10380b border, 8px 8px 0 0 Forest Ink hard offset shadow. Phone number header pill in dark green, stat block with three large condensed numbers (Campaigns/Messages/Subscribers), campaign list rows with status badges.

### Status Pill Badge
**Role:** Campaign status indicator (One-time, Recurring, Sending Monday, etc.)

1440px or 40px radius, small padding 4px 12px, 14-16px RethinkSans weight 700. Two color variants: Forest Ink fill with Sunlit Cream text for default states; Marigold fill with Forest Ink text for active/highlight states.

### Star Rating Display
**Role:** Five-star social proof element

Five star icons in #fce519 (Marigold) fill, 16-20px size, tightly grouped. Always paired with 'Five star rating' label in RethinkSans 16px weight 600 Forest Ink.

### Feature List Item
**Role:** Three-step onboarding list with circular icon

40px circular icon container with Marigold fill and dark line-art icon, 24px gap to label. Label in 24-32px National 2 Condensed weight 700 Forest Ink, optional subtext in 16px RethinkSans 600.

### G2 Leader Ribbon
**Role:** Third-party award badge for testimonial card

Red/orange gradient ribbon with white text 'Leader' and 'SUMMER 2025' label, 0px radius top corners, pointed bottom edge. Sits overlapping the testimonial card top-right.

### Stat Counter Bar
**Role:** Bottom social-proof statistics strip

Full-width band, #fce519 (Marigold) background, 4-column grid. Each stat: large number in 48-64px National 2 Condensed 800 Forest Ink, label in 18-20px RethinkSans 600 Forest Ink. 80px vertical padding.

### Video Testimonial Frame
**Role:** Embedded customer video card

16:9 or 4:3 video frame, 40px radius, Forest Ink 1px border, hard offset shadow. Caption below: name in 24px National 2 Condensed 700, role in 16px RethinkSans 600, star rating row in Marigold.

### Chat Bubble Card
**Role:** SMS conversation illustration in feature section

White background, 40px radius with one corner more rounded (asymmetric to indicate speech tail), 16-24px padding. Sender message in 16px RethinkSans 600 Forest Ink, reply in same on dark green bubble with cream text. Circle avatar with initials.

### Navigation Bar
**Role:** Top header with logo, links, and dual CTAs

Transparent over canvas, 16px nav links in RethinkSans 600 Forest Ink with 24-32px gap. Right side: outlined phone button + Marigold 'Try for free' pill. Logo is dark green wordmark with small icon mark.

## Do's and Don'ts

### Do
- Use #10380b (Forest Ink) for all body text, borders, icons, and primary action fills — it is the system's only ink color
- Apply the 8px 8px 0 0 #10380b hard offset shadow to elevated cards and product mockups, never to buttons or inputs
- Reach for National 2 Condensed at 56px+ for headlines, with -0.03em letter-spacing preserved at every size
- Pair every filled pill CTA with a ghost text-link sibling to create a two-button rhythm (filled + chevron text)
- Use #f2ee98 (Sunlit Cream) as the page canvas on all default sections; introduce #fefde6 (Parchment) only for card surfaces that need to lift one level
- Use #fce519 (Marigold) sparingly — star ratings, hero CTAs, and decorative icon accents only — never for body text or large fills
- Keep all button radii at 1440px (full pill) and all card/image radii at 40px — this radius pair defines the system's softness

### Don't
- Do not use #fce519 for body text — Marigold fails contrast on cream and should never carry paragraphs
- Do not apply soft Gaussian shadows; the only elevation language is the hard 8px offset in Forest Ink
- Do not use the condensed display face (National 2 Condensed) below 20px — it becomes illegible as UI text
- Do not introduce blue, purple, or any non-green/yellow hue — the system is strictly botanical warm
- Do not use sharp 0px radii on any container — the system is consistently rounded (16px minimum)
- Do not set RethinkSans below weight 600 — the face has no light weights and lighter settings will render incorrectly
- Do not use white (#ffffff) as a page background — the canvas is always Sunlit Cream; white appears only inside product mockups and on dark green surfaces

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Sunlit Cream | `#f2ee98` | Default page canvas and section background |
| 1 | Parchment | `#fefde6` | Lighter card surface for testimonials, product mockups, and elevated panels |
| 2 | Sage Wash | `#dbe8ac` | Subtle tint for differentiation panels within cream sections |
| 3 | Snowcap | `#ffffff` | Pure white only inside product UI mockups and chat bubbles |
| 4 | Forest Ink | `#10380b` | Inverted dark surface for stat bars, feature cards, and high-contrast sections |

## Elevation

- **Product Dashboard Card:** `8px 8px 0 0 #10380b`
- **Testimonial Card:** `8px 8px 0 0 #10380b`
- **Video Testimonial Frame:** `8px 8px 0 0 #10380b`
- **Feature Card:** `8px 8px 0 0 #10380b`

## Imagery

Hand-drawn monochrome line illustrations are the system's signature visual element: cacti, clouds, sunbursts, small figures with parachutes, and desert flora rendered in 1.5-2px Forest Ink strokes on the cream canvas. Illustrations are flat, unshaded, and used as scene-fillers in hero negative space and feature section backgrounds — they never appear inside cards. Product screenshots and dashboard mockups are framed as cards with hard offset shadows, treated as objects within the illustrated world. A small set of circular line-art icons (gift box, phone, megaphone, person) appear in Marigold-filled circles for feature lists. Photography is limited to one embedded customer video frame; everything else is illustrated.

## Layout

Max-width 1200px centered with comfortable 40px gutters. Hero is a two-column split: oversized headline + dual CTAs + star social proof on the left, product dashboard card overlapping a cactus illustration on the right. Section rhythm alternates Sunlit Cream and Forest Ink bands with 80-120px vertical gaps. Content blocks use 2-column testimonial grids and 4-column stat bars. Feature sections pair circular icon lists with chat bubble illustrations in 2-column layouts. Bottom-of-page stats are a full-bleed Marigold band. Navigation is a single transparent top bar; no sidebar or sticky mega-menu.

## Agent Prompt Guide

**Quick Color Reference**
- text: #10380b (Forest Ink)
- background: #f2ee98 (Sunlit Cream)
- border: #10380b (Forest Ink)
- accent: #fce519 (Marigold)
- card surface: #fefde6 (Parchment)
- primary action: #10380b (filled action)

**Example Component Prompts**

1. Create a Primary Action Button: #10380b background, #ffffff text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.

2. **Testimonial Card**: #fefde6 background, 40px radius, 32px padding, shadow `8px 8px 0 0 #10380b`. 64px circular avatar top-left, name in 20px RethinkSans 700 #10380b, role in 16px weight 600. Quote in 32px National 2 Condensed weight 700 #10380b, -0.96px letter-spacing. Five #fce519 stars below quote.

3. **Product Dashboard Mockup Card**: White (#ffffff) background, 40px radius, 1px solid #10380b border, shadow `8px 8px 0 0 #10380b`. Header row: phone number in 16px RethinkSans 600 #10380b, dark Forest Ink speech-bubble notification card on top. Stat row: three columns with 48px National 2 Condensed 800 #10380b numbers and 14px RethinkSans 600 labels. Campaign list rows: alternating white/Sunlit Cream backgrounds, status pills in Forest Ink or Marigold with 1440px radius.

4. **Stat Counter Bar**: Full-width #fce519 background, 80px vertical padding, 4-column grid. Each cell: 56px National 2 Condensed 800 #10380b number (e.g. '2.1K', '0'), 18px RethinkSans 600 #10380b label beneath. No borders between cells.

5. **Feature List Item**: 40px circular icon container with #fce519 fill and 1.5px #10380b line-art icon (megaphone, gift, phone). 24px right gap to label text: 24px National 2 Condensed 700 #10380b, -0.72px letter-spacing. Optional 16px RethinkSans 600 subtext below.

## Elevation Philosophy

The system uses one shadow only: a hard 8px offset in Forest Ink (#10380b), no blur, no spread. This is neobrutalist elevation — cards 'stamp' onto the cream canvas rather than floating with soft shadow. Never use Gaussian shadows; never stack multiple shadow layers. The 8px offset is constant: it does not scale with card size or importance. Cards without the shadow feel incomplete; buttons, inputs, and inline elements never receive the shadow.

## Similar Brands

- **Gumroad** — Same neobrutalist hard offset shadows, pill-shaped CTAs, and illustrated mascot energy on a warm cream canvas
- **Postscript** — SMS marketing peer with similar marketing-page personality, though Postscript runs a lighter more commercial palette
- **Linear** — Heavy condensed display type and confident weight-700 UI text create the same poster-like typographic confidence
- **Klaviyo** — Marketing platform with illustrated hero scenes and bold condensed headlines, though Klaviyo uses cooler purple accents
- **Substack** — Editorial / newsletter-adjacent brand using oversized condensed serif-adjacent display type and warm cream backgrounds for a printed-publication feel

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-sunlit-cream: #f2ee98;
  --color-forest-ink: #10380b;
  --color-marigold: #fce519;
  --color-sage-wash: #dbe8ac;
  --color-vivid-fern: #30be60;
  --color-parchment: #fefde6;
  --color-snowcap: #ffffff;

  /* Typography — Font Families */
  --font-national-2-condensed: 'National 2 Condensed', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-rethinksans: 'RethinkSans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 16px;
  --leading-caption: 24;
  --text-body: 18px;
  --leading-body: 28;
  --text-subheading: 20px;
  --leading-subheading: 32;
  --text-heading-sm: 24px;
  --leading-heading-sm: 30;
  --tracking-heading-sm: -0.72px;
  --text-heading: 32px;
  --leading-heading: 38;
  --tracking-heading: -0.96px;
  --text-heading-lg: 56px;
  --leading-heading-lg: 62;
  --tracking-heading-lg: -1.68px;
  --text-display: 86px;
  --leading-display: 70;
  --tracking-display: -2.58px;
  --text-display-xl: 180px;
  --leading-display-xl: 144;
  --tracking-display-xl: -5.4px;

  /* Typography — Weights */
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
  --font-weight-extrabold: 800;

  /* Spacing */
  --spacing-unit: 8px;
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-120: 120px;
  --spacing-160: 160px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80-120px;
  --card-padding: 24-40px;
  --element-gap: 24px;

  /* Border Radius */
  --radius-2xl: 16px;
  --radius-3xl: 24px;
  --radius-3xl-2: 40px;
  --radius-full: 1440px;

  /* Named Radii */
  --radius-nav: 16px;
  --radius-tags: 40px;
  --radius-cards: 40px;
  --radius-badges: 1440px;
  --radius-images: 40px;
  --radius-inputs: 1440px;
  --radius-buttons: 1440px;

  /* Shadows */
  --shadow-subtle: rgb(16, 56, 11) 8px 8px 0px 0px;

  /* Surfaces */
  --surface-sunlit-cream: #f2ee98;
  --surface-parchment: #fefde6;
  --surface-sage-wash: #dbe8ac;
  --surface-snowcap: #ffffff;
  --surface-forest-ink: #10380b;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-sunlit-cream: #f2ee98;
  --color-forest-ink: #10380b;
  --color-marigold: #fce519;
  --color-sage-wash: #dbe8ac;
  --color-vivid-fern: #30be60;
  --color-parchment: #fefde6;
  --color-snowcap: #ffffff;

  /* Typography */
  --font-national-2-condensed: 'National 2 Condensed', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-rethinksans: 'RethinkSans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 16px;
  --leading-caption: 24;
  --text-body: 18px;
  --leading-body: 28;
  --text-subheading: 20px;
  --leading-subheading: 32;
  --text-heading-sm: 24px;
  --leading-heading-sm: 30;
  --tracking-heading-sm: -0.72px;
  --text-heading: 32px;
  --leading-heading: 38;
  --tracking-heading: -0.96px;
  --text-heading-lg: 56px;
  --leading-heading-lg: 62;
  --tracking-heading-lg: -1.68px;
  --text-display: 86px;
  --leading-display: 70;
  --tracking-display: -2.58px;
  --text-display-xl: 180px;
  --leading-display-xl: 144;
  --tracking-display-xl: -5.4px;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-120: 120px;
  --spacing-160: 160px;

  /* Border Radius */
  --radius-2xl: 16px;
  --radius-3xl: 24px;
  --radius-3xl-2: 40px;
  --radius-full: 1440px;

  /* Shadows */
  --shadow-subtle: rgb(16, 56, 11) 8px 8px 0px 0px;
}
```
