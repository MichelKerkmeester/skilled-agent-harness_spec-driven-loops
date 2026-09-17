# ExpressVPN — Style Reference
> Fortress garden at dawn. A bright, spacious canopy of teal and ivory where dark navy anchors signal weight and warmth.

**Theme:** light

ExpressVPN presents a light, spacious privacy interface that balances authority with approachability. The visual system pairs a deep midnight navy (#001d2f) for typography and structural borders with a warm forest teal (#0f866c) as the single decisive action color, creating a trust-through-restraint palette where chromatic color only appears as functional punctuation. Surfaces stay bright and flat with generous breathing room, and diffuse shadows on cards produce a gentle floating quality rather than hard elevation. The type system splits between a proprietary display face (FS Kim) for confident serif-leaning headlines and Inter for the entire UI vocabulary, producing a restrained tone: rounded cards in the 20–34px range, deeply pill-shaped CTAs, and soft pastel accent panels (peach, sand, mint) that occasionally surface warmth without disrupting the overall cool, protective mood.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Midnight Navy | `#001d2f` | `--color-midnight-navy` | Primary text, structural borders, heading strokes, nav separators, footer text — near-black with a cool cast gives authority without harshness |
| Soft Canvas | `#f7f8f9` | `--color-soft-canvas` | Page background, muted section bands, secondary card surfaces |
| Pure White | `#ffffff` | `--color-pure-white` | Card surfaces, nav background, button text on dark fills, product mockup backings |
| Hairline Gray | `#ccd2d5` | `--color-hairline-gray` | List dividers, hairline borders, subtle separators |
| Silver Edge | `#dcdcdc` | `--color-silver-edge` | Secondary borders and dividers |
| Steel Caption | `#adadad` | `--color-steel-caption` | Badge borders, neutral fills, muted borders |
| Slate Body | `#667782` | `--color-slate-body` | Secondary body text, muted helper copy, desaturated icon fills |
| Ink Black | `#000000` | `--color-ink-black` | Button borders, icon fills, high-contrast text accents |
| Forest Teal | `#0f866c` | `--color-forest-teal` | Primary action buttons, filled CTAs, active link color, brand emphasis — the single chromatic decision color; warm emerald reads as secure and confident without aggression |
| Deep Teal | `#00695c` | `--color-deep-teal` | Teal outline accent for tags, dividers, and focused UI edges. Do not promote it to the primary CTA color |
| Peach Cream | `#ffe4d4` | `--color-peach-cream` | Warm accent card surface, soft highlight wash for feature callouts |
| Warm Sand | `#f0eacf` | `--color-warm-sand` | Soft accent surface, nav highlight band, gentle warm wash |
| Pale Mint | `#c3ece8` | `--color-pale-mint` | Light teal surface wash, nav highlight, brand-tinted decorative panel |
| Sea Mist | `#b7d1d0` | `--color-sea-mist` | Card stroke accent, decorative outline on teal-themed cards |
| Brand Red | `radial-gradient(circle, rgb(218, 57, 64) 0px, rgb(176, 39, 45) 100%)` | `--color-brand-red` | ExpressVPN logo radial gradient stop — the red shield emblem |
| Deep Red | `#b0272d` | `--color-deep-red` | Outer stop of the brand logo radial gradient |
| Twilight Navy | `linear-gradient(261deg, rgb(12, 57, 86) 21.96%, rgb(0, 24, 39) 82.57%)` | `--color-twilight-navy` | Inner stop of the dark hero gradient band |

## Tokens — Typography

### Inter — Universal UI and body face — every navigation label, button, form field, list item, caption, and paragraph runs in Inter. Weight 500–600 is the workhorse for buttons and nav; weight 400 for body. 10–12px uppercase labels (trustee badges, guarantee copy) use generous 0.10–0.14em tracking for an institutional, trustworthy feel. Proportional alternates enabled for tighter number and punctuation fit. · `--font-inter`
- **Weights:** 400, 500, 600, 700
- **Sizes:** 10px, 12px, 14px, 16px, 18px, 20px, 24px
- **Line height:** 1.20, 1.33, 1.44, 1.50, 1.67, 1.72, 1.75, 1.80, 1.83, 1.90, 2.00
- **Letter spacing:** 0.10em–0.14em for uppercase 10–14px labels; default 0 for body
- **OpenType features:** `"palt"`
- **Role:** Universal UI and body face — every navigation label, button, form field, list item, caption, and paragraph runs in Inter. Weight 500–600 is the workhorse for buttons and nav; weight 400 for body. 10–12px uppercase labels (trustee badges, guarantee copy) use generous 0.10–0.14em tracking for an institutional, trustworthy feel. Proportional alternates enabled for tighter number and punctuation fit.

### FS Kim — Display and headline face — proprietary serif-influenced typeface carries the brand voice in the hero ('World's #1 VPN'), section titles, and large numerical pricing callouts. Tight -0.016em tracking at 46–64px tightens the silhouette and signals premium quality. Use a humanist serif like 'Source Serif Pro' or 'Tiempos Headline' as substitute. · `--font-fs-kim`
- **Substitute:** Source Serif Pro
- **Weights:** 500, 700
- **Sizes:** 18px, 32px, 46px, 64px
- **Line height:** 1.00, 1.09, 1.25
- **Letter spacing:** -0.016em at 32–64px
- **OpenType features:** `"palt"`
- **Role:** Display and headline face — proprietary serif-influenced typeface carries the brand voice in the hero ('World's #1 VPN'), section titles, and large numerical pricing callouts. Tight -0.016em tracking at 46–64px tightens the silhouette and signals premium quality. Use a humanist serif like 'Source Serif Pro' or 'Tiempos Headline' as substitute.

### Arial — Arial — detected in extracted data but not described by AI · `--font-arial`
- **Weights:** 400, 700
- **Sizes:** 13px, 18px
- **Line height:** 1.2, 1.45
- **Role:** Arial — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 10px | 1.8 | 1.4px | `--text-caption` |
| badge | 12px | 1.2 | 1.32px | `--text-badge` |
| body-sm | 14px | 1.72 | — | `--text-body-sm` |
| body | 16px | 1.5 | — | `--text-body` |
| subheading | 20px | 1.44 | — | `--text-subheading` |
| heading-sm | 24px | 1.33 | — | `--text-heading-sm` |
| heading | 32px | 1.25 | -0.51px | `--text-heading` |
| display | 64px | 1.09 | -1.02px | `--text-display` |

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
| 32 | 32px | `--spacing-32` |
| 40 | 40px | `--spacing-40` |
| 44 | 44px | `--spacing-44` |
| 64 | 64px | `--spacing-64` |
| 96 | 96px | `--spacing-96` |
| 100 | 100px | `--spacing-100` |
| 104 | 104px | `--spacing-104` |
| 196 | 196px | `--spacing-196` |
| 200 | 200px | `--spacing-200` |

### Border Radius

| Element | Value |
|---------|-------|
| nav | 4px |
| cards | 24px |
| badges | 24px |
| buttons | 10px |
| largeCards | 34px |
| pillButtons | 9999px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| xl | `rgba(0, 0, 0, 0.12) 0px 0px 32px 0px` | `--shadow-xl` |
| md | `rgba(0, 0, 0, 0.1) 0px 0px 15px 0px` | `--shadow-md` |
| md-2 | `rgba(0, 0, 0, 0.12) 0px 4px 16px 0px` | `--shadow-md-2` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 64-80px
- **Card padding:** 32px
- **Element gap:** 24px

## Components

### Promo Top Banner
**Role:** Sitewide announcement strip

Full-bleed Forest Teal (#0f866c) background, white text at 14px Inter weight 500, horizontal padding 24px, vertically centered. Right-aligned CTA link in white with underline. No rounded corners. Optional illustration anchored left.

### Primary Navigation Bar
**Role:** Top-level site navigation

White (#ffffff) background, 64px height. Left: ExpressVPN wordmark with red radial-gradient shield icon. Center: Inter 14–16px weight 500 nav links in Midnight Navy (#001d2f), 10–24px horizontal spacing. Right: pill-shaped 'Get Started' ghost button — 1px Midnight Navy border, 10px radius, 14px 24px padding, 9999px alternate variant for primary CTA contexts. Globe icon for language switcher.

### Ghost Pill CTA
**Role:** Secondary action button

Forest Teal (#0f866c) 1px border, white fill, Midnight Navy text 14px Inter weight 600, 9999px radius (pill), 10px 24px padding, 13px line-height. Used for 'Get Started' and non-purchase actions.

### Filled Pill CTA
**Role:** Primary purchase action

Forest Teal (#0f866c) background, white text 14–16px Inter weight 600, 9999px radius, 14px 32px padding. The hero 'Get the Deal Now' button is the canonical example — the only place a solid teal fill should appear. Right-arrow icon adjacent to label.

### Hero Headline Block
**Role:** Landing hero copy

Centered, 64px FS Kim weight 700 in Midnight Navy, line-height 1.09, -0.016em tracking. Subhead in 20px Inter weight 400, Slate Body (#667782). Price emphasis uses Forest Teal inline highlight: '$2.79/mo' in teal against the navy headline.

### Trust Badge Row
**Role:** Social proof strip

Horizontal row of trust signals — App Store and Google Play star ratings (4.6+), CNET badge, review counts in 12px Inter weight 500 Slate Body. Optional gold star icons. Centered below hero with 16–24px vertical gap from CTA.

### Product Feature Card
**Role:** Feature illustration card (Time Protected, App Shortcuts, etc.)

White (#ffffff) surface, 24px radius, 32px padding, diffuse shadow rgba(0,0,0,0.12) 0 0 32px. 20px Inter weight 600 title in Midnight Navy, 14px Inter weight 400 Slate Body description. Mini chart or numeric figure (24px, weight 600) as data anchor. Cards arrange in a row of 4–5 overlapping the central phone mockup.

### Phone Mockup Frame
**Role:** Central product visualization

iPhone frame in pure white, ~340px wide, centered on hero. Screen shows VPN app UI: circular power button (teal), green-tinted connection confirmation, location chip ('Smart Location / Japan – Tokyo'), server stats. Positioned behind floating feature cards via z-index layering.

### Product Family Card
**Role:** Cross-sell product tile (ExpressKeys, ExpressMailGuard, Identity Defender, ExpressAI)

Rounded square icon container (64–80px) in Pale Mint, Sea Mist, or Peach Cream accent fill, 20px radius, paired with product name in 16px Inter weight 600 Midnight Navy and short descriptor. Arranged in a 5-column row with consistent 40px gap. Each icon is a simple 2-color illustration.

### FAQ Accordion Row
**Role:** Expandable question/answer list

Full-width rows, 16px vertical padding, 1px Hairline Gray (#ccd2d5) bottom border. Question text in 18px Inter weight 500 Midnight Navy, chevron icon right-aligned. Expanded body in 16px Inter weight 400 Slate Body, 24px top padding.

### Live Chat Widget
**Role:** Persistent support entry point

Floating bottom-right pill, white background, 34px radius, diffuse shadow rgba(0,0,0,0.12) 0 4px 16px. Red ExpressVPN shield icon at left, two-line copy: 'Need help? Chat with us!' (14px weight 600 Midnight Navy) and 'Online' (12px weight 500 Forest Teal with small green dot indicator).

### Cookie Consent Bar
**Role:** GDPR compliance notice

Fixed bottom bar, white background, 14px Inter body text in Midnight Navy. 'Customize' outlined ghost button (Midnight Navy 1px border, 10px radius) paired with 'Accept' filled teal pill button (Forest Teal fill, white text, 10px radius). 16px horizontal padding on the action cluster.

## Do's and Don'ts

### Do
- Use Forest Teal (#0f866c) as the only filled chromatic action color — never substitute blues, greens, or other hues for primary CTAs.
- Set the primary CTA to a 9999px pill radius and pair it with a right-arrow icon for purchase actions.
- Set display headlines in FS Kim at 46–64px with -0.016em letter-spacing; reserve Inter for everything below 32px.
- Apply diffuse center-anchored shadows (rgba(0,0,0,0.12) 0px 0px 32px 0px) to all cards — never use directional offset drops.
- Use the three soft accent surfaces (Peach Cream #ffe4d4, Warm Sand #f0eacf, Pale Mint #c3ece8) sparingly as decorative washes, not as functional backgrounds.
- Set uppercase trust/guarantee labels in 10–12px Inter with 0.10–0.14em tracking for an institutional, confident voice.
- Keep the canvas at Soft Canvas (#f7f8f9) and only escalate to pure white for cards and product surfaces.

### Don't
- Do not introduce a second chromatic accent color — the system is intentionally monochrome with one decision teal.
- Do not use FS Kim below 18px or for UI controls — it is a display face only.
- Do not use sharp 0–4px radii on cards; the system depends on 20–34px rounding for its soft, protected feel.
- Do not apply heavy directional shadows or saturated glow effects — elevation must remain diffuse and ambient.
- Do not use the red brand gradient outside the logo lockup — red is reserved for the shield emblem.
- Do not place body text below 14px; the 10–12px range is reserved for uppercase tracked labels only.
- Do not invert the teal/white relationship on buttons — teal is always the fill, white the text inside; ghost variants reverse border and text but never invert the fill.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas | `#f7f8f9` | Page-level background, creates a soft off-white field so pure white cards read as lifted |
| 1 | Card | `#ffffff` | Primary card and nav surface; product mockup backing |
| 2 | Accent Wash | `#c3ece8` | Teal-tinted decorative band for nav highlights and brand callouts |
| 3 | Warm Accent | `#ffe4d4` | Peach-tinted card surface for soft feature highlights |

## Elevation

- **Standard Card:** `rgba(0, 0, 0, 0.12) 0px 0px 32px 0px`
- **Subtle Card:** `rgba(0, 0, 0, 0.1) 0px 0px 15px 0px`
- **Badge / Trust Pill:** `rgba(0, 0, 0, 0.12) 0px 4px 16px 0px`

## Imagery

Product visualization dominates over photography. The hero centers on a high-fidelity iPhone mockup of the VPN app with floating data cards (time protected, app shortcuts, transferred bytes) arranged in an overlapping constellation around it. Supporting visuals are flat 2D illustrations of the sister product family — simple two-tone icons in rounded square containers on pastel accent surfaces. No lifestyle photography, no abstract gradients beyond the brand red radial. Iconography throughout is line-and-fill hybrid: the red shield logo is a radial gradient mark, while functional UI icons (chevrons, arrows, globe) are single-color Midnight Navy line icons at 16–20px with 1.5–2px stroke. The visual density is text-and-illustration dominant with photography playing no role in the primary conversion path.

## Layout

Centered, max-width 1200px container with full-bleed section bands. Hero is vertically stacked: promo bar → nav → centered headline (FS Kim 64px) → subhead → filled teal CTA → trust badge row → phone mockup with overlapping feature cards. Below the hero, a 'One subscription. Complete protection.' section uses a single-line product family row of 5 evenly spaced icon+label tiles. FAQ section follows as a full-width centered list with hairline dividers, max-width ~800px. Section rhythm is spacious 64–80px vertical gaps on the off-white canvas. The navigation is a static top bar (not sticky) with a separate floating bottom-right chat widget and a fixed bottom cookie consent bar. No sidebar, no mega-menu — dropdowns reveal on hover with a subtle teal accent surface.

## Agent Prompt Guide

Quick Color Reference:
- background: #f7f8f9 (Soft Canvas)
- surface: #ffffff (Pure White)
- text: #001d2f (Midnight Navy)
- muted text: #667782 (Slate Body)
- border: #ccd2d5 (Hairline Gray)
- primary action: #0f866c (filled action)

3 Example Component Prompts:

1. Hero Headline Block: White background section. Display headline at 64px FS Kim weight 700, #001d2f, line-height 1.09, letter-spacing -1.02px. Inline price highlight '$2.79/mo' in #0f866c. Subhead at 20px Inter weight 400, #667782, line-height 1.44. Center-aligned, max-width 800px.

2. Filled Pill CTA Button: Forest Teal (#0f866c) background, white text, 16px Inter weight 600, 9999px border-radius, 14px vertical and 32px horizontal padding, with a 16px right-arrow icon. Line-height 13px. Used for purchase actions only.

3. Feature Card with Shadow: White (#ffffff) surface, 24px border-radius, 32px padding, shadow rgba(0,0,0,0.12) 0px 0px 32px 0px. Title 20px Inter weight 600 #001d2f. Description 14px Inter weight 400 #667782. 16px gap between title and body. Optional 24px numeric figure in weight 600 Midnight Navy at top.

## Similar Brands

- **NordVPN** — Same light canvas with a single deep brand color (Nord uses deep blue, ExpressVPN uses forest teal) and diffuse card shadows for a trustworthy security-product feel.
- **ProtonVPN** — Light background with restrained chromatic palette, pill-shaped CTAs, and generous spacing create the same calm, privacy-focused atmosphere.
- **1Password** — Light SaaS surface with rounded 20–24px cards, diffuse ambient shadows, and a single decisive accent color on primary actions.
- **DuckDuckGo** — Bright, spacious, near-monochrome interface that uses a single warm accent for actions; both prioritize trust through visual restraint over spectacle.
- **Notion** — Centered max-width hero with a single display headline, pill-shaped buttons, and hairline-gray dividers structuring long content pages.

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-midnight-navy: #001d2f;
  --color-soft-canvas: #f7f8f9;
  --color-pure-white: #ffffff;
  --color-hairline-gray: #ccd2d5;
  --color-silver-edge: #dcdcdc;
  --color-steel-caption: #adadad;
  --color-slate-body: #667782;
  --color-ink-black: #000000;
  --color-forest-teal: #0f866c;
  --color-deep-teal: #00695c;
  --color-peach-cream: #ffe4d4;
  --color-warm-sand: #f0eacf;
  --color-pale-mint: #c3ece8;
  --color-sea-mist: #b7d1d0;
  --color-brand-red: #da3940;
  --gradient-brand-red: radial-gradient(circle, rgb(218, 57, 64) 0px, rgb(176, 39, 45) 100%);
  --color-deep-red: #b0272d;
  --color-twilight-navy: #0c3956;
  --gradient-twilight-navy: linear-gradient(261deg, rgb(12, 57, 86) 21.96%, rgb(0, 24, 39) 82.57%);

  /* Typography — Font Families */
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-fs-kim: 'FS Kim', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-arial: 'Arial', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.8;
  --tracking-caption: 1.4px;
  --text-badge: 12px;
  --leading-badge: 1.2;
  --tracking-badge: 1.32px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.72;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-subheading: 20px;
  --leading-subheading: 1.44;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.33;
  --text-heading: 32px;
  --leading-heading: 1.25;
  --tracking-heading: -0.51px;
  --text-display: 64px;
  --leading-display: 1.09;
  --tracking-display: -1.02px;

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
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-44: 44px;
  --spacing-64: 64px;
  --spacing-96: 96px;
  --spacing-100: 100px;
  --spacing-104: 104px;
  --spacing-196: 196px;
  --spacing-200: 200px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 64-80px;
  --card-padding: 32px;
  --element-gap: 24px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 10px;
  --radius-2xl: 20px;
  --radius-3xl: 24px;
  --radius-3xl-2: 34px;
  --radius-full: 1132.2px;

  /* Named Radii */
  --radius-nav: 4px;
  --radius-cards: 24px;
  --radius-badges: 24px;
  --radius-buttons: 10px;
  --radius-largecards: 34px;
  --radius-pillbuttons: 9999px;

  /* Shadows */
  --shadow-xl: rgba(0, 0, 0, 0.12) 0px 0px 32px 0px;
  --shadow-md: rgba(0, 0, 0, 0.1) 0px 0px 15px 0px;
  --shadow-md-2: rgba(0, 0, 0, 0.12) 0px 4px 16px 0px;

  /* Surfaces */
  --surface-canvas: #f7f8f9;
  --surface-card: #ffffff;
  --surface-accent-wash: #c3ece8;
  --surface-warm-accent: #ffe4d4;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-midnight-navy: #001d2f;
  --color-soft-canvas: #f7f8f9;
  --color-pure-white: #ffffff;
  --color-hairline-gray: #ccd2d5;
  --color-silver-edge: #dcdcdc;
  --color-steel-caption: #adadad;
  --color-slate-body: #667782;
  --color-ink-black: #000000;
  --color-forest-teal: #0f866c;
  --color-deep-teal: #00695c;
  --color-peach-cream: #ffe4d4;
  --color-warm-sand: #f0eacf;
  --color-pale-mint: #c3ece8;
  --color-sea-mist: #b7d1d0;
  --color-brand-red: #da3940;
  --color-deep-red: #b0272d;
  --color-twilight-navy: #0c3956;

  /* Typography */
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-fs-kim: 'FS Kim', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-arial: 'Arial', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.8;
  --tracking-caption: 1.4px;
  --text-badge: 12px;
  --leading-badge: 1.2;
  --tracking-badge: 1.32px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.72;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-subheading: 20px;
  --leading-subheading: 1.44;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.33;
  --text-heading: 32px;
  --leading-heading: 1.25;
  --tracking-heading: -0.51px;
  --text-display: 64px;
  --leading-display: 1.09;
  --tracking-display: -1.02px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-44: 44px;
  --spacing-64: 64px;
  --spacing-96: 96px;
  --spacing-100: 100px;
  --spacing-104: 104px;
  --spacing-196: 196px;
  --spacing-200: 200px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 10px;
  --radius-2xl: 20px;
  --radius-3xl: 24px;
  --radius-3xl-2: 34px;
  --radius-full: 1132.2px;

  /* Shadows */
  --shadow-xl: rgba(0, 0, 0, 0.12) 0px 0px 32px 0px;
  --shadow-md: rgba(0, 0, 0, 0.1) 0px 0px 15px 0px;
  --shadow-md-2: rgba(0, 0, 0, 0.12) 0px 4px 16px 0px;
}
```
