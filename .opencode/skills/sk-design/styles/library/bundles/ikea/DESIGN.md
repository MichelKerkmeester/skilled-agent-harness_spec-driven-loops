# IKEA — Style Reference
> sunlit Swedish flat-pack showroom

**Theme:** light

IKEA's interface reads as a high-contrast editorial spread: near-black type on warm white, punctuated by flat yellow panels that function as built-in call-to-action zones. The system is deliberately sparse — one custom sans-serif (Noto IKEA) at just two weights (400 and 700), one 8px corner radius across every component, zero shadows, no gradients. The tightness is structural, not minimalism-as-trend: the negative letter-spacing (-0.029em at display, -0.027em at body) makes even 13px captions feel architectural. Cards are large and media-led, arranged in generous two-column blocks with gradient-to-black text overlays for legibility. The yellow #ffdb00 does all the interface work — it never decorates, it only activates.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| IKEA Yellow | `#ffdb00` | `--color-ikea-yellow` | Primary CTA fills, featured card backgrounds, hero accent panels, the singular chromatic workhorse of the system |
| Ink Black | `#111111` | `--color-ink-black` | Primary text, body copy, headings, dominant borders (851 occurrences), icon strokes |
| Pure White | `#ffffff` | `--color-pure-white` | Page background, card surfaces, nav background, button text on dark fills |
| Warm White | `#fffefb` | `--color-warm-white` | Slightly off-white surface variant for buttons and cards — barely warmer than pure white, breaks digital coldness |
| Steel Gray | `#818181` | `--color-steel-gray` | Secondary text, muted borders, disabled icon states |
| True Black | `#000000` | `--color-true-black` | SVG icon fills, input borders, true-black accents where maximum contrast is needed |
| Link Blue | `#0159a3` | `--color-link-blue` | Text link color, used extensively across navigation and body links — the only blue in the system |
| Soft Pink | `#ffa6da` | `--color-soft-pink` | Occasional decorative highlight, used sparingly on select link elements or promotional accents |

## Tokens — Typography

### Noto IKEA — Sole typeface — custom IKEA-branded Noto variant. Two-weight system (regular 400, bold 700) is deliberate restraint: no italics, no medium weight, no light. The 700 headlines at 36–51px carry the entire brand voice; body at 16px stays neutral. Letter-spacing tightens as size grows, giving display text a compressed, architectural quality. · `--font-noto-ikea`
- **Substitute:** Inter, DM Sans
- **Weights:** 400, 700
- **Sizes:** 13px, 14px, 16px, 20px, 36px, 51px
- **Line height:** 1.00–1.62
- **Letter spacing:** -0.029em at 51px display, -0.027em at 20px+ headings
- **OpenType features:** `N/A`
- **Role:** Sole typeface — custom IKEA-branded Noto variant. Two-weight system (regular 400, bold 700) is deliberate restraint: no italics, no medium weight, no light. The 700 headlines at 36–51px carry the entire brand voice; body at 16px stays neutral. Letter-spacing tightens as size grows, giving display text a compressed, architectural quality.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 13px | 1.4 | — | `--text-caption` |
| body | 16px | 1.57 | — | `--text-body` |
| subheading | 20px | 1.2 | -0.54px | `--text-subheading` |
| heading | 36px | 1.08 | -0.97px | `--text-heading` |
| display | 51px | 1 | -1.48px | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 8px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 8 | 8px | `--spacing-8` |
| 16 | 16px | `--spacing-16` |
| 24 | 24px | `--spacing-24` |
| 80 | 80px | `--spacing-80` |
| 120 | 120px | `--spacing-120` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 8px |
| images | 8px |
| inputs | 8px |
| buttons | 8px |
| default | 8px |

### Layout

- **Page max-width:** 1440px
- **Section gap:** 80px
- **Card padding:** 20px
- **Element gap:** 24px

## Components

### Top Navigation Bar
**Role:** Site header

White background, horizontal flex layout. IKEA logo (yellow+blue badge) left-aligned, text links (Stories, Jobs, Newsroom, Our business) in Ink Black at 14px weight 400, evenly spaced. 1px bottom border in white/light gray. No sticky behavior, no search bar visible in this view.

### Hero Media Card
**Role:** Primary featured content card

Large image card, roughly 2/3 viewport width. Contains full-bleed product photography. Bottom-left text overlay with small kicker label (13–14px, white) and bold headline (36–51px, white, weight 700, letter-spacing -0.027em). Gradient overlay from transparent to black at bottom for text legibility. 8px border radius. Circular play/pause button bottom-right with dark semi-transparent fill.

### Yellow CTA Card
**Role:** Primary action panel

Solid #ffdb00 background, 1/3 viewport width beside the hero media card. Contains bold black text (36–51px, weight 700) like 'Go shopping'. Circular Ink Black button with white right-arrow icon for the action. 8px border radius. This card is the system's signature: flat yellow plane + minimal content + arrow = unmistakable primary action.

### Image Story Card
**Role:** Editorial content card

Media card used in 2-column grids. Full-bleed lifestyle or product photography. Gradient-to-black overlay at bottom with small kicker (13px white) and headline (20–36px white, weight 700). 8px border radius. Some variants have solid backgrounds (gray-to-black gradient) without photography.

### Circular Media Control
**Role:** Play/pause button

Small circular button (~40px diameter) with Ink Black or dark fill and white icon. Positioned bottom-right of media cards. 50% border radius (pill/circle). Used to indicate video or audio content.

### Arrow Link Button
**Role:** Inline navigation action

Circular Ink Black button (~40px) with white right-arrow icon. Paired with bold text in Yellow CTA cards. The arrow+circle is a recurring interaction pattern — always means 'go to' or 'navigate'.

### Store Selector Footer
**Role:** Utility footer

Minimal footer beneath CTA cards. Contains store label (e.g. 'Store: IKEA.es') in Ink Black at 14px weight 400, right-aligned, with a small chevron-up icon. 8px padding, 8px radius. Separated from card by subtle spacing.

### Timeline Section Block
**Role:** Historical/year display

White background section with large numerical display (51px+ weight 700, Ink Black). Accompanied by rows of decorative green circles (not part of the core palette but used in this context). Left-aligned layout with generous 80px+ vertical padding. Headlines sit tight against the numbers.

## Do's and Don'ts

### Do
- Use #ffdb00 exclusively for primary CTAs and featured accent cards — never as a background for body text or informational content
- Set all corners to 8px — there is exactly one border radius in the system
- Use weight 700 for every headline and weight 400 for every body element — never introduce medium, semibold, or light weights
- Apply gradient-to-black overlays at 30–60% opacity on all image cards that contain text overlays
- Use the circular black arrow button (Ink Black fill, white arrow, 8px or 50% radius) as the universal 'navigate' affordance
- Keep body text at 16px with 1.57 line-height — IKEA's body line-height is generous, not tight
- Use #0159a3 exclusively for text links, never for buttons or backgrounds

### Don't
- Do not introduce shadows, elevation, or any depth effects — the system is entirely flat
- Do not use more than one border radius — 8px everywhere, no exceptions
- Do not add additional font weights (300, 500, 600) — the binary 400/700 system is the constraint
- Do not place body text directly on photography without a gradient overlay
- Do not use the blue #0159a3 as a CTA button fill — it is link-only, not action
- Do not soften the letter-spacing — the negative tracking is structural, not decorative
- Do not add accent gradients or color transitions — the system rejects all gradient fills on surfaces

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Page Canvas | `#ffffff` | Base page background, top navigation |
| 1 | Card Surface | `#ffffff` | Default card background on white pages |
| 2 | Warm White Surface | `#fffefb` | Subtle off-white for specific card or button surfaces |
| 3 | Accent Surface | `#ffdb00` | Yellow solid-fill cards and hero panels — the highest surface level, demands attention |

## Elevation

The system deliberately uses zero shadows and zero elevation. All depth and hierarchy is created through: (1) solid yellow surface contrast against white, (2) image overlays with gradient-to-black, (3) size and weight contrast in type, and (4) generous spacing between cards. The absence of shadow is not a missing feature — it is the defining visual stance. Everything sits on the same plane, like printed pages on a table.

## Imagery

Product and lifestyle photography is the dominant visual language. Treatment: high-key, naturally lit, warm Scandinavian interiors with lived-in authenticity — not studio-white. People appear in product interaction scenes (holding, assembling, using). Images are always full-bleed within their 8px-rounded cards, never cropped to organic shapes. Gradient-to-black overlays appear at the bottom 30-40% of any image card that carries text. Occasional flat illustration appears (e.g., the Germany map with cultural iconography in teal/green/orange). Photography is editorial-confident: no stock-photo gloss, no overly stylized color grading.

## Layout

Full-bleed with centered content container capped at ~1440px. Navigation is a simple top bar, not sticky. The page is built from horizontal card sections stacked vertically with ~80px gaps. Hero pattern: split layout — 2/3 media card (image) + 1/3 solid yellow CTA card. Body sections use 2-column card grids alternating between image-led and text-led blocks. Content density is spacious, never compact. Cards are large (roughly 600x400 minimum) with generous internal padding. A timeline/history section breaks the grid with oversized numerals. No sidebar, no mega-menu, no complex navigation architecture.

## Agent Prompt Guide

## Quick Color Reference
- Background: #ffffff
- Surface warm: #fffefb
- Primary text: #111111
- Border/divider: #111111
- Accent/CTA: #ffdb00
- Text link: #0159a3
- primary action: #ffdb00 (filled action)

## Example Component Prompts

1. **Hero Media Card**: Full-bleed product image at 2/3 page width, 8px radius. Bottom-left overlay: small kicker 'A sneak peek!' in white at 14px weight 400, headline 'IKEA PS 2026 collection' in white at 51px weight 700, letter-spacing -1.48px. Gradient overlay from transparent to rgba(0,0,0,0.6) at bottom 40%. Circular play button bottom-right: 40px diameter, #111111 fill, white pause icon, 50% radius.

2. **Yellow CTA Card**: Solid #ffdb00 background, 1/3 page width, 8px radius, 40px padding. Headline 'Go shopping' in #111111 at 51px weight 700, letter-spacing -1.48px. Circular arrow button: 40px diameter, #111111 fill, white right-arrow icon, positioned to the right of or below the headline.

3. **Image Story Card**: Full-bleed editorial image, 8px radius. Gradient overlay from transparent to rgba(0,0,0,0.6) at bottom 35%. White kicker 'Market spotlight' at 13px weight 400. White headline 'Let\'s visit IKEA Germany!' at 36px weight 700, letter-spacing -0.97px. 20px padding from card edges.

4. **Top Navigation**: White background, 1px bottom border #ffffff or #f0f0f0. IKEA logo left. Text links 'Stories', 'Jobs', 'Newsroom', 'Our business' in #111111 at 14px weight 400, 24px gap between items. 16px vertical padding.

5. **Store Footer Strip**: White background, 8px radius, 16px padding. Text 'Store: IKEA.es' in #111111 at 14px weight 400, right-aligned. Small chevron-up icon in #111111, 12px size.

## Signature Design Choices

Three constraints define IKEA's visual identity more than any color or font choice: (1) The binary weight system — 400 or 700, nothing else. This eliminates 90% of typographic decision-making and forces hierarchy through size alone. (2) The single 8px radius — applied identically to hero cards, image cards, buttons, inputs, and links. Uniformity in shape reinforces the flat-pack, modular sensibility. (3) Yellow as surface, not decoration — #ffdb00 is never a border, never a text color, never a hover tint. It is a solid plane that entire cards and CTAs are built on. The contrast between a yellow card and its black text is the highest-impact moment in the entire system, and it is reserved for the single most important action on each screen.

## Similar Brands

- **H&M** — Same Scandinavian design DNA — flat layout, yellow as accent against white, 2-column card grids, no shadows, and bold sans-serif headlines with tight tracking
- **LEGO** — Similar primary-color-against-white approach with product-led card layouts, though LEGO uses red where IKEA uses yellow; both are large media cards with text overlays
- **Best Buy** — Yellow brand accent on white, bold sans-serif type, 2-column featured content grids with image cards and text overlays — comparable e-commerce editorial pattern
- **Craigslist** — Minimal interface chrome, blue text links, no decorative elements — though IKEA has far more visual hierarchy and media
- ** Depot** — Bold brand color (orange vs yellow), flat card-based homepage, large media blocks, utilitarian sans-serif type — same functional-not-pretty retail aesthetic

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-ikea-yellow: #ffdb00;
  --color-ink-black: #111111;
  --color-pure-white: #ffffff;
  --color-warm-white: #fffefb;
  --color-steel-gray: #818181;
  --color-true-black: #000000;
  --color-link-blue: #0159a3;
  --color-soft-pink: #ffa6da;

  /* Typography — Font Families */
  --font-noto-ikea: 'Noto IKEA', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 13px;
  --leading-caption: 1.4;
  --text-body: 16px;
  --leading-body: 1.57;
  --text-subheading: 20px;
  --leading-subheading: 1.2;
  --tracking-subheading: -0.54px;
  --text-heading: 36px;
  --leading-heading: 1.08;
  --tracking-heading: -0.97px;
  --text-display: 51px;
  --leading-display: 1;
  --tracking-display: -1.48px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-unit: 8px;
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-80: 80px;
  --spacing-120: 120px;

  /* Layout */
  --page-max-width: 1440px;
  --section-gap: 80px;
  --card-padding: 20px;
  --element-gap: 24px;

  /* Border Radius */
  --radius-lg: 8px;

  /* Named Radii */
  --radius-cards: 8px;
  --radius-images: 8px;
  --radius-inputs: 8px;
  --radius-buttons: 8px;
  --radius-default: 8px;

  /* Surfaces */
  --surface-page-canvas: #ffffff;
  --surface-card-surface: #ffffff;
  --surface-warm-white-surface: #fffefb;
  --surface-accent-surface: #ffdb00;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-ikea-yellow: #ffdb00;
  --color-ink-black: #111111;
  --color-pure-white: #ffffff;
  --color-warm-white: #fffefb;
  --color-steel-gray: #818181;
  --color-true-black: #000000;
  --color-link-blue: #0159a3;
  --color-soft-pink: #ffa6da;

  /* Typography */
  --font-noto-ikea: 'Noto IKEA', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 13px;
  --leading-caption: 1.4;
  --text-body: 16px;
  --leading-body: 1.57;
  --text-subheading: 20px;
  --leading-subheading: 1.2;
  --tracking-subheading: -0.54px;
  --text-heading: 36px;
  --leading-heading: 1.08;
  --tracking-heading: -0.97px;
  --text-display: 51px;
  --leading-display: 1;
  --tracking-display: -1.48px;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-80: 80px;
  --spacing-120: 120px;

  /* Border Radius */
  --radius-lg: 8px;
}
```
