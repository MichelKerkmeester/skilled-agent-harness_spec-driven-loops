# Grain — Style Reference
> frosted glass desk with a single green pen

**Theme:** light

Grain's design system is a quiet, near-monochrome productivity canvas where a single confident green does all the talking. The interface behaves like a high-end workspace app: spacious white surfaces, hairline borders, and soft drop shadows create depth without weight, while Inter handles nearly all UI text with measured, slightly tightened tracking. Color is rationed — the vivid green appears only on the primary download action and as subtle background washes, never as decoration. Component density is comfortable but information-rich: cards feel like documents rather than buttons, and product screenshots float in the page with generous radius and minimal frame. The distinctive choice is using Poppins weight 600 for section display titles against an Inter body, creating a typographic contrast where the heading style shifts register from the rest of the page. Overall the system feels like a well-organized analyst's desk: precise, restrained, and engineered for serious work.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Forest Ink | `#009959` | `--color-forest-ink` | Primary action — filled download buttons, outlined CTAs, and active nav indicators carry this deep botanical green that reads as decisive without aggression |
| Vine | `#00b96c` | `--color-vine` | Soft surface accent and gradient wash for feature sections — the mid-tone green that fades into the white canvas as ambient atmosphere |
| Neon Sprout | `#00ff95` | `--color-neon-sprout` | Decorative illustration fill and gradient endpoint — appears only inside brand graphics, never on UI controls |
| Ice Blue | `#3de1ff` | `--color-ice-blue` | Decorative illustration fill for brand mark and app icon glyphs — companion to Neon Sprout in the visual identity |
| Obsidian | `#000000` | `--color-obsidian` | Primary text, heavy borders, and the dominant hairline divider color throughout the layout |
| Graphite | `#141414` | `--color-graphite` | Headline text and dark surface text — near-black with slight warmth for large display type |
| Carbon | `#313232` | `--color-carbon` | Secondary text, image overlays, and dark UI text on light backgrounds — the workhorse body tone |
| Slate | `#545454` | `--color-slate` | Body text helper copy and tertiary borders |
| Fog | `#707070` | `--color-fog` | Muted body text and subtle border tone for de-emphasized content |
| Ash | `#949494` | `--color-ash` | Icon strokes, placeholder text, and low-priority text color |
| Mist | `#d6d6d6` | `--color-mist` | Button borders and faint dividers — barely-there structural lines |
| Cloud | `#e6e6e6` | `--color-cloud` | Button background tint and elevated surface base |
| Veil | `#f0f0f0` | `--color-veil` | Hover states, tag backgrounds, and section background tint — the next surface above the canvas |
| Paper | `#fafafa` | `--color-paper` | Page canvas and card surfaces — the dominant background that everything floats on |

## Tokens — Typography

### Inter Variable — Universal UI font — handles all navigation, body, button, card, and heading text from 12px captions to 36px section headers. Weight 500 carries medium-emphasis labels, weight 600 anchors the heaviest UI elements. Slightly tightened tracking at -0.02em to -0.03em keeps the geometric letterforms feeling engineered rather than soft. · `--font-inter-variable`
- **Substitute:** Inter
- **Weights:** 400, 500, 600
- **Sizes:** 12, 13, 14, 16, 18, 20, 32, 36
- **Line height:** 1.30, 1.43, 1.50, 1.60
- **Letter spacing:** -0.36px at 12px, -0.42px at 14px, -0.32px at 16px, -0.36px at 18px, -0.40px at 20px, -0.96px at 32px, -1.08px at 36px
- **Role:** Universal UI font — handles all navigation, body, button, card, and heading text from 12px captions to 36px section headers. Weight 500 carries medium-emphasis labels, weight 600 anchors the heaviest UI elements. Slightly tightened tracking at -0.02em to -0.03em keeps the geometric letterforms feeling engineered rather than soft.

### Poppins — Display heading font — used exclusively for major section titles like 'Everything your AI agents and team need from meetings'. The weight 600 Poppins at 38px creates a distinct typographic register shift from the Inter body, making section titles feel like editorial headings rather than UI labels. Normal letter-spacing lets the geometric forms breathe. · `--font-poppins`
- **Substitute:** Poppins
- **Weights:** 600
- **Sizes:** 38
- **Line height:** 1.25
- **Role:** Display heading font — used exclusively for major section titles like 'Everything your AI agents and team need from meetings'. The weight 600 Poppins at 38px creates a distinct typographic register shift from the Inter body, making section titles feel like editorial headings rather than UI labels. Normal letter-spacing lets the geometric forms breathe.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 15.6 | -0.36px | `--text-caption` |
| body-sm | 14px | 20 | -0.42px | `--text-body-sm` |
| body | 16px | 24 | -0.32px | `--text-body` |
| subheading | 18px | 27 | -0.36px | `--text-subheading` |
| heading-sm | 20px | 30 | -0.4px | `--text-heading-sm` |
| heading | 32px | 41.6 | -0.96px | `--text-heading` |
| heading-lg | 36px | 46.8 | -1.08px | `--text-heading-lg` |
| display | 38px | 47.5 | — | `--text-display` |

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
| 60 | 60px | `--spacing-60` |
| 72 | 72px | `--spacing-72` |
| 80 | 80px | `--spacing-80` |
| 96 | 96px | `--spacing-96` |

### Border Radius

| Element | Value |
|---------|-------|
| nav | 10px |
| hero | 2px |
| tags | 10px |
| cards | 10px |
| images | 14px |
| buttons | 10px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| sm | `rgba(0, 0, 0, 0.04) 0px 4px 8px 0px` | `--shadow-sm` |
| md | `rgba(0, 0, 0, 0.08) 0px 4px 16px 0px` | `--shadow-md` |
| md-2 | `rgba(0, 0, 0, 0.05) 0px 0px 12px 0px inset` | `--shadow-md-2` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 96px
- **Card padding:** 24px
- **Element gap:** 8px

## Components

### Top Navigation Bar
**Role:** Sticky header containing brand mark, primary nav links, and dual action buttons

White background (#fafafa) with 10px border-radius, 48px height, Inter at 14px weight 500 for nav links in #141414. Right side stacks a ghost 'Login' text link, an outlined 'Book a demo' button, and a filled green 'Download' button. The green Download button reappears as the dominant visual anchor in the top right corner.

### Filled Primary Action Button
**Role:** Highest-priority conversion action — download CTA

Background #009959, white text, 10px border-radius, 12px 20px padding. Inter at 14px weight 500. Includes Apple logo icon prefix at 14px. This is the only filled chromatic button in the system — it carries the entire weight of the primary conversion path.

### Outlined Secondary Button
**Role:** Secondary action for demo requests

White background (#fafafa), 1px border in #d6d6d6, text in #141414, 10px border-radius, 12px 20px padding. Inter at 14px weight 500. Ghost-style — visually quiet, waiting for the filled green button to claim attention.

### Ghost Nav Link
**Role:** Navigation items in the top bar

No background, text in #141414, Inter at 14px weight 500, 8px horizontal padding. Hover state shifts to underline. Includes dropdown items like 'Use Cases', 'Resources', 'Pricing' that expand on click.

### Trust Badge Pill
**Role:** Social proof indicator near the hero headline

White background with 1px border in #fafafa-toned hairline, 10px border-radius, contains a small Google 'G' icon, star rating, and review count. Inter at 12-13px. Sits as a quiet credibility signal above the hero headline.

### Compliance Badge
**Role:** Trust and certification signal above section titles

White pill shape, 10px border-radius, 1px border in #e6e6e6, 12px 16px padding. Contains a small icon plus label like 'SOC 2 audited' or 'GDPR compliant' in Inter at 13px weight 500. Appears in pairs centered above section headers.

### Feature Card
**Role:** Four-column feature grid item explaining product capabilities

White background (#fafafa), 10px border-radius, subtle shadow rgba(0,0,0,0.04) 0px 4px 8px 0px, 24px padding. Contains a 48px icon at top-left in a light gray rounded square, then a bold title in Inter 16-18px weight 600, and a description in Inter 14px weight 400 at #545454. Cards are breathable and document-like, not boxed-in.

### Product Screenshot Frame
**Role:** Hero product visualization with browser/app chrome

Large rounded container at 14px border-radius, thin border, white surface showing the Grain app interface. Contains internal navigation tabs, meeting metadata, and a tabbed summary view. The frame floats with a soft drop shadow rgba(0,0,0,0.08) 0px 4px 16px 0px to separate it from the page.

### Section Display Heading
**Role:** Major section title using the Poppins display font

Poppins weight 600 at 38px, line-height 1.25, color #141414, centered above the section content. This is the only place Poppins appears — the typographic shift from Inter signals editorial gravity and section breaks.

### Video Call Overlay Card
**Role:** Product feature illustration with recording controls

Dark surface (#313232) at 14px border-radius, showing a video call grid with participant thumbnails and a bottom control bar. A floating white card overlays with a 'Stop' button (dark filled), wavefORM audio visualization, and a '32m' timer — demonstrates the recording feature in product.

### Brand Logo Strip
**Role:** Social proof row of customer/partner logos

Horizontal row of grayscale logos at #949494 tone, evenly spaced, no borders or background. Logos include Adobe, Podium, Zapier, Vendra, Pocus, and others. Sits at the bottom of the hero section as a quiet credibility band.

### Feature Detail Split
**Role:** Two-column section with text-left, product-right layout

Left column: small category label badge at top, then a 32px Inter weight 600 headline, followed by a vertical list of 2-3 sub-feature blocks. Each sub-feature has a 14px bold title and 13px body description. Right column: product screenshot or video frame. Generous 96px vertical gap between sections.

## Do's and Don'ts

### Do
- Use #009959 only for the single primary download action — never for secondary buttons, links, or decorative elements
- Set all cards, buttons, nav elements, and tags to 10px border-radius; reserve 14px for product screenshots and 40px for special hero cards
- Apply Poppins weight 600 at 38px exclusively to major section display headings; never use it for body text or UI labels
- Use #fafafa as the universal page and card surface — avoid introducing new whites or grays outside the defined scale
- Maintain hairline 1px borders in #e6e6e6 or #d6d6d6 for structural separation rather than heavy borders or filled backgrounds
- Apply the -0.03em letter-spacing to all display sizes 32px and above; use -0.02em for sizes 20px and below
- Stack sections with 96px vertical gaps and 24px card padding to preserve the spacious, document-like density

### Don't
- Do not use #00ff95 or #3de1ff as UI colors — these are decorative illustration fills only and will look like system errors on actual controls
- Do not use the green gradient as a background fill for cards or sections — it is a subtle wash for hero/section transitions only
- Do not add shadows darker than rgba(0,0,0,0.08) — the system relies on near-invisible elevation, not dramatic depth
- Do not use Poppins for navigation, buttons, or body text — the Inter system is the workhorse; Poppins signals editorial display
- Do not introduce accent colors beyond the green palette — the 1% colorfulness is the design
- Do not use 0px border-radius on any container — every surface in the system is softened
- Do not set body text below 14px or above #545454 in tone — readability depends on this neutral mid-range

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Paper | `#fafafa` | Page canvas — the dominant background for the entire site |
| 2 | Cloud | `#e6e6e6` | Elevated button backgrounds and subtle surface tint |
| 3 | Veil | `#f0f0f0` | Hover states, tag fills, and next-layer surface above the canvas |

## Elevation

- **Feature Card:** `rgba(0, 0, 0, 0.04) 0px 4px 8px 0px`
- **Product Screenshot:** `rgba(0, 0, 0, 0.08) 0px 4px 16px 0px`
- **Card Inset Highlight:** `rgba(0, 0, 0, 0.05) 0px 0px 12px 0px inset`

## Imagery

Product screenshots dominate the visual language — the Grain app interface is shown at large scale in the hero and feature sections, presented as floating framed artifacts with soft shadows and 14px radius. The screenshots are styled like document mockups, not screenshots: clean white app surfaces, precise typography, and browser-chrome details. There is no lifestyle photography, no human subjects outside the video call thumbnails, and no abstract illustration beyond a sparse green gradient wash. A grayscale logo strip provides social proof without color competition. The overall visual density is text-and-screenshot dominant with minimal decoration.

## Layout

The site uses a centered max-width container at 1200px with full-bleed sections that alternate between white canvas and subtle green-tinted washes. The hero splits asymmetrically: text-left (40%) and product screenshot-right (60%) on a white background. Below the hero, sections transition to centered display headings with 4-column feature card grids. Deeper feature sections use a 2-column split (text-left, product-right) that alternates. Vertical rhythm is spacious — 96px section gaps create generous breathing room between blocks. The navigation is a minimal top bar that stays fixed. Footer uses a logo strip approach. The overall flow is editorial-product: large section titles, generous whitespace, and product artifacts as the primary visual content.

## Agent Prompt Guide

**Quick Color Reference**
- text: #141414 (headings), #545454 (body), #707070 (muted)
- background: #fafafa (page), #f0f0f0 (surface), #e6e6e6 (button bg)
- border: #d6d6d6 (buttons), #e6e6e6 (cards), #f0f0f0 (subtle)
- accent: #009959 (primary action), #00b96c (surface wash)
- primary action: #009959 (filled action)

**Example Component Prompts**

1. Create a Primary Action Button: #009959 background, #fafafa text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.

2. Create a 4-column feature card grid. Each card: #fafafa background, 10px radius, shadow rgba(0,0,0,0.04) 0px 4px 8px 0px, 24px padding. Top: 48px icon in a #f0f0f0 rounded square. Title: Inter 16px weight 600 at #141414. Description: Inter 14px weight 400 at #545454. Gap between cards: 24px.

3. Build a section header: centered Poppins 38px weight 600 at #141414, line-height 1.25, normal letter-spacing. Below it, a centered Inter 16px weight 400 subtitle at #545454. Section sits on a #fafafa background with 96px vertical padding.

4. Create a navigation bar: #fafafa background, 64px height, Inter 14px weight 500 nav links at #141414. Right side: ghost 'Login' text link, outlined 'Book a demo' button (1px #d6d6d6 border, 10px radius), filled #009959 'Download' button with Apple icon.

5. Build a trust badge pill: #fafafa background, 10px radius, 1px #e6e6e6 border, 8px 16px padding. Contains a 12px icon and Inter 13px weight 500 label at #545454. Use for compliance and review indicators above headlines.

## Gradient System

The site uses a single subtle gradient: linear-gradient(114deg, rgba(30, 229, 146, 0.15), rgba(0, 128, 74, 0.05)). This is an atmospheric wash applied to section backgrounds, creating a barely-visible green tint that shifts from upper-left to lower-right. Never use this gradient on UI components, cards, or buttons. Its purpose is to give large white sections a faint warmth and directional energy without introducing color competition. Pair it with white card surfaces floating on top to create the 'documents on a tinted desk' effect.

## Typographic Register Shift

Grain uses two distinct typographic voices that should not blend. Inter Variable (400/500/600) is the operational voice — it handles everything from 12px captions to 36px section subheaders with consistent geometric precision. Poppins (600 only) is the editorial voice — reserved for the 38px section display headings that mark major page divisions. The contrast between these two fonts at the section break creates an implicit hierarchy: the eye knows a new section has begun because the typeface changes. Do not introduce Poppins at other sizes or weights, and do not use Inter for display-level headlines.

## Similar Brands

- **Linear** — Same near-monochrome canvas with a single bold accent color, Inter-based typography, and product screenshots as hero imagery
- **Notion** — Spacious white layouts with hairline borders, 10px-radius cards, and Inter as the universal UI font with restrained color usage
- **Loom** — Product-led SaaS with a green primary action, comfortable card density, and large framed product screenshots floating on white
- **Vercel** — Minimalist light theme with near-black text, tight letter-spacing on headlines, and zero decorative color outside the primary accent
- **Pitch** — Editorial-meets-product design language with large display headings, generous 96px section gaps, and a single chromatic brand color

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-forest-ink: #009959;
  --color-vine: #00b96c;
  --color-neon-sprout: #00ff95;
  --color-ice-blue: #3de1ff;
  --color-obsidian: #000000;
  --color-graphite: #141414;
  --color-carbon: #313232;
  --color-slate: #545454;
  --color-fog: #707070;
  --color-ash: #949494;
  --color-mist: #d6d6d6;
  --color-cloud: #e6e6e6;
  --color-veil: #f0f0f0;
  --color-paper: #fafafa;

  /* Typography — Font Families */
  --font-inter-variable: 'Inter Variable', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-poppins: 'Poppins', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 15.6;
  --tracking-caption: -0.36px;
  --text-body-sm: 14px;
  --leading-body-sm: 20;
  --tracking-body-sm: -0.42px;
  --text-body: 16px;
  --leading-body: 24;
  --tracking-body: -0.32px;
  --text-subheading: 18px;
  --leading-subheading: 27;
  --tracking-subheading: -0.36px;
  --text-heading-sm: 20px;
  --leading-heading-sm: 30;
  --tracking-heading-sm: -0.4px;
  --text-heading: 32px;
  --leading-heading: 41.6;
  --tracking-heading: -0.96px;
  --text-heading-lg: 36px;
  --leading-heading-lg: 46.8;
  --tracking-heading-lg: -1.08px;
  --text-display: 38px;
  --leading-display: 47.5;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;

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
  --spacing-60: 60px;
  --spacing-72: 72px;
  --spacing-80: 80px;
  --spacing-96: 96px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 96px;
  --card-padding: 24px;
  --element-gap: 8px;

  /* Border Radius */
  --radius-sm: 2px;
  --radius-lg: 10px;
  --radius-xl: 14px;
  --radius-2xl: 20px;
  --radius-3xl: 24px;
  --radius-3xl-2: 30px;
  --radius-3xl-3: 40px;

  /* Named Radii */
  --radius-nav: 10px;
  --radius-hero: 2px;
  --radius-tags: 10px;
  --radius-cards: 10px;
  --radius-images: 14px;
  --radius-buttons: 10px;

  /* Shadows */
  --shadow-sm: rgba(0, 0, 0, 0.04) 0px 4px 8px 0px;
  --shadow-md: rgba(0, 0, 0, 0.08) 0px 4px 16px 0px;
  --shadow-md-2: rgba(0, 0, 0, 0.05) 0px 0px 12px 0px inset;

  /* Surfaces */
  --surface-paper: #fafafa;
  --surface-cloud: #e6e6e6;
  --surface-veil: #f0f0f0;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-forest-ink: #009959;
  --color-vine: #00b96c;
  --color-neon-sprout: #00ff95;
  --color-ice-blue: #3de1ff;
  --color-obsidian: #000000;
  --color-graphite: #141414;
  --color-carbon: #313232;
  --color-slate: #545454;
  --color-fog: #707070;
  --color-ash: #949494;
  --color-mist: #d6d6d6;
  --color-cloud: #e6e6e6;
  --color-veil: #f0f0f0;
  --color-paper: #fafafa;

  /* Typography */
  --font-inter-variable: 'Inter Variable', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-poppins: 'Poppins', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 15.6;
  --tracking-caption: -0.36px;
  --text-body-sm: 14px;
  --leading-body-sm: 20;
  --tracking-body-sm: -0.42px;
  --text-body: 16px;
  --leading-body: 24;
  --tracking-body: -0.32px;
  --text-subheading: 18px;
  --leading-subheading: 27;
  --tracking-subheading: -0.36px;
  --text-heading-sm: 20px;
  --leading-heading-sm: 30;
  --tracking-heading-sm: -0.4px;
  --text-heading: 32px;
  --leading-heading: 41.6;
  --tracking-heading: -0.96px;
  --text-heading-lg: 36px;
  --leading-heading-lg: 46.8;
  --tracking-heading-lg: -1.08px;
  --text-display: 38px;
  --leading-display: 47.5;

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
  --spacing-60: 60px;
  --spacing-72: 72px;
  --spacing-80: 80px;
  --spacing-96: 96px;

  /* Border Radius */
  --radius-sm: 2px;
  --radius-lg: 10px;
  --radius-xl: 14px;
  --radius-2xl: 20px;
  --radius-3xl: 24px;
  --radius-3xl-2: 30px;
  --radius-3xl-3: 40px;

  /* Shadows */
  --shadow-sm: rgba(0, 0, 0, 0.04) 0px 4px 8px 0px;
  --shadow-md: rgba(0, 0, 0, 0.08) 0px 4px 16px 0px;
  --shadow-md-2: rgba(0, 0, 0, 0.05) 0px 0px 12px 0px inset;
}
```
