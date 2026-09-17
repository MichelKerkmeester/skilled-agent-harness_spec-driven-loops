# Lovi — Style Reference
> prescription violet on porcelain

**Theme:** light

Lóvi operates as a prescription-grade beauty interface: deep indigo ink on near-white porcelain, with a single saturated violet as the brand voice. The visual system is deliberately clinical-minimal — almost all surfaces are paper-white or bone, borders are hairline or non-existent, and the only significant shadow is a single low-opacity elevation wash. Typography is split between a custom geometric display face (ES Rebond Grotesque) for headlines and a neutral sans (Inter) for body, creating a clear hierarchy without color shouting. The rich chromatic spectrum detected in raw data (pinks, greens, oranges) is almost entirely decorative or illustrative — design-system tokens are austere: one brand violet, a muted lavender for secondary text, and a handful of semantic accents. Every screen should feel like a clinical leaflet: calm, confident, printed rather than rendered.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Indigo Ink | `#151581` | `--color-indigo-ink` | Primary headlines, body emphasis, and brand voice — this is the only color that carries the brand identity. All top-level headings and primary body text are set in this violet rather than black, giving every screen a tinted authority without ever feeling decorative |
| Electric Violet | `linear-gradient(270deg, rgba(102, 127, 255, 0.8) 19.614%, rgba(206, 162, 255, 0.8) 50.0389%, rgba(255, 133, 177, 0.8) 86.0908%)` | `--color-electric-violet` | Violet supporting accent for decorative details and low-frequency emphasis. Do not promote it to the primary CTA color; Voice-bar and scan-overlay gradient sweeping Electric Violet → Lilac → Petal Blush — the signature visual of the AI interaction moment |
| Lavender Mist | `#a1a1cd` | `--color-lavender-mist` | Secondary body text, muted links, and sub-labels — sits one step down from Indigo Ink on the same hue, creating a tonal ladder without introducing a different color family |
| Lilac Accent | `#9f73e6` | `--color-lilac-accent` | Decorative and illustrative accent — used in iconography, gradient midpoints, and the scan/voice visual treatment rather than for UI controls |
| Petal Blush | `#de62de` | `--color-petal-blush` | Decorative accent in illustrations and the brand gradient — supports the scan/face-overlay visual treatment, not part of the UI palette |
| Verified Green | `#00bb76` | `--color-verified-green` | Green supporting accent for decorative details and low-frequency emphasis. Use as a supporting accent, not as a status color |
| Alert Rose | `#f25c75` | `--color-alert-rose` | Red supporting accent for decorative details and low-frequency emphasis. Use as a supporting accent, not as a status color |
| Info Blue | `#20a2e3` | `--color-info-blue` | Blue supporting accent for decorative details and low-frequency emphasis. Use as a supporting accent, not as a status color |
| Porcelain | `#f6f6fa` | `--color-porcelain` | Dominant page canvas — every section breathes on this near-white, slightly cool surface |
| Paper White | `#ffffff` | `--color-paper-white` | Card surfaces, phone mockup screen, and elevated content blocks — sits one step above Porcelain for subtle layering |
| Bone | `#f6f5f4` | `--color-bone` | Warm surface for review cards and section blocks that need tonal separation from the cool Porcelain canvas |
| Fog | `#d6d6d6` | `--color-fog` | Hairline borders, divider lines, and the ambient shadow tint source — the only structural gray in the system |
| Pebble | `#bfbfbd` | `--color-pebble` | Inactive controls, placeholder fills, and tertiary borders — warm gray that recedes |
| Graphite | `#292824` | `--color-graphite` | Dark mode text and icon fills — near-black with a faint warm cast, used when maximum contrast is needed against light surfaces |
| Ash | `#949392` | `--color-ash` | Secondary metadata, timestamps, and de-emphasized body text — sits between Graphite and Pebble in the neutral scale |

## Tokens — Typography

### sans-serif — sans-serif — detected in extracted data but not described by AI · `--font-sans-serif`
- **Weights:** 400
- **Sizes:** 12px
- **Line height:** 1.2
- **Role:** sans-serif — detected in extracted data but not described by AI

### ES Rebond Grotesque — Display and heading face — used at 28–48px weight 400 for hero headlines, section titles, and brand statements. The geometric construction and uniform weight (no bold) create an anti-convention restraint: authority through proportions, not stroke thickness. The 'ss02' feature setting activates a specific alternate glyph set that gives the headlines their slightly architectural feel. Substitute: Inter Tight or Manrope as a free alternative, though the exact geometric warmth will differ. · `--font-es-rebond-grotesque`
- **Weights:** 400
- **Sizes:** 14px, 16px, 20px, 22px, 28px, 32px, 44px, 48px
- **Line height:** 0.91–1.14
- **Letter spacing:** -0.0420em at 48px, -0.0360em at 44px, -0.0310em at 32px, -0.0230em at 28px
- **OpenType features:** `"ss02" on`
- **Role:** Display and heading face — used at 28–48px weight 400 for hero headlines, section titles, and brand statements. The geometric construction and uniform weight (no bold) create an anti-convention restraint: authority through proportions, not stroke thickness. The 'ss02' feature setting activates a specific alternate glyph set that gives the headlines their slightly architectural feel. Substitute: Inter Tight or Manrope as a free alternative, though the exact geometric warmth will differ.

### ES Rebond Grotesque Medium — Sub-heading and emphasis face — used for 14–22px text that needs a touch more presence than Inter body, like card titles and emphasized inline text within body copy. · `--font-es-rebond-grotesque-medium`
- **Weights:** 400
- **Sizes:** 14px, 16px, 20px, 22px
- **Line height:** 1.09–1.25
- **Letter spacing:** -0.0450em at 22px, -0.0360em at 20px, -0.0310em at 16px, -0.0250em at 14px
- **Role:** Sub-heading and emphasis face — used for 14–22px text that needs a touch more presence than Inter body, like card titles and emphasized inline text within body copy.

### Inter — Primary body and UI face — covers all functional text from 9px metadata to 24px subheadings. Weight 400 for body, 500 for labels and emphasis, 600 for strong UI elements. Substitute: keep Inter — it's already free and ubiquitous. · `--font-inter`
- **Weights:** 400, 500, 600
- **Sizes:** 9px, 12px, 14px, 16px, 18px, 24px
- **Line height:** 1.11–1.43
- **Letter spacing:** -0.0620em at 24px down to -0.0190em at 9px — a continuous tightening scale
- **Role:** Primary body and UI face — covers all functional text from 9px metadata to 24px subheadings. Weight 400 for body, 500 for labels and emphasis, 600 for strong UI elements. Substitute: keep Inter — it's already free and ubiquitous.

### Geist — Secondary body face for specific content blocks — used where a slightly different rhythm is desired. The 'dlig', 'ss01', 'ss02', 'ss06' features activate Geist's discretionary ligatures and alternate sets for a more refined reading experience. Substitute: Inter (close enough) or Geist Sans (free). · `--font-geist`
- **Weights:** 400
- **Sizes:** 16px, 18px
- **Line height:** 1.22, 1.38
- **Letter spacing:** -0.0310em, -0.0280em
- **OpenType features:** `"dlig" on, "ss01" on, "ss02" on, "ss06" on`
- **Role:** Secondary body face for specific content blocks — used where a slightly different rhythm is desired. The 'dlig', 'ss01', 'ss02', 'ss06' features activate Geist's discretionary ligatures and alternate sets for a more refined reading experience. Substitute: Inter (close enough) or Geist Sans (free).

### Inter-Medium — Inter-Medium — detected in extracted data but not described by AI · `--font-inter-medium`
- **Weights:** 500
- **Sizes:** 14px, 16px, 20px, 24px
- **Line height:** 1.2, 1.25, 1.29
- **Letter spacing:** -0.071, -0.05, -0.044, -0.042, -0.037, -0.031
- **Role:** Inter-Medium — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.2 | -0.25px | `--text-caption` |
| body-sm | 14px | 1.29 | -0.35px | `--text-body-sm` |
| body | 16px | 1.38 | -0.44px | `--text-body` |
| body-lg | 18px | 1.38 | -0.5px | `--text-body-lg` |
| subheading | 24px | 1.25 | -1.49px | `--text-subheading` |
| heading-sm | 28px | 1.14 | -0.64px | `--text-heading-sm` |
| heading | 32px | 1.05 | -0.99px | `--text-heading` |
| heading-lg | 44px | 0.92 | -1.58px | `--text-heading-lg` |
| display | 48px | 0.91 | -2.02px | `--text-display` |

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
| 52 | 52px | `--spacing-52` |
| 56 | 56px | `--spacing-56` |
| 64 | 64px | `--spacing-64` |
| 104 | 104px | `--spacing-104` |
| 112 | 112px | `--spacing-112` |
| 120 | 120px | `--spacing-120` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 12px |
| cards | 24px |
| images | 16px |
| buttons | 48px |
| phone-mockup | 36-40px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| xl | `rgba(36, 36, 41, 0.07) 0px 8px 34px 0px, rgba(37, 36, 41,...` | `--shadow-xl` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 24px
- **Element gap:** 8-12px

## Components

### Top Navigation
**Role:** Sticky minimal header with brand mark and app store link

Pure white background, 16px horizontal padding. Brand mark (Lóvi logotype) at left in Indigo Ink (#151581), App Store download badge at right — a standard 135×40px black pill with Apple logo and 'Download on the App Store' text. No nav links, no menu — the page is a single-scroll landing.

### Award Banner
**Role:** Pill-shaped trust badge floating above the hero headline

White pill with 9999px radius, 2px vertical padding, subtle border. Contains a sparkle emoji and 'Lóvi won Beauty Innovation Award!' in Inter 12px weight 400, Indigo Ink. Soft, understated social proof — not a loud banner.

### Hero Headline Block
**Role:** Centered three-line display headline with subtext

ES Rebond Grotesque 48px weight 400, Indigo Ink, letter-spacing -2.02px, line-height 0.91. Three lines, centered. Subtext in Inter 18px weight 400, Lavender Mist (#a1a1cd), 16px margin-top.

### Phone Mockup with Face Scan
**Role:** Hero visual — iPhone frame with live face scan interface

iPhone device frame at ~320px wide, 40px border-radius, the signature dual shadow (rgba(36,36,41,0.07) 0px 8px 34px + rgba(37,36,41,0.09) 0px 1px 2px). Screen shows a cropped face photograph with 'Face scan in progress...' text in white at top. The scan overlay is the most visually complex element on the page.

### Voice Input Bar
**Role:** Bottom-of-screen input pill within the phone mockup

Translucent glass bar at phone bottom, 24px radius, the brand gradient (blue→purple→pink) at 0.8 opacity as background. Contains 'Ask Lóvi anything' placeholder text in white Inter 14px and a waveform icon at right. This is the signature gradient moment.

### Feature Description Block
**Role:** Scroll-reveal text block beneath the hero

Two-paragraph feature copy in ES Rebond Grotesque Medium 22px, Indigo Ink, left-aligned, max-width ~480px. Second paragraph uses a scroll-fade effect (text reveals as user scrolls past). Scattered emoji icons (🌈, 👃, 💎) are inline with the text for visual punctuation.

### Review Card
**Role:** User testimonial with star rating and verified badge

White card on Porcelain background, no border, 24px padding, 24px radius. Top row: 5 green stars (#00bb76) left, 'Verified' badge in Verified Green right. Title in Inter Medium 16px Indigo Ink, body in Inter 14px weight 400 Graphite. 3-column grid with 16px gap. Very card-light — no shadow, no border, just tonal separation from the canvas.

### Verified Badge
**Role:** Trust indicator on review cards

Inline text 'Verified' in Inter 12px weight 500, Verified Green (#00bb76). No pill, no background — just the green text. Restrained but unmistakable.

### Star Rating
**Role:** 5-star display on review cards

5 small green star icons (#00bb76), ~14px each, inline. The green stars instead of gold/orange is a deliberate brand choice — medical-verified rather than entertainment-positive.

### Medical Authority Section
**Role:** 'Medically backed by professionals' section with expert cards

Section title in ES Rebond Grotesque 28px Indigo Ink, centered, 'Medically backed by professionals' format. Below: 3-column card grid with 16px gap. Each card: oval/circular cropped photo of a doctor (8px radius, aspect ratio ~3:4), name in Inter Medium 16px Indigo Ink below.

### Doctor/Expert Card
**Role:** Professional profile card in the medical authority section

White background, 24px radius, 24px padding. Portrait photo at top in 8px-radius rounded rectangle. Name in ES Rebond Grotesque Medium 20px Indigo Ink, title in Inter 14px Lavender Mist. No border, no shadow — tonal layering only. Circular right-arrow button at 48×48px for carousel navigation.

### Carousel Arrow
**Role:** Right/left navigation for scrollable card rows

48×48px circle, white background, Graphite arrow icon centered. No border, subtle shadow on hover only. Sits overlapping the right edge of the card row at vertical center.

### Section Container
**Role:** Large rounded section block (reviews, professionals)

White or Bone background, 40px radius, 48-64px internal padding, 24px gap from neighboring sections. These containers float on the Porcelain canvas and carry the subtle dual shadow. The 40px radius is a signature — much larger than typical card rounding.

### Beauty Award Seal
**Role:** Circular trust badge in bottom-right corner

Small circular seal (~48px diameter) in bottom-right viewport position, dark background with white text. Acts as a persistent trust signal across scroll. Fixed position.

## Do's and Don'ts

### Do
- Set all primary headings and body text in Indigo Ink (#151151) — never pure black (#000000). The violet is the brand voice; black would make the page feel generic.
- Use ES Rebond Grotesque for all display text 28px and above, weight 400 only. The uniform weight is the signature — do not introduce bold headlines.
- Apply 24px radius to cards and 40-48px radius to large section containers. The contrast between card rounding (24px) and section rounding (40px) is what makes the layout feel like floating tablets rather than nested boxes.
- Use the dual shadow pattern (rgba(36,36,41,0.07) 0px 8px 34px 0px + rgba(37,36,41,0.09) 0px 1px 2px 0px) for any element that needs elevation. This is the only shadow in the system.
- Center-align all hero and section-level content. Left-align only within cards and feature description blocks. The centered rhythm is essential to the clinical-leaflet feel.
- Reserve the brand gradient (blue→purple→pink) exclusively for the voice input bar and scan-related overlays. No other element should use multi-color fills.
- Use Verified Green (#00bb76) for all trust signals — stars, checkmarks, verified badges. Never use gold or yellow for ratings.

### Don't
- Do not use bold or semibold display headlines. ES Rebond Grotesque at weight 400 is the rule; weight 500+ breaks the restraint.
- Do not add colored buttons, filled CTAs, or solid action backgrounds. The system has no distinct CTA color — actions should be neutral pills, ghost outlines, or text links.
- Do not use borders on cards. Use tonal layering (white card on Porcelain canvas) or the dual shadow for separation. Borders make the design feel boxy.
- Do not introduce new colors beyond the palette. The rich chromatic spectrum in the data is decorative/illustrative only — UI must stay in the violet-on-white family plus semantic accents.
- Do not use tight line-heights on body text. Body copy needs 1.29-1.38 line-height — the headlines are tight (0.91-1.14), but body should breathe.
- Do not place the brand gradient on large backgrounds, hero sections, or decorative shapes. It is a micro-element treatment only — the voice bar and scan overlay are its only homes.
- Do not use more than 3 columns in any grid. The review and expert sections use 3 columns max; wider content should stack vertically.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas | `#f6f6fa` | Dominant page background — the cool near-white that every section sits on |
| 1 | Card | `#ffffff` | Elevated content blocks, phone mockup screen, and review cards |
| 2 | Warm Block | `#f6f5f4` | Tonal section backgrounds and review containers for warm separation |

## Elevation

- **Phone mockup:** `rgba(36, 36, 41, 0.07) 0px 8px 34px 0px, rgba(37, 36, 41, 0.09) 0px 1px 2px 0px`
- **Section cards:** `rgba(36, 36, 41, 0.07) 0px 8px 34px 0px, rgba(37, 36, 41, 0.09) 0px 1px 2px 0px`

## Imagery

Photography is the dominant visual medium — real human faces fill the hero (cropped, mid-scan) and the medical authority section (full professional portraits). Treatment: tight crops, natural skin tones, no heavy filters, no duotone. The faces are always authentic and slightly imperfect — freckled, varied skin tones — reinforcing the medical-credibility message. The phone mockup overlays a live scan treatment on one face. Iconography is minimal: scattered emoji (🌈 👃 💎) appear inline with feature copy for visual punctuation, and small sparkle/award glyphs in badges. No illustrations, no 3D renders, no abstract graphics — the design is photographic + typographic only. The beauty award seal in the bottom-right is a small dark circular badge that persists across scroll.

## Layout

Single-column centered layout, max-width 1200px, with all content centered horizontally. The hero is a vertical stack: award pill → headline → subtext → phone mockup, with generous vertical breathing room (80px+ between elements). Below the hero, sections alternate between full-width white containers with 40px radius floating on the Porcelain canvas, and direct-on-canvas content blocks. The review section uses a 3-column card grid. The medical authority section uses a 3-column card grid with a carousel arrow for overflow. Navigation is a minimal top bar — no menu, no links, just logo and App Store badge. No sidebar, no sticky elements beyond the award seal. The overall rhythm is: generous whitespace, centered stacks, horizontal grids only when comparing (reviews, experts). Sections are separated by large vertical gaps (80px) rather than dividers — the whitespace IS the divider.

## Agent Prompt Guide

**Quick Color Reference**
- Text (primary): #151581 (Indigo Ink)
- Text (secondary): #a1a1cd (Lavender Mist)
- Text (body neutral): #292824 (Graphite)
- Background (canvas): #f6f6fa (Porcelain)
- Background (card): #ffffff (Paper White)
- Border/divider: #d6d6d6 (Fog)
- Accent: #5465ff (Electric Violet)
- Verified/trust: #00bb76 (Verified Green)
- primary action: no distinct CTA color

**Example Component Prompts**

1. *Create a hero section:* Porcelain (#f6f6fa) background. Headline 'Science-backed AI Cosmetologist you can trust' at ES Rebond Grotesque 48px weight 400, #151581, letter-spacing -2.02px, line-height 0.91, centered. Subtext 'Focused around you and your beauty' in Inter 18px weight 400, #a1a1cd, centered, 16px margin-top. Below: iPhone mockup 320px wide, 40px radius, shadow rgba(36,36,41,0.07) 0px 8px 34px 0px + rgba(37,36,41,0.09) 0px 1px 2px 0px.

2. *Create a review card:* White (#ffffff) background, 24px radius, 24px padding, no border. Top row: 5 green stars (#00bb76) at 14px left-aligned, 'Verified' text in Inter 12px weight 500 #00bb76 right-aligned. Title in ES Rebond Grotesque Medium 16px #151581, body in Inter 14px weight 400 #292824. Place on Porcelain (#f6f6fa) canvas with 16px gap in a 3-column grid.

3. *Create a voice input bar:* 24px radius, the brand gradient as background: linear-gradient(270deg, rgba(102,127,255,0.8) 19.6%, rgba(206,162,255,0.8) 50%, rgba(255,133,177,0.8) 86%). Placeholder text 'Ask Lóvi anything' in Inter 14px white, waveform icon right-aligned. Height ~44px, full width of container.

4. *Create a section container:* White (#ffffff) background, 40px radius, 64px padding all sides. Section title in ES Rebond Grotesque 28px weight 400 #151581, centered. Shadow: rgba(36,36,41,0.07) 0px 8px 34px 0px. Contains a 3-column card grid with 16px gap.

5. *Create a doctor profile card:* White background, 24px radius, 24px padding. Portrait photo 8px radius at top, aspect 3:4. Name in ES Rebond Grotesque Medium 20px #151581 below photo, title in Inter 14px #a1a1cd. No border, no shadow — sits directly in the section grid.

## Gradient System

The brand has one signature gradient: blue→purple→pink at 0.8 opacity (linear, 270deg). This appears exclusively on the voice input bar and potentially the scan overlay — it is the only moment of multi-color on the entire site. All other gradients in the raw data are decorative/illustrative (conic rainbow, radial green) and are not design-system tokens. Rule: if you need a gradient, use only the brand gradient. Never introduce new gradient directions or color stops.

## Similar Brands

- **Curology** — Same clinical-leaflet approach: near-white canvas, minimal borders, generous whitespace, photography-led hero, and a single brand color carrying the identity
- **Hims** — Same prescription-grade visual language with violet-tinted text on cream surfaces, centered hero stacks, and trust-signal emphasis on medical authority
- **Calm** — Same restraint philosophy — single accent color, large geometric display type, photography of real people, and tonal layering instead of borders
- **Whoop** — Same minimal navigation (logo + single action), centered single-column hero, and clinical-white surface treatment with one signature accent
- **Prose** — Same beauty-meets-clinical positioning with soft white surfaces, large rounded section containers, and an AI-product showcase through phone mockups

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-indigo-ink: #151581;
  --color-electric-violet: #5465ff;
  --gradient-electric-violet: linear-gradient(270deg, rgba(102, 127, 255, 0.8) 19.614%, rgba(206, 162, 255, 0.8) 50.0389%, rgba(255, 133, 177, 0.8) 86.0908%);
  --color-lavender-mist: #a1a1cd;
  --color-lilac-accent: #9f73e6;
  --color-petal-blush: #de62de;
  --color-verified-green: #00bb76;
  --color-alert-rose: #f25c75;
  --color-info-blue: #20a2e3;
  --color-porcelain: #f6f6fa;
  --color-paper-white: #ffffff;
  --color-bone: #f6f5f4;
  --color-fog: #d6d6d6;
  --color-pebble: #bfbfbd;
  --color-graphite: #292824;
  --color-ash: #949392;

  /* Typography — Font Families */
  --font-sans-serif: 'sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-es-rebond-grotesque: 'ES Rebond Grotesque', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-es-rebond-grotesque-medium: 'ES Rebond Grotesque Medium', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-geist: 'Geist', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter-medium: 'Inter-Medium', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.2;
  --tracking-caption: -0.25px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.29;
  --tracking-body-sm: -0.35px;
  --text-body: 16px;
  --leading-body: 1.38;
  --tracking-body: -0.44px;
  --text-body-lg: 18px;
  --leading-body-lg: 1.38;
  --tracking-body-lg: -0.5px;
  --text-subheading: 24px;
  --leading-subheading: 1.25;
  --tracking-subheading: -1.49px;
  --text-heading-sm: 28px;
  --leading-heading-sm: 1.14;
  --tracking-heading-sm: -0.64px;
  --text-heading: 32px;
  --leading-heading: 1.05;
  --tracking-heading: -0.99px;
  --text-heading-lg: 44px;
  --leading-heading-lg: 0.92;
  --tracking-heading-lg: -1.58px;
  --text-display: 48px;
  --leading-display: 0.91;
  --tracking-display: -2.02px;

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
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-52: 52px;
  --spacing-56: 56px;
  --spacing-64: 64px;
  --spacing-104: 104px;
  --spacing-112: 112px;
  --spacing-120: 120px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 24px;
  --element-gap: 8-12px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-3xl: 24px;
  --radius-3xl-2: 28px;
  --radius-3xl-3: 32px;
  --radius-3xl-4: 36px;
  --radius-3xl-5: 40px;
  --radius-3xl-6: 44px;
  --radius-full: 48px;
  --radius-full-2: 56px;
  --radius-full-3: 60px;
  --radius-full-4: 64px;
  --radius-full-5: 70px;
  --radius-full-6: 80px;
  --radius-full-7: 100px;
  --radius-full-8: 300px;

  /* Named Radii */
  --radius-tags: 12px;
  --radius-cards: 24px;
  --radius-images: 16px;
  --radius-buttons: 48px;
  --radius-phone-mockup: 36-40px;

  /* Shadows */
  --shadow-xl: rgba(36, 36, 41, 0.07) 0px 8px 34px 0px, rgba(37, 36, 41, 0.09) 0px 1px 2px 0px;

  /* Surfaces */
  --surface-canvas: #f6f6fa;
  --surface-card: #ffffff;
  --surface-warm-block: #f6f5f4;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-indigo-ink: #151581;
  --color-electric-violet: #5465ff;
  --color-lavender-mist: #a1a1cd;
  --color-lilac-accent: #9f73e6;
  --color-petal-blush: #de62de;
  --color-verified-green: #00bb76;
  --color-alert-rose: #f25c75;
  --color-info-blue: #20a2e3;
  --color-porcelain: #f6f6fa;
  --color-paper-white: #ffffff;
  --color-bone: #f6f5f4;
  --color-fog: #d6d6d6;
  --color-pebble: #bfbfbd;
  --color-graphite: #292824;
  --color-ash: #949392;

  /* Typography */
  --font-sans-serif: 'sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-es-rebond-grotesque: 'ES Rebond Grotesque', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-es-rebond-grotesque-medium: 'ES Rebond Grotesque Medium', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-geist: 'Geist', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter-medium: 'Inter-Medium', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.2;
  --tracking-caption: -0.25px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.29;
  --tracking-body-sm: -0.35px;
  --text-body: 16px;
  --leading-body: 1.38;
  --tracking-body: -0.44px;
  --text-body-lg: 18px;
  --leading-body-lg: 1.38;
  --tracking-body-lg: -0.5px;
  --text-subheading: 24px;
  --leading-subheading: 1.25;
  --tracking-subheading: -1.49px;
  --text-heading-sm: 28px;
  --leading-heading-sm: 1.14;
  --tracking-heading-sm: -0.64px;
  --text-heading: 32px;
  --leading-heading: 1.05;
  --tracking-heading: -0.99px;
  --text-heading-lg: 44px;
  --leading-heading-lg: 0.92;
  --tracking-heading-lg: -1.58px;
  --text-display: 48px;
  --leading-display: 0.91;
  --tracking-display: -2.02px;

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
  --spacing-52: 52px;
  --spacing-56: 56px;
  --spacing-64: 64px;
  --spacing-104: 104px;
  --spacing-112: 112px;
  --spacing-120: 120px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-3xl: 24px;
  --radius-3xl-2: 28px;
  --radius-3xl-3: 32px;
  --radius-3xl-4: 36px;
  --radius-3xl-5: 40px;
  --radius-3xl-6: 44px;
  --radius-full: 48px;
  --radius-full-2: 56px;
  --radius-full-3: 60px;
  --radius-full-4: 64px;
  --radius-full-5: 70px;
  --radius-full-6: 80px;
  --radius-full-7: 100px;
  --radius-full-8: 300px;

  /* Shadows */
  --shadow-xl: rgba(36, 36, 41, 0.07) 0px 8px 34px 0px, rgba(37, 36, 41, 0.09) 0px 1px 2px 0px;
}
```
