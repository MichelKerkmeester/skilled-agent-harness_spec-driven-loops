# DICE — Style Reference
> Monochrome gig flyer — black ink on white paper, headlines screaming, everything else dead quiet.

**Theme:** light

DICE runs on a strictly monochromatic, high-contrast visual system that reads like a concert poster forced into an app store. Pure black and white carry the entire interface; color exists only inside the artwork of event posters and one neon-green confirmation screen. A custom condensed display face (Foggy) shouts at 100px+ in the hero, while Favorit handles every UI surface with a slightly loosened 0.06em tracking that makes even body copy feel editorial. Buttons are 40px-radius pills, images sit in soft 8px-rounded frames, and sections alternate between white canvas and full-bleed black bands to create a zine-like rhythm. The overall attitude is punk, confident, and typographically loud — restraint everywhere except the headlines.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Pitch Black | `#000000` | `--color-pitch-black` | Primary text, filled pill buttons, full-bleed dark section backgrounds, icon strokes, hairline borders — the structural backbone of every page |
| Paper White | `#ffffff` | `--color-paper-white` | Page canvas, card surfaces, text on dark sections, button text on filled black buttons, search field fill |
| Ash Gray | `#eeeeee` | `--color-ash-gray` | Soft image backgrounds, secondary surface tint, subtle card/poster fill behind event artwork |
| Concrete | `#d9d9d9` | `--color-concrete` | Hairline dividers, muted borders, input field outlines |
| Charcoal | `#333333` | `--color-charcoal` | Secondary button fills, elevated dark surfaces, muted-on-dark text in nested components |
| Slate | `#595959` | `--color-slate` | Muted body text, secondary navigation labels, supporting metadata |
| Stone | `#808080` | `--color-stone` | Tertiary body text, disabled states, low-priority metadata |

## Tokens — Typography

### Favorit — All UI text — navigation, body copy, buttons, labels, card metadata. Weight 400 is the default; 700 is used for section headings like 'Trending in Barcelona'; 350 is reserved for quiet helper text. The 0.06em tracking gives every line a slightly looser, editorial feel — body copy never feels cramped. Stylistic sets ss02/ss03/ss05/ss06/ss08 are always on and define the character of the typeface. · `--font-favorit`
- **Substitute:** Inter, Söhne, or Neue Haas Grotesk
- **Weights:** 350, 400, 700
- **Sizes:** 12, 14, 16, 18, 24, 28px
- **Line height:** 1.15–1.50 (size-dependent)
- **Letter spacing:** 0.06em (universal across all sizes — ~0.72px at 12px, ~1.68px at 28px)
- **OpenType features:** `"ss02" on, "ss03" on, "ss05" on, "ss06" on, "ss08" on`
- **Role:** All UI text — navigation, body copy, buttons, labels, card metadata. Weight 400 is the default; 700 is used for section headings like 'Trending in Barcelona'; 350 is reserved for quiet helper text. The 0.06em tracking gives every line a slightly looser, editorial feel — body copy never feels cramped. Stylistic sets ss02/ss03/ss05/ss06/ss08 are always on and define the character of the typeface.

### Foggy — Hero display headlines only. The extreme condensed proportions, ultra-tight 0.83 line-height, and 106px size let 3–4 stacked words fill a half-screen. This is the signature element — it transforms standard product copy ('WELCOME TO THE ALTERNATIVE') into a gig poster. · `--font-foggy`
- **Substitute:** Druk Condensed, Tungsten Bold Condensed, or Antonio Bold
- **Weights:** 400
- **Sizes:** 106px
- **Line height:** 0.83
- **Letter spacing:** normal
- **OpenType features:** `"ss02" on, "ss03" on, "ss05" on, "ss06" on, "ss08" on`
- **Role:** Hero display headlines only. The extreme condensed proportions, ultra-tight 0.83 line-height, and 106px size let 3–4 stacked words fill a half-screen. This is the signature element — it transforms standard product copy ('WELCOME TO THE ALTERNATIVE') into a gig poster.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.21 | 0.72px | `--text-caption` |
| body-sm | 14px | 1.33 | 0.84px | `--text-body-sm` |
| body | 16px | 1.4 | 0.96px | `--text-body` |
| subheading | 18px | 1.4 | 1.08px | `--text-subheading` |
| heading-sm | 24px | 1.25 | 1.44px | `--text-heading-sm` |
| heading | 28px | 1.22 | 1.68px | `--text-heading` |
| display | 106px | 0.83 | — | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** compact

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
| 120 | 120px | `--spacing-120` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 100px |
| cards | 8px |
| small | 4px |
| images | 8px |
| buttons | 40px |
| navElements | 20px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 16px
- **Element gap:** 8px

## Components

### Filled Pill Button
**Role:** Primary action — 'GET THE APP', 'VIEW TICKET'

40px border-radius, Pitch Black (#000000) fill, Paper White (#ffffff) text, Favorit weight 700, 12px font-size, 22px horizontal padding / 12px vertical padding, all-caps, 0.06em tracking. The full pill shape is non-negotiable — no square or lightly-rounded variants exist.

### Outlined Pill Button
**Role:** Secondary navigation action — 'BROWSE EVENTS'

40px border-radius, transparent fill, 1px Pitch Black (#000000) border, Pitch Black text, Favorit weight 700, 12px, 22px/12px padding. Appears on white backgrounds only. Inverts to white border + white text on black sections.

### Search Field
**Role:** Global event/venue/city search in nav

Rounded rectangle (radius ~20px), Paper White fill, 1px border matching surrounding surface, search icon on left in Pitch Black. Placeholder 'Search by event, venue or city' in Stone (#808080), Favorit 14px. Sits inline with the primary nav.

### Event Card
**Role:** Trending/recommended event tile

Vertical card, 8px radius on poster image, no border, no shadow. Poster image fills the card; below sits event title (Favorit 16px weight 700), date (Favorit 14px Slate #595959), venue (Favorit 14px weight 700), and price (Favorit 14px). No padding inside the card — type sits flush against the poster edge with ~8px margin.

### Hero Section
**Role:** Above-the-fold brand statement

Two-column: left holds Foggy 106px/0.83 hero headline (3–4 stacked lines), sub-paragraph at Favorit 18px in Charcoal, and a filled pill CTA. Right holds a phone mockup with a confirmation screen (neon-green fill — the only color moment). White background, max-width 1200px centered, ~80px vertical padding.

### Phone Mockup Frame
**Role:** Product/app preview container

Pitch Black (#000000) rounded rectangle (40px radius) acting as a stylized phone frame. Screen content sits inside with a small notch. Used to showcase app UI within hero/feature sections.

### Dark Feature Band
**Role:** Full-bleed alternating section

Pitch Black (#000000) full-width background, 80px+ vertical padding. White line-art mascot illustrations (chunky, cartoon, single-stroke) float above three centered white text columns (Favorit 16px, max-width ~280px each). Centered white section title at Favorit 28px weight 700 above.

### Section Heading Block
**Role:** Section openers like "Trending in Barcelona"

Favorit 16px weight 700 in Pitch Black for the title, followed by a 1–2 line description in Favorit 16px weight 400 in Charcoal (#333333). Sits left-aligned in a max-width container, with a BROWSE EVENTS outlined pill anchored right.

### Horizontal Event Carousel Row
**Role:** Trending/featured event scrolling list

Row of Event Cards on a white background, 8–16px gap between cards, horizontal overflow scroll. Cards bleed to the page edge with internal max-width padding to keep the row visually continuous.

### What Else List
**Role:** Secondary feature list with icons

Left-aligned list of 3 items; each item is a small outlined icon (~24px) followed by Favorit 18px weight 400 text. One item is active (Pitch Black text + icon), the other two are dimmed (Stone #808080) to indicate future/secondary features.

### Ticket Detail Card
**Role:** In-app ticket preview within phone mockup

Phone screen with neon-green (#7ffeb1-ish) background, small illustrated event icon, Favorit 18px weight 700 event info, artist/title block, and a centered filled black 'VIEW TICKET' pill. This green is the only color in the entire system and is confined to confirmation/success states.

### Navigation Bar
**Role:** Primary site navigation

Top row: DICE mascot logo (left), Search Field (center-left), nav links (Browse events, Get help, Work with us, Log in / Sign up) in Favorit 14px, then filled black 'GET THE APP' pill on the far right. 1px bottom border in Concrete (#d9d9d9). Padding 24px vertical.

### Mascot Illustrations
**Role:** Brand character artwork on dark sections

Custom hand-drawn DICE mascot in white single-stroke line art, variations show the character holding different objects (drinks, sparklers, etc.). ~200px square, no fill, consistent stroke weight, floats above each feature column.

## Do's and Don'ts

### Do
- Use 40px border-radius on every button — the pill shape is the system, not a suggestion
- Set 0.06em letter-spacing on all Favorit text and always enable ss02/ss03/ss05/ss06/ss08
- Stack hero headlines in Foggy 106px/0.83 line-height to fill the vertical space — never let the display face sit on a single line
- Alternate full-bleed black sections with white sections to create a zine-like vertical rhythm; minimum 80px vertical padding inside each
- Lock the palette to black, white, and three grays (#eeeeee, #d9d9d9, #333333) — no chromatic accents in UI chrome
- Round event poster images and card media at 8px — softer than buttons, distinct from the pill system
- Use 24px as the base section padding and 8px for inline element gaps

### Don't
- Don't introduce any color into the UI chrome — if you need a status color, confine it to a confirmation screen or illustration artwork, never to a button, border, or text token
- Don't set buttons to sharp or lightly-rounded corners — 40px is mandatory
- Don't use Foggy for body copy or anything under 80px — it only works at display scale
- Don't use weight 500 or 600 with Favorit — the system only uses 350, 400, and 700
- Don't add drop shadows to cards or buttons — the design uses flat surfaces and solid color contrast, not elevation
- Don't use letter-spacing other than 0.06em on Favorit — the open tracking is a brand signal, not an accident
- Don't use decorative gradients — the system is strictly flat; the only color treatment is solid fills and the single green confirmation screen

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Paper White | `#ffffff` | Base page canvas — all white sections, card surfaces, navigation background |
| 1 | Ash Gray | `#eeeeee` | Soft fill behind poster images and subtle surface tinting |
| 2 | Charcoal | `#333333` | Secondary button fills and elevated dark surfaces |
| 3 | Pitch Black | `#000000` | Full-bleed dark section bands and primary filled buttons |

## Elevation

- **Event Card:** `none — flat, no shadow, separation achieved through white space on white background`
- **Filled Pill Button:** `none — flat black fill against white`
- **Phone Mockup:** `none — black frame on white, no cast shadow`

## Imagery

Event poster artwork is the primary visual content — each event card features a unique designed poster (concert flyers, album covers, festival graphics) in a wide variety of colors and treatments. Outside of posters, the only consistent illustration is the DICE mascot: a hand-drawn cartoon character in white single-stroke line art, appearing on dark sections holding props (drinks, sparklers, phones). Product imagery uses phone mockup frames (black rectangles with rounded corners) to preview the app. No photography, no abstract 3D, no decorative gradients.

## Agent Prompt Guide

**Quick Color Reference**
- Text: #000000
- Background: #ffffff
- Border: #d9d9d9
- Muted text: #595959
- Dark band background: #000000
- primary action: #000000 (filled action)

**Example Component Prompts**

1. Build a filled black pill button: 40px radius, #000000 fill, #ffffff text, Favorit 12px weight 700, 0.06em tracking, 12px/22px padding, all-caps label like 'GET THE APP'.

2. Create a Primary Action Button: #000000 background, #ffffff text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.

3. Build a dark feature band: #000000 full-bleed background, 80px vertical padding, centered Favorit 28px weight 700 white heading 'Weirdly easy ticketing', then a 3-column grid below with a white line-art mascot icon (~200px), a Favorit 16px white caption under each, equally spaced.

4. Build an event card row: horizontal flex with 16px gap, each card has an 8px-radius poster image (aspect 1:1), followed by a Favorit 16px weight 700 event title in #000000, then a Favorit 14px weight 400 date line in #595959, then venue (700) and price in #000000.

5. Build a section header: left-aligned Favorit 16px weight 700 title 'Trending in Barcelona' in #000000, a 1–2 line Favorit 16px weight 400 description in #333333 below it, and a 40px-radius outlined pill button 'BROWSE EVENTS' anchored to the right.

## Typography Signature

The system runs on two custom faces with overlapping stylistic sets (ss02, ss03, ss05, ss06, ss08). Favorit handles everything below the hero with an unusually open 0.06em tracking — this slight looseness is what makes the UI feel editorial rather than generic SaaS. Foggy appears ONLY in the hero at 106px with 0.83 line-height; it's the loudest design choice in the system and must not be used elsewhere.

## Similar Brands

- **Bandsintown** — Same concert-discovery focus with poster-driven event cards, though Bandsintown adds more color to its UI chrome
- **Resident Advisor (RA)** — Editorial-leaning event platform with bold display type and high-contrast layouts, though RA uses red accents and a different type system
- **Songkick** — Live music ticketing with similar card grids and ticket preview patterns, though Songkick leans warmer with purple/blue accents
- **Eventbrite** — Ticketing scale and event card patterns, but Eventbrite's design is far more generic SaaS compared to DICE's zine-like typographic confidence
- **Pioneer Works / cultural institution sites** — Same punk-zine aesthetic with massive condensed display type, full-bleed black bands, and strict monochrome palettes

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-pitch-black: #000000;
  --color-paper-white: #ffffff;
  --color-ash-gray: #eeeeee;
  --color-concrete: #d9d9d9;
  --color-charcoal: #333333;
  --color-slate: #595959;
  --color-stone: #808080;

  /* Typography — Font Families */
  --font-favorit: 'Favorit', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-foggy: 'Foggy', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.21;
  --tracking-caption: 0.72px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.33;
  --tracking-body-sm: 0.84px;
  --text-body: 16px;
  --leading-body: 1.4;
  --tracking-body: 0.96px;
  --text-subheading: 18px;
  --leading-subheading: 1.4;
  --tracking-subheading: 1.08px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.25;
  --tracking-heading-sm: 1.44px;
  --text-heading: 28px;
  --leading-heading: 1.22;
  --tracking-heading: 1.68px;
  --text-display: 106px;
  --leading-display: 0.83;

  /* Typography — Weights */
  --font-weight-w350: 350;
  --font-weight-regular: 400;
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
  --spacing-120: 120px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 16px;
  --element-gap: 8px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 20px;
  --radius-3xl: 40px;
  --radius-full: 100px;

  /* Named Radii */
  --radius-tags: 100px;
  --radius-cards: 8px;
  --radius-small: 4px;
  --radius-images: 8px;
  --radius-buttons: 40px;
  --radius-navelements: 20px;

  /* Surfaces */
  --surface-paper-white: #ffffff;
  --surface-ash-gray: #eeeeee;
  --surface-charcoal: #333333;
  --surface-pitch-black: #000000;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-pitch-black: #000000;
  --color-paper-white: #ffffff;
  --color-ash-gray: #eeeeee;
  --color-concrete: #d9d9d9;
  --color-charcoal: #333333;
  --color-slate: #595959;
  --color-stone: #808080;

  /* Typography */
  --font-favorit: 'Favorit', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-foggy: 'Foggy', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.21;
  --tracking-caption: 0.72px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.33;
  --tracking-body-sm: 0.84px;
  --text-body: 16px;
  --leading-body: 1.4;
  --tracking-body: 0.96px;
  --text-subheading: 18px;
  --leading-subheading: 1.4;
  --tracking-subheading: 1.08px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.25;
  --tracking-heading-sm: 1.44px;
  --text-heading: 28px;
  --leading-heading: 1.22;
  --tracking-heading: 1.68px;
  --text-display: 106px;
  --leading-display: 0.83;

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
  --spacing-120: 120px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 20px;
  --radius-3xl: 40px;
  --radius-full: 100px;
}
```
