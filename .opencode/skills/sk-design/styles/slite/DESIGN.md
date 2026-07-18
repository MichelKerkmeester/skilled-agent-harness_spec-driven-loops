# Slite — Style Reference
> Warm parchment notebook with terracotta pen — every surface is cream paper, every accent a single ember-orange stroke.

**Theme:** light

Slite uses a warm-parchment workspace language: the entire page sits on a cream paper canvas (#fdf9f4) rather than cold white, and a single vivid orange (#f67748) acts as ember — appearing only on the primary CTA, selected status pills, and card border highlights. Typography is split between Garnett (a custom serif-feeling display face with tight tracking) for headlines and a custom UniversalSans (geometric humanist) for everything else, giving the page the rhythm of a well-edited document: serif headlines that feel handwritten, sans-serif body that feels like typed notes. Components are pill-heavy and shadow-light: ghost and outlined pill buttons, 32px-rounded feature cards, dust-toned tag chips, and hand-drawn circle annotations around key phrases. The dominant motion is restrained (130ms ease) and the dominant structure is a centered column with comfortable 80–120px section gaps — never information-dense, always breathing.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Parchment Cream | `#fdf9f4` | `--color-parchment-cream` | Page canvas and primary card surface — the warm off-white that defines Slite's identity. Never use cold white #ffffff at the page level |
| Star White | `#ffffff` | `--color-star-white` | Elevated surfaces — product mockup cards, tooltips, white-product interiors stacked on top of the cream canvas |
| Dust Sand | `#f9efe4` | `--color-dust-sand` | Secondary surface and tag/chip background — a half-step darker than the canvas. Tag pills, secondary buttons, and warm-emphasis callouts |
| Moon Silver | `#ecedef` | `--color-moon-silver` | Hairline borders, dividers, and 2px outlined button borders — the only border tone used at full opacity |
| Shade Ink | `#2d2f34` | `--color-shade-ink` | Primary heading and body text — slightly warm near-black. The headline color |
| Shade Charcoal | `#3f434a` | `--color-shade-charcoal` | Secondary body text, navigation labels, and subdued headings. Do not promote it to the primary CTA color |
| Shade Slate | `#5e646e` | `--color-shade-slate` | Tertiary body text, captions, helper copy — the quietest readable gray |
| Shade Fog | `#9da3af` | `--color-shade-fog` | Disabled states, placeholder text, and the lightest non-white neutral — used sparingly on the page |
| Shade Dusk | `#6a707c` | `--color-shade-dusk` | Small print and fine print text — pricing footnotes, micro-copy beneath headings |
| Border Mist | `#d9dde6` | `--color-border-mist` | Card borders and stroke at low contrast — slightly bluer than Moon Silver, used when a card edge needs to be felt but not seen |
| Ember Orange | `#f67748` | `--color-ember-orange` | Primary action — filled CTA buttons, selected card border accent, featured testimonial card background, and the scribble-annotation color. The single saturated brand color, used sparingly so it always feels like a deliberate highlight |
| Neptune Blue | `#74a6f1` | `--color-neptune-blue` | Secondary action accent — used on at most one button per page (e.g. alternating testimonial CTA) and link-text accents. Never the primary CTA |
| Verification Green | `#479a53` | `--color-verification-green` | Green text accent for links, tags, and emphasized short phrases. Use as a supporting accent, not as a status color |
| Verified Mint | `#bbf7d0` | `--color-verified-mint` | Green decorative accent for icons, marks, and small graphic details. Use as a supporting accent, not as a status color |
| Tag Violet | `#4b51c3` | `--color-tag-violet` | Violet text accent for links, tags, and emphasized short phrases. Use as a supporting accent, not as a status color |
| Illustration Violet | `#6b70d6` | `--color-illustration-violet` | Decorative illustration fill — light-violet shapes in product mockups, paired with Tag Violet as a tonal pair |

## Tokens — Typography

### Garnett — Display and editorial headings. Used at 64px (display), 36px (h1), 28px (h2), 24px (large body), 12px (small links). The serif-like Garnett paired with a humanist sans is Slite's signature typographic contrast — it makes the page feel like a designed document rather than a dashboard. · `--font-garnett`
- **Substitute:** Lora, Source Serif Pro, or PT Serif — pick a serif with similar humanist warmth
- **Weights:** 400, 500, 700
- **Sizes:** 12, 16, 24, 28, 36, 64
- **Line height:** 1.20 – 2.13
- **OpenType features:** `"ss14", "ss15", "ss19"`
- **Role:** Display and editorial headings. Used at 64px (display), 36px (h1), 28px (h2), 24px (large body), 12px (small links). The serif-like Garnett paired with a humanist sans is Slite's signature typographic contrast — it makes the page feel like a designed document rather than a dashboard.

### UniversalSans — Body text, UI controls, navigation, buttons, and supporting headlines. Carries almost all of the page's content. The 50px / weight 400 / line-height 1.5 hero variant is a deliberate departure from typical 700-weight display sizes — it lets the Garnett headline above do the work, while UniversalSans handles the breathing paragraph copy beneath. · `--font-universalsans`
- **Substitute:** Inter, Roboto, or a humanist sans like Public Sans
- **Weights:** 400, 500, 600, 700
- **Sizes:** 10, 12, 13, 14, 15, 16, 17, 19, 20, 22, 24, 26, 34, 50
- **Line height:** 1.00 – 2.00
- **OpenType features:** `"ss14", "ss15", "ss19"`
- **Role:** Body text, UI controls, navigation, buttons, and supporting headlines. Carries almost all of the page's content. The 50px / weight 400 / line-height 1.5 hero variant is a deliberate departure from typical 700-weight display sizes — it lets the Garnett headline above do the work, while UniversalSans handles the breathing paragraph copy beneath.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| label | 10px | 1.2 | — | `--text-label` |
| caption | 13px | 1.2 | — | `--text-caption` |
| body-sm | 15px | 1.5 | — | `--text-body-sm` |
| button | 17px | 1 | — | `--text-button` |
| body-lg | 19px | 1.4 | — | `--text-body-lg` |
| heading-sm | 26px | 1.3 | — | `--text-heading-sm` |
| heading | 28px | 1.25 | — | `--text-heading` |
| heading-lg | 36px | 1.2 | — | `--text-heading-lg` |
| hero | 50px | 1.5 | — | `--text-hero` |
| display | 64px | 1.2 | — | `--text-display` |

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
| 60 | 60px | `--spacing-60` |
| 72 | 72px | `--spacing-72` |
| 80 | 80px | `--spacing-80` |
| 100 | 100px | `--spacing-100` |
| 120 | 120px | `--spacing-120` |
| 176 | 176px | `--spacing-176` |
| 240 | 240px | `--spacing-240` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 9999px |
| cards | 32px |
| buttons | 999px |
| smallCards | 12px |
| ghostButton | 8px |
| productCards | 18px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| subtle | `rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.05) 0...` | `--shadow-subtle` |
| sm | `rgba(0, 0, 0, 0.2) 0px 2px 6px 0px` | `--shadow-sm` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 96px
- **Element gap:** 8px

## Components

### Primary CTA Button (Ember Pill)
**Role:** The single orange button on the page — reserved for the main conversion action.

Filled #f67748 background, white text, UniversalSans 17px weight 600, line-height 1, border-radius 999px (full pill), padding 12px 24px. Appears at most once above the fold. The only color-saturated button on the page.

### Dark CTA Button (Charcoal Pill)
**Role:** Secondary high-emphasis action, typically 'Start for free'.

Filled #2d2f34 (or #3f434a) background, white text, UniversalSans 17px weight 600, border-radius 999px, padding 12px 20px. Used in the header nav for the highest-intent action.

### Outlined Pill Button
**Role:** Medium-emphasis action — Book demo, secondary nav actions.

Transparent background, 2px solid #2d2f34 border, #2d2f34 text, UniversalSans 15–17px weight 500–600, border-radius 999px, padding 10px 20px.

### Ghost Text Button
**Role:** Low-emphasis inline action — nav items, sub-actions inside cards.

Transparent background, no border, #3f434a text, UniversalSans 14–15px weight 500, padding 4px 8px. Minimal padding signals 'I am a label, not a control'.

### Square Ghost Button
**Role:** Compact UI control — close buttons, icon toggles, inline editors.

Transparent background, #2d2f34 text, border-radius 8px, padding 0px 8px. The 8px radius is the sharpest button radius in the system — used only for tiny inline controls.

### Dust Tag Chip
**Role:** Feature highlight tags and category labels — the most-repeated component on the page.

#f9efe4 background, #3f434a text, UniversalSans 13–15px weight 500, border-radius 9999px, padding 8px 16px. Always pill-shaped, always warm. Used in rows of 3–4 to label a section's sub-topics.

### Status Pill (Verified / Self-maintained)
**Role:** Trust and maintenance indicators inside product screenshots.

Tag Violet (#4b51c3) or Verification Green (#479a53) text on white, paired with a small filled icon. UniversalSans 13px weight 500. Sits inline above content titles.

### Cream Feature Card
**Role:** Primary marketing card — 3-column feature grid items, testimonial cards.

#fdf9f4 or #f9efe4 background, border-radius 32px, padding 48px top / 32px bottom / 24px sides, no shadow. The 32px radius is Slite's signature — generous but not pillow-soft. Optionally bordered with a 2px #f67748 ember stroke to denote 'selected' or 'highlighted' cards.

### White Product Card
**Role:** Product screenshot containers and tooltips stacked on the cream canvas.

#ffffff background, border-radius 12px, box-shadow 0 1px 3px rgba(0,0,0,0.1) + 0 2px 6px rgba(0,0,0,0.05) + 0 4px 12px rgba(0,0,0,0.01). The three-layer shadow is the only place Slite uses depth — the rest of the page stays flat.

### Compact UI Card
**Role:** Inline product UI mock elements — sidebar items, list rows, agent chips.

#fdfdfd (near-white) background, border-radius 16px, padding 12px 16px, no shadow. The tighter 16px radius signals 'I am a UI element inside a product mock, not a marketing card'.

### Ember Testimonial Card
**Role:** Featured customer quote — the only orange-filled card.

#f67748 background, white text, border-radius 16px, padding 32px. Used at most once per page as the visual punctuation between sections of cream cards.

### Logo Trust Bar
**Role:** Social proof — '3,000+ companies trust Slite' row.

Horizontal row of monochrome black customer logos (Doodle, Lush, Frontify, Karbon, Visma, Omnisend) on the cream canvas, with a small 13px caption beneath each ('Migrated from Notion'). Logos are rendered at a single visual weight and aligned to a shared baseline.

### Scribble Annotation
**Role:** Hand-drawn circle or underline around a key word in a headline.

1.5–2px solid #f67748 stroke, no fill, slightly imperfect oval shape (roughened path), placed behind or around a single word ('Verified'). The visual signature that makes headlines feel hand-edited rather than rendered.

### Underline Link
**Role:** Inline text link inside paragraphs.

#3f434a text, no underline by default, 1px underline on hover with a #f67748 ember accent color. The hover color is the only place the ember orange appears in text.

### Hero Product Frame
**Role:** Large product screenshot shown below the headline.

A White Product Card containing a product mockup — sidebar navigation, breadcrumb, content area. Framed by the canvas and dropped onto the page with a subtle offset (rotation 0–1deg optional). Always 12px radius, always #ffffff, always with the three-layer shadow.

## Do's and Don'ts

### Do
- Set the page canvas to #fdf9f4 — never use cold white #ffffff as the page background
- Use #f67748 for exactly one filled CTA per section; everything else is charcoal, outlined, or ghost
- Use Garnett for headlines and UniversalSans for body — never use UniversalSans at 40px+ display sizes
- Set button border-radius to 999px (pill) for all primary actions, 8px only for tiny square icon buttons
- Set card border-radius to 32px for marketing cards, 12–18px for product mockup containers
- Use #f9efe4 dust backgrounds for tag chips and secondary surfaces, not solid gray
- Hand-draw a 1.5px #f67748 circle or underline around exactly one key word in any hero headline

### Don't
- Do not introduce a second saturated color as a brand accent — #f67748 must remain the only chromatic surface color
- Do not use 700-weight UniversalSans at display sizes — 50px hero text is always weight 400
- Do not stack more than one shadow elevation on a single element; the three-layer shadow is the maximum
- Do not use pure black #000000 for body text — always #2d2f34 (Shade Ink) or #3f434a (Shade Charcoal)
- Do not use #ecedef or #d9dde6 as background fills — these are border tones only
- Do not break the pill/tag radius system with square chips or rounded-but-not-pill buttons
- Do not place #f67748 fills on large backgrounds (more than 20% of a section) — it dilutes the CTA signal

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas | `#fdf9f4` | Page background — the warm cream that defines the whole site's atmosphere |
| 1 | White Product | `#ffffff` | Product mockup interiors and elevated tooltips — appears as white panels inside the cream canvas |
| 2 | Dust Card | `#f9efe4` | Feature cards and tag chip backgrounds — a half-step darker than canvas to delineate zones without contrast |
| 3 | Silver Border | `#ecedef` | Hairline card and button borders — the sole border tone |
| 4 | Ember Accent | `#f67748` | Selected card border and CTA fill — the only chromatic surface |

## Elevation

- **White Product Card:** `0 1px 3px rgba(0,0,0,0.1), 0 2px 6px rgba(0,0,0,0.05), 0 4px 12px rgba(0,0,0,0.01)`

## Imagery

Visuals are dominated by product screenshot mockups rendered on white cards inside the cream canvas, not by photography. The product UI is shown in a real working state (sidebar navigation, breadcrumb, content area with 'Troubleshooting' heading) rather than as a stylized hero render. Decorative elements are sparse: hand-drawn orange scribble circles around key headline words, and small abstract illustration washes in mint, violet, and pink used sparingly inside the product mock to add warmth. No lifestyle photography, no stock imagery. The visual density is text-dominant with screenshots functioning as evidence rather than decoration.

## Layout

Page model: centered max-width ~1200px with comfortable horizontal margins, full-bleed cream canvas behind. Hero is a centered headline stack — Garnett 64px display headline (with one word circled in orange) sits above a 19px UniversalSans subtitle, then a row of Dust Tag Chips, then the single Ember CTA. The product mockup appears below as a large White Product Card with soft shadow. Section rhythm: consistent vertical breathing room (96px between sections), no alternating dark/light bands — the page stays cream throughout. Social proof is a centered single-row logo wall. Feature blocks are 3-column Cream Feature Card grids with 32px radius. The page reads top-to-bottom as a single editorial document, not as a marketing patchwork.

## Agent Prompt Guide

**Quick Color Reference**
- text: #2d2f34 (headings) / #3f434a (body) / #5e646e (tertiary)
- background: #fdf9f4 (canvas) / #ffffff (elevated) / #f9efe4 (dust surface)
- border: #ecedef (hairline) / #d9dde6 (soft card edge)
- accent: #f67748 (ember — used for the single primary CTA, selected card border, and headline scribble annotation only)
- primary action: #f67748 (filled action)

**3-5 Example Component Prompts**

1. **Hero Headline with Scribble Annotation**: Centered Garnett 64px weight 500, color #2d2f34, line-height 1.2. One key word (e.g. 'Verified') wrapped in a hand-drawn 1.5px stroke #f67748 oval, positioned slightly above and around the word. Below: UniversalSans 19px weight 400, color #3f434a, line-height 1.4, max-width 640px centered.

2. Create a Primary Action Button: #f67748 background, #000000 text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.

3. **Dust Tag Chip Row**: Horizontal row of 3 pills, each #f9efe4 background, #3f434a text, UniversalSans 13px weight 500, border-radius 9999px, padding 8px 16px, 8px gap between chips. Centered above feature sections.

4. **Cream Feature Card**: #f9efe4 background, border-radius 32px, padding 48px 24px 32px, no shadow. Optional 2px solid #f67748 left border for highlighted/selected cards. Contains a Garnett 24px weight 500 title in #2d2f34, UniversalSans 15px weight 400 body in #5e646e.

5. **White Product Card**: #ffffff background, border-radius 12px, box-shadow 0 1px 3px rgba(0,0,0,0.1) + 0 2px 6px rgba(0,0,0,0.05) + 0 4px 12px rgba(0,0,0,0.01). Contains a product UI mockup (sidebar + content area) rendered in actual working state, not a stylized render.

## Typography Pairing Logic

The Garnett + UniversalSans pairing is a deliberate editorial choice: Garnett's serif character gives the page the weight of a printed document or annual report, while UniversalSans handles the 'typed notes' density of the body copy. The contrast is most visible at the hero where a Garnett 64px display headline sits above a UniversalSans 50px weight-400 subheadline — the weight-400 choice is anti-convention; most sites use 700 at this size, but Slite's subheadline whispers so the Garnett headline can speak. The two faces share the same font-feature-settings ('ss14', 'ss15', 'ss19'), meaning the stylistic alternates were designed as a pair — substituting with a mismatched system serif will break the visual continuity.

## Radius as Hierarchy

Border-radius is Slite's secondary hierarchy system. Marketing cards use the largest radius (32px) to feel designed and deliberate. Product mockup cards use 12–18px to feel like actual UI. Pill buttons and tags always use 999–9999px to feel approachable and tappable. The only sharp corner in the system is the 8px ghost button — it is reserved for tiny inline icon controls where a pill would look strange. When in doubt: larger radius = more editorial, smaller radius = more product.

## The Ember Accent Rule

#f67748 must appear on less than 5% of any page. The constraint is what gives the orange its signaling power — it marks 'this is the action you take' and 'this is the word you should remember'. When you use the orange anywhere that is not (a) a primary CTA, (b) a 'selected' card border, (c) a headline scribble annotation, or (d) a featured testimonial card background, you have broken the system. The page should be readable in greyscale; the orange is punctuation, not structure.

## Similar Brands

- **Notion** — Same warm cream canvas approach and pill-shaped tag/button system, though Notion uses a heavier weight and more varied type sizes
- **Mem** — Same serif-headline + sans-body editorial pairing and warm paper-canvas aesthetic, with a similarly restrained single-accent color strategy
- **Coda** — Same product-screenshot-driven marketing style and ghost/outlined button hierarchy, though Coda leans cooler in its neutrals
- **Tana** — Same knowledge-management category and warm off-white canvas, with comparable pill-chip tag systems above feature sections
- **Linear** — Same single-accent restraint (Linear uses indigo, Slite uses ember), same 32px-rounded feature cards, and the same three-layer soft shadow on elevated product surfaces

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-parchment-cream: #fdf9f4;
  --color-star-white: #ffffff;
  --color-dust-sand: #f9efe4;
  --color-moon-silver: #ecedef;
  --color-shade-ink: #2d2f34;
  --color-shade-charcoal: #3f434a;
  --color-shade-slate: #5e646e;
  --color-shade-fog: #9da3af;
  --color-shade-dusk: #6a707c;
  --color-border-mist: #d9dde6;
  --color-ember-orange: #f67748;
  --color-neptune-blue: #74a6f1;
  --color-verification-green: #479a53;
  --color-verified-mint: #bbf7d0;
  --color-tag-violet: #4b51c3;
  --color-illustration-violet: #6b70d6;

  /* Typography — Font Families */
  --font-garnett: 'Garnett', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-universalsans: 'UniversalSans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-label: 10px;
  --leading-label: 1.2;
  --text-caption: 13px;
  --leading-caption: 1.2;
  --text-body-sm: 15px;
  --leading-body-sm: 1.5;
  --text-button: 17px;
  --leading-button: 1;
  --text-body-lg: 19px;
  --leading-body-lg: 1.4;
  --text-heading-sm: 26px;
  --leading-heading-sm: 1.3;
  --text-heading: 28px;
  --leading-heading: 1.25;
  --text-heading-lg: 36px;
  --leading-heading-lg: 1.2;
  --text-hero: 50px;
  --leading-hero: 1.5;
  --text-display: 64px;
  --leading-display: 1.2;

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
  --spacing-60: 60px;
  --spacing-72: 72px;
  --spacing-80: 80px;
  --spacing-100: 100px;
  --spacing-120: 120px;
  --spacing-176: 176px;
  --spacing-240: 240px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 96px;
  --element-gap: 8px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 18px;
  --radius-2xl-2: 22px;
  --radius-3xl: 32px;
  --radius-3xl-2: 40px;
  --radius-full: 999px;
  --radius-full-2: 9999px;

  /* Named Radii */
  --radius-tags: 9999px;
  --radius-cards: 32px;
  --radius-buttons: 999px;
  --radius-smallcards: 12px;
  --radius-ghostbutton: 8px;
  --radius-productcards: 18px;

  /* Shadows */
  --shadow-subtle: rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.05) 0px 2px 6px 0px, rgba(0, 0, 0, 0.01) 0px 4px 12px 0px;
  --shadow-sm: rgba(0, 0, 0, 0.2) 0px 2px 6px 0px;

  /* Surfaces */
  --surface-canvas: #fdf9f4;
  --surface-white-product: #ffffff;
  --surface-dust-card: #f9efe4;
  --surface-silver-border: #ecedef;
  --surface-ember-accent: #f67748;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-parchment-cream: #fdf9f4;
  --color-star-white: #ffffff;
  --color-dust-sand: #f9efe4;
  --color-moon-silver: #ecedef;
  --color-shade-ink: #2d2f34;
  --color-shade-charcoal: #3f434a;
  --color-shade-slate: #5e646e;
  --color-shade-fog: #9da3af;
  --color-shade-dusk: #6a707c;
  --color-border-mist: #d9dde6;
  --color-ember-orange: #f67748;
  --color-neptune-blue: #74a6f1;
  --color-verification-green: #479a53;
  --color-verified-mint: #bbf7d0;
  --color-tag-violet: #4b51c3;
  --color-illustration-violet: #6b70d6;

  /* Typography */
  --font-garnett: 'Garnett', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-universalsans: 'UniversalSans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-label: 10px;
  --leading-label: 1.2;
  --text-caption: 13px;
  --leading-caption: 1.2;
  --text-body-sm: 15px;
  --leading-body-sm: 1.5;
  --text-button: 17px;
  --leading-button: 1;
  --text-body-lg: 19px;
  --leading-body-lg: 1.4;
  --text-heading-sm: 26px;
  --leading-heading-sm: 1.3;
  --text-heading: 28px;
  --leading-heading: 1.25;
  --text-heading-lg: 36px;
  --leading-heading-lg: 1.2;
  --text-hero: 50px;
  --leading-hero: 1.5;
  --text-display: 64px;
  --leading-display: 1.2;

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
  --spacing-60: 60px;
  --spacing-72: 72px;
  --spacing-80: 80px;
  --spacing-100: 100px;
  --spacing-120: 120px;
  --spacing-176: 176px;
  --spacing-240: 240px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 18px;
  --radius-2xl-2: 22px;
  --radius-3xl: 32px;
  --radius-3xl-2: 40px;
  --radius-full: 999px;
  --radius-full-2: 9999px;

  /* Shadows */
  --shadow-subtle: rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.05) 0px 2px 6px 0px, rgba(0, 0, 0, 0.01) 0px 4px 12px 0px;
  --shadow-sm: rgba(0, 0, 0, 0.2) 0px 2px 6px 0px;
}
```
