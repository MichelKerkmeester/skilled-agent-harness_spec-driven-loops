# Paradigm — Style Reference
> midnight lab notebook opening to daylight — a dark first screen cracks into a bright, data-rich scroll.

**Theme:** light

Paradigm opens in a dark observatory atmosphere — near-black canvas, white serif display type, and a live data table that already proves the product — then dissolves into a daylight research interface of white paper, soft tinted surfaces, and pastel status badges. The signature move is the Atacama VAR serif at 44–54px with -0.06em tracking, paired against a workhorse PP Neue Montreal that carries the entire UI at 14–22px with tabular numerals. Color is rationed: one vivid blue (#0a33ff) punctuates the brand through active states and step indicators, status is communicated through six dark-ink + pastel-wash badge pairs (forest, sapphire, mulberry, amber, crimson, plum), and the rest of the system lives in carefully tuned warm and cool grays. Components feel like research instruments — 4px corners, hairline borders, a signature white inner-glow on product mockup cards, and almost no drop shadows.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Midnight Ink | `#080b12` | `--color-midnight-ink` | Primary text, hero background, card borders, table rules — the structural near-black that anchors both dark and light regions |
| Paper | `#ffffff` | `--color-paper` | Page background, card surfaces, inverted button fill in dark hero |
| Fog | `#f6f7f8` | `--color-fog` | Subtle surface lift for secondary panels, table zebra rows, input wells |
| Pearl | `#edeef1` | `--color-pearl` | Quiet button backgrounds, nested surface tint |
| Stone | `#d9d9d9` | `--color-stone` | Table column dividers, neutral hairline borders |
| Lavender Mist | `#dbdbee` | `--color-lavender-mist` | Tinted table surface and the dominant data-grid border — a barely-violet line that sets the product interface apart from generic grays |
| Mist | `#b5b9c4` | `--color-mist` | Light borders on secondary controls, list separators |
| Pewter | `#9898ae` | `--color-pewter` | Medium cool border for outlined buttons and inputs |
| Steel | `#848a9c` | `--color-steel` | Cool gray border used at extremely high frequency (392) — the workhorse rule-line color for structural divisions |
| Smoke | `#acacae` | `--color-smoke` | Icon stroke and muted body text on light surfaces |
| Ash | `#9d9ea1` | `--color-ash` | Muted icons, placeholder text, inactive controls |
| Iron | `#606167` | `--color-iron` | Body text secondary level, icon stroke weight |
| Graphite | `#6c6d73` | `--color-graphite` | Tertiary body text, supporting metadata |
| Slate | `#4f535e` | `--color-slate` | Strong secondary borders, card outline emphasis, footer text |
| Charcoal | `#2b2b2c` | `--color-charcoal` | Deep text for body emphasis on light backgrounds |
| Electric Iris | `#0a33ff` | `--color-electric-iris` | Brand accent — active tab indicator, step pill, the Enrich action, selected row check, brand wordmark dot — the single chromatic punctuation across an otherwise neutral system |
| Periwinkle | `#7f90ce` | `--color-periwinkle` | Muted action fill, secondary blue surfaces, desaturated hover state for the brand blue |
| Hero Dawn | `linear-gradient(180deg, #010b18 0%, #010818 16%, #103b91 49%, #4c7de8 78%, #bad0ff 97%)` | `--color-hero-dawn` | Hero gradient terminus — the deepest point of the dark-to-light blue backdrop |
| Sky Whisper | `#e2efff` | `--color-sky-whisper` | Info badge background wash |
| Sapphire Ink | `#061353` | `--color-sapphire-ink` | Info badge dark text and border |
| Mint Whisper | `#e4f3e2` | `--color-mint-whisper` | Success badge background wash |
| Forest Ink | `#03350f` | `--color-forest-ink` | Green state accent for badges, validation surfaces, and short status labels. |
| Sprout Whisper | `#d6ffe0` | `--color-sprout-whisper` | Light success badge alternative background |
| Saffron Whisper | `#faeed1` | `--color-saffron-whisper` | Warning badge background wash |
| Amber Ink | `#423301` | `--color-amber-ink` | Warning badge dark text and border |
| Blossom Whisper | `#ffe6f7` | `--color-blossom-whisper` | Pink/magenta tag badge background — category label |
| Mulberry Ink | `#600537` | `--color-mulberry-ink` | Pink/magenta tag badge dark text and border |
| Plum Ink | `#21034d` | `--color-plum-ink` | Deep violet tag badge dark text and border — alternative category color |
| Crimson Ink | `#580101` | `--color-crimson-ink` | Red state accent for badges, validation surfaces, and short status labels. |
| Apricot Whisper | `#fee8dd` | `--color-apricot-whisper` | Orange/copper tag badge background |
| Russet Ink | `#581c01` | `--color-russet-ink` | Orange/copper tag badge dark text and border |

## Tokens — Typography

### Atacama VAR — Display serif for all section and hero headlines 44px and above — the editorial weight 317–370 reads as research-journal rather than marketing, and the -0.06em tracking tightens the wide capitals into a confident mass · `--font-atacama-var`
- **Substitute:** Tiempos Text, Lora, or Source Serif Pro
- **Weights:** 317, 370, 400
- **Sizes:** 44px, 48px, 54px
- **Line height:** 1.0–1.2
- **Letter spacing:** -0.06em at 44–48px, -0.05em at 54px
- **Role:** Display serif for all section and hero headlines 44px and above — the editorial weight 317–370 reads as research-journal rather than marketing, and the -0.06em tracking tightens the wide capitals into a confident mass

### PP Neue Montreal — Workhorse UI font — body copy, buttons, nav, badges, table cells, and pre-headline labels. The 450 weight (a rare half-step) is the default for interactive elements, sitting between regular and medium for restraint · `--font-pp-neue-montreal`
- **Substitute:** Inter, Söhne, or General Sans
- **Weights:** 400, 450, 500
- **Sizes:** 12px, 13px, 14px, 15px, 16px, 17px, 18px, 21px, 22px, 160px
- **Line height:** 1.2–1.6
- **Letter spacing:** -0.01em body, 0.14–0.15em on all-caps eyebrow labels (THE OLD WAY, WITH PARADIGM)
- **OpenType features:** `"tnum" on, "ss01" off`
- **Role:** Workhorse UI font — body copy, buttons, nav, badges, table cells, and pre-headline labels. The 450 weight (a rare half-step) is the default for interactive elements, sitting between regular and medium for restraint

### Inter — Secondary UI text — tight table cells, micro-labels, and dense numerical columns where PP Neue Montreal is swapped for the slightly narrower Inter to save horizontal space · `--font-inter`
- **Substitute:** Inter (already Google Fonts)
- **Weights:** 400, 500, 600, 700
- **Sizes:** 9px, 10px, 11px, 12px, 13px, 14px, 15px
- **Line height:** 1.2–1.6
- **Letter spacing:** -0.006em to -0.02em body, 0.02em eyebrow
- **Role:** Secondary UI text — tight table cells, micro-labels, and dense numerical columns where PP Neue Montreal is swapped for the slightly narrower Inter to save horizontal space

### Suisse Intl — Rarely used body fallback, appears in micro-copy where 0.08em letter-spacing creates a quiet institutional voice · `--font-suisse-intl`
- **Substitute:** Söhne or Inter
- **Weights:** 400
- **Sizes:** 14px
- **Line height:** 1.2
- **Letter spacing:** 0.0100em, 0.0800em
- **Role:** Rarely used body fallback, appears in micro-copy where 0.08em letter-spacing creates a quiet institutional voice

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.5 | -0.12px | `--text-caption` |
| body-sm | 14px | 1.5 | -0.14px | `--text-body-sm` |
| body | 16px | 1.5 | -0.16px | `--text-body` |
| subheading | 18px | 1.4 | -0.18px | `--text-subheading` |
| heading-sm | 21px | 1.3 | -0.21px | `--text-heading-sm` |
| heading-lg | 44px | 1.1 | -2.64px | `--text-heading-lg` |
| display | 54px | 1 | -2.7px | `--text-display` |

## Tokens — Spacing & Shapes

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 5 | 5px | `--spacing-5` |
| 6 | 6px | `--spacing-6` |
| 7 | 7px | `--spacing-7` |
| 8 | 8px | `--spacing-8` |
| 9 | 9px | `--spacing-9` |
| 10 | 10px | `--spacing-10` |
| 12 | 12px | `--spacing-12` |
| 14 | 14px | `--spacing-14` |
| 16 | 16px | `--spacing-16` |
| 24 | 24px | `--spacing-24` |
| 32 | 32px | `--spacing-32` |
| 40 | 40px | `--spacing-40` |
| 60 | 60px | `--spacing-60` |
| 120 | 120px | `--spacing-120` |
| 188 | 188px | `--spacing-188` |

### Border Radius

| Element | Value |
|---------|-------|
| tabs | 100px |
| cards | 4px |
| badges | 4px |
| buttons | 4px |
| feature-cards | 16px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| lg | `rgb(255, 255, 255) 0px 0px 24px 0px inset` | `--shadow-lg` |
| subtle | `rgba(0, 0, 0, 0.06) 0px 1px 3px 0px` | `--shadow-subtle` |
| subtle-2 | `rgba(0, 0, 0, 0.04) 0px 1px 3px 0px` | `--shadow-subtle-2` |
| subtle-3 | `rgba(76, 120, 250, 0.14) 0px 0px 0px 3px` | `--shadow-subtle-3` |
| xl | `rgba(0, 0, 0, 0.09) 0px 4px 40px 0px` | `--shadow-xl` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 16px
- **Element gap:** 8px

## Components

### Dark Hero Section
**Role:** Opening viewport with product proof

Full-bleed #080b12 background, 1200px inner content. Left-aligned: 54px Atacama VAR display headline in #ffffff, 18px PP Neue Montreal subhead in #4f535e-equivalent muted gray. Two CTAs side by side — white filled 'Request a demo →' and ghost 'Try now'. Below the fold, a tabs row (Deal Sourcing active) and the data table mockup bleeds edge-to-edge with a slight #dbdbee tint on the table surface.

### Hero Primary Button
**Role:** Primary action in the dark hero

Filled white (#ffffff) background, #080b12 text, 4px radius, weight 450 PP Neue Montreal at 14px, 8px vertical / 16px horizontal padding, optional right arrow (→). Tracking -0.01em. Sits against the dark hero so the inversion does the heavy lifting — no shadow, no border.

### Hero Secondary Button
**Role:** Secondary action in the dark hero

Transparent fill, #ffffff text, 4px radius, weight 450 PP Neue Montreal at 14px, 8px vertical / 16px horizontal padding. The lighter visual weight makes it read as the low-commitment companion to the filled primary.

### Blue Accent Button
**Role:** Sole chromatic action in the system (Enrich, Step pills)

Filled #0a33ff background, #ffffff text, 4px radius, weight 500 PP Neue Montreal at 13–14px, 6px vertical / 12px horizontal padding. Used for the 'Enrich' action on data tables and the active step indicator. Restrict to one per surface — this is the system's only saturated fill.

### Section Heading
**Role:** Display heading on light body sections

Atacama VAR weight 317–370 at 44–54px, color #080b12, letter-spacing -0.06em to -0.05em, line-height 1.0–1.1. The unusually light weight for such a large size is the anti-convention choice — most sites use 600–700 here, the whisper-weight creates authority through restraint.

### Eyebrow Label
**Role:** All-caps pre-headline label above section titles

PP Neue Montreal weight 500, 12px, letter-spacing 0.14em, color #6c6d73. Sits 16–24px above the section heading, creating a two-step vertical entry into each section.

### Problem List Item
**Role:** X-marked list in 'The Old Way' section

Thin gray X glyph in #848a9c, 16px PP Neue Montreal body 400 in #2b2b2c, 8px vertical gap between items. The cross icon is rendered as a simple SVG, not emoji — stroke weight ~1.5px.

### Solution List Item
**Role:** Checkmarked list in 'With Paradigm' section

Check glyph in #0a33ff, 16px PP Neue Montreal body 400 in #2b2c2c, 8px vertical gap. The shift from gray X to blue ✓ is the entire visual argument of the section.

### Category Tag Badge
**Role:** Inline categorization label in data tables

4px radius, 2px vertical / 8px horizontal padding. Background is a light pastel wash (#ffe6f7, #e2efff, #e4f3e2, #faeed1) and text+border is the matching dark ink (#600537, #061353, #03350f, #423301). 12px PP Neue Montreal 500. The two-color badge (dark text on pastel fill) is the only color-expression channel in the system.

### Status Fit Pill
**Role:** Deal fit indicator (Highest / High / Low)

4px radius, 4px vertical / 8px horizontal padding, 12px PP Neue Montreal 500. 'Highest' and 'High' use the Forest Ink (#03350f) text on a soft border; 'Low' uses Crimson Ink (#580101). The pill is intentionally quieter than a full badge — it sits inline in a dense data row.

### Tabs Row
**Role:** Category navigation above the data table

100px radius pills on a transparent bar. Inactive tab: 14px PP Neue Montreal 450 in #6c6d73 with a 1px #b5b9c4 hairline border. Active tab: same dimensions but #080b12 text with a #080b12 1px border and a white #ffffff fill background. The pill shape is the only break from the system's 4px geometry.

### Data Table
**Role:** Primary product interface

Full-width table on #ffffff surface with #dbdbee 1px row dividers (46+ uses confirm this is the intentional tinted rule). Header row in 13px PP Neue Montreal 500 #6c6d73, body cells in 14px 400 #080b12 with tabular numerals (tnum). Row height ~44px, cell padding 9–12px vertical. First column uses a #0a33ff square checkbox in the selected row.

### Step Indicator
**Role:** Sequential step pills in 'Encode your best thinking' section

100px radius. Active step: filled #0a33ff with #ffffff 'Step 1' label. Inactive steps: #ffffff fill with 1px #b5b9c4 border and #2b2b2c text. 13px PP Neue Montreal 500, 6px vertical / 12px horizontal padding. The active state is the only place outside the hero where #0a33ff appears as a fill.

### Product Mockup Card
**Role:** Screenshot of the product embedded in body sections

#ffffff surface, 4px radius, the signature elevation: rgb(255,255,255) 0 0 24px inset — a white inner glow that makes the card appear to sit on a soft light source from within. Often paired with the 135deg subtle blue gradient (rgb(123,149,196) → rgb(223,236,255)) as the card backdrop, giving product mockups a frosted-screen quality.

### Trust Logo Bar
**Role:** Social proof strip of client logos

Light #f6f7f8 band, centered. Eyebrow text 'Trusted by 10,000+ decision makers...' in 14px PP Neue Montreal 400 #6c6d73. Logos are monochrome #080b12, rendered at uniform ~24px height, spaced 64–80px apart in a single horizontal row.

## Do's and Don'ts

### Do
- Use Atacama VAR for every display heading 44px and above at weight 317–370 with -0.06em tracking — the whisper-weight serif is the system's defining typographic choice
- Use 4px border-radius on all buttons, cards, badges, and inputs; reserve 100px only for tabs and step pills
- Pair every status badge as a dark saturated text + matching 1px border on a light pastel wash — never invert this (no dark fills with light text)
- Apply the white 24px inner-glow (rgb(255,255,255) 0 0 24px inset) on any product mockup card — this is the signature elevation
- Enable tabular numerals (tnum) on PP Neue Montreal for all numeric data in tables and stat blocks
- Use #0a33ff sparingly — one accent per surface, only on the Enrich action, active tab, active step, and selected row check
- Use letter-spacing 0.14–0.15em on all 12px PP Neue Montreal 500 eyebrow labels above section headings

### Don't
- Don't use rounded pill buttons on cards or actions — 4px corners are the system geometry, pills are reserved for tabs and step indicators
- Don't use drop shadows for depth — depth comes from the white inner-glow and the blue 135deg gradient backdrop, not from elevation
- Don't use #0a33ff as a filled CTA background on landing sections — reserve it for in-product actions and active states only
- Don't use emoji or filled multicolor icons — icons are thin-stroke outlined SVGs in #080b12 or #6c6d73
- Don't center-align body text or section content — the layout rhythm is left-aligned with an asymmetric image companion
- Don't introduce new saturated colors — the only chromatic channels are #0a33ff and the six dark-ink badge colors; everything else stays in warm and cool grays
- Don't use auto-animation or scroll-triggered effects — the system has no motion personality and relies on static composition
- Don't set display headings in PP Neue Montreal or Inter — the Atacama VAR serif is mandatory for any text 44px or larger

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Paper | `#ffffff` | Default page background and primary card surface |
| 1 | Fog | `#f6f7f8` | Quiet lift for trust bars, footer bands, and secondary panels |
| 2 | Lavender Mist | `#dbdbee` | Tinted surface for the data table interior — the barely-violet tint signals 'this is a data environment' without being decorative |
| 3 | Midnight | `#080b12` | Hero and dark section backgrounds — anchors the system's most dramatic moments |

## Elevation

- **Product Mockup Card:** `rgb(255, 255, 255) 0px 0px 24px 0px inset`
- **Standard Card:** `rgba(0, 0, 0, 0.06) 0px 1px 3px 0px`
- **Badge:** `rgba(0, 0, 0, 0.04) 0px 1px 3px 0px`
- **Focus Ring:** `rgba(76, 120, 250, 0.14) 0px 0px 0px 3px`
- **Elevated Feature Card:** `rgba(0, 0, 0, 0.09) 0px 4px 40px 0px`

## Imagery

Imagery is product-led, not lifestyle. The page embeds actual screenshots of the data table and enriched company profile inside card frames, with the signature white inner-glow making them feel like frosted screens. No photography of people, no abstract 3D renders, no stock illustrations. The brand mark is a small dark square with a centered glyph. Icons throughout are thin-stroke outlined SVGs (stroke weight ~1.5px), monochrome in #080b12 or #6c6d73. Trust logos are rendered as monochrome vector marks in #080b12. Visual density is low — text and data structures carry the page, with imagery playing a supporting evidence role rather than a decorative one.

## Layout

The page uses a max-width 1200px contained layout with sections separated by 80px vertical gaps. The hero is full-bleed #080b12 with left-aligned content (headline left, subhead and CTAs below), transitioning via a tabbed data table that bleeds edge-to-edge. Body sections follow a strict alternating rhythm: text-left/image-right ('The Old Way') then image-left/text-right ('With Paradigm'), each anchored by a 44–54px Atacama VAR heading, a 12px all-caps eyebrow above, and 4 short list items below. The trust logo bar is a centered single row on a #f6f7f8 band. The step section is a centered headline over a horizontal row of three step pills. Navigation is a minimal top bar: brand mark left, four nav items center, 'Log in' text and 'Request a demo' outlined button right. The entire system is grid-disciplined — no masonry, no overlapping panels, no asymmetric experimental compositions.

## Agent Prompt Guide

**Quick Color Reference**
- text: #080b12
- background: #ffffff
- surface tint: #f6f7f8
- border (table/data): #dbdbee
- border (neutral): #b5b9c4
- accent: #0a33ff
- primary action: #7f90ce (filled action)

**3-5 Example Component Prompts**

1. Create a Primary Action Button: #7f90ce background, #020202 text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.

2. **Data Table Row** — Full-width table on #ffffff, 1px #dbdbee row dividers, ~44px row height, 12px cell padding vertical. Header: 13px PP Neue Montreal weight 500, #6c6d73, tnum enabled. Body cell: 14px weight 400, #080b12. Status cell uses a 4px-radius pill: 4px 8px padding, 12px weight 500, Forest Ink #03350f text with 1px #03350f border for 'Highest'/'High', Crimson Ink #580101 for 'Low'. Right-edge cell holds a filled #0a33ff Enrich button: 4px radius, 6px 12px padding, 13px weight 500, #ffffff text.

3. **Section with Eyebrow + Heading + Checklist** — Light #ffffff background, max-width 1200px. Eyebrow: 12px PP Neue Montreal weight 500, letter-spacing 0.14em, #6c6d73, 24px below sits a 48px Atacama VAR weight 370 heading in #080b12, letter-spacing -2.88px, line-height 1.1. Below: 4 list items with 8px row gap, each 16px PP Neue Montreal weight 400 in #2b2b2c. List marker is an SVG check in #0a33ff (stroke 1.5px) for solution sections, or a thin X in #848a9c for problem sections.

4. **Product Mockup Card** — 4px radius, #ffffff surface, shadow stack: rgb(255,255,255) 0 0 24px inset (signature inner glow). Optional backdrop uses linear-gradient(135deg, #7b95c4, #dfecff) at low opacity. Card holds a product screenshot filling the interior with 16px inset padding around it. To the right or left of the card, a 44px Atacama VAR section heading and 4-item check list, separated by 64px horizontal gap.

5. **Trust Logo Bar** — #f6f7f8 full-width band, 48px vertical padding. Center-aligned eyebrow: 14px PP Neue Montreal weight 400, #6c6d73. Single horizontal row of 5 logos below, each rendered as monochrome #080b12 SVG at uniform 24px height, 72px column gap between logos, centered as a group.

## Similar Brands

- **Linear** — Same dark-hero-into-light-body structure, 4px geometry, hairline borders, and single-accent-color discipline
- **Retool** — Data-table-dense interfaces with tabular numerals and pastel status badges for row-level categorization
- **Anthropic** — Editorial serif display headings paired against a workhorse sans, the research-publication voice in a product interface
- **Vercel** — Restrained neutral palette with one vivid accent, sharp 4px corners, and a preference for inner glow over drop shadow
- **Notion** — Comfortable light density, #f6f7f8 quiet surfaces, and minimal decorative chrome — content and tables are the design

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-midnight-ink: #080b12;
  --color-paper: #ffffff;
  --color-fog: #f6f7f8;
  --color-pearl: #edeef1;
  --color-stone: #d9d9d9;
  --color-lavender-mist: #dbdbee;
  --color-mist: #b5b9c4;
  --color-pewter: #9898ae;
  --color-steel: #848a9c;
  --color-smoke: #acacae;
  --color-ash: #9d9ea1;
  --color-iron: #606167;
  --color-graphite: #6c6d73;
  --color-slate: #4f535e;
  --color-charcoal: #2b2b2c;
  --color-electric-iris: #0a33ff;
  --color-periwinkle: #7f90ce;
  --color-hero-dawn: #010b18;
  --gradient-hero-dawn: linear-gradient(180deg, #010b18 0%, #010818 16%, #103b91 49%, #4c7de8 78%, #bad0ff 97%);
  --color-sky-whisper: #e2efff;
  --color-sapphire-ink: #061353;
  --color-mint-whisper: #e4f3e2;
  --color-forest-ink: #03350f;
  --color-sprout-whisper: #d6ffe0;
  --color-saffron-whisper: #faeed1;
  --color-amber-ink: #423301;
  --color-blossom-whisper: #ffe6f7;
  --color-mulberry-ink: #600537;
  --color-plum-ink: #21034d;
  --color-crimson-ink: #580101;
  --color-apricot-whisper: #fee8dd;
  --color-russet-ink: #581c01;

  /* Typography — Font Families */
  --font-atacama-var: 'Atacama VAR', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-pp-neue-montreal: 'PP Neue Montreal', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-suisse-intl: 'Suisse Intl', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --tracking-caption: -0.12px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.5;
  --tracking-body-sm: -0.14px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.16px;
  --text-subheading: 18px;
  --leading-subheading: 1.4;
  --tracking-subheading: -0.18px;
  --text-heading-sm: 21px;
  --leading-heading-sm: 1.3;
  --tracking-heading-sm: -0.21px;
  --text-heading-lg: 44px;
  --leading-heading-lg: 1.1;
  --tracking-heading-lg: -2.64px;
  --text-display: 54px;
  --leading-display: 1;
  --tracking-display: -2.7px;

  /* Typography — Weights */
  --font-weight-w317: 317;
  --font-weight-w370: 370;
  --font-weight-regular: 400;
  --font-weight-w450: 450;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-5: 5px;
  --spacing-6: 6px;
  --spacing-7: 7px;
  --spacing-8: 8px;
  --spacing-9: 9px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-14: 14px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-60: 60px;
  --spacing-120: 120px;
  --spacing-188: 188px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 16px;
  --element-gap: 8px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-full: 100px;

  /* Named Radii */
  --radius-tabs: 100px;
  --radius-cards: 4px;
  --radius-badges: 4px;
  --radius-buttons: 4px;
  --radius-feature-cards: 16px;

  /* Shadows */
  --shadow-lg: rgb(255, 255, 255) 0px 0px 24px 0px inset;
  --shadow-subtle: rgba(0, 0, 0, 0.06) 0px 1px 3px 0px;
  --shadow-subtle-2: rgba(0, 0, 0, 0.04) 0px 1px 3px 0px;
  --shadow-subtle-3: rgba(76, 120, 250, 0.14) 0px 0px 0px 3px;
  --shadow-xl: rgba(0, 0, 0, 0.09) 0px 4px 40px 0px;

  /* Surfaces */
  --surface-paper: #ffffff;
  --surface-fog: #f6f7f8;
  --surface-lavender-mist: #dbdbee;
  --surface-midnight: #080b12;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-midnight-ink: #080b12;
  --color-paper: #ffffff;
  --color-fog: #f6f7f8;
  --color-pearl: #edeef1;
  --color-stone: #d9d9d9;
  --color-lavender-mist: #dbdbee;
  --color-mist: #b5b9c4;
  --color-pewter: #9898ae;
  --color-steel: #848a9c;
  --color-smoke: #acacae;
  --color-ash: #9d9ea1;
  --color-iron: #606167;
  --color-graphite: #6c6d73;
  --color-slate: #4f535e;
  --color-charcoal: #2b2b2c;
  --color-electric-iris: #0a33ff;
  --color-periwinkle: #7f90ce;
  --color-hero-dawn: #010b18;
  --color-sky-whisper: #e2efff;
  --color-sapphire-ink: #061353;
  --color-mint-whisper: #e4f3e2;
  --color-forest-ink: #03350f;
  --color-sprout-whisper: #d6ffe0;
  --color-saffron-whisper: #faeed1;
  --color-amber-ink: #423301;
  --color-blossom-whisper: #ffe6f7;
  --color-mulberry-ink: #600537;
  --color-plum-ink: #21034d;
  --color-crimson-ink: #580101;
  --color-apricot-whisper: #fee8dd;
  --color-russet-ink: #581c01;

  /* Typography */
  --font-atacama-var: 'Atacama VAR', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-pp-neue-montreal: 'PP Neue Montreal', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-suisse-intl: 'Suisse Intl', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --tracking-caption: -0.12px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.5;
  --tracking-body-sm: -0.14px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.16px;
  --text-subheading: 18px;
  --leading-subheading: 1.4;
  --tracking-subheading: -0.18px;
  --text-heading-sm: 21px;
  --leading-heading-sm: 1.3;
  --tracking-heading-sm: -0.21px;
  --text-heading-lg: 44px;
  --leading-heading-lg: 1.1;
  --tracking-heading-lg: -2.64px;
  --text-display: 54px;
  --leading-display: 1;
  --tracking-display: -2.7px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-5: 5px;
  --spacing-6: 6px;
  --spacing-7: 7px;
  --spacing-8: 8px;
  --spacing-9: 9px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-14: 14px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-60: 60px;
  --spacing-120: 120px;
  --spacing-188: 188px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-full: 100px;

  /* Shadows */
  --shadow-lg: rgb(255, 255, 255) 0px 0px 24px 0px inset;
  --shadow-subtle: rgba(0, 0, 0, 0.06) 0px 1px 3px 0px;
  --shadow-subtle-2: rgba(0, 0, 0, 0.04) 0px 1px 3px 0px;
  --shadow-subtle-3: rgba(76, 120, 250, 0.14) 0px 0px 0px 3px;
  --shadow-xl: rgba(0, 0, 0, 0.09) 0px 4px 40px 0px;
}
```
