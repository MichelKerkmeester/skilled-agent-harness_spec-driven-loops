# Monad — Style Reference
> editorial tech journal on warm parchment

**Theme:** light

Monad renders its entire interface on a warm parchment canvas (#f6f3f1) that immediately separates it from the typical pure-white SaaS template. Headlines carry editorial weight in Untitled Serif at weight 400 — never bold — while every body, nav, and UI string runs in ABC Diatype Mono, giving the site the texture of a technical manual typeset for a literary magazine. A single vivid Lake Blue (#2b59d1) is the only chromatic accent for primary actions; everything else lives in a warm grayscale, so a periwinkle card surface (#cfdaf5) and soft pastel gradient washes (coral, sky, mint, gold) read as deliberate punctuation rather than noise. Components lean on hairline borders and 100px pill containers rather than shadows, and the rhythm stays calm and spacious with 40px card padding and generous vertical breathing room between sections.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Parchment | `#f6f3f1` | `--color-parchment` | Page canvas and the majority of surface fills — this warm off-white IS the brand's signature surface, immediately distinguishing the site from pure-white SaaS templates |
| Lake Blue | `#2b59d1` | `--color-lake-blue` | Violet wash for highlight backgrounds, decorative bands, and soft emphasis behind content. Do not promote it to the primary CTA color |
| Periwinkle Mist | `#cfdaf5` | `--color-periwinkle-mist` | Muted UI surface for disabled controls, low-emphasis panels, and placeholder blocks. |
| Sky Blue | `#a0b5eb` | `--color-sky-blue` | Decorative gradient stop — appears in atmospheric washes and the pipeline diagram's flow lines, never as a UI fill |
| Mint | `#a7fccd` | `--color-mint` | Supporting palette color for small decorative accents when the core palette needs contrast. |
| Coral | `#ff9473` | `--color-coral` | Supporting palette color for small decorative accents when the core palette needs contrast. |
| Gold | `#ecda98` | `--color-gold` | Decorative gradient stop — warm accent in gradient washes, never used in functional UI |
| Crimson | `#f37a0a` | `--color-crimson` | Decorative gradient stop — deep warm tone in gradient washes alongside gold and coral |
| Off-Black | `#242424` | `--color-off-black` | High-contrast neutral action fill for primary buttons on light surfaces. |
| Ink | `#000000` | `--color-ink` | Announcement bar surface and certain heading fills — the black band at the top of the page and select heading contexts |
| Graphite | `#4e4d4d` | `--color-graphite` | Secondary text — body copy and sub-headings that need less weight than primary headlines |
| Smoke | `#797776` | `--color-smoke` | Muted helper text and tertiary links |
| Ash | `#cecac8` | `--color-ash` | Hairline borders — 1px solid lines separating sections, outlining pipeline diagram nodes, and defining card edges |

## Tokens — Typography

### ABC Diatype Mono — Body text, navigation, buttons, badges, tags, and ALL UI strings. The monospace choice across every functional element gives the interface its technical-manual character — body copy at 16-20px reads as data, not marketing. Nav labels and badges use 18px uppercase with tighter tracking; small print and meta text use 12px uppercase. Weight 500 is reserved for emphasized UI labels. · `--font-abc-diatype-mono`
- **Substitute:** JetBrains Mono, IBM Plex Mono, or Space Mono
- **Weights:** 400, 500
- **Sizes:** 12px, 14px, 16px, 18px, 20px, 28px
- **Line height:** 1.0–1.35 (varies by size)
- **Letter spacing:** -0.033em at 12px, -0.025em at 16px, -0.022em at 18px, -0.02em at 14px and 20px, -0.014em at 28px
- **Role:** Body text, navigation, buttons, badges, tags, and ALL UI strings. The monospace choice across every functional element gives the interface its technical-manual character — body copy at 16-20px reads as data, not marketing. Nav labels and badges use 18px uppercase with tighter tracking; small print and meta text use 12px uppercase. Weight 500 is reserved for emphasized UI labels.

### Untitled Serif — Display and heading type only — used at 80px (hero), 48px (section), 40px and 32px (sub-section), 24px (feature card titles). Weight is locked at 400 across all sizes; the serif's natural contrast and the -0.02em letter-spacing do the heavy lifting instead of bold weight. This is the editorial confidence signature: headlines whisper through typographic refinement rather than shout through weight. · `--font-untitled-serif`
- **Substitute:** Times New Roman, Georgia, or any editorial serif with similar stroke contrast
- **Weights:** 400
- **Sizes:** 24px, 32px, 40px, 48px, 80px
- **Line height:** 1.2
- **Letter spacing:** -0.02em at all sizes (-1.6px at 80px, -0.96px at 48px, -0.8px at 40px, -0.64px at 32px, -0.48px at 24px)
- **Role:** Display and heading type only — used at 80px (hero), 48px (section), 40px and 32px (sub-section), 24px (feature card titles). Weight is locked at 400 across all sizes; the serif's natural contrast and the -0.02em letter-spacing do the heavy lifting instead of bold weight. This is the editorial confidence signature: headlines whisper through typographic refinement rather than shout through weight.

### Untitled Sans — Untitled Sans — detected in extracted data but not described by AI · `--font-untitled-sans`
- **Weights:** 400
- **Sizes:** 16px
- **Line height:** 1.35
- **Letter spacing:** -0.02
- **Role:** Untitled Sans — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.2 | -0.4px | `--text-caption` |
| body-sm | 14px | 1.35 | -0.28px | `--text-body-sm` |
| body | 16px | 1.35 | -0.4px | `--text-body` |
| label | 18px | 1.2 | -0.4px | `--text-label` |
| body-lg | 20px | 1.35 | -0.4px | `--text-body-lg` |
| subheading | 24px | 1.2 | -0.48px | `--text-subheading` |
| heading-sm | 32px | 1.2 | -0.64px | `--text-heading-sm` |
| heading | 40px | 1.2 | -0.8px | `--text-heading` |
| heading-lg | 48px | 1.2 | -0.96px | `--text-heading-lg` |
| display | 80px | 1.2 | -1.6px | `--text-display` |

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
| 72 | 72px | `--spacing-72` |
| 80 | 80px | `--spacing-80` |
| 200 | 200px | `--spacing-200` |
| 216 | 216px | `--spacing-216` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 9999px |
| cards | 40px |
| pills | 9999px |
| buttons | 100px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| md | `rgba(0, 0, 0, 0.1) 0px 0px 10px 0px` | `--shadow-md` |

### Layout

- **Page max-width:** 1432px
- **Section gap:** 64px
- **Card padding:** 40px
- **Element gap:** 16px

## Components

### Announcement Bar
**Role:** Top-of-page notification strip

Full-width black (#000000) bar, ~40px tall, containing mono text in white (#f6f3f1) at 14px and a small white pill button (9999px radius, white border, 12px uppercase text) anchored right. Close icon (×) in white at far right.

### Primary Pill Button (Blue)
**Role:** Primary conversion action

Lake Blue (#2b59d1) fill, white text in ABC Diatype Mono at 14px uppercase, 100px border-radius, 16px 32px padding, with a trailing arrow (▸) glyph in white. Height ~48px. This is the only saturated fill in the system.

### Primary Pill Button (Black)
**Role:** Secondary conversion action

Off-Black (#242424) fill, white text in ABC Diatype Mono at 14px uppercase, 100px border-radius, 16px 32px padding, no arrow. Height ~48px.

### Ghost Pill Button
**Role:** Tertiary navigation action

Transparent fill, 1px Off-Black (#242424) border, Off-Black text in ABC Diatype Mono at 14px uppercase, 100px border-radius, 16px 32px padding. Height ~48px.

### Text Link with Arrow
**Role:** Navigation link with directional indicator

Transparent fill, Off-Black (#242424) text in ABC Diatype Mono at 14px, trailing rightward arrow (→) in Off-Black. No background or border. Uppercase tracking.

### Pipeline Node Tag
**Role:** Labeled node in the data pipeline diagram

Parchment (#f6f3f1) fill, 1px Ash (#cecac8) border, 9999px border-radius (full pill), small mono icon (12px) + 14px mono uppercase text, 12px 20px padding. Connected by thin curved Ash lines to adjacent nodes.

### Feature Card
**Role:** Product capability card with icon, title, description

Transparent or Parchment fill, 1px Ash (#cecac8) border, 40px border-radius, 40px padding. Small mono icon (20px) in top-left at 16px padding offset. Title in Untitled Serif at 24px weight 400, Off-Black. Body in ABC Diatype Mono at 16px weight 400, Graphite (#4e4d4d). No shadow.

### Elevated Feature Card (Periwinkle)
**Role:** Hero feature card with gradient illustration

Periwinkle Mist (#cfdaf5) fill, 40px border-radius, 40px padding. Contains a large gradient illustration on the right side using Coral → Sky Blue → Mint washes. Title in Untitled Serif 24px, body in mono 16px. This is the one card that uses a colored surface to draw the eye.

### FAQ Accordion Item
**Role:** Expandable question/answer row

Full-width row, 40px vertical padding, 1px Ash (#cecac8) bottom border (no top border). Question text in Untitled Serif at 24px weight 400, Off-Black. Trailing chevron icon (↓) in Off-Black, 20px, right-aligned. No background fill change on hover.

### Logo Strip
**Role:** Social proof partner logo row

Single horizontal row of 6-7 partner logos in grayscale (desaturated from original brand colors), evenly spaced with ~32px gaps, left-aligned within max-width container. No logo lockup borders or cards.

### Gradient Atmospheric Wash
**Role:** Decorative background gradient blob

Large blurred radial/linear gradient using Coral (#ff9473 80% opacity) → Sky Blue (#a0b5eb 80% opacity) or Sky Blue → Mint (#a7fccd), rendered with blur(50-75px) filter, positioned behind hero or feature content. Never sharp-edged, always softly diffused.

### Navigation Bar
**Role:** Primary site navigation

Transparent or Parchment background, logo on far left (monad wordmark + circular dot mark), 4-5 nav text links centered or left-grouped in ABC Diatype Mono 18px uppercase Off-Black, action buttons (Login ghost + Get a Demo blue pill) right-aligned. ~80px height, no visible border.

### Hero Section
**Role:** First-screen headline and subtext

Full-width Parchment background, centered content stack: Untitled Serif headline at 80px weight 400 Off-Black, monospace subtext at 20px Graphite (#4e4d4d) at 1.35 line-height, two pill buttons centered below. No background image — pure typographic hero.

## Do's and Don'ts

### Do
- Use Untitled Serif at weight 400 for all headings — never go bold; the serif's stroke contrast and -0.02em tracking carry the weight visually
- Use ABC Diatype Mono for all body copy, buttons, nav labels, badges, and functional UI text — the monospace IS the brand voice
- Set all button and tag border-radius to 100px or 9999px — pill shapes are the container language of this system
- Use Parchment (#f6f3f1) as the page canvas — never substitute pure white (#ffffff); the warm tint is signature
- Reserve Lake Blue (#2b59d1) exclusively for the single primary action per screen; all other buttons use Off-Black or ghost variants
- Use 1px solid Ash (#cecac8) for all borders and dividers — avoid thicker weights or darker border colors
- Apply uppercase + tight tracking to all nav labels, buttons, and tag text via the monospace family

### Don't
- Never set headings in bold or 600+ weight — Untitled Serif headlines stay at 400 across all sizes
- Never use pure white (#ffffff) as a page background — always use Parchment (#f6f3f1) to preserve the warm surface
- Never use Lake Blue (#2b59d1) for anything other than the single primary action fill — it loses meaning if scattered
- Never substitute a sans-serif for the monospace body font — the mono/serif pairing is the defining typographic gesture
- Never apply drop shadows to cards — use 1px Ash borders and surface color contrast (Parchment → Periwinkle) for elevation instead
- Never use corner radii below 16px on cards or below 100px on buttons — the system is pill-and-soft-rect, never sharp
- Never introduce additional accent colors for UI elements — the pastel palette (Sky, Mint, Coral, Gold) is decorative-only and belongs in illustrations and gradient washes

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Parchment | `#f6f3f1` | Page canvas — the base warm off-white that fills the entire viewport |
| 2 | Periwinkle Mist | `#cfdaf5` | Elevated card surface — the one colored card that breaks the monochrome to draw the eye |
| 3 | Off-Black | `#242424` | Dark surface for secondary buttons and inverted UI contexts |
| 4 | Ink | `#000000` | Announcement bar — the darkest surface, used for the top notification strip |

## Elevation

- **Subtle ambient elevation:** `rgba(0, 0, 0, 0.1) 0px 0px 10px 0px`

## Imagery

The visual language is dominated by a custom data pipeline diagram: pill-shaped bordered nodes connected by thin curved lines, with small icons inside each node representing data sources (Any Source, Cloud Logs, Vulnerabilities) and destinations (SIEM, Cloud Storage, Data Lake). The diagram uses a soft green radial glow at the center hub to suggest data normalization. Gradient atmospheric washes (Coral → Sky Blue, Sky Blue → Mint) with heavy blur filters create soft color halos behind hero and feature content. Partner logos appear desaturated in a single social-proof row. The 'In-flight Data Transforms' card features a large gradient illustration with overlapping translucent geometric shapes. No photography is used — the brand communicates through typography, diagram, and color wash alone.

## Agent Prompt Guide

Quick Color Reference:
- text: #242424 (Off-Black)
- background: #f6f3f1 (Parchment)
- border: #cecac8 (Ash)
- accent: #2b59d1 (Lake Blue)
- primary action: no distinct CTA color

Example Component Prompts:

1. Create a hero section on Parchment (#f6f3f1) background. Centered headline in Untitled Serif at 80px weight 400, color #242424, letter-spacing -1.6px. Subtext below in ABC Diatype Mono at 20px weight 400, color #4e4d4d, line-height 1.35. Two centered pill buttons: primary Lake Blue (#2b59d1) with white text, and ghost (1px #242424 border, transparent fill, #242424 text), both 100px border-radius, 16px 32px padding, ABC Diatype Mono 14px uppercase.

2. Create a feature card on Parchment background. 1px solid #cecac8 border, 40px border-radius, 40px padding. Small 20px mono icon top-left at #242424. Title in Untitled Serif 24px weight 400, #242424. Body in ABC Diatype Mono 16px weight 400, #4e4d4d. No shadow.

3. Create a secondary pill button: Off-Black (#242424) fill, white text in ABC Diatype Mono 14px uppercase, 100px border-radius, 16px 32px padding, no arrow.

4. Create an FAQ accordion row: full-width, 40px vertical padding, 1px solid #cecac8 bottom border only. Question in Untitled Serif 24px weight 400, #242424. Trailing down-chevron icon (↓) in #242424 at 20px, right-aligned. No background fill.

5. Create a pipeline diagram node tag: Parchment (#f6f3f1) fill, 1px solid #cecac8 border, 9999px border-radius, 12px 20px padding. Small 12px icon + 14px text in ABC Diatype Mono uppercase, #242424.

## Typography Pairing Philosophy

The serif-mono pairing is the single most distinctive design choice in this system. Untitled Serif handles all hierarchical display text (headlines, section titles, feature card titles, FAQ questions) — it carries editorial authority through its stroke contrast and refined letterforms, not through weight (always 400). ABC Diatype Mono handles everything functional: body paragraphs, navigation, button labels, badges, tags, and inline UI text. This creates a consistent voice: the serif announces, the mono instructs. A page that swapped in a sans-serif for body would lose its identity immediately.

## Similar Brands

- **Linear** — Shares the restrained monochrome palette and minimal-elevation card approach, though Monad's warm Parchment canvas and serif headlines set it apart from Linear's cooler white surface
- **Stripe** — Both use custom editorial serif typefaces for headlines with tight letter-spacing and -0.02em tracking, treating the homepage as a typographic composition rather than a product screenshot
- **Vercel** — Shares the comfortable-density spacing, generous section gaps, and pill-shaped button language, though Monad adds the warm canvas and mono body twist
- **Railway** — Both target developer audiences with a monospace-leaning UI vocabulary and minimal decoration, but Monad layers in the editorial serif for a more literary feel
- **Arc Browser** — Both use warm off-white surfaces rather than pure white, and both treat the page as a designed editorial artifact rather than a typical SaaS template

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-parchment: #f6f3f1;
  --color-lake-blue: #2b59d1;
  --color-periwinkle-mist: #cfdaf5;
  --color-sky-blue: #a0b5eb;
  --color-mint: #a7fccd;
  --color-coral: #ff9473;
  --color-gold: #ecda98;
  --color-crimson: #f37a0a;
  --color-off-black: #242424;
  --color-ink: #000000;
  --color-graphite: #4e4d4d;
  --color-smoke: #797776;
  --color-ash: #cecac8;

  /* Typography — Font Families */
  --font-abc-diatype-mono: 'ABC Diatype Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-untitled-serif: 'Untitled Serif', ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
  --font-untitled-sans: 'Untitled Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.2;
  --tracking-caption: -0.4px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.35;
  --tracking-body-sm: -0.28px;
  --text-body: 16px;
  --leading-body: 1.35;
  --tracking-body: -0.4px;
  --text-label: 18px;
  --leading-label: 1.2;
  --tracking-label: -0.4px;
  --text-body-lg: 20px;
  --leading-body-lg: 1.35;
  --tracking-body-lg: -0.4px;
  --text-subheading: 24px;
  --leading-subheading: 1.2;
  --tracking-subheading: -0.48px;
  --text-heading-sm: 32px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: -0.64px;
  --text-heading: 40px;
  --leading-heading: 1.2;
  --tracking-heading: -0.8px;
  --text-heading-lg: 48px;
  --leading-heading-lg: 1.2;
  --tracking-heading-lg: -0.96px;
  --text-display: 80px;
  --leading-display: 1.2;
  --tracking-display: -1.6px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;

  /* Spacing */
  --spacing-unit: 8px;
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-64: 64px;
  --spacing-72: 72px;
  --spacing-80: 80px;
  --spacing-200: 200px;
  --spacing-216: 216px;

  /* Layout */
  --page-max-width: 1432px;
  --section-gap: 64px;
  --card-padding: 40px;
  --element-gap: 16px;

  /* Border Radius */
  --radius-2xl: 16px;
  --radius-3xl: 40px;
  --radius-full: 100px;
  --radius-full-2: 2000px;
  --radius-full-3: 9999px;

  /* Named Radii */
  --radius-tags: 9999px;
  --radius-cards: 40px;
  --radius-pills: 9999px;
  --radius-buttons: 100px;

  /* Shadows */
  --shadow-md: rgba(0, 0, 0, 0.1) 0px 0px 10px 0px;

  /* Surfaces */
  --surface-parchment: #f6f3f1;
  --surface-periwinkle-mist: #cfdaf5;
  --surface-off-black: #242424;
  --surface-ink: #000000;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-parchment: #f6f3f1;
  --color-lake-blue: #2b59d1;
  --color-periwinkle-mist: #cfdaf5;
  --color-sky-blue: #a0b5eb;
  --color-mint: #a7fccd;
  --color-coral: #ff9473;
  --color-gold: #ecda98;
  --color-crimson: #f37a0a;
  --color-off-black: #242424;
  --color-ink: #000000;
  --color-graphite: #4e4d4d;
  --color-smoke: #797776;
  --color-ash: #cecac8;

  /* Typography */
  --font-abc-diatype-mono: 'ABC Diatype Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-untitled-serif: 'Untitled Serif', ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
  --font-untitled-sans: 'Untitled Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.2;
  --tracking-caption: -0.4px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.35;
  --tracking-body-sm: -0.28px;
  --text-body: 16px;
  --leading-body: 1.35;
  --tracking-body: -0.4px;
  --text-label: 18px;
  --leading-label: 1.2;
  --tracking-label: -0.4px;
  --text-body-lg: 20px;
  --leading-body-lg: 1.35;
  --tracking-body-lg: -0.4px;
  --text-subheading: 24px;
  --leading-subheading: 1.2;
  --tracking-subheading: -0.48px;
  --text-heading-sm: 32px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: -0.64px;
  --text-heading: 40px;
  --leading-heading: 1.2;
  --tracking-heading: -0.8px;
  --text-heading-lg: 48px;
  --leading-heading-lg: 1.2;
  --tracking-heading-lg: -0.96px;
  --text-display: 80px;
  --leading-display: 1.2;
  --tracking-display: -1.6px;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-64: 64px;
  --spacing-72: 72px;
  --spacing-80: 80px;
  --spacing-200: 200px;
  --spacing-216: 216px;

  /* Border Radius */
  --radius-2xl: 16px;
  --radius-3xl: 40px;
  --radius-full: 100px;
  --radius-full-2: 2000px;
  --radius-full-3: 9999px;

  /* Shadows */
  --shadow-md: rgba(0, 0, 0, 0.1) 0px 0px 10px 0px;
}
```
