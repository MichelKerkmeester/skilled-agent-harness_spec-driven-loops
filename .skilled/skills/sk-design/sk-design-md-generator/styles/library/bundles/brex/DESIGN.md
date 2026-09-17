# Brex — Style Reference
> White concrete, single ember — a clinical financial instrument where one orange spark does all the talking.

**Theme:** light

Brex is a white concrete financial workbench lit by a single orange ember. The interface lives on a near-pure white canvas with tight, almost compressed Inter type and a custom Flecha display face, and the only chromatic voice in the system is #ff5900 — a vivid ember that marks every primary action, link, and tab indicator without ever becoming decorative. Dark surfaces (#000710 footer, #15191 announcement bar) frame the bright body, creating a hard light/dark bookend that makes the white sections feel taller. Components are flat with a 12px radius, minimal shadows, hairline borders, and generous 48px section gaps — the system is designed to feel like a precision instrument for finance teams, not a marketing site.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Ember | `#ff5900` | `--color-ember` | Orange supporting accent for decorative details and low-frequency emphasis; Orange supporting accent for decorative details and low-frequency emphasis. |
| Abyss | `#000710` | `--color-abyss` | Footer background, deepest dark surface — a near-black with a barely-perceptible blue cast that distinguishes it from pure black at section transitions |
| Carbon | `#15191e` | `--color-carbon` | Announcement bar, dark mode headers, elevated dark surfaces — softer than Abyss, used where dark needs to feel like product chrome rather than footer |
| Ink | `#000000` | `--color-ink` | Primary headings, body text, heavy borders — the dominant text color across light surfaces |
| Paper | `#ffffff` | `--color-paper` | Page background, card surfaces, button text on dark fills — the primary canvas |
| Fog | `#f3f3f7` | `--color-fog` | Secondary surface, input field backgrounds, subtle section dividers — the only off-white that creates layered card stacks on the Paper canvas |
| Mist | `#b9bbc6` | `--color-mist` | Hairline borders, dividers, disabled states — the structural gray that keeps cards and inputs defined without visual weight |
| Steel | `#8b8d98` | `--color-steel` | Muted icon strokes, placeholder text, secondary nav text — the mid-gray for chrome that shouldn't compete with content |
| Pewter | `#6f737b` | `--color-pewter` | Tertiary body text, caption-level labels, helper text — a step between Steel and Graphite for mid-importance copy |
| Graphite | `#60646c` | `--color-graphite` | Secondary body text, subhead descriptions, muted link text — the workhorse gray for any paragraph that isn't a heading |

## Tokens — Typography

### Inter — Universal workhorse — body, navigation, buttons, inputs, labels, links. The signature is aggressive negative tracking (-0.01 to -0.03em) at every size, making the type feel compressed and engineered rather than airy. Weight 500 carries UI chrome; weight 600 is reserved for emphasis. Inter's geometric neutrality is intentional — Flecha does the emotional work in headlines. · `--font-inter`
- **Substitute:** Inter (Google Fonts)
- **Weights:** 400, 500, 600
- **Sizes:** 10, 12, 13, 14, 16, 20, 24, 36, 48, 72
- **Line height:** 1.20–1.57
- **Letter spacing:** -0.03em at 72px, -0.025em at 48px, -0.02em at 36px, -0.01em at 24px and below
- **OpenType features:** `"calt" 0, "liga" 0, "ss03", "cv01", "cv05" 0, "cv10", "ss01" 0, "zero" 0`
- **Role:** Universal workhorse — body, navigation, buttons, inputs, labels, links. The signature is aggressive negative tracking (-0.01 to -0.03em) at every size, making the type feel compressed and engineered rather than airy. Weight 500 carries UI chrome; weight 600 is reserved for emphasis. Inter's geometric neutrality is intentional — Flecha does the emotional work in headlines.

### Flecha — Display headline face — used selectively for hero-level statements where character matters. The single weight and tight 1.11 leading give headlines a compressed, engineered presence. Inter handles all sub-headings; Flecha appears only when a heading needs brand personality. · `--font-flecha`
- **Substitute:** Söhne Breit (Klim Type Foundry) or Reckless Neue as a wide-grotesk alternative
- **Weights:** 500
- **Sizes:** 36
- **Line height:** 1.11
- **OpenType features:** `"calt" 0, "cv01", "cv05" 0, "cv10", "liga" 0, "ss01" 0, "ss03", "zero" 0`
- **Role:** Display headline face — used selectively for hero-level statements where character matters. The single weight and tight 1.11 leading give headlines a compressed, engineered presence. Inter handles all sub-headings; Flecha appears only when a heading needs brand personality.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.5 | -0.01px | `--text-caption` |
| body-sm | 14px | 1.43 | -0.01px | `--text-body-sm` |
| body | 16px | 1.5 | -0.01px | `--text-body` |
| subheading | 20px | 1.4 | -0.01px | `--text-subheading` |
| heading-sm | 24px | 1.33 | -0.01px | `--text-heading-sm` |
| heading | 36px | 1.21 | -0.02px | `--text-heading` |
| heading-lg | 48px | 1.2 | -0.025px | `--text-heading-lg` |
| display | 72px | 1 | -0.03px | `--text-display` |

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
| 48 | 48px | `--spacing-48` |
| 72 | 72px | `--spacing-72` |
| 80 | 80px | `--spacing-80` |
| 160 | 160px | `--spacing-160` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 6px |
| cards | 12px |
| inputs | 12px |
| buttons | 12px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 48-80px
- **Card padding:** 24-32px
- **Element gap:** 8-16px

## Components

### Top Announcement Bar
**Role:** Slim dark bar above the main nav for promotional or time-sensitive messaging

Full-bleed Carbon (#15191e) background, 1px vertical padding, centered Inter 12px weight 500 white text with inline Ember-colored link. No close button visible in standard use.

### Primary Navigation Bar
**Role:** Main horizontal navigation with logo, menu items, and right-aligned actions

White background, 12px radius on the right-side CTA only. Left: Brex wordmark in Ink (#000000). Center: Inter 14px weight 500 Ink nav items with caret indicators. Right: 'Sign in' and 'See a demo' as plain text links (Ink), followed by 'Get started' as a filled Ember button (12px radius, 8px 16px padding, Inter 14px weight 600, white text).

### Ember CTA Button (Filled)
**Role:** The single primary action variant — used for 'Get started', form submissions, and high-intent conversion moments

Background Ember (#ff5900), white text, 12px border-radius, 8px vertical × 16px horizontal padding, Inter 14–16px weight 600, no border. On dark backgrounds the same fill applies with Paper text. The vivid orange against white creates immediate visual priority without needing size or weight escalation.

### Ghost Link Button
**Role:** Secondary action — 'See a demo', 'See Brex in action'

No background, no border, Ink (#000000) text at Inter 14px weight 500, often prefixed with a small Ember-colored icon (play circle, arrow). Sits beside or below filled CTAs as a lower-commitment alternative.

### Email Capture Input
**Role:** Hero and inline form email field with attached submit button

White background, 1px Mist (#b9bbc6) border, 12px radius, 12–16px padding. Placeholder text in Steel (#8b8d98). The Ember 'Get started' button is attached or adjacent, creating a horizontal field+button pair with a 4–8px gap.

### Feature Category Card
**Role:** Product category tiles in 'The card is just the start' section (Corporate cards, Expense management, Travel, Bill pay, Banking and treasury)

White background, 12px radius, 24–32px padding, no visible border, subtle separation by spacing alone. Heading in Ink Inter 20–24px weight 600, body in Graphite 14–16px weight 400. Selected/active card shows Ember-colored text or underline. Product images (cards, phones, charts) anchor the bottom of the card.

### Customer Logo Grid
**Role:** Social proof band — 'Trusted by 35,000+ top companies'

Fog (#f3f3f7) background section, heading in Ink Inter ~36px weight 600 centered. Logos arranged in a 6×2 grid (or 4–5 per row on narrower layouts), all rendered in Steel/Mist monochrome. No logo gets a colored treatment — the uniformity reinforces enterprise scale.

### Article / Resource Card
**Role:** Blog or content cards in horizontal scroll/carousel sections

White background, 12px radius, no border. Top: full-bleed image (16:9 or 4:3) within the card radius. Below: Inter 20px weight 600 Ink headline, Graphite 14px weight 400 excerpt, 2–3 lines max. Carousel uses circular Paper buttons with Ink arrows at the section's left edge.

### Dark Footer
**Role:** Site-wide footer with link columns and brand mark

Abyss (#000710) background, full-bleed. Brex wordmark in Paper at top-left. Multi-column link groups in Inter 14px weight 400 with column headers in weight 600 Paper. Link text in a slightly lighter gray against Abyss for hierarchy. Generous 48–64px vertical padding.

### Cookie Consent Dialog
**Role:** Bottom-center modal for GDPR/consent compliance

White background, 12px radius, subtle shadow, max-width ~480px. Title 'Cookie Consent' in Inter 16px weight 600 Ink. Body in Graphite 14px. Three buttons in a row: 'Accept all' (filled Ember), 'Reject all' (outlined with Mist border), 'More choices' (text link). Floats above content with a 24px bottom margin.

### Carousel Navigation Controls
**Role:** Horizontal scroll indicators on content strips

Circular Paper buttons, 32–40px diameter, containing left/right Ink arrow icons. Positioned at the far left of the scroll strip with a faint horizontal line indicating scroll progress.

## Do's and Don'ts

### Do
- Use Ember (#ff5900) for exactly one purpose per region: the primary action. Never use it for decorative fills, backgrounds, or multiple competing elements on the same screen.
- Apply Inter's negative tracking to every size: -0.01em at 24px and below, -0.02em at 36px, -0.03em at 72px. The compression is the signature.
- Use 12px border-radius on all interactive surfaces (buttons, inputs, cards). Use 6px only for inline tags and small chips.
- Keep section gaps at 48–80px and card padding at 24–32px. The system breathes; do not pack content.
- Default to Paper (#ffffff) canvas with Fog (#f3f3f7) for section-level contrast. Reserve Abyss and Carbon for header/footer dark frames only.
- Use Graphite (#60646c) for body paragraphs and Pewter (#6f737b) for helper/caption text. Never use Steel for anything longer than a label.
- Set font-feature-settings to disable calt and liga on Inter — the system intentionally avoids contextual alternates and ligatures for a neutral engineered feel.

### Don't
- Don't introduce a second accent color. The single-ember system is the brand; adding blue, green, or purple breaks the visual contract.
- Don't use shadows for card elevation. The system relies on Paper/Fog contrast and 1px Mist borders — drop shadows are out of system.
- Don't use Flecha for body or sub-headings. It is a display face only; Inter handles everything below 48px.
- Don't center body text paragraphs. Headlines can be centered, but Inter body copy at 16px is left-aligned with max-width ~640px.
- Don't use Ember for text links inside paragraphs — reserve it for CTA buttons and standalone link phrases. Inline body links use Ink with an underline.
- Don't mix border-radius values within a component group. All buttons get 12px, all cards get 12px, all tags get 6px — never 8px or 10px as compromises.
- Don't use the announcement bar background (#15191e) as a generic dark surface inside the body. It belongs only at the very top of the page.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Paper Canvas | `#ffffff` | Default page background; the dominant surface across all content sections |
| 1 | Fog Section | `#f3f3f7` | Alternating section background for logo grids and banded content breaks; subtle separation without borders |
| 2 | Card Surface | `#ffffff` | Product cards, article cards, feature tiles — always Paper with 12px radius, no shadow |
| 3 | Dark Chrome | `#15191` | Announcement bar and elevated dark UI elements above the main canvas |
| 4 | Abyss Footer | `#000710` | Footer and full-bleed dark sections; the deepest surface, bookending the light body |

## Elevation

The system deliberately avoids drop shadows for elevation. Cards and surfaces are defined by Paper-on-Fog contrast and 1px Mist (#b9bbc6) hairline borders. The only exception is floating UI (cookie consent, modals), which uses a single soft shadow to indicate detachment from the canvas.

## Imagery

Product photography is the dominant visual: physical credit cards, iPhone screens showing the Brex app, and receipt/transaction interfaces, all shot on clean white or light surfaces. Photography is high-key and product-focused — no lifestyle context, no human subjects in marketing imagery. Customer logos in the trust band are rendered monochrome (Steel/Mist) to create visual uniformity regardless of original brand color. Article and blog cards use editorial photography with varied subjects (interior spaces, workspace shots, product mockups) treated as contained 16:9 crops within 12px-radius card frames. The app is icon-light in chrome areas, using simple line icons in Steel or Ember weight.

## Layout

The page is a full-bleed vertical stack of max-width 1200px centered content bands. The hero uses an asymmetric split: left-aligned text block (headline + subtext + email capture + ghost link) occupies roughly 45% width, with a product visual (angled card stack on phone mockup) on the right. Below the hero, a Fog-banded logo grid provides social proof with generous vertical padding. Feature sections alternate between centered headlines over horizontal card strips and tabbed product category selectors. Article/resource sections use a 4-column card grid with carousel overflow. The footer is a full-bleed dark Abyss band with multi-column link groups. Vertical rhythm is consistent: 48–80px between major sections, 24–32px card padding, 8–16px element gaps.

## Agent Prompt Guide

**Quick Color Reference**
- background: #ffffff
- surface alternate: #f3f3f7
- text primary: #000000 (Ink)
- text secondary: #60646c (Graphite)
- border: #b9bbc6 (Mist)
- primary action: no distinct CTA color

**Example Component Prompts**

1. *Create a hero section:* White (#ffffff) background, max-width 1200px centered. Headline at 72px Inter weight 600, #000000, letter-spacing -0.03em, line-height 1.0. Subtext at 20px Inter weight 400, #60646c. Email input (white, 1px #b9bbc6 border, 12px radius, Steel #8b8d98 placeholder) paired with an Ember (#ff5900) filled button (12px radius, 8px 16px padding, white Inter 16px weight 600 text).

2. *Create a feature category card:* White background, 12px radius, 32px padding, no border. Heading Inter 24px weight 600 #000000. Body Inter 16px weight 400 #60646c. Product image anchored at the bottom within the card's 12px radius.

3. *Create a customer logo band:* Fog (#f3f3f7) full-width section, 80px vertical padding. Centered heading Inter 36px weight 600 #000000. Logos in 6-column grid, all rendered in #8b8d98 monochrome at uniform 32px height.

4. *Create the footer:* Abyss (#000710) full-bleed background, 64px vertical padding, max-width 1200px content. Brex wordmark in #ffffff at top-left. Four columns of links: column headers in Inter 14px weight 600 #ffffff, links in Inter 14px weight 400 #b9bbc6.

5. *Create a dark announcement bar:* Carbon (#15191e) full-bleed, 1px vertical padding, centered Inter 12px weight 500 #ffffff text with an inline #ff5900 link.

## Similar Brands

- **Stripe** — Same monochrome-first fintech aesthetic with a single saturated accent for CTAs, Inter-based type, and 12px card radii
- **Linear** — Same aggressive negative letter-spacing on Inter, near-pure white canvas, and minimal-shadow flat card system
- **Ramp** — Direct fintech competitor with the same 'finance product as precision instrument' visual language — white canvas, single accent, tight compressed type
- **Notion** — Same hairline-border card system on near-white canvas with generous breathing room and no decorative shadows

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-ember: #ff5900;
  --color-abyss: #000710;
  --color-carbon: #15191e;
  --color-ink: #000000;
  --color-paper: #ffffff;
  --color-fog: #f3f3f7;
  --color-mist: #b9bbc6;
  --color-steel: #8b8d98;
  --color-pewter: #6f737b;
  --color-graphite: #60646c;

  /* Typography — Font Families */
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-flecha: 'Flecha', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --tracking-caption: -0.01px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.43;
  --tracking-body-sm: -0.01px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.01px;
  --text-subheading: 20px;
  --leading-subheading: 1.4;
  --tracking-subheading: -0.01px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.33;
  --tracking-heading-sm: -0.01px;
  --text-heading: 36px;
  --leading-heading: 1.21;
  --tracking-heading: -0.02px;
  --text-heading-lg: 48px;
  --leading-heading-lg: 1.2;
  --tracking-heading-lg: -0.025px;
  --text-display: 72px;
  --leading-display: 1;
  --tracking-display: -0.03px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;

  /* Spacing */
  --spacing-unit: 8px;
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-48: 48px;
  --spacing-72: 72px;
  --spacing-80: 80px;
  --spacing-160: 160px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 48-80px;
  --card-padding: 24-32px;
  --element-gap: 8-16px;

  /* Border Radius */
  --radius-md: 6px;
  --radius-xl: 12px;

  /* Named Radii */
  --radius-tags: 6px;
  --radius-cards: 12px;
  --radius-inputs: 12px;
  --radius-buttons: 12px;

  /* Surfaces */
  --surface-paper-canvas: #ffffff;
  --surface-fog-section: #f3f3f7;
  --surface-card-surface: #ffffff;
  --surface-dark-chrome: #15191;
  --surface-abyss-footer: #000710;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-ember: #ff5900;
  --color-abyss: #000710;
  --color-carbon: #15191e;
  --color-ink: #000000;
  --color-paper: #ffffff;
  --color-fog: #f3f3f7;
  --color-mist: #b9bbc6;
  --color-steel: #8b8d98;
  --color-pewter: #6f737b;
  --color-graphite: #60646c;

  /* Typography */
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-flecha: 'Flecha', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --tracking-caption: -0.01px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.43;
  --tracking-body-sm: -0.01px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.01px;
  --text-subheading: 20px;
  --leading-subheading: 1.4;
  --tracking-subheading: -0.01px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.33;
  --tracking-heading-sm: -0.01px;
  --text-heading: 36px;
  --leading-heading: 1.21;
  --tracking-heading: -0.02px;
  --text-heading-lg: 48px;
  --leading-heading-lg: 1.2;
  --tracking-heading-lg: -0.025px;
  --text-display: 72px;
  --leading-display: 1;
  --tracking-display: -0.03px;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-48: 48px;
  --spacing-72: 72px;
  --spacing-80: 80px;
  --spacing-160: 160px;

  /* Border Radius */
  --radius-md: 6px;
  --radius-xl: 12px;
}
```
