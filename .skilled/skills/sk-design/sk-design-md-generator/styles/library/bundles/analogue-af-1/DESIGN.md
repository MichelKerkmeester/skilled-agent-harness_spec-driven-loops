# Analogue aF-1 — Style Reference
> Vogue spread meets Bauhaus blueprint

**Theme:** light

Analogue aF-1 speaks the visual language of a luxury editorial print magazine: stark white canvases, Garamond serif whispers for moments of meaning, and a single jolt of electric blue that only appears when a hand is asked to act. Surfaces are flat, defined by hairline borders and generous corner radii (20-30px) rather than shadows — depth comes from layering soft radial washes and full-bleed photography behind film-strip frames. The palette is almost fanatically achromatic; the blue is rationed like ink, reserved exclusively for the primary action and atmospheric product vignettes. Components feel like printed editorial spreads — confident negative space, confident typography, and no decoration that doesn't earn its place.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Cobalt Signal | `#002fff` | `--color-cobalt-signal` | Violet action color for filled buttons, selected navigation states, and focused conversion moments. |
| Pure White | `#ffffff` | `--color-pure-white` | Page canvas, card surfaces, button text on cobalt fill, heading text on dark sections |
| Graphite | `#171717` | `--color-graphite` | Primary body text, heading text, hairline borders, icon strokes — the workhorse near-black that carries UI structure |
| Carbon | `#070707` | `--color-carbon` | Deepest text, dark gradient anchor points, near-black accents where maximum contrast is needed |
| Ink | `#000000` | `--color-ink` | Absolute black for borders, icons, and the film-strip frame effect — appears most in structural borders rather than type |
| Fog | `#ededed` | `--color-fog` | Soft card surface lift, input fields, subtle background differentiation from pure white canvas |
| Mist | `#b9b9b9` | `--color-mist` | Light surface wash, disabled or decorative backgrounds |
| Dove | `#c3c3c3` | `--color-dove` | Mid-neutral border for tertiary dividers |
| Iron | `#696969` | `--color-iron` | Muted body copy, secondary borders, placeholder text — the dominant mid-gray carrying prose-level hierarchy |
| Cobalt Mist | `radial-gradient(50% 75%, rgb(0, 54, 140) 0%, rgb(0, 79, 206) 10.68%, rgb(237, 237, 237) 100%)` | `--color-cobalt-mist` | Atmospheric radial gradient anchor (mid-stop) for the hero blue vignette |

## Tokens — Typography

### ITC Garamond Std Light Narrow — Editorial serif — deployed for the brand-defining typographic moments: the 'Analogue aF-1' wordmark, the nostalgic pull-quote ('Remember when every shot was a moment to cherish?'), and section-level statements. Light weight at large sizes is deliberately anti-luxury-tech; a Garamond at 64px weight 400 whispers where most product pages shout with bold sans. Narrow variant tightens the serif into modern proportions. · `--font-itc-garamond-std-light-narrow`
- **Substitute:** EB Garamond, Cormorant Garamond, or Playfair Display (lighter weights)
- **Weights:** 400
- **Sizes:** 15px, 17px, 30px, 40px, 64px
- **Line height:** 0.90, 1.20
- **Letter spacing:** -0.018em at 64px, -0.022em at 40px, -0.023em at 30px, -0.017em at 17px, -0.017em at 15px
- **Role:** Editorial serif — deployed for the brand-defining typographic moments: the 'Analogue aF-1' wordmark, the nostalgic pull-quote ('Remember when every shot was a moment to cherish?'), and section-level statements. Light weight at large sizes is deliberately anti-luxury-tech; a Garamond at 64px weight 400 whispers where most product pages shout with bold sans. Narrow variant tightens the serif into modern proportions.

### Graphik Medium — Geometric sans for all functional UI: navigation, buttons, input fields, captions, body labels, and the massive 150px display headline. Single weight (400) at every size creates a remarkably consistent voice — no bold/light toggle. The 150px instance is the 'af-1' hero display. Extremely tight tracking (-0.067em at the largest size) pushes the geometric forms into near-architectural density. · `--font-graphik-medium`
- **Substitute:** Inter, Manrope, or DM Sans at weight 400
- **Weights:** 400
- **Sizes:** 11px, 13px, 14px, 15px, 16px, 22px, 34px, 40px, 150px
- **Line height:** 0.85, 1.00, 1.20, 1.50
- **Letter spacing:** -0.0670em, -0.0530em, -0.0450em, -0.0300em, -0.0250em, -0.0210em, -0.0200em
- **Role:** Geometric sans for all functional UI: navigation, buttons, input fields, captions, body labels, and the massive 150px display headline. Single weight (400) at every size creates a remarkably consistent voice — no bold/light toggle. The 150px instance is the 'af-1' hero display. Extremely tight tracking (-0.067em at the largest size) pushes the geometric forms into near-architectural density.

### sans-serif — sans-serif — detected in extracted data but not described by AI · `--font-sans-serif`
- **Weights:** 400
- **Sizes:** 12px
- **Line height:** 1.2
- **Role:** sans-serif — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 11px | 1.2 | — | `--text-caption` |
| body | 15px | 1.2 | -0.26px | `--text-body` |
| heading-sm | 22px | 1.2 | -0.46px | `--text-heading-sm` |
| heading | 34px | 1 | -1.02px | `--text-heading` |
| heading-lg | 40px | 1 | -0.88px | `--text-heading-lg` |
| display | 64px | 0.9 | -1.15px | `--text-display` |

## Tokens — Spacing & Shapes

**Density:** compact

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 5 | 5px | `--spacing-5` |
| 10 | 10px | `--spacing-10` |
| 11 | 11px | `--spacing-11` |
| 14 | 14px | `--spacing-14` |
| 15 | 15px | `--spacing-15` |
| 19 | 19px | `--spacing-19` |
| 20 | 20px | `--spacing-20` |
| 24 | 24px | `--spacing-24` |
| 25 | 25px | `--spacing-25` |
| 29 | 29px | `--spacing-29` |
| 30 | 30px | `--spacing-30` |
| 40 | 40px | `--spacing-40` |
| 50 | 50px | `--spacing-50` |
| 60 | 60px | `--spacing-60` |
| 100 | 100px | `--spacing-100` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 20px |
| pills | 100px |
| images | 30px |
| inputs | 15px |
| buttons | 10px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| subtle | `rgba(255, 255, 255, 0.15) 0px 0px 0px 1px inset` | `--shadow-subtle` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 50px
- **Card padding:** 20px
- **Element gap:** 10px

## Components

### Primary Action Button
**Role:** The single most important interactive element — a filled cobalt blue pill that commands the visual hierarchy

Background: #002fff. Text: #ffffff, Graphik Medium 14px, weight 400. Padding: 10px 20px. Border-radius: 10px. No border, no shadow. This button is the system's one chromatic moment — use it sparingly, only for the singular ask per screen.

### Ghost/Dismiss Button
**Role:** Secondary negative action — opt-out companion to the primary CTA

Background: transparent. Text: #171717, Graphik Medium 14px. Padding: 10px 20px. Border: 1px solid #ededed. Border-radius: 10px. On hover the border darkens to #171717.

### Email Input Field
**Role:** Signup form input for the hero newsletter capture

Background: #ffffff. Border: none. Placeholder text: #b9b9b9, Graphik Medium 14px. Padding: 15px 20px. Border-radius: 15px. The field visually merges with the adjacent button into a continuous pill. Inset white glow (rgba(255,255,255,0.15) 0px 0px 0px 1px inset) is the only shadow in the system.

### Scroll Prompt Pill
**Role:** Persistent floating CTA at the bottom of hero sections

Background: #ffffff with slight transparency/blur. Text: #696969, Graphik Medium 12px. Border-radius: 100px (full pill). Positioned center-bottom, indicates downward scroll.

### Product Image Card
**Role:** Showcase of the camera product at multiple angles

Background: #ededed. Border-radius: 30px. No shadow, no border. Product render sits centered on the soft gray surface. The 30px radius gives the hardware a premium, almost pillowy presentation.

### Pre-Order Action Card
**Role:** Right-column purchase block in the product detail section

Right-aligned text block: 'Pre-order now' heading (Graphik Medium 34px, #171717), subtitle, price (Graphik Medium 22px bold-weight, #171717). Contains the Primary Action Button (#002fff) and Ghost Dismiss Button. Below: small payment method text in #696969.

### Testimonial Mini Card
**Role:** Social proof — features a person and their handle

Small square card with rounded corners (20px), showing a portrait photo with name overlay in #ffffff serif. Compact, unobtrusive, positioned floating in the layout.

### Film-Strip Full-Bleed Frame
**Role:** Editorial photography section with analog film border treatment

Full-width image section. Left and right edges show a repeating film-perforation pattern in #000000, framing the central photograph. Central image: dark, moody editorial photography. Serif headline overlays the image center in #ffffff. The film-strip border is the signature visual motif — a literal reference to analog photography.

### Hero Gradient Banner
**Role:** Atmospheric product reveal at page top

Full-bleed section with a radial blue-to-white gradient. Center text: 'Analogue aF-1' (Graphik Medium 150px, #ffffff) with subtitle in #ededed. The blue radiates from the center-bottom and fades to white at edges, creating a product-spotlight atmosphere. The camera render sits centered in the lower half.

### Brand Wordmark
**Role:** Top-center logo lockup

'analogue' in Graphik Medium, lowercase, #000000. Small, precise, centered in the header. No tagline, no icon — the wordmark is the entire identity mark.

### Language Selector
**Role:** Top-right locale switcher

Compact text control: globe icon + 'English' in Graphik Medium 12px, #171717. Subtle, right-aligned in header.

### Press Logo Strip
**Role:** Media mention band at section transition

Horizontal row of press logos (Techeblog, Camera, PetaPixel, etc.) in #696969 on a white band. Separated by vertical dividers in #ededed. Establishes editorial credibility.

## Do's and Don'ts

### Do
- Use Garamond weight 400 at 40-64px for editorial moments — quotes, product names, section openers. This is the system's signature voice.
- Reserve #002fff exclusively for the single primary action on any given screen. Never use it for decoration, tags, or secondary buttons.
- Apply 20px radius to cards and 30px radius to product imagery. The rounded softness is a counterpoint to the stark black/white palette.
- Anchor sections with 50px vertical gaps and keep card padding at 20px. The compact density is intentional — the system breathes through whitespace, not through padding bloat.
- Use Graphik Medium at weight 400 exclusively. Do not introduce bold or light variants — the single-weight consistency is the design language.
- Frame full-bleed photography with the film-strip perforation motif when presenting analog/nostalgic imagery. The border IS the brand statement.
- Set letter-spacing at -0.018em or tighter for any display text above 30px. The tight tracking pushes geometric forms into architectural density.

### Don't
- Never apply #002fff to backgrounds, icons, or text — it is a button fill only. Decorative blue dilutes its power as the system's one action color.
- Do not introduce drop shadows. The system uses flat surfaces and hairline borders. The only shadow permitted is the inset white glow on inputs.
- Do not use bold weights on Garamond. The light weight is the point — bold Garamond breaks the editorial whisper into a shout.
- Never use corner radii below 10px for interactive elements. The rounded geometry is non-negotiable for the premium feel.
- Do not add gradients to UI components. Gradients appear only as atmospheric washes on full-bleed sections, never on buttons, cards, or inputs.
- Do not use warm colors, greens, oranges, or reds for any state. The system is achromatic + cobalt. If you need a success/error state, use the neutral scale (#171717, #696969).
- Do not use Garamond for functional UI text (buttons, labels, inputs). It is reserved for editorial moments. Graphik handles everything functional.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Canvas | `#ffffff` | Primary page background — dominant surface across all sections |
| 2 | Fog Surface | `#ededed` | Elevated card surface, input field backgrounds, subtle differentiation |
| 3 | Blue Wash | `#00368c` | Atmospheric radial gradient vignette in the hero — the only chromatic surface treatment |

## Elevation

The system is intentionally flat. Elevation is communicated through surface color shifts (white → #ededed) and generous border-radius, never through shadows. The only shadow in the entire system is an inset white glow on input fields. This is a deliberate editorial-print aesthetic — like ink on paper, not like glass on glass.

## Imagery

The visual language is editorial photography with product renders. The hero features a high-fidelity 3D product render of the Analogue aF-1 camera on a soft blue radial wash — the product is presented dead-center, no lifestyle context, the object IS the hero. The second section is full-bleed dark editorial photography (couple on a beach at dusk) framed by a black film-strip perforation pattern on left and right edges — this is the signature motif, a literal analog film border. Lower sections show additional product renders at multiple angles (back, front, side) on soft #ededed card backgrounds. Photography treatment is moody, cinematic, low-key — warm skin tones against deep blue dusk. No stock-photo feel anywhere. Icons are minimal: a globe for language, no decorative iconography.

## Layout

Page is max-width 1200px centered. Hero is full-bleed with centered text and centered product render — symmetric, vertical stack. Second section is full-bleed with film-strip borders on edges, headline centered over image. Third section splits into a two-column layout: left column is a vertical stack of product detail cards (alternating image orientations, 20px radius), right column is a sticky-ish pre-order action card with text + CTA stack. A small floating testimonial card overlaps the product stack. The grid is asymmetric in the product section but symmetric in hero and editorial photo sections. Navigation is minimal: centered wordmark top, language selector top-right, no visible menu until scroll. Section rhythm: white → full-bleed dark image → white with 2-column product grid. Spacing is compact (50px section gaps) with generous internal padding around the hero gradient.

## Agent Prompt Guide

**Quick Color Reference**
- Background: #ffffff
- Surface: #ededed
- Primary text: #171717
- Muted text: #696969
- Border/divider: #ededed
- primary action: #002fff (filled action)

**3-5 Example Component Prompts**
1. **Hero Section**: Full-bleed white canvas. Centered wordmark 'analogue' in Graphik Medium 14px, #000000. Headline 'Analogue aF-1' in Graphik Medium 150px, #ffffff, letter-spacing -10px, centered over a radial blue gradient (rgb(0,54,140) → rgb(0,79,206) → rgb(237,237,237)). Subtitle in Graphik Medium 14px, #ededed. Email input (#ffffff, 15px padding, 15px radius) inline with a primary action button (#002fff, 10px 20px padding, 10px radius, white text 'Stay tuned').

2. **Film-Strip Editorial Section**: Full-bleed dark photograph with a black film-perforation pattern (sprocket holes) running vertically on left and right edges. Centered serif headline in #ffffff, ITC Garamond Std Light Narrow 40px, weight 400, letter-spacing -0.88px. Scroll prompt pill floating at bottom center (#ffffff background, 100px radius, 'Keep scrolling' in Graphik Medium 12px, #696969).

3. **Pre-Order Card**: Right-aligned block. Heading 'Pre-order now' in Graphik Medium 34px, #171717, letter-spacing -1.02px. Subtitle in Graphik Medium 14px, #696969. Price '€449.99' in Graphik Medium 22px, #171717. Primary button (#002fff fill, white text 'Pre-order now', 10px radius, 10px 20px padding). Ghost button below (transparent, #171717 border 1px, 'No Thanks', 10px radius). Payment note in Graphik Medium 11px, #696969.

4. **Product Detail Card**: Background #ededed, border-radius 30px, no shadow. Camera product render centered. No text inside the card. Cards stack vertically in the left column of a 2-column layout, with 50px gaps between them.

5. **Press Logo Strip**: White background band. Five logos in a horizontal row, separated by 1px vertical dividers in #ededed. Logo text in #696969, Graphik Medium 12px. Centered, max-width 1200px.

## Similar Brands

- **Leica Camera** — Same editorial-print approach to a photography product — serif type, generous whitespace, minimal UI, and an almost religious devotion to the product as the hero image
- **Teenage Engineering** — Stark black/white product pages with geometric sans-serif type and product renders on neutral gray card surfaces with generous border-radius
- **Aesop (aesop.com)** — Editorial typography mixing serif and sans, generous negative space, an almost monochrome palette with minimal accent color, and confident asymmetric product presentations
- **Nothing (nothing.tech)** — Product launch page with centered hero, dark editorial photography, and the same compact density + single-accent-color restraint
- **Arc Browser** — Mixes a distinctive serif (in Arc's case, custom) with a clean geometric sans for functional UI, on near-monochrome canvases with one electric accent

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-cobalt-signal: #002fff;
  --color-pure-white: #ffffff;
  --color-graphite: #171717;
  --color-carbon: #070707;
  --color-ink: #000000;
  --color-fog: #ededed;
  --color-mist: #b9b9b9;
  --color-dove: #c3c3c3;
  --color-iron: #696969;
  --color-cobalt-mist: #00368c;
  --gradient-cobalt-mist: radial-gradient(50% 75%, rgb(0, 54, 140) 0%, rgb(0, 79, 206) 10.68%, rgb(237, 237, 237) 100%);

  /* Typography — Font Families */
  --font-itc-garamond-std-light-narrow: 'ITC Garamond Std Light Narrow', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-graphik-medium: 'Graphik Medium', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-sans-serif: 'sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 11px;
  --leading-caption: 1.2;
  --text-body: 15px;
  --leading-body: 1.2;
  --tracking-body: -0.26px;
  --text-heading-sm: 22px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: -0.46px;
  --text-heading: 34px;
  --leading-heading: 1;
  --tracking-heading: -1.02px;
  --text-heading-lg: 40px;
  --leading-heading-lg: 1;
  --tracking-heading-lg: -0.88px;
  --text-display: 64px;
  --leading-display: 0.9;
  --tracking-display: -1.15px;

  /* Typography — Weights */
  --font-weight-regular: 400;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-5: 5px;
  --spacing-10: 10px;
  --spacing-11: 11px;
  --spacing-14: 14px;
  --spacing-15: 15px;
  --spacing-19: 19px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-25: 25px;
  --spacing-29: 29px;
  --spacing-30: 30px;
  --spacing-40: 40px;
  --spacing-50: 50px;
  --spacing-60: 60px;
  --spacing-100: 100px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 50px;
  --card-padding: 20px;
  --element-gap: 10px;

  /* Border Radius */
  --radius-md: 6px;
  --radius-lg: 10px;
  --radius-xl: 15px;
  --radius-2xl: 20px;
  --radius-3xl: 30px;
  --radius-full: 100px;

  /* Named Radii */
  --radius-cards: 20px;
  --radius-pills: 100px;
  --radius-images: 30px;
  --radius-inputs: 15px;
  --radius-buttons: 10px;

  /* Shadows */
  --shadow-subtle: rgba(255, 255, 255, 0.15) 0px 0px 0px 1px inset;

  /* Surfaces */
  --surface-canvas: #ffffff;
  --surface-fog-surface: #ededed;
  --surface-blue-wash: #00368c;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-cobalt-signal: #002fff;
  --color-pure-white: #ffffff;
  --color-graphite: #171717;
  --color-carbon: #070707;
  --color-ink: #000000;
  --color-fog: #ededed;
  --color-mist: #b9b9b9;
  --color-dove: #c3c3c3;
  --color-iron: #696969;
  --color-cobalt-mist: #00368c;

  /* Typography */
  --font-itc-garamond-std-light-narrow: 'ITC Garamond Std Light Narrow', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-graphik-medium: 'Graphik Medium', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-sans-serif: 'sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 11px;
  --leading-caption: 1.2;
  --text-body: 15px;
  --leading-body: 1.2;
  --tracking-body: -0.26px;
  --text-heading-sm: 22px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: -0.46px;
  --text-heading: 34px;
  --leading-heading: 1;
  --tracking-heading: -1.02px;
  --text-heading-lg: 40px;
  --leading-heading-lg: 1;
  --tracking-heading-lg: -0.88px;
  --text-display: 64px;
  --leading-display: 0.9;
  --tracking-display: -1.15px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-5: 5px;
  --spacing-10: 10px;
  --spacing-11: 11px;
  --spacing-14: 14px;
  --spacing-15: 15px;
  --spacing-19: 19px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-25: 25px;
  --spacing-29: 29px;
  --spacing-30: 30px;
  --spacing-40: 40px;
  --spacing-50: 50px;
  --spacing-60: 60px;
  --spacing-100: 100px;

  /* Border Radius */
  --radius-md: 6px;
  --radius-lg: 10px;
  --radius-xl: 15px;
  --radius-2xl: 20px;
  --radius-3xl: 30px;
  --radius-full: 100px;

  /* Shadows */
  --shadow-subtle: rgba(255, 255, 255, 0.15) 0px 0px 0px 1px inset;
}
```
