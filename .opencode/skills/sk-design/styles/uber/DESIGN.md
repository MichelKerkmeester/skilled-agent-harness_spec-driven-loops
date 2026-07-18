# Uber — Style Reference
> Black-and-white transit kiosk. Picture a monochrome wayfinding panel where the only color comes from editorial illustrations mounted beside the input form.

**Theme:** light

Uber's interface is a disciplined black-on-white transit kiosk: every screen is a white canvas anchored by a single black navigation bar, a black footer, and solid black controls, with zero chromatic UI color. All color in the system lives inside flat editorial illustrations — a packed suitcase, two riders in a car, a bowl of food — that float beside the form rather than within it. Typography is custom and confident: UberMove at 52px for headlines with tight 1.22 line-height, UberMoveText at 14–18px for everything else, and a single weight (400) does the work that other systems spread across three. Components are flat, borders are 1px hairline grays, and radii are binary — 8px for cards, inputs, and standard buttons, or a full 999px pill for nav CTAs and toggles. The only structural rhythm break is the sticky black 'See prices' bar that follows scroll, a persistent commitment to the next conversion.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Jet Black | `#000000` | `--color-jet-black` | Headings, body text, top navigation bar, footer background, filled controls, sticky bottom bar, location pin icons — the achromatic anchor that gives the white canvas its structure |
| Paper White | `#ffffff` | `--color-paper-white` | Page background, card surfaces, text on dark bars, input fields — the dominant canvas that every other element sits on |
| Mist Gray | `#f6f6f6` | `--color-mist-gray` | Suggestion card backgrounds, subtle section washes, input field fills, nav hover states — a single step off white that creates depth without contrast |
| Charcoal | `#333333` | `--color-charcoal` | Secondary headings, footer column titles, darker body text variant — used when pure black feels too heavy on dense surfaces |
| Iron Gray | `#767676` | `--color-iron-gray` | Input field borders, divider lines, placeholder-adjacent borders — the workhorse hairline color |
| Ash Gray | `#afafaf` | `--color-ash-gray` | Muted helper text, disabled-link text, secondary metadata in body copy — disappears by design |
| Slate | `#5e5e5e` | `--color-slate` | Body text on light surfaces where full black would feel aggressive, secondary paragraph copy |
| Graphite | `#4b4b4b` | `--color-graphite` | Supporting neutral for secondary UI, dividers, and muted labels. Do not promote it to the primary CTA color |
| Faded Teal | `#9dcdd6` | `--color-faded-teal` | Blue supporting accent for decorative details and low-frequency emphasis. |

## Tokens — Typography

### sans-serif — sans-serif — detected in extracted data but not described by AI · `--font-sans-serif`
- **Weights:** 400
- **Sizes:** 16px
- **Line height:** 1.2
- **Role:** sans-serif — detected in extracted data but not described by AI

### UberMove — Headlines, hero copy, display text. At 52px with 1.22 line-height and weight 400, it is the brand's voice — geometric, calm, never bold-display-loud. Weight 700 reserved for nav brand mark and emphasized headings · `--font-ubermove`
- **Substitute:** Inter, Helvetica Neue, system-ui
- **Weights:** 400, 700
- **Sizes:** 20px, 24px, 36px, 52px
- **Line height:** 1.22, 1.23, 1.33, 1.40
- **Letter spacing:** normal
- **Role:** Headlines, hero copy, display text. At 52px with 1.22 line-height and weight 400, it is the brand's voice — geometric, calm, never bold-display-loud. Weight 700 reserved for nav brand mark and emphasized headings

### UberMoveText — Body copy, button labels, nav links, input text, helper text, footer links. The workhorse family at 14–18px / weight 400. Weight 500 is rare — used only for emphasis in nav or button labels that need to carry slightly more weight than surrounding text · `--font-ubermovetext`
- **Substitute:** Inter, system-ui, -apple-system
- **Weights:** 400, 500
- **Sizes:** 12px, 14px, 16px, 18px, 24px
- **Line height:** 1.14, 1.20, 1.25, 1.33, 1.43, 1.50, 1.67, 2.00
- **Letter spacing:** normal
- **Role:** Body copy, button labels, nav links, input text, helper text, footer links. The workhorse family at 14–18px / weight 400. Weight 500 is rare — used only for emphasis in nav or button labels that need to carry slightly more weight than surrounding text

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.67 | — | `--text-caption` |
| body-sm | 14px | 1.5 | — | `--text-body-sm` |
| body | 16px | 1.43 | — | `--text-body` |
| subheading | 18px | 1.33 | — | `--text-subheading` |
| heading-sm | 24px | 1.33 | — | `--text-heading-sm` |
| heading | 36px | 1.22 | — | `--text-heading` |
| display | 52px | 1.23 | — | `--text-display` |

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
| 28 | 28px | `--spacing-28` |
| 32 | 32px | `--spacing-32` |
| 36 | 36px | `--spacing-36` |
| 48 | 48px | `--spacing-48` |
| 64 | 64px | `--spacing-64` |

### Border Radius

| Element | Value |
|---------|-------|
| tabs | 8px |
| cards | 8px |
| pills | 9999px |
| inputs | 8px |
| buttons | 8px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 64px
- **Card padding:** 24px
- **Element gap:** 16px

## Components

### Black Filled Button
**Role:** Primary conversion control — 'See prices', 'Log in to your account'

Solid #000000 background, #ffffff text in UberMoveText 16px weight 400. 8px border-radius, 12px vertical padding × 16px horizontal padding. No shadow, no border, no hover state variation visible. Text is left-padded to clear the label; on mobile it stretches full-width.

### White Pill Button
**Role:** Navigation CTA — 'Sign up' in the top bar

#ffffff background, #000000 text in UberMoveText 14px weight 400. 9999px border-radius (full pill), 6px vertical × 16px horizontal padding. Inverts the black-bar context it sits inside — the white pill is the only thing that breaks the black nav.

### Location Input Field
**Role:** Pickup and dropoff entry in the hero form

#ffffff background with a 1px #767676 border, 8px radius. 16px vertical padding. Left side has a vertical timeline track with a black filled circle (pickup) and black square (dropoff) connected by a thin line. Placeholder text in UberMoveText 16px weight 400, #000000. An arrow icon sits right-aligned in the pickup row.

### Trip Type Toggle
**Role:** Switching between 'Pickup now' and 'Schedule ahead' modes

Full-pill 9999px radius container with #f6f6f6 background. Active state shows a clock icon + 'Pickup now' label in UberMoveText 16px. Inactive state is bare text. Sits directly above the input stack as a compact mode selector.

### Suggestion Card
**Role:** Service category tiles — Ride, Reserve, Food, Package

#f6f6f6 background, 8px border-radius, no border, no shadow. Two-column internal layout: left column holds an UberMoveText 16px weight 500 title and 14px weight 400 description in #5e5e5, plus a 'Details' link in weight 500 underlined. Right column holds a flat illustration (~120px wide) showing a car, calendar, or food bowl. Cards sit in a 3-column grid with 16px gaps.

### Top Navigation Bar
**Role:** Global site navigation — persistent across all pages

#000000 background, full-width, ~56px height. Left: Uber wordmark in white UberMove. Center: nav links (Ride, Earn, Business, Uber Eats, About) in UberMoveText 14px weight 400 #ffffff, with a dropdown chevron on About. Right: globe icon + 'EN', 'Help' link, 'Log in' link, then the white pill 'Sign up' button. 16px horizontal padding on the link cluster.

### Sticky Bottom Bar
**Role:** Persistent conversion anchor that follows scroll

#000000 background, full-width, ~56px height, position fixed to viewport bottom. Single centered label 'See prices' in #ffffff UberMoveText 16px weight 400. No button chrome — the entire bar IS the button. Overlays content with no shadow separator.

### Section Heading
**Role:** Page section titles — 'Suggestions', 'Log in to see your account details', 'Plan for later'

UberMove 36px weight 400 in #000000, line-height 1.22. Left-aligned, sits at the start of each section with 32–48px of top margin. No decorative elements, no accent color, no underline — the weight of the size and the cleanness of the typeface do all the work.

### Tab Strip
**Role:** Mode switching in the 'Plan for later' section

Horizontal row of tabs in UberMoveText 16px weight 400 #000000. Active tab has a #9dcdd6 background fill spanning the tab width with 8px radius; inactive tabs are bare text with 16px horizontal padding. Single chromatic UI element in the entire system.

### Footer
**Role:** Site-wide link directory, social, app downloads, legal

#000000 background spanning full width. Top region has a 'Visit Help Center' link in white. Four-column link grid (Company, Products, Global citizenship, Travel) with column titles in #ffffff weight 500 16px and links in #afafaf weight 400 14px, 12px row gap. Bottom row: social icons (LinkedIn, YouTube, Instagram, X) on the left, language/location selectors on the right, app store badges below. 64px vertical padding top and bottom.

### Illustration Panel
**Role:** Editorial visual companion to text sections

Contained rectangular panels (~480px wide) holding flat vector illustrations. The suitcase scene uses warm oranges (#c44a1 area), deep teals, and sandy tans. The rider portrait uses solid cobalt blue (#276ef1 area) and warm browns. No gradients, no 3D, no photography — all flat fills with hard edges. Illustrations carry all the color in the system; the UI around them stays strictly achromatic.

### City Picker Pill
**Role:** Location selector in the hero — 'Barcelona, ES · Change city'

Black filled circle (6px) followed by 'Barcelona, ES' in UberMoveText 18px weight 500 #000000, then a light gray pill containing 'Change city' in 14px weight 500. Sits above the hero headline as a compact location context.

## Do's and Don'ts

### Do
- Use #000000 for all filled buttons, the navigation bar, the footer, and the sticky bottom bar — these three black bands are the system's structural rhythm
- Use UberMove at 52px weight 400 for the primary headline; never bold it to 700
- Use 8px border-radius for all cards, inputs, and standard buttons; use 9999px only for nav CTAs and mode toggles
- Keep all UI elements achromatic — let illustrations carry color, not controls or text
- Use 1px #767676 hairline borders for input fields; never use box-shadows for separation
- Apply 64px section gaps and 16px element gaps as the default vertical rhythm
- Use #f6f6f6 for card backgrounds when the card sits directly on a #ffffff page surface

### Don't
- Don't introduce chromatic accent colors into buttons, links, or interactive controls — the system is intentionally monochrome in its UI layer
- Don't use box-shadows or drop shadows on cards, modals, or inputs — depth comes from surface color steps, not elevation
- Don't bold UberMove headlines above weight 400; the system speaks at normal weight, not display-bold
- Don't use 9999px radius on cards or inputs — pill radius is reserved for nav CTAs and trip-mode toggles
- Don't use centered body copy; text is always left-aligned within the 1200px max-width container
- Don't let illustrations bleed beyond their bounding panels or overlap surrounding type
- Don't use the #9dcdd6 teal outside of the tab strip — it is a single-purpose active-state signal, not a general accent

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Paper White | `#ffffff` | Page canvas — every section defaults to pure white |
| 1 | Mist Gray | `#f6f6f6` | Suggestion cards, input fills, subtle section differentiation |
| 2 | Jet Black | `#000000` | Top navigation bar, footer, sticky bottom bar — the structural black bands that frame the white content |

## Elevation

The system is deliberately flat — no component uses drop shadows or elevation stacking. Depth is created exclusively through the surface progression (#ffffff page → #f6f6f6 card → #000000 structural bar) and 1px hairline borders. This keeps the interface feeling like a printed transit poster rather than a software application.

## Imagery

All visual color lives inside flat editorial illustrations — no photography, no 3D, no gradients. Illustrations are vector-flat with hard edges and a limited palette of warm oranges, deep teals, cobalt blue, sandy tans, and warm browns. Scenes depict service scenarios: a packed suitcase for travel, two riders in a car for the account section, a food bowl for delivery, a shopping basket for packages. Illustrations are always contained in bounded panels beside text — never full-bleed, never overlapping type. They serve as emotional anchors for each service category while the surrounding UI stays strictly achromatic. Icon style is minimal: solid black glyphs for location pins, clock, arrows, and social marks, with no multicolor or outlined alternatives.

## Layout

Max-width ~1200px centered container with full-bleed black bars for nav and footer. Hero is a two-column split: left holds the headline + form stack (city picker, toggle, two inputs, CTA), right holds a square illustration panel. The 'Suggestions' section is a 3-column card grid with 16px gaps. The account section mirrors the hero split — text left, illustration right. 'Plan for later' is a full-width tabbed content area. Footer is a 4-column link grid on a black band. A sticky black 'See prices' bar persists at the viewport bottom across all scroll positions. Section gaps are ~64px, creating a calm vertical rhythm. The layout is strictly left-aligned for text — no centered body copy, no asymmetric text blocks.

## Agent Prompt Guide

Quick Color Reference:
- text: #000000
- background: #ffffff
- surface (cards, inputs): #f6f6f6
- border (hairlines): #767676
- muted text: #5e5e5e
- primary action: no distinct CTA color

Example Component Prompts:

1. Build the hero form: white #ffffff page background. City picker at top — black dot + 'City, Region' in UberMoveText 18px weight 500, followed by a #f6f6f6 pill containing 'Change city' in 14px weight 500. Headline below: 'Go anywhere with [Brand]' in UberMove 52px weight 400 #000000. Then a #f6f6f6 full-pill (9999px) toggle showing clock icon + 'Pickup now' in UberMoveText 16px. Two stacked input fields: #ffffff background, 1px #767676 border, 8px radius, 16px padding, left icon (filled circle for pickup, filled square for dropoff) connected by a vertical line, placeholder text 'Pickup location' / 'Dropoff location' in UberMoveText 16px #000000. Solid black #000000 button below: UberMoveText 16px weight 400 #ffffff, 8px radius, 12px 16px padding, label 'See prices'.

2. Build a suggestion card grid: 3-column layout on a #ffffff page, 16px gap between cards. Each card: #f6f6f6 background, 8px radius, 24px padding, no border, no shadow. Two-column internal layout — left 60% holds a title in UberMoveText 16px weight 500 #000000, a description in 14px weight 400 #5e5e5e, and a 'Details' link in 14px weight 500 #000000 underlined. Right 40% holds a flat vector illustration ~120px wide (car / calendar / food bowl / shopping basket).

3. Build the top navigation bar: full-width #000000 background, 56px height, flex row. Left: brand wordmark in #ffffff UberMove 20px weight 700. Center: nav links 'Ride', 'Earn', 'Business', 'Uber Eats', 'About' in UberMoveText 14px weight 400 #ffffff, 16px horizontal gap, with a small chevron after 'About'. Right cluster: globe icon + 'EN', then 'Help' text link, then 'Log in' text link, then a white #ffffff pill button 'Sign up' with 9999px radius, 6px 16px padding, text in UberMoveText 14px weight 400 #000000.

4. Build the sticky bottom bar: position fixed, bottom 0, full-width, 56px height, #000000 background. Center-aligned label 'See prices' in UberMoveText 16px weight 400 #ffffff. No border, no shadow, no rounded corners — the bar touches both viewport edges.

5. Build the tab strip: horizontal flex row, each tab is 16px horizontal padding, UberMoveText 16px weight 400 #000000. Active tab: full-width #9dcdd6 background fill, 8px radius. Inactive tabs: no background. 0px gap between tabs — the colored fill defines the active boundary.

## Similar Brands

- **Lyft** — Same achromatic black-and-white transit-kiosk approach with pink as a single accent; identical split-hero layout with form left and illustration right
- **Bolt** — Same monochrome mobility interface with solid black CTAs and flat editorial illustrations beside functional forms
- **Notion** — Same disciplined black-on-white system where all color is withheld from the UI and only appears in user content or illustrations
- **Airbnb** — Same custom geometric typeface (Airbnb Cereal ↔ UberMove) with editorial flat illustrations carrying all the chromatic content
- **DoorDash** — Same consumer-marketplace pattern of white canvas, black nav bar, three-column suggestion card grid with flat category illustrations

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-jet-black: #000000;
  --color-paper-white: #ffffff;
  --color-mist-gray: #f6f6f6;
  --color-charcoal: #333333;
  --color-iron-gray: #767676;
  --color-ash-gray: #afafaf;
  --color-slate: #5e5e5e;
  --color-graphite: #4b4b4b;
  --color-faded-teal: #9dcdd6;

  /* Typography — Font Families */
  --font-sans-serif: 'sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-ubermove: 'UberMove', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-ubermovetext: 'UberMoveText', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.67;
  --text-body-sm: 14px;
  --leading-body-sm: 1.5;
  --text-body: 16px;
  --leading-body: 1.43;
  --text-subheading: 18px;
  --leading-subheading: 1.33;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.33;
  --text-heading: 36px;
  --leading-heading: 1.22;
  --text-display: 52px;
  --leading-display: 1.23;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-28: 28px;
  --spacing-32: 32px;
  --spacing-36: 36px;
  --spacing-48: 48px;
  --spacing-64: 64px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 64px;
  --card-padding: 24px;
  --element-gap: 16px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-full: 999px;

  /* Named Radii */
  --radius-tabs: 8px;
  --radius-cards: 8px;
  --radius-pills: 9999px;
  --radius-inputs: 8px;
  --radius-buttons: 8px;

  /* Surfaces */
  --surface-paper-white: #ffffff;
  --surface-mist-gray: #f6f6f6;
  --surface-jet-black: #000000;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-jet-black: #000000;
  --color-paper-white: #ffffff;
  --color-mist-gray: #f6f6f6;
  --color-charcoal: #333333;
  --color-iron-gray: #767676;
  --color-ash-gray: #afafaf;
  --color-slate: #5e5e5e;
  --color-graphite: #4b4b4b;
  --color-faded-teal: #9dcdd6;

  /* Typography */
  --font-sans-serif: 'sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-ubermove: 'UberMove', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-ubermovetext: 'UberMoveText', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.67;
  --text-body-sm: 14px;
  --leading-body-sm: 1.5;
  --text-body: 16px;
  --leading-body: 1.43;
  --text-subheading: 18px;
  --leading-subheading: 1.33;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.33;
  --text-heading: 36px;
  --leading-heading: 1.22;
  --text-display: 52px;
  --leading-display: 1.23;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-28: 28px;
  --spacing-32: 32px;
  --spacing-36: 36px;
  --spacing-48: 48px;
  --spacing-64: 64px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-full: 999px;
}
```
