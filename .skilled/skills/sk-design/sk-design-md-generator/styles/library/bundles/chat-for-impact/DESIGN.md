# Chat for impact — Style Reference
> forest-green clinic with pastel rooms

**Theme:** light

Turn.io runs on a warm, healthcare-optimistic visual system: a deep forest green acts as the dominant brand surface and hero canvas, while soft pastel washes (mint, lavender, peach, cream, sky) create section rhythm like colored rooms in a clinic. The single vivid coral CTA (#ff643b) is the only high-saturation action color and it sits on a near-monochrome field, so every 'Book a Call' reads as the obvious next step. Typography is DM Sans everywhere, pushed to enormous display sizes (69–116px) with tight negative tracking, which gives even the hero a conversational softness rather than corporate weight. Components stay flat and borderless — the system communicates through color blocks and 16–24px rounded cards, not shadows or chrome. Pastel feature cards and a lavender page canvas give the whole site a hand-drawn, almost editorial warmth, while the green hero and purple toolkit band inject the brand's two anchor colors at full saturation.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Canopy Green | `#0a3922` | `--color-canopy-green` | Hero canvas, dark section backgrounds, primary heading color on light backgrounds — establishes the dominant brand surface |
| Coral Pulse | `#ff643b` | `--color-coral-pulse` | Primary action buttons, filled CTAs — the only warm high-saturation color in the system, creates urgency without aggression |
| Indigo Bloom | `#460095` | `--color-indigo-bloom` | Toolkit section background overlay, secondary brand headings — anchors the purple-lavender pastel system |
| Leaf Bright | `#1dbf73` | `--color-leaf-bright` | Green outline accent for tags, dividers, and focused UI edges |
| Deep Teal | `#003642` | `--color-deep-teal` | Blue outline accent for tags, dividers, and focused UI edges. Do not promote it to the primary CTA color |
| Orchid Tint | `#f3b3fe` | `--color-orchid-tint` | Decorative pink accent for badges, tag chips, and pink-section heading underlines |
| Sky Signal | `#00b4dc` | `--color-sky-signal` | Cyan accent for icons, chart lines, and notification-style data visualization inside cards |
| Aubergine | `#47264c` | `--color-aubergine` | Muted plum for body text on lavender backgrounds and plum-section headings — warm dark that pairs with #460095 |
| Ink Black | `#000000` | `--color-ink-black` | Primary body text, borders, icon strokes — used aggressively for 1px dividers and outline icon set |
| Paper White | `#ffffff` | `--color-paper-white` | Card surfaces, text on dark backgrounds, nav background, white phone-mockup surfaces |
| Ash | `#a6a6a6` | `--color-ash` | Mid-gray for secondary borders, placeholder text, disabled list items, icon strokes at reduced weight |
| Slate | `#7a7a7a` | `--color-slate` | Body meta text, subtle list dividers, caption-tier typography |
| Graphite | `#3d3d3d` | `--color-graphite` | Strong secondary text, icon strokes at full opacity, dark borders on light pastel cards |
| Charcoal | `#333333` | `--color-charcoal` | Headlines on white/pastel surfaces, link text color when not using brand purple |
| Frost Gray | `#e0e0e0` | `--color-frost-gray` | Hairline dividers, subtle card separators on white sections |
| Cloud Gray | `#f2f2f2` | `--color-cloud-gray` | Neutral card surface when no pastel is appropriate, footer background, table stripes |
| Lavender Mist | `#eee2ff` | `--color-lavender-mist` | Dominant page background canvas — the near-gray violet that sets the overall atmospheric tint of the site |
| Mint Wash | `#d2f2e3` | `--color-mint-wash` | Green-tinted card and section background, pale green data viz fills |
| Sky Wash | `#ccf0f8` | `--color-sky-wash` | Pale cyan card backgrounds, cooling counterpoint to the warm greens and corals |
| Sage Wash | `#e4f7ee` | `--color-sage-wash` | Very pale green card surface, lighter than Mint Wash for secondary cards |
| Lilac Wash | `#fdf0ff` | `--color-lilac-wash` | Pale lavender card background, pink-adjacent pastel |
| Peach Wash | `#ffede8` | `--color-peach-wash` | Soft section background, alternate surface, and quiet card fill. Do not promote it to the primary CTA color |
| Cream | `#faf7e8` | `--color-cream` | Warm cream card background, editorial yellow-tinted sections |
| Sand | `#f4ece9` | `--color-sand` | Warm beige background variant, rarely used neutral surface |

## Tokens — Typography

### DM Sans — Single-family system — display headlines at 69–116px weight 500–600 with tight tracking create the editorial feel; body at 16–18px weight 400; UI at 14–16px weight 500–600. The same font handles 12px captions through 116px display, which is the signature: one voice, enormous dynamic range. The ss03 stylistic set is enabled site-wide. · `--font-dm-sans`
- **Substitute:** Inter, Manrope, or any geometric humanist sans
- **Weights:** 400, 500, 600, 700
- **Sizes:** 12, 14, 16, 18, 20, 24, 32, 48, 52, 69, 72, 80, 116
- **Line height:** 0.89, 1.00, 1.05, 1.10, 1.14, 1.17, 1.20, 1.30, 1.33, 1.38, 1.40
- **Letter spacing:** -0.028em at display sizes (≥52px), -0.019em at 32–48px, normal at body sizes
- **OpenType features:** `"ss03"`
- **Role:** Single-family system — display headlines at 69–116px weight 500–600 with tight tracking create the editorial feel; body at 16–18px weight 400; UI at 14–16px weight 500–600. The same font handles 12px captions through 116px display, which is the signature: one voice, enormous dynamic range. The ss03 stylistic set is enabled site-wide.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.2 | — | `--text-caption` |
| body-sm | 14px | 1.38 | — | `--text-body-sm` |
| body | 16px | 1.38 | — | `--text-body` |
| body-lg | 18px | 1.4 | — | `--text-body-lg` |
| subheading | 20px | 1.33 | — | `--text-subheading` |
| heading-sm | 24px | 1.3 | — | `--text-heading-sm` |
| heading | 32px | 1.2 | -0.019px | `--text-heading` |
| heading-lg | 48px | 1.14 | -0.019px | `--text-heading-lg` |
| display | 72px | 1.05 | -0.028px | `--text-display` |
| display-xl | 116px | 0.89 | -0.028px | `--text-display-xl` |

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
| 56 | 56px | `--spacing-56` |
| 64 | 64px | `--spacing-64` |
| 80 | 80px | `--spacing-80` |
| 120 | 120px | `--spacing-120` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 9999px |
| cards | 24px |
| icons | 8px |
| buttons | 40px |
| cards-sm | 16px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| subtle | `rgba(0, 0, 0, 0.05) 0px 1px 1px 0px` | `--shadow-subtle` |

### Layout

- **Page max-width:** 1280px
- **Section gap:** 64px
- **Card padding:** 24px
- **Element gap:** 8px

## Components

### Coral Filled Button
**Role:** Primary CTA — booking, conversion actions

Background #ff643b, white text at 16px DM Sans weight 600, padding 12px 24px, border-radius 40px (fully pill-shaped). No border, no shadow. Sits as the only warm focal point against the green hero or lavender canvas.

### Ghost Outline Button
**Role:** Secondary action paired beside the primary CTA

Transparent background, 1px solid #ffffff border on dark hero / 1px solid #000000 on light sections, text 16px DM Sans weight 500, padding 12px 24px, border-radius 40px. Always accompanies the coral filled button as the lower-emphasis twin.

### Outline Nav Button
**Role:** Right-side header CTA ('Book a Call' in nav)

White background, 1px solid #000000 border, 14px DM Sans weight 500, padding 8px 20px, border-radius 40px. Smaller than hero CTAs; lives in the white nav bar against the green page top.

### Pastel Feature Card
**Role:** 2-column feature highlight in the middle section

Tinted background cycling through #d2f2e3 (mint), #e4f7ee (sage), #ccf0f8 (sky), #faf7e8 (cream), #fdf0ff (lilac), #ffede8 (peach). Padding 32px, border-radius 24px, no border, no shadow. Headline 32px DM Sans weight 700 in #0a3922 or #003642, body 16px in #3d3d3d. Phone-mockup or chart graphic sits below text.

### White Product Card
**Role:** Active/selected feature card with embedded product UI

White #ffffff background, padding 24px, border-radius 16px, optional 1px #e0e0e0 hairline. Contains a phone mockup or inline product screenshot. The product-UI surface is always white to keep the pastel card system from competing with actual content.

### Checklist Feature Item
**Role:** Vertical feature list in the toolkit section (left column)

Each item: small filled brand-colored icon (24px) on the left, 20px DM Sans weight 500 label in #0a3922, 8px gap between icon and text, 16px vertical spacing between items. Active item has a lavender #eee2ff background block wrapping the entire row with 16px border-radius.

### WhatsApp Phone Mockup
**Role:** Hero product visualization on the right side of the hero

Realistic phone-frame device with a dark green #0a3922 status-bar header, white #ffffff chat background, incoming chat bubbles in white with 1px #e0e0e0 border, outgoing bubbles in #dcf8c6 mint-green (WhatsApp canonical), sent-name labels in Leaf Bright #1dbf73. Sits as a layered card overlapping a portrait photo of a healthcare worker.

### Sticky Bottom Notification
**Role:** Application deadline banner pinned to the bottom-right

Dark green #0a3922 background, white text, 16px DM Sans weight 500, padding 16px 20px, border-radius 16px. Contains inline countdown blocks (24d/5h/1m/45s) in monospaced numbers, yellow #faf7e8 or coral #ff643b filled 'Apply now' mini-button, and a close-X in the top-right corner.

### Logo Strip
**Role:** Partner logos band ('In partnership with')

Centered cluster of monochrome partner logos (Meta, WHO, OpenAI, etc.) rendered at #3d3d3d on the dark green hero. Logo height ~24px, 48px horizontal gap between logos. Label text 12px DM Sans weight 500 in #a6a6a6 sits above the strip.

### Pill Tag Chip
**Role:** Small label or category marker in body content

Background tint of current section's pastel (e.g. #d2f2e3 on mint cards), 12px DM Sans weight 600, padding 4px 12px, border-radius 9999px, text in the section's dark heading color.

### Top Navigation Bar
**Role:** Sticky site navigation

White #ffffff background, full-width, horizontal flex with logo left, nav links center (Product, Community, Resources, Pricing), EN selector + Log in + outlined 'Book a Call' right. 14px DM Sans weight 500, #0a3922 link color, 32px vertical padding, no shadow.

### Full-Bleed Dark Hero
**Role:** Above-the-fold hero section

Background #0a3922, full viewport width, 80px+ vertical padding. Left: headline at 69–80px DM Sans weight 500 white with 'WhatsApp' swapped to #1dbf73, body 18px in #d2f2e3, coral CTA + ghost button. Right: overlapping phone mockup + portrait photo composition with no visible card chrome.

## Do's and Don'ts

### Do
- Use DM Sans at every text size from 12px caption to 116px display — the single-family system is the signature; do not introduce a second typeface
- Apply -0.028em letter-spacing at display sizes (≥52px) and -0.019em at 32–48px; body and smaller text uses normal tracking
- Enable font-feature-settings: 'ss03' on every DM Sans instance
- Use the pastel card rotation (#d2f2e3, #e4f7ee, #ccf0f8, #faf7e8, #fdf0ff, #ffede8) for feature card backgrounds — never use raw white or gray for these cards
- Use #ff643b Coral Pulse exclusively for primary filled CTAs; pair every coral button with a ghost outline button beside it
- Set border-radius to 40px on all buttons, 24px on feature cards, 16px on product/notification cards, 9999px on tag chips
- Push headline sizes to 69–116px for hero and section openers; the large-display system is what makes the brand feel editorial rather than corporate

### Don't
- Do not use box-shadow for elevation — the system relies on color contrast and pastel surface changes; shadows break the flat editorial feel
- Do not introduce a second typeface for headings or body; DM Sans is the single voice
- Do not use #ff643b for anything other than primary action buttons — it is not a decorative accent
- Do not use #000000 as a fill on dark green or lavender backgrounds — it creates harsh dead spots; use white or a pastel instead
- Do not use sharp corners (border-radius 0–2px) on feature cards or buttons — the system is defined by soft 16–40px radii
- Do not use more than one vivid accent color per section; coral CTA and Leaf Bright or Indigo Bloom should not appear simultaneously in the same viewport
- Do not set body text below 14px or use gray-on-gray contrast — the system expects strong black #000000 or near-black #3d3d3d on light surfaces

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Page Canvas | `#eee2ff` | Dominant lavender-tinted page background that establishes atmospheric warmth |
| 1 | Card Surface | `#ffffff` | White surface for phone mockups, product cards, and overlaid content blocks |
| 2 | Pastel Card | `#d2f2e3` | Tinted feature cards cycling through mint, sky, sage, lilac, peach, cream for section variety |
| 3 | Dark Brand Surface | `#0a3922` | Hero and dark band — full-bleed forest green for high-contrast headline moments |

## Elevation

The system deliberately avoids drop shadows as elevation. Depth is created entirely through surface color shifts: lavender canvas → white card → pastel card → dark green band. The only shadow token in the data is rgba(0,0,0,0.05) 0px 1px 1px 0px, used at very low frequency (3 occurrences) for subtle form-field separation. Do not introduce multi-layer shadow stacks or colored glows — they would break the flat editorial surface treatment that defines the brand.

## Imagery

Photography is warm, human, and documentary: close-up portraits of healthcare workers (often women in scrubs) with natural skin tones and real-world clinic or community settings, never staged stock poses. Portraits are used in full-bleed or large rounded card crops, frequently overlapping product mockups on the right side of the hero and toolkit sections. Product visualizations are realistic WhatsApp phone-frame mockups with canonical chat-bubble colors (white incoming, #dcf8c6 outgoing, Leaf Bright #1dbf73 sender names), placed as layered floating cards rather than flat screenshots. There are no abstract gradient backgrounds, no 3D renders, and no decorative illustrations — the visual language is photo + product-screenshot only. Iconography is a monochrome outlined/flat-filled icon set in #0a3922 or #000000 at 20–24px, used for feature list bullets and card decorations. The green hero and lavender toolkit band use brand color as the entire atmospheric base rather than imagery.

## Layout

Full-bleed page with a lavender #eee2ff canvas and alternating brand-color bands: dark green hero (80px+ vertical padding, split text-left / visual-right with overlapping phone mockup + portrait), then a white feature band (centered headline, 2-column pastel card grid with 24px gap), then a lavender toolkit band (split text-left feature list / image-right portrait with green color overlay), then alternating pastel and white sections following a generous 64px section gap. The page max-width is approximately 1280px centered, with horizontal padding of ~80px on desktop. Navigation is a single sticky white top bar. A persistent bottom-right notification card overlays all sections. The layout breathes — section gaps are large, cards have 24px+ internal padding, and the dark-to-pastel-to-dark alternation creates clear room-like transitions rather than continuous flow.

## Agent Prompt Guide

**Quick Color Reference**
- text: #000000 (primary body), #3d3d3d (secondary), #7a7a7a (meta)
- background: #eee2ff (page canvas), #ffffff (cards), #0a3922 (hero/dark bands)
- border: #e0e0e0 (hairline), #a6a6a6 (mid), #000000 (strong)
- accent: #1dbf73 (Leaf Bright for highlighted words), #460095 (Indigo Bloom for purple sections)
- primary action: #ff643b (filled action)

**Example Component Prompts**

1. **Full-bleed dark hero**: Background #0a3922, 80px vertical padding, max-width 1280px centered. Left column headline 'Turn WhatsApp into your Health App' at 80px DM Sans weight 500, white text, letter-spacing -0.028em, with the word 'WhatsApp' recolored to #1dbf73. Body 18px DM Sans weight 400 in #d2f2e3, max-width 480px. Coral CTA 'Book a Call' (#ff643b background, white 16px weight 600, padding 12px 24px, radius 40px) + ghost button 'Take a tour' (transparent, 1px #ffffff border, 16px weight 500, padding 12px 24px, radius 40px). Right column: WhatsApp phone mockup (phone frame, #0a3922 header bar, white chat area) overlapping a portrait photo of a healthcare worker, no shadow.

2. **Pastel feature card**: Background #d2f2e3 (rotate through #e4f7ee, #ccf0f8, #faf7e8, #fdf0ff, #ffede8 per card), padding 32px, border-radius 24px, no border, no shadow. Headline 'Cut no-shows by 40%' at 32px DM Sans weight 700 in #0a3922, letter-spacing -0.019em. Body 16px DM Sans weight 400 in #3d3d3d. Below text: a white phone-mockup card (#ffffff, 16px radius) showing a WhatsApp conversation about appointment rescheduling.

3. **Lavender toolkit section**: Background #eee2ff with a 30% #460095 overlay wash or full-bleed lavender variant. Section gap 64px. Left column: vertical list of 4 features, each a 24px filled #460095 icon + 20px DM Sans weight 500 label in #0a3922, with the active item wrapped in a #ffffff block with 16px radius. Right column: full-bleed portrait photo of a smiling woman in scrubs with a Leaf Bright #1dbf73 diagonal color overlay at 40% opacity.

4. **Sticky bottom notification card**: Position fixed bottom-right, 24px from edges. Background #0a3922, padding 16px 20px, border-radius 16px. Title 'II chat for Health Accelerator' at 16px DM Sans weight 600 in white. Subtitle 'Application deadline May 31' at 14px weight 400 in #d2f2e3. Inline countdown: four 32px-tall blocks (24d, 5h, 1m, 45s) with 12px DM Sans weight 600 in #a6a6a6. Right: filled 'Apply now' button in #faf7e8 cream, 14px #0a3922 text, padding 8px 16px, radius 40px. Close X in top-right at #a6a6a6, 16px tap target.

5. **Pastel card heading with colored word**: On a #fdf0ff lavender card, headline 'Your entire digital patient journey toolkit' at 48px DM Sans weight 500 in #460095, letter-spacing -0.019em, with no color swap needed since the base color already carries the brand. The first word is bold (weight 700) in #460095 at 52px, creating a two-tone inline emphasis pattern.

## Similar Brands

- **Ada Health** — Same warm pastel card grid over a near-white canvas, large humanist-sans headlines, and a single warm accent for CTAs
- **Headspace Health** — Shared use of full-bleed brand-colored hero bands followed by soft pastel feature cards, and a gentle rounded sans-serif at enormous display sizes
- **Sana Health** — Identical split hero composition (text left, phone-mockup + portrait right) and the same flat-borderless card system on tinted pastel surfaces
- **Babylon Health** — Healthcare-tech aesthetic with DM Sans/Inter-class headlines, pastel green and blue feature card rotation, and photo-of-clinicians imagery treatment
- **Calendly** — Single coral/orange filled CTA paired with a ghost outline secondary button, and a white nav bar with outlined pill CTA as the persistent right-side action

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-canopy-green: #0a3922;
  --color-coral-pulse: #ff643b;
  --color-indigo-bloom: #460095;
  --color-leaf-bright: #1dbf73;
  --color-deep-teal: #003642;
  --color-orchid-tint: #f3b3fe;
  --color-sky-signal: #00b4dc;
  --color-aubergine: #47264c;
  --color-ink-black: #000000;
  --color-paper-white: #ffffff;
  --color-ash: #a6a6a6;
  --color-slate: #7a7a7a;
  --color-graphite: #3d3d3d;
  --color-charcoal: #333333;
  --color-frost-gray: #e0e0e0;
  --color-cloud-gray: #f2f2f2;
  --color-lavender-mist: #eee2ff;
  --color-mint-wash: #d2f2e3;
  --color-sky-wash: #ccf0f8;
  --color-sage-wash: #e4f7ee;
  --color-lilac-wash: #fdf0ff;
  --color-peach-wash: #ffede8;
  --color-cream: #faf7e8;
  --color-sand: #f4ece9;

  /* Typography — Font Families */
  --font-dm-sans: 'DM Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.2;
  --text-body-sm: 14px;
  --leading-body-sm: 1.38;
  --text-body: 16px;
  --leading-body: 1.38;
  --text-body-lg: 18px;
  --leading-body-lg: 1.4;
  --text-subheading: 20px;
  --leading-subheading: 1.33;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.3;
  --text-heading: 32px;
  --leading-heading: 1.2;
  --tracking-heading: -0.019px;
  --text-heading-lg: 48px;
  --leading-heading-lg: 1.14;
  --tracking-heading-lg: -0.019px;
  --text-display: 72px;
  --leading-display: 1.05;
  --tracking-display: -0.028px;
  --text-display-xl: 116px;
  --leading-display-xl: 0.89;
  --tracking-display-xl: -0.028px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
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
  --spacing-56: 56px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-120: 120px;

  /* Layout */
  --page-max-width: 1280px;
  --section-gap: 64px;
  --card-padding: 24px;
  --element-gap: 8px;

  /* Border Radius */
  --radius-sm: 2px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-2xl-2: 20px;
  --radius-3xl: 24px;
  --radius-3xl-2: 40px;

  /* Named Radii */
  --radius-tags: 9999px;
  --radius-cards: 24px;
  --radius-icons: 8px;
  --radius-buttons: 40px;
  --radius-cards-sm: 16px;

  /* Shadows */
  --shadow-subtle: rgba(0, 0, 0, 0.05) 0px 1px 1px 0px;

  /* Surfaces */
  --surface-page-canvas: #eee2ff;
  --surface-card-surface: #ffffff;
  --surface-pastel-card: #d2f2e3;
  --surface-dark-brand-surface: #0a3922;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-canopy-green: #0a3922;
  --color-coral-pulse: #ff643b;
  --color-indigo-bloom: #460095;
  --color-leaf-bright: #1dbf73;
  --color-deep-teal: #003642;
  --color-orchid-tint: #f3b3fe;
  --color-sky-signal: #00b4dc;
  --color-aubergine: #47264c;
  --color-ink-black: #000000;
  --color-paper-white: #ffffff;
  --color-ash: #a6a6a6;
  --color-slate: #7a7a7a;
  --color-graphite: #3d3d3d;
  --color-charcoal: #333333;
  --color-frost-gray: #e0e0e0;
  --color-cloud-gray: #f2f2f2;
  --color-lavender-mist: #eee2ff;
  --color-mint-wash: #d2f2e3;
  --color-sky-wash: #ccf0f8;
  --color-sage-wash: #e4f7ee;
  --color-lilac-wash: #fdf0ff;
  --color-peach-wash: #ffede8;
  --color-cream: #faf7e8;
  --color-sand: #f4ece9;

  /* Typography */
  --font-dm-sans: 'DM Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.2;
  --text-body-sm: 14px;
  --leading-body-sm: 1.38;
  --text-body: 16px;
  --leading-body: 1.38;
  --text-body-lg: 18px;
  --leading-body-lg: 1.4;
  --text-subheading: 20px;
  --leading-subheading: 1.33;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.3;
  --text-heading: 32px;
  --leading-heading: 1.2;
  --tracking-heading: -0.019px;
  --text-heading-lg: 48px;
  --leading-heading-lg: 1.14;
  --tracking-heading-lg: -0.019px;
  --text-display: 72px;
  --leading-display: 1.05;
  --tracking-display: -0.028px;
  --text-display-xl: 116px;
  --leading-display-xl: 0.89;
  --tracking-display-xl: -0.028px;

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
  --spacing-56: 56px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-120: 120px;

  /* Border Radius */
  --radius-sm: 2px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-2xl-2: 20px;
  --radius-3xl: 24px;
  --radius-3xl-2: 40px;

  /* Shadows */
  --shadow-subtle: rgba(0, 0, 0, 0.05) 0px 1px 1px 0px;
}
```
