# Telescope — Style Reference
> Editorial pasteboard on cream paper. A warm bone-white canvas with full-bleed magazine photography, one bright lime accent, and serif headlines that lay out around the images like an art director's spread.

**Theme:** light

Telescope reads as an editorial fashion magazine printed on warm cream paper: a nearly monochrome world of bone-white canvas, warm near-black type, and full-bleed editorial photography, punctuated by a single vivid lime accent that signals the only interactive surface. The UI is stripped to the bone — no cards, no panels, no decorative chrome — with a fixed bottom bar in mono caps doing all the navigation work and photos floating freely into the headline as if laid out on a pasteboard. Typography does the heavy lifting: a quiet custom serif at generous sizes with tight negative tracking whispers rather than shouts, while the mono labels at 12px are the only typographic texture outside the serif system. Everything is sharp at 2px corners, spacing is generous, and the lime green is rationed — one button, nothing else.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Bone Paper | `#f4f3f0` | `--color-bone-paper` | Page canvas — the warm off-white that reads as paper stock, not screen white. Everything sits on this surface |
| Ink | `#1a1915` | `--color-ink` | Primary text, body copy, headings, borders, and hairline rules. A warm near-black, never pure #000, so the contrast against Bone Paper feels printed rather than digital |
| Ash | `#82868e` | `--color-ash` | Secondary text, meta labels, and subtle borders. The cool counterpoint to Ink's warmth — used when type needs to recede without losing legibility |
| Pure White | `#ffffff` | `--color-pure-white` | Surface layer above Bone Paper for inline cards and the bottom navigation bar. Rare — most surfaces stay on Bone |
| Lime Pulse | `#e3f794` | `--color-lime-pulse` | Green wash for highlight backgrounds, decorative bands, and soft emphasis behind content. Do not promote it to the primary CTA color |

## Tokens — Typography

### Beausite — The sole display and body face. Used at four sizes: 19px for body and card text, 23px for emphasized body and sub-headings, 55px for section headings, and 57px for hero headlines. Single weight (400) across all sizes — the system relies on size and negative tracking for hierarchy, not weight contrast. Letter-spacing tightens aggressively at large sizes: -0.007em at 19–23px, deepening to -0.017em at 55px and -0.020em at 57px. This negative tracking is the signature — it gives the serif a modern, tight, fashion-editorial feel rather than a bookish one. · `--font-beausite`
- **Substitute:** GT Super, Tiempos Text, or Domaine Display — any contemporary serif with refined terminals and good display behavior
- **Weights:** 400
- **Sizes:** 19, 23, 55, 57
- **Line height:** 1.05–1.15
- **Letter spacing:** -0.0200em, -0.0170em, -0.0070em
- **Role:** The sole display and body face. Used at four sizes: 19px for body and card text, 23px for emphasized body and sub-headings, 55px for section headings, and 57px for hero headlines. Single weight (400) across all sizes — the system relies on size and negative tracking for hierarchy, not weight contrast. Letter-spacing tightens aggressively at large sizes: -0.007em at 19–23px, deepening to -0.017em at 55px and -0.020em at 57px. This negative tracking is the signature — it gives the serif a modern, tight, fashion-editorial feel rather than a bookish one.

### DM Mono — Exclusively for UI chrome: the 'CURRENTLY IN BETA' label, 'LOGIN' and 'SIGN UP' button text, and the 'SCROLL' indicator. Set in all-caps at 12px with +0.03em tracking (0.36px), creating a widened mechanical texture that contrasts sharply with Beausite's organic serif. This is the only typographic texture outside the serif system. · `--font-dm-mono`
- **Substitute:** JetBrains Mono, IBM Plex Mono, or Space Mono
- **Weights:** 400
- **Sizes:** 12
- **Line height:** 1.10
- **Letter spacing:** 0.0300em
- **Role:** Exclusively for UI chrome: the 'CURRENTLY IN BETA' label, 'LOGIN' and 'SIGN UP' button text, and the 'SCROLL' indicator. Set in all-caps at 12px with +0.03em tracking (0.36px), creating a widened mechanical texture that contrasts sharply with Beausite's organic serif. This is the only typographic texture outside the serif system.

### CM Geom — A massive decorative display at 250px — likely a brand wordmark or oversized brand-mark element rendered as layout sculpture, not readable copy. Line-height of 1.00 with minimal -0.002em tracking. Use sparingly as an atmospheric or branding element, never for functional text. · `--font-cm-geom`
- **Substitute:** No substitute — treat as a custom brand element. Approximate with any geometric display face at extreme scale if needed.
- **Weights:** 400
- **Sizes:** 250
- **Line height:** 1.00
- **Letter spacing:** -0.0020em
- **Role:** A massive decorative display at 250px — likely a brand wordmark or oversized brand-mark element rendered as layout sculpture, not readable copy. Line-height of 1.00 with minimal -0.002em tracking. Use sparingly as an atmospheric or branding element, never for functional text.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.1 | 0.36px | `--text-caption` |
| body-sm | 19px | 1.15 | -0.13px | `--text-body-sm` |
| body | 23px | 1.15 | -0.16px | `--text-body` |
| heading | 55px | 1.05 | -0.94px | `--text-heading` |
| heading-lg | 57px | 1.05 | -1.14px | `--text-heading-lg` |
| display | 250px | 1 | -0.5px | `--text-display` |

## Tokens — Spacing & Shapes

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 6 | 6px | `--spacing-6` |
| 7 | 7px | `--spacing-7` |
| 10 | 10px | `--spacing-10` |
| 14 | 14px | `--spacing-14` |
| 15 | 15px | `--spacing-15` |
| 19 | 19px | `--spacing-19` |
| 24 | 24px | `--spacing-24` |
| 29 | 29px | `--spacing-29` |
| 41 | 41px | `--spacing-41` |
| 48 | 48px | `--spacing-48` |
| 71 | 71px | `--spacing-71` |
| 135 | 135px | `--spacing-135` |
| 225 | 225px | `--spacing-225` |

### Border Radius

| Element | Value |
|---------|-------|
| all | 2px |
| cards | 2px |
| images | 2px |
| buttons | 2px |

### Layout

- **Section gap:** 48-71px
- **Card padding:** 10-14px
- **Element gap:** 6-10px

## Components

### Bottom Navigation Bar
**Role:** Fixed chrome layer — the only persistent navigation

Full-width white (#ffffff) bar anchored to the bottom of the viewport. Three regions: left ('CURRENTLY IN BETA' in DM Mono 12px caps, tracking 0.36px, Ink color), center (Beausite wordmark 'Telescope' in body weight, with 'LOGIN' and 'SIGN UP' actions to the right), and right ('SCROLL' label with a small down-chevron icon in Ink). Height approximately 48–56px. 2px top border in Ink. No background blur or shadow — sits flat on the page.

### Sign Up Button
**Role:** The sole primary action in the interface

Filled rectangle with Lime Pulse (#e3f794) background, Ink (#1a1915) text in DM Mono 12px all-caps, tracking 0.36px. 2px border radius — sharp, not rounded. Padding approximately 7px horizontal, 10px vertical. No shadow, no hover gradient. Its isolation in lime against the monochrome system makes it the loudest thing on the page.

### Login Link
**Role:** Secondary navigation action in the bottom bar

Text-only 'LOGIN' in DM Mono 12px caps, Ink color, 0.36px tracking. No background, no border. 7px horizontal padding. Sits directly left of the Sign Up button.

### Beta Status Label
**Role:** Contextual status indicator in the bottom-left of the navigation bar

'CURRENTLY IN BETA' in DM Mono 12px caps, Ash (#82868e) or Ink color, 0.36px tracking. No background. Quiet metadata that signals the platform is early-stage.

### Floating Editorial Photo
**Role:** Scattered product and lifestyle imagery surrounding hero headlines

Rectangular images with 2px border radius, floating freely around the page headline in an art-directed scatter. No captions, no borders, no shadows — just raw photographs laid out like a magazine contact sheet. Sizes vary (roughly 80–160px wide on the hero). Full-color editorial photography, not product white-background shots.

### Full-Bleed Editorial Hero
**Role:** Section-opening photography for editorial content blocks

Full-viewport-width photograph with no border, no radius, no overlay treatment. Beausite 55–57px headline overlays the image in white or semi-transparent text, centered. The photograph IS the section — no container, no card, no padding around it.

### Inline Image-in-Headline Composition
**Role:** Signature layout pattern where photographs interrupt the text flow of a headline

A headline rendered in Beausite 55–57px is split with a small photograph placed inline between the text words, so the reading flow wraps around the image. The image sits on the same baseline as the text, 2px radius, sized to match the cap-height of the surrounding serif. This is a magazine layout technique, not a standard web component.

### Scroll Indicator
**Role:** Gentle prompt to scroll past the hero

'SCROLL' in DM Mono 12px caps with a small downward chevron icon in Ink (#1a1915). Anchored bottom-right of the viewport. 2px stroke weight on the chevron.

### Curator Portrait
**Role:** Subject photography for the people behind recommendations

Full-bleed editorial portrait photograph, uncropped or loosely cropped, used as the visual anchor for curator profiles. Beausite 55–57px white headline overlaid, centered horizontally and vertically. The portrait's natural framing does all the compositional work.

## Do's and Don'ts

### Do
- Use Lime Pulse (#e3f794) exclusively for the primary Sign Up button. Never use it for decorative elements, hover states, or secondary actions.
- Set all corners to 2px radius — images, buttons, cards, everything. This uniform sharpness is a defining trait of the system.
- Render headlines in Beausite at 55–57px with letter-spacing tightening to -0.94px and -1.14px respectively. The negative tracking is not optional; it gives the serif its modern editorial voice.
- Use DM Mono 12px with +0.36px tracking in all-caps for every UI label: status indicators, button text, navigation items. Reserve Beausite for editorial and body content.
- Let the page breathe on Bone Paper (#f4f3f0). Maintain 48–71px between major sections and 6–10px between inline elements. The cream canvas needs room to read as paper.
- Float editorial photographs freely into the layout — around headlines, inline between words, full-bleed as section breaks. Treat images as layout elements, not content blocks.
- Write body and card text in Beausite 400 at 19–23px with -0.13 to -0.16px tracking. The single weight (400) means hierarchy comes from size and spacing alone.

### Don't
- Never use shadows, drop-shadow filters, or box-elevation effects. The system is flat; depth comes from photography and surface color contrast only.
- Never round corners beyond 2px. No pill buttons, no large radii on cards, no circular avatars. The sharp 2px corner is non-negotiable.
- Never apply Lime Pulse to anything other than the Sign Up button. Using the accent for links, icons, tags, or highlights destroys its scarcity value.
- Never use Ash (#82868e) for primary body text. It's for secondary metadata, borders, and receded labels only. Body copy is always Ink (#1a1915).
- Never set Beausite headlines in bold or black weight — the face only ships at 400. Hierarchy through size, never through weight contrast.
- Never add background colors to images or place photographs in containers with visible borders. Photos should sit raw on the cream canvas.
- Never use a sans-serif system font for editorial text. Beausite (or its serif substitute) is the only body and display face. DM Mono handles UI labels separately.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Bone Paper | `#f4f3f0` | Full-bleed page canvas |
| 1 | Pure White | `#ffffff` | Bottom navigation bar and inline card surfaces |
| 2 | Lime Pulse | `#e3f794` | Primary action button fill |

## Elevation

Flat by design. The interface uses zero shadows — depth is communicated through the full-bleed photography and the contrast between the white navigation bar and the cream canvas. This flatness reinforces the printed/paper metaphor.

## Imagery

Full-bleed editorial photography is the primary visual medium. Images are uncropped or loosely cropped portraits and product/lifestyle shots with natural lighting and rich color — magazine-quality, not e-commerce product photography. Floating product images on the hero sit at small scales (80–160px) scattered art-directedly around the headline, with no captions, borders, or containers. Full-bleed section images span the entire viewport with overlaid white serif text. The photography style is warm, human, and curated — it should feel like a fashion editorial contact sheet, not a product catalog. No illustrations, no abstract graphics, no icons beyond the minimal scroll chevron.

## Layout

Full-bleed editorial layout with no page max-width constraint. The hero uses a centered headline in the visual middle of the viewport with photographs scattered freely in the surrounding whitespace at varying sizes and rotations. The signature pattern is text interrupted by inline images — the headline reads 'by real [portrait] people' with a photograph sitting between the words at the same baseline. Section transitions are full-viewport photographs with overlaid centered headlines. The only persistent UI is a fixed bottom navigation bar (white, ~48px tall) containing beta status, wordmark, login, and sign up. No top nav, no sidebar, no grid containers — the page reads top to bottom as a magazine spread, with generous vertical breathing room (48–71px) between sections.

## Agent Prompt Guide

**Quick Color Reference**
- Text (primary): #1a1915
- Text (secondary): #82868e
- Background (canvas): #f4f3f0
- Background (surface): #ffffff
- Border: #1a1915
- Accent / primary action: no distinct CTA color

**Example Component Prompts**

1. **Hero with floating editorial photos**: Bone Paper (#f4f3f0) full-bleed background. Centered headline in Beausite 400 at 57px, color #1a1915, letter-spacing -1.14px, line-height 1.05. Surround the headline with 6–8 small editorial photographs (100–160px wide, 2px radius) scattered freely in the surrounding whitespace at varied positions. No captions, no borders on the images.

2. **Bottom navigation bar**: Fixed white (#ffffff) bar, full width, ~48px tall, 2px top border in #1a1915. Left: 'CURRENTLY IN BETA' in DM Mono 12px caps, color #82868e, tracking 0.36px. Center-left: 'Telescope' wordmark in Beausite 400 at 19px, color #1a1915. Immediately right: 'LOGIN' in DM Mono 12px caps, #1a1915, then a filled Sign Up button (Lime Pulse #e3f794 background, Ink #1a1915 text, 2px radius, 10px vertical / 7px horizontal padding). Right: 'SCROLL' in DM Mono 12px caps with a small down-chevron icon in #1a1915.

3. **Full-bleed editorial section**: Full-viewport-width photograph (uncropped, no border, no radius) filling the entire section height. Overlaid centered in the middle: a headline in Beausite 400 at 55px, color #ffffff, letter-spacing -0.94px, line-height 1.05. The text should sit at roughly 40% from the top of the image.

4. **Inline image-in-headline composition**: A single line of Beausite 400 at 55px, color #1a1915, letter-spacing -0.94px, with a small portrait photograph (~80px tall, 2px radius) inserted inline between two words at the same baseline as the text. The line should read like: 'by real [photo] people' with the image replacing the gap between words.

5. **Status badge / label**: 'CURRENTLY IN BETA' in DM Mono 12px caps, color #82868e, tracking 0.36px, no background, no border, no padding. Used inline as quiet metadata text.

## Similar Brands

- **Are.na** — Same editorial, minimal-chrome approach with warm off-white canvas, floating image cards, and serif-first typography that lets the content breathe
- **Cereal magazine** — Shared magazine-spread sensibility: cream paper background, full-bleed editorial photography, and tight serif headlines with aggressive negative tracking
- **It's Nice That** — Curatorial media platform with a single accent color rationed to one action, serif display type, and photography-first layout that treats the page as a contact sheet
- **Aesop (aesop.com)** — Same warm near-black on cream-white palette with a single reserved accent, tight serif typography, and a stripped-back UI that lets product imagery carry the page
- **Kinfolk** — Editorial publication aesthetic with warm bone background, generous whitespace, serif at large sizes, and full-bleed lifestyle photography as section dividers

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-bone-paper: #f4f3f0;
  --color-ink: #1a1915;
  --color-ash: #82868e;
  --color-pure-white: #ffffff;
  --color-lime-pulse: #e3f794;

  /* Typography — Font Families */
  --font-beausite: 'Beausite', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-dm-mono: 'DM Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-cm-geom: 'CM Geom', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.1;
  --tracking-caption: 0.36px;
  --text-body-sm: 19px;
  --leading-body-sm: 1.15;
  --tracking-body-sm: -0.13px;
  --text-body: 23px;
  --leading-body: 1.15;
  --tracking-body: -0.16px;
  --text-heading: 55px;
  --leading-heading: 1.05;
  --tracking-heading: -0.94px;
  --text-heading-lg: 57px;
  --leading-heading-lg: 1.05;
  --tracking-heading-lg: -1.14px;
  --text-display: 250px;
  --leading-display: 1;
  --tracking-display: -0.5px;

  /* Typography — Weights */
  --font-weight-regular: 400;

  /* Spacing */
  --spacing-6: 6px;
  --spacing-7: 7px;
  --spacing-10: 10px;
  --spacing-14: 14px;
  --spacing-15: 15px;
  --spacing-19: 19px;
  --spacing-24: 24px;
  --spacing-29: 29px;
  --spacing-41: 41px;
  --spacing-48: 48px;
  --spacing-71: 71px;
  --spacing-135: 135px;
  --spacing-225: 225px;

  /* Layout */
  --section-gap: 48-71px;
  --card-padding: 10-14px;
  --element-gap: 6-10px;

  /* Border Radius */
  --radius-sm: 2px;

  /* Named Radii */
  --radius-all: 2px;
  --radius-cards: 2px;
  --radius-images: 2px;
  --radius-buttons: 2px;

  /* Surfaces */
  --surface-bone-paper: #f4f3f0;
  --surface-pure-white: #ffffff;
  --surface-lime-pulse: #e3f794;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-bone-paper: #f4f3f0;
  --color-ink: #1a1915;
  --color-ash: #82868e;
  --color-pure-white: #ffffff;
  --color-lime-pulse: #e3f794;

  /* Typography */
  --font-beausite: 'Beausite', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-dm-mono: 'DM Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-cm-geom: 'CM Geom', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.1;
  --tracking-caption: 0.36px;
  --text-body-sm: 19px;
  --leading-body-sm: 1.15;
  --tracking-body-sm: -0.13px;
  --text-body: 23px;
  --leading-body: 1.15;
  --tracking-body: -0.16px;
  --text-heading: 55px;
  --leading-heading: 1.05;
  --tracking-heading: -0.94px;
  --text-heading-lg: 57px;
  --leading-heading-lg: 1.05;
  --tracking-heading-lg: -1.14px;
  --text-display: 250px;
  --leading-display: 1;
  --tracking-display: -0.5px;

  /* Spacing */
  --spacing-6: 6px;
  --spacing-7: 7px;
  --spacing-10: 10px;
  --spacing-14: 14px;
  --spacing-15: 15px;
  --spacing-19: 19px;
  --spacing-24: 24px;
  --spacing-29: 29px;
  --spacing-41: 41px;
  --spacing-48: 48px;
  --spacing-71: 71px;
  --spacing-135: 135px;
  --spacing-225: 225px;

  /* Border Radius */
  --radius-sm: 2px;
}
```
