# MotherDuck — Style Reference
> crayon-coded terminal on cream paper

**Theme:** light

MotherDuck operates in a neo-brutalist technical-playful register: a warm cream canvas hosts monospace-first typography (Aeonik Mono) that treats every UI surface as if it were a terminal readout, and then subverts that seriousness with hand-drawn duck mascots, clouds, and crayon-bright accents. The interaction language is flat and offset — hard 2px corners, zero-blur drop shadows pushed -6px right and +6px down in #383838, and chromatic button borders that cycle through a full rainbow palette like colored pencils in a cup. Color is sparse and intentional: a sky-blue (#6fc2ff) carries all primary action weight, while saturated yellow and orange belong to illustration and marquee rhythm. The effect is a developer tool that refuses to dress like one — data infrastructure rendered as a children's notebook sketch.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Cream Paper | `#f4efea` | `--color-cream-paper` | Page canvas and section backgrounds — the entire site sits on this warm off-white like a notebook page |
| Frost White | `#ffffff` | `--color-frost-white` | Card surfaces, nav bar, input fields, and overlay panels — clean white layered on the cream canvas |
| Chalk Gray | `#f8f8f7` | `--color-chalk-gray` | Secondary surface for body backgrounds and subtle borders — barely-there differentiation from white |
| Ice Wash | `#ebf9ff` | `--color-ice-wash` | Tinted blue-white for soft button hovers and highlight washes adjacent to the primary blue |
| Notebook Pale | `#f9fbe7` | `--color-notebook-pale` | Faint yellow-green tint used on selected/tagged surfaces for the play accent |
| Charcoal Ink | `#383838` | `--color-charcoal-ink` | Primary text, all borders, icon strokes, and the offset shadow color — the universal line color, never pure black |
| Pencil Gray | `#a1a1a1` | `--color-pencil-gray` | Muted helper text, secondary borders, and disabled-state outlines |
| Graphite | `#818181` | `--color-graphite` | Tertiary borders and dividers, low-emphasis UI rules |
| Soft Silver | `#c0c0c0` | `--color-soft-silver` | Icon strokes and low-contrast border accents on illustration-adjacent elements |
| Sky Crayon | `#6fc2ff` | `--color-sky-crayon` | Primary action fills, nav accents, and the dominant chromatic surface — the only color loud enough to carry CTAs |
| Canary Banner | `#ffde00` | `--color-canary-banner` | Yellow wash for highlight backgrounds, decorative bands, and soft emphasis behind content. |
| Duck Bill Orange | `#ff9538` | `--color-duck-bill-orange` | Orange wash for highlight backgrounds, decorative bands, and soft emphasis behind content. Do not promote it to the primary CTA color |
| Coral Sketch | `#f38e84` | `--color-coral-sketch` | Outlined button border variant — one slot in the rotating rainbow button-border system |
| Peach Sketch | `#f5b161` | `--color-peach-sketch` | Outlined button border variant |
| Mint Sketch | `#38c1b0` | `--color-mint-sketch` | Outlined button border variant |
| Lilac Sketch | `#b291de` | `--color-lilac-sketch` | Outlined button border variant |
| Lime Sketch | `#b3c419` | `--color-lime-sketch` | Outlined button border variant |
| Periwinkle Sketch | `#7597ee` | `--color-periwinkle-sketch` | Outlined button border variant |
| Slate Sketch | `#84a6bc` | `--color-slate-sketch` | Outlined button border variant |
| Marigold Sketch | `#e1c427` | `--color-marigold-sketch` | Outlined button border variant |
| Wet Cement | `#54b4de` | `--color-wet-cement` | Decorative illustration stroke — water/sky blue outlines in duck and cloud drawings |
| Peach Blush | `#fdedda` | `--color-peach-blush` | Soft warm tint for illustrated section backgrounds, never a UI control fill |

## Tokens — Typography

### Aeonik Mono — Universal brand face — headlines, body, nav, buttons, inputs, cards, footers. Used everywhere as the primary voice. The monospace geometry signals developer-tool credibility while the wide weight range (300–600) allows it to whisper (hero at 300) or command (nav at 600). · `--font-aeonik-mono`
- **Substitute:** JetBrains Mono, IBM Plex Mono, or Space Mono
- **Weights:** 300, 400, 500, 600
- **Sizes:** 11, 12, 14, 16, 18, 20, 24, 32, 40, 56
- **Line height:** 1.00, 1.20, 1.30, 1.40, 1.60
- **Letter spacing:** 0.0200em across all sizes — a slight positive tracking counteracts monospace's mechanical density and gives the type a more open, friendly rhythm
- **Role:** Universal brand face — headlines, body, nav, buttons, inputs, cards, footers. Used everywhere as the primary voice. The monospace geometry signals developer-tool credibility while the wide weight range (300–600) allows it to whisper (hero at 300) or command (nav at 600).

### Inter — Secondary face for supplementary UI text, third-party embeds, and contexts where proportional letterforms read more naturally than monospace. Letter-spacing 0.0200em–0.0230em. · `--font-inter`
- **Substitute:** system-ui, -apple-system, Segoe UI
- **Weights:** 300, 400, 600, 700
- **Sizes:** 12, 14, 16, 18, 20, 22, 24, 32, 44
- **Line height:** 1.20, 1.30, 1.36, 1.37, 1.38, 1.40, 1.60
- **Letter spacing:** 0.0200em–0.0230em
- **Role:** Secondary face for supplementary UI text, third-party embeds, and contexts where proportional letterforms read more naturally than monospace. Letter-spacing 0.0200em–0.0230em.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 11px | 1.4 | 0.22px | `--text-caption` |
| body | 14px | 1.6 | 0.28px | `--text-body` |
| body-lg | 16px | 1.6 | 0.32px | `--text-body-lg` |
| subheading | 18px | 1.4 | 0.36px | `--text-subheading` |
| heading-sm | 24px | 1.3 | 0.48px | `--text-heading-sm` |
| heading | 32px | 1.2 | 0.64px | `--text-heading` |
| heading-lg | 40px | 1.2 | 0.8px | `--text-heading-lg` |
| display | 56px | 1 | 1.12px | `--text-display` |

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
| 60 | 60px | `--spacing-60` |
| 64 | 64px | `--spacing-64` |
| 68 | 68px | `--spacing-68` |
| 80 | 80px | `--spacing-80` |
| 100 | 100px | `--spacing-100` |
| 120 | 120px | `--spacing-120` |
| 140 | 140px | `--spacing-140` |
| 200 | 200px | `--spacing-200` |

### Border Radius

| Element | Value |
|---------|-------|
| nav | 2px |
| tags | 2px |
| cards | 2px |
| inputs | 2px |
| buttons | 2px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| subtle | `rgb(56, 56, 56) -6px 6px 0px 0px` | `--shadow-subtle` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 40px
- **Element gap:** 8px

## Components

### Primary Action Button
**Role:** Main CTA — drives signups and demo bookings

Filled sky-blue (#6fc2ff) background, #383838 1.5–2px border, #383838 text in Aeonik Mono 500 at 14px, 2px radius, padding 10px 24px, uppercase or regular case. Carries the hard offset shadow: rgb(56,56,56) -6px 6px 0px 0px. On hover, the button shifts +6px right and +6px down to 'press' into the shadow; on active, it returns to rest position.

### Secondary Outlined Button
**Role:** Companion to primary CTA, lower-emphasis actions

White (#ffffff) or transparent background, #383838 2px border, #383838 text in Aeonik Mono 500 at 14px, 2px radius, padding 10px 24px, same hard offset shadow as primary. No fill — defined entirely by its border and text.

### Rainbow Outline Button
**Role:** Decorative call-to-action — community links, resource tiles, social proof

Cycling border colors: coral (#f38e84), peach (#f5b161), mint (#38c1b0), lilac (#b291de), lime (#b3c419), periwinkle (#7597ee), slate (#84a6bc), marigold (#e1c427). White background, #383838 text in Aeonik Mono 500 at 14px, 2px radius, 2px border, same -6px/+6px hard offset shadow. Multiple instances on a page distribute through the palette to create a pencil-cup rhythm.

### Start Free Nav Button
**Role:** Persistent signup CTA in the top nav

Sky-blue (#6fc2ff) fill, #383838 1.5px border, white (#ffffff) text in Aeonik Mono 600 at 12px, uppercase, 2px radius, padding 8px 16px. Sits flush in the top-right of the nav bar. No shadow — nav buttons are flat to keep the header lightweight.

### Top Navigation Bar
**Role:** Primary site navigation

White (#ffffff) background, full-width, 1px solid #383838 bottom border. Logo left (orange duck + 'MotherDuck' wordmark in Aeonik Mono 600 at 16px). Center nav links: PRODUCT, COMMUNITY, COMPANY (with chevron-down carets), PRICING, DOCS, CONTACT US in Aeonik Mono 500 at 12px, #383838, 2px radius on hover states. Right: LOG IN (ghost text link) + START FREE (blue button). No sticky behavior inferred from data.

### Hero Section
**Role:** First-screen brand statement

Cream (#f4efea) canvas. Display headline 'INFRASTRUCTURE FOR ANSWERS' in Aeonik Mono 300 at 56px, #383838, fully uppercase, letter-spacing ~0.0200em, centered. Subtext in Aeonik Mono 400 at 18px, #383838, centered, max-width ~600px. Two-button row: Primary (sky-blue) + Secondary (outlined). Below: a horizontal logo strip of customer marks (AheadComputing, DG, GOODSHIP, David AI, together.ai, FinOgre) in #383838 monochrome.

### Product Screenshot Frame
**Role:** Hero and feature-section product showcase

White (#ffffff) surface framed by a 1.5–2px #383838 border and the -6px/+6px hard offset shadow. The frame contains a dark-mode product UI mock (MotherDuck AI console) with its own internal color system (dark navy, yellow badge '3 QUESTIONS LEFT!'). Hand-drawn cloud and triangle decorations float around the frame in #54b4de and #383838 strokes on the cream canvas — the contrast between flat illustration and sharp product UI is signature.

### Marquee Banner
**Role:** Scrolling announcement strip between sections

Full-bleed canary-yellow (#ffde00) background, #383838 text in Aeonik Mono 600 at ~18–20px, uppercase, content scrolls horizontally (e.g. 'DATA WAREHOUSE + AI' repeating). No border, no shadow. Sits flush between content bands as a rhythmic visual reset.

### Testimonial Quote Card
**Role:** Social proof — executive or customer quotes

Canary-yellow (#ffde00) background, #383838 2px border, 2px radius, padding 32–40px. Large open-quote glyph in #383838 at the top. Quote text in Aeonik Mono 400 at 18–20px, #383838. READ MORE link in Aeonik Mono 500, underlined, with an external-link icon. Adjacent or overlapping: a photo of the speaker with a white name-label card ('Greg Inman / CTO at Zero Health') in the bottom-left corner.

### Community Tweet Card
**Role:** Social proof — community/testimonial grid

White (#ffffff) background, #383838 1.5–2px border, 2px radius, padding 24–32px. Header row: circular avatar + name (Aeonik Mono 600 at 14px) + handle (Aeonik Mono 400 at 12px, #a1a1a1) + platform icon (Twitter/LinkedIn glyph in #6fc2ff or platform color). Body text in Aeonik Mono 400 at 14px, #383838. No shadow — the border alone defines the card edge.

### Text Input / Search Bar
**Role:** Data-query input field, form fields

White (#ffffff) background, #383838 1.5–2px border, 2px radius, padding 10–12px horizontal. Placeholder text in Aeonik Mono 400 at 14px, #a1a1a1. No focus ring glow — focus is shown by a thicker border or a color shift to #6fc2ff. Square-cornered submit button (sky-blue) attached on the right.

### Yellow Status Badge
**Role:** In-product annotations, notification counters

Canary-yellow (#ffde00) background, #383838 1px border, 2px radius, Aeonik Mono 600 at 11–12px, #383838, uppercase, padding 4px 8px. Used inline on product mockups (e.g. '3 QUESTIONS LEFT!') to inject the brand's playful accent into the technical UI.

### Hand-Drawn Illustration
**Role:** Decorative atmosphere — ducks, clouds, triangles, speech bubbles

Line-art style in #383838 and #54b4de strokes on the cream canvas, with occasional #ff9538 fills (duck bills, beaks, feet). Loose, imperfect, pencil-sketch quality — intentionally not vector-clean. Used to flank product screenshots and decorate section corners. Ducks carry speech bubbles in Aeonik Mono 500 at 12–14px.

### Footer
**Role:** Site-wide links and legal

White (#ffffff) or cream (#f4efea) background, 1px #383838 top border, padding 48–64px vertical. Multi-column link grid with section headers in Aeonik Mono 600 at 14px, #383838, and links in Aeonik Mono 400 at 14px, #383838. Logo + copyright row at the bottom in Aeonik Mono 400 at 12px, #a1a1a1.

## Do's and Don'ts

### Do
- Use Aeonik Mono (or a monospace substitute like JetBrains Mono) as the default face for every text element; reach for Inter only in third-party embed contexts.
- Apply the hard offset shadow (rgb(56,56,56) -6px 6px 0px 0px) to every button and interactive card; the shadow is the elevation system.
- Use Sky Crayon (#6fc2ff) as the sole filled-action color; never use the rainbow outline palette for filled CTAs.
- Keep all border radii at 2px — the near-square corners are non-negotiable and define the system's notebook-paper feel.
- Layer white cards and #f4efea cream backgrounds; never put a cream card on a cream background or a white card on a white background.
- Use the rainbow outline button palette (coral, peach, mint, lilac, lime, periwinkle, slate, marigold) to distribute visual color across repeated tiles.
- Set body and subhead text at 14–18px in Aeonik Mono 400 with 0.0200em tracking; never go below 12px for meaningful content.

### Don't
- Don't use blur or ambient shadows — every shadow is hard-edged and offset, never soft.
- Don't introduce border radii above 2px; rounded buttons or pills break the neo-brutalist geometry.
- Don't use pure black (#000000) for text; use #383838 Charcoal Ink for all foreground and border strokes.
- Don't fill UI controls with the decorative palette (orange, yellow, teal); those colors are reserved for illustration and marquees.
- Don't place a filled chromatic button and a rainbow-outline button as paired CTAs — pair one sky-blue filled with one charcoal-outlined.
- Don't use gradient backgrounds or gradient text — the system is flat-fill only.
- Don't use serifs, italics, or decorative display faces; the mono-or-nothing rule is structural.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Cream Paper | `#f4efea` | Page canvas — the base layer everything sits on |
| 1 | Frost White | `#ffffff` | Card and nav surfaces — clean white raised off the cream |
| 2 | Chalk Gray | `#f8f8f7` | Body backgrounds and section dividers |
| 3 | Ice Wash | `#ebf9ff` | Tinted highlight surfaces adjacent to sky-blue actions |
| 4 | Canary Banner | `#ffde00` | Full-bleed marquee strip and highlight callouts |

## Elevation

- **Button (all variants):** `rgb(56, 56, 56) -6px 6px 0px 0px`

## Imagery

Illustration-dominant, no photography except executive headshots. The signature visual is hand-drawn line art: ducks, clouds, triangles, speech bubbles, and arrows sketched in #383838 and #54b4de strokes on the cream canvas, with warm orange (#ff9538) and canary-yellow (#ffde00) fills for beaks, feet, and highlight callouts. The sketch quality is intentionally imperfect — wobbly lines, uneven proportions — like a developer doodled it in a notebook. Product screenshots appear inside framed cards (white surface, 2px #383838 border, hard offset shadow) so the crisp dark-mode product UI contrasts with the loose cream-paper illustration. No lifestyle photography, no stock imagery, no abstract gradient blobs. The only photographic content is square-cropped executive portraits paired with yellow quote cards.

## Layout

Centered max-width container at 1200px, full-bleed sections. The page rhythm alternates: cream hero → cream product showcase (with floating illustration decorations breaking the container edges) → full-bleed canary-yellow marquee → alternating white-card and cream-background content bands → yellow testimonial → cream community grid. Vertical section gaps are generous (64–80px). The hero is a centered text stack (headline + subtext + dual-button row) over a logo strip; subsequent sections are either 2-column text+product-screenshot splits or 3–4-column card grids (community tweets, customer logos). Hand-drawn illustrations deliberately bleed past container edges into the cream margin, breaking the grid at decorative moments. Navigation is a flat top bar, not sticky, with product/community/company dropdowns indicated by chevron carets.

## Agent Prompt Guide

**Quick Color Reference**
- text: #383838 (Charcoal Ink)
- background: #f4efea (Cream Paper)
- card surface: #ffffff (Frost White)
- border: #383838
- accent (illustration/marquee): #ffde00 (Canary Banner)
- primary action: #6fc2ff (filled action)

**Example Component Prompts**
1. **Hero section**: Cream (#f4efea) background, full-width. Display headline in Aeonik Mono 300 at 56px, #383838, uppercase, letter-spacing 0.0200em, centered. Subtext in Aeonik Mono 400 at 18px, #383838, max-width 600px, centered. Two-button row: sky-blue filled (#6fc2ff, #383838 2px border, #383838 text, 2px radius, 10px 24px padding, -6px/+6px hard offset shadow) + charcoal outlined (white fill, #383838 2px border, same text and padding). Below: monochrome logo strip in #383838.

2. **Community tweet card**: White (#ffffff) surface, #383838 2px border, 2px radius, padding 28px, no shadow. Top row: 40px circular avatar, then name in Aeonik Mono 600 at 14px #383838 and handle in Aeonik Mono 400 at 12px #a1a1a1, then a sky-blue (#6fc2ff) platform icon right-aligned. Body text in Aeonik Mono 400 at 14px #383838, 1.5 line-height.

3. **Marquee banner strip**: Full-bleed #ffde00 background, no border, no shadow. Scrolling text in Aeonik Mono 600 at 20px, #383838, uppercase, repeated with separator gaps. Padding 12px vertical.

4. **Testimonial quote card**: #ffde00 background, #383838 2px border, 2px radius, padding 40px, -6px/+6px hard offset shadow. Large opening quote glyph in #383838 at top-left. Quote text in Aeonik Mono 400 at 20px, #383838. READ MORE link in Aeonik Mono 500 at 14px, #383838, underlined with external-arrow icon. Speaker photo overlaps the bottom-left corner with a white name-label card.

5. **Product screenshot frame**: White (#ffffff) surface, #383838 2px border, 2px radius, -6px/+6px hard offset shadow. Contains a dark-mode product mockup internally. Flanked on the cream canvas by hand-drawn cloud and duck illustrations in #383838 and #54b4de strokes with #ff9538 fills, positioned to bleed past the frame edges into the surrounding margin.

## Similar Brands

- **Linear** — Same monospace-as-primary typography treatment and developer-tool-meets-playful aesthetic, though Linear is dark-first where MotherDuck is light-first
- **Vercel** — Similar use of hard offset shadows and minimal border-radius on a light canvas, with a single dominant accent color carrying primary actions
- **Cursor** — Shares the monospace-forward typography and hand-drawn illustration accents (Cursor's doodles vs. MotherDuck's ducks) layered on a clean light canvas
- **Replit** — Same playful developer-tool identity with crayon-bright accent palette and informal, notebook-like visual language

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-cream-paper: #f4efea;
  --color-frost-white: #ffffff;
  --color-chalk-gray: #f8f8f7;
  --color-ice-wash: #ebf9ff;
  --color-notebook-pale: #f9fbe7;
  --color-charcoal-ink: #383838;
  --color-pencil-gray: #a1a1a1;
  --color-graphite: #818181;
  --color-soft-silver: #c0c0c0;
  --color-sky-crayon: #6fc2ff;
  --color-canary-banner: #ffde00;
  --color-duck-bill-orange: #ff9538;
  --color-coral-sketch: #f38e84;
  --color-peach-sketch: #f5b161;
  --color-mint-sketch: #38c1b0;
  --color-lilac-sketch: #b291de;
  --color-lime-sketch: #b3c419;
  --color-periwinkle-sketch: #7597ee;
  --color-slate-sketch: #84a6bc;
  --color-marigold-sketch: #e1c427;
  --color-wet-cement: #54b4de;
  --color-peach-blush: #fdedda;

  /* Typography — Font Families */
  --font-aeonik-mono: 'Aeonik Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 11px;
  --leading-caption: 1.4;
  --tracking-caption: 0.22px;
  --text-body: 14px;
  --leading-body: 1.6;
  --tracking-body: 0.28px;
  --text-body-lg: 16px;
  --leading-body-lg: 1.6;
  --tracking-body-lg: 0.32px;
  --text-subheading: 18px;
  --leading-subheading: 1.4;
  --tracking-subheading: 0.36px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.3;
  --tracking-heading-sm: 0.48px;
  --text-heading: 32px;
  --leading-heading: 1.2;
  --tracking-heading: 0.64px;
  --text-heading-lg: 40px;
  --leading-heading-lg: 1.2;
  --tracking-heading-lg: 0.8px;
  --text-display: 56px;
  --leading-display: 1;
  --tracking-display: 1.12px;

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
  --spacing-60: 60px;
  --spacing-64: 64px;
  --spacing-68: 68px;
  --spacing-80: 80px;
  --spacing-100: 100px;
  --spacing-120: 120px;
  --spacing-140: 140px;
  --spacing-200: 200px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 40px;
  --element-gap: 8px;

  /* Border Radius */
  --radius-sm: 2px;

  /* Named Radii */
  --radius-nav: 2px;
  --radius-tags: 2px;
  --radius-cards: 2px;
  --radius-inputs: 2px;
  --radius-buttons: 2px;

  /* Shadows */
  --shadow-subtle: rgb(56, 56, 56) -6px 6px 0px 0px;

  /* Surfaces */
  --surface-cream-paper: #f4efea;
  --surface-frost-white: #ffffff;
  --surface-chalk-gray: #f8f8f7;
  --surface-ice-wash: #ebf9ff;
  --surface-canary-banner: #ffde00;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-cream-paper: #f4efea;
  --color-frost-white: #ffffff;
  --color-chalk-gray: #f8f8f7;
  --color-ice-wash: #ebf9ff;
  --color-notebook-pale: #f9fbe7;
  --color-charcoal-ink: #383838;
  --color-pencil-gray: #a1a1a1;
  --color-graphite: #818181;
  --color-soft-silver: #c0c0c0;
  --color-sky-crayon: #6fc2ff;
  --color-canary-banner: #ffde00;
  --color-duck-bill-orange: #ff9538;
  --color-coral-sketch: #f38e84;
  --color-peach-sketch: #f5b161;
  --color-mint-sketch: #38c1b0;
  --color-lilac-sketch: #b291de;
  --color-lime-sketch: #b3c419;
  --color-periwinkle-sketch: #7597ee;
  --color-slate-sketch: #84a6bc;
  --color-marigold-sketch: #e1c427;
  --color-wet-cement: #54b4de;
  --color-peach-blush: #fdedda;

  /* Typography */
  --font-aeonik-mono: 'Aeonik Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 11px;
  --leading-caption: 1.4;
  --tracking-caption: 0.22px;
  --text-body: 14px;
  --leading-body: 1.6;
  --tracking-body: 0.28px;
  --text-body-lg: 16px;
  --leading-body-lg: 1.6;
  --tracking-body-lg: 0.32px;
  --text-subheading: 18px;
  --leading-subheading: 1.4;
  --tracking-subheading: 0.36px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.3;
  --tracking-heading-sm: 0.48px;
  --text-heading: 32px;
  --leading-heading: 1.2;
  --tracking-heading: 0.64px;
  --text-heading-lg: 40px;
  --leading-heading-lg: 1.2;
  --tracking-heading-lg: 0.8px;
  --text-display: 56px;
  --leading-display: 1;
  --tracking-display: 1.12px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-60: 60px;
  --spacing-64: 64px;
  --spacing-68: 68px;
  --spacing-80: 80px;
  --spacing-100: 100px;
  --spacing-120: 120px;
  --spacing-140: 140px;
  --spacing-200: 200px;

  /* Border Radius */
  --radius-sm: 2px;

  /* Shadows */
  --shadow-subtle: rgb(56, 56, 56) -6px 6px 0px 0px;
}
```
