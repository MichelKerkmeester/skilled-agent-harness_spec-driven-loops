# Switch-Lit — Style Reference
> Inked editorial grid on cream paper

**Theme:** light

Switch-Lit is an editorial brutalist system printed on warm cream paper. Every structural element is drawn in a single black hairline — card edges, dividers, icon strokes, button outlines — so the page reads like a typeset manuscript where the grid itself is inked. Typography carries the personality: heavy condensed display type sits next to whisper-light flared serifs, and body copy uses a wide-tracked grotesque that feels typeset rather than typed. Accent color appears as highlighter punctuation — electric lime, cornflower, spring green — used in small swatches on cards and tags rather than as backgrounds for hero sections. The whole effect is closer to a printed literary quarterly than a SaaS product: restrained, opinionated, and deeply typographic.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Manuscript Cream | `#f9f9f7` | `--color-manuscript-cream` | Page canvas, card surfaces, button text on dark — warm off-white that reads as paper rather than screen |
| Press Black | `#000000` | `--color-press-black` | All borders, body text, headings, icon strokes — the single ink that draws the entire structural system |
| Sage Border | `#d2ddd2` | `--color-sage-border` | Secondary card and button borders where a softer hairline is needed — desaturated green-gray |
| Mist Green | `#dee5dd` | `--color-mist-green` | Icon strokes and fills, button borders on tertiary controls — barely-there gray-green for subordinate elements |
| Paper Shadow | `#edf0e9` | `--color-paper-shadow` | Button fill for neutral or disabled states — warm gray-green, almost a shadow of the cream canvas |
| Smoke | `#c7c7c6` | `--color-smoke` | The only shadow tone used — rgba(0,0,0,0.2) modulated to a neutral mid-gray for the single soft button shadow |
| Highlighter Lime | `#edfe5e` | `--color-highlighter-lime` | Primary accent fill on cards, tags, and featured swatches — electric yellow-green that reads as a marker pen swiped across the page |
| Cornflower Wash | `#bed4fb` | `--color-cornflower-wash` | Secondary accent fill on cards, category chips, and illustration swatches — dusty cornflower blue that cools the palette without darkening it |
| Spring Green | `#31e992` | `--color-spring-green` | Green wash for highlight backgrounds, decorative bands, and soft emphasis behind content |

## Tokens — Typography

### ABCArizonaSans — Body, UI controls, navigation, captions, links, footer — the workhorse grotesque for everything that isn't a heading · `--font-abcarizonasans`
- **Substitute:** Inter, Söhne, GT America
- **Weights:** 400, 500, 700
- **Sizes:** 11, 13, 15, 16, 18
- **Line height:** 1.00–1.27
- **Letter spacing:** 0.033em at 11px → 0.067em at 18px — positive tracking increases as size decreases, a typeset-not-typed feel
- **Role:** Body, UI controls, navigation, captions, links, footer — the workhorse grotesque for everything that isn't a heading

### ABCArizonaFlare — Section and card headings — flared terminals and light weights create editorial authority; weight 300 at 57px is a deliberate whisper that trusts the reader to lean in · `--font-abcarizonaflare`
- **Substitute:** GT Sectra, Lyon Display, Tiempos Headline
- **Weights:** 300, 400
- **Sizes:** 24, 27, 28, 57
- **Line height:** 0.93–1.11
- **Letter spacing:** -0.0020em, 0.0040em, 0.0110em
- **Role:** Section and card headings — flared terminals and light weights create editorial authority; weight 300 at 57px is a deliberate whisper that trusts the reader to lean in

### ABCCameraHeavy — Hero and display headings — extremely tight leading (0.74) stacks letters into dense editorial blocks; this is the loudest voice on the page and is used sparingly · `--font-abccameraheavy`
- **Substitute:** Druk, GT Super Display Bold, Editorial New
- **Weights:** 400, 700
- **Sizes:** 64, 68
- **Line height:** 0.74–1.00
- **Letter spacing:** -0.0010em
- **Role:** Hero and display headings — extremely tight leading (0.74) stacks letters into dense editorial blocks; this is the loudest voice on the page and is used sparingly

### ABCArizonaMixVariable — Subheadings and inline labels — sits between body and section heading, bridging the grotesque to the display faces · `--font-abcarizonamixvariable`
- **Substitute:** Inter Bold, Söhne Breit
- **Weights:** 700
- **Sizes:** 20
- **Line height:** 1.15
- **Letter spacing:** 0.0250em
- **Role:** Subheadings and inline labels — sits between body and section heading, bridging the grotesque to the display faces

### ABCArizonaSansVariable — ABCArizonaSansVariable — detected in extracted data but not described by AI · `--font-abcarizonasansvariable`
- **Weights:** 400, 500
- **Sizes:** 11px, 15px, 18px
- **Line height:** 1, 1.11, 1.18, 1.36, 1.4
- **Letter spacing:** 0.017, 0.027, 0.036, 0.04, 0.091
- **Role:** ABCArizonaSansVariable — detected in extracted data but not described by AI

### ABCArizonaText — ABCArizonaText — detected in extracted data but not described by AI · `--font-abcarizonatext`
- **Weights:** 700
- **Sizes:** 20px
- **Line height:** 1
- **Role:** ABCArizonaText — detected in extracted data but not described by AI

### ABCArizonaMix — ABCArizonaMix — detected in extracted data but not described by AI · `--font-abcarizonamix`
- **Weights:** 500
- **Sizes:** 20px
- **Line height:** 1.25
- **Letter spacing:** 0.1
- **Role:** ABCArizonaMix — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 11px | 1 | 0.363px | `--text-caption` |
| body | 15px | 1.18 | 0.6px | `--text-body` |
| body-lg | 18px | 1.27 | 1.206px | `--text-body-lg` |
| subheading | 20px | 1.15 | 0.5px | `--text-subheading` |
| heading-sm | 28px | 1.07 | -0.056px | `--text-heading-sm` |
| heading | 57px | 1.04 | 0.114px | `--text-heading` |
| display | 68px | 0.74 | -0.068px | `--text-display` |

## Tokens — Spacing & Shapes

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 5 | 5px | `--spacing-5` |
| 6 | 6px | `--spacing-6` |
| 8 | 8px | `--spacing-8` |
| 10 | 10px | `--spacing-10` |
| 12 | 12px | `--spacing-12` |
| 13 | 13px | `--spacing-13` |
| 15 | 15px | `--spacing-15` |
| 16 | 16px | `--spacing-16` |
| 19 | 19px | `--spacing-19` |
| 20 | 20px | `--spacing-20` |
| 29 | 29px | `--spacing-29` |
| 30 | 30px | `--spacing-30` |
| 40 | 40px | `--spacing-40` |
| 60 | 60px | `--spacing-60` |
| 160 | 160px | `--spacing-160` |
| 170 | 170px | `--spacing-170` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 12px |
| pills | 24px |
| small | 3px |
| buttons | 6px |
| default | 6px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| sm | `rgba(0, 0, 0, 0.2) 0px 2px 6px 0px` | `--shadow-sm` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 20px
- **Element gap:** 20px

## Components

### Outlined Button
**Role:** Default interactive control across the system

Transparent fill, 1px Press Black (#000000) border, 6px radius, 10–12px horizontal padding, 12–16px vertical padding. Label in ABCArizonaSans 13–15px / weight 500, tracking 0.04em. The border does all the work — no fill, no shadow. This is the button you reach for first.

### Accent Filled Button
**Role:** Featured or category actions that need color punctuation

Highlighter Lime (#edfe5e) or Cornflower (#bed4fb) fill, 1px Press Black border, 6px radius, identical padding to outlined. Label in ABCArizonaSans 13–15px / weight 500, Press Black text. The accent fill sits behind the same black outline, so the button always reads as inked-on-color rather than as a flat shape.

### Pill Button
**Role:** Navigation chips, filter tags, and primary nav items

24px border-radius, 29px horizontal padding, 1px Press Black border, ABCArizonaSans 13–15px / weight 500. The fully rounded ends give this component its own silhouette against the squared outlined buttons.

### Ghost Text Button
**Role:** Low-emphasis links and inline actions

No border, no fill, ABCArizonaSans 13–15px / weight 500 in Press Black with an underline that appears on hover. 3px radius if a background surface is ever applied. Uses the wide body tracking (0.04em) so it reads as a typeset link.

### Bordered Card
**Role:** Universal content container — book entries, article previews, list items

Manuscript Cream (#f9f9f7) fill, 1–2px Press Black border, 12px radius, 20px padding on all sides. The border is the only elevation — no shadow. Content stacks top-down with 16–20px gaps between subhead, body, and meta.

### Accent Card
**Role:** Featured or highlighted content

Same structure as Bordered Card but with Highlighter Lime, Cornflower, or Spring Green fill replacing the cream. Press Black border remains. Used to draw the eye without changing the component geometry.

### Tag / Category Chip
**Role:** Genre, status, and metadata labels

Small ABCArizonaSans 11px / weight 700, tracking 0.067em, all caps. Optional Highlighter Lime or Cornflower fill, 6px radius, 6–8px padding. On a cream surface the tag is just bordered text; on a card it picks up the card's accent color.

### Input Field
**Role:** Text input, search, and form fields

Manuscript Cream fill, 1px Press Black border, 6px radius, 10–12px horizontal padding. Placeholder in Mist Green (#dee5dd) at 13–15px; entered text in Press Black. No focus ring color change — the border thickens or shifts to 2px instead.

### Top Navigation Bar
**Role:** Site-wide navigation

Full-width bar on Manuscript Cream, 96px of horizontal hairline border in Press Black separating it from content. Logo and links set in ABCArizonaSans 13px / weight 500, tracking 0.04em. Active link carries a 1px black underline. 23px column gap between nav items.

### Hero Display Block
**Role:** First-fold headline

ABCCameraHeavy at 64–68px, weight 700, line-height 0.74, tracking near zero. Stacks 2–3 lines into a dense editorial block. Sits directly on the cream canvas — no hero background, no image, no gradient. The type IS the hero.

### Section Heading
**Role:** Sub-page and feature section titles

ABCArizonaFlare at 57px, weight 300 or 400, line-height 1.04. The flared terminals and light weight signal editorial calm — a deliberate counterweight to the heavy display type above it. Tracking is slightly positive (+0.002em) so the serifs breathe.

### Subheading / Inline Label
**Role:** Card titles, form labels, and mid-level headings

ABCArizonaMixVariable at 20px, weight 700, line-height 1.15, tracking 0.025em. Sits between the grotesques and the display serifs as a hybrid voice.

### Body Copy
**Role:** All paragraph text and descriptions

ABCArizonaSans 15–18px, weight 400, line-height 1.18–1.27, tracking 0.04–0.067em. The wide positive tracking is a signature choice — it makes running text feel leaded and typeset, not typed.

### Footer
**Role:** Site-wide footer with links and legal

Manuscript Cream background separated by a 1px Press Black hairline. Multi-column link grid in ABCArizonaSans 13px, 20px column gap. No background fill change, no dark inversion — the footer sits in the same cream paper as the rest of the page.

## Do's and Don'ts

### Do
- Draw all structural elements with a 1px Press Black (#000000) border — let the ink do the work of defining shapes instead of fills or shadows.
- Use Highlighter Lime (#edfe5e), Cornflower (#bed4fb), and Spring Green (#31e992) only as small accent fills on cards, tags, and swatches — never as full-bleed page backgrounds.
- Set body text at ABCArizonaSans 15–18px with positive tracking between 0.04em and 0.067em so copy reads as typeset rather than typed.
- Reserve ABCCameraHeavy at 64–68px / line-height 0.74 for hero display blocks only — the extremely tight leading is the system's loudest voice and loses impact if overused.
- Use ABCArizonaFlare weight 300–400 at 57px for section headings — the whisper-weight serifs create authority through restraint next to the heavy display type.
- Apply 12px radius to cards and 6px to buttons — the two-tier radius is the only geometric curve language in the system.
- Keep page background Manuscript Cream (#f9f9f7) everywhere; never invert to dark mode — the cream is the system's defining surface.

### Don't
- Don't use box-shadows for elevation — the single allowed shadow is rgba(0,0,0,0.2) 0px 2px 6px 0px on buttons only; cards are defined by border alone.
- Don't pair ABCArizonaSans with a second sans-serif body face — Arizona Sans is the only grotesque, and mixing in Inter or Helvetica breaks the typeset voice.
- Don't set display or heading type in ABCArizonaSans weight 700 — the system reserves the grotesque for UI and body, and the display/heading roles belong to Camera Heavy and Flare.
- Don't use the accent colors (lime, cornflower, spring green) for text on white — they lack contrast and will fail readability checks; keep them as fills behind black text only.
- Don't introduce gradients — the system is flat by design; any gradient undermines the inked-on-paper metaphor.
- Don't center body copy in long passages — body text should be left-aligned with a max measure; centering is reserved for short labels and hero headlines.
- Don't round card corners above 12px or button corners above 24px — the geometric vocabulary is restrained and any softer radius breaks the editorial feel.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Page Canvas | `#f9f9f7` | Warm cream paper background for the entire site |
| 1 | Card Surface | `#f9f9f7` | Default card fill — same as canvas, so cards are defined purely by their black border |
| 2 | Accent Card Surface | `#edfe5` | Featured or highlighted cards use the highlighter lime fill |
| 2 | Cool Accent Surface | `#bed4fb` | Secondary featured cards use the cornflower wash |

## Imagery

Imagery is minimal and editorial. The hero and section headers are pure typography on cream — no photography, no illustration, no background image. Where visual content appears, it lives inside bordered cards: book covers, contributor portraits, and product crops are presented as tight rectangular inserts framed by the same 1px black border that defines every UI element. Accent color blocks (lime, cornflower, spring green) sit beside or behind these images as flat swatches rather than as decorative scenes. Icons are line-drawn with thin Press Black strokes at 1px, sometimes paired with the same stroke in Mist Green (#dee5dd) for secondary states. The overall visual density is text-dominant — imagery occupies a small fraction of any screen, and the typographic grid does the work that photography would do on a more conventional site.

## Layout

Layout is a single max-width column (1200px) centered on the Manuscript Cream canvas, with full-width nav and footer bars above and below. The hero is a centered typographic block — no image, no split layout — with the ABCCameraHeavy headline stacked tightly at the top of the page. Below the hero, content flows in horizontal bands separated by 1px Press Black hairlines rather than by background color changes, so the page reads as a continuous sheet of paper divided into sections. Card grids use 2 or 3 columns at desktop, with 20px gutters and consistent 20px internal padding. Section gaps run 80px vertically, giving the page a comfortable, magazine-like rhythm. Navigation is a minimal top bar with a left-aligned wordmark and right-aligned text links, separated from content by a 96px-wide hairline border.

## Agent Prompt Guide

**Quick Color Reference**
- text: #000000 (Press Black)
- background: #f9f9f7 (Manuscript Cream)
- border: #000000 (Press Black, 1px)
- accent: #edfe5e (Highlighter Lime)
- secondary accent: #bed4fb (Cornflower Wash)
- status accent: #31e992 (Spring Green)
- primary action: no distinct CTA color

**3-5 Example Component Prompts**

1. Build a Bordered Card: Manuscript Cream (#f9f9f7) fill, 1px Press Black (#000000) border, 12px radius, 20px padding. Subheading in ABCArizonaMixVariable 20px / weight 700, tracking 0.025em, Press Black. Body in ABCArizonaSans 15px / weight 400, tracking 0.04em, line-height 1.18. Meta caption in ABCArizonaSans 11px / weight 700, tracking 0.067em, all caps.

2. Build an Accent Card: Highlighter Lime (#edfe5e) fill, 1px Press Black border, 12px radius, 20px padding. Headline in ABCArizonaFlare 28px / weight 400, line-height 1.07, Press Black. Include a Tag with Highlighter Lime fill, 6px radius, ABCArizonaSans 11px / weight 700, tracking 0.067em, all caps, Press Black text.

3. Build an Outlined Button: transparent fill, 1px Press Black border, 6px radius, 12px vertical and 20px horizontal padding. Label in ABCArizonaSans 13px / weight 500, tracking 0.04em, Press Black. On hover, swap fill to Paper Shadow (#edf0e9); do not add a shadow.

4. Build a Hero Display Block: no background, no image. ABCCameraHeavy 68px / weight 700, line-height 0.74, tracking -0.001em, Press Black. Stack 2–3 lines left-aligned within the 1200px page max-width. Follow with a body paragraph at ABCArizonaSans 18px / weight 400, line-height 1.27, tracking 0.067em, max measure 65ch.

5. Build a Top Navigation Bar: full-width Manuscript Cream background, 1px Press Black bottom border. Left: wordmark in ABCArizonaSans 15px / weight 700, tracking 0.04em. Right: 4–5 nav links in ABCArizonaSans 13px / weight 500, tracking 0.04em, 23px column gap. Active link carries a 1px Press Black underline.

## Similar Brands

- **Are.na** — Same editorial restraint on a warm off-white canvas, with bordered card grids and minimal color used as accent only
- **The Creative Independent** — Same typographic-led hierarchy pairing a heavy display face with a lighter serif, set on cream paper with hairline dividers
- **It's Nice That** — Same magazine-like rhythm with centered typographic heroes, wide letter-spaced body text, and flat accent color blocks
- **Mailbrew** — Same inked-grid brutalist language — every surface defined by a single black hairline, color reserved for small functional punctuation
- **Substack** — Same literary-media typographic personality and comfortable reading rhythm, with serif headings and grotesques for UI

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-manuscript-cream: #f9f9f7;
  --color-press-black: #000000;
  --color-sage-border: #d2ddd2;
  --color-mist-green: #dee5dd;
  --color-paper-shadow: #edf0e9;
  --color-smoke: #c7c7c6;
  --color-highlighter-lime: #edfe5e;
  --color-cornflower-wash: #bed4fb;
  --color-spring-green: #31e992;

  /* Typography — Font Families */
  --font-abcarizonasans: 'ABCArizonaSans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-abcarizonaflare: 'ABCArizonaFlare', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-abccameraheavy: 'ABCCameraHeavy', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-abcarizonamixvariable: 'ABCArizonaMixVariable', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-abcarizonasansvariable: 'ABCArizonaSansVariable', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-abcarizonatext: 'ABCArizonaText', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-abcarizonamix: 'ABCArizonaMix', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 11px;
  --leading-caption: 1;
  --tracking-caption: 0.363px;
  --text-body: 15px;
  --leading-body: 1.18;
  --tracking-body: 0.6px;
  --text-body-lg: 18px;
  --leading-body-lg: 1.27;
  --tracking-body-lg: 1.206px;
  --text-subheading: 20px;
  --leading-subheading: 1.15;
  --tracking-subheading: 0.5px;
  --text-heading-sm: 28px;
  --leading-heading-sm: 1.07;
  --tracking-heading-sm: -0.056px;
  --text-heading: 57px;
  --leading-heading: 1.04;
  --tracking-heading: 0.114px;
  --text-display: 68px;
  --leading-display: 0.74;
  --tracking-display: -0.068px;

  /* Typography — Weights */
  --font-weight-light: 300;
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-5: 5px;
  --spacing-6: 6px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-13: 13px;
  --spacing-15: 15px;
  --spacing-16: 16px;
  --spacing-19: 19px;
  --spacing-20: 20px;
  --spacing-29: 29px;
  --spacing-30: 30px;
  --spacing-40: 40px;
  --spacing-60: 60px;
  --spacing-160: 160px;
  --spacing-170: 170px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 20px;
  --element-gap: 20px;

  /* Border Radius */
  --radius-sm: 3px;
  --radius-md: 6px;
  --radius-xl: 12px;
  --radius-3xl: 24px;

  /* Named Radii */
  --radius-cards: 12px;
  --radius-pills: 24px;
  --radius-small: 3px;
  --radius-buttons: 6px;
  --radius-default: 6px;

  /* Shadows */
  --shadow-sm: rgba(0, 0, 0, 0.2) 0px 2px 6px 0px;

  /* Surfaces */
  --surface-page-canvas: #f9f9f7;
  --surface-card-surface: #f9f9f7;
  --surface-accent-card-surface: #edfe5;
  --surface-cool-accent-surface: #bed4fb;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-manuscript-cream: #f9f9f7;
  --color-press-black: #000000;
  --color-sage-border: #d2ddd2;
  --color-mist-green: #dee5dd;
  --color-paper-shadow: #edf0e9;
  --color-smoke: #c7c7c6;
  --color-highlighter-lime: #edfe5e;
  --color-cornflower-wash: #bed4fb;
  --color-spring-green: #31e992;

  /* Typography */
  --font-abcarizonasans: 'ABCArizonaSans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-abcarizonaflare: 'ABCArizonaFlare', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-abccameraheavy: 'ABCCameraHeavy', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-abcarizonamixvariable: 'ABCArizonaMixVariable', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-abcarizonasansvariable: 'ABCArizonaSansVariable', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-abcarizonatext: 'ABCArizonaText', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-abcarizonamix: 'ABCArizonaMix', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 11px;
  --leading-caption: 1;
  --tracking-caption: 0.363px;
  --text-body: 15px;
  --leading-body: 1.18;
  --tracking-body: 0.6px;
  --text-body-lg: 18px;
  --leading-body-lg: 1.27;
  --tracking-body-lg: 1.206px;
  --text-subheading: 20px;
  --leading-subheading: 1.15;
  --tracking-subheading: 0.5px;
  --text-heading-sm: 28px;
  --leading-heading-sm: 1.07;
  --tracking-heading-sm: -0.056px;
  --text-heading: 57px;
  --leading-heading: 1.04;
  --tracking-heading: 0.114px;
  --text-display: 68px;
  --leading-display: 0.74;
  --tracking-display: -0.068px;

  /* Spacing */
  --spacing-5: 5px;
  --spacing-6: 6px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-13: 13px;
  --spacing-15: 15px;
  --spacing-16: 16px;
  --spacing-19: 19px;
  --spacing-20: 20px;
  --spacing-29: 29px;
  --spacing-30: 30px;
  --spacing-40: 40px;
  --spacing-60: 60px;
  --spacing-160: 160px;
  --spacing-170: 170px;

  /* Border Radius */
  --radius-sm: 3px;
  --radius-md: 6px;
  --radius-xl: 12px;
  --radius-3xl: 24px;

  /* Shadows */
  --shadow-sm: rgba(0, 0, 0, 0.2) 0px 2px 6px 0px;
}
```
