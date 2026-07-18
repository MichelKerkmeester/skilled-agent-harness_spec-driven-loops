# Signal Messenger — Style Reference
> Frosted privacy glass. A nearly white room washed in pale blue light, with one vivid blue line marking every door you can open.

**Theme:** light

Signal speaks through a frosted privacy glass aesthetic: a nearly monochrome canvas of white and pale blue washes, with one confident blue accent that guides the eye to interactions. The design is deliberately restrained — weight 800 headlines carry all the visual weight alone, surrounded by generous whitespace and almost no ornamentation. Buttons are outlined rather than filled, signaling honesty over persuasion; the only solid color blocks appear in product mockups and the dark slate footer. A distinctive halftone dot illustration style provides the sole decorative personality, rendered entirely in the brand blue. The overall feel is technical documentation elevated to brand: trustworthy, quiet, and precise.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Signal Blue | `#2c6bed` | `--color-signal-blue` | Violet supporting accent for decorative details and low-frequency emphasis. Do not promote it to the primary CTA color |
| Deep Signal | `#2942ff` | `--color-deep-signal` | Navigation links and brand mark anchors — slightly cooler and more electric than Signal Blue, reserved for chrome-level interaction |
| Signal Sky | `#9dbbf8` | `--color-signal-sky` | Hero section wash, large decorative panels — soft periwinkle that bathes the page in brand color without overwhelming |
| Signal Mist | `#a5cad5` | `--color-signal-mist` | Secondary feature panel backgrounds — desaturated teal that recedes behind content, used to break the page rhythm without adding chroma |
| Ink | `#1b1b1b` | `--color-ink` | Primary body and heading text — soft black at AAA contrast on every surface, the dominant typographic color |
| Slate | `#404654` | `--color-slate` | Secondary body text, subdued paragraphs — cool gray with a faint violet cast that echoes the brand blue |
| Twilight | `#3c3744` | `--color-twilight` | Footer background — muted purple-black that grounds the page in a warm dark wash without pure black harshness |
| Fog | `#e9e9e9` | `--color-fog` | Hairline borders, dividers, footer text — the structural neutral that separates content bands |
| Paper | `#f6f6f6` | `--color-paper` | Page canvas — off-white that warms the stark white without going cream |
| White | `#ffffff` | `--color-white` | Light supporting surface for subtle backgrounds and section separation. Do not promote it to the primary CTA color |

## Tokens — Typography

### Inter — Sole typeface across the entire site. Weight 800 headlines are anti-soft — paired with tight 1.07–1.14 line-heights they create near-solid blocks of type that anchor the page. Weight 600 handles buttons and subheadings with a confident mid-weight. Weight 400 body at 1.50 line-height provides generous reading rhythm. The extreme contrast between 800 display and 400 body is the typographic signature. · `--font-inter`
- **Substitute:** system-ui, -apple-system, Segoe UI, Roboto, sans-serif
- **Weights:** 400, 600, 800
- **Sizes:** 16px, 20px, 28px, 40px, 60px
- **Line height:** 1.07–1.50
- **Role:** Sole typeface across the entire site. Weight 800 headlines are anti-soft — paired with tight 1.07–1.14 line-heights they create near-solid blocks of type that anchor the page. Weight 600 handles buttons and subheadings with a confident mid-weight. Weight 400 body at 1.50 line-height provides generous reading rhythm. The extreme contrast between 800 display and 400 body is the typographic signature.

### system-ui — system-ui — detected in extracted data but not described by AI · `--font-system-ui`
- **Weights:** 600
- **Sizes:** 20px
- **Line height:** 1.4
- **Role:** system-ui — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| body | 16px | 1.5 | — | `--text-body` |
| subheading | 20px | 1.4 | — | `--text-subheading` |
| heading-sm | 28px | 1.38 | — | `--text-heading-sm` |
| heading | 40px | 1.14 | — | `--text-heading` |
| display | 60px | 1.07 | — | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 6px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 12 | 12px | `--spacing-12` |
| 18 | 18px | `--spacing-18` |
| 24 | 24px | `--spacing-24` |
| 30 | 30px | `--spacing-30` |
| 48 | 48px | `--spacing-48` |

### Border Radius

| Element | Value |
|---------|-------|
| images | 16px |
| panels | 16px |
| buttons | 8px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| md | `rgba(0, 0, 0, 0.12) 0px 4px 12px 0px, rgba(0, 0, 0, 0.08)...` | `--shadow-md` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 64-80px
- **Card padding:** 30-48px
- **Element gap:** 12-24px

## Components

### Outlined Primary Action Button
**Role:** Primary CTA across the site — used for 'Get Signal', 'Donate to Signal', and most conversion points

White background, 1.5px Signal Blue (#2c6bed) border, Signal Blue text. 8px border-radius. Inter weight 600 at 16px. Horizontal padding 24px, vertical padding 12px. The outlined treatment is deliberate: it reads as an invitation rather than a command, matching the brand's privacy-first, no-pressure voice.

### Filled Teal Action Button
**Role:** Secondary or contextual action — used sparingly for in-feature prompts like the encrypted message reveal

Solid Signal Mist (#a5cad5) or a deeper teal background, white text. 8px border-radius. Inter weight 600 at 16px. Same padding as outlined variant. Used when the button sits on a light blue panel and needs higher contrast than an outlined button can provide.

### Navigation Link
**Role:** Top bar navigation items

Deep Signal (#2942ff) text, Inter weight 400 at 16px, no underline by default. Horizontal spacing of 24px between links. Right-aligned in the header bar. No background, no border — pure text interaction.

### Display Headline
**Role:** Hero and section-opening headlines

Inter weight 800 at 60px (display) or 40px (section heading). Ink (#1b1b1b) color. Line-height 1.07 for display, 1.14 for section headings — the tight leading creates dense, confident type blocks. Left-aligned, no maximum line length enforced.

### Body Paragraph
**Role:** Supporting copy under headlines and in feature descriptions

Inter weight 400 at 16px, Slate (#404654) for secondary body, Ink (#1b1b1b) for primary body. Line-height 1.50. Max-width roughly 480px in feature sections to maintain comfortable measure.

### Hero Phone Mockup Container
**Role:** Product visualization in hero and feature sections

Two angled phone mockups (group video call + chat screen) rendered as PNG on the Signal Sky background. No container border or background — the phones float freely. Soft elevation shadow: 0px 4px 12px rgba(0,0,0,0.12), 0px 0px 2px rgba(0,0,0,0.08).

### Feature Content Panel
**Role:** Right-side visual container in 2-column feature sections

Signal Mist (#a5cad5) or Signal Sky (#9dbbf8) background, 16px border-radius, soft shadow. Contains either a phone mockup, an encrypted message snippet, or the halftone globe illustration. Padding 30–48px.

### Encrypted Message Chip
**Role:** Decorative element demonstrating the encryption feature

Filled teal pill with white monospace text showing a random string (e.g. '7a#v9*ht035v:q*') and a small lock icon. Sits inside a feature panel. Demonstrates the product's core promise through visual proof.

### Halftone Globe Illustration
**Role:** Decorative illustration in the nonprofit/donation section

Earth rendered in concentric Signal Blue dots, with three speech bubbles floating around it. Background is Signal Sky (#9dbbf8). The halftone technique is the site's only decorative illustration style — no other illustration approach is used.

### Footer Link Column
**Role:** Organized link groups in the dark footer

Column heading in Inter weight 600 at 16px in white. Links in Inter weight 400 at 14px in Fog (#e9e9e9). Vertical spacing 12px between links. Five columns: Organization, Download, Social, Help, plus copyright block on the left.

### Signal Mark Lockup
**Role:** Brand identifier in the header

Speech-bubble logo in Deep Signal (#2942ff) followed by 'Signal' wordmark in Inter weight 600 at 20px, Ink (#1b1b1b). Left-aligned in the header bar. The mark is always the speech bubble + text — never the bubble alone.

### Donate Outlined Button
**Role:** Conversion button in the footer illustration section

Same outlined action treatment as the primary CTA: white background, Signal Blue (#2c6bed) border, Signal Blue text. 8px radius, Inter weight 600 at 16px. Sits on the Signal Sky panel.

## Do's and Don'ts

### Do
- Use Inter weight 800 for all headlines — the extreme weight contrast against 400 body text is the typographic signature
- Set line-height to 1.07 for 60px display text and 1.14 for 40px section headings — the tight leading makes headlines feel architectural
- Use outlined buttons (1.5px Signal Blue border, white fill) as the default CTA style — filled buttons only when sitting on a colored panel
- Apply 8px border-radius to all buttons and 16px to all image/panel containers — the radius gap between interactive and visual elements is intentional
- Use Signal Sky (#9dbbf8) for hero washes and Signal Mist (#a5cad5) for secondary panels — alternate the two blue tones to create page rhythm
- Set body text line-height to 1.50 — the generous leading is required for the 16px body to feel readable at the page's comfortable density
- Limit the brand blue to interactive elements, links, and the halftone illustration — never use it for large decorative fills or backgrounds other than the defined panel washes

### Don't
- Don't use filled blue buttons on white backgrounds — outlined buttons are the primary CTA pattern and should not be overridden
- Don't add gradients, drop shadows beyond the defined elevation token, or decorative borders — the design relies on flat color bands for structure
- Don't use colors outside the defined palette — no additional chroma, no warm accents, no status colors beyond the blue family
- Don't set headline line-height above 1.20 — loose leading destroys the dense, confident type character
- Don't use pill-shaped buttons (9999px radius) — the 8px radius is a deliberate choice that distinguishes Signal from typical consumer apps
- Don't add photography, abstract graphics, or illustration styles other than the halftone dot technique — the visual personality is singular
- Don't use Inter at weights other than 400, 600, or 800 — 500 and 700 are absent from the type system for a reason; the three-weight gap is the scale

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Paper | `#f6f6f6` | Page canvas — the base layer everything sits on |
| 1 | White | `#ffffff` | Card and component surfaces — elevated above Paper for product mockups and content blocks |
| 2 | Signal Sky | `#9dbbf8` | Hero wash and large brand-color panels |
| 3 | Signal Mist | `#a5cad5` | Secondary feature panels — a muted teal that breaks the blue rhythm |
| 4 | Twilight | `#3c3744` | Footer ground — the only dark surface, anchoring the page bottom |

## Elevation

- **Product mockup cards, elevated feature panels:** `0px 4px 12px 0px rgba(0, 0, 0, 0.12), 0px 0px 2px 0px rgba(0, 0, 0, 0.08)`

## Imagery

Imagery is dominated by product photography (phone mockups) and a single distinctive illustration style: halftone dot patterns in Signal Blue. The halftone illustrations depict the Earth, speech bubbles, and people rendered as concentric blue dots — a visual nod to printing and the idea of 'signals' traveling. Photography appears only as phone screenshots showing the app UI in real conversations. No lifestyle photography, no abstract gradients, no stock imagery. The visual personality comes entirely from the halftone dot technique and the two product mockup angles. Icons are minimal, line-style, and monochrome.

## Layout

Max-width 1200px centered container with generous side gutters. The page is built as a vertical sequence of full-width color bands rather than a continuous white canvas: white sections, pale blue hero, white feature, muted teal feature, white, pale blue footer-illustration band, dark slate footer. Each band spans edge-to-edge while the content inside remains centered. The hero is a 2-column split — text left (roughly 40%), phone mockup right (60%) with the headline left-aligned and the visual right-aligned, creating an asymmetric opening. Feature sections repeat a 2-column pattern alternating text-left/visual-right and text-right/visual-left, establishing a predictable rhythm. Sections are separated by 64–80px of vertical breathing room. Navigation is a minimal top bar with right-aligned text links and the Signal mark left-aligned. The footer is a 5-column link grid on a dark slate background, with copyright and contact on the left.

## Agent Prompt Guide

## Quick Color Reference
- text: #1b1b1b
- secondary text: #404654
- background: #ffffff (cards), #f6f6f6 (page canvas)
- border: #e9e9e9
- brand blue: #2c6bed
- hero wash: #9dbbf8
- panel wash: #a5cad5
- footer ground: #3c3744
- primary action: no distinct CTA color

## Example Component Prompts

1. **Hero section**: Signal Sky (#9dbbf8) full-bleed background. Two-column layout at 1200px max-width. Left column: 'Speak Freely' display headline at 60px Inter weight 800, #1b1b1b, line-height 1.07. Body text at 16px Inter weight 400, #404654, line-height 1.50, max-width 480px. Outlined action button below: white fill, 1.5px #2c6bed border, #2c6bed text, 8px radius, 12px 24px padding, Inter weight 600 at 16px. Right column: two angled phone mockups with soft shadow (0px 4px 12px rgba(0,0,0,0.12)).

2. **Feature section card**: White background, 1200px container. Left column: 'Share Without Insecurity' heading at 40px Inter weight 800, #1b1b1b, line-height 1.14. Body paragraph at 16px Inter weight 400, #404654, line-height 1.50. Right column: Signal Mist (#a5cad5) panel, 16px radius, 30–48px padding, containing a filled teal encrypted-message chip (monospace white text on teal fill) with a small lock icon.

3. **Footer link column**: Twilight (#3c3744) background. Column heading 'Organization' in Inter weight 600 at 16px, #ffffff. Four links below in Inter weight 400 at 14px, #e9e9e9, 12px vertical spacing between links.

4. **Donate section band**: Signal Sky (#9dbbf8) full-bleed band. Two-column layout: left column is the halftone globe illustration (Signal Blue dots on the sky background, three speech bubbles around the globe), right column has body text in Inter weight 400 at 16px, #404654, followed by an outlined action button ('Donate to Signal') with white fill, #2c6bed border, #2c6bed text, 8px radius.

5. **Navigation bar**: White background, 1200px max-width container, 12px vertical padding. Left: Signal speech-bubble logo in #2942ff + 'Signal' wordmark in Inter weight 600 at 20px, #1b1b1b. Right: six nav links in #2942ff, Inter weight 400 at 16px, 24px horizontal spacing between links. Language selector at the far right with a globe icon.

## Illustration System

Signal uses exactly one illustration style across the entire site: halftone dot patterns. Subjects (Earth, speech bubbles, people) are rendered as concentric circles of Signal Blue dots on a Signal Sky background. Dot sizes vary to create tonal depth — larger dots for darker areas (continents, shadow), smaller dots for lighter areas (oceans, highlight). The effect is deliberately analog, evoking newsprint and printed media. No flat illustrations, no gradient illustrations, no line-art illustrations. When an illustration is needed, it must be halftone dots in Signal Blue (#2c6bed or #2942ff) on Signal Sky (#9dbbf8).

## Button Philosophy

Signal's buttons are outlined by default — a deliberate departure from the filled-CTA convention. The reasoning: the brand's voice is invitational, not promotional. An outlined button asks; a filled button demands. The single filled-button exception is used only when a button sits on a colored panel where an outlined treatment would lack contrast (e.g., the encrypted message chip on a Signal Mist panel). This restraint means the outlined blue button becomes the most recognizable UI element on the site — visitors learn to identify it as the conversion point. Never introduce a third button style.

## Similar Brands

- **Proton (proton.me)** — Same privacy-first restraint, same blue-only accent palette, same generous whitespace, and the same outlined-button CTA pattern
- **Wire (wire.com)** — Similar messaging-product page structure with 2-column hero and phone mockup, same minimal chrome, and comparable blue accent usage
- **Standard Notes (standardnotes.com)** — Same documentation-like restraint, monochrome canvas with a single accent color, and weight 800 headlines on a light background
- **Element (element.io)** — Same open-source nonprofit visual language, dark slate footer with multi-column links, and minimal navigation chrome
- **Mozilla (mozilla.org)** — Same nonprofit internet-org design language, generous vertical rhythm, and the same pattern of alternating white and pale blue content bands

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-signal-blue: #2c6bed;
  --color-deep-signal: #2942ff;
  --color-signal-sky: #9dbbf8;
  --color-signal-mist: #a5cad5;
  --color-ink: #1b1b1b;
  --color-slate: #404654;
  --color-twilight: #3c3744;
  --color-fog: #e9e9e9;
  --color-paper: #f6f6f6;
  --color-white: #ffffff;

  /* Typography — Font Families */
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-system-ui: 'system-ui', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-body: 16px;
  --leading-body: 1.5;
  --text-subheading: 20px;
  --leading-subheading: 1.4;
  --text-heading-sm: 28px;
  --leading-heading-sm: 1.38;
  --text-heading: 40px;
  --leading-heading: 1.14;
  --text-display: 60px;
  --leading-display: 1.07;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-semibold: 600;
  --font-weight-extrabold: 800;

  /* Spacing */
  --spacing-unit: 6px;
  --spacing-12: 12px;
  --spacing-18: 18px;
  --spacing-24: 24px;
  --spacing-30: 30px;
  --spacing-48: 48px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 64-80px;
  --card-padding: 30-48px;
  --element-gap: 12-24px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-2xl: 16px;

  /* Named Radii */
  --radius-images: 16px;
  --radius-panels: 16px;
  --radius-buttons: 8px;

  /* Shadows */
  --shadow-md: rgba(0, 0, 0, 0.12) 0px 4px 12px 0px, rgba(0, 0, 0, 0.08) 0px 0px 2px 0px;

  /* Surfaces */
  --surface-paper: #f6f6f6;
  --surface-white: #ffffff;
  --surface-signal-sky: #9dbbf8;
  --surface-signal-mist: #a5cad5;
  --surface-twilight: #3c3744;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-signal-blue: #2c6bed;
  --color-deep-signal: #2942ff;
  --color-signal-sky: #9dbbf8;
  --color-signal-mist: #a5cad5;
  --color-ink: #1b1b1b;
  --color-slate: #404654;
  --color-twilight: #3c3744;
  --color-fog: #e9e9e9;
  --color-paper: #f6f6f6;
  --color-white: #ffffff;

  /* Typography */
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-system-ui: 'system-ui', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-body: 16px;
  --leading-body: 1.5;
  --text-subheading: 20px;
  --leading-subheading: 1.4;
  --text-heading-sm: 28px;
  --leading-heading-sm: 1.38;
  --text-heading: 40px;
  --leading-heading: 1.14;
  --text-display: 60px;
  --leading-display: 1.07;

  /* Spacing */
  --spacing-12: 12px;
  --spacing-18: 18px;
  --spacing-24: 24px;
  --spacing-30: 30px;
  --spacing-48: 48px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-2xl: 16px;

  /* Shadows */
  --shadow-md: rgba(0, 0, 0, 0.12) 0px 4px 12px 0px, rgba(0, 0, 0, 0.08) 0px 0px 2px 0px;
}
```
