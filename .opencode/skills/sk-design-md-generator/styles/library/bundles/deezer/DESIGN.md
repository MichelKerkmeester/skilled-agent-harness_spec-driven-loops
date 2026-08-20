# Deezer — Style Reference
> Festival poster meets dark arena

**Theme:** mixed

Deezer's visual system is a dramatic concert-poster language: a sunlit white hero dominated by a single ultra-condensed display headline, followed by dark arena sections where content floats on light card surfaces against near-black backgrounds. Typography carries the entire brand voice — a custom 700-800 weight display face with absurdly tight line-heights (0.71–0.90) that makes the hero feel like a music festival flyer, not a SaaS page. One vivid violet (#a238ff) is the only chromatic note across the system, used with discipline: filled CTAs, pill badges, and the top promotional banner. The palette is otherwise near-monochrome — stark black on white for the hero, near-black with white text for the lower arena, and a single soft lilac for subtle washes. Components are light, flat, and confident: pill-shaped buttons, thin dividers, no decorative shadows, no gradients. The rhythm alternates light/dark bands vertically to create contrast between marketing drama and product clarity.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Paper White | `#fdfcfe` | `--color-paper-white` | Page and hero backgrounds, card surfaces floating on dark sections, light theme canvas |
| Carbon Black | `#0f0d13` | `--color-carbon-black` | Dark section backgrounds, navigation bar, inverse canvas, pricing and FAQ arena |
| Pure Black | `#000000` | `--color-pure-black` | Display headline text on light surfaces, icon fills, maximum-contrast text |
| Ink Black | `#191922` | `--color-ink-black` | Button text on light pill surfaces, subtle text on cards |
| Graphite | `#555257` | `--color-graphite` | Secondary text, subdued meta labels, footer body copy |
| Fog Gray | `#a9a6aa` | `--color-fog-gray` | Muted body text, helper text, low-emphasis labels on light surfaces |
| Steel Gray | `#6f6d71` | `--color-steel-gray` | Subdued headings, section sub-labels, de-emphasized display elements |
| Pearl Gray | `#d1d1d7` | `--color-pearl-gray` | Hairline borders, thin dividers, subtle separators on cards |
| Signal Violet | `#a238ff` | `--color-signal-violet` | Violet supporting accent for decorative details and low-frequency emphasis. Do not promote it to the primary CTA color |
| Lilac Wash | `#d09aff` | `--color-lilac-wash` | Soft violet tint for decorative washes, the banner background fill, and subtle highlight surfaces adjacent to Signal Violet elements |

## Tokens — Typography

### Deezer Brand (custom condensed display) — All display and heading sizes from 24px upward — the hero headline at 140px with line-height 0.71 is the signature moment, creating a compressed poster-stack effect. Subheading pill labels and small display accents use the 18–19px size with weight 700. The 700 weight carries subheadings and badges; 800 is reserved for the largest display type where the extra weight prevents the condensed letterforms from looking thin at 120–140px. Letter-spacing is consistently positive (0.0020em–0.0130em) — unusual for display type, which compensates for the tight line-heights by keeping glyphs from feeling cramped. · `--font-deezer-brand-custom-condensed-display`
- **Substitute:** Anton, Oswald, or Bebas Neue (all condensed 700-800 weight display faces that approximate the compressed poster aesthetic)
- **Weights:** 700, 800
- **Sizes:** 24, 35, 46, 56, 120, 140px
- **Line height:** 0.71–1.20
- **Letter spacing:** +0.28px at 140px, +0.48px at 120px, +0.10px at 24px, +0.16px at 18px
- **Role:** All display and heading sizes from 24px upward — the hero headline at 140px with line-height 0.71 is the signature moment, creating a compressed poster-stack effect. Subheading pill labels and small display accents use the 18–19px size with weight 700. The 700 weight carries subheadings and badges; 800 is reserved for the largest display type where the extra weight prevents the condensed letterforms from looking thin at 120–140px. Letter-spacing is consistently positive (0.0020em–0.0130em) — unusual for display type, which compensates for the tight line-heights by keeping glyphs from feeling cramped.

### Inter — Body, UI controls, navigation, buttons, and small labels. Weight 400 is the default body; 500 appears in button labels and nav links; 600 is used for emphasized body and small headings; 700 for strong UI emphasis. Normal letter-spacing. Inter acts as the quiet functional partner to the display face — same brand family voice, but geometric and readable at small sizes where the condensed display would be illegible. · `--font-inter`
- **Substitute:** Inter is freely available on Google Fonts
- **Weights:** 400, 500, 600, 700
- **Sizes:** 12, 14, 16, 20px
- **Line height:** 1.20–1.79
- **Letter spacing:** normal
- **Role:** Body, UI controls, navigation, buttons, and small labels. Weight 400 is the default body; 500 appears in button labels and nav links; 600 is used for emphasized body and small headings; 700 for strong UI emphasis. Normal letter-spacing. Inter acts as the quiet functional partner to the display face — same brand family voice, but geometric and readable at small sizes where the condensed display would be illegible.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 18 | 0.16px | `--text-caption` |
| body-sm | 14px | 21 | — | `--text-body-sm` |
| body | 16px | 24 | — | `--text-body` |
| subheading | 20px | 27 | — | `--text-subheading` |
| heading-sm | 24px | 29 | 0.1px | `--text-heading-sm` |
| heading | 35px | 32 | 0.18px | `--text-heading` |
| heading-lg | 56px | 67 | 0.11px | `--text-heading-lg` |
| display | 120px | 108 | 0.48px | `--text-display` |
| display-xl | 140px | 99 | 0.28px | `--text-display-xl` |

## Tokens — Spacing & Shapes

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 7 | 7px | `--spacing-7` |
| 8 | 8px | `--spacing-8` |
| 9 | 9px | `--spacing-9` |
| 10 | 10px | `--spacing-10` |
| 14 | 14px | `--spacing-14` |
| 15 | 15px | `--spacing-15` |
| 16 | 16px | `--spacing-16` |
| 20 | 20px | `--spacing-20` |
| 24 | 24px | `--spacing-24` |
| 25 | 25px | `--spacing-25` |
| 28 | 28px | `--spacing-28` |
| 32 | 32px | `--spacing-32` |
| 56 | 56px | `--spacing-56` |
| 112 | 112px | `--spacing-112` |
| 140 | 140px | `--spacing-140` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 8px |
| badges | 12px |
| images | 12px |
| buttons | 12px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 96px
- **Card padding:** 32px
- **Element gap:** 14px

## Components

### Primary Filled Button
**Role:** Main call-to-action across the site — hero sign-up, pricing card conversion, banner prompt

Background #a238ff, text #fdfcfe, Inter weight 500 at 16px. Border-radius 12px (pill-soft, not fully rounded). Padding 14px 28px. No border, no shadow. Sits flat against the canvas — the violet fill does all the visual work.

### Outlined Light Button
**Role:** Secondary action in the dark navigation bar (Sign up adjacent to Log in)

Transparent background, 1px border #555257, text #fdfcfe, Inter weight 500 at 16px. Border-radius 12px. Padding 14px 24px. Ghost aesthetic — present but unobtrusive next to the filled primary.

### Ghost Text Link Button
**Role:** Navigation items (Plans, Features, Music) and inline text actions

No background, no border, text #fdfcfe on dark nav or #0f0d13 on light sections. Inter weight 500 at 16px. No padding, no radius. Relies on text color contrast alone.

### OnLight Filled Button
**Role:** Standalone action on light hero surface (the 'Try for free' below the hero headline)

Background #a238ff, text #fdfcfe, Inter weight 500 at 16px. Same dimensions as Primary Filled Button. Sits alone centered beneath the display type — no competing controls.

### Pricing Tier Card
**Role:** Premium plan offer card floating on the dark pricing section

Background #fdfcfe, no shadow, no border. Border-radius 8px. Padding 32px. Centered text alignment. Contains a Premium badge at the top, large display price text (Deezer Brand 46px), a filled violet button, and a checklist of features below.

### Premium Pill Badge
**Role:** Plan label floating above the pricing card headline

Background #a238ff, text #fdfcfe, Deezer Brand weight 700 at 18px. Border-radius 12px. Padding 7px 16px. All-caps tracking. The only place a small dose of the display font meets the brand color.

### Top Promotional Banner
**Role:** Slim full-width announcement bar (e.g. 'Live the music with Deezer')

Background #d09aff (lilac wash), text #0f0d13 weight 600 at 16px. Diamond icon on the left in #a238ff. Pill-shaped 'Try for free' button on the right in #0f0d13 with white text. Padding 12px 24px. Sits at the very top of dark sections.

### FAQ Accordion Item
**Role:** Expandable question/answer rows in the FAQ section

No background card — text sits directly on the dark section. Question text: #fdfcfe, Deezer Brand weight 700 at 19–24px. Answer text: #fdfcfe at 16px Inter weight 400. Chevron icon on the right (#a9a6aa) indicates expand state. Thin #555257 bottom border separates items.

### Star Rating Strip
**Role:** Social proof below the hero CTA

5 solid black stars (SVG fill #000000) in a horizontal row, centered. Subtitle text below: #0f0d13 Inter weight 400 at 16px. Minimal — the stars and one line of text, nothing else.

### Navigation Bar
**Role:** Sticky top header across all pages

Background #0f0d13, full-width, horizontal flex layout. Left: Deezer logo (violet diamond + 'DEEZER' wordmark in white). Center-right: ghost text links (Plans, Features, Music). Right: outlined 'Log in' button + filled 'Sign up' button. Padding 16px horizontal. Height approximately 64px.

### Feature Check List
**Role:** Feature bullet points inside the pricing card

Each row: small #a238ff checkmark icon, then #0f0d13 text at 16px Inter weight 400. Row gap 10px. Left-aligned. No bullet markers — the colored checkmark is the only visual indicator.

### Secondary Surface Button (Discover All Plans)
**Role:** Tertiary action below the pricing card

Background #fdfcfe, text #0f0d13, Inter weight 500 at 16px. Border-radius 12px. Padding 14px 28px. Appears on the dark section as a white pill — inverse of the primary violet button, signaling secondary action.

## Do's and Don'ts

### Do
- Use #a238ff exclusively for filled primary buttons, badge pills, and the logo mark — never as a text color or background fill for large surfaces
- Set hero and display headings in Deezer Brand weight 800 with line-height 0.71–0.90 to preserve the compressed poster-stack effect
- Alternate sections between #fdfcfe light and #0f0d13 dark backgrounds to create the concert-poster contrast rhythm
- Set button border-radius to 12px and card border-radius to 8px — the 4px gap between these two values is the system's geometric signature
- Use Inter for all body, UI, and button text at 12–20px — the display face is not legible below 24px
- Keep components flat: no shadows, no gradients, no decorative borders beyond 1px hairlines in #555257 or #d1d1d7
- Center-align hero and section-level content; left-align only inside cards and list items

### Don't
- Do not use a line-height above 1.00 on any Deezer Brand display text — it destroys the condensed poster character
- Do not introduce additional accent colors beyond #a238ff and #d09aff — the monochrome-plus-one-violet system IS the brand
- Do not apply shadows to cards or buttons — the system relies on surface contrast (white on black) for elevation, not depth
- Do not use the display font below 18px — switch to Inter at 14–16px for any text under a subheading
- Do not stretch the display font or set it in weight 400 — the condensed geometry requires 700+ to maintain stroke weight at large sizes
- Do not use #a238ff for body text, links, or decorative backgrounds larger than a button — the violet should feel like a small electric pulse, not a wash
- Do not mix light and dark surfaces within a single section — the system commits to one canvas per band

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Paper White | `#fdfcfe` | Light hero background, the topmost surface tier |
| 2 | Carbon Black | `#0f0d13` | Dark section backgrounds, inverse canvas for pricing and FAQ |

## Imagery

The site is almost entirely typography-driven. The hero uses zero imagery — a massive display headline does all the visual work. The only graphic element is a small diamond/sparkle icon in the top promotional banner and the Deezer logo mark. No photography, no product screenshots, no illustration. The only 'visual' outside of type is the 5-star rating row (solid black SVG stars). This is a deliberate choice: the system trusts the display face and the violet accent to create atmosphere without photographic support, positioning the brand as confident and editorial rather than lifestyle-oriented.

## Layout

Centered, max-width 1200px container with full-width dark or light section bands. The hero is a single centered text stack: massive display headline (three lines, stacked tight), subtitle, filled button, star rating — all vertically centered with generous vertical padding. Below the hero, the page alternates into full-bleed dark bands (#0f0d13) containing centered content: a single pricing card (max-width ~420px, white surface floating on black), then an FAQ section with centered heading and left-aligned accordion items (max-width ~800px). The nav is sticky at the top, dark. Section gaps are large (96px+) to let the display type breathe. No multi-column grids, no sidebars, no asymmetric layouts — everything is a centered vertical stack.

## Agent Prompt Guide

**Quick Color Reference**
- text (on light): #000000
- text (on dark): #fdfcfe
- background (light surface): #fdfcfe
- background (dark surface): #0f0d13
- border / divider: #d1d1d7 (on light) or #555257 (on dark)
- accent / brand: #a238ff
- soft accent wash: #d09aff
- primary action: no distinct CTA color

**Example Component Prompts**

1. **Hero Section**: White background (#fdfcfe), full viewport height. Centered headline in Deezer Brand substitute (Bebas Neue) weight 800 at 140px, #000000, line-height 0.71, letter-spacing +0.28px. Below: subtitle in Inter weight 500 at 20px, #0f0d13. Below: a filled button — #a238ff background, #fdfcfe text, Inter 500 at 16px, border-radius 12px, padding 14px 28px. Below: 5 solid black star SVGs in a row, then 'Over 3 million 5-star ratings' in Inter 400 at 16px, #0f0d13. All elements center-aligned.

2. **Pricing Card on Dark Section**: Dark background (#0f0d13), full-width band. Centered: Deezer Brand substitute weight 700 at 46px in #fdfcfe, 'Choose the offer that works for you'. Below: a white card (#fdfcfe, border-radius 8px, padding 32px, max-width 420px). Inside card: a purple badge pill (#a238ff, #fdfcfe text, Deezer Brand 700 at 18px, border-radius 12px, padding 7px 16px). Below: Deezer Brand 800 at 35px, #0f0d13. Below: Inter 400 at 16px, #555257. Below: filled button (#a238ff, #fdfcfe, Inter 500 16px, 12px radius, 14px 28px). Below: feature list — #a238ff checkmark + #0f0d13 text at 16px Inter 400, row gap 10px.

3. **Navigation Bar**: Sticky top, background #0f0d13, padding 16px horizontal. Left: #a238ff diamond icon + 'DEEZER' wordmark in #fdfcfe Inter 700 at 16px. Right side: three ghost links ('Plans', 'Features', 'Music') in #fdfcfe Inter 500 at 16px, then an outlined button ('Log in' — transparent bg, 1px #555257 border, #fdfcfe text, 12px radius, 14px 24px padding), then a filled button ('Sign up' — #a238ff bg, #fdfcfe text, 12px radius).

4. **Top Promotional Banner**: Full-width, background #d09aff, padding 12px 24px. Left: small #a238ff diamond icon + 'Live the music with Deezer' in Inter 600 at 16px, #0f0d13. Right: pill button ('Try for free' — #0f0d13 bg, #fdfcfe text, Inter 500 at 14px, 12px radius). Use flexbox with space-between.

5. **FAQ Accordion Item**: On dark section (#0f0d13), no card background. Question in Deezer Brand substitute weight 700 at 24px, #fdfcfe. Answer in Inter 400 at 16px, #fdfcfe. Right-aligned chevron icon in #a9a6aa. Thin #555257 1px bottom border, padding 24px 0 between items.

## Typography Philosophy

The Deezer Brand display face is the single most important asset in the system. Its ultra-condensed proportions and tight line-heights (0.71 at 140px) create a stacked-poster effect where the headline reads as a visual block, not a line of text. This is fundamentally different from typical SaaS hero patterns that use 1.0–1.2 line-heights on sans-serif display faces. Any attempt to 'improve' the line-height for readability would destroy the brand character. Inter serves as the functional substrate — the voice you'd hear if the display face were the announcer. The two-font pairing works because they share a geometric, humanist DNA, but operate at different scales of attention: the display face demands you stop and look, Inter supports you while you read.

## Color Discipline

The system uses exactly one chromatic color: #a238ff Signal Violet. Every other color is achromatic — white, black, and six gray steps for text hierarchy and borders. This is not a minimal palette by accident; it is minimal by conviction. The violet functions as a single electric pulse in an otherwise dark room. When you see it, you act. This is why the role assignments are narrow: filled button backgrounds, badge pills, the logo mark, and the top banner. Nothing else. The softer #d09aff Lilac Wash exists only as a companion tone for the banner — it dilutes the violet just enough to create a comfortable announcement bar without competing with the primary brand color.

## Similar Brands

- **Spotify** — Same music-streaming category with a near-black arena aesthetic, though Spotify uses green where Deezer uses violet; both rely on a single accent color against a dark canvas
- **SoundCloud** — Dark-mode music platform with a single vivid accent color (orange) and flat, type-driven hero sections without photography
- **Tidal** — Music streaming with dramatic display typography and a minimalist black-canvas approach; shares the editorial-poster sensibility
- **Apple Music** — Bold typographic system with a single brand color accent, ultra-condensed display type in marketing surfaces, and a light-on-light hero pattern
- **Linear** — Centered single-column layouts, dramatic display headlines, monochrome palette with one vivid accent, and flat components without decorative shadows

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-paper-white: #fdfcfe;
  --color-carbon-black: #0f0d13;
  --color-pure-black: #000000;
  --color-ink-black: #191922;
  --color-graphite: #555257;
  --color-fog-gray: #a9a6aa;
  --color-steel-gray: #6f6d71;
  --color-pearl-gray: #d1d1d7;
  --color-signal-violet: #a238ff;
  --color-lilac-wash: #d09aff;

  /* Typography — Font Families */
  --font-deezer-brand-custom-condensed-display: 'Deezer Brand (custom condensed display)', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 18;
  --tracking-caption: 0.16px;
  --text-body-sm: 14px;
  --leading-body-sm: 21;
  --text-body: 16px;
  --leading-body: 24;
  --text-subheading: 20px;
  --leading-subheading: 27;
  --text-heading-sm: 24px;
  --leading-heading-sm: 29;
  --tracking-heading-sm: 0.1px;
  --text-heading: 35px;
  --leading-heading: 32;
  --tracking-heading: 0.18px;
  --text-heading-lg: 56px;
  --leading-heading-lg: 67;
  --tracking-heading-lg: 0.11px;
  --text-display: 120px;
  --leading-display: 108;
  --tracking-display: 0.48px;
  --text-display-xl: 140px;
  --leading-display-xl: 99;
  --tracking-display-xl: 0.28px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
  --font-weight-extrabold: 800;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-7: 7px;
  --spacing-8: 8px;
  --spacing-9: 9px;
  --spacing-10: 10px;
  --spacing-14: 14px;
  --spacing-15: 15px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-25: 25px;
  --spacing-28: 28px;
  --spacing-32: 32px;
  --spacing-56: 56px;
  --spacing-112: 112px;
  --spacing-140: 140px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 96px;
  --card-padding: 32px;
  --element-gap: 14px;

  /* Border Radius */
  --radius-sm: 3px;
  --radius-lg: 8px;
  --radius-xl: 12px;

  /* Named Radii */
  --radius-cards: 8px;
  --radius-badges: 12px;
  --radius-images: 12px;
  --radius-buttons: 12px;

  /* Surfaces */
  --surface-paper-white: #fdfcfe;
  --surface-carbon-black: #0f0d13;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-paper-white: #fdfcfe;
  --color-carbon-black: #0f0d13;
  --color-pure-black: #000000;
  --color-ink-black: #191922;
  --color-graphite: #555257;
  --color-fog-gray: #a9a6aa;
  --color-steel-gray: #6f6d71;
  --color-pearl-gray: #d1d1d7;
  --color-signal-violet: #a238ff;
  --color-lilac-wash: #d09aff;

  /* Typography */
  --font-deezer-brand-custom-condensed-display: 'Deezer Brand (custom condensed display)', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 18;
  --tracking-caption: 0.16px;
  --text-body-sm: 14px;
  --leading-body-sm: 21;
  --text-body: 16px;
  --leading-body: 24;
  --text-subheading: 20px;
  --leading-subheading: 27;
  --text-heading-sm: 24px;
  --leading-heading-sm: 29;
  --tracking-heading-sm: 0.1px;
  --text-heading: 35px;
  --leading-heading: 32;
  --tracking-heading: 0.18px;
  --text-heading-lg: 56px;
  --leading-heading-lg: 67;
  --tracking-heading-lg: 0.11px;
  --text-display: 120px;
  --leading-display: 108;
  --tracking-display: 0.48px;
  --text-display-xl: 140px;
  --leading-display-xl: 99;
  --tracking-display-xl: 0.28px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-7: 7px;
  --spacing-8: 8px;
  --spacing-9: 9px;
  --spacing-10: 10px;
  --spacing-14: 14px;
  --spacing-15: 15px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-25: 25px;
  --spacing-28: 28px;
  --spacing-32: 32px;
  --spacing-56: 56px;
  --spacing-112: 112px;
  --spacing-140: 140px;

  /* Border Radius */
  --radius-sm: 3px;
  --radius-lg: 8px;
  --radius-xl: 12px;
}
```
