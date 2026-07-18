# Tomorro — Style Reference
> lush greenhouse at midnight — Electric Sprout neon pierces the deep forest canvas and bone-white beds below. The brand lives in that contrast: the dark is the soil, the light is the greenhouse bench, the green is the growth.

**Theme:** mixed

Tomorro is a contract-management platform that renders in a neo-botanical dark-and-light system: deep forest-canvas sections alternate with warm bone-white panels, both fed by the same Moss-Shadow text and punctuated by an Electric Sprout green. The visual language is quiet, mature, editorial — Ozik display type at ultra-tight 0.86 line-height anchors the hero, Aeonik carries every UI surface, and Instrument Serif drops in sparingly as accent italic-adjacent voice inside badges. Components are mostly pill-shaped (28-40px radius) rather than squared, the floating nav bar looks like a pressed seed, and the green CTA is treated as botanical accent paint, not a brand wallpaper. Pages should read as 70% typography on flat surfaces, 20% product mockups floating at slight angles, 10% abstract green orb atmosphere.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Forest Depths | `#122314` | `--color-forest-depths` | Dark elevated surface for cards, headers, and contained panels. Do not promote it to the primary CTA color |
| Moss Shadow | `#273f2b` | `--color-moss-shadow` | Gray action color for filled buttons, selected navigation states, and focused conversion moments. |
| Lichen Sage | `#7e8371` | `--color-lichen-sage` | Secondary muted text, link underline on dark, and badge border color — sits between Moss Shadow and Pure White as the off-tone voice |
| Pale Fern | `#b7bda5` | `--color-pale-fern` | Medium-contrast borders, control outlines, and structural separators. |
| Electric Sprout | `#68ef3f` | `--color-electric-sprout` | Green action color for filled buttons, selected navigation states, and focused conversion moments. |
| Deep Verdant | `#26a200` | `--color-deep-verdant` | Secondary accent for link borders, icon strokes, and hover-active states — a quieter green that supports Sprout without competing |
| Sprout Wash | `#e7f9dd` | `--color-sprout-wash` | Light green badge background and success-tint surface — the diluted form of Electric Sprout for soft status chips |
| Mist Green | `#d9deca` | `--color-mist-green` | Light sage link border and chip outline on bone surfaces — a low-contrast divider that reads as green without demanding attention |
| Onyx Olive | `#30322a` | `--color-onyx-olive` | Primary achromatic dark — body copy on white, borders on light cards, and the dominant hairline color across the whole system |
| Pure White | `#ffffff` | `--color-pure-white` | Light-section page background, text on dark surfaces, and inverted badge fills — the greenhouse bench |
| Bone White | `#f2f5eb` | `--color-bone-white` | Card surface on light sections — warm off-white that prevents the page from reading sterile, never pure #fff when elevated |
| Soft Mist | `#dcdfe3` | `--color-soft-mist` | Cool-tinted heading rule and quiet secondary border — the only neutral that isn't green-tinted |
| Cool Stone | `#d6d6d6` | `--color-cool-stone` | Muted UI surface for disabled controls, low-emphasis panels, and placeholder blocks. |
| Carbon | `#222222` | `--color-carbon` | Link text and border on light surfaces — darker than Onyx Olive, used only where the link must read as a typographic accent rather than a button |

## Tokens — Typography

### Ozik — Hero and section display only — used for two or three words maximum per line. The ultra-tight 0.86 line-height stacks letterforms like glasshouse beams; the heavy weight on a near-black canvas is the system's signature. · `--font-ozik`
- **Substitute:** Boldonse, Migra, or PP Editorial New at 700/800 with -0.01em tracking
- **Weights:** 700
- **Sizes:** 56px, 80px
- **Line height:** 0.86 (56px), 0.90 (80px)
- **Letter spacing:** -0.0140em, -0.0100em
- **Role:** Hero and section display only — used for two or three words maximum per line. The ultra-tight 0.86 line-height stacks letterforms like glasshouse beams; the heavy weight on a near-black canvas is the system's signature.

### Aeonik — Workhorse for every UI surface — nav, body, buttons, cards, inputs, headings up to 40px. 400 for body and labels, 500 for sub-labels, 600 for sub-headings, 700 for section titles and button labels. The negative letter-spacing tightens as size grows, giving headlines a compressed, technical feel without becoming a display face. · `--font-aeonik`
- **Substitute:** Inter, Söhne, or Geist at matched weights
- **Weights:** 400, 500, 600, 700
- **Sizes:** 12px, 13px, 14px, 16px, 18px, 20px, 24px, 32px, 40px
- **Line height:** 1.20 (32-40px), 1.33 (24px), 1.43-1.50 (body), 1.67-1.71 (small UI)
- **Letter spacing:** -0.0310em, -0.0210em, -0.0150em, -0.0120em, -0.0030em, -0.0010em, 0.0130em, 0.1430em
- **Role:** Workhorse for every UI surface — nav, body, buttons, cards, inputs, headings up to 40px. 400 for body and labels, 500 for sub-labels, 600 for sub-headings, 700 for section titles and button labels. The negative letter-spacing tightens as size grows, giving headlines a compressed, technical feel without becoming a display face.

### Instrument Serif — Editorial accent only — drops into badges, small pull quotes, and the occasional 32px sub-heading to break Aeonik's geometric monotony. The serif's organic stroke and slight +0.063em tracking at small sizes are the only warmth this system permits. · `--font-instrument-serif`
- **Substitute:** Source Serif 4, GT Sectra, or Newsreader at 400 italic-leaning
- **Weights:** 400
- **Sizes:** 16px, 18px, 32px
- **Line height:** 1.25-1.56
- **Letter spacing:** -0.0500em, 0.0280em, 0.0630em
- **Role:** Editorial accent only — drops into badges, small pull quotes, and the occasional 32px sub-heading to break Aeonik's geometric monotony. The serif's organic stroke and slight +0.063em tracking at small sizes are the only warmth this system permits.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.5 | -0.036px | `--text-caption` |
| body | 14px | 1.5 | -0.042px | `--text-body` |
| body-md | 16px | 1.5 | -0.496px | `--text-body-md` |
| subheading | 18px | 1.5 | -0.378px | `--text-subheading` |
| heading-sm | 20px | 1.43 | -0.3px | `--text-heading-sm` |
| heading | 24px | 1.33 | -0.36px | `--text-heading` |
| heading-lg | 32px | 1.2 | -0.672px | `--text-heading-lg` |
| display | 40px | 1.2 | -1.24px | `--text-display` |
| display-xl | 56px | 0.86 | -0.784px | `--text-display-xl` |
| display-2xl | 80px | 0.9 | -0.8px | `--text-display-2xl` |

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
| 56 | 56px | `--spacing-56` |
| 64 | 64px | `--spacing-64` |
| 80 | 80px | `--spacing-80` |
| 128 | 128px | `--spacing-128` |
| 168 | 168px | `--spacing-168` |
| 240 | 240px | `--spacing-240` |

### Border Radius

| Element | Value |
|---------|-------|
| nav | 28px |
| cards | 16-24px |
| badges | 20-40px |
| inputs | 24px |
| buttons | 8px (compact) or 28px (pill) |
| heroOrb | 9999px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80-120px
- **Card padding:** 24-40px
- **Element gap:** 8-16px

## Components

### Floating Pill Navigation
**Role:** Primary site navigation

Sits above the page content with 24-32px top margin, full-width up to 1200px container, Onyx Olive (#30322a) at ~90% opacity background, 28px border-radius. Contains the 'tomorro' wordmark left, a small 'Hiring' Electric Sprout (#68ef3f) tag, dropdown buttons with 8px radius in #273f2b, language switcher, and the right-side 'Sign in' outlined button plus Electric Sprout 'Schedule a demo' pill CTA.

### Hiring Tag Pill
**Role:** Status badge in nav

8px Aeonik 500, Electric Sprout (#68ef3f) fill, Onyx Olive (#30322a) text, 40px border-radius, 4px 12px padding. Sits inline with the wordmark as a permanent recruitment beacon.

### Nav Dropdown Trigger
**Role:** Top-level menu button

Aeonik 500 14px, Lichen Sage (#7e8371) text, 7px 12px padding, 8px border-radius, transparent background, 6px caret icon. Hovering shifts text to Pure White (#ffffff) over the Onyx Olive nav bar.

### Primary CTA — Filled Sprout
**Role:** Highest-emphasis button

Electric Sprout (#68ef3f) background, Onyx Olive (#30322a) text, Aeonik 500 14-16px, 8px 20px padding, 8px border-radius (compact) or 28px (pill). One per viewport on dark sections; never more than two adjacent.

### Secondary CTA — Ghost with Play Icon
**Role:** Lower-emphasis video/demo trigger

Transparent background, Pure White (#ffffff) 1px border, Pure White text, Aeonik 500 14-16px, 8px 20px padding, 8px or 28px border-radius. Triangular play icon precedes the label at 12px size.

### Sign In Outlined Button
**Role:** Authenticated-user entry

Pure White (#ffffff) 1px border, Pure White text, 6px 16px padding, 28px border-radius pill. Sits inside the nav bar to the left of the primary CTA.

### Event Announcement Pill
**Role:** Hero announcement chip

Lichen Sage (#7e8371) 1px border, 4px 16px padding, 9999px radius. Inner content is Aeonik 400 14px Pure White with 'brand-new event on June 4' highlighted in Electric Sprout. Small right-pointing chevron closes the pill.

### Display Headline with Accent Word
**Role:** Hero and section h1

Ozik 700 at 56-80px, line-height 0.86-0.90, Pure White on dark / Onyx Olive on light, letter-spacing -0.01em to -0.014em. One word (typically the brand promise's noun) switches to Electric Sprout for visual punctuation — the green word is never more than 3 characters in the hero.

### Body Paragraph with Green Inline Link
**Role:** Supporting hero and section copy

Aeonik 400 18px, Pale Fern (#b7bda5) or Pure White text on dark at 1.5 line-height, max-width 560-640px centered. Key noun phrases like 'Artificial Intelligence' switch to Electric Sprout without underline.

### Trust Logo Strip
**Role:** Social proof under hero

Single horizontal row of customer logos rendered in Pure White at ~50% opacity on the Forest Depths canvas. 48px logo height, even 32px gaps, centered. Aeonik 400 14px Pale Fern caption above ('They put their trust in us, as do more than 100,000 users').

### Floating Product Mockup Card
**Role:** Hero product showcase

White interface screenshot (contract analysis chat with risk indicators) inside a 16-24px radius card, 0 24px 60px rgba(0,0,0,0.35) shadow, tilted -8 to +8 degrees in a stack of 2-3. Each card is 600-800px wide with the front card sharpest and rear cards desaturated or scaled down.

### Decorative Sprout Orb
**Role:** Hero and section atmosphere

Large 400-600px circle, linear gradient from #000000 to #273f2b (or sage-toned variant) with a grainy/noise texture overlay, partially cropped by the viewport. Sits at 30-50% opacity behind the hero copy.

### Customer Logo Grid Card
**Role:** Light-section social proof

Onyx Olive (#30322a) or Lichen Sage (#7e8371) brand wordmarks at 40-60% opacity on Pure White, arranged in 4-6 columns with 32-48px row gap. No card chrome — the grid itself is the surface, sometimes a centered headline + green pill CTA break the grid in the middle row.

### Input Field
**Role:** Form input

Transparent or Forest Depths background on dark, 1px Moss Shadow or Electric Sprout border, 24px border-radius, 12px 16px padding, Aeonik 400 14-16px text. Focus state swaps border to Electric Sprout (#68ef3f).

### Status Badge (Sprout Wash)
**Role:** Inline success or category tag

Sprout Wash (#e7f9dd) background, Moss Shadow (#273f2b) text, Aeonik 500 12-13px, 4px 12px padding, 20-40px border-radius depending on width. Frequently appears on light cards and inside product UI.

## Do's and Don'ts

### Do
- Use #68ef3f Electric Sprout as the sole filled action color — every primary CTA, every 'AI' accent word, every active state, every focus ring runs through this one green.
- Set display headlines with Ozik 700 at line-height 0.86-0.90 and letter-spacing -0.01em to -0.014em — the compressed stacking is the signature, not the type size alone.
- Alternate page sections between #122314 Forest Depths and #ffffff Pure White — never blend them with a gradient; the contrast band is the rhythm.
- Use 28px border-radius for navigation, primary pills, and high-trust CTAs; reserve 8px for compact utility buttons and 16-24px for cards.
- Render all body copy in Aeonik 400, all button labels and tags in Aeonik 500-600 — never promote body weight to 700 for emphasis; instead switch one word to Electric Sprout.
- Apply the dark-canvas hairline border (#30322a) at 1px on every dark-section card, button, and input — the dark surface needs a visible frame to read as a component.
- Tilt floating product mockup cards 4-8 degrees and stack 2-3 deep with cascading shadows — flat product screenshots on a dark canvas disappear.

### Don't
- Don't introduce a second accent color — there is no secondary brand color. If Sprout is unavailable for an action, fall back to outlined buttons in Pure White or Onyx Olive, never a different hue.
- Don't use #273f2b Moss Shadow as a background — it is a text and border color. Surfaces are either Forest Depths (dark), Pure White (light), or Bone White (elevated card).
- Don't apply drop-shadows to flat cards, badges, or buttons — elevation is reserved for the floating nav and tilted product mockups.
- Don't set body text at weight 500 or higher; the system relies on Electric Sprout word-switching and size jumps, not bold weight, for hierarchy.
- Don't break the 8px spacing rhythm with 5px or 7px values — the only exceptions are 4px (badge vertical padding) and 3px (icon nudges), every other dimension is a multiple of 8.
- Don't use Instrument Serif for body copy or long headings — it appears at 16-32px only, typically inside badges, captions, or as a single accent heading line.
- Don't put gradient text on dark — gradient is reserved for the atmospheric orb; headlines and body copy are flat fills of Pure White, Onyx Olive, or Electric Sprout.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Forest Depths canvas | `#122314` | Dark hero and footer stage |
| 1 | Pure White page | `#ffffff` | Light content bands, logo grid sections |
| 2 | Bone White card | `#f2f5eb` | Elevated card on light bands |
| 3 | Sprout Wash chip | `#e7f9dd` | Soft green status surface |
| 4 | Electric Sprout accent | `#68ef3f` | Action button fill, active highlight |

## Elevation

- **Floating product mockup card:** `0 24px 60px rgba(0,0,0,0.35), 0 4px 12px rgba(0,0,0,0.2)`
- **Pill navigation bar:** `0 8px 32px rgba(0,0,0,0.25)`

## Imagery

Visuals lean on atmosphere, not photography. The hero features a large abstract green-to-black gradient orb with a grainy noise texture, partially cropped by the viewport — it reads as a blurred botanical mass rather than a defined object. Product showcases are floating UI mockup cards (chat interfaces, contract editors) tilted 4-8 degrees and stacked 2-3 deep, always with crisp white card surfaces against the dark canvas. Customer logos appear as desaturated wordmarks (40-60% opacity) in a wide grid, never as photographs. Iconography is minimal: thin line icons in Moss Shadow or Electric Sprout at 1.5-2px stroke, used sparingly for play buttons, dropdown carets, and decorative ticks. No lifestyle photography, no stock imagery, no portraits — the brand speaks through type and product UI alone.

## Layout

The page model is a centered max-width 1200px container with full-bleed background sections. The hero is full-viewport height with a Forest Depths canvas, centered headline + subhead + dual CTA, and the floating pill nav hovering above with 24-32px of top breathing room. Below the hero, content alternates between dark and light bands at 80-120px vertical gaps: dark feature bands showcase floating product mockup cards in the right two-thirds while copy sits left-aligned in the left third, light bands invert this with a centered headline, a single green CTA, and a 4-6 column logo grid filling the rest of the section. Section dividers are implicit (background color change) rather than explicit lines. The trust strip sits directly under the hero CTA as a single row of muted logos. Navigation is a single pill bar — no sidebar, no mega-menu. Density stays comfortable throughout, with card padding at 24-40px and consistent 8-16px element gaps.

## Display & Editorial Typography

The system's personality lives in its three-font cast. Ozik 700 owns the hero at 56-80px with line-height 0.86-0.90 — this near-1.0 line-height is non-negotiable; it stacks the heavy letterforms like greenhouse beams and makes the green accent word (usually 1-3 characters) pop. Aeonik 400-700 carries everything below 40px, with the negative letter-spacing growing as size grows (-0.003em at 12px, -0.031em at 16px, -0.021em at 32px, -0.031em at 40px) — this compression gives headlines a technical, almost data-display feel without invoking a separate display face. Instrument Serif 400 appears sparingly at 16-32px inside badges and as the occasional italic-leaning sub-heading, providing the only warm, organic stroke in an otherwise geometric system. Never use Ozik for UI chrome, never use Instrument Serif for body, and never promote Aeonik above 40px — each face has a strict domain.

## Agent Prompt Guide

QUICK COLOR REFERENCE
- Primary text on light: #30322a Onyx Olive
- Primary text on dark: #ffffff Pure White
- Page background (dark sections): #122314 Forest Depths
- Page background (light sections): #ffffff Pure White
- Card surface (light): #f2f5eb Bone White
- Accent / link highlight: #68ef3f Electric Sprout
- primary action: #68ef3f (filled action)

EXAMPLE COMPONENT PROMPTS
1. Create a Primary Action Button: #68ef3f background, #222222 text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.
2. Floating product mockup card — white 700x520px interface screenshot on a 16px border-radius card, tilted -6deg, with box-shadow 0 24px 60px rgba(0,0,0,0.35). Inside: 24px header, 8px Moss Shadow (#273f2b) 1px border for a chat bubble outline, status badges at 20px radius with #e7f9dd fill and #273f2b text. Place at 60% width on the right side of a #122314 section.
4. Event announcement pill — inline at the top of a hero. 1px #7e8371 border, 9999px radius, 4px 16px padding. Body text in Aeonik 400 14px #ffffff, with the phrase 'brand-new event on June 4' set in #68ef3f Electric Sprout, followed by a small right-pointing chevron in #7e8371.
5. Status badge inside a card — #e7f9dd Sprout Wash background, #273f2b Moss Shadow text, Aeonik 500 12px, 4px 12px padding, 20px border-radius. Sits at the top-right corner of a #f2f5eb Bone White card with 24px padding and a 1px #30322a hairline border.

## Similar Brands

- **Linear** — Same dark canvas + single neon green accent approach, same pill-shaped primary CTA, and the same restraint — typography does the work, color only punctuates action
- **Pitch** — Shares the editorial-meets-product sensibility: mixed dark and light bands, compressed display type, and a single vivid accent (Pitch uses purple, Tomorro uses green) with generous whitespace
- **Mercury** — Comparable trust-strip under hero with desaturated customer logos, max-width centered layout, and a 'one strong color, lots of quiet type' brand posture
- **Arc** — Same neo-botanical palette instinct (Arc leans deep green/charcoal, Tomorro commits fully to it) and the same floating pill nav anchored above a colored hero canvas
- **Notion** — Matches the 'flat surfaces, thin borders, no decorative shadows' philosophy and the same comfort with alternating between light content and dark hero blocks

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-forest-depths: #122314;
  --color-moss-shadow: #273f2b;
  --color-lichen-sage: #7e8371;
  --color-pale-fern: #b7bda5;
  --color-electric-sprout: #68ef3f;
  --color-deep-verdant: #26a200;
  --color-sprout-wash: #e7f9dd;
  --color-mist-green: #d9deca;
  --color-onyx-olive: #30322a;
  --color-pure-white: #ffffff;
  --color-bone-white: #f2f5eb;
  --color-soft-mist: #dcdfe3;
  --color-cool-stone: #d6d6d6;
  --color-carbon: #222222;

  /* Typography — Font Families */
  --font-ozik: 'Ozik', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-aeonik: 'Aeonik', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-instrument-serif: 'Instrument Serif', ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --tracking-caption: -0.036px;
  --text-body: 14px;
  --leading-body: 1.5;
  --tracking-body: -0.042px;
  --text-body-md: 16px;
  --leading-body-md: 1.5;
  --tracking-body-md: -0.496px;
  --text-subheading: 18px;
  --leading-subheading: 1.5;
  --tracking-subheading: -0.378px;
  --text-heading-sm: 20px;
  --leading-heading-sm: 1.43;
  --tracking-heading-sm: -0.3px;
  --text-heading: 24px;
  --leading-heading: 1.33;
  --tracking-heading: -0.36px;
  --text-heading-lg: 32px;
  --leading-heading-lg: 1.2;
  --tracking-heading-lg: -0.672px;
  --text-display: 40px;
  --leading-display: 1.2;
  --tracking-display: -1.24px;
  --text-display-xl: 56px;
  --leading-display-xl: 0.86;
  --tracking-display-xl: -0.784px;
  --text-display-2xl: 80px;
  --leading-display-2xl: 0.9;
  --tracking-display-2xl: -0.8px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-unit: 8px;
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-56: 56px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-128: 128px;
  --spacing-168: 168px;
  --spacing-240: 240px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80-120px;
  --card-padding: 24-40px;
  --element-gap: 8-16px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-2xl-2: 20px;
  --radius-3xl: 24px;
  --radius-3xl-2: 28px;
  --radius-3xl-3: 32px;
  --radius-3xl-4: 40px;
  --radius-full: 48px;
  --radius-full-2: 64px;
  --radius-full-3: 80px;
  --radius-full-4: 100px;

  /* Named Radii */
  --radius-nav: 28px;
  --radius-cards: 16-24px;
  --radius-badges: 20-40px;
  --radius-inputs: 24px;
  --radius-buttons: 8px (compact) or 28px (pill);
  --radius-heroorb: 9999px;

  /* Surfaces */
  --surface-forest-depths-canvas: #122314;
  --surface-pure-white-page: #ffffff;
  --surface-bone-white-card: #f2f5eb;
  --surface-sprout-wash-chip: #e7f9dd;
  --surface-electric-sprout-accent: #68ef3f;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-forest-depths: #122314;
  --color-moss-shadow: #273f2b;
  --color-lichen-sage: #7e8371;
  --color-pale-fern: #b7bda5;
  --color-electric-sprout: #68ef3f;
  --color-deep-verdant: #26a200;
  --color-sprout-wash: #e7f9dd;
  --color-mist-green: #d9deca;
  --color-onyx-olive: #30322a;
  --color-pure-white: #ffffff;
  --color-bone-white: #f2f5eb;
  --color-soft-mist: #dcdfe3;
  --color-cool-stone: #d6d6d6;
  --color-carbon: #222222;

  /* Typography */
  --font-ozik: 'Ozik', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-aeonik: 'Aeonik', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-instrument-serif: 'Instrument Serif', ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --tracking-caption: -0.036px;
  --text-body: 14px;
  --leading-body: 1.5;
  --tracking-body: -0.042px;
  --text-body-md: 16px;
  --leading-body-md: 1.5;
  --tracking-body-md: -0.496px;
  --text-subheading: 18px;
  --leading-subheading: 1.5;
  --tracking-subheading: -0.378px;
  --text-heading-sm: 20px;
  --leading-heading-sm: 1.43;
  --tracking-heading-sm: -0.3px;
  --text-heading: 24px;
  --leading-heading: 1.33;
  --tracking-heading: -0.36px;
  --text-heading-lg: 32px;
  --leading-heading-lg: 1.2;
  --tracking-heading-lg: -0.672px;
  --text-display: 40px;
  --leading-display: 1.2;
  --tracking-display: -1.24px;
  --text-display-xl: 56px;
  --leading-display-xl: 0.86;
  --tracking-display-xl: -0.784px;
  --text-display-2xl: 80px;
  --leading-display-2xl: 0.9;
  --tracking-display-2xl: -0.8px;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-56: 56px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-128: 128px;
  --spacing-168: 168px;
  --spacing-240: 240px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-2xl-2: 20px;
  --radius-3xl: 24px;
  --radius-3xl-2: 28px;
  --radius-3xl-3: 32px;
  --radius-3xl-4: 40px;
  --radius-full: 48px;
  --radius-full-2: 64px;
  --radius-full-3: 80px;
  --radius-full-4: 100px;
}
```
