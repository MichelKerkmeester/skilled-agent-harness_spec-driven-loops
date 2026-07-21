# Dylanbrouwer — Style Reference
> Brutalist type foundry at dusk

**Theme:** mixed

A designer's portfolio that treats the page as a typographic monument: a dark hero of massive condensed display letters fading from black into light, dropping into clean monochrome content sections where every secondary element — nav, tags, labels — is stripped to its barest form. The single chromatic note is a vivid ember orange that appears as small functional punctuation: status dots, accent fills, alive signals. Typography carries the entire system: a heavy grotesque (Die Grotesk B) for body and mid-scale headings, a monospaced voice (IBM Plex Mono) for technical metadata and nav, and a super-condensed variable display face (ABC Gravity Variable) for monument-scale statements that fill the viewport. Spacing is tight and grid-ruthless, borders are hairline, corners are mostly sharp with pill rounding reserved for interactive elements, and motion is expressive with custom cubic-bezier easings that make elements feel weighted and intentional rather than bouncy.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Ember Orange | `#ff6436` | `--color-ember-orange` | Status indicators, accent dots, live signals, decorative fills — the sole chromatic note in an otherwise monochrome system |
| Onyx | `#161616` | `--color-onyx` | Dark hero background, deep badges, section dark-mode surfaces |
| Graphite | `#3c3a3e` | `--color-graphite` | Primary text, nav links, body copy, filled button text |
| Stone | `#7b7a7c` | `--color-stone` | Secondary text, heading subtitles, supporting copy |
| Ash | `#a2a2a2` | `--color-ash` | Muted helper text, inactive nav state, subtle UI metadata |
| Silver Mist | `#c9c7cc` | `--color-silver-mist` | Hairline dividers, grid lines, light borders, low-emphasis text |
| Fog | `#f1f1f1` | `--color-fog` | Light body backgrounds, subtle section washes, nav inactive background |
| Paper | `#f8f8f8` | `--color-paper` | Page canvas, base background surface |
| Pure White | `#ffffff` | `--color-pure-white` | Card surfaces, elevated panels, tag borders, card borders |
| Display Fade Gradient | `linear-gradient(rgb(0, 0, 0), rgb(110, 108, 112) 25%, rgb(185, 183, 187) 50%, rgb(220, 214, 214) 75%, rgb(241, 241, 241))` | `--color-display-fade-gradient` | Gradient fill on massive display type — black fading to mid-gray to light silver across the word |
| Horizon Gradient | `linear-gradient(90deg, rgb(123, 122, 124), rgb(60, 58, 62))` | `--color-horizon-gradient` | Section transitions and hero vignette — horizontal black to silver fade |

## Tokens — Typography

### Die Grotesk B — Primary workhorse grotesque used for body text, mid-scale headings, labels, captions, and links. Weight 500 across all sizes creates a uniform visual density — no weight contrast, hierarchy comes purely from size and color. Tighter letter-spacing at larger sizes (-0.03em at 60px) tightens the grotesque into near-condensed proportions. · `--font-die-grotesk-b`
- **Substitute:** Inter, Söhne, General Sans
- **Weights:** 500
- **Sizes:** 12px, 17px, 18px, 21px, 36px, 54px, 60px
- **Line height:** 1.0–1.3
- **Letter spacing:** -0.01em to -0.03em
- **Role:** Primary workhorse grotesque used for body text, mid-scale headings, labels, captions, and links. Weight 500 across all sizes creates a uniform visual density — no weight contrast, hierarchy comes purely from size and color. Tighter letter-spacing at larger sizes (-0.03em at 60px) tightens the grotesque into near-condensed proportions.

### ABC Gravity Variable — Monument-scale super-condensed display face. Used only for hero statements and section openers that fill the viewport. The extremely tight line-height (0.74) lets massive 288px letters stack with minimal vertical air — letters physically touch or nearly touch, creating a wall of type. Variable weight axis allows subtle weight shifts even at this scale. · `--font-abc-gravity-variable`
- **Substitute:** Bebas Neue, Anton, Oswald
- **Weights:** 400–500
- **Sizes:** 12px, 23px, 96px, 274px, 288px
- **Line height:** 0.74
- **Letter spacing:** -0.005em to -0.02em
- **Role:** Monument-scale super-condensed display face. Used only for hero statements and section openers that fill the viewport. The extremely tight line-height (0.74) lets massive 288px letters stack with minimal vertical air — letters physically touch or nearly touch, creating a wall of type. Variable weight axis allows subtle weight shifts even at this scale.

### IBM Plex Mono — Technical voice for metadata, timestamps, nav labels, status text, and icon-adjacent micro-copy. Always uppercase, always small (12–14px). The monospaced rhythm signals 'system data' and contrasts against the grotesque's proportional flow — it reads as a developer/designer interface layer over the editorial body. · `--font-ibm-plex-mono`
- **Substitute:** JetBrains Mono, Space Mono, Geist Mono
- **Weights:** 500–600
- **Sizes:** 12px, 14px
- **Line height:** 1.0–1.3
- **Letter spacing:** -0.01em to -0.02em
- **Role:** Technical voice for metadata, timestamps, nav labels, status text, and icon-adjacent micro-copy. Always uppercase, always small (12–14px). The monospaced rhythm signals 'system data' and contrasts against the grotesque's proportional flow — it reads as a developer/designer interface layer over the editorial body.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| micro | 12px | 1.3 | -0.01px | `--text-micro` |
| caption | 14px | 1 | -0.01px | `--text-caption` |
| body-sm | 17px | 1.3 | -0.01px | `--text-body-sm` |
| body | 21px | 1.1 | -0.02px | `--text-body` |
| subheading | 23px | 1 | -0.005px | `--text-subheading` |
| heading-sm | 36px | 1 | -0.03px | `--text-heading-sm` |
| heading | 60px | 1 | -0.03px | `--text-heading` |
| heading-lg | 96px | 0.74 | -0.01px | `--text-heading-lg` |
| heading-xl | 274px | 0.74 | -0.02px | `--text-heading-xl` |
| display | 288px | 0.74 | -0.01px | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 6px

**Density:** compact

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 6 | 6px | `--spacing-6` |
| 12 | 12px | `--spacing-12` |
| 18 | 18px | `--spacing-18` |
| 24 | 24px | `--spacing-24` |
| 48 | 48px | `--spacing-48` |
| 60 | 60px | `--spacing-60` |
| 72 | 72px | `--spacing-72` |
| 96 | 96px | `--spacing-96` |
| 120 | 120px | `--spacing-120` |

### Border Radius

| Element | Value |
|---------|-------|
| nav | 9999px |
| cards | 0px |
| badges | 9999px |
| inputs | 0px |
| panels | 14.4px |
| buttons | 9999px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 48-80px
- **Card padding:** 12-24px
- **Element gap:** 6-12px

## Components

### Pill Nav Button
**Role:** Primary navigation interactive element

Transparent background, 1px border in #3c3a3 at 15% alpha (#3c3a3e26), 9999px border-radius, 7px 12px padding. Text in IBM Plex Mono 14px weight 500 uppercase, Graphite (#3c3a3e). Optional '+' or '•' prefix glyph in 12px. Sits inline in horizontal nav row with 6px column-gap.

### Ghost Text Link
**Role:** Inline editorial link or text-only call-to-action

No background, no border, 0px radius. Text in Die Grotesk B 17–21px weight 500, Graphite (#3c3a3e). May include underline on hover via 1px solid #3c3a3e. Used for 'More about me', 'Discover more', and similar editorial navigation.

### Project Card
**Role:** Work/showcase card displaying portfolio pieces

Transparent background, 0px border-radius, no box-shadow, 12px horizontal padding. Content is a media element (image/video) with text overlay. Cards arrange in grid with 12px gaps. No visible card chrome — the image IS the card.

### Brand Logo Card
**Role:** Client/collaborator logo display card

Semi-transparent white background rgba(255, 255, 255, 0.5), 0px border-radius, 12px padding-top, 12px padding-right, 12px padding-left, 18px padding-bottom, no box-shadow. Logos rendered in monochrome gray. Cards arranged in horizontal strip with slanted/skewed dividers between them.

### Pill Tag Badge
**Role:** Categorical tag or label

Dark Onyx (#161616) background, Pure White (#f1f1f1) text, 0px border-radius (rectangular, not pill), 0px 6px padding, 6px row-gap between tags. Text in IBM Plex Mono 12–14px weight 500–600 uppercase. Used for skill tags, category labels, metadata.

### Ghost Glass Tag
**Role:** Low-emphasis contextual label on dark backgrounds

Ultra-subtle white background rgba(255, 255, 255, 0.05), white text at 70% opacity rgba(255, 255, 255, 0.7), 0px radius, 0px 6px padding. 1px white border at 15% alpha (#ffffff26) for edge definition. Text in IBM Plex Mono 12–14px uppercase. Disappears into dark surfaces — reads as a watermark label.

### Ember Status Dot
**Role:** Live/active indicator or decorative accent

Circular 50% border-radius in Ember Orange (#ff6436), text in Graphite (#3c3a3e), 0px padding. Small element (~8–12px diameter). Functions as a 'live now' dot, attention marker, or decorative accent on cards. The only place the orange accent appears as a standalone element.

### Gradient Display Headline
**Role:** Hero-scale typographic statement

ABC Gravity Variable at 274–288px weight 400 uppercase, line-height 0.74, letter-spacing -0.01 to -0.02em. Fill is a multi-stop linear-gradient from #000 through #6e6c70 (25%), #b9b7bb (50%), #dcd6d6 (75%) to #f1f1f1 — black to light across the word. The gradient maps to the visual metaphor of letters emerging from darkness into light. Sits on dark hero background (#161616) creating dramatic contrast.

### Light Content Section
**Role:** Standard content area below the hero

Paper (#f8f8f8) or Fog (#f1f1f1) background, max-width 1200px centered. Section headings in Die Grotesk B 60px weight 500 or ghosted ABC Gravity Variable 96px+ at 100% white. Vertical rhythm: 48–80px section gaps. Subtle hairline dividers in Silver Mist (#c9c7cc) at 1px.

### Hairline Divider
**Role:** Section separator or grid line

1px solid stroke in Silver Mist (#c9c7cc) or rgba(60, 58, 62, 0.15). Creates invisible-grid structure across light sections. No decorative weight — pure structural line.

### Monitor Mockup Frame
**Role:** Device frame containing project media preview

Thin-bezel display frame on stand, rendered as 3D product mockup. Contains a 3D scene or interactive project preview (e.g., game environment with green/teal lighting). Positioned at slight perspective angle. Functions as hero visual anchor — the portfolio piece is literally displayed on a screen within the screen.

### Ghosted Section Title
**Role:** Ultra-large background label for section identification

ABC Gravity Variable at 96px+ weight 400 uppercase, rendered in Pure White (#ffffff) at near-100% on a light gray (#f1f1f1) background. The text nearly vanishes into the surface — only edge/anti-aliasing makes it readable. Functions as a typographic watermark labeling the section while creating a quiet visual texture.

## Do's and Don'ts

### Do
- Use Die Grotesk B weight 500 for all body and mid-scale heading text — the uniform weight is the signature, never switch to 400 or 700 within this face
- Reserve ABC Gravity Variable exclusively for display-scale (96px+) monument headings and section openers — never use it below 23px
- Apply the black-to-light gradient fill only on display-scale ABC Gravity Variable text, never on body or small headings
- Use Ember Orange (#ff6436) only as a small functional element: status dots, accent fills, live indicators — never as a background wash, button fill, or large surface
- Use 9999px border-radius exclusively for interactive elements (nav buttons, tags) and 0px for all cards and panels — sharp corners define the editorial feel
- Set IBM Plex Mono text to uppercase at all times — it functions as a system/data layer and the case signals that role
- Maintain letter-spacing at -0.03em for all Die Grotesk B headings 36px and above — the tight tracking is what makes the grotesque feel condensed and confident

### Don't
- Don't use multiple chromatic colors — the system is monochrome with orange as the sole accent; introducing additional hues breaks the discipline
- Don't apply shadows or elevation to cards — the system uses flat surfaces with hairline borders, not depth
- Don't use border-radius on cards or content panels — corners are sharp; pills are reserved for interactive elements only
- Don't mix weight variants within Die Grotesk B — stay at 500 across all sizes and contexts
- Don't use ABC Gravity Variable for body or small text — it is a display face only; using it below 23px destroys its monument character
- Don't center-align body paragraphs or mid-scale headings — left-align with tight measure; center is reserved for display statements
- Don't use bouncy or spring easings — motion uses custom cubic-bezier curves (0.32, 0.72, 0, 1) and (0.19, 1, 0.22, 1) for weighted, intentional movement

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Page Canvas | `#f8f8f8` | Base page background |
| 1 | Card Surface | `#ffffff` | Elevated cards, logo strips, content panels |
| 2 | Section Wash | `#f1f1f1` | Subtle section backgrounds, nav inactive states |
| 3 | Accent Surface | `#ff6436` | Highlighted callouts, status surfaces |
| 4 | Dark Hero | `#161616` | Dark hero section, dramatic inverted mode |

## Elevation

The system deliberately avoids shadows and elevation. Depth is communicated through background contrast (dark hero vs. light sections), hairline borders, and backdrop blur (blur(5px) on overlapping elements) rather than drop shadows. Flatness is the signature — surfaces sit on the page like printed layers, not floating cards.

## Imagery

Imagery is treated as product showcase, not decoration: 3D-rendered device mockups (monitors on stands) display interactive project previews at slight perspective angles, making portfolio pieces feel like physical products. No lifestyle photography, no people, no stock imagery. The only color in the imagery comes from the project content itself (e.g., the green/teal-lit 3D game environment inside the monitor). Media is always contained within frames with no rounded corners or shadows — the device frame IS the container.

## Layout

The page follows a dark-to-light rhythm: the hero is full-bleed dark (#161616) with centered monument-scale display type that fills 80% of viewport width, and a 3D monitor mockup anchored center-stage. Below the hero, content shifts to max-width 1200px centered on Paper (#f8f8f8) canvas, with 48–80px vertical section gaps creating generous breathing room. Mid-page sections use subtle hairline grid lines in Silver Mist to create an invisible structural grid. The brands/collaborators section is a horizontal white card strip with skewed dividers between logos. Section openers use ghosted (white-on-light-gray) 96px+ display text as visual watermarks. Navigation is a top bar with pill-shaped buttons prefixed with '+' or '•' glyphs, sitting directly on the dark hero with no background bar — it floats on the surface.

## Agent Prompt Guide

## Quick Color Reference
- Background: #f8f8f8 (canvas), #ffffff (card), #161616 (dark hero)
- Text: #3c3a3e (primary), #7b7a7c (secondary), #a2a2a2 (muted)
- Border: #c9c7cc (hairline), rgba(60, 58, 62, 0.15) (subtle)
- Accent: #ff6436 (ember orange — dots, status, small highlights only)
- primary action: no distinct CTA color

## Example Component Prompts

1. **Create a hero section**: Dark background (#161616), full-bleed. Monument headline in ABC Gravity Variable 288px weight 400 uppercase, line-height 0.74, letter-spacing -0.01em, filled with gradient: linear-gradient(rgb(0,0,0), rgb(110,108,112) 25%, rgb(185,183,187) 50%, rgb(220,214,214) 75%, rgb(241,241,1)). Subtext in Die Grotesk B 21px weight 500, #7b7a7c, letter-spacing -0.02em. Top nav: 4 pill buttons with 9999px radius, 7px 12px padding, 1px border in #3c3a3e26, IBM Plex Mono 14px weight 500 uppercase in #3c3a3e.

2. **Create a project card grid**: White (#ffffff) background, 0px radius, 12px horizontal padding, no shadow. Images fill the card edge-to-edge with no border. Section title ghosted in ABC Gravity Variable 96px weight 400 uppercase, #ffffff on #f1f1f1 surface. 12px gap between cards in a 3-column grid.

3. **Create a metadata tag row**: Tags in IBM Plex Mono 12px weight 600 uppercase, #f1f1f1 text on #161616 background, 0px radius, 0px 6px padding, 6px row-gap between tags. For dark-surface variants: rgba(255,255,255,0.05) background with 1px #ffffff26 border and rgba(255,255,255,0.7) text.

4. **Create a section opener with ghosted display text**: Background #f1f1f1. Ghosted label in ABC Gravity Variable 120px weight 400 uppercase, #ffffff, sitting at the bottom of the section. Content above it in Die Grotesk B 60px weight 500, #3c3a3e, letter-spacing -0.03em. 48px vertical gap between elements.

5. **Create a brand logo strip**: Horizontal card with rgba(255,255,255,0.5) background, 0px radius, 12px top/side padding, 18px bottom padding. 6 logos in a row, each 12px apart, separated by thin 1px skewed dividers in #c9c7cc. Logos rendered in #7b7a7c monochrome.

## Motion System

Motion is expressive but weighted — not bouncy. Primary easings: cubic-bezier(0.32, 0.72, 0, 1) for entrance animations (fast start, gentle settle), and cubic-bezier(0.19, 1, 0.22, 1) for exit and morph transitions (slow start, decisive finish). Standard durations: 0.3s for micro-interactions (hover, focus), 0.5s for component-level transitions, 0.6–0.75s for page-level reveals. No spring physics, no overshoot. Properties animated: transform (translate, rotate, scale), opacity, and color — never animate width/height or layout properties. The dark hero elements animate in with staggered translate-y + opacity, creating a cinematic build-up before the light content sections.

## Gradient System

Two gradient families serve distinct purposes:

1. **Display Type Gradient** — Multi-stop black-to-light linear gradient (top to bottom): #000000 → #6e6c70 (25%) → #b9b7bb (50%) → #dcd6d6 (75%) → #f1f1f1. Applied exclusively as background-clip: text on ABC Gravity Variable display headlines. The gradient creates the illusion of letters emerging from shadow into light — the word is the light source.

2. **Horizon Gradient** — 90deg horizontal fade from #7b7a7c to #3c3a3e. Used as subtle section transitions and decorative dividers. The horizontal direction signals spatial depth — as if looking at a horizon line.

Never apply gradients to backgrounds, buttons, or body text. Gradients are a typographic and atmospheric device, not a surface treatment.

## Similar Brands

- **Locomotive (locomotive.ca)** — Same dark-to-light portfolio rhythm, massive condensed display type, monochrome palette with single accent, and emphasis on motion/expression as design system
- **Rauno Freiberg (raunofreiberg.com)** — Brutalist type-first designer portfolio with oversized display headings, tight letter-spacing, and minimal chromatic palette
- **Resn (resn.co.nz)** — Experimental creative agency portfolio with dramatic type, dark hero opener, and emphasis on interactive 3D product showcases over photography
- **Active Theory (activetheory.net)** — Immersive web portfolio using 3D device mockups as the primary visual device, dark dramatic hero, and tight technical grid systems

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-ember-orange: #ff6436;
  --color-onyx: #161616;
  --color-graphite: #3c3a3e;
  --color-stone: #7b7a7c;
  --color-ash: #a2a2a2;
  --color-silver-mist: #c9c7cc;
  --color-fog: #f1f1f1;
  --color-paper: #f8f8f8;
  --color-pure-white: #ffffff;
  --color-display-fade-gradient: #000000;
  --gradient-display-fade-gradient: linear-gradient(rgb(0, 0, 0), rgb(110, 108, 112) 25%, rgb(185, 183, 187) 50%, rgb(220, 214, 214) 75%, rgb(241, 241, 241));
  --color-horizon-gradient: #6e6c70;
  --gradient-horizon-gradient: linear-gradient(90deg, rgb(123, 122, 124), rgb(60, 58, 62));

  /* Typography — Font Families */
  --font-die-grotesk-b: 'Die Grotesk B', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-abc-gravity-variable: 'ABC Gravity Variable', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-ibm-plex-mono: 'IBM Plex Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-micro: 12px;
  --leading-micro: 1.3;
  --tracking-micro: -0.01px;
  --text-caption: 14px;
  --leading-caption: 1;
  --tracking-caption: -0.01px;
  --text-body-sm: 17px;
  --leading-body-sm: 1.3;
  --tracking-body-sm: -0.01px;
  --text-body: 21px;
  --leading-body: 1.1;
  --tracking-body: -0.02px;
  --text-subheading: 23px;
  --leading-subheading: 1;
  --tracking-subheading: -0.005px;
  --text-heading-sm: 36px;
  --leading-heading-sm: 1;
  --tracking-heading-sm: -0.03px;
  --text-heading: 60px;
  --leading-heading: 1;
  --tracking-heading: -0.03px;
  --text-heading-lg: 96px;
  --leading-heading-lg: 0.74;
  --tracking-heading-lg: -0.01px;
  --text-heading-xl: 274px;
  --leading-heading-xl: 0.74;
  --tracking-heading-xl: -0.02px;
  --text-display: 288px;
  --leading-display: 0.74;
  --tracking-display: -0.01px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;

  /* Spacing */
  --spacing-unit: 6px;
  --spacing-6: 6px;
  --spacing-12: 12px;
  --spacing-18: 18px;
  --spacing-24: 24px;
  --spacing-48: 48px;
  --spacing-60: 60px;
  --spacing-72: 72px;
  --spacing-96: 96px;
  --spacing-120: 120px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 48-80px;
  --card-padding: 12-24px;
  --element-gap: 6-12px;

  /* Border Radius */
  --radius-xl: 14.4px;
  --radius-full: 9999px;

  /* Named Radii */
  --radius-nav: 9999px;
  --radius-cards: 0px;
  --radius-badges: 9999px;
  --radius-inputs: 0px;
  --radius-panels: 14.4px;
  --radius-buttons: 9999px;

  /* Surfaces */
  --surface-page-canvas: #f8f8f8;
  --surface-card-surface: #ffffff;
  --surface-section-wash: #f1f1f1;
  --surface-accent-surface: #ff6436;
  --surface-dark-hero: #161616;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-ember-orange: #ff6436;
  --color-onyx: #161616;
  --color-graphite: #3c3a3e;
  --color-stone: #7b7a7c;
  --color-ash: #a2a2a2;
  --color-silver-mist: #c9c7cc;
  --color-fog: #f1f1f1;
  --color-paper: #f8f8f8;
  --color-pure-white: #ffffff;
  --color-display-fade-gradient: #000000;
  --color-horizon-gradient: #6e6c70;

  /* Typography */
  --font-die-grotesk-b: 'Die Grotesk B', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-abc-gravity-variable: 'ABC Gravity Variable', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-ibm-plex-mono: 'IBM Plex Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-micro: 12px;
  --leading-micro: 1.3;
  --tracking-micro: -0.01px;
  --text-caption: 14px;
  --leading-caption: 1;
  --tracking-caption: -0.01px;
  --text-body-sm: 17px;
  --leading-body-sm: 1.3;
  --tracking-body-sm: -0.01px;
  --text-body: 21px;
  --leading-body: 1.1;
  --tracking-body: -0.02px;
  --text-subheading: 23px;
  --leading-subheading: 1;
  --tracking-subheading: -0.005px;
  --text-heading-sm: 36px;
  --leading-heading-sm: 1;
  --tracking-heading-sm: -0.03px;
  --text-heading: 60px;
  --leading-heading: 1;
  --tracking-heading: -0.03px;
  --text-heading-lg: 96px;
  --leading-heading-lg: 0.74;
  --tracking-heading-lg: -0.01px;
  --text-heading-xl: 274px;
  --leading-heading-xl: 0.74;
  --tracking-heading-xl: -0.02px;
  --text-display: 288px;
  --leading-display: 0.74;
  --tracking-display: -0.01px;

  /* Spacing */
  --spacing-6: 6px;
  --spacing-12: 12px;
  --spacing-18: 18px;
  --spacing-24: 24px;
  --spacing-48: 48px;
  --spacing-60: 60px;
  --spacing-72: 72px;
  --spacing-96: 96px;
  --spacing-120: 120px;

  /* Border Radius */
  --radius-xl: 14.4px;
  --radius-full: 9999px;
}
```
