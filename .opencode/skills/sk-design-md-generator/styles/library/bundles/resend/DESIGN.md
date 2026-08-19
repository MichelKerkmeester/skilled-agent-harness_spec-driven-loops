# Resend — Style Reference
> black velvet with violet neon

**Theme:** dark

Resend lives in a near-total darkness — pure black canvas, hairline graphite borders, and white-on-black typography that feels like reading text printed on matte glass. The hero is anti-decorative: a single large serif headline at 96px Domaine next to a 3D black cube, with no gradient wash and no marketing illustration. The brand mark is a tight violet (#9281f7) that appears in email-address strings, status icons, and code samples — never on buttons. A monospaced font (Commit Mono) carries the developer identity through every code block, badge, and inline label, making the page read like a terminal wrapped in a luxury interface. Components are sharp-cornered or gently rounded (6px / 16px), low-elevation, and rely on 1px borders rather than shadows to separate layers. Motion is restrained but expressive: fade-and-slide hero text, subtle WebGL rotation on the hero cube, and short 150ms ease-out transitions on hover.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Void Black | `#000000` | `--color-void-black` | Page background, card surfaces, overlay scrims — the entire canvas |
| Graphite Hairline | `#292d30` | `--color-graphite-hairline` | 1px borders on cards, inputs, buttons, code blocks, dividers — defines every layer separation |
| White | `#ffffff` | `--color-white` | Primary headings, hero text, button labels, icon fills on dark surfaces |
| Bone White | `#f0f0f0` | `--color-bone-white` | Body text, secondary headings, stroke outlines on icons — the primary reading color |
| Ash Gray | `#a1a4a5` | `--color-ash-gray` | Muted body text, badge labels, icon strokes — third-tier text and metadata |
| Smoke Gray | `#abafb4` | `--color-smoke-gray` | Link color, inactive button text, supporting captions — fourth-tier text |
| Iron | `#6e727a` | `--color-iron` | Subtle decorative strokes, disabled states, low-emphasis borders |
| Charcoal | `#464a4d` | `--color-charcoal` | Inline code text, muted labels — text that should disappear into the surface |
| Iris Violet | `linear-gradient(to right bottom in oklab, rgb(146, 129, 247) 0%, rgb(154, 84, 220) 100%)` | `--color-iris-violet` | Violet text accent for links, tags, and emphasized short phrases; Diagonal violet-to-magenta gradient on icon containers and brand badges |
| Iris Violet Glow | `#baa7ff` | `--color-iris-violet-glow` | Violet text accent for links, tags, and emphasized short phrases |
| Signal Blue | `#3b9eff` | `--color-signal-blue` | Blue action color for filled buttons, selected navigation states, and focused conversion moments. |
| Sky Blue | `#70b8ff` | `--color-sky-blue` | Blue text accent for links, tags, and emphasized short phrases |
| Pulse Green | `#3ad389` | `--color-pulse-green` | Green text accent for links, tags, and emphasized short phrases. Use as a supporting accent, not as a status color |
| Alarm Red | `#ff9592` | `--color-alarm-red` | Red text accent for links, tags, and emphasized short phrases. Use as a supporting accent, not as a status color |
| Crimson | `#ff6465` | `--color-crimson` | Red wash for highlight backgrounds, decorative bands, and soft emphasis behind content. Use as a supporting accent, not as a status color |
| Amber | `#ffca16` | `--color-amber` | Yellow text accent for links, tags, and emphasized short phrases. Use as a supporting accent, not as a status color |
| Amber Glow | `#ffd60a` | `--color-amber-glow` | Yellow wash for highlight backgrounds, decorative bands, and soft emphasis behind content. Use as a supporting accent, not as a status color |
| Surface Gradient | `linear-gradient(rgb(27, 27, 27), rgb(3, 3, 3))` | `--color-surface-gradient` | Subtle card-to-canvas surface lift — used in edge fades and elevated panels |

## Tokens — Typography

### Inter — Body copy, UI labels, navigation, buttons, links. The workhorse — appears 1280 times across every non-code surface. · `--font-inter`
- **Substitute:** Inter (Google Fonts), Söhne, system-ui
- **Weights:** 400, 500, 600
- **Sizes:** 12px, 14px, 16px, 18px, 24px
- **Line height:** 1.00, 1.33, 1.43, 1.50, 1.60
- **Role:** Body copy, UI labels, navigation, buttons, links. The workhorse — appears 1280 times across every non-code surface.

### Domaine — Hero display type — weight 400 at 96px with -0.01em tracking creates an editorial, almost-printed feel. Only used twice on the entire page for the largest hero statement. · `--font-domaine`
- **Substitute:** GT Sectra, Tiempos Headline, Playfair Display
- **Weights:** 400
- **Sizes:** 77px, 96px
- **Line height:** 1.00
- **Letter spacing:** -0.01em
- **OpenType features:** `"ss01", "ss04", "ss11"`
- **Role:** Hero display type — weight 400 at 96px with -0.01em tracking creates an editorial, almost-printed feel. Only used twice on the entire page for the largest hero statement.

### aBC Favorit — Section headlines and sub-headlines. The 56px weight-400 with -0.05em tracking is the signature — extreme negative tracking on a geometric sans creates a compressed, confident display feel that contrasts the editorial Domaine hero. · `--font-abc-favorit`
- **Substitute:** Inter Display, Söhne Breit, GT America
- **Weights:** 400, 500
- **Sizes:** 14px, 16px, 20px, 56px
- **Line height:** 1.00, 1.20, 1.30, 1.50
- **Letter spacing:** -0.05em at 56px, +0.025em at 14px
- **OpenType features:** `"ss01", "ss04", "ss11"; "ss01", "ss03", "ss04"`
- **Role:** Section headlines and sub-headlines. The 56px weight-400 with -0.05em tracking is the signature — extreme negative tracking on a geometric sans creates a compressed, confident display feel that contrasts the editorial Domaine hero.

### Commit Mono — Code blocks, inline code, terminal-style badges, API labels. Monospaced presence is the developer's identity signal — appears 814 times, rivaling Inter. · `--font-commit-mono`
- **Substitute:** JetBrains Mono, Berkeley Mono, IBM Plex Mono
- **Weights:** 400
- **Sizes:** 12px, 14px, 16px
- **Line height:** 1.33, 1.43, 1.50
- **Role:** Code blocks, inline code, terminal-style badges, API labels. Monospaced presence is the developer's identity signal — appears 814 times, rivaling Inter.

### Helvetica — Helvetica — detected in extracted data but not described by AI · `--font-helvetica`
- **Weights:** 400, 600, 700
- **Sizes:** 14px
- **Line height:** 1, 1.71
- **Role:** Helvetica — detected in extracted data but not described by AI

### -apple-system — -apple-system — detected in extracted data but not described by AI · `--font-apple-system`
- **Weights:** 400
- **Sizes:** 14px
- **Line height:** 1.5, 1.55
- **OpenType features:** `"liga" 0`
- **Role:** -apple-system — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.33 | — | `--text-caption` |
| body-sm | 14px | 1.43 | — | `--text-body-sm` |
| body | 16px | 1.5 | — | `--text-body` |
| subheading | 20px | 1 | — | `--text-subheading` |
| heading-sm | 24px | 1.5 | — | `--text-heading-sm` |
| heading | 56px | 1.2 | -2.8px | `--text-heading` |
| heading-lg | 77px | 1 | -0.77px | `--text-heading-lg` |
| display | 96px | 1 | -0.96px | `--text-display` |

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
| 28 | 28px | `--spacing-28` |
| 32 | 32px | `--spacing-32` |
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |
| 64 | 64px | `--spacing-64` |
| 80 | 80px | `--spacing-80` |
| 96 | 96px | `--spacing-96` |
| 104 | 104px | `--spacing-104` |
| 144 | 144px | `--spacing-144` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 16px |
| badges | 6px |
| inputs | 6px |
| buttons | 6px |
| large-panels | 24px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| subtle | `rgba(176, 199, 217, 0.145) 0px 0px 0px 1px` | `--shadow-subtle` |
| subtle-2 | `rgb(0, 0, 0) 0px 0px 0px 8px` | `--shadow-subtle-2` |
| subtle-3 | `rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.1) 0p...` | `--shadow-subtle-3` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 96px
- **Card padding:** 32px
- **Element gap:** 16px

## Components

### Primary Button (Ghost on Black)
**Role:** Default CTA — 'Get started', 'Log in'

Transparent background, 1px border in #292d30, white text (#ffffff), 6px radius, 12px 16px padding. Hover increases border opacity to white. This is the signature button — never filled, never colorful.

### Nav Link Button
**Role:** Top navigation items — 'Features', 'Company', 'Resources'

Transparent background, no border, text color #f0f0f0 at 14px Inter weight 400, 0px padding. Underline or color shift on hover to #ffffff.

### Text Link with Chevron
**Role:** Inline CTAs — 'Documentation', 'Get started >'

No background, no border, white or #f0f0f0 text at 16px Inter, trailing chevron icon in same color. Restrained, terminal-like.

### Hero Announcement Pill
**Role:** 'Announcing Resend Forward >' badge above hero headline

Transparent fill, 1px border in #292d30, #f0f0f0 text at 14px Inter, 9999px (pill) radius, 6px 12px padding. Small chromatic accent chevron.

### Section Card
**Role:** Content cards in feature sections and testimonial grid

Black background (#000000), 1px border in #292d30, 16px radius, 32px padding, no shadow. Cards rely on the border to separate from the black canvas.

### Testimonial Card
**Role:** Customer quote cards in 'Beyond expectations' section

Black background, 1px #292d30 border, 16px radius, 24px padding. Contains quoted text at 16px Inter, avatar (32px circle), name at 14px weight 500 in #f0f0f0, role/title in #a1a4a5.

### Code Block / Terminal Window
**Role:** Developer-facing code snippets and API examples

Black background, 1px #292d30 border, 16px radius, Commit Mono at 12-14px. Syntax highlighting uses #9281f7 for strings/keywords, #3b9eff for filenames, #3ad389 for success values, #ff9592 for errors. Optional traffic-light dots in top-left for terminal aesthetic.

### Logo Grid
**Role:** Customer logos — Warner Bros, Max, Raycast, etc.

Inline-display logos at their native colors on black canvas, centered in a 4-column grid with 60px row gap. No card wrappers, no labels — just the marks breathing against black.

### Status Indicator Dot
**Role:** Email event status — delivered, opened, clicked, bounced, complained

2-3px diameter filled dot, no border, paired with label text in Commit Mono. Colors map to semantics: #3ad389 delivered, #70b8ff opened, #baa7ff clicked, #ff9592 bounced, #ffca16 complained.

### Email Address Badge
**Role:** 'from:' addresses in code samples and UI

No background, Commit Mono at 12-14px, text color #9281f7 (Iris Violet). The violet-on-black makes email identifiers the most readable code element — a deliberate developer-UX choice.

### Icon Container
**Role:** Rounded-square containers for app icons in integrations grid

32x32 or 48x48 rounded square (16px radius), subtle gradient fill (oklab violet→magenta), white or violet stroke icon inside. Creates the only chromatic surface on the page.

### 3D Hero Cube
**Role:** WebGL-rendered black geometric cube in hero

Full-opacity black cube with subtle edge highlights in #292d30, rotating slowly. No glow, no color — a sculptural object that anchors the right side of the hero against the black canvas.

### Footer Link Row
**Role:** Minimal footer with two text links

Two text links ('Privacy', 'Terms') at 14px Inter in #a1a4a5, separated by space, no decorative elements. Footer is intentionally minimal — no logo, no columns.

## Do's and Don'ts

### Do
- Use pure #000000 as the page canvas — never off-black or tinted dark grays for the background.
- Separate all UI layers with 1px borders in #292d30, not shadows. Cards, inputs, code blocks all rely on hairline borders against the black canvas.
- Use Commit Mono for any code, email address, or developer-facing string. Keep Inter for prose and UI chrome.
- Keep buttons ghost/outlined: transparent fill, 1px border, white text. Never use a filled colorful button as the primary CTA.
- Use 6px radius for buttons, badges, inputs. Use 16px radius for cards and code windows. Never mix — the radius scale is two values.
- Let Iris Violet (#9281f7) mark code strings and developer identifiers. It is the only brand color and should feel like syntax highlighting, not decoration.
- Apply tight -0.05em letter-spacing at 56px display sizes and -0.01em at 96px hero sizes. The compressed tracking is what makes the headlines feel confident.

### Don't
- Don't add gradients, glows, or chromatic washes to the hero or section backgrounds. The canvas is flat black.
- Don't use filled accent-color buttons (blue, violet, green) as primary actions. Buttons stay ghost or white-text-on-black.
- Don't use multiple border radii on a single surface. Cards are 16px, buttons/badges/inputs are 6px — pick one per component.
- Don't introduce colored card backgrounds. Cards sit on black with hairline borders; no #292d30 fills.
- Don't use shadows for elevation. The design relies on 1px borders and subtle backdrop blurs, not drop shadows.
- Don't pair Iris Violet with large type as a decorative heading color. It belongs to code and developer identifiers only.
- Don't break the monochrome-with-one-violet discipline by adding multiple accent hues to UI chrome. The status colors (green, blue, red, amber) are reserved for data/status indicators.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Void | `#000000` | Primary page canvas, full-bleed black |
| 1 | Graphite | `#292d30` | Hairline borders defining card and input surfaces against the void |
| 2 | Surface Lift | `#0b0e14` | Elevated panels and overlay scrims via subtle gradient |
| 3 | Backdrop Blur | `#000000f2` | Modal and navigation overlays with blur(25px) |

## Elevation

Elevation is achieved through 1px hairline borders (#292d30) against a flat black canvas, never through drop shadows. The only shadow token in active use is a faint 1px ring (rgba(176, 199, 217, 0.145)) on icon containers, used sparingly to suggest a subtle light source rather than depth.

## Imagery

Imagery is almost entirely WebGL-rendered 3D objects (black cube in hero, rotating geometric forms) and inline product UI screenshots shown inside dark code windows. No photography, no illustrations, no lifestyle imagery. Logos in the trust bar are inline SVGs at native colors. Icons are 1px-1.5px stroke outlines in #f0f0f0 or #a1a4a5. The visual language is: black canvas, 3D object as hero anchor, dark code windows as product proof, white SVG logos as social proof. Nothing decorative — every visual element is either structural (cube) or demonstrative (code window, logo).

## Agent Prompt Guide

Quick Color Reference:
- text/heading: #ffffff
- text/body: #f0f0f0
- text/muted: #a1a4a5
- background/canvas: #000000
- border/hairline: #292d30
- accent/code: #9281f7
- primary action: #3b9eff (filled action)

3-5 Example Component Prompts:

1. Create a section headline: 'Integrate tonight' at 56px aBCFavorit weight 400, color #ffffff, letter-spacing -2.8px, line-height 1.2. Below it, body copy at 18px Inter weight 400, color #a1a4a5. Section sits on a #000000 canvas with no border.

2. Create a code terminal window: #000000 background, 1px border in #292d30, 16px radius, padding 24px. Content in Commit Mono at 14px. Email address strings colored #9281f7, keywords colored #f0f0f0, success values colored #3ad389. Optional 3 traffic-light dots (8px circles) in top-left.

3. Create a navigation bar: transparent background, Resend wordmark logo on left (white), nav items ('Features', 'Company', 'Resources') in Inter 14px weight 400, color #f0f0f0. On the right, a 'Get started' button — transparent fill, 1px border in #292d30, white text, 6px radius, 8px 16px padding. The bar sits on #000000 with no separator.

4. Create a testimonial card: #000000 background, 1px border in #292d30, 16px radius, 32px padding. Quote text in Inter 16px weight 400, color #f0f0f0. Below: 32px circular avatar, name in Inter 14px weight 500 #f0f0f0, role/title in #a1a4a5. No shadow.

5. Create a status indicator row: inline pill with a 2px circle dot in #3ad389 followed by 'Delivered' label in Commit Mono 12px, color #a1a4a5. Dot indicates email event status. No background, no border, sits inline within a dark code window.

## Similar Brands

- **Linear** — Same black-canvas, hairline-border aesthetic with restrained chromatic accents and sharp typography
- **Vercel** — Near-identical pure-black backgrounds with white typography and minimal border-based elevation
- **Plaid** — Dark-mode developer-tool identity with monospaced code emphasis and single-accent palette
- **Railway** — Black canvas with terminal-style code windows as the primary product showcase
- **Stripe (dark mode)** — Editorially confident display type on black with hairline borders and ghost buttons

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-void-black: #000000;
  --color-graphite-hairline: #292d30;
  --color-white: #ffffff;
  --color-bone-white: #f0f0f0;
  --color-ash-gray: #a1a4a5;
  --color-smoke-gray: #abafb4;
  --color-iron: #6e727a;
  --color-charcoal: #464a4d;
  --color-iris-violet: #9281f7;
  --gradient-iris-violet: linear-gradient(to right bottom in oklab, rgb(146, 129, 247) 0%, rgb(154, 84, 220) 100%);
  --color-iris-violet-glow: #baa7ff;
  --color-signal-blue: #3b9eff;
  --color-sky-blue: #70b8ff;
  --color-pulse-green: #3ad389;
  --color-alarm-red: #ff9592;
  --color-crimson: #ff6465;
  --color-amber: #ffca16;
  --color-amber-glow: #ffd60a;
  --color-surface-gradient: #0b0e14;
  --gradient-surface-gradient: linear-gradient(rgb(27, 27, 27), rgb(3, 3, 3));

  /* Typography — Font Families */
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-domaine: 'Domaine', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-abc-favorit: 'aBC Favorit', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-commit-mono: 'Commit Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-helvetica: 'Helvetica', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-apple-system: '-apple-system', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.33;
  --text-body-sm: 14px;
  --leading-body-sm: 1.43;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-subheading: 20px;
  --leading-subheading: 1;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.5;
  --text-heading: 56px;
  --leading-heading: 1.2;
  --tracking-heading: -2.8px;
  --text-heading-lg: 77px;
  --leading-heading-lg: 1;
  --tracking-heading-lg: -0.77px;
  --text-display: 96px;
  --leading-display: 1;
  --tracking-display: -0.96px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-28: 28px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-96: 96px;
  --spacing-104: 104px;
  --spacing-144: 144px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 96px;
  --card-padding: 32px;
  --element-gap: 16px;

  /* Border Radius */
  --radius-md: 6px;
  --radius-lg: 10px;
  --radius-2xl: 16px;
  --radius-3xl: 24px;

  /* Named Radii */
  --radius-cards: 16px;
  --radius-badges: 6px;
  --radius-inputs: 6px;
  --radius-buttons: 6px;
  --radius-large-panels: 24px;

  /* Shadows */
  --shadow-subtle: rgba(176, 199, 217, 0.145) 0px 0px 0px 1px;
  --shadow-subtle-2: rgb(0, 0, 0) 0px 0px 0px 8px;
  --shadow-subtle-3: rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.1) 0px 1px 2px -1px;

  /* Surfaces */
  --surface-void: #000000;
  --surface-graphite: #292d30;
  --surface-surface-lift: #0b0e14;
  --surface-backdrop-blur: #000000f2;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-void-black: #000000;
  --color-graphite-hairline: #292d30;
  --color-white: #ffffff;
  --color-bone-white: #f0f0f0;
  --color-ash-gray: #a1a4a5;
  --color-smoke-gray: #abafb4;
  --color-iron: #6e727a;
  --color-charcoal: #464a4d;
  --color-iris-violet: #9281f7;
  --color-iris-violet-glow: #baa7ff;
  --color-signal-blue: #3b9eff;
  --color-sky-blue: #70b8ff;
  --color-pulse-green: #3ad389;
  --color-alarm-red: #ff9592;
  --color-crimson: #ff6465;
  --color-amber: #ffca16;
  --color-amber-glow: #ffd60a;
  --color-surface-gradient: #0b0e14;

  /* Typography */
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-domaine: 'Domaine', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-abc-favorit: 'aBC Favorit', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-commit-mono: 'Commit Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-helvetica: 'Helvetica', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-apple-system: '-apple-system', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.33;
  --text-body-sm: 14px;
  --leading-body-sm: 1.43;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-subheading: 20px;
  --leading-subheading: 1;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.5;
  --text-heading: 56px;
  --leading-heading: 1.2;
  --tracking-heading: -2.8px;
  --text-heading-lg: 77px;
  --leading-heading-lg: 1;
  --tracking-heading-lg: -0.77px;
  --text-display: 96px;
  --leading-display: 1;
  --tracking-display: -0.96px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-28: 28px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-96: 96px;
  --spacing-104: 104px;
  --spacing-144: 144px;

  /* Border Radius */
  --radius-md: 6px;
  --radius-lg: 10px;
  --radius-2xl: 16px;
  --radius-3xl: 24px;

  /* Shadows */
  --shadow-subtle: rgba(176, 199, 217, 0.145) 0px 0px 0px 1px;
  --shadow-subtle-2: rgb(0, 0, 0) 0px 0px 0px 8px;
  --shadow-subtle-3: rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.1) 0px 1px 2px -1px;
}
```
