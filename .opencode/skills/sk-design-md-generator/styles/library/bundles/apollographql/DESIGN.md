# Apollographql — Style Reference
> Mission control at midnight — a starfield console where orange is the only dial that glows.

**Theme:** mixed

Apollo uses a deep-space command-center language: a near-black navy canvas anchors every major surface, a star-field line pattern reinforces the cosmic/orchestration metaphor, and one vivid orange does all the shouting. Inter at confident weights (400 for body, 600–700 for headings, 900 for hero) keeps the system feeling developer-native rather than marketing-polished. Components are oversized and generous — testimonial cards, video panels, and feature blocks all carry 24–32px radii and 48px internal padding, making the interface feel more like a product tour than a landing page. The orange #e75e15 is rationed: it colors brand name mentions, one per-screen hero accent, and the pill action button, but never decorates backgrounds or fills cards. Every transition from dark to light surfaces uses the same gray-50 (#efefef) as a neutral floor, creating a predictable rhythm of starfield-dark panels floating on a quiet gray field.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Cosmic Ink | `#15252d` | `--color-cosmic-ink` | Hero background, testimonial card surface, headline text on light surfaces, footer, and the entire dark-mode layer |
| Cinder | `#254250` | `--color-cinder` | Secondary dark surface for testimonial and profile cards — a slightly lifted step above Cosmic Ink so cards read as separate panels without leaving the dark family |
| Fog | `#9fb2bc` | `--color-fog` | Muted dividers, dashed card separators, secondary icon strokes on dark surfaces |
| Mist | `#e2e8f0` | `--color-mist` | Hairline borders, section dividers, subtle outline controls on light surfaces |
| Cloud | `#f8f8f8` | `--color-cloud` | Page canvas, card surface, input fill — the default light ground |
| Ash | `#efefef` | `--color-ash` | Alternate section background that breaks Cloud bands without introducing a different color |
| Signal Orange | `#e75e15` | `--color-signal-orange` | Orange supporting accent for decorative details and low-frequency emphasis. Do not promote it to the primary CTA color |

## Tokens — Typography

### Inter — All interface and editorial type. Weight 400 for body and nav, 500 for UI labels, 600 for subheadings and small headlines, 700 for section headings, 900 reserved for the hero headline — the only place Apollo uses the heaviest weight, creating a clear 'stage voice' · `--font-inter`
- **Substitute:** system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif
- **Weights:** 400, 500, 600, 700, 900
- **Sizes:** 12, 14, 16, 20, 24, 30, 38, 50
- **Line height:** 0.94 (display) — 1.10 (hero) — 1.30–1.40 (body) — 1.50 (lists/long form)
- **Role:** All interface and editorial type. Weight 400 for body and nav, 500 for UI labels, 600 for subheadings and small headlines, 700 for section headings, 900 reserved for the hero headline — the only place Apollo uses the heaviest weight, creating a clear 'stage voice'

### Fira Code — Reserved for code-as-heading treatments and developer-facing copy blocks — the monospace signal tells the reader 'this is code or technical content' even when displayed at heading size. Tracking is widened to 0.08em to keep monospace headings legible · `--font-fira-code`
- **Substitute:** 'JetBrains Mono', 'Source Code Pro', Menlo, monospace
- **Weights:** 500
- **Sizes:** 18
- **Line height:** 1.25
- **Letter spacing:** 0.08em
- **Role:** Reserved for code-as-heading treatments and developer-facing copy blocks — the monospace signal tells the reader 'this is code or technical content' even when displayed at heading size. Tracking is widened to 0.08em to keep monospace headings legible

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.5 | — | `--text-caption` |
| body-sm | 14px | 1.43 | — | `--text-body-sm` |
| body | 16px | 1.5 | — | `--text-body` |
| subheading | 20px | 1.4 | — | `--text-subheading` |
| heading-sm | 24px | 1.33 | — | `--text-heading-sm` |
| heading | 30px | 1.3 | — | `--text-heading` |
| heading-lg | 38px | 1.25 | — | `--text-heading-lg` |
| display | 50px | 1.1 | — | `--text-display` |

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
| 112 | 112px | `--spacing-112` |
| 160 | 160px | `--spacing-160` |

### Border Radius

| Element | Value |
|---------|-------|
| nav | 8px |
| cards | 24-32px |
| buttons | 999px |
| videoPanels | 32px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 48-80px
- **Card padding:** 48px
- **Element gap:** 8-24px

## Components

### Pill Primary Button
**Role:** Top-right 'Start for free' action and hero CTA

Signal Orange #e75e15 fill, white text, Inter 500 at 14–16px, horizontal padding 24px, vertical padding 8–12px, border-radius 999px. No border, no shadow. Stretches slightly to fit label length — never has a fixed width.

### Ghost Pill Button
**Role:** Secondary actions like 'See how it works', 'See it in action', 'Contact us'

Transparent fill, 1px Signal Orange border (or Cosmic Ink border on light backgrounds), Inter 500, border-radius 999px, same vertical rhythm as the primary pill. The ghost variant lives next to the primary in every CTA pair.

### Header Navigation
**Role:** Top bar across every page

Cosmic Ink #15252d background, Inter 400 nav links at 14–16px in white, 8px corner radius on any pill-shaped control (search icon container). Apollo logo lockup left, nav items center-left, 'Contact us' ghost pill + 'Start for free' orange pill right.

### Hero Section
**Role:** First-screen brand statement

Full-bleed Cosmic Ink #15252d background with a subtle star-field line pattern (thin #9fb2bc lines and dots at low opacity). Centered stack: 'The API Orchestration Platform' in Inter 900 at 50px in Signal Orange (this is the only place orange occupies a full headline), then 'for AI Agents, Web, and Mobile Apps' in white, then a single muted subtext line in white at 70% opacity. CTA pair sits 32–48px below.

### Logo Wall
**Role:** Social proof band under the hero

Cloud #f8f8f8 background, 'Trusted by enterprise leaders' heading centered in Inter 600 at 20–24px in Cosmic Ink. 3-row × 6-column grid of monochrome dark logos spaced with 48px column gap. Logos sit in a flat single-row of grayscale, no cards or frames.

### Feature Showcase Panel
**Role:** Alternating product demo blocks (Apollo Connectors, GraphOS)

Cosmic Ink #15252d card surface, 32px corner radius, 48px internal padding, houses a 16:9 video thumbnail. Heading text inside the dark panel is Signal Orange, body is white at 80% opacity. A small triangular play indicator sits centered on the thumbnail.

### Split Feature Row
**Role:** Two-column text + video sections

Light Ash #efefef background. Left or right column: Inter 600 heading at 30px, Inter 400 body at 16–18px, button pair below. Opposite column holds a 32px-radius Feature Showcase Panel. Columns sit on a 12-column grid with a 48px gutter.

### Testimonial Card
**Role:** Quote blocks in 'Enterprise teams trust Apollo' section

Cinder #254250 background, 24px corner radius, 48px padding. Header row: 40px circular avatar + Inter 600 name (white) + Inter 400 role (white at 60%). Dashed Fog #9fb2bc divider separates header from quote. Quote text in Inter 400 white at full opacity, 4–6 lines.

### Inline Brand Word
**Role:** Whenever the literal word 'Apollo' appears in body or heading copy

Rendered in Signal Orange #e75e15 at the same weight and size as surrounding text. The pattern appears in hero, section headings, and any mention of the brand name within editorial copy — it functions as a signature accent without requiring a graphic.

## Do's and Don'ts

### Do
- Reserve weight 900 for the hero headline only; section headings stay at 700, body at 400.
- Use 999px radius on every pill-shaped control (buttons, tags, nav search); never square off a button.
- Pair every primary orange button with a ghost orange-border button as its sibling — CTAs arrive in pairs.
- Place 32px-radius dark video panels on the Ash #efefef field with 48px internal padding; keep starfield pattern inside the panel, not on the page.
- Use Signal Orange #e75e15 only on the brand word, one button, and one accent per section — rationing creates impact.
- Set testimonial cards on Cinder #254250 inside a page that also uses Cosmic Ink #15252d elsewhere; the step is small but necessary.
- Space sections at 48–80px vertical gap; inside cards, use 48px padding as the default — the system breathes.

### Don't
- Don't fill large surfaces with Signal Orange — it loses its glow the moment it covers more than a button.
- Don't use the star-field line pattern outside Cosmic Ink panels; on light backgrounds it reads as noise.
- Don't use Mist #e2e8f0 borders on dark panels; switch to Fog #9fb2bc for dividers on Cosmic Ink and Cinder.
- Don't set testimonial card text below 60% white opacity — the Cinder background already absorbs contrast.
- Don't apply 900 weight below 38px — at body sizes it becomes posterized and unreadable.
- Don't introduce a new accent color (blue, green, red) for states; Apollo's system communicates state through orange and neutrals only.
- Don't use Fira Code for body copy — it appears once, at heading size, as a code-signal device.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Page Canvas | `#f8f8f8` | Default body background between sections |
| 1 | Alt Band | `#efefef` | Subtle section variation, breaks monochrome rhythm without adding a new hue |
| 2 | Card Surface | `#f8f8f8` | Light cards sit on Ash bands with 24–32px radii |
| 3 | Cosmic Panel | `#15252d` | Hero, feature showcase panels, video containers — the dark stage |
| 4 | Cinder Card | `#254250` | Lifted dark card surface for testimonials and profile blocks — distinguishable from the Cosmic panel behind them |

## Elevation

- **Hero panel and feature video panels:** `none — flat Cosmic Ink fill, depth comes from the starfield line pattern, not shadows`
- **Testimonial cards on Cinder:** `none — separation from the page is achieved through the Cinder step, not shadow`

## Imagery

Visuals lean almost entirely on starfield-patterned dark panels and video thumbnails — no lifestyle photography, no product mockups in context. The starfield (thin #9fb2bc lines forming a perspective grid with small dot accents) is a brand-owned graphic that recurs on every Cosmic Ink surface, making it the system's decorative signature. Icons in nav and body are mono-stroke at 16–20px in white or Cosmic Ink. Photography appears only in testimonial avatar circles (40px, flush crop, no frame). The product itself is shown exclusively through 16:9 video containers with a centered play indicator, never as static screenshots — implying motion and live behavior.

## Layout

Pages are max-width 1200px centered with generous outer padding. The hero is full-bleed Cosmic Ink with centered headline stack. Below the hero, content alternates in bands: Cloud logo wall → Ash split feature rows → Cloud feature showcase → Ash testimonial section. Dark Feature Showcase Panels (Cosmic Ink, 32px radius) always sit inside light Ash bands, not directly on Cloud. The testimonial grid is a 3-column layout on desktop, collapsing to 1 column on mobile. Navigation is a single sticky top bar — no sidebar, no mega-menu. Vertical rhythm between sections is 80px on desktop, 48px on mobile. Cards in any grid use 24px gutter, never 16px, preserving the system's roomy feel.

## Agent Prompt Guide

Quick Color Reference:
- text (primary): #15252d
- text (on dark): #f8f8f8
- background (page): #f8f8f8
- background (alt band): #efefef
- background (dark panel): #15252d
- border / divider: #e2e8f0 (light surfaces), #9fb2bc (dark surfaces)
- accent / brand word: #e75e15
- primary action: no distinct CTA color

3–5 Example Component Prompts:

No distinct primary action color was observed; use the extracted neutral button treatments instead of inventing a filled CTA color.

2. Logo wall: Cloud #f8f8f8 background. Centered heading 'Trusted by enterprise leaders' in Inter 600, 24px, #15252d. 3×6 grid of monochrome dark logos, 48px column gap, 24px row gap, no card frames.

3. Split feature row on Ash #efefef background. Left column: Inter 700 heading 30px in #15252d, Inter 400 body 18px in #15252d at 80% opacity, then a filled orange pill button. Right column: Cosmic Ink #15252d panel with 32px radius, 48px padding, holding a 16:9 video thumbnail with a centered white play triangle. Inside the panel, small Signal Orange Inter 600 subhead and white body at 80%.

4. Testimonial card: Cinder #254250 background, 24px radius, 48px padding. Top row: 40px circular avatar, Inter 600 name in #f8f8f8 at 16px, Inter 400 role in #f8f8f8 at 60% opacity. Dashed #9fb2bc 1px divider. Quote in Inter 400 16px #f8f8f8 at full opacity.

5. Inline brand word: any heading or body sentence containing 'Apollo' should render the literal word in #e75e15 at the inherited size and weight. Example: 'Enterprise teams trust Apollo' — 'Apollo' is orange, the rest is Cosmic Ink.

## Starfield Pattern

The thin-line starfield is the system's decorative signature and only appears on Cosmic Ink surfaces. Construction: a series of fine #9fb2bc lines at 1px stroke forming a perspective grid (vertical lines converging to a vanishing point above the content, horizontal arcs sweeping across), plus scattered 1–2px dots at 30–50% opacity. The pattern is rendered as a low-opacity background, never as foreground content. It should be subtle enough that a casual viewer registers 'dark with texture' before noticing the lines.

## Similar Brands

- **Vercel** — Same max-width-1200px centered layout, identical Inter typography stack, and the same pattern of dark hero bands with a single vivid accent (orange for Apollo, near-black/white for Vercel)
- **Linear** — Both systems use oversized cards with 24–32px radii, flat surfaces with no shadows, and ration a single brand color so it stays high-impact
- **Stripe** — Same developer-tool aesthetic with generous 48px card padding, paired CTA buttons (filled + ghost), and the brand word colored inline within editorial copy
- **PlanetScale** — Dark hero with cosmic/grid texture, testimonial cards lifted one shade above the page dark, and Inter-only typography with weight 900 reserved for the hero

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-cosmic-ink: #15252d;
  --color-cinder: #254250;
  --color-fog: #9fb2bc;
  --color-mist: #e2e8f0;
  --color-cloud: #f8f8f8;
  --color-ash: #efefef;
  --color-signal-orange: #e75e15;

  /* Typography — Font Families */
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-fira-code: 'Fira Code', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --text-body-sm: 14px;
  --leading-body-sm: 1.43;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-subheading: 20px;
  --leading-subheading: 1.4;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.33;
  --text-heading: 30px;
  --leading-heading: 1.3;
  --text-heading-lg: 38px;
  --leading-heading-lg: 1.25;
  --text-display: 50px;
  --leading-display: 1.1;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
  --font-weight-black: 900;

  /* Spacing */
  --spacing-unit: 8px;
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-56: 56px;
  --spacing-112: 112px;
  --spacing-160: 160px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 48-80px;
  --card-padding: 48px;
  --element-gap: 8-24px;

  /* Border Radius */
  --radius-sm: 3px;
  --radius-lg: 8px;
  --radius-3xl: 24px;
  --radius-3xl-2: 32px;
  --radius-full: 999px;

  /* Named Radii */
  --radius-nav: 8px;
  --radius-cards: 24-32px;
  --radius-buttons: 999px;
  --radius-videopanels: 32px;

  /* Surfaces */
  --surface-page-canvas: #f8f8f8;
  --surface-alt-band: #efefef;
  --surface-card-surface: #f8f8f8;
  --surface-cosmic-panel: #15252d;
  --surface-cinder-card: #254250;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-cosmic-ink: #15252d;
  --color-cinder: #254250;
  --color-fog: #9fb2bc;
  --color-mist: #e2e8f0;
  --color-cloud: #f8f8f8;
  --color-ash: #efefef;
  --color-signal-orange: #e75e15;

  /* Typography */
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-fira-code: 'Fira Code', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --text-body-sm: 14px;
  --leading-body-sm: 1.43;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-subheading: 20px;
  --leading-subheading: 1.4;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.33;
  --text-heading: 30px;
  --leading-heading: 1.3;
  --text-heading-lg: 38px;
  --leading-heading-lg: 1.25;
  --text-display: 50px;
  --leading-display: 1.1;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-56: 56px;
  --spacing-112: 112px;
  --spacing-160: 160px;

  /* Border Radius */
  --radius-sm: 3px;
  --radius-lg: 8px;
  --radius-3xl: 24px;
  --radius-3xl-2: 32px;
  --radius-full: 999px;
}
```
