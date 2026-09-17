# Flutterwave Design — Style Reference
> warm editorial magazine on cream paper

**Theme:** light

Flutterwave Design operates as a warm editorial canvas — cream paper (#fff9f1) instead of clinical white, with a single golden amber accent (#f5a623) acting like a highlighter stroke across otherwise monochrome content. Headings opt for deep midnight indigo (#12122c) rather than pure black, giving text a velvet weight against the warm ground. Typography is compact and confident: a bold display cut (Millik) at 60px carries the hero, while Moderat handles everything from 12px captions to 22px subheads with uniformly tight tracking. Layout breathes like a magazine spread — generous vertical section gaps, centered max-width container, illustration-driven cards in a horizontal carousel and 3-column grid. Components stay small and unfussy: 5px radius everywhere, no shadows, thin borders, color reserved for content art rather than chrome.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Cream Paper | `#fff9f1` | `--color-cream-paper` | Primary page canvas, card surfaces, nav background — the warm ground tone every screen sits on |
| Ink Black | `#171717` | `--color-ink-black` | Primary text, body copy, icon strokes, hairline borders — the dominant ink across the system |
| Steel Gray | `#b5b5b5` | `--color-steel-gray` | Muted card backgrounds, disabled surfaces, secondary fills |
| Graphite | `#8b8b8b` | `--color-graphite` | Tertiary surface, subtle background blocks, inactive dividers |
| True Black | `#000000` | `--color-true-black` | Hard borders on icons, nav emphasis, button outlines where maximum contrast is needed |
| Midnight Indigo | `#12122c` | `--color-midnight-indigo` | Display headings, link text, heading borders — deep violet-black replacing pure black for warmth and brand character |
| Golden Amber | `#f5a623` | `--color-golden-amber` | Primary action fill, logo heart mark, highlighter accents — the single warm punctuation color in an otherwise cool monochrome system |
| Peach Blush | `#fcd2ba` | `--color-peach-blush` | Accent section band backgrounds (Vibes, features) — warm wash that breaks cream monotony without introducing a new hue |

## Tokens — Typography

### Millik — Display and heading font — used only for the hero headline and section titles. Heavy weight (700-800) with -0.025em tracking at 60px creates a poster-like authority. Custom serif-adjacent display cut gives the site its editorial magazine voice; substitute with Recoleta or Tiempos Headline if Millik is unavailable. · `--font-millik`
- **Substitute:** Recoleta, Tiempos Headline, GT Super
- **Weights:** 700, 800
- **Sizes:** 32px, 60px
- **Line height:** 1.20
- **Letter spacing:** -1.5px at 60px, -0.42px at 32px
- **Role:** Display and heading font — used only for the hero headline and section titles. Heavy weight (700-800) with -0.025em tracking at 60px creates a poster-like authority. Custom serif-adjacent display cut gives the site its editorial magazine voice; substitute with Recoleta or Tiempos Headline if Millik is unavailable.

### Moderat — Primary UI and body font — covers everything from 12px captions to 22px subheads. Geometrical sans with uniformly tight -0.036em tracking that keeps even small text compact and editorial. 400 for body, 500 for nav/links, 600 for labels, 700 for emphasis. Substitute with Inter or General Sans for closest match. · `--font-moderat`
- **Substitute:** Inter, General Sans, Söhne
- **Weights:** 400, 500, 600, 700
- **Sizes:** 12px, 14px, 16px, 18px, 20px, 22px
- **Line height:** 1.18, 1.20, 1.60, 1.63
- **Letter spacing:** -0.43px at 12px, -0.5px at 14px, -0.58px at 16px, -0.65px at 18px, -0.72px at 20px, -0.79px at 22px
- **Role:** Primary UI and body font — covers everything from 12px captions to 22px subheads. Geometrical sans with uniformly tight -0.036em tracking that keeps even small text compact and editorial. 400 for body, 500 for nav/links, 600 for labels, 700 for emphasis. Substitute with Inter or General Sans for closest match.

### Flutterwave — Reserved for the Flutterwave wordmark and icon glyphs — not a general-purpose text face. Limited to brand marks and the small heart logo. · `--font-flutterwave`
- **Substitute:** Flutterwave brand font (proprietary)
- **Weights:** 400
- **Sizes:** 14px, 16px
- **Line height:** 1.20
- **Letter spacing:** normal
- **Role:** Reserved for the Flutterwave wordmark and icon glyphs — not a general-purpose text face. Limited to brand marks and the small heart logo.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.2 | -0.43px | `--text-caption` |
| body-sm | 14px | 1.2 | -0.5px | `--text-body-sm` |
| body | 16px | 1.2 | -0.58px | `--text-body` |
| body-lg | 18px | 1.2 | -0.65px | `--text-body-lg` |
| subheading | 20px | 1.2 | -0.72px | `--text-subheading` |
| heading-sm | 22px | 1.18 | -0.79px | `--text-heading-sm` |
| heading | 32px | 1.2 | -0.42px | `--text-heading` |
| display | 60px | 1.2 | -1.5px | `--text-display` |

## Tokens — Spacing & Shapes

**Density:** compact

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 5 | 5px | `--spacing-5` |
| 6 | 6px | `--spacing-6` |
| 8 | 8px | `--spacing-8` |
| 10 | 10px | `--spacing-10` |
| 11 | 11px | `--spacing-11` |
| 12 | 12px | `--spacing-12` |
| 18 | 18px | `--spacing-18` |
| 20 | 20px | `--spacing-20` |
| 24 | 24px | `--spacing-24` |
| 26 | 26px | `--spacing-26` |
| 30 | 30px | `--spacing-30` |
| 32 | 32px | `--spacing-32` |
| 40 | 40px | `--spacing-40` |
| 50 | 50px | `--spacing-50` |
| 60 | 60px | `--spacing-60` |
| 120 | 120px | `--spacing-120` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 5px |
| cards | 5px |
| inputs | 5px |
| buttons | 5px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 60px
- **Card padding:** 20px
- **Element gap:** 10px

## Components

### Top Navigation Bar
**Role:** Site-wide header

Horizontal bar on cream canvas with 5px bottom hairline border in #171717. Left: wordmark 'Design' (Moderat 14-16px weight 500, Ink Black) with small amber heart icon. Center: nav links (Moderat 14px weight 400, Ink Black) spaced 26-30px apart. Right: theme toggle (two small circles, one outlined, one filled black).

### Display Hero Headline
**Role:** Primary page-level headline

Millik 60px weight 700, color Midnight Indigo (#12122c), line-height 1.2, letter-spacing -1.5px. Centered on cream canvas. No gradient or decoration — pure typographic statement. Typically 2 lines, with emoji or inline element mid-sentence.

### Hero Body Text
**Role:** Intro paragraph below hero headline

Moderat 16-18px weight 400, Ink Black (#171717), centered, max-width ~600px. Tight -0.58px tracking keeps the paragraph compact.

### Story Carousel Card
**Role:** Horizontal scrolling story preview

Full-bleed illustration (no padding around image) with overlay or below-card title in Millik or Moderat bold. 5px border-radius on container. Cards are wider than grid cards (roughly 280-340px wide), no border or shadow, colored illustration fills the card edge-to-edge.

### Story Grid Card
**Role:** 3-column editorial story card

Top: full-color illustration filling card width with 5px top-radius. Below illustration: 20px padding. Content stack: category label (Moderat 12px weight 600, uppercase, letter-spacing normal, Ink Black), title (Moderat 20px weight 600, Ink Black, 2-line clamp), meta line (Moderat 12px weight 400, uppercase, gray). No border, no shadow — sits directly on cream canvas.

### Category Tag
**Role:** Small uppercase label above story titles

Moderat 12px weight 600, uppercase, Ink Black (#171717), normal letter-spacing. No background, no border — just typographic. Reads as editorial section labels (e.g. 'DESIGN THINKING').

### Author Byline
**Role:** Credit line below story title

Moderat 14px weight 400, Ink Black. Format: 'By [Author Name]' with author name in weight 500 for subtle emphasis. Sits 8-10px below title.

### Section Header
**Role:** Section title with optional action link

Left: Millik 32px weight 700, Midnight Indigo. Right: 'VIEW ALL STORIES' in Moderat 12px weight 600, uppercase, with a small circle-arrow icon. Spaced across the max-width container with 30px+ gap between title and action.

### Peach Section Band
**Role:** Full-bleed warm content section

Full-width band with background #fcd2ba, 60px+ vertical padding. Contains headings in Midnight Indigo and body text in Ink Black. Used to break cream monotony and signal a different content mode (Vibes, featured).

### Theme Toggle
**Role:** Light/dark mode switcher in nav

Two small circles side by side in the top-right of nav. Active mode is filled (#171717), inactive is outlined (1px #171717 border, cream fill). ~16px diameter, 5px gap between circles.

### Golden Amber CTA Button
**Role:** Primary action button

Background #f5a623 (Golden Amber), text Ink Black (#171717), Moderat 14-16px weight 600. 5px border-radius. Padding 10px 20px. No border, no shadow. The single warm color in the system — used sparingly for primary actions only.

### Ghost Link Button
**Role:** Secondary text-based action

No background, no border. Moderat 12-14px weight 600, uppercase, Ink Black. Often paired with a small arrow or circle icon. Used for 'View all', 'Read more', navigation prompts.

### Heart Logo Mark
**Role:** Brand identity icon

Small amber/golden heart icon (~16px) positioned left of the 'Design' wordmark in the nav. Solid fill in Golden Amber (#f5a623). The only instance of the brand color as a decorative mark.

## Do's and Don'ts

### Do
- Use #fff9f1 (Cream Paper) as the default canvas for every page — never switch to pure white.
- Set display headlines in Millik 60px weight 700 with -1.5px letter-spacing and Midnight Indigo (#12122c) color.
- Apply 5px border-radius to all cards, buttons, inputs, and tags — consistency is the point.
- Reserve Golden Amber (#f5a623) for the primary CTA fill and the heart logo only — it is accent punctuation, not a surface color.
- Use the Peach Blush (#fcd2ba) band to separate major content sections from the cream default.
- Set all text to Ink Black (#171717) for body and Midnight Indigo (#12122c) for headings — do not mix pure black into the heading hierarchy.
- Keep all tracking negative — Moderat at -0.036em, Millik at -0.025em — to preserve the compact editorial density.

### Don't
- Do not introduce drop shadows, glows, or blurs to cards or buttons — elevation comes from color contrast alone.
- Do not use Golden Amber for backgrounds, panels, or large fills — it loses its punch as a accent if it covers more than button-sized areas.
- Do not use pure white (#ffffff) as a surface — cream (#fff9f1) is the canvas, white breaks the warm system.
- Do not set headings in pure black (#000000) — Midnight Indigo (#12122c) is the heading color, it carries the brand character.
- Do not use border-radius values other than 5px — no pills, no 0px sharp corners, no 8-12px rounded cards.
- Do not add gradients, patterns, or decorative backgrounds to UI chrome — illustrations on cards are where visual interest lives.
- Do not set body text above 20px in Moderat — for larger sizes, switch to Millik to maintain the type hierarchy.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Cream Canvas | `#fff9f1` | Default page background, nav bar, most card surfaces |
| 2 | Peach Band | `#fcd2ba` | Featured section backgrounds that need warmth and visual separation from cream |
| 3 | Steel Surface | `#b5b5b5` | Muted card or container backgrounds for secondary content blocks |
| 4 | Graphite Surface | `#8b8b8b` | Tertiary background, subtle decorative blocks |

## Elevation

The system avoids shadows entirely. Elevation is communicated through surface color contrast (cream → peach → steel) and 1px hairline borders in #171717, not drop shadows. This keeps the interface flat and editorial, letting illustrations carry visual weight.

## Imagery

Illustration-driven: every story card and section visual is a custom flat illustration with vivid colors (greens, purples, oranges, pinks, teals). Illustrations are full-bleed, filling the card edge-to-edge with no padding or framing. The style is geometric and slightly abstract — hands, objects, UI elements, nature motifs — with flat color fills and minimal shading. No photography is used in the visible sections. Icons in the UI are simple outlined shapes (circles, arrows) in Ink Black. The illustrations carry all the color personality of the site; the interface itself stays monochrome with single-amber accents.

## Layout

Centered max-width container (1200px) on a full-bleed cream canvas. The hero is a centered typographic block — no imagery above the fold, just a large Millik headline and body intro stacked vertically with generous breathing room. Below the hero, a horizontal scrolling carousel of full-bleed illustration cards peeks in from the edges, creating a sense of motion and overflow. The main content section uses a 3-column grid for story cards, with a left-aligned section header and a right-aligned 'View All' ghost link. A full-width Peach Blush band breaks the cream rhythm for featured/Vibes content. Navigation is a single top bar with no sticky behavior visible. Overall density is spacious — 60px+ between sections, compact within sections.

## Agent Prompt Guide

**Quick Color Reference**
- text: #171717 (Ink Black)
- heading: #12122c (Midnight Indigo)
- background: #fff9f1 (Cream Paper)
- border: #171717 (Ink Black hairline)
- accent: #f5a623 (Golden Amber — CTA fill, logo)
- section band: #fcd2ba (Peach Blush)
- primary action: #f5a623 (filled action)

**Example Component Prompts**

1. *Create a hero headline block:* Cream Paper background (#fff9f1). Centered Millik 60px weight 700, color Midnight Indigo (#12122c), letter-spacing -1.5px, line-height 1.2. Below it, a body paragraph in Moderat 18px weight 400, Ink Black (#171717), max-width 600px, centered. 80px top padding, 60px bottom padding.

2. *Create a story grid card:* 5px border-radius, no border, no shadow. Full-bleed illustration fills the top half. Below: 20px padding containing a category tag (Moderat 12px weight 600, uppercase, Ink Black), then a title (Moderat 20px weight 600, Ink Black, 2 lines), then a date meta line (Moderat 12px weight 400, uppercase, #8b8b8b). Card sits directly on cream canvas.

3. *Create the top navigation:* Full-width bar on #fff9f1 with a 1px #171717 bottom border. Left: heart icon (#f5a623 fill, 16px) + 'Design' wordmark (Moderat 16px weight 500, Ink Black). Center: nav links (Moderat 14px weight 400, Ink Black) with 30px horizontal gap. Right: theme toggle (two 16px circles, one filled #171717, one outlined 1px #171717). 20px vertical padding.

4. Create a Primary Action Button: #f5a623 background, #000000 text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.

5. *Create a Peach Blush section band:* Full-width background #fcd2ba, 60px vertical padding, centered content. Heading in Millik 32px weight 700, Midnight Indigo. Body in Moderat 16px weight 400, Ink Black, max-width 700px.

## Similar Brands

- **Notion** — Same warm off-white canvas and minimal monochrome interface where illustration and content carry all the color
- **Stripe** — Similar editorial restraint — cream-tinted background, single accent color, bold display typography paired with clean sans body
- **Pitch** — Same compact density, tight letter-spacing, and 5px-radius card aesthetic in a light-mode editorial layout
- **Arc browser** — Shared warm-paper canvas and trust in a single vivid accent (amber/orange) against an otherwise monochrome UI
- **Figma Config** — Same illustration-driven content cards with full-bleed art and minimal typographic chrome in the frame

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-cream-paper: #fff9f1;
  --color-ink-black: #171717;
  --color-steel-gray: #b5b5b5;
  --color-graphite: #8b8b8b;
  --color-true-black: #000000;
  --color-midnight-indigo: #12122c;
  --color-golden-amber: #f5a623;
  --color-peach-blush: #fcd2ba;

  /* Typography — Font Families */
  --font-millik: 'Millik', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-moderat: 'Moderat', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-flutterwave: 'Flutterwave', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.2;
  --tracking-caption: -0.43px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.2;
  --tracking-body-sm: -0.5px;
  --text-body: 16px;
  --leading-body: 1.2;
  --tracking-body: -0.58px;
  --text-body-lg: 18px;
  --leading-body-lg: 1.2;
  --tracking-body-lg: -0.65px;
  --text-subheading: 20px;
  --leading-subheading: 1.2;
  --tracking-subheading: -0.72px;
  --text-heading-sm: 22px;
  --leading-heading-sm: 1.18;
  --tracking-heading-sm: -0.79px;
  --text-heading: 32px;
  --leading-heading: 1.2;
  --tracking-heading: -0.42px;
  --text-display: 60px;
  --leading-display: 1.2;
  --tracking-display: -1.5px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
  --font-weight-extrabold: 800;

  /* Spacing */
  --spacing-5: 5px;
  --spacing-6: 6px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-11: 11px;
  --spacing-12: 12px;
  --spacing-18: 18px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-26: 26px;
  --spacing-30: 30px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-50: 50px;
  --spacing-60: 60px;
  --spacing-120: 120px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 60px;
  --card-padding: 20px;
  --element-gap: 10px;

  /* Border Radius */
  --radius-md: 5px;

  /* Named Radii */
  --radius-tags: 5px;
  --radius-cards: 5px;
  --radius-inputs: 5px;
  --radius-buttons: 5px;

  /* Surfaces */
  --surface-cream-canvas: #fff9f1;
  --surface-peach-band: #fcd2ba;
  --surface-steel-surface: #b5b5b5;
  --surface-graphite-surface: #8b8b8b;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-cream-paper: #fff9f1;
  --color-ink-black: #171717;
  --color-steel-gray: #b5b5b5;
  --color-graphite: #8b8b8b;
  --color-true-black: #000000;
  --color-midnight-indigo: #12122c;
  --color-golden-amber: #f5a623;
  --color-peach-blush: #fcd2ba;

  /* Typography */
  --font-millik: 'Millik', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-moderat: 'Moderat', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-flutterwave: 'Flutterwave', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.2;
  --tracking-caption: -0.43px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.2;
  --tracking-body-sm: -0.5px;
  --text-body: 16px;
  --leading-body: 1.2;
  --tracking-body: -0.58px;
  --text-body-lg: 18px;
  --leading-body-lg: 1.2;
  --tracking-body-lg: -0.65px;
  --text-subheading: 20px;
  --leading-subheading: 1.2;
  --tracking-subheading: -0.72px;
  --text-heading-sm: 22px;
  --leading-heading-sm: 1.18;
  --tracking-heading-sm: -0.79px;
  --text-heading: 32px;
  --leading-heading: 1.2;
  --tracking-heading: -0.42px;
  --text-display: 60px;
  --leading-display: 1.2;
  --tracking-display: -1.5px;

  /* Spacing */
  --spacing-5: 5px;
  --spacing-6: 6px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-11: 11px;
  --spacing-12: 12px;
  --spacing-18: 18px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-26: 26px;
  --spacing-30: 30px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-50: 50px;
  --spacing-60: 60px;
  --spacing-120: 120px;

  /* Border Radius */
  --radius-md: 5px;
}
```
