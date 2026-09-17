# Tana — Style Reference
> Midnight gallery, single lime beacon — a dark editorial spread where one pale-green button is the only color on the entire page.

**Theme:** dark

Tana is a midnight editorial: pure black canvas, one pale-lime signal, nothing else. The entire interface is monochrome — warm off-white type, a quiet scale of grays for hairlines and secondary text — with a single chromatic accent (#e1f0bd) reserved exclusively for the primary action. Headlines come from a custom high-contrast serif (tanaClassic) set tight at negative tracking, which creates a magazine-spread authority against the void. Category labels are pentagon-shaped tags (pointed left edge, flat right) that orbit around imagery like marginalia, turning product features into a printed index. Layout is centered and generous, with editorial photography used sparingly as a single warm focal point in an otherwise typographic page. Everything else is restraint.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Void | `#000000` | `--color-void` | Page canvas, section backgrounds, card surfaces — pure black, not near-black, makes the off-white type and the lime accent feel luminous |
| Charcoal | `#0e0e0e` | `--color-charcoal` | Elevated surface layer, subtle borders, secondary backgrounds — one step off the void for depth without breaking the dark mode |
| Bone | `#f0eded` | `--color-bone` | Primary text, pentagon tag fills, announcement bar background — slightly warm off-white, softer than pure white against deep black |
| Ash | `#b3b3b3` | `--color-ash` | Secondary body text, muted helper copy, list dividers — the dominant mid-gray for all non-primary prose |
| Smoke | `#808080` | `--color-smoke` | Tertiary text, subtle metadata, low-priority borders |
| Graphite | `#606060` | `--color-graphite` | Faintest visible borders, disabled text — the lower edge of the readable gray scale |
| Lime Signal | `#e1f0bd` | `--color-lime-signal` | Primary CTA fill only — a muted pale lime used exclusively for the early-access button, never for links, icons, or decoration. The one chromatic moment on the entire page |

## Tokens — Typography

### SF Pro — Body, UI, subheadings, and button text. Weight 300 is used for mid-size headings (24–29px) — an anti-convention choice that makes subheadings recede rather than compete with the serif display. Weight 400 for body, buttons, and dense text at 1.50–1.75 line-height for breathing room · `--font-sf-pro`
- **Substitute:** Inter, -apple-system, system-ui
- **Weights:** 300, 400
- **Sizes:** 13px, 15px, 16px, 17px, 18px, 19px, 20px, 21px, 24px, 26px, 29px
- **Line height:** 1.20, 1.40, 1.50, 1.75
- **Letter spacing:** 0.01em across all sizes
- **Role:** Body, UI, subheadings, and button text. Weight 300 is used for mid-size headings (24–29px) — an anti-convention choice that makes subheadings recede rather than compete with the serif display. Weight 400 for body, buttons, and dense text at 1.50–1.75 line-height for breathing room

### tanaClassic — Display and heading serif. High-contrast, editorial, used at 84px for hero headlines and 38–48px for section headings. Negative tracking (-0.045em at display, -0.030em at mid-headings) tightens the serif into a dense magazine block. The weight 350–400 range is lighter than typical headline serifs, giving the type a whisper of authority rather than shouting · `--font-tanaclassic`
- **Substitute:** Playfair Display, Cormorant Garamond, or DM Serif Display
- **Weights:** 350, 400
- **Sizes:** 17px, 19px, 38px, 42px, 48px, 84px
- **Line height:** 1.10, 1.20, 1.25, 1.75
- **Letter spacing:** -0.045em at 84px (≈ -3.78px), -0.030em at 38–48px (≈ -1.14 to -1.44px)
- **Role:** Display and heading serif. High-contrast, editorial, used at 84px for hero headlines and 38–48px for section headings. Negative tracking (-0.045em at display, -0.030em at mid-headings) tightens the serif into a dense magazine block. The weight 350–400 range is lighter than typical headline serifs, giving the type a whisper of authority rather than shouting

### Arial — Arial — detected in extracted data but not described by AI · `--font-arial`
- **Weights:** 400
- **Sizes:** 17px
- **Line height:** 1.2
- **Role:** Arial — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 13px | 1.2 | 0.13px | `--text-caption` |
| body-sm | 16px | 1.5 | 0.16px | `--text-body-sm` |
| body | 18px | 1.5 | 0.18px | `--text-body` |
| body-lg | 21px | 1.75 | 0.21px | `--text-body-lg` |
| subheading | 24px | 1.2 | 0.24px | `--text-subheading` |
| heading-sm | 29px | 1.4 | 0.29px | `--text-heading-sm` |
| heading | 38px | 1.2 | -1.14px | `--text-heading` |
| heading-lg | 48px | 1.25 | -1.44px | `--text-heading-lg` |
| display | 84px | 1.1 | -3.78px | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 8 | 8px | `--spacing-8` |
| 12 | 12px | `--spacing-12` |
| 16 | 16px | `--spacing-16` |
| 24 | 24px | `--spacing-24` |
| 32 | 32px | `--spacing-32` |
| 36 | 36px | `--spacing-36` |
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |
| 96 | 96px | `--spacing-96` |
| 112 | 112px | `--spacing-112` |
| 128 | 128px | `--spacing-128` |
| 160 | 160px | `--spacing-160` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 0px (pentagon clip-path, no radius) |
| cards | 0px |
| images | 10px |
| buttons | 10px |

### Layout

- **Page max-width:** 1040px
- **Section gap:** 32-40px
- **Card padding:** 16-24px
- **Element gap:** 6-8px

## Components

### Pentagon Category Tag
**Role:** Feature/output label orbiting around hero imagery

Pentagon-shaped tag with a pointed left edge (CSS clip-path polygon), flat right edge. Fill: #f0eded (Bone). Text: #000000, 13–15px SF Pro 400, 0.01em tracking. No border, no radius, no padding beyond ~8px vertical × 12px horizontal on the flat side. These tags float in the layout like printed marginalia pointing at the central image. Used for labels like 'Prototypes', 'Storyboards', 'Slide decks', 'PRs', 'Filed Bugs'.

### Lime CTA Button
**Role:** Primary action — the only colored button in the system

Filled pill button. Background: #e1f0bd (Lime Signal). Text: #000000, 15px SF Pro 400, 0.01em tracking. No border, no shadow. Border-radius: 10px. Padding: 6px vertical × 12px horizontal. Reserved exclusively for the single most important action per page. The muted lime against pure black creates urgency without aggression — it glows rather than shouts.

### Ghost Text Link
**Role:** Secondary action or contextual link below a CTA

No background, no border. Text: #b3b3b3 (Ash) or #808080 (Smoke), 13–15px SF Pro 400. Hover brightens to #f0eded. No underline by default. Used for 'Ask your agents about it' and similar micro-CTA patterns.

### Announcement Bar
**Role:** Site-wide notice at the very top of the page

Full-width strip with #f0eded (Bone) background and #000000 text. Single line of body text with an inline link. No padding excess — tight 6–8px vertical. Sits above the main nav, visually distinct from the dark page below.

### Navigation Header
**Role:** Minimal top nav on a dark page

Transparent over the #000000 canvas. Left: wordmark 'tana' in #f0eded, small SF Pro. Right: minimal icon (appears to be a T-shaped or tree icon in #f0eded). No nav links, no hamburger — extreme minimalism.

### Hero Headline Block
**Role:** Centered display title with subhead and CTA stack

Vertically centered in the upper viewport. Display title: 84px tanaClassic 400, #f0eded, -3.78px tracking. Subhead: 18–21px SF Pro 400, #b3b3b3, 1.50–1.75 line-height. CTA stack below: Lime CTA Button + Ghost Text Link, 8px gap. Generous vertical space — the hero breathes.

### Editorial Image with Orbiting Tags
**Role:** Feature showcase with category labels around a photo

Centered photographic image (~300–350px wide, 10px border-radius) with Pentagon Category Tags scattered in the surrounding dark space. The image introduces a warm, human focal point into the void. Tags point leftward toward the image, creating a sense of annotations or printed captions.

### Section Heading
**Role:** Mid-page section title

38–48px tanaClassic 400, #f0eded, -1.14 to -1.44px tracking. Left-aligned or centered. Followed by body text at 18–21px SF Pro 400, #b3b3b3. 24–32px gap between heading and body.

### AI Testimonial Block
**Role:** Quote from an AI model presented as editorial pull-quote

Centered block on #000000. Quote text: 18–21px tanaClassic or SF Pro 400, #f0eded, italic, 1.50–1.75 line-height. Attribution: 13–15px SF Pro 400, #808080, right-aligned or centered below quote. Wide margin between consecutive quotes (32–40px). No quotation marks — the formatting and attribution carry the quote structure.

### Body Prose Block
**Role:** Long-form explanatory text

17–19px SF Pro 400, #b3b3b3, 1.75 line-height. Max-width ~640px for readable line length. Paragraph spacing: 16–24px. No bold, no links, no images — pure typographic content.

### Utility Icon Button
**Role:** Small icon-only interactive in the nav or toolbar

No background, no border. Icon: #f0eded, 16–20px. 8px padding click target. Used for the nav-right T-shaped icon and similar minimal controls.

## Do's and Don'ts

### Do
- Use #e1f0bd (Lime Signal) only for the single most important action per screen — never for links, icons, tags, or decoration
- Set hero headlines at 84px tanaClassic 400 with -3.78px letter-spacing — the negative tracking is what makes the serif feel editorial rather than default
- Use weight 300 SF Pro for subheadings (24–29px) to let them recede behind the serif display — the hierarchy is serif > light-sans > regular-sans
- Orbit Pentagon Category Tags around imagery with 15px margins, pointing their pointed edge leftward toward the visual they describe
- Set body text line-height to 1.75 for prose and 1.50 for UI — the generous leading compensates for the dark background
- Keep the entire page at 0% colorfulness outside the one lime CTA — resist adding accent colors, gradients, or colored illustrations
- Use 10px border-radius for buttons and images only — tags, cards, and sections stay sharp (0px) to maintain the editorial precision

### Don't
- Never use a second accent color — the system's identity depends on lime being the only chromatic note
- Never use box-shadows, glows, or blur effects — depth comes from surface tone shifts, not elevation effects
- Never set serif headlines at normal or positive letter-spacing — the negative tracking is signature-defining
- Never use weight 500+ for SF Pro subheadings — the light weight (300) is what makes the serif the dominant voice
- Never apply the lime accent to backgrounds other than the primary CTA button — no lime cards, tags, borders, or highlights
- Never use pure white #ffffff for text — use #f0eded (Bone) for warmth against the black canvas
- Never use generic border-radius values like 4px or 8px — the system commits to 10px for buttons/images and 0px for everything else

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Void | `#000000` | Page canvas, all section backgrounds |
| 2 | Charcoal | `#0e0e0` | Elevated cards, subtle surface lift |
| 3 | Bone | `#f0eded` | Pentagon tag fills, announcement bar — the only light surface in the system |
| 4 | Lime Signal | `#e1f0bd` | CTA button — the single colored surface |

## Elevation

- **Pentagon tag:** `none — flat fill, no shadow`
- **CTA button:** `none — flat lime fill, no shadow or border`
- **Page cards and sections:** `none — pure black surfaces, depth comes from surface tone shifts, not shadows`

## Imagery

Extremely sparse. The page uses a single editorial photograph — a man working at a table with warm lamp light and plants — as the only visual element. The image is contained (~350px wide), has 10px border-radius, and is surrounded by Pentagon Category Tags that orbit it like printed annotations. No illustrations, no abstract graphics, no product screenshots, no icon systems beyond a single small nav icon. The void of the black canvas is itself the dominant visual — the photograph and its tags are the single moment of warmth and complexity in an otherwise typographic page.

## Layout

Centered single-column layout, max-width ~1040px. The page is organized as a vertical sequence of centered blocks separated by generous whitespace (40–80px gaps). The hero occupies the full viewport height with the headline, subhead, and CTA stacked vertically and center-aligned. Below the hero, a section pairs a centered photograph with floating Pentagon Tags in the surrounding space — an editorial spread, not a grid. Subsequent sections are centered text blocks: section heading + body prose, followed by a series of AI testimonial quotes stacked vertically with wide margins. Navigation is minimal: a small wordmark top-left and a single icon top-right, floating on the black canvas. The entire page reads top-to-bottom as a single column — no multi-column layouts, no sidebar, no grid systems. Density is comfortable, almost sparse — whitespace is a primary design element.

## Agent Prompt Guide

**Quick Color Reference**
- Canvas: #000000 (Void)
- Elevated surface: #0e0e0e (Charcoal)
- Primary text: #f0eded (Bone)
- Secondary text: #b3b3b3 (Ash)
- Muted text: #808080 (Smoke)
- primary action: #e1f0bd (filled action)

**Example Component Prompts**

1. **Lime CTA Button**: Create a filled pill button. Background: #e1f0bd. Text: 'Get early access' in #000000, 15px SF Pro weight 400, letter-spacing 0.01em. Border-radius: 10px. Padding: 6px vertical, 12px horizontal. No border, no shadow.

2. **Pentagon Category Tag**: Create a left-pointing pentagon label. Shape via clip-path: polygon(0 50%, 12px 0, 100% 0, 100% 100%, 12px 100%). Fill: #f0eded. Text: 'Prototypes' in #000000, 13px SF Pro weight 400, letter-spacing 0.01em. Padding: 8px 12px 8px 16px. No border, no radius.

3. Create a Primary Action Button: #e1f0bd background, #000000 text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.

4. **Section Heading + Body**: Create a left-aligned text block. Heading: '30,000 hrs in meetings' at 48px tanaClassic weight 400, #f0eded, letter-spacing -1.44px. Body below: 19px SF Pro weight 400, #b3b3b3, line-height 1.75, max-width 640px. 32px gap between heading and body.

5. **AI Testimonial Block**: Create a centered quote block on #000000. Quote text: 19px tanaClassic weight 400, #f0eded, italic, line-height 1.75, max-width 600px. Attribution below: 13px SF Pro weight 400, #808080, centered. 40px vertical space between consecutive quotes.

## Similar Brands

- **Linear** — Same dark-mode editorial sensibility with restrained color palettes and tight typographic hierarchy, though Linear uses purple accents where Tana uses lime
- **Notion AI** — Both position AI as ambient intelligence with minimal interfaces, but Tana commits harder to pure black + single accent whereas Notion uses lighter surfaces
- **Arc Browser** — Shared editorial typographic confidence — large display headlines, generous whitespace, and the willingness to let one image or one accent color carry the entire page
- **Pitch** — Both use high-contrast serif headlines over dark canvases with single-color accent systems, treating landing pages as editorial spreads rather than SaaS templates
- **Vercel** — Dark canvas, monochrome UI, and a single accent color for CTAs — though Vercel uses geometric sans display type where Tana uses a custom editorial serif

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-void: #000000;
  --color-charcoal: #0e0e0e;
  --color-bone: #f0eded;
  --color-ash: #b3b3b3;
  --color-smoke: #808080;
  --color-graphite: #606060;
  --color-lime-signal: #e1f0bd;

  /* Typography — Font Families */
  --font-sf-pro: 'SF Pro', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-tanaclassic: 'tanaClassic', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-arial: 'Arial', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 13px;
  --leading-caption: 1.2;
  --tracking-caption: 0.13px;
  --text-body-sm: 16px;
  --leading-body-sm: 1.5;
  --tracking-body-sm: 0.16px;
  --text-body: 18px;
  --leading-body: 1.5;
  --tracking-body: 0.18px;
  --text-body-lg: 21px;
  --leading-body-lg: 1.75;
  --tracking-body-lg: 0.21px;
  --text-subheading: 24px;
  --leading-subheading: 1.2;
  --tracking-subheading: 0.24px;
  --text-heading-sm: 29px;
  --leading-heading-sm: 1.4;
  --tracking-heading-sm: 0.29px;
  --text-heading: 38px;
  --leading-heading: 1.2;
  --tracking-heading: -1.14px;
  --text-heading-lg: 48px;
  --leading-heading-lg: 1.25;
  --tracking-heading-lg: -1.44px;
  --text-display: 84px;
  --leading-display: 1.1;
  --tracking-display: -3.78px;

  /* Typography — Weights */
  --font-weight-light: 300;
  --font-weight-w350: 350;
  --font-weight-regular: 400;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-36: 36px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-96: 96px;
  --spacing-112: 112px;
  --spacing-128: 128px;
  --spacing-160: 160px;

  /* Layout */
  --page-max-width: 1040px;
  --section-gap: 32-40px;
  --card-padding: 16-24px;
  --element-gap: 6-8px;

  /* Border Radius */
  --radius-lg: 10px;

  /* Named Radii */
  --radius-tags: 0px (pentagon clip-path, no radius);
  --radius-cards: 0px;
  --radius-images: 10px;
  --radius-buttons: 10px;

  /* Surfaces */
  --surface-void: #000000;
  --surface-charcoal: #0e0e0;
  --surface-bone: #f0eded;
  --surface-lime-signal: #e1f0bd;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-void: #000000;
  --color-charcoal: #0e0e0e;
  --color-bone: #f0eded;
  --color-ash: #b3b3b3;
  --color-smoke: #808080;
  --color-graphite: #606060;
  --color-lime-signal: #e1f0bd;

  /* Typography */
  --font-sf-pro: 'SF Pro', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-tanaclassic: 'tanaClassic', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-arial: 'Arial', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 13px;
  --leading-caption: 1.2;
  --tracking-caption: 0.13px;
  --text-body-sm: 16px;
  --leading-body-sm: 1.5;
  --tracking-body-sm: 0.16px;
  --text-body: 18px;
  --leading-body: 1.5;
  --tracking-body: 0.18px;
  --text-body-lg: 21px;
  --leading-body-lg: 1.75;
  --tracking-body-lg: 0.21px;
  --text-subheading: 24px;
  --leading-subheading: 1.2;
  --tracking-subheading: 0.24px;
  --text-heading-sm: 29px;
  --leading-heading-sm: 1.4;
  --tracking-heading-sm: 0.29px;
  --text-heading: 38px;
  --leading-heading: 1.2;
  --tracking-heading: -1.14px;
  --text-heading-lg: 48px;
  --leading-heading-lg: 1.25;
  --tracking-heading-lg: -1.44px;
  --text-display: 84px;
  --leading-display: 1.1;
  --tracking-display: -3.78px;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-36: 36px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-96: 96px;
  --spacing-112: 112px;
  --spacing-128: 128px;
  --spacing-160: 160px;

  /* Border Radius */
  --radius-lg: 10px;
}
```
