# Tapbots — Style Reference
> cosmic command center in violet dusk — a midnight spacecraft hangar where a single violet frequency cuts through the void

**Theme:** dark

Tapbots Ivory is a cosmic product showcase rendered in violet dusk: a near-black canvas hosts floating 3D mascots and illuminated spacecraft, with a single saturated violet threading through every interactive element. The interface is deliberately flat — no drop shadows, no card elevations, no gradients on UI surfaces — letting the 3D hero illustrations carry all visual weight while the UI itself stays quiet and spacious. Typography is exclusively the Apple system stack, which signals the product's iOS-first heritage and avoids any web-font loading delay. The layout is a single centered column that breathes generously between sections, with content maxing out well before the viewport edges. Color is used surgically: violet for links, icons, and emphasis; green and red as functional punctuation for feature headings.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Void | `#05050b` | `--color-void` | Deepest canvas — the void behind everything, visible at the absolute darkest page edges |
| Midnight Canvas | `#1a1a1a` | `--color-midnight-canvas` | Primary page background — the dominant surface where all content lives |
| Carbon | `#111111` | `--color-carbon` | Subtle surface lift for embedded app screenshots and elevated content blocks |
| Graphite | `#212121` | `--color-graphite` | List and card surface — the faintest step up from canvas for grouped content |
| Pure White | `#ffffff` | `--color-pure-white` | Primary text, headings, icons — maximum contrast against the dark canvas |
| Ash | `#c3c3c3` | `--color-ash` | Secondary text and icon fills at reduced opacity contexts |
| Smoke | `#b3b3b3` | `--color-smoke` | Muted body text and supporting copy |
| Dim | `#a3a3a3` | `--color-dim` | Tertiary text — captions, metadata, timestamps |
| Fog | `#999999` | `--color-fog` | Supporting neutral for secondary UI, dividers, and muted labels. Do not promote it to the primary CTA color |
| Pewter | `#666666` | `--color-pewter` | Deepest text level — placeholder, disabled, very-low-emphasis body |
| Silver | `#cccccc` | `--color-silver` | Heading color at reduced emphasis — sub-section titles, subdued headers |
| Signal Violet | `#7047ba` | `--color-signal-violet` | Primary brand violet — the signature color saturating hero backgrounds, app icons, and brand surfaces |
| Glow Violet | `#ba94ff` | `--color-glow-violet` | Violet supporting accent for decorative details and low-frequency emphasis. Do not promote it to the primary CTA color |
| Pulse Violet | `#9466e7` | `--color-pulse-violet` | Mid-violet for feature headings and emphasis — sits between Signal Violet and Glow Violet in the scale |
| Deep Violet | `#4c278e` | `--color-deep-violet` | Dark violet for pressed link states and deep accent contexts |
| Twilight Violet | `#301e4f` | `--color-twilight-violet` | Violet supporting accent for decorative details and low-frequency emphasis. Do not promote it to the primary CTA color |
| Lilac Mist | `#deccff` | `--color-lilac-mist` | Soft violet for muted text and subtle border accents where full saturation would shout |
| Periwinkle | `#cdd4f8` | `--color-periwinkle` | Cool violet tint for body text and light border treatment — the coolest end of the violet range |
| Neon Green | `#74ec5a` | `--color-neon-green` | Accent green for select feature headings — functional punctuation that breaks the violet monotony |
| Alarm Red | `#ff3543` | `--color-alarm-red` | Notification badges, unread indicators, and attention-grabbing icon accents |
| Aurora Gradient | `linear-gradient(to right bottom, #6cb0ff, #f747ff)` | `--color-aurora-gradient` | Signature hero and brand gradient — blue to magenta sweep used on logo, feature icons, and brand surfaces |

## Tokens — Typography

### -apple-system — Universal system stack serving all text from body copy through display headings. Weight 300 is used for large display headings to create an airy, premium feel; weight 400 for body; weight 500 for subheadings and navigation; weight 600 for feature names and labels. The system-font-only choice is deliberate — it signals native Apple heritage, ensures zero font-loading delay, and matches the product's iOS-first identity. · `--font-apple-system`
- **Substitute:** system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif
- **Weights:** 300, 400, 500, 600
- **Sizes:** 16px, 18px, 20px, 21px, 24px, 28px, 32px, 36px
- **Line height:** 1.29, 1.40, 1.50, 1.70, 1.80
- **Role:** Universal system stack serving all text from body copy through display headings. Weight 300 is used for large display headings to create an airy, premium feel; weight 400 for body; weight 500 for subheadings and navigation; weight 600 for feature names and labels. The system-font-only choice is deliberate — it signals native Apple heritage, ensures zero font-loading delay, and matches the product's iOS-first identity.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| body | 16px | 1.7 | — | `--text-body` |
| body-lg | 18px | 1.6 | — | `--text-body-lg` |
| subheading | 21px | 1.4 | — | `--text-subheading` |
| heading-sm | 24px | 1.3 | — | `--text-heading-sm` |
| heading | 28px | 1.2 | — | `--text-heading` |
| heading-lg | 32px | 1.2 | — | `--text-heading-lg` |
| display | 36px | 1.1 | — | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** spacious

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 12 | 12px | `--spacing-12` |
| 20 | 20px | `--spacing-20` |
| 32 | 32px | `--spacing-32` |
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |
| 60 | 60px | `--spacing-60` |
| 80 | 80px | `--spacing-80` |
| 144 | 144px | `--spacing-144` |
| 216 | 216px | `--spacing-216` |

### Border Radius

| Element | Value |
|---------|-------|
| icons | 40px |
| lists | 18px |
| buttons | 40px |

### Layout

- **Page max-width:** 900px
- **Section gap:** 80px
- **Card padding:** 20px
- **Element gap:** 20px

## Components

### Hero Illustration Frame
**Role:** Full-bleed 3D artwork zone at the top of the page

Full-width section with #1a1a1a background hosting 3D-rendered mascots and spacecraft. The Ivory logo and wordmark sit centered at the bottom of this zone. No borders, no shadow — the 3D renders provide all depth.

### Pill Button
**Role:** Primary and secondary action buttons

40px border-radius (fully pill-shaped), transparent or #301e4f background, #ba94ff or #ffffff text at 16px weight 500, padding 10px 30px. The pill radius is the most consistent shape signature across the entire system.

### Pill Link
**Role:** Inline text links and navigation anchors

Same 40px radius as buttons — the system does not distinguish between buttons and links by shape. Text at #ba94ff (active) or #999999 (inactive), no underline by default.

### App Screenshot Showcase
**Role:** Multi-device product preview (iPad + iPhone + Mac)

Three device frames arranged side by side, each containing a live app screenshot. Device frames sit on the #1a1a1a canvas with no shadow. The Mac window uses native chrome (traffic lights). Screenshots themselves are light-mode (white app UI) against the dark page, creating strong figure-ground contrast.

### Feature Grid Card
**Role:** Individual feature in the 2-column features section

Two-column grid with 30px row gap and 20px column gap. Each card: small colored icon (3D emoji-style) at top-left, feature name in white weight 600 at 21px, description in #a3a3a3 or #b3b3b3 at 16px. No card background, no border, no padding — content sits directly on the #1a1a1a canvas.

### Feature Icon
**Role:** Colored 3D-style icon accompanying each feature

Small 3D-rendered icon (apple, headphones, bell, GIF, bookmark style) rendered in vivid colors — yellow, purple, green, red, blue. Sized approximately 32px, no border-radius constraint (icons dictate their own shape). Provides the only chromatic color in the features section.

### Section Heading — Features
**Role:** Section-level title

'Features' at 36px weight 600 in #74ec5a (neon green) — the only green text on the page, making it a visual landmark. Left-aligned within the centered content column.

### Feature Subheading
**Role:** Individual feature name within the grid

White text, weight 600, 21px, line-height 1.4. Each feature name is a single word or short phrase (Behaviors, Themes, Widgets, Shortcuts, Push Notifications, etc.).

### Product Intro Paragraph
**Role:** Hero body text describing the product

Centered text block, max-width 700px, 20px weight 400, line-height 1.5, color #c3c3c3. Key terms within the paragraph are highlighted in #ba94ff (Glow Violet) for emphasis: 'award-winning', 'absolute joy to use', 'designed to delight', 'blazing-fast', 'buttery-smooth', 'rock-solid'.

### List with Soft Radius
**Role:** Grouped content lists (features, changelog items)

18px border-radius on list containers — a softer radius than the 40px pill used for interactive elements. Background #212121 (Graphite) against the #1a1a1a canvas, creating a subtle 1-step surface lift.

### Device Frame
**Role:** iPhone and iPad chrome around app screenshots

Native device bezels (black for iPhone, thin silver for iPad) with no custom styling. Status bar shows 100% battery and time. No drop shadow on frames — the product screenshots themselves provide all visual interest.

### App Store / Download Badge
**Role:** Platform download links

Dark badge with white text, 40px radius, containing platform name. Likely includes App Store, Mac App Store, or TestFlight references based on the 7-day free trial context.

## Do's and Don'ts

### Do
- Use 40px border-radius for all buttons, links, and interactive pill elements — this is the system's defining shape
- Use -apple-system (or system-ui fallback) for all text at weights 300, 400, 500, 600 — never load a web font
- Place content within a max-width of ~900px centered on the #1a1a1a canvas — the page is deliberately narrow
- Use #ba94ff (Glow Violet) for all link colors and interactive emphasis — it is the single bright working color
- Highlight key product adjectives in the intro paragraph using #ba94ff inline to create rhythm within gray body text
- Render feature icons as small 3D-style colored illustrations (apple, bell, headphones) rather than flat line icons
- Keep section gaps at 80px or more — the spacious density is part of the premium feel

### Don't
- Do not add drop shadows to any UI element — the system is intentionally flat, with depth only from 3D illustrations
- Do not use card backgrounds, borders, or padding boxes for feature items — let content sit directly on the canvas
- Do not introduce a second brand color beyond violet — green and red are reserved for specific functional punctuation only
- Do not use web fonts — the system font stack is the entire typographic identity
- Do not use sharp corners (< 18px radius) on any container — the system operates in pill and soft-rectangle territory
- Do not add gradients to UI surfaces — the aurora gradient is reserved for the hero/brand zone only
- Do not use light-mode colors on the page surface — the entire site is dark, with white app screenshots providing the only light areas

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Void | `#05050b` | Absolute background — the deepest dark, barely visible at page edges |
| 1 | Midnight Canvas | `#1a1a1a` | Primary page surface where all text and content sit |
| 2 | Carbon | `#111111` | Embedded device frames and app screenshot backings |
| 3 | Graphite | `#212121` | List groupings and subtle content blocks |

## Elevation

The design is intentionally shadowless — no drop shadows, no glow effects on UI elements. Depth is communicated through surface value steps (void → canvas → carbon → graphite) and through 3D hero illustrations, never through CSS box-shadow. This flatness keeps the interface quiet so the illustrated mascots and product screenshots can carry all visual energy.

## Imagery

The visual language is dominated by high-fidelity 3D renders with a cosmic/space theme: a white elephant mascot (Ivory's signature character) floating in a purple nebula, a red-and-white rocket with glowing blue engine exhaust, and a ringed planet in the background. These renders are photorealistic with soft studio lighting and are the page's primary visual draw. App screenshots are shown in light-mode (white app UI) inside native device frames (iPhone, iPad, Mac) — the light screenshots pop dramatically against the dark page. Feature section icons are small 3D emoji-style illustrations (yellow apple, purple headphones, green widget, red bell) rendered with soft gradients and depth. There is no photography, no abstract line art, no flat illustration — the visual system is 3D render only.

## Layout

Single centered column with max-width ~900px. The page opens with a full-viewport 3D hero illustration with the Ivory logo and wordmark centered at the bottom. Below, a narrow paragraph block introduces the product with inline violet highlights. The middle section showcases three device screenshots (iPad + iPhone + Mac) side by side, slightly overlapping, on the dark canvas. The lower section is a 2-column feature grid with generous row gaps. Navigation is minimal — likely a top bar with a few links and a CTA button. The overall rhythm is: dark hero → centered text → product visuals → feature grid, with no section dividers, no alternating backgrounds, and no card containers — just generous whitespace between content blocks on one continuous dark surface.

## Agent Prompt Guide

**Quick Color Reference**
- text: #ffffff
- background: #1a1a1a
- border: #666666
- accent (links/icons): #ba94ff
- brand surface: #7047ba
- primary action: no distinct CTA color

**3-5 Example Component Prompts**

1. **Hero Illustration Zone**: Full-width section on #1a1a1a background, 80px section gap above and below. Centered at the bottom: Ivory wordmark at 36px weight 300 in #ffffff, with a small 3D elephant mascot illustration floating in the upper-right area. No shadows, no borders.

2. **Product Intro Paragraph**: Centered block, max-width 700px, 20px weight 400, line-height 1.5, color #c3c3c3. Inline emphasis words rendered in #ba94ff (e.g., 'award-winning', 'designed to delight'). 80px section gap below.

3. **App Screenshot Showcase**: Three device frames side by side (iPad left, iPhone center, Mac right) on #1a1a1a background. Device frames use native chrome. App screenshots are light-mode (white backgrounds) showing a social media timeline. No shadows on frames. 80px section gap below.

4. **Feature Grid**: 2-column grid on #1a1a1a, 30px row gap, 20px column gap. Each cell: 32px colored 3D icon at top (yellow apple, purple headphones, green widget, red bell), feature name in #ffffff weight 600 at 21px, description in #a3a3a3 at 16px. No card background, no border, no padding.

No distinct primary action color was observed; use the extracted neutral button treatments instead of inventing a filled CTA color.

## Gradient System

The system uses exactly one brand gradient: linear-gradient(to right bottom, #6cb0ff, #f747ff) — a blue-to-magenta aurora sweep. This gradient appears on the Ivory logo treatment, the favicon, and select 3D icon backgrounds. It should never be applied to UI surfaces (buttons, cards, backgrounds). The gradient is a brand mark, not a styling tool.

## Similar Brands

- **1Password** — Same dark-canvas product showcase with single-color accent threading through links and icons, generous centered column layout, and system-font typography
- **Proton Mail** — Dark mode with deep purple/violet brand color, flat UI without shadows, 3D hero illustrations, and pill-shaped interactive elements
- **Linear** — Dark product page with one vivid accent color (violet/blue), system-font-first typography, spacious density, and no card elevation
- **Setapp** — Dark canvas showcasing Mac/iOS app screenshots on native device frames with minimal UI chrome and a single bright accent
- **Iconfinder** — Dark marketing site with 3D-rendered illustrations and icons as the primary visual content, flat UI underneath, generous whitespace

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-void: #05050b;
  --color-midnight-canvas: #1a1a1a;
  --color-carbon: #111111;
  --color-graphite: #212121;
  --color-pure-white: #ffffff;
  --color-ash: #c3c3c3;
  --color-smoke: #b3b3b3;
  --color-dim: #a3a3a3;
  --color-fog: #999999;
  --color-pewter: #666666;
  --color-silver: #cccccc;
  --color-signal-violet: #7047ba;
  --color-glow-violet: #ba94ff;
  --color-pulse-violet: #9466e7;
  --color-deep-violet: #4c278e;
  --color-twilight-violet: #301e4f;
  --color-lilac-mist: #deccff;
  --color-periwinkle: #cdd4f8;
  --color-neon-green: #74ec5a;
  --color-alarm-red: #ff3543;
  --color-aurora-gradient: #7b48ff;
  --gradient-aurora-gradient: linear-gradient(to right bottom, #6cb0ff, #f747ff);

  /* Typography — Font Families */
  --font-apple-system: '-apple-system', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-body: 16px;
  --leading-body: 1.7;
  --text-body-lg: 18px;
  --leading-body-lg: 1.6;
  --text-subheading: 21px;
  --leading-subheading: 1.4;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.3;
  --text-heading: 28px;
  --leading-heading: 1.2;
  --text-heading-lg: 32px;
  --leading-heading-lg: 1.2;
  --text-display: 36px;
  --leading-display: 1.1;

  /* Typography — Weights */
  --font-weight-light: 300;
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-12: 12px;
  --spacing-20: 20px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-60: 60px;
  --spacing-80: 80px;
  --spacing-144: 144px;
  --spacing-216: 216px;

  /* Layout */
  --page-max-width: 900px;
  --section-gap: 80px;
  --card-padding: 20px;
  --element-gap: 20px;

  /* Border Radius */
  --radius-2xl: 18px;
  --radius-3xl: 40px;

  /* Named Radii */
  --radius-icons: 40px;
  --radius-lists: 18px;
  --radius-buttons: 40px;

  /* Surfaces */
  --surface-void: #05050b;
  --surface-midnight-canvas: #1a1a1a;
  --surface-carbon: #111111;
  --surface-graphite: #212121;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-void: #05050b;
  --color-midnight-canvas: #1a1a1a;
  --color-carbon: #111111;
  --color-graphite: #212121;
  --color-pure-white: #ffffff;
  --color-ash: #c3c3c3;
  --color-smoke: #b3b3b3;
  --color-dim: #a3a3a3;
  --color-fog: #999999;
  --color-pewter: #666666;
  --color-silver: #cccccc;
  --color-signal-violet: #7047ba;
  --color-glow-violet: #ba94ff;
  --color-pulse-violet: #9466e7;
  --color-deep-violet: #4c278e;
  --color-twilight-violet: #301e4f;
  --color-lilac-mist: #deccff;
  --color-periwinkle: #cdd4f8;
  --color-neon-green: #74ec5a;
  --color-alarm-red: #ff3543;
  --color-aurora-gradient: #7b48ff;

  /* Typography */
  --font-apple-system: '-apple-system', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-body: 16px;
  --leading-body: 1.7;
  --text-body-lg: 18px;
  --leading-body-lg: 1.6;
  --text-subheading: 21px;
  --leading-subheading: 1.4;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.3;
  --text-heading: 28px;
  --leading-heading: 1.2;
  --text-heading-lg: 32px;
  --leading-heading-lg: 1.2;
  --text-display: 36px;
  --leading-display: 1.1;

  /* Spacing */
  --spacing-12: 12px;
  --spacing-20: 20px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-60: 60px;
  --spacing-80: 80px;
  --spacing-144: 144px;
  --spacing-216: 216px;

  /* Border Radius */
  --radius-2xl: 18px;
  --radius-3xl: 40px;
}
```
