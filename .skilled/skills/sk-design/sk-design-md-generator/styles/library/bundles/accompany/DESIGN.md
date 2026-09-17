# ACCOMPANY — Style Reference
> Editorial broadside on bone canvas. A monochrome typographic system where a 80px light serif headline does all the emotional work and everything else stays out of its way.

**Theme:** light

ACCOMPANY runs on a monochrome editorial system: pure black on bone white, with no shadows, no gradients, no accent color. A custom light serif (Items-Light) carries the entire brand voice at 80px display scale with aggressive 0.90 line-height, while a medium grotesque (SyndicatGroteskMedium) handles everything from 44px subheads down to 16px body copy. Hierarchy is built entirely through type size, weight contrast (light serif vs medium grotesque), and whitespace — the system behaves like a museum monograph or fashion broadside, assuming the work itself provides the color. Components are architectural skeletons: hairline rules, uppercase micro-labels, generous gutters, and flat image frames. Color enters only through photography.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Bone White | `#ffffff` | `--color-bone-white` | Page canvas, all surface backgrounds, image negative space |
| Obsidian Ink | `#000000` | `--color-obsidian-ink` | All text, headings, nav links, button labels, hairline borders, icon strokes, body borders |
| Carbon Edge | `#0a0a0a` | `--color-carbon-edge` | Near-black border variant for subtle structural dividers, indistinguishable from ink at reading distance |

## Tokens — Typography

### Items-Light — Signature display headline. The custom light serif with extremely tight 0.90 line-height and slight negative tracking — its high stroke contrast and light weight create editorial gravitas without shouting. No other element competes at this scale. · `--font-items-light`
- **Substitute:** Cormorant Garamond Light, Playfair Display Light, or Libre Caslon Text Light
- **Weights:** 400
- **Sizes:** 80px
- **Line height:** 0.90
- **Letter spacing:** -0.0200em (-1.6px at 80px)
- **Role:** Signature display headline. The custom light serif with extremely tight 0.90 line-height and slight negative tracking — its high stroke contrast and light weight create editorial gravitas without shouting. No other element competes at this scale.

### SyndicatGroteskMedium — Primary workhorse for nav, body, subheadings, and link text. The medium-weight grotesque with consistent -0.03em tracking acts as the typographic foil to the light serif — denser, more utilitarian, more present. At 44px it serves as secondary headlines; at 16-18px it carries running text and UI labels. · `--font-syndicatgroteskmedium`
- **Substitute:** Inter Medium, General Sans Medium, or Söhne Medium
- **Weights:** 400
- **Sizes:** 16px, 18px, 44px
- **Line height:** 1.00, 1.10, 1.20
- **Letter spacing:** -0.0300em (-0.48px at 16px, -0.54px at 18px, -1.32px at 44px)
- **Role:** Primary workhorse for nav, body, subheadings, and link text. The medium-weight grotesque with consistent -0.03em tracking acts as the typographic foil to the light serif — denser, more utilitarian, more present. At 44px it serves as secondary headlines; at 16-18px it carries running text and UI labels.

### Times — System serif fallback appearing in link contexts. Subordinate to Items-Light — used when the custom font fails to load, maintaining a serif continuity. · `--font-times`
- **Substitute:** Times New Roman, system serif
- **Weights:** 400
- **Sizes:** 16px
- **Line height:** 1.00, 1.20
- **Role:** System serif fallback appearing in link contexts. Subordinate to Items-Light — used when the custom font fails to load, maintaining a serif continuity.

### Arial — Micro-label workhorse. Used for uppercase project category tags, footer micro-labels, and small UI annotations. The system-sans fallback ensures universal availability for these tiny utility labels. · `--font-arial`
- **Substitute:** Arial, Helvetica, system sans-serif
- **Weights:** 400
- **Sizes:** 13px
- **Line height:** 1.20
- **Role:** Micro-label workhorse. Used for uppercase project category tags, footer micro-labels, and small UI annotations. The system-sans fallback ensures universal availability for these tiny utility labels.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 13px | 1.2 | — | `--text-caption` |
| body-sm | 16px | 1 | -0.48px | `--text-body-sm` |
| subheading | 18px | 1.2 | -0.54px | `--text-subheading` |
| heading | 44px | 1.1 | -1.32px | `--text-heading` |
| display | 80px | 0.9 | -1.6px | `--text-display` |

## Tokens — Spacing & Shapes

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 10 | 10px | `--spacing-10` |
| 14 | 14px | `--spacing-14` |
| 21 | 21px | `--spacing-21` |
| 35 | 35px | `--spacing-35` |
| 71 | 71px | `--spacing-71` |

### Border Radius

| Element | Value |
|---------|-------|
| all | 0px |
| cards | 0px |
| images | 0px |
| buttons | 0px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 71px
- **Card padding:** 14px
- **Element gap:** 10px

## Components

### Editorial Display Headline
**Role:** Hero and section-opening headlines

Items-Light, 80px, line-height 0.90, letter-spacing -1.6px, color #000000. Sets in 2-3 lines on a wide left-aligned column. No max-width on the type itself — the surrounding layout determines wrapping. This is the only element with real expressive weight.

### Top Navigation Bar
**Role:** Primary site navigation

Minimal two-anchor layout: brand wordmark 'ACCOMPANY' top-left, nav items WORK / ABOUT / SERVICES / CONTACT top-right. SyndicatGroteskMedium 16px, uppercase, letter-spacing -0.48px, #000000. No background, no border, no shadow. Nav items separated by 35px gap. Sits directly on the white canvas.

### Hero Image Frame
**Role:** Full-bleed project imagery in carousel

Large landscape image frame with 0px radius, no border, no shadow. Image fills the frame edge-to-edge. Flanked by small arrow controls (← →) positioned at vertical center on the left and right edges. Counter text '1/6' in 13px Arial below-left of frame. Images are atmospheric, cinematic, and carry all the color in the system.

### Project Card
**Role:** Work samples in grid layouts

Square or landscape image with 0px radius, no border. Below image: uppercase project title in Arial 13px, followed by short descriptive paragraph in SyndicatGroteskMedium 16px. No card background, no padding box — the image and text sit directly on the white page. A hairline #000000 border separates columns at 1px.

### Hairline Divider
**Role:** Section separation

1px solid #000000 horizontal rule spanning the full content width. Used between major page sections (after hero, before footer). No margin or padding — the line is the only visual element.

### Uppercase Section Label
**Role:** Project category tags and micro-headings

Arial 13px, weight 400, #000000, uppercase. No letter-spacing adjustment. Sets tight against the content it labels. Used for 'THE BRAND IDENTITY: SUMM', 'GOOD DESIGN AWARDS', 'AGDA AWARDS' style project metadata.

### Body Text Block
**Role:** Running paragraph copy and editorial statements

SyndicatGroteskMedium 16px, line-height 1.20, letter-spacing -0.48px, #000000. Measures constrained to ~50-60ch for readability. Left-aligned. Weight 400 medium grotesque carries enough presence to stand alone without serif support.

### Footer Block
**Role:** Site footer with address, social links, and back-to-top

Divided into three columns: address (left, uppercase Arial 13px: SUITE 507 / 46 KIPPAX STREET / SURRY HILLS NSW 2010), social links (center, uppercase Arial 13px: EMAIL / INSTAGRAM / LINKEDIN / BEHANCE), and BACK TO TOP (right, uppercase Arial 13px). All #000000 on #ffffff, no borders, no decorative elements.

### CTA Headline Block
**Role:** Contact/conversion closing sections

Items-Light 80px, #000000, left-aligned, setting in 2 lines. Pattern: 'We'd love to talk about how we can accompany you. Get in touch.' Functions as a typographic CTA without a button — the headline IS the call to action.

### Arrow Navigation Control
**Role:** Carousel prev/next controls

Small ← and → glyphs in #000000, positioned absolutely at vertical center on left/right edges of the hero image frame. No button background, no border, no padding. The arrow is the only affordance — minimal and unadorned.

## Do's and Don'ts

### Do
- Use #000000 on #ffffff exclusively — no accent colors, no grays, no tints for UI elements
- Set display headlines at 80px Items-Light with line-height 0.90 and letter-spacing -1.6px
- Separate sections with 1px solid #000000 hairline rules, never with background color changes or shadows
- Use uppercase Arial 13px for all project metadata, category tags, and footer micro-labels
- Apply 0px border-radius to every image, card, and button — the system is architecturally sharp-edged
- Give images generous breathing room: 71px section gap, 10-14px between image and its caption
- Let the grotesque (SyndicatGroteskMedium) handle everything below display scale — body, nav, subheads all use the same family

### Don't
- Never introduce color, gradients, or background tints — color lives only in photography
- Never use shadows, glows, or any simulated elevation on cards, buttons, or images
- Never use rounded corners on any element — cards, buttons, and image frames are all 0px radius
- Never set body copy in the display serif — Items-Light is reserved for 80px headlines only
- Never use color-coded semantic states (no green for success, no red for error) — use the hairline border and typography to convey state
- Never fill buttons with backgrounds — navigation and actions are typographic, not pill-shaped UI controls
- Never crowd the layout — sections need 71px vertical breathing room, images need full edge-to-edge presence

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Bone Canvas | `#ffffff` | Page background — the only surface in the system |

## Elevation

The system has zero elevation. No shadows, no drop shadows, no box-shadows, no border-shadows. Hierarchy is achieved through type scale, whitespace, and hairline 1px borders — never through simulated depth. This is a deliberate flat-design conviction: the work sits on the page as a printed broadsheet, not a skeuomorphic product.

## Imagery

Photography is the sole carrier of color in this system. Imagery is atmospheric, cinematic, and editorial — dreamy landscapes with gradient skies (pink-to-gold sunsets, violet horizons), rendered with a soft painterly quality. Images are treated full-bleed within their frames with 0px radius — no masks, no rounded crops, no decorative frames. They function as large editorial plates, not thumbnails. Product or work samples appear as clean, flat digital artifacts (screenshots, documents) without lifestyle staging. The image-to-text ratio is heavy: each major project or work sample gets a large hero image, not a small thumbnail.

## Layout

Max-width ~1200px centered container, fully edge-to-edge in the viewport. The page model is a single-column vertical scroll: display headline → hero image carousel → editorial statement paragraph → 3-column project grid → closing CTA headline → footer. The hero is left-aligned text over a large centered image frame (text doesn't overlay the image — they stack). Navigation is a single top bar with brand left, links right, no sticky behavior evident. Content blocks are separated by 1px hairline rules and 71px vertical gaps. The grid below the hero uses 3 equal columns with hairline vertical dividers between them. The layout breathes — generous margins on all sides, no full-bleed background sections, everything sits on the bone-white canvas.

## Agent Prompt Guide

**Quick Color Reference**
- text: #000000
- background: #ffffff
- border: #000000 (1px hairline)
- accent: none — monochrome system
- primary action: no distinct CTA color

**3-5 Example Component Prompts**

1. **Editorial Display Headline**: 'Your ambition defines the destination.' Set in Items-Light (or Cormorant Garamond Light substitute), 80px, line-height 0.90, letter-spacing -1.6px, color #000000, left-aligned on #ffffff canvas. Two to three lines, no max-width constraint on the type itself.

2. **Project Card with Image**: Landscape image at 0px radius, no border, no shadow, full-bleed within its column. Below image: uppercase Arial 13px label 'THE BRAND IDENTITY: SUMM' in #000000, then a 2-3 line description in SyndicatGroteskMedium (or Inter Medium substitute) 16px, line-height 1.20, letter-spacing -0.48px. Cards separated by 1px #000000 hairline rules, no card backgrounds.

3. **Top Navigation Bar**: Brand wordmark 'ACCOMPANY' left-aligned, nav items 'WORK / ABOUT / SERVICES / CONTACT' right-aligned, all in SyndicatGroteskMedium 16px uppercase, #000000, 35px gap between nav items, no background, no border, sitting directly on #ffffff canvas with 10px top/bottom padding.

No distinct primary action color was observed; use the extracted neutral button treatments instead of inventing a filled CTA color.

5. **Footer Block**: Three columns — left: uppercase Arial 13px address 'SUITE 507 / 46 KIPPAX STREET / SURRY HILLS NSW 2010'; center: uppercase Arial 13px social links 'EMAIL / INSTAGRAM / LINKEDIN / BEHANCE'; right: uppercase Arial 13px 'BACK TO TOP'. All #000000 on #ffffff, no borders, 10px row gap.

## Similar Brands

- **Pentagram** — Same editorial broadside aesthetic — large light serif headlines, monochrome palette, hairline rules, generous whitespace, photography as the only color
- **Wieden+Kennedy** — Agency portfolio language with stark typographic hierarchy, minimal chrome, and large-format atmospheric imagery
- **Collins (formerly Brand New)** — Brand studio site with custom serif display type, absolute minimal UI, and content-forward monochrome layout
- **Studio Dumbar** — Editorial portfolio with sharp 0px-radius image frames, hairline dividers, and a single accent-free typographic system
- **Manual (manualcreative.com)** — Monochrome agency site with oversized light-weight serif headlines and zero decorative UI elements

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-bone-white: #ffffff;
  --color-obsidian-ink: #000000;
  --color-carbon-edge: #0a0a0a;

  /* Typography — Font Families */
  --font-items-light: 'Items-Light', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-syndicatgroteskmedium: 'SyndicatGroteskMedium', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-times: 'Times', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-arial: 'Arial', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 13px;
  --leading-caption: 1.2;
  --text-body-sm: 16px;
  --leading-body-sm: 1;
  --tracking-body-sm: -0.48px;
  --text-subheading: 18px;
  --leading-subheading: 1.2;
  --tracking-subheading: -0.54px;
  --text-heading: 44px;
  --leading-heading: 1.1;
  --tracking-heading: -1.32px;
  --text-display: 80px;
  --leading-display: 0.9;
  --tracking-display: -1.6px;

  /* Typography — Weights */
  --font-weight-regular: 400;

  /* Spacing */
  --spacing-10: 10px;
  --spacing-14: 14px;
  --spacing-21: 21px;
  --spacing-35: 35px;
  --spacing-71: 71px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 71px;
  --card-padding: 14px;
  --element-gap: 10px;

  /* Named Radii */
  --radius-all: 0px;
  --radius-cards: 0px;
  --radius-images: 0px;
  --radius-buttons: 0px;

  /* Surfaces */
  --surface-bone-canvas: #ffffff;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-bone-white: #ffffff;
  --color-obsidian-ink: #000000;
  --color-carbon-edge: #0a0a0a;

  /* Typography */
  --font-items-light: 'Items-Light', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-syndicatgroteskmedium: 'SyndicatGroteskMedium', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-times: 'Times', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-arial: 'Arial', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 13px;
  --leading-caption: 1.2;
  --text-body-sm: 16px;
  --leading-body-sm: 1;
  --tracking-body-sm: -0.48px;
  --text-subheading: 18px;
  --leading-subheading: 1.2;
  --tracking-subheading: -0.54px;
  --text-heading: 44px;
  --leading-heading: 1.1;
  --tracking-heading: -1.32px;
  --text-display: 80px;
  --leading-display: 0.9;
  --tracking-display: -1.6px;

  /* Spacing */
  --spacing-10: 10px;
  --spacing-14: 14px;
  --spacing-21: 21px;
  --spacing-35: 35px;
  --spacing-71: 71px;
}
```
