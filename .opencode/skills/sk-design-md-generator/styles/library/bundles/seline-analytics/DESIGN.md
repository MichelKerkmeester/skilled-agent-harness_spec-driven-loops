# Seline Analytics — Style Reference
> Quiet analyst's desk on warm paper

**Theme:** light

Seline sits on a warm-stone canvas (#fafaf9) with a single vivid cyan as its only chromatic accent — every other color is a neutral pulled from the Tailwind stone scale. Headlines use a custom geometric sans (roobert) at weight 400 with tight negative tracking, giving display copy an unhurried, almost whispered authority that contrasts with the usual SaaS shout. UI surfaces are flat white cards floating over the warm background via a single soft 16px-blur shadow; borders are 1px stone hairlines used generously as the primary structural device instead of heavy dividers or panels. The layout breathes: max-width content centered on generous vertical rhythm, with pill-shaped interactive controls, a mascot sticker illustration for personality, and data dashboard screenshots as proof-of-product. The overall feel is editorial analytics — calm, monochrome, confident — where the blue CTA is the loudest thing on the page by deliberate restraint of everything else.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Stone Canvas | `#fafaf9` | `--color-stone-canvas` | Page background — warm off-white that reads as paper, not screen-white |
| Pure White | `#ffffff` | `--color-pure-white` | Card surfaces, elevated panels, input fills — flat and shadowless by default |
| Stone Border | `#e8e6e5` | `--color-stone-border` | Hairline borders on cards, nav, inputs — the primary structural device, not dividers |
| Stone Muted | `#d6d3d1` | `--color-stone-muted` | Secondary borders, subtle background tints, decorative separators |
| Ash Gray | `#a8a29e` | `--color-ash-gray` | Muted helper text, icon strokes, disabled states — readable but recessive |
| Warm Gray | `#78716c` | `--color-warm-gray` | Body text, nav links, secondary copy — warm-tinted neutral that softens body type |
| Ink Black | `#0c0a09` | `--color-ink-black` | Primary headings, emphasized body, strong icons — near-black with a warm cast |
| Soot | `#1c1917` | `--color-soot` | Dark surface backgrounds for inverted sections, dark dashboard tabs |
| Sky Wash | `#c1e1f7` | `--color-sky-wash` | Soft highlight wash behind highlighted text spans, decorative blue tint |
| Cyan Signal | `#3ba6f1` | `--color-cyan-signal` | Primary CTA fill, active links, brand icon strokes — the only chromatic voice on the page, used sparingly to make actions feel switched on |
| Cyan Edge | `#3398e1` | `--color-cyan-edge` | Blue accent for outlined action borders, linked labels, and lightweight interactive emphasis. Do not promote it to the primary CTA color |

## Tokens — Typography

### Roobert — Display and heading typeface — custom geometric sans with tight negative tracking (-0.025em at 32px, -0.021em at 52px). Weight 400 at 52px is the signature: anti-convention whisper-weight that creates authority through restraint. Headlines occupy their space without shouting. · `--font-roobert`
- **Substitute:** Inter Tight or Satoshi
- **Weights:** 400, 500
- **Sizes:** 18px, 20px, 32px, 52px
- **Line height:** 1.12, 1.22, 1.25, 1.69
- **Letter spacing:** -0.025em at 32px, -0.021em at 52px, -0.017em at 18px
- **Role:** Display and heading typeface — custom geometric sans with tight negative tracking (-0.025em at 32px, -0.021em at 52px). Weight 400 at 52px is the signature: anti-convention whisper-weight that creates authority through restraint. Headlines occupy their space without shouting.

### Inter — Body, nav, UI, and caption typeface — neutral workhorse for all non-display copy. 14px weight 400 at 1.64 line-height is the dominant body size (freq 1174). Positive tracking (0.004em) at small sizes keeps dense UI legible. · `--font-inter`
- **Substitute:** Inter
- **Weights:** 400, 500, 600
- **Sizes:** 10px, 12px, 13px, 14px, 15px, 16px, 18px
- **Line height:** 1.33, 1.53, 1.64, 1.69, 2.3
- **Letter spacing:** 0.0030em, 0.0040em, 0.0250em
- **Role:** Body, nav, UI, and caption typeface — neutral workhorse for all non-display copy. 14px weight 400 at 1.64 line-height is the dominant body size (freq 1174). Positive tracking (0.004em) at small sizes keeps dense UI legible.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 10px | 2.3 | — | `--text-caption` |
| body-lg | 16px | 1.69 | 0.048px | `--text-body-lg` |
| subheading | 20px | 1.2 | -0.1px | `--text-subheading` |
| heading-sm | 32px | 1.25 | -0.8px | `--text-heading-sm` |
| display | 52px | 1.12 | -1.092px | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** compact

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
| 64 | 64px | `--spacing-64` |
| 80 | 80px | `--spacing-80` |
| 96 | 96px | `--spacing-96` |
| 160 | 160px | `--spacing-160` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 9999px |
| cards | 10px |
| icons | 4px |
| inputs | 6px |
| buttons | 9999px |
| feature-card | 16px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| md | `rgba(0, 0, 0, 0.05) 0px 4px 16px 0px` | `--shadow-md` |
| sm | `rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.1) 0...` | `--shadow-sm` |
| subtle | `rgba(0, 0, 0, 0.05) 0px 1px 2px 0px` | `--shadow-subtle` |
| xl | `rgba(17, 12, 46, 0.12) 0px 12px 45px 0px` | `--shadow-xl` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 96px
- **Card padding:** 24px
- **Element gap:** 8px

## Components

### Primary CTA Button (filled cyan)
**Role:** Highest-priority conversion action — 'Start free trial', primary sign-ups

Pill shape (9999px radius), fill #3ba6f1, 1px border #3398e1, white text (#ffffff) weight 500, padding 8px 16px. The only chromatic filled element on the page — use once per viewport maximum.

### Secondary Ghost Button
**Role:** Lower-priority action beside primary — 'View live demo', secondary navigation

Pill shape (9999px radius), transparent fill, 1px border #e8e6e5, text #0c0a09 weight 400, padding 8px 16px. Quiet companion to the cyan CTA.

### Navigation Link
**Role:** Top-nav menu items — Pricing, About us, Platform, Resources

No fill, no border, 14px Inter weight 400, color #78716c, padding 0 12px, height 32px. Hovers to #0c0a09. Dropdown caret inline at end.

### Signed-in Avatar Link
**Role:** Top-nav social proof cluster — stack of 4 overlapping circular avatars

24px circles with 2px ring offset, -8px overlap spacing. Sits inline between nav items as proof-of-community. Avatars are real photos, no border.

### Flat Content Card
**Role:** Feature blocks, dashboard previews, testimonial cards

White (#ffffff) fill, 10px radius, 1px border #e8e6e5 (not shadow-dependent), 24px padding. Subtle shadow rgba(0,0,0,0.05) 0px 4px 16px 0px adds lift without weight. The border IS the structure.

### Floating Dashboard Preview
**Role:** Hero product screenshot — the dashboard mockup

16px radius, white fill, shadow rgba(17,12,46,0.12) 0px 12px 45px 0px — the one card allowed to feel elevated/3D. 8px padding internally so the dashboard UI sits within a frame. Grayscale(1) contrast(0.94) filter applied for muted product photography feel.

### Highlighted Text Span
**Role:** Inline emphasis within headlines — 'simple & actionable', 'saves us time'

Text in #3398e1 with a soft #c1e1f7 background highlight (pill-shaped background behind the word). Weight 400. The only inline color treatment — every headline gets one.

### Text Input
**Role:** Newsletter signup, form fields

White fill, 6px radius, 1px border #d6d3d1, placeholder #78716c, padding 4px 12px. Focus ring: 2px #3ba6f1. Minimal, inline with label.

### Mascot Sticker Illustration
**Role:** Brand personality element — the hooded character peeking from behind cards

Grayscale illustration with drop-shadow filter (rgba(0,0,0,0.25) 0px 2px 4px). SVG outline-only treatment. Used once per section as a playful counterweight to the monochrome data UI.

### Logo Wordmark
**Role:** Top-left brand identifier

Small black flame/spark glyph + 'Seline' wordmark in Inter weight 500, 14px, #0c0a09. Compact, sits left of nav.

### Star Rating Display
**Role:** Trust signal above testimonials — '★★★★★ on G2'

Five small star glyphs in #0c0a09 (or warm gray), inline with platform name in 14px Inter #78716c. No card chrome — sits inline in copy flow.

### Testimonial Card
**Role:** Customer quote with attribution

No card chrome. Star row (★ in #0c0a09), 16px quote text in #0c0a09 with inline cyan highlights for emphasized phrases, 32px avatar circle + name (14px weight 500) + role (14px #78716c). Vertical gap 16px between elements.

### Tab Pill Group
**Role:** Feature navigation — Dashboard / Visitors / Journeys / Funnels

Horizontal row of 4 pill-shaped tabs at bottom of dashboard preview. Active tab: #1c1917 fill, white text, 9999px radius. Inactive: transparent, #0c0a09 text, 1px #e8e6e5 border. Switches the dashboard view above.

## Do's and Don'ts

### Do
- Use Roobert at weight 400 for all display and heading sizes — never bump to 600/700 for emphasis, rely on size and the cyan highlight span instead
- Use #fafaf9 as the page background and #ffffff only for card surfaces — never invert this (white on canvas, not the other way around)
- Apply exactly one cyan highlight span (#3398e1 text + #c1e1f7 pill background) per headline to mark the value proposition keyword
- Use 1px #e8e6e5 borders as the primary structural separator inside cards — reserve shadows for product-preview cards only
- Keep buttons pill-shaped (9999px radius) with 8px 16px padding — the cyan filled CTA must be the only chromatic filled element on any screen
- Set body copy at 14px Inter weight 400 with 1.64 line-height — this is the dominant UI rhythm, do not break it
- Let the mascot sticker appear once per section as a personality beat — do not repeat or animate it

### Don't
- Do not introduce new accent colors — the entire palette is stone neutrals plus one cyan; adding green, purple, or red breaks the editorial restraint
- Do not use heavy drop shadows on content cards — the 16px-blur floating preview shadow is reserved for exactly one element per page
- Do not set headlines in Inter — Roobert at the 32px/52px sizes is the brand voice; mixing fonts breaks hierarchy
- Do not use #ffffff as the page background — always #fafaf9; pure white belongs only on elevated card surfaces
- Do not fill buttons with dark/neutral colors for primary actions — the cyan #3ba6f1 is the only correct filled-button color
- Do not add gradients, glassmorphism, or decorative color washes — the design is deliberately flat and paper-textured
- Do not stack multiple cyan highlight spans in one headline — one per headline maximum, the restraint is the point

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas | `#fafaf9` | Full-page warm-stone background |
| 1 | Card | `#ffffff` | Flat content cards, nav, input fills — sits one elevation step above canvas |
| 2 | Floating Preview | `#ffffff` | Hero dashboard screenshot — only surface allowed the deep 45px-blur shadow |
| 3 | Inverted Section | `#1c1917` | Dark accent surfaces for tab pills or inverted panels (sparingly used) |

## Elevation

- **Content card:** `rgba(0, 0, 0, 0.05) 0px 4px 16px 0px`
- **Floating dashboard preview:** `rgba(17, 12, 46, 0.12) 0px 12px 45px 0px`
- **Small icon / decorative chip:** `rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.1) 0px 2px 4px -2px`
- **Nav / button hairline:** `rgba(0, 0, 0, 0.05) 0px 1px 2px 0px`

## Imagery

Visual language is dominated by product UI screenshots — the dashboard preview is treated as photography, rendered with a grayscale(1) contrast(0.94) filter that mutes the data colors to monochrome. The only human figure is a line-art mascot sticker (hooded character) drawn in outline-only SVG style, placed once per section as a playful counterweight to the analytical content, with a soft drop-shadow for sticker-like depth. Logo and brand glyphs are small black spark/flame marks. Photography is absent — no lifestyle, no team shots, no environment imagery. The object (the dashboard) IS the hero. All decorative icons are 1px-stroke outline style in either #0c0a09 or #3ba6f1, never filled.

## Layout

Page is max-width centered at ~1200px with generous vertical breathing room. Hero is a two-row text block left-aligned with a single highlighted phrase ('simple & actionable') in cyan, followed by a dual-CTA row (cyan pill + ghost pill), then a row of grayscale partner logos, then a star-rating trust line, then a full-width floating dashboard preview that overlaps slightly into the next section. Below the fold: alternating single-column testimonial rows in a 2-column grid, then full-width feature sections with left-aligned text and centered product visuals. Navigation is a minimal top bar — logo left, centered nav links, sign-in + cyan CTA right — with a floating avatar cluster mid-nav as social proof. Section gaps are wide (96px) to create editorial pacing rather than dense information stacking.

## Agent Prompt Guide

Quick Color Reference:
- page background: #fafaf9
- card surface: #ffffff
- primary text: #0c0a09
- secondary text: #78716c
- border / hairline: #e8e6e5
- accent (text highlight + icons): #3ba6f1
- primary action: #3ba6f1 (filled action)
- highlight wash: #c1e1f7

Example Component Prompts:

1. Hero headline: 52px roobert weight 400, #0c0a09, line-height 1.12, letter-spacing -1.092px. Inline the phrase 'simple & actionable' as a span with #3398e1 text on a #c1e1f7 pill background highlight. Subheadline at 16px Inter weight 400, #78716c, line-height 1.69.

2. Create a Primary Action Button: #3ba6f1 background, #0c0a09 text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.

3. Feature card: white (#ffffff) fill, 10px radius, 1px border #e8e6e5, 24px padding, shadow rgba(0,0,0,0.05) 0px 4px 16px 0px. Heading 32px roobert weight 400 #0c0a09, body 14px Inter #78716c.

4. Dashboard preview card: white fill, 16px radius, shadow rgba(17,12,46,0.12) 0px 12px 45px 0px, 8px internal padding. Apply CSS filter grayscale(1) contrast(0.94) to mute the dashboard to monochrome.

5. Testimonial block: star row of 5 small ★ glyphs in #0c0a09, quote text 16px Inter #0c0a09 line-height 1.69 with inline cyan highlight span on the emphasized phrase, 32px circular avatar below with name 14px Inter weight 500 #0c0a09 and role 14px Inter #78716c. No card chrome — copy flows directly on canvas.

## Highlight Span Pattern

The signature typographic move is the inline highlight: one phrase per headline receives #3398e1 text color with a #c1e1f7 pill-shaped background behind it (padding ~2px 8px, radius 4px). This is the brand's voice marker — it always lands on the value-prop keyword. Rules: exactly one per headline, never inside body paragraphs, never on nav items. The highlight carries the entire chromatic budget of the headline; everything else stays #0c0a09.

## Similar Brands

- **Plausible Analytics** — Same single-accent-on-warm-canvas approach with privacy-focused analytics positioning; both use one vivid color against an almost-monochrome palette
- **Linear** — Same weight-400-at-large-size headline restraint and tight negative letter-spacing on a custom geometric sans
- **Fathom Analytics** — Same minimal analytics-alternative visual language with warm-neutral canvas and one accent color, editorial vertical rhythm
- **Vercel** — Same restrained monochrome palette with a single chromatic accent and pill-shaped interactive controls
- **Cal.com** — Same warm-stone canvas with cyan accent, mascot sticker personality element, and flat product-screenshot hero

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-stone-canvas: #fafaf9;
  --color-pure-white: #ffffff;
  --color-stone-border: #e8e6e5;
  --color-stone-muted: #d6d3d1;
  --color-ash-gray: #a8a29e;
  --color-warm-gray: #78716c;
  --color-ink-black: #0c0a09;
  --color-soot: #1c1917;
  --color-sky-wash: #c1e1f7;
  --color-cyan-signal: #3ba6f1;
  --color-cyan-edge: #3398e1;

  /* Typography — Font Families */
  --font-roobert: 'Roobert', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 2.3;
  --text-body-lg: 16px;
  --leading-body-lg: 1.69;
  --tracking-body-lg: 0.048px;
  --text-subheading: 20px;
  --leading-subheading: 1.2;
  --tracking-subheading: -0.1px;
  --text-heading-sm: 32px;
  --leading-heading-sm: 1.25;
  --tracking-heading-sm: -0.8px;
  --text-display: 52px;
  --leading-display: 1.12;
  --tracking-display: -1.092px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;

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
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-96: 96px;
  --spacing-160: 160px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 96px;
  --card-padding: 24px;
  --element-gap: 8px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 10px;
  --radius-2xl: 16px;
  --radius-full: 9999px;

  /* Named Radii */
  --radius-tags: 9999px;
  --radius-cards: 10px;
  --radius-icons: 4px;
  --radius-inputs: 6px;
  --radius-buttons: 9999px;
  --radius-feature-card: 16px;

  /* Shadows */
  --shadow-md: rgba(0, 0, 0, 0.05) 0px 4px 16px 0px;
  --shadow-sm: rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.1) 0px 2px 4px -2px;
  --shadow-subtle: rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;
  --shadow-xl: rgba(17, 12, 46, 0.12) 0px 12px 45px 0px;

  /* Surfaces */
  --surface-canvas: #fafaf9;
  --surface-card: #ffffff;
  --surface-floating-preview: #ffffff;
  --surface-inverted-section: #1c1917;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-stone-canvas: #fafaf9;
  --color-pure-white: #ffffff;
  --color-stone-border: #e8e6e5;
  --color-stone-muted: #d6d3d1;
  --color-ash-gray: #a8a29e;
  --color-warm-gray: #78716c;
  --color-ink-black: #0c0a09;
  --color-soot: #1c1917;
  --color-sky-wash: #c1e1f7;
  --color-cyan-signal: #3ba6f1;
  --color-cyan-edge: #3398e1;

  /* Typography */
  --font-roobert: 'Roobert', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 2.3;
  --text-body-lg: 16px;
  --leading-body-lg: 1.69;
  --tracking-body-lg: 0.048px;
  --text-subheading: 20px;
  --leading-subheading: 1.2;
  --tracking-subheading: -0.1px;
  --text-heading-sm: 32px;
  --leading-heading-sm: 1.25;
  --tracking-heading-sm: -0.8px;
  --text-display: 52px;
  --leading-display: 1.12;
  --tracking-display: -1.092px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-96: 96px;
  --spacing-160: 160px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 10px;
  --radius-2xl: 16px;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-md: rgba(0, 0, 0, 0.05) 0px 4px 16px 0px;
  --shadow-sm: rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.1) 0px 2px 4px -2px;
  --shadow-subtle: rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;
  --shadow-xl: rgba(17, 12, 46, 0.12) 0px 12px 45px 0px;
}
```
