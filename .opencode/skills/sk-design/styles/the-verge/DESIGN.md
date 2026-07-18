# The Verge — Style Reference
> Midnight control room, mint alerts

**Theme:** dark

The Verge reads as a late-night newsroom: a near-black canvas where type carries the weight and teal appears only as functional punctuation. The Signal Mint accent (#3cffd0) marks everything that is alive — section labels, author bylines, active states, the subscribe button — while the rest of the page stays achromatic. Display headlines run at Manuka weight 900, 60–107px, creating editorial impact at near-zero line-height, then article bodies switch to Fk Roman Standard serif to separate reading mode from chrome. The vertical 'Verge' wordmark pinned to the left margin is the page's most distinctive structural element — a constant typographic frame, not a logo. Violet (#5200ff) and red-orange (#ff3d00) appear only as section-card fills (Most Popular, Podcasts), giving the monochrome feed two moments of color without breaking the dark mood.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Charcoal | `#131313` | `--color-charcoal` | Page canvas, primary background, inverted sections |
| Onyx | `#000000` | `--color-onyx` | Deepest darks, shadows, text on light surfaces |
| Paper | `#ffffff` | `--color-paper` | Primary text, inverted surfaces, light icons |
| Iron | `#313131` | `--color-iron` | Elevated card surface, image-adjacent panels |
| Graphite | `#272727` | `--color-graphite` | Supporting neutral for secondary UI, dividers, and muted labels. Do not promote it to the primary CTA color |
| Fog | `#949494` | `--color-fog` | Supporting neutral for secondary UI, dividers, and muted labels |
| Mist | `#e9e9e9` | `--color-mist` | Light hairline borders, high-contrast meta text on dark |
| Silver | `#c9c9c9` | `--color-silver` | Tertiary text, subdued metadata |
| Signal Mint | `#3cffd0` | `--color-signal-mint` | Teal supporting accent for decorative details and low-frequency emphasis. Do not promote it to the primary CTA color |
| Ultraviolet | `#5200ff` | `--color-ultraviolet` | Most Popular section card background, ranked-list emphasis |
| Heat Red | `#ff3d00` | `--color-heat-red` | Podcasts section card background, audio content emphasis |
| Forest | `#309875` | `--color-forest` | Secondary green accent for category labels and subdued highlights |

## Tokens — Typography

### Manuka — Display headlines for hero and feature stories — ultra-heavy, near-zero leading creates editorial impact at the largest scale · `--font-manuka`
- **Substitute:** Druk Wide Bold, Knockout 90, GT America Compressed Black
- **Weights:** 900
- **Sizes:** 60px, 90px, 107px
- **Line height:** 0.80
- **Letter spacing:** 0.01em
- **Role:** Display headlines for hero and feature stories — ultra-heavy, near-zero leading creates editorial impact at the largest scale

### Poly Sans — Primary UI font — nav, section headers, list items, card titles; tracks wide at small sizes (0.06–0.15em) for ALL-CAPS labels and tight at body sizes · `--font-poly-sans`
- **Substitute:** Inter, Untitled Sans, Söhne
- **Weights:** 300, 400, 500, 700
- **Sizes:** 9px, 10px, 11px, 12px, 13px, 15px, 16px, 18px, 19px, 20px, 24px, 34px
- **Line height:** 1.00–1.60
- **Letter spacing:** 0.02em at 16px, 0.06em at 13px, 0.10em at 11px, 0.15em at 9–10px
- **Role:** Primary UI font — nav, section headers, list items, card titles; tracks wide at small sizes (0.06–0.15em) for ALL-CAPS labels and tight at body sizes

### Fk Roman Standard — Article body text — serif distinguishes reading mode from navigation; slight negative tracking tightens running text · `--font-fk-roman-standard`
- **Substitute:** Source Serif Pro, Tiempos Text, Lora
- **Weights:** 400
- **Sizes:** 16px, 20px, 24px
- **Line height:** 1.20, 1.30
- **Letter spacing:** -0.01em
- **Role:** Article body text — serif distinguishes reading mode from navigation; slight negative tracking tightens running text

### Poly Sans Mono — Metadata, category tags, timestamps — monospaced feel with wide letter-spacing (0.10–0.125em) for technical/journalistic texture · `--font-poly-sans-mono`
- **Substitute:** JetBrains Mono, IBM Plex Mono, Geist Mono
- **Weights:** 400, 500, 600, 700
- **Sizes:** 11px, 12px
- **Line height:** 1.18, 1.20, 1.30, 2.00
- **Letter spacing:** 0.10em at 11px, 0.125em at 12px
- **Role:** Metadata, category tags, timestamps — monospaced feel with wide letter-spacing (0.10–0.125em) for technical/journalistic texture

### ui-sans-serif — System fallback for non-critical UI copy · `--font-ui-sans-serif`
- **Substitute:** system-ui, -apple-system, Segoe UI
- **Weights:** 400
- **Sizes:** 16px
- **Line height:** 1.10–1.50
- **Letter spacing:** normal
- **Role:** System fallback for non-critical UI copy

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 11px | 1.2 | 1.1px | `--text-caption` |
| body | 16px | 1.5 | 0.3px | `--text-body` |
| subheading | 18px | 1.3 | 0.36px | `--text-subheading` |
| heading-sm | 20px | 1.3 | 0.4px | `--text-heading-sm` |
| heading | 24px | 1.2 | 0.48px | `--text-heading` |
| heading-lg | 34px | 1.1 | 0.68px | `--text-heading-lg` |
| display | 60px | 0.8 | 0.6px | `--text-display` |
| display-xl | 107px | 0.8 | 1.07px | `--text-display-xl` |

## Tokens — Spacing & Shapes

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 5 | 5px | `--spacing-5` |
| 6 | 6px | `--spacing-6` |
| 8 | 8px | `--spacing-8` |
| 10 | 10px | `--spacing-10` |
| 12 | 12px | `--spacing-12` |
| 14 | 14px | `--spacing-14` |
| 16 | 16px | `--spacing-16` |
| 20 | 20px | `--spacing-20` |
| 24 | 24px | `--spacing-24` |
| 30 | 30px | `--spacing-30` |
| 35 | 35px | `--spacing-35` |
| 40 | 40px | `--spacing-40` |
| 50 | 50px | `--spacing-50` |
| 60 | 60px | `--spacing-60` |
| 100 | 100px | `--spacing-100` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 20px |
| pills | 9999px |
| images | 3px |
| inputs | 4px |
| buttons | 24px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| subtle | `rgb(60, 255, 208) 0px -1px 0px 0px inset` | `--shadow-subtle` |
| subtle-2 | `rgb(0, 0, 0) 0px -1px 0px 0px inset` | `--shadow-subtle-2` |

### Layout

- **Page max-width:** 1280px
- **Section gap:** 48-64px
- **Card padding:** 20px
- **Element gap:** 10-20px

## Components

### Top Navigation Bar
**Role:** Persistent site header with logo, section links, and account actions

Horizontal bar at #131313 canvas. Verge wordmark left, horizontal nav links (Tech, Reviews, Science, Entertainment, AI, Policy) in Poly Sans 16px weight 400 white. A filled teal subscribe button (#3cffd0 fill, #000000 text, Poly Sans Mono 11px weight 600, 0.10em tracking, 10px 20px padding, 4px radius) on the right. A 'SIGN IN' text link in Poly Sans 11px weight 500 white and a hamburger menu icon. Top edge carries a 1px teal inset border on hover-active nav items.

### Vertical Verge Wordmark
**Role:** Persistent left-margin brand frame

The word 'Verge' rotated 90° and pinned to the left edge of the page. Set in Manuka weight 900 at a very large size (60–107px), white #ffffff. Serves as a constant typographic column rather than a traditional header logo — a signature structural element that defines the page's left margin.

### Hero Story Card
**Role:** Lead story with full-bleed image and overlay headline

Large editorial photograph filling the left content column. Overlay headline at the lower-left in Manuka weight 900, 60–90px, #ffffff, line-height 0.80. Subhead in Fk Roman Standard 20px weight 400 #949494. Author byline in Poly Sans 11px weight 500 #3cffd0 (teal) with a date and comment count in Poly Sans 11px weight 400 #949494. No border or background — the image is the surface.

### Teal Section Label
**Role:** Uppercase header for content sections (Top Stories, Free to read)

Set in Poly Sans 20px weight 500 #3cffd0, 0.02em letter-spacing. A short two- or three-word label — no underline, no icon, no border. The teal color is the entire signal; it reads as a quiet editorial flag, not a heading.

### Numbered Story List Item
**Role:** Ranked story in a list (Top Stories, Most Popular, Podcasts)

Row layout: number on the far left in Poly Sans 16px weight 700 #3cffd0 (teal), title in Poly Sans 18px weight 700 #ffffff, author byline in Poly Sans 11px weight 500 #3cffd0 (teal), date in Poly Sans 11px weight 400 #949494, and a chat-bubble icon with comment count. A 60×60px thumbnail at 3px radius on the right. Each row separated by a 1px hairline divider in #313131 or section-card color.

### Teal Pill Toggle
**Role:** Switch between 'Today's Stream' and 'Following' content views

A pill-shaped toggle with 24px radius (fully rounded). Active state: #3cffd0 background, #000000 text in Poly Sans Mono 12px weight 700, 0.10em tracking. Inactive state: #131313 background, #ffffff text with a 1px #e9e9e9 border. The teal active state is the system's only filled-color moment in the navigation surface.

### Most Popular Card (Violet)
**Role:** Ranked list section with violet background fill

Full section card at #5200ff background, 20px corner radius, 20px internal padding. Section label 'MOST POPULAR' in Poly Sans Mono 11px weight 600 #ffffff at 0.10em tracking. Numbered list items with white titles, teal numbers (#3cffd0), and meta in #ffffff at reduced opacity. The violet fill is the second-strongest color moment after teal.

### Podcasts Card (Red)
**Role:** Audio content section with red-orange background fill

Full section card at #ff3d00 background, 20px corner radius, 20px internal padding. Section label 'PODCASTS' in Poly Sans Mono 11px weight 600 #ffffff. A 'SEE ALL PODCASTS →' link top-right in white. Numbered list items with white titles, teal numbers, and author/date meta. Functions as a color-coded content category, not a generic panel.

### Free to Read Card
**Role:** Daily-refresh editorial newsletter section

Dark elevated card at #1f1f1f or #272727 surface (subtly lighter than the #131313 canvas), 20px corner radius, 20px internal padding. Teal 'Free to read' label at top, white 'REFRESHES DAILY AT 1PM EDT' subtitle in Poly Sans Mono 11px. List items with square thumbnail on left (3px radius), title in Poly Sans 18px weight 700 white, and author in teal.

### Article Story Card
**Role:** Standard editorial card with image and text

Horizontal layout: square or landscape thumbnail on the right (3px radius), text block on the left. Headline in Poly Sans 18–20px weight 700 #ffffff. Author and date meta in Poly Sans 11px — author in teal #3cffd0, date in #949494. Comment count with chat icon. No card background or border — sits directly on the #131313 canvas.

### Author Byline + Avatar
**Role:** Byline with circular avatar and author name

Small circular avatar (24–32px) followed by author name in Poly Sans 11px weight 500 #3cffd0. Date and time stamp in Poly Sans 11px weight 400 #949494. The teal author name is one of the most repeated teal moments on the page.

### Subscribe Button (Teal)
**Role:** Filled teal call-to-action in top nav

Small filled button: #3cffd0 background, #000000 text, Poly Sans Mono 11px weight 700 at 0.10em tracking, label 'SUBSCRIBE', 4px corner radius, 10px 20px padding. The single filled-color interactive element against the #131313 nav bar.

## Do's and Don'ts

### Do
- Use Signal Mint #3cffd0 for all section labels, author bylines, active states, and the subscribe button — it is the only chromatic voice and must stay consistent
- Set display headlines in Manuka weight 900 at 60–107px with line-height 0.80 for editorial impact — never substitute a regular weight at this scale
- Use Fk Roman Standard for article body and Poly Sans for all UI chrome — the serif/sans split is the system's mode-switch
- Apply 0.10–0.15em letter-spacing on Poly Sans Mono 11–12px for all uppercase metadata, timestamps, and category labels
- Pin the vertical Verge wordmark to the left margin as a persistent typographic frame — it defines the page's structural identity
- Use the inset teal top border (rgb(60,255,208) 0px -1px 0px 0px inset) on interactive link rows to signal hover/active without changing layout
- Reserve #5200ff and #ff3d00 exclusively for Most Popular and Podcasts section cards — never apply them to text or UI controls

### Don't
- Do not use Signal Mint on body text or large areas — it is a punctuation color, not a fill
- Do not set display headlines below 56px — Manuka 900 only earns its weight at scale
- Do not use Fk Roman Standard for navigation, buttons, or labels — it is reading-mode only
- Do not add drop shadows to cards — the system uses inset top borders and color blocks, not elevation
- Do not round card corners above 20px or button corners above 24px — these values define the system's geometric vocabulary
- Do not use the violet or red-orange fills outside their assigned sections — they are category markers, not generic accents
- Do not use the Forest green #309875 as a primary accent — it is a secondary signal for specific category labels only

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Canvas | `#131313` | Page background, primary dark surface |
| 2 | Card | `#272727` | Elevated panels, button surfaces |
| 3 | Image Card | `#313131` | Image-adjacent panels, list-item dividers |
| 4 | Colored Section | `#5200ff` | Most Popular section card fill |
| 5 | Colored Section | `#ff3d00` | Podcasts section card fill |

## Elevation

- **Link rows, list items:** `rgb(60, 255, 208) 0px -1px 0px 0px inset`
- **Inactive link states:** `rgb(0, 0, 0) 0px -1px 0px 0px inset`

## Imagery

Editorial news photography dominates: spacecraft interiors, product shots, political figures, event coverage. Full-bleed images in the hero, 60×60px square crops in numbered lists, landscape thumbnails in article cards. Treatment is natural and unfiltered — high contrast, no duotone or color grading. No illustrations, no 3D renders, no abstract graphics. Photography is the visual product; the UI recedes around it.

## Layout

Full-bleed dark canvas with a persistent vertical 'Verge' wordmark on the far left serving as a typographic left margin. Top horizontal nav bar with logo, category links, subscribe button, and account actions. Hero occupies the upper-left content area at large scale, with a 'Top Stories' numbered list stacked in the right column. Below: alternating content sections — 'Free to Read' dark card, a teal pill toggle, then a 2-column layout pairing article stream (left) with colored section cards (Most Popular in violet, Podcasts in red-orange) on the right. Section rhythm is dictated by color block transitions, not dividers. Content density is comfortable — generous vertical breathing room between sections, compact within list rows.

## Agent Prompt Guide

## Quick Color Reference
- Text: #ffffff
- Background: #131313
- Border: #e9e9e9 (light hairline) or #313131 (dark divider)
- Accent: #3cffd0 (Signal Mint)
- Surface elevated: #313131
- primary action: no distinct CTA color

## Example Component Prompts

1. **Top navigation bar**: #131313 background. Horizontal nav links in Poly Sans 16px weight 400 #ffffff. Filled teal button (#3cffd0 background, #000000 text, Poly Sans Mono 11px weight 700, 0.10em letter-spacing, 10px 20px padding, 4px radius) labeled 'SUBSCRIBE' on the right.

2. **Hero story**: large full-bleed editorial image. Overlaid headline in Manuka weight 900, 60–90px, #ffffff, line-height 0.80. Subhead in Fk Roman Standard 20px weight 400 #949494. Author byline in Poly Sans 11px weight 500 #3cffd0, date in Poly Sans 11px weight 400 #949494.

3. **Numbered story list item**: row layout. Number in Poly Sans 16px weight 700 #3cffd0 on the far left. Title in Poly Sans 18px weight 700 #ffffff. Author in Poly Sans 11px weight 500 #3cffd0. Date in Poly Sans 11px weight 400 #949494 with a comment-count icon. 60×60px thumbnail at 3px radius on the right. Inset teal top border (1px) on the row.

4. **Most Popular section card**: #5200ff background, 20px corner radius, 20px padding. Section label 'MOST POPULAR' in Poly Sans Mono 11px weight 600 #ffffff, 0.10em letter-spacing. Numbered list items with white titles and teal #3cffd0 numbers.

5. **Stream/Following pill toggle**: 24px radius (fully rounded). Active state: #3cffd0 background, #000000 text in Poly Sans Mono 12px weight 700. Inactive state: #131313 background, #ffffff text with 1px #e9e9e9 border.

## Similar Brands

- **Wired** — Same dark-canvas editorial layout with massive display headlines and a single accent color for interactive elements
- **Ars Technica** — Dark tech-news aesthetic with compact dense list items and serif article bodies alongside sans-serif UI chrome
- **Engadget** — Near-identical dark mode treatment with teal/cyan accent for links and section labels, numbered story lists with right-side thumbnails
- **The Intercept** — Dark editorial news layout with bold display type and monochrome chrome punctuated by a single chromatic accent
- **Vox** — Sister publication sharing the dark canvas + colored section card pattern (violet and red blocks) and vertical brand wordmark on the left margin

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-charcoal: #131313;
  --color-onyx: #000000;
  --color-paper: #ffffff;
  --color-iron: #313131;
  --color-graphite: #272727;
  --color-fog: #949494;
  --color-mist: #e9e9e9;
  --color-silver: #c9c9c9;
  --color-signal-mint: #3cffd0;
  --color-ultraviolet: #5200ff;
  --color-heat-red: #ff3d00;
  --color-forest: #309875;

  /* Typography — Font Families */
  --font-manuka: 'Manuka', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-poly-sans: 'Poly Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-fk-roman-standard: 'Fk Roman Standard', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-poly-sans-mono: 'Poly Sans Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-ui-sans-serif: 'ui-sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 11px;
  --leading-caption: 1.2;
  --tracking-caption: 1.1px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: 0.3px;
  --text-subheading: 18px;
  --leading-subheading: 1.3;
  --tracking-subheading: 0.36px;
  --text-heading-sm: 20px;
  --leading-heading-sm: 1.3;
  --tracking-heading-sm: 0.4px;
  --text-heading: 24px;
  --leading-heading: 1.2;
  --tracking-heading: 0.48px;
  --text-heading-lg: 34px;
  --leading-heading-lg: 1.1;
  --tracking-heading-lg: 0.68px;
  --text-display: 60px;
  --leading-display: 0.8;
  --tracking-display: 0.6px;
  --text-display-xl: 107px;
  --leading-display-xl: 0.8;
  --tracking-display-xl: 1.07px;

  /* Typography — Weights */
  --font-weight-light: 300;
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
  --font-weight-black: 900;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-5: 5px;
  --spacing-6: 6px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-14: 14px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-30: 30px;
  --spacing-35: 35px;
  --spacing-40: 40px;
  --spacing-50: 50px;
  --spacing-60: 60px;
  --spacing-100: 100px;

  /* Layout */
  --page-max-width: 1280px;
  --section-gap: 48-64px;
  --card-padding: 20px;
  --element-gap: 10-20px;

  /* Border Radius */
  --radius-sm: 3px;
  --radius-lg: 10px;
  --radius-2xl: 20px;
  --radius-3xl: 24px;

  /* Named Radii */
  --radius-cards: 20px;
  --radius-pills: 9999px;
  --radius-images: 3px;
  --radius-inputs: 4px;
  --radius-buttons: 24px;

  /* Shadows */
  --shadow-subtle: rgb(60, 255, 208) 0px -1px 0px 0px inset;
  --shadow-subtle-2: rgb(0, 0, 0) 0px -1px 0px 0px inset;

  /* Surfaces */
  --surface-canvas: #131313;
  --surface-card: #272727;
  --surface-image-card: #313131;
  --surface-colored-section: #5200ff;
  --surface-colored-section: #ff3d00;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-charcoal: #131313;
  --color-onyx: #000000;
  --color-paper: #ffffff;
  --color-iron: #313131;
  --color-graphite: #272727;
  --color-fog: #949494;
  --color-mist: #e9e9e9;
  --color-silver: #c9c9c9;
  --color-signal-mint: #3cffd0;
  --color-ultraviolet: #5200ff;
  --color-heat-red: #ff3d00;
  --color-forest: #309875;

  /* Typography */
  --font-manuka: 'Manuka', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-poly-sans: 'Poly Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-fk-roman-standard: 'Fk Roman Standard', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-poly-sans-mono: 'Poly Sans Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-ui-sans-serif: 'ui-sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 11px;
  --leading-caption: 1.2;
  --tracking-caption: 1.1px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: 0.3px;
  --text-subheading: 18px;
  --leading-subheading: 1.3;
  --tracking-subheading: 0.36px;
  --text-heading-sm: 20px;
  --leading-heading-sm: 1.3;
  --tracking-heading-sm: 0.4px;
  --text-heading: 24px;
  --leading-heading: 1.2;
  --tracking-heading: 0.48px;
  --text-heading-lg: 34px;
  --leading-heading-lg: 1.1;
  --tracking-heading-lg: 0.68px;
  --text-display: 60px;
  --leading-display: 0.8;
  --tracking-display: 0.6px;
  --text-display-xl: 107px;
  --leading-display-xl: 0.8;
  --tracking-display-xl: 1.07px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-5: 5px;
  --spacing-6: 6px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-14: 14px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-30: 30px;
  --spacing-35: 35px;
  --spacing-40: 40px;
  --spacing-50: 50px;
  --spacing-60: 60px;
  --spacing-100: 100px;

  /* Border Radius */
  --radius-sm: 3px;
  --radius-lg: 10px;
  --radius-2xl: 20px;
  --radius-3xl: 24px;

  /* Shadows */
  --shadow-subtle: rgb(60, 255, 208) 0px -1px 0px 0px inset;
  --shadow-subtle-2: rgb(0, 0, 0) 0px -1px 0px 0px inset;
}
```
