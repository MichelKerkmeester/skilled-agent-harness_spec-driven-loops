# Augen Pro — Style Reference
> Apple keynote on surgical white — clinical, weightless, electric blue as single accent in monochrome void

**Theme:** light

Augen Pro operates in a clinical-white void anchored by deep charcoal typography and one precise electric blue. The entire system reads as a high-end consumer tech brand: sparse, weight-350 type, pill-shaped interface elements floating in near-infinite negative space, and zero decorative chrome. Color is rationed — blue appears only as functional borders on links and tags, never as fills, giving the interface a cool, instrument-panel quality. The layout breathes vertically with 90+px section gaps and max-width centering, creating an editorial rhythm that treats every section like a spread.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Off-Black | `#0f1012` | `--color-off-black` | Primary text, hero and footer backgrounds, icon fills — near-pure black with a barely-perceptible cool cast that keeps it from feeling dead |
| Pure Black | `#020201` | `--color-pure-black` | Secondary text, icon strokes, emphasis fills where maximum contrast against white surfaces is needed |
| Off-White | `#f2f2f4` | `--color-off-white` | Page canvas, card surfaces, large background fills — the signature light that carries the entire light theme |
| Pure White | `#fdfdfd` | `--color-pure-white` | Elevated card surfaces, input backgrounds, secondary panels — brighter than the canvas for subtle layering without shadows |
| Steel Gray | `#5e5e5e` | `--color-steel-gray` | Muted body text, captions, inactive labels — meets AA at 6.4:1 for readable but clearly secondary content |
| Ash Gray | `#8f8f8f` | `--color-ash-gray` | Disabled button text, tertiary helper text, very low-emphasis labels |
| Signal Blue | `#0071e3` | `--color-signal-blue` | Blue outline accent for tags, dividers, and focused UI edges. Do not promote it to the primary CTA color |

## Tokens — Typography

### PP Neue Montreal — Sole typeface. Weight 350 (Book) carries everything from body to display headings — the entire site whispers at near-regular weight, avoiding bold/bolder entirely. Weight 400 appears only for tiny button/icon labels. The flat 350 across 27px headlines and 16px body creates a uniform typographic texture where size alone builds hierarchy, not weight. Substitute: Inter (350/400) or Söhne (350/400). · `--font-pp-neue-montreal`
- **Substitute:** Inter (300/400 weights), Söhne (350/400), or General Sans (350/400)
- **Weights:** 350, 400
- **Sizes:** 10, 12, 13, 14, 16, 18, 27
- **Line height:** 1.20
- **Letter spacing:** -0.0200em applied uniformly across all sizes — tight tracking at every scale pulls characters together for a compressed, engineered feel rather than airy editorial spacing
- **OpenType features:** `"ss01" on, "ss02" on, "cv01" on, "cv11" on — PP Neue Montreal's stylistic alternates shape the geometric character of the brand`
- **Role:** Sole typeface. Weight 350 (Book) carries everything from body to display headings — the entire site whispers at near-regular weight, avoiding bold/bolder entirely. Weight 400 appears only for tiny button/icon labels. The flat 350 across 27px headlines and 16px body creates a uniform typographic texture where size alone builds hierarchy, not weight. Substitute: Inter (350/400) or Söhne (350/400).

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 10px | 12 | -0.2px | `--text-caption` |
| body | 16px | 19.2 | -0.32px | `--text-body` |
| subheading | 18px | 21.6 | -0.36px | `--text-subheading` |
| heading | 27px | 32.4 | -0.54px | `--text-heading` |

## Tokens — Spacing & Shapes

**Density:** spacious

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 6 | 6px | `--spacing-6` |
| 10 | 10px | `--spacing-10` |
| 11 | 11px | `--spacing-11` |
| 22 | 22px | `--spacing-22` |
| 30 | 30px | `--spacing-30` |
| 34 | 34px | `--spacing-34` |
| 35 | 35px | `--spacing-35` |
| 50 | 50px | `--spacing-50` |
| 69 | 69px | `--spacing-69` |
| 94 | 94px | `--spacing-94` |
| 113 | 113px | `--spacing-113` |
| 130 | 130px | `--spacing-130` |
| 144 | 144px | `--spacing-144` |
| 220 | 220px | `--spacing-220` |

### Border Radius

| Element | Value |
|---------|-------|
| buttons | 26px |
| nav-pills | 10px |
| large-cards | 54px |
| tags-and-links | 9999px |
| body-containers | 63px |
| hairline-elements | 1.8px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 90-100px
- **Card padding:** 69px
- **Element gap:** 6px

## Components

### Pill Navigation Bar
**Role:** Primary site navigation

Floating horizontal bar, background #fdfdfd, border-radius 10px, padding 11px horizontal, sits at 34px from page top. Contains a star icon + 5 text links (Wearable, Neural, Programs, Updates, Search) all at 16px weight 350. The container itself is a soft pill — not a full-width header — making it feel like a floating control rather than a structural nav.

### Ghost Link Button
**Role:** Inline navigational link

No background fill, no border. Text at 16px weight 350 in #0f1012. Underline appears on hover. Used for nav items and footer links — the default unstyled link.

### Signal Blue Text Link
**Role:** Interactive content link

Text color #0071e3, no underline at rest, optional 0.5px border-bottom in #0071e3. Always rendered at 16px weight 350. This is the only chromatic interactive element — blue text = 'this leads somewhere.'

### Pill Tag Chip
**Role:** Category label or product tag

Border-radius 9999px (full pill), border 0.5px solid #0071e3, text #0071e3, padding 2px 10px, no background fill. Font 10-12px weight 350. Used for 'A¹ Sense', 'B¹ Eye', 'A¹ Neuro' product tags — blue outline signals these are interactive product names.

### Rounded Card
**Role:** Content container

Background #fdfdfd, border-radius 54px, border 0.5px solid rgba(0,0,0,0.06), padding 69px on all sides. No shadow. The massive 54px radius is the signature card shape — nearly circular corners that make containers feel like soft enclosures rather than rectangles.

### Floating CTA Pill
**Role:** Primary action button (e.g. 'Discover the future in every update')

Border-radius 26px, background rgba(12,13,15,0.05) — near-transparent charcoal wash, text #020201 weight 400 at 13px. Small icon (link glyph) in #0071e3 to the left of text. Sits between ghost and filled: present but not loud.

### Dark Band Footer
**Role:** Page footer

Full-width #0f1012 background, padding 50px top and 69px horizontal, text centered in white at 10-16px weight 350. Contains 'AI Augen Pro' tagline, secondary 'We make human accessible' link, and footer nav. The dark band creates a clear bookend after the light content sections.

### Section Label Pair
**Role:** Two-line section heading

Small 10-12px label in #8f8f8f (muted) above a 27px weight 350 title in #0f1012. Used as 'Overview / Breakthrough' in the content sections. The size jump (12→27px) with the same weight 350 creates hierarchy through scale alone, with the label acting as a quiet preamble.

### Inline Icon Link
**Role:** Link with leading icon

Blue link glyph (chain/link icon) in #0071e3 at 10-13px, paired with blue text label. Used for 'Go to Updates' and 'Research Insight' — the icon reinforces the link affordance without needing color to do double duty.

### Update Banner
**Role:** Promotional strip

Small floating banner with text 'Discover the future in every update' in a semi-transparent container, paired with a blue 'NEW' pill badge (border-radius 9999px, blue border, blue text). Sits above the hero as a subtle announcement layer.

## Do's and Don'ts

### Do
- Use weight 350 as the default for ALL text from 10px to 27px — hierarchy comes from size, not weight
- Set every link's text color to Signal Blue (#0071e3) and never apply a fill background to interactive elements — blue as wireframe, not paint
- Apply border-radius 54px to all content cards and 9999px to all tags/pills for the signature soft enclosure shape
- Maintain 90-100px vertical gaps between sections to preserve the editorial breathing rhythm
- Use the Off-Black (#0f1012) for text on light surfaces and Pure White (#fdfdfd) for text on the dark footer — never invert this pairing
- Render all nav and interactive containers as floating pills (10-26px radius) centered or top-aligned, never as full-width bars
- Set letter-spacing to -0.0200em uniformly — tight tracking is the typographic signature

### Don't
- Never use drop shadows for elevation — use white-tone shifts (#fdfdfd on #f2f2f4) and 0.5px hairline borders instead
- Never apply Signal Blue (#0071e3) as a filled background — it is exclusively a border and text color
- Never use font-weight above 400 — bold, semibold, and medium break the whisper-weight system
- Never center-justify multi-line body text — keep all paragraphs left-aligned for editorial readability
- Never add decorative gradients, patterns, or background imagery to content sections — the 3D hero render carries all visual weight
- Never use the CSS token colors green/orange/yellow as UI accents — they are inactive vars; the live system is monochrome + blue
- Never exceed max-width 1200px for content containers — the centered-constrain rhythm depends on consistent measure

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Page Canvas | `#f2f2f4` | Full-page background — slightly cool off-white that recedes behind all content |
| 1 | Elevated Panel | `#fdfdfd` | Cards, nav bar, tag chips — pure white lifted from canvas by tone difference, no shadow needed |
| 2 | Dark Surface | `#0f1012` | Hero image backdrop, footer band — deep charcoal for full-bleed contrast moments |

## Elevation

The system deliberately avoids drop shadows. Elevation is communicated through pure-white tone shifts (#fdfdfd against #f2f2f4 canvas) and through hairline borders (0.5px solid at 16 occurrences). This zero-shadow philosophy keeps the interface weightless and lets the 3D human render in the hero do all the visual depth work.

## Imagery

The hero is a single high-fidelity 3D-rendered portrait (a woman in profile, shaved head, closed eyes) that fades from solid form into pure white at the edges — a vignetted dissolution effect that makes the figure feel like it emerges from the page. The render uses warm browns against cool clinical white, creating temperature contrast. No photography, no illustration, no product shots anywhere else — the 3D render carries the entire visual identity. Iconography is minimal: a single 8-pointed star/compass glyph in the nav and footer. Imagery density is extremely low — text dominates at roughly 95% of all content.

## Layout

Full-bleed sections with max-width 1200px content centering. Navigation is a floating pill (rounded 10px container) with 5 inline links, positioned top-center. Hero is full-viewport with the 3D render centered-right and text block bottom-left. Below the hero, sections alternate between white canvas and slightly recessed #f2f2f4 panels separated by generous 90-100px vertical breathing room. The 'Breakthrough' section uses a 3-column asymmetric grid (narrow labels | wide heading | side paragraph). Footer is a full-bleed dark band (#0f1012) with centered white text. Throughout, content stays left-aligned within its container, never center-justified in multi-line blocks.

## Agent Prompt Guide

Quick Color Reference:
- Text: #0f1012 (primary), #020201 (emphasis), #5e5e5e (muted), #8f8f8f (disabled)
- Background: #f2f2f4 (page canvas), #fdfdfd (elevated surfaces), #0f1012 (dark bands)
- Border: 0.5px solid rgba(0,0,0,0.06) for cards, #0071e3 for interactive outlines
- Accent: #0071e3 (links, tags, interactive borders — text and border only, never fill)
- primary action: no distinct CTA color

3-5 Example Component Prompts:
1. Create a section heading pair: small 12px weight 350 muted label in #8f8f8f above a 27px weight 350 title in #0f1012, letter-spacing -0.54px, sitting on #f2f2f4 canvas with 94px top padding.
2. Create a product tag pill: border-radius 9999px, border 0.5px solid #0071e3, no background fill, text #0071e3 at 12px weight 350, padding 2px 10px, containing text like 'A¹ Sense'.
3. Create a content card: background #fdfdfd, border-radius 54px, border 0.5px solid rgba(0,0,0,0.06), padding 69px, no shadow, containing 27px weight 350 heading and 16px weight 350 body text.
4. Create a text link: color #0071e3, 16px weight 350, no underline at rest, optional 0.5px #0071e3 border-bottom on hover, sitting inline within a paragraph.
5. Create the floating nav bar: centered, background #fdfdfd, border-radius 10px, padding 11px 30px, containing a star icon and 5 inline text links at 16px weight 350 in #0f1012.

## Border System

Borders are hairlines only — exclusively 0.5px solid (16 occurrences) or 1px solid (4 occurrences). Never use 2px+ borders; the system demands precision at the edge of perception. Interactive borders use #0071e3; structural borders use rgba(0,0,0,0.06) or rgba(0,0,0,0.04) — always semi-transparent black, never solid gray.

## Similar Brands

- **Apple (apple.com)** — Same weightless white canvas, weight-300/350 typography whisper-weight headlines, floating pill nav centered over full-viewport hero with 3D-rendered human figure as the sole visual anchor
- **Nothing (nothing.tech)** — Same clinical white product pages with one chromatic accent (red for Nothing, blue for Augen), dot-matrix aesthetic, pill-shaped tags, and 3D-rendered product photography on pure white
- **Linear** — Same near-black #0f1012/#020201 text on light backgrounds, tight letter-spacing, minimal flat UI with hairline borders, and a single accent color rationed across interactive elements only
- **Vercel** — Same max-width centered content, generous vertical section gaps, monochrome palette with one signal accent color used exclusively for interactive states
- **Humane (humane.ai)** — Same humanistic tech positioning with 3D portrait as hero, clinical-white void aesthetic, and pill-shaped interactive elements floating in negative space

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-off-black: #0f1012;
  --color-pure-black: #020201;
  --color-off-white: #f2f2f4;
  --color-pure-white: #fdfdfd;
  --color-steel-gray: #5e5e5e;
  --color-ash-gray: #8f8f8f;
  --color-signal-blue: #0071e3;

  /* Typography — Font Families */
  --font-pp-neue-montreal: 'PP Neue Montreal', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 12;
  --tracking-caption: -0.2px;
  --text-body: 16px;
  --leading-body: 19.2;
  --tracking-body: -0.32px;
  --text-subheading: 18px;
  --leading-subheading: 21.6;
  --tracking-subheading: -0.36px;
  --text-heading: 27px;
  --leading-heading: 32.4;
  --tracking-heading: -0.54px;

  /* Typography — Weights */
  --font-weight-w350: 350;
  --font-weight-regular: 400;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-6: 6px;
  --spacing-10: 10px;
  --spacing-11: 11px;
  --spacing-22: 22px;
  --spacing-30: 30px;
  --spacing-34: 34px;
  --spacing-35: 35px;
  --spacing-50: 50px;
  --spacing-69: 69px;
  --spacing-94: 94px;
  --spacing-113: 113px;
  --spacing-130: 130px;
  --spacing-144: 144px;
  --spacing-220: 220px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 90-100px;
  --card-padding: 69px;
  --element-gap: 6px;

  /* Border Radius */
  --radius-sm: 1.8px;
  --radius-lg: 10px;
  --radius-3xl: 26px;
  --radius-full: 54px;
  --radius-full-2: 63px;
  --radius-full-3: 9999px;

  /* Named Radii */
  --radius-buttons: 26px;
  --radius-nav-pills: 10px;
  --radius-large-cards: 54px;
  --radius-tags-and-links: 9999px;
  --radius-body-containers: 63px;
  --radius-hairline-elements: 1.8px;

  /* Surfaces */
  --surface-page-canvas: #f2f2f4;
  --surface-elevated-panel: #fdfdfd;
  --surface-dark-surface: #0f1012;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-off-black: #0f1012;
  --color-pure-black: #020201;
  --color-off-white: #f2f2f4;
  --color-pure-white: #fdfdfd;
  --color-steel-gray: #5e5e5e;
  --color-ash-gray: #8f8f8f;
  --color-signal-blue: #0071e3;

  /* Typography */
  --font-pp-neue-montreal: 'PP Neue Montreal', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 12;
  --tracking-caption: -0.2px;
  --text-body: 16px;
  --leading-body: 19.2;
  --tracking-body: -0.32px;
  --text-subheading: 18px;
  --leading-subheading: 21.6;
  --tracking-subheading: -0.36px;
  --text-heading: 27px;
  --leading-heading: 32.4;
  --tracking-heading: -0.54px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-6: 6px;
  --spacing-10: 10px;
  --spacing-11: 11px;
  --spacing-22: 22px;
  --spacing-30: 30px;
  --spacing-34: 34px;
  --spacing-35: 35px;
  --spacing-50: 50px;
  --spacing-69: 69px;
  --spacing-94: 94px;
  --spacing-113: 113px;
  --spacing-130: 130px;
  --spacing-144: 144px;
  --spacing-220: 220px;

  /* Border Radius */
  --radius-sm: 1.8px;
  --radius-lg: 10px;
  --radius-3xl: 26px;
  --radius-full: 54px;
  --radius-full-2: 63px;
  --radius-full-3: 9999px;
}
```
