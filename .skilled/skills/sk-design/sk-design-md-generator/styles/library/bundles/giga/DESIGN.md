# Giga — Style Reference
> Midnight horizon above matte obsidian

**Theme:** dark

Giga is a cinematic, dark-mode enterprise brand that reads like a luxury watch ad crossed with an AI lab. The canvas is near-black (#0f0d0d) and the type is whisper-thin — emilioDisplay at weight 300 sets a 48–66px headline that floats above full-bleed atmospheric photography with the confidence of a film title card. The interface is restrained and quiet: pill-shaped controls, glass-effect badges, monochrome logo strips, and a single ember-red accent (#fe2c02) that acts as punctuation rather than branding chrome. Every surface feels like it was pulled from a darkened showroom — matte blacks, hairline white-alpha borders, soft 16px card corners, and 9999px button radii that read as physical, not digital. Density is comfortable but the negative space is architectural, not empty: a section gap feels like turning a page in a coffee-table book.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Obsidian | `#000000` | `--color-obsidian` | Deepest background, hero image overlay, footer canvas, shadow base — pure black creates cinematic depth behind atmospheric photography |
| Onyx | `#0f0d0d` | `--color-onyx` | Primary page canvas (--bg), card surface, default button fill — the warm-tinted near-black that grounds the entire interface |
| Charcoal | `#171615` | `--color-charcoal` | Raised surface, dark button background (--button-dark-bg), elevated cards — one step lighter than the canvas to signal depth without drawing attention |
| Graphite | `#262828` | `--color-graphite` | Stepped feature panels, image containers, secondary surface layer — visible in side-by-side comparison modules |
| Void | `#050404` | `--color-void` | Near-black used in box-shadow tints and image depth effects — effectively black but with a barely-warm undertone matching Onyx |
| Paper | `#ffffff` | `--color-paper` | Primary text, icons, light button text, filled button surface (--primary) — pure white on near-black achieves 19:1 contrast, the highest readable tier |
| Ash | `#878686` | `--color-ash` | Secondary body text, descriptive copy, helper labels — sits at ~50% luminance, legible without competing with headlines |
| Smoke | `#6f6e6e` | `--color-smoke` | Tertiary text, decorative fills, disabled states, muted metadata — low-contrast informational layer |
| Fog | `#939292` | `--color-fog` | Mid-tone body text, inline labels, muted paragraph text — the readable middle gray for longer descriptions |
| Ember Red | `#fe2c02` | `--color-ember-red` | Saturated accent for highlight cards and feature panels — the single chromatic punctuation in an otherwise monochrome system, evokes urgency and warmth without aggression |

## Tokens — Typography

### gigaSansText — Body text, buttons, navigation, links — the workhorse. Weight 400 for paragraphs, 500 for button labels and emphasis. 16px at 1.5 line-height is the readable default; 14px at 1.43 handles dense UI chrome. · `--font-gigasanstext`
- **Substitute:** Inter, Geist, or Söhne at weights 400/500.
- **Weights:** 400, 500
- **Sizes:** 12px, 14px, 16px
- **Line height:** 1.43-1.50
- **Role:** Body text, buttons, navigation, links — the workhorse. Weight 400 for paragraphs, 500 for button labels and emphasis. 16px at 1.5 line-height is the readable default; 14px at 1.43 handles dense UI chrome.

### emilioDisplay — Display headlines — the signature voice. Ultra-light weight at 48-66px with tight -0.02em to -0.03em tracking creates a film-title-card feel. Most enterprise brands shout with 700-weight headlines; Giga whispers with 300, which is the entire personality in one choice. · `--font-emiliodisplay`
- **Substitute:** Canela, Tiempos Headline, or PP Editorial New at weight 300. Fallback: Cormorant Garamond Light.
- **Weights:** 300
- **Sizes:** 48px, 60px, 66px
- **Line height:** 1.20-1.30
- **Letter spacing:** -0.0300em, -0.0200em
- **Role:** Display headlines — the signature voice. Ultra-light weight at 48-66px with tight -0.02em to -0.03em tracking creates a film-title-card feel. Most enterprise brands shout with 700-weight headlines; Giga whispers with 300, which is the entire personality in one choice.

### gigaSansDisplay — Section subheadings, feature card titles, prominent UI labels — bridges the gap between whisper-thin display and body text. Weight 500 at 22px carries mid-importance statements. · `--font-gigasansdisplay`
- **Substitute:** Same as gigaSansText — Inter or Geist at 400/500.
- **Weights:** 400, 500
- **Sizes:** 22px, 30px
- **Line height:** 1.00-1.50
- **Role:** Section subheadings, feature card titles, prominent UI labels — bridges the gap between whisper-thin display and body text. Weight 500 at 22px carries mid-importance statements.

### interText — Large numerical and functional headings — 44px with -0.03em tracking for stat callouts and mid-level headings. Acts as a contrast voice to the emilioDisplay serif displays. · `--font-intertext`
- **Substitute:** Inter at weight 400.
- **Weights:** 400
- **Sizes:** 14px, 16px, 44px
- **Line height:** 1.00-1.57
- **Letter spacing:** -0.0300em
- **Role:** Large numerical and functional headings — 44px with -0.03em tracking for stat callouts and mid-level headings. Acts as a contrast voice to the emilioDisplay serif displays.

### geistMono — Micro-labels, badges, tags, version markers, uppercase metadata — always uppercase with +0.007em to +0.009em tracking. The 11-12px range with 2.0+ line-height creates spacious technical annotations. · `--font-geistmono`
- **Substitute:** Geist Mono, JetBrains Mono, or IBM Plex Mono.
- **Weights:** 400, 500
- **Sizes:** 11px, 12px, 14px
- **Line height:** 1.20-2.18
- **Letter spacing:** 0.0070em, 0.0090em
- **Role:** Micro-labels, badges, tags, version markers, uppercase metadata — always uppercase with +0.007em to +0.009em tracking. The 11-12px range with 2.0+ line-height creates spacious technical annotations.

### interDisplay — interDisplay — detected in extracted data but not described by AI · `--font-interdisplay`
- **Weights:** 500
- **Sizes:** 16px
- **Line height:** 1.5
- **Role:** interDisplay — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 2 | — | `--text-caption` |
| body-sm | 14px | 1.43 | — | `--text-body-sm` |
| body | 16px | 1.5 | — | `--text-body` |
| subheading | 22px | 1.5 | — | `--text-subheading` |
| heading-sm | 30px | 1.33 | — | `--text-heading-sm` |
| heading | 48px | 1.3 | -0.96px | `--text-heading` |
| heading-lg | 60px | 1.2 | -1.8px | `--text-heading-lg` |
| display | 66px | 1.2 | -1.98px | `--text-display` |

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
| 44 | 44px | `--spacing-44` |
| 48 | 48px | `--spacing-48` |
| 60 | 60px | `--spacing-60` |
| 64 | 64px | `--spacing-64` |
| 96 | 96px | `--spacing-96` |
| 112 | 112px | `--spacing-112` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 16px |
| chips | 6px |
| input | 6px |
| badges | 9999px |
| images | 12px |
| buttons | 9999px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| xl | `rgba(0, 0, 0, 0.7) 0px 12px 32px -16px` | `--shadow-xl` |

### Layout

- **Page max-width:** 1280px
- **Section gap:** 80-120px
- **Card padding:** 20px
- **Element gap:** 20px

## Components

### Pill Button (Dark Fill)
**Role:** Primary navigation and CTA surface

9999px border-radius, 9px vertical / 20px horizontal padding, background #171615, text #ffffff, 1px border with rgba(255,255,255,0.1) subtle stroke. Font: gigaSansText 14px weight 500. Used for 'Sign in' and exploratory action buttons.

### Pill Button (Light Fill)
**Role:** High-emphasis CTA — the only solid-white button in the system

9999px border-radius, 9px/20px padding, background #ffffff, text #000000, no border. Font: gigaSansText 14px weight 500. 'See a demo' uses this variant — white-on-dark creates maximum contrast and signals the single most important action per viewport.

### Ghost Navigation Button
**Role:** Minimal nav link styling

9999px radius, 0px vertical / 12-22px horizontal padding, transparent background, white text. Font: gigaSansText 14px weight 400. Used for 'Product' and 'Company' nav items with dropdown chevrons.

### Glass Badge Pill
**Role:** Announcement chip floating over photography

9999px radius, translucent dark fill (oklab black at ~20% opacity), 1px white-alpha border. Contains a small dot indicator + uppercase 11-12px geistMono text. Example: '● GIGA LAUNCHES SCOUT'. Functions as a notification/launch marker over hero imagery.

### Translucent Card
**Role:** Content card floating over dark/photographic backgrounds

16px border-radius, 20px padding, background oklab(0 0 0 / 0.2) — nearly invisible on dark, visible over imagery. 1px hairline border at oklch(100% 0 0 / 0.05-0.08). No shadow — the glass effect comes from translucency alone. Used for video preview cards, feature overlays.

### Solid Card
**Role:** High-contrast content module on canvas

16px border-radius, 20px padding, background #fe2c02 (Ember Red) or #0f0d0d. No shadow. The Ember Red variant appears once as a high-impact accent card — the only chromatic surface in the system.

### Video Preview Card
**Role:** Floating media player with metadata

6px border-radius on the thumbnail image, 16px on the card container. Dark card background, small geistMono timestamp label, white body text description. Positioned bottom-left as a persistent engagement element over the hero.

### Logo Strip
**Role:** Social proof band — partner/customer logos

Full-width band, single row of monochrome white logos at ~60% opacity, evenly spaced with ~80px gaps. Logos are grayscale (filter: grayscale(1), brightness(0.92)). No card containers, no borders — logos float directly on the dark canvas.

### Atmospheric Hero Section
**Role:** Full-bleed cinematic opening

Full-viewport-height dark photography (mountain/landscape) with a subtle linear gradient overlay (black 1% → oklch(0.163 0.003 30) 100%) darkening the bottom. Centered text stack: glass badge → 48-66px emilioDisplay weight 300 headline → 16px body subtext → pill button. No card containers, no visible grid lines.

### Stepped Feature Panel
**Role:** Side-by-side comparison or feature showcase module

Background #262828 (Graphite) — visibly lighter than the Onyx canvas, creating a raised panel effect without shadows. 16px or 20px radius. Contains image+text pairs arranged in a 2-column grid with 20px gaps.

### Uppercase Mono Label
**Role:** Section eyebrow / category tag

11-12px geistMono weight 400, uppercase, letter-spacing +0.007-0.009em, line-height 2.0+. White or Ash color. Appears above section titles as a technical-classification marker (e.g., 'CAPABILITIES', 'INTEGRATIONS').

### Stat Callout
**Role:** Large numerical proof point

44px interText weight 400, white, line-height 1.0, letter-spacing -0.03em. Paired with 14px gigaSansText descriptor below. Used for percentage metrics like '90%'. The tight tracking on 44px numericals creates a condensed, authoritative display.

## Do's and Don'ts

### Do
- Use weight 300 emilioDisplay at 48-66px for all primary headlines — the whisper-thin display is the brand's signature voice
- Apply 9999px border-radius to all buttons, badges, tags, and interactive pills — nothing rectangular should be clickable
- Set page background to #0f0d0d (Onyx) as default; use #000000 only for full-bleed photography containers and footer
- Use #ffffff for all primary text and icons on dark surfaces — the 19:1 contrast is the readable standard, don't step down from it
- Place uppercase 11-12px geistMono labels with +0.009em tracking above section titles as technical eyebrows
- Use Ember Red (#fe2c02) only on a single accent card per viewport — it is punctuation, not chrome
- Set body text at 16px gigaSansText weight 400 with 1.5 line-height for all paragraphs and descriptive copy

### Don't
- Don't use weight 600+ for headlines — the system whispers at 300, shouting breaks the entire atmosphere
- Don't add drop shadows to cards — depth comes from surface color stepping (#0f0d0d → #171615 → #262828), not elevation
- Don't use rectangular buttons or sharp corners on any interactive element — all controls are pills
- Don't apply the Ember Red accent to more than one element per section — overuse destroys its impact
- Don't use #000000 as page background — use #0f0d0d; pure black is reserved for photographic backdrops
- Don't use chromatic colors for text — white and grays only for typography; color is surface-only
- Don't mix serif and sans at the same hierarchy level — emilioDisplay is for display, gigaSansText for everything else, never both at body size

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Obsidian | `#000000` | Deepest background — full-bleed photography backdrops, footer base, shadow sink |
| 1 | Onyx | `#0f0d0d` | Primary page canvas — the warm-tinted near-black that everything sits on |
| 2 | Charcoal | `#171615` | Raised cards, dark button fills, elevated content blocks |
| 3 | Graphite | `#262828` | Stepped panels, comparison modules, image containers |
| 4 | Glass Overlay | `#00000033` | Translucent card surfaces over photography — the frosted-glass effect for badges and floating UI |

## Elevation

- **Atmospheric Image Container:** `rgba(0, 0, 0, 0.7) 0px 12px 32px -16px`

## Imagery

Full-bleed atmospheric photography dominates the hero — wide landscape shots of mountains, forests, and horizons captured at dusk or dawn with low contrast and desaturated color. Images receive a subtle linear gradient overlay (black to warm-dark-oklch) darkening the bottom 40% to maintain text legibility. No lifestyle photography, no product shots, no people — the brand speaks through landscape metaphor. Below the hero, imagery shifts to contained product screenshots and UI mockups with 6-12px corner radii, always on dark backgrounds. Icon style is minimal and line-based with 1px strokes. The partner logo strip uses grayscale filters (grayscale(1), brightness(0.92)) on white logos. The visual density is image-heavy at the top (hero) and text-dominant below, creating a cinematic opening that resolves into a clean enterprise product page.

## Layout

Full-bleed sections with no visible max-width container on the hero — the atmospheric photography and centered headline stack use the full viewport. Below the hero, content shifts to a centered max-width layout (~1280px) with generous 80-120px section gaps. The hero pattern is: full-viewport dark photography + centered glass badge + 48-66px whisper-thin headline + 16px subtext + single pill button + floating video card in bottom-left + monochrome logo strip across the bottom. Section rhythm alternates between full-width dark bands and contained content blocks. The overall page model is cinematic-to-editorial: one dramatic opening shot, then measured product storytelling in a comfortable-density grid. Navigation is a minimal floating bar at the top with logo left, two dropdown links center-left, sign-in and white CTA pill right. No sidebar, no mega-menu — the nav is deliberately sparse to let the hero breathe.

## Agent Prompt Guide

**Quick Color Reference**
- text: #ffffff
- background: #0f0d0d
- border: rgba(255,255,255,0.08)
- accent: #fe2c02
- muted text: #878686
- primary action: #0f0d0d (filled action)

**3-5 Example Component Prompts**

1. **Atmospheric Hero Section**: Full-viewport dark landscape photo (mountains at dusk) as background with linear-gradient(rgb(0,0,0) 1%, oklch(0.163 0.003 30) 100%) overlay darkening the bottom. Centered glass badge pill: 9999px radius, oklab(0 0 0 / 0.2) fill, 1px white-alpha border, 11px geistMono uppercase white text with a small dot prefix. Below: 60px emilioDisplay weight 300 headline, #ffffff, letter-spacing -1.8px, line-height 1.2. Subtext: 16px gigaSansText weight 400, #878686. White pill button: 9999px radius, #ffffff background, #000000 text, 14px gigaSansText weight 500, 9px/20px padding.

2. **Feature Section Card**: 16px radius, 20px padding, #171615 (Charcoal) background on #0f0d0d canvas. 30px gigaSansDisplay weight 400 heading in #ffffff. 16px gigaSansText weight 400 body in #878686. Dark pill button at bottom: 9999px radius, #171615 fill, #ffffff text, 1px rgba(255,255,255,0.1) border.

3. **Logo Trust Strip**: Full-width band on #0f0d0d canvas. 6 partner logos in a single row, white, each at ~60% opacity, filter: grayscale(1) brightness(0.92). Evenly spaced with ~80px gap, vertically centered. No card containers or borders.

4. **Stat Callout Block**: 44px interText weight 400, #ffffff, letter-spacing -1.32px, line-height 1.0 for the number. Below: 14px gigaSansText weight 400, #878686 for the descriptor. No card — sits directly on canvas with 20px element gap.

5. **Translucent Overlay Card**: 16px radius, 20px padding, background oklab(0 0 0 / 0.2), 1px border oklch(100% 0 0 / 0.05). Over a dark photograph. Contains: 12px geistMono uppercase label in #ffffff, 22px gigaSansDisplay weight 500 heading in #ffffff, 14px gigaSansText body in #878686.

## Similar Brands

- **Linear** — Same dark-mode enterprise aesthetic with monochrome palette, pill-shaped controls, and whisper-thin display typography over full-bleed dark backgrounds
- **Vercel** — Similar ultra-minimal dark canvas with hairline borders, restrained accent color usage, and generous negative space that lets large display type dominate
- **Arc Browser** — Shared cinematic dark-mode treatment with atmospheric hero photography, glass-effect floating UI, and pill-shaped navigation controls
- **Nothing Phone** — Same editorial-product hybrid — full-bleed landscape photography above the fold resolving into a clean monochrome product grid, with a single accent color for emphasis

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-obsidian: #000000;
  --color-onyx: #0f0d0d;
  --color-charcoal: #171615;
  --color-graphite: #262828;
  --color-void: #050404;
  --color-paper: #ffffff;
  --color-ash: #878686;
  --color-smoke: #6f6e6e;
  --color-fog: #939292;
  --color-ember-red: #fe2c02;

  /* Typography — Font Families */
  --font-gigasanstext: 'gigaSansText', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-emiliodisplay: 'emilioDisplay', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-gigasansdisplay: 'gigaSansDisplay', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-intertext: 'interText', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-geistmono: 'geistMono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-interdisplay: 'interDisplay', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 2;
  --text-body-sm: 14px;
  --leading-body-sm: 1.43;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-subheading: 22px;
  --leading-subheading: 1.5;
  --text-heading-sm: 30px;
  --leading-heading-sm: 1.33;
  --text-heading: 48px;
  --leading-heading: 1.3;
  --tracking-heading: -0.96px;
  --text-heading-lg: 60px;
  --leading-heading-lg: 1.2;
  --tracking-heading-lg: -1.8px;
  --text-display: 66px;
  --leading-display: 1.2;
  --tracking-display: -1.98px;

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
  --spacing-44: 44px;
  --spacing-48: 48px;
  --spacing-60: 60px;
  --spacing-64: 64px;
  --spacing-96: 96px;
  --spacing-112: 112px;

  /* Layout */
  --page-max-width: 1280px;
  --section-gap: 80-120px;
  --card-padding: 20px;
  --element-gap: 20px;

  /* Border Radius */
  --radius-md: 6px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-full: 9999px;

  /* Named Radii */
  --radius-cards: 16px;
  --radius-chips: 6px;
  --radius-input: 6px;
  --radius-badges: 9999px;
  --radius-images: 12px;
  --radius-buttons: 9999px;

  /* Shadows */
  --shadow-xl: rgba(0, 0, 0, 0.7) 0px 12px 32px -16px;

  /* Surfaces */
  --surface-obsidian: #000000;
  --surface-onyx: #0f0d0d;
  --surface-charcoal: #171615;
  --surface-graphite: #262828;
  --surface-glass-overlay: #00000033;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-obsidian: #000000;
  --color-onyx: #0f0d0d;
  --color-charcoal: #171615;
  --color-graphite: #262828;
  --color-void: #050404;
  --color-paper: #ffffff;
  --color-ash: #878686;
  --color-smoke: #6f6e6e;
  --color-fog: #939292;
  --color-ember-red: #fe2c02;

  /* Typography */
  --font-gigasanstext: 'gigaSansText', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-emiliodisplay: 'emilioDisplay', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-gigasansdisplay: 'gigaSansDisplay', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-intertext: 'interText', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-geistmono: 'geistMono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-interdisplay: 'interDisplay', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 2;
  --text-body-sm: 14px;
  --leading-body-sm: 1.43;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-subheading: 22px;
  --leading-subheading: 1.5;
  --text-heading-sm: 30px;
  --leading-heading-sm: 1.33;
  --text-heading: 48px;
  --leading-heading: 1.3;
  --tracking-heading: -0.96px;
  --text-heading-lg: 60px;
  --leading-heading-lg: 1.2;
  --tracking-heading-lg: -1.8px;
  --text-display: 66px;
  --leading-display: 1.2;
  --tracking-display: -1.98px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-44: 44px;
  --spacing-48: 48px;
  --spacing-60: 60px;
  --spacing-64: 64px;
  --spacing-96: 96px;
  --spacing-112: 112px;

  /* Border Radius */
  --radius-md: 6px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-xl: rgba(0, 0, 0, 0.7) 0px 12px 32px -16px;
}
```
