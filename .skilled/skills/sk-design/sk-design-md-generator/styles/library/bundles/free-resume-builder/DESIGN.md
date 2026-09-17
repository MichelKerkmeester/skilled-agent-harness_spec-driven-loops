# Free Resume Builder — Style Reference
> fresh worksheet with blue ballpoint.

**Theme:** light

Resume.io is a confident, document-first utility: a near-pure white canvas where a single vivid blue is the only voice allowed to interrupt the page. The system is built on a restricted chromatic diet — one near-black ink, one primary blue, one violet — with every other surface expressed as the faintest wash of color (mint, peach, lavender) to separate content blocks without adding noise. Typography is geometric and tightly set: a custom sans (TT Commons) carries the entire hierarchy from 14px helper text to a 67px display, and the lack of drop shadows or gradients keeps everything feeling like a productivity tool rather than a marketing site. The result reads like a fresh worksheet — clean paper, blue ballpoint annotations, the occasional green check.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Ink | `#1e2532` | `--color-ink` | Body text, primary copy, icon strokes, footer text — the default ink across all running content |
| Carbon | `#0f141e` | `--color-carbon` | Headlines, headings, footer brand mark — darker than Ink for emphasis lift on large type |
| Pencil | `#656e83` | `--color-pencil` | Secondary body text, descriptions, helper copy — sits between Ink and Fog |
| Fog | `#828ba2` | `--color-fog` | Muted metadata, captions, inactive nav items, subtle icon tint |
| Haze | `#9fa6bb` | `--color-haze` | List dividers, lightest neutral text, disabled borders |
| Paper | `#ffffff` | `--color-paper` | Page background, card surfaces, button text on colored fills — the base canvas |
| Mist | `#f7f9fc` | `--color-mist` | Hero section wash, feature row background, subtle surface lift below cards |
| Lavender Wash | `#f1f2ff` | `--color-lavender-wash` | Tinted section background for tool/feature blocks — barely-there violet breath |
| Chalk | `#d9deeb` | `--color-chalk` | Hairline borders, nav separators, card outlines on tinted backgrounds |
| Ash | `#e7eaf4` | `--color-ash` | Subtle button borders, ghost-control outlines, secondary surface |
| Signal Blue | `#1a91f0` | `--color-signal-blue` | Blue supporting accent for decorative details and low-frequency emphasis. Do not promote it to the primary CTA color |
| Deep Signal | `#016fd0` | `--color-deep-signal` | Hover/pressed state of Signal Blue, darker link color for visited emphasis |
| Iris | `#5660e8` | `--color-iris` | Decorative icon accent, step indicator strokes, secondary highlight on cards |
| Midnight | `#1a1c6a` | `--color-midnight` | Dark template preview surface, deep contrast callout — the only near-black accent beyond Ink |
| Mint Whisper | `#e7f4ed` | `--color-mint-whisper` | Light supporting surface for subtle backgrounds and section separation. Use as a supporting accent, not as a status color |
| Blush Whisper | `#ffebe4` | `--color-blush-whisper` | Light supporting surface for subtle backgrounds and section separation. Use as a supporting accent, not as a status color |
| Rose Whisper | `#edd7df` | `--color-rose-whisper` | Supporting neutral for secondary UI, dividers, and muted labels. Use as a supporting accent, not as a status color |

## Tokens — Typography

### TT Commons — Single-family system covering everything from 14px helper text to 67px display headlines. The custom geometric sans is the brand's voice; its 0.96–1.00 line-height on display sizes is anti-convention (most sites use 1.1+) and produces the tight, poster-like headline feel. 0.1290em tracking appears on small uppercase micro-labels; 0.0210em is the default body rhythm. · `--font-tt-commons`
- **Substitute:** Inter, DM Sans, or Outfit
- **Weights:** 400, 500, 600
- **Sizes:** 14, 15, 16, 18, 19, 22, 24, 28, 31, 40, 52, 67
- **Line height:** 0.96, 1.00, 1.07, 1.14, 1.16, 1.17, 1.20, 1.22, 1.25, 1.26, 1.27, 1.43
- **Letter spacing:** 0.021em body default; 0.129em on uppercase micro-labels (eyebrow text and small caps)
- **OpenType features:** `"ss01" on, "cv11" on`
- **Role:** Single-family system covering everything from 14px helper text to 67px display headlines. The custom geometric sans is the brand's voice; its 0.96–1.00 line-height on display sizes is anti-convention (most sites use 1.1+) and produces the tight, poster-like headline feel. 0.1290em tracking appears on small uppercase micro-labels; 0.0210em is the default body rhythm.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 14px | 1.43 | 0.29px | `--text-caption` |
| body | 16px | 1.25 | 0.336px | `--text-body` |
| subheading | 19px | 1.22 | 0.399px | `--text-subheading` |
| heading-sm | 24px | 1.17 | 0.504px | `--text-heading-sm` |
| heading | 31px | 1.14 | 0.651px | `--text-heading` |
| heading-lg | 40px | 1.07 | 0.84px | `--text-heading-lg` |
| display | 67px | 0.96 | 1.407px | `--text-display` |

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
| 36 | 36px | `--spacing-36` |
| 40 | 40px | `--spacing-40` |
| 44 | 44px | `--spacing-44` |
| 48 | 48px | `--spacing-48` |
| 60 | 60px | `--spacing-60` |
| 64 | 64px | `--spacing-64` |
| 120 | 120px | `--spacing-120` |
| 144 | 144px | `--spacing-144` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 100px |
| cards | 16px |
| icons | 4px |
| inputs | 4px |
| buttons | 36px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 24px
- **Element gap:** 12px

## Components

### Primary CTA Button
**Role:** Filled pill button for the page's main action

Background #1a91f0, white text at 16px/weight 500, horizontal padding 18px 24px, border-radius 36px. The 36px radius is aggressive — it pushes toward a pill shape without being a full pill, giving the button a tactile, thumb-friendly feel. No border, no shadow. Hover darkens to #016fd0.

### Ghost Text Button
**Role:** Secondary action expressed as a typographic link

No background, no border. Text in #1a91f0 at 16px/weight 500, padding 8px 4px. Sits immediately right of the primary CTA as a low-commitment alternative ('Upload my resume'). Underline appears on hover.

### Navigation Bar
**Role:** Sticky top header with brand, menu, and CTA

White background, 1px Chalk (#d9deeb) bottom border. Logo left, centered link cluster (16px weight 400 Ink), and a filled Primary CTA Button on the far right. Height ~64px. A faint vertical divider in Haze (#9fa6bb) separates the sign-in link from the CTA.

### Hero Section
**Role:** Above-the-fold headline + supporting copy + product visual

Background #f7f9fc with generous vertical padding (~80px top/bottom). Left column: 52px weight 400 Ink headline with one phrase in Signal Blue ('an interview'), 18px Pencil subtext, Primary CTA + Ghost button row, then a Trustpilot line. Right column: a tilted resume preview card with floating skill chips.

### Resume Preview Card
**Role:** Decorative product screenshot used in hero and feature sections

White surface, 1px Chalk border, 16px radius, slight rotation (-2° to 3°) to feel placed rather than mechanical. Internal 'ATS Score' badge uses Mint Whisper (#e7f4ed) fill with green text. Floating skill tags sit on a blurred white card with 20px radius.

### Step List Card
**Role:** Left column numbered progression in the tools section

White background, 16px radius, 1px Ash border. Each row: outlined step icon (36px box, 4px radius), 18px weight 500 Ink label, faint right-arrow icon. Active row gets a 2px Signal Blue left border and blue label text.

### Tool Feature Card (Tinted)
**Role:** Large illustrated feature card with colored wash background

Three variants sharing a structure: 24px padding, 20px radius, colored wash fill. Variants: Lavender Wash (#f1f2ff) with Iris icon for 'Resume Builder'; Mint Whisper (#e7f4ed) for recruiter/positive flow; Blush Whisper (#ffebe4) for warm features. Each has a 22px weight 600 Ink title, 16px Pencil description, and a small product preview image.

### Feature Tile (Bottom Row)
**Role:** Compact four-up feature highlights

White card on Mist background, 1px Chalk border, 12px radius, 24px padding. Outlined icon in 1.5px stroke (Iris or Signal Blue), 18px weight 500 Ink title, 15px Pencil description. Four tiles per row, 24px column gap.

### Stat Counter
**Role:** Large live metric in the social-proof band

Inline row: small 20px Signal Blue icon, 31px weight 500 Signal Blue number, 31px weight 400 Ink unit label. The blue number against black label creates the only colored emphasis in an otherwise monochrome band.

### Trustpilot Rating Row
**Role:** Star rating + review count line

18px Ink copy with a single green star (5-point, Mint Whisper fill), a small 'Trustpilot' wordmark, and 15px Pencil metadata ('4.4 out of 5 | 37,389 reviews'). Sits inline below hero CTAs.

### Social Proof Logo Bar
**Role:** Section labeled "Our candidates have been hired at:"

White background, no card, just a 16px Pencil label on the left and 5–6 company logos to the right at uniform height (~28px). Logos rendered in Haze (#828ba2) or Fog to stay quiet against the page.

### Numbered Step Indicator
**Role:** Inline 1./2./3./4. ordinal inside the step list

18px weight 500 Fog numerals, used as quiet prefixes before each step title. No background, no badge — just typographic rhythm.

### Footer Brand Mark
**Role:** Logo + tagline at the bottom of the page

Carbon (#0f141e) wordmark at 22px weight 600, 14px Pencil tagline beneath. Anchors the footer which otherwise lives in Ink on white.

## Do's and Don'ts

### Do
- Use Signal Blue (#1a91f0) as the only chromatic accent on neutral surfaces; let Lavender, Mint, and Blush washes carry the secondary palette.
- Set display headlines at 67px with 0.96 line-height and ~1.4px tracking — the tight leading is the poster-like signature.
- Apply 36px border-radius to all primary buttons and 16–20px to cards; reserve 4px for icons and inputs.
- Build section rhythm with 80px vertical gaps on a white-to-Mist gradient of backgrounds — never with shadows or dividers.
- Let the hero headline contain exactly one blue phrase inside an otherwise Ink sentence — the blue word is the hook.
- Use TT Commons (or Inter) at weight 400 for body and 500–600 for UI controls; 600 is reserved for short labels and titles only.
- Anchor every section with a 4-up feature tile row or a tinted tool card — the pattern repeats like a worksheet checklist.

### Don't
- Don't introduce drop shadows, gradients, or glassmorphism — the system is intentionally flat and shadowless.
- Don't use more than one chromatic accent color per screen; Iris should never appear alongside Signal Blue as a competing call-to-action.
- Don't set body line-height above 1.43 or display below 0.96 — both break the poster rhythm.
- Don't round inputs, icons, or small chips to 36px — that radius belongs to primary buttons only and would look like a missed tap target elsewhere.
- Don't use Carbon (#0f141e) for body text; reserve it for headlines and footer marks so the contrast hierarchy stays readable.
- Don't add a third neutral between Haze and Chalk — the scale already has six steps and a seventh creates muddy mid-tones.
- Don't place the 67px display size in anything other than the hero or a single section opener; the scale is calibrated for one shout per screen.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Paper | `#ffffff` | Base page canvas |
| 1 | Mist | `#f7f9fc` | Hero and section wash — soft elevation without shadow |
| 2 | Lavender Wash | `#f1f2ff` | Feature card tinted background |
| 3 | Tinted Feature Surfaces | `#e7f4ed` | Coloured feature card variants (mint, blush, rose) |

## Elevation

The system is deliberately flat. All depth is communicated through background-color stepping (Paper → Mist → Lavender Wash) and 1px Chalk borders rather than shadows. This keeps the page feeling like a printed worksheet rather than a layered app.

## Imagery

Imagery is product-first: tilted, slightly rotated screenshots of the resume editor with floating skill chips and ATS-score badges act as the only visual storytelling device. There is no lifestyle photography, no stock imagery, and no abstract illustration — the product is the hero. Decorative elements are confined to outlined line icons (1.5px stroke, rounded caps) in Iris or Signal Blue, and a row of monochrome company logos in Fog. Color appears inside product UI as functional accents (green score badge, blue action chip) rather than as decoration.

## Layout

Max-width 1200px centered container with generous gutters. The hero is a two-column split (text-left, product-right) on a Mist wash. Below, the page flows as a vertical sequence of full-width bands alternating between white and Mist backgrounds, each containing either a 4-up feature tile row, a single oversized tinted tool card, or a centered headline + product visual. The tools section breaks the grid into a three-column row: narrow step list on the left, two large tinted cards (Resume Builder, Recruiter Match) on the right. A company-logo social-proof band and a Trustpilot review row sit inline with the hero CTA. Navigation is a single sticky top bar with right-aligned primary CTA; no sidebar, no mega-menu. Section gaps of ~80px create the worksheet rhythm.

## Agent Prompt Guide

**Quick Color Reference**
- text (body): #1e2532
- text (heading): #0f141e
- text (muted): #828ba2
- background: #ffffff
- surface (section wash): #f7f9fc
- border: #d9deeb
- accent: #1a91f0
- primary action: no distinct CTA color

**3-5 Example Component Prompts**

No distinct primary action color was observed; use the extracted neutral button treatments instead of inventing a filled CTA color.

2. **Tinted tool card**: #f1f2ff background, 20px radius, 24px padding. Outlined icon in 1.5px stroke #5660e8 at 28px. Title at 22px weight 600 #1e2532. Description at 16px weight 400 #656e83. A small product preview image floats bottom-right with -2° rotation.

3. **Feature tile row**: White card on #f7f9fc section background, 1px #d9deeb border, 12px radius, 24px padding. 4 tiles per row, 24px column gap. Each tile: 28px outlined icon in #1a91f0, 18px weight 500 #1e2532 title, 15px weight 400 #828ba2 description.

4. **Stat counter**: Inline row with a 20px #1a91f0 icon, 31px weight 500 #1a91f0 number, then 31px weight 400 #1e2532 label. No card, no background — sits centered in a white band.

5. **Step list card**: White card, 1px #e7eaf4 border, 16px radius. Each row: 18px weight 400 #828ba2 numeral prefix, 18px weight 500 #1e2532 title, 36px outlined icon on the left in #1a91f0, faint right-arrow icon. Active row gets a 2px #1a91f0 left border and #1a91f0 title text.

## Similar Brands

- **Notion** — Same single-accent-color restraint with geometric sans typography and flat, shadowless card surfaces on near-white backgrounds
- **Linear** — Tight letter-spacing on display type, one vivid accent (their purple / this site's blue) against monochrome UI, and 4-up feature grids with tinted backgrounds
- **Canva** — Document-builder product chrome with rounded pill buttons, tinted feature cards, and a confident single-blue accent on white
- **Zapier** — Comfortable density, product-screenshot-led hero, and feature bands alternating between white and faint washes without any shadows

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-ink: #1e2532;
  --color-carbon: #0f141e;
  --color-pencil: #656e83;
  --color-fog: #828ba2;
  --color-haze: #9fa6bb;
  --color-paper: #ffffff;
  --color-mist: #f7f9fc;
  --color-lavender-wash: #f1f2ff;
  --color-chalk: #d9deeb;
  --color-ash: #e7eaf4;
  --color-signal-blue: #1a91f0;
  --color-deep-signal: #016fd0;
  --color-iris: #5660e8;
  --color-midnight: #1a1c6a;
  --color-mint-whisper: #e7f4ed;
  --color-blush-whisper: #ffebe4;
  --color-rose-whisper: #edd7df;

  /* Typography — Font Families */
  --font-tt-commons: 'TT Commons', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.43;
  --tracking-caption: 0.29px;
  --text-body: 16px;
  --leading-body: 1.25;
  --tracking-body: 0.336px;
  --text-subheading: 19px;
  --leading-subheading: 1.22;
  --tracking-subheading: 0.399px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.17;
  --tracking-heading-sm: 0.504px;
  --text-heading: 31px;
  --leading-heading: 1.14;
  --tracking-heading: 0.651px;
  --text-heading-lg: 40px;
  --leading-heading-lg: 1.07;
  --tracking-heading-lg: 0.84px;
  --text-display: 67px;
  --leading-display: 0.96;
  --tracking-display: 1.407px;

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
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-36: 36px;
  --spacing-40: 40px;
  --spacing-44: 44px;
  --spacing-48: 48px;
  --spacing-60: 60px;
  --spacing-64: 64px;
  --spacing-120: 120px;
  --spacing-144: 144px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 24px;
  --element-gap: 12px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-2xl-2: 20px;
  --radius-3xl: 24px;
  --radius-3xl-2: 36px;
  --radius-3xl-3: 40px;
  --radius-full: 100px;

  /* Named Radii */
  --radius-tags: 100px;
  --radius-cards: 16px;
  --radius-icons: 4px;
  --radius-inputs: 4px;
  --radius-buttons: 36px;

  /* Surfaces */
  --surface-paper: #ffffff;
  --surface-mist: #f7f9fc;
  --surface-lavender-wash: #f1f2ff;
  --surface-tinted-feature-surfaces: #e7f4ed;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-ink: #1e2532;
  --color-carbon: #0f141e;
  --color-pencil: #656e83;
  --color-fog: #828ba2;
  --color-haze: #9fa6bb;
  --color-paper: #ffffff;
  --color-mist: #f7f9fc;
  --color-lavender-wash: #f1f2ff;
  --color-chalk: #d9deeb;
  --color-ash: #e7eaf4;
  --color-signal-blue: #1a91f0;
  --color-deep-signal: #016fd0;
  --color-iris: #5660e8;
  --color-midnight: #1a1c6a;
  --color-mint-whisper: #e7f4ed;
  --color-blush-whisper: #ffebe4;
  --color-rose-whisper: #edd7df;

  /* Typography */
  --font-tt-commons: 'TT Commons', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.43;
  --tracking-caption: 0.29px;
  --text-body: 16px;
  --leading-body: 1.25;
  --tracking-body: 0.336px;
  --text-subheading: 19px;
  --leading-subheading: 1.22;
  --tracking-subheading: 0.399px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.17;
  --tracking-heading-sm: 0.504px;
  --text-heading: 31px;
  --leading-heading: 1.14;
  --tracking-heading: 0.651px;
  --text-heading-lg: 40px;
  --leading-heading-lg: 1.07;
  --tracking-heading-lg: 0.84px;
  --text-display: 67px;
  --leading-display: 0.96;
  --tracking-display: 1.407px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-36: 36px;
  --spacing-40: 40px;
  --spacing-44: 44px;
  --spacing-48: 48px;
  --spacing-60: 60px;
  --spacing-64: 64px;
  --spacing-120: 120px;
  --spacing-144: 144px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-2xl-2: 20px;
  --radius-3xl: 24px;
  --radius-3xl-2: 36px;
  --radius-3xl-3: 40px;
  --radius-full: 100px;
}
```
