# Ballpark — Style Reference
> editorial white studio, single vermilion flare

**Theme:** light

Ballpark uses a confident, editorial research-platform language: a near-pure white canvas, oversized grotesque display headlines, and a single warm vermilion accent (#fc4a2b) that fires across borders, highlights, and icon strokes. The system feels quiet by default — almost every surface is white or whisper-gray — and lets the orange act as a small, functional flash against monochrome typography. Components are flat and pill-leaning: floating rounded tags, hairline-bordered cards, and a dark CTA that grounds the page against the airy type. The result reads like a magazine spread that happens to be a SaaS homepage — weight, scale, and one chromatic note doing all the work.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Vermilion Flame | `linear-gradient(268.33deg, rgb(252, 74, 43), rgb(255, 126, 103), rgb(255, 172, 158), rgb(255, 206, 198))` | `--color-vermilion-flame` | Brand accent — borders, highlight strokes, icon fills, small inline emphasis marks. The only saturated color in the system; appears as punctuation, never as a wash; Brand-to-tint linear gradient — appears as a full-bleed color bar behind embedded product screenshots |
| Ember Pulse | `#ea3718` | `--color-ember-pulse` | Deeper vermilion variant — icon glyphs and small filled marks where the primary accent needs more weight against white |
| Tangerine Signal | `#f97316` | `--color-tangerine-signal` | Secondary warm accent — decorative strokes and illustration outlines that sit beside the primary vermilion |
| Coral Blush | `#ffac9e` | `--color-coral-blush` | Soft warm fill — subtle wash backgrounds, shadow tints that carry the brand's warmth without screaming |
| Peach Mist | `#ffe5e0` | `--color-peach-mist` | Tinted surface — warm-tinted card or section background, barely-there warmth to differentiate from neutral gray |
| Apricot Wash | `#ffedd5` | `--color-apricot-wash` | Lightest warm tint — badge fills, tag backgrounds, and hover surfaces that need warmth without saturation |
| Brick Alert | `#dc2626` | `--color-brick-alert` | Red supporting accent for decorative details and low-frequency emphasis. Use as a supporting accent, not as a status color |
| Forest Confirm | `#15803d` | `--color-forest-confirm` | Green supporting accent for decorative details and low-frequency emphasis. Use as a supporting accent, not as a status color |
| Ink Black | `#000000` | `--color-ink-black` | Headlines, body text, filled dark buttons, the heaviest typographic weight in the system |
| Slate 900 | `#111827` | `--color-slate-900` | Supporting neutral for secondary UI, dividers, and muted labels. |
| Slate 700 | `#374151` | `--color-slate-700` | Secondary headings and body emphasis where Slate 600 is too light |
| Slate 600 | `#4b5563` | `--color-slate-600` | Body text, paragraph copy, secondary descriptions, link text |
| Slate 500 | `#6b7280` | `--color-slate-500` | Tertiary text, captions, icon strokes at reduced weight, disabled labels |
| Paper White | `#ffffff` | `--color-paper-white` | Primary canvas, card surfaces, button text on dark fills |
| Fog Whisper | `#f9fafb` | `--color-fog-whisper` | Section background — the quietest gray band used to separate content zones from the pure white canvas |
| Mist Gray | `#f2f3f5` | `--color-mist-gray` | Elevated surface — card backgrounds that sit on the Fog band, subtle inputs, and table row alternation |
| Ash Border | `#e6e8eb` | `--color-ash-border` | Hairline dividers, card borders, input outlines at rest |
| Coral Wash Gradient | `linear-gradient(268.33deg, rgb(255, 126, 103), rgb(255, 206, 198), rgb(255, 229, 224), rgb(255, 243, 241))` | `--color-coral-wash-gradient` | Decorative warm gradient — used behind product imagery to extend the brand's warmth into visual sections |

## Tokens — Typography

### sans-serif — sans-serif — detected in extracted data but not described by AI · `--font-sans-serif`
- **Weights:** 400
- **Sizes:** 12px
- **Line height:** 1.2
- **Role:** sans-serif — detected in extracted data but not described by AI

### Inter Display — Display headlines only — the 96px hero 'Research without the complexity' is the signature moment. Weight 800 at display sizes with -0.035em tracking creates a compressed, editorial block of type. lineHeight 1.0 stacks lines tightly. Do not use below 42px; below that, switch to Inter. · `--font-inter-display`
- **Substitute:** Inter (Google) with font-stretch and tighter letter-spacing, or General Sans Bold
- **Weights:** 700, 800
- **Sizes:** 42px, 60px, 96px
- **Line height:** 1.00
- **Letter spacing:** -0.035em at 96px, -0.030em at 60px, -0.030em at 42px
- **OpenType features:** `"cv06", "cv13", "zero"`
- **Role:** Display headlines only — the 96px hero 'Research without the complexity' is the signature moment. Weight 800 at display sizes with -0.035em tracking creates a compressed, editorial block of type. lineHeight 1.0 stacks lines tightly. Do not use below 42px; below that, switch to Inter.

### Inter — Body, UI, navigation, and sub-headings. Weight 400 for paragraphs, 500 for nav and UI labels, 600 for sub-headings and strong emphasis, 700 for inline emphasis. Negative letter-spacing tightens the body (-0.01em to -0.03em) — a small but consistent editorial choice. · `--font-inter`
- **Substitute:** Inter (Google) is the source — direct match
- **Weights:** 400, 500, 600, 700
- **Sizes:** 10px, 12px, 13px, 14px, 16px, 18px, 20px, 24px
- **Line height:** 1.20–1.65
- **Letter spacing:** -0.030em at 24px, -0.020em at 20px, -0.014em at 18px, -0.010em at 16px and below, +0.050em for uppercase UI labels
- **OpenType features:** `"cv01", "cv02", "cv04", "cv09"`
- **Role:** Body, UI, navigation, and sub-headings. Weight 400 for paragraphs, 500 for nav and UI labels, 600 for sub-headings and strong emphasis, 700 for inline emphasis. Negative letter-spacing tightens the body (-0.01em to -0.03em) — a small but consistent editorial choice.

### IBM Plex Mono — Eyebrow and label text — 'DEMOCRATISING RESEARCH AT CUSTOMER OBSESSED COMPANIES SUCH AS' and similar uppercase tags. The +0.15em letter-spacing creates wide mechanical tracking that reads as editorial metadata. Always uppercase, always at 11px. · `--font-ibm-plex-mono`
- **Substitute:** JetBrains Mono Bold or IBM Plex Mono (Google)
- **Weights:** 600
- **Sizes:** 11px
- **Line height:** 1.50
- **Letter spacing:** +0.15em
- **Role:** Eyebrow and label text — 'DEMOCRATISING RESEARCH AT CUSTOMER OBSESSED COMPANIES SUCH AS' and similar uppercase tags. The +0.15em letter-spacing creates wide mechanical tracking that reads as editorial metadata. Always uppercase, always at 11px.

### Source Serif 4 — Pull-quote and testimonial body text — introduces a serif counterpoint to the otherwise all-grotesque system. Used sparingly to add texture in quote cards and long-form editorial moments. · `--font-source-serif-4`
- **Substitute:** Source Serif 4 (Google) or Lora
- **Weights:** 400
- **Sizes:** 20px
- **Line height:** 1.60
- **Letter spacing:** -0.020em
- **Role:** Pull-quote and testimonial body text — introduces a serif counterpoint to the otherwise all-grotesque system. Used sparingly to add texture in quote cards and long-form editorial moments.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 10px | 1.2 | -0.01px | `--text-caption` |
| body | 16px | 1.5 | -0.01px | `--text-body` |
| subheading | 18px | 1.46 | -0.014px | `--text-subheading` |
| heading-sm | 20px | 1.6 | -0.02px | `--text-heading-sm` |
| heading | 24px | 1.43 | -0.03px | `--text-heading` |
| display | 96px | 1 | -0.035px | `--text-display` |

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
| 72 | 72px | `--spacing-72` |
| 80 | 80px | `--spacing-80` |
| 104 | 104px | `--spacing-104` |
| 120 | 120px | `--spacing-120` |

### Border Radius

| Element | Value |
|---------|-------|
| nav | 6px |
| hero | 16px |
| tags | 9999px |
| cards | 10px |
| inputs | 6px |
| buttons | 6px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| md | `rgba(0, 0, 0, 0.1) 0px 6px 9px 0px` | `--shadow-md` |
| subtle | `rgba(75, 85, 99, 0.2) 0px 0px 0px 1px` | `--shadow-subtle` |
| xl | `rgba(50, 50, 92, 0.05) 0px 50px 100px -20px, rgba(0, 0, 0...` | `--shadow-xl` |
| subtle-2 | `rgb(252, 74, 43) 0px 0px 0px 2px` | `--shadow-subtle-2` |
| subtle-3 | `rgba(0, 0, 0, 0.05) 0px 1px 2px 0px` | `--shadow-subtle-3` |
| subtle-4 | `rgba(75, 85, 99, 0.2) 0px 0px 0px 1px, rgba(0, 0, 0, 0.06...` | `--shadow-subtle-4` |
| subtle-5 | `rgb(17, 24, 39) 0px 0px 0px 1px` | `--shadow-subtle-5` |
| subtle-6 | `rgba(0, 0, 0, 0.05) 0px 1px 2px 0px, rgba(75, 85, 99, 0.2...` | `--shadow-subtle-6` |
| subtle-7 | `rgba(0, 0, 0, 0.1) 0px 1px 2px 0px inset, rgb(249, 250, 2...` | `--shadow-subtle-7` |
| subtle-8 | `rgb(255, 255, 255) 0px 0px 0px 1px` | `--shadow-subtle-8` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 24px
- **Element gap:** 8px

## Components

### Top Announcement Bar
**Role:** Site-wide notification strip above the navigation

Full-width bar with Mist Gray (#f2f3f5) background, 5px vertical padding, centered IBM Plex Mono 11px 600 uppercase text with +0.15em tracking. Contains a small inline emoji and a link arrow. Border-bottom: 1px solid #e6e8eb.

### Primary Navigation
**Role:** Sticky top navigation bar

White background, 0px border-bottom (relies on spacing for separation). Logo (Ballpark wordmark with subtle strikethrough detail) left-aligned, nav links (Inter 500, 14px, Slate 900) center-aligned, two buttons right-aligned. Height approximately 64px. Max-width 1200px container.

### Ghost Nav Button (Sign In)
**Role:** Secondary navigation action

Transparent fill, 1px solid #e6e8eb border, 6px radius, Inter 500 14px in Slate 900, padding 8px 16px. Hover: border darkens to Slate 600.

### Filled Dark CTA (Book a Demo)
**Role:** Primary conversion action

Ink Black (#000000) background, white text, Inter 600 14px, 6px radius, padding 8px 16px. Contains a small arrow icon trailing the label. This is the only dark button in the system — the contrast against the white canvas makes it the clear action target.

### Display Headline
**Role:** Hero and section-opening typography

Inter Display 800 at 96px (hero) or 60px (section), lineHeight 1.0, letterSpacing -0.035em, color Ink Black. Stacks as a tight block — often 2-3 lines. No color emphasis; relies on weight and scale alone.

### Eyebrow Label
**Role:** Uppercase section metadata

IBM Plex Mono 600, 11px, +0.15em letter-spacing, uppercase, Slate 600. Always appears above a headline or section title. Functions as a typographic tag identifying the section category.

### Floating Capability Tag
**Role:** Feature category indicator (Surveys, Interviews, Video, etc.)

White fill, 1px solid #e6e8eb border, 9999px radius (pill), Inter 500 14px Slate 900, padding 6px 16px. Small box-shadow: 0 1px 2px rgba(0,0,0,0.05). Arranged in a horizontal row above product previews, often with thin connecting lines to a central node.

### Product Preview Card
**Role:** Embedded product UI screenshot

White card, 16px radius, floating on a full-bleed vermilion-to-coral gradient background. Contains browser-chrome mockup with tab labels, content sections, and UI elements. Elevation: 0 50px 100px -20px rgba(50,50,92,0.05), 0 30px 60px -30px rgba(0,0,0,0.15). The gradient bar behind the card is the strongest color moment on the page.

### Customer Logo Grid
**Role:** Social proof — client logos

4-column grid, all logos rendered in Slate 900 (#111827) or pure black. 24px row gap, 40px column gap. No color, no boxes — just monochrome wordmarks on white. The absence of color signals trust and lets the content speak.

### Testimonial Card
**Role:** Client quote with attribution

White background, no border, 16px radius on the image side, 10px radius on the text side. Left: full-bleed photo with subtle warm gradient overlay. Right: company logo (top), quoted text in Inter 500 16px Slate 700, attribution with avatar circle (40px) + name (Inter 600 14px) + role (Inter 400 13px Slate 600). Dot pagination indicators below.

### Feature Card (Grid Item)
**Role:** Product capability showcase in a card grid

White background, 10px radius, 1px solid #e6e8eb border, 24px padding. Icon at top in Vermilion Flame (#fc4a2b), heading in Inter 700 20px Ink Black, body in Inter 400 16px Slate 600. No shadow at rest; subtle hover lift.

### Input Field
**Role:** Form text input

White fill, 1px solid #e6e8eb border, 6px radius, Inter 400 16px Slate 900 text, padding 10px 14px. Placeholder: Slate 500. Focus: 2px Vermilion Flame ring (0 0 0 2px #fc4a2b) replaces the border.

### Badge — Warm
**Role:** Status or category tag with warm tint

Apricot Wash (#ffedd5) background, Ink Black text, Inter 600 12px, 9999px radius, padding 4px 10px. Used for feature tags and category labels where the brand warmth should carry through.

### Footer
**Role:** Site footer with navigation columns

White or Fog background, 16px radius on the top edge (curved top boundary), multi-column link grid with Inter 400 14px Slate 600. Column headings in Inter 600 14px Ink Black. Generous vertical padding (48-64px).

## Do's and Don'ts

### Do
- Use Inter Display 800 at 60-96px for all display headlines, with -0.035em letter-spacing and 1.0 line-height
- Use IBM Plex Mono 11px 600 with +0.15em tracking for all uppercase eyebrow labels above section headings
- Use 9999px radius for all pill-shaped tags, badges, and capability indicators
- Use the Vermilion Flame (#fc4a2b) accent only on borders, strokes, and small icon fills — never as a large background wash (except the product preview gradient bar)
- Set the primary CTA to Ink Black (#000000) with white text, 6px radius, 8px 16px padding — this is the only dark fill in the system
- Maintain 80px vertical section gaps and 1200px max-width containers for all page-level layout
- Use the warm gradient (vermilion to coral) as a full-bleed background band behind embedded product screenshots only

### Don't
- Do not use the vermilion accent (#fc4a2b) as a filled CTA button background — the system uses dark/black for primary actions
- Do not use Inter Display below 42px — switch to Inter for any sub-heading or body use
- Do not apply shadows to cards at rest; rely on 1px borders and surface color shifts for separation
- Do not use colors outside the neutral grayscale and the single vermilion accent for interface elements — no blues, greens, or purples in UI
- Do not use rounded corners above 16px on cards — the system is built on 6px and 10px radii with 9999px reserved for pills only
- Do not mix serif and grotesque within the same text block — Source Serif 4 is only for standalone pull-quotes
- Do not center-align body paragraphs longer than two lines; center only headlines, eyebrows, and short descriptions

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas | `#ffffff` | Primary page background — pure white dominates the system |
| 1 | Fog Band | `#f9fafb` | Section separator — the first step away from pure white, used for alternating content bands |
| 2 | Mist Card | `#f2f3f5` | Card surface — sits on top of Fog bands for subtle elevation without shadows |
| 3 | Warm Tint | `#ffe5e0` | Brand-tinted surface — warm wash for product showcase areas and color-coded content blocks |

## Elevation

- **Card — default:** `0 1px 2px rgba(0, 0, 0, 0.05)`
- **Card — elevated:** `0 6px 9px rgba(0, 0, 0, 0.1)`
- **Product preview — hero:** `0 50px 100px -20px rgba(50, 50, 92, 0.05), 0 30px 60px -30px rgba(0, 0, 0, 0.15)`
- **Input — focus ring:** `0 0 0 2px rgb(252, 74, 43)`
- **Button — ghost hover:** `0 0 0 1px rgba(75, 85, 99, 0.2), 0 2px 2px rgba(0, 0, 0, 0.06)`

## Imagery

The visual language is product-first and editorial. Photography appears only in testimonial cards — warm-toned lifestyle portraits (outdoor, golden-hour, candid) with a subtle warm gradient overlay that ties into the brand palette. Product screenshots are the dominant visual element: full browser-chrome mockups floating on a vermilion gradient bar, showing the actual product UI with orange accent highlights. Customer logos are rendered in pure monochrome black — no color, no boxes, no treatment. The overall density is low: large white space between elements, one photograph or product shot per section maximum. Icons are minimal, single-weight line icons that pick up the vermilion accent when active.

## Layout

Centered, max-width 1200px container with generous breathing room. The hero is a centered text stack: eyebrow label → massive 96px display headline → single paragraph subtext → floating capability tags above an embedded product preview. Below the fold, the rhythm alternates between centered text sections and two-column splits (text left / product visual right or vice versa). Customer logos form a 4-column grid with 24px row gaps. Testimonials appear in a carousel format with large left-image / right-text cards. Sections are separated by 80px vertical gaps, and the product preview is the only section that uses a full-bleed color band. Navigation is a minimal top bar with logo, centered links, and two right-aligned buttons. No sidebar, no mega-menu.

## Agent Prompt Guide

## Quick Color Reference
- Canvas: #ffffff
- Primary text: #111827 (Slate 900) / #000000 for display
- Body text: #4b5563 (Slate 600)
- Border / hairline: #e6e8eb
- Section background: #f9fafb
- Accent (vermilion): #fc4a2b
- primary action: no distinct CTA color

## 3-5 Example Component Prompts

1. **Hero Section**: White (#ffffff) background. Eyebrow in IBM Plex Mono 11px 600 uppercase, +0.15em tracking, #4b5563. Headline in Inter Display 800, 96px, line-height 1.0, letter-spacing -0.035em, color #000000. Subtext in Inter 400, 18px, line-height 1.46, #4b5563. Row of 6 pill-shaped capability tags below: white fill, 1px solid #e6e8eb, 9999px radius, Inter 500 14px #111827, 6px 16px padding. primary action: no distinct CTA color

2. **Feature Card Grid**: 3-column grid, 24px gap. Each card: white background, 10px radius, 1px solid #e6e8eb, 24px padding. Icon at top in #fc4a2b (24px, line-weight). Heading: Inter 700, 20px, #000000. Body: Inter 400, 16px, line-height 1.5, #4b5563.

3. **Testimonial Card**: Full-width card, 16px radius, no border. Left half: photograph with warm gradient overlay (linear-gradient 268deg from #ff7e67 to #fff3f1). Right half: white background, 32px padding. Company logo at top in #111827. Quote in Inter 500, 16px, #374151. Attribution row: 40px circular avatar + name in Inter 600 14px #000000 + role in Inter 400 13px #6b7280.

4. **Product Preview Block**: Full-bleed section with vermilion-to-coral linear gradient background (linear-gradient(268.33deg, #fc4a2b, #ff7e67, #ffac9e, #ffe5e0)). Centered white product card floating on the gradient: 16px radius, browser-chrome mockup with tabs labeled in Inter 500 13px #4b5563, white content area with 24px padding, elevation shadow 0 50px 100px -20px rgba(50,50,92,0.05).

5. **Customer Logo Grid**: 4-column grid, 24px row gap, 40px column gap. All logos rendered in #111827 or pure black, centered in their cells. No boxes, no borders, no color. Logos sized to 120px max-width. Section preceded by IBM Plex Mono 11px 600 uppercase eyebrow in #6b7280.

## Typography Philosophy

The system uses a two-voice typographic strategy: Inter Display 800 at massive sizes for editorial authority, and Inter 400-600 for functional UI. The contrast between a 96px display headline and 14px body text is the system's primary visual mechanism — the more extreme the scale jump, the more confident the design feels. IBM Plex Mono introduces a third voice: mechanical, wide-tracked, uppercase metadata that frames content as labeled and categorized rather than flowing. Source Serif 4 appears only in pull-quote moments to add human texture. Negative letter-spacing is used aggressively at display sizes (-0.035em) and gently at body sizes (-0.01em to -0.03em) — the system tightens as it scales up, creating compressed, high-density type blocks.

## Accent Discipline

The vermilion accent (#fc4a2b) follows a strict 5% rule: it should appear on no more than 5% of any given screen's pixel area. It manifests as: (1) 2px border or stroke on one element per section, (2) small icon fills on active or highlighted states, (3) the full-bleed gradient band behind product previews, and (4) the 2px focus ring on form inputs. It never appears as a filled button, a large background, or body text. The only exception is the product preview gradient bar, which is the page's single chromatic moment. This discipline is what makes the orange feel like a signal rather than decoration.

## Similar Brands

- **Linear** — Same editorial display-headline approach with oversized grotesque type, minimal color palette, and pill-shaped feature tags floating above product previews
- **Vercel** — Shared monochrome-on-white aesthetic with a single chromatic accent and massive centered display headlines, though Vercel uses a cooler palette
- **Pitch** — Similar pill-tag navigation above product screenshots, warm accent against white, and confident typographic scale
- **Notion** — Same generous whitespace philosophy, monochrome-by-default interface with restrained color accents, and editorial headline treatment
- **Framer** — Both use a single warm accent color against pure white with oversized display type, floating element tags, and product-preview-as-hero layouts

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-vermilion-flame: #fc4a2b;
  --gradient-vermilion-flame: linear-gradient(268.33deg, rgb(252, 74, 43), rgb(255, 126, 103), rgb(255, 172, 158), rgb(255, 206, 198));
  --color-ember-pulse: #ea3718;
  --color-tangerine-signal: #f97316;
  --color-coral-blush: #ffac9e;
  --color-peach-mist: #ffe5e0;
  --color-apricot-wash: #ffedd5;
  --color-brick-alert: #dc2626;
  --color-forest-confirm: #15803d;
  --color-ink-black: #000000;
  --color-slate-900: #111827;
  --color-slate-700: #374151;
  --color-slate-600: #4b5563;
  --color-slate-500: #6b7280;
  --color-paper-white: #ffffff;
  --color-fog-whisper: #f9fafb;
  --color-mist-gray: #f2f3f5;
  --color-ash-border: #e6e8eb;
  --color-coral-wash-gradient: #ff7e67;
  --gradient-coral-wash-gradient: linear-gradient(268.33deg, rgb(255, 126, 103), rgb(255, 206, 198), rgb(255, 229, 224), rgb(255, 243, 241));

  /* Typography — Font Families */
  --font-sans-serif: 'sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter-display: 'Inter Display', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-ibm-plex-mono: 'IBM Plex Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-source-serif-4: 'Source Serif 4', ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.2;
  --tracking-caption: -0.01px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.01px;
  --text-subheading: 18px;
  --leading-subheading: 1.46;
  --tracking-subheading: -0.014px;
  --text-heading-sm: 20px;
  --leading-heading-sm: 1.6;
  --tracking-heading-sm: -0.02px;
  --text-heading: 24px;
  --leading-heading: 1.43;
  --tracking-heading: -0.03px;
  --text-display: 96px;
  --leading-display: 1;
  --tracking-display: -0.035px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
  --font-weight-extrabold: 800;

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
  --spacing-72: 72px;
  --spacing-80: 80px;
  --spacing-104: 104px;
  --spacing-120: 120px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 24px;
  --element-gap: 8px;

  /* Border Radius */
  --radius-sm: 1.5px;
  --radius-md: 6px;
  --radius-lg: 10px;
  --radius-2xl: 16px;
  --radius-3xl: 24px;
  --radius-3xl-2: 36px;
  --radius-full: 50px;
  --radius-full-2: 100px;
  --radius-full-3: 9999px;

  /* Named Radii */
  --radius-nav: 6px;
  --radius-hero: 16px;
  --radius-tags: 9999px;
  --radius-cards: 10px;
  --radius-inputs: 6px;
  --radius-buttons: 6px;

  /* Shadows */
  --shadow-md: rgba(0, 0, 0, 0.1) 0px 6px 9px 0px;
  --shadow-subtle: rgba(75, 85, 99, 0.2) 0px 0px 0px 1px;
  --shadow-xl: rgba(50, 50, 92, 0.05) 0px 50px 100px -20px, rgba(0, 0, 0, 0.15) 0px 30px 60px -30px;
  --shadow-subtle-2: rgb(252, 74, 43) 0px 0px 0px 2px;
  --shadow-subtle-3: rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;
  --shadow-subtle-4: rgba(75, 85, 99, 0.2) 0px 0px 0px 1px, rgba(0, 0, 0, 0.06) 0px 2px 2px 0px;
  --shadow-subtle-5: rgb(17, 24, 39) 0px 0px 0px 1px;
  --shadow-subtle-6: rgba(0, 0, 0, 0.05) 0px 1px 2px 0px, rgba(75, 85, 99, 0.2) 0px 0px 0px 1px;
  --shadow-subtle-7: rgba(0, 0, 0, 0.1) 0px 1px 2px 0px inset, rgb(249, 250, 251) 0px 0px 0px 10px;
  --shadow-subtle-8: rgb(255, 255, 255) 0px 0px 0px 1px;

  /* Surfaces */
  --surface-canvas: #ffffff;
  --surface-fog-band: #f9fafb;
  --surface-mist-card: #f2f3f5;
  --surface-warm-tint: #ffe5e0;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-vermilion-flame: #fc4a2b;
  --color-ember-pulse: #ea3718;
  --color-tangerine-signal: #f97316;
  --color-coral-blush: #ffac9e;
  --color-peach-mist: #ffe5e0;
  --color-apricot-wash: #ffedd5;
  --color-brick-alert: #dc2626;
  --color-forest-confirm: #15803d;
  --color-ink-black: #000000;
  --color-slate-900: #111827;
  --color-slate-700: #374151;
  --color-slate-600: #4b5563;
  --color-slate-500: #6b7280;
  --color-paper-white: #ffffff;
  --color-fog-whisper: #f9fafb;
  --color-mist-gray: #f2f3f5;
  --color-ash-border: #e6e8eb;
  --color-coral-wash-gradient: #ff7e67;

  /* Typography */
  --font-sans-serif: 'sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter-display: 'Inter Display', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-ibm-plex-mono: 'IBM Plex Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-source-serif-4: 'Source Serif 4', ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.2;
  --tracking-caption: -0.01px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.01px;
  --text-subheading: 18px;
  --leading-subheading: 1.46;
  --tracking-subheading: -0.014px;
  --text-heading-sm: 20px;
  --leading-heading-sm: 1.6;
  --tracking-heading-sm: -0.02px;
  --text-heading: 24px;
  --leading-heading: 1.43;
  --tracking-heading: -0.03px;
  --text-display: 96px;
  --leading-display: 1;
  --tracking-display: -0.035px;

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
  --spacing-72: 72px;
  --spacing-80: 80px;
  --spacing-104: 104px;
  --spacing-120: 120px;

  /* Border Radius */
  --radius-sm: 1.5px;
  --radius-md: 6px;
  --radius-lg: 10px;
  --radius-2xl: 16px;
  --radius-3xl: 24px;
  --radius-3xl-2: 36px;
  --radius-full: 50px;
  --radius-full-2: 100px;
  --radius-full-3: 9999px;

  /* Shadows */
  --shadow-md: rgba(0, 0, 0, 0.1) 0px 6px 9px 0px;
  --shadow-subtle: rgba(75, 85, 99, 0.2) 0px 0px 0px 1px;
  --shadow-xl: rgba(50, 50, 92, 0.05) 0px 50px 100px -20px, rgba(0, 0, 0, 0.15) 0px 30px 60px -30px;
  --shadow-subtle-2: rgb(252, 74, 43) 0px 0px 0px 2px;
  --shadow-subtle-3: rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;
  --shadow-subtle-4: rgba(75, 85, 99, 0.2) 0px 0px 0px 1px, rgba(0, 0, 0, 0.06) 0px 2px 2px 0px;
  --shadow-subtle-5: rgb(17, 24, 39) 0px 0px 0px 1px;
  --shadow-subtle-6: rgba(0, 0, 0, 0.05) 0px 1px 2px 0px, rgba(75, 85, 99, 0.2) 0px 0px 0px 1px;
  --shadow-subtle-7: rgba(0, 0, 0, 0.1) 0px 1px 2px 0px inset, rgb(249, 250, 251) 0px 0px 0px 10px;
  --shadow-subtle-8: rgb(255, 255, 255) 0px 0px 0px 1px;
}
```
