# School — Style Reference
> personal desktop for creative souls

**Theme:** light

School treats its portfolio as a personal desktop: a light gray canvas (#dbdbdb) tiled with generously rounded white cards, each labeled with a tiny monospace caption in parentheses like (Y)our profile. or (Y)our weather. The entire interface speaks in IBM Plex Mono — body, headings, labels, buttons, timestamps — giving every surface the texture of a terminal session or a developer's scratchpad. Color is almost entirely suppressed: the palette is 99% achromatic, with the only warmth coming from a soft tan (#e2ceb8) and a cool blue-gray (#6a728e) used as background washes, and occasional yellow highlight blocks behind individual letters. There is no hero, no marketing band, no gradient — the grid IS the experience, and each card behaves like a widget on a calm, slightly retro operating system.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Charcoal Ink | `#303030` | `--color-charcoal-ink` | Primary text, headings, body copy, icons, link color, input borders, badges — the single dominant ink that holds the whole monochrome system together |
| Paper White | `#ffffff` | `--color-paper-white` | Card surfaces, input fields, elevated panels, text on dark fills |
| Concrete Gray | `#dbdbdb` | `--color-concrete-gray` | Page canvas, the visible background behind every card — the tone that makes white cards feel floating rather than embedded |
| Fog Mist | `#f2f2f2` | `--color-fog-mist` | Subtle elevated surfaces, secondary panels, input hover states — a step between canvas and card |
| Ash Border | `#ededed` | `--color-ash-border` | Hairline borders, input backgrounds, disabled-state fills |
| Smoke | `#c2c2c2` | `--color-smoke` | Muted text, disabled labels, badge backgrounds, inactive states |
| Graphite | `#808080` | `--color-graphite` | Secondary text, meta information, shadow tone, muted border accents |
| Pure Black | `#000000` | `--color-pure-black` | Icon fills, maximum-contrast accents, deep text on light surfaces |
| Sand Wash | `#e2ceb8` | `--color-sand-wash` | Warm background tint on select cards and sections — the only warm chromatic wash in the system, used sparingly to break the cool gray monotony |
| Slate Veil | `#6a728e` | `--color-slate-veil` | Gray supporting accent for decorative details and low-frequency emphasis. |
| Highlight Yellow | `#f9f5a2` | `--color-highlight-yellow` | Text-block highlight behind individual letters or words (the (y)our treatment) — the only vivid functional accent, used to mark a single altered character in an otherwise unstyled sentence |
| Highlight Cyan | `#c7f6ff` | `--color-highlight-cyan` | Secondary text highlight block, paired with yellow for selectable/emphasized letter swaps |

## Tokens — Typography

### IBM Plex Mono — Universal interface font — used for every body paragraph, every label, every button, every timestamp, every card caption, and at 43px for the largest display headlines. The single-font decision is the system's most defining choice: a monospace voice applied to a creative studio site signals that this is a tool, not a magazine. The 43px display size at weight 400 is deliberately unflamboyant — no bold headline shouting, just evenly-spaced characters that read like code commits or terminal output. · `--font-ibm-plex-mono`
- **Substitute:** JetBrains Mono, Fira Code, or system monospace stack (ui-monospace, SFMono-Regular)
- **Weights:** 400
- **Sizes:** 11px, 14px, 16px, 18px, 25px, 43px
- **Line height:** 1.40
- **Letter spacing:** normal
- **OpenType features:** `"liga" 0, "calt" 0`
- **Role:** Universal interface font — used for every body paragraph, every label, every button, every timestamp, every card caption, and at 43px for the largest display headlines. The single-font decision is the system's most defining choice: a monospace voice applied to a creative studio site signals that this is a tool, not a magazine. The 43px display size at weight 400 is deliberately unflamboyant — no bold headline shouting, just evenly-spaced characters that read like code commits or terminal output.

### Helvetica — Secondary display font for occasional headline-level text where a humanist sans contrast is needed against the mono sea. Weight 300 is used for the largest 44px treatment to keep the system's anti-authoritarian restraint — no bold display shouting, just light Helvetica whispers · `--font-helvetica`
- **Substitute:** Inter, Helvetica Neue, Arial, system-ui
- **Weights:** 300, 400, 700
- **Sizes:** 11px, 18px, 44px
- **Line height:** 1.40
- **Letter spacing:** normal
- **Role:** Secondary display font for occasional headline-level text where a humanist sans contrast is needed against the mono sea. Weight 300 is used for the largest 44px treatment to keep the system's anti-authoritarian restraint — no bold display shouting, just light Helvetica whispers

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 11px | 1.4 | — | `--text-caption` |
| body-sm | 14px | 1.4 | — | `--text-body-sm` |
| body | 16px | 1.4 | — | `--text-body` |
| subheading | 18px | 1.4 | — | `--text-subheading` |
| heading-sm | 25px | 1.4 | — | `--text-heading-sm` |
| heading | 43px | 1.4 | — | `--text-heading` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** compact

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 8 | 8px | `--spacing-8` |
| 12 | 12px | `--spacing-12` |
| 20 | 20px | `--spacing-20` |
| 24 | 24px | `--spacing-24` |
| 28 | 28px | `--spacing-28` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 20px |
| badges | 20px |
| images | 10px |
| inputs | 25px |
| buttons | 20px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| sm | `rgba(0, 0, 0, 0.16) 0px 3px 6px 0px` | `--shadow-sm` |
| sm-2 | `rgba(0, 0, 0, 0.18) 0px 1px 4px 0px` | `--shadow-sm-2` |

### Layout

- **Page max-width:** 1440px
- **Section gap:** 24px
- **Card padding:** 18-24px
- **Element gap:** 8px

## Components

### Widget Card
**Role:** Primary container for every piece of content on the page

White (#ffffff) rounded rectangle on the #dbdbdb canvas, 20px border-radius, internal padding 18-24px, subtle drop shadow rgba(0,0,0,0.16) 0px 3px 6px. Every card opens with a tiny monospace caption in parentheses centered above its content (e.g. (Y)our profile., (Y)our weather.). No visible border — the shadow and the white-on-gray contrast define the edge.

### Parenthetical Caption
**Role:** Widget identifier / mini-label

IBM Plex Mono 11px weight 400 in #303030, centered, preceded by parentheses, often with a parenthesized Y replacing the first letter to mark a customizable element. This caption is the system's voice — clinical, specific, slightly self-aware.

### Highlighted Letter
**Role:** Emphasized character within a word

A single character (usually the 'y' in words like 'your') wrapped in a #f9f5a2 or #c7f6ff rectangular block at 0 offset. Text size matches the surrounding line, no extra padding, just a flat color rectangle behind the glyph. Used sparingly to mark the variable/replaceable letter.

### Round Avatar Tile
**Role:** User profile picture / 3D character display

Circular container centered within a card, no border, displays a 3D-rendered character or photo. Sits above the name input field. The avatar occupies roughly 40% of the card's height.

### Name Input Field
**Role:** Text entry for the user name

Full-width rounded input, 25px border-radius, #ededed background, #303030 text, IBM Plex Mono 16px. Placeholder reads 'Input your own name.' in a lighter weight. No visible border — the background color difference is the only boundary.

### Color Swatch Button
**Role:** Selectable color option row

Small circular swatches (approx 20px diameter) arranged in a horizontal row with 8px gap, sitting below the character customization options. Each swatch is a solid fill — pastel orange, light blue, pink, lime green, lavender, brown, yellow, white, etc. No labels, no borders, just filled circles.

### Pill Button
**Role:** Default button for time display, click actions, and inline controls

Rounded pill shape with 20-25px radius, white or #f2f2f2 background, IBM Plex Mono text in #303030, padding 8px 24px. No border, no shadow, no fill color. Examples include the 'Click' button under the digital clock and the 'VERIFY' button in the image selector.

### Verify Button (Solid)
**Role:** Primary action button for the image selection widget

The only solid-fill button in the system: #ffffff background, #303030 text, 20px radius, 8px 24px padding, IBM Plex Mono 14px uppercase 'VERIFY'. Functions as a neutral action — no brand color, no fill tint, just white-on-white differentiated only by its slightly raised surface treatment.

### Weather Tile
**Role:** Mini weather widget

Card variant with #6a728 (slate veil) background fill instead of white. Contains a sun graphic and text reading '50°F & Clear (NYC)' in #303030. The cool-tinted card is the system's way of giving a widget a distinct atmosphere without using a chromatic brand color.

### Digital Clock Display
**Role:** Time readout widget

Oversized IBM Plex Mono 43px weight 400 numerals in #303030, reading '03:15:28', centered in a white card. A pill button labeled 'Click' sits below. The large monospace numerals are the closest thing to a display headline the system has — they read like a terminal, not a marketing hero.

### Image Grid (Selection)
**Role:** Image picker with selectable thumbnails

2x4 or 3x4 grid of square image thumbnails with 2-4px gap between cells. Selected cells get a subtle highlight border. Caption above reads instructions in a blue (#6a728e) filled sub-card with white text.

### Featured Project Tile
**Role:** Large image-led project card

Card variant dominated by a single photograph (e.g. Zadig & Voltaire aerial shot), 10px image radius, 2-3 small pill-shaped tag buttons ('Campaign', 'Production', 'Design') overlapping the image's bottom edge. Caption '(Y)our featured project.' sits above.

### Pixel Drawing Canvas
**Role:** Free-form pixel art / drawing tool

Large square card with a grid-based drawing area showing pixel-art-style output. A vertical color palette strip runs along the right edge (yellow, green, red, black, etc.). This widget reveals the system is interactive, not just presentational.

### News Headline Card
**Role:** Editorial / blog content card

Card with a colorful editorial image (collage/illustration) and bold black headline below in IBM Plex Mono 25px weight 400: 'HOW SCHOOL INJECTS HUMANITY INTO DIGITAL SPACES'. A 'Featured News' label badge in the corner. Tag pills below the headline.

### Video Embed Tile
**Role:** Embedded media with caption overlay

Full-bleed image or video frame (Wheatfield - A Confrontation by Agnes Denes, 1982) with white caption text overlaid at bottom-left, IBM Plex Mono 14px, with a small circular avatar beside the 'last edited by' attribution.

### Top Navigation Bar
**Role:** Minimal persistent header

Fixed top bar on #dbdbdb background. Left side: a 'Selected work' toggle pill with a count badge. Right side: a row of small circular avatar thumbnails (5 visible) representing team members or contacts. No logo, no menu, no links — just a status pill and a people row.

### Footer Tag Row
**Role:** Email and contact pills

Two pill-shaped buttons (20px radius, #f2f2f2 fill, IBM Plex Mono 14px) reading email addresses: 'itschoolooooooooool' and 'info@school.com'. No icons, no social links, just monospace contact strings treated as content.

## Do's and Don'ts

### Do
- Use IBM Plex Mono (or a close monospace substitute) for every text element including buttons, labels, captions, and inputs — mono is the system's defining voice
- Give every widget card a parenthetical caption in IBM Plex Mono 11px centered above its content
- Set all card and button radii between 20-25px to maintain the soft, pebble-like silhouette
- Use #dbdbdb as the page canvas and #ffffff for cards; let the contrast and a single 0 3px 6px shadow define card edges without borders
- Use #303030 for all text — never introduce a secondary text color other than #808080 for meta information
- Apply the highlighted-letter treatment (a flat #f9f5a2 or #c7f6ff block behind a single character) to mark a customized or emphasized glyph within an otherwise normal word
- Keep card padding between 18-24px and use 8px gaps as the default element spacing

### Don't
- Do not introduce a brand color, gradient, or saturated accent — the system is 99% achromatic and any chromatic addition will break the desktop neutrality
- Do not use a serif or humanist sans as the primary body font — the mono voice is non-negotiable
- Do not use bold or weight 700 for headlines; the system's restraint comes from weight 300-400 at large sizes
- Do not use sharp corners or radii under 10px — the soft 20-25px rounding is the tactile signature
- Do not place cards directly on white — the #dbdbdb canvas is required for cards to read as floating objects
- Do not use icons with thick strokes or filled glyphs; icons should be thin, monoline, or single characters in the monospace flow
- Do not add borders to cards — shadow alone (rgba(0,0,0,0.16) 0px 3px 6px) defines the card edge

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Concrete Canvas | `#dbdbdb` | The page background, the gray desktop on which all cards sit |
| 1 | Paper White | `#ffffff` | Default card surface, the dominant elevated tier |
| 2 | Fog Mist | `#f2f2f2` | Subtle secondary panels, input fields, pill buttons — a quieter step below card white |
| 3 | Ash Input | `#ededed` | Input field fill, the most recessed surface |
| 4 | Sand Wash | `#e2ceb8` | Warm-tinted card variant, used to give a widget a different atmosphere |
| 5 | Slate Veil | `#6a728` | Cool-tinted card variant for atmospheric widgets (weather, time-of-day) |

## Elevation

- **Widget Card:** `rgba(0, 0, 0, 0.16) 0px 3px 6px 0px`
- **Subtle Card / Inline Panel:** `rgba(0, 0, 0, 0.18) 0px 1px 4px 0px`

## Imagery

Imagery is mixed and varied — the site behaves like a working portfolio rather than a curated gallery. Featured project tiles use large editorial photographs (aerial cityscapes, landscape art, colorful collages) at full-bleed with 10px corner radius. The profile widget uses a 3D-rendered character (a stylized figure with a hat and glasses) as a customizable avatar. The drawing widget produces pixel-art-style colorful outputs. A color-wheel graphic sits as an interactive SVG. Photography treatment is mostly unfiltered and naturalistic — the system does not apply duotones or color grading. Icons throughout are minimal: small, thin, monoline, often appearing as just single-character glyphs within the monospace flow. The imagery-to-text ratio is roughly 50/50: some cards are image-dominant (featured projects, video tiles), others are nearly text-only (the clock, the news headline).

## Layout

The page model is a full-bleed grid-based dashboard: a fixed #dbdbdb canvas tiled with rounded white cards arranged in an irregular mosaic of varying widths and heights. There is no hero section, no above-the-fold marketing band — the very first viewport is already a 3-column card grid showing the profile, weather, clock, and project tiles. Column count shifts between 2, 3, and 4 cards depending on card size, with a consistent ~24px gutter between cards and ~24px page margin. Cards span different row heights, creating an asymmetric, scrapbook-like rhythm. Navigation is a minimal top bar (status pill left, avatar row right) with no traditional menu. The layout is dense but not claustrophobic — the generous 20-25px corner radii and the gray canvas between cards give each widget room to breathe. There are no full-width dark bands, no alternating section colors, no visible footer beyond a tag row of contact pills at the very bottom.

## Agent Prompt Guide

## Quick Color Reference
- text: #303030
- background: #dbdbdb
- surface (cards): #ffffff
- border / input fill: #ededed
- accent (highlight block): #f9f5a2
- primary action: no distinct CTA color

## 3-5 Example Component Prompts

1. **Weather Widget Card** — A card on the #dbdbdb canvas. 20px radius, #6a728e (slate veil) background fill, padding 24px. Centered IBM Plex Mono 11px caption '(Y)our weather.' in #303030 above. Below: a sun graphic and body text '50°F & Clear (NYC)' in IBM Plex Mono 16px, #303030. Shadow: rgba(0,0,0,0.16) 0px 3px 6px.

2. **Parenthetical Caption Label** — Centered IBM Plex Mono 11px weight 400, #303030, reading '(Y)our profile.' with the first Y inside parentheses and the rest of the word in the body color. No background, no underline, sits 12px above the card's main content.

3. **Highlighted-Letter Word** — Body text in IBM Plex Mono 16px, #303030, reading 'School is (y)our creative studio.' The 'y' sits inside a flat #f9f5a2 rectangle block, no padding offset, glyph baseline matches surrounding text. The rest of the sentence is unmarked.

4. **Pill Contact Button** — A button with 20px border-radius, #f2f2f2 background fill, padding 8px 24px. Text: 'itschoolooooooooool' in IBM Plex Mono 14px, #303030. No border, no shadow, no icon. Sits inline in a row of two such pills.

5. **Digital Clock Card** — White card, 20px radius, 24px padding, centered. IBM Plex Mono 43px weight 400 numerals in #303030 reading '03:15:28'. Below at 8px gap, a pill button with 25px radius, #f2f2f2 background, IBM Plex Mono 14px text 'Click'. Caption '(Y)our button.' in 11px above the clock.

## Mono-First Typography Philosophy

The system commits to a single monospace voice across every context — display, body, caption, button, timestamp. This is a deliberate anti-marketing choice: the site looks less like a portfolio and more like a working tool, a terminal, or a developer's personal homepage. The only escape is a secondary Helvetica at 44px light (weight 300) for occasional humanist contrast, never as the dominant voice. Headlines at 43px in IBM Plex Mono 400 are intentionally un-bold: the mono rhythm does the work of hierarchy, not weight. Never substitute a proportional sans for body text — the entire interface is calibrated to the monospace character grid.

## Widget Caption Convention

Every card opens with a tiny parenthetical caption — always in IBM Plex Mono 11px, always centered, always in parentheses. The format is almost always '(Y)our [noun].' with a period at the end. The parenthesized Y marks the customizable or replaceable variable. Examples seen: '(Y)our profile.', '(Y)our weather.', '(Y)our button.', '(Y)our featured project.', '(Y)our drawing.', '(Y)our virtual houseplant.', '(Y)our watchlist.', '(Y)our chess match.', '(Y)our poll.' This caption convention is the system's narrator — it speaks in third person about the user's belongings, like a clinical app labeling its own panels. New widgets must follow this exact pattern.

## The Highlighted-Letter Game

The single most distinctive micro-interaction: a flat color block (#f9f5a2 yellow or #c7f6ff cyan) sits behind exactly one character in an otherwise normal word. Used in 'School is (y)our creative studio.' — only the 'y' is highlighted. The technique treats a single letter as a swappable variable and signals 'this is yours to change'. The highlight block has zero padding offset, no rounded corners, sits at glyph baseline. This is not a link, not a button — it's a typographic emphasis that says 'customize here' without ever using the word.

## Similar Brands

- **Are.na** — Same grid-of-rounded-cards dashboard composition with calm gray canvases and white surfaces
- **Cargo** — Same creative-studio-as-personal-desktop metaphor, similar card-tile layout with editorial imagery
- **Notion** — Same block-based card dashboard, though School trades Notion's color and density for monochrome restraint
- **Tilda** — Same generous border-radius and white-on-gray card layering, though School is more terminal and less marketing

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-charcoal-ink: #303030;
  --color-paper-white: #ffffff;
  --color-concrete-gray: #dbdbdb;
  --color-fog-mist: #f2f2f2;
  --color-ash-border: #ededed;
  --color-smoke: #c2c2c2;
  --color-graphite: #808080;
  --color-pure-black: #000000;
  --color-sand-wash: #e2ceb8;
  --color-slate-veil: #6a728e;
  --color-highlight-yellow: #f9f5a2;
  --color-highlight-cyan: #c7f6ff;

  /* Typography — Font Families */
  --font-ibm-plex-mono: 'IBM Plex Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-helvetica: 'Helvetica', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 11px;
  --leading-caption: 1.4;
  --text-body-sm: 14px;
  --leading-body-sm: 1.4;
  --text-body: 16px;
  --leading-body: 1.4;
  --text-subheading: 18px;
  --leading-subheading: 1.4;
  --text-heading-sm: 25px;
  --leading-heading-sm: 1.4;
  --text-heading: 43px;
  --leading-heading: 1.4;

  /* Typography — Weights */
  --font-weight-light: 300;
  --font-weight-regular: 400;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-28: 28px;

  /* Layout */
  --page-max-width: 1440px;
  --section-gap: 24px;
  --card-padding: 18-24px;
  --element-gap: 8px;

  /* Border Radius */
  --radius-sm: 2px;
  --radius-lg: 10px;
  --radius-2xl: 20px;
  --radius-3xl: 25px;

  /* Named Radii */
  --radius-cards: 20px;
  --radius-badges: 20px;
  --radius-images: 10px;
  --radius-inputs: 25px;
  --radius-buttons: 20px;

  /* Shadows */
  --shadow-sm: rgba(0, 0, 0, 0.16) 0px 3px 6px 0px;
  --shadow-sm-2: rgba(0, 0, 0, 0.18) 0px 1px 4px 0px;

  /* Surfaces */
  --surface-concrete-canvas: #dbdbdb;
  --surface-paper-white: #ffffff;
  --surface-fog-mist: #f2f2f2;
  --surface-ash-input: #ededed;
  --surface-sand-wash: #e2ceb8;
  --surface-slate-veil: #6a728;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-charcoal-ink: #303030;
  --color-paper-white: #ffffff;
  --color-concrete-gray: #dbdbdb;
  --color-fog-mist: #f2f2f2;
  --color-ash-border: #ededed;
  --color-smoke: #c2c2c2;
  --color-graphite: #808080;
  --color-pure-black: #000000;
  --color-sand-wash: #e2ceb8;
  --color-slate-veil: #6a728e;
  --color-highlight-yellow: #f9f5a2;
  --color-highlight-cyan: #c7f6ff;

  /* Typography */
  --font-ibm-plex-mono: 'IBM Plex Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-helvetica: 'Helvetica', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 11px;
  --leading-caption: 1.4;
  --text-body-sm: 14px;
  --leading-body-sm: 1.4;
  --text-body: 16px;
  --leading-body: 1.4;
  --text-subheading: 18px;
  --leading-subheading: 1.4;
  --text-heading-sm: 25px;
  --leading-heading-sm: 1.4;
  --text-heading: 43px;
  --leading-heading: 1.4;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-28: 28px;

  /* Border Radius */
  --radius-sm: 2px;
  --radius-lg: 10px;
  --radius-2xl: 20px;
  --radius-3xl: 25px;

  /* Shadows */
  --shadow-sm: rgba(0, 0, 0, 0.16) 0px 3px 6px 0px;
  --shadow-sm-2: rgba(0, 0, 0, 0.18) 0px 1px 4px 0px;
}
```
