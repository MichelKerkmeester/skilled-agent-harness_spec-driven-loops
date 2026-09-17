# xAI — Style Reference
> warm cream laboratory with a black pill

**Theme:** light

xAI runs a restrained near-monochrome editorial system on a warm-white canvas. Type leads the visual hierarchy: oversized display headlines at near-100% line-height with tight negative tracking sit above generous breathing room, while GeistMono punctuates the interface with terminal/code fragments. The single defining interaction is a pill-shaped, pure-black filled button — everything else is ghost, outlined, or surface-toned. Cards are flat, borderless, and warm-cream (#f9f8f6); depth comes from a single hairline ring rather than shadow stacks. Color is rationed: a warm off-white page, cream cards, near-black ink, and the occasional vivid accent (Beta pill, traffic-light terminal dots, gradient orbs) that earns attention precisely because the rest of the page refuses it.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Jet Ink | `#0a0a0a` | `--color-jet-ink` | Primary text, filled CTA buttons, logo mark — near-black anchors the hierarchy without the harshness of pure black |
| Charcoal | `#151515` | `--color-charcoal` | Dark code-block surface behind terminal demos (used where black feels too stark against warm white) |
| Fog | `#858585` | `--color-fog` | Secondary text, icon strokes, inactive nav items — the most-used gray; carries the bulk of body and link copy |
| Pewter | `#9d9d9d` | `--color-pewter` | Tertiary text, meta labels, decorative fills — softer than Fog for de-emphasized utility copy |
| Steel | `#545454` | `--color-steel` | Mid-weight body text where Fog reads too washed out (inline stats, spec lines) |
| Dove | `#d5d9e2` | `--color-dove` | Hairline borders, input rings, button focus outlines — the only border color in the system |
| Cream | `#f9f8f6` | `--color-cream` | Card surfaces, secondary panels, tag backgrounds — warm off-white distinguishes layered surfaces from the pure-white page |
| Paper | `#ffffff` | `--color-paper` | Page background, button text on filled CTAs, icon foreground on dark surfaces |
| Sand | `#f2ede5` | `--color-sand` | Warm wash backgrounds, subtle highlight zones, section tints |
| Slate | `#3b3b3b` | `--color-slate` | Muted heading variant for secondary headlines and section labels |
| Ember | `#ff5f57` | `--color-ember` | Terminal traffic-light dot (red) — decorative accent inside code-block mocks only |
| Sunbeam | `#ffbd2e` | `--color-sunbeam` | Terminal traffic-light dot (yellow), and the Beta pill background — the single warm accent that signals novelty |
| Sprout | `#28c840` | `--color-sprout` | Terminal traffic-light dot (green) — decorative accent inside code-block mocks only |

## Tokens — Typography

### universalSans — Primary UI typeface — used for nav, body, buttons, cards, labels, and inline links. The dual-weight scale (400 for copy, 500 for emphasis) is the sole hierarchy tool for running text. The negative tracking at small sizes tightens headlines without compressing readability. · `--font-universalsans`
- **Substitute:** Inter, system-ui
- **Weights:** 400, 500
- **Sizes:** 10, 11, 12, 13, 14, 16, 18
- **Line height:** 1.00–1.63
- **Letter spacing:** -0.025em at display, 0 at body
- **Role:** Primary UI typeface — used for nav, body, buttons, cards, labels, and inline links. The dual-weight scale (400 for copy, 500 for emphasis) is the sole hierarchy tool for running text. The negative tracking at small sizes tightens headlines without compressing readability.

### universalSansDisplay — Editorial display face for H1/H2 only — set at near-100% line-height (-1.8px at 72px) to lock the type to a grid and create the confident, monolithic headline blocks. Weight 400 at 48–72px is the signature: headlines whisper rather than shout. · `--font-universalsansdisplay`
- **Substitute:** Söhne, GT America, Inter Display
- **Weights:** 400, 500
- **Sizes:** 24, 30, 48, 60, 72
- **Line height:** 1.00–1.33
- **Letter spacing:** -0.025em across the scale
- **Role:** Editorial display face for H1/H2 only — set at near-100% line-height (-1.8px at 72px) to lock the type to a grid and create the confident, monolithic headline blocks. Weight 400 at 48–72px is the signature: headlines whisper rather than shout.

### GeistMono — Technical monospace — terminal mockups, code snippets, metadata labels, tab labels (Python/TypeScript/cURL). Sets the developer-engineering tone; pairs against the universalSans to mark technical vs editorial voice. · `--font-geistmono`
- **Substitute:** Geist Mono, JetBrains Mono
- **Weights:** 400, 700
- **Sizes:** 10, 11, 12, 13
- **Line height:** 1.50–1.85
- **Letter spacing:** -0.01em
- **Role:** Technical monospace — terminal mockups, code snippets, metadata labels, tab labels (Python/TypeScript/cURL). Sets the developer-engineering tone; pairs against the universalSans to mark technical vs editorial voice.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 20 | -0.12px | `--text-caption` |
| body-sm | 14px | 20 | — | `--text-body-sm` |
| body | 16px | 24 | — | `--text-body` |
| heading-sm | 24px | 32 | -0.6px | `--text-heading-sm` |
| subheading | 30px | 36 | -0.75px | `--text-subheading` |
| heading | 48px | 48 | -1.2px | `--text-heading` |
| heading-lg | 60px | 60 | -1.5px | `--text-heading-lg` |
| display | 72px | 72 | -1.8px | `--text-display` |

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
| 48 | 48px | `--spacing-48` |
| 64 | 64px | `--spacing-64` |
| 96 | 96px | `--spacing-96` |
| 144 | 144px | `--spacing-144` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 16px |
| pills | 9999px |
| inputs | 6px |
| buttons | 9999px |
| smallCards | 8px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| subtle | `rgba(10, 10, 10, 0.15) 0px 0px 0px 1px` | `--shadow-subtle` |
| xl | `rgba(0, 0, 0, 0.1) 0px 20px 25px -5px, rgba(0, 0, 0, 0.1)...` | `--shadow-xl` |
| subtle-2 | `rgba(0, 0, 0, 0.06) 0px 0px 0px 1px, rgba(15, 23, 42, 0.1...` | `--shadow-subtle-2` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 40px
- **Element gap:** 12px

## Components

### Filled Primary Button
**Role:** Main call-to-action

Background #0a0a0a, text #ffffff, radius 9999px, padding 12px 20px, font 14px/20 universalSans weight 500. Used for 'Get API Access', 'Start Building', 'Try for free'. The single high-contrast element on the page; no border, no shadow.

### Ghost Secondary Button
**Role:** Tertiary action

Background transparent, text #0a0a0a, radius 9999px, padding 12px 20px, font 14px/20 universalSans weight 500. Pairs directly beside a filled primary as the soft alternative. No visible border by default; hover adds 1px #d5d9e2 ring.

### Compact Nav Button
**Role:** Top-bar utility (Contact Sales)

Background #ffffff, text #0a0a0a, radius 9999px, padding 6px 12px, border 1px #d5d9e2. Smaller scale than hero buttons; sits in the sticky header alongside the filled primary.

### Beta Tag Pill
**Role:** Feature-release badge

Background #f2ede5 (warm wash), text #0a0a0a, radius 9999px, padding 2px 8px, font 12px universalSans weight 500. Used inline before a feature label ('Beta  Grok Voice Agent Builder'). The only colored pill in the system.

### Flat Cream Card
**Role:** Product showcase tile (Chat, Voice, Build, Imagine)

Background #f9f8f6, radius 8–16px (asymmetric — inner mockup radius differs from card radius), padding 0, no shadow, no border. Card holds a media element (code mockup, audio waveform, image) flush to its edges; the surface tone alone separates it from the page.

### Pricing Tier Card
**Role:** Large comparison panel

Background #f9f8f6, radius 16px, padding 40px on all sides, no shadow. Spacious interior with generous heading-to-body ratio. Uses universalSans weight 500 for tier name, weight 400 for spec lines.

### Terminal Code Block
**Role:** Developer-facing mockup (chat/code demos)

Background #151515, radius 12px, padding not standardized, font GeistMono 12–13px. Traffic-light dots (#ff5f57, #ffbd2, #28c840) sit top-left at ~8px. Syntax highlighting uses a muted code palette (#032f62 keys, #91c17a strings, #d73a49 errors) — these are mockup-internal, not system tokens.

### Language Tab Pill
**Role:** Code-snippet language switcher (Python/TypeScript/cURL)

Radius 9999px, padding 6px 12px, font 13px GeistMono. Active state: background #0a0a0a, text #ffffff. Inactive: background transparent, text #858585. Sits beneath code-block mocks.

### Navigation Link
**Role:** Top-nav menu item

Font 14px/20 universalSans weight 500, text #858585 default → #0a0a0a on hover, no underline, no background. Underline appears only on focus. Dropdown indicators (▾) drawn with stroke #858585.

### News Card
**Role:** Latest-news tile in 4-column grid

Background transparent (inherits page), no border, no radius, no padding. Image at top with default radius, then date meta in 11px universalSans weight 400 #858585, then title in 16px weight 500 #0a0a0a. The absence of a card surface is intentional — news feels like an index, not a gallery.

### Feature Stat Block
**Role:** Hero metric (1M+ API calls/day, <200ms median latency)

Large number 18px universalSans weight 400 #0a0a0a stacked above 11px label #9d9d9d. No card wrapper; sits inline within a feature column.

### Checklist Row
**Role:** Pricing-tier bullet line

UniversalSans 14px/20 weight 400 #0a0a0a. Leading check glyph in #0a0a0a stroke. Vertical stack with 8px row-gap; no dividers between rows.

## Do's and Don'ts

### Do
- Use #0a0a0a for the primary filled button — never substitute a chromatic CTA color; the system is intentionally monochrome
- Set all headlines (24px+) with letter-spacing -0.025em and line-height 1.0–1.33; lock them to the type grid rather than centring them visually
- Apply radius 9999px to every button, tag, and language tab; the pill is the system's signature shape
- Use #f9f8f6 for any surface that sits above the page; let the warm cream alone separate layers — avoid shadows
- Reach for GeistMono whenever content is technical (code, terminal, tabs, metadata); reserve universalSans for editorial and UI copy
- Keep the Beta pill to feature-release moments only (#f2ede5 background, 12px weight 500); do not introduce other accent pills
- Default to ghost/outlined buttons for any action that is not the page's single primary conversion

### Don't
- Do not use chromatic colors for buttons or links — the only saturated color on a page should be a single Beta pill or a terminal dot
- Do not stack shadows; the system uses a single hairline ring (1px solid #d5d9e2) as the sole depth cue
- Do not set body text below 14px or above 18px on screen; the type scale jumps from 18 → 24 → 30 → 48 to preserve hierarchy through size alone
- Do not add background colors to nav links, news cards, or inline list items — the page should read as quiet whitespace
- Do not use line-heights above 1.63 for running text; display headlines must stay at 1.0–1.33 to maintain the editorial lockup
- Do not introduce new radii; the system is binary — pills (9999px) or cream cards (16px), no intermediate rounding
- Do not use pure black (#000000) — always #0a0a0a; the slight lift keeps the dark surfaces on-brand warm rather than CRT-cold

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Paper | `#ffffff` | Page background, modal canvas, inline white surfaces |
| 1 | Cream | `#f9f8f6` | Card surfaces, secondary panels, tag backgrounds — the dominant elevated layer |
| 2 | Sand | `#f2ede5` | Warm wash for highlight zones, Beta pill, subtle section tints |
| 3 | Charcoal | `#151515` | Inverted surface for code-block mocks, terminal demos — appears only inside product illustrations |

## Elevation

- **Compact nav button, ghost button focus state:** `0 0 0 1px rgba(10, 10, 10, 0.15)`
- **Sticky header (on scroll):** `0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)`
- **Elevated cream card (pricing, modal-like surfaces):** `0 0 0 1px rgba(0, 0, 0, 0.06), 0 18px 40px -24px rgba(15, 23, 42, 0.18)`

## Imagery

Imagery is product-screenshot-driven, not lifestyle. The hero and feature tiles contain in-context product captures: a chat thread rendered as a UI mockup, a code editor with syntax-highlighted TypeScript, a voice waveform on a cream card, a code-snippet panel on a warm gradient backdrop. All product visuals sit inside flat cream containers with no rounded inner edges masking the media. Decorative warmth comes from large radial gradient orbs (peach/coral) that bleed behind code panels — blurred at 64px, they read as ambient glow rather than imagery. Photography is absent; the system is pure UI + illustration + gradient. Icons are stroke-based, 1.5px weight, Fog (#858585) by default with Jet (#0a0a0a) on hover. No 3D renders, no stock photography, no human figures.

## Layout

Layout is max-width centered (~1200px) on a full-bleed white canvas, with generous vertical rhythm (80px section gaps). The hero is text-first: a centered headline stack on white with two CTAs below, followed by a 2-column product-card row (Chat / Code) at comfortable density. Below the hero, the page alternates into single-column feature blocks (One API. Every modality.) with text-left and code-panel-right splits, then a 4-column news index, then a 2-column pricing/CTA tier. Navigation is a single sticky top bar (64px) with logo + horizontal menu + two right-aligned action buttons. The page never uses a sidebar; content density stays low. Cards are flat and borderless — the cream surface alone carries the grouping. The sticky header adopts a backdrop-blur (12px) and hairline bottom border on scroll.

## Agent Prompt Guide

## Quick Color Reference
- Text: #0a0a0a (primary), #858585 (secondary), #9d9d9d (tertiary), #3b3b3b (muted heading)
- Background: #ffffff (page), #f9f8f6 (card), #f2ede5 (warm wash), #151515 (code mockup)
- Border: #d5d9e2 (hairline ring)
- Accent: #ffbd2e (Beta pill, terminal yellow)
- primary action: #0a0a0a (filled action)

## Example Component Prompts

1. Create a Primary Action Button: #0a0a0a background, #ffffff text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.

2. **Cream Product Card**: Background #f9f8f6, radius 16px, padding 0 (media flush to edges). Internal media is a terminal mockup: background #151515, radius 12px, GeistMono 13px with traffic-light dots (#ff5f57, #ffbd2e, #28c840) top-left.

3. **Pricing Tier Card**: Background #f9f8f6, radius 16px, padding 40px. Tier name in 24px universalSansDisplay weight 500, #0a0a0a. Spec lines in 14px universalSans weight 400, #858585. Checkmark rows: 14px weight 400 #0a0a0a with leading #0a0a0a check stroke, 8px row-gap.

4. **Language Tab Strip**: Pills at radius 9999px, padding 6px 12px, GeistMono 13px. Active: bg #0a0a0a, text #ffffff. Inactive: bg transparent, text #858585. Sits directly beneath a code-block mockup.

5. **News Index Card**: No surface, no border, no radius. Image at top (default radius), then 11px universalSans weight 400 #858585 date meta, then 16px weight 500 #0a0a0a title. Lives in a 4-column grid with 24px column-gap.

## Editorial Type System

The defining type choice is the pairing of universalSansDisplay (weight 400, not 500 or 700) at hero sizes with line-height locked to ~1.0. Headlines are not bold — they are massive and quiet. Negative tracking (-0.025em) tightens them without compressing letterforms, and the 1.0 line-height means the block becomes a typographic slab rather than a column of text. This is the anti-bold-headline system: authority through size and restraint, not weight. At smaller sizes the same family at weight 500 carries emphasis; GeistMono interrupts to mark technical territory. The three-font system (universalSans / universalSansDisplay / GeistMono) is intentionally narrow — there is no fourth voice.

## Orb and Gradient Vocabulary

Decorative warmth comes from two specific gradient patterns, used sparingly: (1) a radial coral/peach orb (#ff8868 → transparent, or #ffa888 → transparent) blurred at 64px that bleeds behind code-block panels, giving the developer surface a sunset glow without committing to a brand color; (2) a linear indigo→pink→orange→amber spectrum used as a single accent stripe behind logos or progress bars. These are page-atmosphere gradients, never used for buttons, text, or functional UI. Treat them as a third surface tier — visual depth without chromatic commitment.

## Similar Brands

- **Linear** — Same near-monochrome palette with one high-contrast filled pill CTA, and editorial-grade display headlines at near-100% line-height
- **Vercel** — Same black-pill-on-white hero button system and tight negative tracking on display type, with similar hairline-border depth cues
- **Anthropic** — Same warm-paper editorial tone with restrained color rationing and Geist-family type pairing for developer surfaces
- **Stripe** — Same pill-shaped CTA convention, near-flat card surfaces, and use of one vivid gradient orb as the sole chromatic punctuation

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-jet-ink: #0a0a0a;
  --color-charcoal: #151515;
  --color-fog: #858585;
  --color-pewter: #9d9d9d;
  --color-steel: #545454;
  --color-dove: #d5d9e2;
  --color-cream: #f9f8f6;
  --color-paper: #ffffff;
  --color-sand: #f2ede5;
  --color-slate: #3b3b3b;
  --color-ember: #ff5f57;
  --color-sunbeam: #ffbd2e;
  --color-sprout: #28c840;

  /* Typography — Font Families */
  --font-universalsans: 'universalSans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-universalsansdisplay: 'universalSansDisplay', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-geistmono: 'GeistMono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 20;
  --tracking-caption: -0.12px;
  --text-body-sm: 14px;
  --leading-body-sm: 20;
  --text-body: 16px;
  --leading-body: 24;
  --text-heading-sm: 24px;
  --leading-heading-sm: 32;
  --tracking-heading-sm: -0.6px;
  --text-subheading: 30px;
  --leading-subheading: 36;
  --tracking-subheading: -0.75px;
  --text-heading: 48px;
  --leading-heading: 48;
  --tracking-heading: -1.2px;
  --text-heading-lg: 60px;
  --leading-heading-lg: 60;
  --tracking-heading-lg: -1.5px;
  --text-display: 72px;
  --leading-display: 72;
  --tracking-display: -1.8px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-bold: 700;

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
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-96: 96px;
  --spacing-144: 144px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 40px;
  --element-gap: 12px;

  /* Border Radius */
  --radius-sm: 3px;
  --radius-md: 6px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-full: 9999px;

  /* Named Radii */
  --radius-cards: 16px;
  --radius-pills: 9999px;
  --radius-inputs: 6px;
  --radius-buttons: 9999px;
  --radius-smallcards: 8px;

  /* Shadows */
  --shadow-subtle: rgba(10, 10, 10, 0.15) 0px 0px 0px 1px;
  --shadow-xl: rgba(0, 0, 0, 0.1) 0px 20px 25px -5px, rgba(0, 0, 0, 0.1) 0px 8px 10px -6px;
  --shadow-subtle-2: rgba(0, 0, 0, 0.06) 0px 0px 0px 1px, rgba(15, 23, 42, 0.18) 0px 18px 40px -24px;

  /* Surfaces */
  --surface-paper: #ffffff;
  --surface-cream: #f9f8f6;
  --surface-sand: #f2ede5;
  --surface-charcoal: #151515;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-jet-ink: #0a0a0a;
  --color-charcoal: #151515;
  --color-fog: #858585;
  --color-pewter: #9d9d9d;
  --color-steel: #545454;
  --color-dove: #d5d9e2;
  --color-cream: #f9f8f6;
  --color-paper: #ffffff;
  --color-sand: #f2ede5;
  --color-slate: #3b3b3b;
  --color-ember: #ff5f57;
  --color-sunbeam: #ffbd2e;
  --color-sprout: #28c840;

  /* Typography */
  --font-universalsans: 'universalSans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-universalsansdisplay: 'universalSansDisplay', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-geistmono: 'GeistMono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 20;
  --tracking-caption: -0.12px;
  --text-body-sm: 14px;
  --leading-body-sm: 20;
  --text-body: 16px;
  --leading-body: 24;
  --text-heading-sm: 24px;
  --leading-heading-sm: 32;
  --tracking-heading-sm: -0.6px;
  --text-subheading: 30px;
  --leading-subheading: 36;
  --tracking-subheading: -0.75px;
  --text-heading: 48px;
  --leading-heading: 48;
  --tracking-heading: -1.2px;
  --text-heading-lg: 60px;
  --leading-heading-lg: 60;
  --tracking-heading-lg: -1.5px;
  --text-display: 72px;
  --leading-display: 72;
  --tracking-display: -1.8px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-96: 96px;
  --spacing-144: 144px;

  /* Border Radius */
  --radius-sm: 3px;
  --radius-md: 6px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-subtle: rgba(10, 10, 10, 0.15) 0px 0px 0px 1px;
  --shadow-xl: rgba(0, 0, 0, 0.1) 0px 20px 25px -5px, rgba(0, 0, 0, 0.1) 0px 8px 10px -6px;
  --shadow-subtle-2: rgba(0, 0, 0, 0.06) 0px 0px 0px 1px, rgba(15, 23, 42, 0.18) 0px 18px 40px -24px;
}
```
