# Flying Papers — Style Reference
> Saturday morning cartoon confessional

**Theme:** light

Flying Papers operates like a Saturday-morning cartoon printed on thick riso cardstock: a flat muted-violet stage, a small cast of saturated confetti colors, and type so oversized it eats the viewport. The brand voice is loud, cheeky, and unrepentant — it doesn't ask for attention, it takes it. Every screen should feel like a single bold poster: one dominant display headline, one supporting character illustration, one inline action, and generous breathing room. Borders do the heavy lifting instead of shadows; color is used as paint, not data. Surfaces stay flat, edges stay sharp at 6px, and the only soft thing in the system is the 100px pill on the gate button.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Dusk Violet | `#8584bd` | `--color-dusk-violet` | Primary canvas and hero background — the stage that every other color performs on |
| Hi-Vis Yellow | `#f4ed36` | `--color-hi-vis-yellow` | Yellow accent for outlined action borders, linked labels, and lightweight interactive emphasis. Do not promote it to the primary CTA color |
| Buttery Yellow | `#f9cc73` | `--color-buttery-yellow` | Secondary display text and softer borders — a mellower sibling of Hi-Vis for when Hi-Vis would be too much |
| Lilac Shadow | `#61609a` | `--color-lilac-shadow` | Card and block backgrounds — a deeper violet for nested surfaces on the violet stage |
| Bubblegum Pink | `#f8c1ba` | `--color-bubblegum-pink` | Decorative borders and confetti accent — a warm pink used sparingly for pop |
| Matcha Cream | `#b5c995` | `--color-matcha-cream` | Decorative borders and confetti accent — a dusty sage for the secondary cast of cards |
| Magenta Punch | `#ac4f98` | `--color-magenta-punch` | Accent card surface — reserved for standout blocks that need to scream louder than the stage |
| Firecracker Red | `#c94245` | `--color-firecracker-red` | Red wash for highlight backgrounds, decorative bands, and soft emphasis behind content |
| Bone White | `#f9f5f2` | `--color-bone-white` | Hairline borders, dividers, input outlines, and card edges on light surfaces. Do not promote it to the primary CTA color |
| Ink Black | `#1a1a1a` | `--color-ink-black` | Body text, primary borders, and outlined button strokes — the near-black that does typographic work on cream surfaces |
| Pure Black | `#000000` | `--color-pure-black` | Hard borders, icons, and text on yellow surfaces — pure black where maximum edge contrast is needed |

## Tokens — Typography

### ObviouslyVariable — Display and large heading family — the only font loud enough for the system. Sizes scale from 18px body uses up to 341px poster-scale display. Tight 0.80–1.00 leading makes multi-line headlines stack into solid color blocks; calt is disabled so the wide geometric forms stay unornamented. Substitute: Founders Grotesk Condensed, Knockout, or Druk Wide. · `--font-obviouslyvariable`
- **Substitute:** Founders Grotesk Condensed
- **Weights:** 800, 900
- **Sizes:** 18, 20, 30, 100, 113, 130, 133, 149, 184, 241, 244, 341
- **Line height:** 0.80–1.00
- **Letter spacing:** 0.02em
- **OpenType features:** `"calt" 0`
- **Role:** Display and large heading family — the only font loud enough for the system. Sizes scale from 18px body uses up to 341px poster-scale display. Tight 0.80–1.00 leading makes multi-line headlines stack into solid color blocks; calt is disabled so the wide geometric forms stay unornamented. Substitute: Founders Grotesk Condensed, Knockout, or Druk Wide.

### DegularVariable — Ultra-small UI text — nav, footer micro-copy, and inline labels at 10px. The neutral workhorse that disappears next to the display voice. Substitute: Inter, IBM Plex Sans. · `--font-degularvariable`
- **Substitute:** Inter
- **Weights:** 400
- **Sizes:** 10
- **Line height:** 1.00
- **Letter spacing:** normal
- **Role:** Ultra-small UI text — nav, footer micro-copy, and inline labels at 10px. The neutral workhorse that disappears next to the display voice. Substitute: Inter, IBM Plex Sans.

### bergen_monoregular — Monospaced micro-type for nav, tags, and small data labels — provides a typewriter rhythm against the rounded display. The 0.80 leading on monospace is signature: mono stacked tight feels like a receipt. Substitute: JetBrains Mono, IBM Plex Mono. · `--font-bergenmonoregular`
- **Substitute:** JetBrains Mono
- **Weights:** 400, 600
- **Sizes:** 12, 14
- **Line height:** 0.80, 1.00
- **Letter spacing:** normal
- **OpenType features:** `"calt" 0`
- **Role:** Monospaced micro-type for nav, tags, and small data labels — provides a typewriter rhythm against the rounded display. The 0.80 leading on monospace is signature: mono stacked tight feels like a receipt. Substitute: JetBrains Mono, IBM Plex Mono.

### DegularDisplay-Bold — Small bold body text for CTAs, button labels, and emphasized micro-copy. The 0.05em tracking opens the letterforms enough to read at 16px without crowding. Substitute: Degular Bold, Söhne Bold. · `--font-degulardisplay-bold`
- **Substitute:** Söhne Bold
- **Weights:** 700
- **Sizes:** 16
- **Line height:** 1.00
- **Letter spacing:** 0.05em
- **Role:** Small bold body text for CTAs, button labels, and emphasized micro-copy. The 0.05em tracking opens the letterforms enough to read at 16px without crowding. Substitute: Degular Bold, Söhne Bold.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 10px | 1 | — | `--text-caption` |
| body | 16px | 1 | 0.8px | `--text-body` |
| body-lg | 18px | 0.9 | 0.36px | `--text-body-lg` |
| subheading | 30px | 0.9 | 0.6px | `--text-subheading` |
| heading-sm | 100px | 0.9 | 2px | `--text-heading-sm` |
| heading | 149px | 0.85 | 2.98px | `--text-heading` |
| heading-lg | 184px | 0.85 | 3.68px | `--text-heading-lg` |
| display | 341px | 0.8 | 6.82px | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 16 | 16px | `--spacing-16` |
| 20 | 20px | `--spacing-20` |
| 40 | 40px | `--spacing-40` |
| 60 | 60px | `--spacing-60` |
| 80 | 80px | `--spacing-80` |
| 160 | 160px | `--spacing-160` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 100px |
| cards | 6px |
| buttons | 100px |

### Layout

- **Section gap:** 40px
- **Card padding:** 17px
- **Element gap:** 17px

## Components

### Gate Pill Button
**Role:** Primary age-gate / entry action

The system's only primary action. Cream (#f9f5f2) fill, 100px border-radius, 17px horizontal padding, DegularDisplay-Bold 16px / 0.05em tracking in Pure Black (#000000). No drop shadow; the rounded pill shape and high contrast against the violet stage do all the work.

### Outlined Display Button
**Role:** Secondary action placed on hero surfaces

Transparent fill with a 2–3px Hi-Vis Yellow (#f4ed36) border. Hi-Vis Yellow text, DegularDisplay-Bold 16px, 17px horizontal padding, 100px radius. The border does the job of a fill — this is a chromatic outlined action, not a filled CTA.

### Underline Text Link
**Role:** Tertiary action (e.g. age-decline link)

Bone White (#f9f5f2) on the violet stage, no background, 1px underline. Bergen Mono 12px / 0.80 leading. Letter-spaced wide enough to feel like a disclaimer, not a button.

### Hero Display Headline
**Role:** Main page statement

ObviouslyVariable 800–900 at 184–341px, line-height 0.80–0.85, tracking 0.02em. Color alternates between Hi-Vis Yellow (#f4ed36) and Buttery Yellow (#f9cc73). Sized to fill 60–80% of viewport height. No max-width — type bleeds to the canvas edges.

### Brand Wordmark
**Role:** Site identification in nav

ObviouslyVariable 800 in Hi-Vis Yellow, 30px, centered above the hero. Acts as a single-line logo — the brand name IS the mark, no separate logotype.

### Mascot Illustration
**Role:** Character that accompanies the headline

Cartoon character with thick black outlines, cream fill, and flat color accents (Bone White, Hi-Vis Yellow). Renders behind or peeks through the display headline at viewport scale. No gradients, no shading — flat 2–3 color fills only.

### Confetti Card
**Role:** Decorative content blocks scattered across the page

Square or rectangular cards in one of the accent surface colors (Matcha Cream #b5c995, Bubblegum Pink #f8c1ba, Magenta Punch #ac4f98, Firecracker Red #c94245). 6px radius, 17px padding, no shadow, no border. Each card is a flat paint swatch — the color IS the content.

### Dark Text Card
**Role:** Text-heavy or information blocks

Bone White (#f9f5f2) fill, 6px radius, 17px padding, Ink Black (#1a1a1a) text. 1px Ink Black border optional. Uses DegularVariable or bergen_mono for body.

### Color Swatch Card
**Role:** Brand palette showcase

Solid fill in one of the brand or accent colors, 6px radius, 17px padding, with the color name and hex set in DegularDisplay-Bold 16px. Acts as both decoration and legend.

### Top Nav Bar
**Role:** Minimal site navigation

Transparent on the violet stage. Brand wordmark centered, no menu items visible at the hero. 17px padding top/bottom, 1px bottom border in Dusk Violet (#8584bd) or transparent.

### Mono Label Tag
**Role:** Category, date, or metadata tag

Bergen Mono 12px / 0.80 leading, no fill, optional 1px border in current text color. Letter-spaced 0.05em. Reads as a stamped label rather than a pill button.

### Footer Block
**Role:** End-of-page content

Solid block — often a brand or accent color (e.g. #375027 dark green observed). Bergen Mono 12px, Bone White text, 17–25px padding. No decorative borders.

## Do's and Don'ts

### Do
- Set hero display type between 184px and 341px in ObviouslyVariable 800–900, line-height 0.80–0.85, tracking 0.02em
- Use Hi-Vis Yellow (#f4ed36) as the only outlined action border; pair it with the Outlined Display Button pattern, never a filled button
- Stack one huge headline, one mascot illustration, and one inline action per screen — let the rest breathe
- Keep radii at exactly 6px for cards and 100px for buttons/tags — the contrast between sharp blocks and soft pills is the signature
- Place cards on the violet stage with 17px padding and no shadows; let the flat color fills do the visual work
- Use the accent palette (Bubblegum Pink, Matcha Cream, Magenta Punch, Firecracker Red) one card at a time, never side by side in the same row
- Set micro-copy in Bergen Mono at 12px with 0.80 leading — the tight mono stack is the receipts-on-cardstock texture

### Don't
- Don't introduce a filled CTA button — the system uses outlined Hi-Vis Yellow actions and pill cream buttons only
- Don't use ObviouslyVariable below 18px or above 341px — outside that range it loses its poster impact
- Don't add drop shadows, glow effects, or inner shadows — every surface is flat paint
- Don't combine more than two accent colors in a single composition — confetti is scattered, not confetti-confetti
- Don't soften the violet canvas with a white or cream page background — Dusk Violet (#8584bd) is the stage, not a section accent
- Don't round card corners past 6px — anything softer makes the system feel SaaS, not riso
- Don't use ObviouslyVariable's contextual alternates — calt is disabled everywhere to keep the wide geometric forms unornamented

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Dusk Violet Stage | `#8584bd` | Full-bleed page canvas and hero background |
| 1 | Bone White Card | `#f9f5f2` | Light card and button surface on the violet stage |
| 2 | Lilac Shadow Block | `#61609a` | Nested surface for content blocks sitting on the violet stage |
| 3 | Hi-Vis Yellow Surface | `#f4ed36` | Accent surface for the most important element on a given screen |
| 4 | Accent Paint Card | `#f8c1ba` | Decorative confetti card surface (alternates: #b5c995, #ac4f98, #c94245) |

## Elevation

Elevation is intentionally absent. The system is flat risograph: depth comes from color contrast and stacking order, never from shadows. A 6px card on the violet stage reads as a printed swatch, not a floating panel.

## Imagery

Illustration-only — no photography, no 3D renders, no abstract gradients. The visual language is hand-drawn cartoon with thick black outlines (2–3px), flat 2–3 color fills, and no shading. Characters are mascots that interact with the type (peeking, leaning, standing on a letter). Icons are line-drawn in Pure Black or Bone White, 1.5–2px stroke. Imagery is decorative atmosphere first, never explanatory — the type carries the message, the character carries the mood.

## Layout

Full-bleed poster layouts with no max-width constraint. Each screen is a single viewport-sized composition: one massive ObviouslyVariable headline centered or left-aligned, one mascot illustration overlapping the type, and a small inline action below. Sections do not alternate light and dark — the entire page sits on the Dusk Violet canvas with flat color cards dropped on top. Navigation is a single centered wordmark, no menu bar. Card grids are loose 2–3 column arrangements with generous 40px gaps; cards are sized by content, not uniform. Density is extreme: one idea per screen, surrounded by violet breathing room.

## Agent Prompt Guide

**Quick Color Reference**
- text on light: #1a1a1a
- text on yellow: #000000
- reverse text on violet: #f9f5f2
- background: #8584bd (Dusk Violet)
- card surface: #f9f5f2 (Bone White)
- accent: #f4ed36 (Hi-Vis Yellow) for the single most important element
- primary action: #f4ed36 (outlined action border)

**3 Example Component Prompts**

1. **Hero screen with mascot**: Full-bleed Dusk Violet (#8584bd) background. Centered brand wordmark 'Flying Papers' in ObviouslyVariable 800 at 30px, #f4ed36, top of viewport. Main headline at 244px ObviouslyVariable 900, line-height 0.82, letter-spacing 0.02em, fill #f4ed36 (alternating with #f9cc73 per word). A cartoon mascot illustration with 2px black outlines and flat fills, positioned to peek through the type near the vertical center. Below the headline, an Outlined Display Button: transparent fill, 2px #f4ed36 border, 100px radius, 17px horizontal padding, 'I'M OVER 18, LET ME IN' in DegularDisplay-Bold 16px, #f4ed36. Underneath, an Underline Text Link in #f9f5f2, Bergen Mono 12px, 0.80 leading, 1px underline.

2. **Confetti card grid section**: Dusk Violet (#8584bd) background continuing from hero. A loose 3-column grid of Confetti Cards with 40px gaps. Each card: solid fill in one of #f8c1ba, #b5c995, #ac4f98, or #c94245; 6px radius; 17px padding; no border, no shadow. Inside each card, a Mono Label Tag in Bergen Mono 12px / 0.80 leading, 0.05em tracking, in #1a1a1a or #f9f5f2 depending on card brightness, and a short body line in DegularVariable 16px.

3. **Color swatch legend block**: Bone White (#f9f5f2) card, 6px radius, 17px padding, sitting on the violet stage. Heading 'PALETTE' in DegularDisplay-Bold 16px, 0.05em tracking, #1a1a1a. Below it, a 2-row grid of Color Swatch Cards — each a 6px-radius square filled with one brand or accent color, with the hex value set in Bergen Mono 12px / 0.80 leading directly on the swatch in contrasting text.

## Similar Brands

- **Bumble** — Same fearless use of a single saturated yellow against a flat colored stage, with oversized rounded display type and pill-shaped actions
- **Skittles / candy brand microsites** — Confetti-bright accent palette scattered across a dominant canvas color, cartoon character mascots, and poster-scale headline type
- **Kakao Entertainment** — Heavy condensed display type at viewport scale, flat colored surfaces, and characters that break through the type
- **Dazed Magazine** — Riso-print aesthetic with loud display headlines, tight leading, and a limited but confident chromatic palette on a single stage color
- **Telfar** — Anti-corporate flat colored backgrounds, oversized custom display type, and pill buttons with bold black-on-cream contrast

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-dusk-violet: #8584bd;
  --color-hi-vis-yellow: #f4ed36;
  --color-buttery-yellow: #f9cc73;
  --color-lilac-shadow: #61609a;
  --color-bubblegum-pink: #f8c1ba;
  --color-matcha-cream: #b5c995;
  --color-magenta-punch: #ac4f98;
  --color-firecracker-red: #c94245;
  --color-bone-white: #f9f5f2;
  --color-ink-black: #1a1a1a;
  --color-pure-black: #000000;

  /* Typography — Font Families */
  --font-obviouslyvariable: 'ObviouslyVariable', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-degularvariable: 'DegularVariable', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-bergenmonoregular: 'bergen_monoregular', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-degulardisplay-bold: 'DegularDisplay-Bold', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1;
  --text-body: 16px;
  --leading-body: 1;
  --tracking-body: 0.8px;
  --text-body-lg: 18px;
  --leading-body-lg: 0.9;
  --tracking-body-lg: 0.36px;
  --text-subheading: 30px;
  --leading-subheading: 0.9;
  --tracking-subheading: 0.6px;
  --text-heading-sm: 100px;
  --leading-heading-sm: 0.9;
  --tracking-heading-sm: 2px;
  --text-heading: 149px;
  --leading-heading: 0.85;
  --tracking-heading: 2.98px;
  --text-heading-lg: 184px;
  --leading-heading-lg: 0.85;
  --tracking-heading-lg: 3.68px;
  --text-display: 341px;
  --leading-display: 0.8;
  --tracking-display: 6.82px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
  --font-weight-extrabold: 800;
  --font-weight-black: 900;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-40: 40px;
  --spacing-60: 60px;
  --spacing-80: 80px;
  --spacing-160: 160px;

  /* Layout */
  --section-gap: 40px;
  --card-padding: 17px;
  --element-gap: 17px;

  /* Border Radius */
  --radius-md: 6px;
  --radius-full: 100px;

  /* Named Radii */
  --radius-tags: 100px;
  --radius-cards: 6px;
  --radius-buttons: 100px;

  /* Surfaces */
  --surface-dusk-violet-stage: #8584bd;
  --surface-bone-white-card: #f9f5f2;
  --surface-lilac-shadow-block: #61609a;
  --surface-hi-vis-yellow-surface: #f4ed36;
  --surface-accent-paint-card: #f8c1ba;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-dusk-violet: #8584bd;
  --color-hi-vis-yellow: #f4ed36;
  --color-buttery-yellow: #f9cc73;
  --color-lilac-shadow: #61609a;
  --color-bubblegum-pink: #f8c1ba;
  --color-matcha-cream: #b5c995;
  --color-magenta-punch: #ac4f98;
  --color-firecracker-red: #c94245;
  --color-bone-white: #f9f5f2;
  --color-ink-black: #1a1a1a;
  --color-pure-black: #000000;

  /* Typography */
  --font-obviouslyvariable: 'ObviouslyVariable', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-degularvariable: 'DegularVariable', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-bergenmonoregular: 'bergen_monoregular', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-degulardisplay-bold: 'DegularDisplay-Bold', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1;
  --text-body: 16px;
  --leading-body: 1;
  --tracking-body: 0.8px;
  --text-body-lg: 18px;
  --leading-body-lg: 0.9;
  --tracking-body-lg: 0.36px;
  --text-subheading: 30px;
  --leading-subheading: 0.9;
  --tracking-subheading: 0.6px;
  --text-heading-sm: 100px;
  --leading-heading-sm: 0.9;
  --tracking-heading-sm: 2px;
  --text-heading: 149px;
  --leading-heading: 0.85;
  --tracking-heading: 2.98px;
  --text-heading-lg: 184px;
  --leading-heading-lg: 0.85;
  --tracking-heading-lg: 3.68px;
  --text-display: 341px;
  --leading-display: 0.8;
  --tracking-display: 6.82px;

  /* Spacing */
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-40: 40px;
  --spacing-60: 60px;
  --spacing-80: 80px;
  --spacing-160: 160px;

  /* Border Radius */
  --radius-md: 6px;
  --radius-full: 100px;
}
```
