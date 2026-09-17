# Flox — Style Reference
> terminal at sunrise, violet glow

**Theme:** light

Flox is a precision-instrument developer environment: a white canvas, near-black graphite text, and a single violet-to-pink gradient that ignites only where the system wants to be noticed. The product vocabulary borrows from terminals — code blocks, mono accents, sparkles as punctuation — wrapped in generous display typography that makes infrastructure feel like a product launch. Color is rationed: most surfaces stay achromatic; the gradient appears on the primary CTA and as decorative sparkle accents, while category icons (violet, orange, pink) segment the audience without competing for hierarchy. Components are compact and confident — 6px button radii, 12px card radii, hairline #e2e8f0 borders — letting content do the talking rather than chrome.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Graphite Ink | `#020817` | `--color-graphite-ink` | Primary text, headings, nav links, list markers — near-black with a faint cool cast gives ink-like density without the harshness of pure #000 |
| Hairline Slate | `#e2e8f0` | `--color-hairline-slate` | Borders, dividers, card outlines, image frames — the workhorse neutral that defines structural edges across every surface |
| Paper White | `#ffffff` | `--color-paper-white` | Page canvas, card surfaces, text on dark fills — the base layer everything sits on |
| Carbon | `#1b1b1b` | `--color-carbon` | Secondary text, monospace body fills, subtle iconography — slightly warmer than graphite for code and terminal contexts |
| Mist | `#f3f3f3` | `--color-mist` | Subtle surface lift, ghost button borders, soft section backgrounds — the second tier above pure white |
| Obsidian | `#0c0c0c` | `--color-obsidian` | High-contrast neutral action fill for primary buttons on light surfaces. |
| Iris Glow | `#8247ff` | `--color-iris-glow` | Supporting palette color for small decorative accents when the core palette needs contrast. Do not promote it to the primary CTA color |
| Magenta Pulse | `#f47bff` | `--color-magenta-pulse` | Supporting palette color for small decorative accents when the core palette needs contrast. Do not promote it to the primary CTA color |
| Ember Orange | `#ff8a3d` | `--color-ember-orange` | Supporting palette color for small decorative accents when the core palette needs contrast. |
| Rose Hot | `#ff4fae` | `--color-rose-hot` | Red text accent for links, tags, and emphasized short phrases. |

## Tokens — Typography

### GeistSans — Primary UI and display typeface. The 76px display size with -0.046em tracking creates a compressed, architectural headline that spans three lines without overwhelming the viewport. Geist's geometric construction gives a monospace-adjacent precision that fits the developer-tools context without committing to mono. 400 is the body workhorse, 500 carries nav and button labels, 600 is reserved for emphasis within dense lists. · `--font-geistsans`
- **Substitute:** Inter, or system-ui as a fallback — Inter shares Geist's near-monolinear proportions and similar x-height
- **Weights:** 400, 500, 600
- **Sizes:** 12, 14, 16, 18, 24, 76
- **Line height:** 1.0, 1.1, 1.2, 1.33, 1.35, 1.5
- **Letter spacing:** Display 76px: -3.5px (-0.046em); 24px: -0.29px (-0.012em); 18px: -0.2px (-0.011em); 16px: -0.16px (-0.010em); 14px: -0.14px (-0.010em); 12px: -0.12px (-0.010em)
- **Role:** Primary UI and display typeface. The 76px display size with -0.046em tracking creates a compressed, architectural headline that spans three lines without overwhelming the viewport. Geist's geometric construction gives a monospace-adjacent precision that fits the developer-tools context without committing to mono. 400 is the body workhorse, 500 carries nav and button labels, 600 is reserved for emphasis within dense lists.

### GeistMono — Code and terminal mockup typeface — used inside the hero terminal window and any inline code blocks. Single weight 500 keeps the monospace voice present but quiet, never competing with the display sans. · `--font-geistmono`
- **Substitute:** JetBrains Mono, IBM Plex Mono
- **Weights:** 500
- **Sizes:** 14
- **Line height:** 1.43
- **Letter spacing:** -0.0140em
- **Role:** Code and terminal mockup typeface — used inside the hero terminal window and any inline code blocks. Single weight 500 keeps the monospace voice present but quiet, never competing with the display sans.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.5 | -0.12px | `--text-caption` |
| body-sm | 14px | 1.43 | -0.14px | `--text-body-sm` |
| body | 16px | 1.5 | -0.16px | `--text-body` |
| subheading | 18px | 1.35 | -0.2px | `--text-subheading` |
| heading-sm | 24px | 1.2 | -0.29px | `--text-heading-sm` |
| display | 76px | 1 | -3.5px | `--text-display` |

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
| 40 | 40px | `--spacing-40` |
| 80 | 80px | `--spacing-80` |
| 120 | 120px | `--spacing-120` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 9999px |
| cards | 12px |
| inputs | 6px |
| buttons | 6px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| subtle | `rgba(255, 255, 255, 0.2) 0px -2px 1px 0px inset, rgba(255...` | `--shadow-subtle` |
| sm | `rgba(0, 0, 0, 0.04) 0px 2px 8px 0px, rgba(0, 0, 0, 0.08) ...` | `--shadow-sm` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 24px
- **Element gap:** 16px

## Components

### Gradient Primary Button
**Role:** Hero CTA and single primary action per page

Filled with the Iris-to-Magenta linear-gradient(92deg, #8247ff, #f47bff), white label text at 14px GeistSans 500, 6px radius, padding 6px 16px (compact) or 10px 25px (hero). Carries the inset highlight stack (white inner glow at 0.2 / 0.1 opacity) plus a soft 6px 16px black drop at 8% opacity. The gradient sweep runs nearly horizontal (92deg) so the button reads as luminous rather than dimensional.

### Solid Dark Button
**Role:** Secondary CTA paired with the gradient primary

Obsidian #0c0c0c fill, white text, 6px radius, 10px 25px padding. Used for 'Join our Slack' — the black-on-white inversion gives a terminal-bright counterweight to the gradient's warmth.

### Ghost Nav Button
**Role:** Sign-in and low-emphasis nav actions

Transparent fill, #020817 border, 6px radius, 4px 16px padding, 14px GeistSans 500. The 'Sign in' button in the header.

### Pill Tag
**Role:** Audience/category labels in the workflow section

9999px radius, 4–6px vertical padding, #020817 text, 14px GeistSans 500. Sub-pill subtitle ('Reproducible at Scale', etc.) in the corresponding accent color at 12–14px.

### Terminal Card
**Role:** Hero product mockup and any code demonstration

White surface, 12px radius, the triple-shadow stack (2px/8px/16px → 8px/24px → 16px/48px at escalating opacities 4/8/12%) creating a deep floating layer. Three traffic-light dots in #f3f3f3 at top-left, GeistMono 14px 500 body for commands, 24px internal padding.

### Audience Pillar Card
**Role:** Three-column section breaking down Platform Engineers / Developers / AI Agents

Transparent background, 24px column gap, no visible border — relies on spacing rhythm. Each column opens with a 24px accent icon (Iris Glow for Platform Engineers, Ember Orange for Developers, Rose Hot for AI Agents) right-aligned, then a #020817 24px heading, an accent-colored 14px tagline, and a bulleted list with 4px row gap.

### Testimonial Card
**Role:** Social proof in the 'Users Love Flox' section

White surface, 12px radius, #e2e8f0 1px border, 16px padding. Avatar thumbnail 24px circle, name in 14px 600, handle in 12px #020817, quote body in 14px 400 with generous line-height.

### Logo Strip
**Role:** Trust bar of customer logos below the hero

Horizontal flex row, 40px column gap, logos rendered in #bfbfbf–#9b9b9b gradient (the only grayscale gradient in the system) to desaturate them into ambient texture. No captions.

### Tiled Grid Background
**Role:** Section backdrop for the testimonial area

White base with 1px #e2e8f0 grid lines forming soft square tiles. Selected tiles are washed with a faint Rose Hot (#ff4fae) at low opacity and carry decorative icons (heart, thumbs-up, cloud, download) in matching accent. Creates a 'constellation' feel behind content.

### Community Pill Button
**Role:** Inline CTA inside testimonial section

Obsidian #0c0c0c fill, white text, 6px radius, 10px 25px padding, plus a small star/sparkle icon suffix.

### Sparkle Accent Glyph
**Role:** Decorative punctuation after gradient words and in section dividers

Rendered in the same Iris-to-Magenta gradient as the CTA. Small (~16–20px), never functional, always adjacent to a gradient-colored word or floating in a tinted grid tile.

### Feature Bullet List
**Role:** Why-Flox lists under each audience pillar

Unordered, 4–8px row gap, each item prefixed by a small right-pointing chevron in the column's accent color. Body text 14–16px #020817.

## Do's and Don'ts

### Do
- Use the Iris-to-Magenta gradient exclusively on the single primary CTA and on the sparkle glyph that punctuates gradient-colored words
- Set button radius to 6px and card radius to 12px — never mix or round further
- Pair every gradient CTA with a solid Obsidian secondary action within 16px to create the system's signature dual-action rhythm
- Render code and terminal content in GeistMono 14px 500, never in GeistSans — the mono voice is reserved
- Use #e2e8f0 for all structural borders and dividers at 1px; the system relies on hairline edges, not shadow depth
- Set display headlines at 76px with -3.5px tracking (line-height 1.0) so the type feels architectural, not editorial
- Apply the Rose Hot / Ember Orange accents only to the three audience pillar icons and their sub-pill labels — never to buttons or text blocks

### Don't
- Don't apply the violet–pink gradient to anything other than the primary CTA and decorative sparkles — gradient overuse destroys the rationed-color system
- Don't use the Ember Orange or Rose Hot on buttons, text, or backgrounds — they are icon-accent only
- Don't set card or button radius above 12px — the system stays tight; anything pill-shaped beyond tags feels off-brand
- Don't introduce drop shadows on flat content cards — the triple-shadow stack is reserved for the terminal window and the gradient CTA only
- Don't use a chromatic border on the ghost nav button; #020817 at 1px keeps it quiet against the white nav
- Don't set body line-height above 1.5 or below 1.35 — the 1.43–1.5 band is what keeps paragraphs feeling like terminal output, not editorial
- Don't apply letter-spacing to the gradient CTA text or to the 12–14px range at more than -0.12px — Geist's tracking is already compressed; loosening it breaks the system

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Paper White | `#ffffff` | Page canvas — the flat base everything sits on |
| 1 | Mist | `#f3f3f3` | Subtle lift for alt sections, ghost button surfaces, code block backgrounds |
| 2 | Obsidian | `#0c0c0c` | Inverted dark surface for terminal windows and solid dark action buttons |

## Elevation

- **Hero terminal card:** `rgba(0, 0, 0, 0.04) 0px 2px 8px 0px, rgba(0, 0, 0, 0.08) 0px 8px 24px 0px, rgba(0, 0, 0, 0.12) 0px 16px 48px 0px`
- **Gradient CTA button:** `rgba(255, 255, 255, 0.2) 0px -2px 1px 0px inset, rgba(255, 255, 255, 0.1) 0px 4px 16px 0px inset, rgba(0, 0, 0, 0.08) 0px 6px 16px 0px`

## Imagery

Imagery is rationed like color. The hero leans on a rendered terminal window mockup (white card, traffic-light dots, GeistMono command) — the product is the picture. Below the fold, the 'Users Love Flox' section uses a tiled grid backdrop with low-opacity rose washes and inline outline icons (heart, thumbs-up, cloud, download) as ambient decoration. Photography is absent; the customer logo strip is the only external visual, desaturated to a grayscale gradient so it reads as texture rather than endorsement. The brand's sparkle glyph (a four-point violet-to-pink star) recurs as a decorative accent after the gradient word in the hero and floating inside tinted grid tiles. No 3D, no illustration, no lifestyle photography — the system is icon-and-glyph-led.

## Layout

Max-width 1200px centered, with a 16/24/40/80px spacing rhythm. The hero is a two-column split: left half holds a three-line 76px display headline (with the third word in gradient), supporting body, and a paired button stack; right half holds the floating terminal card. Sections below the fold flow as full-width white bands with 80px vertical padding between them. The 'Built for Your Workflow' section is a three-column equal grid (gap 24–40px) without card chrome — content is separated purely by spacing. The 'Users Love Flox' section uses a full-bleed tiled grid background that bleeds to the viewport edges, with a centered quote card overlaid. The header is a 16/20 padding transparent nav with logo left, links center, ghost sign-in button right. No sidebar, no mega-menu — navigation is a single flat row.

## Agent Prompt Guide

## Quick Color Reference
- text: #020817
- background: #ffffff
- border: #e2e8f0
- accent (gradient): #8247ff → #f47bff (linear-gradient(92deg, #8247ff, #f47bff))
No distinct primary action color was observed; use the extracted neutral button treatments instead of inventing a filled CTA color.
- primary action: no distinct CTA color

## 3-5 Example Component Prompts

1. **Hero display headline + gradient word**: Render a three-line headline at 76px GeistSans 400, color #020817, line-height 1.0, letter-spacing -3.5px. The third line's keyword is colored with linear-gradient(92deg, #8247ff, #f47bff), followed by a 20px sparkle glyph in the same gradient. Subheadline below in 18px GeistSans 400, #020817, line-height 1.35.

2. **Gradient primary + solid dark secondary button pair**: Two buttons side by side, 16px gap. First: gradient fill (linear-gradient(92deg, #8247ff, #f47bff)), white text 14px GeistSans 500, 6px radius, padding 10px 25px, shadow rgba(0,0,0,0.08) 0px 6px 16px. Second: #0c0c0c solid fill, white text, same radius and padding.

3. **Terminal mockup card**: White surface, 12px radius, padding 24px, shadow stack rgba(0,0,0,0.04) 0px 2px 8px, rgba(0,0,0,0.08) 0px 8px 24px, rgba(0,0,0,0.12) 0px 16px 48px. Top-left: three 8px circles in #f3f3f3 spaced 6px apart. Body: GeistMono 14px 500, #ff4fae for the prompt symbol, #020817 for the command text, padding-top 16px.

4. **Three-pillar audience section**: Three equal columns, 24px column gap, no card borders. Each column: a 24px icon right-aligned in its accent color (Iris Glow #8247ff / Ember Orange #ff8a3d / Rose Hot #ff4fae), a 24px GeistSans 400 #020817 heading with -0.29px tracking, a 14px sub-pill in the matching accent color, then a bullet list with 4px row gap and 4px right-pointing chevrons in the accent color.

5. **Ghost nav sign-in button**: Transparent fill, 1px #020817 border, 6px radius, padding 4px 16px, label 14px GeistSans 500 #020817. No shadow.

## Gradient System

The system has exactly three gradients, each with a single job:

1. **Brand sweep** — `linear-gradient(92deg, #8247ff, #f47bff)`. The nearly-horizontal angle (92deg) makes the CTA read as a luminous band rather than a dimensional surface. Reserved for the primary CTA fill and the sparkle glyph.

2. **Accent sweep** — `linear-gradient(95deg, #ff72cf, #8a15ff)`. A complementary pink-to-violet used as a subtle wash on decorative section markers; never on UI controls.

3. **Grayscale desaturator** — `linear-gradient(#bfbfbf, #9b9b9b)`. Applied only to the customer logo strip to push brand marks into ambient texture.

No other gradients belong in the system. Section dividers are always 1px #e2e8f0 hairlines; surface lifts are always achieved through the triple-shadow stack or the Mist #f3f3f3 second tier.

## Similar Brands

- **Vercel** — Same Geist typeface family, same hairline-border minimalism, same single-gradient-as-hero-signature approach on a near-white canvas
- **Linear** — Compact 6/12px radius system, generous display headlines with compressed tracking, and a near-monochrome palette with a single accent that does all the talking
- **Railway** — Developer-tool voice that pairs a gradient hero accent with terminal-mockup product imagery and a trust-logo strip immediately below
- **Replit** — Three-pillar audience sections with color-coded category icons, violet-pink brand spectrum, and code-window product visuals as the hero element

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-graphite-ink: #020817;
  --color-hairline-slate: #e2e8f0;
  --color-paper-white: #ffffff;
  --color-carbon: #1b1b1b;
  --color-mist: #f3f3f3;
  --color-obsidian: #0c0c0c;
  --color-iris-glow: #8247ff;
  --color-magenta-pulse: #f47bff;
  --color-ember-orange: #ff8a3d;
  --color-rose-hot: #ff4fae;

  /* Typography — Font Families */
  --font-geistsans: 'GeistSans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-geistmono: 'GeistMono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --tracking-caption: -0.12px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.43;
  --tracking-body-sm: -0.14px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.16px;
  --text-subheading: 18px;
  --leading-subheading: 1.35;
  --tracking-subheading: -0.2px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: -0.29px;
  --text-display: 76px;
  --leading-display: 1;
  --tracking-display: -3.5px;

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
  --spacing-40: 40px;
  --spacing-80: 80px;
  --spacing-120: 120px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 24px;
  --element-gap: 16px;

  /* Border Radius */
  --radius-md: 6px;
  --radius-xl: 12px;
  --radius-2xl: 16px;

  /* Named Radii */
  --radius-tags: 9999px;
  --radius-cards: 12px;
  --radius-inputs: 6px;
  --radius-buttons: 6px;

  /* Shadows */
  --shadow-subtle: rgba(255, 255, 255, 0.2) 0px -2px 1px 0px inset, rgba(255, 255, 255, 0.1) 0px 4px 16px 0px inset, rgba(0, 0, 0, 0.08) 0px 6px 16px 0px;
  --shadow-sm: rgba(0, 0, 0, 0.04) 0px 2px 8px 0px, rgba(0, 0, 0, 0.08) 0px 8px 24px 0px, rgba(0, 0, 0, 0.12) 0px 16px 48px 0px;

  /* Surfaces */
  --surface-paper-white: #ffffff;
  --surface-mist: #f3f3f3;
  --surface-obsidian: #0c0c0c;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-graphite-ink: #020817;
  --color-hairline-slate: #e2e8f0;
  --color-paper-white: #ffffff;
  --color-carbon: #1b1b1b;
  --color-mist: #f3f3f3;
  --color-obsidian: #0c0c0c;
  --color-iris-glow: #8247ff;
  --color-magenta-pulse: #f47bff;
  --color-ember-orange: #ff8a3d;
  --color-rose-hot: #ff4fae;

  /* Typography */
  --font-geistsans: 'GeistSans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-geistmono: 'GeistMono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --tracking-caption: -0.12px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.43;
  --tracking-body-sm: -0.14px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.16px;
  --text-subheading: 18px;
  --leading-subheading: 1.35;
  --tracking-subheading: -0.2px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: -0.29px;
  --text-display: 76px;
  --leading-display: 1;
  --tracking-display: -3.5px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-40: 40px;
  --spacing-80: 80px;
  --spacing-120: 120px;

  /* Border Radius */
  --radius-md: 6px;
  --radius-xl: 12px;
  --radius-2xl: 16px;

  /* Shadows */
  --shadow-subtle: rgba(255, 255, 255, 0.2) 0px -2px 1px 0px inset, rgba(255, 255, 255, 0.1) 0px 4px 16px 0px inset, rgba(0, 0, 0, 0.08) 0px 6px 16px 0px;
  --shadow-sm: rgba(0, 0, 0, 0.04) 0px 2px 8px 0px, rgba(0, 0, 0, 0.08) 0px 8px 24px 0px, rgba(0, 0, 0, 0.12) 0px 16px 48px 0px;
}
```
