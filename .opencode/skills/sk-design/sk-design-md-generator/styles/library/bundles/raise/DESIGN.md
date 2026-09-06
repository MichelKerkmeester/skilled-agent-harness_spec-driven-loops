# Raise — Style Reference
> sunlit open ledger — a near-white page with a single deep-navy headline and a hand-drawn illustration pulling warmth into a financial interface.

**Theme:** light

Open Collective's design language is a sunlit open ledger: a near-white canvas, hairline cool-gray dividers, and one deep navy that does all the chromatic work. Headlines carry the brand — oversized, weight 800, tightly tracked Inter at 60–72px — sitting directly on white with no panel behind them, so type itself becomes the hero. Body copy stays in a compact, near-black ink, never pure black, giving the financial content a softer documentary feel. Soft watercolor illustration breaks up the financial density with human warmth; UI chrome stays minimal, with 12px radii and a single subtle card shadow. Color is rationed like ink: the navy is the only saturated hue, used for headings, primary actions, and the brand mark — everything else is neutral.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Collective Navy | `#0c2764` | `--color-collective-navy` | Primary headings, primary CTA button fill, brand mark, active navigation — the only saturated color on the page, used to anchor identity and signal action |
| Inkwell | `#0f172b` | `--color-inkwell` | Primary body text, high-emphasis copy, button text on light backgrounds, icon strokes — the default text color across nearly all contexts |
| Slate Ink | `#1d293d` | `--color-slate-ink` | Secondary headings, icon strokes, body text where slightly lighter weight is needed |
| Pencil Graphite | `#314158` | `--color-pencil-graphite` | Tertiary headings and supporting labels, slightly softer than Inkwell for hierarchy breaks |
| Muted Slate | `#45556c` | `--color-muted-slate` | Secondary body text, list items, captions that need to remain readable but recede |
| Distant Mist | `#62748e` | `--color-distant-mist` | Muted helper text, secondary icons, tertiary link color — supporting information that should not compete with primary content |
| Frost Border | `#e2e8f0` | `--color-frost-border` | Hairline borders, card outlines, input borders, dividers, table separators — the structural neutral, used at extremely high frequency |
| Silver Whisper | `#c3c6cb` | `--color-silver-whisper` | Subtle placeholder text, disabled chrome, decorative dividers |
| Paper White | `#ffffff` | `--color-paper-white` | Page canvas, card surfaces, button fills, input fields — the dominant surface color |

## Tokens — Typography

### Inter — Single-family system: weight 800 at 60–72px for hero/display headlines (signature — no separate display face), weight 700 for H1–H2, weight 600 for subheadings and button labels, weight 500 for nav and labels, weight 400 for body. The use of a single neo-grotesque across all roles, leaning on extreme weight contrast (400 vs 800) rather than a second typeface, gives the system a calm, documentary feel. · `--font-inter`
- **Substitute:** DM Sans, IBM Plex Sans
- **Weights:** 400, 500, 600, 700, 800
- **Sizes:** 14px, 16px, 18px, 20px, 32px, 40px, 60px, 72px
- **Line height:** 1.00–1.71 depending on role
- **Letter spacing:** -0.025em across all sizes (tightened tracking from 14px upward)
- **OpenType features:** `"calt" on, "rlig" on (default contextual alternates and ligatures — no stylistic sets or tabular numerals enabled)`
- **Role:** Single-family system: weight 800 at 60–72px for hero/display headlines (signature — no separate display face), weight 700 for H1–H2, weight 600 for subheadings and button labels, weight 500 for nav and labels, weight 400 for body. The use of a single neo-grotesque across all roles, leaning on extreme weight contrast (400 vs 800) rather than a second typeface, gives the system a calm, documentary feel.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 14px | 1.5 | — | `--text-caption` |
| body-sm | 16px | 1.5 | — | `--text-body-sm` |
| body | 18px | 1.63 | — | `--text-body` |
| subheading | 20px | 1.4 | — | `--text-subheading` |
| heading-sm | 32px | 1.25 | — | `--text-heading-sm` |
| heading | 40px | 1.2 | — | `--text-heading` |
| heading-lg | 60px | 1.2 | -1.5px | `--text-heading-lg` |
| display | 72px | 1 | -1.8px | `--text-display` |

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
| 48 | 48px | `--spacing-48` |
| 64 | 64px | `--spacing-64` |
| 96 | 96px | `--spacing-96` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 12px |
| cards | 12px |
| badges | 12px |
| inputs | 12px |
| buttons | 12px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| md | `rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.1)...` | `--shadow-md` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 48-80px
- **Card padding:** 32px
- **Element gap:** 16px

## Components

### Top Navigation Bar
**Role:** Global header navigation

White background, 1px Frost Border (#e2e8f0) bottom. Left: brand mark (navy 'C' logomark + 'open collective' wordmark in Inkwell #0f172b, 16px weight 600). Center: nav links in Inkwell at 16px weight 500, with chevron-down icons on dropdowns. Right: 'Log In' as a ghost text button, 'Sign Up' as a filled navy (#0c2764) button, white text, 12px radius, 8px 16px padding, 16px weight 600.

### Filled Primary Button
**Role:** Primary action / CTA

Background #0c2764, text #ffffff, 12px radius, 10px vertical / 16px horizontal padding (compact), Inter 16px weight 600, letter-spacing -0.025em. No border. Hover darkens the navy slightly. Used for 'Sign Up' and equivalent high-intent actions.

### Ghost Text Button
**Role:** Secondary action or nav-level action

Transparent background, no border, text in Inkwell #0f172b at 16px weight 500. No fill change on rest; underline or weight bump on hover. Used for 'Log In' in the header and tertiary in-page actions.

### Outlined Action Button (Approve)
**Role:** Inline positive action inside a card

White background, 1px border in #e2e8f0, 12px radius, small padding (~6px 12px), Inter 14px weight 500, text in Inkwell. Includes a small green check icon (the only place green appears in the UI). Sits inside expense approval cards.

### Outlined Action Button (Reject)
**Role:** Inline negative action inside a card

Same structure as Approve — white fill, 1px #e2e8f0 border, 12px radius — but text in a muted red/error tone with a small cross icon. Visually paired with Approve as a binary choice group.

### Expense Approval Card
**Role:** Line-item display for pending/approved expenses in a feed

White surface, 1px Frost Border (#e2e8f0), 12px radius, 32px internal padding. Layout: left column has a 32px circular avatar, expense title in Inkwell 16px weight 600, category metadata line below in Muted Slate 14px weight 400, 'X days ago' timestamp in Distant Mist. Right column: amount in Inkwell 16px weight 600, currency subtitle below, and a status pill. When pending, the right side shows the Approve/Reject button group. A single subtle card shadow may sit behind it.

### Balance Summary Card
**Role:** Aggregated financial display

White surface, 1px Frost Border, 12px radius, 32px padding. Section labels in Muted Slate 14px weight 500 (uppercase or sentence case tracked tight). Values in Inkwell at 32px weight 700, with USD currency in a lighter weight beside. Multiple balance rows stacked with 16–24px vertical gaps. No charts or gradients — the typographic hierarchy alone communicates the data.

### Status Pill Badge
**Role:** State indicator for expenses and items

12px radius (pill-like but squared at this radius), small padding ~2px 8px, Inter 12px weight 600, uppercase, with tight letter-spacing. 'APPROVED' uses a very light green tint background with a darker green text. 'PENDING' uses a soft amber/yellow tint with amber text. Both are low-saturation washes — not loud, just enough to scan.

### Search Input
**Role:** Header-level search affordance

No visible border; shows a small search icon in Distant Mist followed by the word 'Search' in the same color, at 16px weight 500. Behaves as a quiet trigger rather than a visible input field — click expands it.

### Nav Dropdown Trigger
**Role:** Platform / Solutions / Resources category links

Text label in Inkwell 16px weight 500, followed by a small chevron-down icon in Distant Mist, both vertically centered. No border, no background. On hover or open, text weight may shift or an underline appears.

### Hero Headline
**Role:** First-screen headline

Inter 60–72px weight 800, color #0c2764 (navy), letter-spacing -0.025em, line-height 1.00–1.20, centered. Sits directly on the white page canvas with no background panel — the color and weight alone create the hero zone. Typically two lines, each line centered.

### Hero Subtext
**Role:** Supporting paragraph below the hero headline

Inter 18px weight 400, color #314158 (Pencil Graphite), line-height 1.63, max-width ~640px, centered. Quiet enough to read as supporting copy, dark enough to remain a primary reading target.

### Watercolor Illustration Insert
**Role:** Atmospheric graphic accent beside UI cards

Hand-drawn watercolor style illustration of a person or scene, soft pink and gray washes, organic edges, no defined container or frame. Sits behind or beside product UI cards in the hero, creating warmth against the otherwise typographic layout. Not a repeatable component — a signature scene used in hero compositions.

## Do's and Don'ts

### Do
- Use #0c2764 as the only saturated color on the page — for headlines, the brand mark, and the primary CTA fill
- Set headlines at 60–72px weight 800 with -0.025em letter-spacing; the oversized type is the primary visual anchor
- Separate cards with 1px #e2e8f0 borders and the standard card shadow; do not use multiple shadow layers
- Apply 12px radius consistently to buttons, cards, inputs, and badges — avoid mixing in 4px or 8px radii
- Use the full Inter weight range (400–800) for hierarchy rather than introducing a second typeface
- Pad cards with 32px and stack section content with 48–80px vertical gaps for breathing room
- Keep body text in #0f172b (Inkwell), not pure black; muted helper copy in #62748 (Distant Mist)

### Don't
- Do not introduce additional saturated colors — the navy must remain the sole chromatic anchor
- Do not use heavy elevation (no deep shadows, no glow effects) — separation comes from hairline borders
- Do not use a second display typeface; hierarchy is achieved through weight and size, not font pairing
- Do not place hero headlines on colored panels or gradient backgrounds — they sit directly on white
- Do not use 4px or 8px radii on buttons and cards — 12px is the system standard
- Do not use pure #000000 for text; use #0f172b to keep the documentary softness
- Do not crowd the page with UI chrome — the design relies on whitespace and typographic weight for structure

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Paper White | `#ffffff` | Page canvas — the default background everywhere; even cards often sit directly on white with only a border or shadow to separate |
| 1 | Cloud Mist | `#f1f5f9` | Subtle elevated surface for nested elements or alternate bands (inferred from contrast pair analysis and surface stack) |
| 2 | Card White | `#ffffff` | Content cards — same as canvas but visually separated by a 1px Frost Border (#e2e8f0) and/or the standard card shadow |
| 3 | Navy Surface | `#0c2764` | Branded surfaces — CTA buttons, brand-mark backgrounds, and any element requiring visual weight |

## Elevation

- **Content card / expense card:** `rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.1) 0px 4px 6px -4px`

## Imagery

The site pairs a typographically dominant layout with a single signature watercolor illustration in the hero — a hand-drawn figure (person with curly hair holding a loupe over a document) rendered in soft pink and gray washes with organic, unframed edges. The illustration is decorative atmosphere, not a product showcase, and breaks up the financial density of approval cards and balance displays. Outside the hero, the site is essentially text-only: no product screenshots, no stock photography, no abstract graphics. Icons are minimal and outlined, drawn at 1.5–2px stroke weight in Inkwell or Distant Mist, never filled or multicolored. The overall visual density is low — the page reads as a document more than an app screen, with illustration providing the only organic visual relief.

## Layout

The page is max-width contained (~1200px) on a white canvas, centered. The hero is a centered text stack: oversized navy headline (60–72px, two lines), then a centered subtext paragraph (~640px max-width), then a composition of UI cards (expense list on the left, balance summary on the right) overlapping with a watercolor illustration that bleeds outside the card edges. Navigation is a single sticky top bar with logo left, links center, auth actions right. Below the hero, the rhythm alternates between generous whitespace sections and card grids — typically 2-column or 3-column layouts with consistent 48–80px section gaps. Content is image-light and text-heavy, with whitespace doing the work of visual separation. No sidebar navigation, no mega-menus, no dark sections — the entire page lives on white.

## Agent Prompt Guide

**Quick Color Reference**
- Background: #ffffff (Paper White)
- Border: #e2e8f0 (Frost Border)
- Text: #0f172b (Inkwell)
- Muted text: #62748e (Distant Mist)
- Accent / brand: #0c2764 (Collective Navy)
- primary action: #0c2764 (filled action)

**Example Component Prompts**

1. **Hero section**: White background. Headline at 60px Inter weight 800, color #0c2764, letter-spacing -0.025em, line-height 1.20, centered, two lines. Subtext below at 18px Inter weight 400, color #314158, line-height 1.63, max-width 640px, centered. No background panel — the headline sits directly on white.

2. **Filled primary button**: Background #0c2764, text #ffffff, Inter 16px weight 600, letter-spacing -0.025em, 12px border-radius, padding 10px vertical / 16px horizontal, no border. Use for 'Sign Up' or equivalent high-intent actions.

3. **Ghost text button**: Transparent background, no border, text #0f172b at 16px weight 500. Use for 'Log In' or tertiary nav actions.

4. **Expense approval card**: White surface, 1px border #e2e8f0, 12px radius, 32px padding, subtle shadow (rgba(0,0,0,0.1) 0px 10px 15px -3px). Left: 32px circular avatar, title at 16px weight 600 in #0f172b, metadata at 14px weight 400 in #62748e. Right: amount at 16px weight 600 in #0f172b, status pill (12px radius, tinted background), and an Approve/Reject button group when pending.

5. **Balance summary card**: White surface, 1px border #e2e8f0, 12px radius, 32px padding. Section labels in #62748e at 14px weight 500. Values in #0f172b at 32px weight 700. Stack rows with 24px vertical gaps. No charts — typographic hierarchy only.

## Tonal Discipline

The system operates on a strict one-color budget: Collective Navy (#0c2764) is the only saturated hue, and it must earn its placement. Every other element lives in the neutral scale from Frost Border (#e2e8f0) through Distant Mist (#62748e) to Inkwell (#0f172b). Status badges introduce muted tints (soft green for approved, soft amber for pending) — these are the only departures from grayscale, and only at small badge scale. Any design that adds a new saturated color should be questioned: does the system need it, or is the navy doing the job?

## Similar Brands

- **Stripe** — Same max-width centered layout, oversized weight-700+ headlines on white, and a single saturated brand color doing all the chromatic work
- **Plaid** — Similar light-canvas financial interface with oversized serifless headlines, hairline borders, and minimal elevation
- **Mercury** — Shared approach of generous whitespace, white surfaces, 12px radii, and typographic hierarchy as the primary visual structure
- **Notion** — Same Inter typeface system, soft neutral palette, hairline divider-led separation, and illustration accents breaking up dense data
- **Gusto** — Same approachable financial-tool tone — light theme, single brand accent, hand-drawn warmth, no heavy shadows or panels

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-collective-navy: #0c2764;
  --color-inkwell: #0f172b;
  --color-slate-ink: #1d293d;
  --color-pencil-graphite: #314158;
  --color-muted-slate: #45556c;
  --color-distant-mist: #62748e;
  --color-frost-border: #e2e8f0;
  --color-silver-whisper: #c3c6cb;
  --color-paper-white: #ffffff;

  /* Typography — Font Families */
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.5;
  --text-body-sm: 16px;
  --leading-body-sm: 1.5;
  --text-body: 18px;
  --leading-body: 1.63;
  --text-subheading: 20px;
  --leading-subheading: 1.4;
  --text-heading-sm: 32px;
  --leading-heading-sm: 1.25;
  --text-heading: 40px;
  --leading-heading: 1.2;
  --text-heading-lg: 60px;
  --leading-heading-lg: 1.2;
  --tracking-heading-lg: -1.5px;
  --text-display: 72px;
  --leading-display: 1;
  --tracking-display: -1.8px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
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
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-96: 96px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 48-80px;
  --card-padding: 32px;
  --element-gap: 16px;

  /* Border Radius */
  --radius-xl: 12px;
  --radius-2xl: 16px;

  /* Named Radii */
  --radius-tags: 12px;
  --radius-cards: 12px;
  --radius-badges: 12px;
  --radius-inputs: 12px;
  --radius-buttons: 12px;

  /* Shadows */
  --shadow-md: rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.1) 0px 4px 6px -4px;

  /* Surfaces */
  --surface-paper-white: #ffffff;
  --surface-cloud-mist: #f1f5f9;
  --surface-card-white: #ffffff;
  --surface-navy-surface: #0c2764;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-collective-navy: #0c2764;
  --color-inkwell: #0f172b;
  --color-slate-ink: #1d293d;
  --color-pencil-graphite: #314158;
  --color-muted-slate: #45556c;
  --color-distant-mist: #62748e;
  --color-frost-border: #e2e8f0;
  --color-silver-whisper: #c3c6cb;
  --color-paper-white: #ffffff;

  /* Typography */
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.5;
  --text-body-sm: 16px;
  --leading-body-sm: 1.5;
  --text-body: 18px;
  --leading-body: 1.63;
  --text-subheading: 20px;
  --leading-subheading: 1.4;
  --text-heading-sm: 32px;
  --leading-heading-sm: 1.25;
  --text-heading: 40px;
  --leading-heading: 1.2;
  --text-heading-lg: 60px;
  --leading-heading-lg: 1.2;
  --tracking-heading-lg: -1.5px;
  --text-display: 72px;
  --leading-display: 1;
  --tracking-display: -1.8px;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-96: 96px;

  /* Border Radius */
  --radius-xl: 12px;
  --radius-2xl: 16px;

  /* Shadows */
  --shadow-md: rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.1) 0px 4px 6px -4px;
}
```
