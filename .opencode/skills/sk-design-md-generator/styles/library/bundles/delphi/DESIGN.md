# Delphi — Style Reference
> warm parchment editorial with ember sparks

**Theme:** light

Delphi reads like an editorial spread on warm parchment: cream canvas, brown-black ink, a serif display voice, and orange sparks of energy. The product promises digital preservation of human expertise, and the visual language mirrors that — quiet, literary surfaces, generous whitespace, and chrome that feels printed rather than engineered. Color is used sparingly: the page stays achromatic-warm, with a single dark-chestnut button tone and a vivid ember orange reserved for trust signals, highlights, and the conversational heat of the hero's scattered question cards. Components are flat, low-elevation, and rely on thin hairlines and soft 12px corners rather than shadow stacks. Typography carries the personality — a humanist serif at whisper-light weight for headlines, a workhorse sans for body — creating the rhythm of a long-form magazine sitting next to a product interface.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Parchment | `#fdf6ee` | `--color-parchment` | Page canvas, hero background, card surfaces on light sections — sets the warm literary tone that distinguishes this from the cool-white default of most SaaS |
| Soft Cream | `#f0e6dc` | `--color-soft-cream` | Navigation background, secondary surface layer, subtle hover/elevated zones |
| Pure Card | `#ffffff` | `--color-pure-card` | Foreground card surface for content blocks, feature panels, and the floating chat testimonials in the hero |
| Ink Black | `#000000` | `--color-ink-black` | Primary text, icon strokes, and border lines — used at the highest prominence to anchor every paragraph and heading |
| Charcoal Bark | `#21201c` | `--color-charcoal-bark` | Body text on light surfaces where pure black reads too cold against the cream |
| Sepia | `#2b180a` | `--color-sepia` | Headings, button text, emphasized inline elements — dark brown instead of black gives headlines a printed-ink quality |
| Bronze | `#7f6e60` | `--color-bronze` | Muted secondary body text, descriptive captions beneath headings |
| Driftwood | `#94877c` | `--color-driftwood` | Tertiary text, nav links, low-emphasis labels, and warm-toned dividers |
| Stone | `#a99d93` | `--color-stone` | Disabled or lowest-emphasis text, ghost iconography |
| Pebble | `#d9cfc3` | `--color-pebble` | Hairline borders, card edges, and subtle dividers on cream surfaces |
| Chestnut | `#3e2407` | `--color-chestnut` | Orange supporting accent for decorative details and low-frequency emphasis. Do not promote it to the primary CTA color |
| Ember Orange | `#f65726` | `--color-ember-orange` | Accent text, in-card highlights, conversational emphasis — warm vivid orange that ignites against the parchment |
| Saffron Pulse | `#ff5c00` | `--color-saffron-pulse` | Orange supporting accent for decorative details and low-frequency emphasis. |
| Peach Glow | `#fed0b3` | `--color-peach-glow` | Orange supporting accent for decorative details and low-frequency emphasis. Do not promote it to the primary CTA color |

## Tokens — Typography

### sans-serif — sans-serif — detected in extracted data but not described by AI · `--font-sans-serif`
- **Weights:** 400
- **Sizes:** 12px
- **Line height:** 1.2
- **Role:** sans-serif — detected in extracted data but not described by AI

### Martina Plantijn Light — Display and heading face — a humanist serif that carries the editorial, literary voice of the brand. Light weight (300) is used for the largest display headlines, where the negative letter-spacing tightens the characters into a single confident mark. This font is the most distinctive choice in the system: a serif on a product interface signals thoughtfulness and preservation rather than speed and automation. · `--font-martina-plantijn-light`
- **Substitute:** Cormorant Garamond or Lora (Google Fonts)
- **Weights:** 300, 400, 700
- **Sizes:** 8, 10, 12, 14, 15, 20, 24, 40, 56, 64
- **Line height:** 1.00, 1.20, 1.22, 1.32, 1.34
- **Letter spacing:** -0.0300em at 64px, -0.0220em at 56px, -0.0200em at 40px, -0.0130em at 24px, -0.0120em at 20px
- **Role:** Display and heading face — a humanist serif that carries the editorial, literary voice of the brand. Light weight (300) is used for the largest display headlines, where the negative letter-spacing tightens the characters into a single confident mark. This font is the most distinctive choice in the system: a serif on a product interface signals thoughtfulness and preservation rather than speed and automation.

### Inter — Body, navigation, and UI text — the workhorse sans that handles everything below the headlines. Weight 400 is default body, weight 500 for emphasized labels and nav. Tight -0.0100em tracking keeps the small sizes legible without feeling clinical. · `--font-inter`
- **Substitute:** Inter (Google Fonts — native match)
- **Weights:** 400, 500
- **Sizes:** 10, 13, 14, 15, 17
- **Line height:** 1.00, 1.20, 1.40
- **Letter spacing:** -0.0100em
- **Role:** Body, navigation, and UI text — the workhorse sans that handles everything below the headlines. Weight 400 is default body, weight 500 for emphasized labels and nav. Tight -0.0100em tracking keeps the small sizes legible without feeling clinical.

### Roboto Mono — Used sparingly for inline code-like references (e.g. the '> 50 chats' trigger syntax in feature cards) — a monospace accent that signals system or automation language within editorial copy · `--font-roboto-mono`
- **Weights:** 400
- **Sizes:** 13
- **Line height:** 1.40
- **Role:** Used sparingly for inline code-like references (e.g. the '> 50 chats' trigger syntax in feature cards) — a monospace accent that signals system or automation language within editorial copy

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 10px | 1.2 | -0.012px | `--text-caption` |
| body | 15px | 1.32 | -0.015px | `--text-body` |
| subheading | 20px | 1.32 | -0.24px | `--text-subheading` |
| heading-sm | 24px | 1.22 | -0.312px | `--text-heading-sm` |
| heading | 40px | 1.2 | -0.8px | `--text-heading` |
| heading-lg | 56px | 1 | -1.232px | `--text-heading-lg` |
| display | 64px | 1 | -1.92px | `--text-display` |

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
| 80 | 80px | `--spacing-80` |
| 96 | 96px | `--spacing-96` |
| 120 | 120px | `--spacing-120` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 8px |
| cards | 12-16px |
| avatars | 70px |
| buttons | 12px |
| smallElements | 4px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 20-24px
- **Element gap:** 8-12px

## Components

### Primary Chestnut Button
**Role:** Hero CTA and main conversion action

Chestnut (#3e2407) solid fill, white text, 12px border-radius, horizontal padding ~16px, vertical padding ~10px. The signature detail is the peach (#fed0b3) box-shadow glow that radiates from behind the button — a warm bloom rather than a neutral drop shadow. Inter 15px / 500. This button replaces the conventional blue CTA with a brown that reads as 'considered, premium'.

### Ghost Outline Button
**Role:** Secondary action paired with the primary CTA (e.g. 'See it in action')

Transparent fill, 1px pebble (#d9cfc3) or charcoal border, 12px radius, Inter 15px / 500 in sepia (#2b180a). No background, no shadow — sits in conversation with the filled button.

### Nav Pill Button
**Role:** Top-right 'Get Started' action in the navigation bar

Soft cream (#f0e6dc) background, sepia text, fully rounded 12px radius with generous horizontal padding. Reads as a soft chip rather than a hard button — a gentler approach to navigation conversion.

### Floating Question Card
**Role:** Hero scatter element — miniature testimonial cards that surround the headline

White (#ffffff) surface, 12px border-radius, subtle hairline border or very soft shadow, 12-16px internal padding. Each card stacks: circular 70px avatar, name + role in Inter 12-13px, and a one-sentence question in Inter 14px. These are the signature design moment — they replace a hero illustration with living proof.

### Avatar Bubble
**Role:** Circular profile image used in question cards and feature panels

70px border-radius (effectively a perfect circle), image fill with no border. Appears with a small blue/verified check overlay on certain positions.

### Section Eyebrow Tag
**Role:** Small label above section titles ('Why Delphi', 'Trust')

Pebble-colored text (#d9cfc3) or saffron (#ff5c00) on the cream background, Inter ~12-13px, centered above the heading. Sometimes sits inside a hairline-bordered pill. Functions as a low-volume category marker.

### Feature Side Card
**Role:** Two-column feature blocks (e.g. 'Never Repeat Yourself Again')

Off-white or cream surface, 16px border-radius, generous internal padding (24-32px). Heading in Martina Plantijn Light 24px, body in Inter 15px bronze, optional chat preview or automation trigger rendered as a sub-card at the bottom with a monospaced condition line.

### Trigger Preview Card
**Role:** Inline preview of a Delphi automation trigger inside a feature card

Nested sub-card with 8-12px radius, white or cream fill, small Inter label ('When') in muted gray, a one-line condition in Inter 14px where the variable value is highlighted in ember orange (#f65726), and a '+ Add Action' row below in subdued text.

### Centered Portrait Panel
**Role:** Trust section centerpiece — a single full-color portrait card flanked by two feature cards

Tall card with 16px radius, warm gradient or photographic portrait background, name and role overlay in white sans text near the bottom. The portrait bleeds into a soft fade that merges with the parchment canvas below.

### Verified Badge Dot
**Role:** Small marker indicating a verified expert on avatar bubbles

Cobalt blue circle (~#1da1f2 or similar) with a white check, positioned at the lower-right of the avatar. The only true blue element on the page, making it pop as a system signal.

### Section Headline Block
**Role:** Centered two-line display title for each section

First line in Martina Plantijn Light 56px, second line in lighter or italic weight for contrast — a deliberate two-tone line treatment. Below it, a single paragraph of body copy in Inter ~17px bronze (#7f6e60), centered, max-width ~640px.

## Do's and Don'ts

### Do
- Use Martina Plantijn Light weight 300 with letter-spacing -0.022em for all section and hero headlines — the whisper-light serif is the brand's editorial signature.
- Place the primary CTA on a chestnut (#3e2407) fill with the peach (#fed0b3) glow shadow; never use a conventional blue or green for action buttons.
- Keep page background on Parchment (#fdf6ee); switch to Pure Card (#ffffff) only for cards that need to lift above the canvas.
- Apply 12px radius to buttons and 16px radius to image-bearing cards — 70px only for avatar circles, never for other shapes.
- Reserve saffron (#ff5c00) and ember orange (#f65726) for one or two punctuation moments per viewport — never for large fills or backgrounds.
- Set the hero as a scattered constellation of white question cards around a centered serif headline; do not use a single hero illustration.
- Anchor each section with a centered eyebrow tag above a two-line serif headline; one short paragraph below, no more.

### Don't
- Do not use bright blue, green, or any cool color as a primary CTA fill — chestnut brown is the only button fill color in this system.
- Do not apply heavy drop shadows to cards; the design uses flat surfaces and hairline borders, not elevation stacks.
- Do not set body text in the serif face — Inter handles all copy below 20px, Martina Plantijn only for display.
- Do not use pure black (#000000) as body text on cream — the eye reads it too cold; use sepia (#2b180a) or charcoal bark (#21201c) instead. Black is reserved for nav text and icon strokes.
- Do not introduce gradients on cards or buttons — the page is flat, with the single exception of the portrait panel and the peach button glow.
- Do not exceed two text colors per block (one heading tone, one body tone); the warmth comes from limited palette use, not from variation.
- Do not add rounded-radius values outside the scale of 4px, 8px, 12px, 16px, and 70px — the radii vocabulary is deliberately short.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Parchment Canvas | `#fdf6ee` | Page-wide background, hero, and section backgrounds |
| 1 | Soft Cream | `#f0e6dc` | Navigation bar, subtle elevated zones, hover backgrounds |
| 2 | Pure Card | `#ffffff` | Content cards, feature panels, floating testimonial cards |
| 3 | Chestnut Block | `#3e2407` | Primary CTA button, dark accent surfaces |

## Elevation

Delphi uses a deliberately flat elevation model: cards and panels sit on the parchment canvas with a 1px pebble border or no border at all, rather than relying on shadow depth. The single exception is the primary chestnut button, which receives a soft peach (#fed0b3) bloom-shadow — a warm, on-brand glow rather than a neutral drop shadow. This restraint is editorial: the page reads as a printed spread, not as a layered app.

## Imagery

Imagery on Delphi is minimal and serves as social proof, not decoration. The hero uses no illustration or product screenshot — instead, the visual energy comes from scattered floating question cards, each containing a circular avatar portrait and a line of quoted expertise. The single full-bleed photographic moment is a centered trust-section portrait (a smiling expert on a warm orange-red background) that bleeds into the canvas via a soft fade. Avatars are tight headshots, not lifestyle photography. The overall feel is 'magazine table of contents' rather than 'product hero' — the people are the visual content, not the product UI.

## Layout

Delphi uses a max-width ~1200px centered container on a full-bleed parchment canvas. The hero is a distinctive constellation layout: a centered serif headline ('Digitize Your Mind') sits in the visual middle, with 8-10 small white question cards scattered loosely around it at varying sizes and positions, creating a sense of orbiting voices. Below the hero, sections follow a consistent rhythm: a centered eyebrow tag ('Why Delphi', 'Trust'), a two-line serif headline, one short body paragraph, then either a 2-column feature grid or a 3-up card row. The 'Trust' section uses a 3-column grid flanking a tall centered portrait card, where the left and right columns contain stacked feature cards. Navigation is a minimal top bar with left-aligned industry/resource links, a centered wordmark, and right-aligned discover/sign-in/get-started actions. No sidebar, no sticky header, no mega-menu.

## Agent Prompt Guide

**Quick Color Reference**
- text (heading): #2b180a (Sepia)
- text (body): #7f6e60 (Bronze)
- background (canvas): #fdf6ee (Parchment)
- background (card): #ffffff (Pure Card)
- border (hairline): #d9cfc3 (Pebble)
- accent (highlight): #ff5c00 (Saffron Pulse)
- primary action: no distinct CTA color

**3-5 Example Component Prompts**

No distinct primary action color was observed; use the extracted neutral button treatments instead of inventing a filled CTA color.

2. Build a feature card: Pure Card (#ffffff) surface, 16px border-radius, 24px padding. Martina Plantijn Light 24px Sepia heading 'Never Repeat Yourself Again'. Inter 15px bronze body paragraph below. Nest a Trigger Preview sub-card inside (8px radius, #fdf6ee fill) with a 'When' label in 12px Inter driftwood, a condition line 'User has completed > 50 chats' where '> 50 chats' is highlighted in Ember Orange (#f65726), and a '+ Add Action' row in 13px Inter stone (#a99d93).

3. Build a section header block: centered, Parchment canvas above. Top eyebrow tag is Inter 12px Saffron Pulse (#ff5c00) reading 'Why Delphi'. Below, a two-line display headline in Martina Plantijn Light weight 300 at 40px Sepia with -0.8px letter-spacing. Underneath, a single Inter 15px bronze paragraph, max-width 640px, centered.

4. Build a trust portrait panel: 16px radius card, full-bleed photographic portrait with a warm orange-red ambient background, name and role overlay in white Inter 14px near the bottom third, soft 20% black-to-transparent gradient at the bottom edge so text remains readable. Flank with two stacked feature cards on each side (white, 12px radius, sepia 24px serif heading, bronze 15px body).

5. Build the navigation bar: Soft Cream (#f0e6dc) background, 12px content height, left-aligned Inter 14px sepia links ('Industries', 'Resources', 'Pricing', 'Immortal'), centered wordmark, right-aligned 'Discover' and 'Sign in' in 14px Inter sepia followed by a 'Get Started' pill button (soft cream fill, 12px radius, sepia text, ~10px/16px padding).

## Similar Brands

- **Substack** — Same editorial serif-headline + warm-cream-canvas approach, where the product UI is dressed like a long-form publication
- **Notion AI** — Similar light minimalism with warm neutrals and a single non-blue accent for action emphasis
- **Gamma** — Centered serif display headlines floating on a soft warm canvas with subtle scatter-card hero composition
- **Anthropic** — Editorial typography-first homepage where the serif headline carries personality and the product UI stays quiet and warm-toned

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-parchment: #fdf6ee;
  --color-soft-cream: #f0e6dc;
  --color-pure-card: #ffffff;
  --color-ink-black: #000000;
  --color-charcoal-bark: #21201c;
  --color-sepia: #2b180a;
  --color-bronze: #7f6e60;
  --color-driftwood: #94877c;
  --color-stone: #a99d93;
  --color-pebble: #d9cfc3;
  --color-chestnut: #3e2407;
  --color-ember-orange: #f65726;
  --color-saffron-pulse: #ff5c00;
  --color-peach-glow: #fed0b3;

  /* Typography — Font Families */
  --font-sans-serif: 'sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-martina-plantijn-light: 'Martina Plantijn Light', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-roboto-mono: 'Roboto Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.2;
  --tracking-caption: -0.012px;
  --text-body: 15px;
  --leading-body: 1.32;
  --tracking-body: -0.015px;
  --text-subheading: 20px;
  --leading-subheading: 1.32;
  --tracking-subheading: -0.24px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.22;
  --tracking-heading-sm: -0.312px;
  --text-heading: 40px;
  --leading-heading: 1.2;
  --tracking-heading: -0.8px;
  --text-heading-lg: 56px;
  --leading-heading-lg: 1;
  --tracking-heading-lg: -1.232px;
  --text-display: 64px;
  --leading-display: 1;
  --tracking-display: -1.92px;

  /* Typography — Weights */
  --font-weight-light: 300;
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-bold: 700;

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
  --spacing-80: 80px;
  --spacing-96: 96px;
  --spacing-120: 120px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 20-24px;
  --element-gap: 8-12px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8.21px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-2xl-2: 20px;
  --radius-full: 70px;
  --radius-full-2: 582px;

  /* Named Radii */
  --radius-tags: 8px;
  --radius-cards: 12-16px;
  --radius-avatars: 70px;
  --radius-buttons: 12px;
  --radius-smallelements: 4px;

  /* Surfaces */
  --surface-parchment-canvas: #fdf6ee;
  --surface-soft-cream: #f0e6dc;
  --surface-pure-card: #ffffff;
  --surface-chestnut-block: #3e2407;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-parchment: #fdf6ee;
  --color-soft-cream: #f0e6dc;
  --color-pure-card: #ffffff;
  --color-ink-black: #000000;
  --color-charcoal-bark: #21201c;
  --color-sepia: #2b180a;
  --color-bronze: #7f6e60;
  --color-driftwood: #94877c;
  --color-stone: #a99d93;
  --color-pebble: #d9cfc3;
  --color-chestnut: #3e2407;
  --color-ember-orange: #f65726;
  --color-saffron-pulse: #ff5c00;
  --color-peach-glow: #fed0b3;

  /* Typography */
  --font-sans-serif: 'sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-martina-plantijn-light: 'Martina Plantijn Light', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-roboto-mono: 'Roboto Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.2;
  --tracking-caption: -0.012px;
  --text-body: 15px;
  --leading-body: 1.32;
  --tracking-body: -0.015px;
  --text-subheading: 20px;
  --leading-subheading: 1.32;
  --tracking-subheading: -0.24px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.22;
  --tracking-heading-sm: -0.312px;
  --text-heading: 40px;
  --leading-heading: 1.2;
  --tracking-heading: -0.8px;
  --text-heading-lg: 56px;
  --leading-heading-lg: 1;
  --tracking-heading-lg: -1.232px;
  --text-display: 64px;
  --leading-display: 1;
  --tracking-display: -1.92px;

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
  --spacing-80: 80px;
  --spacing-96: 96px;
  --spacing-120: 120px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8.21px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-2xl-2: 20px;
  --radius-full: 70px;
  --radius-full-2: 582px;
}
```
