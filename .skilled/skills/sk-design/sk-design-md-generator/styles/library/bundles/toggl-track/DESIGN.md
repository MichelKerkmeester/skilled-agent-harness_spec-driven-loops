# Toggl Track — Style Reference
> Plum theater marquee — a deep aubergine stage where a single magenta spotlight word illuminates each headline.

**Theme:** mixed

Toggl Track runs on a plum-and-cream duotone: a deep aubergine stage for hero and footer bands, warm off-white for product content, and one vivid magenta-pink that hijacks single words inside headlines — set in a rotalic italic — to make the copy feel theatrical. The pink is rationed; it appears as emphasis words, filled pill CTAs, and tiny icon dots, never as a wash. Surfaces stay flat; depth comes from the contrast between dark and light bands, not from shadows or gradients. Components are chunky and generously rounded: 26px for primary buttons, 200px for pill tags and nav chips, 10px for content cards. Typography pairs GT Haptik's geometric softness (display) with Inter's neutrality (body), both set tight at 1.1–1.25 line-height on the largest sizes so headlines feel dense and confident rather than airy.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Plum | `#2c1338` | `--color-plum` | Hero, header, and footer canvases; brand mark background. Near-black aubergine that reads as the brand's signature dark |
| Heather | `#412a4c` | `--color-heather` | Primary headings and UI text on light surfaces; secondary dark surface when Plum is too heavy. The workhorse purple |
| Magenta | `#e57cd8` | `--color-magenta` | Filled CTA buttons, emphasis words inside headlines, selected nav state, star ratings, and decorative dots. The only vivid hue — rationed to one word or one control per screen |
| Lavender Smoke | `#564260` | `--color-lavender-smoke` | Body copy and link text on warm-white surfaces where Heather would feel too heavy. Carries the brand tint into running text |
| Dusty Mauve | `#6b5a74` | `--color-dusty-mauve` | Secondary body text, descriptions, helper text, and muted icon strokes on light surfaces. Desaturated enough to recede behind headings |
| Stone Violet | `#817187` | `--color-stone-violet` | Borders and dividers on light surfaces; button borders for outlined variants; disabled or placeholder text |
| Ink | `#000000` | `--color-ink` | Primary text and high-contrast borders on light surfaces; footer text on dark Plum |
| Bone | `#fefbfa` | `--color-bone` | Page background for all content sections, card surfaces, and text color on dark Plum headers |
| Silver | `#d5d0d7` | `--color-silver` | Hairline borders, list separators, and input outlines across cards and tables. The structural neutral grid |
| Fog | `#c0b8c3` | `--color-fog` | Subtle borders and dividers where Silver reads too dark; secondary placeholder text on inputs |
| Blush | `#fdeae2` | `--color-blush` | Soft warm wash for icon fills, decorative card backgrounds, and nav hover states. The warmest surface tint |
| Petal | `#fcf1f8` | `--color-petal` | Elevated card and modal surfaces above Bone. Carries a pink whisper without competing with Magenta |
| Orchid Mist | `#fae5f7` | `--color-orchid-mist` | Highlighted card background for featured or selected content blocks |
| Bubblegum Wash | `#f7d8f3` | `--color-bubblegum-wash` | Pale pink surface for secondary buttons, tag backgrounds, and the softest brand-tinted fill |
| Amber | `#ffde91` | `--color-amber` | Yellow action color for filled buttons, selected navigation states, and focused conversion moments. |

## Tokens — Typography

### Inter — All body copy, navigation links, UI labels, table data, and secondary headings. Inter's neutrality keeps the content calm while GT Haptik performs on the headlines. Weight 500 for nav and buttons, 700 for subheadings, 800 for compact stat callouts. · `--font-inter`
- **Substitute:** system-ui
- **Weights:** 400, 500, 700, 800
- **Sizes:** 12, 13, 14, 15, 16, 18, 22, 24, 32px
- **Line height:** 1.25–1.70
- **Role:** All body copy, navigation links, UI labels, table data, and secondary headings. Inter's neutrality keeps the content calm while GT Haptik performs on the headlines. Weight 500 for nav and buttons, 700 for subheadings, 800 for compact stat callouts.

### GT Haptik — Display headlines and large section titles. GT Haptik's geometric warmth with rounded terminals gives the brand a friendly, non-corporate voice; weight 700 at 43–69px with tight 1.1 line-height creates dense, confident heroes. Substitute: Inter Tight, Manrope, or Outfit. · `--font-gt-haptik`
- **Substitute:** Inter Tight
- **Weights:** 400, 700
- **Sizes:** 32, 43, 60, 69px
- **Line height:** 1.10–1.25
- **Role:** Display headlines and large section titles. GT Haptik's geometric warmth with rounded terminals gives the brand a friendly, non-corporate voice; weight 700 at 43–69px with tight 1.1 line-height creates dense, confident heroes. Substitute: Inter Tight, Manrope, or Outfit.

### GT Haptik Rotalic — The single highlighted word inside every hero and section headline — rendered in Magenta (#e57cd8) with a right-leaning italic slant. This is the brand's theatrical signature: one word per headline gets the spotlight. Substitute: Inter Tight Italic with manual skew, or Manrope Italic. · `--font-gt-haptik-rotalic`
- **Substitute:** Inter Tight Italic
- **Weights:** 400
- **Sizes:** 43, 60, 69px
- **Line height:** 
- **Role:** The single highlighted word inside every hero and section headline — rendered in Magenta (#e57cd8) with a right-leaning italic slant. This is the brand's theatrical signature: one word per headline gets the spotlight. Substitute: Inter Tight Italic with manual skew, or Manrope Italic.

### GT Haptik Medium Rotalic — GT Haptik Medium Rotalic — detected in extracted data but not described by AI · `--font-gt-haptik-medium-rotalic`
- **Weights:** 400
- **Sizes:** 43px, 60px, 69px
- **Line height:** 1.1, 1.2, 1.25
- **Role:** GT Haptik Medium Rotalic — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.5 | — | `--text-caption` |
| body-sm | 14px | 1.55 | — | `--text-body-sm` |
| body | 16px | 1.5 | — | `--text-body` |
| subheading | 18px | 1.4 | — | `--text-subheading` |
| heading-sm | 22px | 1.35 | — | `--text-heading-sm` |
| heading | 32px | 1.25 | — | `--text-heading` |
| heading-lg | 43px | 1.2 | — | `--text-heading-lg` |
| display | 60px | 1.15 | — | `--text-display` |
| display-xl | 69px | 1.1 | — | `--text-display-xl` |

## Tokens — Spacing & Shapes

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 5 | 5px | `--spacing-5` |
| 8 | 8px | `--spacing-8` |
| 9 | 9px | `--spacing-9` |
| 10 | 10px | `--spacing-10` |
| 12 | 12px | `--spacing-12` |
| 14 | 14px | `--spacing-14` |
| 15 | 15px | `--spacing-15` |
| 18 | 18px | `--spacing-18` |
| 20 | 20px | `--spacing-20` |
| 25 | 25px | `--spacing-25` |
| 30 | 30px | `--spacing-30` |
| 40 | 40px | `--spacing-40` |
| 75 | 75px | `--spacing-75` |
| 90 | 90px | `--spacing-90` |
| 113 | 113px | `--spacing-113` |
| 170 | 170px | `--spacing-170` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 200px |
| cards | 10px |
| pills | 200px |
| inputs | 10px |
| buttons | 26px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 75px
- **Card padding:** 30px
- **Element gap:** 10px

## Components

### Primary Filled Button (Magenta)
**Role:** Main call-to-action for hero and section CTAs

Magenta (#e57cd8) background, Bone (#fefbfa) text, 26px border-radius, padding 14px 28px, Inter weight 500 at 15–16px. No border. The 26px radius is generous but not pill — it signals 'rounded friendly' while keeping a button silhouette. Single CTA per hero zone.

### Ghost Button (Outlined on Dark)
**Role:** Secondary action on Plum hero bands

Transparent background, 1px Bone (#fefbfa) border, Bone text, 26px radius, padding 14px 28px, Inter weight 500. Sits beside the Magenta primary in the hero. Icon-prefixed variant uses a small play-arrow circle.

### Try-for-Free Pill Button
**Role:** Persistent top-right nav CTA

Blush (#fdeae2) background, Plum (#2c1338) text, 200px border-radius (full pill), padding 8px 18px, Inter weight 500 at 14px. The pill shape distinguishes the always-available trial entry point from contextual CTAs.

### Nav Link (Header)
**Role:** Primary navigation items

Bone (#fefbfa) text on Plum header, Inter weight 500 at 15px, no underline. Dropdown caret via small chevron icon in Dusty Mauve. Active/hover state raises opacity to 100% with a 2px Magenta underline.

### Feature Card (Bone)
**Role:** Content cards in feature grids and product showcases

Bone (#fefbfa) background, 1px Silver (#d5d0d7) border, 10px border-radius, 30px padding, no shadow. Contains a small icon in Blush circle, Inter heading-sm for title, Dusty Mauve body text. Flat and content-first.

### Highlighted Feature Card (Petal)
**Role:** Elevated or selected feature card

Petal (#fcf1f8) background, 1px Fog (#c0b8c3) border, 10px radius, 30px padding. Used for cards that need to stand above a grid of Bone cards without using shadow.

### Pill Tag / Tab
**Role:** Filter pills, tab selectors, category tags

Bubblegum Wash (#f7d8f3) or Blush (#fdeae2) background, Plum or Heather text, 200px border-radius, padding 6px 14px, Inter weight 500 at 13px. Active state swaps to Magenta background with Bone text.

### Star Rating Badge
**Role:** Social proof and review aggregates

Amber (#ffde91) five-star row, Inter weight 700 at 16px for score, Dusty Mauve at 13px for review count. Stars are flat, filled, with 2px gap between. Sits on Bone background with no container border.

### Mega Menu Panel
**Role:** Product and Solutions dropdown navigation

Bone background, 10px radius, 30px padding, soft diffused shadow at 0 8px 24px rgba(44,19,56,0.12). Four-column layout: Product, Use Cases, Features, Help. Column headers in Inter weight 700 at 14px Heather; links in Inter weight 400 at 14px Dusty Mauve with 10px row gap.

### Data Table Card
**Role:** Product UI preview — time entries, reports

Bone background, 10px radius, 1px Silver borders on row separators, 16px row padding. Column headers in Inter weight 700 at 12px uppercase Dusty Mauve. Active/selected rows get Petal background. Duration column right-aligned in Inter weight 500.

### Calendar Week Card
**Role:** Calendar view product UI preview

Bone background, 10px radius, 1px Silver border, header bar with three macOS-style traffic-light dots in Magenta/Heather/Fog. Week navigation pill with Blush background. Day cells have 8px internal padding.

### Integration Icon Cluster
**Role:** Social proof for 100+ integrations

Cluster of grayscale brand logos in 40px circles, arranged in a loose grid. Each icon on Bone background with no border. Accompanied by '100+ INTEGRATIONS' label in Inter weight 800 at 14px, letter-spacing 0.5px, uppercase Heather.

### Brand Wordmark
**Role:** Logo lockup in header and footer

'toggl' in custom lowercase geometric mark, followed by 'track' in lighter Inter weight 400 at matching x-height. The 'toggle' mark is a custom ligature where the two o's connect. Color adapts: Blush + Bone on Plum, Plum + Heather on Bone.

### Hero Headline (Display)
**Role:** Above-the-fold hero copy on Plum

GT Haptik weight 700 at 60–69px, Bone text, line-height 1.1–1.15, centered. Contains one or two words rendered in GT Haptik Rotalic weight 400 at matching size in Magenta (#e57cd8) — the theatrical signature. Subhead in Inter weight 400 at 18px Dusty Mauve, max-width 640px.

## Do's and Don'ts

### Do
- Render every hero or section headline with exactly one Magenta emphasis word set in GT Haptik Rotalic — this is the brand's signature move.
- Use 26px border-radius for all primary action buttons and nav controls; reserve 200px for pills, tags, and trial CTAs only.
- Set display sizes (43px+) with line-height at or below 1.2 — the tight leading makes GT Haptik feel dense and confident.
- Build depth through Plum-to-Bone band contrast, not shadows. Cards get 1px Silver borders on Bone surfaces.
- Use Inter for everything below the fold: body, labels, table cells, nav. Reserve GT Haptik for display and section headlines.
- Keep the page on Bone (#fefbfa) for content sections and Plum (#2c1338) for hero/header/footer — these are the only two canvas colors.
- Ration Magenta to one element per screen: a CTA, an emphasis word, a selected state, or a decorative dot. Never two.

### Don't
- Don't use drop shadows on cards, buttons, or modals — the design language is flat with surface tint contrast instead.
- Don't set the pink emphasis word in upright GT Haptik — it must be in the Rotalic variant to carry the theatrical meaning.
- Don't use Magenta as a background wash, gradient, or large surface fill. It only appears on filled buttons, emphasis words, and small dots.
- Don't introduce a second accent hue. The system is monochromatic purple with one spotlight pink — adding teal, green, or orange breaks the duotone.
- Don't use pure white (#ffffff) for backgrounds — Bone (#fefbfa) is the canvas. Pure white reads as cold and unbranded against the warm tints.
- Don't apply corner radii smaller than 10px or larger than 200px. The system has three: 10px (cards/inputs), 26px (buttons), 200px (pills).
- Don't set display headlines above 1.25 line-height — loose leading makes GT Haptik feel airy and undermines the dense, confident voice.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Bone | `#fefbfa` | Base page canvas for all content sections |
| 1 | Petal | `#fcf1f8` | Elevated card and modal surfaces |
| 2 | Blush | `#fdeae2` | Warm decorative card backgrounds and icon fills |
| 3 | Orchid Mist | `#fae5f7` | Featured/selected content highlights |
| 4 | Heather | `#412a4c` | Dark surface above light content |
| 5 | Plum | `#2c1338` | Hero, header, and footer dark stage |

## Elevation

Depth comes from color contrast between Plum dark bands and Bone light bands, not from drop shadows. Cards, modals, and elevated surfaces rely on subtle 1px Silver borders and warm surface tints (Petal, Blush) rather than shadow stacks. The only shadow-like effect is on dropdown menus and mega-nav panels, which use a soft diffused glow at rgba(44,19,56,0.12).

## Imagery

Product screenshots are the dominant visual: real UI captures of the Toggl Track app (calendar views, data tables, team activity feeds) rendered with browser-chrome framing and three macOS-style traffic-light dots in Magenta/Heather/Fog. These screenshots sit on the Plum hero stage as floating overlapping cards, creating a 'product on display' feel. No lifestyle photography, no stock imagery, no abstract illustrations. The only illustrative element is a small cluster of grayscale integration logos in a 40px circle grid as social proof. Iconography is flat, single-weight, and mono — the power-button mark in the wordmark is the only custom glyph; everything else is standard outline UI icons in Dusty Mauve or Blush.

## Layout

Full-bleed Plum hero band (centered headline, subtext, two-button CTA row, then overlapping product screenshot cards below the fold) transitions into a Bone content section. Content sections follow a repeated rhythm: centered headline block (max-width 720px), then alternating 2-column rows with text-left/visual-right or text-right/visual-left. Feature lists use a 3-column card grid. The footer returns to Plum with a 4-column mega-nav layout above a 'the toggl company' brand band. Max-width 1200px centered container for all content. Navigation is a single sticky top bar with logo left, primary nav center, utility links and pill CTA right. Section gaps are generous (75px) to let the dark-to-light band transitions breathe.

## Agent Prompt Guide

**Quick Color Reference**
- text (primary on light): #000000
- text (on dark Plum): #fefbfa
- text (muted/body on light): #6b5a74
- text (headings on light): #412a4c
- background (light canvas): #fefbfa
- background (dark stage): #2c1338
- border (hairline): #d5d0d7
- accent / emphasis: #e57cd8 (Magenta)
- primary action: #e57cd8 (filled action)

**3 Example Component Prompts**

1. Create a Primary Action Button: #e57cd8 background, #000000 text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.

2. *Feature card grid:* Three cards on #fefbfa background, 30px padding, 10px border-radius, 1px #d5d0d7 border. Each card has a 40px Blush (#fdeae2) icon circle with a monochrome outline icon, then Inter weight 700 at 22px #412a4c heading, then Inter weight 400 at 16px #6b5a74 body text, with 15px vertical gap between elements.


## Similar Brands

- **Notion** — Same flat, border-driven card system with no shadows; generous corner radii on buttons and inputs; warm off-white canvas instead of pure white.
- **Linear** — Same restrained single-accent approach — one vivid color appearing on emphasis words and primary CTAs against a dark stage; tight typographic leading on display sizes.
- **Figma** — Same duotone brand stage (dark hero, light content) with product UI screenshots as hero visuals; rounded but not pill button radii; warm-neutral canvas.
- **Calendly** — Same use of a single highlight word inside headlines in a vivid accent color; flat cards with hairline borders; 2-column alternating feature sections.

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-plum: #2c1338;
  --color-heather: #412a4c;
  --color-magenta: #e57cd8;
  --color-lavender-smoke: #564260;
  --color-dusty-mauve: #6b5a74;
  --color-stone-violet: #817187;
  --color-ink: #000000;
  --color-bone: #fefbfa;
  --color-silver: #d5d0d7;
  --color-fog: #c0b8c3;
  --color-blush: #fdeae2;
  --color-petal: #fcf1f8;
  --color-orchid-mist: #fae5f7;
  --color-bubblegum-wash: #f7d8f3;
  --color-amber: #ffde91;

  /* Typography — Font Families */
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-gt-haptik: 'GT Haptik', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-gt-haptik-rotalic: 'GT Haptik Rotalic', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-gt-haptik-medium-rotalic: 'GT Haptik Medium Rotalic', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --text-body-sm: 14px;
  --leading-body-sm: 1.55;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-subheading: 18px;
  --leading-subheading: 1.4;
  --text-heading-sm: 22px;
  --leading-heading-sm: 1.35;
  --text-heading: 32px;
  --leading-heading: 1.25;
  --text-heading-lg: 43px;
  --leading-heading-lg: 1.2;
  --text-display: 60px;
  --leading-display: 1.15;
  --text-display-xl: 69px;
  --leading-display-xl: 1.1;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-bold: 700;
  --font-weight-extrabold: 800;

  /* Spacing */
  --spacing-5: 5px;
  --spacing-8: 8px;
  --spacing-9: 9px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-14: 14px;
  --spacing-15: 15px;
  --spacing-18: 18px;
  --spacing-20: 20px;
  --spacing-25: 25px;
  --spacing-30: 30px;
  --spacing-40: 40px;
  --spacing-75: 75px;
  --spacing-90: 90px;
  --spacing-113: 113px;
  --spacing-170: 170px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 75px;
  --card-padding: 30px;
  --element-gap: 10px;

  /* Border Radius */
  --radius-lg: 10px;
  --radius-xl: 14px;
  --radius-3xl: 26px;
  --radius-full: 200px;

  /* Named Radii */
  --radius-tags: 200px;
  --radius-cards: 10px;
  --radius-pills: 200px;
  --radius-inputs: 10px;
  --radius-buttons: 26px;

  /* Surfaces */
  --surface-bone: #fefbfa;
  --surface-petal: #fcf1f8;
  --surface-blush: #fdeae2;
  --surface-orchid-mist: #fae5f7;
  --surface-heather: #412a4c;
  --surface-plum: #2c1338;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-plum: #2c1338;
  --color-heather: #412a4c;
  --color-magenta: #e57cd8;
  --color-lavender-smoke: #564260;
  --color-dusty-mauve: #6b5a74;
  --color-stone-violet: #817187;
  --color-ink: #000000;
  --color-bone: #fefbfa;
  --color-silver: #d5d0d7;
  --color-fog: #c0b8c3;
  --color-blush: #fdeae2;
  --color-petal: #fcf1f8;
  --color-orchid-mist: #fae5f7;
  --color-bubblegum-wash: #f7d8f3;
  --color-amber: #ffde91;

  /* Typography */
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-gt-haptik: 'GT Haptik', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-gt-haptik-rotalic: 'GT Haptik Rotalic', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-gt-haptik-medium-rotalic: 'GT Haptik Medium Rotalic', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --text-body-sm: 14px;
  --leading-body-sm: 1.55;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-subheading: 18px;
  --leading-subheading: 1.4;
  --text-heading-sm: 22px;
  --leading-heading-sm: 1.35;
  --text-heading: 32px;
  --leading-heading: 1.25;
  --text-heading-lg: 43px;
  --leading-heading-lg: 1.2;
  --text-display: 60px;
  --leading-display: 1.15;
  --text-display-xl: 69px;
  --leading-display-xl: 1.1;

  /* Spacing */
  --spacing-5: 5px;
  --spacing-8: 8px;
  --spacing-9: 9px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-14: 14px;
  --spacing-15: 15px;
  --spacing-18: 18px;
  --spacing-20: 20px;
  --spacing-25: 25px;
  --spacing-30: 30px;
  --spacing-40: 40px;
  --spacing-75: 75px;
  --spacing-90: 90px;
  --spacing-113: 113px;
  --spacing-170: 170px;

  /* Border Radius */
  --radius-lg: 10px;
  --radius-xl: 14px;
  --radius-3xl: 26px;
  --radius-full: 200px;
}
```
