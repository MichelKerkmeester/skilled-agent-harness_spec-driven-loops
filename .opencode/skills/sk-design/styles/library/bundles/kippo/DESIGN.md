# Kippo — Style Reference
> Pixel arcade boot screen in a black void. Monospace glyphs traced in white neon against a pure black void, with a single hot-pink power-up color that should feel rare and electric when it appears.

**Theme:** dark

Kippo is a neon-on-black arcade: a pitch-black canvas where every element is drawn as a thin white outline or rendered in a single hot magenta accent. Typography is exclusively monospace (Source Code Pro) at every size — a deliberate shout to the gamer subculture that refuses to be dressed up in a humanist sans. Display text sits in all-caps with generous tracking, evoking a CRT boot screen or a chat log header. Cards are transparent panels defined only by a 1px white border, never by fill or shadow — the page reads as a wireframe brought to life. The single chromatic accent (#ee1f66) is rationed sparingly: the word 'GAMERS', CTA buttons, and small badges — making each pink element feel like a power-up on a dark screen.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Kippo Pink | `#ee1f66` | `--color-kippo-pink` | Primary action background, accent headings, active badges — the only chromatic voice in the system, rationed to feel like a power-up rather than a brand wash |
| Void Black | `#000000` | `--color-void-black` | Page canvas, card backgrounds, image fills — the infinite dark that everything else floats on |
| Carbon | `#29292a` | `--color-carbon` | Elevated card surfaces and secondary panels — barely-distinguishable dark gray for cards that need to step forward from the black canvas |
| Ash | `#333333` | `--color-ash` | Subtle borders and dividers where white is too loud — a near-black separator for nested or secondary content |
| Ghost White | `#ffffff` | `--color-ghost-white` | Hairline borders, dividers, input outlines, and card edges on light surfaces. |
| Sunset Gradient | `linear-gradient(to right, #ffc400, #ff33e0)` | `--color-sunset-gradient` | Gradient start stop — used only on the warm-to-cool decorative band behind the phone mockup and small accent elements |
| Terminal Cyan | `linear-gradient(to right, #33beff, #33ffb8)` | `--color-terminal-cyan` | Gradient start for cool accents — used sparingly in decorative gradient bands |

## Tokens — Typography

### Source Code Pro — Sole typeface — used for every text element from nav links to body copy to display headlines. Monospace at 42px/weight 700 with 0.3–0.5em tracking in all-caps creates a retro arcade marquee feel; at 16px/weight 400 it reads as clean monospace body. The slashed-zero feature is enabled, reinforcing the terminal/CRT aesthetic. · `--font-source-code-pro`
- **Substitute:** JetBrains Mono, Fira Code, IBM Plex Mono
- **Weights:** 400, 600, 700
- **Sizes:** 10px, 12px, 16px, 42px
- **Line height:** 1.19, 1.67, 1.88, 2.00
- **Letter spacing:** 0.083em at 12px, 0.1em at 12px, 0.119em at 42px, 0.313–0.5em at 42px (display caps)
- **OpenType features:** `"zero"`
- **Role:** Sole typeface — used for every text element from nav links to body copy to display headlines. Monospace at 42px/weight 700 with 0.3–0.5em tracking in all-caps creates a retro arcade marquee feel; at 16px/weight 400 it reads as clean monospace body. The slashed-zero feature is enabled, reinforcing the terminal/CRT aesthetic.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 10px | 1.2 | 0.08px | `--text-caption` |
| body | 16px | 1.88 | — | `--text-body` |
| display | 42px | 1.19 | 0.5px | `--text-display` |

## Tokens — Spacing & Shapes

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 5 | 5px | `--spacing-5` |
| 10 | 10px | `--spacing-10` |
| 15 | 15px | `--spacing-15` |
| 20 | 20px | `--spacing-20` |
| 25 | 25px | `--spacing-25` |
| 30 | 30px | `--spacing-30` |
| 35 | 35px | `--spacing-35` |
| 50 | 50px | `--spacing-50` |
| 100 | 100px | `--spacing-100` |
| 128 | 128px | `--spacing-128` |
| 150 | 150px | `--spacing-150` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 15px |
| icons | 50px |
| images | 15px |
| buttons | 10px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 100px
- **Card padding:** 30px
- **Element gap:** 15px

## Components

### Primary CTA Button
**Role:** Filled magenta action — the only solid-fill button in the system

Background #ee1f66, text #ffffff, Source Code Pro 12px weight 700, letter-spacing 0.1em, uppercase. Padding 10px 15px. Border-radius 10px. No border. This is the only button that uses fill rather than outline.

### Ghost Outline Button
**Role:** Secondary actions, nav-adjacent controls

Background transparent, border 1px #ffffff, text #ffffff, Source Code Pro 12px weight 700, uppercase, tracking 0.1em. Padding 10px 15px. Radius 10px. Used wherever a secondary or less-urgent action is needed.

### Navigation Link
**Role:** Top-bar nav items

Text #ffffff, Source Code Pro 12px weight 700, uppercase, letter-spacing 0.1em. No underline by default. Bottom border 1px transparent; on hover/active, border becomes #ee1f66 to signal current page with the accent.

### Outlined Card
**Role:** Content container — feature blocks, media tiles, info panels

Background #000000 or #29292a, border 1px #ffffff, radius 15px. Padding 30px. No shadow, no fill gradient — the border IS the card. This is the dominant card pattern; do not introduce filled or shadowed variants.

### Press Logo Strip
**Role:** Social proof band

Horizontal row of publication logos (Mashable, TechCrunch, etc.) in a single line, separated by generous whitespace. Logos rendered in their native brand colors (blue Mashable, green TechCrunch, red VentureBeat) on the black canvas — this is the one section where chromatic variety is tolerated, and it's because the logos ARE the content.

### App Store Badge
**Role:** Download CTA

Standard Apple App Store / Google Play badges, white on black. Source Code Pro used for any adjacent helper text. Sized at approximately 120×40px, with no rounding beyond the badge's native corners.

### QR Code Block
**Role:** Alternative download entry

White QR code on a black 1px-bordered square panel. No padding beyond the border-to-code margin. Renders as a sharp bitmap — no anti-aliasing or shadow.

### Phone Mockup Frame
**Role:** Hero product showcase

iPhone device frame with rounded corners ~40px, rendered on a gradient backdrop (sunset gold → magenta). The phone screen shows the app UI with its own internal color system (blue card, yellow accents). The device frame itself uses white outlines on black.

### Code-Style Card Stack
**Role:** Feature illustration — profile cards fanned out

Overlapping rounded-rectangle cards (radius ~15px) showing user profile photos, stacked at slight offsets to create depth. Each card has a thin white border. The overlap replaces the need for shadows — depth through layering, not elevation.

### Code Block / Terminal Snippet
**Role:** Feature explainer — product UI preview

Terminal-style block with monospace text, dark background (#29292a), and syntax-like coloring. Uses the Source Code Pro 'zero' feature to distinguish 0 from O. Often paired with a small accent border or pink highlight.

### Logo Wordmark
**Role:** Brand identifier in nav

'KIPPO' in Source Code Pro bold/700, all-caps, white. Letter-spacing 0.1–0.2em. Renders crisp on the black nav bar with no additional treatment.

### Section Heading Pair
**Role:** Section-level headlines

Two-tone display headline: first word/key noun in #ee1f66, rest in #ffffff. Source Code Pro 42px weight 700, uppercase, letter-spacing 0.3–0.5em, line-height 1.19. The two-color split within a single sentence is a signature Kippo device — don't use it for body or subheadings.

### App Icon Tile
**Role:** Bottom nav icons within phone mockup

Small icons (32–40px) inside the phone's bottom tab bar, rendered in a mix of pink (#ee1f66) for active state and white/gray for inactive. Radius 50px (circular touch targets).

## Do's and Don'ts

### Do
- Use Source Code Pro for every text element — body, headings, buttons, nav, labels. No secondary font.
- Set all UI text to uppercase with letter-spacing 0.1em minimum; display headlines should reach 0.3–0.5em tracking.
- Define cards with a 1px #ffffff border on a #000000 or #29292a fill — never with shadow, never with a colored fill.
- Reserve #ee1f66 for the primary CTA background, the accent word in two-tone display headlines, and active/border-current-page states. Use it no more than once per viewport section.
- Use 10px radius for buttons and tags, 15px for cards and images, 50px for icon buttons. Never exceed 15px on rectangular surfaces.
- Maintain generous vertical breathing room: 100–150px between major sections, 30px inside cards, 15px between inline elements.
- Enable the 'zero' font-feature on Source Code Pro so the numeral 0 is slashed — it reinforces the terminal identity.

### Don't
- Don't introduce a second typeface (no Inter, no Helvetica, no sans-serif fallback for body). Monospace-only is the identity.
- Don't fill cards with color, gradient, or image. Cards are transparent panels — the border is the card.
- Don't use drop shadows for elevation. Depth comes from overlapping layers and outline contrast, never from blur.
- Don't dilute #ee1f66 by using it for body text, borders on non-action elements, or large background areas. It must remain rare.
- Don't use border-radius larger than 15px on rectangular surfaces, and never use fully-rounded pill shapes on buttons (10px max).
- Don't mix light and dark themes — this is a dark-only system. No white-background sections, no theme toggle.
- Don't use red, green, or yellow for semantic states (success/error/warning) — those colors are decorative only in this system, and the dark canvas + white text + single pink accent is the entire signal vocabulary.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Void Canvas | `#000000` | Page-level background — the infinite black everything else floats on |
| 1 | Carbon Panel | `#29292a` | Elevated card surface, barely stepping forward from the void |
| 2 | Neon Border | `#ffffff` | 1px white outlines that define transparent cards without filling them |

## Imagery

Imagery is almost entirely product-internal: phone mockups showing the app UI, and stacked profile-card illustrations that function as feature explainers. The only 'real' photography is inside the phone mockup screens (user profile photos of people, shown as small rounded thumbnails). No full-bleed lifestyle photography, no decorative illustrations outside the product, no abstract graphics. The phone mockup sits on a gradient backdrop (gold → magenta) that is the single moment of color richness in the system. Press logos in the social-proof band are the one place external brand colors appear, tolerated as content rather than decoration.

## Layout

Single-column, max-width ~1200px centered layout on a pure black canvas. The hero is a two-column split: left side holds the two-tone display headline, subtitle, download badges, and QR code; right side holds the phone mockup on a gradient backdrop. Below the hero, a full-width press logo strip repeats logos in two stacked rows. Further down, sections alternate between two-column text+visual blocks (text-left/image-right) and centered single-column feature stacks. Cards are arranged in single rows, not multi-column grids. Navigation is a single horizontal bar pinned at the top: logo left, three uppercase links right, all within a thin white-bordered pill or rectangle. The overall rhythm is spacious — 100–150px between major sections, with the dark canvas absorbing visual weight and making the few colored elements feel deliberate.

## Agent Prompt Guide

**Quick Color Reference**
- text: #ffffff
- background: #000000
- surface (elevated card): #29292a
- border: #ffffff (1px)
- accent / primary action: #ee1f66 (filled action)

**Example Component Prompts**
1. Build a hero section on #000000. Left column: two-tone display headline in Source Code Pro 42px weight 700 uppercase, letter-spacing 0.5em, line-height 1.19 — first word in #ee1f66, rest in #ffffff. Subtitle in Source Code Pro 16px weight 400, #ffffff, line-height 1.88. Below: App Store and Google Play badges side by side, then a QR code in a 1px #ffffff-bordered square. Right column: iPhone mockup (radius 40px) on a gradient backdrop (linear-gradient(to right, #ffc400, #ff33e0)).

2. Build a press logo strip. Black canvas, centered max-width 1200px. Label 'AS SEEN ON' in Source Code Pro 12px weight 700 uppercase, tracking 0.1em, #ffffff. Below: a single horizontal row of publication logos (Mashable in its blue, TechCrunch in green, etc.) spaced 60–80px apart. No borders, no card background — logos float on the void.

3. Build an outlined feature card. Background #000000, border 1px #ffffff, radius 15px, padding 30px. Title in Source Code Pro 16px weight 700 uppercase, tracking 0.1em, #ffffff. Body in Source Code Pro 16px weight 400, #ffffff, line-height 1.88. No shadow, no fill, no gradient.

4. Build a primary CTA button. Background #ee1f66, text #ffffff, Source Code Pro 12px weight 700 uppercase, letter-spacing 0.1em, padding 10px 15px, border-radius 10px, no border. This is the only filled button in the system — every other button is a white outline on transparent.

5. Build a section heading pair. Source Code Pro 42px weight 700 uppercase, letter-spacing 0.3–0.5em, line-height 1.19. First key noun in #ee1f66, remaining words in #ffffff. The two-color split within one sentence is a Kippo signature — do not apply it to body text or subheadings.

## Elevation Philosophy

Kippo has no shadows. Depth is created entirely through layering (overlapping profile cards, the phone mockup on a gradient plane) and through outline contrast (a 1px white border on a black fill is louder than any shadow). This is an intentional anti-convention: most dark-mode UIs rely on subtle elevation shadows to separate surfaces, but Kippo's arcade-wireframe language treats the border as the structural element and shadows as unnecessary noise. When stacking elements, overlap them with a small offset rather than adding drop-shadow or blur.

## Gradient System

Gradients are decorative-only and used in exactly two places: (1) the backdrop behind the hero phone mockup — a warm gold-to-magenta sweep (linear-gradient(to right, #ffc400, #ff33e0)) that frames the device like neon signage; (2) a cool cyan-to-mint variant (linear-gradient(to right, #33beff, #33ffb8)) for secondary decorative bands. Never apply gradients to text, buttons, or card backgrounds. Gradients in this system are atmosphere, not chrome.

## Similar Brands

- **Twitch** — Same dark-canvas + monospace-leaning identity with a single vivid purple accent, gaming subculture coded through type and color restraint
- **HBO Max (dark mode)** — Pure-black background with thin outlined cards and minimal chromatic use — the outline-as-card approach over filled surfaces
- **Vercel** — Dark-mode developer brand with monospace accents, single accent color, and a preference for outlined/ghost controls over filled ones
- **Arc browser** — Sharp outlined UI elements, generous letter-spacing in uppercase labels, and a commitment to flat surfaces over shadowed elevation
- **Retro arcade boot screens (visual reference)** — The CRT-terminal monospace at wide tracking, pure-black void, and rationed neon accent are direct references to 80s/90s arcade attract-mode typography

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-kippo-pink: #ee1f66;
  --color-void-black: #000000;
  --color-carbon: #29292a;
  --color-ash: #333333;
  --color-ghost-white: #ffffff;
  --color-sunset-gradient: #ffc400;
  --gradient-sunset-gradient: linear-gradient(to right, #ffc400, #ff33e0);
  --color-terminal-cyan: #33beff;
  --gradient-terminal-cyan: linear-gradient(to right, #33beff, #33ffb8);

  /* Typography — Font Families */
  --font-source-code-pro: 'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.2;
  --tracking-caption: 0.08px;
  --text-body: 16px;
  --leading-body: 1.88;
  --text-display: 42px;
  --leading-display: 1.19;
  --tracking-display: 0.5px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-5: 5px;
  --spacing-10: 10px;
  --spacing-15: 15px;
  --spacing-20: 20px;
  --spacing-25: 25px;
  --spacing-30: 30px;
  --spacing-35: 35px;
  --spacing-50: 50px;
  --spacing-100: 100px;
  --spacing-128: 128px;
  --spacing-150: 150px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 100px;
  --card-padding: 30px;
  --element-gap: 15px;

  /* Border Radius */
  --radius-lg: 10px;
  --radius-xl: 15px;
  --radius-3xl: 28px;
  --radius-full: 50px;

  /* Named Radii */
  --radius-cards: 15px;
  --radius-icons: 50px;
  --radius-images: 15px;
  --radius-buttons: 10px;

  /* Surfaces */
  --surface-void-canvas: #000000;
  --surface-carbon-panel: #29292a;
  --surface-neon-border: #ffffff;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-kippo-pink: #ee1f66;
  --color-void-black: #000000;
  --color-carbon: #29292a;
  --color-ash: #333333;
  --color-ghost-white: #ffffff;
  --color-sunset-gradient: #ffc400;
  --color-terminal-cyan: #33beff;

  /* Typography */
  --font-source-code-pro: 'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.2;
  --tracking-caption: 0.08px;
  --text-body: 16px;
  --leading-body: 1.88;
  --text-display: 42px;
  --leading-display: 1.19;
  --tracking-display: 0.5px;

  /* Spacing */
  --spacing-5: 5px;
  --spacing-10: 10px;
  --spacing-15: 15px;
  --spacing-20: 20px;
  --spacing-25: 25px;
  --spacing-30: 30px;
  --spacing-35: 35px;
  --spacing-50: 50px;
  --spacing-100: 100px;
  --spacing-128: 128px;
  --spacing-150: 150px;

  /* Border Radius */
  --radius-lg: 10px;
  --radius-xl: 15px;
  --radius-3xl: 28px;
  --radius-full: 50px;
}
```
