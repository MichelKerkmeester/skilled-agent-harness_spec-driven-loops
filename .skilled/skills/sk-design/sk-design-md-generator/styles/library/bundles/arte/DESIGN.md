# arte* — Style Reference
> Golden hour harvest editorial — a cream canvas where sun-dappled forest photos meet oversized rounded display type, electric chartreuse logo, and warm copper text that feels printed rather than rendered.

**Theme:** light

arte* is a sunlit harvest editorial: a warm cream canvas (#e5dccd) hosts oversized display headlines in Parafina — a soft, slightly retro rounded sans at extreme sizes (70–173px) with crushed line-heights near 0.8–0.9 — while Poppins handles all secondary copy at a tight 1.4. The palette is farm-garden: burnt harvest copper (#ab5700) for primary text, a shocking chartreuse (#e8e359) for the logo and hero overlays, and a periwinkle (#7997ff) that acts as a cool counterweight for inline highlights. Imagery is the other half of the system — full-bleed golden-hour photography of forests, food, and faces, layered with display type rather than separated from it. Components are few and soft: pill buttons at 31px radius, 20px card radii, hairline borders, almost no shadows. The overall impression is a printed cookbook or farmers' market poster digitized — confident display type, earth-toned with one electric yellow accent, and the brand name itself ends in an asterisk that signals playful editorial mischief.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Wheat Cream | `#e5dccd` | `--color-wheat-cream` | Page canvas, card surfaces, section backgrounds — the warm off-white that holds every screen |
| Harvest Copper | `#ab5700` | `--color-harvest-copper` | Primary text, body copy, list borders, card borders, decorative strokes — the default ink color across all editorial content |
| Citron Beam | `#e8e359` | `--color-citron-beam` | Logotype color, hero text overlays, accent borders, icon highlights — the electric chartreuse that makes the brand pop against forest greens and cream |
| Morning Glory | `#7997ff` | `--color-morning-glory` | Inline text highlights, links, secondary icon accents, input focus — a cool periwinkle that cools the otherwise warm palette when it enters body copy |
| Amber Glow | `#d99623` | `--color-amber-glow` | List borders, secondary heading accents, warm decorative strokes |
| Forest Floor | `#214534` | `--color-forest-floor` | Button borders, body text on light accents, deep decorative strokes — a grounded dark green for contrast moments |
| Deep Moss | `#103d26` | `--color-deep-moss` | Darkest accent, background fills for contrasted blocks, depth shadows |
| Olive Branch | `#568037` | `--color-olive-branch` | List borders, tag accents, organic decorative strokes |
| Slate Bloom | `#3d549c` | `--color-slate-bloom` | Heading borders, muted decorative strokes, cool-tone secondary |
| Coral Petal | `#e99686` | `--color-coral-petal` | Soft fill washes, list surface tints, warm secondary backgrounds |

## Tokens — Typography

### Poppins — Body text, UI labels, navigation, buttons, list items, footer copy, input fields — a neutral geometric sans that stays quiet and functional at 12–16px. The 1.4 line-height with weight 400/500 gives body copy a slightly airy, readable feel without competing with the display headlines. · `--font-poppins`
- **Substitute:** Inter, DM Sans, or Manrope at 400/500
- **Weights:** 400, 500
- **Sizes:** 12px, 13px, 16px
- **Line height:** 1.40
- **Role:** Body text, UI labels, navigation, buttons, list items, footer copy, input fields — a neutral geometric sans that stays quiet and functional at 12–16px. The 1.4 line-height with weight 400/500 gives body copy a slightly airy, readable feel without competing with the display headlines.

### Parafina — Display and headings — a custom rounded retro display sans used at extreme sizes (up to 173px) with crushed line-heights (0.80–0.90). The weight-500 single-weight treatment at oversized scales is signature: the type feels playful, warm, and printed-poster rather than corporate. Appears in hero, section headlines, and the logotype itself. · `--font-parafina`
- **Substitute:** Bricolage Grotesque, Cabinet Grotesk, or Familjen Grotesk at weight 500 with optical sizing
- **Weights:** 500
- **Sizes:** 20px, 30px, 56px, 70px, 104px, 173px
- **Line height:** 0.80, 0.90, 1.00
- **Role:** Display and headings — a custom rounded retro display sans used at extreme sizes (up to 173px) with crushed line-heights (0.80–0.90). The weight-500 single-weight treatment at oversized scales is signature: the type feels playful, warm, and printed-poster rather than corporate. Appears in hero, section headlines, and the logotype itself.

### Arial — Arial — detected in extracted data but not described by AI · `--font-arial`
- **Weights:** 400
- **Sizes:** 13px
- **Line height:** 1.2
- **Role:** Arial — detected in extracted data but not described by AI

### ExposureTrial — ExposureTrial — detected in extracted data but not described by AI · `--font-exposuretrial`
- **Weights:** 500
- **Sizes:** 56px
- **Line height:** 0.9
- **Role:** ExposureTrial — detected in extracted data but not described by AI

### GTStandard-M — GTStandard-M — detected in extracted data but not described by AI · `--font-gtstandard-m`
- **Weights:** 500
- **Sizes:** 16px
- **Line height:** 1.5
- **Role:** GTStandard-M — detected in extracted data but not described by AI

### ITC_Avant_Garde_Gothic_Medium — ITC_Avant_Garde_Gothic_Medium — detected in extracted data but not described by AI · `--font-itcavantgardegothicmedium`
- **Weights:** 400
- **Sizes:** 26px
- **Line height:** 1.2
- **Role:** ITC_Avant_Garde_Gothic_Medium — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.4 | — | `--text-caption` |
| body | 16px | 1.4 | — | `--text-body` |
| subheading | 20px | 1 | — | `--text-subheading` |
| heading-sm | 30px | 0.9 | — | `--text-heading-sm` |
| heading | 56px | 0.9 | — | `--text-heading` |
| heading-lg | 70px | 0.85 | — | `--text-heading-lg` |
| display | 104px | 0.85 | — | `--text-display` |
| display-xl | 173px | 0.8 | — | `--text-display-xl` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 8 | 8px | `--spacing-8` |
| 12 | 12px | `--spacing-12` |
| 20 | 20px | `--spacing-20` |
| 24 | 24px | `--spacing-24` |
| 40 | 40px | `--spacing-40` |
| 56 | 56px | `--spacing-56` |
| 64 | 64px | `--spacing-64` |
| 80 | 80px | `--spacing-80` |
| 100 | 100px | `--spacing-100` |
| 140 | 140px | `--spacing-140` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 9999px |
| cards | 20px |
| other | 64px |
| buttons | 31px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80-120px
- **Card padding:** 24px
- **Element gap:** 24px

## Components

### Ghost Menu Button
**Role:** Navigation trigger in the hero overlay

Transparent background, 1px Citron Beam (#e8e359) border, Citron Beam text in Poppins 12–13px weight 500 uppercase, 31px border-radius (pill shape), 6px vertical / 24px horizontal padding. Floats over photographic hero with no background fill — the text and border alone define it.

### Hero Display Headline
**Role:** First-screen brand statement overlaid on photography

Parafina at 104–173px weight 500, line-height 0.80–0.85, Citron Beam (#e8e359) color. Sits directly over full-bleed nature photography with no text background or gradient — the color alone provides contrast against greens. The logotype 'arte*' itself is part of this treatment at the same scale.

### Editorial Subheadline
**Role:** Secondary hero text — the 'tagline' under the display

Parafina at 20–30px weight 500, line-height 0.90–1.00, Citron Beam color. Centrally aligned, sits 24–40px below the display headline. Uses the same display font at a smaller scale rather than switching to Poppins — this keeps the hero purely in the display voice.

### Section Display Headline
**Role:** Large editorial headline on cream sections

Parafina at 56–70px weight 500, line-height 0.85–0.90, Morning Glory (#7997ff) or Harvest Copper (#ab5700) color. Centered or left-aligned on the Wheat Cream canvas, with generous 80–120px top/bottom margin to create editorial breathing room. This is where the periwinkle blue enters the type system.

### Body Paragraph Block
**Role:** Long-form editorial copy in feature sections

Poppins 16px weight 400, line-height 1.40, Harvest Copper (#ab5700) as default text color. Maximum line length around 60–70 characters. Inline emphasis uses Morning Glory (#7997ff) color to highlight phrases like 'environment front-of-mind' without changing weight or style.

### Image-Text Editorial Block
**Role:** Full-width lifestyle photo with text beneath

Full-bleed or max-width image (rounded or sharp corners, generous sizing) followed by a body paragraph below with 40px gap. Image is treated as editorial illustration — people, food, nature — rather than product photography. Text block is left-aligned, max-width ~600px.

### Text-Link CTA
**Role:** Navigation to more content (e.g. 'MORE ON US')

Poppins 12–13px weight 500 uppercase, Harvest Copper or Morning Glory color, 31px border-radius pill border, 6px vertical / 24px horizontal padding, 1px border. No fill — the pill is an outline only. Often preceded by a small dot or arrow icon in the same color.

### Card
**Role:** Content cards on the cream canvas

20px border-radius, 1px Harvest Copper (#ab5700) border, 24px padding, Wheat Cream (#e5dccd) fill (same as canvas — the border defines the card). No shadows. Used sparingly — most content flows as editorial blocks rather than card grids.

### Pill Button
**Role:** Interactive controls throughout

31px border-radius (nearly full pill), 6px vertical / 24px horizontal padding, Poppins 12–13px weight 500 uppercase. Available in ghost (transparent fill, colored border + text in Citron Beam or Harvest Copper) or filled (Citron Beam #e8e359 fill with dark text). The 31px radius — not a full 9999px pill — is distinctive; it gives a soft, friendly shape without becoming a full stadium.

### Scroll Indicator
**Role:** Subtle prompt below hero to scroll

Small monospace or Poppins text '[scroll down]' in Citron Beam, centered, positioned at the bottom edge of the hero. Minimal, 12px, no animation implied — just quiet typographic signage.

### Inline Color Highlight
**Role:** Emphasized phrases within body copy

A technique rather than a component: select phrases within Harvest Copper body text switch to Morning Glory (#7997ff) color while keeping the same Poppins 16px weight 400 — the color change alone draws the eye without bolding, italicizing, or underlining. This is how links and emphasis integrate naturally into editorial prose.

## Do's and Don'ts

### Do
- Use Parafina (or Bricolage Grotesque substitute) at weight 500 for all display and heading text — never go above 500 or below 500, the single-weight treatment is signature
- Apply Citron Beam (#e8e359) as the hero overlay text color against full-bleed nature photography — the chartreuse against forest green is the brand's most recognizable visual moment
- Set display type at line-height 0.80–0.90 — the crushed leading is essential; never let display headlines breathe with 1.2+ line-height
- Use Morning Glory (#7997ff) for inline text highlights within Harvest Copper body copy — color is the emphasis, not weight or style changes
- Default all body and list text to Harvest Copper (#ab5700) — this is the brand's ink color, not black or gray
- Apply 31px border-radius to all interactive elements (buttons, links, menu triggers) — not 9999px, not 8px; the 31px soft-pill is the system radius
- Place full-bleed editorial photography as a surface layer with display type directly overlaid — never put text in a box on top of photos

### Don't
- Do not use Arial, Helvetica, or any system font for headings — Parafina at extreme sizes is the brand's primary identity
- Do not use black (#000000) or dark gray for body text — Harvest Copper (#ab5700) is the default ink
- Do not apply drop shadows, blurs, or elevation to cards or buttons — depth comes from photography and whitespace, not shadow
- Do not use tight 12-column card grids for content — editorial sections flow as single-column blocks with large display type
- Do not exceed 500 weight in Parafina — no bolding, no black weight; the display is always at one weight
- Do not use blue or gray for the page background — Wheat Cream (#e5dccd) is the only canvas
- Do not add gradient overlays, vignette effects, or text-background boxes on hero photography — Citron Beam type sits directly on the image

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Wheat Cream Canvas | `#e5dccd` | Default page background — warm off-white that receives all editorial content |
| 1 | Photographic Full-Bleed | `#1a3a1a` | Hero and feature sections use full-bleed photography as the surface itself; type overlays directly |
| 2 | Card Surface | `#e5dccd` | Cards sit on the same cream canvas, distinguished by 20px radius and hairline Harvest Copper borders |

## Elevation

No shadows. The design system deliberately avoids drop shadows, blurs, and elevation stacks. Depth is created through full-bleed photography, generous whitespace, and 1px hairline borders in Harvest Copper. Surfaces are flat — the cream canvas is the only surface, and cards are defined by their outline, not by floating above the page.

## Imagery

Full-bleed golden-hour lifestyle photography is central to the visual identity. Imagery includes: sun-dappled forest canopies with light streaming through leaves (hero), overhead and angled shots of people gathered around dining tables with colorful food, and warm-toned portraits of diverse groups. Photography is high-key, warm-saturated, and naturalistic — no studio product shots, no stock-photo flatness. Images are treated as surfaces, not illustrations: they span edge-to-edge with display type overlaid directly, sometimes with the image bleeding under the next section. No icon system beyond small accent dots and arrows; no illustrations, no abstract graphics, no 3D renders. The photography IS the visual system alongside the display type.

## Layout

Full-bleed hero with overlaid centered display type, then transitions to a centered single-column editorial flow on the Wheat Cream canvas. Sections are separated by generous 80–120px vertical gaps rather than dividers or alternating background bands. Below the hero, content follows an image-then-text or text-then-image pattern: large display headline, generous breathing room, a full-width or large-format photograph, then a left-aligned body paragraph below. No sidebar navigation, no card grids, no multi-column feature matrices. Navigation is minimal: a single ghost 'MENU' button in the top-right corner of the hero. The overall page rhythm is: loud (full-bleed photo + huge type) → quiet (cream canvas + centered headline) → warm (photo + editorial body text) → quiet, repeating. Page max-width is approximately 1200px for text and image blocks, though hero photography breaks this to full viewport width.

## Agent Prompt Guide

**Quick Color Reference**
- text: #ab5700 (Harvest Copper)
- background: #e5dccd (Wheat Cream)
- border: #ab5700 (Harvest Copper, 1px hairline)
- accent: #e8e359 (Citron Beam)
- secondary accent: #7997ff (Morning Glory)
- primary action: #e8e359 (filled action)

**Example Component Prompts:**
1. **Hero Section**: Full-bleed forest canopy photograph as background. Overlaid centered display type in Parafina (or Bricolage Grotesque substitute) weight 500, 120px, line-height 0.85, color #e8e359, reading 'arte*'. Below it, a 24px gap, then subheadline at 28px Parafina weight 500, line-height 1.0, also #e8e359. Top-right: ghost 'MENU' pill button — transparent fill, 1px #e8e359 border, 31px radius, 6px 24px padding, Poppins 13px weight 500 uppercase #e8e359 text.

2. **Section Headline**: Centered on Wheat Cream (#e5dccd) canvas. Parafina 64px weight 500, line-height 0.90, color #7997ff. 80px top padding, 80px bottom padding, max-width 800px centered.

3. **Editorial Image-Text Block**: Full-width photograph (people at a table, 1200px max-width, no border-radius or 20px if contained). 40px gap below. Body paragraph: Poppins 16px weight 400, line-height 1.40, color #ab5700, max-width 620px, left-aligned. One phrase within the paragraph switches to #7997ff color for emphasis.

4. **Ghost Pill Link Button**: Transparent background, 1px Harvest Copper (#ab5700) border, 31px border-radius, 6px vertical / 24px horizontal padding, Poppins 13px weight 500 uppercase #ab5700 text. Preceded by a small 8px dot in the same color.

5. **Card on Cream Canvas**: 20px border-radius, 1px #ab5700 border, 24px padding, #e5dccd fill. Poppins 16px weight 400 #ab5700 body text. No shadow, no fill change — the border alone defines the card edge against the same-colored canvas.

## Similar Brands

- **Oatly** — Same warm cream canvas with oversized playful display type and full-bleed lifestyle photography; both use a single bold accent color against earth tones and rely on editorial poster-style typography rather than UI chrome
- **Yolélé** — Full-bleed nature and food photography with large centered display headlines overlaid, warm earth-tone palette, and minimal ghost-pill navigation buttons
- **Sweetgreen** — Farm-to-table brand language with warm cream surfaces, lifestyle photography as the primary visual element, and minimal UI components — though arte* leans more editorial and less grid-based
- **Farmacy** — Warm botanical brand palette with cream backgrounds, organic rounded display type, and a single bright accent color (chartreuse in arte*, green in Farmacy) used against natural photography

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-wheat-cream: #e5dccd;
  --color-harvest-copper: #ab5700;
  --color-citron-beam: #e8e359;
  --color-morning-glory: #7997ff;
  --color-amber-glow: #d99623;
  --color-forest-floor: #214534;
  --color-deep-moss: #103d26;
  --color-olive-branch: #568037;
  --color-slate-bloom: #3d549c;
  --color-coral-petal: #e99686;

  /* Typography — Font Families */
  --font-poppins: 'Poppins', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-parafina: 'Parafina', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-arial: 'Arial', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-exposuretrial: 'ExposureTrial', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-gtstandard-m: 'GTStandard-M', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-itcavantgardegothicmedium: 'ITC_Avant_Garde_Gothic_Medium', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.4;
  --text-body: 16px;
  --leading-body: 1.4;
  --text-subheading: 20px;
  --leading-subheading: 1;
  --text-heading-sm: 30px;
  --leading-heading-sm: 0.9;
  --text-heading: 56px;
  --leading-heading: 0.9;
  --text-heading-lg: 70px;
  --leading-heading-lg: 0.85;
  --text-display: 104px;
  --leading-display: 0.85;
  --text-display-xl: 173px;
  --leading-display-xl: 0.8;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-40: 40px;
  --spacing-56: 56px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-100: 100px;
  --spacing-140: 140px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80-120px;
  --card-padding: 24px;
  --element-gap: 24px;

  /* Border Radius */
  --radius-2xl: 20px;
  --radius-3xl: 31px;
  --radius-full: 64px;

  /* Named Radii */
  --radius-tags: 9999px;
  --radius-cards: 20px;
  --radius-other: 64px;
  --radius-buttons: 31px;

  /* Surfaces */
  --surface-wheat-cream-canvas: #e5dccd;
  --surface-photographic-full-bleed: #1a3a1a;
  --surface-card-surface: #e5dccd;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-wheat-cream: #e5dccd;
  --color-harvest-copper: #ab5700;
  --color-citron-beam: #e8e359;
  --color-morning-glory: #7997ff;
  --color-amber-glow: #d99623;
  --color-forest-floor: #214534;
  --color-deep-moss: #103d26;
  --color-olive-branch: #568037;
  --color-slate-bloom: #3d549c;
  --color-coral-petal: #e99686;

  /* Typography */
  --font-poppins: 'Poppins', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-parafina: 'Parafina', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-arial: 'Arial', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-exposuretrial: 'ExposureTrial', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-gtstandard-m: 'GTStandard-M', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-itcavantgardegothicmedium: 'ITC_Avant_Garde_Gothic_Medium', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.4;
  --text-body: 16px;
  --leading-body: 1.4;
  --text-subheading: 20px;
  --leading-subheading: 1;
  --text-heading-sm: 30px;
  --leading-heading-sm: 0.9;
  --text-heading: 56px;
  --leading-heading: 0.9;
  --text-heading-lg: 70px;
  --leading-heading-lg: 0.85;
  --text-display: 104px;
  --leading-display: 0.85;
  --text-display-xl: 173px;
  --leading-display-xl: 0.8;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-40: 40px;
  --spacing-56: 56px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-100: 100px;
  --spacing-140: 140px;

  /* Border Radius */
  --radius-2xl: 20px;
  --radius-3xl: 31px;
  --radius-full: 64px;
}
```
