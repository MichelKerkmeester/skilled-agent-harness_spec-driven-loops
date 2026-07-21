# HubSpot — Style Reference
> Warm cream paper with a single orange spark. HubSpot feels like a design magazine printed on heavy stock — editorial serif headlines, warm off-white pages, and one flame-orange accent that lights up only the moments that matter.

**Theme:** light

HubSpot's design system is a warm, editorial enterprise aesthetic built on cream-paper canvases rather than stark white. A single vivid orange (#ff4800) serves as the sole chromatic accent — appearing in CTAs, icons, the logo sprocket, and even the period punctuation on the hero headline — while everything else stays in a carefully graded neutral scale from off-white to near-black. Typography pairs a custom sans (HubSpot Sans) for UI and body with a custom serif (HubSpot Serif) for headlines, a deliberate choice that signals editorial confidence over typical SaaS utility. Cards float on warm parchment with soft 16px corners and hairline borders rather than heavy shadows, and generous vertical breathing room between sections gives the whole site a calm, unhurried rhythm. The 2% colorfulness score is structural: orange is never decorative chrome, it's functional punctuation that always means "act here" or "this is HubSpot."

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Sprout Orange | `#ff4800` | `--color-sprout-orange` | Primary CTAs, logo sprocket, active nav states, functional icons, and the period punctuation on hero headlines — the sole chromatic accent in the entire system |
| Canvas Cream | `#fcfcfa` | `--color-canvas-cream` | Page background, card surfaces, button text, light dividers |
| Warm Parchment | `#f8f5ee` | `--color-warm-parchment` | Alternating section backgrounds, navigation surface, soft-band separators that give the page a paper-stock warmth |
| Ink | `#1f1f1f` | `--color-ink` | Primary body text, headings, card borders, hairline dividers — the structural near-black used everywhere a line or label needs weight |
| Pure Black | `#000000` | `--color-pure-black` | High-contrast text on light surfaces, maximum-emphasis borders and icon fills |
| Graphite | `#60605f` | `--color-graphite` | Muted secondary text inside buttons and controls where full Ink weight would feel heavy |
| Mist | `#cacac8` | `--color-mist` | Disabled-state borders, inactive list markers, low-emphasis icon fills |
| Peach Wash | `#fcded2` | `--color-peach-wash` | Soft accent surface behind orange elements, badge backgrounds, gentle warm highlight zones that echo the brand orange at low intensity |
| Deep Teal | `#042729` | `--color-deep-teal` | Dark featured sections, inverted text on cream, occasional deep-surface moments that break the warm palette with cool contrast |
| Sprocket Gradient | `linear-gradient(257deg, rgba(251, 221, 208, 0.3) -32.4%, rgba(255, 165, 129, 0.3) -3.42%, rgba(255, 73, 0, 0.3) 23.87%, rgba(251, 223, 233, 0.3) 50.46%, rgba(253, 191, 219, 0.3) 79.15%, rgba(249, 57, 166, 0.3) 103.64%)` | `--color-sprocket-gradient` | Decorative brand gradient spanning warm peach through orange into magenta — used sparingly on featured artwork and highlight washes |

## Tokens — Typography

### HubSpot Sans — Primary UI and body typeface — nav, buttons, badges, body copy, links, card metadata. Weight 300 for light labels, 400 for body, 500 for emphasis. The narrow, geometric proportions keep dense interface rows feeling calm. Free substitute: Inter or General Sans. · `--font-hubspot-sans`
- **Substitute:** Inter
- **Weights:** 300, 400, 500
- **Sizes:** 12, 14, 16, 18, 22, 24, 40
- **Line height:** 1.42, 1.45, 1.56, 1.57, 1.60, 1.67, 1.75
- **Letter spacing:** normal
- **Role:** Primary UI and body typeface — nav, buttons, badges, body copy, links, card metadata. Weight 300 for light labels, 400 for body, 500 for emphasis. The narrow, geometric proportions keep dense interface rows feeling calm. Free substitute: Inter or General Sans.

### HubSpot Serif — Section headings and subheadlines — a humanist serif with generous curves that reads editorial rather than corporate. Its single weight (500) forces hierarchy through size, not weight, which keeps the type system restrained. Free substitute: Source Serif 4 or PT Serif. · `--font-hubspot-serif`
- **Substitute:** Source Serif 4
- **Weights:** 500
- **Sizes:** 40, 48
- **Line height:** 1.10, 1.15
- **Role:** Section headings and subheadlines — a humanist serif with generous curves that reads editorial rather than corporate. Its single weight (500) forces hierarchy through size, not weight, which keeps the type system restrained. Free substitute: Source Serif 4 or PT Serif.

### HubSpot Serif Page Header Human — Display-level hero headlines at 80px — the largest voice on the page, reserved for above-the-fold page headers. The humanist cut gives it warmth that a geometric display sans would lose. Free substitute: Source Serif 4 at 500 weight, scaled up. · `--font-hubspot-serif-page-header-human`
- **Substitute:** Source Serif 4
- **Weights:** 500
- **Sizes:** 80
- **Line height:** 1.19
- **Role:** Display-level hero headlines at 80px — the largest voice on the page, reserved for above-the-fold page headers. The humanist cut gives it warmth that a geometric display sans would lose. Free substitute: Source Serif 4 at 500 weight, scaled up.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.6 | — | `--text-caption` |
| body-sm | 14px | 1.57 | — | `--text-body-sm` |
| body | 16px | 1.56 | — | `--text-body` |
| subheading | 18px | 1.67 | — | `--text-subheading` |
| heading-sm | 22px | 1.45 | — | `--text-heading-sm` |
| heading | 24px | 1.42 | — | `--text-heading` |
| heading-lg | 40px | 1.15 | — | `--text-heading-lg` |
| heading-xl | 48px | 1.1 | — | `--text-heading-xl` |
| display | 80px | 1.19 | — | `--text-display` |

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
| 24 | 24px | `--spacing-24` |
| 28 | 28px | `--spacing-28` |
| 32 | 32px | `--spacing-32` |
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |
| 56 | 56px | `--spacing-56` |
| 64 | 64px | `--spacing-64` |
| 80 | 80px | `--spacing-80` |

### Border Radius

| Element | Value |
|---------|-------|
| nav | 8px |
| cards | 16px |
| badges | 4px |
| images | 16px |
| buttons | 8px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 64-80px
- **Card padding:** 24-32px
- **Element gap:** 16-24px

## Components

### Primary CTA Button
**Role:** High-emphasis action button for demos and signups

Filled Sprout Orange (#ff4800) background, white text in HubSpot Sans 16px weight 500, 8px border-radius, 16px horizontal × 8-12px vertical padding, no shadow. The orange fill is the system — no border needed. Hover deepens slightly; the button is always the loudest element on the screen.

### Ghost CTA Button
**Role:** Secondary action that pairs alongside a primary CTA without competing

Transparent background, 1.5-2px Sprout Orange (#ff4800) border, Sprout Orange text in HubSpot Sans 16px weight 500, 8px border-radius, 16px × 8-12px padding. The outlined treatment creates a clear visual hierarchy: filled = primary, outlined = secondary, both share the brand color.

### Utility Navigation Bar
**Role:** Thin top bar for site-wide utilities above the main nav

Warm Parchment (#f8f5ee) background, small HubSpot Sans 12-14px text in Ink, items separated by hairline borders, 2-4px vertical padding. Contains language selector, accessibility toggle, support, and contact links. Sits flush above the main navigation.

### Main Navigation Header
**Role:** Primary site navigation with logo, links, and CTAs

Canvas Cream (#fcfcfa) or Warm Parchment (#f8f5ee) background, HubSpot sprocket logo on the left, centered nav links in HubSpot Sans 16px weight 400 Ink text, Primary and Ghost CTA buttons on the right. Generous height ~64-72px, no bottom border — the nav floats on the warm canvas.

### Hero Section
**Role:** Above-the-fold brand statement with lifestyle imagery

Full-width photographic background (warm-toned team imagery), centered text stack overlaid. Eyebrow label in HubSpot Sans 14px weight 500 uppercase tracking, display headline in HubSpot Serif Page Header Human 80px weight 500, body subtext in HubSpot Sans 18px weight 400, and Primary + Ghost CTA pair. The headline ends with a Sprout Orange period for brand punctuation.

### Partner Logo Strip
**Role:** Social proof band showing customer logos

Single horizontal row of 5-7 brand logos (eBay, DoorDash, Reddit, Tripadvisor, Eventbrite) centered on Canvas Cream or Warm Parchment background. Logos rendered in their native brand colors at uniform height (~24-32px) with consistent horizontal spacing.

### Product Hub Card
**Role:** Bordered card describing a HubSpot product suite (Marketing Hub, Sales Hub, etc.)

Canvas Cream (#fcfcfa) surface on Warm Parchment background, 1px Ink border at low opacity, 16px border-radius, 24-32px padding. Top section: product icon (Sprout Orange) + HubSpot Sans 22px weight 500 title with registered/trademark superscript. Middle: 2-3 checkmark items in HubSpot Sans 16px with Sprout Orange check icons. Bottom: 'Learn more' link with arrow in Sprout Orange.

### Feature Split Section
**Role:** Two-column layout pairing descriptive text with product visual

Left column: HubSpot Serif 40-48px weight 500 headline + HubSpot Sans 16-18px body text in Ink, max-width ~480px. Right column: product illustration or card-stack visual (pastel-colored product cards with orange icons, slight 3D perspective). Generous 80-120px section gap above and below.

### Powered by AI Badge
**Role:** Small pill label indicating AI-powered features

White or Canvas Cream background, 1px hairline border, 4px border-radius, small sparkle/asterisk icon in Sprout Orange, HubSpot Sans 12-14px weight 500 text. Rounded enough to read as a tag, compact enough to sit inline above a headline.

### Checkmark List Item
**Role:** Feature bullet inside Product Hub Cards

Sprout Orange (#ff4800) checkmark icon, followed by HubSpot Sans 16px weight 400 Ink text, 8px gap between icon and text, 12-16px vertical spacing between items.

### Section Heading Block
**Role:** Centered heading group introducing a content section

HubSpot Serif 40-48px weight 500 headline centered, HubSpot Sans 16-18px weight 400 subtext directly below, both in Ink, max-width ~700px. No background — sits on the section's natural surface with 24-32px vertical gap between headline and subtext.

### Image Card
**Role:** Rounded photographic or illustrative surface

16px border-radius on all images that aren't full-bleed hero photography. No border, no shadow — the radius and warm canvas behind do the work. Applies to product screenshots, illustrations, and thumbnail imagery.

## Do's and Don'ts

### Do
- Use Sprout Orange (#ff4800) exclusively for CTAs, active states, brand icons, and functional accents — never for decorative backgrounds or large fills
- Maintain the 8px radius on all buttons and the 16px radius on all cards and images — this two-radius system is the structural shorthand for the entire UI
- Pair every Primary filled CTA with a Ghost outlined CTA in the same orange — they always travel together on hero and section-level calls to action
- Set body text in HubSpot Sans 16px weight 400 at 1.56 line-height — the 16/25 rhythm is the page's default reading measure
- Use HubSpot Serif (weight 500, single weight) for all headings 24px and above — the serif/sans split is the system's signature contrast
- Alternate between Canvas Cream (#fcfcfa) and Warm Parchment (#f8f5ee) section backgrounds to create the paper-stock rhythm — never use stark #ffffff
- Reserve HubSpot Serif Page Header Human at 80px for the hero headline only — it is the largest voice and loses impact if repeated

### Don't
- Don't introduce a second chromatic color — the system is built on 2% colorfulness and adding blue, green, or purple breaks the editorial signal
- Don't use shadows or heavy elevation on cards — the 1px hairline border on Warm Parchment is the entire depth system; adding box-shadow breaks the paper-stock feel
- Don't use HubSpot Serif below 24px — the serif's curves need size to read; at body size it competes with HubSpot Sans and creates noise
- Don't use stark white (#ffffff) as a page background — Canvas Cream and Warm Parchment are warmer and more distinctive; pure white makes the UI feel clinical
- Don't use multiple font weights of the serif — HubSpot Serif exists only at 500; hierarchy comes from size, not weight
- Don't apply Sprout Orange to large decorative backgrounds, illustrations, or hero washes — the gradient system is the only exception and even then it appears at 0.3 opacity
- Don't use the 16px card radius on buttons or inputs — the 8px/16px split between buttons and cards is load-bearing for the visual hierarchy

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Page Canvas | `#fcfcfa` | Base page background — the warm off-white default |
| 1 | Parchment Band | `#f8f5ee` | Alternating section background that creates the paper-stock rhythm between content blocks |
| 2 | Peach Wash | `#fcded2` | Soft accent surface for highlight zones, badge backgrounds, and gentle warm emphasis |
| 3 | Card Surface | `#fcfcfa` | White-ish card surface sitting on Parchment or Peach Wash — 16px radius, 1px hairline border, no shadow |

## Elevation

HubSpot's elevation system is border-based, not shadow-based. Cards and content surfaces sit on Warm Parchment or Peach Wash backgrounds, defined by 1px hairline borders in Ink (#1f1f1f) at low opacity, with 16px corner radii. There are no drop shadows, no blur effects, no floating panels — the depth is created entirely by the warm-on-warm surface stack and the generous 64-80px section gaps. This border-only approach keeps the UI feeling like printed editorial pages rather than glass-and-shadow software.

## Imagery

Photography is warm-toned lifestyle imagery: diverse teams collaborating in bright, naturally lit office and workshop settings. Shots are candid and human, never staged-corporate, with a warm color grade that harmonizes with the cream canvas. The hero uses a full-bleed photograph with a subtle dark scrim to support white headline text. Product illustrations appear as flat, slightly-perspective card stacks in soft pastels (peach, sage, lavender) with Sprout Orange icons — they feel like printed brochures, not glossy 3D renders. Icon style is monoline outlined in Sprout Orange, sitting at small functional sizes inside cards and lists. A partner logo strip (eBay, DoorDash, Reddit, Tripadvisor, Eventbrite) provides social proof at the page's midpoint. The overall visual density is moderate — photography anchors the hero, illustrations support the mid-page product sections, and the rest is text and cards.

## Layout

HubSpot uses a max-width 1200px centered content model with full-bleed photographic sections at the hero. The page rhythm is: thin utility bar (language, accessibility, support) → main nav with logo left, links center, CTA pair right → full-bleed hero image with centered editorial text overlay → partner logo strip on warm background → centered section heading → two-column feature splits (text left, visual right) → 2-column grid of bordered Product Hub cards → repeated sections. Vertical spacing between sections is generous (64-80px), and the surface alternates between Canvas Cream and Warm Parchment to create visual separation without dividers. The 2-column card grid is the dominant content pattern in the mid-page, holding the Hub product suites. Navigation is a standard top bar — no sidebar, no mega-menu in the visible layout, no sticky behavior evident.

## Agent Prompt Guide

primary action: #ff4800 (filled action)
Create a Primary Action Button: #ff4800 background, #000000 text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.
## Quick Color Reference

- **Background**: #fcfcfa (Canvas Cream) or #f8f5ee (Warm Parchment) — never #ffffff
- **Surface (card)**: #fcfcfa with 1px border in #1f1f1f, 16px radius
- **Text (primary)**: #1f1f1f (Ink) for body and headings, HubSpot Sans 16px/40px
- **Text (serif heading)**: #1f1f1f in HubSpot Serif weight 500, sizes 24-80px
- **Border / hairline**: #1f1f1f at full or reduced opacity
- **Accent**: #ff4800 (Sprout Orange) for icons, checkmarks, brand marks, CTA borders, punctuation

## Example Component Prompts


2. **Product Hub Card**: 16px border-radius, 1px border in #1f1f1f, #fcfcfa background, 24px padding. Top: Sprout Orange sprocket icon + title in HubSpot Sans 22px weight 500 #1f1f1f with a small superscript mark. Middle: 2-3 checkmark list items — #ff4800 checkmark icon, HubSpot Sans 16px weight 400 #1f1f1f text, 12px vertical gap. Bottom: "Learn more →" link in #ff4800, HubSpot Sans 14px weight 500.

3. **Section Heading Block**: Centered on Warm Parchment (#f8f5ee) background. Headline in HubSpot Serif 48px weight 500 #1f1f1f, 1.10 line-height. Subtext directly below in HubSpot Sans 18px weight 400 #1f1f1f, 1.67 line-height, max-width 700px centered. 80px vertical padding above and below.

4. **Feature Split Section**: Two-column on Canvas Cream (#fcfcfa). Left column (max-width 480px): HubSpot Serif 40px weight 500 #1f1f1f headline, HubSpot Sans 16px weight 400 #1f1f1f body text, 16px gap between paragraphs. Right column: product illustration or card-stack visual, 16px border-radius, no border. 80-120px vertical section gap.

5. **Powered by AI Badge**: Inline pill above a headline. #fcfcfa background, 1px border in #cacac8, 4px border-radius, 6px×12px padding. Sprout Orange sparkle icon (12px) + HubSpot Sans 12px weight 500 #1f1f1f text reading "Powered by AI".


## Similar Brands

- **Mailchimp** — Same warm cream canvas with a single vivid brand color (Mailchimp yellow) used only for CTAs and icons, and a sans/serif type pairing that reads editorial rather than purely utility
- **Notion** — Minimal monochrome interface on warm off-white surfaces with one accent color reserved for interactive elements, and generous spacing between content sections
- **Shopify** — Clean light-mode SaaS with a single brand green for primary actions, bordered cards with soft radii, and a comfortable 16px-base spacing system
- **Substack** — Editorial serif headlines over a warm cream background with minimal chrome — same magazine-on-paper feel, though Substack is more text-pure and HubSpot is product-illustrated
- **Linear** — Distinctive custom typeface paired with a single accent color and hairline-border card system, though Linear goes dark-mode while HubSpot stays light and warm

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-sprout-orange: #ff4800;
  --color-canvas-cream: #fcfcfa;
  --color-warm-parchment: #f8f5ee;
  --color-ink: #1f1f1f;
  --color-pure-black: #000000;
  --color-graphite: #60605f;
  --color-mist: #cacac8;
  --color-peach-wash: #fcded2;
  --color-deep-teal: #042729;
  --color-sprocket-gradient: #ff4900;
  --gradient-sprocket-gradient: linear-gradient(257deg, rgba(251, 221, 208, 0.3) -32.4%, rgba(255, 165, 129, 0.3) -3.42%, rgba(255, 73, 0, 0.3) 23.87%, rgba(251, 223, 233, 0.3) 50.46%, rgba(253, 191, 219, 0.3) 79.15%, rgba(249, 57, 166, 0.3) 103.64%);

  /* Typography — Font Families */
  --font-hubspot-sans: 'HubSpot Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-hubspot-serif: 'HubSpot Serif', ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
  --font-hubspot-serif-page-header-human: 'HubSpot Serif Page Header Human', ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.6;
  --text-body-sm: 14px;
  --leading-body-sm: 1.57;
  --text-body: 16px;
  --leading-body: 1.56;
  --text-subheading: 18px;
  --leading-subheading: 1.67;
  --text-heading-sm: 22px;
  --leading-heading-sm: 1.45;
  --text-heading: 24px;
  --leading-heading: 1.42;
  --text-heading-lg: 40px;
  --leading-heading-lg: 1.15;
  --text-heading-xl: 48px;
  --leading-heading-xl: 1.1;
  --text-display: 80px;
  --leading-display: 1.19;

  /* Typography — Weights */
  --font-weight-light: 300;
  --font-weight-regular: 400;
  --font-weight-medium: 500;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-28: 28px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-56: 56px;
  --spacing-64: 64px;
  --spacing-80: 80px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 64-80px;
  --card-padding: 24-32px;
  --element-gap: 16-24px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-2xl: 16px;

  /* Named Radii */
  --radius-nav: 8px;
  --radius-cards: 16px;
  --radius-badges: 4px;
  --radius-images: 16px;
  --radius-buttons: 8px;

  /* Surfaces */
  --surface-page-canvas: #fcfcfa;
  --surface-parchment-band: #f8f5ee;
  --surface-peach-wash: #fcded2;
  --surface-card-surface: #fcfcfa;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-sprout-orange: #ff4800;
  --color-canvas-cream: #fcfcfa;
  --color-warm-parchment: #f8f5ee;
  --color-ink: #1f1f1f;
  --color-pure-black: #000000;
  --color-graphite: #60605f;
  --color-mist: #cacac8;
  --color-peach-wash: #fcded2;
  --color-deep-teal: #042729;
  --color-sprocket-gradient: #ff4900;

  /* Typography */
  --font-hubspot-sans: 'HubSpot Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-hubspot-serif: 'HubSpot Serif', ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
  --font-hubspot-serif-page-header-human: 'HubSpot Serif Page Header Human', ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.6;
  --text-body-sm: 14px;
  --leading-body-sm: 1.57;
  --text-body: 16px;
  --leading-body: 1.56;
  --text-subheading: 18px;
  --leading-subheading: 1.67;
  --text-heading-sm: 22px;
  --leading-heading-sm: 1.45;
  --text-heading: 24px;
  --leading-heading: 1.42;
  --text-heading-lg: 40px;
  --leading-heading-lg: 1.15;
  --text-heading-xl: 48px;
  --leading-heading-xl: 1.1;
  --text-display: 80px;
  --leading-display: 1.19;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-28: 28px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-56: 56px;
  --spacing-64: 64px;
  --spacing-80: 80px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-2xl: 16px;
}
```
