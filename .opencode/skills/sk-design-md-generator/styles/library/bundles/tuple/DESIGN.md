# Tuple — Style Reference
> Developer pair-programming workshop — clean white surfaces, one violet CTA, playful multi-color accents, and a dark band that makes the light sections breathe.

**Theme:** light

Tuple's design language is a developer's pair-programming workshop: bright, airy light surfaces with a single confident violet CTA that makes the primary action unmistakable. The visual identity leans on a four-color accent palette — violet, blue, orange, green — used sparingly as headings, icons, and the product-screenshot wallpapers, while the structural UI stays zinc-neutral and quiet. Typography pairs Inter Variable for everything functional with DM Mono for small all-caps labels and section eyebrows, which is a signature devtool move: mono labels say 'this is a product built by engineers' without resorting to skeuomorphism. Components are mostly flat and bordered rather than heavily shadowed, with a mix of 8px and 12px radii giving cards a modern-but-not-too-soft feel. The page alternates between generous white space sections and one dramatic dark band, creating rhythm without monotony.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Iris | `#6a5ed9` | `--color-iris` | Primary action — CTA buttons, filled links, active nav states |
| Cobalt | `#3f71d4` | `--color-cobalt` | Brand accent — icons, heading highlights, link hover; the most-used chromatic color in illustrations and product chrome |
| Coral | `#db5434` | `--color-coral` | Brand accent — headings, product-screenshot strokes, decorative highlights; warm counterweight to the cool blues and violets |
| Sprout | `#1bb152` | `--color-sprout` | Green text accent for links, tags, and emphasized short phrases |
| Emerald | `#16a34a` | `--color-emerald` | Green text accent for links, tags, and emphasized short phrases. Use as a supporting accent, not as a status color |
| Mint | `#22c55e` | `--color-mint` | Green wash for highlight backgrounds, decorative bands, and soft emphasis behind content. Use as a supporting accent, not as a status color |
| Lime | `#4ade80` | `--color-lime` | Green text accent for links, tags, and emphasized short phrases. Use as a supporting accent, not as a status color |
| Crimson | `#ef4444` | `--color-crimson` | Red wash for highlight backgrounds, decorative bands, and soft emphasis behind content. Use as a supporting accent, not as a status color |
| Saffron | `#ffb929` | `--color-saffron` | Yellow wash for highlight backgrounds, decorative bands, and soft emphasis behind content. Use as a supporting accent, not as a status color |
| Zinc 50 | `#fafafa` | `--color-zinc-50` | Page background, hero canvas |
| Zinc 100 | `#f4f4f5` | `--color-zinc-100` | Subtle section backgrounds, footer strips, surface wash |
| Zinc 200 | `#e4e4e7` | `--color-zinc-200` | Hairline borders, dividers, card outlines, input borders — the most-used neutral, structural backbone of every component |
| Zinc 300 | `#d4d4d8` | `--color-zinc-300` | Muted borders, disabled strokes, secondary dividers |
| Zinc 400 | `#a1a1aa` | `--color-zinc-400` | Muted icon fills, placeholder text, tertiary text |
| Zinc 500 | `#71717a` | `--color-zinc-500` | Secondary text, caption text, helper copy, muted nav links |
| Zinc 600 | `#52525b` | `--color-zinc-600` | Card outlines, emphasized borders, tertiary surface strokes |
| Zinc 700 | `#3f3f46` | `--color-zinc-700` | Body text accent, medium-emphasis text, card inner surfaces on dark sections |
| Zinc 800 | `#27272a` | `--color-zinc-800` | Primary text color, heading text, dark card surfaces, dark band backgrounds |
| Zinc 900 | `#18181b` | `--color-zinc-900` | Deepest dark — dark section canvases, near-black surfaces |
| White | `#ffffff` | `--color-white` | Card surfaces, button text on dark, raised content backgrounds |
| Mint Wash | `#dcfce7` | `--color-mint-wash` | Gray wash for highlight backgrounds, decorative bands, and soft emphasis behind content |
| Saffron Wash | `#fdc75c` | `--color-saffron-wash` | Warm section background, decorative wash |

## Tokens — Typography

### Inter Variable — Primary UI and heading typeface. Inter carries all functional text: body copy at 16px/400, nav at 14px/500, subheadings at 18–20px/600, and large display headlines at 48–60px/700. The custom font features (cv05, cv06, ss01) refine the alternate glyphs and tabular figures — a devtool-grade choice that signals engineering precision. Weight 700 is reserved for the hero headline; weight 500 dominates nav and buttons; weight 400 carries body copy. · `--font-inter-variable`
- **Substitute:** Inter
- **Weights:** 400, 500, 600, 700
- **Sizes:** 12, 13, 14, 16, 18, 20, 24, 36, 48, 60
- **Line height:** 1.00–1.63
- **OpenType features:** `"cv05", "cv06", "ss01"`
- **Role:** Primary UI and heading typeface. Inter carries all functional text: body copy at 16px/400, nav at 14px/500, subheadings at 18–20px/600, and large display headlines at 48–60px/700. The custom font features (cv05, cv06, ss01) refine the alternate glyphs and tabular figures — a devtool-grade choice that signals engineering precision. Weight 700 is reserved for the hero headline; weight 500 dominates nav and buttons; weight 400 carries body copy.

### DM Mono — Monospace label and eyebrow typeface. DM Mono appears in small all-caps section tags (e.g. 'WORKFLOW'), nav micro-labels, and technical micro-copy. Letter-spacing opens up to 0.05em–0.1em at smaller sizes, which is the mono-label signature: tight tracking would look cramped, the extra air gives labels a 'badge' presence. Custom features (ss03, ss04, ss05) activate stylistic alternates for the mono character set. · `--font-dm-mono`
- **Substitute:** JetBrains Mono
- **Weights:** 400, 500
- **Sizes:** 11, 12, 13, 14, 16
- **Line height:** 1.33–1.63
- **Letter spacing:** 0.05em–0.1em at 11–14px
- **OpenType features:** `"ss03", "ss04", "ss05"`
- **Role:** Monospace label and eyebrow typeface. DM Mono appears in small all-caps section tags (e.g. 'WORKFLOW'), nav micro-labels, and technical micro-copy. Letter-spacing opens up to 0.05em–0.1em at smaller sizes, which is the mono-label signature: tight tracking would look cramped, the extra air gives labels a 'badge' presence. Custom features (ss03, ss04, ss05) activate stylistic alternates for the mono character set.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.5 | 0.6px | `--text-caption` |
| body | 16px | 1.63 | — | `--text-body` |
| subheading | 18px | 1.5 | — | `--text-subheading` |
| heading-sm | 20px | 1.43 | — | `--text-heading-sm` |
| heading | 24px | 1.33 | — | `--text-heading` |
| heading-lg | 36px | 1.2 | — | `--text-heading-lg` |
| display | 48px | 1.14 | — | `--text-display` |
| display-lg | 60px | 1 | — | `--text-display-lg` |

## Tokens — Spacing & Shapes

**Base unit:** 8px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 8 | 8px | `--spacing-8` |
| 16 | 16px | `--spacing-16` |
| 24 | 24px | `--spacing-24` |
| 32 | 32px | `--spacing-32` |
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |
| 64 | 64px | `--spacing-64` |
| 96 | 96px | `--spacing-96` |
| 128 | 128px | `--spacing-128` |
| 192 | 192px | `--spacing-192` |
| 240 | 240px | `--spacing-240` |

### Border Radius

| Element | Value |
|---------|-------|
| nav | 4-8px |
| tags | 9999px |
| cards | 8-12px |
| links | 4px |
| inputs | 8px |
| buttons | 12px |
| large-cards | 16-24px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| subtle | `rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.1) 0p...` | `--shadow-subtle` |
| subtle-2 | `rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.05) ...` | `--shadow-subtle-2` |
| xl | `rgba(0, 0, 0, 0.25) 0px 25px 50px -12px` | `--shadow-xl` |
| subtle-3 | `rgba(0, 0, 0, 0.75) 0px 0px 0px 1px` | `--shadow-subtle-3` |
| subtle-4 | `rgba(255, 255, 255, 0.15) 0px 0px 0px 1px inset` | `--shadow-subtle-4` |
| subtle-5 | `rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0...` | `--shadow-subtle-5` |
| subtle-6 | `rgba(0, 0, 0, 0.05) 0px 1px 2px 0px` | `--shadow-subtle-6` |
| xl-2 | `rgba(0, 0, 0, 0.1) 0px 20px 25px -5px, rgba(0, 0, 0, 0.1)...` | `--shadow-xl-2` |
| xl-3 | `rgba(0, 0, 0, 0.05) 0px 0px 80px 0px, rgba(0, 0, 0, 0.02)...` | `--shadow-xl-3` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 64-96px
- **Card padding:** 16-24px
- **Element gap:** 8-16px

## Components

### Primary CTA Button
**Role:** Main action button

Filled violet (#6a5ed9) button with white text, 12px radius, padding 12px 24px. Inter Variable 16px weight 500. Used for 'Start your free trial' and primary conversion actions.

### Ghost Nav Button
**Role:** Secondary navigation action

Transparent background, Zinc 800 text, no border, 4–8px radius. Used for 'Log in' and similar low-emphasis nav items.

### Outlined Button
**Role:** Secondary action

White background, 1px Zinc 200 border, Zinc 800 text, 12px radius, 12px 24px padding. Used for 'Sign up' and tertiary actions in nav.

### Pill Tag
**Role:** Label or badge

Full 9999px radius, small padding 4px 12px, Inter or DM Mono 12–13px text. Used for status indicators and category pills.

### Mono Section Eyebrow
**Role:** Category label above headings

DM Mono 11–13px weight 500, letter-spacing 0.05em–0.1em, uppercase, in a brand accent color (green for 'WORKFLOW'). Sits centered above section headings.

### Feature Card
**Role:** Content card for feature sections

White or Zinc 100 surface, 1px Zinc 200 border, 8–12px radius, 16–24px padding. Optional 0 25px 50px -12px shadow for elevated variants. Contains icon, heading, and body copy.

### Logo Strip Row
**Role:** Social proof / trusted-by section

Horizontal row of grayscale partner logos at single opacity, spaced 48–80px apart, centered, under a small DM Mono eyebrow label. Logos desaturated to Zinc 500 to reduce visual competition.

### Hero Headline
**Role:** Primary page headline

Inter Variable 48–60px weight 700, Zinc 900, centered, tight line-height 1.0–1.14. The hero signature is centered text + subtitle + single violet CTA on a clean white canvas.

### Product Screenshot Frame
**Role:** App preview image

Rounded 8–12px radius, optional subtle shadow, displayed full-bleed or contained within a gradient or solid backdrop. The product screenshot itself includes colorful macOS window chrome.

### Dark Feature Card
**Role:** Card on dark band sections

Zinc 800 or near-black surface, 1px subtle border, 8–12px radius. Contains folder/file-tree UI or feature illustrations. Used inside the dark 'Built for developers' section.

### Nav Bar
**Role:** Top navigation

Horizontal bar, white or transparent background, 1px Zinc 200 bottom border. Logo left, nav links center or right, CTA right. Sticky on scroll with subtle shadow. Height 56–64px.

### Footer
**Role:** Site footer

Zinc 100 background, 1px Zinc 200 top border, multi-column link layout, small Inter 13–14px text in Zinc 500. Centered logo above link grid.

## Do's and Don'ts

### Do
- Use #6a5ed9 exclusively for the primary CTA — never repurpose it for icons, headings, or decoration; its scarcity is what makes it feel like an action
- Use Inter Variable for all body, nav, button, and heading text; reserve DM Mono strictly for uppercase eyebrows, technical labels, and micro-copy
- Set buttons and cards to 12px radius; use 8px for inputs and nav items; use 9999px only for true pill tags and status badges
- Set hero headlines to 48–60px weight 700 in Zinc 900; center the headline, subtitle, and CTA vertically with generous 64–96px section gaps above and below
- Pair every section with a DM Mono uppercase eyebrow in a brand accent color (green, blue, or orange) — this is the signature move that signals devtool credibility
- Anchor light sections on #fafafa canvas with #ffffff card surfaces and #e4e4e7 hairline borders; do not introduce new background colors without a structural role
- Use the dark band (#18181b) sparingly — once per page — to make surrounding light sections feel brighter by contrast
- Reference exact token values (colors, radii, spacing) from this spec when generating new components; do not estimate or interpolate

### Don't
- Do not use #3f71d4, #db5434, #1bb152, or other brand accents as button fills — they are decorative, not action colors
- Do not apply heavy drop shadows to standard cards; use 1px borders and subtle 0 1px 3px shadows, reserving 0 25px 50px shadow for hero-level elevation only
- Do not mix Inter and DM Mono in the same sentence or label — DM Mono is for standalone labels and eyebrows only
- Do not center-align body copy or feature descriptions — keep body text left-aligned for readability, reserving center alignment for hero and section intros
- Do not introduce a new accent color outside the four-color brand palette (violet, blue, orange, green)
- Do not use #27272a for decorative text on light backgrounds where #71717a secondary text would suffice; reserve Zinc 800 for headings and primary copy
- Do not stack multiple colored gradients in the same view; one gradient or color-wash per section maximum
- Do not use border-radius above 12px for functional components (buttons, inputs, cards) — 16–24px should only appear on oversized feature cards or decorative frames

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas | `#fafafa` | Page background, hero and feature sections |
| 1 | Card | `#ffffff` | Raised product cards, inner content blocks |
| 2 | Wash | `#f4f4f5` | Subtle alternating section background, footer strip |
| 3 | Dark Band | `#18181b` | Dark feature section (e.g. 'Built for developers') |
| 4 | Color Wash | `#dcfce7` | Decorative green section background for variety |

## Elevation

- **Card:** `0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.1)`
- **Bordered card:** `0 0 0 1px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.05)`
- **Elevated card / modal:** `0 25px 50px -12px rgba(0,0,0,0.25)`
- **Heavy-outlined card:** `0 0 0 1px rgba(0,0,0,0.75)`
- **Sticky nav:** `0 0 0 1px rgba(0,0,0,0.05), 0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)`

## Imagery

Product screenshots dominate the visual language: full macOS window captures with menu bars, code editors, and colorful gradient wallpapers (green-to-coral, violet-to-blue) serve as the primary 'hero images'. These are always contained within a rounded frame (8–12px radius), never full-bleed. Illustration style is minimal — small line-art character mascots (the cartoon gnome/bird figures flanking the Linux announcement pill) and simple folder/file-tree icons in the dark section. No lifestyle photography, no stock imagery. The dark 'Built for developers' section uses a subtle radial-line concentric-circle motif behind the UI card, giving depth without illustration. Icon style: thin-stroke outlined icons in brand accent colors (violet, blue, green), consistent 1.5–2px stroke weight. Imagery is decorative-atmosphere and product-showcase — it sells the product, not the brand.

## Layout

Max-width ~1200px centered content area with generous side padding. Hero is a centered vertical stack: nav bar → DM Mono eyebrow pill → large display headline → subtitle → single violet CTA → free-trial micro-copy → product screenshot frame. The page alternates between light and dark bands in a consistent rhythm: light hero → light product showcase → light trusted-by logo strip → dark 'Built for developers' feature band. Each band is separated by 64–96px vertical padding, with seamless flow (no dividers between bands). Feature sections inside the dark band use centered 2-column or 3-column card grids. The overall density is spacious and breathing — sections rarely compete for attention, and the single dark band creates a strong rhythm reset mid-page. Navigation is a clean top bar with logo left, links center, CTA right; sticky on scroll with a subtle border.

## Agent Prompt Guide

**Quick Color Reference**
- Text: #27272a (primary), #71717a (secondary), #a1a1aa (muted)
- Background: #fafafa (page), #ffffff (card), #f4f4f5 (wash), #18181b (dark band)
- Border: #e4e4e7 (hairline), #d4d4d8 (muted), #52525b (emphasized)
- Accent: #3f71d4 (blue), #db5434 (orange), #1bb152 (green)
- primary action: #6a5ed9 (filled action)

**3-5 Example Component Prompts**

1. *Create a hero section:* Background #fafafa. Centered DM Mono eyebrow pill in #1bb152 (13px, letter-spacing 0.1em, uppercase, 4px 12px padding, 9999px radius). Headline 'Headline here' at 48px Inter Variable weight 700, #27272a, line-height 1.14. Subtitle at 18px Inter weight 400, #71717a, max-width 640px. Violet CTA button (#6a5ed9 fill, white text, Inter 16px weight 500, 12px radius, 12px 24px padding). Section padding 96px top/bottom.

2. *Create a feature card:* White background, 1px #e4e4e7 border, 12px radius, 24px padding. Small brand-color icon (32px, #3f71d4 stroke). Heading 'Feature title' at 20px Inter weight 600, #27272a. Body copy at 16px Inter weight 400, #71717a, line-height 1.63.

3. *Create a dark feature band:* Background #18181b, 96px vertical padding. Centered DM Mono eyebrow in #4ade80 ('WORKFLOW', 13px, 0.1em letter-spacing, uppercase). Heading at 36px Inter weight 700, #ffffff. Content card with #27272a surface, 1px #3f3f46 border, 12px radius, containing a file-tree UI with folder icons in #3f71d4 and #1bb152.

4. *Create a trusted-by logo strip:* Background #fafafa. Centered DM Mono eyebrow 'TRUSTED BY THOUSANDS OF TEAMS' in #71717a (12px, 0.1em letter-spacing, uppercase, #1bb152 word). Below: single horizontal row of 5–6 grayscale partner logos spaced 64px apart, all desaturated to #71717a opacity.

5. *Create a product screenshot frame:* Rounded container at 12px radius with 0 25px 50px -12px rgba(0,0,0,0.25) shadow. Inside: a macOS window screenshot showing a code editor over a green-to-coral gradient wallpaper. Frame max-width 900px, centered, with 64px section padding above and below.

## Signature Choices

**Four-color accent palette, not one.** Most brands commit to a single accent color. Tuple uses four — violet, blue, orange, green — but enforces a strict rule: violet is action, the other three are decoration. This lets the CTA stay singular and urgent while giving illustrations, product chrome, and section eyebrows a playful multi-color personality.

**Mono eyebrows above every section.** A DM Mono uppercase label in a brand accent color sits above section headings throughout the site. This is the strongest 'devtool identity' signal: it borrows the terminal/CLI aesthetic without being a code block, and it creates consistent vertical rhythm across sections.

**Dark band as rhythm device.** Most of the page is light. One dark band appears mid-page (the 'Built for developers' section), creating a dramatic contrast reset that makes the surrounding light sections feel brighter. The dark band also hosts the most technical UI (file tree, folder icons), reinforcing the 'product for engineers' message.

**Zinc-based neutral scale.** Tuple avoids blue-tinted or warm-tinted grays — the neutrals are true zinc (cool but achromatic). This keeps the four accent colors visually pure; warm grays would muddy the coral and saffron, cool grays would fight the cobalt and iris.

## Similar Brands

- **Linear** — Same devtool sensibility — zinc neutrals, single accent color for CTAs, generous whitespace, mono labels for technical identity
- **Vercel** — Dark-band rhythm device, minimal bordered cards, 8–12px radius, Inter Variable as primary typeface with mono accents
- **GitLab** — Purple primary CTA on light surfaces, multi-color accent palette used as decoration, section-eyebrow pattern above headings
- **CodeSandbox** — Devtool brand that uses colorful gradient product screenshots as hero imagery, clean white canvas, confident single-color CTA

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-iris: #6a5ed9;
  --color-cobalt: #3f71d4;
  --color-coral: #db5434;
  --color-sprout: #1bb152;
  --color-emerald: #16a34a;
  --color-mint: #22c55e;
  --color-lime: #4ade80;
  --color-crimson: #ef4444;
  --color-saffron: #ffb929;
  --color-zinc-50: #fafafa;
  --color-zinc-100: #f4f4f5;
  --color-zinc-200: #e4e4e7;
  --color-zinc-300: #d4d4d8;
  --color-zinc-400: #a1a1aa;
  --color-zinc-500: #71717a;
  --color-zinc-600: #52525b;
  --color-zinc-700: #3f3f46;
  --color-zinc-800: #27272a;
  --color-zinc-900: #18181b;
  --color-white: #ffffff;
  --color-mint-wash: #dcfce7;
  --color-saffron-wash: #fdc75c;

  /* Typography — Font Families */
  --font-inter-variable: 'Inter Variable', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-dm-mono: 'DM Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --tracking-caption: 0.6px;
  --text-body: 16px;
  --leading-body: 1.63;
  --text-subheading: 18px;
  --leading-subheading: 1.5;
  --text-heading-sm: 20px;
  --leading-heading-sm: 1.43;
  --text-heading: 24px;
  --leading-heading: 1.33;
  --text-heading-lg: 36px;
  --leading-heading-lg: 1.2;
  --text-display: 48px;
  --leading-display: 1.14;
  --text-display-lg: 60px;
  --leading-display-lg: 1;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-unit: 8px;
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-96: 96px;
  --spacing-128: 128px;
  --spacing-192: 192px;
  --spacing-240: 240px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 64-96px;
  --card-padding: 16-24px;
  --element-gap: 8-16px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-3xl: 24px;
  --radius-full: 9999px;

  /* Named Radii */
  --radius-nav: 4-8px;
  --radius-tags: 9999px;
  --radius-cards: 8-12px;
  --radius-links: 4px;
  --radius-inputs: 8px;
  --radius-buttons: 12px;
  --radius-large-cards: 16-24px;

  /* Shadows */
  --shadow-subtle: rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.1) 0px 1px 2px -1px;
  --shadow-subtle-2: rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;
  --shadow-xl: rgba(0, 0, 0, 0.25) 0px 25px 50px -12px;
  --shadow-subtle-3: rgba(0, 0, 0, 0.75) 0px 0px 0px 1px;
  --shadow-subtle-4: rgba(255, 255, 255, 0.15) 0px 0px 0px 1px inset;
  --shadow-subtle-5: rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 20px 25px -5px, rgba(0, 0, 0, 0.1) 0px 8px 10px -6px;
  --shadow-subtle-6: rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;
  --shadow-xl-2: rgba(0, 0, 0, 0.1) 0px 20px 25px -5px, rgba(0, 0, 0, 0.1) 0px 8px 10px -6px;
  --shadow-xl-3: rgba(0, 0, 0, 0.05) 0px 0px 80px 0px, rgba(0, 0, 0, 0.02) 0px 8px 8px 0px;

  /* Surfaces */
  --surface-canvas: #fafafa;
  --surface-card: #ffffff;
  --surface-wash: #f4f4f5;
  --surface-dark-band: #18181b;
  --surface-color-wash: #dcfce7;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-iris: #6a5ed9;
  --color-cobalt: #3f71d4;
  --color-coral: #db5434;
  --color-sprout: #1bb152;
  --color-emerald: #16a34a;
  --color-mint: #22c55e;
  --color-lime: #4ade80;
  --color-crimson: #ef4444;
  --color-saffron: #ffb929;
  --color-zinc-50: #fafafa;
  --color-zinc-100: #f4f4f5;
  --color-zinc-200: #e4e4e7;
  --color-zinc-300: #d4d4d8;
  --color-zinc-400: #a1a1aa;
  --color-zinc-500: #71717a;
  --color-zinc-600: #52525b;
  --color-zinc-700: #3f3f46;
  --color-zinc-800: #27272a;
  --color-zinc-900: #18181b;
  --color-white: #ffffff;
  --color-mint-wash: #dcfce7;
  --color-saffron-wash: #fdc75c;

  /* Typography */
  --font-inter-variable: 'Inter Variable', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-dm-mono: 'DM Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --tracking-caption: 0.6px;
  --text-body: 16px;
  --leading-body: 1.63;
  --text-subheading: 18px;
  --leading-subheading: 1.5;
  --text-heading-sm: 20px;
  --leading-heading-sm: 1.43;
  --text-heading: 24px;
  --leading-heading: 1.33;
  --text-heading-lg: 36px;
  --leading-heading-lg: 1.2;
  --text-display: 48px;
  --leading-display: 1.14;
  --text-display-lg: 60px;
  --leading-display-lg: 1;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-96: 96px;
  --spacing-128: 128px;
  --spacing-192: 192px;
  --spacing-240: 240px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-3xl: 24px;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-subtle: rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.1) 0px 1px 2px -1px;
  --shadow-subtle-2: rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;
  --shadow-xl: rgba(0, 0, 0, 0.25) 0px 25px 50px -12px;
  --shadow-subtle-3: rgba(0, 0, 0, 0.75) 0px 0px 0px 1px;
  --shadow-subtle-4: rgba(255, 255, 255, 0.15) 0px 0px 0px 1px inset;
  --shadow-subtle-5: rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 20px 25px -5px, rgba(0, 0, 0, 0.1) 0px 8px 10px -6px;
  --shadow-subtle-6: rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;
  --shadow-xl-2: rgba(0, 0, 0, 0.1) 0px 20px 25px -5px, rgba(0, 0, 0, 0.1) 0px 8px 10px -6px;
  --shadow-xl-3: rgba(0, 0, 0, 0.05) 0px 0px 80px 0px, rgba(0, 0, 0, 0.02) 0px 8px 8px 0px;
}
```
