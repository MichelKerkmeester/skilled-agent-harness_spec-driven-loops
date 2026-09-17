# Promly — Style Reference
> Midnight pulse through violet glass — a youth sanctuary lit by neon accents on near-black surfaces, where rounded photo collages float like screensavers behind sharp confident type.

**Theme:** dark

Promly operates in a midnight-violet register: deep near-black canvas (#040723) bathed in purple gradient light, with a single cool blue action color that cuts through the darkness like a notification LED. The visual language is youth-documentary — rounded-corner photo collages of real teens dominate the right half of every hero, while confident Avenir type carries the narrative on the left. Components are soft and tactile: large corner radii (20–30px on imagery, 12px on controls), violet-tinted shadows, and pill buttons that feel like app controls rather than web CTAs. Color is restrained and functional — a vivid green accent appears only on links and highlight tags, purple lives on outlined actions, and the blue filled button is the single loudest element on each screen.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Void Indigo | `#040723` | `--color-void-indigo` | Page background, primary surface — near-black with a violet undertone that makes the whole canvas feel tinted rather than neutral |
| Abyss Plum | `#140f33` | `--color-abyss-plum` | Elevated card surface, shadow tone — a step lighter than Void Indigo, used to lift cards off the canvas with violet ambient |
| Onyx | `#000000` | `--color-onyx` | Deep contrast surface for cards, input fills, and the darkest band behind photo content |
| Glacier | `#e4ebf3` | `--color-glacier` | Off-white section backgrounds, light card surfaces — cool-tinted to harmonize with the violet system |
| Paper | `#ffffff` | `--color-paper` | Primary text on dark surfaces, button labels, image overlays — the dominant non-background color in the system |
| Smoke | `#999999` | `--color-smoke` | Secondary/muted body text, disabled labels |
| Ash | `#808080` | `--color-ash` | Tertiary text and subtle borders on light sections |
| Graphite | `#333333` | `--color-graphite` | Image borders, input strokes, secondary link text on light surfaces |
| Charcoal | `#222222` | `--color-charcoal` | Button borders on light surfaces, heavy text emphasis |
| Cinder | `#cccccc` | `--color-cinder` | Input field borders, form dividers |
| Pulse Blue | `#3898ec` | `--color-pulse-blue` | Primary filled action background (CTA buttons, active nav) — the only chromatic fill in the system, acts as the single notification LED against the dark canvas |
| Iris | `#755eff` | `--color-iris` | Outlined action border, secondary accent — the violet identity color applied to ghost buttons and decorative strokes |
| Lavender Lightning | `#aa57ff` | `--color-lavender-lightning` | Outlined action border, gradient start — lighter violet for tertiary buttons and gradient origins |
| Neon Sprout | `#0be014` | `--color-neon-sprout` | Link borders, icon borders, active state highlights — vivid green used sparingly as functional punctuation on links and tags |
| Dusk Fade | `#47246a` | `--color-dusk-fade` | Gradient mid-stop — deep violet that bridges bright lavender to black in hero gradient washes |

## Tokens — Typography

### Avenir — Primary typeface across all contexts — headings, body, navigation, buttons, cards. Light 300 for large display headings creates a soft documentary feel; bold 700 for buttons and tag labels; regular 400 for body and supporting text. · `--font-avenir`
- **Substitute:** Nunito Sans, Inter, DM Sans
- **Weights:** 300, 400, 700
- **Sizes:** 14px, 16px, 18px, 20px, 25px, 28px, 35px, 45px, 59px, 60px, 64px
- **Line height:** 1.07, 1.11, 1.17, 1.25, 1.36, 1.39, 1.40, 1.43, 1.50, 1.57, 1.69
- **Letter spacing:** -0.067em at 59-64px display, -0.051em at 35-45px headings, -0.047em at 25-28px subheadings, -0.031em at 20px, normal to +0.018em at 14-18px body and captions
- **Role:** Primary typeface across all contexts — headings, body, navigation, buttons, cards. Light 300 for large display headings creates a soft documentary feel; bold 700 for buttons and tag labels; regular 400 for body and supporting text.

### Poppins — Rare single-use bold label — appears on one decorative badge/button context, providing a geometric contrast to Avenir's humanist curves · `--font-poppins`
- **Substitute:** Poppins
- **Weights:** 700
- **Sizes:** 18px
- **Line height:** 1.50
- **Role:** Rare single-use bold label — appears on one decorative badge/button context, providing a geometric contrast to Avenir's humanist curves

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 14px | 1.25 | 0.25px | `--text-caption` |
| body-sm | 16px | 1.5 | — | `--text-body-sm` |
| body | 18px | 1.69 | -0.9px | `--text-body` |
| subheading | 20px | 1.43 | -0.94px | `--text-subheading` |
| heading-sm | 25px | 1.4 | -0.78px | `--text-heading-sm` |
| heading | 35px | 1.17 | -1.79px | `--text-heading` |
| heading-lg | 45px | 1.11 | -2.3px | `--text-heading-lg` |
| display | 60px | 1.07 | -4.02px | `--text-display` |

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
| 36 | 36px | `--spacing-36` |
| 60 | 60px | `--spacing-60` |
| 80 | 80px | `--spacing-80` |
| 88 | 88px | `--spacing-88` |
| 100 | 100px | `--spacing-100` |
| 160 | 160px | `--spacing-160` |

### Border Radius

| Element | Value |
|---------|-------|
| nav | 12px |
| cards | 25px |
| images | 20px |
| inputs | 12px |
| buttons | 12px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| xl | `rgba(102, 77, 255, 0.2) 0px 4px 100px 0px` | `--shadow-xl` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 20px
- **Element gap:** 20px

## Components

### Primary Filled Button
**Role:** Main conversion action — donations, sign-ups, primary CTAs

Filled rectangle, 12px radius, 20px vertical × 24px horizontal padding, Pulse Blue (#3898ec) background, Paper (#ffffff) text at 18px Avenir weight 700. Letter-spacing slightly positive. No border. Hovers deepen or shift to Iris (#755eff) for branded contexts.

### Outlined Action Button
**Role:** Secondary conversion — ghost CTAs on dark and light sections

Transparent background, 1px Iris (#755eff) border, 12px radius, 18-20px padding, Iris text. Used for 'Join Our GenZ Team', 'Learn More' style actions where the primary fill would feel too heavy.

### Navigation Pill Button
**Role:** Header CTA — the persistent 'Donate' action in the top nav

Filled Pill Blue variant of the primary button, slightly smaller (18px text), sits in the top-right of the dark navigation bar with full vertical centering.

### Navigation Bar
**Role:** Sticky site header with brand, dropdown nav, and CTA

Full-width dark bar on Void Indigo (#040723) with no visible border. Logo (Promly wordmark with globe icon) left-aligned, nav links with caret indicators centered, CTA button right. Dropdown menus open on hover. Nav text at 18px Avenir weight 400, Paper color.

### Hero Section
**Role:** Above-the-fold headline + photo collage

Full-bleed Hero Dusk gradient (linear-gradient(216deg, #a755fb 20%, #47246a 37%, #000000 90%)), 80px+ vertical padding, left-aligned headline at 60px display weight 300, subhead at 18-20px, filled CTA. Right half: photo collage of 8-10 rounded images in a masonry-like grid, each image 20px radius with a subtle 1px white border.

### Photo Collage Grid
**Role:** Decorative youth imagery on hero and section right sides

Asymmetric grid of 8-12 documentary-style photos, each rounded to 20px (or 30px for larger featured crops). Images are real, candid, colorful, with no overlay treatment. Arranged in offset rows creating a scrapbook rhythm. 1px white border on each image creates separation against dark backgrounds.

### Gradient Feature Card
**Role:** Highlighted content section with light-violet background

Full-width card on Void Indigo canvas, internal padding 20-24px, background Lavender Wash gradient (linear-gradient(135deg, #9e58fe 39%, #ffffff)). 25px corner radius. Contains left-aligned heading (35px Avenir 300), body text in Graphite, row of outlined action buttons, and right-side photo collage.

### App Mockup Display
**Role:** Product visual showing the Promly app interface

Two phone mockups side by side (or overlapping) on a dark band, showing app screens with internal UI. Phone frames have rounded corners matching device bezel. App interior uses pink, green, and blue chat-style cards against dark phone backgrounds — internal contrast to the page's violet system.

### Credential/Award Row
**Role:** Social proof — awards, recognitions, media features

Horizontal row of circular or shield-shaped badge logos at section bottom. Gold, blue, and white badges on dark background. No text labels needed — the badges carry the credibility visually. Centered alignment.

### Achievement List
**Role:** Founder/organization accolades in text form

Stacked text lines on dark canvas, 18-20px Avenir weight 400, Paper color, 12px row-gap. Items read as a simple bulleted-free list with generous breathing room. Used below the app mockup section.

### Event Feature Section
**Role:** Immersive content section — concerts, festivals, events

Full-bleed dark section with a half-width atmospheric photo (concert crowd, warm-lit) on the left, bold headline ('Join us at the Changemakers Music Festival') right-aligned at 45-60px Avenir 300. Photo bleeds to the left edge, text is vertically centered.

### Footer
**Role:** Site footer (implied, not fully visible in screenshots)

Dark canvas matching Void Indigo, 20px padding, Avenir 14-16px body text in Smoke, links in Paper, bordered by a 1px subtle divider line.

### Input Field
**Role:** Form inputs for newsletter, contact, or app signup

Dark fill (Onyx #000000), 1px Cinder (#cccccc) border, 12px radius, 20px vertical padding, Paper text. Placeholder in Smoke.

### Highlight Link
**Role:** In-body links that need to stand out on dark backgrounds

Paper text with 1-2px Neon Sprout (#0be014) bottom border, 8px offset from text. Used for inline references and tag links that need to read as interactive without being a full button.

## Do's and Don'ts

### Do
- Use the Hero Dusk gradient (linear-gradient(216deg, #a755fb 20%, #47246a 37%, #000000 90%)) as the only hero background — never substitute a flat color or a different gradient angle.
- Apply 20px border-radius to all documentary photos and 30px to larger featured crops; 12px to all buttons and inputs; 25px to section cards.
- Set headlines at 60px Avenir weight 300 with -4px letter-spacing — the light weight is the signature, not bold.
- Use Pulse Blue (#3898ec) filled buttons for the single primary action per screen; Iris (#755eff) outlined buttons for secondary actions.
- Anchor each hero with a right-side photo collage of 8-10 rounded images with 1px white borders, arranged in offset rows.
- Let the violet-tinted shadow (rgba(102, 77, 255, 0.2) 0px 4px 100px) be the only elevation effect on cards — no gray drop shadows.
- Set section gap to 80px and card padding to 20px as the structural rhythm baseline.

### Don't
- Do not use bold (700) or extra-bold weights for display headings — weight 300 is the system's identity choice; bold headlines break the whisper-tone.
- Do not introduce new colors for action buttons — the system has exactly one filled chromatic action (Pulse Blue) and outlined actions must use Iris, Lavender Lightning, or Neon Sprout.
- Do not apply flat black (#000000) as the page background — Void Indigo (#040723) is the system canvas; pure black is reserved for deepest card surfaces only.
- Do not use sharp corners (0px radius) on any image or card — every visual element must carry at least 8px radius, most 12-20px.
- Do not place green on filled buttons or backgrounds — Neon Sprout (#0be014) is link-border and icon-border only.
- Do not stack shadows or use gray-toned drop shadows — the single violet glow shadow is the only allowed elevation effect.
- Do not alternate text alignment arbitrarily — heroes are consistently left-aligned text with right-side photo collage; do not center-align long-form content.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Void Indigo | `#040723` | Page canvas — the default dark surface every section sits on |
| 1 | Onyx | `#000000` | Deep card/band background for darkest content blocks |
| 2 | Abyss Plum | `#140f33` | Elevated card with violet ambient — cards float above the canvas with this tint |
| 3 | Glacier | `#e4ebf3` | Light-mode card surface for sections that break out of the dark theme |
| 4 | Paper | `#ffffff` | Highest elevation — buttons, badges, modal surfaces |

## Elevation

- **Elevated Card:** `0px 4px 100px 0px rgba(102, 77, 255, 0.2)`

## Imagery

The visual language is documentary youth photography — real teens in candid, naturally-lit settings (classrooms, streets, events, backstage). Photos are colorful, slightly saturated, and never staged-corporate. Treatment: always rounded (20-30px), often with 1px white borders that make them feel like printed polaroids on the dark canvas. Photos are arranged in offset masonry collages, never a single hero image, creating a scrapbook-of-teenage-life rhythm. Role: emotional storytelling and social proof rather than product explanation. Density: image-heavy — photo collages occupy 40-50% of hero real estate, and almost every section includes a right-side or full-bleed photographic element. No illustrations, no abstract graphics, no 3D renders.

## Layout

Max-width 1200px centered content, but heroes are full-bleed edge-to-edge. The page rhythm is alternating dark bands (Void Indigo or Onyx) with occasional light breakouts (Glacier or Lavender Wash gradient card). Each major section follows a left-text + right-photo-collage split: headline and CTA on the left (40-45% width), rounded photo grid on the right (55-60% width). Vertical spacing is generous (80px section gaps) creating a cinematic scroll rhythm. Navigation is a sticky dark top bar. No sidebar, no mega-menu visible — the dropdowns in the nav are simple hover-reveals. Grid usage is limited to the photo collages; content text blocks are single-column stacks. The overall density is spacious, never information-dense.

## Agent Prompt Guide

Quick Color Reference:
- Text (primary on dark): #ffffff
- Background (page canvas): #040723
- Border (subtle): #808080 / #333333
- Accent (links, tags): #0be014
- Brand violet (outlined actions): #755eff
- primary action: #3898ec (filled action)

Example Component Prompts:

1. Create a Primary Action Button: #3898ec background, #222222 text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.

2. Create a feature highlight card: full-width card on Void Indigo (#040723) canvas, internal background Lavender Wash gradient (linear-gradient(135deg, #9e58fe 39%, #ffffff)), 25px corner radius, 24px padding. Heading at 35px Avenir weight 300, #000000. Body text at 18px Avenir weight 400, #333333. Row of three outlined buttons: transparent background, 1px #755eff border, 12px radius, #755eff text at 18px Avenir weight 700. Right side: photo collage of 6-8 rounded images, 20px radius.


4. Create an event feature section: full-bleed dark Onyx (#000000) background. Left half: atmospheric concert crowd photo (warm-lit, full saturation) bleeding to the left edge, 20px radius on the right edge only. Right half: headline 'Join us at the Changemakers Music Festival' at 60px Avenir weight 300, #ffffff, vertically centered. Below headline: two action buttons (one filled Pulse Blue, one outlined Iris #755eff).

5. Create a credential row: full-width dark band on Void Indigo (#040723), centered horizontal row of 5-6 circular award/badge logos, each ~80px diameter, gold and white badges, 40px gap between badges. No text labels — the badges carry the credibility.

## Similar Brands

- **Bumble** — Same dark-violet canvas with a single accent color and rounded photo collages of real people dominating hero compositions
- **Headspace** — Same generous 80px section rhythm, soft rounded card surfaces, and documentary-style photography replacing stock illustration
- **Calm App** — Same dark-mode-first layout with violet-tinted ambient lighting and large light-weight display headlines that prioritize atmosphere over density
- **Afterpay** — Same bold gradient hero (violet-to-black), pill-shaped primary CTAs, and youth-energy photo treatment on marketing pages
- **Geneva (community app)** — Same near-black indigo canvas, oversized rounded photo collages, and 12px-radius pill buttons with single-color action hierarchy

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-void-indigo: #040723;
  --color-abyss-plum: #140f33;
  --color-onyx: #000000;
  --color-glacier: #e4ebf3;
  --color-paper: #ffffff;
  --color-smoke: #999999;
  --color-ash: #808080;
  --color-graphite: #333333;
  --color-charcoal: #222222;
  --color-cinder: #cccccc;
  --color-pulse-blue: #3898ec;
  --color-iris: #755eff;
  --color-lavender-lightning: #aa57ff;
  --color-neon-sprout: #0be014;
  --color-dusk-fade: #47246a;

  /* Typography — Font Families */
  --font-avenir: 'Avenir', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-poppins: 'Poppins', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.25;
  --tracking-caption: 0.25px;
  --text-body-sm: 16px;
  --leading-body-sm: 1.5;
  --text-body: 18px;
  --leading-body: 1.69;
  --tracking-body: -0.9px;
  --text-subheading: 20px;
  --leading-subheading: 1.43;
  --tracking-subheading: -0.94px;
  --text-heading-sm: 25px;
  --leading-heading-sm: 1.4;
  --tracking-heading-sm: -0.78px;
  --text-heading: 35px;
  --leading-heading: 1.17;
  --tracking-heading: -1.79px;
  --text-heading-lg: 45px;
  --leading-heading-lg: 1.11;
  --tracking-heading-lg: -2.3px;
  --text-display: 60px;
  --leading-display: 1.07;
  --tracking-display: -4.02px;

  /* Typography — Weights */
  --font-weight-light: 300;
  --font-weight-regular: 400;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-36: 36px;
  --spacing-60: 60px;
  --spacing-80: 80px;
  --spacing-88: 88px;
  --spacing-100: 100px;
  --spacing-160: 160px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 20px;
  --element-gap: 20px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 20px;
  --radius-3xl: 25px;
  --radius-3xl-2: 30px;

  /* Named Radii */
  --radius-nav: 12px;
  --radius-cards: 25px;
  --radius-images: 20px;
  --radius-inputs: 12px;
  --radius-buttons: 12px;

  /* Shadows */
  --shadow-xl: rgba(102, 77, 255, 0.2) 0px 4px 100px 0px;

  /* Surfaces */
  --surface-void-indigo: #040723;
  --surface-onyx: #000000;
  --surface-abyss-plum: #140f33;
  --surface-glacier: #e4ebf3;
  --surface-paper: #ffffff;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-void-indigo: #040723;
  --color-abyss-plum: #140f33;
  --color-onyx: #000000;
  --color-glacier: #e4ebf3;
  --color-paper: #ffffff;
  --color-smoke: #999999;
  --color-ash: #808080;
  --color-graphite: #333333;
  --color-charcoal: #222222;
  --color-cinder: #cccccc;
  --color-pulse-blue: #3898ec;
  --color-iris: #755eff;
  --color-lavender-lightning: #aa57ff;
  --color-neon-sprout: #0be014;
  --color-dusk-fade: #47246a;

  /* Typography */
  --font-avenir: 'Avenir', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-poppins: 'Poppins', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.25;
  --tracking-caption: 0.25px;
  --text-body-sm: 16px;
  --leading-body-sm: 1.5;
  --text-body: 18px;
  --leading-body: 1.69;
  --tracking-body: -0.9px;
  --text-subheading: 20px;
  --leading-subheading: 1.43;
  --tracking-subheading: -0.94px;
  --text-heading-sm: 25px;
  --leading-heading-sm: 1.4;
  --tracking-heading-sm: -0.78px;
  --text-heading: 35px;
  --leading-heading: 1.17;
  --tracking-heading: -1.79px;
  --text-heading-lg: 45px;
  --leading-heading-lg: 1.11;
  --tracking-heading-lg: -2.3px;
  --text-display: 60px;
  --leading-display: 1.07;
  --tracking-display: -4.02px;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-36: 36px;
  --spacing-60: 60px;
  --spacing-80: 80px;
  --spacing-88: 88px;
  --spacing-100: 100px;
  --spacing-160: 160px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 20px;
  --radius-3xl: 25px;
  --radius-3xl-2: 30px;

  /* Shadows */
  --shadow-xl: rgba(102, 77, 255, 0.2) 0px 4px 100px 0px;
}
```
