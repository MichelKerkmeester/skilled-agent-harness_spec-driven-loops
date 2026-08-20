# Legora — Style Reference
> Editorial law journal on warm cream

**Theme:** light

Legora reads like an editorial legal journal printed on warm cream paper: a near-monochrome canvas of ivory and ink, whisper-weight serif headlines at 88px, and a body set in a humanist grotesk that feels more like column text than UI copy. The brand signals authority through restraint — no chromatic accents, no decorative gradients, no colored CTAs — instead relying on a single solid-black button as the only piece of high-contrast furniture on otherwise quiet pages. Surfaces are separated by the thinnest possible rules and faint tinted washes (a barely-there sage, a barely-there slate-blue) rather than shadows or elevation. Photography arrives as one cinematic, full-bleed still per page; everything else is typographic and product-screenshot driven, with product surfaces rendered in muted pastel blocks that act as visual breathing room between dense legal copy.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Parchment | `#fefefc` | `--color-parchment` | Page canvas, card surfaces, light-section backgrounds — a warm ivory that reads as paper, not screen |
| Ink | `#000000` | `--color-ink` | Dark borders and separators for elevated surfaces and inverted UI. Do not promote it to the primary CTA color |
| Graphite | `#0a0a0a` | `--color-graphite` | Body text, heading strokes, dark surface accents — near-black used wherever ink is too harsh |
| Smoke | `#6b6b6b` | `--color-smoke` | Secondary body copy, subdued borders, caption-level metadata |
| Iron | `#444444` | `--color-iron` | Tertiary text and dividers between smoke and graphite |
| Verdigris Wash | `#ebf5ed` | `--color-verdigris-wash` | Light neutral action fill for buttons on dark surfaces. |
| Slate Mist | `#bdd4f0` | `--color-slate-mist` | Soft card surface tint for product preview panels and link highlights — a desaturated cool blue that lives in the background, never the foreground |
| Pewter Haze | `#98a7aa` | `--color-pewter-haze` | Muted placeholder tint on empty illustration frames and disabled control fills |

## Tokens — Typography

### sans-serif — sans-serif — detected in extracted data but not described by AI · `--font-sans-serif`
- **Weights:** 400
- **Sizes:** 12px
- **Line height:** 1.2
- **Role:** sans-serif — detected in extracted data but not described by AI

### Rhymes Display — Display headlines and hero serif. The whisper-weight 300 cut at 88px is the signature move — most legal-tech sites shout in bold sans, Legora murmurs in light serif. The tight -0.02em tracking pulls letters together so the display reads as one continuous voice, not as individual glyphs. · `--font-rhymes-display`
- **Substitute:** Playfair Display (weight 400, 80px appears as a fallback in the data) or Cormorant Garamond Light
- **Weights:** 300
- **Sizes:** 24px, 32px, 88px
- **Line height:** 0.95-1.10
- **Letter spacing:** -0.02em at 88px, -0.01em at 32px and 24px
- **OpenType features:** `"blwf", "cv03", "cv04", "cv09", "cv11" on`
- **Role:** Display headlines and hero serif. The whisper-weight 300 cut at 88px is the signature move — most legal-tech sites shout in bold sans, Legora murmurs in light serif. The tight -0.02em tracking pulls letters together so the display reads as one continuous voice, not as individual glyphs.

### Suisse Int'l — Primary body and UI text. The 450-book weight at 16px with -0.01em tracking is the workhorse — a humanist sans tuned for long-form legal copy. The 500-medium cut at 13px is reserved for input values and small emphasis labels. The negative leading (0.80) on small sizes tightens tight UI like eyebrow labels and tags. · `--font-suisse-intl`
- **Substitute:** Inter (weight 400-500) or Söhne
- **Weights:** 450, 500
- **Sizes:** 
- **Line height:** 0.80-1.30
- **Letter spacing:** -0.01em at 14-16px, +0.01em at 11px
- **OpenType features:** `"blwf", "cv03", "cv04", "cv09", "cv11" on`
- **Role:** Primary body and UI text. The 450-book weight at 16px with -0.01em tracking is the workhorse — a humanist sans tuned for long-form legal copy. The 500-medium cut at 13px is reserved for input values and small emphasis labels. The negative leading (0.80) on small sizes tightens tight UI like eyebrow labels and tags.

### Aktiv Grotesk VF — Section subheads and longer body paragraphs where a slightly more neutral grotesk reads cleaner than Suisse Int'l's warmth · `--font-aktiv-grotesk-vf`
- **Substitute:** Inter or Söhne
- **Weights:** 400
- **Sizes:** 15px, 20px
- **Line height:** 1.30
- **OpenType features:** `"blwf", "cv03", "cv04", "cv09", "cv11" on`
- **Role:** Section subheads and longer body paragraphs where a slightly more neutral grotesk reads cleaner than Suisse Int'l's warmth

### Suisse Intl Book — Suisse Intl Book — detected in extracted data but not described by AI · `--font-suisse-intl-book`
- **Weights:** 450
- **Sizes:** 11px, 13px, 14px, 16px
- **Line height:** 0.8, 1.25, 1.3
- **Letter spacing:** -0.01, 0.01
- **OpenType features:** `"blwf", "cv03", "cv04", "cv09", "cv11"`
- **Role:** Suisse Intl Book — detected in extracted data but not described by AI

### Playfair Display — Playfair Display — detected in extracted data but not described by AI · `--font-playfair-display`
- **Weights:** 400
- **Sizes:** 80px
- **Line height:** 1
- **Letter spacing:** -0.02
- **Role:** Playfair Display — detected in extracted data but not described by AI

### Inter — Inter — detected in extracted data but not described by AI · `--font-inter`
- **Weights:** 400
- **Sizes:** 12px
- **Line height:** 1.2
- **Role:** Inter — detected in extracted data but not described by AI

### Suisse Intl Medium — Suisse Intl Medium — detected in extracted data but not described by AI · `--font-suisse-intl-medium`
- **Weights:** 500
- **Sizes:** 13px
- **Line height:** 1
- **Role:** Suisse Intl Medium — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 11px | 0.8 | 0.1px | `--text-caption` |
| heading-sm | 20px | 1.3 | — | `--text-heading-sm` |
| heading | 32px | 1.1 | -0.32px | `--text-heading` |
| display | 88px | 0.95 | -1.76px | `--text-display` |

## Tokens — Spacing & Shapes

**Density:** compact

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 6 | 6px | `--spacing-6` |
| 8 | 8px | `--spacing-8` |
| 10 | 10px | `--spacing-10` |
| 12 | 12px | `--spacing-12` |
| 16 | 16px | `--spacing-16` |
| 20 | 20px | `--spacing-20` |
| 24 | 24px | `--spacing-24` |
| 32 | 32px | `--spacing-32` |
| 36 | 36px | `--spacing-36` |
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |
| 56 | 56px | `--spacing-56` |
| 64 | 64px | `--spacing-64` |
| 80 | 80px | `--spacing-80` |
| 160 | 160px | `--spacing-160` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 2px |
| cards | 8px |
| inputs | 8px |
| buttons | 2px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 24px
- **Element gap:** 10px

## Components

### Solid Black Button
**Role:** Primary call to action

Filled #000000 background, #fefefc text, 2px corner radius, 10px vertical / 24px horizontal padding, Suisse Int'l 450 at 14px, -0.14px tracking. Used sparingly — one per viewport maximum. Hover: lifts to a faint outline or inverts to white-on-black border.

### Ghost Outline Button
**Role:** Secondary action

Transparent background, 1px #0a0a0a border, #0a0a0a text, 2px radius, 10/24 padding, same type as the solid variant. Pairs directly with the solid button when two actions are needed (e.g. 'Learn more' beside 'Book a demo').

### Editorial Headline Block
**Role:** Hero and section display copy

Rhymes Display 300 at 88px, line-height 0.95, -1.76px tracking, set in #0a0a0a on parchment. The hairline weight plus tight tracking produces a near-continuous voice — design rule is to never break a display headline across more than two lines.

### Cinematic Hero Panel
**Role:** Full-bleed opening section

Edge-to-edge dark photographic image with a centered display headline overlay in #fefefc at 88px. No gradient veil — the dark photo itself provides contrast for the white serif. Headline sits in the lower third.

### Partner Logo Bar
**Role:** Social proof strip

Single horizontal row of monochrome wordmark logos on parchment, no separators, no card chrome. Logos rendered in #0a0a0a at uniform 60-70% opacity for quiet hierarchy.

### Feature Card (Pastel Surface)
**Role:** Product capability highlight

Full-bleed tinted card using one of the accent washes (#ebf5ed, #bdd4f0, or #cbcbca) as the card surface, no border, no shadow, no internal padding — the product UI screenshot inside is allowed to bleed to the card edge. Heading sits below the card in 24-32px serif.

### Two-Column Text+Image Feature
**Role:** Body content section

Asymmetric split: ~55% image / ~45% text, max-width 1200px, gap 48-64px. Image side is either a pastel-tinted product card or a dark photographic still. Text side opens with a 13px uppercase eyebrow label in #6b6b6b, then 32px serif heading, then 16px body.

### Cookie Banner
**Role:** Persistent consent card

Fixed bottom-right card, 8px radius, white (#fefefc) fill with 1px #0a0a0a hairline border. Body copy at 13px Suisse Int'l 450, single 'Okay' action as a solid black button at 2px radius. Padding 16px internal.

### Top Navigation Bar
**Role:** Global header

Sits over the dark hero as black-filled with white wordmark and white nav links, then transitions to parchment with dark text on scroll. Center cluster of five primary nav items, right-aligned 'Book a demo' as a solid black pill.

### Input Field
**Role:** Form input

1px #0a0a0a border, 8px radius, 12px vertical / 14px horizontal padding, placeholder in #98a7aa Pewter Haze, value text in Suisse Int'l Medium 500 at 13px. Focus state swaps border to #ebf5ed Verdigris Wash for a calm, in-brand halo.

### Eyebrow Label
**Role:** Section identifier

Uppercase or small-caps tracking +0.01em at 11-13px in #6b6b6b Smoke, set tight against the heading it introduces with 8-10px gap. Mirrors the editorial 'kicker' convention from print magazines.

## Do's and Don'ts

### Do
- Use the Rhymes Display 300 cut at 88px for any page-opening or section-opening headline — the whisper weight is the brand's signature and must not be replaced with a bold sans.
- Set body copy in Suisse Int'l 450 at 14-16px with -0.01em tracking; do not substitute a neutral system font at body sizes.
- Use the solid black button (#000000 fill, #fefefc text) as the only primary action per viewport; pair it with the ghost outline variant when a second action is necessary.
- Keep the canvas at #fefefc Parchment and let the page breathe with 80px section gaps — do not introduce white #ffffff, it will read as clinical.
- Use the accent washes (#ebf5ed, #bdd4f0) as full-bleed card surfaces, not as small chips or buttons.
- Render partner and client logos as monochrome #0a0a0a at 60-70% opacity; never display them in their native brand colors.
- Reserve the full-bleed dark cinematic photo treatment for hero sections only — body content must live on parchment.

### Don't
- Do not introduce chromatic brand colors (saturated red, blue, green) — the system is deliberately near-monochrome and a single vivid color will break the editorial register.
- Do not use bold or semibold weights for display headlines; the 300 whisper weight at 88px is non-negotiable.
- Do not apply drop shadows or elevated cards; separation is achieved through hairline borders and tinted surface washes, not depth.
- Do not use a 0px or fully rounded button radius — the 2px micro-radius is a signature choice that keeps controls reading as editorial, not app-like.
- Do not use #ffffff pure white for any surface; the canvas must stay at #fefefc Parchment to preserve the warm paper feel.
- Do not stack more than one full-bleed photographic section on a single page; one cinematic moment per scroll is the rule.
- Do not use Playfair Display for anything other than a fallback — Rhymes Display is the primary display face and its 300 cut is what creates the signature voice.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Parchment Canvas | `#fefefc` | Full-page background; the default wherever no container intervenes |
| 1 | Sage Highlight | `#ebf5ed` | Faint highlight wash for selected or active card states |
| 2 | Slate Mist Panel | `#bdd4f0` | Cool product-preview panel, hero card on lighter sections |

## Elevation

Legora has no shadow-based elevation. Depth is communicated exclusively through three mechanisms: (1) a dark cinematic photograph breaking the parchment plane, (2) full-bleed pastel washes that color a section without raising it, and (3) 1px hairline rules in #0a0a0a that separate rather than elevate. Any attempt to add a drop shadow will instantly push the design out of its editorial register and into generic SaaS territory.

## Imagery

Imagery is used as punctuation, not as illustration. The hero is one full-bleed dark cinematic still — a single frame of a person in a quiet interior, treated without gradient overlays or vignettes. Product surfaces elsewhere are not photographs but pastel-tinted UI mockups rendered in #bdd4f0 slate-blue and #ebf5ed sage blocks, with the actual application chrome (document lists, search overlays) sitting flat on top. No lifestyle photography, no stock imagery, no decorative illustration. Icons (visible in the nav and product UI) are thin-stroke line glyphs in #0a0a0a, roughly 1.5px stroke weight, monochrome.

## Layout

The page is a single centered column at max-width 1200px, but the hero breaks containment by going full-bleed edge-to-edge. The hero is a dark photographic background with a centered display headline in the lower third and a two-button stack beneath — this is the only asymmetric moment on the page. Below the hero the rhythm becomes strictly typographic: a partner logo bar (single row, no chrome), then a centered editorial intro paragraph set narrow (around 60% of the column width), then a three-column feature grid where each card is a tall pastel-tinted block with a product UI screenshot that bleeds to the card edge, followed by a wider two-column text+image section, and ending with a full-bleed closing statement at 88px serif. Vertical spacing is consistent at 80px between sections. Navigation is a fixed top bar that overlays the dark hero as black-on-white and transitions to white-on-black text on scroll. Density is compact but never cramped — the type does the heavy lifting and whitespace is generous between blocks.

## Agent Prompt Guide

**Quick Color Reference**
- text: #0a0a0a
- background: #fefefc (Parchment)
- border: #0a0a0a hairline
- muted text: #6b6b6b
- accent surface: #ebf5ed (Verdigris Wash)
- primary action: no distinct CTA color

**Example Component Prompts**
1. *Editorial hero*: Full-bleed dark photographic background. Centered display headline in Rhymes Display weight 300, 88px, #fefefc, letter-spacing -1.76px, line-height 0.95. Below the headline a subhead at 16px Suisse Int'l 450 in #fefefc, then a two-button stack: solid black button (#000000 fill, #fefefc text, 2px radius, 10/24 padding) and ghost outline button (1px #fefefc border, #fefefc text, 2px radius).
2. *Feature card grid*: Three columns, max-width 1200px, 24px gap. Each card is a full-bleed pastel wash (#ebf5ed, #bdd4f0, or #cbcbca) with no border, no shadow, and a product UI mockup bleeding to the card edges. Below each card, a 24px serif heading in #0a0a0a and 14px body in Smoke #6b6b6b.
3. *Two-column feature section*: Asymmetric 55/45 split, 64px gap. Image side: pastel-tinted product card (8px radius). Text side: 13px uppercase eyebrow in #6b6b6b, then 32px serif heading in #0a0a0a, then 16px body in #6b6b6b.
4. *Cookie consent card*: Fixed bottom-right, 8px radius, #fefefc fill, 1px #0a0a0a border, 16px internal padding. 13px body copy in #6b6b6b and a solid black 'Okay' button (#000000 fill, #fefefc text, 2px radius).
5. *Input field*: 1px #0a0a0a border, 8px radius, 12/14 padding, placeholder in #98a7aa Pewter Haze, value text in Suisse Int'l Medium 500 at 13px. Focus state swaps border to #ebf5ed.

## Editorial Voice

Every typographic choice reinforces the idea that this is a legal publication, not a software product. The 300-weight display serif at 88px with -1.76px tracking behaves like newspaper masthead type — the letters are pulled so close together that the word reads as a single gesture. The body set in Suisse Int'l 450 at 14-16px is closer to print column text than app UI. The 13px uppercase eyebrows in Smoke #6b6b6b mirror the kicker convention from editorial design. When a designer is tempted to 'modernize' the type — bumping the display to bold, opening up the tracking, switching to a neutral grotesk — they will inadvertently flatten the system into a generic B2B SaaS look. The restraint is the brand.

## Similar Brands

- **Linear** — Both use a near-monochrome canvas and let a single accent (Linear's purple, Legora's black) carry all primary action weight, with hairline borders and pastel-tinted feature panels
- **Harvey (legal AI)** — Same legal-tech context with editorial serif headlines and a restrained, magazine-like layout that signals premium expertise over product feature density
- **Notion** — Shared compact information density, monochrome neutrals, and the discipline of using 2px micro-radii on controls to keep the tone editorial rather than app-like
- **Stripe Press** — Same whisper-weight serif at large display sizes and a warm cream canvas with near-black ink — both treat their websites as editorial objects rather than product dashboards

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-parchment: #fefefc;
  --color-ink: #000000;
  --color-graphite: #0a0a0a;
  --color-smoke: #6b6b6b;
  --color-iron: #444444;
  --color-verdigris-wash: #ebf5ed;
  --color-slate-mist: #bdd4f0;
  --color-pewter-haze: #98a7aa;

  /* Typography — Font Families */
  --font-sans-serif: 'sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-rhymes-display: 'Rhymes Display', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-suisse-intl: 'Suisse Int'l', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-aktiv-grotesk-vf: 'Aktiv Grotesk VF', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-suisse-intl-book: 'Suisse Intl Book', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-playfair-display: 'Playfair Display', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-suisse-intl-medium: 'Suisse Intl Medium', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 11px;
  --leading-caption: 0.8;
  --tracking-caption: 0.1px;
  --text-heading-sm: 20px;
  --leading-heading-sm: 1.3;
  --text-heading: 32px;
  --leading-heading: 1.1;
  --tracking-heading: -0.32px;
  --text-display: 88px;
  --leading-display: 0.95;
  --tracking-display: -1.76px;

  /* Typography — Weights */
  --font-weight-light: 300;
  --font-weight-regular: 400;
  --font-weight-w450: 450;
  --font-weight-medium: 500;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-6: 6px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-36: 36px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-56: 56px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-160: 160px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 24px;
  --element-gap: 10px;

  /* Border Radius */
  --radius-sm: 2px;
  --radius-lg: 8px;
  --radius-xl: 14px;
  --radius-3xl: 40px;

  /* Named Radii */
  --radius-tags: 2px;
  --radius-cards: 8px;
  --radius-inputs: 8px;
  --radius-buttons: 2px;

  /* Surfaces */
  --surface-parchment-canvas: #fefefc;
  --surface-sage-highlight: #ebf5ed;
  --surface-slate-mist-panel: #bdd4f0;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-parchment: #fefefc;
  --color-ink: #000000;
  --color-graphite: #0a0a0a;
  --color-smoke: #6b6b6b;
  --color-iron: #444444;
  --color-verdigris-wash: #ebf5ed;
  --color-slate-mist: #bdd4f0;
  --color-pewter-haze: #98a7aa;

  /* Typography */
  --font-sans-serif: 'sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-rhymes-display: 'Rhymes Display', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-suisse-intl: 'Suisse Int'l', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-aktiv-grotesk-vf: 'Aktiv Grotesk VF', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-suisse-intl-book: 'Suisse Intl Book', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-playfair-display: 'Playfair Display', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-suisse-intl-medium: 'Suisse Intl Medium', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 11px;
  --leading-caption: 0.8;
  --tracking-caption: 0.1px;
  --text-heading-sm: 20px;
  --leading-heading-sm: 1.3;
  --text-heading: 32px;
  --leading-heading: 1.1;
  --tracking-heading: -0.32px;
  --text-display: 88px;
  --leading-display: 0.95;
  --tracking-display: -1.76px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-6: 6px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-36: 36px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-56: 56px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-160: 160px;

  /* Border Radius */
  --radius-sm: 2px;
  --radius-lg: 8px;
  --radius-xl: 14px;
  --radius-3xl: 40px;
}
```
