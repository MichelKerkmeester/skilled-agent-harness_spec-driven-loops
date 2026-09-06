# Buddy — Style Reference
> Engineering blueprint on graph paper. A white drafting surface scored with a faint grid, inked in near-black, punctuated by fluorescent chartreuse annotations and iridescent gradient strokes.

**Theme:** mixed

Buddy Works renders as a clean engineering workspace drawn on graph paper — a near-white canvas overlaid with a subtle blueprint grid, deeply saturated near-black ink for type, and one unmistakable lime-green CTA that snaps every action into focus. Color is rationed: 95% of the interface stays achromatic with a navy-ink text system, while vivid chromatic energy is reserved for a lime button, cobalt link accent, and the rainbow radial-gradient swooshes that underline headlines and trace the edges of feature cards. Surfaces are whisper-soft — white cards, hairline slate borders, layered translucent shadows tinted with brand hues — and the only heavy shadows are cast by product screenshots and elevated testimonial cards. Typography is IBM Plex Sans at comfortable sizes with aggressive negative tracking on the display sizes, giving headlines a tightened, engineering-specimen feel rather than a marketing-brochure feel. Component geometry is built on two pillars: 56px-radius pill buttons and 24px-radius cards, with a few 14px-radius inner cards for tighter clusters. The result is a system that reads as drafted, measured, and instrumented — a tool surface, not a landing page.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Lime Spark | `#bfff5a` | `--color-lime-spark` | Primary action fill — CTA buttons, active tab pill, high-visibility highlights. Chartreuse against near-white creates immediate focus without the aggression of red or blue |
| Cobalt Signal | `#1a67fd` | `--color-cobalt-signal` | Link color, brand logo mark, nav active indicator. The only saturated blue in the system; used sparingly to mark interactivity in text and icon contexts |
| Forest Depth | `#0b3d28` | `--color-forest-depth` | Subdued heading and accent text on tinted surfaces — a darkened shade of the lime family used when the lime itself would be too loud |
| Paper White | `#fcfcfd` | `--color-paper-white` | Page canvas, card surface base, input background, button text on lime. The system neutral; everything else floats on this |
| Midnight Ink | `#1d2130` | `--color-midnight-ink` | Primary text and nav text, dominant border tone, icon strokes. A warm-tinted near-black that reads softer than pure #000 at body sizes |
| Carbon | `#151720` | `--color-carbon` | Body text color, dense list text. Slightly darker than Midnight Ink; the workhorse reading color |
| Obsidian | `#0a0d16` | `--color-obsidian` | Headline text and high-contrast fills. Reserved for display type and dark-section backgrounds where maximum ink weight is required |
| Mist Gray | `#ebeef7` | `--color-mist-gray` | Light dividers, list separators, subtle fill washes. The hairline-border neutral — appears on almost every section boundary |
| Slate Edge | `#d5d9e8` | `--color-slate-edge` | Card borders, shadow contributor, icon strokes on white. Sits one step darker than Mist Gray to give cards a defined perimeter without weight |
| Silver Wash | `#d6d6d7` | `--color-silver-wash` | Subtle fill on dark-mode elements and muted card backgrounds. Cool-tinted neutral for non-white surface variations |
| Pewter | `#6b6d72` | `--color-pewter` | Subdued helper text, secondary labels, muted borders on darker sections |
| Graphite | `#474950` | `--color-graphite` | Secondary body text where Midnight Ink would be too heavy; caption-tier reading text |
| Cyan Beam | `radial-gradient(100% 100% at 50% 0px, rgb(122, 227, 255) 0%, rgb(70, 216, 255) 100%)` | `--color-cyan-beam` | Decorative gradient accent on feature cards and colored card glow shadows. Part of the multicolor stroke palette that traces the curved card top edges |
| Mint Pulse | `radial-gradient(100% 100% at 50% 0px, rgb(93, 247, 182) 0%, rgb(25, 247, 154) 100%)` | `--color-mint-pulse` | Decorative gradient accent on feature cards and the card-glow color variant that pairs with green-themed cards |
| Citron Wave | `radial-gradient(100% 100% at 50% 0px, rgb(236, 241, 116) 0%, rgb(229, 237, 56) 100%)` | `--color-citron-wave` | Decorative gradient accent on feature cards — the yellow-green stroke that runs across pipeline and environment cards |
| Orchid Glaze | `radial-gradient(100% 100% at 50% 0px, rgb(255, 181, 241) 0%, rgb(255, 157, 236) 100%)` | `--color-orchid-glaze` | Decorative gradient accent on feature cards — the pink-magenta stroke on visual-review cards |
| Amber Glow | `radial-gradient(100% 100% at 50% 0px, rgb(255, 216, 136) 0%, rgb(255, 198, 80) 100%)` | `--color-amber-glow` | Decorative gradient fill for testimonial cards and warm accent stroke on tunnel/domain cards |
| Mint Tint | `#d8fbed` | `--color-mint-tint` | Soft surface highlight wash — pale mint-tinted fills for highlighted zones and subtle background washes near lime accents |

## Tokens — Typography

### IBM Plex Sans — The single workhorse family. 400 for body and reading text, 500 for navigation and medium-emphasis labels, 600 for buttons and subheadings, 700 for the large display headline. The geometric humanist construction gives engineering copy a slightly industrial feel; the aggressive negative tracking on 48px and 80px sizes tightens headline metrics into dense, blocky statements that read as data, not as poetry. · `--font-ibm-plex-sans`
- **Substitute:** Inter, Source Sans 3, Manrope
- **Weights:** 400, 500, 600, 700
- **Sizes:** 13px, 14px, 16px, 17px, 18px, 22px, 48px, 80px
- **Line height:** 0.90, 1.00, 1.33, 1.43, 1.45, 1.50, 1.56, 1.71, 1.85, 1.88, 2.29
- **Letter spacing:** -0.0450em, -0.0210em, -0.0120em
- **OpenType features:** `"liga" 0`
- **Role:** The single workhorse family. 400 for body and reading text, 500 for navigation and medium-emphasis labels, 600 for buttons and subheadings, 700 for the large display headline. The geometric humanist construction gives engineering copy a slightly industrial feel; the aggressive negative tracking on 48px and 80px sizes tightens headline metrics into dense, blocky statements that read as data, not as poetry.

### IBM Plex Mono — Eyebrow labels and section-overline text (e.g. 'TRUSTED BY THE WORLD'S LEADING ENGINEERING TEAMS'). Wide tracking transforms short technical labels into stamp-like marks above headlines. Always uppercase, always 500 weight. · `--font-ibm-plex-mono`
- **Substitute:** JetBrains Mono, IBM Plex Mono (Google Fonts)
- **Weights:** 500
- **Sizes:** 12px
- **Line height:** 2.00
- **Letter spacing:** 2px (0.167em at 12px)
- **OpenType features:** `"liga" 0`
- **Role:** Eyebrow labels and section-overline text (e.g. 'TRUSTED BY THE WORLD'S LEADING ENGINEERING TEAMS'). Wide tracking transforms short technical labels into stamp-like marks above headlines. Always uppercase, always 500 weight.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 2 | 2px | `--text-caption` |
| subheading | 18px | 1.45 | — | `--text-subheading` |
| heading-sm | 22px | 1.43 | -0.26px | `--text-heading-sm` |
| heading | 48px | 1 | -1px | `--text-heading` |
| display | 80px | 0.9 | -3.6px | `--text-display` |

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
| 72 | 72px | `--spacing-72` |
| 96 | 96px | `--spacing-96` |
| 120 | 120px | `--spacing-120` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 24px |
| pills | 9999px |
| images | 8px |
| buttons | 56px |
| navLinks | 44px |
| smallCards | 14px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| subtle | `rgba(29, 33, 48, 0.04) 0px 3px 3px -1px, rgba(29, 33, 48,...` | `--shadow-subtle` |
| subtle-2 | `rgba(255, 255, 255, 0.72) 0px 1px 0px 0px inset, rgba(29,...` | `--shadow-subtle-2` |
| subtle-3 | `rgba(255, 255, 255, 0.72) 0px 0px 0px 1px inset, rgb(213,...` | `--shadow-subtle-3` |
| subtle-4 | `rgba(29, 33, 48, 0.08) 0px 0px 0px 1px, rgba(29, 33, 48, ...` | `--shadow-subtle-4` |
| subtle-5 | `rgba(29, 33, 48, 0.08) 0px 0px 0px 1px, rgba(29, 33, 48, ...` | `--shadow-subtle-5` |
| subtle-6 | `rgba(29, 33, 48, 0.08) 0px 0px 0px 1px, rgba(29, 33, 48, ...` | `--shadow-subtle-6` |
| subtle-7 | `rgba(29, 33, 48, 0.08) 0px 0px 0px 1px, rgba(29, 33, 48, ...` | `--shadow-subtle-7` |
| subtle-8 | `rgba(29, 33, 48, 0.08) 0px 0px 0px 1px, rgba(29, 33, 48, ...` | `--shadow-subtle-8` |
| subtle-9 | `rgba(29, 33, 48, 0.08) 0px 0px 0px 1px, rgba(29, 33, 48, ...` | `--shadow-subtle-9` |
| subtle-10 | `rgba(29, 33, 48, 0.08) 0px 0px 0px 1px, rgba(29, 33, 48, ...` | `--shadow-subtle-10` |
| subtle-11 | `rgba(17, 17, 17, 0.16) 0px 0px 0px 1px inset, rgba(29, 33...` | `--shadow-subtle-11` |
| subtle-12 | `rgba(17, 17, 17, 0.16) 0px 0px 0px 1px inset, rgba(29, 33...` | `--shadow-subtle-12` |
| subtle-13 | `rgba(17, 17, 17, 0.16) 0px 0px 0px 1px inset, rgba(29, 33...` | `--shadow-subtle-13` |
| subtle-14 | `rgba(17, 17, 17, 0.16) 0px 0px 0px 1px inset, rgba(29, 33...` | `--shadow-subtle-14` |
| subtle-15 | `rgba(17, 17, 17, 0.16) 0px 0px 0px 1px inset, rgba(29, 33...` | `--shadow-subtle-15` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 24px
- **Element gap:** 16px

## Components

### Lime CTA Button
**Role:** Primary call-to-action — appears in the nav ('Get Started on Cloud') and at section ends.

Fill #bfff5a, text #0a0d16 (Obsidian). Border-radius 56px — a fat pill. Padding 16px 32px. IBM Plex Sans 16px/500. Inset highlight shadow rgba(255,255,255,0.72) on the top edge plus a 2px inset bottom shadow in rgba(29,33,48,0.12) gives the pill a subtle glass-bead dimension without being skeuomorphic. Optional lime glow on hover via 8% #bfff5a layered shadow.

### Outlined Action Button
**Role:** Secondary action alongside the primary CTA, used on dark sections.

Transparent fill, 1px border in #fcfcfd or current text color, border-radius 56px. Padding 16px 32px. Text in the same color as the border, 16px/500. Inverts cleanly on the dark testimonial band.

### Ghost Nav Link
**Role:** Top-level navigation items (Changelog, Docs, Pricing, Contact).

No background, text in #1d2130, 16px/500. Active state uses #1a67fd. Wrapped in a 44px-radius container when a pill-style nav appears in feature tab strips.

### Pill Tab Strip
**Role:** In-page section navigation — the floating 'Remote Deployments | Pipelines | Environments…' bar.

White capsule container with 9999px radius, 1px border in #ebeef7, layered shadow rgba(29,33,48,0.08) 0 0 0 1px. Individual tabs are 44px-radius pills. Active tab fills with #151720 (Carbon) and text flips to #fcfcfd. Inactive tabs stay transparent with #1d2130 text.

### Feature Card (Fanned)
**Role:** The six product feature cards in the hero — Remote Deployments, Pipelines, Environments, Visual Reviews, Tunnels, Domains, Dev Cloud.

White #fcfcfd fill, 24px radius, 8px border-radius on inner icon tiles. A curved gradient stroke traces the top arc of each card in a distinct hue (cyan, lime, pink, mint, amber, orange). Soft layered shadow with a hue-matched glow at 8% opacity at the 10px and 24px offset stops. Icon at top, label below in 16px/500 #1d2130.

### Product Screenshot Card
**Role:** Large UI captures in the Remote Deployments section.

Full product UI screenshot with no border. 8px radius. The complex layered shadow (rgba(29,33,48,0.04) at five increasing blur radii from 3px to 32px) lifts the image off the grid-paper canvas. Three cards overlap diagonally with rotation to create the splayed composition.

### Testimonial Card
**Role:** Customer quote floating on the dark testimonials band.

Fill is a warm radial gradient from #ffd888 to #ffc650, 24px radius. Text in #0a0d16. Attribution (name, role) in IBM Plex Sans 14px/600, with the role in a lighter weight. The card carries the same hue-tinted glow shadow as feature cards (amber at 8% opacity).

### Customer Logo Strip
**Role:** Two-row grid of monochrome customer logos beneath the hero and on the dark testimonial band.

Logos rendered in #1d2130 (light bands) or #fcfcfd (dark band). Equal spacing on a flex row, 40px column-gap. No borders or backgrounds; logos float on the canvas.

### Gradient Brushstroke Underline
**Role:** The hand-drawn highlight beneath key words in headlines ('DXed' in 'Remote deployments DXed').

A short horizontal stroke roughly 2-3px tall, 40-80% of the underlined word's width. Fill is a multicolor linear gradient blending cyan → green → yellow → pink, matching the feature-card stroke palette. No border, no shadow. Sits 2-4px below the baseline.

### Grid Paper Background
**Role:** Decorative canvas pattern across hero and feature sections.

Subtle 1px grid lines in rgba(235,238,247,0.6) on the #fcfcfd canvas, 24-32px cell size. The grid fades at section edges or behind content. Reinforces the 'engineering blueprint' metaphor.

### Inline Feature Link
**Role:** Text links inside body copy.

Color #1a67fd, no underline by default, underline appears on hover. 16px/400 inline with body text.

### Eyebrow Label
**Role:** Section overline text above headlines.

IBM Plex Mono 12px/500, 2px letter-spacing, uppercase, color #6b6d72 (Pewter). Centered above hero and section headlines.

## Do's and Don'ts

### Do
- Use #bfff5a (Lime Spark) as the sole primary action color — never pair it with another saturated button fill on the same screen.
- Set border-radius to 56px for all action buttons and 24px for all feature/product cards; use 44px only for nav links and tab pills.
- Apply negative letter-spacing proportionally: -3.6px at 80px, -1.0px at 48px, -0.26px at 22px. Do not leave display tracking at 0.
- Add the multicolor gradient brushstroke (cyan→green→yellow→pink) under 1-2 keywords per headline — never the full sentence.
- Use IBM Plex Mono 12px/500 with 2px letter-spacing for all uppercase eyebrow labels, always in #6b6d72 (Pewter).
- Set product-screenshot shadows to the five-stop translucent #1d2130 stack — this is the signature lift treatment for any image card.
- Keep the canvas at #fcfcfd with the 24-32px grid-paper overlay for hero and feature sections; switch to #0a0d16 only for testimonial/banner bands.

### Don't
- Do not use the lime #bfff5a for large surface fills, backgrounds, or non-action UI — its job is to be the single focal point per screen.
- Do not introduce additional saturated hues into the interface — the rainbow belongs exclusively to feature-card strokes, brushstrokes, and testimonial fills.
- Do not use square corners (0px) or default 4px radius on any visible element; every interactive or container element must read as a pill or rounded card.
- Do not use #000000 for text — the system uses #1d2130 (Midnight Ink) for nav, #151720 (Carbon) for body, #0a0d16 (Obsidian) for display.
- Do not stack multiple shadow layers with different base colors on the same element — the colored glow (cyan/lime/mint) appears only at the two outermost shadow stops.
- Do not center body paragraphs — body text is always left-aligned; centering is reserved for headlines, eyebrows, and logo strips.
- Do not use the radial gradient palette for text, icons, or borders — the gradients are decorative fills for cards and brushstrokes only.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas | `#fcfcfd` | Page background across all light sections. Always carries the subtle blueprint grid overlay. |
| 1 | Card | `#fcfcfd` | Product screenshot cards and feature cards float one level above the canvas via shadow, not via color change. |
| 2 | Dark Section | `#0a0d16` | Testimonial and logo-wall bands invert to near-black with white text. |
| 3 | Amber Card | `#ffd888` | Testimonial cards sit on dark sections with a warm radial gradient, creating the only warm-colored surface in the system. |

## Elevation

- **Product Screenshot Card:** `rgba(29, 33, 48, 0.04) 0px 3px 3px -1px, rgba(29, 33, 48, 0.04) 0px 6px 6px -3px, rgba(29, 33, 48, 0.04) 0px 12px 12px -6px, rgba(29, 33, 48, 0.04) 0px 24px 24px -12px, rgba(29, 33, 48, 0.04) 0px 32px 32px -16px`
- **Lime CTA Button:** `rgba(255, 255, 255, 0.72) 0px 1px 0px 0px inset, rgba(29, 33, 48, 0.12) 0px -2px 0px 0px inset, rgba(29, 33, 48, 0.04) 0px 1px 1px -1px, rgba(29, 33, 48, 0.04) 0px 4px 4px -2px`
- **Card / Surface Border:** `rgba(255, 255, 255, 0.72) 0px 0px 0px 1px inset, rgb(213, 217, 232) 0px 0px 0px 1px, rgba(29, 33, 48, 0.03) 0px 1px 1px -1px, rgba(29, 33, 48, 0.05) 0px 3px 3px -2px, rgba(29, 33, 48, 0.03) 0px 5px 5px -3px, rgba(213, 217, 232, 0.22) 0px 5px 5px -2px`
- **Feature Card with Cyan Glow:** `rgba(29, 33, 48, 0.08) 0px 0px 0px 1px, rgba(29, 33, 48, 0.04) 0px 1px 1px -1px, rgba(29, 33, 48, 0.04) 0px 2px 2px -1px, rgba(29, 33, 48, 0.04) 0px 3px 3px -1.5px, rgba(29, 33, 48, 0.04) 0px 5px 5px -2.5px, rgba(70, 216, 255, 0.08) 0px 10px 10px -5px, rgba(70, 216, 255, 0.08) 0px 24px 24px -8px`
- **Feature Card with Lime Glow:** `rgba(29, 33, 48, 0.08) 0px 0px 0px 1px, rgba(29, 33, 48, 0.04) 0px 1px 1px -1px, rgba(29, 33, 48, 0.04) 0px 2px 2px -1px, rgba(29, 33, 48, 0.04) 0px 3px 3px -1.5px, rgba(29, 33, 48, 0.04) 0px 5px 5px -2.5px, rgba(183, 255, 90, 0.08) 0px 10px 10px -5px, rgba(183, 255, 90, 0.08) 0px 24px 24px -8px`

## Imagery

Imagery is overwhelmingly product-screenshot and icon-driven — no lifestyle photography, no stock imagery. The hero features fanned UI cards with gradient stroke accents; the Remote Deployments section layers three overlapping product screenshots at slight rotations on a blueprint-grid background. Icons are line-art, mono-color, 1.5px stroke weight, drawn in Midnight Ink (#1d2130) on white surfaces. Decorative elements are limited to the multicolor gradient brushstrokes under headlines and the curved stroke that arches across the top of each feature card. The dark testimonial section adds the only chromatic surface (amber gradient card) against a near-black band. Density is moderate — large product screenshots and feature cards carry the visual weight, body copy and eyebrows stay light.

## Layout

Page model is centered max-width (~1200px) with a consistent vertical rhythm of 80px section gaps. The hero is a centered headline stack with the feature-card fan below it on a full-width grid-paper background. Subsequent feature sections alternate between full-bleed band layouts (Remote Deployments with splayed product screenshots) and centered text stacks. The testimonials band breaks to a full-bleed dark #0a0d16 strip with a centered amber gradient card and a logo wall. Navigation is a simple top bar with logo left, center links, and a lime CTA right. Section anchors are reached via a floating pill-style tab strip that appears below feature screenshots.

## Agent Prompt Guide

**Quick Color Reference**
- text (primary): #1d2130
- text (display/heading): #0a0d16
- text (body): #151720
- background: #fcfcfd
- border: #ebeef7 / #d5d9e8
- accent (links, nav active): #1a67fd
- primary action: #bfff5a (filled action)

**3-5 Example Component Prompts**
1. **Lime CTA Button**: 56px border-radius, fill #bfff5a, text #0a0d16, IBM Plex Sans 16px/500, padding 16px 32px. Inset top highlight rgba(255,255,255,0.72) and inset bottom shadow rgba(29,33,48,0.12) for glass-bead depth.
2. **Feature Card (Fanned)**: 24px radius, white #fcfcfd fill, 1px hairline in #ebeef7. Curved stroke across the top arc in a hue-matched radial gradient (cyan/green/pink/mint/amber). Icon 24px line-art in #1d2130 at top, label in IBM Plex Sans 16px/500 #1d2130 below. Apply hue-tinted glow shadow at 8% opacity.
3. **Pill Tab Strip**: Container 9999px radius, white #fcfcfd, 1px border #ebeef7, soft layered shadow. Active tab fills with #151720 and text flips to #fcfcfd; inactive tabs transparent with #1d2130 text. Each tab is a 44px-radius pill.
4. **Product Screenshot Card**: 8px radius on the image, no border. Apply the five-stop translucent shadow stack: rgba(29,33,48,0.04) at 3px, 6px, 12px, 24px, and 32px blur radii, all with matching negative spread.
5. **Gradient Brushstroke Underline**: A 3px-tall horizontal bar, 60% of the word's width, positioned 4px below the headline baseline. Fill: linear gradient from #46d8ff (cyan) through #19f79a (mint) and #e5ed38 (citron) to #ff9dec (orchid).

## Gradient System

Gradients serve three purposes and only three: (1) feature-card top-arc strokes — each card gets a distinct hue from the rainbow palette so the fan of cards reads as a spectrum; (2) headline brushstrokes — a single horizontal multicolor sweep under 1-2 keywords per headline; (3) the testimonial card fill — the only warm radial gradient in the system, used to make a single quote pop against the dark band. The radial gradient tokens are: amber #ffd888→#ffc650, pink #ffb5f1→#ff9dec, citron #ecf174→#e5ed38, mint #5df7b6→#19f79a, cyan #7ae3ff→#46d8ff. All use radial-gradient(100% 100% at 50% 0px, ...) — always anchored to the top center so the gradient blooms downward from the top edge.

## Similar Brands

- **Vercel** — Same near-white canvas, near-black ink, pill-shaped nav, and a single high-saturation accent (vercel's black CTA, buddy's lime CTA) with a deliberate color rationing philosophy.
- **Linear** — Identical DNA of tight letter-spacing on large display type, layered translucent shadows, and monochrome interface punctuated by a single vivid accent on action elements.
- **PlanetScale** — Developer-tool brand with a near-monochrome product surface, sans-serif type with aggressive negative tracking, and subtle gradient accents reserved for decorative card strokes.
- **Render** — Same blueprint-grid hero background treatment, pill-radius primary buttons, and product-screenshot-forward sections with layered shadows lifting UI captures off the canvas.
- **Railway** — Engineering-focused brand language with IBM Plex Sans, near-black on near-white, and the same instinct to use one bright accent (railway's purple, buddy's lime) as the focal point per screen.

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-lime-spark: #bfff5a;
  --color-cobalt-signal: #1a67fd;
  --color-forest-depth: #0b3d28;
  --color-paper-white: #fcfcfd;
  --color-midnight-ink: #1d2130;
  --color-carbon: #151720;
  --color-obsidian: #0a0d16;
  --color-mist-gray: #ebeef7;
  --color-slate-edge: #d5d9e8;
  --color-silver-wash: #d6d6d7;
  --color-pewter: #6b6d72;
  --color-graphite: #474950;
  --color-cyan-beam: #46d8ff;
  --gradient-cyan-beam: radial-gradient(100% 100% at 50% 0px, rgb(122, 227, 255) 0%, rgb(70, 216, 255) 100%);
  --color-mint-pulse: #19f79a;
  --gradient-mint-pulse: radial-gradient(100% 100% at 50% 0px, rgb(93, 247, 182) 0%, rgb(25, 247, 154) 100%);
  --color-citron-wave: #e5ed38;
  --gradient-citron-wave: radial-gradient(100% 100% at 50% 0px, rgb(236, 241, 116) 0%, rgb(229, 237, 56) 100%);
  --color-orchid-glaze: #ff9dec;
  --gradient-orchid-glaze: radial-gradient(100% 100% at 50% 0px, rgb(255, 181, 241) 0%, rgb(255, 157, 236) 100%);
  --color-amber-glow: #ffc650;
  --gradient-amber-glow: radial-gradient(100% 100% at 50% 0px, rgb(255, 216, 136) 0%, rgb(255, 198, 80) 100%);
  --color-mint-tint: #d8fbed;

  /* Typography — Font Families */
  --font-ibm-plex-sans: 'IBM Plex Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-ibm-plex-mono: 'IBM Plex Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 2;
  --tracking-caption: 2px;
  --text-subheading: 18px;
  --leading-subheading: 1.45;
  --text-heading-sm: 22px;
  --leading-heading-sm: 1.43;
  --tracking-heading-sm: -0.26px;
  --text-heading: 48px;
  --leading-heading: 1;
  --tracking-heading: -1px;
  --text-display: 80px;
  --leading-display: 0.9;
  --tracking-display: -3.6px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-unit: 8px;
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-72: 72px;
  --spacing-96: 96px;
  --spacing-120: 120px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 24px;
  --element-gap: 16px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-xl: 14px;
  --radius-3xl: 24px;
  --radius-3xl-2: 44px;
  --radius-full: 56px;
  --radius-full-2: 78px;
  --radius-full-3: 9999px;

  /* Named Radii */
  --radius-cards: 24px;
  --radius-pills: 9999px;
  --radius-images: 8px;
  --radius-buttons: 56px;
  --radius-navlinks: 44px;
  --radius-smallcards: 14px;

  /* Shadows */
  --shadow-subtle: rgba(29, 33, 48, 0.04) 0px 3px 3px -1px, rgba(29, 33, 48, 0.04) 0px 6px 6px -3px, rgba(29, 33, 48, 0.04) 0px 12px 12px -6px, rgba(29, 33, 48, 0.04) 0px 24px 24px -12px, rgba(29, 33, 48, 0.04) 0px 32px 32px -16px;
  --shadow-subtle-2: rgba(255, 255, 255, 0.72) 0px 1px 0px 0px inset, rgba(29, 33, 48, 0.12) 0px -2px 0px 0px inset, rgba(29, 33, 48, 0.04) 0px 1px 1px -1px, rgba(29, 33, 48, 0.04) 0px 4px 4px -2px;
  --shadow-subtle-3: rgba(255, 255, 255, 0.72) 0px 0px 0px 1px inset, rgb(213, 217, 232) 0px 0px 0px 1px, rgba(29, 33, 48, 0.03) 0px 1px 1px -1px, rgba(29, 33, 48, 0.05) 0px 3px 3px -2px, rgba(29, 33, 48, 0.03) 0px 5px 5px -3px, rgba(213, 217, 232, 0.22) 0px 5px 5px -2px;
  --shadow-subtle-4: rgba(29, 33, 48, 0.08) 0px 0px 0px 1px, rgba(29, 33, 48, 0.04) 0px 1px 1px -1px, rgba(29, 33, 48, 0.04) 0px 2px 2px -1px, rgba(29, 33, 48, 0.04) 0px 3px 3px -1.5px, rgba(29, 33, 48, 0.04) 0px 5px 5px -2.5px, rgba(70, 216, 255, 0.08) 0px 10px 10px -5px, rgba(70, 216, 255, 0.08) 0px 24px 24px -8px;
  --shadow-subtle-5: rgba(29, 33, 48, 0.08) 0px 0px 0px 1px, rgba(29, 33, 48, 0.04) 0px 1px 1px -1px, rgba(29, 33, 48, 0.04) 0px 2px 2px -1px, rgba(29, 33, 48, 0.04) 0px 3px 3px -1.5px, rgba(29, 33, 48, 0.04) 0px 5px 5px -2.5px, rgba(183, 255, 90, 0.08) 0px 10px 10px -5px, rgba(183, 255, 90, 0.08) 0px 24px 24px -8px;
  --shadow-subtle-6: rgba(29, 33, 48, 0.08) 0px 0px 0px 1px, rgba(29, 33, 48, 0.04) 0px 1px 1px -1px, rgba(29, 33, 48, 0.04) 0px 2px 2px -1px, rgba(29, 33, 48, 0.04) 0px 3px 3px -1.5px, rgba(29, 33, 48, 0.04) 0px 5px 5px -2.5px, rgba(25, 247, 154, 0.08) 0px 10px 10px -5px, rgba(25, 247, 154, 0.08) 0px 24px 24px -8px;
  --shadow-subtle-7: rgba(29, 33, 48, 0.08) 0px 0px 0px 1px, rgba(29, 33, 48, 0.04) 0px 1px 1px -1px, rgba(29, 33, 48, 0.04) 0px 2px 2px -1px, rgba(29, 33, 48, 0.04) 0px 3px 3px -1.5px, rgba(29, 33, 48, 0.04) 0px 5px 5px -2.5px, rgba(193, 154, 255, 0.08) 0px 10px 10px -5px, rgba(193, 154, 255, 0.08) 0px 24px 24px -8px;
  --shadow-subtle-8: rgba(29, 33, 48, 0.08) 0px 0px 0px 1px, rgba(29, 33, 48, 0.04) 0px 1px 1px -1px, rgba(29, 33, 48, 0.04) 0px 2px 2px -1px, rgba(29, 33, 48, 0.04) 0px 3px 3px -1.5px, rgba(29, 33, 48, 0.04) 0px 5px 5px -2.5px, rgba(229, 237, 56, 0.08) 0px 10px 10px -5px, rgba(229, 237, 56, 0.08) 0px 24px 24px -8px;
  --shadow-subtle-9: rgba(29, 33, 48, 0.08) 0px 0px 0px 1px, rgba(29, 33, 48, 0.04) 0px 1px 1px -1px, rgba(29, 33, 48, 0.04) 0px 2px 2px -1px, rgba(29, 33, 48, 0.04) 0px 3px 3px -1.5px, rgba(29, 33, 48, 0.04) 0px 5px 5px -2.5px, rgba(255, 160, 48, 0.08) 0px 10px 10px -5px, rgba(255, 160, 48, 0.08) 0px 24px 24px -8px;
  --shadow-subtle-10: rgba(29, 33, 48, 0.08) 0px 0px 0px 1px, rgba(29, 33, 48, 0.04) 0px 1px 1px -1px, rgba(29, 33, 48, 0.04) 0px 2px 2px -1px, rgba(29, 33, 48, 0.04) 0px 3px 3px -1.5px, rgba(29, 33, 48, 0.04) 0px 5px 5px -2.5px, rgba(255, 128, 110, 0.08) 0px 10px 10px -5px, rgba(255, 128, 110, 0.08) 0px 24px 24px -8px;
  --shadow-subtle-11: rgba(17, 17, 17, 0.16) 0px 0px 0px 1px inset, rgba(29, 33, 48, 0.04) 0px 3px 3px -1px, rgba(29, 33, 48, 0.04) 0px 6px 6px -3px, rgba(29, 33, 48, 0.04) 0px 12px 12px -6px, rgba(29, 33, 48, 0.04) 0px 24px 24px -12px, rgba(255, 198, 80, 0.08) 0px 26px 32px -16px, rgba(255, 198, 80, 0.08) 0px 20px 44px -16px;
  --shadow-subtle-12: rgba(17, 17, 17, 0.16) 0px 0px 0px 1px inset, rgba(29, 33, 48, 0.04) 0px 3px 3px -1px, rgba(29, 33, 48, 0.04) 0px 6px 6px -3px, rgba(29, 33, 48, 0.04) 0px 12px 12px -6px, rgba(29, 33, 48, 0.04) 0px 24px 24px -12px, rgba(255, 157, 236, 0.08) 0px 26px 32px -16px, rgba(255, 157, 236, 0.08) 0px 20px 44px -16px;
  --shadow-subtle-13: rgba(17, 17, 17, 0.16) 0px 0px 0px 1px inset, rgba(29, 33, 48, 0.04) 0px 3px 3px -1px, rgba(29, 33, 48, 0.04) 0px 6px 6px -3px, rgba(29, 33, 48, 0.04) 0px 12px 12px -6px, rgba(29, 33, 48, 0.04) 0px 24px 24px -12px, rgba(229, 237, 56, 0.08) 0px 26px 32px -16px, rgba(229, 237, 56, 0.08) 0px 20px 44px -16px;
  --shadow-subtle-14: rgba(17, 17, 17, 0.16) 0px 0px 0px 1px inset, rgba(29, 33, 48, 0.04) 0px 3px 3px -1px, rgba(29, 33, 48, 0.04) 0px 6px 6px -3px, rgba(29, 33, 48, 0.04) 0px 12px 12px -6px, rgba(29, 33, 48, 0.04) 0px 24px 24px -12px, rgba(25, 247, 154, 0.08) 0px 26px 32px -16px, rgba(25, 247, 154, 0.08) 0px 20px 44px -16px;
  --shadow-subtle-15: rgba(17, 17, 17, 0.16) 0px 0px 0px 1px inset, rgba(29, 33, 48, 0.04) 0px 3px 3px -1px, rgba(29, 33, 48, 0.04) 0px 6px 6px -3px, rgba(29, 33, 48, 0.04) 0px 12px 12px -6px, rgba(29, 33, 48, 0.04) 0px 24px 24px -12px, rgba(70, 216, 255, 0.08) 0px 26px 32px -16px, rgba(70, 216, 255, 0.08) 0px 20px 44px -16px;

  /* Surfaces */
  --surface-canvas: #fcfcfd;
  --surface-card: #fcfcfd;
  --surface-dark-section: #0a0d16;
  --surface-amber-card: #ffd888;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-lime-spark: #bfff5a;
  --color-cobalt-signal: #1a67fd;
  --color-forest-depth: #0b3d28;
  --color-paper-white: #fcfcfd;
  --color-midnight-ink: #1d2130;
  --color-carbon: #151720;
  --color-obsidian: #0a0d16;
  --color-mist-gray: #ebeef7;
  --color-slate-edge: #d5d9e8;
  --color-silver-wash: #d6d6d7;
  --color-pewter: #6b6d72;
  --color-graphite: #474950;
  --color-cyan-beam: #46d8ff;
  --color-mint-pulse: #19f79a;
  --color-citron-wave: #e5ed38;
  --color-orchid-glaze: #ff9dec;
  --color-amber-glow: #ffc650;
  --color-mint-tint: #d8fbed;

  /* Typography */
  --font-ibm-plex-sans: 'IBM Plex Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-ibm-plex-mono: 'IBM Plex Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 2;
  --tracking-caption: 2px;
  --text-subheading: 18px;
  --leading-subheading: 1.45;
  --text-heading-sm: 22px;
  --leading-heading-sm: 1.43;
  --tracking-heading-sm: -0.26px;
  --text-heading: 48px;
  --leading-heading: 1;
  --tracking-heading: -1px;
  --text-display: 80px;
  --leading-display: 0.9;
  --tracking-display: -3.6px;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-72: 72px;
  --spacing-96: 96px;
  --spacing-120: 120px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-xl: 14px;
  --radius-3xl: 24px;
  --radius-3xl-2: 44px;
  --radius-full: 56px;
  --radius-full-2: 78px;
  --radius-full-3: 9999px;

  /* Shadows */
  --shadow-subtle: rgba(29, 33, 48, 0.04) 0px 3px 3px -1px, rgba(29, 33, 48, 0.04) 0px 6px 6px -3px, rgba(29, 33, 48, 0.04) 0px 12px 12px -6px, rgba(29, 33, 48, 0.04) 0px 24px 24px -12px, rgba(29, 33, 48, 0.04) 0px 32px 32px -16px;
  --shadow-subtle-2: rgba(255, 255, 255, 0.72) 0px 1px 0px 0px inset, rgba(29, 33, 48, 0.12) 0px -2px 0px 0px inset, rgba(29, 33, 48, 0.04) 0px 1px 1px -1px, rgba(29, 33, 48, 0.04) 0px 4px 4px -2px;
  --shadow-subtle-3: rgba(255, 255, 255, 0.72) 0px 0px 0px 1px inset, rgb(213, 217, 232) 0px 0px 0px 1px, rgba(29, 33, 48, 0.03) 0px 1px 1px -1px, rgba(29, 33, 48, 0.05) 0px 3px 3px -2px, rgba(29, 33, 48, 0.03) 0px 5px 5px -3px, rgba(213, 217, 232, 0.22) 0px 5px 5px -2px;
  --shadow-subtle-4: rgba(29, 33, 48, 0.08) 0px 0px 0px 1px, rgba(29, 33, 48, 0.04) 0px 1px 1px -1px, rgba(29, 33, 48, 0.04) 0px 2px 2px -1px, rgba(29, 33, 48, 0.04) 0px 3px 3px -1.5px, rgba(29, 33, 48, 0.04) 0px 5px 5px -2.5px, rgba(70, 216, 255, 0.08) 0px 10px 10px -5px, rgba(70, 216, 255, 0.08) 0px 24px 24px -8px;
  --shadow-subtle-5: rgba(29, 33, 48, 0.08) 0px 0px 0px 1px, rgba(29, 33, 48, 0.04) 0px 1px 1px -1px, rgba(29, 33, 48, 0.04) 0px 2px 2px -1px, rgba(29, 33, 48, 0.04) 0px 3px 3px -1.5px, rgba(29, 33, 48, 0.04) 0px 5px 5px -2.5px, rgba(183, 255, 90, 0.08) 0px 10px 10px -5px, rgba(183, 255, 90, 0.08) 0px 24px 24px -8px;
  --shadow-subtle-6: rgba(29, 33, 48, 0.08) 0px 0px 0px 1px, rgba(29, 33, 48, 0.04) 0px 1px 1px -1px, rgba(29, 33, 48, 0.04) 0px 2px 2px -1px, rgba(29, 33, 48, 0.04) 0px 3px 3px -1.5px, rgba(29, 33, 48, 0.04) 0px 5px 5px -2.5px, rgba(25, 247, 154, 0.08) 0px 10px 10px -5px, rgba(25, 247, 154, 0.08) 0px 24px 24px -8px;
  --shadow-subtle-7: rgba(29, 33, 48, 0.08) 0px 0px 0px 1px, rgba(29, 33, 48, 0.04) 0px 1px 1px -1px, rgba(29, 33, 48, 0.04) 0px 2px 2px -1px, rgba(29, 33, 48, 0.04) 0px 3px 3px -1.5px, rgba(29, 33, 48, 0.04) 0px 5px 5px -2.5px, rgba(193, 154, 255, 0.08) 0px 10px 10px -5px, rgba(193, 154, 255, 0.08) 0px 24px 24px -8px;
  --shadow-subtle-8: rgba(29, 33, 48, 0.08) 0px 0px 0px 1px, rgba(29, 33, 48, 0.04) 0px 1px 1px -1px, rgba(29, 33, 48, 0.04) 0px 2px 2px -1px, rgba(29, 33, 48, 0.04) 0px 3px 3px -1.5px, rgba(29, 33, 48, 0.04) 0px 5px 5px -2.5px, rgba(229, 237, 56, 0.08) 0px 10px 10px -5px, rgba(229, 237, 56, 0.08) 0px 24px 24px -8px;
  --shadow-subtle-9: rgba(29, 33, 48, 0.08) 0px 0px 0px 1px, rgba(29, 33, 48, 0.04) 0px 1px 1px -1px, rgba(29, 33, 48, 0.04) 0px 2px 2px -1px, rgba(29, 33, 48, 0.04) 0px 3px 3px -1.5px, rgba(29, 33, 48, 0.04) 0px 5px 5px -2.5px, rgba(255, 160, 48, 0.08) 0px 10px 10px -5px, rgba(255, 160, 48, 0.08) 0px 24px 24px -8px;
  --shadow-subtle-10: rgba(29, 33, 48, 0.08) 0px 0px 0px 1px, rgba(29, 33, 48, 0.04) 0px 1px 1px -1px, rgba(29, 33, 48, 0.04) 0px 2px 2px -1px, rgba(29, 33, 48, 0.04) 0px 3px 3px -1.5px, rgba(29, 33, 48, 0.04) 0px 5px 5px -2.5px, rgba(255, 128, 110, 0.08) 0px 10px 10px -5px, rgba(255, 128, 110, 0.08) 0px 24px 24px -8px;
  --shadow-subtle-11: rgba(17, 17, 17, 0.16) 0px 0px 0px 1px inset, rgba(29, 33, 48, 0.04) 0px 3px 3px -1px, rgba(29, 33, 48, 0.04) 0px 6px 6px -3px, rgba(29, 33, 48, 0.04) 0px 12px 12px -6px, rgba(29, 33, 48, 0.04) 0px 24px 24px -12px, rgba(255, 198, 80, 0.08) 0px 26px 32px -16px, rgba(255, 198, 80, 0.08) 0px 20px 44px -16px;
  --shadow-subtle-12: rgba(17, 17, 17, 0.16) 0px 0px 0px 1px inset, rgba(29, 33, 48, 0.04) 0px 3px 3px -1px, rgba(29, 33, 48, 0.04) 0px 6px 6px -3px, rgba(29, 33, 48, 0.04) 0px 12px 12px -6px, rgba(29, 33, 48, 0.04) 0px 24px 24px -12px, rgba(255, 157, 236, 0.08) 0px 26px 32px -16px, rgba(255, 157, 236, 0.08) 0px 20px 44px -16px;
  --shadow-subtle-13: rgba(17, 17, 17, 0.16) 0px 0px 0px 1px inset, rgba(29, 33, 48, 0.04) 0px 3px 3px -1px, rgba(29, 33, 48, 0.04) 0px 6px 6px -3px, rgba(29, 33, 48, 0.04) 0px 12px 12px -6px, rgba(29, 33, 48, 0.04) 0px 24px 24px -12px, rgba(229, 237, 56, 0.08) 0px 26px 32px -16px, rgba(229, 237, 56, 0.08) 0px 20px 44px -16px;
  --shadow-subtle-14: rgba(17, 17, 17, 0.16) 0px 0px 0px 1px inset, rgba(29, 33, 48, 0.04) 0px 3px 3px -1px, rgba(29, 33, 48, 0.04) 0px 6px 6px -3px, rgba(29, 33, 48, 0.04) 0px 12px 12px -6px, rgba(29, 33, 48, 0.04) 0px 24px 24px -12px, rgba(25, 247, 154, 0.08) 0px 26px 32px -16px, rgba(25, 247, 154, 0.08) 0px 20px 44px -16px;
  --shadow-subtle-15: rgba(17, 17, 17, 0.16) 0px 0px 0px 1px inset, rgba(29, 33, 48, 0.04) 0px 3px 3px -1px, rgba(29, 33, 48, 0.04) 0px 6px 6px -3px, rgba(29, 33, 48, 0.04) 0px 12px 12px -6px, rgba(29, 33, 48, 0.04) 0px 24px 24px -12px, rgba(70, 216, 255, 0.08) 0px 26px 32px -16px, rgba(70, 216, 255, 0.08) 0px 20px 44px -16px;
}
```
