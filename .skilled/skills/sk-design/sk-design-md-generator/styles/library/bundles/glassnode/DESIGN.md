# Glassnode — Style Reference
> Bloomberg terminal in a glass-walled research lab

**Theme:** mixed

Glassnode reads as a monochrome institutional research console — a Bloomberg terminal dressed for a product launch page. The canvas is cool light gray, type is set in Inter at restrained sizes, and the only chromatic hint is a whisper of pale lavender that appears as accent washes and soft borders. Pages alternate between light content bands and dark statement bands, creating a study/dashboard rhythm where data and editorial copy trade places. Components are near-rectangular: 2px radii, hairline 1px borders, almost no shadow, and buttons that are solid black or ghost outlines rather than colorful pills. The system communicates authority through typographic weight and information density, not through color.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Pure Black | `#000000` | `--color-pure-black` | Dark supporting neutral for text, icons, and strong contrast. Do not promote it to the primary CTA color |
| Obsidian | `#1a1a1a` | `--color-obsidian` | Dark section backgrounds, footer, dark band surfaces |
| Graphite | `#333333` | `--color-graphite` | Secondary headings, dark surface text, nav text on dark |
| Iron | `#5a5a5a` | `--color-iron` | Muted body copy, descriptions, helper text |
| Slate | `#666666` | `--color-slate` | Secondary body text, de-emphasized paragraphs |
| Steel | `#808080` | `--color-steel` | Placeholder text, disabled states, input borders |
| Fog | `#a0a0a0` | `--color-fog` | Light muted text, icon strokes, subtle borders |
| Ash | `#bfbfbf` | `--color-ash` | Light dividers, icon strokes on light surfaces, nav borders |
| Mist | `#dedfe1` | `--color-mist` | Hairline borders, card outlines, subtle dividers across all surfaces |
| Cloud | `#edeff2` | `--color-cloud` | Page canvas, default body background behind content bands |
| Paper | `#f7f8fa` | `--color-paper` | Elevated card surface, subtle inset panels, light section background |
| White | `#ffffff` | `--color-white` | Card surfaces, input fields, highest elevation surface, text on dark |
| Glacier Tint | `#e2e7fc` | `--color-glacier-tint` | Soft accent wash, highlight background behind emphasis spans, subtle selected state |
| Badge Slate | `#6f6f6f` | `--color-badge-slate` | Badge text and small-tag foreground |

## Tokens — Typography

### Inter — Entire interface — body copy, navigation, buttons, badges, cards, subheadings, UI labels · `--font-inter`
- **Substitute:** Inter (Google Fonts) — direct substitute, already on the system
- **Weights:** 400, 500, 700
- **Sizes:** 12px, 14px, 16px, 20px, 24px, 32px
- **Line height:** 1.0 (badges/icons) · 1.2 (tight headings) · 1.3 (buttons/nav) · 1.4 (subheadings) · 1.5 (body paragraphs)
- **Letter spacing:** normal across all sizes; tracking is default Inter, not tightened for display
- **Role:** Entire interface — body copy, navigation, buttons, badges, cards, subheadings, UI labels

### Fraktion — Hero display headline only — a single, custom, weight-700 face for the primary H1 · `--font-fraktion`
- **Substitute:** Söhne Breit Halbfett or ABC Diatype Mono Bold for closest geometric-bold fallback
- **Weights:** 700
- **Sizes:** 56px
- **Line height:** 1.2
- **Role:** Hero display headline only — a single, custom, weight-700 face for the primary H1

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.4 | — | `--text-caption` |
| body-sm | 14px | 1.5 | — | `--text-body-sm` |
| body | 16px | 1.5 | — | `--text-body` |
| subheading | 20px | 1.4 | — | `--text-subheading` |
| heading-sm | 24px | 1.3 | — | `--text-heading-sm` |
| heading | 32px | 1.2 | — | `--text-heading` |
| display | 56px | 1.2 | — | `--text-display` |

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
| 72 | 72px | `--spacing-72` |
| 80 | 80px | `--spacing-80` |

### Border Radius

| Element | Value |
|---------|-------|
| nav | 2px |
| tags | 2px |
| cards | 2px |
| inputs | 2px |
| buttons | 2px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| sm | `rgba(0, 0, 0, 0.04) 0px 2px 4px 0px` | `--shadow-sm` |
| sm-2 | `rgba(0, 0, 0, 0.04) 0px 2px 4px 0px, rgba(0, 0, 0, 0.08) ...` | `--shadow-sm-2` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 16px
- **Element gap:** 16px

## Components

### Primary Filled Button
**Role:** Highest-emphasis action — main conversion (Get in touch, Contact us, Send me free research)

Background #000000 or #1a1a1a, text #ffffff, Inter 16px weight 500, padding 12px 24px, border-radius 2px, subtle box-shadow rgba(0,0,0,0.04) 0px 2px 4px. No border, no gradient. Tight, near-rectangular silhouette.

### Ghost Outline Button
**Role:** Secondary action paired with primary (Launch Studio, nav CTAs)

Background transparent or #ffffff, text #000000, border 1px #000000 or #dedfe1, Inter 14-16px weight 500, padding 10px 20px, border-radius 2px. Inverts to white-on-dark on dark bands.

### Dark Band CTA
**Role:** Inline action on dark sections (Subscribe form submit)

Background #ffffff, text #000000, Inter 16px weight 500, padding 12px 24px, border-radius 2px, no shadow. The inverse of the primary button — used on Obsidian sections.

### Partner Report Card
**Role:** Content card for research reports, case studies, featured publications

Background #ffffff, 1px border #dedfe1, border-radius 2px, no shadow. Cover image fills top, then 16px padding wrapping partner label (Inter 12px uppercase tracking), title (Inter 20px weight 700 #000000), and description (Inter 14px #5a5a5a, 3-line clamp).

### Feature Block (Dark Band)
**Role:** Two-column feature section on dark background with illustration and bullet list

Background #1a1a1a, two-column grid with text left, abstract chart illustration right. Heading Inter 24px weight 700 #ffffff, description Inter 16px #a0a0a0, bullet list with Iron-stroke icons in #ffffff.

### Hero Chart Widget
**Role:** Live data widget embedded in the hero — product credibility artifact

Background #ffffff, 1px border #dedfe1, border-radius 2px, subtle layered shadow rgba(0,0,0,0.04) 0px 2px 4px, rgba(0,0,0,0.08) 0px 8px 32px. Contains a tab header, line chart in #4a6cf7 over a pale #e2e7fc fill, and a search/select input at the base.

### Top Navigation
**Role:** Primary site nav with logo, menu, and dual CTA

Background #ffffff, 1px bottom border #dedfe1, height ~64px. Logo left in Inter 20px weight 700 lowercase. Center/right nav links in Inter 14px weight 500 #333333 with 29px horizontal gap. Ends with a ghost outline (Launch Studio) and a filled dark button (Contact us).

### Announcement Bar
**Role:** Full-width dark band above nav for live news/launches

Background #1a1a1a, centered Inter 14px weight 500 #ffffff text, single line, with an inline link in white. Padding 8-10px vertical.

### Subscribe Form
**Role:** Email capture on dark closing band

Dark band #1a1a1a, single-line input: background #ffffff, border 1px #dedfe1, radius 2px, placeholder #808080, paired flush-right with white-filled submit button. No floating labels, no decorative icons.

### Logo Strip
**Role:** Trust-by-association row of partner/brand logos

Sits on #edeff2 canvas, single horizontal row, 5 logos evenly distributed. Logos rendered in #000000 monochrome at uniform height (~24px), no color variants.

### Footer
**Role:** Site footer with link columns and legal

Background #1a1a1a, text in Inter 14px weight 400 #a0a0a0 and #ffffff for headings, 1px top border not used — sits directly on dark surface. Multi-column link grid, compact spacing.

### Badge / Tag
**Role:** Small uppercase label (Partner Reports, category tags)

Inter 12px weight 500 #6f6f6f, uppercase, no background, no border, no radius. Functions as a typographic marker, not a chip.

### Input Field
**Role:** Text input — search, email, ticker selector

Background #ffffff, border 1px #dedfe1, border-radius 2px, padding 10px 12px, Inter 14px #000000, placeholder #808080. Focus state tightens border to #000000 with no glow ring.

## Do's and Don'ts

### Do
- Use #000000 for primary button fills and #ffffff for text on dark — never introduce a chromatic CTA color
- Set all radii to 2px; the system's near-rectangular silhouette is signature, do not round beyond 2px
- Default to a 1px #dedfe1 border to separate surfaces; reach for shadow only on the hero chart widget and primary buttons
- Alternate light and dark bands at the section level to create the dashboard editorial rhythm
- Use Inter weight 500 for UI controls and weight 700 for headings; reserve the custom display face for the 56px hero H1
- Keep the canvas #edeff2 and elevated cards #ffffff — never invert the surface stack
- Treat #e2e7fc as the only accent — apply it as a soft wash behind a word in a headline or as a fill under a chart line

### Don't
- Do not introduce saturated brand colors, gradients, or colored icon fills — the system is monochrome by intent
- Do not use border-radius above 2px; pills, 8px cards, or 16px tiles break the institutional feel
- Do not stack colored shadows or glow effects; the only legitimate shadow is the 2-4px button drop and the layered hero widget drop
- Do not use Fraktion for anything below the hero H1 — the custom face is a single-impact choice, not a system font
- Do not place white cards on white backgrounds without the #dedfe1 border — surfaces must be defined by hairline, not by fill change
- Do not break the 8px spacing scale; avoid arbitrary values between the listed tokens (2/4/6/8/10/12/16/24/32)
- Do not use emoji, colored illustrations, or photography in product UI — the visual language is charts and type only

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas | `#edeff2` | Page background between content bands |
| 1 | Surface | `#f7f8fa` | Light section background, subtle inset panels |
| 2 | Card | `#ffffff` | White card surface, input fields, top of light stack |
| 3 | Dark Band | `#1a1a1a` | Dark statement sections, footer, announcement bar |
| 4 | Accent Wash | `#e2e7fc` | Pale lavender highlight behind emphasis and chart fills |

## Elevation

- **Primary Filled Button:** `rgba(0, 0, 0, 0.04) 0px 2px 4px 0px`
- **Hero Chart Widget:** `rgba(0, 0, 0, 0.04) 0px 2px 4px 0px, rgba(0, 0, 0, 0.08) 0px 8px 32px 0px`

## Imagery

Imagery is dominated by data visualizations rather than photography: line charts with blue strokes over pale lavender fills, abstract line illustrations on dark bands suggesting market trajectories, and rectangular report covers with deep navy gradients. The hero product widget is the visual hero — a real chart UI lifted directly from the product. Partner logos are monochrome black on light gray. Photography, illustration, and decorative graphics are absent; the visual language is dashboard-native.

## Layout

Max-width 1200px centered container with full-bleed light and dark bands. The page opens with a hero band (light gray canvas, 2-column split: left headline + description + CTA, right floating chart widget) followed by a dark band (near-black, 2-column alternating feature blocks with chart illustrations). A partner report grid sits on a light band (4-column card row). The page closes with a centered dark subscribe band. Vertical rhythm: ~80px section gaps, alternating light/dark/light/dark bands create a dashboard-meets-editorial cadence. Navigation is a top bar with logo left, menu center-right, and dual CTA (ghost + filled) at the far right.

## Agent Prompt Guide

**Quick Color Reference**
- text: #000000 (on light) / #ffffff (on dark)
- background: #edeff2 (canvas) / #ffffff (cards)
- border: #dedfe1 (hairline) / #000000 (emphasis)
- accent: #e2e7fc (soft wash only)
- primary action: no distinct CTA color

**3 Example Component Prompts**
No distinct primary action color was observed; use the extracted neutral button treatments instead of inventing a filled CTA color.
2. Build a 4-column partner report card grid on a #edeff2 canvas: each card is #ffffff with 1px #dedfe1 border, 2px radius, 16px padding. Cover image fills the top, followed by a 12px uppercase #6f6f6f Inter label, a 20px Inter weight 700 #000000 title, and a 14px Inter #5a5a5a description clipped to 3 lines.
3. Build a dark subscribe band: #1a1a1a background, full-width, centered. 32px Inter weight 700 #ffffff headline with one word wrapped in a #e2e7fc background highlight. 16px Inter #a0a0a0 subtext. Single inline form: white #ffffff input with 1px #dedfe1 border, 2px radius, #808080 placeholder, paired flush with a white-filled submit button (background #ffffff, text #000000, 2px radius).

## Similar Brands

- **Chainalysis** — Same institutional crypto-analytics posture — near-monochrome palette, hairline borders, dark-band editorial sections, Inter-family type
- **Messari** — Shared research-console feel: light canvas, dark statement bands, chart-as-hero imagery, restrained single-accent approach
- **The Block** — Identical dashboard-editorial hybrid: black/white/gray palette, 2-column feature blocks, data visualizations as primary imagery
- **Bloomberg Terminal** — Same data-density ethos expressed as a marketing site — achromatic surfaces, weight-700 display type, near-zero radius, border-defined cards
- **Koyfin** — Comparable financial-data brand language: muted grays, single blue accent, flat components, information density over decoration

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-pure-black: #000000;
  --color-obsidian: #1a1a1a;
  --color-graphite: #333333;
  --color-iron: #5a5a5a;
  --color-slate: #666666;
  --color-steel: #808080;
  --color-fog: #a0a0a0;
  --color-ash: #bfbfbf;
  --color-mist: #dedfe1;
  --color-cloud: #edeff2;
  --color-paper: #f7f8fa;
  --color-white: #ffffff;
  --color-glacier-tint: #e2e7fc;
  --color-badge-slate: #6f6f6f;

  /* Typography — Font Families */
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-fraktion: 'Fraktion', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.4;
  --text-body-sm: 14px;
  --leading-body-sm: 1.5;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-subheading: 20px;
  --leading-subheading: 1.4;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.3;
  --text-heading: 32px;
  --leading-heading: 1.2;
  --text-display: 56px;
  --leading-display: 1.2;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
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
  --spacing-72: 72px;
  --spacing-80: 80px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 16px;
  --element-gap: 16px;

  /* Border Radius */
  --radius-sm: 2px;

  /* Named Radii */
  --radius-nav: 2px;
  --radius-tags: 2px;
  --radius-cards: 2px;
  --radius-inputs: 2px;
  --radius-buttons: 2px;

  /* Shadows */
  --shadow-sm: rgba(0, 0, 0, 0.04) 0px 2px 4px 0px;
  --shadow-sm-2: rgba(0, 0, 0, 0.04) 0px 2px 4px 0px, rgba(0, 0, 0, 0.08) 0px 8px 32px 0px;

  /* Surfaces */
  --surface-canvas: #edeff2;
  --surface-surface: #f7f8fa;
  --surface-card: #ffffff;
  --surface-dark-band: #1a1a1a;
  --surface-accent-wash: #e2e7fc;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-pure-black: #000000;
  --color-obsidian: #1a1a1a;
  --color-graphite: #333333;
  --color-iron: #5a5a5a;
  --color-slate: #666666;
  --color-steel: #808080;
  --color-fog: #a0a0a0;
  --color-ash: #bfbfbf;
  --color-mist: #dedfe1;
  --color-cloud: #edeff2;
  --color-paper: #f7f8fa;
  --color-white: #ffffff;
  --color-glacier-tint: #e2e7fc;
  --color-badge-slate: #6f6f6f;

  /* Typography */
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-fraktion: 'Fraktion', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.4;
  --text-body-sm: 14px;
  --leading-body-sm: 1.5;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-subheading: 20px;
  --leading-subheading: 1.4;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.3;
  --text-heading: 32px;
  --leading-heading: 1.2;
  --text-display: 56px;
  --leading-display: 1.2;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-56: 56px;
  --spacing-72: 72px;
  --spacing-80: 80px;

  /* Border Radius */
  --radius-sm: 2px;

  /* Shadows */
  --shadow-sm: rgba(0, 0, 0, 0.04) 0px 2px 4px 0px;
  --shadow-sm-2: rgba(0, 0, 0, 0.04) 0px 2px 4px 0px, rgba(0, 0, 0, 0.08) 0px 8px 32px 0px;
}
```
