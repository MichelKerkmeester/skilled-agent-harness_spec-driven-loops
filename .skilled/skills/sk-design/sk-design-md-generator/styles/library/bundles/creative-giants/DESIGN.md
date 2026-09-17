# Creative Giants — Style Reference
> oversized editorial poster on cream paper

**Theme:** light

Creative Giants reads like an oversized art-book spread rendered in code: a warm off-white canvas, hairline margins, and display type so large it functions as a poster rather than a heading. The whole system runs on negative space and one weight of light (300) — headlines whisper at 64–84px instead of bolding into shouting, and letter-spacing tightens aggressively (-0.04em) as type grows so the words feel chiseled, not spaced. Chromatic color is rationed into small, saturated hits: vivid magenta, deep teal, powder blue, hot pink, mint, and navy appear as card surfaces or accents, never as background floods. Interactive elements are black-on-cream pills with fully rounded (1440px) radii, and the chrome is almost invisible — a single circular logo mark and a 'Menu' button floating in white space. The visual identity is a production studio's contact sheet: one enormous headline, one full-bleed photograph, one quiet line of meta text. Every other page should follow the same economy.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Bone White | `#fffef7` | `--color-bone-white` | Page canvas, card surfaces, text on dark accents — a warm off-white that replaces pure #ffffff and gives the whole system a paper-like, printed feel |
| Ink Black | `#000000` | `--color-ink-black` | Dark supporting neutral for text, icons, and strong contrast. Do not promote it to the primary CTA color |
| Graphite | `#666666` | `--color-graphite` | Secondary body text, captions, metadata, helper copy — recedes so display type can dominate |
| Ash | `#aaaaaa` | `--color-ash` | Input borders, inactive link color, tertiary dividers — soft structural gray that disappears when not needed |
| Charcoal Scale | `#4d4c4a` | `--color-charcoal-scale` | Mid-neutral for list borders, subtle elevation on the dark gradient track — warm gray, not blue-gray |
| Magenta Bloom | `#8a0467` | `--color-magenta-bloom` | Pink supporting accent for decorative details and low-frequency emphasis. Do not promote it to the primary CTA color |
| Forest Teal | `#03624c` | `--color-forest-teal` | Saturated brand accent for card frames and decorative strokes; pairs with Magenta Bloom for duotone treatments |
| Powder Blue | `#a5c8eb` | `--color-powder-blue` | Soft chromatic accent — card backgrounds, wash backgrounds, muted illustration fill; cools the warm canvas without competing |
| Candy Pink | `#ffacea` | `--color-candy-pink` | Pastel card surface — high-key, used as one-of-many tints in news/article cards; a softer sibling of Magenta Bloom |
| Mint Wash | `#a5ebd6` | `--color-mint-wash` | Pastel card surface — replaces the structural canvas on selected cards; reads as calm, cool, breathable |
| Navy Ink | `#101731` | `--color-navy-ink` | Deep accent card surface and inverted text ground; the only dark field the system uses, applied sparingly as a featured block |
| Signal Yellow | `#ffd001` | `--color-signal-yellow` | Sporadic high-chroma highlight (badges, tag pills, hover state on cards) — used in trace amounts, never as a primary fill |

## Tokens — Typography

### Switzer — Single-family system: weight 300 for all display and headline work (12–84px), weight 400 for body, metadata, and UI controls. The signature choice is using weight 300 at 64–84px — most systems would bold to 700–800 here; Switzer at light preserves the hairline strokes, making the type feel airbrushed onto the cream canvas. Tighter letter-spacing as size grows (-0.04em at 84px, -0.018em at 14px) keeps the counters open without looking spaced-out. · `--font-switzer`
- **Substitute:** Inter (300, 400), Söhne (300, 400), or any geometric humanist sans with a true 300 weight
- **Weights:** 300, 400
- **Sizes:** 12, 14, 16, 18, 20, 34, 54, 64, 84
- **Line height:** 1.00–1.43
- **Letter spacing:** -0.04em at 84px, -0.027em at 64px, -0.023em at 54px, -0.02em at 34px, -0.018em at 20px and below
- **Role:** Single-family system: weight 300 for all display and headline work (12–84px), weight 400 for body, metadata, and UI controls. The signature choice is using weight 300 at 64–84px — most systems would bold to 700–800 here; Switzer at light preserves the hairline strokes, making the type feel airbrushed onto the cream canvas. Tighter letter-spacing as size grows (-0.04em at 84px, -0.018em at 14px) keeps the counters open without looking spaced-out.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.43 | -0.018px | `--text-caption` |
| body-sm | 14px | 1.43 | -0.018px | `--text-body-sm` |
| body | 16px | 1.4 | -0.018px | `--text-body` |
| subheading | 20px | 1.4 | -0.018px | `--text-subheading` |
| heading-sm | 34px | 1.25 | -0.02px | `--text-heading-sm` |
| heading | 54px | 1 | -0.023px | `--text-heading` |
| display | 84px | 1 | -0.04px | `--text-display` |

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
| 48 | 48px | `--spacing-48` |
| 64 | 64px | `--spacing-64` |
| 80 | 80px | `--spacing-80` |
| 112 | 112px | `--spacing-112` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 1440px |
| cards | 0px |
| pills | 1440px |
| images | 0px |
| buttons | 1440px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| subtle | `rgba(255, 255, 255, 0.2) 0px 0px 0px 1px` | `--shadow-subtle` |

### Layout

- **Section gap:** 64px
- **Card padding:** 24px
- **Element gap:** 8px

## Components

### Pill Menu Button
**Role:** Primary navigation trigger in the header

Black (#000000) fill, Bone White (#fffef7) text at 16px weight 400, fully rounded at 1440px radius, padding 12px 24px, no border. Sits in the top-right corner with generous whitespace around it — its darkness is the only heavy element on the cream canvas.

### Header Lockup
**Role:** Persistent top chrome

Two-line eyebrow text (12px, weight 400, all caps, Ink Black) reading 'UNIQUE PUBLIC INTERVENTIONS // IMMERSIVE ACTIVATIONS' to the left of a 32px circular logo mark, Menu button floated right. Zero background — the cream page is the header background. ~16px vertical padding, full-bleed.

### Display Poster Headline
**Role:** Hero / section title

84px Switzer weight 300, letter-spacing -0.04em, line-height 1.0, color Ink Black. Occupies the full viewport width minus the page margin. Optionally rendered with a vertical Charcoal-to-Black gradient on warm-cream lettering for a sculptural poster effect. Never wraps above 2 lines.

### Hero Image Band
**Role:** Full-bleed editorial photography

Full-viewport-width image, no border-radius, no shadow. Meta text (location: 12px all-caps) and headline (34px weight 300) sit bottom-left with 32px left padding. Imagery is the hero; UI chrome yields entirely to the photograph.

### Section Title Block
**Role:** In-page section openers

All-caps eyebrow label (12px, weight 400, Graphite) on a single line, followed by a 34–54px weight 300 statement headline. No background, no rules, no decorations — separation is by whitespace alone (48–64px below the eyebrow, 32px below the headline).

### Project / News Card
**Role:** Card grid items for articles and case studies

3-column grid, no card border, no shadow, no radius. Image sits top of card (square or 4:3, sharp corners). Title 18–20px weight 300 in Ink Black sits 16px below the image. Body copy 14px weight 400 in Graphite, 3-line clamp. Optional 1px chromatic accent border (#8a0467 or #03624c) on the image edge for editorial tagging.

### Chromatic Accent Card
**Role:** Variant card surface using the brand accent palette

Uses one of the pastel or saturated tints (#ffacea, #a5ebd6, #a5c8eb, or #101731) as the card surface. Text inverts: Bone White on Navy Ink, Ink Black on pastels. 0px radius, 24–32px padding. Used as the occasional pop in a card grid; never more than one in a row.

### Carousel Arrow Control
**Role:** Next/prev navigation for card carousels

32px circular outline button, 1px Ash (#aaaaaa) border, transparent fill, 16px Ink Black chevron icon centered. No background change on hover — only the border darkens to Ink Black. Floats above the card row at the right edge of the section title.

### Meta Eyebrow
**Role:** Context labels above headlines

12px Switzer weight 400, all caps, letter-spacing 0 (default), color Graphite (#666666). Single line. Used for location, section names, project categories.

### Full-Bleed Footer
**Role:** Page footer

No background fill — same Bone White canvas. Top edge defined by a 1px hairline divider. Multi-column link lists with 14px weight 400 Ink Black text, 8px row-gap. The extreme Charcoal-to-Black linear gradient (rgb(77,76,74) → rgb(0,0,0)) is reserved for any dark footer band variant; never used elsewhere.

### Tag / Category Pill
**Role:** Small editorial labels and filters

8px vertical, 12px horizontal padding, 1440px radius, 12px weight 400 all-caps. Default: Ink Black text, transparent fill, 1px Ash border. Accent variant: Signal Yellow (#ffd001) fill, Ink Black text, no border.

## Do's and Don'ts

### Do
- Set headlines at weight 300 — never bold a Switzer heading, no matter the size.
- Use Bone White (#fffef7) as the only page background. Pure #ffffff breaks the warm paper language.
- Apply the 1440px pill radius to every button, tag, and Menu element — sharp corners are reserved for cards and images only.
- Push display headlines to 64–84px with -0.04em letter-spacing; the negative tracking is what makes the type feel carved, not printed.
- Let full-bleed photographs carry the visual weight. UI chrome should recede — the Menu button and logo are the only non-image elements above the fold.
- Use chromatic accents (#8a0467, #03624c, #a5c8eb) as borders, small fills, and single-card highlights — never flood a section with color.
- Keep section gaps at 48–64px. The cream canvas is the layout's primary structural tool; rules and dividers are secondary.

### Don't
- Don't bold headlines. The 300 weight is the brand — weight 500+ destroys the airbrushed feel.
- Don't use pure #ffffff anywhere. The warm off-white is a signature, not a fallback.
- Don't add shadows. The system's 0px box-shadow signature means elevation comes from color and scale, not depth.
- Don't round card or image corners. 1440px belongs only to interactive elements; editorial surfaces stay sharp.
- Don't fill a CTA with a chromatic color. No action background evidence supports a colored button — all interactive surfaces are black or transparent.
- Don't exceed two lines on a display headline. The 84px treatment is for poster statements, not paragraphs.
- Don't use #0000ee or default link blue. Inherit Ink Black for all text links; never let browser defaults leak in.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas | `#fffef7` | Page background — warm off-white paper tone |
| 1 | Card Tint | `#a5ebd6` | Pastel card variant — replaces canvas on accent cards |
| 1 | Card Tint Pink | `#ffacea` | Pastel card variant — high-key highlight |
| 1 | Card Tint Blue | `#a5c8eb` | Pastel card variant — cool wash |
| 2 | Signal Pop | `#ffd001` | Sporadic yellow accent — badges, hover, single-card highlight |
| 3 | Inverted Field | `#101731` | Dark accent surface for featured blocks; text inverts to Bone White |

## Elevation

The system has no meaningful elevation. The single detected shadow (rgba(255,255,255,0.2) 0px 0px 0px 1px) is a white 1px inner ring, not a drop shadow — it functions as a hairline highlight on dark elements, not as depth. Separation is built entirely from the warm canvas, whitespace, and the rare dark inverted field. Do not add box-shadows to cards, buttons, or modals.

## Imagery

Editorial photography dominates: full-bleed, sharp-cornered, no overlays or rounded masks. Treatment leans toward documentary and atmospheric — wrinkled hands, public installations, candid human subjects — never staged product shots. Imagery is always presented at large scale (full viewport width or card-filling) so the photograph, not the UI, is the design unit. No illustration, no 3D, no product mockups. Iconography is minimal: a single small circular logo mark, outline-only chevrons on carousel controls, and featherweight 1px-stroke UI icons. Density is image-led, with text serving as a quiet annotation layer below or over the photograph.

## Layout

Full-bleed page model: no max-width container, content runs edge-to-edge with consistent left/right padding (16–32px on mobile, 32px+ on desktop). The hero is a single oversized display headline ('CREATIVE GIANTS' at 84px) taking roughly 40% of the viewport, immediately followed by a full-bleed photograph with bottom-left meta + headline overlay. Section rhythm is monolithic: each new section is introduced by a small all-caps eyebrow + 34–54px weight 300 statement, separated by 48–64px of negative space — no alternating dark/light bands except the single inverted Navy Ink accent card. Content is consistently left-aligned; no centered stacks except the hero display headline. The news/case-study area uses a 3-column card grid with a right-floated arrow control cluster. Navigation is a single top header — no sidebar, no sticky elements beyond the header itself. Overall density is spacious and editorial: every section breathes, and whitespace is the primary structural tool.

## Agent Prompt Guide

**Quick Color Reference**
- text: #000000
- background: #fffef7
- border / divider: #aaaaaa
- secondary text: #666666
- accent: #8a0467 (magenta) and #03624c (teal) — borders and small hits only
- pastel card surface: #a5ebd6, #ffacea, or #a5c8eb
- primary action: no distinct CTA color

**3-5 Example Component Prompts**

1. *Hero display headline*: Full-bleed cream (#fffef7) canvas. 'CREATIVE GIANTS' at 84px Switzer weight 300, color #000000, letter-spacing -0.04em, line-height 1.0, left-aligned with 32px left padding. No background, no border. The headline should occupy ~40% of the viewport height.

2. *Pill Menu button*: 16px Switzer weight 400, color #fffef7 on #000000 fill, 1440px border-radius, padding 12px 24px, no border. Float top-right with 32px margin from edges. Sits alone in the header — no other UI chrome competes.

3. *Full-bleed image band with overlay*: Edge-to-edge photograph (no border-radius). Bottom-left overlay: 12px Switzer weight 400 all-caps meta in #fffef7 ('BRIGHTON, UNITED KINGDOM'), 32px below it a 34px weight 300 statement headline in #fffef7. 32px padding from the left and bottom edges.

4. *News / project card*: 3-column grid, no card border, 0px radius. Square image (no radius) sits at top. 16px below: 20px Switzer weight 300 title in #000000. 8px below: 14px weight 400 description in #666666, 3-line clamp. 48px column gap, no row gap (single row).

5. *Pastel accent card*: One card in the grid swaps to surface #a5ebd6 with 24px padding around its content, text in #000000 at 20px weight 300. The remaining two cards stay on the cream canvas. This is the system's only color-rupture moment.

## Similar Brands

- **Pentagram** — Same oversized editorial display headlines, weight-light typography, full-bleed project photography, and minimal navigation chrome on a neutral canvas.
- **Locomotive (locomotive.ca)** — Same 'studio portfolio as art book' treatment — cream canvas, large weight-300 sans-serif statements, sharp-cornered full-bleed imagery, and pill-shaped controls.
- **Resn** — Same full-bleed experimental photography and whisper-weight display type; both agencies treat the homepage as a single oversized canvas rather than a dashboard.
- **B-Reel** — Same single-line display headline, edge-to-edge video/photo hero, and a cream/near-white canvas with rationed chromatic accents.

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-bone-white: #fffef7;
  --color-ink-black: #000000;
  --color-graphite: #666666;
  --color-ash: #aaaaaa;
  --color-charcoal-scale: #4d4c4a;
  --color-magenta-bloom: #8a0467;
  --color-forest-teal: #03624c;
  --color-powder-blue: #a5c8eb;
  --color-candy-pink: #ffacea;
  --color-mint-wash: #a5ebd6;
  --color-navy-ink: #101731;
  --color-signal-yellow: #ffd001;

  /* Typography — Font Families */
  --font-switzer: 'Switzer', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.43;
  --tracking-caption: -0.018px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.43;
  --tracking-body-sm: -0.018px;
  --text-body: 16px;
  --leading-body: 1.4;
  --tracking-body: -0.018px;
  --text-subheading: 20px;
  --leading-subheading: 1.4;
  --tracking-subheading: -0.018px;
  --text-heading-sm: 34px;
  --leading-heading-sm: 1.25;
  --tracking-heading-sm: -0.02px;
  --text-heading: 54px;
  --leading-heading: 1;
  --tracking-heading: -0.023px;
  --text-display: 84px;
  --leading-display: 1;
  --tracking-display: -0.04px;

  /* Typography — Weights */
  --font-weight-light: 300;
  --font-weight-regular: 400;

  /* Spacing */
  --spacing-unit: 8px;
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-112: 112px;

  /* Layout */
  --section-gap: 64px;
  --card-padding: 24px;
  --element-gap: 8px;

  /* Border Radius */
  --radius-full: 1440px;
  --radius-full-2: 1600px;

  /* Named Radii */
  --radius-tags: 1440px;
  --radius-cards: 0px;
  --radius-pills: 1440px;
  --radius-images: 0px;
  --radius-buttons: 1440px;

  /* Shadows */
  --shadow-subtle: rgba(255, 255, 255, 0.2) 0px 0px 0px 1px;

  /* Surfaces */
  --surface-canvas: #fffef7;
  --surface-card-tint: #a5ebd6;
  --surface-card-tint-pink: #ffacea;
  --surface-card-tint-blue: #a5c8eb;
  --surface-signal-pop: #ffd001;
  --surface-inverted-field: #101731;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-bone-white: #fffef7;
  --color-ink-black: #000000;
  --color-graphite: #666666;
  --color-ash: #aaaaaa;
  --color-charcoal-scale: #4d4c4a;
  --color-magenta-bloom: #8a0467;
  --color-forest-teal: #03624c;
  --color-powder-blue: #a5c8eb;
  --color-candy-pink: #ffacea;
  --color-mint-wash: #a5ebd6;
  --color-navy-ink: #101731;
  --color-signal-yellow: #ffd001;

  /* Typography */
  --font-switzer: 'Switzer', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.43;
  --tracking-caption: -0.018px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.43;
  --tracking-body-sm: -0.018px;
  --text-body: 16px;
  --leading-body: 1.4;
  --tracking-body: -0.018px;
  --text-subheading: 20px;
  --leading-subheading: 1.4;
  --tracking-subheading: -0.018px;
  --text-heading-sm: 34px;
  --leading-heading-sm: 1.25;
  --tracking-heading-sm: -0.02px;
  --text-heading: 54px;
  --leading-heading: 1;
  --tracking-heading: -0.023px;
  --text-display: 84px;
  --leading-display: 1;
  --tracking-display: -0.04px;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-112: 112px;

  /* Border Radius */
  --radius-full: 1440px;
  --radius-full-2: 1600px;

  /* Shadows */
  --shadow-subtle: rgba(255, 255, 255, 0.2) 0px 0px 0px 1px;
}
```
