# Tableland — Style Reference
> alpine dusk at the terminal — soft coral peaks rising over a deep green-black void with one mint-green signal light glowing on the horizon.

**Theme:** dark

Tableland operates as a dark-mode developer surface punctuated by a single painted moment: a lavender-coral hero landscape that gives way to a calm, infrastructure-feeling interior. Typography is geometric humanist (Poppins) with weight 300 doing the heavy lifting on display copy, giving headlines a quiet, engineered feel rather than a marketing punch. A muted teal (#75b6b5) carries all interactive voice — nav, icons, links, learn-more affordances — while a single vivid mint green (#0be291) is reserved exclusively for emphasized headings, creating a clear hierarchy where teal navigates and green signals the primary read. Surfaces are layered in near-black steps (page → card → elevated), with cards and buttons rounded modestly (8–16px) and never pill-shaped except for tags and icon containers. The visual signature is the contrast between the soft painterly hero and the hard-edged terminal aesthetic below it — a database that feels both approachable and uncompromising.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Abyss Teal | `#75b6b5` | `--color-abyss-teal` | Teal text accent for links, tags, and emphasized short phrases. Do not promote it to the primary CTA color |
| Mint Beacon | `#0be291` | `--color-mint-beacon` | Green text accent for links, tags, and emphasized short phrases. Do not promote it to the primary CTA color |
| Coral Ember | `#f4706b` | `--color-coral-ember` | Decorative icon accent — used sparingly in nav icons and the hero illustration's mountain highlights. Warm counterpoint to the cool teal/mint palette |
| Lavender Mist | `#e4cbf2` | `--color-lavender-mist` | Hero atmosphere — the soft lavender backdrop of the hero section and mountain illustration sky. Only used in the hero band; never in component surfaces or UI chrome |
| Void | `#101e1e` | `--color-void` | Page canvas and primary action background — the base layer of the dark theme and the fill of filled CTA buttons (Enter Studio, Discord). Slightly green-tinted black rather than pure neutral |
| Carbon | `#1a1a1a` | `--color-carbon` | Deep surface — code block backgrounds, terminal interiors, darkest elevated layers. One step below void for maximum contrast terminal aesthetic |
| Slate | `#162929` | `--color-slate` | Mid surface and hairline borders — card backgrounds, button borders, dividers. Bridges between void and the lighter elevated steps |
| Graphite | `#3b4949` | `--color-graphite` | Elevated card surface and hover-state fills — the topmost card tier, used for testimonial cards and hover backgrounds |
| Fog | `#718b8b` | `--color-fog` | Muted text and inactive nav icons — body helper text, inactive nav glyphs, secondary metadata. The de-emphasized reading layer |
| Ash | `#e5e7eb` | `--color-ash` | Hairline borders and dividers — the universal 1px border color used across nav, cards, icons, and structural separators. Primary border token |
| Paper | `#ffffff` | `--color-paper` | Primary text and icon fill — all high-emphasis body copy, headings, and filled icon shapes. The top of the text contrast scale |

## Tokens — Typography

### Poppins — All UI and display copy. Weight 300 dominates display and hero headings, creating an unusually quiet headline voice — the database speaks softly. Weight 400 for body and nav, 500 for button labels and emphasized metadata, 700 reserved for rare structural emphasis. · `--font-poppins`
- **Substitute:** Nunito Sans or DM Sans as system-friendly alternatives; for the same light-weight display feel, Manrope (300) is the closest match.
- **Weights:** 300, 400, 500, 700
- **Sizes:** 12, 14, 16, 18, 22, 24, 30, 48
- **Line height:** 1.00–1.78
- **Letter spacing:** normal at all sizes; no tightening observed on large display
- **Role:** All UI and display copy. Weight 300 dominates display and hero headings, creating an unusually quiet headline voice — the database speaks softly. Weight 400 for body and nav, 500 for button labels and emphasized metadata, 700 reserved for rare structural emphasis.

### monospace — Code snippets, terminal output, SQL examples, and inline technical tokens. System monospace at a single small size — functional, not decorative. · `--font-monospace`
- **Substitute:** JetBrains Mono, IBM Plex Mono, or Fira Code
- **Weights:** 300
- **Sizes:** 12px
- **Line height:** 1.33
- **Role:** Code snippets, terminal output, SQL examples, and inline technical tokens. System monospace at a single small size — functional, not decorative.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.33 | — | `--text-caption` |
| body-sm | 14px | 1.45 | — | `--text-body-sm` |
| body | 16px | 1.56 | — | `--text-body` |
| subheading | 18px | 1.5 | — | `--text-subheading` |
| heading-sm | 22px | 1.43 | — | `--text-heading-sm` |
| heading | 24px | 1.33 | — | `--text-heading` |
| heading-lg | 30px | 1.2 | — | `--text-heading-lg` |
| display | 48px | 1 | — | `--text-display` |

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
| 80 | 80px | `--spacing-80` |
| 128 | 128px | `--spacing-128` |
| 144 | 144px | `--spacing-144` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 9999px |
| cards | 8px |
| buttons | 4px |
| code-blocks | 4px |
| elevated-cards | 16px |
| icon-containers | 9999px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 128px
- **Card padding:** 24px
- **Element gap:** 16px

## Components

### Primary CTA Button (filled)
**Role:** Main conversion action — 'Enter Studio', 'Discord'

Filled dark button on dark surface: #101e1 background, #ffffff text, 4px radius, 12px vertical × 24px horizontal padding. Poppins 500 at 14px. Arrow glyph (→) follows label, rendered in the same white. No border. Hover lifts to #1a1a1a or adds subtle 1px #e5e7eb outline.

### Ghost Nav Button
**Role:** Secondary action in nav bar — 'Enter Studio' in header

Outlined button: transparent or #101e1 background, 1px #e5e7eb border, #ffffff text, 9999px radius (pill). Poppins 500 at 14px. 8px vertical × 20px horizontal padding. Inverts on hover (background becomes #e5e7eb, text becomes #101e1e).

### Nav Link
**Role:** Primary navigation — GitHub, Docs, Blog, Rigs

Text-only nav item, no underline. Poppins 400 at 14px, #75b6b5 (teal). 8px vertical padding. Hover: opacity 0.7 or shifts to #0be291. No background, no border.

### Code Terminal Block
**Role:** SQL example, command preview, developer-facing syntax

Dark terminal panel: #1a1a1a background, 4px radius, 1px #162929 border. Monospace 12px text, #ffffff on dark. 24px internal padding. Optional top bar with traffic-light dots (#f4706b, #0be291, #75b6b5). The terminal is always full-width within its container.

### Feature Card
**Role:** Product feature blocks — SQLite, On-chain security, Portable, Multi-chain, Pricing

Flat dark card with no background fill (sits directly on #101e1 canvas). Icon container is 32px circle with 1px #75b6b5 border, icon stroke in #75b6b5 or #0be291. Heading Poppins 500 at 18px, #ffffff. Body Poppins 400 at 14px, #718b8b. 'Learn more' link in #75b6b5 with underline. No card border or background — the negative space IS the card.

### Testimonial Card
**Role:** Community quotes — Twitter-style cards in 'Join the community' section

Elevated card: #3b4949 background, 1px #e5e7eb border, 16px radius, 24px padding. Avatar 32px rounded square with 1px #e5e7eb border, placed top-left. Display name Poppins 500 at 14px #ffffff beside @handle in #718b8b. Quote body Poppins 400 at 14px #ffffff with natural line wrapping. Cards may overflow horizontally with peek effect on the section edges.

### Section Heading (mint)
**Role:** Emphasized section titles — 'Join the community', key feature headers

Poppins 300 at 30px, #0be291. Centered alignment. The mint green is the only chromatic heading color; it signals the most important reading on the page. No underline, no decoration.

### Section Heading (white)
**Role:** Standard section titles — 'Build on decentralized data without the headache'

Poppins 300 at 30px, #ffffff. Centered. The default heading voice — quiet, engineered, not marketing-loud.

### Display Headline
**Role:** Hero headline — 'The decentralized cloud database.'

Poppins 300 at 48px, line-height 1.0, #1a1a1a on the lavender hero. The word 'decentralized' is bolded (weight 700) in the same color for contrast within the whisper-weight line. Small eyebrow label above in Poppins 500 at 12px uppercase #718b8b with 'ANYWHERE' bolded in #1a1a1a.

### Body Paragraph
**Role:** Standard explanatory copy

Poppins 400 at 16px, line-height 1.56, #ffffff. Max-width ~640px for readable line length. No drop cap, no first-line indent.

### Helper / Metadata Text
**Role:** Captions, timestamps, secondary metadata

Poppins 400 at 12px, #718b8b. Used for @handles, section subtitles, footnotes, and de-emphasized metadata.

### Icon Container (circular)
**Role:** Wrapping small feature/inline icons

32px–40px circle, 1px #75b6b5 or #e5e7eb border, transparent or #101e1 fill. Icon inside is 1.5px stroke, #75b6b5 or matching border color. Used for feature card headers and inline section markers.

### Hero Landscape Illustration
**Role:** Brand identity artwork — the mountain peaks in the hero

Illustrated mountain ridge in #f4706b (coral) with darker shadow planes, sitting on a soft #e4cbf2 to #f5d4e8 gradient sky. Flat illustration style, no outlines, geometric facets. Anchored to the right side of the hero, bleeding off the right edge. The illustration is the brand signature — no other decorative graphics are used in the dark interior.

## Do's and Don'ts

### Do
- Use Poppins 300 for all display and section headings — the whisper-weight is the signature voice
- Reserve #0be291 (mint) exclusively for emphasized section headings; never apply it to body, links, or backgrounds
- Use #75b6b5 (teal) for all interactive voice — nav links, icon strokes, learn-more affordances
- Layer surfaces using the four-step scale: #101e1 (page) → #162929 (mid) → #3b4949 (elevated card) → #1a1a1a (terminal)
- Use 4px radius for buttons and code blocks, 8px for content cards, 16px for elevated testimonial cards, 9999px only for tags and icon containers
- Center-align section headings and give each section at least 128px vertical breathing room
- Keep the lavender hero as the single painted moment — do not introduce gradients or illustrations into the dark interior

### Don't
- Do not use weight 600+ on display headings — the light-weight restraint IS the brand voice
- Do not apply #0be291 to links, icons, or backgrounds — it loses hierarchy when scattered
- Do not use pill radius (9999px) on buttons or cards — pills are reserved for tags and icon containers only
- Do not introduce shadows or elevation effects — the design relies on surface color steps, not depth
- Do not use pure black (#000000) — all darks are slightly green-tinted (#101e1, #1a1a1a, #162929)
- Do not add accent colors beyond the existing four (teal, mint, coral, lavender) — the palette is intentionally narrow
- Do not use more than one chromatic color per UI region — teal for interaction, mint for emphasis, coral only in the hero illustration

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas | `#101e1` | Page background — the base dark layer across all interior sections |
| 1 | Mid Surface | `#162929` | Subtle card backgrounds and structural borders — bridges void and elevated |
| 2 | Elevated Card | `#3b4949` | Testimonial and elevated content cards |
| 3 | Terminal | `#1a1a1a` | Code blocks and deepest UI elements — the darkest tier for maximum contrast |

## Elevation

The design uses no shadows or blur effects. Depth is communicated entirely through a four-step surface color scale (#101e1 → #162929 → #3b4949 → #1a1a1a) and 1px #e5e7eb hairline borders. This flat, hard-edged approach reinforces the infrastructure/database identity — nothing floats, everything sits precisely on a surface.

## Imagery

The site has exactly one illustrative element: a painted mountain landscape in the hero section, rendered in flat geometric facets of coral (#f4706b) with soft gradient sky (#e4cbf2 to #f5d4e8). No photography, no 3D renders, no decorative graphics anywhere in the dark interior. Icons throughout are simple line-drawn strokes in 1.5px weight, using teal (#75b6b5) as the standard color. The visual language is deliberately sparse: the hero illustration is the only emotional moment, and the rest of the page communicates through type, surface color, and code. This restraint signals developer credibility — the product is the content, not the decoration.

## Layout

Page is max-width 1200px centered with generous horizontal padding (80px on desktop). The hero is split-layout: left column holds eyebrow label, display headline, body copy, and CTA; right column is dominated by the mountain illustration bleeding off the right edge. Below the hero, the page alternates into full-width dark bands with centered headings and either 2-column or 4-column content grids. The 'Build on decentralized data' section uses a 4-column equal grid for feature cards (SQLite, On-chain security, Portable, Multi-chain), then drops to a single-column full-width block for Pricing. The 'Join the community' section breaks the grid with a horizontally scrolling testimonial card carousel that peeks cards at the edges. Section gaps are 128px, giving each dark band room to breathe. Navigation is a minimal top bar: logo left, 4 text links plus 1 ghost pill button right, 64px height, 1px bottom border in #e5e7eb.

## Agent Prompt Guide

Quick Color Reference:
- text: #ffffff (primary), #718b8b (muted)
- background: #101e1e (canvas), #3b4949 (elevated card), #1a1a1a (terminal)
- border: #e5e7eb (hairline), #162929 (structural)
- accent: #75b6b5 (teal — interactive voice), #0be291 (mint — heading emphasis only)
- primary action: #101e1e (filled action)

3-5 Example Component Prompts:

1. Hero section: lavender (#e4cbf2) background, split layout. Left column: eyebrow 'READ+WRITE FROM ANYWHERE' at Poppins 500 12px uppercase #718b8b (with 'ANYWHERE' bold in #1a1a1a). Headline 'The decentralized cloud database.' at Poppins 300 48px #1a1a1a, line-height 1.0, with 'decentralized' at weight 700. Body 16px Poppins 400 #1a1a1a. Primary button: #101e1e fill, white text, 4px radius, 12px 24px padding, Poppins 500 14px, with → arrow. Right column: coral (#f4706b) geometric mountain illustration bleeding off right edge.

2. Feature card row: 4-column grid on #101e1e canvas, 40px column gap. Each card has no background fill. Icon container: 32px circle, 1px #75b6b5 border, teal icon stroke inside. Heading Poppins 500 18px #ffffff. Body Poppins 400 14px #718b8b. 'Learn more' link in #75b6b5 with underline, Poppins 400 14px.

3. Testimonial card carousel: section background #101e1e, section heading 'Join the community' at Poppins 300 30px #0be291 centered. Cards: #3b4949 background, 1px #e5e7eb border, 16px radius, 24px padding. Avatar 32px square with 1px #e5e7eb border. Display name Poppins 500 14px #ffffff, @handle in #718b8b. Quote Poppins 400 14px #ffffff. Cards overflow horizontally with edge peek effect.

4. Code terminal block: #1a1a1a background, 4px radius, 1px #162929 border, 24px padding. Monospace 12px white text on dark. Top bar optional with three 8px circles: #f4706b, #0be291, #75b6b5. Full-width within its parent container.

5. Ghost nav button: transparent background, 1px #e5e7eb border, 9999px pill radius, #ffffff text Poppins 500 14px, 8px 20px padding. Inverts on hover to #e5e7eb fill with #101e1e text.

## Similar Brands

- **The Graph** — Same dark-mode developer infrastructure aesthetic with a single hero illustration and quiet, weight-300 display headlines
- **Filecoin** — Dark canvas with an illustrated landscape hero, mint-green accent for emphasized headings, and terminal-style code blocks
- **Ceramic Network** — Near-black surface stack with a four-step elevation scale, teal interactive voice, and flat geometric illustration in the hero
- **IPFS** — Developer-facing dark surface with a single brand-color moment in the hero, monospace code examples, and whisper-light Poppins-style headlines

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-abyss-teal: #75b6b5;
  --color-mint-beacon: #0be291;
  --color-coral-ember: #f4706b;
  --color-lavender-mist: #e4cbf2;
  --color-void: #101e1e;
  --color-carbon: #1a1a1a;
  --color-slate: #162929;
  --color-graphite: #3b4949;
  --color-fog: #718b8b;
  --color-ash: #e5e7eb;
  --color-paper: #ffffff;

  /* Typography — Font Families */
  --font-poppins: 'Poppins', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-monospace: 'monospace', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.33;
  --text-body-sm: 14px;
  --leading-body-sm: 1.45;
  --text-body: 16px;
  --leading-body: 1.56;
  --text-subheading: 18px;
  --leading-subheading: 1.5;
  --text-heading-sm: 22px;
  --leading-heading-sm: 1.43;
  --text-heading: 24px;
  --leading-heading: 1.33;
  --text-heading-lg: 30px;
  --leading-heading-lg: 1.2;
  --text-display: 48px;
  --leading-display: 1;

  /* Typography — Weights */
  --font-weight-light: 300;
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-unit: 8px;
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-80: 80px;
  --spacing-128: 128px;
  --spacing-144: 144px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 128px;
  --card-padding: 24px;
  --element-gap: 16px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-full: 9999px;

  /* Named Radii */
  --radius-tags: 9999px;
  --radius-cards: 8px;
  --radius-buttons: 4px;
  --radius-code-blocks: 4px;
  --radius-elevated-cards: 16px;
  --radius-icon-containers: 9999px;

  /* Surfaces */
  --surface-canvas: #101e1;
  --surface-mid-surface: #162929;
  --surface-elevated-card: #3b4949;
  --surface-terminal: #1a1a1a;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-abyss-teal: #75b6b5;
  --color-mint-beacon: #0be291;
  --color-coral-ember: #f4706b;
  --color-lavender-mist: #e4cbf2;
  --color-void: #101e1e;
  --color-carbon: #1a1a1a;
  --color-slate: #162929;
  --color-graphite: #3b4949;
  --color-fog: #718b8b;
  --color-ash: #e5e7eb;
  --color-paper: #ffffff;

  /* Typography */
  --font-poppins: 'Poppins', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-monospace: 'monospace', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.33;
  --text-body-sm: 14px;
  --leading-body-sm: 1.45;
  --text-body: 16px;
  --leading-body: 1.56;
  --text-subheading: 18px;
  --leading-subheading: 1.5;
  --text-heading-sm: 22px;
  --leading-heading-sm: 1.43;
  --text-heading: 24px;
  --leading-heading: 1.33;
  --text-heading-lg: 30px;
  --leading-heading-lg: 1.2;
  --text-display: 48px;
  --leading-display: 1;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-80: 80px;
  --spacing-128: 128px;
  --spacing-144: 144px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-full: 9999px;
}
```
