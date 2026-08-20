# Sana Agents — Style Reference
> Lime spark on editorial white

**Theme:** light

Sana's design system is an editorial-grade monochrome canvas with a single electric accent — a Swiss-poster discipline applied to a knowledge work product. The page is overwhelmingly white and typographic, with a massive weight-400 serif headline that gives the brand a literary, almost magazine-cover authority rare in AI tooling. Dark surfaces (#0a1217) and one vivid lime (#cdfe00) appear as deliberate punctuation — full-bleed product cards, sign-up panels, and the occasional action button — never as background washes. Rounded geometry is generous: 24px for cards and inputs, full pills for buttons, which together give the system a soft, tactile quality against the otherwise austere type. Components stay flat and unshaded; depth comes from surface color contrast rather than shadows, creating a visual rhythm of white → frost → ink → lime rather than z-axis elevation.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Ink Black | `#0a1217` | `--color-ink-black` | Primary text, dark card surfaces, sign-up panel, filled primary buttons on light backgrounds |
| Paper White | `#ffffff` | `--color-paper-white` | Light supporting surface for subtle backgrounds and section separation. Do not promote it to the primary CTA color |
| Frost Wash | `#e4eff7` | `--color-frost-wash` | Soft tinted surface for light product cards and secondary panels — the only chromatic step between paper white and ink black |
| Stone Gray | `#85898b` | `--color-stone-gray` | Muted helper text, footer labels, and desaturated secondary copy |
| Obsidian | `#000000` | `--color-obsidian` | Hairline borders, nav text, and input outlines where the sharpest contrast edge is required |
| Electric Lime | `#cdfe00` | `--color-electric-lime` | Green supporting accent for decorative details and low-frequency emphasis. Do not promote it to the primary CTA color |

## Tokens — Typography

### Sana Serif — Hero display headline only. A weight-400 serif at 72px is the system's signature move: most AI brands shout with bold sans, Sana whispers with editorial type and lets the scale carry authority. The serif counterforms and bracket serifs give the wordmark a literary, humanist quality absent from typical product UI. · `--font-sana-serif`
- **Substitute:** GT Super, Tiempos Headline, or Source Serif 4 at weight 400
- **Weights:** 400
- **Sizes:** 72px
- **Line height:** 1.10
- **Role:** Hero display headline only. A weight-400 serif at 72px is the system's signature move: most AI brands shout with bold sans, Sana whispers with editorial type and lets the scale carry authority. The serif counterforms and bracket serifs give the wordmark a literary, humanist quality absent from typical product UI.

### Sana Sans — All UI, body, navigation, buttons, and subheadings. The 450 weight is a distinctive mid-step between regular and medium — used for button labels and nav links instead of jumping to 500, producing quieter emphasis. Tabular numerals (tnum) and lining figures (lnum) are always on, giving all numeric data a consistent grid. · `--font-sana-sans`
- **Substitute:** Söhne, Inter, or Untitled Sans
- **Weights:** 400, 450, 500
- **Sizes:** 13px, 14px, 16px, 20px
- **Line height:** 1.20, 1.40, 1.43, 1.50
- **OpenType features:** `"lnum" on, "tnum" on`
- **Role:** All UI, body, navigation, buttons, and subheadings. The 450 weight is a distinctive mid-step between regular and medium — used for button labels and nav links instead of jumping to 500, producing quieter emphasis. Tabular numerals (tnum) and lining figures (lnum) are always on, giving all numeric data a consistent grid.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 13px | 1.5 | — | `--text-caption` |
| body | 16px | 1.43 | — | `--text-body` |
| heading | 20px | 1.2 | — | `--text-heading` |
| display | 72px | 1.1 | — | `--text-display` |

## Tokens — Spacing & Shapes

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 6 | 6px | `--spacing-6` |
| 8 | 8px | `--spacing-8` |
| 10 | 10px | `--spacing-10` |
| 12 | 12px | `--spacing-12` |
| 16 | 16px | `--spacing-16` |
| 18 | 18px | `--spacing-18` |
| 20 | 20px | `--spacing-20` |
| 24 | 24px | `--spacing-24` |
| 25 | 25px | `--spacing-25` |
| 32 | 32px | `--spacing-32` |
| 62 | 62px | `--spacing-62` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 24px |
| inputs | 24px |
| buttons | 9999px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 64px
- **Card padding:** 24-32px
- **Element gap:** 8-16px

## Components

### Hero Headline (Sana Serif Display)
**Role:** The 72px serif display that opens the page

Weight 400 Sana Serif at 72px, line-height 1.10, color #0a1217 on #ffffff canvas. Centered alignment, used exactly once per page in the hero. The massive scale of a weight-400 serif — not bold, not light — is the system's defining typographic statement.

### Product Card — Dark (Sana Agents)
**Role:** Full-bleed dark product showcase card

Background #0a1217, border-radius 24px, padding 24-32px. Title in Sana Sans 20px weight 500 at #ffffff, subtitle at 16px weight 400 in #85898b. Contains a product screenshot. Houses two pill buttons: a dark-on-dark 'Explore' (but actually the Explore button is a dark pill which is hard to see — likely has a white outline or is actually a different style) and a green 'Book an intro' accent button in #cdfe00.

### Product Card — Light (Sana Learn)
**Role:** Full-bleed light product showcase card

Background #e4eff7 (Frost Wash), border-radius 24px, padding 24-32px. Title in Sana Sans 20px weight 500 at #0a1217, subtitle at 16px weight 400. Contains a product screenshot on the frost surface. Buttons: 'Explore' in #0a1217 filled pill, 'Book an intro' as ghost/white pill with #0a1217 border.

### Pill Button — Filled Dark
**Role:** Primary action on light backgrounds

Background #0a1217, text #ffffff, Sana Sans 16px weight 450, border-radius 9999px (full pill), padding 10px 18px. Used for 'Explore', 'Sign in', and 'Enter your work email' CTAs on white or frost surfaces.

### Pill Button — Accent Lime
**Role:** Highlighted action on dark surfaces

Background #cdfe00 (Electric Lime), text #0a1217, Sana Sans 16px weight 450, border-radius 9999px, padding 10px 18px. Only ever used on #0a1217 dark surfaces — the contrast against ink black is the point.

### Pill Button — Ghost/White
**Role:** Secondary action on dark surfaces, or outlined action on light surfaces

Background #ffffff with 1px border #ffffff on dark cards; or background transparent with border #0a1217 on light cards. Text matches surface logic: #0a1217 on white, #0a1217 on frost. Border-radius 9999px, padding 10px 18px.

### OAuth Button (Google)
**Role:** Third-party authentication action

Full-width pill, background #ffffff, border-radius 9999px, padding 10px 18px. Google 'G' logo on the left, label 'Continue con Google' in Sana Sans 16px weight 450 at #0a1217, centered. Used inside the dark sign-up card.

### Sign-Up CTA Card
**Role:** Conversion panel for account creation

Background #0a1217, border-radius 24px, padding 32-62px. Centered heading 'Try for free with your work email' in Sana Sans weight 500 at #ffffff. Contains OAuth button, 'or' divider in #85898b, email input + submit button stack, and terms text in #85898b at 13px. The 62px padding token appears here for generous internal breathing room.

### Email Input
**Role:** Text input for email capture

Background #ffffff, border 1px #000000 or #0a1217, border-radius 24px, padding 10px 18px. Placeholder text 'name@work-email.com' in #85898b. Full-width within its container. No focus ring color change observed — the solid border is the visual anchor.

### Navigation Bar
**Role:** Top-level site navigation

Background #ffffff, horizontal layout with 'Sana' wordmark left, centered nav links (Sana Agents, Sana Learn, Mission, Careers) in Sana Sans 16px weight 400 at #0a1217, and 'Sign in' pill button (#0a1217 filled, #ffffff text) on the far right. No background, no border, no shadow — the nav sits directly on the white canvas.

### Product Section Label
**Role:** Small section-introducing label

Sana Sans 13px weight 400 at #85898b, left-aligned, sits above the product cards. Extremely quiet — the section label is barely louder than the background.

### Footer
**Role:** Site-wide footer with link columns

Background #ffffff, padding 32-62px. 'Sana' wordmark on the left, three columns of text links (Sana Agents, Sana Learn, Company) in Sana Sans 14px weight 400 at #0a1217. Column headers at 16px weight 450. Copyright line at 13px in #85898b. No dividers, no background tint — the footer is pure typographic structure.

## Do's and Don'ts

### Do
- Use Sana Serif exclusively for the 72px hero headline at weight 400 — it is the system's only serif, and diluting it to smaller sizes destroys its editorial authority
- Apply 24px border-radius to all cards, inputs, and panel containers; use 9999px exclusively for pill-shaped buttons and tags
- Restrict #cdfe00 (Electric Lime) to filled action buttons sitting on #0a1217 (Ink Black) surfaces — the lime-on-ink contrast is the entire purpose of the accent
- Use Sana Sans weight 450 for button labels and nav links rather than 500 — the 450 step is what makes the body type feel quiet and considered
- Set font-feature-settings to "lnum" on, "tnum" on for all Sana Sans usage — tabular numerals ensure numeric data aligns cleanly in tables, prices, and timestamps
- Create depth through surface color shifts (white → frost → ink) rather than box-shadows — the system is flat by design
- Keep the hero headline centered and the rest of the layout left-aligned — centering is reserved for the single editorial moment

### Don't
- Do not use Sana Serif below 56px — weight 400 at small sizes loses its authority and reads as thin/generic
- Do not place #cdfe00 on #ffffff or #e4eff7 surfaces — the contrast is insufficient and the lime loses its electric quality
- Do not introduce a second accent color — the system is monochromatic with exactly one chromatic note, adding more dilutes the poster-like discipline
- Do not apply drop shadows to cards or panels — depth comes from the white → frost → ink surface stack, not elevation
- Do not use sharp corners (0px radius) on any container — the 24px radius defines the system's soft, tactile personality
- Do not center-align body text, card content, or navigation links — only the hero display headline gets centered treatment
- Do not add gradients, patterns, or background imagery to surfaces — the design language is pure flat color blocks

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Paper White | `#ffffff` | Page canvas, default background for all sections and footer |
| 1 | Frost Wash | `#e4eff7` | Light product cards and secondary panels — subtle cool tint to separate from the white canvas |
| 2 | Ink Black | `#0a1217` | Dark product cards, sign-up CTA panels, and filled button fills — the strongest contrast surface in the system |
| 3 | Electric Lime | `#cdfe00` | Accent action surface, used only as filled button on ink-black backgrounds |

## Elevation

The system deliberately avoids drop shadows. Depth and hierarchy are created entirely through surface color contrast — white → frost → ink black — rather than z-axis elevation. Components sit flat against their containers, and the 24px border radius is the only softening agent. This produces a poster-like, Swiss-graphic-design quality where every surface edge is a deliberate color boundary, not a diffuse shadow.

## Imagery

Product photography is the only imagery present: tight device crops showing the Sana Agents mobile app on a hand-held phone (dark card) and the Sana Learn platform on a laptop screen (light card). No lifestyle photography, no abstract illustrations, no decorative graphics. The product screenshot IS the hero within each card — devices are photographed at a slight angle with shallow depth of field, bleeding off the card edges. The imagery treatment is documentary and utilitarian: show the actual product, not a stylized version of it.

## Layout

The page is a centered, max-width contained layout (approximately 1200px) on a pure white canvas. The hero is a single centered serif headline with no accompanying image — pure typographic. Below the hero, the layout shifts to a two-column product card grid with both cards at equal width and identical height, each containing a device photograph that bleeds past the card's right edge. The sign-up CTA panel is a single contained dark card centered within the page width. The footer is a four-column text grid (wordmark + three link columns) aligned to the same max-width. Navigation is a minimal top bar: wordmark left, centered links, single pill button right. No sidebar, no mega-menu, no sticky elements visible.

## Agent Prompt Guide

primary action: no distinct CTA color
## Quick Color Reference

- text: #0a1217
- background: #ffffff
- dark surface: #0a1217
- light surface / frost: #e4eff7
- border: #000000
- accent / primary action on dark surfaces: #cdfe00 (Electric Lime)
- primary action on light surfaces: #0a1217 (Ink Black filled pill)

## Example Component Prompts

**1. Hero section:** White #ffffff background. Centered headline 'Superintelligence for work' at 72px Sana Serif weight 400, color #0a1217, line-height 1.10. No accompanying image. Below at 13px Sana Sans weight 400, color #85898b, the label 'Our products', left-aligned.

**2. Dark product card:** Background #0a1217, border-radius 24px, padding 32px. Title 'Sana Agents' in Sana Sans 20px weight 500 at #ffffff. Subtitle 'AI agents for every team' in Sana Sans 16px weight 400 at #85898b. Two pill buttons: 'Explore' as filled #0a1217 with white border (or surface-elevation style), 'Book an intro' as filled #cdfe00 with #0a1217 text. Both at 9999px radius, 10px 18px padding, Sana Sans 16px weight 450.

**3. Light product card:** Background #e4eff7, border-radius 24px, padding 32px. Title 'Sana Learn' in Sana Sans 20px weight 500 at #0a1217. Subtitle 'AI-native learning platform' in Sana Sans 16px weight 400. Buttons: 'Explore' as filled #0a1217 pill with #ffffff text, 'Book an intro' as ghost pill with #ffffff background and #0a1217 text.

No distinct primary action color was observed; use the extracted neutral button treatments instead of inventing a filled CTA color.

**5. Footer:** White #ffffff background, no dividers. 'Sana' wordmark left in Sana Serif or Sans. Three columns of links in Sana Sans 14px weight 400 at #0a1217, column headers at 16px weight 450. Copyright 'Sana Labs © 2026' at 13px in #85898b.

## Similar Brands

- **Linear** — Same monochrome-first discipline with a single restrained accent, generous border-radius, pill-shaped buttons, and flat surfaces with no shadows — both systems treat white space as a primary design element
- **Vercel** — Identical typographic confidence: custom geometric sans at compressed sizes, monochrome canvas, generous letter-spacing, and zero decorative chrome — both let type and spacing do the heavy lifting
- **Anthropic** — Same editorial instinct: serif used for brand-defining moments, sans for utility, white canvas with deliberate dark-surface panels, and a warm-accent restraint that reads as considered rather than corporate
- **Stripe** — Same poster-design heritage: massive editorial type, two-color surface contrast (white + near-black), and the absence of shadows or gradients in favor of flat geometric panels with generous radius
- **Notion** — Same soft-tactile feel through generous border-radius on cards and inputs, but Sana pushes further into monochrome and editorial type where Notion stays neutral and utilitarian

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-ink-black: #0a1217;
  --color-paper-white: #ffffff;
  --color-frost-wash: #e4eff7;
  --color-stone-gray: #85898b;
  --color-obsidian: #000000;
  --color-electric-lime: #cdfe00;

  /* Typography — Font Families */
  --font-sana-serif: 'Sana Serif', ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
  --font-sana-sans: 'Sana Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 13px;
  --leading-caption: 1.5;
  --text-body: 16px;
  --leading-body: 1.43;
  --text-heading: 20px;
  --leading-heading: 1.2;
  --text-display: 72px;
  --leading-display: 1.1;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-w450: 450;
  --font-weight-medium: 500;

  /* Spacing */
  --spacing-6: 6px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-18: 18px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-25: 25px;
  --spacing-32: 32px;
  --spacing-62: 62px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 64px;
  --card-padding: 24-32px;
  --element-gap: 8-16px;

  /* Border Radius */
  --radius-3xl: 24px;
  --radius-full: 9999px;

  /* Named Radii */
  --radius-cards: 24px;
  --radius-inputs: 24px;
  --radius-buttons: 9999px;

  /* Surfaces */
  --surface-paper-white: #ffffff;
  --surface-frost-wash: #e4eff7;
  --surface-ink-black: #0a1217;
  --surface-electric-lime: #cdfe00;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-ink-black: #0a1217;
  --color-paper-white: #ffffff;
  --color-frost-wash: #e4eff7;
  --color-stone-gray: #85898b;
  --color-obsidian: #000000;
  --color-electric-lime: #cdfe00;

  /* Typography */
  --font-sana-serif: 'Sana Serif', ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
  --font-sana-sans: 'Sana Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 13px;
  --leading-caption: 1.5;
  --text-body: 16px;
  --leading-body: 1.43;
  --text-heading: 20px;
  --leading-heading: 1.2;
  --text-display: 72px;
  --leading-display: 1.1;

  /* Spacing */
  --spacing-6: 6px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-18: 18px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-25: 25px;
  --spacing-32: 32px;
  --spacing-62: 62px;

  /* Border Radius */
  --radius-3xl: 24px;
  --radius-full: 9999px;
}
```
