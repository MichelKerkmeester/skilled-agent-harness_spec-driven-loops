# Cards Against Humanity — Style Reference
> Scattered playing cards on a velvet game table — the design language is the game itself, not a wrapper around it.

**Theme:** dark

Cards Against Humanity uses a game-night table aesthetic: near-black canvas, white card surfaces scattered at chaotic angles, and a tight three-color accent system (signal red, royal violet, antique gold) applied as thick borders rather than fills. Typography is uniformly heavy — Helvetica Neue LT at weight 800 even for mid-size copy — treating the screen like a punchline card rather than a SaaS dashboard. Buttons are chunky pills with 2px inset borders that read as physical objects sitting on the felt, not flat UI controls. The card metaphor saturates everything: content blocks, decorative backgrounds, badges, even borders adopt card-like geometry. Density is spacious but the large display sizes (55-80px) keep the vertical rhythm from feeling airy — each line lands like a card being dealt.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Game Night Black | `#000000` | `--color-game-night-black` | Page background, card shadows, button borders, heading text on light surfaces |
| Card White | `#ffffff` | `--color-card-white` | Card surfaces, body text on dark, button borders, input fills |
| Signal Red | `#fe2f2f` | `--color-signal-red` | Primary accent border on cards and badges — the brand's loudest punctuation, used as outline not fill |
| Royal Violet | `#7333f1` | `--color-royal-violet` | Primary accent border on cards and badges — deep saturated purple carrying the brand's irreverent energy |
| Antique Gold | `#d7b73b` | `--color-antique-gold` | Primary accent border on cards and badges — warm yellow-gold that rounds out the three-color system |
| Lemon Card | `#fffe5b` | `--color-lemon-card` | Card face fill for highlighted playing cards in the scattered background |
| Lavender Card | `#ede5ff` | `--color-lavender-card` | Card face fill for pastel playing cards, soft purple surface |
| Cobalt Card | `#1b5bff` | `--color-cobalt-card` | Card face fill for blue playing cards, saturated blue accent surface |
| Sky Card | `#a0e9ff` | `--color-sky-card` | Card face fill for light blue playing cards |
| Bubblegum Card | `#ffa0f0` | `--color-bubblegum-card` | Card face fill for pink playing cards |
| Mint Card | `#b4ff91` | `--color-mint-card` | Card face fill for green playing cards |
| Tangerine Card | `#ff9559` | `--color-tangerine-card` | Card face fill for orange playing cards |

## Tokens — Typography

### Helvetica Neue LT — The site's sole typeface. Weight 800 dominates everything from body up through 80px display — this anti-hierarchy choice makes the brand feel like it's shouting a punchline rather than presenting information. Tight leading at display sizes (0.98–1.07) creates an impactful block, generous leading on body (2.0–2.86) lets the heavy weight breathe. No letter-spacing tricks; the geometry of Helvetica at 800 weight does all the work. · `--font-helvetica-neue-lt`
- **Substitute:** Helvetica, Arial, Inter (weight 800), Neue Haas Grotesk Display Pro
- **Weights:** 400, 800
- **Sizes:** 12, 14, 16, 20, 24, 28, 40, 55, 65, 80
- **Line height:** 0.98–2.86
- **Role:** The site's sole typeface. Weight 800 dominates everything from body up through 80px display — this anti-hierarchy choice makes the brand feel like it's shouting a punchline rather than presenting information. Tight leading at display sizes (0.98–1.07) creates an impactful block, generous leading on body (2.0–2.86) lets the heavy weight breathe. No letter-spacing tricks; the geometry of Helvetica at 800 weight does all the work.

### Helvetica Neue — Helvetica Neue — detected in extracted data but not described by AI · `--font-helvetica-neue`
- **Weights:** 700
- **Sizes:** 21px
- **Line height:** 1.38
- **Role:** Helvetica Neue — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 2 | — | `--text-caption` |
| body-sm | 14px | 2.1 | — | `--text-body-sm` |
| body | 16px | 2.38 | — | `--text-body` |
| subheading | 20px | 1.29 | — | `--text-subheading` |
| heading-sm | 24px | 1.25 | — | `--text-heading-sm` |
| heading | 28px | 1.3 | — | `--text-heading` |
| heading-lg | 40px | 1.07 | — | `--text-heading-lg` |
| display-sm | 55px | 1.05 | — | `--text-display-sm` |
| display | 65px | 1 | — | `--text-display` |
| display-lg | 80px | 0.98 | — | `--text-display-lg` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** spacious

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 12 | 12px | `--spacing-12` |
| 20 | 20px | `--spacing-20` |
| 24 | 24px | `--spacing-24` |
| 32 | 32px | `--spacing-32` |
| 40 | 40px | `--spacing-40` |
| 60 | 60px | `--spacing-60` |
| 100 | 100px | `--spacing-100` |
| 160 | 160px | `--spacing-160` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 13px |
| badges | 38px |
| inputs | 38px |
| buttons | 38px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| subtle | `rgb(0, 0, 0) 0px 0px 0px 2px inset` | `--shadow-subtle` |
| subtle-2 | `rgb(255, 255, 255) 0px 0px 0px 2px inset` | `--shadow-subtle-2` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 50px
- **Card padding:** 20px
- **Element gap:** 10px

## Components

### Playing Card (Core Content Unit)
**Role:** The fundamental content container — white rectangle with black text, used for both product cards and content blocks

White (#ffffff) background, 13–20px border-radius, 2px black (#000000) inset border, 20px padding. Black text at weight 800. Functions as both literal product imagery and as the site's content card metaphor. When used as decorative background elements, cards are rotated at various angles and offset to create a scattered-table composition.

### Outlined Pill Button (Primary)
**Role:** Main action button on dark backgrounds

Transparent fill on #000000 surface. White (#ffffff) 2px border, 38–64px border-radius (pill shape). Text: Helvetica Neue LT weight 800, 14–16px, #ffffff. Padding: 12px vertical, 32px horizontal. The 2px inset shadow creates the border — no stroke property used. Sits as a physical object, not a flat UI element.

### Outlined Pill Button (On Light)
**Role:** Action button on white card surfaces

Transparent fill on #ffffff surface. Black (#000000) 2px inset border, 38–64px radius. Text: #000000, weight 800, 14–16px. Same padding and geometry as the dark variant — only the color polarity inverts.

### Bordered Accent Card
**Role:** Featured card with chromatic border for emphasis

White or transparent fill with 2px border in one of the three brand accent colors (Signal Red #fe2f2f, Royal Violet #7333f1, or Antique Gold #d7b73b). 13–20px radius. Used to draw the eye to specific cards in the scattered background or to highlight featured content.

### Pastel Card
**Role:** Colored playing card surface used in the scattered background composition

Filled card with one of the seven accent surface colors (Lemon, Lavender, Cobalt, Sky, Bubblegum, Mint, Tangerine). 13–20px radius, black text at weight 800. Functions purely as decorative atmosphere in the card-scatter background pattern.

### Cookie/Modal Dialog
**Role:** Overlay consent interface

Centered on the page with a darkened scrim behind. Black (#000000) background, white text, 13–20px radius. Contains a bold heading ("Cookie Settings"), descriptive body copy, checkbox controls, and a row of outlined pill buttons (Accept All / Reject All / Confirm My Choices). The dialog itself follows the card aesthetic — it looks like a card dealt face-up on the table.

### Top Navigation Bar
**Role:** Site header with brand and nav links

Transparent or dark (#000000) background, white text. Brand name "Cards Against Humanity" at left in weight 800, ~24px. Nav items (Shop, About) at right with small dropdown carets. Minimal — no background fill, no border-bottom. Sits cleanly on the dark canvas.

### Section Display Heading
**Role:** Hero-level typography for section openers like "Buy the game."

Helvetica Neue LT weight 800, 55–80px, line-height 0.98–1.05. Color inverts by section: white on dark sections, black on light sections. Extremely tight leading at this scale — words stack into an impactful block. No letter-spacing manipulation.

### Checkbox Control
**Role:** Form input within the cookie settings dialog

Small square checkbox (~16–18px), 2px white border on the dark dialog surface. Unchecked state is transparent fill; checked state shows white fill with black checkmark. Sits inline with label text at 14px weight 400.

### Badge / Tag
**Role:** Small accent labels, potentially for product variants or tags

One of the three brand accent colors as 2px border (Signal Red, Royal Violet, Antique Gold), transparent or matching-tinted fill. 38px border-radius (pill). Text in matching color, weight 800, 12–14px. Padding: ~10–20px horizontal.

## Do's and Don'ts

### Do
- Use weight 800 for all headings and display text — the heavy Helvetica is the brand's voice
- Apply the 2px inset shadow as border treatment on all interactive elements instead of stroke or drop-shadow
- Use pill shapes (38–64px radius) for all buttons and badges
- Compose backgrounds with scattered white cards at varied rotations to reinforce the game-table atmosphere
- Restrict chromatic color to the three brand accents (Signal Red, Royal Violet, Antique Gold) used as borders only, not fills
- Set display text line-height to 0.98–1.07 at 55px+ sizes for tight, impactful stacking
- Invert color polarity (black on white / white on black) at section boundaries rather than introducing new colors

### Don't
- Don't use weight 400 for anything above 16px — the site's voice is uniformly heavy
- Don't apply drop shadows for elevation — the 2px inset border system is the only depth treatment
- Don't fill large areas with chromatic color — accent colors are outlines, not backgrounds
- Don't use border-radius below 13px on cards or below 32px on buttons — the geometry must read as physical cards
- Don't add gradient fills — the palette is strictly flat, the only complexity comes from scattered card composition
- Don't use letter-spacing tricks — the raw Helvetica geometry at weight 800 is the entire typographic system
- Don't introduce blues, greens, or pinks as UI chrome — those colors exist only as card face fills in decorative scatter

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Table Felt | `#000000` | Primary page background, the dark surface cards are dealt onto |
| 1 | Card Face | `#ffffff` | Playing card surfaces and content blocks that read as physical cards |
| 2 | Pastel Card | `#ede5ff` | Soft accent card surfaces for featured or decorative playing cards |

## Elevation

- **Outlined Pill Button:** `rgb(0, 0, 0) 0px 0px 0px 2px inset`
- **Outlined Pill Button (on light surface):** `rgb(255, 255, 255) 0px 0px 0px 2px inset`

## Imagery

The site is dominated by playing card imagery — white rectangular cards with black sans-serif text, some bordered in the three brand accent colors (red, violet, gold), others filled in pastel card colors (lemon, lavender, mint, sky, etc.). Cards are arranged in scattered, overlapping compositions at various rotation angles against the black canvas, creating a sense of a game mid-play. Card content includes both product cards (the actual game) and quote/headline cards that function as typographic display elements. The card IS the imagery — there are no photographs, no illustrations, no abstract graphics. Everything visual is either a card, a card border, or negative space between cards. Iconography is minimal or absent from the visible chrome.

## Layout

Full-bleed sections that alternate between black (#000000) and white (#ffffff) backgrounds, creating stark contrast boundaries. Hero section opens on black with massive display text (55–80px) and scattered card background elements. Content sections switch to white backgrounds with black text for readability, then return to black for CTA sections like "Buy the game." Content is max-width contained (~1200px) and centered within each section. Navigation is a minimal top bar with brand left, links right. The scattered card pattern fills negative space in hero and transition areas, creating visual texture without competing with foreground copy. Section gaps are generous (~50px) but the large display type sizes keep vertical density high.

## Agent Prompt Guide

**Quick Color Reference**
- text (on dark): #ffffff
- text (on light): #000000
- background (dark sections): #000000
- background (light sections): #ffffff
- border / accent outline: use Signal Red (#fe2f2f), Royal Violet (#7333f1), or Antique Gold (#d7b73b) — pick one per element
- primary action: #000000 (filled action)

**Example Component Prompts**
1. Hero section on black (#000000). Scattered white card rectangles in the background, rotated -15° to +20° at various sizes, some with 2px borders in Signal Red, Royal Violet, or Antique Gold. Headline: "Cards Against Humanity" at 80px, Helvetica Neue LT weight 800, #ffffff, line-height 0.98. Subtext at 20px weight 800, #ffffff.

2. Outlined pill button: transparent fill, 2px white (#ffffff) inset border, 38px border-radius, 12px vertical / 32px horizontal padding. Text: 16px Helvetica Neue LT weight 800, #ffffff, centered.

3. Content card: white (#ffffff) background, 2px black (#000000) inset shadow as border, 13px border-radius, 20px padding. Heading inside: 28px weight 800, #000000, line-height 1.3. Body text: 16px weight 400, #000000, line-height 2.38.

4. Cookie/modal dialog: centered overlay on darkened scrim. Background #000000, 13px border-radius, 30px padding. Heading "Cookie Settings" at 24px weight 800, #ffffff. Body text at 14px weight 400, #ffffff. Three outlined pill buttons (Accept All / Reject All / Confirm My Choices) at the bottom, white 2px borders on transparent fill, 38px radius.

5. Section divider/transition: full-bleed band switching from #000000 to #ffffff. Display heading at 65px weight 800, color inverts with the background. 50px vertical padding above and below.

## Similar Brands

- **Walmart's 'Black Friday Deals' landing pages** — Same scattered card/tile composition at varied angles on near-black canvas, same heavy display sans-serif, same stark black-to-white section inversions
- **Exploding Kittens** — Same product-as-decorative-imagery approach with card-shaped elements scattered across a dark background, same irreverent tone reflected in bold typographic voice
- **What Do You Meme?** — Same party-game brand energy expressed through scattered card-like content blocks, same high-contrast black/white palette with accent color pops
- **UNO brand site** — Same card-product-first visual language where the game's visual identity (colorful card faces, scattered arrangement) IS the website's design system
- **NYC brand sites (e.g. BBC's brutalist moments)** — Same anti-soft aesthetic: heavy Helvetica-weight typography, no drop shadows, thick outlined buttons, stark section polarity inversions

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-game-night-black: #000000;
  --color-card-white: #ffffff;
  --color-signal-red: #fe2f2f;
  --color-royal-violet: #7333f1;
  --color-antique-gold: #d7b73b;
  --color-lemon-card: #fffe5b;
  --color-lavender-card: #ede5ff;
  --color-cobalt-card: #1b5bff;
  --color-sky-card: #a0e9ff;
  --color-bubblegum-card: #ffa0f0;
  --color-mint-card: #b4ff91;
  --color-tangerine-card: #ff9559;

  /* Typography — Font Families */
  --font-helvetica-neue-lt: 'Helvetica Neue LT', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-helvetica-neue: 'Helvetica Neue', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 2;
  --text-body-sm: 14px;
  --leading-body-sm: 2.1;
  --text-body: 16px;
  --leading-body: 2.38;
  --text-subheading: 20px;
  --leading-subheading: 1.29;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.25;
  --text-heading: 28px;
  --leading-heading: 1.3;
  --text-heading-lg: 40px;
  --leading-heading-lg: 1.07;
  --text-display-sm: 55px;
  --leading-display-sm: 1.05;
  --text-display: 65px;
  --leading-display: 1;
  --text-display-lg: 80px;
  --leading-display-lg: 0.98;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-bold: 700;
  --font-weight-extrabold: 800;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-12: 12px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-60: 60px;
  --spacing-100: 100px;
  --spacing-160: 160px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 50px;
  --card-padding: 20px;
  --element-gap: 10px;

  /* Border Radius */
  --radius-lg: 10px;
  --radius-xl: 13px;
  --radius-2xl: 20px;
  --radius-3xl: 28px;
  --radius-3xl-2: 32px;
  --radius-3xl-3: 38px;
  --radius-full: 64px;
  --radius-full-2: 80px;

  /* Named Radii */
  --radius-cards: 13px;
  --radius-badges: 38px;
  --radius-inputs: 38px;
  --radius-buttons: 38px;

  /* Shadows */
  --shadow-subtle: rgb(0, 0, 0) 0px 0px 0px 2px inset;
  --shadow-subtle-2: rgb(255, 255, 255) 0px 0px 0px 2px inset;

  /* Surfaces */
  --surface-table-felt: #000000;
  --surface-card-face: #ffffff;
  --surface-pastel-card: #ede5ff;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-game-night-black: #000000;
  --color-card-white: #ffffff;
  --color-signal-red: #fe2f2f;
  --color-royal-violet: #7333f1;
  --color-antique-gold: #d7b73b;
  --color-lemon-card: #fffe5b;
  --color-lavender-card: #ede5ff;
  --color-cobalt-card: #1b5bff;
  --color-sky-card: #a0e9ff;
  --color-bubblegum-card: #ffa0f0;
  --color-mint-card: #b4ff91;
  --color-tangerine-card: #ff9559;

  /* Typography */
  --font-helvetica-neue-lt: 'Helvetica Neue LT', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-helvetica-neue: 'Helvetica Neue', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 2;
  --text-body-sm: 14px;
  --leading-body-sm: 2.1;
  --text-body: 16px;
  --leading-body: 2.38;
  --text-subheading: 20px;
  --leading-subheading: 1.29;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.25;
  --text-heading: 28px;
  --leading-heading: 1.3;
  --text-heading-lg: 40px;
  --leading-heading-lg: 1.07;
  --text-display-sm: 55px;
  --leading-display-sm: 1.05;
  --text-display: 65px;
  --leading-display: 1;
  --text-display-lg: 80px;
  --leading-display-lg: 0.98;

  /* Spacing */
  --spacing-12: 12px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-60: 60px;
  --spacing-100: 100px;
  --spacing-160: 160px;

  /* Border Radius */
  --radius-lg: 10px;
  --radius-xl: 13px;
  --radius-2xl: 20px;
  --radius-3xl: 28px;
  --radius-3xl-2: 32px;
  --radius-3xl-3: 38px;
  --radius-full: 64px;
  --radius-full-2: 80px;

  /* Shadows */
  --shadow-subtle: rgb(0, 0, 0) 0px 0px 0px 2px inset;
  --shadow-subtle-2: rgb(255, 255, 255) 0px 0px 0px 2px inset;
}
```
