# LaunchDarkly — Style Reference
> Neon control room — a dark cockpit where violet signals pulse through charcoal panels.

**Theme:** dark

LaunchDarkly is a midnight control room: deep charcoal canvas, cool violet-blue as the only chromatic voice, and white type that cuts through like console output. The interface is dense and technical without feeling cluttered — it borrows the visual language of developer tools (monospace code, panel grids, pill-shaped inputs) and wraps it in a confident marketing skin. The violet→blue gradient (#405bff → #7084ff) acts as the brand's electronic pulse, appearing in glows, hero text, active states, and decorative washes rather than flat fills. Components are pill-soft (30-60px radii dominate), borders are hairline-white on near-black, and elevation is communicated through glow rather than shadow.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Signal Violet | `linear-gradient(179deg, #405bff 1.06%, #7084ff 123.42%)` | `--color-signal-violet` | Hero text accent, link underlines, icon glows, decorative gradient endpoint — the brand's chromatic signature; used as paint, not fill; Hero ambient washes, card glow halos, decorative background floods |
| Voltage Blue | `#405bff` | `--color-voltage-blue` | Violet outline accent for tags, dividers, and focused UI edges. Do not promote it to the primary CTA color |
| Midnight Ink | `#0e0e0e` | `--color-midnight-ink` | Page canvas, deepest background layer |
| Carbon | `#191919` | `--color-carbon` | Surface level 1 — nav pill, card backgrounds, button fills, footer |
| Graphite | `#414042` | `--color-graphite` | Surface level 2 — elevated panels, card borders, secondary surfaces |
| Steel | `#58595b` | `--color-steel` | Input borders, inactive form fields |
| Slate | `#6d6e71` | `--color-slate` | Muted helper text, disabled labels |
| Fog | `#a7a9ac` | `--color-fog` | Secondary text, subtle borders, placeholder copy |
| Ash | `#d1d3d4` | `--color-ash` | Tertiary text, icon strokes, list dividers |
| Paper | `#ffffff` | `--color-paper` | Primary text, heading fills, icon strokes, card backgrounds in product-screenshot panels |
| Smoke | `#2c2c2c` | `--color-smoke` | List dividers, row separators in dense tables |
| Plasma Cyan | `#3dd6f5` | `--color-plasma-cyan` | Secondary gradient endpoint — used sparingly in radial glows for atmospheric warmth |

## Tokens — Typography

### bodyFont — bodyFont — detected in extracted data but not described by AI · `--font-bodyfont`
- **Weights:** 400, 500, 600, 700
- **Sizes:** 12px, 13px, 14px, 15px, 16px, 18px, 20px, 22px, 24px, 26px, 28px, 32px, 36px, 40px, 66px, 84px, 85px, 100px, 125px
- **Line height:** 1, 1.09, 1.2, 1.3, 1.4, 1.5, 1.6, 1.71
- **Letter spacing:** 0.129, 0.167
- **Role:** bodyFont — detected in extracted data but not described by AI

### Sohne / custom grotesk — Primary interface and display typeface. Weight 500 dominates headings — heavier than typical marketing sites (400-600) but lighter than editorial displays (700-800), landing in a confident middle register. The largest sizes (84-125px) carry very tight line-height (1.0-1.09), letting headlines stack as a solid block of type. Letter-spacing opens up to 0.129-0.167em on small uppercase labels (eyebrows, tags) but stays normal on body and display. · `--font-sohne-custom-grotesk`
- **Substitute:** Inter, Geist, Söhne (if licensed), or Space Grotesk
- **Weights:** 400, 500, 600, 700
- **Sizes:** 12, 13, 14, 15, 16, 18, 20, 22, 24, 26, 28, 32, 36, 40, 66, 84, 85, 100, 125
- **Line height:** 1.20, 1.30, 1.40, 1.50, 1.60
- **Role:** Primary interface and display typeface. Weight 500 dominates headings — heavier than typical marketing sites (400-600) but lighter than editorial displays (700-800), landing in a confident middle register. The largest sizes (84-125px) carry very tight line-height (1.0-1.09), letting headlines stack as a solid block of type. Letter-spacing opens up to 0.129-0.167em on small uppercase labels (eyebrows, tags) but stays normal on body and display.

### Sohne Mono / JetBrains Mono — Code snippets, SDK names, technical labels. Normal letter-spacing, 1.50-1.65 line-height for readability. Appears in the hero email input and the 'Copy, paste, go.' code block. · `--font-sohne-mono-jetbrains-mono`
- **Substitute:** JetBrains Mono, IBM Plex Mono, Geist Mono
- **Weights:** 400
- **Sizes:** 14, 16, 20, 22
- **Line height:** 1.50, 1.65
- **Role:** Code snippets, SDK names, technical labels. Normal letter-spacing, 1.50-1.65 line-height for readability. Appears in the hero email input and the 'Copy, paste, go.' code block.

### monoFont — monoFont — detected in extracted data but not described by AI · `--font-monofont`
- **Weights:** 400
- **Sizes:** 16px, 20px, 22px
- **Line height:** 1.09, 1.5, 1.65
- **Role:** monoFont — detected in extracted data but not described by AI

### Arial — Arial — detected in extracted data but not described by AI · `--font-arial`
- **Weights:** 400
- **Sizes:** 13px
- **Line height:** 1.2
- **Role:** Arial — detected in extracted data but not described by AI

### Helvetica — Helvetica — detected in extracted data but not described by AI · `--font-helvetica`
- **Weights:** 400
- **Sizes:** 15px
- **Line height:** 1.5
- **Letter spacing:** 0.007
- **Role:** Helvetica — detected in extracted data but not described by AI

### headingFont1 — headingFont1 — detected in extracted data but not described by AI · `--font-headingfont1`
- **Weights:** 500
- **Sizes:** 125px
- **Line height:** 1
- **Role:** headingFont1 — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.5 | — | `--text-caption` |
| body-sm | 14px | 1.5 | — | `--text-body-sm` |
| body | 16px | 1.5 | — | `--text-body` |
| subheading | 20px | 1.4 | — | `--text-subheading` |
| heading-sm | 24px | 1.3 | — | `--text-heading-sm` |
| heading | 36px | 1.2 | — | `--text-heading` |
| heading-lg | 66px | 1.09 | — | `--text-heading-lg` |
| display | 100px | 1 | — | `--text-display` |

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
| 72 | 72px | `--spacing-72` |
| 80 | 80px | `--spacing-80` |
| 104 | 104px | `--spacing-104` |
| 120 | 120px | `--spacing-120` |
| 160 | 160px | `--spacing-160` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 30px |
| cards | 30px |
| inputs | 10px |
| buttons | 30px |
| navPill | 60px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| lg | `rgba(0, 0, 0, 0.45) 0px 4px 20px 0px` | `--shadow-lg` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80-120px
- **Card padding:** 32-48px
- **Element gap:** 16-24px

## Components

### Floating Nav Pill
**Role:** Primary site navigation

Centered floating pill at top of viewport, 60px radius, Carbon (#191919) fill, 1px white-alpha border. Contains: logo with arrow icon, nav links (Platform, Solutions, Resources, Developers, Pricing) with chevron dropdowns, Sign In text link, Sandbox text link, and Voltage Blue (#405bff) 'Get a demo' button. Sits 16-24px from viewport top with horizontal margin. No traditional header bar — the pill IS the header.

### Primary Action Button
**Role:** Main CTA

Voltage Blue (#405bff) fill, white text, 30px radius, 16px vertical × 24px horizontal padding. Used for 'Get a demo' in nav and 'Get started' in hero form. No border, no shadow — the saturated blue is enough presence.

### Hero Form Input
**Role:** Email capture

Large dark input with Carbon (#191919) fill, 10px radius, 1px subtle border. Internal layout: email field (white text, #58595b placeholder) fills left, Voltage Blue 'Get started' button fills right. The whole composite has a soft blue glow halo (rgba(64,91,255,0.25) box-shadow) making it feel like a glowing console. Approximately 600px wide, centered, with generous vertical padding (~16-20px).

### Segmented Tab Control
**Role:** Section navigation

Three-tab pill control (Release / Observe / Iterate) with 30px radius, Carbon fill, 1px border. Active tab indicated by a small Voltage Blue dot to the left of the label and brighter white text. Inactive tabs use Ash (#d1d3d4) text. Centered above a two-column section.

### Feature Checklist Item
**Role:** Section bullet list

Checkmark icon in Voltage Blue or white, followed by white text at ~16-18px. No background, no card. Vertical stack with 12-16px gap between items.

### Sub-feature Card
**Role:** Linked feature callout

Semi-transparent dark card with subtle violet/blue glow at edges, rounded 16-20px radius. Contains: small icon (blue or violet), white label text, right-arrow icon. Sits inside a larger section as a navigational sub-element.

### Product Screenshot Panel
**Role:** Embedded UI demonstration

Pure white (#ffffff) card with 12-20px radius and soft shadow, containing the actual LaunchDarkly product interface (pipeline configuration). Contrasts sharply with the dark page — the product UI is always shown as 'light' even on the dark marketing page, signaling that the real tool has its own bright workspace.

### Code Snippet Block
**Role:** SDK code example

Dark Carbon (#191919) panel with 12-16px radius, containing syntax-highlighted code. Language tabs (JavaScript / Python / iOS / React) at top in Ash text with active language in white. Code uses mono font at 14-16px with Dracula-inspired syntax colors (green strings, cyan keywords, pink literals). Copy button in top-right corner.

### SDK/Resource Card
**Role:** Linkable resource tile

Dark card (Carbon fill) with 1px white-alpha border, 20-30px radius, 32-40px padding. Contains: small icon top-left, white heading text (~18-20px weight 500), white subtext at 14-15px weight 400. Used in grids of 3 columns to link to Docs, Demo Project, Discord, etc.

### Logo Strip
**Role:** Social proof

Horizontal row of grayscale partner/customer logos (SpaceX, Tricentis, GoPro, Volvo, Ally, Priceline) at ~70% opacity, Ash or Fog tone. Logos are rendered in white-alpha on the dark background — no boxes, no borders, just quiet type marks.

### Hero Headline
**Role:** Primary page heading

Two-line display headline at 84-100px, weight 500, line-height 1.0-1.09. First line in white ('Move at AI speed.'), second line in Signal Violet ('Stay in control.'). The violet second line is the signature — the brand literally colorizes its differentiator. Letter-spacing tight (normal or slight negative).

### Ghost / Outlined Action
**Role:** Secondary CTA

Transparent fill with 1px Signal Violet (#7084ff) border, Signal Violet text, 30px radius. Used for secondary actions where the primary blue button already exists. The violet outline echoes the hero accent — secondary actions share the brand's signature hue rather than fading to neutral.

## Do's and Don'ts

### Do
- Use 30px radius for all buttons, tags, and cards — the pill-softness is non-negotiable for this brand
- Use 60px radius for the top navigation pill and any full-width pill containers
- Use Signal Violet (#7084ff) for the second half of hero headlines to split the message into 'what' (white) and 'why it matters' (violet)
- Render embedded product screenshots as pure white panels on the dark canvas — the contrast signals 'this is the real workspace'
- Use the #405bff → #7084ff linear gradient at 179deg for ambient glows behind cards and hero text
- Set body text at 16-18px weight 400, white on Carbon — never below 14px for readability on dark
- Use mono font for SDK names, code, and technical identifiers — the monospace voice is part of the developer-tool identity

### Don't
- Don't use square corners or small radii (4-8px) on user-facing components — they break the pill language
- Don't use drop shadows for elevation — use glow (rgba(64,91,255,0.25) or rgba(112,132,255,0.19)) instead to stay on-brand
- Don't introduce additional accent colors — the entire system is monochromatic-plus-violet; adding green, red, or yellow dilutes the signal
- Don't use white or gray for primary action buttons — Voltage Blue (#405bff) is the only correct fill for a main CTA
- Don't center-align body copy or feature lists — only headlines and hero blocks center; everything else is left-aligned
- Don't use 1.5+ line-height on display headlines — keep it tight (1.0-1.09) so the type stacks as a solid block
- Don't put dark product screenshots on the page — the real product UI is always bright/white, creating the page's key visual tension

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Midnight Canvas | `#0e0e0` | Page background — the void beneath everything |
| 1 | Carbon Panel | `#191919` | Nav pill, footer, primary card surface |
| 2 | Graphite Edge | `#414042` | Card borders, elevated panel outlines, subtle separation on dark |
| 3 | Product White | `#ffffff` | Embedded product screenshots — the LaunchDarkly pipeline UI appears as a bright white card floating on the dark canvas |

## Elevation

- **Floating Nav Pill:** `0 4px 20px rgba(0, 0, 0, 0.45)`
- **Hero Form Input:** `0 0 40px rgba(64, 91, 255, 0.25)`

## Imagery

Imagery is sparse and functional. The primary visual content is embedded product UI screenshots — bright white panels showing the LaunchDarkly pipeline interface floating on the dark page. The hero has no photography or illustration; it relies on type, glow, and a large form input. Customer logos appear as a grayscale strip. The code-snippet section uses syntax-highlighted mono text as a visual element. There is no lifestyle photography, no abstract 3D, no decorative illustration — the brand's visual language is the product itself, the code, and the type.

## Layout

Full-bleed dark canvas with max-width 1200px content containers centered inside. The hero is a tall vertical block (80-100vh) with centered headline + subtext + form input stacked vertically with generous breathing room. Below the hero, sections alternate between two-column layouts (text-left / product-screenshot-right) and three-column card grids. The floating nav pill sits fixed at top center. Section gaps are large (80-120px) to let the dark canvas breathe between content blocks. Content rhythm: hero → logo strip → tabbed feature section (2-col) → code integration section (2-col) → resource card grid (3-col).

## Agent Prompt Guide

**Quick Color Reference**
- text: #ffffff
- background: #0e0e0e
- card/surface: #191919
- border: rgba(255,255,255,0.1) or #414042
- accent: #7084ff
- primary action: #191919 (filled action)

**Example Component Prompts**
1. **Hero headline block**: Full-width dark section, centered. First line 'Move at AI speed.' at 96px weight 500, #ffffff, line-height 1.0. Second line 'Stay in control.' at 96px weight 500, #7084ff, line-height 1.0. Subtext below at 18px weight 400, #d1d3d4, max-width 560px centered.
2. Create a Primary Action Button: #191919 background, #ffffff text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.
3. **Floating nav pill**: Fixed top center, 60px border-radius, #191919 fill, 1px solid rgba(255,255,255,0.08) border, padding 8px 8px 8px 24px. Logo left, links in #d1d3d4 at 14px, 'Get a demo' button (Voltage Blue, white, 30px radius) right.
4. **Product screenshot card**: White #ffffff panel, 16px radius, 32px padding, contains embedded light-UI screenshot. Sits on dark canvas with a subtle rgba(64,91,255,0.2) glow.
5. **Code snippet block**: Dark #191919 panel, 12px radius, 24px padding. Language tabs at top (#d1d3d4 inactive, #ffffff active). Code in mono font 14px, syntax colors: strings #a6e22e, keywords #66d9ef, literals #f92672.

## Similar Brands

- **Linear** — Same dark-canvas + single-accent-glow approach; both treat the product UI itself as the hero visual, and both use pill-shaped inputs and tight type stacks.
- **Vercel** — Shares the monochrome dark palette with one chromatic accent, gradient-driven glow effects, and the practice of rendering product interfaces as bright white cards on a dark page.
- **Datadog** — Both use deep charcoal surfaces with violet/purple brand accents, and both embed real product dashboards (not mockups) as the primary visual proof.
- **Stripe** — Similar typographic confidence — large weight-500 display headlines, tight line-height, and the strategy of using color selectively on a subset of words in a headline for emphasis.

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-signal-violet: #7084ff;
  --gradient-signal-violet: linear-gradient(179deg, #405bff 1.06%, #7084ff 123.42%);
  --color-voltage-blue: #405bff;
  --color-midnight-ink: #0e0e0e;
  --color-carbon: #191919;
  --color-graphite: #414042;
  --color-steel: #58595b;
  --color-slate: #6d6e71;
  --color-fog: #a7a9ac;
  --color-ash: #d1d3d4;
  --color-paper: #ffffff;
  --color-smoke: #2c2c2c;
  --color-plasma-cyan: #3dd6f5;

  /* Typography — Font Families */
  --font-bodyfont: 'bodyFont', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-sohne-custom-grotesk: 'Sohne / custom grotesk', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-sohne-mono-jetbrains-mono: 'Sohne Mono / JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-monofont: 'monoFont', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-arial: 'Arial', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-helvetica: 'Helvetica', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-headingfont1: 'headingFont1', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --text-body-sm: 14px;
  --leading-body-sm: 1.5;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-subheading: 20px;
  --leading-subheading: 1.4;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.3;
  --text-heading: 36px;
  --leading-heading: 1.2;
  --text-heading-lg: 66px;
  --leading-heading-lg: 1.09;
  --text-display: 100px;
  --leading-display: 1;

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
  --spacing-72: 72px;
  --spacing-80: 80px;
  --spacing-104: 104px;
  --spacing-120: 120px;
  --spacing-160: 160px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80-120px;
  --card-padding: 32-48px;
  --element-gap: 16-24px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 10px;
  --radius-2xl: 20px;
  --radius-3xl: 30px;
  --radius-3xl-2: 40px;
  --radius-3xl-3: 46px;
  --radius-full: 60px;
  --radius-full-2: 100px;

  /* Named Radii */
  --radius-tags: 30px;
  --radius-cards: 30px;
  --radius-inputs: 10px;
  --radius-buttons: 30px;
  --radius-navpill: 60px;

  /* Shadows */
  --shadow-lg: rgba(0, 0, 0, 0.45) 0px 4px 20px 0px;

  /* Surfaces */
  --surface-midnight-canvas: #0e0e0;
  --surface-carbon-panel: #191919;
  --surface-graphite-edge: #414042;
  --surface-product-white: #ffffff;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-signal-violet: #7084ff;
  --color-voltage-blue: #405bff;
  --color-midnight-ink: #0e0e0e;
  --color-carbon: #191919;
  --color-graphite: #414042;
  --color-steel: #58595b;
  --color-slate: #6d6e71;
  --color-fog: #a7a9ac;
  --color-ash: #d1d3d4;
  --color-paper: #ffffff;
  --color-smoke: #2c2c2c;
  --color-plasma-cyan: #3dd6f5;

  /* Typography */
  --font-bodyfont: 'bodyFont', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-sohne-custom-grotesk: 'Sohne / custom grotesk', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-sohne-mono-jetbrains-mono: 'Sohne Mono / JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-monofont: 'monoFont', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-arial: 'Arial', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-helvetica: 'Helvetica', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-headingfont1: 'headingFont1', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --text-body-sm: 14px;
  --leading-body-sm: 1.5;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-subheading: 20px;
  --leading-subheading: 1.4;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.3;
  --text-heading: 36px;
  --leading-heading: 1.2;
  --text-heading-lg: 66px;
  --leading-heading-lg: 1.09;
  --text-display: 100px;
  --leading-display: 1;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-72: 72px;
  --spacing-80: 80px;
  --spacing-104: 104px;
  --spacing-120: 120px;
  --spacing-160: 160px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 10px;
  --radius-2xl: 20px;
  --radius-3xl: 30px;
  --radius-3xl-2: 40px;
  --radius-3xl-3: 46px;
  --radius-full: 60px;
  --radius-full-2: 100px;

  /* Shadows */
  --shadow-lg: rgba(0, 0, 0, 0.45) 0px 4px 20px 0px;
}
```
