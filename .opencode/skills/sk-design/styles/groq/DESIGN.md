# Groq — Style Reference
> speed lab notebook — parchment pages, graphite text, one highlighter-orange mark

**Theme:** mixed

Groq reads as a speed lab notebook — warm parchment surfaces, tight geometric sans-serif (Space Grotesk at whisper-weight 300), and a single searing orange accent that marks every action and highlight like a highlighter pen on graph paper. The layout alternates between bright cream and deep charcoal panels, creating a documentary rhythm of thesis (light) → proof (dark) → evidence (light) rather than a marketing funnel. Typography is small, confident, and slightly compressed; pill buttons and IBM Plex Mono eyebrows with wide tracking give the whole system a technical-spec feel. Components stay flat and minimal — no drop shadows, no gradients, no decorative chrome — so the orange is always the loudest thing on screen.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Ember Orange | `#f43e01` | `--color-ember-orange` | Orange supporting accent for decorative details and low-frequency emphasis. Do not promote it to the primary CTA color |
| Vapor Pink | `#e09afe` | `--color-vapor-pink` | Secondary decorative accent — rare highlights, special-emphasis inline marks, and select graphic flourishes. Used as a cool counterpoint to Ember Orange when a second color is needed |
| Parchment | `#e8e8de` | `--color-parchment` | Page canvas — the warm off-white that defines the site's light mode. Warmer than pure white, it gives the whole interface a paper-like quality |
| Bone | `#f3f3ee` | `--color-bone` | Elevated surface — cards, content blocks, nav backgrounds. One step lighter than Parchment, used to lift elements off the canvas without harsh contrast |
| Graphite | `#2d2f33` | `--color-graphite` | Primary text and dark section background — near-black with a cool cast. The workhorse color for headings, body copy, and full-bleed dark bands |
| Obsidian | `#2a2a25` | `--color-obsidian` | Deepest dark — alt dark-panel fill, footer surfaces. Slightly warmer than Graphite for variation in dark sections |
| Stone | `#69695d` | `--color-stone` | Secondary text — descriptions, supporting copy, muted labels. Warm olive-gray that harmonizes with Parchment rather than fighting it |
| Ash | `#9c9c90` | `--color-ash` | Tertiary text and disabled states — nav dropdown items, fine print, inactive icons |
| Khaki | `#cecebf` | `--color-khaki` | Hairline borders and dividers — low-contrast warm gray that defines edges without drawing attention |
| Mist | `#c2c2be` | `--color-mist` | List separators and secondary borders — a touch cooler than Khaki for list-item dividers |

## Tokens — Typography

### Space Grotesk — Primary typeface — all headings and body text. Weight 300 for headlines creates a quiet, technical confidence (anti-convention; most sites shout with 700). Weight 400 for body. Tight tracking at -0.02em across all sizes keeps headlines compact even at 46px. · `--font-space-grotesk`
- **Substitute:** Inter (close), General Sans, Satoshi
- **Weights:** 300, 400
- **Sizes:** 13, 14, 15, 17, 19, 21, 24, 28, 32, 36, 46
- **Line height:** 1.0–1.57
- **Letter spacing:** -0.02em across all sizes
- **Role:** Primary typeface — all headings and body text. Weight 300 for headlines creates a quiet, technical confidence (anti-convention; most sites shout with 700). Weight 400 for body. Tight tracking at -0.02em across all sizes keeps headlines compact even at 46px.

### IBM Plex Mono — Eyebrow labels, section tags, code snippets, small data. Tracking +0.1em (wide) gives it a technical-spec or serial-number quality — used sparingly above headings or as status indicators. · `--font-ibm-plex-mono`
- **Substitute:** JetBrains Mono, Roboto Mono
- **Weights:** 400, 500
- **Sizes:** 10, 12, 14
- **Line height:** 1.17–1.57
- **Letter spacing:** +0.1em
- **Role:** Eyebrow labels, section tags, code snippets, small data. Tracking +0.1em (wide) gives it a technical-spec or serial-number quality — used sparingly above headings or as status indicators.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 10px | 1.4 | 1px | `--text-caption` |
| body | 15px | 1.57 | -0.3px | `--text-body` |
| heading-sm | 21px | 1.3 | -0.42px | `--text-heading-sm` |
| heading | 28px | 1.3 | -0.56px | `--text-heading` |
| heading-lg | 36px | 1 | -0.72px | `--text-heading-lg` |
| display | 46px | 1 | -0.92px | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 8px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 8 | 8px | `--spacing-8` |
| 16 | 16px | `--spacing-16` |
| 24 | 24px | `--spacing-24` |
| 32 | 32px | `--spacing-32` |
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |
| 56 | 56px | `--spacing-56` |
| 80 | 80px | `--spacing-80` |
| 120 | 120px | `--spacing-120` |
| 128 | 128px | `--spacing-128` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 5px |
| cards | 10px |
| buttons | 1000px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 64-80px
- **Card padding:** 24-32px
- **Element gap:** 16-24px

## Components

### Primary Pill Button
**Role:** Main call-to-action across all pages

Fill: Ember Orange (#f43e01). Text: white, Space Grotesk 400, 14px. Border-radius: 1000px (fully pill). Padding: 10px 20px. No border, no shadow. On hover: slight darken. Used for 'Get Started', 'Start Building', 'Learn More', 'Read Customer Stories'.

### Dark Pill Button
**Role:** Secondary CTA on light backgrounds

Fill: Graphite (#2d2f33). Text: white, Space Grotesk 400, 14px. Border-radius: 1000px. Padding: 10px 20px. Used for 'Learn More' on dark sections or as alt CTA.

### Icon-Only Square Button
**Role:** Compact action trigger (e.g., send/submit)

Fill: Ember Orange (#f43e01). 32×32px square with 4-6px radius. White icon centered. Used in the sticky developer bar for the submit/send action.

### Hero Content Card
**Role:** Primary content container on the landing page hero

Background: Bone (#f3f3ee) or white. Border-radius: 10px. No border, no shadow. Contains a large product visual or media placeholder. Sits on Parchment canvas.

### Dark Section Panel
**Role:** Full-bleed dark band for proof/differentiator sections

Background: Graphite (#2d2f33). Text: white (Space Grotesk 300 for headlines, 400 for body). Accent eyebrow: Ember Orange. Full viewport width, ~400-500px tall. No border-radius — edge-to-edge.

### Testimonial Card
**Role:** Customer quote display in social-proof section

Background: white or Bone. Border-radius: 10px. Padding: 32px. Features a large Ember Orange quotation mark (Space Grotesk weight 300, ~40px) in the top-left. Body text in Graphite, 17px. Attribution in IBM Plex Mono 12px, +0.1em tracking, Stone color.

### Eyebrow Label
**Role:** Section category tag above headlines

Font: IBM Plex Mono 400, 12px. Color: Ember Orange. Letter-spacing: +0.1em (wide). Text-transform: uppercase. Sits centered or left-aligned above the section heading with 12-16px gap.

### Sticky Developer Bar
**Role:** Persistent bottom bar with brand logos and speed-test CTA

Background: white. Height: ~48px. Position: fixed bottom. Contains horizontally scrolling brand logos (grayscale) on the left, a dark pill-shaped input field ('Try the speed of Groq...') in the center-right, and an Ember Orange icon-button on the right.

### Navigation Header
**Role:** Top-level site navigation

Background: Parchment (#e8e8de) on light pages, transparent on dark. Layout: left nav group | centered logo | right nav group. Logo: Groq wordmark in Graphite. Nav links: Space Grotesk 400, 14px, Graphite. Primary CTA: Primary Pill Button (Ember Orange).

### Feature Content Card
**Role:** Supporting content card (e.g., 'Speed at a winning cost')

Background: Bone (#f3f3ee). Border-radius: 10px. Padding: 20-24px. Contains a small media thumbnail at top, then an Ember Orange eyebrow label, then a heading (Space Grotesk 300, 19-21px), then body text (15px, Stone).

### Code Block
**Role:** Code snippets and API examples

Background: white or Bone. Font: IBM Plex Mono 400, 14px. Border-radius: 10px. Padding: 24px. Syntax highlighting uses Ember Orange for keywords and Graphite for text.

## Do's and Don'ts

### Do
- Use weight 300 Space Grotesk for all headlines — it defines the site's quiet, technical voice.
- Apply Ember Orange (#f43e01) only to CTAs, eyebrow labels, and decorative quote marks. Never as body text or large background fills.
- Set all buttons to border-radius 1000px (pill shape) — this is a signature element.
- Alternate between Parchment (#e8e8de) light sections and Graphite (#2d2f33) dark sections to create the thesis/proof/evidence rhythm.
- Use IBM Plex Mono with +0.1em tracking for all small labels and eyebrows — the wide tracking signals 'technical spec'.
- Keep spacing on an 8px grid with 48-80px section gaps and 16-24px element gaps.
- Communicate depth through surface-value contrast (Parchment → Bone → White) rather than drop shadows.

### Don't
- Don't add drop shadows or elevation to any component — the system is intentionally flat.
- Don't use bright colors other than Ember Orange and Vapor Pink — the system is near-monochrome by design.
- Don't set headlines at weight 700 — weight 300 is the signature; bold would break the voice.
- Don't use pure white (#ffffff) as a page background — always Parchment (#e8e8de) or Bone (#f3f3ee).
- Don't use sharp corners on buttons or nav elements — the 1000px pill radius is non-negotiable.
- Don't add gradients — the system is strictly flat color blocks.
- Don't use multiple accent colors simultaneously — pick one (orange for action, pink for rare decoration) and commit.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Parchment Canvas | `#e8e8de` | Page background in light sections |
| 1 | Bone Card | `#f3f3ee` | Card surfaces, elevated content blocks |
| 2 | White Card | `#ffffff` | Inset cards, code blocks, high-contrast surfaces |
| 3 | Graphite Panel | `#2d2f33` | Dark section backgrounds |
| 4 | Obsidian Panel | `#2a2a25` | Deepest dark panels, footer |

## Elevation

No drop shadows anywhere. Depth is communicated exclusively through surface-value contrast (Parchment → Bone → White) and color shifts (Graphite panels). This flatness is deliberate — it keeps the orange accent as the only thing that visually 'pops' off the page.

## Imagery

Product photography is tight and technical: the LPU chip is shown as a clean product shot on white, isolated from context. No lifestyle imagery, no people, no environmental context — the hardware is the hero. Decorative elements are minimal: large orange quotation marks in testimonial cards, and the lightning-bolt logo mark. The overall image strategy is 'spec sheet' — clinical, confident, object-focused. No abstract gradients, no 3D renders, no illustrations with personality.

## Layout

Full-bleed page with max-width 1200px centered content. The page alternates between light (Parchment) and dark (Graphite) full-width bands: hero is light, differentiator section is dark, social proof returns to light. Hero uses a split layout — large media card on the left (~60% width), headline + CTA + supporting cards on the right (~40%). The dark differentiator section is a centered text+media composition. Testimonials appear in a horizontally scrolling 3-card row. A sticky bottom bar persists across the page with brand logos and a speed-test input. Navigation is a centered-logo top bar with nav groups flanking it on both sides.

## Agent Prompt Guide

**Quick Color Reference**
- text: #2d2f33
- background: #e8e8de
- card surface: #f3f3ee
- border: #cecebf
- accent: #f43e01
- primary action: no distinct CTA color

**Example Component Prompts**

No distinct primary action color was observed; use the extracted neutral button treatments instead of inventing a filled CTA color.

2. Create a dark differentiator section: Full-bleed Graphite (#2d2f33) background, no border-radius. Ember Orange lightning-bolt icon top-left. Headline in white Space Grotesk weight 300 at 32px, -0.56px tracking. Body text in white at 15px. A Dark Pill Button (Graphite fill won't work — use white outline: 1px white border, 1000px radius, white text, 10px 20px padding) labeled 'Learn More'.

3. Create a testimonial card: Bone (#f3f3ee) background, 10px radius, 32px padding. A 40px Space Grotesk weight 300 Ember Orange quotation mark in the top-left corner. Quote text in Graphite at 17px Space Grotesk 400. Attribution line in IBM Plex Mono 12px, +0.1em tracking, Stone (#69695d) color.

4. Create an eyebrow label: IBM Plex Mono 400, 12px, Ember Orange (#f43e01), letter-spacing 0.1em, text-transform uppercase, centered or left-aligned above a section heading with 12-16px gap below.

5. Create the sticky developer bar: White background, fixed to viewport bottom, 48px height. Left side: row of 5-6 grayscale brand logos. Right side: a dark pill-shaped input field (Graphite #2d2f33 fill, white placeholder text 'Try the speed of Groq...', 1000px radius) followed by a 32×32 Ember Orange icon-only button (4-6px radius) with a white send/submit icon.

## Rhythm Philosophy

The page reads as alternating evidence: a light band states the thesis, a dark band provides proof, a light band delivers social evidence. Never use two light bands back-to-back without a dark section or a strong visual divider in between. Dark sections should be 400-500px tall — enough to make a statement, short enough to return to the light quickly.

## Similar Brands

- **Anthropic** — Same light-canvas + single warm-accent + thin geometric sans-serif approach. Both use a quiet, document-like aesthetic rather than typical SaaS flash.
- **Linear** — Same pill-button geometry, monochrome-with-one-accent palette, and Space-Grotesk-adjacent geometric sans-serif. Linear's dark mode is more dominant, but the button language is close.
- **Vercel** — Same commitment to flat surfaces, single accent color, and thin-weight headlines. Vercel uses a cooler palette but the structural flatness and typographic confidence are comparable.
- **Hugging Face** — Both use a warm off-white canvas with dark text and a single vivid accent for CTAs. The technical-spec feel comes from mono-font labels and wide tracking on small text.
- **Modal** — Same alternating light/dark section rhythm and commitment to documenting rather than selling. Both feel like reading a technical brief rather than browsing a product page.

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-ember-orange: #f43e01;
  --color-vapor-pink: #e09afe;
  --color-parchment: #e8e8de;
  --color-bone: #f3f3ee;
  --color-graphite: #2d2f33;
  --color-obsidian: #2a2a25;
  --color-stone: #69695d;
  --color-ash: #9c9c90;
  --color-khaki: #cecebf;
  --color-mist: #c2c2be;

  /* Typography — Font Families */
  --font-space-grotesk: 'Space Grotesk', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-ibm-plex-mono: 'IBM Plex Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.4;
  --tracking-caption: 1px;
  --text-body: 15px;
  --leading-body: 1.57;
  --tracking-body: -0.3px;
  --text-heading-sm: 21px;
  --leading-heading-sm: 1.3;
  --tracking-heading-sm: -0.42px;
  --text-heading: 28px;
  --leading-heading: 1.3;
  --tracking-heading: -0.56px;
  --text-heading-lg: 36px;
  --leading-heading-lg: 1;
  --tracking-heading-lg: -0.72px;
  --text-display: 46px;
  --leading-display: 1;
  --tracking-display: -0.92px;

  /* Typography — Weights */
  --font-weight-light: 300;
  --font-weight-regular: 400;
  --font-weight-medium: 500;

  /* Spacing */
  --spacing-unit: 8px;
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-56: 56px;
  --spacing-80: 80px;
  --spacing-120: 120px;
  --spacing-128: 128px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 64-80px;
  --card-padding: 24-32px;
  --element-gap: 16-24px;

  /* Border Radius */
  --radius-md: 5px;
  --radius-lg: 10px;
  --radius-full: 1000px;

  /* Named Radii */
  --radius-tags: 5px;
  --radius-cards: 10px;
  --radius-buttons: 1000px;

  /* Surfaces */
  --surface-parchment-canvas: #e8e8de;
  --surface-bone-card: #f3f3ee;
  --surface-white-card: #ffffff;
  --surface-graphite-panel: #2d2f33;
  --surface-obsidian-panel: #2a2a25;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-ember-orange: #f43e01;
  --color-vapor-pink: #e09afe;
  --color-parchment: #e8e8de;
  --color-bone: #f3f3ee;
  --color-graphite: #2d2f33;
  --color-obsidian: #2a2a25;
  --color-stone: #69695d;
  --color-ash: #9c9c90;
  --color-khaki: #cecebf;
  --color-mist: #c2c2be;

  /* Typography */
  --font-space-grotesk: 'Space Grotesk', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-ibm-plex-mono: 'IBM Plex Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.4;
  --tracking-caption: 1px;
  --text-body: 15px;
  --leading-body: 1.57;
  --tracking-body: -0.3px;
  --text-heading-sm: 21px;
  --leading-heading-sm: 1.3;
  --tracking-heading-sm: -0.42px;
  --text-heading: 28px;
  --leading-heading: 1.3;
  --tracking-heading: -0.56px;
  --text-heading-lg: 36px;
  --leading-heading-lg: 1;
  --tracking-heading-lg: -0.72px;
  --text-display: 46px;
  --leading-display: 1;
  --tracking-display: -0.92px;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-56: 56px;
  --spacing-80: 80px;
  --spacing-120: 120px;
  --spacing-128: 128px;

  /* Border Radius */
  --radius-md: 5px;
  --radius-lg: 10px;
  --radius-full: 1000px;
}
```
