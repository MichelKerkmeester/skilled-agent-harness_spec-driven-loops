# Supahub — Style Reference
> Soft daylight on a violet ridge. A mostly white, airy canvas lit by a single bright violet sun, with decorative gradient orbs spilling color into negative space and generous rounded geometry giving every surface a friendly, tactile weight.

**Theme:** light

Supahub is a sunlit feedback platform rendered in soft white space punctuated by violet confidence. The system favors a quiet, mostly achromatic canvas where a single vivid violet (#862fe7) carries all primary action weight, then lets decorative lavender, pink, and amber gradient orbs burst through hero and feature sections to dramatize product surfaces. Typography is a Bricolage Grotesque / Inter pairing: the geometric variable display face does the emotional heavy lifting at 48–56px with tight -0.025em tracking, while Inter handles dense UI, captions, and supporting copy in compact 14–16px weights. Components sit on a generous spacing rhythm with two dominant radii — 12px for buttons and small surfaces, and 9999px (pill) for avatars, tags, and decorative badges — producing a friendly, rounded, approachable product surface rather than an enterprise grid. The overall feeling is a modern SaaS product page that borrows energy from the consumer-app playbook: floating product mockups, gradient atmospheres, and testimonial walls treated as content wallpaper, never as filler.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Voltage Violet | `#862fe7` | `--color-voltage-violet` | Primary filled action buttons, active nav state, key accent text — the single saturated brand anchor against the white canvas |
| Ultra Violet | `#5f259e` | `--color-ultra-violet` | Deeper violet for gradient stop, hover state, or emphasis text where Voltage Violet feels too bright |
| Lavender Mist | `#ad6df4` | `--color-lavender-mist` | Soft decorative violet for card backgrounds, icon tints, and gradient mid-stops |
| Orchid Wash | `#bd8ff0` | `--color-orchid-wash` | Lightest decorative violet wash for large surface fills behind product cards and feature bands |
| Magenta Spark | `#ff5fe4` | `--color-magenta-spark` | Pink wash for highlight backgrounds, decorative bands, and soft emphasis behind content. Do not promote it to the primary CTA color |
| Hot Pink Ray | `#e22ba4` | `--color-hot-pink-ray` | Saturated pink gradient stop paired with violet in atmospheric gradient orbs |
| Amber Pulse | `#dc5f05` | `--color-amber-pulse` | Warm orange accent in gradient orbs providing chromatic counterpoint to the violet/pink palette |
| Midnight Ink | `#111827` | `--color-midnight-ink` | Primary heading and body text, primary border, and filled dark action background (the dark CTA variant) |
| Graphite | `#3f4654` | `--color-graphite` | Secondary text, nav borders, muted UI text on white surfaces |
| Slate | `#6b7589` | `--color-slate` | Tertiary text, icon fills, helper copy, and supporting metadata |
| Pure White | `#ffffff` | `--color-pure-white` | Primary card and surface background, button text on filled violet actions, inverted text |
| Fog | `#f1f5f9` | `--color-fog` | Alternate section background, subtle surface lift above white |
| Mist | `#d8e0ea` | `--color-mist` | Hairline borders, input borders, button focus rings, subtle dividers |
| Mint Wash | `#d6fcf4` | `--color-mint-wash` | Soft mint tint for highlighted feature panels and tag/badge backgrounds — appears as a chromatic counterpoint to violet |
| Lavender Field | `#ebdafd` | `--color-lavender-field` | Violet wash for highlight backgrounds, decorative bands, and soft emphasis behind content. Do not promote it to the primary CTA color |

## Tokens — Typography

### Bricolage Grotesque — Display and heading face. Variable custom sans with subtle character (slightly condensed, soft terminals) used for hero headlines at 48–56px, section headlines at 32px, and emphasized subheadings. The tight -0.025em tracking at large sizes is signature — it pulls the wide geometric forms into a dense, confident block. Weights stay conservative: 400 for body-class copy in display contexts, 600 only when emphasis is needed. · `--font-bricolage-grotesque`
- **Substitute:** Space Grotesk
- **Weights:** 400, 600
- **Sizes:** 16px, 20px, 22px, 24px, 32px, 48px, 56px
- **Line height:** 1.20 – 1.75
- **Letter spacing:** -0.025em
- **Role:** Display and heading face. Variable custom sans with subtle character (slightly condensed, soft terminals) used for hero headlines at 48–56px, section headlines at 32px, and emphasized subheadings. The tight -0.025em tracking at large sizes is signature — it pulls the wide geometric forms into a dense, confident block. Weights stay conservative: 400 for body-class copy in display contexts, 600 only when emphasis is needed.

### Inter — Workhorse UI and body face. Used for nav, buttons, body copy, captions, and all dense interface text. Letter-spacing opens to +0.1em at 12px for uppercase labels (eyebrows like 'TESTIMONIAL', 'CUSTOMER FEEDBACK'). Carries the readability weight of the system; Bricolage never appears below 20px. · `--font-inter`
- **Substitute:** Inter (native)
- **Weights:** 400, 500, 600, 700
- **Sizes:** 12px, 14px, 16px, 18px, 20px
- **Line height:** 1.33 – 1.80
- **Letter spacing:** 0.1000em
- **Role:** Workhorse UI and body face. Used for nav, buttons, body copy, captions, and all dense interface text. Letter-spacing opens to +0.1em at 12px for uppercase labels (eyebrows like 'TESTIMONIAL', 'CUSTOMER FEEDBACK'). Carries the readability weight of the system; Bricolage never appears below 20px.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.5 | 1.2px | `--text-caption` |
| body-sm | 14px | 1.6 | — | `--text-body-sm` |
| body | 16px | 1.75 | — | `--text-body` |
| subheading | 20px | 1.5 | — | `--text-subheading` |
| heading-sm | 24px | 1.3 | -0.6px | `--text-heading-sm` |
| heading | 32px | 1.2 | -0.8px | `--text-heading` |
| display | 56px | 1 | -1.4px | `--text-display` |

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
| 48 | 48px | `--spacing-48` |
| 64 | 64px | `--spacing-64` |
| 80 | 80px | `--spacing-80` |
| 96 | 96px | `--spacing-96` |
| 112 | 112px | `--spacing-112` |
| 128 | 128px | `--spacing-128` |
| 240 | 240px | `--spacing-240` |

### Border Radius

| Element | Value |
|---------|-------|
| nav | 8px |
| cards | 24px |
| pills | 9999px |
| images | 16px |
| buttons | 12px |
| featured-card | 40px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| subtle | `rgba(11, 61, 121, 0.16) 0px 0px 0px 1px inset` | `--shadow-subtle` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 24px
- **Element gap:** 16px

## Components

### Primary Filled Button
**Role:** Main conversion action (Sign up, Get started)

Filled #862fe7 background, white text, 12px radius, 16px vertical / 24px horizontal padding, Inter 16px weight 600. Optional icon (sparkle/arrow) in white at 16px sits to the left of the label with 8px gap. Subtle inset ring rgba(11,61,121,0.16) 0 0 0 1px provides edge definition on bright displays.

### Dark Filled Button
**Role:** Secondary conversion action in lighter sections (Explore feedback boards)

Filled #111827 background, white text, 12px radius, 16px / 24px padding, Inter 16px weight 600. Right arrow icon at 16px in white. Used as the dark counterpart to the violet primary.

### Ghost / Outlined Button
**Role:** Secondary action (See Supahub Demo)

Transparent background, #111827 border 1px, #111827 text, 12px radius, 16px / 24px padding, Inter 16px weight 500. Hovers to faint #f1f5f9 fill.

### Nav Link
**Role:** Top navigation items (Features, Demo, Pricing, Changelog, Blog)

Inter 15–16px weight 500, #111827 text, no underline, 8px horizontal padding. Active or hover state shifts to #862fe7. Logo sits left: violet sparkle icon + 'Supahub' wordmark in Inter 600.

### Primary Nav CTA Button
**Role:** Header Sign up for free

Filled #862fe7, white text, 12px radius, 10px / 20px padding (compact for header), Inter 15px weight 600.

### Testimonial Card
**Role:** Wall of Love masonry cards and 3-up feature testimonials

White background, 1px #d8e0ea or #e5e7eb border, 16–24px radius, 24px padding, subtle lift via minimal shadow or no shadow. Avatar 9999px (circle) at 48px, name in Inter 16px weight 600, handle in #6b7589 Inter 14px, quote in Inter 15–16px weight 400 #111827. Quote uses a ✕ close icon at 16px in #d8e0ea top-right.

### Product Preview Card
**Role:** Floating UI mockups (Feedback Portal, Changelog, Roadmap windows)

White surface, 16px radius, deep soft shadow, macOS-style traffic-light dots top-left (red/yellow/green at 10px circles with 4px gap), lavender gradient orbs behind. Internal content uses Inter 12–16px, section headers uppercase tracked +0.1em. The 'card' is both a product screenshot and a design element.

### Feature Section Panel
**Role:** Tinted background bands (Public Feedback Portal / Your feedback hub, your way)

#ebdafd lavender background, no border, full-width band. Headline in Bricolage Grotesque 48px weight 600 #111827, eyebrow in Inter 12px weight 700 tracked +0.1em uppercase #111827. Dark filled CTA button right-aligned in supporting text column.

### Avatar Stack
**Role:** Social proof under hero CTAs

Four 40px circular avatars (9999px radius) in overlapping row with -12px margin, 2px white border ring. Next text 'loved by 300+ customers' Inter 14px weight 500 #111827, preceded by five gold star icons.

### Star Rating Row
**Role:** Testimonial and social proof rating display

Five solid gold/amber #f59e0b stars at 14px in horizontal row with 2px gap, followed by Inter 14px weight 500 supporting text in #6b7589.

### Section Eyebrow Label
**Role:** Pre-headline category tag (CUSTOMER FEEDBACK & FEATURE REQUEST TOOL, TESTIMONIAL, PUBLIC FEEDBACK PORTAL)

Inter 12px weight 700, letter-spacing +0.1em, uppercase, #862fe7 (for violet accents) or #111827. Centered or left-aligned depending on section, sits 16px above the headline.

### Gradient Orb Backdrop
**Role:** Decorative atmospheric glow behind hero and feature cards

Large soft radial or linear gradient: violet (#862fe7 at 0.2–0.4 opacity), pink (#e22ba4 or #ff5fe4 at 0.3 opacity), or amber (#dc5f05 at 0.4 opacity) bleeding from white to transparent. Positioned behind product mockup cards, creates the 'sunlit' feel without using literal color fills on cards.

### Impact Score Badge
**Role:** Numerical badge inside feedback table rows

Small pill: #1f2534 background, white text, Inter 12px weight 700, 9999px radius, 2px / 8px padding. Displays numbers like 129, 96, 58, 750.

## Do's and Don'ts

### Do
- Use Bricolage Grotesque exclusively for display and headings; switch to Inter at 20px and below — never mix the two faces at the same size
- Set the primary CTA to #862fe7 fill on white backgrounds and #111827 fill on lavender (#ebdafd) sections, never the reverse
- Round buttons at 12px and use 9999px (pill) exclusively for avatars, star ratings, and tag chips — these two radii are the system's signature
- Apply -0.025em letter-spacing to Bricolage Grotesque at 32px and above; the tightened tracking is what makes the display face feel custom
- Anchor every section with an uppercase eyebrow in Inter 12px weight 700 with +0.1em tracking, set 16px above the headline
- Place decorative gradient orbs (violet, pink, amber at 0.2–0.4 opacity) behind floating product mockup cards — never behind text or directly behind CTAs
- Use the 80px section gap as the default vertical rhythm between bands; tighten to 48px only between a section header and its first content block

### Don't
- Don't introduce new sans-serif families — Bricolage Grotesque and Inter are the only two faces permitted
- Don't use #862fe7 on lavender (#ebdafd) backgrounds where it loses contrast — switch to #111827 for actions on tinted sections
- Don't use sharp 4px or 0px radii on primary surfaces; the system is defined by its 12px buttons and pill avatars
- Don't apply Bricolage Grotesque below 20px — its character collapses at small sizes and Inter handles dense UI better
- Don't stack more than three gradient orbs in a single composition; the atmosphere stays airy, never psychedelic
- Don't use the decorative pinks (#ff5fe4, #e22ba4) or amber (#dc5f05) for text, borders, or interactive states — they live only inside gradient orbs and testimonial card highlights
- Don't add heavy drop shadows; the system uses a single inset ring and minimal product-mockup depth — surface differentiation comes from color and border, not elevation

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Pure White Canvas | `#ffffff` | Primary page background and product card surfaces |
| 2 | Fog Alt | `#f1f5f9` | Alternate section background for visual banding |
| 3 | Lavender Field | `#ebdafd` | Full-width feature section background behind secondary CTAs |
| 4 | Mint Highlight | `#d6fcf4` | Accent surface for highlighted callouts, tags, and chromatic feature panels |

## Elevation

The system deliberately avoids drop shadows for surface differentiation. Depth is created through three devices: the inset 1px ring on filled buttons (rgba(11,61,121,0.16) 0 0 0 1px inset), a single soft shadow on floating product preview cards, and color/border contrast between white, fog, and lavender surfaces. Cards do not lift via shadow — they sit on a different surface tone.

## Imagery

Imagery is product-led and decorative. The dominant visual device is the floating product preview card: a white UI mockup (Feedback Portal, Changelog, Roadmap) rendered with macOS traffic-light dots, set against a soft gradient orb backdrop in violet, pink, or amber at 0.2–0.4 opacity. No lifestyle photography appears — instead, the system uses real user avatars (circular, 9999px) and 5-star ratings as social proof wallpaper, and a 'Wall of Love' masonry of tweet-style testimonial cards. Illustration is absent; all warmth comes from gradient atmosphere, rounded geometry, and the Bricolage Grotesque display voice. Icons are minimal: sparkle for the logo, arrow for CTAs, ✕ for testimonial dismissal, star for ratings, and small platform glyphs (Slack, Gmail) inside product cards.

## Layout

The page is a max-width 1200px centered composition with a full-bleed white canvas. The hero is a centered text stack over white — eyebrow, Bricolage Grotesque display headline at 48–56px, supporting paragraph, and a horizontal button row of one filled + one ghost CTA, followed by an avatar stack and star rating. Below the hero, a product preview area shows three overlapping UI cards floating over violet/pink/amber gradient orbs. Section rhythm alternates: white → lavender (#ebdafd) → white, with each band using the 80px vertical gap. Feature sections use a 2-column split (left text, right product mockup) or 3-column testimonial row. The 'Wall of Love' is a masonry-style 4-column grid of testimonial cards on white. Navigation is a single sticky top bar with logo left, links center, and a compact filled violet CTA right. Sections flow seamlessly without dividers — color and whitespace do the separation work.

## Agent Prompt Guide

**Quick Color Reference**
- text: #111827
- background: #ffffff
- border: #d8e0ea
- accent: #862fe7 (violet primary action)
- primary action: #862fe7 (filled action)

**Example Component Prompts**
1. *Hero section*: white #ffffff background, max-width 1200px centered. Eyebrow in Inter 12px weight 700, uppercase, +0.1em letter-spacing, #862fe7, text 'CUSTOMER FEEDBACK & FEATURE REQUEST TOOL'. Headline in Bricolage Grotesque 56px weight 600, #111827, -1.4px letter-spacing. Supporting paragraph in Inter 18px weight 400, #6b7589. Primary CTA: filled #862fe7, white text, 12px radius, 16px/24px padding, Inter 16px weight 600, label 'Sign up for free'. Ghost button: transparent fill, 1px #111827 border, 12px radius, label 'See Supahub Demo'.

2. *Lavender feature section*: full-width #ebdafd background, 80px vertical padding. Two-column layout: left column has eyebrow in Inter 12px weight 700 #111827 uppercase tracked +0.1em ('PUBLIC FEEDBACK PORTAL'), headline in Bricolage Grotesque 48px weight 600 #111827 ('Your feedback hub, your way'). Right column has supporting body in Inter 16px #3f4654 followed by a dark filled #111827 button with white text, 12px radius, 16px/24px padding, label 'Explore feedback boards →'.

3. *Testimonial card (Wall of Love)*: white #ffffff background, 1px #d8e0ea border, 24px radius, 24px padding. Top row: 48px circular avatar (9999px radius), Inter 16px weight 600 #111827 name, Inter 14px #6b7589 handle, ✕ icon 16px #d8e0ea top-right. Body quote in Inter 15px weight 400 #111827. Bottom: five solid #f59e0b stars at 14px.

4. *Floating product preview card*: white #ffffff surface, 16px radius, soft shadow 0 20px 40px rgba(124,58,237,0.15). Top-left: three 10px circles (red #ff5f57, amber #febc20, green #28c840) with 4px gap. Centered section header in Inter 12px weight 700 uppercase +0.1em tracking #862fe7 ('FEEDBACK PORTAL'). Behind the card, a large radial gradient orb in rgba(134,47,231,0.4) bleeding to transparent white.

5. *Social proof avatar stack*: row of four 40px circular avatars (9999px radius) overlapping with -12px margin, each with 2px white border. Right of stack, five 14px solid #f59e0b stars then Inter 14px weight 500 #111827 text 'loved by 300+ customers'.

## Gradient Atmosphere System

Decorative gradient orbs are a signature element, not an afterthought. The system uses three orb recipes that can be composed into a scene:

1. **Violet orb** — radial-gradient(circle at 0px -50%, rgba(255,255,255,0) 15%, rgba(152,26,249,0.4) 38%, rgba(255,255,255,0) 65%) — sits behind left-of-center product cards
2. **Pink orb** — linear-gradient(214deg, rgba(255,255,255,0), rgba(255,52,143,0.3) 25%, rgba(255,255,255,0) 71%) — sits behind right-of-center product cards as a counterpoint
3. **Amber orb** — radial-gradient(circle at 0px -50%, rgba(255,255,255,0) 15%, rgba(249,167,26,0.4) 38%, rgba(255,255,255,0) 65%) — used sparingly as a third accent, typically only on the largest hero compositions

Orbs are always positioned behind product mockups, never behind text or buttons. They bleed from transparent to ~0.3–0.4 opacity color and back to transparent — they should never read as solid color blocks.

## Typography Voice

The Bricolage Grotesque / Inter pairing is the brand's voice: Bricolage Grotesque speaks in calm, confident declarations at 48–56px, then Inter translates that into clear instruction at 14–16px. The contrast between the two faces is what gives the system its rhythm — never let Bricolage Grotesque shrink below 20px, and never let Inter attempt display duty. Display headlines should always be left-aligned or center-aligned within a max-width column of 680–720px to preserve line-break rhythm; never let Bricolage Grotesque stretch to full 1200px container width.

## Similar Brands

- **Canny** — Same feedback/roadmap product category and identical purple-and-white product page treatment, with a custom geometric display face over Inter for body and floating product preview cards over gradient orbs
- **Nolt** — Closely related feedback-board product with a soft white canvas, violet accent system, and rounded card geometry for testimonials and feature panels
- **Featurebase** — Direct competitor in the same space sharing the soft-light-on-violet palette, pill-shaped avatars in social proof, and the lavender feature-section band pattern
- **Linear** — Same restrained light theme, generous whitespace, custom-feeling display face, and use of floating product UI cards as hero illustration
- **Framer** — Similar airy light product page with gradient atmosphere behind mockup surfaces, Bricolage Grotesque-style custom display typography, and pill-radius avatars in social proof

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-voltage-violet: #862fe7;
  --color-ultra-violet: #5f259e;
  --color-lavender-mist: #ad6df4;
  --color-orchid-wash: #bd8ff0;
  --color-magenta-spark: #ff5fe4;
  --color-hot-pink-ray: #e22ba4;
  --color-amber-pulse: #dc5f05;
  --color-midnight-ink: #111827;
  --color-graphite: #3f4654;
  --color-slate: #6b7589;
  --color-pure-white: #ffffff;
  --color-fog: #f1f5f9;
  --color-mist: #d8e0ea;
  --color-mint-wash: #d6fcf4;
  --color-lavender-field: #ebdafd;

  /* Typography — Font Families */
  --font-bricolage-grotesque: 'Bricolage Grotesque', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --tracking-caption: 1.2px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.6;
  --text-body: 16px;
  --leading-body: 1.75;
  --text-subheading: 20px;
  --leading-subheading: 1.5;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.3;
  --tracking-heading-sm: -0.6px;
  --text-heading: 32px;
  --leading-heading: 1.2;
  --tracking-heading: -0.8px;
  --text-display: 56px;
  --leading-display: 1;
  --tracking-display: -1.4px;

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
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-96: 96px;
  --spacing-112: 112px;
  --spacing-128: 128px;
  --spacing-240: 240px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 24px;
  --element-gap: 16px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-3xl: 24px;
  --radius-3xl-2: 40px;
  --radius-full: 9999px;

  /* Named Radii */
  --radius-nav: 8px;
  --radius-cards: 24px;
  --radius-pills: 9999px;
  --radius-images: 16px;
  --radius-buttons: 12px;
  --radius-featured-card: 40px;

  /* Shadows */
  --shadow-subtle: rgba(11, 61, 121, 0.16) 0px 0px 0px 1px inset;

  /* Surfaces */
  --surface-pure-white-canvas: #ffffff;
  --surface-fog-alt: #f1f5f9;
  --surface-lavender-field: #ebdafd;
  --surface-mint-highlight: #d6fcf4;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-voltage-violet: #862fe7;
  --color-ultra-violet: #5f259e;
  --color-lavender-mist: #ad6df4;
  --color-orchid-wash: #bd8ff0;
  --color-magenta-spark: #ff5fe4;
  --color-hot-pink-ray: #e22ba4;
  --color-amber-pulse: #dc5f05;
  --color-midnight-ink: #111827;
  --color-graphite: #3f4654;
  --color-slate: #6b7589;
  --color-pure-white: #ffffff;
  --color-fog: #f1f5f9;
  --color-mist: #d8e0ea;
  --color-mint-wash: #d6fcf4;
  --color-lavender-field: #ebdafd;

  /* Typography */
  --font-bricolage-grotesque: 'Bricolage Grotesque', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --tracking-caption: 1.2px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.6;
  --text-body: 16px;
  --leading-body: 1.75;
  --text-subheading: 20px;
  --leading-subheading: 1.5;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.3;
  --tracking-heading-sm: -0.6px;
  --text-heading: 32px;
  --leading-heading: 1.2;
  --tracking-heading: -0.8px;
  --text-display: 56px;
  --leading-display: 1;
  --tracking-display: -1.4px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-96: 96px;
  --spacing-112: 112px;
  --spacing-128: 128px;
  --spacing-240: 240px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-3xl: 24px;
  --radius-3xl-2: 40px;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-subtle: rgba(11, 61, 121, 0.16) 0px 0px 0px 1px inset;
}
```
