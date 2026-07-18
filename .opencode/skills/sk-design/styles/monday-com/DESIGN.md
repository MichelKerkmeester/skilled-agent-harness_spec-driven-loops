# monday.com — Style Reference
> white workshop with pastel sticky notes

**Theme:** light

monday.com runs a white-canvas productivity language with violet as its singular brand voice. The page breathes through generous whitespace, near-black typography, and pastel-colored card surfaces that borrow from a crayon-box palette — soft green, powder blue, peach, lavender, mint — creating a playful, human feeling that contrasts the serious SaaS market. Violet (#6161ff) owns the primary action and brand surfaces, while gradient text (pink→orange, cyan→violet) carries the hero's emotional charge. Components are pill-shaped and generously rounded: 160px buttons, 24px cards, 6px tags. The visual rhythm alternates between flat text-heavy sections and elevated product/board mockups that peek above the page edge, blurring the boundary between marketing and product.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Monday Violet | `#6161ff` | `--color-monday-violet` | Primary CTA buttons, brand backgrounds, active states, gradient stops — saturated indigo reads as confident but approachable, not corporate |
| Ink | `#333333` | `--color-ink` | Primary body text, headings, button labels — near-black with a hint of warmth avoids the harshness of pure #000 |
| Slate | `#535768` | `--color-slate` | Secondary text, nav links, icon fills, footer copy — cool gray supports hierarchy without competing with headings |
| Iron | `#808080` | `--color-iron` | Muted helper text, disabled icon strokes, tertiary borders |
| Fog | `#cacbcd` | `--color-fog` | Card and container borders, subtle dividers between content blocks |
| Mist | `#d0d4e4` | `--color-mist` | Light card borders, the standard outline color for elevated card surfaces |
| Pebble | `#dddfeb` | `--color-pebble` | Badge borders, pill-button outlines, input borders |
| Cloud | `#f5f6f8` | `--color-cloud` | Page canvas, section backgrounds, neutral button fills — the floor color everything floats on |
| Snow | `#ffffff` | `--color-snow` | Card surfaces, button text, nav background, input fields |
| Shadow Dust | `#e6e7ea` | `--color-shadow-dust` | Box-shadow tint, barely-there surface lifts |
| Mint | `#bcfe90` | `--color-mint` | Green wash for highlight backgrounds, decorative bands, and soft emphasis behind content |
| Sky | `#abf0ff` | `--color-sky` | Blue wash for highlight backgrounds, decorative bands, and soft emphasis behind content |
| Apricot | `linear-gradient(90deg, rgb(254, 129, 228), rgb(254, 129, 228) 31%, rgb(253, 169, 0) 88%)` | `--color-apricot` | Orange wash for highlight backgrounds, decorative bands, and soft emphasis behind content; Hero headline gradient stop, warm accent in pink-to-orange text |
| Lavender | `#eddff7` | `--color-lavender` | Decorative card background, soft category surface |
| Periwinkle | `#e7ecff` | `--color-periwinkle` | Decorative card background, light brand-tinted surface |
| Cornflower | `#93beff` | `--color-cornflower` | Decorative card background, secondary brand surface |
| Aqua | `#d1faff` | `--color-aqua` | Decorative card background, cyan accent surface |
| Cotton Candy | `#e98dfe` | `--color-cotton-candy` | Card border accent, playful highlight stroke |
| Ultra Violet | `#9450fd` | `--color-ultra-violet` | Saturated button alternative, deep brand accent |
| Electric Cyan | `#3ac9ff` | `--color-electric-cyan` | Saturated button alternative, AI/feature highlight |
| Forest | `#2a5c4e` | `--color-forest` | Teal action color for filled buttons, selected navigation states, and focused conversion moments |
| Peony | `#fcd0f8` | `--color-peony` | Saturated button alternative, soft pink fill |
| Periwinkle Wash | `#dbdbff` | `--color-periwinkle-wash` | Badge and tag background — tints pill elements with brand warmth |
| Prism | `conic-gradient(from 270deg, rgb(129, 129, 255) 15%, rgb(51, 219, 219) 40%, rgb(51, 213, 142) 55%, rgb(255, 214, 51) 65%, rgb(252, 82, 125) 85%, rgb(129, 129, 255) 100%)` | `--color-prism` | Supporting palette color for small decorative accents when the core palette needs contrast. |

## Tokens — Typography

### Poppins — Sole typeface — used for all nav, body, headings, buttons, badges, and product UI. Geometric humanist sans with friendly rounded terminals; the rounded forms harmonize with the pill buttons and 24px card radii, making the whole UI feel approachable. Weight 300 for display headlines creates a soft, modern presence; weight 700 for nav and button labels carries authority without heaviness. · `--font-poppins`
- **Substitute:** Manrope, DM Sans, Plus Jakarta Sans
- **Weights:** 300, 400, 500, 700
- **Sizes:** 8, 12, 13, 14, 16, 18, 20, 22, 24, 28, 32, 36, 40, 48, 52, 56, 64
- **Line height:** 1.15–2.46
- **Letter spacing:** Negative tracking tightens large display: -0.04em at 64px, -0.02em at 48–56px, -0.015em at 28–40px, -0.01em at body sizes. Positive +0.2em appears for small uppercase labels (likely 8–12px tracking for eyebrow text).
- **Role:** Sole typeface — used for all nav, body, headings, buttons, badges, and product UI. Geometric humanist sans with friendly rounded terminals; the rounded forms harmonize with the pill buttons and 24px card radii, making the whole UI feel approachable. Weight 300 for display headlines creates a soft, modern presence; weight 700 for nav and button labels carries authority without heaviness.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.45 | -0.12px | `--text-caption` |
| body-sm | 14px | 1.5 | — | `--text-body-sm` |
| body | 16px | 1.5 | -0.16px | `--text-body` |
| subheading | 20px | 1.4 | -0.22px | `--text-subheading` |
| heading-sm | 24px | 1.3 | -0.36px | `--text-heading-sm` |
| heading | 36px | 1.2 | -0.54px | `--text-heading` |
| heading-lg | 48px | 1.15 | -0.96px | `--text-heading-lg` |
| display | 64px | 1.15 | -2.56px | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 8px

**Density:** comfortable

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
| 96 | 96px | `--spacing-96` |

### Border Radius

| Element | Value |
|---------|-------|
| nav | 6px |
| cards | 24px |
| badges | 6px |
| images | 12px |
| inputs | 6px |
| buttons | 160px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| xl | `rgba(205, 208, 223, 0.4) 0px 2px 48px 0px` | `--shadow-xl` |
| xl-2 | `rgba(0, 0, 0, 0.15) 0px 5px 45px 0px` | `--shadow-xl-2` |
| xl-3 | `rgba(0, 0, 0, 0.15) 0px 4px 40px 0px` | `--shadow-xl-3` |
| xl-4 | `rgba(0, 0, 0, 0.4) 0px 5px 55px 0px` | `--shadow-xl-4` |
| subtle | `rgb(0, 0, 0) 0px -2px 0px 0px inset` | `--shadow-subtle` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 64px
- **Card padding:** 24px
- **Element gap:** 8px

## Components

### Primary Pill Button
**Role:** Main CTA — the most prominent action on any page

Filled violet #6161ff background, white text in Poppins 16px weight 500, 160px border-radius (full pill), 13px vertical / 24px horizontal padding, inline arrow icon. Drives the hero 'Get Started' and any conversion moment.

### Outlined Pill Button
**Role:** Secondary CTA — paired with the primary to offer a lower-commitment path

Transparent background, 1px #535768 border, 160px border-radius, 13px vertical / 20px horizontal padding, Ink text. Used for 'Contact sales' next to the primary CTA.

### Text Link Button
**Role:** Tertiary action in nav and inline text

No background or border, Slate (#535768) text weight 500, often paired with a dropdown chevron. 8–10px horizontal padding for nav items.

### Pastel Feature Card
**Role:** Icon-and-text card used in feature grids and exploration menus

Soft-tinted background (one of the accent palette: Mint, Sky, Apricot, Lavender, Periwinkle, Aqua), 24px border-radius, 24px internal padding, small monochrome icon, Poppins 16px weight 500 label. The 2:3 aspect ratio card is the system's workhorse tile.

### Board Mockup Card
**Role:** Product showcase — embedded board UI that floats above the page edge

White #ffffff surface, Mist (#d0d4e4) 1px border, 16–24px radius, soft shadow rgba(205,208,223,0.4) 0 2px 48px. Contains monday.com board rows with colored status pills and avatar stacks.

### AI Prompt Card
**Role:** Interactive AI input card for the Sidekick feature

White surface, 6px radius, 12–16px padding, with a left brand-color icon, placeholder text in Slate, mic and send icons on the right. Hovers with subtle shadow lift.

### Brand Gradient Panel
**Role:** Full-bleed brand-colored section that frames product mockups

Violet #6161ff background fills the entire right column, white card sits on top with 24px radius. Used in the AI section to create a 50/50 split with visual contrast against the white left column.

### Status Pill
**Role:** Inline metadata badge in board rows and lists

Small pill (6px radius), tinted background matching status color (green/mint for done, orange for working, blue for stuck, red for stuck). Poppins 12–13px weight 500 label, 2px vertical / 8px horizontal padding.

### Avatar Stack
**Role:** Social/collaboration indicator in board rows

Circular avatars (full radius), 24–32px diameter, white 2px border separating overlapping members, slight negative margin between them.

### Logo Strip
**Role:** Social proof — 'Trusted by Fortune 500' row

Single-row horizontal layout of monochrome black wordmarks at ~60% opacity, centered, generous horizontal spacing. No card backgrounds or dividers between logos.

### Exploration Grid Card
**Role:** 'What would you like to explore?' category picker

White card, Mist 1px border, 6px radius, small square icon, 2-line Poppins label. Arranged in a 3-column grid on white panel with subtle shadow.

### Navigation Bar
**Role:** Top-level site navigation

White #ffffff background, sticky top, 8px vertical / 16px horizontal padding for nav items, monday.com wordmark on left, primary actions ('Contact sales' outlined, 'Get Started' filled) on right. Logo uses full-color spectrum conic gradient mark.

## Do's and Don'ts

### Do
- Use 160px border-radius for all buttons and CTAs — the pill shape is non-negotiable and defines the brand's friendly tone
- Reserve #6161ff for primary actions and brand panels; let it carry the most important decision on every screen
- Apply pastel accent backgrounds (Mint, Sky, Apricot, Lavender) to feature cards, not to buttons or text
- Set display headlines at 48–64px Poppins weight 300 with negative letter-spacing (-0.04em to -0.02em) — thin geometric headlines distinguish this from typical 700-weight SaaS heroes
- Use 24px radius for cards and 6px for badges/inputs — keep these two tiers consistent
- Apply the conic-gradient prism (#8181ff → teal → green → yellow → pink → back to violet) to brand dividers, the logo mark, and loading states only
- Use gradient text (pink→orange or cyan→violet) exclusively on hero headlines to inject warmth into the white canvas

### Don't
- Don't use square or 4px-radius buttons — the pill shape is the signature
- Don't apply pastel accent colors to body text, borders, or icons — they are surface treatments only
- Don't set type below weight 400 for body or below 500 for UI labels — weight 300 is reserved for display headlines
- Don't use pure #000000 for large text blocks — #333333 is warmer and reads as the system's true black
- Don't stack more than 3-4 pastel colors in adjacent cards — pick a 2-3 color accent set per section
- Don't use heavy drop shadows on cards — the system uses a single soft 48px-blur lavender-tinted shadow at 40% opacity
- Don't introduce new chromatic CTA colors — #6161ff is the single action color; saturated button alternatives exist for product UI, not marketing

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas | `#f5f6f8` | Page background — the soft warm-gray floor that sections sit on |
| 1 | Card | `#ffffff` | Standard card and component surface — the dominant elevated plane |
| 2 | Brand Panel | `#6161ff` | Full-bleed brand-colored section creating visual contrast for embedded product |
| 3 | Tinted Accent | `#bcfe90` | Pastel category surface for feature cards and exploration tiles |

## Elevation

- **Card / Board Mockup:** `rgba(205, 208, 223, 0.4) 0px 2px 48px 0px`
- **Elevated Card (hover/featured):** `rgba(0, 0, 0, 0.15) 0px 5px 45px 0px`
- **AI Prompt Card (active):** `rgba(0, 0, 0, 0.15) 0px 4px 40px 0px`

## Imagery

Visuals are dominated by product UI mockups — actual monday.com board screens with colored status pills, avatar stacks, and AI sidebar panels — rather than photography or illustration. The product IS the hero: boards peek above section edges at skewed angles, creating a 'leaking into the marketing page' effect. Logo strip uses monochrome black wordmarks. No lifestyle photography, no human portraits, no stock imagery. The only decorative visual is the conic-gradient prism mark in the logo.

## Layout

Max-width ~1200px centered content with full-bleed product mockups that break the container. Hero is a centered single-column headline with gradient text and one CTA. Below: social-proof logo strip, then alternating 2-column text+product sections. The AI feature uses a 50/50 split with a violet brand panel on the right housing a product mockup. Vertical rhythm is generous (64px section gaps) with soft gray bands (#f5f6f8) breaking up white sections. Navigation is a single sticky white top bar with logo left, links center, dual CTAs right. No sidebar, no mega-menu visible on this page.

## Agent Prompt Guide

primary action: #6161ff (filled action)
Create a Primary Action Button: #6161ff background, #ffffff text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.
## Quick Color Reference
- Primary text: #333333
- Secondary text: #535768
- Page background: #f5f6f8
- Card surface: #ffffff
- Card border: #d0d4e4
- Brand accent: #6161ff

## 5 Example Component Prompts


2. **Pastel Feature Card**: Background #abf0ff (or one of the accent palette: #bcfe90, #ff8940, #eddff7, #93beff, #d1faff). 24px border-radius. 24px internal padding. Small monochrome icon top-left, Poppins 16px weight 500 label below in #333333.

3. **Board Mockup Card**: White #ffffff surface, 1px #d0d4e4 border, 24px border-radius, soft shadow rgba(205,208,223,0.4) 0 2px 48px. Contains rows with colored status pills (6px radius, tinted backgrounds like #bcfe90, #ff8940) and circular avatar stacks.

4. **AI Prompt Card**: White surface, 6px border-radius, 16px padding, brand-color icon left, placeholder text 'Analyze sales pipeline' in Poppins 16px weight 500 #333333, mic and send icons right.

5. **Logo Trust Strip**: Centered eyebrow text 16px Poppins weight 400 #535768 reading 'Trusted by over 60% of the Fortune 500'. Below: single horizontal row of 7–8 monochrome black wordmarks (Holt Renfrew, Universal, Coca-Cola, Lionsgate, Carrefour, BD, Glossier style) at ~60% opacity, generous 32–48px gap between logos, no dividers.

## Gradient System

Gradients serve three roles: (1) **Hero headline text** — linear pink-to-orange #fe81e4 → #fda900 injected into display copy to create emotional warmth against the white canvas. (2) **Brand prism** — conic gradient cycling violet → teal → green → yellow → pink → violet, used only for the logo mark and divider lines, never as a surface fill. (3) **CTA and illustration accent gradients** — short 2-stop linear gradients (cyan→violet, orange→pink) used sparingly on dark product panels and feature illustrations. Gradients are never applied to body text or button backgrounds.

## Component Visual Language

The system follows a **flat-with-soft-shadow** approach: components are mostly flat-shaded with surfaces distinguished by pastel background tints rather than borders or heavy elevation. The single soft lavender-tinted shadow (rgba(205,208,223,0.4) 0 2px 48px) lifts cards just enough to read as elevated without introducing the 'skeuomorphic card stack' look. Buttons are fully filled (no outline-first patterns) and rely on the pill radius for personality. The visual density is low — generous internal padding (24px in cards, 13–16px in buttons) and 64px between sections — making the system feel like a spacious workshop rather than a dense dashboard.

## Similar Brands

- **Asana** — Same product-as-hero pattern with embedded UI mockups and generous whitespace, though Asana leans warmer/coral while monday.com owns violet
- **Notion** — Both use soft pastel card surfaces and playful multi-color category tiles, though Notion is more text-dense and monday.com is more visually bold
- **ClickUp** — Similar feature-rich SaaS marketing with product screenshots breaking the page boundary, though ClickUp's palette is more saturated and monday.com stays pastel
- **Linear** — Shared single-accent-color brand strategy (Linear's purple = monday.com's violet) with minimal chrome and geometric sans typography
- **Airtable** — Comparable 'friendly enterprise' positioning with colored record-type cards, though Airtable uses sharper corners and a wider accent palette

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-monday-violet: #6161ff;
  --color-ink: #333333;
  --color-slate: #535768;
  --color-iron: #808080;
  --color-fog: #cacbcd;
  --color-mist: #d0d4e4;
  --color-pebble: #dddfeb;
  --color-cloud: #f5f6f8;
  --color-snow: #ffffff;
  --color-shadow-dust: #e6e7ea;
  --color-mint: #bcfe90;
  --color-sky: #abf0ff;
  --color-apricot: #ff8940;
  --gradient-apricot: linear-gradient(90deg, rgb(254, 129, 228), rgb(254, 129, 228) 31%, rgb(253, 169, 0) 88%);
  --color-lavender: #eddff7;
  --color-periwinkle: #e7ecff;
  --color-cornflower: #93beff;
  --color-aqua: #d1faff;
  --color-cotton-candy: #e98dfe;
  --color-ultra-violet: #9450fd;
  --color-electric-cyan: #3ac9ff;
  --color-forest: #2a5c4e;
  --color-peony: #fcd0f8;
  --color-periwinkle-wash: #dbdbff;
  --color-prism: #8181ff;
  --gradient-prism: conic-gradient(from 270deg, rgb(129, 129, 255) 15%, rgb(51, 219, 219) 40%, rgb(51, 213, 142) 55%, rgb(255, 214, 51) 65%, rgb(252, 82, 125) 85%, rgb(129, 129, 255) 100%);

  /* Typography — Font Families */
  --font-poppins: 'Poppins', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.45;
  --tracking-caption: -0.12px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.5;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.16px;
  --text-subheading: 20px;
  --leading-subheading: 1.4;
  --tracking-subheading: -0.22px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.3;
  --tracking-heading-sm: -0.36px;
  --text-heading: 36px;
  --leading-heading: 1.2;
  --tracking-heading: -0.54px;
  --text-heading-lg: 48px;
  --leading-heading-lg: 1.15;
  --tracking-heading-lg: -0.96px;
  --text-display: 64px;
  --leading-display: 1.15;
  --tracking-display: -2.56px;

  /* Typography — Weights */
  --font-weight-light: 300;
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-bold: 700;

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
  --spacing-96: 96px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 64px;
  --card-padding: 24px;
  --element-gap: 8px;

  /* Border Radius */
  --radius-md: 6px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-3xl: 24px;
  --radius-3xl-2: 40px;
  --radius-full: 100px;
  --radius-full-2: 160px;

  /* Named Radii */
  --radius-nav: 6px;
  --radius-cards: 24px;
  --radius-badges: 6px;
  --radius-images: 12px;
  --radius-inputs: 6px;
  --radius-buttons: 160px;

  /* Shadows */
  --shadow-xl: rgba(205, 208, 223, 0.4) 0px 2px 48px 0px;
  --shadow-xl-2: rgba(0, 0, 0, 0.15) 0px 5px 45px 0px;
  --shadow-xl-3: rgba(0, 0, 0, 0.15) 0px 4px 40px 0px;
  --shadow-xl-4: rgba(0, 0, 0, 0.4) 0px 5px 55px 0px;
  --shadow-subtle: rgb(0, 0, 0) 0px -2px 0px 0px inset;

  /* Surfaces */
  --surface-canvas: #f5f6f8;
  --surface-card: #ffffff;
  --surface-brand-panel: #6161ff;
  --surface-tinted-accent: #bcfe90;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-monday-violet: #6161ff;
  --color-ink: #333333;
  --color-slate: #535768;
  --color-iron: #808080;
  --color-fog: #cacbcd;
  --color-mist: #d0d4e4;
  --color-pebble: #dddfeb;
  --color-cloud: #f5f6f8;
  --color-snow: #ffffff;
  --color-shadow-dust: #e6e7ea;
  --color-mint: #bcfe90;
  --color-sky: #abf0ff;
  --color-apricot: #ff8940;
  --color-lavender: #eddff7;
  --color-periwinkle: #e7ecff;
  --color-cornflower: #93beff;
  --color-aqua: #d1faff;
  --color-cotton-candy: #e98dfe;
  --color-ultra-violet: #9450fd;
  --color-electric-cyan: #3ac9ff;
  --color-forest: #2a5c4e;
  --color-peony: #fcd0f8;
  --color-periwinkle-wash: #dbdbff;
  --color-prism: #8181ff;

  /* Typography */
  --font-poppins: 'Poppins', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.45;
  --tracking-caption: -0.12px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.5;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.16px;
  --text-subheading: 20px;
  --leading-subheading: 1.4;
  --tracking-subheading: -0.22px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.3;
  --tracking-heading-sm: -0.36px;
  --text-heading: 36px;
  --leading-heading: 1.2;
  --tracking-heading: -0.54px;
  --text-heading-lg: 48px;
  --leading-heading-lg: 1.15;
  --tracking-heading-lg: -0.96px;
  --text-display: 64px;
  --leading-display: 1.15;
  --tracking-display: -2.56px;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-96: 96px;

  /* Border Radius */
  --radius-md: 6px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-3xl: 24px;
  --radius-3xl-2: 40px;
  --radius-full: 100px;
  --radius-full-2: 160px;

  /* Shadows */
  --shadow-xl: rgba(205, 208, 223, 0.4) 0px 2px 48px 0px;
  --shadow-xl-2: rgba(0, 0, 0, 0.15) 0px 5px 45px 0px;
  --shadow-xl-3: rgba(0, 0, 0, 0.15) 0px 4px 40px 0px;
  --shadow-xl-4: rgba(0, 0, 0, 0.4) 0px 5px 55px 0px;
  --shadow-subtle: rgb(0, 0, 0) 0px -2px 0px 0px inset;
}
```
