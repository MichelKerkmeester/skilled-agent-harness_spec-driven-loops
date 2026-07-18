# Outseta — Style Reference
> Sunset marketplace at golden hour — a warm gradient sky hanging over deep plum night.

**Theme:** light

Outseta uses a warm sunset-marketplace language: a golden-hour gradient hero (pink to cream to yellow) anchors the page, paired with deep eggplant text (#240029) that gives the interface a grounded, premium feel. The brand color story is purple-forward — nearly all borders, body text, and icon strokes carry the #240029 tint rather than neutral black, which makes even functional chrome feel on-brand. The singular hot pink (#df37a7) does the heavy lifting as the sole action color, keeping commerce moments tight and unambiguous. A mono-spaced eyebrow font (JetBrains Mono at wide tracking) introduces every section, and free-form Permanent Marker annotations float over the hero, giving the marketing surface a hand-built, studio-notebook personality. Components are soft-cornered (6-14px), low-shadow, and sit on white with purple-tinted shadows rather than gray.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Aubergine | `#240029` | `--color-aubergine` | Primary text, icon strokes, hairline borders, and the dark-section fill — the structural ink of the system; every functional border carries this tint rather than neutral gray |
| Fuchsia Signal | `#df37a7` | `--color-fuchsia-signal` | Primary action fill (Sign up CTA, active states) — the only hot chromatic in the system, reserved exclusively for the conversion moment |
| Heather | `#6d526d` | `--color-heather` | Pink accent for outlined action borders, linked labels, and lightweight interactive emphasis. |
| Glowstick | `#ffcc11` | `--color-glowstick` | Hero gradient terminal color and decorative accent — a single warm yellow used only for celebration moments and the sunset gradient |
| Plum Tinted | `#d4ccd4` | `--color-plum-tinted` | Mauve-tinted light border, the default hairline — always carries a hint of the brand purple rather than being pure gray |
| Ink | `#222222` | `--color-ink` | Icon strokes and link text where the brand purple is too saturated; the near-neutral companion to Aubergine |
| Smoke | `#bbadbb` | `--color-smoke` | Soft border and muted heading accent — a lighter companion to Plum Tinted for secondary dividers |
| Charcoal | `#333333` | `--color-charcoal` | Body text fallback and image-level deep fills |
| Frost | `#767676` | `--color-frost` | Input border, form field resting state |
| Forest | `#15803d` | `--color-forest` | Success badge text and inline success state — a true forest green for confirmations and positive feedback |
| Mint | `#bbf7d0` | `--color-mint` | Green outline accent for tags, dividers, and focused UI edges. Use as a supporting accent, not as a status color |
| Honeydew | `#dcfce7` | `--color-honeydew` | Success badge background — the soft mint wash behind positive status pills |
| Strawberry | `#ef4444` | `--color-strawberry` | Red outline accent for tags, dividers, and focused UI edges. Use as a supporting accent, not as a status color |
| Mango | `#22c55e` | `--color-mango` | Green outline accent for tags, dividers, and focused UI edges. Use as a supporting accent, not as a status color |
| Canvas | `#ffffff` | `--color-canvas` | Page background, card surface, button text on dark fills |
| Hero Glow | `linear-gradient(145deg, #ffbdd3, #fff1bd 40%, #fff1bd 60%, #ffcb0f)` | `--color-hero-glow` | Terminal stop of the hero gradient — a soft rose that opens the sunset wash |

## Tokens — Typography

### Inter Var — Workhorse UI and body font — the single axis variable cuts tracking at every size (-0.02em at 10px through -0.004em at 36px), so body text and headings share one family with no jarring weight jumps. · `--font-inter-var`
- **Substitute:** Inter
- **Weights:** 400, 500, 600, 700
- **Sizes:** 10px, 12px, 14px, 16px, 20px, 24px, 36px
- **Line height:** 1.20-1.50
- **Letter spacing:** -0.20px at 10px, -0.16px at 12px, -0.14px at 14px, -0.16px at 16px, -0.16px at 20px, -0.20px at 36px
- **OpenType features:** `"calt" on, "cv11" on, "ss02" on, "ss03" on`
- **Role:** Workhorse UI and body font — the single axis variable cuts tracking at every size (-0.02em at 10px through -0.004em at 36px), so body text and headings share one family with no jarring weight jumps.

### Kaio — Display headlines — bold, ultra-condensed sans with strong character, used at 56-80px for hero statements. The choice of a single bold weight with tight tracking is anti-convention; most SaaS sites pair weight 300 whispers with 700 shouts. Kaio commits fully to one volume. · `--font-kaio`
- **Substitute:** Boldonse, Inter Tight 800, or General Sans Bold
- **Weights:** 700
- **Sizes:** 36px, 56px, 80px
- **Line height:** 1.00-1.20
- **Letter spacing:** -0.0200em, -0.0040em
- **OpenType features:** `"ss03", "calt", "cv11", "ss02"`
- **Role:** Display headlines — bold, ultra-condensed sans with strong character, used at 56-80px for hero statements. The choice of a single bold weight with tight tracking is anti-convention; most SaaS sites pair weight 300 whispers with 700 shouts. Kaio commits fully to one volume.

### JetBrains Mono — Section eyebrows and technical labels (e.g. 'STRIPE VERIFIED PARTNER', 'ALL-IN-ONE MEMBERSHIP STACK') — the wide tracking (0.04-0.10em) turns mono into a humanist label voice, not code. · `--font-jetbrains-mono`
- **Substitute:** IBM Plex Mono, JetBrains Mono
- **Weights:** 400
- **Sizes:** 12px, 14px, 16px
- **Line height:** 1.20-1.50
- **Letter spacing:** 0.04em at 12-14px, 0.10em at 16px
- **OpenType features:** `"calt", "cv11", "ss02", "ss03"`
- **Role:** Section eyebrows and technical labels (e.g. 'STRIPE VERIFIED PARTNER', 'ALL-IN-ONE MEMBERSHIP STACK') — the wide tracking (0.04-0.10em) turns mono into a humanist label voice, not code.

### Permanent Marker — Handwritten annotations layered over the hero gradient ('SEE WHAT OUR CUSTOMERS ARE BUILDING', 'HOOK IN THE FIRST 90 MINUTES') — these are not body text, they are a personality layer; use sparingly to mark sections, not to carry meaning. · `--font-permanent-marker`
- **Substitute:** Permanent Marker (Google Fonts)
- **Weights:** 400
- **Sizes:** 16px, 20px
- **Line height:** 1.40-1.50
- **Letter spacing:** -0.0100em, -0.0080em
- **OpenType features:** `"calt", "cv11", "ss02"`
- **Role:** Handwritten annotations layered over the hero gradient ('SEE WHAT OUR CUSTOMERS ARE BUILDING', 'HOOK IN THE FIRST 90 MINUTES') — these are not body text, they are a personality layer; use sparingly to mark sections, not to carry meaning.

### Phosphor — Icon system — single weight, single color (Aubergine #240029), 1px-equivalent stroke, used inline with body copy and as standalone glyphs. · `--font-phosphor`
- **Substitute:** Phosphor Icons (Regular)
- **Weights:** 400
- **Sizes:** 24px
- **Line height:** 1.00
- **OpenType features:** `"liga"`
- **Role:** Icon system — single weight, single color (Aubergine #240029), 1px-equivalent stroke, used inline with body copy and as standalone glyphs.

### Font Awesome 6 Brands — Third-party brand glyphs (integration logos, social icons) — kept distinct from Phosphor so the system can mix its own line icons with customer brand marks without visual collision. · `--font-font-awesome-6-brands`
- **Weights:** 400
- **Sizes:** 16px, 20px
- **Line height:** 1.00
- **Letter spacing:** -0.0100em, -0.0090em, 0.0240em
- **OpenType features:** `"calt", "cv11", "ss02"`
- **Role:** Third-party brand glyphs (integration logos, social icons) — kept distinct from Phosphor so the system can mix its own line icons with customer brand marks without visual collision.

### Phosphor-Bold — Phosphor-Bold — detected in extracted data but not described by AI · `--font-phosphor-bold`
- **Weights:** 400
- **Sizes:** 12px, 14px, 16px, 20px, 32px
- **Line height:** 1
- **OpenType features:** `"liga"`
- **Role:** Phosphor-Bold — detected in extracted data but not described by AI

### Phosphor-Fill — Phosphor-Fill — detected in extracted data but not described by AI · `--font-phosphor-fill`
- **Weights:** 400
- **Sizes:** 12px, 20px, 32px
- **Line height:** 1
- **OpenType features:** `"liga"`
- **Role:** Phosphor-Fill — detected in extracted data but not described by AI

### -apple-system — -apple-system — detected in extracted data but not described by AI · `--font-apple-system`
- **Weights:** 400
- **Sizes:** 14px
- **Line height:** 1.43
- **OpenType features:** `"calt", "cv11", "ss02"`
- **Role:** -apple-system — detected in extracted data but not described by AI

### Family — Family — detected in extracted data but not described by AI · `--font-family`
- **Weights:** 400, 500, 700
- **Sizes:** 26px
- **Line height:** 1.5
- **Letter spacing:** -0.001
- **OpenType features:** `"calt", "cv11", "ss02"`
- **Role:** Family — detected in extracted data but not described by AI

### Fraunces — Fraunces — detected in extracted data but not described by AI · `--font-fraunces`
- **Weights:** 700
- **Sizes:** 36px
- **Line height:** 1.2
- **Letter spacing:** -0.004
- **OpenType features:** `"calt", "cv11", "ss02"`
- **Role:** Fraunces — detected in extracted data but not described by AI

### Chakra Petch — Chakra Petch — detected in extracted data but not described by AI · `--font-chakra-petch`
- **Weights:** 700
- **Sizes:** 36px
- **Line height:** 1.2
- **Letter spacing:** -0.004
- **OpenType features:** `"calt", "cv11", "ss02"`
- **Role:** Chakra Petch — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| micro | 10px | 1.4 | -0.2px | `--text-micro` |
| caption | 12px | 1.5 | -0.16px | `--text-caption` |
| body-sm | 14px | 1.5 | -0.14px | `--text-body-sm` |
| body | 16px | 1.5 | -0.16px | `--text-body` |
| subheading | 20px | 1.4 | -0.16px | `--text-subheading` |
| heading-sm | 24px | 1.2 | -0.1px | `--text-heading-sm` |
| heading | 36px | 1.2 | -0.14px | `--text-heading` |
| heading-lg | 56px | 1.1 | -1.12px | `--text-heading-lg` |
| display | 80px | 1 | -1.6px | `--text-display` |

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
| 24 | 24px | `--spacing-24` |
| 32 | 32px | `--spacing-32` |
| 48 | 48px | `--spacing-48` |
| 96 | 96px | `--spacing-96` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 14px |
| pills | 999px |
| badges | 999px |
| images | 6px |
| inputs | 3px |
| buttons | 6px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| subtle | `rgba(41, 0, 41, 0.11) 0px 0px 0px 1px, rgba(32, 0, 36, 0....` | `--shadow-subtle` |
| subtle-2 | `rgba(255, 255, 255, 0.2) 0px 0px 0px 1px inset, rgba(0, 0...` | `--shadow-subtle-2` |
| subtle-3 | `rgba(255, 255, 255, 0.05) 0px 0px 0px 1px` | `--shadow-subtle-3` |
| subtle-4 | `rgba(41, 0, 41, 0.2) 0px 0px 0px 1px inset` | `--shadow-subtle-4` |
| subtle-5 | `rgba(32, 0, 36, 0.11) 0px 0px 0px 1px, rgba(32, 0, 36, 0....` | `--shadow-subtle-5` |
| subtle-6 | `rgba(32, 0, 36, 0.01) 0px 1px 1.5px 0px, rgba(32, 0, 36, ...` | `--shadow-subtle-6` |
| subtle-7 | `rgba(32, 0, 36, 0.11) 0px 0px 0px 1px, rgba(32, 0, 36, 0....` | `--shadow-subtle-7` |
| subtle-8 | `rgba(32, 0, 36, 0.11) 0px 0px 0px 1px` | `--shadow-subtle-8` |
| subtle-9 | `rgba(41, 0, 41, 0.11) 0px 0px 0px 1px` | `--shadow-subtle-9` |
| subtle-10 | `rgba(255, 255, 255, 0.11) 0px 0px 0px 1px` | `--shadow-subtle-10` |
| subtle-11 | `rgba(0, 0, 0, 0.05) 0px 1px 2px 0px` | `--shadow-subtle-11` |
| subtle-12 | `rgba(32, 0, 36, 0.05) 0px 1px 2px 0px, rgba(255, 255, 255...` | `--shadow-subtle-12` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 24px
- **Element gap:** 16px

## Components

### Primary Filled Button
**Role:** The sole conversion button — Sign up, Start free trial, Get started

Fill #df37a7 (Fuchsia Signal), text #ffffff, radius 6px, padding 12px 24px, Inter Var 16px weight 600. Box-shadow: inset 0 0 0 1px rgba(255,255,255,0.2), 0 1px 2px rgba(0,0,0,0.05). No hover outline — the color shift is the entire affordance.

### Ghost Outlined Button
**Role:** Secondary action paired next to the primary CTA — Is Outseta for me?, Learn more

Background transparent, border 1px solid #6d526d (Heather), text #240029, radius 6px, padding 12px 24px, Inter Var 16px weight 500. The muted purple border signals 'second-class' without ever going gray.

### Pill Tag / Category
**Role:** Use-case chips and category labels (NETS, CLUBS, ASSOCIATIONS, COURSES, COMMUNITIES)

Background #ffffff, border 1px solid #6d526d, text #240029, radius 999px (full pill), padding 6px 12px, Inter Var 12px weight 500. The pill radius and thin Heather border read as low-emphasis filters, not buttons.

### Success Badge
**Role:** Inline status confirmation — active, verified, connected

Background #dcfce7 (Honeydew), border 1px solid #bbf7d0 (Mint), text #15803d (Forest), radius 999px, padding 4px 12px, Inter Var 12px weight 500. The three-stop green system (border, fill, text) is the only place green appears — it never leaks into icons or illustrations.

### Testimonial Card
**Role:** Three-up grid of customer quotes below the hero

Background #ffffff, radius 14px, padding 32px, shadow: 0 0 0 1px rgba(41,0,41,0.11), 0 2px 2px rgba(32,0,36,0.05). Contains a 40px circular avatar (Aubergine fill, white initial), a name in Inter Var 16px weight 600 #240029, a role in Inter Var 14px weight 400 #6d526d, and a quote in Inter Var 14px line-height 1.5.

### Showcase / Logo Card
**Role:** Featured customer or product mockup in the hero card row

Background #ffffff, radius 14px, padding 0 (image bleeds to edges), 6px internal image radius via overflow:hidden. Image fills card with no padding. Used in a 3-column grid below the headline with 16px gaps.

### Numbered Step
**Role:** Three-step process explainer (Create plan, Add script, Copy links)

A 24px Aubergine circle with a white 12px weight 600 number inside, followed by Inter Var 16px weight 500 text in #240029. No background card — the circle floats inline with the step text, separated by 12px gap.

### Hero Section
**Role:** The page-opening block — gradient sky, giant headline, dual CTA, showcase cards

Full-bleed background: linear-gradient(145deg, #ffbdd3, #fff1bd 40%, #fff1bd 60%, #ffcb0f). Centered max-width 800px stack: JetBrains Mono 12px eyebrow at 0.10em tracking, Kaio 80px weight 700 headline in #240029, Inter Var 20px subhead, dual CTA row, then a 3-column showcase card row offset upward into the gradient with 16px gaps.

### Dark CTA Section
**Role:** Final conversion band — Get started with Outseta today

Full-bleed background #240029 (Aubergine), padding 80px vertical, white text. Kaio 56px weight 700 headline in #ffffff, Inter Var 16px body in #d4ccd4 (Plum Tinted), Primary Filled Button right-aligned. A product screenshot card breaks the right edge with 14px radius and the standard purple-tinted shadow.

### Navigation Bar
**Role:** Top-of-page header — logo, nav, auth

White background, 1px bottom border #d4ccd4, max-width 1200px centered, 16px vertical padding. Logo (concentric-circle mark + Kaio 20px 'Outseta' wordmark) on the left, Inter Var 14px weight 500 nav links with chevron dropdowns, a GitHub icon, Log in ghost link, and Primary Filled Button on the right. A small 'Migrating from Memberspace?' link with arrow sits as a sub-bar at the right.

### Eyebrow Label
**Role:** Section intro text above every major headline — 'ALL-IN-ONE MEMBERSHIP STACK', 'STRIPE VERIFIED PARTNER'

JetBrains Mono 12px weight 400, letter-spacing 0.10em, text #240029, centered, margin-bottom 16px. Optional small 16px Phosphor icon (filled or outlined) to the left with 8px gap. The mono font at extreme tracking is the system's way of saying 'pause, new section'.

### Hand-Drawn Annotation
**Role:** Personality layer on the hero — arrows and notes pointing to the showcase cards

Permanent Marker 16-20px weight 400, text #df37a7 (Fuchsia Signal) or #240029 (Aubergine), slight 2-4px rotation for a casual feel, no fixed positioning. Used 2-3 times per page only, always over the hero gradient, always pointing at a specific element via a hand-drawn SVG arrow.

### Input Field
**Role:** Email capture, form fields, search

Background #ffffff, border 1px solid #767676 (Frost), radius 3px, padding 12px 16px, Inter Var 16px weight 400 text #240029, placeholder #6d526d. The 3px radius is intentionally sharper than cards/buttons (6-14px), marking inputs as a different material class.

### Integration Icon Tile
**Role:** Third-party tool logos in the integrations row

40px square grayscale icon (#222222 or #240029 single-color treatment), no background, 24px gap between tiles, centered in a single row beneath a 'View all' link. The customer-branded marks use Font Awesome 6 Brands; Outseta's own icons use Phosphor.

## Do's and Don'ts

### Do
- Use Kaio 700 for every display headline at 56-80px — it is the single loud voice; never pair it with a second bold font in the same view.
- Reserve #df37a7 (Fuchsia Signal) for one element per viewport — the primary CTA — and let it be the only hot pink on the page.
- Tint every shadow with the brand purple rgba(32-41,0,36,x); never use neutral black shadows for cards, buttons, or modals.
- Use JetBrains Mono at 0.10em tracking for section eyebrows above every H1/H2 — this is the system's section-break signal.
- Apply the 145deg sunset gradient (pink → cream → yellow) to full-bleed hero bands only; never use it for cards, buttons, or small surfaces.
- Default to 14px radius for cards and 6px for buttons; the 14/6/3 (cards/buttons/inputs) hierarchy is what makes the surfaces feel like distinct material classes.
- Place 1-3 Permanent Marker annotations on the hero only, each pointing at a specific element with a hand-drawn SVG arrow — they are marketing chrome, not navigation.

### Don't
- Do not use #df37a7 for anything other than the primary CTA fill — not for links, not for borders, not for text accents.
- Do not pair Kaio with a second display serif or sans in the same screen — Fraunces and Chakra Petch appearing in the data are isolated decorative moments, not system fonts.
- Do not introduce a fourth border radius — the 999px/14px/6px/3px scale is complete; adding 8px or 10px fragments the material hierarchy.
- Do not place Permanent Marker annotations outside the hero gradient band — they lose contrast and read as broken text on white.
- Do not use neutral black (#000000) for shadows, text, or borders — Aubergine #240029 is the structural ink; black breaks the chromatic consistency.
- Do not stack more than two text colors in one component — the system uses only #240029 (primary) and #6d526d (secondary) for text, plus #d4ccd4 for muted helpers.
- Do not apply the hero gradient to buttons, badges, or icons — it is a page-level atmospheric treatment, not a component fill.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas | `#ffffff` | Page background, default card surface, nav background |
| 1 | Warm Wash | `#fff1bd` | Mid-stop of the hero gradient, used as a full-bleed band behind the headline and showcase cards |
| 2 | Dark Plum | `#240029` | Full-bleed dark CTA section near page bottom — white text on Aubergine for the final conversion moment |
| 3 | Success Wash | `#dcfce7` | Soft mint background for success badges and positive status pills |

## Elevation

- **Card:** `0px 0px 0px 1px rgba(41,0,41,0.11), 0px 2px 2px 0px rgba(32,0,36,0.05)`
- **Elevated Card:** `0px 0px 0px 1px rgba(32,0,36,0.11), 0px 1px 1.5px rgba(32,0,36,0.01), 0px 2px 3px rgba(32,0,36,0.02), 0px 4px 6px rgba(32,0,36,0.03), 0px 8px 12px rgba(32,0,36,0.04), 0px 16px 24px rgba(32,0,36,0.05)`
- **Button:** `inset 0px 0px 0px 1px rgba(255,255,255,0.2), 0px 1px 2px 0px rgba(0,0,0,0.05)`
- **Input:** `inset 0px 0px 0px 1px rgba(255,255,255,0.2), 0px 1px 2px 0px rgba(0,0,0,0.05)`
- **Image:** `0px 1px 1.5px rgba(32,0,36,0.01), 0px 2px 3px rgba(32,0,36,0.02), 0px 4px 6px rgba(32,0,36,0.03), 0px 8px 12px rgba(32,0,36,0.04), 0px 16px 24px rgba(32,0,36,0.05)`

## Imagery

The site is UI-dominant, not image-heavy — no photography, no lifestyle shots, no product hero renders. The visual interest comes from the gradient hero band and a row of three screenshot/showcase cards that act as proof points rather than decorative imagery. The screenshot cards contain real product UI (dashboard, course page, landing builder) shown in the brand's own style. A small set of Phosphor line icons (1px stroke, Aubergine) handle all iconography. The Permanent Marker annotations are the only 'handmade' element and are deliberately rough — they break the polished UI to signal 'built by humans, not a corporation'. No 3D, no illustration, no abstract graphics.

## Layout

Full-bleed page with max-width 1200px content centered. The hero is a full-width gradient band with a centered narrow-column stack (max 800px) for the headline and dual CTA, then a 3-column card row that extends wider. Sections flow seamlessly — no dividers, no alternating dark/light bands except one full-bleed dark Aubergine CTA section near the footer. Content rhythm: centered headline stack → 3-column card row → centered quote wall (3-up testimonial grid) → centered integration row with chevron link → centered 3-step process explainer → full-bleed dark CTA. Navigation is a sticky top bar with no mega-menu — flat nav with chevron dropdowns, logo left, auth right. The overall density is comfortable, not compact — 80px section gaps, 24-32px card padding, 16px element gaps.

## Agent Prompt Guide

**Quick Color Reference**
- text: #240029 (Aubergine)
- background: #ffffff (Canvas)
- border: #d4ccd4 (Plum Tinted) for hairlines, #6d526d (Heather) for interactive
- accent: #ffcc11 (Glowstick) for hero gradient terminal only
- primary action: #df37a7 (filled action)
- success: #15803d text, #dcfce7 background, #bbf7d0 border

**Example Component Prompts**
1. Create a Primary Action Button: #df37a7 background, #ffffff text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.

2. Create a testimonial card: white background, 14px radius, 32px padding, shadow 0 0 0 1px rgba(41,0,41,0.11) + 0 2px 2px rgba(32,0,36,0.05). Contains a 40px Aubergine circle avatar with white initial, name in Inter Var 16px weight 600 #240029, role in Inter Var 14px weight 400 #6d526d, quote body in Inter Var 14px line-height 1.5 #240029.

3. Create a success badge: background #dcfce7, border 1px solid #bbf7d0, text #15803d, radius 999px, padding 4px 12px, Inter Var 12px weight 500. Use only for active/verified/connected status.

4. Create a dark CTA section: full-bleed background #240029, padding 80px vertical, max-width 1200px centered. Kaio 56px weight 700 headline in #ffffff, Inter Var 16px body in #d4ccd4, Primary Filled Button (#df37a7/#ffffff) right-aligned, product screenshot card with 14px radius on the right edge.

5. Create a section eyebrow + heading pair: JetBrains Mono 12px weight 400 at letter-spacing 0.10em in #240029, margin-bottom 16px. Below it, Kaio 56px weight 700 in #240029 at letter-spacing -1.12px. Use this stack above every major section.

## Similar Brands

- **Stripe** — Same warm gradient hero treatment (Stripe uses orange-to-pink sky bands), same purple-leaning dark CTA section, and the same confidence to let one bold display headline own the viewport
- **Linear** — Same single-bold-weight display commitment (Linear uses Inter Display exclusively; Outseta uses Kaio at 700 only), same pill-shaped secondary actions, same hairline-border-everywhere approach
- **ConvertKit** — Same creator-economy warmth with a vivid single accent color, same Permanent Marker-style hand-drawn annotations over the hero, same approachable-but-considered tone
- **Notion** — Same mono-font eyebrow labels above every section, same restrained color palette where one accent does all the work, same comfortable-not-compact spacing rhythm

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-aubergine: #240029;
  --color-fuchsia-signal: #df37a7;
  --color-heather: #6d526d;
  --color-glowstick: #ffcc11;
  --color-plum-tinted: #d4ccd4;
  --color-ink: #222222;
  --color-smoke: #bbadbb;
  --color-charcoal: #333333;
  --color-frost: #767676;
  --color-forest: #15803d;
  --color-mint: #bbf7d0;
  --color-honeydew: #dcfce7;
  --color-strawberry: #ef4444;
  --color-mango: #22c55e;
  --color-canvas: #ffffff;
  --color-hero-glow: #ffbdd3;
  --gradient-hero-glow: linear-gradient(145deg, #ffbdd3, #fff1bd 40%, #fff1bd 60%, #ffcb0f);

  /* Typography — Font Families */
  --font-inter-var: 'Inter Var', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-kaio: 'Kaio', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-jetbrains-mono: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-permanent-marker: 'Permanent Marker', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-phosphor: 'Phosphor', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-font-awesome-6-brands: 'Font Awesome 6 Brands', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-phosphor-bold: 'Phosphor-Bold', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-phosphor-fill: 'Phosphor-Fill', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-apple-system: '-apple-system', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-family: 'Family', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-fraunces: 'Fraunces', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-chakra-petch: 'Chakra Petch', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-micro: 10px;
  --leading-micro: 1.4;
  --tracking-micro: -0.2px;
  --text-caption: 12px;
  --leading-caption: 1.5;
  --tracking-caption: -0.16px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.5;
  --tracking-body-sm: -0.14px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.16px;
  --text-subheading: 20px;
  --leading-subheading: 1.4;
  --tracking-subheading: -0.16px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: -0.1px;
  --text-heading: 36px;
  --leading-heading: 1.2;
  --tracking-heading: -0.14px;
  --text-heading-lg: 56px;
  --leading-heading-lg: 1.1;
  --tracking-heading-lg: -1.12px;
  --text-display: 80px;
  --leading-display: 1;
  --tracking-display: -1.6px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-48: 48px;
  --spacing-96: 96px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 24px;
  --element-gap: 16px;

  /* Border Radius */
  --radius-sm: 3px;
  --radius-md: 6px;
  --radius-lg: 10px;
  --radius-xl: 14px;
  --radius-2xl: 18px;
  --radius-2xl-2: 22px;
  --radius-3xl: 32px;
  --radius-3xl-2: 46px;
  --radius-full: 64px;
  --radius-full-2: 999px;

  /* Named Radii */
  --radius-cards: 14px;
  --radius-pills: 999px;
  --radius-badges: 999px;
  --radius-images: 6px;
  --radius-inputs: 3px;
  --radius-buttons: 6px;

  /* Shadows */
  --shadow-subtle: rgba(41, 0, 41, 0.11) 0px 0px 0px 1px, rgba(32, 0, 36, 0.05) 0px 2px 2px 0px;
  --shadow-subtle-2: rgba(255, 255, 255, 0.2) 0px 0px 0px 1px inset, rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;
  --shadow-subtle-3: rgba(255, 255, 255, 0.05) 0px 0px 0px 1px;
  --shadow-subtle-4: rgba(41, 0, 41, 0.2) 0px 0px 0px 1px inset;
  --shadow-subtle-5: rgba(32, 0, 36, 0.11) 0px 0px 0px 1px, rgba(32, 0, 36, 0.01) 0px 1px 1.5px 0px, rgba(32, 0, 36, 0.02) 0px 2px 3px 0px, rgba(32, 0, 36, 0.03) 0px 4px 6px 0px, rgba(32, 0, 36, 0.04) 0px 8px 12px 0px, rgba(32, 0, 36, 0.05) 0px 16px 24px 0px, rgba(32, 0, 36, 0.06) 0px 24px 36px 0px, rgba(32, 0, 36, 0.07) 0px 36px 54px 0px, rgba(32, 0, 36, 0.08) 0px 54px 81px 0px;
  --shadow-subtle-6: rgba(32, 0, 36, 0.01) 0px 1px 1.5px 0px, rgba(32, 0, 36, 0.02) 0px 2px 3px 0px, rgba(32, 0, 36, 0.03) 0px 4px 6px 0px, rgba(32, 0, 36, 0.04) 0px 8px 12px 0px, rgba(32, 0, 36, 0.05) 0px 16px 24px 0px;
  --shadow-subtle-7: rgba(32, 0, 36, 0.11) 0px 0px 0px 1px, rgba(32, 0, 36, 0.05) 0px 2px 2px 0px;
  --shadow-subtle-8: rgba(32, 0, 36, 0.11) 0px 0px 0px 1px;
  --shadow-subtle-9: rgba(41, 0, 41, 0.11) 0px 0px 0px 1px;
  --shadow-subtle-10: rgba(255, 255, 255, 0.11) 0px 0px 0px 1px;
  --shadow-subtle-11: rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;
  --shadow-subtle-12: rgba(32, 0, 36, 0.05) 0px 1px 2px 0px, rgba(255, 255, 255, 0.4) 0px 10px 24px -10px inset;

  /* Surfaces */
  --surface-canvas: #ffffff;
  --surface-warm-wash: #fff1bd;
  --surface-dark-plum: #240029;
  --surface-success-wash: #dcfce7;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-aubergine: #240029;
  --color-fuchsia-signal: #df37a7;
  --color-heather: #6d526d;
  --color-glowstick: #ffcc11;
  --color-plum-tinted: #d4ccd4;
  --color-ink: #222222;
  --color-smoke: #bbadbb;
  --color-charcoal: #333333;
  --color-frost: #767676;
  --color-forest: #15803d;
  --color-mint: #bbf7d0;
  --color-honeydew: #dcfce7;
  --color-strawberry: #ef4444;
  --color-mango: #22c55e;
  --color-canvas: #ffffff;
  --color-hero-glow: #ffbdd3;

  /* Typography */
  --font-inter-var: 'Inter Var', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-kaio: 'Kaio', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-jetbrains-mono: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-permanent-marker: 'Permanent Marker', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-phosphor: 'Phosphor', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-font-awesome-6-brands: 'Font Awesome 6 Brands', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-phosphor-bold: 'Phosphor-Bold', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-phosphor-fill: 'Phosphor-Fill', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-apple-system: '-apple-system', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-family: 'Family', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-fraunces: 'Fraunces', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-chakra-petch: 'Chakra Petch', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-micro: 10px;
  --leading-micro: 1.4;
  --tracking-micro: -0.2px;
  --text-caption: 12px;
  --leading-caption: 1.5;
  --tracking-caption: -0.16px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.5;
  --tracking-body-sm: -0.14px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.16px;
  --text-subheading: 20px;
  --leading-subheading: 1.4;
  --tracking-subheading: -0.16px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: -0.1px;
  --text-heading: 36px;
  --leading-heading: 1.2;
  --tracking-heading: -0.14px;
  --text-heading-lg: 56px;
  --leading-heading-lg: 1.1;
  --tracking-heading-lg: -1.12px;
  --text-display: 80px;
  --leading-display: 1;
  --tracking-display: -1.6px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-48: 48px;
  --spacing-96: 96px;

  /* Border Radius */
  --radius-sm: 3px;
  --radius-md: 6px;
  --radius-lg: 10px;
  --radius-xl: 14px;
  --radius-2xl: 18px;
  --radius-2xl-2: 22px;
  --radius-3xl: 32px;
  --radius-3xl-2: 46px;
  --radius-full: 64px;
  --radius-full-2: 999px;

  /* Shadows */
  --shadow-subtle: rgba(41, 0, 41, 0.11) 0px 0px 0px 1px, rgba(32, 0, 36, 0.05) 0px 2px 2px 0px;
  --shadow-subtle-2: rgba(255, 255, 255, 0.2) 0px 0px 0px 1px inset, rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;
  --shadow-subtle-3: rgba(255, 255, 255, 0.05) 0px 0px 0px 1px;
  --shadow-subtle-4: rgba(41, 0, 41, 0.2) 0px 0px 0px 1px inset;
  --shadow-subtle-5: rgba(32, 0, 36, 0.11) 0px 0px 0px 1px, rgba(32, 0, 36, 0.01) 0px 1px 1.5px 0px, rgba(32, 0, 36, 0.02) 0px 2px 3px 0px, rgba(32, 0, 36, 0.03) 0px 4px 6px 0px, rgba(32, 0, 36, 0.04) 0px 8px 12px 0px, rgba(32, 0, 36, 0.05) 0px 16px 24px 0px, rgba(32, 0, 36, 0.06) 0px 24px 36px 0px, rgba(32, 0, 36, 0.07) 0px 36px 54px 0px, rgba(32, 0, 36, 0.08) 0px 54px 81px 0px;
  --shadow-subtle-6: rgba(32, 0, 36, 0.01) 0px 1px 1.5px 0px, rgba(32, 0, 36, 0.02) 0px 2px 3px 0px, rgba(32, 0, 36, 0.03) 0px 4px 6px 0px, rgba(32, 0, 36, 0.04) 0px 8px 12px 0px, rgba(32, 0, 36, 0.05) 0px 16px 24px 0px;
  --shadow-subtle-7: rgba(32, 0, 36, 0.11) 0px 0px 0px 1px, rgba(32, 0, 36, 0.05) 0px 2px 2px 0px;
  --shadow-subtle-8: rgba(32, 0, 36, 0.11) 0px 0px 0px 1px;
  --shadow-subtle-9: rgba(41, 0, 41, 0.11) 0px 0px 0px 1px;
  --shadow-subtle-10: rgba(255, 255, 255, 0.11) 0px 0px 0px 1px;
  --shadow-subtle-11: rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;
  --shadow-subtle-12: rgba(32, 0, 36, 0.05) 0px 1px 2px 0px, rgba(255, 255, 255, 0.4) 0px 10px 24px -10px inset;
}
```
