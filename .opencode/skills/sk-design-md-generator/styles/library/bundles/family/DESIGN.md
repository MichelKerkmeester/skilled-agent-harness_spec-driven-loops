# Family — Style Reference
> storybook spread on cream parchment

**Theme:** light

Family speaks in a warm parchment-and-marker language: a cream canvas (#fbfaf9) carries hand-drawn characters and scattered confetti shapes in primary-bright fills, while typography stays calm and utilitarian in Inter. The interface itself is deliberately restrained — inset hairline borders define surfaces rather than shadows — so the cartoon illustrations carry all the emotional weight and the chrome stays quiet. Color functions as semantic markers: near-black for the one serious action, blue and orange for status, gold and green for positive signals, red and pink for destructive/attention. Every screen should feel like a children's storybook spread: generous whitespace, big confident headings, and a few vivid characters punctuating an otherwise monochrome layout.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Cream Canvas | `#fbfaf9` | `--color-cream-canvas` | Page background, nav surface — warm off-white that reads as paper rather than screen |
| Stone Surface | `#f2f0ed` | `--color-stone-surface` | Card surfaces, secondary panels, inset border tone — one shade darker than canvas to create depth without shadow |
| Ink Black | `#121212` | `--color-ink-black` | Headings, primary action fill, dark card surfaces — near-black that stays slightly warm |
| Heading Charcoal | `#343433` | `--color-heading-charcoal` | Primary text, nav text, decorative strokes — softened black for readable body |
| Body Brown | `#474645` | `--color-body-brown` | Body copy, secondary text — warm desaturated brown rather than cool gray |
| Muted Gray | `#7e7e7d` | `--color-muted-gray` | Helper text, inactive nav, tertiary labels |
| Stone Border | `#e5d5c3` | `--color-stone-border` | Hairline decorative borders on illustrations and shapes |
| Link Blue | `#0086fc` | `--color-link-blue` | Inline links, feature list text — vivid blue that reads as actionable without being a button |
| Sky Blue | `#64c6ff` | `--color-sky-blue` | Illustration fill, decorative mascot accents — sky-bright for storybook characters |
| Alt Blue | `#00b2ff` | `--color-alt-blue` | Secondary illustration fill, icon accents — slightly deeper blue for variation |
| Grass Green | `#00c978` | `--color-grass-green` | Green text accent for links, tags, and emphasized short phrases. Use as a supporting accent, not as a status color |
| Mint | `#00ca48` | `--color-mint` | Green wash for highlight backgrounds, decorative bands, and soft emphasis behind content. Use as a supporting accent, not as a status color |
| Ember Orange | `#ff3e00` | `--color-ember-orange` | Orange text accent for links, tags, and emphasized short phrases |
| Sun Yellow | `#ffcd6c` | `--color-sun-yellow` | Illustration fill, decorative shapes, mascot coloring |
| Gold | `#d48f00` | `--color-gold` | Yellow text accent for links, tags, and emphasized short phrases. |
| Honey | `#ffbb26` | `--color-honey` | Yellow wash for highlight backgrounds, decorative bands, and soft emphasis behind content |
| Coral Pink | `#ff58ae` | `--color-coral-pink` | Purchase badge fill, decorative illustration accent |
| Plum Violet | `#9f4fff` | `--color-plum-violet` | Violet wash for highlight backgrounds, decorative bands, and soft emphasis behind content. Do not promote it to the primary CTA color |
| Alert Red | `#ff2b3a` | `--color-alert-red` | Red wash for highlight backgrounds, decorative bands, and soft emphasis behind content. Use as a supporting accent, not as a status color |

## Tokens — Typography

### Family — Display and hero headings — the custom Family typeface at weight 500, letter-spacing tightening to -0.031em at 68px creates a slightly playful, slightly condensed character that defines the brand · `--font-family`
- **Substitute:** Druk Wide Medium or GT America Compressed Medium
- **Weights:** 500
- **Sizes:** 44px, 68px
- **Line height:** 1.09-1.10
- **Letter spacing:** -0.031em at 68px, -0.020em at 44px
- **Role:** Display and hero headings — the custom Family typeface at weight 500, letter-spacing tightening to -0.031em at 68px creates a slightly playful, slightly condensed character that defines the brand

### Inter — Body copy, nav text, card descriptions — Inter at regular weight carries the utility layer; tighter line-heights (1.42-1.53) for running text, generous (1.58) for caption-level · `--font-inter`
- **Substitute:** Inter (Google Fonts)
- **Weights:** 400
- **Sizes:** 12px, 13px, 14px, 15px, 16px, 17px, 19px, 23px, 44px
- **Line height:** 1.42-1.58
- **Letter spacing:** -0.0260em, -0.0190em, -0.0160em, -0.0130em, -0.0100em, -0.0090em, -0.0060em, -0.0010em
- **Role:** Body copy, nav text, card descriptions — Inter at regular weight carries the utility layer; tighter line-heights (1.42-1.53) for running text, generous (1.58) for caption-level

### Inter — Section subheads and emphasised list labels — Inter medium adds weight without changing the geometric personality · `--font-inter`
- **Substitute:** Inter (Google Fonts)
- **Weights:** 500
- **Sizes:** 12px, 13px, 14px, 15px, 16px, 17px, 19px, 23px, 44px
- **Line height:** 1.09-1.47
- **Letter spacing:** -0.019em at 23px, -0.009em at 15px
- **Role:** Section subheads and emphasised list labels — Inter medium adds weight without changing the geometric personality

### Inter — Button labels and emphasized UI text — semi-bold for interactive elements that need to register as tappable · `--font-inter`
- **Substitute:** Inter (Google Fonts)
- **Weights:** 600
- **Sizes:** 12px, 13px, 14px, 15px, 16px, 17px, 19px, 23px, 44px
- **Line height:** 1.47
- **Letter spacing:** -0.009em
- **Role:** Button labels and emphasized UI text — semi-bold for interactive elements that need to register as tappable

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| micro | 12px | 19 | -0.01px | `--text-micro` |
| caption | 15px | 22 | -0.14px | `--text-caption` |
| body | 17px | 26 | -0.22px | `--text-body` |
| subheading | 19px | 27 | -0.3px | `--text-subheading` |
| heading | 23px | 25 | -0.44px | `--text-heading` |
| heading-lg | 44px | 53 | -0.88px | `--text-heading-lg` |
| display | 68px | 75 | -2.1px | `--text-display` |

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
| 36 | 36px | `--spacing-36` |
| 48 | 48px | `--spacing-48` |
| 60 | 60px | `--spacing-60` |
| 76 | 76px | `--spacing-76` |
| 80 | 80px | `--spacing-80` |
| 92 | 92px | `--spacing-92` |
| 96 | 96px | `--spacing-96` |
| 104 | 104px | `--spacing-104` |

### Border Radius

| Element | Value |
|---------|-------|
| nav | 10px |
| cards | 10px |
| icons | 40px |
| pills | 9999px |
| small | 2px |
| badges | 6px |
| buttons | 32px |
| illustration | 72px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| subtle | `color(display-p3 0.94902 0.941176 0.929412) 0px 0px 0px 1...` | `--shadow-subtle` |
| subtle-2 | `color(display-p3 0.94902 0.941176 0.929412) 0px 0px 0px 0...` | `--shadow-subtle-2` |
| subtle-3 | `rgba(0, 0, 0, 0.04) 0px 0px 0px 1px` | `--shadow-subtle-3` |
| lg | `rgba(0, 0, 0, 0.15) 0px 0px 24px 0px` | `--shadow-lg` |
| sm | `rgba(0, 0, 0, 0.04) 0px 1px 6px 0px, rgba(0, 0, 0, 0.05) ...` | `--shadow-sm` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80-120px
- **Card padding:** 32px
- **Element gap:** 8-12px

## Components

### Hero Illustration Cluster
**Role:** Decorative character/scatter artwork flanking the hero headline

Hand-drawn cartoon mascots (flower, blob, cat, triangle character) with scattered confetti shapes (stars, coins, hearts, gears, leaves). Uses fills from the accent palette (#64c6ff, #ffcd6c, #00c978, #ff3e00, #ff58ae, #e5d5c3) with thin strokes at #343433. Shapes use organic radii of 40-72px. Two clusters flank a centered text block — they do not overlap the type.

### Ghost Nav Button
**Role:** Secondary header action (Log In)

Transparent background, text in #343433, no border, font-size 13-14px Inter 400. Sits flush left of the primary CTA in the top nav.

### Dark Pill Button
**Role:** Primary header CTA (Get Started)

Background #121212, text white, fully rounded (32px radius), horizontal padding 14px, vertical padding sized to content height (roughly 8-11px). Small, dense, high-contrast — the one moment of darkness in the header.

### Sand Pill Button
**Role:** Secondary page CTA (Watch the Video)

Background #f6f4ef (lighter than canvas), text #121212, 32px pill radius, 14px horizontal padding. Pairs beside the dark primary to create tonal contrast.

### Inline Demo Link
**Role:** Feature-card watch-the-demo link

Underlined text link, no border, no background padding beyond 4px vertical. Color is #ff3e00 (ember orange) — this is the brand's signature secondary CTA color, used wherever a 'Watch the demo' or 'Manage your collectibles' link sits beneath a feature card. Border-radius 0 to read as text.

### Feature Card (Hairline-Bordered)
**Role:** Primary card for the 6-feature grid (Easy, Secure, Fast, Powerful, Fun, etc.)

White background (#ffffff), 10px radius, 32px padding on all sides. Border is a 1px inset in #f2f0ed (stone surface) rather than a drop shadow — the card is defined by an interior hairline, giving a pressed-into-paper feel. Cards sit in a 3-column grid with 8-12px gaps. Heading is 23px Inter medium, body is 16-17px Inter 400 in #474645.

### Light Tag Surface
**Role:** Secondary card surface for grouped feature blocks

Background #fbfaf9 (same as canvas) or #fcfbf9, 12px radius, no shadow, horizontal padding ~23px, vertical padding 14px. Used for the 'Watching Wallets' / 'Wallet Activity' demo blocks. Defines surface through subtle warmth shift rather than contrast.

### Dark Feature Card
**Role:** Dark-mode card for the leftmost action card (Send/Swap/Receive/Purchase)

Background #000000, 24px left-only radius (asymmetric), 24px soft drop shadow at rgba(0,0,0,0.15), 4px padding. Houses a stacked list of icon+label rows in white/cream text — the only dark surface on the page, creating strong focal contrast against the cream canvas.

### Action Row (Inside Dark Card)
**Role:** Send / Swap / Receive / Purchase list item

Each row: circular icon in app-brand color (#0090ff, #9f4fff, #00c978, #ff58ae), label in white Inter 500/600, helper text in muted white. Rows separated by 1-2px gaps. The colorful icons are the chromatic punctuation — the rest stays monochrome.

### Status Badge Pill
**Role:** Backing Up / Pending / Completed indicators

Fully rounded pill (9999px radius), background in status hue (mint #00ca48 for backing-up, gold #ffbb26 for pending), text in matching dark or light. Padded ~10-12px horizontal, 6-8px vertical. Sits inside light tag surfaces.

### Tweet Card
**Role:** Social proof card in the 'Friends of Family' grid

White background (#ffffff), 10px radius, 1px inset border in #f2f0ed, 32px padding. Avatar circle 40px, handle in #343433, tweet body in #474645 at 15-16px. X-platform icon top-right. Cards sit in a 4-column grid with horizontal scroll overflow.

### Inset-Bordered Surface
**Role:** Any container that needs subtle definition without shadow

The signature border technique: 1px inset box-shadow in #f2f0ed creates an interior hairline on white surfaces. No drop shadows on cards — the system relies entirely on inset strokes and tonal shifts to separate layers. This is what gives the page its flat, pressed-into-paper quality.

## Do's and Don'ts

### Do
- Use the custom Family typeface at 44-68px weight 500 for all display and hero headings; never substitute system fonts at this scale
- Use 10px radius as the default for cards and nav surfaces; use 32-9999px only for pill buttons and badges
- Build card definition with a 1px inset border in #f2f0ed rather than a drop shadow — the page should feel pressed into paper, not floating
- Let #ff3e00 carry the 'demo link' and accent text role; keep ember orange for inline links and feature callouts, never as a filled button
- Set body text in Inter 400 at 16-17px with line-height 1.42-1.53 and letter-spacing -0.013 to -0.016em
- Use the cream canvas (#fbfaf9) as the base for every full-bleed section; alternate by introducing the #f2f0ed stone surface for grouped card clusters
- Use illustration clusters of cartoon mascots in primary fills to anchor hero sections; scatter them asymmetrically so the centered text remains the focal point

### Don't
- Never use a drop shadow larger than rgba(0,0,0,0.04) — the design system rejects heavy elevation
- Don't use blue (#0086fc) as a filled CTA background; blue is reserved for inline links and list emphasis text
- Don't introduce gradients — the system is strictly flat with hairline inset borders
- Don't use Inter at the display sizes — display and hero headings must use the Family typeface at weight 500
- Don't separate surfaces with white-on-white; always shift toward #f2f0ed stone or toward #121212 black for clear contrast
- Don't add decoration to pill buttons — dark pill (#121212) and sand pill (#f6f4ef) are the only two pill variants
- Don't use warm reds (#ff2b3a) for anything beyond destructive/error states; the warm accent slot belongs to #ff3e00

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas | `#fbfaf9` | Page background, hero backdrop — warm cream that reads as paper |
| 1 | Stone | `#f2f0ed` | Inset border tone, secondary card surfaces, subtle surface shifts |
| 2 | Sand | `#f6f4ef` | Pill button secondary variant, light tag surfaces for demo blocks |
| 3 | Pure White | `#ffffff` | Feature cards, tweet cards — only on white does the 1px inset hairline register |
| 4 | Dark Surface | `#121212` | Dark pill buttons, primary CTA — the only dark surface in the system |
| 5 | Full Black | `#000000` | Dark feature card (Send/Swap stack), shadow base — strongest tonal shift available |

## Elevation

- **Feature Card:** `inset 0 0 0 1px #f2f0ed`
- **Dark Feature Card:** `0 0 24px 0 rgba(0,0,0,0.15)`
- **Subtle Drop on Cards:** `0 1px 6px 0 rgba(0,0,0,0.04), 0 0 24px 0 rgba(0,0,0,0.05)`

## Imagery

Illustration is the primary visual language: hand-drawn cartoon mascots (flower with square face, smiling green blob, yellow triangle character, orange cloud, cat) with dot eyes and stick limbs, rendered in flat fills from the accent palette (sky blue #64c6ff, sun yellow #ffcd6c, grass green #00c978, ember orange #ff3e00, coral pink #ff58ae). Scattered confetti shapes (coins, stars, hearts, gears, leaves, lock icons, QR markers) fill the negative space around them. All illustration strokes are #343433 at thin weight. Mascots use generous organic radii (40-72px). The illustrations are full-bleed on the left and right of the hero, then appear as smaller accents inside cards throughout the rest of the page. Photography is absent; phone mockups in the lower section show dark iOS UI screenshots. Icon style is solid filled circles in saturated brand colors, mono-weight.

## Layout

Full-width centered layout with max-width ~1200px for content. Hero is a three-column composition: left illustration cluster, centered headline+subtitle+CTA stack, right illustration cluster — all on the cream canvas. Below the hero, content flows in vertical bands separated by generous whitespace (80-120px section gaps). The 'Explore Ethereum' section uses a 3-column card grid with the dark Send/Swap/Receive card as left-column visual anchor, followed by a second row of three lighter feature cards. A second 3-column grid below shows phone mockups. The 'Friends of Family' section is a horizontally-scrolling 4-column tweet card grid. Navigation is a minimal top bar with logo left, center links, and two pill buttons (ghost + dark) right-aligned — no sidebar, no mega-menu. The overall rhythm alternates quiet centered-text sections with colorful illustration-rich sections.

## Agent Prompt Guide

Quick Color Reference:
- text: #343433 (heading), #474645 (body)
- background: #fbfaf9 (canvas)
- border: inset 1px #f2f0ed
- accent (links/demo): #ff3e00
- accent (features): #0086fc
- primary action: #121212 (filled action)

3-5 Example Component Prompts:
1. Create a Primary Action Button: #121212 background, #fbfaf9 text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.

2. Create a feature card grid (3 columns): white cards (#ffffff), 10px radius, 1px inset border #f2f0ed, 32px padding all sides. Heading at 23px Inter 500, #343433. Body at 16px Inter 400, #474645. 8-12px gap between cards. Underneath each card, an ember-orange (#ff3e00) inline 'Watch the demo' link with underline.

3. Create a dark feature card: background #000000, 24px left-radius (asymmetric), 24px soft shadow at rgba(0,0,0,0.15). Inside, stacked rows each with a 40px circular icon (colors #0090ff, #9f4fff, #00ca48, #ff58ae), label in white Inter 600, helper text in rgba(255,255,255,0.6) at 13px.

4. Create a status badge pill: fully rounded (9999px radius), background #00ca48 (mint) or #ffbb26 (honey), text in #121212 or #ffffff depending on contrast, 10-12px horizontal padding, 6-8px vertical padding. Sits inside a #fcfbf9 light surface with 12px radius.

5. Create a tweet card: white (#ffffff) background, 10px radius, 1px inset border #f2f0ed, 32px padding. 40px circular avatar, handle in #343433 at 15px Inter 600, body in #474645 at 15px Inter 400. X-platform icon in top-right corner. 3-4 cards per row with horizontal scroll.

## Similar Brands

- **Phantom (crypto wallet)** — Same storybook illustration style with cartoon mascots on a light canvas, playful tone with utility-grade Inter typography
- **Rainbow Wallet** — Similar cream-toned palette with playful illustrated characters and restrained typography for a crypto audience
- **Stripe** — Same hairline-bordered card aesthetic, inset 1px borders instead of shadows, generous whitespace and quiet interface chrome
- **Linear** — Same restrained typography hierarchy with custom display face over Inter body, minimal-elevation card system with deliberate restraint
- **Coinbase** — Same approach of using saturated brand colors as small accents against an otherwise quiet, near-monochrome interface

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-cream-canvas: #fbfaf9;
  --color-stone-surface: #f2f0ed;
  --color-ink-black: #121212;
  --color-heading-charcoal: #343433;
  --color-body-brown: #474645;
  --color-muted-gray: #7e7e7d;
  --color-stone-border: #e5d5c3;
  --color-link-blue: #0086fc;
  --color-sky-blue: #64c6ff;
  --color-alt-blue: #00b2ff;
  --color-grass-green: #00c978;
  --color-mint: #00ca48;
  --color-ember-orange: #ff3e00;
  --color-sun-yellow: #ffcd6c;
  --color-gold: #d48f00;
  --color-honey: #ffbb26;
  --color-coral-pink: #ff58ae;
  --color-plum-violet: #9f4fff;
  --color-alert-red: #ff2b3a;

  /* Typography — Font Families */
  --font-family: 'Family', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-micro: 12px;
  --leading-micro: 19;
  --tracking-micro: -0.01px;
  --text-caption: 15px;
  --leading-caption: 22;
  --tracking-caption: -0.14px;
  --text-body: 17px;
  --leading-body: 26;
  --tracking-body: -0.22px;
  --text-subheading: 19px;
  --leading-subheading: 27;
  --tracking-subheading: -0.3px;
  --text-heading: 23px;
  --leading-heading: 25;
  --tracking-heading: -0.44px;
  --text-heading-lg: 44px;
  --leading-heading-lg: 53;
  --tracking-heading-lg: -0.88px;
  --text-display: 68px;
  --leading-display: 75;
  --tracking-display: -2.1px;

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
  --spacing-28: 28px;
  --spacing-32: 32px;
  --spacing-36: 36px;
  --spacing-48: 48px;
  --spacing-60: 60px;
  --spacing-76: 76px;
  --spacing-80: 80px;
  --spacing-92: 92px;
  --spacing-96: 96px;
  --spacing-104: 104px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80-120px;
  --card-padding: 32px;
  --element-gap: 8-12px;

  /* Border Radius */
  --radius-sm: 2px;
  --radius-md: 6px;
  --radius-lg: 10px;
  --radius-2xl: 17px;
  --radius-3xl: 24px;
  --radius-3xl-2: 32px;
  --radius-3xl-3: 40px;
  --radius-full: 72px;
  --radius-full-2: 9999px;

  /* Named Radii */
  --radius-nav: 10px;
  --radius-cards: 10px;
  --radius-icons: 40px;
  --radius-pills: 9999px;
  --radius-small: 2px;
  --radius-badges: 6px;
  --radius-buttons: 32px;
  --radius-illustration: 72px;

  /* Shadows */
  --shadow-subtle: color(display-p3 0.94902 0.941176 0.929412) 0px 0px 0px 1px inset;
  --shadow-subtle-2: color(display-p3 0.94902 0.941176 0.929412) 0px 0px 0px 0px inset;
  --shadow-subtle-3: rgba(0, 0, 0, 0.04) 0px 0px 0px 1px;
  --shadow-lg: rgba(0, 0, 0, 0.15) 0px 0px 24px 0px;
  --shadow-sm: rgba(0, 0, 0, 0.04) 0px 1px 6px 0px, rgba(0, 0, 0, 0.05) 0px 0px 24px 0px;

  /* Surfaces */
  --surface-canvas: #fbfaf9;
  --surface-stone: #f2f0ed;
  --surface-sand: #f6f4ef;
  --surface-pure-white: #ffffff;
  --surface-dark-surface: #121212;
  --surface-full-black: #000000;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-cream-canvas: #fbfaf9;
  --color-stone-surface: #f2f0ed;
  --color-ink-black: #121212;
  --color-heading-charcoal: #343433;
  --color-body-brown: #474645;
  --color-muted-gray: #7e7e7d;
  --color-stone-border: #e5d5c3;
  --color-link-blue: #0086fc;
  --color-sky-blue: #64c6ff;
  --color-alt-blue: #00b2ff;
  --color-grass-green: #00c978;
  --color-mint: #00ca48;
  --color-ember-orange: #ff3e00;
  --color-sun-yellow: #ffcd6c;
  --color-gold: #d48f00;
  --color-honey: #ffbb26;
  --color-coral-pink: #ff58ae;
  --color-plum-violet: #9f4fff;
  --color-alert-red: #ff2b3a;

  /* Typography */
  --font-family: 'Family', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-micro: 12px;
  --leading-micro: 19;
  --tracking-micro: -0.01px;
  --text-caption: 15px;
  --leading-caption: 22;
  --tracking-caption: -0.14px;
  --text-body: 17px;
  --leading-body: 26;
  --tracking-body: -0.22px;
  --text-subheading: 19px;
  --leading-subheading: 27;
  --tracking-subheading: -0.3px;
  --text-heading: 23px;
  --leading-heading: 25;
  --tracking-heading: -0.44px;
  --text-heading-lg: 44px;
  --leading-heading-lg: 53;
  --tracking-heading-lg: -0.88px;
  --text-display: 68px;
  --leading-display: 75;
  --tracking-display: -2.1px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-28: 28px;
  --spacing-32: 32px;
  --spacing-36: 36px;
  --spacing-48: 48px;
  --spacing-60: 60px;
  --spacing-76: 76px;
  --spacing-80: 80px;
  --spacing-92: 92px;
  --spacing-96: 96px;
  --spacing-104: 104px;

  /* Border Radius */
  --radius-sm: 2px;
  --radius-md: 6px;
  --radius-lg: 10px;
  --radius-2xl: 17px;
  --radius-3xl: 24px;
  --radius-3xl-2: 32px;
  --radius-3xl-3: 40px;
  --radius-full: 72px;
  --radius-full-2: 9999px;

  /* Shadows */
  --shadow-subtle: color(display-p3 0.94902 0.941176 0.929412) 0px 0px 0px 1px inset;
  --shadow-subtle-2: color(display-p3 0.94902 0.941176 0.929412) 0px 0px 0px 0px inset;
  --shadow-subtle-3: rgba(0, 0, 0, 0.04) 0px 0px 0px 1px;
  --shadow-lg: rgba(0, 0, 0, 0.15) 0px 0px 24px 0px;
  --shadow-sm: rgba(0, 0, 0, 0.04) 0px 1px 6px 0px, rgba(0, 0, 0, 0.05) 0px 0px 24px 0px;
}
```
