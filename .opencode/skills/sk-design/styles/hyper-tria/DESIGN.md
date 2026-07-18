# Hyper Tria — Style Reference
> chrome monolith in a white gallery

**Theme:** mixed

Hyper Branding operates as an editorial design agency portfolio that swings between theatrical and austere: a full-bleed black hero dominated by massive chrome 3D lettering, then crisp white gallery sections where product photography and oversized Aeonik headlines do the storytelling. The system is deliberately monochrome at its bones — black, white, a single mid-gray — with a vivid red used as deliberate punctuation for navigation, kicker labels, and the agency wordmark, and a vivid green reserved for the rotating brand badge. Typography is the primary surface: a custom geometric sans rendered at whisper-light weights (300) at near-paragraph-line-heights (0.90–1.00), with aggressive negative tracking on display sizes that lets letterforms lock into sculptural compositions. Everything is sharp-edged — zero border-radius across the system — reinforcing the gallery-meets-manifesto posture rather than a soft consumer-product feel.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Ember Red | `#ee3a49` | `--color-ember-red` | Wordmark, navigation text, kicker labels, and the single chromatic accent that makes the otherwise monochrome system read as a brand. The warmth against pure black and white creates editorial urgency without tipping into alarm |
| Hyper Green | `#0fa64b` | `--color-hyper-green` | Reserved for the rotating circular brand badge and high-prominence brand moments. A single saturated spot of color in an otherwise achromatic system — used sparingly so it lands as identity, not decoration |
| Signal Blue | `#007bff` | `--color-signal-blue` | Outlined/ghost action border, image frame accent, and link underline. Functions as the system's cool counterweight to the warm Ember Red — used for bordered interactive elements rather than filled buttons |
| Obsidian | `#000000` | `--color-obsidian` | Page canvas in the hero, primary text color in light sections, and the dominant border color across all UI elements. Carries the heaviest weight in the system — defines edges, type, and spatial structure |
| Paper | `#ffffff` | `--color-paper` | Hairline borders, dividers, input outlines, and card edges on light surfaces. |
| Graphite | `#666666` | `--color-graphite` | Secondary navigation text and border color for tertiary UI elements. The middle tone that prevents the black/white binary from feeling stark in repetitive nav and list contexts |

## Tokens — Typography

### Aeonik — Primary typeface for all display, heading, and body text. Weight 300 at 75–90px with line-heights near 0.90–1.00 creates the system's signature sculptural headlines — letterforms lock together through aggressive negative tracking (-0.053em) rather than spacing. Mid-weight 400–500 handles body and UI at 19–20px with 1.45–1.70 line-height for generous readability. · `--font-aeonik`
- **Substitute:** Inter, Neue Haas Grotesk, or Suisse Int'l
- **Weights:** 300, 400, 500
- **Sizes:** 13, 14, 19, 20, 27, 30, 35, 75, 90
- **Line height:** 0.90, 1.00, 1.11, 1.16, 1.45, 1.48, 1.70, 2.23
- **Letter spacing:** -0.0530em at 75-90px, -0.0200em at 35px, -0.0100em at 27-30px, 0.0100em at 19-20px, 0.0200em at 13px, normal at 14px
- **Role:** Primary typeface for all display, heading, and body text. Weight 300 at 75–90px with line-heights near 0.90–1.00 creates the system's signature sculptural headlines — letterforms lock together through aggressive negative tracking (-0.053em) rather than spacing. Mid-weight 400–500 handles body and UI at 19–20px with 1.45–1.70 line-height for generous readability.

### -apple-system — System fallback for nav items, footer micro-copy, and supporting UI text where the custom Aeonik isn't loaded. Carries no distinctive role — purely a graceful degradation layer. · `--font-apple-system`
- **Substitute:** system-ui, BlinkMacSystemFont, 'Segoe UI'
- **Weights:** 400
- **Sizes:** 14, 28, 30
- **Line height:** 1.50, 1.70
- **Role:** System fallback for nav items, footer micro-copy, and supporting UI text where the custom Aeonik isn't loaded. Carries no distinctive role — purely a graceful degradation layer.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 13px | 1.7 | 0.26px | `--text-caption` |
| subheading | 20px | 1.45 | 0.2px | `--text-subheading` |
| heading-sm | 27px | 1.16 | -0.27px | `--text-heading-sm` |
| heading | 30px | 1.11 | -0.3px | `--text-heading` |
| heading-lg | 35px | 1.11 | -0.7px | `--text-heading-lg` |
| display | 75px | 1 | -3.98px | `--text-display` |
| display-xl | 90px | 0.9 | -4.77px | `--text-display-xl` |

## Tokens — Spacing & Shapes

**Density:** spacious

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 8 | 8px | `--spacing-8` |
| 10 | 10px | `--spacing-10` |
| 18 | 18px | `--spacing-18` |
| 20 | 20px | `--spacing-20` |
| 23 | 23px | `--spacing-23` |
| 25 | 25px | `--spacing-25` |
| 26 | 26px | `--spacing-26` |
| 28 | 28px | `--spacing-28` |
| 44 | 44px | `--spacing-44` |
| 45 | 45px | `--spacing-45` |
| 100 | 100px | `--spacing-100` |
| 110 | 110px | `--spacing-110` |
| 115 | 115px | `--spacing-115` |
| 145 | 145px | `--spacing-145` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 0px |
| cards | 0px |
| images | 0px |
| inputs | 0px |
| buttons | 0px |

### Layout

- **Page max-width:** 1400px
- **Section gap:** 100px
- **Card padding:** 25-28px
- **Element gap:** 10-20px

## Components

### Dark Hero Stage
**Role:** Full-bleed black canvas hosting the agency's signature 3D metallic wordmark

Black (#000000) background at 100% viewport width, no padding constraints. The chrome 3D 'Hyper Branding' text fills the frame — Aeonik weight 300 at 90px+ rendered as a reflective metallic treatment. A small circular rotating badge (white #ffffff fill, black rotating text, green #0fa64b accent) sits in the lower-right area. Navigation floats in white text at the top with thin right-arrows separating items. This is the system's most theatrical element — every other section is deliberately quiet in contrast.

### Light Editorial Section
**Role:** White-background work showcase with alternating image+text layout

Full-bleed white (#ffffff) background, 100px section gap top/bottom. Content constrained to ~1400px max-width, centered. Two-column layout: left = product/project photograph (square or 4:5 aspect, no border-radius), right = stacked content block. Kicker label ('Your Breakfast Box') in Aeonik 20px weight 400, then oversized headline ('AN OUT OF THE BOX CONCEPT') in Aeonik 35px weight 400 with -0.7px letter-spacing, black #000000. Generous vertical breathing room between kicker and headline (~20-28px).

### Light Navigation Bar
**Role:** Sticky top navigation for content sections

White #ffffff background, no visible border. Centered or left-aligned wordmark 'Hyper Branding' in Ember Red (#ee3a49) at 14-20px Aeonik weight 400. Nav items ('Agency', 'Works', 'Contact') in Ember Red, separated by 18-20px horizontal gap. Language toggle ('En/Gr') right-aligned in black. No background fill on nav items — color does the hierarchy work.

### Dark Navigation Bar
**Role:** Navigation variant for the black hero stage

Inverted from light nav: white #ffffff text on transparent/black background. Same Aeonik 14px weight 400 treatment. Thin right-arrows (→) between items as text characters rather than icons. The wordmark 'Main' appears with an arrow separator before the rest of the nav.

### Outlined Arrow Link
**Role:** Primary project-level call-to-action

Thin black #000000 L-shaped line arrow (90-degree turn) acting as a 'view project' affordance. No text label, no fill, no border-radius. Approximately 40-50px wide, 2px stroke. Sits below the headline in editorial sections. The absence of a traditional button is deliberate — the system treats navigation as typographic, not interactive-component-heavy.

### Rotating Circular Brand Badge
**Role:** Persistent brand identifier across the hero and footer

Small circular element (~80-100px diameter), white #ffffff background, black #000000 text reading 'Hyper Branding' repeated around the circumference. Center contains a bold black 'H' monogram. Green #0fa64b appears as a single accent element. Sits as a fixed or floating element rather than in a standard flow position. Functions as a signature mark, not a navigation element.

### Kicker Label
**Role:** Project category or section identifier above headlines

Aeonik 20px weight 400, black #000000, normal tracking. Sits 20-28px above the main headline. Functions as editorial pre-title — short, descriptive, never decorative. No uppercase, no color variation from body text.

### Image Frame
**Role:** Product/project photography container

Raw image display, no border-radius, no border, no shadow. Images are full-color product photography on clean/neutral studio backgrounds. Signal Blue #007bff occasionally appears as a 4px border on portfolio thumbnails. Images sit at 1:1 or 4:5 aspect ratios, contained within the section's max-width.

### Section Divider
**Role:** Implicit separator between light and dark sections

No visible divider element. The system transitions from black to white or white to black through direct color contrast — the section gap (100px) and background color change are the only separators. This seamlessness is a signature choice: the site reads as a continuous flow rather than a stacked page.

## Do's and Don'ts

### Do
- Use Aeonik weight 300 at 75-90px with line-height 0.90-1.00 and letter-spacing -4px to -5px for all display headlines
- Maintain 100px vertical gaps between major sections to preserve the gallery's breathing rhythm
- Set border-radius to 0px on all cards, buttons, tags, inputs, and image containers
- Use Ember Red (#ee3a49) exclusively for the wordmark, navigation text, and kicker labels — never as a background fill
- Transition between black (#000000) and white (#ffffff) section backgrounds as the primary spatial separator instead of rules or shadows
- Keep body text at 19px Aeonik weight 400 with line-height 1.48 and slight positive tracking (0.19px) for editorial readability
- Render the hero wordmark as a 3D metallic/chrome treatment when possible — the reflective surface is the system's most recognizable signature

### Don't
- Never add border-radius to any element — the sharp-edged geometry is a defining system constraint
- Never use a filled button background as a CTA — the system signals actions through outlined/ghost borders or typographic arrows only
- Never use shadows or box-elevation for depth — rely on background color contrast and typographic scale instead
- Never apply Ember Red (#ee3a49) to large background fills — it is an accent color for text and small marks only
- Never set display headline letter-spacing to 0 or positive values — the aggressive negative tracking on large type is signature
- Never use multiple chromatic colors in the same view — the system is monochrome with single-color punctuation per section
- Never use illustrations, abstract graphics, or decorative imagery — product photography and 3D type are the only visual elements

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Hero Canvas | `#000000` | Full-bleed black stage for the 3D metallic wordmark hero |
| 2 | Content Canvas | `#ffffff` | Primary light-mode surface for editorial work showcase sections |
| 3 | Brand Badge | `#ffffff` | Circular floating brand identifier surface |

## Elevation

The system uses zero shadows and zero border-radius. Depth is communicated exclusively through typographic scale, background color contrast (black ↔ white), and the 3D metallic treatment of the hero wordmark. This flatness is a deliberate editorial-gallery choice — shadows would soften the manifesto-like directness of the layout.

## Imagery

The visual language splits into two distinct registers: (1) the hero uses a photorealistic 3D metallic/chrome render of the 'Hyper Branding' wordmark as the singular image element — oversized, reflective, treated as sculpture rather than graphic. (2) Content sections use clean product photography on neutral studio backgrounds (the visible example is a kraft cardboard box on warm gray), cropped tight with no lifestyle context — the object IS the subject. There are no illustrations, no abstract graphics, no decorative imagery. Photography is product-focused, high-key, contained within defined rectangular frames with zero border-radius. The role of imagery is showcase, not atmosphere — each image is a portfolio piece, not a mood-setter.

## Layout

The page operates on a full-bleed model with constrained content: the black hero is edge-to-edge with no max-width constraint, while content sections are centered within a ~1400px container. The hero is theatrical and viewport-filling; subsequent sections shift to a restrained two-column editorial pattern (image left, text right) with generous 100px section gaps creating deliberate breathing room. Navigation is a thin top bar — sticky or static — that adapts its color treatment (white on black / red on white) depending on the section's background. The overall rhythm is: dramatic entrance → quiet gallery → dramatic exit, with the alternating black/white sections creating implicit visual dividers rather than using rules or borders. Grid usage is minimal — the two-column work showcase is the primary structural pattern, with no card grids, pricing tables, or multi-column feature layouts visible.

## Agent Prompt Guide

**Quick Color Reference**
- text: #000000
- background: #ffffff (content) / #000000 (hero)
- border: #000000 (primary) / #666666 (secondary)
- accent (wordmark, nav, kicker): #ee3a49
- badge accent: #0fa64b
- primary action: #007bff (outlined action border)

**Example Component Prompts**

1. *Create a dark hero stage:* Full-bleed #000000 background. Render the wordmark 'Hyper Branding' in Aeonik weight 300 at 90px, line-height 0.90, letter-spacing -4.77px, as a 3D chrome/metallic treatment. Place a circular brand badge (~90px diameter, #ffffff fill, rotating black 'Hyper Branding' text around circumference, bold black 'H' monogram center, #0fa64b accent) in the lower-right quadrant. Add a white top nav with items separated by thin → characters.

2. *Create a light editorial work section:* White #ffffff background, 100px padding top/bottom. Two-column layout constrained to 1400px max-width. Left column: product photograph (1:1 aspect, no border-radius, no shadow, clean studio background). Right column: kicker label 'Your Breakfast Box' in Aeonik 20px weight 400, #000000, 28px below it a headline 'AN OUT OF THE BOX CONCEPT' in Aeonik 35px weight 400, letter-spacing -0.7px, #000000. Below the headline at 44px: a thin black L-shaped arrow line (~50px wide, 2px stroke, no fill) as the project link.

3. *Create the light navigation bar:* White #ffffff background, no border. Left-aligned wordmark 'Hyper Branding' in #ee3a49, Aeonik 20px weight 400. Center: nav items ('Agency', 'Works', 'Contact') in #ee3a49, Aeonik 14px weight 400, 18px horizontal gap between items. Right-aligned: language toggle 'En/Gr' in #000000, Aeonik 14px weight 400.

4. *Create an outlined/ghost action link:* No background fill. 1px solid #007bff border. Zero border-radius. Aeonik 14px weight 500, #007bff text. Padding 8px 18px. Functions as a ghost/outlined interactive element, not a filled CTA.

5. *Create a rotating brand badge:* 90px diameter circle, #ffffff background. Inner ring: black #000000 text 'Hyper Branding' repeated, set in a circular path at 11px Aeonik weight 400. Center: bold 'H' monogram in Aeonik weight 500, 24px, #000000. Single #0fa64b green dot or accent mark as a visual signature element.

## Typographic Signature

The defining typographic move is rendering Aeonik at weight 300 (light) at near-paragraph line-heights (0.90-1.00). Most design systems reserve weight 300 for secondary or elegant contexts — here it is the PRIMARY headline weight, used at 75-90px. Combined with letter-spacing of -0.053em (-4 to -5px at display sizes), the letterforms compress into a single sculptural mass. This anti-convention choice (light weight + massive size + tight tracking) is the opposite of the standard 'bold headlines shout' pattern — instead the headlines whisper at architectural scale, and the chrome 3D rendering in the hero amplifies that whisper into a physical object.

## Similar Brands

- **Pentagram** — Same oversized display typography as primary visual element, zero border-radius geometry, and the editorial two-column image+text work showcase pattern
- **Manual (design agency)** — Same generous 100px+ section spacing, monochrome canvas with single warm accent color for navigation and wordmark, and the sculptural approach to large-scale headlines
- **Locomotive** — Same black/white alternating section structure used as implicit divider, and the restrained typographic-first interface with minimal UI componentry
- **Studio Dumbar** — Same custom geometric sans at light weights for display, and the agency-portfolio rhythm that alternates theatrical moments with quiet gallery sections
- **Instrument** — Same sharp-edged zero-radius geometry, dark-to-light section transitions, and the confidence to let large-scale typography carry the entire visual system

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-ember-red: #ee3a49;
  --color-hyper-green: #0fa64b;
  --color-signal-blue: #007bff;
  --color-obsidian: #000000;
  --color-paper: #ffffff;
  --color-graphite: #666666;

  /* Typography — Font Families */
  --font-aeonik: 'Aeonik', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-apple-system: '-apple-system', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 13px;
  --leading-caption: 1.7;
  --tracking-caption: 0.26px;
  --text-subheading: 20px;
  --leading-subheading: 1.45;
  --tracking-subheading: 0.2px;
  --text-heading-sm: 27px;
  --leading-heading-sm: 1.16;
  --tracking-heading-sm: -0.27px;
  --text-heading: 30px;
  --leading-heading: 1.11;
  --tracking-heading: -0.3px;
  --text-heading-lg: 35px;
  --leading-heading-lg: 1.11;
  --tracking-heading-lg: -0.7px;
  --text-display: 75px;
  --leading-display: 1;
  --tracking-display: -3.98px;
  --text-display-xl: 90px;
  --leading-display-xl: 0.9;
  --tracking-display-xl: -4.77px;

  /* Typography — Weights */
  --font-weight-light: 300;
  --font-weight-regular: 400;
  --font-weight-medium: 500;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-18: 18px;
  --spacing-20: 20px;
  --spacing-23: 23px;
  --spacing-25: 25px;
  --spacing-26: 26px;
  --spacing-28: 28px;
  --spacing-44: 44px;
  --spacing-45: 45px;
  --spacing-100: 100px;
  --spacing-110: 110px;
  --spacing-115: 115px;
  --spacing-145: 145px;

  /* Layout */
  --page-max-width: 1400px;
  --section-gap: 100px;
  --card-padding: 25-28px;
  --element-gap: 10-20px;

  /* Named Radii */
  --radius-tags: 0px;
  --radius-cards: 0px;
  --radius-images: 0px;
  --radius-inputs: 0px;
  --radius-buttons: 0px;

  /* Surfaces */
  --surface-hero-canvas: #000000;
  --surface-content-canvas: #ffffff;
  --surface-brand-badge: #ffffff;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-ember-red: #ee3a49;
  --color-hyper-green: #0fa64b;
  --color-signal-blue: #007bff;
  --color-obsidian: #000000;
  --color-paper: #ffffff;
  --color-graphite: #666666;

  /* Typography */
  --font-aeonik: 'Aeonik', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-apple-system: '-apple-system', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 13px;
  --leading-caption: 1.7;
  --tracking-caption: 0.26px;
  --text-subheading: 20px;
  --leading-subheading: 1.45;
  --tracking-subheading: 0.2px;
  --text-heading-sm: 27px;
  --leading-heading-sm: 1.16;
  --tracking-heading-sm: -0.27px;
  --text-heading: 30px;
  --leading-heading: 1.11;
  --tracking-heading: -0.3px;
  --text-heading-lg: 35px;
  --leading-heading-lg: 1.11;
  --tracking-heading-lg: -0.7px;
  --text-display: 75px;
  --leading-display: 1;
  --tracking-display: -3.98px;
  --text-display-xl: 90px;
  --leading-display-xl: 0.9;
  --tracking-display-xl: -4.77px;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-18: 18px;
  --spacing-20: 20px;
  --spacing-23: 23px;
  --spacing-25: 25px;
  --spacing-26: 26px;
  --spacing-28: 28px;
  --spacing-44: 44px;
  --spacing-45: 45px;
  --spacing-100: 100px;
  --spacing-110: 110px;
  --spacing-115: 115px;
  --spacing-145: 145px;
}
```
