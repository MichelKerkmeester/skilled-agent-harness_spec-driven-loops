# Superlist — Style Reference
> midnight workspace with coral embers — a quiet aubergine app surface where one warm orange spark signals every action

**Theme:** dark

Superlist uses a midnight-violet productivity language: deep aubergine canvas, warm coral as the single ignition color, and oversized sans-serif headlines that carry the entire mood. The interface feels like a focused late-night workspace — quiet, layered, and confident, with color appearing only as functional punctuation on CTAs, active states, and key highlights. Surfaces stack in subtle purple-tinted darks (#181824 → #26253b), avoiding pure black to keep depth feeling warm rather than clinical. Components are generously rounded (20px cards, pill buttons), softly shadowed, and breathe through comfortable 10–16px gaps rather than tight grids. The headline voice is everything: weight 600 at 70–88px with tight -0.02em tracking treats copy as typography, not interface text — it's closer to editorial than SaaS.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Aubergine Canvas | `#181824` | `--color-aubergine-canvas` | Page background, primary canvas — warm-tinted dark replaces pure black so the UI feels layered rather than flat |
| Elevated Plum | `#26253b` | `--color-elevated-plum` | Card surfaces, input fields, nav containers — one step lighter than canvas to create depth without a visible border |
| Pure White | `#ffffff` | `--color-pure-white` | Primary headings, button text, icon strokes — maximum contrast on the dark canvas |
| Fog Text | `#696f81` | `--color-fog-text` | Body text, secondary headings, muted borders — sits at 7:1 contrast for comfortable reading on the aubergine canvas |
| Ash Text | `#8e8da0` | `--color-ash-text` | Supporting neutral for secondary UI, dividers, and muted labels. Do not promote it to the primary CTA color |
| Mist Highlight | `#a3a3a7` | `--color-mist-highlight` | Subtle borders, dividers, inactive nav items — the faintest neutral that still reads against canvas |
| Whisper Border | `#f7f7ff` | `--color-whisper-border` | Hairline highlights on dark surfaces, inset strokes — a near-white that reads as a light edge in dark mode |
| Coral Ember | `#ff4a36` | `--color-coral-ember` | Orange supporting accent for decorative details and low-frequency emphasis. Do not promote it to the primary CTA color |
| Iris Accent | `#535676` | `--color-iris-accent` | Secondary headings, decorative violet text — a muted blue-violet that harmonizes with the aubergine canvas without competing with coral |

## Tokens — Typography

### sans-serif — sans-serif — detected in extracted data but not described by AI · `--font-sans-serif`
- **Weights:** 400
- **Sizes:** 12px
- **Line height:** 1.2
- **Role:** sans-serif — detected in extracted data but not described by AI

### Haffer XH SemiBold — Primary display and heading font. Used at 70–88px for hero headlines with -0.02em tracking, weight 600. The tight tracking and high x-height give headlines an editorial weight that makes the dark interface feel like a magazine cover rather than a dashboard. Substitute with Inter Tight or General Sans at semibold weight. · `--font-haffer-xh-semibold`
- **Substitute:** Inter Tight, General Sans, Switzer
- **Weights:** 400, 600
- **Sizes:** 16px, 18px, 24px, 30px, 48px, 70px, 88px
- **Line height:** 0.95, 1.00, 1.10, 1.20, 1.50
- **Letter spacing:** -0.0200em, -0.0150em, -0.0100em
- **Role:** Primary display and heading font. Used at 70–88px for hero headlines with -0.02em tracking, weight 600. The tight tracking and high x-height give headlines an editorial weight that makes the dark interface feel like a magazine cover rather than a dashboard. Substitute with Inter Tight or General Sans at semibold weight.

### Jersey 10 — Oversized decorative display font for accent numerals and feature callouts. Used sparingly at very large sizes to create typographic moments. Substitute with Anybody or Cabinet Grotesk display weight. · `--font-jersey-10`
- **Substitute:** Anybody, Cabinet Grotesk, Boldonse
- **Weights:** 400
- **Sizes:** 70px
- **Line height:** 0.90
- **Letter spacing:** -0.0200em
- **Role:** Oversized decorative display font for accent numerals and feature callouts. Used sparingly at very large sizes to create typographic moments. Substitute with Anybody or Cabinet Grotesk display weight.

### Inter — Body text, navigation, links, form inputs. Inter at weight 400 with negative tracking (-0.01em to -0.02em) keeps body copy compact and legible on the dark canvas. Weight 500 for emphasized inline text and button labels. · `--font-inter`
- **Substitute:** system-ui, -apple-system
- **Weights:** 400, 500
- **Sizes:** 12px, 14px, 16px, 18px
- **Line height:** 1.20, 1.30, 1.40
- **Letter spacing:** -0.0200em, -0.0120em, -0.0050em
- **Role:** Body text, navigation, links, form inputs. Inter at weight 400 with negative tracking (-0.01em to -0.02em) keeps body copy compact and legible on the dark canvas. Weight 500 for emphasized inline text and button labels.

### Satoshi — Medium-weight accent for testimonial quotes and emphasized body segments. Sits between Inter 400 and Haffer 600 to create a three-tier type hierarchy without switching families mid-paragraph. Substitute with General Sans Medium. · `--font-satoshi`
- **Substitute:** General Sans, Switzer, Satoshi (Fontshare)
- **Weights:** 500
- **Sizes:** 16px
- **Line height:** 1.20
- **Role:** Medium-weight accent for testimonial quotes and emphasized body segments. Sits between Inter 400 and Haffer 600 to create a three-tier type hierarchy without switching families mid-paragraph. Substitute with General Sans Medium.

### Haffer XH SemiBold Italic — Italic emphasis for quoted phrases and inline highlights within body copy. Used to set apart key terms without changing font family. Substitute with Inter Tight SemiBold Italic. · `--font-haffer-xh-semibold-italic`
- **Substitute:** Inter Tight Italic, General Sans Italic
- **Weights:** 600
- **Sizes:** 16px
- **Line height:** 1.00
- **Role:** Italic emphasis for quoted phrases and inline highlights within body copy. Used to set apart key terms without changing font family. Substitute with Inter Tight SemiBold Italic.

### CUSTOM;Blender Medium — CUSTOM;Blender Medium — detected in extracted data but not described by AI · `--font-customblender-medium`
- **Weights:** 400
- **Sizes:** 16px
- **Line height:** 1.3
- **Role:** CUSTOM;Blender Medium — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.2 | -0.24px | `--text-caption` |
| body-sm | 14px | 1.3 | -0.28px | `--text-body-sm` |
| body | 16px | 1.4 | -0.32px | `--text-body` |
| subheading | 18px | 1.3 | -0.36px | `--text-subheading` |
| heading-sm | 24px | 1.2 | -0.48px | `--text-heading-sm` |
| heading | 30px | 1.1 | -0.6px | `--text-heading` |
| heading-lg | 48px | 1.1 | -0.96px | `--text-heading-lg` |
| display | 70px | 0.95 | -1.4px | `--text-display` |
| display-xl | 88px | 0.95 | -1.76px | `--text-display-xl` |

## Tokens — Spacing & Shapes

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 6 | 6px | `--spacing-6` |
| 8 | 8px | `--spacing-8` |
| 10 | 10px | `--spacing-10` |
| 16 | 16px | `--spacing-16` |
| 20 | 20px | `--spacing-20` |
| 25 | 25px | `--spacing-25` |
| 30 | 30px | `--spacing-30` |
| 40 | 40px | `--spacing-40` |
| 50 | 50px | `--spacing-50` |
| 56 | 56px | `--spacing-56` |
| 60 | 60px | `--spacing-60` |
| 64 | 64px | `--spacing-64` |
| 70 | 70px | `--spacing-70` |
| 90 | 90px | `--spacing-90` |
| 100 | 100px | `--spacing-100` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 100px |
| cards | 20px |
| images | 20px |
| inputs | 8px |
| buttons | 100px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| md | `rgba(0, 0, 0, 0.08) 0px 10px 15px 0px` | `--shadow-md` |
| subtle | `rgba(0, 0, 0, 0.1) 0px 1px 1px 0px, rgba(0, 0, 0, 0.05) 0...` | `--shadow-subtle` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 24px
- **Element gap:** 10-16px

## Components

### Coral CTA Button
**Role:** Primary call-to-action — the single high-contrast interactive element

Pill-shaped (100px radius), background #ff4a36, white text in Inter 500 at 16px with -0.01em tracking. Padding 12px 24px. The vivid coral against the aubergine canvas makes this button impossible to miss — it is the only chromatic element competing with the dark backdrop. Used for sign-up, free trial, and primary conversion moments.

### Ghost Nav Button
**Role:** Secondary text action in the top navigation

No background, no border. White text in Inter 500 at 14px with -0.01em tracking. Padding 8px 16px. Sits beside the primary CTA as the low-emphasis counterpart. No hover fill — relies on color shift to #c4c4c8.

### Hero Headline Block
**Role:** Display headline that anchors the above-the-fold section

Haffer XH SemiBold 600 at 70–88px, line-height 0.95, letter-spacing -1.4 to -1.76px. White text with one phrase in #ff4a36 to create a two-color headline pattern. Centered, max-width ~800px. The second line is colored to create a visual breath and signal the brand accent.

### Aubergine Product Frame
**Role:** Container for the in-app product screenshot

Large rounded rectangle at 20px radius, background #000000 or #26253b to simulate the app window. Subtle shadow rgba(0,0,0,0.08) 0px 10px 15px. Contains the sidebar + content + media layout at realistic scale. The dark-on-dark layering creates depth without needing borders.

### App Sidebar
**Role:** Left navigation rail within the product mockup

Width ~240px, background #181824. Items are Inter 400 at 14px in #8e8da0, with the active item highlighted in #ffffff with a left coral (#ff4a36) accent bar. 8px padding per item, 4px gap between items. Includes collapsible group headers and a circular avatar at the bottom.

### Task List Item
**Role:** Individual action item within the product

Row layout: 16px circular checkbox (unfilled stroke #696f81), Inter 400 16px text in #ffffff, assign avatar 20px circle on the right. Padding 10px 0, separator 1px line in #26253b. Checked items show strikethrough in #8e8da0.

### Logo Strip
**Role:** Social proof bar showing trusted-by companies

Horizontal row of company logos in #8e8da0 or desaturated white, Inter 400 at 16px for wordmarks. Centered with 40–60px gap between logos. Sits on the aubergine canvas with no background — the logos themselves carry the trust signal.

### Review Card
**Role:** User testimonial card in the reviews section

Background #26253b, 20px radius, padding 24px–32px. Review text in Inter 400 16px #c4c4c8. Reviewer name in Inter 500 14px #ffffff, source (App Store/Play Store) in Inter 400 12px #8e8da0. No border, no shadow — the elevated surface color alone separates it from the canvas. Arranged in a 3-column grid with 16px gaps.

### Pill Tag
**Role:** Small categorical or status label

100px radius, background #26253b, Inter 500 12px text in #696f81. Padding 4px 12px. Used for breadcrumbs, category tags, and inline metadata. No icons.

### Cookie Banner
**Role:** Dismissable consent prompt

Fixed bottom-left, background #26253b, 8px radius, padding 12px 16px. Inter 400 12px text in #c4c4c8. White pill button (8px radius) labeled 'Okay'. Subtle shadow rgba(0,0,0,0.1) to lift it above page content.

### AI Prompt Input
**Role:** Natural language input bar for the AI assistant feature

Horizontal pill at 100px radius, background #26253b with a subtle gradient highlight. Contains a small coral dot (8px circle) on the left as the AI indicator, Inter 400 14px placeholder text in #8e8da0, and a mic icon on the right. Floats at the bottom of the product screenshot.

## Do's and Don'ts

### Do
- Use #ff4a36 sparingly — it should appear on at most one element per viewport (CTA, accent headline word, or active state indicator) to preserve its signal strength.
- Set headlines at 70–88px in Haffer XH SemiBold 600 with -0.02em tracking; this oversized editorial voice is the signature of the brand.
- Use 20px radius for all cards, product frames, and large containers; use 100px for all buttons, tags, and pill inputs. Never mix intermediate values like 12px or 16px for these roles.
- Layer surfaces using the dark stack: #181824 (canvas) → #26253b (elevated) → #000000 (recessed). Use the subtle warm-purple tint, not pure black, for primary canvas.
- Apply letter-spacing of -0.01em to -0.02em across all text sizes from 14px upward; tight tracking is essential to the editorial feel.
- Keep body text at 16px with line-height 1.4 in Inter 400, using #696f81 or #8e8da0 — never pure white for paragraphs, reserve #ffffff for headings only.
- Center-align hero content and headlines; the layout reads as a magazine spread, not a dashboard grid.

### Don't
- Don't introduce additional accent colors — the system is bichromatic (aubergine + coral). Any second chromatic color dilutes the brand signal.
- Don't use sharp corners (0–4px radius) on interactive elements; the pill and 20px-rounded language is non-negotiable for brand recognition.
- Don't set body paragraphs in #ffffff — it creates glare on dark backgrounds. Use #696f81 for body and #8e8da0 for secondary prose.
- Don't use weight 400 for headlines; the display voice requires 600 weight to carry at 70px+ sizes.
- Don't add visible borders to separate cards from the canvas — the surface color stack (#181824 vs #26253b) provides separation without strokes.
- Don't use pure #000000 as the page canvas; the warm aubergine (#181824) is what gives the dark mode its distinctive atmosphere.
- Don't split-color every headline — only the second line or one key phrase should be coral to maintain the pattern's impact.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Aubergine Canvas | `#181824` | Page background — warm dark base |
| 1 | Elevated Plum | `#26253b` | Cards, inputs, nav containers — first surface lift |
| 2 | Shadow Plum | `#000000` | Deepest recessed areas, footer, product screenshot frames |
| 3 | White Pop | `#ffffff` | Inverted surfaces for product mockups, review cards |

## Elevation

- **Floating product screenshot:** `rgba(0, 0, 0, 0.08) 0px 10px 15px 0px`
- **Sticky navigation bar:** `rgba(0, 0, 0, 0.1) 0px 1px 1px 0px, rgba(0, 0, 0, 0.05) 0px 2px 4px 0px, rgba(255, 255, 255, 0.45) 0px 0.5px 0px 0px inset`

## Imagery

Product screenshots dominate the visual real estate — a large, rounded-corner device frame showing the actual app interface fills the hero and secondary sections. Photography is minimal and appears only as user avatars or in-app media previews (e.g., a concert image in the right panel of the product mockup). Logos in the trust strip are flat wordmarks in desaturated white. No decorative illustrations, no abstract graphics, no 3D renders. The visual strategy is: show the product at large scale, let the typography do the emotional work, use coral as the only color punctuation.

## Layout

Full-bleed dark sections with centered, max-width 1200px content containers. Hero is vertically centered with stacked headline → subtext → CTA, followed by a large product screenshot that overlaps into the next section. Subsequent sections alternate between centered text blocks and card grids. The reviews section uses a 3-column grid of testimonial cards with 16–20px gaps. Navigation is a single top bar with logo left, links center, auth actions right — no sticky sidebar, no mega-menu. Section gaps are generous (80px) creating a spacious, editorial rhythm rather than a dense product grid.

## Agent Prompt Guide

**Quick Color Reference**
- text primary: #ffffff
- text body: #696f81
- background: #181824
- card surface: #26253b
- border: #26253b
- accent: #ff4a36
- primary action: no distinct CTA color

**3-5 Example Component Prompts**

No distinct primary action color was observed; use the extracted neutral button treatments instead of inventing a filled CTA color.

2. **Product Screenshot Frame**: 20px radius container, #000000 background, subtle shadow rgba(0,0,0,0.08) 0px 10px 15px. Contains a 3-column app mockup: sidebar (240px wide, #181824 bg), content area (#26253b bg, 24px padding), and media panel on the right.

3. **Review Card**: 20px radius, #26253b background, 24px padding. Review text in Inter 400 16px #c4c4c8. Name in Inter 500 14px #ffffff. Source label in Inter 400 12px #8e8da0. No border, no shadow. Arrange in 3-column grid with 20px gap.

4. **App Sidebar Item**: 8px vertical padding, 16px horizontal padding. Inter 400 14px text in #8e8da0 for inactive, #ffffff for active. Active item has a 2px left border in #ff4a36. 4px gap between items.


## Bichromatic Color Discipline

The entire interface operates on two colors: aubergine (the canvas and its lifts) and coral (the single action color). This is not a palette with many accents — it is a palette with one accent used surgically. The coral appears on: (1) the primary CTA button, (2) the second line of hero headlines, (3) the active sidebar indicator, and (4) the AI prompt dot. Every other element — headings, body text, cards, borders, icons — is some shade of purple-gray or white. This discipline is what makes the dark mode feel intentional rather than gloomy.

## Similar Brands

- **Linear** — Same dark-mode discipline with a single accent color, oversized display headlines, and pill-shaped primary buttons. Both treat the interface as a canvas for typography rather than a dense data grid.
- **Notion** — Productivity tool with a dark canvas and minimal chromatic accents. Shares the generous spacing rhythm and the strategy of letting product screenshots carry the visual weight.
- **Arc Browser** — Dark default interface with warm-tinted surfaces (not pure black), editorial-scale typography, and a confident use of one accent color. Both feel like products designed for creative professionals who work at night.
- **Cron (calendar app)** — Dark productivity interface with similar rounded product frames, pill buttons, and a restrained color palette. Both use the product screenshot as the primary hero visual rather than abstract graphics.
- **Raycast** — Dark-mode productivity tool with clean centered layouts, large display headlines, and a minimal accent palette. Both prioritize typographic confidence over decorative elements.

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-aubergine-canvas: #181824;
  --color-elevated-plum: #26253b;
  --color-pure-white: #ffffff;
  --color-fog-text: #696f81;
  --color-ash-text: #8e8da0;
  --color-mist-highlight: #a3a3a7;
  --color-whisper-border: #f7f7ff;
  --color-coral-ember: #ff4a36;
  --color-iris-accent: #535676;

  /* Typography — Font Families */
  --font-sans-serif: 'sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-haffer-xh-semibold: 'Haffer XH SemiBold', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-jersey-10: 'Jersey 10', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-satoshi: 'Satoshi', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-haffer-xh-semibold-italic: 'Haffer XH SemiBold Italic', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-customblender-medium: 'CUSTOM;Blender Medium', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.2;
  --tracking-caption: -0.24px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.3;
  --tracking-body-sm: -0.28px;
  --text-body: 16px;
  --leading-body: 1.4;
  --tracking-body: -0.32px;
  --text-subheading: 18px;
  --leading-subheading: 1.3;
  --tracking-subheading: -0.36px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: -0.48px;
  --text-heading: 30px;
  --leading-heading: 1.1;
  --tracking-heading: -0.6px;
  --text-heading-lg: 48px;
  --leading-heading-lg: 1.1;
  --tracking-heading-lg: -0.96px;
  --text-display: 70px;
  --leading-display: 0.95;
  --tracking-display: -1.4px;
  --text-display-xl: 88px;
  --leading-display-xl: 0.95;
  --tracking-display-xl: -1.76px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-6: 6px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-25: 25px;
  --spacing-30: 30px;
  --spacing-40: 40px;
  --spacing-50: 50px;
  --spacing-56: 56px;
  --spacing-60: 60px;
  --spacing-64: 64px;
  --spacing-70: 70px;
  --spacing-90: 90px;
  --spacing-100: 100px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 24px;
  --element-gap: 10-16px;

  /* Border Radius */
  --radius-sm: 2px;
  --radius-lg: 8px;
  --radius-2xl: 20px;
  --radius-3xl: 38px;
  --radius-full: 100px;
  --radius-full-2: 200px;

  /* Named Radii */
  --radius-tags: 100px;
  --radius-cards: 20px;
  --radius-images: 20px;
  --radius-inputs: 8px;
  --radius-buttons: 100px;

  /* Shadows */
  --shadow-md: rgba(0, 0, 0, 0.08) 0px 10px 15px 0px;
  --shadow-subtle: rgba(0, 0, 0, 0.1) 0px 1px 1px 0px, rgba(0, 0, 0, 0.05) 0px 2px 4px 0px, rgba(255, 255, 255, 0.45) 0px 0.5px 0px 0px inset;

  /* Surfaces */
  --surface-aubergine-canvas: #181824;
  --surface-elevated-plum: #26253b;
  --surface-shadow-plum: #000000;
  --surface-white-pop: #ffffff;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-aubergine-canvas: #181824;
  --color-elevated-plum: #26253b;
  --color-pure-white: #ffffff;
  --color-fog-text: #696f81;
  --color-ash-text: #8e8da0;
  --color-mist-highlight: #a3a3a7;
  --color-whisper-border: #f7f7ff;
  --color-coral-ember: #ff4a36;
  --color-iris-accent: #535676;

  /* Typography */
  --font-sans-serif: 'sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-haffer-xh-semibold: 'Haffer XH SemiBold', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-jersey-10: 'Jersey 10', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-satoshi: 'Satoshi', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-haffer-xh-semibold-italic: 'Haffer XH SemiBold Italic', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-customblender-medium: 'CUSTOM;Blender Medium', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.2;
  --tracking-caption: -0.24px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.3;
  --tracking-body-sm: -0.28px;
  --text-body: 16px;
  --leading-body: 1.4;
  --tracking-body: -0.32px;
  --text-subheading: 18px;
  --leading-subheading: 1.3;
  --tracking-subheading: -0.36px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: -0.48px;
  --text-heading: 30px;
  --leading-heading: 1.1;
  --tracking-heading: -0.6px;
  --text-heading-lg: 48px;
  --leading-heading-lg: 1.1;
  --tracking-heading-lg: -0.96px;
  --text-display: 70px;
  --leading-display: 0.95;
  --tracking-display: -1.4px;
  --text-display-xl: 88px;
  --leading-display-xl: 0.95;
  --tracking-display-xl: -1.76px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-6: 6px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-25: 25px;
  --spacing-30: 30px;
  --spacing-40: 40px;
  --spacing-50: 50px;
  --spacing-56: 56px;
  --spacing-60: 60px;
  --spacing-64: 64px;
  --spacing-70: 70px;
  --spacing-90: 90px;
  --spacing-100: 100px;

  /* Border Radius */
  --radius-sm: 2px;
  --radius-lg: 8px;
  --radius-2xl: 20px;
  --radius-3xl: 38px;
  --radius-full: 100px;
  --radius-full-2: 200px;

  /* Shadows */
  --shadow-md: rgba(0, 0, 0, 0.08) 0px 10px 15px 0px;
  --shadow-subtle: rgba(0, 0, 0, 0.1) 0px 1px 1px 0px, rgba(0, 0, 0, 0.05) 0px 2px 4px 0px, rgba(255, 255, 255, 0.45) 0px 0.5px 0px 0px inset;
}
```
