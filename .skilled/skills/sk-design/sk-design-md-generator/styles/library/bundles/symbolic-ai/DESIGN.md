# Symbolic.ai — Style Reference
> editorial newsroom on cream paper. A broadsheet masthead in serif type, floating on warm off-white stock, with soft tan shadows that make every card feel like it was set in letterpress — not rendered.

**Theme:** light

Symbolic.ai reads like a printed broadsheet reimagined as software: a warm cream canvas (#fdfcf5) with pure black ink type, soft tan shadows instead of cool gray, and a mix of editorial serif headlines (Suisse Works) with a humanist sans (Open Runde) for body and UI. The interface never feels clinical — cards float gently on the cream paper, shadows carry a warm khaki tint (#d5d0b8) that makes even simple elevations feel printed rather than digital. Color is rationed: black handles all primary actions and borders, a deep teal signals verified/correct product states, and a single vivid violet marks AI thinking in progress. Red appears only as a stamp accent. The system trusts whitespace and typography weight to create hierarchy more than color or heavy elevation.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Canvas Cream | `#fdfcf5` | `--color-canvas-cream` | Primary page canvas and white card surfaces. |
| Ink Black | `#000000` | `--color-ink-black` | Primary text, hairline borders, icon strokes, and the single CTA fill — black-on-cream is the system's only action color, no chromatic buttons |
| Paper White | `#ffffff` | `--color-paper-white` | Card surfaces, elevated content layers, input fills — the brighter sheet the cream canvas holds |
| Charcoal | `#4c4c4a` | `--color-charcoal` | Secondary borders, muted body text, link underline tones |
| Slate Black | `#333231` | `--color-slate-black` | Strong secondary borders and slightly softer heading text — separates structural dividers from Ink Black |
| Warm Gray | `#7f7e7b` | `--color-warm-gray` | Captions, helper text, disabled states, tertiary borders |
| Mid Stone | `#656562` | `--color-mid-stone` | Muted body copy and secondary dividers |
| Soft Sand | `#f5f3e9` | `--color-soft-sand` | Subtle section bands, recessed surfaces, and the lighter shadow base |
| Khaki Shadow | `#edeadd` | `--color-khaki-shadow` | The warm shadow tint used across all card elevations — replaces standard cool gray |
| Sandstone | `#e5e2d0` | `--color-sandstone` | Faint horizontal rules and gentle background tints |
| Lavender Mist | `#e2e0e4` | `--color-lavender-mist` | Cool-leaning hairline borders, subtle separation lines |
| Editorial Teal | `#10756a` | `--color-editorial-teal` | Teal wash for highlight backgrounds, decorative bands, and soft emphasis behind content. |
| AI Violet | `#6938ef` | `--color-ai-violet` | Violet outline accent for tags, dividers, and focused UI edges. |
| Deep Violet | `#6a27d9` | `--color-deep-violet` | Dark-mode variant of AI Violet for borders and stronger emphasis on processing states |
| Stamp Red | `#f42c2b` | `--color-stamp-red` | Red wash for highlight backgrounds, decorative bands, and soft emphasis behind content. Do not promote it to the primary CTA color |

## Tokens — Typography

### sans-serif — sans-serif — detected in extracted data but not described by AI · `--font-sans-serif`
- **Weights:** 400
- **Sizes:** 12px
- **Line height:** 1.2
- **Role:** sans-serif — detected in extracted data but not described by AI

### Suisse Works — Editorial serif for all headlines and display type — Book (450) carries the masthead voice at 28–58px, Medium (500) for sub-headings at 20px. Suisse Works' high contrast and sharp serifs give the interface a printed-broadsheet authority that no sans could replicate. · `--font-suisse-works`
- **Substitute:** GT Sectra, Tiempos Headline, Source Serif Pro
- **Weights:** 450, 500, 700
- **Sizes:** 20px, 28px, 36px, 58px
- **Line height:** 1.30–1.50
- **OpenType features:** `"blwf", "cv03", "cv04", "cv09", "cv11"`
- **Role:** Editorial serif for all headlines and display type — Book (450) carries the masthead voice at 28–58px, Medium (500) for sub-headings at 20px. Suisse Works' high contrast and sharp serifs give the interface a printed-broadsheet authority that no sans could replicate.

### Open Runde — Humanist sans for body, navigation, links, and most UI labels. Open Runde's slightly rounded geometric forms soften the editorial serif above — Regular (400) for body, Semibold (600) for nav emphasis, Bold (700) for inline labels. The wide x-height at 16px with 1.63 line-height creates comfortable reading density. · `--font-open-runde`
- **Substitute:** Inter, Söhne, General Sans
- **Weights:** 400, 500, 600, 700, 900
- **Sizes:** 12px, 14px, 16px
- **Line height:** 1.50–1.71
- **OpenType features:** `"blwf", "cv03", "cv04", "cv09", "cv11"`
- **Role:** Humanist sans for body, navigation, links, and most UI labels. Open Runde's slightly rounded geometric forms soften the editorial serif above — Regular (400) for body, Semibold (600) for nav emphasis, Bold (700) for inline labels. The wide x-height at 16px with 1.63 line-height creates comfortable reading density.

### Geist Mono — Monospaced labels for product state indicators ('Rewriting...', 'Transcribing...') and technical metadata. Geist Mono at 14px is intentionally small — it's a whisper of machinery inside the editorial voice, not a visual block. · `--font-geist-mono`
- **Substitute:** JetBrains Mono, IBM Plex Mono
- **Weights:** 400, 600, 700
- **Sizes:** 14px
- **Line height:** 1.71
- **OpenType features:** `"blwf", "cv03", "cv04", "cv09", "cv11"`
- **Role:** Monospaced labels for product state indicators ('Rewriting...', 'Transcribing...') and technical metadata. Geist Mono at 14px is intentionally small — it's a whisper of machinery inside the editorial voice, not a visual block.

### Grenze Gotisch — Decorative blackletter for stamp-style elements like 'For Immediate Release'. Used once or twice per screen as accent texture, never for body. The gothic contrast against Suisse Works' modern serif is the system's signature historical flourish. · `--font-grenze-gotisch`
- **Substitute:** UnifrakturMaguntia, Pirata One
- **Weights:** 400, 700
- **Sizes:** 48px
- **Line height:** 1.00
- **OpenType features:** `"blwf", "cv03", "cv04", "cv09", "cv11"`
- **Role:** Decorative blackletter for stamp-style elements like 'For Immediate Release'. Used once or twice per screen as accent texture, never for body. The gothic contrast against Suisse Works' modern serif is the system's signature historical flourish.

### Inter — Minor fallback for non-primary UI labels where Open Runde is unavailable · `--font-inter`
- **Weights:** 700
- **Sizes:** 14px
- **Line height:** 1.71
- **OpenType features:** `"blwf", "cv03", "cv04", "cv09", "cv11"`
- **Role:** Minor fallback for non-primary UI labels where Open Runde is unavailable

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.5 | — | `--text-caption` |
| body-sm | 14px | 1.71 | — | `--text-body-sm` |
| body | 16px | 1.63 | — | `--text-body` |
| subheading | 20px | 1.3 | — | `--text-subheading` |
| heading-sm | 28px | 1.31 | — | `--text-heading-sm` |
| heading | 36px | 1.31 | — | `--text-heading` |
| display | 58px | 1.5 | — | `--text-display` |

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
| 40 | 40px | `--spacing-40` |
| 44 | 44px | `--spacing-44` |
| 48 | 48px | `--spacing-48` |
| 52 | 52px | `--spacing-52` |
| 68 | 68px | `--spacing-68` |
| 100 | 100px | `--spacing-100` |
| 116 | 116px | `--spacing-116` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 10000px |
| cards | 8px |
| icons | 8px |
| pills | 10000px |
| inputs | 8px |
| buttons | 16px |
| feature-cards | 24px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| sm | `rgba(213, 208, 184, 0.4) 0px 2px 6px 0px` | `--shadow-sm` |
| subtle | `rgb(246, 246, 240) 0px 0px 0px 2px` | `--shadow-subtle` |
| subtle-2 | `rgba(213, 208, 184, 0.6) 0px 1px 2px 0px` | `--shadow-subtle-2` |
| md | `rgba(213, 208, 184, 0.2) 0px 4px 12px 0px` | `--shadow-md` |
| subtle-3 | `rgba(213, 208, 184, 0.3) 0px 0px 0px 1px` | `--shadow-subtle-3` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 20px
- **Element gap:** 10px

## Components

### Primary CTA Button
**Role:** The single action on a page

Solid black (#000000) fill, white (#ffffff) text in Open Runde Semibold 16px, fully pill-shaped (10000px or 2000px radius), 8px vertical / 20px horizontal padding. No border, no shadow. The button's confidence comes from the contrast between pure black and cream canvas — not from color. An arrow glyph (→) trails the label at 20% opacity offset.

### Secondary Nav Button
**Role:** Persistent site actions in the header

Ink Black (#000000) fill, white text, 16px Open Runde Medium, 8px vertical / 16px horizontal padding, 16px corner radius. Slightly less pill than the primary CTA — sits flush right in the nav bar next to text links.

### Text Navigation Link
**Role:** Top-bar nav items

Open Runde Regular 16px, Ink Black (#000000), no underline by default, 1px Ink Black underline on hover with a 2px offset. No background change — nav links are typographic, never boxed.

### Feature Demo Card
**Role:** Showcase product capabilities in scroll sections

Pure white (#ffffff) surface, 24px corner radius, 20px padding, default warm shadow (rgba(213, 208, 184, 0.4) 0px 2px 6px 0px). Contains a screenshot or newspaper-textured image with a small violet ('AI processing') or teal ('verified') pill label overlaid in the corner. Cards are slightly rotated (-1 to 2 degrees) and overlap to create a casual 'scattered clippings' composition.

### Newspaper Clipping Card
**Role:** Atmospheric product illustration — embeds the publishing context

Full-bleed newspaper image with slight 1px Charcoal (#4c4c4a) border, 8px radius. Layered behind or beside a Feature Demo Card. Provides the visual metaphor that the product works on real published content.

### AI Processing Pill
**Role:** Indicate the system is actively working on a task

White background, 1px violet (#6938ef) border, AI Violet text in Geist Mono 14px, fully pill radius (10000px), 4px vertical / 12px horizontal padding. Often paired with a spinning violet arc icon to the left. The label is a present-participle verb: 'Rewriting...', 'Fact checking...', 'Transcribing...', 'Generating...', 'Formatting...'. The trailing ellipsis is essential — it means the action is in progress.

### Verification Checkmark
**Role:** Show that content has been validated

Editorial Teal (#10756a) circle (28px diameter), white checkmark glyph centered. Always paired with a short teal label in Open Runde Semibold 14px. Used on product UI cards to communicate trust without words.

### Stamp Badge
**Role:** Editorial decoration — urgency or release-state indicators

Stamp Red (#f42c2b) text in Grenze Gotisch 48px / line-height 1.0, uppercase, with a slight rotation (-4 to -2 degrees) to mimic a rubber stamp. Optional faded rectangular border at 0.3 opacity in the same red. No background — the stamp is typographic, not a chip.

### Editorial Headline
**Role:** Hero and section titles

Suisse Works Book 58px / line-height 1.50 for hero, 36px / 1.31 for section heads, 28px / 1.31 for sub-section. Always Ink Black (#000000). The serif's high contrast strokes and sharp terminals are the visual anchor of every screen — no other type competes for attention at this size.

### Hero Subtext
**Role:** Supporting paragraph under the hero headline

Open Runde Regular 16px / 1.63, Charcoal (#4c4c4a). Centered under the headline, max-width approximately 560px. Never longer than two lines — the system is stingy with body copy on hero screens.

### Top Navigation Bar
**Role:** Persistent site navigation

Cream canvas (#fdfcf5) background — never a separate color, 1px Soft Sand (#e5e2d0) bottom border, logo left, text links centered or right-aligned, primary action button at far right. 64px height, 24px horizontal padding. No sticky shadow on scroll — the bar simply continues the cream.

### Input Field
**Role:** Form inputs

White (#ffffff) background, 1px Charcoal (#4c4c4a) border, 8px corner radius, 12px vertical / 16px horizontal padding. Open Runde Regular 16px, Ink Black text. Placeholder in Warm Gray (#7f7e7b). Focus state: 2px rgb(246, 246, 240) outer ring (no chromatic accent — the field still reads as paper).

### Section Spacer
**Role:** Vertical rhythm between major page sections

80px vertical space on desktop, 48px on mobile. Sections share the cream canvas — no color bands. Rhythm is created by whitespace and a subtle 1px Soft Sand divider when needed.

## Do's and Don'ts

### Do
- Use #fdfcf5 as the page background and #ffffff only for card and elevated surfaces — the warm/cool contrast between canvas and paper is the system's foundation
- Use Suisse Works (or GT Sectra) for all headlines 20px and above; never substitute a sans for editorial display type
- Apply the warm khaki shadow rgba(213, 208, 184, 0.4) 0px 2px 6px to every card — never use cool gray shadows
- Use 8px radius for standard cards and inputs, 24px for large feature demo cards, and 10000px (pill) for all buttons and AI processing indicators
- Use Ink Black (#000000) as the single primary action color — fill the CTA button solid black, no gradients, no chromatic alternatives
- Reserve Editorial Teal (#10756a) for verification and 'correct' states; reserve AI Violet (#6938ef) for active processing labels
- Use present-participle AI labels with trailing ellipsis ('Rewriting...', 'Fact checking...') in Geist Mono — the verb-in-progress is the system's primary way to say 'the machine is working'

### Don't
- Don't introduce chromatic CTA buttons — black-on-cream is the system's only action language
- Don't use pure white (#ffffff) as a page background — the cream canvas (#fdfcf5) is the entire atmosphere
- Don't apply cool gray shadows (rgba(0,0,0,...)) — all elevation must use the warm khaki base
- Don't mix sans-serif into headlines above 20px — the serif/sans split is structural, not decorative
- Don't use Stamp Red (#f42c2b) for buttons, errors, or destructive actions — red is reserved for editorial stamp accents only
- Don't flatten the type scale — Suisse Works Book (450) is the headline weight; don't promote to Bold (700) for emphasis, use size and line-height instead
- Don't add drop shadows stronger than 0.4 opacity — the system never goes beyond a soft printed-paper lift, never a hovering UI panel

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas | `#fdfcf5` | Warm cream page background — the broadsheet stock |
| 1 | Paper | `#ffffff` | Pure white card and elevated component surface — the 'printed sheet' that sits on the canvas |
| 2 | Recessed Band | `#f5f3e9` | Subtle alternating section tone, slightly warmer than canvas |
| 3 | Soft Sand | `#e5e2d0` | Deepest neutral surface for inset blocks and quiet dividers |

## Elevation

- **Default Card:** `rgba(213, 208, 184, 0.4) 0px 2px 6px 0px`
- **Hovered Card:** `rgba(213, 208, 184, 0.2) 0px 4px 12px 0px`
- **Hairline Border Card:** `rgba(213, 208, 184, 0.3) 0px 0px 0px 1px`
- **Focus Ring:** `rgb(246, 246, 240) 0px 0px 0px 2px`
- **Pressed/Active:** `rgba(213, 208, 184, 0.6) 0px 1px 2px 0px`

## Imagery

Imagery is built from real newspaper photography and editorial layouts — the product demo cards are populated with actual broadsheet clippings (column rules, headlines, bylines) treated as texture, not content. A faint 'For Immediate Release' red stamp and a blackletter Grenze Gotisch 'Mobility Monitor Newsletter' masthead appear as decorative prints. The product cards are layered with a slight rotation (-1 to 2 degrees) so the composition reads as a stack of clippings on a desk, not a tidy grid. No stock photography, no illustrations, no abstract gradients — the visual language is exclusively print-editing tropes repurposed as product UI.

## Layout

Full-width cream canvas at every section level; content is centered in a 1200px max-width column. The hero is a typographic stack: large serif headline (58px) centered, short subtext beneath, then a single black pill CTA, followed by a 80px gap and a scattered cluster of 3–5 product demo cards that float with slight rotation and overlap. Subsequent sections use consistent vertical rhythm at 80px section gaps, alternating between centered editorial prose and asymmetric card compositions. Navigation is a single flat top bar with logo left, links right, no sticky shadow. The page never uses a sidebar, never uses multi-column page layouts — every section is a single content column with embedded product card clusters.

## Agent Prompt Guide

**Quick Color Reference**
- text: #000000
- background: #fdfcf5
- border: #4c4c4a
- accent: #10756a (teal — verification)
- AI state: #6938ef (violet — processing)
- primary action: #000000 (filled action)

**Example Component Prompts**

1. **Hero section**: Canvas background #fdfcf5. Headline at 58px Suisse Works Book 450, #000000, centered, line-height 1.50. Subtext at 16px Open Runde Regular, #4c4c4a, centered, max-width 560px. CTA: black pill button (#000000 fill, #ffffff text, 10000px radius, 8px/20px padding, Open Runde Semibold 16px, label 'Request a demo →'). 80px section gap below.

2. **Feature demo card**: #ffffff surface, 24px corner radius, 20px padding, shadow rgba(213, 208, 184, 0.4) 0px 2px 6px 0px. Contains a newspaper-textured image inside with a 1px #4c4c4a border and 8px radius. Overlaid top-left: AI Processing Pill (#ffffff background, 1px #6938ef border, Geist Mono 14px #6938ef text, 10000px radius, 4px/12px padding, label 'Rewriting...'). Card is rotated -1.5 degrees.

3. **Top nav bar**: #fdfcf5 background, 1px #e5e2d0 bottom border, 64px height, 24px horizontal padding. Logo (4-dot cluster) left, 5 text links right (Open Runde Regular 16px #000000), Sign up button (#000000 fill, #ffffff text, Open Runde Medium 16px, 16px radius, 8px/16px padding) at far right.

4. **AI processing pill (standalone)**: #ffffff background, 1px #6938ef border, 10000px radius, 4px vertical / 12px horizontal padding. Inside: spinning violet arc icon (16px) + Geist Mono 14px #6938ef text reading 'Fact checking...'. The trailing ellipsis is required.

5. **Stamp badge decoration**: Grenze Gotisch 48px / line-height 1.0, #f42c2b, uppercase 'FOR IMMEDIATE RELEASE', rotated -3 degrees, no background, optional 1px #f42c2b border at 0.3 opacity forming a faded rectangle.

## Editorial Type Pairing

The system is built on a deliberate tension between two type voices: **Suisse Works (serif)** carries authority and editorial weight at display sizes (28px and up), while **Open Runde (sans)** handles everything from 20px down with humanist warmth. The serif's sharp terminals and high stroke contrast give the interface a printed-broadsheet credibility; the sans's rounded geometry keeps the UI from feeling academic. Never use the sans for headlines, never use the serif for body — the boundary at 20–24px is absolute. Geist Mono appears only in AI processing pills as a 14px whisper of machinery.

## Warm Shadow System

Every elevation in the interface uses a warm khaki base (rgba(213, 208, 184, ...)) instead of neutral gray. This is the single most distinctive choice in the system — a standard SaaS card on a cream canvas with a standard gray shadow looks dead; the same card with a tan shadow at 0.4 opacity looks like it was set in letterpress. The shadow palette has three tiers: a 2px 6px lift at 0.4 opacity for default cards, a 4px 12px lift at 0.2 opacity for hover/elevated, and a 1px hairline at 0.3 opacity for low-emphasis separation. Focus rings use a 2px solid rgb(246, 246, 240) — a near-cream color, not the standard blue accent.

## Similar Brands

- **Substack** — Same warm cream canvas with a single editorial serif doing the headline work, black-on-cream contrast as the primary action language, and minimal use of color in chrome
- **Read.cv** — Shared commitment to a humanist sans + editorial display serif pairing, generous whitespace, and a paper-warm background that rejects pure white SaaS conventions
- **Pitch** — Both use soft warm-toned card shadows instead of cool gray elevation, serif headlines paired with a clean sans, and a single high-contrast neutral as the CTA color
- **Are.na** — Same scattered-card composition with slight rotation, mixed serif/sans type system, and an editorial-broadsheet visual language applied to a product surface
- **The Browser Company** — Both treat the interface as a piece of editorial design — soft warm surfaces, restrained chromatic use, and serif display type breaking up a humanist sans body

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-canvas-cream: #fdfcf5;
  --color-ink-black: #000000;
  --color-paper-white: #ffffff;
  --color-charcoal: #4c4c4a;
  --color-slate-black: #333231;
  --color-warm-gray: #7f7e7b;
  --color-mid-stone: #656562;
  --color-soft-sand: #f5f3e9;
  --color-khaki-shadow: #edeadd;
  --color-sandstone: #e5e2d0;
  --color-lavender-mist: #e2e0e4;
  --color-editorial-teal: #10756a;
  --color-ai-violet: #6938ef;
  --color-deep-violet: #6a27d9;
  --color-stamp-red: #f42c2b;

  /* Typography — Font Families */
  --font-sans-serif: 'sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-suisse-works: 'Suisse Works', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-open-runde: 'Open Runde', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-geist-mono: 'Geist Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-grenze-gotisch: 'Grenze Gotisch', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --text-body-sm: 14px;
  --leading-body-sm: 1.71;
  --text-body: 16px;
  --leading-body: 1.63;
  --text-subheading: 20px;
  --leading-subheading: 1.3;
  --text-heading-sm: 28px;
  --leading-heading-sm: 1.31;
  --text-heading: 36px;
  --leading-heading: 1.31;
  --text-display: 58px;
  --leading-display: 1.5;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-w450: 450;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
  --font-weight-black: 900;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-40: 40px;
  --spacing-44: 44px;
  --spacing-48: 48px;
  --spacing-52: 52px;
  --spacing-68: 68px;
  --spacing-100: 100px;
  --spacing-116: 116px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 20px;
  --element-gap: 10px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-xl: 13px;
  --radius-2xl: 16px;
  --radius-3xl: 24px;
  --radius-3xl-2: 28px;
  --radius-full: 1000px;
  --radius-full-2: 2000px;
  --radius-full-3: 10000px;
  --radius-full-4: 11429px;

  /* Named Radii */
  --radius-tags: 10000px;
  --radius-cards: 8px;
  --radius-icons: 8px;
  --radius-pills: 10000px;
  --radius-inputs: 8px;
  --radius-buttons: 16px;
  --radius-feature-cards: 24px;

  /* Shadows */
  --shadow-sm: rgba(213, 208, 184, 0.4) 0px 2px 6px 0px;
  --shadow-subtle: rgb(246, 246, 240) 0px 0px 0px 2px;
  --shadow-subtle-2: rgba(213, 208, 184, 0.6) 0px 1px 2px 0px;
  --shadow-md: rgba(213, 208, 184, 0.2) 0px 4px 12px 0px;
  --shadow-subtle-3: rgba(213, 208, 184, 0.3) 0px 0px 0px 1px;

  /* Surfaces */
  --surface-canvas: #fdfcf5;
  --surface-paper: #ffffff;
  --surface-recessed-band: #f5f3e9;
  --surface-soft-sand: #e5e2d0;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-canvas-cream: #fdfcf5;
  --color-ink-black: #000000;
  --color-paper-white: #ffffff;
  --color-charcoal: #4c4c4a;
  --color-slate-black: #333231;
  --color-warm-gray: #7f7e7b;
  --color-mid-stone: #656562;
  --color-soft-sand: #f5f3e9;
  --color-khaki-shadow: #edeadd;
  --color-sandstone: #e5e2d0;
  --color-lavender-mist: #e2e0e4;
  --color-editorial-teal: #10756a;
  --color-ai-violet: #6938ef;
  --color-deep-violet: #6a27d9;
  --color-stamp-red: #f42c2b;

  /* Typography */
  --font-sans-serif: 'sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-suisse-works: 'Suisse Works', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-open-runde: 'Open Runde', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-geist-mono: 'Geist Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-grenze-gotisch: 'Grenze Gotisch', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --text-body-sm: 14px;
  --leading-body-sm: 1.71;
  --text-body: 16px;
  --leading-body: 1.63;
  --text-subheading: 20px;
  --leading-subheading: 1.3;
  --text-heading-sm: 28px;
  --leading-heading-sm: 1.31;
  --text-heading: 36px;
  --leading-heading: 1.31;
  --text-display: 58px;
  --leading-display: 1.5;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-40: 40px;
  --spacing-44: 44px;
  --spacing-48: 48px;
  --spacing-52: 52px;
  --spacing-68: 68px;
  --spacing-100: 100px;
  --spacing-116: 116px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-xl: 13px;
  --radius-2xl: 16px;
  --radius-3xl: 24px;
  --radius-3xl-2: 28px;
  --radius-full: 1000px;
  --radius-full-2: 2000px;
  --radius-full-3: 10000px;
  --radius-full-4: 11429px;

  /* Shadows */
  --shadow-sm: rgba(213, 208, 184, 0.4) 0px 2px 6px 0px;
  --shadow-subtle: rgb(246, 246, 240) 0px 0px 0px 2px;
  --shadow-subtle-2: rgba(213, 208, 184, 0.6) 0px 1px 2px 0px;
  --shadow-md: rgba(213, 208, 184, 0.2) 0px 4px 12px 0px;
  --shadow-subtle-3: rgba(213, 208, 184, 0.3) 0px 0px 0px 1px;
}
```
