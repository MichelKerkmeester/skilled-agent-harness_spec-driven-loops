# Stellar — Style Reference
> Gallery wall at midnight

**Theme:** dark

Stellar operates in a midnight-black creative marketplace language: pure void canvas, dark elevated surfaces, oversized whisper-light display type, and a single vivid violet that fires only when an action matters. The entire interface reads like a portfolio on a closed gallery wall — everything recedes into shadow except the headline and the one CTA. Color is rationed: achromatic text and hairline borders do 95% of the work, and #6a48f2 appears as a precise electric punctuation on the reserve button, link hovers, and selected states. Components are minimal and borderless by default, gaining shape only through subtle #2c2c2 outlines and 6-10px corner softening. The design's defining choice is restraint — massive 70-104px type at weight 400 with tight negative tracking creates a hushed authority that does not compete with the photography of the designers themselves.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Void Black | `#000000` | `--color-void-black` | Page background, primary canvas — absolute black eliminates surface depth, making images and white type feel like they float |
| Obsidian | `#171718` | `--color-obsidian` | Card surfaces, elevated panels, designer profile containers — one shade above void to separate without illuminating |
| Graphite | `#2c2c2e` | `--color-graphite` | Borders on inputs, buttons, and nav dividers — the thinnest readable outline on near-black |
| Ash | `#888888` | `--color-ash` | Muted body text, secondary labels, inactive borders — the only gray with enough chroma to carry information |
| Smoke | `#e9e9e9` | `--color-smoke` | Helper text, subtle text accents on dark surfaces |
| Bone | `#f3f3f3` | `--color-bone` | Headings, high-emphasis text — slightly off-white to avoid harshness against pure black |
| Paper | `#ffffff` | `--color-paper` | Primary headings, logo text, pure-contrast display copy |
| Platinum | `#dddddd` | `--color-platinum` | Nav text at rest — sits one step below pure white to create a de-emphasized nav hierarchy |
| Sprint Violet | `linear-gradient(7deg, rgb(106, 72, 242) 20%, rgb(252, 206, 238))` | `--color-sprint-violet` | Primary CTA fill, active link, brand accent — the single chromatic note in an achromatic system, reserved for actions that convert; Accent gradient terminus — fades from Sprint Violet into soft pink to signal premium/highlight moments |

## Tokens — Typography

### Neue Montreal — Single-family type system. Weight 400 carries the entire display scale up to 104px — the deliberate refusal of a bold weight is the signature. Weight 500 activates only on small uppercase labels and button text. Negative letter-spacing tightens display sizes (-0.02em at 70-104px) while small uppercase eyebrow labels open to +0.035-0.040em. The 104px display at weight 400 is anti-conventional — most systems would set this at 700-800; here it whispers, letting the void around it carry the weight. · `--font-neue-montreal`
- **Substitute:** Inter, Switzer, General Sans
- **Weights:** 400, 500
- **Sizes:** 14, 15, 16, 18, 19, 21, 22, 40, 70, 72, 104
- **Line height:** 1.00, 1.10, 1.20, 1.43, 1.50, 1.55
- **Letter spacing:** Display 70-104px: -0.02em. Headings 19-22px: -0.01em. Body 14-16px: normal. Small uppercase labels: +0.035 to +0.040em
- **OpenType features:** `"ss01" on`
- **Role:** Single-family type system. Weight 400 carries the entire display scale up to 104px — the deliberate refusal of a bold weight is the signature. Weight 500 activates only on small uppercase labels and button text. Negative letter-spacing tightens display sizes (-0.02em at 70-104px) while small uppercase eyebrow labels open to +0.035-0.040em. The 104px display at weight 400 is anti-conventional — most systems would set this at 700-800; here it whispers, letting the void around it carry the weight.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 14px | 1.5 | 0.5px | `--text-caption` |
| body | 16px | 1.55 | — | `--text-body` |
| subheading | 19px | 1.43 | -0.19px | `--text-subheading` |
| heading | 22px | 1.43 | -0.22px | `--text-heading` |
| heading-lg | 40px | 1.2 | -0.4px | `--text-heading-lg` |
| display | 72px | 1.1 | -1.44px | `--text-display` |
| display-xl | 104px | 1 | -2.08px | `--text-display-xl` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 8 | 8px | `--spacing-8` |
| 12 | 12px | `--spacing-12` |
| 16 | 16px | `--spacing-16` |
| 20 | 20px | `--spacing-20` |
| 24 | 24px | `--spacing-24` |
| 32 | 32px | `--spacing-32` |
| 36 | 36px | `--spacing-36` |
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |
| 64 | 64px | `--spacing-64` |
| 200 | 200px | `--spacing-200` |

### Border Radius

| Element | Value |
|---------|-------|
| nav | 6px |
| tags | 6px |
| cards | 10px |
| inputs | 6px |
| buttons | 50px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| md | `rgb(255, 219, 0) 0px 0px 16px 0px` | `--shadow-md` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 20px
- **Element gap:** 20px

## Components

### Primary CTA Button
**Role:** Reserve flow entry point and any high-intent action

Pill-shaped, 50px border-radius, filled Sprint Violet (#6a48f2) background, white text. Neue Montreal 15-16px weight 500, padding 10px 20-24px. No border. The only fully chromatic control in the system — its scarcity makes it irresistible.

### Ghost Nav Link
**Role:** Top-bar navigation at rest

No background, no border. Neue Montreal 15px weight 400 in Platinum (#dddddd). On hover: color shifts to Paper (#ffffff). Horizontal row, 16px gap between items.

### Display Headline
**Role:** Hero and section titles

Neue Montreal weight 400 at 70-104px, line-height 1.0-1.1, letter-spacing -0.02em. White (#ffffff) or Bone (#f3f3f3). Never bold — the scale itself carries weight, not the stroke.

### Designer Profile Card
**Role:** Portfolio tile in the designer grid

10px border-radius, Obsidian (#171718) surface on Void (#000000) canvas. 20px internal padding. Top half: full-bleed designer photo. Bottom: name (15-16px weight 500 white), role label (15px weight 400 Ash #888888). No border, no shadow — image contrast against black does all the visual work.

### Sprint Showcase Card
**Role:** Large horizontal project preview card

6px border-radius, Obsidian (#171718) background. Contains a centered project mockup/browser image, 1px Graphite (#2c2c2e) hairline divider below image, then designer attribution row (avatar + name + role). A 'Sprint with me →' ghost button anchors the bottom-right.

### Outlined Input Field
**Role:** Form fields, email capture

1px Graphite (#2c2c2e) border, 6px border-radius, transparent background, 20px vertical padding. Placeholder text in Ash (#888888) at 15px weight 400. Focus state: border shifts to Sprint Violet (#6a48f2).

### Eyebrow Label
**Role:** Small uppercase section markers and tag chips

Neue Montreal 12-14px weight 500, uppercase, letter-spacing +0.035 to +0.040em, Ash (#888888) color. Used above section titles or inline as metadata.

### Subtext Paragraph
**Role:** Supporting copy under headlines and in card bodies

Neue Montreal 18-19px weight 400, line-height 1.43, Ash (#888888) color. Sits one contrast level below the headline — lets the display type own the page.

### Project Thumbnail Tile
**Role:** Edge-to-edge image previews in the featured-sprints row

Full-bleed photography or browser mockup, 6-10px border-radius, no border, no padding around the image. Image quality and scale do the design work — no overlay text, no gradients on the image itself.

### Inline Ghost Link
**Role:** Text-level navigation and 'Sprint with me →' inline actions

No background, 50px border-radius (pill hover state). 15-16px weight 400 white text. Hover: text shifts to Sprint Violet (#6a48f2) or gains an arrow indicator.

### Top Navigation Bar
**Role:** Global site header

Transparent over Void (#000000), no border-bottom, no background fill. Left: Stellar sparkle logo + wordmark in white. Right: nav links (15px weight 400 Platinum #dddddd) then a Sprint Violet pill CTA. Vertical padding ~20px, full-bleed width, content max-width 1200px centered.

### Section Header Block
**Role:** Reusable section intro

Display headline (70-72px weight 400 white), 20px gap, subtext paragraph (18-19px Ash #888888). Centered or left-aligned depending on section rhythm. No background, no divider — the void itself separates sections.

## Do's and Don'ts

### Do
- Use Sprint Violet (#6a48f2) only for the primary CTA fill, active link state, and focused input border — its scarcity is the design
- Set all display headlines at weight 400, never bold. The 70-104px scale carries authority through size, not stroke weight
- Apply -0.02em letter-spacing at 70px+ display sizes and +0.035-0.040em on small uppercase eyebrows — the contrast between tight display and open labels creates the type system's character
- Use 10px radius on designer cards and 50px pill radius on buttons — these two radii define the geometric language; avoid anything in between
- Layer surfaces at #000000 → #171718 → #2c2c2 — each step is one shade of difference, creating depth without illumination
- Keep subtext and supporting copy at 18-19px in Ash (#888888) so the display headline remains the loudest element on every screen
- Set page max-width to 1200px and center content — the void extends to the viewport edges but typography stays in a controlled measure

### Don't
- Do not introduce a second chromatic accent — Sprint Violet is the only color, and adding another dilutes the system
- Do not use bold (weight 600+) on any headline — weight 400 at large sizes is the signature; bold would break the hushed tone
- Do not add box-shadows to cards or buttons — depth comes from the #000000 → #171718 surface contrast, not elevation shadows
- Do not use light gray (#f3f3f3, #e9e9e9) as a page background — the entire system depends on pure void black as the canvas
- Do not use 8px or 12px border-radius on cards or buttons — the system only uses 6px (inputs/nav), 10px (cards), and 50px (buttons/links)
- Do not set body text below 15px — the type scale starts at 14px for captions only; 15-16px is the readable minimum
- Do not place white or violet text directly on a #6a48f2 background without testing contrast — use white-on-violet for the CTA text only, never decorative

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Void | `#000000` | Page background, hero canvas, section dividers |
| 2 | Obsidian | `#171718` | Designer profile cards, elevated content blocks |
| 3 | Graphite | `#2c2c2` | Input fields, outlined controls, nav borders |
| 4 | Sprint Violet | `#6a48f2` | Action surfaces — the only chromatic layer |

## Elevation

No box-shadows. Depth is achieved through surface contrast alone: pure black void (#000000) for canvas, Obsidian (#171718) for cards, Graphite (#2c2c2e) for outlined controls. The single detected shadow (rgb(255,219,0) 0px 0px 16px) is a decorative yellow glow, not elevation — used sparingly as a spotlight effect on select imagery. This shadowless approach keeps the gallery-wall feeling: cards sit ON the void, not ABOVE it.

## Imagery

Designer photography dominates: portrait crops, environmental shots, and project mockups fill card and hero real estate. Treatment is edge-to-edge within cards with 6-10px corners — no rounded-mask decoration, no overlays. The third screenshot reveals a horizontally scrolling row of designer profile cards, each with a single portrait or workspace photo at top. Imagery is desaturated or naturally muted to coexist with the dark void — no duotone filters, no color grading effects visible. Product mockups appear as browser-frame screenshots in the sprint showcase cards, centered with realistic screen content (blue CTAs, product UI). Iconography is minimal: a simple sparkle/asterisk mark for the logo, and thin-stroke arrow indicators on inline links.

## Layout

Full-bleed dark canvas with content constrained to a 1200px max-width centered column. The hero is a vertically generous void — oversized display headline (70-104px) left-aligned or centered, with subtext paragraph below and 80-100px of vertical breathing room before content begins. Sections flow as seamless dark bands separated only by whitespace; no alternating backgrounds, no dividers. The mid-page is a horizontally scrolling row of large project showcase cards (Sprint Showcase Cards) that break the vertical rhythm. Below that, a heading section introduces the designer grid: a multi-row card grid (3-4 columns visible in the screenshot) of Designer Profile Cards with uniform sizing. Navigation is a transparent top bar that disappears into the void. Density is spacious — the void is a feature, not wasted space.

## Agent Prompt Guide

**Quick Color Reference**
- background: #000000
- text: #ffffff (display), #f3f3f3 (headings), #888888 (body/subtext)
- border: #2c2c2e (outlined controls), #171718 (card edges)
- accent/primary action: #6a48f2 (filled action)
- surface: #171718 (Obsidian — cards and elevated panels)

**3-5 Example Component Prompts**

1. *Hero Section*: Pure black (#000000) background. Display headline 'Your brand or website, delivered at lightspeed.' in Neue Montreal weight 400 at 72px, color #ffffff, letter-spacing -1.44px, line-height 1.1. Subtext paragraph below in #888888 at 19px weight 400, line-height 1.43, max-width 640px. 80px vertical padding above and below the text block.

2. *Primary CTA Button*: Pill shape, 50px border-radius, Sprint Violet (#6a48f2) background fill, no border. Text 'Reserve your sprint' in Neue Montreal 15px weight 500, color #ffffff, padding 10px 24px. No hover shadow — on hover, background brightens 10%.

3. *Designer Profile Card*: 10px border-radius, Obsidian (#171718) surface. 20px padding. Top: full-width portrait photo (no padding around it, image bleeds to card edges). Bottom: designer name in 16px weight 500 #ffffff, role label in 15px weight 400 #888888 directly below. No border, no shadow.

4. *Outlined Input Field*: 1px Graphite (#2c2c2e) border, 6px border-radius, transparent background. Placeholder text in #888888 at 15px weight 400. Vertical padding 20px, horizontal padding 16px. On focus: border color shifts to Sprint Violet (#6a48f2).

5. *Eyebrow Label*: Neue Montreal 14px weight 500, uppercase, letter-spacing +0.5px, color #888888. Used above section headlines or as metadata tags. No background, no border.

## Color Rationing Philosophy

The system operates on a 95/5 color budget: 95% achromatic (#000000, #171718, #2c2c2e, #888888, #ffffff, #f3f3f3), 5% chromatic (#6a48f2). Violet appears only on the primary CTA button and the focused/active state of interactive elements. This rationing is not minimalism for its own sake — it is a conversion strategy. When a user sees Sprint Violet, it means 'this is the action.' If you find yourself wanting to add a second brand color, replace an existing usage with the neutral equivalent first.

## Similar Brands

- **Linear** — Same dark-mode void aesthetic with oversized whisper-weight display type and a single chromatic accent (Linear's purple vs Stellar's violet) rationed to primary actions only
- **Vercel** — Identical pure-black canvas philosophy with no elevation shadows, large left-aligned display headlines, and achromatic UI with color appearing only on CTAs and status indicators
- **Pitch** — Same gallery-wall dark UI with restrained palette, pill-shaped primary CTAs, and designer-grade typography that lets content breathe against the void
- **Arc Browser** — Similar premium dark-mode treatment with oversized display type, minimal chrome, and a single vivid accent color reserved for moments of interaction

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-void-black: #000000;
  --color-obsidian: #171718;
  --color-graphite: #2c2c2e;
  --color-ash: #888888;
  --color-smoke: #e9e9e9;
  --color-bone: #f3f3f3;
  --color-paper: #ffffff;
  --color-platinum: #dddddd;
  --color-sprint-violet: #6a48f2;
  --gradient-sprint-violet: linear-gradient(7deg, rgb(106, 72, 242) 20%, rgb(252, 206, 238));

  /* Typography — Font Families */
  --font-neue-montreal: 'Neue Montreal', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.5;
  --tracking-caption: 0.5px;
  --text-body: 16px;
  --leading-body: 1.55;
  --text-subheading: 19px;
  --leading-subheading: 1.43;
  --tracking-subheading: -0.19px;
  --text-heading: 22px;
  --leading-heading: 1.43;
  --tracking-heading: -0.22px;
  --text-heading-lg: 40px;
  --leading-heading-lg: 1.2;
  --tracking-heading-lg: -0.4px;
  --text-display: 72px;
  --leading-display: 1.1;
  --tracking-display: -1.44px;
  --text-display-xl: 104px;
  --leading-display-xl: 1;
  --tracking-display-xl: -2.08px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-36: 36px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-200: 200px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 20px;
  --element-gap: 20px;

  /* Border Radius */
  --radius-md: 6px;
  --radius-lg: 10px;
  --radius-full: 50px;

  /* Named Radii */
  --radius-nav: 6px;
  --radius-tags: 6px;
  --radius-cards: 10px;
  --radius-inputs: 6px;
  --radius-buttons: 50px;

  /* Shadows */
  --shadow-md: rgb(255, 219, 0) 0px 0px 16px 0px;

  /* Surfaces */
  --surface-void: #000000;
  --surface-obsidian: #171718;
  --surface-graphite: #2c2c2;
  --surface-sprint-violet: #6a48f2;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-void-black: #000000;
  --color-obsidian: #171718;
  --color-graphite: #2c2c2e;
  --color-ash: #888888;
  --color-smoke: #e9e9e9;
  --color-bone: #f3f3f3;
  --color-paper: #ffffff;
  --color-platinum: #dddddd;
  --color-sprint-violet: #6a48f2;

  /* Typography */
  --font-neue-montreal: 'Neue Montreal', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.5;
  --tracking-caption: 0.5px;
  --text-body: 16px;
  --leading-body: 1.55;
  --text-subheading: 19px;
  --leading-subheading: 1.43;
  --tracking-subheading: -0.19px;
  --text-heading: 22px;
  --leading-heading: 1.43;
  --tracking-heading: -0.22px;
  --text-heading-lg: 40px;
  --leading-heading-lg: 1.2;
  --tracking-heading-lg: -0.4px;
  --text-display: 72px;
  --leading-display: 1.1;
  --tracking-display: -1.44px;
  --text-display-xl: 104px;
  --leading-display-xl: 1;
  --tracking-display-xl: -2.08px;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-36: 36px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-200: 200px;

  /* Border Radius */
  --radius-md: 6px;
  --radius-lg: 10px;
  --radius-full: 50px;

  /* Shadows */
  --shadow-md: rgb(255, 219, 0) 0px 0px 16px 0px;
}
```
