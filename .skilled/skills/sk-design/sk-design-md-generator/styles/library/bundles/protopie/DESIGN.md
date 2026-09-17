# ProtoPie — Style Reference
> sunlit prototyping workshop with violet ink — a designer's clean white drafting table where one electric purple pencil marks every interactive idea.

**Theme:** light

ProtoPie uses a sunlit prototyping-workshop language: a white canvas, near-black ink, and one confident violet that functions as the only chromatic voice in the system. Display type is set in Gilroy at generous sizes (48–62px) with weight 700, giving headlines a friendly, designer-made feel rather than a corporate one. The interface stays predominantly monochrome; violet appears as functional accent on buttons, links, icons, and active states, never as decorative tint. Components feel like tools in a studio tray: 16px card radius, 12px button radius, pill-shaped tags, and a single near-imperceptible shadow that lifts without announcing itself. Backgrounds are white with whisper-soft radial gradient washes in pastel teal and lavender, creating depth that never competes with content.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Electric Violet | `#8169ff` | `--color-electric-violet` | Violet supporting accent for decorative details and low-frequency emphasis. Do not promote it to the primary CTA color |
| Deep Iris | `#6d4ff0` | `--color-deep-iris` | Pressed and hover state of Electric Violet — used for filled-element interaction feedback and slightly deeper icon strokes |
| Soft Lilac | `#c9bfff` | `--color-soft-lilac` | Light accent wash — decorative gradient stops, soft tag backgrounds, muted selected states, and atmospheric color bleeds at section edges |
| Ink Black | `#000000` | `--color-ink-black` | Primary text, hero headlines, high-contrast icons. The strongest typographic color, reserved for content the eye should land on first |
| Carbon | `#181818` | `--color-carbon` | Navigation text, input borders, near-black UI surfaces, button labels. Softer than pure black so it reads as interface, not print |
| Graphite | `#555555` | `--color-graphite` | Body text, supporting copy, secondary labels, paragraph running text under headlines |
| Silver | `#999999` | `--color-silver` | Muted text, placeholders, disabled labels, captions, subtitle hierarchy. The quietest text tier, used only for de-emphasized content |
| Paper White | `#ffffff` | `--color-paper-white` | Page canvas, card surfaces, button text on filled violet, elevated panel backgrounds |
| Aqua Wash | `radial-gradient(47.72% 108.66% at -12.1% 21.18%, rgba(129, 219, 219, 0.25) 24.27%, rgba(160, 232, 232, 0) 100%)` | `--color-aqua-wash` | Decorative gradient stop — pastel teal radial wash on hero left side, atmospheric background tint that never fills a UI element |
| Lilac Bleed | `radial-gradient(62.81% 136.54% at 103.92% 77.32%, rgba(227, 222, 255, 0.7) 0%, rgba(201, 191, 255, 0) 100%)` | `--color-lilac-bleed` | Decorative gradient stop — pastel lavender radial wash on hero right side and section-edge color bleeds, creating depth at zero contrast cost |

## Tokens — Typography

### Gilroy — Primary display and brand typeface — headlines, hero copy, nav, button labels. Custom geometric sans with a friendly, designer-made personality; weight 700 at 48–62px defines the brand voice. Weight 400 is used for body and nav. · `--font-gilroy`
- **Substitute:** Manrope, Plus Jakarta Sans, or Outfit
- **Weights:** 400, 700
- **Sizes:** 16px, 18px, 20px, 22px, 28px, 48px, 62px
- **Line height:** 1.29–1.60
- **Role:** Primary display and brand typeface — headlines, hero copy, nav, button labels. Custom geometric sans with a friendly, designer-made personality; weight 700 at 48–62px defines the brand voice. Weight 400 is used for body and nav.

### Inter — Secondary UI and body typeface — input text, form labels, small captions, inline metadata, and any context where Gilroy would feel too display-heavy. Reads as a neutral workhorse underneath the brand voice. · `--font-inter`
- **Substitute:** system-ui, IBM Plex Sans
- **Weights:** 400, 500, 600, 700
- **Sizes:** 12px, 14px, 16px, 18px, 24px
- **Line height:** 1.30–1.67
- **Role:** Secondary UI and body typeface — input text, form labels, small captions, inline metadata, and any context where Gilroy would feel too display-heavy. Reads as a neutral workhorse underneath the brand voice.

### Palmer Lake Print — Decorative script accent — used once per page for hand-drawn section annotations (e.g. "TRY DEMO BELOW"). Carries a personal, hand-made quality that reinforces the prototyping-workshop atmosphere. Never used for functional UI. · `--font-palmer-lake-print`
- **Substitute:** Caveat, Kalam
- **Weights:** 400
- **Sizes:** 32px
- **Line height:** 0.80
- **Role:** Decorative script accent — used once per page for hand-drawn section annotations (e.g. "TRY DEMO BELOW"). Carries a personal, hand-made quality that reinforces the prototyping-workshop atmosphere. Never used for functional UI.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.5 | — | `--text-caption` |
| body-sm | 14px | 1.5 | — | `--text-body-sm` |
| body | 16px | 1.56 | — | `--text-body` |
| subheading | 20px | 1.45 | — | `--text-subheading` |
| heading-sm | 24px | 1.4 | — | `--text-heading-sm` |
| heading | 28px | 1.33 | — | `--text-heading` |
| heading-lg | 48px | 1.29 | — | `--text-heading-lg` |
| display | 62px | 1.16 | — | `--text-display` |

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
| 48 | 48px | `--spacing-48` |
| 56 | 56px | `--spacing-56` |
| 64 | 64px | `--spacing-64` |
| 72 | 72px | `--spacing-72` |
| 80 | 80px | `--spacing-80` |
| 140 | 140px | `--spacing-140` |
| 160 | 160px | `--spacing-160` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 9999px |
| cards | 16px |
| pills | 9999px |
| inputs | 8px |
| avatars | 9999px |
| buttons | 12px |
| small-chips | 4px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| md | `rgba(0, 0, 0, 0.12) 0px 3px 12px 0px, rgba(0, 0, 0, 0.3) ...` | `--shadow-md` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 24px
- **Element gap:** 16px

## Components

### Primary Filled Button
**Role:** Primary interactive action — "Get Started for Free", "Get Started" in nav, single highest-priority action per screen.

Filled Electric Violet #8169ff background, white #ffffff text, 12px border radius, 16px vertical / 24px horizontal padding. Gilroy weight 700 at 16–18px. Hover transitions to Deep Iris #6d4ff0. No border. Single instance per viewport.

### Pill Tag / Chip
**Role:** Label badges for categories, filter pills, and small interactive chips.

9999px border radius (full pill), 6px vertical / 12px horizontal padding. Background is Soft Lilac #c9bfff at 20–30% opacity or transparent with violet text. Gilroy 400 at 12–14px in Electric Violet.

### Ghost Text Link
**Role:** Secondary inline action — "Talk to Sales", inline links inside body copy.

No background, no border. Text in Electric Violet #8169ff at 16–18px Gilroy 400, underline optional on hover only. Sits inline with surrounding text.

### Icon Search Button
**Role:** Utility trigger in the top-right of the navigation bar.

40×40px circular (9999px radius) ghost button. Dark Carbon #181818 magnifying-glass icon at 18px on transparent background. Hover adds 8% black fill.

### Top Navigation Bar
**Role:** Persistent site navigation.

White #ffffff background with no border and no shadow, sitting flush at the top. Height ~64px. Contains: violet "P" logo (left), 4–5 dropdown nav items in Carbon #181818 at 16px Gilroy 400, then search icon + violet text link + filled violet button (right). Generous horizontal padding 24–40px.

### Product Demo Panel
**Role:** Hero feature visual — embedded screenshot of the ProtoPie app interface.

White card, 16px border radius, 24px internal padding around the embedded UI screenshot, soft shadow `rgba(0,0,0,0.12) 0 3px 12px`. Sits centered below the hero headline with 32–48px top margin. Width approaches 100% of the 1200px container.

### Testimonial Card
**Role:** Social proof quote with attribution.

White card, 16px border radius, 24–32px padding, soft shadow. Top row: 40px circular avatar (9999px) + name in Ink Black 16px Gilroy 700 + title in Graphite #555555 14px. Quote body: 16–18px Gilroy 400 in Ink Black. Optional play button (see Play Button) anchored bottom-center.

### Play Button
**Role:** Video play trigger inside testimonial and demo cards.

48–56px circular (9999px) Carbon #181818 background, white triangle play icon centered. No border, no shadow on the button itself; sits over the card.

### Company Logo Badge
**Role:** Trust signal — partner/brand logo in a circular container.

80–96px circle (9999px radius), white #ffffff background, 1px Silver #999999 hairline border, logo centered at ~50% width. Used in the "trusted by" carousel and testimonial section.

### Trust Logo Cell
**Role:** Grayscale partner logos in the "trusted by world's top design teams" section.

No container, no border. Logo rendered in Graphite #555555 or Silver #999999 at uniform height (~28px), arranged in a 6×2 grid. Logos are intentionally desaturated to keep the violet accent as the only chromatic element on the page.

### Import Source Badge
**Role:** Small icon badges showing supported design-tool imports (Figma, Sketch, Adobe XD).

~32px square with 8px radius, logo centered, white background. No text. Arranged in a tight horizontal row with 12–16px gap.

### Annotation Caption
**Role:** Decorative hand-drawn label — e.g. "TRY DEMO BELOW", "HIGHLY SECURE", "REMOTE FRIENDLY".

Set in Palmer Lake Print at 32px, line-height 0.80, Electric Violet #8169ff color. Rotated -3° to -8° for hand-placed feel. One or two per page maximum; never functional.

## Do's and Don'ts

### Do
- Use Electric Violet #8169ff for every brand-voice surface: filled buttons, active links, key icons, active nav. The system has one chromatic color — do not introduce a second.
- Set display headlines in Gilroy 700 at 48–62px, line-height 1.16–1.29. The generous size and tight leading is the brand's visual signature.
- Use 16px radius for all cards and large surfaces, 12px for rectangular buttons, and 9999px (full pill) for tags, chips, and avatars. The radius vocabulary is the system's silhouette.
- Build spacing on a 4px base: 8 / 12 / 16 / 24 / 32 / 64 / 80. All values should be multiples of 4.
- Apply the single shadow `rgba(0,0,0,0.12) 0 3px 12px, rgba(0,0,0,0.3) 0 0 2px` for any elevated card. Heavier shadows break the flat, near-paper feel.
- Keep body copy in Inter 400 at 16px, Graphite #555555 for secondary text, Silver #999999 only for placeholders and disabled state.
- Layer the two radial gradients (Aqua Wash on hero left, Lilac Bleed on hero right) at 20–25% max opacity. They create atmosphere, not pattern.

### Don't
- Do not introduce a second accent color. The system is monochrome + one violet; any additional hue dilutes the brand voice.
- Do not use pure #000000 for UI surfaces or button labels — reserve it for headlines. Use Carbon #181818 for nav, inputs, and interactive UI.
- Do not use shadows heavier than the single 3px/12px stack. Deep drop shadows or colored glows are off-system.
- Do not apply border-radius smaller than 4px. The design depends on generous rounding; sharp corners read as a different system.
- Do not set body or UI copy in Gilroy display weights. Gilroy is for headlines and nav; use Inter for anything functional or dense.
- Do not apply letter-spacing adjustments to Gilroy. Tracking is normal; the font's geometric proportions do the work.
- Do not place violet on tinted or gradient backgrounds. Electric Violet only sits on white, near-white, or Solid Lilac to keep contrast correct.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Paper White | `#ffffff` | Page canvas — the base layer every other surface sits on. |
| 1 | Elevated White | `#ffffff` | Card and panel surfaces — same hex as canvas, differentiated by the soft shadow `rgba(0,0,0,0.12) 0 3px 12px`. |
| 2 | Lilac Tint | `#c9bfff` | Tinted accent surfaces — selected states, soft tag fills, decorative wash overlays at low opacity. |
| 3 | Electric Violet | `#8169ff` | Filled interactive surfaces — brand button fills, active nav, key icon backgrounds. |

## Elevation

- **Elevated Card:** `rgba(0, 0, 0, 0.12) 0px 3px 12px 0px, rgba(0, 0, 0, 0.3) 0px 0px 2px 0px`
- **Product Demo Panel:** `rgba(0, 0, 0, 0.12) 0px 3px 12px 0px, rgba(0, 0, 0, 0.3) 0px 0px 2px 0px`
- **Testimonial Card:** `rgba(0, 0, 0, 0.12) 0px 3px 12px 0px, rgba(0, 0, 0, 0.3) 0px 0px 2px 0px`

## Imagery

The site uses embedded product-UI screenshots as its primary visual — full-bleed captures of the ProtoPie authoring canvas, shown in white cards with the soft system shadow. These are not marketing illustrations but real interface crops, letting the product speak for itself. Supporting imagery is minimal: circular company logos in the trust section (desaturated to Graphite/Silver so they don't compete with violet), small square import-source badges, and circular user avatars. Decorative graphics are limited to the two whisper-soft radial gradient washes in the hero (pastel teal on the left, pastel lavender on the right) and a handful of hand-drawn script annotations in Palmer Lake Print, rotated slightly to feel hand-placed. No photography, no 3D renders, no full-bleed lifestyle imagery. The visual language is product-centric: the tool is the hero, decoration is sparse and functional.

## Layout

Marketing-site structure, max-width 1200px centered with 24–40px outer padding. Hero is a vertically stacked centered composition: small nav, then a 48–62px headline, a 16–20px subhead, a single filled violet button, a small hand-drawn annotation, and a large product demo card sitting below the fold. Below the hero: an import-source badge row, then a 6×2 trust-logo grid centered on the page. Mid-page sections shift to social proof: a horizontal carousel of circular company-logo badges, a featured testimonial card with embedded video, and decorative script annotations floating in the page margins. Sections are separated by generous 80px vertical gaps with no dividers — flow is continuous. Navigation is a single sticky white top bar with no shadow. The overall rhythm is: one tall vertical hero, then a series of centered max-width content bands, each feeling like a separate workshop demo panel rather than a dense marketing page.

## Agent Prompt Guide

**Quick Color Reference**
- text: #000000 Ink Black (headlines), #181818 Carbon (nav/UI), #555555 Graphite (body), #999999 Silver (muted)
- background: #ffffff Paper White
- border: #999999 Silver (hairline), transparent (preferred)
- accent: #8169ff Electric Violet (brand), #c9bfff Soft Lilac (decorative wash)
- primary action: no distinct CTA color

**Example Component Prompts**
1. Build a centered hero section: white #ffffff canvas with a whisper-soft radial gradient (Lilac Bleed at 20% opacity on the right, Aqua Wash at 20% on the left). Headline: 62px Gilroy weight 700, Ink Black #000000, line-height 1.16. Subhead: 18px Gilroy 400, Graphite #555555. A single violet filled button (#8169ff, white text, 12px radius, 16px/24px padding) reading "Get Started for Free". Below, a product demo card: 16px radius, 24px padding, shadow rgba(0,0,0,0.12) 0 3px 12px, containing a screenshot of the ProtoPie authoring canvas.

2. Build a testimonial card: white surface, 16px border radius, 32px padding, shadow rgba(0,0,0,0.12) 0 3px 12px. Top row: 40px circular avatar (9999px radius) + "Jon Bernbach" in 16px Gilroy 700 Ink Black + "Product Designer, Meta" in 14px Inter 400 Graphite #555555. Quote below: 18px Gilroy 400 Ink Black. Bottom-center: 52px circular (9999px) Carbon #181818 play button with a white triangle icon.

3. Build a trust logo grid: 6 columns × 2 rows, 80px row height, 24px column gap, centered inside the 1200px container. Each cell holds a partner logo rendered in Graphite #555555 or Silver #999999 at 28px height, no containers, no borders. The grid sits under a 14px Inter 400 Graphite #555555 caption reading "Trusted by world's top design teams".

4. Build the top navigation: 64px tall, white #ffffff background, flush at top, no border, no shadow. Left: violet "P" logo mark + "ProtoPie" wordmark in Gilroy 700 Ink Black. Center-left: 5 nav items in 16px Gilroy 400 Carbon #181818 with caret icons on the dropdown items. Right cluster: 40px circular (9999px) ghost search button with a Carbon magnifying-glass icon, "Talk to Sales" violet #8169ff text link, then a violet filled button (#8169ff, white text, 12px radius) reading "Get Started".

5. Build a partner logo badge: 88px white circle (9999px radius) with 1px Silver #999999 hairline border. The partner logo sits centered at ~50% of the badge width, rendered in its original colors (this is the one place where multi-color is allowed, as it's contained inside the neutral badge). Badges arranged in a horizontal row with 24px gap, used in a carousel above testimonial cards.

## Signature Choices

1. **One chromatic voice.** Every other color is achromatic; Electric Violet #8169ff carries 100% of the brand's emotional weight. The system would feel generic the moment a second hue is introduced.

2. **Display weight at whisper-light sizes.** Gilroy is set at 62px hero with weight 700 — the contrast of geometric-cut display type against the ultra-clean white canvas is what makes the brand read as a designer's tool rather than a corporate product page.

3. **Three radius tiers, no in-between.** 4px (small chips), 12px (buttons), 16px (cards), 9999px (pills and avatars). There is no 6px or 10px in the vocabulary — the discontinuity is intentional and keeps the silhouette recognizable.

4. **Shadows that hide.** The single shadow stack uses 12% black at 12px blur — barely perceptible. Elevation is communicated by surface tint and shadow acting together, not by shadow alone.

5. **Pastel atmospheric washes.** The two radial gradients (teal left, lavender right) sit at 20–25% opacity and never enter the foreground. They exist to break the monotony of pure white without ever competing with content.

6. **Hand-drawn script as a one-per-page signature.** Palmer Lake Print appears once or twice per page as a rotated annotation, never as functional text. It signals "this is a creative tool" louder than any headline could.

## Similar Brands

- **Figma** — Shares the design-tool aesthetic with embedded product-UI screenshots as hero visuals, generous white canvas, and confident typographic headlines that feel maker-made rather than corporate.
- **Framer** — Same prototyping-tool context, similar use of a single saturated accent (Framer leans blue, ProtoPie violet) against a monochrome interface, and a hero built around a large centered headline above a product demo card.
- **Linear** — Shared minimal-marketing aesthetic: white canvas, near-black text, single accent color, generous letter-tightened display type, and ultra-rounded surfaces with near-imperceptible shadows.
- **Webflow** — Similar purple-toned brand accent and creator-tool voice, with marketing pages that alternate between clean type-led sections and embedded product screenshots in elevated white cards.
- **Origami Studio** — Same prototyping-tool category and card-heavy layout pattern, with each section presented as a self-contained white panel separated by generous vertical breathing room.

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-electric-violet: #8169ff;
  --color-deep-iris: #6d4ff0;
  --color-soft-lilac: #c9bfff;
  --color-ink-black: #000000;
  --color-carbon: #181818;
  --color-graphite: #555555;
  --color-silver: #999999;
  --color-paper-white: #ffffff;
  --color-aqua-wash: #81dbdb;
  --gradient-aqua-wash: radial-gradient(47.72% 108.66% at -12.1% 21.18%, rgba(129, 219, 219, 0.25) 24.27%, rgba(160, 232, 232, 0) 100%);
  --color-lilac-bleed: #e3deff;
  --gradient-lilac-bleed: radial-gradient(62.81% 136.54% at 103.92% 77.32%, rgba(227, 222, 255, 0.7) 0%, rgba(201, 191, 255, 0) 100%);

  /* Typography — Font Families */
  --font-gilroy: 'Gilroy', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-palmer-lake-print: 'Palmer Lake Print', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --text-body-sm: 14px;
  --leading-body-sm: 1.5;
  --text-body: 16px;
  --leading-body: 1.56;
  --text-subheading: 20px;
  --leading-subheading: 1.45;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.4;
  --text-heading: 28px;
  --leading-heading: 1.33;
  --text-heading-lg: 48px;
  --leading-heading-lg: 1.29;
  --text-display: 62px;
  --leading-display: 1.16;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

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
  --spacing-48: 48px;
  --spacing-56: 56px;
  --spacing-64: 64px;
  --spacing-72: 72px;
  --spacing-80: 80px;
  --spacing-140: 140px;
  --spacing-160: 160px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 24px;
  --element-gap: 16px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-2xl-2: 20px;
  --radius-full: 9999px;

  /* Named Radii */
  --radius-tags: 9999px;
  --radius-cards: 16px;
  --radius-pills: 9999px;
  --radius-inputs: 8px;
  --radius-avatars: 9999px;
  --radius-buttons: 12px;
  --radius-small-chips: 4px;

  /* Shadows */
  --shadow-md: rgba(0, 0, 0, 0.12) 0px 3px 12px 0px, rgba(0, 0, 0, 0.3) 0px 0px 2px 0px;

  /* Surfaces */
  --surface-paper-white: #ffffff;
  --surface-elevated-white: #ffffff;
  --surface-lilac-tint: #c9bfff;
  --surface-electric-violet: #8169ff;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-electric-violet: #8169ff;
  --color-deep-iris: #6d4ff0;
  --color-soft-lilac: #c9bfff;
  --color-ink-black: #000000;
  --color-carbon: #181818;
  --color-graphite: #555555;
  --color-silver: #999999;
  --color-paper-white: #ffffff;
  --color-aqua-wash: #81dbdb;
  --color-lilac-bleed: #e3deff;

  /* Typography */
  --font-gilroy: 'Gilroy', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-palmer-lake-print: 'Palmer Lake Print', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --text-body-sm: 14px;
  --leading-body-sm: 1.5;
  --text-body: 16px;
  --leading-body: 1.56;
  --text-subheading: 20px;
  --leading-subheading: 1.45;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.4;
  --text-heading: 28px;
  --leading-heading: 1.33;
  --text-heading-lg: 48px;
  --leading-heading-lg: 1.29;
  --text-display: 62px;
  --leading-display: 1.16;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-56: 56px;
  --spacing-64: 64px;
  --spacing-72: 72px;
  --spacing-80: 80px;
  --spacing-140: 140px;
  --spacing-160: 160px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-2xl-2: 20px;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-md: rgba(0, 0, 0, 0.12) 0px 3px 12px 0px, rgba(0, 0, 0, 0.3) 0px 0px 2px 0px;
}
```
