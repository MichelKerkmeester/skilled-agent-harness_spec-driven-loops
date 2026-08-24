# Browserbase — Style Reference
> editorial broadsheet meets data terminal — a single hot orange punctuating a near-monochrome field of oversized GT Planar headlines, soft pastel card surfaces, and tiny mono metadata.

**Theme:** light

Browserbase reads as a data-forward developer tool dressed in editorial broadsheet clothing: a near-monochrome canvas anchored by a single hot orange used purely for typographic emphasis, never for buttons. The interface stays quiet with black, white, and off-white surfaces, while cards and feature blocks introduce soft pastel tints — lavender-gray, sky blue, cream — to group content without resorting to shadows. Display headlines in GT Planar at large sizes sit alongside compact GT Standard Mono labels, creating the rhythm of a technical magazine: large confident statements punctuated by precise metadata. Filled black pill buttons carry the weight of every primary action; the orange is reserved for highlight boxes inside headlines and the footer band, making the brand color a punctuation mark rather than a navigational cue.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Ink Black | `#000000` | `--color-ink-black` | Primary text, filled action buttons, card borders, dividers — the structural spine of the entire interface |
| Paper White | `#ffffff` | `--color-paper-white` | Page canvas, card surfaces, button text on dark fills, icon fills on dark backgrounds |
| Faint Slate | `#f8fafc` | `--color-faint-slate` | Subtle off-white for logo strip cards, secondary panel backgrounds, alternating section tint |
| Lavender Mist | `#e2e9f3` | `--color-lavender-mist` | Feature card surfaces and section background tints — soft cool gray that groups content without weight |
| Blue-Gray Mist | `#c5d3e8` | `--color-blue-gray-mist` | Hero background tint, code-card surfaces, soft borders — a textured atmospheric wash |
| Cream Wash | `#fffde6` | `--color-cream-wash` | Warm pale tint for secondary card surfaces and badge backgrounds — adds warmth without chroma |
| Sky Tint | `#c4edff` | `--color-sky-tint` | Code/terminal block backgrounds, inline highlight washes on body text, light badge fills |
| Graphite | `#686562` | `--color-graphite` | Muted body text, secondary borders — the only step down from pure black for de-emphasized content |
| Signal Orange | `#ff4500` | `--color-signal-orange` | Orange outline accent for tags, dividers, and focused UI edges. Do not promote it to the primary CTA color |

## Tokens — Typography

### plain — Body text and UI labels at 16px (lh 1.50) and subheadings at 24px (lh 1.30). Neutral grotesque with near-zero letter-spacing — invisible by design, letting the display face carry hierarchy. Substitute: Inter or Geist. · `--font-plain`
- **Substitute:** Inter
- **Weights:** 400, 500
- **Sizes:** 16px, 24px
- **Line height:** 1.30–1.50
- **Letter spacing:** 0.0070em–0.0100em (~0.11–0.24px at 16px)
- **Role:** Body text and UI labels at 16px (lh 1.50) and subheadings at 24px (lh 1.30). Neutral grotesque with near-zero letter-spacing — invisible by design, letting the display face carry hierarchy. Substitute: Inter or Geist.

### gtPlanar — Display and heading face. Carries every editorial headline. Aggressive negative tracking (-0.02em to -0.05em) tightens the geometric forms; the "ss05" alternate glyph set is the signature — it reshapes letterforms into the brand's distinct voice. The 189px hero size is a statement, not a heading. Substitute: GT America or Söhne Breit for the geometric density. · `--font-gtplanar`
- **Substitute:** GT America
- **Weights:** 400, 500
- **Sizes:** 34px, 45px, 189px
- **Line height:** 1.00–1.15
- **Letter spacing:** -0.0500em at 189px (-9.45px), -0.0200em at 34–45px (-0.68 to -0.9px)
- **OpenType features:** `"ss05" on`
- **Role:** Display and heading face. Carries every editorial headline. Aggressive negative tracking (-0.02em to -0.05em) tightens the geometric forms; the "ss05" alternate glyph set is the signature — it reshapes letterforms into the brand's distinct voice. The 189px hero size is a statement, not a heading. Substitute: GT America or Söhne Breit for the geometric density.

### gtStandardMono — Metadata labels, section eyebrows, uppercase tags, code-adjacent annotations. Positive tracking (0.03–0.06em) widens the mono into a label utility, not running code. Substitute: JetBrains Mono or IBM Plex Mono. · `--font-gtstandardmono`
- **Substitute:** JetBrains Mono
- **Weights:** 400
- **Sizes:** 14px
- **Line height:** 1.00–1.20
- **Letter spacing:** 0.0300em–0.0600em (0.42–0.84px at 14px)
- **Role:** Metadata labels, section eyebrows, uppercase tags, code-adjacent annotations. Positive tracking (0.03–0.06em) widens the mono into a label utility, not running code. Substitute: JetBrains Mono or IBM Plex Mono.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 14px | 1.2 | 0.6px | `--text-caption` |
| body | 16px | 1.5 | 0.11px | `--text-body` |
| subheading | 24px | 1.3 | -0.12px | `--text-subheading` |
| heading | 34px | 1.15 | -0.68px | `--text-heading` |
| heading-lg | 45px | 1.1 | -0.9px | `--text-heading-lg` |
| display | 189px | 1 | -9.45px | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** compact

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 8 | 8px | `--spacing-8` |
| 12 | 12px | `--spacing-12` |
| 16 | 16px | `--spacing-16` |
| 24 | 24px | `--spacing-24` |
| 32 | 32px | `--spacing-32` |
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |
| 56 | 56px | `--spacing-56` |
| 60 | 60px | `--spacing-60` |
| 96 | 96px | `--spacing-96` |
| 224 | 224px | `--spacing-224` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 999px |
| cards | 4px |
| buttons | 50px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 64-96px
- **Card padding:** 16-24px
- **Element gap:** 8-16px

## Components

### Pill Action Button (Primary)
**Role:** Filled black CTA used for every primary action — 'Get API key', 'Get a demo', 'Get started'

Background #000000, text #ffffff, family plain at 16px weight 500, padding 8px 21px (vertical/horizontal), border-radius 50px. No border. Compact height (~36px). The heavy black fill is the only saturated action surface in the system.

### Ghost Button
**Role:** Secondary action with icon — 'Copy prompt' with copy icon

Background transparent, border 1px #000000, text #000000, family plain 16px weight 500, padding 8px 21px, border-radius 50px. Icon sits to the right of label with 6px gap. Behaves as the quiet companion to the primary pill.

### Orange Highlight Box
**Role:** Inline typographic emphasis inside headlines — wraps a key phrase with an orange block

Background #ff4500, text #000000, family gtPlanar at heading size with normal weight. Sits inline within a headline, with the same baseline and size as surrounding text. Padding ~2px 6px, no border-radius or very slight (~2px). The highlight is the signature: it makes the orange a punctuation mark, not a control.

### Navigation Bar
**Role:** Top-level site navigation

Background #ffffff with 1px #e2e9f3 bottom border, height ~56px, padding 3px horizontal. Left: logo (orange B icon + plain wordmark). Center: nav links in plain 16px #000000 with 16px column gap. Right: 'Log in' (text link), 'Sign up' (text link), 'Get a demo' (pill button). Links spaced 21px apart.

### Feature Card
**Role:** 4-column grid card for feature illustrations and descriptions

Background #e2e9f3, border-radius 4px, padding 16-24px. Contains a browser-window mockup illustration (white card with 3-dot chrome, ~3px radius, light gray border), a headline in gtPlanar 16-24px weight 500, body text in plain 16px #686562, and a 'Get started' pill button at the bottom. Cards sit directly on the white canvas — the lavender fill creates the grouping.

### Logo Card
**Role:** Company logo cell in the social-proof strip

Background #f8fafc, border-radius 4px, padding 24px vertical / 24-32px horizontal. Contains a single grayscale company logo centered. Arranged in a horizontal row with 6-8px column gaps. Subtle background tint lets the logos read as a group without dividers.

### Code/Terminal Card
**Role:** Code snippet or search query demonstration block

Background #c5d3e8 or #c4edff, border-radius 4px, padding 16-24px. Contains a mono label at the top in gtStandardMono 14px (e.g. 'Searching for "roundtrip flight from SFO to NYC"') and one or more light input fields below (white fill, ~3px radius, 1px lavender border). Functions as a product demonstration surface.

### Browser Window Mockup
**Role:** Illustration element inside feature cards — mimics a real browser tab

White surface with 1px #e2e9f3 border, border-radius ~3px. Top bar shows three small circular dots (window controls) in #c5d3e8. Content area contains a simplified UI element (sign-in form, broken-flow alert, search list) rendered in the same monochrome + single-orange language as the rest of the system. Always sits inside a feature card.

### Section Header
**Role:** Centered heading group for content sections

Two-line structure: large headline in gtPlanar 34-45px weight 500, #000000, letter-spacing -0.68 to -0.9px, with an orange highlight box on the key phrase. Subtitle below in plain 16px weight 400, #686562, line-height 1.50. Centered on the canvas with 16-24px gap between headline and subtitle.

### Two-Column API Block
**Role:** Product feature row — visual left, description right

Left column: code/terminal card (see above) taking ~55% width. Right column: headline in plain or gtPlanar 18-24px, body in plain 16px #686562, and an underlined text link in #000000. Columns separated by 24-32px gap. Aligned top, not centered.

### Mono Eyebrow Label
**Role:** Section metadata, small uppercase tag above or below content

Family gtStandardMono 14px weight 400, letter-spacing 0.06em, uppercase, color #000000 or #686562. Used for '10,000+ COMPANIES BUILDING BEYOND THE API'-style stat strips. Centered or left-aligned, sits 16-24px from the nearest content block.

### Footer Band
**Role:** Site footer

Background #ff4500 (Signal Orange), text #000000. Full-bleed. The orange band is the only large chromatic surface in the system — it bookends the page and makes the footer unmistakable. Content stacks centered with plain text links and metadata.

## Do's and Don'ts

### Do
- Use #000000 fill with 50px border-radius for every primary action button — the black pill is the only action surface.
- Wrap a key phrase in any headline with a #ff4500 orange highlight box at the same font size and weight as surrounding text.
- Apply 'ss05' font-feature-settings to all gtPlanar text — the alternate glyph set is the brand's typographic identity.
- Use #e2e9f3 lavender-mist for feature card surfaces and #f8fafc faint-slate for logo strip cards to create grouping without dividers.
- Set gtPlanar display headlines with letter-spacing -0.02em to -0.05em (tighter as size increases) — negative tracking is what makes the headlines feel editorial.
- Use gtStandardMono 14px with 0.06em letter-spacing in uppercase for section metadata, eyebrows, and stat labels.
- Keep the interface 95%+ monochrome — the single orange is a highlight tool, not a surface color.

### Don't
- Never use #ff4500 as a button background, border, or hover state — it is a typographic accent only.
- Never use box-shadow for card elevation — communicate depth through surface color contrast and 1px borders instead.
- Never use a geometric or display font for body text — plain (or Inter substitute) is the only UI face below 24px.
- Never use fully rounded 999px radius on buttons — the 50px pill is a specific mid-weight, not a full capsule.
- Never use chromatic text colors for body copy — text is #000000 or #686562 only.
- Never place multiple orange highlight boxes in the same headline — one phrase per line gets the emphasis.
- Never use #0000ee or browser default link blue — underlined #000000 is the link style.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Paper White | `#ffffff` | Primary page canvas and content section backgrounds |
| 1 | Faint Slate | `#f8fafc` | Logo strip band, alternating section tint, quiet panel backgrounds |
| 2 | Lavender Mist | `#e2e9f3` | Feature card surface, grouped content blocks, code-card base |
| 3 | Blue-Gray Mist | `#c5d3e8` | Hero atmospheric background, elevated card surfaces, soft borders |
| 4 | Cream Wash | `#fffde6` | Warm accent surface, badge backgrounds, callout fills |

## Elevation

Elevation is communicated through surface color shifts and hairline 1px borders, never through drop shadows. Cards sit on the canvas via contrast between lavender/cream fills and the white background; a 1px black or lavender border seals the edge. Box-shadow appears only once in the system — a single soft blue-gray halo (#c5d3e8) behind the hero illustration area. This flatness is a signature: the design trusts color and spacing to create depth, not simulated lighting.

## Imagery

Imagery is minimal and deliberately pixelated/digital. The hero centerpiece is a data-mountain visualization rendered in coarse pixel art: green, yellow, orange, and black pixels forming jagged mountain ridges against a light blue dot-textured sky. Product illustrations are flat browser-window mockups with simplified UI inside, never photorealistic. No photography anywhere. Iconography is mono-weight geometric, drawn in 1-2px strokes. The overall visual language is digital-native: pixels, halftone dots, terminal cursors, and code blocks replace traditional photography and illustration. Imagery occupies large hero real estate but is zero-density everywhere else.

## Layout

Full-bleed hero with atmospheric blue-gray background and centered headline + CTA stack. Content sections center within a ~1200px max-width. Logo strip spans full width as a quiet band between hero and content. Feature sections alternate between centered text-only headers and two-column (visual + text) product rows. Feature card grid is 4 columns at desktop, with cards on lavender surfaces. Vertical rhythm is generous: 64-96px between major sections, 8-16px between elements. The page reads top-to-bottom as: dramatic hero → quiet social proof → editorial feature sections → product showcases → orange footer. Navigation is a single sticky top bar with a pill CTA. The layout trusts whitespace and surface color to create grouping, never visible grid lines or dividers.

## Agent Prompt Guide

Quick Color Reference:
- text: #000000
- background: #ffffff
- border: #000000 / #e2e9f3
- accent: #ff4500 (Signal Orange — headlines and footer only)
- primary action: #000000 (filled action)
- muted text: #686562

Example Component Prompts:

1. Hero section: Full-bleed #c5d3e8 background with dot texture. Centered headline in gtPlanar 45px weight 500, #000000, letter-spacing -0.9px, with a #ff4500 highlight box around the key phrase (same size, padding 2px 6px). Subtitle in plain 16px weight 400, #686562, line-height 1.50. Primary CTA: black pill button (#000000 bg, #ffffff text, plain 16px weight 500, padding 8px 21px, 50px radius). Secondary CTA: ghost button (transparent bg, 1px #000000 border, same pill geometry).

2. Feature card: Background #e2e9f3, border-radius 4px, padding 24px. Browser window mockup inside (white surface, 1px #e2e9f3 border, 3px radius, 3 circular #c5d3e8 window-control dots in top bar). Headline in gtPlanar 24px weight 500, #000000, letter-spacing -0.12px. Body in plain 16px, #686562. 'Get started' black pill button at the bottom.

3. Section header: Centered. Eyebrow in gtStandardMono 14px, 0.06em tracking, uppercase, #000000. Headline in gtPlanar 34px weight 500, #000000, letter-spacing -0.68px, with a #ff4500 highlight box on the emphasis phrase. Subtitle in plain 16px, #686562, 16-24px below.

4. Logo strip card: Background #f8fafc, border-radius 4px, padding 24px. Contains a single grayscale company logo, centered. Arranged in a horizontal row with 8px column gaps on a white section background.

5. Code card: Background #c5d3e8, border-radius 4px, padding 16-24px. Mono label at top in gtStandardMono 14px with 0.06em tracking. One or more white input fields below (white bg, 1px #e2e9f3 border, 3px radius, padding 8-12px).

## Similar Brands

- **Resend** — Same editorial-display-meets-developer-tool aesthetic: oversized geometric headlines, near-monochrome canvas, single bold accent color reserved for typographic highlights, and compact pill CTAs
- **Vercel** — Shared monochrome dominance with black filled pill buttons, tight spacing density, and the discipline of letting one accent color (orange here, black-on-white there) carry all the brand energy
- **Linear** — Matching compact density, hairline borders instead of shadows for card separation, and a near-achromatic palette with surgical use of color only for state and emphasis
- **Stripe** — Same approach to soft pastel-tinted card surfaces (lavender, sky blue, cream) sitting on a white canvas to group content without dividers or elevation
- **Raycast** — Developer-tool sensibility with mono metadata labels, compact pill buttons, and the confidence to keep the entire interface near-monochrome with color as punctuation

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-ink-black: #000000;
  --color-paper-white: #ffffff;
  --color-faint-slate: #f8fafc;
  --color-lavender-mist: #e2e9f3;
  --color-blue-gray-mist: #c5d3e8;
  --color-cream-wash: #fffde6;
  --color-sky-tint: #c4edff;
  --color-graphite: #686562;
  --color-signal-orange: #ff4500;

  /* Typography — Font Families */
  --font-plain: 'plain', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-gtplanar: 'gtPlanar', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-gtstandardmono: 'gtStandardMono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.2;
  --tracking-caption: 0.6px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: 0.11px;
  --text-subheading: 24px;
  --leading-subheading: 1.3;
  --tracking-subheading: -0.12px;
  --text-heading: 34px;
  --leading-heading: 1.15;
  --tracking-heading: -0.68px;
  --text-heading-lg: 45px;
  --leading-heading-lg: 1.1;
  --tracking-heading-lg: -0.9px;
  --text-display: 189px;
  --leading-display: 1;
  --tracking-display: -9.45px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-56: 56px;
  --spacing-60: 60px;
  --spacing-96: 96px;
  --spacing-224: 224px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 64-96px;
  --card-padding: 16-24px;
  --element-gap: 8-16px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-full: 50px;
  --radius-full-2: 999px;

  /* Named Radii */
  --radius-tags: 999px;
  --radius-cards: 4px;
  --radius-buttons: 50px;

  /* Surfaces */
  --surface-paper-white: #ffffff;
  --surface-faint-slate: #f8fafc;
  --surface-lavender-mist: #e2e9f3;
  --surface-blue-gray-mist: #c5d3e8;
  --surface-cream-wash: #fffde6;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-ink-black: #000000;
  --color-paper-white: #ffffff;
  --color-faint-slate: #f8fafc;
  --color-lavender-mist: #e2e9f3;
  --color-blue-gray-mist: #c5d3e8;
  --color-cream-wash: #fffde6;
  --color-sky-tint: #c4edff;
  --color-graphite: #686562;
  --color-signal-orange: #ff4500;

  /* Typography */
  --font-plain: 'plain', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-gtplanar: 'gtPlanar', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-gtstandardmono: 'gtStandardMono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.2;
  --tracking-caption: 0.6px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: 0.11px;
  --text-subheading: 24px;
  --leading-subheading: 1.3;
  --tracking-subheading: -0.12px;
  --text-heading: 34px;
  --leading-heading: 1.15;
  --tracking-heading: -0.68px;
  --text-heading-lg: 45px;
  --leading-heading-lg: 1.1;
  --tracking-heading-lg: -0.9px;
  --text-display: 189px;
  --leading-display: 1;
  --tracking-display: -9.45px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-56: 56px;
  --spacing-60: 60px;
  --spacing-96: 96px;
  --spacing-224: 224px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-full: 50px;
  --radius-full-2: 999px;
}
```
