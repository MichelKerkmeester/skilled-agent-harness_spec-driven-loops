# CQCM — Style Reference
> Verdant cooperative megaphone. A vivid green slab screams a civic message across a white grid while black pill buttons ground the chromatic energy.

**Theme:** light

CQCM radiates civic confidence through oversized uppercase display type, vivid flat chromatic blocks, and generous white space. A custom wide-tracked display face (Athletics) gives French institutional weight, while Manrope handles reading at human sizes with slightly opened tracking. Black pill buttons are the only filled action element — every other color is a decorative block, not a control. The palette is unapologetically chromatic: a dominant electric green for the hero and key stats, a saturated blue for news surfaces, a coral orange for data emphasis, and a pale mint for quiet card surfaces. Dot patterns and circular image cutouts soften an otherwise orthogonal, grid-heavy layout. The overall feel is a Quebec cooperative movement's visual identity — bold, optimistic, and declarative without ever feeling corporate.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Cooperative Green | `#44d991` | `--color-cooperative-green` | Hero panel fill, primary stat block, decorative dot overlays — the loudest brand voice; the color that makes the page feel activated |
| Civic Blue | `#4c92e9` | `--color-civic-blue` | News card surfaces, secondary stat blocks — chromatic but cooler, reserved for media/content contexts rather than primary brand expression |
| Sunset Coral | `#ff6a51` | `--color-sunset-coral` | Accent stat block only — appears once as data emphasis, treated as a single-note punctuation rather than a system color |
| Mint Whisper | `#eaf9f2` | `--color-mint-whisper` | Card and nav surface tint — a barely-there green echo of the hero green, softens white space without breaking the light theme |
| Ink Black | `#000000` | `--color-ink-black` | Primary text, pill button fill, all borders and dividers — does the structural work of the system, the only color used for controls |
| Paper White | `#ffffff` | `--color-paper-white` | Page canvas, text on filled buttons, image surfaces |
| Steel Gray | `#666666` | `--color-steel-gray` | Muted helper text, secondary nav borders — the only mid-gray in the system, used sparingly for de-emphasis |

## Tokens — Typography

### Athletics — Display and badge type — used for hero headlines (48–78px), card labels, and uppercase tags. The wide letter-spacing (0.04em) is a French institutional signature that turns every headline into a civic declaration. Custom face; substitute with Archivo Black, Anton, or Druk for similar uppercase weight and tracking, or with a wide-tracked geometric like Bebas Neue for closer feel. · `--font-athletics`
- **Substitute:** Archivo Black, Anton, or Druk Wide
- **Weights:** 400, 500
- **Sizes:** 12px, 14px, 16px, 22px, 48px, 59px, 78px
- **Line height:** 1.00
- **Letter spacing:** 0.04em at 22px and above (≈1.88px at 48px, ≈2.36px at 59px, ≈3.12px at 78px); 0.004em at 16px and below
- **Role:** Display and badge type — used for hero headlines (48–78px), card labels, and uppercase tags. The wide letter-spacing (0.04em) is a French institutional signature that turns every headline into a civic declaration. Custom face; substitute with Archivo Black, Anton, or Druk for similar uppercase weight and tracking, or with a wide-tracked geometric like Bebas Neue for closer feel.

### Manrope — Body, navigation, button labels, and small text — the working font. Slightly opened tracking (0.01–0.011em) is a subtle departure from default; it keeps dense French text feeling breathable without becoming display-like. Pairs cleanly with Athletics because both share geometric, humanist proportions. · `--font-manrope`
- **Substitute:** Manrope (Google Fonts)
- **Weights:** 400
- **Sizes:** 12px, 14px, 16px, 18px, 20px, 22px
- **Line height:** 1.00, 1.30, 1.40
- **Letter spacing:** 0.01em at 12–18px, 0.011em at 20–22px (≈0.12–0.24px)
- **Role:** Body, navigation, button labels, and small text — the working font. Slightly opened tracking (0.01–0.011em) is a subtle departure from default; it keeps dense French text feeling breathable without becoming display-like. Pairs cleanly with Athletics because both share geometric, humanist proportions.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.3 | 0.12px | `--text-caption` |
| body-sm | 14px | 1.3 | 0.14px | `--text-body-sm` |
| body | 16px | 1.4 | 0.16px | `--text-body` |
| subheading | 18px | 1.3 | 0.18px | `--text-subheading` |
| subheading-lg | 20px | 1.3 | 0.22px | `--text-subheading-lg` |
| heading-sm | 22px | 1 | 0.88px | `--text-heading-sm` |
| heading | 48px | 1 | 1.92px | `--text-heading` |
| heading-lg | 59px | 1 | 2.36px | `--text-heading-lg` |
| display | 78px | 1 | 3.12px | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 8 | 8px | `--spacing-8` |
| 20 | 20px | `--spacing-20` |
| 40 | 40px | `--spacing-40` |
| 60 | 60px | `--spacing-60` |
| 80 | 80px | `--spacing-80` |
| 100 | 100px | `--spacing-100` |
| 120 | 120px | `--spacing-120` |
| 200 | 200px | `--spacing-200` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 8px |
| badges | 4px |
| images | 4px |
| buttons | 100px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| lg | `rgba(0, 0, 0, 0.1) 0px 0px 20px 0px` | `--shadow-lg` |

### Layout

- **Page max-width:** 1280px
- **Section gap:** 80px
- **Card padding:** 20px
- **Element gap:** 20px

## Components

### Hero Green Panel
**Role:** Primary brand surface — declares the organization's mission at full volume

Solid #44d991 fill, no border, no shadow. Contains an uppercase Athletics headline at 48–78px, weight 500, letter-spacing 0.04em, color #000000. Black pill button (100px radius) sits at the bottom-left of the panel with 10px 20px padding. The panel occupies the full right half of the hero on desktop and stacks below the image on mobile.

### Pill Button (Filled)
**Role:** Primary action — the only filled button variant in the system

Background #000000, text #ffffff, Manrope 14–16px weight 400, letter-spacing 0.01em, uppercase. Border-radius 100px (full pill). Padding 10px 20px. No hover state change specified beyond color shift. Used for 'QUI SOMMES-NOUS', 'DÉCOUVRIR LE MOUVEMENT', 'LIRE', and 'PLUS' controls.

### Pill Button (Ghost)
**Role:** Secondary navigation — for less prominent calls

Background #ffffff, border 1px #000000, text #000000, Manrope 14px, uppercase. Border-radius 100px. Padding 10px 20px. Used for the 'PLUS' nav item in the top bar.

### Circular Image Frame
**Role:** Signature image treatment — softens the grid-heavy layout

Image cropped to a perfect circle (border-radius 50%), 4px subtle edge. Sits centered in a blue (#4c92e9) card surface. Diameter varies with context (approximately 240–280px). The circle shape is the only non-rectangular geometry in the system and is reserved for imagery.

### Dot Pattern Overlay
**Role:** Decorative brand texture on hero imagery

Grid of solid #44d991 circles overlaid on the hero photograph. Dots are uniform size (~30px), arranged in a regular grid, partially bleeding off the image edges. Not a component to be reused structurally — it is a single brand artifact on the hero image only.

### News Card
**Role:** Content card for articles, communiqués, and nouvelles

Background #4c92e9 (Civic Blue) on the upper image area, #ffffff on the lower text area. Border-radius 8px. No shadow. Contains a circular image frame at top, a tag badge (COMMUNIQUÉ / NOUVELLES) in uppercase Athletics 12px, a date in Manrope 12px #666666, a headline in Manrope 16–18px weight 400 #000000, a short description in Manrope 14px #000000, and a black pill 'LIRE' button at the bottom. Padding 20px on the text section.

### Stat Block
**Role:** Large data display — one color per metric, stacked for rhythm

Solid chromatic fill (rotates through #44d991, #eaf9f2, #4c92e9, #ffffff, #ff6a51) per block. Border-radius 8px. Padding 20px. Number in Athletics 48–78px weight 500 letter-spacing 0.04em, #000000. Vertical label in uppercase Athletics 12–14px #000000, rotated or stacked beside the number. Blocks are offset vertically to create a staircase composition.

### Category Tag
**Role:** Content classification — COMMUNIQUÉ, NOUVELLES, etc.

Background #ffffff, text #000000, uppercase Athletics 12px weight 400 letter-spacing 0.04em. No border, no radius (square corners) or 4px radius. Inline with a date in Manrope 12px #666666. Padding 0 or 7px vertical, 10px horizontal.

### Top Navigation Bar
**Role:** Primary site navigation

Background #ffffff, no border or a 1px #000000 bottom border. Logo (CQCM wordmark with green geometric mark) at the far left. Nav items in Manrope 14px weight 400 #000000, uppercase, separated by 20–30px horizontal gap. 'PLUS' ghost pill button at far right. Padding 15–20px vertical, 40px horizontal.

### 'See All' Link
**Role:** Section-level navigation — to full listings

Text link with a small black filled circle bullet to the left of the label. Label in uppercase Athletics 12px #000000 letter-spacing 0.04em. No underline. Used as the right-aligned companion to section headings like 'À LA UNE'.

### Section Heading
**Role:** Top-of-section title — minimalist and structural

Text in Manrope 22–24px weight 400 #000000, mixed case (e.g. 'À LA UNE'). Left-aligned. No decorative underline or accent — the type weight and size alone carry the section identity. Pairs with the 'See All' link to the right.

### Hero Image Panel
**Role:** Left half of the hero — photography with brand dot overlay

Full-bleed photographic image (a smiling person in this case). No border-radius. Overlaid with the #44d991 dot pattern. The image extends to the left edge of the viewport and meets the green panel with no gap.

## Do's and Don'ts

### Do
- Use Athletics 400–500 for all display and badge text with letter-spacing 0.04em — the wide tracking is the brand's typographic identity, not a stylistic option
- Set pill buttons at 100px radius with #000000 fill and #ffffff text in 14–16px Manrope, uppercase
- Reach for #44d991 (Cooperative Green) as the dominant chromatic surface — hero, stat blocks, and decorative dots — not for buttons or text accents
- Crop images to circles inside blue (#4c92e9) news cards; reserve the circle shape for imagery only
- Stack stat blocks in a 5-block staircase with ~30px vertical and horizontal offset between each
- Use #eaf9f2 (Mint Whisper) for soft card and nav surfaces when white feels too clinical
- Separate nav items with 20–30px horizontal gap; keep the nav a single non-sticky white bar

### Don't
- Do not use any chromatic color as a button fill — buttons are always #000000 or outlined; color is for surfaces and decoration only
- Do not add shadows to cards, buttons, or content — the system is flat by design; the only shadow is the nav bar's soft halo
- Do not mix Athletics into body copy or Manrope into hero headlines — the font split is strict: Athletics displays, Manrope reads
- Do not use letter-spacing tighter than 0.01em on Manrope or 0.04em on Athletics — the opened tracking is part of the brand's breathable French-institutional feel
- Do not use coral (#ff6a51) more than once per surface — it is a single-note punctuation, not a system color
- Do not use square corners on buttons — pill shape (100px) is the only button geometry; cards get 8px, small elements get 4px
- Do not introduce gradients, blurs, or glass effects — the system is unapologetically flat, saturated, and solid

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Paper | `#ffffff` | Page canvas, default reading surface |
| 1 | Mint | `#eaf9f2` | Soft card surface, quiet nav fill, feature panel background |
| 2 | Civic Blue | `#4c92e9` | News and media card surfaces, chromatically distinct content layer |
| 3 | Cooperative Green | `#44d991` | Hero panel, stat blocks, brand-dominant content surfaces |
| 4 | Sunset Coral | `#ff6a51` | Single data-emphasis block, used once for accent stat |

## Elevation

- **Navigation bar:** `rgba(0, 0, 0, 0.1) 0px 0px 20px 0px`

## Imagery

Imagery is photographic, human-centered, and tightly cropped — close-up portraits and candid workplace moments, never staged stock photography. Treatment is high-key and natural-light, full-color, with no filters or duotone. The signature visual treatment is the green dot grid overlaid on the hero portrait; subsequent images appear as circular cutouts inside blue card surfaces. The system avoids decorative illustration entirely — it is a photography-and-typography system, not an illustration system.

## Layout

The page is max-width 1280px contained, with a strong split-hero pattern: photograph left, solid green panel right. Below the hero, sections flow as full-width bands separated by 60–80px vertical gaps. The stats section uses an offset staircase of chromatic blocks (5 blocks, each shifted ~30px down and to the right) — this is the page's signature compositional move. News and feature sections use a 3-column card grid with 20px gutters. The navigation is a single top bar, not sticky, with a clean white background. Content density is comfortable — sections breathe, never feel packed. The overall rhythm alternates between solid chromatic blocks (green hero, blue news cards, multicolor stat stack) and white reading surfaces, creating high-contrast visual punctuation without literal dividers.

## Agent Prompt Guide

## Quick Color Reference
- text: #000000
- background: #ffffff
- border: #000000 (1px hairline) or #eaf9f2 (soft surface)
- accent (brand surface): #44d991 (Cooperative Green)
- secondary accent (content surface): #4c92e9 (Civic Blue)
- primary action: #000000 (filled action)

## 3-5 Example Component Prompts
1. **Build the hero panel**: Solid #44d991 fill covering the right half of the viewport. Headline in Athletics weight 500, 78px, line-height 1.0, letter-spacing 3.12px, color #000000, uppercase, text 'APPUYER LE DÉVELOPPEMENT SOCIAL ET ÉCONOMIQUE DU QUÉBEC.' Black pill button (border-radius 100px, padding 10px 20px, Manrope 14px uppercase #ffffff on #000000) anchored bottom-left of the panel.

2. **Build a news card**: White background, border-radius 8px, no shadow. Top half is a #4c92e9 (Civic Blue) block containing a circular image (border-radius 50%, centered, ~260px diameter). Below the blue area: padding 20px, a small uppercase tag 'COMMUNIQUÉ' in Athletics 12px letter-spacing 0.48px #000000, a date '24 AVRIL 2026' in Manrope 12px #666666, a headline in Manrope 18px #000000, a description in Manrope 14px #000000, and a black pill 'LIRE' button at the bottom.

3. **Build the stat staircase**: Five solid-fill blocks stacked with ~30px vertical and horizontal offset. Block 1: #44d991 with number '2 900' in Athletics 59px weight 500 letter-spacing 2.36px. Block 2: #eaf9f2 with '10M'. Block 3: #4c92e9 with '130 000'. Block 4: #ffffff with '42,6G$'. Block 5: #ff6a51 with '484G$'. Each block has border-radius 8px, padding 20px, and a vertical uppercase Athletics 12px label rotated beside the number.

4. **Build the top navigation**: White background, padding 15px 40px, no shadow. Left: CQCM logo with a small green geometric mark. Center-left: nav items 'DOSSIERS', 'INITIATIVES' in Manrope 14px uppercase #000000 with 20–30px gaps. Center-right: 'À propos', 'Le mouvement', 'Devenir membre', 'Nous joindre' in Manrope 14px #000000. Far right: a ghost pill button 'PLUS' with 1px #000000 border, border-radius 100px, padding 10px 20px.

5. **Build a 'See All' link**: Small #000000 filled circle (8px diameter) to the left of uppercase Athletics 12px letter-spacing 0.48px #000000 text 'VOIR TOUT'. No underline. Right-aligned within a section header row that also contains a left-aligned Manrope 22px section title.

## Typography Pairing Logic

Athletics and Manrope share geometric, humanist proportions — both have open apertures, similar x-heights, and clean terminals. The pairing works because the shared DNA keeps them feeling like one family, while the contrast in tracking (Athletics 0.04em, Manrope 0.01em) and weight (Athletics goes to 500, Manrope stays at 400) prevents them from competing. Rule: any text above 22px or in all-caps must be Athletics; anything meant to be read for more than two seconds must be Manrope.

## Similar Brands

- **Greenpeace** — Same activist-institutional confidence with a single dominant chromatic color (vivid green) used as a brand surface rather than an accent
- **Sunrise Movement** — Civic-movement identity that pairs electric chromatic blocks with bold uppercase display type and generous white space
- **Khan Academy** — Multicolor data-block compositions and a comfortable, educational-institution density with flat saturated fills
- **Mailchimp (pre-2020 rebrand)** — Brave chromatic surfaces (yellow, blue, green) used as full panels, with a custom display face and minimal shadow elevation

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-cooperative-green: #44d991;
  --color-civic-blue: #4c92e9;
  --color-sunset-coral: #ff6a51;
  --color-mint-whisper: #eaf9f2;
  --color-ink-black: #000000;
  --color-paper-white: #ffffff;
  --color-steel-gray: #666666;

  /* Typography — Font Families */
  --font-athletics: 'Athletics', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-manrope: 'Manrope', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.3;
  --tracking-caption: 0.12px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.3;
  --tracking-body-sm: 0.14px;
  --text-body: 16px;
  --leading-body: 1.4;
  --tracking-body: 0.16px;
  --text-subheading: 18px;
  --leading-subheading: 1.3;
  --tracking-subheading: 0.18px;
  --text-subheading-lg: 20px;
  --leading-subheading-lg: 1.3;
  --tracking-subheading-lg: 0.22px;
  --text-heading-sm: 22px;
  --leading-heading-sm: 1;
  --tracking-heading-sm: 0.88px;
  --text-heading: 48px;
  --leading-heading: 1;
  --tracking-heading: 1.92px;
  --text-heading-lg: 59px;
  --leading-heading-lg: 1;
  --tracking-heading-lg: 2.36px;
  --text-display: 78px;
  --leading-display: 1;
  --tracking-display: 3.12px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-8: 8px;
  --spacing-20: 20px;
  --spacing-40: 40px;
  --spacing-60: 60px;
  --spacing-80: 80px;
  --spacing-100: 100px;
  --spacing-120: 120px;
  --spacing-200: 200px;

  /* Layout */
  --page-max-width: 1280px;
  --section-gap: 80px;
  --card-padding: 20px;
  --element-gap: 20px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-3xl: 30px;
  --radius-full: 100px;

  /* Named Radii */
  --radius-cards: 8px;
  --radius-badges: 4px;
  --radius-images: 4px;
  --radius-buttons: 100px;

  /* Shadows */
  --shadow-lg: rgba(0, 0, 0, 0.1) 0px 0px 20px 0px;

  /* Surfaces */
  --surface-paper: #ffffff;
  --surface-mint: #eaf9f2;
  --surface-civic-blue: #4c92e9;
  --surface-cooperative-green: #44d991;
  --surface-sunset-coral: #ff6a51;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-cooperative-green: #44d991;
  --color-civic-blue: #4c92e9;
  --color-sunset-coral: #ff6a51;
  --color-mint-whisper: #eaf9f2;
  --color-ink-black: #000000;
  --color-paper-white: #ffffff;
  --color-steel-gray: #666666;

  /* Typography */
  --font-athletics: 'Athletics', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-manrope: 'Manrope', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.3;
  --tracking-caption: 0.12px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.3;
  --tracking-body-sm: 0.14px;
  --text-body: 16px;
  --leading-body: 1.4;
  --tracking-body: 0.16px;
  --text-subheading: 18px;
  --leading-subheading: 1.3;
  --tracking-subheading: 0.18px;
  --text-subheading-lg: 20px;
  --leading-subheading-lg: 1.3;
  --tracking-subheading-lg: 0.22px;
  --text-heading-sm: 22px;
  --leading-heading-sm: 1;
  --tracking-heading-sm: 0.88px;
  --text-heading: 48px;
  --leading-heading: 1;
  --tracking-heading: 1.92px;
  --text-heading-lg: 59px;
  --leading-heading-lg: 1;
  --tracking-heading-lg: 2.36px;
  --text-display: 78px;
  --leading-display: 1;
  --tracking-display: 3.12px;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-20: 20px;
  --spacing-40: 40px;
  --spacing-60: 60px;
  --spacing-80: 80px;
  --spacing-100: 100px;
  --spacing-120: 120px;
  --spacing-200: 200px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-3xl: 30px;
  --radius-full: 100px;

  /* Shadows */
  --shadow-lg: rgba(0, 0, 0, 0.1) 0px 0px 20px 0px;
}
```
