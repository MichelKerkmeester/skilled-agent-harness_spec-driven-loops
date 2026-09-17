# Arva — Style Reference
> Pastoral editorial magazine spread on a cream field

**Theme:** light

Arva uses a pastoral editorial language: warm cream canvas replaces pure white, deep forest green anchors the brand, and quilted pastel surfaces (sky blue, peach, sage, bone) tile across content sections like fields seen from altitude. Typography pairs a refined editorial serif (Reckless) with a neutral sans (Inter), giving the site a printed-magazine feel over a typical SaaS chrome. Buttons are dramatically pill-shaped (100–110px radius), photography dominates above the fold at full-bleed, and the only saturated color besides the brand green appears as a vivid lime marquee strip — a single high-energy accent against an otherwise quiet, earth-toned system.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Forest Ink | `#07503f` | `--color-forest-ink` | Primary brand color, header background, nav bar fill, section dividers, footer — deep teal-green against warm cream creates agricultural gravitas |
| Vivid Lime | `#e8fe85` | `--color-vivid-lime` | Promotional marquee strip, highlight announcement bars, occasional link hover wash — the only high-energy accent in the palette |
| Bone | `#f1efdf` | `--color-bone` | Page canvas, base background — warm off-white replacing pure white to feel organic and printed |
| Pure White | `#ffffff` | `--color-pure-white` | Card surfaces, input fills, button text, icon backgrounds — the bright counterpoint against bone canvas |
| Ash Gray | `#efefef` | `--color-ash-gray` | Secondary card surface, subtle section dividers |
| Charcoal | `#212529` | `--color-charcoal` | Primary body text, headings on light, icon strokes — near-black for high contrast on cream |
| Graphite | `#353535` | `--color-graphite` | Secondary text, link borders, button borders, subdued UI outlines |
| Pewter | `#6d6d6d` | `--color-pewter` | Muted helper text, tertiary button text and borders |
| Sky Card | `#b2cee7` | `--color-sky-card` | Decorative card surface — one of the quilted pastel tiles used for partner testimonials and category blocks |
| Peach Card | `#fceace` | `--color-peach-card` | Decorative card surface — warm pastel tile alternating with sky and sage cards |
| Sage Card | `#e6ecd5` | `--color-sage-card` | Decorative card surface — soft green pastel tile for agrarian category blocks |
| Moss | `#c3cda7` | `--color-moss` | Subtle borders, input outlines, decorative dividers within body content |

## Tokens — Typography

### Inter — Primary UI and body sans. Handles everything from 12px nav metadata to 80–90px hero display. Negative tracking tightens display sizes; positive tracking (+0.025–0.029em) opens up small caps and badge text. · `--font-inter`
- **Substitute:** Inter (already free), or DM Sans as fallback
- **Weights:** 100, 200, 300, 400, 500, 600
- **Sizes:** 12, 13, 14, 15, 16, 17, 18, 80, 90px
- **Line height:** 0.97–2.20
- **Letter spacing:** -0.037em at 80–90px, -0.022em at 17–18px, 0.025–0.029em at 12–15px
- **Role:** Primary UI and body sans. Handles everything from 12px nav metadata to 80–90px hero display. Negative tracking tightens display sizes; positive tracking (+0.025–0.029em) opens up small caps and badge text.

### Reckless — Display serif for editorial headlines. At 57px the light weight (300) feels literary and unhurried; at 500–600 it becomes section anchors. Tight tracking (-0.012em) keeps the serif sharp at large sizes. · `--font-reckless`
- **Substitute:** Cormorant Garamond, GT Sectra, Source Serif Pro
- **Weights:** 300, 500, 600
- **Sizes:** 24, 28, 37, 43, 45, 57px
- **Line height:** 1.00–1.24
- **Letter spacing:** -0.012em
- **Role:** Display serif for editorial headlines. At 57px the light weight (300) feels literary and unhurried; at 500–600 it becomes section anchors. Tight tracking (-0.012em) keeps the serif sharp at large sizes.

### RecklessLight — Ultra-light serif variant for body-leading headlines and pull-quote copy. The 100 weight at 25–28px creates a delicate editorial voice in supporting sections. · `--font-recklesslight`
- **Substitute:** Cormorant Garamond Light, Source Serif ExtraLight
- **Weights:** 100, 300
- **Sizes:** 24, 25, 28, 37, 45, 49, 57px
- **Line height:** 1.00, 1.06, 1.22, 1.24
- **Letter spacing:** normal
- **Role:** Ultra-light serif variant for body-leading headlines and pull-quote copy. The 100 weight at 25–28px creates a delicate editorial voice in supporting sections.

### sans-serif — sans-serif — detected in extracted data but not described by AI · `--font-sans-serif`
- **Weights:** 300, 400, 500
- **Sizes:** 17px
- **Line height:** 1.1, 1.35
- **Role:** sans-serif — detected in extracted data but not described by AI

### Helvetica — Helvetica — detected in extracted data but not described by AI · `--font-helvetica`
- **Weights:** 300, 400
- **Sizes:** 12px, 17px
- **Line height:** 1.35, 1.92
- **Role:** Helvetica — detected in extracted data but not described by AI

### FKGrotesk — FKGrotesk — detected in extracted data but not described by AI · `--font-fkgrotesk`
- **Weights:** 300
- **Sizes:** 12px, 16px
- **Line height:** 1.24
- **Role:** FKGrotesk — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.5 | 0.025px | `--text-caption` |
| body-sm | 14px | 1.5 | 0.025px | `--text-body-sm` |
| body | 16px | 1.52 | -0.022px | `--text-body` |
| subheading | 24px | 1.24 | -0.012px | `--text-subheading` |
| heading-sm | 37px | 1.22 | -0.012px | `--text-heading-sm` |
| heading | 45px | 1.06 | -0.012px | `--text-heading` |
| heading-lg | 57px | 1.06 | -0.022px | `--text-heading-lg` |
| display | 80px | 1 | -2.96px | `--text-display` |

## Tokens — Spacing & Shapes

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 5 | 5px | `--spacing-5` |
| 6 | 6px | `--spacing-6` |
| 8 | 8px | `--spacing-8` |
| 9 | 9px | `--spacing-9` |
| 10 | 10px | `--spacing-10` |
| 12 | 12px | `--spacing-12` |
| 15 | 15px | `--spacing-15` |
| 20 | 20px | `--spacing-20` |
| 24 | 24px | `--spacing-24` |
| 27 | 27px | `--spacing-27` |
| 30 | 30px | `--spacing-30` |
| 38 | 38px | `--spacing-38` |
| 40 | 40px | `--spacing-40` |
| 50 | 50px | `--spacing-50` |
| 64 | 64px | `--spacing-64` |
| 193 | 193px | `--spacing-193` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 20px |
| links | 26px |
| inputs | 33px |
| buttons | 100px |
| nav-pills | 110px |
| hero-cards | 30px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 50px
- **Card padding:** 30px
- **Element gap:** 8px

## Components

### Pill CTA Button (Forest Filled)
**Role:** Primary action button

Background #07503f, text #ffffff, 100px border-radius, 10px 24px padding, Inter weight 500–600 at 14–15px with 0.025em tracking. Uppercase or sentence case both observed.

### Pill Outline Button (Cream/Ghost)
**Role:** Secondary action button

Transparent fill, 1px border in #353535 or currentColor, 100px border-radius, 10px 24px padding, Inter at 14px. Used for 'I'm a Company' paired with the filled 'I'm a Farmer' primary.

### Pill Nav Element
**Role:** Header nav link and dropdown trigger

Sits on #07503f forest header. White text, Inter at 15px, no background. Dropdown chevrons are 8px. Active states shift to slight white opacity or underline.

### Get In Touch Pill
**Role:** Header CTA

Pill shape, 110px radius, #ffffff background on forest header, #212529 text, 10px 20px padding, Inter weight 500.

### Full-Bleed Hero with Photography
**Role:** Above-the-fold section

Full-viewport landscape photograph (aerial field shot, warm greens), centered white serif headline at 57–80px (Reckless or Inter display), two pill buttons below, 'Scroll to Explore' with down-arrow at bottom center. No overlay — image is the background.

### Lime Marquee Strip
**Role:** Top promotional banner

Full-bleed #e8fe85 background bar, repeating dark text (Inter at 12–14px) announcing guides and resources, separated by outlined checkmark icons. Runs the full viewport width above the main nav.

### Pastel Quilt Card
**Role:** Testimonial or category tile

Surface in one of four pastel tones (#b2cee7 sky, #fceace peach, #e6ecd5 sage, #efefef bone), 20px radius, 30px padding, centered content with brand logo at top, quote in body, author name + role at bottom. Cards sit side-by-side in a 3-column row.

### Forest Section Banner
**Role:** Dark interstitial section

Full-bleed #07503f background, white serif headline, white body copy, small white icon-and-text benefit blocks arranged in a 2×2 grid with icons in circular 30–40px containers.

### Input Field
**Role:** Form input

White fill, 1px border in #c3cda7 (moss) or #353535, 33px radius (distinctly more pill than card), 12px vertical padding, Inter at 16px. Focus ring in #07503f.

### Header Logo Lockup
**Role:** Brand mark

White lowercase 'arva' wordmark with a green triangular leaf icon to the left. Sits centered on the forest header at roughly 28–32px height.

### Section Divider Header
**Role:** Section title block

Left-aligned serif headline (Reckless at 45–57px, #212529) on bone canvas, with optional 1–2 line body intro in Inter at 17px below. No decorative element — the typography carries the hierarchy.

### Partner Logo Card
**Role:** Featured partner tile

20px radius, white or pastel surface, centered brand logo at top (raster, full color), blockquote in Inter at 14–15px, author name + title in Inter weight 500–600 at 14px. Cards have generous 30px+ padding.

### Footer (Forest)
**Role:** Site footer

Background #07503f, white text and links, multi-column link grid, Inter at 14–15px, logo lockup repeated. 110px top padding or more for breathing room.

## Do's and Don'ts

### Do
- Use #f1efdf (Bone) as the page canvas on every light section — never substitute pure #ffffff as the base
- Apply the 100px pill radius to every button regardless of variant; consistency of the pill is a brand signature
- Pair Reckless (serif) at 45–57px for section headlines with Inter (sans) at 14–17px for body — the serif/sans tension defines the editorial voice
- Let the #e8fe85 lime appear only on the marquee strip and promotional micro-accents — it earns attention through scarcity
- Use the four pastel card surfaces (sky, peach, sage, bone) as a rotating palette within a single row, like a quilted series, not randomly distributed
- Fill the nav bar and section dividers solid with #07503f (Forest Ink) — the dark green bands are the structural backbone of the page rhythm
- Set hero headlines at 57–80px in Reckless weight 300 or Inter weight 600, centered, over full-bleed landscape photography

### Don't
- Do not use #ffffff as the page background — always layer it on top of #f1efdf to preserve the warm printed feel
- Do not apply small radii (4–8px) to buttons or cards; the 20px+ and 100px+ radii are non-negotiable
- Do not introduce new saturated colors beyond Forest Ink and Vivid Lime — the pastel tiles carry the chromatic load
- Do not use Reckless below 24px or for body copy — the serif is for headlines and pull-quotes only
- Do not apply shadows or elevation to cards; depth comes from pastel surface color shifts, not box-shadow
- Do not pair multiple pastels within a single card; one surface color per tile
- Do not center body paragraphs — headlines and hero copy can be centered, but supporting text reads left-aligned at max 60ch

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Bone Canvas | `#f1efdf` | Page background, warm base layer |
| 1 | Pure White | `#ffffff` | Card surfaces, input fields, button text |
| 2 | Pastel Tiles | `#b2cee7` | Quilted card variants — sky, peach (#fceace), sage (#e6ecd5), bone (#efefef) |
| 3 | Forest Ink | `#07503f` | Header, section banners, footer — dark interstitial layer |
| 4 | Vivid Lime | `#e8fe85` | Promotional marquee strip — single high-energy accent |

## Elevation

Elevation is achieved through color contrast and surface shifts, not shadows. Cards gain visibility by switching to a pastel or pure white surface against the bone canvas; section transitions are marked by switching to solid forest green. No box-shadows are used in the system.

## Imagery

Full-bleed landscape and agricultural photography dominates — aerial drone shots of crop fields in vibrant green and golden brown, on-location portraits of farmers standing in cornfields, close-up product/landscape crops. Photographs are high-resolution, naturalistic, slightly saturated, and always warm-toned. No illustrations or abstract graphics; no icons beyond simple line-art checkmarks and benefit glyphs. Photography treatment is raw (no duotone, no heavy filters, no overlay text boxes with backgrounds). Icons are minimal and line-style when present.

## Layout

Full-bleed sections stacked vertically with no max-width container at the section level — each band bleeds to the viewport edge. Internal content is centered at 1200px max-width. Hero is a full-viewport-height image with centered headline + two-button stack + scroll cue. Below the hero, content alternates between bone canvas sections with centered headlines, forest-green interstitial bands with white text, and a 3-column quilted card grid for testimonials/partners. Navigation is a forest-green header bar with centered logo, nav links left, CTA + language selector right. A lime marquee strip sits above the header. Section gaps are roughly 50px; content is spacious and editorial, not information-dense.

## Agent Prompt Guide

primary action: #07503f (filled action)
Create a Primary Action Button: #07503f background, #ffffff text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.
**Quick Color Reference**
- text: #212529
- background: #f1efdf
- card surface: #ffffff
- border: #c3cda7 or #353535
- brand accent: #07503f
- promotional highlight: #e8fe85

**Example Component Prompts**

1. Build a full-bleed hero: background is a landscape field photograph at 100vh. Centered white headline 'Regenerative supply chains for a better world' in Reckless weight 300 at 57px, letter-spacing -0.012em. Below: two pill buttons side by side — filled #07503f with white text 'I'M A FARMER' (100px radius, 10px 24px padding, Inter 14px weight 600), and ghost outlined 'I'M A COMPANY' (1px white border, 100px radius). At bottom center: 'Scroll to Explore ↓' in Inter 13px.

2. Build a partner testimonial row: 3 cards in a row on #f1efdf canvas. Each card is 20px radius with 30px padding. Card 1 surface #b2cee7, Card 2 #fceace, Card 3 #e6ecd5. Each card: centered brand logo (raster, ~120px wide), 15px Inter body quote, 14px Inter weight 600 author name, 13px Inter weight 400 role. 24px gap between cards.

3. Build a forest interstitial section: full-bleed #07503f background, 80px vertical padding. White Reckless 300 headline at 45px, white Inter 17px body paragraph (max 60ch, left-aligned). Below: 2×2 grid of benefit blocks — each has a small white circular icon container, bold Inter 15px headline, Inter 14px body. 30px gap between grid items.

4. Build a header bar: #07503f background, 60px height, centered white 'arva' wordmark with green leaf icon. Left side: nav links in Inter 15px white (For Farmers, For Companies, For Channel Partners, Our Services ▾). Right side: white pill 'GET IN TOUCH' (110px radius, 10px 20px padding) and US flag + 'US ▾'.

5. Build a marquee strip: full-bleed #e8fe85 background, 32px height, horizontal repeating text 'Arva's Guide to 45Z: Agronomy & Energy Policy' in Inter 13px #212529, separated by small outlined checkmark icons. Sits flush above the header bar.

## Color Philosophy

The palette is deliberately restrained to four surface families: warm bone (the canvas), pure white (cards), pastel tints (quilted tiles), and deep forest green (structural bands). Vivid lime is reserved for a single promotional strip. This scarcity means that when a pastel tile appears, it feels intentional and warm — like a field of crops seen from above. Never introduce blues, reds, or purples beyond the four designated pastels.

## Typography Philosophy

Reckless (or a high-quality serif substitute like GT Sectra) carries the editorial voice at 24px and above. Inter handles everything functional below 24px. The two-font pairing replaces the typical sans-only SaaS stack with a magazine sensibility — headlines feel written, not engineered. The ultra-light weight (100–300) of Reckless is a deliberate anti-convention choice: most sites push to weight 700 for authority, but Arva whispers. The serif at weight 300 at 57px is more confident than a bold sans would be.

## Shape Language

Radii are disproportionately large for the system size. Cards at 20px, buttons at 100–110px, inputs at 33px. The pill is the dominant shape — it appears on every interactive element, making the site feel soft, approachable, and distinctly non-corporate. There are no sharp 90° corners on any interactive surface. The shape language signals 'this is a field, not a dashboard.'

## Similar Brands

- **Patagonia** — Same earth-tone editorial identity with full-bleed nature photography and warm cream canvas; both use a single brand color to anchor the page rhythm
- **Stripe** — Similar generous pill-button radius and clean white/card layering, though Arva swaps the cool grays for warm cream and introduces a serif voice
- **Aesop** — Editorial serif + sans pairing, warm off-white canvas, muted restrained palette, photography that does the heavy visual lifting
- **Mailchimp** — Playful oversized pill buttons and a single saturated brand color, though Arva replaces the cartoon illustration system with pastoral landscape photography
- **Wren (offset.earth)** — Same regenerative-agriculture visual language: deep forest green brand, cream canvas, full-bleed field photography, and warm pastel content surfaces

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-forest-ink: #07503f;
  --color-vivid-lime: #e8fe85;
  --color-bone: #f1efdf;
  --color-pure-white: #ffffff;
  --color-ash-gray: #efefef;
  --color-charcoal: #212529;
  --color-graphite: #353535;
  --color-pewter: #6d6d6d;
  --color-sky-card: #b2cee7;
  --color-peach-card: #fceace;
  --color-sage-card: #e6ecd5;
  --color-moss: #c3cda7;

  /* Typography — Font Families */
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-reckless: 'Reckless', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-recklesslight: 'RecklessLight', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-sans-serif: 'sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-helvetica: 'Helvetica', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-fkgrotesk: 'FKGrotesk', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --tracking-caption: 0.025px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.5;
  --tracking-body-sm: 0.025px;
  --text-body: 16px;
  --leading-body: 1.52;
  --tracking-body: -0.022px;
  --text-subheading: 24px;
  --leading-subheading: 1.24;
  --tracking-subheading: -0.012px;
  --text-heading-sm: 37px;
  --leading-heading-sm: 1.22;
  --tracking-heading-sm: -0.012px;
  --text-heading: 45px;
  --leading-heading: 1.06;
  --tracking-heading: -0.012px;
  --text-heading-lg: 57px;
  --leading-heading-lg: 1.06;
  --tracking-heading-lg: -0.022px;
  --text-display: 80px;
  --leading-display: 1;
  --tracking-display: -2.96px;

  /* Typography — Weights */
  --font-weight-thin: 100;
  --font-weight-extralight: 200;
  --font-weight-light: 300;
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;

  /* Spacing */
  --spacing-5: 5px;
  --spacing-6: 6px;
  --spacing-8: 8px;
  --spacing-9: 9px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-15: 15px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-27: 27px;
  --spacing-30: 30px;
  --spacing-38: 38px;
  --spacing-40: 40px;
  --spacing-50: 50px;
  --spacing-64: 64px;
  --spacing-193: 193px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 50px;
  --card-padding: 30px;
  --element-gap: 8px;

  /* Border Radius */
  --radius-sm: 2px;
  --radius-2xl: 20px;
  --radius-3xl: 26px;
  --radius-3xl-2: 30px;
  --radius-3xl-3: 33px;
  --radius-3xl-4: 45px;
  --radius-full: 60px;
  --radius-full-2: 100px;
  --radius-full-3: 110px;
  --radius-full-4: 9999px;

  /* Named Radii */
  --radius-cards: 20px;
  --radius-links: 26px;
  --radius-inputs: 33px;
  --radius-buttons: 100px;
  --radius-nav-pills: 110px;
  --radius-hero-cards: 30px;

  /* Surfaces */
  --surface-bone-canvas: #f1efdf;
  --surface-pure-white: #ffffff;
  --surface-pastel-tiles: #b2cee7;
  --surface-forest-ink: #07503f;
  --surface-vivid-lime: #e8fe85;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-forest-ink: #07503f;
  --color-vivid-lime: #e8fe85;
  --color-bone: #f1efdf;
  --color-pure-white: #ffffff;
  --color-ash-gray: #efefef;
  --color-charcoal: #212529;
  --color-graphite: #353535;
  --color-pewter: #6d6d6d;
  --color-sky-card: #b2cee7;
  --color-peach-card: #fceace;
  --color-sage-card: #e6ecd5;
  --color-moss: #c3cda7;

  /* Typography */
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-reckless: 'Reckless', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-recklesslight: 'RecklessLight', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-sans-serif: 'sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-helvetica: 'Helvetica', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-fkgrotesk: 'FKGrotesk', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --tracking-caption: 0.025px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.5;
  --tracking-body-sm: 0.025px;
  --text-body: 16px;
  --leading-body: 1.52;
  --tracking-body: -0.022px;
  --text-subheading: 24px;
  --leading-subheading: 1.24;
  --tracking-subheading: -0.012px;
  --text-heading-sm: 37px;
  --leading-heading-sm: 1.22;
  --tracking-heading-sm: -0.012px;
  --text-heading: 45px;
  --leading-heading: 1.06;
  --tracking-heading: -0.012px;
  --text-heading-lg: 57px;
  --leading-heading-lg: 1.06;
  --tracking-heading-lg: -0.022px;
  --text-display: 80px;
  --leading-display: 1;
  --tracking-display: -2.96px;

  /* Spacing */
  --spacing-5: 5px;
  --spacing-6: 6px;
  --spacing-8: 8px;
  --spacing-9: 9px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-15: 15px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-27: 27px;
  --spacing-30: 30px;
  --spacing-38: 38px;
  --spacing-40: 40px;
  --spacing-50: 50px;
  --spacing-64: 64px;
  --spacing-193: 193px;

  /* Border Radius */
  --radius-sm: 2px;
  --radius-2xl: 20px;
  --radius-3xl: 26px;
  --radius-3xl-2: 30px;
  --radius-3xl-3: 33px;
  --radius-3xl-4: 45px;
  --radius-full: 60px;
  --radius-full-2: 100px;
  --radius-full-3: 110px;
  --radius-full-4: 9999px;
}
```
