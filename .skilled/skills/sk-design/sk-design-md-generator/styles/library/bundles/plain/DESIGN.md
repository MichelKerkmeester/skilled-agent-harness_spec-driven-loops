# Plain — Style Reference
> Botanical greenhouse on warm parchment — a single living green accent breathing inside a calm cream workspace.

**Theme:** light

Plain uses a botanical productivity-canvas language: warm parchment-cream surfaces, a single vivid green accent, and ABC Favorit set with tight negative tracking to create a calm but alive workspace feel. The interface stays quiet and mostly monochromatic — deep forest-black ink on warm off-white — letting the green act as small functional punctuation for primary actions, active states, and notification dots. Components feel like editorial product UI: 6px-rounded buttons, 9px-rounded cards, generous 24-40px breathing room, and product screenshots treated as the hero rather than decorative imagery. Type carries the energy — display headlines at 80px whisper with -0.02em tracking, emoji-embedded headings break the grid playfully, and Geist Mono tags provide quiet metadata rhythm alongside the warm Favorit voice.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Forest Ink | `#0a2414` | `--color-forest-ink` | Primary text, heading strokes, and structural borders. A near-black with green undertone that grounds the warm cream surfaces in nature rather than corporate gray |
| Parchment Cream | `#f3fbe9` | `--color-parchment-cream` | Primary surface for buttons, soft callouts, and section tints. A warm cream with green undertone — the canvas color, not pure white |
| Card Linen | `#f9f6f1` | `--color-card-linen` | Card and elevated surface background. Slightly warmer and more beige than Parchment Cream, creating a paper-grain feel for nested elements |
| Sage Charcoal | `#283a2e` | `--color-sage-charcoal` | Dark elevated surface for hero feature blocks and inverse sections. A muted green-black that ties the dark theme back to the brand green |
| Muted Moss | `#607166` | `--color-muted-moss` | Secondary helper text, subdued labels, and low-emphasis icons. The bridge between Forest Ink and Sage Charcoal for non-primary copy |
| Vivid Green | `#1ad379` | `--color-vivid-green` | Primary action background, active nav state, live notification dots, and the hero brand accent. Vivid botanical green that reads as alive against the cream — this is the only color allowed to shout |
| Deep Botanical | `#17b267` | `--color-deep-botanical` | Green accent for outlined action borders, linked labels, and lightweight interactive emphasis. Do not promote it to the primary CTA color |
| Coral Blush | `#ffbac3` | `--color-coral-blush` | Red outline accent for tags, dividers, and focused UI edges |
| Wine Plum | `#360003` | `--color-wine-plum` | Red wash for highlight backgrounds, decorative bands, and soft emphasis behind content. |

## Tokens — Typography

### ABC Favorit — Primary typeface for all body, headings, links, and display text. The tight -0.02em tracking at display sizes and -0.01em at body is signature — it pulls letters into a dense, editorial rhythm. ABC Favorit is a custom neo-grotesque with humanist warmth; substitute with Inter at -0.02em letter-spacing if unavailable. Weight 400 for body and links, weight 500 for headings, subheadings, and emphasis. The 80px display size with 0.95 line-height creates a tight, almost poster-like headline presence. · `--font-abc-favorit`
- **Substitute:** Inter
- **Weights:** 400, 500
- **Sizes:** 13, 15, 18, 24, 48, 80
- **Line height:** 0.95, 1.00, 1.04, 1.17, 1.33, 1.46
- **Letter spacing:** -0.02em at display (80px, 48px), -0.01em at body and heading (24px, 18px, 15px, 13px)
- **Role:** Primary typeface for all body, headings, links, and display text. The tight -0.02em tracking at display sizes and -0.01em at body is signature — it pulls letters into a dense, editorial rhythm. ABC Favorit is a custom neo-grotesque with humanist warmth; substitute with Inter at -0.02em letter-spacing if unavailable. Weight 400 for body and links, weight 500 for headings, subheadings, and emphasis. The 80px display size with 0.95 line-height creates a tight, almost poster-like headline presence.

### Geist Mono — Metadata, labels, timestamps, and code-like micro-copy. Set at 13px with 0.015em positive tracking and stylistic alternates ss02/ss06 enabled — the slightly wider mono and feature settings give labels a quiet technical authority that contrasts Favorit's editorial warmth. Substitute with JetBrains Mono or IBM Plex Mono. · `--font-geist-mono`
- **Substitute:** JetBrains Mono
- **Weights:** 500
- **Sizes:** 13
- **Line height:** 1.46
- **Letter spacing:** 0.015em
- **OpenType features:** `"ss02" on, "ss06" on`
- **Role:** Metadata, labels, timestamps, and code-like micro-copy. Set at 13px with 0.015em positive tracking and stylistic alternates ss02/ss06 enabled — the slightly wider mono and feature settings give labels a quiet technical authority that contrasts Favorit's editorial warmth. Substitute with JetBrains Mono or IBM Plex Mono.

### System Sans-Serif — Small UI chrome — icon-adjacent labels and 12px utility text in dense product surfaces. A system fallback that lets the UI degrade gracefully where custom fonts aren't loaded. · `--font-system-sans-serif`
- **Substitute:** system-ui
- **Weights:** 400
- **Sizes:** 12
- **Line height:** 1.20
- **Letter spacing:** normal
- **Role:** Small UI chrome — icon-adjacent labels and 12px utility text in dense product surfaces. A system fallback that lets the UI degrade gracefully where custom fonts aren't loaded.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.2 | — | `--text-caption` |
| body | 15px | 1.33 | -0.15px | `--text-body` |
| subheading | 18px | 1.17 | -0.18px | `--text-subheading` |
| heading-sm | 24px | 1.04 | -0.24px | `--text-heading-sm` |
| heading | 48px | 1 | -0.96px | `--text-heading` |
| display | 80px | 0.95 | -1.6px | `--text-display` |

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
| 40 | 40px | `--spacing-40` |
| 64 | 64px | `--spacing-64` |
| 72 | 72px | `--spacing-72` |
| 80 | 80px | `--spacing-80` |
| 120 | 120px | `--spacing-120` |
| 160 | 160px | `--spacing-160` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 9px |
| links | 6px |
| images | 6px |
| buttons | 6px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 24px
- **Element gap:** 24px

## Components

### Sticky Navigation Bar
**Role:** Top-level site navigation with logo, nav links, and dual CTAs.

Full-width white background with a subtle bottom border in Forest Ink at 10% opacity. Logo left (Plain wordmark with green glyph), centered nav links in 15px Favorit 400 with 10px horizontal padding and 8px row-gap, right-aligned Sign In (outlined green 6px radius) and Book a Demo (filled Vivid Green 6px radius) buttons. Height ~64px. Sticky on scroll.

### Announcement Pill
**Role:** Top-of-hero news or feature announcement.

Rounded pill on Parchment Cream background, 1px Forest Ink border at low opacity, 6px radius. Geist Mono 13px text in Forest Ink with a small green emoji glyph and a right-arrow chevron. Horizontal padding 12px, vertical 7px. Centered above the hero headline.

### Primary CTA Button (Filled Green)
**Role:** Main call-to-action — Book a Demo, Get Started.

Filled Vivid Green (#1ad379) background, Forest Ink text in Favorit 500 at 15px, 6px border-radius. Horizontal padding 20px, vertical 11px. No drop shadow. Text-case: uppercase tracking optional, but default is regular case with 8px row-gap to any adjacent ghost button.

### Secondary CTA Button (Outlined Green)
**Role:** Secondary call-to-action — Get Started, Learn More.

Transparent background with 1px Deep Botanical (#17b267) border, Forest Ink text in Favorit 500 at 15px, 6px border-radius. Horizontal padding 20px, vertical 11px. Pairs beside the filled primary in the hero.

### Ghost Text Button
**Role:** Tertiary or low-emphasis action.

No background, no border. Forest Ink text in Favorit 500 at 15px, underlined on hover. Used for inline links and tertiary navigation.

### Product Screenshot Card
**Role:** Hero product visualization — the app UI as marketing asset.

Full-bleed product screenshot with 9px border-radius and a soft Sage Charcoal shadow at 10-15% opacity, offset 0/20px, blur 40px. The product UI itself contains its own internal card, sidebar, and thread components rendered in white and Parchment Cream.

### Logo Cloud Strip
**Role:** Social proof — trusted-by logos.

Two-row grid of partner logos (Granola, Cursor, Vercel, n8n, Ashby, Raycast, Mintlify, Laravel, Sourcegraph) in Forest Ink monochrome. Geist Mono 13px uppercase eyebrow label 'HUNDREDS OF FAST-MOVING TEAMS RELY ON PLAIN' above in Muted Moss, letter-spacing 0.015em. Section padding 40px vertical.

### Emoji-Punctuated Section Heading
**Role:** Playful section headline that breaks editorial seriousness.

Favorit 500 at 48px, Forest Ink, -0.96px letter-spacing, line-height 1.0. Inline emoji glyphs at full display size replace punctuation — the emoji become visual rhythm beats, not decoration. Centered, max-width ~700px.

### Customer Thread Card
**Role:** Product UI element shown in hero/feature screenshots.

White card with 9px radius, 1px Forest Ink border at 8% opacity, internal padding 20px. Contains a ticket header (Favorit 500, 15px), assignee avatar, and action label rows in Geist Mono 13px Muted Moss.

### Action Sidebar Panel
**Role:** Right-side product UI panel shown in feature screenshots.

Parchment Cream or white background, 9px radius, 20px padding. Contains grouped action items — Links, Actions, Similar threads — each with a Favorit 500 15px section header and Geist Mono 13px item labels. Subtle dividers between groups in Forest Ink at 6% opacity.

### Dark Feature Block
**Role:** Inverse section for feature deep-dives.

Sage Charcoal (#283a2e) full-bleed background with white and Parchment Cream text. Favorit 500 at 48px for the section title, Favorit 400 at 18px for body. Internal cards sit on slightly lighter dark surface with 9px radius.

### Live Chat Widget
**Role:** Persistent bottom-right support trigger.

56px Vivid Green circle with white chat-bubble icon, fixed bottom-right at 24px margin. No border, no shadow — the green fill against the cream page is enough prominence.

## Do's and Don'ts

### Do
- Use Vivid Green (#1ad379) only for primary action fills, active states, and live notification dots — never for large decorative areas or backgrounds.
- Set display headlines at 80px Favorit 500 with -1.6px letter-spacing and 0.95 line-height for the signature editorial poster feel.
- Use 6px border-radius for all buttons, links, and inline elements; 9px for all cards and product UI surfaces.
- Default to Parchment Cream (#f3fbe9) and Card Linen (#f9f6f1) for surfaces rather than pure white #ffffff — the warm tint is the brand.
- Pair a filled green primary button with an outlined green secondary button using 8px gap, both at 20px horizontal padding.
- Use Geist Mono 13px with 0.015em tracking and ss02/ss06 features enabled for all labels, timestamps, and metadata.
- Maintain 80px section gaps between major bands and 24px element gaps within sections — the breathing room is part of the calm.

### Don't
- Don't introduce additional accent colors — the palette is deliberately cream, forest-black, and one green. Coral and wine are one-off exceptions, not tokens.
- Don't use pure black (#000000) for body text or headings — Forest Ink (#0a2414) carries the brand's green undertone.
- Don't apply drop shadows to buttons or navigation — the design uses borders and surface color shifts for hierarchy, not elevation.
- Don't set body text below 15px Favorit 400 or above 1.33 line-height — the editorial density is a signature.
- Don't center-align long-form body paragraphs — only headlines and hero copy use center alignment.
- Don't use the green accent on dark Sage Charcoal backgrounds without testing contrast — it can vibrate; use white or Parchment Cream text on dark surfaces instead.
- Don't replace the warm cream surfaces with neutral grays — the cream tint distinguishes this system from every other SaaS page.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Page Canvas | `#ffffff` | Outermost page background — pure white lets the warm cream cards pop forward. |
| 1 | Parchment Cream | `#f3fbe9` | Primary warm surface for hero bands, button fills, and section tints. |
| 2 | Card Linen | `#f9f6f1` | Nested card background — slightly more beige to create paper-grain depth. |
| 3 | Sage Charcoal | `#283a2` | Dark elevated surface for inverse feature blocks and dark product UI containers. |

## Elevation

- **Product Screenshot Card:** `0 20px 40px -10px rgba(10, 36, 20, 0.12)`
- **Customer Thread Card:** `0 1px 0 0 rgba(10, 36, 20, 0.06)`
- **Action Sidebar Panel:** `0 1px 0 0 rgba(10, 36, 20, 0.06)`

## Imagery

Product UI screenshots are the primary visual asset — the app's own interface is the hero image across all sections. Screenshots are full-bleed with soft shadows and 9px rounding, showing real customer threads, action sidebars, and AI-suggested replies. There is no lifestyle photography, no abstract illustration, and no decorative gradients. The only non-product visual elements are the partner logo cloud (monochrome wordmarks in Forest Ink) and emoji glyphs embedded inline within section headlines. The visual density is text-and-product dominant — the product UI occupies the majority of visual real estate on every section.

## Layout

Centered max-width 1200px page model with full-bleed section bands. Hero is a centered stack: announcement pill, 80px display headline (two lines, second line shorter for rhythm), 18px body paragraph, dual CTA buttons, then a wide product screenshot card. Sections alternate between white canvas and Parchment Cream bands, each separated by 80px vertical gaps. A logo cloud strip acts as a social-proof divider below the hero. Mid-page sections use centered text blocks up to 700px wide with inline emoji-punctuated headlines. A dark Sage Charcoal feature block breaks the cream rhythm near the fold. Navigation is a single sticky top bar with logo left, centered nav, and dual CTAs right. No sidebar, no mega-menu, no footer-heavy layout — the page is vertical-scroll editorial.

## Agent Prompt Guide

## Quick Color Reference
- text: #0a2414 (Forest Ink)
- background: #ffffff (page canvas)
- surface: #f3fbe9 (Parchment Cream) → #f9f6f1 (Card Linen)
- border: #0a2414 at 8-12% opacity
- accent: #1ad379 (Vivid Green)
- primary action: #1ad379 (filled action)

## Example Component Prompts

1. Create a Primary Action Button: #1ad379 background, #000000 text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.

2. **Product screenshot card**: Full-width within 1200px max. 9px border-radius. Box-shadow: 0 20px 40px -10px rgba(10,36,20,0.12). Contains a white product UI mockup with internal thread card (9px radius, 1px #0a2414 at 8% border) and right sidebar panel on Parchment Cream (#f3fbe9) with 9px radius.

3. **Logo cloud strip**: White background, 40px vertical padding. Eyebrow label in Geist Mono 13px #607166, uppercase, 0.015em tracking: 'HUNDREDS OF FAST-MOVING TEAMS RELY ON PLAIN'. Below: two rows of 4-5 monochrome wordmarks in #0a2414, centered, 24px gap between logos.

4. **Emoji-punctuated heading**: ABC Favorit 500, 48px, #0a2414, letter-spacing -0.96px, line-height 1.0, centered, max-width 700px. Example: 'Customer [emoji] sprawl is slowing [emoji] you [emoji] down' with emoji rendered at the same 48px display size as text.

5. **Dark feature block**: Full-bleed #283a2e background, 80px vertical padding. Section title in ABC Favorit 500, 48px, #f3fbe9, -0.96px tracking. Body text in Favorit 400, 18px, #f3fbe9 at 80% opacity. Internal content cards on a slightly lighter dark surface with 9px radius.

## Border & Divider System

The design uses hairline borders in Forest Ink (#0a2414) at very low opacity (6-12%) as the primary structural separator — not shadows, not heavy dividers. Buttons use 1px solid borders at full color when outlined. Cards use 1px borders at 8% opacity. Section bands are separated by background color shifts (white → cream → dark) rather than visible lines. The only full-opacity borders are the outlined action buttons and the announcement pill. This border restraint is what keeps the interface feeling light and editorial rather than corporate.

## Similar Brands

- **Linear** — Same editorial product-UI-as-hero approach, generous breathing room, and custom neo-grotesque typeface with tight negative tracking on display sizes.
- **Notion** — Shared warm off-white surface palette and a single restrained accent color that lets the product UI be the visual hero.
- **Loom** — Similar use of large display headlines with tight tracking, centered hero composition, and a calm cream-toned canvas with one brand accent.
- **Vercel** — Comparable minimal navigation bar with dual CTA buttons, and the same pattern of showing real product UI screenshots as full-bleed hero imagery rather than abstract illustration.

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-forest-ink: #0a2414;
  --color-parchment-cream: #f3fbe9;
  --color-card-linen: #f9f6f1;
  --color-sage-charcoal: #283a2e;
  --color-muted-moss: #607166;
  --color-vivid-green: #1ad379;
  --color-deep-botanical: #17b267;
  --color-coral-blush: #ffbac3;
  --color-wine-plum: #360003;

  /* Typography — Font Families */
  --font-abc-favorit: 'ABC Favorit', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-geist-mono: 'Geist Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-system-sans-serif: 'System Sans-Serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.2;
  --text-body: 15px;
  --leading-body: 1.33;
  --tracking-body: -0.15px;
  --text-subheading: 18px;
  --leading-subheading: 1.17;
  --tracking-subheading: -0.18px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.04;
  --tracking-heading-sm: -0.24px;
  --text-heading: 48px;
  --leading-heading: 1;
  --tracking-heading: -0.96px;
  --text-display: 80px;
  --leading-display: 0.95;
  --tracking-display: -1.6px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-40: 40px;
  --spacing-64: 64px;
  --spacing-72: 72px;
  --spacing-80: 80px;
  --spacing-120: 120px;
  --spacing-160: 160px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 24px;
  --element-gap: 24px;

  /* Border Radius */
  --radius-md: 6px;
  --radius-lg: 9px;

  /* Named Radii */
  --radius-cards: 9px;
  --radius-links: 6px;
  --radius-images: 6px;
  --radius-buttons: 6px;

  /* Surfaces */
  --surface-page-canvas: #ffffff;
  --surface-parchment-cream: #f3fbe9;
  --surface-card-linen: #f9f6f1;
  --surface-sage-charcoal: #283a2;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-forest-ink: #0a2414;
  --color-parchment-cream: #f3fbe9;
  --color-card-linen: #f9f6f1;
  --color-sage-charcoal: #283a2e;
  --color-muted-moss: #607166;
  --color-vivid-green: #1ad379;
  --color-deep-botanical: #17b267;
  --color-coral-blush: #ffbac3;
  --color-wine-plum: #360003;

  /* Typography */
  --font-abc-favorit: 'ABC Favorit', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-geist-mono: 'Geist Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-system-sans-serif: 'System Sans-Serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.2;
  --text-body: 15px;
  --leading-body: 1.33;
  --tracking-body: -0.15px;
  --text-subheading: 18px;
  --leading-subheading: 1.17;
  --tracking-subheading: -0.18px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.04;
  --tracking-heading-sm: -0.24px;
  --text-heading: 48px;
  --leading-heading: 1;
  --tracking-heading: -0.96px;
  --text-display: 80px;
  --leading-display: 0.95;
  --tracking-display: -1.6px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-40: 40px;
  --spacing-64: 64px;
  --spacing-72: 72px;
  --spacing-80: 80px;
  --spacing-120: 120px;
  --spacing-160: 160px;

  /* Border Radius */
  --radius-md: 6px;
  --radius-lg: 9px;
}
```
