# Flowmapp — Style Reference
> White blueprint desk with one blue pen

**Theme:** light

Flowmapp uses a bright, airy, almost lab-notebook language: near-pure white canvas, oversized bold black headlines, pill-shaped blue CTAs, and a constellation of small floating product mockups that act as proof rather than decoration. The system relies on a single vivid blue (#0080ff) as the only saturated signal, with everything else staying achromatic or near-gray so that color reads as action, not as noise. Shapes are aggressively rounded — cards arc at 20–32px, buttons and tags become full pills at 1600px, and the hero CTA even has a hand-drawn wavy tail that makes the primary action feel sketched rather than templated. Layout is max-width contained with generous breathing room; content is broken by small product screenshots, floating UI fragments, and a row of pastel circular icon badges that punctuate long-form copy.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Signal Blue | `#0080ff` | `--color-signal-blue` | Blue supporting accent for decorative details and low-frequency emphasis. Do not promote it to the primary CTA color |
| Voltage Violet | `#0050ff` | `--color-voltage-violet` | Decorative card border glow, hero gradient bloom, chromatic outline accents on floating mockups — sits one notch deeper than Signal Blue for layered brand moments |
| Sky Wash | `#c5e0fb` | `--color-sky-wash` | Gray supporting accent for decorative details and low-frequency emphasis. Do not promote it to the primary CTA color |
| Pencil Gray | `#8c9baa` | `--color-pencil-gray` | Muted body text, hairline borders, nav dividers, step badges, tertiary metadata |
| Graphite | `#636f7b` | `--color-graphite` | Secondary body copy, inactive nav items, supporting descriptions |
| Ink | `#000000` | `--color-ink` | Headlines, primary body, button text, logo wordmark — the dominant voice of the system at AAA contrast on white |
| Carbon | `#222222` | `--color-carbon` | Navigation text, dense UI labels where pure black feels heavy |
| Paper | `#ffffff` | `--color-paper` | Page background, card surface, button text on Signal Blue, inverted surfaces |

## Tokens — Typography

### Inter — Single-family system. Display uses 700 weight at 64–118px with tight tracking (-0.06em) and near-square line-height (0.94–1.09) so headlines stack as a compact typographic block. Body and UI use 400–500 at 14–18px with 1.4–1.67 line-height. Weights 600–700 are reserved for headings, CTAs, and section labels; weight 500 carries button text and small caps-style badges. · `--font-inter`
- **Substitute:** DM Sans, Manrope, or system-ui sans-serif
- **Weights:** 400, 500, 600, 700
- **Sizes:** 10, 12, 13, 14, 16, 18, 24, 30, 36, 48, 64, 72, 84, 96, 118
- **Line height:** 0.94, 1.00, 1.04, 1.09, 1.14, 1.25, 1.30, 1.40, 1.43, 1.67
- **Letter spacing:** -0.0600em at 118px display, scaling to -0.0150em at 14px body, normal (0) at 12px and below
- **OpenType features:** `"cv11", "ss01" on, "tnum" for tabular numerics in pricing/data`
- **Role:** Single-family system. Display uses 700 weight at 64–118px with tight tracking (-0.06em) and near-square line-height (0.94–1.09) so headlines stack as a compact typographic block. Body and UI use 400–500 at 14–18px with 1.4–1.67 line-height. Weights 600–700 are reserved for headings, CTAs, and section labels; weight 500 carries button text and small caps-style badges.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.4 | — | `--text-caption` |
| body-sm | 14px | 1.43 | -0.015px | `--text-body-sm` |
| body | 16px | 1.5 | -0.015px | `--text-body` |
| subheading | 18px | 1.4 | -0.02px | `--text-subheading` |
| heading-sm | 24px | 1.3 | -0.02px | `--text-heading-sm` |
| heading | 36px | 1.14 | -0.03px | `--text-heading` |
| heading-lg | 48px | 1.09 | -0.036px | `--text-heading-lg` |
| display | 72px | 1 | -0.053px | `--text-display` |
| display-xl | 118px | 0.94 | -0.06px | `--text-display-xl` |

## Tokens — Spacing & Shapes

**Base unit:** 8px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 8 | 8px | `--spacing-8` |
| 16 | 16px | `--spacing-16` |
| 24 | 24px | `--spacing-24` |
| 32 | 32px | `--spacing-32` |
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |
| 56 | 56px | `--spacing-56` |
| 64 | 64px | `--spacing-64` |
| 72 | 72px | `--spacing-72` |
| 80 | 80px | `--spacing-80` |
| 88 | 88px | `--spacing-88` |
| 96 | 96px | `--spacing-96` |
| 104 | 104px | `--spacing-104` |
| 144 | 144px | `--spacing-144` |
| 184 | 184px | `--spacing-184` |
| 200 | 200px | `--spacing-200` |

### Border Radius

| Element | Value |
|---------|-------|
| nav | 6px |
| tags | 1600px |
| cards | 20px |
| images | 24px |
| inputs | 12px |
| buttons | 1600px |
| iconBadges | 1600px |
| featureCards | 32px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| lg | `rgba(0, 0, 0, 0.06) 0px 0px 18px 0px` | `--shadow-lg` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 96px
- **Card padding:** 24px
- **Element gap:** 8px

## Components

### Hero CTA Button
**Role:** Primary conversion action

Pill shape (1600px radius) with a distinctive wavy/lozenge right tail extension. Fill: Signal Blue (#0080ff). Text: white, Inter 600 at 18–24px, letter-spacing -0.02em. Padding: 16px 32px (with extra right padding to accommodate the wavy tail). Subtle Sky Wash glow shadow at rgba(197,224,251,0.6) offset 18px. No border.

### Nav Login Button
**Role:** Secondary nav action

Outlined pill, 1600px radius, 1px Pencil Gray border (#8c9baa), transparent fill, Carbon (#222222) text at 14px weight 500. Padding: 8px 20px.

### Nav Try For Free Button
**Role:** Primary nav action

Filled pill, 1600px radius, Ink (#000000) background, white text, 14px weight 500. Padding: 8px 20px. Small right-arrow icon at 12px.

### Step Badge
**Role:** Section header label

Pill (1600px radius) with 1px Pencil Gray border, transparent fill. Left: Ink 'STEP 1' at 11px weight 600, uppercase. Separator dot. Right: Pencil Gray descriptor at 11px weight 400. Padding: 6px 12px.

### Feature Card (Two-Column)
**Role:** Product feature highlight

White surface, 20–32px radius, 1px Pencil Gray border (#8c9baa at 1px). Padding: 32–48px. Left column: 16–18px Pencil Gray icon above heading at 16–18px weight 600 in Ink, then body at 14–16px Pencil Gray weight 400. Right column: product screenshot or mockup with 24px radius.

### Section Heading Block
**Role:** Large section opener

Display weight 700, sizes 48–72px, line-height 1.0–1.09, letter-spacing -0.036 to -0.053em, Ink color. No max-width clamp — text wraps naturally at 2–4 lines. Centered or left-aligned depending on section.

### Icon Badge (Pastel Circles)
**Role:** Inline feature iconography

Full-pill radius (1600px) circles at 28–32px diameter. Soft pastel fills (yellow, mint, pink, lavender, peach) with 1–1.5px dark icon stroke inside. Placed inline within body text to punctuate feature lists.

### Product Phone Mockup
**Role:** Hero/feature visual

Vertical phone frame with 32–48px outer radius, white inner surface, 1px Pencil Gray border. Contains stacked UI sections (Header, Menu, Cards) each as a colored chip: pastel yellow, mint, pink, peach. Drop shadow: rgba(0,0,0,0.06) 0px 0px 18px.

### Feature Tile Card (AI Generator)
**Role:** Highlighted feature card

White card, 20px radius, 1px border. Contains a small uppercase tag in pastel color (e.g. 'AI GENERATOR' in pink), a dark pill button inside (Ink fill, white text, '✨ Generate Sitemap'), and a cursor illustration. Padding: 24px.

### Sitemap Node Card
**Role:** Structure diagram element

Small white card, 12px radius, 1px Pencil Gray border. Contains: title row, color-coded label chip (yellow/pink/green at 6px radius), thumbnail, and footer meta. Used in tree/graph layouts.

### Top Rated Product Badge
**Role:** Social proof label

Small pill, 1600px radius, white fill, 1px Pencil Gray border, 'Top Rated Product' at 12px weight 500 in Ink with a small green check icon. Padding: 4px 12px.

### Avatar Stack
**Role:** Social proof

Horizontal row of 5–6 circular avatars at 28px diameter, overlapping by -8px, each with 2px white ring border. Below: 'Over 400,000 users' caption in Pencil Gray at 13px.

### Logo Trust Bar
**Role:** Enterprise social proof

Full-width centered row of 6 grayscale corporate logos (Intel, IBM, Tesla, EA, UNICEF, Deloitte) at ~60% opacity, 24px height, Pencil Gray fill. Topped by 'You're in good company' caption in 13px Pencil Gray. Padding: 48px 0.

### Floating Annotation Card
**Role:** Hero secondary callout

Small white card, 12px radius, soft shadow rgba(0,0,0,0.06) 0px 0px 18px. Contains a 2-line annotation: bold label + Pencil Gray description. Connected to hero elements via thin curved Signal Blue stroke.

## Do's and Don'ts

### Do
- Use Signal Blue (#0080ff) as the only saturated color on the page — never introduce a second brand hue for actions, links, or highlights.
- Make every interactive control a pill (1600px radius) unless it is a form input, which uses 12px.
- Set display headlines at 48–118px Inter 700 with letter-spacing between -0.036em and -0.06em so the type compresses into a tight typographic block rather than spreading airy.
- Use 1px Pencil Gray (#8c9baa) borders to separate cards from the white canvas instead of relying on shadow — shadows are reserved for floating hero elements only.
- Anchor long-form copy with pastel circular icon badges placed inline (radius 1600px, 28–32px) so feature lists scan visually.
- Pad feature cards at 24–48px on all sides and use 20–32px radii — never use sharp corners on any card surface.
- Float product UI mockups in the hero with the soft rgba(0,0,0,0.06) 18px shadow and connect them with thin Signal Blue curved lines to act as visual proof.

### Don't
- Don't add a second saturated brand color for buttons, links, or active states — the system is monochrome with one blue signal.
- Don't use square corners on cards, buttons, or tags; everything visible to the user is rounded to at least 6px and most controls are full pills.
- Don't use heavy drop shadows on content cards; the only allowed shadow is the 0.06 alpha 18px blur, and only for floating product mockups and modals.
- Don't let body copy exceed 16–18px or use weight above 500 — anything heavier belongs in a heading.
- Don't use display weight below 600 for headings; the system relies on bold voice to carry its minimal color palette.
- Don't fill sections with solid blue, gradient meshes, or colored bands — backgrounds stay white, color appears only as accent or glow.
- Don't use a neutral gray for primary action text or fills — the only text color for buttons is white on Signal Blue or Ink, never Pencil Gray.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Paper | `#ffffff` | Page canvas, section backgrounds |
| 1 | Card | `#ffffff` | Floating feature cards, product mockups, step panels — differentiated from canvas by 1px Pencil Gray border rather than shadow |
| 2 | Elevated | `#ffffff` | Hover states and modals — gains a soft 0.06 alpha shadow at 18px blur |
| 3 | Signal | `#0080ff` | Primary action surface, active nav indicator |

## Elevation

- **Floating product mockups and annotation cards:** `rgba(0, 0, 0, 0.06) 0px 0px 18px 0px`
- **Hero CTA button glow:** `0px 0px 18px 0px rgba(197, 224, 251, 0.6)`

## Imagery

Imagery is dominated by in-app product mockups rather than photography: phone-frame UI screenshots, small floating annotation cards, sitemap tree node cards, and AI-generator tile previews. These are treated as physical objects — given soft shadows, slight rotation, and connected with thin curved blue lines. A secondary motif is the pastel circular icon badge (yellow, mint, pink, lavender, peach at ~28px) placed inline within body copy to punctuate feature mentions. The avatar trust row uses real human photos at 28px with white ring borders. The overall density is light: roughly 60% text, 40% product mockup, with no lifestyle photography, no hero video, and no decorative illustrations beyond the UI fragments themselves.

## Layout

Layout is max-width contained at 1200px, centered, with generous 96px+ vertical section gaps. The hero is a centered headline stack with floating product mockups scattered asymmetrically around it — not a split text+image layout. Below the hero, sections alternate between a 'logo trust bar' (full-width, centered, low-density) and two-column 'text-left / mockup-right' feature blocks that always lead with an oversized left-aligned heading. Feature blocks use a rounded 20–32px card as a frame for the mockup. The page never goes full-bleed colored, never uses a sidebar, and relies on a sticky top nav with a 6px-radius logo container, centered links, and a black pill CTA on the right.

## Agent Prompt Guide

## Quick Color Reference
- Text: #000000 (headlines, primary copy), #222222 (nav), #636f7b (secondary), #8c9baa (muted/borders)
- Background: #ffffff (canvas, cards)
- Border: 1px solid #8c9baa
- Accent: #0080ff (Signal Blue) — links, active states, brand wordmark arrow
- primary action: no distinct CTA color
- Decorative glow: #c5e0fb (Sky Wash), #0050ff (Voltage Violet, accent borders only)

## Example Component Prompts

No distinct primary action color was observed; use the extracted neutral button treatments instead of inventing a filled CTA color.

2. **Feature Section Card**: White surface, 32px radius, 1px solid #8c9baa border. 48px padding all sides. Left column: 20px dark icon (Inter or outline stroke) above 18px Inter 600 #000000 heading, then 16px Inter 400 #636f7b body. Right column: product mockup with 24px radius and rgba(0,0,0,0.06) 0px 0px 18px shadow.

3. **Display Heading Block**: Inter 700, 72px, line-height 1.0, letter-spacing -0.053em, color #000000. Centered, no max-width clamp — let it wrap at 2–3 lines naturally.

4. **Step Badge**: 1600px pill radius, 1px solid #8c9baa border, transparent fill. Left segment: 'STEP 1' in Inter 600 11px #000000, uppercase. Right segment after • separator: 'AI SITEMAP' in Inter 400 11px #8c9baa. Padding 6px 12px.

5. **Pastel Icon Badge**: 1600px full circle, 32px diameter. Fill one of {pastel yellow #fff3c4, mint #c8f0d8, pink #ffd6e0, lavender #e0d4ff, peach #ffe0c4}. 1.5px dark stroke icon centered inside. Use inline within body text to mark feature names.

## Typography Voice

The voice of this system is 'oversized and quiet.' Headlines dominate the page at 48–118px Inter 700 but carry no color signal — they are pure black. The contrast between the enormous type and the single Signal Blue action creates a hierarchy where the user knows exactly where to click without ever reading a label. Body copy is small (14–16px), gray, and conversational, with the pastil icon badges acting as visual bullet points. The CTAs and headings do the talking; everything else is supportive.

## Button Geometry

The signature button geometry is the 1600px-radius pill, but the hero CTA takes this further: its right edge is not a perfect semicircle but a hand-drawn wavy contour (like a wave or brushstroke), giving the primary action a sketched, anti-corporate personality. All other buttons (nav login, nav try-free, in-card actions) are standard pills. Use the wavy-tail geometry only on the single most important CTA per page — never on secondary actions or repeated buttons.

## Similar Brands

- **Linear** — Shares the single-accent-color discipline (one vivid blue against achromatic UI) and pill-shaped CTAs with tight-tracked display headlines
- **Framer** — Same product-marketing playbook: white canvas, oversized bold display type, floating product mockups scattered in the hero, pastel accent chips
- **Pitch** — Matches the 1px-bordered card surfaces with minimal shadows, full-pill button geometry, and black-on-white with one chromatic accent
- **Notion** — Similar restrained two-color palette, Inter-style geometric sans for everything, and the habit of showing the product as floating UI fragments in the hero

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-signal-blue: #0080ff;
  --color-voltage-violet: #0050ff;
  --color-sky-wash: #c5e0fb;
  --color-pencil-gray: #8c9baa;
  --color-graphite: #636f7b;
  --color-ink: #000000;
  --color-carbon: #222222;
  --color-paper: #ffffff;

  /* Typography — Font Families */
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.4;
  --text-body-sm: 14px;
  --leading-body-sm: 1.43;
  --tracking-body-sm: -0.015px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.015px;
  --text-subheading: 18px;
  --leading-subheading: 1.4;
  --tracking-subheading: -0.02px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.3;
  --tracking-heading-sm: -0.02px;
  --text-heading: 36px;
  --leading-heading: 1.14;
  --tracking-heading: -0.03px;
  --text-heading-lg: 48px;
  --leading-heading-lg: 1.09;
  --tracking-heading-lg: -0.036px;
  --text-display: 72px;
  --leading-display: 1;
  --tracking-display: -0.053px;
  --text-display-xl: 118px;
  --leading-display-xl: 0.94;
  --tracking-display-xl: -0.06px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-unit: 8px;
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-56: 56px;
  --spacing-64: 64px;
  --spacing-72: 72px;
  --spacing-80: 80px;
  --spacing-88: 88px;
  --spacing-96: 96px;
  --spacing-104: 104px;
  --spacing-144: 144px;
  --spacing-184: 184px;
  --spacing-200: 200px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 96px;
  --card-padding: 24px;
  --element-gap: 8px;

  /* Border Radius */
  --radius-md: 6px;
  --radius-xl: 12px;
  --radius-2xl: 20px;
  --radius-3xl: 24px;
  --radius-3xl-2: 32px;
  --radius-full: 48px;
  --radius-full-2: 1600px;

  /* Named Radii */
  --radius-nav: 6px;
  --radius-tags: 1600px;
  --radius-cards: 20px;
  --radius-images: 24px;
  --radius-inputs: 12px;
  --radius-buttons: 1600px;
  --radius-iconbadges: 1600px;
  --radius-featurecards: 32px;

  /* Shadows */
  --shadow-lg: rgba(0, 0, 0, 0.06) 0px 0px 18px 0px;

  /* Surfaces */
  --surface-paper: #ffffff;
  --surface-card: #ffffff;
  --surface-elevated: #ffffff;
  --surface-signal: #0080ff;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-signal-blue: #0080ff;
  --color-voltage-violet: #0050ff;
  --color-sky-wash: #c5e0fb;
  --color-pencil-gray: #8c9baa;
  --color-graphite: #636f7b;
  --color-ink: #000000;
  --color-carbon: #222222;
  --color-paper: #ffffff;

  /* Typography */
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.4;
  --text-body-sm: 14px;
  --leading-body-sm: 1.43;
  --tracking-body-sm: -0.015px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.015px;
  --text-subheading: 18px;
  --leading-subheading: 1.4;
  --tracking-subheading: -0.02px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.3;
  --tracking-heading-sm: -0.02px;
  --text-heading: 36px;
  --leading-heading: 1.14;
  --tracking-heading: -0.03px;
  --text-heading-lg: 48px;
  --leading-heading-lg: 1.09;
  --tracking-heading-lg: -0.036px;
  --text-display: 72px;
  --leading-display: 1;
  --tracking-display: -0.053px;
  --text-display-xl: 118px;
  --leading-display-xl: 0.94;
  --tracking-display-xl: -0.06px;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-56: 56px;
  --spacing-64: 64px;
  --spacing-72: 72px;
  --spacing-80: 80px;
  --spacing-88: 88px;
  --spacing-96: 96px;
  --spacing-104: 104px;
  --spacing-144: 144px;
  --spacing-184: 184px;
  --spacing-200: 200px;

  /* Border Radius */
  --radius-md: 6px;
  --radius-xl: 12px;
  --radius-2xl: 20px;
  --radius-3xl: 24px;
  --radius-3xl-2: 32px;
  --radius-full: 48px;
  --radius-full-2: 1600px;

  /* Shadows */
  --shadow-lg: rgba(0, 0, 0, 0.06) 0px 0px 18px 0px;
}
```
