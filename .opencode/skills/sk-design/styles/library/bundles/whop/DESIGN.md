# Whop — Style Reference
> Bold sticker on cream paper — a minimal light canvas with a single orange button that casts a hard burnt-orange shadow.

**Theme:** light

Whop uses a high-contrast light canvas with a single saturated orange as the entire chromatic vocabulary. The system is typographically polarized: a custom geometric display face (acidGrotesk) at near-mega sizes for hero and section headlines, and Inter for all functional UI at 14-20px. Surfaces stay flat — no gradients, minimal shadows — with one signature move: the primary orange button carries a hard 3px offset shadow in a deeper burnt-orange rather than a soft drop shadow, giving the interface a slightly retro, almost sticker-like weight. Card corners are pillowy at 24px while buttons stay compact at 8px, creating a clear hierarchy of softness between content containers and interactive elements. The overall rhythm is spacious and confident: large display headlines, generous 64-80px section gaps, and white phone mockups floating on a near-white canvas.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Ember Orange | `#fa4616` | `--color-ember-orange` | Orange wash for highlight backgrounds, decorative bands, and soft emphasis behind content. Do not promote it to the primary CTA color |
| Ember Shadow | `#b62600` | `--color-ember-shadow` | Hard 3px offset shadow beneath Ember Orange buttons — a deeper burnt orange instead of a soft drop shadow |
| Carbon | `#202020` | `--color-carbon` | Primary text, heading strokes, heavy borders, icon fills |
| Snow | `#ffffff` | `--color-snow` | Card surfaces, button text on dark fills, the elevated layer above the page canvas |
| Mist | `#f9f9f9` | `--color-mist` | Page canvas — the near-white background that all sections sit on |
| Silver | `#e1e4e8` | `--color-silver` | Hairline dividers, card borders, subtle structural separators |
| Slate | `#646464` | `--color-slate` | Muted body text, secondary links, inactive nav items, mid-weight borders |
| Ash | `#838383` | `--color-ash` | Tertiary text, placeholder text, disabled labels |
| Pearl | `#bbbbbb` | `--color-pearl` | Light borders, icon outlines, low-emphasis strokes |
| Obsidian | `#0a0a0a` | `--color-obsidian` | Dark surface variant for inverted cards or code-editor panels |

## Tokens — Typography

### acidGrotesk — Display and section headlines — used at near-mega sizes (128px) for hero, 56px for section titles. Line-height locked to 1.00, tracking at -0.03em creates a compressed, poster-like quality. This is a custom geometric face; no system font replicates its personality. · `--font-acidgrotesk`
- **Substitute:** Inter Tight at weight 800, or Space Grotesk Bold
- **Weights:** 700
- **Sizes:** 56px, 128px
- **Line height:** 1.00
- **Letter spacing:** -0.0300em (constant across all sizes)
- **Role:** Display and section headlines — used at near-mega sizes (128px) for hero, 56px for section titles. Line-height locked to 1.00, tracking at -0.03em creates a compressed, poster-like quality. This is a custom geometric face; no system font replicates its personality.

### Inter — All functional UI: body copy, links, buttons, nav, footer, card text, labels. Weight 400 for body, 500 for buttons and emphasized text, 600-700 for subheadings and strong labels. Tracking tightens as size increases (-0.016em at 20px down to -0.006em at 13px). · `--font-inter`
- **Substitute:** Inter (native) or system-ui, -apple-system, sans-serif
- **Weights:** 400, 500, 600, 700
- **Sizes:** 13px, 14px, 16px, 20px
- **Line height:** 1.40–1.50
- **Letter spacing:** -0.0160em, -0.0140em, -0.0130em, -0.0110em, -0.0090em, -0.0060em
- **Role:** All functional UI: body copy, links, buttons, nav, footer, card text, labels. Weight 400 for body, 500 for buttons and emphasized text, 600-700 for subheadings and strong labels. Tracking tightens as size increases (-0.016em at 20px down to -0.006em at 13px).

### Geist Mono — Code snippets, terminal prompts, technical metadata, version labels. Generous line-height (1.70) for multi-line code blocks. Normal letter-spacing — mono fonts don't need optical tightening. · `--font-geist-mono`
- **Substitute:** JetBrains Mono, IBM Plex Mono, ui-monospace
- **Weights:** 500, 600
- **Sizes:** 12px, 13px, 14px, 16px
- **Line height:** 1.50–1.70
- **Role:** Code snippets, terminal prompts, technical metadata, version labels. Generous line-height (1.70) for multi-line code blocks. Normal letter-spacing — mono fonts don't need optical tightening.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.5 | — | `--text-caption` |
| body | 16px | 1.5 | -0.16px | `--text-body` |
| subheading | 20px | 1.4 | -0.32px | `--text-subheading` |
| heading | 56px | 1 | -1.68px | `--text-heading` |
| display | 128px | 1 | -3.84px | `--text-display` |

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
| 64 | 64px | `--spacing-64` |
| 80 | 80px | `--spacing-80` |
| 96 | 96px | `--spacing-96` |
| 160 | 160px | `--spacing-160` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 24px |
| buttons | 8px |
| smallElements | 4px |
| largeContainers | 16px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| subtle | `rgb(182, 38, 0) 0px 3px 0px 0px` | `--shadow-subtle` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 64-80px
- **Card padding:** 24px
- **Element gap:** 24px

## Components

### Primary CTA Button
**Role:** The singular high-emphasis action — the only chromatic button in the system

Background #fa4616, white text in Inter weight 500 at 16px, padding 12px 24px, border-radius 8px, no border. Carries a unique hard offset shadow: rgb(182,38,0) 0px 3px 0px 0px — the burnt-orange offset makes the button feel like a physical sticker pressed onto the page.

### Ghost/Secondary Button
**Role:** Low-emphasis action paired with the primary CTA

Transparent background, border 1px solid #e1e4e8, text #202020 in Inter 500 at 16px, padding 12px 24px, border-radius 8px. No shadow. Sits beside the orange button in the hero.

### Top Navigation Bar
**Role:** Persistent site header

White background (#ffffff), full-width with inner max-width container. Left: Whop logo (mark + wordmark). Right: text links 'For enterprise', 'API', 'Sign in' in Inter 14px weight 500, color #646464. No border, no shadow — floats on the canvas.

### Display Headline
**Role:** Hero and section-level titles

acidGrotesk weight 700, 56px for section headings, up to 128px for hero, line-height 1.00, letter-spacing -0.03em, color #202020. No color, no decoration — the type does all the work.

### Phone Mockup Card
**Role:** Product showcase tile in horizontal scroll galleries

White surface (#ffffff), border-radius 24px, 24px padding, contains a full phone screenshot. No border or shadow — the card is defined purely by its soft radius against the #f9f9f9 canvas. Arranged in a horizontal row with 24px gaps, overflow scrolls.

### Tab Navigation (Pill Group)
**Role:** Switches between embed component examples (Checkout, Wallet, Chat)

Contained pill group with rounded container. Active tab: white background with subtle shadow or border, Inter 14px weight 600, #202020 text. Inactive tabs: transparent, #646464 text, no border. Container radius 8px, individual tabs have no radius — they fill the container.

### Code Editor Panel
**Role:** Shows code snippets for embed components

Dark surface (#0a0a0a or near-black), border-radius 12-16px, contains monospace text in Geist Mono 13-14px. Terminal prompt prefix, syntax-colored tokens (blue, red, orange, violet) against the dark ground. The only place a dark surface appears.

### Footer
**Role:** Minimal site footer

White or canvas background, single row of text links: 'How it works', 'Mission', 'Press', 'Brand', 'Legal', 'Status' in Inter 13px weight 400, #646464 color. Social icons (YouTube, X, Instagram) right-aligned as outlined icons in #646464.

### Category Label (Showcase Section)
**Role:** Labels above each phone mockup (Agency, Game, Service business, etc.)

Inter 14px weight 500, #202020, centered above each phone card. Acts as a subheading for the showcase tiles.

### Hero Section
**Role:** Full-viewport above-the-fold area

Full-width #f9f9f9 background, centered content stack: display headline at 56-128px, then a row of two buttons (orange CTA + ghost) with 16px gap, vertically centered in the viewport. 64px gap between headline and button row.

## Do's and Don'ts

### Do
- Use Ember Orange (#fa4616) exclusively for the single primary action on any screen — never for decorative elements, tags, or secondary buttons
- Apply the hard burnt-orange offset shadow (rgb(182,38,0) 0px 3px 0px 0px) only to primary CTA buttons
- Set display headlines in acidGrotesk at 56px or 128px with line-height 1.00 and letter-spacing -0.03em — never use Inter for display sizes
- Use 24px border-radius for all card-like containers and 8px for all buttons — this size ratio is non-negotiable
- Keep the page canvas #f9f9f9 and card surfaces #ffffff — never invert this hierarchy
- Use 64-80px vertical gaps between major sections to maintain the spacious rhythm
- Use Geist Mono exclusively for code, terminal prompts, and technical metadata — never for UI labels or body text

### Don't
- Don't use Ember Orange for any element that isn't the primary action button on that screen
- Don't apply soft drop shadows, blur, or opacity-based shadows to any element — the system is flat
- Don't use display sizes (56px+) in Inter — Inter is for 13-20px functional UI only
- Don't add gradients — the system is entirely flat color
- Don't use neutral grays for decorative accents or illustrations — the palette is near-black to near-white with one orange
- Don't set border-radius values outside the four tokens: 4px, 8px, 12px, 16px, 24px
- Don't place multiple orange buttons on the same screen — one primary action per view

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas | `#f9f9f9` | Page background — every section sits on this near-white |
| 1 | Card | `#ffffff` | Elevated content containers, phone mockups, code panels |
| 2 | Dark Surface | `#0a0a0a` | Inverted code-editor and dark-mode product surfaces |
| 3 | Accent Surface | `#fa4616` | Primary CTA button fill — the only chromatic surface |

## Elevation

- **Primary CTA Button:** `rgb(182, 38, 0) 0px 3px 0px 0px`

## Imagery

Imagery is entirely product-driven: phone mockups showing real product screens (social feeds, game UIs, service booking apps) with no lifestyle photography or decorative illustration. Phone mockups are presented as white-bezel devices at slight angles or straight-on, floating on the #f9f9f9 canvas with no shadows. Social icons in the footer are simple outlined glyphs in #646464. The visual language is screenshots-as-hero — the product interface is the brand imagery.

## Layout

Full-bleed sections on #f9f9f9 canvas with max-width 1200px centered content containers. Hero is a centered headline + dual-button stack, vertically centered in the viewport with generous whitespace. Subsequent sections alternate between centered text blocks and product showcase rows — a horizontal scroll of 24px-radius phone mockup cards with category labels above. The embed components section uses a tabbed switcher (pill group) with a split layout: code editor on one side, phone mockup on the other. Navigation is a single white top bar with logo left and three text links right. Footer is a single minimal row of links + social icons. Section gaps of 64-80px create a calm, confident vertical rhythm.

## Agent Prompt Guide

**Quick Color Reference:**
- Background: #f9f9f9 (Mist) — page canvas
- Card surface: #ffffff (Snow) — elevated containers
- Text: #202020 (Carbon) — primary
- Muted text: #646464 (Slate) — secondary
- Border: #e1e4e8 (Silver) — hairline dividers
- primary action: no distinct CTA color

**Example Component Prompts:**

No distinct primary action color was observed; use the extracted neutral button treatments instead of inventing a filled CTA color.

2. **Phone Mockup Card**: White surface #ffffff, border-radius 24px, padding 24px, containing a phone screenshot at full width. Label above: 'Agency' in Inter 14px weight 500, #202020, centered. 24px gap between cards in a horizontal row.

3. **Tab Navigation**: Pill container with #e1e4e8 background, border-radius 8px. Three tabs: 'Checkout' (active: white background, #202020 text, Inter 600 14px), 'Wallet' (inactive: transparent, #646464 text), 'Chat' (inactive: transparent, #646464 text). 12px horizontal padding per tab.

4. **Code Editor Panel**: Dark surface #0a0a0a, border-radius 12px, padding 24px. Terminal prompt '$ npm install @whop/checkout' in Geist Mono 14px weight 500, #ffffff text. No border, no shadow.

5. **Top Navigation**: White #ffffff background, full-width. Left: 'Whop' logo (mark + wordmark in #202020). Right: 'For enterprise', 'API', 'Sign in' in Inter 14px weight 500, #646464, 24px gap between links. No border, no shadow.

## Similar Brands

- **Linear** — Same approach of one chromatic accent on a light canvas with generous spacing and tight geometric type for headlines
- **Stripe** — Similar clean light-mode product showcase with phone mockups floating on near-white backgrounds, centered hero headlines
- **Vercel** — Shared minimal light aesthetic with a single bold accent color and oversized display headlines, comfortable density
- **Cal.com** — Similar flat light surfaces with pillowy card radii and a single saturated brand color as the only chromatic element

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-ember-orange: #fa4616;
  --color-ember-shadow: #b62600;
  --color-carbon: #202020;
  --color-snow: #ffffff;
  --color-mist: #f9f9f9;
  --color-silver: #e1e4e8;
  --color-slate: #646464;
  --color-ash: #838383;
  --color-pearl: #bbbbbb;
  --color-obsidian: #0a0a0a;

  /* Typography — Font Families */
  --font-acidgrotesk: 'acidGrotesk', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-geist-mono: 'Geist Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.16px;
  --text-subheading: 20px;
  --leading-subheading: 1.4;
  --tracking-subheading: -0.32px;
  --text-heading: 56px;
  --leading-heading: 1;
  --tracking-heading: -1.68px;
  --text-display: 128px;
  --leading-display: 1;
  --tracking-display: -3.84px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-unit: 8px;
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-96: 96px;
  --spacing-160: 160px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 64-80px;
  --card-padding: 24px;
  --element-gap: 24px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-3xl: 24px;

  /* Named Radii */
  --radius-cards: 24px;
  --radius-buttons: 8px;
  --radius-smallelements: 4px;
  --radius-largecontainers: 16px;

  /* Shadows */
  --shadow-subtle: rgb(182, 38, 0) 0px 3px 0px 0px;

  /* Surfaces */
  --surface-canvas: #f9f9f9;
  --surface-card: #ffffff;
  --surface-dark-surface: #0a0a0a;
  --surface-accent-surface: #fa4616;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-ember-orange: #fa4616;
  --color-ember-shadow: #b62600;
  --color-carbon: #202020;
  --color-snow: #ffffff;
  --color-mist: #f9f9f9;
  --color-silver: #e1e4e8;
  --color-slate: #646464;
  --color-ash: #838383;
  --color-pearl: #bbbbbb;
  --color-obsidian: #0a0a0a;

  /* Typography */
  --font-acidgrotesk: 'acidGrotesk', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-geist-mono: 'Geist Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.16px;
  --text-subheading: 20px;
  --leading-subheading: 1.4;
  --tracking-subheading: -0.32px;
  --text-heading: 56px;
  --leading-heading: 1;
  --tracking-heading: -1.68px;
  --text-display: 128px;
  --leading-display: 1;
  --tracking-display: -3.84px;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-96: 96px;
  --spacing-160: 160px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-3xl: 24px;

  /* Shadows */
  --shadow-subtle: rgb(182, 38, 0) 0px 3px 0px 0px;
}
```
