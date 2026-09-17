# Watch new Originals — Style Reference
> Cinematic void with electric spotlight. Picture a darkened theater lobby where a single cyan marquee light is the only chromatic thing in sight — everything else is monochrome depth leading the eye to the posters on the wall.

**Theme:** dark

Disney+ operates as a dark theatrical canvas: a near-black void ( #040714) where movie and series artwork is the protagonist, and UI chrome recedes into the periphery. The interface relies on extreme contrast (white #fafafa on near-black) and a single chromatic accent — electric cyan (#33ddff) — that functions as the only reason to look away from the content. Typography is a single custom sans-serif (Inspire) at modest sizes, with positive letter-spacing (0.025em) that gives even short labels a measured, premium cadence. The system is content-first: cards are poster-aspect tiles, sections are horizontal scroll rails, and the only elevated color decisions (cyan CTA fills, teal link text) exist to drive conversion, never decoration.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Midnight Canvas | `#040714` | `--color-midnight-canvas` | Page background, hero background, primary canvas — deep near-black navy that absorbs the eye and makes artwork pop |
| Abyss | `#010104` | `--color-abyss` | Deepest surface layer, navigation background — the near-pure black undercarriage beneath the canvas |
| Eclipse | `#0e0b14` | `--color-eclipse` | Footer background, alternate dark surface — slightly warmer dark for depth variation |
| Carbon | `#1e1f24` | `--color-carbon` | Elevated dark surface — used for cards or panels sitting above the canvas |
| Slate Veil | `#282a36` | `--color-slate-veil` | Neutral form states, badge text, and quiet UI feedback where color should stay understated. Do not promote it to the primary CTA color |
| Luminous | `#fafafa` | `--color-luminous` | Primary text, heading text, icon fills, link text, button labels — the dominant light element across the interface |
| Pearl | `#e5e7eb` | `--color-pearl` | Border color used at scale (hairs, dividers, card edges) — the structural skeleton of the UI |
| Mist | `#b7b8bd` | `--color-mist` | Body text, secondary text, helper copy — muted gray for non-primary reading |
| Fog | `#c0c0c0` | `--color-fog` | List text, icon fills, secondary metadata — the lightest level of secondary text |
| Deep Ink | `#02172a` | `--color-deep-ink` | Gray text accent for links, tags, and emphasized short phrases. Do not promote it to the primary CTA color |
| Onyx Label | `#17171c` | `--color-onyx-label` | Dark text for inverted or high-contrast button labels on light fills |
| Electric Cyan | `#33ddff` | `--color-electric-cyan` | Primary CTA buttons (SIGN UP NOW, plan tier cards) — the sole chromatic action color; neon-cyan against the void creates cinema-marquee urgency |
| Teal Pulse | `#02d6e8` | `--color-teal-pulse` | Accent text, promotional price highlights (€4.99), link emphasis, body emphasis — the slightly darker teal sibling used for inline chromatic moments that aren't buttons |

## Tokens — Typography

### Inspire — Sole typeface across the entire interface — headings, body, buttons, labels, nav. The single-font commitment is deliberate: it means Inspire must carry both 12px micro-labels and 40px display moments without losing character. Use 700 for headings, price, and emphasis; 400 for everything else. · `--font-inspire`
- **Substitute:** Inter, Helvetica Neue, Arial
- **Weights:** 400, 700
- **Sizes:** 12, 14, 16, 18, 20, 28, 40px
- **Line height:** 1.20, 1.38, 1.40, 1.50, 1.83
- **Letter spacing:** 0.0250em uniformly — this consistent positive tracking is the quiet signature of the type system, applied identically at 12px and 40px, creating a measured, premium rhythm
- **Role:** Sole typeface across the entire interface — headings, body, buttons, labels, nav. The single-font commitment is deliberate: it means Inspire must carry both 12px micro-labels and 40px display moments without losing character. Use 700 for headings, price, and emphasis; 400 for everything else.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.38 | 0.3px | `--text-caption` |
| body-sm | 14px | 1.5 | 0.35px | `--text-body-sm` |
| body | 16px | 1.5 | 0.4px | `--text-body` |
| subheading | 18px | 1.4 | 0.45px | `--text-subheading` |
| heading-sm | 20px | 1.4 | 0.5px | `--text-heading-sm` |
| heading | 28px | 1.2 | 0.7px | `--text-heading` |
| heading-lg | 40px | 1.2 | 1px | `--text-heading-lg` |

## Tokens — Spacing & Shapes

**Base unit:** 8px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 8 | 8px | `--spacing-8` |
| 16 | 16px | `--spacing-16` |
| 24 | 24px | `--spacing-24` |
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |

### Border Radius

| Element | Value |
|---------|-------|
| nav | 8px |
| cards | 12px |
| inputs | 8px |
| buttons | 12px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 48-64px
- **Card padding:** 16px
- **Element gap:** 8px

## Components

### Cyan CTA Button
**Role:** Primary conversion action — sign up, subscribe, plan selection

Fill: #33ddff (Electric Cyan). Text: #02172a (Deep Ink), Inspire 700, 14-16px, letter-spacing 0.4px. Padding: 12px 24px. Border-radius: 12px. No border, no shadow. The button is a flat slab of neon — its flatness is the point. The dark text on cyan fill creates inverted contrast against the void, making the button glow without elevation.

### Plan Tier Card
**Role:** Subscription option display (Standard with Ads, Standard, Premium)

Full-width cyan fill (#33ddff), padding ~24px vertical, border-radius 12px. Plan name in Inspire 700 at 16-18px, #02172a. Price in Inspire 700, ~20px, #02172a. Savings callout in Teal Pulse (#02d6e8) for emphasis. The entire card is the button — click target is the full card area, not a nested button.

### Email Input Field
**Role:** Newsletter / sign-up email capture

Background: transparent or #040714 canvas. Border: 1px solid #282a36 or #e5e7eb at low opacity. Border-radius: 8px. Padding: 12px 16px. Placeholder text: #b7b8bd. Text: #fafafa. Inspire 400, 16px. The input sits flush against the cyan CTA button — a dark-to-neon transition that frames the conversion moment.

### Content Tile Card
**Role:** Movie/series poster card in carousels and grids

No background fill — the poster artwork IS the card. Aspect ratio 2:3 (poster portrait). Border-radius: 12px. Minimal or no border. Optional rank number (1-10) overlaid top-left in Inspire 700 at ~40px, #33ddff or #fafafa. Metadata strip below poster: title in Inspire 700 14px #fafafa, genre/year in Inspire 400 12px #b7b8bd.

### Top 10 Ranked Card
**Role:** Hero content ranking with large numeral overlay

Portrait poster tile (2:3 aspect) with a large rank numeral (1-10) in Inspire 700, 40px, positioned overlapping the tile's top-left. Numeral is #33ddff (Electric Cyan) — the only chromatic moment in the content rail. Card has no border, no shadow, no background. The numeral is the badge.

### Feature Comparison Row
**Role:** Plan comparison table — concurrent streams, Dolby Atmos, ads, etc.

Row separator: 1px #e5e7eb at low opacity. Feature label left-aligned in Inspire 400, 16px, #fafafa. Values center-aligned per column. Checkmark icons in #fafafa for supported, #282a36 dash for unsupported. Column headers (plan names) in Inspire 700, 14-16px, #33ddff when active/highlighted. No card backgrounds — the table breathes against the canvas.

### Section Heading
**Role:** Content section title (e.g., 'Top 10 Today', 'Choose your plan', 'Watch the way you want')

Inspire 700, 28-40px, #fafafa, letter-spacing 0.7-1.0px. Center-aligned. No underline, no accent line. Optional subheading in Inspire 400, 18px, #b7b8bd, centered below. Generous space (40-64px) above the heading creates a quiet pause before the section content.

### Top Navigation Bar
**Role:** Primary site navigation

Background: #010104 (Abyss) or transparent over canvas. Border-bottom: 1px #6f717b at low opacity. Logo left. Links in Inspire 400, 14-16px, #fafafa. Login button right: border 1px #e5e7eb, text #fafafa, border-radius 8px, padding 8px 16px. No dropdown menus visible in primary nav — minimal chrome.

### Hero Pricing Banner
**Role:** Central conversion offer overlay on poster-grid background

Centered stack over darkened poster mosaic. Headline 'From' in Inspire 400 20px #fafafa. Price '€4.99' in Inspire 700 40px or larger, inside a cyan (#33ddff) rounded rectangle (border-radius 12px) as the visual anchor. Duration 'a month for 3 months' in Inspire 400 20px #fafafa. Deadline in Inspire 400 14px #b7b8bd. Email input + cyan CTA below.

### Ghost Outline Button
**Role:** Secondary action — 'View all plans', 'Learn more'

No fill (transparent or canvas-color background). Border: 1px solid #e5e7eb or #fafafa. Text: #fafafa, Inspire 400-700, 14-16px. Border-radius: 8-12px. Padding: 8px 16px to 12px 24px. Underline on text is common for text-link variants. This is the restrained sibling of the cyan CTA.

### Footer
**Role:** Legal links, fine print, bottom-of-page content

Background: #0e0b14 (Eclipse). Text: #b7b8bd and #c0c0c0, Inspire 400, 12-14px. Links are #fafafa with no underline by default, underline on hover. Separated from main content by visual padding (~48px) rather than a hard border.

### Promotional Price Highlight
**Role:** Strikethrough or savings callout in pricing contexts

Savings text ('Save €2.00 per month') in Teal Pulse (#02d6e8), Inspire 400, 14-16px. The teal (not cyan) placement is deliberate — teal reads as informational emphasis, while cyan is reserved for action. This creates a two-tier chromatic hierarchy: cyan = act, teal = inform.

## Do's and Don'ts

### Do
- Use #33ddff (Electric Cyan) exclusively for filled CTA buttons and active plan tier cards — no other fills should carry this color
- Keep all text on the dark canvas in #fafafa for primary, #b7b8bd for secondary, #c0c0c0 for tertiary — never use a chromatic color for body text
- Use Teal Pulse (#02d6e8) for inline emphasis, savings callouts, and informational highlights — not for buttons
- Apply Inspire at all sizes with the same 0.025em letter-spacing — do not tighten tracking on display sizes
- Use 12px border-radius for all buttons and content cards; 8px for inputs and nav elements
- Let poster artwork occupy the full card area — never wrap posters in visible card frames, borders, or shadows
- Center-align section headings and let generous 48-64px vertical space create the cadence between content rails

### Don't
- Do not introduce additional accent colors — the system is monochrome with one cyan and one teal; any other chromatic is off-system
- Do not apply box-shadows to cards, buttons, or content tiles — the design uses flat color and borders for structure, not elevation
- Do not use cyan (#33ddff) for non-action text, icons, or decorative elements — reserve it strictly for filled buttons
- Do not override the positive letter-spacing on large headings — 0.025em at 40px produces 1px tracking, which is the intended whisper-not-shout scale
- Do not place light text on cyan fills without testing contrast — use #02172a (Deep Ink) for dark text on cyan, not #17171c or pure black
- Do not add background fills to content poster cards — the artwork is the card; adding a frame reduces the cinematic effect
- Do not use a secondary typeface for display or hero moments — Inspire carries the full type scale, from 12px captions to 40px headings

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Abyss | `#010104` | Deepest background, navigation chrome |
| 1 | Midnight Canvas | `#040714` | Primary page and hero background |
| 2 | Eclipse | `#0e0b14` | Footer and alternate dark bands |
| 3 | Carbon | `#1e1f24` | Elevated cards and panels above the canvas |
| 4 | Slate Veil | `#282a36` | Input fields and border-defined surfaces |

## Elevation

The design is deliberately flat — no box-shadows, no drop-shadows, no glow effects on any component. Structure is communicated through color contrast, hairline borders (#e5e7eb at low opacity), and background surface layering (5 dark levels from #010104 to #282a36). The cyan CTA buttons are flat neon slabs, not raised elements. Content poster cards have no elevation because the poster artwork is the visual elevation. This flatness is a cinema-theater metaphor: the audience looks at the screen, not at the frame around it.

## Imagery

The visual language is overwhelmingly content-as-imagery: movie and series poster artwork dominates the interface at full poster-aspect (2:3) tiles arranged in horizontal scroll rails. There is no lifestyle photography, no abstract illustration, no 3D render — the content library IS the visual design. Posters are presented as raw artwork with rounded corners (12px) and no frames, shadows, or overlays beyond a large cyan rank numeral for Top 10 items. Icons are minimal and monochromatic (white line/fill on dark), appearing only for checkmarks, navigation, and utility controls. The hero section uses the poster grid itself as a darkened photographic background — blurred/dimmed tiles create atmospheric depth behind the centered pricing offer. No decorative gradients, no illustrative flourishes, no product UI screenshots. The entire visual system defers to the licensed content, treating UI chrome as a dark theater shell around the artwork.

## Layout

Full-bleed dark canvas with content arranged in horizontal scroll rails (poster carousels) stacked vertically. Hero section: poster-grid background dimmed to near-black, with a centered pricing/email-capture block floating in the middle third. Content sections: 'Top 10 Today' is a horizontal row of 6-7 poster tiles with large cyan rank numerals, scrollable. Plan selection: three equal-width cyan tier cards arranged in a centered row. Feature comparison: full-width table with left-aligned feature labels and center-aligned column values. All content sits within a max-width of ~1200px, centered, with generous 48-64px gaps between sections. Navigation is a minimal top bar with logo left and login right. The page rhythm is: hero → content rail → plan selection → comparison table → device-agnostic CTA → footer, with each section separated by vertical breathing room rather than visual dividers.

## Agent Prompt Guide

**Quick Color Reference**
- text (primary): #fafafa
- text (secondary): #b7b8bd
- background (canvas): #040714
- border / hairline: #e5e7eb
- accent (informational emphasis): #02d6e8
- primary action: #33ddff (filled action)

**Example Component Prompts**

1. Create a Primary Action Button: #33ddff background, #17171c text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.

2. **Plan Tier Card**: Full-width card with fill #33ddff, border-radius 12px, padding 24px. Plan name in Inspire 700 at 18px, color #02172a. Price in Inspire 700 at 20px, color #02172a. Savings line in #02d6e8, Inspire 400, 14px.

3. **Content Poster Tile**: No background, no border, no shadow. Poster artwork fills a 2:3 portrait frame with border-radius 12px. Rank numeral overlaid top-left in Inspire 700, 40px, color #33ddff. Title below in Inspire 700, 14px, #fafafa. Genre/year in Inspire 400, 12px, #b7b8bd.


5. **Section Heading + Subheading**: Inspire 700, 28px, #fafafa, letter-spacing 0.7px, center-aligned. Subheading below: Inspire 400, 18px, #b7b8bd, center-aligned. 64px space above heading, 24px gap to content below.

## Chromatic Hierarchy

The system enforces a strict two-tier chromatic discipline:

- **Cyan (#33ddff)** = ACTION. Used only for filled buttons and active/highlighted plan cards. When a user sees cyan, it must be clickable or currently selected.
- **Teal (#02d6e8)** = INFORMATION. Used for savings amounts, emphasis text, and inline highlights that are read but not clicked.

No other color should appear as a fill, stroke, or text color in the interface. This creates a visual contract: cyan = do, teal = know. If you need a third state (error, success, warning), use neutral grays and iconography rather than introducing new chromatic colors — the system intentionally does not use semantic color coding.

## Similar Brands

- **Netflix** — Same dark-canvas cinematic approach, content-as-imagery with poster tiles, single-brand accent color for CTAs, and minimal UI chrome that defers to artwork
- **HBO Max** — Identical near-black canvas, horizontally scrolling content rails, white typography on dark, and flat color-block CTAs without shadow elevation
- **Apple TV+** — Same dark-theater aesthetic, generous negative space between content sections, and the strategy of letting licensed content carry the visual weight while UI stays monochrome
- **Prime Video** — Dark-mode streaming interface with a single chromatic accent (Prime's signature blue-cyan), content poster grids, and flat non-elevated card design
- **Crunchyroll** — Dark canvas with vibrant accent for CTAs, poster-tile carousels for anime content, and flat component design that prioritizes artwork visibility

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-midnight-canvas: #040714;
  --color-abyss: #010104;
  --color-eclipse: #0e0b14;
  --color-carbon: #1e1f24;
  --color-slate-veil: #282a36;
  --color-luminous: #fafafa;
  --color-pearl: #e5e7eb;
  --color-mist: #b7b8bd;
  --color-fog: #c0c0c0;
  --color-deep-ink: #02172a;
  --color-onyx-label: #17171c;
  --color-electric-cyan: #33ddff;
  --color-teal-pulse: #02d6e8;

  /* Typography — Font Families */
  --font-inspire: 'Inspire', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.38;
  --tracking-caption: 0.3px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.5;
  --tracking-body-sm: 0.35px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: 0.4px;
  --text-subheading: 18px;
  --leading-subheading: 1.4;
  --tracking-subheading: 0.45px;
  --text-heading-sm: 20px;
  --leading-heading-sm: 1.4;
  --tracking-heading-sm: 0.5px;
  --text-heading: 28px;
  --leading-heading: 1.2;
  --tracking-heading: 0.7px;
  --text-heading-lg: 40px;
  --leading-heading-lg: 1.2;
  --tracking-heading-lg: 1px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-unit: 8px;
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-40: 40px;
  --spacing-48: 48px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 48-64px;
  --card-padding: 16px;
  --element-gap: 8px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-xl: 12px;

  /* Named Radii */
  --radius-nav: 8px;
  --radius-cards: 12px;
  --radius-inputs: 8px;
  --radius-buttons: 12px;

  /* Surfaces */
  --surface-abyss: #010104;
  --surface-midnight-canvas: #040714;
  --surface-eclipse: #0e0b14;
  --surface-carbon: #1e1f24;
  --surface-slate-veil: #282a36;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-midnight-canvas: #040714;
  --color-abyss: #010104;
  --color-eclipse: #0e0b14;
  --color-carbon: #1e1f24;
  --color-slate-veil: #282a36;
  --color-luminous: #fafafa;
  --color-pearl: #e5e7eb;
  --color-mist: #b7b8bd;
  --color-fog: #c0c0c0;
  --color-deep-ink: #02172a;
  --color-onyx-label: #17171c;
  --color-electric-cyan: #33ddff;
  --color-teal-pulse: #02d6e8;

  /* Typography */
  --font-inspire: 'Inspire', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.38;
  --tracking-caption: 0.3px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.5;
  --tracking-body-sm: 0.35px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: 0.4px;
  --text-subheading: 18px;
  --leading-subheading: 1.4;
  --tracking-subheading: 0.45px;
  --text-heading-sm: 20px;
  --leading-heading-sm: 1.4;
  --tracking-heading-sm: 0.5px;
  --text-heading: 28px;
  --leading-heading: 1.2;
  --tracking-heading: 0.7px;
  --text-heading-lg: 40px;
  --leading-heading-lg: 1.2;
  --tracking-heading-lg: 1px;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-40: 40px;
  --spacing-48: 48px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-xl: 12px;
}
```
