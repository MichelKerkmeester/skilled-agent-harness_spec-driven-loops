# Val Town — Style Reference
> daylight IDE with cyan sparks. White-washed IDE where chrome recedes, code glows in syntax colors, and one electric cyan button reads as 'run'.

**Theme:** light

Val Town uses a daylight-IDE visual language: a near-white canvas with a single vivid cyan as the "run" button accent, playful magenta and violet used sparingly to energize specific words inside otherwise neutral type, and the hero is always a real code editor mock rather than abstract illustration. Typography carries the brand more than color does — IBM Plex Sans at 400 for body, 700 for headings, and iA Writer Mono for all code, giving every screen the feel of a well-typeset terminal. Components are flat and low-elevation, relying on hairline borders and a cool light-gray card surface (#f1f5f9) to separate layers; depth only appears in the code editor mock where a soft 20px shadow lifts the card off the page. Color is rationed like a developer's cursor: it only appears where state changes, where code is highlighted, or where a single word deserves emphasis — the rest of the UI stays monochrome and quiet.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Cyan Pulse | `#00bcff` | `--color-cyan-pulse` | Blue supporting accent for decorative details and low-frequency emphasis. Do not promote it to the primary CTA color |
| Voltage Cyan | `#53eafd` | `--color-voltage-cyan` | Announcement bar border, decorative code-editor highlights — brighter, more electric than Cyan Pulse, used for outline accents only |
| Plasma Violet | `#8e51ff` | `--color-plasma-violet` | Violet supporting accent for decorative details and low-frequency emphasis. |
| Signal Magenta | `#e12afb` | `--color-signal-magenta` | Hiring nav link, emphasis words inside testimonial bodies — a second accent reserved for editorial moments, not chrome |
| Halftone Blue | `#74d4ff` | `--color-halftone-blue` | Soft highlight wash behind cards and decorative code blocks — desaturated cyan used as a tint, never as text or border |
| Deep Teal | `#104e64` | `--color-deep-teal` | Blue supporting accent for decorative details and low-frequency emphasis. Do not promote it to the primary CTA color |
| Ember Pink | `#ed6aff` | `--color-ember-pink` | Inline code-editor decoration, soft illustration tint — decorative, not a state color |
| Alarm Red | `#ff2056` | `--color-alarm-red` | Red supporting accent for decorative details and low-frequency emphasis |
| Carbon | `#314158` | `--color-carbon` | Primary body text, icon strokes, heading default — the dominant dark neutral across the entire UI |
| Graphite | `#1d293d` | `--color-graphite` | Dark surface fill (testimonial cards, inverse blocks), strongest emphasis text |
| Slate | `#45556c` | `--color-slate` | Mid-tone text, secondary icon strokes, muted body copy |
| Iron | `#62748e` | `--color-iron` | Helper text, tertiary icon strokes, button label color in dark contexts |
| Fog | `#6a7282` | `--color-fog` | Button label on light surfaces, icon default, disabled-adjacent text |
| Ash | `#99a1af` | `--color-ash` | Captions, timestamps, lowest-priority metadata |
| Mist | `#cad5e2` | `--color-mist` | Hairline borders, input outlines, divider lines |
| Porcelain | `#e2e8f0` | `--color-porcelain` | Page canvas, default border color, subtle surface separation |
| Paper | `#f1f5f9` | `--color-paper` | Card surface, elevated panel, code editor body fill |
| Pure | `#ffffff` | `--color-pure` | Inset cards on light gray canvas, button text on cyan fill, modal surfaces |

## Tokens — Typography

### IBM Plex Sans — Primary interface and display typeface. Weight 400 carries body, button labels, nav, and helper text; weight 700 is reserved for headings, large numerics, and the single word inside a headline that needs to be brand-colored. The geometric-but-humanist Plex forms give the UI a terminal-instrument feel without the coldness of a pure grotesque. The 128px step is used for the oversized code-output flourish in the hero. · `--font-ibm-plex-sans`
- **Substitute:** Inter, system-ui
- **Weights:** 400, 700
- **Sizes:** 10, 12, 14, 16, 18, 24, 36, 48, 60, 128
- **Line height:** 1.0–1.6
- **Letter spacing:** -0.025em across body and display sizes, tightening as size grows; +0.1em tracked labels at 10–12px (uppercase eyebrows)
- **Role:** Primary interface and display typeface. Weight 400 carries body, button labels, nav, and helper text; weight 700 is reserved for headings, large numerics, and the single word inside a headline that needs to be brand-colored. The geometric-but-humanist Plex forms give the UI a terminal-instrument feel without the coldness of a pure grotesque. The 128px step is used for the oversized code-output flourish in the hero.

### iA Writer Mono — All code, file names, inline technical labels, the 'Hello!' output render, and monospaced UI affordances. Its slightly humanized monospace proportions pair cleanly with Plex Sans at the same sizes — they look like they were drawn for each other. Weight 700 is used for keywords inside the code editor mockup. · `--font-ia-writer-mono`
- **Substitute:** JetBrains Mono, IBM Plex Mono
- **Weights:** 400, 700
- **Sizes:** 14, 16, 20, 24, 60
- **Line height:** 1.0–1.5
- **Role:** All code, file names, inline technical labels, the 'Hello!' output render, and monospaced UI affordances. Its slightly humanized monospace proportions pair cleanly with Plex Sans at the same sizes — they look like they were drawn for each other. Weight 700 is used for keywords inside the code editor mockup.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 10px | 1.6 | 1px | `--text-caption` |
| body-sm | 14px | 1.43 | -0.35px | `--text-body-sm` |
| body | 16px | 1.5 | -0.4px | `--text-body` |
| subheading | 18px | 1.56 | -0.45px | `--text-subheading` |
| heading-sm | 24px | 1.33 | -0.6px | `--text-heading-sm` |
| heading | 36px | 1.25 | -0.9px | `--text-heading` |
| heading-lg | 48px | 1.14 | -1.2px | `--text-heading-lg` |
| display | 60px | 1.11 | -1.5px | `--text-display` |

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
| 48 | 48px | `--spacing-48` |
| 64 | 64px | `--spacing-64` |
| 96 | 96px | `--spacing-96` |
| 128 | 128px | `--spacing-128` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 12px |
| pills | 12px |
| badges | 4px |
| buttons | 8px |
| codeEditor | 12px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| xl | `rgba(0, 0, 0, 0.1) 0px 20px 25px -5px, rgba(0, 0, 0, 0.1)...` | `--shadow-xl` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 64-96px
- **Card padding:** 24-32px
- **Element gap:** 8-16px

## Components

### Primary CTA Button
**Role:** Hero and section-level conversion

Cyan Pulse #00bcff fill, white text, IBM Plex Sans 700 16px, 8px radius, 12px 24px padding, no border. Sits at the highest visual weight on the page — every screen has exactly one. Pairs with a Ghost Button as the secondary action.

### Ghost Button
**Role:** Secondary action beside the primary CTA

Transparent fill, 1px Carbon #314158 border, Carbon text, 8px radius, 12px 24px padding, IBM Plex Sans 700 16px. Mirrors the primary button's height and radius so the two feel like a matched pair.

### Auth Button — Sign Up
**Role:** Top-right account creation

1px Carbon border, Carbon text on white, 8px radius, smaller padding (~8px 16px), 700 weight. Less visually loud than the hero CTA so it doesn't compete.

### Auth Button — Log In
**Role:** Top-right account access

Plain text link in Carbon, no border, no fill. Lives to the left of Sign up with no visual weight.

### Announcement Bar
**Role:** Site-wide news strip below the nav

Full-width container with 1px #53eafd border, #cefafe interior fill, 16px vertical padding, 12px radius. Contains a date pill, body copy in Carbon, and a 'Read more →' inline link.

### Date Pill
**Role:** Leading element inside the announcement bar

White fill, Carbon text, IBM Plex Sans 700 10px, +0.1em tracking, 4px 8px padding, 4px radius. The only place the small-caps tracked treatment appears.

### Top Navigation
**Role:** Primary site navigation

White background, 64px tall, IBM Plex Sans 400 14px links in Carbon, with one link rendered in Signal Magenta #e12afb ('We're hiring!') to recruit attention. Logo wordmark left, links center-left, search icon + auth right.

### Hero Code Editor Card
**Role:** Hero visual — shows the product in action

12px radius, white fill, soft 20px shadow lifting it off canvas, header bar with 'main.tsx' label in iA Writer Mono and a 'Run' button (Carbon fill, white text, 4px radius). Code body uses iA Writer Mono 14px with syntax-color words (Plasma Violet for 'async function', Halftone Blue for strings, Signal Magenta for return). The 'Hello!' output card overlays the bottom-right with #1d293d fill, white IBM Plex Sans 700 60px text, 8px radius, 20px shadow.

### Template Card
**Role:** Use-case gallery tile in the 4-column grid

White fill, 1px #e2e8f0 border, 12px radius, 16px padding. Header is a 120px icon strip on #f1f5f9 with three brand-logos arranged horizontally. Title is IBM Plex Sans 700 16px Carbon; body is IBM Plex Sans 400 14px Slate #45556c.

### Logo Bar
**Role:** Social proof — 'Loved by engineers at'

Single horizontal row, grayscale brand wordmarks, ~40px tall, even spacing. No background change from canvas — the logos are the content.

### Testimonial Card
**Role:** Customer quote in 3-column grid

#1d293d dark fill, no border, 12px radius, 24-32px padding. Quote body in IBM Plex Sans 400 16px white with inline emphasis words colored Plasma Violet or Signal Magenta. Footer row: avatar + name (700 14px white) + role (400 12px Iron) on the left, company wordmark on the right. The only dark surface in the system.

### Pull Quote Block
**Role:** Featured large quote between sections

No container — text sits directly on canvas. A oversized Halftone Blue #74d4ff quotation mark glyph (60–80px) sits to the left, IBM Plex Sans 400 24px Carbon to the right with -0.6px tracking. Generous left/right margins.

### Search Icon Button
**Role:** Top-nav utility

Plain 16px Carbon icon, no border, no fill, 8px hit area. Text-less by design.

## Do's and Don'ts

### Do
- Use Cyan Pulse #00bcff for exactly one filled button per viewport — the primary action — and pair it with a Ghost Button as the secondary
- Set all body and display type in IBM Plex Sans 400 with letter-spacing -0.025em; tighten further as size grows
- Reserve Plasma Violet #8e51ff and Signal Magenta #e12afb for one word inside a headline or sentence, never for full elements
- Render all code, file names, and technical labels in iA Writer Mono; never set Plex Mono or a system mono as a substitute
- Layer surfaces as Canvas (#e2e8f0) → Paper (#ffffff) → Mist (#f1f5f9); use hairline #e2e8f0 borders rather than shadows to separate cards
- Place the only soft 20px shadow on the hero code-editor card; keep all other components flat
- Use 8px radius for buttons and auth controls, 12px for cards and the code editor, 4px for the small date pill

### Don't
- Do not introduce a second saturated CTA color; Cyan Pulse is the only filled action fill in the system
- Do not apply Plasma Violet or Signal Magenta to background fills, borders, or full sentences — they are word-level accents only
- Do not add drop shadows to template cards, testimonial cards, or logo bars; those surfaces stay flat
- Do not set body or display type in any font other than IBM Plex Sans, or substitute Plex Sans for the iA Writer Mono code block
- Do not use the 128px display size for headings outside the hero code-output flourish — it is reserved for that one moment
- Do not use Carbon #314158 for both text and dark surfaces; use Graphite #1d293d when you need a dark fill
- Do not add gradients to any surface — the system is flat by design, and the cyan/violet/magenta palette does the work that gradients usually do

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas | `#e2e8f0` | Page background, band separators between sections |
| 1 | Paper | `#ffffff` | Inset cards, hero code editor, primary content containers on the gray canvas |
| 2 | Mist | `#f1f5f9` | Sub-surface inside cards, icon tile backgrounds, secondary panel fill |
| 3 | Halftone | `#cefafe` | Cyan-tinted highlight wash behind decorative elements and code blocks |
| 4 | Inverse | `#1d293d` | Dark testimonial cards, inverse sections |

## Elevation

- **Code Editor Hero Card:** `0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)`
- **Announcement Bar:** `none — uses 1px #53eafd border instead of shadow`
- **Template Cards:** `none — flat on canvas, separated by 1px #e2e8f0 border`
- **Testimonial Cards:** `none — flat dark fill (#1d293d) on canvas`

## Imagery

Visuals are dominated by product UI rather than photography or illustration. The hero is a literal code editor mockup rendering the platform's output ('Hello!') — the product screenshot IS the hero image. Secondary visuals are flat brand-logo strips on a Mist-tinted tile inside template cards, and grayscale company wordmarks in the social-proof bar. Iconography is line-based and 1.5px stroke, monochrome Carbon, no fill variants. No photography, no 3D, no abstract gradients — the only illustrative moments are the syntax-color words inside the code editor, which function as decoration that doubles as documentation.

## Layout

Layout is max-width 1200px centered on a #e2e8f0 canvas, with white paper cards creating the primary content surface. The hero is a split composition: headline + subhead + dual-button cluster on the left (50%), floating code editor card on the right (50%) with intentional negative space. Below the hero, content flows in alternating 4-column card grids (templates), single-row logo bars (social proof), and 3-column dark-card grids (testimonials). Vertical rhythm is generous: 64-96px between major sections, 8-16px between elements within a card. Pull quotes break the grid with oversized quotation marks and centered single-column text. The navigation is a single horizontal bar — no sidebar, no mega-menu, no sticky secondary nav.

## Agent Prompt Guide

Quick Color Reference
- text: #314158 (Carbon)
- background: #e2e8f0 (Porcelain canvas) / #ffffff (Paper card)
- border: #e2e8f0 hairline / #53eafd (announcement accent)
- accent: #8e51ff (Plasma Violet) for headline word-emphasis
- primary action: no distinct CTA color

Example Component Prompts
No distinct primary action color was observed; use the extracted neutral button treatments instead of inventing a filled CTA color.

2. Create a template card: white fill, 1px #e2e8f0 border, 12px radius, 16px padding. Top half is a 120px-tall #f1f5f9 icon strip holding three 24px brand logos. Title is IBM Plex Sans 700 16px #314158, body is IBM Plex Sans 400 14px #45556c.

3. Create a testimonial card: #1d293d fill, 12px radius, 24px padding, no border, no shadow. Quote body in IBM Plex Sans 400 16px white with one emphasis word in #8e51ff. Footer: 32px avatar + IBM Plex Sans 700 14px white name + 400 12px #62748e role, company wordmark right-aligned.

4. Create an announcement bar: full-width, 1px #53eafd border, #cefafe fill, 12px radius, 16px vertical padding. Leading 4px-radius white date pill (IBM Plex Sans 700 10px #314158, +0.1em tracking), body copy in IBM Plex Sans 400 14px #314158, trailing 'Read more →' inline link.

5. Create a pull quote: no container, sits on canvas. A 60px #74d4ff quotation glyph on the left, IBM Plex Sans 400 24px #314158 quote text on the right with -0.6px tracking, single column, generous left margin.

## Color Rationing

Color is rationed like developer attention. The page is 95% achromatic; chromatic pixels appear only at three levels of priority. Tier 1 (Cyan Pulse #00bcff): exactly one filled button per viewport. Tier 2 (Plasma Violet #8e51ff, Signal Magenta #e12afb): one word inside a headline or sentence — these are emphasis, not chrome. Tier 3 (Voltage Cyan #53eafd, Halftone Blue #74d4ff, Deep Teal #104e64): syntax-style decoration inside code blocks and the announcement bar. Never use a chromatic color as a full surface fill, a border, or a long block of text — if you need a colored region, the dark testimonial card (#1d293d) is the only place a surface is allowed to step away from grayscale.

## Similar Brands

- **Replit** — Same light-canvas, code-editor-as-hero layout, and developer-tool warmth; Replit leans slightly more orange, Val Town stays in cyan-violet-magenta accent territory
- **Vercel** — Similar restrained achromatic base with a single vivid accent color and IBM Plex-style sans typography; both use flat cards on a near-white canvas
- **Plausible Analytics** — Identical surface stack (gray canvas, white cards, hairline borders, generous 64-96px section gaps) and a single saturated action color used sparingly
- **Railway** — Same dark-card testimonial pattern, code-first hero, and 8-12px component radii; both feel like an IDE rendered as a marketing site

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-cyan-pulse: #00bcff;
  --color-voltage-cyan: #53eafd;
  --color-plasma-violet: #8e51ff;
  --color-signal-magenta: #e12afb;
  --color-halftone-blue: #74d4ff;
  --color-deep-teal: #104e64;
  --color-ember-pink: #ed6aff;
  --color-alarm-red: #ff2056;
  --color-carbon: #314158;
  --color-graphite: #1d293d;
  --color-slate: #45556c;
  --color-iron: #62748e;
  --color-fog: #6a7282;
  --color-ash: #99a1af;
  --color-mist: #cad5e2;
  --color-porcelain: #e2e8f0;
  --color-paper: #f1f5f9;
  --color-pure: #ffffff;

  /* Typography — Font Families */
  --font-ibm-plex-sans: 'IBM Plex Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-ia-writer-mono: 'iA Writer Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.6;
  --tracking-caption: 1px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.43;
  --tracking-body-sm: -0.35px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.4px;
  --text-subheading: 18px;
  --leading-subheading: 1.56;
  --tracking-subheading: -0.45px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.33;
  --tracking-heading-sm: -0.6px;
  --text-heading: 36px;
  --leading-heading: 1.25;
  --tracking-heading: -0.9px;
  --text-heading-lg: 48px;
  --leading-heading-lg: 1.14;
  --tracking-heading-lg: -1.2px;
  --text-display: 60px;
  --leading-display: 1.11;
  --tracking-display: -1.5px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-unit: 8px;
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-96: 96px;
  --spacing-128: 128px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 64-96px;
  --card-padding: 24-32px;
  --element-gap: 8-16px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;

  /* Named Radii */
  --radius-cards: 12px;
  --radius-pills: 12px;
  --radius-badges: 4px;
  --radius-buttons: 8px;
  --radius-codeeditor: 12px;

  /* Shadows */
  --shadow-xl: rgba(0, 0, 0, 0.1) 0px 20px 25px -5px, rgba(0, 0, 0, 0.1) 0px 8px 10px -6px;

  /* Surfaces */
  --surface-canvas: #e2e8f0;
  --surface-paper: #ffffff;
  --surface-mist: #f1f5f9;
  --surface-halftone: #cefafe;
  --surface-inverse: #1d293d;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-cyan-pulse: #00bcff;
  --color-voltage-cyan: #53eafd;
  --color-plasma-violet: #8e51ff;
  --color-signal-magenta: #e12afb;
  --color-halftone-blue: #74d4ff;
  --color-deep-teal: #104e64;
  --color-ember-pink: #ed6aff;
  --color-alarm-red: #ff2056;
  --color-carbon: #314158;
  --color-graphite: #1d293d;
  --color-slate: #45556c;
  --color-iron: #62748e;
  --color-fog: #6a7282;
  --color-ash: #99a1af;
  --color-mist: #cad5e2;
  --color-porcelain: #e2e8f0;
  --color-paper: #f1f5f9;
  --color-pure: #ffffff;

  /* Typography */
  --font-ibm-plex-sans: 'IBM Plex Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-ia-writer-mono: 'iA Writer Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.6;
  --tracking-caption: 1px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.43;
  --tracking-body-sm: -0.35px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.4px;
  --text-subheading: 18px;
  --leading-subheading: 1.56;
  --tracking-subheading: -0.45px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.33;
  --tracking-heading-sm: -0.6px;
  --text-heading: 36px;
  --leading-heading: 1.25;
  --tracking-heading: -0.9px;
  --text-heading-lg: 48px;
  --leading-heading-lg: 1.14;
  --tracking-heading-lg: -1.2px;
  --text-display: 60px;
  --leading-display: 1.11;
  --tracking-display: -1.5px;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-96: 96px;
  --spacing-128: 128px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;

  /* Shadows */
  --shadow-xl: rgba(0, 0, 0, 0.1) 0px 20px 25px -5px, rgba(0, 0, 0, 0.1) 0px 8px 10px -6px;
}
```
