# Ayaka B. Ito — Style Reference
> Editorial spread on warm linen paper.

A tactile, magazine-like atmosphere where oversized serif type and flat color planes replace the usual UI scaffolding.

**Theme:** mixed

Ayaka B. Ito presents an editorial portfolio language: full-bleed warm-toned pages flipping between a dust-pink cover collage, a terracotta-rust intro spread, and oversized serif display panels. The system reads like a printed magazine — flat color planes, hairline rules, and one custom display serif that swells to extreme positive tracking on hero copy. Color is used as whole-page atmosphere rather than UI accent: terracotta, olive, teal, gold, and dusty pink each take over entire sections to signal project boundaries. Components are reduced to their editorial primitives — a top bar of bare category links, tiny parenthesized section tags, and pill-shaped language toggles — with no shadows, no cards, and almost no raised surfaces. The page breathes with generous vertical rhythm and lets typography do all the structural work.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Ink Black | `#000000` | `--color-ink-black` | Body text, hairline borders, and rule lines — the dominant structural color used everywhere text and dividers are drawn |
| Bone White | `#ffffff` | `--color-bone-white` | Primary page canvas and base background for gallery and intro spreads |
| Linen Mist | `#eeecec` | `--color-linen-mist` | Warm light-gray surface for secondary spreads and subtle tonal shifts between sections |
| Paper Cream | `#fefdf8` | `--color-paper-cream` | Warm off-white alt canvas for soft tonal contrast against Bone White |
| Chalk Gray | `#a1a1a1` | `--color-chalk-gray` | Muted helper text, secondary labels, and low-emphasis borders |
| Haze Blue | `#d6e0eb` | `--color-haze-blue` | Cool gray-blue tint for quiet borders and subdued type, balancing the warm earth tones |
| Slate Blue | `#6b969f` | `--color-slate-blue` | Dusty blue-gray accent for heading type and project labels |
| Sky Mist | `#9ec5d6` | `--color-sky-mist` | Light dusty blue for heading type and border rules — the coolest note in the palette |
| Periwinkle | `#9cb8d3` | `--color-periwinkle` | Soft lavender-blue for heading copy and delicate dividers |
| Deep Teal | `#167070` | `--color-deep-teal` | Saturated muted teal for heading type — the strongest cool accent in the system |
| Sage | `#507f70` | `--color-sage` | Muted green accent for tag labels and short heading runs |
| Olive | `#576041` | `--color-olive` | Warm gray-olive for heading type and project titles — anchors the earth-tone half of the palette |
| Moss | `#495116` | `--color-moss` | Darker olive for emphasized heading type and link rules, reading as near-black with warmth |
| Ochre | `#cda04f` | `--color-ochre` | Golden mustard for full-bleed project backgrounds and accent headings — a signature warm note |
| Ember Rust | `#a65d4d` | `--color-ember-rust` | Full-bleed intro section background — the signature terracotta that defines the brand's cover moment |
| Lava | `#f75929` | `--color-lava` | Vivid orange punctuation for accent text and graphic highlights against muted grounds |
| Blush | `#ddbad0` | `--color-blush` | Dusty pink used as the dominant hairline border color across the entire UI — the single most repeated chromatic color |
| Rose Ash | `#d7b5bf` | `--color-rose-ash` | Muted rose-gray for heading type and link borders, a softer companion to Blush |
| Clay | `#c7afac` | `--color-clay` | Warm taupe for heading rules and type — the bridge between the pinks and the earth tones |

## Tokens — Typography

### Hanae — Primary custom display and body serif. Carries the site's editorial identity. Used for hero headlines at 62–68px with extreme positive tracking (~0.4em), for body copy at 16–20px, and for tiny parenthesized section tags at 10–11px. The custom typeface's swash and discretionary ligature features are switched on for a handwritten inscriptional quality. Weight stays 400–500 even at display sizes — the scale and tracking carry the voice, not boldness. · `--font-hanae`
- **Substitute:** Cormorant Garamond or Fraunces (variable serif) — both offer the high-contrast modern serif feel with delicate inscriptional qualities
- **Weights:** 400, 500
- **Sizes:** 10px, 11px, 13px, 16px, 18px, 20px, 23px, 25px, 32px, 38px, 40px, 62px, 68px
- **Line height:** 1.0–2.73 (tightest on display sizes 62–68px, loosest on tag/label 10–11px)
- **Letter spacing:** Negative at small sizes (-0.41px at 10px, -0.44px at 11px, -0.34px at 16px), shifting positive as size grows (0.27px at 18px, 2.5px at 25px, 4.35px at 32px, ~10.9px at 40px, ~24.8–27.2px at 62–68px). The tracking fan-out on display sizes is a signature.
- **OpenType features:** `"dlig" on, "liga" on, "swsh" on`
- **Role:** Primary custom display and body serif. Carries the site's editorial identity. Used for hero headlines at 62–68px with extreme positive tracking (~0.4em), for body copy at 16–20px, and for tiny parenthesized section tags at 10–11px. The custom typeface's swash and discretionary ligature features are switched on for a handwritten inscriptional quality. Weight stays 400–500 even at display sizes — the scale and tracking carry the voice, not boldness.

### Open Sans — Secondary sans for occasional subhead and hero-supporting text where a cleaner geometric voice is needed alongside the serif. Used sparingly — the serif does the structural work. · `--font-open-sans`
- **Substitute:** Inter or system-ui sans
- **Weights:** 400, 700
- **Sizes:** 18px, 50px
- **Line height:** 1.67
- **Letter spacing:** normal
- **OpenType features:** `"dlig" on, "liga" on, "swsh" on`
- **Role:** Secondary sans for occasional subhead and hero-supporting text where a cleaner geometric voice is needed alongside the serif. Used sparingly — the serif does the structural work.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 10px | 1.82 | -0.41px | `--text-caption` |
| body | 18px | 1.67 | 0.27px | `--text-body` |
| subheading | 25px | 1.16 | 2.5px | `--text-subheading` |
| heading-sm | 32px | 1.1 | 4.35px | `--text-heading-sm` |
| heading | 40px | 1.05 | 10.9px | `--text-heading` |
| display | 68px | 1 | 27.2px | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** spacious

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 16 | 16px | `--spacing-16` |
| 20 | 20px | `--spacing-20` |
| 24 | 24px | `--spacing-24` |
| 32 | 32px | `--spacing-32` |
| 36 | 36px | `--spacing-36` |
| 60 | 60px | `--spacing-60` |
| 100 | 100px | `--spacing-100` |
| 160 | 160px | `--spacing-160` |

### Border Radius

| Element | Value |
|---------|-------|
| nav | 180px |
| tags | 120px |
| inputs | 140px |
| buttons | 120px |
| sections | 0px |

### Layout

- **Section gap:** 80px
- **Card padding:** 26px
- **Element gap:** 26px

## Components

### Top Category Navigation
**Role:** Primary site navigation bar

Horizontally arranged text links in Hanae at ~13–16px, weight 400, tracking -0.44px. Left side: brand mark 'Ayaka B. Ito —' followed by bare category links (Branding, Editorial, Typefaces, Illustrations). Right side: Info, Instagram, and a pill-shaped language toggle. No background, no border, no underline — links sit on the page surface. Vertically thin with 7–13px padding. The language toggle uses the 120px pill radius.

### Language Toggle Pill
**Role:** Bilingual UI switcher

Pill-shaped button with 120px border-radius, ~10px vertical and 18px horizontal padding, hairline Blush (#ddbad0) border, Hanae 11px text weight 500, uppercase or small-caps treatment. Background transparent or white; text Ink Black.

### Section Tag Label
**Role:** Tiny editorial metadata tag

Parenthesized uppercase label like '(INTRO)' or '(FEATURED PROJECTS)'. Hanae 10–11px, weight 500, letter-spacing ~0.1em, rendered in a muted accent color (Sage, Olive, or Rose Ash depending on section). Sits above or beside a headline as a quiet classification marker.

### Display Headline
**Role:** Oversized editorial headline for section intros and project titles

Hanae 62–68px, weight 400, line-height 1.0, letter-spacing 0.4em (~27px). Renders as a wide horizontal band of individually tracked glyphs. Color typically Ink Black or a muted accent (Olive, Teal). The extreme tracking transforms the headline from a sentence into a graphic mark.

### Intro Hero Block
**Role:** Full-bleed welcome panel

Full-viewport-width section with Ember Rust (#a65d4d) background. Contains a large editorial paragraph in Hanae 32–38px weight 400, color Bone White or light cream, tracking ~0.27em. A tiny '(INTRO)' tag sits above in Rose Ash. The block acts as a magazine cover spread — no image, no card, just flat color and type.

### Project Title Overlay
**Role:** Headline positioned over a project background color panel

Large Hanae serif (38–40px) at weight 400, tight tracking, placed to the right of or overlapping a full-bleed colored panel (Ochre, Teal, etc.). Color is either Ink Black or a contrasting neutral. A small '(CUSTOM TYPEFACE)' or similar tag sits below in muted accent color at 10–11px.

### Gallery Grid (Magazine Spread Thumbnails)
**Role:** Portfolio project thumbnail arrangement

Loose, overlapping arrangement of editorial magazine spread images at varying rotations, filling the viewport. Each spread sits as a raw rectangular image with no border, no shadow, no rounded corners. The grid is the hero — no headline or CTA competes for attention.

### Full-Bleed Color Spread
**Role:** Project or section background plane

Edge-to-edge single-color section (Ochre, Ember Rust, Deep Teal, Sky Mist, etc.) that functions as a magazine page. Holds only type and optionally one or two large images. Zero padding inside the color plane — type sits at the edges with generous internal margins.

### Bare Text Link
**Role:** In-line or nav link

Hanae 13–16px weight 400, color Ink Black or an accent. No underline by default; on hover, a Blush (#ddbad0) hairline underline appears via border-bottom. No background, no padding chip — links are typographic, not boxy.

### Project Meta Label
**Role:** Small project category or role descriptor

Hanae 10–11px weight 500, tracking 0.1em, uppercase, in a muted accent color (Sage, Rose Ash, Clay). Sits adjacent to a project title as a quiet annotation.

### Input Field
**Role:** Form input for contact or newsletter

Pill-shaped input with 140px border-radius, Blush (#ddbad0) hairline border, 18–20px vertical padding, Hanae 16px text. Background white. No visible label — placeholder text only. Used in sparse contact contexts.

### Footer Link Row
**Role:** Bottom-of-page contact and social links

Horizontal row of bare text links in Hanae 13–16px, Ink Black, flush left or center. Same hairline-underline-on-hover behavior as nav links. No background bar.

## Do's and Don'ts

### Do
- Use Hanae for all editorial and structural type — the custom serif IS the brand. Open Sans appears only as a supporting voice, never as the primary type on a key screen.
- Let section backgrounds be full-bleed color planes (Ember Rust, Ochre, Deep Teal, etc.) to signal project boundaries — never use cards, shadows, or borders to separate sections.
- Track display headlines aggressively positive: ~0.4em at 62–68px, scaling down to ~0.1em at 25px and negative at body sizes. The letter-spacing fan is what makes the type read as editorial.
- Use Blush (#ddbad0) as the default hairline border color for all rules, dividers, and interactive outlines — it recedes into a warm tint that complements every earth-tone ground.
- Round all interactive elements (buttons, inputs, language toggle) to 120–180px — pill geometry reinforces the soft, warm, tactile feel of the system.
- Keep navigation and UI chrome minimal: bare text links, a tiny parenthesized tag system, and at most one pill toggle. Let the typography and color planes carry hierarchy.
- Switch on dlig, liga, and swsh font features for Hanae — the swash and discretionary ligatures contribute the inscriptional character the type is known for.

### Don't
- Do not add drop shadows, card elevation, or rounded panels to separate content — hierarchy comes from full-bleed color changes and type scale, not from surface lift.
- Do not use Blush (#ddbad0) or any chromatic color as a filled button background — the system has no filled CTA pattern; actions are bare text or outlined pills.
- Do not bold Hanae above weight 500 — the serif's authority comes from its weight combined with extreme tracking, not from heavy weight.
- Do not set body copy in a sans-serif — even secondary text should stay in Hanae to preserve the editorial voice. Open Sans is a rare accent, not a substitute.
- Do not center-align long-form body paragraphs — the intro hero uses wide tracking as its style, but multi-line reading text should stay left-aligned for legibility.
- Do not introduce cool grays or pure neutral grays for backgrounds — the palette stays warm (Bone White → Linen Mist → Paper Cream) to match the linen-paper atmosphere.
- Do not crop or round the magazine-spread thumbnail images — they should sit as raw rectangular blocks, possibly overlapping at slight rotations, to preserve the printed-object feel.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Bone White Canvas | `#ffffff` | Primary page background for gallery and list spreads |
| 2 | Paper Cream Alt | `#fefdf8` | Warm off-white canvas used as tonal variant to break up long pages |
| 3 | Linen Mist | `#eeecec` | Soft warm-gray surface for project panels and secondary spreads |
| 4 | Full-Bleed Color Plane | `#a65d4d` | Project section background — the terracotta and other earth tones take over entire pages as editorial spreads |

## Elevation

The design intentionally avoids shadows and raised surfaces. Hierarchy is built through typography scale, flat color planes, and hairline borders rather than elevation. Cards and panels sit flush with the page; if a section needs emphasis, it gets a full-bleed color change instead of a drop shadow.

## Imagery

Photography and editorial spreads dominate the visual language — no icons, no illustrations, no abstract graphics, no 3D. The imagery is the designer's own work: full magazine spreads, book covers, type specimens, and brand identity layouts photographed as physical objects. Images are presented as raw rectangular crops with no rounding, no shadows, and no border treatments; they overlap slightly at varying rotations to evoke a desk of printed work. Treatment is high-fidelity editorial photography — high-key lighting, sharp detail, the paper texture and ink visible. When type is shown as imagery, it appears as oversized display specimens (e.g. the 'JASMINE' lettering) filling entire viewports, functioning as both content and decoration. The role of imagery is the portfolio itself: the work IS the hero, with type and color planes framing it.

## Layout

Full-bleed editorial page model — sections are viewport-wide color planes that change abruptly between Bone White, Linen Mist, and project-specific earth tones. The first viewport is a scattered, overlapping grid of magazine-spread thumbnails filling the entire screen with no headline or CTA — the work is the hero. Navigation is a single thin top bar with bare text links, flush left and right, no background fill. Sections alternate between image-dominant spreads and type-dominant spreads, each filling the full viewport. Hero sections are split asymmetrically: a large image or display-type specimen on one side meets a solid color plane with a paragraph on the other (as in the rust intro and the Jasmine project). Section rhythm is spacious — 80px+ vertical gaps between blocks, with no visible dividers between sections (color change does the separating). Content is arranged in 2-column asymmetric splits or single full-width centered text blocks; no 3-column card grids, no pricing tables, no feature comparison layouts. The entire page reads as a flip-through of magazine pages rather than a scrollable app interface.

## Agent Prompt Guide

Quick Color Reference:
- text: #000000 (Ink Black)
- background: #ffffff (Bone White)
- border: #ddbad0 (Blush, hairline)
- accent: #a65d4d (Ember Rust, full-bleed panels)
- secondary accent: #cda04f (Ochre), #167070 (Deep Teal), #576041 (Olive)
- primary action: #ddbad0 (outlined action border)

Example Component Prompts:
1. Create a full-bleed intro hero section: Ember Rust (#a65d4d) background spanning the full viewport. Tiny '(INTRO)' tag in Hanae 11px, weight 500, letter-spacing 0.1em, color #d7b5bf (Rose Ash). Body headline in Hanae 38px, weight 400, letter-spacing 0.27em, color #fefdf8 (Paper Cream), line-height 1.3. Generous internal padding, no border, no card.

2. Create a display headline block: Hanae 68px, weight 400, letter-spacing 0.4em (~27px), line-height 1.0, color #000000 (Ink Black). The text reads as a wide horizontal band of individually tracked glyphs against a Bone White (#ffffff) background. No border, no shadow.

3. Create a language toggle pill: 120px border-radius, 1px solid #ddbad0 (Blush) border, transparent or white background, Hanae 11px weight 500 text, 10px vertical / 18px horizontal padding. Text color #000000.

4. Create a project title overlay over an Ochre (#cda04f) full-bleed panel: Hanae 40px, weight 400, letter-spacing 0.27em, color #000000, placed to the right side. Small '(CUSTOM TYPEFACE)' tag below in Hanae 10px, weight 500, letter-spacing 0.1em, color #507f70 (Sage). Panel fills the full viewport with zero rounded corners.

5. Create a portfolio gallery hero: viewport-filling arrangement of rectangular editorial magazine-spread images overlapping at slight rotations. No headlines, no navigation beyond the top bar, no CTA. Images are raw rectangles with 0px border-radius and no shadows.

## Letter-Spacing System

The site's tracking behavior is one of its most recognizable traits. Hanae shifts from negative to dramatically positive as type size grows:
- 10–13px: -0.41 to -0.44px (tight, for tags and micro labels)
- 16–18px: 0.27 to 0.34px (near-normal, for body)
- 20–25px: ~2.5px (loose, for subheadings)
- 32–38px: ~4.35px (spaced, for editorial paragraphs)
- 40px: ~10.9px (wide, for project titles)
- 62–68px: ~24.8–27.2px (extreme, for display headlines)

This tracking fan-out is the design's signature. Do not flatten it to a single value — display and body must feel categorically different in rhythm.

## Editorial Section Tagging

The parenthesized uppercase tag system (e.g. '(INTRO)', '(FEATURED PROJECTS)', '(CUSTOM TYPEFACE)') functions as the site's only metadata layer. Tags are always:
- Hanae 10–11px, weight 500
- Uppercase, letter-spacing 0.1em
- Wrapped in parentheses
- Colored in a muted accent appropriate to the section (Sage for type, Rose Ash for intro, Clay for editorial)
- Placed above or beside the headline they describe, not below

This tag system replaces the conventional eyebrow/kicker text pattern found in typical SaaS sites and reinforces the magazine-spread metaphor.

## Similar Brands

- **Pentagram (pentagram.com)** — Same editorial-portfolio DNA — full-bleed project spreads, custom serif display type, minimal nav, no card components. Pentagram's per-partner full-bleed color covers mirror Ayaka's project-as-magazine-spread approach.
- **It's Nice That (itsnicethat.com)** — Editorial publishing layout with oversized serif headlines, warm earth-tone section backgrounds, and bare text-link navigation. Both treat type and color as the primary structural elements rather than UI scaffolding.
- **Wolff Olins (wolff-olins.com)** — Full-bleed color-block project pages with large serif headlines, minimal chrome, and the same 'work IS the hero' philosophy. The flat-color section transitions and generous vertical rhythm are closely related.
- **Lava (lavamagazine.com)** — Both lean on custom serif display type with extreme positive letter-spacing on hero headlines, creating a printed-magazine rhythm. Lava's warm editorial palette and hairline typographic details echo Ayaka's system.
- **Anja Meiners / editorial portfolio sites (anjameiners.com)** — Same warm linen atmosphere, custom serif with swash features, overlapping spread thumbnails on the cover, and parenthesized micro-tags as the only metadata layer.

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-ink-black: #000000;
  --color-bone-white: #ffffff;
  --color-linen-mist: #eeecec;
  --color-paper-cream: #fefdf8;
  --color-chalk-gray: #a1a1a1;
  --color-haze-blue: #d6e0eb;
  --color-slate-blue: #6b969f;
  --color-sky-mist: #9ec5d6;
  --color-periwinkle: #9cb8d3;
  --color-deep-teal: #167070;
  --color-sage: #507f70;
  --color-olive: #576041;
  --color-moss: #495116;
  --color-ochre: #cda04f;
  --color-ember-rust: #a65d4d;
  --color-lava: #f75929;
  --color-blush: #ddbad0;
  --color-rose-ash: #d7b5bf;
  --color-clay: #c7afac;

  /* Typography — Font Families */
  --font-hanae: 'Hanae', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-open-sans: 'Open Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.82;
  --tracking-caption: -0.41px;
  --text-body: 18px;
  --leading-body: 1.67;
  --tracking-body: 0.27px;
  --text-subheading: 25px;
  --leading-subheading: 1.16;
  --tracking-subheading: 2.5px;
  --text-heading-sm: 32px;
  --leading-heading-sm: 1.1;
  --tracking-heading-sm: 4.35px;
  --text-heading: 40px;
  --leading-heading: 1.05;
  --tracking-heading: 10.9px;
  --text-display: 68px;
  --leading-display: 1;
  --tracking-display: 27.2px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-36: 36px;
  --spacing-60: 60px;
  --spacing-100: 100px;
  --spacing-160: 160px;

  /* Layout */
  --section-gap: 80px;
  --card-padding: 26px;
  --element-gap: 26px;

  /* Border Radius */
  --radius-full: 120px;
  --radius-full-2: 140px;
  --radius-full-3: 180px;

  /* Named Radii */
  --radius-nav: 180px;
  --radius-tags: 120px;
  --radius-inputs: 140px;
  --radius-buttons: 120px;
  --radius-sections: 0px;

  /* Surfaces */
  --surface-bone-white-canvas: #ffffff;
  --surface-paper-cream-alt: #fefdf8;
  --surface-linen-mist: #eeecec;
  --surface-full-bleed-color-plane: #a65d4d;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-ink-black: #000000;
  --color-bone-white: #ffffff;
  --color-linen-mist: #eeecec;
  --color-paper-cream: #fefdf8;
  --color-chalk-gray: #a1a1a1;
  --color-haze-blue: #d6e0eb;
  --color-slate-blue: #6b969f;
  --color-sky-mist: #9ec5d6;
  --color-periwinkle: #9cb8d3;
  --color-deep-teal: #167070;
  --color-sage: #507f70;
  --color-olive: #576041;
  --color-moss: #495116;
  --color-ochre: #cda04f;
  --color-ember-rust: #a65d4d;
  --color-lava: #f75929;
  --color-blush: #ddbad0;
  --color-rose-ash: #d7b5bf;
  --color-clay: #c7afac;

  /* Typography */
  --font-hanae: 'Hanae', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-open-sans: 'Open Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.82;
  --tracking-caption: -0.41px;
  --text-body: 18px;
  --leading-body: 1.67;
  --tracking-body: 0.27px;
  --text-subheading: 25px;
  --leading-subheading: 1.16;
  --tracking-subheading: 2.5px;
  --text-heading-sm: 32px;
  --leading-heading-sm: 1.1;
  --tracking-heading-sm: 4.35px;
  --text-heading: 40px;
  --leading-heading: 1.05;
  --tracking-heading: 10.9px;
  --text-display: 68px;
  --leading-display: 1;
  --tracking-display: 27.2px;

  /* Spacing */
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-36: 36px;
  --spacing-60: 60px;
  --spacing-100: 100px;
  --spacing-160: 160px;

  /* Border Radius */
  --radius-full: 120px;
  --radius-full-2: 140px;
  --radius-full-3: 180px;
}
```
