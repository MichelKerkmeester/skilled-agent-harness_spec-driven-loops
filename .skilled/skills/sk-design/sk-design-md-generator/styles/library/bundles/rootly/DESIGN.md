# Rootly — Style Reference
> violet signal over alpine dawn — thin whisper-type on near-white, with one vivid violet accent rising into a luminous gradient sky

**Theme:** light

Rootly is a near-monochrome system with a single violet pulse running through it. The canvas is a barely-tinted off-white (#fbfaff) sitting under crisp white cards, with the near-black #100f12 doing almost all of the structural heavy-lifting — borders, text, filled CTAs. Violet (#8d6fde) and its lavender washes (#ebe5ff, #d9cffa) appear as small functional accents, never as decorative floods. Typography is the most opinionated choice: the custom Ppmori at weight 200 renders headlines as whisper-thin glyphs that feel almost handwritten, while body and UI lock to weight 500. Every interactive element is a full pill (1440px radius) — buttons, inputs, nav links, tags — sitting next to gently rounded cards (~17px). The hero is the one place the system breaks its own restraint: a dramatic violet-to-rose gradient over mountain photography that reads like dawn breaking above a cloud line. Everything else stays calm, high-contrast, and quiet.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Ink | `#100f12` | `--color-ink` | Primary text, dominant borders, filled CTA buttons, badge borders. Near-black with a barely-perceptible violet undertone that makes it warmer than pure black against the lavender-tinted canvas |
| Snow | `#fbfaff` | `--color-snow` | Page canvas and outer backgrounds. A whisper of violet lifts it above pure white so it harmonizes with the brand washes |
| Paper | `#ffffff` | `--color-paper` | Card surfaces, elevated panels, secondary button fills. Pure white stacked on Snow creates depth without shadows |
| Graphite | `#44434e` | `--color-graphite` | Mid-weight borders and dividers, secondary text emphasis. Sits between Ink and the body grays for hierarchy layers |
| Slate | `#65646e` | `--color-slate` | Body text, helper copy, subdued labels. Neutral mid-gray that keeps copy readable without competing with headings |
| Mist | `#787685` | `--color-mist` | Lighter borders, muted text, form-field outlines. Carries the cool-violet cast that ties the gray scale to the brand washes |
| Lavender Wash | `#ebe5ff` | `--color-lavender-wash` | Soft highlight surfaces, tag fills, muted card backgrounds. The brand's pastel floor — used when a surface needs warmth without saturation |
| Lilac Edge | `#d9cffa` | `--color-lilac-edge` | Input borders, tag outlines, decorative hairlines. A mid-violet that reads as a line, not a fill — the border counterpart to the brand accent |
| Iris | `#8d6fde` | `--color-iris` | Brand accent — outlined actions, decorative borders, highlight strokes, iconography. Vivid enough to claim attention but used in thin strokes, not large fills, so it punctuates rather than floods |
| Amethyst | `#4a3e8a` | `--color-amethyst` | Violet accent for outlined action borders, linked labels, and lightweight interactive emphasis. |
| Dawn Viol | `linear-gradient(112deg, rgb(119, 72, 246), rgb(245, 187, 195) 80%)` | `--color-dawn-viol` | Gradient stop — hero sky anchor. The saturated violet that opens the morning gradient |
| Rose Drift | `#f5bbc3` | `--color-rose-drift` | Gradient stop — hero sky terminus. Warm rose that softens the violet into dawn warmth |

## Tokens — Typography

### Ppmori — Single custom typeface driving the entire voice. Weight 200 at 52px for display creates the signature whisper-headline — anti-convention in a category that defaults to 600-700 hero type. Weight 500 carries all body, UI, and navigation copy. Weight 600 is reserved for active nav items and emphasized labels. The narrow weight gap between 200 and 500 means headings don't shout — they hover. · `--font-ppmori`
- **Substitute:** Inter (200, 500, 600) — closest free match for the narrow weights and geometric proportions. As fallback: 'Söhne' alternatives or Untitled Sans.
- **Weights:** 200, 500, 600
- **Sizes:** 10px, 12px, 14px, 16px, 17px, 31px, 52px
- **Line height:** 1.00, 1.03, 1.20, 1.30, 1.40, 1.43, 1.45, 1.46
- **Letter spacing:** -0.015em at 52px, -0.013em at 31px, -0.010em at 17px, -0.009em at 10-14px
- **OpenType features:** `Default lining figures; no tabular numerals observed`
- **Role:** Single custom typeface driving the entire voice. Weight 200 at 52px for display creates the signature whisper-headline — anti-convention in a category that defaults to 600-700 hero type. Weight 500 carries all body, UI, and navigation copy. Weight 600 is reserved for active nav items and emphasized labels. The narrow weight gap between 200 and 500 means headings don't shout — they hover.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 10px | 1.2 | -0.09px | `--text-caption` |
| body | 14px | 1.43 | -0.126px | `--text-body` |
| heading | 31px | 1.3 | -0.403px | `--text-heading` |
| display | 52px | 1.03 | -0.78px | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 5 | 5px | `--spacing-5` |
| 7 | 7px | `--spacing-7` |
| 8 | 8px | `--spacing-8` |
| 9 | 9px | `--spacing-9` |
| 10 | 10px | `--spacing-10` |
| 11 | 11px | `--spacing-11` |
| 14 | 14px | `--spacing-14` |
| 16 | 16px | `--spacing-16` |
| 17 | 17px | `--spacing-17` |
| 21 | 21px | `--spacing-21` |
| 28 | 28px | `--spacing-28` |
| 35 | 35px | `--spacing-35` |
| 42 | 42px | `--spacing-42` |
| 62 | 62px | `--spacing-62` |
| 69 | 69px | `--spacing-69` |
| 114 | 114px | `--spacing-114` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 1440px (full pill) |
| cards | 17.3px |
| inputs | 1440px (full pill) |
| buttons | 1440px (full pill) |
| navLinks | 1440px (full pill) |
| largeCards | 34.6px |
| smallElements | 6.92px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 64-96px
- **Card padding:** 21-28px
- **Element gap:** 7-14px

## Components

### Filled CTA Button
**Role:** Primary action — the only fully-filled button in the system

Pill shape (1440px radius). Background #100f12, text #ffffff, 14-16px Ppmori weight 500, letter-spacing -0.01em. Padding 9px 21px or 14px 21px depending on size. No shadow, no border — the dark fill on near-white canvas does the work.

### Ghost Secondary Button
**Role:** Low-emphasis paired action next to a filled CTA

Pill shape (1440px radius). Transparent background, text #100f12, 14px weight 500. Padding 9px 21px. Appears beside the filled CTA as 'Get started for free' sits beside 'Book a demo'.

### Outlined Brand Action
**Role:** Violet-bordered action for brand-tinted secondary CTAs

Pill shape. 1.5px border in #8d6fde, transparent background, text #8d6fde, 14px weight 500. Padding 14px 28px. Pressed state darkens border to #4a3e8a.

### Top Nav Link
**Role:** Primary navigation items with dropdown carets

Pill shape (1440px radius). Background transparent by default, #ebe5ff on hover. Text #100f12 at 14px weight 500, paired with a 12px chevron. Active page state uses weight 600.

### Top Nav Login Button
**Role:** Sign-in link in the top-right utility area

Ghost style: transparent background, 1px border #ffffff, text #100f12, 14px weight 500, 1440px radius, padding 7px 14px. Pressed fills with #ebe5ff.

### Section Label Pill
**Role:** Small uppercase or topic tag above a section headline

Pill shape. Background #ebe5ff, text #4a3e8a at 10-12px weight 500, padding 3px 10px. Reads as a quiet brand marker, not a badge.

### Feature Card
**Role:** Standard content card for feature grids and product callouts

17.3px radius. Background #ffffff, 1px border in #ebe5ff or transparent. Padding 28px. Headline at 31px weight 200, body at 14-16px weight 500 in #65646e. Optional small illustration or icon in #8d6fde at top.

### Logo Cloud Card
**Role:** Customer logo strip inside the hero

Borderless grid of customer logos on transparent background, rendered in #100f12 at 40-60% opacity. Two rows of 6-8 logos, evenly distributed across the hero width with 21px row gaps.

### Status Badge
**Role:** Small status indicators on incident cards and UI elements

Pill shape. 1px border in semantic color, text in matching darker shade at 12px weight 500, padding 3px 7px. Green for resolved, amber for in-progress, red for active — though the system shows green (#16a34a-ish), red (#dc2626-ish), and blue (#2563eb-ish) tints within UI screenshots.

### Pill Input Field
**Role:** Text inputs across forms and search

1440px radius. Background #ffffff, 1px border in #d9cffa, text #100f12 at 14px weight 500, placeholder in #787685. Padding 9px 17px. Focus state thickens border to 1.5px and shifts to #8d6fde.

### Hero Gradient Banner
**Role:** Full-bleed hero background with mountain photography overlay

112° gradient from #7748f6 to #f5bbc3 covering 80% of the width, composited with a desaturated mountain photograph on the right. Hero text sits in #ffffff at 52px weight 200, centered-left, with subtext at 16px weight 500 in #ffffff at 80% opacity.

### Incident Card (Product UI)
**Role:** Floating artifact showing product UI in the hero composition

17.3px radius. White background, 1px border #ebe5ff. Contains a 16px weight 600 channel name, 14px body, and a row of status badges in pill format. Floating offset to the lower-left of the hero.

### Phone Mockup (Product UI)
**Role:** Dark-themed phone artifact showing mobile UI

Dark surface #100f12 with rounded corners (~35px), 1px #44434 border. White text at 14px weight 500, green status dot, and a 'You're on-call' label at the top. Floats to the right of the hero.

### Calendar Grid (Product UI)
**Role:** Wide horizontal artifact showing the scheduling UI

White card with 17.3px radius. Day-of-week header, time-slot rows on the left, and color-tinted event blocks (lavender, blue, rose, amber) representing different on-call shifts. Sits at the bottom of the hero composition.

## Do's and Don'ts

### Do
- Use Ppmori weight 200 at 52px for all display headlines — the whisper-weight is the brand's voice, replacing it with bold destroys the system's identity.
- Set all interactive elements (buttons, inputs, tags, nav links) to 1440px border-radius — full pills are non-negotiable across the system.
- Stack surfaces using the four-level hierarchy: Snow canvas → Paper cards → Wash highlights → Edge borders. Do not introduce new surface colors.
- Use #100f12 for filled primary CTAs and dominant borders. Violet is for outlines and accents only — never as a large filled surface.
- Keep letter-spacing tight: -0.015em at display, -0.009em at body. Wider tracking breaks the type's geometric tension.
- Reserve gradients for hero compositions only. The rest of the system stays flat and monochromatic.
- Use 1px borders in #ebe5ff or #d9cffa to define cards — not shadows. Elevation is a product-artifact-only move.

### Don't
- Do not use weight 400, 700, or 800 in Ppmori — the system only has three weights (200, 500, 600) and the gaps are intentional.
- Do not fill large surfaces with #8d6fde. The violet is an outline/edge color; flooding it reads as a different brand.
- Do not use sharp corners on cards below 34.6px radius. Anything between 0-6px feels like a different design system.
- Do not apply letter-spacing greater than -0.005em at any size — positive tracking at body sizes breaks the geometric compactness.
- Do not place drop shadows on flat UI elements (cards, inputs, nav). Shadows belong only to floating product artifacts.
- Do not introduce secondary brand colors. The palette is two-tone (ink + violet) by design — adding teal, coral, or green as accents fragments the system.
- Do not center long-form body copy. Headlines can be center-aligned, but body paragraphs should sit left-aligned at 14-16px in #65646e.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas | `#fbfaff` | Page background, hero backdrop, outermost wrapper |
| 1 | Card | `#ffffff` | Product UI panels, feature cards, nav surfaces, content blocks |
| 2 | Wash | `#ebe5ff` | Highlighted cards, tag fills, soft callout backgrounds |
| 3 | Edge | `#d9cffa` | Input borders, outlined tag surfaces, decorative hairlines |
| 4 | Reverse | `#100f12` | Dark mode surfaces — phone mockup UI, filled CTA buttons, dark card variants |

## Elevation

- **Hero product screenshot:** `0 24px 64px rgba(16, 15, 18, 0.12), 0 4px 12px rgba(16, 15, 18, 0.06)`
- **Floating incident card:** `0 16px 40px rgba(16, 15, 18, 0.10), 0 2px 8px rgba(16, 15, 18, 0.05)`
- **Phone mockup:** `0 32px 80px rgba(16, 15, 18, 0.15), 0 8px 24px rgba(16, 15, 18, 0.08)`

## Imagery

Photography is used as a single atmospheric gesture — the hero mountain landscape is desaturated to near-monochrome and overlaid with the violet-to-rose gradient, so the image reads as color rather than place. No lifestyle photography, no product photography, no team shots. The rest of the visual storytelling happens through product UI artifacts (calendar grid, incident card, phone mockup) that are framed as flat screenshots floating over the page — not as marketing renders. Icons appear as 1.5px outlined strokes in #100f12, occasionally recolored to #8d6fde for accent contexts. No filled iconography, no duotone illustrations, no decorative abstract graphics. The system is 90% typography and product UI, with photography as a rare horizon.

## Layout

Max-width 1200px centered content with full-bleed hero and section bands. The hero is a full-viewport-height composition: gradient + mountain photo on the right, centered headline and subtext on the left, logo cloud below in two rows, and three product UI artifacts (calendar, incident card, phone) overlapping the lower third as a layered collage. Below the hero, sections alternate between white-card-on-Snow and pure-Snow bands with 64-96px vertical gaps. Feature sections follow a 2-column text-left/image-right pattern. Nav is a sticky top bar with logo left, centered nav links (each in a pill), and Login + filled CTA on the right. No sidebar, no mega-menu, no footer complexity — the system stays linear and tall.

## Agent Prompt Guide

primary action: #100f12 (filled action)
Create a Primary Action Button: #100f12 background, #ffffff text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.
**Quick Color Reference**
- text: #100f12 (primary), #65646e (body), #787685 (muted)
- background: #fbfaff (canvas), #ffffff (cards), #ebe5ff (wash)
- border: #ebe5ff (subtle), #d9cffa (input), #100f12 (structural)
- accent: #8d6fde (brand violet), #4a3e8a (pressed)
- filled CTA: #100f12 background, #ffffff text, 1440px radius
- gradient (hero only): linear-gradient(112deg, #7748f6, #f5bbc3 80%)

**3-5 Example Component Prompts**

1. **Hero headline block**: Full-bleed background — linear-gradient(112deg, #7748f6 0%, #f5bbc3 80%) with a desaturated mountain photo at 40% opacity positioned right. Centered headline at 52px Ppmori weight 200, #ffffff, letter-spacing -0.78px. Subtext at 16px weight 500, #ffffff at 85% opacity, max-width 560px.


3. **Feature card**: 17.3px radius, #ffffff background, 1px border #ebe5ff, padding 28px. Icon in #8d6fde at 24px. Headline at 31px Ppmori weight 200, #100f12, letter-spacing -0.40px. Body at 14px weight 500, #65646e.

4. **Pill input field**: 1440px radius, #ffffff background, 1px border #d9cffa, padding 9px 17px. Placeholder text 'Search incidents…' in #787685 at 14px weight 500. Focus state: border becomes 1.5px #8d6fde.

5. **Section label pill + heading**: Small pill tag — #ebe5ff background, #4a3e8a text at 12px weight 500, 1440px radius, padding 3px 10px, sitting 14px above a 52px Ppmori weight 200 headline in #100f12.

## Similar Brands

- **Linear** — Same monochrome-light canvas with a single vivid accent (violet there, violet here), ultra-thin display type, and pill-shaped UI controls. Both treat the interface as a quiet operating system for power users.
- **Vercel** — Near-white canvas, weight-200 display type with tight tracking, and the same compositional instinct of floating product artifacts over a hero gradient. Both systems feel like developer infrastructure that happens to be beautiful.
- **Resend** — Devtool brand with a single saturated accent, pill buttons, and the same restraint of letting product UI screenshots do the storytelling. Both use a mountain/landscape hero gradient as the one moment of color saturation.
- **Stripe** — Pill buttons, gradient hero photography, and the discipline of monochrome with one accent. Stripe's documentation site uses the same max-width-centered, section-band rhythm.

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-ink: #100f12;
  --color-snow: #fbfaff;
  --color-paper: #ffffff;
  --color-graphite: #44434e;
  --color-slate: #65646e;
  --color-mist: #787685;
  --color-lavender-wash: #ebe5ff;
  --color-lilac-edge: #d9cffa;
  --color-iris: #8d6fde;
  --color-amethyst: #4a3e8a;
  --color-dawn-viol: #7748f6;
  --gradient-dawn-viol: linear-gradient(112deg, rgb(119, 72, 246), rgb(245, 187, 195) 80%);
  --color-rose-drift: #f5bbc3;

  /* Typography — Font Families */
  --font-ppmori: 'Ppmori', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.2;
  --tracking-caption: -0.09px;
  --text-body: 14px;
  --leading-body: 1.43;
  --tracking-body: -0.126px;
  --text-heading: 31px;
  --leading-heading: 1.3;
  --tracking-heading: -0.403px;
  --text-display: 52px;
  --leading-display: 1.03;
  --tracking-display: -0.78px;

  /* Typography — Weights */
  --font-weight-extralight: 200;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-5: 5px;
  --spacing-7: 7px;
  --spacing-8: 8px;
  --spacing-9: 9px;
  --spacing-10: 10px;
  --spacing-11: 11px;
  --spacing-14: 14px;
  --spacing-16: 16px;
  --spacing-17: 17px;
  --spacing-21: 21px;
  --spacing-28: 28px;
  --spacing-35: 35px;
  --spacing-42: 42px;
  --spacing-62: 62px;
  --spacing-69: 69px;
  --spacing-114: 114px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 64-96px;
  --card-padding: 21-28px;
  --element-gap: 7-14px;

  /* Border Radius */
  --radius-md: 6.92px;
  --radius-xl: 13.84px;
  --radius-2xl: 17.3px;
  --radius-2xl-2: 20.76px;
  --radius-3xl: 27.68px;
  --radius-3xl-2: 34.6px;
  --radius-full: 1440px;

  /* Named Radii */
  --radius-tags: 1440px (full pill);
  --radius-cards: 17.3px;
  --radius-inputs: 1440px (full pill);
  --radius-buttons: 1440px (full pill);
  --radius-navlinks: 1440px (full pill);
  --radius-largecards: 34.6px;
  --radius-smallelements: 6.92px;

  /* Surfaces */
  --surface-canvas: #fbfaff;
  --surface-card: #ffffff;
  --surface-wash: #ebe5ff;
  --surface-edge: #d9cffa;
  --surface-reverse: #100f12;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-ink: #100f12;
  --color-snow: #fbfaff;
  --color-paper: #ffffff;
  --color-graphite: #44434e;
  --color-slate: #65646e;
  --color-mist: #787685;
  --color-lavender-wash: #ebe5ff;
  --color-lilac-edge: #d9cffa;
  --color-iris: #8d6fde;
  --color-amethyst: #4a3e8a;
  --color-dawn-viol: #7748f6;
  --color-rose-drift: #f5bbc3;

  /* Typography */
  --font-ppmori: 'Ppmori', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.2;
  --tracking-caption: -0.09px;
  --text-body: 14px;
  --leading-body: 1.43;
  --tracking-body: -0.126px;
  --text-heading: 31px;
  --leading-heading: 1.3;
  --tracking-heading: -0.403px;
  --text-display: 52px;
  --leading-display: 1.03;
  --tracking-display: -0.78px;

  /* Spacing */
  --spacing-5: 5px;
  --spacing-7: 7px;
  --spacing-8: 8px;
  --spacing-9: 9px;
  --spacing-10: 10px;
  --spacing-11: 11px;
  --spacing-14: 14px;
  --spacing-16: 16px;
  --spacing-17: 17px;
  --spacing-21: 21px;
  --spacing-28: 28px;
  --spacing-35: 35px;
  --spacing-42: 42px;
  --spacing-62: 62px;
  --spacing-69: 69px;
  --spacing-114: 114px;

  /* Border Radius */
  --radius-md: 6.92px;
  --radius-xl: 13.84px;
  --radius-2xl: 17.3px;
  --radius-2xl-2: 20.76px;
  --radius-3xl: 27.68px;
  --radius-3xl-2: 34.6px;
  --radius-full: 1440px;
}
```
