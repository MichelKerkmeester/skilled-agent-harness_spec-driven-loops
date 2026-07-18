# Grafbase — Style Reference
> engineering blueprint on cool marble

**Theme:** light

Grafbase operates as a clinical, near-monochrome developer tool: a white canvas with charcoal text, a single gray surface tier, and zero chromatic noise in the interface itself. The system derives all its warmth and signaling from one place — the mint-to-teal gradient announcement bar — and from muted mint/teal tints inside product screenshots. Typography is a single family (Inter) stretched to extremes: a 90px display weight of 600 with -0.05em tracking, a 40px heading at 500, and a calm 16px body. Components feel like graph paper: 6px button radii, 20px card radii, hairline 1px borders, almost no shadows. The result reads as engineered, not decorated — an API console that happens to be a website.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Graphite Ink | `#1b1b1b` | `--color-graphite-ink` | Supporting neutral for secondary UI, dividers, and muted labels. Do not promote it to the primary CTA color |
| Marble | `#ffffff` | `--color-marble` | Card surfaces, elevated panels, nav background, button text on dark fills. The brightest layer in the system |
| Drafting Gray | `#eaeaea` | `--color-drafting-gray` | Page canvas and section backgrounds. The second surface tier beneath white cards — the tone of the drafting table itself |
| Steel | `#60646c` | `--color-steel` | Secondary body text, subtext, helper copy. Carries information density without competing with primary headings |
| Ash | `#7c7c7c` | `--color-ash` | Muted tertiary text and less-emphasized metadata. Used where information recedes |
| Hairline | `#e0e1e6` | `--color-hairline` | 1px borders, card outlines, divider rules. The system's structural lines — cool-tinted to read as architectural, not decorative |
| Mint Signal | `#00f2e6` | `--color-mint-signal` | Saturated cyan-mint used inside product UI mockups and integration icon tiles. Not an interface accent — it is product-content color bleeding into marketing surfaces |
| Moss | `#8dc63f` | `--color-moss` | Secondary chromatic accent appearing in product screenshot data and integration tiles. Sits next to Mint Signal in the same icon/system cluster |
| Sky | `#00b9f1` | `--color-sky` | Tertiary accent in product UI and integration iconography. Completes the cool triad (mint, moss, sky) that defines the brand's chromatic fingerprint within screenshots |
| Forest-to-Deep Gradient | `linear-gradient(89.97deg, rgb(25, 160, 95) 0.02%, rgb(13, 127, 140) 123.85%)` | `--color-forest-to-deep-gradient` | Announcement bar gradient spanning green (#19a05f) into deep teal (#0d7f8c). Sole place the interface shows color — the only banner-style element on the site |

## Tokens — Typography

### Inter — Sole typeface. Display uses weight 600 at 90px with -0.05em tracking (about -4.5px) — headline authority through geometric compression rather than heaviness. Headings at 40px use weight 500 with -0.025em tracking for a slightly looser, more editorial register. Body at 16px stays at weight 400 with normal tracking. The 13/14px sizes handle UI chrome and captions. No system fonts, no second family — Inter is the brand. · `--font-inter`
- **Substitute:** Inter (self-hosted or Google Fonts) — no substitute should change identity
- **Weights:** 400, 500, 600, 700
- **Sizes:** 13, 14, 16, 20, 24, 40, 90
- **Line height:** 1.00, 1.10, 1.43, 1.50, 2.00
- **Letter spacing:** -0.0500em, -0.0250em
- **Role:** Sole typeface. Display uses weight 600 at 90px with -0.05em tracking (about -4.5px) — headline authority through geometric compression rather than heaviness. Headings at 40px use weight 500 with -0.025em tracking for a slightly looser, more editorial register. Body at 16px stays at weight 400 with normal tracking. The 13/14px sizes handle UI chrome and captions. No system fonts, no second family — Inter is the brand.

### sans (custom utility) — Rare fallback utility class. Treat as Inter — likely a Tailwind 'sans' alias that resolved to a custom stack. Do not introduce as a distinct type family in output. · `--font-sans-custom-utility`
- **Weights:** 400, 500
- **Sizes:** 14, 16
- **Line height:** 1.43, 1.50
- **Role:** Rare fallback utility class. Treat as Inter — likely a Tailwind 'sans' alias that resolved to a custom stack. Do not introduce as a distinct type family in output.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 13px | 1.5 | — | `--text-caption` |
| body | 16px | 1.5 | — | `--text-body` |
| subheading | 20px | 1.5 | — | `--text-subheading` |
| heading-sm | 24px | 1.43 | — | `--text-heading-sm` |
| heading | 40px | 1.1 | -1px | `--text-heading` |
| display | 90px | 1 | -4.5px | `--text-display` |

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
| 72 | 72px | `--spacing-72` |
| 80 | 80px | `--spacing-80` |
| 100 | 100px | `--spacing-100` |
| 128 | 128px | `--spacing-128` |

### Border Radius

| Element | Value |
|---------|-------|
| nav | 6px |
| cards | 20px |
| panels | 12px |
| buttons | 6px |
| buttons-pill | 40px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| lg | `rgba(0, 0, 0, 0.15) 0px 4px 20px 0px` | `--shadow-lg` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 28px
- **Element gap:** 24px

## Components

### Announcement Bar
**Role:** Site-wide notification strip

Full-width banner at the very top. Background is the forest-to-deep-teal linear gradient (89.97deg). White text at 14px, centered. Contains a text link and a chevron. Padding roughly 10px vertical. This is the only chromatic surface on the site.

### Navigation Bar
**Role:** Primary site navigation

White (#ffffff) horizontal bar with 1px Hairline (#e0e1e6) bottom border. Height roughly 64px. Left: Grafbase logo (black wordmark with cube icon). Center: product/solutions/resources/extensions links at 14px Inter 500 in Graphite Ink. Right: GitHub star count, theme toggle icon, Sign in button, Get started button. Padding 0 24px.

### Primary Action Button
**Role:** Highest-emphasis CTA

Solid Graphite Ink (#1b1b1b) fill, white text at 14px Inter 500, 6px border-radius, 14px vertical / 20px horizontal padding. Carries the soft drop shadow rgba(0,0,0,0.15) 0px 4px 20px 0px. Examples: 'Try it for free', 'Get started'.

### Ghost Button
**Role:** Secondary CTA

White (#ffffff) fill, 1px Hairline (#e0e1e6) border, Graphite Ink text at 14px Inter 500, 6px border-radius, 14px/20px padding. No shadow. Examples: 'Contact Sales', 'See how our platform works' (with play icon).

### Pill Button (Auth)
**Role:** Tertiary / sign-in variant

White fill, Hairline border, 40px border-radius (fully pill-shaped), Graphite Ink text. Used for the 'Sign in' action — visually softer than the squared 6px buttons to signal 'less commit'.

### Hero Headline
**Role:** Primary page headline

Inter weight 600 at 90px, line-height 1.0, letter-spacing -4.5px (-0.05em), Graphite Ink color. Two-line stack: 'Unify your APIs. / Govern your AI.' Subtext below at 18-20px Inter 400 in Steel (#60646c).

### Product Preview Panel
**Role:** Hero-right visual / dashboard mockup

White card, 20px radius, Hairline border, soft shadow. Contains a left sidebar nav (Overview, Schema, Explorer, Proposals, Analytics, Traces, Changelog, Checks, Subgraphs, Deployments, Settings) with active item in lighter gray. Right pane shows API metrics with line charts in Mint Signal (#00f2e6). Mockup uses Sky (#00b9f1), Moss (#8dc63f) for data accents.

### Feature Card
**Role:** Section content container

White (#ffffff) fill, 20px border-radius, 1px Hairline border, 28px padding. Headline at 24px Inter 600, body at 16px Inter 400 in Steel. Used in the 'Customize and enable AI agents' section.

### Integration Icon Tile
**Role:** Logo / partner showcase

Small square tile with very pale mint/teal background tint (~#e6f8f5), rounded corners, containing a brand logo. Arranged in a loose grid pattern inside feature cards. Communicates 'integrations' through consistent tile shape, not color saturation.

### Comparison Card
**Role:** Alternative-to card in the "compare" carousel

White fill, 20px radius, Hairline border. Top half is a large circular icon area (~200px) with a very faint concentric ring pattern and a centered thin-line icon. Below: 24px bold heading, 16px subtext, and a Compare ghost button.

### Footer Link Group
**Role:** Site footer navigation

Grouped columns of links at 14px Inter 400 in Graphite Ink. Column headers at 14px Inter 600. No icons, no illustrations — type-driven hierarchy only.

### Carousel Navigation
**Role:** Section paginator

Pair of circular arrow buttons (40px) with 1px Hairline border on white fill, placed right-aligned beneath comparison card row. The only chrome in an otherwise text-driven section.

## Do's and Don'ts

### Do
- Use Graphite Ink (#1b1b1b) for all primary text and all primary action buttons — never introduce a chromatic brand color for CTAs.
- Set display headlines at 90px Inter 600 with letter-spacing -4.5px; headings at 40px Inter 500 with -1px tracking. The negative tracking is the signature — do not normalize it.
- Apply 6px radius to all rectangular buttons, 40px to any pill-shaped button, and 20px to all cards and large content panels.
- Keep the interface fully monochromatic on white #ffffff and #eaeaea surfaces. Reserve the forest-to-teal gradient exclusively for the announcement bar.
- Use Steel (#60646c) for subtext and helper copy, Ash (#7c7c7c) for tertiary metadata — do not invent new grays.
- Build product mockups and integration tiles in the cool triad (Mint Signal, Moss, Sky) so the chromatic identity lives inside the product, not on the marketing chrome.
- Use the single shadow rgba(0,0,0,0.15) 0px 4px 20px 0px on primary buttons and elevated preview panels only — do not stack multiple shadow levels.

### Don't
- Do not add saturated accent colors to the interface — the system is intentionally 99% achromatic.
- Do not use pure black (#000000); use Graphite Ink (#1b1b1b) which is softer against the cool gray canvas.
- Do not introduce a second typeface — Inter is the system, used at every size from 13px caption to 90px display.
- Do not set letter-spacing to 0 on display and heading text — the -4.5px / -1px tracking is what makes the large type feel engineered rather than webby.
- Do not add drop shadows to ghost buttons, cards, or nav — the shadow belongs only on the primary action button and the hero preview panel.
- Do not create button variants with new colors for hover/active states — swap to a slight opacity reduction or a subtle bg-gray-100 treatment instead.
- Do not place the green-to-teal gradient anywhere other than the top announcement bar — it is a one-shot signal, not a reusable surface.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Canvas | `#eaeaea` | Page background — the drafting table. |
| 2 | Card | `#ffffff` | All content surfaces: feature cards, nav bar, CTA containers, product mockups. |
| 3 | Elevated | `#ffffff` | Modals, popovers, and the dashboard preview — same white as Card, distinguished by shadow and z-index, not by a new color. |

## Elevation

- **Primary action button:** `rgba(0, 0, 0, 0.15) 0px 4px 20px 0px`
- **Dashboard preview panel:** `rgba(0, 0, 0, 0.15) 0px 4px 20px 0px`

## Imagery

Imagery is almost entirely product screenshots — high-fidelity dashboard mockups, sidebar nav trees, and line-chart analytics panels rendered in a cool palette of mint/teal/sky. The right half of the hero is a full dashboard preview with sidebar and graphs. Secondary visuals are integration icon tiles (small squares with brand logos on pale mint tints) and thin-line abstract icons inside comparison cards (lightning bolt, trending arrow, downward graph) drawn in Steel at 1.5px stroke weight. No photography, no human imagery, no illustration beyond the icon system. The product UI IS the imagery — it functions as social proof and visual proof at once.

## Layout

Max-width 1200px centered container with 24px gutter padding. Hero is a 50/50 split: left column carries the 90px headline, supporting copy, primary+ghost CTA pair, and a play-link; right column is a 20px-radius dashboard preview card. Subsequent sections are full-width bands alternating between #eaeaea canvas and #ffffff card surfaces, separated by 80px vertical gaps. Feature sections use a 2-column grid for text+visual pairs and a 3-column card row for comparison/feature blocks. The carousel pattern is a horizontal scroll with circular arrow controls right-aligned. Navigation is a single sticky top bar with no secondary nav, no sidebar. The overall rhythm is wide, breathable, and symmetrical — no asymmetric or overlapping compositions.

## Agent Prompt Guide

## Quick Color Reference
- background (page): #eaeaea
- surface (card/panel): #ffffff
- text (primary): #1b1b1b
- text (secondary): #60646c
- border (hairline): #e0e1e6
- primary action: no distinct CTA color

## Example Component Prompts

No distinct primary action color was observed; use the extracted neutral button treatments instead of inventing a filled CTA color.

2. **Feature Card**: White (#ffffff) fill, 20px radius, 1px #e0e1e6 border, 28px padding. Heading at 24px Inter 600 #1b1b1b, body at 16px Inter 400 #60646c. Below the text, a 3×2 grid of integration tiles: 56px squares, ~#e6f8f5 background, 8px radius, each containing a centered brand logo at 28px.

3. **Comparison Card**: White card, 20px radius, 1px #e0e1e6 border, no shadow. Top zone is a 200px square containing a faint concentric ring pattern in #e0e1e6 with a centered thin-line icon (1.5px stroke) in #60646c. Below: 24px Inter 600 heading in #1b1b1b, 16px Inter 400 subtext in #60646c, then a ghost button (white fill, 1px #e0e1e6 border, #1b1b1b text, 6px radius, 14px 20px padding).

4. **Navigation Bar**: White (#ffffff) bar, 1px #e0e1e6 bottom border, 64px height, padding 0 24px. Logo left (black wordmark + cube icon, 20px tall). Center: nav links at 14px Inter 500 #1b1b1b, 24px gap. Right cluster: GitHub star pill (white fill, 1px #e0e1e6 border, 6px radius), sun icon toggle, 'Sign in' pill button (white, 1px border, 40px radius, 14px Inter 500), 'Get started' solid button (#1b1b1b, white text, 6px radius, 14px 20px padding, shadow).

5. **Announcement Bar**: Full-width strip, ~40px height, background linear-gradient(89.97deg, rgb(25,160,95) 0.02%, rgb(13,127,140) 123.85%). Centered white text at 14px Inter 500 with a white underlined 'Read the announcement →' link. Padding 10px vertical.

## Similar Brands

- **Linear** — Same near-monochrome UI with one dark action button, Inter at extremes, hairline borders, and product-screenshot-as-hero treatment.
- **Vercel** — Identical engineering-blueprint feel: white canvas, Inter family, tight tracking on oversized headlines, minimal shadows, and product UI used as the marketing visual.
- **Supabase** — Developer-tool aesthetic with white surfaces, dark text, Inter typography, 6px button radii, and dashboard mockups carrying the brand's only chromatic accents.
- **Neon (Neon.tech)** — Comfortable-density devtools layout with 1200px max-width, gradient announcement bar at the top, Inter type, and the same clinical gray-and-black palette.
- **PlanetScale** — Dark text on white with hairline borders, oversized 80-90px display headlines, single dark CTA, and product-screenshot hero composition.

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-graphite-ink: #1b1b1b;
  --color-marble: #ffffff;
  --color-drafting-gray: #eaeaea;
  --color-steel: #60646c;
  --color-ash: #7c7c7c;
  --color-hairline: #e0e1e6;
  --color-mint-signal: #00f2e6;
  --color-moss: #8dc63f;
  --color-sky: #00b9f1;
  --color-forest-to-deep-gradient: #19a05f;
  --gradient-forest-to-deep-gradient: linear-gradient(89.97deg, rgb(25, 160, 95) 0.02%, rgb(13, 127, 140) 123.85%);

  /* Typography — Font Families */
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-sans-custom-utility: 'sans (custom utility)', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 13px;
  --leading-caption: 1.5;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-subheading: 20px;
  --leading-subheading: 1.5;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.43;
  --text-heading: 40px;
  --leading-heading: 1.1;
  --tracking-heading: -1px;
  --text-display: 90px;
  --leading-display: 1;
  --tracking-display: -4.5px;

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
  --spacing-44: 44px;
  --spacing-48: 48px;
  --spacing-72: 72px;
  --spacing-80: 80px;
  --spacing-100: 100px;
  --spacing-128: 128px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 28px;
  --element-gap: 24px;

  /* Border Radius */
  --radius-md: 6px;
  --radius-xl: 12px;
  --radius-2xl: 20px;
  --radius-3xl: 40px;

  /* Named Radii */
  --radius-nav: 6px;
  --radius-cards: 20px;
  --radius-panels: 12px;
  --radius-buttons: 6px;
  --radius-buttons-pill: 40px;

  /* Shadows */
  --shadow-lg: rgba(0, 0, 0, 0.15) 0px 4px 20px 0px;

  /* Surfaces */
  --surface-canvas: #eaeaea;
  --surface-card: #ffffff;
  --surface-elevated: #ffffff;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-graphite-ink: #1b1b1b;
  --color-marble: #ffffff;
  --color-drafting-gray: #eaeaea;
  --color-steel: #60646c;
  --color-ash: #7c7c7c;
  --color-hairline: #e0e1e6;
  --color-mint-signal: #00f2e6;
  --color-moss: #8dc63f;
  --color-sky: #00b9f1;
  --color-forest-to-deep-gradient: #19a05f;

  /* Typography */
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-sans-custom-utility: 'sans (custom utility)', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 13px;
  --leading-caption: 1.5;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-subheading: 20px;
  --leading-subheading: 1.5;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.43;
  --text-heading: 40px;
  --leading-heading: 1.1;
  --tracking-heading: -1px;
  --text-display: 90px;
  --leading-display: 1;
  --tracking-display: -4.5px;

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
  --spacing-72: 72px;
  --spacing-80: 80px;
  --spacing-100: 100px;
  --spacing-128: 128px;

  /* Border Radius */
  --radius-md: 6px;
  --radius-xl: 12px;
  --radius-2xl: 20px;
  --radius-3xl: 40px;

  /* Shadows */
  --shadow-lg: rgba(0, 0, 0, 0.15) 0px 4px 20px 0px;
}
```
