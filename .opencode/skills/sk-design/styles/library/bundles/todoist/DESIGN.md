# Todoist — Style Reference
> Sunlit workspace with a paper planner — warm off-white desk, ink notes, one red pen

**Theme:** light

Todoist reads as a sunlit workspace with a paper planner: a warm off-white canvas, near-black ink text, and a single vivid red-orange accent that punctuates actions without dominating the frame. Typography is humanist and quiet — Graphik carries display sizes with tight negative tracking while Inter handles UI chrome with slightly positive tracking — so hierarchy comes from size and weight rather than color volume. Product screenshots and phone mockups float above cream-tinted decorative waves, creating atmosphere that never crosses into illustration noise. Color is rationed as functional punctuation: brand orange for one action per view, blue for links, green for status, with the rest of the screen holding still in warm neutrals. Elevation stays whisper-quiet — a single 1px hairline shadow on cards, no heavy panels or decorative gradients.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Ember Red | `#e34432` | `--color-ember-red` | Orange supporting accent for decorative details and low-frequency emphasis. Do not promote it to the primary CTA color |
| Deep Ember | `#cf3520` | `--color-deep-ember` | Brand text emphasis, eyebrow labels, decorative iconography, secondary brand presence |
| Cobalt Link | `#0f66ae` | `--color-cobalt-link` | Hyperlinks, app-internal priority labels, informational icons |
| Ink | `#25221e` | `--color-ink` | Primary text, headings, dark icon strokes, dark surface fills |
| Paper | `#fefdfc` | `--color-paper` | Page canvas, card surfaces, button text, elevated containers |
| Cream | `#fff6f0` | `--color-cream` | Decorative section bands, warm-tinted background washes, footer |
| Stone | `#d7d6d4` | `--color-stone` | Hairline borders, dividers, input borders, nav separators |
| Pencil | `#6f6c69` | `--color-pencil` | Secondary body text, helper text, muted descriptions |
| Graphite | `#94928f` | `--color-graphite` | Tertiary text, disabled icon strokes, low-emphasis labels |
| Charcoal | `#4a4744` | `--color-charcoal` | Dark button hover/pressed state, inverted surface fills |
| Teal Dusk | `#497d7e` | `--color-teal-dusk` | Accent stroke in decorative wave illustrations, secondary brand mark |
| Mint Wash | `#f0f6df` | `--color-mint-wash` | Pale green decorative background wash, soft tinted band |
| Sky Wash | `#dceaff` | `--color-sky-wash` | Pale blue decorative background wash, soft tinted band |
| Forest | `#446c3d` | `--color-forest` | Green supporting accent for decorative details and low-frequency emphasis. Use as a supporting accent, not as a status color |

## Tokens — Typography

### Graphik — Display and heading family. Owns hero headlines, section titles, nav links, and large body copy. Tight negative letter-spacing (-0.005em to -0.01em) at sizes 38px+ creates a compressed, confident display feel — headlines feel weighted rather than airy. · `--font-graphik`
- **Substitute:** Inter, Manrope, or Söhne
- **Weights:** 400, 600, 700
- **Sizes:** 16, 22, 38, 44, 55
- **Line height:** 1.00, 1.15, 1.28
- **Letter spacing:** -0.55px at 55px, -0.22px at 44px, -0.19px at 38px, -0.11px at 22px
- **Role:** Display and heading family. Owns hero headlines, section titles, nav links, and large body copy. Tight negative letter-spacing (-0.005em to -0.01em) at sizes 38px+ creates a compressed, confident display feel — headlines feel weighted rather than airy.

### Inter — UI and body family. Owns buttons, badges, inputs, form labels, secondary text, and inline UI. Slightly positive tracking (0.005em–0.025em) keeps small UI text crisp at 12–16px. Carries functional weight without competing with Graphik. · `--font-inter`
- **Substitute:** system-ui or any modern geometric sans
- **Weights:** 400, 475, 500, 600, 625, 700
- **Sizes:** 12, 14, 15, 16, 17, 18, 19, 21
- **Line height:** 1.00, 1.35, 1.40, 1.50, 1.60, 1.75
- **Letter spacing:** 0.525px at 21px, 0.18px at 18px, 0.16px at 16px, 0.07px at 14px
- **Role:** UI and body family. Owns buttons, badges, inputs, form labels, secondary text, and inline UI. Slightly positive tracking (0.005em–0.025em) keeps small UI text crisp at 12–16px. Carries functional weight without competing with Graphik.

### Caecilia — Reserved for testimonial quotes. The serif cut and generous 1.8 line-height distinguish user voices from product copy without needing quotation marks. · `--font-caecilia`
- **Substitute:** Lora or Source Serif Pro
- **Weights:** 400
- **Sizes:** 20
- **Line height:** 1.80
- **Letter spacing:** normal
- **Role:** Reserved for testimonial quotes. The serif cut and generous 1.8 line-height distinguish user voices from product copy without needing quotation marks.

### Shantell Sans — Handwritten accent for inline links inside announcement bars — introduces a human, informal voice inside otherwise neutral UI chrome. · `--font-shantell-sans`
- **Substitute:** Caveat or Kalam
- **Weights:** 400
- **Sizes:** 19
- **Line height:** 1.60
- **Letter spacing:** 0.19px at 19px
- **Role:** Handwritten accent for inline links inside announcement bars — introduces a human, informal voice inside otherwise neutral UI chrome.

### Arial — Arial — detected in extracted data but not described by AI · `--font-arial`
- **Weights:** 400
- **Sizes:** 13px
- **Line height:** 1.2
- **Role:** Arial — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.5 | 0.14px | `--text-caption` |
| body-sm | 14px | 1.5 | 0.07px | `--text-body-sm` |
| body | 16px | 1.5 | 0.16px | `--text-body` |
| body-lg | 18px | 1.5 | 0.18px | `--text-body-lg` |
| subheading | 21px | 1.5 | 0.21px | `--text-subheading` |
| heading | 38px | 1.28 | -0.19px | `--text-heading` |
| heading-lg | 44px | 1.15 | -0.22px | `--text-heading-lg` |
| display | 55px | 1 | -0.55px | `--text-display` |

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
| 64 | 64px | `--spacing-64` |
| 128 | 128px | `--spacing-128` |
| 192 | 192px | `--spacing-192` |

### Border Radius

| Element | Value |
|---------|-------|
| nav | 8px |
| cards | 8px |
| badges | 8px |
| images | 15px |
| inputs | 8px |
| buttons | 8px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| subtle | `rgba(37, 34, 30, 0.04) 0px 1px 0px 0px` | `--shadow-subtle` |
| lg | `rgba(37, 34, 30, 0.07) 0px 14px 19px -9px, rgba(37, 34, 3...` | `--shadow-lg` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 48-80px
- **Card padding:** 16-24px
- **Element gap:** 16px

## Components

### Primary Action Button
**Role:** Single dominant CTA per view (Start for free, confirm, get started)

Filled #e34432 background, #fefdfc text in Inter 600 at 16px, 8px border-radius, 12px 24px padding, two-layer warm shadow on hover. Letter-spacing 0.16px. One per view, never repeated.

### Ghost Text Link
**Role:** Secondary navigation and inline actions (Log in, Made For, Resources)

Transparent background, #25221 text in Inter 500 at 15–16px, no border, 8px padding, no shadow. Becomes #cf3520 on hover to echo the brand accent without the weight of a filled button.

### Top Navigation Bar
**Role:** Sticky-style site header

#fefdfc background, 16px vertical padding, Graphik 600 at 16px for nav links, brand logo at left (red square + ink wordmark), primary CTA at far right. 8px radius on interactive elements. Optional hairline #d7d6d4 bottom border on scroll.

### Announcement Banner
**Role:** Dismissible top-of-page message

Cream-tinted #fff6f0 background, centered text in Inter 400 at 14–15px with an inline Shantell Sans 19px link in #cf3520, close icon at far right in #94928f. Full-bleed width, 1px #d7d6d4 bottom border.

### Product Showcase Card
**Role:** Container for desktop and mobile app screenshots

#fefdfc surface, 8px border-radius, hairline shadow rgba(37,34,30,0.04) 0 1px 0, 0–4px internal padding around the screenshot. Floats above a cream or pale-green wave background. Optional 15px radius on the image mask itself for desktop variants.

### Eyebrow Label
**Role:** Small caps-style label above a section heading

Inter 600 at 12px, #cf3520 color, 0.14px letter-spacing, 0 0 8px 0 margin to heading. Used as a quiet signal of section topic before the dark heading appears.

### Voice Confirm Button
**Role:** Round action button inside mobile and voice input UIs

Filled #e34432 circle, white checkmark icon, no text label, 40–48px diameter, 8px radius (visually a full pill at this size). Sits in the bottom-right of a phone frame to confirm voice input.

### Mobile Preview Frame
**Role:** Phone-shaped mockup for app screenshots

Rounded rectangle (15px radius on the image, larger on the device frame) containing a full app screenshot. Drop shadow matches the primary button shadow stack for consistency. No visible bezel color — the frame is white with a 1px #d7d6d4 stroke.

### Testimonial Block
**Role:** Centered user quote with attribution

Caecilia 400 at 20px, #25221, line-height 1.80, centered. Surrounded by generous 64px vertical padding. No card surface — sits directly on canvas. Optional yellow/gold star decorative element in the surrounding band.

### Form Input
**Role:** Text entry field

#fefdfc background, 1px #d7d6d4 border, 8px radius, 12px 16px padding, Inter 400 at 14–15px, #25221 text, #94928f placeholder. Focus state: 1px #cf3520 border with no ring glow.

### Status Badge
**Role:** Small pill for success, priority, or category labels

Pale tinted background (e.g. #f0f6df for success, #dceaff for info), #446c3d or #0f66ae text in Inter 600 at 12px, 8px radius, 4px 10px padding. Never uses a saturated background — always a pale wash with chromatic text.

### Decorative Wave Background
**Role:** Flowing horizontal bands beneath hero and feature sections

Layered translucent strokes in #497d7, #4c7a45, and #e34432 over a cream #fff6f0 or pale-green #f0f6df base. 1–2px stroke weight, no fill, sits behind product cards. Decorative only — never carries content.

## Do's and Don'ts

### Do
- Reserve #e34432 for one primary action per view; never repeat it as a link or icon color in the same viewport.
- Set body text to #25221 on #fefdfc — the 15.6:1 contrast ratio supports AAA at 16px and keeps the canvas feeling warm rather than clinical.
- Apply 8px border-radius to every card, button, badge, and input; reserve 15px exclusively for image masks and desktop product frames.
- Use Graphik for headlines 22px and above with letter-spacing between -0.11px and -0.55px; switch to Inter for anything 21px or smaller.
- Space sections at 48–80px vertically; use 16–24px internal padding for cards and 12–16px for compact UI rows.
- Place product screenshots on #fff6f0 or #f0f6df cream/green washes, never on plain white — the warm tint is what makes the product feel sunlit rather than sterile.
- Keep elevation to a single 1px hairline shadow on cards; reach for the two-layer button shadow only on the most important action.

### Don't
- Don't paint large surfaces with #e34432 — the red is a punctuation mark, not a fill color.
- Don't use #0f66ae for body copy or non-link text; reserve cobalt for hyperlinks and info-level app labels.
- Don't stack more than one primary action button on a single view; secondary actions must use the ghost link style.
- Don't mix Graphik and Inter at the same size and role — pick one family per size band and hold the line.
- Don't use shadows heavier than rgba(37,34,30,0.04) 0 1px 0 on cards; anything stronger breaks the whisper-shadow philosophy.
- Don't apply radii larger than 8px to UI controls — 15px is reserved for image masks and would make a button look like a chip.
- Don't use pure #000000 for body text; the warm #25221 is part of the paper-planner atmosphere and reads as ink, not screen.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Paper Canvas | `#fefdfc` | Default page background for hero, content, and neutral sections |
| 1 | Cream Wash | `#fff6f0` | Decorative warm band behind product showcases and footer |
| 2 | Tinted Wave | `#f0f6df` | Pale green decorative wash inside flowing wave illustrations |
| 3 | Card Surface | `#fefdfc` | Product screenshot cards and elevated UI containers |

## Elevation

- **Card:** `rgba(37, 34, 30, 0.04) 0px 1px 0px 0px`
- **Primary Action Button:** `rgba(37, 34, 30, 0.07) 0px 14px 19px -9px, rgba(37, 34, 30, 0.18) 0px 10px 48px 0px`

## Imagery

Imagery is product-first: the hero is built around an in-app desktop screenshot of the Today view, and subsequent sections rotate through mobile phone mockups showing the app on iOS and Android. All screenshots are tightly cropped, floating on cream or pale-green wave backgrounds, never on stark white. Decorative elements are limited to flowing wave illustrations in pale green, blue, and peach — drawn as thin 1–2px strokes with no fill — and occasional gold star/sparkle accents in the testimonial band. There is no photography, no lifestyle imagery, no human faces. Iconography is line-based, monochrome in #25221 or #6f6c69, with simple geometric forms (checkmarks, arrows, calendar grids, priority flags). The visual density is low: text and product UI dominate, with imagery serving as evidence rather than decoration.

## Layout

Layout is max-width contained at 1200px, centered, with full-bleed decorative wave bands that extend past the container. The hero follows a two-column pattern: left text column (~45% width) carrying eyebrow label, display headline, body paragraph, and primary CTA; right column carrying a single product screenshot or phone mockup. Subsequent feature sections alternate the column direction (text-left/image-right then text-right/image-left) to create rhythm without mirroring. The testimonial band breaks the column structure with centered text and generous 64–80px vertical padding. Navigation sits as a single horizontal bar at the top with brand left, links center, CTA right. Section transitions are seamless — wave backgrounds blur the boundary between bands rather than using hard dividers. Vertical spacing between major sections runs 64–96px; spacing between elements within a section is 16–24px. The overall density is comfortable: one focused idea per screen, never a grid of competing blocks.

## Agent Prompt Guide

**Quick Color Reference**
- Text: #25221e on #fefdfc
- Background: #fefdfc (canvas), #fff6f0 (decorative band)
- Border: #d7d6d4
- Accent: #cf3520 (eyebrow/decorative), #0f66ae (link)
- primary action: no distinct CTA color

**Example Component Prompts**
No distinct primary action color was observed; use the extracted neutral button treatments instead of inventing a filled CTA color.
2. Build a hero headline: Graphik 700 at 55px, #25221e color, letter-spacing -0.55px, line-height 1.0. Add an eyebrow label above it in Inter 600 at 12px, #cf3520, letter-spacing 0.14px, with 8px margin to the headline.
3. Create a product showcase card: #fefdfc surface, 8px radius, hairline shadow rgba(37,34,30,0.04) 0 1px 0, 0–4px internal padding around a desktop app screenshot. Sit it on a #fff6f0 wave background that extends full-bleed.
5. Create a testimonial block: Caecilia 400 at 20px, #25221e text, line-height 1.80, centered on the canvas with 64px vertical padding above and below. No card surface — the text sits directly on #fefdfc with a small gold star decoration in the surrounding band.

## Font Pairing Logic

Graphik and Inter are not competing families — they are split by role. Graphik owns the human voice: headlines, large body paragraphs, the wordmark, and the announcement banner's main message. Its slightly condensed letterforms and tight negative tracking make it read as deliberate and editorial. Inter owns the machine voice: buttons, inputs, badges, nav links, form labels, captions — everything that is functional rather than expressive. Its wider proportions and positive tracking keep it legible at 12–16px. Caecilia and Shantell Sans are accent voices only: Caecilia for user testimonials (serif marks them as quoted, not authored), Shantell Sans for inline links inside the announcement bar (handwritten marks them as friendly, not transactional). Never let Inter appear at 38px or above — that is Graphik's territory.

## Decorative Wave System

The flowing wave backgrounds are a signature element. They are built from 3–5 layered SVG paths drawn as thin strokes (1–2px) in #497d7e, #4c7a45, and #e34432, sitting over a #fff6f0 or #f0f6df fill. Paths always flow left-to-right, never loop or close, and never carry text. They are decorative only — content always sits in front of them in a flat #fefdfc card. The waves blur the boundary between sections rather than acting as dividers, giving the page its continuous, paper-planner feel. Reuse this system on any section that needs atmospheric weight without adding a new color or illustration.

## Similar Brands

- **Notion** — Same warm off-white canvas, restrained single-accent philosophy, and humanist sans for headlines — both treat color as functional punctuation rather than decoration.
- **Things 3** — Same product-screenshot-forward hero pattern, quiet neutral palette with one warm accent, and generous whitespace around mobile mockups.
- **Any.do** — Productivity category with the same warm-paper aesthetic, red-orange CTA accent, and product-UI-centered hero composition.
- **Linear** — Same single-accent discipline (Linear uses indigo, Todoist uses red) with a whisper-shadow elevation system and tight typographic hierarchy.
- **Calendly** — Same warm-canvas + single-accent approach, Graphik/Inter-adjacent type pairing, and product-screenshot heroes that float on tinted backgrounds.

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-ember-red: #e34432;
  --color-deep-ember: #cf3520;
  --color-cobalt-link: #0f66ae;
  --color-ink: #25221e;
  --color-paper: #fefdfc;
  --color-cream: #fff6f0;
  --color-stone: #d7d6d4;
  --color-pencil: #6f6c69;
  --color-graphite: #94928f;
  --color-charcoal: #4a4744;
  --color-teal-dusk: #497d7e;
  --color-mint-wash: #f0f6df;
  --color-sky-wash: #dceaff;
  --color-forest: #446c3d;

  /* Typography — Font Families */
  --font-graphik: 'Graphik', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-caecilia: 'Caecilia', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-shantell-sans: 'Shantell Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-arial: 'Arial', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --tracking-caption: 0.14px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.5;
  --tracking-body-sm: 0.07px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: 0.16px;
  --text-body-lg: 18px;
  --leading-body-lg: 1.5;
  --tracking-body-lg: 0.18px;
  --text-subheading: 21px;
  --leading-subheading: 1.5;
  --tracking-subheading: 0.21px;
  --text-heading: 38px;
  --leading-heading: 1.28;
  --tracking-heading: -0.19px;
  --text-heading-lg: 44px;
  --leading-heading-lg: 1.15;
  --tracking-heading-lg: -0.22px;
  --text-display: 55px;
  --leading-display: 1;
  --tracking-display: -0.55px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-w475: 475;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-w625: 625;
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
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-128: 128px;
  --spacing-192: 192px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 48-80px;
  --card-padding: 16-24px;
  --element-gap: 16px;

  /* Border Radius */
  --radius-sm: 2.5px;
  --radius-lg: 8px;
  --radius-xl: 15px;

  /* Named Radii */
  --radius-nav: 8px;
  --radius-cards: 8px;
  --radius-badges: 8px;
  --radius-images: 15px;
  --radius-inputs: 8px;
  --radius-buttons: 8px;

  /* Shadows */
  --shadow-subtle: rgba(37, 34, 30, 0.04) 0px 1px 0px 0px;
  --shadow-lg: rgba(37, 34, 30, 0.07) 0px 14px 19px -9px, rgba(37, 34, 30, 0.18) 0px 10px 48px 0px;

  /* Surfaces */
  --surface-paper-canvas: #fefdfc;
  --surface-cream-wash: #fff6f0;
  --surface-tinted-wave: #f0f6df;
  --surface-card-surface: #fefdfc;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-ember-red: #e34432;
  --color-deep-ember: #cf3520;
  --color-cobalt-link: #0f66ae;
  --color-ink: #25221e;
  --color-paper: #fefdfc;
  --color-cream: #fff6f0;
  --color-stone: #d7d6d4;
  --color-pencil: #6f6c69;
  --color-graphite: #94928f;
  --color-charcoal: #4a4744;
  --color-teal-dusk: #497d7e;
  --color-mint-wash: #f0f6df;
  --color-sky-wash: #dceaff;
  --color-forest: #446c3d;

  /* Typography */
  --font-graphik: 'Graphik', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-caecilia: 'Caecilia', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-shantell-sans: 'Shantell Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-arial: 'Arial', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --tracking-caption: 0.14px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.5;
  --tracking-body-sm: 0.07px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: 0.16px;
  --text-body-lg: 18px;
  --leading-body-lg: 1.5;
  --tracking-body-lg: 0.18px;
  --text-subheading: 21px;
  --leading-subheading: 1.5;
  --tracking-subheading: 0.21px;
  --text-heading: 38px;
  --leading-heading: 1.28;
  --tracking-heading: -0.19px;
  --text-heading-lg: 44px;
  --leading-heading-lg: 1.15;
  --tracking-heading-lg: -0.22px;
  --text-display: 55px;
  --leading-display: 1;
  --tracking-display: -0.55px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-128: 128px;
  --spacing-192: 192px;

  /* Border Radius */
  --radius-sm: 2.5px;
  --radius-lg: 8px;
  --radius-xl: 15px;

  /* Shadows */
  --shadow-subtle: rgba(37, 34, 30, 0.04) 0px 1px 0px 0px;
  --shadow-lg: rgba(37, 34, 30, 0.07) 0px 14px 19px -9px, rgba(37, 34, 30, 0.18) 0px 10px 48px 0px;
}
```
