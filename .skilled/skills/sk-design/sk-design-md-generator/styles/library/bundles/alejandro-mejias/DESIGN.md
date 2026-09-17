# Alejandro Mejias — Style Reference
> Acid-lit brutalist atelier, acid yellow against obsidian and bone white

**Theme:** mixed

Alejandro Mejias operates as a brutalist editorial portfolio: near-total monochrome canvases (white and deep black sections alternate) are interrupted by a single electric lime accent (#ebff00) that only appears on contact actions, time stamps, and avatar CTAs. Typography is the identity — a custom wide-compact grotesque (FK Raster Grotesk) at 32–48px carries every section heading, while IBM Plex Mono at 10–18px with aggressive positive tracking handles every label, tag, and metadata string. The signature element is a glossy 3D-rendered abstract 'A' sculpture that anchors major sections like a sculptural logo-mascot. Layout is edge-to-edge with very tight gutters, a fixed three-zone top bar (left brand, center nav, right status pill), and floating corner CTAs. Components feel architectural: sharp 4px button corners, soft 24px image corners, and occasional oversized pill radii up to 84px create deliberate contrast. The overall atmosphere is a high-design atelier's workshop log — restrained, opinionated, and unapologetically loud where it matters.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Acid Lime | `#ebff00` | `--color-acid-lime` | Green action color for filled buttons, selected navigation states, and focused conversion moments |
| Obsidian | `#080707` | `--color-obsidian` | Body and heading text, dominant border color, dark section canvas — near-pure black for maximum contrast |
| Pure Black | `#000000` | `--color-pure-black` | High-frequency borders, icons, decorative strokes, image outlines — the structural black that outlines every other element |
| Bone White | `#ffffff` | `--color-bone-white` | Light section canvas, card surfaces, inverted text on dark sections and lime buttons |
| Fog | `#c8c8c8` | `--color-fog` | Placeholder surfaces, muted image backgrounds, subtle borders, disabled state fills |
| Slate | `#383838` | `--color-slate` | Secondary dark surfaces, dark mode card backgrounds, subdued text on dark canvases |

## Tokens — Typography

### FK Raster Grotesk Compact Trial Sharp — Display headlines for section titles (e.g. 'FEATURED WORK'). The wide, compact, near-square grotesque proportions at 32–48px with 1.0 line-height and +0.042em tracking are the site's signature — every section is announced with this single cut, no fallback weights exist · `--font-fk-raster-grotesk-compact-trial-sharp`
- **Substitute:** Druk Wide, Antonio, Tungsten Bold (all require commercial license); free alternative: Archivo Black at 90% width transform
- **Weights:** 400
- **Sizes:** 32px, 48px
- **Line height:** 1.00
- **Letter spacing:** 0.042em
- **Role:** Display headlines for section titles (e.g. 'FEATURED WORK'). The wide, compact, near-square grotesque proportions at 32–48px with 1.0 line-height and +0.042em tracking are the site's signature — every section is announced with this single cut, no fallback weights exist

### IBM Plex Mono — All uppercase labels, metadata tags, navigation items, technical strings, section indices like '014 — TODAY' and '[GOOD DESIGN AWARD WINNER 2023/24]'. The 0.086em–0.109em positive tracking on the 10–11px sizes is the monospace's defining behavior — tiny, widely-spaced, all-caps annotations that read like typeset engineering labels · `--font-ibm-plex-mono`
- **Substitute:** JetBrains Mono, Space Mono, IBM Plex Mono (Google)
- **Weights:** 500, 600
- **Sizes:** 10px, 11px, 14px, 18px
- **Line height:** 1.00–1.40
- **Letter spacing:** -0.05em, 0.086em, 0.109em
- **Role:** All uppercase labels, metadata tags, navigation items, technical strings, section indices like '014 — TODAY' and '[GOOD DESIGN AWARD WINNER 2023/24]'. The 0.086em–0.109em positive tracking on the 10–11px sizes is the monospace's defining behavior — tiny, widely-spaced, all-caps annotations that read like typeset engineering labels

### Be Vietnam Pro — Long-form body copy and link text. Stays at 16px only — the design avoids type-size variation in body text, relying on monospace labels for hierarchy instead · `--font-be-vietnam-pro`
- **Substitute:** Inter, system-ui, sans-serif
- **Weights:** 400
- **Sizes:** 16px
- **Line height:** 1.40
- **Role:** Long-form body copy and link text. Stays at 16px only — the design avoids type-size variation in body text, relying on monospace labels for hierarchy instead

### Inter Medium — Button text — the one place a humanist sans is used at 500 weight with slight negative tracking for legibility in small pill CTAs · `--font-inter-medium`
- **Substitute:** Inter, system-ui
- **Weights:** 500
- **Sizes:** 16px
- **Line height:** 1.20
- **Letter spacing:** -0.012em
- **Role:** Button text — the one place a humanist sans is used at 500 weight with slight negative tracking for legibility in small pill CTAs

### system sans-serif — Icon-adjacent micro-text and fallback rendering for system UI · `--font-system-sans-serif`
- **Substitute:** system-ui
- **Weights:** 400
- **Sizes:** 12px
- **Line height:** 1.20
- **Role:** Icon-adjacent micro-text and fallback rendering for system UI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 10px | 1 | 0.86px | `--text-caption` |
| body | 16px | 1.4 | — | `--text-body` |
| subheading | 18px | 1.4 | -0.9px | `--text-subheading` |
| heading-sm | 32px | 1 | 1.344px | `--text-heading-sm` |
| heading | 48px | 1 | 2.016px | `--text-heading` |

## Tokens — Spacing & Shapes

**Density:** compact

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 8 | 8px | `--spacing-8` |
| 10 | 10px | `--spacing-10` |
| 16 | 16px | `--spacing-16` |
| 20 | 20px | `--spacing-20` |
| 24 | 24px | `--spacing-24` |
| 48 | 48px | `--spacing-48` |
| 80 | 80px | `--spacing-80` |
| 100 | 100px | `--spacing-100` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 4px |
| cards | 24px |
| pills | 72-84px |
| images | 24px |
| buttons | 4px |
| special | 30-40px |

### Layout

- **Section gap:** 48px
- **Card padding:** 16px
- **Element gap:** 10px

## Components

### Top Bar
**Role:** Persistent three-zone navigation header

Full-width strip with three flex-aligned zones: left brand label '[ALEJANDRO MEJIAS]' in 10px IBM Plex Mono 600 uppercase with 0.109em tracking, center nav links ('WORK ⊙', 'ABOUT', 'REACH OUT') at 11px IBM Plex Mono 500, right status pill (see Time Badge). Fixed/sticky behavior. No background fill — transparent over white or black canvas. 48px vertical padding.

### Time Status Badge
**Role:** Live local-time indicator pill

Acid Lime (#ebff00) filled pill containing live time like 'MEL(AU) 4:33 PM' at 11px IBM Plex Mono 600 uppercase. Pill radius 72–84px. 4px vertical / 8px horizontal padding. Sits in the top-right zone. Functions as a self-aware status indicator — the only place lime appears in the header.

### Book a Call Floating CTA
**Role:** Persistent contact action

Acid Lime (#ebff00) filled pill with circular avatar image (24px) on the left, 'BOOK A CALL' label in 11px IBM Plex Mono 600 uppercase, and an arrow '↗' icon. 4px vertical / 16px horizontal padding. Border-radius 84px. Fixed to the bottom-right corner. Inverts to dark-mode compatible when over black sections.

### Section Display Heading
**Role:** Page-level section title

FK Raster Grotesk Compact Trial Sharp, 48px (or 32px for sub-sections), weight 400, line-height 1.00, letter-spacing 0.042em. Always uppercase. All-caps presentation in a wide-compact grotesque is the signature. No color override needed — uses Obsidian (#080707) on light and Bone White (#ffffff) on dark.

### Metadata Tag (Bracketed)
**Role:** Categorical / contextual label

10–11px IBM Plex Mono 600 uppercase, letter-spacing 0.086–0.109em, wrapped in square brackets like '[GOOD DESIGN AWARD WINNER 2023/24]' or '[FRONTROW] [2025]'. Obsidian text on light, Bone White on dark. The square-bracket punctuation is part of the system — they read like archival catalog codes.

### Project Card (Image)
**Role:** Portfolio work entry

Large rectangular image (full column width), 24px border-radius, Obsidian (#000000) 1px border or no border. Above the image: project name in 14px IBM Plex Mono 500 left-aligned + year in same style right-aligned (e.g. 'FINGERTIP.COM' / '2024'). Below: optional metadata. No card background — image sits directly on canvas.

### Video Watch Card
**Role:** Embedded video preview thumbnail

Small card (~180px wide) with 4px border-radius, 1px Obsidian border, containing a square photo thumbnail and a bottom strip with 'FRONTROW [2025]' label and '[WATCH] ↗' action in 10–11px IBM Plex Mono 500. Lives in the hero zone as a self-contained unit.

### Contact Row
**Role:** Structured contact entry (video call / email / connect)

Two-column row on dark canvas. Left: label in 11px IBM Plex Mono 600 uppercase ('VIDEO CALL', 'EMAIL', 'CONNECT') in Bone White. Right: corresponding value — acid-lime CTA pill for call, outlined 4px-radius input-style button containing the email for email, horizontal row of social links for connect. 48px row gap between rows. 1px hairline divider between rows.

### Outlined Action Button
**Role:** Secondary contact / display action

Transparent background, 1px Obsidian (#080707) or Bone White border (on dark), 4px border-radius, contains a value string in 11px IBM Plex Mono 600 uppercase plus a small copy icon. 4px vertical / 16px horizontal padding. Used for email display, secondary actions.

### Social Link
**Role:** External platform entry

Icon (16–20px) + platform name in 11px IBM Plex Mono 600 uppercase with 0.086em tracking. Bone White on dark, Obsidian on light. Inline horizontal row. No underlines, no hover effects beyond opacity.

### 3D Sculpture Element
**Role:** Brand-defining decorative anchor

A glossy 3D-rendered abstract 'A' letterform in Pure Black with subtle highlight gradients (reads as obsidian glass). Centered in major sections at ~280–340px width. Functions as the site mascot/logo in 3D form. No background — floats on the section canvas. Renders as the only non-flat element in the system.

### Corner Tab (W. Honors)
**Role:** Edge-attached utility label

Vertical text strip attached to the right edge of the viewport. 11px IBM Plex Mono 600, 0.086em tracking, rotated 90°. Functions as a secondary nav hint (e.g. 'W. Honors'). 1px Obsidian left border.

### Scroll Indicator
**Role:** Hero exit affordance

Centered at the bottom of the hero: 'SCROLL ↓' in 10–11px IBM Plex Mono 600 uppercase with 0.109em tracking. Obsidian text, no background. Tells the user the page is vertical and scrollable.

## Do's and Don'ts

### Do
- Use IBM Plex Mono 500–600 at 10–11px with 0.086–0.109em positive tracking for every label, tag, and metadata string — uppercase by default
- Reserve FK Raster Grotesk Compact Trial Sharp at 32–48px / line-height 1.0 for section titles only — never use it for body or subheadings
- Use Acid Lime (#ebff00) exclusively on time badges, the 'Book a Call' CTA, and avatar pills — never as a background fill for large sections
- Apply 4px border-radius to all buttons, tags, and outlined actions; 24px radius to all images; 72–84px radius only to pill-shaped elements
- Maintain a three-zone top bar layout (left brand / center nav / right status pill) on every page
- Pair Obsidian text on Bone White for light sections and Bone White text on Obsidian for dark sections — never mix
- Use 48px vertical padding as the standard section separator rhythm

### Don't
- Do not introduce additional chromatic colors — the lime is the ONLY accent in the system and adding others breaks the discipline
- Do not use soft shadows, blurs, or gradient backgrounds on any UI element — the system is intentionally flat except for the 3D sculpture
- Do not use 16px+ border-radius on buttons or tags — they must read as sharp/precise (4px)
- Do not set body type above 18px — the design uses size contrast between 11px labels and 48px displays, not intermediate steps
- Do not place body copy centered — all body and labels are left-aligned, with only display headings occasionally centered
- Do not use border-radius below 4px or use perfectly square corners — 4px is the minimum precision radius
- Do not stack more than two text weights in a single component — the system relies on monospace + display grotesque only

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Bone Canvas | `#ffffff` | Default light section background, hero, project galleries |
| 1 | Acid Highlight | `#ebff00` | Time badge, contact CTA, occasional section accent |
| 2 | Fog Plate | `#c8c8c8` | Image placeholders, product mockup backgrounds, neutral cards |
| 3 | Slate Card | `#383838` | Elevated dark surface inside dark sections |
| 4 | Obsidian Ground | `#080707` | Dark contact/footer section, near-black canvas |

## Elevation

- **Floating CTA (Book a Call):** `0 4px 12px rgba(0,0,0,0.15)`
- **Video Watch Card:** `0 2px 8px rgba(0,0,0,0.08)`

## Imagery

The visual language is 99% flat monochrome UI punctuated by one signature 3D rendered element: a glossy black abstract 'A' letterform sculpture that appears as a hero anchor and section mascot. Project imagery is presented as large rectangular product mockup screenshots on neutral Fog (#c8c8c8) backgrounds within 24px-radius frames — no lifestyle photography, no environmental context. A small embedded video thumbnail card uses a candid portrait photo. Imagery is always contained (never full-bleed decorative), always sharp-edged or softly rounded at 24px, and always monochrome or desaturated. Icons are mono-stroke monochrome in 1.5–2px weight, paired with monospace labels. The role of imagery is showcase and identification, not decoration — the design IS the decoration.

## Layout

Full-bleed edge-to-edge layout with no centered max-width container. Top bar spans 100% width with three flex zones: brand label top-left, nav center, status pill top-right. The hero is a wide left-right split: descriptive text block on the left, metadata credits top-right, and the 3D 'A' sculpture dominating the center. Below the fold, project galleries use a 2-column image grid with full-bleed edges. Contact section flips to a dark Obsidian canvas maintaining the same edge-to-edge treatment. Navigation is a single sticky top bar — no sidebar, no mega-menu, no breadcrumbs. Section transitions are immediate (no gradients, no fades) — the only section break mechanism is the canvas flip from white to black. Spacing is compact: 48px between major sections, 10px between text rows, 4–16px component padding. Floating corner elements (Book a Call pill bottom-right, Honors tab right edge) layer over the layout as fixed UI chrome.

## Agent Prompt Guide

## Quick Color Reference
- text: #080707 (light bg) / #ffffff (dark bg)
- background: #ffffff (light) / #080707 (dark)
- border: #000000 (primary) / #c8c8c8 (subtle)
- accent: #ebff00 (Acid Lime — CTAs, status badges only)
- muted surface: #c8c8c8 (Fog — placeholders, image bg)
- primary action: #ebff00 (filled action)

## Example Component Prompts

1. **Section Display Heading**: 48px FK Raster Grotesk Compact Trial Sharp (or Druk Wide / Antonio fallback), weight 400, line-height 1.00, letter-spacing 0.042em, uppercase, color #080707. Example output: 'FEATURED WORK'.

2. **Time Status Badge**: Acid Lime (#ebff00) filled pill, border-radius 84px, 4px vertical / 8px horizontal padding, containing 'MEL(AU) 4:33 PM' in 11px IBM Plex Mono weight 600 uppercase with 0.086em letter-spacing, color #080707.

3. **Book a Call Floating CTA**: Acid Lime (#ebff00) filled pill, border-radius 84px, 4px vertical / 16px horizontal padding, with a 24px circular avatar on the left, 'BOOK A CALL ↗' in 11px IBM Plex Mono 600 uppercase 0.086em tracking, color #080707. Fixed bottom-right.

4. **Metadata Bracket Tag**: 10–11px IBM Plex Mono weight 600 uppercase, letter-spacing 0.109em, color #080707, wrapped in literal square brackets. Example: '[GOOD DESIGN AWARD WINNER 2023/24]'. No background, no border.

5. **Project Image Card**: Full-column-width image with 24px border-radius, 1px #000000 border, no card background. Above image: project name left-aligned + year right-aligned, both 14px IBM Plex Mono 500. Sits on Bone White (#ffffff) canvas.

6. **Outlined Action Button**: Transparent fill, 1px #080707 border (or #ffffff on dark), border-radius 4px, 4px vertical / 16px horizontal padding, label in 11px IBM Plex Mono 600 uppercase 0.086em tracking. Used for secondary actions and email display.

## Signature System Rules

1. The site runs on exactly ONE chromatic color (Acid Lime #ebff00). Introducing a second chromatic voice breaks the visual contract.

2. Typography is a two-family system: a custom wide-compact grotesque (FK Raster Grotesk) for displays and IBM Plex Mono for everything else. A humanist sans (Be Vietnam Pro) only appears in long-form body.

3. Every label and tag uses square-bracket notation ('[FRONTROW] [2025]') to read as archival catalog codes rather than UI labels.

4. Radii follow a strict 3-tier hierarchy: 4px (precise UI), 24px (images), 72–84px (pills). No intermediate values like 8px or 12px are used.

5. The 3D 'A' sculpture functions as a recurring brand mark — it should appear centered in at least one major section per page to maintain brand presence.

## Similar Brands

- **Locomotive (locomotive.ca)** — Same editorial monochrome portfolio language with a single accent color, tight grid, and large display grotesque headings
- **Rauno Freiberg (raunofreiberg.com)** — Same monospace metadata + large compressed display type combo, monochrome canvas with single vivid accent, edge-to-edge layout
- **Pentagram partners (pentagram.com)** — Same brutalist editorial aesthetic with sharp 4px buttons, bracketed metadata, and a persistent top bar treatment
- **Werkstätte-Haberzeth** — Same monospace-label + display-grotesque contrast, acid accent against monochrome, 3D sculptural logo mark as section anchor

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-acid-lime: #ebff00;
  --color-obsidian: #080707;
  --color-pure-black: #000000;
  --color-bone-white: #ffffff;
  --color-fog: #c8c8c8;
  --color-slate: #383838;

  /* Typography — Font Families */
  --font-fk-raster-grotesk-compact-trial-sharp: 'FK Raster Grotesk Compact Trial Sharp', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-ibm-plex-mono: 'IBM Plex Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-be-vietnam-pro: 'Be Vietnam Pro', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter-medium: 'Inter Medium', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-system-sans-serif: 'system sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1;
  --tracking-caption: 0.86px;
  --text-body: 16px;
  --leading-body: 1.4;
  --text-subheading: 18px;
  --leading-subheading: 1.4;
  --tracking-subheading: -0.9px;
  --text-heading-sm: 32px;
  --leading-heading-sm: 1;
  --tracking-heading-sm: 1.344px;
  --text-heading: 48px;
  --leading-heading: 1;
  --tracking-heading: 2.016px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-48: 48px;
  --spacing-80: 80px;
  --spacing-100: 100px;

  /* Layout */
  --section-gap: 48px;
  --card-padding: 16px;
  --element-gap: 10px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-2xl: 16px;
  --radius-2xl-2: 20px;
  --radius-3xl: 24px;
  --radius-3xl-2: 30px;
  --radius-3xl-3: 40px;
  --radius-full: 50px;
  --radius-full-2: 60px;
  --radius-full-3: 72px;
  --radius-full-4: 84px;
  --radius-full-5: 94px;
  --radius-full-6: 120px;

  /* Named Radii */
  --radius-tags: 4px;
  --radius-cards: 24px;
  --radius-pills: 72-84px;
  --radius-images: 24px;
  --radius-buttons: 4px;
  --radius-special: 30-40px;

  /* Surfaces */
  --surface-bone-canvas: #ffffff;
  --surface-acid-highlight: #ebff00;
  --surface-fog-plate: #c8c8c8;
  --surface-slate-card: #383838;
  --surface-obsidian-ground: #080707;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-acid-lime: #ebff00;
  --color-obsidian: #080707;
  --color-pure-black: #000000;
  --color-bone-white: #ffffff;
  --color-fog: #c8c8c8;
  --color-slate: #383838;

  /* Typography */
  --font-fk-raster-grotesk-compact-trial-sharp: 'FK Raster Grotesk Compact Trial Sharp', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-ibm-plex-mono: 'IBM Plex Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-be-vietnam-pro: 'Be Vietnam Pro', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter-medium: 'Inter Medium', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-system-sans-serif: 'system sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1;
  --tracking-caption: 0.86px;
  --text-body: 16px;
  --leading-body: 1.4;
  --text-subheading: 18px;
  --leading-subheading: 1.4;
  --tracking-subheading: -0.9px;
  --text-heading-sm: 32px;
  --leading-heading-sm: 1;
  --tracking-heading-sm: 1.344px;
  --text-heading: 48px;
  --leading-heading: 1;
  --tracking-heading: 2.016px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-48: 48px;
  --spacing-80: 80px;
  --spacing-100: 100px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-2xl: 16px;
  --radius-2xl-2: 20px;
  --radius-3xl: 24px;
  --radius-3xl-2: 30px;
  --radius-3xl-3: 40px;
  --radius-full: 50px;
  --radius-full-2: 60px;
  --radius-full-3: 72px;
  --radius-full-4: 84px;
  --radius-full-5: 94px;
  --radius-full-6: 120px;
}
```
