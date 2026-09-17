# Frame.io — Style Reference
> Midnight cinema projection room.

A dark suite where a single blue spotlight does all the work and the UI recedes so creative content can project forward.

**Theme:** dark

Frame.io is a midnight projection room for creative teams: a near-black canvas layered with deep cosmic gradients, where large confident display type floats above product surfaces like film titles above a reel. The palette is almost entirely achromatic — only one vivid blue (#6199f6) and a muted violet border tone (#4f4f80) break the monochrome, used sparingly for icons, eyebrow labels, and card edges. Typography is the loudest voice: a single geometric sans (FrameGothic) carries everything from 80px display headlines to 14px body copy, with custom inktrap letterforms reserved for tiny all-caps section labels. Components stay thin and editorial: pill-shaped nav buttons, ghost CTAs, 10px-radius cards with violet-tinted borders, and zero decorative ornament — every element exists to frame the work, not compete with it.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Carbon Vellum | `#fcfcfc` | `--color-carbon-vellum` | Primary text, inverse button text, icon strokes — near-white reads as paper against the void |
| Obsidian | `#0a0a13` | `--color-obsidian` | Primary page canvas and dominant background; the slight blue undertone keeps it from feeling flat black |
| Pitch | `#000000` | `--color-pitch` | Dark supporting neutral for text, icons, and strong contrast. Do not promote it to the primary CTA color |
| Void | `#040407` | `--color-void` | Secondary canvas layer and topmost nav background, one shade lighter than Pitch |
| Graphite | `#08080c` | `--color-graphite` | Card surface for elevated product mockups, sits one step above Obsidian |
| Smoke | `#757580` | `--color-smoke` | Secondary body text and metadata — cool gray, never warm, stays quiet under headlines |
| Ash | `#a3a3b3` | `--color-ash` | Tertiary text, card descriptions, inactive nav, most frequently used muted foreground |
| Charcoal | `#2a2a32` | `--color-charcoal` | Subtle card border on light-mode-adjacent surfaces; hairline divider |
| Iris Glow | `#6199f6` | `--color-iris-glow` | Sole chromatic accent — icons, eyebrow labels, links, active states, feature marks. One blue, used surgically, carries the entire brand identity |
| Twilight | `#4f4f80` | `--color-twilight` | Muted violet used for card borders, glow halos, and atmospheric tints — the only color allowed to live near content surfaces |
| Specter Lilac | `#dedfee` | `--color-specter-lilac` | Soft highlight on violet accents and light-mode card edges; cool, desaturated lavender |

## Tokens — Typography

### Times — Times — detected in extracted data but not described by AI · `--font-times`
- **Weights:** 400
- **Sizes:** 10px
- **Line height:** 1
- **Role:** Times — detected in extracted data but not described by AI

### FrameGothic — Primary brand typeface for everything from 80px display headlines down to 10px metadata. The custom geometric sans carries the entire voice — tight letter-spacing (-0.045em at display sizes) makes large type feel compressed and modern, while the wide weight range (400/500/600) lets hierarchy do the talking without changing family. · `--font-framegothic`
- **Substitute:** Inter
- **Weights:** 400, 500, 600
- **Sizes:** 10px, 11px, 12px, 13px, 14px, 15px, 16px, 18px, 24px, 30px, 38px, 48px, 80px
- **Line height:** 0.96 to 1.50
- **Letter spacing:** -3.6px at 80px, -1.92px at 48px, -1.33px at 38px, -0.9px at 30px, -0.72px at 24px, +0.16px at 16px
- **OpenType features:** `"ss01" on, "cv11" on`
- **Role:** Primary brand typeface for everything from 80px display headlines down to 10px metadata. The custom geometric sans carries the entire voice — tight letter-spacing (-0.045em at display sizes) makes large type feel compressed and modern, while the wide weight range (400/500/600) lets hierarchy do the talking without changing family.

### NeueMachinaInktrap — Reserved exclusively for all-caps eyebrow labels (e.g. 'THE FRAME.IO PLATFORM', 'SHARING & PRESENTING', 'WORKFLOW MANAGEMENT'). Wide tracking (0.06em) and inktrap cuts give a mechanical, stamped feel — these labels are always Iris Glow or a light tone, never the body color. · `--font-neuemachinainktrap`
- **Substitute:** Space Mono
- **Weights:** 400
- **Sizes:** 12px
- **Line height:** 0.90
- **Letter spacing:** +0.72px at 12px
- **Role:** Reserved exclusively for all-caps eyebrow labels (e.g. 'THE FRAME.IO PLATFORM', 'SHARING & PRESENTING', 'WORKFLOW MANAGEMENT'). Wide tracking (0.06em) and inktrap cuts give a mechanical, stamped feel — these labels are always Iris Glow or a light tone, never the body color.

### Arial — System fallback and small UI text inside embedded product mockups; carries no brand weight · `--font-arial`
- **Weights:** 400
- **Sizes:** 13px
- **Line height:** 1.20
- **Role:** System fallback and small UI text inside embedded product mockups; carries no brand weight

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.45 | 0.72px | `--text-caption` |
| body-sm | 14px | 1.5 | — | `--text-body-sm` |
| body | 16px | 1.45 | 0.16px | `--text-body` |
| subheading | 18px | 1.3 | — | `--text-subheading` |
| heading-sm | 24px | 1.25 | -0.72px | `--text-heading-sm` |
| heading | 38px | 1.04 | -1.33px | `--text-heading` |
| heading-lg | 48px | 1.02 | -1.92px | `--text-heading-lg` |
| display | 80px | 0.96 | -3.6px | `--text-display` |

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
| 48 | 48px | `--spacing-48` |
| 56 | 56px | `--spacing-56` |
| 80 | 80px | `--spacing-80` |
| 96 | 96px | `--spacing-96` |
| 144 | 144px | `--spacing-144` |
| 160 | 160px | `--spacing-160` |
| 176 | 176px | `--spacing-176` |

### Border Radius

| Element | Value |
|---------|-------|
| nav | 100px |
| cards | 10px |
| pills | 100px |
| buttons | 100px |
| dividers | 1px |
| featureCards | 24px |

### Layout

- **Page max-width:** 1280px
- **Section gap:** 80px
- **Card padding:** 24px
- **Element gap:** 24px

## Components

### Pill Navigation Button
**Role:** Primary action in the top nav bar (e.g. 'Start Free Trial', 'Contact Us')

100px border-radius pill, 12px 20px padding, Carbon Vellum fill, Obsidian text at 14px FrameGothic 500. Zero border, no shadow. The pill geometry is the brand's most repeated shape.

### Ghost Nav Link
**Role:** Secondary navigation items (Features, Enterprise, Resources, Pricing)

Transparent fill, no border, Carbon Vellum text at 14px FrameGothic 400. Underline appears on hover; no background shift. Stays nearly invisible until interacted with.

### Sign In Text Link
**Role:** Authenticated user entry point in nav

Plain text button, Carbon Vellum at 14px FrameGothic 400, no background, no border. The lightest possible interactive element.

### Hero CTA Pill
**Role:** Primary conversion button in hero sections ('Start Free Trial')

100px radius, Carbon Vellum fill, Obsidian text, 14px FrameGothic 500, 14px 28px padding. Casts no shadow. The white pill against the cosmic gradient is the page's most contrasting element.

### Ghost CTA Button
**Role:** Secondary conversion button in hero sections ('Take a Product Tour')

100px radius, transparent fill, 1px Carbon Vellum border, Carbon Vellum text, 14px FrameGothic 400, 14px 28px padding. Inverts to filled Carbon Vellum on hover.

### Announcement Banner
**Role:** Top-of-page product update notification

Full-width strip with deep blue-to-violet gradient, Carbon Vellum text at 13px centered, dismiss 'x' on the right. Height ~40px, sits above the main nav.

### Eyebrow Label
**Role:** Tiny all-caps section identifiers ('THE FRAME.IO PLATFORM', 'SHARING & PRESENTING')

NeueMachinaInktrap 12px, weight 400, letter-spacing 0.06em, color Iris Glow (#6199f6) or Smoke. Line-height 0.90. Always sits above the section headline, left-aligned.

### Display Headline
**Role:** Hero and major section headlines (e.g. 'One platform for all your creative work.')

FrameGothic 400 at 48–80px, line-height 0.96–1.02, letter-spacing -1.92 to -3.6px, Carbon Vellum. Weight 400 (not bold) is a deliberate restraint choice — the size does the work, the weight whispers.

### Subheadline Paragraph
**Role:** Supporting body copy under hero and section headlines

FrameGothic 400 at 18px, line-height 1.30, Smoke (#757580). Max-width ~560px. Stays quiet — its job is to inform, not to compete with the headline.

### Feature Column Card
**Role:** Four-column feature grid items in mid-page sections

Transparent background, no card surface. Layout: Iris Glow icon (24px) at top, FrameGothic 500 18px Carbon Vellum heading, 14px Smoke body copy below. 24px column gap. The feature 'card' is really just a typographic block — no border, no background.

### Product UI Mockup Container
**Role:** Hero and feature visual: the actual Frame.io app interface shown as marketing imagery

10px border-radius, 1px Twilight (#4f4f80) border, inner surface is the native dark UI of the product (Graphite, ~#181826 with violet shadow #181826). The container is intentionally minimal — a thin violet halo, nothing else.

### Video Showcase Player
**Role:** Cinematic full-width video preview in lower sections

10px border-radius, embedded video player with Iris Glow play button overlay (48px circle, 60% opacity). Caption strip below at 12px Smoke. The video itself is the hero — the player chrome is nearly invisible.

### Section Divider
**Role:** Visual separation between full-width content bands

No physical divider — sections flow seamlessly using the cosmic gradient background. When separation is needed, a 1px Charcoal (#2a2a32) hairline.

### Adobe Logo Mark (nav)
**Role:** Adobe acquisition indicator in top nav

Tiny stacked-triangle Adobe 'A' mark at far right of nav, Carbon Vellum, 16px height. Pure brand signal, no interaction.

## Do's and Don'ts

### Do
- Use 100px border-radius for all buttons, nav items, and pills — the pill geometry is the brand's most repeated shape
- Set display headlines at weight 400 with tight negative letter-spacing (-1.92px at 48px, -3.6px at 80px) — never go bold for impact
- Reserve Iris Glow (#6199f6) for icons, eyebrow labels, links, and active states — one accent color, used surgically
- Place the NeueMachinaInktrap eyebrow label (12px, uppercase, 0.06em tracking) above every section headline as a section marker
- Layer at least one gradient on every page background — never use flat #0a0a13 alone, the cosmic atmosphere requires depth
- Set the max content width to 1280px and center all content within it, while backgrounds run full-bleed
- Use FrameGothic at 14–18px for all body and feature text in #a3a3b3 or #757580 — these two grays carry all secondary information
- Frame product imagery in 10px-radius containers with a 1px #4f4f80 violet border — the halo is the only frame allowed

### Don't
- Do not use weight 600 or 700 for display headlines — the 400 weight is a signature restraint choice
- Do not introduce additional accent colors — Iris Glow is the only chromatic accent in the system
- Do not use flat black (#000000) as a full-page background — always layer gradients to create the cosmic atmosphere
- Do not add card backgrounds or heavy borders to feature columns — they are typographic blocks, not cards
- Do not use serif fonts, decorative typefaces, or any font other than FrameGothic, NeueMachinaInktrap, or system fallbacks
- Do not add drop shadows to buttons or nav items — the fill contrast alone carries the hierarchy
- Do not center-align body paragraphs — left-align with a max-width of ~560px for readable line lengths
- Do not use the eyebrow label style (NeueMachinaInktrap caps) for any text other than section identifiers — it's a stamp, not a label

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Cosmic Canvas | `#0a0a13` | Primary page background with deep purple/blue radial gradient overlay |
| 1 | Nav Veil | `#040407` | Slightly darker topmost layer behind navigation bar |
| 2 | Product Surface | `#08080c` | Embedded app UI mockups and product chrome |
| 3 | Card Halo | `#181826` | Inset shadow tint for cards with violet borders, creates depth without lifting the surface |

## Elevation

- **Product UI Mockup Container:** `inset 0 0 0 1px #4f4f80, 0 0 60px rgba(79, 79, 128, 0.15)`
- **Hero CTA Pill:** `none — relies on fill contrast, no shadow`
- **Video Showcase Player:** `0 24px 48px rgba(0, 0, 0, 0.5)`

## Imagery

Imagery is the product itself: high-fidelity screenshots of the Frame.io app interface dominate the hero, showing real video thumbnails, review threads, and version stacks. Below the fold, cinematic stills from actual films/projects (a silhouetted figure against warm light, a close-up portrait of a performer) are presented as full-bleed video showcases with minimal player chrome. No stock photography, no abstract illustrations, no 3D renders — the visual language is 'show, don't decorate.' The cosmic gradient backgrounds (deep purples, midnight blues, near-black) create an atmosphere of a dark editing suite or projection room. Icons throughout the UI are thin-stroke, single-color Iris Glow, 24px, outlined style. No filled iconography anywhere.

## Layout

Full-bleed dark canvas with all content constrained to a max-width of ~1280px centered. The hero is a split composition: left half carries the display headline and stacked CTAs (left-aligned), right half shows the product UI mockup floating against the cosmic gradient. Section rhythm alternates between text-dominant bands and product-visual bands, with 80px vertical gaps. Mid-page uses a 4-column feature grid (icon + heading + body) that reads more like editorial columns than cards. No sidebar, no mega-menu — navigation is a single slim top bar with pill buttons. Lower sections are full-width video showcases with centered text above. The overall density is spacious and cinematic — sections breathe, with generous padding and a single horizontal scroll metaphor implied by the flowing gradient background.

## Agent Prompt Guide

## Quick Color Reference
- background: #0a0a13 (cosmic canvas) or full cosmic gradient
- text: #fcfcfc (primary), #757580 (secondary), #a3a3b3 (tertiary)
- border: #4f4f80 (violet halo) or #2a2a32 (charcoal hairline)
- accent: #6199f6 (Iris Glow — icons, eyebrow labels, links)
- primary action: no distinct CTA color
- secondary action: ghost border in #fcfcfc

## Example Component Prompts

**1. Hero Section with Display Headline**
Full-bleed cosmic gradient background (linear: #0a0010 → #02000a → #0c1d32). Left half: eyebrow label 'THE FRAME.IO PLATFORM' in NeueMachinaInktrap 12px, #6199f6, letter-spacing 0.06em. Display headline below in FrameGothic 400, 80px, line-height 0.96, letter-spacing -3.6px, color #fcfcfc. Subheadline at FrameGothic 400, 18px, #757580, max-width 560px. Two CTAs stacked: filled pill (#fcfcfc bg, #0a0a13 text, 100px radius, 14px 28px padding) and ghost pill (transparent, 1px #fcfcfc border, #fcfcfc text). Right half: product UI mockup in 10px-radius container with 1px #4f4f80 border.

**2. Feature Column**
Four-column grid, 24px gap. No card background. Iris Glow (#6199f6) outlined icon at 24px at top. FrameGothic 500, 18px, #fcfcfc heading. FrameGothic 400, 14px, line-height 1.50, #a3a3b3 body copy below heading.

**3. Eyebrow Label + Section Headline**
Stack with 6px gap. Eyebrow: NeueMachinaInktrap 12px, #6199f6, uppercase, letter-spacing 0.06em, line-height 0.90. Headline: FrameGothic 400, 48px, line-height 1.02, letter-spacing -1.92px, #fcfcfc.

**4. Video Showcase Block**
Full-width container with 80px top padding. Centered eyebrow label and headline above. Below: video player in 10px-radius frame, Carbon Vellum play button overlay, 1px #4f4f80 border, subtle shadow (0 24px 48px rgba(0,0,0,0.5)). Optional caption strip at 12px #757580.

**5. Ghost Nav Item**
Transparent, no border, FrameGothic 400, 14px, #fcfcfc. On hover: underline appears. No background change ever.

## Gradient System

Frame.io's background is not a flat color — it's a layered cosmic atmosphere built from 3-4 radial and linear gradients stacked on the Obsidian canvas. The hero combines a diagonal linear gradient (195deg, #0a0010 → #02000a → #0c1d32) with a radial glow (centered bottom, #000b35 → transparent). Mid-page sections use a different radial (top-left origin, #0e0f20 → #0c0c19 → #000000) to shift the light. The result: a page that feels like the same dark room but with light pooling in different corners. Never use a flat #000000 for a full background — always layer at least one gradient to create depth. Gradient colors should stay within the palette: deep indigos (#0c1d32), midnight purples (#0a001e), and near-blacks with blue undertones (#0e0f20).

## Type as Identity

Frame.io's typographic system is its strongest brand signal after the accent color. Three rules carry the entire identity: (1) Display type is always weight 400, not 700 — the size and tight letter-spacing do the heavy lifting, the weight whispers. This is a deliberate anti-SaaS-hero choice. (2) The NeueMachinaInktrap eyebrow label is the only place where the inktrap geometry appears; it stamps each section like a mechanical serial number. (3) Letter-spacing scales inversely with size: -0.045em at 80px, -0.01em at 16px, +0.06em at 12px caps. Large type compresses, body type relaxes, labels expand. Do not flatten this — each size has its own tracking value.

## Similar Brands

- **Adobe Premiere Pro** — Same dark editing-suite atmosphere with deep purple gradient backgrounds and one blue accent for active tools
- **Vimeo** — Dark-mode creative platform with pill-shaped CTAs and video-first product mockups dominating the hero
- **Linear** — Similar commitment to a single accent color against near-black, with display type at weight 400 and tight letter-spacing doing all the visual work
- **Pitch** — Dark product pages with cosmic gradient backgrounds, oversized thin-weight headlines, and one vivid accent for interactive elements

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-carbon-vellum: #fcfcfc;
  --color-obsidian: #0a0a13;
  --color-pitch: #000000;
  --color-void: #040407;
  --color-graphite: #08080c;
  --color-smoke: #757580;
  --color-ash: #a3a3b3;
  --color-charcoal: #2a2a32;
  --color-iris-glow: #6199f6;
  --color-twilight: #4f4f80;
  --color-specter-lilac: #dedfee;

  /* Typography — Font Families */
  --font-times: 'Times', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-framegothic: 'FrameGothic', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-neuemachinainktrap: 'NeueMachinaInktrap', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-arial: 'Arial', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.45;
  --tracking-caption: 0.72px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.5;
  --text-body: 16px;
  --leading-body: 1.45;
  --tracking-body: 0.16px;
  --text-subheading: 18px;
  --leading-subheading: 1.3;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.25;
  --tracking-heading-sm: -0.72px;
  --text-heading: 38px;
  --leading-heading: 1.04;
  --tracking-heading: -1.33px;
  --text-heading-lg: 48px;
  --leading-heading-lg: 1.02;
  --tracking-heading-lg: -1.92px;
  --text-display: 80px;
  --leading-display: 0.96;
  --tracking-display: -3.6px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;

  /* Spacing */
  --spacing-unit: 8px;
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-56: 56px;
  --spacing-80: 80px;
  --spacing-96: 96px;
  --spacing-144: 144px;
  --spacing-160: 160px;
  --spacing-176: 176px;

  /* Layout */
  --page-max-width: 1280px;
  --section-gap: 80px;
  --card-padding: 24px;
  --element-gap: 24px;

  /* Border Radius */
  --radius-sm: 1px;
  --radius-lg: 10px;
  --radius-3xl: 24px;
  --radius-full: 100px;

  /* Named Radii */
  --radius-nav: 100px;
  --radius-cards: 10px;
  --radius-pills: 100px;
  --radius-buttons: 100px;
  --radius-dividers: 1px;
  --radius-featurecards: 24px;

  /* Surfaces */
  --surface-cosmic-canvas: #0a0a13;
  --surface-nav-veil: #040407;
  --surface-product-surface: #08080c;
  --surface-card-halo: #181826;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-carbon-vellum: #fcfcfc;
  --color-obsidian: #0a0a13;
  --color-pitch: #000000;
  --color-void: #040407;
  --color-graphite: #08080c;
  --color-smoke: #757580;
  --color-ash: #a3a3b3;
  --color-charcoal: #2a2a32;
  --color-iris-glow: #6199f6;
  --color-twilight: #4f4f80;
  --color-specter-lilac: #dedfee;

  /* Typography */
  --font-times: 'Times', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-framegothic: 'FrameGothic', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-neuemachinainktrap: 'NeueMachinaInktrap', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-arial: 'Arial', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.45;
  --tracking-caption: 0.72px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.5;
  --text-body: 16px;
  --leading-body: 1.45;
  --tracking-body: 0.16px;
  --text-subheading: 18px;
  --leading-subheading: 1.3;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.25;
  --tracking-heading-sm: -0.72px;
  --text-heading: 38px;
  --leading-heading: 1.04;
  --tracking-heading: -1.33px;
  --text-heading-lg: 48px;
  --leading-heading-lg: 1.02;
  --tracking-heading-lg: -1.92px;
  --text-display: 80px;
  --leading-display: 0.96;
  --tracking-display: -3.6px;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-56: 56px;
  --spacing-80: 80px;
  --spacing-96: 96px;
  --spacing-144: 144px;
  --spacing-160: 160px;
  --spacing-176: 176px;

  /* Border Radius */
  --radius-sm: 1px;
  --radius-lg: 10px;
  --radius-3xl: 24px;
  --radius-full: 100px;
}
```
