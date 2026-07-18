# Morphic — Style Reference
> Dark cinema canvas for AI storytelling. Pure black absorbs everything except the blue pulse of a single accent and the glow of generated imagery.

**Theme:** dark

Morphic operates as a dark cinema canvas for AI storytelling — pure black backgrounds swallow visual noise so generated imagery becomes the only source of color and light. The system is 99% achromatic: a tightly stepped neutral surface stack from #000000 through #212121 to #333333 carries the interface, while white text and gray subtext create hierarchy without competing with the artwork. A single vivid blue (#0075ff) is the only chromatic accent, reserved for primary actions, the 'New' badge, and the Share button — it functions as an electrical pulse against the matte dark, never decorative. Typography is Inter at all weights and sizes, with whisper-tight tracking on large display sizes and generous line-height on body copy. Components feel glassy and recessed: thin borders at near-invisible opacity, soft 10-16px radii, and almost no shadows. The density is compact (4px base, 8px gaps) and the layout is wide-bleed with horizontal-scrolling card rows, giving the site the rhythm of a streaming gallery rather than a traditional SaaS page.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Pure Black | `#000000` | `--color-pure-black` | Page canvas, hero backgrounds, full-bleed sections — the void that makes all imagery and accent color read as luminous |
| Surface One | `#212121` | `--color-surface-one` | Primary card surface, elevated panels, and section backgrounds one level above the canvas |
| Surface Two | `#292929` | `--color-surface-two` | Secondary button background (ghost/outlined), nested cards, and hover surfaces one step lighter than Surface One |
| Surface Three | `#333333` | `--color-surface-three` | Tertiary button background, highest elevation layer, and active-state surface tints |
| Paper White | `#ffffff` | `--color-paper-white` | Primary headings, button text, logo, and high-emphasis copy on dark surfaces |
| Fog | `#e5e7eb` | `--color-fog` | Hairline borders and dividers — applied at very low opacity so cards have edge definition without visual weight |
| Mist | `#f5f5f5` | `--color-mist` | Soft highlight washes, secondary text on light surfaces, and subtle icon fills |
| Mid Gray | `#999999` | `--color-mid-gray` | Muted body text, inactive labels, and disabled-state copy |
| Steel | `#737373` | `--color-steel` | Link text in resting state, secondary annotations, and icon strokes at low contrast |
| Graphite | `#666666` | `--color-graphite` | Tertiary headings, caption text, and supporting metadata |
| Slate | `#525252` | `--color-slate` | Lowest-emphasis body text, helper copy, and subdued annotations |
| Charcoal | `#404040` | `--color-charcoal` | Icon strokes and outlines at medium contrast, secondary borders |
| Electric Blue | `#0075ff` | `--color-electric-blue` | Blue action color for filled buttons, selected navigation states, and focused conversion moments. |

## Tokens — Typography

### Inter — Sole typeface across all UI, headings, and body. The complete weight range (400-700) allows a single family to carry the full hierarchy: 700 for display headlines, 600 for section headers, 500 for buttons and nav, 400 for body and captions. Inter's geometric neutrality and tall x-height make it ideal for a dark canvas where character width and spacing carry more visual weight than personality. · `--font-inter`
- **Substitute:** IBM Plex Sans, Geist, system-ui
- **Weights:** 400, 500, 600, 700
- **Sizes:** 10px, 12px, 14px, 16px, 18px, 20px, 40px, 52px
- **Line height:** 1.15, 1.20, 1.29, 1.33, 1.38, 1.40, 1.44, 1.48, 1.50
- **Letter spacing:** -0.0620em at 52px (~-3.2px), -0.0480em at 40px (~-1.9px), -0.0220em at 18px (~-0.4px), -0.0150em at 16px (~-0.24px), -0.0100em at 14px (~-0.14px)
- **OpenType features:** `"cv11", "ss01"`
- **Role:** Sole typeface across all UI, headings, and body. The complete weight range (400-700) allows a single family to carry the full hierarchy: 700 for display headlines, 600 for section headers, 500 for buttons and nav, 400 for body and captions. Inter's geometric neutrality and tall x-height make it ideal for a dark canvas where character width and spacing carry more visual weight than personality.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 10px | 1.4 | -0.1px | `--text-caption` |
| body | 14px | 1.5 | -0.14px | `--text-body` |
| body-lg | 18px | 1.4 | -0.4px | `--text-body-lg` |
| heading-sm | 20px | 1.33 | -0.44px | `--text-heading-sm` |
| heading | 40px | 1.15 | -1.9px | `--text-heading` |
| display | 52px | 1.15 | -3.2px | `--text-display` |

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
| 28 | 28px | `--spacing-28` |
| 32 | 32px | `--spacing-32` |
| 40 | 40px | `--spacing-40` |
| 60 | 60px | `--spacing-60` |
| 72 | 72px | `--spacing-72` |
| 80 | 80px | `--spacing-80` |
| 96 | 96px | `--spacing-96` |
| 100 | 100px | `--spacing-100` |
| 140 | 140px | `--spacing-140` |
| 180 | 180px | `--spacing-180` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 100px |
| cards | 10px |
| pills | 100px |
| badges | 7px |
| modals | 24px |
| buttons | 7px |
| large-cards | 16px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| xl | `rgba(0, 0, 0, 0.1) 0px 20px 25px -5px, rgba(0, 0, 0, 0.1)...` | `--shadow-xl` |

### Layout

- **Page max-width:** 1280px
- **Section gap:** 96px
- **Card padding:** 12px
- **Element gap:** 8px

## Components

### Primary CTA Button
**Role:** The only filled chromatic action in the system

Filled #0075ff background, #ffffff text at 14px Inter weight 500, 7px border-radius, 8px vertical padding, 16px horizontal padding. Used exclusively for 'Start for free', 'Share', and other conversion actions. No border, no shadow — the saturated blue against pure black does all the work.

### Secondary Button
**Role:** Non-primary action button on dark surfaces

Filled #292929 background, #ffffff text at 14px Inter weight 500, 7px border-radius, 8px vertical padding, 16px horizontal padding. Used for 'Book a demo', 'Log in', and other secondary CTAs. Rises one surface level from the canvas to feel clickable without competing with the primary action.

### Outline Button
**Role:** Tertiary or navigation-adjacent action

Transparent background, 1px #e5e7eb border at low opacity, #ffffff text at 14px Inter weight 500, 7px border-radius, 8px vertical padding, 16px horizontal padding. Used for 'See more' and navigation-adjacent actions where a filled button would be too heavy.

### Pill Tag
**Role:** Category or filter label in card grids

Fully rounded (100px radius) tag with 1px #e5e7eb border at low opacity, #ffffff text at 12px Inter weight 500, 4px vertical padding, 12px horizontal padding. Used as metadata labels on workflow and showcase cards.

### New Badge
**Role:** Announcement indicator for new features

Filled #0075ff background, #ffffff text at 12px Inter weight 500, 7px border-radius, 4px vertical padding, 8px horizontal padding. Sits inline with announcement text (e.g., 'New Seedance 2.0 on all paid plans'). The blue fill against black makes it the most attention-grabbing micro-element on the page.

### Image Showcase Card
**Role:** Display container for AI-generated images in the gallery grid

No visible background (image fills the card), 10px border-radius, no padding, optional soft shadow (rgba(0,0,0,0.1) 0px 20px 25px -5px, rgba(0,0,0,0.1) 0px 8px 10px -6px). Cards sit directly on the black canvas with no border — the image content defines the card edge.

### Workflow Card
**Role:** Horizontally-scrolling content card with title and description

#212121 background, 10px border-radius, 1px #e5e7eb border at low opacity, 12px internal padding. Image fills the top portion at 16px radius (top corners only), title at 14px Inter weight 600 #ffffff, description at 12px Inter weight 400 #999999. Used in the 'Workflows' and 'Endless possibilities' horizontal-scrolling sections.

### Tab Control
**Role:** Product mode switcher in the Canvas product UI

Three text tabs ('Canvas', 'Copilot', 'Compose') on transparent background, 12px Inter weight 500, #999999 for inactive, #ffffff for active. Active tab has a subtle #292929 pill background at 7px radius. No underline, no border — the background fill is the only active indicator.

### Navigation Bar
**Role:** Top-level site navigation

Transparent background over black canvas, fixed/sticky height ~64px. Logo (Morphic mark + wordmark) on left at 20px, center nav links (Showcase, Pricing, Enterprise, Resources) at 14px Inter weight 500 #ffffff, right side has 'Log in' text link and an outline 'Start creating' button. No visible background, no border — the nav floats on the dark void.

### Hero Headline Block
**Role:** Two-line display headline in the hero section

Line 1: 52px Inter weight 700, #ffffff, letter-spacing -3.2px. Line 2: 52px Inter weight 700, #999999, letter-spacing -3.2px. The gray-on-white treatment on the second line creates a visual echo — the headline is split into 'statement' and 'context', where the context is deliberately muted to let the statement land.

### Section Header
**Role:** Repeating section title pattern (e.g., 'Workflows / Built for speed')

Line 1: 40px Inter weight 700, #ffffff, letter-spacing -1.9px. Line 2: 40px Inter weight 700, #999999, letter-spacing -1.9px. Same two-tone treatment as the hero, scaled down. This pattern repeats across all major sections and is the site's signature typographic device.

### Avatar Stack
**Role:** Social proof element (e.g., review author avatars)

Overlapping circular avatars at 20px diameter, with 2px black border to separate overlapping circles. No background container. Used alongside testimonial text at 12px Inter weight 400 #999999.

### Product UI Mockup Panel
**Role:** Embedded screenshot of the Morphic product interface

#212121 background, 16px border-radius, 1px #e5e7eb border at low opacity, 12px internal padding. Contains a dark UI with toolbar elements (project name, tab controls, Share button) at the top. Functions as a large hero visual in the 'Explore with Canvas' section.

### Navigation Link Arrow
**Role:** Chevron or arrow indicator next to nav items

Simple 6px Inter weight 400 #999999 character (› or chevron icon), no background, inline with text. Used in the announcement bar ('Seedance 2.0 ›') to indicate clickability.

## Do's and Don'ts

### Do
- Use #0075ff exclusively for primary actions and the 'New' badge — never as a decorative accent, background tint, or text color outside of a clickable element
- Apply the two-tone headline pattern (white line 1, #999999 line 2) for all section headers and the hero — this is the site's signature typographic device
- Use the surface stack #000000 → #212121 → #292929 → #333333 for hierarchy; never introduce a new shade between steps
- Apply -0.0620em letter-spacing at 52px and -0.0480em at 40px for display text — the tight tracking is what makes the headlines feel cinematic
- Use 10px radius for image/showcase cards and 7px radius for buttons — these are the only two radii that should appear in the main content flow
- Keep all borders at 1px #e5e7eb at very low opacity (10-20%) — borders should be felt, not seen
- Use Inter at weight 500 for all buttons, 700 for display, 400 for body — never mix more than two weights on a single screen

### Don't
- Never use a second chromatic color — the system is deliberately monochromatic with one blue accent; adding any other hue breaks the cinema-canvas concept
- Never apply drop shadows to UI components — shadows are reserved for image cards in the showcase grid only
- Never use #ffffff text for body copy — body text should be #999999 or lower contrast; white is reserved for headings, buttons, and high-emphasis labels
- Never center-align body paragraphs — only headlines, CTAs, and the hero text block are centered; body copy is left-aligned
- Never use border-radius values outside the defined scale (7px, 10px, 16px, 24px, 32px, 100px) — ad-hoc radii will break the system's geometric consistency
- Never place a colored background behind text blocks — the canvas must remain pure black; cards float on the void, they don't fill it
- Never use gradient backgrounds — the system is strictly flat; depth comes from the surface stack, not color transitions

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas | `#000000` | Full-bleed page background, hero sections, and between-section gutters — pure black absorbs all light so generated imagery and accent blue are the only luminous elements |
| 1 | Card | `#212121` | Primary elevated surface for workflow cards, product UI mockups, and content containers |
| 2 | Raised | `#292929` | Secondary buttons (ghost/outlined), nested cards, and interactive surfaces one step above Card |
| 3 | Floating | `#333333` | Tertiary buttons, highest elevation elements, and active/pressed state backgrounds |

## Elevation

- **Image card:** `rgba(0, 0, 0, 0.1) 0px 20px 25px -5px, rgba(0, 0, 0, 0.1) 0px 8px 10px -6px`

## Imagery

Imagery is the star of the system. The entire visual strategy revolves around AI-generated photographs and renders displayed in tightly-cropped rectangular cards within a grid. Images are full-color, high-contrast, and span the entire spectrum — portraits, landscapes, cinematic scenes, product shots, surreal compositions. They are presented without frames, borders, or labels in the showcase grid (two rows of borderless images on pure black), and with a subtle caption overlay (white title + gray description) in the workflow carousel. There is no lifestyle photography, no stock imagery of people using software, no office shots — every image is generated content demonstrating the product's output. The imagery-to-text ratio is extremely high: images occupy roughly 70% of vertical space below the fold, while text serves only as thin captions and section headers.

## Layout

Full-bleed dark canvas with a centered max-width content area of ~1280px. The hero is a two-column layout: left side has the announcement bar + two-tone headline, right side has body text + dual CTAs (primary blue + secondary dark). Below the hero, the showcase grid is a two-row, seven-column grid of borderless image cards spanning the full content width. Subsequent sections use a single-column layout with a left-aligned two-tone section header and a horizontally-scrolling card carousel (6+ cards visible, with left/right arrow controls and a 'See more' button). Section gaps are generous (96px) to let the dark space breathe. Navigation is a minimal top bar with no background fill, floating on the black canvas. The product UI mockup section uses a centered single-column layout with the mockup panel occupying ~80% of the content width.

## Agent Prompt Guide

**Quick Color Reference**
- text (primary): #ffffff
- text (secondary/muted): #999999
- background (canvas): #000000
- border: #e5e7eb
- accent: #0075ff
- primary action: #0075ff (filled action)

**3-5 Example Component Prompts**

1. **Hero headline block**: Render a two-line headline on #000000 canvas. Line 1: 'Smart storytelling' at 52px Inter weight 700, #ffffff, letter-spacing -3.2px, line-height 1.15. Line 2: 'For every creative' at 52px Inter weight 700, #999999, letter-spacing -3.2px, line-height 1.15. No margin between lines. The gray echo on line 2 is the signature device.

2. **Primary CTA button**: Create a filled button with #0075ff background, #ffffff text at 14px Inter weight 500, 7px border-radius, 8px vertical padding, 16px horizontal padding. Text reads 'Start for free'. No border, no shadow. This is the only filled chromatic element in the system.

3. **New badge**: Create an inline badge with #0075ff background, #ffffff text 'New' at 12px Inter weight 500, 7px border-radius, 4px vertical padding, 8px horizontal padding. Sits inline with body text: 'Seedance 2.0 on all paid plans' at 12px Inter weight 400 #999999.

4. **Image showcase card**: Render a rectangular card with 10px border-radius, no border, no background — the AI-generated image fills the entire card area. Place on #000000 canvas. Optional soft shadow: rgba(0,0,0,0.1) 0px 20px 25px -5px, rgba(0,0,0,0.1) 0px 8px 10px -6px.

5. **Workflow card with caption**: Create a card with #212121 background, 10px border-radius, 1px #e5e7eb border at 15% opacity, 12px internal padding. Top 60% is an image at 10px top-corner radius. Below: title 'Time-freeze effect' at 14px Inter weight 600 #ffffff, description at 12px Inter weight 400 #999999.

## Two-Tone Headline System

Every major section uses a two-line headline device: Line 1 is the statement in #ffffff, Line 2 is the context in #999999. Both lines are the same size and weight (52px/700 for hero, 40px/700 for sections). The gray line should always be a descriptor or elaboration, never a repeat of line 1. This pattern is the visual signature of the brand and should be applied consistently across every section header, not just the hero.

## Surface Elevation Strategy

The system uses four surface levels with precise color steps: #000000 (canvas) → #212121 (card) → #292929 (raised) → #333333 (floating). Each step is +17 luminance units — enough to create clear hierarchy without feeling like a mobile app. Cards on the canvas use #212121, buttons on cards use #292929, and highest-elevation elements (modals, popovers) use #333333. Never use #1a1a1a, #222222, or any in-between value — stick to the four-step scale.

## Similar Brands

- **Runway ML** — Same dark-canvas + single-accent approach for AI creative tools, with a showcase grid of generated imagery as the primary content
- **Midjourney** — Near-identical monochrome dark theme with white text and a single blue accent, built around a gallery of AI-generated images
- **Pika** — Same dark cinema aesthetic with compact Inter typography, two-tone headlines, and horizontal-scrolling content carousels
- **ElevenLabs** — Dark-mode AI product site with pure black canvas, minimal accent color, and tight Inter type at display sizes
- **Stability AI** — Dark AI creative platform with showcase grid layout and a single chromatic accent reserved for primary actions only

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-pure-black: #000000;
  --color-surface-one: #212121;
  --color-surface-two: #292929;
  --color-surface-three: #333333;
  --color-paper-white: #ffffff;
  --color-fog: #e5e7eb;
  --color-mist: #f5f5f5;
  --color-mid-gray: #999999;
  --color-steel: #737373;
  --color-graphite: #666666;
  --color-slate: #525252;
  --color-charcoal: #404040;
  --color-electric-blue: #0075ff;

  /* Typography — Font Families */
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.4;
  --tracking-caption: -0.1px;
  --text-body: 14px;
  --leading-body: 1.5;
  --tracking-body: -0.14px;
  --text-body-lg: 18px;
  --leading-body-lg: 1.4;
  --tracking-body-lg: -0.4px;
  --text-heading-sm: 20px;
  --leading-heading-sm: 1.33;
  --tracking-heading-sm: -0.44px;
  --text-heading: 40px;
  --leading-heading: 1.15;
  --tracking-heading: -1.9px;
  --text-display: 52px;
  --leading-display: 1.15;
  --tracking-display: -3.2px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

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
  --spacing-60: 60px;
  --spacing-72: 72px;
  --spacing-80: 80px;
  --spacing-96: 96px;
  --spacing-100: 100px;
  --spacing-140: 140px;
  --spacing-180: 180px;

  /* Layout */
  --page-max-width: 1280px;
  --section-gap: 96px;
  --card-padding: 12px;
  --element-gap: 8px;

  /* Border Radius */
  --radius-md: 7px;
  --radius-lg: 10px;
  --radius-2xl: 16px;
  --radius-3xl: 24px;
  --radius-3xl-2: 32px;
  --radius-full: 100px;

  /* Named Radii */
  --radius-tags: 100px;
  --radius-cards: 10px;
  --radius-pills: 100px;
  --radius-badges: 7px;
  --radius-modals: 24px;
  --radius-buttons: 7px;
  --radius-large-cards: 16px;

  /* Shadows */
  --shadow-xl: rgba(0, 0, 0, 0.1) 0px 20px 25px -5px, rgba(0, 0, 0, 0.1) 0px 8px 10px -6px;

  /* Surfaces */
  --surface-canvas: #000000;
  --surface-card: #212121;
  --surface-raised: #292929;
  --surface-floating: #333333;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-pure-black: #000000;
  --color-surface-one: #212121;
  --color-surface-two: #292929;
  --color-surface-three: #333333;
  --color-paper-white: #ffffff;
  --color-fog: #e5e7eb;
  --color-mist: #f5f5f5;
  --color-mid-gray: #999999;
  --color-steel: #737373;
  --color-graphite: #666666;
  --color-slate: #525252;
  --color-charcoal: #404040;
  --color-electric-blue: #0075ff;

  /* Typography */
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.4;
  --tracking-caption: -0.1px;
  --text-body: 14px;
  --leading-body: 1.5;
  --tracking-body: -0.14px;
  --text-body-lg: 18px;
  --leading-body-lg: 1.4;
  --tracking-body-lg: -0.4px;
  --text-heading-sm: 20px;
  --leading-heading-sm: 1.33;
  --tracking-heading-sm: -0.44px;
  --text-heading: 40px;
  --leading-heading: 1.15;
  --tracking-heading: -1.9px;
  --text-display: 52px;
  --leading-display: 1.15;
  --tracking-display: -3.2px;

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
  --spacing-60: 60px;
  --spacing-72: 72px;
  --spacing-80: 80px;
  --spacing-96: 96px;
  --spacing-100: 100px;
  --spacing-140: 140px;
  --spacing-180: 180px;

  /* Border Radius */
  --radius-md: 7px;
  --radius-lg: 10px;
  --radius-2xl: 16px;
  --radius-3xl: 24px;
  --radius-3xl-2: 32px;
  --radius-full: 100px;

  /* Shadows */
  --shadow-xl: rgba(0, 0, 0, 0.1) 0px 20px 25px -5px, rgba(0, 0, 0, 0.1) 0px 8px 10px -6px;
}
```
