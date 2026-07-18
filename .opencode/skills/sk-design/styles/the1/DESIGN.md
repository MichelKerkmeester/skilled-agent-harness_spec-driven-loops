# The1 — Style Reference
> building-scale typography on painted concrete

**Theme:** light

The1 is a typographic architecture system: a neutral concrete canvas (d9d9d9) beneath display type so large it becomes wall structure. The brand speaks through KH Teka set at architectural scale with crushed line-heights of 0.70–0.80 and negative tracking down to -0.06em, so letters collide vertically and horizontally to form facades rather than sentences. Four vivid paint colors — Green, Pink, Yellow, Red — function as a place-identity system, each one assigned to a property or moment and deployed as full-bleed color blocks behind contained photography. The interface is ruthlessly flat: no shadows, no gradients, no elevation, no decorative chrome. Navigation is a wordmark, a text line, and a single dark pill. Hairline near-black borders do the structural work that cards and shadows do elsewhere. A designer rebuilding this system should treat type as the primary surface, color as wayfinding, and the canvas as an empty gallery wall the type inhabits.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| The Green | `#027b49` | `--color-the-green` | Full-bleed identity block for The Green property and any place or section it owns — deep forest green reads as architectural paint, not decoration |
| The Pink | `#f19ec8` | `--color-the-pink` | Red wash for highlight backgrounds, decorative bands, and soft emphasis behind content |
| The Red | `#fa4d43` | `--color-the-red` | Full-bleed identity block and dramatic section background — vermillion red carries the most visual weight and anchors expanded menu states and signature moments |
| The Yellow | `#fbb833` | `--color-the-yellow` | Yellow wash for highlight backgrounds, decorative bands, and soft emphasis behind content |
| Concrete | `#d9d9d9` | `--color-concrete` | Page canvas and primary surface — the light gray ground every screen sits on, treated as a material (concrete, drywall) rather than a neutral |
| Iron | `#1f1f1f` | `--color-iron` | Primary text, pill button fills, and most structural borders — near-black rather than pure black, softer on the concrete canvas while keeping max contrast |
| Carbon | `#000000` | `--color-carbon` | Hairline borders, icon strokes, and occasional deep accents where maximum bite is needed against the colored blocks |

## Tokens — Typography

### KH Teka — Primary display and heading face — the entire brand voice. Custom condensed sans set at 215px for the hero with letter-spacing -0.06em and line-height 0.70 so descenders kiss the next line and the word reads as a single architectural mass. Same family drops to 60px and 26px for sub-moments and 15–18px for in-line labels, always retaining negative tracking. This single family does every visible word on the site. · `--font-kh-teka`
- **Substitute:** Archivo Narrow, Barlow Condensed, or Roboto Condensed at tight tracking
- **Weights:** 400
- **Sizes:** 15px, 18px, 26px, 60px, 215px
- **Line height:** 0.70–1.20 (display uses crushed 0.70–0.80; subheadings 1.00; body 1.10–1.20)
- **Letter spacing:** -0.06em at 215px, -0.03em at 60px and below
- **Role:** Primary display and heading face — the entire brand voice. Custom condensed sans set at 215px for the hero with letter-spacing -0.06em and line-height 0.70 so descenders kiss the next line and the word reads as a single architectural mass. Same family drops to 60px and 26px for sub-moments and 15–18px for in-line labels, always retaining negative tracking. This single family does every visible word on the site.

### System sans-serif — Utility micro-copy only — availability text, small annotations, fine print. Used sparingly so KH Teka remains the brand voice. · `--font-system-sans-serif`
- **Substitute:** system-ui, -apple-system, Segoe UI, sans-serif
- **Weights:** 400
- **Sizes:** 12px
- **Line height:** 1.20
- **Role:** Utility micro-copy only — availability text, small annotations, fine print. Used sparingly so KH Teka remains the brand voice.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.2 | — | `--text-caption` |
| body | 15px | 1.2 | — | `--text-body` |
| body-sm | 18px | 1.1 | -0.03px | `--text-body-sm` |
| subheading | 26px | 1 | -0.03px | `--text-subheading` |
| heading | 60px | 0.8 | -0.03px | `--text-heading` |
| display | 215px | 0.7 | -0.06px | `--text-display` |

## Tokens — Spacing & Shapes

**Density:** compact

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 5 | 5px | `--spacing-5` |
| 6 | 6px | `--spacing-6` |
| 8 | 8px | `--spacing-8` |
| 10 | 10px | `--spacing-10` |
| 11 | 11px | `--spacing-11` |
| 14 | 14px | `--spacing-14` |
| 15 | 15px | `--spacing-15` |
| 19 | 19px | `--spacing-19` |
| 20 | 20px | `--spacing-20` |
| 24 | 24px | `--spacing-24` |
| 30 | 30px | `--spacing-30` |
| 40 | 40px | `--spacing-40` |
| 50 | 50px | `--spacing-50` |
| 100 | 100px | `--spacing-100` |
| 130 | 130px | `--spacing-130` |
| 170 | 170px | `--spacing-170` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 100px |
| cards | 0px |
| buttons | 100px |
| menuButton | 100px |

### Layout

- **Page max-width:** 1440px
- **Section gap:** 40px
- **Card padding:** 0px
- **Element gap:** 10px

## Components

### Pill Button
**Role:** Primary interactive control for 'Learn more' and 'Contact us' — the only button pattern on the site

Border-radius 100px, background #1f1f1f, text in #d9d9d9 or white at 15px KH Teka weight 400, padding ~10px 20px. No border, no shadow, no hover lift — the dark pill on concrete canvas is the entire button language.

### Hamburger Menu Trigger
**Role:** Top-right menu opener on every page

Solid circle, ~48px diameter, background #1f1f1f, containing a three-line white hamburger glyph. No border, no shadow. The circle sits as a graphic object in the top-right corner with generous margin.

### Property Identity Card
**Role:** Full-bleed color-bloc card introducing each property (The Green, The Pink, The Yellow, The Red)

Zero border-radius, full-bleed fill in one of the four brand colors (#027b49 / #f19ec8 / #fa4d43 / #fbb833). A contained photograph of the building is inset within, occupying roughly the top two-thirds. Below the photo: property name in KH Teka 26px, followed by a 8–10px colored status dot, then availability copy in 15px. No card border, no shadow — the color block IS the card.

### Status Dot
**Role:** Wayfinding marker next to each property name

8–10px solid circle, fill matches the property's identity color (green dot for The Green, pink dot for The Pink, etc.). Sits inline next to the property name in the card footer.

### Hairline Section Divider
**Role:** Structural break between major page sections

1px solid horizontal line in #1f1f1f spanning the full content width, with no padding above or below — the line is the break.

### Display Headline
**Role:** Hero and section-anchor type — the signature visual element

KH Teka 60–215px, weight 400, letter-spacing -0.06em at 215px dropping to -0.03em at 60px, line-height 0.70–0.80 so type stacks into a wall. Color #1f1f1f on the concrete canvas. No leading, no underlay, no decoration.

### Brand Wordmark
**Role:** Persistent top-left identity mark

"THE1" set in KH Teka 26px weight 400, letter-spacing -0.03em, color #1f1f1f. Plain text — no logo lockup, no symbol.

### Expanded Menu Panel
**Role:** Full-viewport overlay when the hamburger is activated

Full-bleed #fa4d43 surface filling the screen beneath the header strip. A massive black numeral "1" (KH Teka 215px, #1f1f1f or #000000) is cropped at the left edge as a graphic mark, not a word. Header bar retains the concrete canvas above the red field.

### Inline Text Link
**Role:** Quiet navigational link in header and card footers

KH Teka 15–18px, color #1f1f1f, no underline by default. Reads as a word in a sentence, not a UI element.

### In-Text CTA Pair
**Role:** Header pattern: a question phrase followed by a pill button

Plain text question ("Are you the one?" / "Office space at NDSM-wharf") in KH Teka 15–18px sits immediately to the left of a dark Pill Button. The pair reads as a single conversational unit — the text is the setup, the pill is the answer.

## Do's and Don'ts

### Do
- Set every headline in KH Teka weight 400 with letter-spacing -0.06em at 60px and above, -0.03em at 60px and below; the negative tracking is the brand voice
- Use line-height 0.70–0.80 on display type (60px+) so descenders of one line touch the ascenders of the next — the type forms a wall, not a paragraph
- Reserve the four chromatic colors (#027b49, #f19ec8, #fa4d43, #fbb833) as full-bleed identity blocks for properties or named places; never use them for inline accents, icons, or text
- Use #1f1f1f near-black for all body text, borders, and pill-button fills rather than pure #000000; the softer black feels of-a-piece with the concrete canvas
- Let the four brand colors sit edge-to-edge with no card padding, no border, and no shadow — the color block is the component
- Pair every dark Pill Button (border-radius 100px, fill #1f1f1f) with a leading text question in the same line, so the button reads as an answer not an action
- Use 8–10px colored dots in the property's identity color as inline wayfinding marks next to its name

### Don't
- Do not assign the four chromatic colors to statuses (success/error/warning/info) — they are a fixed identity set, not a semantic palette
- Do not add box-shadows, gradients, or any elevation to cards, buttons, or images — the system is ruthlessly flat
- Do not introduce a second display typeface; KH Teka is the only voice and must own every visible word
- Do not round card corners — properties and sections are full-bleed rectangles; rounding is reserved exclusively for pills (100px) and the hamburger circle
- Do not use a line-height above 1.20 anywhere; display type must be crushed to 0.70–0.80, never relaxed to 1.4–1.6 'for readability'
- Do not use #027b49, #f19ec8, #fa4d43, or #fbb833 for body text, fine print, or button fills — they are surface colors, not content colors
- Do not wrap the hero display type in a max-width container that breaks it across lines naturally; let the headline run full-bleed and break on its own terms

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Concrete Canvas | `#d9d9d9` | Default page background; the gray floor every section sits on |
| 1 | Paint Block | `#fbb833` | First chromatic layer — full-bleed color surfaces for property cards and section blocks |
| 2 | Paint Block | `#f19ec8` | Second chromatic layer — same role, different identity assignment |
| 3 | Paint Block | `#fa4d43` | Heaviest chromatic layer — dramatic moments and expanded menu states |
| 4 | Paint Block | `#027b49` | Fourth chromatic layer — completes the four-color identity set |
| 5 | Iron Surface | `#1f1f1f` | Dark interactive surface for pill buttons, inverted text on light grounds |

## Imagery

Imagery is treated as contained content within full-bleed color blocks, not as standalone photography. Each property card is a solid brand-color rectangle (green, pink, yellow, red) with a building photograph inset at the top — the photograph's edges are clipped hard to the color block, no rounded corners, no shadow, no overlay. The photos are straight architectural shots of brick-and-glass facades, presented without lifestyle context, people, or staging — the building is the subject. The expanded menu replaces imagery entirely with a massive cropped numeral '1' in near-black on the red field, treating type itself as a graphic mark. Overall: text-dominant with photo reduced to contained documentary crops inside painted frames.

## Layout

The page is full-bleed on a 1440px max-width canvas with hairline gutters, not a centered narrow column. The hero is a single open field of concrete-gray (#d9d9d9) with display type running nearly edge-to-edge — no hero image, no split layout, just type and negative space. The property section is a 4-column equal grid of full-bleed color cards, each card spanning the full content width divided by four with no internal margins. Sections are separated by hairline #1f1f1f dividers, not by whitespace bands. Navigation is a minimal top bar: wordmark left, hamburger circle right, with an optional inline text+button pair floating in the content flow. Expanded menu state covers the full viewport in red. Vertical rhythm is driven by section breaks (40px) and by the crushed line-height of display type, not by generous padding. The overall impression is gallery-wall: type hung on a flat surface, color blocks standing on the floor.

## Agent Prompt Guide

**Quick Color Reference**
- text: #1f1f1f
- background: #d9d9d9
- border: #1f1f1f
- accent: #fa4d43 (and the three siblings #027b49, #f19ec8, #fbb833 — one per property, never generic)
- pill button fill: #1f1f1f
- primary action: no distinct CTA color

**Example Component Prompts**
1. Build a hero section on a #d9d9d9 concrete canvas. Place a display headline in KH Teka weight 400 at 215px, line-height 0.70, letter-spacing -0.06em, color #1f1f1f. The headline should fill nearly the full canvas width and break across two or three lines naturally. Add a small 'THE1' wordmark in KH Teka 26px top-left and a 48px #1f1f1f solid-circle hamburger top-right.

2. Build a property card with zero border-radius, full-bleed fill #027b49 (The Green). Inset a contained architectural photograph in the top two-thirds. Below: property name 'The Green' in KH Teka 26px #1f1f1f, followed by an 8px solid #027b49 status dot, then availability copy in KH Teka 15px #1f1f1f.

3. Build a header pattern: 'Are you the one?' in KH Teka 18px #1f1f1f, immediately followed by a pill button with border-radius 100px, background #1f1f1f, text 'Contact us' in #d9d9d9 at KH Teka 15px, padding 10px 20px. The text question and pill sit on the same baseline as a single conversational unit.

4. Build an expanded menu state: full-viewport #fa4d43 surface. A massive near-black '1' numeral in KH Teka 215px weight 400 is cropped at the left edge of the red field, acting as a graphic mark. A hairline #1f1f1f header bar sits above the red field with the wordmark and a close affordance.

5. Build a section divider: a single 1px solid #1f1f1f horizontal line spanning the full content width with zero padding above or below — the line itself is the break.

## Similar Brands

- **Pentagram** — Same massive-scale display type-as-architecture approach, same restraint to a near-monochrome canvas with chromatic identity moments
- **Vitsoe** — Same flatness, same no-shadow / no-gradient discipline, same quiet near-black-on-gray with a single accent surface for emphasis
- **Tom Dixon** — Same industrial-material palette (concrete gray + saturated paint colors) used as full-bleed identity blocks rather than decorative accents
- **Locomotive (locomotive.ca)** — Same typographic-led hero with crushed line-height and negative tracking, same use of vivid color as full-bleed section blocks over a neutral canvas

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-the-green: #027b49;
  --color-the-pink: #f19ec8;
  --color-the-red: #fa4d43;
  --color-the-yellow: #fbb833;
  --color-concrete: #d9d9d9;
  --color-iron: #1f1f1f;
  --color-carbon: #000000;

  /* Typography — Font Families */
  --font-kh-teka: 'KH Teka', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-system-sans-serif: 'System sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.2;
  --text-body: 15px;
  --leading-body: 1.2;
  --text-body-sm: 18px;
  --leading-body-sm: 1.1;
  --tracking-body-sm: -0.03px;
  --text-subheading: 26px;
  --leading-subheading: 1;
  --tracking-subheading: -0.03px;
  --text-heading: 60px;
  --leading-heading: 0.8;
  --tracking-heading: -0.03px;
  --text-display: 215px;
  --leading-display: 0.7;
  --tracking-display: -0.06px;

  /* Typography — Weights */
  --font-weight-regular: 400;

  /* Spacing */
  --spacing-5: 5px;
  --spacing-6: 6px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-11: 11px;
  --spacing-14: 14px;
  --spacing-15: 15px;
  --spacing-19: 19px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-30: 30px;
  --spacing-40: 40px;
  --spacing-50: 50px;
  --spacing-100: 100px;
  --spacing-130: 130px;
  --spacing-170: 170px;

  /* Layout */
  --page-max-width: 1440px;
  --section-gap: 40px;
  --card-padding: 0px;
  --element-gap: 10px;

  /* Border Radius */
  --radius-3xl: 30px;
  --radius-full: 100px;
  --radius-full-2: 200px;
  --radius-full-3: 5000px;

  /* Named Radii */
  --radius-tags: 100px;
  --radius-cards: 0px;
  --radius-buttons: 100px;
  --radius-menubutton: 100px;

  /* Surfaces */
  --surface-concrete-canvas: #d9d9d9;
  --surface-paint-block: #fbb833;
  --surface-paint-block: #f19ec8;
  --surface-paint-block: #fa4d43;
  --surface-paint-block: #027b49;
  --surface-iron-surface: #1f1f1f;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-the-green: #027b49;
  --color-the-pink: #f19ec8;
  --color-the-red: #fa4d43;
  --color-the-yellow: #fbb833;
  --color-concrete: #d9d9d9;
  --color-iron: #1f1f1f;
  --color-carbon: #000000;

  /* Typography */
  --font-kh-teka: 'KH Teka', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-system-sans-serif: 'System sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.2;
  --text-body: 15px;
  --leading-body: 1.2;
  --text-body-sm: 18px;
  --leading-body-sm: 1.1;
  --tracking-body-sm: -0.03px;
  --text-subheading: 26px;
  --leading-subheading: 1;
  --tracking-subheading: -0.03px;
  --text-heading: 60px;
  --leading-heading: 0.8;
  --tracking-heading: -0.03px;
  --text-display: 215px;
  --leading-display: 0.7;
  --tracking-display: -0.06px;

  /* Spacing */
  --spacing-5: 5px;
  --spacing-6: 6px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-11: 11px;
  --spacing-14: 14px;
  --spacing-15: 15px;
  --spacing-19: 19px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-30: 30px;
  --spacing-40: 40px;
  --spacing-50: 50px;
  --spacing-100: 100px;
  --spacing-130: 130px;
  --spacing-170: 170px;

  /* Border Radius */
  --radius-3xl: 30px;
  --radius-full: 100px;
  --radius-full-2: 200px;
  --radius-full-3: 5000px;
}
```
