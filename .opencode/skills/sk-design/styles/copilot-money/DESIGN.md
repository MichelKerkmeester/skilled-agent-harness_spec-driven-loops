# Copilot Money — Style Reference
> Scattered neon tags over a midnight vault — a black canvas where a few candy-colored labels drift at playful angles, each glowing like an airport departure sign.

**Theme:** dark

Copilot Money is a midnight-canvas finance app where the interface stays dark, quiet, and nearly monochrome while a playful parade of candy-colored category tags — groceries, baby, wedding, home — float at jaunty angles around the hero, providing the only visual noise the page allows. Typography is the other signature: body copy at weight 100 in Matter Variable Thin creates a whisper-thin, almost-printed-on-vellum feeling, while Jokker display headings at 148px deliver structural authority through sheer scale rather than weight. A single vivid blue (#1c6cff) punctuates the darkness as the only call to action. Surfaces are given depth through layered inset shadows rather than drop shadows — a neomorphic approach that keeps the UI feeling pressed into the dark plane rather than floating above it.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Midnight Canvas | `#000814` | `--color-midnight-canvas` | Page background, hero canvas, base layer of the dark plane |
| Deep Surface | `#010d1e` | `--color-deep-surface` | First elevated surface tier above the canvas — cards, panels, nav wells |
| Indigo Surface | `#001533` | `--color-indigo-surface` | Second elevated surface — deeper blue tint for nested containers and highlighted panels |
| Cobalt Surface | `#00215e` | `--color-cobalt-surface` | Glow-tier surface for featured blocks, highlighted links, and deep elevation wells |
| Paper White | `#ffffff` | `--color-paper-white` | Primary headings, body text, icon strokes, ghost-button borders, logo glyph |
| Fog | `#ccced0` | `--color-fog` | Muted secondary text, subtle hairline borders on quiet surfaces |
| Mist | `#999ca1` | `--color-mist` | Helper text, tertiary captions, low-emphasis metadata |
| Steel Border | `#11263b` | `--color-steel-border` | Hairline border tone — divides dark surfaces at low contrast |
| Signal Blue | `#1c6cff` | `--color-signal-blue` | Filled primary action buttons, active nav, brand mark tint — the one chromatic accent on a dark page |
| Tag Coral | `#ff4433` | `--color-tag-coral` | Category tag fill — groceries, food, lifestyle tags in the floating constellation |
| Tag Lime | `#00cc4b` | `--color-tag-lime` | Category tag fill — green budget / income / positive-flow labels |
| Tag Tangerine | `#ff8833` | `--color-tag-tangerine` | Category tag fill — home, utilities, warm-life-event tags |
| Tag Hot Pink | `#ff33aa` | `--color-tag-hot-pink` | Category tag fill — personal, family, baby, gift tags |
| Tag Violet | `#9019e6` | `--color-tag-violet` | Category tag fill — entertainment, nightlife, going-out tags |
| Tag Sunflower | `#ffcc02` | `--color-tag-sunflower` | Category tag fill — savings, goals, highlight tags |
| Tag Sky | `#00acfe` | `--color-tag-sky` | Category tag fill — travel, subscription, digital tags |
| Tag Ember | `#ea687c` | `--color-tag-ember` | Category tag fill — warm pink-red for fashion, health, personal care |
| Tag Olive | `#94ae43` | `--color-tag-olive` | Category tag fill — organic, grocery-adjacent, eco tags |
| Tag Slate | `#5c6f8a` | `--color-tag-slate` | Category tag fill — neutral-toned category tags (transit, bills, misc) |

## Tokens — Typography

### sans-serif — sans-serif — detected in extracted data but not described by AI · `--font-sans-serif`
- **Weights:** 400
- **Sizes:** 12px
- **Line height:** 1.2
- **Role:** sans-serif — detected in extracted data but not described by AI

### Jokker — Display headings only. The 148px Jokker Semibold (line-height 0.90, tracking -0.02em) is the hero — a custom condensed display face whose tight verticals and sharp terminals give the dark page its editorial weight. Using a display face (not a body sans) for the headline is the signature: headlines announce rather than describe. Substitute: ABC Monument Grotesk, Söhne Breit, or Space Grotesk Bold. · `--font-jokker`
- **Substitute:** ABC Monument Grotesk or Söhne Breit
- **Weights:** 500, 600
- **Sizes:** 12px, 13px, 14px, 16px, 18px, 22px, 24px, 32px, 64px, 148px
- **Line height:** 0.90, 1.09, 1.10, 1.20
- **Letter spacing:** -0.02em at 148px, -0.01em at 64px
- **OpenType features:** `"blwf", "cv03", "cv04", "cv09", "cv11"`
- **Role:** Display headings only. The 148px Jokker Semibold (line-height 0.90, tracking -0.02em) is the hero — a custom condensed display face whose tight verticals and sharp terminals give the dark page its editorial weight. Using a display face (not a body sans) for the headline is the signature: headlines announce rather than describe. Substitute: ABC Monument Grotesk, Söhne Breit, or Space Grotesk Bold.

### Matter Variable Thin — All body copy, subheadings, and supporting text. Weight 100 across the entire body scale is anti-convention — most dark UIs use weight 400-500 to fight low contrast, but Matter Thin lets the page feel printed on dark vellum. The 38px and 56px sizes act as secondary display tiers, still at weight 100, reinforcing the 'whisper, don't shout' voice. Substitute: Inter Thin, Söhne Leicht, or IBM Plex Sans Thin. · `--font-matter-variable-thin`
- **Substitute:** Inter Thin or Söhne Leicht
- **Weights:** 100
- **Sizes:** 11px, 12px, 13px, 14px, 15px, 16px, 18px, 22px, 38px, 56px
- **Line height:** 1.20, 1.30, 1.40, 1.60
- **Letter spacing:** -0.01em to -0.02em at 22-56px; 0 to 0.02em below 16px
- **OpenType features:** `"ss07", "blwf", "cv03", "cv04", "cv09", "cv11", "ss07", "blwf", "cv03", "cv04", "cv09", "cv11"`
- **Role:** All body copy, subheadings, and supporting text. Weight 100 across the entire body scale is anti-convention — most dark UIs use weight 400-500 to fight low contrast, but Matter Thin lets the page feel printed on dark vellum. The 38px and 56px sizes act as secondary display tiers, still at weight 100, reinforcing the 'whisper, don't shout' voice. Substitute: Inter Thin, Söhne Leicht, or IBM Plex Sans Thin.

### Matter-TRIAL SemiBold — All-caps eyebrow labels and section markers. The 0.04em tracking is the key — it forces the all-caps treatment to read as signage, not shouting. Appears above section content as a small 'kicker' line. · `--font-matter-trial-semibold`
- **Substitute:** Inter SemiBold or Söhne Halbfett
- **Weights:** 670
- **Sizes:** 28px
- **Line height:** 1.00
- **Letter spacing:** 0.04em (1.12px at 28px)
- **Role:** All-caps eyebrow labels and section markers. The 0.04em tracking is the key — it forces the all-caps treatment to read as signage, not shouting. Appears above section content as a small 'kicker' line.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.2 | — | `--text-caption` |
| body-sm | 14px | 1.4 | -0.14px | `--text-body-sm` |
| body | 16px | 1.4 | -0.16px | `--text-body` |
| body-lg | 18px | 1.6 | -0.18px | `--text-body-lg` |
| subheading | 24px | 1.4 | -0.24px | `--text-subheading` |
| eyebrow | 28px | 1 | 1.12px | `--text-eyebrow` |
| heading-sm | 38px | 1.3 | -0.76px | `--text-heading-sm` |
| heading | 56px | 1.2 | -1.12px | `--text-heading` |
| heading-lg | 64px | 1.1 | -0.64px | `--text-heading-lg` |
| display | 148px | 0.9 | -2.96px | `--text-display` |

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
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |
| 56 | 56px | `--spacing-56` |
| 64 | 64px | `--spacing-64` |
| 80 | 80px | `--spacing-80` |
| 88 | 88px | `--spacing-88` |
| 112 | 112px | `--spacing-112` |
| 160 | 160px | `--spacing-160` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 20px |
| cards | 24px |
| pills | 9999px |
| images | 8px |
| buttons | 16px |
| largeContainers | 40px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| md | `rgba(255, 255, 255, 0.16) 4px 4px 16px -4px inset, rgba(0...` | `--shadow-md` |
| md-2 | `rgba(38, 113, 217, 0.08) 0px 0px 12px 0px inset, rgba(0, ...` | `--shadow-md-2` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80-120px
- **Card padding:** 24px
- **Element gap:** 16px

## Components

### Announcement Bar
**Role:** Slim full-width strip pinned above the nav

Filled Signal Blue (#1c6cff) background, 40px height, centered white text at 12px / weight 100, often includes a '>' chevron link. Dismissable with a small × on the right edge.

### Navigation Header
**Role:** Sticky top nav on all pages

Sits on Midnight Canvas (#000814) with no visible background fill — transparent. Logo (paper plane glyph in a white 16px-radius square) + wordmark 'Copilot Money' at left, centered nav links (Features, Pricing, Reviews) at 14px Matter weight 100, and right-side actions: a 'Log in' text link plus a white 'Get started' filled button. Total height ~64px.

### Primary CTA Button
**Role:** The single dominant call-to-action

Filled Signal Blue (#1c6cff) background, white text at 14-16px weight 100, 16px border-radius, padding 12px 20px. Icon variant includes a small paper-plane glyph inside a slightly lighter-blue square to the left of the label. No hover lift; the button is flat and confident.

### Ghost / Outlined Button
**Role:** Secondary action in the nav

Transparent fill, 1px white border, white text at 14-16px weight 100, 16px border-radius, padding 12px 20px. Sits beside the primary CTA without competing for attention.

### Category Tag / Pill
**Role:** The signature floating decorative element

Filled with one of the accent tag colors (Coral, Lime, Tangerine, Hot Pink, Violet, Sunflower, Sky, Ember, Olive, Slate), 20px border-radius (pill-ish rectangle, not a full pill), white text at 12-14px weight 100, 8px 16px padding, with a small emoji or icon prefix. Tags are rotated at random angles (-12° to +12°) and float around hero text — they are never on a strict grid.

### Award Badge
**Role:** Social proof — App Store accolades

Thin white 1px outline forming a laurel wreath shape, with centered title text ('Editor's Choice', 'Best of the App Store', 'Apple Design Award') at 11-12px weight 100 inside. 40px height, varies in width. Used in a horizontal row of 4-5 badges.

### Brand Mark
**Role:** Logo glyph used in nav and app icon contexts

White paper-plane icon inside a 16px-radius white-filled square. The square is the mark; the wordmark 'Copilot Money' sits to its right in Jokker Medium 16px.

### Display Heading
**Role:** Hero and section-opener headlines

Jokker Semibold at 64-148px, line-height 0.90, letter-spacing -0.02em, color Paper White. The 148px size is reserved for the hero only; section heads drop to 56-64px. Never used at weights below 500 — the display face is the moment the page is allowed to use weight.

### Body Text Block
**Role:** All paragraph and supporting copy

Matter Variable Thin (weight 100) at 16-18px, line-height 1.40-1.60, color Paper White. Secondary paragraphs may use Fog (#ccced0). The thin weight means line-length should stay under 60ch for legibility.

### Eyebrow / Kicker Label
**Role:** All-caps section markers above content

Matter-TRIAL SemiBold at 28px, line-height 1.00, letter-spacing 0.04em, uppercase, color Paper White or Signal Blue. Wide tracking is the signature — it reads as signage, not as a heading.

### Section Container
**Role:** Full-width bands separating page sections

Centered content with max-width 1200px, horizontal padding 24-40px. Vertical section gap 80-120px. Background alternates between Midnight Canvas and Deep Surface (#010d1e) to create banding without using borders.

### Neomorphic Card
**Role:** Feature blocks, content wells, interactive panels

Background Deep Surface (#010d1e), 24px border-radius, 24px padding. Depth comes from the dual inset shadow stack (white inner top-right + black inner bottom-left) rather than a drop shadow. Border 1px Steel (#11263b) at 0.3 opacity for hairline definition on the dark surface.

## Do's and Don'ts

### Do
- Use weight 100 Matter for every piece of body and supporting copy — the whisper-thin voice is the brand
- Reserve weight 500+ exclusively for Jokker display headings and the eyebrow label face — never bold body text
- Apply -0.02em letter-spacing on display sizes (56px and above) and 0.04em on all-caps eyebrows
- Use #1c6cff as the only filled chromatic action on the page — never introduce a second brand color for buttons
- Float category tags at random rotation angles between -12° and +12° around hero content; never align them to a grid
- Build all elevation from inset shadows (white inner top-right + black inner bottom-left) — never use drop shadows
- Keep section backgrounds as tonal shifts between #000814, #010d1, and #001533 — use color, not borders, to separate bands

### Don't
- Don't use weight 400-500 for body text — the thin weight is non-negotiable, even at small sizes
- Don't use drop shadows on cards, modals, or nav wells — depth is communicated by inset lighting only
- Don't place colored category tags on a light surface — the candy colors only work against midnight
- Don't introduce additional brand colors for CTAs, badges, or accents — #1c6cff is the sole chromatic voice
- Don't align the floating category tags to a strict grid or use identical rotation angles — the playful asymmetry is the signature
- Don't use Jokker for body copy or Matter Thin for the hero headline — the two faces own separate registers
- Don't add decorative gradients to backgrounds — the canvas stays flat midnight; the only gradient lives in the inline gradient highlight element

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas | `#000814` | Full-page background — the midnight plane everything else sits inside |
| 1 | Deep Surface | `#010d1` | Cards, nav wells, first elevation step off the canvas |
| 2 | Indigo Surface | `#001533` | Nested panels, expanded menu backgrounds |
| 3 | Cobalt Surface | `#00215` | Featured blocks, highlighted link backgrounds, deep wells |

## Elevation

- **Cards & Panels:** `rgba(255, 255, 255, 0.08) 4px 4px 8px 0px inset, rgba(255, 255, 255, 0.16) 4px 4px 16px -4px inset`
- **Pressed / Active States:** `rgba(0, 0, 0, 0.2) -4px -4px 16px -4px inset`
- **Glow Highlight:** `rgba(38, 113, 217, 0.08) 0px 0px 12px 0px inset, rgba(0, 0, 0, 0.32) 0px -4px 8px 0px inset`

## Imagery

The site uses almost no traditional imagery. Instead, the signature visual element is a constellation of 3D-rendered, candy-colored category tags (GROCERIES, BABY, WEDDING, HOME, DANCING, DATE NIGHT) that float at jaunty rotation angles around hero text. Each tag is a rounded-rectangle pill with a subtle inner highlight suggesting soft 3D volume, filled with a saturated brand color and stamped with a small emoji icon. The tags read as scattered luggage labels or sticky notes pinned to a dark wall. App Store award badges (laurel-wreath outlined in thin white) appear as flat line-art social proof. No photography, no illustrations, no product screenshots in the hero — the floating tags ARE the hero image. Iconography is line-art monochrome (paper plane logo, nav chevrons, close ×, arrow links) at ~16-20px.

## Layout

Centered, max-width 1200px container with generous 80-120px vertical section gaps. The hero is a full-bleed dark canvas with a single centered display headline stack — large white heading, muted white subtext paragraph, single blue CTA — surrounded by scattered tilted category tags that drift outside the content column into the negative space. Navigation is a transparent sticky bar flush with the top of the page, no visible background, breaking up only with the brand mark, centered nav links, and right-side login + CTA pair. A secondary full-bleed dark band hosts a centered paragraph of 'navigate your finances with confidence' body copy beneath a centered logo mark. Award badges sit in a single horizontal row, centered, beneath the hero. The rhythm throughout is: full-width dark band → centered narrow text column → optional scattered decorations → next band. No 2-column text+image splits, no card grids in the hero region — the page is editorial, not dashboard-like.

## Agent Prompt Guide

**Quick Color Reference**
- background: #000814
- surface (card): #010d1e
- elevated surface: #001533
- text primary: #ffffff
- text muted: #ccced0
- border hairline: #11263b
- accent / primary action: #1c6cff (filled action)

**Example Component Prompts**

1. Create a Primary Action Button: #1c6cff background, #ffffff text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.

2. **Floating Category Tag**: 20px radius pill, 100x40px, filled with #ff4433 (or rotate through the accent palette: #00cc4b, #ff8833, #ff33aa, #9019e6, #ffcc02). White text at 12px Matter weight 100, uppercase. Small emoji glyph on the left at 14px. Place at transform: rotate(-8deg) or rotate(12deg) — never axis-aligned.

3. **Neomorphic Card**: Background #010d1e, 24px radius, 24px padding, 1px border at rgba(17, 38, 59, 0.4). Inset shadow stack: rgba(255,255,255,0.08) 4px 4px 8px 0px inset + rgba(255,255,255,0.16) 4px 4px 16px -4px inset + rgba(0,0,0,0.2) -4px -4px 16px -4px inset. No drop shadow. Heading inside at 38px Matter weight 100, #ffffff, letter-spacing -0.76px.


5. **Eyebrow Kicker Label**: 28px Matter SemiBold (weight 670), uppercase, letter-spacing 1.12px (0.04em), line-height 1.00, color #1c6cff or #ffffff. Single short phrase (1-3 words), placed above section content with 16-24px gap to the next element.

## Similar Brands

- **Monarch Money** — Same dark-midnight canvas with a single saturated accent color, generous spacing, and large-radius cards — but Copilot adds the playful floating tag constellation
- **Arc Browser** — Dark-canvas UI with scattered colorful decorative elements (Arc's folder icons, Copilot's category tags) that break grid alignment and inject personality
- **Things 3** — Playful use of small colorful category tags/pills against a dark background, prioritizing visual personality over dashboard density
- **Linear** — Confident dark UI with a single chromatic action color and editorial-scale typography, though Linear is far more austere and Copilot adds the candy-colored tag motif
- **Cash App** — Dark base with vivid accent color, rounded oversized type, and a friendly non-corporate tone — the closest fintech peer in personality if not in surface treatment

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-midnight-canvas: #000814;
  --color-deep-surface: #010d1e;
  --color-indigo-surface: #001533;
  --color-cobalt-surface: #00215e;
  --color-paper-white: #ffffff;
  --color-fog: #ccced0;
  --color-mist: #999ca1;
  --color-steel-border: #11263b;
  --color-signal-blue: #1c6cff;
  --color-tag-coral: #ff4433;
  --color-tag-lime: #00cc4b;
  --color-tag-tangerine: #ff8833;
  --color-tag-hot-pink: #ff33aa;
  --color-tag-violet: #9019e6;
  --color-tag-sunflower: #ffcc02;
  --color-tag-sky: #00acfe;
  --color-tag-ember: #ea687c;
  --color-tag-olive: #94ae43;
  --color-tag-slate: #5c6f8a;

  /* Typography — Font Families */
  --font-sans-serif: 'sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-jokker: 'Jokker', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-matter-variable-thin: 'Matter Variable Thin', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-matter-trial-semibold: 'Matter-TRIAL SemiBold', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.2;
  --text-body-sm: 14px;
  --leading-body-sm: 1.4;
  --tracking-body-sm: -0.14px;
  --text-body: 16px;
  --leading-body: 1.4;
  --tracking-body: -0.16px;
  --text-body-lg: 18px;
  --leading-body-lg: 1.6;
  --tracking-body-lg: -0.18px;
  --text-subheading: 24px;
  --leading-subheading: 1.4;
  --tracking-subheading: -0.24px;
  --text-eyebrow: 28px;
  --leading-eyebrow: 1;
  --tracking-eyebrow: 1.12px;
  --text-heading-sm: 38px;
  --leading-heading-sm: 1.3;
  --tracking-heading-sm: -0.76px;
  --text-heading: 56px;
  --leading-heading: 1.2;
  --tracking-heading: -1.12px;
  --text-heading-lg: 64px;
  --leading-heading-lg: 1.1;
  --tracking-heading-lg: -0.64px;
  --text-display: 148px;
  --leading-display: 0.9;
  --tracking-display: -2.96px;

  /* Typography — Weights */
  --font-weight-thin: 100;
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-w670: 670;

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
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-56: 56px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-88: 88px;
  --spacing-112: 112px;
  --spacing-160: 160px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80-120px;
  --card-padding: 24px;
  --element-gap: 16px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-2xl-2: 20px;
  --radius-3xl: 24px;
  --radius-3xl-2: 32px;
  --radius-3xl-3: 40px;
  --radius-full: 48px;
  --radius-full-2: 80px;
  --radius-full-3: 120px;

  /* Named Radii */
  --radius-tags: 20px;
  --radius-cards: 24px;
  --radius-pills: 9999px;
  --radius-images: 8px;
  --radius-buttons: 16px;
  --radius-largecontainers: 40px;

  /* Shadows */
  --shadow-md: rgba(255, 255, 255, 0.16) 4px 4px 16px -4px inset, rgba(0, 0, 0, 0.2) -4px -4px 16px -4px inset, rgba(255, 255, 255, 0.08) 4px 4px 8px 0px inset, rgba(255, 255, 255, 0.4) 1px 1px 1px -0.5px inset;
  --shadow-md-2: rgba(38, 113, 217, 0.08) 0px 0px 12px 0px inset, rgba(0, 0, 0, 0.32) 0px -4px 8px 0px inset;

  /* Surfaces */
  --surface-canvas: #000814;
  --surface-deep-surface: #010d1;
  --surface-indigo-surface: #001533;
  --surface-cobalt-surface: #00215;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-midnight-canvas: #000814;
  --color-deep-surface: #010d1e;
  --color-indigo-surface: #001533;
  --color-cobalt-surface: #00215e;
  --color-paper-white: #ffffff;
  --color-fog: #ccced0;
  --color-mist: #999ca1;
  --color-steel-border: #11263b;
  --color-signal-blue: #1c6cff;
  --color-tag-coral: #ff4433;
  --color-tag-lime: #00cc4b;
  --color-tag-tangerine: #ff8833;
  --color-tag-hot-pink: #ff33aa;
  --color-tag-violet: #9019e6;
  --color-tag-sunflower: #ffcc02;
  --color-tag-sky: #00acfe;
  --color-tag-ember: #ea687c;
  --color-tag-olive: #94ae43;
  --color-tag-slate: #5c6f8a;

  /* Typography */
  --font-sans-serif: 'sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-jokker: 'Jokker', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-matter-variable-thin: 'Matter Variable Thin', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-matter-trial-semibold: 'Matter-TRIAL SemiBold', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.2;
  --text-body-sm: 14px;
  --leading-body-sm: 1.4;
  --tracking-body-sm: -0.14px;
  --text-body: 16px;
  --leading-body: 1.4;
  --tracking-body: -0.16px;
  --text-body-lg: 18px;
  --leading-body-lg: 1.6;
  --tracking-body-lg: -0.18px;
  --text-subheading: 24px;
  --leading-subheading: 1.4;
  --tracking-subheading: -0.24px;
  --text-eyebrow: 28px;
  --leading-eyebrow: 1;
  --tracking-eyebrow: 1.12px;
  --text-heading-sm: 38px;
  --leading-heading-sm: 1.3;
  --tracking-heading-sm: -0.76px;
  --text-heading: 56px;
  --leading-heading: 1.2;
  --tracking-heading: -1.12px;
  --text-heading-lg: 64px;
  --leading-heading-lg: 1.1;
  --tracking-heading-lg: -0.64px;
  --text-display: 148px;
  --leading-display: 0.9;
  --tracking-display: -2.96px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-28: 28px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-56: 56px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-88: 88px;
  --spacing-112: 112px;
  --spacing-160: 160px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-2xl-2: 20px;
  --radius-3xl: 24px;
  --radius-3xl-2: 32px;
  --radius-3xl-3: 40px;
  --radius-full: 48px;
  --radius-full-2: 80px;
  --radius-full-3: 120px;

  /* Shadows */
  --shadow-md: rgba(255, 255, 255, 0.16) 4px 4px 16px -4px inset, rgba(0, 0, 0, 0.2) -4px -4px 16px -4px inset, rgba(255, 255, 255, 0.08) 4px 4px 8px 0px inset, rgba(255, 255, 255, 0.4) 1px 1px 1px -0.5px inset;
  --shadow-md-2: rgba(38, 113, 217, 0.08) 0px 0px 12px 0px inset, rgba(0, 0, 0, 0.32) 0px -4px 8px 0px inset;
}
```
