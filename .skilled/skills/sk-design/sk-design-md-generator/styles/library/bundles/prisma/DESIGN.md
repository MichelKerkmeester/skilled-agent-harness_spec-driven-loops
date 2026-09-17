# Prisma — Style Reference
> engineer's blueprint on frosted glass

**Theme:** light

Prisma uses a disciplined developer-workbench language: pure white canvas, hairline borders, and one quiet teal accent that signals action without shouting. Typography carries the brand — Mona Sans displays at 64px with 0.1em tracking create an engineered, almost blueprint-like authority, while Inter's character variants (cv01–cv10) give body text a custom-cut feel inside an otherwise standard sans. Surfaces are nearly weightless: no decorative gradients, no drop-shadow stacks, just a single 1px border at #e2e8f0 separating regions. Components are compact and functional — code blocks sit next to CTA buttons, terminal panels replace marketing illustrations, and brand color appears only when something should be clicked. The result is a page that feels like documentation and product wrapped in one surface: quiet, precise, and trusting that code speaks louder than decoration.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Prism Teal | `#14b8a6` | `--color-prism-teal` | Teal supporting accent for decorative details and low-frequency emphasis. Do not promote it to the primary CTA color |
| Deep Teal | `linear-gradient(rgb(13, 148, 136) 0%, rgb(255, 255, 255) 100%)` | `--color-deep-teal` | Teal supporting accent for decorative details and low-frequency emphasis. Do not promote it to the primary CTA color; Top-to-bottom gradient from Deep Teal to white — used in the hero background as a subtle vertical wash |
| Carbon Ink | `#1d242f` | `--color-carbon-ink` | Primary headings, nav text, logo mark, heavy body emphasis — near-black with a cool blue undertone that pairs with the teal accent |
| Graphite | `#111827` | `--color-graphite` | Body text, button labels, dense content text — deeper than Carbon Ink, reserved for running copy and form values |
| Slate | `#6b7280` | `--color-slate` | Secondary body text, helper copy, muted descriptions, footer meta — pulls text back without losing legibility |
| Steel | `#718096` | `--color-steel` | Tertiary text, disabled labels, icon strokes on neutral backgrounds — one step further back than Slate |
| Fog | `#9ca3af` | `--color-fog` | Placeholder text, subtle icon fills, decorative dividers — present but recessive |
| Mist | `#e2e8f0` | `--color-mist` | Hairline borders, card edges, code-block frames, grid lines — the structural glue that separates surfaces without weight |
| Bone | `#f3f4f6` | `--color-bone` | Subtle surface lift, secondary card backgrounds, alternating section bands — barely visible, used to create quiet layering |
| Paper | `#ffffff` | `--color-paper` | Light supporting surface for subtle backgrounds and section separation. Do not promote it to the primary CTA color |

## Tokens — Typography

### Inter — Body, UI, navigation, and code-adjacent text — Inter with character variants enabled gives the system a custom-cut look inside a familiar sans. Weight 500–600 for nav and button labels, 400 for body, 375 sparingly for captions that need a lighter voice. · `--font-inter`
- **Substitute:** Inter (the system itself is the substitute; the cv features are the differentiator)
- **Weights:** 375, 400, 500, 600, 700
- **Sizes:** 11, 12, 14, 16, 18, 22px
- **Line height:** 1.10–1.50
- **Letter spacing:** 0.02–0.033em
- **OpenType features:** `"cv01", "cv02", "cv06", "cv07", "cv08", "cv10"`
- **Role:** Body, UI, navigation, and code-adjacent text — Inter with character variants enabled gives the system a custom-cut look inside a familiar sans. Weight 500–600 for nav and button labels, 400 for body, 375 sparingly for captions that need a lighter voice.

### Mona Sans VF — Display and heading typeface — GitHub's variable Mona Sans brings geometric authority with subtle humanist warmth; the 0.1em letter-spacing at 64px is the brand's signature: headline text reads as engineered precision, not marketing prose. Weight 900 reserved for hero display, 650 for section headings, 700 for sub-headings. · `--font-mona-sans-vf`
- **Substitute:** Satoshi (700–900) or General Sans Bold — both capture the geometric-modernist character
- **Weights:** 400, 650, 700, 900
- **Sizes:** 16, 18, 24, 30, 36, 40, 64px
- **Line height:** 1.13–1.56
- **Letter spacing:** 0.1em at display sizes (30–64px), 0 at body sizes
- **OpenType features:** `"ss01", "ss02", "ss05", "ss06"`
- **Role:** Display and heading typeface — GitHub's variable Mona Sans brings geometric authority with subtle humanist warmth; the 0.1em letter-spacing at 64px is the brand's signature: headline text reads as engineered precision, not marketing prose. Weight 900 reserved for hero display, 650 for section headings, 700 for sub-headings.

### Mona Sans Mono VF — Inline code, terminal snippets, CLI command pills — the monospaced sibling to Mona Sans keeps code blocks visually tied to the display type · `--font-mona-sans-mono-vf`
- **Substitute:** JetBrains Mono or IBM Plex Mono at weight 400
- **Weights:** 400
- **Sizes:** 16px
- **Line height:** 1.50
- **OpenType features:** `"ss01", "ss02", "ss05", "ss06"`
- **Role:** Inline code, terminal snippets, CLI command pills — the monospaced sibling to Mona Sans keeps code blocks visually tied to the display type

### Font Awesome 7 Pro — Font Awesome 7 Pro — detected in extracted data but not described by AI · `--font-font-awesome-7-pro`
- **Weights:** 300, 400
- **Sizes:** 14px, 16px, 18px, 20px
- **Line height:** 1
- **Role:** Font Awesome 7 Pro — detected in extracted data but not described by AI

### Font Awesome 7 Brands — Font Awesome 7 Brands — detected in extracted data but not described by AI · `--font-font-awesome-7-brands`
- **Weights:** 400
- **Sizes:** 22px
- **Line height:** 1
- **Role:** Font Awesome 7 Brands — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| micro | 11px | 1.45 | 0.33px | `--text-micro` |
| caption | 14px | 1.43 | 0.32px | `--text-caption` |
| body-sm | 16px | 1.5 | 0.48px | `--text-body-sm` |
| body | 18px | 1.39 | 0.36px | `--text-body` |
| body-lg | 22px | 1.33 | 0.44px | `--text-body-lg` |
| subheading | 24px | 1.33 | 0.72px | `--text-subheading` |
| heading-sm | 30px | 1.2 | 3px | `--text-heading-sm` |
| heading | 36px | 1.13 | 3.6px | `--text-heading` |
| heading-lg | 40px | 1.2 | 4px | `--text-heading-lg` |
| display | 64px | 1.13 | 6.4px | `--text-display` |

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
| 32 | 32px | `--spacing-32` |
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |
| 104 | 104px | `--spacing-104` |

### Border Radius

| Element | Value |
|---------|-------|
| nav | 6px |
| cards | 10px |
| icons | 6px |
| buttons | 6px |
| codeBlocks | 10px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| subtle | `rgba(0, 0, 0, 0.04) 0px 1px 2px 0px` | `--shadow-subtle` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 24px
- **Element gap:** 8px

## Components

### Primary CTA Button
**Role:** Single highest-priority action on a page — teal-filled, white text, used for 'Get started' and 'Create database'

Background #14b8a6, text #ffffff, font Inter 14–16px weight 500–600, border-radius 6px, padding 10px 16px, no border. Hover transitions to #0d9488. Letter-spacing 0.02–0.03em. No shadow.

### Ghost Code-Pill Button
**Role:** Secondary action that shows CLI usage — sits next to or replaces a CTA on developer-focused surfaces

Background #ffffff, border 1px solid #e2e8f0, text #111827 with Mona Sans Mono VF 16px weight 400 for the command portion. Border-radius 6px, padding 8px 12px. Includes a small copy icon at right.

### Navigation Bar
**Role:** Top-level site navigation — sticky, white, hairline-bordered bottom edge

Background #ffffff, border-bottom 1px solid #e2e8f0, subtle rgba(0,0,0,0.04) 0 1px 2px shadow. Height ~64px, horizontal padding 24px. Contains logo (left), nav links center, GitHub star count + Login link + teal CTA (right). Nav links in Inter 14px weight 500, color #1d242f, with dropdown chevrons in #718096.

### Feature Card
**Role:** Three-column feature highlight in the 'Your database, right in your workflow' section

Background #ffffff, border 1px solid #e2e8f0, border-radius 10px, padding 24px. Contains teal icon (16–20px), Inter 16–18px weight 600 title in #1d242f, Inter 14px weight 400 description in #6b7280. Optional inner panel with a terminal/code preview at the bottom using #f3f4f6 background.

### Terminal / Code Preview Panel
**Role:** Embedded UI screenshot or code terminal inside cards — replaces stock photography

Background #f3f4f6, border 1px solid #e2e8f0, border-radius 10px. Interior uses Inter 12–14px for UI labels in #6b7280 and Mona Sans Mono VF for code. Teal (#14b8a6) highlights for selected/active rows.

### Logo Grid Card
**Role:** Stack/integration partner showcase in the 'Postgres that fits your stack' section

Flat 4-column or 5-column grid of partner logos, each in a 48×48 to 64×64 area, centered. Logos are full-color (not monochrome), no background tiles, no borders. Grid sits on plain #ffffff.

### Testimonial Card
**Role:** Social proof block — multi-column masonry of developer quotes

No background fill, no border, no card chrome. Avatar (32–40px circle), name in Inter 14px weight 600 #1d242f, role/company in Inter 13px weight 400 #6b7280 with company name linked in #0d9488. Quote in Inter 16px weight 400 #1d242f, italicized emphasis in weight 600.

### Icon Tile (Stack Integration)
**Role:** Small iconography used in feature cards and nav

Teal-colored line icons at 16–20px, stroke width ~1.5px. Color #14b8a6 on light backgrounds. Sit left of card titles with 12px gap.

### Section Heading Block
**Role:** Section intro — centered or left-aligned, sets up a content band

Mona Sans VF 36–40px weight 700 #1d242f with 0.1em letter-spacing, optional subtext in Inter 16–18px weight 400 #6b7280. Vertical spacing: 48–80px above and below.

### Nav Dropdown Item
**Role:** Items inside the Products / Resources dropdown menus

Inter 14px weight 500 #1d242f, padding 8px 12px, border-radius 6px on hover with #f3f4f6 background. No border, no shadow on the dropdown panel itself — relies on the global nav shadow.

### CLI Command Snippet
**Role:** Inline code or copyable command — the 'npx prisma init' example

Font Mona Sans Mono VF 16px, text #111827 on #f3f4f6 background, border 1px solid #e2e8f0, border-radius 6px, padding 6px 12px. Dollar-sign prompt in #6b7280.

### GitHub Star Badge
**Role:** Social-proof pill in the nav showing repo stars

Background #ffffff, border 1px solid #e2e8f0, border-radius 6px, padding 6px 10px. GitHub icon (16px) in #1d242f, star count in Inter 13px weight 500 #1d242f.

## Do's and Don'ts

### Do
- Use #14b8a6 teal exclusively for primary actions, active states, and brand mark — never for decorative shapes, illustrations, or backgrounds larger than a button.
- Set Mona Sans VF at display sizes (30–64px) with 0.1em letter-spacing — this wide tracking is the brand's signature; removing it collapses the engineered feel into generic SaaS typography.
- Enable Inter's character variants (cv01, cv02, cv06, cv07, cv08, cv10) globally — this is the single line that turns stock Inter into a custom-feeling typeface.
- Separate surfaces with 1px borders at #e2e8f0 — never use background-color shifts alone to create layering; the hairline border is the system's primary depth signal.
- Show CLI commands and terminal panels alongside UI screenshots — the product page is also a documentation page; visual evidence of code is more persuasive than marketing art.
- Use border-radius 6px for buttons, nav items, and icons; reserve 10px for cards and code blocks. Never exceed 10px — the system is precise, not soft.
- Keep section gaps at 48–80px and let the 4px base unit govern all internal spacing — the rhythm should feel calibrated, not improvised.

### Don't
- Do not use teal for headings, body text, or paragraph copy — teal is an action color, not a brand wash. Headings stay in #1d242f or #111827.
- Do not introduce a second chromatic accent. The 5% colorfulness budget is allocated entirely to teal; adding blue, purple, or warm tones breaks the monochrome discipline.
- Do not use display-size type below weight 650 in Mona Sans — thin display headlines read as weak in this system. The 0.1em tracking needs weight to anchor it.
- Do not apply multi-layer drop shadows, colored glows, or gradient fills to cards or buttons. Depth is 1px border + 1px shadow, nothing more.
- Do not use stock photography, lifestyle imagery, or hero illustrations with people. The visual language is product UI and code — abstractions of the tool, not humans using it.
- Do not set border-radius above 16px or use fully rounded pill buttons — the system is angular and engineered, not friendly-soft. 6px and 10px are the design's edges.
- Do not use a dark theme variant for the page body. The entire interface is light; if a dark surface is needed for a code terminal, confine it to a bordered card, not the page.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Paper | `#ffffff` | Page canvas, default background for all sections |
| 1 | Bone | `#f3f4f6` | Subtle band differentiation, input backgrounds, ghost-button fills |
| 2 | Mist | `#e2e8f0` | Hairline borders and card edges — not a fill, but a surface-level signal |

## Elevation

- **Navigation bar:** `rgba(0, 0, 0, 0.04) 0px 1px 2px 0px`
- **Cards and panels:** `rgba(0, 0, 0, 0.04) 0px 1px 2px 0px`

## Imagery

The visual language is almost entirely product UI and code — terminal panels, database schema tables, IDE-style editors, and stack-integration logos replace stock photography. Code is treated as imagery: monospaced CLI commands sit inside bordered pills, SQL queries appear in panel mockups, and terminal cursors blink in feature card previews. Partner logos (Docker, Next.js, Vercel, etc.) appear in full color within a borderless grid. The only photographic element is minimal headshot avatars inside testimonial cards, presented as small circles without frames. No hero photography, no lifestyle imagery, no abstract gradient art — the page looks like it was designed by engineers for engineers.

## Layout

Layout is a centered, max-width 1200px container with generous vertical breathing room. The hero is a centered stack: Mona Sans display headline, one-line subtext, then a two-element row (teal CTA + ghost code-pill). Below the hero, a 3-column card grid introduces core features, each card containing a teal icon, title, description, and an inner terminal preview. Subsequent sections alternate between 2-column text-and-visual layouts (heading left, icon grid or code panel right) and full-width centered heading bands. The 'Postgres that fits your stack' section uses a 4–5 column logo grid floating on white. A testimonial band uses a 3-column masonry of unbordered quote blocks. The nav is a single sticky top bar with dropdown menus. Section gaps are 80px; internal card padding is 24px. The page never goes full-bleed dark; even the subtle teal-to-white hero gradient stays within the 1200px container.

## Agent Prompt Guide

## Quick Color Reference
- text primary: #1d242f (Carbon Ink)
- text body: #111827 (Graphite)
- text muted: #6b7280 (Slate)
- background: #ffffff (Paper)
- border / hairline: #e2e8f0 (Mist)
- accent: #14b8a6 (Prism Teal)
- primary action: no distinct CTA color

## Example Component Prompts

1. **Hero Section** — White #ffffff background. Centered Mona Sans VF headline at 64px, weight 900, color #1d242f, letter-spacing 6.4px. Subtext in Inter 18px, weight 400, color #6b7280, line-height 1.5. Below: a #14b8a6 filled button (6px radius, 10px 16px padding, Inter 16px weight 600 white text reading 'Create database') next to a ghost code-pill (1px #e2e8f0 border, 6px radius, Mona Sans Mono VF 16px #111827 text, copy icon at right). Section padding 80px top and bottom.

2. **Feature Card** — White background, 1px #e2e8f0 border, 10px radius, 24px padding. Teal icon (#14b8a6, 20px, stroke 1.5px) at top-left. Title in Inter 18px weight 600 #1d242f. Description in Inter 14px weight 400 #6b7280. Optional inner panel: #f3f4f6 background with a 2–3 line code preview in Mona Sans Mono VF 14px #111827, preceded by a muted #6b7280 prompt symbol.

3. **Navigation Bar** — Full-width white #ffffff, 1px bottom border #e2e8f0, ultra-soft shadow rgba(0,0,0,0.04) 0 1px 2px. Height 64px, horizontal padding 24px. Left: Prisma mark in #1d242f. Center: nav links (Inter 14px weight 500 #1d242f) with 6px-radius dropdown panels. Right: GitHub star pill (1px #e2e8f0 border, 6px radius), Login link (Inter 14px #1d242f), and a #14b8a6 'Get started' button (6px radius, Inter 14px weight 600 #ffffff).

4. **Stack Logo Grid Section** — White background. Left half: Mona Sans VF 40px weight 700 #1d242f with 4px letter-spacing heading + Inter 18px #6b7280 subtext. Right half: 4-column grid of full-color partner logos, each 48–56px square, 32px gap between rows and columns. No borders, no background tiles.

5. **Testimonial Block** — White background, no card chrome. 3-column layout, 32px column gap. Each block: 36px circular avatar, Inter 14px weight 600 #1d242f name, Inter 13px weight 400 #6b7280 role with company in #0d9488, then a 16px Inter weight 400 #1d242f quote with weight 600 italic emphasis on key phrases.

## Similar Brands

- **PlanetScale** — Same developer-database positioning with a teal/green accent on a white hairline-bordered canvas, and code-pill buttons next to CTAs
- **Supabase** — Monochrome light UI with a single emerald accent, code-first feature illustrations, and similar Inter/Mona-Sans-style display typography
- **Vercel** — Restrained monochrome palette, hairline-border surface treatment, 6px button radii, and a preference for product UI screenshots over photography
- **Linear** — Engineered precision aesthetic — tight 6px radii, hairline borders, Inter at body with a custom display face, and zero decorative gradients
- **Railway** — Developer-tool landing pages that lead with CLI commands and terminal panels, using a single chromatic accent against a near-white surface

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-prism-teal: #14b8a6;
  --color-deep-teal: #0d9488;
  --gradient-deep-teal: linear-gradient(rgb(13, 148, 136) 0%, rgb(255, 255, 255) 100%);
  --color-carbon-ink: #1d242f;
  --color-graphite: #111827;
  --color-slate: #6b7280;
  --color-steel: #718096;
  --color-fog: #9ca3af;
  --color-mist: #e2e8f0;
  --color-bone: #f3f4f6;
  --color-paper: #ffffff;

  /* Typography — Font Families */
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-mona-sans-vf: 'Mona Sans VF', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-mona-sans-mono-vf: 'Mona Sans Mono VF', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-font-awesome-7-pro: 'Font Awesome 7 Pro', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-font-awesome-7-brands: 'Font Awesome 7 Brands', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-micro: 11px;
  --leading-micro: 1.45;
  --tracking-micro: 0.33px;
  --text-caption: 14px;
  --leading-caption: 1.43;
  --tracking-caption: 0.32px;
  --text-body-sm: 16px;
  --leading-body-sm: 1.5;
  --tracking-body-sm: 0.48px;
  --text-body: 18px;
  --leading-body: 1.39;
  --tracking-body: 0.36px;
  --text-body-lg: 22px;
  --leading-body-lg: 1.33;
  --tracking-body-lg: 0.44px;
  --text-subheading: 24px;
  --leading-subheading: 1.33;
  --tracking-subheading: 0.72px;
  --text-heading-sm: 30px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: 3px;
  --text-heading: 36px;
  --leading-heading: 1.13;
  --tracking-heading: 3.6px;
  --text-heading-lg: 40px;
  --leading-heading-lg: 1.2;
  --tracking-heading-lg: 4px;
  --text-display: 64px;
  --leading-display: 1.13;
  --tracking-display: 6.4px;

  /* Typography — Weights */
  --font-weight-light: 300;
  --font-weight-w375: 375;
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-w650: 650;
  --font-weight-bold: 700;
  --font-weight-black: 900;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-104: 104px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 24px;
  --element-gap: 8px;

  /* Border Radius */
  --radius-md: 6px;
  --radius-lg: 10px;
  --radius-2xl: 16px;

  /* Named Radii */
  --radius-nav: 6px;
  --radius-cards: 10px;
  --radius-icons: 6px;
  --radius-buttons: 6px;
  --radius-codeblocks: 10px;

  /* Shadows */
  --shadow-subtle: rgba(0, 0, 0, 0.04) 0px 1px 2px 0px;

  /* Surfaces */
  --surface-paper: #ffffff;
  --surface-bone: #f3f4f6;
  --surface-mist: #e2e8f0;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-prism-teal: #14b8a6;
  --color-deep-teal: #0d9488;
  --color-carbon-ink: #1d242f;
  --color-graphite: #111827;
  --color-slate: #6b7280;
  --color-steel: #718096;
  --color-fog: #9ca3af;
  --color-mist: #e2e8f0;
  --color-bone: #f3f4f6;
  --color-paper: #ffffff;

  /* Typography */
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-mona-sans-vf: 'Mona Sans VF', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-mona-sans-mono-vf: 'Mona Sans Mono VF', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-font-awesome-7-pro: 'Font Awesome 7 Pro', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-font-awesome-7-brands: 'Font Awesome 7 Brands', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-micro: 11px;
  --leading-micro: 1.45;
  --tracking-micro: 0.33px;
  --text-caption: 14px;
  --leading-caption: 1.43;
  --tracking-caption: 0.32px;
  --text-body-sm: 16px;
  --leading-body-sm: 1.5;
  --tracking-body-sm: 0.48px;
  --text-body: 18px;
  --leading-body: 1.39;
  --tracking-body: 0.36px;
  --text-body-lg: 22px;
  --leading-body-lg: 1.33;
  --tracking-body-lg: 0.44px;
  --text-subheading: 24px;
  --leading-subheading: 1.33;
  --tracking-subheading: 0.72px;
  --text-heading-sm: 30px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: 3px;
  --text-heading: 36px;
  --leading-heading: 1.13;
  --tracking-heading: 3.6px;
  --text-heading-lg: 40px;
  --leading-heading-lg: 1.2;
  --tracking-heading-lg: 4px;
  --text-display: 64px;
  --leading-display: 1.13;
  --tracking-display: 6.4px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-104: 104px;

  /* Border Radius */
  --radius-md: 6px;
  --radius-lg: 10px;
  --radius-2xl: 16px;

  /* Shadows */
  --shadow-subtle: rgba(0, 0, 0, 0.04) 0px 1px 2px 0px;
}
```
