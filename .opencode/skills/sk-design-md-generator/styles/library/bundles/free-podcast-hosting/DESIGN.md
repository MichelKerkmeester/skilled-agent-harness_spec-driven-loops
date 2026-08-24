# Free Podcast Hosting — Style Reference
> Botanical broadcast studio — a forest-green command console on white paper, anchored by a massive condensed-serif headline that reads like a magazine cover for audio.

**Theme:** light

Buzzsprout's design language is a quiet, editorial command center for audio creators: a white canvas overlaid with a single deep botanical green (#214538) that carries every brand action and headline. The interface is deliberately sparse, leaning on generous whitespace, hairline #e4e5e6 borders, and soft 8px radii to build a sense of calm professionalism. Typography is the signature element — a condensed serif display face (Girott) shouting at 168px sits against the practical geometric sans (Graphik) handling everything else, creating a magazine-meets-dashboard tension. Color is used as punctuation, not decoration: green appears only on CTAs, active states, brand marks, and key links, while body text stays in a near-black green-tinted ink (#151e1b) and helper copy drops to #4d4d4f. The rhythm alternates between bright white product sections and a single dark photographic band, giving the page a focused, almost meditative feel rather than a marketing-firehose energy.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Forest Canopy | `#214538` | `--color-forest-canopy` | Primary brand action — CTA button fills, nav text, active tab indicators, brand icons, link hovers, section headings. Deep botanical green against white gives every action weight without aggression |
| Studio Ink | `#151e1b` | `--color-studio-ink` | Primary body and heading text. Slightly green-tinted near-black reads as quieter than pure #000, harmonizing with the brand green instead of fighting it |
| Graphite Body | `#4d4d4f` | `--color-graphite-body` | Secondary and helper text — descriptions, captions, supporting copy under headings and feature labels |
| Ash Border | `#e4e5e6` | `--color-ash-border` | Default hairline border for cards, inputs, nav containers, list dividers, and button outlines. The structural skeleton of the interface |
| Fog Surface | `#f4f4f4` | `--color-fog-surface` | Subtle background for tab buttons, list rows, and secondary button borders. One step darker than white to delineate zones without elevation |
| Moss Wash | `#e5ede9` | `--color-moss-wash` | Soft green-tinted card surface — used for stat cards and feature tiles where a faint brand color cue is needed without commitment to a filled green block |
| Paper White | `#ffffff` | `--color-paper-white` | Page canvas, card surfaces, button text on dark green fills, icon knockouts. The dominant background across the entire site |
| Cast Iron | `#000000` | `--color-cast-iron` | Icon fills and select heading text where maximum contrast is needed. Used sparingly — mostly for decorative SVG icon weight |
| Citrus Note | `#faefc3` | `--color-citrus-note` | Yellow wash for highlight backgrounds, decorative bands, and soft emphasis behind content. |
| Link Green | `#208619` | `--color-link-green` | Green text accent for links, tags, and emphasized short phrases. Do not promote it to the primary CTA color |

## Tokens — Typography

### Girott — Display headline — used for the hero statement at 168px, uppercase, +0.083em tracking. A condensed editorial serif that converts a SaaS homepage into a magazine cover. Free substitute: Oswald Bold or Bebas Neue if Girott is unavailable, but the condensed stencil-serif character is the signature. · `--font-girott`
- **Substitute:** Bebas Neue, Oswald, or Antonio
- **Weights:** 600
- **Sizes:** 168px
- **Line height:** 1.00
- **Letter spacing:** 13.9px (0.083em at 168px)
- **Role:** Display headline — used for the hero statement at 168px, uppercase, +0.083em tracking. A condensed editorial serif that converts a SaaS homepage into a magazine cover. Free substitute: Oswald Bold or Bebas Neue if Girott is unavailable, but the condensed stencil-serif character is the signature.

### Graphik — Primary interface typeface — body, headings, nav, buttons, cards. Weights 400/500 carry body and UI; 600/700 are reserved for section headings and emphasis. Negative letter-spacing tightens geometric forms at larger sizes, giving a precise editorial feel rather than a friendly rounded look. Free substitute: Inter (closest open-source match) or Manrope. · `--font-graphik`
- **Substitute:** Inter, Manrope, or Söhne
- **Weights:** 400, 500, 600, 700
- **Sizes:** 10px, 12px, 14px, 15px, 16px, 18px, 20px, 24px, 25px, 30px, 35px, 48px, 50px, 60px
- **Line height:** 1.10–1.50 (tight for headlines, 1.50 for body, 2.50 for loose lists)
- **Letter spacing:** -0.96px at 60px, -0.65px at 50px, -0.576px at 48px, -0.385px at 35px, -0.30px at 30px, -0.225px at 25px, -0.192px at 24px, -0.14px at 20px, -0.108px at 18px, -0.08px at 16px, -0.042px at 14px, normal at 12px and below
- **Role:** Primary interface typeface — body, headings, nav, buttons, cards. Weights 400/500 carry body and UI; 600/700 are reserved for section headings and emphasis. Negative letter-spacing tightens geometric forms at larger sizes, giving a precise editorial feel rather than a friendly rounded look. Free substitute: Inter (closest open-source match) or Manrope.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.5 | — | `--text-caption` |
| body-sm | 14px | 1.5 | -0.042px | `--text-body-sm` |
| body | 16px | 1.5 | -0.08px | `--text-body` |
| subheading | 18px | 1.43 | -0.108px | `--text-subheading` |
| heading-sm | 24px | 1.33 | -0.192px | `--text-heading-sm` |
| heading | 30px | 1.2 | -0.3px | `--text-heading` |
| heading-lg | 48px | 1.1 | -0.576px | `--text-heading-lg` |
| display | 168px | 1 | 13.9px | `--text-display` |

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
| 48 | 48px | `--spacing-48` |
| 80 | 80px | `--spacing-80` |
| 96 | 96px | `--spacing-96` |
| 100 | 100px | `--spacing-100` |
| 128 | 128px | `--spacing-128` |
| 132 | 132px | `--spacing-132` |
| 156 | 156px | `--spacing-156` |

### Border Radius

| Element | Value |
|---------|-------|
| tabs | 8px |
| cards | 8px |
| inputs | 8px |
| avatars | 9999px |
| buttons | 4px |
| featureCards | 12px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| xl | `rgba(0, 0, 0, 0.1) 0px 20px 25px -5px, rgba(0, 0, 0, 0.1)...` | `--shadow-xl` |
| xl-2 | `rgba(0, 0, 0, 0.16) 0px 10px 36px 0px` | `--shadow-xl-2` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 24px
- **Element gap:** 16px

## Components

### Primary CTA Button
**Role:** The single filled brand action — used for 'Get Started Free' and signup flows.

Background #214538, text #ffffff, Graphik 500 at 16px, 4px border-radius, 13px vertical × 20px horizontal padding. No border. Sits high-contrast against white. Tight tracking (-0.08px) and medium weight (500) — not bold, so the button feels confident rather than shouty.

### Ghost Text Link
**Role:** Secondary navigation and inline body links.

No background, no border. Text #214538 at 16px Graphik 500. Underline on hover only. Lives next to the primary CTA in the nav and hero.

### Tab Filter Pill
**Role:** Category filter for reviews and content lists.

8px border-radius, 10px vertical × 20px horizontal padding. Default: 1px border #e4e5e6, text #151e1b, background #ffffff. Active: background #214538, text #ffffff, no border. Inactive hover: background #f4f4f4. Graphik 500 at 14px.

### Feature Icon Tile
**Role:** Feature row items in the product overview — 'Podcast Hosting', 'Fan Mail', 'Mobile', etc.

Centered layout. Icon: 24px line icon in #214538, stroke weight ~1.5px, outlined style (never filled). Heading: Graphik 600 at 18px, #151e1b. Description: Graphik 400 at 15px, #4d4d4f, max-width ~200px. No card chrome — the icon and text float directly on white.

### Product Mockup Card
**Role:** Showcases the Buzzsprout dashboard and mobile app within the hero area.

White background, 8px border-radius, soft elevation: 0px 20px 25px -5px rgba(0,0,0,0.1) + 0px 8px 10px -6px rgba(0,0,0,0.1). Contains nested rounded panels (12-20px radius) representing device frames. The double-layer shadow creates a subtle lifted-but-floating effect rather than a heavy drop.

### Listing Status Card
**Role:** Shows directory listing status (Spotify, Apple Podcasts, YouTube, etc.) with logos and 'Listed' badges.

White background, 8px border-radius, 1px border #e4e5e6. Logo area: centered brand logo (native colors). Status badge: 'Listed' = #208619 text on white with checkmark icon; 'Get Listed' = #151e1b text on white. No padding symmetry — generous 24px top/bottom.

### Testimonial Card
**Role:** 5-star review cards from real podcasters.

Centered text on white, no card background or border. Five #214538 star icons (filled, 16px) in a row. Quote heading: Graphik 600 at 18px, #151e1b. Body: Graphik 400 at 14px, #4d4d4f. Attribution: Graphik 400 italic at 12px, #4d4d4f. The absence of a card border makes testimonials feel like editorial pull-quotes, not UI widgets.

### Stat Highlight Card
**Role:** Promotes '400,000+ podcasters launched' type numbers.

Uses Moss Wash #e5ede9 background with 8px border-radius and 24px padding. Number: Graphik 700 at 48px, #214538, letter-spacing -0.576px. Label: Graphik 400 at 14px, #4d4d4f. The green-tinted background ties the stat to brand without requiring a full green block.

### Dark Band Section
**Role:** Full-width dark photographic break section — 'Keep podcasting, even when you hit roadblocks'.

Full-bleed background image at 30-40% opacity overlay over #151e1b. Headline: Graphik 700 at 35-48px, #ffffff, letter-spacing -0.4px. Subtext: Graphik 400 at 16px, #ffffff at 80% opacity. Section padding: 80px vertical. This is the only dark inversion on the page — used to punctuate, not to dominate.

### Top Navigation Bar
**Role:** Primary site navigation.

White background, no border-bottom (or hairline 1px #e4e5e6). Logo left (Buzzsprout wordmark in #214538 with green leaf icon). Nav links center: Graphik 500 at 15px, #151e1b, 20-24px horizontal spacing. Right cluster: 'Log In' ghost text link + Primary CTA Button (4px radius, slightly smaller 13px×17px padding). Total height ~64-72px.

### Highlight Tip Card
**Role:** Warm yellow callout cards for tips, pro features, or 'did you know' blocks.

Background #faefc3, 8px border-radius, 20px padding. Text: Graphik 500 at 16px, #151e1b. The muted yellow reads as 'sticky note' — informal and helpful, never alarming.

### Input Field
**Role:** Text inputs in forms.

1px border #e4e5e6, 8px border-radius, 12px vertical × 16px horizontal padding. Background #ffffff. Placeholder text: #4d4d4f at Graphik 400 16px. Focus: border darkens to #214538. No shadow on focus — the border color change is the only state signal.

### Star Rating Display
**Role:** 5-star rating display above testimonials.

Five 16px filled stars in #214538, 4px horizontal gap. No background container. The brand green stars (not gold/yellow) make ratings feel like a brand asset rather than a generic review widget.

## Do's and Don'ts

### Do
- Use Forest Canopy #214538 exclusively for the primary filled CTA, active tab state, and the 5-star rating — never as a wide background block or decorative wash.
- Apply Girott (or its substitute) at 168px uppercase for the single hero headline only. Do not reuse the display face for section headings — Graphik 600/700 at 30-48px carries all secondary headlines.
- Set border-radius to 4px for buttons, 8px for cards/inputs/images, and 9999px for circular avatars. Mixing radii outside this triad breaks the system's precision.
- Use hairline #e4e5e6 borders as the primary structural separator. Reserve soft shadows (the double-layer 25px+10px stack) exclusively for product mockup images that need to feel lifted off the page.
- Set body text to Studio Ink #151e1b and helper text to Graphite Body #4d4d4f. Never use pure #000 for body — the slight green tint keeps the text in conversation with the brand.
- Apply the negative letter-spacing pattern: -0.08px at 16px scaling up to -0.96px at 60px. Tight tracking is part of the editorial voice — relaxed spacing at display sizes will flatten the typography.
- Use the single dark photographic band as a one-time inversion between white sections. The page should feel 90% white — adding more dark sections dilutes the contrast.

### Don't
- Don't introduce additional chromatic colors beyond Link Green #208619 and Citrus Note #faefc3. Any new hue competes with the single Forest Canopy identity.
- Don't use bold (700) weight for body or button text — Graphik 500 is the heaviest UI weight. Reserve 700 for section headings only.
- Don't apply heavy drop shadows to cards or UI elements. The system uses shadows only on product mockup images; cards rely on hairline borders, not elevation.
- Don't set button border-radius above 4px. The sharp-ish 4px button paired with 8px cards is a deliberate contrast — pill-shaped buttons break the editorial precision.
- Don't use the display Girott face below 100px. Its condensed stencil character loses impact at small sizes and overlaps with Graphik 700's territory.
- Don't use Citrus Note #faefc3 as a CTA, badge, or status color — it is a card surface only. Using it for alerts or warnings would mislabel its tone.
- Don't stretch the page beyond 1200px max-width or use full-bleed sections for content layouts. The dark hero band is the only full-width element; everything else is contained.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Paper White | `#ffffff` | Base canvas — page background, section backgrounds, most card surfaces |
| 1 | Fog Surface | `#f4f4f4` | Subtle alt-row and tab button background, delineates zones without elevation |
| 2 | Moss Wash | `#e5ede9` | Brand-tinted card surface for stat tiles and feature highlights |
| 3 | Citrus Note | `#faefc3` | Warm highlight cards for tips, callouts, and promotional blocks |
| 4 | Studio Ink | `#151e1b` | Dark band surfaces — used in the single dark photographic hero section for inversion |

## Elevation

- **Product Mockup Card (dashboard/mobile showcase):** `0px 20px 25px -5px rgba(0,0,0,0.1), 0px 8px 10px -6px rgba(0,0,0,0.1)`
- **Feature highlight card (rare, large spotlight blocks):** `0px 10px 36px 0px rgba(0,0,0,0.16)`

## Imagery

Imagery is used sparingly and with a documentary feel. The single dark hero band features a photographic overlay of a real podcaster in their studio (lifestyle, candid, not staged), treated with a dark scrim to integrate with white text. Product mockups — dashboard panels and mobile app screens — appear as crisp UI screenshots on white with soft shadows, cropped tightly to the device frame. The 5-star testimonial logos (Apple Podcasts, Spotify, YouTube, Amazon Music, iHeart, TuneIn, Pocket Casts) appear in their native brand colors as social proof, the only place multicolored logos are permitted. Feature icons are 24px outlined line icons in Forest Canopy green, stroke weight ~1.5px, never filled. There are no decorative illustrations, abstract graphics, or 3D renders — the visual identity is photographic + UI-screenshot + line-icon, nothing else.

## Layout

The page follows a max-width 1200px centered container with a single full-bleed dark band as inversion. The hero is a two-column split: massive Girott headline + supporting paragraph + CTA on the left (60%), product mockup card overlapping on the right (40%). Sections are stacked vertically with 80px gaps, alternating between white and very-light-gray. The feature row is a 5-column equal grid of icon + label + description, centered. The directory listing section uses a 4-column grid of platform cards. Testimonials are a 3-column grid of centered text. The dark band breaks the rhythm with a full-bleed photographic background and left-aligned text overlay. Navigation is a flat top bar (not sticky), white with no border. The overall density is comfortable — generous whitespace between sections, no dense information blocks, each section gets room to breathe.

## Agent Prompt Guide

**Quick Color Reference**
- text: #151e1b (Studio Ink)
- background: #ffffff (Paper White)
- border: #e4e5e6 (Ash Border)
- accent: #214538 (Forest Canopy)
- primary action: #214538 (filled action)
- highlight card: #faefc3 (Citrus Note)

**3-5 Example Component Prompts**

1. **Hero Section**: White background. Display headline at 168px Girott weight 600, uppercase, #214538, letter-spacing 13.9px. Subtext at 18px Graphik 400, #4d4d4f. Primary CTA: #214538 background, white text, Graphik 500 16px, 4px radius, 13px×20px padding. Supporting product mockup card on the right with the double-layer soft shadow (0px 20px 25px -5px rgba(0,0,0,0.1) + 0px 8px 10px -6px rgba(0,0,0,0.1)).

2. **5-Column Feature Row**: White background, 80px section gap above. Five equal columns. Each column: 24px outlined line icon in #214538 (1.5px stroke), Graphik 600 at 18px heading in #151e1b below, Graphik 400 at 15px description in #4d4d4f below that, max-width 200px.

3. **Tab Filter Bar**: Centered horizontal row of pill tabs. Default tab: 1px border #e4e5e6, #ffffff background, #151e1b text at Graphik 500 14px, 8px radius, 10px×20px padding. Active tab: #214538 background, #ffffff text, no border. 16px gap between tabs.

4. **Testimonial Card**: No card chrome — floats on white. Five 16px filled stars in #214538 with 4px gap. Quote heading: Graphik 600 at 18px, #151e1b, centered. Body: Graphik 400 at 14px, #4d4d4f, centered. Attribution: Graphik 400 italic at 12px, #4d4d4f, centered.

5. **Dark Band Section**: Full-bleed photographic background at 40% opacity over #151e1b. Section padding 80px vertical. Headline: Graphik 700 at 48px, #ffffff, letter-spacing -0.576px. Subtext: Graphik 400 at 16px, #ffffff at 80% opacity. This is the only dark section on the page.

## Similar Brands

- **Squarespace** — Same editorial display-headline + clean white-canvas approach, with a single full-bleed photographic dark band as rhythm-breaking inversion
- **Substack** — Same quiet-white + single-accent-color treatment, generous whitespace, and the sense that the product speaks for itself without marketing density
- **ConvertKit** — Same creator-tools audience, single dark green as brand action color, comfortable density with hairline-border card chrome
- **Stripe (earlier eras)** — Same 1200px max-width centered container, soft double-layer product mockup shadows, and restrained chromatic palette where color appears only as functional punctuation
- **Klaviyo** — Same deep-saturated primary brand color against white canvas, hairline border system, and 5-column feature row pattern

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-forest-canopy: #214538;
  --color-studio-ink: #151e1b;
  --color-graphite-body: #4d4d4f;
  --color-ash-border: #e4e5e6;
  --color-fog-surface: #f4f4f4;
  --color-moss-wash: #e5ede9;
  --color-paper-white: #ffffff;
  --color-cast-iron: #000000;
  --color-citrus-note: #faefc3;
  --color-link-green: #208619;

  /* Typography — Font Families */
  --font-girott: 'Girott', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-graphik: 'Graphik', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --text-body-sm: 14px;
  --leading-body-sm: 1.5;
  --tracking-body-sm: -0.042px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.08px;
  --text-subheading: 18px;
  --leading-subheading: 1.43;
  --tracking-subheading: -0.108px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.33;
  --tracking-heading-sm: -0.192px;
  --text-heading: 30px;
  --leading-heading: 1.2;
  --tracking-heading: -0.3px;
  --text-heading-lg: 48px;
  --leading-heading-lg: 1.1;
  --tracking-heading-lg: -0.576px;
  --text-display: 168px;
  --leading-display: 1;
  --tracking-display: 13.9px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

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
  --spacing-48: 48px;
  --spacing-80: 80px;
  --spacing-96: 96px;
  --spacing-100: 100px;
  --spacing-128: 128px;
  --spacing-132: 132px;
  --spacing-156: 156px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 24px;
  --element-gap: 16px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 20px;
  --radius-full: 9999px;

  /* Named Radii */
  --radius-tabs: 8px;
  --radius-cards: 8px;
  --radius-inputs: 8px;
  --radius-avatars: 9999px;
  --radius-buttons: 4px;
  --radius-featurecards: 12px;

  /* Shadows */
  --shadow-xl: rgba(0, 0, 0, 0.1) 0px 20px 25px -5px, rgba(0, 0, 0, 0.1) 0px 8px 10px -6px;
  --shadow-xl-2: rgba(0, 0, 0, 0.16) 0px 10px 36px 0px;

  /* Surfaces */
  --surface-paper-white: #ffffff;
  --surface-fog-surface: #f4f4f4;
  --surface-moss-wash: #e5ede9;
  --surface-citrus-note: #faefc3;
  --surface-studio-ink: #151e1b;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-forest-canopy: #214538;
  --color-studio-ink: #151e1b;
  --color-graphite-body: #4d4d4f;
  --color-ash-border: #e4e5e6;
  --color-fog-surface: #f4f4f4;
  --color-moss-wash: #e5ede9;
  --color-paper-white: #ffffff;
  --color-cast-iron: #000000;
  --color-citrus-note: #faefc3;
  --color-link-green: #208619;

  /* Typography */
  --font-girott: 'Girott', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-graphik: 'Graphik', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --text-body-sm: 14px;
  --leading-body-sm: 1.5;
  --tracking-body-sm: -0.042px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.08px;
  --text-subheading: 18px;
  --leading-subheading: 1.43;
  --tracking-subheading: -0.108px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.33;
  --tracking-heading-sm: -0.192px;
  --text-heading: 30px;
  --leading-heading: 1.2;
  --tracking-heading: -0.3px;
  --text-heading-lg: 48px;
  --leading-heading-lg: 1.1;
  --tracking-heading-lg: -0.576px;
  --text-display: 168px;
  --leading-display: 1;
  --tracking-display: 13.9px;

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
  --spacing-48: 48px;
  --spacing-80: 80px;
  --spacing-96: 96px;
  --spacing-100: 100px;
  --spacing-128: 128px;
  --spacing-132: 132px;
  --spacing-156: 156px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 20px;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-xl: rgba(0, 0, 0, 0.1) 0px 20px 25px -5px, rgba(0, 0, 0, 0.1) 0px 8px 10px -6px;
  --shadow-xl-2: rgba(0, 0, 0, 0.16) 0px 10px 36px 0px;
}
```
