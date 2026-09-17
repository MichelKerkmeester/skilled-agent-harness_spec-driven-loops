# Healthy Together — Style Reference
> Midnight navy with a violet brushstroke ribbon.

**Theme:** dark

Healthy Together operates as a dark-anchored government-tech platform: deep midnight-navy canvases host oversized confident headlines, broken by vivid electric-violet accent sections and pale lavender breathing room. A signature pink-to-violet ribbon sweeps through the hero like a brushstroke, giving the otherwise austere dark UI a single moment of organic energy. Cards are generously rounded (42px), buttons are fully pill-shaped, and Inter's tight tracking at massive sizes (64–92px) gives headlines a compressed, architectural weight. The visual rhythm alternates dark → vivid → soft, never plain white-on-white — every surface is a deliberate temperature.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Midnight Ink | `#101722` | `--color-midnight-ink` | Primary text, hero canvas, nav bar, page-level dark backgrounds — the structural anchor of the entire system |
| Linen Lavender | `#f9f0ff` | `--color-linen-lavender` | Section canvas, card fills, soft highlight wash — the breathing-room surface between dark hero blocks |
| Pure White | `#ffffff` | `--color-pure-white` | Card surfaces, nav dividers, button text — the clean interior surface |
| Muted Graphite | `#6c6c7a` | `--color-muted-graphite` | Secondary text, helper copy, muted headings, subtle borders |
| Deep Charcoal | `#3f424e` | `--color-deep-charcoal` | Body text on light surfaces where Midnight Ink is too heavy — softens the hierarchy |
| Electric Iris | `linear-gradient(270deg, #4541fe 40%, #fe0f83)` | `--color-electric-iris` | Primary action buttons, vivid section backgrounds, active nav indicators, brand accent — the single chromatic moment that switches the UI on; Hero ribbon graphic, accent gradients — pink-to-violet sweep that is the only decorative motion in the system |
| Lilac Whisper | `#d9c6ff` | `--color-lilac-whisper` | Soft violet tint for tag/chip backgrounds, accent surface washes, decorative fills |
| Hot Magenta | `#fe0f83` | `--color-hot-magenta` | Endpoint of the signature ribbon gradient — warm anchor to Electric Iris's cool |

## Tokens — Typography

### Inter — Single typeface across the entire system. Weight 700 at 64–92px with -0.05em letter-spacing creates compressed display headlines that read as architectural rather than marketing. Body at 400/16px, nav and labels at 600/14px. No secondary or display face — the system relies on Inter's neutrality and size contrast, not typeface variety. · `--font-inter`
- **Substitute:** Inter (Google)
- **Weights:** 400, 600, 700
- **Sizes:** 14px, 16px, 24px, 36px, 64px, 72px, 92px
- **Line height:** 1.15-1.40 body, 0.88-1.00 display
- **Letter spacing:** -0.05em across all sizes
- **OpenType features:** `"ss01" on, "cv11" on`
- **Role:** Single typeface across the entire system. Weight 700 at 64–92px with -0.05em letter-spacing creates compressed display headlines that read as architectural rather than marketing. Body at 400/16px, nav and labels at 600/14px. No secondary or display face — the system relies on Inter's neutrality and size contrast, not typeface variety.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 14px | 1.4 | -0.7px | `--text-caption` |
| body | 16px | 1.4 | -0.8px | `--text-body` |
| subheading | 24px | 1.3 | -1.2px | `--text-subheading` |
| heading-sm | 36px | 1.15 | -1.8px | `--text-heading-sm` |
| heading | 64px | 1.1 | -3.2px | `--text-heading` |
| heading-lg | 72px | 1 | -3.6px | `--text-heading-lg` |
| display | 92px | 0.88 | -4.6px | `--text-display` |

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
| 24 | 24px | `--spacing-24` |
| 32 | 32px | `--spacing-32` |
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |
| 56 | 56px | `--spacing-56` |
| 64 | 64px | `--spacing-64` |
| 72 | 72px | `--spacing-72` |
| 80 | 80px | `--spacing-80` |
| 96 | 96px | `--spacing-96` |
| 112 | 112px | `--spacing-112` |
| 120 | 120px | `--spacing-120` |
| 160 | 160px | `--spacing-160` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 9999px |
| cards | 42px |
| small | 20px |
| inputs | 12px |
| buttons | 9999px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| xl | `rgba(23, 73, 77, 0.15) 0px 20px 30px 0px` | `--shadow-xl` |
| xl-2 | `rgb(69, 65, 254) 40px 0px 576px 160px` | `--shadow-xl-2` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 56px
- **Card padding:** 24px
- **Element gap:** 16px

## Components

### Hero Headline
**Role:** Oversized display headline on dark canvas

Inter weight 700 at 72–92px, color #ffffff, line-height 0.88–1.00, letter-spacing -0.05em. Sits centered or left-aligned over the pink-to-violet ribbon graphic. The extreme size + tight tracking + low line-height is the system's signature.

### Schedule Demo Button (Light)
**Role:** Primary CTA on dark hero

Pill shape (9999px radius), background #ffffff, text #101722, padding 14px 24px, Inter 600 16px. No border, no shadow — pure white pill on dark navy.

### Need Help Button (Filled)
**Role:** Persistent nav CTA

Pill shape (9999px radius), background #4541fe Electric Iris, text #ffffff, padding 10px 20px, Inter 600 14px. The only chromatic button in the nav — draws the eye to the help action.

### Review Card
**Role:** User testimonial card on lavender canvas

Background #ffffff, border-radius 42px, padding 32px, no visible border. Contains Google Play icon, name in Inter 600 18px #101722, 5-star rating in gold, body text in Inter 400 14px #3f424e. Soft shadow optional (rgba(23,73,77,0.15) 0 20px 30px).

### Star Rating Badge
**Role:** 5-star review indicator

Five small gold/yellow star icons in a row, 12–16px each, no background, sits between name and review text.

### Vivid Accent Section Block
**Role:** Full-bleed chromatic content section

Background #4541fe Electric Iris, text #ffffff in Inter 700 36–64px, generous vertical padding 80–120px. The system uses this sparingly — one per page max — to create a visual exclamation point.

### Partner Logo Strip
**Role:** Government/client logo row

Horizontal row of monochrome white or grayscale logos, 40–60px height, even column-gap 24–32px, centered on dark or light canvas. No borders, no card backgrounds — logos float on the surface.

### Navigation Bar
**Role:** Top-level site navigation

Background #101722, height ~64px, logo left (Healthy Together with heart icon), nav links center in Inter 600 14px #ffffff (Solutions, Company, Resources), CTA right (Electric Iris pill). No dropdown shadows — flat dark bar.

### Floating Chat Widget
**Role:** Persistent help/chat bubble

Small circular button ~48px, background #4541fe with white chat icon, fixed bottom-right. Includes a dismissable tooltip "Hi, Need any help?" with X close button. Small enough to not compete with content.

### Gradient Ribbon Graphic
**Role:** Signature decorative hero element

Sweeping S-curve ribbon spanning the hero width, rendered as SVG or CSS gradient. Gradient: linear-gradient(270deg, #4541fe 40%, #fe0f83). Sits behind/through the headline, creating depth and motion without animation.

### Carousel Arrow Button
**Role:** Testimonial carousel navigation

Circular button, 40px diameter, background #101722, white arrow icon, centered horizontally. No label — icon only. Used in review section.

### Card Carousel Track
**Role:** Horizontal scrolling card row

Cards in a horizontal flex/overflow-scroll row, column-gap 24px, with partial cards visible at edges to imply scrollability. On #f9f0ff lavender canvas.

## Do's and Don'ts

### Do
- Use Inter at 700 weight with -0.05em letter-spacing for all display headlines — the tight tracking at large sizes is the system's typographic signature
- Anchor every page section to either #101722 Midnight Ink, #f9f0ff Linen Lavender, or #4541fe Electric Iris — never use plain white as a full-bleed canvas
- Apply 42px border-radius to all cards and 9999px to all buttons and tags — these two radii define the system's softness
- Use the pink-to-violet ribbon gradient (linear-gradient(270deg, #4541fe 40%, #fe0f83)) only in the hero as a single decorative moment
- Set CTA buttons to 14px or 16px Inter 600 with 9999px pill radius and 10–14px vertical padding
- Maintain 24px card padding and 16px element gaps as baseline rhythm tokens
- Keep the Electric Iris #4541fe reserved for a single vivid section block and CTA fills — scarcity creates impact

### Don't
- Don't introduce a second typeface — the system is single-font by design
- Don't use square or small radii (4–8px) on cards — the 42px radius is non-negotiable for the soft feel
- Don't use #ffffff as a full-bleed page canvas — every background should be midnight, lavender, or electric iris
- Don't apply the ribbon gradient to buttons, text, or non-hero elements — it is a one-time hero gesture
- Don't use #fe0f83 magenta as a standalone fill — it only exists as the gradient endpoint paired with Electric Iris
- Don't add heavy drop shadows to cards — the system uses at most rgba(23,73,77,0.15) 0 20px 30px for subtle lift
- Don't mix more than two surface temperatures per visible viewport (dark + accent, or light + accent)
- Don't use line-heights above 1.40 for body or above 1.10 for display — the compressed vertical rhythm is essential

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Midnight Canvas | `#101722` | Page-level dark background for hero and nav |
| 1 | Lavender Field | `#f9f0ff` | Light section canvas between dark blocks |
| 2 | Pure Card | `#ffffff` | Card and component interiors |
| 3 | Lilac Wash | `#d9c6ff` | Soft accent surface for chips, tags, highlight zones |
| 4 | Electric Iris | `#4541fe` | Vivid full-bleed accent sections and CTA fills |

## Elevation

- **Card:** `rgba(23, 73, 77, 0.15) 0px 20px 30px 0px`
- **Accent card on Electric Iris:** `rgb(69, 65, 254) 40px 0px 576px 160px — large diffuse violet glow wrapping highlight cards`

## Imagery

Photography-free, illustration-driven. The visual language is built from one signature element: a sweeping S-curve ribbon rendered as a pink-to-violet linear gradient (270deg, #4541fe → #fe0f83) that flows through the hero behind the headline. All other graphics are flat — Google Play icons in cards, monochrome government partner logos in a strip, and the heart icon in the wordmark. No 3D, no product screenshots, no lifestyle photography. The ribbon is the only organic shape; everything else is geometric and flat. Icon style is filled, mono-color, 1.5–2px equivalent weight. Imagery occupies roughly 20% of the page — text and color blocks dominate.

## Layout

Full-bleed dark hero with centered or left-aligned headline overlaid by the gradient ribbon, followed by alternating full-width bands: vivid Electric Iris section, then soft Lavender section with a horizontal card carousel. Navigation is a flat dark bar (64px) with logo left, links center, CTA right — no sticky shadow. Content is centered within ~1200px max-width on the lavender sections, but the dark and electric-iris sections are truly full-bleed. Section gaps are generous (56–80px). The card carousel uses partial-edge visibility to imply horizontal scroll. Partner logos sit in a single horizontal row at the bottom of the hero, centered. The overall rhythm: dark → vivid → soft → light cards, with no section repeating a background color consecutively.

## Agent Prompt Guide

**Quick Color Reference**
- text: #101722 (Midnight Ink)
- background (dark): #101722 (Midnight Ink)
- background (light): #f9f0ff (Linen Lavender)
- surface/card: #ffffff
- border: #6c6c7a (Muted Graphite) at 0.3 opacity, or hairline #101722 at 0.08
- accent: #4541fe (Electric Iris)
- primary action: #4541fe (filled action)

**3-5 Example Component Prompts**

1. Create a Primary Action Button: #4541fe background, #f9f0ff text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.

2. *Vivid accent section*: Full-bleed background #4541fe. Headline at 48px Inter 700, #ffffff, line-height 1.1. Body text at 18px Inter 400, #ffffff at 0.8 opacity. Vertical padding 96px top and bottom.

3. *Testimonial card on lavender*: Background #f9f0ff. Card: #ffffff fill, 42px radius, 32px padding, subtle shadow rgba(23,73,77,0.15) 0 20px 30px. Name at 18px Inter 600 #101722. Star row (5 gold stars, 14px). Body at 14px Inter 400 #3f424e.

4. *Navigation bar*: Background #101722, height 64px, full-width. Logo left: heart icon (#fe0f83) + 'Healthy Together' in Inter 600 16px #ffffff. Center: 'Solutions / Company / Resources' in Inter 600 14px #ffffff with 24px gaps. Right: Electric Iris pill button (background #4541fe, text #ffffff, 9999px radius, 10px 20px padding).

5. *Partner logo strip*: Horizontal row of 6–8 monochrome white logos, 48px height, column-gap 32px, centered on a #101722 background. No card backgrounds, no borders — logos float directly on the dark canvas.

## Similar Brands

- **Webflow** — Same dark-anchored hero with single vivid violet accent and oversized compressed display type
- **Cal.com** — Full-bleed dark sections alternating with vivid brand-color blocks, pill-shaped CTAs, generous card radii
- **Linear** — Single-font system (Inter), tight letter-spacing on large headings, midnight canvas with one electric accent
- **Lenny's Newsletter (Lennys.com)** — Dark hero with sweeping decorative gradient ribbon, alternating dark/light section rhythm, pill CTAs

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-midnight-ink: #101722;
  --color-linen-lavender: #f9f0ff;
  --color-pure-white: #ffffff;
  --color-muted-graphite: #6c6c7a;
  --color-deep-charcoal: #3f424e;
  --color-electric-iris: #4541fe;
  --gradient-electric-iris: linear-gradient(270deg, #4541fe 40%, #fe0f83);
  --color-lilac-whisper: #d9c6ff;
  --color-hot-magenta: #fe0f83;

  /* Typography — Font Families */
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.4;
  --tracking-caption: -0.7px;
  --text-body: 16px;
  --leading-body: 1.4;
  --tracking-body: -0.8px;
  --text-subheading: 24px;
  --leading-subheading: 1.3;
  --tracking-subheading: -1.2px;
  --text-heading-sm: 36px;
  --leading-heading-sm: 1.15;
  --tracking-heading-sm: -1.8px;
  --text-heading: 64px;
  --leading-heading: 1.1;
  --tracking-heading: -3.2px;
  --text-heading-lg: 72px;
  --leading-heading-lg: 1;
  --tracking-heading-lg: -3.6px;
  --text-display: 92px;
  --leading-display: 0.88;
  --tracking-display: -4.6px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-56: 56px;
  --spacing-64: 64px;
  --spacing-72: 72px;
  --spacing-80: 80px;
  --spacing-96: 96px;
  --spacing-112: 112px;
  --spacing-120: 120px;
  --spacing-160: 160px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 56px;
  --card-padding: 24px;
  --element-gap: 16px;

  /* Border Radius */
  --radius-2xl: 20px;
  --radius-3xl: 28.8px;
  --radius-3xl-2: 42px;
  --radius-full: 1600px;
  --radius-full-2: 16000px;

  /* Named Radii */
  --radius-tags: 9999px;
  --radius-cards: 42px;
  --radius-small: 20px;
  --radius-inputs: 12px;
  --radius-buttons: 9999px;

  /* Shadows */
  --shadow-xl: rgba(23, 73, 77, 0.15) 0px 20px 30px 0px;
  --shadow-xl-2: rgb(69, 65, 254) 40px 0px 576px 160px;

  /* Surfaces */
  --surface-midnight-canvas: #101722;
  --surface-lavender-field: #f9f0ff;
  --surface-pure-card: #ffffff;
  --surface-lilac-wash: #d9c6ff;
  --surface-electric-iris: #4541fe;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-midnight-ink: #101722;
  --color-linen-lavender: #f9f0ff;
  --color-pure-white: #ffffff;
  --color-muted-graphite: #6c6c7a;
  --color-deep-charcoal: #3f424e;
  --color-electric-iris: #4541fe;
  --color-lilac-whisper: #d9c6ff;
  --color-hot-magenta: #fe0f83;

  /* Typography */
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.4;
  --tracking-caption: -0.7px;
  --text-body: 16px;
  --leading-body: 1.4;
  --tracking-body: -0.8px;
  --text-subheading: 24px;
  --leading-subheading: 1.3;
  --tracking-subheading: -1.2px;
  --text-heading-sm: 36px;
  --leading-heading-sm: 1.15;
  --tracking-heading-sm: -1.8px;
  --text-heading: 64px;
  --leading-heading: 1.1;
  --tracking-heading: -3.2px;
  --text-heading-lg: 72px;
  --leading-heading-lg: 1;
  --tracking-heading-lg: -3.6px;
  --text-display: 92px;
  --leading-display: 0.88;
  --tracking-display: -4.6px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-56: 56px;
  --spacing-64: 64px;
  --spacing-72: 72px;
  --spacing-80: 80px;
  --spacing-96: 96px;
  --spacing-112: 112px;
  --spacing-120: 120px;
  --spacing-160: 160px;

  /* Border Radius */
  --radius-2xl: 20px;
  --radius-3xl: 28.8px;
  --radius-3xl-2: 42px;
  --radius-full: 1600px;
  --radius-full-2: 16000px;

  /* Shadows */
  --shadow-xl: rgba(23, 73, 77, 0.15) 0px 20px 30px 0px;
  --shadow-xl-2: rgb(69, 65, 254) 40px 0px 576px 160px;
}
```
