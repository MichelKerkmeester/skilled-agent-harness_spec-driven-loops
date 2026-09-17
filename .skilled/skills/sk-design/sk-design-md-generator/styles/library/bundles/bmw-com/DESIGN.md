# BMW.com — Style Reference
> Gallery wall for sculpted metal — a typographic frame where the cars are the only color.

**Theme:** light

BMW.com uses an austere automotive showcase language: the UI recedes entirely so the product photography can speak. The interface is built from just two surfaces — pure white and a charcoal near-black — connected by a whisper-light display heading at 60px that signals premium through typographic restraint rather than weight. Every structural element (navigation, footer links, language switcher) is rendered as plain text with no decorative chrome, treating the web page as a typographic frame for the vehicles rather than a software interface. The signature choice is the 300-weight display face — a deliberate anti-convention in luxury automotive branding where most competitors default to 700–900 weights.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Carbon | `#262626` | `--color-carbon` | Body text, footer background, heading text on light surfaces — the near-black structural anchor |
| Pure White | `#ffffff` | `--color-pure-white` | Page canvas, header background, inverted text on dark footer |
| Concrete | `#bbbbbb` | `--color-concrete` | Muted helper text and secondary dividers on white surfaces, secondary text on dark footer |
| Fog | `#f1f1f1` | `--color-fog` | Alternate surface band, subtle card background where a step up from pure white is needed |

## Tokens — Typography

### BMWTypeNextLatin — Workhorse type family — 400 for body copy and nav links, 700 for inline emphasis and section labels, 900 reserved for brand wordmarks. Compact leading (1.20–1.30) on headings, generous (1.60+) on body. Custom typeface with squared geometric forms; substitute with Inter or Neue Haas Grotesk for close fidelity. · `--font-bmwtypenextlatin`
- **Substitute:** Inter
- **Weights:** 400, 700, 900
- **Sizes:** 16px, 18px
- **Line height:** 1.20, 1.30, 1.60, 1.63
- **Letter spacing:** normal
- **Role:** Workhorse type family — 400 for body copy and nav links, 700 for inline emphasis and section labels, 900 reserved for brand wordmarks. Compact leading (1.20–1.30) on headings, generous (1.60+) on body. Custom typeface with squared geometric forms; substitute with Inter or Neue Haas Grotesk for close fidelity.

### BMWTypeNextLatin Light — Display heading only — the 300 weight at 60px is the brand's anti-convention signature; it whispers rather than shouts, signaling premium through restraint. Used exclusively for the largest section title per page. Do not reuse for anything below 40px. · `--font-bmwtypenextlatin-light`
- **Substitute:** Inter Light
- **Weights:** 300
- **Sizes:** 60px
- **Line height:** 1.30
- **Letter spacing:** normal
- **Role:** Display heading only — the 300 weight at 60px is the brand's anti-convention signature; it whispers rather than shouts, signaling premium through restraint. Used exclusively for the largest section title per page. Do not reuse for anything below 40px.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| body-sm | 16px | 1.6 | — | `--text-body-sm` |
| body | 18px | 1.63 | — | `--text-body` |
| display | 60px | 1.3 | — | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** compact

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 8 | 8px | `--spacing-8` |
| 12 | 12px | `--spacing-12` |
| 16 | 16px | `--spacing-16` |
| 20 | 20px | `--spacing-20` |
| 24 | 24px | `--spacing-24` |
| 40 | 40px | `--spacing-40` |
| 56 | 56px | `--spacing-56` |
| 100 | 100px | `--spacing-100` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 0px |
| badges | 0px |
| inputs | 0px |
| buttons | 0px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 56px
- **Card padding:** 24px
- **Element gap:** 10-20px

## Components

### Top Navigation Bar
**Role:** Global site header

White background (#ffffff), no border, 5px top/bottom padding. BMW roundel logo left, tagline 'Sheer Driving Pleasure' in 16px weight 400 Carbon (#262626) immediately right of logo with a 12px gap, nav links and search icon right-aligned. No background blur, no shadow — sits flat on canvas.

### Full-Bleed Hero Image
**Role:** Product showcase

Edge-to-edge photograph filling the viewport width with no padding or margin, no overlay text or UI chrome. The image IS the content. Used to present vehicle details (wheels, badges, body panels) in dramatic close-up.

### Display Section Heading
**Role:** Page section title

BMWTypeNextLatin Light, weight 300, 60px, line-height 1.30, Carbon (#262626), centered alignment. The whisper-weight is the signature — never bold this. Below it, a single secondary link 'Find your BMW' at 16px weight 400 with a right-arrow glyph, 40px margin-top.

### Dark Footer Band
**Role:** Site footer with link columns

Carbon (#262626) background spanning full viewport width. White (#ffffff) text at 16px weight 400, organized in four flat columns: Quick Links, More BMW Websites, BMW.com, Visit us on. Column headers are plain white text — no bold, no underline. 45–56px top/bottom padding inside the band.

### Language Switcher
**Role:** Locale selector row

Horizontal row of plain text links inside the dark footer: English / Deutsch / Italiano / Français / Español / 日本語. 16px weight 400 white text, 24px horizontal spacing between items, no flags, no icons, no border or separator. The current language is not visually marked — selection is implicit through context.

### Footer Link
**Role:** Text-only navigation link

Pure text, 16px weight 400, white (#ffffff) on Carbon (#262626) background. No underline, no color shift, no background hover state. Multiline items wrap naturally. 10px row-gap between links in a column.

### Inline Arrow Link
**Role:** Action prompt link

e.g. '> Find your BMW' — a small right-pointing chevron glyph in Carbon (#262626) followed by label text at 16px weight 400. No underline, no button chrome. Centered below the display heading with 40px margin-top.

### Logo Lockup
**Role:** Brand mark with tagline

BMW roundel at native scale, 12px right margin, then 'Sheer Driving Pleasure' at 16px weight 400 Carbon. Logo and tagline sit on a shared baseline — no container, no border, no background.

## Do's and Don'ts

### Do
- Use BMWTypeNextLatin Light weight 300 at 60px for the single largest heading per page — it is the brand's typographic signature
- Let product photography fill the full viewport width with zero overlay UI — the image is the interface
- Use Carbon (#262626) for all body and heading text on white surfaces; the contrast is 15.1:1 AAA
- Keep all components borderless and shadowless — depth comes from surface polarity (white vs. #262626) and whitespace, never from elevation
- Set border-radius to 0 on all elements — the squared geometry is part of the automotive precision language
- Use the dark Carbon footer band as the only color contrast moment; keep all other content sections on white or Fog (#f1f1f1)
- Render navigation and footer items as plain text at 16px weight 400 — no pills, no chips, no decorative containers

### Don't
- Do not bold the display heading — weight 300 is non-negotiable; weight 700+ breaks the restraint
- Do not add drop shadows to cards, buttons, or navigation — the system is shadow-free by design
- Do not introduce accent colors, gradients, or decorative backgrounds — the only chromatic content is photography
- Do not add rounded corners to buttons, cards, or badges — keep all edges sharp at 0px
- Do not use color for hover, focus, or active states — underline or weight shift only
- Do not use the BMWTypeNextLatin Light variant for body copy or small sizes — it is reserved for 40px+ display use
- Do not overlay text, buttons, or UI controls on top of hero photography — keep the image uncontaminated

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas | `#ffffff` | Primary page background, header bar |
| 1 | Subtle Band | `#f1f1f1` | Alternate section background for quiet visual separation |
| 2 | Footer | `#262626` | Dark footer band — the only strong contrast surface on the page |

## Elevation

The design uses zero shadow elevation. Instead, depth and hierarchy are communicated through surface contrast alone: white sections sit directly on white, the dark footer band provides a single hard transition. Cards and modules have no drop shadow or border — they rely on whitespace, typography weight shifts, and the white/charcoal polarity.

## Imagery

Hero photography is the sole source of color and atmosphere on the page. The style is dramatic, dark, tightly cropped product photography: extreme close-ups of wheels, badges, grilles, and body panels with controlled studio lighting that produces deep blues, blacks, and metallic highlights against near-black backgrounds. Images are full-bleed, edge-to-edge with no rounded corners, no borders, no padding, and no overlay UI. The treatment is high-contrast and moody — not lifestyle, not contextual, not staged. Vehicles and components are isolated objects presented as sculptural artifacts, similar to a museum or gallery installation. Photography occupies 60–70% of the page real estate; text and UI chrome are deliberately minimal frames around it.

## Layout

Single-column, center-aligned vertical flow on a 1200px max-width content rail, with hero images breaking out to full-bleed edge-to-edge width. No multi-column grids, no sidebar, no card grids. Page rhythm: full-bleed hero image → centered display heading (60px Light) → centered inline arrow link → spacious white space → full-bleed dark footer band. Section gaps are 56px. Navigation is a single flat top bar — no sticky behavior, no mega-menu, no dropdowns. The footer is a flat dark band with four unstyled text columns and a language switcher row. Content density is sparse — each section earns its vertical space with large images and generous breathing room between them.

## Agent Prompt Guide

**Quick Color Reference**
- text: #262626
- background: #ffffff
- secondary surface: #f1f1f1
- dark surface: #262626
- border / muted text: #bbbbbb
- primary action: no distinct CTA color

**3-5 Example Component Prompts**

1. **Display Section Heading**: Render at 60px, BMWTypeNextLatin Light (or Inter Light substitute), weight 300, color #262626, line-height 1.30, centered. 40px below it, a small right-chevron (›) followed by 'Find your BMW' at 16px weight 400 in #262626, also centered.

2. **Top Navigation Bar**: White (#ffffff) background, 5px top/bottom padding. Left: BMW roundel at 32px native size, 12px gap, then 'Sheer Driving Pleasure' in 16px weight 400 #262626. Right: 'Home' text link at 16px weight 400 #262626, 24px gap, then a search icon (outline, 1.5px stroke, #262626). No border, no shadow.

3. **Full-Bleed Hero Image**: A dramatic full-width product photograph (e.g. close-up of a BMW wheel center) with no padding, no margin, no overlay text or controls. The image must fill 100% viewport width edge-to-edge.

4. **Dark Footer Band**: Background #262626, full viewport width, 56px top/bottom padding. Inside, a 1200px centered container with four columns of plain white text links: 'Quick Links', 'More BMW Websites', 'BMW.com', 'Visit us on'. All text 16px weight 400 #ffffff, 10px row-gap. Column headers are plain white text — no bold. Above the columns, a horizontal row: 'English / Deutsch / Italiano / Français / Español / 日本語' at 16px weight 400 #ffffff, 24px horizontal gaps, no separators.

5. **Alternate Surface Section**: Background #f1f1f1 (Fog), 56px top/bottom padding, centered content. Use this band sparingly — only when a quiet visual step-up from pure white is needed between two white sections.

## Color Philosophy

BMW.com's color system is intentionally non-system — there are no brand accents, no semantic colors, no interactive state colors. The UI is purely typographic and spatial. Color enters the experience exclusively through product photography, which is always deep blue-black metallic against dark backgrounds. This means an AI agent should never invent a CTA color, a success green, or an error red — those states are communicated through weight shifts, underlines, and whitespace, not hue. The contrast pair #262626 on #ffffff (15.1:1) is the system's entire interactive vocabulary: text either is or isn't there.

## Similar Brands

- **Porsche.com** — Same typographic-restraint approach — whisper-light display headings, product photography as the sole color, no UI chrome
- **Audi.com** — Identical near-black/white polarity with zero accent colors, large display headings, and full-bleed automotive photography
- **Volvo.com** — Minimal monochrome interface that steps back to let product imagery dominate, with sharp 0px geometry and borderless components
- **Bentley Motors** — Luxury automotive site with sparse typographic framing, large-scale Light-weight display faces, and dark footer band contrast
- **Tesla.com** — Full-bleed product photography with overlay-free heroes and a single light-weight display heading approach

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-carbon: #262626;
  --color-pure-white: #ffffff;
  --color-concrete: #bbbbbb;
  --color-fog: #f1f1f1;

  /* Typography — Font Families */
  --font-bmwtypenextlatin: 'BMWTypeNextLatin', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-bmwtypenextlatin-light: 'BMWTypeNextLatin Light', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-body-sm: 16px;
  --leading-body-sm: 1.6;
  --text-body: 18px;
  --leading-body: 1.63;
  --text-display: 60px;
  --leading-display: 1.3;

  /* Typography — Weights */
  --font-weight-light: 300;
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
  --spacing-40: 40px;
  --spacing-56: 56px;
  --spacing-100: 100px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 56px;
  --card-padding: 24px;
  --element-gap: 10-20px;

  /* Named Radii */
  --radius-cards: 0px;
  --radius-badges: 0px;
  --radius-inputs: 0px;
  --radius-buttons: 0px;

  /* Surfaces */
  --surface-canvas: #ffffff;
  --surface-subtle-band: #f1f1f1;
  --surface-footer: #262626;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-carbon: #262626;
  --color-pure-white: #ffffff;
  --color-concrete: #bbbbbb;
  --color-fog: #f1f1f1;

  /* Typography */
  --font-bmwtypenextlatin: 'BMWTypeNextLatin', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-bmwtypenextlatin-light: 'BMWTypeNextLatin Light', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-body-sm: 16px;
  --leading-body-sm: 1.6;
  --text-body: 18px;
  --leading-body: 1.63;
  --text-display: 60px;
  --leading-display: 1.3;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-40: 40px;
  --spacing-56: 56px;
  --spacing-100: 100px;
}
```
