# Bun — Style Reference
> Hot pink cursor in a midnight terminal — every interface element is either prose or code, and the pink tells you what to click.

**Theme:** dark

Bun's design language is a dark, developer-first aesthetic that treats the terminal as a design surface. The interface lives in near-black depths (#0d0e11) with elevated cards floating at #14151a and #1e2028, creating subtle depth without shadows. A single hot pink accent (#f472b6) cuts through the monochrome like a syntax highlighter cursor — it marks every primary action, highlights the fast word in headlines, and outlines code blocks, making interactive elements instantly scannable against the quiet background. Typography is utilitarian: system-ui for everything readable, JetBrains Mono for everything executable. Headlines are large and tight-tracked, body copy is generous and unembellished, and the visual rhythm alternates between prose sections and terminal-style code blocks. The overall feel is developer-tool meets brutalist poster — confident, slightly irreverent, and obsessed with speed.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Void | `#0d0e11` | `--color-void` | Page canvas, hero backgrounds, deepest surface layer |
| Obsidian | `#14151a` | `--color-obsidian` | Card surfaces, elevated panels, code block backgrounds |
| Graphite | `#1e2028` | `--color-graphite` | Secondary card surfaces, hover states, nested panels |
| Iron | `#282a36` | `--color-iron` | Borders, dividers, subtle separators, table lines |
| Steel | `#3a3a3f` | `--color-steel` | Stronger borders, input outlines, card edges |
| Slate | `#3b3f4b` | `--color-slate` | Icon strokes, secondary borders, button outlines |
| Pewter | `#4f5666` | `--color-pewter` | Muted text, inactive labels, tertiary content |
| Fog | `#6b7280` | `--color-fog` | Secondary text, descriptions, helper text |
| Ash | `#9ca3af` | `--color-ash` | Tertiary text, captions, metadata |
| Bone | `#d1d5db` | `--color-bone` | Light secondary text, subtle emphasis |
| Pearl | `#e5e7eb` | `--color-pearl` | Near-white text, icon fills, high-contrast labels |
| Paper | `#ffffff` | `--color-paper` | Primary text, logo marks, maximum contrast headings |
| Bun Pink | `#f472b6` | `--color-bun-pink` | Red supporting accent for decorative details and low-frequency emphasis. Do not promote it to the primary CTA color |
| Magenta Core | `#ec4899` | `--color-magenta-core` | Hover states on pink CTAs, gradient endpoint for headlines, emphasis text |
| Rose Petal | `#f9a8d4` | `--color-rose-petal` | Light pink backgrounds for tags, soft highlights, gradient midpoint |
| Blush | `#fbcfe8` | `--color-blush` | Softest pink for background washes, subtle pink tints |
| Wine | `#3d1629` | `--color-wine` | Pink-tinted borders for highlighted sections, badge outlines |
| Plum | `#3f1f33` | `--color-plum` | Deep pink-tinted backgrounds for active states or featured panels |
| Violet | `#a855f7` | `--color-violet` | Decorative accent, gradient endpoint, illustration highlights |
| Lavender | `#c084fc` | `--color-lavender` | Headline gradient, icon accents, link hover states |
| Lilac | `#d8b4fe` | `--color-lilac` | Soft violet text, gradient midpoint, subtle highlights |
| Cyan | `#06b6d4` | `--color-cyan` | Code syntax highlighting, tool accent for Postgres/data features |
| Amber | `#e67e22` | `--color-amber` | Code syntax highlighting, tool accent for runtime features, warm contrast |
| Gold | `#facc15` | `--color-gold` | Code syntax highlighting, test runner badge accent, attention markers |
| Mint | `#34d399` | `--color-mint` | Green supporting accent for decorative details and low-frequency emphasis. Use as a supporting accent, not as a status color |

## Tokens — Typography

### system-ui — Primary typeface for all prose, headings, navigation, buttons, and UI text. The full weight range (300–800) gives the system flexibility from whisper-light display headings to bold section labels. Large display sizes (48–60px) carry headline weight, while 16–18px holds body copy at a comfortable reading rhythm. · `--font-system-ui`
- **Substitute:** Inter, -apple-system, Segoe UI, Roboto
- **Weights:** 300, 400, 500, 600, 700, 800
- **Sizes:** 12, 13, 14, 16, 18, 20, 21, 24, 48, 53, 60
- **Line height:** 1.0–1.85
- **Letter spacing:** normal at body sizes; tight tracking on display headlines (–0.02em at 48–60px)
- **OpenType features:** `"kern" on`
- **Role:** Primary typeface for all prose, headings, navigation, buttons, and UI text. The full weight range (300–800) gives the system flexibility from whisper-light display headings to bold section labels. Large display sizes (48–60px) carry headline weight, while 16–18px holds body copy at a comfortable reading rhythm.

### JetBrains Mono — Monospace companion for all executable content: code blocks, terminal commands, file paths, version strings, package names. Tight line-height (1.11) at smaller sizes keeps code dense and scannable. The 500/600 weights are used for emphasis inside code, not body text. · `--font-jetbrains-mono`
- **Substitute:** Fira Code, IBM Plex Mono, Menlo, Consolas
- **Weights:** 400, 500, 600, 700
- **Sizes:** 12, 13, 14, 16, 18, 19
- **Line height:** 1.11–1.63
- **OpenType features:** `"kern"`
- **Role:** Monospace companion for all executable content: code blocks, terminal commands, file paths, version strings, package names. Tight line-height (1.11) at smaller sizes keeps code dense and scannable. The 500/600 weights are used for emphasis inside code, not body text.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.5 | — | `--text-caption` |
| body-sm | 14px | 1.56 | — | `--text-body-sm` |
| body | 16px | 1.63 | — | `--text-body` |
| body-lg | 18px | 1.78 | — | `--text-body-lg` |
| subheading | 20px | 1.4 | — | `--text-subheading` |
| heading-sm | 24px | 1.33 | — | `--text-heading-sm` |
| heading | 48px | 1.2 | — | `--text-heading` |
| display | 60px | 1 | -1.2px | `--text-display` |

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
| 36 | 36px | `--spacing-36` |
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |
| 64 | 64px | `--spacing-64` |
| 80 | 80px | `--spacing-80` |
| 96 | 96px | `--spacing-96` |
| 120 | 120px | `--spacing-120` |
| 128 | 128px | `--spacing-128` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 8px |
| icons | 4px |
| badges | 9999px |
| inputs | 8px |
| buttons | 9999px |
| codeBlocks | 8px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| xl | `rgba(0, 0, 0, 0.25) 0px 25px 50px -12px` | `--shadow-xl` |
| md | `rgba(131, 24, 67, 0.1) 0px 10px 15px -3px, rgba(131, 24, ...` | `--shadow-md` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 64-96px
- **Card padding:** 24-32px
- **Element gap:** 16px

## Components

### Primary CTA Button
**Role:** Single dominant action on any page — 'Build', 'Get started', primary install trigger

Pill-shaped (9999px radius), 32px height, 16px horizontal padding. Background: #f472b6. Text: #ffffff, system-ui 14px weight 500. No border. On hover: shifts to #ec4899. Sits boldly against the dark canvas — this is the one element that should demand attention.

### Ghost Navigation Button
**Role:** Secondary nav items: Docs, Reference, Guides, Blog, Discord

No background, no border. Text: #ffffff or #e5e7eb, system-ui 14px weight 500. On hover: text shifts to #f472b6. Minimal weight — the logo and active 'Build' pill do the heavy lifting.

### Tab Pill Navigation
**Role:** Switching between tool views (Bundler, Express, Postgres, WebSockets) in the hero comparison panel

Pill-shaped (9999px radius), 32px height, 16px horizontal padding. Inactive state: transparent background, #9ca3af text. Active state: #f472b6 background, #ffffff text. The pink fill on the active tab is the only color in the comparison panel, making the selected tool obvious.

### Feature Card
**Role:** Grid cards in the 'Four tools' section — JavaScript Runtime, Package Manager, Test Runner, Bundler

8px radius, background #14151a, 1px border #282a36. Padding 24-32px. Contains: title in system-ui 20px weight 600 white, a colored 'REPLACES' badge in top-right corner, a code snippet at top (#ec4899 text in #1e2028 inset box), description text in #9ca3af, and a two-column feature list with #34d399 checkmarks. No shadow — depth comes from the border and surface color difference.

### Tool "REPLACES" Badge
**Role:** Decorative sticker in feature card corners — REPLACES Node.js, REPLACES NPM, etc.

Starburst/jagged shape, 12-16px text, varied accent colors per tool (pink #f472b6 for Runtime, blue #06b6d4 for Package Manager, yellow #facc15 for Test Runner, violet #a855f7 for Bundler). This color-coding creates instant visual mapping between the four tools.

### Install Command Box
**Role:** Prominent terminal-style code block for installation instructions

8px radius, background #14151a, 2px solid #f472b6 border (the pink border is the signature — no other code block gets this treatment). Interior: JetBrains Mono 14px, #e5e7eb text, with the command highlighted in #f472b6. Copy icon button on the right. Full-width within its container, with platform tabs (Linux & macOS / Windows / View install script) above it.

### Code Block (Standard)
**Role:** Syntax-highlighted code in feature cards and API sections

8px radius, background #14151a, 1px border #282a36. JetBrains Mono 13-14px. Filename tab in top-left (e.g., 'index.ts') in #9ca3af. Syntax colors: keywords in #c084fc, strings in #f1fa8c, comments in #6b7280, variables in #67e8f9, functions in #ff79c6, types in #50fa7b. No pink border — only the install command gets that treatment.

### Category Tag
**Role:** Pill-shaped API category labels — 'Start an HTTP server', 'Use Redis', etc.

9999px radius, background transparent, 1px border #3b3f4b. Text: #e5e7eb, system-ui 13px weight 500. Padding 8px 16px. Arranged in a centered cloud layout. No fill — these are navigation hints, not actions.

### Logo Bar
**Role:** Social proof row — 'USED BY' with Anthropic, Typeform, Midjourney, etc.

Single horizontal row, centered. Logos rendered in #9ca3af or #d1d5db at uniform height (~20px). Section label 'USED BY' in #6b7280, uppercase, 11px tracking-wide. No logos in color — monochrome keeps the row quiet so it doesn't compete with the CTA.

### Benchmark Bar Chart
**Role:** Performance comparison in hero right panel — Bun vs Rolldown, esbuild, Farm, Rspack

Horizontal bars on #14151a surface. Bun's bar: #f472b6 fill, short (fastest). Competitor bars: #4f5666 fill, progressively longer. Tool names in JetBrains Mono 12px left-aligned, version strings in #6b7280 below names, times in #e5e7eb right-aligned. The visual contrast between Bun's tiny pink bar and competitors' long gray bars is the entire argument.

### Feature List Item
**Role:** Checkmark + feature description in feature cards

Two-column grid layout. Each item: #34d399 checkmark icon (16px), then #d1d5db text in system-ui 14px. No bullets, no indent — the checkmark IS the bullet. Spacing 8px between items vertically.

### Gradient Headline
**Role:** Section titles that need extra emphasis — 'Four tools, one toolkit', 'The APIs you need. Baked in.'

Large system-ui (48-60px) weight 600-700. Text fill: linear-gradient from #f9a8d4 through #f472b6 to #c084fc. Centered alignment. The gradient is the section's visual anchor — it signals 'this is important' without needing color backgrounds or borders.

## Do's and Don'ts

### Do
- Use #f472b6 as the sole pink for all primary actions — never substitute with #ec4899 or lighter pinks for button fills
- Apply the 9999px pill radius to all interactive elements that should feel tap-friendly: buttons, tabs, tags, badges
- Reserve the 2px pink border treatment exclusively for the install command box — other code blocks use #282a36 hairline
- Set body text at 16px with line-height 1.63 in #9ca3af or #d1d5db for descriptions, #e5e7eb for primary content
- Use JetBrains Mono for any text that looks like a command, path, version, or package name — never for body prose
- Color-code tool accents consistently: Runtime=pink, Package Manager=cyan, Test Runner=gold, Bundler=violet
- Stack surfaces at #0d0e11 → #14151a → #1e2028 for depth — never use drop shadows to create elevation

### Don't
- Don't use #f472b6 for body text or large background fills — pink is an accent, not a surface
- Don't apply shadows to cards or panels — depth comes from surface color steps and 1px borders only
- Don't mix the 8px card radius with 9999px on the same component — pick one radius family per element type
- Don't use color logos in the 'USED BY' row — keep all third-party marks at #9ca3af for visual consistency
- Don't break the dark surface system with light cards or white backgrounds — even feature comparisons stay in the dark palette
- Don't use system-ui weight 300 for body copy — reserve light weights for large display headlines only
- Don't add more than one chromatic accent per section — Bun's discipline is one hot color against many grays

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Void Canvas | `#0d0e11` | Page background, hero space, footer |
| 1 | Obsidian Card | `#14151a` | Primary card surface, code block background, elevated panels |
| 2 | Graphite Panel | `#1e2028` | Nested cards, hover states, secondary surfaces |
| 3 | Iron Border | `#282a36` | Hairline borders, dividers, table cell separators |

## Elevation

Elevation is communicated entirely through surface color steps (#0d0e11 → #14151a → #1e2028) and 1px hairline borders in #282a36. No drop shadows are used on cards, buttons, or panels. The only shadow usage is on large overlay elements (modals, floating chat widgets) where functional separation requires it. This creates a flat, terminal-like aesthetic where depth is suggested, not rendered.

## Imagery

The site uses almost no traditional imagery — no photography, no lifestyle shots, no stock illustrations. Visual interest comes from: (1) syntax-highlighted code blocks that act as both content and decoration, (2) the benchmark bar chart in the hero where the visual IS the data, (3) starburst 'REPLACES' badges that function as playful stickers, and (4) the gradient text on section headlines. Third-party company logos in the social proof row are the only external imagery, rendered in monochrome. The aesthetic is 'documentation page that got promoted to a marketing site' — the interface is the visual.

## Layout

Max-width 1200px centered content with generous side padding. The hero is a two-column split: left side holds the headline, description, install command, and social proof; right side holds the tabbed benchmark visualization. Below the hero, sections are single-column centered with content capped at ~800px reading width. The 'Four tools' section uses a 2×2 card grid with 16px gaps. The 'APIs you need' section centers a cloud of category tags above a full-width code block. Vertical rhythm is established by 64-96px gaps between sections, with no alternating background bands — everything stays on #0d0e11. Navigation is a simple top bar with logo left, nav links right, and a single pink CTA.

## Agent Prompt Guide

## Quick Color Reference
- Text primary: #ffffff
- Text secondary: #9ca3af
- Text muted: #6b7280
- Background canvas: #0d0e11
- Background card: #14151a
- Border: #282a36
- Accent (Bun Pink): #f472b6
- primary action: no distinct CTA color

## Example Component Prompts

1. **Hero headline**: system-ui 60px weight 700, white (#ffffff) with the word 'fast' in #f472b6. Letter-spacing -1.2px. Line-height 1.0. On #0d0e11 background.

2. **Install command box**: 8px radius, background #14151a, 2px solid #f472b6 border. Interior text in JetBrains Mono 14px, command text in #f472b6, rest in #e5e7eb. Copy icon button on the right edge.

3. **Feature card**: 8px radius, background #14151a, 1px border #282a36, padding 24-32px. Title in system-ui 20px weight 600 white. Code snippet in JetBrains Mono 13px at top with #ec4899 text. Feature list with #34d399 checkmarks and #d1d5eb descriptions.

4. **Tab pill navigation**: 9999px radius, 32px height. Active: #f472b6 background, white text. Inactive: transparent background, #9ca3af text. system-ui 14px weight 500.

5. **Gradient section headline**: system-ui 48px weight 600, centered. Text fill: linear-gradient from #f9a8d4 through #f472b6 to #c084fc. On #0d0e11 background.

## Gradient System

Three gradient types serve distinct purposes:

1. **Headline gradient** (linear, 90deg): #f9a8d4 → #f472b6 → #c084fc. Applied as text fill on section titles that need to feel celebratory. The pink-to-violet sweep mirrors the brand's chromatic range.

2. **Edge fade** (linear, 90deg, transparent → pink → transparent): rgba(0,0,0,0) → rgba(236,72,153,0.5) → rgba(0,0,0,0). Used as decorative dividers or edge highlights on cards. Creates a 'glowing seam' effect.

3. **Panel wash** (linear, 0deg): rgba(244,114,182,0.03) → rgba(20,21,26,0.5). Extremely subtle background gradient on featured panels. Barely visible — just enough to break the flat void.

4. **Spotlight gradient** (radial): #b301b3 → #381dbd. Decorative background glow for hero or feature highlights. Used sparingly, always behind content.

## Similar Brands

- **Vercel** — Same dark-mode developer aesthetic with monochrome base and single bright accent for CTAs. Both use system-font stacks with tight tracking on large headlines.
- **Railway** — Dark canvas, generous spacing, code blocks as hero elements, and pill-shaped interactive components. Both treat the terminal as a first-class design element.
- **Linear** — Disciplined dark palette with one hot accent color cutting through grays. Large confident headlines and flat surfaces without drop shadows.
- **Deno** — Competitor devtool with similarly dark, code-forward marketing pages. Both use syntax-highlighted code as primary visual content rather than illustration.

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-void: #0d0e11;
  --color-obsidian: #14151a;
  --color-graphite: #1e2028;
  --color-iron: #282a36;
  --color-steel: #3a3a3f;
  --color-slate: #3b3f4b;
  --color-pewter: #4f5666;
  --color-fog: #6b7280;
  --color-ash: #9ca3af;
  --color-bone: #d1d5db;
  --color-pearl: #e5e7eb;
  --color-paper: #ffffff;
  --color-bun-pink: #f472b6;
  --color-magenta-core: #ec4899;
  --color-rose-petal: #f9a8d4;
  --color-blush: #fbcfe8;
  --color-wine: #3d1629;
  --color-plum: #3f1f33;
  --color-violet: #a855f7;
  --color-lavender: #c084fc;
  --color-lilac: #d8b4fe;
  --color-cyan: #06b6d4;
  --color-amber: #e67e22;
  --color-gold: #facc15;
  --color-mint: #34d399;

  /* Typography — Font Families */
  --font-system-ui: 'system-ui', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-jetbrains-mono: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --text-body-sm: 14px;
  --leading-body-sm: 1.56;
  --text-body: 16px;
  --leading-body: 1.63;
  --text-body-lg: 18px;
  --leading-body-lg: 1.78;
  --text-subheading: 20px;
  --leading-subheading: 1.4;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.33;
  --text-heading: 48px;
  --leading-heading: 1.2;
  --text-display: 60px;
  --leading-display: 1;
  --tracking-display: -1.2px;

  /* Typography — Weights */
  --font-weight-light: 300;
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
  --font-weight-extrabold: 800;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-36: 36px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-96: 96px;
  --spacing-120: 120px;
  --spacing-128: 128px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 64-96px;
  --card-padding: 24-32px;
  --element-gap: 16px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-3xl: 30px;
  --radius-full: 9999px;

  /* Named Radii */
  --radius-cards: 8px;
  --radius-icons: 4px;
  --radius-badges: 9999px;
  --radius-inputs: 8px;
  --radius-buttons: 9999px;
  --radius-codeblocks: 8px;

  /* Shadows */
  --shadow-xl: rgba(0, 0, 0, 0.25) 0px 25px 50px -12px;
  --shadow-md: rgba(131, 24, 67, 0.1) 0px 10px 15px -3px, rgba(131, 24, 67, 0.1) 0px 4px 6px -4px;

  /* Surfaces */
  --surface-void-canvas: #0d0e11;
  --surface-obsidian-card: #14151a;
  --surface-graphite-panel: #1e2028;
  --surface-iron-border: #282a36;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-void: #0d0e11;
  --color-obsidian: #14151a;
  --color-graphite: #1e2028;
  --color-iron: #282a36;
  --color-steel: #3a3a3f;
  --color-slate: #3b3f4b;
  --color-pewter: #4f5666;
  --color-fog: #6b7280;
  --color-ash: #9ca3af;
  --color-bone: #d1d5db;
  --color-pearl: #e5e7eb;
  --color-paper: #ffffff;
  --color-bun-pink: #f472b6;
  --color-magenta-core: #ec4899;
  --color-rose-petal: #f9a8d4;
  --color-blush: #fbcfe8;
  --color-wine: #3d1629;
  --color-plum: #3f1f33;
  --color-violet: #a855f7;
  --color-lavender: #c084fc;
  --color-lilac: #d8b4fe;
  --color-cyan: #06b6d4;
  --color-amber: #e67e22;
  --color-gold: #facc15;
  --color-mint: #34d399;

  /* Typography */
  --font-system-ui: 'system-ui', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-jetbrains-mono: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --text-body-sm: 14px;
  --leading-body-sm: 1.56;
  --text-body: 16px;
  --leading-body: 1.63;
  --text-body-lg: 18px;
  --leading-body-lg: 1.78;
  --text-subheading: 20px;
  --leading-subheading: 1.4;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.33;
  --text-heading: 48px;
  --leading-heading: 1.2;
  --text-display: 60px;
  --leading-display: 1;
  --tracking-display: -1.2px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-36: 36px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-96: 96px;
  --spacing-120: 120px;
  --spacing-128: 128px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-3xl: 30px;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-xl: rgba(0, 0, 0, 0.25) 0px 25px 50px -12px;
  --shadow-md: rgba(131, 24, 67, 0.1) 0px 10px 15px -3px, rgba(131, 24, 67, 0.1) 0px 4px 6px -4px;
}
```
