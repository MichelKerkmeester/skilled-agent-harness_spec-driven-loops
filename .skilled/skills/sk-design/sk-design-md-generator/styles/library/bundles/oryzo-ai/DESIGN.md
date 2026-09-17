# ORYZO AI — Style Reference
> Darkroom product editorial. A lone object floating in warm darkness, cream typography the only decoration.

**Theme:** dark

The ORYZO visual system treats a single product object like a museum artifact: full-bleed warm-dark canvas, cream typography floating in generous negative space, and zero UI chrome competing with the form. Every text element is uppercase at weight 500, with the sole exception of body copy at 29px/400 which is the system's only conversational voice. A single vivid orange appears only for credit lines and the studio link — never for buttons or CTAs — earning its rarity. The layout alternates between two modes: photographic hero (the product in context with tools and materials) and void-mode reveal (the product isolated on warm dark), connected by hairline dashed dividers and pill-shaped controls.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Warm Cream | `#ffedd7` | `--color-warm-cream` | Light text on dark surfaces, inverse labels, and high-contrast captions. |
| Walnut Shadow | `#100904` | `--color-walnut-shadow` | Page canvas and deepest background — warm near-black, not pure black. The void behind every product reveal |
| Bark Brown | `#382416` | `--color-bark-brown` | Elevated surface and filled button background — the one chromatic step above the canvas, used for the single solid CTA |
| Cork Border | `#40372e` | `--color-cork-border` | Hairline dividers, dashed section separators, subtle container borders — warmer than the canvas by one step |
| Driftwood | `#6c5f51` | `--color-driftwood` | Mid-tone warm gray for secondary dividers and muted structural elements — the bridge between Bark and Cream |
| Ember Accent | `#dc5000` | `--color-ember-accent` | Orange text accent for links, tags, and emphasized short phrases. |
| Pure Black | `#000000` | `--color-pure-black` | SVG icon fills and decorative vector elements only — never used as a background or text color |

## Tokens — Typography

### halyard-display-variable — The only typeface. Weight 500 at 51px drives display headlines with extreme uppercase confidence; the same family at weight 400 / 29px becomes the system's sole mixed-case body voice. Letter-spacing stays normal — the geometric forms do the work without tightening. Substitute: 'Inter', 'Söhne', or 'Neue Haas Grotesk' for close structural match. · `--font-halyard-display-variable`
- **Substitute:** Inter or Söhne
- **Weights:** 400, 500
- **Sizes:** 8, 10, 12, 14, 15, 18, 24, 29, 41, 51px
- **Line height:** 0.90–1.26
- **Letter spacing:** normal across all sizes — no negative tracking even at display scale, the font's geometry handles visual weight without compression
- **OpenType features:** `"ss01" on`
- **Role:** The only typeface. Weight 500 at 51px drives display headlines with extreme uppercase confidence; the same family at weight 400 / 29px becomes the system's sole mixed-case body voice. Letter-spacing stays normal — the geometric forms do the work without tightening. Substitute: 'Inter', 'Söhne', or 'Neue Haas Grotesk' for close structural match.

### Arial — System fallback for micro-legal labels (8px uppercase credits like "* ADOBE ILLUSTRATOR"). Not a design choice — a necessity for system-rendered disclaimers. · `--font-arial`
- **Substitute:** system-ui
- **Weights:** 400, 500
- **Sizes:** 8px
- **Line height:** 1.20
- **Role:** System fallback for micro-legal labels (8px uppercase credits like "* ADOBE ILLUSTRATOR"). Not a design choice — a necessity for system-rendered disclaimers.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| subheading | 18px | 1 | — | `--text-subheading` |
| heading-sm | 24px | 1.09 | — | `--text-heading-sm` |
| body | 29px | 1.26 | — | `--text-body` |
| heading | 41px | 0.9 | — | `--text-heading` |
| display | 51px | 0.9 | — | `--text-display` |

## Tokens — Spacing & Shapes

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 6 | 6px | `--spacing-6` |
| 8 | 8px | `--spacing-8` |
| 9 | 9px | `--spacing-9` |
| 10 | 10px | `--spacing-10` |
| 12 | 12px | `--spacing-12` |
| 14 | 14px | `--spacing-14` |
| 18 | 18px | `--spacing-18` |
| 24 | 24px | `--spacing-24` |
| 31 | 31px | `--spacing-31` |
| 41 | 41px | `--spacing-41` |
| 45 | 45px | `--spacing-45` |
| 68 | 68px | `--spacing-68` |
| 204 | 204px | `--spacing-204` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 12px |
| inputs | 0px |
| full-round | 9999px |
| buttons-pill | 36px |
| buttons-outlined | 22.5px |

### Layout

- **Card padding:** 24px
- **Element gap:** 18px

## Components

### Pill Button (Filled)
**Role:** Primary solid CTA — used once on the page for the Lusion studio link

36px border-radius, Bark Brown (#382416) background, Warm Cream (#ffedd7) text, 14px 24px vertical/horizontal padding, weight 500, uppercase, 8–14px size. The only filled action surface in the system — its rarity is the signal.

### Outlined Ghost Button
**Role:** Secondary action or decorative button — cream border on transparent fill

22.5px border-radius, transparent background, 1px Warm Cream border, Warm Cream text, 7.5px vertical padding, 0px horizontal padding, weight 500, uppercase, 8–14px. Border does the work; no fill needed.

### Underline Text Link
**Role:** Inline links and navigation items — borderless, relying on underline

0px radius, transparent background, Warm Cream text, 0px padding, weight 500, uppercase, 12–14px. The default interaction — no container, just text with an underline indicator.

### Input Field (Underline Only)
**Role:** Minimal form input — bottom border only, no full outline

0px radius, transparent background, 1px Warm Cream bottom border, Warm Cream text, 1px 2px padding, 36px right padding for an inline action. The form mirrors the ghost-button restraint — no boxes, just a line.

### Fixed Top Navigation
**Role:** Persistent site navigation — minimal, 4 items, uppercase micro-type

Logo wordmark "ORYZO" left-aligned in Warm Cream at 12–14px weight 500 uppercase. Right-aligned nav items: INTRO (with dashed underline indicator for active), FEATURES, PRODUCT, CONTACT — all 12px weight 500 uppercase, Warm Cream. Transparent background over the hero photograph.

### Vertical Sidebar Label
**Role:** Edge branding — vertical text running down the right margin

Rotated 90° text "ORYZO 1-MODEL" in Warm Cream, 10–12px uppercase, sits flush right. Functions as a product serial number — a physical-product artifact translated to UI.

### Logo Wordmark
**Role:** Brand identifier — the only graphical mark

"ORYZO" in Halyard Display Variable weight 500 uppercase, up to 51px+ at display scale with 0.9 line-height. Used at two sizes: navigation lockup (12–14px) and hero lockup (51px+). No icon, no symbol — pure typographic identity.

### Hero Overlay Info Card
**Role:** Semi-transparent attribution card in the hero

12px border-radius, semi-transparent Warm Cream or dark fill with low opacity, contains uppercase heading "DESIGNED BY LUSION, THE AWARD-WINNING DESIGN STUDIO." plus a dashed divider and body text. Overlays the hero photograph bottom-left.

### Product Reveal Section
**Role:** Full-viewport void-mode section — centered 3D render with flanking text

100vh height, Walnut Shadow (#100904) background, centered 3D product render, left-aligned heading at 41px uppercase "ISN'T JUST A COASTER.", right-aligned body copy at 29px weight 400 mixed-case. The signature layout pattern — three columns, generous gutters.

### Section Divider (Dashed Hairline)
**Role:** Visual separator between content blocks

1px dashed line in Cork Border (#40372e) or Driftwood (#6c5f51). Used sparingly between text blocks, never as decoration — always carrying structural meaning.

### Video Thumbnail Card
**Role:** Embedded video preview with play indicator

Small rectangular card, 12px radius, positioned in the lower-right of the hero. Contains a miniature ORYZO wordmark and a play icon. Functions as a secondary entry point without competing with the primary CTA.

### Legal/Disclaimer Text
**Role:** System-rendered micro-copy in Arial 8px

Fallback font (Arial 8px weight 500 uppercase) for things like "* ADOBE ILLUSTRATOR" footnotes. Visually subordinate — intentionally uses a different typeface to signal "this is not design, this is compliance."

## Do's and Don'ts

### Do
- Set all UI text in #ffedd7 (Warm Cream) — never use pure #fff; the warm tint is the system's signature.
- Use #dc5000 (Ember) only for credit lines, the "Built by" label, and the Lusion studio link — a single accent earns its rarity through restraint.
- Set type in uppercase weight 500 across the entire interface; use weight 400 / mixed case only for the 29px body copy that explains the product.
- Use 36px border-radius for the one filled CTA and 22.5px for outlined ghost buttons; 12px for cards; 0px for inputs and inline links — these four values are the entire radius vocabulary.
- Set section gaps at 100vh — each section gets its own full viewport, never compress product reveals into bands.
- Use 1px dashed lines in #40372 for section dividers; avoid solid dividers and avoid any divider thicker than 2px.
- Center the 3D product render in every void-mode section with text flanking symmetrically left and right at 18px gutters.

### Don't
- Never use pure #fff for text or #000 for backgrounds — the warm cream and walnut shadow are the system; purity reads as wrong here.
- Never apply #dc5000 to buttons, CTAs, or interactive surfaces — the orange is editorial credit only.
- Never use lowercase or sentence-case for headings, nav, or labels; the only mixed-case text is the 29px body description.
- Never add drop shadows to cards, buttons, or sections — depth comes from the two-step surface stack (#100904 → #382416), not from blur.
- Never use border-radius below 12px on containers — the geometry is deliberately chunky, not sharp.
- Never use more than one filled button per section; restraint is the design language.
- Never center-align body copy — headings and body text are always left-aligned, even when flanking a centered image.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Walnut Shadow | `#100904` | Full-bleed page canvas and section background |
| 1 | Bark Brown | `#382416` | Filled button surface, the only elevated solid |
| 2 | Cork Border | `#40372` | Hairline borders, dashed dividers, card outlines |
| 3 | Warm Cream | `#ffedd7` | Foreground text, navigation, interactive borders |

## Elevation

The system rejects shadow-based elevation entirely. Depth is achieved through a two-step surface stack: #100904 (canvas) → #382416 (elevated solid). There are no blur, no offset, no opacity-based shadows — only a 1–2 value luminance step. This keeps the interface flat and editorial, letting the 3D product renders provide all visual depth in void-mode sections.

## Imagery

Photography is editorial, top-down, and in-context: the cork coaster sits on a green cutting mat surrounded by pencils, a craft knife, and a paperclip — tools of the craft visible in frame. The green cutting mat (#445231) is a hero-only element, not a UI token. 3D renders dominate the product reveal sections: the cork coaster is shown isolated against Walnut Shadow, lit from the upper right with a warm rim light, rotating from top-down to 3/4 angle between sections. No lifestyle photography, no people, no stock imagery — the object is the hero and the tools are its context. Images are full-bleed, sharp-edged (no rounded masks), and treated with high contrast and warm grading.

## Layout

Full-bleed throughout — no max-width container, every section spans 100vw. Hero: full-viewport top-down photograph with a massive ORYZO wordmark (51px+) in the upper-left, tagline above, fixed minimal nav upper-right, vertical sidebar label running down the right edge, semi-transparent info card lower-left, video thumbnail lower-right. Subsequent sections: full-viewport Walnut Shadow canvas with a centered 3D product render flanked by left-aligned heading and right-aligned body copy — a three-column grid (text / object / text) with generous 18px gutters. Section transitions are seamless dark-on-dark; the only breaks are hairline dashed dividers. Navigation is fixed, transparent, and 4 items max. No sidebar, no footer chrome, no cards-within-cards — every screen is a single statement.

## Typography Voice

The system has exactly two typographic modes:

1. UPPERCASE WEIGHT 500 — the default for everything: nav, headings, labels, links, button text, legal. The voice is declarative, confident, museum-label. Sizes range from 8px (legal) to 51px (display). Line-height tightens with size: 1.2 at caption, 1.0 at body-sm, 0.9 at display. No letter-spacing adjustment — the font's geometry is tight enough at every scale.

2. MIXED CASE WEIGHT 400 — the exception, used only at 29px for the descriptive body copy that explains the product. This is the system's only conversational voice: "Designed to lift, insulate, and grip in all the right ways. Oryzo makes the simplest moment feel considered." The weight drop and case change are the signal — when the text shifts from 500/UPPER to 400/mixed, the user knows they are reading description, not label.

The bold signature: line-height 0.9 at 41–51px display sizes. This is unusually tight — most editorial sites use 1.0–1.1. At 0.9, the uppercase letterforms overlap their line-height bounds, creating a sculptural block effect. The display type doesn't sit in lines; it stacks as solid form.

## Agent Prompt Guide

## Quick Color Reference
- text: #ffedd7 (Warm Cream)
- background: #100904 (Walnut Shadow)
- surface: #382416 (Bark Brown)
- border: #40372e (Cork Border)
- accent: #dc5000 (Ember)
- primary action: no distinct CTA color

## 3-5 Example Component Prompts

1. **Hero Lockup:** Full-bleed Walnut Shadow (#100904) canvas. ORYZO wordmark at 51px Halyard Display Variable weight 500 uppercase, line-height 0.9, color #ffedd7, positioned upper-left with 24px margin. Tagline "MADE FOR MUGS, BUILT FOR TABLES." at 12px weight 500 uppercase above the wordmark, also #ffedd7.

No distinct primary action color was observed; use the extracted neutral button treatments instead of inventing a filled CTA color.

3. **Ghost Outline Button:** Transparent background, 1px Warm Cream (#ffedd7) border, 22.5px border-radius, 7.5px vertical padding, Warm Cream text at 12px weight 500 uppercase. The secondary action vocabulary.

4. **Product Reveal Section:** Full-viewport (100vh) Walnut Shadow (#100904) background. Centered 3D product render occupying the middle 40% of width. Left column: heading "ISN'T JUST A COASTER." at 41px weight 500 uppercase, line-height 0.9, #ffedd7, left-aligned. Right column: body copy at 29px weight 400 mixed-case, line-height 1.26, #ffedd7, left-aligned within the column. 18px gutter between the centered object and each text column.

5. **Top Navigation:** Fixed position, transparent background, full-width. Left: ORYZO wordmark at 12px Halyard weight 500 uppercase #ffedd7. Right: four nav items (INTRO, FEATURES, PRODUCT, CONTACT) at 12px weight 500 uppercase #ffedd7, with a 1px dashed #40372e underline beneath the active item.

## Similar Brands

- **Lusion (the studio credited in the design)** — Same warm-dark editorial canvas, single-product hero treatment, pill-button controls, and 3D product renders as the visual centerpiece
- **Active Theory** — Full-bleed dark mode with a single interactive 3D object commanding the viewport, minimal UI chrome, and oversized uppercase type
- **Resn** — Editorial product-showcase sites with top-down craft photography, warm grading, and typography that steps back to let the object speak
- **Tool of North America** — Studio portfolio sites that treat a single concept object with museum-presentation gravity — dark void, cream labels, generous negative space
- **Buck (studio)** — Work-reveal layouts that alternate between photographic context and isolated product renders against near-black backgrounds

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-warm-cream: #ffedd7;
  --color-walnut-shadow: #100904;
  --color-bark-brown: #382416;
  --color-cork-border: #40372e;
  --color-driftwood: #6c5f51;
  --color-ember-accent: #dc5000;
  --color-pure-black: #000000;

  /* Typography — Font Families */
  --font-halyard-display-variable: 'halyard-display-variable', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-arial: 'Arial', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-subheading: 18px;
  --leading-subheading: 1;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.09;
  --text-body: 29px;
  --leading-body: 1.26;
  --text-heading: 41px;
  --leading-heading: 0.9;
  --text-display: 51px;
  --leading-display: 0.9;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;

  /* Spacing */
  --spacing-6: 6px;
  --spacing-8: 8px;
  --spacing-9: 9px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-14: 14px;
  --spacing-18: 18px;
  --spacing-24: 24px;
  --spacing-31: 31px;
  --spacing-41: 41px;
  --spacing-45: 45px;
  --spacing-68: 68px;
  --spacing-204: 204px;

  /* Layout */
  --card-padding: 24px;
  --element-gap: 18px;

  /* Border Radius */
  --radius-xl: 12px;
  --radius-2xl: 22.5px;
  --radius-3xl: 36px;
  --radius-full: 9999px;

  /* Named Radii */
  --radius-cards: 12px;
  --radius-inputs: 0px;
  --radius-full-round: 9999px;
  --radius-buttons-pill: 36px;
  --radius-buttons-outlined: 22.5px;

  /* Surfaces */
  --surface-walnut-shadow: #100904;
  --surface-bark-brown: #382416;
  --surface-cork-border: #40372;
  --surface-warm-cream: #ffedd7;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-warm-cream: #ffedd7;
  --color-walnut-shadow: #100904;
  --color-bark-brown: #382416;
  --color-cork-border: #40372e;
  --color-driftwood: #6c5f51;
  --color-ember-accent: #dc5000;
  --color-pure-black: #000000;

  /* Typography */
  --font-halyard-display-variable: 'halyard-display-variable', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-arial: 'Arial', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-subheading: 18px;
  --leading-subheading: 1;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.09;
  --text-body: 29px;
  --leading-body: 1.26;
  --text-heading: 41px;
  --leading-heading: 0.9;
  --text-display: 51px;
  --leading-display: 0.9;

  /* Spacing */
  --spacing-6: 6px;
  --spacing-8: 8px;
  --spacing-9: 9px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-14: 14px;
  --spacing-18: 18px;
  --spacing-24: 24px;
  --spacing-31: 31px;
  --spacing-41: 41px;
  --spacing-45: 45px;
  --spacing-68: 68px;
  --spacing-204: 204px;

  /* Border Radius */
  --radius-xl: 12px;
  --radius-2xl: 22.5px;
  --radius-3xl: 36px;
  --radius-full: 9999px;
}
```
