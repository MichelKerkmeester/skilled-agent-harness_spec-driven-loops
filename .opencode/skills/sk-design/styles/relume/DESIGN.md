# Relume — Style Reference
> Cream canvas, one violet spark.

**Theme:** light

Relume is a light-mode, warm-neutral AI design tool that pairs a cream canvas with confident oversized type and a single electric violet as its only chromatic accent. The visual language is built on a custom grotesque ('Relative') that runs from a 224px hero down to 12px captions without ever leaving the family, giving the site one continuous typographic voice. A signature three-stop orange-to-red-to-violet gradient punctuates the page — applied to text on the word 'faster' and as a hairline border on the primary prompt input — making the otherwise restrained palette feel switched on. Cards float on white against the warm canvas with soft shadows and 16px radii, while the primary CTA button is a solid violet (#6248ff) that doesn't fight for attention but always wins it.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Electric Iris | `linear-gradient(100deg, rgb(255, 116, 72), rgb(255, 72, 72) 42%, rgb(98, 72, 255) 85%)` | `--color-electric-iris` | Violet action color for filled buttons, selected navigation states, and focused conversion moments. |
| Soft Lilac | `#b8adf5` | `--color-soft-lilac` | Decorative icon strokes, subtle border accents, secondary violet UI |
| Iris Mist | `#e0daff` | `--color-iris-mist` | Hover wash on violet buttons, soft chip backgrounds, tinted surface |
| Ink | `#161616` | `--color-ink` | Primary text, primary outline-button border, dark CTA text on light surfaces, icon strokes |
| Graphite | `#222222` | `--color-graphite` | Secondary dark text, body text on light surfaces |
| Slate | `#333333` | `--color-slate` | Muted image labels, dim link text, tertiary content |
| Iron | `#4d4d4c` | `--color-iron` | Subheadings, mid-emphasis labels, structural borders on dark sections |
| Fog | `#686868` | `--color-fog` | Muted helper text, meta labels, link text, badge text, secondary copy |
| Bone | `#e4e2df` | `--color-bone` | Hairline card borders, image placeholder backgrounds, soft dividers |
| Cream | `#f1f0ee` | `--color-cream` | Page canvas, icon stroke backgrounds, neutral badge fills, base surface |
| Paper | `#ffffff` | `--color-paper` | Card surfaces, elevated panels, input fields, button backgrounds |
| Acid Lemon | `#f0f41a` | `--color-acid-lemon` | Occasional high-energy accent wash on dark surfaces, highlight tags |

## Tokens — Typography

### Relative — All UI text — display headlines at 224/96/56/48px weight 500, body at 16–18px weight 400, captions at 12–14px weight 400. The single-family approach is deliberate: by keeping every level inside Relative, the brand avoids the 'body sans vs display sans' split most sites fall into, creating a unified typographic voice. Tight tracking (-0.02em to -0.03em) on all display sizes gives the large headlines a compressed, confident stance without becoming stencil-like. · `--font-relative`
- **Substitute:** Inter, with 'cv11' and 'ss01' features enabled to approximate Relative's geometric quirks
- **Weights:** 400, 500
- **Sizes:** 12, 13, 14, 15, 16, 17, 18, 20, 24, 32, 40, 48, 56, 224
- **Line height:** 1.00–1.50
- **Letter spacing:** -0.03em at 56px and above, -0.02em at 32–48px, normal at body sizes
- **OpenType features:** `"ss01" on, "cv11" on`
- **Role:** All UI text — display headlines at 224/96/56/48px weight 500, body at 16–18px weight 400, captions at 12–14px weight 400. The single-family approach is deliberate: by keeping every level inside Relative, the brand avoids the 'body sans vs display sans' split most sites fall into, creating a unified typographic voice. Tight tracking (-0.02em to -0.03em) on all display sizes gives the large headlines a compressed, confident stance without becoming stencil-like.

### Relative Faux — Reserved for the largest display moment (the secondary 'Ship faster' hero). A faux/display variant with slightly looser proportions, used once per page as a typographic exclamation point. Distinguishes that one moment from the standard Relative display weight elsewhere. · `--font-relative-faux`
- **Substitute:** Inter Display
- **Weights:** 400
- **Sizes:** 96
- **Line height:** 1.10
- **Letter spacing:** -0.02em
- **Role:** Reserved for the largest display moment (the secondary 'Ship faster' hero). A faux/display variant with slightly looser proportions, used once per page as a typographic exclamation point. Distinguishes that one moment from the standard Relative display weight elsewhere.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.5 | — | `--text-caption` |
| body-sm | 14px | 1.5 | — | `--text-body-sm` |
| body | 16px | 1.5 | — | `--text-body` |
| subheading | 18px | 1.5 | — | `--text-subheading` |
| heading-sm | 24px | 1.4 | — | `--text-heading-sm` |
| heading | 32px | 1.4 | -0.02px | `--text-heading` |
| heading-lg | 48px | 1.2 | -0.02px | `--text-heading-lg` |
| display | 56px | 1.2 | -0.03px | `--text-display` |
| display-xl | 96px | 1.1 | -0.02px | `--text-display-xl` |
| display-hero | 224px | 1 | -0.03px | `--text-display-hero` |

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
| 48 | 48px | `--spacing-48` |
| 64 | 64px | `--spacing-64` |
| 72 | 72px | `--spacing-72` |
| 80 | 80px | `--spacing-80` |
| 112 | 112px | `--spacing-112` |
| 120 | 120px | `--spacing-120` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 16px |
| pills | 320px |
| badges | 8px |
| inputs | 8px |
| buttons | 8px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| subtle | `rgba(0, 0, 0, 0.08) 0px 1px 3px 0px, rgba(0, 0, 0, 0.04) ...` | `--shadow-subtle` |
| md | `rgba(0, 0, 0, 0.08) 0px 8px 10px -4px, rgba(0, 0, 0, 0.05...` | `--shadow-md` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 64px
- **Card padding:** 16-24px
- **Element gap:** 8-16px

## Components

### Primary CTA Button
**Role:** Main conversion action (e.g., 'Generate', 'Start for free')

Solid Electric Iris (#6248ff) background, white text, 8px radius, 12px vertical / 20px horizontal padding, Relative 16px weight 500. Soft 1px-offset shadow. Hover: iris mist (#e0daff) background tint. Used for the highest-intent single action per surface.

### Dark Outline Button
**Role:** Secondary top-bar action ('Start for free' in header)

Ink (#161616) 1px border, transparent or Paper (#ffffff) fill, Ink text, 8px radius, 12px vertical / 20px horizontal padding, Relative 16px weight 500. The dark outline against the cream canvas reads as confident without competing with the violet primary.

### Ghost Nav Button
**Role:** Nav links and tertiary actions

No border, no background, Ink (#161616) text, 16px weight 500, hover shows Fog (#686868) color shift. Used for 'Log in' and most nav items.

### Pill Badge
**Role:** Trust signal, inline meta label

320px border-radius, Paper (#ffffff) background, 1px Bone (#e4e2df) border, 6px vertical / 12px horizontal padding, 14px weight 500 text. The '1 Million+' badge uses a violet text accent (#6248ff) on the number for emphasis.

### Feature Card (Sitemap/Wireframe/Style Guide)
**Role:** Three-column feature showcase in the primary product row

Paper (#ffffff) background, Bone (#e4e2df) 1px border, 16px radius, 24px internal padding, dual-layer shadow (8/10/-4px + 2/10/2px). Category label at top in colored 14px (violet/teal/coral), title at 40px weight 500, description at 16px weight 400 in Fog (#686868), ghost 'Give it a try' link button. Contains a 16px-radius image preview that bleeds nearly to the card edge.

### Category Label
**Role:** Color-coded eyebrow above feature card titles

14px weight 500, colored per slot: Electric Iris ('Plan'), a teal/blue for ('Structure'), and Ember coral ('Conceptualise') drawn from the gradient stops. Centered above the card title, 4px below the card top edge.

### Prompt Input Bar
**Role:** Hero CTA — the 'describe a company' input that generates output

Container has a 2px gradient border (ember→crimson→iris, linear 100deg) at 320px-radius, wrapping a Paper (#ffffff) input field with 8px radius. Input text 16px weight 400, placeholder in Fog (#686868). Submit button is the Primary CTA Button nested inside. This is the most distinctive component — the gradient border is the brand's visual signature applied to its most important UI.

### Logo Strip
**Role:** Social proof band above the secondary hero

Horizontal row of partner logos in Iron (#4d4d4c), evenly spaced, 32px tall, centered. No background, no border, sits directly on the Cream canvas.

### Gradient Display Text
**Role:** Highlighted word inside a headline

A single word inside a larger headline (e.g., 'faster' inside 'Ship faster') is filled with the signature 3-stop gradient using background-clip: text. The rest of the headline is Fog (#686868) at 96px. This is the one place color is allowed to shout.

### Floating Preview Card
**Role:** Decorative site mockups flanking the hero headline

8px radius, Paper (#ffffff) background, 1px Bone border, contains a website mockup screenshot. Scattered around the hero at slight rotation to suggest a canvas of work. Not interactive — purely atmospheric.

### Testimonial Chip
**Role:** Person label on the floating preview cards

Small pill with Soft Lilac (#b8adf5) or Acid Lemon (#f0f41a) background, name in Ink at 13px weight 500, 8px radius, floats as a tag on the preview card corner.

### Primary Nav Bar
**Role:** Top-level site navigation

Cream canvas background, no border, 64px tall, Relume mark at left (hexagon glyph + wordmark), nav links center-left in Ink 16px, 'Log in' + Dark Outline Button at right. Spacing between nav items: 24px.

## Do's and Don'ts

### Do
- Use Electric Iris (#6248ff) exclusively for the single highest-intent action per surface — never two violet CTAs competing on the same screen.
- Apply the ember→crimson→iris gradient via background-clip:text on exactly one word per headline, and as a 2px border on the prompt input — these are the only places the gradient should appear.
- Set display headlines (32px and above) to weight 500 with -0.02em to -0.03em tracking; the combination of medium weight and tight spacing is what gives Relative its confident, compressed stance.
- Card radius: 16px for feature cards and images, 8px for buttons, inputs, and badges. Never mix these — the two-tier system is the spatial grammar.
- Pair Paper (#ffffff) card surfaces with Cream (#f1f0ee) page canvas and a 1px Bone (#e4e2df) border. The contrast between card and canvas carries hierarchy before any shadow is applied.
- Use Fog (#686868) for all secondary/muted text. Reserve Ink (#161616) for headings, primary copy, and dark outline button text only.
- Stagger floating preview cards around hero headlines at slight rotation to suggest a working canvas — the product IS the decoration.

### Don't
- Don't introduce a second chromatic accent. The site is 1% colorful by design — every new color dilutes the violet's impact.
- Don't use shadows larger than the dual-layer card shadow (8/10/-4px + 2/10/2px). The shadow system is whisper-thin; anything heavier breaks the cream-canvas lightness.
- Don't set body text below 14px or above 18px. The 14–18px band is the readable comfort zone; captions sit at 12–13px only for legal/meta.
- Don't apply the gradient to backgrounds, buttons, or large surfaces. It belongs only on text (background-clip) and the 2px input border.
- Don't use the Acid Lemon (#f0f41a) as a fill on light surfaces — it's a dark-surface accent only and will vibrate uncomfortably on Cream.
- Don't combine a violet button with a dark outline button on the same hero — pick one. The dark outline lives in the nav; the violet lives in the prompt.
- Don't break the single-font rule. Every level of hierarchy, including the 224px display, stays inside Relative. Introducing a second face fragments the typographic voice.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Canvas | `#f1f0ee` | Page background, base of all sections |
| 2 | Card | `#ffffff` | Feature cards, product preview panels, input fields |
| 3 | Elevated | `#ffffff` | Hover-lifted cards, modal surfaces, dropdowns |
| 4 | Tinted | `#e0daff` | Soft violet wash for hover states and tinted chips |

## Elevation

- **Primary Button:** `0px 1px 3px rgba(0, 0, 0, 0.08), 0px 1px 2px rgba(0, 0, 0, 0.04)`
- **Feature Card:** `0px 8px 10px -4px rgba(0, 0, 0, 0.08), 0px 2px 10px 2px rgba(0, 0, 0, 0.05)`

## Imagery

Imagery is product-first, not lifestyle: tight crops of website mockups, sitemap diagrams, and wireframe panels rendered as the heroes of their own cards. The floating cards in the hero show real product output (sitemaps, style guides, wireframes) at slight rotation — the tool's own output IS the decoration. Photography is absent; the site speaks through UI screenshots and the occasional portrait thumbnail inside testimonial chips. Color treatment on product screenshots is untouched (raw browser output), but testimonial avatars sit on Soft Lilac or Acid Lemon circular backgrounds. Icons are inline and minimal: a hexagon mark for the wordmark, and 1.5px-stroke line icons elsewhere. The overall density is image-light — most visual weight comes from typography and whitespace, not from pictures.

## Layout

Max-width 1200px centered content on a full-bleed Cream canvas. The hero is a centered headline stack (224px 'Websites designed & built faster with AI') with floating preview cards scattered at slight rotations around the edges — asymmetric, playful, never grid-locked. Below the prompt input, sections alternate between a 3-column equal feature card grid and full-width centered-band sections (logo strip, secondary 'Ship faster' hero). Section gap is 64px with generous internal padding (24-48px). The secondary hero uses a 2-column split: text-left at 40% width, product preview-right at 60%, with the gradient-text 'faster' word as the visual anchor. Navigation is a minimal 64px-tall top bar with no sticky behavior, transparent over the cream canvas. Card grids use 3 columns at desktop with 24px gaps, collapsing to 1 column on mobile. The overall rhythm is: one big hero moment, three-card feature row, logo proof band, one secondary hero moment — a 4-beat structure that repeats.

## Agent Prompt Guide

**Quick Color Reference**
- text (primary): #161616 Ink
- text (muted): #686868 Fog
- background (canvas): #f1f0ee Cream
- background (card): #ffffff Paper
- border: #e4e2df Bone
- accent / primary action: #6248ff (filled action)
- gradient: ember (#ff7448) → crimson (#ff4848) → iris (#6248ff)

**3-5 Example Component Prompts**

1. *Build a hero with gradient-text accent*: Cream (#f1f0ee) full-bleed background. Centered headline at 224px Relative weight 500, color Ink (#161616), letter-spacing -0.03em. Replace the word 'faster' with the ember→crimson→iris gradient applied via background-clip:text. Body subtext at 18px weight 400, color Fog (#686868), 1.5 line-height, max-width 600px centered. Three floating preview cards scattered at the hero edges: 8px radius, Paper (#ffffff) background, 1px Bone (#e4e2df) border, slight 2-4° rotation.

2. *Build the prompt input bar (signature component)*: 2px gradient border (ember→crimson→iris, 100deg) at 320px-radius wrapping a Paper (#ffffff) inner field at 8px radius. Input text 16px weight 400, placeholder in Fog (#686868). Nested submit button: Electric Iris (#6248ff) background, white text, 8px radius, 12px vertical / 20px horizontal padding, Relative 16px weight 500, with 1px-offset contact shadow.

3. *Build a feature card (3-column grid item)*: Paper (#ffffff) background, 1px Bone (#e4e2df) border, 16px radius, 24px internal padding. Category eyebrow at top: 14px weight 500, Electric Iris (#6248ff) color, 4px below top edge. Title at 40px Relative weight 500 in Ink, 16px below the eyebrow. Description at 16px weight 400 in Fog, 1.5 line-height, 8px below the title. Ghost 'Give it a try' link button at bottom: Ink text, underline on hover, 16px weight 500. Image preview at 16px radius fills the lower 60% of the card. Dual-layer shadow: 0px 8px 10px -4px rgba(0,0,0,0.08) + 0px 2px 10px 2px rgba(0,0,0,0.05).

4. *Build a dark outline button (nav action)*: Transparent fill, 1px Ink (#161616) border, 8px radius, 12px vertical / 20px horizontal padding, 16px Relative weight 500, Ink text. 1px-offset contact shadow on hover. Use in top-right of the nav bar.

5. *Build a logo proof band*: Horizontal row on Cream canvas, 6 partner logos at 32px height, color Iron (#4d4d4c), 32px gap between logos, vertically centered, no background, no border. Sits between two content sections as a single full-width row.

## Gradient System

The ember→crimson→iris gradient (orange #ff7448 → red #ff4848 → violet #6248ff, 100deg) is the brand's emotional punctuation. It appears in exactly three contexts, and only three: (1) as background-clip:text on a single headline word per page, (2) as a 2px border on the prompt input bar, (3) as a horizontal accent line or divider in rare cases. Never as a button fill, never as a card background, never as a section background. The gradient is loud; the discipline is keeping it quiet.

## Similar Brands

- **Linear** — Same single-accent restraint: a near-white canvas with one vivid chromatic (violet for Linear, iris for Relume) and tight grotesque type. Both sites use oversized display headlines as the primary visual element.
- **Vercel** — Minimal palette (cream/white canvas + one accent) with a custom-feeling geometric sans, oversized headlines, and product UI screenshots as the decorative element. Relume's floating preview cards echo Vercel's template gallery approach.
- **Frame.io** — Product-first marketing where the tool's own output serves as the hero imagery. Both use a light warm-neutral canvas and let UI screenshots and feature cards do the visual work.
- **Webflow** — Same 'your output is the decoration' philosophy and a comparable custom-display-font approach. Both target designers with a confident, slightly playful tone and oversized type.
- **Framer** — Large-scale display typography on a light canvas with a single accent color and product mockups floating as the hero visual. The 224px headline scale and the centered-headline-with-floating-cards pattern are nearly identical.

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-electric-iris: #6248ff;
  --gradient-electric-iris: linear-gradient(100deg, rgb(255, 116, 72), rgb(255, 72, 72) 42%, rgb(98, 72, 255) 85%);
  --color-soft-lilac: #b8adf5;
  --color-iris-mist: #e0daff;
  --color-ink: #161616;
  --color-graphite: #222222;
  --color-slate: #333333;
  --color-iron: #4d4d4c;
  --color-fog: #686868;
  --color-bone: #e4e2df;
  --color-cream: #f1f0ee;
  --color-paper: #ffffff;
  --color-acid-lemon: #f0f41a;

  /* Typography — Font Families */
  --font-relative: 'Relative', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-relative-faux: 'Relative Faux', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --text-body-sm: 14px;
  --leading-body-sm: 1.5;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-subheading: 18px;
  --leading-subheading: 1.5;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.4;
  --text-heading: 32px;
  --leading-heading: 1.4;
  --tracking-heading: -0.02px;
  --text-heading-lg: 48px;
  --leading-heading-lg: 1.2;
  --tracking-heading-lg: -0.02px;
  --text-display: 56px;
  --leading-display: 1.2;
  --tracking-display: -0.03px;
  --text-display-xl: 96px;
  --leading-display-xl: 1.1;
  --tracking-display-xl: -0.02px;
  --text-display-hero: 224px;
  --leading-display-hero: 1;
  --tracking-display-hero: -0.03px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;

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
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-72: 72px;
  --spacing-80: 80px;
  --spacing-112: 112px;
  --spacing-120: 120px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 64px;
  --card-padding: 16-24px;
  --element-gap: 8-16px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-2xl: 16px;
  --radius-full: 320px;

  /* Named Radii */
  --radius-cards: 16px;
  --radius-pills: 320px;
  --radius-badges: 8px;
  --radius-inputs: 8px;
  --radius-buttons: 8px;

  /* Shadows */
  --shadow-subtle: rgba(0, 0, 0, 0.08) 0px 1px 3px 0px, rgba(0, 0, 0, 0.04) 0px 1px 2px 0px;
  --shadow-md: rgba(0, 0, 0, 0.08) 0px 8px 10px -4px, rgba(0, 0, 0, 0.05) 0px 2px 10px 2px;

  /* Surfaces */
  --surface-canvas: #f1f0ee;
  --surface-card: #ffffff;
  --surface-elevated: #ffffff;
  --surface-tinted: #e0daff;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-electric-iris: #6248ff;
  --color-soft-lilac: #b8adf5;
  --color-iris-mist: #e0daff;
  --color-ink: #161616;
  --color-graphite: #222222;
  --color-slate: #333333;
  --color-iron: #4d4d4c;
  --color-fog: #686868;
  --color-bone: #e4e2df;
  --color-cream: #f1f0ee;
  --color-paper: #ffffff;
  --color-acid-lemon: #f0f41a;

  /* Typography */
  --font-relative: 'Relative', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-relative-faux: 'Relative Faux', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --text-body-sm: 14px;
  --leading-body-sm: 1.5;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-subheading: 18px;
  --leading-subheading: 1.5;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.4;
  --text-heading: 32px;
  --leading-heading: 1.4;
  --tracking-heading: -0.02px;
  --text-heading-lg: 48px;
  --leading-heading-lg: 1.2;
  --tracking-heading-lg: -0.02px;
  --text-display: 56px;
  --leading-display: 1.2;
  --tracking-display: -0.03px;
  --text-display-xl: 96px;
  --leading-display-xl: 1.1;
  --tracking-display-xl: -0.02px;
  --text-display-hero: 224px;
  --leading-display-hero: 1;
  --tracking-display-hero: -0.03px;

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
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-72: 72px;
  --spacing-80: 80px;
  --spacing-112: 112px;
  --spacing-120: 120px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-2xl: 16px;
  --radius-full: 320px;

  /* Shadows */
  --shadow-subtle: rgba(0, 0, 0, 0.08) 0px 1px 3px 0px, rgba(0, 0, 0, 0.04) 0px 1px 2px 0px;
  --shadow-md: rgba(0, 0, 0, 0.08) 0px 8px 10px -4px, rgba(0, 0, 0, 0.05) 0px 2px 10px 2px;
}
```
