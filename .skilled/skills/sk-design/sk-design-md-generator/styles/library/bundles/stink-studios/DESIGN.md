# Stink Studios — Style Reference
> cinema studio at midnight — the projector hums, the room is black, only the reel glows.

**Theme:** dark

Stink Studios operates as a cinematic canvas: a near-monochrome world where black absorbs everything except the work, and typography carries every structural decision. The visual language is deliberately austere — no UI chrome, no decorative gradients on controls, no colored buttons pulling attention from the reels. Instead, a film-studio hero (blue-lit, full-bleed) establishes the world, large confident headlines in negative-tracked Helvetica and Times New Roman do the talking, and warmth arrives only through the work itself. The system is built for an AI agent to produce gallery-like pages where large type and full-bleed media do the heavy lifting, and every interactive element recedes into a flat black plane.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Void | `#000000` | `--color-void` | Neutral form states, badge text, and quiet UI feedback where color should stay understated. Do not promote it to the primary CTA color |
| Bone | `#ffffff` | `--color-bone` | Primary text, heading strokes, nav links, icon strokes, badge fills, logo type — the only high-contrast value in the system |
| Soot | `#050505` | `--color-soot` | Subtle tonal break from pure black for nested surfaces and hairline borders that need to feel present without breaking the dark mode |
| Ember Coral | `#e1695e` | `--color-ember-coral` | Accent warmth for marquee display moments, logo gradient highlight, and select project card color treatments — borrowed from the work, never applied to UI chrome |
| Burnt Sienna | `#573332` | `--color-burnt-sienna` | Deep warm surface for warm-toned project cards and content imagery containers — the shadow side of the coral accent |

## Tokens — Typography

### Helvetica — Primary workhorse — body copy at 16px/400, secondary headings at 23px/400, nav and links at 16px/400, and the massive 52px/300 hero logo treatment. Weight 300 is the default for large display: whisper-thin against the heavy black canvas creates a neon-on-velvet tension. · `--font-helvetica`
- **Substitute:** Helvetica Neue, Inter, Arial
- **Weights:** 300, 400, 700
- **Sizes:** 16, 19, 23, 52
- **Line height:** 1.15-1.30 body, 0.90-1.00 display
- **Letter spacing:** -0.04em at 52px (-2.08px), -0.03em at 23px (-0.69px), -0.02em at 19px (-0.38px), tight tracking throughout
- **Role:** Primary workhorse — body copy at 16px/400, secondary headings at 23px/400, nav and links at 16px/400, and the massive 52px/300 hero logo treatment. Weight 300 is the default for large display: whisper-thin against the heavy black canvas creates a neon-on-velvet tension.

### Times New Roman — Display serif for editorial pull-quotes and manifesto text — the 60px size with -0.05em tracking creates a fashion-magazine weight that contrasts Helvetica's geometric neutrality. Used sparingly for sentences that need gravitas. · `--font-times-new-roman`
- **Substitute:** Playfair Display, GT Super, Lora
- **Weights:** 400
- **Sizes:** 60
- **Line height:** 1.00
- **Letter spacing:** -0.05em at 60px (-3.0px)
- **Role:** Display serif for editorial pull-quotes and manifesto text — the 60px size with -0.05em tracking creates a fashion-magazine weight that contrasts Helvetica's geometric neutrality. Used sparingly for sentences that need gravitas.

### Courier New — Monospace for tags, badges, index numbers, and micro-labels — the 0.10em positive tracking turns utility text into graphic texture, like film slate markings · `--font-courier-new`
- **Substitute:** JetBrains Mono, IBM Plex Mono, Space Mono
- **Weights:** 400
- **Sizes:** 14
- **Line height:** 1.43
- **Letter spacing:** 0.10em at 14px (1.4px)
- **Role:** Monospace for tags, badges, index numbers, and micro-labels — the 0.10em positive tracking turns utility text into graphic texture, like film slate markings

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 14px | 1.43 | 1.4px | `--text-caption` |
| body | 16px | 1.3 | — | `--text-body` |
| subheading | 19px | 1.15 | -0.38px | `--text-subheading` |
| heading-sm | 23px | 1 | -0.69px | `--text-heading-sm` |
| heading | 52px | 0.9 | -2.08px | `--text-heading` |
| display | 60px | 1 | -3px | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 16 | 16px | `--spacing-16` |
| 20 | 20px | `--spacing-20` |
| 60 | 60px | `--spacing-60` |
| 180 | 180px | `--spacing-180` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 0px |
| inputs | 10px |
| buttons | 0px |

### Layout

- **Section gap:** 60-180px
- **Card padding:** 0px
- **Element gap:** 20px

## Components

### Full-Bleed Hero Reel
**Role:** Opening cinematic frame

100vw × 100vh image or video, no overlay, no gradient. Logo sits top-left or top-center in 52px Helvetica 300 white with optional warm gold-to-white gradient on accent characters. Navigation anchors to bottom-right corner at 16px/400 white, 20px gap between links, no background or border.

### Manifesto Statement Block
**Role:** Editorial typographic section

Black #000000 background, 60px Times New Roman 400 white text at -3px tracking, left-aligned with generous left margin (60px+). Line-height 1.00 keeps the serif tight. No icon, no border, no decoration — the text IS the design.

### Work Grid Card
**Role:** Project showcase tile

No border, no radius, no padding. Full-bleed image filling its grid cell. Project title overlays bottom-left in 19px Helvetica 400 white when the image is dark, or in black when the image is light. No hover lift or shadow — cards simply swap or dim on interaction.

### Bottom-Right Nav Cluster
**Role:** Primary site navigation

Fixed or anchored to the bottom-right of the viewport. 16px Helvetica 400 white links — 'Work', 'About', 'News', 'Contact' — separated by 20px gap. No background, no border, no hamburger. Optionally followed by a small circular icon button (16px diameter, 10px radius).

### Monospace Tag
**Role:** Project metadata label

14px Courier New 400 white, 0.10em positive tracking, no background or border. Sits flush above project titles as a category index. Functions as graphic texture more than information design.

### Ghost Link
**Role:** Inline text link

16-19px Helvetica 400 white, underline removed by default, 1px white bottom border appears on hover. No color shift, no fill — the border treatment alone signals interactivity.

### Full-Bleed Image Block
**Role:** Immersive project frame

100vw width, variable height, 0px radius, no caption or overlay. Image bleeds to all four edges. Used between text sections to punctuate the editorial rhythm.

### Circular Icon Button
**Role:** Compact utility trigger

10px border-radius (nearly circular at small sizes), 1px white border on #000000 fill, 16px white icon centered. Used for theme toggle or close actions in the corner of overlays.

### Text Input
**Role:** Form field on dark canvas

10px border-radius, 1px #050505 border, 16px horizontal padding, 16px Helvetica 400 white text on #000000 fill. Placeholder in #050505. No focus glow — focus is signaled by border thickening to 1px white.

## Do's and Don'ts

### Do
- Use 52px Helvetica weight 300 for any logo or hero wordmark, with -2.08px letter-spacing to compress the caps into a cinematic block
- Reserve 60px Times New Roman weight 400 for editorial statements and manifesto copy — never for navigation, labels, or body
- Apply 0.10em positive letter-spacing to all Courier New 14px text (tags, badges, index numbers) to read as slate-marking texture
- Let the page canvas be #000000 universally — do not introduce light section bands; the system is monochrome by intention
- Use 20px gap between navigation links and 60px minimum margin-top between major editorial sections
- Set every image to full-bleed (100vw) with 0px radius when it is the section's primary content
- Signal interactivity through a 1px white bottom border appearing on hover — never through color shifts or background fills

### Don't
- Do not introduce colored buttons, colored backgrounds, or gradient UI elements — the accent palette belongs to the work, not the chrome
- Do not use box-shadow or elevation on cards, buttons, or navigation — this system is deliberately flat; depth comes from imagery, not stacking
- Do not use rounded corners on cards or work tiles — 0px radius is the signature; rounded containers would break the cinematic frame
- Do not combine the serif display (Times New Roman) with the monospace (Courier New) on the same line or within the same component
- Do not add light-mode toggle, theme switcher UI, or alternate color schemes — dark is the only mode
- Do not use font-weight above 700 for Helvetica — the system lives in the 300-700 range; black weight would break the whisper-thin display logic
- Do not pad work cards with internal whitespace — imagery bleeds to the cell edges, and titles overlay the image directly

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Void | `#000000` | Universal page canvas — every section sits on absolute black |
| 1 | Soot | `#050505` | Nested containers and form fields needing barely-visible separation from canvas |

## Elevation

No shadows, no elevation tokens, no z-axis depth. The design is intentionally flat — the only layering is visual (image overlapping type, or text overlaying a dark photographic region for legibility). Components do not lift on hover; they swap, dim, or reveal a border. Depth is created by content scale and contrast, not by surface separation.

## Imagery

Full-bleed cinema-set photography and behind-the-scenes production stills dominate the hero — moody blue-lit studio environments with director's chairs, ladders, and lighting rigs. Work grid tiles are large-format project stills: outdoor advertising photography (the pink/magenta HR & Payroll transit poster), urban street scenes with branded signage (Canva storefront), and lifestyle editorial crops. Imagery is always unframed, 0px radius, edge-to-edge. No illustrations, no 3D renders, no abstract graphics. Icons are minimal: a single small circular toggle glyph in the nav cluster. Photography treatment is high-contrast and color-saturated — the projects are where the chroma lives, never the UI.

## Layout

Full-bleed single-column composition with editorial vertical rhythm. The page opens with a 100vh cinema-set hero image with a giant wordmark overlaid. Navigation is not a top bar — it is a bottom-right anchored link cluster, giving the hero maximum negative space. Below the fold, the layout shifts to a wide single column of typographic manifesto blocks (60px Times New Roman) separated by 60-180px vertical gaps. The work showcase is a 2-column grid of full-bleed project stills, no gutters or card padding. No sidebar, no mega-menu, no sticky header. Every section bleeds to both viewport edges. The overall density is spacious: a handful of large elements per screen, each given room to breathe against the black canvas.

## Agent Prompt Guide

**Quick Color Reference**
- text: #ffffff
- background: #000000
- border: #050505
- accent: #e1695e (project content only, not UI)
- primary action: no distinct CTA color

**Example Component Prompts**

1. **Hero with wordmark**: Full-viewport (100vw × 100vh) cinematic image as background. Centered or top-left wordmark at 52px Helvetica weight 300 in #ffffff with -2.08px letter-spacing and 0.90 line-height. No overlay gradient, no button — just the image and the type.

2. **Manifesto section**: #000000 background, 60px Times New Roman weight 400 in #ffffff at -3px letter-spacing, left-aligned with 60px left margin, 1.00 line-height. Single declarative sentence, 2-3 lines tall. No icon, no border, no supporting media.

3. **Work grid tile**: Full-bleed image filling a 50vw × auto cell with 0px radius. Bottom-left overlay text in 19px Helvetica 400 #ffffff at -0.38px letter-spacing. No padding, no border, no shadow. Caption in 14px Courier New 400 #ffffff at 1.4px letter-spacing above the title.

4. **Bottom-right nav**: Fixed position bottom-right, 32px from edges. Links at 16px Helvetica 400 #ffffff separated by 20px gap: 'Work', 'About', 'News', 'Contact'. 1px #ffffff bottom border appears on hover. Followed by a 16px circular icon button with 10px radius and 1px #ffffff border.

5. **Ghost link in body copy**: 16px Helvetica 400 #ffffff inline within a paragraph. No underline by default. On hover, 1px #ffffff bottom border fades in over 200ms.

## Typography Attitude

Three typefaces, three registers: Helvetica is the neutral voice (body, nav, secondary headings), Times New Roman is the editorial voice (manifesto, pull-quotes, display statements), Courier New is the texture voice (tags, badges, index numbers, monospace labels). The negative letter-spacing on display sizes (-2.08px at 52px, -3.0px at 60px) compresses letterforms into a cinematic block — the opposite of the airy, loose tracking common in tech sites. The positive 0.10em tracking on Courier New pushes it wide, making 14px monospace read as graphic ornament rather than data.

## Color Discipline

The UI is strictly black-and-white. The #e1695e coral and #573332 burnt sienna are not design tokens for buttons, badges, or interactive elements — they are the color of the work itself (the pink poster, the warm street scene). An AI agent should never paint a button coral. Coral appears only when the work contains coral, and even then it is content, not chrome. This discipline is what makes the imagery feel curated rather than decorated.

## Similar Brands

- **Pentagram** — Same editorial confidence — large serif and sans display type on near-monochrome backgrounds, full-bleed project imagery, minimal navigation, and a deliberate rejection of UI decoration in favor of letting the work breathe
- **Buck (buck.co)** — Dark-mode agency site with a single full-bleed hero reel, bottom-corner minimal nav, large negative-tracked type for section headers, and content grids that let motion work speak without colored UI chrome
- **Gunnercooke** — Austere black canvas with white-only typography, no card backgrounds or borders, work showcased as full-bleed image tiles, and a typographic-first hierarchy that treats copy as the primary design element
- **Manual (manual.co)** — Creative agency that uses cinematic full-bleed video heroes, serif editorial pull-quotes, and a flat dark interface where the only visual structure comes from type scale and generous whitespace
- **Locomotive (locomotive.ca)** — Dark-canvas portfolio site with zero-radius image containers, oversized display headlines in negative tracking, and a nav that disappears into the layout rather than competing with the work

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-void: #000000;
  --color-bone: #ffffff;
  --color-soot: #050505;
  --color-ember-coral: #e1695e;
  --color-burnt-sienna: #573332;

  /* Typography — Font Families */
  --font-helvetica: 'Helvetica', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-times-new-roman: 'Times New Roman', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-courier-new: 'Courier New', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.43;
  --tracking-caption: 1.4px;
  --text-body: 16px;
  --leading-body: 1.3;
  --text-subheading: 19px;
  --leading-subheading: 1.15;
  --tracking-subheading: -0.38px;
  --text-heading-sm: 23px;
  --leading-heading-sm: 1;
  --tracking-heading-sm: -0.69px;
  --text-heading: 52px;
  --leading-heading: 0.9;
  --tracking-heading: -2.08px;
  --text-display: 60px;
  --leading-display: 1;
  --tracking-display: -3px;

  /* Typography — Weights */
  --font-weight-light: 300;
  --font-weight-regular: 400;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-4: 4px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-60: 60px;
  --spacing-180: 180px;

  /* Layout */
  --section-gap: 60-180px;
  --card-padding: 0px;
  --element-gap: 20px;

  /* Border Radius */
  --radius-lg: 10px;

  /* Named Radii */
  --radius-cards: 0px;
  --radius-inputs: 10px;
  --radius-buttons: 0px;

  /* Surfaces */
  --surface-void: #000000;
  --surface-soot: #050505;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-void: #000000;
  --color-bone: #ffffff;
  --color-soot: #050505;
  --color-ember-coral: #e1695e;
  --color-burnt-sienna: #573332;

  /* Typography */
  --font-helvetica: 'Helvetica', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-times-new-roman: 'Times New Roman', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-courier-new: 'Courier New', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.43;
  --tracking-caption: 1.4px;
  --text-body: 16px;
  --leading-body: 1.3;
  --text-subheading: 19px;
  --leading-subheading: 1.15;
  --tracking-subheading: -0.38px;
  --text-heading-sm: 23px;
  --leading-heading-sm: 1;
  --tracking-heading-sm: -0.69px;
  --text-heading: 52px;
  --leading-heading: 0.9;
  --tracking-heading: -2.08px;
  --text-display: 60px;
  --leading-display: 1;
  --tracking-display: -3px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-60: 60px;
  --spacing-180: 180px;

  /* Border Radius */
  --radius-lg: 10px;
}
```
