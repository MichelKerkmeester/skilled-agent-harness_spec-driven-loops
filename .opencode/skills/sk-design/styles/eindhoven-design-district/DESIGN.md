# Eindhoven Design District — Style Reference
> editorial brutalism on white paper — a municipal design manifesto rendered in oversized type, sparse photographs, and absolute restraint.

**Theme:** light

Eindhoven Design District reads as editorial brutalism on white paper: a near-monochrome canvas where typography does the heavy lifting and photography earns its space through scale and asymmetric placement. The entire interface is a conversation between massive HelveticaNow display type and quiet supporting text, with black-on-white doing 95% of the work. The only chromatic note is a single vivid red used as a content accent (article category labels) — never as UI chrome. Components are deliberately flat: pill-shaped ghost buttons, image-top article cards, hairline borders, zero shadows or gradients. The result is less a website and more a printed design journal that happens to be interactive.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Charcoal Ink | `#000000` | `--color-charcoal-ink` | All text, borders, icon strokes, nav links, button outlines, and structural lines. The dominant ink of the system — every shape and character carries this weight |
| Paper White | `#ffffff` | `--color-paper-white` | Primary page canvas, card surfaces, button fills, and inverted text on dark blocks. The ground against which everything else is set |
| Newsprint Gray | `#e8e8e8` | `--color-newsprint-gray` | Section background for content bands (article grids, footer areas) — creates quiet tonal shifts between white sections without introducing a second hue |
| Pewter | `#bfbfbf` | `--color-pewter` | Muted helper text, list dividers, secondary link borders — used sparingly where information is deprioritized but still present |
| Signal Red | `#ff0000` | `--color-signal-red` | Red outline accent for tags, dividers, and focused UI edges. |

## Tokens — Typography

### HelveticaNow — The sole typeface across the entire system. Weight 600 carries headlines, button labels, and card titles; weight 400 handles body, navigation, and supporting text. The display sizes (50px and beyond) compress to tight line-heights of ~0.93–1.00, letting oversized words like 'Eindhoven' and 'Design District' stack with sculptural density. Letter-spacing tightens aggressively at large sizes (-0.05em) and loosens slightly at small sizes (+0.015em), giving the type an editorial confidence that shifts with scale. · `--font-helveticanow`
- **Substitute:** Helvetica Neue, Inter, Neue Haas Grotesk
- **Weights:** 400, 600
- **Sizes:** 14px, 16px, 18px, 19px, 23px, 35px, 46px, 50px, 150px+ (display)
- **Line height:** 0.93, 1.00, 1.15, 1.20, 1.31, 1.40, 1.47
- **Letter spacing:** -0.05em at 150px+ display, -0.03em at 50px heading, -0.02em at 35px subheading, -0.004em at 18px body, +0.005em at 16px body-sm, +0.015em at 14px caption
- **Role:** The sole typeface across the entire system. Weight 600 carries headlines, button labels, and card titles; weight 400 handles body, navigation, and supporting text. The display sizes (50px and beyond) compress to tight line-heights of ~0.93–1.00, letting oversized words like 'Eindhoven' and 'Design District' stack with sculptural density. Letter-spacing tightens aggressively at large sizes (-0.05em) and loosens slightly at small sizes (+0.015em), giving the type an editorial confidence that shifts with scale.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 14px | 1.4 | 0.21px | `--text-caption` |
| body-sm | 16px | 1.4 | 0.08px | `--text-body-sm` |
| body | 18px | 1.31 | -0.07px | `--text-body` |
| subheading | 23px | 1.2 | -0.39px | `--text-subheading` |
| heading-sm | 35px | 1.15 | -0.7px | `--text-heading-sm` |
| heading | 46px | 1 | -1.38px | `--text-heading` |
| heading-lg | 50px | 1 | -1.5px | `--text-heading-lg` |
| display | 150px | 0.93 | -7.5px | `--text-display` |

## Tokens — Spacing & Shapes

**Density:** spacious

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 8 | 8px | `--spacing-8` |
| 10 | 10px | `--spacing-10` |
| 12 | 12px | `--spacing-12` |
| 15 | 15px | `--spacing-15` |
| 16 | 16px | `--spacing-16` |
| 18 | 18px | `--spacing-18` |
| 19 | 19px | `--spacing-19` |
| 20 | 20px | `--spacing-20` |
| 21 | 21px | `--spacing-21` |
| 25 | 25px | `--spacing-25` |
| 27 | 27px | `--spacing-27` |
| 30 | 30px | `--spacing-30` |
| 35 | 35px | `--spacing-35` |
| 40 | 40px | `--spacing-40` |
| 50 | 50px | `--spacing-50` |
| 100 | 100px | `--spacing-100` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 500px |
| cards | 0px |
| inputs | 0px |
| buttons | 500px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 20px
- **Element gap:** 20px

## Components

### Pill Ghost Button
**Role:** Primary interactive element across the site — used for navigation, CTAs, and content links

Border: 1px solid #000000. Border-radius: 500px (full pill). Background: #ffffff. Text: #000000 at 16px weight 400, letter-spacing 0.005em. Padding: 10px 15px (compact) or 16px 20px (standard). No fill, no shadow, no hover background change — the button is a line of text inside an oval outline. Appears in 'Meer over Eindhoven Design District' and 'Zie alle artikelen'.

### Pill Filled Button
**Role:** Secondary action variant when higher emphasis is needed

Border: none. Border-radius: 500px. Background: #000000. Text: #ffffff at 16px weight 400. Padding: 10px 18px. Inverts the ghost pattern — solid black pill with white text for moments of stronger commitment.

### Display Headline
**Role:** Hero and section-defining typography

Font: HelveticaNow weight 400 (the lighter weight at maximum size is the signature — weight 600 is never used for display). Size: 150px+ with line-height 0.93. Letter-spacing: -0.05em. Color: #000000. Can be set horizontally or rotated 90° for architectural compositions. The compressed line-height and extreme negative tracking make the letterforms feel carved rather than typed.

### Navigation Bar
**Role:** Top-level site navigation

Position: top of page, non-sticky. Background: #ffffff. Contains logo (top-left, 'Eindhoven / Design District' in two lines, weight 400, ~14px), and right-aligned controls: language selector ('NL ▾' in pill outline), search icon (circle with magnifier), and 'Menu ≡' pill button. All elements use 14–16px weight 400. Generous padding creates breathing room above the hero.

### Article Card
**Role:** Content card for editorial articles in grid layouts

Background: #ffffff (on #e8e8e8 section). No border, no shadow, no radius. Structure: full-bleed photo at top, then content area with no padding gap. Content stack: 'Interview' label in 14px weight 400 #ff0000, then title at 19px weight 600 #000000 line-height 1.2, then excerpt at 16px weight 400 #000000 truncated to 3 lines. The card is a clean rectangle — the photo provides all visual energy.

### Hero Composition
**Role:** First-screen visual identity for landing pages

Full-viewport white canvas. Oversized display headline (150px+) split into two words positioned asymmetrically — one word horizontal, one word rotated 90° vertical. Subtitle in 19px weight 400 below the horizontal word. Photographs (architecture, people, objects) placed in a loose collage grid, roughly 300–400px wide, no borders, no rounded corners, integrated into the type composition rather than separated from it.

### Language Selector
**Role:** Locale switcher in navigation

Pill-shaped outline button. Border: 1px solid #000000. Border-radius: 500px. Text: 'NL ▾' in 14px weight 400 #000000. Padding: ~8px 12px. Minimal footprint, ghost style consistent with other interactive elements.

### Search Button
**Role:** Search trigger in navigation

Circular icon button. Border: 1px solid #000000. Border-radius: 50%. Contains a magnifier glyph at 16px #000000. No background, no fill. Diameter: ~40px.

### Intro Paragraph Block
**Role:** Body text introduction for page sections

Max-width: ~600px. Font: HelveticaNow 18px weight 400, line-height 1.31, letter-spacing -0.004em. Color: #000000. No drop cap, no decorative elements. Sits on #ffffff with generous vertical space above and below.

### Section Divider
**Role:** Implicit transition between content bands

No visible line or ornament. Sections are separated by vertical space (80px+) and a background shift from #ffffff to #e8e8e8. The tonal change IS the divider.

## Do's and Don'ts

### Do
- Use HelveticaNow weight 400 for all display-size text above 50px — the lighter weight at extreme scale is the system's signature tension
- Set border-radius to 500px on every button, tag, and language selector — the pill shape is non-negotiable
- Maintain the black/white/#e8e8e8 trichromatic discipline — resist adding accent colors to UI chrome
- Use #ff0000 only for editorial category labels in content areas, never for buttons, links, or structural elements
- Set letter-spacing to -0.05em at 150px+ display sizes and progressively loosen toward +0.015em at 14px caption
- Alternate section backgrounds between #ffffff and #e8e8e8 to create rhythm without ornament
- Place photographs in rectangular crops with no border, radius, or shadow — let the images sit raw on the page

### Don't
- Don't use weight 600 for display headlines above 50px — the system whispers at scale, it doesn't shout
- Don't add drop shadows, gradients, or glass effects to any component — the system is flat by conviction
- Don't introduce a second action color — buttons are always black-outline-on-white or solid-black-on-white
- Don't use border-radius values other than 0px (rectangular) or 500px (pill) — no 4px, 8px, or 16px rounding
- Don't set line-height above 1.0 for display text — the compressed stacking of oversized words is the visual identity
- Don't separate photographs from the typographic composition with frames, whitespace buffers, or containers
- Don't use the red accent for interactive states, hover effects, or focus rings — it is a content mark, not a system token

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Paper White | `#ffffff` | Primary page canvas and content sections |
| 2 | Newsprint Gray | `#e8e8e8` | Alternating section background for article grids and footer bands |

## Elevation

The system is intentionally shadowless. Elevation is achieved through spatial separation, tonal contrast between #ffffff and #e8e8e8, and generous vertical rhythm — not through drop shadows. Cards sit flat on their surface; buttons are defined by stroke, not depth.

## Imagery

Photography is documentary and editorial, not decorative. Subjects are architecture (modern facades, geometric building patterns), people in their work environments (designers, makers, industrial settings), and objects in situ. Treatment is raw: full-saturation natural color, no filters, no duotone, no overlay effects. Photos are presented as rectangular crops (not square, not rounded) at varying scales — some fill half the viewport, others are small inline details. The images are placed with deliberate asymmetry, often abutting or overlapping the boundary of the typographic composition. There is no lifestyle staging, no model photography, no stock imagery — everything looks shot on location with a documentary eye. Iconography is essentially absent from the visible UI; navigation uses text labels and simple geometric glyphs (≡, ▾, magnifier).

## Layout

Full-bleed page with no outer frame. Content sections max at ~1200px but photography frequently breaks the container. The hero is a full-viewport typographic composition with scattered photo crops — not a centered banner. Below the hero, sections alternate between white and #e8e8e8 backgrounds with 80px+ vertical rhythm. Content is primarily left-aligned with generous left margin. The article section uses a 3-column equal grid. Navigation is a minimal top bar (logo left, controls right). The overall rhythm is editorial-magazine: sparse, large, typographic, with photography as punctuation rather than illustration.

## Agent Prompt Guide

## Quick Color Reference
- text: #000000
- background: #ffffff
- secondary surface: #e8e8e8
- border: #000000 (hairline) or #bfbfbf (muted)
- accent: #ff0000 (editorial category labels only)
- primary action: no distinct CTA color

## 3-5 Example Component Prompts
1. **Display Hero Headline**: Create an oversized headline reading 'Eindhoven' at 150px, HelveticaNow weight 400, #000000, letter-spacing -7.5px, line-height 0.93. Position it top-left of a white canvas. Add a second word 'Design' rotated 90° to the right of the first, same size and weight.

2. **Pill Ghost Button**: Create a button with text 'Meer over Eindhoven Design District' at 16px HelveticaNow weight 400, #000000, letter-spacing 0.08px. Border: 1px solid #000000. Border-radius: 500px. Background: #ffffff. Padding: 10px 15px. No shadow, no fill.

3. **Article Card**: Create a card on #e8e8e8 background. Top: full-bleed architectural photograph (no border, no radius). Below: 'Interview' label in 14px weight 400 #ff0000, then title in 19px weight 600 #000000 line-height 1.2, then 3-line excerpt in 16px weight 400 #000000. Card has no padding, no border, no shadow.

4. **Navigation Bar**: Create a horizontal nav with white background. Left: logo text 'Eindhoven / Design District' in two lines, 14px weight 400 #000000. Right: language pill ('NL ▾' in 14px, 1px black border, 500px radius), search circle (40px diameter, 1px black border, magnifier icon), and 'Menu ≡' pill button (same as language pill style).

5. **Section Band**: Create a full-width section with #e8e8e8 background, 80px vertical padding. Inside: a 3-column grid of article cards (described above), with 20px gap between columns. Below the grid, a centered pill ghost button 'Zie alle artikelen' (16px, 1px black border, 500px radius, #ffffff background).

## Typographic System

## Weight Philosophy
The system uses exactly two weights (400 and 600) of a single typeface. The editorial power comes from SIZE, not weight contrast. Display text is always 400 — the restraint of a lighter weight at 150px+ creates authority through scale alone, not through boldness. Weight 600 is reserved for card titles (19px), button labels, and short headings where structural emphasis is needed at small sizes.

## Tracking Rules
- Display (150px+): -0.05em — letters nearly touch, creating a sculptural mass
- Heading (46–50px): -0.03em — tight but legible
- Subheading (35px): -0.02em — still compressed
- Body (18–23px): -0.004 to -0.017em — near-normal, slight tightening
- Caption (14–16px): +0.005 to +0.015em — slight opening for readability at small sizes

## Line-Height Rules
- Display: 0.93–1.00 — lines nearly touch, vertical density is the aesthetic
- Headings: 1.0–1.15 — still compressed
- Body: 1.31–1.47 — generous for readability, creating a visual rest after the display density

## Editorial Layout Grammar

## Hero Pattern
The hero is not a banner — it's a typographic installation. One word sits horizontally at maximum display size, a second word is rotated 90° (reading bottom-to-top), and photographs are scattered as rectangular crops in the negative space. The composition is deliberately asymmetric: never centered, never balanced. The text and images create tension through overlap-adjacency rather than grid alignment.

## Section Rhythm
Full-width bands alternate between #ffffff and #e8e8e8. Transitions are seamless — no borders, no dividers. Vertical spacing between sections is 80px+. Content within sections uses a max-width of 1200px but frequently breaks the container for full-bleed photography.

## Content Density
Information is sparse. A section might contain only a paragraph (3-4 lines) and a single button. The design trusts the reader to engage with limited content rather than overwhelming with options. The article grid (3 columns) is the densest pattern on the site.

## Navigation Model
Top bar only. No sidebar, no sticky header, no mega-menu. The 'Menu' button in the top-right likely opens a fullscreen overlay, but the default state is the minimal bar. The logo is small (14px) and unobtrusive — the hero text IS the brand statement, not the nav logo.

## Similar Brands

- **Vitra** — Same editorial restraint with oversized sans-serif type, near-monochrome palette, and rectangular photography crops placed in typographic compositions
- **Muji** — Identical flat-surface philosophy, no shadows, no gradients, pill-shaped ghost buttons, and absolute typographic minimalism as the primary design language
- **Karlsruhe Design University (HfG)** — Same display-type-as-identity approach with massive Helvetica-family headlines, white canvas, and architectural photography
- **Pentagram** — Editorial brutalism with oversized type, hairline borders, no decorative elements, and photography integrated into the type grid
- **Swiss Design Archive** — Direct lineage to Swiss/International typographic tradition — tight tracking at display sizes, generous whitespace, neutral palette, Helvetica as the only voice

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-charcoal-ink: #000000;
  --color-paper-white: #ffffff;
  --color-newsprint-gray: #e8e8e8;
  --color-pewter: #bfbfbf;
  --color-signal-red: #ff0000;

  /* Typography — Font Families */
  --font-helveticanow: 'HelveticaNow', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.4;
  --tracking-caption: 0.21px;
  --text-body-sm: 16px;
  --leading-body-sm: 1.4;
  --tracking-body-sm: 0.08px;
  --text-body: 18px;
  --leading-body: 1.31;
  --tracking-body: -0.07px;
  --text-subheading: 23px;
  --leading-subheading: 1.2;
  --tracking-subheading: -0.39px;
  --text-heading-sm: 35px;
  --leading-heading-sm: 1.15;
  --tracking-heading-sm: -0.7px;
  --text-heading: 46px;
  --leading-heading: 1;
  --tracking-heading: -1.38px;
  --text-heading-lg: 50px;
  --leading-heading-lg: 1;
  --tracking-heading-lg: -1.5px;
  --text-display: 150px;
  --leading-display: 0.93;
  --tracking-display: -7.5px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-semibold: 600;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-15: 15px;
  --spacing-16: 16px;
  --spacing-18: 18px;
  --spacing-19: 19px;
  --spacing-20: 20px;
  --spacing-21: 21px;
  --spacing-25: 25px;
  --spacing-27: 27px;
  --spacing-30: 30px;
  --spacing-35: 35px;
  --spacing-40: 40px;
  --spacing-50: 50px;
  --spacing-100: 100px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 20px;
  --element-gap: 20px;

  /* Border Radius */
  --radius-full: 500px;

  /* Named Radii */
  --radius-tags: 500px;
  --radius-cards: 0px;
  --radius-inputs: 0px;
  --radius-buttons: 500px;

  /* Surfaces */
  --surface-paper-white: #ffffff;
  --surface-newsprint-gray: #e8e8e8;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-charcoal-ink: #000000;
  --color-paper-white: #ffffff;
  --color-newsprint-gray: #e8e8e8;
  --color-pewter: #bfbfbf;
  --color-signal-red: #ff0000;

  /* Typography */
  --font-helveticanow: 'HelveticaNow', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.4;
  --tracking-caption: 0.21px;
  --text-body-sm: 16px;
  --leading-body-sm: 1.4;
  --tracking-body-sm: 0.08px;
  --text-body: 18px;
  --leading-body: 1.31;
  --tracking-body: -0.07px;
  --text-subheading: 23px;
  --leading-subheading: 1.2;
  --tracking-subheading: -0.39px;
  --text-heading-sm: 35px;
  --leading-heading-sm: 1.15;
  --tracking-heading-sm: -0.7px;
  --text-heading: 46px;
  --leading-heading: 1;
  --tracking-heading: -1.38px;
  --text-heading-lg: 50px;
  --leading-heading-lg: 1;
  --tracking-heading-lg: -1.5px;
  --text-display: 150px;
  --leading-display: 0.93;
  --tracking-display: -7.5px;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-15: 15px;
  --spacing-16: 16px;
  --spacing-18: 18px;
  --spacing-19: 19px;
  --spacing-20: 20px;
  --spacing-21: 21px;
  --spacing-25: 25px;
  --spacing-27: 27px;
  --spacing-30: 30px;
  --spacing-35: 35px;
  --spacing-40: 40px;
  --spacing-50: 50px;
  --spacing-100: 100px;

  /* Border Radius */
  --radius-full: 500px;
}
```
