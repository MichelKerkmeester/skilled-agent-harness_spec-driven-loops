# Sprig — Style Reference
> editorial research notebook on warm paper — quiet, almost inkless, with warm light leaking in at the edges

**Theme:** light

Sprig operates in a near-monochrome editorial register: a warm bone-white canvas, hairline borders, and a single ink tone so dark it reads as black but carries a barely-there navy undertone. The system feels like a research notebook — quiet, confident, and deliberately undecorated — punctuated by warm sunset gradients that act as section markers rather than decoration. Typography is two custom families in conversation: ABC Diatype for the editorial moments (headings, display) and TT Commons Pro for the functional UI (nav, buttons, labels). Components are pill-shaped and generously spaced; cards can be nearly circular (100px radius) for feature moments, creating a visual contrast between the very-soft and the very-structured. Color is rationed: the only chromatic color in the interface is the near-black ink itself, and gradients are reserved for hero and event imagery — never on buttons, never on controls.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Abyssal Ink | `#0b2330` | `--color-abyssal-ink` | Primary text, nav links, borders, icon strokes — the workhorse near-black with a whisper of navy. Carries every reading surface in the system |
| Bone | `#faf9f8` | `--color-bone` | Page canvas, card surfaces, button text on dark fills — a warm off-white, never pure #fff |
| Obsidian | `#141312` | `--color-obsidian` | Headings, display text, strong UI fills — slightly warmer than Abyssal, used where headings need a touch more warmth |
| Espresso | `#272420` | `--color-espresso` | Filled button background (primary action), dark surface sections — the primary CTA color, a warm near-black |
| Carbon | `#000000` | `--color-carbon` | Absolute dark for SVG fills and the strictest contrast moments — used sparingly where true black is needed |
| Ash | `#f3f3f3` | `--color-ash` | Card surfaces, badge backgrounds, subtle elevated panels — the first step up from the canvas |
| Mist | `#e8e7e6` | `--color-mist` | Borders, dividers, secondary surface fills — a warm gray that defines edges without drawing attention |
| Vapor | `#dddcd9` | `--color-vapor` | Lightest visible border, ghost button outlines — the quietest edge in the system |
| Pebble | `#c4c4bc` | `--color-pebble` | Muted body text, subdued metadata, tertiary information |
| Fog | `#9a9a91` | `--color-fog` | Disabled text, placeholder text, very subdued heading accents |
| Smoke | `#8f8d8b` | `--color-smoke` | Mid-tone surface fills, pressed button states |
| Graphite | `#6e6d6a` | `--color-graphite` | Tertiary text, subtle borders, icon strokes in secondary contexts |
| Slate | `#575653` | `--color-slate` | Body text, nav borders, link underlines — the mid-neutral for readable secondary information |
| Coffee | `#322e2a` | `--color-coffee` | Deep dark surface, image borders, the second-darkest fill — used in footer-adjacent surfaces and image frames |
| Dusk | `linear-gradient(rgb(239, 220, 182), rgb(235, 163, 126) 0%, rgb(125, 122, 143))` | `--color-dusk` | Gradient start — warm golden, the opening tone of the signature sunset gradient |
| Ember | `#eba370` | `--color-ember` | Gradient mid-stop — coral-orange transition in the signature sunset gradient |
| Twilight | `#7d7a8f` | `--color-twilight` | Gradient end — muted purple-gray closing the sunset gradient |

## Tokens — Typography

### TT Commons Pro — Functional UI typeface — nav links, button labels, badge text, small labels. Single weight 400 is a deliberate choice: the interface whispers instead of shouts. Used at 16-18px for UI chrome and at 40px for one rare editorial moment. · `--font-tt-commons-pro`
- **Substitute:** Inter, Söhne, General Sans
- **Weights:** 400
- **Sizes:** 16px, 18px, 40px
- **Line height:** 1.50
- **Letter spacing:** normal at all sizes
- **Role:** Functional UI typeface — nav links, button labels, badge text, small labels. Single weight 400 is a deliberate choice: the interface whispers instead of shouts. Used at 16-18px for UI chrome and at 40px for one rare editorial moment.

### ABC Diatype — Editorial typeface — display headings at 40px weight 500, section headings at 32px weight 500, subheadings at 24px weight 400, body at 16px. The geometric construction gives the system its quiet authority; the weight 500 (not 600-700) for headings is the anti-convention choice that defines Sprig's restraint. · `--font-abc-diatype`
- **Substitute:** Söhne, GT America, Inter Display
- **Weights:** 400, 500
- **Sizes:** 14px, 16px, 24px, 32px, 40px
- **Line height:** 1.20 (display) / 1.30 (headings) / 1.40 (body)
- **Role:** Editorial typeface — display headings at 40px weight 500, section headings at 32px weight 500, subheadings at 24px weight 400, body at 16px. The geometric construction gives the system its quiet authority; the weight 500 (not 600-700) for headings is the anti-convention choice that defines Sprig's restraint.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 14px | 1.3 | — | `--text-caption` |
| body | 16px | 1.5 | — | `--text-body` |
| body-lg | 18px | 1.5 | — | `--text-body-lg` |
| subheading | 24px | 1.3 | — | `--text-subheading` |
| heading-sm | 32px | 1.2 | — | `--text-heading-sm` |
| heading | 40px | 1.2 | — | `--text-heading` |

## Tokens — Spacing & Shapes

**Base unit:** 8px

**Density:** spacious

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 8 | 8px | `--spacing-8` |
| 16 | 16px | `--spacing-16` |
| 24 | 24px | `--spacing-24` |
| 32 | 32px | `--spacing-32` |
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |
| 64 | 64px | `--spacing-64` |
| 80 | 80px | `--spacing-80` |
| 88 | 88px | `--spacing-88` |
| 96 | 96px | `--spacing-96` |
| 128 | 128px | `--spacing-128` |
| 160 | 160px | `--spacing-160` |
| 224 | 224px | `--spacing-224` |

### Border Radius

| Element | Value |
|---------|-------|
| nav | 32px |
| cards | 100px |
| badges | 4px |
| buttons | 32px |
| special-card | 1600px |
| feature-cards | 100px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 48px
- **Element gap:** 8px

## Components

### Primary Filled Button
**Role:** The sole filled button in the system. Used for the primary conversion action on every page.

Espresso (#272420) background, Bone (#faf9f8) text, 32px border-radius (full pill), 12px horizontal padding × 6px vertical padding. TT Commons Pro 16px weight 400. Optional 3px arrow icon with 3px gap. No border. The pill shape is non-negotiable — filled buttons are always fully rounded.

### Ghost/Outline Button
**Role:** Secondary actions, nav-adjacent controls, less prominent conversion paths.

Transparent background, 1px border in Vapor (#dddcd9) or Mist (#e8e7e6), text in Abyssal Ink (#0b2330), 32px border-radius (pill), 12px × 6px padding. TT Commons Pro 16px weight 400.

### Top Announcement Banner
**Role:** Site-wide thin bar above the navigation, used for launches, events, or product announcements.

Espresso (#272420) or Obsidian (#141312) background, Bone (#faf9f8) text, centered single line. ABC Diatype 14px or 16px weight 400. Full-bleed width, ~40px height.

### Primary Navigation Bar
**Role:** Main site navigation — logo left, center nav links, sign-in and CTA right.

Bone (#faf9f8) background, no visible border bottom. Logo (Sprig wordmark) left at 6px-8px padding. Center nav links in ABC Diatype or TT Commons Pro 16px, Slate (#575653) text with 24px gaps. Right side: 'Sign in' text link in Slate, then a Primary Filled Button ('Book a demo'). Total height ~64px.

### Large Product Preview Card
**Role:** Hero or feature-section visual — the product UI shown inside a gradient frame.

Wrapped in a card with 100px or 1600px border-radius, set against a warm sunset gradient (Dusk → Ember → Twilight). The gradient provides a light, warm, editorial backdrop. The product screenshot inside has its own white card with internal navigation. This pairing — warm gradient outside, clean product UI inside — is the system's signature visual.

### Event/Content Card
**Role:** Cards in the events section and similar content grids — image or gradient background with overlay text.

100px border-radius, variable background (photography, brand gradient, or solid). Aspect ratio approximately 3:4 or 1:1. Text overlays in Bone (#faf9f8) or Abyssal Ink (#0b2330) depending on background darkness. No visible border, no shadow — the gradient or photo is the card.

### Logo Bar
**Role:** Social proof section — trusted-by logos in a single horizontal row.

No container, no border. Logos in a single row, evenly spaced, rendered in their native brand colors (which provides the only chromatic visual moment in an otherwise monochrome page). Below the logo bar, a subtle horizontal hairline divider in Mist (#e8e7e6) may separate from the next section.

### Badge / Tag
**Role:** Small category labels, event types, or metadata pills.

Ash (#f3f3f3) background, Abyssal Ink (#0b2330) text, 4px border-radius, 48px vertical padding (visual centering via generous padding), TT Commons Pro 14-16px. Small, unobtrusive — badges are functional, not decorative.

### Section Heading Block
**Role:** Editorial-style section openers — large text, generous space, minimal ornament.

ABC Diatype 32-40px weight 500, Abyssal Ink (#0b2330) or Obsidian (#141312) color, 1.20 line-height. Followed by body text in ABC Diatype 16px weight 400, Slate (#575653). Left-aligned, never centered. Section gap above: 80px.

### Hairline Divider
**Role:** Section separator, structural edge between content bands.

1px solid border in Mist (#e8e7e6) or Vapor (#dddcd9). Full-width or constrained to content max-width. The system uses dividers instead of section background changes to maintain the bone-white continuity.

### Feature Highlight Section
**Role:** Alternating two-column sections — text on one side, visual on the other.

Left text column (heading + body + optional CTA), right visual column (product preview or illustration). 48px card padding, 80px section gap. Text is left-aligned; visual is contained. Alternates text-left/image-right and text-right/image-left.

### CTA Card / End-of-Page Banner
**Role:** Closing conversion section with a large headline and primary action.

Large rounded container (100px or 1600px radius), Abyssal Ink (#0b2330) or Espresso (#272420) background, Bone (#faf9f8) text. Contains a heading at 40px, body text, and a Ghost/Outline Button (Bone border, Bone text) or Primary Filled Button. Centered text layout.

## Do's and Don'ts

### Do
- Use #272420 (Espresso) as the only filled button background — never introduce blue, red, or green for buttons
- Set all filled and ghost buttons to 32px border-radius (full pill) with 12px horizontal × 6px vertical padding
- Use ABC Diatype at weight 500 for all headings 24px and above — never go to weight 600 or 700
- Set large feature cards to 100px border-radius and special hero cards to 1600px — the curvature is the system's signature
- Apply the Dusk→Ember→Twilight gradient (linear) only as a backdrop for product UI or as event card backgrounds — never on text, borders, or controls
- Keep the page canvas at #faf9f8 (Bone) with 1px Mist (#e8e7e6) dividers instead of alternating background bands
- Left-align all text content — body, headings, and CTAs — never center body copy or section openers

### Don't
- Do not add drop shadows to any component — use surface tone shifts and curvature instead
- Do not introduce a secondary brand color — the system is monochrome plus warm gradient, and adding blue, green, or red breaks the editorial register
- Do not center body text or feature descriptions — left-alignment is structural, not stylistic
- Do not use border-radius below 4px on any visible element — the system commits to soft, never sharp
- Do not apply the warm gradient to text, icons, or UI controls — it is reserved for image backdrops and large decorative cards
- Do not use bold (weight 700) anywhere — ABC Diatype 500 is the maximum, TT Commons Pro is weight 400 only
- Do not alternate between light and dark section backgrounds to create rhythm — use hairline dividers and generous spacing instead

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Bone Canvas | `#faf9f8` | Base page background — the warm off-white that defines the entire system's atmosphere |
| 1 | Ash Card | `#f3f3f3` | Subtle elevated card surface, badge fills, first step up from the canvas |
| 2 | Mist Divider | `#e8e7e6` | Hairline borders, subtle structural dividers between sections |
| 3 | Espresso Surface | `#272420` | Dark filled surfaces — buttons, announcement banners, dark section cards |
| 4 | Coffee Depth | `#322e2a` | Deepest surface for image frames, footer-adjacent backgrounds, the most recessed visual layer |

## Elevation

The system intentionally avoids drop shadows. Instead of elevation through blur and offset, it uses surface tone shifts (#faf9f8 → #f3f3f3 → #e8e7e6) and generous border-radius (100px for cards) to create separation. Where other systems add shadow to signal importance, Sprig adds space and curvature. The only 'shadow-like' effect is the warm gradient halo behind product preview cards, which provides depth through color, not blur.

## Imagery

Imagery follows three registers: (1) Warm sunset gradients — Dusk gold → Ember coral → Twilight purple-gray — used exclusively as backdrops for product UI screenshots and large feature cards. These gradients are the only color in the system and act as editorial 'light leaks.' (2) Candid professional photography — people in research, product, and tech contexts, often in group or conversational poses. Full color, unfiltered, warm-toned. Used in the events/community section. (3) Product UI screenshots — always contained within the warm gradient card frame, never shown as raw screenshots. The gradient wrapping is what makes product imagery feel on-brand. No illustrations, no 3D renders, no abstract graphics. The system is text + gradient + photography + product UI — nothing else.

## Layout

Max-width 1200px centered, but the hero and full-bleed sections extend to viewport edges. The page is predominantly left-aligned text — the system never centers body content. Section rhythm is: hero (text-left + product preview-right on warm gradient) → logo bar (full-width, unbordered) → content sections (alternating text-left/image-right at 80px gaps) → events card grid (4 horizontal cards at 100px radius) → closing CTA. Vertical spacing is generous: 80px between major sections, 48px internal padding, 8px between inline UI elements. Navigation is a clean top bar, not sticky. The overall density is spacious and editorial — this reads more like a long-form article than a product page.

## Agent Prompt Guide

**Quick Color Reference**
- text: #0b2330 (Abyssal Ink)
- background: #faf9f8 (Bone)
- border: #e8e7e6 (Mist)
- accent: warm gradient (Dusk #efdcb6 → Ember #eba370 → Twilight #7d7a8f)
- primary action: #272420 (filled action)

**Example Component Prompts**

1. Create a Primary Action Button: #272420 background, #faf9f8 text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.


3. **Event Card Grid**: 4 cards in a horizontal row, each 100px border-radius, variable aspect ratio ~3:4. First card: warm gradient background (Dusk→Ember) with Bone text overlay. Second card: solid dark background (#141312) with Bone text. Third card: full-bleed photography of a person. Fourth card: light gradient (warm beige) with Abyssal Ink text. No borders, no shadows between cards. 24px gap between cards.

4. **Feature Section (text + visual)**: Two-column layout at 1200px max-width, left-aligned text in left column, visual in right column. 80px section gap above. Text: 40px ABC Diatype weight 500 heading in #0b2330, 16px body in #575653, 24px gap between heading and body. Visual: product screenshot inside 100px-radius card on Dusk→Twilight gradient.

5. **Logo Bar**: Full-width row, no container, no border. 6-8 client logos (Microsoft, Figma, DoorDash, Clay, Notion, Ramp style) evenly spaced in a single horizontal line, each in their native brand color. 48px vertical padding above and below.

## Similar Brands

- **Linear** — Same near-monochrome palette with a single dark accent, pill-shaped controls, and the same editorial restraint in typography choices
- **Notion** — Warm off-white canvas, hairline gray borders, generous spacing, and the same commitment to a single ink tone for all text and structural elements
- **Vercel** — Extreme typographic restraint, custom geometric sans at moderate weights, and the same refusal to use color as a primary differentiator
- **Attio** — Warm neutral palette, pill buttons, and the same editorial-product tension between restraint and warmth

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-abyssal-ink: #0b2330;
  --color-bone: #faf9f8;
  --color-obsidian: #141312;
  --color-espresso: #272420;
  --color-carbon: #000000;
  --color-ash: #f3f3f3;
  --color-mist: #e8e7e6;
  --color-vapor: #dddcd9;
  --color-pebble: #c4c4bc;
  --color-fog: #9a9a91;
  --color-smoke: #8f8d8b;
  --color-graphite: #6e6d6a;
  --color-slate: #575653;
  --color-coffee: #322e2a;
  --color-dusk: #efdcb6;
  --gradient-dusk: linear-gradient(rgb(239, 220, 182), rgb(235, 163, 126) 0%, rgb(125, 122, 143));
  --color-ember: #eba370;
  --color-twilight: #7d7a8f;

  /* Typography — Font Families */
  --font-tt-commons-pro: 'TT Commons Pro', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-abc-diatype: 'ABC Diatype', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.3;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-body-lg: 18px;
  --leading-body-lg: 1.5;
  --text-subheading: 24px;
  --leading-subheading: 1.3;
  --text-heading-sm: 32px;
  --leading-heading-sm: 1.2;
  --text-heading: 40px;
  --leading-heading: 1.2;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;

  /* Spacing */
  --spacing-unit: 8px;
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-88: 88px;
  --spacing-96: 96px;
  --spacing-128: 128px;
  --spacing-160: 160px;
  --spacing-224: 224px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 48px;
  --element-gap: 8px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-3xl: 32px;
  --radius-full: 100px;
  --radius-full-2: 1600px;

  /* Named Radii */
  --radius-nav: 32px;
  --radius-cards: 100px;
  --radius-badges: 4px;
  --radius-buttons: 32px;
  --radius-special-card: 1600px;
  --radius-feature-cards: 100px;

  /* Surfaces */
  --surface-bone-canvas: #faf9f8;
  --surface-ash-card: #f3f3f3;
  --surface-mist-divider: #e8e7e6;
  --surface-espresso-surface: #272420;
  --surface-coffee-depth: #322e2a;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-abyssal-ink: #0b2330;
  --color-bone: #faf9f8;
  --color-obsidian: #141312;
  --color-espresso: #272420;
  --color-carbon: #000000;
  --color-ash: #f3f3f3;
  --color-mist: #e8e7e6;
  --color-vapor: #dddcd9;
  --color-pebble: #c4c4bc;
  --color-fog: #9a9a91;
  --color-smoke: #8f8d8b;
  --color-graphite: #6e6d6a;
  --color-slate: #575653;
  --color-coffee: #322e2a;
  --color-dusk: #efdcb6;
  --color-ember: #eba370;
  --color-twilight: #7d7a8f;

  /* Typography */
  --font-tt-commons-pro: 'TT Commons Pro', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-abc-diatype: 'ABC Diatype', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.3;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-body-lg: 18px;
  --leading-body-lg: 1.5;
  --text-subheading: 24px;
  --leading-subheading: 1.3;
  --text-heading-sm: 32px;
  --leading-heading-sm: 1.2;
  --text-heading: 40px;
  --leading-heading: 1.2;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-88: 88px;
  --spacing-96: 96px;
  --spacing-128: 128px;
  --spacing-160: 160px;
  --spacing-224: 224px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-3xl: 32px;
  --radius-full: 100px;
  --radius-full-2: 1600px;
}
```
