# Jasper — Style Reference
> serif headlines over a pastel tile mosaic

**Theme:** light

Jasper reads like an editorial print magazine that learned to ship software. The canvas is pure white, the type is a high-contrast serif (Feature) set tight and tall, and the only structural color is a near-black midnight navy that does duty as both ink and filled button surface. Around that disciplined spine, the design opens up a toy box: pastel card backgrounds in coral, mint, sky, butter, and lilac, each carrying flat geometric illustrations on faint grid textures. The rhythm is generous — breathing room between sections, small-caps eyebrow labels above each headline, and two-button CTAs that pair a quiet outline with a confident filled action. Everything else stays out of the way: no shadows, no gradients, no decorative chrome, just ink, paper, and the occasional pop of color as functional punctuation.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Midnight Ink | `#00063d` | `--color-midnight-ink` | Violet supporting accent for decorative details and low-frequency emphasis. Do not promote it to the primary CTA color |
| Signal Coral | `#fa4028` | `--color-signal-coral` | Accent links, inline emphasis, illustrative highlights — vivid warm coral that cuts through the pastel system |
| Merlot | `#5a003c` | `--color-merlot` | Decorative icon accent, tag text, secondary brand touch — deep wine magenta used sparingly for typographic and icon moments |
| Forest Floor | `#103a00` | `--color-forest-floor` | Green supporting accent for decorative details and low-frequency emphasis. Use as a supporting accent, not as a status color |
| Ember | `#fa7560` | `--color-ember` | Card backgrounds, warm tag fills, soft section washes — pastel coral sibling of Signal Coral |
| Coral Mist | `#ffe8e2` | `--color-coral-mist` | Soft card surface, badge fill — near-white coral wash for warm category cards |
| Sky | `#0095ff` | `--color-sky` | Card accents, illustration strokes, icon highlights — vivid blue used as a cool counterpoint in the pastel palette |
| Sky Mist | `#ceebff` | `--color-sky-mist` | Gray supporting accent for decorative details and low-frequency emphasis |
| Mint | `#45ff00` | `--color-mint` | Card accents and illustration strokes — vivid electric green used as playful punctuation |
| Mint Mist | `#e6ffd9` | `--color-mint-mist` | Soft green card surface — pale mint wash for category cards |
| Butter | `#fff67d` | `--color-butter` | Yellow supporting accent for decorative details and low-frequency emphasis. Use as a supporting accent, not as a status color |
| Buttercream | `#fffbb7` | `--color-buttercream` | Pale card surface, subtle section wash — cream yellow |
| Lilac | `#7c5ac4` | `--color-lilac` | Decorative icon and illustration accent — vivid violet used in flat graphics |
| Lilac Mist | `#e7e3f7` | `--color-lilac-mist` | Pale lilac card surface — wash for cool category cards |
| Blush | `#ffb3de` | `--color-blush` | Decorative badge fill, soft pink wash — mid-saturation pink |
| Blush Veil | `#ffe6f3` | `--color-blush-veil` | Pale pink card surface and badge background |
| Paper | `#ffffff` | `--color-paper` | Page canvas, card surfaces, button text on dark fills |
| Bone | `#f9f9f9` | `--color-bone` | Alternate card surface, subtle section background |
| Shell | `#fff7f5` | `--color-shell` | Warm-tinted card surface, badge fill with coral undertones |
| Graphite | `#5e5d5f` | `--color-graphite` | Muted icon stroke, secondary text, illustration outline — neutral gray for graphic line work |
| Cream | `#fffdd9` | `--color-cream` | Warm section wash — pale cream surface for alternating bands |

## Tokens — Typography

### Feature — Display and headline serif; used at 80px for hero statements, 54px for section openers, 38px for sub-sections, and 20–28px for editorial card titles. Custom high-contrast serif with extremely tight tracking (-0.030em at display) that gives headlines a magazine-cover confidence rather than a typical SaaS shout. · `--font-feature`
- **Substitute:** DM Serif Display, Playfair Display, or Tiempos Headline
- **Weights:** 450
- **Sizes:** 20px, 24px, 28px, 38px, 54px, 80px
- **Line height:** 1.00–1.10
- **Letter spacing:** -0.0300em, -0.0200em, -0.0100em
- **Role:** Display and headline serif; used at 80px for hero statements, 54px for section openers, 38px for sub-sections, and 20–28px for editorial card titles. Custom high-contrast serif with extremely tight tracking (-0.030em at display) that gives headlines a magazine-cover confidence rather than a typical SaaS shout.

### ABC ROM — Primary body and UI sans; weight 450 for body copy and buttons, 500 for subheads, 700 for emphasis. Tight tracking (-0.010em) gives it a compact, typeset quality — it sits close to the serif without competing. · `--font-abc-rom`
- **Substitute:** Inter, Söhne, or DM Sans
- **Weights:** 450, 500, 700
- **Sizes:** 14px, 16px, 18px, 28px
- **Line height:** 1.20–1.40
- **Letter spacing:** -0.0100em
- **Role:** Primary body and UI sans; weight 450 for body copy and buttons, 500 for subheads, 700 for emphasis. Tight tracking (-0.010em) gives it a compact, typeset quality — it sits close to the serif without competing.

### ABC ROM Mono — Code snippets, technical labels, and monospaced micro-copy. Same tracking as ABC ROM (-0.010em) so it aligns visually in mixed-type compositions. · `--font-abc-rom-mono`
- **Substitute:** JetBrains Mono or IBM Plex Mono
- **Weights:** 450
- **Sizes:** 14px, 16px
- **Line height:** 1.20
- **Letter spacing:** -0.0100em
- **Role:** Code snippets, technical labels, and monospaced micro-copy. Same tracking as ABC ROM (-0.010em) so it aligns visually in mixed-type compositions.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 14px | 1 | -0.14px | `--text-caption` |
| body-sm | 16px | 1.2 | -0.16px | `--text-body-sm` |
| body | 18px | 1.4 | -0.18px | `--text-body` |
| subheading | 24px | 1.1 | -0.24px | `--text-subheading` |
| heading-sm | 28px | 1.1 | -0.28px | `--text-heading-sm` |
| heading | 38px | 1.1 | -0.76px | `--text-heading` |
| heading-lg | 54px | 1.05 | -1.08px | `--text-heading-lg` |
| display | 80px | 1 | -2.4px | `--text-display` |

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
| 32 | 32px | `--spacing-32` |
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |
| 80 | 80px | `--spacing-80` |
| 96 | 96px | `--spacing-96` |
| 100 | 100px | `--spacing-100` |
| 108 | 108px | `--spacing-108` |
| 112 | 112px | `--spacing-112` |
| 164 | 164px | `--spacing-164` |
| 240 | 240px | `--spacing-240` |

### Border Radius

| Element | Value |
|---------|-------|
| all | 4px |
| cards | 4px |
| badges | 4px |
| buttons | 4px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80-100px
- **Card padding:** 24-32px
- **Element gap:** 8-12px

## Components

### Primary CTA Button
**Role:** Main action button — "Get A Demo" and "Explore The Platform"

Filled Midnight Ink (#00063d) background, white text, ABC ROM 16px weight 500, letter-spacing -0.16px, padding 12px 24px, border-radius 4px. No shadow, no border. Sits as the dominant action in a two-button pair.

### Secondary Outline Button
**Role:** Companion action — "Start Free Trial"

White background, 1px Midnight Ink border, Midnight Ink text. Same typography and padding as the primary CTA. Pairs left of the filled button in hero and section CTAs.

### Navigation Bar
**Role:** Top-level site navigation

White background, height ~64px, border-bottom none. Left: Jasper wordmark in Signal Coral (#fa4028). Center: ABC ROM 14px weight 500 nav links in Midnight Ink. Right: "Log In" text link, "Free Trial" text link, then filled Midnight Ink "Get A Demo" button. Nav items spaced with ~33px horizontal gaps.

### Announcement Banner
**Role:** Inline promotion above the hero

Centered pill-style banner with a pale green (#e6ffd9) badge reading "New research!" in Forest Floor text, followed by Midnight Ink copy "The State of AI in Marketing 2026. Download now →" in ABC ROM 16px. Subtle, not loud.

### Eyebrow Label
**Role:** Section category label above headlines

ABC ROM 16px weight 500, Midnight Ink text, used in phrases like "The Jasper Platform". Sits centered or left-aligned above the serif heading with ~12-16px gap below. Functions as a quiet section signpost.

### Feature Category Card (Green)
**Role:** Pastel category card — Agents

Mint Mist (#e6ffd9) background, 4px radius, padding 32px. Contains a flat illustration in Mint (#45ff00) and Forest Floor strokes on a faint grid texture, a serif heading, body copy in Midnight Ink, and a right-arrow affordance. Card spans one column in a 3-column grid.

### Feature Category Card (Coral)
**Role:** Pastel category card — Content Pipelines

Coral Mist (#ffe8e2) background, 4px radius, padding 32px. Flat illustration in Signal Coral and Midnight Ink strokes on grid texture. Same structure as the green variant — only the wash and illustration palette shift.

### Feature Category Card (Blue)
**Role:** Pastel category card — Jasper IQ

Sky Mist (#ceebff) background, 4px radius, padding 32px. Flat illustration in Sky (#0095ff) and Midnight Ink strokes on grid texture.

### Logo Strip
**Role:** Social proof — "World-class marketing teams trust Jasper"

Centered ABC ROM 16px label in Midnight Ink, followed by a single row of 6 grayscale partner logos evenly spaced. Logos render in Graphite (#5e5d5f) or pure black, no color treatment, equal optical sizing.

### Hero Illustration Block
**Role:** Visual hero element with person and decorative grid

Composite illustration: photographic portrait of a person layered over a flat geometric tile grid in Signal Coral, Butter, and Coral Mist. Decorative stat callouts in white pills with Midnight Ink text ("+35% Pipeline") overlay the composition. Sits below the centered hero text block.

### Section Heading Block
**Role:** Centered section opener

Eyebrow label → Feature serif heading at 54px / line-height 1.05 / letter-spacing -1.08px in Midnight Ink → body paragraph in ABC ROM 18px weight 450 → optional filled CTA button below. Centered alignment, max-width ~700px for the text block.

### Split Content Section
**Role:** Text + visual two-column block

Left column: serif heading (38px) + body copy + optional CTA. Right column: illustration or UI mockup with thin 1px border in near-black, 4px radius. Generous gap (80px) between columns. Used for "Why modern marketing teams choose Jasper" pattern.

### Tag Badge
**Role:** Inline category or status tag

Small pill or rounded rectangle with 4px radius, padding 2px 8px. Background is a pastel wash (Coral Mist, Sky Mist, Mint Mist, Butter, Lilac Mist), text is the matching deep shade (Merlot, Forest Floor, Midnight Ink). ABC ROM 14px weight 500.

## Do's and Don'ts

### Do
- Set all headlines in Feature serif at 38–80px with line-height ≤ 1.10 and letter-spacing between -0.020em and -0.030em — the tight tracking is what makes the type feel editorial.
- Use Midnight Ink (#00063d) for all body text, headings, and filled CTAs — it is the only color that should carry structural weight.
- Pair every primary CTA with a secondary outline button of identical size; never use a single-button CTA in hero or section openers.
- Build category cards on pastel washes from the defined palette (Coral Mist, Sky Mist, Mint Mist, Buttercream, Lilac Mist, Blush Veil) with 4px radius and 24–32px padding — never use white or gray for these cards.
- Add a small-caps eyebrow label in ABC ROM 16px above every section heading, centered or left-aligned to match the heading.
- Keep all borders, badges, and buttons at 4px radius — do not introduce rounded pills or larger curves; the sharp 4px is part of the identity.
- Use the vivid accent colors (Signal Coral, Sky, Mint, Lilac) only inside illustrations and icon strokes on the pastel card surfaces, never as backgrounds for UI chrome.

### Don't
- Do not set body or UI text in the serif Feature font — reserve it exclusively for display and section headings.
- Do not use shadows, gradients, or glow effects on any element — the design is flat by conviction, not by omission.
- Do not introduce colors outside the defined palette for new components, even if they are common SaaS neutrals like slate or zinc.
- Do not set display headings with normal or positive letter-spacing — the negative tracking (-0.020em to -0.030em) is signature.
- Do not use the pastel card washes as page or section backgrounds at full width — they belong only on contained card surfaces.
- Do not render CTA buttons in Signal Coral, Sky, or any accent color — Midnight Ink is the only button fill.
- Do not add large border-radius values (8px, 12px, 9999px) to buttons, cards, or badges — the 4px sharp-corner system is deliberate.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Paper | `#ffffff` | Primary page canvas and default card surface |
| 2 | Bone | `#f9f9f9` | Alternate card surface for subtle contrast |
| 3 | Shell | `#fff7f5` | Warm-tinted card surface for coral-category contexts |
| 4 | Cream | `#fffdd9` | Warm section wash for alternating bands |

## Imagery

Imagery is a deliberate mix of flat editorial illustration and tightly cropped photography. The signature motif is geometric tile-grid patterns in pastel coral, butter, and mint that act as a backdrop layer behind photographic portraits — the person sits on top of an abstract color field, not in a real environment. Illustrations on the category cards are flat, outlined-and-filled geometric compositions (arrows, nodes, document shapes, atomic orbitals) drawn in a single vivid accent color plus Midnight Ink, set against the matching pastel wash with a faint grid texture. Photography is high-key, candid-style portraiture with no lifestyle staging. Icons throughout the UI are mono-stroke in Graphite (#5e5d5f) or Midnight Ink, simple geometric forms with consistent 1.5–2px stroke weight. The overall density is text-dominant; imagery appears in hero, category cards, and split sections, never as full-bleed background.

## Layout

Pages are max-width 1200px centered on a pure white canvas with generous vertical breathing room (80–100px between major sections). The hero is a centered text block — small announcement pill, then a large serif headline at 80px, then body copy, then a two-button CTA pair — followed by a full-width illustrated hero block with a portrait over a pastel tile grid. Below the hero, a single-row logo strip breaks the white space, then sections alternate between centered editorial openers (eyebrow + serif heading + paragraph + optional CTA) and split text-plus-illustration two-column blocks. A recurring pattern is a 3-column equal-width card grid for category features, each card on a different pastel wash. Navigation is a single top bar, non-sticky, with no mega-menu — just flat link lists and a right-aligned CTA. Sections flow seamlessly without dividers or color bands; the pastel card surfaces create the only visual separation between content blocks.

## Agent Prompt Guide

**Quick Color Reference**
- text: #00063d (Midnight Ink)
- background: #ffffff (Paper)
- border: #00063d at 1px for outlined controls
- accent: #fa4028 (Signal Coral) for links and inline emphasis
- pastel card surface: #ffe8e2 (Coral Mist) or #ceebff (Sky Mist) or #e6ffd9 (Mint Mist)
- primary action: no distinct CTA color

**Example Component Prompts**

1. **Hero section**: White (#ffffff) background, centered. Announcement pill with #e6ffd9 background, "New research!" in #103a00 at ABC ROM 14px weight 500, 4px radius, 2px 8px padding. Headline at 80px Feature weight 450, #00063d, line-height 1.00, letter-spacing -2.4px. Body subtext at 18px ABC ROM weight 450, #00063d, line-height 1.40. Two buttons centered with 12px gap: outlined button (white bg, 1px #00063d border, #00063d text, ABC ROM 16px weight 500, 4px radius, 12px 24px padding) and filled button (#00063d bg, white text, same typography and padding). Below: full-width illustrated hero with a portrait over a pastel tile grid in #fa4028, #fff67d, #ffe8e2.

2. **Category feature card**: Background #e6ffd9 (Mint Mist), 4px radius, 32px padding. Flat illustration at top using #45ff00 and #103a00 strokes on a faint grid texture. Serif heading at 24px Feature weight 450, #00063d, letter-spacing -0.24px. Body at 16px ABC ROM weight 450, #00063d. Right-arrow affordance in #00063d at bottom-right.

No distinct primary action color was observed; use the extracted neutral button treatments instead of inventing a filled CTA color.

4. **Logo strip**: White background, centered. Label "World-class marketing teams trust Jasper" at 16px ABC ROM weight 500, #00063d. Single row of 6 partner logos in #5e5d5f (Graphite), evenly spaced with ~33px horizontal gaps, equal optical height (~24px tall).

5. **Split content section**: White background, 2-column grid with 80px gap. Left column: heading at 38px Feature weight 450, #00063d, line-height 1.10, letter-spacing -0.76px, followed by body at 18px ABC ROM weight 450. Right column: UI mockup illustration with 1px #00063d border, 4px radius, white interior.

## Similar Brands

- **Linear** — Same disciplined near-black primary on pure white, tight sans-serif UI, and flat illustration accents — Linear shares Jasper's editorial confidence and restraint
- **Notion** — Pastel card surfaces with flat geometric illustrations and a clean serif/sans type pairing — Notion's category cards echo Jasper's Mint/Coral/Sky washes
- **Anthropic** — High-contrast serif display headlines (GT Super / Tiempos family) set tight over a white canvas with a near-black primary — same magazine-on-the-web atmosphere
- **Pitch** — Editorial typography choices, generous whitespace, and pastel accent washes on category cards — Pitch treats marketing pages the way Jasper does
- **Retool** — Confident serif headlines paired with a flat colorful illustration system and a single dark-ink brand color for all structural UI

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-midnight-ink: #00063d;
  --color-signal-coral: #fa4028;
  --color-merlot: #5a003c;
  --color-forest-floor: #103a00;
  --color-ember: #fa7560;
  --color-coral-mist: #ffe8e2;
  --color-sky: #0095ff;
  --color-sky-mist: #ceebff;
  --color-mint: #45ff00;
  --color-mint-mist: #e6ffd9;
  --color-butter: #fff67d;
  --color-buttercream: #fffbb7;
  --color-lilac: #7c5ac4;
  --color-lilac-mist: #e7e3f7;
  --color-blush: #ffb3de;
  --color-blush-veil: #ffe6f3;
  --color-paper: #ffffff;
  --color-bone: #f9f9f9;
  --color-shell: #fff7f5;
  --color-graphite: #5e5d5f;
  --color-cream: #fffdd9;

  /* Typography — Font Families */
  --font-feature: 'Feature', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-abc-rom: 'ABC ROM', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-abc-rom-mono: 'ABC ROM Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1;
  --tracking-caption: -0.14px;
  --text-body-sm: 16px;
  --leading-body-sm: 1.2;
  --tracking-body-sm: -0.16px;
  --text-body: 18px;
  --leading-body: 1.4;
  --tracking-body: -0.18px;
  --text-subheading: 24px;
  --leading-subheading: 1.1;
  --tracking-subheading: -0.24px;
  --text-heading-sm: 28px;
  --leading-heading-sm: 1.1;
  --tracking-heading-sm: -0.28px;
  --text-heading: 38px;
  --leading-heading: 1.1;
  --tracking-heading: -0.76px;
  --text-heading-lg: 54px;
  --leading-heading-lg: 1.05;
  --tracking-heading-lg: -1.08px;
  --text-display: 80px;
  --leading-display: 1;
  --tracking-display: -2.4px;

  /* Typography — Weights */
  --font-weight-w450: 450;
  --font-weight-medium: 500;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-80: 80px;
  --spacing-96: 96px;
  --spacing-100: 100px;
  --spacing-108: 108px;
  --spacing-112: 112px;
  --spacing-164: 164px;
  --spacing-240: 240px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80-100px;
  --card-padding: 24-32px;
  --element-gap: 8-12px;

  /* Border Radius */
  --radius-md: 4px;

  /* Named Radii */
  --radius-all: 4px;
  --radius-cards: 4px;
  --radius-badges: 4px;
  --radius-buttons: 4px;

  /* Surfaces */
  --surface-paper: #ffffff;
  --surface-bone: #f9f9f9;
  --surface-shell: #fff7f5;
  --surface-cream: #fffdd9;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-midnight-ink: #00063d;
  --color-signal-coral: #fa4028;
  --color-merlot: #5a003c;
  --color-forest-floor: #103a00;
  --color-ember: #fa7560;
  --color-coral-mist: #ffe8e2;
  --color-sky: #0095ff;
  --color-sky-mist: #ceebff;
  --color-mint: #45ff00;
  --color-mint-mist: #e6ffd9;
  --color-butter: #fff67d;
  --color-buttercream: #fffbb7;
  --color-lilac: #7c5ac4;
  --color-lilac-mist: #e7e3f7;
  --color-blush: #ffb3de;
  --color-blush-veil: #ffe6f3;
  --color-paper: #ffffff;
  --color-bone: #f9f9f9;
  --color-shell: #fff7f5;
  --color-graphite: #5e5d5f;
  --color-cream: #fffdd9;

  /* Typography */
  --font-feature: 'Feature', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-abc-rom: 'ABC ROM', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-abc-rom-mono: 'ABC ROM Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1;
  --tracking-caption: -0.14px;
  --text-body-sm: 16px;
  --leading-body-sm: 1.2;
  --tracking-body-sm: -0.16px;
  --text-body: 18px;
  --leading-body: 1.4;
  --tracking-body: -0.18px;
  --text-subheading: 24px;
  --leading-subheading: 1.1;
  --tracking-subheading: -0.24px;
  --text-heading-sm: 28px;
  --leading-heading-sm: 1.1;
  --tracking-heading-sm: -0.28px;
  --text-heading: 38px;
  --leading-heading: 1.1;
  --tracking-heading: -0.76px;
  --text-heading-lg: 54px;
  --leading-heading-lg: 1.05;
  --tracking-heading-lg: -1.08px;
  --text-display: 80px;
  --leading-display: 1;
  --tracking-display: -2.4px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-80: 80px;
  --spacing-96: 96px;
  --spacing-100: 100px;
  --spacing-108: 108px;
  --spacing-112: 112px;
  --spacing-164: 164px;
  --spacing-240: 240px;

  /* Border Radius */
  --radius-md: 4px;
}
```
