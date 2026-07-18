# Sunday — Style Reference
> Monochrome magazine spread with one yellow highlight

**Theme:** light

Sunday presents Memo in an editorial product-launch register: a pure white canvas dominated by massive single-weight headlines, photographic storytelling, and a single vivid yellow used as rare punctuation against a near-total absence of color. Typography is the brand — one weight (400) stretched across a scale from 14px to 142px, with slight negative tracking on display sizes, giving the page the cadence of a magazine spread rather than a software product page. The interface is sparse to the point of asceticism: centered navigation, no sidebar, no cards with shadows, no decorative gradient meshes. Color appears only as functional signal — yellow for highlight states and beta CTAs, black for everything else. The visual system reads as confidence through restraint: the robot does the talking, the page stays out of the way.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Lemon Highlight | `#f7e731` | `--color-lemon-highlight` | Yellow supporting accent for decorative details and low-frequency emphasis |
| Ink Black | `#1a1a1a` | `--color-ink-black` | Primary text, icons, button labels, nav links, form borders — the workhorse dark for all readable content |
| Pure White | `#ffffff` | `--color-pure-white` | Page background, card surfaces, button text on dark fills — the dominant canvas |
| Pure Black | `#000000` | `--color-pure-black` | Hairline borders, footer background, maximum-emphasis text — used where Ink Black is not dark enough |
| Stone Gray | `#6f6f6f` | `--color-stone-gray` | Secondary body text, muted descriptions, inactive form labels — the softest readable gray |
| Bone | `#f3f3f0` | `--color-bone` | Alternate section background, subtle card surface — a warm off-white for band variation without breaking the monochrome |
| Ash | `#eeeeee` | `--color-ash` | Button hover surfaces, disabled states, hairline dividers, input backgrounds |
| Mist | `#d9ecee` | `--color-mist` | Very subtle teal-tinted surface for rare color-washed sections — barely chromatic, almost a gray |
| Sage Wash | `#aec2b8` | `--color-sage-wash` | Gradient stop in decorative card backgrounds — a muted sage fading into off-white, used only in gradient form |
| Linen | `#eadcce` | `--color-linen` | Warm card background — a near-gray beige for section bands, the only warm neutral in the system |

## Tokens — Typography

### sans — The sole display and body typeface. A single weight (400) handles everything from 142px display headlines down to 16px body. The flat single-weight approach is a deliberate anti-SaaS choice — no bold, no semibold. Emphasis comes from size and the yellow accent, not weight. The slight negative tracking (-0.025em) tightens large display text into cohesive word-shapes. · `--font-sans`
- **Substitute:** Inter or GT America at weight 400
- **Weights:** 400
- **Sizes:** 16px, 18px, 20px, 24px, 32px, 42px, 84px, 104px, 120px, 142px
- **Line height:** 1.00–1.50
- **Letter spacing:** -0.025em (negative tracking on display sizes, relaxes toward 0 at body sizes)
- **OpenType features:** `"kern" on, "ss01" on`
- **Role:** The sole display and body typeface. A single weight (400) handles everything from 142px display headlines down to 16px body. The flat single-weight approach is a deliberate anti-SaaS choice — no bold, no semibold. Emphasis comes from size and the yellow accent, not weight. The slight negative tracking (-0.025em) tightens large display text into cohesive word-shapes.

### mono — Captions, status labels, and small metadata. The positive letter-spacing (0.025em) gives these texts a typographic whisper — used for 'Beta launching late 2026' and similar timestamps that sit above display headlines. Creates a clear register separation from the sans display voice. · `--font-mono`
- **Substitute:** JetBrains Mono or IBM Plex Mono at weight 400
- **Weights:** 400
- **Sizes:** 12px, 14px
- **Line height:** 1.14–1.43
- **Letter spacing:** 0.025em (positive tracking for technical/caption voice)
- **OpenType features:** `"kern" on, "ss01" on`
- **Role:** Captions, status labels, and small metadata. The positive letter-spacing (0.025em) gives these texts a typographic whisper — used for 'Beta launching late 2026' and similar timestamps that sit above display headlines. Creates a clear register separation from the sans display voice.

### Helvetica Neue — Button text only — the one place bold weight appears, and it belongs to a different family (system Helvetica Neue Bold 700) to make CTAs visually distinct from headlines. The 14px size with 1.71 line-height and normal tracking creates a compact, button-typical cadence. · `--font-helvetica-neue`
- **Substitute:** Helvetica Neue Bold (system font)
- **Weights:** 700
- **Sizes:** 14px
- **Line height:** 1.71
- **Letter spacing:** normal
- **Role:** Button text only — the one place bold weight appears, and it belongs to a different family (system Helvetica Neue Bold 700) to make CTAs visually distinct from headlines. The 14px size with 1.71 line-height and normal tracking creates a compact, button-typical cadence.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.43 | 0.3px | `--text-caption` |
| body-sm | 14px | 1.71 | — | `--text-body-sm` |
| body | 16px | 1.5 | -0.4px | `--text-body` |
| subheading | 18px | 1.4 | -0.45px | `--text-subheading` |
| heading-sm | 20px | 1.33 | -0.5px | `--text-heading-sm` |
| heading-lg | 32px | 1.2 | -0.8px | `--text-heading-lg` |
| display | 84px | 1 | -2.1px | `--text-display` |
| display-lg | 104px | 1 | -2.6px | `--text-display-lg` |
| display-xl | 120px | 1 | -3px | `--text-display-xl` |
| display-2xl | 142px | 1 | -3.55px | `--text-display-2xl` |

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
| 48 | 48px | `--spacing-48` |
| 64 | 64px | `--spacing-64` |
| 80 | 80px | `--spacing-80` |
| 96 | 96px | `--spacing-96` |
| 104 | 104px | `--spacing-104` |
| 140 | 140px | `--spacing-140` |
| 160 | 160px | `--spacing-160` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 12px |
| pills | 9999px |
| images | 12px |
| inputs | 4px |
| buttons | 4px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 24px
- **Element gap:** 12-24px

## Components

### Beta Highlight Pill
**Role:** Status indicator and primary conversion element

Pill-shaped button (#f7e731 background, #1a1a1a text), 9999px border-radius, 12px vertical / 20px horizontal padding, 14px Helvetica Neue Bold. Functions as the only chromatic interactive element on the page. Used in pairs: filled yellow pill on the left (primary), outlined yellow pill on the right (secondary).

### Outlined Action Pill
**Role:** Secondary conversion alongside the highlight pill

Transparent background, #f7e731 border at 1.5px, #f7e731 text, 9999px radius, same 12px/20px padding as the filled pill. Pairs with the Beta Highlight Pill to create a visual weight hierarchy without adding a second color.

### Centered Nav Bar
**Role:** Primary site navigation

Floating white pill (4px radius) containing a small logo mark, the wordmark 'sunday' in 14px sans 400, and a hamburger icon. Centered at the top of the page with generous top margin. The pill form factor replaces a traditional full-width nav bar.

### Display Headline Block
**Role:** Hero and section-level typography

Centered text block with a 12px mono caption (positive tracking) above, followed by a sans 400 headline at 84–142px. The caption uses 0.025em tracking to feel like a magazine dateline; the headline uses -0.025em to feel like a single word-shape. Both are centered.

### Full-Bleed Hero Image
**Role:** Product photography showcase

Edge-to-edge photographic image with 12px border-radius. Display headline overlays the top portion in white at 84–104px when the image is dark, or in black when the image is light. No gradient overlay — the photograph carries the contrast.

### FAQ Accordion
**Role:** Information architecture for common questions

Two-column layout: left column holds the 'Frequently asked questions' label in 14px mono; right column contains stacked question rows. Each row is separated by a 1px #eeeeee hairline, with 16–20px vertical padding. Questions are 16–18px sans 400 in #1a1a1a, with a chevron icon right-aligned.

### Section Divider
**Role:** Vertical rhythm separator

Invisible or hairline-only divider between sections. Uses 80px vertical gap or a 1px #eeeeee horizontal line. Never uses background color changes alone — the white canvas is sacred and rarely broken.

### Footer
**Role:** Site closure

Full-width #000000 black band. White text inside, 12–14px sans or mono. The only non-white surface on the page, creating a hard bookend against the white body.

### Image Card
**Role:** Content containers with imagery

12px border-radius, no border, no shadow. Contains a photograph or illustration with optional caption below in 14px mono. When on a non-white background, the card itself stays white (or uses #eadcce/#d9ecee for warm/cool variants).

### Ghost Nav Link
**Role:** Text-only navigation items

No background, no border. 14px sans 400 in #1a1a1a. Hover state: color shift to #6f6f6f. No underline. Appears inside the nav pill.

## Do's and Don'ts

### Do
- Use the sans font at weight 400 exclusively — never introduce bold, semibold, or medium weights; emphasis comes from size alone
- Apply #f7e731 only for beta status pills, highlight text, and the single primary accent moment per viewport — never as a background fill for cards or sections
- Set display headlines at 84px or larger with -0.025em letter-spacing to create the word-as-image effect
- Use 12px mono with +0.025em tracking for all captions, timestamps, and metadata above headlines
- Maintain the white canvas across the page body — use #f3f3f0 only for alternating section bands, never decorative gradients
- Center-align hero headlines and display blocks — the layout reads top-to-bottom in a single column rhythm
- Set all buttons to 14px Helvetica Neue Bold 700 — the one weight-700 moment in the system

### Don't
- Don't add drop shadows, box-shadows, or elevation effects to any component — the design is intentionally flat
- Don't introduce additional chromatic colors beyond #f7e731, the two near-grays (#eadcce, #aec2b8), and #d9ecee — the system is 95% achromatic by design
- Don't use bold or semibold in the sans family — weight 400 carries the entire typographic voice
- Don't set headlines below 42px on hero/display contexts — the scale jumps to communicate importance, not weight
- Don't use 9999px radius on cards, inputs, or images — pills and buttons only; cards use 12px, inputs use 4px
- Don't add a colored header bar, sidebar, or full-width nav — the floating centered pill is the only navigation pattern
- Don't use the yellow (#f7e731) as a body text color on white backgrounds — the contrast ratio supports it but the brand intent reserves it for pill backgrounds and accent highlights

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Page Canvas | `#ffffff` | Default page background, dominant surface |
| 1 | Warm Band | `#f3f3f0` | Alternate section background for rhythm variation |
| 2 | Card Surface | `#eadcce` | Warm-tinted cards in product showcase areas |
| 3 | Muted Accent | `#d9ecee` | Rare teal-tinted highlight surface |
| 4 | Footer | `#000000` | Dark footer band as the only non-white surface inversion |

## Elevation

The design intentionally avoids shadows entirely. Elevation is communicated through surface color shifts (white → #f3f3f0 → #eadcce) and image content, never through drop shadows. This keeps the page feeling flat, editorial, and print-like rather than skeuomorphic or app-like.

## Imagery

Photography is the dominant visual medium — full-bleed product shots of the Memo robot in real domestic environments (kitchens, living spaces). Images are high-key, naturally lit, slightly desaturated, with warm and cool tones balanced to feel like editorial lifestyle photography. No illustrations, no 3D renders, no abstract graphics. Images have 12px border-radius (never sharp corners) and are treated as the hero of each section, with text overlaying or sitting directly beside them. Iconography is minimal: a few mono-weight line icons in nav (settings gear, hamburger menu) and a chevron for the FAQ accordion. No icon system beyond functional UI controls.

## Layout

Single-column centered layout with a max-width of ~1200px. The page model is a vertical scroll through alternating photo-text bands: centered headline → full-bleed photo → body text → next section. No sidebar, no multi-column content grid, no card grid for features. Navigation is a floating centered pill at the top — not a full-width bar. Section rhythm is generous (80px gaps) with hairline dividers or pure whitespace separating content. The hero is a large centered headline ('Say hello to Memo') over a full-bleed photograph. FAQ section uses a two-column layout (label left, accordion right) but all other content is centered single-column. Footer is a single full-width black band.

## Agent Prompt Guide

## Quick Color Reference
- Text (primary): #1a1a1a
- Text (secondary): #6f6f6f
- Background: #ffffff
- Border / hairline: #eeeeee
- Accent (beta pill, highlight): #f7e731
- primary action: no distinct CTA color

## Example Component Prompts

1. **Hero Display Headline**: Full-bleed background photo. Centered caption above: 'The helpful home robot' in 12px mono, #6f6f6f, letter-spacing 0.3px. Headline below: 'Say hello to Memo' in sans weight 400, 104px, #1a1a1a, letter-spacing -2.6px, line-height 1.0. Both centered.

2. **Beta Highlight Pill**: #f7e731 background, 9999px border-radius, 12px padding-top, 20px padding-left/right. Text 'Join the Founding Family' in 14px Helvetica Neue Bold 700, #1a1a1a. Sits inside a floating bar with a secondary outlined pill beside it.

3. **FAQ Accordion Row**: Full-width row with 1px #eeeeee bottom border, 20px vertical padding. Question text in 16px sans 400, #1a1a1a, left-aligned. Right-aligned chevron icon (simple line, 1.5px stroke) in #1a1a1a.

4. **Section Body Text**: 18px sans 400, #1a1a1a, line-height 1.4, letter-spacing -0.45px. Max-width ~700px, centered within the 1200px page container. Follows a display headline block.

5. **Full-Bleed Image Band**: Edge-to-edge photograph with 12px border-radius on the image itself, no overlay, no gradient. White text caption overlay in top-left at 14px sans 400 when image is dark; black when image is light.

## Similar Brands

- **Apple (product launch pages)** — Same editorial full-bleed photography, massive single-weight headlines, and monochrome canvas with minimal accent color
- **Nothing (tech)** — Same confident restraint with dot-matrix mono captions above display headlines, and extreme typographic scale jumps
- **Humane (AI pin)** — Same product-launch-as-magazine-spread approach with full-bleed lifestyle photography and centered typographic hero
- **Framework (laptops)** — Same generous whitespace, hairline-only dividers, and refusal of drop shadows or card-based layouts
- **Teenage Engineering** — Same single-weight typography approach, playful monochrome with occasional bright accent, and product-photo-as-hero discipline

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-lemon-highlight: #f7e731;
  --color-ink-black: #1a1a1a;
  --color-pure-white: #ffffff;
  --color-pure-black: #000000;
  --color-stone-gray: #6f6f6f;
  --color-bone: #f3f3f0;
  --color-ash: #eeeeee;
  --color-mist: #d9ecee;
  --color-sage-wash: #aec2b8;
  --color-linen: #eadcce;

  /* Typography — Font Families */
  --font-sans: 'sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-mono: 'mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-helvetica-neue: 'Helvetica Neue', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.43;
  --tracking-caption: 0.3px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.71;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.4px;
  --text-subheading: 18px;
  --leading-subheading: 1.4;
  --tracking-subheading: -0.45px;
  --text-heading-sm: 20px;
  --leading-heading-sm: 1.33;
  --tracking-heading-sm: -0.5px;
  --text-heading-lg: 32px;
  --leading-heading-lg: 1.2;
  --tracking-heading-lg: -0.8px;
  --text-display: 84px;
  --leading-display: 1;
  --tracking-display: -2.1px;
  --text-display-lg: 104px;
  --leading-display-lg: 1;
  --tracking-display-lg: -2.6px;
  --text-display-xl: 120px;
  --leading-display-xl: 1;
  --tracking-display-xl: -3px;
  --text-display-2xl: 142px;
  --leading-display-2xl: 1;
  --tracking-display-2xl: -3.55px;

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
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-96: 96px;
  --spacing-104: 104px;
  --spacing-140: 140px;
  --spacing-160: 160px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 24px;
  --element-gap: 12-24px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-3xl: 24px;

  /* Named Radii */
  --radius-cards: 12px;
  --radius-pills: 9999px;
  --radius-images: 12px;
  --radius-inputs: 4px;
  --radius-buttons: 4px;

  /* Surfaces */
  --surface-page-canvas: #ffffff;
  --surface-warm-band: #f3f3f0;
  --surface-card-surface: #eadcce;
  --surface-muted-accent: #d9ecee;
  --surface-footer: #000000;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-lemon-highlight: #f7e731;
  --color-ink-black: #1a1a1a;
  --color-pure-white: #ffffff;
  --color-pure-black: #000000;
  --color-stone-gray: #6f6f6f;
  --color-bone: #f3f3f0;
  --color-ash: #eeeeee;
  --color-mist: #d9ecee;
  --color-sage-wash: #aec2b8;
  --color-linen: #eadcce;

  /* Typography */
  --font-sans: 'sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-mono: 'mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-helvetica-neue: 'Helvetica Neue', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.43;
  --tracking-caption: 0.3px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.71;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.4px;
  --text-subheading: 18px;
  --leading-subheading: 1.4;
  --tracking-subheading: -0.45px;
  --text-heading-sm: 20px;
  --leading-heading-sm: 1.33;
  --tracking-heading-sm: -0.5px;
  --text-heading-lg: 32px;
  --leading-heading-lg: 1.2;
  --tracking-heading-lg: -0.8px;
  --text-display: 84px;
  --leading-display: 1;
  --tracking-display: -2.1px;
  --text-display-lg: 104px;
  --leading-display-lg: 1;
  --tracking-display-lg: -2.6px;
  --text-display-xl: 120px;
  --leading-display-xl: 1;
  --tracking-display-xl: -3px;
  --text-display-2xl: 142px;
  --leading-display-2xl: 1;
  --tracking-display-2xl: -3.55px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-96: 96px;
  --spacing-104: 104px;
  --spacing-140: 140px;
  --spacing-160: 160px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-3xl: 24px;
}
```
