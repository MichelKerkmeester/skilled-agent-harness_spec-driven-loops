# SICK AGENCY — Style Reference
> Loud printed broadside on a brick wall — a maximalist zine spread screaming from a screen.

**Theme:** mixed

Sick Agency treats the browser as a printed broadside, not a software interface. The system is unapologetically maximalist: three saturated color fields (voltage yellow, radioactive orange, electric blue) alternate as full-bleed section backgrounds, and those colors do not play a supporting role — they are the surface. Display typography is the primary content: condensed black-weight faces at 122–229px are set with line-heights as tight as 0.70, filling the viewport edge-to-edge with no margin for safety. There are no cards, no shadows, no neutral grays, no subtle elevation — the visual hierarchy comes from color contrast and type scale jumps of 5–10x, not from spacing or depth. Interactive elements are pill-shaped and stark, not soft. The overall logic is poster-first: every screen should look like a layer of a zine spread.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Voltage Yellow | `#ffc700` | `--color-voltage-yellow` | Primary section background and dominant display text color. Headings, borders, and full-bleed canvas bands. Carries the highest visual weight on the page |
| Radioactive Orange | `#ff4e27` | `--color-radioactive-orange` | Secondary section background and accent border color. Outlined action borders, dividers, icon strokes, and full-bleed canvas bands that create contrast with the yellow |
| Electric Cobalt | `#0029ff` | `--color-electric-cobalt` | Primary action background and tertiary section background. The only filled button color in the system; also used for full-bleed canvas bands and decorative sticker badges |
| Burnt Sienna | `#4d170c` | `--color-burnt-sienna` | Error and warning state. Input border in invalid state. Reads as a deep brick-red against the lighter orange, preserving the system’s warm-color vocabulary |
| Ink Black | `#000000` | `--color-ink-black` | Body text on light/yellow backgrounds, and the dominant border color across all surface bands. Functions as a hairline outline and text color wherever contrast is needed against yellow or white |
| Bone White | `#ffffff` | `--color-bone-white` | Body text and button text on cobalt and orange surfaces. The inverse of Ink Black — the two together carry all foreground-to-background contrast in the system |

## Tokens — Typography

### Morganite — Hero display face for the single largest typographic statement per page. The extreme 0.70 line-height stacks letterforms with no air between lines — type is treated as a solid block, not a paragraph. This face defines the agency’s shock-value identity. · `--font-morganite`
- **Substitute:** Bebas Neue (free), Anton, Tungsten Bold
- **Weights:** 900
- **Sizes:** 229px
- **Line height:** 0.70
- **Role:** Hero display face for the single largest typographic statement per page. The extreme 0.70 line-height stacks letterforms with no air between lines — type is treated as a solid block, not a paragraph. This face defines the agency’s shock-value identity.

### Thunder — Secondary display face used at near-hero scale. The light weight is anti-convention for a 122px headline — most agencies use 700-900 here. Thunder’s 300 whispers while still occupying monumental space, creating tension between volume and restraint. Substituted by ITC Avant Garde Gothic, Futura, or any geometric humanist sans. · `--font-thunder`
- **Substitute:** ITC Avant Garde Gothic, Futura, Josefin Sans
- **Weights:** 300
- **Sizes:** 122px
- **Line height:** normal
- **Role:** Secondary display face used at near-hero scale. The light weight is anti-convention for a 122px headline — most agencies use 700-900 here. Thunder’s 300 whispers while still occupying monumental space, creating tension between volume and restraint. Substituted by ITC Avant Garde Gothic, Futura, or any geometric humanist sans.

### Sentient — Workhorse text face for body copy, buttons, inputs, links, and small labels. Carries tight negative tracking (-0.0100em to -0.0200em) even at body sizes, which is a serif’s signature in a sans-dominated layout. Substituted by any transitional serif. · `--font-sentient`
- **Substitute:** Spectral, Lora, Source Serif Pro
- **Weights:** 400
- **Sizes:** 12px, 16px, 24px
- **Line height:** 1.10-2.25
- **Letter spacing:** -0.0100em to -0.0200em (tighter as size increases)
- **Role:** Workhorse text face for body copy, buttons, inputs, links, and small labels. Carries tight negative tracking (-0.0100em to -0.0200em) even at body sizes, which is a serif’s signature in a sans-dominated layout. Substituted by any transitional serif.

### Times — Fine-print and micro-label face for legal text, tiny annotations, and icon-adjacent micro-copy. Its system-serif feel is a deliberate contrast to the custom display faces, creating a visual fossil-record effect. · `--font-times`
- **Weights:** 400
- **Sizes:** 10px
- **Line height:** 1.15
- **Role:** Fine-print and micro-label face for legal text, tiny annotations, and icon-adjacent micro-copy. Its system-serif feel is a deliberate contrast to the custom display faces, creating a visual fossil-record effect.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 10px | 1.15 | — | `--text-caption` |
| body | 16px | 1.44 | -0.24px | `--text-body` |
| subheading | 24px | 1.1 | -0.36px | `--text-subheading` |
| display | 122px | 1 | — | `--text-display` |
| display-lg | 229px | 0.7 | — | `--text-display-lg` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 8 | 8px | `--spacing-8` |
| 12 | 12px | `--spacing-12` |
| 16 | 16px | `--spacing-16` |
| 24 | 24px | `--spacing-24` |
| 32 | 32px | `--spacing-32` |
| 36 | 36px | `--spacing-36` |
| 172 | 172px | `--spacing-172` |

### Border Radius

| Element | Value |
|---------|-------|
| badges | 999px |
| inputs | 0px (sharp corners are part of the system identity; only interactive elements get pills) |
| buttons | 999px |

### Layout


## Components

### Primary Action Button
**Role:** Filled cobalt pill button — the only filled button in the system

Background #0029ff, text #ffffff, font Sentient 16px weight 400, 999px border-radius, padding 5px 24px (vertical/horizontal). No shadow, no border. The pill shape is the system’s only softness — everything else is hard-edged.

### Outlined Ghost Button
**Role:** Outlined action used when a second action is needed beside the primary

Transparent background, border 1-2px #ff4e27 or #000000, text in matching color, 999px border-radius, padding 5px 24px. No fill on hover — instead, the border thickens or the text inverts.

### Display Heading (Black)
**Role:** Morganite 900 set at 229px with 0.70 line-height

Color #000000 on yellow, or #ffffff on cobalt/orange. Letters stack with almost no leading. The text block is the visual element; surrounding layout must yield to it. Never break below 2 lines of display type on a hero.

### Display Heading (Light)
**Role:** Thunder 300 set at 122px

Color #000000 or #ffc700. The 300-weight at 122px is the system’s signature anti-typical choice — most agencies push weight to 800+ at this size. Thunder whispers at a volume where competitors shout.

### Body Text Block
**Role:** Sentient 16px / 1.44 on colored canvas

Color #ffffff on orange/cobalt, #000000 on yellow. Tracking at -0.0100em. Max measure around 480px. Margins of 5px between paragraphs. Never use on white background — the system has no white surface.

### Text Input
**Role:** Form field with sharp corners and thick black border

Background yellow or orange, border 1-2px #000000 or #4d170c (error state), padding 16px, text Sentient 16px #000000. Sharp 0px corners — pills are reserved for actions, not fields. Error state shows the burnt sienna #4d170c border.

### Sticker Badge
**Role:** Decorative circular badge used as a CTA anchor or section marker

Circular shape (999px radius on a square or large element), filled in a contrasting system color (#0029ff circle on orange background, as seen in the “TEXT US’’ sticker), with short text in white at 10-16px. Functions as both a CTA and a visual punctuation mark.

### Hairline Divider
**Role:** Thin black line used to separate text blocks inside a colored section

1-2px #000000 line, no margin collapse. Functions as a printed broadside rule rather than a UI divider.

### Full-Bleed Section Band
**Role:** The atomic layout unit — a single color field filling the viewport horizontally

Three allowed colors: #ffc700, #ff4e27, #0029ff. No padding on the section itself; internal content sits flush to the edges or in a grid column. Sections are stacked with 0px gap; transition is a hard color cut with no gradient or shadow.

### Decorative Illustration Sticker
**Role:** Small hand-drawn illustrated objects placed on the canvas as visual personality

Outlined or flat-filled illustrations in #0029ff on yellow/orange sections, or #ffc700 on cobalt sections. Examples in the data: UFO, basketball, orbital ring shapes. These are not product imagery — they are zine-style decorations that reinforce the printed-poster mood.

### Micro Label
**Role:** Sentient 12px label for tags, metadata, and small annotations

Color #ffffff on dark/orange backgrounds, #000000 on yellow. Tracking -0.0100em. Sits inline with body text or floats beside an icon. Treat as editorial chrome, not UI chrome.

### Vertical Type Stack
**Role:** Sentient or Thunder set 90° rotated, used as a poster-style edge element

Text runs vertically along the left or right edge of a full-bleed section, tracking at normal, in 16-24px. The screenshot’s left-edge “SICK THIS IS SICK THIS IS SICK” treatment is a vertical type stack — a repeating poster motif rather than a brand-mark.

## Do's and Don'ts

### Do
- Use #0029ff as the filled button background and #ffc700 as the dominant section canvas — these are the system’s two anchor colors and must both appear on every page.
- Set display headings at 122px (Thunder 300) or 229px (Morganite 900); never use a display face below 80px or above 240px.
- Use 999px border-radius only on buttons, badges, and decorative stickers — keep form fields, section bands, and dividers at 0px sharp corners.
- Use Sentient at 12-24px with negative tracking (-0.0100em to -0.0200em) for all body and small text; use Times only for 10px fine print and micro-annotations.
- Stack sections as full-bleed color bands in #ffc700 / #ff4e27 / #0029ff order with 0px gap and no gradient transitions between them.
- Use #4d170c only as an error-state input border — never as a section background, decorative element, or button fill.
- Anchor one corner of a hero with a circular Sticker Badge in a contrasting system color; treat it as a CTA and a visual punctuation mark simultaneously.

### Don't
- Do not introduce grays, off-whites, beige, or any desaturated color into the system — neutrals are only #000000 and #ffffff, used for text and borders.
- Do not add box-shadow, drop-shadow, or blur to any element — depth comes from color contrast between full-bleed bands, never from elevation.
- Do not use rounded corners (4px, 8px, 16px) on cards, sections, or containers — sharp 0px corners and 999px pills are the only two radii allowed.
- Do not set display type below 80px or set body type above 24px — the gap between body and display is what creates the broadside scale, and closing it destroys the system.
- Do not use Morganite 900 with line-height above 0.80 — its identity depends on near-touching stacked lines; looser leading would turn it into a generic display face.
- Do not place a primary action button on a white or near-white background — the system has no white surface; buttons live on yellow, orange, or cobalt fields.
- Do not use photographic backgrounds, gradients, or textures — surfaces are always flat solid color.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Cobalt Field | `#0029ff` | Darkest full-bleed band; used for primary action surface and dramatic section backgrounds |
| 1 | Orange Field | `#ff4e27` | Mid-warmth full-bleed band; provides transition between the cobalt and yellow extremes |
| 2 | Yellow Field | `#ffc700` | Lightest full-bleed band; the dominant canvas color, carries display headings in black |

## Elevation

There is no elevation system. Depth is communicated through color contrast between full-bleed sections, never through shadows or blur. A button on a section inherits contrast from the section’s background, not from a shadow ring. Any use of box-shadow would break the broadside aesthetic — if a component feels like it needs elevation, it is the wrong component for this system.

## Imagery

The site is almost entirely type-driven, with no photography. Visual content consists of hand-drawn illustration stickers (UFO, basketball, abstract orbital shapes) that function as zine-style decorations rather than product imagery. The illustration style is flat with hard outlines or single-color fills, rendered in system colors (#0029ff on yellow/orange fields, #ffc700 on cobalt fields). There are no product screenshots, no stock photography, no lifestyle imagery, no gradients or textures. The page IS the visual — color fields and display typography carry the entire atmosphere.

## Layout

Layout is full-bleed, not containerized. There is no max-width wrapper — the page fills the viewport horizontally. Sections are hard-cut color bands stacked with zero vertical gap, each band filling 100vw. Within a band, content sits in a loose editorial grid: display type often runs edge-to-edge (letterforms bleeding off the sides), body text is constrained to a narrow measure (max ~480px) and left-aligned. The hero is a single color band with display type set at 229px or 122px, sometimes split by a vertical type column on the left edge (rotated 90°). Navigation is minimal — a single pill button or text link, not a traditional nav bar. The rhythm is poster-like: one big typographic statement per section, surrounded by color silence.

## Agent Prompt Guide

## Quick Color Reference
- text on yellow: #000000
- text on orange: #ffffff
- text on cobalt: #ffffff
- Create a Primary Action Button: #0029ff background, #ffffff text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.
- background (secondary): #ff4e27
- background (tertiary): #0029ff
- primary action: #0029ff (filled action)

## Example Component Prompts

1. **Create a full-bleed hero section.** Background #ffc700, no padding on the section. Headline in Morganite weight 900 at 229px, line-height 0.70, color #000000, tracking normal. Headline must fill the viewport width and may bleed off the left and right edges. Below the headline, a left-aligned body paragraph in Sentient 16px / 1.44, color #000000, tracking -0.16px, max-width 480px, 5px top margin. Top-left corner: a circular Sticker Badge, 120px diameter, background #0029ff, text #ffffff in Times 10px reading "TEXT US", 999px border-radius.

2. **Create a primary action button.** Background #0029ff, text #ffffff, font Sentient 16px weight 400, padding 5px 24px, border-radius 999px, no border, no shadow. Sits on a #ffc700 or #ff4e27 section band — never on white.


4. **Create a text input field.** Background #ffc700, border 2px solid #000000, padding 16px, font Sentient 16px color #000000, border-radius 0px (sharp corners). Placeholder in #000000 at 60% opacity. Error state: border becomes #4d170c.

5. **Create a full-bleed section transition.** Stack the next section directly below with 0px gap, background #ff4e27 (or #0029ff). No gradient, no shadow, no border between sections — the color change is the transition.

## Color Block System

The page is a sequence of three colors: #ffc700 → #ff4e27 → #0029ff. These are not accents against a neutral — they ARE the palette. The dominant canvas is yellow, the contrast canvas is orange, and the dramatic canvas is cobalt. There is no fourth color. Any new section must be one of these three; if a different color is needed, the design has drifted outside the system. The cobalt section is always the smallest in area (a single section or button), orange is mid-weight, and yellow occupies the majority of the page — roughly 50-60% of the visible canvas.

## Type Stacking Rules

Display type at 122px and 229px is set with line-heights of 1.0 and 0.70 respectively — letters stack with almost no air between them. This is intentional: the type is treated as a solid visual block, not a readable paragraph. Display headings should be 2-4 lines tall and occupy 30-60% of the viewport height. Never break a 229px headline below 2 lines. Never set a display face in a single line below 80% viewport width — the scale demands it fill the page.

## Similar Brands

- **Wieden+Kennedy (wieden-kennedy.com)** — Same bold agency identity with oversized condensed display type and saturated background color blocks replacing neutral surfaces
- **Guns & Roses (gamsnroses.com)** — Same anti-corporate maximalist zine aesthetic with massive display type running edge-to-edge on vivid color fields
- **Studio Dumbar (studiodumbar.com)** — Same opinionated color-led identity with no neutral grays and display typography that functions as the primary content
- **Heydays (heydays.no)** — Same flat-color section stacking with no gradients and zero elevation; full-bleed bands with type as the visual
- **Giant Ant (giantant.ca)** — Same loud anti-minimalist agency presence with oversized display faces and saturated tricolor canvas bands

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-voltage-yellow: #ffc700;
  --color-radioactive-orange: #ff4e27;
  --color-electric-cobalt: #0029ff;
  --color-burnt-sienna: #4d170c;
  --color-ink-black: #000000;
  --color-bone-white: #ffffff;

  /* Typography — Font Families */
  --font-morganite: 'Morganite', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-thunder: 'Thunder', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-sentient: 'Sentient', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-times: 'Times', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.15;
  --text-body: 16px;
  --leading-body: 1.44;
  --tracking-body: -0.24px;
  --text-subheading: 24px;
  --leading-subheading: 1.1;
  --tracking-subheading: -0.36px;
  --text-display: 122px;
  --leading-display: 1;
  --text-display-lg: 229px;
  --leading-display-lg: 0.7;

  /* Typography — Weights */
  --font-weight-light: 300;
  --font-weight-regular: 400;
  --font-weight-black: 900;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-36: 36px;
  --spacing-172: 172px;

  /* Layout */

  /* Border Radius */
  --radius-full: 999px;

  /* Named Radii */
  --radius-badges: 999px;
  --radius-inputs: 0px (sharp corners are part of the system identity; only interactive elements get pills);
  --radius-buttons: 999px;

  /* Surfaces */
  --surface-cobalt-field: #0029ff;
  --surface-orange-field: #ff4e27;
  --surface-yellow-field: #ffc700;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-voltage-yellow: #ffc700;
  --color-radioactive-orange: #ff4e27;
  --color-electric-cobalt: #0029ff;
  --color-burnt-sienna: #4d170c;
  --color-ink-black: #000000;
  --color-bone-white: #ffffff;

  /* Typography */
  --font-morganite: 'Morganite', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-thunder: 'Thunder', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-sentient: 'Sentient', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-times: 'Times', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.15;
  --text-body: 16px;
  --leading-body: 1.44;
  --tracking-body: -0.24px;
  --text-subheading: 24px;
  --leading-subheading: 1.1;
  --tracking-subheading: -0.36px;
  --text-display: 122px;
  --leading-display: 1;
  --text-display-lg: 229px;
  --leading-display-lg: 0.7;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-36: 36px;
  --spacing-172: 172px;

  /* Border Radius */
  --radius-full: 999px;
}
```
