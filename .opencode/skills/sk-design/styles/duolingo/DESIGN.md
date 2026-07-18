# Duolingo — Style Reference
> Playful classroom mascot on white paper

**Theme:** light

Duolingo's interface treats the page like a children's storybook: white paper canvas, chubby rounded display type, and a single saturated green that reads as 'correct answer' the moment it appears. Body copy stays calm in mid-gray so the green and its accent blue can do all the emotional work — green for progress and headings, blue for interactive links and secondary actions. Components are pill-shaped or chunky-rounded with thick 2px borders in black or color, giving every button the feel of a sticker pressed onto the page rather than a flat UI control.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Eager Green | `#58cc02` | `--color-eager-green` | Green text accent for links, tags, and emphasized short phrases. Do not promote it to the primary CTA color |
| Storybook Green | `#d7ffb8` | `--color-storybook-green` | Soft highlight wash on light surfaces, subtle background tints behind footer navigation labels |
| Spark Blue | `#1cb0f6` | `--color-spark-blue` | Blue text accent for links, tags, and emphasized short phrases. Do not promote it to the primary CTA color |
| Fresh Leaf | `#a5ed6e` | `--color-fresh-leaf` | Green text accent for links, tags, and emphasized short phrases. Do not promote it to the primary CTA color |
| Night Ink | `#000437` | `--color-night-ink` | Violet text accent for links, tags, and emphasized short phrases. |
| Paper White | `#ffffff` | `--color-paper-white` | Page canvas, card surfaces, button text on green/dark fills |
| Charcoal | `#4b4b4b` | `--color-charcoal` | Hero headings and primary body copy — the workhorse dark text that lets colored headings stand out |
| Pencil Gray | `#777777` | `--color-pencil-gray` | Muted body paragraphs, secondary descriptive text — recedes so colored elements lead |
| Faded Gray | `#afafaf` | `--color-faded-gray` | Disabled or low-emphasis nav labels and button borders |

## Tokens — Typography

### feather — Display headlines for section titles like 'free. fun. effective.' and 'duolingo english test' — a custom rounded display face that gives the brand its toy-like, mascot-friendly voice. Substitute with 'Feather Bold' or 'Nunito Black' at matching weight. letter-spacing: -0.0200em · `--font-feather`
- **Weights:** 700
- **Sizes:** 48px, 64px
- **Line height:** 1.20
- **Letter spacing:** -0.0200em
- **Role:** Display headlines for section titles like 'free. fun. effective.' and 'duolingo english test' — a custom rounded display face that gives the brand its toy-like, mascot-friendly voice. Substitute with 'Feather Bold' or 'Nunito Black' at matching weight. letter-spacing: -0.0200em

### duolingo-sans — Body paragraphs and nav links at 17px/500 — a geometric sans that stays readable while letting weight 700 carry emphasis. Substitute with 'DIN Next', 'Inter', or 'Nunito Sans' · `--font-duolingo-sans`
- **Weights:** 500
- **Sizes:** 13px, 14px, 15px, 17px, 19px, 32px
- **Line height:** 1.15, 1.18, 1.20, 1.21, 1.23, 1.33, 1.40, 1.41, 1.47
- **Letter spacing:** normal
- **Role:** Body paragraphs and nav links at 17px/500 — a geometric sans that stays readable while letting weight 700 carry emphasis. Substitute with 'DIN Next', 'Inter', or 'Nunito Sans'

### duolingo-sans — All weight-700 uses: uppercase nav labels at 15px (ls 0.0530em), subheadings at 19px and 32px, link emphasis at 13px. Same family as body — the visual distinction is weight, not face change. letter-spacing: 0.0530em on uppercase nav · `--font-duolingo-sans`
- **Weights:** 700
- **Sizes:** 13px, 14px, 15px, 17px, 19px, 32px
- **Line height:** 1.23, 1.21, 1.33, 1.40, 1.20
- **Letter spacing:** 0.0530em
- **Role:** All weight-700 uses: uppercase nav labels at 15px (ls 0.0530em), subheadings at 19px and 32px, link emphasis at 13px. Same family as body — the visual distinction is weight, not face change. letter-spacing: 0.0530em on uppercase nav

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 13px | 1.23 | — | `--text-caption` |
| nav-label | 15px | 1.33 | 0.795px | `--text-nav-label` |
| body | 17px | 1.18 | — | `--text-body` |
| subheading | 19px | 1.4 | — | `--text-subheading` |
| heading-sm | 32px | 1.2 | — | `--text-heading-sm` |
| heading | 48px | 1.2 | -0.96px | `--text-heading` |
| display | 64px | 1.2 | -1.28px | `--text-display` |

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
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |
| 64 | 64px | `--spacing-64` |
| 80 | 80px | `--spacing-80` |
| 96 | 96px | `--spacing-96` |

### Border Radius

| Element | Value |
|---------|-------|
| links | 12px |
| buttons | 12px |
| nav-items | 12px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80-120px
- **Card padding:** 16-24px
- **Element gap:** 12px

## Components

### Primary CTA Button
**Role:** Filled green button for 'Get started' and top-of-page conversion

Fill #58cc02, white text, duolingo-sans 700 at 15px uppercase with 0.0530em tracking, 12px border-radius, 16px horizontal padding. No border — color alone carries the button. Sits directly on white canvas.

### Outlined Account Button
**Role:** Secondary CTA below primary on hero

Transparent fill, text in #1cb0f6, duolingo-sans 700 at 14px, 12px border-radius, 16px horizontal padding, 2px solid border in #afafaf. Pairs with the green CTA as a calm ghost alternative.

### Nav Language Pill
**Role:** Language selector in top header

Transparent fill, text in #777777 at 15px uppercase with 0.0530em tracking, 12px border-radius, 10px vertical and 16px horizontal padding, 2px solid border in #afafaf. Behaves like a sticker tag.

### Section Headline
**Role:** Display heading for marketing sections

feather 700 at 48-64px, line-height 1.2, letter-spacing -0.0200em, color #58cc02. The signature voice of the brand — large, rounded, unmistakably green.

### Hero Headline
**Role:** Opening page headline above CTA

duolingo-sans 700 at 32px, color #4b4b4b (Charcoal). Stays neutral so the green CTA below it carries the color weight.

### Body Paragraph
**Role:** Marketing body text in sections

duolingo-sans 500 at 17px, line-height 1.18, color #777777 (Pencil Gray). Mid-gray intentionally recedes so colored headlines dominate.

### Footer Background
**Role:** Full-width green band at bottom

#58cc02 fill, white and #d7ffb8 text labels, generous 48px vertical padding, contains language grid and site links. The colored surface that anchors the page.

### Footer Link Item
**Role:** Text links in footer nav

duolingo-sans at small sizes, color #a5ed6 (Fresh Leaf) for links, white for section headers. 8px margin between items, stacked vertically.

### Language Flag Pill
**Role:** Language selector in mid-page band

Circular flag emoji + language name in duolingo-sans 700 at 15px uppercase, inline arrangement with 10-12px gaps, no background fill.

### App Store Badge
**Role:** Download badge for mobile apps

Black rectangular badge with white icon and duolingo-sans text, 4b4b4b text color. Functions as a visual anchor on white sections.

### Section Feature Illustration
**Role:** Decorative mascot illustration beside text

Flat colored mascot characters placed in the right half of each section, no container or background. Illustrations carry the secondary palette (pink, purple, yellow, orange) while UI stays green/blue.

## Do's and Don'ts

### Do
- Use #58cc02 for any heading or CTA that needs to read as 'progress' or 'go' — it is the only saturated color allowed on large display text.
- Set display headlines at 48-64px in feather 700 with -0.0200em letter-spacing; this rounded weight is the brand voice.
- Give every button and pill a 12px border-radius and pair it with a 2px solid border in #afafaf or color — outlined buttons are first-class citizens, not a fallback.
- Reserve uppercase at 15px with 0.0530em tracking for nav labels and language pills; never apply it to body copy.
- Keep body text in #777777 at 17px/500 — mid-gray is the default so colored elements can lead.
- Use #1cb0f6 (Spark Blue) exclusively for interactive links and outlined secondary CTAs; it is the 'curious' companion to the green.
- Build sections as white-on-white with illustrations floating beside text; introduce #58cc02 only at the footer band and within display headings.

### Don't
- Don't put colored text in body paragraphs — body stays in #777777 or #4b4b4b so the green headlines own the page.
- Don't use sharp corners; even small tags and pills use 12px radius.
- Don't introduce gradients, shadows, or glass effects — Duolingo's surfaces are flat sticker-like fills with thick borders.
- Don't use feather at sizes below 48px; it is a display face only. Subheadings 19-32px use duolingo-sans 700.
- Don't place CTA buttons on colored backgrounds without testing contrast — green on green or blue on green will disappear.
- Don't apply the secondary palette (pink, purple, mascot illustration colors) to UI chrome; those colors live only inside character art.
- Don't stretch the green to small UI text; #58cc02 is for headings, CTA fills, and the footer band, not body or link text.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Paper White | `#ffffff` | Page canvas — every section sits on pure white |
| 1 | Storybook Green | `#d7ffb8` | Soft tint wash behind highlighted footer labels |
| 2 | Eager Green | `#58cc02` | Footer band and primary CTA fills — bold colored surface |
| 3 | Night Ink | `#000437` | Deep accent surface for emphasis text and dark CTAs |

## Imagery

Illustration-driven storybook language: flat 2D mascot characters (the owl Duo and diverse human figures) with rounded geometric shapes, bold black outlines, and a secondary palette of pink, purple, yellow, orange, and blue that never appears in the UI chrome itself. Illustrations sit beside text in the right half of each section on pure white, no containers or backgrounds. Photography is absent — the characters are the visual content. Iconography uses thick outlined strokes consistent with the mascot style. Image density is moderate: each section gets one large character illustration, leaving the rest of the page to typography and whitespace.

## Layout

Single-column full-width sections stacked vertically, each ~800-900px tall. Max content width ~1200px centered. Sections alternate text-left/illustration-right with generous vertical breathing room (80-120px between sections). No card grids or multi-column feature layouts — each section is a single text block paired with one illustration. Navigation is a minimal top bar with logo and language selector, reappearing as a sticky bar between sections. Footer is a full-bleed green band spanning the page width. The rhythm is editorial: headline, paragraph, CTA, illustration, repeat.

## Agent Prompt Guide

Quick Color Reference:
- text (heading): #58cc02
- text (body): #777777
- text (hero/heading dark): #4b4b4b
- background (page): #ffffff
- background (footer band): #58cc02
- border (outlined button): #afafaf
- accent (interactive link): #1cb0f6
- primary action: no distinct CTA color

Example Component Prompts:
No distinct primary action color was observed; use the extracted neutral button treatments instead of inventing a filled CTA color.
3. Section Headline: feather 700 at 48px, line-height 1.2, letter-spacing -0.0200em, color #58cc02. Used for 'free. fun. effective.' and similar section titles.
5. Body Paragraph: duolingo-sans 500 at 17px, line-height 1.18, color #777777, max-width ~480px to keep reading comfortable.

## Similar Brands

- **Headspace** — Same mascot-led illustration system with thick outlines and a single saturated accent color against white canvas
- **Babbel** — Light-mode language-learning landing pages with rounded display type and green as the primary CTA color
- **Khan Academy Kids** — Flat rounded mascots, playful rounded display headings, and bold sticker-style buttons with thick borders
- **Memrise** — Minimal white-canvas marketing pages with one dominant green and casual rounded display typography
- **ClassDojo** — Playful rounded mascot illustrations, thick outlined UI components, and bright single-accent CTAs on white backgrounds

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-eager-green: #58cc02;
  --color-storybook-green: #d7ffb8;
  --color-spark-blue: #1cb0f6;
  --color-fresh-leaf: #a5ed6e;
  --color-night-ink: #000437;
  --color-paper-white: #ffffff;
  --color-charcoal: #4b4b4b;
  --color-pencil-gray: #777777;
  --color-faded-gray: #afafaf;

  /* Typography — Font Families */
  --font-feather: 'feather', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-duolingo-sans: 'duolingo-sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 13px;
  --leading-caption: 1.23;
  --text-nav-label: 15px;
  --leading-nav-label: 1.33;
  --tracking-nav-label: 0.795px;
  --text-body: 17px;
  --leading-body: 1.18;
  --text-subheading: 19px;
  --leading-subheading: 1.4;
  --text-heading-sm: 32px;
  --leading-heading-sm: 1.2;
  --text-heading: 48px;
  --leading-heading: 1.2;
  --tracking-heading: -0.96px;
  --text-display: 64px;
  --leading-display: 1.2;
  --tracking-display: -1.28px;

  /* Typography — Weights */
  --font-weight-medium: 500;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-unit: 4px;
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

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80-120px;
  --card-padding: 16-24px;
  --element-gap: 12px;

  /* Border Radius */
  --radius-xl: 12px;

  /* Named Radii */
  --radius-links: 12px;
  --radius-buttons: 12px;
  --radius-nav-items: 12px;

  /* Surfaces */
  --surface-paper-white: #ffffff;
  --surface-storybook-green: #d7ffb8;
  --surface-eager-green: #58cc02;
  --surface-night-ink: #000437;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-eager-green: #58cc02;
  --color-storybook-green: #d7ffb8;
  --color-spark-blue: #1cb0f6;
  --color-fresh-leaf: #a5ed6e;
  --color-night-ink: #000437;
  --color-paper-white: #ffffff;
  --color-charcoal: #4b4b4b;
  --color-pencil-gray: #777777;
  --color-faded-gray: #afafaf;

  /* Typography */
  --font-feather: 'feather', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-duolingo-sans: 'duolingo-sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 13px;
  --leading-caption: 1.23;
  --text-nav-label: 15px;
  --leading-nav-label: 1.33;
  --tracking-nav-label: 0.795px;
  --text-body: 17px;
  --leading-body: 1.18;
  --text-subheading: 19px;
  --leading-subheading: 1.4;
  --text-heading-sm: 32px;
  --leading-heading-sm: 1.2;
  --text-heading: 48px;
  --leading-heading: 1.2;
  --tracking-heading: -0.96px;
  --text-display: 64px;
  --leading-display: 1.2;
  --tracking-display: -1.28px;

  /* Spacing */
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

  /* Border Radius */
  --radius-xl: 12px;
}
```
