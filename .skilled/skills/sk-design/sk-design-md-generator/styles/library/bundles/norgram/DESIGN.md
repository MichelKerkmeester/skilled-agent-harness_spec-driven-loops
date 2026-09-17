# Norgram — Style Reference
> white-walled art gallery

**Theme:** light

Norgram operates as an editorial design studio: a pristine white canvas, zero chromatic color, and typography as the sole protagonist. The system is ruthlessly monochrome — every screen reads as a black-on-white publication layout, with imagery providing the only relief. Helvetica Now Display carries the entire voice: whisper-tight tracking at headline sizes (87px at -0.02em), compact 12px metadata, and generous line-height restraint (1.0–1.17). Components are flat, borderless or hairline-bordered, and reduced to their typographic skeleton. There are no fills, no accents, no shadows of consequence — the discipline is in what is omitted. Page rhythm comes from alternating hero-sized image plates against dense text columns, and a persistent bottom info bar that anchors every section like a museum placard.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Obsidian | `#000000` | `--color-obsidian` | Primary text, dominant border ink, iconography, link default |
| Charcoal | `#141414` | `--color-charcoal` | Body text, card surface, dark UI block on white canvas |
| Paper White | `#ffffff` | `--color-paper-white` | Page canvas, card surface, inverse text on dark blocks |
| Bone | `#efefef` | `--color-bone` | Hairline borders, dividers, input outlines, and card edges on light surfaces. Do not promote it to the primary CTA color |
| Smoke | `#cecece` | `--color-smoke` | Light dividers, secondary borders on cards |
| Ash | `#b2b2b2` | `--color-ash` | Disabled button fill, inactive controls |
| Pewter | `#999999` | `--color-pewter` | Muted link surface, inactive background |
| Iron | `#777777` | `--color-iron` | Secondary body text, metadata, muted links, supporting borders |
| Graphite | `#5e5e5e` | `--color-graphite` | Tertiary text, micro-copy |
| Onyx | `#1f1f1f` | `--color-onyx` | Dark mode surface (project case blocks), inverse hero panel |

## Tokens — Typography

### Helvetica Now Display — Display and primary voice — used at all scales from 10px micro-labels through 87px hero headlines. The custom geometric sans is the entire typographic identity. · `--font-helvetica-now-display`
- **Substitute:** Inter (variable), Neue Haas Grotesk Display, Helvetica Neue
- **Weights:** 400, 500
- **Sizes:** 10, 12, 36, 87
- **Line height:** 1.00–1.17
- **Letter spacing:** -0.0200em at 87px, -0.0080em at 36px, -0.0050em at 12px, -0.0060em at 12px (Medium)
- **OpenType features:** `No detected font-feature-settings; rely on tight default tracking`
- **Role:** Display and primary voice — used at all scales from 10px micro-labels through 87px hero headlines. The custom geometric sans is the entire typographic identity.

### Times — Secondary serif for card descriptions, footer text, editorial body copy — a deliberate contrast voice to the sans display · `--font-times`
- **Substitute:** Times New Roman, EB Garamond, Source Serif Pro
- **Weights:** 400
- **Sizes:** 14, 16
- **Line height:** 1.43–1.50
- **Role:** Secondary serif for card descriptions, footer text, editorial body copy — a deliberate contrast voice to the sans display

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| micro | 10px | 1.1 | -0.02px | `--text-micro` |
| caption | 12px | 1.17 | -0.006px | `--text-caption` |
| body-sm | 14px | 1.43 | — | `--text-body-sm` |
| body | 16px | 1.5 | — | `--text-body` |
| subheading | 36px | 1.17 | -0.008px | `--text-subheading` |
| display | 87px | 1.1 | -0.02px | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** compact

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 5 | 5px | `--spacing-5` |
| 6 | 6px | `--spacing-6` |
| 7 | 7px | `--spacing-7` |
| 8 | 8px | `--spacing-8` |
| 9 | 9px | `--spacing-9` |
| 10 | 10px | `--spacing-10` |
| 11 | 11px | `--spacing-11` |
| 12 | 12px | `--spacing-12` |
| 16 | 16px | `--spacing-16` |
| 25 | 25px | `--spacing-25` |
| 30 | 30px | `--spacing-30` |
| 34 | 34px | `--spacing-34` |
| 50 | 50px | `--spacing-50` |
| 100 | 100px | `--spacing-100` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 10px |
| cards | 4px |
| large | 26px |
| buttons | 7px |

### Layout

- **Page max-width:** 1440px
- **Section gap:** 68px
- **Card padding:** 12px
- **Element gap:** 8px

## Components

### Hero Display Headline
**Role:** Page-defining typographic statement

Helvetica Now Display 400 at 87px, line-height 1.10, letter-spacing -0.02em, color #141414. Left-aligned, sits directly on white canvas with no decorative chrome.

### Project Image Plate
**Role:** Full-bleed case study image

Large photographic surface with no border and no radius. Bleeds to canvas edges, 1:1 or generous aspect ratio. No overlay, no caption inside the image.

### Museum Placard
**Role:** Section metadata strip

Compact bar below each image: 12px Helvetica Now Display, 1.17 line-height, color #141414 for project name, #777777 for category. Padded 8px top/bottom, no border above, a thin 1px #000 divider in some contexts.

### Dark Info Block
**Role:** Inverse panel for project intro and crediting

Background #1f1f1f, padding ~40–60px. Text in #ffffff (Helvetica Now Display 36–87px) for statement, 12px #777 or #efefef for credits. Includes a 3D-styled camera icon rendered in #ff2a2a red/black in the corner — the only chromatic moment.

### Top-left Brand Mark
**Role:** Persistent identity anchor

'Norgram®' in Helvetica Now Display 400, 12–14px, #ffffff on dark blocks / #141414 on light. Top-left of every section, never repeated elsewhere.

### Secondary Text Button
**Role:** Quiet action control

12px Helvetica Now Display Medium, 1.67 line-height, 7px horizontal padding, 5px vertical padding. Color #000 with no background, underline on hover only.

### Link Row
**Role:** Inline text navigation between sections

12px Helvetica Now Display, 8–12px row gap, color #141414 default / #777 muted. No bullets, no separators — just stacked text rows.

### Case Study Card
**Role:** Index entry for projects

Flat tile with 4px radius. Image area is borderless and full-bleed. Below the image: project name in 12px Helvetica Now Display Medium, year right-aligned in same weight.

### Footer Colophon
**Role:** Bottom-of-page attribution

Times 14–16px, 1.43–1.50 line-height, color #141414. Centered or left-aligned, generous breathing room above.

### Push Notification Toast
**Role:** System overlay for product updates

Dark rounded surface (#000 or #1f1f1f), ~10px radius, white text in Helvetica Now Display 12px. 2-line layout: timestamp + headline / body. Sits top-right with minimal padding.

### Index Grid
**Role:** Multi-project overview

Two-column asymmetric grid mixing tall and short project plates. 8–12px gutter, 68px vertical section gap. No card chrome around images — they touch directly.

## Do's and Don'ts

### Do
- Use Helvetica Now Display 400 at 87px for display headlines with letter-spacing -0.02em — this is the only acceptable display size
- Keep all UI strictly monochrome: use only #000, #141414, #777, #efefef, and #fff
- Set border-radius to 4px on cards, 7px on buttons, 10px on tag/toast surfaces
- Maintain 8px element gap and 68px section gap as the spatial rhythm
- Place full-bleed product photography on the white canvas with no border, overlay, or shadow
- Use Times 14–16px for any prose longer than a single line (footer, card descriptions, credits)
- Anchor every section with the top-left 'Norgram®' wordmark and a bottom metadata strip

### Don't
- Do not introduce any chromatic color — no blue, green, red, or brand hue in the interface
- Do not use shadows on cards, images, or buttons; reserve the drop shadow for the system toast only
- Do not use weights above 500 in Helvetica Now Display — 400 carries the voice
- Do not exceed 4px radius on cards or fall below 7px on buttons; the flatness is intentional
- Do not use bordered buttons — all actions are ghost text links or underline-on-hover
- Do not add background fills behind text blocks; let type sit directly on the canvas
- Do not mix the serif Times into headlines or navigation — confine it to editorial body copy

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Paper White | `#ffffff` | Default page canvas and most section backgrounds |
| 1 | Bone | `#efefef` | Secondary surface wash, subtle differentiation within light sections |
| 2 | Onyx | `#1f1f1f` | Dark hero block for project statements and credited context |
| 3 | Charcoal | `#141414` | Card surface, dense text block background |

## Elevation

- **Toast:** `0 8px 24px rgba(0,0,0,0.12)`

## Imagery

Photography is the system's only color. Full-bleed, high-resolution, product-focused crops — eyewear, pianos, wood grain, paint swatches — treated like museum objects on a white wall. No lifestyle staging, no people, no decorative gradients. Images are unmasked, sharp-cornered, and touch each other directly in the grid with no gutter styling. The dark Onyx block introduces the only 3D-rendered object: a glossy red-and-black camera icon that breaks the photographic rule to act as a brand signature. Iconography elsewhere is line-art monochrome in #000 or #fff.

## Layout

Full-bleed page model with content anchored to a 1440px max-width column. Each section is an alternating image plate: a large photograph on one side, a tight text block on the other, with the museum placard strip running the full width below. The dark Onyx hero block breaks the white rhythm and houses the case study's display headline in 87px type. Navigation is minimized to a top-left wordmark and right-aligned section text links — no menu bar, no sidebar, no footer chrome. Vertical rhythm is established by 68px section gaps and 8px micro-gaps between text lines, creating the tight editorial density of a printed catalog.

## Agent Prompt Guide

**Quick Color Reference**
- text: #141414
- background: #ffffff
- border: #000000
- muted text: #777777
- surface wash: #efefef
- dark block: #1f1f1f
- primary action: no distinct CTA color

**Example Component Prompts**

1. Create a hero section: white (#ffffff) canvas. Display headline at 87px Helvetica Now Display weight 400, color #141414, letter-spacing -0.02em, line-height 1.10. No background, no border, no button — type only.

2. Create a project image plate: full-bleed photograph with 0px radius and no border. Below, a 12px Helvetica Now Display Medium placard strip with project name in #141414 left-aligned and year in #777777 right-aligned, 8px top/bottom padding.

3. Create a dark intro block: background #1f1f1f, padding 60px. 36px Helvetica Now Display 400 headline in #ffffff, letter-spacing -0.008em. Below at 12px: credit line in #efefef, line-height 1.17.

4. Create a case study index card: 4px radius, no shadow, no border. Image fills the card with no padding. Caption below in 12px Helvetica Now Display Medium #141414 with 12px padding around it.

5. Create a ghost navigation link: 12px Helvetica Now Display Medium #000, 7px horizontal padding, 5px vertical padding, no background, underline appears on hover. Inline with 12px row gap between siblings.

## Chromatic Punctuation

The only color in the entire system is the glossy red-and-black 3D camera icon used in the corner of the dark Onyx block. Treat it as a brand mark, not a UI element — do not replicate its red elsewhere, and do not use it as a button fill or accent. It is a signature object, not a palette.

## Editorial Density

Norgram reads like a printed art catalog: compact line-height (1.0 at display, 1.43–1.50 at body), tight tracking on all sans-serif sizes, and 8px gaps between metadata rows. Resist the urge to add breathing room — the density is the discipline.

## Similar Brands

- **Pentagram** — Same wordmark-in-corner identity, black-on-white editorial layout, and zero-chromatic restraint for a design agency
- **Manual (manualcreative.com)** — Identical Swiss-grid approach: full-bleed monochrome photography, hairline metadata strips, and Helvetica display at extreme sizes
- **Studio Dumbar** — Same flat, borderless, image-first composition with type doing all the structural work
- **Bureau Cool** — Editorial design agency aesthetic with white canvas, single-serif voice, and project plates that hang like gallery prints

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-obsidian: #000000;
  --color-charcoal: #141414;
  --color-paper-white: #ffffff;
  --color-bone: #efefef;
  --color-smoke: #cecece;
  --color-ash: #b2b2b2;
  --color-pewter: #999999;
  --color-iron: #777777;
  --color-graphite: #5e5e5e;
  --color-onyx: #1f1f1f;

  /* Typography — Font Families */
  --font-helvetica-now-display: 'Helvetica Now Display', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-times: 'Times', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-micro: 10px;
  --leading-micro: 1.1;
  --tracking-micro: -0.02px;
  --text-caption: 12px;
  --leading-caption: 1.17;
  --tracking-caption: -0.006px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.43;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-subheading: 36px;
  --leading-subheading: 1.17;
  --tracking-subheading: -0.008px;
  --text-display: 87px;
  --leading-display: 1.1;
  --tracking-display: -0.02px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-5: 5px;
  --spacing-6: 6px;
  --spacing-7: 7px;
  --spacing-8: 8px;
  --spacing-9: 9px;
  --spacing-10: 10px;
  --spacing-11: 11px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-25: 25px;
  --spacing-30: 30px;
  --spacing-34: 34px;
  --spacing-50: 50px;
  --spacing-100: 100px;

  /* Layout */
  --page-max-width: 1440px;
  --section-gap: 68px;
  --card-padding: 12px;
  --element-gap: 8px;

  /* Border Radius */
  --radius-md: 4.0678px;
  --radius-md-2: 7px;
  --radius-lg: 10px;
  --radius-3xl: 26px;

  /* Named Radii */
  --radius-tags: 10px;
  --radius-cards: 4px;
  --radius-large: 26px;
  --radius-buttons: 7px;

  /* Surfaces */
  --surface-paper-white: #ffffff;
  --surface-bone: #efefef;
  --surface-onyx: #1f1f1f;
  --surface-charcoal: #141414;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-obsidian: #000000;
  --color-charcoal: #141414;
  --color-paper-white: #ffffff;
  --color-bone: #efefef;
  --color-smoke: #cecece;
  --color-ash: #b2b2b2;
  --color-pewter: #999999;
  --color-iron: #777777;
  --color-graphite: #5e5e5e;
  --color-onyx: #1f1f1f;

  /* Typography */
  --font-helvetica-now-display: 'Helvetica Now Display', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-times: 'Times', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-micro: 10px;
  --leading-micro: 1.1;
  --tracking-micro: -0.02px;
  --text-caption: 12px;
  --leading-caption: 1.17;
  --tracking-caption: -0.006px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.43;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-subheading: 36px;
  --leading-subheading: 1.17;
  --tracking-subheading: -0.008px;
  --text-display: 87px;
  --leading-display: 1.1;
  --tracking-display: -0.02px;

  /* Spacing */
  --spacing-5: 5px;
  --spacing-6: 6px;
  --spacing-7: 7px;
  --spacing-8: 8px;
  --spacing-9: 9px;
  --spacing-10: 10px;
  --spacing-11: 11px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-25: 25px;
  --spacing-30: 30px;
  --spacing-34: 34px;
  --spacing-50: 50px;
  --spacing-100: 100px;

  /* Border Radius */
  --radius-md: 4.0678px;
  --radius-md-2: 7px;
  --radius-lg: 10px;
  --radius-3xl: 26px;
}
```
