# Riverside — Style Reference
> Studio darkroom behind frosted glass

**Theme:** light

Riverside runs a near-monochrome light system anchored by white canvas and near-black text, with a single vivid violet accent (#9671ff) that functions as the only chromatic element in the entire interface. The visual rhythm alternates between pure white content bands and full-bleed dark sections (near-black backgrounds) that host feature lists and CTAs, creating a cinematic on/off cadence rather than a continuous light layout. Typography is exclusively Inter (with IBM Plex Sans 600 reserved for a narrow role), set with aggressive negative tracking and tight line-heights at large sizes — headlines feel compressed and intentional rather than airy. Components are lightweight: pill-shaped buttons at 300px radius, 8px card radii, hairline borders over soft tints, and almost no elevation. The violet accent is rationed — one filled CTA per screen, occasional icon strokes, soft wash backgrounds — which makes it feel like a deliberate switch being thrown rather than decoration.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Studio Violet | `#9671ff` | `--color-studio-violet` | Primary CTA buttons, active nav indicators, selected states, accent icon strokes — the sole chromatic switch in an otherwise grayscale interface; one filled violet per screen creates a clear hierarchy of action |
| Lavender Mist | `#f2eeff` | `--color-lavender-mist` | Soft accent surface washes behind feature tags, subtle highlighted regions, and selected nav backgrounds — a whisper of brand color that never competes with the primary violet |
| Periwinkle Tint | `#eae3ff` | `--color-periwinkle-tint` | Deeper lavender wash for highlighted tag backgrounds, soft brand-tinted card surfaces, and active state fills that need more presence than Lavender Mist |
| Iris Light | `#ad98fa` | `--color-iris-light` | Secondary violet for outlined buttons, hover strokes, and decorative icon tints where full Studio Violet would be too loud |
| Carbon | `#1d1d1d` | `--color-carbon` | Primary text, dark section backgrounds, hairline borders, icon strokes — the workhorse near-black that replaces pure #000 in body contexts |
| Pure White | `#ffffff` | `--color-pure-white` | Base canvas, card surfaces, text on dark sections, button fills on light backgrounds |
| Fog | `#f6f6f6` | `--color-fog` | First elevation step — subtle card backgrounds, section dividers, muted surface fills that break from pure white without introducing a different color |
| Graphite | `#383838` | `--color-graphite` | Secondary text on light backgrounds, dark hover states, and intermediate borders that need more weight than hairline but less than Carbon |
| Ash | `#d2d2d2` | `--color-ash` | Default borders, input outlines, dividers, and disabled state strokes — the neutral hairline layer |
| Silver | `#b4b4b4` | `--color-silver` | Muted helper text, placeholder copy, and tertiary informational elements |
| Smoke | `#969696` | `--color-smoke` | De-emphasized text, secondary metadata, timestamp labels, and subtitle copy on lighter sections |
| Midnight | `#111111` | `--color-midnight` | Full-bleed dark section backgrounds, inverted surface blocks — slightly deeper than Carbon for maximum contrast against violet accents |
| Onyx | `#000000` | `--color-onyx` | Heading text on light backgrounds, logo lockups, and maximum-contrast borders where no warmth is desired |

## Tokens — Typography

### Inter — Universal typeface for all UI text, body copy, headlines, and buttons. Weight 800 is reserved for hero display headlines; weight 600 for section headings; weight 500 for UI labels and nav; weight 400 for body; weight 300 appears in feature column labels for visual quietness · `--font-inter`
- **Substitute:** Inter (Google Fonts) — identical metrics available
- **Weights:** 300, 400, 500, 600, 700, 800
- **Sizes:** 12, 14, 16, 18, 24, 30, 40, 56, 80
- **Line height:** 1.05–1.70 depending on size — display sizes use 1.04–1.14 (tight), body uses 1.50–1.57
- **Letter spacing:** -0.0060em applied globally — at 80px this is -0.48px, at 56px -0.34px, at 16px -0.10px; the negative tracking tightens headlines into compact slabs and prevents large Inter from feeling loose
- **Role:** Universal typeface for all UI text, body copy, headlines, and buttons. Weight 800 is reserved for hero display headlines; weight 600 for section headings; weight 500 for UI labels and nav; weight 400 for body; weight 300 appears in feature column labels for visual quietness

### IBM Plex Sans — Narrowly used for feature column labels (Record / Edit / Repurpose / Stream / Publish) in dark presentation sections — a geometric, industrial counterpoint to Inter's neutrality that signals functional categories · `--font-ibm-plex-sans`
- **Substitute:** IBM Plex Sans (Google Fonts)
- **Weights:** 600
- **Sizes:** 16
- **Line height:** 1.50
- **Letter spacing:** normal
- **Role:** Narrowly used for feature column labels (Record / Edit / Repurpose / Stream / Publish) in dark presentation sections — a geometric, industrial counterpoint to Inter's neutrality that signals functional categories

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.71 | -0.072px | `--text-caption` |
| body-sm | 14px | 1.57 | -0.084px | `--text-body-sm` |
| body | 16px | 1.5 | -0.096px | `--text-body` |
| subheading | 18px | 1.44 | -0.108px | `--text-subheading` |
| heading-sm | 24px | 1.29 | -0.144px | `--text-heading-sm` |
| heading | 30px | 1.22 | -0.18px | `--text-heading` |
| heading-lg | 40px | 1.17 | -0.24px | `--text-heading-lg` |
| display | 56px | 1.08 | -0.336px | `--text-display` |
| display-xl | 80px | 1.04 | -0.48px | `--text-display-xl` |

## Tokens — Spacing & Shapes

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 6 | 6px | `--spacing-6` |
| 7 | 7px | `--spacing-7` |
| 8 | 8px | `--spacing-8` |
| 10 | 10px | `--spacing-10` |
| 12 | 12px | `--spacing-12` |
| 16 | 16px | `--spacing-16` |
| 17 | 17px | `--spacing-17` |
| 20 | 20px | `--spacing-20` |
| 24 | 24px | `--spacing-24` |
| 26 | 26px | `--spacing-26` |
| 30 | 30px | `--spacing-30` |
| 32 | 32px | `--spacing-32` |
| 34 | 34px | `--spacing-34` |
| 43 | 43px | `--spacing-43` |
| 46 | 46px | `--spacing-46` |

### Border Radius

| Element | Value |
|---------|-------|
| hero | 60px |
| tags | 300px |
| cards | 8px |
| links | 20px |
| badges | 100px |
| images | 4px |
| buttons | 300px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| md | `rgba(0, 0, 0, 0.25) 0px 4px 15px 0px` | `--shadow-md` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 24px
- **Element gap:** 12px

## Components

### Dark Navigation Bar
**Role:** Sticky top navigation across all pages

Dark surface (Carbon #1d1d1d), 64px height, logo lockup left (white Riverside mark), center nav links in Inter 500 16px white, right side holds 'Contact Sales' text link and 'Start for Free' white pill button at 300px radius. Active nav item gets a 2px white underline.

### Violet Pill CTA
**Role:** Primary action button — the single dominant CTA per screen

Studio Violet (#9671ff) background, white text, Inter 500 16px, 300px border-radius, 10px 24px padding, no border. The 300px radius makes it a perfect pill regardless of label length. Hover lightens slightly. Only one violet-filled button should appear per viewport.

### White Filled Pill Button
**Role:** Secondary action on dark sections, primary action on light sections

White (#ffffff) background, Carbon (#1d1d1d) text, Inter 500 16px, 300px border-radius, 10px 20px padding. Used for 'Start for Free' in the nav and for inverted CTAs on dark sections.

### Ghost Outlined Button
**Role:** Tertiary action on dark backgrounds

Transparent fill, 1px white border, white text, Inter 500 16px, 300px border-radius, 10px 24px padding. Used sparingly for secondary actions that should not compete with the primary violet CTA.

### Feature Tag Pill
**Role:** Category labels and filter chips

Lavender Mist (#f2eeff) or Periwinkle Tint (#eae3ff) background, Carbon text, Inter 500 14px, 300px border-radius, 6px 14px padding, optional small icon prefix. Active/selected state deepens to Periwinkle Tint.

### Content Showcase Card
**Role:** Displaying user-generated content (podcast clips, videos)

4px border-radius on the image area (sharp corners create a photographic, frame-like quality), 8px radius on the surrounding card container, 1px Ash (#d2d2d2) border, 12px padding. Cards sit in a horizontal scroll or 5-column grid.

### Feature Column Label
**Role:** Category heading in dark presentation sections

IBM Plex Sans 600 16px, white text, used for labels like 'Record', 'Edit', 'Repurpose', 'Stream', 'Publish'. The geometric Plex sans against Inter body copy creates a typographic system within a system — the label says 'function', the description says 'human'.

### Trust Logo Strip
**Role:** Social proof bar showing partner and customer logos

Full-width band, Fog (#f6f6f6) or white background, single-row horizontal layout of grayscale logos (Spotify, Microsoft, Verizon Media, Marvel, HubSpot, The New York Times, TED, The Economist). Logos rendered in Carbon or Smoke for monochrome consistency — no color logos.

### Dark Feature Section
**Role:** Full-bleed dark presentation block

Midnight (#111111) or Carbon (#1d1d1d) background, spans full viewport width, internal max-width 1200px container. Holds feature column labels in IBM Plex Sans, white Inter body copy below, and a single violet CTA at the bottom-left. Section padding 80px vertical.

### Feature Highlight Row
**Role:** 2-column feature presentation: text left, visual right

White background, max-width 1200px centered, 48px gap between columns. Left column holds Inter 800 40px heading (Carbon) + Inter 400 18px body (Graphite) + optional small badge icon. Right column holds a 8px-radius image or product screenshot at 60px asymmetric radius for hero-sized visuals.

### Hero Section
**Role:** Full-viewport opening with overlaid text on photographic background

Full-bleed dark photographic background (creator portrait), left-aligned text block occupying ~50% width: Inter 800 56–80px white headline with -0.48px tracking, Inter 400 18px white-at-80% body copy, 2-row feature tag pill cluster, and Studio Violet pill CTA. Text sits on a subtle gradient overlay for legibility.

### Section Heading Block
**Role:** Section opener for content bands

Centered or left-aligned, Inter 800 40–56px Carbon heading, Inter 400 18px Graphite subtext below with 12px gap. No decorative elements — typography alone carries the entrance.

## Do's and Don'ts

### Do
- Use Inter weight 800 for all display and section headlines with -0.0060em letter-spacing — the tight tracking prevents large Inter from feeling loose and creates the compressed slab look that defines the brand
- Apply 300px border-radius to every button and tag — the pill shape is the single most recognizable UI element in the system
- Use #9671ff (Studio Violet) for exactly one filled CTA per viewport — rationing the accent is what makes it function as a visual switch
- Alternate between full-bleed dark sections (#111111) and white content bands — the on/off cadence creates cinematic rhythm instead of a continuous flat layout
- Set headlines at 56–80px with line-height 1.04–1.08 — the tight leading makes large type feel architectural rather than airy
- Use IBM Plex Sans 600 exclusively for feature column labels in dark presentation sections — the geometric counterpoint separates functional categories from descriptive body copy
- Render all trust and partner logos in grayscale (Carbon or Smoke) — color logos break the monochrome discipline that makes the violet accent pop

### Don't
- Do not introduce additional accent colors — the system is one-accent by design; a second hue dilutes the signal value of Studio Violet
- Do not use #000000 for body text — use #1d1d1d (Carbon); pure black against white is too harsh and breaks the slightly warm neutrality of the system
- Do not apply heavy box-shadows for elevation — the card shadow rgba(0,0,0,0.25) 0px 4px 15px is a rare exception; prefer borders and surface tints to show hierarchy
- Do not set body line-height above 1.65 — tight leading (1.50–1.57) is part of the compact, confident voice
- Do not place violet CTAs adjacent to each other — one per viewport, separated by white space or a different section
- Do not use rounded images above 8px radius — the sharp 4px frame on content cards creates a photographic quality; oversized rounding would feel toy-like
- Do not use IBM Plex Sans for body copy or large headlines — it is a label-only typeface; using it at scale breaks the Inter-dominant system

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas | `#ffffff` | Base page background across all light sections |
| 1 | Fog Card | `#f6f6f6` | Subtle elevated card surfaces, inline highlight regions |
| 2 | Lavender Mist | `#f2eeff` | Brand-tinted wash for selected tags, active nav backgrounds, soft accent blocks |
| 3 | Periwinkle Tint | `#eae3ff` | Deeper brand wash for highlighted content blocks, callout regions |
| 4 | Midnight Block | `#111111` | Full-bleed dark sections, hero backgrounds, feature presentation zones |

## Elevation

- **Content Card:** `rgba(0, 0, 0, 0.25) 0px 4px 15px 0px`

## Imagery

Photography is central: full-bleed creator portraits in the hero (warm-lit, direct gaze, studio-quality), lifestyle and studio shots in trust sections, and 4px-radius product crops in feature rows. All photography skews high-key with natural light, featuring people in creative or professional contexts. No illustrations, no 3D renders, no abstract graphics — the brand relies on the credibility of real creator imagery. Iconography is minimal: thin-stroke line icons in Carbon or Iris Light, used only for feature tags and nav indicators.

## Layout

Centered max-width 1200px container with full-bleed dark hero sections that extend edge-to-edge. Hero pattern: full-viewport photographic background with left-aligned text block (50% width), feature tag cluster, and single violet CTA. Section rhythm alternates: dark hero → white feature band → dark presentation section → white card grid → dark CTA band → white footer. Content arrangement is asymmetric — text-left/visual-right in feature rows, with headings sometimes centered for section openers. Grid usage: 5-column horizontal card row for content showcases, 2-column text+visual for feature highlights, single-column centered for dark presentation sections. Navigation is a sticky dark top bar with centered links. Generous 80px section gaps create breathing room between the high-contrast bands.

## Agent Prompt Guide

**Quick Color Reference**
- Canvas: #ffffff
- Primary text: #1d1d1d (Carbon)
- Muted text: #383838 (Graphite) / #969696 (Smoke)
- Border: #d2d2d2 (Ash)
- Accent wash: #f2eeff (Lavender Mist) / #eae3ff (Periwinkle Tint)
- primary action: #9671ff (filled action)
- Dark section bg: #111111 (Midnight)

**Example Component Prompts**

1. Create a Primary Action Button: #9671ff background, #111111 text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.

2. *Feature highlight row*: White (#ffffff) background, max-width 1200px centered. Left column: Inter 800 40px heading in Carbon, Inter 400 18px body in Graphite, 12px gap between heading and body. Right column: image with 8px border-radius and optional 1px Ash (#d2d2d2) border. 48px gap between columns.


4. *Content showcase card*: 4px border-radius on the top image area, 8px radius on the card container, 1px Ash (#d2d2d2) border, 12px padding around the content area below the image. Image fills the full card width with no padding.

5. *Trust logo strip*: Full-width band, white or Fog (#f6f6f6) background, 40px vertical padding. Single row of grayscale logos (rendered in Carbon #1d1d1d or Smoke #969696) with 48px horizontal gap. Logos should be visually balanced to similar heights (~24–28px). No color logos, no decorative frames.

## Similar Brands

- **Descript** — Same creator-tools category, same monochrome light system with a single saturated accent color, same pill-button CTA language, same dark/light section alternation
- **Loom** — Video creation platform with a near-identical violet/lavender accent on a white-and-black canvas, and the same pill-shaped button system
- **Podcastle** — Direct podcast/creator competitor with a comparable monochrome interface and single purple accent, similar tight typographic rhythm
- **Kapwing** — Content creation tool with a white-canvas, dark-text system that rations a single vibrant accent for primary actions
- **Notion** — Shares the flat, nearly shadowless surface treatment and the Inter-led typographic system with subtle negative tracking

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-studio-violet: #9671ff;
  --color-lavender-mist: #f2eeff;
  --color-periwinkle-tint: #eae3ff;
  --color-iris-light: #ad98fa;
  --color-carbon: #1d1d1d;
  --color-pure-white: #ffffff;
  --color-fog: #f6f6f6;
  --color-graphite: #383838;
  --color-ash: #d2d2d2;
  --color-silver: #b4b4b4;
  --color-smoke: #969696;
  --color-midnight: #111111;
  --color-onyx: #000000;

  /* Typography — Font Families */
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-ibm-plex-sans: 'IBM Plex Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.71;
  --tracking-caption: -0.072px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.57;
  --tracking-body-sm: -0.084px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.096px;
  --text-subheading: 18px;
  --leading-subheading: 1.44;
  --tracking-subheading: -0.108px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.29;
  --tracking-heading-sm: -0.144px;
  --text-heading: 30px;
  --leading-heading: 1.22;
  --tracking-heading: -0.18px;
  --text-heading-lg: 40px;
  --leading-heading-lg: 1.17;
  --tracking-heading-lg: -0.24px;
  --text-display: 56px;
  --leading-display: 1.08;
  --tracking-display: -0.336px;
  --text-display-xl: 80px;
  --leading-display-xl: 1.04;
  --tracking-display-xl: -0.48px;

  /* Typography — Weights */
  --font-weight-light: 300;
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
  --font-weight-extrabold: 800;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-6: 6px;
  --spacing-7: 7px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-17: 17px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-26: 26px;
  --spacing-30: 30px;
  --spacing-32: 32px;
  --spacing-34: 34px;
  --spacing-43: 43px;
  --spacing-46: 46px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 24px;
  --element-gap: 12px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-2xl: 16.128px;
  --radius-2xl-2: 20px;
  --radius-3xl: 29.952px;
  --radius-3xl-2: 33.984px;
  --radius-3xl-3: 36px;
  --radius-full: 60px;
  --radius-full-2: 100px;
  --radius-full-3: 300px;

  /* Named Radii */
  --radius-hero: 60px;
  --radius-tags: 300px;
  --radius-cards: 8px;
  --radius-links: 20px;
  --radius-badges: 100px;
  --radius-images: 4px;
  --radius-buttons: 300px;

  /* Shadows */
  --shadow-md: rgba(0, 0, 0, 0.25) 0px 4px 15px 0px;

  /* Surfaces */
  --surface-canvas: #ffffff;
  --surface-fog-card: #f6f6f6;
  --surface-lavender-mist: #f2eeff;
  --surface-periwinkle-tint: #eae3ff;
  --surface-midnight-block: #111111;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-studio-violet: #9671ff;
  --color-lavender-mist: #f2eeff;
  --color-periwinkle-tint: #eae3ff;
  --color-iris-light: #ad98fa;
  --color-carbon: #1d1d1d;
  --color-pure-white: #ffffff;
  --color-fog: #f6f6f6;
  --color-graphite: #383838;
  --color-ash: #d2d2d2;
  --color-silver: #b4b4b4;
  --color-smoke: #969696;
  --color-midnight: #111111;
  --color-onyx: #000000;

  /* Typography */
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-ibm-plex-sans: 'IBM Plex Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.71;
  --tracking-caption: -0.072px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.57;
  --tracking-body-sm: -0.084px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.096px;
  --text-subheading: 18px;
  --leading-subheading: 1.44;
  --tracking-subheading: -0.108px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.29;
  --tracking-heading-sm: -0.144px;
  --text-heading: 30px;
  --leading-heading: 1.22;
  --tracking-heading: -0.18px;
  --text-heading-lg: 40px;
  --leading-heading-lg: 1.17;
  --tracking-heading-lg: -0.24px;
  --text-display: 56px;
  --leading-display: 1.08;
  --tracking-display: -0.336px;
  --text-display-xl: 80px;
  --leading-display-xl: 1.04;
  --tracking-display-xl: -0.48px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-6: 6px;
  --spacing-7: 7px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-17: 17px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-26: 26px;
  --spacing-30: 30px;
  --spacing-32: 32px;
  --spacing-34: 34px;
  --spacing-43: 43px;
  --spacing-46: 46px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-2xl: 16.128px;
  --radius-2xl-2: 20px;
  --radius-3xl: 29.952px;
  --radius-3xl-2: 33.984px;
  --radius-3xl-3: 36px;
  --radius-full: 60px;
  --radius-full-2: 100px;
  --radius-full-3: 300px;

  /* Shadows */
  --shadow-md: rgba(0, 0, 0, 0.25) 0px 4px 15px 0px;
}
```
