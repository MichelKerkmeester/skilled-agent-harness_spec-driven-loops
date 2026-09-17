# Superpower — Style Reference
> Bioluminescent health command center

**Theme:** light

Superpower wraps a serious clinical promise in cinematic, atmospheric UI: full-bleed dark photography heroes transition into crisp white content surfaces, with one vivid sunrise-orange accent pulsing through the system. Typography carries the brand — a proprietary geometric sans at whisper-tight negative tracking, scaling from 11px metadata to 66px display with line-heights that compress as sizes grow (1.00 at display, 1.40–1.50 at body). A floating dark pill navigation bar hovers over imagery, and pill-shaped CTAs create a tension between clinical precision and warm vitality. Surfaces are mostly flat — the system relies on generous white space, hairline zinc dividers, and a single faint shadow pattern rather than heavy elevation. Color is rationed: nearly everything is black, white, or zinc-gray, and the orange appears only as functional punctuation on actions and brand marks.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Sunrise Coral | `#fc5f2b` | `--color-sunrise-coral` | Orange supporting accent for decorative details and low-frequency emphasis. Do not promote it to the primary CTA color |
| Coral Glow | `linear-gradient(88deg, rgb(252, 95, 43), rgb(255, 139, 100) 90%, rgb(255, 255, 255))` | `--color-coral-glow` | Gradient endpoint paired with Sunrise Coral for decorative membership card wash |
| Carbon Black | `#18181b` | `--color-carbon-black` | Primary text, floating navigation bar fill, headings, icon strokes |
| Pure Black | `#000000` | `--color-pure-black` | Logo wordmark, deep contrast borders |
| Zinc Gray | `#71717a` | `--color-zinc-gray` | Body text, secondary descriptions, muted metadata, helper copy |
| Ash Gray | `#a1a1aa` | `--color-ash-gray` | Tertiary text, inactive borders, disabled states |
| Mist Gray | `#e4e4e7` | `--color-mist-gray` | Hairline borders, card outlines, divider lines, button borders |
| Fog Gray | `#f4f4f5` | `--color-fog-gray` | Subtle surface elevation, muted backgrounds, image overlay scrim base |
| Paper White | `#ffffff` | `--color-paper-white` | Page background, card surfaces, text on dark images, button text |

## Tokens — Typography

### NB International Pro — Everything — display, headings, body, UI, nav. The signature choice is the aggressively tight negative tracking that scales with size (-0.025em at 66px down to -0.005em at small body) combined with line-heights that compress as sizes grow, giving headlines a monolithic, poster-like density that distinguishes Superpower from airy health-tech competitors · `--font-nb-international-pro`
- **Substitute:** Inter Tight, General Sans, Switzer
- **Weights:** 400, 700
- **Sizes:** 11, 13, 15, 17, 19, 22, 26, 30, 37, 45, 56, 60, 66
- **Line height:** 1.00, 1.06, 1.10, 1.13, 1.20, 1.25, 1.40, 1.50
- **Letter spacing:** -0.0250em, -0.0220em, -0.0200em, -0.0150em, -0.0130em, -0.0120em, -0.0090em, -0.0050em
- **Role:** Everything — display, headings, body, UI, nav. The signature choice is the aggressively tight negative tracking that scales with size (-0.025em at 66px down to -0.005em at small body) combined with line-heights that compress as sizes grow, giving headlines a monolithic, poster-like density that distinguishes Superpower from airy health-tech competitors

### NB International Mono Pro — Tabular metadata, micro-copy annotations, technical labels — used sparingly for moments requiring a clinical/instrumented feel · `--font-nb-international-mono-pro`
- **Substitute:** JetBrains Mono, IBM Plex Mono
- **Weights:** 400
- **Sizes:** 11, 13
- **Line height:** 1.40, 1.50
- **Letter spacing:** -0.0060em
- **Role:** Tabular metadata, micro-copy annotations, technical labels — used sparingly for moments requiring a clinical/instrumented feel

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 11px | 1.5 | -0.005px | `--text-caption` |
| body | 15px | 1.5 | -0.005px | `--text-body` |
| body-lg | 17px | 1.4 | -0.009px | `--text-body-lg` |
| subheading | 19px | 1.4 | -0.009px | `--text-subheading` |
| heading-sm | 22px | 1.25 | -0.012px | `--text-heading-sm` |
| heading | 30px | 1.2 | -0.013px | `--text-heading` |
| heading-lg | 45px | 1.13 | -0.015px | `--text-heading-lg` |
| display | 66px | 1 | -0.025px | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** compact

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 8 | 8px | `--spacing-8` |
| 16 | 16px | `--spacing-16` |
| 24 | 24px | `--spacing-24` |
| 28 | 28px | `--spacing-28` |
| 60 | 60px | `--spacing-60` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 15px |
| icons | 7.5px |
| pills | 9999px |
| navBar | 15px |
| buttons | 9999px |
| smallCards | 5px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| subtle | `rgba(0, 0, 0, 0.05) 0px 2px 2px 0px` | `--shadow-subtle` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 75px
- **Card padding:** 19px
- **Element gap:** 11px

## Components

### Floating Pill Navigation
**Role:** Primary site navigation

Dark Carbon Black (#18181b) pill-shaped bar, ~15px radius, floats over hero imagery with generous internal padding (~12px vertical, ~19px horizontal). Logo wordmark left in white, center nav links in white/60 opacity, orange Sunrise Coral CTA button right. The floating pill is a signature element — it never sticks to viewport edges but always appears as a contained capsule.

### Primary Pill CTA
**Role:** Primary conversion button

Sunrise Coral (#fc5f2b) fill, white text at 15-17px weight 700, 9999px border-radius, ~15px vertical × ~24-32px horizontal padding. Tight letter-spacing (-0.009em). Right-arrow chevron after label. No drop shadow — relies on color contrast alone.

### Ghost Text Link
**Role:** Secondary navigation and inline links

No background, no border. White or Carbon Black text at 13-15px weight 400 with tight tracking. Underline appears on hover only. Used for nav items and inline content links.

### Hero Overlay Headline
**Role:** Hero section primary heading

66px display size, weight 400 (NOT 700 — the whisper-weight is deliberate), line-height 1.0, letter-spacing -0.025em, white (#ffffff) text, centered over full-bleed dark photography. This weight-400-at-display-size choice is the system's most distinctive typographic decision.

### Hero Subhead
**Role:** Hero supporting copy

17px body-lg, weight 400, Zinc Gray (#71717a) on white sections, white at reduced opacity on dark hero. Centered, max-width ~480px.

### Membership Visual Card
**Role:** Hero/pricing card artwork

Organic marbled pattern in Sunrise Coral gradient (linear 88deg from #fc5f2b to #ff8b64 fading to white), 15px radius, ~320px wide. Contains 'superpower membership' wordmark top-left and '$17/month' price block bottom-left in white. The only decorative visual on the site.

### Membership Feature List
**Role:** Bullet list of membership benefits

Vertical list with Sunrise Coral checkmark icons (7.5px radius squircle), 19px body text in Carbon Black, 11px row gap. Checks are filled solid coral, not outlined.

### Section Heading
**Role:** Major section titles

45-56px heading-lg/display, weight 400, letter-spacing -0.015 to -0.022em, Carbon Black. Generous bottom margin (~30-40px). Left-aligned in content sections, centered over imagery.

### FAQ Item / Read More
**Role:** Expandable content blocks

Large heading at 30-37px paired with a small ghost-style 'Read more' text link right-aligned. No box, no border — relies on whitespace and type size for separation.

### Trust Badge Row
**Role:** Credibility indicators (HSA/FSA, payment methods)

Horizontal row of small icons and labels at 11-13px, Zinc Gray text, with tiny check or icon glyphs in Carbon Black. Sits directly below primary CTA as a conversion reassurance pattern.

### Photo Thumbnail Strip
**Role:** Image carousel/dashboard previews

Horizontal row of 5-6 small rectangular thumbnails (~80-100px wide), 5px radius, showing app/dashboard screenshots. One thumbnail is active with a Sunrise Coral border.

## Do's and Don'ts

### Do
- Use Sunrise Coral (#fc5f2b) exclusively for filled primary action buttons and the brand mark — never for body text, icons, or decorative backgrounds
- Set display headlines at weight 400 with letter-spacing -0.025em and line-height 1.0 — the whisper-weight is the signature
- Float the navigation as a dark pill capsule over imagery, never as a flat top bar
- Use 9999px border-radius for all buttons and nav CTAs to maintain the pill system
- Layer the surface stack as white → mist gray → carbon black — no mid-tone chromatic surfaces
- Use the marbled coral gradient ONLY for the membership visual card — it's a one-of-a-kind brand asset, not a reusable pattern
- Pair every primary CTA with a trust badge row (HSA/FSA, payment icons) directly below at 11-13px Zinc Gray

### Don't
- Don't apply heavy drop shadows — the system uses a single 2px hairline shadow at most, and most cards have no shadow at all
- Don't use weight 700 for display headlines — weight 400 at 56-66px is the rule, 700 is reserved for small labels and button text
- Don't introduce additional chromatic colors — the system is deliberately dichromatic (coral + neutrals)
- Don't use square corners on cards — minimum 5px radius, cards default to 15px
- Don't place body text on the hero image without a dark scrim or sufficient contrast — the hero photo is intentionally dark for text legibility
- Don't use outlined or ghost variants of the coral CTA — it is always a filled pill
- Don't stretch the marbled gradient across backgrounds or section dividers — it belongs only on the membership card artwork

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Page Canvas | `#ffffff` | Main content background for all sections below the hero |
| 1 | Card Surface | `#ffffff` | Membership card and content cards sit on canvas with hairline borders |
| 2 | Muted Surface | `#f4f4f5` | Subtle alt-row or footer surface |
| 3 | Floating Nav | `#18181b` | Dark pill navigation bar that floats over hero imagery |

## Elevation

- **Membership Card:** `rgba(0, 0, 0, 0.05) 0px 2px 2px 0px`

## Imagery

Full-bleed cinematic photography dominates the hero — a person silhouetted against a deep teal-blue sky, the image intentionally dark and moody to create emotional weight and counterpoint the clinical health promise. Secondary imagery uses tight, contained product-style crops (the marbled orange membership card, app screenshots) rather than lifestyle photography. No illustrations, no 3D renders, no abstract graphics — the photographic contrast IS the visual identity. The membership card features an organic marbled/lava-lamp pattern in Sunrise Coral tones, the only decorative visual element. Icons are line-based with a 7.5px radius (soft squircle), using thin strokes in Carbon Black.

## Agent Prompt Guide

**Quick Color Reference**
- text: #18181b (Carbon Black)
- background: #ffffff (Paper White)
- border: #e4e4e7 (Mist Gray)
- muted text: #71717a (Zinc Gray)
- accent: #fc5f2b (Sunrise Coral)
- primary action: no distinct CTA color

**3 Example Component Prompts**

No distinct primary action color was observed; use the extracted neutral button treatments instead of inventing a filled CTA color.


3. **FAQ Section**: White background, max-width 1200px centered. 'Frequently Asked Questions' heading at 45px weight 400 #18181b, left-aligned, 75px top margin. FAQ items: 30px question text in #18181b weight 400, 'Read more' ghost text link right-aligned at 13px #71717a. 11px row gap between items, no dividers or borders.

## Similar Brands

- **Eight Sleep** — Same full-bleed dark hero photography with a single warm accent color and large whispered-weight display type
- **Whoop** — Dichromatic health-tech palette (neutral + single vivid accent), pill CTAs, and flat-surface card system
- **Levels** — Compact density, tight negative letter-spacing on display type, and dark floating pill navigation over imagery
- **Function Health** — Clinical/wellness tone with full-bleed atmospheric photography and rationed color use

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-sunrise-coral: #fc5f2b;
  --color-coral-glow: #ff8b64;
  --gradient-coral-glow: linear-gradient(88deg, rgb(252, 95, 43), rgb(255, 139, 100) 90%, rgb(255, 255, 255));
  --color-carbon-black: #18181b;
  --color-pure-black: #000000;
  --color-zinc-gray: #71717a;
  --color-ash-gray: #a1a1aa;
  --color-mist-gray: #e4e4e7;
  --color-fog-gray: #f4f4f5;
  --color-paper-white: #ffffff;

  /* Typography — Font Families */
  --font-nb-international-pro: 'NB International Pro', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-nb-international-mono-pro: 'NB International Mono Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 11px;
  --leading-caption: 1.5;
  --tracking-caption: -0.005px;
  --text-body: 15px;
  --leading-body: 1.5;
  --tracking-body: -0.005px;
  --text-body-lg: 17px;
  --leading-body-lg: 1.4;
  --tracking-body-lg: -0.009px;
  --text-subheading: 19px;
  --leading-subheading: 1.4;
  --tracking-subheading: -0.009px;
  --text-heading-sm: 22px;
  --leading-heading-sm: 1.25;
  --tracking-heading-sm: -0.012px;
  --text-heading: 30px;
  --leading-heading: 1.2;
  --tracking-heading: -0.013px;
  --text-heading-lg: 45px;
  --leading-heading-lg: 1.13;
  --tracking-heading-lg: -0.015px;
  --text-display: 66px;
  --leading-display: 1;
  --tracking-display: -0.025px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-28: 28px;
  --spacing-60: 60px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 75px;
  --card-padding: 19px;
  --element-gap: 11px;

  /* Border Radius */
  --radius-md: 5px;
  --radius-lg: 7.4958px;
  --radius-xl: 11.2437px;
  --radius-xl-2: 14.9916px;
  --radius-2xl: 22.4874px;
  --radius-3xl: 29.9832px;
  --radius-full: 74.958px;
  --radius-full-2: 100px;
  --radius-full-3: 149.916px;
  --radius-full-4: 999px;
  --radius-full-5: 1440px;
  --radius-full-6: 9999px;

  /* Named Radii */
  --radius-cards: 15px;
  --radius-icons: 7.5px;
  --radius-pills: 9999px;
  --radius-navbar: 15px;
  --radius-buttons: 9999px;
  --radius-smallcards: 5px;

  /* Shadows */
  --shadow-subtle: rgba(0, 0, 0, 0.05) 0px 2px 2px 0px;

  /* Surfaces */
  --surface-page-canvas: #ffffff;
  --surface-card-surface: #ffffff;
  --surface-muted-surface: #f4f4f5;
  --surface-floating-nav: #18181b;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-sunrise-coral: #fc5f2b;
  --color-coral-glow: #ff8b64;
  --color-carbon-black: #18181b;
  --color-pure-black: #000000;
  --color-zinc-gray: #71717a;
  --color-ash-gray: #a1a1aa;
  --color-mist-gray: #e4e4e7;
  --color-fog-gray: #f4f4f5;
  --color-paper-white: #ffffff;

  /* Typography */
  --font-nb-international-pro: 'NB International Pro', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-nb-international-mono-pro: 'NB International Mono Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 11px;
  --leading-caption: 1.5;
  --tracking-caption: -0.005px;
  --text-body: 15px;
  --leading-body: 1.5;
  --tracking-body: -0.005px;
  --text-body-lg: 17px;
  --leading-body-lg: 1.4;
  --tracking-body-lg: -0.009px;
  --text-subheading: 19px;
  --leading-subheading: 1.4;
  --tracking-subheading: -0.009px;
  --text-heading-sm: 22px;
  --leading-heading-sm: 1.25;
  --tracking-heading-sm: -0.012px;
  --text-heading: 30px;
  --leading-heading: 1.2;
  --tracking-heading: -0.013px;
  --text-heading-lg: 45px;
  --leading-heading-lg: 1.13;
  --tracking-heading-lg: -0.015px;
  --text-display: 66px;
  --leading-display: 1;
  --tracking-display: -0.025px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-28: 28px;
  --spacing-60: 60px;

  /* Border Radius */
  --radius-md: 5px;
  --radius-lg: 7.4958px;
  --radius-xl: 11.2437px;
  --radius-xl-2: 14.9916px;
  --radius-2xl: 22.4874px;
  --radius-3xl: 29.9832px;
  --radius-full: 74.958px;
  --radius-full-2: 100px;
  --radius-full-3: 149.916px;
  --radius-full-4: 999px;
  --radius-full-5: 1440px;
  --radius-full-6: 9999px;

  /* Shadows */
  --shadow-subtle: rgba(0, 0, 0, 0.05) 0px 2px 2px 0px;
}
```
