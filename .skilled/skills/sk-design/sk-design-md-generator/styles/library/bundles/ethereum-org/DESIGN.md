# ethereum.org — Style Reference
> Lilac architecture in flat editorial space — a printed open-source almanac where the Ethereum diamond floats above duotone crowds of people.

**Theme:** light

Ethereum.org is a bright, illustration-driven editorial site for a decentralized ecosystem: white-and-lilac surfaces, bold Inter 900 display type, and full-bleed duotone line-art scenes that make the brand feel like a printed almanac rather than a product dashboard. Color is rationed — the dominant lavender wash (#ece0ff) reads as paper, while a single vivid violet (#6c24e0) owns every primary action, eyebrow label, and link, keeping the interface calm between dense content blocks. Feature content sits on flat pastel cards (lavender, mint, peach, pink) with 16px corners, no shadows — elevation is expressed through surface tint, not depth. Components are square-shouldered (4–8px button radius) and lightweight, the Ethereum diamond octahedron recurs as the only consistent iconographic mark, and the visual rhythm alternates between wide illustrated bands and tight typographic grids.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Lavender Paper | `#ece0ff` | `--color-lavender-paper` | Page canvas, soft card surfaces, hero wash — near-gray violet that reads as neutral paper across the entire site |
| Pure White | `#ffffff` | `--color-pure-white` | Card surface above canvas, icon strokes, inverse text on violet buttons, nav background |
| Ash Gray | `#cfcfcf` | `--color-ash-gray` | Hairline dividers, card borders, input borders, separator rules — the dominant border tone at 2484 occurrences |
| Onyx | `#121212` | `--color-onyx` | Primary text, heading fill, dark icon strokes — the only body-color the UI commits to |
| Graphite | `#616161` | `--color-graphite` | Secondary body text, muted helper copy, nav subtext |
| Fog | `#8c8c8c` | `--color-fog` | Tertiary text, disabled nav items, low-priority borders |
| Ethereum Violet | `#6c24e0` | `--color-ethereum-violet` | Violet supporting accent for decorative details and low-frequency emphasis. Do not promote it to the primary CTA color |
| Deep Iris | `#41128c` | `--color-deep-iris` | Hover state on violet, dark accent surface, gradient origin — the violet pushed to its shadow end |
| Hot Magenta | `#f60e9d` | `--color-hot-magenta` | Secondary accent for inline links inside feature cards, tag pills, illustration accent |
| Sapphire | `#3d4ceb` | `--color-sapphire` | Tertiary accent for links, icon variants, illustration cool-tone accents |
| Mint | `#0f9972` | `--color-mint` | Green supporting accent for decorative details and low-frequency emphasis. Use as a supporting accent, not as a status color |
| Lilac Wash | `radial-gradient(127.67% 82.36% at 50% -30.36%, rgba(147, 87, 244, 0.08) 0%, rgba(147, 87, 244, 0.24) 33%, rgba(67, 113, 239, 0.08) 66%, rgba(0, 0, 0, 0) 100%)` | `--color-lilac-wash` | Gradient origin for the hero radial glow and card overlays — never used as a flat fill |

## Tokens — Typography

### Inter — Sole workhorse — body at 16px/400, section headings at 24–30px/700, and display at 48–64px/900. The 900 weight at 60–64px is the signature: headlines are not politely bold, they are geometric slabs that anchor every section · `--font-inter`
- **Substitute:** Inter (Google Fonts) — no substitute needed; the 900 weight and tabular spacing are core to the look
- **Weights:** 400, 700, 900
- **Sizes:** 10, 14, 16, 18, 20, 24, 30, 35, 36, 48, 60, 64
- **Line height:** 1.00–2.00 (tight for display, 1.60 for body)
- **Role:** Sole workhorse — body at 16px/400, section headings at 24–30px/700, and display at 48–64px/900. The 900 weight at 60–64px is the signature: headlines are not politely bold, they are geometric slabs that anchor every section

### IBM Plex Mono — Used only for keyboard shortcut hints in the search bar (cmd/k label). Never used for body or heading · `--font-ibm-plex-mono`
- **Substitute:** IBM Plex Mono (Google Fonts) or JetBrains Mono
- **Weights:** 400
- **Sizes:** 14, 16
- **Line height:** 1.60
- **Role:** Used only for keyboard shortcut hints in the search bar (cmd/k label). Never used for body or heading

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 14px | 1.6 | — | `--text-caption` |
| body-sm | 16px | 1.6 | — | `--text-body-sm` |
| body | 18px | 1.6 | — | `--text-body` |
| subheading | 24px | 1.3 | — | `--text-subheading` |
| heading-sm | 30px | 1.2 | — | `--text-heading-sm` |
| heading | 36px | 1.2 | — | `--text-heading` |
| heading-lg | 48px | 1.1 | — | `--text-heading-lg` |
| display | 64px | 1 | — | `--text-display` |

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
| 80 | 80px | `--spacing-80` |
| 128 | 128px | `--spacing-128` |
| 192 | 192px | `--spacing-192` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 8px |
| cards | 16px |
| pills | 9999px |
| buttons | 4px |
| illustrations | 32px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| md | `rgba(65, 18, 140, 0.02) 2px 2px 12px 1px, rgba(65, 18, 14...` | `--shadow-md` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 64px
- **Card padding:** 32px
- **Element gap:** 8px

## Components

### Primary Filled Button
**Role:** Main call-to-action across landing and section pages

Background #6c24e0, text #ffffff, Inter 700 at 16px, padding 12px 24px, border-radius 4px. No border, no shadow. Squeezed corners (not pill-shaped) are deliberate — they read as 'link button' rather than 'chip'

### Ghost Outline Button
**Role:** Secondary actions in card footers and inline links

Background transparent, 1px border #cfcfcf (or #6c24e0 for chromatic ghost), text #121212 at 16px/400, 4px radius, padding 10px 16px. Arrow icon (›) follows the label

### Eyebrow Label
**Role:** Section category tag sitting above headlines

Inter 700 at 14px, uppercase, color #6c24e0, letter-spacing slightly expanded. Pill background on #ece0ff (8px radius) — the only spot where the brand color tints a surface instead of filling it

### Hero Illustration Band
**Role:** Full-bleed visual anchor at the top of landing and section pages

Edge-to-edge duotone line-art scene on a very light blue/lavender background, clipped at 32px radius when constrained. The Ethereum diamond octahedron is always centered or floating. Color is restricted to the violet–blue range even when the scene shows diverse people and architecture

### Feature Card (Pastel)
**Role:** Three-column content tiles in the 'A new way to use the internet' section

Border-radius 16px, padding 32px, background one of {lavender #ece0ff, mint pastel, peach pastel, pink pastel}. No border, no shadow. Illustration centered top, Inter 700 heading at 24px, body at 16px #121212, ghost outline button footer

### Popular Topic Card
**Role:** Two-column quick-link tiles in the 'What is Ethereum?' section

White card on lavender canvas, 1px border #cfcfcf, 16px radius, padding 24px. Icon left (outlined Ethereum diamond variant, 24px, stroke #6c24e0), Inter 700 label at 16px #121212 right

### Top Navigation Bar
**Role:** Sticky header across all pages

Background #ffffff, height ~64px, bottom border 1px #cfcfcf. Logo (diamond) left, nav links (Learn / Use / Build / Participate / Research) in Inter 700 at 16px #121212 with active state in #6c24e0. Right side: search trigger with cmd/k badge, language switcher, dark mode toggle

### Search Command Bar
**Role:** Keyboard-driven search trigger in the nav

Pill shape (9999px radius), 1px border #cfcfcf, background #ffffff. Magnifier icon + 'search' text in #616161, right-side keycap showing ⌘K in IBM Plex Mono 14px

### Two-Column Section Block
**Role:** Editorial text + illustration layout (e.g. 'What is Ethereum?')

Left column: 60% width, eyebrow label, Inter 900 heading at 36–48px, two paragraphs of body at 18px #121212, filled primary button. Right column: 40% width, illustration clipped at 32px radius

### Full-Width Editorial Card
**Role:** Lavender panel introducing a content theme (e.g. 'A new way to use the internet')

Background #ece0ff, full-bleed, 48–64px vertical padding. Inter 900 headline at 48–60px left-aligned, no centered text. Acts as a section divider that resets the visual rhythm

### Icon
**Role:** Recurring Ethereum diamond octahedron used everywhere

Always 24px or 32px, stroke-only (1.5–2px) on #6c24e0 for interactive states, #121212 for neutral, #ffffff on violet surfaces. No filled variants except inside illustrations

### Card Arrow Link
**Role:** Inline action link at the end of a card or paragraph

Inter 400 at 16px in #6c24e0, followed by a chevron-right character. Underline only on hover. No background, no border

### Image Container
**Role:** Wrapper for any standalone illustration

Border-radius 32px (large illustrative crops) or 12px (inline diagrams). Always sits flat on a pastel surface — no white framing box

## Do's and Don'ts

### Do
- Use Inter 900 at 48–64px for any section display heading — the geometric slab weight is non-negotiable for the brand
- Use #6c24e0 for every primary action, eyebrow label, and active link — reserve all other chromatic colors for secondary text accents and illustration
- Set feature card backgrounds to one of the pastel tints (lavender #ece0ff, mint, peach, pink) at 16px radius, with no shadow and no border
- Place an eyebrow label (Inter 700, 14px, uppercase, #6c24e0, pill on #ece0ff) directly above every section heading
- Use 4px radius on primary buttons — the square-shouldered button is a signature, not a pill
- Anchor every section with at least one illustration or icon; text-only sections should be the exception
- Use 64px vertical padding between major sections and 32px inside cards

### Don't
- Don't use drop shadows for elevation — hierarchy comes from flat surface tints, not depth
- Don't use 600 or 800 weight for headlines — the system commits to 900 or 700 only, and 900 only at display sizes
- Don't introduce new saturated colors beyond the existing four (#6c24e0, #f60e9d, #3d4ceb, #0f9972) — the palette is rationed
- Don't use pill-shaped buttons (9999px) for primary actions — that radius is reserved for search triggers and tags
- Don't stack text directly on the full-bleed illustration without the centered headline block underneath it
- Don't use centered body text — body paragraphs are always left-aligned at max 65ch width
- Don't use photography as the primary visual — illustration owns this system, photos should only appear in editorial context if at all

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas | `#ece0ff` | Page background — the lilac paper tone that wraps most screens |
| 1 | Card | `#ffffff` | Default card surface, nav bar, and elevated content blocks sitting on the canvas |
| 2 | Pastel Feature Card | `#ece0ff` | Lavender-tinted feature card variant for grouped content sections |
| 3 | Inverse Surface | `#6c24e0` | Primary action surface (filled buttons) and the rare inverted banner |
| 4 | Deep Accent | `#41128c` | Hover state and the deepest tier — used sparingly as a gradient end-stop |

## Elevation

- **Feature Card (rare elevated variant):** `0px 2px 12px 1px rgba(65, 18, 140, 0.02), 0px 12px 16px -3px rgba(65, 18, 140, 0.02), 0px 24px 32px -6px rgba(65, 18, 140, 0.02), 0px 32px 40px -12px rgba(152, 27, 27, 0.04)`

## Imagery

Illustration is the dominant visual element — nearly every section is anchored by a full-bleed duotone line-art scene. The treatment is consistent: a cool violet-to-blue palette (#6c24e0, #3d4ceb, #9357f4) with selective warm accents in pink (#f60e9d) and mint (#0f9972). Linework is uniform-weight (1–1.5px), architectural and human figures are stylized, and the Ethereum diamond octahedron recurs as a floating motif. Scenes are flat (no perspective gradients), centered around a horizon line, and always feature groups of diverse people in built environments. Photos are almost absent — the site is illustration-first, which is unusual for a major web3 brand and gives it an almanac-like editorial feel rather than a typical product-site polish.

## Layout

The site uses a max-width 1200px container centered on a lavender canvas, with most sections alternating between full-bleed illustrated bands and contained two-column or three-column grids. The hero is a single edge-to-edge illustration with a centered headline stack (eyebrow → display → subhead) sitting below it, not overlapping. Content sections follow a repeating rhythm: wide lavender editorial panel with a left-aligned 48–60px display heading, then a two-column text+image block, then a three-column pastel card grid. The navigation is a single sticky top bar, no sidebar. Vertical rhythm is comfortable — 64px between major sections, 32px card padding, 8px element gaps — and the page never feels dense. Most pages end with a centered CTA block before the footer.

## Agent Prompt Guide

## Quick Color Reference
- text: #121212 (primary), #616161 (secondary), #8c8c8c (tertiary)
- background: #ece0ff (canvas), #ffffff (card)
- border: #cfcfcf (hairline)
No distinct primary action color was observed; use the extracted neutral button treatments instead of inventing a filled CTA color.
- secondary accents: #f60e9d (magenta), #3d4ceb (sapphire), #0f9972 (mint)
- primary action: no distinct CTA color

## Example Component Prompts

1. **Create a hero band**: Edge-to-edge duotone line-art illustration (violet #6c24e0, blue #3d4ceb, pink #f60e9d accents, white background #ffffff) with the Ethereum diamond octahedron centered, clipped to 32px radius if contained. Below it, a centered stack: eyebrow pill 'NETWORK' (Inter 700, 14px, uppercase, #6c24e0 text on #ece0ff, 8px radius, 4px 12px padding), then 'Welcome to Ethereum' in Inter 900 at 64px, line-height 1.0, #121212, then subtext at 18px/400 #616161.


3. **Create a pastel feature card**: Background #ece0ff (or mint/peach/pink pastel), border-radius 16px, padding 32px, no border, no shadow. Illustration centered top, 48–64px square. Heading in Inter 700 at 24px, line-height 1.3, #121212. Body at 16px/400 #121212. Footer ghost button: 1px border #cfcfcf, 4px radius, text in #121212, arrow › trailing.

4. **Create the top navigation**: Background #ffffff, 1px bottom border #cfcfcf, height 64px. Left: Ethereum diamond icon (24px, stroke #6c24e0). Nav links: 'Learn / Use / Build / Participate / Research' in Inter 700 at 16px #121212, active state in #6c24e0. Right: search pill (9999px radius, border #cfcfcf, icon + 'search' text in #616161, '⌘K' in IBM Plex Mono 14px #616161), language switcher, dark mode toggle icon.

5. **Create a card arrow link**: Inline link 'Discover stablecoins ›' — Inter 400 at 16px, color #6c24e0, no background, no border, chevron-right character trailing. Underline on hover only.

## Similar Brands

- **Stellar.org** — Same illustration-first editorial approach with duotone line-art scenes and a single brand color carrying all primary actions
- **Polkadot.network** — Similar pastel-on-canvas card systems with square-shouldered buttons and Inter as the workhorse font
- **Webflow.com** — Comfortable-density editorial layouts with eyebrow labels above bold display headings, though Webflow uses more color contrast
- **MDN Web Docs** — Same information-dense but airy editorial structure with flat surfaces and minimal elevation

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-lavender-paper: #ece0ff;
  --color-pure-white: #ffffff;
  --color-ash-gray: #cfcfcf;
  --color-onyx: #121212;
  --color-graphite: #616161;
  --color-fog: #8c8c8c;
  --color-ethereum-violet: #6c24e0;
  --color-deep-iris: #41128c;
  --color-hot-magenta: #f60e9d;
  --color-sapphire: #3d4ceb;
  --color-mint: #0f9972;
  --color-lilac-wash: #9357f4;
  --gradient-lilac-wash: radial-gradient(127.67% 82.36% at 50% -30.36%, rgba(147, 87, 244, 0.08) 0%, rgba(147, 87, 244, 0.24) 33%, rgba(67, 113, 239, 0.08) 66%, rgba(0, 0, 0, 0) 100%);

  /* Typography — Font Families */
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-ibm-plex-mono: 'IBM Plex Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.6;
  --text-body-sm: 16px;
  --leading-body-sm: 1.6;
  --text-body: 18px;
  --leading-body: 1.6;
  --text-subheading: 24px;
  --leading-subheading: 1.3;
  --text-heading-sm: 30px;
  --leading-heading-sm: 1.2;
  --text-heading: 36px;
  --leading-heading: 1.2;
  --text-heading-lg: 48px;
  --leading-heading-lg: 1.1;
  --text-display: 64px;
  --leading-display: 1;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-bold: 700;
  --font-weight-black: 900;

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
  --spacing-80: 80px;
  --spacing-128: 128px;
  --spacing-192: 192px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 64px;
  --card-padding: 32px;
  --element-gap: 8px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-3xl: 32px;
  --radius-full: 9999px;

  /* Named Radii */
  --radius-tags: 8px;
  --radius-cards: 16px;
  --radius-pills: 9999px;
  --radius-buttons: 4px;
  --radius-illustrations: 32px;

  /* Shadows */
  --shadow-md: rgba(65, 18, 140, 0.02) 2px 2px 12px 1px, rgba(65, 18, 140, 0.02) 12px 16px 12px -3px, rgba(65, 18, 140, 0.02) 24px 32px 24px -6px, rgba(152, 27, 27, 0.04) 32px 40px 40px -12px;

  /* Surfaces */
  --surface-canvas: #ece0ff;
  --surface-card: #ffffff;
  --surface-pastel-feature-card: #ece0ff;
  --surface-inverse-surface: #6c24e0;
  --surface-deep-accent: #41128c;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-lavender-paper: #ece0ff;
  --color-pure-white: #ffffff;
  --color-ash-gray: #cfcfcf;
  --color-onyx: #121212;
  --color-graphite: #616161;
  --color-fog: #8c8c8c;
  --color-ethereum-violet: #6c24e0;
  --color-deep-iris: #41128c;
  --color-hot-magenta: #f60e9d;
  --color-sapphire: #3d4ceb;
  --color-mint: #0f9972;
  --color-lilac-wash: #9357f4;

  /* Typography */
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-ibm-plex-mono: 'IBM Plex Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.6;
  --text-body-sm: 16px;
  --leading-body-sm: 1.6;
  --text-body: 18px;
  --leading-body: 1.6;
  --text-subheading: 24px;
  --leading-subheading: 1.3;
  --text-heading-sm: 30px;
  --leading-heading-sm: 1.2;
  --text-heading: 36px;
  --leading-heading: 1.2;
  --text-heading-lg: 48px;
  --leading-heading-lg: 1.1;
  --text-display: 64px;
  --leading-display: 1;

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
  --spacing-80: 80px;
  --spacing-128: 128px;
  --spacing-192: 192px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-3xl: 32px;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-md: rgba(65, 18, 140, 0.02) 2px 2px 12px 1px, rgba(65, 18, 140, 0.02) 12px 16px 12px -3px, rgba(65, 18, 140, 0.02) 24px 32px 24px -6px, rgba(152, 27, 27, 0.04) 32px 40px 40px -12px;
}
```
