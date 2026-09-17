# Busuu — Style Reference
> playful passport of global connection. Vivid gradient skies, bubble greetings, and circular flags make the whole interface feel like a warm invitation to the world.

**Theme:** light

Busuu's design system radiates warm, approachable energy through a vivid purple-to-blue gradient hero that bleeds confidence before settling into a calm, near-white workspace. The dominant interface is built on a very pale blue-tinted canvas (#f2f7fd) with white cards floating above it, and a single saturated spring-green (#11ee92) acts as the primary action accent — an unconventional choice that immediately distinguishes it from the sea of blue CTAs in edtech. Typography is custom (Nista) with a compact, bold-friendly weight stack: heavy 800 for display, 700 for headings, and a clean 400 for body, giving the system a confident, slightly geometric voice. The visual language is heavily illustrated — flat, colorful character art with circular framing devices — and the layout relies on generous padding, pill-shaped controls, and circular flag tiles to make global language learning feel tactile and inviting rather than academic.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Deep Indigo | `#3b1e90` | `--color-deep-indigo` | Left edge of hero gradient — anchors the purple sky of the landing banner |
| Signal Blue | `#116eee` | `--color-signal-blue` | Brand links, nav accents, heading highlights, logo wordmark — the only blue that carries brand meaning |
| Spring Mint | `#11ee92` | `--color-spring-mint` | Green supporting accent for decorative details and low-frequency emphasis. Do not promote it to the primary CTA color |
| Hero Sky Blue | `linear-gradient(90deg, #3b1e9 0%, #5a3cc4 30%, #3a6ef0 100%)` | `--color-hero-sky-blue` | Right edge of hero gradient — transitions from deep indigo to a cleaner blue, softening the landing page mood |
| Charcoal | `#252b2f` | `--color-charcoal` | Primary body text and heading color — softer than pure black, keeps long-form copy comfortable |
| Pure Black | `#000000` | `--color-pure-black` | Icon strokes, decorative illustration linework, highest-contrast text — used where maximum weight is needed |
| Canvas Mist | `#f2f7fd` | `--color-canvas-mist` | Page background — barely-blue tinted near-white, the calm base layer below the hero |
| Paper White | `#ffffff` | `--color-paper-white` | Card surfaces, nav background, content panels — sits one level above the mist canvas |
| Steel Border | `#d6dee6` | `--color-steel-border` | Input borders, dividers, subtle structural lines — cool-toned to harmonize with the mist canvas |
| Slate Caption | `#666e7e` | `--color-slate-caption` | Muted helper text, secondary body copy, metadata — readable but recedes against charcoal |
| Shadow Gray | `#b3b3b3` | `--color-shadow-gray` | Soft elevation wash and button shadow base — used in the subtle 1px shadow stack |
| Trustpilot Star | `#ffcf00` | `--color-trustpilot-star` | Review star fill on the Trustpilot social-proof line — the only yellow in the system, used exclusively for ratings |

## Tokens — Typography

### Nista — Sole typeface for the entire system — Nista's geometric warmth and bold-friendly weight stack carries everything from 10px metadata to 40px display headlines. The 800 weight on hero text gives authority without feeling heavy or corporate; the 400 body keeps long lesson descriptions breathable. Substitute: 'Poppins' or 'Nunito' for the friendly geometric quality, or 'DM Sans' for a cleaner alternative. · `--font-nista`
- **Substitute:** Poppins
- **Weights:** 400, 700, 800
- **Sizes:** 10, 12, 14, 16, 18, 24, 36, 40
- **Line height:** 1.14, 1.20, 1.30, 1.33, 1.50, 1.70
- **Letter spacing:** normal across all sizes — Nista's natural metrics are tight enough that no tracking adjustment is needed
- **Role:** Sole typeface for the entire system — Nista's geometric warmth and bold-friendly weight stack carries everything from 10px metadata to 40px display headlines. The 800 weight on hero text gives authority without feeling heavy or corporate; the 400 body keeps long lesson descriptions breathable. Substitute: 'Poppins' or 'Nunito' for the friendly geometric quality, or 'DM Sans' for a cleaner alternative.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 10px | 1.2 | — | `--text-caption` |
| body | 14px | 1.5 | — | `--text-body` |
| body-lg | 16px | 1.5 | — | `--text-body-lg` |
| subheading | 18px | 1.5 | — | `--text-subheading` |
| heading-sm | 24px | 1.3 | — | `--text-heading-sm` |
| heading | 36px | 1.14 | — | `--text-heading` |
| display | 40px | 1.14 | — | `--text-display` |

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
| 48 | 48px | `--spacing-48` |
| 64 | 64px | `--spacing-64` |
| 120 | 120px | `--spacing-120` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 16px |
| inputs | 5px |
| buttons | 45px |
| circles | 9999px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| subtle | `rgba(0, 0, 0, 0.1) 0px 1px 2px 0px` | `--shadow-subtle` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 64px
- **Card padding:** 20px
- **Element gap:** 10-20px

## Components

### Hero Gradient Banner
**Role:** Full-bleed landing section

Deep indigo to sky blue linear gradient (90deg, #3b1e9 → #5a3cc4 → #3a6ef0), full viewport width, contains white headline at 40px/1.14 weight 800, body text at 16px in white, and illustrated character art with speech bubbles floating on a faint world map outline. No card chrome — the gradient IS the surface.

### Primary CTA Button (Spring Mint)
**Role:** Main conversion action

Filled pill button: background #11ee92, text #252b2f weight 700, 14-16px, padding 20px horizontal by ~12px vertical, border-radius 45px. On the gradient hero it pops vividly; on white sections it reads as energetic. This is the ONLY chromatic filled action in the system.

### Outlined Nav Button (Learn for free)
**Role:** Secondary nav action with brand border

Transparent fill, 1.5-2px solid #116eee border, #116eee text, 45px pill radius, padding ~20px horizontal. Mirrors the mint CTA in shape but uses the brand blue to signal a lighter-weight entry point.

### Ghost Nav Button (Log in)
**Role:** Tertiary text-level action

No fill, no border, #252b2f text, pill radius 45px, padding ~20px horizontal. Sits inline with the outlined button, creating a filled → outlined → ghost hierarchy.

### Top Navigation Bar
**Role:** Site-wide header

White (#ffffff) background, logo lockup left ('Busuu' in #116eee + 'A Chegg service' tag), nav links and action buttons right-aligned. Horizontal padding ~20px, subtle 1px shadow or no shadow. Fixed/sticky on scroll.

### Language Flag Tile
**Role:** Language selection card in carousel

Circular container (border-radius 9999px), white background, contains a circular flag image (also full radius). Language name below in 14px #252b2f. Shadow: rgba(0,0,0,0.1) 0px 1px 2px 0px. Tiles arranged in a horizontal scrollable row with chevron controls on the edges.

### Trustpilot Rating Strip
**Role:** Social proof under primary CTA

Inline horizontal layout: 'Excellent' wordmark in 12px #252b2f, five green stars (#00b67a Trustpilot green or system green) in a row, review count in 12px #666e7, small Trustpilot logo at the end. Sits directly below the hero CTA.

### Carousel Navigation Arrows
**Role:** Scroll controls for language row

Circular ghost buttons flanking the language tile row. Light gray (#d6dee6) chevron icon, no fill, 40px diameter. Purely directional, minimal visual weight.

### Section Heading
**Role:** Section title text

'I want to learn' at 24-36px, weight 700, color #252b2f, centered above content rows. Uses the heading-sm to heading range from the type scale.

### Display Hero Headline
**Role:** Landing page hero title

40px Nista weight 800, line-height 1.14, color white on the gradient hero, left-aligned within the content column. Bold and confident without being corporate.

### Hero Body Copy
**Role:** Supporting paragraph under hero headline

16px Nista weight 400, line-height 1.5, white at ~90% opacity, max-width ~480px. Sits between headline and CTA with a 20px gap.

### Language Selector Dropdown
**Role:** Footer-level locale picker

Standard native select element, 5px border-radius, 1px #d6dee6 border, #252b2f text, 14px. Label 'Display Language:' above in bold #252b2f 14px. Sits on the canvas mist background in the footer area.

### Footer Band
**Role:** Page footer with locale controls

Light mist background (#f2f7fd), generous vertical padding (~40-60px), contains the language selector and links. No heavy borders or dividers — flows naturally from the canvas.

## Do's and Don'ts

### Do
- Use the mint pill button (#11ee92 fill, 45px radius) as the single primary action on every screen — never introduce a second chromatic action color.
- Anchor every full-bleed hero or banner with the indigo-to-sky-blue linear gradient (90deg, #3b1e9 → #5a3cc4 → #3a6ef0) when an energetic landing moment is needed.
- Set page backgrounds to #f2f7fd and float cards on #ffffff to preserve the cool, calm, blue-tinted workspace mood.
- Reach for Nista weight 800 at 36-40px for display and weight 400 at 14-16px for body — the bold/regular contrast is the system's voice.
- Frame all language or category choices in circular containers (border-radius 9999px) with a 1px shadow at rgba(0,0,0,0.1) 0px 1px 2px — circles are the system's signature shape.
- Use #116eee exclusively for brand identity moments (logo, links, nav accents) — never as a filled action background.
- Apply 20px padding to cards, 64px between sections, and 10-20px between elements to maintain the comfortable, breathable rhythm.

### Don't
- Don't use mint (#11ee92) for anything other than the primary filled CTA — it must stay rare to retain its punch.
- Don't stack multiple shadows or use heavy elevation — the system is intentionally flat with a single 1px shadow as the deepest depth cue.
- Don't introduce a second brand blue or replace #116eee — Signal Blue is the only blue that carries brand meaning.
- Don't use sharp corners on primary controls — buttons must be 45px pill, tiles must be circles, and cards must be 16px or rounder.
- Don't set body text in pure black (#000000) for long-form copy — use #252b2f charcoal for reading comfort; reserve black for icons and illustration linework.
- Don't put yellow anywhere except the Trustpilot star — #ffcf00 is reserved for the rating context only.
- Don't break the illustrated, playful tone with stock photography, corporate gradients, or dense data tables — the system is character-driven, not chart-driven.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas Mist | `#f2f7fd` | Page background — the calm base layer for all content below the hero |
| 1 | Paper White | `#ffffff` | Card surfaces, language tile backgrounds, nav bar |
| 2 | Hero Gradient | `#3b1e9` | Full-bleed landing banner — deep indigo to sky blue gradient with illustrated character art |

## Elevation

- **Language flag tiles and card surfaces:** `rgba(0, 0, 0, 0.1) 0px 1px 2px 0px`

## Imagery

The visual language is illustration-first: flat, colorful character art with rounded forms, dark hair and simplified facial features, set against circular pastel halos. Speech bubbles containing greeting words in different scripts ('Ciao!', 'Bonjour!', 'Hello!', '你好') float around the characters, reinforcing the multilingual theme visually. A faint world map outline in lighter blue sits behind the hero illustration. No photography appears in the visible interface — every human or contextual element is drawn. Icons are minimal and geometric (chevrons, flags in circles, star ratings). The overall treatment is bright, friendly, and slightly cartoonish, with primary colors used liberally within illustrations while the surrounding UI stays neutral and calm.

## Layout

The page model is max-width contained (~1200px) on a full-bleed light mist canvas. The hero breaks the container with a full-width gradient banner containing a two-column composition: text stack left (headline, body, CTA, social proof) and illustration right. Below the hero, content sections sit on #f2f7fd with white cards and generous 64px vertical gaps. The 'I want to learn' section uses a centered heading above a horizontal scrollable row of circular language tiles with chevron controls flanking it. Section rhythm is consistent: generous breathing room, no heavy dividers, seamless flow between bands. Navigation is a simple sticky white top bar with logo left, action buttons right — no mega-menu, no sidebar. The footer is a single light band with locale controls.

## Agent Prompt Guide

**Quick Color Reference**
- text: #252b2f (charcoal body), #000000 (icons/illustration), #666e7e (muted/helper)
- background: #f2f7fd (canvas), #ffffff (cards/nav)
- border: #d6dee6 (inputs, dividers)
- accent: #116eee (Signal Blue — links, logo, nav highlights)
- primary action: no distinct CTA color
- hero gradient: #3b1e90 → #5a3cc4 → #3a6ef0 (90deg)
- shadow: rgba(0, 0, 0, 0.1) 0px 1px 2px 0px
- radius: 45px (buttons), 9999px (circles/tiles), 16px (cards), 5px (inputs)

**3-5 Example Component Prompts**

1. **Create a hero banner:** Full-bleed background with linear-gradient(90deg, #3b1e90 0%, #5a3cc4 30%, #3a6ef0 100%). Left column: headline 'Learn a language, live a new life' in Nista 40px weight 800, white, line-height 1.14. Below it, body text 16px weight 400, white, max-width 480px, 20px gap. Below that, a filled mint pill button — background #11ee92, text #252b2f, 14px weight 700, padding 12px 20px, border-radius 45px. Right column: flat illustration of a character with speech bubble. Padding 64px vertical.

2. **Create a language selection carousel:** Background #f2f7fd. Centered heading 'I want to learn' in Nista 24px weight 700, #252b2f, 40px margin-bottom. Horizontal row of 6 circular tiles, each 80px diameter, border-radius 9999px, background #ffffff, box-shadow rgba(0,0,0,0.1) 0px 1px 2px 0px, containing a circular flag image. Language name below each tile in 14px #252b2f, 10px gap. Chevron arrows in 40px ghost circles flanking the row.

3. **Create a top navigation bar:** White (#ffffff) background, horizontal padding 20px, height ~64px. Left: logo — blue rounded-square icon + 'Busuu' wordmark in Nista 18px weight 700, #116eee, with 'A Chegg service' subtitle in 10px #666e7e. Right: two pill buttons — outlined (#116eee border 1.5px, transparent fill, #116eee text, 45px radius, 20px horizontal padding) labeled 'Learn for free', then ghost button (#252b2f text, no border, 45px radius) labeled 'Log in'.

4. **Create a card grid for course categories:** Page background #f2f7fd. Three-column grid of white cards (#ffffff), border-radius 16px, padding 20px, box-shadow rgba(0,0,0,0.1) 0px 1px 2px 0px, 20px gap. Each card has a circular 60px icon container at the top-left, a heading in Nista 18px weight 700 #252b2f, and body text in 14px weight 400 #666e7e.

5. **Create a footer with locale selector:** Background #f2f7fd, padding 40px 20px. 'Display Language:' label in Nista 14px weight 700, #252b2f, 10px margin-bottom. Native select element below — border 1px solid #d6dee6, border-radius 5px, padding 8px 12px, text 14px #252b2f, options for English (UK), Español, Français, Deutsch, etc.

## Signature Choices

Three choices make this system immediately recognizable and must be preserved across all new screens:

1. **Mint as the only action color.** A vivid spring green (#11ee92) for the primary CTA against a purple-blue gradient hero is a deliberate anti-corporate choice. Most edtech defaults to blue CTAs — Busuu's mint reads as fresh, encouraging, and non-transactional. Never dilute it by adding other chromatic action colors.

2. **Circles as the structural shape.** Language flags, icon containers, and decorative elements are almost always circular (border-radius 9999px). This circular vocabulary ties directly to the globe/world-map hero motif and makes the interface feel like a passport or a set of collectible stamps rather than a standard SaaS dashboard.

3. **Blue-tinted near-white canvas.** The page background is #f2f7fd — not pure white, not gray, but a barely-perceptible cool blue tint. This creates a calm, slightly dreamy workspace that complements the bold gradient hero without competing with it. Cards float on #ffffff above this tint, and the two-tone surface stack gives just enough layering without any heavy shadows.

## Similar Brands

- **Duolingo** — Same playful illustrated-character hero, vivid single-accent CTA (Duolingo's green vs Busuu's mint), and circular tile vocabulary for language selection
- **Babbel** — Same edtech language-learning category with a single bold display headline over a colorful hero, though Babbel leans warmer/red while Busuu is cooler/blue-purple
- **Khan Academy** — Same light-mist canvas, white card surfaces, and generous 64px section breathing room with a single trustpilot-style social proof strip under the primary CTA
- **Notion** — Same quiet, near-white workspace aesthetic with white cards floating on a very light tinted background, and the same restraint of using shadows as a single 1px hint rather than heavy elevation
- **Headspace** — Same friendly, illustration-driven hero with a bold gradient and rounded character art, paired with a calm pastel content area below

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-deep-indigo: #3b1e90;
  --color-signal-blue: #116eee;
  --color-spring-mint: #11ee92;
  --color-hero-sky-blue: #3a6ef0;
  --gradient-hero-sky-blue: linear-gradient(90deg, #3b1e9 0%, #5a3cc4 30%, #3a6ef0 100%);
  --color-charcoal: #252b2f;
  --color-pure-black: #000000;
  --color-canvas-mist: #f2f7fd;
  --color-paper-white: #ffffff;
  --color-steel-border: #d6dee6;
  --color-slate-caption: #666e7e;
  --color-shadow-gray: #b3b3b3;
  --color-trustpilot-star: #ffcf00;

  /* Typography — Font Families */
  --font-nista: 'Nista', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.2;
  --text-body: 14px;
  --leading-body: 1.5;
  --text-body-lg: 16px;
  --leading-body-lg: 1.5;
  --text-subheading: 18px;
  --leading-subheading: 1.5;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.3;
  --text-heading: 36px;
  --leading-heading: 1.14;
  --text-display: 40px;
  --leading-display: 1.14;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-bold: 700;
  --font-weight-extrabold: 800;

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
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-120: 120px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 64px;
  --card-padding: 20px;
  --element-gap: 10-20px;

  /* Border Radius */
  --radius-md: 5px;
  --radius-2xl: 16px;
  --radius-3xl: 45.04px;

  /* Named Radii */
  --radius-cards: 16px;
  --radius-inputs: 5px;
  --radius-buttons: 45px;
  --radius-circles: 9999px;

  /* Shadows */
  --shadow-subtle: rgba(0, 0, 0, 0.1) 0px 1px 2px 0px;

  /* Surfaces */
  --surface-canvas-mist: #f2f7fd;
  --surface-paper-white: #ffffff;
  --surface-hero-gradient: #3b1e9;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-deep-indigo: #3b1e90;
  --color-signal-blue: #116eee;
  --color-spring-mint: #11ee92;
  --color-hero-sky-blue: #3a6ef0;
  --color-charcoal: #252b2f;
  --color-pure-black: #000000;
  --color-canvas-mist: #f2f7fd;
  --color-paper-white: #ffffff;
  --color-steel-border: #d6dee6;
  --color-slate-caption: #666e7e;
  --color-shadow-gray: #b3b3b3;
  --color-trustpilot-star: #ffcf00;

  /* Typography */
  --font-nista: 'Nista', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.2;
  --text-body: 14px;
  --leading-body: 1.5;
  --text-body-lg: 16px;
  --leading-body-lg: 1.5;
  --text-subheading: 18px;
  --leading-subheading: 1.5;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.3;
  --text-heading: 36px;
  --leading-heading: 1.14;
  --text-display: 40px;
  --leading-display: 1.14;

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
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-120: 120px;

  /* Border Radius */
  --radius-md: 5px;
  --radius-2xl: 16px;
  --radius-3xl: 45.04px;

  /* Shadows */
  --shadow-subtle: rgba(0, 0, 0, 0.1) 0px 1px 2px 0px;
}
```
