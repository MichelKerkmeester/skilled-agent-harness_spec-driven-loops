# Sackville & Co. — Style Reference
> Cobalt zine pressed onto cream — a hand-inked editorial spread where the illustration is the hero and the UI is just typeset text on warm paper.

**Theme:** light

Sackville & Co. reads like an editorial risograph zine pressed onto cream paper: a hand-inked cobalt-blue illustration anchors one half, while the other half breathes as off-white canvas with tight grotesque type and a single oversized oval outlined in blue. The system is intentionally print-coded — flat color, no gradients, no shadows, no filled buttons — and uses a saturated secondary palette (peach, fire-red, marigold, terracotta) as tonal accents in artwork and borders rather than as functional UI fills. Typography carries all the hierarchy: Founders Grotesk at weight 400 with aggressive negative line-heights (0.80–0.90) on display sizes creates the masthead pressure of a magazine cover, while TimesNow SemiLight provides editorial serif contrast for select headings. Everything feels hand-set: thin outlines, generous whitespace, no elevation, no rounded cards — just confident ink on warm paper.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Cream Paper | `#f3f4ee` | `--color-cream-paper` | Page canvas, card surfaces — the warm off-white that makes every ink color feel like print |
| Bone White | `#f8f8f8` | `--color-bone-white` | Alternate surface wash, subtle section differentiation from the cream canvas |
| Press Black | `#231f20` | `--color-press-black` | Primary text, borders, dividers, icon strokes — the near-black ink that anchors every screen |
| Charcoal Headline | `#383435` | `--color-charcoal-headline` | Display heading text — slightly lifted from press black for softer masthead weight |
| Mid Gray | `#9a9a9a` | `--color-mid-gray` | Muted helper text, hairline borders, secondary metadata |
| Pure Black | `#000000` | `--color-pure-black` | Icon fills, maximum-contrast borders, nav accent |
| Cobalt Ink | `#245dc5` | `--color-cobalt-ink` | Primary brand color — illustrated duotone wash, outlined action borders, interactive text — saturated blue against cream creates the risograph-print signature |
| Peach Wash | `#ffc6a6` | `--color-peach-wash` | Secondary illustration accent, decorative borders, warm tonal fill — the cheek-pink of risograph layering |
| Fire Red | `#f04736` | `--color-fire-red` | Outlined action borders, emphasis strokes, error-like accent — used as editorial red rather than as a functional error state |
| Vermillion | `#f52302` | `--color-vermillion` | Deep red-orange accent for borders and fills — the warmest ink in the riso palette |
| Crimson | `#d42121` | `--color-crimson` | Deep red accent — used sparingly in illustration washes and emphasis borders |
| Marigold | `#feee71` | `--color-marigold` | Yellow accent fill, spot-color highlights, decorative emphasis — the third riso plate |
| Terracotta | `#b45e42` | `--color-terracotta` | Warm brown accent for body and heading borders — the earthiest ink in the editorial palette |

## Tokens — Typography

### FoundersGrotesk — Workhorse type for everything from body to display — single weight 400 with no bold variants means hierarchy is created purely through size, line-height, and letter-spacing, not weight contrast. The aggressive negative line-heights (0.80 at 130px) create magazine-cover masthead pressure. Substitute: Neue Haas Grotesk, Inter, Söhne. · `--font-foundersgrotesk`
- **Weights:** 400
- **Sizes:** 16px, 22px, 23px, 25px, 26px, 29px, 32px, 34px, 38px, 47px, 50px, 60px, 72px, 85px, 99px, 122px, 130px
- **Line height:** 0.80–2.19 (tight on display: 0.80–0.90 at 72px+; standard 1.15–1.30 on body sizes)
- **OpenType features:** `"liga"`
- **Role:** Workhorse type for everything from body to display — single weight 400 with no bold variants means hierarchy is created purely through size, line-height, and letter-spacing, not weight contrast. The aggressive negative line-heights (0.80 at 130px) create magazine-cover masthead pressure. Substitute: Neue Haas Grotesk, Inter, Söhne.

### TimesNow SemiLight — Editorial serif contrast for select headings and navigation — a humanist serif breaks the grotesque monotony at key moments, creating the magazine-section-divider effect. Substitute: Times Now, Tiempos, Source Serif. · `--font-timesnow-semilight`
- **Weights:** 400 (SemiLight)
- **Sizes:** 29px, 34px, 60px, 122px, 130px
- **Line height:** 0.80–1.15
- **OpenType features:** `"liga"`
- **Role:** Editorial serif contrast for select headings and navigation — a humanist serif breaks the grotesque monotony at key moments, creating the magazine-section-divider effect. Substitute: Times Now, Tiempos, Source Serif.

### Sackville Script (hand-drawn wordmark) — Custom hand-inked cursive used only for the brand wordmark — overlaid on illustrations and hero compositions. Not a UI font. No substitute; this is the signature mark. · `--font-sackville-script-hand-drawn-wordmark`
- **Weights:** 400
- **Sizes:** 
- **Line height:** natural
- **Role:** Custom hand-inked cursive used only for the brand wordmark — overlaid on illustrations and hero compositions. Not a UI font. No substitute; this is the signature mark.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 16px | 1.3 | — | `--text-caption` |
| body | 22px | 1.3 | — | `--text-body` |
| body-lg | 25px | 1.15 | — | `--text-body-lg` |
| subheading | 29px | 1.15 | — | `--text-subheading` |
| heading-sm | 34px | 1 | — | `--text-heading-sm` |
| heading | 47px | 0.94 | — | `--text-heading` |
| heading-lg | 72px | 0.85 | — | `--text-heading-lg` |
| display | 99px | 0.85 | — | `--text-display` |
| display-lg | 130px | 0.8 | — | `--text-display-lg` |

## Tokens — Spacing & Shapes

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 5 | 5px | `--spacing-5` |
| 6 | 6px | `--spacing-6` |
| 9 | 9px | `--spacing-9` |
| 10 | 10px | `--spacing-10` |
| 12 | 12px | `--spacing-12` |
| 13 | 13px | `--spacing-13` |
| 14 | 14px | `--spacing-14` |
| 15 | 15px | `--spacing-15` |
| 19 | 19px | `--spacing-19` |
| 20 | 20px | `--spacing-20` |
| 21 | 21px | `--spacing-21` |
| 40 | 40px | `--spacing-40` |
| 43 | 43px | `--spacing-43` |
| 58 | 58px | `--spacing-58` |
| 60 | 60px | `--spacing-60` |
| 72 | 72px | `--spacing-72` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 0px (square tags only) |
| cards | 10px |
| buttons | 50px |
| ovalButtons | 81px |

### Layout

- **Section gap:** 43px
- **Card padding:** 20px
- **Element gap:** 10px

## Components

### Age-Gate Oval Button (Primary Action)
**Role:** The signature interactive element — a fully oval outlined button that replaces a conventional filled CTA

Oval shape with border-radius 81px, outlined in Cobalt Ink (#245dc5) at ~1.5–2px stroke, transparent fill on the cream canvas. Text inside: FoundersGrotesk 400 at ~38–47px, line-height 0.90–0.94, color Cobalt Ink. No hover fill, no shadow, no border-radius collapse — the outline IS the affordance. Padding approximately 18px vertical, 60–80px horizontal to create the stretched ellipse. This is the only interactive element on the age-gate and it carries the entire page's visual weight.

### Secondary Text Link (I'm Under 21)
**Role:** Text-only fallback option below the primary oval button

No border, no background, no padding. FoundersGrotesk 400 at ~38–47px, line-height 0.90–0.94, color Cobalt Ink (#245dc5). The visual hierarchy between the outlined oval and the bare text creates an implicit choice: the oval is the affirmative action, the text is the passive opt-out.

### Age Verification Eyebrow
**Role:** The question prompt above the age-gate button

FoundersGrotesk 400 at ~16–18px, uppercase or sentence case, color Press Black (#231f20) or Cobalt Ink (#245dc5). No letter-spacing adjustment visible. Acts as a quiet label — the visual weight lives in the response options below.

### Hand-Drawn Wordmark
**Role:** Brand identity mark overlaid on hero illustrations

Custom cursive script reading 'Sackville' — hand-inked, cobalt blue (#245dc5), overlaid at 100% width across the top of hero illustration panels. Not set in a font; this is an asset. Always sits on top of duotone illustration, never on flat surfaces.

### Duotone Illustration Panel
**Role:** Full-bleed editorial artwork that dominates hero and section compositions

Two-color risograph-style illustration using Cobalt Ink (#245dc5) as the dominant plate and Cream Paper (#f3f4ee) as the negative space. Tonal depth is created by hatching density, not additional colors. Optional Peach Wash (#ffc6a6) as a third plate. No borders, no rounded corners — illustrations bleed to panel edges. Aspect ratios vary by composition but always fill at least 50% of the viewport in hero contexts.

### Section Divider Rule
**Role:** Horizontal separator between content sections

1px solid line in Press Black (#231f20), full-width, used sparingly. No decorative styling, no dashed patterns, no double rules. The system trusts the whitespace and the type scale to create section breaks; a divider appears only when a true structural break is needed.

### Product Card
**Role:** E-commerce or collection grid item

Flat surface on the cream canvas — no background fill, no border, no shadow. Corner radius 10px only if a contained image is used. Product imagery fills the card; metadata below in FoundersGrotesk 400 at 16–22px. The card system is image-forward, not frame-forward — the photograph or illustration IS the card, and the type sits beneath it unframed.

### Editorial Headline Block
**Role:** Magazine-style display heading for section titles and hero copy

FoundersGrotesk 400 at 72–130px, line-height 0.80–0.85, color Press Black (#231f20) or Charcoal Headline (#383435). No bold weight, no underline, no color treatment — the size and the negative leading do all the work. Optional TimesNow SemiLight variant for serif contrast on key section openers.

### Riso-Color Border Accent
**Role:** Decorative border in secondary palette colors

Thin (1–2px) solid borders in Peach Wash (#ffc6a6), Fire Red (#f04736), Marigold (#feee71), or Terracotta (#b45e42). Used to frame illustration details, create editorial callouts, or add tonal warmth to card edges. Never used as a functional border on inputs or form elements.

### Navigation Bar
**Role:** Top-level site navigation

Flat on the cream canvas, no background fill, no shadow. Nav items in FoundersGrotesk 400 at ~16–22px, Press Black (#231f20). Active state indicated by a 1px underline or a chromatic accent color (Cobalt Ink). Logo on the left uses the TimesNow SemiLight wordmark variant. Sticky behavior optional; the system is comfortable with scroll-away nav.

## Do's and Don'ts

### Do
- Use Cobalt Ink (#245dc5) as the outlined action border for all primary interactive elements — never fill a button with it; the outline is the brand's signature
- Set display type at 72px+ with line-height 0.80–0.85 to create the magazine-masthead compression that defines the system's editorial weight
- Let the cream canvas (#f3f4ee) show — do not cover it with white surfaces or dark mode equivalents; the warm paper tone is the brand's foundation
- Use the riso accent palette (Peach Wash, Fire Red, Marigold, Vermillion, Terracotta) only in illustration washes, decorative borders, and spot-color emphasis — never as functional UI fills for buttons, badges, or states
- Reserve TimesNow SemiLight for at most one or two heading moments per page — it breaks the grotesque monotony and should feel like a rare editorial interruption
- Keep the wordmark as a hand-drawn asset overlaid on illustration panels — do not re-create it in a web font or place it on flat surfaces without imagery
- Use the 81px radius exclusively for the age-gate oval and any other large interactive prompts — the stretched ellipse is a system signature, not a default

### Don't
- Do not fill any button with Cobalt Ink, Fire Red, or any chromatic color — the system is outlined-action only; filled buttons would break the zine aesthetic
- Do not introduce box-shadows, drop-shadows, or any elevation effects — the design is flat by principle; depth comes from color contrast and illustration density, not from blur or offset
- Do not use a white (#ffffff) canvas — the cream (#f3f4ee) is warmer and is the reason the ink colors read as print rather than screen
- Do not set body text in the serif TimesNow SemiLight — it is a display contrast font only; body copy stays in FoundersGrotesk 400
- Do not apply bold or semibold weights — the type system is single-weight (400) by design; hierarchy is size and line-height, never weight
- Do not round cards or images beyond 10px — the 50px and 81px radii are reserved for buttons and the oval action; everything else stays close to sharp
- Do not add gradients, blurs, or glow effects to any element — the palette is risograph-flat; any smooth tonal transition breaks the print illusion

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Cream Paper | `#f3f4ee` | Base page canvas — the warm off-white that all content sits on, never replaced by a card background |
| 1 | Bone White | `#f8f8f8` | Alternate surface wash for sections that need subtle differentiation from the cream canvas |
| 2 | Peach Wash | `#ffc6a6` | Tonal illustration surface — appears as a background plate in hero artwork, not as a UI card |

## Elevation

The system is deliberately flat — no box-shadows, no drop-shadows, no blurs, no glow effects. Depth and hierarchy are achieved entirely through color contrast (ink on cream), illustration density (riso hatching), and typographic scale (tight display leading). This is a print-first design language applied to screen, and elevation would break the illusion that everything is ink pressed onto warm paper.

## Imagery

The visual language is defined by duotone risograph-style illustration rendered primarily in Cobalt Ink (#245dc5) on the cream canvas, with optional Peach Wash (#ffc6a6) and other accent plates for tonal depth. Illustrations are full-bleed, hard-edged, and hand-inked — no gradients, no 3D, no photography on hero compositions. The hand-drawn 'Sackville' cursive wordmark overlays illustration panels as a brand signature. Photography, when used in product contexts, is unframed and sits directly on the cream canvas without borders or cards. The overall density is image-dominant in hero moments and type-dominant in editorial sections.

## Layout

The age-gate uses a full-bleed 50/50 split: the left half is a duotone illustration panel (Cobalt Ink on cream, no border, bleeding to edges), the right half is a text-and-interactive column on the cream canvas. There is no max-width container — the split fills the viewport. The interactive column centers its content vertically and horizontally within its half, with the eyebrow prompt at the top, the outlined oval button in the center, and the secondary text option below. Navigation is minimal and top-positioned. The system does not use a standard SaaS marketing layout (no hero band, no feature grid, no pricing table) — instead, each page reads as an editorial spread with full-bleed illustration panels alternating with text-driven columns. Section gaps are wide (~43px+) and whitespace is treated as a compositional element, not as filler.

## Agent Prompt Guide

Quick Color Reference:
- text: #231f20 (Press Black)
- background: #f3f4ee (Cream Paper)
- border: #231f20 (Press Black, 1px hairlines)
- accent: #245dc5 (Cobalt Ink)
- secondary accent: #ffc6a6 (Peach Wash)
- primary action: #245dc5 (outlined action border)

3-5 Example Component Prompts:

1. Create an age-gate oval button: transparent fill, 1.5px solid border in #245dc5, border-radius 81px, padding 18px 72px. Text: 'I'M OVER 21' in FoundersGrotesk 400, 42px, line-height 0.94, color #245dc5. On the cream canvas (#f3f4ee). No shadow, no hover fill change — the outline IS the affordance.

2. Create an editorial headline block: text in FoundersGrotesk 400, 99px, line-height 0.80, color #231f20. Two or three words max. No bold, no underline, no color accent — the size and negative leading do all the work. Background is the cream canvas (#f3f4ee) with no container.

3. Create a duotone illustration panel: full-bleed left half of a split layout, no border, no radius. Illustration rendered in #245dc5 on the #f3f4ee negative space. Overlay the hand-drawn 'Sackville' cursive wordmark at 100% width across the top in #245dc5. No peach or red accents in this version — pure two-color riso.

4. Create a product card: no background fill, no border, no shadow, no radius. Product image fills the card area at 10px corner radius only if the image is rectangular. Metadata below: product name in FoundersGrotesk 400, 22px, line-height 1.15, color #231f20. Price in same type, 16px, color #383435. The card is the image, not a frame.

5. Create a riso-accent callout block: 1px solid border in Fire Red (#f04736) or Marigold (#feee71) at 1–2px stroke, padding 16px 20px, on the cream canvas. Interior text in FoundersGrotesk 400, 22px, color #231f20. The colored border is the only visual signal — no fill, no icon, no badge shape.

## Risograph Color Logic

The accent palette is modeled on a three-plate riso press: Cobalt Blue (#245dc5) is the dominant plate, Peach (#ffc6a6) is the second plate, and Marigold (#feee71) or Fire Red (#f04736) is the spot-color third plate. Colors layer by opacity overlap — Peach on Cobalt creates a warm purple tone, Marigold on Cobalt creates an olive green. When generating illustrations or decorative elements, think in terms of which 'plate' is being printed, not which hex value fills a shape. The system intentionally includes near-duplicate hues (multiple reds, multiple oranges) because they represent separate ink plates, not a gradient.

## Similar Brands

- **Aesop** — Same editorial restraint on warm off-white canvas, grotesque single-weight typography, and bordered/outlined interactive elements rather than filled buttons — both treat the page as a printed page, not a screen
- **Maison Margiela** — Same riso/zine-print visual code with hand-inked illustration, cream backgrounds, and tight display type that creates magazine-cover pressure
- **A24** — Same flat-color illustration aesthetic with duotone treatment, hand-drawn wordmarks, and a saturated secondary palette used as editorial emphasis rather than functional UI
- **Toast (restaurant OS)** — Same single-weight grotesque typography on a warm neutral canvas, with no shadows, no gradients, and no filled buttons — both trust whitespace and type scale to create hierarchy

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-cream-paper: #f3f4ee;
  --color-bone-white: #f8f8f8;
  --color-press-black: #231f20;
  --color-charcoal-headline: #383435;
  --color-mid-gray: #9a9a9a;
  --color-pure-black: #000000;
  --color-cobalt-ink: #245dc5;
  --color-peach-wash: #ffc6a6;
  --color-fire-red: #f04736;
  --color-vermillion: #f52302;
  --color-crimson: #d42121;
  --color-marigold: #feee71;
  --color-terracotta: #b45e42;

  /* Typography — Font Families */
  --font-foundersgrotesk: 'FoundersGrotesk', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-timesnow-semilight: 'TimesNow SemiLight', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-sackville-script-hand-drawn-wordmark: 'Sackville Script (hand-drawn wordmark)', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 16px;
  --leading-caption: 1.3;
  --text-body: 22px;
  --leading-body: 1.3;
  --text-body-lg: 25px;
  --leading-body-lg: 1.15;
  --text-subheading: 29px;
  --leading-subheading: 1.15;
  --text-heading-sm: 34px;
  --leading-heading-sm: 1;
  --text-heading: 47px;
  --leading-heading: 0.94;
  --text-heading-lg: 72px;
  --leading-heading-lg: 0.85;
  --text-display: 99px;
  --leading-display: 0.85;
  --text-display-lg: 130px;
  --leading-display-lg: 0.8;

  /* Typography — Weights */
  --font-weight-regular: 400;

  /* Spacing */
  --spacing-5: 5px;
  --spacing-6: 6px;
  --spacing-9: 9px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-13: 13px;
  --spacing-14: 14px;
  --spacing-15: 15px;
  --spacing-19: 19px;
  --spacing-20: 20px;
  --spacing-21: 21px;
  --spacing-40: 40px;
  --spacing-43: 43px;
  --spacing-58: 58px;
  --spacing-60: 60px;
  --spacing-72: 72px;

  /* Layout */
  --section-gap: 43px;
  --card-padding: 20px;
  --element-gap: 10px;

  /* Border Radius */
  --radius-lg: 10px;
  --radius-full: 50px;
  --radius-full-2: 81px;

  /* Named Radii */
  --radius-tags: 0px (square tags only);
  --radius-cards: 10px;
  --radius-buttons: 50px;
  --radius-ovalbuttons: 81px;

  /* Surfaces */
  --surface-cream-paper: #f3f4ee;
  --surface-bone-white: #f8f8f8;
  --surface-peach-wash: #ffc6a6;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-cream-paper: #f3f4ee;
  --color-bone-white: #f8f8f8;
  --color-press-black: #231f20;
  --color-charcoal-headline: #383435;
  --color-mid-gray: #9a9a9a;
  --color-pure-black: #000000;
  --color-cobalt-ink: #245dc5;
  --color-peach-wash: #ffc6a6;
  --color-fire-red: #f04736;
  --color-vermillion: #f52302;
  --color-crimson: #d42121;
  --color-marigold: #feee71;
  --color-terracotta: #b45e42;

  /* Typography */
  --font-foundersgrotesk: 'FoundersGrotesk', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-timesnow-semilight: 'TimesNow SemiLight', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-sackville-script-hand-drawn-wordmark: 'Sackville Script (hand-drawn wordmark)', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 16px;
  --leading-caption: 1.3;
  --text-body: 22px;
  --leading-body: 1.3;
  --text-body-lg: 25px;
  --leading-body-lg: 1.15;
  --text-subheading: 29px;
  --leading-subheading: 1.15;
  --text-heading-sm: 34px;
  --leading-heading-sm: 1;
  --text-heading: 47px;
  --leading-heading: 0.94;
  --text-heading-lg: 72px;
  --leading-heading-lg: 0.85;
  --text-display: 99px;
  --leading-display: 0.85;
  --text-display-lg: 130px;
  --leading-display-lg: 0.8;

  /* Spacing */
  --spacing-5: 5px;
  --spacing-6: 6px;
  --spacing-9: 9px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-13: 13px;
  --spacing-14: 14px;
  --spacing-15: 15px;
  --spacing-19: 19px;
  --spacing-20: 20px;
  --spacing-21: 21px;
  --spacing-40: 40px;
  --spacing-43: 43px;
  --spacing-58: 58px;
  --spacing-60: 60px;
  --spacing-72: 72px;

  /* Border Radius */
  --radius-lg: 10px;
  --radius-full: 50px;
  --radius-full-2: 81px;
}
```
