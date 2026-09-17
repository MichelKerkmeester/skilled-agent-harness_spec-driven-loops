# Glitch Blog — Style Reference
> Neon zine on white paper

**Theme:** light

Glitch Blog reads as a digital zine: white paper canvas, confident sans-serif type, and almost no UI chrome between the reader and the work. The signature choice is a single electric magenta (#ff00bc) that appears sparingly — in the logo mark, link underlines, and the 'All Stories' call — giving the page a spark of personality without ever overwhelming the editorial content. Blog cards are stripped to essentials: a wide image, a small date meta line, and a medium-weight title — no shadows, no borders, no tag pills. The visual system trusts that the artwork in each post carries the page, so the interface recedes. Density is comfortable with generous 20px gaps and 48px section spacing, creating a magazine-like reading rhythm rather than a dashboard grid.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Page White | `#ffffff` | `--color-page-white` | Page canvas, card surfaces, input fills — the base everything sits on |
| Ink Black | `#000000` | `--color-ink-black` | Body text, headings, nav links, border lines, icon strokes — the dominant structural color |
| Hairline Gray | `#e4e4e4` | `--color-hairline-gray` | Footer divider border — barely-there separator |
| Input Border | `#b4b4b4` | `--color-input-border` | Search input and form field borders |
| Glitch Magenta | `#ff00bc` | `--color-glitch-magenta` | Pink accent for outlined action borders, linked labels, and lightweight interactive emphasis. Do not promote it to the primary CTA color |

## Tokens — Typography

### InterVariable — All text across the site — navigation, body, headings, dates, links. Inter Variable provides a neutral editorial voice that lets the artwork speak. Weight 400 carries body and meta, weight 600–700 carries titles and nav for confident hierarchy without serifs. · `--font-intervariable`
- **Weights:** 400, 600, 700
- **Sizes:** 14px, 16px, 18px, 20px, 40px
- **Line height:** 1.20 (display, headings), 1.38 (body, meta)
- **Role:** All text across the site — navigation, body, headings, dates, links. Inter Variable provides a neutral editorial voice that lets the artwork speak. Weight 400 carries body and meta, weight 600–700 carries titles and nav for confident hierarchy without serifs.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 14px | 1.38 | — | `--text-caption` |
| body | 16px | 1.38 | — | `--text-body` |
| body-lg | 18px | 1.38 | — | `--text-body-lg` |
| subheading | 20px | 1.2 | — | `--text-subheading` |
| display | 40px | 1.2 | — | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 8 | 8px | `--spacing-8` |
| 16 | 16px | `--spacing-16` |
| 20 | 20px | `--spacing-20` |
| 28 | 28px | `--spacing-28` |
| 48 | 48px | `--spacing-48` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 0px |
| cards | 0px |
| images | 0px |
| buttons | 0px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 48px
- **Card padding:** 0px
- **Element gap:** 20px

## Components

### Featured Blog Post (Hero)
**Role:** Top-of-page editorial lead with full-width image and oversized title

Full-bleed wide aspect image (roughly 16:7), no border, no radius, no shadow. Below the image: date meta at 14px/400 in Ink Black, then a 40px/600 display title. Sits directly on the white canvas — spacing between hero and grid below is 48px.

### Blog Post Card (Grid Item)
**Role:** 3-column grid entry for standard blog posts

Rectangular image (roughly 4:3) at full card width, sharp 0px corners, no border. Below: date at 14px/400 Ink Black, 20px gap to title at 18–20px/600. No card background, no shadow, no border — the image and typography alone define the card.

### Primary Navigation Link
**Role:** Top-bar category links

16px/600 Ink Black text, no underline by default. Spaced horizontally with ~20px gaps. On hover, the Glitch Magenta (#ff00bc) appears as a 2px bottom border — the link 'lights up' rather than recolors.

### Logo Lockup
**Role:** Brand mark in the top-left

Glitch bug icon in Glitch Magenta (#ff00bc) at ~32px, paired with 'Glitch' in 20px/700 Ink Black and 'Blog' in 20px/400 Ink Black. The pink mark is the only chromatic element in the header.

### Search Trigger
**Role:** Utility action in top-right

'Search' text label at 16px/600 Ink Black with a small magnifying-glass icon stroke. No button chrome — sits as a plain interactive text element.

### Footer Divider
**Role:** Thin separator above the 'All Stories' link

1px Hairline Gray (#e4e4e4) horizontal line, full container width. The only visible border in the entire page chrome.

### All Stories Link
**Role:** Archive navigation, bottom-right of grid

16px/600 Glitch Magenta (#ff00bc) text with a trailing right-arrow chevron. Right-aligned. The magenta-on-white inversion is the page's strongest color moment and the only 'CTA-like' element.

### Date Meta Line
**Role:** Publication date beneath each post image

14px/400 Ink Black, full weekday + month + day + year format (e.g. 'Wednesday, July 23, 2025'). Spacing 20px between date and title — this gap is the structural rhythm of every card.

### Inline Link
**Role:** In-body or list links within content

Ink Black text with a 2px Glitch Magenta (#ff00bc) bottom border. The magenta underline replaces the default blue link — Glitch's signature link treatment is black text with an electric-pink rule.

## Do's and Don'ts

### Do
- Use #ff00bc only as ink (borders, link underlines, logo mark, small CTAs) — never as large background fills
- Keep all card and image corners at 0px — the sharp edges reinforce the editorial/zine feel
- Use the 20px gap between date meta and post title on every card — it is the page's structural rhythm
- Let blog post images carry visual variety — the UI chrome stays monochrome so artwork stands out
- Use Inter at 600/700 for titles and nav, 400 for body and meta — never mix more than three weights per page
- Separate sections with 48px of whitespace, not with borders or background bands
- Use #000000 for all body, heading, nav, and border text — keep the palette to ink, paper, and one magenta

### Don't
- Don't apply box-shadows or borders to blog cards — the grid spacing alone should define each post
- Don't use #ff00bc as a button fill or large surface — it loses its spark when used as paint rather than ink
- Don't introduce a second accent color — the system is monochrome plus one magenta
- Don't add border-radius to images, buttons, or cards — sharp corners are a signature choice
- Don't use a serif font anywhere — Inter Variable covers the full hierarchy and mixing would break the system
- Don't use dividers, rules, or background tints to separate grid rows — whitespace does the work
- Don't use blue for links — the magenta underline is the brand's link convention and replacing it flattens the identity

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Page Canvas | `#ffffff` | Base page background — the paper |
| 1 | Card Surface | `#ffffff` | Blog post cards and featured post — no elevation, no border, just implicit separation by spacing |

## Elevation

No shadows, no borders, no elevation. Cards and surfaces are defined entirely by whitespace and the image's own edge. The page sits flat on the white canvas at z-index zero — the only depth is the image-to-text vertical stacking within each card. This is a deliberate editorial choice: shadows would imply a dashboard or product UI, which this is not.

## Imagery

Imagery is the primary content layer and the reason the page exists. The blog features a mix of full-color digital illustrations (a rainbow-gradient scene with a writer and color swatches), abstract graphic art, product screenshots, editorial photography, and collage-style compositions. Treatment: every image fills its card edge-to-edge with zero padding, zero border-radius, and no overlaid text. Images are displayed at their natural aspect ratios (roughly 4:3 for grid cards, 16:7 for the hero) without cropping masks or vignettes. Color treatment varies wildly by post — some images are saturated rainbow, others are near-monochrome duotone — which is intentional: the UI stays neutral so each post's art can be its own color statement. There are no decorative stock photos, no abstract gradient backgrounds in the chrome, and no icon-heavy illustrations. Density is image-heavy: roughly 50% of every screen is visual content, the other 50% is type.

## Layout

Centered max-width container (~1200px) with generous side padding. The page reads top-to-bottom in three bands: header (logo left, nav center-left, search right), featured hero post (full-width image + meta + display title), and a 3-column grid of standard blog cards filling the remaining viewport. Below the grid: a thin hairline divider and a right-aligned 'All Stories' archive link. Navigation is a single horizontal text-only row — no sticky header, no sidebar, no mega-menu. Section rhythm is whitespace-driven: no alternating background bands, no colored sections, no visual dividers other than the one hairline before the footer link. The grid columns are equal-width with ~20px gaps between cards. Vertical spacing between the hero and grid is ~48px; between cards within the grid is ~20px. The page is content-first and completely unornamented — the layout's job is to disappear so the posts can speak.

## Agent Prompt Guide

**Quick Color Reference**
- text: #000000
- background: #ffffff
- border: #e4e4e4 (footer hairline) / #b4b4b4 (inputs)
- accent: #ff00bc (Glitch Magenta — link underlines, logo, 'All Stories')
- primary action: #ff00bc (outlined action border)

**Example Component Prompts**
1. *Featured blog post hero*: Full-width image at 16:7 aspect, 0px radius, no border, no shadow, directly on the #ffffff canvas. Below image, 48px gap, then a date meta at 14px/400 in #000000, then 20px gap, then a title at 40px/600 in #000000 with 1.20 line-height.

2. *Grid blog card (3-column)*: 4:3 image at full card width, 0px radius, no border. 20px gap to date meta at 14px/400 #000000. 20px gap to title at 18px/600 #000000 with 1.38 line-height. No card background, no shadow, no padding around the image.

3. *Navigation link with magenta hover*: 16px/600 #000000 text, no default underline. On hover, a 2px solid #ff00bc border-bottom appears. Links spaced ~20px apart in a single horizontal row.

4. *Inline link in body copy*: 16px/400 #000000 text with a 2px solid #ff00bc border-bottom. Black text, pink rule — the signature Glitch link treatment.

5. *All Stories archive link*: 16px/600 #ff00bc text, right-aligned, with a trailing '›' chevron. No background, no border, no padding — colored text is the entire treatment.

## Similar Brands

- **Substack Blog** — Same editorial-blog-on-white-canvas model with stripped-down cards (image, date, title) and zero UI chrome
- **Vercel Blog** — Same minimal monochrome system with a single strong brand accent and zero shadows or borders on content cards
- **Notion Blog** — Same content-first blog grid with featured hero above a multi-column card layout and clean Inter-style type
- **Are.na Blog** — Same zine-like editorial sensibility where the interface recedes and the imagery carries the page

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-page-white: #ffffff;
  --color-ink-black: #000000;
  --color-hairline-gray: #e4e4e4;
  --color-input-border: #b4b4b4;
  --color-glitch-magenta: #ff00bc;

  /* Typography — Font Families */
  --font-intervariable: 'InterVariable', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.38;
  --text-body: 16px;
  --leading-body: 1.38;
  --text-body-lg: 18px;
  --leading-body-lg: 1.38;
  --text-subheading: 20px;
  --leading-subheading: 1.2;
  --text-display: 40px;
  --leading-display: 1.2;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-28: 28px;
  --spacing-48: 48px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 48px;
  --card-padding: 0px;
  --element-gap: 20px;

  /* Named Radii */
  --radius-tags: 0px;
  --radius-cards: 0px;
  --radius-images: 0px;
  --radius-buttons: 0px;

  /* Surfaces */
  --surface-page-canvas: #ffffff;
  --surface-card-surface: #ffffff;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-page-white: #ffffff;
  --color-ink-black: #000000;
  --color-hairline-gray: #e4e4e4;
  --color-input-border: #b4b4b4;
  --color-glitch-magenta: #ff00bc;

  /* Typography */
  --font-intervariable: 'InterVariable', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.38;
  --text-body: 16px;
  --leading-body: 1.38;
  --text-body-lg: 18px;
  --leading-body-lg: 1.38;
  --text-subheading: 20px;
  --leading-subheading: 1.2;
  --text-display: 40px;
  --leading-display: 1.2;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-28: 28px;
  --spacing-48: 48px;
}
```
