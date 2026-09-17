# OpenWeb — Style Reference
> Editorial broadsheet on warm rose paper. A blush canvas carries enormous serif headlines and one electric-blue accent — the whole page reads like a printed editorial spread rebuilt as a screen, where type weight and warm negative space replace panels, borders, and shadows.

**Theme:** light

OpenWeb reads like an editorial broadsheet printed on warm rose paper: a single blush canvas (#f1e9e7), nearly all-black type set in a sharp transitional serif, and one vivid electric blue as the only chromatic accent. The interface is almost entirely typographic — no card shadows, no panel borders, no decorative dividers — letting huge serif headlines at 70–90px with aggressively tight negative tracking do all the structural work. Black filled buttons and ghost blue links provide the only UI punctuation; everything else is whitespace, line breaks, and the warm paper tone. The mood is literary and considered, not app-like; pages feel closer to a magazine spread than a SaaS dashboard.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Blush Paper | `#f1e9e7` | `--color-blush-paper` | Page canvas, all section backgrounds — the warm rose-tinted ground that gives the entire site its editorial, printed-on-paper feel. Never a flat white, never a cool gray |
| Carbon Ink | `#000000` | `--color-carbon-ink` | Primary text, filled buttons, all iconography, form labels, footer rules. The dominant non-canvas color — drives every typographic and interactive element |
| Bone White | `#ffffff` | `--color-bone-white` | Text color inside filled black buttons, reverse-fill surfaces, and form input contrast. Used sparingly as the counter-tone to Carbon Ink |
| Fossil Gray | `#7b7f83` | `--color-fossil-gray` | Muted helper text, secondary metadata, subdued form placeholder tones. The only neutral that softens Carbon Ink for non-primary copy |
| Signal Blue | `#0058fe` | `--color-signal-blue` | Violet accent for outlined action borders, linked labels, and lightweight interactive emphasis. |

## Tokens — Typography

### Copernicus — Copernicus carries the entire voice — it is a high-contrast transitional serif whose terminals and sharp serifs make 70–90px display sizes feel literary rather than decorative. The signature move is its aggressive negative tracking: -0.092em at 90px tightens the headline into a near-solid mass of type, which against the warm blush ground reads as a printed editorial pull-quote, not a SaaS H1. Body sizes (15–18px) sit at near-normal tracking, so the tension between tight display and loose running text mirrors a magazine spread. · `--font-copernicus`
- **Substitute:** Playfair Display (display), Lora (body), or any high-contrast transitional serif — Source Serif Pro as a free fallback
- **Weights:** 400, 700
- **Sizes:** 11, 14, 15, 16, 18, 25, 30, 40, 48, 60, 70, 80, 90
- **Line height:** 0.84, 1.00, 1.04, 1.05, 1.08, 1.10, 1.15, 1.17, 1.20, 1.21, 1.27, 1.28, 1.30
- **Letter spacing:** -0.092em at 90px display, scaling to -0.047em at 30px, -0.010em at 16px body, 0em at 14px and below
- **OpenType features:** `"liga" on, "kern" on`
- **Role:** Copernicus carries the entire voice — it is a high-contrast transitional serif whose terminals and sharp serifs make 70–90px display sizes feel literary rather than decorative. The signature move is its aggressive negative tracking: -0.092em at 90px tightens the headline into a near-solid mass of type, which against the warm blush ground reads as a printed editorial pull-quote, not a SaaS H1. Body sizes (15–18px) sit at near-normal tracking, so the tension between tight display and loose running text mirrors a magazine spread.

### Helvetica — A vestigial system-font presence — appears only in minor utility spots (small labels, icons-in-text). Not a typographic voice; effectively a fallback safety net. · `--font-helvetica`
- **Substitute:** system-ui, -apple-system, Helvetica, Arial, sans-serif
- **Weights:** 400
- **Sizes:** 15
- **Line height:** 1.50
- **Letter spacing:** 0.0070em
- **Role:** A vestigial system-font presence — appears only in minor utility spots (small labels, icons-in-text). Not a typographic voice; effectively a fallback safety net.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| nano | 11px | 1.3 | — | `--text-nano` |
| caption | 14px | 1.3 | — | `--text-caption` |
| body | 16px | 1.27 | -0.16px | `--text-body` |
| body-lg | 18px | 1.21 | -0.216px | `--text-body-lg` |
| subheading | 25px | 1.15 | -0.875px | `--text-subheading` |
| heading | 40px | 1.08 | -2px | `--text-heading` |
| heading-lg | 48px | 1.05 | -2.69px | `--text-heading-lg` |
| heading-xl | 60px | 1.04 | -3.78px | `--text-heading-xl` |
| display | 70px | 1 | -4.83px | `--text-display` |
| display-lg | 90px | 0.84 | -8.28px | `--text-display-lg` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 8 | 8px | `--spacing-8` |
| 12 | 12px | `--spacing-12` |
| 16 | 16px | `--spacing-16` |
| 20 | 20px | `--spacing-20` |
| 24 | 24px | `--spacing-24` |
| 32 | 32px | `--spacing-32` |
| 36 | 36px | `--spacing-36` |
| 40 | 40px | `--spacing-40` |
| 60 | 60px | `--spacing-60` |
| 80 | 80px | `--spacing-80` |
| 100 | 100px | `--spacing-100` |
| 120 | 120px | `--spacing-120` |
| 140 | 140px | `--spacing-140` |
| 188 | 188px | `--spacing-188` |
| 220 | 220px | `--spacing-220` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 0px |
| inputs | 0px |
| buttons | 0px |
| largeSurface | 40px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80-120px
- **Card padding:** 30px
- **Element gap:** 15px

## Components

### Filled Black CTA Button
**Role:** Primary action surface — used for 'Contact us' in the nav, 'Let's talk', 'Get In Touch'

Solid #000000 background, #ffffff text, Copernicus 15px italic 400, 10–12px vertical padding and ~20px horizontal padding, 0px border-radius (square corners — the sharp edges are intentional, echoing the serif terminals). No shadow, no border, no hover lift; on hover the background remains black with subtle opacity shift. The italic treatment on the label gives it a handwritten-editorial weight.

### Ghost Tab Selector
**Role:** Active/inactive section toggle — visible on the contact form (Publisher / Advertiser)

No background, no border, no box. Active tab is Copernicus ~40px italic in #0058fe; inactive tab is the same size and weight in #000000. A single hairline divider rule above separates the tab row from the form. The blue italic signals selection through color and slant alone — no underline, no pill, no fill.

### Inline Link
**Role:** In-prose hyperlinks (e.g. 'legal@openweb.com')

Underlined in #0058fe, sitting inline with the surrounding body copy at 15–18px Copernicus 400. Color is the only differentiator from body text — no bold, no weight change, no background highlight. Signal Blue is reserved for this role; body copy is never blue.

### Bottom-Border Text Input
**Role:** Form fields — Work Email, Job Title, message

No background, no surrounding box. A single 1px #000000 bottom border defines the field. Label sits above the input in Copernicus 14–15px 400 #000000 with an asterisk for required fields. Placeholder text in #7b7f83 at the same size. Focus state deepens the bottom border to ~2px or shifts it to #0058fe — no outline glow, no floating label animation.

### Radio Option Row
**Role:** Single-select form options under 'What Are You Interested In?'

Custom circular radio: 18px outer ring, 1px #000000 border, #0058fe fill on the inner dot when selected. Label sits to the right in Copernicus 15px 400 #000000. No background highlight on the row, no card wrapper — the radio is the only visual unit.

### Navigation Bar
**Role:** Top-of-page site navigation

Full-width Blush Paper background, no border, no shadow. Logo (OpenWeb wordmark + sunburst icon) left-aligned in #000000, nav items centered/left-aligned as plain Copernicus 14–15px text with chevron dropdowns, and the Filled Black CTA Button right-aligned. ~60–72px tall, generous breathing room. A single hairline #000000 rule sits beneath the bar.

### Hairline Divider Rule
**Role:** Structural separator between sections and within the footer

1px solid #000000, full-width or content-width. The only structural line in the system — replaces borders, card edges, and section transitions that other systems would draw with shadows or backgrounds.

### Isometric Phone Mockup
**Role:** Product showcase — appears in the middle scroll section showing comment threads

Photorealistic device renders (smartphone and laptop) presented at a 15–20° isometric angle, floating on the Blush Paper canvas with no cast shadow. The devices themselves contain realistic UI screenshots of the OpenWeb comment product. A ~40px border-radius on the device frame softens the otherwise sharp system.

### Footer Column Block
**Role:** Bottom-of-page link groups — Publishers, Advertisers, Resources, About

Four equal columns of plain text links in Copernicus 14–15px 400 #000000, separated from the body by a top hairline rule. No headings, no icons, no social-link styling beyond simple circular outlined badges in the row above. The footer sits on the same Blush Paper canvas as the rest of the site.

### Social Link Badge
**Role:** LinkedIn and Threads icons in the footer

Small circular outline (~32px diameter, 1px #000000 border), icon centered inside in #000000. No fill, no background — the circle is implied only by the stroke.

## Do's and Don'ts

### Do
- Set all body and heading type in Copernicus (or a high-contrast transitional serif substitute) at the sizes in the type scale — never substitute a sans-serif for the running text.
- Use #f1e9e7 (Blush Paper) as the canvas for every section; do not introduce white, cool gray, or any other background tone.
- Reserve #0058fe (Signal Blue) exclusively for active states, in-prose links, and the active tab — never use it for fills, large surfaces, or decorative accents.
- Apply aggressive negative tracking to all display sizes (≥40px): at minimum -0.047em, scaling to -0.092em at 90px. Body sizes (15–18px) stay at near-zero tracking.
- Use the Filled Black CTA Button (sharp 0px corners, italic Copernicus label) as the single button variant; pair it with the Inline Link pattern for secondary actions.
- Separate sections and structure pages with 1px #000000 hairline rules rather than borders, shadows, or background tints.
- Center key editorial blocks (hero, section headings, body paragraphs) at a 1200px max-width with generous 80–120px section gaps.

### Don't
- Do not add drop shadows, glows, or any box-shadow value to cards, buttons, or floating elements — the system is flat by design.
- Do not use border-radius on buttons, inputs, badges, or tags — keep them at 0px. The only rounded element is the 40px isometric device mockup.
- Do not introduce a second accent color or a second blue shade — Signal Blue is the only chromatic note in the system.
- Do not set large display type in anything but Copernicus 400 with negative tracking — bold weights break the editorial feel.
- Do not use a sans-serif for body copy, nav items, or button labels — the serif is the voice; sans-serif ruins the broadsheet illusion.
- Do not wrap content in cards with backgrounds, borders, or padding blocks — let type sit directly on the Blush Paper canvas.
- Do not use #ffffff as a page or section background — it will flatten the warm editorial tone that defines the brand.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Blush Paper | `#f1e9e7` | Page canvas — the single base surface for the entire site |
| 2 | Carbon Ink | `#000000` | Filled button surface and inverted text background |
| 3 | Bone White | `#ffffff` | Reverse-fill elements (button labels, form field text) on Carbon Ink |

## Elevation

The system intentionally avoids all box-shadows and z-axis elevation. Depth is communicated exclusively through the warm Blush Paper canvas against Carbon Ink type and a single hairline rule. A filled black button reads as 'pressed' through color contrast alone, not through a drop shadow — a deliberate editorial choice that keeps every page on a single typographic plane.

## Imagery

Imagery is sparse and product-focused: the only visual elements are photorealistic device renders (smartphone and laptop) shown at a 15–20° isometric angle, floating on the Blush Paper canvas with no cast shadow. The device screens contain realistic UI screenshots of the OpenWeb comment product with real content (article text, user comments, profile images). No photography, no illustration, no abstract graphics, no decorative shapes — the OpenWeb sunburst logo is the sole brand mark and appears flat in Carbon Ink. The overall visual density is text-dominant; imagery occupies maybe 15–20% of any given screen and exists only to demonstrate the product.

## Layout

The page model is centered and max-width contained at ~1200px, with the Blush Paper canvas extending full-bleed behind. The hero is a single vertical stack: centered sunburst logo, a 70–90px display headline set on two lines, a 3–4 line body paragraph at 15–18px, and a Filled Black CTA Button — all centered, with 40–60px of vertical breathing room between elements. Section rhythm is single-column editorial: each subsequent block is a centered headline + short paragraph, often interrupted by a full-bleed isometric device mockup. There are no card grids, no multi-column feature blocks, no sidebars. Navigation is a flat top bar with a logo, four text links with dropdown chevrons, and a right-aligned black CTA button. The footer is a 4-column text link grid separated from the body by a single hairline rule.

## Agent Prompt Guide

**Quick Color Reference**
- text: #000000 (Carbon Ink)
- background: #f1e9e7 (Blush Paper)
- border: #000000 (hairline rules only)
- accent: #0058fe (Signal Blue — links, active tab, radio dot)
- muted text: #7b7f83 (Fossil Gray)
- primary action: #000000 (filled action)

**Example Component Prompts**

1. *Hero block*: Blush Paper (#f1e9e7) canvas, centered sunburst logo in #000000, then a 70px Copernicus weight 400 headline in #000000 with letter-spacing -4.83px set across two lines, followed by a 18px body paragraph (line-height 1.21, letter-spacing -0.216px) in #000000, then a Filled Black CTA Button (10px 20px padding, 0px radius, italic 15px Copernicus #ffffff). All elements centered, 40px vertical gap between them, max-width 1200px.

2. *Ghost tab selector*: Two tab labels (Publisher, Advertiser) in 40px Copernicus italic 400, the active tab in #0058fe, the inactive tab in #000000, separated from a form below by a 1px #000000 hairline rule. No background, no underline, no border on the tabs themselves.

3. *Bottom-border text input*: Label above in 14px Copernicus 400 #000000 with required asterisk, then a transparent input with a 1px #000000 bottom border only, 15px Copernicus placeholder text in #7b7f83. No box, no background, no rounded corners.

4. *Inline link inside a body paragraph*: A 15–18px Copernicus body sentence in #000000 with a single word wrapped in #0058fe underline — color and underline are the only differentiators from the surrounding text.

5. *Isometric device mockup section*: Blush Paper canvas, a photorealistic smartphone rendered at 15° isometric, floating with no shadow, screen showing a realistic comment-thread UI, max-width 800px, centered, with 80–120px of empty Blush Paper above and below.

## Similar Brands

- **The New Yorker (newyorker.com)** — Same editorial-on-warm-paper feel: warm off-white canvas, large high-contrast serif headlines, generous whitespace, no card UI, and a single muted accent color reserved for links and active states
- **Substack (onboardings and brand pages)** — Shared publisher-magazine identity — huge serif display type, centered editorial blocks, hairline rules instead of borders, and a near-monochrome palette with one vivid accent
- **Are.na** — Same restraint philosophy — typographic-first design, warm neutral canvas, no shadows or decorative surfaces, and serif-led type that treats the page as a reading surface rather than an app
- **Notion (marketing site)** — Same minimalism with large display headlines and a single warm canvas tone, though OpenWeb leans editorial-serif where Notion uses sans-serif

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-blush-paper: #f1e9e7;
  --color-carbon-ink: #000000;
  --color-bone-white: #ffffff;
  --color-fossil-gray: #7b7f83;
  --color-signal-blue: #0058fe;

  /* Typography — Font Families */
  --font-copernicus: 'Copernicus', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-helvetica: 'Helvetica', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-nano: 11px;
  --leading-nano: 1.3;
  --text-caption: 14px;
  --leading-caption: 1.3;
  --text-body: 16px;
  --leading-body: 1.27;
  --tracking-body: -0.16px;
  --text-body-lg: 18px;
  --leading-body-lg: 1.21;
  --tracking-body-lg: -0.216px;
  --text-subheading: 25px;
  --leading-subheading: 1.15;
  --tracking-subheading: -0.875px;
  --text-heading: 40px;
  --leading-heading: 1.08;
  --tracking-heading: -2px;
  --text-heading-lg: 48px;
  --leading-heading-lg: 1.05;
  --tracking-heading-lg: -2.69px;
  --text-heading-xl: 60px;
  --leading-heading-xl: 1.04;
  --tracking-heading-xl: -3.78px;
  --text-display: 70px;
  --leading-display: 1;
  --tracking-display: -4.83px;
  --text-display-lg: 90px;
  --leading-display-lg: 0.84;
  --tracking-display-lg: -8.28px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-36: 36px;
  --spacing-40: 40px;
  --spacing-60: 60px;
  --spacing-80: 80px;
  --spacing-100: 100px;
  --spacing-120: 120px;
  --spacing-140: 140px;
  --spacing-188: 188px;
  --spacing-220: 220px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80-120px;
  --card-padding: 30px;
  --element-gap: 15px;

  /* Border Radius */
  --radius-3xl: 40px;

  /* Named Radii */
  --radius-tags: 0px;
  --radius-inputs: 0px;
  --radius-buttons: 0px;
  --radius-largesurface: 40px;

  /* Surfaces */
  --surface-blush-paper: #f1e9e7;
  --surface-carbon-ink: #000000;
  --surface-bone-white: #ffffff;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-blush-paper: #f1e9e7;
  --color-carbon-ink: #000000;
  --color-bone-white: #ffffff;
  --color-fossil-gray: #7b7f83;
  --color-signal-blue: #0058fe;

  /* Typography */
  --font-copernicus: 'Copernicus', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-helvetica: 'Helvetica', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-nano: 11px;
  --leading-nano: 1.3;
  --text-caption: 14px;
  --leading-caption: 1.3;
  --text-body: 16px;
  --leading-body: 1.27;
  --tracking-body: -0.16px;
  --text-body-lg: 18px;
  --leading-body-lg: 1.21;
  --tracking-body-lg: -0.216px;
  --text-subheading: 25px;
  --leading-subheading: 1.15;
  --tracking-subheading: -0.875px;
  --text-heading: 40px;
  --leading-heading: 1.08;
  --tracking-heading: -2px;
  --text-heading-lg: 48px;
  --leading-heading-lg: 1.05;
  --tracking-heading-lg: -2.69px;
  --text-heading-xl: 60px;
  --leading-heading-xl: 1.04;
  --tracking-heading-xl: -3.78px;
  --text-display: 70px;
  --leading-display: 1;
  --tracking-display: -4.83px;
  --text-display-lg: 90px;
  --leading-display-lg: 0.84;
  --tracking-display-lg: -8.28px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-36: 36px;
  --spacing-40: 40px;
  --spacing-60: 60px;
  --spacing-80: 80px;
  --spacing-100: 100px;
  --spacing-120: 120px;
  --spacing-140: 140px;
  --spacing-188: 188px;
  --spacing-220: 220px;

  /* Border Radius */
  --radius-3xl: 40px;
}
```
