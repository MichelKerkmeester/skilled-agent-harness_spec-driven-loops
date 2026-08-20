# Home — Style Reference
> Stargazer's dark observatory

**Theme:** dark

Fluidtouch operates as a digital observatory: near-black canvas (#121318) hosts monumental white type and a constellation of pale dots connected by hairline vectors, with a single hot pink (#ed1672) acting as the only chromatic signal in an otherwise monochrome universe. Display voice is Poppins 700 at scale that borders on poster-sized (110px hero), while Muli 300 whispers at body sizes — the contrast between geometric-bold and humanist-soft is the system's emotional center. Surfaces are flat and borderless; depth comes from slightly lighter panels (#191c26) and hairline #212529 rules, never from shadows. Components are generously padded and pill-shaped (100px radius), floating in generous negative space that makes every interactive element feel deliberate rather than dense.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Hot Magenta | `#ed1672` | `--color-hot-magenta` | Active nav links, primary CTA fills, decorative accent dots — the only chromatic voice in the system, reserved so each occurrence reads as signal |
| Midnight Ink | `#121318` | `--color-midnight-ink` | Page canvas, hero background, footer — the deep-space base layer everything floats on |
| Deep Space | `#191c26` | `--color-deep-space` | Elevated card surfaces, section backgrounds one step above canvas |
| Slate Edge | `#212529` | `--color-slate-edge` | Hairline borders, image frame rules, subtle structural dividers |
| Pure White | `#ffffff` | `--color-pure-white` | Primary text, headline color, nav links, button text — the only color competing with the magenta accent |
| Void Black | `#000000` | `--color-void-black` | Supporting palette color for small decorative accents when the core palette needs contrast. Do not promote it to the primary CTA color |

## Tokens — Typography

### Poppins — Display headlines at 700 weight dominate at 110px — the geometric bold reads as monumental and confident, the kind of type that fills a dark page like a billboard. At 400 it's used for nav and small UI labels where it stays unobtrusive. · `--font-poppins`
- **Substitute:** Montserrat, Inter
- **Weights:** 400, 700
- **Sizes:** 14px, 16px, 110px
- **Line height:** 1.20 (14px), 1.25 (16px), 1.00 (110px)
- **Role:** Display headlines at 700 weight dominate at 110px — the geometric bold reads as monumental and confident, the kind of type that fills a dark page like a billboard. At 400 it's used for nav and small UI labels where it stays unobtrusive.

### Muli — Body and nav body text. Weight 300 is the signature choice — a humanist sans at near-thin weight against the Poppins 700 display creates a call-and-response rhythm: the headline shouts, the body whispers. Muli's softer curves (vs Poppins' geometric strictness) warm the dark page. · `--font-muli`
- **Substitute:** Mulish, Source Sans 3
- **Weights:** 300, 400
- **Sizes:** 18px, 22px
- **Line height:** 1.00 (18px), 1.50 (22px)
- **Role:** Body and nav body text. Weight 300 is the signature choice — a humanist sans at near-thin weight against the Poppins 700 display creates a call-and-response rhythm: the headline shouts, the body whispers. Muli's softer curves (vs Poppins' geometric strictness) warm the dark page.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 14px | 1.2 | — | `--text-caption` |
| body-sm | 16px | 1.25 | — | `--text-body-sm` |
| subheading | 18px | 1 | — | `--text-subheading` |
| body | 22px | 1.5 | — | `--text-body` |
| display | 110px | 1 | — | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 8px

**Density:** spacious

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 10 | 10px | `--spacing-10` |
| 15 | 15px | `--spacing-15` |
| 20 | 20px | `--spacing-20` |
| 32 | 32px | `--spacing-32` |
| 45 | 45px | `--spacing-45` |
| 50 | 50px | `--spacing-50` |
| 56 | 56px | `--spacing-56` |
| 60 | 60px | `--spacing-60` |
| 80 | 80px | `--spacing-80` |
| 113 | 113px | `--spacing-113` |
| 128 | 128px | `--spacing-128` |
| 210 | 210px | `--spacing-210` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 100px |
| cards | 0px |
| inputs | 0px |
| buttons | 100px |

### Layout

- **Page max-width:** 1280px
- **Section gap:** 113px
- **Card padding:** 20-32px
- **Element gap:** 15px

## Components

### Pill CTA Button
**Role:** Primary action trigger — the only filled button in the system

100px border-radius (full pill), #ed1672 fill, white text, Poppins 400 at 16px with 15px horizontal padding and 10px vertical padding. No shadow, no border. The full pill shape on a dark canvas makes the button look like a physical capsule.

### Ghost Nav Link
**Role:** Navigation item in resting state

Transparent background, no border, Muli 300/400 at 18px, white text. Horizontal gap of 56px between items. On hover, transitions to white; active state shown in Hot Magenta (#ed1672).

### Active Nav Link
**Role:** Currently selected page indicator

Same geometry as Ghost Nav Link but text color is #ed1672. The pink is the only visual signal of which page you're on — no underline, no pill background.

### Brand Mark
**Role:** Logo lockup in header

Two-part: a square Hot Magenta (#ed1672) icon block containing a stylized 'F' cutout, followed by the white 'fluidtouch' wordmark in Poppins 700. The colored block against the dark header is the only saturated color in the masthead.

### Hero Display Headline
**Role:** Page-level headline on hero sections

Poppins 700 at 110px, line-height 1.00, white (#ffffff). Allowed to break across two lines naturally. Often punctuated with a single Hot Magenta (#ed1672) period at the end as a decorative accent dot.

### Hero Subtext
**Role:** Supporting line beneath the display headline

Muli 300 at 18px, white text, centered below the headline with generous vertical gap (113px+ from heading). The thin weight against the 110px Poppins bold creates the system's signature typographic contrast.

### Body Text Block
**Role:** Standard paragraph content

Muli 300 at 22px, line-height 1.50, white text. 113px horizontal margin on both sides keeps the measure short and breathable. No first-line indent.

### Constellation Background Pattern
**Role:** Decorative atmosphere layer on hero

Subtle network of small white dots (~2-3px) connected by hairline lines, scattered across the dark canvas at low opacity. Creates a 'digital cosmos' texture without competing with the headline. Density is low — only 3% colorfulness — so the pattern reads as background, not foreground.

### Full-bleed Image Section
**Role:** Lifestyle or product photography inserted between dark sections

Edge-to-edge image with no padding or margin, framed only by the dark sections above and below. No border-radius. Photography is warm, naturally lit, human-scaled — a deliberate counterpoint to the abstract digital hero.

### Hairline Section Divider
**Role:** Subtle structural rule between content blocks

1px line in #212529 spanning the full content width. No other divider treatment is used — no gradients, no shadows.

### Magenta Accent Dot
**Role:** Decorative punctuation — typically the period after a headline

Solid #ed1672 circle, roughly 1em diameter, set inline at the end of a headline. Serves as the final chromatic note of the page's opening statement.

## Do's and Don'ts

### Do
- Use #ed1672 only for the active nav link, the filled CTA, and the decorative accent dot — limit to 2-3 instances per screen
- Set hero headlines at exactly 110px in Poppins 700 with line-height 1.00 to maintain the billboard impact
- Pair Muli 300 body text with the Poppins 700 display — never substitute another humanist sans for Muli, the weight contrast is the system
- Use 100px border-radius on every button and tag — the full pill shape is non-negotiable for brand recognition
- Maintain 113px horizontal margins on centered text blocks to preserve the floating-in-space feel
- Let the constellation pattern stay at 3% colorfulness — never boost opacity, it must read as background atmosphere
- Use full-bleed photography only between dark sections, never on the same plane as text

### Don't
- Don't introduce a second accent color — the entire brand voice is one magenta against monochrome
- Don't apply drop shadows to any element; depth comes from surface lightness steps only
- Don't use Poppins 400 for headlines or Muli 400 for display — weight roles are fixed
- Don't reduce the 110px hero size for 'mobile friendliness' without a deliberate type-scale override
- Don't add border-radius to cards, images, or inputs — only buttons and tags get the 100px pill
- Don't use #ed1672 for body text or small labels — it fails contrast (4.4:1) and the pink must remain large or decorative
- Don't stack multiple saturated elements on one screen — the dark canvas is the brand, keep it 97% achromatic

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Void Black | `#000000` | Deepest full-bleed sections (video backgrounds, hard CTA stops) |
| 1 | Midnight Ink | `#121318` | Primary page canvas for hero, body, and footer |
| 2 | Deep Space | `#191c26` | Elevated card panels, lighter section bands |
| 3 | Slate Edge | `#212529` | Border-level separation, never used as a filled surface |

## Elevation

The system is deliberately shadowless. Depth is communicated through surface lightness steps (#121318 → #191c26) and 1px Slate Edge hairline borders, never drop shadows. This flatness reinforces the observatory metaphor — objects sit on the dark plane like celestial bodies, not stacked cards.

## Imagery

Photography is warm and human-scaled: lifestyle shots of people working on laptops in naturally lit, lived-in office spaces with brick walls and soft window light. The image treatment is full-bleed with no rounded corners or borders — photographs bleed edge-to-edge, framed only by the dark sections above and below. Decorative imagery is abstract: a low-opacity constellation of connected dots and lines scattered across the dark canvas, evoking a star map. No illustrations, no 3D renders, no product screenshots — the brand expresses itself through real human moments and the abstract cosmic pattern, never through literal product depictions.

## Layout

Full-bleed sections stacked vertically, each section occupying the full viewport width with no side gutters. The hero is a dark canvas with the constellation pattern, a centered headline stack (brand mark → massive headline → subtext) floating in generous 113px horizontal margins. Below the hero, a full-bleed warm photograph creates a tonal break — organic and human against the digital dark. Lower sections return to pure #000000 black for video or hard CTA stops. Navigation sits as a transparent bar overlaid on the hero with 56px gaps between items. Vertical rhythm is spacious: 113px between major sections, 60-80px between content blocks within a section. No sidebar, no grid cards, no multi-column content — the page is a sequence of single-focus full-width moments.

## Agent Prompt Guide

**Quick Color Reference**
- text: #ffffff
- background: #121318
- border: #212529
- surface: #191c26
- accent: #ed1672
- primary action: #ed1672 (filled action)

**3-5 Example Component Prompts**

1. **Hero section**: Background #121318 with a low-opacity white dot-and-line constellation pattern. Centered headline at 110px Poppins 700 in #ffffff, line-height 1.00. Append a solid #ed1672 period after the headline as decorative punctuation. Below at 113px gap, subtext at 18px Muli 300 in #ffffff, centered.

2. **Navigation bar**: Transparent background overlaid on dark canvas. Brand mark on left (Hot Magenta #ed1672 square icon + white 'fluidtouch' Poppins 700 wordmark). Nav links on right: 6 items, Muli 400 18px in #ffffff, 56px gap between items. Active item (first one) colored #ed1672 instead of white.

3. **Pill CTA button**: 100px border-radius, #ed1672 fill, white Poppins 400 16px text, 15px horizontal padding × 10px vertical padding. No border, no shadow. On hover, no color change — only subtle brightness lift via opacity.

4. **Full-bleed image section**: Edge-to-edge photograph, no border-radius, no border, no padding. Must sit directly between two dark sections with no gap. Image should be warm-toned, human-scaled, naturally lit.

5. **Body text block**: Muli 300 at 22px, line-height 1.50, color #ffffff. Content container centered with 113px left and right margins. No first-line indent, no drop cap, single column only.

## Type Pairing Philosophy

The system's emotional engine is the Poppins 700 / Muli 300 pairing. Poppins is geometric and architectural — its circular 'o' and straight 'l' feel like they were drawn with a compass. Muli is humanist and warm — its softer terminals and slightly varied stroke weights feel hand-lettered. Stacked together, the geometric display reads as the brand's public voice (confident, monumental) while the humanist body reads as its private voice (approachable, considered). Never replace Muli with another geometric sans like Inter or Lato — the contrast in genre is what creates the system's quiet personality.

## Similar Brands

- **Linear** — Same dark-mode observatory aesthetic with near-black canvas, generous whitespace, and minimal color — though Linear uses purple, Fluidtouch uses magenta
- **Vercel** — Full-bleed dark sections, monumental white headlines, and a single high-contrast accent color punctuating an otherwise monochrome system
- **Nothing.tech** — Dark-canvas brand identity with one saturated neon accent and typographic boldness as the primary visual signal
- **Stripe** — Full-bleed section rhythm, generous spacing, and confidence in letting whitespace do the heavy lifting instead of decorative elements

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-hot-magenta: #ed1672;
  --color-midnight-ink: #121318;
  --color-deep-space: #191c26;
  --color-slate-edge: #212529;
  --color-pure-white: #ffffff;
  --color-void-black: #000000;

  /* Typography — Font Families */
  --font-poppins: 'Poppins', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-muli: 'Muli', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.2;
  --text-body-sm: 16px;
  --leading-body-sm: 1.25;
  --text-subheading: 18px;
  --leading-subheading: 1;
  --text-body: 22px;
  --leading-body: 1.5;
  --text-display: 110px;
  --leading-display: 1;

  /* Typography — Weights */
  --font-weight-light: 300;
  --font-weight-regular: 400;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-unit: 8px;
  --spacing-10: 10px;
  --spacing-15: 15px;
  --spacing-20: 20px;
  --spacing-32: 32px;
  --spacing-45: 45px;
  --spacing-50: 50px;
  --spacing-56: 56px;
  --spacing-60: 60px;
  --spacing-80: 80px;
  --spacing-113: 113px;
  --spacing-128: 128px;
  --spacing-210: 210px;

  /* Layout */
  --page-max-width: 1280px;
  --section-gap: 113px;
  --card-padding: 20-32px;
  --element-gap: 15px;

  /* Border Radius */
  --radius-full: 100px;

  /* Named Radii */
  --radius-tags: 100px;
  --radius-cards: 0px;
  --radius-inputs: 0px;
  --radius-buttons: 100px;

  /* Surfaces */
  --surface-void-black: #000000;
  --surface-midnight-ink: #121318;
  --surface-deep-space: #191c26;
  --surface-slate-edge: #212529;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-hot-magenta: #ed1672;
  --color-midnight-ink: #121318;
  --color-deep-space: #191c26;
  --color-slate-edge: #212529;
  --color-pure-white: #ffffff;
  --color-void-black: #000000;

  /* Typography */
  --font-poppins: 'Poppins', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-muli: 'Muli', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.2;
  --text-body-sm: 16px;
  --leading-body-sm: 1.25;
  --text-subheading: 18px;
  --leading-subheading: 1;
  --text-body: 22px;
  --leading-body: 1.5;
  --text-display: 110px;
  --leading-display: 1;

  /* Spacing */
  --spacing-10: 10px;
  --spacing-15: 15px;
  --spacing-20: 20px;
  --spacing-32: 32px;
  --spacing-45: 45px;
  --spacing-50: 50px;
  --spacing-56: 56px;
  --spacing-60: 60px;
  --spacing-80: 80px;
  --spacing-113: 113px;
  --spacing-128: 128px;
  --spacing-210: 210px;

  /* Border Radius */
  --radius-full: 100px;
}
```
