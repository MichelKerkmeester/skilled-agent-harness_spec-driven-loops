# Monologue — Style Reference
> Velvet library with a single blue spark. A vast dark room where a single italic serif headline commands attention and one cyan glow signals action.

**Theme:** dark

Monologue operates as a dark editorial canvas draped in near-black with a single electric teal pulse. The visual identity is anchored by Instrument Serif at dramatic scale — italicized headlines ranging from 28px to 400px create a magazine-cover weight, with the brand wordmark blooming across the full viewport as ghostly gray type. DM Mono handles the technical/UI chrome: labels, tags, and structural annotations that read as system metadata rather than copy. Surfaces are matte and paper-thin against the void; a solitary white download button and the teal-gradient product card provide the only points of physical weight. The mood is late-night workstation meets luxury print — confident, quiet, and typographically opinionated.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Electric Cyan | `#19d0e8` | `--color-electric-cyan` | Accent text, accent borders, the video card surface, the gradient highlight on the product screen — the only chromatic pulse in an otherwise achromatic system |
| Sky Signal | `#44ccff` | `--color-sky-signal` | Secondary cyan for gradient stops and product screen illumination |
| Deep Teal | `#062f34` | `--color-deep-teal` | Card surface base, gradient shadow stop — anchors the teal product card in darkness |
| Void Black | `#000000` | `--color-void-black` | Page canvas, primary background — the uninterrupted dark field |
| Obsidian | `#010101` | `--color-obsidian` | Alternative near-black surface when the canvas shifts fractionally off-pure-black |
| Midnight Surface | `#191919` | `--color-midnight-surface` | Elevated surface — cards, panels, overlay containers sitting one step above the void |
| Graphite | `#282828` | `--color-graphite` | Mid-tier surface and neutral button fills — the interactive control surface |
| Charcoal | `#363636` | `--color-charcoal` | Secondary card surface for stacked or grouped containers |
| Slate | `#3f3f3f` | `--color-slate` | Deep shadow surface and tertiary elevation |
| Steel Gray | `#7f7f7f` | `--color-steel-gray` | Supporting neutral for secondary UI, dividers, and muted labels. Do not promote it to the primary CTA color |
| Paper White | `#ffffff` | `--color-paper-white` | Primary text, light surface fills, download button, high-contrast elements |
| Ghost Gray | `#c0c0c0` | `--color-ghost-gray` | Subtle highlight wash and faint surface luminosity |

## Tokens — Typography

### sans-serif — sans-serif — detected in extracted data but not described by AI · `--font-sans-serif`
- **Weights:** 400
- **Sizes:** 12px
- **Line height:** 1.2
- **Role:** sans-serif — detected in extracted data but not described by AI

### Instrument Serif — Display and heading — italicized editorial serif at dramatic scale. The brand wordmark reaches 400px filling the viewport; section headlines land at 64–96px. Negative letter-spacing tightens the serif into compact magazine-display density. · `--font-instrument-serif`
- **Substitute:** Playfair Display, EB Garamond, Cormorant Garamond
- **Weights:** 400
- **Sizes:** 28px, 30px, 32px, 40px, 48px, 64px, 70px, 72px, 96px, 393px, 403px
- **Line height:** 1.0–1.3
- **Letter spacing:** -0.04em at 64px and above; -0.03em at 48px; 0.008em at 32px
- **Role:** Display and heading — italicized editorial serif at dramatic scale. The brand wordmark reaches 400px filling the viewport; section headlines land at 64–96px. Negative letter-spacing tightens the serif into compact magazine-display density.

### DM Mono — Mono UI chrome — labels, tags, metadata, button text, the 'MADE BY EVERY' stamp, the download button label, feature annotations. Reads as system metadata. The 32px usage appears in product device labels. · `--font-dm-mono`
- **Substitute:** JetBrains Mono, IBM Plex Mono, Space Mono
- **Weights:** 400
- **Sizes:** 10px, 12px, 14px, 15px, 16px, 18px, 20px, 32px
- **Line height:** 1.2–1.5
- **Letter spacing:** -0.01em at 20px; 0.015–0.021em at 10–14px (slight positive tracking for tag/caps usage)
- **Role:** Mono UI chrome — labels, tags, metadata, button text, the 'MADE BY EVERY' stamp, the download button label, feature annotations. Reads as system metadata. The 32px usage appears in product device labels.

### Geist — Body text — 17px single weight for paragraphs and descriptions. The slightly larger-than-default body size (17 vs 16) gives copy room to breathe against the dense UI chrome. · `--font-geist`
- **Substitute:** Inter, system-ui
- **Weights:** 400
- **Sizes:** 17px
- **Line height:** 1.4
- **Role:** Body text — 17px single weight for paragraphs and descriptions. The slightly larger-than-default body size (17 vs 16) gives copy room to breathe against the dense UI chrome.

### system-ui — Fallback body and link text — appears in utility contexts where a system font is appropriate · `--font-system-ui`
- **Substitute:** Inter, -apple-system, Segoe UI
- **Weights:** 400
- **Sizes:** 16px
- **Line height:** 1.5
- **Role:** Fallback body and link text — appears in utility contexts where a system font is appropriate

### SF Pro Display Regular — SF Pro Display Regular — detected in extracted data but not described by AI · `--font-sf-pro-display-regular`
- **Weights:** 400
- **Sizes:** 16px
- **Line height:** 1.4
- **Letter spacing:** -0.006
- **Role:** SF Pro Display Regular — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 10px | 1.4 | 0.21px | `--text-caption` |
| body | 17px | 1.4 | — | `--text-body` |
| subheading | 20px | 1.2 | -0.2px | `--text-subheading` |
| heading-sm | 32px | 1.1 | 0.26px | `--text-heading-sm` |
| heading | 48px | 1.1 | -1.44px | `--text-heading` |
| heading-lg | 72px | 1 | -2.16px | `--text-heading-lg` |
| display | 96px | 0.9 | -3.84px | `--text-display` |

## Tokens — Spacing & Shapes

**Density:** compact

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 5 | 5px | `--spacing-5` |
| 6 | 6px | `--spacing-6` |
| 8 | 8px | `--spacing-8` |
| 9 | 9px | `--spacing-9` |
| 10 | 10px | `--spacing-10` |
| 11 | 11px | `--spacing-11` |
| 12 | 12px | `--spacing-12` |
| 14 | 14px | `--spacing-14` |
| 16 | 16px | `--spacing-16` |
| 18 | 18px | `--spacing-18` |
| 19 | 19px | `--spacing-19` |
| 20 | 20px | `--spacing-20` |
| 24 | 24px | `--spacing-24` |
| 32 | 32px | `--spacing-32` |
| 40 | 40px | `--spacing-40` |
| 72 | 72px | `--spacing-72` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 100000px |
| cards | 18px |
| large | 12px |
| small | 4px |
| medium | 8px |
| buttons | 100000px |
| productDevice | 40px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| subtle | `rgba(0, 0, 0, 0.7) 3px 3px 2px 0px inset, rgba(255, 255, ...` | `--shadow-subtle` |
| sm | `rgba(0, 0, 0, 0.25) 0px 4px 4px 0px, rgba(255, 255, 255, ...` | `--shadow-sm` |
| subtle-2 | `rgba(0, 0, 0, 0.63) 0px 0px 0px 1px` | `--shadow-subtle-2` |
| md | `rgb(14, 93, 102) 6px 6px 10px 0px inset, rgba(255, 255, 2...` | `--shadow-md` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 24px
- **Element gap:** 10px

## Components

### Brand Wordmark Background
**Role:** Atmospheric full-viewport type

The word 'Monologue' rendered in Instrument Serif at ~400px, light gray (#c0c0c0 to #d1d1d1 gradient fading to white), positioned to overflow the viewport edges. Serves as a watermark/ghost text — the primary background element, not a heading. z-index behind all content.

### Product Device Card
**Role:** Hero product visual

White (#ffffff) rounded body at 40px radius, ~360px wide. Contains a dark teal gradient screen (linear-gradient(rgb(32,177,195), rgb(3,67,75))) with a pixelated/dot-matrix display texture, and a speaker grille on the left side rendered as a grid of black dots. A 'Download' pill button with the Apple icon sits at the bottom of the screen. Multi-layer inset and outset shadows create a tangible, physical-device quality. A 'MADE BY EVERY' stamp badge protrudes from the top edge.

### Every Stamp Badge
**Role:** Brand attribution stamp

Navy (#1a3a4a) scalloped/wavy-edge badge, ~140px wide, positioned overlapping the top of the product card. 'MADE BY' in DM Mono 10px white above 'EVERY' in DM Mono 18–20px white. Heavy inset shadow (rgba(0,0,0,0.7) 3px 3px 2px inset) gives it a postage-stamp embossed feel. Attached to the product device at the top.

### Download Button (Light Pill)
**Role:** Primary download CTA

White (#ffffff) background, black text and Apple icon, DM Mono 12px. Fully rounded (100000px radius). ~120px wide × 32px tall. Minimal — no border, no shadow. The sole light element on the dark canvas, creating high-contrast focal weight.

### Watch Video Card
**Role:** Secondary CTA / video preview

Teal-tinted dark surface in the top-right of the hero. Contains a small video thumbnail (landscape crop, ~80px) with a 'Watch video' play-button overlay, plus the label 'Introducing Monologue notes' in white italic serif at 14–16px. Rounded 8px corners. Functions as a soft secondary action.

### Section Heading (Italic Serif)
**Role:** Editorial section title

Instrument Serif 400 italic, 64–72px, white (#ffffff). Left-aligned. Negative letter-spacing -0.04em tightens the serif. Two-line max width creates a magazine-column feel. Paired with a subheading in Geist 17px #7f7f7f or white at reduced opacity.

### Feature Annotation Row
**Role:** Feature callout with product image

Two-column layout: left side has a DM Mono 12–14px label (e.g. 'Auto formatting') in white with positive letter-spacing, plus a Geist 17px description in muted gray (#7f7f7f). Right side has a product screenshot card with the email composition UI. 10px row gap between label and description.

### Email Composition Card
**Role:** Product feature screenshot

Dark surface (#191919 or similar), rounded 8–12px, showing an email draft UI. Contains fields for 'To:', 'Subject:', 'From:' in DM Mono, and body text in Geist. The content area uses a teal-to-dark gradient as background. This is the 'Monologue in action' visual — demonstrates auto-formatted voice output.

### Testimonial Block
**Role:** Social proof quote

Centered layout. Italic Instrument Serif 24–28px white quote text. Below: a small circular avatar placeholder, name in DM Mono 12px, and title/role in DM Mono 10px in muted gray. 40–60px vertical padding. Minimal — no card background, floats on the void.

### Language Pill
**Role:** Feature tag / language support indicator

DM Mono 12px, white or muted gray text, no background, no border. Arranged in a horizontal row at the section bottom. The first item (the language name) is styled in italic Instrument Serif as a section sub-label. Fully rounded layout with ~20px gap between pills.

### Accent Text Link
**Role:** Inline accent / emphasis link

Electric Cyan (#19d0e8) text, Geist or DM Mono, often italic. Used for the word 'Every' in the hero subtext and for other inline emphasis. The cyan appears at most 2–3 times per screen — always as a small punctuation mark, never as a full CTA background.

### Ghost Button
**Role:** Secondary text button

Transparent background, 1px white or gray border, white text in DM Mono 12px, 8px radius, 8–10px vertical padding, 14–16px horizontal padding. Used for secondary actions when a light-fill primary isn't appropriate.

## Do's and Don'ts

### Do
- Use Instrument Serif italic at 64–96px for section headlines — the editorial weight is the brand's primary signature
- Let the brand wordmark bleed beyond viewport edges at ~400px as a ghosted background layer
- Use DM Mono for all UI chrome, labels, buttons, and metadata — never use a proportional font for system annotations
- Apply the teal accent (#19d0e8) at most 2–3 times per viewport — it should feel like a spark, not a wash
- Use fully rounded (100000px) radius for all pills, tags, and the download button
- Use 18–40px radius for cards and the product device — the generous rounding signals physical tangibility
- Layer complex inset + outset shadows on the product device card to create a real-object quality on the void canvas

### Don't
- Do not use bright or warm accent colors — the system is monastically dark with one cold teal point
- Do not use heavy drop shadows on text or flat cards — elevation should be reserved for the product device and stamps
- Do not use Inter or a geometric sans for headings — the italic serif is non-negotiable brand identity
- Do not use small heading sizes (below 28px) for Instrument Serif — it needs scale to function
- Do not apply the teal as a background fill on buttons or large surfaces — it belongs in text, thin borders, and the gradient
- Do not use sharp corners (< 4px radius) on interactive elements — the system curves everything
- Do not center-align body paragraphs — left-align for editorial column behavior, center only for testimonials and the wordmark

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Void | `#000000` | Page canvas, unbroken background |
| 1 | Midnight | `#191919` | Cards, panels, raised containers |
| 2 | Graphite | `#282828` | Interactive surfaces, button fills, elevated UI |
| 3 | Charcoal | `#363636` | Nested card backgrounds, grouped content blocks |
| 4 | Paper | `#ffffff` | Inverted light surface — download button, product device body |

## Elevation

- **Product device card:** `rgba(0, 0, 0, 0.25) 0px 4px 4px 0px, rgba(255, 255, 255, 0.25) 1px 1px 2px 0px, rgba(0, 0, 0, 0.5) 1px 1px 1px 0px inset, rgba(0, 0, 0, 0.7) 2px 2px 12px 0px inset`
- **Stamp/badge:** `rgba(0, 0, 0, 0.7) 3px 3px 2px 0px inset, rgba(255, 255, 255, 0.25) 3px 2px 2px 0px`
- **Raised card:** `rgba(0, 0, 0, 0.63) 0px 0px 0px 1px`
- **Teal gradient card:** `rgb(14, 93, 102) 6px 6px 10px 0px inset, rgba(255, 255, 255, 0.2) 4px 4px 4px 0px, rgba(255, 255, 255, 0.25) 1px 1px 2px 0px`

## Imagery

Imagery is minimal and product-centric. The dominant visual is the product device card — a physical, tangible object rendered with multi-layer shadows to feel like a real device sitting on a dark surface. Email composition screenshots appear as feature illustrations inside dark cards, showing the product's output rather than abstract graphics. The background carries a subtle fabric/ripple texture (dark water-like undulations) that adds atmospheric depth without literal imagery. No photography, no lifestyle shots, no people — the product IS the hero, and everything else is typographic atmosphere.

## Layout

Full-bleed dark canvas with content constrained to ~1200px max width. The hero is a split composition: left half holds the headline and download button in generous whitespace, right half holds the teal video card at the top corner. The massive 'Monologue' wordmark spans the full viewport width as a background watermark, overflowing the content container. Below the fold, sections alternate between centered text blocks and two-column layouts (text-left, product-screenshot-right). Vertical rhythm is generous — 80px section gaps create breathing room between dense information blocks. The language support row sits as a horizontal strip near the bottom, single-line, with the italic serif label 'Supports 100+ languages' anchoring the left edge.

## Agent Prompt Guide

**Quick Color Reference**
- text: #ffffff
- background: #000000
- card surface: #191919
- border / hairline: #282828
- accent: #19d0e8
- primary action: #282828 (filled action)

**3-5 Example Component Prompts**

1. **Hero section with ghost brand wordmark**: Black (#000000) full-bleed background. Instrument Serif italic, 72px, #ffffff, letter-spacing -0.04em for the headline. DM Mono 12px, #7f7f7f for subtext. A ghost 'Monologue' wordmark in Instrument Serif ~400px, #c0c0c0, positioned as an absolute background layer overflowing the viewport. Geist 17px, #7f7f7f for body description.

2. **Product device card**: White (#ffffff) rounded body at 40px radius, 360px wide. Contains a dark teal gradient screen (linear-gradient(rgb(32,177,195), rgb(3,67,75))) with a dot-matrix texture. A white 'Download' pill button (DM Mono 12px, Apple icon, 100000px radius) sits at the bottom of the screen. Multi-layer shadow: rgba(0,0,0,0.25) 0px 4px 4px, rgba(255,255,255,0.25) 1px 1px 2px, rgba(0,0,0,0.5) 1px 1px 1px inset, rgba(0,0,0,0.7) 2px 2px 12px inset.

3. **Section heading with two-column feature layout**: Left column: Instrument Serif italic 64px, #ffffff, letter-spacing -0.04em. Geist 17px, #7f7f7f for subtext. Right column: dark card (#191919, 8px radius) containing a product screenshot. 80px vertical gap from previous section. 10px row gap between label and description in the feature annotation.

4. **Language pill row**: Horizontal strip at section bottom. Left anchor: 'Supports 100+ languages' in Instrument Serif italic, 28px, #ffffff. Followed by DM Mono 12px tags (#7f7f7f): 'English', 'Portuguese', 'Cantonese', 'Japanese', 'Korean', 'Russian', 'Italian'. 20px gap between tags, no backgrounds.

5. **Testimonial block**: Centered, no card background. Instrument Serif italic 28px, #ffffff for the quote. Below: 32px circular avatar placeholder (#282828). Name in DM Mono 12px white, role in DM Mono 10px #7f7f7f. 60px vertical padding top and bottom.

## Gradient System

Two distinct gradient families: (1) **Teal signal gradient** — linear-gradient(rgb(32,177,195) 0%, rgb(3,67,75) 100%) — used exclusively on the product device screen and the email composition card backgrounds. This gradient creates the brand's only saturated color field. (2) **Light fade gradient** — linear-gradient(rgb(209,209,209) 0%, rgb(255,255,255) 100%) — applied to the ghosted wordmark text and other large-scale gray type that needs to fade into lighter values. The teal gradient always points vertically with the lighter cyan on top; the light gradient always points vertically with the darker gray on top. No diagonal or multi-stop gradients are used.

## Typography Pairing Philosophy

The system uses a three-font editorial model: Instrument Serif (display), DM Mono (UI/system metadata), and Geist (body). The serif carries voice and personality; the mono carries function and precision; the sans carries readable prose. Never mix these roles. Headlines are always Instrument Serif italic — the italic is a brand marker, not a style option. Mono text often uses positive letter-spacing (0.015–0.021em) at small sizes to give labels a deliberate, spaced-out quality. Serif text always uses negative tracking at display sizes to tighten the magazine-display feel.

## Similar Brands

- **Linear** — Same dark canvas with generous spacing, restrained accent use, and editorial product presentation
- **Vercel** — Similar near-black surfaces, mono labels for system chrome, and one cool accent against monochrome
- **Raycast** — Dark-mode productivity app with mono UI typography and a single chromatic accent for interactive elements
- **Every.to** — The parent publication uses the same Instrument Serif italic + DM Mono pairing for editorial product pages
- **Things 3** — Premium dark UI with generous rounding, physical card metaphors, and restrained accent color philosophy

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-electric-cyan: #19d0e8;
  --color-sky-signal: #44ccff;
  --color-deep-teal: #062f34;
  --color-void-black: #000000;
  --color-obsidian: #010101;
  --color-midnight-surface: #191919;
  --color-graphite: #282828;
  --color-charcoal: #363636;
  --color-slate: #3f3f3f;
  --color-steel-gray: #7f7f7f;
  --color-paper-white: #ffffff;
  --color-ghost-gray: #c0c0c0;

  /* Typography — Font Families */
  --font-sans-serif: 'sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-instrument-serif: 'Instrument Serif', ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
  --font-dm-mono: 'DM Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-geist: 'Geist', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-system-ui: 'system-ui', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-sf-pro-display-regular: 'SF Pro Display Regular', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.4;
  --tracking-caption: 0.21px;
  --text-body: 17px;
  --leading-body: 1.4;
  --text-subheading: 20px;
  --leading-subheading: 1.2;
  --tracking-subheading: -0.2px;
  --text-heading-sm: 32px;
  --leading-heading-sm: 1.1;
  --tracking-heading-sm: 0.26px;
  --text-heading: 48px;
  --leading-heading: 1.1;
  --tracking-heading: -1.44px;
  --text-heading-lg: 72px;
  --leading-heading-lg: 1;
  --tracking-heading-lg: -2.16px;
  --text-display: 96px;
  --leading-display: 0.9;
  --tracking-display: -3.84px;

  /* Typography — Weights */
  --font-weight-regular: 400;

  /* Spacing */
  --spacing-5: 5px;
  --spacing-6: 6px;
  --spacing-8: 8px;
  --spacing-9: 9px;
  --spacing-10: 10px;
  --spacing-11: 11px;
  --spacing-12: 12px;
  --spacing-14: 14px;
  --spacing-16: 16px;
  --spacing-18: 18px;
  --spacing-19: 19px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-72: 72px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 24px;
  --element-gap: 10px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 18px;
  --radius-3xl: 24px;
  --radius-3xl-2: 40px;
  --radius-full: 52px;
  --radius-full-2: 56px;
  --radius-full-3: 60px;
  --radius-full-4: 100px;
  --radius-full-5: 900px;
  --radius-full-6: 100000px;

  /* Named Radii */
  --radius-tags: 100000px;
  --radius-cards: 18px;
  --radius-large: 12px;
  --radius-small: 4px;
  --radius-medium: 8px;
  --radius-buttons: 100000px;
  --radius-productdevice: 40px;

  /* Shadows */
  --shadow-subtle: rgba(0, 0, 0, 0.7) 3px 3px 2px 0px inset, rgba(255, 255, 255, 0.25) 3px 2px 2px 0px;
  --shadow-sm: rgba(0, 0, 0, 0.25) 0px 4px 4px 0px, rgba(255, 255, 255, 0.25) 1px 1px 2px 0px, rgba(0, 0, 0, 0.5) 1px 1px 1px 0px inset, rgba(0, 0, 0, 0.7) 2px 2px 12px 0px inset;
  --shadow-subtle-2: rgba(0, 0, 0, 0.63) 0px 0px 0px 1px;
  --shadow-md: rgb(14, 93, 102) 6px 6px 10px 0px inset, rgba(255, 255, 255, 0.2) 4px 4px 4px 0px, rgba(255, 255, 255, 0.25) 1px 1px 2px 0px;

  /* Surfaces */
  --surface-void: #000000;
  --surface-midnight: #191919;
  --surface-graphite: #282828;
  --surface-charcoal: #363636;
  --surface-paper: #ffffff;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-electric-cyan: #19d0e8;
  --color-sky-signal: #44ccff;
  --color-deep-teal: #062f34;
  --color-void-black: #000000;
  --color-obsidian: #010101;
  --color-midnight-surface: #191919;
  --color-graphite: #282828;
  --color-charcoal: #363636;
  --color-slate: #3f3f3f;
  --color-steel-gray: #7f7f7f;
  --color-paper-white: #ffffff;
  --color-ghost-gray: #c0c0c0;

  /* Typography */
  --font-sans-serif: 'sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-instrument-serif: 'Instrument Serif', ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
  --font-dm-mono: 'DM Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-geist: 'Geist', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-system-ui: 'system-ui', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-sf-pro-display-regular: 'SF Pro Display Regular', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.4;
  --tracking-caption: 0.21px;
  --text-body: 17px;
  --leading-body: 1.4;
  --text-subheading: 20px;
  --leading-subheading: 1.2;
  --tracking-subheading: -0.2px;
  --text-heading-sm: 32px;
  --leading-heading-sm: 1.1;
  --tracking-heading-sm: 0.26px;
  --text-heading: 48px;
  --leading-heading: 1.1;
  --tracking-heading: -1.44px;
  --text-heading-lg: 72px;
  --leading-heading-lg: 1;
  --tracking-heading-lg: -2.16px;
  --text-display: 96px;
  --leading-display: 0.9;
  --tracking-display: -3.84px;

  /* Spacing */
  --spacing-5: 5px;
  --spacing-6: 6px;
  --spacing-8: 8px;
  --spacing-9: 9px;
  --spacing-10: 10px;
  --spacing-11: 11px;
  --spacing-12: 12px;
  --spacing-14: 14px;
  --spacing-16: 16px;
  --spacing-18: 18px;
  --spacing-19: 19px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-72: 72px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 18px;
  --radius-3xl: 24px;
  --radius-3xl-2: 40px;
  --radius-full: 52px;
  --radius-full-2: 56px;
  --radius-full-3: 60px;
  --radius-full-4: 100px;
  --radius-full-5: 900px;
  --radius-full-6: 100000px;

  /* Shadows */
  --shadow-subtle: rgba(0, 0, 0, 0.7) 3px 3px 2px 0px inset, rgba(255, 255, 255, 0.25) 3px 2px 2px 0px;
  --shadow-sm: rgba(0, 0, 0, 0.25) 0px 4px 4px 0px, rgba(255, 255, 255, 0.25) 1px 1px 2px 0px, rgba(0, 0, 0, 0.5) 1px 1px 1px 0px inset, rgba(0, 0, 0, 0.7) 2px 2px 12px 0px inset;
  --shadow-subtle-2: rgba(0, 0, 0, 0.63) 0px 0px 0px 1px;
  --shadow-md: rgb(14, 93, 102) 6px 6px 10px 0px inset, rgba(255, 255, 255, 0.2) 4px 4px 4px 0px, rgba(255, 255, 255, 0.25) 1px 1px 2px 0px;
}
```
