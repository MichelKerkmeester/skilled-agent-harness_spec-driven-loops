# Campsite — Style Reference
> sunlit editorial workspace — warm cream paper with one orange stamp of intent

**Theme:** light

Campsite is a sunlit editorial workspace — warm cream canvas, near-black Inter typography, and a single vivid orange that marks brand moments. The interface reads like a thoughtfully arranged bulletin board: compact rows, pill-shaped controls, soft 5%-black shadows, and generous breathing room between sections. Color is rationed — chromatic notes appear only in the logo, the paint-splash decorative motifs, a few tags, and semantic states. The density is compact but the layout feels open because of wide gutters and generous section padding; everything important sits on pure white cards floating just above the cream paper beneath them.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Campfire Orange | `#ff6b1a` | `--color-campfire-orange` | Logo badge, notification pills, and brand-punctuation moments — a single warm coral that anchors the entire palette against the cream canvas |
| Ember Brown | `#451a03` | `--color-ember-brown` | Deep brown accent for paint-splash illustration shadows and inline highlight text in testimonials |
| Sunlit Cream | `#fef3c7` | `--color-sunlit-cream` | Soft warm wash behind tags, badges, and inline highlights |
| Forest Pulse | `#22c55e` | `--color-forest-pulse` | Green supporting accent for decorative details and low-frequency emphasis. Use as a supporting accent, not as a status color |
| Ember Alert | `#ef4444` | `--color-ember-alert` | Red supporting accent for decorative details and low-frequency emphasis. Use as a supporting accent, not as a status color |
| Midnight Ink | `#171717` | `--color-midnight-ink` | Primary text, headings, icon strokes, and dark filled buttons |
| Paper White | `#ffffff` | `--color-paper-white` | Card surfaces, elevated panels, and the top of the surface stack |
| Parchment | `#fffdf9` | `--color-parchment` | Page canvas — a barely-warm off-white that gives the whole site its sunlit feel |
| Fog Gray | `#f5f5f5` | `--color-fog-gray` | Muted backgrounds, secondary surface fills, and input field chrome |
| Linen | `#f0f0f0` | `--color-linen` | Subtle dividers, hover wash on rows, and tag backgrounds |
| Ash Gray | `#a3a3a3` | `--color-ash-gray` | Muted helper text, placeholder copy, and disabled labels |
| Slate | `#737373` | `--color-slate` | Secondary text, timestamps, and metadata in lists |
| Graphite | `#525252` | `--color-graphite` | Tertiary text and muted icon strokes |
| Stone | `#8f7668` | `--color-stone` | Warm muted accent for body copy that should feel quieter than Midnight Ink |

## Tokens — Typography

### Inter — Sole typeface across UI, headings, and body — no display or serif counterpart. The single-family commitment is deliberate: Inter's geometric neutrality keeps focus on content, and the three-weight range (400 body, 500 metadata, 600 display) carries all hierarchy. · `--font-inter`
- **Substitute:** Inter Tight or IBM Plex Sans
- **Weights:** 400, 500, 600
- **Sizes:** 10, 11, 12, 13, 14, 15, 16, 17, 18, 20, 22, 29, 58
- **Line height:** 1.00–1.80
- **Letter spacing:** -1.8px at 58px display, -0.52px at 29px heading, -0.37px at 22px subheading, +0.25px at 10–12px captions
- **OpenType features:** `"ss01" on, "cv11" on`
- **Role:** Sole typeface across UI, headings, and body — no display or serif counterpart. The single-family commitment is deliberate: Inter's geometric neutrality keeps focus on content, and the three-weight range (400 body, 500 metadata, 600 display) carries all hierarchy.

### ui-monospace — Inline code fragments and keyboard shortcuts inside the feed · `--font-ui-monospace`
- **Substitute:** JetBrains Mono or IBM Plex Mono
- **Weights:** 400, 600
- **Sizes:** 12
- **Line height:** 1.00
- **Role:** Inline code fragments and keyboard shortcuts inside the feed

### emoji — emoji — detected in extracted data but not described by AI · `--font-emoji`
- **Weights:** 500, 600
- **Sizes:** 12px, 14px
- **Line height:** 1
- **Role:** emoji — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.2 | 0.3px | `--text-caption` |
| body | 15px | 1.5 | — | `--text-body` |
| subheading | 18px | 1.56 | — | `--text-subheading` |
| heading-sm | 22px | 1.4 | -0.37px | `--text-heading-sm` |
| heading | 29px | 1.2 | -0.52px | `--text-heading` |
| display | 58px | 1 | -1.8px | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** compact

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 8 | 8px | `--spacing-8` |
| 12 | 12px | `--spacing-12` |
| 16 | 16px | `--spacing-16` |
| 20 | 20px | `--spacing-20` |
| 24 | 24px | `--spacing-24` |
| 32 | 32px | `--spacing-32` |
| 48 | 48px | `--spacing-48` |
| 64 | 64px | `--spacing-64` |
| 72 | 72px | `--spacing-72` |
| 80 | 80px | `--spacing-80` |
| 96 | 96px | `--spacing-96` |
| 160 | 160px | `--spacing-160` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 9999px |
| cards | 8-12px |
| pills | 9999px |
| inputs | 8px |
| avatars | 9999px |
| buttons | 9999px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| sm | `rgba(0, 0, 0, 0.05) 0px 3px 6px -3px, rgba(0, 0, 0, 0.05)...` | `--shadow-sm` |
| subtle | `rgba(0, 0, 0, 0.08) 0px 1px 1px -1px, rgba(0, 0, 0, 0.08)...` | `--shadow-subtle` |
| subtle-2 | `rgba(0, 0, 0, 0.05) 0px 1px 2px 0px` | `--shadow-subtle-2` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 64-80px
- **Card padding:** 16-24px
- **Element gap:** 8px

## Components

### Brand Logo Badge
**Role:** Persistent brand mark in the top-left of every page

28px rounded square (radius 8px) filled with Campfire Orange (#ff6b1a), white 'C' glyph at 16px Inter weight 600 centered inside. Acts as the home button.

### Notification Pill Banner
**Role:** Headline-area announcement strip

Inline pill, 9999px radius, 8px 16px padding, Campfire Orange fill, white text at 13px Inter weight 500. Optional leading 'NEW' tag in a 2-tone orange + dot indicator. Sits above the hero headline.

### Hero Headline
**Role:** First-screen page title

58px Inter weight 600 in Midnight Ink, centered, line-height 1.00, letter-spacing -1.8px. Two short lines max. Followed by a 17–18px Inter weight 400 subtitle in Slate (#737373), centered.

### Section Heading
**Role:** Inter-section title in marketing pages

29px Inter weight 600 Midnight Ink, centered, line-height 1.20, letter-spacing -0.52px. One to two lines.

### Filled Pill Button
**Role:** Primary interactive action

9999px radius, 8px 16px padding, Midnight Ink background, white text at 14px Inter weight 500. No border. Soft inset highlight from the elevation stack to suggest a tactile surface.

### Ghost Pill Button
**Role:** Secondary action / link-style button

9999px radius, 8px 16px padding, transparent background, 1px Linen (#f0f0f0) border, Slate text. On hover: Fog Gray wash.

### App Preview Frame
**Role:** Wrapping frame around product screenshots in marketing

White surface, 12px radius, subtle 5%-black shadow stack from the elevation set, optional browser-chrome header (traffic-light dots, title text) at top. Acts as the visual proof artifact for each feature.

### Sidebar Nav Item
**Role:** Navigation row inside the product app

Compact row, 8px 12px padding, small 16px icon in Slate, 14px Inter weight 500 label in Midnight Ink. Active state: Fog Gray fill, Midnight Ink icon. 9999px radius to match the pill language.

### Post List Item
**Role:** Single row inside the main feed

White card surface, 16px padding, 12px radius. Left: 24px avatar (9999px, colored fill or image). Center: author name 14px Inter weight 600, body 14px weight 400 in Midnight Ink. Right: tag pill (9999px, Sunlit Cream fill, Ember Brown text) and timestamp in Ash Gray.

### Channel Card
**Role:** Discoverable team space tile in the channels section

White card, 12px radius, 16px padding, 1px Linen border. Title 18px Inter weight 600, member avatars stacked (16px, 9999px), and a ghost pill CTA in the corner with a small icon.

### Tag / Status Pill
**Role:** Inline metadata badge

9999px radius, 4px 10px padding, 12px Inter weight 500. Variants: Sunlit Cream fill with Ember Brown text, Forest Pulse fill with white text for success, Ember Alert fill with white text for error.

### Search Input
**Role:** People and content search field

Full-width input, 8px radius, 8px 12px padding, Fog Gray fill, Ash Gray placeholder at 14px Inter weight 400. No visible border — the fill is the chrome. Leading 16px search icon in Ash Gray.

### People List Item
**Role:** Right-rail entry showing a person in the app

32px avatar (9999px), 14px Inter weight 500 name in Midnight Ink, 12px Inter weight 400 status in Ash Gray. 8px 12px padding, no card chrome — sits directly on the Fog Gray panel.

### Testimonial Block
**Role:** Pull-quote between feature sections

Left-aligned body copy at 17px Inter weight 400 in Midnight Ink, with the brand-defining sentence set in Inter weight 600 in Ember Brown. Attribution row below: 24px avatar + 13px Inter weight 500 name in Slate, 12px role in Ash Gray.

### Decorative Paint Splash
**Role:** Page-edge ornamental motif

Organic orange + Ember Brown splatter illustration clipped to the far left/right of the viewport on the hero and mid-page sections. Pure decoration — never carries content, never overlaps text. Anchors the 'creative workspace' mood.

## Do's and Don'ts

### Do
- Use 9999px radius for every interactive element — buttons, tags, avatars, and pills all share the same full-curve language
- Set hero headlines at 58px Inter weight 600 with -1.8px letter-spacing so the type settles into a confident, compressed silhouette
- Layer surfaces as Parchment (#fffdf9) canvas → Paper White (#ffffff) card → Fog Gray (#f5f5f5) inset — never use pure gray borders to separate layers
- Reserve Campfire Orange (#ff6b1a) for logo, notification pills, and one or two brand moments per page — never use it for routine CTAs
- Keep the 4px base unit: use 8px for element gaps, 12–16px for card padding, 64–80px for section gaps
- Apply the soft 5%-black shadow stack to any card that floats above another surface — inset highlight shadows belong only on filled buttons
- Use Inter weight 600 for all display sizes and weight 500 for metadata, never let body copy go above weight 400

### Don't
- Don't introduce a second typeface — the single-family Inter system is the design, not a limitation to work around
- Don't add blue, purple, or any cool chromatic accent — the palette is intentionally warm-only, and a cool note would break the cream-paper mood
- Don't use hard 1px gray borders to separate cards from the canvas — the warm off-white background already does the work
- Don't use Campfire Orange for everyday buttons, links, or icon states — chromatic color is rationed to brand punctuation only
- Don't set headlines above 60px or below 22px without a structural reason — the 22/29/58 scale carries the rhythm
- Don't use sharp 0px or 2px radii on surfaces — the 8–12px range is what makes the cards feel like paper, not glass
- Don't place photography or lifestyle imagery inside the marketing flow — paint splashes and product screenshots are the only visual registers

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Parchment Canvas | `#fffdf9` | Page background — warm off-white that absorbs the site into editorial paper |
| 2 | Paper White | `#ffffff` | Card surfaces and the main feed container — pure white lifts content above the canvas |
| 3 | Fog Gray | `#f5f5f5` | Hover states, secondary panels, and the inside of the people sidebar |
| 4 | Sunlit Cream | `#fef3c7` | Occasional warm wash for highlighted tags and inline callouts |

## Elevation

- **Card / surface elevation:** `0 3px 6px -3px rgba(0,0,0,0.05), 0 2px 4px -2px rgba(0,0,0,0.05), 0 1px 2px -1px rgba(0,0,0,0.05), 0 1px 1px -1px rgba(0,0,0,0.05), 0 1px 0 -1px rgba(0,0,0,0.05)`
- **Filled button / interactive inset:** `0 1px 1px -1px rgba(0,0,0,0.08), 0 2px 2px -1px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.06), inset 0 1px 0 #fff, inset 0 1px 2px 1px #fff, inset 0 1px 2px 0 rgba(0,0,0,0.06)`
- **Subtle row / chip:** `0 1px 2px 0 rgba(0,0,0,0.05)`

## Imagery

Imagery is split into three strict registers and nothing else. (1) Decorative paint-splash illustrations in Campfire Orange and Ember Brown clipped to the far left and right of the viewport on hero and mid-page sections — organic, asymmetric, never overlapping text, never carrying meaning. (2) Product screenshots wrapped in a white App Preview Frame with optional browser-chrome header and soft 5%-black shadow — these are the proof artifacts for each feature and always sit centered below their section heading. (3) Avatar circles only — 24–32px, 9999px radius, either a photo or a solid color block with initials, no decorative imagery attached. There is no lifestyle photography, no stock illustration, no 3D renders. Icons throughout the UI are simple, single-weight, monochrome in Slate or Midnight Ink; the brand mark is the only place color lives.

## Layout

Marketing pages follow a centered, max-width-1200px column with generous vertical rhythm. The hero is a single centered stack: notification pill → 58px headline → 17px subtitle → App Preview Frame screenshot, with Campfire Orange paint-splash motifs bleeding off the left and right edges of the viewport. Below the hero, sections alternate between two patterns: a centered section heading followed by an App Preview Frame, and a centered heading followed by a Testimonial Block. All sections use 64–80px vertical padding. The product app itself uses a three-column shell: a compact left sidebar (icons + labels, Fog Gray hover), a white main feed, and a right-side people/online panel on Fog Gray. Navigation is a minimal top bar with right-aligned text links — no dropdowns, no mega-menu, no sticky behavior on marketing pages.

## Agent Prompt Guide

QUICK COLOR REFERENCE
- text: #171717 (Midnight Ink)
- background (page): #fffdf9 (Parchment)
- background (card): #ffffff (Paper White)
- background (muted panel): #f5f5f5 (Fog Gray)
- border / divider: #f0f0f0 (Linen)
- accent: #ff6b1a (Campfire Orange) — use sparingly for logo, pills, brand moments
- primary action: no distinct CTA color

EXAMPLE COMPONENT PROMPTS
1. Hero headline block. Centered on Parchment (#fffdf9) page background. Eyebrow pill: Campfire Orange (#ff6b1a) fill, white 'NEW' text, 9999px radius, 8px 16px padding. Headline: 58px Inter weight 600 in Midnight Ink (#171717), letter-spacing -1.8px, line-height 1.00, two lines max. Subtitle: 18px Inter weight 400 in Slate (#737373), centered, max-width 640px.
2. Feature section with App Preview Frame. Centered 29px Inter weight 600 heading in Midnight Ink with -0.52px letter-spacing. Below: a 1200px max-width white card, 12px radius, 16px padding, wrapping a product screenshot. Soft 5%-black shadow stack applied: 0 3px 6px -3px rgba(0,0,0,0.05), 0 2px 4px -2px rgba(0,0,0,0.05), 0 1px 2px -1px rgba(0,0,0,0.05).
No distinct primary action color was observed; use the extracted neutral button treatments instead of inventing a filled CTA color.
4. Pill notification banner. Inline element, 9999px radius, 8px 16px padding, Campfire Orange (#ff6b1a) fill, 13px Inter weight 500 white text. Leading 'NEW' label as a smaller 2-tone orange dot or chip inside the pill. Optional trailing close icon at 12px.
5. Feed post row. White card surface, 12px radius, 16px padding, 1px Linen border. Left: 24px avatar (9999px, solid color or photo). Center column: author name 14px Inter weight 600 Midnight Ink, body text 14px Inter weight 400 Midnight Ink. Right: Sunlit Cream (#fef3c7) tag pill — 9999px radius, 4px 10px padding, 12px Inter weight 500 Ember Brown (#451a03) text — plus timestamp in Ash Gray (#a3a3a3).

## Similar Brands

- **Notion** — Same warm cream canvas with near-black Inter typography and rationed color use; both treat white cards as paper floating on a slightly warm page
- **Basecamp** — Team-communication product with a similar warm, editorial tone; flat surfaces, compact list rows, and pill-shaped controls over a muted background
- **Linear** — Inter-only typography system with tight letter-spacing on display sizes and a compact, list-driven UI rhythm
- **Coda** — Collaborative workspace that pairs warm off-white surfaces with single-accent brand moments and pill-shaped chips
- **Read.cv** — Editorial product voice with cream backgrounds, Inter typography, and orange as the singular brand color reserved for punctuation moments

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-campfire-orange: #ff6b1a;
  --color-ember-brown: #451a03;
  --color-sunlit-cream: #fef3c7;
  --color-forest-pulse: #22c55e;
  --color-ember-alert: #ef4444;
  --color-midnight-ink: #171717;
  --color-paper-white: #ffffff;
  --color-parchment: #fffdf9;
  --color-fog-gray: #f5f5f5;
  --color-linen: #f0f0f0;
  --color-ash-gray: #a3a3a3;
  --color-slate: #737373;
  --color-graphite: #525252;
  --color-stone: #8f7668;

  /* Typography — Font Families */
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-ui-monospace: 'ui-monospace', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-emoji: 'emoji', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.2;
  --tracking-caption: 0.3px;
  --text-body: 15px;
  --leading-body: 1.5;
  --text-subheading: 18px;
  --leading-subheading: 1.56;
  --text-heading-sm: 22px;
  --leading-heading-sm: 1.4;
  --tracking-heading-sm: -0.37px;
  --text-heading: 29px;
  --leading-heading: 1.2;
  --tracking-heading: -0.52px;
  --text-display: 58px;
  --leading-display: 1;
  --tracking-display: -1.8px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-72: 72px;
  --spacing-80: 80px;
  --spacing-96: 96px;
  --spacing-160: 160px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 64-80px;
  --card-padding: 16-24px;
  --element-gap: 8px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 18px;
  --radius-full: 9999px;

  /* Named Radii */
  --radius-tags: 9999px;
  --radius-cards: 8-12px;
  --radius-pills: 9999px;
  --radius-inputs: 8px;
  --radius-avatars: 9999px;
  --radius-buttons: 9999px;

  /* Shadows */
  --shadow-sm: rgba(0, 0, 0, 0.05) 0px 3px 6px -3px, rgba(0, 0, 0, 0.05) 0px 2px 4px -2px, rgba(0, 0, 0, 0.05) 0px 1px 2px -1px, rgba(0, 0, 0, 0.05) 0px 1px 1px -1px, rgba(0, 0, 0, 0.05) 0px 1px 0px -1px;
  --shadow-subtle: rgba(0, 0, 0, 0.08) 0px 1px 1px -1px, rgba(0, 0, 0, 0.08) 0px 2px 2px -1px, rgba(0, 0, 0, 0.06) 0px 0px 0px 1px, rgb(255, 255, 255) 0px 1px 0px 0px inset, rgb(255, 255, 255) 0px 1px 2px 1px inset, rgba(0, 0, 0, 0.06) 0px 1px 2px 0px inset;
  --shadow-subtle-2: rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;

  /* Surfaces */
  --surface-parchment-canvas: #fffdf9;
  --surface-paper-white: #ffffff;
  --surface-fog-gray: #f5f5f5;
  --surface-sunlit-cream: #fef3c7;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-campfire-orange: #ff6b1a;
  --color-ember-brown: #451a03;
  --color-sunlit-cream: #fef3c7;
  --color-forest-pulse: #22c55e;
  --color-ember-alert: #ef4444;
  --color-midnight-ink: #171717;
  --color-paper-white: #ffffff;
  --color-parchment: #fffdf9;
  --color-fog-gray: #f5f5f5;
  --color-linen: #f0f0f0;
  --color-ash-gray: #a3a3a3;
  --color-slate: #737373;
  --color-graphite: #525252;
  --color-stone: #8f7668;

  /* Typography */
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-ui-monospace: 'ui-monospace', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-emoji: 'emoji', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.2;
  --tracking-caption: 0.3px;
  --text-body: 15px;
  --leading-body: 1.5;
  --text-subheading: 18px;
  --leading-subheading: 1.56;
  --text-heading-sm: 22px;
  --leading-heading-sm: 1.4;
  --tracking-heading-sm: -0.37px;
  --text-heading: 29px;
  --leading-heading: 1.2;
  --tracking-heading: -0.52px;
  --text-display: 58px;
  --leading-display: 1;
  --tracking-display: -1.8px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-72: 72px;
  --spacing-80: 80px;
  --spacing-96: 96px;
  --spacing-160: 160px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 18px;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-sm: rgba(0, 0, 0, 0.05) 0px 3px 6px -3px, rgba(0, 0, 0, 0.05) 0px 2px 4px -2px, rgba(0, 0, 0, 0.05) 0px 1px 2px -1px, rgba(0, 0, 0, 0.05) 0px 1px 1px -1px, rgba(0, 0, 0, 0.05) 0px 1px 0px -1px;
  --shadow-subtle: rgba(0, 0, 0, 0.08) 0px 1px 1px -1px, rgba(0, 0, 0, 0.08) 0px 2px 2px -1px, rgba(0, 0, 0, 0.06) 0px 0px 0px 1px, rgb(255, 255, 255) 0px 1px 0px 0px inset, rgb(255, 255, 255) 0px 1px 2px 1px inset, rgba(0, 0, 0, 0.06) 0px 1px 2px 0px inset;
  --shadow-subtle-2: rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;
}
```
