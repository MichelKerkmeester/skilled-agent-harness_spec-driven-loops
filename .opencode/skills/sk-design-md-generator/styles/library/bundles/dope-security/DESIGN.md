# dope.security — Style Reference
> Midnight terminal with violet beacons

**Theme:** dark

dope.security is a midnight terminal aesthetic: near-black canvas, a single vivid violet signal flare, and typography that borrows from luxury travel editorial. The system pairs a geometric sans (Whyte Inktrap) with an italic display serif (GrandSlang) for hero drama and a monospaced inktrap with extreme tracking for the section labels that feel stamped from a boarding pass. Surfaces are flat and borderless; elevation comes from hairline strokes and translucent washes, never shadows. Color is rationed — the violet only appears as a glow, a fill on a single feature, and accent strokes — while the rest of the interface stays in a tight achromatic scale from #f7f9fa down to #090909. The result reads as confident, expensive, and slightly secretive, like a premium lounge at 2am with a single neon sign.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Near Black | `#090909` | `--color-near-black` | Page canvas, card surfaces, filled button backgrounds — the default void everything else floats in |
| Almost White | `#f7f9fa` | `--color-almost-white` | Primary text, icon strokes, nav labels, and 1px borders — the paper-white that does all the talking against the void |
| Soft White | `#f0f0f0` | `--color-soft-white` | Section label text in the stamped uppercase style — same family as Almost White but slightly dimmer for hierarchy |
| Steel | `#828384` | `--color-steel` | Muted secondary text, inactive button surfaces, subdued borders |
| Graphite | `#474747` | `--color-graphite` | Card internal text and subtle dividers — readable on the near-black without competing with the primary text |
| Iron | `#423738` | `--color-iron` | Dark borders and separators for elevated surfaces and inverted UI. Do not promote it to the primary CTA color |
| Ash | `#6b6b6b` | `--color-ash` | Nav border dividers, helper text, low-emphasis body copy |
| Signal Violet | `#af50ff` | `--color-signal-violet` | The only chromatic voice: feature card glow, primary action fill, and accent strokes — rationed like runway lighting, not decoration |
| Lavender Mist | `#e1bdff` | `--color-lavender-mist` | Soft tint paired with Signal Violet for contrast-safe text and washed background accents |

## Tokens — Typography

### Whyte Inktrap — Primary workhorse — body, nav, buttons, links, and most headings. The inktrap corners (the tiny cuts where straight strokes meet) are the signature; they give the geometry warmth without losing precision. Weight 300 carries the larger sizes and creates the editorial lightness that pairs with the GrandSlang italic. · `--font-whyte-inktrap`
- **Substitute:** Inter, General Sans
- **Weights:** 300, 400, 500, 700
- **Sizes:** 10, 12, 14, 16, 18, 20, 24, 28, 32, 40, 48, 50, 64, 80, 88
- **Line height:** 1.0–1.6
- **Letter spacing:** Tight on display: -0.04em at 64px, -0.03em at 48px, -0.01em at 20px, 0 at 16px, wide on labels: 0.07em at 12px uppercase, 0.18em at 10px uppercase
- **Role:** Primary workhorse — body, nav, buttons, links, and most headings. The inktrap corners (the tiny cuts where straight strokes meet) are the signature; they give the geometry warmth without losing precision. Weight 300 carries the larger sizes and creates the editorial lightness that pairs with the GrandSlang italic.

### Whyte Inktrap Mono — The stamped-letterhead voice: 74px uppercase sections like 'SSL INSPECTION' and 'URL FILTERING' with 0.2em tracking. The mono is intentionally mechanical against the humanist Whyte to create the boarding-pass rhythm. This font does the section signposting. · `--font-whyte-inktrap-mono`
- **Substitute:** JetBrains Mono, IBM Plex Mono
- **Weights:** 400
- **Sizes:** 14, 74
- **Line height:** 0.9–1.5
- **Letter spacing:** 0.2em constant — the breath between letters is the design
- **OpenType features:** `"ss01" on (if available, for the alternate inktrap cuts)`
- **Role:** The stamped-letterhead voice: 74px uppercase sections like 'SSL INSPECTION' and 'URL FILTERING' with 0.2em tracking. The mono is intentionally mechanical against the humanist Whyte to create the boarding-pass rhythm. This font does the section signposting.

### GrandSlang — The italic display serif reserved for the hero and its echoes — 'Your new', 'with AI DLP'. Its warm brush-italic swells make the brand feel human and confident where the rest of the system is clinical. This is the one font that should never be used for body or nav. · `--font-grandslang`
- **Substitute:** Tiempos Headline, Lora Italic
- **Weights:** 300, 400
- **Sizes:** 32, 50, 64, 88, 146
- **Line height:** 0.8–1.5
- **Letter spacing:** -0.03em — pulled in tight so the italic's natural flare reads as generous
- **OpenType features:** `"liga" on, "dlig" on`
- **Role:** The italic display serif reserved for the hero and its echoes — 'Your new', 'with AI DLP'. Its warm brush-italic swells make the brand feel human and confident where the rest of the system is clinical. This is the one font that should never be used for body or nav.

### system-ui — system-ui — detected in extracted data but not described by AI · `--font-system-ui`
- **Weights:** 600
- **Sizes:** 16px
- **Line height:** 1.5
- **Role:** system-ui — detected in extracted data but not described by AI

### Karla — Karla — detected in extracted data but not described by AI · `--font-karla`
- **Weights:** 700
- **Sizes:** 16px
- **Line height:** 1, 1.2
- **Role:** Karla — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 10px | 1 | 1.8px | `--text-caption` |
| body-sm | 14px | 1.5 | — | `--text-body-sm` |
| body | 16px | 1.5 | — | `--text-body` |
| subheading | 20px | 1 | -0.2px | `--text-subheading` |
| heading-sm | 32px | 1.2 | -0.32px | `--text-heading-sm` |
| heading | 48px | 1.2 | -0.48px | `--text-heading` |
| heading-lg | 64px | 1.2 | -0.64px | `--text-heading-lg` |
| section-stamp | 74px | 0.9 | 14.8px | `--text-section-stamp` |
| display | 88px | 0.8 | -2.64px | `--text-display` |

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
| 72 | 72px | `--spacing-72` |
| 80 | 80px | `--spacing-80` |
| 96 | 96px | `--spacing-96` |
| 128 | 128px | `--spacing-128` |
| 136 | 136px | `--spacing-136` |
| 160 | 160px | `--spacing-160` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 19.2px |
| pills | 1584px |
| buttons | 8px |
| smallControls | 6px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| subtle | `rgba(16, 24, 40, 0.05) 0px 1px 2px 0px` | `--shadow-subtle` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 120px
- **Card padding:** 40px
- **Element gap:** 16px

## Components

### Hero Boarding Pass
**Role:** Full-bleed hero panel with a translucent glass card on the right

Full-viewport dark hero on the atmospheric sky photograph. Left column: GrandSlang italic at 146px for 'Your new', Whyte Inktrap weight 400 at 64px for the main 'Secure Web Gateway', GrandSlang italic again for 'with AI DLP'. Body subhead in Whyte Inktrap 20px weight 300, muted Almost White. Right column: 19.2px radius card with rgba(237,195,196,0.05) fill, 1px white border, 'Boarding Pass' label, 'LEGACY → DS' origin/destination line, and a vertical barcode. Two pill CTA buttons inside: 1584px radius, 20px 32px padding, white text on the faint pink wash.

### Stamped Section Heading
**Role:** Full-width section signpost that replaces H2s on feature blocks

Whyte Inktrap Mono 74px weight 400, uppercase, 0.2em letter-spacing, Soft White (#f0f0f0). Rendered as a single line that fills the container. Each letter spaced far enough apart to read as a stamp, not a heading. No underline, no decoration — the tracking IS the design. Example: 'S S L   I N S P E C T I O N'.

### Filled Action Button
**Role:** Primary dark button with white outline

Background #090909, 1px solid #f7f9fa border, 8px radius, 16px all-around padding, white text in Whyte Inktrap 16px weight 400. Used for 'Book a Demo' and 'Log In' in the nav. The button is almost the same color as the page — the border does the work.

### Ghost Pill Button
**Role:** Soft-tint pill used for secondary actions inside cards

Background rgba(237,195,196,0.05), no border, 1584px radius (effectively full pill), 20px 32px padding, text #f7f9fa. Example: 'Try now with Google' and 'Try now with Microsoft'. A small brand-color logo glyph sits left of the label.

### Compact Outlined Button
**Role:** Small white-bordered control for inline actions

Background rgba(247,249,250,0.08), 1px solid #f7f9fa border, 6px radius, 9px 15px padding. Lighter density than the filled button — used in compact toolbars and table rows.

### Text-Only Nav Link
**Role:** Unbordered link in the main navigation

Transparent background, 0px radius, 10.4px vertical padding, text in #475467 (muted steel). Underline appears on hover. This is the lightest-weight interactive in the system — quiet enough to recede into the nav bar.

### Frosted Nav Bar
**Role:** Sticky top navigation with backdrop blur

Fixed top bar, background rgba(51,50,72,0.7) (--nav-bg-color), backdrop-filter: blur(10px), 1px bottom border in #6b6b6b. Brand wordmark on the left in Whyte Inktrap weight 500. Nav items in Whyte Inktrap 12px uppercase with 0.07em tracking. The blur is the design — it lets the atmospheric hero breathe through.

### Comparison Card
**Role:** Side-by-side competitive comparison tile

19.2px radius, full-bleed gradient or violet bloom background, 40px padding, no border, no shadow. Each card carries a faint oversized number (01–04) behind a small label like 'COMPLEX 15-STEP CONFIGURATION' and a white 'vs. Competitor →' link. The cards are connected by a horizontal line and circular node markers between them, like a flight route.

### Feature Row Card
**Role:** Single feature block with description and link

Transparent background, 19.2px radius, no padding. Left: 20px link 'Learn More'. Right: Whyte Inktrap 18px weight 400 body copy. The card IS the row — no visible container, the spacing creates the boundary.

### Violet Bloom Card
**Role:** Accent card that breaks the monochrome

Background #af50ff or radial-gradient violet bloom, 19.2px radius, 40px padding. Used sparingly for the 'See how in 140s' play CTA or the 'dope.swg' badge. The violet is rationed to one or two cards per page — when it appears, it should feel like a signal, not a theme.

### Coordinate Footer
**Role:** Minimal page footer with geographic stamp

Full-bleed dark band, no background fill, 0px padding. Left: small '+' icon, 'Fly Direct' and 'Secure Web Gateway' labels in Whyte Inktrap 14px. Right: a live-updating GPS coordinate in Whyte Inktrap 14px + a heart icon. This is the signature: the brand writes its footer as if signing a postcard from a city.

### Hairline Divider
**Role:** Section separator with no weight

0.5px or 1px solid stroke in #f7f9fa at 10-20% opacity. Replaces shadows and heavy borders everywhere. The system trusts line weight, not depth, to create rhythm.

## Do's and Don'ts

### Do
- Use Signal Violet (#af50ff) only for one feature card glow, one filled action, and one accent stroke per page — treat it as signal lighting, not theme color
- Set section headings in Whyte Inktrap Mono 74px uppercase with 0.2em tracking; the letterspaced breath is the heading style
- Default all cards to 19.2px radius and 0 padding internally — let layout create the boundary, not a fill or border
- Use 1px or 0.5px solid #f7f9fa borders at low opacity for separation instead of shadows or fills
- Reach for GrandSlang italic at 88–146px for the two or three largest display moments on a page — never for body or nav
- Use the frosted nav pattern: rgba(51,50,72,0.7) background + backdrop-filter blur(10px) + 1px bottom border
- End pages with a coordinate stamp footer in Whyte Inktrap 14px — it is the brand's signature closing gesture

### Don't
- Don't apply box-shadows beyond the nav's single 1px hairline — the system is shadowless by design
- Don't use Signal Violet for borders, text, or body backgrounds — it is reserved for fills and glows only
- Don't use GrandSlang italic for anything smaller than 32px — the warmth of the brush-italic collapses at small sizes
- Don't mix Whyte Inktrap Mono with GrandSlang on the same line — the mechanical stamp voice must stay in its own band
- Don't introduce a new accent color — the palette is 95% achromatic and one violet, adding a third color breaks the system
- Don't center body copy or use multi-column text layouts — the page rhythm is left-aligned with generous side margins
- Don't round buttons to 0px or 4px; the system uses 8px for control buttons and 1584px for pill CTAs — those are the only two button radii

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Void Canvas | `#090909` | Full-bleed page background — every section sits directly on this |
| 1 | Translucent Panel | `#333248b3` | Floating nav with backdrop blur — a frosted glass strip pinned to the top |
| 2 | Iron Wash | `#423738` | Ghost button fills and subtle card washes that need to read as a surface without leaving the void |
| 3 | Violet Bloom | `#af50ff` | Feature card backgrounds and radial glows — the one place the palette breaks monochrome |

## Elevation

- **Nav Bar:** `rgba(16, 24, 40, 0.05) 0px 1px 2px 0px`

## Imagery

Photography is treated as a single dramatic hero asset: a wide-format twilight sky with purple and lavender clouds over a glowing horizon, a single airplane light streaking across. The image is not cropped or masked — it fills the full viewport and the text sits directly on it. After the hero, the page goes almost entirely iconographic: no product screenshots, no lifestyle photos, no stock imagery. The comparison section uses soft radial gradient blooms (blue, pink, purple) as card backgrounds, acting as abstract color studies rather than literal images. Icons are minimal line glyphs (heart, +, arrow) drawn in #f7f9fa. The overall ratio is text-and-rule dominant: imagery occupies less than 15% of the page.

## Layout

Full-bleed sections with a 1200px content max-width centered inside. The hero is a split composition: roughly 55/45 text-to-card, with a transparent boarding-pass card overlaying the right side of the atmospheric photograph. Below the hero, the system shifts to edge-to-edge dark bands with no visual dividers between them — rhythm comes from generous sectionGap (~120px) and the stamped 74px section labels. The 'Features' section uses a stacked monospace heading above a list of rows; the comparison block uses a 4-column card grid connected by a horizontal route line. Navigation is a single sticky frosted bar with brand left, links center, two buttons right. Density is comfortable — every section breathes. The page never uses multi-column text or card grids denser than 4 across.

## Agent Prompt Guide

**Quick Color Reference**
- text: #f7f9fa
- background: #090909
- border: rgba(247,249,250,0.2)
- accent / brand signal: #af50ff
- muted text: #828384
- primary action: #af50ff (filled action)

**Example Component Prompts**

1. *Stamped Section Heading:* Render 'SSL INSPECTION' as a single line in Whyte Inktrap Mono, 74px, weight 400, uppercase, letter-spacing 0.2em, color #f0f0f0, on a #090909 background. No underline, no decoration.

2. *Hero Boarding Pass Card:* Create a right-aligned card on the hero, 19.2px radius, background rgba(237,195,196,0.05), 1px solid rgba(247,249,250,0.2) border, 40px padding. Inside: a small icon + 'Boarding Pass' label in Whyte Inktrap 12px uppercase, an 'ORIGIN LEGACY → DESTINATION DS' line in 14px, a Whyte Inktrap 32px heading 'Deploys on device in minutes', and two pill buttons (1584px radius, 20px 32px padding, white text, faint pink wash background) reading 'Try now with Google' and 'Try now with Microsoft'.

3. *Filled Action Button:* Build a 8px-radius button with #090909 background, 1px solid #f7f9fa border, 16px padding, white 'Book a Demo' text in Whyte Inktrap 16px weight 400.

4. *Violet Bloom Feature Card:* A 19.2px-radius card filled with #af50ff, 40px padding, containing Whyte Inktrap 32px weight 400 white heading 'dope.swg' and a 14px body line. One per page maximum.

5. *Coordinate Footer:* A full-width band on #090909 with a '+' icon, 'Fly Direct' and 'Secure Web Gateway' labels in Whyte Inktrap 14px on the left, a live GPS coordinate in 14px on the right, and a small heart icon in #f7f9fa.

## Similar Brands

- **Linear** — Same dark monochrome canvas with a single saturated accent color rationed across the interface
- **Vercel** — Identical shadowless discipline — flat surfaces, hairline borders, generous dark space — paired with a minimal typographic system
- **Arc Browser** — Same editorial display serif + geometric sans pairing, same luxury-product restraint on a dark canvas
- **Stripe Press** — Same boarding-pass / travel-coded editorial language, same extreme letter-spacing on uppercase stamps
- **Nothing.tech** — Same dot-matrix mono typography and inktrap geometric sans, same monochrome-with-one-glow color strategy

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-near-black: #090909;
  --color-almost-white: #f7f9fa;
  --color-soft-white: #f0f0f0;
  --color-steel: #828384;
  --color-graphite: #474747;
  --color-iron: #423738;
  --color-ash: #6b6b6b;
  --color-signal-violet: #af50ff;
  --color-lavender-mist: #e1bdff;

  /* Typography — Font Families */
  --font-whyte-inktrap: 'Whyte Inktrap', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-whyte-inktrap-mono: 'Whyte Inktrap Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-grandslang: 'GrandSlang', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-system-ui: 'system-ui', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-karla: 'Karla', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1;
  --tracking-caption: 1.8px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.5;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-subheading: 20px;
  --leading-subheading: 1;
  --tracking-subheading: -0.2px;
  --text-heading-sm: 32px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: -0.32px;
  --text-heading: 48px;
  --leading-heading: 1.2;
  --tracking-heading: -0.48px;
  --text-heading-lg: 64px;
  --leading-heading-lg: 1.2;
  --tracking-heading-lg: -0.64px;
  --text-section-stamp: 74px;
  --leading-section-stamp: 0.9;
  --tracking-section-stamp: 14.8px;
  --text-display: 88px;
  --leading-display: 0.8;
  --tracking-display: -2.64px;

  /* Typography — Weights */
  --font-weight-light: 300;
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

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
  --spacing-72: 72px;
  --spacing-80: 80px;
  --spacing-96: 96px;
  --spacing-128: 128px;
  --spacing-136: 136px;
  --spacing-160: 160px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 120px;
  --card-padding: 40px;
  --element-gap: 16px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-lg-2: 10.8px;
  --radius-2xl: 19.2px;
  --radius-full: 99px;
  --radius-full-2: 1584px;
  --radius-full-3: 10000px;

  /* Named Radii */
  --radius-cards: 19.2px;
  --radius-pills: 1584px;
  --radius-buttons: 8px;
  --radius-smallcontrols: 6px;

  /* Shadows */
  --shadow-subtle: rgba(16, 24, 40, 0.05) 0px 1px 2px 0px;

  /* Surfaces */
  --surface-void-canvas: #090909;
  --surface-translucent-panel: #333248b3;
  --surface-iron-wash: #423738;
  --surface-violet-bloom: #af50ff;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-near-black: #090909;
  --color-almost-white: #f7f9fa;
  --color-soft-white: #f0f0f0;
  --color-steel: #828384;
  --color-graphite: #474747;
  --color-iron: #423738;
  --color-ash: #6b6b6b;
  --color-signal-violet: #af50ff;
  --color-lavender-mist: #e1bdff;

  /* Typography */
  --font-whyte-inktrap: 'Whyte Inktrap', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-whyte-inktrap-mono: 'Whyte Inktrap Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-grandslang: 'GrandSlang', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-system-ui: 'system-ui', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-karla: 'Karla', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1;
  --tracking-caption: 1.8px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.5;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-subheading: 20px;
  --leading-subheading: 1;
  --tracking-subheading: -0.2px;
  --text-heading-sm: 32px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: -0.32px;
  --text-heading: 48px;
  --leading-heading: 1.2;
  --tracking-heading: -0.48px;
  --text-heading-lg: 64px;
  --leading-heading-lg: 1.2;
  --tracking-heading-lg: -0.64px;
  --text-section-stamp: 74px;
  --leading-section-stamp: 0.9;
  --tracking-section-stamp: 14.8px;
  --text-display: 88px;
  --leading-display: 0.8;
  --tracking-display: -2.64px;

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
  --spacing-72: 72px;
  --spacing-80: 80px;
  --spacing-96: 96px;
  --spacing-128: 128px;
  --spacing-136: 136px;
  --spacing-160: 160px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-lg-2: 10.8px;
  --radius-2xl: 19.2px;
  --radius-full: 99px;
  --radius-full-2: 1584px;
  --radius-full-3: 10000px;

  /* Shadows */
  --shadow-subtle: rgba(16, 24, 40, 0.05) 0px 1px 2px 0px;
}
```
