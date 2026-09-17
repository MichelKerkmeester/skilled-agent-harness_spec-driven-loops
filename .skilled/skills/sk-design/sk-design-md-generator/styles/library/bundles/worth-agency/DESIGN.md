# Worth Agency — Style Reference
> studio gallery at golden hour

**Theme:** light

Worth Agency uses an editorial-gallery language: a single warm blush field introduces the brand, then the page surrenders to white space and type. The only chromatic accent is a vivid vermilion (#eb4726) — it marks the colossal custom wordmark, every link underline, and every arrow, making the entire site feel like one typographic gesture. Components are minimal and pill-shaped; a floating top-center tag is the entire navigation system, and there are no buttons anywhere — only underlined text. The aesthetic is confident restraint at exhibition scale: 400px display next to 16px body, flat color blocking instead of shadows, blush and white alternating like gallery walls.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Blush Field | `#f8d4d4` | `--color-blush-field` | Hero section background, full-bleed section dividers, decorative border washes — the warm pastel that sets the emotional temperature for the whole site |
| Vermilion Mark | `#eb4726` | `--color-vermilion-mark` | Sole chromatic accent — brand wordmark, link underlines, arrow icons, scroll indicator. One warm note against all the near-monochrome |
| Mint Accent | `#d2fdd1` | `--color-mint-accent` | Rare card or section background — the only cool note permitted, used sparingly for tonal variety |
| Charcoal Ink | `#282828` | `--color-charcoal-ink` | Primary body text, heading text, default borders, icon strokes — the workhorse warm-black neutral |
| Pure White | `#ffffff` | `--color-pure-white` | Card surfaces, content section backgrounds, floating pill nav fill |
| Jet Black | `#000000` | `--color-jet-black` | Strong borders, high-emphasis text, icon fills — the maximum-contrast neutral |
| Bone Gray | `#f9f9f9` | `--color-bone-gray` | Subtle off-white surface for nested content blocks beneath white sections |

## Tokens — Typography

### custom_47163 — Primary body and heading face — used for all UI text, section headlines, links, and the scroll indicator. The custom face brings a distinctive ampersand ligature and a slightly humanist warmth that keeps the editorial tone approachable rather than austere. Substitutes: Söhne, GT America, Maison Neue. · `--font-custom47163`
- **Substitute:** Söhne
- **Weights:** 400, 500, 600
- **Sizes:** 16, 22, 28, 42, 52px
- **Line height:** 1.27–1.50
- **Letter spacing:** -0.006em universally, ranging from -0.096px at 16px body to -0.312px at 52px heading-lg
- **OpenType features:** `"dlig" 0, "hlig" 0, "liga" 0, "rlig" 0, "smcp" 0`
- **Role:** Primary body and heading face — used for all UI text, section headlines, links, and the scroll indicator. The custom face brings a distinctive ampersand ligature and a slightly humanist warmth that keeps the editorial tone approachable rather than austere. Substitutes: Söhne, GT America, Maison Neue.

### custom_47178 — Exclusive display wordmark face — the 'Worth' hero text only. A custom commissioned face at exhibition scale with extreme tight tracking. This is the signature element: no other text on the site approaches this scale. Substitutes: Söhne Breit, GT America Compressed, Druk Wide. · `--font-custom47178`
- **Substitute:** Söhne Breit
- **Weights:** 400
- **Sizes:** 400px
- **Line height:** 0.75
- **Letter spacing:** -0.011em (-4.4px at 400px)
- **OpenType features:** `"dlig" 0, "hlig" 0, "liga" 0, "rlig" 0, "smcp" 0`
- **Role:** Exclusive display wordmark face — the 'Worth' hero text only. A custom commissioned face at exhibition scale with extreme tight tracking. This is the signature element: no other text on the site approaches this scale. Substitutes: Söhne Breit, GT America Compressed, Druk Wide.

### -apple-system — System font fallback for icons, the small 'Agency' label in the floating pill, and micro-UI elements where the custom face isn't loaded. Kept neutral so the custom face can carry all the brand expression. · `--font-apple-system`
- **Substitute:** system-ui
- **Weights:** 400
- **Sizes:** 16px
- **Line height:** 1.00
- **OpenType features:** `"dlig" 0, "hlig" 0, "liga" 0, "rlig" 0, "smcp" 0`
- **Role:** System font fallback for icons, the small 'Agency' label in the floating pill, and micro-UI elements where the custom face isn't loaded. Kept neutral so the custom face can carry all the brand expression.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| body | 16px | 24 | -0.096px | `--text-body` |
| subheading | 22px | 32 | -0.132px | `--text-subheading` |
| heading-sm | 28px | 37 | -0.168px | `--text-heading-sm` |
| heading | 42px | 54 | -0.252px | `--text-heading` |
| heading-lg | 52px | 66 | -0.312px | `--text-heading-lg` |
| display | 400px | 300 | -4.4px | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 8px

**Density:** compact

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|

### Border Radius

| Element | Value |
|---------|-------|
| tags | 12px |
| cards | 16px |
| pills | 20-30px |
| buttons | 20px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 120-160px
- **Card padding:** 32-48px
- **Element gap:** 16-24px

## Components

### Floating Pill Nav
**Role:** Top-center navigation element — the site's entire header system

White (#ffffff) pill with 20-30px border-radius, floating at top center of the viewport. Contains the label 'Agency' in -apple-system 16px #282828, paired with a thin plus or cross icon. No traditional nav bar, no hamburger, no sidebar — this single pill is the entire navigation.

### Display Wordmark
**Role:** Brand identity hero — the 'Worth' text in the hero section

Custom display face (custom_47178) at 400px, weight 400, line-height 0.75, letter-spacing -4.4px, color #eb4726 (Vermilion Mark). Fills the viewport width edge-to-edge. This is the signature element — no other text on the site approaches this scale, and the extreme tight tracking makes the letterforms interlock.

### Underline Link
**Role:** All interactive text — replaces buttons entirely across the site

Text in custom_47163 at body or subheading size, color #eb4726, with a 1px bottom border (paddingBottom: 1px). On hover the underline may thicken or the color may shift to #282828. No background fill, no border-radius, no padding — pure typographic interaction.

### Scroll Indicator
**Role:** Below-the-fold prompt to continue exploring the page

Centered 'Scroll to Explore' text in custom_47163 at body size, color #eb4726, with 1px underline. Below it, a thin down-arrow icon (#eb4726 stroke, ~1.5px weight). Sits in the lower third of the hero section with generous breathing room above.

### Blush Section Background
**Role:** Hero and transition section atmosphere

Full-bleed #f8d4d4 fill, no border, no texture, no gradient. Acts as the warm atmospheric layer — alternates with white content sections to create the site's color rhythm.

### Content Section Background
**Role:** Body content sections (about, services, work, contact)

Full-bleed #ffffff or #f9f9f9 fill. Centered single-column text layout with 120-160px vertical padding. The transition from blush to white is the primary spatial device.

### Body Text Block
**Role:** Centered editorial copy in content sections

Single column, centered, max-width ~680px. custom_47163 weight 400 at 16-22px, line-height 1.45-1.50, color #282828. The distinctive ampersand ligature is visible in copy. No left-aligned editorial blocks — everything centers on the vertical axis.

### Mint Accent Card
**Role:** Sparingly used card with cool-tone background for tonal variety

Background #d2fdd1, 16px border-radius, padding 32-48px. Contains custom_47163 text in #282828. Used as a rare counterpoint to the warm vermilion — not a primary card pattern.

### Default Card
**Role:** Standard content card on white sections

Background #ffffff, 1px border in #282828 or #e8e8e8, 16px border-radius, padding 32-48px. Flat — no shadows, no gradients. Contains text and possibly small contained images.

### Arrow Icon
**Role:** Directional cue and decorative element throughout the site

Thin stroke (~1.5px) in #eb4726 or #282828. Used for scroll prompts, link affordances, and section transitions. Always minimal — a single line, never filled, never rounded at the ends.

## Do's and Don'ts

### Do
- Use #eb4726 (Vermilion Mark) as the sole chromatic accent — for the wordmark, links, arrows, and scroll indicator only
- Full-bleed sections that alternate between #f8d4d4 (Blush Field) and #ffffff (Pure White) to create the site's color rhythm
- Center all text in hero and body sections — no left-aligned editorial blocks
- Use 1px bottom-border underlines (paddingBottom: 1px) for all interactive text links, always in #eb4726
- Reserve the 400px custom display face exclusively for the brand wordmark — never for body or UI text
- Apply 20-30px border-radius to pills and floating elements, 16px to cards, 12px to tags
- Maintain 120-160px vertical gaps between full-bleed sections

### Don't
- Never use filled CTA buttons — the system replaces buttons with underlined text links in #eb4726
- Never introduce a second accent color — vermilion is the only chromatic voice
- Never left-align body text in hero or content sections
- Never use shadows or elevation effects — the design is flat color blocking only
- Never use the 400px display face for anything other than the brand wordmark
- Never use #000000 for large blocks of body text — use #282828 for warmth
- Never add background images or photography to the hero — the wordmark and blush field are the entire hero

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Blush Canvas | `#f8d4d4` | Hero and transition section backgrounds — the warm atmospheric base |
| 1 | Bone Field | `#f9f9f9` | Subtle off-white for nested content blocks beneath white sections |
| 2 | White Surface | `#ffffff` | Content sections, cards, floating pill nav — the default content surface |
| 3 | Mint Accent | `#d2fdd1` | Rare accent card background for tonal variety |

## Elevation

The design system deliberately avoids shadows and elevation effects. Depth is created through flat color blocking — alternating #f8d4d4 and #ffffff full-bleed sections create spatial rhythm without any z-axis. Components sit on their surfaces with 1px borders or color contrast alone. This is an exhibition-wall aesthetic: everything is flush, nothing floats. The only element that breaks the plane is the floating pill nav, which sits on the blush field without shadow, distinguished only by its white fill.

## Imagery

The site is essentially imageless. The visual language is built from typography and color fields — the 400px 'Worth' wordmark functions as the hero image, and the #f8d4d4 blush field functions as the atmosphere. There is no photography, no illustration, no 3D renders, no decorative graphics. When work samples or case studies appear in content sections, they are likely clean product crops or portfolio thumbnails contained within 16px-radius cards. The restraint is the statement: the agency's confidence comes from letting type and color do all the work. Icons are minimal thin-line strokes in #eb4726 or #282828.

## Layout

Full-bleed sections stack vertically, alternating between #f8d4d4 and #ffffff like gallery walls. The hero is a single massive wordmark centered on blush, with a floating pill nav at the top center. Content sections use a single centered column (~680px max-width) for body text. There is no left-right split, no asymmetric composition, no card grids in the hero. The rhythm is: color field → type → color field → type, with 120-160px of breathing room between each band. Navigation is a single floating pill — no sidebar, no sticky header, no mega-menu, no footer nav visible in the hero flow.

## Agent Prompt Guide

**Quick Color Reference**
- Text: #282828 (Charcoal Ink)
- Background: #ffffff (Pure White) or #f8d4d4 (Blush Field)
- Border: #282828 or #000000 at 1px
- Accent: #eb4726 (Vermilion Mark) — links, arrows, wordmark
- Surface variation: #f9f9f9 (Bone Gray) for nested blocks
- primary action: #f8d4d4 (outlined action border)

**5 Example Component Prompts**
1. *Hero Wordmark*: Full-bleed #f8d4d4 background. Center the wordmark 'Worth' in custom display face (Söhne Breit substitute) at 400px, weight 400, line-height 0.75, letter-spacing -4.4px, color #eb4726. Let it fill the viewport width.
2. *Floating Pill Nav*: White #ffffff pill, 20-30px border-radius, positioned top center with 16px padding. Inside: 'Agency' text in -apple-system 16px #282828, with a thin plus icon to the right in #282828 at 1.5px stroke.
3. *Underline Link*: Text in custom_47163 (Söhne substitute) at 22px, weight 400, color #eb4726, with 1px bottom border (paddingBottom: 1px), letter-spacing -0.132px. No background, no border-radius.
4. *Content Section*: Full-bleed #ffffff background, 120-160px vertical padding. Centered single column, max-width 680px. Body text at 16px weight 400, line-height 1.50, color #282828, letter-spacing -0.096px.
5. *Scroll Indicator*: Below the hero, centered with 40px gap above. 'Scroll to Explore' in custom_47163 16px #eb4726 with 1px underline. Below it (16px gap), a thin down-arrow icon in #eb4726 at 1.5px stroke.

## Similar Brands

- **Pentagram** — Same editorial-portfolio restraint: massive custom typography, single warm accent, flat color fields, no decorative imagery or stock photography
- **&Walsh** — Same warm-pastel-plus-vivid-accent palette and confidence in letting one typographic gesture fill the entire viewport
- **Porto Rocha** — Same exhibition-scale display type as brand identity and minimal navigation via a single floating element rather than a full nav bar
- **A24** — Same warm cinematic palette (blush pink + vermilion) and typographic-first hero with zero photography
- **Anagrama** — Same custom-display-wordmark hero pattern and flat-color alternating section rhythm

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-blush-field: #f8d4d4;
  --color-vermilion-mark: #eb4726;
  --color-mint-accent: #d2fdd1;
  --color-charcoal-ink: #282828;
  --color-pure-white: #ffffff;
  --color-jet-black: #000000;
  --color-bone-gray: #f9f9f9;

  /* Typography — Font Families */
  --font-custom47163: 'custom_47163', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-custom47178: 'custom_47178', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-apple-system: '-apple-system', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-body: 16px;
  --leading-body: 24;
  --tracking-body: -0.096px;
  --text-subheading: 22px;
  --leading-subheading: 32;
  --tracking-subheading: -0.132px;
  --text-heading-sm: 28px;
  --leading-heading-sm: 37;
  --tracking-heading-sm: -0.168px;
  --text-heading: 42px;
  --leading-heading: 54;
  --tracking-heading: -0.252px;
  --text-heading-lg: 52px;
  --leading-heading-lg: 66;
  --tracking-heading-lg: -0.312px;
  --text-display: 400px;
  --leading-display: 300;
  --tracking-display: -4.4px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;

  /* Spacing */
  --spacing-unit: 8px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 120-160px;
  --card-padding: 32-48px;
  --element-gap: 16-24px;

  /* Border Radius */
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-2xl-2: 20px;
  --radius-3xl: 30px;

  /* Named Radii */
  --radius-tags: 12px;
  --radius-cards: 16px;
  --radius-pills: 20-30px;
  --radius-buttons: 20px;

  /* Surfaces */
  --surface-blush-canvas: #f8d4d4;
  --surface-bone-field: #f9f9f9;
  --surface-white-surface: #ffffff;
  --surface-mint-accent: #d2fdd1;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-blush-field: #f8d4d4;
  --color-vermilion-mark: #eb4726;
  --color-mint-accent: #d2fdd1;
  --color-charcoal-ink: #282828;
  --color-pure-white: #ffffff;
  --color-jet-black: #000000;
  --color-bone-gray: #f9f9f9;

  /* Typography */
  --font-custom47163: 'custom_47163', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-custom47178: 'custom_47178', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-apple-system: '-apple-system', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-body: 16px;
  --leading-body: 24;
  --tracking-body: -0.096px;
  --text-subheading: 22px;
  --leading-subheading: 32;
  --tracking-subheading: -0.132px;
  --text-heading-sm: 28px;
  --leading-heading-sm: 37;
  --tracking-heading-sm: -0.168px;
  --text-heading: 42px;
  --leading-heading: 54;
  --tracking-heading: -0.252px;
  --text-heading-lg: 52px;
  --leading-heading-lg: 66;
  --tracking-heading-lg: -0.312px;
  --text-display: 400px;
  --leading-display: 300;
  --tracking-display: -4.4px;

  /* Spacing */

  /* Border Radius */
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-2xl-2: 20px;
  --radius-3xl: 30px;
}
```
