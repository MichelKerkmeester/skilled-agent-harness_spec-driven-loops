# Shade — Style Reference
> Editorial paper cutouts on white

**Theme:** light

Shade operates in a near-monochrome design language: white canvas, soft warm-charcoal text, and one restrained violet accent that appears almost exclusively as hairline borders and a single logo gradient. The interface feels editorial and unhurried — Inter Display at compressed negative tracking gives headlines a sculpted, magazine-cover quality rather than the typical SaaS breathing-room look. Buttons are pill-shaped with hard, solid-color offset shadows (no blur, no diffusion) that read as paper cutouts rather than Material elevations. Color is used as rare punctuation: the violet never fills large surfaces, it traces edges and marks selected states, letting the photographic content do the emotional work.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Charcoal Ink | `#131315` | `--color-charcoal-ink` | Primary text, dark pill button fill, heading borders — warm near-black, the only filled button color in the system |
| Pure White | `#ffffff` | `--color-pure-white` | Page canvas, card surfaces, button text, ghost button background |
| Bone | `#f7f5ff` | `--color-bone` | Secondary canvas, subtle violet-tinted off-white for alternating sections |
| Cutout Gray | `#f1f1f1` | `--color-cutout-gray` | Solid offset shadow color under primary buttons and secondary surfaces |
| Slate Mid | `#717173` | `--color-slate-mid` | Muted body text, secondary metadata, helper copy |
| Hairline | `#d0d0d0` | `--color-hairline` | Subtle borders, dividers, inactive tab indicators |
| Deep Charcoal | `#444444` | `--color-deep-charcoal` | Input borders, slightly heavier dividers than Hairline |
| Logo Violet | `#855cf7` | `--color-logo-violet` | Brand mark gradient terminus, logo cube fill — the only saturated color in the system |
| Lavender Trace | `#dacefd` | `--color-lavender-trace` | Selected tab underline, violet hairline accents, announcement pill border — violet at whisper volume |

## Tokens — Typography

### sans-serif — sans-serif — detected in extracted data but not described by AI · `--font-sans-serif`
- **Weights:** 400
- **Sizes:** 12px
- **Line height:** 1.2
- **Role:** sans-serif — detected in extracted data but not described by AI

### Inter Display — Primary typeface for all UI text, body and headings alike. Single weight 400 carries the entire hierarchy through size and tracking alone — no bold, no light. The custom stylistic sets (ss01, ss07, ss08) reshape the g, a, and l terminals into a more geometric, editorial silhouette that distinguishes it from stock Inter. · `--font-inter-display`
- **Substitute:** Inter
- **Weights:** 400
- **Sizes:** 10px, 14px, 16px, 18px, 20px, 21px, 24px, 28px, 32px, 36px, 40px, 48px, 56px, 72px
- **Line height:** 1.0–1.57 (size-dependent)
- **Letter spacing:** -0.01em to -0.03em (tighter as size increases: -0.01em at body, -0.03em at display)
- **OpenType features:** `"ss01", "ss07", "ss08", "cv03", "cv04", "cv09", "cv11", "blwf"`
- **Role:** Primary typeface for all UI text, body and headings alike. Single weight 400 carries the entire hierarchy through size and tracking alone — no bold, no light. The custom stylistic sets (ss01, ss07, ss08) reshape the g, a, and l terminals into a more geometric, editorial silhouette that distinguishes it from stock Inter.

### Aux Mono — Monospaced label font for section eyebrows (e.g. 'DAY 1', 'LET'S CHAT', nav items, badge text). Sets at 14px with -0.04em tracking gives timestamps and labels a technical, archival feel against the editorial display type. · `--font-aux-mono`
- **Substitute:** JetBrains Mono
- **Weights:** 400
- **Sizes:** 14px
- **Line height:** 1.29
- **Letter spacing:** -0.04em
- **Role:** Monospaced label font for section eyebrows (e.g. 'DAY 1', 'LET'S CHAT', nav items, badge text). Sets at 14px with -0.04em tracking gives timestamps and labels a technical, archival feel against the editorial display type.

### Inter — Secondary fallback / system-level utility text where the custom display features aren't required · `--font-inter`
- **Substitute:** system-ui
- **Weights:** 400, 500
- **Sizes:** 12px, 14px, 16px
- **Line height:** 1.2–1.5
- **Role:** Secondary fallback / system-level utility text where the custom display features aren't required

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.2 | -0.12px | `--text-caption` |
| body-sm | 14px | 1.29 | -0.14px | `--text-body-sm` |
| body | 16px | 1.5 | -0.16px | `--text-body` |
| subheading | 20px | 1.4 | -0.2px | `--text-subheading` |
| heading-sm | 24px | 1.3 | -0.24px | `--text-heading-sm` |
| heading | 32px | 1.22 | -0.96px | `--text-heading` |
| heading-lg | 48px | 1.15 | -1.44px | `--text-heading-lg` |
| display | 72px | 1.1 | -2.16px | `--text-display` |

## Tokens — Spacing & Shapes

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 5 | 5px | `--spacing-5` |
| 6 | 6px | `--spacing-6` |
| 7 | 7px | `--spacing-7` |
| 8 | 8px | `--spacing-8` |
| 9 | 9px | `--spacing-9` |
| 10 | 10px | `--spacing-10` |
| 12 | 12px | `--spacing-12` |
| 15 | 15px | `--spacing-15` |
| 20 | 20px | `--spacing-20` |
| 25 | 25px | `--spacing-25` |
| 30 | 30px | `--spacing-30` |
| 40 | 40px | `--spacing-40` |
| 50 | 50px | `--spacing-50` |
| 60 | 60px | `--spacing-60` |
| 100 | 100px | `--spacing-100` |

### Border Radius

| Element | Value |
|---------|-------|
| tabs | 2px |
| cards | 14px |
| inputs | 9px |
| buttons | 35px |
| smallChips | 2px |
| secondaryButtons | 20px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| subtle | `rgb(241, 241, 241) 8px 8px 0px 0px` | `--shadow-subtle` |
| subtle-2 | `rgba(226, 226, 227, 0.5) 10px 10px 0px -2px` | `--shadow-subtle-2` |
| sm | `rgba(19, 19, 21, 0.12) 0px 1px 4px 0px` | `--shadow-sm` |
| sm-2 | `rgba(0, 0, 0, 0.2) 0px 3px 4px 0px` | `--shadow-sm-2` |
| subtle-3 | `rgba(0, 0, 0, 0.05) 0px 0px 0px 1px inset` | `--shadow-subtle-3` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 100px
- **Card padding:** 24px
- **Element gap:** 10px

## Components

### Primary Pill Button
**Role:** Highest-emphasis action

Dark charcoal fill (#131315), white text, 35px border-radius, ~15px vertical / 24px horizontal padding, Inter Display 16px weight 400 with white color. Carries the signature 8px 8px 0px 0px #f1f1f1 hard offset shadow beneath — no blur, reads as a cutout hovering above the page.

### Ghost Pill Button
**Role:** Secondary action paired with primary

No fill, 1.5px solid #131315 border, #131315 text, 35px radius, same padding as primary. The 8px offset shadow is rendered in semi-transparent gray (rgba(226,226,227,0.5) 10px 10px 0px -2px) so the button appears to sit on a slightly lifted paper plane.

### Top Navigation Bar
**Role:** Site-wide navigation

Sticky white bar with 1px bottom hairline (#d0d0d0). Logo cube left, then 5–6 Inter Display 14px links in #131315 with 20px gap; right side: 'Log In' text link plus the primary pill CTA. Vertical padding ~20px.

### Announcement Pill
**Role:** Inline news/feature flag above hero

Lavender Trace (#dacefd) 1px border, fully rounded (~999px or matching button radius), Aux Mono 14px text in violet. No fill, no shadow. Floats centered above the hero headline.

### Hero Headline
**Role:** Page-level display

Inter Display 72px (desktop) / 48px (tablet) weight 400, #131315, line-height 1.1, letter-spacing -0.03em. Centered, max-width ~900px. No gradient, no mixed weight — the size and negative tracking do all the work.

### Tab Navigation Strip
**Role:** In-section content switcher

Four labels (Search / Access / Share / Archive) in Inter Display 16px, evenly spaced, separated by hairline dividers. Active tab is marked by a 2px-tall violet (#855cf7) underline directly beneath the text — not a pill background, just a precise accent line. Inactive tabs are #717173.

### Product Screenshot Card
**Role:** Feature proof point

Product UI rendered as a browser-frame screenshot, slight tilt or straight, sitting on the bone (#f7f5ff) surface. Card has 1px inset #00000014 hairline, 14px radius, no outer shadow. Image bleeds nearly to the card edge.

### Logo Strip
**Role:** Social proof / partner bar

Horizontal row of 7–8 partner logos in mid-gray (#717173 or desaturated), evenly spaced with ~40px gaps, all rendered at uniform height (~20px). No labels, no borders — just quiet marks.

### Timeline Onboarding Row
**Role:** Step-based explanation

Three columns headed by Aux Mono 14px labels ('DAY 1', 'DAY 14', 'DAY 21') in #717173, then Inter Display 24px headings in #131315, then body text. Below the columns runs a full-width hairline with 2px solid charcoal circles at each step; active step is filled, future steps are outlined.

### Cookie Consent Banner
**Role:** Bottom-right compliance notice

Fixed bottom-right card, white fill, 1px #d0d0d0 border, 9px radius, ~16px padding. Body text in 12px #717173, small 'Okay' button with #131315 text and no background.

### Brand Logo Mark
**Role:** Identity

A small cube/diamond glyph filled with a conic gradient from transparent to #855cf7, ~24px square, followed by 'shade' wordmark in Inter Display 20px weight 400, #131315. The gradient is the only saturated color mark in the system.

## Do's and Don'ts

### Do
- Use the hard offset shadow (8px 8px 0px 0px #f1f1f1) exclusively on primary pill buttons — never apply blur or diffusion to elevation
- Set Inter Display at weight 400 only; let size and -0.03em tracking carry hierarchy, never switch to bold
- Reserve #855cf7 for the logo gradient and the active tab underline — every other accent must be the muted #dacefd lavender
- Pair every primary CTA with a ghost secondary button of identical 35px radius and padding
- Use 100px between major sections, 10–12px between inline elements, 24px inside cards
- Treat photography as full-bleed and unbordered — let the white canvas frame it like a gallery wall
- Apply Aux Mono 14px -0.04em to all eyebrow labels, timestamps, and tab headings

### Don't
- Do not introduce additional brand colors or saturated fills — the system is 99% achromatic by design
- Do not use soft blurred shadows on buttons; the signature is hard, solid, paper-cutout offsets
- Do not bold headlines or use weight 500+ in Inter Display — the single-weight hierarchy is intentional
- Do not round the active tab into a pill background; the 2px violet underline is the only acceptable indicator
- Do not add gradient backgrounds to sections or cards — gradients are reserved for the brand mark
- Do not use border-radius values outside the defined scale (35/20/14/9/2px)
- Do not center-align body paragraphs longer than two lines — the system is left-aligned with a centered display headline only

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas | `#ffffff` | Primary page background |
| 1 | Bone | `#f7f5ff` | Alternating section background, subtle violet-tinted band |
| 2 | Cutout | `#f1f1f1` | Offset shadow plane under elevated buttons and cards |

## Elevation

- **Primary CTA Button:** `#f1f1f1 8px 8px 0px 0px (hard solid offset, no blur — reads as paper cutout)`
- **Ghost/Link Button:** `rgba(226,226,227,0.5) 10px 10px 0px -2px (hard offset, partially behind element)`
- **Secondary Action Button:** `rgba(19,19,21,0.12) 0px 1px 4px 0px (subtle soft shadow for small buttons)`
- **Product Card:** `rgba(0,0,0,0.05) 0px 0px 0px 1px inset (inset hairline, no outer shadow)`

## Imagery

Photography is the emotional engine: full-bleed, high-saturation action and lifestyle imagery (surfing, fashion, vibrant product crops) that contrast sharply against the bone-white interface. Images are treated raw — no overlays, no duotone, no rounded corners, no borders. The interface frames the photography like a gallery wall. Product UI is shown as tilted browser-frame screenshots floating on the canvas. Logo strip is desaturated grayscale partner marks at mid-gray opacity, each monochrome and small. Icons are minimal: a purple gradient cube/diamond for the brand mark, otherwise absent or hairline.

## Layout

Max-width 1200px centered content column on a full-width white canvas. Hero is vertically centered with a display headline, short muted paragraph, and two side-by-side pill CTAs; no hero image — the first visual break is the logo strip, then a large full-bleed photograph. Sections alternate white and bone (#f7f5ff) bands with 100px vertical breathing room. Feature blocks use a 4-column card grid for product screenshots, each card on the bone surface with a 1px inset hairline. Onboarding uses a 3-column timeline with circle checkpoints on a hairline rule. Navigation is a single fixed top bar: logo left, link cluster center-left, login + dark pill CTA right. No sidebar, no mega-menu.

## Agent Prompt Guide

Quick Color Reference:
• text: #131315 (charcoal)
• background: #ffffff (canvas), #f7f5ff (bone secondary)
• border: #d0d0d0 (hairline), #444444 (input)
• accent: #855cf7 (logo/active tab), #dacefd (lavender whisper)
• primary action: #131315 (filled action)

3-5 Example Component Prompts:

1. Hero section: white #ffffff canvas. Display headline at 72px Inter Display weight 400, color #131315, letter-spacing -0.03em (-2.16px), line-height 1.1. Muted paragraph at 18px weight 400, #717173. Two buttons side by side: ghost pill (1.5px #131315 border, 35px radius, #131315 text, 15px 24px padding) + dark pill (#131315 fill, white text, 35px radius, hard 8px 8px 0px 0px #f1f1f1 shadow, 15px 24px padding). Centered stack, max-width 900px.

2. Announcement pill: 1px #dacefd border, fully rounded (999px), Aux Mono 14px text in #855cf7, transparent fill, 6px 14px padding, centered above hero with 16px bottom margin.

3. Tab nav strip: four labels in Inter Display 16px #717173, evenly spaced across full width, 1px #d0d0d0 hairline beneath entire row, 2px solid #855cf7 underline directly below the active tab label only.

4. Product screenshot card: 14px radius, 1px inset rgba(0,0,0,0.05) border, no outer shadow, 24px padding, sitting on #f7f5ff bone surface. Image fills the card edge-to-edge with no rounded inner clipping.

5. Timeline step row: three columns with Aux Mono 14px eyebrow in #717173, Inter Display 24px heading in #131315, 16px body text in #717173. Full-width 1px #d0d0d0 rule below, 2px solid #131315 circle markers (10px diameter) at each step column position; outlined circle for inactive steps.

## Similar Brands

- **Linear** — Same single-weight display type, near-monochrome canvas, pill CTAs with offset flat shadows, and editorial negative tracking on headlines
- **Vercel** — Inter-family typography with compressed letter-spacing, bone-white canvas, full-bleed photography breaks, and minimal component ornamentation
- **Frame.io** — Media-product focus, dark pill primary button on white, and a restrained palette that lets imagery carry the brand
- **Pitch** — Editorial SaaS sensibility with single-weight display headlines, generous section breathing room, and a single muted accent color against monochrome UI

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-charcoal-ink: #131315;
  --color-pure-white: #ffffff;
  --color-bone: #f7f5ff;
  --color-cutout-gray: #f1f1f1;
  --color-slate-mid: #717173;
  --color-hairline: #d0d0d0;
  --color-deep-charcoal: #444444;
  --color-logo-violet: #855cf7;
  --color-lavender-trace: #dacefd;

  /* Typography — Font Families */
  --font-sans-serif: 'sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter-display: 'Inter Display', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-aux-mono: 'Aux Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.2;
  --tracking-caption: -0.12px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.29;
  --tracking-body-sm: -0.14px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.16px;
  --text-subheading: 20px;
  --leading-subheading: 1.4;
  --tracking-subheading: -0.2px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.3;
  --tracking-heading-sm: -0.24px;
  --text-heading: 32px;
  --leading-heading: 1.22;
  --tracking-heading: -0.96px;
  --text-heading-lg: 48px;
  --leading-heading-lg: 1.15;
  --tracking-heading-lg: -1.44px;
  --text-display: 72px;
  --leading-display: 1.1;
  --tracking-display: -2.16px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-5: 5px;
  --spacing-6: 6px;
  --spacing-7: 7px;
  --spacing-8: 8px;
  --spacing-9: 9px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-15: 15px;
  --spacing-20: 20px;
  --spacing-25: 25px;
  --spacing-30: 30px;
  --spacing-40: 40px;
  --spacing-50: 50px;
  --spacing-60: 60px;
  --spacing-100: 100px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 100px;
  --card-padding: 24px;
  --element-gap: 10px;

  /* Border Radius */
  --radius-sm: 2px;
  --radius-lg: 9px;
  --radius-xl: 14px;
  --radius-2xl: 20px;
  --radius-2xl-2: 23px;
  --radius-3xl: 35px;

  /* Named Radii */
  --radius-tabs: 2px;
  --radius-cards: 14px;
  --radius-inputs: 9px;
  --radius-buttons: 35px;
  --radius-smallchips: 2px;
  --radius-secondarybuttons: 20px;

  /* Shadows */
  --shadow-subtle: rgb(241, 241, 241) 8px 8px 0px 0px;
  --shadow-subtle-2: rgba(226, 226, 227, 0.5) 10px 10px 0px -2px;
  --shadow-sm: rgba(19, 19, 21, 0.12) 0px 1px 4px 0px;
  --shadow-sm-2: rgba(0, 0, 0, 0.2) 0px 3px 4px 0px;
  --shadow-subtle-3: rgba(0, 0, 0, 0.05) 0px 0px 0px 1px inset;

  /* Surfaces */
  --surface-canvas: #ffffff;
  --surface-bone: #f7f5ff;
  --surface-cutout: #f1f1f1;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-charcoal-ink: #131315;
  --color-pure-white: #ffffff;
  --color-bone: #f7f5ff;
  --color-cutout-gray: #f1f1f1;
  --color-slate-mid: #717173;
  --color-hairline: #d0d0d0;
  --color-deep-charcoal: #444444;
  --color-logo-violet: #855cf7;
  --color-lavender-trace: #dacefd;

  /* Typography */
  --font-sans-serif: 'sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter-display: 'Inter Display', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-aux-mono: 'Aux Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.2;
  --tracking-caption: -0.12px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.29;
  --tracking-body-sm: -0.14px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.16px;
  --text-subheading: 20px;
  --leading-subheading: 1.4;
  --tracking-subheading: -0.2px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.3;
  --tracking-heading-sm: -0.24px;
  --text-heading: 32px;
  --leading-heading: 1.22;
  --tracking-heading: -0.96px;
  --text-heading-lg: 48px;
  --leading-heading-lg: 1.15;
  --tracking-heading-lg: -1.44px;
  --text-display: 72px;
  --leading-display: 1.1;
  --tracking-display: -2.16px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-5: 5px;
  --spacing-6: 6px;
  --spacing-7: 7px;
  --spacing-8: 8px;
  --spacing-9: 9px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-15: 15px;
  --spacing-20: 20px;
  --spacing-25: 25px;
  --spacing-30: 30px;
  --spacing-40: 40px;
  --spacing-50: 50px;
  --spacing-60: 60px;
  --spacing-100: 100px;

  /* Border Radius */
  --radius-sm: 2px;
  --radius-lg: 9px;
  --radius-xl: 14px;
  --radius-2xl: 20px;
  --radius-2xl-2: 23px;
  --radius-3xl: 35px;

  /* Shadows */
  --shadow-subtle: rgb(241, 241, 241) 8px 8px 0px 0px;
  --shadow-subtle-2: rgba(226, 226, 227, 0.5) 10px 10px 0px -2px;
  --shadow-sm: rgba(19, 19, 21, 0.12) 0px 1px 4px 0px;
  --shadow-sm-2: rgba(0, 0, 0, 0.2) 0px 3px 4px 0px;
  --shadow-subtle-3: rgba(0, 0, 0, 0.05) 0px 0px 0px 1px inset;
}
```
