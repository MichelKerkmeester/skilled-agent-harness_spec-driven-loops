# New Genre — Style Reference
> Cinematic horizon at golden hour — a single gradient arc from charred umber through steel twilight to warm parchment, against which condensed serif headlines carve like editorial mastheads.

**Theme:** light

New Genre operates in a cinematic dawn-to-dusk register: near-white surfaces, a near-black text color, and one monumental gradient that arcs from charred brown through steel blue to warm cream — that gradient IS the brand. Typography is a two-voice conversation between a condensed display serif (Serrif Condensed) that fills the top of every page with editorial gravity, and a low-weight geometric sans (Saans Variable) that handles everything else with quiet precision. The system is deliberately monochromatic at the interface level — no accent buttons, no chromatic badges — letting photographic work, gradient washes, and typographic contrast carry all the emotion. Components are architectural: pill-shaped controls at 50-90px radius, 16px-radius cards, hairline dividers, and barely-there elevation. Space is compact and functional, never decorative.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Parchment Canvas | `#ffffff` | `--color-parchment-canvas` | Page backgrounds, card surfaces, inverse text on dark fills |
| Onyx | `#0c1018` | `--color-onyx` | Primary body text, headings, input text, icon fills — blue-shifted near-black replaces pure #000 across the interface |
| Pure Black | `#000000` | `--color-pure-black` | Footer text, heavy display accents, icon strokes — reserved for maximum weight moments |
| Charred Umber | `#1e1310` | `--color-charred-umber` | Footer surface, dark contrast bands, gradient origin stop — warm dark anchors the bottom of the spectrum |
| Slate Veil | `#6d7074` | `--color-slate-veil` | Secondary headings, subdued labels, inactive nav — desaturated mid-gray for quiet hierarchy |
| Ash Mist | `#9e9fa3` | `--color-ash-mist` | Supporting neutral for secondary UI, dividers, and muted labels. |
| Dawn Arc | `linear-gradient(rgb(40, 14, 1) 0%, rgb(24, 38, 68) 15.2608%, rgb(90, 118, 159) 30.284%, rgb(135, 161, 196) 43.3787%, rgb(193, 211, 230) 58.8313%, rgb(254, 249, 225) 79.7139%, rgb(247, 243, 240) 100%)` | `--color-dawn-arc` | Brand signature — represents the iconic hero gradient (charred umber → steel twilight → warm parchment); used in gradient washes, atmospheric overlays, and the gradient-text reveal effect on display headlines |
| Ember Radiance | `radial-gradient(75% 300% at 109.6% 147.1%, rgb(255, 230, 0) 0%, rgb(237, 148, 84) 29.5837%, rgba(153, 161, 175, 0.06) 100%)` | `--color-ember-radiance` | Accent warmth for radial gradient highlights and hover-state glows — the golden-hour counterpoint to the cool steel-blue arc |

## Tokens — Typography

### sans-serif — sans-serif — detected in extracted data but not described by AI · `--font-sans-serif`
- **Weights:** 400
- **Sizes:** 12px
- **Line height:** 1.2
- **Role:** sans-serif — detected in extracted data but not described by AI

### Serrif Condensed — Display headlines — only used at 64-72px for hero and section-opening statements. Condensed letterforms with negative tracking create editorial masthead weight without boldness; the 1.05 line-height lets lines stack tightly into monumental blocks. This font carries the brand's voice at maximum volume. · `--font-serrif-condensed`
- **Substitute:** Fraunces (condensed variant) or Playfair Display SC
- **Weights:** 400
- **Sizes:** 64px, 72px
- **Line height:** 1.05
- **Letter spacing:** -0.02em
- **Role:** Display headlines — only used at 64-72px for hero and section-opening statements. Condensed letterforms with negative tracking create editorial masthead weight without boldness; the 1.05 line-height lets lines stack tightly into monumental blocks. This font carries the brand's voice at maximum volume.

### Saans Variable — Body, navigation, buttons, inputs, subheadings — the workhorse. Weight 300 whispers, 400 speaks, 500-570 emphasi zes. Variable axis allows fluid weight shifts. Tight -0.01em tracking across all sizes; line-height tightens to 1.0 for UI labels and opens to 1.4 for paragraph body. · `--font-saans-variable`
- **Substitute:** Söhne or General Sans
- **Weights:** 300, 380, 400, 500, 570
- **Sizes:** 12px, 14px, 16px, 20px, 24px, 32px
- **Line height:** 1.00–1.40
- **Letter spacing:** -0.01em
- **Role:** Body, navigation, buttons, inputs, subheadings — the workhorse. Weight 300 whispers, 400 speaks, 500-570 emphasi zes. Variable axis allows fluid weight shifts. Tight -0.01em tracking across all sizes; line-height tightens to 1.0 for UI labels and opens to 1.4 for paragraph body.

### Inter — Inter — detected in extracted data but not described by AI · `--font-inter`
- **Weights:** 400
- **Sizes:** 12px
- **Line height:** 1.2
- **Role:** Inter — detected in extracted data but not described by AI

### Saans Medium — Saans Medium — detected in extracted data but not described by AI · `--font-saans-medium`
- **Weights:** 400, 570
- **Sizes:** 16px
- **Line height:** 1
- **Letter spacing:** -0.01
- **Role:** Saans Medium — detected in extracted data but not described by AI

### Saans Regular — Saans Regular — detected in extracted data but not described by AI · `--font-saans-regular`
- **Weights:** 380
- **Sizes:** 16px
- **Line height:** 1.3
- **Letter spacing:** -0.01
- **Role:** Saans Regular — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.2 | -0.12px | `--text-caption` |
| body-sm | 14px | 1.4 | -0.14px | `--text-body-sm` |
| body | 16px | 1.3 | -0.16px | `--text-body` |
| subheading | 20px | 1.2 | -0.2px | `--text-subheading` |
| heading-sm | 24px | 1.15 | -0.24px | `--text-heading-sm` |
| heading | 32px | 1.1 | -0.32px | `--text-heading` |
| display | 64px | 1.05 | -1.28px | `--text-display` |
| display-lg | 72px | 1.05 | -1.44px | `--text-display-lg` |

## Tokens — Spacing & Shapes

**Density:** compact

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 6 | 6px | `--spacing-6` |
| 8 | 8px | `--spacing-8` |
| 10 | 10px | `--spacing-10` |
| 12 | 12px | `--spacing-12` |
| 16 | 16px | `--spacing-16` |
| 20 | 20px | `--spacing-20` |
| 24 | 24px | `--spacing-24` |
| 26 | 26px | `--spacing-26` |
| 32 | 32px | `--spacing-32` |
| 48 | 48px | `--spacing-48` |
| 52 | 52px | `--spacing-52` |
| 56 | 56px | `--spacing-56` |
| 64 | 64px | `--spacing-64` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 16px |
| inputs | 50px |
| buttons | 50px |
| nav-links | 8px |
| buttons-pill | 90px |

### Layout

- **Page max-width:** 1400px
- **Section gap:** 64-96px
- **Card padding:** 32px
- **Element gap:** 10-16px

## Components

### Hero Gradient Banner
**Role:** Full-bleed atmospheric section

Full-viewport section using the dawn arc linear gradient (charred umber at 0% through steel twilight at 30-58% to warm cream at 80-100%). Contains a Serrif Condensed display headline at 64-72px, color Onyx (#0c1018), positioned left-aligned with generous left margin. Gradient-text effect applied to the final phrase so it fades into the background.

### Gradient-Text Reveal
**Role:** Display headline accent

Serrif Condensed at 64-72px where a trailing phrase (e.g. 'systems,') uses a CSS mask or color fade to dissolve from #0c1018 into the gradient background, creating a 'horizon line' effect where text becomes atmosphere.

### Pill Action Button
**Role:** Primary navigation/action trigger

50-90px border-radius, transparent or near-white background, Saans Variable 16px weight 400-500, Onyx (#0c1018) text, 12-16px horizontal padding, 6-10px vertical padding. Ghost style — no fill, no border. Example: 'Our work' in bottom-left of hero.

### Top Navigation Bar
**Role:** Primary site navigation

Minimal horizontal nav. Logo 'NEW GENRE' left in Saans Variable 14-16px weight 500 uppercase, letter-spacing 0 or slight positive. Nav items (Work, Approach, Services, News, About, Join, Contact) in Saans 14-16px weight 400, #0c1018, with a thin horizontal rule separating 'About' and 'Join' to signal a functional break. No background, no border-bottom — floats on the gradient.

### Awwwards Side Badge
**Role:** Third-party accolade display

Vertically rotated fixed-position tab on right edge. Black (#0c1018) background, white text in Saans Variable 12px, showing 'W.' and 'Site of the Day'. 8px radius on the visible edge.

### Process Card
**Role:** Three-column service/philosophy card

16px border-radius, near-white surface (#f5f5f5 or canvas with subtle border). 32px padding. Heading 'Think' / 'Create' / 'Build' in Saans Variable 24px weight 500 Onyx. Body description in Saans 16px weight 400 #6d7074. Lower portion filled with a full-bleed photograph (botanical/flower imagery) that bleeds to the card edges, creating a visual cap.

### Text Input
**Role:** Form field

50px border-radius (pill shape), Saans Medium 16px weight 400, transparent or white background, Onyx text, subtle border in #9e9fa3 at 1px. No visible label — placeholder-driven.

### Cookie Consent Dialog
**Role:** Bottom-right compliance notice

White surface, 8-16px radius, fixed bottom-right. Body text in Saans 12-14px weight 400 #0c1018. 'Okay' button: ghost style with no fill, 50px radius, Saans 14px weight 500 Onyx text.

### Footer Dark Band
**Role:** Site footer

Charred Umber (#1e1310) background, white text. Likely contains navigation, legal, and contact info in Saans Variable 12-16px. The footer inherits the darkest stop of the hero gradient, creating a bookend effect with the page opening.

## Do's and Don'ts

### Do
- Use the dawn arc gradient (#1e1310 → #182644 → #5a769f → #87a1c4 → #c1d3e6 → #fef9e1 → #f7f3f0) as a full-bleed atmospheric wash for hero and transition sections — never as a small element background.
- Set all display headlines in Serrif Condensed at 64-72px weight 400, line-height 1.05, letter-spacing -0.02em; the condensed forms and tight tracking are the signature.
- Use Onyx (#0c1018) for all primary text rather than pure #000000 — the blue undertone keeps the palette coherent with the gradient's steel-blue midsection.
- Apply the gradient-text dissolve effect on the final 20-40% of display headlines so text visually transitions into the background gradient.
- Use 50-90px border-radius for all interactive elements (buttons, inputs) to create pill shapes; 16px radius for cards; 8px for small UI elements.
- Maintain -0.01em letter-spacing on all Saans Variable text regardless of size — the slight tightening is part of the geometric precision.
- Keep the interface monochromatic; let photographic content, the gradient, and typographic contrast carry all visual emotion.

### Don't
- Never introduce chromatic accent colors (no red, green, blue, or purple for buttons, badges, or tags) — the system is deliberately achromatic at the UI layer.
- Never use Serrif Condensed below 48px — the condensed display forms need scale to read as editorial type; small sizes collapse into illegibility.
- Never use bold weights (600-700) in Saans Variable — the system relies on 300-500; authority comes from size and spacing, not weight.
- Never apply drop shadows or box-shadows to cards or buttons — elevation is expressed through the gradient and surface lightness, not shadows.
- Never use pure black (#000000) for body text — always #0c1018; reserve #000000 for the footer text and maximum-contrast icon strokes.
- Never use border-radius below 8px on any element — flat 0px corners conflict with the pill-shaped control language.
- Never use line-height above 1.4 or below 1.0 in Saans Variable — the 1.0 ceiling creates compact UI labels, the 1.4 floor handles body copy; outside this range the geometric precision breaks.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas | `#ffffff` | Default page background for content sections |
| 1 | Gradient Atmosphere | `#7ba1c4` | Full-bleed hero and transition sections — the dawn arc gradient creates spatial drama without separate surface treatments |
| 2 | Card Surface | `#f5f5f5` | Process and content cards — whisper-light off-white that recedes against the canvas |
| 3 | Dark Ground | `#1e1310` | Footer and dark contrast bands — the gradient's terminal stop becomes a solid surface |

## Imagery

Imagery strategy is photography-first, always full-bleed within card boundaries with no internal padding or framing. Subject matter is botanical and organic — flower buds, stems, petals in their life-cycle stages (closed bud, opening bloom, full flower), evoking growth, transformation, and emergence. Photographs are natural-light, warm-toned, with deep shadow detail rather than high-key or studio-lit. Treatment is raw and unfiltered — no duotone, no color grading overlay, no masking effects. Photography occupies the lower 50-60% of each process card, functioning as a visual cap rather than decorative ornament. No illustration, no abstract graphics, no product screenshots visible — the studio trusts photography to carry the brand's emotional weight while typography and gradient handle atmosphere.

## Layout

Full-bleed page model with no max-width constraint on hero and transition sections (gradient spans edge-to-edge). Content sections use a max-width of approximately 1400px centered. Hero pattern: full-viewport gradient with left-aligned monumental serif headline occupying the upper-left quadrant, leaving vast negative space below. Section rhythm is dramatic — a dark gradient hero flows directly into a light gradient continuation, which transitions to a white content section, creating a dawn-to-daytime arc. Content sections use a 3-column card grid for process/philosophy blocks, with cards arranged horizontally and equal-height. Navigation is a minimal top bar with no background, floating directly on the gradient. A vertically-oriented accolade badge pins to the right edge. Vertical spacing is generous between major sections (64-96px) but compact within components (10-16px gaps). The overall grid tendency is 12-column with generous gutters, and asymmetric left-aligned content placement rather than centered stacks.

## Agent Prompt Guide

**Quick Color Reference**
- text: #0c1018 (Onyx)
- background: #ffffff (Parchment Canvas)
- border / muted: #9e9fa3 (Ash Mist)
- secondary text: #6d7074 (Slate Veil)
- dark surface: #1e1310 (Charred Umber)
- brand gradient: linear-gradient from #1e1310 through #5a769f to #fef9e1
- primary action: no distinct CTA color

**3-5 Example Component Prompts**

1. **Hero Gradient Section**: Full-bleed background using the dawn arc gradient (linear-gradient from #1e1310 at 0% through #182644 at 15%, #5a769f at 30%, #87a1c4 at 43%, #c1d3e6 at 59%, #fef9e1 at 80% to #f7f3f0 at 100%). Headline in Serrif Condensed 72px weight 400, color #0c1018, line-height 1.05, letter-spacing -1.44px, left-aligned with 48-80px left padding. No body subtext in the hero.

2. **Process Card**: White (#f5f5f5) surface, 16px border-radius, 32px padding. Heading 'Think' in Saans Variable 24px weight 500, #0c1018. Body text in Saans 16px weight 400, #6d7074, line-height 1.4, letter-spacing -0.16px. Lower 50% of card filled with a full-bleed photograph of a botanical subject, no padding around the image.

3. **Pill Ghost Button**: No background, no border. Saans Variable 16px weight 500, #0c1018, letter-spacing -0.16px. 50px border-radius. 16px horizontal padding, 10px vertical padding. Text label only.

4. **Top Navigation**: Transparent background floating on hero gradient. Logo 'NEW GENRE' in Saans Variable 14px weight 500, #0c1018, uppercase, slight positive letter-spacing. Nav items right-aligned in Saans 14px weight 400, #0c1018, 24px gap between items, 1px hairline divider in #9e9fa3 between two specific items.

5. **Gradient-Text Display Headline**: Serrif Condensed 64px weight 400, line-height 1.05, letter-spacing -1.28px. First 60% of text in #0c1018. Final 40% uses a CSS mask or color transition fading to the background gradient color, creating a dissolve effect where the text merges into the hero atmosphere.

## Gradient System

The gradient IS the brand identity at the atmospheric level. Two canonical gradients define the system's emotional range:

1. **Dawn Arc** (linear, vertical): #1e1310 → #182644 → #5a769f → #87a1c4 → #c1d3e6 → #fef9e1 → #f7f3f0. This seven-stop gradient moves from charred umber through steel twilight to warm parchment. Used for full-bleed hero sections and transition bands. The gradient can be used as a mask on images, as a background, or as a text-color fill on the final words of a display headline.

2. **Ember Radiance** (radial, off-center): #ffe600 → #ed9454 → transparent gray. A warm radial glow positioned at bottom-right (109.6% 147.1%), used for hover-state atmosphere and accent warmth. Never used as a primary background — it's a highlight, not a canvas.

A secondary **Fire Line** linear gradient (#1e1310 → #903c27 → #e46c44 → #ed9454) appears to be a warm complementary to the Dawn Arc, likely for hover states on dark sections or for the gradient-text effect on warm-toned pages.

## Elevation Philosophy

This system has no box-shadows. Elevation is expressed entirely through the gradient and through near-white surface lightness shifts. Cards on a white canvas are #f5f5f5 — barely a shade darker, enough to create a perceptible boundary without casting a shadow. The gradient itself provides depth in hero sections. The 'elevated' state is achieved by moving from gradient atmosphere (level 1) to white canvas (level 0) to card surface (level 2) — a lightness-based hierarchy, not a shadow-based one. Any traditional drop shadow would feel foreign here.

## Similar Brands

- **Resn** — Same condensed display serif headlines at oversized scale against atmospheric gradient backgrounds, with botanical/organic photography as emotional counterpoint to typographic authority
- **Locomotive (locomotive.ca)** — Identical editorial serif + geometric sans pairing, full-bleed gradient hero sections that dissolve into white content, and the same achromatic interface palette that lets a single gradient carry all the color
- **Active Theory** — Cinematic full-viewport gradient washes, minimal achromatic UI, and oversized condensed type that reads as magazine masthead rather than web headline
- **Ueno** — Monochrome interface discipline with one signature atmospheric element (here, the gradient), condensed display serif, and the agency-portfolio pattern of letting work photography do the emotional heavy lifting

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-parchment-canvas: #ffffff;
  --color-onyx: #0c1018;
  --color-pure-black: #000000;
  --color-charred-umber: #1e1310;
  --color-slate-veil: #6d7074;
  --color-ash-mist: #9e9fa3;
  --color-dawn-arc: #5a769f;
  --gradient-dawn-arc: linear-gradient(rgb(40, 14, 1) 0%, rgb(24, 38, 68) 15.2608%, rgb(90, 118, 159) 30.284%, rgb(135, 161, 196) 43.3787%, rgb(193, 211, 230) 58.8313%, rgb(254, 249, 225) 79.7139%, rgb(247, 243, 240) 100%);
  --color-ember-radiance: #ed9454;
  --gradient-ember-radiance: radial-gradient(75% 300% at 109.6% 147.1%, rgb(255, 230, 0) 0%, rgb(237, 148, 84) 29.5837%, rgba(153, 161, 175, 0.06) 100%);

  /* Typography — Font Families */
  --font-sans-serif: 'sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-serrif-condensed: 'Serrif Condensed', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-saans-variable: 'Saans Variable', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-saans-medium: 'Saans Medium', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-saans-regular: 'Saans Regular', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.2;
  --tracking-caption: -0.12px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.4;
  --tracking-body-sm: -0.14px;
  --text-body: 16px;
  --leading-body: 1.3;
  --tracking-body: -0.16px;
  --text-subheading: 20px;
  --leading-subheading: 1.2;
  --tracking-subheading: -0.2px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.15;
  --tracking-heading-sm: -0.24px;
  --text-heading: 32px;
  --leading-heading: 1.1;
  --tracking-heading: -0.32px;
  --text-display: 64px;
  --leading-display: 1.05;
  --tracking-display: -1.28px;
  --text-display-lg: 72px;
  --leading-display-lg: 1.05;
  --tracking-display-lg: -1.44px;

  /* Typography — Weights */
  --font-weight-light: 300;
  --font-weight-w380: 380;
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-w570: 570;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-6: 6px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-26: 26px;
  --spacing-32: 32px;
  --spacing-48: 48px;
  --spacing-52: 52px;
  --spacing-56: 56px;
  --spacing-64: 64px;

  /* Layout */
  --page-max-width: 1400px;
  --section-gap: 64-96px;
  --card-padding: 32px;
  --element-gap: 10-16px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-2xl: 16px;
  --radius-full: 50px;
  --radius-full-2: 90px;

  /* Named Radii */
  --radius-cards: 16px;
  --radius-inputs: 50px;
  --radius-buttons: 50px;
  --radius-nav-links: 8px;
  --radius-buttons-pill: 90px;

  /* Surfaces */
  --surface-canvas: #ffffff;
  --surface-gradient-atmosphere: #7ba1c4;
  --surface-card-surface: #f5f5f5;
  --surface-dark-ground: #1e1310;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-parchment-canvas: #ffffff;
  --color-onyx: #0c1018;
  --color-pure-black: #000000;
  --color-charred-umber: #1e1310;
  --color-slate-veil: #6d7074;
  --color-ash-mist: #9e9fa3;
  --color-dawn-arc: #5a769f;
  --color-ember-radiance: #ed9454;

  /* Typography */
  --font-sans-serif: 'sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-serrif-condensed: 'Serrif Condensed', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-saans-variable: 'Saans Variable', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-saans-medium: 'Saans Medium', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-saans-regular: 'Saans Regular', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.2;
  --tracking-caption: -0.12px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.4;
  --tracking-body-sm: -0.14px;
  --text-body: 16px;
  --leading-body: 1.3;
  --tracking-body: -0.16px;
  --text-subheading: 20px;
  --leading-subheading: 1.2;
  --tracking-subheading: -0.2px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.15;
  --tracking-heading-sm: -0.24px;
  --text-heading: 32px;
  --leading-heading: 1.1;
  --tracking-heading: -0.32px;
  --text-display: 64px;
  --leading-display: 1.05;
  --tracking-display: -1.28px;
  --text-display-lg: 72px;
  --leading-display-lg: 1.05;
  --tracking-display-lg: -1.44px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-6: 6px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-26: 26px;
  --spacing-32: 32px;
  --spacing-48: 48px;
  --spacing-52: 52px;
  --spacing-56: 56px;
  --spacing-64: 64px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-2xl: 16px;
  --radius-full: 50px;
  --radius-full-2: 90px;
}
```
