# amra — Style Reference
> iridescent sphere on white void — the lavender accent is the only chromatic pulse against an almost perfectly achromatic page, and a single gradient orb does the work that a hero illustration usually does.

**Theme:** light

Amra is a near-monochrome white canvas with a single soft lavender accent (#acafff) and an iridescent gradient sphere as its signature visual anchor. The interface stays almost completely achromatic — text, dividers, and borders all share a family of near-blacks and grays — so the lavender feels like a small electric pulse rather than a brand color. Photography is never raw: subjects are silhouetted and dropped onto the same teal-to-violet gradient as the hero sphere, making imagery feel like part of the same substance as the product. Typography is custom, geometric, and weight-400 throughout — no bold ever appears, and authority comes from size and tight tracking rather than weight. Components are large-radius and floating: a pill-shaped nav drifts over content, image cards have 44px corners, and the page breathes with 100–160px vertical gaps between sections.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Ink Black | `#141414` | `--color-ink-black` | Primary text, all heading and body color, dominant border color, nav text and structural dividers. The near-black (not pure black) keeps the monochrome system from feeling harsh against white |
| Paper White | `#ffffff` | `--color-paper-white` | Page canvas, card surfaces, icon fills on dark backgrounds, nav pill surface when over light sections |
| Mist Gray | `#a1a1a1` | `--color-mist-gray` | Secondary text, subheadings, muted body copy, lighter hairline borders. The middle step in the achromatic scale |
| Smoke Gray | `#8a8a8a` | `--color-smoke-gray` | Nav link text at rest, medium-weight borders, tertiary text |
| Veil Gray | `#d0d0d0` | `--color-veil-gray` | Lightest border tone for link underlines, subtle dividers between content blocks |
| Periwinkle Glow | `#acafff` | `--color-periwinkle-glow` | The sole chromatic accent — fills the SIGN IN button and the floating nav container. Soft violet at moderate saturation; it reads as illuminated rather than branded, so the entire UI feels switched-on when it appears |

## Tokens — Typography

### Primary Font — Primary Font — detected in extracted data but not described by AI · `--font-primary-font`
- **Weights:** 400
- **Sizes:** 20px, 30px, 50px
- **Line height:** 1, 1.2
- **Letter spacing:** -0.01
- **Role:** Primary Font — detected in extracted data but not described by AI

### Custom geometric sans (sphere-like, soft terminals) — All headings and large body copy. Used at 20px (subheadings, feature labels), 30px (section headings), 50px (display). Weight stays at 400 across the scale — no bold weight exists in the system. Tight -0.01em tracking is the signature: letters almost touch, giving headings a dense, architectural quality rather than a light/airy one. The only distinguishing letter shape is in the lowercase wordmark 'amra' — a custom logotype, not a font. · `--font-custom-geometric-sans-sphere-like-soft-terminals`
- **Substitute:** Neue Haas Grotesk, Inter Tight, or Söhne
- **Weights:** 400
- **Sizes:** 20px, 30px, 50px
- **Line height:** 1.0–1.2
- **Letter spacing:** -0.01em at all sizes (≈ -0.5px at 50px, -0.3px at 30px, -0.2px at 20px)
- **Role:** All headings and large body copy. Used at 20px (subheadings, feature labels), 30px (section headings), 50px (display). Weight stays at 400 across the scale — no bold weight exists in the system. Tight -0.01em tracking is the signature: letters almost touch, giving headings a dense, architectural quality rather than a light/airy one. The only distinguishing letter shape is in the lowercase wordmark 'amra' — a custom logotype, not a font.

### Custom uppercase display sans (tracked out) — All uppercase nav items, link labels, tag text, footer micro-copy, small body text in cards. Set at 14–16px with +0.029em tracking, the letters hold generous space — a deliberate counterpoint to the tight headline tracking. The wide tracking makes a 14px label read as a navigational mark, not as text. The very tall line-height (2.29 at 16px) is used only for stacked list items where breathing room matters more than density. · `--font-custom-uppercase-display-sans-tracked-out`
- **Substitute:** Söhne Mono, JetBrains Mono, or any wide-grotesk alternate
- **Weights:** 400
- **Sizes:** 14px, 16px
- **Line height:** 1.0–2.29
- **Letter spacing:** 0.029em (≈ 0.41px at 14px, 0.46px at 16px)
- **Role:** All uppercase nav items, link labels, tag text, footer micro-copy, small body text in cards. Set at 14–16px with +0.029em tracking, the letters hold generous space — a deliberate counterpoint to the tight headline tracking. The wide tracking makes a 14px label read as a navigational mark, not as text. The very tall line-height (2.29 at 16px) is used only for stacked list items where breathing room matters more than density.

### Secondary Font — Secondary Font — detected in extracted data but not described by AI · `--font-secondary-font`
- **Weights:** 400
- **Sizes:** 14px, 16px
- **Line height:** 1, 2.29
- **Letter spacing:** 0.029
- **Role:** Secondary Font — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 14px | 1.2 | 0.41px | `--text-caption` |
| body | 16px | 1.6 | 0.46px | `--text-body` |
| subheading | 20px | 1.2 | -0.2px | `--text-subheading` |
| heading | 30px | 1.2 | -0.3px | `--text-heading` |
| display | 50px | 1 | -0.5px | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** spacious

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 8 | 8px | `--spacing-8` |
| 12 | 12px | `--spacing-12` |
| 16 | 16px | `--spacing-16` |
| 24 | 24px | `--spacing-24` |
| 32 | 32px | `--spacing-32` |
| 40 | 40px | `--spacing-40` |
| 56 | 56px | `--spacing-56` |
| 100 | 100px | `--spacing-100` |
| 104 | 104px | `--spacing-104` |
| 160 | 160px | `--spacing-160` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 44px |
| buttons | 8px |
| navPill | 16px |
| featureImage | 40px |
| linkUnderline | 24px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 100-160px
- **Card padding:** 32px
- **Element gap:** 24px

## Components

### Sticky Navigation Bar
**Role:** Persistent top-of-page navigation that floats over content with a slight gap from the viewport edge.

Transparent at the very top of the page, then a pill-shaped container fades in with a soft white or #acafff fill at 8–16px radius as the user scrolls. Nav links are 14px uppercase tracked at 0.029em in #141414 or #8a8a8a. The pill has 16–24px horizontal padding and floats centered with 100px horizontal margin on either side at desktop widths.

### Lavender Filled Button (Sign In)
**Role:** The single filled action component in the system.

8px border-radius, #acafff background, #141414 text in 14px uppercase at 0.029em tracking. Compact horizontal padding (~12–16px). No hover state change observed in the raw data — the button is a quiet call to action, not a loud one. Only one chromatic button exists in the entire interface.

### Uppercase Nav Link
**Role:** Text-only navigation items inside the nav pill.

14px weight 400, 0.029em letter-spacing, uppercase, #141414 at rest. No underline, no background — links are pure tracked type. Spacing between links uses 12–24px gaps, creating the airy horizontal rhythm of the nav bar.

### Hero Headline
**Role:** Primary display text on landing pages.

Set at 50px in the custom geometric sans, weight 400, line-height 1.0, letter-spacing -0.5px. Color #141414. Always centered. No weight emphasis — size and tight tracking do the work. Subhead sits directly below at 20px, line-height 1.2, in #a1a1a1 or #8a8a8a.

### Gradient Sphere (Hero Visual)
**Role:** Signature 3D-rendered brand asset that anchors the page.

A large radial gradient sphere (no CSS gradient token — it's a rendered image). Transitions from white-lavender at the top through soft blue to deep teal at the bottom. Functions as the only brand illustration; appears in hero and can be reused at any scale. NOT a background gradient — it's a contained visual element.

### Feature Image Card
**Role:** Image container for photography inside content sections.

40–44px border-radius. No border, no shadow. The image inside is always treated with the same teal-to-violet gradient palette as the hero sphere — photography is silhouetted subjects dropped onto that gradient. Card sits directly on the white canvas with 32px of internal padding from surrounding text.

### Two-Column Feature Section
**Role:** Image-left / text-right content block used to break down product value props.

50/50 split inside the 1200px max-width container. Image side holds a Feature Image Card (40–44px radius). Text side stacks a 20–30px subheading in #141414 with tight tracking, followed by 16px body in #a1a1a1 at line-height 1.6. Gap between columns: 56–100px. Section itself has 100–160px of vertical breathing room above and below.

### Floating Video Play Widget
**Role:** Persistent bottom-right video trigger.

Small circular thumbnail (~48px) with a white play triangle, followed by 'Why amra' label and a duration timestamp. 24px pill-radius container. Sits 24px from the viewport edges. Appears across all pages as a persistent engagement entry point.

### Link Underline
**Role:** Inline link border within body copy.

1px #d0d0d0 bottom border, 24px border-radius on the underline itself. No color change on the link text — only the underline distinguishes it from body copy. 16px horizontal padding from surrounding text.

### Section Divider
**Role:** Implicit vertical rhythm device between content blocks.

No visible line — sections are separated by 100–160px of empty white space. The rhythm alone defines where one section ends and the next begins. Avoid adding any visible dividers; spacing IS the divider.

## Do's and Don'ts

### Do
- Use #acafff only for the SIGN IN button and the floating nav pill — it is the only chromatic color in the entire system
- Set all headings at weight 400 in the geometric sans; never escalate to 600 or 700
- Apply -0.01em letter-spacing to every size of the headline font, and +0.029em to every size of the uppercase label font
- Use 44px border-radius on all image cards and 8px on all buttons — these two radii define the system's softness
- Reserve 100–160px of vertical space between major sections; let white space do the work of dividers
- Treat all photography by silhouetting subjects and placing them on the teal-to-violet gradient — never use raw, unprocessed photos
- Center-align the hero headline; left-align all subsequent body copy

### Don't
- Don't introduce a second chromatic color — the system is intentionally monochromatic apart from #acafff
- Don't use bold or semibold weights; the design relies on size and tracking, not weight, to create hierarchy
- Don't add box-shadows to cards — the system has no elevation vocabulary; radius alone defines surface
- Don't add visible dividers or hairlines between sections — 100px+ of whitespace is the only separator
- Don't use the teal-to-violet gradient as a CSS background — it lives only inside the hero sphere asset and inside feature image treatments
- Don't left-align the hero headline or center-align body paragraphs — center the first screen, left-align everything after
- Don't add icon fills in any color other than #141414, #ffffff, or #acafff

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Page Canvas | `#ffffff` | Base background for the entire site; all content sits on this surface |
| 2 | Nav Pill / Action Button | `#acafff` | Floating navigation container and the SIGN IN button — the only surface that introduces color |
| 3 | Dark Overlay | `#141414` | Inverted surfaces for video widgets, modal overlays, or dark content cards (not visible in the current page but available for the inverted variant) |

## Elevation

Amra has no shadow system. Surfaces are defined entirely by border-radius and white space — cards float on the canvas through their 44px corners and the negative space around them, not through any drop shadow. When a component needs to feel elevated (e.g. the floating nav pill), it does so through a soft color fill (#acafff) or a subtle 1px border in a light gray, never through a shadow stack.

## Imagery

Imagery is built from two ingredients: a 3D-rendered gradient sphere (the brand's signature visual — white-lavender to soft blue to deep teal) and silhouetted photography placed on the same teal-to-violet gradient. Subjects are always dark silhouettes of musicians (DJs, performers) read against the gradient, never raw editorial photos. The treatment makes every image feel like part of the same substance as the hero sphere. Icons are minimal — line-based, monochrome in #141414 — and rarely appear. The page is text-dominant with imagery as punctuation, not atmosphere.

## Layout

Centered, max-width 1200px layout with generous breathing room. The hero is a centered headline stack over white space, with the gradient sphere rising from the bottom of the viewport like a planet. Below the fold, content moves into a left-aligned two-column pattern: image card on the left, text block on the right, repeating down the page. Vertical rhythm is defined by 100–160px section gaps with no visible dividers. Navigation is a sticky pill that starts transparent and gains a soft background as the user scrolls, floating over content rather than pinning to the top edge. No sidebar, no mega-menu — the four nav items (PLATFORM, COMPANY, INSIGHTS, CONTACT) are the entire information architecture.

## Agent Prompt Guide

**Quick Color Reference**
text: #141414
background: #ffffff
border: #d0d0d0 (light) / #a1a1a1 (medium)
accent: #acafff
muted text: #8a8a8a
primary action: no distinct CTA color

**3-5 Example Component Prompts**
1. Build a sticky navigation bar: a centered pill container at 16px border-radius, #acafff background, 1200px max-width with 100px horizontal margin. Inside, four uppercase links in 14px custom sans, weight 400, 0.029em letter-spacing, #141414 color, separated by 24px gaps. A #acafff filled button on the far right with #141414 text at 8px radius and 12px 16px padding.

2. Build a hero section: #ffffff background, centered. Headline at 50px custom geometric sans, weight 400, line-height 1.0, letter-spacing -0.5px, color #141414. Subhead at 20px same font at -0.2px tracking, color #a1a1a1. A 600px diameter gradient sphere asset (white-lavender to teal) anchored at the bottom of the viewport.

3. Build a feature block: two-column layout inside 1200px max-width. Left column holds a Feature Image Card at 44px border-radius, no shadow, containing a silhouetted subject on a teal-to-violet gradient. Right column stacks a 30px subheading in #141414 with -0.3px tracking, followed by 16px body copy in #a1a1a1 at line-height 1.6. 80px gap between columns.

4. Build a floating video widget: a pill-shaped container at 24px border-radius, 48px tall, anchored to the bottom-right viewport corner with 24px margin. Contains a 40px circular thumbnail, 'Why amra' label in 14px uppercase tracked at 0.029em, and a timestamp in #8a8a8a.

5. Build a body text block: 16px geometric sans at weight 400, line-height 1.6, letter-spacing 0.46px, color #141414. Inline links have a 1px #d0d0d0 bottom border with 24px radius on the underline itself, no color change to the link text.

## Similar Brands

- **Linear** — Same near-monochrome interface with a single soft chromatic accent (Linear's purple, amra's lavender) and weight-400-only typography
- **Vercel** — Same generous white-space rhythm, centered hero headlines, and the discipline of using one accent color against pure white
- **Stripe** — Same large-radius cards (40–44px), gradient-as-hero-asset treatment, and custom geometric sans typography with tight headline tracking
- **Nothing (nothing.tech)** — Same dot-matrix minimalism, uppercase tracked nav text, and the feeling of a single illuminated element on a vast white field

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-ink-black: #141414;
  --color-paper-white: #ffffff;
  --color-mist-gray: #a1a1a1;
  --color-smoke-gray: #8a8a8a;
  --color-veil-gray: #d0d0d0;
  --color-periwinkle-glow: #acafff;

  /* Typography — Font Families */
  --font-primary-font: 'Primary Font', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-custom-geometric-sans-sphere-like-soft-terminals: 'Custom geometric sans (sphere-like, soft terminals)', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-custom-uppercase-display-sans-tracked-out: 'Custom uppercase display sans (tracked out)', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-secondary-font: 'Secondary Font', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.2;
  --tracking-caption: 0.41px;
  --text-body: 16px;
  --leading-body: 1.6;
  --tracking-body: 0.46px;
  --text-subheading: 20px;
  --leading-subheading: 1.2;
  --tracking-subheading: -0.2px;
  --text-heading: 30px;
  --leading-heading: 1.2;
  --tracking-heading: -0.3px;
  --text-display: 50px;
  --leading-display: 1;
  --tracking-display: -0.5px;

  /* Typography — Weights */
  --font-weight-regular: 400;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-56: 56px;
  --spacing-100: 100px;
  --spacing-104: 104px;
  --spacing-160: 160px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 100-160px;
  --card-padding: 32px;
  --element-gap: 24px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-2xl: 16px;
  --radius-3xl: 24px;
  --radius-3xl-2: 40px;
  --radius-3xl-3: 44px;

  /* Named Radii */
  --radius-cards: 44px;
  --radius-buttons: 8px;
  --radius-navpill: 16px;
  --radius-featureimage: 40px;
  --radius-linkunderline: 24px;

  /* Surfaces */
  --surface-page-canvas: #ffffff;
  --surface-nav-pill-action-button: #acafff;
  --surface-dark-overlay: #141414;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-ink-black: #141414;
  --color-paper-white: #ffffff;
  --color-mist-gray: #a1a1a1;
  --color-smoke-gray: #8a8a8a;
  --color-veil-gray: #d0d0d0;
  --color-periwinkle-glow: #acafff;

  /* Typography */
  --font-primary-font: 'Primary Font', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-custom-geometric-sans-sphere-like-soft-terminals: 'Custom geometric sans (sphere-like, soft terminals)', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-custom-uppercase-display-sans-tracked-out: 'Custom uppercase display sans (tracked out)', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-secondary-font: 'Secondary Font', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.2;
  --tracking-caption: 0.41px;
  --text-body: 16px;
  --leading-body: 1.6;
  --tracking-body: 0.46px;
  --text-subheading: 20px;
  --leading-subheading: 1.2;
  --tracking-subheading: -0.2px;
  --text-heading: 30px;
  --leading-heading: 1.2;
  --tracking-heading: -0.3px;
  --text-display: 50px;
  --leading-display: 1;
  --tracking-display: -0.5px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-56: 56px;
  --spacing-100: 100px;
  --spacing-104: 104px;
  --spacing-160: 160px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-2xl: 16px;
  --radius-3xl: 24px;
  --radius-3xl-2: 40px;
  --radius-3xl-3: 44px;
}
```
