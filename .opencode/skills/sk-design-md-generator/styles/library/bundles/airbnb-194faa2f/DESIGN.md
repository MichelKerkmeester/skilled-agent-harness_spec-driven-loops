# Airbnb — Style Reference
> Editorial masthead on white paper — the page speaks through scale and silence, not color or ornament.

**Theme:** light

Airbnb.org is a stripped-down editorial system: pure achromatic canvas, oversized type, and dark-on-white CTAs that feel more like a nonprofit annual report than a tech brand site. Every color decision is denied except a single near-black action button — the page trusts typography and photography to carry emotion, never decoration. Surfaces alternate between stark white and a quiet warm gray (#f7f7f7), creating soft newspaper-like bands rather than dramatic light/dark shifts. Components are flat: no shadows, no gradients, no rounded pill buttons — just 8px-radius rectangles and 12px-radius media frames. The result reads as earnest, restrained, and institutional without feeling corporate.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Carbon Ink | `#222222` | `--color-carbon-ink` | Primary text, filled CTA buttons, nav bar, footer background, hairline borders, icon strokes — the only chromatic-acting color in the system; its near-black weight gives the page its editorial authority |
| Paper White | `#ffffff` | `--color-paper-white` | Page canvas, card surfaces, button text, icon fills on dark backgrounds — the dominant surface and the foil against which all type sits |
| Newsprint Gray | `#f7f7f7` | `--color-newsprint-gray` | Alternate section backgrounds, footer surface, subtle banding to separate editorial blocks without visual noise |
| Pebble | `#ebebeb` | `--color-pebble` | Section divider washes, faint background blocks that fade further into the page than Newsprint Gray |
| Fog | `#6a6a6a` | `--color-fog` | Muted helper text, secondary heading weight reduction, low-priority borders |
| Ash | `#a6a6a6` | `--color-ash` | Disabled or low-emphasis button fills, de-emphasized UI elements |

## Tokens — Typography

### Airbnb Cereal VF — Single-family system for everything from 14px body to 72px hero headlines. Weight 500 dominates body and UI, weight 700 anchors headlines, weight 400 appears in long-form copy. Negative tracking tightens at scale (-0.03em at 72px, -0.02em at 48–52px, -0.01em at 22–26px) — the letters huddle closer as they grow, giving display text a compressed, authoritative feel typical of editorial design. · `--font-airbnb-cereal-vf`
- **Substitute:** Inter, or Söhne if available; the rounded geometric proportions and tight tracking are signature
- **Weights:** 400, 500, 700
- **Sizes:** 14, 16, 18, 22, 26, 48, 52, 72
- **Line height:** 1.13–1.56 (tight at display, breathing at body)
- **Letter spacing:** -0.03em at 72px, -0.02em at 48–52px, -0.01em at 22–26px, normal at 16px and below
- **OpenType features:** `Use default features; Cereal VF handles weight axis interpolation natively`
- **Role:** Single-family system for everything from 14px body to 72px hero headlines. Weight 500 dominates body and UI, weight 700 anchors headlines, weight 400 appears in long-form copy. Negative tracking tightens at scale (-0.03em at 72px, -0.02em at 48–52px, -0.01em at 22–26px) — the letters huddle closer as they grow, giving display text a compressed, authoritative feel typical of editorial design.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 14px | 1.43 | — | `--text-caption` |
| body-sm | 16px | 1.56 | — | `--text-body-sm` |
| body | 18px | 1.56 | — | `--text-body` |
| subheading | 22px | 1.33 | -0.01px | `--text-subheading` |
| heading-sm | 26px | 1.29 | -0.01px | `--text-heading-sm` |
| heading | 48px | 1.18 | -0.02px | `--text-heading` |
| display | 72px | 1.13 | -0.03px | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 8px

**Density:** comfortable

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
| 80 | 80px | `--spacing-80` |
| 96 | 96px | `--spacing-96` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 12px |
| links | 4px |
| images | 12px |
| buttons | 8px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 64px
- **Card padding:** 24px
- **Element gap:** 8px

## Components

### Filled Dark CTA
**Role:** Primary action button — the only colored interactive element

8px radius, 14px vertical / 24px horizontal padding, background #222222, text #ffffff in Airbnb Cereal VF weight 500 at 16px. No border, no shadow, no hover lift. Used for 'Donate now' and 'Donate' in nav.

### Nav Text Link
**Role:** Secondary navigation actions

No background, no border. Airbnb Cereal VF weight 500 at 14–16px, color #222222. 8px horizontal spacing between items. Sits on white nav bar.

### Logo Wordmark
**Role:** Brand identity in top-left of every screen

'airbnb.org' in Airbnb Cereal VF weight 700. The 'airbnb' portion renders in brand pink-magenta (#b30057 from contrast data), '.org' in #222222. The chromatic logo against an otherwise fully achromatic page is the single moment of color in the system.

### Hero Headline
**Role:** Opening editorial statement

Centered, 72px, weight 500, line-height 1.13, letter-spacing -0.03em, color #222222. Max-width container ~800px. No gradient, no background imagery behind it — pure type on white.

### Body Subtext
**Role:** Supporting paragraph under hero headline

Centered, 18px, weight 400, line-height 1.56, color #222222. Max-width ~640px. Restrained line length for readability.

### Media Block (Video/Image)
**Role:** Full-width embedded visual storytelling

Contained within page max-width, 12px radius corners. Videos include a 1px #222222 hairline border (visible as frame). Plays full-bleed within the radius mask. Represents the system's only departure from text — photography is the emotional register.

### Section Headline
**Role:** Mid-page editorial title

Centered, 48px, weight 500, line-height 1.18, letter-spacing -0.02em, color #222222. Same centering and weight logic as hero, but at smaller scale.

### Section Subtext
**Role:** Explanatory copy under section headlines

Centered, 18px, weight 400, color #222222, max-width ~640px. Identical to hero subtext — the system reuses one body style for all long-form copy.

### Map Visualization Container
**Role:** World reach data display

Light gray (#ebebeb or #f7f7f7) rounded panel, 12px radius, contained within page width. Countries labeled in small (12–14px) Airbnb Cereal VF weight 500, #222222, in a flat geographic style with no color fill on landmasses.

### Top Navigation Bar
**Role:** Persistent header

White background, no border or shadow, full-width. Logo left, 2–3 text links right ('Get help', 'Get involved'), filled dark CTA ('Donate') far right. 64px vertical padding. Hairline 1px #222222 bottom border optional.

### Footer Band
**Role:** Page closure

Background #f7f7f7 or #222222, full-width. Text #ffffff on dark or #222222 on light. 64px vertical padding. Minimal content — links, legal, small logo.

## Do's and Don'ts

### Do
- Use #222222 as the only button fill color; the system's power comes from the contrast of one dark rectangle against pure white
- Set headlines at 48–72px with negative letter-spacing (-0.02em to -0.03em) to match the compressed editorial feel
- Center all hero and section text within a max-width of 1200px; keep body copy at ~640px max-width for readability
- Alternate sections between #ffffff and #f7f7f7 to create editorial banding — no drop shadows needed
- Use 12px radius on all images, video embeds, and media blocks; use 8px radius on buttons and nav links
- Set body text at 18px with line-height 1.56 — the generous leading makes long-form copy feel unhurried
- Let photography and video carry all emotional content; never decorate with gradients, illustrations, or color washes

### Don't
- Never introduce a chromatic accent color into the UI — the airbnb pink-magenta logo is the only color moment in the system
- Never apply drop shadows, glows, or blur effects to cards or buttons; depth comes from surface contrast, not elevation
- Never use border-radius larger than 12px; the system is angular and editorial, not soft or playful
- Never use display weights (800–900) — Airbnb Cereal tops out at 700, and most headlines sit at 500
- Never break the centered text alignment for hero and section headers; left-aligned text breaks the masthead metaphor
- Never place text directly over photography without a scrim or contained card — the page is too restrained to tolerate busy backgrounds
- Never use more than one body size (18px) for explanatory copy; variation breaks the editorial rhythm

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Canvas White | `#ffffff` | Default page background; hero, primary text blocks |
| 2 | Band Gray | `#f7f7f7` | Alternate section background; footer; visual separation between editorial blocks |
| 3 | Wash Gray | `#ebebeb` | Tertiary surface; faint dividers or background containers |

## Elevation

No shadows. The system relies entirely on surface color contrast (white → #f7f7f7 → #ebebeb) and 1px hairline borders at #222222 to create separation. Components sit flat on the canvas; depth comes from photography and type scale, never from drop shadows.

## Imagery

Photography and video are the sole emotional carriers of the page — no illustrations, no abstract graphics, no icons beyond simple utility UI. Treatment is full-bleed within the 1200px container, clipped to 12px radius corners with an optional 1px #222222 hairline frame on video. Photography style is documentary and intimate: dimly lit interiors, natural light from windows, people in their own spaces, slightly underexposed to feel candid rather than staged. No lifestyle gloss, no product shots. The world map is flat, monochrome line work with no color fills — data as restraint. Image density is moderate: one large media block per editorial section, never more, allowing type to dominate.

## Layout

Single-column centered layout within a 1200px max-width container. The page reads top-to-bottom as an editorial sequence: white hero with centered headline → subtext → filled dark CTA → embedded media block (video or photo) → centered section headline → subtext → alternate gray band → next media block → centered text → gray band → map visualization → footer. No multi-column grids, no sidebar, no card grids. Navigation is a minimal top bar (logo left, 2–3 text links right, dark CTA far right) with no sticky behavior beyond standard scroll. The rhythm is: text, image, text, image — alternating as in a magazine spread. Section gaps are generous (64px) with no visual dividers between bands; the #f7f7f7 gray sections serve as the only breaks. No hero with background image — the hero is text-only on white, with media appearing below the fold.

## Agent Prompt Guide

**Quick Color Reference**
- text: #222222
- background: #ffffff (canvas) / #f7f7f7 (alternate band)
- border: #222222 (1px hairline) / #6a6a6a (muted)
- accent: #b30057 (logo only — never use in UI)
- primary action: #222222 (filled action)
- disabled: #a6a6a6

**3-5 Example Component Prompts**

1. Create a Primary Action Button: #222222 background, #ffffff text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.

2. *Section Band*: Alternate #f7f7f7 background, 64px vertical padding. Centered section headline at 48px weight 500, letter-spacing -0.02em, color #222222. Subtext at 18px weight 400, max-width 640px. No buttons in this section.

3. *Media Block*: 1200px max-width, 12px radius corners, 1px #222222 border on video embeds. Sits on white background with 48px vertical margin above and below. No caption or overlay text inside the media block.


5. *Map Container*: 1200px max-width, #f7f7f7 background, 12px radius, 48px padding. Flat monochrome world map with country labels in 12px weight 500 #222222. No color fills on landmasses, no interactive markers.

## Editorial Rhythm

The page follows a strict pattern: **text → media → text → media**, alternating between white and #f7f7f7 surfaces. Every section is centered. Never place two text blocks back-to-back without a media block between them — the photography is the pacing device that gives the reader a breath. Section vertical padding is always 64px; element spacing within a section is 24px between headline and subtext, 8px between subtext and CTA.

## Similar Brands

- **charity: water** — Same oversized centered headlines on white, full-width photography as emotional anchor, monochromatic UI with color reserved for logo only
- **Wikipedia / Wikimedia Foundation** — Identical editorial restraint — pure achromatic surfaces, tight typographic hierarchy, no decorative elements, information-first layout
- **The New York Times homepage** — Same masthead metaphor — large confident serif/sans headlines, centered text blocks, gray band separators between articles, photography as the only color
- **Patagonia (responsibility pages)** — Same documentary photography style (underexposed, candid interiors), full-bleed media at 12px radius, monochromatic type-first layout, no decorative gradients

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-carbon-ink: #222222;
  --color-paper-white: #ffffff;
  --color-newsprint-gray: #f7f7f7;
  --color-pebble: #ebebeb;
  --color-fog: #6a6a6a;
  --color-ash: #a6a6a6;

  /* Typography — Font Families */
  --font-airbnb-cereal-vf: 'Airbnb Cereal VF', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.43;
  --text-body-sm: 16px;
  --leading-body-sm: 1.56;
  --text-body: 18px;
  --leading-body: 1.56;
  --text-subheading: 22px;
  --leading-subheading: 1.33;
  --tracking-subheading: -0.01px;
  --text-heading-sm: 26px;
  --leading-heading-sm: 1.29;
  --tracking-heading-sm: -0.01px;
  --text-heading: 48px;
  --leading-heading: 1.18;
  --tracking-heading: -0.02px;
  --text-display: 72px;
  --leading-display: 1.13;
  --tracking-display: -0.03px;

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
  --spacing-80: 80px;
  --spacing-96: 96px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 64px;
  --card-padding: 24px;
  --element-gap: 8px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-xl: 12px;

  /* Named Radii */
  --radius-cards: 12px;
  --radius-links: 4px;
  --radius-images: 12px;
  --radius-buttons: 8px;

  /* Surfaces */
  --surface-canvas-white: #ffffff;
  --surface-band-gray: #f7f7f7;
  --surface-wash-gray: #ebebeb;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-carbon-ink: #222222;
  --color-paper-white: #ffffff;
  --color-newsprint-gray: #f7f7f7;
  --color-pebble: #ebebeb;
  --color-fog: #6a6a6a;
  --color-ash: #a6a6a6;

  /* Typography */
  --font-airbnb-cereal-vf: 'Airbnb Cereal VF', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.43;
  --text-body-sm: 16px;
  --leading-body-sm: 1.56;
  --text-body: 18px;
  --leading-body: 1.56;
  --text-subheading: 22px;
  --leading-subheading: 1.33;
  --tracking-subheading: -0.01px;
  --text-heading-sm: 26px;
  --leading-heading-sm: 1.29;
  --tracking-heading-sm: -0.01px;
  --text-heading: 48px;
  --leading-heading: 1.18;
  --tracking-heading: -0.02px;
  --text-display: 72px;
  --leading-display: 1.13;
  --tracking-display: -0.03px;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-96: 96px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-xl: 12px;
}
```
