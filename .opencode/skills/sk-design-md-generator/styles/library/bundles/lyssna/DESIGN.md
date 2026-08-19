# Lyssna — Style Reference
> botanical research journal — a quiet white page where one deep teal button glows beneath serif headlines and mint accent panels breathe like greenhouse glass.

**Theme:** light

Lyssna reads as a botanical research journal brought to life on screen: a near-white editorial canvas, a deeply saturated dark teal that anchors every action, and a single bright mint surface (#b9ffe8) that recurs as accent wash, pill background, and decorative envelope around product imagery. Typography carries the personality — a humanist serif (grenette) reserved exclusively for headlines at 46–60px, weight 400, giving the page a magazine-editorial authority, while the custom sans (mint) handles everything from 12px caption to 22px subheading with quiet consistency. The visual rhythm is open and breathable: centered hero, generous vertical gaps, then alternating white and tinted-mint sections with three-column feature steps. Decorative elements — participant name tags, conic rating rings, soft-pink and cream product cards — add warmth without ever competing with the dark teal action color. Nothing is loud; the teal button is the only thing on screen that pulses.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Deep Teal | `#006e75` | `--color-deep-teal` | Primary filled action buttons (Sign up, primary CTAs), active nav state, brand mark — the single chromatic command on every page |
| Ink | `#061d29` | `--color-ink` | Primary heading and body text — the dominant non-neutral color, carries 17:1 contrast on white, near-black with a cool cast |
| Midnight Teal | `#072626` | `--color-midnight-teal` | Alternate heading ink and dark surface text — sits beside Ink for inverse text on light tinted surfaces |
| Mist | `#425d6d` | `--color-mist` | Muted body text, outlined/secondary action borders, supporting links — the soft spoken gray-teal for secondary chrome |
| Hairline | `#e5e7eb` | `--color-hairline` | Hairline borders, card outlines, image strokes, divider lines — the universal neutral separator at ~7,700 uses |
| Paper | `#ffffff` | `--color-paper` | Page canvas, button text on teal, card surfaces, nav background — the dominant light surface |
| Cream | `#fffded` | `--color-cream` | Warm-tinted card surface and section wash — a barely-there yellow that softens white without competing with mint |
| Mint Glass | `#b9ffe8` | `--color-mint-glass` | Teal action color for filled buttons, selected navigation states, and focused conversion moments. |
| Bright Teal | `#0b978e` | `--color-bright-teal` | Mid-tone teal for hover states, link fills, and accent strokes — sits between the deep brand teal and the mint surface |
| Plum | `#4d0037` | `--color-plum` | Decorative accent for illustration, icon fills, and tinted card washes — provides a warm counterpoint to the cool teal system |
| Blossom | `#ffc3e6` | `--color-blossom` | Soft pink surface wash on product cards and decorative blocks — the third color in the tri-tone accent system (mint / cream / pink) |
| Ember Ring | `conic-gradient(rgb(255, 176, 164) 0deg, rgb(255, 73, 44) 0deg, rgb(255, 73, 44) 360deg)` | `--color-ember-ring` | Orange decorative accent for icons, marks, and small graphic details |

## Tokens — Typography

### grenette — Display and large headlines only — a custom humanist serif used at three distinct sizes, always weight 400, never bold. Its exclusive domain is the editorial hero and section openers; it never appears in body copy or UI chrome. Gives the site its magazine-research character. · `--font-grenette`
- **Substitute:** Source Serif 4
- **Weights:** 400
- **Sizes:** 22px, 46px, 60px
- **Line height:** 1.05–1.20
- **Role:** Display and large headlines only — a custom humanist serif used at three distinct sizes, always weight 400, never bold. Its exclusive domain is the editorial hero and section openers; it never appears in body copy or UI chrome. Gives the site its magazine-research character.

### mint — The workhorse sans for everything else — body, nav, buttons, subheadings, captions, icons. Weight 400 is default; weight 500 for emphasized UI labels and button text. 26px is its ceiling; beyond that, grenette takes over. · `--font-mint`
- **Substitute:** Inter
- **Weights:** 400, 500
- **Sizes:** 12px, 13px, 14px, 15px, 16px, 18px, 20px, 22px, 26px
- **Line height:** 1.22–1.50
- **Role:** The workhorse sans for everything else — body, nav, buttons, subheadings, captions, icons. Weight 400 is default; weight 500 for emphasized UI labels and button text. 26px is its ceiling; beyond that, grenette takes over.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.5 | — | `--text-caption` |
| body-sm | 14px | 1.5 | — | `--text-body-sm` |
| body | 16px | 1.5 | — | `--text-body` |
| body-lg | 18px | 1.5 | — | `--text-body-lg` |
| subheading | 20px | 1.25 | — | `--text-subheading` |
| heading-sm | 22px | 1.22 | — | `--text-heading-sm` |
| heading | 26px | 1.22 | — | `--text-heading` |
| heading-lg | 46px | 1.15 | — | `--text-heading-lg` |
| display | 60px | 1.05 | — | `--text-display` |

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
| 40 | 40px | `--spacing-40` |
| 44 | 44px | `--spacing-44` |
| 48 | 48px | `--spacing-48` |
| 52 | 52px | `--spacing-52` |
| 56 | 56px | `--spacing-56` |
| 64 | 64px | `--spacing-64` |
| 80 | 80px | `--spacing-80` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 9999px |
| cards | 24px |
| images | 8px |
| inputs | 8px |
| buttons | 8px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 64-80px
- **Card padding:** 24px
- **Element gap:** 8-16px

## Components

### Primary Teal Button
**Role:** Filled CTA — the only high-saturation action element on the page

Background #006e75, text #ffffff, font mint 500 at 16px, padding 12px 24px, border-radius 8px, no shadow. Single line of text. This is the pulse of the design — only one should exist per viewport.

### Outlined Secondary Button
**Role:** Secondary action paired with the teal primary

Transparent background, border 1px #425d6d, text #425d6d, font mint 500 at 16px, padding 12px 24px, border-radius 8px. Used for 'Book a demo' and 'Explore the platform' — always lighter than the primary.

### Ghost Nav Button
**Role:** Top navigation utility actions (Log in)

Transparent background, no border, text #061d29 at 16px mint 400, padding 8px 16px. The lightest interaction in the nav strip.

### Green Pill Badge
**Role:** Pill-shaped highlight badge next to the logo

Background #b9ffe8, text #061d29, font mint 500 at 12-13px, padding 4px 12px, border-radius 9999px. The brand's signature decorative element — a mint pill that signals freshness and approachability.

### Logo Lockup
**Role:** Wordmark in the top-left corner

Text 'Lyssna' in mint font 500 at ~22px in Deep Teal #006e75, followed by a small mint-green leaf/sprig icon. The leaf is the only decorative glyph in the brand mark.

### Centered Hero Block
**Role:** First-screen headline and dual CTA

Centered column on white, max-width ~720px. Display headline in grenette 400 at 46-60px in #061d29. Subtext in mint 400 at 18px in #061d29 or Mist. Two buttons side by side: teal primary + outlined secondary. Optional microcopy line below in mint 400 14px.

### Numbered Step Card
**Role:** Three-column 'How it works' block

Number in a small circle (mint 500, 14px, 1px #061d29 border, ~28px diameter). Title in mint 500 at 18-20px in #061d29. Body in mint 400 at 15-16px in Mist #425d6d. No card background — the image above carries the color. Gap 24px between columns.

### Product Feature Card
**Role:** Decorative product screenshot block within step cards

Background uses one of the accent tints — mint #b9ffe8, cream #fffded, blossom #ffc3e6, or a conic gradient. Inner UI mockup on white #ffffff with 8px radius. Card itself has 24px radius. No border, no shadow.

### Participant Name Tag
**Role:** Floating annotation with directional pointer

Small pill, background Plum #4d0037, text #ffffff at 13px mint 500, padding 6px 12px, border-radius 9999px. A short triangular tail points toward the annotated element in a photo or screenshot. Adds editorial annotation flavor.

### Trust Logo Strip
**Role:** Row of partner/client wordmarks

Horizontal row of 5-7 monochrome logos on white, evenly spaced, each logo rendered in #061d29 at native proportions. No borders, no cards. 'Trusted by…' caption above in mint 400 14px Mist.

### Section Header
**Role:** Centered section title with optional subtext

Headline in grenette 400 at 46px in #061d29, centered. Optional subtext in mint 400 18px Mist, max-width ~560px, centered. No decorative element above the headline — whitespace is the divider.

### Rating Badge Row
**Role:** Social proof line with stars and platform logos

Star row (5 red/coral stars) + '4.5/5 rating' in mint 500 14px #061d29 + small monochrome platform icons (G, App Store, etc.) spaced 12px apart. No background, sits as a single line.

## Do's and Don'ts

### Do
- Use grenette (Source Serif 4) weight 400 exclusively for headlines 46px and above — never bold the serif, its weight is its character.
- Use #006e75 filled buttons for the single primary action on each page — the teal button is the design's only pulse point.
- Use #b9ffe8 as a section or card accent surface — the mint wash is the brand's signature and should appear at least once per page.
- Separate elements with 1px #e5e7eb hairline borders and color contrast, never with drop shadows.
- Use 8px radius for buttons, inputs, and small UI; 24px radius for cards, images, and large product surfaces.
- Center all hero and section content — Lyssna's layout is symmetric and column-based, not asymmetric.
- Use the tri-tone accent system (mint #b9ffe8, cream #fffded, pink #ffc3e6) for product card backgrounds, rotating through the three colors.

### Don't
- Never use a drop shadow as a primary elevation technique — the design is flat with hairline borders only.
- Never bold the grenette serif — it is weight 400 only; emphasis comes from size, not weight.
- Never place more than one #006e75 filled button in the same viewport — the teal action must be singular and unambiguous.
- Never use a chromatic border on a card or image — borders are always #e5e7eb hairline or absent.
- Never use grenette for body copy, captions, or UI chrome — it is a display face only, reserved for 46px+ headlines.
- Never left-align hero or section headlines — Lyssna is a centered, editorial layout throughout.
- Never use pure black (#000000) — the design's darkest tone is #061d29, a cool near-black that softens the contrast.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas | `#ffffff` | Base page background — dominant surface |
| 1 | Cream Section | `#fffded` | Warm-tinted wash for alternating sections |
| 2 | Mint Section | `#b9ffe8` | Signature accent background — hero envelope, feature card surrounds, tag fills |
| 3 | Pink Card | `#ffc3e6` | Decorative product card surface — one of three accent washes |
| 4 | Card | `#ffffff` | Product screenshot cards, step content blocks — white on tinted background |

## Elevation

Lyssna deliberately avoids drop shadows as a design primitive. Separation between elements is achieved through flat color contrast (white card on mint surface, Ink text on white), 1px #e5e7eb hairline borders, and 24px corner radii. The result is a paper-like, print-editorial feel rather than a layered digital interface. When a shadow does appear (boxShadow on #ffffff in raw data), it is a single, near-invisible ambient lift — never a multi-layer Material-style stack.

## Imagery

Photography appears in floating product cards as soft, warm, lifestyle-oriented portraits of diverse people in natural-light settings — often cropped to a head-and-shoulders portrait with rounded corners (24px). The photos are not staged corporate headshots; they feel candid, varied in skin tone and setting. The dominant visual treatment is product UI screenshots rendered inside tinted pastel cards (mint, cream, pink), with the product UI itself in clean white. Conic gradient rings in coral/red serve as rating indicators. No illustration — everything is either photograph, product UI, or type. Icon style: line-based, 1.5px stroke, monochrome in Ink or Deep Teal, used sparingly (nav dropdowns, feature bullets, social proof icons).

## Layout

Lyssna is a centered, max-width 1200px layout on a white canvas. The hero is a single centered column (max-width ~720px) with serif headline + subtext + dual CTAs + social proof, no sidebar or split image. Below the hero, the page alternates between full-bleed white sections and mint-tinted bands, each section separated by 64–80px of vertical breathing room. Content arrangement is consistently centered — there are no asymmetric or left-aligned hero blocks. The three-column 'How it works' pattern is the page's signature grid, with 24px gaps between columns. The trust logo strip is a single horizontal row. Navigation is a minimal top bar: logo + 5 menu items centered, with login and sign-up actions flush right. No sidebar, no sticky header beyond the nav, no mega-menu. The rhythm is calm, vertical, and centered — closer to a long-form article than a product dashboard.

## Agent Prompt Guide

Quick Color Reference:
- text: #061d29
- background: #ffffff
- border: #e5e7eb
- accent surface: #b9ffe8
- primary action: #006e75 (filled action)
- secondary action border: #425d6d

Example Component Prompts:

1. Create a Primary Action Button: #006e75 background, #ffffff text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.

2. Three-column 'How it works' grid: 3 columns, 24px gap. Each column has a small numbered circle (28px, 1px #061d29 border, number in mint 500 14px), then a title in mint 500 20px #061d29, then body in mint 400 15px #425d6d. Above each column, a decorative product card with 24px radius, background #b9ffe8 (or #fffded or #ffc3e6, alternating), containing a white UI mockup with 8px radius.

3. Top navigation bar: height ~64px, white background, border-bottom 1px #e5e7eb. Left: 'Lyssna' wordmark in #006e75 mint 500 22px + mint leaf icon, then a #b9ffe8 pill badge ('Get paid to test') in mint 500 12px with 9999px radius. Center: 5 nav items in mint 400 16px #061d29. Right: ghost 'Log in' + teal 'Sign up' filled button (8px radius, #006e75, white text).

4. Trust logo strip: full-width white section. Centered caption 'Trusted by…' in mint 400 14px #425d6d. Below, a single row of 5-7 partner wordmarks evenly spaced, each rendered monochrome in #061d29 at native proportions. No borders, no cards, 40-48px vertical padding above and below.

5. Floating participant annotation tag: a 9999px-radius pill, background #4d0037, white text mint 500 13px, padding 6px 12px, with a small triangular tail pointing to an element in a 24px-radius photograph below. Positioned absolutely over a lifestyle photo with 24px radius corners.

## Similar Brands

- **Maze** — Same user-research product space with a clean centered-hero, mint-and-cream pastel card system, and serif-free modern typography — though Lyssna adds a distinct editorial serif headline.
- **Hotjar** — Shared research-tool aesthetic with a single bright accent color (Hotjar's orange, Lyssna's teal) on a white canvas, rounded product cards, and a soft warm humanist tone.
- **Typeform** — Both lead with a large centered hero headline, use generous whitespace, and deploy one saturated action color against an otherwise neutral palette — same 'approachable research' posture.
- **Notion** — Similar flat-design ethos with hairline borders instead of shadows, centered content, and a quiet neutral base that lets a single accent color do the work.
- **Substack** — Shared editorial sensibility — a serif display face for headlines, centered column layout, warm cream and soft accent surfaces, and an overall journal-like reading rhythm.

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-deep-teal: #006e75;
  --color-ink: #061d29;
  --color-midnight-teal: #072626;
  --color-mist: #425d6d;
  --color-hairline: #e5e7eb;
  --color-paper: #ffffff;
  --color-cream: #fffded;
  --color-mint-glass: #b9ffe8;
  --color-bright-teal: #0b978e;
  --color-plum: #4d0037;
  --color-blossom: #ffc3e6;
  --color-ember-ring: #ff492c;
  --gradient-ember-ring: conic-gradient(rgb(255, 176, 164) 0deg, rgb(255, 73, 44) 0deg, rgb(255, 73, 44) 360deg);

  /* Typography — Font Families */
  --font-grenette: 'grenette', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-mint: 'mint', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --text-body-sm: 14px;
  --leading-body-sm: 1.5;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-body-lg: 18px;
  --leading-body-lg: 1.5;
  --text-subheading: 20px;
  --leading-subheading: 1.25;
  --text-heading-sm: 22px;
  --leading-heading-sm: 1.22;
  --text-heading: 26px;
  --leading-heading: 1.22;
  --text-heading-lg: 46px;
  --leading-heading-lg: 1.15;
  --text-display: 60px;
  --leading-display: 1.05;

  /* Typography — Weights */
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
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-44: 44px;
  --spacing-48: 48px;
  --spacing-52: 52px;
  --spacing-56: 56px;
  --spacing-64: 64px;
  --spacing-80: 80px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 64-80px;
  --card-padding: 24px;
  --element-gap: 8-16px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-3xl: 24px;

  /* Named Radii */
  --radius-tags: 9999px;
  --radius-cards: 24px;
  --radius-images: 8px;
  --radius-inputs: 8px;
  --radius-buttons: 8px;

  /* Surfaces */
  --surface-canvas: #ffffff;
  --surface-cream-section: #fffded;
  --surface-mint-section: #b9ffe8;
  --surface-pink-card: #ffc3e6;
  --surface-card: #ffffff;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-deep-teal: #006e75;
  --color-ink: #061d29;
  --color-midnight-teal: #072626;
  --color-mist: #425d6d;
  --color-hairline: #e5e7eb;
  --color-paper: #ffffff;
  --color-cream: #fffded;
  --color-mint-glass: #b9ffe8;
  --color-bright-teal: #0b978e;
  --color-plum: #4d0037;
  --color-blossom: #ffc3e6;
  --color-ember-ring: #ff492c;

  /* Typography */
  --font-grenette: 'grenette', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-mint: 'mint', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --text-body-sm: 14px;
  --leading-body-sm: 1.5;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-body-lg: 18px;
  --leading-body-lg: 1.5;
  --text-subheading: 20px;
  --leading-subheading: 1.25;
  --text-heading-sm: 22px;
  --leading-heading-sm: 1.22;
  --text-heading: 26px;
  --leading-heading: 1.22;
  --text-heading-lg: 46px;
  --leading-heading-lg: 1.15;
  --text-display: 60px;
  --leading-display: 1.05;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-44: 44px;
  --spacing-48: 48px;
  --spacing-52: 52px;
  --spacing-56: 56px;
  --spacing-64: 64px;
  --spacing-80: 80px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-3xl: 24px;
}
```
