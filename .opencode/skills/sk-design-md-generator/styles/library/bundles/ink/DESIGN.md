# INK — Style Reference
> Editorial spread on warm paper. A single humanist voice, monochrome with a whisper of taupe, interrupted only by full-bleed photography and a slim band of warm orange.

**Theme:** light

INK is an editorial gallery for a digital studio: warm-white paper, a single weight of a humanist sans, and photography that fills the viewport edge-to-edge. The palette is almost entirely grayscale with one warm taupe (#afa697) doing duty as a 'whispered' secondary voice, while a pair of vivid oranges surfaces only inside decorative bands and illustrations — never inside UI controls. Components are reduced to their quietest form: pill-shaped nav, hairline-thin labels, and image captions that float beneath full-bleed frames. The visual rhythm alternates between vast editorial type passages and cinematic image plates, separated by 160px of negative space.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Ink Carbon | `#2e2a2b` | `--color-ink-carbon` | Primary text, logo mark, dark surface inversions, footer text on cream — a near-black with a barely-warm undertone that keeps the page from feeling clinical |
| Paper White | `#ffffff` | `--color-paper-white` | Page canvas and nav surface — the warm-white background that everything floats on |
| Whisper Taupe | `#afa697` | `--color-whisper-taupe` | Supporting neutral for secondary UI, dividers, and muted labels. |
| Bone Cream | `#e6dcd4` | `--color-bone-cream` | Alternate panel background and footer band — a warm cream that signals a quieter section without leaving the monochrome family |
| Lampblack | `#212121` | `--color-lampblack` | Deep surface for inversions and image overlays — slightly cooler than Ink Carbon, used where absolute darkness is needed without color cast |
| Signal Orange | `#fe5431` | `--color-signal-orange` | Decorative illustration accent — appears inside graphic bands and artwork, never as a UI control fill |
| Amber Pulse | `#ff8000` | `--color-amber-pulse` | Decorative illustration accent — companion to Signal Orange inside warm gradient bands and visual punctuation |

## Tokens — Typography

### Good Sans — Single voice across the entire interface — body, nav, buttons, headings, and display all share weight 400. The absence of bold is the signature: hierarchy comes from size and color, not weight. · `--font-good-sans`
- **Substitute:** Inter, Söhne, or GT America — any humanist sans with a relaxed x-height and open apertures will carry the same conversational tone
- **Weights:** 400
- **Sizes:** 18px, 22px, 27px, 60px
- **Line height:** 1.0–1.75 (size-dependent)
- **Letter spacing:** normal at all sizes
- **Role:** Single voice across the entire interface — body, nav, buttons, headings, and display all share weight 400. The absence of bold is the signature: hierarchy comes from size and color, not weight.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| body | 18px | 1.6 | — | `--text-body` |
| body-lg | 22px | 1.31 | — | `--text-body-lg` |
| subheading | 27px | 1.25 | — | `--text-subheading` |
| display | 60px | 1.09 | — | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 8px

**Density:** spacious

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 8 | 8px | `--spacing-8` |
| 16 | 16px | `--spacing-16` |
| 24 | 24px | `--spacing-24` |
| 32 | 32px | `--spacing-32` |
| 40 | 40px | `--spacing-40` |
| 64 | 64px | `--spacing-64` |
| 160 | 160px | `--spacing-160` |

### Border Radius

| Element | Value |
|---------|-------|
| nav | 100px |

### Layout

- **Section gap:** 160px
- **Element gap:** 16px

## Components

### Pill Nav Indicator
**Role:** Primary navigation trigger

A solid dark dot (Ink Carbon #2e2a2b) positioned in the top-right corner, acting as the menu/menu-state indicator. 100px border-radius makes it a perfect circle. No background fill beyond the dot itself.

### Wordmark Logo
**Role:** Brand identity mark

The text 'INK' set in Good Sans 400 at ~22px, Ink Carbon #2e2a2b, top-left of the viewport with 64px left padding. No icon, no enclosure — the typography alone carries the brand.

### Hero Statement Block
**Role:** Opening page headline

Two stacked lines: a muted taupe lead-in ('Technology made Beautiful.') at 27px in Whisper Taupe #afa697, followed by the main statement at 60px in Ink Carbon #2e2a2b. Left-aligned with 64px left padding, generous line-height (1.09 on the 60px line). No border, no background — just type on paper.

### Full-Bleed Project Plate
**Role:** Portfolio showcase frame

Edge-to-edge image occupying 100% viewport width, 100% viewport height of its container. No border-radius, no frame, no caption inside the image area. Photography extends past all gutters.

### Project Caption Row
**Role:** Label and pagination beneath an image

Single row below each project plate, separated from the image by ~64px of white. Left: project name in Good Sans 400 at 18px, Ink Carbon #2e2a2b. Right: '1/7' counter in the same size. No dividers, no icons.

### Decorative Warm Band
**Role:** Section transition graphic

A full-bleed gradient strip using Signal Orange #fe5431 to Amber Pulse #ff8000, with soft cloud-like diffusion. Appears as a visual exhale between text sections. Lives outside the type system — never carries copy.

### Cream Footer Panel
**Role:** Closing section surface

Bone Cream #e6dcd4 background spanning full viewport width, with Ink Carbon #2e2a2b type. Functions as a quiet coda — the only departure from pure white inside the page.

## Do's and Don'ts

### Do
- Use Good Sans weight 400 at every size — never introduce bold or medium weights to create hierarchy
- Set section breaks to 160px of vertical whitespace; this is the system's most recognizable rhythm
- Let project images fill 100% viewport width with zero border-radius and zero frame
- Use Whisper Taupe #afa697 for secondary headlines and Ink Carbon #2e2a2b for primary statements in the same block
- Use 100px border-radius on the nav indicator dot — it must read as a perfect circle
- Keep left-edge text alignment with 64px padding from viewport edge on every section
- Use Bone Cream #e6dcd4 only for footer-level coda sections, never mid-page

### Don't
- Don't add drop-shadows to any element — depth comes from fill, not blur
- Don't use Signal Orange #fe5431 or Amber Pulse #ff8000 as button backgrounds or link colors — they are decoration only
- Don't introduce a max-width container on text blocks — the left-edge 64px padding is the only gutter
- Don't use a second typeface, even for captions — Good Sans 400 covers the entire voice
- Don't add borders, dividers, or rules between sections — let whitespace do the work
- Don't crop project images with rounded corners or contain them in cards
- Don't bold or italicize any text for emphasis — use the taupe-to-carbon color shift instead

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Paper Canvas | `#ffffff` | Default page background and nav surface |
| 1 | Bone Panel | `#e6dcd4` | Footer band and quiet alternation sections |
| 2 | Lampblack Overlay | `#212121` | Image overlays and inversion surfaces |

## Elevation

The system has no shadows. Depth comes from scale and negative space, not drop-shadow. Where a dark element must rise above a light one, it does so by being filled with Lampblack or Ink Carbon — never by being raised with a blur.

## Imagery

Photography is full-bleed and cinematic: wide-angle product and architectural shots, often at golden hour, with deep horizon lines and minimal foreground clutter. The Joby Aviation frame centers a single subject against a silhouetted skyline, letting the object own the composition. No lifestyle context, no human subjects, no text overlays baked into the image. Imagery is text-dominant-page's counterweight: when the type is generous, the image is enormous, and vice versa. Illustration is reserved for warm gradient bands that act as visual breaths between sections.

## Layout

The page is full-bleed with no max-width container. The hero opens with a left-aligned text block at 64px inset from the viewport edge, followed by a warm gradient band, then a sequence of full-viewport-height project plates stacked vertically. Navigation is reduced to a wordmark top-left and a circular dot top-right — there is no horizontal nav bar, no sidebar. Section rhythm is dictated by 160px gaps between the last text block and the next image, and by the alternation of type-heavy and image-heavy blocks. Content density is low: one idea per screen, one image per idea.

## Agent Prompt Guide

## Quick Color Reference
- Page background: #ffffff (Paper White)
- Primary text: #2e2a2b (Ink Carbon)
- Muted/secondary text: #afa697 (Whisper Taupe)
- Borders/dividers: none (use whitespace)
- Decorative accent: #fe5431 (Signal Orange) — illustration bands only
- primary action: no distinct CTA color

## Example Component Prompts
1. **Hero Statement**: Left-aligned text block, 64px from viewport left edge. Lead-in line in Good Sans 400, 27px, #afa697, line-height 1.25. Primary statement in Good Sans 400, 60px, #2e2a2b, line-height 1.09. No background, no border, 160px space below before next section.
2. **Full-Bleed Project Plate**: Image container at 100vw × 100vh, no border-radius, no shadow, no caption inside. Below: a single row with project name left-aligned and '1/7' right-aligned, both in Good Sans 400, 18px, #2e2a2b, 64px below the image.
3. **Pill Nav Dot**: 16px circle in #2e2a2b, 100px border-radius, positioned top-right with 32px margin from edges. No label, no tooltip chrome.
4. **Cream Footer Panel**: Full-width band in #e6dcd4, with body text in Good Sans 400, 18px, #2e2a2b. 64px vertical padding, no dividers above or below.
5. **Decorative Warm Band**: Full-bleed strip ~200px tall between text sections, using a soft gradient from #fe5431 through #ff8000 with cloud-like diffusion. Carries no text.

## Weight Strategy

The single-weight typography is the system's most distinctive decision. Most design systems use 2–4 weights to build hierarchy; INK uses 1 weight and lets size (18 → 22 → 27 → 60) and color (#afa697 → #2e2a2b) carry the entire hierarchy. This creates a conversational, almost spoken quality — the page reads like someone thinking out loud, not shouting from a billboard. When generating new pages, resist the urge to add bold for emphasis; instead, shift the color or scale the size.

## Negative Space as Material

160px between major sections is not a margin — it is a structural element. The page breathes in these gaps, and the user's eye resets before the next idea. Compression (16–32px) only appears inside caption rows and nav positioning. Any new page built on this system must respect the 160px cadence or it will read as a different brand entirely.

## Similar Brands

- **Pentagram** — Same single-weight typography, full-bleed editorial imagery, and left-edge text alignment at the viewport gutter — both treat the page as a printed spread
- **Resn** — Shared playful-but-restrained digital studio voice with monochrome type and warm accent colors reserved for decorative moments
- **Manual** — Same generous negative space, humanist single-weight sans, and portfolio-first page structure with minimal navigation chrome
- **Locomotive** — Full-viewport project plates stacked vertically with caption rows beneath, and near-zero use of UI decoration between frames

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-ink-carbon: #2e2a2b;
  --color-paper-white: #ffffff;
  --color-whisper-taupe: #afa697;
  --color-bone-cream: #e6dcd4;
  --color-lampblack: #212121;
  --color-signal-orange: #fe5431;
  --color-amber-pulse: #ff8000;

  /* Typography — Font Families */
  --font-good-sans: 'Good Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-body: 18px;
  --leading-body: 1.6;
  --text-body-lg: 22px;
  --leading-body-lg: 1.31;
  --text-subheading: 27px;
  --leading-subheading: 1.25;
  --text-display: 60px;
  --leading-display: 1.09;

  /* Typography — Weights */
  --font-weight-regular: 400;

  /* Spacing */
  --spacing-unit: 8px;
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-64: 64px;
  --spacing-160: 160px;

  /* Layout */
  --section-gap: 160px;
  --element-gap: 16px;

  /* Border Radius */
  --radius-full: 100px;

  /* Named Radii */
  --radius-nav: 100px;

  /* Surfaces */
  --surface-paper-canvas: #ffffff;
  --surface-bone-panel: #e6dcd4;
  --surface-lampblack-overlay: #212121;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-ink-carbon: #2e2a2b;
  --color-paper-white: #ffffff;
  --color-whisper-taupe: #afa697;
  --color-bone-cream: #e6dcd4;
  --color-lampblack: #212121;
  --color-signal-orange: #fe5431;
  --color-amber-pulse: #ff8000;

  /* Typography */
  --font-good-sans: 'Good Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-body: 18px;
  --leading-body: 1.6;
  --text-body-lg: 22px;
  --leading-body-lg: 1.31;
  --text-subheading: 27px;
  --leading-subheading: 1.25;
  --text-display: 60px;
  --leading-display: 1.09;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-64: 64px;
  --spacing-160: 160px;

  /* Border Radius */
  --radius-full: 100px;
}
```
