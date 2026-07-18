# Hugging Face — Style Reference
> Friendly ML workshop on white paper

**Theme:** light

Hugging Face operates as a friendly, utilitarian machine-learning workshop: nearly all-white canvas, hairline gray dividers, and compact, data-dense rows that feel like reading a spreadsheet. The brand voice arrives through a single warm yellow emoji logo (🤗) and one dark navy panel per page that acts as a stage for that mascot — everything else stays in grayscale so the yellow never has to compete. Typography is one workhorse humanist sans (Source Sans Pro) carrying the full hierarchy from 10px metadata to 96px display, with IBM Plex Mono punching in only for model names and technical labels. Components are flat, low-elevation, and rounded at a tight 8px — the interface reads more like a research tool than a marketing site, letting the 2M+ models and datasets be the visual content.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Paper White | `#ffffff` | `--color-paper-white` | Page background, card surfaces, input fields |
| Cloud Gray | `#f3f4f6` | `--color-cloud-gray` | Secondary surface, subtle card backgrounds, tag fills |
| Mist Border | `#e5e7eb` | `--color-mist-border` | Hairline dividers, card borders, input borders, the dominant structural line color |
| Fog Border | `#d1d5dc` | `--color-fog-border` | Slightly stronger dividers, placeholder text on inputs |
| Ink Black | `#000000` | `--color-ink-black` | Dark supporting neutral for text, icons, and strong contrast. Do not promote it to the primary CTA color |
| Midnight Panel | `#101828` | `--color-midnight-panel` | Dark hero panel background, dark navigation wells — the high-contrast stage for the mascot |
| Deep Night | `linear-gradient(to right bottom, #2c3344 0%, #0b0f19 100%)` | `--color-deep-night` | Deepest panel surface used in gradients and product UI previews; Hero panel and product preview gradient — subtle two-stop from slate to near-black |
| Slate Body | `#4a5565` | `--color-slate-body` | Supporting neutral for secondary UI, dividers, and muted labels. Do not promote it to the primary CTA color |
| Steel Caption | `#6a7282` | `--color-steel-caption` | Metadata, timestamps, helper text, nav links, muted icon fills |
| Ash Disabled | `#99a1af` | `--color-ash-disabled` | Tertiary text, inactive icons, disabled controls, the quietest neutral |
| Hugging Yellow | `#ffd210` | `--color-hugging-yellow` | The 🤗 emoji logo mark — the only warm color in the system, appears as a small brand stamp |
| Link Blue | `#155dfc` | `--color-link-blue` | Violet supporting accent for decorative details and low-frequency emphasis. Do not promote it to the primary CTA color |

## Tokens — Typography

### Source Sans Pro — The single workhorse family — handles every UI surface from 10px metadata to 96px display headlines. Weight 400 carries body and most UI; 600 takes section labels and button text; 700 is reserved for the largest headlines where the humanist letterforms need extra weight to hold the page. · `--font-source-sans-pro`
- **Substitute:** Inter, IBM Plex Sans, system-ui
- **Weights:** 400, 600, 700
- **Sizes:** 10, 12, 13, 14, 15, 16, 18, 20, 24, 30, 48, 60, 96
- **Line height:** 1.20–1.56 body, 1.00–1.25 display
- **Role:** The single workhorse family — handles every UI surface from 10px metadata to 96px display headlines. Weight 400 carries body and most UI; 600 takes section labels and button text; 700 is reserved for the largest headlines where the humanist letterforms need extra weight to hold the page.

### IBM Plex Mono — Technical identifiers — model names like moonshatai/Kimi-K2.5, dataset slugs, parameter values, repo paths. The monospace grid signals 'this is a machine-readable handle' and gives the interface a workshop feel. · `--font-ibm-plex-mono`
- **Substitute:** JetBrains Mono, IBM Plex Mono, ui-monospace
- **Weights:** 400
- **Sizes:** 15
- **Line height:** 1.60
- **Role:** Technical identifiers — model names like moonshatai/Kimi-K2.5, dataset slugs, parameter values, repo paths. The monospace grid signals 'this is a machine-readable handle' and gives the interface a workshop feel.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.4 | — | `--text-caption` |
| body | 14px | 1.5 | — | `--text-body` |
| body-md | 16px | 1.5 | — | `--text-body-md` |
| subheading | 18px | 1.4 | — | `--text-subheading` |
| heading-sm | 20px | 1.37 | — | `--text-heading-sm` |
| heading | 24px | 1.33 | — | `--text-heading` |
| heading-lg | 30px | 1.25 | — | `--text-heading-lg` |
| display | 48px | 1.2 | — | `--text-display` |
| display-lg | 60px | 1 | — | `--text-display-lg` |
| hero | 96px | 1 | — | `--text-hero` |

## Tokens — Spacing & Shapes

**Density:** compact

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 6 | 6px | `--spacing-6` |
| 8 | 8px | `--spacing-8` |
| 10 | 10px | `--spacing-10` |
| 12 | 12px | `--spacing-12` |
| 14 | 14px | `--spacing-14` |
| 16 | 16px | `--spacing-16` |
| 20 | 20px | `--spacing-20` |
| 24 | 24px | `--spacing-24` |
| 28 | 28px | `--spacing-28` |
| 32 | 32px | `--spacing-32` |
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |
| 73 | 73px | `--spacing-73` |
| 80 | 80px | `--spacing-80` |
| 112 | 112px | `--spacing-112` |

### Border Radius

| Element | Value |
|---------|-------|
| nav | 4px |
| tags | 4px |
| cards | 8px |
| inputs | 8px |
| buttons | 8px |
| pillButtons | 25.6px |
| largeContainers | 12px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| subtle | `rgba(0, 0, 0, 0.05) 0px 1px 2px 0px` | `--shadow-subtle` |
| subtle-2 | `rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.1) 0p...` | `--shadow-subtle-2` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 64px
- **Card padding:** 16px
- **Element gap:** 8px

## Components

### Midnight Hero Panel
**Role:** Primary hero block anchoring the top of the page

Dark gradient panel (#101828 → #0b0f19) with generous padding (~48px), the 🤗 emoji at ~60–80px, 48px weight 700 white headline, 16px Slate Body description, and a dark pill button. This is the one place the page gets loud — the rest of the site whispers.

### Dark CTA Button (Ink)
**Role:** Primary call-to-action on the dark hero

Solid Ink Black background (#000000), white text, 8px radius, ~10px 20px padding, 14px Source Sans Pro weight 600. Sits on the midnight panel so the contrast inverts — a black button on a near-black background reads as a recessed well.

### Ghost Secondary Button
**Role:** Companion action next to the primary CTA

Transparent background with white text and a thin white border at low opacity, same 8px radius and 14px weight 600. Labeled with a small 'or' divider between it and the primary.

### Sign Up Pill Button
**Role:** Account creation in the top nav

Black fill, white text, fully rounded ~25.6px radius (pill), 8px 16px padding, 14px weight 600. The pill shape distinguishes auth actions from inline controls.

### Top Navigation Bar
**Role:** Global header

White background, ~56px tall, left-aligned 🤗 logo + 'Hugging Face' wordmark in weight 700 16px, centered search input, right-aligned nav links in 14px Steel Caption with an active state in Link Blue (#155dfc). Sticky on scroll.

### Search Input
**Role:** Global model/dataset/user search

White fill, 1px Mist Border (#e5e7eb), 8px radius, ~10px 16px padding, 14px body placeholder in Steel Caption, left-aligned 🔍 icon. Wide — takes ~40% of header width.

### Trending Column Card
**Role:** One of three side-by-side cards in the 'Trending' row (Models, Spaces, Datasets)

White surface, 1px Mist Border, 8px radius, 16px padding, 18px weight 600 column header, then a vertical list of 5 entries. Each entry is a model name in IBM Plex Mono 15px weight 400 (Slate Body color), with a 12px Steel Caption metadata line below (relative time, download count, like count). No card shadow on the container — only the faintest hairline separates it from the canvas.

### Spaces Card (Gradient)
**Role:** Entry in the middle 'Spaces' column

Unlike the model/dataset cards, Spaces cards carry vivid color gradients (teal→green, red→pink, blue→indigo, purple→violet). 8px radius, 16px padding, white text, small 🔥 emoji + like count, and the space title in weight 600 14px white.

### Stat List Item
**Role:** Row inside a trending column

Two-line stack: model/dataset name in IBM Plex Mono 15px, metadata line in 12px Steel Caption showing relative time, download icon + count, and heart icon + count. 12px vertical gap between rows, no row dividers — whitespace does the separation.

### Browse Link Button
**Role:** Footer action under each trending column

Centered, 14px Link Blue, plain text with underline-on-hover, no background. Sits ~24px below the last list item.

### Logo Wordmark
**Role:** Brand mark in nav and footer

🤗 emoji at ~24px next to 'Hugging Face' in Source Sans Pro weight 700 16px Ink Black. The emoji is the brand — the wordmark is the caption.

### Dark Product Preview Card
**Role:** Screenshot-style product UI shown beside the hero copy

A ~560px wide floating panel with the same midnight gradient, 12px radius, faint shadow, containing a mock filter sidebar and model list. This is the only place shadows and larger radii appear — it acts as a 'window' into the product.

### Filter Sidebar
**Role:** Left column in the product preview

Dark surface with section headers in 12px uppercase Steel Caption, checkbox/filter rows in 14px white, tag chips with colored emoji prefixes (🐍 PyTorch, 🌊 TensorFlow, ⚡ JAX). Tag chips are 4px radius, 6px 10px padding, dark fill with white text.

## Do's and Don'ts

### Do
- Use Source Sans Pro weight 400 for all body and list text; reserve weight 700 for the largest headlines and weight 600 for button labels and section headers.
- Set cards and inputs to 8px radius and tags/small chips to 4px radius; only auth pills get the 25.6px full-round.
- Keep the page on #ffffff canvas with #e5e7eb hairline borders — let the single midnight hero panel be the only dark surface on the page.
- Use IBM Plex Mono 15px for any model name, dataset slug, repo path, or technical identifier — the monospace grid signals 'this is a handle, not prose'.
- Reference the 🤗 emoji as the brand mark; it is the only warm color allowed in the system and should stay small (16–80px).
- Apply 2px vertical padding for tight metadata rows and 8px row gaps inside lists to keep the data-dense spreadsheet feel.
- Use Link Blue (#155dfc) sparingly — active nav state, focused link, and a single accent per view. Never as a fill.

### Don't
- Don't introduce additional brand colors or gradient backgrounds on white sections — the gradient Spaces cards are the only exception, and only in the trending column.
- Don't stack shadows deeper than a single 1px-y layer; the design rejects heavy elevation.
- Don't use Source Sans Pro below 10px or above 96px; the scale is the scale.
- Don't round buttons to 8px and pills to 25.6px in the same row — the radius difference carries semantic meaning (control vs action).
- Don't apply the midnight gradient (#101828) to anything other than the hero panel and product preview — the rest of the page is white.
- Don't use the yellow logo color (#ffd21e) as a fill for buttons, backgrounds, or text — it lives only in the emoji.
- Don't use 0px or 6px letter-spacing on display sizes; Source Sans Pro's humanist forms need their default tracking at large sizes.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Page Canvas | `#ffffff` | Default page background, all content sits directly on white |
| 2 | Soft Surface | `#f3f4f6` | Subtle background tone for tags, code blocks, secondary card wells |
| 3 | Midnight Panel | `#101828` | Dark hero block and product preview surfaces — creates the dark/light yin-yang |

## Elevation

- **Card:** `rgba(0, 0, 0, 0.05) 0px 1px 2px 0px`
- **Button, Link:** `rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.1) 0px 1px 2px -1px`

## Imagery

Imagery is minimal and utilitarian. The 🤗 emoji is the primary visual asset — used at logo size (24px) and as a large brand stamp (60–80px) inside the dark hero. The only product 'imagery' is a screenshot-style dark UI panel showing filters and model lists, which functions as proof-of-product rather than lifestyle photography. No human photography, no abstract illustrations, no decorative graphics. The 2M+ models and datasets ARE the visual content — each row in the trending columns carries a tiny color emoji (🐍, 🌊, 🔥, etc.) that acts as the only chromatic punctuation.

## Layout

Centered max-width ~1200px container with generous horizontal padding. Hero is an asymmetric two-column split: dark midnight panel on the left (~55%) carrying the headline and CTAs, floating product preview card on the right (~45%) with a slight negative offset. Below the hero, a clean 3-column equal-width grid for Models/Spaces/Datasets, then a centered single-column 'The Home of Machine Learning' closer with a book emoji. Vertical rhythm is built from 64px section gaps and consistent 8px element gaps. Navigation is a single sticky top bar — no sidebar, no mega-menu, no footer in the main view.

## Agent Prompt Guide

## Quick Color Reference
- text: #000000 (primary), #4a5565 (body), #6a7282 (caption), #99a1af (disabled)
- background: #ffffff (page), #f3f4f6 (soft surface), #101828 (midnight panel)
- border: #e5e7eb (hairline), #d1d5dc (stronger)
- accent: #155dfc (link blue, active states)
- primary action: no distinct CTA color
- brand mark: #ffd210 🤗 emoji only

## 3-5 Example Component Prompts

1. **Trending Column Card**: 3-column grid, each card is white with 1px #e5e7eb border, 8px radius, 16px padding. Column header at 18px Source Sans Pro weight 600 #000000. 5 list items, each with model name in IBM Plex Mono 15px #4a5565 and metadata in 12px #6a7282. 24px gap between cards.

No distinct primary action color was observed; use the extracted neutral button treatments instead of inventing a filled CTA color.

3. **Search Input**: 400px wide, 1px #e5e7eb border, 8px radius, 10px 16px padding, 14px Source Sans Pro weight 400. Placeholder 'Search models, datasets, users…' in #6a7282. Left 🔍 icon in #99a1af.

4. **Spaces Gradient Card**: One in the middle column of the trending grid. 8px radius, 16px padding, teal-to-green gradient background (#0d9488 → #65a30d), white text. Title in 14px Source Sans Pro weight 600, 🔥 emoji + like count in 12px.

5. **Top Navigation Bar**: 56px tall, white background, left 🤗 + 'Hugging Face' wordmark (16px weight 700 #000000), centered search input (see above), right-aligned nav links at 14px #6a7282 with active 'Spaces' in #155dfc. Sign Up pill at far right: #000000 fill, white text, 25.6px radius, 8px 16px padding.

## Similar Brands

- **GitHub** — Same utilitarian data-dense list pattern with monospace identifiers, hairline gray borders, and one dark accent (the GitHub dark mode) contrasting a white canvas
- **npm** — Identical ingredient-list aesthetic — white canvas, 8px-radius cards, package names in monospace, copy-paste install commands, zero decorative imagery
- **Replicate** — AI/ML platform using the same single-mascot hero strategy with a dark product panel floating beside white headline copy
- **Vercel** — Minimal black-on-white typography hierarchy with one dark inverted surface for the hero and the rest of the page left to typography and whitespace
- **Papers with Code** — Research-platform list density with the same compact 2px vertical padding rhythm and monochrome-with-one-accent color discipline

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-paper-white: #ffffff;
  --color-cloud-gray: #f3f4f6;
  --color-mist-border: #e5e7eb;
  --color-fog-border: #d1d5dc;
  --color-ink-black: #000000;
  --color-midnight-panel: #101828;
  --color-deep-night: #0b0f19;
  --gradient-deep-night: linear-gradient(to right bottom, #2c3344 0%, #0b0f19 100%);
  --color-slate-body: #4a5565;
  --color-steel-caption: #6a7282;
  --color-ash-disabled: #99a1af;
  --color-hugging-yellow: #ffd210;
  --color-link-blue: #155dfc;

  /* Typography — Font Families */
  --font-source-sans-pro: 'Source Sans Pro', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-ibm-plex-mono: 'IBM Plex Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.4;
  --text-body: 14px;
  --leading-body: 1.5;
  --text-body-md: 16px;
  --leading-body-md: 1.5;
  --text-subheading: 18px;
  --leading-subheading: 1.4;
  --text-heading-sm: 20px;
  --leading-heading-sm: 1.37;
  --text-heading: 24px;
  --leading-heading: 1.33;
  --text-heading-lg: 30px;
  --leading-heading-lg: 1.25;
  --text-display: 48px;
  --leading-display: 1.2;
  --text-display-lg: 60px;
  --leading-display-lg: 1;
  --text-hero: 96px;
  --leading-hero: 1;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-6: 6px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-14: 14px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-28: 28px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-73: 73px;
  --spacing-80: 80px;
  --spacing-112: 112px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 64px;
  --card-padding: 16px;
  --element-gap: 8px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-3xl: 25.6px;
  --radius-3xl-2: 32px;

  /* Named Radii */
  --radius-nav: 4px;
  --radius-tags: 4px;
  --radius-cards: 8px;
  --radius-inputs: 8px;
  --radius-buttons: 8px;
  --radius-pillbuttons: 25.6px;
  --radius-largecontainers: 12px;

  /* Shadows */
  --shadow-subtle: rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;
  --shadow-subtle-2: rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.1) 0px 1px 2px -1px;

  /* Surfaces */
  --surface-page-canvas: #ffffff;
  --surface-soft-surface: #f3f4f6;
  --surface-midnight-panel: #101828;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-paper-white: #ffffff;
  --color-cloud-gray: #f3f4f6;
  --color-mist-border: #e5e7eb;
  --color-fog-border: #d1d5dc;
  --color-ink-black: #000000;
  --color-midnight-panel: #101828;
  --color-deep-night: #0b0f19;
  --color-slate-body: #4a5565;
  --color-steel-caption: #6a7282;
  --color-ash-disabled: #99a1af;
  --color-hugging-yellow: #ffd210;
  --color-link-blue: #155dfc;

  /* Typography */
  --font-source-sans-pro: 'Source Sans Pro', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-ibm-plex-mono: 'IBM Plex Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.4;
  --text-body: 14px;
  --leading-body: 1.5;
  --text-body-md: 16px;
  --leading-body-md: 1.5;
  --text-subheading: 18px;
  --leading-subheading: 1.4;
  --text-heading-sm: 20px;
  --leading-heading-sm: 1.37;
  --text-heading: 24px;
  --leading-heading: 1.33;
  --text-heading-lg: 30px;
  --leading-heading-lg: 1.25;
  --text-display: 48px;
  --leading-display: 1.2;
  --text-display-lg: 60px;
  --leading-display-lg: 1;
  --text-hero: 96px;
  --leading-hero: 1;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-6: 6px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-14: 14px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-28: 28px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-73: 73px;
  --spacing-80: 80px;
  --spacing-112: 112px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-3xl: 25.6px;
  --radius-3xl-2: 32px;

  /* Shadows */
  --shadow-subtle: rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;
  --shadow-subtle-2: rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.1) 0px 1px 2px -1px;
}
```
