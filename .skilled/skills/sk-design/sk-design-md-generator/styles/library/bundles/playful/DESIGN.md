# Playful — Style Reference
> sunlit paper notebook with a hot-pink highlighter. A friendly, editorial product surface printed on warm cream stock, where one vivid magenta accent punctuates an otherwise monochrome warm-gray world.

**Theme:** light

Playful reads like a warm, hand-crafted workshop printed on cream paper. The entire surface sits on a sandy oat canvas (#f6f2ee) rather than clinical white, giving every screen a paper-like, approachable warmth. A single hot-pink (#ff2e95) does all the chromatic work — CTAs, links, logo mark — against a near-black ink (#111/#000), so screens stay visually quiet until a moment of action is needed. The display type is unapologetically heavy and italic at 70–79px, leaning into editorial poster energy rather than SaaS neutrality. Components are large and soft: 44px cards on pill-shaped buttons, deep diffused shadows, generous breathing room. The overall rhythm is one bold typographic statement per section, surrounded by quiet warm whitespace.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Hot Magenta | `#ff2e95` | `--color-hot-magenta` | Primary CTA fill, logo mark, link color, accent strokes — the only chromatic voice in the system, used sparingly to signal action |
| Ink Black | `#000000` | `--color-ink-black` | Primary heading text, button text, heavy borders, navigation bar background |
| Oat Canvas | `#f6f2ee` | `--color-oat-canvas` | Page background, large surface fills — the warm cream that replaces cold white throughout |
| Soft Ink | `#111111` | `--color-soft-ink` | Body text and headings on light surfaces, card surface background for dark elements |
| Slate | `#0f172a` | `--color-slate` | Secondary text, subtle body copy — a cool near-black used for non-headline text |
| Charcoal | `#414040` | `--color-charcoal` | Neutral form states, badge text, and quiet UI feedback where color should stay understated. Do not promote it to the primary CTA color |
| Stone | `#848383` | `--color-stone` | Icon strokes, muted helper text, subtle UI dividers |
| Paper White | `#ffffff` | `--color-paper-white` | Card surfaces, elevated panels, contrast surface against oat canvas |
| Warm Mist | `#e8e5e0` | `--color-warm-mist` | Hairline borders, dividers, subtle container outlines — warm-toned to match canvas |
| Sand | `#e2dcd6` | `--color-sand` | Secondary borders, decorative outlines on warm surfaces |
| Driftwood | `#c3c1bf` | `--color-driftwood` | Card shadow base tone, muted surface fills |
| Midnight | `#202126` | `--color-midnight` | Deep heading text variant, near-black with subtle cool cast for high-weight headlines |

## Tokens — Typography

### Inter — Primary typeface for everything. Display headlines use 700/900 italic at 70–79px for editorial poster energy; subheads at 26–30px 600/700; body 16–18px 400; captions 14px 500. The heavy italic display is the signature — most product sites default to upright, Playful leans into the slope for personality. · `--font-inter`
- **Substitute:** DM Sans, Manrope
- **Weights:** 400, 500, 600, 700, 900
- **Sizes:** 14px, 16px, 18px, 26px, 30px, 70px, 79px
- **Line height:** 1.15 (display), 1.20 (headings), 1.33–1.40 (subheads), 1.50–1.70 (body)
- **Letter spacing:** -0.002em across all sizes (barely perceptible tightening)
- **OpenType features:** `"ss01" on, "cv11" on`
- **Role:** Primary typeface for everything. Display headlines use 700/900 italic at 70–79px for editorial poster energy; subheads at 26–30px 600/700; body 16–18px 400; captions 14px 500. The heavy italic display is the signature — most product sites default to upright, Playful leans into the slope for personality.

### Arial — System fallback used in some button and input contexts. Inter should be preferred; Arial only appears as a degradation layer. · `--font-arial`
- **Substitute:** Inter
- **Weights:** 400, 600, 700
- **Sizes:** 13px, 15px, 16px, 20px
- **Line height:** 1.20–1.40
- **Letter spacing:** normal
- **Role:** System fallback used in some button and input contexts. Inter should be preferred; Arial only appears as a degradation layer.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 13px | 1.4 | -0.026px | `--text-caption` |
| body | 16px | 1.5 | -0.032px | `--text-body` |
| body-lg | 18px | 1.5 | -0.036px | `--text-body-lg` |
| subheading | 26px | 1.23 | -0.052px | `--text-subheading` |
| heading-sm | 30px | 1.2 | -0.06px | `--text-heading-sm` |
| display | 79px | 1 | -0.158px | `--text-display` |

## Tokens — Spacing & Shapes

**Density:** spacious

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 5 | 5px | `--spacing-5` |
| 8 | 8px | `--spacing-8` |
| 10 | 10px | `--spacing-10` |
| 12 | 12px | `--spacing-12` |
| 14 | 14px | `--spacing-14` |
| 16 | 16px | `--spacing-16` |
| 20 | 20px | `--spacing-20` |
| 24 | 24px | `--spacing-24` |
| 25 | 25px | `--spacing-25` |
| 26 | 26px | `--spacing-26` |
| 30 | 30px | `--spacing-30` |
| 32 | 32px | `--spacing-32` |
| 36 | 36px | `--spacing-36` |
| 60 | 60px | `--spacing-60` |
| 180 | 180px | `--spacing-180` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 999px |
| cards | 44px |
| images | 16px |
| inputs | 99px |
| buttons | 99px (pill) |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| xl | `rgba(0, 0, 0, 0.22) 0px 32px 80px 0px, rgba(0, 0, 0, 0.08...` | `--shadow-xl` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 113px
- **Card padding:** 24px
- **Element gap:** 10-16px

## Components

### Pill CTA Button (Primary)
**Role:** Filled action button for the single most important action on a screen

Hot Magenta (#ff2e95) fill, white text, Inter 600 at 16px, 99px border-radius, 14px 24px padding. Heavy and confident — the only chromatic element competing with the display type.

### Email Input Field
**Role:** Capture user email for waitlist signup

Oat Canvas (#f6f2ee) fill, 1px Charcoal (#414040) border, 99px border-radius, white card container wraps input + button as a unified pill. Placeholder Inter 400 16px in muted gray. Paired visually with the Pill CTA to form a single inline composite.

### Editorial Display Headline
**Role:** Hero section statement

Inter 700 or 900 italic, 70–79px, line-height 1.00, letter-spacing -0.002em, color Ink Black (#000) or Soft Ink (#111). Set in one or two lines, centered. This is the signature element — heavy italic at scale creates a poster-like moment rather than a SaaS tagline.

### App Tile Card
**Role:** Showcase mini-app examples in a row

44px border-radius, Paper White (#ffffff) surface, deep diffused shadow (0 32px 80px rgba(0,0,0,0.22)). Contains a full-bleed illustration or icon. Sized roughly 140–180px square, displayed in a slightly tilted overlapping row to suggest a hand of cards.

### FAQ Accordion Card
**Role:** Expandable question/answer in the FAQ section

Paper White (#ffffff) surface, 44px border-radius, warm border or none, soft shadow stack (0 32px 80px / 0 2px 8px rgba(0,0,0,0.22/0.08)). Question text Inter 600 italic 16–18px, chevron icon in Stone (#848383). Stacked vertically with 12–16px gap between cards.

### Category Navigation Bar
**Role:** Horizontal category scroller (Birthdays, Creativity, etc.)

Ink Black (#000) background, white text Inter 500 14–16px, horizontal scroll, items separated by 24–32px spacing. No visible border or background change on the bar itself — it reads as a dark band cutting across the page.

### Logo Wordmark
**Role:** Brand identity in header and footer

Hot Magenta (#ff2e95) stylized 'playful' wordmark in Inter 700 italic, paired with a small geometric icon (rounded square mark). Functions as both brand and link, so the magenta is doing double duty as identity and navigation.

### App Icon
**Role:** Brand mark in footer / final CTA section

Rounded square (16–20px radius) dark container with Hot Magenta (#ff2e95) pictogram inside. Appears as a standalone mark above the final headline, echoing the logo's icon component.

### Gradient Highlight Section
**Role:** Mid-page atmospheric band

Large soft radial or linear gradient from Hot Magenta (#ff2e95) through lavender-pink to Oat Canvas (#f6f2ee). No defined edges — bleeds into surrounding sections. Hosts a single italic headline at 30px with mixed weight ('Describe it. It's yours in minutes.').

### Hero Subtext
**Role:** Supporting paragraph beneath the display headline

Inter 400 16–18px, Slate (#0f172a), centered, max-width ~560px. Quiet by design — lets the headline own the visual weight.

### Two-Column FAQ Section Layout
**Role:** Question list arrangement

Left column: small 'Got questions?' label in Inter 500 + bold heading 'Things people want to know'. Right column: stacked FAQ accordion cards. 1200px max-width container, 64–80px section gap above and below.

## Do's and Don'ts

### Do
- Use Hot Magenta (#ff2e95) only for the primary CTA, the logo, and link accents — never as a large surface fill, icon background, or decorative wash longer than a section
- Set display headlines in Inter 700/900 italic at 70–79px, line-height 1.00, letter-spacing -0.002em — the italic at scale is the brand's typographic signature
- Build cards and tiles with 44px border-radius and the dual-layer shadow stack (0 32px 80px rgba(0,0,0,0.22) + 0 2px 8px rgba(0,0,0,0.08))
- Use Oat Canvas (#f6f2ee) as the base page background — do not switch to pure white for full-page surfaces
- Pair every email input with the Pill CTA inside a single white pill container (99px radius) to read as one composite unit
- Center hero compositions — headline, subtext, and CTA stack vertically with generous 113px section gaps between major bands
- Keep icons stroke-based in Stone (#848383) at 1.5–2px weight, never filled with color

### Don't
- Do not use upright (non-italic) weight 700+ for display headlines — the italic slope is what makes Playful feel editorial rather than corporate
- Do not introduce additional accent colors — blue, green, orange, purple are all out of system; Hot Magenta is the only chromatic voice
- Do not use pure black (#000000) on pure white (#ffffff) for body text without checking — use #111 or #0f172a for less harshness on the warm canvas
- Do not apply sharp 0–4px radii to cards or buttons — the 16/44/99px scale is part of the friendly softness
- Do not stack more than two type weights on a single screen — typically 400 body + 700/900 italic display, with 500/600 for subheads
- Do not place white cards directly on white — always sit Paper White on Oat Canvas so cards read as elevated
- Do not use drop shadows on text, buttons, or icons — shadows are reserved for card-level elevation only

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Oat Canvas | `#f6f2ee` | Base page background — the warm cream that sets the entire system apart from cold-white SaaS |
| 1 | Paper White | `#ffffff` | Card and elevated panel surface sitting on the oat canvas |
| 2 | Soft Ink | `#111111` | Dark card variant and navigation bar background |
| 3 | Hot Magenta | `#ff2e95` | Accent surface — CTA fills, highlight wash zones |

## Elevation

- **FAQ card / app tile:** `rgba(0, 0, 0, 0.22) 0px 32px 80px 0px, rgba(0, 0, 0, 0.08) 0px 2px 8px 0px`

## Imagery

Visual language is illustration-led, not photographic. The site shows stylized 3D app icons and playful character mascots (broccoli with face, pink blob, blue ghost, white creature) rendered in soft 3D with rounded, candy-like surfaces and saturated color. Illustrations sit inside rounded square app tiles (44px radius) that are slightly tilted and overlapping in a fan arrangement, evoking a hand of cards rather than a rigid grid. No photography appears anywhere — the warmth comes from the cream canvas and the 3D illustration style, not from lifestyle imagery. Icons in the UI itself are minimal line icons in muted gray, not colorful.

## Layout

Centered, max-width 1200px container with generous 113px section gaps between major vertical bands. The page rhythm alternates between quiet warm-cream sections (hero, FAQ) and a single vivid pink gradient wash section in the middle. Hero is a centered stack: display headline → subtext → email+CTA pill composite → tilted row of app tiles. Below the gradient band, the FAQ section uses a two-column layout (label left, accordion stack right) before returning to a centered final CTA. A full-width black category navigation bar cuts across the page at the transition between hero and gradient sections, providing the only dark band. The overall density is spacious — single elements breathe rather than packing into grids.

## Agent Prompt Guide

**Quick Color Reference**
- text: #111111
- background: #f6f2ee
- border: #e8e5e0
- accent: #ff2e95
- primary action: #ff2e95 (filled action)

**Example Component Prompts**
1. Create a Primary Action Button: #ff2e95 background, #000000 text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.

2. Create an FAQ card: #ffffff surface, 44px border-radius, shadow 0 32px 80px rgba(0,0,0,0.22) + 0 2px 8px rgba(0,0,0,0.08). Question text Inter 600 italic 18px #111111, chevron icon in #848383.

3. Create an app tile: 160px square, 44px border-radius, #ffffff surface, same shadow stack as FAQ card. Contains a centered 3D-style illustration in saturated color.

4. Create a gradient highlight section: full-width background blending from #ff2e95 through lavender to #f6f2ee (radial or large soft linear). Headline at 30px Inter italic 600, #111111, centered — mix regular and italic weight words for emphasis.

5. Create a category nav bar: #000000 background, full width, Inter 500 14px white text, items spaced 28px apart horizontally, 12px 0 vertical padding.

## Shadow Language

The system uses exactly one shadow stack, applied to cards and tiles only. It is a two-layer diffused shadow: a large soft 80px-blur shadow at 22% opacity providing the deep 'lift' off the warm canvas, plus a tight 8px-blur shadow at 8% opacity providing the contact-edge definition. Buttons, text, icons, and inputs receive no shadows. This restraint — shadow as elevation marker, not decoration — keeps the interface feeling like printed paper lifted off a desk rather than a glassmorphic product.

## Similar Brands

- **Linear** — Same editorial confidence in display typography (large heavy weight, tight letter-spacing) and a single vivid accent against a monochrome system — though Linear's palette is dark, Playful's italic display shares the same poster-like typographic attitude
- **Notion** — Warm off-white canvas (#f6f2ee echoes Notion's slight cream tint) with generous spacing and a minimalist component vocabulary — the friendliness of the surface treatment is the shared trait
- **Pitch** — Same large italic display headlines, cream/warm canvas, and pill-shaped primary CTA, with a single chromatic accent for action — Pitch's editorial product design language is the closest aesthetic cousin
- **Framer** — Bold typographic statements over warm neutral surfaces, with one bold accent color (Framer's blue, Playful's magenta) — both treat the hero as an editorial moment rather than a feature checklist
- **Vercel** — Generous whitespace, soft elevated cards, and the discipline of one accent color doing all chromatic work — though Vercel is dark-mode, the spatial generosity and single-accent philosophy is structurally similar

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-hot-magenta: #ff2e95;
  --color-ink-black: #000000;
  --color-oat-canvas: #f6f2ee;
  --color-soft-ink: #111111;
  --color-slate: #0f172a;
  --color-charcoal: #414040;
  --color-stone: #848383;
  --color-paper-white: #ffffff;
  --color-warm-mist: #e8e5e0;
  --color-sand: #e2dcd6;
  --color-driftwood: #c3c1bf;
  --color-midnight: #202126;

  /* Typography — Font Families */
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-arial: 'Arial', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 13px;
  --leading-caption: 1.4;
  --tracking-caption: -0.026px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.032px;
  --text-body-lg: 18px;
  --leading-body-lg: 1.5;
  --tracking-body-lg: -0.036px;
  --text-subheading: 26px;
  --leading-subheading: 1.23;
  --tracking-subheading: -0.052px;
  --text-heading-sm: 30px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: -0.06px;
  --text-display: 79px;
  --leading-display: 1;
  --tracking-display: -0.158px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
  --font-weight-black: 900;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-5: 5px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-14: 14px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-25: 25px;
  --spacing-26: 26px;
  --spacing-30: 30px;
  --spacing-32: 32px;
  --spacing-36: 36px;
  --spacing-60: 60px;
  --spacing-180: 180px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 113px;
  --card-padding: 24px;
  --element-gap: 10-16px;

  /* Border Radius */
  --radius-2xl: 16px;
  --radius-3xl: 44px;
  --radius-full: 99px;
  --radius-full-2: 999px;

  /* Named Radii */
  --radius-tags: 999px;
  --radius-cards: 44px;
  --radius-images: 16px;
  --radius-inputs: 99px;
  --radius-buttons: 99px (pill);

  /* Shadows */
  --shadow-xl: rgba(0, 0, 0, 0.22) 0px 32px 80px 0px, rgba(0, 0, 0, 0.08) 0px 2px 8px 0px;

  /* Surfaces */
  --surface-oat-canvas: #f6f2ee;
  --surface-paper-white: #ffffff;
  --surface-soft-ink: #111111;
  --surface-hot-magenta: #ff2e95;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-hot-magenta: #ff2e95;
  --color-ink-black: #000000;
  --color-oat-canvas: #f6f2ee;
  --color-soft-ink: #111111;
  --color-slate: #0f172a;
  --color-charcoal: #414040;
  --color-stone: #848383;
  --color-paper-white: #ffffff;
  --color-warm-mist: #e8e5e0;
  --color-sand: #e2dcd6;
  --color-driftwood: #c3c1bf;
  --color-midnight: #202126;

  /* Typography */
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-arial: 'Arial', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 13px;
  --leading-caption: 1.4;
  --tracking-caption: -0.026px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.032px;
  --text-body-lg: 18px;
  --leading-body-lg: 1.5;
  --tracking-body-lg: -0.036px;
  --text-subheading: 26px;
  --leading-subheading: 1.23;
  --tracking-subheading: -0.052px;
  --text-heading-sm: 30px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: -0.06px;
  --text-display: 79px;
  --leading-display: 1;
  --tracking-display: -0.158px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-5: 5px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-14: 14px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-25: 25px;
  --spacing-26: 26px;
  --spacing-30: 30px;
  --spacing-32: 32px;
  --spacing-36: 36px;
  --spacing-60: 60px;
  --spacing-180: 180px;

  /* Border Radius */
  --radius-2xl: 16px;
  --radius-3xl: 44px;
  --radius-full: 99px;
  --radius-full-2: 999px;

  /* Shadows */
  --shadow-xl: rgba(0, 0, 0, 0.22) 0px 32px 80px 0px, rgba(0, 0, 0, 0.08) 0px 2px 8px 0px;
}
```
