# Eventbrite — Style Reference
> pillow-soft discovery wall with a single electric blue pulse

**Theme:** light

Eventbrite's visual system reads as a warm, welcoming event-discovery surface: a soft off-white canvas (#f8f7fa) with generous 40px-radius cards that feel almost pillow-like, pill-shaped controls (360px), and a single vivid blue (#3659e3) doing all the interactive heavy lifting. The dominant text/border color is a deep muted aubergine (#39364f) rather than pure black — this single tonal choice gives the entire interface a slightly warm, editorial feel without going purple on screen. Orange is reserved exclusively for the brand mark and the cookie consent button, never for product UI, which keeps the accent palette disciplined. Typography is Neue Plak at restrained sizes (14–24px range for most content), and layout is built on a 4-column event grid with circular category icons that hint at the playful, community-first nature of the product.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Aubergine Ink | `#39364f` | `--color-aubergine-ink` | Primary text, borders, dividers, icon strokes — the structural backbone of every surface |
| Pure White | `#ffffff` | `--color-pure-white` | Card surfaces, badge fills, nav background — the elevated layer above the canvas |
| Warm Linen | `#f8f7fa` | `--color-warm-linen` | Page canvas and page-level background — slightly warm off-white, never sterile |
| Soft Mist | `#dbdae3` | `--color-soft-mist` | Hairline borders, list dividers, subtle separators between list items and sections |
| Pale Silver | `#bec0c6` | `--color-pale-silver` | Link borders, secondary borders, muted outlines on ghost elements |
| Cloud Veil | `#eeedf2` | `--color-cloud-veil` | Secondary card backgrounds, subtle surface differentiation |
| Periwinkle Tint | `#dee5ff` | `--color-periwinkle-tint` | Soft blue-tinted card borders — the gentler cousin of the accent |
| Carbon | `#000000` | `--color-carbon` | Icon fills, certain link text — used sparingly where maximum contrast is needed |
| Smoke | `#6f7287` | `--color-smoke` | Muted secondary text, nav borders, low-emphasis icon strokes |
| Plum Depth | `#1e0a3c` | `--color-plum-depth` | Headlines, event titles, and deep emphasis text — the voice of large type |
| Indigo Slate | `#585163` | `--color-indigo-slate` | Nav borders, secondary structural lines, quieter sibling of Aubergine Ink |
| Electric Iris | `#3659e3` | `--color-electric-iris` | Violet accent for outlined action borders, linked labels, and lightweight interactive emphasis. |
| Ember Orange | `#f05537` | `--color-ember-orange` | Orange wash for highlight backgrounds, decorative bands, and soft emphasis behind content. Do not promote it to the primary CTA color |

## Tokens — Typography

### Neue Plak — All UI text — body, headings, buttons, badges, nav, event titles. The custom geometric sans carries the entire interface; no second typeface is needed. · `--font-neue-plak`
- **Substitute:** Inter or DM Sans (geometric humanist sans, similar warmth and x-height)
- **Weights:** 400, 600, 700
- **Sizes:** 12px, 14px, 16px, 18px, 24px, 32px
- **Line height:** 1.20–2.00 (context-dependent)
- **Letter spacing:** 0.0100em to 0.0180em — barely positive, kept consistent across all sizes for a calm, unfussy rhythm
- **OpenType features:** `"ss01" on (stylistic set for friendlier 'a' and 'g' terminals)`
- **Role:** All UI text — body, headings, buttons, badges, nav, event titles. The custom geometric sans carries the entire interface; no second typeface is needed.

### Neue Plak Text — Semi-bold companion for nav and select UI labels where extra weight is needed at small sizes · `--font-neue-plak-text`
- **Substitute:** Inter SemiBold
- **Weights:** 600
- **Sizes:** 14px
- **Line height:** 1.20–1.43
- **Role:** Semi-bold companion for nav and select UI labels where extra weight is needed at small sizes

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.43 | — | `--text-caption` |
| body-sm | 14px | 1.43 | — | `--text-body-sm` |
| body | 16px | 1.5 | — | `--text-body` |
| subheading | 18px | 1.43 | — | `--text-subheading` |
| heading-sm | 24px | 1.33 | — | `--text-heading-sm` |
| heading | 32px | 1.2 | — | `--text-heading` |

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
| 24 | 24px | `--spacing-24` |
| 36 | 36px | `--spacing-36` |
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |

### Border Radius

| Element | Value |
|---------|-------|
| nav | 100px (pill nav containers) |
| tags | 20px |
| cards | 40px |
| badges | 20px |
| inputs | 4px |
| buttons | 360px (pill) |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 64-80px
- **Card padding:** 12-16px
- **Element gap:** 12px

## Components

### Hero Banner
**Role:** Full-bleed promotional banner with photographic background and overlay text

Full-width image with a dark overlay; headline in 32px Neue Plak 700 Plum Depth (#1e0a3c) on a semi-transparent white card with 4px radius; CTA below is a pill button (360px radius, 12px 24px padding, Aubergine Ink border, Aubergine Ink text). Image is cropped to roughly 320px height on desktop.

### Event Listing Card
**Role:** Primary content unit — a single event in the discovery grid

White (#ffffff) surface on the Warm Linen canvas. 40px border-radius — the system's signature softness. Card has 1px Soft Mist (#dbdae3) border. Event image sits at top (16:9 ratio, 16px top-radius clipping to 40px card radius). Below image: 12–16px padding, event title in 16px Neue Plak 600 Plum Depth, date/venue in 14px weight 400 Aubergine Ink, price in 14px weight 600. No drop shadow; the border alone defines elevation.

### Category Circle Icon
**Role:** Circular icon button for browsing events by category

80px circle with 1px Soft Mist border, white fill. Centered line icon in Aubergine Ink at ~24px. Category label in 14px weight 400 below. 24px gap between circles in a horizontal row.

### Pill Search Bar
**Role:** Header search input with location selector

Single 100px-radius container holding a search input and a location selector. White fill, 1px Soft Mist border. The trailing search button is a 40px circle filled with Eventbrite Ember Orange (#f05537) containing a white magnifier icon — the only circular orange element in the system.

### Pill Nav Link
**Role:** Header navigation items

14px Neue Plak Text weight 600, Aubergine Ink text, no border or fill. Horizontal row with 16-24px gaps. 'Sign in' sits at the far right as a ghost text link.

### Outlined Action Link
**Role:** Interactive text/button — the primary CTA style

1.5px Electric Iris (#3659e3) border with Electric Iris text, 4-8px radius (not pill for inline actions). Used for 'Get Into Live Music', category filters, and event detail links. 12px 16px padding. Underline appears on hover.

### Filled Cookie Accept Button
**Role:** The sole filled-button instance — the cookie consent CTA

Eventbrite Ember Orange (#f05537) fill, white text, 4px radius, 8px 16px padding. This is the only filled-color button in the product UI and exists only in the consent overlay.

### Event Status Badge
**Role:** Small label for event capacity or status

20px radius, white fill with 1px Soft Mist border, 12px Neue Plak 600 Aubergine Ink text. 4px 8px padding. Examples: 'Almost full', 'Sales end soon'.

### Pagination Arrow Button
**Role:** Circular chevron for paginating event rows

40px circle, white fill, 1px Soft Mist border, centered chevron icon in Aubergine Ink. Two sit side by side (left/right) at section end.

### Search Input Field
**Role:** Text input within the header search bar

No visible border — sits inside the Pill Search Bar container. Placeholder text in Smoke (#6f7287), 14px weight 400. The search icon and orange submit button are external to the input itself.

### Cookie Consent Panel
**Role:** Fixed-bottom overlay for GDPR/privacy controls

White surface with 8px radius, subtle border, anchored bottom-left. Heading 'We use cookies' in 16px weight 600 Plum Depth. Body text in 14px Smoke. Three stacked buttons on the right: Filled Cookie Accept (orange), and two ghost buttons with Aubergine Ink borders labeled 'Reject all' and 'More choices'.

### Event Grid Row
**Role:** Horizontal arrangement of Event Listing Cards

4 columns on desktop, 16-24px gaps between cards, wrapping to 2 columns on tablet, 1 column on mobile. Each row represents one section of curated or algorithmically-grouped events.

## Do's and Don'ts

### Do
- Use 40px border-radius for all content cards — this is the system's defining softness; flattening to 8px breaks the visual identity.
- Reserve Electric Iris (#3659e3) for interactive elements only — links, outlined buttons, selected states, icon accents. Never use it for decorative fills or large background blocks.
- Use Aubergine Ink (#39364f) for all body text and borders instead of pure black — the slight warmth is what keeps the interface from feeling cold.
- Default to outlined or ghost action styles; the only filled button in product UI is the cookie consent CTA in Ember Orange.
- Set page background to Warm Linen (#f8f7fa) and card surfaces to Pure White (#ffffff) — the two-tone layering is how depth is communicated without shadows.
- Use 14px Neue Plak as the default body size; only go to 16px+ for event titles and primary content.
- Apply 1px Soft Mist (#dbdae3) borders for all card and list separators; avoid box-shadows for elevation.

### Don't
- Do not use Ember Orange (#f05537) for product actions, CTAs, or interactive elements — it is reserved for the brand mark and the cookie consent button only.
- Do not use pure black (#000000) for body text — always use Aubergine Ink (#39364f) for warmth.
- Do not add drop shadows to cards; the 40px radius + 1px border is the elevation language.
- Do not introduce a second typeface; Neue Plak carries the entire system.
- Do not use Electric Iris as a large surface fill — keep it to 1.5px outlines and icon strokes to preserve its signal value.
- Do not use sharp 0px or 2px radius on cards — the softness is a brand pillar.
- Do not use Plum Depth (#1e0a3c) for body text; reserve it for event titles and large headings where deep emphasis is needed.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Warm Linen Canvas | `#f8f7fa` | Page-level background, behind all content |
| 1 | Pure White Card | `#ffffff` | Event cards, badges, nav, and all elevated surfaces above the canvas |
| 2 | Cloud Veil Wash | `#eeedf2` | Subtle differentiation for secondary cards or grouped sections |

## Elevation

Elevation is communicated entirely through surface color (Warm Linen canvas → Pure White card) and 1px borders, never through drop shadows. This keeps the interface flat, fast, and editorial — the 40px corner radius does the visual work that shadows would otherwise do.

## Imagery

The hero uses a full-bleed photograph of a live performance — warm, slightly desaturated stage lighting on a singer with microphone, creating an intimate concert atmosphere. The overlay text card is a white rectangle with hard 4px corners floating over the photo, creating a contrast between the soft photo and the crisp UI. Event listing cards rely entirely on user-uploaded event imagery — a wildly diverse mix of promotional posters, venue photos, speaker headshots, and branded event graphics, all displayed at 16:9 in the top portion of each card. Category icons are simple line illustrations (microphone, disco ball, masks, sparkler, game controller, etc.) in a single stroke weight, rendered in Aubergine Ink on white circular backgrounds. No illustrations, 3D renders, or abstract graphics appear in the chrome.

## Layout

Max-width 1200px centered container on a Warm Linen canvas. The header is a sticky white nav bar with the Eventbrite wordmark on the left, a pill-shaped search bar in the center with location pre-set to a city, and text nav links plus a ghost 'Sign in' on the right. The hero is a full-bleed photographic banner (~320px tall) with a white overlay text card left-aligned containing a tagline, headline, and outlined CTA. Below the hero, a horizontal row of 8 circular category icons sits centered. The main content is a vertically stacked series of event grid rows, each containing 4 Event Listing Cards with 16-24px gaps. Rows are separated by ~64-80px of vertical breathing room. Pagination chevrons sit at the right end of each section. A fixed cookie consent panel anchors to the bottom-left, overlaying content. The overall rhythm is: dense event grid → generous white space → dense event grid, creating a scrolling discovery feed.

## Agent Prompt Guide

## Quick Color Reference
- text: #39364f (Aubergine Ink)
- background: #f8f7fa (Warm Linen)
- card surface: #ffffff (Pure White)
- border: #dbdae3 (Soft Mist)
- accent: #3659e3 (Electric Iris)
- primary action: #3659e3 (outlined action border)

## 3-5 Example Component Prompts
1. **Event Listing Card**: White (#ffffff) surface on Warm Linen (#f8f7fa) canvas. 40px border-radius, 1px Soft Mist (#dbdae3) border, no shadow. Top: 16:9 event image with top corners clipping to 40px. Below: 12px padding. Title in 16px Neue Plak weight 600 Plum Depth (#1e0a3c). Date/venue in 14px weight 400 Aubergine Ink (#39364f). Price in 14px weight 600.
2. **Hero Banner**: Full-bleed photographic background (concert/live event). Overlay: left-aligned white rectangle with 4px radius containing 'GET INTO IT' in 14px weight 600, then 'FROM POP BALLADS TO EMO ENCORES' in 32px weight 700 Plum Depth. Below: outlined ghost action — Electric Iris (#3659e3) 1.5px border, Electric Iris text, 360px pill radius, 12px 24px padding, 14px weight 600.
3. **Pill Search Bar**: 100px border-radius container, white fill, 1px Soft Mist border, ~48px tall. Left: search input with placeholder 'Search events' in Smoke (#6f7287) 14px. Center divider. Right: location text with pin icon. Far right: 40px circle filled Ember Orange (#f05537) with white magnifier icon.
4. **Category Circle Icon Row**: 8 circles in a horizontal row, each 80px diameter, white fill, 1px Soft Mist border, centered line icon in Aubergine Ink at 24px. 24px gap between circles. Labels in 14px weight 400 Aubergine Ink below each circle.
5. **Cookie Consent Panel**: Fixed bottom-left overlay, white surface, 8px radius, 1px Soft Mist border. Heading 'We use cookies' in 16px weight 600 Plum Depth. Body in 14px Smoke. Three stacked buttons on the right: filled Ember Orange 'Accept all' (4px radius, white text, 8px 16px padding), then two ghost buttons with Aubergine Ink border labeled 'Reject all' and 'More choices'.

## Rounded Corner Philosophy

Corner radius is the most opinionated decision in this system. Cards get 40px — extraordinarily soft for content surfaces, making every event feel approachable. Badges and tags get 20px — half of card radius, creating a nested softness. Buttons in the header get 360px (full pill). Nav containers get 100px (near-pill). Inputs and small elements get 4px — the only place sharp edges survive. The hierarchy is: 4px (small/cold) → 20px (tags) → 40px (cards) → 100px (nav) → 360px (buttons). Never break this scale; never go to 8px or 12px on cards.

## Similar Brands

- **Meetup** — Same warm off-white canvas with generous card rounding and a single accent color for links; both are event-discovery grids with photographic card imagery.
- **Ticketmaster** — Event-listing grid layout with full-bleed hero photography, though Ticketmaster uses sharper corners and a darker palette.
- **Dice** — Dark-on-light event grid with pill-shaped controls and large-radius cards, targeting the same live-event discovery audience.
- **Airbnb** — Similar warm-neutral canvas with very generous card border-radius and photographic event cards; both favor rounded-softness as a brand signal.

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-aubergine-ink: #39364f;
  --color-pure-white: #ffffff;
  --color-warm-linen: #f8f7fa;
  --color-soft-mist: #dbdae3;
  --color-pale-silver: #bec0c6;
  --color-cloud-veil: #eeedf2;
  --color-periwinkle-tint: #dee5ff;
  --color-carbon: #000000;
  --color-smoke: #6f7287;
  --color-plum-depth: #1e0a3c;
  --color-indigo-slate: #585163;
  --color-electric-iris: #3659e3;
  --color-ember-orange: #f05537;

  /* Typography — Font Families */
  --font-neue-plak: 'Neue Plak', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-neue-plak-text: 'Neue Plak Text', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.43;
  --text-body-sm: 14px;
  --leading-body-sm: 1.43;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-subheading: 18px;
  --leading-subheading: 1.43;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.33;
  --text-heading: 32px;
  --leading-heading: 1.2;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-36: 36px;
  --spacing-40: 40px;
  --spacing-48: 48px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 64-80px;
  --card-padding: 12-16px;
  --element-gap: 12px;

  /* Border Radius */
  --radius-sm: 1px;
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-2xl: 16px;
  --radius-2xl-2: 20px;
  --radius-3xl: 40px;
  --radius-full: 100px;
  --radius-full-2: 360px;

  /* Named Radii */
  --radius-nav: 100px (pill nav containers);
  --radius-tags: 20px;
  --radius-cards: 40px;
  --radius-badges: 20px;
  --radius-inputs: 4px;
  --radius-buttons: 360px (pill);

  /* Surfaces */
  --surface-warm-linen-canvas: #f8f7fa;
  --surface-pure-white-card: #ffffff;
  --surface-cloud-veil-wash: #eeedf2;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-aubergine-ink: #39364f;
  --color-pure-white: #ffffff;
  --color-warm-linen: #f8f7fa;
  --color-soft-mist: #dbdae3;
  --color-pale-silver: #bec0c6;
  --color-cloud-veil: #eeedf2;
  --color-periwinkle-tint: #dee5ff;
  --color-carbon: #000000;
  --color-smoke: #6f7287;
  --color-plum-depth: #1e0a3c;
  --color-indigo-slate: #585163;
  --color-electric-iris: #3659e3;
  --color-ember-orange: #f05537;

  /* Typography */
  --font-neue-plak: 'Neue Plak', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-neue-plak-text: 'Neue Plak Text', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.43;
  --text-body-sm: 14px;
  --leading-body-sm: 1.43;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-subheading: 18px;
  --leading-subheading: 1.43;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.33;
  --text-heading: 32px;
  --leading-heading: 1.2;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-36: 36px;
  --spacing-40: 40px;
  --spacing-48: 48px;

  /* Border Radius */
  --radius-sm: 1px;
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-2xl: 16px;
  --radius-2xl-2: 20px;
  --radius-3xl: 40px;
  --radius-full: 100px;
  --radius-full-2: 360px;
}
```
