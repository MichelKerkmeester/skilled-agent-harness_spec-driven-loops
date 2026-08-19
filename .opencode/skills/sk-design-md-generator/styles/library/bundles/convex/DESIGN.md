# Convex — Style Reference
> Cream paper engineering notebook

**Theme:** mixed

Convex presents a warm cream-paper technical workspace: a desaturated beige canvas (#f6f6f6 to #f7f1ff) hosts both product UI and product screenshots, while dark code surfaces (#141414, #292929) carry TypeScript and dashboard previews with syntax-highlight punctuation in pink, violet, green, and yellow. GT America grotesque at whisper-weights creates a calm, editorial engineering voice — tight negative tracking on 40-56px headlines compresses the wordmark into confident, compact blocks. Components are squared and compact: 8-12px radii, thin charcoal borders, and minimal padding produce a blueprint-like density that reads more like a developer's notebook than a marketing site.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Ink Black | `#141414` | `--color-ink-black` | Primary text, dark card surfaces, code editor backgrounds, filled neutral buttons — the dominant dark across the site |
| Paper White | `#ffffff` | `--color-paper-white` | Light supporting surface for subtle backgrounds and section separation. Do not promote it to the primary CTA color |
| Cream Surface | `#f6f6f6` | `--color-cream-surface` | Page canvas and section backgrounds — warm off-white that distinguishes Convex from cold-white SaaS |
| Lilac Wash | `#f7f1ff` | `--color-lilac-wash` | Subtle tinted background panels, icon wash areas, soft section dividers |
| Charcoal Surface | `#292929` | `--color-charcoal-surface` | Secondary dark surfaces, navigation pills, dark-mode code block frames |
| Graphite Border | `#38383a` | `--color-graphite-border` | Borders on dark surfaces, dividers within code blocks, outlined button strokes on dark fills |
| Slate Text | `#4f4f52` | `--color-slate-text` | Secondary body text, nav metadata, subdued labels |
| Fog Text | `#6d6d70` | `--color-fog-text` | Muted helper text, tertiary nav items, breadcrumb-style labels |
| Ash Text | `#a9a9ac` | `--color-ash-text` | Placeholder text, disabled labels, very low-emphasis metadata |
| Mist Divider | `#e5e5e5` | `--color-mist-divider` | Hairline dividers, input borders on light surfaces, table row separators |
| Signal Blue | `#69bee2` | `--color-signal-blue` | Blue supporting accent for decorative details and low-frequency emphasis. Do not promote it to the primary CTA color |
| Plum Button | `#8d2676` | `--color-plum-button` | Alternative filled button accent on specific marketing sections — rich magenta against cream |
| Ember Orange | `#de5d33` | `--color-ember-orange` | Highlight accent on specific CTAs or callout chips — warm complement to the cool blues |
| Hot Pink | `#fc618d` | `--color-hot-pink` | Red supporting accent for decorative details and low-frequency emphasis |
| Iris Violet | `#948ae3` | `--color-iris-violet` | Violet supporting accent for decorative details and low-frequency emphasis |
| Mint Green | `#7bd88f` | `--color-mint-green` | Green supporting accent for decorative details and low-frequency emphasis |
| Canary Yellow | `#f8e67a` | `--color-canary-yellow` | Yellow supporting accent for decorative details and low-frequency emphasis |
| Dusk Gradient | `linear-gradient(135deg, rgb(34, 31, 29), rgb(49, 43, 43) 28%, rgba(41, 57, 105, 0.9) 50%)` | `--color-dusk-gradient` | Dark section background gradient — diagonal fade from warm near-black through charcoal to a cool blue haze |

## Tokens — Typography

### GT America — Primary typeface for all UI, headings, body, nav, and buttons — grotesque sans with tight optical spacing; weight 400/500 for body, weight 700 reserved for emphasis and button labels · `--font-gt-america`
- **Substitute:** Inter, Switzer, or General Sans
- **Weights:** 400, 500, 700
- **Sizes:** 10, 12, 13, 14, 15, 16, 18, 20, 36, 40, 56
- **Line height:** 1.00, 1.25, 1.38, 1.50
- **Letter spacing:** -0.05em at 56px, -0.025em at 40px, 0.025em at 10-12px, 0.05em at 10-12px
- **Role:** Primary typeface for all UI, headings, body, nav, and buttons — grotesque sans with tight optical spacing; weight 400/500 for body, weight 700 reserved for emphasis and button labels

### ui-monospace / monospace — Code snippets, terminal output, file paths, inline code — exclusively inside code blocks and developer-facing surfaces · `--font-ui-monospace-monospace`
- **Substitute:** JetBrains Mono, IBM Plex Mono
- **Weights:** 400
- **Sizes:** 13
- **Line height:** 1.40
- **Letter spacing:** normal
- **Role:** Code snippets, terminal output, file paths, inline code — exclusively inside code blocks and developer-facing surfaces

### monospace — monospace — detected in extracted data but not described by AI · `--font-monospace`
- **Weights:** 400
- **Sizes:** 13px
- **Line height:** 1.4
- **Role:** monospace — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 10px | 1.25 | 0.5px | `--text-caption` |
| body | 14px | 1.5 | — | `--text-body` |
| body-lg | 16px | 1.5 | — | `--text-body-lg` |
| subheading | 20px | 1.38 | — | `--text-subheading` |
| heading | 36px | 1.25 | -0.9px | `--text-heading` |
| heading-lg | 40px | 1.25 | -1px | `--text-heading-lg` |
| display | 56px | 1 | -2.8px | `--text-display` |

## Tokens — Spacing & Shapes

**Density:** compact

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 6 | 6px | `--spacing-6` |
| 8 | 8px | `--spacing-8` |
| 10 | 10px | `--spacing-10` |
| 12 | 12px | `--spacing-12` |
| 16 | 16px | `--spacing-16` |
| 20 | 20px | `--spacing-20` |
| 22 | 22px | `--spacing-22` |
| 24 | 24px | `--spacing-24` |
| 32 | 32px | `--spacing-32` |
| 36 | 36px | `--spacing-36` |
| 48 | 48px | `--spacing-48` |
| 80 | 80px | `--spacing-80` |
| 128 | 128px | `--spacing-128` |

### Border Radius

| Element | Value |
|---------|-------|
| nav | 12px |
| tags | 4px |
| cards | 12px |
| inputs | 4px |
| buttons | 8px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 64px
- **Card padding:** 24px
- **Element gap:** 12px

## Components

### Top Navigation Bar
**Role:** Persistent site header

White (#ffffff) background, 12px radius on dropdown pills, GT America 14px/500 for links in #141414, GitHub stars pill with #292929 dark fill and white star count text. Height ~64px, horizontal padding 24px.

### Ghost Navigation Button (Log in)
**Role:** Secondary nav action

White fill, 1px #d7d7d7 border, 8px radius, GT America 14px/500 in #141414, 8px 16px padding. No shadow, flat appearance.

### Filled Light CTA (Start building)
**Role:** Primary action on light backgrounds

White (#ffffff) fill, #141414 text, GT America 15px/500, 8px radius, 10px 20px padding. Sits on cream canvas and reads as the highest-contrast action available.

### Filled Dark CTA (Learn more)
**Role:** Primary action on cream/light sections

#141414 fill, white text, GT America 15px/500, 8px radius, 10px 20px padding. The default filled CTA across most content sections.

### Blue Signal CTA (Learn more on dark)
**Role:** Primary action on dark gradient sections

#69bee2 fill, #141414 text, GT America 15px/500, 8px radius, 10px 20px padding. The only chromatic filled button; reserved for dark-section hero actions.

### Code Editor Card
**Role:** Product preview — TypeScript IDE

#141414 background, 12px radius, 1px #38383a border, three macOS-style traffic-light dots top-left, file tab strip in #292929, monospace 13px code with syntax colors (hot pink keywords, iris violet types, mint green booleans, canary yellow constants).

### Dashboard Preview Card
**Role:** Product preview — todo app UI

Light card surface #ffffff with #e5e5e5 hairline border, 12px radius, 24px padding. Header bar shows domain (.convex.dev) in #6d6d70 12px, table rows alternate white/#f6f6f6 with 1px #e5e5e5 dividers, blue #69bee2 'Add' button at 8px radius.

### Command Snippet Card (npm create convex)
**Role:** Hero install command

#292929 dark fill, 8px radius, monospace 13px white text, trailing copy icon in #a9a9ac. Sits inline beside the light CTA in the hero.

### Feature Section Card
**Role:** Content card for feature lists

No explicit background (sits on cream canvas), 0 border, GT America 18px/700 heading in #141414, body 15px/400 in #4f4f52, 24px gap between heading and body.

### Dark Gradient Hero Banner
**Role:** Full-bleed dark section with centered headline

Background is the 135deg dusk gradient (#221f1d → #38383a → rgba blue haze), 12px radius for any contained cards, centered GT America 40px/700 white headline, small 'PRODUCT' eyebrow tag in 12px/500 uppercase with 0.05em tracking inside a 1px #38383a pill at 4px radius.

### Chat Prompt Card
**Role:** AI/LLM demo card in feature section

Dark #292929 background, 12px radius, white monospace 13px prompt text, bottom-right 'Try Convex with Chef' CTA where 'Chef' is set in a custom decorative red serif/wordmark.

### GitHub Stars Pill
**Role:** Social proof in nav

White fill, 1px #e5e5e5 border, 8px radius, GitHub octocat icon + '260350 stars' in GT America 13px/500 #141414. Star count separated by hairline divider.

### Code Token
**Role:** Inline syntax highlight element

No background, monospace 13px, color picks from the accent palette: keywords #fc618d, types #948ae3, booleans #7bd88f, constants #f8e67a, strings default #e3d0df.

### Pixel Art Illustration
**Role:** Decorative graphic for LLM feature

Blocky pixel grid on cream #f6f6f6 background, scattered #292929 blocks forming a loose maze/character pattern, accent blocks in #de5d33 and #69bee2. 16px corner radius on the container.

## Do's and Don'ts

### Do
- Use GT America at weight 400/500 for body and 700 for emphasis; never introduce a secondary sans-serif
- Apply -0.05em letter-spacing only at 56px display, -0.025em at 40-36px headings, and 0.025-0.05em on 10-12px uppercase eyebrow labels
- Use 8px radius for buttons and 12px radius for cards and nav pills; reserve 4px for tags and small chips
- Keep dark code blocks on #141414 with monospace 13px and syntax colors from the accent palette
- Use the cream #f6f6f6 canvas as the default page background; only switch to dark sections for explicit product or gradient hero moments
- Use 12px for element gaps within cards, 24px for card internal padding, and 64px between major sections
- Prefer hairline #e5e5e5 borders over shadows for card separation on light surfaces

### Don't
- Do not add drop shadows to cards or buttons — separation comes from color and 1px borders only
- Do not use the syntax highlight colors (pink, violet, green, yellow) outside code blocks — they are semantic, not decorative
- Do not use #69bee2 (signal blue) as a filled CTA on light/cream sections — reserve it for dark-section actions only
- Do not introduce gradients on UI elements other than the documented dusk-gradient dark section background
- Do not use pure black #000000 for large text or backgrounds; #141414 is the darkest allowed tone
- Do not use border radii above 16px — the system is squared and compact, not soft and rounded
- Do not set body text below 14px or above 18px — GT America is tuned for a narrow mid-range scale

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas | `#f6f6f6` | Page-level cream background, default section backdrop |
| 1 | Card | `#ffffff` | Elevated card surfaces, code editor frames, dashboard panels |
| 2 | Tinted Panel | `#f7f1ff` | Soft lilac-washed feature panels, icon backgrounds, subtle callout zones |
| 3 | Dark Code | `#141414` | Code editor interior, dashboard dark-mode preview surfaces |
| 4 | Dark Section | `#292929` | Full-bleed dark marketing sections with gradient overlay |

## Elevation

Convex deliberately avoids drop shadows. All separation is achieved through surface color contrast (cream → white → dark) and 1px hairline borders in #e5e5e5 or #38383a. This flat treatment reinforces the engineering-notebook aesthetic and keeps the focus on the product screenshots, which carry their own visual depth through code syntax colors.

## Imagery

Convex uses dark product UI screenshots (code editor, dashboard) as the primary visual content — these are the hero elements, not stock photography. The code editor card shows a real TypeScript file with syntax-colored tokens, and the dashboard card shows a live todo app. The only illustrative element is a pixel-art style block grid used in the LLM section, rendered in a retro 8-bit aesthetic with charcoal and accent-color blocks on cream. No lifestyle photography, no abstract 3D renders. Icon style is minimal mono line icons (copy, GitHub octocat) at 1-1.5px stroke weight. Imagery serves as product demonstration rather than decoration — every visual is something a developer would actually see in the product.

## Layout

Max-width 1200px centered container with 24px gutter. Hero is a two-column split: left third holds headline + CTAs + feature accordion, right two-thirds stacks two dark product preview cards (code editor on top, dashboard below) with a slight overlap. Sections alternate between cream-light and dark-gradient full-bleed bands with 64px vertical padding. The LLM section uses a two-column text-left/visual-right pattern with the pixel art on a cream background and a dark chat card overlapping the visual. Navigation is a fixed white top bar with left-aligned logo, center-left nav links, and right-aligned GitHub pill + auth buttons. Component density is compact — feature cards stack tightly with 12-16px gaps rather than generous whitespace.

## Agent Prompt Guide

**Quick Color Reference**
- text: #141414
- background: #f6f6f6 (cream canvas) / #ffffff (card)
- border: #e5e5e5 (light) / #38383a (dark)
- accent: #69bee2 (Signal Blue — dark sections only)
- primary action: no distinct CTA color

**Example Component Prompts**

1. Build a hero headline: GT America 56px/700, #141414, letter-spacing -2.8px, line-height 1.0. Subline at 18px/400 in #4f4f52. Below it, a white filled button 'Start building' at 8px radius, GT America 15px/500, #141414 text, 10px 20px padding. Beside it, a dark command card #292929 at 8px radius, monospace 13px white text showing '> npm create convex' with a copy icon in #a9a9ac.

2. Build a code editor card: #141414 background, 12px radius, 1px #38383a border, three 8px traffic-light dots (#fc618d, #f8e67a, #7bd88f) top-left. File tab bar in #292929 height 32px. Monospace 13px code body with line-height 1.4. Keywords in #fc618d, type annotations in #948ae3, booleans in #7bd88f, constants in #f8e67a, comments in #6d6d70.

3. Build a dashboard preview card: #ffffff background, 12px radius, 1px #e5e5e5 border, 24px padding. Header row shows domain label at GT America 12px/500 in #6d6d70. Table rows alternate #ffffff and #f6f6f6 with 1px #e5e5e5 bottom borders. Right-aligned 'Add' button: #69bee2 fill, #141414 text, GT America 14px/500, 8px radius, 8px 16px padding.

No distinct primary action color was observed; use the extracted neutral button treatments instead of inventing a filled CTA color.

5. Build a feature accordion row: no background, sits on cream canvas. Heading GT America 18px/700 in #141414 with a trailing chevron icon in #4f4f52. When expanded, body text 15px/400 in #4f4f52 with 12px gap to heading. 1px #e5e5e5 bottom divider between rows.

## Syntax Highlight System

Inside code blocks, Convex uses a deliberate four-color syntax palette that makes TypeScript scannable at a glance. This is a semantic system, not a decorative one: keywords (export, import, const) are hot pink #fc618d, type annotations and interfaces are iris violet #948ae3, booleans and true/false values are mint green #7bd88f, and constants or string literals canary yellow #f8e67a. String interpolation falls to a desaturated lavender #e3d0df. Default code text is #d7d7d7 on the #141414 editor background, with comments in #6d6d70. Never reuse these colors for UI buttons, tags, or accents — they are reserved exclusively for code semantics.

## Similar Brands

- **Linear** — Same ultra-tight grotesque typography with negative tracking at large sizes, minimal use of shadows, dark product UI screenshots as hero content, and a calm monochrome palette punctuated by one accent color
- **Vercel** — Identical developer-tool DNA: cream/off-white canvas, monospace code blocks front and center, GT America-adjacent geometric sans, and product-preview cards doing the work that photography would do on a consumer site
- **Supabase** — Same dark code-block hero treatment paired with a light content surface, squared 8-12px radii throughout, and a compact density that reads more like documentation than marketing
- **Railway** — Similar warm-neutral page surfaces, terminal/code-first visual language, and a restrained accent palette that appears only on interactive elements and syntax tokens
- **Render** — Same editorial engineering aesthetic — tight grotesque type, cream backgrounds, dark product previews, and minimal decorative chrome that lets the product screenshots breathe

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-ink-black: #141414;
  --color-paper-white: #ffffff;
  --color-cream-surface: #f6f6f6;
  --color-lilac-wash: #f7f1ff;
  --color-charcoal-surface: #292929;
  --color-graphite-border: #38383a;
  --color-slate-text: #4f4f52;
  --color-fog-text: #6d6d70;
  --color-ash-text: #a9a9ac;
  --color-mist-divider: #e5e5e5;
  --color-signal-blue: #69bee2;
  --color-plum-button: #8d2676;
  --color-ember-orange: #de5d33;
  --color-hot-pink: #fc618d;
  --color-iris-violet: #948ae3;
  --color-mint-green: #7bd88f;
  --color-canary-yellow: #f8e67a;
  --color-dusk-gradient: #221f1d;
  --gradient-dusk-gradient: linear-gradient(135deg, rgb(34, 31, 29), rgb(49, 43, 43) 28%, rgba(41, 57, 105, 0.9) 50%);

  /* Typography — Font Families */
  --font-gt-america: 'GT America', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-ui-monospace-monospace: 'ui-monospace / monospace', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-monospace: 'monospace', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.25;
  --tracking-caption: 0.5px;
  --text-body: 14px;
  --leading-body: 1.5;
  --text-body-lg: 16px;
  --leading-body-lg: 1.5;
  --text-subheading: 20px;
  --leading-subheading: 1.38;
  --text-heading: 36px;
  --leading-heading: 1.25;
  --tracking-heading: -0.9px;
  --text-heading-lg: 40px;
  --leading-heading-lg: 1.25;
  --tracking-heading-lg: -1px;
  --text-display: 56px;
  --leading-display: 1;
  --tracking-display: -2.8px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-6: 6px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-22: 22px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-36: 36px;
  --spacing-48: 48px;
  --spacing-80: 80px;
  --spacing-128: 128px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 64px;
  --card-padding: 24px;
  --element-gap: 12px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;

  /* Named Radii */
  --radius-nav: 12px;
  --radius-tags: 4px;
  --radius-cards: 12px;
  --radius-inputs: 4px;
  --radius-buttons: 8px;

  /* Surfaces */
  --surface-canvas: #f6f6f6;
  --surface-card: #ffffff;
  --surface-tinted-panel: #f7f1ff;
  --surface-dark-code: #141414;
  --surface-dark-section: #292929;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-ink-black: #141414;
  --color-paper-white: #ffffff;
  --color-cream-surface: #f6f6f6;
  --color-lilac-wash: #f7f1ff;
  --color-charcoal-surface: #292929;
  --color-graphite-border: #38383a;
  --color-slate-text: #4f4f52;
  --color-fog-text: #6d6d70;
  --color-ash-text: #a9a9ac;
  --color-mist-divider: #e5e5e5;
  --color-signal-blue: #69bee2;
  --color-plum-button: #8d2676;
  --color-ember-orange: #de5d33;
  --color-hot-pink: #fc618d;
  --color-iris-violet: #948ae3;
  --color-mint-green: #7bd88f;
  --color-canary-yellow: #f8e67a;
  --color-dusk-gradient: #221f1d;

  /* Typography */
  --font-gt-america: 'GT America', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-ui-monospace-monospace: 'ui-monospace / monospace', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-monospace: 'monospace', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.25;
  --tracking-caption: 0.5px;
  --text-body: 14px;
  --leading-body: 1.5;
  --text-body-lg: 16px;
  --leading-body-lg: 1.5;
  --text-subheading: 20px;
  --leading-subheading: 1.38;
  --text-heading: 36px;
  --leading-heading: 1.25;
  --tracking-heading: -0.9px;
  --text-heading-lg: 40px;
  --leading-heading-lg: 1.25;
  --tracking-heading-lg: -1px;
  --text-display: 56px;
  --leading-display: 1;
  --tracking-display: -2.8px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-6: 6px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-22: 22px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-36: 36px;
  --spacing-48: 48px;
  --spacing-80: 80px;
  --spacing-128: 128px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
}
```
