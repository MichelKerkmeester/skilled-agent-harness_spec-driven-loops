# Nakedcityfilms — Style Reference
> electric blue headline over cinematic void

**Theme:** mixed

Naked City Films operates as a high-contrast editorial production brand: a flat, shadowless canvas that swings between cool gray daylight and near-black midnight, anchored by a single electric blue (#0004eb) that functions as both voice and verb. Typography is the entire interface — an ultralight-to-medium neo-grotesque pairs against an italic display serif for category labels, creating a magazine-spread rhythm where giant 68px headlines sit beside 13px navigation in the same family. Layout is deliberately asymmetric, floating UI panels over full-bleed cinematic media, with generous negative space used as a compositional element rather than leftover. The system rejects decoration: no shadows, no gradients, no rounded corners — confidence comes from type weight contrast, color commitment, and scale.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Electric Cobalt | `#0004eb` | `--color-electric-cobalt` | Headlines, nav links, logo block fill, project category labels, section accents — the only chromatic voice in the system, treated at massive scale (wordmarks, 44–68px type) to dominate every surface it touches |
| Abyssal Ink | `#050516` | `--color-abyssal-ink` | Dark section canvases, primary body text on light surfaces, reversed logo lockup — near-black with a barely-perceptible blue cast that keeps it on-brand rather than neutral |
| Bone White | `#ffffff` | `--color-bone-white` | Light section canvases, inverted text on dark and blue surfaces, floating card backgrounds over media |
| Concrete Mist | `#e6e6e6` | `--color-concrete-mist` | Primary light-mode page canvas, muted text fills, ghost-surface panels — the cool gray ground that lets the blue detonate |
| Fog Gray | `#979797` | `--color-fog-gray` | Secondary text, meta labels, placeholders, scrolling ticker background, low-emphasis chrome |

## Tokens — Typography

### Haas Grotesk — Primary type system for all UI, nav, body, and display. Weight 100 (ultralight) and weight 500 (medium) are used in deliberate tension — ultralight for ambient/nav/micro-copy, medium for headlines and emphasis. The ultralight is anti-convention; most brands use 500–700 for headlines, this system whispers and then SHOUTS with the same family · `--font-haas-grotesk`
- **Substitute:** Neue Haas Grotesk, Inter, Helvetica Neue
- **Weights:** 100, 500
- **Sizes:** 12, 13, 16, 18, 26, 44, 68
- **Line height:** 1.00, 1.10, 1.11, 1.20, 1.67, 2.31
- **Letter spacing:** -0.0300em at 44–68px, -0.0150em at 26px, -0.0120em at 18px, -0.0100em at 12–16px
- **Role:** Primary type system for all UI, nav, body, and display. Weight 100 (ultralight) and weight 500 (medium) are used in deliberate tension — ultralight for ambient/nav/micro-copy, medium for headlines and emphasis. The ultralight is anti-convention; most brands use 500–700 for headlines, this system whispers and then SHOUTS with the same family

### TRJNDaVinci — Display italic serif for project category labels and editorial accent lines ('Basketball', 'New York Knicks', 'Prompt & Purpose') — the only non-grotesque voice in the system, used sparingly to create a cinematic-magazine credit-roll feel against the geometric body type · `--font-trjndavinci`
- **Substitute:** Playfair Display Italic, Tiempos Headline Italic, Lora Italic
- **Weights:** 500 italic
- **Sizes:** 26, 44, 68
- **Line height:** 1.10, 1.20
- **Letter spacing:** -0.0300em
- **Role:** Display italic serif for project category labels and editorial accent lines ('Basketball', 'New York Knicks', 'Prompt & Purpose') — the only non-grotesque voice in the system, used sparingly to create a cinematic-magazine credit-roll feel against the geometric body type

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.67 | -0.12px | `--text-caption` |
| body | 16px | 1.67 | -0.16px | `--text-body` |
| subheading | 18px | 1.67 | -0.216px | `--text-subheading` |
| heading-sm | 26px | 1.11 | -0.39px | `--text-heading-sm` |
| heading | 44px | 1.1 | -1.32px | `--text-heading` |
| display | 68px | 1 | -2.04px | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 10 | 10px | `--spacing-10` |
| 12 | 12px | `--spacing-12` |
| 20 | 20px | `--spacing-20` |
| 30 | 30px | `--spacing-30` |
| 40 | 40px | `--spacing-40` |
| 70 | 70px | `--spacing-70` |
| 80 | 80px | `--spacing-80` |
| 85 | 85px | `--spacing-85` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 0px |
| badges | 0px |
| buttons | 0px |
| logoBlock | 0px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 70px
- **Card padding:** 20px
- **Element gap:** 12px

## Components

### NKD Logo Lockup
**Role:** Primary brand mark

Custom wordmark: 'NKD' in Haas Grotesk weight 500 in #050516 (light mode) or #ffffff (dark mode), followed by a superscripted blue (#0004eb) square accent. The full extended lockup pairs NKD with 'CITY' set in white weight 500 on an Electric Cobalt (#0004eb) rectangular block of equal cap-height. Zero radius on the blue block. Total lockup is the loudest element on every page.

### Floating Navigation Bar
**Role:** Primary site navigation

Top-aligned nav with NKD center, link groups flanking left ('Talents¹³', 'Studio') and right ('About', 'Contact'). Links in Haas Grotesk weight 100 at 13px, color #0004eb on light canvas / #ffffff on dark canvas. Superscript count badge ('¹³') in weight 500 adds editorial detail. No background fill, no border — floats directly on canvas.

### Editorial Headline Block
**Role:** Primary content statement

Haas Grotesk weight 500 at 44–68px, line-height 1.10–1.20, color #0004eb on light surfaces. Tight tracking (-1.32px to -2.04px) creates dense, magazine-cover compression. Often paired with a gray placeholder bar (#979797) for redacted/forthcoming content. Asymmetric placement — pushed to the right column, not centered.

### Project Card (Dark Mode)
**Role:** Work showcase entry

Full-width card on #050516 canvas. Category label in DaVinci italic at 26px, #0004eb, leading the card. Project title in Haas Grotesk weight 500 at 18–26px, #ffffff, tracking -0.216 to -0.39px. No border, no shadow, no radius — content sits directly on dark surface with generous vertical gap (40–70px) between cards. Asymmetric grid placement, not uniform columns.

### Hero Media Overlay Card
**Role:** Hero section UI

White (#ffffff) rectangular panel floating centered over full-bleed cinematic video. Contains the NKD CITY extended lockup at massive scale and bottom-edge scrolling ticker. No border, no radius, no shadow — the contrast with media is enough to separate it.

### Scrolling Ticker
**Role:** Scroll-prompt marquee

Horizontal repeating text band at the bottom of the hero card. 'scroll down ·' in Haas Grotesk weight 500 at 12–13px, #0004eb on #979797 background, or reversed. Letter-spacing tight (-0.12px), line-height 1.67. Continuous CSS scroll animation.

### Tagline Strip
**Role:** Brand micro-voice

Single-line statement in Haas Grotesk weight 100 at 13px, color #0004eb, positioned bottom-left of light sections. 'Smart stories. Bold execution. No shortcuts.' — serves as a quiet editorial signature, not a CTA.

### Placeholder/Redacted Text Bar
**Role:** Forthcoming content indicator

Solid #979797 rectangle used to mask unreleased project names or statements. Sits inline with editorial headline blocks, same cap-height as surrounding type, creating a deliberate 'classified' or 'censored' visual gesture. This is a signature element, not an error state.

## Do's and Don'ts

### Do
- Use Electric Cobalt (#0004eb) at large scale (26px+) for any primary headline or category label — it is a voice, not a highlight color
- Pair Haas Grotesk weight 100 (ambient) with weight 500 (emphasis) in the same block to create tension within a single family
- Apply tight tracking at scale: -2.04px at 68px, -1.32px at 44px, -0.39px at 26px — looser tracking at display sizes reads as weak
- Alternate between #e6e6e6 light canvas and #050516 dark canvas section-by-section; the swing is the rhythm
- Let media bleed to the viewport edge; overlay UI on top with white or dark cards, never inset imagery into containers
- Use TRJNDaVinci italic at 26px+ exclusively for project categories and editorial accent — never for body or UI labels
- Maintain zero radius on all surfaces, blocks, and cards — the system is architecturally sharp

### Don't
- Do not apply shadows, blurs, or any elevation effects — depth comes from surface contrast only
- Do not round corners on the blue logo block, cards, buttons, or images — the flatness is the identity
- Do not use Electric Cobalt (#0004eb) for small text below 16px — it loses authority at micro scale
- Do not mix the display serif (DaVinci) with body copy or navigation — it belongs only to editorial category labels
- Do not center content unless it is the hero card — the layout language is asymmetric, not balanced
- Do not add gradients, textures, or decorative backgrounds to the blue — it must read as a single flat ink
- Do not use #979797 for primary text or interactive states — it is reserved for meta labels, placeholders, and ticker backgrounds

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Light Canvas | `#e6e6e6` | Default page background for editorial sections, text-heavy zones, transition areas |
| 2 | Floating Card | `#ffffff` | White panels that float above media or sit on the light canvas for maximum contrast and content isolation |
| 3 | Dark Mode Canvas | `#050516` | Immersive project showcase sections, work reels, dark editorial spreads |
| 4 | Full-Bleed Media | `video/image` | Cinematic background footage with UI floating as overlay cards |

## Elevation

The design system has zero shadows. Depth is created exclusively through surface contrast — light gray (#e6e6e6) against white (#ffffff), dark (#050516) against the electric blue (#0004eb), and media beneath floating cards. This flatness is a deliberate statement: the brand does not lift off the page, it commits to it. The absence of blur and ambient shadow is what gives the type its power.

## Imagery

Full-bleed cinematic video and high-resolution photography dominate immersive sections — outdoor lifestyle footage (canoeing on a lake, people in nature) shot in warm golden-hour light, intentionally contrasting with the cool gray UI that floats on top. Imagery is never cropped to UI containers; it always bleeds to the viewport edge, with cards and text overlaid. No product screenshots, no illustrations, no abstract graphics. The visual language is pure documentary cinema: the people, the place, the story.

## Agent Prompt Guide

**Quick Color Reference**
- text: #050516 (dark on light) / #ffffff (light on dark)
- background: #e6e6e6 (light canvas) / #050516 (dark canvas) / #ffffff (floating card)
- border: none (the system does not use borders)
- accent: #0004eb (Electric Cobalt — headlines, links, category labels, logo block)
- muted: #979797 (meta text, placeholders, ticker background)
- primary action: no distinct CTA color

**Example Component Prompts**

1. Create a hero section: full-bleed cinematic video background (16:9, outdoor documentary footage). Over it, a centered white (#ffffff) floating card with zero radius, no shadow. Inside the card, the NKD CITY lockup: 'NKD' in Haas Grotesk 500 at 120px in #050516, followed by 'CITY' in Haas Grotesk 500 at 120px white text on an #0004eb block of equal cap-height. Below the card, a scrolling ticker bar: #979797 background, 'scroll down · scroll down ·' in #0004eb Haas Grotesk 500 at 13px, letter-spacing -0.13px, animated left-scrolling.

2. Create an editorial headline section on #e6e6e6 canvas. Headline in Haas Grotesk 500 at 68px, #0004eb, line-height 1.00, letter-spacing -2.04px, positioned right-aligned at 60% page width. Below it, a #979797 solid rectangle bar (40% width, 20px height) as a redacted-content placeholder. Bottom-left corner: tagline in Haas Grotesk 100 at 13px, #0004eb, letter-spacing -0.13px.

3. Create a dark project grid on #050516 canvas. Project cards placed in an asymmetric layout (not uniform columns). Each card: category label in DaVinci italic 500 at 26px in #0004eb with letter-spacing -0.78px, followed by project title in Haas Grotesk 500 at 18px in #ffffff with letter-spacing -0.18px. 70px vertical gap between cards. No borders, no shadows, no backgrounds — text sits directly on the dark canvas.

4. Create a navigation bar: NKD logo center in Haas Grotesk 500 at 16px #050516, with a small #0004eb superscript square accent after the K. Left group: 'Talents¹³' and 'Studio' links in Haas Grotesk 100 at 13px #0004eb, letter-spacing -0.13px. Right group: 'About' and 'Contact' in same style. The '¹³' superscript in weight 500. No background, no border, sits directly on the #e6e6e6 canvas.

5. Create a scrolling marquee ticker: full-width bar, 28px height, #979797 background. Text: 'scroll down · ' repeated, in Haas Grotesk 500 at 12px #0004eb, letter-spacing -0.12px, animated with continuous left-scroll CSS animation, linear timing, no easing.

## Motion & Interaction

The system is visually static but alive at edges: a continuous horizontal scroll ticker is the only persistent motion element. Scroll-triggered section reveals should be instant cuts (no fade, no slide) — the light-to-dark section alternation is the transition. Hover states on links and nav items: color shift to #0004eb if not already, or weight shift from 100 to 500. No parallax, no scroll-jacking, no decorative animation.

## Similar Brands

- **Buck** — Same full-bleed cinematic media with minimal flat UI overlay, and commitment to a single saturated accent color against neutral canvas
- **Manual Creative** — Asymmetric editorial layouts, ultralight-to-medium weight contrast within a single geometric sans, and zero-decoration flat surfaces
- **Giant Ant** — Production company portfolio with dark immersive project sections alternating with light editorial canvas, tight typographic system
- **Studio Terri** — Bold single-color accent (electric blue) used at massive type scale, sharp angular layout with no rounded corners or shadows
- **Pentagram** — Editorial magazine-spread rhythm, display italic serif paired with neo-grotesque body, generous negative space used compositionally

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-electric-cobalt: #0004eb;
  --color-abyssal-ink: #050516;
  --color-bone-white: #ffffff;
  --color-concrete-mist: #e6e6e6;
  --color-fog-gray: #979797;

  /* Typography — Font Families */
  --font-haas-grotesk: 'Haas Grotesk', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-trjndavinci: 'TRJNDaVinci', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.67;
  --tracking-caption: -0.12px;
  --text-body: 16px;
  --leading-body: 1.67;
  --tracking-body: -0.16px;
  --text-subheading: 18px;
  --leading-subheading: 1.67;
  --tracking-subheading: -0.216px;
  --text-heading-sm: 26px;
  --leading-heading-sm: 1.11;
  --tracking-heading-sm: -0.39px;
  --text-heading: 44px;
  --leading-heading: 1.1;
  --tracking-heading: -1.32px;
  --text-display: 68px;
  --leading-display: 1;
  --tracking-display: -2.04px;

  /* Typography — Weights */
  --font-weight-thin: 100;
  --font-weight-medium: 500;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-20: 20px;
  --spacing-30: 30px;
  --spacing-40: 40px;
  --spacing-70: 70px;
  --spacing-80: 80px;
  --spacing-85: 85px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 70px;
  --card-padding: 20px;
  --element-gap: 12px;

  /* Named Radii */
  --radius-cards: 0px;
  --radius-badges: 0px;
  --radius-buttons: 0px;
  --radius-logoblock: 0px;

  /* Surfaces */
  --surface-light-canvas: #e6e6e6;
  --surface-floating-card: #ffffff;
  --surface-dark-mode-canvas: #050516;
  --surface-full-bleed-media: video/image;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-electric-cobalt: #0004eb;
  --color-abyssal-ink: #050516;
  --color-bone-white: #ffffff;
  --color-concrete-mist: #e6e6e6;
  --color-fog-gray: #979797;

  /* Typography */
  --font-haas-grotesk: 'Haas Grotesk', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-trjndavinci: 'TRJNDaVinci', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.67;
  --tracking-caption: -0.12px;
  --text-body: 16px;
  --leading-body: 1.67;
  --tracking-body: -0.16px;
  --text-subheading: 18px;
  --leading-subheading: 1.67;
  --tracking-subheading: -0.216px;
  --text-heading-sm: 26px;
  --leading-heading-sm: 1.11;
  --tracking-heading-sm: -0.39px;
  --text-heading: 44px;
  --leading-heading: 1.1;
  --tracking-heading: -1.32px;
  --text-display: 68px;
  --leading-display: 1;
  --tracking-display: -2.04px;

  /* Spacing */
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-20: 20px;
  --spacing-30: 30px;
  --spacing-40: 40px;
  --spacing-70: 70px;
  --spacing-80: 80px;
  --spacing-85: 85px;
}
```
