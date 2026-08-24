# Pop Site — Style Reference
> Stark typographic gallery — monumental black headlines floating on white walls, with one blue dot of intent.

**Theme:** light

Pop Site is a stark typographic gallery: an almost exclusively white canvas where oversized Satoshi display headlines — often 93–120px — carry the entire visual weight. A single vivid blue (#3b82f6) is the only chromatic note in the system, reserved exclusively for primary CTAs, active links, and subtle surface washes; everything else is monochrome grays and blacks at near-maximum contrast. Components are quiet and confident: pill-shaped buttons, hairline borders, softly rounded cards, and phone mockups as hero subjects. The density is airy and editorial, with comfortable spacing between sections and text that breathes. This is a builder site that wants to feel like a product page for the product it helps you build — Apple-adjacent restraint, Linear-grade precision, Carrd-grade simplicity.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Page White | `#ffffff` | `--color-page-white` | Page background, card surfaces, button text on blue |
| Ink Black | `#000000` | `--color-ink-black` | Primary heading text, heavy borders, icon fills, image framing |
| Charcoal | `#171717` | `--color-charcoal` | Body text, nav text, secondary borders — slightly softer than pure black for long-form readability |
| Granite | `#5e5e5e` | `--color-granite` | Muted helper text, secondary descriptions |
| Slate | `#6e6e73` | `--color-slate` | Tertiary text, disabled states, fine metadata |
| Mist | `#d2d2d7` | `--color-mist` | Hairline dividers, nav accents, light surface variation |
| Wash Blue | `#e3eeff` | `--color-wash-blue` | Soft blue surface wash for highlighted sections and subtle backgrounds |
| Signal Blue | `#3b82f6` | `--color-signal-blue` | Primary CTA fills, active link borders, key accent — the only chromatic color allowed to draw the eye |
| Link Blue | `#6ea5ff` | `--color-link-blue` | Lighter blue for link text and secondary outlined actions |

## Tokens — Typography

### sans-serif — sans-serif — detected in extracted data but not described by AI · `--font-sans-serif`
- **Weights:** 400
- **Sizes:** 12px
- **Line height:** 1.2
- **Role:** sans-serif — detected in extracted data but not described by AI

### Satoshi — Primary display and UI font — used for all headlines at extreme sizes (93–120px) with weight 700 and tight tracking; also for body at 15px weight 400. Satoshi's geometric, slightly humanist forms give the type a modern, builder-friendly character. The decision to run 93–120px display sizes is signature — most builder sites cap at 48–64px, and this scale creates editorial monumentality. · `--font-satoshi`
- **Substitute:** Inter, General Sans, Switzer
- **Weights:** 400, 500, 700
- **Sizes:** 12, 13, 15, 21, 53, 93, 120px
- **Line height:** 0.90, 1.00, 1.20, 1.30, 1.40
- **Letter spacing:** -7.08px at 120px, -4.65px at 93px, -2.44px at 53px, -0.63px at 21px, normal at 12–15px
- **Role:** Primary display and UI font — used for all headlines at extreme sizes (93–120px) with weight 700 and tight tracking; also for body at 15px weight 400. Satoshi's geometric, slightly humanist forms give the type a modern, builder-friendly character. The decision to run 93–120px display sizes is signature — most builder sites cap at 48–64px, and this scale creates editorial monumentality.

### Inter — Input field text — the only context where Inter appears, used for form input legibility where Satoshi's tighter geometry could feel cramped. · `--font-inter`
- **Substitute:** system-ui, -apple-system
- **Weights:** 400
- **Sizes:** 14px
- **Line height:** 1.20
- **Role:** Input field text — the only context where Inter appears, used for form input legibility where Satoshi's tighter geometry could feel cramped.

### system-ui — System fallback and minor inline elements. Acts as the safety net for Satoshi; not visually load-bearing. · `--font-system-ui`
- **Substitute:** sans-serif
- **Weights:** 400
- **Sizes:** 12px
- **Line height:** 1.20
- **Role:** System fallback and minor inline elements. Acts as the safety net for Satoshi; not visually load-bearing.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.2 | — | `--text-caption` |
| body | 15px | 1.4 | — | `--text-body` |
| subheading | 21px | 1.3 | -0.63px | `--text-subheading` |
| heading | 53px | 1.2 | -2.44px | `--text-heading` |
| display | 93px | 1 | -4.65px | `--text-display` |
| display-xl | 120px | 0.9 | -7.08px | `--text-display-xl` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 8 | 8px | `--spacing-8` |
| 12 | 12px | `--spacing-12` |
| 16 | 16px | `--spacing-16` |
| 20 | 20px | `--spacing-20` |
| 24 | 24px | `--spacing-24` |
| 36 | 36px | `--spacing-36` |
| 40 | 40px | `--spacing-40` |
| 60 | 60px | `--spacing-60` |
| 80 | 80px | `--spacing-80` |
| 120 | 120px | `--spacing-120` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 8px |
| images | 22px |
| inputs | 8px |
| buttons | 9999px |
| smallImages | 42px |
| featureCards | 22px |
| secondaryButtons | 26px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 20px
- **Element gap:** 12-16px

## Components

### Primary Pill Button
**Role:** Main conversion action (Claim, Get Started, Sign Up)

Background #3b82f6, text #ffffff, Satoshi weight 500 at 15px. Fully rounded radius (9999px). Padding 12px 24px. No border. Hover: slight darken to #2f6fd6. This is the only element in the system that carries full color saturation — treat it as scarce, one per screen maximum.

### Secondary Pill Button
**Role:** Secondary action or form suffix

Background #ffffff, border 1px solid #171717, text #171717. Radius 9999px. Padding 10px 20px. Satoshi weight 500 at 15px. Used for the .pop.site suffix in the claim form, ghost actions, and complementary CTAs.

### Tertiary Rounded Button
**Role:** Medium-prominence action with slight radius instead of full pill

Radius 26px instead of pill. Same color and border logic as secondary. Used when a pill feels too playful and a sharper button feels too rigid — a middle ground for inline actions.

### Inline Claim Form
**Role:** Hero lead-capture combining input + suffix + button in a single pill

Container is a white pill (radius 9999px) with 1px #171717 border, internally containing: a text input with placeholder 'yourname' (borderless, Satoshi 15px weight 400), a suffix badge '.pop.site' styled as a secondary button, and the primary blue CTA. The whole assembly reads as one unified control — the input is borderless to merge into the pill.

### Social Proof Badge
**Role:** Small inline pill above hero headlines

Centered above the hero. Light text on white, Satoshi 13px weight 400, inside a thin-bordered pill (radius 9999px, 1px #d2d2d7 border). The badge text includes a bolded brand name for emphasis.

### Hero Phone Mockup Carousel
**Role:** Visual showcase of product output — actual sites built on the platform

Row of overlapping phone frames (iPhone proportions), each showing a real site template. Frames have 22px radius with black borders. Arranged in a slight fanned/overlapping layout with drop shadows only on the frames (0 20px 40px rgba(0,0,0,0.12)) to separate them from the canvas. The phones ARE the hero — no illustration, no abstract graphics.

### Section Showcase Card
**Role:** Category tile showing a section type (Links, Socials, Forms, etc.)

White card, 8px radius, 1px #171717 border, padding 20px. Contains: a phone-screen preview image at top (rounded 8px) with light gray surface (#f5f5f7), a title in Satoshi weight 500 at 21px, and a 2–3 line description in Satoshi weight 400 at 13px in #5e5e5e. Arranged in a 3-column grid.

### Phone Preview Frame
**Role:** Static phone mockup used in cards and content blocks

Black-bordered phone frame with 22px outer radius, showing a mini site template inside. The screen content is white with black text and occasional blue CTA — mirroring the system it demos. Inner content radius 18–20px to feel natural inside the frame.

### Navigation Bar
**Role:** Top-of-page global navigation

White background, no visible border (blends into page), no shadow. Left: brand wordmark 'pop site*' in Satoshi weight 700 at ~18px with an asterisk. Right: text-only nav links (Pricing, Sections, Blog, Featured, Memberships) in Satoshi weight 400 at 13–15px, spaced with 13px gaps, plus 'Create Account' and 'Log In' text links. No background buttons in the nav — everything is text.

### Section Heading Block
**Role:** Centered display headline introducing each major section

Centered alignment. Display-size Satoshi weight 700 at 53–93px in #000000, line-height 1.0–1.1, with negative letter-spacing matching the size. Followed by a 1–2 line subhead in Satoshi 15–21px weight 400 in #5e5e5e. A small 'See all below' link in #3b82f6 sits below. Generous margin: 40–60px top and bottom.

### Footer
**Role:** Site footer with links and brand mark

White background with 22px top border-radius on inner blocks. Satoshi weight 400 at 13px in #5e5e5 for link text. Minimal, often just a few link columns. No heavy background color — stays in the white system.

### Floating Action Widget
**Role:** Small dark circular button in bottom-right (chat/help trigger)

40px circle, #171717 background, white icon inside. Sits absolutely positioned in viewport corner. Subtle but constant presence across the page.

## Do's and Don'ts

### Do
- Use Satoshi weight 700 at 53–120px for all section headlines — the oversized display type is the visual signature
- Reserve #3b82f6 exclusively for primary CTAs and active link states — never use it for decoration, icons, or backgrounds outside of action contexts
- Apply 1px borders in #171717 or #000000 for card definition rather than relying on drop shadows
- Use radius 9999px for all primary buttons, badges, and form containers — full pills are non-negotiable
- Set letter-spacing to -0.05em or tighter on any text 53px and above to prevent the massive glyphs from looking loose
- Show the product in context using phone mockups — let the sites people can build be the visual content, not illustrations
- Keep body text in Satoshi weight 400 at 15px with #171717 — do not use pure #000000 for long-form reading

### Don't
- Do not use any color other than #3b82f6 as a chromatic accent — the system is intentionally near-monochrome
- Do not apply drop shadows to cards, buttons, or section blocks — depth comes from borders and radius, not elevation
- Do not use display sizes below 53px for section headlines — the scale jump from 21px body to 53px+ display is intentional and creates the editorial rhythm
- Do not use more than one primary blue button per viewport — multiple blue CTAs dilute the signal
- Do not round buttons at 4–8px — the system demands pill (9999px) or large (22–26px) radius only
- Do not introduce gradients as background fills — gradients only appear inside phone mockup content, never on the host page
- Do not use serif, monospace, or decorative display fonts — Satoshi and system-ui are the entire type system

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas | `#ffffff` | Base page background — dominant surface |
| 1 | Card | `#ffffff` | White cards and content blocks sit directly on the canvas with hairline borders instead of shadows |
| 2 | Highlight Wash | `#e3eeff` | Soft blue-tinted surface for featured/highlighted content blocks |

## Elevation

The design system deliberately avoids drop shadows on the main site. Depth is communicated through hairline 1px borders (#171717 or #000000), large corner radii (22–42px on images), and the contrast between white surfaces and black content. Phone mockups and device frames rely on their own inherent edges rather than cast shadows. If shadows are needed for floating elements, use 0 2px 8px rgba(0,0,0,0.08) at most — never the heavy multi-stop shadows common in card-based SaaS sites.

## Imagery

The visual language is product-led and almost entirely photographic-mockup-driven. The only imagery is phone mockups showing real site templates built on Pop Site — no stock photography, no illustrations, no abstract graphics. Phone frames are tightly cropped with black bezels and 22px outer radius, arranged in overlapping fan compositions for hero sections and in neat grids for category cards. The imagery is self-referential: the product IS the visual content. No lifestyle photography, no people, no environments. Icons (when present) are minimal line-style glyphs in #171717, 1.5–2px stroke, used sparingly. Empty states and decorative spaces are deliberately empty — the white canvas is the design.

## Agent Prompt Guide

**Quick Color Reference**
- background: #ffffff
- text/primary: #171717
- text/muted: #5e5e5e or #6e6e73
- border: #171717 or #000000
- accent: #3b82f6
- primary action: #3b82f6 (filled action)

**3-5 Example Component Prompts**

1. Create a Primary Action Button: #3b82f6 background, #ffffff text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.

2. **3-column section showcase grid**: White card on white background, 8px radius, 1px #171717 border, 20px padding. Each card contains: a phone-screen preview image at top (8px radius, #f5f5f7 surface), a title in Satoshi 21px weight 500, #000000, and a description in Satoshi 13px weight 400, #5e5e5e. Three cards per row with 16–20px gap. Above the grid: centered display heading 'Sections designed to get clicks, leads, and sales' at 53px Satoshi weight 700, #000000, letter-spacing -2.44px.

3. **Primary CTA pill button**: Background #3b82f6, text #ffffff, Satoshi 15px weight 500, padding 12px 24px, border-radius 9999px, no border. This is the only chromatic element in the system — use it once per viewport maximum.

4. **Top navigation bar**: White background, no border, no shadow. Left: 'pop site*' wordmark in Satoshi 18px weight 700, #000000 (the asterisk is part of the brand). Right: 5–7 text links in Satoshi 15px weight 400, #171717, spaced 13px apart. No background buttons, no icons, no search bar.

5. **Centered section heading block**: Centered alignment. Display headline in Satoshi weight 700 at 53–93px, #000000, line-height 1.0–1.1, letter-spacing -2.44px to -4.65px. Below: 1–2 line subhead in Satoshi 15–21px weight 400, #5e5e5e. Below that: small text link 'See all below' in #3b82f6, Satoshi 13px weight 500. Vertical margins: 40–60px top and bottom.

## Similar Brands

- **Linear** — Same oversized geometric display type on pure white canvas with a single accent color, pill-shaped primary actions, and hairline-border cards instead of shadows
- **Framer** — Same builder-product aesthetic with phone mockups as hero content, dramatic type scale jumps, and minimal monochrome palette punctuated by one chromatic CTA
- **Carrd** — Same one-page-builder simplicity with bold centered headlines, inline claim forms, and white-on-black-with-blue-accent visual restraint
- **Vercel** — Same stark white gallery-wall approach with monumental headline type, monochromatic body, and blue as the sole signal color for primary actions

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-page-white: #ffffff;
  --color-ink-black: #000000;
  --color-charcoal: #171717;
  --color-granite: #5e5e5e;
  --color-slate: #6e6e73;
  --color-mist: #d2d2d7;
  --color-wash-blue: #e3eeff;
  --color-signal-blue: #3b82f6;
  --color-link-blue: #6ea5ff;

  /* Typography — Font Families */
  --font-sans-serif: 'sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-satoshi: 'Satoshi', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-system-ui: 'system-ui', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.2;
  --text-body: 15px;
  --leading-body: 1.4;
  --text-subheading: 21px;
  --leading-subheading: 1.3;
  --tracking-subheading: -0.63px;
  --text-heading: 53px;
  --leading-heading: 1.2;
  --tracking-heading: -2.44px;
  --text-display: 93px;
  --leading-display: 1;
  --tracking-display: -4.65px;
  --text-display-xl: 120px;
  --leading-display-xl: 0.9;
  --tracking-display-xl: -7.08px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-36: 36px;
  --spacing-40: 40px;
  --spacing-60: 60px;
  --spacing-80: 80px;
  --spacing-120: 120px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 20px;
  --element-gap: 12-16px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-2xl: 22px;
  --radius-3xl: 26px;
  --radius-3xl-2: 42px;
  --radius-full: 999px;
  --radius-full-2: 9999px;

  /* Named Radii */
  --radius-cards: 8px;
  --radius-images: 22px;
  --radius-inputs: 8px;
  --radius-buttons: 9999px;
  --radius-smallimages: 42px;
  --radius-featurecards: 22px;
  --radius-secondarybuttons: 26px;

  /* Surfaces */
  --surface-canvas: #ffffff;
  --surface-card: #ffffff;
  --surface-highlight-wash: #e3eeff;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-page-white: #ffffff;
  --color-ink-black: #000000;
  --color-charcoal: #171717;
  --color-granite: #5e5e5e;
  --color-slate: #6e6e73;
  --color-mist: #d2d2d7;
  --color-wash-blue: #e3eeff;
  --color-signal-blue: #3b82f6;
  --color-link-blue: #6ea5ff;

  /* Typography */
  --font-sans-serif: 'sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-satoshi: 'Satoshi', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-system-ui: 'system-ui', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.2;
  --text-body: 15px;
  --leading-body: 1.4;
  --text-subheading: 21px;
  --leading-subheading: 1.3;
  --tracking-subheading: -0.63px;
  --text-heading: 53px;
  --leading-heading: 1.2;
  --tracking-heading: -2.44px;
  --text-display: 93px;
  --leading-display: 1;
  --tracking-display: -4.65px;
  --text-display-xl: 120px;
  --leading-display-xl: 0.9;
  --tracking-display-xl: -7.08px;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-36: 36px;
  --spacing-40: 40px;
  --spacing-60: 60px;
  --spacing-80: 80px;
  --spacing-120: 120px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-2xl: 22px;
  --radius-3xl: 26px;
  --radius-3xl-2: 42px;
  --radius-full: 999px;
  --radius-full-2: 9999px;
}
```
