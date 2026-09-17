# 11x– Digital workers — Style Reference
> Cinematic editorial desert — full-bleed terrain photography against monumental serif headlines, where the page reads like a luxury magazine spread.

**Theme:** mixed

11x.ai operates as a cinematic editorial platform: dramatic full-bleed landscape photography meets oversized custom serif typography, creating the feel of a luxury magazine spread repurposed for enterprise software. The interface is almost entirely monochrome — black on white surfaces, white on deep teal sections — with color appearing only as muted, sun-bleached pastels on feature cards (dusty blue, mint, lavender, peach). The single recurring accent on dark sections is a muted slate-teal used for feature tag pills. Components are deliberately minimal: pill-shaped buttons with 999px radius, soft-bordered portrait cards, and small status badges — nothing competes with the photography or the serif headlines. The rhythm alternates between white editorial spreads and full-bleed dark narrative bands, giving the entire site the cadence of a print campaign rather than a typical SaaS landing page.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Obsidian | `#000000` | `--color-obsidian` | Primary action buttons on light surfaces, body text, headlines, card borders — the universal ink of the system |
| Paper White | `#ffffff` | `--color-paper-white` | Page canvas on light sections, card surfaces, text on dark backgrounds, button text on filled buttons |
| Deep Teal | `#0b252a` | `--color-deep-teal` | Dark section backgrounds — the only large chromatic surface, used for narrative bands between editorial spreads |
| Bone | `#f6f5f5` | `--color-bone` | Card surfaces and hairline borders on light sections — the warm off-white that prevents starkness |
| Sandstone | `#f5ece5` | `--color-sandstone` | Warm card surface tint, section backgrounds in cream/peach areas — desert-hour warmth |
| Ash Blush | `#ede2d7` | `--color-ash-blush` | Soft warm card surface, secondary peach accent on portrait cards |
| Stone | `#d7cecc` | `--color-stone` | Muted neutral footer and section dividers — warm mid-gray grounding color |
| Iron | `#e1dad9` | `--color-iron` | Button and link background tint, card surface for outlined controls |
| Pewter | `#afaeae` | `--color-pewter` | Disabled or tertiary button fills, secondary surface fills |
| Charcoal | `#222222` | `--color-charcoal` | Near-black for dark button fills on light surfaces where pure black feels too harsh |
| Dusty Sky | `#c5d5e8` | `--color-dusty-sky` | Soft blue pastel — feature card background, decorative portrait card tint |
| Mist Mint | `#d4e6eb` | `--color-mist-mint` | Pale mint-teal pastel — feature card background variant |
| Wisteria | `#efe5f9` | `--color-wisteria` | Lavender pastel — feature card background variant |
| Desert Clay | `#e7d3bf` | `--color-desert-clay` | Warm peach/tan pastel — feature card background variant, ties to hero photography palette |
| Slate Teal | `#406e7a` | `--color-slate-teal` | Muted blue-teal for feature tag pills on dark sections, badge backgrounds — the only repetitive chromatic UI element |
| Saddle Brown | `#4c312b` | `--color-saddle-brown` | Warm brown for badge borders and occasional accent text — echoes the terrain photography |

## Tokens — Typography

### ES Allianz — Primary typeface for all UI text — a high-contrast didone-influenced serif used at dramatic display sizes (74–152px) for headlines, and at body sizes (16–19px) for running text. The tight letter-spacing (-0.045em at display, -0.02em at body) tightens the serifs into a modern editorial stance. Weight 400 carries most copy; 700 for hero impact; 500 for navigation and subheadings. This serif does the heavy lifting that a sans-serif system would spread across three families. · `--font-es-allianz`
- **Substitute:** GT Sectra, Editorial New, or Tiempos Headline — any high-contrast modern serif with tight tracking. For free alternatives: Bodoni Moda or Playfair Display at tightened tracking.
- **Weights:** 400, 500, 700
- **Sizes:** 8, 14, 16, 18, 19, 28, 32, 46, 56, 64, 74, 152
- **Line height:** 0.85, 1.00, 1.10, 1.20, 1.40
- **Letter spacing:** -0.045em at 74–152px, -0.04em at 46–64px, -0.02em at 14–32px
- **Role:** Primary typeface for all UI text — a high-contrast didone-influenced serif used at dramatic display sizes (74–152px) for headlines, and at body sizes (16–19px) for running text. The tight letter-spacing (-0.045em at display, -0.02em at body) tightens the serifs into a modern editorial stance. Weight 400 carries most copy; 700 for hero impact; 500 for navigation and subheadings. This serif does the heavy lifting that a sans-serif system would spread across three families.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 14px | 1.2 | -0.28px | `--text-caption` |
| body-sm | 16px | 1.4 | -0.32px | `--text-body-sm` |
| subheading | 19px | 1.2 | -0.38px | `--text-subheading` |
| heading-sm | 28px | 1.2 | -0.56px | `--text-heading-sm` |
| heading | 46px | 1.1 | -1.84px | `--text-heading` |
| heading-lg | 64px | 1.1 | -2.56px | `--text-heading-lg` |
| display | 74px | 1 | -3.33px | `--text-display` |
| display-xl | 152px | 0.85 | -6.84px | `--text-display-xl` |

## Tokens — Spacing & Shapes

**Base unit:** 8px

**Density:** compact

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 8 | 8px | `--spacing-8` |
| 16 | 16px | `--spacing-16` |
| 24 | 24px | `--spacing-24` |
| 32 | 32px | `--spacing-32` |
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |
| 64 | 64px | `--spacing-64` |
| 72 | 72px | `--spacing-72` |
| 80 | 80px | `--spacing-80` |
| 128 | 128px | `--spacing-128` |
| 136 | 136px | `--spacing-136` |
| 192 | 192px | `--spacing-192` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 16px |
| badges | 8px |
| buttons | 999px |
| smallBadges | 2px |
| portraitCards | 32px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 48-80px
- **Card padding:** 16-24px
- **Element gap:** 8-16px

## Components

### Primary Pill Button (Light)
**Role:** Filled CTA on white/light surfaces

Black (#000000) fill, white text, 999px border-radius, padding 12px 24px, ES Allianz weight 500 at 16px, letter-spacing -0.32px. White hairline border (1px) to define the edge against photography.

### Primary Pill Button (Dark)
**Role:** Filled CTA on dark teal sections

White (#ffffff) fill, black text, 999px border-radius, padding 12px 24px, ES Allianz weight 500 at 16px. Used on the #0b252a narrative bands.

### Navigation Bar
**Role:** Top-level site navigation

White background (#ffffff), 8px vertical padding, horizontal layout with logo left, nav links center (ES Allianz 16px weight 500), CTA button right. Nav text in black. No drop shadow — sits flush against content with 1px bottom hairline in #e1dad9.

### Announcement Bar
**Role:** Top-most notification strip

Black (#000000) background, white text at 14px ES Allianz weight 500, centered, full-width, ~40px height. Contains a short message with an arrow icon linking to more detail.

### Hero Section (Full-Bleed)
**Role:** Cinematic landing hero

Full-bleed photographic background (terrain/desert imagery at warm color temperature), overlay-free with white text. Display headline at 74–152px ES Allianz weight 700, white, letter-spacing -0.045em. Subheadline at 18–19px weight 400, white, 1.4 line-height. White pill CTA below.

### Portrait Worker Card
**Role:** Featured digital worker profile

Large portrait photograph filling the card, 32px border-radius, subtle 1px border in #e1dad9. Overlaid status badge in top-left corner: 8px radius, semi-transparent dark background, white text at 14px. Card sits on white canvas with 24px gap between siblings.

### Status Badge
**Role:** Worker status indicator on cards

Pill shape, 8px border-radius, small (under 32px height), white or semi-transparent black background, 14px ES Allianz weight 500 text. Shows worker name and status (e.g. 'Alice the SDR', 'Autopilot activated').

### Feature Tag Pill
**Role:** Platform capability tag on dark sections

Muted slate-teal (#406e7a) background, white text, 8px border-radius, padding 4px 12px, ES Allianz 14px weight 500. Arranged in a horizontal marquee/row pattern. The only repeated chromatic UI element on the site.

### Section Card (Pastel Variant)
**Role:** Feature or content card with soft colored background

One of four pastel tints — Dusty Sky (#c5d5e8), Mist Mint (#d4e6eb), Wisteria (#efe5f9), or Desert Clay (#e7d3bf). 16px border-radius, 24px internal padding, no shadow. Black text at 18px body or 32–46px heading. These pastel cards are the site's only color punctuation on light sections.

### Dark Narrative Band
**Role:** Full-width dark section between editorial spreads

Deep teal (#0b252a) background, full-bleed, white centered text. Display headline 46–74px, body text 18px, white pill CTA. Followed by a row of slate-teal feature tag pills, then a cream/peach card surface (Bone #f6f5f5) breaking into the next section.

### Chat Widget (Ask Julian)
**Role:** Floating conversational entry point

Fixed bottom-right, pill shape, dark (#0b252a) background, small circular avatar portrait, white text 'Ask Julian' at 14px ES Allianz weight 500. ~48px height, subtle shadow for lift.

### Footer
**Role:** Site footer

Stone (#d7cecc) or white background, multi-column link grid, ES Allianz 14–16px, black text. Logo and legal line at bottom.

## Do's and Don'ts

### Do
- Use the ES Allianz serif at 74px+ weight 700 for hero and section headlines — the oversized serif is the brand's primary visual signature
- Set pill buttons to exactly 999px border-radius with 12px 24px padding, in either black-on-white or white-on-black
- Use the four pastel card tints (Dusty Sky, Mist Mint, Wisteria, Desert Clay) as the only color punctuation on light sections — never introduce new chromatic UI colors
- Alternate between white editorial spreads and Deep Teal (#0b252a) full-bleed bands to maintain the magazine-spread rhythm
- Use full-bleed landscape photography as section backgrounds — the imagery must be warm-toned, cinematic, and high-resolution
- Set letter-spacing to -0.045em at display sizes (74px+) and -0.02em at body sizes for the modern editorial stance
- Use the Slate Teal (#406e7a) feature tag pills exclusively on the Deep Teal dark sections — never on light backgrounds

### Don't
- Do not use sans-serif typefaces anywhere — the serif is non-negotiable and defines the editorial identity
- Do not use blue, red, green, or yellow as functional UI colors — the palette is restricted to neutrals, deep teal, and the four muted pastels
- Do not add drop shadows to cards or buttons — elevation is communicated through tonal contrast and 1px hairline borders only
- Do not use sharp corners (under 8px radius) on interactive elements — pills, rounded cards, and soft radii are the norm
- Do not center-align body paragraphs longer than two lines — left-align running text for editorial readability
- Do not introduce gradients on UI components — the only gradient is a subtle warm fade (#f8f9f7 → #d7cecd) used minimally
- Do not stack more than one pastel card tint adjacent to another — alternate pastel cards with white space to preserve the airy feel

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Paper White | `#ffffff` | Primary page canvas on light editorial sections |
| 1 | Bone | `#f6f5f5` | Card surfaces, warm off-white panels on cream sections |
| 2 | Sandstone | `#f5ece5` | Warm card tint for peach/cream feature areas |
| 3 | Pastel Card | `#efe5f9` | Colored card surface (lavender/blue/mint/peach variants) |
| 4 | Deep Teal | `#0b252a` | Dark narrative band background — highest contrast surface |

## Elevation

The design system deliberately avoids drop shadows as a means of elevation. Hierarchy and separation are achieved through tonal contrast (white card on white canvas distinguished only by a 1px #e1dad9 hairline border), full-bleed dark bands that create natural section breaks, and the layering of warm neutrals. The floating chat widget is the only element that uses shadow, and even then it is minimal. This shadowless approach reinforces the flat, editorial, print-magazine aesthetic.

## Imagery

Full-bleed landscape photography is the primary visual language — warm-toned, cinematic terrain shots (desert rock formations, geological textures) serve as hero and section backgrounds. Portrait photography appears in contained cards with 32px border-radius, tightly cropped to face and shoulders, natural lighting, warm color grading. The photography is always editorial in treatment: no overlays, no duotone effects, no artificial color grading. Decorative illustration is absent. The photography occupies 50–70% of the viewport in hero and dark-band sections, then contracts to 40–50% width in card layouts. Icons are not present in the visible design system — navigation and status communication rely on typography and small text labels.

## Layout

The page follows an editorial magazine model: full-bleed dramatic hero with centered text overlay, followed by white content sections with centered headings and 2-column card grids, then a Deep Teal dark narrative band, then alternating cream and white feature sections. Max content width is approximately 1200px, centered. Hero sections break to full viewport width. Card grids use 2-column layouts for feature highlights and worker profiles. Vertical rhythm is generous (48–80px section gaps) despite the compact base spacing unit, giving each section room to breathe like a magazine spread. The nav is a fixed white top bar; no sidebar. A floating chat widget anchors the bottom-right corner across all sections.

## Agent Prompt Guide

**Quick Color Reference**
- Text: #000000
- Background: #ffffff
- Dark section background: #0b252a
- Border: #e1dad9 (hairline) / #f6f5f5 (soft)
- Accent pastels: #c5d5e8, #d4e6eb, #efe5f9, #e7d3bf
- primary action: #000000 (filled action)

**3-5 Example Component Prompts**

1. Create a Primary Action Button: #000000 background, #ffffff text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.


3. **Pastel Feature Card**: Dusty Sky (#c5d5e8) or Wisteria (#efe5f9) background, 16px border-radius, 24px padding. Heading at 32px ES Allianz weight 700, black, letter-spacing -0.64px. Body at 18px weight 400, black. No shadow, no border.

4. **Worker Portrait Card**: 32px border-radius, full-bleed portrait photograph (warm-toned, tight crop to face), 1px border in #e1dad9. Overlaid status badge top-left: semi-transparent black background, 8px radius, white 14px ES Allianz weight 500 text.

5. **Navigation Bar**: White (#ffffff) background, full-width, 8px vertical padding. Logo left ('11x' in ES Allianz weight 700, 24px). Nav links center in ES Allianz 16px weight 500, black. Black pill CTA right: #000000 background, white text, 999px radius, 12px 24px padding.

## Typography Philosophy

ES Allianz is a high-contrast didone-influenced serif. Its signature role at 74–152px creates a magazine-cover feel that no sans-serif system can replicate. The tight letter-spacing (-0.045em at display) compresses the serifs into a modern editorial stance rather than a traditional book typeface. Line-heights are aggressively tight at display sizes (0.85–1.0) to allow headlines to stack into monumental blocks, then open up to 1.2–1.4 at body sizes. This compression-then-opening ratio is a signature rhythm: monumental at the top, breathable at the body level. The serif is used for everything — there is no sans-serif companion. This is unusual and deliberate: the site rejects the typical serif-headline + sans-body split in favor of a unified editorial voice.

## Similar Brands

- **Linear** — Shares the pill-button + monochrome-with-one-accent approach, though Linear uses sans-serif — 11x.ai takes the same minimalism into serif editorial territory
- **Clay** — Both use full-bleed photography as section backgrounds with centered serif/sans headlines and pill CTAs, targeting a premium AI audience with magazine-spread pacing
- **Arc Browser** — Both reject typical SaaS aesthetics in favor of editorial design — oversized display type, warm neutrals, and dramatic full-bleed imagery over flat UI
- **Runway** — Dark hero sections with dramatic imagery, oversized editorial type, and the same restraint with color — letting the work speak through atmosphere rather than chromatic UI
- **Stripe (editorial sections)** — Shares the gradient-free, hairline-bordered card system and the alternating white/dark band rhythm, though 11x.ai pushes further into serif and full-bleed photography

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-obsidian: #000000;
  --color-paper-white: #ffffff;
  --color-deep-teal: #0b252a;
  --color-bone: #f6f5f5;
  --color-sandstone: #f5ece5;
  --color-ash-blush: #ede2d7;
  --color-stone: #d7cecc;
  --color-iron: #e1dad9;
  --color-pewter: #afaeae;
  --color-charcoal: #222222;
  --color-dusty-sky: #c5d5e8;
  --color-mist-mint: #d4e6eb;
  --color-wisteria: #efe5f9;
  --color-desert-clay: #e7d3bf;
  --color-slate-teal: #406e7a;
  --color-saddle-brown: #4c312b;

  /* Typography — Font Families */
  --font-es-allianz: 'ES Allianz', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.2;
  --tracking-caption: -0.28px;
  --text-body-sm: 16px;
  --leading-body-sm: 1.4;
  --tracking-body-sm: -0.32px;
  --text-subheading: 19px;
  --leading-subheading: 1.2;
  --tracking-subheading: -0.38px;
  --text-heading-sm: 28px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: -0.56px;
  --text-heading: 46px;
  --leading-heading: 1.1;
  --tracking-heading: -1.84px;
  --text-heading-lg: 64px;
  --leading-heading-lg: 1.1;
  --tracking-heading-lg: -2.56px;
  --text-display: 74px;
  --leading-display: 1;
  --tracking-display: -3.33px;
  --text-display-xl: 152px;
  --leading-display-xl: 0.85;
  --tracking-display-xl: -6.84px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-unit: 8px;
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-72: 72px;
  --spacing-80: 80px;
  --spacing-128: 128px;
  --spacing-136: 136px;
  --spacing-192: 192px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 48-80px;
  --card-padding: 16-24px;
  --element-gap: 8-16px;

  /* Border Radius */
  --radius-sm: 2px;
  --radius-lg: 8px;
  --radius-2xl: 16px;
  --radius-3xl: 24px;
  --radius-3xl-2: 32px;
  --radius-full: 999px;
  --radius-full-2: 9999px;
  --radius-full-3: 16000px;

  /* Named Radii */
  --radius-cards: 16px;
  --radius-badges: 8px;
  --radius-buttons: 999px;
  --radius-smallbadges: 2px;
  --radius-portraitcards: 32px;

  /* Surfaces */
  --surface-paper-white: #ffffff;
  --surface-bone: #f6f5f5;
  --surface-sandstone: #f5ece5;
  --surface-pastel-card: #efe5f9;
  --surface-deep-teal: #0b252a;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-obsidian: #000000;
  --color-paper-white: #ffffff;
  --color-deep-teal: #0b252a;
  --color-bone: #f6f5f5;
  --color-sandstone: #f5ece5;
  --color-ash-blush: #ede2d7;
  --color-stone: #d7cecc;
  --color-iron: #e1dad9;
  --color-pewter: #afaeae;
  --color-charcoal: #222222;
  --color-dusty-sky: #c5d5e8;
  --color-mist-mint: #d4e6eb;
  --color-wisteria: #efe5f9;
  --color-desert-clay: #e7d3bf;
  --color-slate-teal: #406e7a;
  --color-saddle-brown: #4c312b;

  /* Typography */
  --font-es-allianz: 'ES Allianz', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.2;
  --tracking-caption: -0.28px;
  --text-body-sm: 16px;
  --leading-body-sm: 1.4;
  --tracking-body-sm: -0.32px;
  --text-subheading: 19px;
  --leading-subheading: 1.2;
  --tracking-subheading: -0.38px;
  --text-heading-sm: 28px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: -0.56px;
  --text-heading: 46px;
  --leading-heading: 1.1;
  --tracking-heading: -1.84px;
  --text-heading-lg: 64px;
  --leading-heading-lg: 1.1;
  --tracking-heading-lg: -2.56px;
  --text-display: 74px;
  --leading-display: 1;
  --tracking-display: -3.33px;
  --text-display-xl: 152px;
  --leading-display-xl: 0.85;
  --tracking-display-xl: -6.84px;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-72: 72px;
  --spacing-80: 80px;
  --spacing-128: 128px;
  --spacing-136: 136px;
  --spacing-192: 192px;

  /* Border Radius */
  --radius-sm: 2px;
  --radius-lg: 8px;
  --radius-2xl: 16px;
  --radius-3xl: 24px;
  --radius-3xl-2: 32px;
  --radius-full: 999px;
  --radius-full-2: 9999px;
  --radius-full-3: 16000px;
}
```
