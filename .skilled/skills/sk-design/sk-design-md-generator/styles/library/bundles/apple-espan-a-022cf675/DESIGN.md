# Apple (España) — Style Reference
> gallery vitrine in morning fog

**Theme:** light

Apple's product page visual system is a near-monochrome cathedral of negative space where a single product floats centered under enormous display type. The canvas is fog-gray #f5f5f7 with pure white surfaces layered above, and the entire chromatic range is reduced to one precise blue (#0071e3) that exists only to make the buy button switch on. Typography carries the design: SF Pro Display at weight 600 with aggressive negative tracking at 56–96px creates headlines that feel carved rather than typed, while body copy at 17–21px stays whisper-thin to let the product breathe. Components are reduced to essential geometry — pill buttons at 980px radius, rounded cards at 28px, no shadows, no decorative borders — so the imagery and type do all the emotional work.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Apple Ink | `#1d1d1f` | `--color-apple-ink` | Primary text, card borders, structural outlines — near-black with a hint of warmth prevents harshness against the fog canvas |
| Fog Canvas | `#f5f5f7` | `--color-fog-canvas` | Page background, badge fills, secondary surfaces — the signature Apple light gray that defines the gallery atmosphere |
| Pure White | `#ffffff` | `--color-pure-white` | Card surfaces, icon fills, elevated layers above fog canvas |
| Graphite | `#707070` | `--color-graphite` | Secondary text, subdued borders, nav dividers |
| Slate | `#86868b` | `--color-slate` | Muted helper text, tertiary metadata, de-emphasized labels |
| Charcoal | `#333336` | `--color-charcoal` | Nav bar elements, button borders on dark surfaces, structural strokes |
| Smoke | `#474747` | `--color-smoke` | Nav text and borders, link borders in secondary contexts |
| Iron | `#5b5b61` | `--color-iron` | Body text in lower-emphasis contexts, subtle borders |
| Ash | `#e8e8ed` | `--color-ash` | Ghost button backgrounds, inactive chip surfaces, soft separators |
| Electric Blue | `#0071e3` | `--color-electric-blue` | Buy button fill, primary action background — the only chromatic surface in the system, reserved exclusively for conversion |
| Link Blue | `#0066cc` | `--color-link-blue` | Inline text links, Learn more arrows, navigational text accents |
| Iridescent Spectrum | `linear-gradient(60deg, rgb(8, 148, 255) 0%, rgb(201, 89, 221) 40%, rgb(255, 46, 84) 67%, rgb(255, 144, 3) 100%)` | `--color-iridescent-spectrum` | Decorative imagery gradient spanning cyan, violet, magenta, amber — appears only in the product's light-ring visual, never in UI controls |

## Tokens — Typography

### SF Pro Display — Display and headings — weight 600 at 56–96px with aggressive negative tracking (up to -0.022em) creates headlines that read as carved geometry rather than typed copy; feature labels at 19–28px use slight positive tracking (0.004–0.012em) to breathe as small caps-like marks · `--font-sf-pro-display`
- **Substitute:** Inter Tight, or system-ui at weight 600
- **Weights:** 600
- **Sizes:** 19, 21, 24, 28, 32, 56, 72, 80, 96
- **Line height:** 1.07, 1.14, 1.19, 1.21
- **Letter spacing:** -0.015em at 19px, -0.012em at 21px, -0.009em at 28px, -0.005em at 32px, 0.004em at 56px, 0.007em at 72px, 0.009em at 80px, 0.012em at 96px
- **OpenType features:** `"numr" on`
- **Role:** Display and headings — weight 600 at 56–96px with aggressive negative tracking (up to -0.022em) creates headlines that read as carved geometry rather than typed copy; feature labels at 19–28px use slight positive tracking (0.004–0.012em) to breathe as small caps-like marks

### SF Pro Text — Body copy, navigation, supporting text — 17px at weight 400 is the default reading size; 20px for lead paragraphs; 12px for legal and footnote text; 44px reserved for large interactive text. Negative tracking tightens at all sizes (-0.022em to -0.003em) · `--font-sf-pro-text`
- **Substitute:** Inter, or system-ui
- **Weights:** 400, 600
- **Sizes:** 12, 17, 20, 44
- **Line height:** 1.33, 1.47, 1.83
- **Letter spacing:** -0.022em at 12px, -0.019em at 17px, -0.01em at 20px, -0.003em at 44px
- **OpenType features:** `"numr" on`
- **Role:** Body copy, navigation, supporting text — 17px at weight 400 is the default reading size; 20px for lead paragraphs; 12px for legal and footnote text; 44px reserved for large interactive text. Negative tracking tightens at all sizes (-0.022em to -0.003em)

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.33 | -0.22px | `--text-caption` |
| body-sm | 17px | 1.47 | -0.32px | `--text-body-sm` |
| body | 20px | 1.47 | -0.2px | `--text-body` |
| subheading | 28px | 1.14 | -0.25px | `--text-subheading` |
| heading-sm | 32px | 1.19 | -0.16px | `--text-heading-sm` |
| heading | 56px | 1.07 | 0.22px | `--text-heading` |
| heading-lg | 72px | 1.07 | 0.5px | `--text-heading-lg` |
| display | 96px | 1.07 | 1.15px | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 8 | 8px | `--spacing-8` |
| 12 | 12px | `--spacing-12` |
| 16 | 16px | `--spacing-16` |
| 20 | 20px | `--spacing-20` |
| 24 | 24px | `--spacing-24` |
| 28 | 28px | `--spacing-28` |
| 32 | 32px | `--spacing-32` |
| 40 | 40px | `--spacing-40` |
| 44 | 44px | `--spacing-44` |
| 48 | 48px | `--spacing-48` |
| 52 | 52px | `--spacing-52` |
| 76 | 76px | `--spacing-76` |
| 80 | 80px | `--spacing-80` |
| 100 | 100px | `--spacing-100` |
| 160 | 160px | `--spacing-160` |

### Border Radius

| Element | Value |
|---------|-------|
| nav | 980px |
| tags | 999px |
| cards | 28px |
| images | 28px |
| buttons | 980px |

### Layout

- **Page max-width:** 1440px
- **Section gap:** 120px
- **Card padding:** 28px
- **Element gap:** 10px

## Components

### Global Nav Bar
**Role:** Persistent top navigation across all Apple product pages

Full-width bar at 48px height, background #1d1d1f with 0.8 opacity creating a translucent dark band. Inner content centered at max-width 1024px with horizontal padding 10px. Apple logo on the left, category links in a single row, search and bag icons on the right. Text at 12px SF Pro Text weight 400, color #f5f5f7, letter-spacing -0.01em. No visible borders or shadows — floats over content with subtle backdrop blur.

### Hero Product Visual
**Role:** Full-bleed centerpiece of the product page

Centered product render or photograph occupying the top 60–80vh of the page. No card container, no border, no background frame — the product sits directly on Fog Canvas #f5f5f7. Aspect ratio varies (typically 16:9 or 4:3), always centered. Sometimes layered with iridescent light-ring gradients as decorative atmospheric effects.

### Hero Headline Block
**Role:** Product name and tagline anchoring the hero

Left-aligned stack positioned in the lower-left quadrant of the hero. Product name in SF Pro Display weight 600 at 21px, color #1d1d1f. Main headline in SF Pro Display weight 600 at 56–80px, color #1d1d1f, line-height 1.07, letter-spacing tightening at scale. Subtext in SF Pro Text weight 400 at 17px, color #707070. Generous spacing between lines (~8–12px).

### Price and Buy Button Group
**Role:** Conversion cluster in the hero

Price label at 17px SF Pro Text weight 400, color #1d1d1f, positioned to the left. Buy button (Comprar) as a pill at 980px border-radius, background #0071e3, text white at 17px weight 400, padding 8px 16px, positioned right of price with 12px gap. Button has no border, no shadow. This is the only place the brand blue appears as a fill.

### Inline Text Link
**Role:** Learn more, Ver el video, and navigational text accents

Plain text at 17px SF Pro Text weight 400, color #0066cc, no underline by default. Often paired with a small inline play icon or arrow. Used for secondary actions where a full button would be too heavy.

### Feature Section Heading
**Role:** Section title above large feature visuals

Short noun phrase (1–3 words like 'Lo principal.') in SF Pro Display weight 600 at 32–56px, color #1d1d1f, left-aligned with page gutter padding. A 'Watch the film' link sits opposite in #0066cc at 17px. Massive vertical breathing room (80–120px) above and below.

### Feature Visual Block
**Role:** Large editorial image or animation with overlaid caption

Full-width or large centered image/video (typically 1200–1440px wide) with rounded corners at 28px. Caption text overlaid or positioned above in SF Pro Text weight 400 at 17–21px, color #1d1d1f, centered. No card background, no border, no shadow — the image edge itself is the container.

### Ghost Button
**Role:** Secondary action on light backgrounds

Border at 1px #1d1d1f, border-radius 980px (pill), background transparent, text #1d1d1f at 17px SF Pro Text weight 400, padding 10px 20px. Hover state fills to #1d1d1f with white text. Used for 'Watch the film' or secondary CTAs when the primary blue is already present.

### Badge Chip
**Role:** Small inline status or label

Background #f5f5f7, border-radius 999px (pill), padding 4px 10px, text at 12px SF Pro Text weight 400, color #1d1d1f. No border. Used sparingly for new-arrival tags, availability indicators, or feature labels.

## Do's and Don'ts

### Do
- Use #0071e3 exclusively for the buy/conversion button — never for links, icons, or decorative elements
- Set all display headlines at SF Pro Display weight 600 with line-height 1.07; tighten tracking to -0.005em at 32px and open to 0.012em at 96px
- Layer surfaces as Fog Canvas #f5f5f7 → Pure White #ffffff → #e8e8ed for ghost controls — never introduce new background colors
- Apply 28px border-radius to all image and card containers; 980px for pills; 999px for chips — no sharp corners anywhere
- Set body text at 17px SF Pro Text weight 400 in #1d1d1f or #707070; never go below 12px for any visible text
- Use #0066cc for inline text links only — no underlines, no background fills, no button shapes
- Center all product visuals horizontally; let the headline block sit lower-left with generous negative space dominating the composition

### Don't
- Don't use shadows, gradients, or elevation effects on any card or button — the system is flat by design
- Don't introduce accent colors beyond the iridescent spectrum gradient — the palette is monochrome plus one blue
- Don't set headlines below 32px; this system relies on enormous type as the primary visual element
- Don't use border-radius below 18px on any container — sharpness is not in the vocabulary
- Don't apply #0071e3 to text, borders, or icons — it is a button fill only, used in conversion moments
- Don't add decorative dividers, rules, or section separators between content blocks — whitespace is the only divider
- Don't mix font families; SF Pro Display for display roles, SF Pro Text for body — never substitute a serif or display face

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Fog Canvas | `#f5f5f7` | Base page background, the signature Apple light gray atmosphere |
| 1 | Pure White | `#ffffff` | Card surfaces, elevated content blocks, icon fills on dark nav |
| 2 | Ash | `#e8e8ed` | Ghost button fills, inactive chip backgrounds, subtle interactive surfaces |
| 3 | Electric Blue | `#0071e3` | Primary action button — the single chromatic surface in the entire system |

## Elevation

The system is intentionally flat: no shadows, no blur, no stacked elevation. Depth is created through surface color progression (#f5f5f7 → #ffffff → #e8e8ed) and the generous scale of typography, not through drop shadows or layered cards. The only edge treatment is the 28px radius on image and card containers, which softens boundaries without creating visual weight.

## Imagery

Product photography and high-fidelity 3D renders dominate, always centered and presented as the hero subject. Images float on the fog canvas with no frame, no card background, no border — the object is its own container, often occupying 60–80% of the viewport width. A signature visual element is the iridescent light-ring gradient (cyan → violet → magenta → amber at 60°) that appears behind or around the product, rendered as a prismatic optical effect rather than a flat graphic. Lifestyle photography is minimal and tightly cropped, focused on hands or silhouettes wearing the product in motion, always desaturated or rendered in near-monochrome to maintain the gallery atmosphere. No stock photography, no illustration, no abstract graphics — the product is the entire visual language.

## Layout

Full-bleed pages with a max content width of 1024–1440px centered on the fog canvas. The hero is a single full-viewport-height section with the product visual centered and the headline block anchored to the lower-left, creating an asymmetric composition. Feature sections alternate between full-width editorial images (1200–1440px) and centered text-only blocks, with vertical spacing of 80–120px between sections — rhythm is created by scale changes and whitespace, not by alternating background colors. Navigation is a single dark translucent bar fixed at the top (48px height). The grid is implicit: single-column for most content, breaking into 2-column or 3-column card grids only for comparison or accessory sections. Density is sparse — each page has 3–5 major sections maximum, each given room to breathe.

## Agent Prompt Guide

**Quick Color Reference**
- text (primary): #1d1d1f
- text (secondary): #707070
- background (canvas): #f5f5f7
- surface (card): #ffffff
- border / divider: #d6d6d6
- accent: #0066cc (links)
- primary action: #0071e3 (filled action)

**Example Component Prompts**
1. **Hero Headline Block**: Product name at 21px SF Pro Display weight 600, #1d1d1f. Main headline at 72px weight 600, #1d1d1f, line-height 1.07, letter-spacing 0.007em. Subtext at 17px SF Pro Text weight 400, #707070. Positioned lower-left of a full-viewport centered product image on #f5f5f7 canvas.

2. **Buy Button**: Pill shape, border-radius 980px, background #0071e3, text white at 17px SF Pro Text weight 400, padding 8px 16px. No border, no shadow. Place right of a price label at 17px #1d1d1f with 12px gap.

3. **Feature Section**: Short heading (1–3 words) at 48px SF Pro Display weight 600, #1d1d1f, left-aligned with 40px page gutter. A 'Watch the film' link in #0066cc at 17px sits opposite. Below: a full-width image at 28px border-radius, centered, with caption at 19px #1d1d1f overlaid or positioned above.

4. **Ghost Button**: Border 1px #1d1d1f, border-radius 980px, background transparent, text #1d1d1f at 17px weight 400, padding 10px 20px. Use for secondary CTAs like 'Learn more' or 'Watch the film'.

5. **Inline Link**: Text at 17px SF Pro Text weight 400, color #0066cc, no underline. Optionally paired with a small inline arrow or play icon. Use for 'Ver el video', 'Learn more', and navigational text.

## Typography Philosophy

The system uses Apple's two-tier type split: SF Pro Display at weight 600 for all headings and feature labels, SF Pro Text at weight 400 for body and weight 600 for nav. The critical signature is the tracking behavior: tracking tightens (goes negative) as size decreases below 32px, then opens (goes positive) as size scales above 56px. This means 12px text sits at -0.022em while 96px display text sits at +0.012em — a 3.4-point swing across the scale. The effect is that large headlines feel monumentally stable while small text remains crisp and dense. Line-height compresses at display sizes (1.07) and opens at body sizes (1.47–1.83), creating the characteristic Apple rhythm where headlines feel sculpted and body text breathes.

## Similar Brands

- **Bang & Olufsen** — Same product-as-sculpture philosophy with massive display type, near-monochrome palette, and minimal UI chrome around a centered hero product
- **Teenage Engineering** — Gallery-style product pages with enormous typography, generous whitespace, and a single product floating on a neutral canvas
- **Nothing (tech)** — Minimalist product page aesthetic with dot-matrix type, monochrome surfaces, and a single accent color for CTAs
- **Dyson** — Product-hero pages with centered floating product renders, large feature labels, and restrained UI that defers to the object
- **Leica Camera** — Editorial product photography with minimal type, no decorative borders, and a museum-vitrine presentation of a single product

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-apple-ink: #1d1d1f;
  --color-fog-canvas: #f5f5f7;
  --color-pure-white: #ffffff;
  --color-graphite: #707070;
  --color-slate: #86868b;
  --color-charcoal: #333336;
  --color-smoke: #474747;
  --color-iron: #5b5b61;
  --color-ash: #e8e8ed;
  --color-electric-blue: #0071e3;
  --color-link-blue: #0066cc;
  --color-iridescent-spectrum: #c959dd;
  --gradient-iridescent-spectrum: linear-gradient(60deg, rgb(8, 148, 255) 0%, rgb(201, 89, 221) 40%, rgb(255, 46, 84) 67%, rgb(255, 144, 3) 100%);

  /* Typography — Font Families */
  --font-sf-pro-display: 'SF Pro Display', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-sf-pro-text: 'SF Pro Text', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.33;
  --tracking-caption: -0.22px;
  --text-body-sm: 17px;
  --leading-body-sm: 1.47;
  --tracking-body-sm: -0.32px;
  --text-body: 20px;
  --leading-body: 1.47;
  --tracking-body: -0.2px;
  --text-subheading: 28px;
  --leading-subheading: 1.14;
  --tracking-subheading: -0.25px;
  --text-heading-sm: 32px;
  --leading-heading-sm: 1.19;
  --tracking-heading-sm: -0.16px;
  --text-heading: 56px;
  --leading-heading: 1.07;
  --tracking-heading: 0.22px;
  --text-heading-lg: 72px;
  --leading-heading-lg: 1.07;
  --tracking-heading-lg: 0.5px;
  --text-display: 96px;
  --leading-display: 1.07;
  --tracking-display: 1.15px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-semibold: 600;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-28: 28px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-44: 44px;
  --spacing-48: 48px;
  --spacing-52: 52px;
  --spacing-76: 76px;
  --spacing-80: 80px;
  --spacing-100: 100px;
  --spacing-160: 160px;

  /* Layout */
  --page-max-width: 1440px;
  --section-gap: 120px;
  --card-padding: 28px;
  --element-gap: 10px;

  /* Border Radius */
  --radius-lg: 10px;
  --radius-2xl: 18px;
  --radius-3xl: 25px;
  --radius-3xl-2: 28px;
  --radius-3xl-3: 32px;
  --radius-3xl-4: 36px;
  --radius-full: 980px;
  --radius-full-2: 999px;

  /* Named Radii */
  --radius-nav: 980px;
  --radius-tags: 999px;
  --radius-cards: 28px;
  --radius-images: 28px;
  --radius-buttons: 980px;

  /* Surfaces */
  --surface-fog-canvas: #f5f5f7;
  --surface-pure-white: #ffffff;
  --surface-ash: #e8e8ed;
  --surface-electric-blue: #0071e3;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-apple-ink: #1d1d1f;
  --color-fog-canvas: #f5f5f7;
  --color-pure-white: #ffffff;
  --color-graphite: #707070;
  --color-slate: #86868b;
  --color-charcoal: #333336;
  --color-smoke: #474747;
  --color-iron: #5b5b61;
  --color-ash: #e8e8ed;
  --color-electric-blue: #0071e3;
  --color-link-blue: #0066cc;
  --color-iridescent-spectrum: #c959dd;

  /* Typography */
  --font-sf-pro-display: 'SF Pro Display', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-sf-pro-text: 'SF Pro Text', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.33;
  --tracking-caption: -0.22px;
  --text-body-sm: 17px;
  --leading-body-sm: 1.47;
  --tracking-body-sm: -0.32px;
  --text-body: 20px;
  --leading-body: 1.47;
  --tracking-body: -0.2px;
  --text-subheading: 28px;
  --leading-subheading: 1.14;
  --tracking-subheading: -0.25px;
  --text-heading-sm: 32px;
  --leading-heading-sm: 1.19;
  --tracking-heading-sm: -0.16px;
  --text-heading: 56px;
  --leading-heading: 1.07;
  --tracking-heading: 0.22px;
  --text-heading-lg: 72px;
  --leading-heading-lg: 1.07;
  --tracking-heading-lg: 0.5px;
  --text-display: 96px;
  --leading-display: 1.07;
  --tracking-display: 1.15px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-28: 28px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-44: 44px;
  --spacing-48: 48px;
  --spacing-52: 52px;
  --spacing-76: 76px;
  --spacing-80: 80px;
  --spacing-100: 100px;
  --spacing-160: 160px;

  /* Border Radius */
  --radius-lg: 10px;
  --radius-2xl: 18px;
  --radius-3xl: 25px;
  --radius-3xl-2: 28px;
  --radius-3xl-3: 32px;
  --radius-3xl-4: 36px;
  --radius-full: 980px;
  --radius-full-2: 999px;
}
```
