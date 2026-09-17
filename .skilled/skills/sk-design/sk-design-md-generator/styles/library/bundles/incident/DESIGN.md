# Incident — Style Reference
> Technical broadsheet on concrete. Times-serif headlines float on a warm-gray page with hairline black rules and a single orange flare that breaks the calm like a signal beacon.

**Theme:** light

Incident treats the status page like an editorial publication: a Times-serif typeface on a concrete-gray canvas, hairlines of pure black, and one warm signal-orange that acts as a flare against the monochrome. The discipline is extreme — chromatic color is rationed, appearing only as brand accent fills, logo marks, and decorative file-type illustrations, never as button backgrounds or action fills. Surfaces are flat and paper-like; depth comes from soft 2-layer shadows on imagery rather than elevation stacking. The result reads as a trusted technical broadsheet rather than a typical dashboard — authority through typographic restraint, not color volume.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Signal Orange | `#f25533` | `--color-signal-orange` | Brand accent, logo mark, decorative SVG fills, nav emphasis — the single warm chromatic note that cuts through the monochrome system |
| Concrete | `#efefef` | `--color-concrete` | Page canvas, button background — the dominant surface tone that gives the system its paper-like warmth |
| Ink | `#000000` | `--color-ink` | Primary text, hairline borders (920+ uses), button outlines — pure black carries all structural line work |
| Paper | `#ffffff` | `--color-paper` | Card surfaces, nav fills — the white layer that sits on top of the concrete canvas |
| Carbon | `#161618` | `--color-carbon` | Near-black for nav strokes, emphasis text, and the tinted shadow base — softer than pure ink for layered elements |
| Mist | `#dadada` | `--color-mist` | Subtle drop-shadow tone, decorative image edge tint |
| Fog | `#cccccc` | `--color-fog` | Secondary shadow tone, decorative image edge tint |
| Parchment | `#e4d9c8` | `--color-parchment` | Warm cream decorative surface — near-gray but carries a beige cast that ties to the orange family |
| Alert Red | `#ff492c` | `--color-alert-red` | Orange decorative accent for icons, marks, and small graphic details. Use as a supporting accent, not as a status color |
| Ember | `#f1641e` | `--color-ember` | Orange outline accent for tags, dividers, and focused UI edges. Use as a supporting accent, not as a status color |

## Tokens — Typography

### Times (system serif) — Body text, headings, nav items, hero copy, card content, list items, footer — Times carries 770+ uses and is the signature typographic choice. A serif body face on a B2B incident-management product is anti-convention: it borrows the authority of a legal broadsheet or technical manual, replacing the usual Inter/system-ui with something that reads as deliberately editorial. Weight 400 for body, 700 for emphasis and headings. · `--font-times-system-serif`
- **Substitute:** Source Serif Pro, Lora, or Crimson Text — freely available serifs that preserve the editorial broadsheet feel
- **Weights:** 400, 700
- **Sizes:** 16px, 19px, 24px, 32px
- **Line height:** 1.20
- **Role:** Body text, headings, nav items, hero copy, card content, list items, footer — Times carries 770+ uses and is the signature typographic choice. A serif body face on a B2B incident-management product is anti-convention: it borrows the authority of a legal broadsheet or technical manual, replacing the usual Inter/system-ui with something that reads as deliberately editorial. Weight 400 for body, 700 for emphasis and headings.

### Arial (system sans) — Small UI micro-text: button labels, nav utility text, icon-adjacent labels. Arial at 13px handles the functional labels while Times carries the voice — a deliberate serif/sans split where Times says something and Arial just tags it. · `--font-arial-system-sans`
- **Substitute:** Inter or system-ui at 13px
- **Weights:** 400
- **Sizes:** 13px
- **Line height:** 1.20
- **Role:** Small UI micro-text: button labels, nav utility text, icon-adjacent labels. Arial at 13px handles the functional labels while Times carries the voice — a deliberate serif/sans split where Times says something and Arial just tags it.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| body | 16px | 1.2 | — | `--text-body` |
| body-lg | 19px | 1.2 | — | `--text-body-lg` |
| heading-sm | 24px | 1.2 | — | `--text-heading-sm` |
| heading | 32px | 1.2 | — | `--text-heading` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 6 | 6px | `--spacing-6` |
| 16 | 16px | `--spacing-16` |
| 19 | 19px | `--spacing-19` |
| 20 | 20px | `--spacing-20` |
| 21 | 21px | `--spacing-21` |
| 40 | 40px | `--spacing-40` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 4px |
| cards | 12px |
| buttons | 4px |
| alertBanners | 8px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| md | `rgba(22, 22, 24, 0.02) 0px 8px 15px -3px, rgba(22, 22, 24...` | `--shadow-md` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 64px
- **Card padding:** 24px
- **Element gap:** 16px

## Components

### Navigation Bar
**Role:** Top-level site navigation

White (#ffffff) background, sits on the concrete canvas. Uses Times for nav labels at 16px weight 400. The brand mark in Signal Orange (#f25533) anchors the left. Hairline black (#000000) bottom border separates it from page content. Carbon (#161618) used for stroked logo elements.

### Neutral Button
**Role:** Primary interactive action

Concrete (#efefef) background — the same as the page canvas, making the button feel like a raised card rather than a filled action. Black (#000000) 1px border, 4px radius, padding 1px top/bottom and 6px left/right (deliberately compact). Label in Arial 13px weight 400, Ink (#000000). No color fill, no shadow — the button is a labeled rectangle with a hairline frame.

### Critical Alert Banner
**Role:** Outage or incident status display

Soft red/pink wash background (tinted toward Alert Red #ff492c at low opacity), left-aligned warning triangle icon in Alert Red. Headline in Times 16px weight 700, body text in Times 16px weight 400. Full-width card with 8px radius and a saturated red border on the container card below.

### Warning Alert Banner
**Role:** Degraded service or maintenance notice

Amber/yellow icon (Ember #f1641e) with warning triangle. Headline in Times 16px weight 700, descriptive body in Times 16px weight 400. Sits inside a white card with a light amber-tinted border.

### Status Tag / Pill
**Role:** Component-level status indicator (e.g. Website, App)

Small rounded-corner tag, 4px radius. Tinted background matching the status color: soft red wash for outages, soft amber wash for degraded. Label in Arial or Times at 13px, color matching the status hue. Inline, sits adjacent to other tags.

### Status Card
**Role:** Container for a single incident report

White (#ffffff) background on the concrete canvas. 12px radius. Border is chromatic and status-dependent: red-pink for active incidents, amber for warnings, subtle gray for resolved. Internal padding 24px. Contains icon, headline, body, and metadata line in muted gray.

### Section Heading (Serif)
**Role:** Page and section titles

Times weight 400 or 700, 24–32px scale. Color is Ink (#000000) for primary, Carbon (#161618) for secondary. No underline, no decoration — the serif face does the hierarchy work. Often paired with a 16px body paragraph below in the same family at 16px.

### Text Link
**Role:** Inline navigation to subpages or external resources

Underlined text in a saturated blue (appears as ~#0000ff in rendered links), Arial or Times depending on context. No arrow, no icon — the underline is the affordance. Sits within serif body text blocks.

### File-Type Illustration
**Role:** Decorative graphic for file format references

Document-shape icon with a folded corner, filled in Signal Orange (#f25533), with white label text (e.g. 'PNG') in Arial bold. No shadow, no border — flat brand-colored fill on the concrete canvas.

### Product Feature Card
**Role:** Text-first card describing a product capability

No visible card container — text sits directly on the concrete canvas. Serif headline (Times 24–32px), sans-serif body description (Arial 13px or Times 16px), underlined text link. Accompanied optionally by a line-art illustration in blue or orange. Maximum text density without card chrome.

## Do's and Don'ts

### Do
- Use Times (or Source Serif Pro as substitute) for all body copy, headings, nav items, and hero text — the serif face is the brand voice
- Set the page canvas to #efefef (Concrete) and let cards sit in #ffffff (Paper) above it — never invert to a white page with gray cards
- Use #000000 for all structural borders and hairline rules — borderColor is the dominant role of pure black in this system
- Use Signal Orange (#f25533) only for brand marks, logo elements, decorative fills, and file-type illustrations — never for action buttons or functional UI
- Set button background to #efefef with a 1px black border, 4px radius, and 1px/6px padding — buttons should feel like labeled frames, not filled actions
- Keep the type scale tight: 13px (Arial micro-labels), 16px (Times body), 19px (Times body-lg), 24px (Times heading-sm), 32px (Times heading) — do not introduce sizes outside this range
- Use status-tinted card borders (red for critical, amber for warning) to communicate severity — the border color does the semantic work, not a colored background fill

### Don't
- Do not use sans-serif (Inter, system-ui) for body copy or headings — replacing Times breaks the editorial identity
- Do not add colored button fills (blue, orange, green) for primary actions — the system uses neutral concrete buttons with black borders
- Do not use gradients — no gradient was detected in the source and the flat editorial aesthetic rejects them
- Do not use heavy drop-shadows for elevation — shadows are reserved for image containers at 2-4% opacity only
- Do not introduce blue or green as brand or accent colors — the chromatic palette is exclusively warm (orange family and amber)
- Do not round buttons beyond 4px or use pill shapes — the slightly squared button geometry reinforces the broadsheet feel
- Do not use color to indicate active or selected states — rely on weight (400→700) and underline affordances within the serif system

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Concrete | `#efefef` | Page canvas — the warm light-gray base everything sits on |
| 2 | Paper | `#ffffff` | Card surfaces and nav containers — white layer above the concrete |
| 3 | Parchment | `#e4d9c8` | Decorative warm tint for file-type illustrations and graphic elements |

## Elevation

- **Image cards and decorative graphics:** `rgba(22, 22, 24, 0.02) 0px 8px 15px -3px, rgba(22, 22, 24, 0.04) 0px 4px 6px -2px`

## Imagery

Visual language is overwhelmingly text-dominant with sparse iconography. Imagery falls into three categories: (1) file-type illustrations — flat document shapes in Signal Orange with a folded corner and white format label (e.g. 'PNG'), used to anchor feature sections about file handling; (2) line-art directional arrows in saturated blue, used as decorative flow indicators on product pages; (3) product screenshots or UI captures with the signature soft carbon-tinted shadow (rgba(22,22,24,0.02–0.04)). No photography, no lifestyle imagery, no 3D renders. The page reads as editorial — images are functional illustrations, not atmospheric decoration.

## Layout

Max-width ~1200px centered on a concrete canvas. Pages are text-first: serif headlines, single-column body blocks, generous vertical breathing room (64px section gaps). No hero image — the top of each page is a centered or left-aligned serif headline over empty canvas. Sections flow as flat bands separated by hairline black rules rather than alternating background colors. Navigation is a simple top bar, not sticky or floating. Product feature sections use a asymmetric two-column layout (text-left, illustration-right) with no card containers — text sits directly on the canvas. The status page section uses full-width alert banners with chromatic-tinted borders. Overall density is low: whitespace is the primary structural element, with hairlines and serif hierarchy doing the organization work.

## Agent Prompt Guide

Quick Color Reference:
- Text: #000000 (Ink) for body, #161618 (Carbon) for emphasis
- Background: #efefef (Concrete) page canvas, #ffffff (Paper) cards
- Border: #000000 (Ink) for all structural hairlines
- Accent: #f25533 (Signal Orange) for brand marks and decorative fills only
- Status critical: #ff492c (Alert Red)
- Status warning: #f1641e (Ember)
- primary action: no distinct CTA color

3-5 Example Component Prompts:

1. Create a critical alert banner: soft red-pink wash background, Alert Red (#ff492c) warning triangle icon on the left. Headline 'Service disruption detected' in Times 16px weight 700, #000000. Body text in Times 16px weight 400, #000000. Full-width with 8px border-radius, sitting on a white card with a light red border.

2. Create a neutral button: #efefef background, 1px solid #000000 border, 4px border-radius, padding 1px top/bottom and 6px left/right. Label 'Get started' in Arial 13px weight 400, #000000. No shadow, no fill change on hover.

3. Create a page section heading: 'On-call gets the right people in the room' in Times 32px weight 700, #000000, on a #efefef page canvas. Below it, a body paragraph in Times 16px weight 400 at 19px line-height. No decorative elements, no underline, no accent color.

4. Create a status card: white (#ffffff) background, 12px border-radius, light amber-tinted (#f1641e at low opacity) 1px border. 24px internal padding. Contains a warning triangle icon in Ember (#f1641e), a Times 16px weight 700 headline, and a Times 16px weight 400 description.

5. Create a file-type illustration: a document shape with a folded top-right corner, filled in Signal Orange (#f25533), with 'PNG' in white Arial bold 32px centered. Flat — no shadow, no border, no gradient. Sits on the #efefef page canvas.

## Similar Brands

- **Stripe** — Same editorial restraint with hairline rules and high-contrast monochrome surfaces, though Stripe uses a sans-serif body face
- **Linear** — Shared minimal colorfulness and flat surface treatment, but Linear is dark-mode-first and sans-serif-driven
- **The Browser Company / Arc** — Similar warm-cream accent tones and a willingness to use typographic personality over color volume to build brand
- **Basecamp** — Same text-dominant, low-color-density editorial approach with flat surfaces and functional rather than decorative UI

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-signal-orange: #f25533;
  --color-concrete: #efefef;
  --color-ink: #000000;
  --color-paper: #ffffff;
  --color-carbon: #161618;
  --color-mist: #dadada;
  --color-fog: #cccccc;
  --color-parchment: #e4d9c8;
  --color-alert-red: #ff492c;
  --color-ember: #f1641e;

  /* Typography — Font Families */
  --font-times-system-serif: 'Times (system serif)', ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
  --font-arial-system-sans: 'Arial (system sans)', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-body: 16px;
  --leading-body: 1.2;
  --text-body-lg: 19px;
  --leading-body-lg: 1.2;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.2;
  --text-heading: 32px;
  --leading-heading: 1.2;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-6: 6px;
  --spacing-16: 16px;
  --spacing-19: 19px;
  --spacing-20: 20px;
  --spacing-21: 21px;
  --spacing-40: 40px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 64px;
  --card-padding: 24px;
  --element-gap: 16px;

  /* Named Radii */
  --radius-tags: 4px;
  --radius-cards: 12px;
  --radius-buttons: 4px;
  --radius-alertbanners: 8px;

  /* Shadows */
  --shadow-md: rgba(22, 22, 24, 0.02) 0px 8px 15px -3px, rgba(22, 22, 24, 0.04) 0px 4px 6px -2px;

  /* Surfaces */
  --surface-concrete: #efefef;
  --surface-paper: #ffffff;
  --surface-parchment: #e4d9c8;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-signal-orange: #f25533;
  --color-concrete: #efefef;
  --color-ink: #000000;
  --color-paper: #ffffff;
  --color-carbon: #161618;
  --color-mist: #dadada;
  --color-fog: #cccccc;
  --color-parchment: #e4d9c8;
  --color-alert-red: #ff492c;
  --color-ember: #f1641e;

  /* Typography */
  --font-times-system-serif: 'Times (system serif)', ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
  --font-arial-system-sans: 'Arial (system sans)', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-body: 16px;
  --leading-body: 1.2;
  --text-body-lg: 19px;
  --leading-body-lg: 1.2;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.2;
  --text-heading: 32px;
  --leading-heading: 1.2;

  /* Spacing */
  --spacing-6: 6px;
  --spacing-16: 16px;
  --spacing-19: 19px;
  --spacing-20: 20px;
  --spacing-21: 21px;
  --spacing-40: 40px;

  /* Shadows */
  --shadow-md: rgba(22, 22, 24, 0.02) 0px 8px 15px -3px, rgba(22, 22, 24, 0.04) 0px 4px 6px -2px;
}
```
