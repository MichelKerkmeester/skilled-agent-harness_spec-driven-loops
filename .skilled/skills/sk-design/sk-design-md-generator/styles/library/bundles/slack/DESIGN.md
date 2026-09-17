# Slack — Style Reference
> Aubergine stage with white spotlights. Deep plum dominates dark sections while a near-white canvas lets oversized Avant-Garde headlines breathe.

**Theme:** light

Slack's design language balances a near-white canvas with concentrated pools of aubergine purple — the brand color appears sparingly as CTA fills, dark hero sections, and gradient text highlights while the majority of the page stays airy and monochrome. Type is split into two voices: a geometric display face (Avant-Garde) for oversized headlines at 64-96px, and a humanist sans (Sans) for everything else, keeping body copy at a comfortable 16px. Sections alternate between flat white, faintly lilac washes (#f9f0ff), and fully inverted purple bands, with 16px-radius cards floating over a very subtle 32px ambient shadow. The interface stays quiet so product UI screenshots — rendered in authentic Slack brand chrome — can carry the visual weight.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Aubergine | `#611f69` | `--color-aubergine` | Filled CTA buttons, primary navigation fills, dark hero backgrounds — the brand's signature mid-plum, dense enough to ground without veering black |
| Deep Plum | `#481a54` | `--color-deep-plum` | Largest canvas inversion — full-bleed dark section backgrounds, decorative dark blocks, surface for headline text on white sections |
| Purple Haze | `#f9f0ff` | `--color-purple-haze` | Softest lilac wash for body backgrounds, pill fills, and card surfaces — the quiet brand tint that never competes with text |
| Lavender Mist | `#eac8fe` | `--color-lavender-mist` | Mid-saturation lavender for card borders, decorative outlines, and pill borders — bridges white and purple without harsh contrast |
| Vivid Violet | `linear-gradient(104deg, rgb(0, 0, 0) 9.56%, rgb(186, 1, 255) 102.66%)` | `--color-vivid-violet` | Headline accent text and gradient text fills on dark sections — the bright punch of color that makes key phrases feel switched on; Diagonal black-to-violet gradient for accent text and decorative text fills on dark sections |
| Plum Shadow | `#3d0157` | `--color-plum-shadow` | Darker plum for button text and shadow tones on aubergine surfaces — reads as near-black against purple fills |
| Iris | `#730394` | `--color-iris` | Secondary purple for background fills and link accents — sits between Aubergine and Vivid Violet on the purple ramp |
| Iris Light | `#d17dfe` | `--color-iris-light` | Decorative card text and bright accents inside feature cards — a lighter iris that adds lift without losing brand identity |
| Channel Blue | `#1264a3` | `--color-channel-blue` | Slack's channel-link blue for in-product references, sidebar highlights, and hyperlink color — appears inside product UI screenshots, not marketing chrome |
| Mid Blue | `#0b4c8c` | `--color-mid-blue` | Blue text accent for links, tags, and emphasized short phrases. |
| Sky Mist | `#2f8ab7` | `--color-sky-mist` | Decorative illustration backgrounds — soft secondary blue used only inside graphic blocks |
| Carbon | `#1d1c1d` | `--color-carbon` | Primary body and nav text — Slack's near-black that reads warmer than pure #000 at small sizes |
| Charcoal | `#454245` | `--color-charcoal` | Secondary body text, icon fills, muted captions — the middle step between Carbon and Mid Gray |
| Mid Gray | `#696969` | `--color-mid-gray` | Navigation text, subdued labels, disabled-state text — the working neutral for chrome |
| Steel | `#808080` | `--color-steel` | Placeholder card backgrounds and neutral fill swatches |
| Fog | `#edeaed` | `--color-fog` | Hairline borders, divider lines, subtle 1px separators — the structural neutral that holds cards together |
| Pure White | `#ffffff` | `--color-pure-white` | Primary surface — card backgrounds, text on dark, pill fills, button text on purple |
| Soft White | `#fefbff` | `--color-soft-white` | Page canvas — faintly lilac-tinted white that sets the page apart from harsh #fff |
| Ice Blue | `#e8f5fa` | `--color-ice-blue` | Cool-tinted surface wash for secondary panels and nav highlights |
| Black | `#000000` | `--color-black` | Headline text on light sections, icon fills, deepest emphasis — used at display sizes where maximum weight is needed |

## Tokens — Typography

### Salesforce-Avant-Garde — Display and heading face — geometric, wide, compressed. Carries every headline from 21px subheads up to 96px hero display. The 400-weight at 76px is anti-convention: Slack trusts its letterforms enough to let headlines whisper rather than shout. Tracking tightens progressively from -0.004em at body sizes to -0.012em at 64px+ · `--font-salesforce-avant-garde`
- **Substitute:** Inter Tight, DM Sans, Outfit
- **Weights:** 400, 600, 700
- **Sizes:** 18px, 21px, 22px, 24px, 32px, 50px, 58px, 64px, 76px, 96px
- **Line height:** 0.97–1.33
- **Letter spacing:** -0.0120em at 64px+, -0.0080em at 32px, -0.0040em at 21-24px
- **Role:** Display and heading face — geometric, wide, compressed. Carries every headline from 21px subheads up to 96px hero display. The 400-weight at 76px is anti-convention: Slack trusts its letterforms enough to let headlines whisper rather than shout. Tracking tightens progressively from -0.004em at body sizes to -0.012em at 64px+

### Salesforce-Sans — Workhorse body and UI face — handles nav, body copy, buttons, captions, and labels. The 12px/700 with 0.057em tracking (uppercase) is the eyebrow-label pattern used for section tags. Body sits at 16px/1.5 — generous enough for reading, compact enough for dense product cards · `--font-salesforce-sans`
- **Substitute:** Inter, IBM Plex Sans, Geist
- **Weights:** 300, 400, 600, 700
- **Sizes:** 12px, 14px, 15px, 16px, 18px, 23px
- **Line height:** 1.20–1.56
- **Letter spacing:** 0.0570em at 12px uppercase, -0.0020em at 14px, -0.0010em at 15-16px, -0.0120em at 18px
- **Role:** Workhorse body and UI face — handles nav, body copy, buttons, captions, and labels. The 12px/700 with 0.057em tracking (uppercase) is the eyebrow-label pattern used for section tags. Body sits at 16px/1.5 — generous enough for reading, compact enough for dense product cards

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| eyebrow | 12px | 1.5 | 0.68px | `--text-eyebrow` |
| caption | 14px | 1.56 | -0.03px | `--text-caption` |
| body-sm | 16px | 1.5 | -0.16px | `--text-body-sm` |
| body | 18px | 1.56 | -0.22px | `--text-body` |
| subheading | 32px | 1.25 | -0.26px | `--text-subheading` |
| heading-sm | 50px | 1 | -0.6px | `--text-heading-sm` |
| heading | 64px | 1.12 | -0.77px | `--text-heading` |
| heading-lg | 76px | 1.2 | -0.91px | `--text-heading-lg` |
| display | 96px | 1.08 | -1.15px | `--text-display` |

## Tokens — Spacing & Shapes

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 6 | 6px | `--spacing-6` |
| 7 | 7px | `--spacing-7` |
| 8 | 8px | `--spacing-8` |
| 10 | 10px | `--spacing-10` |
| 12 | 12px | `--spacing-12` |
| 16 | 16px | `--spacing-16` |
| 18 | 18px | `--spacing-18` |
| 19 | 19px | `--spacing-19` |
| 20 | 20px | `--spacing-20` |
| 24 | 24px | `--spacing-24` |
| 32 | 32px | `--spacing-32` |
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |
| 96 | 96px | `--spacing-96` |
| 98 | 98px | `--spacing-98` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 4px |
| cards | 16px |
| pills | 999px |
| badges | 90px |
| buttons | 4px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| xl | `rgba(0, 0, 0, 0.1) 0px 0px 32px 0px` | `--shadow-xl` |
| subtle | `rgb(97, 31, 105) 0px 0px 0px 1px inset` | `--shadow-subtle` |
| subtle-2 | `rgba(0, 0, 0, 0.08) 0px 1px 3px 0px` | `--shadow-subtle-2` |
| lg | `rgba(0, 0, 0, 0.1) 0px 5px 20px 0px` | `--shadow-lg` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80-100px
- **Card padding:** 24px
- **Element gap:** 8-12px

## Components

### Primary CTA Button (Aubergine Fill)
**Role:** Main conversion action

Filled rectangle in #611f69 with white text at 16px/700, 4px radius, 19px top / 20px bottom / 40px horizontal padding. The signature Slack button — compact, rectangular, never pill-shaped at this scale.

### Ghost CTA Button
**Role:** Secondary action beside primary CTA

Transparent background, #3d0157 text, 4px radius, same vertical/horizontal padding as primary. Border-less; relies on color contrast alone to signal actionability.

### Nav Pill Button
**Role:** Sticky navigation action

Transparent background, #3d0157 text, 90px (full pill) radius, 12px square padding. Used for compact nav-level triggers like feature toggles.

### Header Request Demo Link
**Role:** Low-emphasis nav link

Transparent background, #1d1c1d text, no border, 4px radius. Sits inline with primary nav, visually subordinate to the filled CTA.

### Sign In Link
**Role:** Account access

Transparent background, #1d1c1d text, sits in nav utility area. Styled as a plain link with no chrome.

### Feature Card (Lavender Border)
**Role:** Content card with subtle brand frame

Transparent background, 1px #eac8fe border, 16px radius, no shadow. The 'card' variant that defines Slack's quiet card language — border over fill, no elevation.

### Product Screenshot Card
**Role:** Large product UI embed

Transparent or #808080 background, 16px radius, floating with rgba(0,0,0,0.1) 0px 0px 32px 0px shadow. Houses authentic Slack app screenshots — these carry visual weight that marketing cards don't.

### Floating Sticky Nav
**Role:** Persistent top navigation

White background (#ffffff), 0.08 shadow on scroll (rgba(0,0,0,0.08) 0px 1px 3px), rounded bottom corners, 80px height. Becomes elevated with 0px 5px 20px rgba(0,0,0,0.1) on active state.

### Eyebrow Label / Tag
**Role:** Section category label

12px Salesforce-Sans / 700, uppercase, 0.057em tracking. Used for 'New Feature', 'Partner Apps MCP' tags above feature cards.

### NEW Badge
**Role:** Freshness indicator

Small inline badge, #0b4c8c text on light fill, pill or rounded-rect shape. Marks recently launched features.

### Ask Slackbot Pill
**Role:** Interactive quick-action

Dark plum fill (#3d0157 or near-black), white text, fully rounded, sits above section as a prompt trigger.

### Gradient Text Highlight
**Role:** Accent emphasis inside headlines

Specific words within display headlines use the black-to-violet linear-gradient fill (#000 → #ba01ff). Creates the 'this word is special' effect without color noise.

### Dark Hero Band
**Role:** Full-bleed brand section

#481a54 background, white text at 64px/700, soft radial color washes (pink, blue, green, yellow at 25% opacity) decorating edges. Inverted canvas that breaks the white-page rhythm.

### Star-spark Decoration
**Role:** Visual flourish on dark sections

White four-pointed star shapes scattered against #481a54 — minimal geometric ornament, no gradients or glow.

## Do's and Don'ts

### Do
- Use #611f69 for filled CTAs only — never as background fills for hero sections or large surfaces; reserve #481a54 for those.
- Set display headlines at 64-96px using Salesforce-Avant-Garde with -0.012em tracking; the compressed wide forms are what make Slack's hero feel architectural.
- Apply the gradient text fill (black → #ba01ff) to single keywords inside white-section headlines — not to entire headlines or body copy.
- Use 16px radius on all cards and content surfaces; pair with 1px lavender (#eac8fe) borders instead of heavy shadows for the default card state.
- Reserve the 32px ambient shadow (rgba(0,0,0,0.1) 0px 0px 32px 0px) for product screenshot cards and floating overlays only — not for static content cards.
- Alternate white canvas sections with #481a54 dark hero bands to create rhythm; use #f9f0ff as a quieter mid-tone when transitioning without full inversion.
- Set eyebrow labels at 12px/700 with 0.057em uppercase tracking — this is the tag pattern for 'New Feature' and section categories.

### Don't
- Do not use pill-radius (999px) on primary CTA buttons — Slack's filled actions are always rectangular with 4px corners.
- Do not apply the #eac8fe lavender border to product screenshot cards — those need white or transparent backgrounds to let the embedded UI breathe.
- Do not use Vivid Violet (#9602c7) or Iris Light (#d17dfe) for body text on white backgrounds — contrast ratios are too low; reserve for dark-section accents and card-only contexts.
- Do not mix Channel Blue (#1264a3) into marketing-page CTAs — that blue belongs inside Slack product UI screenshots, not the marketing chrome.
- Do not add drop shadows to text inside the dark hero band; the band itself provides enough contrast.
- Do not use gradient fills on UI surfaces (buttons, cards, inputs) — the gradient treatment is text-only and decorative.
- Do not set body copy below 14px or above 18px; the 16px/1.5 lineHeight is the working standard for readability across marketing and feature copy.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Canvas | `#fefbff` | Page-level background — faintly lilac-tinted white that distinguishes Slack's surface from generic #fff |
| 2 | Card | `#ffffff` | Primary card and content surface |
| 3 | Wash | `#f9f0ff` | Soft purple-tinted background for body sections and pill fills |
| 4 | Cool Wash | `#e8f5fa` | Cool secondary panel surface |
| 5 | Inverted | `#481a54` | Full-bleed dark hero and feature band backgrounds |

## Elevation

- **Product Screenshot Card:** `0px 0px 32px 0px rgba(0, 0, 0, 0.1)`
- **Floating Sticky Nav (idle):** `0px 1px 3px 0px rgba(0, 0, 0, 0.08)`
- **Floating Sticky Nav (active):** `0px 5px 20px 0px rgba(0, 0, 0, 0.1)`
- **Primary CTA Button (focus):** `inset 0px 0px 0px 1px rgb(97, 31, 105)`

## Imagery

Imagery is overwhelmingly product-UI screenshots — authentic Slack app windows rendered at scale with real channel chrome, avatars, and message threads. These screenshots sit inside floating cards with 16px radius and a 32px ambient shadow. Secondary imagery is logo lockups for 'Trusted by' social proof (GM, OpenAI, Target, Paramount, Stripe, IBM — all rendered as grayscale SVG wordmarks). The dark hero band uses minimal geometric ornament — scattered white four-point star shapes and soft radial color washes (pink, blue, green, yellow at 25% opacity) at the edges. No lifestyle photography, no human imagery, no illustrations outside the product UI context. The object-as-hero approach means screenshots occupy 40-60% of viewport width on most feature sections.

## Layout

Max-width 1200px centered content with sections that break full-bleed. Hero is a centered stack: oversized headline at 64px/700, subtitle at 18px, twin CTAs (filled + ghost), then trust-logo strip, then a large product screenshot card floating below. Section rhythm alternates: white canvas → inverted #481a54 dark band → white canvas → light #f9f0ff wash. Feature sections use a split layout — text-left at ~45% width paired with a product screenshot card-right at ~50%, with vertical centering. Card grids use 3-column layouts for feature cards with lavender borders. Navigation is a sticky top bar that floats with subtle shadow on scroll, containing logo + 5-item menu + search + sign-in + filled CTA. The overall vertical rhythm uses ~96px section gaps to let oversized headlines breathe between bands.

## Agent Prompt Guide

**Quick Color Reference**
- text: #1d1c1d (primary), #454245 (secondary), #696969 (muted)
- background: #fefbff (canvas), #ffffff (card), #f9f0ff (wash), #481a54 (dark band)
- border: #edeaed (hairline), #eac8fe (lavender card border)
- accent: #9602c7 (gradient text), #d17dfe (card accent)
- primary action: #611f69 (filled action)

**Example Component Prompts**

1. Create a Primary Action Button: #611f69 background, #ffffff text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.

2. **Feature Card with Lavender Border**: Transparent background, 1px #eac8fe border, 16px radius, 24px padding. Eyebrow label at 12px/700 uppercase with 0.057em tracking in #696969. Heading at 22px Salesforce-Avant-Garde weight 600, #1d1c1d. Body at 16px/1.5 Salesforce-Sans, #454245.

3. **Product Screenshot Card**: #ffffff background, 16px radius, padding 0, with rgba(0,0,0,0.1) 0px 0px 32px 0px shadow. Contains authentic Slack UI screenshot with #4a154b sidebar and white message area. Aspect ratio ~16:10.

4. **Dark Hero Band**: Full-bleed #481a54 background, 96px top/bottom padding. Headline at 64px Salesforce-Avant-Garde weight 700, #ffffff. Body at 18px Salesforce-Sans weight 400, #ffffff at 85% opacity. Decorative white four-point stars scattered at 30% opacity. Optional radial color washes (pink/blue/green/yellow at 25%) at edges.

5. **Sticky Nav Bar**: #ffffff background, 80px height, full-width. Contains logo left, 5-item menu (Features, Solutions, Enterprise, Resources, Pricing) at 15px/700 in #1d1c1d, search icon, 'Sign in' link, and 'Request a demo' filled CTA in #611f69. On scroll: rgba(0,0,0,0.08) 0px 1px 3px 0px shadow appears.

## Gradient System

Gradients are used sparingly and only for text decoration. The signature black-to-violet gradient (linear-gradient(104deg, rgb(0,0,0) 9.56%, rgb(186,1,255) 102.66%)) is applied as a background-clip: text fill on individual keywords within white-section headlines. On dark hero bands, radial color washes at 25% opacity (pink, blue, green, yellow) sit at viewport edges to add warmth without competing with the plum background. No gradients are used on UI surfaces (buttons, cards, inputs) — gradients are text-only and decorative-only in this system.

## Animation Philosophy

Motion personality is expressive: primary duration is 0.42s with ease timing for most UI transitions, while decorative background-swap animations run at 4s and 8s for ambient effects. The cubic-bezier(0.165, 0.84, 0.44, 1) curve appears 40 times — it's the signature ease-out used for reveals and slide-ins. Transitions focus on transform, max-height (for expanding content), and box-shadow (for nav elevation changes). The system favors physical-feeling motion over flat fades.

## Similar Brands

- **Linear** — Same split between geometric display headings and humanist body sans, same restrained use of a single saturated brand color against near-white canvas, same rectangular-not-pill primary buttons with 4px radius
- **Notion** — Similar dark hero band alternating with white canvas rhythm, oversized condensed headlines that let the canvas breathe, product-UI screenshots doing the visual heavy lifting instead of lifestyle photography
- **Webflow** — Shared pattern of gradient-text keyword emphasis inside large display headlines, lavender/purple accent borders on feature cards, rectangular filled CTAs in a single brand hue
- **Stripe** — Identical layout grammar — centered hero stack with twin CTAs, product screenshot card floating below, 3-column feature grids with bordered cards, alternating light/dark section bands

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-aubergine: #611f69;
  --color-deep-plum: #481a54;
  --color-purple-haze: #f9f0ff;
  --color-lavender-mist: #eac8fe;
  --color-vivid-violet: #9602c7;
  --gradient-vivid-violet: linear-gradient(104deg, rgb(0, 0, 0) 9.56%, rgb(186, 1, 255) 102.66%);
  --color-plum-shadow: #3d0157;
  --color-iris: #730394;
  --color-iris-light: #d17dfe;
  --color-channel-blue: #1264a3;
  --color-mid-blue: #0b4c8c;
  --color-sky-mist: #2f8ab7;
  --color-carbon: #1d1c1d;
  --color-charcoal: #454245;
  --color-mid-gray: #696969;
  --color-steel: #808080;
  --color-fog: #edeaed;
  --color-pure-white: #ffffff;
  --color-soft-white: #fefbff;
  --color-ice-blue: #e8f5fa;
  --color-black: #000000;

  /* Typography — Font Families */
  --font-salesforce-avant-garde: 'Salesforce-Avant-Garde', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-salesforce-sans: 'Salesforce-Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-eyebrow: 12px;
  --leading-eyebrow: 1.5;
  --tracking-eyebrow: 0.68px;
  --text-caption: 14px;
  --leading-caption: 1.56;
  --tracking-caption: -0.03px;
  --text-body-sm: 16px;
  --leading-body-sm: 1.5;
  --tracking-body-sm: -0.16px;
  --text-body: 18px;
  --leading-body: 1.56;
  --tracking-body: -0.22px;
  --text-subheading: 32px;
  --leading-subheading: 1.25;
  --tracking-subheading: -0.26px;
  --text-heading-sm: 50px;
  --leading-heading-sm: 1;
  --tracking-heading-sm: -0.6px;
  --text-heading: 64px;
  --leading-heading: 1.12;
  --tracking-heading: -0.77px;
  --text-heading-lg: 76px;
  --leading-heading-lg: 1.2;
  --tracking-heading-lg: -0.91px;
  --text-display: 96px;
  --leading-display: 1.08;
  --tracking-display: -1.15px;

  /* Typography — Weights */
  --font-weight-light: 300;
  --font-weight-regular: 400;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-6: 6px;
  --spacing-7: 7px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-18: 18px;
  --spacing-19: 19px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-96: 96px;
  --spacing-98: 98px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80-100px;
  --card-padding: 24px;
  --element-gap: 8-12px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-full: 48px;
  --radius-full-2: 60px;
  --radius-full-3: 90px;
  --radius-full-4: 999px;
  --radius-full-5: 9999px;

  /* Named Radii */
  --radius-tags: 4px;
  --radius-cards: 16px;
  --radius-pills: 999px;
  --radius-badges: 90px;
  --radius-buttons: 4px;

  /* Shadows */
  --shadow-xl: rgba(0, 0, 0, 0.1) 0px 0px 32px 0px;
  --shadow-subtle: rgb(97, 31, 105) 0px 0px 0px 1px inset;
  --shadow-subtle-2: rgba(0, 0, 0, 0.08) 0px 1px 3px 0px;
  --shadow-lg: rgba(0, 0, 0, 0.1) 0px 5px 20px 0px;

  /* Surfaces */
  --surface-canvas: #fefbff;
  --surface-card: #ffffff;
  --surface-wash: #f9f0ff;
  --surface-cool-wash: #e8f5fa;
  --surface-inverted: #481a54;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-aubergine: #611f69;
  --color-deep-plum: #481a54;
  --color-purple-haze: #f9f0ff;
  --color-lavender-mist: #eac8fe;
  --color-vivid-violet: #9602c7;
  --color-plum-shadow: #3d0157;
  --color-iris: #730394;
  --color-iris-light: #d17dfe;
  --color-channel-blue: #1264a3;
  --color-mid-blue: #0b4c8c;
  --color-sky-mist: #2f8ab7;
  --color-carbon: #1d1c1d;
  --color-charcoal: #454245;
  --color-mid-gray: #696969;
  --color-steel: #808080;
  --color-fog: #edeaed;
  --color-pure-white: #ffffff;
  --color-soft-white: #fefbff;
  --color-ice-blue: #e8f5fa;
  --color-black: #000000;

  /* Typography */
  --font-salesforce-avant-garde: 'Salesforce-Avant-Garde', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-salesforce-sans: 'Salesforce-Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-eyebrow: 12px;
  --leading-eyebrow: 1.5;
  --tracking-eyebrow: 0.68px;
  --text-caption: 14px;
  --leading-caption: 1.56;
  --tracking-caption: -0.03px;
  --text-body-sm: 16px;
  --leading-body-sm: 1.5;
  --tracking-body-sm: -0.16px;
  --text-body: 18px;
  --leading-body: 1.56;
  --tracking-body: -0.22px;
  --text-subheading: 32px;
  --leading-subheading: 1.25;
  --tracking-subheading: -0.26px;
  --text-heading-sm: 50px;
  --leading-heading-sm: 1;
  --tracking-heading-sm: -0.6px;
  --text-heading: 64px;
  --leading-heading: 1.12;
  --tracking-heading: -0.77px;
  --text-heading-lg: 76px;
  --leading-heading-lg: 1.2;
  --tracking-heading-lg: -0.91px;
  --text-display: 96px;
  --leading-display: 1.08;
  --tracking-display: -1.15px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-6: 6px;
  --spacing-7: 7px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-18: 18px;
  --spacing-19: 19px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-96: 96px;
  --spacing-98: 98px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-full: 48px;
  --radius-full-2: 60px;
  --radius-full-3: 90px;
  --radius-full-4: 999px;
  --radius-full-5: 9999px;

  /* Shadows */
  --shadow-xl: rgba(0, 0, 0, 0.1) 0px 0px 32px 0px;
  --shadow-subtle: rgb(97, 31, 105) 0px 0px 0px 1px inset;
  --shadow-subtle-2: rgba(0, 0, 0, 0.08) 0px 1px 3px 0px;
  --shadow-lg: rgba(0, 0, 0, 0.1) 0px 5px 20px 0px;
}
```
