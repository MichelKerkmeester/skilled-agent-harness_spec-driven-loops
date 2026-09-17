# Wizz — Style Reference
> Neon pink highlighter on a black-and-white editorial — like a single fluorescent mark on a fashion magazine spread.

**Theme:** light

Wizz operates on a high-contrast social-app language: saturated black-and-white structure shot through with one electric hot-pink accent that functions as the only chromatic signal in the system. The hero is deliberately loud — a full-bleed multi-hue gradient (lavender, coral, sky, amber) supporting massive compressed black type — while every section below retreats to white space and lets pink do the work as a single, recurring punctuation mark. Typography is geometric and architectural: PolySans Bulky at display sizes, PolySans Median for headings and nav, PolySans Neutral for body — each weight stepping down in confidence rather than warmth. Components are rounded, pill-heavy, and flat; the only depth comes from a very faint black shadow on raised buttons. The navigation bar is a floating black pill that hovers above the page, setting the visual rhythm of dark-on-light framing devices.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Volt Pink | `#ff3d9e` | `--color-volt-pink` | Primary action buttons, section labels, active states, cookie accept — the sole chromatic brand color, carrying 100% of the accent weight in the interface |
| Obsidian | `#000000` | `--color-obsidian` | Page text, floating navigation bar, bold display headlines, cookie banner surface, icon fills |
| Paper White | `#ffffff` | `--color-paper-white` | Page canvas, section backgrounds, text on dark surfaces, card surfaces in light sections |
| Ash | `#dadada` | `--color-ash` | Hairline borders, card inset rings, subtle dividers, secondary text on light backgrounds |
| Charcoal | `#444444` | `--color-charcoal` | Input borders, secondary surface fills, muted UI elements |
| Onyx | `#292929` | `--color-onyx` | Secondary button backgrounds, elevated surface tone |
| Mist | `#eeeeee` | `--color-mist` | Input field backgrounds, subtle fill surfaces |

## Tokens — Typography

### sans-serif — sans-serif — detected in extracted data but not described by AI · `--font-sans-serif`
- **Weights:** 400
- **Sizes:** 12px
- **Line height:** 1.2
- **Role:** sans-serif — detected in extracted data but not described by AI

### PolySans Bulky — Hero display headlines — the signature compressed ultra-bold weight; tight line-height (1.0) lets the letters stack like a logo mark rather than reading as paragraphs · `--font-polysans-bulky`
- **Substitute:** Druk Wide Bold, Archivo Black, or system impact weight
- **Weights:** 700
- **Sizes:** 72px
- **Line height:** 1.00
- **Role:** Hero display headlines — the signature compressed ultra-bold weight; tight line-height (1.0) lets the letters stack like a logo mark rather than reading as paragraphs

### PolySans Median — Primary workhorse — nav links, section headings, the 86px display for page-openers, all-caps micro-labels with 0.05em tracking. The compressed line-heights (0.85–1.0) at large sizes are what give Wizz its editorial-magazine density · `--font-polysans-median`
- **Substitute:** Inter, Manrope, or system geometric sans
- **Weights:** 400, 600, 700
- **Sizes:** 10px, 13px, 14px, 16px, 18px, 86px
- **Line height:** 0.85, 1.00, 1.10, 1.20, 1.25, 1.44, 1.50, 2.00
- **Letter spacing:** -0.0100em at display sizes, 0.0500em for all-caps labels
- **Role:** Primary workhorse — nav links, section headings, the 86px display for page-openers, all-caps micro-labels with 0.05em tracking. The compressed line-heights (0.85–1.0) at large sizes are what give Wizz its editorial-magazine density

### PolySans Neutral — Body copy, paragraph text, descriptive content — generous line-height (1.5) creates reading rhythm distinct from the tight display set · `--font-polysans-neutral`
- **Substitute:** Inter, system-ui sans-serif
- **Weights:** 400
- **Sizes:** 14px, 16px, 18px
- **Line height:** 1.20, 1.30, 1.40, 1.50
- **Role:** Body copy, paragraph text, descriptive content — generous line-height (1.5) creates reading rhythm distinct from the tight display set

### PolySans Slim — Light-weight utility text, subtle links, fine-print detail — provides typographic contrast against heavier Median weights in the same layout · `--font-polysans-slim`
- **Substitute:** Inter Light, system sans-serif at weight 300
- **Weights:** 300
- **Sizes:** 14px
- **Line height:** 1.00, 1.10
- **Role:** Light-weight utility text, subtle links, fine-print detail — provides typographic contrast against heavier Median weights in the same layout

### Inter — Inter — detected in extracted data but not described by AI · `--font-inter`
- **Weights:** 400
- **Sizes:** 12px
- **Line height:** 1.2
- **Role:** Inter — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 10px | 1.5 | 0.05px | `--text-caption` |
| body-sm | 14px | 1.4 | — | `--text-body-sm` |
| subheading | 18px | 1.4 | — | `--text-subheading` |
| display-xl | 72px | 1 | — | `--text-display-xl` |
| display | 86px | 0.85 | -0.86px | `--text-display` |

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
| 48 | 48px | `--spacing-48` |
| 56 | 56px | `--spacing-56` |
| 64 | 64px | `--spacing-64` |
| 80 | 80px | `--spacing-80` |
| 88 | 88px | `--spacing-88` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 12px |
| icons | 5px |
| pills | 999px |
| images | 24px |
| inputs | 12px |
| buttons | 12px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| md | `rgba(0, 0, 0, 0.05) 0px 1px 10px 0px` | `--shadow-md` |
| xl | `rgba(0, 0, 0, 0.3) 0px 1px 30px 0px` | `--shadow-xl` |
| subtle | `rgb(218, 218, 218) 0px 0px 0px 1px inset` | `--shadow-subtle` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 16px
- **Element gap:** 10px

## Components

### Floating Navigation Pill
**Role:** Primary site navigation bar

Black (#000000) pill-shaped bar, border-radius 999px, floating at top of page. Contains white Wizz logotype on left, nav links (white text, PolySans Median 14px weight 400) in center, and pink (#ff3d9e) 'Download' CTA button on right. Full-width within page max-width with generous horizontal padding (~20px). No visible border; relies on the black-fill contrast against the white page.

### Primary CTA Button (Download / Accept / Our News)
**Role:** Main call-to-action

Filled with Volt Pink (#ff3d9e), white text, PolySans Median weight 600, 14–16px. Border-radius 12px. Padding approximately 10px 20px. The small 'Our News' variant uses 16px 24px padding. This is the only chromatic action element in the system.

### News / Announcement Pill
**Role:** Inline news banner

Pill-shaped, border-radius 999px, dark fill (#000000 or very dark), containing a small 'NEWS' tag in pink or white, followed by announcement text in white PolySans Median 13–14px. Includes a right-pointing arrow or chevron. Padding approximately 8px 16px.

### Cookie Consent Card
**Role:** Privacy compliance overlay

Rectangular card, black (#000000) background, white text, rounded corners (~12px). Title 'Cookie Settings' in PolySans Median 700 at ~16px. Body copy in PolySans Neutral 400 at 14px with 1.5 line-height. Contains two buttons: a ghost 'Reject' (dark surface, white text) and a filled pink 'Accept' (#ff3d9e). Fixed-position bottom-right.

### App Store Download Badge Pair
**Role:** App download CTAs

Two standard dark (#000000) pill-shaped badges side by side: 'Download on the App Store' and 'GET IT ON Google Play'. Rounded corners, white logo + text. Padding approximately 8px 16px. Serve as secondary download action below the primary pink CTA in the hero.

### Trust Indicator Strip
**Role:** Social proof band

Three-column horizontal layout with small monochrome icons (trophy/award, globe, shield) in circular outline containers (~32px). Each column has a bold heading in PolySans Median 600 (~16px) and lighter subtext in PolySans Neutral 400 (~14px). Separated by faint vertical or horizontal dividers. Functions as a credibility row between hero and content.

### Section Eyebrow Label
**Role:** Category label above section headings

All-caps, Volt Pink (#ff3d9e), PolySans Median weight 600, ~13–14px, letter-spacing 0.05em. Used as a small pink tag introducing each content section (e.g. 'REVOLUTIONIZING CONNECTION', 'EMPOWERMENT AND SELF-ESTEEM', 'JOY'). Sits directly above a larger dark heading.

### Display Headline
**Role:** Page-opener and section title

PolySans Bulky or PolySans Median at 72–86px, weight 700, line-height 0.85–1.0, black (#000000). Near-zero letter-spacing at large sizes. Examples: 'MEET YOUR PEOPLE NOW', 'OUR MISSION', 'OUR COMMUNITY'. All-caps with compressed leading is the signature.

### Feature Row (Mission section)
**Role:** Mission statement with heading + body

Two-column or single-column layout. Large black bold heading on left (PolySans Median 700, ~32–40px). Right column stacks: pink eyebrow label, then bold dark body statement (PolySans Median 600, ~16–18px), then regular body copy (PolySans Neutral 400, ~14–16px, 1.5 line-height). Generous vertical spacing between blocks.

### Phone Mockup Carousel
**Role:** Product showcase with tilted device images

Row of phone screenshots, each rotated at slight angles (-8° to +8°), overlapping with adjacent frames. The phones have large 24px border-radius, showing the dark-themed chat interface inside. Arranged horizontally across the page width, creating a fan-layout effect.

### Input Field
**Role:** Form input

Rounded rectangle, 12px border-radius, background #eeeeee (light gray fill), border 1px solid #444444 (charcoal). Placeholder and text in PolySans Median 400, ~14px. Subtle inset shadow optional. Dark border on light fill is distinctive — most sites use border-only with white fill.

### Ghost / Secondary Button
**Role:** Non-primary action

Dark fill (#000000 or #292929), white text, PolySans Median 400–600, 12px border-radius. Used for 'Reject' in cookie banner, and likely for secondary nav or modal actions. No border outline; relies on fill contrast.

## Do's and Don'ts

### Do
- Use Volt Pink (#ff3d9e) as the sole chromatic accent — for one primary action per view, for section eyebrow labels, and for the cookie Accept button. Never dilute it across multiple elements on the same screen.
- Set all-caps display headlines in PolySans Bulky or PolySans Median weight 700 at 72–86px with line-height 0.85–1.0 and near-zero letter-spacing. The compressed vertical rhythm is what makes the type feel editorial.
- Apply 999px border-radius to the floating navigation bar, news pills, and any tag/chip elements. Use 12px radius for buttons, cards, and inputs. Use 24px for image frames.
- Use black (#000000) for the floating nav surface, bold display text, and the cookie banner — and always pair it with white or pink text on top. This black-on-white framing is the system's structural backbone.
- Apply 0.05em letter-spacing to all-caps micro-labels and eyebrow text at 10–14px. This widens the optical density of the small type and makes the pink section labels feel deliberately stamped.
- Keep body copy in PolySans Neutral weight 400 at 16px with line-height 1.5 for reading comfort. Never use Median weights for paragraphs.
- Add the very faint shadow rgba(0,0,0,0.05) 0px 1px 10px to card surfaces and rgba(0,0,0,0.3) 0px 1px 30px to the primary CTA. These are the only two shadow depths in the system.

### Don't
- Never introduce a second accent color. The entire brand identity depends on pink being the only chromatic signal in a black-and-white field.
- Never use decorative gradients on UI elements. The hero gradient is the only allowed multi-color surface — everything else is flat solid fills.
- Never use drop shadows heavier than the two defined values. The system is intentionally flat; heavy elevation breaks the editorial feel.
- Don't use system sans-serif for headings. PolySans Median and Bulky are the identity — fall back to Inter or Manrope only if the custom fonts are unavailable.
- Never place body copy below 14px. The compact density is created through tight spacing, not through microscopic type.
- Don't use sharp corners (<5px radius) on any interactive element. Every button, input, card, and nav must have at least 12px or fully pill-shaped radius.
- Never use the pink accent on body text longer than a few words. Pink is for labels, buttons, and emphasis — not for paragraphs or descriptions.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Page Canvas | `#ffffff` | Default page background for all content sections |
| 1 | Input Fill | `#eeeeee` | Input field resting state |
| 2 | Input Border | `#444444` | Input field outline, secondary UI element borders |
| 3 | Hairline Surface | `#dadada` | Card inset rings, dividers, subtle framing |
| 4 | Elevated Surface | `#292929` | Secondary button fill, mid-elevation UI panels |
| 5 | Dark Surface | `#000000` | Floating navigation pill, cookie banner, bold text fills |
| 6 | Accent Surface | `#ff3d9` | Primary action button fill, active accent moments |

## Elevation

- **Primary CTA Button:** `rgba(0, 0, 0, 0.3) 0px 1px 30px 0px`
- **Cards and elevated content:** `rgba(0, 0, 0, 0.05) 0px 1px 10px 0px`
- **Card inset ring:** `rgb(218, 218, 218) 0px 0px 0px 1px inset`

## Imagery

Imagery is product-led and minimal. The primary visual asset is the phone mockup of the app's chat interface, shown in a fanned, tilted arrangement across a horizontal band — each device rotated at a slight angle, overlapping its neighbors, with large 24px radii. The chat screens themselves are dark-themed with pink/purple gradient backgrounds, reinforcing the brand palette. No lifestyle photography, no abstract illustrations, no stock imagery. The hero is a pure gradient field (lavender, sky blue, coral, amber) — no photos. User-generated content appears as faded, desaturated avatar tiles in the community section, receding behind the headline.

## Layout

Page is max-width 1200px centered, with a floating black pill navigation that hovers above the content. The hero is full-bleed, spanning the full viewport width with the multi-color gradient and a centered headline stack (eyebrow → huge display text → app download buttons). Below the hero, content alternates between white sections and faint gray dividers, all centered-aligned. The mission section uses a two-column pattern (large heading left, content right). The community section uses a full-width image band of tilted phone mockups, followed by a centered headline. Section gaps are generous (~80px). The overall rhythm is: loud gradient hero → quiet white content bands → loud product showcase band → quiet text section. Navigation is a single pill bar, sticky/floating. No sidebar, no mega-menu.

## Agent Prompt Guide

**Quick Color Reference**
- Text: #000000 (primary), #444444 (muted)
- Background: #ffffff (page), #000000 (dark surfaces), #eeeeee (input fill)
- Border: #dadada (hairline), #444444 (input)
- Accent: #ff3d9e (Volt Pink — eyebrow labels, emphasis)
- primary action: #ff3d9e (filled action)

**Example Component Prompts**

1. **Hero Section**: Full-bleed gradient background (lavender → coral → sky blue → amber). Centered stack: small black 'NEWS' pill at top, then 'MEET YOUR PEOPLE NOW' in PolySans Bulky 72px weight 700, color #000000, line-height 1.0, letter-spacing -0.72px. Below: two app store download badges side by side, each black (#000000) pill with white text and icon.

2. **Floating Navigation Bar**: Black (#000000) pill, 999px border-radius, max-width 1200px centered, padding 10px 20px. White Wizz logotype left, 5 nav links in white PolySans Median 14px weight 400 center, pink (#ff3d9e) 'Download' button (12px radius, 10px 20px padding) right.

3. **Section with Eyebrow Label**: White background, 80px vertical padding. Stack: pink (#ff3d9e) all-caps eyebrow 'REVOLUTIONIZING CONNECTION' in PolySans Median 600 at 13px, letter-spacing 0.05em. Below: bold body statement in PolySans Median 600 at 18px, color #000000. Below: paragraph in PolySans Neutral 400 at 16px, line-height 1.5, color #000000.

4. **Cookie Consent Card**: Fixed bottom-right, 320px wide. Black (#000000) background, 12px border-radius, padding 20px. Title 'Cookie Settings' in PolySans Median 700, 16px, white. Body in PolySans Neutral 400, 14px, white, line-height 1.5. Two buttons side by side: 'Reject' as dark ghost (#292929 fill, white text, 12px radius), 'Accept' as filled pink (#ff3d9e, white text, 12px radius).

5. **Phone Mockup Showcase Band**: White background, full-width row of 8–10 phone mockups. Each phone: 24px border-radius, rotated -8° to +8° alternating, slight overlap. Inside each phone: dark chat interface with pink/purple gradient. No shadows on phones; the rotation creates the visual energy.

## Gradient System

The hero gradient is the only multi-color surface in the design system and should not be replicated on other sections. It blends lavender (#a78bfa-ish), sky blue (#7dd3fc-ish), coral/peach (#fb923c-ish), and soft amber in a smooth, almost atmospheric field — resembling a sunset through frosted glass. The gradient runs diagonally from top-left lavender to bottom-right amber. This is the system's single moment of color abundance; everything else must remain black, white, and pink.

## Similar Brands

- **BeReal** — Same Gen-Z social app energy with a single vivid accent color (BeReal uses red-orange) against monochrome chrome, and the floating pill navigation pattern
- **Locket Widget** — Similar compact social-app landing page with large compressed display type, floating dark nav pill, and minimal product-led layout
- **Yubo** — Direct competitor in the young-audience social space; same hero-centric layout with one bright accent and phone mockup showcases
- **Threads (Meta)** — Same editorial-magazine approach to social app marketing: massive compressed headlines, single accent color, phone mockup carousels, and generous white space

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-volt-pink: #ff3d9e;
  --color-obsidian: #000000;
  --color-paper-white: #ffffff;
  --color-ash: #dadada;
  --color-charcoal: #444444;
  --color-onyx: #292929;
  --color-mist: #eeeeee;

  /* Typography — Font Families */
  --font-sans-serif: 'sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-polysans-bulky: 'PolySans Bulky', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-polysans-median: 'PolySans Median', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-polysans-neutral: 'PolySans Neutral', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-polysans-slim: 'PolySans Slim', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.5;
  --tracking-caption: 0.05px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.4;
  --text-subheading: 18px;
  --leading-subheading: 1.4;
  --text-display-xl: 72px;
  --leading-display-xl: 1;
  --text-display: 86px;
  --leading-display: 0.85;
  --tracking-display: -0.86px;

  /* Typography — Weights */
  --font-weight-light: 300;
  --font-weight-regular: 400;
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
  --spacing-48: 48px;
  --spacing-56: 56px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-88: 88px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 16px;
  --element-gap: 10px;

  /* Border Radius */
  --radius-md: 5px;
  --radius-xl: 12px;
  --radius-2xl: 20px;
  --radius-3xl: 24px;
  --radius-3xl-2: 45px;
  --radius-full: 999px;

  /* Named Radii */
  --radius-cards: 12px;
  --radius-icons: 5px;
  --radius-pills: 999px;
  --radius-images: 24px;
  --radius-inputs: 12px;
  --radius-buttons: 12px;

  /* Shadows */
  --shadow-md: rgba(0, 0, 0, 0.05) 0px 1px 10px 0px;
  --shadow-xl: rgba(0, 0, 0, 0.3) 0px 1px 30px 0px;
  --shadow-subtle: rgb(218, 218, 218) 0px 0px 0px 1px inset;

  /* Surfaces */
  --surface-page-canvas: #ffffff;
  --surface-input-fill: #eeeeee;
  --surface-input-border: #444444;
  --surface-hairline-surface: #dadada;
  --surface-elevated-surface: #292929;
  --surface-dark-surface: #000000;
  --surface-accent-surface: #ff3d9;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-volt-pink: #ff3d9e;
  --color-obsidian: #000000;
  --color-paper-white: #ffffff;
  --color-ash: #dadada;
  --color-charcoal: #444444;
  --color-onyx: #292929;
  --color-mist: #eeeeee;

  /* Typography */
  --font-sans-serif: 'sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-polysans-bulky: 'PolySans Bulky', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-polysans-median: 'PolySans Median', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-polysans-neutral: 'PolySans Neutral', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-polysans-slim: 'PolySans Slim', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.5;
  --tracking-caption: 0.05px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.4;
  --text-subheading: 18px;
  --leading-subheading: 1.4;
  --text-display-xl: 72px;
  --leading-display-xl: 1;
  --text-display: 86px;
  --leading-display: 0.85;
  --tracking-display: -0.86px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-48: 48px;
  --spacing-56: 56px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-88: 88px;

  /* Border Radius */
  --radius-md: 5px;
  --radius-xl: 12px;
  --radius-2xl: 20px;
  --radius-3xl: 24px;
  --radius-3xl-2: 45px;
  --radius-full: 999px;

  /* Shadows */
  --shadow-md: rgba(0, 0, 0, 0.05) 0px 1px 10px 0px;
  --shadow-xl: rgba(0, 0, 0, 0.3) 0px 1px 30px 0px;
  --shadow-subtle: rgb(218, 218, 218) 0px 0px 0px 1px inset;
}
```
