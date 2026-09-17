# Penpot — Style Reference
> midnight design studio with teal sparks — a deep violet hero stage where one bright teal button and one teal word ignite an otherwise monochrome canvas.

**Theme:** mixed

Penpot operates as a two-act visual system: a deep midnight-violet hero stage that commands attention, then a luminous off-white working area that lets product content breathe. The chromatic palette is intentionally austere — one deep violet, one vivid teal, and neutral grays — so the colorful design tool interface (the actual product) becomes the only place multicolor lives. Work Sans at large display sizes creates confident, slightly tightened headlines, while the same family at 14–16px keeps interface chrome readable and unpretentious. Components are flat and geometric: 8px radii on controls, 20px radii on cards, hairline borders, no decorative shadows. The single teal accent is rationed carefully — it activates CTAs, the emphasis word in headlines, and a few decorative strokes — making it feel like a switch flipped on rather than decoration.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Deep Space Violet | `#151035` | `--color-deep-space-violet` | Primary brand surface — hero background, navigation, dark panels, code/token sidebars, and the product UI shell. Sets the dark-mode identity and creates the canvas against which the teal accent glows |
| Bright Teal | `#1ccac7` | `--color-bright-teal` | Primary action fill, emphasis word in headlines, active tab indicator, and decorative spark. The single chromatic note — rationed to CTAs, highlights, and one word per headline — making each occurrence feel switched on |
| Rich Violet | `#2f226c` | `--color-rich-violet` | Secondary violet for subtle borders, dividers, and accent strokes within the dark panels. A bridge between Deep Space Violet and Bright Teal on the dark canvas |
| Off-White | `#fafafa` | `--color-off-white` | Page canvas, light card surfaces, body text on dark surfaces, icon fills. The light-mode workhorse — never pure white, slightly warm to soften the contrast against Deep Space Violet |
| Light Gray | `#eeeeee` | `--color-light-gray` | Hairline borders, subtle dividers, and nav separators on light surfaces. The quietest neutral — present but never demanding attention |
| Silver | `#d3d3d3` | `--color-silver` | Button borders and disabled/secondary control outlines. Slightly heavier than Light Gray — used when a border needs to define a control edge |
| Pure Black | `#000000` | `--color-pure-black` | Body text on light surfaces and maximum-contrast borders where the violet would be too soft. Sparingly used — the violet handles most dark roles |

## Tokens — Typography

### Work Sans — The sole typeface — used for everything from 72px hero headlines down to 12px captions. Geometric humanist sans with friendly proportions; weight 400 for body, 500 for nav/buttons, 700 for headings and emphasis. The -0.028em tracking is a signature choice: it tightens the wide geometric forms of Work Sans at large sizes so headlines feel architectural rather than airy. · `--font-work-sans`
- **Substitute:** Inter, DM Sans, or Plus Jakarta Sans
- **Weights:** 400, 500, 700
- **Sizes:** 12, 14, 16, 18, 24, 48, 52, 72
- **Line height:** 1.10 (display), 1.20 (headings), 1.50 (body)
- **Letter spacing:** -0.0280em across all sizes — tightens geometric forms at display sizes and keeps body text crisp
- **Role:** The sole typeface — used for everything from 72px hero headlines down to 12px captions. Geometric humanist sans with friendly proportions; weight 400 for body, 500 for nav/buttons, 700 for headings and emphasis. The -0.028em tracking is a signature choice: it tightens the wide geometric forms of Work Sans at large sizes so headlines feel architectural rather than airy.

### Times — Times — detected in extracted data but not described by AI · `--font-times`
- **Weights:** 400
- **Sizes:** 16px
- **Line height:** 1.2
- **Role:** Times — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.5 | -0.336px | `--text-caption` |
| body-sm | 14px | 1.5 | -0.392px | `--text-body-sm` |
| body | 16px | 1.5 | -0.448px | `--text-body` |
| body-lg | 18px | 1.5 | -0.504px | `--text-body-lg` |
| subheading | 24px | 1.2 | -0.672px | `--text-subheading` |
| heading | 48px | 1.2 | -1.344px | `--text-heading` |
| heading-lg | 52px | 1.2 | -1.456px | `--text-heading-lg` |
| display | 72px | 1.1 | -2.016px | `--text-display` |

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
| 32 | 32px | `--spacing-32` |
| 40 | 40px | `--spacing-40` |

### Border Radius

| Element | Value |
|---------|-------|
| tabs | 8px |
| cards | 20px |
| pills | 9999px |
| inputs | 8px |
| buttons | 8px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80-120px
- **Card padding:** 20-24px
- **Element gap:** 8-12px

## Components

### Navigation Bar
**Role:** Top-level site navigation

Full-width dark bar on Deep Space Violet (#151035). Logo (white Penpot mark + wordmark) left, dropdown nav items (Product, Community, Resources) center-left, Pricing link, then Log In text link, a ghost 'Contact Sales' button (#fafafa border, #fafafa text, 8px radius, 8px 20px padding), and a filled teal 'Sign up' button (#1ccac7, dark text, 8px radius, 8px 20px padding). 64-72px tall, no shadow — the dark fill creates separation from the hero.

### Primary CTA Button (Filled Teal)
**Role:** Main action button

Bright Teal (#1ccac7) fill with Deep Space Violet text, 8px border-radius, padding 8px 20px. Work Sans weight 500 at 14-16px. The only filled chromatic button in the system — its scarcity makes it the definitive action. Used for 'Sign up, it's free' and the nav 'Sign up' button.

### Ghost Button (Outlined Light)
**Role:** Secondary action on dark surfaces

Transparent fill with 1px Off-White (#fafafa) border, #fafafa text, 8px border-radius, padding 8px 20px. Work Sans weight 500 at 14-16px. Used for 'Contact Sales' on the dark nav and 'Self-host install' on the hero.

### New Badge Pill
**Role:** Announcement/badge indicator

Small pill with 'New' label in Rich Violet (#2f226c) or Deep Space Violet text, rounded at 9999px or 50px radius, padding 4px 12px. Sits beside announcement text in a horizontal row. Background can be transparent on the dark hero with a subtle border. Work Sans weight 500 at 12-14px.

### Hero Headline
**Role:** Primary page headline

Work Sans weight 700 at 48-72px, #fafafa text, line-height 1.10-1.20, letter-spacing -0.028em (~-2px at 72px). The signature move: the final word switches to Bright Teal (#1ccac7) for emphasis — e.g. 'Think and build digital products. Together.' — creating a two-tone headline that is the brand's visual identity condensed into one line.

### Feature Tab Navigation
**Role:** Section tab selector

Horizontal row of 4 tab labels (UI Design, Code, Design System, AI Workflows) centered above content. Work Sans weight 500 at 14-16px in #fafafa. Active tab is distinguished by a teal underline or pill background (#1ccac7). No visible container — the tabs float on the dark hero canvas, separated by 24-32px gaps.

### Product Screenshot Frame
**Role:** Product showcase container

Large rectangular frame containing a screenshot of the Penpot design tool interface. Rounded corners at 8-20px. In the hero, shown on the dark Deep Space Violet canvas. In the feature section, placed on a warm cream/light background. No shadow — the screenshot's own internal contrast creates depth. Slightly cropped at the bottom edge of the viewport in the hero for dramatic effect.

### Design System Token Panel
**Role:** Product UI sidebar showing tokens

Dark Deep Space Violet (#151035) panel with rounded 8px corners, representing the product's left sidebar. Contains nested sections (LAYERS, ASSETS, TOKENS) with active tab highlighted in teal. Token items use Rich Violet (#2f226c) accent for selected/active states. The design system's own tokens are displayed as a meta-reference within the marketing page.

### Color Swatch Token
**Role:** Design system color display

Small circular or rounded-square swatches (20-50px) showing color values. Filled with the actual color (#1ccac7 teal, violet hues). Used within the product screenshot to demonstrate the color tokens feature. White or dark text labels beneath showing the hex value.

### Emphasis Word in Headline
**Role:** Highlighted word within a headline

A single word in a headline set in Bright Teal (#1ccac7) while the rest of the headline is Off-White (#fafafa). Work Sans weight 700, same size and tracking as the surrounding text. The defining brand gesture — one teal word per hero-level headline, always placed at the end as a period and a promise.

### Stat Badge / Icon Counter
**Role:** Quantitative indicator

Small rounded badge with an icon (headphones, etc.) and a number (35K). Rounded at 9999px (pill) or 50px. White or light teal background on the dark product canvas. Work Sans weight 500 at 14px. Used within the product UI screenshot to show analytics or token usage.

### Card with 20px Radius
**Role:** Content card

White or light surface card with 20px border-radius, hairline Light Gray (#eeeeee) border, 20-24px padding. No shadow — the border alone defines the edge. Used for feature cards, content blocks, and the product UI's own card components. The larger radius (20px vs 8px for controls) signals a different functional layer.

## Do's and Don'ts

### Do
- Use #1ccac7 fill with Deep Space Violet text for the one and only primary action button per screen — its scarcity is what makes it powerful
- Set hero headlines at 48-72px Work Sans weight 700 with -0.028em tracking, and color the final word #1ccac7 to echo the brand gesture
- Use 8px border-radius for all controls (buttons, inputs, links) and 20px for cards — the two-radius system is the geometry rule
- Separate dark sections (Deep Space Violet) from light sections (Off-White) by color block, not by shadow or divider line
- Apply -0.028em letter-spacing uniformly across all Work Sans sizes — the tightened tracking is what gives the geometric forms their architectural feel
- Use 1px #eeeeee borders for card edges and section dividers on light surfaces; use 1px #fafafa borders for ghost controls on dark surfaces
- Maintain the chromatic ration: teal appears on CTAs, one headline word, and active tab indicators — never on body text, icons, or backgrounds

### Don't
- Don't use drop shadows anywhere — Penpot builds depth through color contrast and hairline borders, not elevation
- Don't use #1ccac7 for body text, icons, or large background fills — the accent must remain rationed to single words and button fills
- Don't introduce additional chromatic colors in UI chrome — the system is intentionally achromatic with one accent; let the product screenshots carry the color
- Don't use pure white (#ffffff) for backgrounds or text — #fafafa is slightly warmer and pairs better with the deep violet
- Don't mix border-radius values randomly — controls are 8px, cards are 20px, pills are 9999px. Never use 4px or 12px
- Don't use weight 400 for headlines — weight 700 with tight tracking is the headline voice; weight 500 is for UI labels
- Don't place teal and violet in the same small area (except within the product UI screenshot) — the violet and teal relationship works because they're on opposite sides of the value scale and rarely share real estate

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Off-White Canvas | `#fafafa` | Base page background for all light sections — the default working surface |
| 1 | Card Surface | `#fafafa` | Inset card panels on the light canvas (same tone, separated by border rather than shadow) |
| 2 | Deep Space Stage | `#151035` | Hero section, navigation bar, and product UI shell — the dark mode identity |
| 3 | Teal Accent Surface | `#1ccac7` | Primary CTA buttons, active states, and emphasis — sits on top of any surface as a high-contrast focal point |

## Elevation

- **Product Screenshot Frame:** `none — the screenshot's internal contrast against the dark hero creates depth without a shadow`

## Imagery

Product screenshots are the primary visual content — large, full-width frames showing the Penpot design tool interface with its dark sidebar panels, colorful canvas content (pink, purple, yellow cards), and token management UI. The product is shown in-context: a real canvas with a design being built, not an abstract wireframe. No photography, no illustration, no 3D renders. Icon style within the product is outlined with thin strokes, monochrome. The hero product screenshot is slightly cropped at the viewport bottom for dramatic reveal. Feature sections show the product in different states (UI Design, Code, Design System, AI Workflows) to demonstrate breadth.

## Layout

The page follows a dark-to-light two-act structure: a full-viewport dark hero (Deep Space Violet, centered headline, centered CTA pair, large product screenshot extending below the fold) transitions into lighter feature sections (off-white/cream canvas with embedded product UI). The hero is centered and symmetrical with generous vertical padding (80-120px). Below the fold, content alternates between dark product showcases and light text+visual sections. The feature tab section uses centered tab navigation above a wide product screenshot. Grid usage is primarily 2-column text+image in feature sections and single-column centered stacks in the hero. Navigation is a sticky top bar on the dark canvas. Max content width approximately 1200px with 20-24px column gaps.

## Agent Prompt Guide

## Quick Color Reference
- Text on dark: #fafafa
- Text on light: #000000 or #151035
- Page background (light): #fafafa
- Dark hero surface: #151035
- Border (light surfaces): #eeeeee
- Border (dark surfaces): #fafafa
- Accent / emphasis word / active state: #1ccac7
- primary action: #1ccac7 (filled action)

## Example Component Prompts

1. **Hero Headline**: Create a hero headline at 72px, Work Sans weight 700, #fafafa, letter-spacing -2px (which is -0.028em), line-height 1.10. The final word should be #1ccac7 instead of white. Center the text on a #151035 background.

2. Create a Primary Action Button: #1ccac7 background, #000000 text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.

3. **Ghost Button on Dark**: Create a transparent button with 1px #fafafa border, #fafafa text, Work Sans weight 500 at 16px, 8px border-radius, 8px vertical and 20px horizontal padding. Place on a #151035 background.

4. **Feature Tab Bar**: Create a horizontal row of 4 tab labels (UI Design, Code, Design System, AI Workflows) centered on a #151035 background. Work Sans weight 500 at 16px, #fafafa color, 32px gap between tabs. The active tab gets a 2px #1ccac7 underline.

5. **Content Card**: Create a card with #fafafa background, 20px border-radius, 1px #eeeeee border, 24px padding. No shadow. Work Sans weight 700 at 24px for the card title and weight 400 at 16px for body text in #000000.

## Similar Brands

- **Figma** — Same dark-to-light hero structure with centered headline and product screenshot reveal; similar generous spacing and confident Work Sans / geometric sans typography
- **Linear** — Same disciplined monochrome palette with a single vivid accent color, flat surfaces with no shadows, and tight letter-spacing on large display headlines
- **Vercel** — Same dramatic dark hero stage transitioning to light content, hairline borders, and 8px-radius controls with one chromatic accent appearing sparingly
- **Supabase** — Same dark-violet/near-black hero with teal accent button, open-source platform presentation style, and Work Sans-class geometric typography

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-deep-space-violet: #151035;
  --color-bright-teal: #1ccac7;
  --color-rich-violet: #2f226c;
  --color-off-white: #fafafa;
  --color-light-gray: #eeeeee;
  --color-silver: #d3d3d3;
  --color-pure-black: #000000;

  /* Typography — Font Families */
  --font-work-sans: 'Work Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-times: 'Times', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --tracking-caption: -0.336px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.5;
  --tracking-body-sm: -0.392px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.448px;
  --text-body-lg: 18px;
  --leading-body-lg: 1.5;
  --tracking-body-lg: -0.504px;
  --text-subheading: 24px;
  --leading-subheading: 1.2;
  --tracking-subheading: -0.672px;
  --text-heading: 48px;
  --leading-heading: 1.2;
  --tracking-heading: -1.344px;
  --text-heading-lg: 52px;
  --leading-heading-lg: 1.2;
  --tracking-heading-lg: -1.456px;
  --text-display: 72px;
  --leading-display: 1.1;
  --tracking-display: -2.016px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
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
  --spacing-40: 40px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80-120px;
  --card-padding: 20-24px;
  --element-gap: 8-12px;

  /* Border Radius */
  --radius-sm: 2px;
  --radius-lg: 8px;
  --radius-2xl: 20px;
  --radius-full: 50px;
  --radius-full-2: 100px;

  /* Named Radii */
  --radius-tabs: 8px;
  --radius-cards: 20px;
  --radius-pills: 9999px;
  --radius-inputs: 8px;
  --radius-buttons: 8px;

  /* Surfaces */
  --surface-off-white-canvas: #fafafa;
  --surface-card-surface: #fafafa;
  --surface-deep-space-stage: #151035;
  --surface-teal-accent-surface: #1ccac7;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-deep-space-violet: #151035;
  --color-bright-teal: #1ccac7;
  --color-rich-violet: #2f226c;
  --color-off-white: #fafafa;
  --color-light-gray: #eeeeee;
  --color-silver: #d3d3d3;
  --color-pure-black: #000000;

  /* Typography */
  --font-work-sans: 'Work Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-times: 'Times', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --tracking-caption: -0.336px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.5;
  --tracking-body-sm: -0.392px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.448px;
  --text-body-lg: 18px;
  --leading-body-lg: 1.5;
  --tracking-body-lg: -0.504px;
  --text-subheading: 24px;
  --leading-subheading: 1.2;
  --tracking-subheading: -0.672px;
  --text-heading: 48px;
  --leading-heading: 1.2;
  --tracking-heading: -1.344px;
  --text-heading-lg: 52px;
  --leading-heading-lg: 1.2;
  --tracking-heading-lg: -1.456px;
  --text-display: 72px;
  --leading-display: 1.1;
  --tracking-display: -2.016px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;

  /* Border Radius */
  --radius-sm: 2px;
  --radius-lg: 8px;
  --radius-2xl: 20px;
  --radius-full: 50px;
  --radius-full-2: 100px;
}
```
