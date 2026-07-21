# Trigger.dev — Style Reference
> Charging terminal on slate. The interface is a dimly lit workstation where one lime LED signals activity against rows of quiet monospaced text and faint violet syntax glow.

**Theme:** dark

Trigger.dev's visual system is a dark-mode developer terminal transplanted into a marketing surface: matte charcoal canvas, Geist's quiet technical voice for body and UI, and Satoshi's geometric precision stretched to display scale with generous tracking. A single electric lime (#a8ff53) carries the brand's signal — it lives in the logo glyph, the primary nav button, and feature pills, giving the whole interface a charging-light quality against the dark. The rest of the chromatic vocabulary is a syntax-highlighting palette (pinks, violets, soft greens) borrowed from code editors, applied to feature icons and inline code so the site visually rhymes with the TypeScript it asks you to write. Surfaces stay flat and low-contrast; depth comes from 1px hairlines and the gradient stack, not from drop shadows.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Slate Canvas | `#1c1e21` | `--color-slate-canvas` | Primary page background, hero canvas, card surface base — the workspace floor everything sits on |
| Ink Well | `#121317` | `--color-ink-well` | Deepest surface — code block backgrounds, terminal panes, inset containers that need to feel recessed below the canvas |
| Graphite Hairline | `#3b3e45` | `--color-graphite-hairline` | Subtle borders, divider lines, card edges — barely visible separators that let density carry the visual structure |
| Steel Border | `#272a2e` | `--color-steel-border` | Slightly darker hairline for nested containers and secondary borders where Graphite feels too bright |
| Ash Text | `#b5b8c0` | `--color-ash-text` | Tertiary text, captions, muted helper copy — text that should be readable but not competing with headlines |
| Fog Text | `#878c99` | `--color-fog-text` | Secondary body text, metadata, icon strokes — the most-used neutral text color, reading as a soft graphite on slate |
| Cloud Text | `#d7d9dd` | `--color-cloud-text` | Secondary headings, button text, emphasized body — one step below full white, used where pure white would feel harsh |
| Bone Text | `#e5e7eb` | `--color-bone-text` | Primary text, headlines, high-contrast labels — the dominant foreground color against the slate canvas |
| Signal Lime | `#a8ff53` | `--color-signal-lime` | Green supporting accent for decorative details and low-frequency emphasis. Do not promote it to the primary CTA color |
| Syntax Violet | `#9c9af2` | `--color-syntax-violet` | Code syntax highlighting (functions, keywords), media generation feature icon — the most-used chromatic color after lime, giving the code blocks their editor feel |
| Syntax Pink | `#fa3abf` | `--color-syntax-pink` | Code syntax (strings, special tokens), media processing feature icon — hot accent used sparingly for code punctuation |
| Event Violet | `#7655fd` | `--color-event-violet` | Headline highlight words, streaming feature icon, decorative gradient accent — slightly deeper violet for larger surfaces |
| Loop Green | `#afec73` | `--color-loop-green` | Code syntax (types, booleans), inline emphasis text — softer green that sits between Signal Lime and Ash, used inside code contexts |
| Key Lime | `#d9f07c` | `--color-key-lime` | Code syntax (variables, parameters) — the lightest green, reads almost yellow against dark, used for code identifiers |
| Tag Magenta | `#e888f8` | `--color-tag-magenta` | Code syntax (property names, tags) — gentle pink for object keys and JSX attributes |
| Mute Red | `#f43f5e` | `--color-mute-red` | Red supporting accent for decorative details and low-frequency emphasis. Use as a supporting accent, not as a status color |

## Tokens — Typography

### Satoshi — Display and heading — Satoshi carries every headline from 16px sub-labels up to the 60px hero. Weight 500 is the default for most headings; 600 appears on the hero. Letter-spacing pushes open at 0.05em on the largest sizes, giving headlines a spaced-out editorial feel that contrasts Geist's tightness. This is the brand's voice at scale. · `--font-satoshi`
- **Substitute:** General Sans, Switzer, or Inter (with tracking adjustments)
- **Weights:** 500, 600
- **Sizes:** 16, 18, 20, 24, 30, 36, 48, 60px
- **Line height:** 1.00, 1.11, 1.20, 1.33, 1.38, 1.40, 1.50, 1.56
- **Letter spacing:** 0.025em at 20-30px, 0.05em at 36-60px
- **Role:** Display and heading — Satoshi carries every headline from 16px sub-labels up to the 60px hero. Weight 500 is the default for most headings; 600 appears on the hero. Letter-spacing pushes open at 0.05em on the largest sizes, giving headlines a spaced-out editorial feel that contrasts Geist's tightness. This is the brand's voice at scale.

### Geist — Body, navigation, buttons, links, UI labels — Geist is the workhorse that keeps the interface legible. Weight 400 for body, 500 for buttons and active nav, 300 for the lightest body or large paragraph copy. Normal letter-spacing. Its grotesque neutrality is intentional — it lets Satoshi speak at display scale and code syntax speak in the editor. · `--font-geist`
- **Substitute:** Inter, Geist (open source), or Söhne
- **Weights:** 300, 400, 500
- **Sizes:** 14, 16, 18, 20px
- **Line height:** 1.40, 1.43, 1.50, 1.56, 1.71
- **Role:** Body, navigation, buttons, links, UI labels — Geist is the workhorse that keeps the interface legible. Weight 400 for body, 500 for buttons and active nav, 300 for the lightest body or large paragraph copy. Normal letter-spacing. Its grotesque neutrality is intentional — it lets Satoshi speak at display scale and code syntax speak in the editor.

### Geist Mono — Code blocks, inline code, terminal output, log lines — Geist Mono is locked at 14px, the code face that appears in the embedded TypeScript examples and any monospaced UI text. Its presence signals 'this is real, runnable code' and bridges the marketing site to the developer product. · `--font-geist-mono`
- **Substitute:** JetBrains Mono, Berkeley Mono, or IBM Plex Mono
- **Weights:** 300, 400
- **Sizes:** 14px
- **Line height:** 1.43
- **Role:** Code blocks, inline code, terminal output, log lines — Geist Mono is locked at 14px, the code face that appears in the embedded TypeScript examples and any monospaced UI text. Its presence signals 'this is real, runnable code' and bridges the marketing site to the developer product.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 14px | 1.43 | — | `--text-caption` |
| body | 16px | 1.56 | — | `--text-body` |
| body-lg | 18px | 1.5 | — | `--text-body-lg` |
| subheading | 20px | 1.4 | 0.4px | `--text-subheading` |
| heading-sm | 24px | 1.38 | — | `--text-heading-sm` |
| heading | 30px | 1.33 | — | `--text-heading` |
| heading-lg | 36px | 1.2 | 1.8px | `--text-heading-lg` |
| display | 48px | 1.11 | 2.4px | `--text-display` |
| hero | 60px | 1 | 3px | `--text-hero` |

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
| 28 | 28px | `--spacing-28` |
| 32 | 32px | `--spacing-32` |
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |
| 64 | 64px | `--spacing-64` |
| 96 | 96px | `--spacing-96` |
| 160 | 160px | `--spacing-160` |
| 192 | 192px | `--spacing-192` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 4px |
| pills | 9999px |
| inputs | 4px |
| buttons | 4px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80-120px
- **Card padding:** 24-32px
- **Element gap:** 8-16px

## Components

### Primary CTA Button (Lime Fill)
**Role:** Main conversion action — 'Get started', 'Start building now'

Background #a8ff53 (Signal Lime), text #121317 (Ink Well), 4px radius, 12px 16px padding, Geist 500 at 16px. No border. The lime fill on dark text creates maximum contrast (13.6:1 AAA). This is the only filled button in the system.

### Ghost Nav Button
**Role:** Secondary navigation action — 'Login'

Transparent background, text #d7d9dd (Cloud), 4px radius, 10px 14px padding, Geist 400. No border, no background fill. On hover, text shifts to #e5e7eb (Bone).

### Nav Link Item
**Role:** Top navigation items — 'How it works', 'Product', 'Pricing'

Transparent background, text #d7d9dd (Cloud), 14px Geist 400, 4px radius. No background fill, no border. On hover or active state, text becomes #e5e7eb (Bone).

### GitHub Star Badge
**Role:** Repository link with star count in nav

Transparent background, text #d7d9dd, 4px radius. Includes a GitHub icon and star count. The '14.3k' count is displayed as inline Geist 400 text.

### Feature Pill
**Role:** Category tag pills at page bottom — 'AI agents', 'Media processing', 'Run Python'

Transparent or subtly tinted background, text #e5e7eb, 9999px radius (full pill), 4px 10px padding, 14px Geist 400. Each pill has a small chromatic icon (violet, pink, green, etc.) to the left of the label. The pill shape and colorful iconography is the signature of this component.

### Hero Headline
**Role:** Primary page headline

Satoshi 500 at 60px, line-height 1.00, letter-spacing 3px (0.05em), color #e5e7eb. Centered, single-line where possible. The 3px tracking at this size is distinctive — it gives the headline an editorial, almost billboard quality.

### Hero Subtext
**Role:** Supporting paragraph below hero headline

Geist 400 at 18px, line-height 1.50, color #878c99 (Fog). Max-width ~600px, centered. Sets the muted, readable tone for descriptive copy.

### Code Editor Pane
**Role:** Embedded TypeScript code block in the hero/feature sections

Background #121317 (Ink Well), 4px radius, optional 1px border #272a2e. Contains Geist Mono at 14px with syntax highlighting: keywords in #9c9af2 (Syntax Violet), strings in #fa3abf (Syntax Pink), types/booleans in #afec73 (Loop Green), variables in #d9f07c (Key Lime), property names in #e888f8 (Tag Magenta), comments and default text in #878c99 (Fog). The code surface is a full UI element, not decoration.

### Testimonial Card
**Role:** Customer quote in 'Loved by developers' section

Background #1c1e21 (Canvas), 1px border #272a2, 4px radius, 24-32px padding. Body text in #e5e7eb (Bone) at 16px Geist 400. Customer name in #d7d9dd (Cloud), company and 'Read story' link in #878c99 (Fog). Avatar (small circular image) and optional company logo on the right. No shadow — the hairline border is the only delimiter.

### Logo Strip Item
**Role:** Company logos in social proof band

Display company logos in #b5b8c0 (Ash) or grayscale, rendered at uniform height. Section background is canvas, logos are centered in a single row with consistent horizontal spacing (32-48px gap). No card or border treatment — the logos float on the canvas.

### Video Embed Trigger
**Role:** 'Play' / 'Replay' / 'Full screen' controls in embedded media

Ghost button style — transparent background, text #d7d9dd, 14px Geist 400. Play icon is a small triangle in #e5e7eb. Controls align right with 12px gap between items.

### Section Divider
**Role:** Visual separator between page sections

1px horizontal line in #272a2 (Steel Border), full width or max-width contained. Sometimes replaced by 80-120px vertical gap alone (seamless flow). No decorative shapes.

### Brand Logo Lockup
**Role:** Trigger.dev wordmark in header

Geist 600 at ~20px. 'Trigger' in #e5e7eb (Bone), preceded by a lime-green triangle/play icon in #a8ff53 (Signal Lime). The colored mark is the brand's most recognizable element.

## Do's and Don'ts

### Do
- Use Signal Lime (#a8ff53) as the only filled accent surface — it is the charging light, not decoration
- Set headlines in Satoshi with 0.05em tracking at 36px and above; this spaced-out quality is the brand's editorial voice
- Use Geist Mono at exactly 14px for all code; do not scale it up for display
- Render code blocks on Ink Well (#121317) so they read as recessed editor panes against the canvas
- Apply the syntax palette (violet, pink, two greens) only inside code contexts and feature icons — never on body text or backgrounds
- Keep surface depth to two levels (canvas + ink well) with 1px graphite hairlines; avoid drop shadows
- Use 4px radius for all rectangular components and 9999px only for pill-shaped elements like feature tags

### Don't
- Do not use drop shadows or floating cards — depth comes from surface contrast and hairlines only
- Do not apply Signal Lime to large backgrounds or decorative shapes; it is a small, charged accent, not a wash
- Do not mix the syntax palette into non-code text — these colors are for code and icons, not body copy
- Do not use the chromatic accent colors as button fills; all action buttons use either Signal Lime (primary) or ghost/neutral (secondary)
- Do not set body text below 14px or use line-height tighter than 1.40 — Geist needs room to breathe at small sizes
- Do not introduce new neutrals; the scale runs from #121317 (Ink) through #1c1e21 (Canvas) to #e5e7eb (Bone) with four intermediate grays — that's the full range
- Do not use rounded corners above 4px on rectangular components; the system is deliberately tight, not soft

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas | `#1c1e21` | Page background — the dominant dark surface |
| 1 | Inset | `#121317` | Code blocks, terminal panes, recessed containers |
| 2 | Card | `#1c1e21` | Testimonial cards, feature cards — sit on the canvas with hairline borders for definition |
| 3 | Accent | `#a8ff53` | Primary CTA surface, active indicators, logo mark |

## Elevation

- **Primary CTA button:** `0 0 0 1px rgba(168, 255, 83, 0.15) inset`
- **Card hover:** `border-color transitions from #272a2 to #3b3e45, no shadow change`

## Imagery

The site is text- and code-dominant, not photography-led. The primary visual is the embedded TypeScript code editor (Ink Well background, multi-color syntax highlighting) which functions as both product demonstration and decorative asset. Feature pills at the page footer use small chromatic icons (2-3px stroke, filled style) in violet, pink, green, and yellow to create color rhythm without imagery. Customer testimonials include small circular avatars and grayscale company logos rendered in a uniform row. There is no lifestyle photography, no hero illustration, no 3D rendering — the visual weight comes from type hierarchy, code blocks, and the lime accent. The overall density is text-forward: code and copy do the work that images would do on a consumer product site.

## Layout

The page is a single centered column at max-width 1200px with full-bleed dark canvas. The hero is a centered text stack: large Satoshi headline (60px, 0.05em tracking), muted Geist subtext, and a lime CTA with an inline link — all vertically centered in a tall viewport. Below the fold, a two-column section pairs a left-aligned code editor (Ink Well surface, ~50% width) with right-aligned descriptive copy and a ghost CTA. A horizontal logo strip with 'Trusted by developers' caption breaks the rhythm. The testimonials section uses a three-column card grid with consistent 24px gutters. Feature pills run as a single horizontal row at the page foot. Section gaps are 80-120px of vertical breathing room — generous but not airy. Navigation is a sticky top bar with left-aligned logo, centered links, and right-aligned actions (GitHub, star count, login, lime CTA).

## Agent Prompt Guide

**Quick Color Reference**
- text: #e5e7eb (primary), #d7d9dd (secondary), #878c99 (tertiary), #b5b8c0 (muted)
- background: #1c1e21 (canvas), #121317 (code blocks)
- border: #272a2e (subtle), #3b3e45 (emphasis)
- accent: #a8ff53 (Signal Lime — logo mark, feature icons, active states)
- primary action: no distinct CTA color

**Example Component Prompts**
1. *Hero headline*: 60px Satoshi weight 500, #e5e7eb, letter-spacing 3px, line-height 1.00, centered. Below it, 18px Geist weight 400, #878c99, max-width 600px, centered.
No distinct primary action color was observed; use the extracted neutral button treatments instead of inventing a filled CTA color.
3. *Code block*: #121317 background, 4px radius, 1px #272a2e border. Inside, Geist Mono 14px with: keywords in #9c9af2, strings in #fa3abf, types in #afec73, variable names in #d9f07c, property keys in #e888f8, default text in #878c99.
4. *Testimonial card*: #1c1e21 background, 1px #272a2e border, 4px radius, 28px padding. 16px Geist 400 quote in #e5e7eb. Customer name in #d7d9dd, 'Read story →' link in #878c99 with an arrow in #fa3abf.
5. *Feature pill*: transparent background, 9999px radius, 4px 10px padding, 14px Geist 400 in #e5e7eb. Small 12px icon to the left in a chromatic accent (violet #9c9af2 for 'AI agents', pink #fa3abf for 'Media processing', green #a8ff53 for 'Run Python').

## Similar Brands

- **Vercel** — Same dark canvas with single-color accent strategy, Satoshi/Geist-class grotesks for body, and a terminal-adjacent developer aesthetic — though Vercel uses white-on-black minimalism where Trigger.dev uses lime pop
- **Linear** — Shared commitment to tight 4px radii, hairline borders over shadows, and dark-mode-first surfaces — both treat the interface as a tool surface, not a marketing canvas
- **Railway** — Similar syntax-highlighting-as-branding approach with multiple chromatic accents scattered across feature pills and code blocks, creating color rhythm without decoration
- **Inngest** — Direct competitor in the workflow/background-jobs space with the same dark canvas, code-forward hero, and developer-terminal visual language
- **Resend** — Matches the dark-mode developer marketing pattern with Geist-family body type, prominent code blocks in the hero, and a single saturated brand color as the only filled accent

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-slate-canvas: #1c1e21;
  --color-ink-well: #121317;
  --color-graphite-hairline: #3b3e45;
  --color-steel-border: #272a2e;
  --color-ash-text: #b5b8c0;
  --color-fog-text: #878c99;
  --color-cloud-text: #d7d9dd;
  --color-bone-text: #e5e7eb;
  --color-signal-lime: #a8ff53;
  --color-syntax-violet: #9c9af2;
  --color-syntax-pink: #fa3abf;
  --color-event-violet: #7655fd;
  --color-loop-green: #afec73;
  --color-key-lime: #d9f07c;
  --color-tag-magenta: #e888f8;
  --color-mute-red: #f43f5e;

  /* Typography — Font Families */
  --font-satoshi: 'Satoshi', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-geist: 'Geist', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-geist-mono: 'Geist Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.43;
  --text-body: 16px;
  --leading-body: 1.56;
  --text-body-lg: 18px;
  --leading-body-lg: 1.5;
  --text-subheading: 20px;
  --leading-subheading: 1.4;
  --tracking-subheading: 0.4px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.38;
  --text-heading: 30px;
  --leading-heading: 1.33;
  --text-heading-lg: 36px;
  --leading-heading-lg: 1.2;
  --tracking-heading-lg: 1.8px;
  --text-display: 48px;
  --leading-display: 1.11;
  --tracking-display: 2.4px;
  --text-hero: 60px;
  --leading-hero: 1;
  --tracking-hero: 3px;

  /* Typography — Weights */
  --font-weight-light: 300;
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-28: 28px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-96: 96px;
  --spacing-160: 160px;
  --spacing-192: 192px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80-120px;
  --card-padding: 24-32px;
  --element-gap: 8-16px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-full: 9999px;

  /* Named Radii */
  --radius-cards: 4px;
  --radius-pills: 9999px;
  --radius-inputs: 4px;
  --radius-buttons: 4px;

  /* Surfaces */
  --surface-canvas: #1c1e21;
  --surface-inset: #121317;
  --surface-card: #1c1e21;
  --surface-accent: #a8ff53;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-slate-canvas: #1c1e21;
  --color-ink-well: #121317;
  --color-graphite-hairline: #3b3e45;
  --color-steel-border: #272a2e;
  --color-ash-text: #b5b8c0;
  --color-fog-text: #878c99;
  --color-cloud-text: #d7d9dd;
  --color-bone-text: #e5e7eb;
  --color-signal-lime: #a8ff53;
  --color-syntax-violet: #9c9af2;
  --color-syntax-pink: #fa3abf;
  --color-event-violet: #7655fd;
  --color-loop-green: #afec73;
  --color-key-lime: #d9f07c;
  --color-tag-magenta: #e888f8;
  --color-mute-red: #f43f5e;

  /* Typography */
  --font-satoshi: 'Satoshi', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-geist: 'Geist', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-geist-mono: 'Geist Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.43;
  --text-body: 16px;
  --leading-body: 1.56;
  --text-body-lg: 18px;
  --leading-body-lg: 1.5;
  --text-subheading: 20px;
  --leading-subheading: 1.4;
  --tracking-subheading: 0.4px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.38;
  --text-heading: 30px;
  --leading-heading: 1.33;
  --text-heading-lg: 36px;
  --leading-heading-lg: 1.2;
  --tracking-heading-lg: 1.8px;
  --text-display: 48px;
  --leading-display: 1.11;
  --tracking-display: 2.4px;
  --text-hero: 60px;
  --leading-hero: 1;
  --tracking-hero: 3px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-28: 28px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-96: 96px;
  --spacing-160: 160px;
  --spacing-192: 192px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-full: 9999px;
}
```
