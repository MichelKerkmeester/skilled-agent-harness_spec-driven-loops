# Aqua Voice — Style Reference
> Whisper on paper — ultra-light type resting on near-white with a single blue drop of color

**Theme:** light

Aqua speaks in a typographic whisper on near-white surfaces. PP Neue Montreal at weight 200 for headlines is the signature — text that feels etched rather than printed, gaining authority through restraint instead of volume. The palette is 99% achromatic: a paper-white canvas, a tight ladder of cool grays for text, and a single vivid sky blue that appears only as functional punctuation for the download CTA, link accents, and the tiny 'now live' dot. Surfaces are flat with hairline borders and almost imperceptible shadows; the only elevation is a millimeter of rgba(0,0,0,0.02) depth. Components are compact and utilitarian — small radii, tight padding, ghost controls — but the page breathes with generous vertical rhythm between sections. Layout centers text in wide single-column blocks rather than fighting for grid space, and a large product screenshot in a soft 20px card anchors the second screen.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Sky Signal | `#67beff` | `--color-sky-signal` | Blue action color for filled buttons, selected navigation states, and focused conversion moments |
| Electric Iris | `#4288ff` | `--color-electric-iris` | Outlined/ghost action border, inline link accent, focus rings — cooler and slightly deeper than Sky Signal |
| Paper White | `#fafbfc` | `--color-paper-white` | Page canvas, primary surface, inverted text on dark bars |
| Mist | `#f3f7fa` | `--color-mist` | Subtle band backgrounds, section alternation, elevated surface tint |
| Fog | `#f2f6fa` | `--color-fog` | Card surface, soft fill behind product screenshots |
| Linen | `#e5e8ec` | `--color-linen` | Hairline dividers, faint borders, disabled surfaces |
| Ash | `#efefef` | `--color-ash` | Ghost button background, subtle hover fill |
| Inkstone | `#292c3d` | `--color-inkstone` | Primary text, strongest contrast — carries the 200-weight headlines |
| Slate | `#3e4150` | `--color-slate` | Body text, secondary headings, dense body copy |
| Pewter | `#686a76` | `--color-pewter` | Muted body text, helper text, inactive nav |
| Graphite | `#7d7e7e` | `--color-graphite` | Tertiary text, footer links, faint labels |
| Silver | `#c2c3c8` | `--color-silver` | Placeholder text, very faint borders, decorative strokes |
| Obsidian | `#171719` | `--color-obsidian` | Top announcement bar background, dark surface, inverted text fill |
| Midnight | `#1e1e20` | `--color-midnight` | Dark card surface, secondary dark fill |

## Tokens — Typography

### sans-serif — sans-serif — detected in extracted data but not described by AI · `--font-sans-serif`
- **Weights:** 400
- **Sizes:** 12px
- **Line height:** 1.2
- **Role:** sans-serif — detected in extracted data but not described by AI

### PP Neue Montreal — Primary typeface — weight 200 for display and headlines (anti-convention; most sites use 600-700, this whisper-weight gains authority through restraint), weight 400 for body and subheadings. Custom Pangram Pangram face with Polish alternates and character variants. · `--font-pp-neue-montreal`
- **Substitute:** Inter (200, 400) or Söhne Buch
- **Weights:** 200, 400
- **Sizes:** 13px, 14px, 15px, 16px, 17px, 20px, 24px, 40px, 56px, 60px, 72px
- **Line height:** 1.00, 1.10, 1.20, 1.40, 1.50, 1.60
- **Letter spacing:** normal across all sizes — no tracking adjustment
- **OpenType features:** `"blwf" on, "cv03" on, "cv04" on, "cv09" on, "cv11" on`
- **Role:** Primary typeface — weight 200 for display and headlines (anti-convention; most sites use 600-700, this whisper-weight gains authority through restraint), weight 400 for body and subheadings. Custom Pangram Pangram face with Polish alternates and character variants.

### PP Neue Montreal — Medium cut for UI controls, buttons, nav links, and small labels where the Book weight feels too quiet to anchor interaction · `--font-pp-neue-montreal`
- **Substitute:** Inter Medium (500)
- **Weights:** 400, 500
- **Sizes:** 
- **Line height:** 1.00, 1.10, 1.20, 1.40, 1.50, 1.60
- **OpenType features:** `"blwf" on, "cv03" on, "cv04" on, "cv09" on, "cv11" on`
- **Role:** Medium cut for UI controls, buttons, nav links, and small labels where the Book weight feels too quiet to anchor interaction

### Inter — System-level fallback and small UI text — nav micro-labels, metadata, the smallest body sizes · `--font-inter`
- **Substitute:** system-ui
- **Weights:** 400, 500, 600
- **Sizes:** 10px, 11px, 12px, 20px
- **Line height:** 1.00, 1.10, 1.20, 1.40, 1.50, 1.60
- **Letter spacing:** normal
- **Role:** System-level fallback and small UI text — nav micro-labels, metadata, the smallest body sizes

### Geist Mono — Monospaced face for keyboard hints (the Hold/Space key chips), code, and technical micro-labels · `--font-geist-mono`
- **Substitute:** IBM Plex Mono, JetBrains Mono
- **Weights:** 400, 500
- **Sizes:** 11px, 13px, 14px, 18px
- **Line height:** 1.00, 1.40, 1.60
- **Role:** Monospaced face for keyboard hints (the Hold/Space key chips), code, and technical micro-labels

### IBM Plex Mono — IBM Plex Mono — detected in extracted data but not described by AI · `--font-ibm-plex-mono`
- **Weights:** 400
- **Sizes:** 10px, 13px
- **Line height:** 1.2
- **Role:** IBM Plex Mono — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 11px | 1.4 | — | `--text-caption` |
| body | 16px | 1.5 | — | `--text-body` |
| subheading | 20px | 1.4 | — | `--text-subheading` |
| heading-sm | 24px | 1.2 | — | `--text-heading-sm` |
| heading | 40px | 1.1 | — | `--text-heading` |
| heading-lg | 56px | 1.1 | — | `--text-heading-lg` |
| display | 72px | 1 | — | `--text-display` |

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
| 15 | 15px | `--spacing-15` |
| 16 | 16px | `--spacing-16` |
| 20 | 20px | `--spacing-20` |
| 24 | 24px | `--spacing-24` |
| 28 | 28px | `--spacing-28` |
| 30 | 30px | `--spacing-30` |
| 32 | 32px | `--spacing-32` |
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |
| 80 | 80px | `--spacing-80` |
| 124 | 124px | `--spacing-124` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 12-20px |
| icons | 4px |
| pills | 9999px |
| inputs | 8px |
| buttons | 8px |
| decorative | 30-70px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| subtle | `rgba(0, 0, 0, 0.02) 0px 0px 0px 2px, rgba(0, 0, 0, 0.02) ...` | `--shadow-subtle` |
| subtle-2 | `rgba(0, 0, 0, 0.02) 0px 0px 0px 1px, rgba(0, 0, 0, 0.02) ...` | `--shadow-subtle-2` |
| subtle-3 | `rgb(255, 255, 255) 0px 1px 0px 0px inset, rgba(0, 0, 0, 0...` | `--shadow-subtle-3` |
| subtle-4 | `rgba(0, 0, 0, 0.1) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0p...` | `--shadow-subtle-4` |
| subtle-5 | `rgb(52, 52, 52) 0px 1px 0px 0px inset, rgba(0, 0, 0, 0.06...` | `--shadow-subtle-5` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80-120px
- **Card padding:** 20-24px
- **Element gap:** 10px

## Components

### Announcement Bar
**Role:** Top utility strip

Full-bleed Obsidian (#171719) bar, ~40px tall, centered white text at 12px PP Neue Montreal Book, contains an inline 'Download' link underlined. Used for release announcements and live-status notices.

### Primary Navigation
**Role:** Top site nav

White background, no border or shadow. Left: wordmark 'AQUA' at 16px PP Neue Montreal Medium 500, uppercase tracking. Right: nav links (Pricing, User Guide, Blog, Changelog, API, Download iOS) at 14px weight 400 in Slate, followed by a filled CTA. Generous horizontal padding ~24px.

### Filled CTA Button
**Role:** Primary action

Sky Signal (#67beff) background, white text, 8px radius, padding 10px 16px, PP Neue Montreal Medium 500 at 14px. The only saturated fill in the system — its rarity makes it the unmistakable action signal. No border, no shadow.

### Ghost Button
**Role:** Secondary action

Transparent background, Slate (#3e4150) text at 14px weight 500, 8px radius, padding 10px 16px. No border — relies on text weight contrast to indicate interactivity. Hover: Ash (#efefef) background fill.

### Hero Headline
**Role:** Primary page headline

PP Neue Montreal Book 200, 56-72px, Inkstone (#292c3d), line-height 1.00-1.10. The ultra-light weight is the signature — headline reads as whisper rather than announcement. Left-aligned in wide single-column blocks with generous left/right breathing room.

### Key Hint Chip
**Role:** Keyboard indicator

White background, Linen (#e5e8ec) 1px border, 4px radius, padding 4px 10px, text in Geist Mono 13px weight 500 Slate. Used inline to denote keyboard keys (e.g. 'Hold', 'Space') within instructional copy.

### Product Screenshot Card
**Role:** Feature demonstration

Product UI screenshot placed inside a 20px-radius card with Fog (#f2f6fa) or Mist (#f3f7fa) background. Card has a hairline Linen (#e5e8ec) border and a barely-there shadow at rgba(0,0,0,0.02). The card sits centered below text blocks, acting as the visual anchor for each section.

### Inline Link
**Role:** Text link accent

Electric Iris (#4288ff) color, PP Neue Montreal Medium 500, underlined. No background fill — color is the only signal. Hover: same color, opacity 0.8.

### Status Dot
**Role:** Live indicator

8px diameter filled circle in Sky Signal (#67beff). Used sparingly to indicate live/active state (e.g. 'Now live on iOS'). The only place this color appears outside the filled CTA.

### Feature Section
**Role:** Content section

Centered text block on Paper White or Mist background. Subheading at 40px weight 200, supporting body at 16px weight 400 Slate, max-width ~680px, followed by a Ghost CTA. Vertical rhythm: 80-120px between sections.

### Subtle Background Pattern
**Role:** Decorative atmosphere

Very faint geometric or organic pattern overlaid on hero sections at near-white opacity. Adds texture without competing with the whisper typography. Tones in Linen or Silver.

## Do's and Don'ts

### Do
- Use weight 200 for all display and headline text in PP Neue Montreal — the ultra-light cut is the brand's visual signature.
- Use Sky Signal (#67beff) only for the filled primary CTA and the live-status dot; never extend it to backgrounds, illustrations, or decorative fills.
- Set headline line-height to 1.00-1.10 — the tight leading is essential to the whisper aesthetic and prevents the light weight from looking fragile.
- Keep card padding in the 20-24px range and radii at 12-20px; tighter and it feels cramped, wider and it competes with the generous page-level spacing.
- Use Ghost buttons (transparent + Slate text) for all secondary actions; reserve the filled Sky Signal button exclusively for the single primary action on each screen.
- Apply the hairline Linen (#e5e8ec) border pattern with rgba(0,0,0,0.02) shadow for elevated surfaces — the system uses depth in millimeters, not millimeters turned into centimeters.
- Center text blocks at max-width 680px for readability; let the surrounding negative space carry the page rhythm.

### Don't
- Do not use weights above 500 for PP Neue Montreal — the Medium 500 is already the upper bound; 600+ destroys the whisper character of the system.
- Do not add color to body copy, headings, or backgrounds beyond the Inkstone/Slate/Pewter neutral scale — chromatic text breaks the monochrome contract.
- Do not apply large or saturated shadows; the system intentionally operates at rgba(0,0,0,0.02) to rgba(0,0,0,0.1) depth only.
- Do not use pill shapes (9999px radius) for primary buttons — 8px is the button radius; pill shapes are reserved for tags and status chips.
- Do not introduce gradients, glassmorphism, or heavy blur effects — the design language is flat, matte, and paper-like.
- Do not set headline letter-spacing to negative values — PP Neue Montreal is already optically balanced; additional tracking adjustment creates inconsistency with the font's native rhythm.
- Do not use Electric Iris (#4288ff) as a fill — it is an outline/link/ghost action color only; Sky Signal owns the filled action role.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Page Canvas | `#fafbfc` | Primary background for all pages |
| 2 | Section Band | `#f3f7fa` | Alternating section tint, subtle visual rhythm |
| 3 | Card Surface | `#f2f6fa` | Product screenshot cards, elevated content blocks |
| 4 | Hover/Active Fill | `#efefef` | Ghost button hover, interactive feedback |
| 5 | Inverted Bar | `#171719` | Top announcement bar, dark accent surfaces |

## Elevation

- **Product Screenshot Card:** `0px 0px 0px 1px rgba(0,0,0,0.02), 0px 1px 1px 0.5px rgba(0,0,0,0.02), 0px 3px 3px 1.5px rgba(0,0,0,0.02), 0px 6px 6px -3px rgba(0,0,0,0.02), 0px 12px 12px -6px rgba(0,0,0,0.02), 0px 24px 24px -12px rgba(0,0,0,0.02)`
- **Elevated Panel:** `inset 0 1px 0 rgb(255,255,255), 0px 0px 0px 1px rgba(0,0,0,0.06), 0px 1px 1px 0.5px rgba(0,0,0,0.06), 0px 3px 3px 1.5px rgba(0,0,0,0.06), 0px 6px 6px -3px rgba(0,0,0,0.06), 0px 12px 12px -6px rgba(0,0,0,0.06), 0px 24px 24px -12px rgba(0,0,0,0.06)`
- **Floating Card:** `0px 0px 0px 1px rgba(0,0,0,0.1), 0px 1px 1px 0.5px rgba(0,0,0,0.1), 0px 3px 3px 1.5px rgba(0,0,0,0.1), 0px 6px 6px -3px rgba(0,0,0,0.1), 0px 12px 12px -6px rgba(0,0,0,0.1), 0px 24px 24px -12px rgba(0,0,0,0.1)`

## Imagery

Visuals are dominated by product UI screenshots displayed in rounded cards against muted backgrounds. No lifestyle photography, no stock imagery, no illustration. The only decorative visuals are very faint geometric patterns on hero sections, rendered in near-white opacity so they read as paper texture rather than graphic design. Icons are minimal and line-based, inline with text rather than standing alone.

## Layout

Full-bleed sections on a 1200px max-width centered grid. Hero is left-aligned text block at ~680px width with generous left margin, followed by centered product screenshot cards. Sections alternate between Paper White and Mist (#f3f7fa) for subtle rhythm. Vertical spacing between sections is 80-120px. Navigation is a minimal top bar with no sticky behavior, no shadow, no border — the top announcement bar provides the only dark surface contrast.

## Agent Prompt Guide

**Quick Color Reference**
- text: #292c3d (Inkstone) for headlines, #3e4150 (Slate) for body
- background: #fafbfc (Paper White) canvas, #f3f7fa (Mist) section bands
- border: #e5e8ec (Linen) hairline
- accent: #67beff (Sky Signal) — filled CTA only
- link/outline action: #4288ff (Electric Iris) — borders, ghost actions, inline links
- primary action: #67beff (filled action)

**Example Component Prompts**

1. *Hero Headline Block*: 1200px max-width container, left-aligned text at 680px width. Headline: 56px PP Neue Montreal weight 200, color #292c3d, line-height 1.10. Subtext: 16px PP Neue Montreal weight 400, color #3e4150, line-height 1.50. 80px vertical padding above and below.

2. *Filled Download CTA*: Sky Signal (#67beff) background, 8px border-radius, padding 10px 16px. Text: 14px PP Neue Montreal Medium 500, color white. No border, no shadow. Centered or right-aligned in nav bar.

3. *Ghost Secondary Button*: Transparent background, 8px border-radius, padding 10px 16px. Text: 14px PP Neue Montreal Medium 500, color #3e4150. Hover state: #efefef background fill. No border in default state.

4. *Product Screenshot Card*: Mist (#f2f6fa) or Fog (#f2f6fa) background, 20px border-radius, 1px Linen (#e5e8ec) border, padding 24px. Contains a product UI screenshot with 12px inner radius. Apply rgba(0,0,0,0.02) layered shadow stack.

5. *Key Hint Chip*: White background, 1px #e5e8ec border, 4px border-radius, padding 4px 10px. Text: 13px Geist Mono weight 500, color #3e4150. Used inline within instructional sentences to denote keyboard keys.

## Similar Brands

- **Linear** — Same near-monochrome palette with a single vivid accent (Linear's purple), ultra-clean surfaces, hairline borders, and whisper-light typography hierarchy
- **Stripe** — Similar typographic confidence with custom display faces, centered hero text blocks on white, and minimal decorative chrome — though Stripe leans more colorful
- **Notion** — Same paper-white canvas aesthetic, restrained color usage, and emphasis on generous whitespace around compact UI elements
- **Vercel** — Geist-family typography sensibility (though Aqua uses PP Neue Montreal), dark/light surface contrast via announcement bars, and minimal product UI surfaces

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-sky-signal: #67beff;
  --color-electric-iris: #4288ff;
  --color-paper-white: #fafbfc;
  --color-mist: #f3f7fa;
  --color-fog: #f2f6fa;
  --color-linen: #e5e8ec;
  --color-ash: #efefef;
  --color-inkstone: #292c3d;
  --color-slate: #3e4150;
  --color-pewter: #686a76;
  --color-graphite: #7d7e7e;
  --color-silver: #c2c3c8;
  --color-obsidian: #171719;
  --color-midnight: #1e1e20;

  /* Typography — Font Families */
  --font-sans-serif: 'sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-pp-neue-montreal: 'PP Neue Montreal', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-geist-mono: 'Geist Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-ibm-plex-mono: 'IBM Plex Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 11px;
  --leading-caption: 1.4;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-subheading: 20px;
  --leading-subheading: 1.4;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.2;
  --text-heading: 40px;
  --leading-heading: 1.1;
  --text-heading-lg: 56px;
  --leading-heading-lg: 1.1;
  --text-display: 72px;
  --leading-display: 1;

  /* Typography — Weights */
  --font-weight-extralight: 200;
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-6: 6px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-15: 15px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-28: 28px;
  --spacing-30: 30px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-80: 80px;
  --spacing-124: 124px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80-120px;
  --card-padding: 20-24px;
  --element-gap: 10px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-2xl-2: 20px;
  --radius-3xl: 30px;
  --radius-3xl-2: 40px;
  --radius-full: 50px;
  --radius-full-2: 62px;
  --radius-full-3: 70px;
  --radius-full-4: 110px;
  --radius-full-5: 9999px;
  --radius-full-6: 99999px;

  /* Named Radii */
  --radius-cards: 12-20px;
  --radius-icons: 4px;
  --radius-pills: 9999px;
  --radius-inputs: 8px;
  --radius-buttons: 8px;
  --radius-decorative: 30-70px;

  /* Shadows */
  --shadow-subtle: rgba(0, 0, 0, 0.02) 0px 0px 0px 2px, rgba(0, 0, 0, 0.02) 0px 1px 1px 0.5px, rgba(0, 0, 0, 0.02) 0px 3px 3px 1.5px, rgba(0, 0, 0, 0.02) 0px 6px 6px -3px, rgba(0, 0, 0, 0.02) 0px 12px 12px -6px, rgba(0, 0, 0, 0.02) 0px 24px 24px -12px;
  --shadow-subtle-2: rgba(0, 0, 0, 0.02) 0px 0px 0px 1px, rgba(0, 0, 0, 0.02) 0px 1px 1px 0.5px, rgba(0, 0, 0, 0.02) 0px 3px 3px 1.5px, rgba(0, 0, 0, 0.02) 0px 6px 6px -3px, rgba(0, 0, 0, 0.02) 0px 12px 12px -6px, rgba(0, 0, 0, 0.02) 0px 24px 24px -12px;
  --shadow-subtle-3: rgb(255, 255, 255) 0px 1px 0px 0px inset, rgba(0, 0, 0, 0.06) 0px 0px 0px 1px, rgba(0, 0, 0, 0.06) 0px 1px 1px 0.5px, rgba(0, 0, 0, 0.06) 0px 3px 3px 1.5px, rgba(0, 0, 0, 0.06) 0px 6px 6px -3px, rgba(0, 0, 0, 0.06) 0px 12px 12px -6px, rgba(0, 0, 0, 0.06) 0px 24px 24px -12px;
  --shadow-subtle-4: rgba(0, 0, 0, 0.1) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 1px 1px 0.5px, rgba(0, 0, 0, 0.1) 0px 3px 3px 1.5px, rgba(0, 0, 0, 0.1) 0px 6px 6px -3px, rgba(0, 0, 0, 0.1) 0px 12px 12px -6px, rgba(0, 0, 0, 0.1) 0px 24px 24px -12px;
  --shadow-subtle-5: rgb(52, 52, 52) 0px 1px 0px 0px inset, rgba(0, 0, 0, 0.06) 0px 0px 0px 1px, rgba(0, 0, 0, 0.06) 0px 1px 1px 0.5px, rgba(0, 0, 0, 0.06) 0px 3px 3px 1.5px, rgba(0, 0, 0, 0.06) 0px 6px 6px -3px, rgba(0, 0, 0, 0.06) 0px 12px 12px -6px, rgba(0, 0, 0, 0.06) 0px 24px 24px -12px;

  /* Surfaces */
  --surface-page-canvas: #fafbfc;
  --surface-section-band: #f3f7fa;
  --surface-card-surface: #f2f6fa;
  --surface-hoveractive-fill: #efefef;
  --surface-inverted-bar: #171719;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-sky-signal: #67beff;
  --color-electric-iris: #4288ff;
  --color-paper-white: #fafbfc;
  --color-mist: #f3f7fa;
  --color-fog: #f2f6fa;
  --color-linen: #e5e8ec;
  --color-ash: #efefef;
  --color-inkstone: #292c3d;
  --color-slate: #3e4150;
  --color-pewter: #686a76;
  --color-graphite: #7d7e7e;
  --color-silver: #c2c3c8;
  --color-obsidian: #171719;
  --color-midnight: #1e1e20;

  /* Typography */
  --font-sans-serif: 'sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-pp-neue-montreal: 'PP Neue Montreal', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-geist-mono: 'Geist Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-ibm-plex-mono: 'IBM Plex Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 11px;
  --leading-caption: 1.4;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-subheading: 20px;
  --leading-subheading: 1.4;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.2;
  --text-heading: 40px;
  --leading-heading: 1.1;
  --text-heading-lg: 56px;
  --leading-heading-lg: 1.1;
  --text-display: 72px;
  --leading-display: 1;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-6: 6px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-15: 15px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-28: 28px;
  --spacing-30: 30px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-80: 80px;
  --spacing-124: 124px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-2xl-2: 20px;
  --radius-3xl: 30px;
  --radius-3xl-2: 40px;
  --radius-full: 50px;
  --radius-full-2: 62px;
  --radius-full-3: 70px;
  --radius-full-4: 110px;
  --radius-full-5: 9999px;
  --radius-full-6: 99999px;

  /* Shadows */
  --shadow-subtle: rgba(0, 0, 0, 0.02) 0px 0px 0px 2px, rgba(0, 0, 0, 0.02) 0px 1px 1px 0.5px, rgba(0, 0, 0, 0.02) 0px 3px 3px 1.5px, rgba(0, 0, 0, 0.02) 0px 6px 6px -3px, rgba(0, 0, 0, 0.02) 0px 12px 12px -6px, rgba(0, 0, 0, 0.02) 0px 24px 24px -12px;
  --shadow-subtle-2: rgba(0, 0, 0, 0.02) 0px 0px 0px 1px, rgba(0, 0, 0, 0.02) 0px 1px 1px 0.5px, rgba(0, 0, 0, 0.02) 0px 3px 3px 1.5px, rgba(0, 0, 0, 0.02) 0px 6px 6px -3px, rgba(0, 0, 0, 0.02) 0px 12px 12px -6px, rgba(0, 0, 0, 0.02) 0px 24px 24px -12px;
  --shadow-subtle-3: rgb(255, 255, 255) 0px 1px 0px 0px inset, rgba(0, 0, 0, 0.06) 0px 0px 0px 1px, rgba(0, 0, 0, 0.06) 0px 1px 1px 0.5px, rgba(0, 0, 0, 0.06) 0px 3px 3px 1.5px, rgba(0, 0, 0, 0.06) 0px 6px 6px -3px, rgba(0, 0, 0, 0.06) 0px 12px 12px -6px, rgba(0, 0, 0, 0.06) 0px 24px 24px -12px;
  --shadow-subtle-4: rgba(0, 0, 0, 0.1) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 1px 1px 0.5px, rgba(0, 0, 0, 0.1) 0px 3px 3px 1.5px, rgba(0, 0, 0, 0.1) 0px 6px 6px -3px, rgba(0, 0, 0, 0.1) 0px 12px 12px -6px, rgba(0, 0, 0, 0.1) 0px 24px 24px -12px;
  --shadow-subtle-5: rgb(52, 52, 52) 0px 1px 0px 0px inset, rgba(0, 0, 0, 0.06) 0px 0px 0px 1px, rgba(0, 0, 0, 0.06) 0px 1px 1px 0.5px, rgba(0, 0, 0, 0.06) 0px 3px 3px 1.5px, rgba(0, 0, 0, 0.06) 0px 6px 6px -3px, rgba(0, 0, 0, 0.06) 0px 12px 12px -6px, rgba(0, 0, 0, 0.06) 0px 24px 24px -12px;
}
```
