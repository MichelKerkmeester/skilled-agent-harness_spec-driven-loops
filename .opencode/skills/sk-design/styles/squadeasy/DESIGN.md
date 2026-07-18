# SquadEasy — Style Reference
> Polaroid scrapbook on sunlit peach paper

**Theme:** light

SquadEasy uses a sun-drenched, scrapbook-like language: a warm tan canvas anchors every screen, scattered polaroid photos sit at jaunty angles, and oversized black display type carries the brand voice. Color works as a small but vivid palette — lime CTA, lavender cards, pink headline punctuation, green link underlines — deployed sparingly against the peach ground. Components are pill-shaped and rounded-soft; the floating capsule navigation and 9999px-radius buttons create a sticker-on-paper feel. The system favors warmth, confidence, and craft over minimalism: every screen should feel hand-pinned, not templated.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Peach Ground | `#e1c19e` | `--color-peach-ground` | Page canvas, hero and section backgrounds — the warm tan base that ties the whole site together like craft paper |
| Lime Pop | `#e4ff60` | `--color-lime-pop` | Green action color for filled buttons, selected navigation states, and focused conversion moments. |
| Lavender Card | `#adabff` | `--color-lavender-card` | Card and surface panels, soft-tinted blocks that lift content off the peach canvas without going cold |
| Magenta Marker | `#ea5da3` | `--color-magenta-marker` | Highlight words inside headlines, decorative strokes and borders — the hand-marker pink that punches single words out of the black display type |
| Moss Link | `#6fb853` | `--color-moss-link` | Text link color and inline underline borders — the only green in the system, reserved for navigational emphasis |
| Sky Note | `#7fb6e6` | `--color-sky-note` | Secondary tag and occasional button fill — a cool counterpoint that keeps the palette from feeling monochromatically warm |
| Ink Black | `#000000` | `--color-ink-black` | Primary text, display headlines, card and section borders, icon strokes — the structural neutral that carries 90% of the type |
| Paper White | `#ffffff` | `--color-paper-white` | Card body backgrounds, icon contrast fills, inverted-button text — bright clean white for surfaces that need to detach from the peach ground |
| Fog Gray | `#f6f6f6` | `--color-fog-gray` | Quiet secondary surface for input fields and soft panel fills — used where pure white would feel too clinical |

## Tokens — Typography

### Medium — Medium — detected in extracted data but not described by AI · `--font-medium`
- **Weights:** 400
- **Sizes:** 12px, 14px, 16px
- **Line height:** 1.2
- **Letter spacing:** -0.021, -0.018, -0.016
- **Role:** Medium — detected in extracted data but not described by AI

### SquadEasy Black (custom display) — Display headlines and hero statements — the brand's signature voice. 220px hero text at line-height 0.87 with letter-spacing -0.036em creates compressed, poster-grade blocks that dominate the peach canvas. No body text uses this family. · `--font-squadeasy-black-custom-display`
- **Substitute:** Druk Wide Bold, or Inter Display 900 condensed
- **Weights:** 400, 700
- **Sizes:** 16, 50, 56, 62, 80, 110, 220px
- **Line height:** 0.87–1.20
- **Letter spacing:** -0.036em at 220px, -0.032em at 110px, -0.025em at 80px, -0.018em at 56px, -0.016em at 50px, -0.005em at 16px
- **Role:** Display headlines and hero statements — the brand's signature voice. 220px hero text at line-height 0.87 with letter-spacing -0.036em creates compressed, poster-grade blocks that dominate the peach canvas. No body text uses this family.

### SquadEasy Body (custom sans) — Body, nav, card, button and link text — the working sans. Weight 500 is the default for nav and labels, 700 for emphasized inline phrases, 400 for paragraphs. Tracking runs -0.011em to -0.018em, keeping even 22px body text visually tight. · `--font-squadeasy-body-custom-sans`
- **Substitute:** Inter, or GT America Standard
- **Weights:** 400, 500, 700
- **Sizes:** 14, 16, 17, 18, 19, 22px
- **Line height:** 1.00–1.21
- **Letter spacing:** -0.018em at 22px, -0.016em at 18px, -0.015em at 17px, -0.014em at 16px, -0.013em at 16px, -0.011em at 14px
- **Role:** Body, nav, card, button and link text — the working sans. Weight 500 is the default for nav and labels, 700 for emphasized inline phrases, 400 for paragraphs. Tracking runs -0.011em to -0.018em, keeping even 22px body text visually tight.

### SquadEasy Regular (custom small text) — Button labels, micro-labels, small icon-adjacent text — slightly tighter tracking than Body (-0.021em at 12px) so 12px still reads as a deliberate label, not body copy shrunk down · `--font-squadeasy-regular-custom-small-text`
- **Substitute:** Inter, or Söhne Buch
- **Weights:** 400
- **Sizes:** 12, 14, 16px
- **Line height:** 1.20
- **Letter spacing:** -0.0180em, -0.0160em, -0.0140em, -0.0110em
- **Role:** Button labels, micro-labels, small icon-adjacent text — slightly tighter tracking than Body (-0.021em at 12px) so 12px still reads as a deliberate label, not body copy shrunk down

### SquadEasy Sharpie (custom handwriting) — Decorative handwritten accent on small annotation labels — used sparingly as a craft-paper footnote device, never for functional UI · `--font-squadeasy-sharpie-custom-handwriting`
- **Substitute:** Caveat, or Permanent Marker
- **Weights:** 400
- **Sizes:** 16px
- **Line height:** 1.20
- **Letter spacing:** -0.0160em
- **Role:** Decorative handwritten accent on small annotation labels — used sparingly as a craft-paper footnote device, never for functional UI

### Arial — Arial — detected in extracted data but not described by AI · `--font-arial`
- **Weights:** 400
- **Sizes:** 13px
- **Line height:** 1.2
- **Role:** Arial — detected in extracted data but not described by AI

### Epilogue — Epilogue — detected in extracted data but not described by AI · `--font-epilogue`
- **Weights:** 400
- **Sizes:** 18px
- **Line height:** 1.2
- **Letter spacing:** -0.014
- **Role:** Epilogue — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.2 | -0.252px | `--text-caption` |
| body-sm | 14px | 1.2 | -0.154px | `--text-body-sm` |
| body | 16px | 1.21 | -0.224px | `--text-body` |
| subheading | 18px | 1.2 | -0.252px | `--text-subheading` |
| heading-sm | 22px | 1.2 | -0.396px | `--text-heading-sm` |
| heading | 50px | 1.05 | -0.8px | `--text-heading` |
| heading-lg | 80px | 1 | -2px | `--text-heading-lg` |
| display | 110px | 0.87 | -3.52px | `--text-display` |

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
| 80 | 80px | `--spacing-80` |
| 100 | 100px | `--spacing-100` |
| 120 | 120px | `--spacing-120` |
| 140 | 140px | `--spacing-140` |
| 164 | 164px | `--spacing-164` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 10px |
| cards | 14px |
| buttons | 100px |
| navCapsule | 100px |
| photoCards | 14px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 100px
- **Card padding:** 16px
- **Element gap:** 16px

## Components

### Pill Navigation Capsule
**Role:** Sticky top-of-page navigation

Floating rounded capsule (100px radius) with white background, thin black hairline border, ~16px vertical padding, horizontal layout: brand mark on left, centered menu items in 16px weight 500, lime CTA pill on right. Sits centered on the peach ground with generous top margin, visually floating like a sticker.

### Lime Primary CTA Button
**Role:** Filled primary action (nav and hero)

100px pill radius, #e4ff60 lime fill, #000000 text in 16px weight 500 with -0.016em tracking, ~14-16px vertical padding, 24-32px horizontal padding. Black 1px border optional. Arrow icon (→) appended in black at 16px. The only filled button in the system.

### Outlined Black Button
**Role:** Secondary nav action

100px pill radius, transparent or white fill, #000000 1px border, #000000 text at 16px weight 500. Same vertical/horizontal padding as the Lime CTA. Used for 'Demander une démo' in the top nav on white backgrounds.

### Polaroid Photo Card
**Role:** Scattered hero image tile

White (#ffffff) surface, 14px radius, ~12-16px padding around the photo, optional thin black hairline border. Deployed at slight rotation angles (-8° to +8°) around hero and section compositions. Photos crop to portrait, no rounded inner mask — the card itself is the shape.

### Lavender Testimonial Card
**Role:** Customer quote panel

Lavender (#adabff) fill, 14px radius, generous 20-24px padding, inline portrait image at top-left, large pull-quote in 18-22px weight 500 black, moss-green (#6fb853) 'VOIR LE CAS CLIENT →' link at bottom with 1px moss underline.

### Phone Mockup Frame
**Role:** Product preview container

Vertically centered device frame on the peach ground, slight drop shadow or no shadow, screen content shows app UI in white with a black bottom nav bar. Functions as a single product showcase element, not a repeating component.

### Section Headline Block
**Role:** Large editorial headline

Full-width left-aligned, #000000 display type at 50-110px SquadEasy Black, line-height 0.87-1.00, letter-spacing -0.018em to -0.032em. Optional single word or phrase replaced with #ea5da3 magenta for hand-marker emphasis. No eyebrow or subhead required — the headline stands alone.

### Moss Underline Link
**Role:** Inline text link

#6fb853 1px bottom border, #6fb853 text color, 16-18px weight 400-500. Trailing arrow (→) at the end. Padding-bottom ~2px to seat the underline. Never colored blue — the moss green is the system's link signal.

### Circle Pagination Button
**Role:** Carousel control

40-48px circle, 1px black border, white or transparent fill, centered black arrow icon (← / →). Used in pairs below card carousels.

### Logo Wordmark
**Role:** Brand identity

Stacked two-line wordmark 'squad' / 'easy' in lowercase, custom Black weight at ~16px, #000000 on white surface. Tight tracking matches the display family.

## Do's and Don'ts

### Do
- Use the peach #e1c19 ground for every full-bleed page and section background — it is the system's signature surface
- Use 100px pill radius for every button, tag, and the navigation capsule — sharp corners break the scrapbook feel
- Set display headlines at 50-110px in SquadEasy Black with line-height 0.87-1.00 and letter-spacing -0.025em to -0.032em
- Use #e4ff60 lime exclusively for the primary filled CTA — no other filled action color exists in the system
- Place polaroid photo cards at slight rotation angles (-8° to +8°) around hero compositions to preserve the hand-pinned craft feel
- Apply -0.014em to -0.018em letter-spacing to all body, nav, and button text — even at 14px the type stays visually tight
- Use #6fb853 moss green for all text links and their underlines, never blue — moss is the navigational accent

### Don't
- Don't use white (#ffffff) as the page canvas — the peach ground is the system's identity layer
- Don't introduce additional filled CTA colors — the lime is the single primary action; everything else is ghost or outlined
- Don't use system fonts (Arial, Helvetica) for display headlines — the compressed Black family at 0.87 line-height is the brand voice
- Don't set body text line-height above 1.21 — the system depends on tight vertical rhythm
- Don't add drop shadows to lavender or white cards — the system relies on flat color contrast against the peach, not elevation
- Don't use the magenta #ea5da3 for anything other than a single emphasis word inside a headline — it loses its punch as a body color
- Don't square off buttons or cards — the 100px and 14px radii are the only shapes the system uses

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Peach Page | `#e1c19` | Dominant page canvas across hero, mid-page, and testimonial sections |
| 1 | Paper Card | `#ffffff` | Polaroid photo cards, white surface panels, nav capsule interior |
| 2 | Lavender Block | `#adabff` | Tinted testimonial and content cards sitting on the peach ground |
| 3 | Fog Input | `#f6f6f6` | Form fields, quiet supporting surfaces |

## Elevation

- **Pill Navigation Capsule:** `0 4px 16px rgba(0,0,0,0.08)`
- **Phone Mockup:** `0 12px 40px rgba(0,0,0,0.15)`

## Imagery

Photography is human-first and warm: candid portraits of diverse, smiling people in natural light, no lifestyle staging, no corporate context. Images are cropped to portrait, framed as polaroid cards with white borders and 14px radius, then scattered at slight rotation angles to create a hand-pinned scrapbook composition. Product visuals are limited to a single phone mockup on the peach ground. No illustration, no abstract graphics, no 3D renders — the people and the bold type carry the visual weight.

## Layout

Pages are full-width with a max content width of ~1200px. The hero is a full-bleed peach canvas with a centered headline stack (220px display type) and CTA, framed by scattered polaroid portraits at the edges. Sections flow as continuous peach bands with 100px vertical gaps — no alternating dark/light bands, no dividers. Mid-page product showcase is a single centered phone mockup. Testimonial section shifts to a 3-column card grid (lavender cards) with a left-aligned 50-80px editorial headline. The sticky pill capsule nav floats centered at the top of every section. No sidebars, no mega-menus, no asymmetric zig-zag — composition is centered and confident.

## Agent Prompt Guide

**Quick Color Reference**
- text: #000000
- background: #e1c19e (peach page canvas)
- surface: #ffffff (white card), #adabff (lavender panel), #f6f6f6 (fog input)
- border: #000000 (structural), #6fb853 (link underline)
- accent: #ea5da3 (magenta highlight word), #7fb6e6 (sky blue secondary)
- primary action: #000000 (filled action)

**3-5 Example Component Prompts**

1. Create a Primary Action Button: #000000 background, #ffffff text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.

2. Create a testimonial card: lavender #adabff surface, 14px radius, 24px padding. Top-left: 64px circular portrait. Quote text at 22px weight 500, #000000, letter-spacing -0.396px. Bottom: 'VOIR LE CAS CLIENT →' link at 16px #6fb853 with 1px moss underline.

3. Create a sticky pill nav: white #ffffff background, 100px border-radius, 1px #000000 border, 12px 24px padding, centered on top of peach canvas. Left: stacked 'squad / easy' wordmark in 16px Black. Center: menu items in 16px weight 500 #000000. Right: lime #e4ff60 pill CTA 'DEMANDER UNE DÉMO →' (100px radius, 16px weight 500 #000000).

4. Create a body text block: peach #e1c19e background, max-width 720px, 18px weight 400 #000000, line-height 1.20, letter-spacing -0.252px. Inline moss link with #6fb853 text and 1px moss underline.

5. Create a carousel pagination control: 44px circle, 1px #000000 border, white #ffffff fill, centered 16px black arrow icon. Two buttons side by side, 12px gap.

## Photo Treatment Rules

All photography lives inside a polaroid frame: white #ffffff surface, 14px corner radius, 12-16px internal padding around the photo, optional 1px #000000 hairline border. Cards are placed at -8° to +8° rotation and should slightly overlap adjacent cards. Never place a photo on a raw rectangle — the white frame is mandatory. Portraits crop to face-and-shoulders, eye-level, with warm natural lighting. Avoid studio backdrops, avoid full-body shots, avoid black-and-white treatment.

## Similar Brands

- **LottieFiles** — Same warm pastel canvas with scattered illustrated/photo tiles and oversized bold sans-serif display type at tight line-heights
- **Cuvva** — Same pill-shaped navigation capsule, rounded-soft cards on a warm colored ground, and energetic pop-accent CTA color
- **Notion** — Same generous peach-warm page canvas with flat-color cards and tight-tracked sans body type — though SquadEasy pushes display sizes much larger
- **Loom careers page** — Same scattered-portrait hero treatment with large compressed display headlines and pill CTA buttons

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-peach-ground: #e1c19e;
  --color-lime-pop: #e4ff60;
  --color-lavender-card: #adabff;
  --color-magenta-marker: #ea5da3;
  --color-moss-link: #6fb853;
  --color-sky-note: #7fb6e6;
  --color-ink-black: #000000;
  --color-paper-white: #ffffff;
  --color-fog-gray: #f6f6f6;

  /* Typography — Font Families */
  --font-medium: 'Medium', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-squadeasy-black-custom-display: 'SquadEasy Black (custom display)', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-squadeasy-body-custom-sans: 'SquadEasy Body (custom sans)', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-squadeasy-regular-custom-small-text: 'SquadEasy Regular (custom small text)', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-squadeasy-sharpie-custom-handwriting: 'SquadEasy Sharpie (custom handwriting)', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-arial: 'Arial', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-epilogue: 'Epilogue', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.2;
  --tracking-caption: -0.252px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.2;
  --tracking-body-sm: -0.154px;
  --text-body: 16px;
  --leading-body: 1.21;
  --tracking-body: -0.224px;
  --text-subheading: 18px;
  --leading-subheading: 1.2;
  --tracking-subheading: -0.252px;
  --text-heading-sm: 22px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: -0.396px;
  --text-heading: 50px;
  --leading-heading: 1.05;
  --tracking-heading: -0.8px;
  --text-heading-lg: 80px;
  --leading-heading-lg: 1;
  --tracking-heading-lg: -2px;
  --text-display: 110px;
  --leading-display: 0.87;
  --tracking-display: -3.52px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
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
  --spacing-80: 80px;
  --spacing-100: 100px;
  --spacing-120: 120px;
  --spacing-140: 140px;
  --spacing-164: 164px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 100px;
  --card-padding: 16px;
  --element-gap: 16px;

  /* Border Radius */
  --radius-lg: 10px;
  --radius-xl: 14px;
  --radius-full: 100px;
  --radius-full-2: 500px;

  /* Named Radii */
  --radius-tags: 10px;
  --radius-cards: 14px;
  --radius-buttons: 100px;
  --radius-navcapsule: 100px;
  --radius-photocards: 14px;

  /* Surfaces */
  --surface-peach-page: #e1c19;
  --surface-paper-card: #ffffff;
  --surface-lavender-block: #adabff;
  --surface-fog-input: #f6f6f6;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-peach-ground: #e1c19e;
  --color-lime-pop: #e4ff60;
  --color-lavender-card: #adabff;
  --color-magenta-marker: #ea5da3;
  --color-moss-link: #6fb853;
  --color-sky-note: #7fb6e6;
  --color-ink-black: #000000;
  --color-paper-white: #ffffff;
  --color-fog-gray: #f6f6f6;

  /* Typography */
  --font-medium: 'Medium', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-squadeasy-black-custom-display: 'SquadEasy Black (custom display)', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-squadeasy-body-custom-sans: 'SquadEasy Body (custom sans)', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-squadeasy-regular-custom-small-text: 'SquadEasy Regular (custom small text)', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-squadeasy-sharpie-custom-handwriting: 'SquadEasy Sharpie (custom handwriting)', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-arial: 'Arial', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-epilogue: 'Epilogue', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.2;
  --tracking-caption: -0.252px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.2;
  --tracking-body-sm: -0.154px;
  --text-body: 16px;
  --leading-body: 1.21;
  --tracking-body: -0.224px;
  --text-subheading: 18px;
  --leading-subheading: 1.2;
  --tracking-subheading: -0.252px;
  --text-heading-sm: 22px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: -0.396px;
  --text-heading: 50px;
  --leading-heading: 1.05;
  --tracking-heading: -0.8px;
  --text-heading-lg: 80px;
  --leading-heading-lg: 1;
  --tracking-heading-lg: -2px;
  --text-display: 110px;
  --leading-display: 0.87;
  --tracking-display: -3.52px;

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
  --spacing-80: 80px;
  --spacing-100: 100px;
  --spacing-120: 120px;
  --spacing-140: 140px;
  --spacing-164: 164px;

  /* Border Radius */
  --radius-lg: 10px;
  --radius-xl: 14px;
  --radius-full: 100px;
  --radius-full-2: 500px;
}
```
