# Eddie — Style Reference
> Pastel sticker pack on warm cream paper

**Theme:** light

Eddie operates in a soft-canvas product world: a warm off-white stage (#f7f4f2) where generous rounded cards float on lavender-tinted shadows. The color story is split — the structural skeleton is near-black on cream for maximum clarity, while content cards burst into pastel lavender, vivid lime, and sky blue, making each section feel like a distinct room rather than a uniform scroll. Typography is confident and loud at the top (66–119px bold display), then shrinks into a tight compact body system. Components are heavily rounded (30–40px radii), relying on colored fill rather than outline for hierarchy, with floating action buttons that are solid black pills. The robot mascot icon is a recurring brand stamp — a rounded square with a face — used inside soft lavender badges as a visual signature throughout.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Graphite | `#000000` | `--color-graphite` | Primary text, filled action buttons, and dominant borders — near-black provides maximum contrast against the warm cream canvas |
| Cream | `#f7f4f2` | `--color-cream` | Page canvas and soft surface washes — the warm off-white foundation of every section |
| Paper White | `#ffffff` | `--color-paper-white` | Card surfaces, button text, and inverted text on black — the cleanest layer above cream |
| Lavender Mist | `#eeeafa` | `--color-lavender-mist` | Shadow tint and near-white lavender surface — appears as the soft drop-shadow color (rgba 0.3) that makes cards feel like they hover |
| Ash | `#cdcbd0` | `--color-ash` | Hairline borders, link underlines, and light dividers |
| Slate | `#4d4c51` | `--color-slate` | Dark borders and separators for elevated surfaces and inverted UI. Do not promote it to the primary CTA color |
| Fog | `#767481` | `--color-fog` | Body text secondary level and subdued border color |
| Mist | `#9a98a1` | `--color-mist` | Nav inactive text and lightest nav border |
| Wisteria | `#d8d1ff` | `--color-wisteria` | Primary lavender card surfaces, badge backgrounds, and brand-accent fills — the soft purple room tone |
| Periwinkle | `#b7b2ff` | `--color-periwinkle` | Mid-violet badge fills and icon highlights — deeper brand accent used sparingly inside lavender contexts |
| Lime Voltage | `#d2e534` | `--color-lime-voltage` | High-energy accent card surface and highlight badge — the vivid chartreuse that creates urgency and visual stop |
| Sky Signal | `#89cdf3` | `--color-sky-signal` | Info badge background and location-tag accent — cool blue for map/location context |

## Tokens — Typography

### Founders Grotesk — Single-family sans-serif system. Weight 400 carries body and UI labels; weight 600 powers subheadings and button text; weight 700 dominates all display and hero headlines. The custom geometric construction gives slightly squarer letterforms than typical grotesques, reinforcing the product's friendly tech personality. · `--font-founders-grotesk`
- **Substitute:** Inter, Söhne, or Manrope
- **Weights:** 400, 600, 700
- **Sizes:** 14px, 16px, 18px, 22px, 26px, 30px, 66px, 67px, 119px
- **Line height:** 0.70–1.30
- **Letter spacing:** normal at all sizes — the geometric forms do the heavy lifting, no optical tightening needed
- **Role:** Single-family sans-serif system. Weight 400 carries body and UI labels; weight 600 powers subheadings and button text; weight 700 dominates all display and hero headlines. The custom geometric construction gives slightly squarer letterforms than typical grotesques, reinforcing the product's friendly tech personality.

### Founders Grotesk — Caption and badge label — smallest text tier, appears inside colored chips · `--font-founders-grotesk`
- **Substitute:** Inter
- **Weights:** 400
- **Sizes:** 14px, 16px, 18px, 22px, 26px, 30px, 66px, 67px, 119px
- **Line height:** 1.30
- **Letter spacing:** normal
- **Role:** Caption and badge label — smallest text tier, appears inside colored chips

### Founders Grotesk — Body text and list copy — comfortable reading weight at 16–18px · `--font-founders-grotesk`
- **Substitute:** Inter
- **Weights:** 400
- **Sizes:** 14px, 16px, 18px, 22px, 26px, 30px, 66px, 67px, 119px
- **Line height:** 1.30
- **Letter spacing:** normal
- **Role:** Body text and list copy — comfortable reading weight at 16–18px

### Founders Grotesk — Subheadings and card titles — medium-bold weight creates section anchors without competing with display · `--font-founders-grotesk`
- **Substitute:** Inter
- **Weights:** 600
- **Sizes:** 14px, 16px, 18px, 22px, 26px, 30px, 66px, 67px, 119px
- **Line height:** 1.10
- **Letter spacing:** normal
- **Role:** Subheadings and card titles — medium-bold weight creates section anchors without competing with display

### Founders Grotesk — Display headlines and hero — oversized 700-weight with tight 0.80 leading creates the confident, almost editorial voice. Sizes above 60px are signature-defining; 119px is reserved for the primary hero statement. · `--font-founders-grotesk`
- **Substitute:** Inter
- **Weights:** 700
- **Sizes:** 14px, 16px, 18px, 22px, 26px, 30px, 66px, 67px, 119px
- **Line height:** 0.80
- **Letter spacing:** normal
- **Role:** Display headlines and hero — oversized 700-weight with tight 0.80 leading creates the confident, almost editorial voice. Sizes above 60px are signature-defining; 119px is reserved for the primary hero statement.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 14px | 18 | — | `--text-caption` |
| body-sm | 16px | 21 | — | `--text-body-sm` |
| body | 18px | 23 | — | `--text-body` |
| subheading | 22px | 24 | — | `--text-subheading` |
| heading-sm | 26px | 29 | — | `--text-heading-sm` |
| heading | 30px | 33 | — | `--text-heading` |
| heading-lg | 66px | 53 | — | `--text-heading-lg` |
| display | 119px | 83 | — | `--text-display` |

## Tokens — Spacing & Shapes

**Density:** compact

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 5 | 5px | `--spacing-5` |
| 7 | 7px | `--spacing-7` |
| 8 | 8px | `--spacing-8` |
| 10 | 10px | `--spacing-10` |
| 12 | 12px | `--spacing-12` |
| 13 | 13px | `--spacing-13` |
| 15 | 15px | `--spacing-15` |
| 20 | 20px | `--spacing-20` |
| 24 | 24px | `--spacing-24` |
| 25 | 25px | `--spacing-25` |
| 30 | 30px | `--spacing-30` |
| 40 | 40px | `--spacing-40` |
| 50 | 50px | `--spacing-50` |
| 60 | 60px | `--spacing-60` |
| 100 | 100px | `--spacing-100` |

### Border Radius

| Element | Value |
|---------|-------|
| nav | 15px |
| cards | 40px |
| links | 15px |
| small | 2px |
| badges | 30px |
| images | 15px |
| buttons | 25px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| lg | `rgba(198, 185, 237, 0.3) 5px 5px 20px 0px` | `--shadow-lg` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80-100px
- **Card padding:** 20-40px
- **Element gap:** 10px

## Components

### Floating Navigation Pill
**Role:** Top-left persistent brand nav

Rounded pill container (15px radius), white surface, lavender shadow (rgba(198,185,237,0.3) 5px 5px 20px). Contains the mascot icon badge (lavender #d8d1ff, 30px radius) and the word 'Accueil' in 16px weight 600 black. Sits 20px from edges, always visible.

### Action Button (Filled Black)
**Role:** Primary interactive element

Solid black (#000000) background, white text, 25px border-radius, 10px vertical / 20px horizontal padding. Text in Founders Grotesk 16px weight 600. Carries the lavender drop shadow for elevation. Used for 'Ça m'intéresse' and similar conversion CTAs.

### Action Button (Ghost)
**Role:** Secondary interactive element

White background, 1px slate border (#4d4c51 or #cdcbd0), 25px border-radius, matching 10×20px padding. Sits beside the filled action in the nav cluster.

### Tag Pill (Category)
**Role:** Inline category or feature tags

30px radius pill, 5px vertical / 10px horizontal padding. Three variants by fill: lavender (#d8d1ff) for default tags, sky blue (#89cdf3) for location tags, lime (#d2e534) for enterprise tags. Each contains a small inline icon (building, pin, lightning) in black, followed by 14–16px weight 400 label.

### Mascot Badge
**Role:** Brand stamp and visual signature

Lavender (#d8d1ff) rounded square, 30px radius, approximately 48px square. Contains a simplified black robot face icon (rounded rectangle body, two dot eyes, horizontal mouth line). Used inline in headlines, in the nav, and as section anchors. The single most recognizable brand element.

### Hero Display Headline
**Role:** Opening statement

Founders Grotesk 700 at 66–119px, line-height 0.80, color #000000. Headline wraps across 1–2 lines centered on the canvas. An inline mascot badge replaces a word in the headline, integrating the brand into the sentence.

### Accent Feature Card (Lavender)
**Role:** Content card with brand purple surface

40px border-radius, #d8d1ff fill, 20–40px internal padding. Contains a bold 26–30px heading in black and body copy in 16–18px weight 400. Often includes an embedded image or illustration on the right half.

### Accent Feature Card (Lime)
**Role:** High-energy CTA or feature highlight

40px border-radius, #d2e534 fill, 20–40px padding. Same typography structure as the lavender card but with the vivid lime surface to signal action or priority. Often paired with a filled black action button inside.

### App Download Card
**Role:** Mobile app promotion

White surface, 40px radius, contains a lavender (#d8d1ff) tag pill, a 26px heading, body copy at 16–18px, and black App Store / Google Play badges. The inner app card uses 20px radius and lavender fill.

### Team Member Card
**Role:** Social proof with attribution

White card, 30px radius, contains a circular headshot (approx 48px), bold name in 16–18px weight 600, and role/title in 14–16px weight 400 in slate. Sits inside a lime accent card.

### Product Render Card
**Role:** 3D product showcase

Light gray (#f7f4f2 or near-white) surface, 40px radius, contains an isometric 3D render of a charging device or smartwatch. The render itself is tinted in lavender and white, with a soft ground shadow integrated into the asset.

### Hairline Divider
**Role:** Section separator

1px solid #cdcbd0 line used sparingly. Most section breaks rely on background color changes rather than explicit dividers.

### Inline Link
**Role:** In-body navigation or press release link

Black text, 1px underline (color matches text or #cdcbd0). 13px padding around inline link elements. No color change on hover implied — weight and color stay constant for editorial calm.

## Do's and Don'ts

### Do
- Use Founders Grotesk at 700 weight for any headline above 30px — the bold geometric forms are the hero voice
- Apply the lavender shadow rgba(198,185,237,0.3) 5px 5px 20px to every elevated element (nav, buttons, cards) — it is the only shadow in the system
- Use 25px radius for buttons, 30px for badges, 40px for large cards — the radius hierarchy is non-negotiable
- Place the mascot badge inline in headlines as a word replacement to integrate brand identity into copy
- Set cards to full 40px radius with 20–40px padding and let their fill color (lavender, lime, white) carry the visual hierarchy instead of borders or shadows
- Keep body text at 16–18px weight 400 in black (#000000) on cream — never reduce contrast by using gray for primary copy
- Use the cream canvas #f7f4f2 as the page background; reserve pure white for card surfaces and inverted text

### Don't
- Do not introduce additional shadow colors or multi-layer shadow stacks — the single lavender-tinted shadow defines the elevation system
- Do not use sharp corners (0–5px) on any card, button, or badge — the 25–40px radius range is the system's defining softness
- Do not set headlines below 30px or above 120px — the 66–119px display tier and the 22–30px subhead tier are the two approved headline sizes
- Do not use the accent colors (#d8d1ff, #d2e534, #89cdf3) for body text — they are surface fills only, all text on them must be black
- Do not add gradients — the system is strictly flat fills with one shadow tint
- Do not introduce new accent hues beyond Wisteria, Periwinkle, Lime Voltage, and Sky Signal — the four-color accent palette is the system
- Do not use outline-only buttons as primary actions; the primary action is always a solid black filled pill

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Cream Canvas | `#f7f4f2` | Page background and dominant surface tone |
| 1 | Paper White | `#ffffff` | Card surfaces and inverted button text |
| 2 | Wisteria | `#d8d1ff` | Accent card surface — brand purple room |
| 3 | Lime Voltage | `#d2e534` | High-energy accent card — CTA and feature highlight |
| 4 | Sky Signal | `#89cdf3` | Info accent and location badge |

## Elevation

- **Navigation Pill:** `rgba(198, 185, 237, 0.3) 5px 5px 20px 0px`
- **Action Button:** `rgba(198, 185, 237, 0.3) 5px 5px 20px 0px`
- **Floating Card:** `rgba(198, 185, 237, 0.3) 5px 5px 20px 0px`

## Imagery

Imagery is primarily 3D product renders — a charging unit and a smartwatch with rounded, almost toy-like proportions. Renders are presented in a tilted, isometric perspective on a light gray stage with soft ground shadows, giving them a physical product-shoot quality. Illustrations are flat, rounded, and brand-colored (lavender and white). Icons are minimal: the robot mascot badge is a black line-drawing of a face inside a lavender rounded square — this is the single most repeated visual motif. Photography is limited to one small headshot in a name card. Overall treatment: playful, product-forward, pastel, and uncluttered.

## Layout

The page is a full-width scroll on a cream canvas with generous breathing room between sections. The hero is centered — large display headline with an inline mascot badge, followed by a row of three colored tag pills. Below, content is organized into large rounded cards (40px radius) that bleed to the edges or sit centered at max-width. Section rhythm alternates between cream background, lavender cards, white cards, and occasional lime-green feature blocks — each section feels like a colored room. Navigation is a minimal floating pill in the top-left and a right-aligned CTA pair, both with the lavender shadow. Content arrangement is predominantly centered stacks and two-column splits (one muted card + one accent card).

## Agent Prompt Guide

**Quick Color Reference**
- text: #000000
- background: #f7f4f2
- surface: #ffffff
- border: #cdcbd0
- accent: #d8d1ff (Wisteria lavender)
- primary action: #000000 (filled action)

**Example Component Prompts**

1. Build the hero section: cream canvas #f7f4f2, centered. Headline at 119px Founders Grotesk weight 700, line-height 0.80, color #000000. Replace one word in the headline with an inline mascot badge: a #d8d1ff rounded square (30px radius, ~48px) containing a black robot face icon. Below the headline, a row of three 30px-radius tag pills at 5px/10px padding: lavender #d8d1ff with a building icon, sky blue #89cdf3 with a pin icon, lime #d2e534 with a lightning icon. Labels in 16px weight 400 black.

2. Build a lavender feature card: 40px border-radius, #d8d1ff fill, 40px padding. Heading in 30px Founders Grotesk weight 600, line-height 1.10, color #000000. Body in 18px weight 400, color #000000. Floating lavender shadow: rgba(198,185,237,0.3) 5px 5px 20px.

3. Build a lime CTA card: 40px border-radius, #d2e534 fill, 40px padding. Heading at 30px weight 600 black. Inside, a team member card: white #ffffff, 30px radius, 20px padding, with a 48px circular headshot, name in 16px weight 600, role in 14px weight 400 slate #767481. Below that, a filled black action button: 25px radius, #000000 background, white text, 16px weight 600, 10px/20px padding, lavender drop shadow.

4. Build the floating nav: white pill, 15px border-radius, 10px/15px padding, lavender shadow. Left side: mascot icon badge (#d8d1ff, 30px radius) followed by 'Accueil' in 16px weight 600. Right side: a ghost button (white, 1px #cdcbd0 border, 25px radius) and a filled black action button (25px radius) side by side, separated by 10px gap.

5. Build a product render section: light cream surface, 40px radius, 40px padding. Inside, a tilted isometric 3D render of a charging device rendered in lavender and white tones with a soft ground shadow. Section heading above in 66px weight 700, line-height 0.80, centered.

## Surface Card System

The design organizes content into full-bleed colored rooms rather than bordered panels. Each major section is a large rounded card (40px radius) with a solid fill — cream #f7f4f2 for default, white #ffffff for neutral content, #d8d1ff lavender for brand sections, and #d2e534 lime for high-priority CTAs. Cards are separated by the cream canvas rather than by borders, and float on the shared lavender shadow. This means a page reads as a sequence of pastel rooms stacked on warm paper, not as a grid of outlined boxes.

## Radius Hierarchy

The radius system is strictly tiered: 2px for small inline elements, 15px for nav and small links, 25px for buttons, 30px for badges and inline cards, and 40px for major feature cards. Every radius value in the system belongs to this ladder — no custom intermediate values. This consistency is what gives the interface its toy-like, soft-edged feel.

## Similar Brands

- **Arc browser** — Same pastel-card-on-warm-canvas approach with playful rounded forms and soft tinted shadows
- **Linear** — Compact density, near-black text on light surface, and oversized bold headlines with tight leading
- **Stripe** — Clean editorial typography at extreme display sizes with controlled accent-color usage for hierarchy
- **Nothing Phone** — Rounded product-forward visuals and a distinct mascot icon as brand signature

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-graphite: #000000;
  --color-cream: #f7f4f2;
  --color-paper-white: #ffffff;
  --color-lavender-mist: #eeeafa;
  --color-ash: #cdcbd0;
  --color-slate: #4d4c51;
  --color-fog: #767481;
  --color-mist: #9a98a1;
  --color-wisteria: #d8d1ff;
  --color-periwinkle: #b7b2ff;
  --color-lime-voltage: #d2e534;
  --color-sky-signal: #89cdf3;

  /* Typography — Font Families */
  --font-founders-grotesk: 'Founders Grotesk', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 18;
  --text-body-sm: 16px;
  --leading-body-sm: 21;
  --text-body: 18px;
  --leading-body: 23;
  --text-subheading: 22px;
  --leading-subheading: 24;
  --text-heading-sm: 26px;
  --leading-heading-sm: 29;
  --text-heading: 30px;
  --leading-heading: 33;
  --text-heading-lg: 66px;
  --leading-heading-lg: 53;
  --text-display: 119px;
  --leading-display: 83;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-5: 5px;
  --spacing-7: 7px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-13: 13px;
  --spacing-15: 15px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-25: 25px;
  --spacing-30: 30px;
  --spacing-40: 40px;
  --spacing-50: 50px;
  --spacing-60: 60px;
  --spacing-100: 100px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80-100px;
  --card-padding: 20-40px;
  --element-gap: 10px;

  /* Border Radius */
  --radius-sm: 2px;
  --radius-xl: 15px;
  --radius-2xl: 20px;
  --radius-3xl: 25px;
  --radius-3xl-2: 30px;
  --radius-3xl-3: 40px;
  --radius-full: 60px;

  /* Named Radii */
  --radius-nav: 15px;
  --radius-cards: 40px;
  --radius-links: 15px;
  --radius-small: 2px;
  --radius-badges: 30px;
  --radius-images: 15px;
  --radius-buttons: 25px;

  /* Shadows */
  --shadow-lg: rgba(198, 185, 237, 0.3) 5px 5px 20px 0px;

  /* Surfaces */
  --surface-cream-canvas: #f7f4f2;
  --surface-paper-white: #ffffff;
  --surface-wisteria: #d8d1ff;
  --surface-lime-voltage: #d2e534;
  --surface-sky-signal: #89cdf3;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-graphite: #000000;
  --color-cream: #f7f4f2;
  --color-paper-white: #ffffff;
  --color-lavender-mist: #eeeafa;
  --color-ash: #cdcbd0;
  --color-slate: #4d4c51;
  --color-fog: #767481;
  --color-mist: #9a98a1;
  --color-wisteria: #d8d1ff;
  --color-periwinkle: #b7b2ff;
  --color-lime-voltage: #d2e534;
  --color-sky-signal: #89cdf3;

  /* Typography */
  --font-founders-grotesk: 'Founders Grotesk', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 18;
  --text-body-sm: 16px;
  --leading-body-sm: 21;
  --text-body: 18px;
  --leading-body: 23;
  --text-subheading: 22px;
  --leading-subheading: 24;
  --text-heading-sm: 26px;
  --leading-heading-sm: 29;
  --text-heading: 30px;
  --leading-heading: 33;
  --text-heading-lg: 66px;
  --leading-heading-lg: 53;
  --text-display: 119px;
  --leading-display: 83;

  /* Spacing */
  --spacing-5: 5px;
  --spacing-7: 7px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-13: 13px;
  --spacing-15: 15px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-25: 25px;
  --spacing-30: 30px;
  --spacing-40: 40px;
  --spacing-50: 50px;
  --spacing-60: 60px;
  --spacing-100: 100px;

  /* Border Radius */
  --radius-sm: 2px;
  --radius-xl: 15px;
  --radius-2xl: 20px;
  --radius-3xl: 25px;
  --radius-3xl-2: 30px;
  --radius-3xl-3: 40px;
  --radius-full: 60px;

  /* Shadows */
  --shadow-lg: rgba(198, 185, 237, 0.3) 5px 5px 20px 0px;
}
```
