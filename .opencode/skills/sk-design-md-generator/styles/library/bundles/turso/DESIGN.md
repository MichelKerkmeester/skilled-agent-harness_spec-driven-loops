# Turso — Style Reference
> Terminal glow in a server closet — the mint LED on a rack of dark steel.

**Theme:** dark

Turso operates in a deep-space developer console aesthetic: near-black canvas with subtle teal undertones, a single vivid mint accent that acts as the system's 'powered on' signal, and a secondary electric magenta for beta/experimental framing. The interface stays quiet and typographic — white text on dark surfaces carries the content — while color appears only as functional punctuation for headings, badges, primary actions, and the thin colored borders that define product cards. Components feel light and terminal-like: pill buttons, thin outlined cards with a one-pixel gradient edge, monospace-flecked code snippets, and flat surfaces without drop-shadow elevation. The result reads as an infrastructure product designed by people who think in terminals — restrained, confident, and unmistakably dark.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Deep Space | `#0d1318` | `--color-deep-space` | Page background, deepest canvas layer, link-on-light contrast |
| Obsidian | `#121b1f` | `--color-obsidian` | Hero and large content surface, slightly lifted from canvas |
| Carbon Teal | `#162129` | `--color-carbon-teal` | Card surface, button hover backgrounds, elevated containers |
| Slate Drift | `#283945` | `--color-slate-drift` | Subtle borders, dividers, muted panel borders, ghost button surfaces |
| Bone White | `#ffffff` | `--color-bone-white` | Primary text, icon strokes, button text, nav labels |
| Ash Gray | `#c5cace` | `--color-ash-gray` | Secondary text, link default state, muted body |
| Fog Gray | `#b6b8ba` | `--color-fog-gray` | Tertiary text, nav helper labels, subtle metadata |
| Smoke Gray | `#86898c` | `--color-smoke-gray` | Muted paragraph text, de-emphasized descriptions |
| Pewter | `#9ea1a3` | `--color-pewter` | Disabled or low-emphasis body text |
| Mint Signal | `#4ff7d1` | `--color-mint-signal` | Teal supporting accent for decorative details and low-frequency emphasis. Do not promote it to the primary CTA color |
| Deep Teal | `#0e342d` | `--color-deep-teal` | Muted teal surface for announcement banner, subtle teal-tinted backgrounds |
| Electric Magenta | `#d946ef` | `--color-electric-magenta` | Secondary accent — beta badges, inline code highlights, experimental product card, code snippet button |
| Plum Edge | `#a21caf` | `--color-plum-edge` | Chromatic card border for the open-source / self-hosted product variant |

## Tokens — Typography

### Inter — Single typeface across the entire system. Weight 800 at 72px for hero headlines, weight 600-700 for product card titles and section headings, weight 500 for nav and labels, weight 400 for body and descriptions. Consistent -0.025em tracking tightens the geometric forms and gives the dark UI a compressed, technical feel. · `--font-inter`
- **Substitute:** Inter (Google Fonts)
- **Weights:** 400, 500, 600, 700, 800
- **Sizes:** 12, 14, 16, 18, 20, 24, 30, 36, 48, 72
- **Line height:** 1.20, 1.33, 1.50, 1.60, 1.78
- **Letter spacing:** -0.025em applied globally across the type scale
- **Role:** Single typeface across the entire system. Weight 800 at 72px for hero headlines, weight 600-700 for product card titles and section headings, weight 500 for nav and labels, weight 400 for body and descriptions. Consistent -0.025em tracking tightens the geometric forms and gives the dark UI a compressed, technical feel.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.5 | -0.3px | `--text-caption` |
| body-sm | 14px | 1.5 | -0.35px | `--text-body-sm` |
| body | 16px | 1.6 | -0.4px | `--text-body` |
| body-lg | 18px | 1.78 | -0.45px | `--text-body-lg` |
| subheading | 24px | 1.33 | -0.6px | `--text-subheading` |
| heading-sm | 30px | 1.2 | -0.75px | `--text-heading-sm` |
| heading | 36px | 1.2 | -0.9px | `--text-heading` |
| heading-lg | 48px | 1.11 | -1.2px | `--text-heading-lg` |
| display | 72px | 1 | -1.8px | `--text-display` |

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
| 56 | 56px | `--spacing-56` |
| 64 | 64px | `--spacing-64` |
| 128 | 128px | `--spacing-128` |

### Border Radius

| Element | Value |
|---------|-------|
| nav | 24px |
| cards | 16px |
| badges | 9999px |
| buttons | 9999px |
| smallCards | 12px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 40px
- **Element gap:** 16px

## Components

### Announcement Banner
**Role:** Top-of-page promo strip

Full-width band on a deep teal-tinted surface (#0e342d border tone over #0d1318). Centered text in 14px Inter weight 500, white with a teal underlined link. Zero vertical padding beyond 8px top/bottom. Used exclusively for beta or launch promotions.

### Primary Navigation Bar
**Role:** Top-level site navigation

Horizontal bar on the deepest canvas. Logo (teal bull icon + white 'turso' wordmark) left-aligned, nav links (Docs, Cloud, Pricing, Blog, Changelog) in 14px Inter weight 500, social icons, 'Login' text link, and a teal filled pill button 'Get Started' right-aligned. Links hover to white from a muted gray default.

### Pill Ghost Nav Link
**Role:** Inactive navigation item

Transparent background, text in #b6b8ba, 14px Inter weight 500, no border. Hover transitions text to #ffffff. No background fill on any state.

### Filled Teal CTA Button
**Role:** Primary action

Background #4ff7d1, text #0d1318 (near-black for AAA contrast), 14px Inter weight 600, 9999px border-radius, 10px vertical / 20px horizontal padding. No shadow. The single highest-prominence chromatic element in the system.

### Filled Magenta Secondary Button
**Role:** Secondary action, code-related call

Background #d946ef, text #0d1318, 14px Inter weight 600, 9999px border-radius, 8px 16px padding. Used for copy-to-clipboard code buttons and experimental/beta CTAs where the teal is already occupied by the primary action.

### Hero Badge
**Role:** Contextual label above hero headline

Pill-shaped (9999px radius), 12px Inter weight 500, text in teal #4ff7d1 on a #0e342d / #162129 tinted background. Optional hairline border in teal. Carries a short descriptor like 'The Database for the Age of AI Agents.'

### Hero Headline
**Role:** Primary page headline

72px Inter weight 800, color #4ff7d1, line-height 1.00, letter-spacing -1.8px. Centered. The display-scale choice that defines the brand voice — mint-on-black, maximally compressed.

### Product Card — Teal Variant
**Role:** Feature card for the cloud / production product

Background #121b1f, 1px solid #4ff7d1 border (the signature colored-edge treatment), 16px border-radius, 40px internal padding. Contains a teal pill badge ('PRODUCTION READY'), 30px Inter weight 700 title in white, 16px body in #86898c, and a teal filled CTA button at the bottom.

### Product Card — Magenta Variant
**Role:** Feature card for the open-source / self-hosted product

Same structure as the teal card but with a #a21caf (deep plum) border. Contains a magenta #d946ef pill badge ('BETA'), a code snippet block, and a GitHub star count button in ghost style.

### Pill Badge
**Role:** Status, version, or category label

9999px border-radius, 6-8px vertical / 14-16px horizontal padding, 12px Inter weight 600, uppercase or title-case. Two variants: teal-on-dark-teal (#4ff7d1 text on #0e342d surface) and magenta-on-dark-magenta (#d946ef text on a #1c2b34 / #0d1318 surface).

### Code Snippet Block
**Role:** Terminal-style command display

Background #162129, 12px border-radius, 1px #283945 border, 16px padding. Monospaced text in white with the command in white and flags/options in a muted gray. Often paired with a magenta copy button overlapping the right edge.

### Inline Text Link
**Role:** In-prose hyperlink

No underline by default. Text in #c5cace (secondary white). On hover, transitions to #4ff7d1 teal. Some in-prose links use the teal as the resting state to emphasize a product or feature name.

### Social Icon Button
**Role:** External link to GitHub, X, Discord

16-20px monochrome icon, white or #b6b8ba stroke, no background, no border, no padding. Used in the nav bar. Hover brightens to #ffffff.

### Logo Trust Grid
**Role:** Social proof / integration partners

Multi-column grid (4-5 columns) of partner logos in monochrome white or #b6b8ba, evenly spaced with ~40px vertical and ~48px horizontal gap. Logos sit on the page canvas directly — no card containers — to keep the section feeling like a developer credibility wall, not a marketing strip.

### Ghost Text Button
**Role:** Tertiary action, low-emphasis link-button

Transparent background, no border, text in #ffffff, 14px Inter weight 500, optional 4px 8px padding. Sits beside primary CTAs as a 'Schedule a Call' alternative path.

## Do's and Don'ts

### Do
- Use #4ff7d1 as the single primary action background and brand voice color — one CTA per viewport section.
- Set all buttons and badges to 9999px border-radius; use 12px for code blocks and 16px for product cards.
- Reserve -0.025em letter-spacing globally; tighten further at display sizes (-1.8px at 72px).
- Build product card distinction through 1px colored borders (#4ff7d1 or #a21caf) on a flat #121b1f surface — never use drop shadows.
- Use Inter weight 800 only for the hero display headline; use 600-700 for product card titles, 400-500 for everything else.
- Keep #d946ef magenta scoped to beta labels, code-adjacent buttons, and the self-hosted product card — never as a general accent.
- Maintain 80px section gaps and 40px card padding as the rhythm anchors for comfortable dark-mode reading.

### Don't
- Do not introduce drop shadows or elevation glows — depth comes from surface tone shifts and colored borders only.
- Do not use #4ff7d1 for body text or long-form paragraphs — reserve teal for headlines, links, and the CTA background.
- Do not mix the teal and magenta on the same surface element; they signal distinct product variants and must stay segregated.
- Do not use radii other than the four values: 9999px, 24px, 16px, 12px. No 4px or 8px rounding.
- Do not set body text below #86898c — anything dimmer fails contrast on the dark canvas.
- Do not use chromatic colors for borders on anything other than product cards; UI dividers stay in #283945.
- Do not introduce additional accent hues — the two-color chromatic system (mint + magenta) is the entire brand language.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Deep Space | `#0d1318` | Outermost page canvas |
| 1 | Obsidian | `#121b1f` | Hero and large content sections with the subtle inner-border treatment |
| 2 | Carbon Teal | `#162129` | Product cards, code snippet containers, elevated content blocks |
| 3 | Slate Drift | `#283945` | Hairline borders, ghost surfaces, nav pill backgrounds |

## Elevation

Turso avoids drop-shadow elevation entirely. Depth is communicated through surface tonal shifts (canvas → card → elevated) and thin 1px colored borders on key cards. The teal and magenta border edges act as the only 'lifted' signal — the card itself is flat, but its colored perimeter says 'this is a distinct product variant.' This flat-with-colored-edge treatment keeps the UI feeling terminal-adjacent rather than app-like.

## Imagery

No photography, no illustrations, no 3D renders. The visual system is pure UI: typography, colored borders, and a monochrome partner-logo trust grid. Icons are thin-stroke single-color (1.5-2px stroke weight) in white or teal, used sparingly in nav and product cards. Code snippets double as the primary visual texture — monospaced text in dark panels is the site's only 'imagery' equivalent.

## Layout

Centered, max-width 1200px contained layout with a full-bleed dark canvas. The hero is a centered text stack: announcement banner → nav → pill badge → 72px teal headline → two-paragraph description in muted gray → dual CTA row → 4-column partner logo grid. Below the hero, content sections alternate between centered text blocks and 2-column product card grids. Product cards are equal-width siblings in a 2-up grid with a 24-40px gap. Sections are separated by 80px vertical gaps with no dividers — the dark canvas flows continuously, with section identity carried by typography scale and the two product card border colors rather than surface color changes.

## Agent Prompt Guide

**Quick Color Reference**
- text: #ffffff (primary), #c5cace (secondary), #86898c (muted body)
- background: #0d1318 (canvas), #121b1f (hero/section), #162129 (card), #283945 (border/ghost)
- border: #283945 (default hairline), #4ff7d1 (product card teal), #a21caf (product card plum)
- accent: #4ff7d1 (mint — brand voice, headlines, links, primary action)
- secondary accent: #d946ef (magenta — beta labels, code buttons, self-hosted card)
- primary action: no distinct CTA color

**Example Component Prompts**

No distinct primary action color was observed; use the extracted neutral button treatments instead of inventing a filled CTA color.


3. *Build the plum product card*: Same structure as teal card but border becomes 1px solid #a21caf. Badge: 'BETA' in 12px weight 600, #d946ef text on a dark magenta-tinted surface, 9999px radius. Include a code snippet block (background #162129, 12px radius, 1px #283945 border, 16px padding, monospaced white text) and a ghost GitHub star button beside it (transparent bg, 1px #283945 border, 9999px radius, 12px weight 500, #ffffff text, star icon).

4. *Build the announcement banner*: Full-width strip on #0d1318 canvas with 1px #0e342d bottom border. Centered text at 14px Inter weight 500, #ffffff, with an inline teal-underlined link 'Join the private beta' in #4ff7d1. Padding 8px top and bottom.

5. *Build the partner logo grid*: 4-column grid on the #0d1318 canvas, no card containers, 48px row gap, 40px column gap. Each logo is a monochrome wordmark in #b6b8ba at 16-20px display size. Section is preceded by no header — logos sit in a clean horizontal band as a credibility wall.

## Similar Brands

- **Supabase** — Same dark-canvas devtool aesthetic with a single vivid brand color (Supabase's green, Turso's mint) carrying the primary action and headline.
- **Fly.io** — Terminal-adjacent dark mode, flat surfaces without drop-shadow elevation, and a thin colored border treatment on feature cards.
- **PlanetScale** — Developer-focused dark UI with high-contrast white-on-near-black typography and a single saturated accent (PlanetScale's purple) used sparingly on CTAs and links.
- **Cloudflare** — Dense technical content on a near-black canvas with restrained chromatic accents that signal interactivity rather than decoration.
- **Vercel** — Pill-shaped buttons (9999px radius), near-monochrome dark surfaces, and a quiet single-accent approach that lets the accent do all the chromatic work.

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-deep-space: #0d1318;
  --color-obsidian: #121b1f;
  --color-carbon-teal: #162129;
  --color-slate-drift: #283945;
  --color-bone-white: #ffffff;
  --color-ash-gray: #c5cace;
  --color-fog-gray: #b6b8ba;
  --color-smoke-gray: #86898c;
  --color-pewter: #9ea1a3;
  --color-mint-signal: #4ff7d1;
  --color-deep-teal: #0e342d;
  --color-electric-magenta: #d946ef;
  --color-plum-edge: #a21caf;

  /* Typography — Font Families */
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --tracking-caption: -0.3px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.5;
  --tracking-body-sm: -0.35px;
  --text-body: 16px;
  --leading-body: 1.6;
  --tracking-body: -0.4px;
  --text-body-lg: 18px;
  --leading-body-lg: 1.78;
  --tracking-body-lg: -0.45px;
  --text-subheading: 24px;
  --leading-subheading: 1.33;
  --tracking-subheading: -0.6px;
  --text-heading-sm: 30px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: -0.75px;
  --text-heading: 36px;
  --leading-heading: 1.2;
  --tracking-heading: -0.9px;
  --text-heading-lg: 48px;
  --leading-heading-lg: 1.11;
  --tracking-heading-lg: -1.2px;
  --text-display: 72px;
  --leading-display: 1;
  --tracking-display: -1.8px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
  --font-weight-extrabold: 800;

  /* Spacing */
  --spacing-unit: 8px;
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-56: 56px;
  --spacing-64: 64px;
  --spacing-128: 128px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 40px;
  --element-gap: 16px;

  /* Border Radius */
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-3xl: 24px;
  --radius-full: 9999px;

  /* Named Radii */
  --radius-nav: 24px;
  --radius-cards: 16px;
  --radius-badges: 9999px;
  --radius-buttons: 9999px;
  --radius-smallcards: 12px;

  /* Surfaces */
  --surface-deep-space: #0d1318;
  --surface-obsidian: #121b1f;
  --surface-carbon-teal: #162129;
  --surface-slate-drift: #283945;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-deep-space: #0d1318;
  --color-obsidian: #121b1f;
  --color-carbon-teal: #162129;
  --color-slate-drift: #283945;
  --color-bone-white: #ffffff;
  --color-ash-gray: #c5cace;
  --color-fog-gray: #b6b8ba;
  --color-smoke-gray: #86898c;
  --color-pewter: #9ea1a3;
  --color-mint-signal: #4ff7d1;
  --color-deep-teal: #0e342d;
  --color-electric-magenta: #d946ef;
  --color-plum-edge: #a21caf;

  /* Typography */
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --tracking-caption: -0.3px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.5;
  --tracking-body-sm: -0.35px;
  --text-body: 16px;
  --leading-body: 1.6;
  --tracking-body: -0.4px;
  --text-body-lg: 18px;
  --leading-body-lg: 1.78;
  --tracking-body-lg: -0.45px;
  --text-subheading: 24px;
  --leading-subheading: 1.33;
  --tracking-subheading: -0.6px;
  --text-heading-sm: 30px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: -0.75px;
  --text-heading: 36px;
  --leading-heading: 1.2;
  --tracking-heading: -0.9px;
  --text-heading-lg: 48px;
  --leading-heading-lg: 1.11;
  --tracking-heading-lg: -1.2px;
  --text-display: 72px;
  --leading-display: 1;
  --tracking-display: -1.8px;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-56: 56px;
  --spacing-64: 64px;
  --spacing-128: 128px;

  /* Border Radius */
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-3xl: 24px;
  --radius-full: 9999px;
}
```
