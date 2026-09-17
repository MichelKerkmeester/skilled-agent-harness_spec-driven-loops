# ElevenReader — Style Reference
> newsprint minimalism with a single color bloom

**Theme:** light

ElevenReader runs on a near-monochrome visual language: paper-white canvas, ink-black type, and hairline gray borders doing all the structural work. A single custom display face (WaldenburgHF, bold only) carries every heading at a fixed tight leading, creating a single typographic voice across the whole product surface. The interface stays flat — no shadows, no elevation stacks, no decorative gradients in the UI — with one moment of color appearing as an atmospheric radial wash in the hero (forest green dissolving into lavender) that sets an emotional tone without ever repeating inside components. Pill-shaped controls (9999px radius), large generous gutters, and a single weight contrast (Inter 400 vs 700) keep the system feeling like printed editorial spread — content-first, ornament-last.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Ink | `#000000` | `--color-ink` | Dark supporting neutral for text, icons, and strong contrast. Do not promote it to the primary CTA color |
| Paper | `#ffffff` | `--color-paper` | Light supporting surface for subtle backgrounds and section separation. Do not promote it to the primary CTA color |
| Mist | `#f2f2f2` | `--color-mist` | Page canvas, subtle alternating section backgrounds, secondary surface tone behind cards |
| Bone | `#e5e5e5` | `--color-bone` | Hairline borders, dividers between stacked rows, FAQ item outlines, low-contrast separators |
| Lavender Haze | `#c8d5f4` | `--color-lavender-haze` | Soft atmospheric wash — appears only as a near-gray tinted background band near the hero, never as a functional UI color |
| Graphite | `#767676` | `--color-graphite` | Muted body text, metadata, helper copy — secondary reading layer under Ink headlines |
| Slate | `#6e6e6e` | `--color-slate` | Tertiary captions, press attribution, supplementary labels |
| Hero Bloom | `radial-gradient(50% 50%, rgb(36, 63, 43) 0%, rgb(66, 141, 116) 54%, rgb(165, 177, 221) 78.5%, rgb(236, 230, 244) 99%)` | `--color-hero-bloom` | Decorative atmospheric radial gradient — forest-green to lavender wash used only behind the hero media block, never repeated in components |

## Tokens — Typography

### WaldenburgHF — Display and heading face — used exclusively at weight 700 across all heading levels (28/32/48px). This single-weight discipline is the signature: no light/medium variants, no italic. The fixed 1.10 leading and 0.01em tracking make headings sit close and tight, like editorial pull quotes. · `--font-waldenburghf`
- **Substitute:** Bricolage Grotesque (Google) at 800 weight, or Mona Sans at 800
- **Weights:** 700
- **Sizes:** 28px, 32px, 48px
- **Line height:** 1.10
- **Letter spacing:** 0.0100em
- **Role:** Display and heading face — used exclusively at weight 700 across all heading levels (28/32/48px). This single-weight discipline is the signature: no light/medium variants, no italic. The fixed 1.10 leading and 0.01em tracking make headings sit close and tight, like editorial pull quotes.

### Inter — Body, UI labels, navigation, button text, captions, footer. The 400/700 binary (no 500/600) keeps the system visually restrained — only two text voices exist. Body text reads at 16px/1.40, the standard comfortable reading rhythm; small UI labels drop to 14px/1.43 and 12px/1.60. · `--font-inter`
- **Substitute:** Inter (same family — it's already Google-hosted)
- **Weights:** 400, 700
- **Sizes:** 12px, 14px, 16px, 18px
- **Line height:** 1.40–1.60 (12px: 1.60, 14px: 1.43, 16px: 1.40, 18px: 1.10)
- **Letter spacing:** 0.0100em
- **OpenType features:** `"ss01" off, "cv11" off`
- **Role:** Body, UI labels, navigation, button text, captions, footer. The 400/700 binary (no 500/600) keeps the system visually restrained — only two text voices exist. Body text reads at 16px/1.40, the standard comfortable reading rhythm; small UI labels drop to 14px/1.43 and 12px/1.60.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.6 | 0.12px | `--text-caption` |
| body-sm | 14px | 1.43 | 0.14px | `--text-body-sm` |
| body | 16px | 1.4 | 0.16px | `--text-body` |
| subheading | 18px | 1.1 | 0.18px | `--text-subheading` |
| heading-sm | 28px | 1.1 | 0.28px | `--text-heading-sm` |
| heading-lg | 32px | 1.1 | 0.32px | `--text-heading-lg` |
| display | 48px | 1.1 | 0.48px | `--text-display` |

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
| 40 | 40px | `--spacing-40` |
| 44 | 44px | `--spacing-44` |
| 60 | 60px | `--spacing-60` |
| 64 | 64px | `--spacing-64` |
| 100 | 100px | `--spacing-100` |
| 120 | 120px | `--spacing-120` |
| 140 | 140px | `--spacing-140` |
| 200 | 200px | `--spacing-200` |

### Border Radius

| Element | Value |
|---------|-------|
| nav | 9999px |
| cards | 16px |
| other | 8px |
| buttons | 9999px |
| link-underline | 2px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| subtle | `rgba(16, 24, 40, 0.05) 0px 1px 2px 0px` | `--shadow-subtle` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 64px
- **Card padding:** 28px
- **Element gap:** 8px

## Components

### Filled CTA Button
**Role:** Primary action — trial signup, app download

Pill shape (9999px radius), #000000 background, #ffffff text, Inter 700 at 14px, letter-spacing 0.14px, padding 10px 20px. No border. The black-on-white pill is the only filled control in the system.

### Ghost/Outlined Button
**Role:** Secondary action — 'TRY IT NOW', 'TRY NOW'

Pill shape (9999px radius), #ffffff background, #e5e5e5 hairline border (1px), #000000 text, Inter 700 at 14px, padding 10px 20px. Mirrors the filled CTA's geometry so the two can sit side-by-side as a primary/secondary pair.

### Pill Navigation Link
**Role:** Top nav and footer nav items

Pill shape (9999px), #ffffff background, #000000 text in Inter 400–700 at 14px, padding 8px 16px. Active state uses filled black fill with white text.

### Video Play Button
**Role:** Centered call-to-watch on the hero gradient panel

Pill shape (9999px), #000000 background, #ffffff text 'Watch film' in Inter 700 14px, with a leading 32px-diameter white circle containing a black play triangle. Padding 12px 20px 12px 12px.

### FAQ Accordion Row
**Role:** Expandable question in the FAQ section

Full-width row, 1px #e5e5e5 top/bottom border, no side borders, #ffffff background. Question text in Inter 700 at 16px in #000000, right-aligned '+' icon in #000000 at 16px. Padding 16px 20px. Rows stack vertically with 0px gap between siblings — the border does the separating.

### Press Mention Card
**Role:** Editorial coverage tile in the press strip

No visible card container — text is set directly on #ffffff canvas. Headline in Inter 700 at 16px, #000000, max 3 lines, followed by the publication's logo (green TechCrunch, purple VentureBeat, black Variety, etc.) in their own brand colors. The publication logos are the only color in the page below the hero.

### Phone App Mockup
**Role:** Hero product demonstration

Tall portrait device frame (rounded 30px corners), #ffffff screen surface, showing app UI. Sits centered below the hero headline, visually anchored by the radial gradient wash behind it. The mockup has no drop shadow — it floats on the gradient.

### QR Download Widget
**Role:** Floating app download prompt (left-bottom corner)

Small white card, 16px radius, 1px #e5e5e5 border, 16px padding. Contains brand wordmark in Inter 700, a black-on-white QR code, and a 'GET THE APP' label in Inter 700 12px caps. A small × close button in the top-right.

### Hero Atmospheric Panel
**Role:** Single-use gradient section behind the watch-film CTA

Full-width band filled with a radial gradient from deep forest green (36, 63, 43) through teal (66, 141, 116) to lavender (165, 177, 221) to near-white lilac (236, 230, 244). No border, no radius, no shadow. The only colored surface in the system — intentionally used once.

### Eyebrow Tag
**Role:** Small section identifier above hero headline

Inter 700 at 12px, #000000, uppercase, letter-spacing 0.12px, preceded by a 16px-square icon container with 4px radius.

## Do's and Don'ts

### Do
- Use WaldenburgHF (or substitute Bricolage Grotesque 800) at 28/32/48px with lineHeight 1.10 for every heading — never use Inter for display sizes
- Use 9999px border-radius on every button, nav item, and pill control; reserve 16px for cards and 8px for small inline containers
- Set body text at Inter 400/16px with 1.40 leading and 0.16px letter-spacing — never go below 1.40 leading for 16px text
- Separate FAQ rows and stacked lists with 1px #e5e5e5 borders rather than background tints or gaps
- Use #f2f2f2 for the page canvas and #ffffff for all cards/elevated surfaces — these two values carry the entire surface system
- Render the hero atmospheric gradient (radial, forest-green to lavender) exactly once per page — never repeat it in body sections
- Pair the filled black pill button with a white ghost pill button as the canonical primary/secondary CTA duo

### Don't
- Don't introduce a chromatic accent color for CTAs or interactive states — the system has no distinct action color; all actions read through the black/white pill pair
- Don't use WaldenburgHF at any weight other than 700 — the single-weight discipline is the signature
- Don't apply drop shadows anywhere except a single 1px 0 1 2 rgba(16,24,40,0.05) on the filled CTA — elevation is intentionally absent
- Don't use #c8d5f4 as a functional UI color — it's an atmospheric tint, not a token
- Don't use Inter at 500 or 600 weight — only 400 and 700 exist in the system
- Don't add gaps between FAQ accordion rows — the 1px border IS the separator
- Don't let section gaps fall below 48px — the design relies on generous vertical whitespace to feel editorial

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas | `#f2f2f2` | Base page background, used as the negative space between content bands |
| 1 | Surface | `#ffffff` | Card backgrounds, FAQ rows, button fills (ghost), product mockup screen |
| 2 | Tinted Band | `#f2f5fc` | Subtle blue-tinted section backgrounds derived from the hero gradient |
| 3 | Atmospheric | `#c8d5f4` | Lavender haze in the radial gradient — decorative, not interactive |

## Elevation

- **Filled CTA Button:** `0px 1px 2px 0px rgba(16, 24, 40, 0.05)`

## Imagery

Product mockups dominate: a tall phone-shaped device frame showing the app interface sits at the center of the hero, and a second device frame appears in the watch-film gradient panel. Both mockups use #ffffff screen backgrounds with no device shadow — they float on whatever surface holds them. No photography, no lifestyle imagery, no stock visuals. Press logos (TechCrunch green, VentureBeat purple, Variety black, Bolt U) appear in their native brand colors as the only chromatic content below the hero, serving as social proof. Icons are minimal — a single 16px square, a QR pattern, a play triangle, and ± toggle marks — all rendered in flat #000000 with no decoration.

## Layout

Max-width 1200px centered container with generous side gutters. The page is a single vertical scroll with alternating surface bands: white hero → gradient atmospheric panel → white press strip → white FAQ section. Hero is split asymmetrically — headline and CTAs left-aligned in the upper-left, phone mockup centered below. The gradient panel is a full-bleed horizontal band that breaks the container width to span the viewport. Sections are separated by vertical whitespace (64px+) rather than dividers. FAQ uses a full-width single-column stack. Press mentions flow in a 4-column grid at desktop. Navigation is a minimal top bar: brand wordmark left, two links center, two buttons right — no mega-menu, no sidebar.

## Agent Prompt Guide

**Quick Color Reference**
- text: #000000 (Ink)
- background: #f2f2f2 (Mist)
- card/surface: #ffffff (Paper)
- border: #e5e5e5 (Bone)
- muted text: #767676 (Graphite)
- primary action: no distinct CTA color

**3–5 Example Component Prompts**
1. *Build a filled pill button:* 9999px radius, #000000 background, #ffffff text, Inter 700 at 14px with 0.14px letter-spacing, padding 10px 20px, no border, optional 0 1px 2px rgba(16,24,40,0.05) shadow.
No distinct primary action color was observed; use the extracted neutral button treatments instead of inventing a filled CTA color.
3. *Build a FAQ accordion row:* full-width, #ffffff background, 1px #e5e5e5 top and bottom border (no side borders), question text in Inter 700/16px #000000, right-aligned '+' icon in #000000, padding 16px 20px. Stack with 0px gap between rows — borders do the separating.
5. *Build a press mention card:* no container, headline in Inter 700/16px #000000 over #ffffff, followed by the publication's logo in its own brand color at ~32px height. Arrange in a 4-column grid with 20px column gap.

## Similar Brands

- **Readwise Reader** — Same editorial-print approach: paper-white canvas, hairline gray dividers, single-weight heading voice, generous whitespace, and zero chromatic UI accents
- **Notion** — Near-monochrome palette with ink-black text, pill-shaped controls, and flat surfaces — ElevenReader pushes the same restraint further with no color and a custom display face
- **Are.na** — Print-like minimalism with a single bold heading weight, 1px gray row separators in lists, and white-on-white layering with no shadows
- **Linear** — Pill-shaped buttons, tight typographic leading, and a near-achromatic interface — but ElevenReader drops Linear's purple accent entirely
- **The Browser Company (Arc)** — Custom display typography for headings, generous vertical rhythm, and a willingness to use one atmospheric gradient as the page's only moment of color

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-ink: #000000;
  --color-paper: #ffffff;
  --color-mist: #f2f2f2;
  --color-bone: #e5e5e5;
  --color-lavender-haze: #c8d5f4;
  --color-graphite: #767676;
  --color-slate: #6e6e6e;
  --color-hero-bloom: #a5b1dd;
  --gradient-hero-bloom: radial-gradient(50% 50%, rgb(36, 63, 43) 0%, rgb(66, 141, 116) 54%, rgb(165, 177, 221) 78.5%, rgb(236, 230, 244) 99%);

  /* Typography — Font Families */
  --font-waldenburghf: 'WaldenburgHF', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.6;
  --tracking-caption: 0.12px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.43;
  --tracking-body-sm: 0.14px;
  --text-body: 16px;
  --leading-body: 1.4;
  --tracking-body: 0.16px;
  --text-subheading: 18px;
  --leading-subheading: 1.1;
  --tracking-subheading: 0.18px;
  --text-heading-sm: 28px;
  --leading-heading-sm: 1.1;
  --tracking-heading-sm: 0.28px;
  --text-heading-lg: 32px;
  --leading-heading-lg: 1.1;
  --tracking-heading-lg: 0.32px;
  --text-display: 48px;
  --leading-display: 1.1;
  --tracking-display: 0.48px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-bold: 700;

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
  --spacing-40: 40px;
  --spacing-44: 44px;
  --spacing-60: 60px;
  --spacing-64: 64px;
  --spacing-100: 100px;
  --spacing-120: 120px;
  --spacing-140: 140px;
  --spacing-200: 200px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 64px;
  --card-padding: 28px;
  --element-gap: 8px;

  /* Border Radius */
  --radius-sm: 2px;
  --radius-lg: 8px;
  --radius-2xl: 16px;
  --radius-3xl: 30px;
  --radius-full: 9999px;

  /* Named Radii */
  --radius-nav: 9999px;
  --radius-cards: 16px;
  --radius-other: 8px;
  --radius-buttons: 9999px;
  --radius-link-underline: 2px;

  /* Shadows */
  --shadow-subtle: rgba(16, 24, 40, 0.05) 0px 1px 2px 0px;

  /* Surfaces */
  --surface-canvas: #f2f2f2;
  --surface-surface: #ffffff;
  --surface-tinted-band: #f2f5fc;
  --surface-atmospheric: #c8d5f4;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-ink: #000000;
  --color-paper: #ffffff;
  --color-mist: #f2f2f2;
  --color-bone: #e5e5e5;
  --color-lavender-haze: #c8d5f4;
  --color-graphite: #767676;
  --color-slate: #6e6e6e;
  --color-hero-bloom: #a5b1dd;

  /* Typography */
  --font-waldenburghf: 'WaldenburgHF', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.6;
  --tracking-caption: 0.12px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.43;
  --tracking-body-sm: 0.14px;
  --text-body: 16px;
  --leading-body: 1.4;
  --tracking-body: 0.16px;
  --text-subheading: 18px;
  --leading-subheading: 1.1;
  --tracking-subheading: 0.18px;
  --text-heading-sm: 28px;
  --leading-heading-sm: 1.1;
  --tracking-heading-sm: 0.28px;
  --text-heading-lg: 32px;
  --leading-heading-lg: 1.1;
  --tracking-heading-lg: 0.32px;
  --text-display: 48px;
  --leading-display: 1.1;
  --tracking-display: 0.48px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-28: 28px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-44: 44px;
  --spacing-60: 60px;
  --spacing-64: 64px;
  --spacing-100: 100px;
  --spacing-120: 120px;
  --spacing-140: 140px;
  --spacing-200: 200px;

  /* Border Radius */
  --radius-sm: 2px;
  --radius-lg: 8px;
  --radius-2xl: 16px;
  --radius-3xl: 30px;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-subtle: rgba(16, 24, 40, 0.05) 0px 1px 2px 0px;
}
```
