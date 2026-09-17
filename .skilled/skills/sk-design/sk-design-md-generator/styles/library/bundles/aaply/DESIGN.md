# Aaply — Style Reference
> Digital sketchpad with electric highlighter

**Theme:** light

Aaply reads as a digital sketchpad on a light gray canvas: everything is flat, everything is rounded, and electric yellow carries the energy while black anchors the structure. The headline itself behaves like a whiteboard — bold black type interrupted by colorful emoji and icon stickers, signaling that this is a tool for creative work. Surfaces float as soft white cards on a cool gray field with a faint dot-grid texture, never relying on shadows for depth. Brand color appears as generous fills (buttons, accent shapes, logo marks) rather than thin strokes or tinted backgrounds. The overall feeling is energetic but unpretentious — a working surface, not a gallery.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Highlighter Yellow | `#e6e51e` | `--color-highlighter-yellow` | Primary brand accent — logo mark, filled pill buttons, accent shapes inside product mockups, highlight washes on feature cards |
| Annotation Red | `#f34646` | `--color-annotation-red` | Red supporting accent for decorative details and low-frequency emphasis |
| Signal Blue | `#466cf3` | `--color-signal-blue` | Product mockup logos, icon accents, connector arrows inside the flow diagram — the cool counterweight to warm yellow |
| Peach Wash | `#ff8562` | `--color-peach-wash` | Soft tinted background blocks behind product mockup clusters — warm secondary surface that softens the gray canvas |
| Carbon | `#000000` | `--color-carbon` | Primary text, dark filled buttons, icon strokes — the structural ink of the entire system |
| Paper White | `#ffffff` | `--color-paper-white` | Card surfaces, navigation bar background, product mockup canvas — every elevated surface |
| Graphite Mist | `#f2f2f2` | `--color-graphite-mist` | Page canvas background — the cool gray field that makes white cards appear to float |
| Hairline Gray | `#e6e6e6` | `--color-hairline-gray` | Subtle borders, secondary surface fills, dividers between content sections |
| Shadow Gray | `#cccccc` | `--color-shadow-gray` | Single soft drop shadow color (used at 20% opacity as rgba), muted text on dark surfaces |
| Sunbeam | `#fff705` | `--color-sunbeam` | Brighter yellow variant for highlighted feature containers — the outer glow on flow-diagram cards |

## Tokens — Typography

### Times — Times — detected in extracted data but not described by AI · `--font-times`
- **Weights:** 400
- **Sizes:** 16px
- **Line height:** 1.2
- **Role:** Times — detected in extracted data but not described by AI

### Poppins — Display and heading family — weight 700 for the hero headline and section titles, weight 500 for sub-headings. Its geometric roundness echoes the pill buttons and rounded cards, making type and shape feel like one material. Tight negative tracking at large sizes pulls letters together into a confident block. · `--font-poppins`
- **Substitute:** DM Sans, Nunito Sans
- **Weights:** 400, 500, 700
- **Sizes:** 14px, 27px, 34px, 52px, 57px
- **Line height:** 1.00, 1.05, 1.33, 1.35, 1.57
- **Letter spacing:** -0.0740em at display sizes, -0.0190em at heading, -0.0180em at heading-sm
- **Role:** Display and heading family — weight 700 for the hero headline and section titles, weight 500 for sub-headings. Its geometric roundness echoes the pill buttons and rounded cards, making type and shape feel like one material. Tight negative tracking at large sizes pulls letters together into a confident block.

### Inter — Body and UI text — nav links, button labels, descriptions, form text. Inter's humanist proportions provide readable density at small sizes while weight 700 can punch up to match Poppins in nav and button contexts. · `--font-inter`
- **Substitute:** system-ui, -apple-system, Segoe UI
- **Weights:** 300, 400, 500, 700
- **Sizes:** 15px, 16px, 18px, 27px, 31px
- **Line height:** 1.40, 1.44, 1.53, 1.55, 1.56
- **Letter spacing:** -0.0740em at large sizes, -0.0280em at 18px, normal at 16px and below
- **Role:** Body and UI text — nav links, button labels, descriptions, form text. Inter's humanist proportions provide readable density at small sizes while weight 700 can punch up to match Poppins in nav and button contexts.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 14px | 1.57 | — | `--text-caption` |
| body | 16px | 1.53 | — | `--text-body` |
| subheading | 18px | 1.4 | -0.5px | `--text-subheading` |
| heading-sm | 27px | 1.33 | -0.49px | `--text-heading-sm` |
| heading | 34px | 1.05 | -0.65px | `--text-heading` |
| heading-lg | 52px | 1 | -3.85px | `--text-heading-lg` |
| display | 57px | 1.05 | -4.22px | `--text-display` |

## Tokens — Spacing & Shapes

**Density:** comfortable

### Border Radius

| Element | Value |
|---------|-------|
| nav | 30px |
| tags | 3000px |
| cards | 30-40px |
| inputs | 16px |
| buttons | 3000px |
| productFrame | 16px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| md | `rgba(0, 0, 0, 0.2) 0px 10px 10px -5px` | `--shadow-md` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80-120px
- **Card padding:** 32-48px
- **Element gap:** 16-24px

## Components

### Filled Yellow Pill Button
**Role:** Primary brand accent button

#e6e51 background, #000000 text, border-radius 3000px, padding 16px 32px, Inter weight 500 at 16px. The highest-energy button in the system — used for the main conversion moment. Black text on yellow achieves 15.6:1 contrast.

### Filled Black Pill Button
**Role:** Secondary high-emphasis button

#000000 background, #ffffff text, border-radius 3000px, padding 16px 32px, Inter weight 500 at 16px. Used for the darker companion CTA beside the yellow button. Maximum contrast and weight.

### Ghost Pill Button
**Role:** Low-emphasis navigation action

Transparent background, #000000 1px border, border-radius 3000px, padding 12px 24px, Inter weight 500 at 15px. Used for 'Log in' in the nav bar — present but quiet.

### Navigation Bar Card
**Role:** Top-level site navigation

White #ffffff surface on the gray canvas, border-radius 30px, horizontal padding 24px, vertically centered logo + link group + button group. Floats with a single soft drop shadow (rgba(0,0,0,0.2) 0px 10px 10px -5px). Max-width aligns with page content.

### Product Screenshot Frame
**Role:** Browser-style product preview container

White card with border-radius 16px, three colored traffic-light dots (red/yellow/blue) in the top-left corner to simulate a browser window. Contains a dot-grid background pattern and nested UI mockups.

### Phone Mockup Card
**Role:** Individual screen preview in a flow diagram

White rounded rectangle (~16px radius) with a bold blue #466cf3 zigzag 'N' mark at the top, screen label text below (Inter 14px). Connected to adjacent mockups by thin lines with small arrowheads.

### Flow Connector Line
**Role:** Visual link between product screens

Thin #000000 1px line with a small arrowhead or node dot at the endpoint. Black-on-white, no fill — the lines are the diagram's grammar.

### Annotation Tag
**Role:** Callout label on product mockups

#f34646 background, #ffffff text, border-radius 3000px, padding 6px 14px, Inter weight 500 at 13px. Small, saturated, attention-grabbing — points to specific features inside the product preview.

### Highlight Feature Container
**Role:** Yellow-bordered flow card grouping related screens

Outer container with a #fff705 border (2-3px), border-radius ~30px, wrapping a group of 2-3 phone mockup cards. Functions as a visual 'chapter' boundary within the product preview.

### Avatar Stack
**Role:** Social proof / collaboration indicator

Circular user avatars (24-32px diameter) with 2px white border, stacked with negative horizontal offset. Positioned on the right edge of the product preview to suggest multi-user activity.

### Brand Logo Mark
**Role:** Brand identity in nav and footer

Yellow #e6e51 rounded square (~20px) with a simple 'A' or mountain-like glyph in black, paired with 'aaply' wordmark in Poppins 500 at 18px, #000000.

### Emoji/Illustration Accent
**Role:** Decorative element embedded in headlines

Full-color emoji or flat icon illustrations placed inline within the hero headline. They sit at baseline and break the text rhythm — a signature device that makes the headline feel hand-assembled rather than typeset.

## Do's and Don'ts

### Do
- Use border-radius 3000px for all buttons, tags, and small interactive elements
- Use Poppins weight 700 with tight negative tracking (-0.0740em) for display and hero headlines
- Pair every yellow filled button with a black filled button as a high-contrast companion
- Embed emoji or flat icon illustrations directly inside headlines — not beside them
- Use the dot-grid texture on product preview backgrounds to signal 'this is a working canvas'
- Set card border-radius between 30-40px for feature cards; 16px only for small UI mockups
- Keep all text #000000 on white/light surfaces — the system runs on maximum contrast

### Don't
- Do not stack multiple shadow layers — the system uses one shadow, on the nav bar, and nothing else
- Do not introduce new accent hues beyond the four-color palette (yellow, red, blue, peach)
- Do not use light or thin font weights for headlines — Poppins 700 is the floor for display text
- Do not use sharp corners on buttons, tags, or cards — every interactive element is fully rounded
- Do not separate the yellow and black buttons with other styles — they always appear as a matched pair
- Do not use emoji or illustrations as standalone decorations outside of headlines and product mockups
- Do not apply the peach #ff8562 as a full background section — it stays as a soft wash behind mockup clusters only

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas | `#f2f2f2` | Page background — cool gray field with dot-grid texture |
| 1 | Card | `#ffffff` | Navigation bar, feature cards, product mockup containers |
| 2 | Tinted Accent | `#ff8562` | Peach wash behind mockup clusters, subtle warmth |
| 3 | Highlight Frame | `#fff705` | Yellow-bordered feature containers that frame the hero product flow |

## Elevation

- **Navigation bar:** `rgba(0, 0, 0, 0.2) 0px 10px 10px -5px`

## Imagery

The visual language is dominated by product mockups and flat illustration, not photography. The hero contains a large browser-style screenshot of the actual product — a flowchart editor with phone-shaped screen cards connected by arrows on a dot-grid background. Inside the mockup, phone screens show the app's own onboarding flow (log in, company name, sign up) rendered in miniature. The page background carries a faint dot-grid texture, reinforcing the whiteboard/canvas metaphor. The only other visual elements are emoji and small flat icons (speech bubbles, flags, zigzags) placed directly inside the headline text. No stock photography, no 3D renders, no lifestyle imagery — the product IS the hero.

## Layout

Centered max-width layout (~1200px) on a light gray canvas. The hero is a centered headline stack with two pill buttons below, followed by a full-width product screenshot that bleeds edge-to-edge within the content container. Sections are separated by generous vertical rhythm (80-120px) rather than visual dividers. The navigation bar floats as a rounded white card with a single soft shadow. The product preview itself uses a Z-pattern: mockups flow left-to-right with connector arrows, then the flow continues in a second row slightly below. Content is text-light and visual-heavy — the product screenshot occupies more vertical space than all text combined above it.

## Agent Prompt Guide

**Quick Color Reference**
- text: #000000
- background: #f2f2f2 (page) / #ffffff (card)
- border: #e6e6e6
- accent (brand): #e6e51e
- annotation/callout: #f34646
- mockup icon/connector: #466cf3
- soft tint wash: #ff8562
- primary action: no distinct CTA color

**Example Component Prompts**
1. Create a hero headline: Poppins weight 700, 57px, #000000, line-height 1.05, letter-spacing -4.22px. Center-aligned on #f2f2f2 background. Include 2-3 inline emoji or flat icon illustrations at baseline level. Below: a yellow pill button (#e6e51e, #000000 text, 3000px radius, 16px 32px padding) and a black pill button (#000000, #ffffff text, same shape) side by side with 16px gap.

2. Create a product preview card: white #ffffff surface, 16px border-radius, with three small traffic-light dots (red #f34646, yellow #e6e51e, blue #466cf3) in the top-left corner at 8px from edges. Interior background is a repeating dot-grid pattern in #e6e6e6 at 20px spacing. Contains 3-4 phone-shaped mockup cards (white, 16px radius, each with a blue #466cf3 zigzag mark at top and Inter 14px label below) connected by thin black lines with small arrowheads.

3. Create a navigation bar: white #ffffff background, 30px border-radius, single shadow rgba(0,0,0,0.2) 0px 10px 10px -5px. Left: yellow logo mark (rounded square #e6e51e, 20px, with black glyph) + 'aaply' wordmark in Poppins 500 18px #000000. Center: 4 nav links in Inter 500 15px #000000, 24px gap. Right: ghost pill button (transparent, 1px #000000 border, 3000px radius, 'Log in') + filled black pill button (#000000 bg, #ffffff text, 3000px radius, 'Sign up').

## Signature Devices

Three patterns define Aaply's visual identity and should be repeated across every new page:

1. **The Emoji-In-Headline Pattern**: Display headlines are interrupted by inline emoji or flat icon stickers that sit at text baseline. The icons are full-color and bold, not monochrome or line-art. They are part of the sentence, not adjacent to it.

2. **The Yellow-Black Button Pair**: Conversion moments always offer two pill buttons — yellow first (the primary brand accent), black second (the high-contrast alternative). Never split them apart or substitute other styles.

3. **The Product-Is-The-Hero Pattern**: Below every headline section, a large browser-frame screenshot of the product fills the visual space. The screenshot is a true representation, not a stylized illustration — but the UI inside it uses the same yellow/blue/red accent system, creating a recursive brand experience.

## Similar Brands

- **Framer** — Same bold sans-serif headlines with tight tracking, playful use of inline emoji, and a product screenshot as the hero visual
- **Pitch** — Same generous border-radius on cards and buttons, light canvas with floating white surfaces, and a single vibrant accent color carrying the brand energy
- **Popsy** — Same yellow as dominant brand accent, pill-shaped CTAs, and a flat illustration style that treats the product preview as decorative hero art
- **Whimsical** — Same dot-grid background texture, flowchart-style product visualization, and a working-canvas aesthetic that makes the tool feel like the artifact

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-highlighter-yellow: #e6e51e;
  --color-annotation-red: #f34646;
  --color-signal-blue: #466cf3;
  --color-peach-wash: #ff8562;
  --color-carbon: #000000;
  --color-paper-white: #ffffff;
  --color-graphite-mist: #f2f2f2;
  --color-hairline-gray: #e6e6e6;
  --color-shadow-gray: #cccccc;
  --color-sunbeam: #fff705;

  /* Typography — Font Families */
  --font-times: 'Times', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-poppins: 'Poppins', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.57;
  --text-body: 16px;
  --leading-body: 1.53;
  --text-subheading: 18px;
  --leading-subheading: 1.4;
  --tracking-subheading: -0.5px;
  --text-heading-sm: 27px;
  --leading-heading-sm: 1.33;
  --tracking-heading-sm: -0.49px;
  --text-heading: 34px;
  --leading-heading: 1.05;
  --tracking-heading: -0.65px;
  --text-heading-lg: 52px;
  --leading-heading-lg: 1;
  --tracking-heading-lg: -3.85px;
  --text-display: 57px;
  --leading-display: 1.05;
  --tracking-display: -4.22px;

  /* Typography — Weights */
  --font-weight-light: 300;
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-bold: 700;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80-120px;
  --card-padding: 32-48px;
  --element-gap: 16-24px;

  /* Border Radius */
  --radius-2xl: 16px;
  --radius-3xl: 30px;
  --radius-3xl-2: 36px;
  --radius-3xl-3: 40px;
  --radius-3xl-4: 45px;
  --radius-full: 50px;
  --radius-full-2: 56px;
  --radius-full-3: 3000px;

  /* Named Radii */
  --radius-nav: 30px;
  --radius-tags: 3000px;
  --radius-cards: 30-40px;
  --radius-inputs: 16px;
  --radius-buttons: 3000px;
  --radius-productframe: 16px;

  /* Shadows */
  --shadow-md: rgba(0, 0, 0, 0.2) 0px 10px 10px -5px;

  /* Surfaces */
  --surface-canvas: #f2f2f2;
  --surface-card: #ffffff;
  --surface-tinted-accent: #ff8562;
  --surface-highlight-frame: #fff705;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-highlighter-yellow: #e6e51e;
  --color-annotation-red: #f34646;
  --color-signal-blue: #466cf3;
  --color-peach-wash: #ff8562;
  --color-carbon: #000000;
  --color-paper-white: #ffffff;
  --color-graphite-mist: #f2f2f2;
  --color-hairline-gray: #e6e6e6;
  --color-shadow-gray: #cccccc;
  --color-sunbeam: #fff705;

  /* Typography */
  --font-times: 'Times', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-poppins: 'Poppins', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.57;
  --text-body: 16px;
  --leading-body: 1.53;
  --text-subheading: 18px;
  --leading-subheading: 1.4;
  --tracking-subheading: -0.5px;
  --text-heading-sm: 27px;
  --leading-heading-sm: 1.33;
  --tracking-heading-sm: -0.49px;
  --text-heading: 34px;
  --leading-heading: 1.05;
  --tracking-heading: -0.65px;
  --text-heading-lg: 52px;
  --leading-heading-lg: 1;
  --tracking-heading-lg: -3.85px;
  --text-display: 57px;
  --leading-display: 1.05;
  --tracking-display: -4.22px;

  /* Border Radius */
  --radius-2xl: 16px;
  --radius-3xl: 30px;
  --radius-3xl-2: 36px;
  --radius-3xl-3: 40px;
  --radius-3xl-4: 45px;
  --radius-full: 50px;
  --radius-full-2: 56px;
  --radius-full-3: 3000px;

  /* Shadows */
  --shadow-md: rgba(0, 0, 0, 0.2) 0px 10px 10px -5px;
}
```
