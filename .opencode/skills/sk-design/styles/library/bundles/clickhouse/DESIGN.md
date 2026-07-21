# ClickHouse — Style Reference
> phosphor terminal at midnight — a lone lime cursor glowing on black glass.

**Theme:** dark

ClickHouse reads as a phosphor terminal at midnight — a near-black canvas where one electric lime accent behaves like a blinking cursor, marking every action and highlight. The system is sparse, technical, and confident: white headlines sit in vast negative space, supported by a near-monochrome scale of dark grays that differentiate page, card, and elevated surfaces through hue alone. Components are flat and fast — hairline borders, soft 8px radii, almost no shadow. The lime (#faff69) is the only chromatic voice; it appears on the primary CTA, the 'ClickHouse' wordmark highlight, and as a small functional punctuation across icons, tags, and section markers. Typography stays in the Inter / Basier family with a single Inconsolata excursion for code, reinforcing a developer-tool register. Everything else is restrained: a quiet grid, generous breathing room, and a single visual idea — the database made visible in a flash of light.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Electric Lime | `linear-gradient(to right, rgba(0, 0, 0, 0), rgb(250, 255, 105), rgba(0, 0, 0, 0))` | `--color-electric-lime` | Green supporting accent for decorative details and low-frequency emphasis. Do not promote it to the primary CTA color |
| Olive Ink | `#161600` | `--color-olive-ink` | Deep olive tone for muted accent backgrounds, subtle on-dark decorative tints, and low-prominence lime-tinted text variants |
| Dark Olive | `#4f5100` | `--color-dark-olive` | Muted lime used for subtle accent borders, tag backgrounds, and supporting highlight washes where full Electric Lime would be too loud |
| Lime Glow | `#fbff46` | `--color-lime-glow` | Box-shadow glow on accent elements and secondary highlight states — reinforces the phosphor-light identity without adding a new hue |
| Void Black | `#151515` | `--color-void-black` | Page canvas and primary background — the near-black ground on which the entire system sits |
| Carbon | `#1f1f1c` | `--color-carbon` | Card surfaces and list-item backgrounds — one step above the page, holding feature cards and content blocks |
| Graphite | `#282828` | `--color-graphite` | Elevated surfaces, hover states, and secondary panel backgrounds — sits above cards for nested UI layers |
| Slate Dark | `#343434` | `--color-slate-dark` | Deepest elevated surface, dropdown menus, and modal backgrounds |
| Iron | `#3a3a3a` | `--color-iron` | Hairline borders and card edges — defines the boundary between surface levels without adding visual weight |
| Steel | `#414141` | `--color-steel` | Stronger borders, input field outlines, and nav dividers — one step heavier than Iron for structural separation |
| Smoke | `#a0a0a0` | `--color-smoke` | Muted secondary text, icon strokes, and inactive nav items — supports body copy hierarchy without competing with white |
| Fog | `#bcbcbb` | `--color-fog` | Subtle disabled or tertiary text, placeholder values, and low-priority labels |
| Bone | `#dfdfdf` | `--color-bone` | Secondary body text and descriptions — sits between Smoke and White for paragraph-level hierarchy |
| Paper | `#e5e7eb` | `--color-paper` | Primary body text and high-prominence neutral fills — the dominant light neutral across all surface contexts |
| Pure White | `#ffffff` | `--color-pure-white` | Headlines, icon fills, and maximum-contrast text — reserved for the highest hierarchy elements |
| True Black | `#000000` | `--color-true-black` | Inline link default, deepest accent contrast, and utility text |

## Tokens — Typography

### Inter — Primary workhorse — nav, body, buttons, links, and the massive 72/96px display headlines. The 0.1em tracking applies to uppercase micro-labels like 'USE CASES' and 'CLICKHOUSE IS TRUSTED BY', creating spaced-out eyebrow text that reads like a terminal status line. Weight 600 dominates headings, weight 400 for body, weight 900 only on the display-class hero. Inter's neutrality lets the lime accent carry all the personality. · `--font-inter`
- **Substitute:** Inter (Google Fonts)
- **Weights:** 400, 500, 600, 700, 900
- **Sizes:** 12px, 14px, 16px, 18px, 20px, 24px, 72px, 96px
- **Line height:** 1.00–1.56
- **Letter spacing:** 0.1em (uppercase labels only)
- **Role:** Primary workhorse — nav, body, buttons, links, and the massive 72/96px display headlines. The 0.1em tracking applies to uppercase micro-labels like 'USE CASES' and 'CLICKHOUSE IS TRUSTED BY', creating spaced-out eyebrow text that reads like a terminal status line. Weight 600 dominates headings, weight 400 for body, weight 900 only on the display-class hero. Inter's neutrality lets the lime accent carry all the personality.

### Basier — Secondary heading face used selectively for card titles and sub-section headlines. Slightly more geometric than Inter, adding a touch of editorial weight at the 20–36px range. Functions as a 'quiet display' when Inter's 72–96px hero is too loud for a mid-level section. · `--font-basier`
- **Substitute:** Basier Circle (or Inter as fallback)
- **Weights:** 600
- **Sizes:** 20px, 24px, 36px
- **Line height:** 1.17–1.40
- **Role:** Secondary heading face used selectively for card titles and sub-section headlines. Slightly more geometric than Inter, adding a touch of editorial weight at the 20–36px range. Functions as a 'quiet display' when Inter's 72–96px hero is too loud for a mid-level section.

### Inconsolata — Monospace for code snippets, terminal commands ($ curl ...), and the CLI install line. The only departure from the sans-serif system — appears once per page in the install section, marking the boundary between marketing and developer content. · `--font-inconsolata`
- **Substitute:** JetBrains Mono or Fira Code
- **Weights:** 600
- **Sizes:** 16px
- **Line height:** 1.50
- **Role:** Monospace for code snippets, terminal commands ($ curl ...), and the CLI install line. The only departure from the sans-serif system — appears once per page in the install section, marking the boundary between marketing and developer content.

### sans-serif — sans-serif — detected in extracted data but not described by AI · `--font-sans-serif`
- **Weights:** 400
- **Sizes:** 16px
- **Line height:** 1.5
- **Role:** sans-serif — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.5 | — | `--text-caption` |
| body-sm | 14px | 1.43 | — | `--text-body-sm` |
| body | 16px | 1.5 | — | `--text-body` |
| subheading | 18px | 1.5 | — | `--text-subheading` |
| heading-sm | 20px | 1.4 | — | `--text-heading-sm` |
| heading | 24px | 1.33 | — | `--text-heading` |
| heading-lg | 36px | 1.3 | — | `--text-heading-lg` |
| heading-xl | 72px | 1 | — | `--text-heading-xl` |
| display | 96px | 1 | — | `--text-display` |

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
| 44 | 44px | `--spacing-44` |
| 48 | 48px | `--spacing-48` |
| 64 | 64px | `--spacing-64` |
| 80 | 80px | `--spacing-80` |
| 96 | 96px | `--spacing-96` |
| 112 | 112px | `--spacing-112` |
| 128 | 128px | `--spacing-128` |
| 160 | 160px | `--spacing-160` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 4px |
| cards | 8px |
| pills | 9999px |
| inputs | 4px |
| buttons | 8px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| md | `rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.1)...` | `--shadow-md` |
| sm | `rgba(0, 0, 0, 0.06) 0px 4px 4px 0px, rgba(0, 0, 0, 0.14) ...` | `--shadow-sm` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 24-32px
- **Element gap:** 12-16px

## Components

### Primary CTA Button
**Role:** Main action trigger (Get started, Start free cloud trial)

Filled Electric Lime (#faff69) background, Void Black (#151515) text at 16px Inter weight 600. 8px border-radius. Padding 12px 24px. Soft black drop-shadow at 10% opacity. The single most important component — its lime glow against the dark canvas is the only moment the interface truly lights up.

### Ghost / Outlined Button
**Role:** Secondary action (Contact sales, Ask us anything)

Transparent background with 1px Iron (#3a3a3a) border, Paper (#e5e7eb) text at 16px Inter weight 600. 8px border-radius. Padding 12px 24px. Sits beside the primary CTA at lower visual weight — never competes with the lime.

### Pill Button
**Role:** Nav badges, tags, compact triggers

9999px border-radius, Dark Olive (#4f5100) background, Electric Lime text. Used sparingly for status indicators and tag-like elements. Tight 6px 12px padding.

### Feature Card (Use Case Tile)
**Role:** 4-column grid cards for use cases, features, and capabilities

Carbon (#1f1f1c) background, 1px Iron (#3a3a3a) border, 8px radius. 24-32px internal padding. Inset shadow at 6% black for subtle depth. Lime-outlined icon in 56px square at top, heading-sm in Basier 20px weight 600, body text in Bone (#dfdfdf) 14-16px, and a lime 'Explore →' link footer. Cards are equal-height, no hover lift — the lime link is the only hover affordance.

### FAQ Accordion Item
**Role:** Expandable question/answer in the FAQ section

Transparent background, no border between items, just vertical spacing. Question text in Paper (#e5e7eb) 18px Inter weight 500 with a 16px circular + icon on the right (Iron border, 1px stroke). Open state reveals answer text in Smoke (#a0a0a0) 16px. Clean, no box, no card.

### Terminal Code Block
**Role:** CLI install command display

Carbon (#1f1f1c) background, 8px radius, 16px 24px padding. $ prompt in Electric Lime, command text in Paper (#e5e7eb) using Inconsolata 16px weight 600. Copy icon on the right edge. The one moment a different typeface enters the system — immediately signals 'developer content'.

### Top Navigation Bar
**Role:** Persistent site navigation

Transparent or Void Black background, no visible border. Logo + brand on left in Paper (#e5e7eb), nav links center in Smoke (#a0a0a0) 14px Inter weight 500, right side: language selector, GitHub stars (46.8k), Sign in link, and the primary lime CTA. Height ~64px, padding 0 24px.

### Announcement Banner
**Role:** Time-sensitive product news embedded in the hero

Carbon (#1f1f1c) background with 1px Iron border, 8px radius, sits below the hero CTAs. Contains a small Langfuse logo tile on the left, body text in Bone 14px, and lime inline links. 16-20px vertical padding, compact horizontal layout.

### Trust Logo Strip
**Role:** Social proof — logos of companies using the product

No background change, no card frame. Eyebrow text 'CLICKHOUSE IS TRUSTED BY' in spaced uppercase Smoke 12px Inter. Logos below in pure Paper (#e5e7eb) monochrome, evenly spaced in a single row. Full viewport width, no padding container.

### Hero Section
**Role:** Above-the-fold value proposition

Void Black background, full-width. Centered 96px Inter weight 900 headline in Paper, with the brand name 'ClickHouse' highlighted in Electric Lime via the brand gradient. 18px subtext in Bone. Two-button stack (primary + ghost) with 12px gap. Generous 120-160px vertical padding. No hero image, no background graphic.

### Final CTA / Install Section
**Role:** Bottom-of-page conversion

Subtle bordered card on Void Black canvas. Centered 36px Inter weight 600 headline with 'ClickHouse' in a lime highlight box (Electric Lime background, Void Black text, 4px radius). Terminal code block below, followed by secondary inline links in lime.

### Section Divider / Eyebrow Label
**Role:** Small uppercase label above section headings

12px Inter weight 600, 0.1em letter-spacing, Electric Lime color. E.g., 'USE CASES', 'CLICKHOUSE IS TRUSTED BY'. Reads like a terminal status line — the only place where uppercase tracking is used at small size.

### Inline Highlight (Wordmark Emphasis)
**Role:** Emphasize the brand name within body text or headlines

Electric Lime background, Void Black text, 4px radius, inline within a sentence. Used twice on the page: in the hero 'database for AI' and in the final CTA 'ClickHouse in seconds'. Functions as a highlighter pen mark.

## Do's and Don'ts

### Do
- Use Electric Lime (#faff69) exclusively for primary actions and the single most important highlight per section — it should never appear more than once per viewport as a filled element.
- Build all dark surfaces from the five-step stack: Void Black (#151515) → Carbon (#1f1f1c) → Graphite (#282828) → Slate Dark (#343434) → Iron (#3a3a3a) — let hue, not shadow, define elevation.
- Use 8px radius for cards and buttons as the default; reserve 9999px for pill-style tags and status indicators only.
- Set display headlines at 72–96px Inter weight 900 with line-height 1.0 — the page is designed for one massive statement per section.
- Use 0.1em letter-spacing + 12px Inter weight 600 in Electric Lime for all uppercase eyebrow labels — this is the system's terminal voice.
- Keep section gaps at 80px and card padding at 24–32px — the dark canvas needs more breathing room than light themes because there's no tonal break to reset the eye.
- Use Inconsolata 16px weight 600 for any code, CLI, or terminal content — the typeface switch is a signal that the reader has crossed into developer territory.

### Don't
- Do not use Electric Lime on anything other than the single primary action per section — diluted lime loses its phosphor glow.
- Do not use white drop-shadows or glows on lime elements — the #fbff46 box-shadow token handles glow; stacking effects looks cheap.
- Do not introduce new colors: no blues, purples, or reds for secondary accents — the system is binary: dark neutral or electric lime.
- Do not use rounded corners larger than 8px on cards or buttons — the system is crisp, not soft; 9999px belongs only to pills.
- Do not use heavy drop-shadows for elevation — rely on the five-step surface stack and 1px Iron borders instead; shadows disappear on near-black anyway.
- Do not mix multiple heading typefaces in the same section — Inter handles the scale from 20px to 96px; Basier is a specialist, not a co-equal partner.
- Do not place body copy below 14px or above 18px — the system commits to a tight 14–18px range for paragraph text, letting the 72–96px display do the shouting.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Void Black | `#151515` | Page canvas and primary background |
| 1 | Carbon | `#1f1f1c` | Card surfaces, feature panels, content blocks |
| 2 | Graphite | `#282828` | Elevated surfaces, hover states, nested panels |
| 3 | Slate Dark | `#343434` | Modals, dropdowns, deepest elevation |
| 4 | Iron | `#3a3a3a` | Hairline borders defining surface boundaries |

## Elevation

- **Primary CTA button:** `rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.1) 0px 4px 6px -4px`
- **Feature card:** `rgba(0, 0, 0, 0.06) 0px 4px 4px 0px, rgba(0, 0, 0, 0.14) 0px 4px 25px 0px inset`

## Imagery

Visuals are sparse and product-focused. The use-case section uses 2px-stroke outlined lime icons inside square bordered tiles — the icon style is geometric and minimal, almost schematic. Photography is absent; logos in the trust strip are presented in pure white monochrome against the dark canvas, no color, no card frames, just a row of names. Code/terminal screenshots appear as a dark panel with a prompt and command line. The only decorative gradient is a subtle lime edge-fade used once for visual punctuation. Overall: the interface is the hero — no stock photography, no lifestyle imagery, no illustrations beyond line-art icons.

## Layout

Full-bleed dark canvas, no max-width container visible on the hero — the massive 96px headline breathes across the viewport. Content sections use a centered ~1200px max-width. The hero is a single centered headline + subtext + two-button stack, no split layout, no hero image. Below the fold, the layout shifts to a 4-column card grid for use cases (equal width, equal height, hairline-bordered), then a 2-column text+visual block for feature deep-dives. FAQ is a 2-column split: heading + intro on the left, accordion list on the right. The final CTA section is a centered single-column install block. Navigation is a fixed top bar with logo left, nav links center, CTA + auth right. Spacing rhythm: generous 80px section gaps with 24-32px card padding, no alternating light/dark bands — the entire page flows in one continuous dark mode.

## Agent Prompt Guide

## Quick Color Reference
- Background: #151515 (Void Black)
- Card surface: #1f1f1c (Carbon)
- Text primary: #ffffff / #e5e7eb
- Text secondary: #dfdfdf / #a0a0a0
- Border: #3a3a3a (Iron) / #414141 (Steel)
- Accent: #faff69 (Electric Lime)
- Accent dark: #4f5100 (Dark Olive)
- primary action: no distinct CTA color

## Example Component Prompts

No distinct primary action color was observed; use the extracted neutral button treatments instead of inventing a filled CTA color.

2. **Feature Card (Use Case Tile)**: #1f1f1c background, 1px #3a3a3a border, 8px radius, 24-32px padding. Lime-outlined icon (2px stroke #faff69) in a 56px square at top. Title in Basier 20px weight 600, #ffffff. Body text in 14px Inter weight 400, #dfdfdf. Footer link 'Explore →' in 14px Inter weight 500, #faff69.


4. **Terminal Code Block**: #1f1f1c background, 8px radius, 16px 24px padding. $ prompt character in #faff69, command text in #e5e7eb using Inconsolata 16px weight 600. Copy icon right-aligned, 1px stroke #a0a0a0.

5. **FAQ Accordion Item**: Transparent background, no border. Question in 18px Inter weight 500, #e5e7eb, with a 16px circular + icon on the right (1px #3a3a3a border, #a0a0a0 icon). Answer text in 16px Inter weight 400, #a0a0a0, revealed on click. 24px vertical padding between items.

## Similar Brands

- **Vercel** — Same dark-mode terminal aesthetic with restrained palette and single-color accent system — though Vercel uses white-on-black where ClickHouse uses lime.
- **Supabase** — Dark canvas developer-tool interface with green accent and monospace code blocks — shares the technical, phosphor-monitor register.
- **PlanetScale** — Dark UI with vivid single-color accent and generous 96px-class display headlines — similar confidence in large type as the primary visual device.
- **Neon** — Database-as-a-service brand with dark background and bright accent for CTAs — matches the binary neutral-plus-accent color philosophy.
- **Linear** — Dark-mode product UI with hairline borders, 8px radii, and minimal elevation — shares the flat-fast-component DNA even though Linear's accent is purple.

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-electric-lime: #faff69;
  --gradient-electric-lime: linear-gradient(to right, rgba(0, 0, 0, 0), rgb(250, 255, 105), rgba(0, 0, 0, 0));
  --color-olive-ink: #161600;
  --color-dark-olive: #4f5100;
  --color-lime-glow: #fbff46;
  --color-void-black: #151515;
  --color-carbon: #1f1f1c;
  --color-graphite: #282828;
  --color-slate-dark: #343434;
  --color-iron: #3a3a3a;
  --color-steel: #414141;
  --color-smoke: #a0a0a0;
  --color-fog: #bcbcbb;
  --color-bone: #dfdfdf;
  --color-paper: #e5e7eb;
  --color-pure-white: #ffffff;
  --color-true-black: #000000;

  /* Typography — Font Families */
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-basier: 'Basier', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inconsolata: 'Inconsolata', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-sans-serif: 'sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --text-body-sm: 14px;
  --leading-body-sm: 1.43;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-subheading: 18px;
  --leading-subheading: 1.5;
  --text-heading-sm: 20px;
  --leading-heading-sm: 1.4;
  --text-heading: 24px;
  --leading-heading: 1.33;
  --text-heading-lg: 36px;
  --leading-heading-lg: 1.3;
  --text-heading-xl: 72px;
  --leading-heading-xl: 1;
  --text-display: 96px;
  --leading-display: 1;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
  --font-weight-black: 900;

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
  --spacing-44: 44px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-96: 96px;
  --spacing-112: 112px;
  --spacing-128: 128px;
  --spacing-160: 160px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 24-32px;
  --element-gap: 12-16px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-full: 9999px;

  /* Named Radii */
  --radius-tags: 4px;
  --radius-cards: 8px;
  --radius-pills: 9999px;
  --radius-inputs: 4px;
  --radius-buttons: 8px;

  /* Shadows */
  --shadow-md: rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.1) 0px 4px 6px -4px;
  --shadow-sm: rgba(0, 0, 0, 0.06) 0px 4px 4px 0px, rgba(0, 0, 0, 0.14) 0px 4px 25px 0px inset;

  /* Surfaces */
  --surface-void-black: #151515;
  --surface-carbon: #1f1f1c;
  --surface-graphite: #282828;
  --surface-slate-dark: #343434;
  --surface-iron: #3a3a3a;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-electric-lime: #faff69;
  --color-olive-ink: #161600;
  --color-dark-olive: #4f5100;
  --color-lime-glow: #fbff46;
  --color-void-black: #151515;
  --color-carbon: #1f1f1c;
  --color-graphite: #282828;
  --color-slate-dark: #343434;
  --color-iron: #3a3a3a;
  --color-steel: #414141;
  --color-smoke: #a0a0a0;
  --color-fog: #bcbcbb;
  --color-bone: #dfdfdf;
  --color-paper: #e5e7eb;
  --color-pure-white: #ffffff;
  --color-true-black: #000000;

  /* Typography */
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-basier: 'Basier', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inconsolata: 'Inconsolata', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-sans-serif: 'sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --text-body-sm: 14px;
  --leading-body-sm: 1.43;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-subheading: 18px;
  --leading-subheading: 1.5;
  --text-heading-sm: 20px;
  --leading-heading-sm: 1.4;
  --text-heading: 24px;
  --leading-heading: 1.33;
  --text-heading-lg: 36px;
  --leading-heading-lg: 1.3;
  --text-heading-xl: 72px;
  --leading-heading-xl: 1;
  --text-display: 96px;
  --leading-display: 1;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-28: 28px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-44: 44px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-96: 96px;
  --spacing-112: 112px;
  --spacing-128: 128px;
  --spacing-160: 160px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-md: rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.1) 0px 4px 6px -4px;
  --shadow-sm: rgba(0, 0, 0, 0.06) 0px 4px 4px 0px, rgba(0, 0, 0, 0.14) 0px 4px 25px 0px inset;
}
```
