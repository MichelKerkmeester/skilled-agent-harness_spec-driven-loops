# Graphy — Style Reference
> Blueprint on white marble. A hushed, indigo-inked technical surface where a single vivid blue is the only raised voice, and floating glassy chart fragments drift across a soft gray void.

**Theme:** light

Graphy is a luminous, blueprint-clean SaaS surface that treats data visualization as a calm craft rather than a loud spectacle. The canvas is a whisper-soft lavender-gray (#f2f4f8), and card surfaces sit one level brighter in pure white, creating a quiet two-tier depth that lets vivid cobalt-blue actions glow as the only chromatic punctuation. Typography leans on Aeonik's geometric warmth with aggressively tightened tracking (negative up to -0.05em on display sizes), making even the 82px hero feel engineered rather than decorative. The signature gesture is the floating 3D chart illustrations that orbit the hero — translucent, glassy, impossibly light — paired with hairline borders, generous breathing room, and a single saturated CTA color that never competes with the data on screen.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Indigo Ink | `#20295a` | `--color-indigo-ink` | Violet outline accent for tags, dividers, and focused UI edges. Do not promote it to the primary CTA color |
| Cobalt Signal | `#2e62ff` | `--color-cobalt-signal` | Filled CTA buttons, active states, chart accents, and interactive highlights — the single saturated voice in an otherwise muted system. Used sparingly so it reads as functional energy, not decoration |
| Electric Blue | `#0099ff` | `--color-electric-blue` | Outlined/ghost action borders and link underlines — a secondary chromatic for less-committed interactive states that still need a colored border or underline hint |
| Paper White | `linear-gradient(rgba(255, 255, 255, 0.3) 0%, rgba(76, 48, 237, 0.2) 100%)` | `--color-paper-white` | Card surfaces, elevated panels, button fills, and form inputs — the brightest surface level sitting one tier above the canvas; Translucent-to-violet gradient used on floating glassy chart illustrations and hero ornaments — fades from semi-opaque white into a soft violet aura |
| Mist Gray | `#f2f4f8` | `--color-mist-gray` | Page canvas and section backgrounds — the base layer that makes white cards feel like they are floating just above the surface |
| Charcoal | `#333333` | `--color-charcoal` | Secondary heading text and darker UI text where Indigo Ink is too colored — a neutral fallback that still reads as authoritative |
| Slate | `#444444` | `--color-slate` | Input field text and input borders — the slightly lifted neutral for form interactivity |
| Graphite | `#666666` | `--color-graphite` | Body helper text, captions, and muted descriptions — the workhorse mid-gray for supporting copy |
| Stone | `#999999` | `--color-stone` | Muted body text, placeholder text, and low-emphasis borders — the quietest readable neutral |
| Ash | `#c2c2c2` | `--color-ash` | Light borders, dividers, and disabled-state outlines — the hairline gray that separates content without commanding attention |
| Onyx | `#000000` | `--color-onyx` | Maximum-contrast borders, icon strokes, and structural rules — used where the system needs an unambiguous line |
| Lilac Veil | `#e2e9f6` | `--color-lilac-veil` | Soft highlight washes, decorative gradient stops, and illustration shadow tints — a barely-there blue-gray that adds depth to floating graphic elements |

## Tokens — Typography

### sans-serif — sans-serif — detected in extracted data but not described by AI · `--font-sans-serif`
- **Weights:** 400
- **Sizes:** 12px
- **Line height:** 1.2
- **Role:** sans-serif — detected in extracted data but not described by AI

### Aeonik — Primary brand typeface used for everything from body copy to display headlines. Aeonik's geometric warmth with subtly rounded terminals gives the system a friendly-technical feel — engineered but approachable. The tight tracking (up to -0.05em at display sizes) is the signature typographic choice: it makes even the 82px hero feel like blueprint type rather than editorial display. · `--font-aeonik`
- **Substitute:** Inter, or DM Sans as a close geometric match
- **Weights:** 400, 700
- **Sizes:** 12px, 14px, 16px, 18px, 20px, 22px, 24px, 32px, 40px, 56px, 68px, 82px
- **Line height:** 0.85, 1.05, 1.10, 1.20, 1.30, 1.35, 1.40, 1.60, 1.83
- **Letter spacing:** -0.05em at 82px, -0.044em at 56–68px, -0.033em at 24–40px, -0.02em at 16–18px, normal at 12–14px
- **OpenType features:** `"blwf" on, "cv03" on, "cv04" on, "cv09" on, "cv11" on`
- **Role:** Primary brand typeface used for everything from body copy to display headlines. Aeonik's geometric warmth with subtly rounded terminals gives the system a friendly-technical feel — engineered but approachable. The tight tracking (up to -0.05em at display sizes) is the signature typographic choice: it makes even the 82px hero feel like blueprint type rather than editorial display.

### Inter — Secondary fallback for fine print, system labels, and utility text. Inter fills the micro-typography role at 12–14px where Aeonik's character would be too expressive for chrome-level UI. · `--font-inter`
- **Substitute:** system-ui, -apple-system, sans-serif
- **Weights:** 400
- **Sizes:** 12px, 14px
- **Line height:** 1.10, 1.20, 1.50
- **Letter spacing:** -0.05em
- **Role:** Secondary fallback for fine print, system labels, and utility text. Inter fills the micro-typography role at 12–14px where Aeonik's character would be too expressive for chrome-level UI.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.2 | — | `--text-caption` |
| body-sm | 14px | 1.5 | -0.28px | `--text-body-sm` |
| body | 16px | 1.6 | -0.32px | `--text-body` |
| body-lg | 18px | 1.83 | -0.36px | `--text-body-lg` |
| subheading | 22px | 1.35 | -0.44px | `--text-subheading` |
| heading | 32px | 1.15 | -1.06px | `--text-heading` |
| heading-lg | 40px | 1.13 | -1.32px | `--text-heading-lg` |
| display | 56px | 1.05 | -2.46px | `--text-display` |
| display-lg | 68px | 1.05 | -2.99px | `--text-display-lg` |
| hero | 82px | 0.85 | -4.1px | `--text-hero` |

## Tokens — Spacing & Shapes

**Density:** compact

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 6 | 6px | `--spacing-6` |
| 7 | 7px | `--spacing-7` |
| 8 | 8px | `--spacing-8` |
| 10 | 10px | `--spacing-10` |
| 12 | 12px | `--spacing-12` |
| 16 | 16px | `--spacing-16` |
| 20 | 20px | `--spacing-20` |
| 24 | 24px | `--spacing-24` |
| 30 | 30px | `--spacing-30` |
| 32 | 32px | `--spacing-32` |
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |
| 60 | 60px | `--spacing-60` |
| 80 | 80px | `--spacing-80` |
| 120 | 120px | `--spacing-120` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 8px |
| icons | 4px |
| images | 8px |
| inputs | 8px |
| buttons | 12px |
| large-blocks | 40px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 40px
- **Card padding:** 16px
- **Element gap:** 16px

## Components

### Primary CTA Button
**Role:** High-priority action button for the single most important step on any page

Filled cobalt-blue background (#2e62ff), white text in Aeonik Medium 16px, 12px border-radius, 16px vertical padding and 24px horizontal padding. No border. The vivid blue is the only filled button color in the system — it must be reserved for the one action that moves the user forward.

### Ghost/Secondary Button
**Role:** Companion action with lower visual weight next to a primary CTA

White background, 1px Onyx (#000000) border, Indigo Ink (#20295a) text in Aeonik Medium 16px, 12px border-radius, 16px vertical and 24px horizontal padding. Reads as an outlined button that defers attention to the primary CTA beside it.

### Navigation Link
**Role:** Top-level navigation and inline text links

No background. Indigo Ink (#20295a) text in Aeonik Regular 14–16px with 1px underline on hover. Nav items separated by 24–32px horizontal gap. Active item may carry a 2px Cobalt Signal (#2e62ff) underline.

### Announcement Banner
**Role:** Pill-shaped badge above the hero announcing a product update or feature

Light Mist Gray (#f2f4f8) background, Indigo Ink text in Aeonik Regular 14px, 9999px border-radius, 6px vertical and 16px horizontal padding. Optional small green dot indicator for 'live' status.

### Hero Section
**Role:** Full-bleed above-the-fold introduction with centered headline, subtitle, and dual CTAs

Canvas background (#f2f4f8) with 40–80px vertical padding. Centered headline at 68–82px Aeonik Medium in Indigo Ink with -4.1px tracking. Subtitle at 18px Graphite (#666666) with max-width 560px. Two buttons side by side: Primary CTA + Ghost. Floating 3D chart illustrations orbit the hero at corners with the Dawn Wash gradient.

### Testimonial Card
**Role:** Single user quote in the social-proof grid

White background, 1px Onyx (#000000) border at 5–8% opacity, 8px border-radius, 16–24px padding. Circular avatar (32–40px) above name in Aeonik Medium 14px Indigo Ink and role/title in Stone (#999999) 12px. Quote text in Aeonik Regular 14px Charcoal (#333333). Arranged in a 4-column grid with 16px gap.

### Logo Strip
**Role:** Single-row display of customer/partner logos for social proof

Canvas background, 6–8 logos in a single horizontal row with equal spacing (~40px gap). Logos rendered in desaturated gray (#999999) for uniform visual weight. Optional white card container with 8px radius and 16px padding around the group.

### Section Heading Block
**Role:** Centered or left-aligned section title with optional eyebrow icon

Decorative 3D icon (60–80px) centered above the heading. Heading at 40–56px Aeonik Medium in Indigo Ink, tracking -1.32 to -2.46px. Optional subheading at 18px Graphite. Vertical spacing of 24px between icon and heading, 16px between heading and subheading.

### Text Input
**Role:** Single-line or multi-line form input field

White background, 1px Stone (#c2c2c2) border, 8px border-radius, 10–12px vertical padding and 14–16px horizontal padding. Placeholder text in Stone (#999999) 14px Aeonik Regular. Focus state: 2px Cobalt Signal (#2e62ff) outer ring or border color change to Slate (#444444).

### Rating Badge
**Role:** Compact social-proof display showing star rating and platform

Inline horizontal layout: 'Brand' text in Aeonik Medium 14px Charcoal, followed by 5 filled stars in Cobalt Signal (#2e62ff) or gold, then 'on' label and platform icon (e.g. Product Hunt badge). Centered or left-aligned in footer/section context.

### Cookie Consent Toast
**Role:** Fixed bottom-right notification with message and dismiss action

White background, 1px Onyx border at 10% opacity, 8px border-radius, 12px padding. Message text at 12–14px Aeonik Regular in Charcoal. Dismiss button: small ghost-style with Ash border and 4px radius.

## Do's and Don'ts

### Do
- Use Cobalt Signal (#2e62ff) exclusively for filled primary CTAs — never as a text color, border, or background for non-action elements
- Set hero headlines at 68–82px Aeonik Medium with -4.1px tracking and line-height 0.85 to achieve the signature engineered-display feel
- Maintain the two-tier surface system: Mist Gray (#f2f4f8) canvas, Paper White (#ffffff) cards — never introduce a third surface level without removing one
- Apply 8px border-radius to all cards, images, and inputs consistently — this is the single radius that defines the system's geometric calm
- Use Indigo Ink (#20295a) for all primary text and headings, reserving Charcoal (#333333) only for body text in cards where a neutral is needed
- Pair the Primary CTA with a Ghost button at 24px horizontal gap — the contrast between filled and outlined carries the visual hierarchy without size jumps
- Float 3D-style chart illustrations with the Dawn Wash gradient (white-to-violet) as the signature decorative gesture on hero sections

### Don't
- Do not use Cobalt Signal (#2e62ff) for decorative shapes, illustration fills, or large background washes — its job is to be a small, functional signal
- Do not introduce a shadow on standard cards — the system relies on hairline borders and surface contrast for separation, not elevation
- Do not use positive letter-spacing on display sizes — the negative tracking (-0.033em to -0.05em) is the typographic signature
- Do not mix Inter into body copy or headings — Inter is only for micro-typography at 12–14px in system labels
- Do not use multiple vivid colors in the same view — Cobalt Signal is the only saturated voice; Electric Blue (#0099ff) is its outlined sibling and must not appear simultaneously as a filled element
- Do not set body text below 14px or above 18px — the 14–18px range with generous line-height (1.6–1.83) is the readability window
- Do not round buttons to 9999px (pill shape) — the 12px radius on buttons is a deliberate choice that separates this system from the rounded-pill SaaS convention

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas | `#f2f4f8` | Page background and section base — the mist-gray void everything floats on |
| 1 | Card | `#ffffff` | Card surfaces, testimonial panels, content containers elevated one tier above canvas |
| 2 | Highlight | `#e2e9f6` | Decorative tint washes on floating illustrations and soft glow backgrounds |

## Elevation

- **Floating Hero Illustration:** `0 20px 60px rgba(46, 98, 255, 0.15), 0 8px 24px rgba(32, 41, 90, 0.08)`
- **Cookie Toast:** `0 4px 16px rgba(0, 0, 0, 0.08)`

## Imagery

The visual language is dominated by floating 3D-style chart illustrations — translucent bar charts, pie segments, and dashboard fragments rendered in Cobalt Signal blue with the Dawn Wash gradient (white-to-violet). These are not photorealistic; they are stylized, glassy, and slightly inflated, like data objects suspended in gel. They orbit hero sections at corners and appear as decorative glyphs above section headings. Photography is absent — there are no lifestyle shots, no team photos, no product screenshots. The testimonial grid uses small circular avatar illustrations (24–40px) rather than photographs. Logos in the social-proof strip are rendered flat and desaturated. The overall density is text-dominant with imagery occupying maybe 15–20% of total visual space, always as accent rather than content.

## Layout

The page is a max-width 1200px centered column with full-bleed Mist Gray (#f2f4f8) canvas. The hero is a centered stack: announcement pill, 68–82px headline, 18px subtitle (max-width 560px), and a two-button row (Primary + Ghost) with floating 3D chart illustrations at the four corners. Below the hero, a single-row logo strip sits at ~80% page width. Sections alternate between centered text blocks and content grids, with 40px vertical gaps between major sections. The testimonial section is a 4-column × 2-row card grid with 16px gaps. Content blocks are always centered within the 1200px container; there is no left-aligned asymmetric layout. Navigation is a minimal top bar with logo left, 3–4 links center, and Log in / Sign up right, with 24px gaps between nav items. The overall rhythm is calm and spacious — generous vertical breathing room between sections, never information-dense.

## Agent Prompt Guide

## Quick Color Reference
- text: #20295a (Indigo Ink)
- background: #f2f4f8 (Mist Gray canvas), #ffffff (Paper White cards)
- border: #000000 (Onyx, 5–10% opacity for hairline), #c2c2c2 (Ash for form borders)
- accent: #2e62ff (Cobalt Signal — the only saturated voice)
- muted: #666666 (Graphite body), #999999 (Stone placeholders)
- primary action: #2e62ff (filled action)

## Example Component Prompts
1. Create a Primary Action Button: #2e62ff background, #ffffff text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.

2. **Testimonial Card**: White (#ffffff) background, 1px #000000 border at 8% opacity, 8px radius, 20px padding. Circular avatar 40px above name. Name in Aeonik Medium 14px #20295a, role in 12px #999999. Quote text in Aeonik Regular 14px #333333, line-height 1.6. 4-column grid with 16px gap.

3. **Announcement Banner**: #f2f4f8 background, 9999px radius, 6px 16px padding. Text in Aeonik Regular 14px #20295a with green dot prefix.

4. **Section Heading**: Centered. 60px decorative 3D icon above heading. Heading at 40px Aeonik Medium, #20295a, letter-spacing -1.32px. 16px gap to subheading at 18px #666666.

5. **Text Input**: White background, 1px #c2c2c2 border, 8px radius, 12px 16px padding. Placeholder in #999999 14px Aeonik Regular. Focus: 2px #2e62ff outer ring.

## Gradient System

The system uses a single dominant gradient: linear-gradient(rgba(255, 255, 255, 0.3) 0%, rgba(76, 48, 237, 0.2) 100%). This 'Dawn Wash' is the signature decorative treatment for floating 3D chart illustrations — it makes solid objects feel translucent and gel-like. A secondary soft gradient (rgba(120, 140, 255, 0.5) → rgba(216, 218, 228, 0.5)) appears in subtle background washes. Gradients are never used on buttons, text, or functional UI — they are reserved exclusively for decorative illustration and ambient background atmosphere.

## Typography Philosophy

The signature is aggressively tight tracking at large sizes. At 82px the letter-spacing reaches -0.05em (-4.1px), which is far tighter than conventional SaaS display type. This creates a 'blueprint' or 'technical-spec' feel — the type looks engineered rather than editorial. The line-height of 0.85 at 82px means descenders on the bottom line tuck under ascenders on the line below, creating dense, interlocking headline blocks. Font feature settings (blwf, cv03, cv04, cv09, cv11) activate Aeonik's stylistic alternates for a more geometric, less humanist character.

## Similar Brands

- **Linear** — Same tightly-tracked geometric display type, single vivid accent color against a muted dark/light canvas, and hairline-bordered card grids for social proof
- **Vercel** — Centered max-width layout, floating 3D-style geometric illustrations around hero, and the same two-tier surface system (canvas gray + white cards) with minimal decoration
- **Framer** — Soft mist-gray canvas with white elevated cards, a single saturated blue as the only functional color, and the same compact information density in testimonial/logo sections
- **Cron** — Identical Aeonik-style geometric type with tight negative tracking, white cards on lavender-gray canvas, and the same restrained single-accent-color philosophy
- **Notion** — Clean white-on-soft-gray surface treatment with hairline borders and the same calm, spacious breathing room between sections

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-indigo-ink: #20295a;
  --color-cobalt-signal: #2e62ff;
  --color-electric-blue: #0099ff;
  --color-paper-white: #ffffff;
  --gradient-paper-white: linear-gradient(rgba(255, 255, 255, 0.3) 0%, rgba(76, 48, 237, 0.2) 100%);
  --color-mist-gray: #f2f4f8;
  --color-charcoal: #333333;
  --color-slate: #444444;
  --color-graphite: #666666;
  --color-stone: #999999;
  --color-ash: #c2c2c2;
  --color-onyx: #000000;
  --color-lilac-veil: #e2e9f6;

  /* Typography — Font Families */
  --font-sans-serif: 'sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-aeonik: 'Aeonik', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.2;
  --text-body-sm: 14px;
  --leading-body-sm: 1.5;
  --tracking-body-sm: -0.28px;
  --text-body: 16px;
  --leading-body: 1.6;
  --tracking-body: -0.32px;
  --text-body-lg: 18px;
  --leading-body-lg: 1.83;
  --tracking-body-lg: -0.36px;
  --text-subheading: 22px;
  --leading-subheading: 1.35;
  --tracking-subheading: -0.44px;
  --text-heading: 32px;
  --leading-heading: 1.15;
  --tracking-heading: -1.06px;
  --text-heading-lg: 40px;
  --leading-heading-lg: 1.13;
  --tracking-heading-lg: -1.32px;
  --text-display: 56px;
  --leading-display: 1.05;
  --tracking-display: -2.46px;
  --text-display-lg: 68px;
  --leading-display-lg: 1.05;
  --tracking-display-lg: -2.99px;
  --text-hero: 82px;
  --leading-hero: 0.85;
  --tracking-hero: -4.1px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-6: 6px;
  --spacing-7: 7px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-30: 30px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-60: 60px;
  --spacing-80: 80px;
  --spacing-120: 120px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 40px;
  --card-padding: 16px;
  --element-gap: 16px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-2xl-2: 20px;
  --radius-3xl: 24px;
  --radius-3xl-2: 40px;
  --radius-full: 51px;
  --radius-full-2: 70px;

  /* Named Radii */
  --radius-cards: 8px;
  --radius-icons: 4px;
  --radius-images: 8px;
  --radius-inputs: 8px;
  --radius-buttons: 12px;
  --radius-large-blocks: 40px;

  /* Surfaces */
  --surface-canvas: #f2f4f8;
  --surface-card: #ffffff;
  --surface-highlight: #e2e9f6;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-indigo-ink: #20295a;
  --color-cobalt-signal: #2e62ff;
  --color-electric-blue: #0099ff;
  --color-paper-white: #ffffff;
  --color-mist-gray: #f2f4f8;
  --color-charcoal: #333333;
  --color-slate: #444444;
  --color-graphite: #666666;
  --color-stone: #999999;
  --color-ash: #c2c2c2;
  --color-onyx: #000000;
  --color-lilac-veil: #e2e9f6;

  /* Typography */
  --font-sans-serif: 'sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-aeonik: 'Aeonik', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.2;
  --text-body-sm: 14px;
  --leading-body-sm: 1.5;
  --tracking-body-sm: -0.28px;
  --text-body: 16px;
  --leading-body: 1.6;
  --tracking-body: -0.32px;
  --text-body-lg: 18px;
  --leading-body-lg: 1.83;
  --tracking-body-lg: -0.36px;
  --text-subheading: 22px;
  --leading-subheading: 1.35;
  --tracking-subheading: -0.44px;
  --text-heading: 32px;
  --leading-heading: 1.15;
  --tracking-heading: -1.06px;
  --text-heading-lg: 40px;
  --leading-heading-lg: 1.13;
  --tracking-heading-lg: -1.32px;
  --text-display: 56px;
  --leading-display: 1.05;
  --tracking-display: -2.46px;
  --text-display-lg: 68px;
  --leading-display-lg: 1.05;
  --tracking-display-lg: -2.99px;
  --text-hero: 82px;
  --leading-hero: 0.85;
  --tracking-hero: -4.1px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-6: 6px;
  --spacing-7: 7px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-30: 30px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-60: 60px;
  --spacing-80: 80px;
  --spacing-120: 120px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-2xl-2: 20px;
  --radius-3xl: 24px;
  --radius-3xl-2: 40px;
  --radius-full: 51px;
  --radius-full-2: 70px;
}
```
