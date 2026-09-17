# Jam — Style Reference
> late-night dev console with mint LED pulse — a near-black interface where one vivid green button glows like a power LED on matte hardware.

**Theme:** dark

Jam is a late-night dev console with a mint signal pulse: a near-black canvas in deep plum-black, massive geometric grotesk headlines that take over the viewport, and a single electric mint accent that marks everything that is on, active, or ready. The interface is deliberately quiet — most surfaces share a tonal near-gray darkness, letting the mint and violet accents do the talking. Cards, pills, and controls are generously rounded (12–24px) and defined by hairline borders rather than heavy shadows, giving the product a lightweight, paper-on-graphite feel. The brand oscillates between three chromatic voices: mint for primary actions and status, violet for secondary icons and gradients, and a hot pink-red for the persistent header CTA and the wordmark — each one a small electric punctuation against the dark.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Obsidian Plum | `#130f18` | `--color-obsidian-plum` | Page canvas, deepest background — the negative space headlines float on |
| Graphite Plum | `#21192a` | `--color-graphite-plum` | Card and list surface — one step lifted from the canvas, carries testimonial cards and feature lists |
| Smoke Plum | `#2e2d36` | `--color-smoke-plum` | Inner card surface and hairline border on cards — a second elevation step |
| Ink Border | `#252542` | `--color-ink-border` | Subtle violet-tinted borders and dividers between elements |
| Carbon | `#25292e` | `--color-carbon` | Navigation fills and tonal mid-ground blocks |
| Mist Gray | `#8b94a3` | `--color-mist-gray` | Body text, nav links, secondary icons — the dominant cool-gray voice for readable but non-emphatic text |
| Soft Mist | `#d0cfd1` | `--color-soft-mist` | Lighter body text variant for de-emphasized content |
| Bone | `#e5e7eb` | `--color-bone` | Hairline borders across the entire system — the connective tissue between every section, card, and list |
| Paper | `#ffffff` | `--color-paper` | Light text on dark surfaces, inverse labels, and high-contrast captions. Do not promote it to the primary CTA color |
| Signal Mint | `#73e5bf` | `--color-signal-mint` | Green text accent for links, tags, and emphasized short phrases |
| Mint Halo | `#c5ffe7` | `--color-mint-halo` | Soft mint highlight wash, inset glow on hero elements, gradient terminator fading to white |
| Electric Violet | `#a37af5` | `--color-electric-violet` | Feature pill icons, secondary accents, gradient terminator — the cool counterpart to mint, carries the decorative gradient text |
| Deep Violet | `#744ec2` | `--color-deep-violet` | Decorative card fill, gradient start — a deeper violet used sparingly for tonal richness |
| Lilac | `#b89fd4` | `--color-lilac` | Light accent text and headings — soft violet for non-body highlights |
| Mauve | `#947fac` | `--color-mauve` | Muted violet for body text accents and secondary icon strokes |
| Jam Pink | `#ff4070` | `--color-jam-pink` | Red wash for highlight backgrounds, decorative bands, and soft emphasis behind content. Do not promote it to the primary CTA color |

## Tokens — Typography

### Oldschool Grotesk — Display and heading face — the signature font. Weight 900 at 66–116px for hero headlines, weight 400 for small caps and labels. This custom geometric grotesk gives Jam its voice: the 900-weight is not just bold, it is architectural, and the compressed letterforms make even short words feel like monuments. At 8–16px it functions as an uppercase micro-label for trust badges and nav accents. · `--font-oldschool-grotesk`
- **Substitute:** Space Grotesk, Inter, or General Sans
- **Weights:** 400, 900
- **Sizes:** 8px, 12px, 16px, 66px, 88px, 116px
- **Line height:** 1.00–1.50
- **Role:** Display and heading face — the signature font. Weight 900 at 66–116px for hero headlines, weight 400 for small caps and labels. This custom geometric grotesk gives Jam its voice: the 900-weight is not just bold, it is architectural, and the compressed letterforms make even short words feel like monuments. At 8–16px it functions as an uppercase micro-label for trust badges and nav accents.

### SF Pro Text — UI body and interface text — the workhorse. Sizes 14–16px at weight 400–500 for body and nav, 600–700 for button labels. The -0.025em letter-spacing tightens the default SF Pro into a denser, more deliberate reading rhythm that matches the display font's compressed character. · `--font-sf-pro-text`
- **Substitute:** Inter, system-ui, -apple-system
- **Weights:** 400, 500, 600, 700
- **Sizes:** 11px, 12px, 13px, 14px, 15px, 16px, 24px
- **Line height:** 1.00–1.50
- **Letter spacing:** -0.025em across all sizes (translates to roughly -0.3px at 12px, -0.4px at 16px, -0.6px at 24px)
- **Role:** UI body and interface text — the workhorse. Sizes 14–16px at weight 400–500 for body and nav, 600–700 for button labels. The -0.025em letter-spacing tightens the default SF Pro into a denser, more deliberate reading rhythm that matches the display font's compressed character.

### SF Mono — Monospaced code fragments and technical micro-labels — sparingly used for inline technical annotations · `--font-sf-mono`
- **Substitute:** JetBrains Mono, Menlo, monospace
- **Weights:** 400
- **Sizes:** 10px
- **Line height:** 1.50
- **Role:** Monospaced code fragments and technical micro-labels — sparingly used for inline technical annotations

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 11px | 1.43 | -0.28px | `--text-caption` |
| heading-sm | 24px | 1.33 | -0.6px | `--text-heading-sm` |
| heading | 66px | 1.1 | — | `--text-heading` |
| heading-lg | 88px | 1 | — | `--text-heading-lg` |
| display | 116px | 1 | — | `--text-display` |

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
| 52 | 52px | `--spacing-52` |
| 56 | 56px | `--spacing-56` |
| 64 | 64px | `--spacing-64` |
| 80 | 80px | `--spacing-80` |
| 96 | 96px | `--spacing-96` |
| 196 | 196px | `--spacing-196` |

### Border Radius

| Element | Value |
|---------|-------|
| nav | 8px |
| cards | 24px |
| pills | 9999px |
| inputs | 12px |
| buttons | 12px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| subtle | `rgba(19, 15, 24, 0.1) 0px 0px 0px 2px, rgba(115, 229, 191...` | `--shadow-subtle` |
| subtle-2 | `rgb(197, 255, 231) 0px 1px 1px 0px inset` | `--shadow-subtle-2` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 40px
- **Element gap:** 16px

## Components

### Primary CTA Button (Mint)
**Role:** Hero and section-level call-to-action

Mint green (#73e5bf) filled button, white text in SF Pro Text 16px weight 600, 12px border-radius, 12px vertical / 24px horizontal padding. Carries a distinctive three-layer shadow: 2px inner ring in dark plum (#130f18 at 0.1), plus a 25px-blur outer glow and 10px-blur close glow both in mint (#73e5bf at 0.2) — the glow makes the button feel lit from within, like an LED indicator rather than a flat button.

### Header CTA Button (Jam Pink)
**Role:** Persistent navigation call-to-action

Hot pink (#ff4070) filled button in the top nav, white text, 12px radius, 10px vertical / 16px horizontal padding. Smaller and more compact than the hero CTA — it is the always-visible entry point. No glow shadow, just a solid fill that acts as the brand beacon.

### Ghost Nav Button
**Role:** Secondary navigation action (Log in)

Transparent or near-black fill (#21192a), 1px border in #e5e7eb, white text at 14px weight 500, 8px radius, 8px/16px padding. Quiet by design — it sits next to the pink CTA and defers to it.

### Product Screenshot Card
**Role:** Hero visual — the Jam extension UI mockup

White (#ffffff) surface, 24px radius, generous internal padding (~32–40px), subtle drop shadow against the dark canvas. This is the only true white surface on the entire site — the contrast inversion is deliberate, making the product look like a real window floating on a dark desktop.

### Feature Pill
**Role:** Inline feature tags in the 'Never explain another bug' section

Pill shape (9999px radius), dark fill (#21192a), 1px border in #e5e7eb, icon + label layout. Icons rendered in Electric Violet (#a37af5) with 1.5px stroke weight. Label text in SF Pro Text 14px weight 500, white. 12px vertical / 20px horizontal padding. The pill shape signals 'category' and the violet icons are the only color on the element.

### Testimonial Card
**Role:** Social proof card with user photo and company

Graphite Plum (#21192a) surface, 24px radius, 40px padding, centered layout. Circular avatar (80px) at top, name in white SF Pro Text 16px weight 600, role in Mist Gray (#8b94a3) 14px weight 400, quote in white 15px weight 400, company logo at bottom in white. 1px border in #e5e7eb for definition. No shadow — the surface color does the elevation work.

### Company Logo Bar
**Role:** Trust bar with customer logos

Horizontal row of 6+ company logos, all rendered in white or #e5e7eb at uniform height (~24px). No logos are colored — the grayscale treatment keeps the focus on the wordmarks as trust signals rather than visual noise. Spaced evenly with 52px gaps.

### Trust Badge Row
**Role:** Social proof under hero CTA

Inline row: 5 mint (#73e5bf) or white star icons, followed by text in Mist Gray 13px. Centered, sits 16px below the CTA. Compact and calm — it is evidence, not decoration.

### Gradient Text Accent
**Role:** Decorative gradient on a single keyword in the hero headline

Applied to the word 'love' in the hero. Uses a 85-degree linear gradient from mint (#73e5bf) to violet (#a37af5), or a horizontal gradient from violet (#a37af5) to pink (#ff4070). Oldschool Grotesk 900 weight, same size as the surrounding white headline. The gradient is the only place where multiple brand colors coexist in text.

### Status Toggle (On Pill)
**Role:** Active/recording indicator within the product UI

Small pill inside the product card showing a green dot + 'On' label. Mint (#73e5bf) text and dot, transparent background, 8px radius, 4px/10px padding. This is a product-UI element visible in the hero mockup, not a marketing-page component, but it reinforces the mint-as-status color rule.

### Navigation Bar
**Role:** Sticky top navigation

Full-width, dark fill (#130f18), 8px vertical padding. Left: Jam wordmark in #ff4070 + nav links (Docs, Pricing, Blog, etc.) in #8b94a3. Right: Ghost 'Log in' button + Pink 'Get started for free' CTA. 20–24px horizontal padding on the container. No border-bottom — the dark canvas blends seamlessly.

### Top Banner Pill (Try Jam MCP)
**Role:** Optional announcement pill above the hero

Small pill centered above the hero headline. Dark fill (#21192a), 1px border in #e5e7eb, 9999px radius, 6px/12px padding. Text in Mist Gray 12px with a right arrow. Designed to be dismissible and quiet.

## Do's and Don'ts

### Do
- Use Oldschool Grotesk weight 900 at 66–116px for all hero and section headlines — this is the brand's voice, not a suggestion
- Fill primary action buttons only with Signal Mint (#73e5bf) and pair them with the three-layer green glow shadow; never use mint for text, borders, or decorative elements
- Use Jam Pink (#ff4070) exclusively for the wordmark and the persistent header CTA — it is the brand beacon, not a general accent
- Set body text in Mist Gray (#8b94a3) at 14–15px weight 400–500; use white (#ffffff) only for headlines, button text, and the floating product card surface
- Define every card and list boundary with a 1px border in #e5e7eb rather than a shadow — the system uses border-lines, not elevation, to separate surfaces
- Apply the 85-degree mint-to-violet gradient or the horizontal violet-to-pink gradient to exactly one keyword per hero headline for chromatic punctuation
- Use Electric Violet (#a37af5) at 1.5px stroke weight for icons inside feature pills and secondary UI icons

### Don't
- Do not create filled buttons in violet, pink, or white — mint (#73e5bf) is the only button fill color in the primary action system
- Do not use SF Pro Text at display sizes — headlines belong to Oldschool Grotesk exclusively; mixing display fonts breaks the typographic hierarchy
- Do not add drop shadows to cards or panels — the system relies on surface color steps (#130f18 → #21192a → #2e2d36) and 1px borders for depth, not shadows
- Do not use white (#ffffff) for card backgrounds outside the single floating product screenshot — the white surface is a one-per-page design device
- Do not use warm reds, oranges, or yellows — the chromatic palette is mint, violet, and pink only; introducing a fourth hue breaks the cool-electric mood
- Do not letter-space the display font — Oldschool Grotesk's compressed geometry only works at default tracking; adding letter-spacing would make 116px headlines look airy and weak
- Do not place text directly on the canvas without testing contrast — use Graphite Plum (#21192a) for any text container, never #130f18 alone for text-on-surface scenarios

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas | `#130f18` | Page background, hero section, footer — the base dark void |
| 1 | Card | `#21192a` | Testimonial cards, feature lists, nested content blocks |
| 2 | Elevated | `#2e2d36` | Inner card surfaces, slightly lifted containers |
| 3 | Product Surface | `#ffffff` | Floating product screenshot mockup — the only light surface, designed to pop against the dark canvas |

## Elevation

- **Primary CTA Button (Mint):** `rgba(19, 15, 24, 0.1) 0px 0px 0px 2px, rgba(115, 229, 191, 0.2) 0px 20px 25px -5px, rgba(115, 229, 191, 0.2) 0px 8px 10px -6px`
- **Product Screenshot Card:** `Subtle dark-tinted drop shadow implied by separation from canvas — not a heavy elevation system`

## Imagery

Minimal and product-first. The hero is dominated by a white product screenshot card showing the Jam extension UI (Capture Screenshot, Record Tab, Instant Replay, Create link) — a realistic in-app frame, not a marketing illustration. A 3D gradient cursor arrow points at the 'Create link' button for emphasis. The testimonial section uses circular real-photo headshots (not illustrations) and grayscale company wordmarks (Underarmour, deel., SEATGEEK, toast, etc.). No hero photography, no lifestyle imagery, no abstract decorative graphics. The visual language is: show the product, show the people, show the logos — nothing else.

## Layout

Centered, max-width 1200px container with a single-column hero stack. Hero is full-viewport-height on desktop with a centered headline, subtitle, product card mockup, CTA, and trust badge stacked vertically. Feature pills sit in a single horizontal row of 5 below the 'Never explain another bug' headline. Testimonial section uses a horizontal scrollable row of equal-width cards (5 visible at once). Company logo bar is a single horizontal row centered in the page. Sections are separated by generous vertical rhythm (80px) rather than dividers or alternating background bands — the entire page shares the same #130f18 canvas. Navigation is a fixed top bar with logo-left, links-center, CTAs-right.

## Agent Prompt Guide

## Quick Color Reference
- Text primary: #ffffff
- Text secondary: #8b94a3 (Mist Gray)
- Background: #130f18 (Obsidian Plum)
- Card surface: #21192a (Graphite Plum)
- Border: #e5e7eb (Bone)
- Accent / status: #73e5bf (Signal Mint)
- primary action: no distinct CTA color
No distinct primary action color was observed; use the extracted neutral button treatments instead of inventing a filled CTA color.
- Decorative icon accent: #a37af5 (Electric Violet)

## Example Component Prompts


2. **Feature Pill Row**: Five pills in a horizontal row, each 9999px radius, #21192a fill, 1px border in #e5e7eb, 12px/20px padding. Each pill has a 1.5px-stroke icon in #a37af5 on the left and label text in #ffffff SF Pro Text 14px weight 500. Labels: 'Device + browser', 'Console logs', 'Network logs', 'Repro steps', 'Backend tracing'.

3. **Testimonial Card**: 24px radius, #21192a fill, 40px padding, 1px border in #e5e7eb. Circular 80px avatar at top center, name in #ffffff 16px weight 600, role in #8b94a3 14px weight 400, quote in #ffffff 15px weight 400 centered, company wordmark in #ffffff at 24px height at the bottom.

4. **Top Navigation Bar**: Full-width, #130f18 fill, no border. Left: 'JAM' wordmark in #ff4070 Oldschool Grotesk 16px weight 900, followed by nav links in #8b94a3 SF Pro Text 14px. Right: Ghost 'Log in' button (transparent fill, 1px #e5e7eb border, #ffffff text, 8px radius) and pink 'Get started for free' button (#ff4070 fill, #ffffff text, 12px radius, 8px/16px padding).

5. **Company Logo Bar**: Horizontal row of 6 company wordmarks, all rendered in #e5e7eb at uniform 24px height, spaced with 52px gaps, centered in the page.

## Similar Brands

- **Linear** — Same dark-mode discipline with one vivid accent color, massive geometric display headlines, and hairline-bordered cards instead of shadow-elevated panels
- **Vercel** — Near-black canvas with ultra-bold display type and the same restrained single-accent approach to CTAs
- **Raycast** — Developer-tool aesthetic with dark surfaces, compressed grotesk headlines, and pill-shaped interactive controls
- **Loom** — Direct category neighbor (async video/bug reporting) with a product-screenshot-first hero on a dark canvas and gradient text accents in headlines
- **Cursor** — AI developer tool with the same dark-canvas-plus-electric-accent visual language and oversized display headlines that command the viewport

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-obsidian-plum: #130f18;
  --color-graphite-plum: #21192a;
  --color-smoke-plum: #2e2d36;
  --color-ink-border: #252542;
  --color-carbon: #25292e;
  --color-mist-gray: #8b94a3;
  --color-soft-mist: #d0cfd1;
  --color-bone: #e5e7eb;
  --color-paper: #ffffff;
  --color-signal-mint: #73e5bf;
  --color-mint-halo: #c5ffe7;
  --color-electric-violet: #a37af5;
  --color-deep-violet: #744ec2;
  --color-lilac: #b89fd4;
  --color-mauve: #947fac;
  --color-jam-pink: #ff4070;

  /* Typography — Font Families */
  --font-oldschool-grotesk: 'Oldschool Grotesk', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-sf-pro-text: 'SF Pro Text', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-sf-mono: 'SF Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 11px;
  --leading-caption: 1.43;
  --tracking-caption: -0.28px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.33;
  --tracking-heading-sm: -0.6px;
  --text-heading: 66px;
  --leading-heading: 1.1;
  --text-heading-lg: 88px;
  --leading-heading-lg: 1;
  --text-display: 116px;
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
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-52: 52px;
  --spacing-56: 56px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-96: 96px;
  --spacing-196: 196px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 40px;
  --element-gap: 16px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 18px;
  --radius-3xl: 24px;
  --radius-full: 9999px;

  /* Named Radii */
  --radius-nav: 8px;
  --radius-cards: 24px;
  --radius-pills: 9999px;
  --radius-inputs: 12px;
  --radius-buttons: 12px;

  /* Shadows */
  --shadow-subtle: rgba(19, 15, 24, 0.1) 0px 0px 0px 2px, rgba(115, 229, 191, 0.2) 0px 20px 25px -5px, rgba(115, 229, 191, 0.2) 0px 8px 10px -6px;
  --shadow-subtle-2: rgb(197, 255, 231) 0px 1px 1px 0px inset;

  /* Surfaces */
  --surface-canvas: #130f18;
  --surface-card: #21192a;
  --surface-elevated: #2e2d36;
  --surface-product-surface: #ffffff;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-obsidian-plum: #130f18;
  --color-graphite-plum: #21192a;
  --color-smoke-plum: #2e2d36;
  --color-ink-border: #252542;
  --color-carbon: #25292e;
  --color-mist-gray: #8b94a3;
  --color-soft-mist: #d0cfd1;
  --color-bone: #e5e7eb;
  --color-paper: #ffffff;
  --color-signal-mint: #73e5bf;
  --color-mint-halo: #c5ffe7;
  --color-electric-violet: #a37af5;
  --color-deep-violet: #744ec2;
  --color-lilac: #b89fd4;
  --color-mauve: #947fac;
  --color-jam-pink: #ff4070;

  /* Typography */
  --font-oldschool-grotesk: 'Oldschool Grotesk', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-sf-pro-text: 'SF Pro Text', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-sf-mono: 'SF Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 11px;
  --leading-caption: 1.43;
  --tracking-caption: -0.28px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.33;
  --tracking-heading-sm: -0.6px;
  --text-heading: 66px;
  --leading-heading: 1.1;
  --text-heading-lg: 88px;
  --leading-heading-lg: 1;
  --text-display: 116px;
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
  --spacing-52: 52px;
  --spacing-56: 56px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-96: 96px;
  --spacing-196: 196px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 18px;
  --radius-3xl: 24px;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-subtle: rgba(19, 15, 24, 0.1) 0px 0px 0px 2px, rgba(115, 229, 191, 0.2) 0px 20px 25px -5px, rgba(115, 229, 191, 0.2) 0px 8px 10px -6px;
  --shadow-subtle-2: rgb(197, 255, 231) 0px 1px 1px 0px inset;
}
```
