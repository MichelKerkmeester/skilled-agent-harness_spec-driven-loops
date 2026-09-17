# Cluely — Style Reference
> blue dawn over mountain ridges — a premium product emerging from atmospheric gradient into crisp white workspace.

**Theme:** light

Cluely presents an atmospheric SaaS aesthetic anchored by a dramatic sky-to-mountain blue gradient hero that sets a premium, almost cinematic tone. The signature move is the pairing of a large editorial serif display headline (EB Garamond at 80px) with a precise modern sans-serif (Geist) for everything functional — this serif-meets-tech contrast is the visual identity. A single vivid blue accent (#3c83f6) powers the primary CTA, while the rest of the interface stays achromatic with soft cool-gray neutrals. Components lean compact and lightweight: 4px-radius buttons, 12-24px-radius cards, hairline borders in #e4e4e7, and no decorative shadows. The product screenshots are presented as floating, slightly tilted laptop frames — the app is the hero, not abstractions.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Signal Blue | `#3c83f6` | `--color-signal-blue` | Blue action color for filled buttons, selected navigation states, and focused conversion moments. |
| Deep Dusk | `#022c70` | `--color-deep-dusk` | Gradient terminal stop, button shadow depth — dark indigo that anchors the primary blue toward night |
| Azure Crest | `#0544a5` | `--color-azure-crest` | Supporting palette color for small decorative accents when the core palette needs contrast. Do not promote it to the primary CTA color |
| Hover Glow | `#81b6ff` | `--color-hover-glow` | Blue supporting accent for decorative details and low-frequency emphasis. Do not promote it to the primary CTA color |
| Ink Black | `#000000` | `--color-ink-black` | Maximum-emphasis text, logo wordmark, icon fills — true black for highest hierarchy |
| Carbon | `#18181b` | `--color-carbon` | Primary body and heading text — near-black with slight warmth, softer than pure black for long reading |
| Slate | `#2e3038` | `--color-slate` | Navigation text, icon strokes, secondary headings — dark cool gray for nav and structural elements |
| Steel | `#5e616e` | `--color-steel` | Muted body text, helper text — medium gray for supporting copy |
| Fog | `#777a88` | `--color-fog` | Tertiary text, captions, disabled states — lighter gray for de-emphasized content |
| Mist | `#afb3c4` | `--color-mist` | Icon strokes (most frequent use at 56 stroke instances), placeholder icons, secondary strokes — the workhorse cool-gray for line work |
| Vapor | `#edeef2` | `--color-vapor` | Card surface tint, body background alternates, subtle elevation base — cool off-white for layered surfaces |
| Frost | `#f3f8ff` | `--color-frost` | Tinted card background, hero-adjacent surfaces — barely-blue white that whispers atmospheric color |
| Chalk | `#ffffff` | `--color-chalk` | Primary card surface, page background, button text — pure white for max-brightness layers |
| Bone | `#e4e4e7` | `--color-bone` | Hairline borders (2500+ instances), dividers, input borders, icon borders — the dominant structural line color |
| Ash | `#d7d7d7` | `--color-ash` | Secondary borders, separator lines — slightly darker than Bone for tiered dividers |
| Neon | `#00ff26` | `--color-neon` | Green outline accent for tags, dividers, and focused UI edges |
| Cyan Veil | `#7df0f8` | `--color-cyan-veil` | Subtle highlight wash, code-block tints, decorative gradient stop — cool cyan as atmospheric detail |

## Tokens — Typography

### EB Garamond — Display headline — serif at 80px with -0.012em tracking is the signature move; only used for the hero '#1 Undetectable AI for Meetings' title, creating editorial gravitas against the sans-serif body. This anti-tech choice distinguishes Cluely from generic SaaS. · `--font-eb-garamond`
- **Substitute:** Playfair Display, Cormorant Garamond, Lora
- **Weights:** 500
- **Sizes:** 80px
- **Line height:** 1.02
- **Letter spacing:** -0.012em
- **Role:** Display headline — serif at 80px with -0.012em tracking is the signature move; only used for the hero '#1 Undetectable AI for Meetings' title, creating editorial gravitas against the sans-serif body. This anti-tech choice distinguishes Cluely from generic SaaS.

### Geist — All UI text — body copy, headings, buttons, nav, labels. Geist's tight letter-spacing at large sizes (-0.04em at 48px+) creates compact, engineered headlines. Weight 300 available for whisper-quiet secondary text, weight 500-600 for active states. The wide size range (9-56px) supports everything from micro-labels to section headings. · `--font-geist`
- **Substitute:** Inter, Geist Mono (for Geist), SF Pro Text
- **Weights:** 300, 400, 500, 600
- **Sizes:** 9px, 10px, 11px, 12px, 13px, 14px, 16px, 18px, 19px, 20px, 24px, 28px, 30px, 36px, 42px, 48px, 56px
- **Line height:** 1.00, 1.11, 1.13, 1.20, 1.25, 1.33, 1.38, 1.40, 1.43, 1.50, 1.56, 1.60
- **Letter spacing:** -0.040em at 48px, scaling to -0.005em at 14px, normal at 10px
- **Role:** All UI text — body copy, headings, buttons, nav, labels. Geist's tight letter-spacing at large sizes (-0.04em at 48px+) creates compact, engineered headlines. Weight 300 available for whisper-quiet secondary text, weight 500-600 for active states. The wide size range (9-56px) supports everything from micro-labels to section headings.

### ui-monospace — Code snippets, technical labels — system monospace at 10px, never decorative, only functional in product-mockup contexts · `--font-ui-monospace`
- **Substitute:** SF Mono, JetBrains Mono, Geist Mono
- **Weights:** 400
- **Sizes:** 10px
- **Line height:** 1.50
- **Role:** Code snippets, technical labels — system monospace at 10px, never decorative, only functional in product-mockup contexts

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 10px | 1.5 | — | `--text-caption` |
| body | 16px | 1.5 | -0.01px | `--text-body` |
| subheading | 20px | 1.38 | -0.018px | `--text-subheading` |
| heading-sm | 28px | 1.25 | -0.025px | `--text-heading-sm` |
| heading | 36px | 1.2 | -0.031px | `--text-heading` |
| heading-lg | 48px | 1.13 | -0.036px | `--text-heading-lg` |
| display | 80px | 1.02 | -0.96px | `--text-display` |

## Tokens — Spacing & Shapes

**Density:** compact

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 5 | 5px | `--spacing-5` |
| 6 | 6px | `--spacing-6` |
| 7 | 7px | `--spacing-7` |
| 8 | 8px | `--spacing-8` |
| 9 | 9px | `--spacing-9` |
| 10 | 10px | `--spacing-10` |
| 12 | 12px | `--spacing-12` |
| 14 | 14px | `--spacing-14` |
| 16 | 16px | `--spacing-16` |
| 18 | 18px | `--spacing-18` |
| 20 | 20px | `--spacing-20` |
| 28 | 28px | `--spacing-28` |
| 32 | 32px | `--spacing-32` |
| 40 | 40px | `--spacing-40` |
| 73 | 73px | `--spacing-73` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 12px |
| pills | 9999px |
| inputs | 8px |
| buttons | 4px |
| feature-cards | 24px |
| product-mockup | 16px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| subtle | `rgb(12, 68, 161) 0px 0px 0px 0.5px, rgb(2, 44, 112) 0px -...` | `--shadow-subtle` |
| subtle-2 | `rgba(207, 226, 255, 0.24) 0px 0px 0px 1px, rgba(255, 255,...` | `--shadow-subtle-2` |
| subtle-3 | `rgba(255, 255, 255, 0.25) 0px -1px 0px 0px` | `--shadow-subtle-3` |
| lg | `rgba(0, 0, 0, 0.05) 0px 2px 20px -1px inset` | `--shadow-lg` |
| lg-2 | `rgba(148, 172, 243, 0.4) 20px 20px 24px 0px, rgba(191, 22...` | `--shadow-lg-2` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 64px
- **Card padding:** 24px
- **Element gap:** 8px

## Components

### Primary CTA Button
**Role:** Main conversion action — 'Get for Mac', download links

Filled Signal Blue (#3c83f6) background, white text in Geist weight 500 at 16px, 4px border-radius, 10px 20px padding. Gains a layered shadow on hover: 0.5px ring in #0544a9, 1px inset highlight in #81b6ff, and -1px inset shadow in #022c70. The shadow stack gives the flat blue button a glassy, illuminated depth rather than a drop shadow.

### Sticky Notification Bar
**Role:** Service-disruption or announcement banner at page top

Full-width thin bar with Bone (#e4e4e7) background, centered text in Geist 14px weight 400 in Carbon (#18181b), with a pill-shaped Signal Blue button on the right (border-radius 9999px, 4-8px vertical padding). The bar is not sticky — it scrolls away.

### Top Navigation
**Role:** Primary site navigation — logo + links + CTA

Transparent on hero (text white over gradient), switches to white with Carbon text on scroll. Logo wordmark at 20px Geist weight 600, nav links in Geist 14px weight 400 in Slate (#2e3038) with 24px gaps. CTA mirrors the primary button at smaller scale (12px text, 4px radius).

### Hero Gradient Banner
**Role:** First-screen atmospheric background

Full-bleed radial gradient from sky blue (#73a8e8) through deep blue (#1c38ea) to mountain-indigo, with a subtle mountain landscape illustration overlay. No flat color section follows the hero — the gradient bleeds into the product mockup, which sits on a Frost (#f3f8ff) tint band.

### Display Headline
**Role:** Hero h1 — the brand statement

EB Garamond 80px weight 500, white (#ffffff) text over the blue gradient, line-height 1.02, letter-spacing -0.012em. Centered. This is the only serif text on the entire site; its presence is the signature.

### Product Mockup Frame
**Role:** Floating laptop/app screenshot in hero and feature sections

Slightly perspective-tilted laptop frame with 16px border-radius, containing a dark-themed product UI screenshot. Floats over the hero gradient or over white card backgrounds. The dark app UI inside (#1a1a1a) contrasts with the light surrounding canvas.

### Feature Card — Blue Variant
**Role:** Highlighted feature card in 'How Cluely helps' section

24px border-radius, Frost (#f3f8ff) background, 24px padding, no shadow. Heading in Geist 20px weight 500 in Carbon, body in Geist 16px weight 400 in Steel (#5e616e). The blue tint differentiates it from sibling white cards in the same row.

### Feature Card — White Variant
**Role:** Standard feature card

24px border-radius, pure white (#ffffff) background with 1px Bone (#e4e4e7) border, 24px padding, no shadow. Same typography as the blue variant. The border defines it against the white page background.

### Three-Column Feature Grid
**Role:** Feature showcase in the 'Suite of features' section

Three equal-width cards in a row, each with 12px border-radius, white background, 1px Bone border, containing a product mockup image above a bold heading (Geist 18px weight 600) and body copy. 24-32px gap between cards.

### Compatible Tools Row
**Role:** Logo bar showing platform compatibility

Centered horizontal row of tool logos (Zoom, Slack, Webex, Microsoft Teams, Google Meet), each in muted Mist (#afb3c4) with a small colored icon, separated by 32-48px gaps. Small uppercase Geist caption above in 'COMPATIBLE WITH EVERY TOOL' style with 0.15em tracking.

### Pill Badge / Tag
**Role:** Status indicators, 'no bots detected' badge, feature labels

Pill-shaped (border-radius 9999px), 4-6px vertical padding, 10-14px horizontal padding. Background varies: Vapor (#edeef2) for neutral, Neon (#00ff26) border for success/active state. Text in Geist 12-13px weight 500 in Carbon.

### Input Field
**Role:** Ask question or "What should I say?" type input in product UI

Dark-themed (inside product mockup) with rgba(0,0,0,0.05) 2px 20px inset shadow, 8px border-radius, 12px padding. Placeholder text in Geist 14px in muted gray. Send button: circular Signal Blue, white arrow icon.

### Video Conference Card
**Role:** Meeting participant list inside the "Invisible to screen share" feature card

White card with 1px Bone border, 12px radius, showing avatar circles (24px), names in Geist 14px weight 500, email in Geist 12px in Steel, and role tag (Speaker/Organizer) right-aligned. Compact 8-12px row padding.

## Do's and Don'ts

### Do
- Use the EB Garamond 80px display headline ONLY for the hero h1 — never for section headings or body. Section headings use Geist 36-48px weight 500.
- Set primary CTA background to Signal Blue (#3c83f6) with white text, 4px border-radius, 10px 20px padding. Apply the layered ring+inset shadow stack on hover for the glassy illuminated effect.
- Use #e4e4e7 (Bone) for all hairline borders at 1px — it dominates at 2500+ instances and is the structural line color. Step to #d7d7d7 only for secondary dividers.
- Apply tight negative letter-spacing at large sizes: -0.036em at 48px, -0.025em at 28px, -0.01em at 16px. Geist headlines should feel engineered and compact, not airy.
- Use the Frost (#f3f8ff) tint for the first card or band after the hero — it carries the atmospheric blue downward as a subtle bridge into the white workspace.
- Show product screenshots inside 16px-radius laptop frames, floating without drop shadows. The dark app UI inside the frame is the focal point; the frame is invisible.
- Use the blue gradient (linear #0544a9 → #022c70 or radial #1e82e0 → #1c38ea) only for the hero and primary CTA shadow base — never for full-page backgrounds.

### Don't
- Do not use the EB Garamond serif for any text other than the 80px hero display. Using it at body or subheading sizes dilutes its signature impact.
- Do not apply drop shadows to cards or surfaces. The design uses hairline borders (#e4e4e7) and color contrast for separation; shadows are reserved for the CTA and product mockup frames.
- Do not use the Neon green (#00ff26) as a functional status color — it is decorative only. For success states, use a muted green or a bordered tag instead.
- Do not use card border-radius values outside the 12-24px range for content cards. 4px is for buttons only; 32px+ is for pill shapes. Mixing them breaks the component hierarchy.
- Do not use letter-spacing wider than -0.005em on body text. Geist is designed for compact tracking; loosening it makes the UI feel generic.
- Do not introduce additional saturated colors beyond Signal Blue. The 2% colorfulness score is the constraint — one accent, achromatic everywhere else.
- Do not use the white-on-white surface stack without a border or tint. Pure white cards on pure white pages need a 1px Bone (#e4e4e7) border or a Frost (#f3f8ff) background to be visible.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas | `#ffffff` | Page background — pure white, the brightest layer |
| 1 | Frost Tint | `#f3f8ff` | Hero-adjacent band, first card variant — barely-blue white that carries atmospheric warmth downward |
| 2 | Vapor Layer | `#edeef2` | Alternate card surface, feature block background — cool off-white for subtle contrast stacking |
| 3 | Bone Border | `#e4e4e7` | Hairline divider, input outline, icon stroke — the structural line color threading through all surfaces |

## Elevation

- **Primary CTA Button:** `0 0 0 0.5px #0544a9, inset 0 -1px 0 0 #022c70, inset 0 0.5px 0 0 #81b6ff`
- **Product Mockup Frame:** `0 0 0 1px rgba(207,226,255,0.24), inset 0 -0.5px 0 0 rgba(255,255,255,0.8)`
- **Input Field (in product UI):** `inset 0 2px 20px -1px rgba(0,0,0,0.05)`
- **Highlighted Link/Card:** `20px 20px 24px 0 rgba(148,172,243,0.4), inset -3px -3px 4px 0 rgba(191,229,251,0.4), inset 4px 4px 4px 0 rgba(19,26,228,0.1)`

## Imagery

Imagery strategy is product-first: the dominant visual is always a screenshot of the Cluely app running inside a laptop frame, presented at slight perspective tilt. These mockups appear in the hero (centered, floating over the gradient) and in each feature card (top-aligned, filling the card width). The app UI itself is dark-themed (near-black backgrounds with white text and Signal Blue accents) — the dark product against the light page creates immediate contrast. The hero also features an atmospheric landscape illustration (mountain ridges under a blue sky) that bleeds into the gradient background. No lifestyle photography, no stock imagery, no abstract decorative graphics beyond the gradient and product frames.

## Layout

Page is centered max-width 1200px with full-bleed sections. The hero is a full-viewport atmospheric gradient with a centered serif headline and a product mockup floating in the lower half. Below the hero, the layout transitions to a white workspace with alternating card-based sections: a two-column row (blue-tint card + white card), then a three-column feature grid, then a centered logo compatibility row. Sections are separated by 64px vertical gaps. The top nav is minimal — logo left, 3 links center, CTA right — and is transparent over the hero, switching to white on scroll. Content density is compact: cards have 24px padding, elements have 8-12px gaps, and the overall feel is a single long scrollable page broken into clear horizontal bands.

## Agent Prompt Guide

## Quick Color Reference
- Primary text: #18181b (Carbon)
- Secondary text: #5e616e (Steel)
- Page background: #ffffff (Chalk)
- Card surface: #ffffff with #e4e4e7 border
- Accent / tint: #f3f8ff (Frost)
- primary action: #3c83f6 (filled action)

## Example Component Prompts
1. Create a Primary Action Button: #3c83f6 background, #ffffff text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.

2. **Feature card (blue variant)**: 24px border-radius, #f3f8ff background, 24px padding. Heading in Geist 20px weight 500 #18181b. Body in Geist 16px weight 400 #5e616e. No shadow. 1px #e4e4e7 border optional.

3. **Primary CTA button**: Background #3c83f6, white text, Geist 16px weight 500, 4px border-radius, 10px vertical / 20px horizontal padding. On hover add shadow stack: 0 0 0 0.5px #0544a9, inset 0 -1px 0 0 #022c70, inset 0 0.5px 0 0 #81b6ff.

4. **Section heading**: Geist 36px weight 500, #18181b, letter-spacing -0.031em, line-height 1.20. Left-aligned or centered depending on section. Follow with Geist 18px weight 400 #5e616e subheading.

5. **Logo compatibility row**: Centered horizontal flex row with 40px gaps. Each logo: 24px height, rendered in #afb3c4 (Mist). Above the row: uppercase Geist 12px caption in #777a88 with 0.15em letter-spacing ('COMPATIBLE WITH EVERY TOOL').

## Similar Brands

- **Linear** — Same Geist-family typography, compact density, achromatic workspace with a single vivid accent, and 4px-radius buttons against a near-white canvas
- **Raycast** — Atmospheric gradient hero transitioning into a clean product workspace, dark-mode product screenshots floating over light page, compact card grid for features
- **Cursor** — Tech-product hero with large display headline over gradient, laptop-frame product mockup, and blue accent on an otherwise achromatic interface
- **Vercel** — Near-monochrome interface with a single signal color, hairline-border cards, and tight letter-spacing on Geist/Inter-class sans-serif at all heading sizes
- **Stripe** — Editorial serif (EB Garamond / Söhne pairing similar in intent) for the hero display, gradient hero background, and compact information density in feature sections

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-signal-blue: #3c83f6;
  --color-deep-dusk: #022c70;
  --color-azure-crest: #0544a5;
  --color-hover-glow: #81b6ff;
  --color-ink-black: #000000;
  --color-carbon: #18181b;
  --color-slate: #2e3038;
  --color-steel: #5e616e;
  --color-fog: #777a88;
  --color-mist: #afb3c4;
  --color-vapor: #edeef2;
  --color-frost: #f3f8ff;
  --color-chalk: #ffffff;
  --color-bone: #e4e4e7;
  --color-ash: #d7d7d7;
  --color-neon: #00ff26;
  --color-cyan-veil: #7df0f8;

  /* Typography — Font Families */
  --font-eb-garamond: 'EB Garamond', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-geist: 'Geist', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-ui-monospace: 'ui-monospace', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.5;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.01px;
  --text-subheading: 20px;
  --leading-subheading: 1.38;
  --tracking-subheading: -0.018px;
  --text-heading-sm: 28px;
  --leading-heading-sm: 1.25;
  --tracking-heading-sm: -0.025px;
  --text-heading: 36px;
  --leading-heading: 1.2;
  --tracking-heading: -0.031px;
  --text-heading-lg: 48px;
  --leading-heading-lg: 1.13;
  --tracking-heading-lg: -0.036px;
  --text-display: 80px;
  --leading-display: 1.02;
  --tracking-display: -0.96px;

  /* Typography — Weights */
  --font-weight-light: 300;
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-5: 5px;
  --spacing-6: 6px;
  --spacing-7: 7px;
  --spacing-8: 8px;
  --spacing-9: 9px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-14: 14px;
  --spacing-16: 16px;
  --spacing-18: 18px;
  --spacing-20: 20px;
  --spacing-28: 28px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-73: 73px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 64px;
  --card-padding: 24px;
  --element-gap: 8px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-3xl: 24px;
  --radius-3xl-2: 32px;
  --radius-full: 110.25px;

  /* Named Radii */
  --radius-cards: 12px;
  --radius-pills: 9999px;
  --radius-inputs: 8px;
  --radius-buttons: 4px;
  --radius-feature-cards: 24px;
  --radius-product-mockup: 16px;

  /* Shadows */
  --shadow-subtle: rgb(12, 68, 161) 0px 0px 0px 0.5px, rgb(2, 44, 112) 0px -1px 0px 0px inset, rgb(129, 182, 255) 0px 0.5px 0px 0px inset;
  --shadow-subtle-2: rgba(207, 226, 255, 0.24) 0px 0px 0px 1px, rgba(255, 255, 255, 0.8) 0px -0.5px 0px 0px;
  --shadow-subtle-3: rgba(255, 255, 255, 0.25) 0px -1px 0px 0px;
  --shadow-lg: rgba(0, 0, 0, 0.05) 0px 2px 20px -1px inset;
  --shadow-lg-2: rgba(148, 172, 243, 0.4) 20px 20px 24px 0px, rgba(191, 229, 251, 0.4) -3px -3px 4px 0px inset, rgba(19, 26, 228, 0.1) 4px 4px 4px 0px inset;

  /* Surfaces */
  --surface-canvas: #ffffff;
  --surface-frost-tint: #f3f8ff;
  --surface-vapor-layer: #edeef2;
  --surface-bone-border: #e4e4e7;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-signal-blue: #3c83f6;
  --color-deep-dusk: #022c70;
  --color-azure-crest: #0544a5;
  --color-hover-glow: #81b6ff;
  --color-ink-black: #000000;
  --color-carbon: #18181b;
  --color-slate: #2e3038;
  --color-steel: #5e616e;
  --color-fog: #777a88;
  --color-mist: #afb3c4;
  --color-vapor: #edeef2;
  --color-frost: #f3f8ff;
  --color-chalk: #ffffff;
  --color-bone: #e4e4e7;
  --color-ash: #d7d7d7;
  --color-neon: #00ff26;
  --color-cyan-veil: #7df0f8;

  /* Typography */
  --font-eb-garamond: 'EB Garamond', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-geist: 'Geist', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-ui-monospace: 'ui-monospace', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.5;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.01px;
  --text-subheading: 20px;
  --leading-subheading: 1.38;
  --tracking-subheading: -0.018px;
  --text-heading-sm: 28px;
  --leading-heading-sm: 1.25;
  --tracking-heading-sm: -0.025px;
  --text-heading: 36px;
  --leading-heading: 1.2;
  --tracking-heading: -0.031px;
  --text-heading-lg: 48px;
  --leading-heading-lg: 1.13;
  --tracking-heading-lg: -0.036px;
  --text-display: 80px;
  --leading-display: 1.02;
  --tracking-display: -0.96px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-5: 5px;
  --spacing-6: 6px;
  --spacing-7: 7px;
  --spacing-8: 8px;
  --spacing-9: 9px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-14: 14px;
  --spacing-16: 16px;
  --spacing-18: 18px;
  --spacing-20: 20px;
  --spacing-28: 28px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-73: 73px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-3xl: 24px;
  --radius-3xl-2: 32px;
  --radius-full: 110.25px;

  /* Shadows */
  --shadow-subtle: rgb(12, 68, 161) 0px 0px 0px 0.5px, rgb(2, 44, 112) 0px -1px 0px 0px inset, rgb(129, 182, 255) 0px 0.5px 0px 0px inset;
  --shadow-subtle-2: rgba(207, 226, 255, 0.24) 0px 0px 0px 1px, rgba(255, 255, 255, 0.8) 0px -0.5px 0px 0px;
  --shadow-subtle-3: rgba(255, 255, 255, 0.25) 0px -1px 0px 0px;
  --shadow-lg: rgba(0, 0, 0, 0.05) 0px 2px 20px -1px inset;
  --shadow-lg-2: rgba(148, 172, 243, 0.4) 20px 20px 24px 0px, rgba(191, 229, 251, 0.4) -3px -3px 4px 0px inset, rgba(19, 26, 228, 0.1) 4px 4px 4px 0px inset;
}
```
