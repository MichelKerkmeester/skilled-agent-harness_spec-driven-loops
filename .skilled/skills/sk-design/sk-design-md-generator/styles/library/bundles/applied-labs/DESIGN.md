# Applied Labs — Style Reference
> Sunlit cream paper with cobalt punctuation and floating conversation cards

**Theme:** light

Applied Labs reads like a warm, sunlit editorial spread: cream paper backgrounds, near-black ink type, and a single vivid cobalt blue used as quiet punctuation rather than a shout. The visual signature is the contrast between photographic warmth (real people in real light, not illustrations or 3D renders) and restrained, typographically-driven UI chrome. Conversation fragments — translucent chat bubbles, message exchanges, agent replies — float as a design motif across hero and feature sections, making the product's nature legible without explaining it. Dark filled buttons (espresso-black) are the only hard shapes against the otherwise soft, hairline-divided surface stack; the entire system feels like reading a thoughtful magazine rather than scrolling a product page.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| White | `#ffffff` | `--color-white` | Page canvas, base card surface, nav background |
| Cream | `#f7f7f4` | `--color-cream` | Warm off-white section background, soft card fill — the secondary surface layer that gives the page its paper-like warmth |
| Fog | `#f5f5f5` | `--color-fog` | Elevated card surfaces and subtle section bands |
| Ash | `#e4e4e7` | `--color-ash` | Hairline borders, dividers, input underlines — the structural skeleton of the layout |
| Stone | `#8c8c8c` | `--color-stone` | Tertiary text, placeholder copy, disabled states |
| Steel | `#737373` | `--color-steel` | Secondary body text, helper copy, muted descriptions |
| Graphite | `#666666` | `--color-graphite` | Secondary body text on cream surfaces |
| Charcoal | `#4d4d4d` | `--color-charcoal` | Secondary body text, navigation labels, and subdued headings. Do not promote it to the primary CTA color |
| Warm Gray | `#7d7c78` | `--color-warm-gray` | SVG icon fills, subtle warm-toned decorative elements |
| Espresso | `#26251e` | `--color-espresso` | Primary text on cream surfaces, dark card accents, outlined action borders — the warm alternative to pure black |
| Midnight | `#09090b` | `--color-midnight` | Primary body and heading text on white, the dominant ink color |
| Pure Black | `#000000` | `--color-pure-black` | Primary headings, body text, and icon fills on light surfaces. Do not promote it to the primary CTA color |
| Deep Ink | `#111111` | `--color-deep-ink` | Footer and nav text, dark surface accents |
| Slate Blue | `#5c7aa1` | `--color-slate-blue` | Muted blue-gray for section backgrounds, subdued text accents, and image overlay washes — adds cool depth without competing with the cobalt accent |
| Warm Sand | `#b39987` | `--color-warm-sand` | Warm tan card surfaces, trust/social-proof section backgrounds — a near-gray with just enough warmth to echo the photography |
| Cobalt Spark | `#0051ff` | `--color-cobalt-spark` | Violet text accent for links, tags, and emphasized short phrases. Do not promote it to the primary CTA color |
| Emerald | `#00cb39` | `--color-emerald` | Green text accent for links, tags, and emphasized short phrases. Use as a supporting accent, not as a status color |

## Tokens — Typography

### Geist — Sole typeface — used for everything from display headlines down to 10px micro-copy. Geist's geometric neutrality and tall x-height make it read as editorial without being cold. · `--font-geist`
- **Substitute:** Inter
- **Weights:** 300, 400, 500
- **Sizes:** 10, 11, 12, 13, 14, 15, 16, 24, 36, 48
- **Line height:** 1.00, 1.08, 1.17, 1.20, 1.25, 1.35, 1.43, 1.45, 1.50, 1.55
- **Letter spacing:** Tight tracking on display (-0.96px at 48px, -0.72px at 36px, -0.29px at 24px); near-zero on body (0.08px at 16px); slightly open on micro-copy (0.14px at 14px, 0.12px at 12px)
- **OpenType features:** `"ss01" on, "cv11" on`
- **Role:** Sole typeface — used for everything from display headlines down to 10px micro-copy. Geist's geometric neutrality and tall x-height make it read as editorial without being cold.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 11px | 1.45 | 0.11px | `--text-caption` |
| body-lg | 15px | 1.5 | 0.15px | `--text-body-lg` |
| subheading | 24px | 1.35 | -0.29px | `--text-subheading` |
| heading | 36px | 1.17 | -0.72px | `--text-heading` |
| display | 48px | 1.08 | -0.96px | `--text-display` |

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
| 28 | 28px | `--spacing-28` |
| 32 | 32px | `--spacing-32` |
| 36 | 36px | `--spacing-36` |
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |
| 56 | 56px | `--spacing-56` |
| 64 | 64px | `--spacing-64` |
| 80 | 80px | `--spacing-80` |
| 120 | 120px | `--spacing-120` |
| 140 | 140px | `--spacing-140` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 9999px |
| cards | 8px |
| pills | 9999px |
| inputs | 4px |
| buttons | 8px |
| largeCards | 24px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| xl | `rgba(38, 37, 30, 0.14) 0px 18px 36px 0px` | `--shadow-xl` |
| xl-2 | `rgba(0, 0, 0, 0.03) -65px 67px 56px 0px, rgba(0, 0, 0, 0....` | `--shadow-xl-2` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80-120px
- **Card padding:** 12-16px
- **Element gap:** 12px

## Components

### Sticky Navigation Bar
**Role:** Top-level site navigation, persistent across scroll

White background with #e4e4e7 bottom border, 64-72px height. Logo (sparkle icon + wordmark) left-aligned, nav links (Product, Industries, Pricing, Assurance, Company) in 14px Geist 500 Midnight, spaced 24-32px apart. Right side: 'Log In' ghost text link and 'Get Demo' pill button. Padding: 0 24px horizontal.

### Primary CTA Button (Dark Filled)
**Role:** Main action — Get Demo, Book demo, Submit

Filled #000000 or #26251, white text, 8px border-radius, 14px 24px padding. Text in Geist 500 at 14px with 0.14px letter-spacing. On hover: slight elevation via rgba(38,37,30,0.14) 0px 18px 36px shadow. No border.

### Pill CTA Button
**Role:** Compact action in nav or tight spaces

Filled dark (#000000), white text, 9999px border-radius (full pill), 8px 16px padding. 14px Geist 500.

### Ghost Text Link
**Role:** Secondary navigation, inline links

No background or border. Midnight (#09090b) text at 14px Geist 400. On hover: Cobalt Spark (#0051ff).

### Cobalt Inline Link
**Role:** Highlighted link within body text — the system's only colored link

Cobalt Spark (#0051ff), Geist 400, no underline by default; underline on hover. Used to mark the single most important action within a paragraph.

### Hero Section with Photo + Chat Overlay
**Role:** Above-the-fold brand impression

Full-bleed warm-toned photography (person with phone, golden-hour lighting) with a series of translucent chat message bubbles overlaid on the right third. Headline at 48px Geist 300 Midnight with -0.96px tracking, left-aligned. Subhead in 18px Geist 400 Steel. CTA button below. Photo has no border-radius; chat bubbles use 12-16px radius with semi-transparent cream backgrounds.

### Chat Message Bubble (User)
**Role:** Visualization of customer message in product context

Semi-transparent cream/white background (rgba(255,255,255,0.85)), 12px border-radius, 12px 16px padding, 14px Geist 400 Midnight text. Small avatar dot or icon prefix.

### Chat Message Bubble (Agent)
**Role:** Visualization of AI agent reply in product context

Semi-transparent dark or cobalt-tinted background with white text, 12px border-radius, 12px 16px padding. Slightly larger than user bubbles to indicate response depth. Includes agent name prefix in small caption text.

### Trust Logo Strip
**Role:** Social proof — brands that use the product

Warm Sand (#b39987) or Cream (#f7f7f4) background band, full-width. Centered 'Trusted by millions of customers' caption at 12-13px Steel. Row of 6-8 monochrome brand logos in a single horizontal line, each in a subtle bordered cell or spaced 40-60px apart. Logos rendered in Midnight or Charcoal.

### Section Heading Block
**Role:** Section introduction — text-only or text + subhead

Generous vertical space (80-120px top padding). Headline at 36px Geist 300 Midnight, -0.72px tracking. Optional subhead at 18px Geist 400 Steel. No decorative elements — the type does the work.

### Feature Card
**Role:** Product capability or benefit block

White or Cream background, 8px border-radius, 1px #e4e4e7 border, 16px padding. Optional 24px radius for larger hero-feature cards. No drop shadow by default. Content: icon (24px, Midnight or Cobalt), heading at 16-18px Geist 500, body at 14px Geist 400 Steel.

### Form Section
**Role:** Lead capture with visual context

Two-column layout: left = form on white/cream, right = full-bleed photograph. Form has generous vertical rhythm. Headline at 36px Geist 300, body at 16px Steel, then 3-4 stacked inputs with 24-32px vertical gap.

### Text Input (Underline Style)
**Role:** Form field for name, email, etc.

Borderless top/sides, 1px #e4e4e7 bottom border only. 12px vertical padding. 14px Geist 400 Midnight text. Placeholder in Stone (#8c8c8c). On focus: bottom border transitions to Midnight. No background fill.

### Select Dropdown
**Role:** Ticket volume or option selection

Same underline treatment as text input. Right-aligned chevron icon in Charcoal. Geist 400 14px.

### Submit Button (Form)
**Role:** Form submission action

Full-width within form column. Filled Midnight (#09090b) or Espresso (#26251e), white text, 8px radius, 14px 24px padding, Geist 500 14px.

### Footer
**Role:** Site-wide footer with links and legal

White or Cream background, top border in #e4e4e7. Logo left, link columns center, legal/social right. Text in 12-13px Geist 400 Steel. Generous padding (40-60px vertical).

## Do's and Don'ts

### Do
- Use #f7f7f4 cream for section backgrounds that need warmth; reserve #ffffff for the page canvas and elevated cards
- Apply 8px border-radius consistently to cards, buttons, and inputs — this is the system's signature softness, not pill-rounded, not sharp
- Set headline letter-spacing to -0.02em at 48px and -0.012em at 24px; use positive tracking (0.005-0.010em) only on 12-14px body and micro-copy
- Use Cobalt Spark (#0051ff) for at most one inline link or accent per section — it marks the singular important action, not decoration
- Fill primary action buttons with #000000 or #26251e; let white text carry the contrast
- Use #e4e4e7 for all structural borders, dividers, and input underlines at 1px
- Layer chat-message visuals over warm photography to communicate the product's conversational nature without explaining it

### Don't
- Do not fill buttons with Cobalt Spark (#0051ff) — that color is reserved for inline text accents and links, never for filled button backgrounds
- Do not use shadows on cards unless they represent a floating overlay or modal; the system relies on borders and surface color shifts, not elevation
- Do not use illustrations, 3D renders, or icon-heavy compositions as primary visuals — real warm-toned photography carries the brand
- Do not use a second typeface; Geist handles everything from 10px caption to 48px display
- Do not use the warm tan (#b39987) or slate blue (#5c7aa1) for more than 10-15% of the visible surface — they are accent surfaces, not the canvas
- Do not set headline weight above 500; weight 300 is the signature, weight 500 is for emphasis, never 600-700
- Do not use border-radius above 24px on standard cards; the 8px default is the system's defining softness

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas | `#ffffff` | Page background, base layer |
| 1 | Cream | `#f7f7f4` | Warm section backgrounds, alternating bands |
| 2 | Fog | `#f5f5f5` | Elevated card surfaces, subtle differentiation |
| 3 | Warm Sand | `#b39987` | Social-proof and trust band backgrounds |
| 4 | Slate Blue | `#5c7aa1` | Cool accent section, image overlay wash |

## Elevation

- **Floating Chat Bubble Overlay:** `rgba(38, 37, 30, 0.14) 0px 18px 36px 0px`
- **Elevated Card / Modal:** `rgba(0, 0, 0, 0.03) -65px 67px 56px 0px, rgba(0, 0, 0, 0.05) -29px 30px 41px 0px, rgba(0, 0, 0, 0.05) -7px 7px 23px 0px`

## Imagery

Real photography only — warm-toned, golden-hour or natural-light portraits of people using devices in everyday contexts. No illustrations, no 3D renders, no abstract graphics. Images are full-bleed or generously sized; never small thumbnails. Chat message bubbles and agent reply cards are composited directly onto the photography as translucent overlays, making the product's conversational nature visible. Brand logos in the trust strip are rendered monochrome (Midnight or Charcoal) at consistent optical size, spaced evenly. Icons are minimal — 1-1.5px stroke weight, outlined style, in Midnight or Cobalt.

## Layout

Max-width 1200px centered content column with sections that break to full-bleed for photography. Navigation is a sticky top bar (64-72px). The hero is a two-zone composition: left-aligned headline + subhead + CTA on white, with a large warm-toned photograph occupying the right half, overlaid with floating chat message bubbles that extend beyond the photo's right edge. Below the fold, sections alternate between white and cream backgrounds with 80-120px vertical gaps. The trust logo strip is a full-width band. Feature sections use a two-column text+visual or single-column centered heading followed by card grids. The form section uses a 50/50 split: form on the left, full-bleed photograph on the right. Footer is a single row with white background. Overall density is spacious and editorial — generous whitespace, large headlines, and breathing room between components rather than compact information stacking.

## Agent Prompt Guide

**Quick Color Reference**
- text: #09090b (primary), #737373 (secondary), #8c8c8c (tertiary)
- background: #ffffff (canvas), #f7f7f4 (cream sections), #f5f5f5 (card surfaces)
- border: #e4e4e7 (hairline, 1px)
- accent: #0051ff (Cobalt Spark — links and inline emphasis only)
- primary action: no distinct CTA color

**3-5 Example Component Prompts**

1. **Hero Section**: White (#ffffff) background, max-width 1200px. Headline 'Every customer, better served' at 48px Geist weight 300, color #09090b, letter-spacing -0.96px, line-height 1.08. Subhead at 16px Geist 400, #737373. Dark filled button: #000000 background, white text, 8px radius, 14px 24px padding, Geist 500 14px. Right side: full-bleed warm-toned photograph with 3-4 translucent chat message bubbles overlaid, each with 12px radius and rgba(255,255,255,0.85) fill.

2. **Feature Card**: 8px border-radius, 1px #e4e4e7 border, 16px padding, #ffffff background. 24px icon in #09090b. Heading 'Capability name' at 16px Geist 500 #09090b. Body at 14px Geist 400 #737373, 12px margin-top. No shadow.

3. **Form Input (Underline)**: No background, no top or side borders, 1px #e4e4e7 bottom border only, 12px vertical padding. Label at 12px Geist 500 #737373 above the field. Input text at 14px Geist 400 #09090b. Placeholder #8c8c8c. On focus, bottom border becomes #09090b.

4. **Trust Logo Strip**: Full-width band, background #b39987 (Warm Sand) or #f7f7f4 (Cream). Centered caption 'Trusted by millions of customers' at 13px Geist 400 #737373, 24px bottom margin. Row of 6-8 monochrome logos (each in #09090b or #4d4d4d), spaced 48px apart, optically aligned to the same height.

5. **Section Heading Block**: 120px top padding, max-width 720px. Headline at 36px Geist 300 #09090b, letter-spacing -0.72px, line-height 1.17. Optional subhead at 18px Geist 400 #737373, 16px top margin.

## Color Behavior

The system operates on a 95/5 ratio: 95% of the visible surface is neutral (white, cream, fog, and warm grays), and 5% is chromatic (Cobalt Spark for links, Warm Sand for trust bands, Slate Blue for cool accent sections). Cobalt Spark is never used as a fill — it only appears as text or thin icon strokes. The dark CTA buttons (#000000 or #26251e) are the only hard visual anchors in an otherwise soft, warm system. This restraint is the brand: the AI product is calm and confident, not loud or hype-driven.

## Typography Attitude

Geist at weight 300 for headlines is a deliberate anti-SaaS choice. Most AI/tech sites use weight 600-700 to project authority; Applied Labs uses weight 300 to project editorial calm — authority through restraint, not volume. The negative letter-spacing on large sizes (-0.02em at 48px) tightens the display type into a confident, condensed feel without losing the geometric openness. Micro-copy at 10-12px uses positive tracking (0.005-0.010em) to maintain legibility at small sizes — this is the type system speaking in two registers: tight and confident large, open and breathable small.

## Similar Brands

- **Linear** — Same Geist typeface, same restrained use of a single chromatic accent against a near-monochrome interface, same tight tracking on large display sizes
- **Vercel** — Geist as primary typeface, monochrome-first palette with one vivid blue accent, editorial spacing rhythm with generous section gaps
- **Notion** — Warm off-white surfaces, hairline borders instead of shadows, real photography of people, and a calm conversational product aesthetic
- **Stripe** — Clean editorial type hierarchy, restrained color palette, and the practice of using one vivid color as punctuation rather than as a dominant fill
- **Arc Browser** — Warm cream and white surfaces with a single saturated accent, soft 8px corners, and an editorial product-narrative feel

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-white: #ffffff;
  --color-cream: #f7f7f4;
  --color-fog: #f5f5f5;
  --color-ash: #e4e4e7;
  --color-stone: #8c8c8c;
  --color-steel: #737373;
  --color-graphite: #666666;
  --color-charcoal: #4d4d4d;
  --color-warm-gray: #7d7c78;
  --color-espresso: #26251e;
  --color-midnight: #09090b;
  --color-pure-black: #000000;
  --color-deep-ink: #111111;
  --color-slate-blue: #5c7aa1;
  --color-warm-sand: #b39987;
  --color-cobalt-spark: #0051ff;
  --color-emerald: #00cb39;

  /* Typography — Font Families */
  --font-geist: 'Geist', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 11px;
  --leading-caption: 1.45;
  --tracking-caption: 0.11px;
  --text-body-lg: 15px;
  --leading-body-lg: 1.5;
  --tracking-body-lg: 0.15px;
  --text-subheading: 24px;
  --leading-subheading: 1.35;
  --tracking-subheading: -0.29px;
  --text-heading: 36px;
  --leading-heading: 1.17;
  --tracking-heading: -0.72px;
  --text-display: 48px;
  --leading-display: 1.08;
  --tracking-display: -0.96px;

  /* Typography — Weights */
  --font-weight-light: 300;
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
  --spacing-28: 28px;
  --spacing-32: 32px;
  --spacing-36: 36px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-56: 56px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-120: 120px;
  --spacing-140: 140px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80-120px;
  --card-padding: 12-16px;
  --element-gap: 12px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-3xl: 24px;
  --radius-full: 99px;

  /* Named Radii */
  --radius-tags: 9999px;
  --radius-cards: 8px;
  --radius-pills: 9999px;
  --radius-inputs: 4px;
  --radius-buttons: 8px;
  --radius-largecards: 24px;

  /* Shadows */
  --shadow-xl: rgba(38, 37, 30, 0.14) 0px 18px 36px 0px;
  --shadow-xl-2: rgba(0, 0, 0, 0.03) -65px 67px 56px 0px, rgba(0, 0, 0, 0.05) -29px 30px 41px 0px, rgba(0, 0, 0, 0.05) -7px 7px 23px 0px;

  /* Surfaces */
  --surface-canvas: #ffffff;
  --surface-cream: #f7f7f4;
  --surface-fog: #f5f5f5;
  --surface-warm-sand: #b39987;
  --surface-slate-blue: #5c7aa1;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-white: #ffffff;
  --color-cream: #f7f7f4;
  --color-fog: #f5f5f5;
  --color-ash: #e4e4e7;
  --color-stone: #8c8c8c;
  --color-steel: #737373;
  --color-graphite: #666666;
  --color-charcoal: #4d4d4d;
  --color-warm-gray: #7d7c78;
  --color-espresso: #26251e;
  --color-midnight: #09090b;
  --color-pure-black: #000000;
  --color-deep-ink: #111111;
  --color-slate-blue: #5c7aa1;
  --color-warm-sand: #b39987;
  --color-cobalt-spark: #0051ff;
  --color-emerald: #00cb39;

  /* Typography */
  --font-geist: 'Geist', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 11px;
  --leading-caption: 1.45;
  --tracking-caption: 0.11px;
  --text-body-lg: 15px;
  --leading-body-lg: 1.5;
  --tracking-body-lg: 0.15px;
  --text-subheading: 24px;
  --leading-subheading: 1.35;
  --tracking-subheading: -0.29px;
  --text-heading: 36px;
  --leading-heading: 1.17;
  --tracking-heading: -0.72px;
  --text-display: 48px;
  --leading-display: 1.08;
  --tracking-display: -0.96px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-28: 28px;
  --spacing-32: 32px;
  --spacing-36: 36px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-56: 56px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-120: 120px;
  --spacing-140: 140px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-3xl: 24px;
  --radius-full: 99px;

  /* Shadows */
  --shadow-xl: rgba(38, 37, 30, 0.14) 0px 18px 36px 0px;
  --shadow-xl-2: rgba(0, 0, 0, 0.03) -65px 67px 56px 0px, rgba(0, 0, 0, 0.05) -29px 30px 41px 0px, rgba(0, 0, 0, 0.05) -7px 7px 23px 0px;
}
```
