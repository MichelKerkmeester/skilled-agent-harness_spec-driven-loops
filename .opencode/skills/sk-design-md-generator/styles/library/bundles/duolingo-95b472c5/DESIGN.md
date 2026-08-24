# Duolingo — Style Reference
> Green playground with thick marker outlines

**Theme:** light

Duolingo is a playful, gamified language-learning canvas: a white background dominated by a single saturated brand green that fills primary actions, with thick, colorful borders giving every interactive element a tactile, pressable quality. The interface pairs a friendly rounded sans-serif for body, nav, and links with a heavy display face for oversized feature headlines, creating a contrast between approachable daily-use type and confident, exclamation-point section headers. Color appears sparingly but decisively — green for primary actions and headings, blue for secondary highlights, and a lighter lime green used extensively as a link/button border for an outlined, glowing treatment. The visual mood is warm, educational, and game-like, with cartoon character illustrations that humanize every product surface.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Ecto Green | `#58cc02` | `--color-ecto-green` | Green outline accent for tags, dividers, and focused UI edges. Do not promote it to the primary CTA color |
| Lingot Lime | `#a5ed6e` | `--color-lingot-lime` | Outlined-action border and link accent — used as the chromatic border on link and button elements in 256+ instances. The lighter green outline gives interactive elements a glowing, highlighter-pen quality against white backgrounds |
| Eel Light | `#d7ffb8` | `--color-eel-light` | Soft highlight and pale border — lightest green used for card outlines, soft surface washes, and the bottom shadow border on filled green buttons to create a 3D pressable effect |
| Macaw Blue | `#1cb0f6` | `--color-macaw-blue` | Secondary action accent — body borders, link text, and outlined button borders for secondary actions like language-specific CTAs. The cyan-blue sibling to the green system, signaling alternative or complementary actions |
| Eel Dark Blue | `#042c60` | `--color-eel-dark-blue` | Deep heading text and border — navy blue used for emphasis headings and key border treatments, providing weight and contrast without competing with the green primary |
| Midnight | `#000437` | `--color-midnight` | Dark surface and button text — near-black violet used for dark-surface sections and as button label text on green fills |
| Graphite | `#3c3c3c` | `--color-graphite` | Dominant neutral border — the workhorse gray used for hundreds of list and card borders throughout navigation, lists, and structural dividers. Not a background, a border system |
| Ash | `#777777` | `--color-ash` | Secondary text and nav borders — medium gray for navigation chrome, secondary text labels, and subtle structural borders |
| Charcoal | `#4b4b4b` | `--color-charcoal` | Body text and icon borders — darker gray for body copy and icon outlines, sitting between the lighter Ash and the darker structural Graphite |
| Paper | `#ffffff` | `--color-paper` | Page and card surface — the white canvas on which all content sits. Also used as text on dark surfaces and as border color for ghost buttons |
| Ink | `#000000` | `--color-ink` | Pure black for SVG illustration fills and maximum-contrast text where needed |

## Tokens — Typography

### din-round — Primary UI typeface — used for body text, navigation, buttons, links, lists, and smaller headings. The rounded terminals and friendly weight create an approachable, educational tone. Weight 500 for body, weight 700 for emphasis and button labels. The +0.053em letter-spacing is wider than typical, giving text a breezy, open feel. · `--font-din-round`
- **Substitute:** Nunito, Quicksand, or DM Sans (rounded sans-serifs with similar friendly geometry)
- **Weights:** 500, 700
- **Sizes:** 13, 14, 15, 17, 19, 32
- **Line height:** 1.15–1.47
- **Letter spacing:** 0.053em (consistent across all sizes)
- **Role:** Primary UI typeface — used for body text, navigation, buttons, links, lists, and smaller headings. The rounded terminals and friendly weight create an approachable, educational tone. Weight 500 for body, weight 700 for emphasis and button labels. The +0.053em letter-spacing is wider than typical, giving text a breezy, open feel.

### feather — Display face for large feature headlines — bold, heavy, and tight (letter-spacing: -0.02em). Reserved exclusively for oversized section headlines. The extreme weight contrast against the lighter din-round body creates a shout/whisper rhythm: feather headlines announce, din-round explains. · `--font-feather`
- **Substitute:** DIN Next, Roboto, or Inter at weight 800–900 with tight tracking
- **Weights:** 700
- **Sizes:** 48, 64
- **Line height:** 1.20
- **Letter spacing:** -0.02em at 48–64px
- **Role:** Display face for large feature headlines — bold, heavy, and tight (letter-spacing: -0.02em). Reserved exclusively for oversized section headlines. The extreme weight contrast against the lighter din-round body creates a shout/whisper rhythm: feather headlines announce, din-round explains.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 13px | 1.23 | 0.69px | `--text-caption` |
| body | 15px | 1.47 | 0.8px | `--text-body` |
| heading-sm | 19px | 1.33 | 1.01px | `--text-heading-sm` |
| heading | 32px | 1.21 | 1.7px | `--text-heading` |
| display | 64px | 1.2 | -1.28px | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 8 | 8px | `--spacing-8` |
| 12 | 12px | `--spacing-12` |
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
| cards | 12px |
| links | 12px |
| pills | 12px |
| buttons | 12px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 100px
- **Card padding:** 16-24px
- **Element gap:** 12px

## Components

### Primary Filled Button
**Role:** Main call-to-action (Get Started, Start Learning)

Filled with Ecto Green #58cc02, white or Midnight #000437 label text, 12px radius, 16px vertical padding, weight 700 in din-round at 15px. Features a distinctive thick bottom border in Eel Light #d7ffb8 or a darker green shade to create a 3D pressable effect. No drop shadow — depth comes purely from the border offset.

### Ghost/Outlined Secondary Button
**Role:** Secondary action (I Already Have An Account, Certify Your English)

White or transparent background, 2px border in Lingot Lime #a5ed6 or Macaw Blue #1cb0f6, label text in matching border color. 12px radius, 16px vertical padding, din-round weight 700 at 14-15px. The colored border IS the visual identity — no fill needed.

### Lingot Outlined Link
**Role:** Inline text links and nav links throughout content

Text in Lingot Lime #a5ed6 or Macaw Blue #1cb0f6 with a 2px underline/border in the same color. The distinctive lighter-green link treatment is the most repeated element in the system (256+ instances), creating a highlighter-pen effect.

### Language Selector Pill
**Role:** Language/course picker in footer and nav

Horizontal pill with flag icon on the left, uppercase language name in din-round weight 700 at 13-15px, all-caps tracked text. 12px radius, 10-16px padding. White background with Charcoal #4b4b4b text and subtle border.

### Section Heading Block
**Role:** Large feature section headers

Headline in feather weight 700 at 48-64px, tight letter-spacing -0.02em, in Ecto Green #58cc02 or Eel Dark Blue #042c60. The oversized green type is the most visually arresting element on the page — it carries brand identity through typography alone.

### Top Navigation Bar
**Role:** Sticky header with logo and language switcher

White background, Duolingo owl logo + wordmark in Ecto Green on the left, language selector in Ash #777 on the right. 64px height, subtle Graphite #3c3c3c bottom border. Clean, minimal, text-only navigation.

### Feature Illustration Panel
**Role:** Large character illustrations accompanying feature sections

Full-color cartoon illustrations (Duo the owl, human characters, phones, carpets) rendered in flat shapes with no gradients. Colors pulled from the full chromatic palette including Ecto Green, Macaw Blue, yellow #ffe700, and pink. Illustrations float on white with no containment frame or card.

### Hero CTA Stack
**Role:** Primary action area on landing page

Centered headline + subhead in din-round, followed by a vertical stack of two buttons: filled green primary on top, ghost-outlined secondary below. 16-24px gap between buttons. This stacked duo is the conversion pattern.

### Course/Language Grid
**Role:** Grid of language options with flags

Horizontal scrollable strip of Language Selector Pills with arrow chevrons on both ends. White background, no card containers — just the pills floating in a row with consistent 10px gaps.

### List/Table Row
**Role:** Structured data rows in tables and lists

Rows separated by 1-2px borders in Graphite #3c3c3c. No zebra striping, no card backgrounds. Content in din-round at 15px. The border-heavy approach (284 borderColor instances) is the structural system.

### Feature Section Block
**Role:** Alternating text + illustration sections

Two-column layout: text on one side (headline + paragraph + optional ghost button), full-bleed illustration on the other. No card backgrounds, no dividers — sections separated by generous 100px+ vertical spacing on pure white.

## Do's and Don'ts

### Do
- Use #58cc02 as the filled background for all primary action buttons and as the color for large display headings
- Use #a5ed6 as the 2px border color for outlined/ghost links and secondary buttons — this lighter green outline is the system's most distinctive repeated element
- Set border-radius to 12px on all buttons, links, and pills — this is the only radius in the system
- Use feather at 48-64px weight 700 with -0.02em letter-spacing for section headlines, and din-round for everything else
- Add a 2-3px solid bottom border in a darker shade to green filled buttons to create the pressable 3D effect — never use box-shadow
- Use the wide letter-spacing of ~0.053em on all din-round text — the open, airy tracking is part of the brand voice
- Pair every feature section with a flat cartoon illustration — the system expects character art as a content element, not decoration

### Don't
- Do not use drop shadows on any element — depth comes from solid borders, never from blurred shadow stacks
- Do not use gradients — the system is strictly flat solid colors with no gradient transitions
- Do not use card containers with background fills or box-shadows — sections are separated by white space alone
- Do not set body radius below or above 12px — the system has exactly one radius value and it should be used uniformly
- Do not use feather for body text or anything under 32px — it is exclusively a display face for oversized headlines
- Do not introduce new accent colors outside the established palette of green, blue, dark blue, and midnight
- Do not use the light green #a5ed6 as a filled background — it is exclusively a border/outline color

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Paper White | `#ffffff` | Base page canvas and all card surfaces — the entire site sits on pure white |
| 1 | Ecto Green Surface | `#58cc02` | Primary CTA fill and large heading emphasis blocks |
| 2 | Midnight Surface | `#100f3` | Dark mode sections and inverted hero panels |

## Elevation

- **Primary Filled Button:** `2-3px solid bottom border in darker green (#58cc02 or #4cae02) with no box-shadow — depth is border-based, not shadow-based`

## Imagery

Illustrations are the dominant visual language — flat, vector-style cartoon characters rendered in solid colors with no gradients or complex shading. The mascot owl Duo appears prominently alongside diverse human characters in playful scenarios (flying carpets, phones, classrooms). Color palette in illustrations mirrors the brand system: Ecto Green, Macaw Blue, bright yellow #ffe700, pink, purple. Illustrations are always full-color and positioned beside text content rather than as backgrounds. No photography is used. Icons are minimal — mostly flag emojis and simple line icons in the navigation. The overall density is illustration-heavy on feature sections but text-dominant on navigation and footer.

## Layout

Full-bleed white page with no contained max-width frame — content blocks sit directly on the white canvas with generous 100px+ vertical section gaps. Navigation is a minimal sticky top bar with logo left and language toggle right. The hero is a centered two-column layout: illustration cluster on the left, headline + CTA stack on the right. Below the hero, content flows in alternating two-column sections (text + illustration, flipping sides) with no card containers or background color changes — just white space and bold type doing the separation work. A horizontal scrollable course selector strip sits at the bottom. The grid system is implicit: content aligns to a 1200px max-width with comfortable margins, but there are no visible grid lines or card structures.

## Agent Prompt Guide

**Quick Color Reference**
- text: #3c3c3c (primary), #777777 (secondary), #4b4b4b (body)
- Create an Outlined Primary Action: Transparent background, #a5ed6e border and text, 9999px radius, compact pill padding. Use it for the main CTA instead of a filled button.
- border: #3c3c3c (structural), #a5ed6e (outlined action border), #1cb0f6 (secondary action border)
- accent: #1cb0f6 (blue secondary)
- primary action: #a5ed6e (outlined action border)

**Example Component Prompts**
1. Create a ghost outlined button: white background, 2px border in #a5ed6e, label text in #a5ed6e at 15px din-round weight 700, 12px radius, 16px vertical and 24px horizontal padding. No shadow, no fill — the border IS the visual identity.

2. Create a section heading: text in feather weight 700 at 48px, letter-spacing -0.02em, color #58cc02. No background, sits directly on white with 100px vertical space above and below.

3. Create a language selector pill: white background, 12px radius, 10px vertical and 16px horizontal padding. Left side: flag emoji. Right side: language name in din-round weight 700 at 13px, uppercase, color #4b4b4b. Subtle 1px border in #e5e5e5.

4. Create a feature section: two-column layout, left column has a headline in din-round weight 700 at 32px color #042c60 with 0.053em letter-spacing, plus a body paragraph in din-round weight 500 at 15px color #4b4b4b. Right column has a full-color flat cartoon illustration. 100px vertical gap between this section and the next.


## Similar Brands

- **Khan Academy** — Same educational/playful tone with a single dominant brand color, rounded sans-serif body type, and flat cartoon illustrations alongside text content
- **Headspace** — Friendly rounded typography paired with bold colorful illustrations and a warm, approachable page layout on white
- **Codecademy** — Gamified learning platform with thick colored borders on interactive elements and a playful custom typeface for headings
- **Quizlet** — Education product with bold display headings, flat color illustrations, and a single primary brand color driving CTA hierarchy

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-ecto-green: #58cc02;
  --color-lingot-lime: #a5ed6e;
  --color-eel-light: #d7ffb8;
  --color-macaw-blue: #1cb0f6;
  --color-eel-dark-blue: #042c60;
  --color-midnight: #000437;
  --color-graphite: #3c3c3c;
  --color-ash: #777777;
  --color-charcoal: #4b4b4b;
  --color-paper: #ffffff;
  --color-ink: #000000;

  /* Typography — Font Families */
  --font-din-round: 'din-round', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-feather: 'feather', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 13px;
  --leading-caption: 1.23;
  --tracking-caption: 0.69px;
  --text-body: 15px;
  --leading-body: 1.47;
  --tracking-body: 0.8px;
  --text-heading-sm: 19px;
  --leading-heading-sm: 1.33;
  --tracking-heading-sm: 1.01px;
  --text-heading: 32px;
  --leading-heading: 1.21;
  --tracking-heading: 1.7px;
  --text-display: 64px;
  --leading-display: 1.2;
  --tracking-display: -1.28px;

  /* Typography — Weights */
  --font-weight-medium: 500;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
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
  --section-gap: 100px;
  --card-padding: 16-24px;
  --element-gap: 12px;

  /* Border Radius */
  --radius-xl: 12px;

  /* Named Radii */
  --radius-cards: 12px;
  --radius-links: 12px;
  --radius-pills: 12px;
  --radius-buttons: 12px;

  /* Surfaces */
  --surface-paper-white: #ffffff;
  --surface-ecto-green-surface: #58cc02;
  --surface-midnight-surface: #100f3;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-ecto-green: #58cc02;
  --color-lingot-lime: #a5ed6e;
  --color-eel-light: #d7ffb8;
  --color-macaw-blue: #1cb0f6;
  --color-eel-dark-blue: #042c60;
  --color-midnight: #000437;
  --color-graphite: #3c3c3c;
  --color-ash: #777777;
  --color-charcoal: #4b4b4b;
  --color-paper: #ffffff;
  --color-ink: #000000;

  /* Typography */
  --font-din-round: 'din-round', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-feather: 'feather', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 13px;
  --leading-caption: 1.23;
  --tracking-caption: 0.69px;
  --text-body: 15px;
  --leading-body: 1.47;
  --tracking-body: 0.8px;
  --text-heading-sm: 19px;
  --leading-heading-sm: 1.33;
  --tracking-heading-sm: 1.01px;
  --text-heading: 32px;
  --leading-heading: 1.21;
  --tracking-heading: 1.7px;
  --text-display: 64px;
  --leading-display: 1.2;
  --tracking-display: -1.28px;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-96: 96px;

  /* Border Radius */
  --radius-xl: 12px;
}
```
