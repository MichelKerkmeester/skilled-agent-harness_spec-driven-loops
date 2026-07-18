# amp — Style Reference
> warm orange pill on cool white. The design feels like a premium fitness product photographed in a sunlit loft: one object, one accent, one confident typeface doing all the work.

**Theme:** light

amp is a single-color, single-typeface system: one warm orange against an achromatic canvas, and one custom sans-serif used at every size. The page reads like a product photography spread — generous whitespace, large editorial headlines, and a single device (the amp column) photographed in a soft beige interior. Orange is rationed: it marks the buy button, the current step indicator, and a thin accent rule. Everything else stays in white, off-white, and near-black, so the accent does the talking. Cards and inputs use small 5px corners; the primary CTA is a 50px pill with a brand-colored glow; secondary controls round to 24px. Typography is one family (PublicaSans) at weights 300/400/500, tightening its tracking aggressively as sizes scale up — -0.036em at display, almost zero at body.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Amp Orange | `#ff6105` | `--color-amp-orange` | Primary action fill, active step badge, accent rule, and brand strokes — the only chromatic color in the interface. Used at high contrast on white surfaces (7.0:1 against #ffffff) and as a warm border tint on cards and inputs |
| Amp Glow | `#ffa069` | `--color-amp-glow` | Orange supporting accent for decorative details and low-frequency emphasis. Do not promote it to the primary CTA color |
| Peach Wash | `#ffdfcd` | `--color-peach-wash` | Soft highlight surface for featured cards and step accents. A near-gray peach that stays quiet while adding warmth to a card stack |
| Ink | `#0a0a0a` | `--color-ink` | Primary text, logo mark, button text. 19.8:1 against white — the highest-contrast neutral in the stack |
| Carbon | `#292b2a` | `--color-carbon` | Secondary text and nav links, slightly softer than Ink. Icon strokes also draw from this level |
| Slate | `#7a7b7b` | `--color-slate` | Neutral form states, badge text, and quiet UI feedback where color should stay understated. |
| Ash | `#a2a3a2` | `--color-ash` | Disabled link text and placeholder-level text — the quietest text tone before disappearing |
| Graphite Hairline | `#e5e5e5` | `--color-graphite-hairline` | The dominant border color across the site — dividers, card borders, button outlines, and structural rules. By far the most-used neutral (1628+ borderColor occurrences) |
| Fog | `#dfe0df` | `--color-fog` | Soft border for cards and body blocks where #e5e5e5 reads as too crisp against off-white |
| Bone | `#e5e7eb` | `--color-bone` | Neutral button fill (88 occurrences) — the ghost/secondary button background. A light step above canvas |
| Canvas White | `#ffffff` | `--color-canvas-white` | Page background, card surfaces, button text on dark and orange fills. The base of the surface stack |
| Linen | `#f3f4f3` | `--color-linen` | Off-white alt surface — secondary button fills and surface tints where pure white is too clinical |
| Charcoal | `#202120` | `--color-charcoal` | Dark elevated surface for cards, headers, and contained panels. |
| Smoke | `#3c3e3d` | `--color-smoke` | Heading underline accent in dark sections, heavier than Carbon |

## Tokens — Typography

### PublicaSans — The only typeface in the system. Light 300 for display headlines, Regular 400 for body and UI, Medium 500 for buttons and emphasis. Tracking tightens with size: -0.036em at 72-78px, -0.030em at 48px, -0.020em at 32px, -0.010em at 16-18px, near-zero at body. The progressive tightening gives display sizes a magazine-cover feel while body text stays open and readable. · `--font-publicasans`
- **Substitute:** Inter, Söhne, or IBM Plex Sans for similar geometric-humanist proportions. For the editorial display feel, pair with GT America or Söhne Breit.
- **Weights:** 300, 400, 500
- **Sizes:** 12px, 14px, 16px, 18px, 24px, 32px, 48px, 72px, 78px
- **Line height:** 0.71, 0.92, 0.94, 1.00, 1.10, 1.20, 1.22, 1.30, 1.33, 1.50, 1.56
- **Letter spacing:** -0.036em at 72-78px, -0.030em at 48px, -0.020em at 32px, -0.010em at 16-18px, 0 at 12-14px
- **Role:** The only typeface in the system. Light 300 for display headlines, Regular 400 for body and UI, Medium 500 for buttons and emphasis. Tracking tightens with size: -0.036em at 72-78px, -0.030em at 48px, -0.020em at 32px, -0.010em at 16-18px, near-zero at body. The progressive tightening gives display sizes a magazine-cover feel while body text stays open and readable.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.5 | — | `--text-caption` |
| body-sm | 14px | 1.5 | — | `--text-body-sm` |
| body | 16px | 1.56 | -0.01px | `--text-body` |
| subheading | 18px | 1.5 | -0.01px | `--text-subheading` |
| heading-sm | 24px | 1.33 | -0.02px | `--text-heading-sm` |
| heading | 32px | 1.22 | -0.02px | `--text-heading` |
| heading-lg | 48px | 1.2 | -0.03px | `--text-heading-lg` |
| display | 72px | 1.1 | -0.036px | `--text-display` |

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
| 56 | 56px | `--spacing-56` |
| 60 | 60px | `--spacing-60` |
| 64 | 64px | `--spacing-64` |
| 80 | 80px | `--spacing-80` |
| 112 | 112px | `--spacing-112` |

### Border Radius

| Element | Value |
|---------|-------|
| nav | 40px |
| cards | 5px |
| images | 8px |
| inputs | 50px |
| buttons-small | 8px |
| buttons-primary | 50px |
| buttons-secondary | 24px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| md | `rgba(255, 97, 5, 0.6) 1px 6px 14px 0px, rgba(0, 0, 0, 0.0...` | `--shadow-md` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 16px
- **Element gap:** 5-8px

## Components

### Primary Pill Button
**Role:** The single CTA on most pages — Buy Now, Get Started.

Fill #ff6105, white text, 50px border-radius, 16px vertical / 32px horizontal padding, PublicaSans weight 500 at 16px. Carries the only shadow in the system: rgba(255,97,5,0.6) 1px 6px 14px 0 layered with rgba(0,0,0,0.06) 0 1px 4px 0 — the orange glow is the brand signature. Trailing chevron icon optional.

### Secondary Pill Button
**Role:** Lower-emphasis action when a primary exists on the same surface.

Fill #ffffff or #f3f4f3, 1px border #e5e5e5, #292b2a text, 24px border-radius, 14px / 24px padding, weight 400. The tighter radius (not 50px) signals it is the secondary action.

### Nav Buy Now Button
**Role:** Persistent top-right CTA across all pages.

Fill #ff6105, white text, 40px border-radius, smaller scale than the hero CTA. Mirrors the Primary Pill Button at nav density.

### Step Indicator Row
**Role:** Onboarding step list with active state.

Active step: small orange pill badge reading 'Step 1' in white on #ff6105, weight 500 at 12px, 8px radius. Step title in Ink 18px weight 500 with a 2px #e5e5e5 underline. Inactive steps: 'Step 2' / 'Step 3' in Ash 12px, title in #292b2a 18px weight 400, underline 1px #e5e5e5.

### Press Logo Strip
**Role:** As-row, grayscale media logos under 'FEATURED ON' label.

Single row, 80-100px height, logos desaturated to Ink (#0a0a0a) or Carbon. Spacing 40-60px between logos. The eyebrow label 'FEATURED ON' in 12px tracked uppercase Ash.

### Editorial Section Heading
**Role:** Large section title with accent rule underneath.

PublicaSans weight 300 at 48-72px, tracking -0.030em to -0.036em, color Ink. A 2-3px #ff6105 accent rule sits below the heading at roughly 1/3 of the heading width — the only chrome on the page.

### Dark Feature Band
**Role:** Full-bleed atmospheric section over a darkened product photo.

Background #202120 with a 60-70% dark overlay over a full-bleed product photograph. Headline in white at 48px weight 300, accent rule in #ff6105. Padding 120px vertical.

### Featured Card (Peach)
**Role:** Highlighted callout in a stack — e.g. the app onboarding card.

Fill #ffdfcd (Peach Wash), 5px radius, 16-20px padding, with a phone/product mockup on the right. The peach fill is reserved for a single card per section to maintain scarcity.

### Ghost Card
**Role:** Default card surface in a feature grid.

Fill #ffffff, 1px border #e5e5e5, 5px radius, 16-24px padding. No shadow. Image radius 8px. Heading 24px weight 500 Ink, body 16px weight 400 Carbon.

### Announcement Bar
**Role:** Thin top bar below the nav with a time-sensitive message.

Background Linen (#f3f4f3), 40-48px height, centered text 14px weight 400 Carbon with a right-side text-link 'Let's Go →' in Ink weight 500.

### Top Navigation
**Role:** Persistent header across all pages.

Background #ffffff, 64-72px height, logo left, 5 center links in 14px weight 400 Carbon with 30-40px horizontal gaps, nav Buy Now button right. Optional thin 1px #e5e5e5 bottom border.

### Input Field (Pill)
**Role:** Single-line input in onboarding and form contexts.

50px border-radius, 1px border #e5e5e5, 16px horizontal padding, PublicaSans 16px weight 400. Placeholder text in Ash #a2a3a2. Focus ring 2px #ff6105 at 40% opacity.

## Do's and Don'ts

### Do
- Use #ff6105 only for the primary CTA fill, the active step badge, the accent rule, and key brand strokes — never for body text or large background washes.
- Set display headlines at 48-78px in weight 300 with tracking between -0.030em and -0.036em; this is the signature editorial moment of the system.
- Round the primary CTA to 50px, secondary buttons to 24px, and cards to 5px — the radius ladder (5 / 8 / 24 / 32 / 50) defines component hierarchy.
- Apply the two-layer shadow stack (orange glow + neutral 1px lift) only to the primary CTA — no other element should carry elevation.
- Stack the surface ladder in this order: #ffffff → #f3f4f3 → #e5e7eb → #ffdfcd → #202120. Each step should feel like a deliberate lift, not a tint shift.
- Keep body copy in PublicaSans 16px weight 400 at line-height 1.5 with -0.01em tracking; reserve weight 500 for buttons, step titles, and short labels.
- Use the 2-3px #ff6105 accent rule beneath editorial headlines at roughly one-third of the heading width — it is the visual punctuation mark of the brand.

### Don't
- Don't introduce a second accent color or a secondary brand hue — the system is monochrome + one orange, and any chromatic addition breaks the rationing.
- Don't use weight 600 or 700 in PublicaSans; the system tops out at 500. Heavier weights are not part of the type scale.
- Don't apply shadows to cards, images, or non-primary buttons. Flat-with-hairline-border is the default; elevation is a privilege, not a default.
- Don't use the 50px radius on anything except the primary CTA and inputs. 24px is the cap for secondary buttons, 5px for cards.
- Don't set display text in all-caps or with positive letter-spacing. Tracking only tightens as size grows; never loosens.
- Don't fill large areas with #ff6105. The orange is a punctuation mark — let it punctuate, not paint.
- Don't mix rounded and square corner systems on the same page. Pick from the 5 / 8 / 24 / 32 / 50 ladder and stay on it.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas | `#ffffff` | Page background, base layer |
| 1 | Linen | `#f3f4f3` | Off-white alt surface for secondary buttons and warm sections |
| 2 | Bone | `#e5e7eb` | Ghost button fill, raised neutral control |
| 3 | Peach Wash | `#ffdfcd` | Featured card highlight, warm accent surface |
| 4 | Charcoal | `#202120` | Dark full-bleed feature band background |

## Elevation

- **Primary Pill Button:** `rgba(255, 97, 5, 0.6) 1px 6px 14px 0px, rgba(0, 0, 0, 0.06) 0px 1px 4px 0px`

## Imagery

Full-bleed product photography is the dominant visual asset — the amp column photographed in a warm beige interior with soft directional lighting. No lifestyle scenes, no people-only shots, no illustration system. Phone mockups appear in onboarding sections, framed by Peach Wash cards. Image radius is 8px consistently. The product is always shot isolated on a neutral surface — the object IS the hero. Press logos in the social proof band are desaturated to single-tone Ink.

## Layout

Max-width 1200px centered, with full-bleed sections that break out for product photography and dark feature bands. Hero is a full-viewport product image with a single Buy Now CTA pill anchored at the bottom-center. The 'How to use amp' section uses a 2-column layout (50/50) — step list left, phone mockup right. The press strip is a single horizontal row. The dark feature band ('Designed to move you') is a full-bleed photo with a centered headline and accent rule. Vertical rhythm is generous: 80-120px between sections. Navigation is a simple top bar with no sidebar or mega-menu. The system favors centered stacks and split text+image compositions over asymmetric or grid-heavy layouts.

## Agent Prompt Guide

**Quick Color Reference**
- text primary: #0a0a0a
- text secondary: #292b2a
- text muted: #7a7b7b
- background: #ffffff
- surface alt: #f3f4f3
- border hairline: #e5e5e5
- primary action: #ff6105 (filled action)

**Example Component Prompts**

1. *Primary CTA pill*: Fill #ff6105, white text, 50px border-radius, padding 16px vertical / 32px horizontal. PublicaSans weight 500, 16px, letter-spacing -0.01em. Box-shadow: rgba(255,97,5,0.6) 1px 6px 14px 0, rgba(0,0,0,0.06) 0 1px 4px 0. Optional trailing chevron in white.

2. *Editorial section heading*: PublicaSans weight 300, 48px, color #0a0a0a, letter-spacing -0.030em, line-height 1.2. Below the text, a 2px tall, 120px wide accent rule in #ff6105, aligned to the start of the heading. Section padding 80px top, 80px bottom.

3. *Featured onboarding card*: Fill #ffdfcd, 5px border-radius, padding 24px. Contains a phone mockup on the right (200px wide, 8px radius image frame). Step badge: orange pill #ff6105, white text 'Step 1', 8px radius, 12px / 12px padding. Step title in PublicaSans 18px weight 500 #0a0a0a with a 2px #e5e5e5 underline rule.

4. *Dark feature band*: Full-bleed background #202120 with a darkened product photo overlay at 65% opacity. White headline in PublicaSans weight 300, 48px, letter-spacing -0.030em, centered. A 60px wide, 2px tall #ff6105 accent rule centered below. Vertical padding 120px.

5. *Press logo strip*: Single horizontal row, logos rendered in #0a0a0a at 24-28px height, spaced 60px apart. Above the row, a 12px uppercase tracked label 'FEATURED ON' in #7a7b7b. Background #ffffff, padding 40px vertical.

## Similar Brands

- **Tonal** — Same single-product hero photography on a near-white canvas, with a confident sans-serif headline and a single saturated accent for the buy CTA.
- **Peloton (equipment pages)** — Editorial product spreads, large light-weight headlines, and a monochrome interface that lets one accent color carry the call-to-action.
- **Whoop** — Generous whitespace, custom geometric sans, nearly colorless UI with a single warm accent and hairline 1px borders as the primary structural device.
- **Forme** — Same restraint: one product, one typeface, one accent color, pill-shaped primary buttons, and flat cards with minimal border treatment.

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-amp-orange: #ff6105;
  --color-amp-glow: #ffa069;
  --color-peach-wash: #ffdfcd;
  --color-ink: #0a0a0a;
  --color-carbon: #292b2a;
  --color-slate: #7a7b7b;
  --color-ash: #a2a3a2;
  --color-graphite-hairline: #e5e5e5;
  --color-fog: #dfe0df;
  --color-bone: #e5e7eb;
  --color-canvas-white: #ffffff;
  --color-linen: #f3f4f3;
  --color-charcoal: #202120;
  --color-smoke: #3c3e3d;

  /* Typography — Font Families */
  --font-publicasans: 'PublicaSans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --text-body-sm: 14px;
  --leading-body-sm: 1.5;
  --text-body: 16px;
  --leading-body: 1.56;
  --tracking-body: -0.01px;
  --text-subheading: 18px;
  --leading-subheading: 1.5;
  --tracking-subheading: -0.01px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.33;
  --tracking-heading-sm: -0.02px;
  --text-heading: 32px;
  --leading-heading: 1.22;
  --tracking-heading: -0.02px;
  --text-heading-lg: 48px;
  --leading-heading-lg: 1.2;
  --tracking-heading-lg: -0.03px;
  --text-display: 72px;
  --leading-display: 1.1;
  --tracking-display: -0.036px;

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
  --spacing-56: 56px;
  --spacing-60: 60px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-112: 112px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 16px;
  --element-gap: 5-8px;

  /* Border Radius */
  --radius-md: 5px;
  --radius-lg: 8px;
  --radius-2xl: 16px;
  --radius-3xl: 24px;
  --radius-3xl-2: 32px;
  --radius-3xl-3: 40px;
  --radius-full: 50px;
  --radius-full-2: 53px;
  --radius-full-3: 56.16px;
  --radius-full-4: 70px;

  /* Named Radii */
  --radius-nav: 40px;
  --radius-cards: 5px;
  --radius-images: 8px;
  --radius-inputs: 50px;
  --radius-buttons-small: 8px;
  --radius-buttons-primary: 50px;
  --radius-buttons-secondary: 24px;

  /* Shadows */
  --shadow-md: rgba(255, 97, 5, 0.6) 1px 6px 14px 0px, rgba(0, 0, 0, 0.06) 0px 1px 4px 0px;

  /* Surfaces */
  --surface-canvas: #ffffff;
  --surface-linen: #f3f4f3;
  --surface-bone: #e5e7eb;
  --surface-peach-wash: #ffdfcd;
  --surface-charcoal: #202120;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-amp-orange: #ff6105;
  --color-amp-glow: #ffa069;
  --color-peach-wash: #ffdfcd;
  --color-ink: #0a0a0a;
  --color-carbon: #292b2a;
  --color-slate: #7a7b7b;
  --color-ash: #a2a3a2;
  --color-graphite-hairline: #e5e5e5;
  --color-fog: #dfe0df;
  --color-bone: #e5e7eb;
  --color-canvas-white: #ffffff;
  --color-linen: #f3f4f3;
  --color-charcoal: #202120;
  --color-smoke: #3c3e3d;

  /* Typography */
  --font-publicasans: 'PublicaSans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --text-body-sm: 14px;
  --leading-body-sm: 1.5;
  --text-body: 16px;
  --leading-body: 1.56;
  --tracking-body: -0.01px;
  --text-subheading: 18px;
  --leading-subheading: 1.5;
  --tracking-subheading: -0.01px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.33;
  --tracking-heading-sm: -0.02px;
  --text-heading: 32px;
  --leading-heading: 1.22;
  --tracking-heading: -0.02px;
  --text-heading-lg: 48px;
  --leading-heading-lg: 1.2;
  --tracking-heading-lg: -0.03px;
  --text-display: 72px;
  --leading-display: 1.1;
  --tracking-display: -0.036px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-56: 56px;
  --spacing-60: 60px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-112: 112px;

  /* Border Radius */
  --radius-md: 5px;
  --radius-lg: 8px;
  --radius-2xl: 16px;
  --radius-3xl: 24px;
  --radius-3xl-2: 32px;
  --radius-3xl-3: 40px;
  --radius-full: 50px;
  --radius-full-2: 53px;
  --radius-full-3: 56.16px;
  --radius-full-4: 70px;

  /* Shadows */
  --shadow-md: rgba(255, 97, 5, 0.6) 1px 6px 14px 0px, rgba(0, 0, 0, 0.06) 0px 1px 4px 0px;
}
```
