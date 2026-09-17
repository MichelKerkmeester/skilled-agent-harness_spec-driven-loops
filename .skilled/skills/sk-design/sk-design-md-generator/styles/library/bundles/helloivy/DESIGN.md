# Helloivy — Style Reference
> Risograph-printed design journal on cream paper. A two-color editorial system where personality lives in typography, not color — the cream background, black ink, and one whisper-gray are the entire palette, and the quirky geometric display face carries all the brand energy the restrained palette deliberately withholds.

**Theme:** light

Helloivy uses a warm-cream editorial canvas with near-monochrome ink-black typography, giving the product a print-magazine feel rather than typical SaaS sterility. The display typeface (Unbounded) is geometric and slightly playful, carrying personality that the restrained palette deliberately withholds; Inter does the quiet labor of body, UI, and labels. Surfaces are flat — no shadows, no gradients — and the only elevation comes from filled black pills sitting on cream, or muted gray cards containing product commentary. Color is rationed: the cream canvas (#faf6f0) anchors the page, black owns headlines and primary actions, a single slate gray (#5e697f) handles secondary text, and white is reserved for product mockup surfaces. Everything else is space, type, and the occasional thin hairline border.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Cream Paper | `#faf6f0` | `--color-cream-paper` | Page canvas, section backgrounds, card surfaces — the warm off-white ground that makes the whole site read like a print artifact rather than a screen |
| Ink Black | `#000000` | `--color-ink-black` | Headlines, body text, primary filled buttons, logo mark, dividers, icons — the dominant structural color carrying almost all information |
| Slate Whisper | `#5e697f` | `--color-slate-whisper` | Secondary body text, muted descriptions, helper text, subdued labels — the single desaturated accent that softens body copy without competing with headlines |
| Charcoal | `#555555` | `--color-charcoal` | Secondary paragraph text, sub-labels, low-emphasis copy where Slate Whisper isn't deployed — fills the gap between ink-black headlines and whisper-gray annotations |
| Pure White | `#ffffff` | `--color-pure-white` | Product mockup surfaces, card-internal backgrounds, floating badge fills — the crisp inset color that product UI sits on, creating a paper-on-paper layering effect against the cream canvas |

## Tokens — Typography

### sans-serif — sans-serif — detected in extracted data but not described by AI · `--font-sans-serif`
- **Weights:** 400
- **Sizes:** 12px
- **Line height:** 1.2
- **Role:** sans-serif — detected in extracted data but not described by AI

### Unbounded — Display and hero headlines only. The geometric, slightly quirky letterforms are the brand's only expressive color — at 62px and 82px they dominate screens with editorial confidence. The slight positive tracking (+0.01–0.02em) keeps the wide geometric shapes from feeling cold. Substitute: Space Grotesk for a similar geometric-friendliness, or DM Sans Display. · `--font-unbounded`
- **Substitute:** Space Grotesk
- **Weights:** 400, 500
- **Sizes:** 20px, 34px, 62px, 82px
- **Line height:** 1.10–1.40
- **Letter spacing:** 0.01em to 0.02em
- **Role:** Display and hero headlines only. The geometric, slightly quirky letterforms are the brand's only expressive color — at 62px and 82px they dominate screens with editorial confidence. The slight positive tracking (+0.01–0.02em) keeps the wide geometric shapes from feeling cold. Substitute: Space Grotesk for a similar geometric-friendliness, or DM Sans Display.

### Inter — Body, UI, navigation, subheadings, button labels. The tight negative tracking (-0.02em) at all sizes gives Inter a confident editorial density that pairs with Unbounded's looser display feel. Weight 400 is the workhorse; 500–600 for subheadings; 700 reserved for inline emphasis. · `--font-inter`
- **Substitute:** Inter (Google Fonts)
- **Weights:** 400, 500, 600, 700
- **Sizes:** 12px, 14px, 16px, 18px, 24px, 27px, 32px
- **Line height:** 1.20–1.60
- **Letter spacing:** -0.02em across all sizes
- **Role:** Body, UI, navigation, subheadings, button labels. The tight negative tracking (-0.02em) at all sizes gives Inter a confident editorial density that pairs with Unbounded's looser display feel. Weight 400 is the workhorse; 500–600 for subheadings; 700 reserved for inline emphasis.

### Inter-Bold — Inter-Bold — detected in extracted data but not described by AI · `--font-inter-bold`
- **Weights:** 700
- **Sizes:** 18px
- **Line height:** 1.6
- **Role:** Inter-Bold — detected in extracted data but not described by AI

### Inter-Medium — Inter-Medium — detected in extracted data but not described by AI · `--font-inter-medium`
- **Weights:** 500
- **Sizes:** 14px
- **Line height:** 1.5
- **Role:** Inter-Medium — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.2 | -0.24px | `--text-caption` |
| body-sm | 14px | 1.5 | -0.28px | `--text-body-sm` |
| body | 16px | 1.6 | -0.32px | `--text-body` |
| subheading | 18px | 1.6 | -0.36px | `--text-subheading` |
| heading-sm | 24px | 1.5 | -0.48px | `--text-heading-sm` |
| heading | 27px | 1.4 | -0.54px | `--text-heading` |
| heading-lg | 34px | 1.2 | 0.34px | `--text-heading-lg` |
| display | 62px | 1.2 | 0.62px | `--text-display` |
| display-lg | 82px | 1.1 | 1.64px | `--text-display-lg` |

## Tokens — Spacing & Shapes

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 6 | 6px | `--spacing-6` |
| 8 | 8px | `--spacing-8` |
| 10 | 10px | `--spacing-10` |
| 12 | 12px | `--spacing-12` |
| 14 | 14px | `--spacing-14` |
| 15 | 15px | `--spacing-15` |
| 16 | 16px | `--spacing-16` |
| 20 | 20px | `--spacing-20` |
| 24 | 24px | `--spacing-24` |
| 30 | 30px | `--spacing-30` |
| 32 | 32px | `--spacing-32` |
| 40 | 40px | `--spacing-40` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 8px |
| pills | 9999px |
| small | 8px |
| buttons | 9999px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 24px
- **Element gap:** 16px

## Components

### Primary Filled Button
**Role:** Hero CTAs, top-nav 'Get Started', primary conversion actions

Filled black (#000000) background, white text, Inter 14px weight 500, fully rounded (9999px radius), horizontal padding 24px, vertical padding 10px. No shadow, no border. The entire button reads as a solid ink stamp on cream paper.

### Ghost Pill Button
**Role:** Secondary actions, floating utility actions like 'Try it for free'

Filled black (#000000) background with white text, 8px radius, fixed-positioned (bottom-right). Same ink-stamp treatment as the primary button but with a small icon prefix.

### Navigation Text Link
**Role:** Top-nav items: Features, Pricing, Log in

No fill, no border. Inter 14px weight 500, color #000000. Sits in the header bar with generous horizontal spacing (30px+ between items). The 'Get Started' pill button terminates the nav row.

### Logo Wordmark
**Role:** Brand mark in nav and footer

Lowercase 'hello ivy' in Inter 14px weight 500, #000000, with a thick black horizontal bar (4px height) underlining only the word 'hello' — the underline is the actual brand identifier, not the type.

### Display Headline
**Role:** Hero and section openers

Unbounded weight 500 at 62–82px, line-height 1.10–1.20, letter-spacing +0.01–0.02em, color #000000. The geometric letterforms at this scale carry the brand's personality. Never uses color other than black or charcoal.

### Section Subhead
**Role:** Mid-page section titles ('Improve visibility, stay in the loop.')

Inter weight 600 at 24–32px, line-height 1.40–1.50, color #5e697f. Stays subdued so the body paragraph beneath it can carry the real information.

### Body Paragraph
**Role:** All explanatory copy beneath headlines

Inter weight 400 at 16px, line-height 1.60, color #5e697f. Generous leading for the editorial feel; never tighter than 1.50.

### Featured Card (Cream Inset)
**Role:** Inline feature callouts within a hero or section, e.g. the 'Instead of work happening all over the place…' block

No fill — sits on the cream canvas — with a thin 1px #000000 border or subtle gray background. 24px padding, 8px radius. Contains a short lead phrase in Inter 16px weight 600 black followed by body copy in #5e697f.

### Video Preview Tile
**Role:** Embedded "Meet Hello Ivy in 60 seconds" teaser

Gray circular play button centered on a neutral field, paired with Inter 16px weight 600 title and #5e697f descriptor to the right. The circle is roughly 64px diameter with a 1px border.

### Logo Grid Cell
**Role:** Social proof section: "USED BY THE MOST PRODUCTIVE DESIGN TEAMS AND AGENCIES"

Grid of client/agency logos in monochrome (black or 40% black opacity), separated by thin vertical and horizontal hairlines. Logos sit centered in equal-width cells; the grid label is Inter 12px weight 500 uppercase, letter-spacing +0.05em, color #5e697f.

### Product Mockup Panel
**Role:** In-context product UI screenshots within feature sections

White (#ffffff) background panel with 8px radius, containing a realistic product UI render. Sits on the cream canvas to create a paper-on-paper layering effect. Labeled with a small Inter 12–14px weight 500 caption above.

### Feature Split Block
**Role:** Two-column sections pairing a visual on one side with a text column on the other

Left column: product mockup panel with caption. Right column: subhead in #5e697f Inter 24px, body copy in #5e697f Inter 16px, with bold inline emphasis. 80px vertical gap between sections, 24px gap between subhead and body.

### Round Badge Stamp
**Role:** Decorative credibility mark (the "Hi Creative Teams" circle)

Circular text stamp — Inter 10–12px uppercase arranged radially around a center, with a thin 1px border circle. 80–100px diameter. Color #5e697f or #000000. Functions as editorial ornament, not UI element.

### Text Inline Link
**Role:** Emphasized terms within body paragraphs (e.g. 'Feed' tool, 'collaboration')

Underlined, color #000000 or #5e697f, Inter 16px weight 500. The underline is the only differentiator from body text — no color change, no background.

## Do's and Don'ts

### Do
- Set every page background to #faf6f0 — the warm cream is the system's signature; pure white pages break the editorial identity
- Use Unbounded for display sizes 34px and above, Inter for everything else — never substitute a different display family
- Apply letter-spacing -0.02em to all Inter text, regardless of size — the tight tracking is what makes the body type feel editorial rather than utilitarian
- Keep filled primary buttons at 9999px radius (fully rounded pill) with #000000 fill and white text — no exceptions
- Use #5e697f for all secondary text; reserve #000000 strictly for headlines, primary actions, and the logo
- Separate sections with generous vertical breathing room (80px+) rather than dividers or background-color shifts
- Render product UI mockups on #ffffff panels with 8px radius to create the paper-on-paper layering against the cream canvas

### Don't
- Don't introduce a brand color — the entire palette is black, cream, and slate; adding blue, purple, or green breaks the two-color editorial system
- Don't apply drop shadows to cards, buttons, or sections — the flatness is intentional; elevation comes from color contrast only
- Don't use Inter for display headlines above 34px — Unbounded's geometric character is what gives the brand its personality
- Don't tighten body line-height below 1.50 — the generous leading is part of the editorial reading rhythm
- Don't use #000000 for body paragraphs — it must be #5e697f or #555555 to preserve the ink-on-paper hierarchy
- Don't round section cards at large radii (16px+) — keep them at 8px or less; the only fully-rounded elements are action buttons
- Don't add gradients to backgrounds, buttons, or text — the system is strictly flat; gradients would break the print-artifact metaphor

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Cream Canvas | `#faf6f0` | Page background, full-bleed sections — the warm paper ground |
| 1 | Pure White Inset | `#ffffff` | Product mockup panels, card-internal backgrounds, floating elements that need to sit forward of the cream |
| 2 | Ink Pill | `#000000` | Filled primary action buttons, logo wordmark, high-contrast overlay elements |

## Elevation

No shadows. The design uses flat surfaces and color contrast alone for hierarchy — black-on-cream for primary actions, white-on-cream for inset product cards, and thin hairline borders for section dividers. This flatness is core to the print-editorial identity; introducing drop shadows would push the system toward generic SaaS territory.

## Imagery

The site is overwhelmingly text-and-UI, with imagery limited to two categories: (1) product UI mockups rendered as white panels embedded in the cream canvas — these are tight, unglamorous product crops showing actual interface states, not stylized marketing renders; and (2) a monochrome logo grid for social proof, where client logos are displayed in single-color black at reduced opacity. There is no lifestyle photography, no abstract illustration, no 3D — the visual language is editorial restraint. Decorative elements are limited to a small circular 'Hi Creative Teams' text stamp that functions as an editorial ornament.

## Layout

Max-width 1200px centered, with a full-bleed cream canvas that extends to viewport edges. The hero is a tall text-first block: a compact top nav (logo left, links right, CTA pill), then a 62–82px Unbounded headline left-aligned spanning nearly the full content width, followed by a single paragraph of body copy. Below the hero, a horizontal card row splits the viewport into two: a cream feature card on the left, a video preview tile on the right. The social proof section is a full-width logo grid with thin hairlines. Feature sections alternate between a 2-column split (product mockup left, text column right) and centered text blocks. Vertical rhythm is spacious — 80px between sections, no colored bands or alternating backgrounds, just the continuous cream canvas. A floating 'Try it for free' pill sits fixed in the bottom-right corner.

## Agent Prompt Guide

**Quick Color Reference**
- text (primary): #000000
- text (secondary): #5e697f
- background (canvas): #faf6f0
- surface (inset/elevated): #ffffff
- border (hairline): #000000 at 1px or #5e697f at 1px
- primary action: no distinct CTA color

**3-5 Example Component Prompts**

1. *Hero headline block*: Background #faf6f0. Headline in Unbounded weight 500, 82px, line-height 1.10, letter-spacing 0.02em, color #000000. Body paragraph beneath in Inter weight 400, 18px, line-height 1.60, letter-spacing -0.02em, color #5e697f. No buttons, no imagery — just type on cream.

2. *Primary navigation with filled action*: Horizontal nav bar, #faf6f0 background. Left: 'hello ivy' wordmark in Inter 14px weight 500 #000000 with a 4px-thick black bar under 'hello'. Right: 'Features' / 'Pricing' / 'Log in' in Inter 14px weight 500 #000000 with 30px gaps, then a 'Get Started' pill — #000000 background, white Inter 14px weight 500 text, 9999px radius, 10px vertical / 24px horizontal padding.

3. *Feature split section*: Two-column layout, 1200px max-width, #faf6f0 background. Left column (55%): white (#ffffff) product mockup panel, 8px radius, 24px padding internally. Right column (45%): subhead in Inter 24px weight 600 #5e697f, 24px gap, body in Inter 16px weight 400 #5e697f, line-height 1.60. No card background on the text column.

4. *Logo grid social proof*: Full-width section, #faf6f0 background. Label above in Inter 12px weight 500 uppercase #5e697f with +0.05em tracking, reading 'USED BY THE MOST PRODUCTIVE DESIGN TEAMS AND AGENCIES'. Below: 4-column grid of client logos, each cell 200px wide, 80px tall, logos in #000000 at 60% opacity, separated by 1px #5e697f hairlines.

No distinct primary action color was observed; use the extracted neutral button treatments instead of inventing a filled CTA color.

## Similar Brands

- **Notion** — Both use a single-color product UI palette where the product screenshot is the main visual element on a minimal background, though Notion uses white instead of cream and Inter instead of a display face
- **Linear** — Same restrained near-monochrome approach with flat surfaces, generous spacing, and no shadows — though Linear is dark-mode and uses purple as its only accent
- **Are.na** — Both embrace a print-editorial visual language with warm off-white backgrounds, serif/geometric display type, and a near-absence of color — a deliberate anti-SaaS aesthetic
- **Read.cv** — Same warm cream canvas, same monochrome ink approach, same editorial typography pairing where personality comes from type choices rather than color
- **Pitch** — Both use a single dominant product color (black for Pitch's dark mode, cream for Helloivy) with the display typeface doing the brand work, and both prioritize flat surfaces over elevation

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-cream-paper: #faf6f0;
  --color-ink-black: #000000;
  --color-slate-whisper: #5e697f;
  --color-charcoal: #555555;
  --color-pure-white: #ffffff;

  /* Typography — Font Families */
  --font-sans-serif: 'sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-unbounded: 'Unbounded', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter-bold: 'Inter-Bold', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter-medium: 'Inter-Medium', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.2;
  --tracking-caption: -0.24px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.5;
  --tracking-body-sm: -0.28px;
  --text-body: 16px;
  --leading-body: 1.6;
  --tracking-body: -0.32px;
  --text-subheading: 18px;
  --leading-subheading: 1.6;
  --tracking-subheading: -0.36px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.5;
  --tracking-heading-sm: -0.48px;
  --text-heading: 27px;
  --leading-heading: 1.4;
  --tracking-heading: -0.54px;
  --text-heading-lg: 34px;
  --leading-heading-lg: 1.2;
  --tracking-heading-lg: 0.34px;
  --text-display: 62px;
  --leading-display: 1.2;
  --tracking-display: 0.62px;
  --text-display-lg: 82px;
  --leading-display-lg: 1.1;
  --tracking-display-lg: 1.64px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-6: 6px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-14: 14px;
  --spacing-15: 15px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-30: 30px;
  --spacing-32: 32px;
  --spacing-40: 40px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 24px;
  --element-gap: 16px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-full: 100px;
  --radius-full-2: 9999px;

  /* Named Radii */
  --radius-cards: 8px;
  --radius-pills: 9999px;
  --radius-small: 8px;
  --radius-buttons: 9999px;

  /* Surfaces */
  --surface-cream-canvas: #faf6f0;
  --surface-pure-white-inset: #ffffff;
  --surface-ink-pill: #000000;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-cream-paper: #faf6f0;
  --color-ink-black: #000000;
  --color-slate-whisper: #5e697f;
  --color-charcoal: #555555;
  --color-pure-white: #ffffff;

  /* Typography */
  --font-sans-serif: 'sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-unbounded: 'Unbounded', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter-bold: 'Inter-Bold', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter-medium: 'Inter-Medium', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.2;
  --tracking-caption: -0.24px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.5;
  --tracking-body-sm: -0.28px;
  --text-body: 16px;
  --leading-body: 1.6;
  --tracking-body: -0.32px;
  --text-subheading: 18px;
  --leading-subheading: 1.6;
  --tracking-subheading: -0.36px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.5;
  --tracking-heading-sm: -0.48px;
  --text-heading: 27px;
  --leading-heading: 1.4;
  --tracking-heading: -0.54px;
  --text-heading-lg: 34px;
  --leading-heading-lg: 1.2;
  --tracking-heading-lg: 0.34px;
  --text-display: 62px;
  --leading-display: 1.2;
  --tracking-display: 0.62px;
  --text-display-lg: 82px;
  --leading-display-lg: 1.1;
  --tracking-display-lg: 1.64px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-6: 6px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-14: 14px;
  --spacing-15: 15px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-30: 30px;
  --spacing-32: 32px;
  --spacing-40: 40px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-full: 100px;
  --radius-full-2: 9999px;
}
```
