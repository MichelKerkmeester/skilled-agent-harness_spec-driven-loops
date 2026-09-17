# Podcorn — Style Reference
> Indie magazine spread on warm blush paper. A cream canvas carrying deep-indigo editorial typography, hand-drawn illustrations framed in hairline rectangles, and a single coral button as the only warm mark on the page.

**Theme:** light

Podcorn Creator Lab uses a warm editorial-creative language: a peach-cream canvas (#fff4f2) beneath pure white card surfaces, deep indigo (#090335) ink for nearly all typography, and a single coral (#fc736c) accent reserved exclusively for the primary call-to-action. The signature contrast is serif Georgia headings against geometric Gilroy body text — an editorial pairing that says 'crafted content platform' rather than 'SaaS dashboard'. Illustrations are hand-drawn, one-stroke linework with flat coral and navy fills, placed inside thin rectangular frames on the cream canvas. Everything sits generous and airy; borders are hairline-thin, corners are gently rounded but not pill-shaped, and elevation is achieved through whitespace and surface shifts rather than drop shadows.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Blush Cream | `#fff4f2` | `--color-blush-cream` | Page canvas — warm off-white that sets the editorial tone and makes the deep-indigo text read like printed ink on heavy paper |
| Pure White | `#ffffff` | `--color-pure-white` | Card surfaces, nav background, button fills on light backgrounds — stacked above the cream canvas to create depth without shadow |
| Ink Violet | `#090335` | `--color-ink-violet` | Primary text, headings, filled CTA buttons, nav links, hairline borders — the single dominant color of the entire interface; near-black with a violet undertone gives headings personality without abandoning readability |
| Coral Flame | `#fc736c` | `--color-coral-flame` | Red wash for highlight backgrounds, decorative bands, and soft emphasis behind content. Do not promote it to the primary CTA color |
| Peach Whisper | `#ffb0a1` | `--color-peach-whisper` | Orange decorative accent for icons, marks, and small graphic details. Do not promote it to the primary CTA color |
| Deep Navy | `#132645` | `--color-deep-navy` | Illustration detail fill (SVG artwork) — cooler sibling of Ink Violet used inside drawings to add tonal range to the editorial illustrations |
| Graphite | `#434352` | `--color-graphite` | Secondary nav text and nav borders — a softer alternative to Ink Violet for tertiary labels and dividers |
| Silver Mist | `#8993a2` | `--color-silver-mist` | Muted nav borders and inactive control outlines |
| Hairline | `#d8d8d8` | `--color-hairline` | Hairline link underlines and subtle dividers |
| Zinc Mute | `#71717d` | `--color-zinc-mute` | Helper text and tertiary metadata |

## Tokens — Typography

### Gilroy — Primary interface typeface — body text, navigation, buttons, card labels, footer. Geometric sans with tight tracking gives UI elements a confident, contemporary voice. · `--font-gilroy`
- **Substitute:** Inter, Manrope, or DM Sans at matching weights
- **Weights:** 400, 500, 600, 700
- **Sizes:** 14, 15, 16, 18, 20, 22, 25
- **Line height:** 1.57, 1.67, 1.70, 1.88
- **Letter spacing:** -0.187em (applied across sizes, tightens geometric forms for a modern, compact feel)
- **Role:** Primary interface typeface — body text, navigation, buttons, card labels, footer. Geometric sans with tight tracking gives UI elements a confident, contemporary voice.

### Georgia — Headline and hero typeface — a classical serif reserved for editorial moments. The serif/sans pairing is the site's most distinctive typographic decision: Georgia carries warmth and craft, Gilroy carries clarity and UI density. Mixing these creates an indie-magazine feel that distinguishes Podcorn from generic SaaS layouts. · `--font-georgia`
- **Weights:** 400, 700
- **Sizes:** 21, 27, 40
- **Line height:** 1.44
- **Letter spacing:** normal
- **Role:** Headline and hero typeface — a classical serif reserved for editorial moments. The serif/sans pairing is the site's most distinctive typographic decision: Georgia carries warmth and craft, Gilroy carries clarity and UI density. Mixing these creates an indie-magazine feel that distinguishes Podcorn from generic SaaS layouts.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 14px | 1.57 | -0.187px | `--text-caption` |
| body | 16px | 1.7 | -0.187px | `--text-body` |
| subheading | 18px | 1.88 | -0.187px | `--text-subheading` |
| body-lg | 20px | 1.67 | -0.187px | `--text-body-lg` |
| nav-label | 22px | 1.13 | -0.187px | `--text-nav-label` |
| heading-sm | 25px | 1.2 | -0.187px | `--text-heading-sm` |
| heading | 27px | 1.44 | — | `--text-heading` |
| display | 40px | 1.44 | — | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 16 | 16px | `--spacing-16` |
| 20 | 20px | `--spacing-20` |
| 32 | 32px | `--spacing-32` |
| 40 | 40px | `--spacing-40` |
| 44 | 44px | `--spacing-44` |
| 52 | 52px | `--spacing-52` |
| 96 | 96px | `--spacing-96` |
| 100 | 100px | `--spacing-100` |
| 168 | 168px | `--spacing-168` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 8px |
| buttons | 6px |
| nav-pill | 6px |
| illustration-frames | 0px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 20-27px
- **Element gap:** 20px

## Components

### Coral CTA Button (Nav)
**Role:** Primary call-to-action in top nav

Filled coral #fc736c background, white text at 15px Gilroy weight 500, 18px vertical and 20px horizontal padding, 6px corner radius. Single instance of the accent color — appears once in the nav, nowhere else.

### Ink Filled Button
**Role:** Primary action on hero and feature blocks

Filled Ink Violet #090335 background, white text at 16-18px Gilroy weight 500-600, 18px vertical and 20-27px horizontal padding, 6px radius. Used for 'For Podcasters' and 'For Brands' actions.

### Ghost Outlined Button
**Role:** Secondary action

Transparent fill, 1-2px Ink Violet #090335 border, Ink Violet text at matching size, 6px radius. Appears as the 'Log In' nav control.

### Top Navigation Bar
**Role:** Site header with brand, links, and dual CTAs

White background, 1px hairline border bottom in #d8d8d8, ~64px height. Logo left (Creator Lab badge), center links in Gilroy 15-16px weight 500 #090335, right cluster of Ghost Outlined 'Log In' + Coral CTA 'Sign Up'.

### Hero Text Block
**Role:** First-fold headline and supporting copy

Display-size Georgia 40px weight 700 in Ink Violet, line-height 1.44, sitting on Blush Cream canvas. No gradient, no overlay — the cream is the hero background.

### Illustration Frame
**Role:** Hand-drawn artwork container

Thin 1.5-2px Ink Violet #090335 rectangular border, NO fill, NO border-radius, housing hand-drawn line illustrations. The border is structural, not decorative — it visually quotes a picture frame or comic panel and separates editorial art from UI.

### Feature Card (Two-Column Row)
**Role:** Side-by-side feature explanation blocks

Two equal-width columns on cream canvas. Left: Gilroy 18-20px body text in Ink Violet with a Georgia 25-27px subheading. Right: Illustration Frame with custom artwork. 40-60px column gap, no card background or border — content sits directly on the cream surface.

### Brand Logo Strip
**Role:** Social proof band showing partner brands

Row of grayscale brand logos (Amazon, Sonix, etc.) on white background, evenly spaced with generous horizontal padding. Logos rendered in near-black #000000 for clean recognition.

### Cookie Consent Dialog
**Role:** Privacy compliance overlay

White #ffffff surface, 8px corner radius, sits fixed bottom-left. Bold 'Customize Your Cookie Choices' title in Ink Violet, dense body text in Gilroy 14-15px, three stacked ghost-style buttons (Accept All, Reject All, Cookie Settings) with 1px Ink Violet border and Ink Violet text.

### Sign Up Badge
**Role:** Small label indicating available action

Compact pill or rectangular tag in Gilroy 14px, Ink Violet background with white text, used inline near the Creator Lab logo.

## Do's and Don'ts

### Do
- Use Georgia 40px weight 700 in Ink Violet for all major headlines — the serif/sans pairing is the site's identity
- Reserve #fc736c Coral for exactly one element per view: the primary CTA. Never use it for backgrounds, text, or decoration
- Apply -0.187em letter-spacing to all Gilroy text to match the compact geometric rhythm
- Frame every hand-drawn illustration with a 1.5-2px Ink Violet #090335 border and 0px radius — the rectangular frame is structural, not optional
- Stack surfaces as Blush Cream canvas → White card → Coral CTA → Ink Violet filled button for depth without shadows
- Use 6px radius for all buttons and 8px for cards — keep corners gentle, never pill-shaped (9999px) on UI controls
- Maintain 80px section gaps and 20-27px internal padding to preserve the airy editorial rhythm

### Don't
- Never use drop shadows, blurs, or glow effects — depth comes from surface color shifts only
- Never use the Coral accent on text, borders, or icon fills — it is a button-only color
- Never apply Georgia to body text, nav, or buttons — reserve it for headings and hero copy only
- Never round illustration frames — the 0px rectangular border is essential to the editorial frame metaphor
- Never use pure black #000000 for primary text — Ink Violet #090335 is the text standard
- Never place photography or product screenshots inside the cream sections — illustrations only
- Never use emoji, gradient fills, or neon accents — the palette is deliberately limited to cream, white, ink-violet, and coral

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Blush Cream Canvas | `#fff4f2` | Page background, hero backdrop, editorial sections |
| 1 | Pure White | `#ffffff` | Cards, nav bar, brand logo strip, dialog surfaces |
| 2 | Coral Accent | `#fc736c` | Primary CTA fill — single use surface |
| 3 | Ink Violet | `#090335` | Filled button surface, deepest UI layer |

## Elevation

Elevation is achieved entirely through surface color shifts (cream → white → coral → ink) and hairline borders. No drop shadows, no blur effects, no glow. The design trusts background-color changes and 1-2px borders to communicate depth, producing a flat editorial print aesthetic rather than a skeuomorphic digital one.

## Imagery

Custom hand-drawn line illustrations dominate the visual identity: single-stroke navy and coral artwork depicting podcasters, headphones, music notes, megaphones, and abstract organic shapes. Each illustration is housed inside a thin rectangular ink-violet frame with no fill, evoking a comic panel or art print. Illustrations are decorative and atmospheric rather than explanatory — they set tone and brand personality, not product mechanics. No photography, no product screenshots, no 3D renders. The illustration style is loose, slightly wobbly, and human — a deliberate counterweight to the precise geometric UI. Below the hero, a grayscale brand-logo strip provides the only 'real-world' visual content, and even that is stripped of color.

## Layout

Max-width 1200px centered, generous outer padding of ~80px on desktop. Page is a vertical scroll of horizontal sections, each section using the Blush Cream canvas as background. The top nav is a sticky white bar with hairline bottom border. Hero is a two-column split: text-left (Georgia display headline + Gilroy body + Ink Filled CTA) and framed-illustration-right, vertically centered. Feature sections alternate between two-column text+illustration rows and full-width centered text stacks. Brand logo strip is a single horizontal band. No sidebar, no mega-menu, no full-bleed images. Section rhythm is defined by whitespace and subtle background shifts rather than dividers or colored bands — the cream canvas flows continuously beneath all content.

## Agent Prompt Guide

**Quick Color Reference**
- text: #090335 (Ink Violet)
- background: #fff4f2 (Blush Cream)
- surface/card: #ffffff (Pure White)
- border: #d8d8d8 (Hairline) or #090335 (Ink Violet for emphasis)
- accent/illustration: #fc736c (Coral) and #ffb0a1 (Peach Whisper)
- primary action: #090335 (filled action)

**3-5 Example Component Prompts**
1. Create a hero section: Blush Cream #fff4f2 background, 1200px max width. Left column holds a Georgia 40px weight 700 Ink Violet headline with line-height 1.44, followed by Gilroy 18px weight 400 body text in Ink Violet, then an Ink Filled Button (#090335 bg, white text, 18px/27px padding, 6px radius). Right column holds an Illustration Frame: 2px Ink Violet border, 0px radius, containing a hand-drawn line illustration using #132645 strokes and #fc736c + #ffb0a1 fills.

2. Build a top navigation bar: white #ffffff background, 64px height, 1px #d8d8d8 bottom border. Left: brand logo with 'Creator Lab' badge. Center: Gilroy 15px weight 500 Ink Violet links. Right: Ghost Outlined 'Log In' button (1px #090335 border, transparent fill, 6px radius, 18px/20px padding) followed by Coral CTA 'Sign Up' (#fc736c fill, white text, 6px radius, 18px/20px padding).

3. Construct a feature row: Blush Cream background, two equal columns with 60px gap. Left column: Georgia 25px weight 700 Ink Violet subheading, Gilroy 18px weight 400 Ink Violet body text. Right column: Illustration Frame with 2px #090335 border, 0px radius, containing custom artwork with #132645 linework and #fc736c fills. No card backgrounds, no shadows.

4. Design a cookie consent dialog: white #ffffff background, 8px radius, fixed bottom-left, 24px padding. Title 'Customize Your Cookie Choices' in Gilroy 16px weight 700 Ink Violet. Body text Gilroy 14px weight 400 in #434352. Three stacked ghost buttons: 1px #090335 border, transparent fill, Ink Violet text, 6px radius, 18px/20px padding.

5. Create a brand logo strip: white #ffffff background band, horizontal flex row of 6-8 grayscale partner logos rendered in #000000, evenly spaced with 40px gap, 40px vertical padding. Logos are monochrome, no color treatment.

## Similar Brands

- **Substack** — Same serif-headline-plus-sans-body editorial pairing and warm off-white canvas, though Substack leans more newspaper than indie-magazine
- **Anchor (Spotify)** — Podcasting-platform category neighbor with similar coral accent usage and cream-toned marketing surfaces, though Podcorn's hand-drawn illustrations are more editorial
- **Notion** — Same minimalist restraint and surface-color-as-depth philosophy, but Notion is pure UI with no illustration personality
- **Mailchimp** — Comparable use of hand-drawn illustration as brand personality and warm cream canvas, though Mailchimp's palette is broader and more playful

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-blush-cream: #fff4f2;
  --color-pure-white: #ffffff;
  --color-ink-violet: #090335;
  --color-coral-flame: #fc736c;
  --color-peach-whisper: #ffb0a1;
  --color-deep-navy: #132645;
  --color-graphite: #434352;
  --color-silver-mist: #8993a2;
  --color-hairline: #d8d8d8;
  --color-zinc-mute: #71717d;

  /* Typography — Font Families */
  --font-gilroy: 'Gilroy', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-georgia: 'Georgia', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.57;
  --tracking-caption: -0.187px;
  --text-body: 16px;
  --leading-body: 1.7;
  --tracking-body: -0.187px;
  --text-subheading: 18px;
  --leading-subheading: 1.88;
  --tracking-subheading: -0.187px;
  --text-body-lg: 20px;
  --leading-body-lg: 1.67;
  --tracking-body-lg: -0.187px;
  --text-nav-label: 22px;
  --leading-nav-label: 1.13;
  --tracking-nav-label: -0.187px;
  --text-heading-sm: 25px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: -0.187px;
  --text-heading: 27px;
  --leading-heading: 1.44;
  --text-display: 40px;
  --leading-display: 1.44;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-4: 4px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-44: 44px;
  --spacing-52: 52px;
  --spacing-96: 96px;
  --spacing-100: 100px;
  --spacing-168: 168px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 20-27px;
  --element-gap: 20px;

  /* Named Radii */
  --radius-cards: 8px;
  --radius-buttons: 6px;
  --radius-nav-pill: 6px;
  --radius-illustration-frames: 0px;

  /* Surfaces */
  --surface-blush-cream-canvas: #fff4f2;
  --surface-pure-white: #ffffff;
  --surface-coral-accent: #fc736c;
  --surface-ink-violet: #090335;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-blush-cream: #fff4f2;
  --color-pure-white: #ffffff;
  --color-ink-violet: #090335;
  --color-coral-flame: #fc736c;
  --color-peach-whisper: #ffb0a1;
  --color-deep-navy: #132645;
  --color-graphite: #434352;
  --color-silver-mist: #8993a2;
  --color-hairline: #d8d8d8;
  --color-zinc-mute: #71717d;

  /* Typography */
  --font-gilroy: 'Gilroy', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-georgia: 'Georgia', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.57;
  --tracking-caption: -0.187px;
  --text-body: 16px;
  --leading-body: 1.7;
  --tracking-body: -0.187px;
  --text-subheading: 18px;
  --leading-subheading: 1.88;
  --tracking-subheading: -0.187px;
  --text-body-lg: 20px;
  --leading-body-lg: 1.67;
  --tracking-body-lg: -0.187px;
  --text-nav-label: 22px;
  --leading-nav-label: 1.13;
  --tracking-nav-label: -0.187px;
  --text-heading-sm: 25px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: -0.187px;
  --text-heading: 27px;
  --leading-heading: 1.44;
  --text-display: 40px;
  --leading-display: 1.44;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-44: 44px;
  --spacing-52: 52px;
  --spacing-96: 96px;
  --spacing-100: 100px;
  --spacing-168: 168px;
}
```
