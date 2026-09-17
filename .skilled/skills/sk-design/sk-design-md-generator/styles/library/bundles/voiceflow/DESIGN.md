# Voiceflow — Style Reference
> editorial whiteboard under daylight — serif whispers, pill controls glow blue.



**Theme:** light

Voiceflow operates as an editorial product canvas: a generous near-white surface where a whisper-weight serif (Tiempos Headline at 300) carries the voice and a humanist sans (Selecta) handles the machinery. The system is overwhelmingly achromatic — warm off-whites, graphite text, hairline borders — with a single vivid blue (#397dff) that acts as the 'on' switch for primary actions, and a burnt orange (#f55c15) that paints decorative strokes, badge outlines, and icon accents. Components are pill-shaped at the interactive level (999px buttons, 100px nav pills) and softly rounded at the surface level (20px cards), creating a language where controls feel touched and surfaces feel held. The overall rhythm is spacious, confident, and editorial — headlines breathe at 56–64px while body text sits at 16px with generous tracking, producing a magazine-meets-product aesthetic.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Pure Canvas | `#ffffff` | `--color-pure-canvas` | Page background, card surface, image mask — the baseline white everything else sits on |
| Bone | `#f5f5f4` | `--color-bone` | Alternate section background, subtle warm-off-white band between content blocks |
| Mist | `#edeeee` | `--color-mist` | Nav and section fills that need a barely-there elevation above canvas |
| Silk Border | `#e5e5e5` | `--color-silk-border` | Hairline card and divider borders — defines surfaces without painting them |
| Quill | `#d4d4d4` | `--color-quill` | Link and secondary border treatment, lighter dividers inside dense blocks |
| Ash | `#a1a1a1` | `--color-ash` | Muted helper text, disabled labels, low-emphasis icon strokes |
| Pebble | `#737373` | `--color-pebble` | Body text and default neutral borders — the workhorse mid-gray |
| Slate | `#525252` | `--color-slate` | Secondary text, button borders in outlined controls, sub-label icons |
| Graphite | `#404040` | `--color-graphite` | Nav text, stronger body text for emphasis without going to black |
| Iron | `#333333` | `--color-iron` | Link text in dark contexts, strong card borders on featured surfaces |
| Charcoal | `#262626` | `--color-charcoal` | Primary text and dark button fills — the near-black that keeps contrast warm |
| Midnight | `#171717` | `--color-midnight` | Display text, deepest heading weight, high-contrast inverse text |
| Signal Blue | `#397dff` | `--color-signal-blue` | Violet action color for filled buttons, selected navigation states, and focused conversion moments. |
| Ember Stroke | `#f55c15` | `--color-ember-stroke` | Decorative borders, badge outlines, icon accents — warm orange that warms the cool white canvas without competing with Signal Blue |
| Alarm Red | `#ff0000` | `--color-alarm-red` | Red outline accent for tags, dividers, and focused UI edges. Use as a supporting accent, not as a status color |

## Tokens — Typography

### Tiempos Headline — All display and heading copy — headlines, hero statements, section titles, large numbers. The single weight 300 is a deliberate anti-convention: instead of bold, Tiempos whispers, and the editorial serif does the work of authority through restraint rather than volume. · `--font-tiempos-headline`
- **Substitute:** 'Source Serif 4' or 'Libre Caslon Text' at weight 300, fallback 'Georgia'
- **Weights:** 300
- **Sizes:** 20px, 36px, 40px, 48px, 56px, 64px
- **Line height:** 1.00, 1.13, 1.14, 1.16, 1.20, 1.30
- **Letter spacing:** -2.56px at 64px, -0.8px at 40px, -0.34px at 20px (tightened tracking scales with size)
- **OpenType features:** `'liga' on, 'kern' on`
- **Role:** All display and heading copy — headlines, hero statements, section titles, large numbers. The single weight 300 is a deliberate anti-convention: instead of bold, Tiempos whispers, and the editorial serif does the work of authority through restraint rather than volume.

### Selecta — All UI, body, navigation, button, badge, and caption text. Weight 400 is the body default, 500 for emphasized UI labels and nav items. The slightly open tracking (+0.025em) on small sizes gives the interface an airy, legible quality that pairs against the dense serif headlines. · `--font-selecta`
- **Substitute:** 'Inter' or 'Söhne' for body, fallback system-ui sans-serif
- **Weights:** 400, 500
- **Sizes:** 8px, 13px, 14px, 15px, 16px, 18px
- **Line height:** 0.80, 1.00, 1.16, 1.38, 1.44, 1.47, 1.50, 1.55, 1.75
- **Letter spacing:** 0.4px at 16px, 0.325px at 13px, 1.44px at 8px (positive tracking that opens up small UI text)
- **OpenType features:** `'tnum' on, 'ss01' on`
- **Role:** All UI, body, navigation, button, badge, and caption text. Weight 400 is the body default, 500 for emphasized UI labels and nav items. The slightly open tracking (+0.025em) on small sizes gives the interface an airy, legible quality that pairs against the dense serif headlines.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 13px | 1.5 | 0.33px | `--text-caption` |
| body | 16px | 1.55 | 0.4px | `--text-body` |
| subheading | 18px | 1.47 | 0.45px | `--text-subheading` |
| heading-sm | 20px | 1.3 | -0.34px | `--text-heading-sm` |
| heading | 40px | 1.16 | -0.8px | `--text-heading` |
| heading-lg | 56px | 1.13 | -1.12px | `--text-heading-lg` |
| display | 64px | 1 | -2.56px | `--text-display` |

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
| 44 | 44px | `--spacing-44` |
| 48 | 48px | `--spacing-48` |
| 56 | 56px | `--spacing-56` |
| 64 | 64px | `--spacing-64` |
| 72 | 72px | `--spacing-72` |
| 80 | 80px | `--spacing-80` |
| 120 | 120px | `--spacing-120` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 20px |
| buttons | 999px |
| navPills | 100px |
| smallCards | 14px |
| chatBubbles | 20px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 96-120px
- **Card padding:** 24px
- **Element gap:** 12-24px

## Components

### Pill Primary Button
**Role:** Primary call-to-action across hero, nav, and inline CTAs

Background #397dff (Signal Blue), text #ffffff in Selecta 15px weight 500, letter-spacing 0.375px. Fully rounded at 999px. Padding 12px 20px. The blue is the only saturated fill in the entire system — every filled button in the design should use this exact color. Hover deepens the fill toward #2563eb.

### Pill Ghost Button
**Role:** Secondary action paired beside primary

Transparent background, 1px border in #262626, text #262626 in Selecta 15px weight 500. 999px radius. Padding 12px 20px. Sits beside the blue primary as a quieter alternative — the 'Sign up for free' or 'Read all stories' pattern.

### Pill Inverse Button
**Role:** CTA used on dark or photographic backgrounds

Background #ffffff, text #262626. Same 999px radius and Selecta 15px weight 500. Used when a surface is too busy for a ghost button to read.

### Nav Pill Link
**Role:** Top-level navigation items in the header

Selecta 15px weight 500, color #262626, padding 8px 14px, 100px border-radius. Active state uses Signal Blue text. Dropdown items appear as simple stacked text, no mega-menu.

### Case Study Logo Bar
**Role:** Social proof strip showing customer brand marks

Horizontal row of grayscale logos on #ffffff, separated by hairline #e5e5e5 dividers. Logos desaturated to neutral to keep visual noise low. One logo slot is highlighted with 'Choose case study' label and a subtle selected state.

### Stat Card
**Role:** Hero-level metric highlight overlaid on a photographic background

Semi-transparent white card (#ffffff at ~80% opacity) with no visible border, 14px radius, 24px padding. Headline number in Tiempos Headline 64px weight 300 color #171717. Label in Selecta 14px weight 400 color #525252. Reads like an editorial pull-quote floating over an image.

### Feature Triptych Card
**Role:** Three-column 'Build / Launch / Iterate' feature panels

Three image panels side by side, each with a small Tiempos Headline 20px weight 300 label (color #397dff) followed by Selecta 16px description text in #525252. The image panels have 14-20px radius and sit directly on the canvas without card chrome.

### Testimonial Card
**Role:** Customer quote with portrait and attribution

White background, 1px #e5e5e5 border, 20px radius, 24px padding. Two-column internal layout: square portrait (90-120px, rounded 14px) on left, quote on right. Quote in Tiempos Headline 20px weight 300, attribution in Selecta 14px weight 500 (name) and 14px weight 400 (role). The serif quote carries the editorial voice.

### Announcement Banner
**Role:** Top-of-page promotional strip

Full-width Signal Blue (#397dff) band, 8-10px padding, white Selecta 14px text centered. Inline CTA link in white with underline. This is the only place Signal Blue appears as a surface fill rather than a button.

### Chat Demo Card
**Role:** Product preview showing the AI agent conversation interface

White card with 20px radius, 24px padding, subtle #e5e5e5 border. Contains alternating message bubbles: user messages in #262626 rounded bubbles with white text, agent messages in white with #262626 text and 1px border. Input bar at bottom with #f5f5f4 fill, placeholder text in #a1a1a1. This card is often overlaid on a photographic background (aerial landscape) to create a floating demo effect.

### Resolution Analytics Card
**Role:** Dashboard-style product preview

White card, 20px radius, 24px padding, 1px #e5e5e5 border. Contains a chart with line graph (Tiempos at 20px for axis labels, #737373 gridlines) and three KPI tiles below: large number in Tiempos Headline 36-48px weight 300 (green #16a34a for positive metrics), label in Selecta 13px weight 400 #525252.

### Workflow Canvas Preview
**Role:** Product screenshot showing the node-based builder

White card with 20px radius showing a dotted-grid background (#e5e5e5 dots) with a small floating 'Login' pill (dark #262626 bg, white text) and a Signal Blue 'Publish' button. Represents the visual builder surface.

### Trust Bar
**Role:** Bottom social proof line above footer

Single line of Selecta 14px weight 400 in #525252: 'Trusted by 4k+ customers worldwide with 4.8/5 rating, 200k+ users'. Rating and number values are in weight 500. Often paired with a ghost CTA button on the right.

### Footer Nav Column
**Role:** Multi-column site map at page bottom

Dark (#171717) background. Column headers in Selecta 14px weight 500 #ffffff. Links in Selecta 14px weight 400 #a1a1a1, hover to #ffffff. 24px vertical gap between links.

## Do's and Don'ts

### Do
- Use Tiempos Headline at weight 300 for all headlines and display numbers — never bold it up; the whisper-weight is the signature
- Use Signal Blue (#397dff) exclusively for primary action buttons, active nav, and the announcement bar — it should appear in only 1-2 places per viewport
- Apply Selecta positive tracking (0.025em) on all body and UI text 16px and below; tighten to Tiempos negative tracking above 20px
- Use pill shapes (999px) for all interactive controls and 100px for nav items; reserve 20px radius for card surfaces only
- Set body text to 16px Selecta weight 400 with 1.55 line-height as the universal default for paragraphs
- Alternate between white (#ffffff) and Bone (#f5f5f4) section backgrounds to create rhythm without using shadows or color
- Place product demo cards (chat, analytics, workflow) as floating overlays on full-bleed photographic backgrounds rather than inside bordered containers

### Don't
- Do not bold Tiempos Headline — weight 300 is the only weight it ships in and bolding it destroys the editorial feel
- Do not use Signal Blue for decorative elements, large surfaces, or text longer than a few words — its job is to mark the primary action and nothing else
- Do not use shadows on content cards — the system prefers 1px #e5e5e5 hairline borders for surface definition; reserve shadows for cards floating over photography
- Do not introduce additional accent colors — the palette is deliberately two-color (blue for action, orange for decoration) on a neutral canvas
- Do not set headlines below 36px in Tiempos — the serif needs scale to read as editorial; below 20px switch to Selecta weight 500
- Do not center-align body paragraphs longer than two lines — only headlines, CTAs, and short subheads use center alignment
- Do not use square corners or small radii (4-8px) on visible surfaces — the system's softness is defined by 14/20/999px radii, and sharp corners feel foreign

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas | `#ffffff` | Page base background |
| 1 | Band | `#f5f5f4` | Alternate section background for rhythm |
| 2 | Nav Fill | `#edeeee` | Navigation and elevated chrome surfaces |
| 3 | Card | `#ffffff` | Card and content surface, same as canvas but bordered |
| 4 | Chat Surface | `#f55c15` | Featured product surface (chat demo card) tinted with ember |

## Elevation

- **Stat Card:** `0 1px 3px rgba(23, 23, 23, 0.04), 0 8px 24px rgba(23, 23, 23, 0.06) — barely-there shadow that lifts the card off the photographic background without looking like a Material card`
- **Testimonial Card:** `none — uses 1px #e5e5e5 border instead of shadow`
- **Chat Demo Card:** `0 4px 12px rgba(23, 23, 23, 0.08), 0 24px 48px rgba(23, 23, 23, 0.06) — the most elevated surface, floating over imagery`

## Imagery

Imagery is a mix of full-bleed editorial photography (aerial landscape shots of green fields and roads — wide, high-altitude, organic textures that contrast the geometric UI) and contained product screenshots (the chat demo, analytics dashboard, workflow canvas). The hero photography is desaturated and natural-toned, never stock-y or studio-lit; it feels like drone cinematography. Product screenshots sit on white cards with 20px radius and are treated as honest captures rather than marketing renders — they show the real interface. Icons are outline-style, 1.5px stroke, monochrome in #737373 or #525252, occasionally accented in Signal Blue or Ember Stroke. No 3D illustrations, no mascot characters, no decorative abstract shapes. The visual language is: real product, real photography, no decoration.

## Layout

Layout follows a centered max-width container at 1200px with generous outer padding (24-48px). The hero is a centered single-column stack: announcement bar → nav → headline → subtext → CTA pair → logo bar, with a large photographic section below that hosts a floating stat card and chat demo card. Sections alternate between full-width photographic blocks and centered content blocks, creating a rhythm of text↔image. The three-column feature triptych uses equal-width columns (1/3 each) with image-on-top, text-below. Testimonials use a 2×2 card grid with equal gaps. Navigation is a simple horizontal bar — no sidebar, no mega-menu, no sticky behavior beyond the announcement bar. Vertical rhythm is spacious: 96-120px between major sections, 24-48px between content blocks within a section. The overall feel is a long-scroll editorial page, not a dense product dashboard.

## Agent Prompt Guide

Quick Color Reference:
- Primary text: #171717 (Midnight)
- Body text: #737373 (Pebble)
- Page background: #ffffff (Pure Canvas)
- Card border: #e5e5e5 (Silk Border)
- Accent / decorative: #f55c15 (Ember Stroke)
- primary action: #397dff (filled action)

3 Example Component Prompts:

1. Hero Section: White canvas. Headline 'The operating system for AI customer experience' at 64px Tiempos Headline weight 300, color #171717, letter-spacing -2.56px, line-height 1.0. Subtext at 18px Selecta weight 400, color #525252. Two CTAs side by side: blue pill 'Book a demo' (#397dff bg, #ffffff text, 999px radius, 12px 20px padding, Selecta 15px weight 500) and ghost pill 'Sign up for free' (transparent bg, 1px #262626 border, #262626 text, 999px radius).

2. Testimonial Card: White background, 1px #e5e5e5 border, 20px radius, 24px padding. Left: 100px square portrait photo with 14px radius. Right: Quote in Tiempos Headline 20px weight 300 color #171717, letter-spacing -0.34px. Attribution: name in Selecta 14px weight 500 #262626, role in Selecta 14px weight 400 #525252 below.

3. Feature Triptych: Three equal-width columns, 24px gap. Each column: product screenshot card on top (20px radius, 1px #e5e5e5 border, white bg, 24px internal padding showing the actual UI). Below: label in Tiempos Headline 20px weight 300 #397dff, then description paragraph in Selecta 16px weight 400 #525252 with 1.55 line-height.

## Typography Philosophy

The two-font pairing is the system's most recognizable feature. Tiempos Headline (a contemporary editorial serif by Klim) carries every word meant to be read as thought: headlines, quotes, large numbers, section labels. Selecta (a humanist geometric sans) carries every word meant to be operated: buttons, nav, body, badges, captions. The contrast is not decorative — it is functional. When a user scans the page, the serif pulls the eye to meaning; the sans recedes into the interface. Weight 300 for Tiempos is the keystone choice: it forces the serif to do authority work through restraint, and it means the blue CTA button (weight 500 Selecta) is often the heaviest element on the page, which makes it the clear action target.

## Color Philosophy

The palette is built on a thesis: a system this product-focused (AI agent builder) should feel as calm as a notebook, not as loud as a SaaS landing page. The off-white canvas (#ffffff with #f5f5f4 and #edeeee bands) is warmer than pure white, reducing eye strain during long builder sessions. The neutrals form a full scale from #171717 to #e5e5e5, giving the system enough range to build complex UIs without ever leaving the grayscale. Signal Blue (#397dff) is the single chromatic interrupt — a cool, electric blue that says 'do this'. Ember Stroke (#f55c15) is the decorative counterweight — a burnt orange that appears on badge borders, icon strokes, and accent lines to warm the canvas without competing with the CTA. The 3% colorfulness measurement is a feature, not a limitation.

## Similar Brands

- **Linear** — Same editorial-weight serif headlines paired with a geometric sans body, pill-shaped controls, and a near-white canvas with a single saturated accent — both feel like premium tools, not SaaS apps
- **Notion** — Similar airy spacing, minimal use of shadows, hairline borders for surface definition, and a near-monochrome palette with one functional accent color
- **Stripe** — Same generous 1200px max-width centered layout, same magazine-meets-product rhythm of alternating photographic and text sections, same restrained two-color system
- **Framer** — Both use a humanist sans for UI paired with a display serif for editorial moments, pill-shaped buttons, and a white-canvas-plus-single-accent approach
- **Vercel** — Similar minimal color palette, generous vertical spacing, and a focus on letting one or two chromatic elements (their monochrome vs Voiceflow's blue) carry all visual emphasis

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-pure-canvas: #ffffff;
  --color-bone: #f5f5f4;
  --color-mist: #edeeee;
  --color-silk-border: #e5e5e5;
  --color-quill: #d4d4d4;
  --color-ash: #a1a1a1;
  --color-pebble: #737373;
  --color-slate: #525252;
  --color-graphite: #404040;
  --color-iron: #333333;
  --color-charcoal: #262626;
  --color-midnight: #171717;
  --color-signal-blue: #397dff;
  --color-ember-stroke: #f55c15;
  --color-alarm-red: #ff0000;

  /* Typography — Font Families */
  --font-tiempos-headline: 'Tiempos Headline', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-selecta: 'Selecta', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 13px;
  --leading-caption: 1.5;
  --tracking-caption: 0.33px;
  --text-body: 16px;
  --leading-body: 1.55;
  --tracking-body: 0.4px;
  --text-subheading: 18px;
  --leading-subheading: 1.47;
  --tracking-subheading: 0.45px;
  --text-heading-sm: 20px;
  --leading-heading-sm: 1.3;
  --tracking-heading-sm: -0.34px;
  --text-heading: 40px;
  --leading-heading: 1.16;
  --tracking-heading: -0.8px;
  --text-heading-lg: 56px;
  --leading-heading-lg: 1.13;
  --tracking-heading-lg: -1.12px;
  --text-display: 64px;
  --leading-display: 1;
  --tracking-display: -2.56px;

  /* Typography — Weights */
  --font-weight-light: 300;
  --font-weight-regular: 400;
  --font-weight-medium: 500;

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
  --spacing-44: 44px;
  --spacing-48: 48px;
  --spacing-56: 56px;
  --spacing-64: 64px;
  --spacing-72: 72px;
  --spacing-80: 80px;
  --spacing-120: 120px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 96-120px;
  --card-padding: 24px;
  --element-gap: 12-24px;

  /* Border Radius */
  --radius-xl: 14px;
  --radius-2xl: 20px;
  --radius-full: 100px;
  --radius-full-2: 999px;

  /* Named Radii */
  --radius-cards: 20px;
  --radius-buttons: 999px;
  --radius-navpills: 100px;
  --radius-smallcards: 14px;
  --radius-chatbubbles: 20px;

  /* Surfaces */
  --surface-canvas: #ffffff;
  --surface-band: #f5f5f4;
  --surface-nav-fill: #edeeee;
  --surface-card: #ffffff;
  --surface-chat-surface: #f55c15;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-pure-canvas: #ffffff;
  --color-bone: #f5f5f4;
  --color-mist: #edeeee;
  --color-silk-border: #e5e5e5;
  --color-quill: #d4d4d4;
  --color-ash: #a1a1a1;
  --color-pebble: #737373;
  --color-slate: #525252;
  --color-graphite: #404040;
  --color-iron: #333333;
  --color-charcoal: #262626;
  --color-midnight: #171717;
  --color-signal-blue: #397dff;
  --color-ember-stroke: #f55c15;
  --color-alarm-red: #ff0000;

  /* Typography */
  --font-tiempos-headline: 'Tiempos Headline', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-selecta: 'Selecta', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 13px;
  --leading-caption: 1.5;
  --tracking-caption: 0.33px;
  --text-body: 16px;
  --leading-body: 1.55;
  --tracking-body: 0.4px;
  --text-subheading: 18px;
  --leading-subheading: 1.47;
  --tracking-subheading: 0.45px;
  --text-heading-sm: 20px;
  --leading-heading-sm: 1.3;
  --tracking-heading-sm: -0.34px;
  --text-heading: 40px;
  --leading-heading: 1.16;
  --tracking-heading: -0.8px;
  --text-heading-lg: 56px;
  --leading-heading-lg: 1.13;
  --tracking-heading-lg: -1.12px;
  --text-display: 64px;
  --leading-display: 1;
  --tracking-display: -2.56px;

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
  --spacing-44: 44px;
  --spacing-48: 48px;
  --spacing-56: 56px;
  --spacing-64: 64px;
  --spacing-72: 72px;
  --spacing-80: 80px;
  --spacing-120: 120px;

  /* Border Radius */
  --radius-xl: 14px;
  --radius-2xl: 20px;
  --radius-full: 100px;
  --radius-full-2: 999px;
}
```
