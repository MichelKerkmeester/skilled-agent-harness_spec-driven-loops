# Scheduling — Style Reference
> Editorial ink on cream paper

**Theme:** light

GlossGenius operates in a near-monochrome editorial register: a warm-black ink (#17150e) stamped onto white and a faint mint-cream (#f0f7f6) canvas, with a single chartreuse-yellow (#cccc25) that functions like a highlighter pen — appearing sparingly on primary CTAs, metric callouts, and decorative washes. The typography is the brand's loudest element: a custom Basel pairing where the grotesque Grotesk handles UI and body while Classic — a sharper, slightly serifed display face — drops in only at 96–144px for editorial statements, tightened to 0.8–0.95 line-height so letterforms stack like vinyl. Components are deliberately lightweight: flat 8px-radius cards, no shadows, pill-shaped buttons at 1440px, and 1.5px hairline dividers. Sections breathe generously (80–120px gaps) and alternate between pure white and the mint tint, creating the cadence of a magazine spread rather than a product dashboard.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Gloss Black | `#17150e` | `--color-gloss-black` | Primary text, dark card surfaces, footer background, pill button fill — a warm near-black that reads softer than pure #000 and makes the large display type feel printed rather than digital; 1.5px borders and dividers — uses the same warm-black as text to keep all structural lines tonally unified |
| Gloss White | `#f0f7f6` | `--color-gloss-white` | Page tint sections, card surfaces, badge fills, button text on dark — a barely-green-tinted off-white that warms the interface and creates gentle contrast bands against pure white |
| Pure White | `#ffffff` | `--color-pure-white` | Primary page canvas, card surface, dark-button text, nav link color — used wherever maximum contrast is needed without any color temperature |
| Solar Yellow | `linear-gradient(180deg, #cccc25, #cacd78)` | `--color-solar-yellow` | Yellow action color for filled buttons, selected navigation states, and focused conversion moments; Soft yellow-to-pale-yellow gradient used as decorative wash behind hero copy and section transitions |
| Soft Charcoal | `#272b30` | `--color-soft-charcoal` | Secondary dark surface, deep section backgrounds — cooler alternative to Gloss Black for variant cards and panels |
| Mid Grey | `#949494` | `--color-mid-grey` | Muted helper text, secondary labels — reserved for non-essential copy where readability is still required |
| Light Coral | `#ff7780` | `--color-light-coral` | Accent tint for decorative illustrations and marketing gradient washes — never used for UI states |
| Apricot | `#ffe5d6` | `--color-apricot` | Soft accent fill for illustration blocks and feature card backgrounds in the marketing surface |
| Apricot Glow | `#ffb36a` | `--color-apricot-glow` | Warm illustration accent — pairs with Light Coral in editorial gradient compositions |
| Lavender Mist | `#c0c8f6` | `--color-lavender-mist` | Cool illustration accent balancing the warm Coral/Apricot pair in product showcase gradients |
| Periwinkle Fade | `linear-gradient(180deg, #9fa6ff, #b3bae8)` | `--color-periwinkle-fade` | Periwinkle-to-lavender gradient used in product feature illustrations and decorative dividers |

## Tokens — Typography

### Basel Grotesk Book — Workhorse for all UI: nav, body, buttons, badges, card copy, h2–h6 headings, and the 72px section headlines. Weight 500 is the default (heavier than typical body text) which gives the interface a confident, almost magazine-pull-quote density. The slight geometric warmth keeps it from feeling clinical. · `--font-basel-grotesk-book`
- **Substitute:** Inter, Manrope, or Söhne
- **Weights:** 400, 500
- **Sizes:** 14, 16, 22, 32, 40, 72
- **Line height:** 1.40–1.50 at body, 1.20 at subhead, 1.10 at h3, 1.00 at h2, 0.97 at h1
- **Letter spacing:** -0.04em at h5/h6, -0.03em at h1/h2/h3, -0.02em at h4, 0 at body
- **Role:** Workhorse for all UI: nav, body, buttons, badges, card copy, h2–h6 headings, and the 72px section headlines. Weight 500 is the default (heavier than typical body text) which gives the interface a confident, almost magazine-pull-quote density. The slight geometric warmth keeps it from feeling clinical.

### Basel Classic Book — Reserved exclusively for display/editorial statements at 96px+ and the 40px h1 variant. Its sharper, slightly more serifed terminals distinguish hero-level copy from section headlines — a deliberate two-voice system that signals "this is the big idea" vs "this is the next thought." Weight stays at 400 even at 144px because the tight 0.8 line-height and -0.03em tracking already create visual mass. · `--font-basel-classic-book`
- **Substitute:** Tiempos Headline, GT Sectra Display, or Canela
- **Weights:** 400, 500
- **Sizes:** 40, 96, 144
- **Line height:** 0.80–0.97
- **Letter spacing:** -0.03em at all sizes
- **Role:** Reserved exclusively for display/editorial statements at 96px+ and the 40px h1 variant. Its sharper, slightly more serifed terminals distinguish hero-level copy from section headlines — a deliberate two-voice system that signals "this is the big idea" vs "this is the next thought." Weight stays at 400 even at 144px because the tight 0.8 line-height and -0.03em tracking already create visual mass.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 14px | 1.4 | — | `--text-caption` |
| body | 16px | 1.5 | — | `--text-body` |
| subheading | 22px | 1.2 | -0.44px | `--text-subheading` |
| heading-sm | 32px | 1.1 | -0.64px | `--text-heading-sm` |
| heading | 40px | 1 | -1.2px | `--text-heading` |
| heading-lg | 72px | 0.97 | -2.16px | `--text-heading-lg` |
| display | 96px | 0.95 | -2.88px | `--text-display` |

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
| 44 | 44px | `--spacing-44` |
| 48 | 48px | `--spacing-48` |
| 56 | 56px | `--spacing-56` |
| 80 | 80px | `--spacing-80` |
| 96 | 96px | `--spacing-96` |
| 120 | 120px | `--spacing-120` |
| 228 | 228px | `--spacing-228` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 8px |
| badges | 8px |
| inputs | 12px |
| buttons | 1440px |
| containers | 24px |
| largeCards | 16px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 24px
- **Element gap:** 16px

## Components

### Primary Pill Button (Dark)
**Role:** Highest-emphasis action — trial sign-up, primary conversion

1440px border-radius (full pill), 12px 24px padding, #17150 fill, #f0f7f6 text, Basel Grotesk 16px weight 500. No border, no shadow. Sits as the rightmost header action on white backgrounds.

### Primary Pill Button (Yellow Accent)
**Role:** Hero CTA — demo request, primary conversion on dark hero photo

1440px radius, 12px 24px padding, #cccc25 fill, #17150 text, Basel Grotesk 16px weight 500. Used sparingly — appears once per page max, in the hero overlay.

### Ghost Outline Button
**Role:** Secondary action over imagery or dark surfaces

1440px radius, 12px 24px padding, transparent fill, 1.5px solid #ffffff border, #ffffff text. Used on the dark hero photo overlay for the secondary 'Start free trial' action.

### Text Nav Link
**Role:** Top navigation items

No background, #17150 text, Basel Grotesk 16px weight 500, 8px horizontal padding, no underline. Hover transitions color only.

### Feature Card (Mint)
**Role:** Product screenshot showcase blocks on white sections

#f0f7f6 fill, 8px radius, 16px–24px padding, no shadow, no border. Contains inline product mockup imagery at 100% width with no additional chrome.

### Dark Feature Card
**Role:** High-contrast product showcase or testimonial blocks

#17150 fill, 16px radius, generous padding (32–48px), white/mint text, no shadow. Creates a visual pause between lighter sections.

### Stat Block
**Role:** Hero metrics in the social-proof band — 26%, 75%, 40hrs

No card chrome. Display number in Basel Classic 96–144px weight 400, #17150, line-height 0.8–0.95, letter-spacing -0.03em. Small superscript '+' in the same style. Caption beneath in Basel Grotesk 16px weight 500, #17150e.

### Filled Badge
**Role:** Status tags, count indicators, notification pills

#f0f7f6 fill, #17150 text, 8px radius, 12px padding, Basel Grotesk 16px weight 500. Inline with adjacent content.

### Ghost Badge
**Role:** Section labels, filter tags, eyebrow text

Transparent fill, 1.5px solid #17150 border, #17150 text, 8px radius, 12px padding, Basel Grotesk 16px weight 500. Optionally with 0.063em letter-spacing for label variation.

### Carousel Arrow Control
**Role:** Section navigation between feature cards or testimonials

40×40px square, 1.5px solid #17150 border, no fill, 8px radius, #17150 arrow icon. Sits flush-right of section heading.

### Announcement Bar
**Role:** Top-of-page promotional strip

Full-width, #17150 fill, #f0f7f6 text, 12px vertical padding, Basel Grotesk 14px weight 500. Contains a single text link with optional chevron.

### Chat Widget
**Role:** Persistent customer support trigger

56px circle, #17150 fill, white chat icon, bottom-right fixed position. Subtle drop shadow to lift from page content.

### Metric Chip (Yellow)
**Role:** Inline AI suggestion or highlight within product UI

#cccc25 fill, #17150 text, 8px radius, 8px 12px padding, Basel Grotesk 14px weight 500. Appears inside the product screenshot to mark actionable items.

## Do's and Don'ts

### Do
- Use Basel Classic Book only at 96px+; reserve it for the single biggest statement on a page
- Set all heading line-height to 1.0 or below; the tight stacking is signature and not optional
- Apply -0.03em letter-spacing on any text 40px or larger; 0 tracking at body sizes
- Alternate section backgrounds between #ffffff and #f0f7f6 to create the magazine-spread cadence
- Use #cccc25 (Solar Yellow) for exactly one element per view — hero CTA, a single stat chip, or a gradient wash — never as a general accent
- Set border-radius to 1440px on every button and 8px on every standard card; mixing the two within a component family breaks the system
- Use 1.5px borders (not 1px) for all dividers and ghost elements — the slightly heavier line reads as intentional ink rather than CSS default

### Don't
- Don't introduce drop shadows on standard cards; the system is flat by design and shadows undermine the editorial feel
- Don't use #000000 for text or fills — always warm it to #17150 to preserve the printed-ink quality
- Don't pair Basel Classic with anything below 96px; the contrast in voice collapses at smaller sizes
- Don't place yellow buttons on yellow gradient backgrounds — the CTA loses all emphasis
- Don't add a third display weight (e.g. 600) to either font; the system only uses 400 and 500
- Don't use the decorative illustration colors (Coral, Apricot, Lavender) for UI states, text, or borders — they are gradient art only
- Don't add hover shadows to buttons; use background-color or border-color transitions exclusively

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas | `#ffffff` | Primary page background for header, content sections, and footer interior |
| 1 | Tint | `#f0f7f6` | Alternating section bands, card surfaces, badge fills — creates the second visual register |
| 2 | Ink | `#17150` | Dark cards, footer, announcement bar, primary buttons — highest-contrast surface for elevation |
| 3 | Highlight | `#cccc25` | Accent surface for CTAs, metric chips, gradient washes — functional, never decorative chrome |

## Elevation

- **Card:** `none — flat surfaces only, separation achieved through tint alternation and 1.5px hairlines`
- **Chat Widget:** `0 4px 12px rgba(23, 21, 14, 0.15) — the only consistently elevated element, used to mark it as out-of-flow UI`

## Imagery

Imagery alternates between two modes: editorial photography and product screenshot capture. The hero is a full-bleed documentary-style photograph of people working at a salon (warm, slightly desaturated, natural lighting, no staged poses) overlaid with white headline type — the photo sets lifestyle context without dominating. Product visuals are tight screen captures of the actual interface (calendar, analytics dashboard, payment flow) presented inside mint-tinted cards with no device frames or mockup chrome. Decorative gradient washes (yellow, periwinkle, green-fade) appear as full-bleed section backgrounds to break the rhythm between content blocks. Icons are minimal — mostly line-weight UI icons in product screenshots rather than illustrative iconography. No 3D renders, no abstract geometric art, no stock photography in feature sections.

## Layout

Max-width 1200px centered content frame, with full-bleed sections (photo hero, dark cards, gradient washes) breaking out to viewport edges. The page model is a vertical stack of sections that alternate between white and mint-tint backgrounds, creating the cadence of a printed spread. The hero is a full-bleed dark photograph with left-aligned white headline overlay (not centered) and a single yellow CTA + ghost button stack positioned in the lower-left. Feature sections use a two-column pattern: large left-aligned heading with a 3-column card grid or single product mockup on the right. The stats band is a 3-column horizontal grid on a mint background with oversized numbers dominating. Navigation is a minimal top bar — text links left, three-button cluster right (ghost login, ghost demo, dark pill start trial) — with no sticky behavior on the hero. Section gaps are 80–120px, generous enough to feel editorial rather than dense.

## Agent Prompt Guide

**Quick Color Reference**
- text: #17150e (warm near-black)
- background: #ffffff (canvas) / #f0f7f6 (tint sections)
- border: 1.5px solid #17150e
- accent: #cccc25 (Solar Yellow) — charts, metric chips, gradient washes
- card surface: #f0f7f6 with 8px radius, no shadow
- primary action: no distinct CTA color

**Example Component Prompts**
No distinct primary action color was observed; use the extracted neutral button treatments instead of inventing a filled CTA color.

2. **Stat band**: Mint #f0f7f6 section background, 80px vertical padding. Three columns. Each column: display number at 96px Basel Classic weight 400, #17150e, line-height 0.95, letter-spacing -2.88px, with a superscript '+' in the same style. Caption beneath in Basel Grotesk 16px weight 500, #17150e.

3. **Feature card with product mockup**: White section background. Card: #f0f7f6 fill, 8px radius, 24px padding, no shadow, no border. Contains a product screenshot filling 100% card width with 8px radius clip. Heading above card at 40px Basel Classic weight 400, #17150e.

4. **Ghost badge / eyebrow label**: Transparent fill, 1.5px solid #17150e border, 8px radius, 12px padding. Text in Basel Grotesk 16px weight 500, #17150e, letter-spacing 0.063em, uppercase optional.

5. **Carousel navigation**: Two 40×40px square buttons flush-right of section heading. Transparent fill, 1.5px solid #17150e border, 8px radius, #17150e arrow glyph centered. Gap of 4px between arrows.

## Editorial Cadence

The system's defining structural choice is the alternation of #ffffff and #f0f7f6 between sections — never two mint sections adjacent, never two white sections adjacent. This two-tone rhythm does the work that shadows, dividers, or vertical lines would do in a conventional product UI. When designing a new page, sketch the section backgrounds first as a binary pattern before placing any content. Dark (#17150e) sections should appear no more than once per full page scroll-depth and only for emphasis — the announcement bar, the footer, or a single dark feature card.

## Yellow Restraint

Solar Yellow (#cccc25) is rationed. It appears as: (1) exactly one filled pill button in the hero, (2) inline metric chips inside product UI screenshots, (3) full-bleed gradient washes as section transitions, and (4) superscript '+' marks beside stat numbers. It should never appear as a link color, never as a heading color, never on a dark background, and never more than twice in a single viewport. The discipline is what makes it read as 'switched on' rather than decorative.

## Similar Brands

- **Linear** — Same editorial-magazine approach to product UI: oversized display typography, near-monochrome palette with a single saturated accent, flat surfaces with no shadows, and tight letter-spacing on large sizes
- **Arc Browser** — Shares the warm-near-black text (#17150 territory) against white, custom display serif/sans pairing, and confidence to let photography and typography do all the work without chrome
- **Substack** — Same publisher-spread sensibility: large editorial headlines, tight line-heights, minimal UI chrome, and a restrained palette that treats the page as a reading surface
- **Notion** — Pill-shaped buttons at extreme border-radius, gentle alternating surface tints, and flat card system with no shadows — though GlossGenius is far more typographically assertive

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-gloss-black: #17150e;
  --color-gloss-white: #f0f7f6;
  --color-pure-white: #ffffff;
  --color-solar-yellow: #cccc25;
  --gradient-solar-yellow: linear-gradient(180deg, #cccc25, #cacd78);
  --color-soft-charcoal: #272b30;
  --color-mid-grey: #949494;
  --color-light-coral: #ff7780;
  --color-apricot: #ffe5d6;
  --color-apricot-glow: #ffb36a;
  --color-lavender-mist: #c0c8f6;
  --color-periwinkle-fade: #9fa6ff;
  --gradient-periwinkle-fade: linear-gradient(180deg, #9fa6ff, #b3bae8);

  /* Typography — Font Families */
  --font-basel-grotesk-book: 'Basel Grotesk Book', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-basel-classic-book: 'Basel Classic Book', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.4;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-subheading: 22px;
  --leading-subheading: 1.2;
  --tracking-subheading: -0.44px;
  --text-heading-sm: 32px;
  --leading-heading-sm: 1.1;
  --tracking-heading-sm: -0.64px;
  --text-heading: 40px;
  --leading-heading: 1;
  --tracking-heading: -1.2px;
  --text-heading-lg: 72px;
  --leading-heading-lg: 0.97;
  --tracking-heading-lg: -2.16px;
  --text-display: 96px;
  --leading-display: 0.95;
  --tracking-display: -2.88px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;

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
  --spacing-44: 44px;
  --spacing-48: 48px;
  --spacing-56: 56px;
  --spacing-80: 80px;
  --spacing-96: 96px;
  --spacing-120: 120px;
  --spacing-228: 228px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 24px;
  --element-gap: 16px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-2xl: 16px;
  --radius-3xl: 24px;
  --radius-full: 1440px;

  /* Named Radii */
  --radius-cards: 8px;
  --radius-badges: 8px;
  --radius-inputs: 12px;
  --radius-buttons: 1440px;
  --radius-containers: 24px;
  --radius-largecards: 16px;

  /* Surfaces */
  --surface-canvas: #ffffff;
  --surface-tint: #f0f7f6;
  --surface-ink: #17150;
  --surface-highlight: #cccc25;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-gloss-black: #17150e;
  --color-gloss-white: #f0f7f6;
  --color-pure-white: #ffffff;
  --color-solar-yellow: #cccc25;
  --color-soft-charcoal: #272b30;
  --color-mid-grey: #949494;
  --color-light-coral: #ff7780;
  --color-apricot: #ffe5d6;
  --color-apricot-glow: #ffb36a;
  --color-lavender-mist: #c0c8f6;
  --color-periwinkle-fade: #9fa6ff;

  /* Typography */
  --font-basel-grotesk-book: 'Basel Grotesk Book', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-basel-classic-book: 'Basel Classic Book', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.4;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-subheading: 22px;
  --leading-subheading: 1.2;
  --tracking-subheading: -0.44px;
  --text-heading-sm: 32px;
  --leading-heading-sm: 1.1;
  --tracking-heading-sm: -0.64px;
  --text-heading: 40px;
  --leading-heading: 1;
  --tracking-heading: -1.2px;
  --text-heading-lg: 72px;
  --leading-heading-lg: 0.97;
  --tracking-heading-lg: -2.16px;
  --text-display: 96px;
  --leading-display: 0.95;
  --tracking-display: -2.88px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-28: 28px;
  --spacing-32: 32px;
  --spacing-44: 44px;
  --spacing-48: 48px;
  --spacing-56: 56px;
  --spacing-80: 80px;
  --spacing-96: 96px;
  --spacing-120: 120px;
  --spacing-228: 228px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-2xl: 16px;
  --radius-3xl: 24px;
  --radius-full: 1440px;
}
```
