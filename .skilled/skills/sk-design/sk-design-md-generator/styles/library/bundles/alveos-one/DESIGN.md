# Alveos One — Style Reference
> warm river-stone sanctuary — a still, cream-lit meditation room where a single graphite object rests in a pool of soft amber light.

**Theme:** light

Alveos One uses a warm, achromatic wellness language: every surface is a tone of cream, ivory, graphite, or near-black, and the product itself is the only spotlit object on the page. Composition is centered and unhurried — a radial cream-to-clay gradient frames the hero device like a stage spotlight, and downstream sections alternate between warm cream and bright white with large rounded-corner lifestyle photography carrying dark gradient overlays and white type. Typography is restrained through Hanken Grotesk at its native weights with a whisper-wide 0.4440em tracking on small all-caps labels, creating editorial calm rather than urgency. Primary actions are near-black filled buttons — not a chromatic brand color — which keeps the system feeling like a premium health product, not a SaaS tool. Corners are soft (25px dominates), shadows are nearly imperceptible, and the only gradient in the system is the warm spotlit hero.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Linen Canvas | `#fcf9f7` | `--color-linen-canvas` | Page background, hero gradient origin — warm cream base that absorbs the entire site into a unified off-white |
| Bone White | `#ffffff` | `--color-bone-white` | Card surfaces, section backgrounds, raised panels against the linen canvas |
| Graphite Ink | `#000000` | `--color-graphite-ink` | Primary text, dominant border color across cards and sections — the system's typographic anchor |
| Nightshade Black | `#05060b` | `--color-nightshade-black` | Primary action button fill, footer background — near-black with a faint cool undertone |
| Deep Harbor | `#030f1c` | `--color-deep-harbor` | Alternate dark surface, nav background — indistinguishable from Nightshade but carries a subtle navy tilt |
| Charcoal Slate | `#1d1d1d` | `--color-charcoal-slate` | Body borders, secondary surfaces, image card borders — slightly softer than pure black |
| Iron Grey | `#262628` | `--color-iron-grey` | Icon strokes, heading borders, secondary fills — mid-dark neutral for iconography |
| Obsidian | `#111112` | `--color-obsidian` | Nav text, body borders — the darkest readable neutral after Nightshade |
| Stone Grey | `#575757` | `--color-stone-grey` | Muted body text, default body border — the primary mid-grey for paragraph copy and dividers |
| Ash | `#717171` | `--color-ash` | Helper text, icon strokes, link borders — lighter mid-grey for secondary metadata |
| Pebble | `#989695` | `--color-pebble` | Subtle body borders, low-emphasis copy — barely-there dividers |
| Concrete | `#a5a5a5` | `--color-concrete` | Faint body text and dividers — used sparingly for ultra-low emphasis |
| Dove | `#bababa` | `--color-dove` | Button border, icon fill, disabled-state borders — the lightest mid-tone |
| Clay Shadow | `#d1cfcd` | `--color-clay-shadow` | Soft shadow color, card box-shadows, subtle background fills — warm-tinted shadow grey that matches the canvas |
| Haze | `#ecedef` | `--color-haze` | Subtle card borders, low-contrast dividers — the cool counterpoint to Clay Shadow |
| Spotlight Gradient | `radial-gradient(50% 95% at 50% 108.6%, rgb(252, 249, 247) 0%, rgb(168, 156, 138) 100%)` | `--color-spotlight-gradient` | Hero radial gradient terminus — warm clay tone that pools beneath the product like stage light fading into a linen floor |

## Tokens — Typography

### sans-serif — sans-serif — detected in extracted data but not described by AI · `--font-sans-serif`
- **Weights:** 400, 600
- **Sizes:** 10px, 12px, 18px
- **Line height:** 1.2, 1.3
- **Letter spacing:** 0.444
- **Role:** sans-serif — detected in extracted data but not described by AI

### Hanken Grotesk — Primary brand typeface for all navigation, body, headings, and lists. Weight 400 carries body and long-form copy; 500–600 lifts subheadings and buttons; 700 anchors the largest display sizes. Carries custom OpenType features (blwf, cv03, cv04, cv09, cv11) that shape the letterforms into their editorial geometry — not a system stack. · `--font-hanken-grotesk`
- **Substitute:** Inter, Manrope, or DM Sans
- **Weights:** 400, 500, 600, 700
- **Sizes:** 16px, 18px, 20px, 24px, 28px, 36px, 38px, 52px
- **Line height:** 1.10–1.60
- **OpenType features:** `"blwf" on, "cv03" on, "cv04" on, "cv09" on, "cv11" on`
- **Role:** Primary brand typeface for all navigation, body, headings, and lists. Weight 400 carries body and long-form copy; 500–600 lifts subheadings and buttons; 700 anchors the largest display sizes. Carries custom OpenType features (blwf, cv03, cv04, cv09, cv11) that shape the letterforms into their editorial geometry — not a system stack.

### System Sans — Utility and icon font. Used at micro sizes (10–12px) for eyebrow labels, meta tags, and icon-adjacent text, where the unusually wide 0.4440em tracking creates the spaced-out all-caps aesthetic typical of premium wellness branding. · `--font-system-sans`
- **Weights:** 400, 600
- **Sizes:** 
- **Line height:** 1.20–1.30
- **Letter spacing:** 0.4440em
- **Role:** Utility and icon font. Used at micro sizes (10–12px) for eyebrow labels, meta tags, and icon-adjacent text, where the unusually wide 0.4440em tracking creates the spaced-out all-caps aesthetic typical of premium wellness branding.

### SF Mono — Micro-verification labels (e.g. 'Verified by BrandPush.co'). Tight 0.02em tracking, monospaced at 9px — the smallest typographic element on the site, sitting beneath press logos. · `--font-sf-mono`
- **Weights:** 600
- **Sizes:** 9px
- **Line height:** 1.00
- **Letter spacing:** 0.02em
- **Role:** Micro-verification labels (e.g. 'Verified by BrandPush.co'). Tight 0.02em tracking, monospaced at 9px — the smallest typographic element on the site, sitting beneath press logos.

### Inter — Occasional fallback body copy. Lowest frequency of all fonts — appears sparingly in body contexts. · `--font-inter`
- **Substitute:** system-ui, -apple-system, sans-serif
- **Weights:** 400
- **Sizes:** 16px
- **Line height:** 1.20
- **Role:** Occasional fallback body copy. Lowest frequency of all fonts — appears sparingly in body contexts.

### -apple-system — -apple-system — detected in extracted data but not described by AI · `--font-apple-system`
- **Weights:** 400, 500, 600
- **Sizes:** 11px, 12px
- **Line height:** 1.2, 1.48
- **Role:** -apple-system — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| micro | 10px | 1.2 | 4.44px | `--text-micro` |
| caption | 12px | 1.3 | — | `--text-caption` |
| body-sm | 16px | 1.6 | — | `--text-body-sm` |
| body | 18px | 1.5 | — | `--text-body` |
| body-lg | 20px | 1.5 | — | `--text-body-lg` |
| subheading | 24px | 1.4 | — | `--text-subheading` |
| heading-sm | 28px | 1.4 | — | `--text-heading-sm` |
| heading | 36px | 1.2 | — | `--text-heading` |
| heading-lg | 38px | 1.2 | — | `--text-heading-lg` |
| display | 52px | 1.1 | — | `--text-display` |

## Tokens — Spacing & Shapes

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 5 | 5px | `--spacing-5` |
| 7 | 7px | `--spacing-7` |
| 8 | 8px | `--spacing-8` |
| 9 | 9px | `--spacing-9` |
| 10 | 10px | `--spacing-10` |
| 14 | 14px | `--spacing-14` |
| 15 | 15px | `--spacing-15` |
| 20 | 20px | `--spacing-20` |
| 24 | 24px | `--spacing-24` |
| 25 | 25px | `--spacing-25` |
| 26 | 26px | `--spacing-26` |
| 30 | 30px | `--spacing-30` |
| 32 | 32px | `--spacing-32` |
| 50 | 50px | `--spacing-50` |
| 80 | 80px | `--spacing-80` |
| 150 | 150px | `--spacing-150` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 25px |
| icons | 25px |
| pills | 100px |
| images | 25px |
| buttons | 12px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| sm | `rgba(0, 0, 0, 0.06) 0px 1px 5px 0px` | `--shadow-sm` |
| xl | `rgba(0, 0, 0, 0.08) 0px 8px 30px 0px, rgba(0, 0, 0, 0.05)...` | `--shadow-xl` |
| md | `rgba(0, 0, 0, 0.05) 0px 2px 10px 0px` | `--shadow-md` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 24px
- **Element gap:** 10px

## Components

### Top Navigation Bar
**Role:** Sticky header over hero and scroll content

Transparent or linen-canvas background, no visible border. Left: wordmark 'Alveos One' in Hanken Grotesk 18px weight 500. Center: 4-item nav (Alveos One, Science, Podcast, Contact) in 16px weight 400. Right: Pre-Order button. Vertical padding ~20px, horizontal full-bleed with 40px side gutter.

### Pre-Order CTA Button
**Role:** Primary action — the only conversion button in the header and repeated throughout the site

Dark filled pill: background Nightshade Black #05060b, text Bone White #ffffff, Hanken Grotesk 16px weight 500, padding 10px 20px, border-radius 12px. No border, no shadow. Anti-convention: no chromatic brand color, no gradient — authority through density and contrast alone.

### Pill Eyebrow Label
**Role:** Section intro tag sitting above the hero headline

Small rounded badge: background Bone White #ffffff, text Iron Grey #262628, border 1px #d1cfcd, Hanken Grotesk 12px weight 500, padding 7px 14px, border-radius 100px (full pill). Optional subtle box-shadow rgba(0,0,0,0.06) 0px 1px 5px.

### Hero Section with Spotlight
**Role:** Full-viewport opening that frames the product

Background is the warm radial gradient (Linen Canvas #fcf9f7 → Clay Shadow #a89c8a at 108.6% vertical). Content stacked center: pill label, 52px display headline in Graphite Ink, 18px body subtext in Charcoal Slate, then the product device floating in the lower third. No horizontal split — everything vertically centered, breathing room dominant.

### Image Feature Card
**Role:** Large rounded lifestyle photograph with overlaid text — the primary content card

Full-bleed photograph clipped to 25px radius. Dark gradient overlay (transparent top to near-black bottom) for text legibility. White headline 28–36px weight 600, white body 18px weight 400, both bottom-left aligned with 24px padding. Aspect ratio roughly 3:4. Shadow rgba(0,0,0,0.05) 0px 2px 10px.

### Two-Column Card Grid
**Role:** Primary content arrangement for feature showcases

Two equal-width Image Feature Cards side by side, separated by ~20px gutter. Grid repeats vertically. Cards use the same 25px radius, dark gradient overlay, and white overlaid text. The grid sits on Bone White #ffffff or Linen Canvas #fcf9f7.

### Press Logos Bar
**Role:** Social proof section — 'AS SEEN ON'

Centered on Linen Canvas or Bone White. Eyebrow text 'AS SEEN ON' in Hanken Grotesk 12px weight 500, letter-spacing 0.4440em (tracked-out caps), flanked by 1px horizontal lines in Charcoal Slate. Row of 5 press logos (Business Insider, AP, barchart, StreetInsider, Wall Street Journal) in Graphite Ink, 24–32px tall. Below: 'AND OVER 500 NEWS SITES' in tracked-out caps + 9px SF Mono 'Verified by BrandPush.co' subline.

### Outlined Secondary Button
**Role:** Alternative to the filled CTA for non-primary actions

Transparent or Bone White background, 1px border in Charcoal Slate #1d1d1d or Stone Grey #575757, text in same dark tone, Hanken Grotesk 16px weight 500, padding 10px 20px, border-radius 12px. Used when multiple actions exist but the filled CTA must dominate.

### Dark Footer
**Role:** Site footer on Nightshade Black background

Background Nightshade Black #05060b, text and borders in Bone White #ffffff at reduced opacity. Padding 40–60px vertical. Contains secondary nav, legal copy, and small utility links in 12–14px Hanken Grotesk weight 400.

## Do's and Don'ts

### Do
- Use 25px border-radius for all image cards, feature cards, and photograph containers — this is the dominant corner geometry and defines the soft, premium feel
- Use Nightshade Black #05060b as the primary action button fill with white text and 12px radius — never introduce a chromatic CTA color
- Set the page canvas to Linen Canvas #fcf9f7 for all body sections and let Bone White #ffffff surface only as raised cards
- Use Hanken Grotesk for all primary type and enable its custom OpenType features ('blwf', 'cv03', 'cv04', 'cv09', 'cv11') to preserve the editorial letterform shapes
- Apply 0.4440em letter-spacing to small all-caps labels (10–12px) — the wide tracking is a signature element of the brand voice
- Use the warm radial gradient (Linen Canvas → Clay Shadow) only for the hero spotlight — do not reuse it in content sections
- Keep shadows nearly invisible: rgba(0,0,0,0.05–0.08) at low blur radii. Elevation should be implied through contrast and radius, not drop-shadow weight

### Don't
- Do not introduce any chromatic color — the system is 0% colorful by design and any saturated hue would break the wellness aesthetic
- Do not use sharp 0px corners or small 4px radii on feature cards — the 25px radius is what makes the imagery feel like spa product photography
- Do not use a brand-colored CTA (blue, green, red) — the near-black filled button is a deliberate anti-convention choice that signals premium health product, not SaaS
- Do not use heavy or layered shadows — the design relies on a single faint shadow or no shadow at all
- Do not use multiple gradients across the site — the radial hero gradient is the only one; content sections stay flat
- Do not pair Hanken Grotesk with a geometric or condensed display face — the brand voice is built on a single grotesque family at varied weights
- Do not center-align long body paragraphs — use centered alignment only for headlines, hero copy, and single-line metadata; body text in cards and sections should remain left-aligned

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Linen Canvas | `#fcf9f7` | Base page background — warm cream that absorbs the entire site into a unified off-white field |
| 2 | Bone White | `#ffffff` | Raised card and section background, the first surface elevation above the linen canvas |
| 3 | Clay Shadow | `#d1cfcd` | Tertiary surface tint for subtle differentiation — used for fills, soft borders, and shadow tone |
| 4 | Charcoal Slate | `#1d1d1d` | Dark accent surface for image card borders and dark gradient overlay bases |
| 5 | Nightshade Black | `#05060b` | Deepest surface — footer, primary CTA fill, terminal dark sections |

## Elevation

- **Image Feature Card:** `rgba(0, 0, 0, 0.05) 0px 2px 10px 0px`
- **Elevated Content Card:** `rgba(0, 0, 0, 0.08) 0px 8px 30px 0px, rgba(0, 0, 0, 0.05) 0px 2px 8px 0px`
- **Pill Eyebrow Label:** `rgba(0, 0, 0, 0.06) 0px 1px 5px 0px`

## Imagery

Imagery is entirely photographic — no illustrations, no 3D renders, no abstract graphics. The product device itself is the sole 'object' shot, presented front-and-center on the hero gradient. Downstream photography is lifestyle: close crops of faces in states of calm or exertion (a woman with wind-tousled hair eyes-closed, an athlete mid-recovery on a rooftop). All images use the same treatment — clipped to 25px radius, overlaid with a dark vertical gradient (transparent at top, near-black at bottom) for white overlaid type. No masks, no duotones, no decorative effects. Press logos are rendered as flat black monochrome marks. The overall density is image-heavy in feature sections, text-dominant in the hero, and the product photograph is the visual anchor of the entire site.

## Layout

Full-bleed page model with centered compositions. The hero is a full-viewport stage: radial gradient background, vertically centered stack (pill label → 52px headline → 18px subtext → product device), nothing left-aligned. Following the hero, content flows in alternating bands of Linen Canvas and Bone White with 80px vertical section gaps. The primary content pattern is a 2-column grid of large rounded image cards, stacked vertically into a 2×N arrangement. The press logos section is a single centered horizontal band with tracked-out caps and thin flanking rules. Navigation is a minimal top bar — left wordmark, center links, right CTA — transparent over the hero and linen-toned over content. No sidebar, no mega-menu. The page reads as a sequence of calm, breathing pauses: wide vertical gaps, centered anchors, and rounded image cards that float like stones in a stream.

## Agent Prompt Guide

**Quick Color Reference**
- text: #000000 (primary), #1d1d1d (body), #575757 (muted)
- background: #fcf9f7 (canvas), #ffffff (cards)
- border: #d1cfcd (soft), #1d1d1d (strong), #575757 (default)
- accent: none (system is 0% colorful)
- primary action: #05060b (filled action)

**Example Component Prompts**

1. Build a hero section: background radial-gradient(50% 95% at 50% 108.6%, #fcf9f7 0%, #a89c8a 100%). Centered pill label (background #ffffff, text #262628, border 1px #d1cfcd, Hanken Grotesk 12px weight 500, padding 7px 14px, radius 100px). Display headline at 52px Hanken Grotesk weight 600, color #000000. Subtext at 18px weight 400, color #1d1d1d, max-width 560px.

2. Build an image feature card: full-bleed photograph, 25px border-radius, dark vertical gradient overlay (transparent → rgba(0,0,0,0.7) at bottom). White headline 28px Hanken Grotesk weight 600, white body 16px weight 400, both bottom-left with 24px padding. Box-shadow rgba(0,0,0,0.05) 0px 2px 10px.

3. Build a Pre-Order button: background #05060b, color #ffffff, Hanken Grotesk 16px weight 500, padding 10px 20px, border-radius 12px. No border, no shadow.

4. Build the press logos bar: centered 'AS SEEN ON' in 12px Hanken Grotesk weight 500, letter-spacing 0.4440em, color #1d1d1d, flanked by 1px horizontal lines in #1d1d1d extending ~120px each side. Row of 5 press logos in #000000, 24–32px tall, evenly spaced. Below: 'AND OVER 500 NEWS SITES' in tracked-out caps + 'Verified by BrandPush.co' in 9px SF Mono weight 600.

5. Build a dark footer: background #05060b, padding 48px vertical, text in #ffffff at 80% opacity, Hanken Grotesk 14px weight 400, links separated by 20px gap.

## Similar Brands

- **Oura** — Same achromatic premium wellness aesthetic — warm cream and bone-white palette, Hanken Grotesk-adjacent grotesques, large rounded product photography with dark overlays, and dark-filled CTAs instead of chromatic brand buttons
- **Whoop** — Same whisper-quiet shadow philosophy, same near-black filled primary action, and same large 20–25px corner radii on feature imagery, though Whoop leans darker overall
- **Aesop** — Same warm cream canvas and achromatic product-page restraint — linen-toned backgrounds, generous vertical breathing room, and serif-free grotesques at the same editorial weights
- **Calm** — Same centered-composition hero pattern, same soft radial gradient framing a single product/object, and same tracked-out small-caps eyebrow labels above section headlines
- **MUJI** — Same warm off-white canvas, same near-total absence of chromatic brand color, and same 25px-ish soft corners on product imagery — the 'premium through restraint' design philosophy

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-linen-canvas: #fcf9f7;
  --color-bone-white: #ffffff;
  --color-graphite-ink: #000000;
  --color-nightshade-black: #05060b;
  --color-deep-harbor: #030f1c;
  --color-charcoal-slate: #1d1d1d;
  --color-iron-grey: #262628;
  --color-obsidian: #111112;
  --color-stone-grey: #575757;
  --color-ash: #717171;
  --color-pebble: #989695;
  --color-concrete: #a5a5a5;
  --color-dove: #bababa;
  --color-clay-shadow: #d1cfcd;
  --color-haze: #ecedef;
  --color-spotlight-gradient: #a89c8a;
  --gradient-spotlight-gradient: radial-gradient(50% 95% at 50% 108.6%, rgb(252, 249, 247) 0%, rgb(168, 156, 138) 100%);

  /* Typography — Font Families */
  --font-sans-serif: 'sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-hanken-grotesk: 'Hanken Grotesk', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-system-sans: 'System Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-sf-mono: 'SF Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-apple-system: '-apple-system', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-micro: 10px;
  --leading-micro: 1.2;
  --tracking-micro: 4.44px;
  --text-caption: 12px;
  --leading-caption: 1.3;
  --text-body-sm: 16px;
  --leading-body-sm: 1.6;
  --text-body: 18px;
  --leading-body: 1.5;
  --text-body-lg: 20px;
  --leading-body-lg: 1.5;
  --text-subheading: 24px;
  --leading-subheading: 1.4;
  --text-heading-sm: 28px;
  --leading-heading-sm: 1.4;
  --text-heading: 36px;
  --leading-heading: 1.2;
  --text-heading-lg: 38px;
  --leading-heading-lg: 1.2;
  --text-display: 52px;
  --leading-display: 1.1;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-5: 5px;
  --spacing-7: 7px;
  --spacing-8: 8px;
  --spacing-9: 9px;
  --spacing-10: 10px;
  --spacing-14: 14px;
  --spacing-15: 15px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-25: 25px;
  --spacing-26: 26px;
  --spacing-30: 30px;
  --spacing-32: 32px;
  --spacing-50: 50px;
  --spacing-80: 80px;
  --spacing-150: 150px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 24px;
  --element-gap: 10px;

  /* Border Radius */
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-2xl-2: 20px;
  --radius-3xl: 25px;
  --radius-full: 100px;

  /* Named Radii */
  --radius-cards: 25px;
  --radius-icons: 25px;
  --radius-pills: 100px;
  --radius-images: 25px;
  --radius-buttons: 12px;

  /* Shadows */
  --shadow-sm: rgba(0, 0, 0, 0.06) 0px 1px 5px 0px;
  --shadow-xl: rgba(0, 0, 0, 0.08) 0px 8px 30px 0px, rgba(0, 0, 0, 0.05) 0px 2px 8px 0px;
  --shadow-md: rgba(0, 0, 0, 0.05) 0px 2px 10px 0px;

  /* Surfaces */
  --surface-linen-canvas: #fcf9f7;
  --surface-bone-white: #ffffff;
  --surface-clay-shadow: #d1cfcd;
  --surface-charcoal-slate: #1d1d1d;
  --surface-nightshade-black: #05060b;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-linen-canvas: #fcf9f7;
  --color-bone-white: #ffffff;
  --color-graphite-ink: #000000;
  --color-nightshade-black: #05060b;
  --color-deep-harbor: #030f1c;
  --color-charcoal-slate: #1d1d1d;
  --color-iron-grey: #262628;
  --color-obsidian: #111112;
  --color-stone-grey: #575757;
  --color-ash: #717171;
  --color-pebble: #989695;
  --color-concrete: #a5a5a5;
  --color-dove: #bababa;
  --color-clay-shadow: #d1cfcd;
  --color-haze: #ecedef;
  --color-spotlight-gradient: #a89c8a;

  /* Typography */
  --font-sans-serif: 'sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-hanken-grotesk: 'Hanken Grotesk', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-system-sans: 'System Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-sf-mono: 'SF Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-apple-system: '-apple-system', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-micro: 10px;
  --leading-micro: 1.2;
  --tracking-micro: 4.44px;
  --text-caption: 12px;
  --leading-caption: 1.3;
  --text-body-sm: 16px;
  --leading-body-sm: 1.6;
  --text-body: 18px;
  --leading-body: 1.5;
  --text-body-lg: 20px;
  --leading-body-lg: 1.5;
  --text-subheading: 24px;
  --leading-subheading: 1.4;
  --text-heading-sm: 28px;
  --leading-heading-sm: 1.4;
  --text-heading: 36px;
  --leading-heading: 1.2;
  --text-heading-lg: 38px;
  --leading-heading-lg: 1.2;
  --text-display: 52px;
  --leading-display: 1.1;

  /* Spacing */
  --spacing-5: 5px;
  --spacing-7: 7px;
  --spacing-8: 8px;
  --spacing-9: 9px;
  --spacing-10: 10px;
  --spacing-14: 14px;
  --spacing-15: 15px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-25: 25px;
  --spacing-26: 26px;
  --spacing-30: 30px;
  --spacing-32: 32px;
  --spacing-50: 50px;
  --spacing-80: 80px;
  --spacing-150: 150px;

  /* Border Radius */
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-2xl-2: 20px;
  --radius-3xl: 25px;
  --radius-full: 100px;

  /* Shadows */
  --shadow-sm: rgba(0, 0, 0, 0.06) 0px 1px 5px 0px;
  --shadow-xl: rgba(0, 0, 0, 0.08) 0px 8px 30px 0px, rgba(0, 0, 0, 0.05) 0px 2px 8px 0px;
  --shadow-md: rgba(0, 0, 0, 0.05) 0px 2px 10px 0px;
}
```
