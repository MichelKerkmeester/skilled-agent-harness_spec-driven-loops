# AgentQL — Style Reference
> Aurora glow over a midnight terminal

**Theme:** dark

AgentQL operates in a deep-space command-center register: near-black canvas, tightly letter-spaced Figtree display headlines, and a single pair of violet aurora glows (purple + pink radial gradients) that bleed from the hero into the background. The interface is overwhelmingly achromatic — white type, cool-gray secondary text, hairline borders in dark navy — with color reserved for two specific jobs: product surface highlights (a few cards lift into a slightly violet-tinted dark) and accent CTAs (a single blue→violet gradient pill). Components sit on flat dark surfaces with generous padding, rounded to 12px, and rely on heavy dark drop shadows rather than glow for depth. The overall feel is closer to a dark IDE theme than a marketing site — Inter carries the UI, IBM Plex Mono owns code blocks, and Figtree whispers the headlines at weight 500 with tight tracking.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Void | `#0b0c0e` | `--color-void` | Deepest surface layer, page base under hero — the floor of the dark stack |
| Abyss | `#0e111b` | `--color-abyss` | Primary page canvas and most card backgrounds; cool blue-black anchors the whole system |
| Deep Sea | `#0d172b` | `--color-deep-sea` | Elevated card surface — sits one step above the canvas, used for feature and pricing cards |
| Cobalt Panel | `#12244f` | `--color-cobalt-panel` | Highlighted card surface for feature spotlights; a violet-tinted lift that breaks the monochrome rhythm without becoming decorative |
| Frosted Lilac | `#85a6e9` | `--color-frosted-lilac` | Violet wash for highlight backgrounds, decorative bands, and soft emphasis behind content. Do not promote it to the primary CTA color |
| Signal Blue | `#2862d7` | `--color-signal-blue` | Vivid blue link and accent text — the sharp chromatic punctuation against all the dark navy |
| Pulse Violet | `#305fbd` | `--color-pulse-violet` | Mid-saturation violet-blue used in code-syntax blocks and gradient stops |
| Aurora Purple | `radial-gradient(79.43% 95.88% at 38.94% -53.46%, rgba(98, 95, 255, 0.38) 0px, rgba(0, 0, 0, 0))` | `--color-aurora-purple` | Supporting palette color for small decorative accents when the core palette needs contrast. Do not promote it to the primary CTA color |
| Plasma Pink | `radial-gradient(27.99% 22.08% at 72.13% 103.46%, rgba(255, 125, 218, 0.33) 0px, rgba(0, 0, 0, 0))` | `--color-plasma-pink` | Secondary hero glow bleeding from bottom-right — warm counterpoint to the aurora purple |
| Quartz | `#ffffff` | `--color-quartz` | Primary text and primary CTA fill — high-contrast white against the dark canvas |
| Ash | `#abaebb` | `--color-ash` | Secondary text and subtle hairline borders — the most-used neutral after white |
| Mist | `#c7c9d1` | `--color-mist` | Tertiary text, muted descriptions, helper copy |
| Slate | `#3c3f44` | `--color-slate` | Muted borders and disabled state outlines |
| Obsidian Edge | `#172540` | `--color-obsidian-edge` | Primary border color on cards and buttons — defines component outlines against the dark canvas |
| Inkline | `#151e32` | `--color-inkline` | Subtle card borders, slightly lighter than Obsidian Edge for inner nesting |
| Sapphire Hairline | `#24375a` | `--color-sapphire-hairline` | Lighter violet-tinted border for dividers and section separators |

## Tokens — Typography

### Inter — Workhorse UI font — body copy, nav, buttons, labels, and subheadings. Weight 300 is the secret weapon: low-weight body text against a dark canvas reads as precision, not weakness. · `--font-inter`
- **Substitute:** system-ui, -apple-system, sans-serif
- **Weights:** 300, 400, 500, 600
- **Sizes:** 9px, 12px, 13px, 14px, 15px, 16px, 18px, 20px, 28px, 40px
- **Line height:** 1.00, 1.13, 1.25, 1.38, 1.50
- **Letter spacing:** -0.0400em, -0.0270em, -0.0230em, -0.0200em, 0.0200em
- **Role:** Workhorse UI font — body copy, nav, buttons, labels, and subheadings. Weight 300 is the secret weapon: low-weight body text against a dark canvas reads as precision, not weakness.

### IBM Plex Mono — Code blocks and inline code only — reinforces the developer-tool identity. Sits at 13px with normal tracking. · `--font-ibm-plex-mono`
- **Substitute:** JetBrains Mono, Fira Code, monospace
- **Weights:** 400
- **Sizes:** 13px
- **Line height:** 1.00, 1.25, 1.50
- **Role:** Code blocks and inline code only — reinforces the developer-tool identity. Sits at 13px with normal tracking.

### Figtree — Display and heading font — geometric, slightly rounded sans used at 32–64px with -0.02em tracking. The rounded counters and tall x-height distinguish it from Inter's functional neutrality, giving headlines a warm confidence. · `--font-figtree`
- **Substitute:** DM Sans, Outfit, or Plus Jakarta Sans
- **Weights:** 500, 600
- **Sizes:** 32px, 36px, 44px, 48px, 64px
- **Line height:** 1.00, 1.13
- **Letter spacing:** -0.0200em
- **Role:** Display and heading font — geometric, slightly rounded sans used at 32–64px with -0.02em tracking. The rounded counters and tall x-height distinguish it from Inter's functional neutrality, giving headlines a warm confidence.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| body | 16px | 1.5 | -0.32px | `--text-body` |
| subheading | 20px | 1.38 | -0.54px | `--text-subheading` |
| heading-sm | 28px | 1.25 | -0.56px | `--text-heading-sm` |
| heading | 36px | 1.13 | -0.72px | `--text-heading` |
| heading-lg | 48px | 1.13 | -0.96px | `--text-heading-lg` |
| display | 64px | 1 | -1.28px | `--text-display` |

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
| 28 | 28px | `--spacing-28` |
| 32 | 32px | `--spacing-32` |
| 36 | 36px | `--spacing-36` |
| 40 | 40px | `--spacing-40` |
| 64 | 64px | `--spacing-64` |
| 76 | 76px | `--spacing-76` |
| 80 | 80px | `--spacing-80` |
| 104 | 104px | `--spacing-104` |
| 160 | 160px | `--spacing-160` |
| 192 | 192px | `--spacing-192` |

### Border Radius

| Element | Value |
|---------|-------|
| nav | 8px |
| tags | 9999px |
| cards | 12px |
| small | 2px |
| inputs | 8px |
| buttons | 9999px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| md | `rgba(0, 0, 0, 0.2) 0px 3px 16px 0px` | `--shadow-md` |
| xl | `rgba(0, 0, 0, 0.5) 0px 4px 30px 0px` | `--shadow-xl` |
| xl-2 | `rgba(0, 0, 0, 0.34) 0px 20px 35px 0px, rgba(0, 0, 0, 0.25...` | `--shadow-xl-2` |
| md-2 | `rgba(255, 255, 255, 0.35) 0px 2px 14px 0px` | `--shadow-md-2` |
| xl-3 | `rgba(0, 0, 0, 0.35) 0px 20px 34px 0px` | `--shadow-xl-3` |
| subtle | `rgba(0, 0, 0, 0.15) 0px 0px 0px 1px` | `--shadow-subtle` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 24px
- **Element gap:** 8px

## Components

### Primary CTA Button
**Role:** Highest-priority action — always white-filled pill on dark canvas

Background #ffffff, text #050606, weight 500 Inter at 15–16px, border-radius 9999px, padding 10px 20px. No shadow, no border. 1px hairline border optional in #161618 for definition. Used for 'Get started', 'Get API key', 'Sign up for free trial', and 'Let's chat!'.

### Ghost Button
**Role:** Secondary action — outlined, transparent on dark canvas

Background transparent, border 1px #777a88, text #ffffff Inter 500 at 15px, border-radius 9999px, padding 10px 20px. Used for 'Sign up' and 'Explore Playground' paired beside a primary CTA.

### Accent Gradient Button
**Role:** Sparingly-used attention action — the only chromatic CTA

Background linear-gradient(90deg, #305fbd, #625fff), text #ffffff Inter 500 at 14–15px, border-radius 9999px, padding 10px 20px. Used for 'See all examples' — a once-per-page accent.

### Feature Card
**Role:** Standard content block in lists, integrations, and feature grids

Background #0e111b or #0d172b, border 1px #151e32 or #172540, border-radius 12px, padding 24px. Card lifts with shadow rgba(0,0,0,0.5) 0px 4px 30px 0px when elevated. Contains a small icon, heading, and supporting text.

### Highlighted Card
**Role:** Spotlight variant for featured content — breaks monochrome rhythm

Background #12244f, border 1px #1e2b48, border-radius 12px, padding 32px. Reserved for the 'Plays well with others' integration block and pricing 'Most Popular' tier. The violet-tinted fill and brighter border create visual priority without a shadow.

### Pricing Tier Card
**Role:** Three-column pricing comparison — Starter, Professional, Enterprise

Background #0d172b, border 1px #172540, border-radius 12px, padding 24px. Professional tier uses background #12244f and a 'Most Popular' pill badge in the top-right. Price rendered in Figtree 48–64px weight 500, feature list uses Inter 14–15px with 4–6px row gaps and checkmark icons.

### Code Snippet Block
**Role:** Product demonstration — the signature component for a devtool site

Background #0d172b with #151e32 border, border-radius 12px, padding 16px. Header row contains a filename (Inter 13px #abaebb) and copy icon. Code body uses IBM Plex Mono 13px. Syntax colors: keywords in #ff7dda, strings in #28b6ff, comments in #8798c1, plain text in #c7c9d1. Line numbers in #3c3f44.

### Navigation Bar
**Role:** Sticky top header — compact, transparent on dark canvas

Background transparent or #0b0c0 at 90% opacity, height 56–64px. Logo on left (Figtree 500), nav links in Inter 14–15px weight 400, social and CTA buttons on right. No visible border, no shadow. Active nav state uses text #ffffff, inactive uses #abaebb.

### Section Label
**Role:** Eyebrow text above section headings

Inter 12–13px weight 500, uppercase, letter-spacing 0.02em, color #abaebb. Pairs with a 36–48px Figtree heading directly below.

### Integration Tile
**Role:** Logo grid item inside the integrations section

Individual tile 80–96px square, background #0d172b with gradient overlay, border-radius 12px. Contains a centered brand logo on a slightly violet-tinted surface. Tiles arranged in a 4×N grid with 8–12px gaps.

### Badge / Tag
**Role:** Small pill labels for categories, status, or awards

Background #12244f or #0d172b, text #85a6e9 or #ffffff, Inter 12px weight 500, border-radius 9999px, padding 4px 12px. Used for '#1 Product of the Day', '#1 Product of the Week', and 'Most Popular'.

### Feature List Item
**Role:** Checklist row inside cards and pricing tiers

Icon (checkmark or info) in #8798c1 at 16px, text in Inter 14–15px #c7c9d1, row gap 6–8px between items. Info icon triggers a tooltip or small info text.

### Stat Highlight Row
**Role:** Compact fact strip — e.g., '300 free API calls', '10 API calls per minute'

Icon + label in horizontal row, Inter 14–15px #c7c9d1, icon 16px in #8798c1. Items separated by 16–24px gaps, arranged in a 2-column grid inside signup prompt cards.

## Do's and Don'ts

### Do
- Use 9999px radius for all interactive elements — buttons, badges, tags, and nav pills
- Use Figtree at weight 500 for all display text 32px and above with -0.02em tracking
- Use Inter weight 300–400 for body copy; let low weight do the work against the dark canvas
- Apply the aurora gradient pair (purple #625fff + pink #ff7dda) as large soft radial glows on dark hero sections only
- Layer surface colors in order: #0b0c0 → #0e111b → #0d172b → #12244f to indicate elevation without shadows
- Use #2862d7 or #305fbd for link text and code syntax, never for large fills
- Apply 1px borders in #172540 or #151e32 to define cards — avoid using shadows alone for card definition

### Don't
- Don't use bright fills on CTA buttons — white (#ffffff) is the primary action color, never a saturated blue or purple
- Don't place radial gradient glows inside content cards or feature sections — reserve for hero and section backgrounds only
- Don't use Inter for headlines 32px and above — Figtree owns the display register
- Don't use #12244f as a page background — it's a highlight surface, not a canvas
- Don't add color to secondary text — keep #abaebb and #c7c9d1 strictly achromatic
- Don't use sharp corners (0px radius) on any interactive element — minimum is 2px for code, 8px for inputs, 12px for cards
- Don't apply elevation shadows to ghost or outline buttons — they should sit flat against the canvas

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Void | `#0b0c0` | Absolute base — hero backdrop and outer page background |
| 1 | Abyss | `#0e111b` | Primary canvas for body sections, list backgrounds, and standard cards |
| 2 | Deep Sea | `#0d172b` | Elevated cards — pricing tiers, feature blocks, signup prompts |
| 3 | Cobalt Panel | `#12244f` | Spotlighted feature cards and integration tiles — the violet-tinted highlight tier |

## Elevation

- **Elevated card:** `rgba(0, 0, 0, 0.5) 0px 4px 30px 0px`
- **Floating image / product visual:** `rgba(0, 0, 0, 0.34) 0px 20px 35px 0px, rgba(0, 0, 0, 0.25) 0px 4px 13px 0px`
- **Link / inline CTA:** `rgba(0, 0, 0, 0.2) 0px 3px 16px 0px`
- **Inner glow on dark surface:** `rgba(255, 255, 255, 0.35) 0px 2px 14px 0px`

## Imagery

The visual language is code-first: the hero's right side is a layered composition of floating code-editor windows, file tabs, and data lists rendered as if captured from a dark IDE. These are not screenshots but illustrated product mockups with syntax highlighting in purple, blue, and muted pink against #0d172b panels. The hero is split — text-left, code-visual-right — and the code panels overlap with slight rotation and heavy black drop shadows (rgba(0,0,0,0.34) 0px 20px 35px) to create a stacked depth effect. The integration section uses isolated square tiles, each containing a single brand logo on a violet-tinted surface. No photography, no illustration, no 3D — the only 'decoration' is the two large radial gradient glows (purple and pink) bleeding from the hero corners, which double as atmospheric light source and brand identity.

## Layout

Centered max-width 1200px container, full-bleed dark canvas. The hero is a two-column split: left holds a two-line Figtree 64px headline with subtext and paired CTAs, right holds a multi-layered code-editor mockup that extends to the page edge. Below the hero, sections alternate between two patterns: (1) centered text blocks with a 36–48px heading and supporting copy, and (2) 2-column or 3-column card grids with 12–16px gaps. The integrations section is a full-width card with a 4×N logo grid flush right. The pricing section is a 3-column card grid with the middle column elevated via a violet-tinted fill. Section gaps are generous — 80px between major blocks — and the dark canvas flows seamlessly with no visible section dividers. Navigation is a single sticky transparent bar at the top with a left logo, centered nav links, and right-side social + CTA cluster.

## Agent Prompt Guide

**Quick Color Reference**
- text (primary): #ffffff
- text (secondary): #abaebb
- text (tertiary): #c7c9d1
- background (canvas): #0e111b
- border: #172540
- accent / link: #2862d7
- primary action: #0d172b (filled action)

**3-5 Example Component Prompts**

1. **Hero section with headline + code visual**
   Create a Primary Action Button: #0d172b background, #ffffff text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.

2. **Feature card grid (3-column)**
   Card: background #0d172b, border 1px #172540, border-radius 12px, padding 24px. Icon: 24px in #2862d7 at top-left. Heading: Inter 20px weight 500, color #ffffff. Body text: Inter 16px weight 400, color #c7c9d1, line-height 1.5. Grid gap: 16px between cards, 80px between grid and next section.

3. **Code snippet block**
   Container: background #0d172b, border 1px #151e32, border-radius 12px, padding 16px. Header row: filename in Inter 13px #abaebb, copy icon in #8798c1. Code body: IBM Plex Mono 13px, line-height 1.5. Syntax colors — keywords #ff7dda, strings #28b6ff, comments #8798c1, plain text #c7c9d1. Floating drop shadow: rgba(0,0,0,0.34) 0px 20px 35px 0px, rgba(0,0,0,0.25) 0px 4px 13px 0px.

4. **Pricing tier card**
   Background #0d172b, border 1px #172540, border-radius 12px, padding 24px. Tier name: Inter 20px weight 500 #ffffff. Price: Figtree 48px weight 500 #ffffff with '/monthly' suffix in Inter 16px #abaebb. Feature list: checkmark icon 16px in #8798c1 + Inter 14px #c7c9d1, 8px row gap. CTA at bottom: white pill button (same as hero primary). Middle 'Most Popular' tier: background #12244f, border 1px #1e2b48, with a gradient badge pill at top-right.

5. **Section with eyebrow + heading + supporting copy**
   Eyebrow: Inter 12px weight 500 uppercase, letter-spacing 0.02em, color #abaebb. Heading: Figtree 48px weight 500, color #ffffff, letter-spacing -0.96px, line-height 1.13, centered. Body: Inter 18px weight 400, color #abaebb, centered, max-width 640px. Followed by a 3-column card grid below with 80px gap.

## Similar Brands

- **Replicate** — Same dark canvas with subtle aurora-style radial glows and code-first product mockups as the hero visual
- **Together AI** — Near-identical aurora purple + pink radial gradient pattern on a near-black canvas with white pill CTAs
- **Cursor** — Dark IDE-inspired aesthetic with deep blue-black surfaces, Inter body type, and a single chromatic accent reserved for gradients
- **Perplexity** — Same minimalist dark-mode language: heavy use of white text, cool-gray secondary type, and a tightly tracked geometric display font for headlines
- **Vercel** — Achromatic dark surfaces with selective violet-blue accent glows and white pill buttons as the primary action pattern

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-void: #0b0c0e;
  --color-abyss: #0e111b;
  --color-deep-sea: #0d172b;
  --color-cobalt-panel: #12244f;
  --color-frosted-lilac: #85a6e9;
  --color-signal-blue: #2862d7;
  --color-pulse-violet: #305fbd;
  --color-aurora-purple: #625fff;
  --gradient-aurora-purple: radial-gradient(79.43% 95.88% at 38.94% -53.46%, rgba(98, 95, 255, 0.38) 0px, rgba(0, 0, 0, 0));
  --color-plasma-pink: #ff7dda;
  --gradient-plasma-pink: radial-gradient(27.99% 22.08% at 72.13% 103.46%, rgba(255, 125, 218, 0.33) 0px, rgba(0, 0, 0, 0));
  --color-quartz: #ffffff;
  --color-ash: #abaebb;
  --color-mist: #c7c9d1;
  --color-slate: #3c3f44;
  --color-obsidian-edge: #172540;
  --color-inkline: #151e32;
  --color-sapphire-hairline: #24375a;

  /* Typography — Font Families */
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-ibm-plex-mono: 'IBM Plex Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-figtree: 'Figtree', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.32px;
  --text-subheading: 20px;
  --leading-subheading: 1.38;
  --tracking-subheading: -0.54px;
  --text-heading-sm: 28px;
  --leading-heading-sm: 1.25;
  --tracking-heading-sm: -0.56px;
  --text-heading: 36px;
  --leading-heading: 1.13;
  --tracking-heading: -0.72px;
  --text-heading-lg: 48px;
  --leading-heading-lg: 1.13;
  --tracking-heading-lg: -0.96px;
  --text-display: 64px;
  --leading-display: 1;
  --tracking-display: -1.28px;

  /* Typography — Weights */
  --font-weight-light: 300;
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
  --spacing-28: 28px;
  --spacing-32: 32px;
  --spacing-36: 36px;
  --spacing-40: 40px;
  --spacing-64: 64px;
  --spacing-76: 76px;
  --spacing-80: 80px;
  --spacing-104: 104px;
  --spacing-160: 160px;
  --spacing-192: 192px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 24px;
  --element-gap: 8px;

  /* Border Radius */
  --radius-sm: 2px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-full: 9999px;

  /* Named Radii */
  --radius-nav: 8px;
  --radius-tags: 9999px;
  --radius-cards: 12px;
  --radius-small: 2px;
  --radius-inputs: 8px;
  --radius-buttons: 9999px;

  /* Shadows */
  --shadow-md: rgba(0, 0, 0, 0.2) 0px 3px 16px 0px;
  --shadow-xl: rgba(0, 0, 0, 0.5) 0px 4px 30px 0px;
  --shadow-xl-2: rgba(0, 0, 0, 0.34) 0px 20px 35px 0px, rgba(0, 0, 0, 0.25) 0px 4px 13px 0px;
  --shadow-md-2: rgba(255, 255, 255, 0.35) 0px 2px 14px 0px;
  --shadow-xl-3: rgba(0, 0, 0, 0.35) 0px 20px 34px 0px;
  --shadow-subtle: rgba(0, 0, 0, 0.15) 0px 0px 0px 1px;

  /* Surfaces */
  --surface-void: #0b0c0;
  --surface-abyss: #0e111b;
  --surface-deep-sea: #0d172b;
  --surface-cobalt-panel: #12244f;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-void: #0b0c0e;
  --color-abyss: #0e111b;
  --color-deep-sea: #0d172b;
  --color-cobalt-panel: #12244f;
  --color-frosted-lilac: #85a6e9;
  --color-signal-blue: #2862d7;
  --color-pulse-violet: #305fbd;
  --color-aurora-purple: #625fff;
  --color-plasma-pink: #ff7dda;
  --color-quartz: #ffffff;
  --color-ash: #abaebb;
  --color-mist: #c7c9d1;
  --color-slate: #3c3f44;
  --color-obsidian-edge: #172540;
  --color-inkline: #151e32;
  --color-sapphire-hairline: #24375a;

  /* Typography */
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-ibm-plex-mono: 'IBM Plex Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-figtree: 'Figtree', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.32px;
  --text-subheading: 20px;
  --leading-subheading: 1.38;
  --tracking-subheading: -0.54px;
  --text-heading-sm: 28px;
  --leading-heading-sm: 1.25;
  --tracking-heading-sm: -0.56px;
  --text-heading: 36px;
  --leading-heading: 1.13;
  --tracking-heading: -0.72px;
  --text-heading-lg: 48px;
  --leading-heading-lg: 1.13;
  --tracking-heading-lg: -0.96px;
  --text-display: 64px;
  --leading-display: 1;
  --tracking-display: -1.28px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-28: 28px;
  --spacing-32: 32px;
  --spacing-36: 36px;
  --spacing-40: 40px;
  --spacing-64: 64px;
  --spacing-76: 76px;
  --spacing-80: 80px;
  --spacing-104: 104px;
  --spacing-160: 160px;
  --spacing-192: 192px;

  /* Border Radius */
  --radius-sm: 2px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-md: rgba(0, 0, 0, 0.2) 0px 3px 16px 0px;
  --shadow-xl: rgba(0, 0, 0, 0.5) 0px 4px 30px 0px;
  --shadow-xl-2: rgba(0, 0, 0, 0.34) 0px 20px 35px 0px, rgba(0, 0, 0, 0.25) 0px 4px 13px 0px;
  --shadow-md-2: rgba(255, 255, 255, 0.35) 0px 2px 14px 0px;
  --shadow-xl-3: rgba(0, 0, 0, 0.35) 0px 20px 34px 0px;
  --shadow-subtle: rgba(0, 0, 0, 0.15) 0px 0px 0px 1px;
}
```
