# Ameba — Style Reference
> Midnight control room — electric blue pulse inside frosted glass panels.

**Theme:** dark

Ameba operates as a nocturnal command center for supply chain intelligence — deep midnight navy canvases host glowing data visualizations and floating product cards, with a single electric blue (#0428cb) acting as the only warm element in an otherwise cold, precise palette. Typography is distinctly editorial: the humanist F37 Bolton at weight 300 carries oversized headlines with tight tracking (-0.019em at 54px+), giving even product copy a magazine-cover cadence rather than typical SaaS density. The interface lives in two registers: dark hero/feature bands that feel like mission control, and light product showcase bands that reveal the actual dashboard. Surfaces are flat and minimal — no heavy shadows, no gradients on UI chrome — but a single radial gradient and a glow halo around the central particle sphere add atmospheric depth. The visual signature is restraint meeting precision: small radii (4-8px), hairline borders, and a cyan accent (#34fcff) used so sparingly it feels like electricity arcing across the screen.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Midnight Ink | `#00052e` | `--color-midnight-ink` | Primary canvas, hero backgrounds, deep surface — the foundational dark that absorbs the electric blue glow and makes it feel like signal emerging from noise |
| Signal Blue | `#0428cb` | `--color-signal-blue` | Violet outline accent for tags, dividers, and focused UI edges. Do not promote it to the primary CTA color |
| Arc Cyan | `#34fcff` | `--color-arc-cyan` | Atmospheric accent and glow halos around the particle sphere, rare decorative energy that reads as electricity rather than UI |
| Halo Violet | `#afb4db` | `--color-halo-violet` | Soft gradient midtone that bridges Signal Blue into Midnight Ink, used in the radial background wash and ambient surface tinting |
| Carbon | `#222222` | `--color-carbon` | Dark mode text on light surfaces, button text fallback — an almost-black that stays warmer than pure #000 |
| Slate Body | `#4f5166` | `--color-slate-body` | Body text on light product sections, secondary metadata, paragraph copy |
| Fog | `#6b6b83` | `--color-fog` | Muted text, helper copy, de-emphasized labels, ghost-bordered links on light backgrounds |
| Mist | `#8185a0` | `--color-mist` | Tertiary text and disabled labels — one step quieter than Fog |
| Silver Border | `#dbdcdf` | `--color-silver-border` | Hairline dividers on light product surfaces, card outlines, table separators |
| Paper | `#ffffff` | `--color-paper` | Product surface fills, dashboard canvas, light section backgrounds, button text on dark |

## Tokens — Typography

### Open Suace Sans Regular — Open Suace Sans Regular — detected in extracted data but not described by AI · `--font-open-suace-sans-regular`
- **Weights:** 300, 400
- **Sizes:** 13px, 14px, 16px, 18px
- **Line height:** 1.43, 1.44, 1.5, 1.54, 1.57
- **Role:** Open Suace Sans Regular — detected in extracted data but not described by AI

### F37 Bolton — Display and editorial headlines — the humanist geometry of F37 Bolton at weight 300 with negative tracking makes even 59px headlines feel measured rather than shouty, which is the brand's signature typographic stance · `--font-f37-bolton`
- **Substitute:** GT America, Söhne, or Inter at weight 300
- **Weights:** 300, 400
- **Sizes:** 27, 33, 35, 40, 54, 59px
- **Line height:** 1.20–1.54
- **Letter spacing:** -0.019em at 54–59px, -0.014em at 35px, -0.012 to -0.015em at 27–33px
- **Role:** Display and editorial headlines — the humanist geometry of F37 Bolton at weight 300 with negative tracking makes even 59px headlines feel measured rather than shouty, which is the brand's signature typographic stance

### Open Sauce Sans — Body copy, subheadings, nav links, card content — the workhorse sans, comfortable line-height (1.5+) at 16-18px keeps long product copy readable without losing the editorial pacing set by Bolton · `--font-open-sauce-sans`
- **Substitute:** Inter, Söhne, or Untitled Sans
- **Weights:** 300, 400
- **Sizes:** 13, 14, 16, 18, 20px
- **Line height:** 1.43–1.86
- **Role:** Body copy, subheadings, nav links, card content — the workhorse sans, comfortable line-height (1.5+) at 16-18px keeps long product copy readable without losing the editorial pacing set by Bolton

### F37 Bolton — Small-caps labels and eyebrow text, slightly tracked for a technical/industrial feel that contrasts with the body sans · `--font-f37-bolton`
- **Substitute:** Inter or GT America at 500 with +50 tracking
- **Weights:** 400, 700
- **Sizes:** 14, 16px
- **Line height:** 1.20, 1.30
- **Letter spacing:** 0.050em
- **Role:** Small-caps labels and eyebrow text, slightly tracked for a technical/industrial feel that contrasts with the body sans

### IBM Plex Mono — Micro-labels, data tags, order IDs, status badges — the monospaced faces with wide tracking are reserved for data/system chrome, creating a visual distinction between human-readable copy and machine-generated metadata · `--font-ibm-plex-mono`
- **Substitute:** IBM Plex Mono, JetBrains Mono, or Space Mono
- **Weights:** 400
- **Sizes:** 11, 13px
- **Line height:** 1.38, 1.82
- **Letter spacing:** 0.077–0.091em
- **Role:** Micro-labels, data tags, order IDs, status badges — the monospaced faces with wide tracking are reserved for data/system chrome, creating a visual distinction between human-readable copy and machine-generated metadata

### Open Suace Sans Light — Open Suace Sans Light — detected in extracted data but not described by AI · `--font-open-suace-sans-light`
- **Weights:** 300, 400, 700
- **Sizes:** 14px, 16px, 20px
- **Line height:** 1.56, 1.63, 1.65, 1.86
- **Role:** Open Suace Sans Light — detected in extracted data but not described by AI

### F37 Bolton Book — F37 Bolton Book — detected in extracted data but not described by AI · `--font-f37-bolton-book`
- **Weights:** 300, 400
- **Sizes:** 13px, 27px, 35px, 54px, 59px
- **Line height:** 1.26, 1.3, 1.38, 1.41, 1.48, 1.54
- **Letter spacing:** -0.019, -0.014, -0.009, -0.008, 0.086
- **Role:** F37 Bolton Book — detected in extracted data but not described by AI

### F37 Bolton Medium — F37 Bolton Medium — detected in extracted data but not described by AI · `--font-f37-bolton-medium`
- **Weights:** 400, 700
- **Sizes:** 14px, 16px
- **Line height:** 0.81, 1.43
- **Letter spacing:** 0.05
- **Role:** F37 Bolton Medium — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| micro | 11px | 1.82 | 1px | `--text-micro` |
| caption | 14px | 1.5 | — | `--text-caption` |
| body-sm | 16px | 1.54 | — | `--text-body-sm` |
| body | 18px | 1.57 | — | `--text-body` |
| subheading | 27px | 1.41 | -0.41px | `--text-subheading` |
| heading-sm | 35px | 1.38 | -0.49px | `--text-heading-sm` |
| heading | 40px | 1.3 | -0.6px | `--text-heading` |
| heading-lg | 54px | 1.3 | -1.03px | `--text-heading-lg` |
| display | 59px | 1.26 | -1.12px | `--text-display` |

## Tokens — Spacing & Shapes

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 10 | 10px | `--spacing-10` |
| 15 | 15px | `--spacing-15` |
| 16 | 16px | `--spacing-16` |
| 20 | 20px | `--spacing-20` |
| 21 | 21px | `--spacing-21` |
| 23 | 23px | `--spacing-23` |
| 24 | 24px | `--spacing-24` |
| 26 | 26px | `--spacing-26` |
| 30 | 30px | `--spacing-30` |
| 40 | 40px | `--spacing-40` |
| 43 | 43px | `--spacing-43` |
| 80 | 80px | `--spacing-80` |
| 100 | 100px | `--spacing-100` |
| 120 | 120px | `--spacing-120` |
| 196 | 196px | `--spacing-196` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 4px |
| cards | 8px |
| images | 4px |
| buttons | 8px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 20px
- **Element gap:** 10px

## Components

### Primary CTA Button
**Role:** Filled blue action — the only filled button in the system

Background #0428cb, text #ffffff at 14px F37 Bolton weight 400, 8px radius, 20px vertical / 20px horizontal padding, no border. Used for 'Schedule a Demo' and any conversion action. Sits on dark or light surfaces with no variant change.

### Ghost Nav Link
**Role:** Top navigation text links

Text only, no fill, no border. Uppercase F37 Bolton Medium at 13-14px, letter-spacing 0.05em, color #6b6b83 with hover shifting to #ffffff on dark backgrounds. 20px horizontal padding for tap target.

### Sign In Link
**Role:** Secondary navigation action

Text link 'SIGN IN' in uppercase F37 Bolton Medium, color #ffffff, sits adjacent to the primary CTA. No button chrome — relies on positional hierarchy and type weight to signal action.

### Floating Notification Card
**Role:** Ambient product cards floating in the hero around the particle sphere

Dark panel #00052 with 1px #6b6b83 or #4f5166 hairline border, 8px radius, 20px padding. Contains a small colored status dot (#34fcff for success, amber for delay), a label in IBM Plex Mono 11-13px with 0.08em tracking, and body in Open Sauce Sans 13-14px. The card has no shadow — it relies on the hairline border and the radial gradient glow behind it to feel like it's floating.

### Event Summary Panel
**Role:** Chronological event list with diamond markers

Dark frosted panel matching the floating card system. Header 'EVENT SUMMARY' in IBM Plex Mono at 11-13px with 0.08em tracking and #6b6b83 color. List items: diamond-shaped markers in #0428cb or #34fcff, timestamps in IBM Plex Mono 11px, event text in Open Sauce Sans 13-14px. 15px row gap, 20px panel padding.

### Dashboard Product Surface
**Role:** Full product UI preview shown in feature sections

White (#ffffff) surface representing the actual product, typically displayed inside a browser chrome mockup (dark title bar with traffic-light dots, URL bar showing 'app.ameba.ai'). Contains a left sidebar nav (icon-only, #4f5166), a main content area with stat cards ('Alerted Orders', 'Stale Orders', 'Active Orders' with large numbers), a horizontal Gantt-style timeline in #0428cb, and a right-side event activity feed. The product surface uses 8px radii and 1px #dbdcdf borders, maintaining the design system's restraint.

### Status Pill / Order Tag
**Role:** Inline status indicators on order rows

Small tag with 4px radius, 4-5px vertical padding, uppercase IBM Plex Mono at 11px with 0.08em tracking. Color states: green-tinted background for 'COMPLETE', red-tinted for 'OVER LIMIT', neutral gray for 'CONFIRMED'. The small radius and tight tracking distinguish these from the larger 8px-radius cards.

### Stat Card
**Role:** Large metric display inside the dashboard

Three-column stat row showing a label ('Alerted Orders') in Open Sauce Sans 14-16px weight 400, and a large number below in F37 Bolton weight 300 at 40-54px in #00052e. No background, no border — the numbers are the hero, breathing against white space.

### Hero Particle Sphere
**Role:** Atmospheric visual — the brand's signature graphic element

A radial composition of small blue particles forming a sphere shape, centered behind the hero headline. Particles cluster densely at the edges and dissipate toward the center, creating a vignette of #34fcff cyan dots against the #00052 void. A soft radial gradient (#06105a → #00052e) sits behind it, providing atmospheric depth. This is not a UI component but a brand element — it appears once on the hero and is not reused.

### Section Gradient Transition
**Role:** Visual break between dark feature bands and light product bands

A horizontal gradient band that transitions from the dark navy (#00052e) at the top, through violet/magenta, into white. Used once where the dark hero gives way to the light product showcase section. The gradient is smooth and atmospheric, not a hard divider.

### Top Navigation Bar
**Role:** Site-wide navigation

Fixed at top, background #00052 (transparent over hero), 20px vertical padding. Left: Ameba wordmark in white. Center: nav links (PRODUCT, CUSTOMER TYPES, COMPANY, RESOURCES, SECURITY) in uppercase F37 Bolton Medium 13-14px, #6b6b83. Right: LANGUAGE selector (with chevron), SIGN IN, and the primary CTA. The nav is minimal — no logo container, no heavy border — it floats over the dark canvas.

### Eyebrow Label
**Role:** Section preamble text above headlines

F37 Bolton Medium at 14-16px, letter-spacing 0.05em, uppercase, color #0428cb on light backgrounds or #34fcff on dark. Sits 10-20px above the section headline, giving each band a two-tier entry: technical label then editorial headline.

## Do's and Don'ts

### Do
- Use Midnight Ink (#00052e) as the canvas for all hero, feature, and atmospheric sections — the dark stage is what makes Signal Blue read as electricity
- Reserve Signal Blue (#0428cb) exclusively for the single filled CTA, active timeline bars, and the particle visualization — if it appears on more than three element types per screen, it loses authority
- Set all display headlines in F37 Bolton weight 300 with negative tracking (-0.019em at 54px+) — the whisper weight with tight spacing is the brand's typographic signature
- Use 8px radius for all cards and buttons, 4px for tags and images — the modest radii are deliberate; never round to 12px or higher
- Use IBM Plex Mono with 0.077–0.091em letter-spacing for any data, status, or system metadata — the monospaced tracked type is the visual language of machine-readable information
- Keep product surfaces white (#ffffff) with 1px #dbdcdf hairlines — the product UI should feel like a clean document inserted into the dark atmospheric shell
- Pair the dark hero with a single radial gradient (#06105a → #00052e) centered behind the focal element to create depth without adding UI chrome

### Don't
- Don't add drop shadows to cards or panels — the system uses hairline borders and the radial background glow for separation, never elevation
- Don't use Arc Cyan (#34fcff) for text, buttons, or borders — it is atmospheric only, used for the particle glow and nothing else
- Don't set body text below 14px in Open Sauce Sans or below 11px in IBM Plex Mono — the system values legibility over density
- Don't use warm hues (red, orange, yellow) for brand identity — the palette is strictly cold (navy, blue, violet) and warm color would break the signal
- Don't round corners above 8px — pill buttons and large radii would undermine the precise, industrial feel
- Don't fill cards with semi-transparent white on dark backgrounds — floating cards use solid #00052 with a hairline border, not glassmorphism
- Don't use gradient fills on UI elements — gradients are reserved for the hero atmosphere and section transitions, never for buttons, cards, or text

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Midnight Canvas | `#00052` | Hero and feature section backgrounds — the dominant dark stage |
| 1 | Violet Wash | `#06105a` | Radial gradient center, creates a soft glow hotspot around focal elements |
| 2 | Frosted Panel | `#00052` | Floating product cards sitting on the dark canvas with hairline borders, not fills |
| 3 | Product Paper | `#ffffff` | Dashboard previews and light product section surfaces |

## Elevation

- **Floating notification cards:** `none — separation achieved via 1px hairline border #6b6b83 or #4f5166 on #00052 fill`
- **Product dashboard surface:** `none — flat white surface, separated from dark background by container chrome only`

## Imagery

The visual language is overwhelmingly UI-driven and abstract. The hero features a particle sphere — thousands of tiny cyan/blue dots forming a 3D globe shape with a glow halo, suggesting data points orbiting a central intelligence. Floating product cards (notification toasts, order summaries, shipment details) appear around the sphere, positioning the product as the intelligence layer over the data. Below the hero, the imagery shifts to full product UI screenshots: a dashboard with Gantt-style order timelines, a browser-chrome mockup, and clean white product surfaces. There is no photography, no illustration of people, no lifestyle imagery. The visual storytelling is entirely through product UI and abstract data graphics. Icon style is minimal: small filled or outlined glyphs in #4f5166 or #6b6b83, used sparingly in nav and dashboard sidebar.

## Layout

The page model is full-bleed dark hero → dark feature section with gradient transition → light product showcase. The hero is centered: headline + subtext stacked in the middle of the viewport with the particle sphere behind, and floating product cards scattered at the edges. Navigation is a single top bar, fixed, minimal, with a 20px vertical breathing room. Section rhythm alternates: dark atmospheric bands (80px vertical gap, centered content) and light product bands (max-width 1200px contained, 2-column or 3-column grids). The dashboard preview uses a full product chrome mockup with a left sidebar (icon-only nav), a main content area, and a right event activity panel — essentially a 3-zone application layout. Content arrangement is consistently centered on dark sections and left-aligned on light sections, creating a visual rhythm: atmospheric/centered → functional/structured.

## Agent Prompt Guide

**Quick Color Reference**
- text (dark canvas): #ffffff
- text (light canvas): #00052e
- text (secondary): #6b6b83
- background (hero/feature): #00052e
- background (product surface): #ffffff
- border (hairline): #dbdcdf
- accent: #34fcff
- brand action: #0428cb

**Example Component Prompts**
1. Hero headline: 59px F37 Bolton weight 300, #ffffff, letter-spacing -1.12px, centered over #00052e background. Subtext at 18px Open Sauce Sans weight 400, #6b6b83. primary action: no distinct CTA color
2. Floating notification card: 8px radius, #00052e fill, 1px #6b6b83 border, 20px padding. Status dot 8px #34fcff. Label 'ORDER UPDATE' in IBM Plex Mono 11px, letter-spacing 0.08em, #6b6b83. Body text 14px Open Sauce Sans, #ffffff. No shadow.
3. Dashboard product surface: white #ffffff background inside a dark browser chrome (title bar #2a2a2a with three traffic-light dots, URL 'app.ameba.ai'). Inside: left sidebar 48px wide with 4–5 #4f5166 icons. Main area: three stat columns with labels in 14px Open Sauce Sans #4f5166 and large numbers in 54px F37 Bolton weight 300 #00052e. Below: a Gantt timeline with horizontal bars in #0428cb, diamond markers, and a date axis in IBM Plex Mono 11px.
4. Section eyebrow + headline: eyebrow 'REACTIVE TO PROACTIVE' in F37 Bolton Medium 14px, letter-spacing 0.05em, #0428cb, 10px above. Headline below at 40px F37 Bolton weight 300, #ffffff (on dark) or #00052e (on light), letter-spacing -0.6px, max-width 700px.
5. Product status tag: 4px radius, 4px vertical padding, 8px horizontal. Background a desaturated tint of the status color. Text in IBM Plex Mono 11px, letter-spacing 0.08em, uppercase. 'COMPLETE' in muted green, 'OVER LIMIT' in muted red, 'CONFIRMED' in neutral gray.

## Similar Brands

- **Linear** — Same dark-mode command center aesthetic with a single vivid accent color, restrained typography, and floating product cards over abstract data visualizations
- **Vercel** — Near-identical dark navy canvas (#000) with electric blue accents, hairline borders on floating panels, and ultra-minimal nav — the same 'precision instrument' visual language
- **Resend** — Dark hero with centered editorial headline, humanist sans-serif at whisper weight, and a single saturated brand color used only for the primary action
- **Stripe** — Same two-register page model: dark atmospheric intro sections transitioning to clean white product surfaces with gradient dividers between them

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-midnight-ink: #00052e;
  --color-signal-blue: #0428cb;
  --color-arc-cyan: #34fcff;
  --color-halo-violet: #afb4db;
  --color-carbon: #222222;
  --color-slate-body: #4f5166;
  --color-fog: #6b6b83;
  --color-mist: #8185a0;
  --color-silver-border: #dbdcdf;
  --color-paper: #ffffff;

  /* Typography — Font Families */
  --font-open-suace-sans-regular: 'Open Suace Sans Regular', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-f37-bolton: 'F37 Bolton', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-open-sauce-sans: 'Open Sauce Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-ibm-plex-mono: 'IBM Plex Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-open-suace-sans-light: 'Open Suace Sans Light', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-f37-bolton-book: 'F37 Bolton Book', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-f37-bolton-medium: 'F37 Bolton Medium', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-micro: 11px;
  --leading-micro: 1.82;
  --tracking-micro: 1px;
  --text-caption: 14px;
  --leading-caption: 1.5;
  --text-body-sm: 16px;
  --leading-body-sm: 1.54;
  --text-body: 18px;
  --leading-body: 1.57;
  --text-subheading: 27px;
  --leading-subheading: 1.41;
  --tracking-subheading: -0.41px;
  --text-heading-sm: 35px;
  --leading-heading-sm: 1.38;
  --tracking-heading-sm: -0.49px;
  --text-heading: 40px;
  --leading-heading: 1.3;
  --tracking-heading: -0.6px;
  --text-heading-lg: 54px;
  --leading-heading-lg: 1.3;
  --tracking-heading-lg: -1.03px;
  --text-display: 59px;
  --leading-display: 1.26;
  --tracking-display: -1.12px;

  /* Typography — Weights */
  --font-weight-light: 300;
  --font-weight-regular: 400;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-10: 10px;
  --spacing-15: 15px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-21: 21px;
  --spacing-23: 23px;
  --spacing-24: 24px;
  --spacing-26: 26px;
  --spacing-30: 30px;
  --spacing-40: 40px;
  --spacing-43: 43px;
  --spacing-80: 80px;
  --spacing-100: 100px;
  --spacing-120: 120px;
  --spacing-196: 196px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 20px;
  --element-gap: 10px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;

  /* Named Radii */
  --radius-tags: 4px;
  --radius-cards: 8px;
  --radius-images: 4px;
  --radius-buttons: 8px;

  /* Surfaces */
  --surface-midnight-canvas: #00052;
  --surface-violet-wash: #06105a;
  --surface-frosted-panel: #00052;
  --surface-product-paper: #ffffff;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-midnight-ink: #00052e;
  --color-signal-blue: #0428cb;
  --color-arc-cyan: #34fcff;
  --color-halo-violet: #afb4db;
  --color-carbon: #222222;
  --color-slate-body: #4f5166;
  --color-fog: #6b6b83;
  --color-mist: #8185a0;
  --color-silver-border: #dbdcdf;
  --color-paper: #ffffff;

  /* Typography */
  --font-open-suace-sans-regular: 'Open Suace Sans Regular', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-f37-bolton: 'F37 Bolton', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-open-sauce-sans: 'Open Sauce Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-ibm-plex-mono: 'IBM Plex Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-open-suace-sans-light: 'Open Suace Sans Light', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-f37-bolton-book: 'F37 Bolton Book', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-f37-bolton-medium: 'F37 Bolton Medium', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-micro: 11px;
  --leading-micro: 1.82;
  --tracking-micro: 1px;
  --text-caption: 14px;
  --leading-caption: 1.5;
  --text-body-sm: 16px;
  --leading-body-sm: 1.54;
  --text-body: 18px;
  --leading-body: 1.57;
  --text-subheading: 27px;
  --leading-subheading: 1.41;
  --tracking-subheading: -0.41px;
  --text-heading-sm: 35px;
  --leading-heading-sm: 1.38;
  --tracking-heading-sm: -0.49px;
  --text-heading: 40px;
  --leading-heading: 1.3;
  --tracking-heading: -0.6px;
  --text-heading-lg: 54px;
  --leading-heading-lg: 1.3;
  --tracking-heading-lg: -1.03px;
  --text-display: 59px;
  --leading-display: 1.26;
  --tracking-display: -1.12px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-10: 10px;
  --spacing-15: 15px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-21: 21px;
  --spacing-23: 23px;
  --spacing-24: 24px;
  --spacing-26: 26px;
  --spacing-30: 30px;
  --spacing-40: 40px;
  --spacing-43: 43px;
  --spacing-80: 80px;
  --spacing-100: 100px;
  --spacing-120: 120px;
  --spacing-196: 196px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
}
```
