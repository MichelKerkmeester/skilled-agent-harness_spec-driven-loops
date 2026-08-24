# Copy — Style Reference
> violet voltage on white blueprint

**Theme:** light

Copy.ai operates as a sunlit enterprise platform: white canvas, crisp black text, and a single vivid violet that acts as electric punctuation across an otherwise quiet monochrome interface. The design language is assertive but restrained — heavy display weights in a custom grotesque deliver headlines with presence, while a universal 4px radius keeps every surface sharp and architectural rather than soft. Depth comes from a violet gradient hero band and inset hairline shadows on buttons, not from drop shadows or skeuomorphism. Components are flat, dense with information, and grid-aligned, with cards sitting on white rather than tinted surfaces to maintain contrast discipline.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Voltage Violet | `#693edf` | `--color-voltage-violet` | Violet supporting accent for decorative details and low-frequency emphasis. Do not promote it to the primary CTA color |
| Deep Iris | `#4f1bb7` | `--color-deep-iris` | Mid-gradient stop in hero band and platform diagram backgrounds. Bridges Voltage Violet to darker violet depths |
| Plum Voltage | `#4514a6` | `--color-plum-voltage` | Deeper gradient stop, card-on-violet backgrounds in platform architecture diagram |
| Royal Purple | `#3b0d96` | `--color-royal-purple` | Even deeper gradient stop; used in platform diagram cells and hero band lower section |
| Indigo Abyss | `#29007a` | `--color-indigo-abyss` | Deepest gradient stop; anchors the bottom of the hero band and provides shadow depth in violet illustrations |
| Lavender Mist | `#c1b9f4` | `--color-lavender-mist` | Soft violet tint — decorative washes, subtle highlights on violet illustrations, muted violet borders on light backgrounds |
| Cobalt Vein | `#7249f1` | `--color-cobalt-vein` | Slightly lighter violet stroke for illustration linework and decorative connectors in hero graphics |
| Ink | `#000b0f` | `--color-ink` | Primary text color on light backgrounds; near-black with a barely perceptible cool cast. Used for body copy and headings |
| Obsidian | `#171717` | `--color-obsidian` | Dominant text and icon color across the entire interface. The workhorse neutral for headings, body, nav, and icon fills |
| Graphite | `#222222` | `--color-graphite` | Secondary heading weight and nav text; darker than mid-gray but lighter than Obsidian |
| Slate | `#364045` | `--color-slate` | Muted heading and button text on light surfaces; cool gray with blue undertone |
| Iron | `#566b76` | `--color-iron` | Body text secondary level, descriptive paragraphs, and muted helper text. Highest frequency gray |
| Steel | `#5d5d5d` | `--color-steel` | Utility text and less-prominent body content; neutral mid-gray with no color cast |
| Fog | `#878787` | `--color-fog` | Icon strokes and decorative linework in illustrations |
| Ash | `#a6a6a6` | `--color-ash` | Light decorative strokes and illustration linework |
| Mist | `#ccd9e0` | `--color-mist` | Button borders on light surfaces; cool pale gray with slight blue cast |
| Cloud | `#e2e8eb` | `--color-cloud` | Dividers, subtle borders, and box-shadow base color; the universal hairline gray |
| Ice | `#e4edf1` | `--color-ice` | Input borders and card edge dividers; slightly cooler than Cloud |
| Snow | `#f6fafb` | `--color-snow` | Page canvas background; off-white with the faintest cool tint to soften the page without going gray |
| Paper | `#ffffff` | `--color-paper` | Card surfaces, button text on dark fills, and nav background; pure white for maximum contrast |
| Midnight Steel | `#1d2130` | `--color-midnight-steel` | Dark surface accent borders; used as outline color on dark elements |
| Charcoal | `#333333` | `--color-charcoal` | Nav and UI utility text; near-black neutral |
| Jet | `#535866` | `--color-jet` | Stroke color for illustrations and decorative SVG linework; cool dark gray |

## Tokens — Typography

### Inter — Universal UI and body typeface. Handles navigation, body copy, button labels, badges, card descriptions, and all interface text. Weight 400 for body, 500 for emphasized text and labels, 600 for buttons and nav, 700 for high-emphasis callouts. The tight -0.005em tracking at body sizes keeps dense text crisp without feeling mechanical. · `--font-inter`
- **Substitute:** system-ui, -apple-system, Segoe UI, Roboto
- **Weights:** 400, 500, 600, 700
- **Sizes:** 12px, 14px, 16px, 22px, 24px
- **Line height:** 1.17, 1.33, 1.43, 1.45, 1.50, 1.57, 1.69, 2.00
- **Letter spacing:** -0.02em at 12-14px, -0.005em at 16-24px
- **OpenType features:** `"cv11", "ss01" on for brand-aligned character variants`
- **Role:** Universal UI and body typeface. Handles navigation, body copy, button labels, badges, card descriptions, and all interface text. Weight 400 for body, 500 for emphasized text and labels, 600 for buttons and nav, 700 for high-emphasis callouts. The tight -0.005em tracking at body sizes keeps dense text crisp without feeling mechanical.

### ABC Normal — Display and heading typeface. Custom geometric grotesque with tight tracking (-0.02em) and aggressive sizing from 24px subheadings up to 88px hero display. Weight 600 for maximum impact headlines, 500 for sub-headings. The negative letter-spacing and sharp geometric forms give the brand its architectural, almost engineering-drawing feel. Substitute: Space Grotesk, then Plus Jakarta Sans. · `--font-abc-normal`
- **Weights:** 500, 600
- **Sizes:** 24px, 26px, 28px, 32px, 48px, 56px, 88px
- **Line height:** 1.00, 1.18, 1.31, 1.40, 1.42, 1.50
- **Letter spacing:** -0.02em at 48px and above, 0.005em to 0.01em at 24-32px
- **OpenType features:** `"ss01" on (if available), tabular numerals for metric displays`
- **Role:** Display and heading typeface. Custom geometric grotesque with tight tracking (-0.02em) and aggressive sizing from 24px subheadings up to 88px hero display. Weight 600 for maximum impact headlines, 500 for sub-headings. The negative letter-spacing and sharp geometric forms give the brand its architectural, almost engineering-drawing feel. Substitute: Space Grotesk, then Plus Jakarta Sans.

### ABC Normal Regular — ABC Normal Regular — detected in extracted data but not described by AI · `--font-abc-normal-regular`
- **Weights:** 400
- **Sizes:** 26px
- **Line height:** 1.31
- **Letter spacing:** 0.01
- **Role:** ABC Normal Regular — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.5 | -0.24px | `--text-caption` |
| body-sm | 14px | 1.57 | -0.28px | `--text-body-sm` |
| body | 16px | 1.5 | -0.08px | `--text-body` |
| subheading | 24px | 1.31 | 0.12px | `--text-subheading` |
| heading-sm | 28px | 1.31 | -0.56px | `--text-heading-sm` |
| heading | 32px | 1.4 | -0.64px | `--text-heading` |
| heading-lg | 48px | 1.18 | -0.96px | `--text-heading-lg` |
| display | 56px | 1 | -1.12px | `--text-display` |
| display-lg | 88px | 1 | -1.76px | `--text-display-lg` |

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
| 28 | 28px | `--spacing-28` |
| 32 | 32px | `--spacing-32` |
| 36 | 36px | `--spacing-36` |
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |
| 52 | 52px | `--spacing-52` |
| 60 | 60px | `--spacing-60` |
| 64 | 64px | `--spacing-64` |
| 80 | 80px | `--spacing-80` |
| 84 | 84px | `--spacing-84` |
| 100 | 100px | `--spacing-100` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 4px |
| badges | 4px |
| images | 4px |
| inputs | 4px |
| buttons | 4px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| subtle | `rgba(204, 217, 224, 0.2) 0px -3px 0px 0px inset` | `--shadow-subtle` |
| subtle-2 | `rgba(255, 255, 255, 0.1) 0px 1px 0px 0px` | `--shadow-subtle-2` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 24px
- **Element gap:** 24px

## Components

### Primary CTA Button
**Role:** Hero and nav-level call-to-action across the platform.

Filled violet button with Voltage Violet (#693edf) background, white text in Inter 600 at 14-16px, 4px border-radius, 16px vertical / 24px horizontal padding. Inset top shadow (rgba(204, 217, 224, 0.2) 0px -3px 0px 0px inset) creates a pressed-in edge that is signature to this system — the button looks slightly recessed rather than raised. Text is Paper (#ffffff).

### Ghost/Text Link Button
**Role:** Secondary actions and inline navigation links.

Transparent background with Iron (#566b76) text in Inter 500 at 14-14px, no border, 4px radius. Sits inline with Primary CTAs as a secondary action (e.g., 'Learn more' next to 'Get Demo').

### Outlined Ghost Button
**Role:** Low-emphasis interactive elements.

Transparent background with Mist (#ccd9e0) 1px border, Obsidian (#171717) text in Inter 500 at 14px, 4px radius, 16px/20px padding. Same inset shadow treatment as primary button for consistency.

### Hero Gradient Band
**Role:** Full-width violet band serving as the dominant visual anchor on the homepage.

A full-bleed horizontal band with a linear gradient flowing from Voltage Violet (#693edf) at top through Deep Iris (#4f1bb7), Plum Voltage (#4514a6), Royal Purple (#3b0d96), down to Indigo Abyss (#29007a). White text in ABC Normal sits on the gradient. Contains 4 white dot-pipeline connectors (Create Content, Generate Pipeline, Execute Campaigns, Close Deals) and a floating white email-capture card with a dark CTA.

### Feature Card (Playbook Grid)
**Role:** Grid card presenting an AI playbook/use-case.

White (#ffffff) card on the Snow (#f6fafb) page background. 4px border-radius, 24px internal padding, no drop shadow, separated by whitespace alone. Contains two small violet-tinted category tags (SALES, MARKETING, OPERATIONS) at top, ABC Normal heading at 24-28px, body description in Inter 14-16px, and inline ghost/primary button pair at the bottom.

### Category Tag Badge
**Role:** Small labels atop feature cards and section headers.

Lavender Mist (#c1b9f4) background with deeper violet text, or outlined variant with Cobalt Vein (#7249f1) border. Inter 600 at 12px, uppercase tracking, 4px radius, 4px/8px padding. Functions as taxonomic color-coding across the playbook grid.

### Email Capture Input
**Role:** Hero band lead-capture form.

White (#ffffff) background, 1px Ice (#e4edf1) border, 4px radius, 16px padding. Inter 400 placeholder text at 16px in a muted gray. Pairs with a dark filled submit button inside the same card container.

### Platform Architecture Diagram
**Role:** Visual representation of the GTM AI Platform product layers.

A multi-cell diagram on a violet gradient background (Deep Iris → Royal Purple). Each cell has a white heading (ABC Normal, 24px), a description in Inter 14px, and sits on semi-transparent darker violet panels with 4px radius. No drop shadows — depth comes purely from the gradient color shift between cells.

### Navigation Bar
**Role:** Top-of-page persistent navigation.

White (#ffffff) background, 64-72px height, horizontal layout with logo left, centered menu items (Platform, Use cases, Resources, Pricing, GTM AI) with dropdown chevrons, and right-aligned Login link + Primary CTA button. Nav text in Inter 500 at 14-16px, Iron color. No visible bottom border — separation is by background contrast alone.

### Announcement Banner
**Role:** Top-of-page promotional strip.

Dark background (Obsidian #171717 or similar dark) with white text in Inter 500 at 13-14px, white CTA button on the right. Full-width, ~40px height. Used for product launches and report releases.

### Section Header Block
**Role:** Standardized heading + subheading at the top of content sections.

Left-aligned ABC Normal heading at 48-56px in Ink (#000b0f), with a Inter 400 subheading in Iron (#566b76) at 16-18px below. Tight 24-32px gap between heading and subtext. No decorative elements — relies on type contrast alone.

### Integration Logo Strip
**Role:** Horizontal row of partner/integration logos.

A single row of desaturated or grayscale logos (Salesforce, HubSpot, Gong, Zapier, Outreach, etc.) on white or violet background. No borders or cards — logos sit freely with 24-32px column gaps.

### Trusted By Counter
**Role:** Social proof line beneath the hero.

Single line of Inter 400 text in Iron color, 14px, with the number '17 million' bolded in Obsidian. Left-aligned, no decorative iconography.

### Footer
**Role:** Bottom-of-page site map and legal links.

Dark or white background depending on page, multi-column link grid, Inter 400 at 14px in Iron. Column headers in Inter 600 at 14px in Obsidian.

## Do's and Don'ts

### Do
- Use ABC Normal for all headings 24px and above; never substitute with Inter for display sizes
- Set all border-radii to 4px — buttons, cards, inputs, badges, images all share the same sharp architectural corner
- Use the violet gradient (#693edf → #29007a) only for full-width hero bands and product diagram cells, never for buttons or small elements
- Apply the inset top shadow (rgba(204, 217, 224, 0.2) 0px -3px 0px inset) to all interactive button variants for consistent pressed-edge treatment
- Set body text in Inter 400 at 16px with -0.005em letter-spacing; never use ABC Normal for body copy
- Use Voltage Violet (#693edf) as the sole accent color for CTAs, active states, and category badges — never introduce additional brand hues
- Maintain white card surfaces on Snow (#f6fafb) page canvas with whitespace separation; avoid drop shadows on cards

### Don't
- Do not use drop shadows for card elevation — this system separates layers by background color contrast alone
- Do not use border-radii larger than 4px anywhere in the interface; soft/rounded shapes break the architectural language
- Do not place body text below 14px or above 16px in the Inter scale
- Do not apply the violet gradient to small UI elements like tags, icons, or hover states — it is reserved for hero-scale surfaces
- Do not use multiple accent colors; the palette is deliberately monochrome with one violet voltage point
- Do not use italic or decorative typefaces; both ABC Normal and Inter are set in upright weights only
- Do not center-align body paragraphs or feature card descriptions — left-align with tight 1.4-1.5 line-height

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Page Canvas | `#f6fafb` | Base page background; off-white with subtle cool tint to soften without going gray |
| 2 | Card Surface | `#ffffff` | Feature cards, navigation bar, input fields, and all raised content layers |
| 3 | Hero Gradient Band | `#693edf` | Full-width hero section gradient surface; the only chromatic surface in the system |
| 4 | Platform Diagram Cells | `#4f1bb7` | Darker violet cell backgrounds for product architecture visualization |
| 5 | Dark Announcement Strip | `#171717` | Top promotional banner; dark accent surface for time-sensitive content |

## Elevation

- **Primary CTA Button:** `inset 0 -3px 0 0 rgba(204, 217, 224, 0.2)`
- **Outlined Ghost Button:** `inset 0 -3px 0 0 rgba(204, 217, 224, 0.2)`

## Imagery

The site uses a hybrid visual language: abstract geometric illustration in the hero (angular violet ribbon shapes with white dot-pipeline connectors and circuit-like nodes) and product/diagram screenshots in the platform section (multi-cell architecture grids on violet backgrounds). All illustration linework uses a restricted palette of violet shades (#693edf, #7249f1, #c1b9f4) and dark neutrals (#535866, #000000), creating a cohesive 'engineering blueprint' aesthetic. Partner logos (Salesforce, HubSpot, OpenAI, Anthropic) appear as flat grayscale marks. There is no photography — the visual system is entirely illustration + UI, which reinforces the technical/infrastructure positioning of the product.

## Layout

Page model is max-width 1200px centered on a Snow (#f6fafb) canvas, with full-bleed sections (hero gradient band, announcement strip) breaking out to the viewport edges. The hero pattern is a split composition: left column carries bold ABC Normal display text (88px headline), right column carries a descriptive paragraph and floating email-capture card, all overlaid on a full-bleed violet gradient band. Section rhythm alternates between white and the off-white canvas with no visible dividers — separation is by whitespace and 80px section gaps. Content arrangement is consistently left-aligned with 2-column text+diagram blocks and a 3-column card grid for the 'Design Your GTM AI Playbook' section. Navigation is a minimal top bar with dropdown menus and a right-aligned CTA.

## Agent Prompt Guide

**Quick Color Reference**
- Text: #171717 (Obsidian) for primary, #566b76 (Iron) for body, #000b0f (Ink) for headings
- Background: #ffffff (Paper) for cards, #f6fafb (Snow) for page canvas
- Border: #e2e8eb (Cloud) for dividers, #e4edf1 (Ice) for input borders, #ccd9e0 (Mist) for button outlines
- Accent: #693edf (Voltage Violet) for CTAs, active states, and category badges
- primary action: no distinct CTA color

**3-5 Example Component Prompts**

1. **Hero section**: Full-bleed gradient band from #693edf to #29007a (top to bottom). ABC Normal display headline at 56-88px weight 600, #ffffff, letter-spacing -1.12px to -1.76px. Subtext at 18px Inter 400, #ffffff at 80% opacity. White email-capture card (24px padding, 4px radius) with a light input field and dark submit button.

2. **Feature card grid (3-column)**: White (#ffffff) card on Snow (#f6fafb) page. 4px radius, 24px padding, no shadow. Top: two badges with #c1b9f4 background and #693edf text, Inter 600 12px uppercase. Heading: ABC Normal 24px weight 500, #000b0f. Body: Inter 400 14px, #566b76. Bottom: ghost link 'Learn more' (#566b76) beside a small outlined 'Get Demo' button.

No distinct primary action color was observed; use the extracted neutral button treatments instead of inventing a filled CTA color.

4. **Section header**: ABC Normal 48px weight 600 in #000b0f, letter-spacing -0.96px. Below it, Inter 400 18px in #566b76, max-width 640px. 80px margin-top from previous section, 40px gap between heading and subtext.

5. **Platform architecture diagram cell**: Background #4f1bb7 (violet cell), 4px radius, 24px padding. Heading in ABC Normal 24px weight 500, white. Description in Inter 400 14px, white at 85% opacity. Arranged in a 3x2 or 4x2 grid with 8px gaps between cells.

## Gradient System

The gradient is a fixed 5-stop linear progression used exclusively for the hero band and platform architecture diagrams:

linear-gradient(180deg, #693edf 0%, #4f1bb7 25%, #4514a6 50%, #3b0d96 75%, #29007a 100%)

This is not a decorative flourish — it is a structural element that defines the product's visual identity. The gradient always flows top-to-bottom (not diagonal) and the stops are evenly distributed. Never truncate, skew, or recolor this gradient. It should only appear on full-bleed horizontal bands, not on cards, buttons, or small surfaces.

## Similar Brands

- **Linear** — Same custom geometric grotesque for display type, flat white card surfaces, and absence of drop shadows in favor of background contrast for elevation
- **Vercel** — Identical monochrome-with-single-accent strategy, ultra-clean navigation, and high-contrast black-on-white type hierarchy with negative letter-spacing on headlines
- **Retool** — Same architectural product-platform aesthetic with grid-based feature cards, inset button shadows, and a 4px universal border-radius system
- **Grafana** — Similar dark-on-light contrast discipline with violet/purple accent system, and the use of full-bleed gradient bands as primary visual anchors
- **Resend** — Matches the sharp 4px radius system, bold display headlines, and the 'engineering blueprint' visual treatment with geometric illustration accents

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-voltage-violet: #693edf;
  --color-deep-iris: #4f1bb7;
  --color-plum-voltage: #4514a6;
  --color-royal-purple: #3b0d96;
  --color-indigo-abyss: #29007a;
  --color-lavender-mist: #c1b9f4;
  --color-cobalt-vein: #7249f1;
  --color-ink: #000b0f;
  --color-obsidian: #171717;
  --color-graphite: #222222;
  --color-slate: #364045;
  --color-iron: #566b76;
  --color-steel: #5d5d5d;
  --color-fog: #878787;
  --color-ash: #a6a6a6;
  --color-mist: #ccd9e0;
  --color-cloud: #e2e8eb;
  --color-ice: #e4edf1;
  --color-snow: #f6fafb;
  --color-paper: #ffffff;
  --color-midnight-steel: #1d2130;
  --color-charcoal: #333333;
  --color-jet: #535866;

  /* Typography — Font Families */
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-abc-normal: 'ABC Normal', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-abc-normal-regular: 'ABC Normal Regular', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --tracking-caption: -0.24px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.57;
  --tracking-body-sm: -0.28px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.08px;
  --text-subheading: 24px;
  --leading-subheading: 1.31;
  --tracking-subheading: 0.12px;
  --text-heading-sm: 28px;
  --leading-heading-sm: 1.31;
  --tracking-heading-sm: -0.56px;
  --text-heading: 32px;
  --leading-heading: 1.4;
  --tracking-heading: -0.64px;
  --text-heading-lg: 48px;
  --leading-heading-lg: 1.18;
  --tracking-heading-lg: -0.96px;
  --text-display: 56px;
  --leading-display: 1;
  --tracking-display: -1.12px;
  --text-display-lg: 88px;
  --leading-display-lg: 1;
  --tracking-display-lg: -1.76px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-28: 28px;
  --spacing-32: 32px;
  --spacing-36: 36px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-52: 52px;
  --spacing-60: 60px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-84: 84px;
  --spacing-100: 100px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 24px;
  --element-gap: 24px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;

  /* Named Radii */
  --radius-cards: 4px;
  --radius-badges: 4px;
  --radius-images: 4px;
  --radius-inputs: 4px;
  --radius-buttons: 4px;

  /* Shadows */
  --shadow-subtle: rgba(204, 217, 224, 0.2) 0px -3px 0px 0px inset;
  --shadow-subtle-2: rgba(255, 255, 255, 0.1) 0px 1px 0px 0px;

  /* Surfaces */
  --surface-page-canvas: #f6fafb;
  --surface-card-surface: #ffffff;
  --surface-hero-gradient-band: #693edf;
  --surface-platform-diagram-cells: #4f1bb7;
  --surface-dark-announcement-strip: #171717;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-voltage-violet: #693edf;
  --color-deep-iris: #4f1bb7;
  --color-plum-voltage: #4514a6;
  --color-royal-purple: #3b0d96;
  --color-indigo-abyss: #29007a;
  --color-lavender-mist: #c1b9f4;
  --color-cobalt-vein: #7249f1;
  --color-ink: #000b0f;
  --color-obsidian: #171717;
  --color-graphite: #222222;
  --color-slate: #364045;
  --color-iron: #566b76;
  --color-steel: #5d5d5d;
  --color-fog: #878787;
  --color-ash: #a6a6a6;
  --color-mist: #ccd9e0;
  --color-cloud: #e2e8eb;
  --color-ice: #e4edf1;
  --color-snow: #f6fafb;
  --color-paper: #ffffff;
  --color-midnight-steel: #1d2130;
  --color-charcoal: #333333;
  --color-jet: #535866;

  /* Typography */
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-abc-normal: 'ABC Normal', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-abc-normal-regular: 'ABC Normal Regular', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --tracking-caption: -0.24px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.57;
  --tracking-body-sm: -0.28px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.08px;
  --text-subheading: 24px;
  --leading-subheading: 1.31;
  --tracking-subheading: 0.12px;
  --text-heading-sm: 28px;
  --leading-heading-sm: 1.31;
  --tracking-heading-sm: -0.56px;
  --text-heading: 32px;
  --leading-heading: 1.4;
  --tracking-heading: -0.64px;
  --text-heading-lg: 48px;
  --leading-heading-lg: 1.18;
  --tracking-heading-lg: -0.96px;
  --text-display: 56px;
  --leading-display: 1;
  --tracking-display: -1.12px;
  --text-display-lg: 88px;
  --leading-display-lg: 1;
  --tracking-display-lg: -1.76px;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-28: 28px;
  --spacing-32: 32px;
  --spacing-36: 36px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-52: 52px;
  --spacing-60: 60px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-84: 84px;
  --spacing-100: 100px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;

  /* Shadows */
  --shadow-subtle: rgba(204, 217, 224, 0.2) 0px -3px 0px 0px inset;
  --shadow-subtle-2: rgba(255, 255, 255, 0.1) 0px 1px 0px 0px;
}
```
