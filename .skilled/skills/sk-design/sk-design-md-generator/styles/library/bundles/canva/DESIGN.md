# Canva — Style Reference
> playful artist's studio bathed in violet dawn — a clean white workspace where every accent, icon, and gradient wash arrives pre-tuned for creative work.

**Theme:** light

Canva speaks in a friendly, creative-atelier language: a near-white canvas where every surface is generous and every accent is vivid. The brand color is a saturated violet (#8b3dff) that recurs across navigation, tags, icons, and gradient washes, anchored by a near-black ink (#0f1015) for all primary type. The visual personality is gradient-loving and slightly playful — backgrounds dissolve from teal into violet, from magenta into coral — yet the UI chrome itself stays calm and monochrome so that user-generated creativity doesn't fight the frame. Type is set in the custom Canva Sans with tight tracking and optical alternates (ss02, ss03) for a warm, humanist feel; headlines run large (56–84px) at ultra-tight leading, giving the page a poster-like gravity. Surfaces are soft, 8px corners, with the brand's most distinctive move being a single floating prompt card that dominates the hero — a calm, rounded white panel set against a full-bleed gradient field.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Canva Violet | `#8b3dff` | `--color-canva-violet` | Primary brand color — filled buttons, active navigation, link text, gradient anchors, brand icons, tag fills |
| Deep Violet | `#9729ff` | `--color-deep-violet` | Secondary violet for decorative elements, secondary icon accents, gradient stop |
| Lavender Mist | `#a370fc` | `--color-lavender-mist` | Tertiary violet tint — outlined/ghost action borders, muted brand accents, image overlays |
| Coral Ember | `#ff6105` | `--color-coral-ember` | Vivid orange — decorative icon accent, category tag, gradient co-stop alongside violet |
| Magenta Pop | `#ff3d4d` | `--color-magenta-pop` | Vivid red-pink — decorative icon accent, category tag, energetic gradient endpoint |
| Fuchsia Bloom | `#e950f7` | `--color-fuchsia-bloom` | Vivid magenta — decorative icon accent, category tag, playful gradient endpoint |
| Midnight Ink | `#0f1015` | `--color-midnight-ink` | Primary text, heading, navigation, button labels, card surface dark mode accent |
| Pure White | `#ffffff` | `--color-pure-white` | Page background, card surface, inverse text on dark/violet fills |
| Slate Gray | `#575a5f` | `--color-slate-gray` | Secondary text, muted helper copy, nav dividers, disabled chrome |
| Pale Mist | `#d7d9de` | `--color-pale-mist` | Subtle button shadow tint, very light dividers, off-white surface |
| Ink Black | `#000000` | `--color-ink-black` | Pure black for maximum-contrast text, sharp icons, decorative dots |
| Teal Aurora | `linear-gradient(135deg, rgb(0, 196, 204), rgb(125, 42, 232))` | `--color-teal-aurora` | Signature gradient starting point — teal-to-violet hero washes |

## Tokens — Typography

### Times — Times — detected in extracted data but not described by AI · `--font-times`
- **Weights:** 400
- **Sizes:** 10px
- **Line height:** 1.2
- **Role:** Times — detected in extracted data but not described by AI

### Canva Sans — Primary brand typeface. Weight 400 for body and UI labels, 500 for emphasized subheadings and button text, 600 for section headings. Headlines 56–84px use weight 600 with tight tracking for poster-like presence. Font features "ss02" and "ss03" enable brand-specific alternates (likely single-story g/a, geometric g/cuts) that give the type its warm, custom-cut character — never substitute these off in body text. · `--font-canva-sans`
- **Substitute:** Inter, DM Sans, or General Sans
- **Weights:** 400, 500, 600
- **Sizes:** 14, 16, 18, 21, 24, 28, 32, 36, 56, 64, 84
- **Line height:** 1.06–1.57
- **Letter spacing:** -0.018em at large display sizes, -0.01em at body sizes, 0 at small UI text
- **OpenType features:** `"ss02" on, "ss03" on`
- **Role:** Primary brand typeface. Weight 400 for body and UI labels, 500 for emphasized subheadings and button text, 600 for section headings. Headlines 56–84px use weight 600 with tight tracking for poster-like presence. Font features "ss02" and "ss03" enable brand-specific alternates (likely single-story g/a, geometric g/cuts) that give the type its warm, custom-cut character — never substitute these off in body text.

### Arial — Arial — detected in extracted data but not described by AI · `--font-arial`
- **Weights:** 400
- **Sizes:** 13px
- **Line height:** 1.2
- **Role:** Arial — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| body-sm | 14px | 1.4 | — | `--text-body-sm` |
| body | 16px | 1.5 | -0.01px | `--text-body` |
| subheading | 18px | 1.4 | — | `--text-subheading` |
| heading-sm | 24px | 1.33 | — | `--text-heading-sm` |
| heading | 36px | 1.25 | -0.018px | `--text-heading` |
| heading-lg | 56px | 1.1 | -0.018px | `--text-heading-lg` |
| display | 84px | 1.06 | -0.018px | `--text-display` |

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
| 48 | 48px | `--spacing-48` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 8px |
| pills | 9999px |
| buttons | 8px |
| largeButtons | 16px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| subtle | `rgba(64, 79, 109, 0.06) 0px 0px 0px 0.5px, rgba(24, 44, 8...` | `--shadow-subtle` |
| subtle-2 | `rgba(53, 65, 90, 0.2) 0px 0px 0px 1px inset` | `--shadow-subtle-2` |
| subtle-3 | `rgba(255, 255, 255, 0.2) 0px 0px 0px 1px inset` | `--shadow-subtle-3` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 24px
- **Element gap:** 12px

## Components

### Hero Headline
**Role:** Primary hero text

Centered Canva Sans weight 600, 56–84px, line-height ~1.06, letter-spacing -0.018em, color #0f1015 on white or #ffffff on gradient. Sits over a teal-to-violet full-bleed gradient with generous vertical padding (80–120px above and below).

### Hero Subtitle
**Role:** Supporting hero copy

Canva Sans weight 400, 18–21px, line-height 1.4, color #0f1015 (or #ffffff on dark gradient), centered, max-width ~640px.

### White Pill CTA
**Role:** Primary action button on gradient hero

White background (#ffffff), #0f1015 text, Canva Sans weight 500, 16px, 16px horizontal / 12px vertical padding, 8px radius, subtle 1px inset shadow rgba(53,65,90,0.2) for definition. Used as the singular hero CTA like 'Start designing'.

### Violet Filled Button
**Role:** Primary action button on light surfaces

#8b3dff background, #ffffff text, Canva Sans weight 500, 16px, 12px 20px padding, 8px radius, no shadow. Used for 'Sign up', submit actions, and prompt-card send buttons.

### Ghost Text Button
**Role:** Secondary action in header

Transparent background, #0f1015 text, Canva Sans weight 500, 16px, used for 'Log in' alongside filled 'Sign up'. No border.

### Top Navigation Bar
**Role:** Site-wide navigation

White background, Canva Sans weight 500 at 16px for nav links in #0f1015. Logo (wordmark) sits left, links centered, actions right. 12px horizontal padding on link items, 4–8px gaps between links.

### Category Pill Tabs
**Role:** Tab/pill filter row

Pill-shaped, 9999px radius, each tab has a distinct vivid background — one violet (#8b3dff), one orange (#ff6105), one red (#ff3d4d), one pink (#e950f7), one purple (#a370fc). White text, 16px Canva Sans weight 500, 12px 16px padding. The selected tab gets a subtle shadow; inactive tabs have no shadow.

### AI Prompt Card
**Role:** Hero feature: prompt input panel

White rounded panel, 8px radius, generous internal padding (24–32px), 1px hairline border, sits over a light gradient. Contains a large input field, a violet circular submit button (48px, #8b3dff fill, white arrow icon), and a row of small action chips below (Design, Image, Doc, Code, Video clip) with 8px radius and 1px border. This card is the visual signature of the page.

### Gradient Feature Card
**Role:** Large feature card in content grid

Rounded card, 8–16px radius, 24px internal padding, filled with a full-bleed gradient (violet-to-coral, teal-to-violet, etc.). White Canva Sans 600 headline (24–28px) and 500 CTA pill on top. Dimensions roughly 2:1 or 3:2 aspect ratio, no shadow — the gradient IS the elevation.

### Category Tag / Action Chip
**Role:** Small interactive label

8px radius, small 1px border or filled with category color, 12px padding, Canva Sans weight 500 at 13–14px. Often carries a tiny icon prefix. Used inside the AI prompt card and elsewhere.

### Section Heading
**Role:** Mid-page section title

Canva Sans weight 600, 36–56px, line-height 1.1, #0f1015, centered above content. Always preceded by generous vertical spacing (80px sectionGap) and followed by a tab row or card grid.

### Card Grid (2-column)
**Role:** Feature content arrangement

Two large cards per row, equal width within a 1200px container, 16–24px gap. Top row uses vivid gradients; bottom row uses a solid color card (green) and a gradient card. Each card contains a headline, a white pill CTA, and a content preview area.

## Do's and Don'ts

### Do
- Set body type in Canva Sans 400, 16px, line-height 1.4–1.5, color #0f1015
- Apply letter-spacing -0.018em to all display text 36px and above; use 0 or -0.01em for body
- Use 8px corner radius for cards and standard buttons, 9999px for pills and category chips
- Default to a white page background and reserve color/gradient for hero bands, feature cards, and decorative tags
- Pair every violet-filled action with white text and no drop shadow — the color does the work
- Activate font features "ss02" and "ss03" globally on Canva Sans to preserve the custom letterforms
- Use 12px element gaps inside cards, 80px between major sections, and a 1200px max content width

### Don't
- Don't substitute Canva Sans with Times, Arial, or any serif — the geometric humanist voice is core to the brand
- Don't apply drop shadows to violet or gradient feature cards — they read as flat color fields by design
- Don't use the accent oranges, pinks, and reds for buttons or interactive CTAs — reserve them for tags, icons, and gradient co-stops
- Don't reduce display headline tracking to normal or positive — the negative letter-spacing is what makes 56–84px type feel poster-like
- Don't add heavy borders or 2px+ strokes to cards; the system relies on the gradient fill plus 8px radius for definition
- Don't use #000000 as the primary text color — #0f1015 is the brand's chosen near-black for a slightly softer read
- Don't mix more than three accent colors in a single section; pick one violet, one warm accent, and let the gradient do the rest

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Canvas | `#ffffff` | Page background, default working surface |
| 2 | Card Surface | `#ffffff` | Floating panels, prompt card, feature cards on light backgrounds |
| 3 | Gradient Hero Field | `#7d2ae8` | Full-bleed hero background — teal-to-violet gradient, behind headline |
| 4 | Dark Surface | `#0f1015` | Rarely used dark surface for inverse sections or dark-mode cards |

## Elevation

- **Floating Panel (prompt card, modal):** `rgba(64, 79, 109, 0.06) 0px 0px 0px 0.5px, rgba(24, 44, 89, 0.137) 0px 2px 4px 0px, rgba(24, 44, 89, 0.07) 0px 6px 12px 0px`
- **White Pill CTA:** `rgba(53, 65, 90, 0.2) 0px 0px 0px 1px inset`
- **Selected Category Pill:** `rgba(255, 255, 255, 0.2) 0px 0px 0px 1px inset`

## Imagery

Imagery is dominated by full-bleed gradient washes (teal-to-violet, purple-to-coral) used as both hero backgrounds and feature card fills — there is little traditional photography. The visual content is mostly product mockups: screenshot-style previews of design templates, AI-generated imagery, and template thumbnails arranged in a horizontal scroll or grid. Icons are flat, geometric, and carry their own vivid color (orange, pink, magenta, violet) — no outlined monochrome iconography. The design system uses color-coded category icons embedded in pill tabs to communicate tool types (AI, Presentations, Social, Video, Print Shop). Image treatment: bright, saturated, gradient-heavy, no duotone or desaturation. The visual density is moderate — the page is text-driven for headlines and CTAs, but the hero card and feature cards carry enough visual mass to feel rich.

## Layout

Full-width gradient hero band, then max-width 1200px centered content for the rest of the page. Hero: centered headline + subtitle + single white pill CTA over a teal-to-violet gradient, with a large floating white prompt card below the fold. Section rhythm: each major section is separated by ~80px of whitespace on a white canvas. Content arrangement: section headings are centered, followed by either a 2-column or 3-column card grid, with cards equal width and 16–24px gaps. The 'Unlock Canva's creative ecosystem' section uses an asymmetric 2-up grid (one wide card, one narrow). Navigation: minimal top bar, white background, logo left, centered text links, right-aligned 'Sign up' (violet) + 'Log in' (ghost). No sidebar. The overall density is comfortable to spacious — the page breathes between sections and never stacks more than two visual elements vertically without a divider or whitespace break.

## Agent Prompt Guide

## Quick Color Reference
- text: #0f1015
- background: #ffffff
- border: #d7d9de
- accent: #8b3dff (Canva Violet)
- secondary accent: #a370fc (Lavender Mist)
- decorative accent: #ff6105 (Coral Ember), #ff3d4d (Magenta Pop), #e950f7 (Fuchsia Bloom)
- primary action: #8b3dff (filled action)

## Example Component Prompts
1. Create a Primary Action Button: #8b3dff background, #ffffff text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.

2. **AI Prompt Card**: White rounded panel, 8px radius, 32px internal padding, 1px solid #d7d9de border, subtle elevation shadow. Contains a large text input (16px Canva Sans 400, placeholder #575a5f), a circular 48px submit button in #8b3dff with a white right-arrow icon, and a row of five small category chips below the input (8px radius, 12px 16px padding, 1px solid #d7d9de border, 14px Canva Sans 500 text in #0f1015, each with a tiny colored icon prefix).

3. **Category Pill Tabs**: Horizontal row of 5 pill-shaped tabs, 9999px radius, 12px 20px padding, each filled with a different brand color: #8b3dff, #ff6105, #ff3d4d, #e950f7, #a370fc. All text in white at 16px Canva Sans 500, with a small white icon to the left of each label. The active tab gets a subtle inset white shadow; inactive tabs are flat.


5. **Section Heading + Tab Row**: Centered section title in Canva Sans 600, 36px, #0f1015, letter-spacing -0.018em. Below it, the category pill tab row centered horizontally with 8px gap between pills. 80px vertical spacing above the heading from the previous section.

## Gradient System

Gradients are a first-class design token, not decoration. The signature gradient is `linear-gradient(135deg, #00c4cc, #7d2ae8)` — teal dissolving into deep violet — used for the hero band. Secondary gradients pair violet with warm accents (`#ff3d4d → #ff6105 → #ffb7b1`) or violet with cool blues (`#7301dd → #2a4de1 → #7cb3f5 → #b5e4f6`). Always apply gradients to full-bleed surfaces (hero bands, feature card fills) rather than to text or small UI elements. Gradients should not have flat endings — dissolve to white at 60–100% for content cards, or go full saturation for the hero. Never use gradients on standard buttons or form inputs.

## Similar Brands

- **Figma** — Same white-canvas-plus-vivid-accent approach, similar custom humanist sans-serif, generous card grids with soft 8px corners
- **Notion** — Same monochrome ink-black-and-white UI chrome with sparing color, tight letter-spacing on display headings, pill-shaped tab navigation
- **Stripe** — Same gradient-loving hero treatment and confident tight-tracked display typography, though Canva leans more playful with its accent palette
- **Linear** — Same restraint in chrome (white surfaces, subtle shadows, 8px radii) contrasting with bold headline type and purple brand accent
- **Pitch** — Same creative-tool aesthetic with vivid gradient hero bands, colorful category icons, and humanist sans-serif type

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-canva-violet: #8b3dff;
  --color-deep-violet: #9729ff;
  --color-lavender-mist: #a370fc;
  --color-coral-ember: #ff6105;
  --color-magenta-pop: #ff3d4d;
  --color-fuchsia-bloom: #e950f7;
  --color-midnight-ink: #0f1015;
  --color-pure-white: #ffffff;
  --color-slate-gray: #575a5f;
  --color-pale-mist: #d7d9de;
  --color-ink-black: #000000;
  --color-teal-aurora: #00c4cc;
  --gradient-teal-aurora: linear-gradient(135deg, rgb(0, 196, 204), rgb(125, 42, 232));

  /* Typography — Font Families */
  --font-times: 'Times', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-canva-sans: 'Canva Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-arial: 'Arial', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-body-sm: 14px;
  --leading-body-sm: 1.4;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.01px;
  --text-subheading: 18px;
  --leading-subheading: 1.4;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.33;
  --text-heading: 36px;
  --leading-heading: 1.25;
  --tracking-heading: -0.018px;
  --text-heading-lg: 56px;
  --leading-heading-lg: 1.1;
  --tracking-heading-lg: -0.018px;
  --text-display: 84px;
  --leading-display: 1.06;
  --tracking-display: -0.018px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-48: 48px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 24px;
  --element-gap: 12px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-2xl: 16px;
  --radius-full: 48px;
  --radius-full-2: 9999px;

  /* Named Radii */
  --radius-cards: 8px;
  --radius-pills: 9999px;
  --radius-buttons: 8px;
  --radius-largebuttons: 16px;

  /* Shadows */
  --shadow-subtle: rgba(64, 79, 109, 0.06) 0px 0px 0px 0.5px, rgba(24, 44, 89, 0.137) 0px 2px 4px 0px, rgba(24, 44, 89, 0.07) 0px 6px 12px 0px;
  --shadow-subtle-2: rgba(53, 65, 90, 0.2) 0px 0px 0px 1px inset;
  --shadow-subtle-3: rgba(255, 255, 255, 0.2) 0px 0px 0px 1px inset;

  /* Surfaces */
  --surface-canvas: #ffffff;
  --surface-card-surface: #ffffff;
  --surface-gradient-hero-field: #7d2ae8;
  --surface-dark-surface: #0f1015;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-canva-violet: #8b3dff;
  --color-deep-violet: #9729ff;
  --color-lavender-mist: #a370fc;
  --color-coral-ember: #ff6105;
  --color-magenta-pop: #ff3d4d;
  --color-fuchsia-bloom: #e950f7;
  --color-midnight-ink: #0f1015;
  --color-pure-white: #ffffff;
  --color-slate-gray: #575a5f;
  --color-pale-mist: #d7d9de;
  --color-ink-black: #000000;
  --color-teal-aurora: #00c4cc;

  /* Typography */
  --font-times: 'Times', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-canva-sans: 'Canva Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-arial: 'Arial', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-body-sm: 14px;
  --leading-body-sm: 1.4;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.01px;
  --text-subheading: 18px;
  --leading-subheading: 1.4;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.33;
  --text-heading: 36px;
  --leading-heading: 1.25;
  --tracking-heading: -0.018px;
  --text-heading-lg: 56px;
  --leading-heading-lg: 1.1;
  --tracking-heading-lg: -0.018px;
  --text-display: 84px;
  --leading-display: 1.06;
  --tracking-display: -0.018px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-48: 48px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-2xl: 16px;
  --radius-full: 48px;
  --radius-full-2: 9999px;

  /* Shadows */
  --shadow-subtle: rgba(64, 79, 109, 0.06) 0px 0px 0px 0.5px, rgba(24, 44, 89, 0.137) 0px 2px 4px 0px, rgba(24, 44, 89, 0.07) 0px 6px 12px 0px;
  --shadow-subtle-2: rgba(53, 65, 90, 0.2) 0px 0px 0px 1px inset;
  --shadow-subtle-3: rgba(255, 255, 255, 0.2) 0px 0px 0px 1px inset;
}
```
