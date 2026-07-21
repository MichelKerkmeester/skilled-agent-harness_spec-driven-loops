# WalletConnect — Style Reference
> Cobalt obelisks on parchment — saturated blue monoliths floating above a warm white desert, with rounded edges that soften the tech seriousness.

**Theme:** light

WalletConnect Pay is an electric-blue crypto payments brand wrapped in a clean, light canvas: warm off-white surfaces, indigo-black typography, and oversized rounded cards that feel more like consumer fintech than infrastructure tooling. The signature move is a vivid cobalt hero panel (40px radius) sitting on a near-white page, anchoring a layout that alternates between full-bleed product photography and generous whitespace. Typography is set in KHTeka, a geometric humanist that carries a technical-but-friendly voice across weights 400-700, with deep navy #1b2045 replacing pure black for a slightly warmer read. Components are confidently minimal — pill-shaped buttons, ghost CTAs, hairline borders, and almost no shadow, letting the saturated blue do all the emotional work.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Electric Cobalt | `#006cff` | `--color-electric-cobalt` | Hero panels, filled buttons, active nav indicators, link accents — the primary brand signal, used as a full-bleed surface rather than a small button color to dominate the page |
| Indigo Action | `#4672ff` | `--color-indigo-action` | Primary filled action buttons and their borders — a slightly lighter, more violet-shifted blue for interactive surfaces that need to feel pressed and clickable |
| Deep Indigo | `#1b2045` | `--color-deep-indigo` | Primary text, headings, and dark button borders — replaces pure black with a warm navy that reads as authoritative without the harshness of #000 |
| Sky Tint | `#66a7ff` | `--color-sky-tint` | Hover states, subtle outlined button borders, secondary navigation accents — a desaturated companion to Electric Cobalt for non-dominant blue moments |
| Glacial Wash | `#cce2ff` | `--color-glacial-wash` | Pale blue tinted backgrounds, soft highlight washes, tag fills, and light section dividers — bridges the white canvas to the blue brand without harsh contrast |
| Parchment | `#f9f9f9` | `--color-parchment` | Page background canvas — a warm near-white that softens the starkness of pure white and reduces eye strain across long scrolling pages |
| Pure White | `#ffffff` | `--color-pure-white` | Card surfaces, input fields, button text, elevated panels — the brightest surface layer sitting atop Parchment |
| Mist | `#e9e9e9` | `--color-mist` | Hairline borders, input outlines, subtle dividers between sections — the quietest structural line color |
| Silver | `#bbbbbb` | `--color-silver` | Secondary surface fills, placeholder backgrounds, disabled states |
| Pewter | `#b3b3b3` | `--color-pewter` | Shadow base color and muted icon tints |
| Fog | `#9a9a9a` | `--color-fog` | Muted body text, secondary metadata, inactive form labels |
| Steel | `#787878` | `--color-steel` | Input placeholder text, tertiary captions, subtle icon strokes |
| Slate | `#6c6c6c` | `--color-slate` | Link text in their resting state, secondary body copy |
| Graphite | `#4f4f4f` | `--color-graphite` | Mid-tier body text, descriptions, helper copy that needs to recede behind headings |
| Charcoal | `#303030` | `--color-charcoal` | Dark section borders, footer dividers |
| Obsidian | `#202020` | `--color-obsidian` | Dark footer background, dark section panels, card borders on light surfaces — the system's dark surface color, used as a deliberate band rather than scattered |
| Cobalt Radial | `radial-gradient(78.13% 78.13% at 79.97% 80.72%, rgb(9, 159, 240) 0%, rgb(9, 121, 240) 100%)` | `--color-cobalt-radial` | Radial gradient highlight accent — used sparingly as a luminous spot inside blue panels to create depth |

## Tokens — Typography

### KHTeka — Primary interface and headline typeface — a geometric humanist sans with slightly compressed proportions and a tech-friendly neutrality. Used across all contexts (heading, body, button, nav, card, badge, icon, input) at every measured size. The 36px display weight 700 is the signature headline voice; 16px weight 400 is the comfortable reading body. · `--font-khteka`
- **Substitute:** Inter or DM Sans
- **Weights:** 400, 500, 700
- **Sizes:** 13, 14, 16, 18, 20, 24, 30, 36
- **Line height:** 1.00–1.71 (responsive by size: tight 1.00 at display, generous 1.71 at body)
- **Letter spacing:** normal across all sizes — no tracking adjustment detected
- **Role:** Primary interface and headline typeface — a geometric humanist sans with slightly compressed proportions and a tech-friendly neutrality. Used across all contexts (heading, body, button, nav, card, badge, icon, input) at every measured size. The 36px display weight 700 is the signature headline voice; 16px weight 400 is the comfortable reading body.

### Roboto — Secondary system font — appears in modals, cookie banners, and any overlay/dialog content. Its presence suggests system-stack fallbacks for third-party injected UI rather than a deliberate secondary brand choice. · `--font-roboto`
- **Substitute:** System UI sans-serif
- **Weights:** 400, 500, 700
- **Sizes:** 12, 16, 17
- **Line height:** 1.41–2.00
- **Role:** Secondary system font — appears in modals, cookie banners, and any overlay/dialog content. Its presence suggests system-stack fallbacks for third-party injected UI rather than a deliberate secondary brand choice.

### KHTeka Mono — Monospaced companion for code snippets, wallet addresses, transaction hashes, and any alphanumeric string that must align character-by-character in card contexts · `--font-khteka-mono`
- **Substitute:** JetBrains Mono or IBM Plex Mono
- **Weights:** 400
- **Sizes:** 12, 14
- **Line height:** 1.33–1.43
- **Role:** Monospaced companion for code snippets, wallet addresses, transaction hashes, and any alphanumeric string that must align character-by-character in card contexts

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.43 | — | `--text-caption` |
| subheading | 18px | 1.4 | — | `--text-subheading` |
| heading-sm | 20px | 1.33 | — | `--text-heading-sm` |
| heading | 24px | 1.2 | — | `--text-heading` |
| heading-lg | 30px | 1.11 | — | `--text-heading-lg` |
| display | 36px | 1 | — | `--text-display` |

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
| 24 | 24px | `--spacing-24` |
| 32 | 32px | `--spacing-32` |
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |
| 64 | 64px | `--spacing-64` |
| 72 | 72px | `--spacing-72` |

### Border Radius

| Element | Value |
|---------|-------|
| nav | 16px |
| tags | 3px |
| cards | 40px |
| images | 40px |
| inputs | 16px |
| buttons | 16px |
| heroPanels | 40px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| sm | `rgba(0, 0, 0, 0.3) 0px 0px 8px 0px` | `--shadow-sm` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 64px
- **Card padding:** 24px
- **Element gap:** 8px

## Components

### Filled Primary Button
**Role:** Main call-to-action

Background #006cff, text #ffffff in KHTeka 16px weight 500, 16px border-radius, 11px vertical padding with 16-20px horizontal padding. No border or border matching background. Hover transitions to slightly lighter cobalt.

### Ghost Text Button
**Role:** Secondary action that recedes

Transparent background, no border, text in Deep Indigo #1b2045 at KHTeka 16px weight 500. Used for 'Docs' and low-priority links sitting beside a filled CTA. Underline appears on hover.

### Outlined Dark Button
**Role:** Secondary action on light backgrounds

Transparent background, 1px border in #202020 or Deep Indigo #1b2045, text matching border color, 16px radius, 11px vertical padding. Used for 'Contact Sales' CTAs — the outline communicates secondary weight without disappearing.

### Pill Navigation Button
**Role:** Top nav action items (Request Demo, Docs)

Filled blue (#006cff) for primary nav actions, white background with dark text for secondary. 16px radius, 8-12px vertical padding, 16-20px horizontal padding. Compact, rounded, sitting inline in the top bar.

### Hero Brand Panel
**Role:** Large section background that carries the brand color

Full Electric Cobalt #006cff background, 40px border-radius on all corners, generous 48-64px internal padding. Contains white KHTeka display headline (30-36px weight 700), white body subtext, and a product mockup overlapping the right edge. This is the signature visual unit of the site.

### Product Showcase Card
**Role:** Large rounded container for phone/app mockups

40px border-radius, white or light background, 16-24px internal padding, often no visible border — the radius alone defines the card edge. May contain a full-bleed product screenshot that follows the same 40px radius.

### Content Card
**Role:** Standard card for feature blocks, text groupings

16-40px border-radius (40px for large feature cards, 16px for tighter info cards), white #ffffff background, 1px Mist #e9e9e9 border, 24px padding. 1px border preferred over shadow for definition.

### Top Banner Bar
**Role:** Slim promotional strip above the nav

Electric Cobalt #006cff full-width band, white text at 14-16px KHTeka, optional close button on the right. ~40-48px height. Sticky or static depending on page.

### Dark Footer
**Role:** Page-closing dark band with newsletter and social links

Obsidian #202020 background, white and light-gray (#bbbbbb, #787878) text, newsletter input with 16px radius, social link list right-aligned. 40-48px top padding, 64px bottom padding.

### Newsletter Input + Subscribe
**Role:** Email capture in dark footer

Dark input field with 16px radius, white text on transparent or near-black fill, white 'Subscribe' button beside it (filled white on dark). 12px vertical padding, border 1px in Charcoal #303030.

### Cookie Preference Modal
**Role:** GDPR consent dialog overlay

White #ffffff surface, 16-20px radius, generous internal padding (24-32px), checkbox rows with Deep Indigo labels, Indigo Action #4672ff filled buttons ('Decline All' outlined, 'Allow All' filled) at the bottom right.

### Navigation Header
**Role:** Top-level site navigation

Transparent or white background, left-aligned WalletConnect Pay logo (blue wordmark with wave icon), center or right nav links (Solutions, About, Blog) in KHTeka 16px weight 400, action buttons (Request Demo filled, Docs ghost) at far right. 64-80px height.

### Icon Set
**Role:** Inline and standalone icons

Outlined or thin-stroke style icons in KHTeka or matching geometric set, 1.5-2px stroke weight, sized 16-24px. Default color Deep Indigo or white on blue panels. The wave/connection mark in the logo is the brand's own glyph.

### Tag/Badge
**Role:** Small inline labels for categories, status, or metadata

3px border-radius, 8-12px vertical padding, 12-16px horizontal padding, Glacial Wash #cce2ff or Mist #e9e9e9 background, Deep Indigo #1b2045 text at 12-13px KHTeka weight 500.

## Do's and Don'ts

### Do
- Use 40px border-radius on all large cards, hero panels, and image containers — this is the system's signature softness
- Use 16px border-radius on buttons, inputs, and nav elements to create a clear hierarchy: small rounding for interactive, large rounding for content
- Set primary text in Deep Indigo #1b2045, not pure black — the warm navy keeps the design from feeling harsh
- Reserve Electric Cobalt #006cff for large surfaces (hero panels, banner bars) and filled primary buttons — let it dominate a band rather than scatter as small accents
- Use KHTeka at weight 400 for body, 500 for UI controls and links, 700 for display headlines — three-weight hierarchy is enough
- Prefer 1px Mist #e9e9e9 borders over shadows for card definition; the system is border-driven, not shadow-driven
- Center pages at max-width 1200px and use 64px section gaps to maintain the comfortable, spacious rhythm

### Don't
- Don't use pure black #000000 for text — Deep Indigo #1b2045 is the system's dark, and mixing in true black breaks the warm tonal palette
- Don't use 8px or 12px border-radius on large cards — the system jumps from 16px (controls) to 40px (content), with nothing in between
- Don't apply shadow stacks for elevation — the design uses surface color and borders instead; one soft 8px blur at 30% black is the maximum
- Don't use Electric Cobalt #006cff on small text, icons, or link underlines — the brand color needs surface area to carry meaning, not pixel-level presence
- Don't mix Roboto into primary UI — reserve it for injected overlay content (modals, cookie banners, third-party widgets) where it appears as a system fallback
- Don't use the Cobalt Radial gradient on flat UI elements — it's a luminous accent for blue panels only, not a fill for buttons or cards
- Don't let the design feel dense — comfortable density means generous vertical rhythm (64px section gaps) and white space around every content block

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas | `#f9f9f9` | Page background, the warm off-white that defines the overall lightness |
| 1 | Card | `#ffffff` | Product cards, input fields, elevated content blocks sitting on the canvas |
| 2 | Recessed | `#e9e9e9` | Inset surfaces, subtle grouping backgrounds, disabled state fills |
| 3 | Brand Panel | `#006cff` | Full-bleed hero bands, feature panels, and any surface where the brand color becomes the background |
| 4 | Dark Band | `#202020` | Footer and inverted dark sections, used as a terminating band at page bottom |

## Elevation

- **Card:** `rgba(0, 0, 0, 0.3) 0px 0px 8px 0px`

## Imagery

Photography is product-led and tightly cropped: hands holding phones showing the WalletConnect Pay app, QR code screens, and in-context mobile payment moments. Images are treated with full 40px border-radius matching the card containers, creating a soft, consumer-friendly presentation. The blue app UI is the hero within the photography — screens showing payment amounts in white on cobalt reinforce the brand color outside of designed panels. There are no lifestyle backgrounds, no decorative gradients behind images, and no stock photography; every image shows the product in use. Icons are thin-stroke, geometric, and monochromatic, typically white on blue or Deep Indigo on light.

## Layout

Max-width 1200px centered on a Parchment #f9f9f9 canvas, with full-bleed blue and dark sections breaking the container at section boundaries. The hero pattern is a 2-column asymmetric split: oversized blue rounded panel (40px radius) on the left containing the headline, with a phone mockup overlapping the right edge — the product image bleeds beyond the panel boundary. Section rhythm alternates between blue hero panels, white product showcase bands with side-by-side phone photography, and terminating dark footer. Content arrangement uses 2-column text+image splits that flip orientation (text-left/image-right, then image-left/text-right). Grids appear as 3-column feature cards. Navigation is a clean top bar with logo left, links center-right, and action buttons at far right, with an optional blue banner strip above it. Density is comfortable and spacious — 64px between sections, generous padding inside every card.

## Agent Prompt Guide

**Quick Color Reference**
- text: #1b2045 (Deep Indigo for headings, #202020 Obsidian for body, #787878 Steel for muted)
- background: #f9f9f9 (canvas), #ffffff (cards)
- border: #e9e9e9 (Mist, hairlines), #202020 (dark borders)
- accent: #006cff (Electric Cobalt, brand surface)
- primary action: #4672ff (filled action)

**Example Component Prompts**
1. Build a hero section: Electric Cobalt #006cff background, 40px border-radius, 48px internal padding. Headline 'Scaling crypto payments' in KHTeka 36px weight 700 white. Subtext in KHTeka 18px weight 400 at 60% white. Filled CTA button #4672ff background, white text, 16px radius, 12px 20px padding. Phone mockup overlapping the right edge at 40px border-radius.
2. Build a content card: white #ffffff background, 1px border #e9e9e9, 40px border-radius, 24px padding. Heading in KHTeka 24px weight 700 in Deep Indigo #1b2045. Body text in KHTeka 16px weight 400 in Obsidian #202020 with 8px gap between lines.
3. Build a tag badge: Glacial Wash #cce2ff background, Deep Indigo #1b2045 text in KHTeka 12px weight 500, 3px border-radius, 8px 12px padding.
4. Build the top navigation: white background, WalletConnect Pay blue wordmark logo left, nav links in KHTeka 16px weight 400 in Deep Indigo center-right, 'Request Demo' filled button #006cff with white text and 16px radius at far right.
5. Build the dark footer: Obsidian #202020 background, 48px top padding, 'Stay updated' heading in KHTeka 24px weight 700 white, email input with 1px #303030 border and 16px radius, white 'Subscribe' button, social link list in Steel #787878 right-aligned.

## Radius System Philosophy

The radius scale has exactly three values: 3px for small tags and tight UI chips, 16px for interactive controls (buttons, inputs, nav items, links-as-buttons), and 40px for content surfaces (cards, images, hero panels, large containers). This three-tier jump — not a smooth gradient — is deliberate: the 40px radius on content creates a 'consumer fintech' softness that contrasts with the sharper 16px on controls, signaling that buttons are precise instruments while content is approachable. Never interpolate between these values; the gap between 16 and 40 is the design.

## Similar Brands

- **Stripe** — Same warm off-white canvas, rounded 40px hero panels, and saturated brand color deployed as a full surface rather than a small accent
- **Coinbase** — Shared crypto-payments visual language with cobalt blue hero sections, rounded product photography, and light backgrounds dominating over dark
- **MoonPay** — Similar fintech-crypto crossover aesthetic: large rounded blue panels, product-led phone mockups, minimal shadows, and a single dominant brand color
- **Rainbow Wallet** — Comparable mobile-first crypto product presentation with oversized card radii and a clean light surface treatment
- **Phantom** — Same brand-confidence approach — one vivid color owns the page, everything else is quiet white and warm gray

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-electric-cobalt: #006cff;
  --color-indigo-action: #4672ff;
  --color-deep-indigo: #1b2045;
  --color-sky-tint: #66a7ff;
  --color-glacial-wash: #cce2ff;
  --color-parchment: #f9f9f9;
  --color-pure-white: #ffffff;
  --color-mist: #e9e9e9;
  --color-silver: #bbbbbb;
  --color-pewter: #b3b3b3;
  --color-fog: #9a9a9a;
  --color-steel: #787878;
  --color-slate: #6c6c6c;
  --color-graphite: #4f4f4f;
  --color-charcoal: #303030;
  --color-obsidian: #202020;
  --color-cobalt-radial: #099ff0;
  --gradient-cobalt-radial: radial-gradient(78.13% 78.13% at 79.97% 80.72%, rgb(9, 159, 240) 0%, rgb(9, 121, 240) 100%);

  /* Typography — Font Families */
  --font-khteka: 'KHTeka', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-roboto: 'Roboto', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-khteka-mono: 'KHTeka Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.43;
  --text-subheading: 18px;
  --leading-subheading: 1.4;
  --text-heading-sm: 20px;
  --leading-heading-sm: 1.33;
  --text-heading: 24px;
  --leading-heading: 1.2;
  --text-heading-lg: 30px;
  --leading-heading-lg: 1.11;
  --text-display: 36px;
  --leading-display: 1;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-72: 72px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 64px;
  --card-padding: 24px;
  --element-gap: 8px;

  /* Border Radius */
  --radius-sm: 3px;
  --radius-2xl: 16px;
  --radius-3xl: 40px;

  /* Named Radii */
  --radius-nav: 16px;
  --radius-tags: 3px;
  --radius-cards: 40px;
  --radius-images: 40px;
  --radius-inputs: 16px;
  --radius-buttons: 16px;
  --radius-heropanels: 40px;

  /* Shadows */
  --shadow-sm: rgba(0, 0, 0, 0.3) 0px 0px 8px 0px;

  /* Surfaces */
  --surface-canvas: #f9f9f9;
  --surface-card: #ffffff;
  --surface-recessed: #e9e9e9;
  --surface-brand-panel: #006cff;
  --surface-dark-band: #202020;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-electric-cobalt: #006cff;
  --color-indigo-action: #4672ff;
  --color-deep-indigo: #1b2045;
  --color-sky-tint: #66a7ff;
  --color-glacial-wash: #cce2ff;
  --color-parchment: #f9f9f9;
  --color-pure-white: #ffffff;
  --color-mist: #e9e9e9;
  --color-silver: #bbbbbb;
  --color-pewter: #b3b3b3;
  --color-fog: #9a9a9a;
  --color-steel: #787878;
  --color-slate: #6c6c6c;
  --color-graphite: #4f4f4f;
  --color-charcoal: #303030;
  --color-obsidian: #202020;
  --color-cobalt-radial: #099ff0;

  /* Typography */
  --font-khteka: 'KHTeka', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-roboto: 'Roboto', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-khteka-mono: 'KHTeka Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.43;
  --text-subheading: 18px;
  --leading-subheading: 1.4;
  --text-heading-sm: 20px;
  --leading-heading-sm: 1.33;
  --text-heading: 24px;
  --leading-heading: 1.2;
  --text-heading-lg: 30px;
  --leading-heading-lg: 1.11;
  --text-display: 36px;
  --leading-display: 1;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-72: 72px;

  /* Border Radius */
  --radius-sm: 3px;
  --radius-2xl: 16px;
  --radius-3xl: 40px;

  /* Shadows */
  --shadow-sm: rgba(0, 0, 0, 0.3) 0px 0px 8px 0px;
}
```
