# Lama Lama — Style Reference
> midnight studio with a frozen-white spotlight

**Theme:** dark

Lama Lama is a cinematic, near-monochrome editorial agency site: the canvas is almost pure black, the foreground is a single pale ice-cyan white used for every word on the page, and the only color punctuation is the same ice-white flipping into a full-bleed inverted panel at the foot of the page. Typography is a Swiss grotesque (Suisse Int'l) at whisper-light weights — 300 for hero and section headlines — which reads as confident, unfussy, and editorial rather than loud. Layout is asymmetric and full-bleed: short text columns anchored to the viewport's left margin, generous gutters of 40–48px, and large editorial photographs or video frames occupying the remaining width. There are almost no filled buttons; navigation, links, and calls to action are all ghost text with thin underlines, which makes the interface feel like a magazine spread rather than a product UI.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Ice Cyan | `#d7f3f5` | `--color-ice-cyan` | All foreground text, underlined link strokes, hairline borders, and the full-bleed inverted surface at the page foot — the only chromatic element in the system, used to make every readable word and every interactive affordance feel like it shares one voice |
| Void | `#020203` | `--color-void` | Page background and deepest canvas layer — near-pure black with a barely-perceptible cool tint that makes Ice Cyan read slightly blue |
| Carbon | `#111314` | `--color-carbon` | Elevated card surface, section backdrop, and subtle horizontal divider band — one step lighter than Void to lift project cards and content blocks without breaking the dark mood |

## Tokens — Typography

### SuisseIntl — SuisseIntl — detected in extracted data but not described by AI · `--font-suisseintl`
- **Weights:** 300, 400, 500, 700
- **Sizes:** 10px, 12px, 14px, 16px, 30px, 40px, 50px, 134px
- **Line height:** 0.86, 1, 1.06, 1.17, 1.22, 1.25, 1.38, 1.5, 1.56
- **Role:** SuisseIntl — detected in extracted data but not described by AI

### Suisse Int'l — Single-family Swiss grotesque used everywhere — 300 weight drives the 50px hero and 40px section headlines (anti-convention; most agencies use 600–700), which creates editorial authority through restraint rather than volume; 400 is the body and nav workhorse; 500 appears in inline emphasis and the 'Play heart.' display lockup at 134px · `--font-suisse-intl`
- **Substitute:** Inter, Söhne, Helvetica Now, Neue Haas Grotesk
- **Weights:** 300, 400, 500, 700
- **Sizes:** 10, 12, 14, 16, 30, 40, 50, 134
- **Line height:** 1.00–1.06 for display and hero, 1.17–1.25 for section and sub headings, 1.38–1.56 for body, nav, and footer
- **Role:** Single-family Swiss grotesque used everywhere — 300 weight drives the 50px hero and 40px section headlines (anti-convention; most agencies use 600–700), which creates editorial authority through restraint rather than volume; 400 is the body and nav workhorse; 500 appears in inline emphasis and the 'Play heart.' display lockup at 134px

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 10px | 1.56 | — | `--text-caption` |
| caption-md | 12px | 1.5 | — | `--text-caption-md` |
| body-sm | 14px | 1.38 | — | `--text-body-sm` |
| body | 16px | 1.5 | — | `--text-body` |
| subheading | 30px | 1.22 | — | `--text-subheading` |
| heading | 40px | 1.17 | — | `--text-heading` |
| heading-lg | 50px | 1.06 | — | `--text-heading-lg` |
| display | 134px | 1 | — | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 8 | 8px | `--spacing-8` |
| 20 | 20px | `--spacing-20` |
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |
| 60 | 60px | `--spacing-60` |
| 64 | 64px | `--spacing-64` |
| 80 | 80px | `--spacing-80` |
| 144 | 144px | `--spacing-144` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 15px |
| images | 15px |
| buttons | 8px |

### Layout

- **Section gap:** 80-120px
- **Element gap:** 20px

## Components

### Top Navigation Bar
**Role:** Minimal site chrome anchoring the brand mark and primary routes

Full-bleed horizontal bar on Void background. Small Ice Cyan monogram (the four-bar 'L' mark) at the far left, followed by a horizontal row of ghost text links (Work, Branding, Grow, Jobs, Contact) set in Suisse Int'l 14px weight 400 with generous spacing (20px gap). 60px vertical padding. No background fill, no border, no shadow — the bar floats in the void.

### Hero Split (Text + Media)
**Role:** First-fold statement combining a short editorial headline with a large warm-toned photograph or looping video

Asymmetric two-column layout on Void. Left column holds a weight-300 headline at 50px / 1.06 line-height, with inline words styled as underlined Ice Cyan links (no other color). Below the headline, a two-paragraph body block at 16px / 1.50 in Ice Cyan. Right column holds a full-bleed media frame (video or image) that extends to the viewport edge with 15px corner radius. 64px vertical breathing room between headline and media.

### Underlined Text Link
**Role:** The system's only interactive surface treatment — used for nav, inline emphasis, and calls to action

Ice Cyan text (#d7f3f5) with a 1px hairline underline in the same color. No background, no border, no hover fill — the link is identified purely by the stroke. Used throughout the site for navigation, inline headline words, section secondary actions ('More recent projects', 'More about us', 'Drop us a line'), and footer items.

### Featured Project Card
**Role:** Large editorial card showcasing a project image with title and description beneath

Carbon (#111314) surface with 15px corner radius. Contains a single edge-to-edge image (no internal padding) with 15px radius, followed by a 20px gap and a left-aligned title at 30px weight 300, then a short body description at 14–16px weight 400. No border, no shadow — the card is defined purely by its surface lift from Void to Carbon. Cards sit in a flexible grid that allows oversized editorial compositions.

### Section Header
**Role:** Opens each major content section with a large editorial heading and an optional secondary ghost link

Weight-300 heading at 40px / 1.17 line-height in Ice Cyan, anchored to the left margin with 40–48px horizontal gutter. A secondary action ('More recent projects', 'More about us') sits underlined and right-aligned on the same baseline, also in 14–16px Ice Cyan. 80–120px vertical breathing room below the header before content begins.

### Service List (Two-Column Text)
**Role:** Compact capability list arranged as two ghost-text columns

Section begins with a 'What we can do for you' heading at 40px weight 300, then two columns of services (Visual Identities, Strategy & Concept, UX Design, UI Design, Visual Design / Front-end development, Back-end development, Poë dancing, Online Marketing, Data). Items set in 16px weight 400 Ice Cyan with 8–10px row gap. No bullets, no dividers — a list of plain words.

### Full-Bleed Inverted Panel
**Role:** Closing call to action that inverts the entire color system for dramatic effect

A horizontal band of Ice Cyan (#d7f3f5) that spans the full viewport width and sits at the page foot. Text on this surface switches to Carbon (#111314). Used for the final 'Play heart.' display lockup at 134px weight 500, aligned to the right margin. This is the only place the palette inverts, and it carries the emotional close of the site.

### Language Toggle
**Role:** Compact two-letter locale switcher (NL EN) with active state treatment

Two ghost text characters (NL, EN) set inline at 14px in Ice Cyan. The active locale is underlined with a 1px hairline in Ice Cyan; the inactive locale has no decoration. Sits in the footer region above the inverted panel.

### Footer Bar
**Role:** Persistent utility strip with a looping video thumbnail, navigation links, and a signature line

Horizontal bar on Void with 60px vertical padding. Far left: a small square video thumbnail with a 'Play shadow' / 'Play with sound' ghost label. Center-left: ghost text links (Updates, About, Play, Heart, Draw something) at 14px weight 400. Far right on the inverted panel: a short ghost-text invitation ('You have found us. Now let's talk.') with an underlined 'Drop us a line' action.

### Ghost Text Button (Inverted)
**Role:** Secondary action on the light inverted panel

Carbon (#111314) text on the Ice Cyan surface, 14–16px weight 400, with a 1px underline. No background, no border, no radius. This is the only button-like component in the system, and it exists solely on the inverted panel where a filled button would break the editorial language.

## Do's and Don'ts

### Do
- Set every headline in Suisse Int'l weight 300 — the whisper-weight is the signature; do not promote it to 500 or 700 for emphasis
- Use Ice Cyan (#d7f3f5) as the only foreground color across the entire dark canvas; never introduce a second chromatic accent
- Render every link, call to action, and inline emphasis as a 1px hairline underline in Ice Cyan — no filled buttons, no rounded rectangles, no colored backgrounds in the dark sections
- Use Carbon (#111314) as the surface for cards, video frames, and content blocks so they lift from Void (#020203) without introducing a new color
- Apply a 15px corner radius to every image, card, and media frame; reserve 8px radius exclusively for buttons
- Anchor text columns to the left margin with 40–48px horizontal gutter and let media frames run to the viewport edge — the asymmetry is the layout signature
- Invert the palette exactly once, in a full-bleed Ice Cyan panel at the page foot, with dark text on light ground

### Don't
- Do not introduce any chromatic color other than Ice Cyan — no red, no green, no blue, no warm accents in the UI
- Do not use weight 500 or 700 for headlines; 300 is the editorial voice and heavier weights break the cinematic calm
- Do not render filled or rounded buttons on the dark sections — underlined ghost text is the only interactive treatment
- Do not apply drop shadows or glow effects to cards, images, or text; elevation is communicated through Carbon-vs-Void surface shift alone
- Do not center body text or headlines — left-alignment to the viewport gutter is what makes the layout read as editorial
- Do not add gradients, background patterns, or decorative shapes; the void is the design
- Do not invert the palette anywhere except the single closing Ice Cyan panel — multiple inversions would dilute the dramatic effect

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Void | `#020203` | Deepest page background, sets the mood for all content |
| 1 | Carbon | `#111314` | Elevated card surface and subtle section banding — one step above Void to define project cards, video frames, and content blocks |
| 2 | Ice Cyan Inversion | `#d7f3f5` | Full-bleed light panel that inverts the entire palette for the closing call to action — dark text on ice-cyan ground |

## Imagery

Imagery is editorial photography and looping silent video, always warm-toned and intimate — close-ups of hands on objects, African landscapes, architectural details — that cuts through the cold monochrome UI. Frames are large, edge-to-edge inside 15px-radius containers, and never captioned. No illustration, no 3D, no icon system beyond the brand monogram. The warm film-like photography against the icy void is the core atmospheric device.

## Layout

Full-bleed layout with no max-width container; the viewport is the canvas. Hero is an asymmetric two-column split with short text anchored to the left margin and a large media frame occupying the remaining width. Section rhythm is consistent: a 40px weight-300 section heading left-aligned, an optional underlined secondary action right-aligned on the same baseline, then generous 80–120px vertical breathing room before content. Project work appears as oversized editorial cards in a flexible grid that can hold one or two cards per row, each as wide as half the viewport. The services section is a plain two-column text list with no visual chrome. The page closes with a single full-bleed Ice Cyan inversion panel, right-aligned with the page's signature at 134px. Navigation is a minimal top bar; there is no sidebar, no sticky header, and no mega-menu.

## Agent Prompt Guide

**Quick Color Reference**
- text: #d7f3f5
- background: #020203
- surface: #111314
- border: #d7f3f5 (hairline 1px only)
- accent: #d7f3f5 (inversion surface)
- primary action: no distinct CTA color

**Example Component Prompts**
1. Create a hero section on Void (#020203) background. Left column: 50px Suisse Int'l weight 300 headline in #d7f3f5 with inline words styled as 1px underlined ghost links. Below: two-column body at 16px weight 400, #d7f3f5. Right column: full-bleed media frame with 15px corner radius, extending to viewport edge. 64px vertical gap between headline and media.

2. Create a featured project card: Carbon (#111314) surface, 15px corner radius, no border, no shadow. Edge-to-edge image inside with 15px radius. Below the image, a 30px weight 300 title in #d7f3f5, then 16px weight 400 description in #d7f3f5. 20px gap between image and title.

3. Create a section header: 40px Suisse Int'l weight 300 heading in #d7f3f5, left-aligned with 40px horizontal gutter. A 14px ghost-text secondary action ('More about us') right-aligned on the same baseline, 1px underlined in #d7f3f5. 80px vertical breathing room below.

4. Create a service list: two columns of plain ghost text on Void background. Items in 16px weight 400 #d7f3f5 with 10px row gap. No bullets, no dividers, no background panels.

5. Create a closing inverted panel: full-bleed #d7f3f5 surface, 134px Suisse Int'l weight 500 right-aligned text in #111314. Sits at the page foot, single use only.

## Similar Brands

- **Studio Dumbar** — Same Dutch-agency editorial language — near-black canvas, single white foreground, weight-300 Swiss headlines, underlined ghost links, and warm editorial photography cutting through monochrome UI
- **Pentagram** — Same asymmetric full-bleed layout with short text columns anchored left and oversized media on the right, plus the same discipline of letting one typeface do all the work at light weights
- **Manual (manualcreative.com)** — Same ice-white-on-deep-black contrast and the same trick of inverting to a single full-bleed light panel at the page foot for the closing call to action
- **Resn (resn.co.nz)** — Same full-bleed dark canvas with oversized editorial photography, weight-300 Swiss headlines, and zero decorative UI chrome
- **Locomotive (locomotive.ca)** — Same agency-portfolio restraint — generous gutters, asymmetric text-left/media-right splits, and a single foreground color carrying all interaction

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-ice-cyan: #d7f3f5;
  --color-void: #020203;
  --color-carbon: #111314;

  /* Typography — Font Families */
  --font-suisseintl: 'SuisseIntl', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-suisse-intl: 'Suisse Int'l', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.56;
  --text-caption-md: 12px;
  --leading-caption-md: 1.5;
  --text-body-sm: 14px;
  --leading-body-sm: 1.38;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-subheading: 30px;
  --leading-subheading: 1.22;
  --text-heading: 40px;
  --leading-heading: 1.17;
  --text-heading-lg: 50px;
  --leading-heading-lg: 1.06;
  --text-display: 134px;
  --leading-display: 1;

  /* Typography — Weights */
  --font-weight-light: 300;
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-20: 20px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-60: 60px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-144: 144px;

  /* Layout */
  --section-gap: 80-120px;
  --element-gap: 20px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-xl: 15px;

  /* Named Radii */
  --radius-cards: 15px;
  --radius-images: 15px;
  --radius-buttons: 8px;

  /* Surfaces */
  --surface-void: #020203;
  --surface-carbon: #111314;
  --surface-ice-cyan-inversion: #d7f3f5;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-ice-cyan: #d7f3f5;
  --color-void: #020203;
  --color-carbon: #111314;

  /* Typography */
  --font-suisseintl: 'SuisseIntl', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-suisse-intl: 'Suisse Int'l', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.56;
  --text-caption-md: 12px;
  --leading-caption-md: 1.5;
  --text-body-sm: 14px;
  --leading-body-sm: 1.38;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-subheading: 30px;
  --leading-subheading: 1.22;
  --text-heading: 40px;
  --leading-heading: 1.17;
  --text-heading-lg: 50px;
  --leading-heading-lg: 1.06;
  --text-display: 134px;
  --leading-display: 1;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-20: 20px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-60: 60px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-144: 144px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-xl: 15px;
}
```
