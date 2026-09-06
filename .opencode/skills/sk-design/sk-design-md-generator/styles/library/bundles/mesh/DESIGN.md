# Mesh — Style Reference
> Bronze ink on midnight paper. A dark editorial spread where warm amber rules and serif-slim sans type guide the eye through a dense, unhurried layout.

**Theme:** dark

Mesh presents a nocturnal editorial workspace: near-black canvas, warm amber glow bleeding up from the lower viewport, and crisp white type that reads like a magazine spread rather than a SaaS dashboard. The voice is confident but quiet — compact, information-dense, with text doing the heavy lifting and color reserved as semantic punctuation. Warm copper (#f2b98b) is the only chromatic accent, and it arrives as outlines and rules rather than fills, so actions feel invited rather than pushed. The interface borrows from print typography: wide-tracked uppercase labels (0.1–0.17em), condensed display faces for hero headlines, and generous line-height on body copy. Surfaces are flat, borders are hairline, and the lone shadow is subtle — depth comes from layering and glow, not drop shadows.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Obsidian Canvas | `#0f0f10` | `--color-obsidian-canvas` | Page background, hero base, footer — the dominant near-black field that holds everything else |
| Graphite Layer | `#1d1d1f` | `--color-graphite-layer` | Elevated surfaces, icon strokes, secondary button borders — one step lighter than the canvas to create depth without elevation |
| Bone White | `#fefef7` | `--color-bone-white` | Neutral form states, badge text, and quiet UI feedback where color should stay understated. Do not promote it to the primary CTA color |
| Cream Paper | `#f7f3ee` | `--color-cream-paper` | Light surface variant, gradient terminus — a soft warm white paired with Obsidian for AAA contrast |
| Ash Border | `#b3b3b3` | `--color-ash-border` | Hairline borders, dividers, list separators, muted structural lines — the most-used neutral border color |
| Slate Mute | `#666666` | `--color-slate-mute` | Secondary text, inactive link borders, de-emphasized chrome |
| Cool Steel | `#868f97` | `--color-cool-steel` | Body helper text, icon outlines, subtle annotation |
| Warm Pewter | `#86868b` | `--color-warm-pewter` | Heading and body muted variant — the slightly warmer counterpart to Cool Steel |
| Pale Mist | `#cccccc` | `--color-pale-mist` | Body borders, very subtle structural separators |
| Onyx | `#000000` | `--color-onyx` | Body text on light surfaces, icon fills, deep contrast anchor |
| Bronze Glow | `#f2b98b` | `--color-bronze-glow` | Outlined action border, link underline, decorative icon accent — warm copper against matte black, the only chromatic punctuation in the system |
| Apricot Highlight | `#ffaf7c` | `--color-apricot-highlight` | Lighter amber accent for secondary decorative rules and gradient highlights |
| Amber Wash | `linear-gradient(95deg, rgb(212, 144, 101) 0%, rgb(254, 201, 155) 100%)` | `--color-amber-wash` | Gradient start color — the warm horizon glow that bleeds into the lower viewport |

## Tokens — Typography

### Verlag — Primary UI and body typeface. Weight 400 for body, 600 for nav and emphasized labels, 700 for buttons and card headings. The wide letter-spacing at small sizes (0.056em–0.167em) on 9–10px creates editorial all-caps labels that read as section markers, not body text. Substitute: Inter, Untitled Sans, or Söhne for a similar geometric grotesque with editorial weight range. · `--font-verlag`
- **Substitute:** Inter, Untitled Sans, Söhne
- **Weights:** 400, 600, 700
- **Sizes:** 9, 10, 12, 14, 16, 18, 20
- **Line height:** 1.00–3.00
- **Letter spacing:** 0.013em at 20px → 0.167em at 9px (all-caps labels at 9–10px use 0.167em, badges at 10–12px use 0.063–0.083em, body at 16px uses 0.013em)
- **Role:** Primary UI and body typeface. Weight 400 for body, 600 for nav and emphasized labels, 700 for buttons and card headings. The wide letter-spacing at small sizes (0.056em–0.167em) on 9–10px creates editorial all-caps labels that read as section markers, not body text. Substitute: Inter, Untitled Sans, or Söhne for a similar geometric grotesque with editorial weight range.

### Verlag Condensed — Display headlines only. The compressed letterforms at weight 900 create tall, magazine-cover impact on hero text — the signature of the Mesh brand voice. Substitute: Oswald, Barlow Condensed, or Roboto Condensed Black for a tall, narrow display face. · `--font-verlag-condensed`
- **Substitute:** Oswald, Barlow Condensed, Roboto Condensed
- **Weights:** 700, 900
- **Sizes:** 48, 64
- **Line height:** 1.00
- **Letter spacing:** 0.014em at 48–64px — nearly tight, letting the condensed forms breathe vertically
- **Role:** Display headlines only. The compressed letterforms at weight 900 create tall, magazine-cover impact on hero text — the signature of the Mesh brand voice. Substitute: Oswald, Barlow Condensed, or Roboto Condensed Black for a tall, narrow display face.

### Chronicle Text G1 Roman — Editorial subhead accent — a serif counterpoint to Verlag's sans, used sparingly for humanizing mid-page text. Substitute: Tiempos Text, Source Serif, or PT Serif. · `--font-chronicle-text-g1-roman`
- **Substitute:** Tiempos Text, Source Serif, PT Serif
- **Weights:** 400
- **Sizes:** 22
- **Line height:** 1.55
- **Letter spacing:** normal at 22px
- **Role:** Editorial subhead accent — a serif counterpoint to Verlag's sans, used sparingly for humanizing mid-page text. Substitute: Tiempos Text, Source Serif, or PT Serif.

### system-ui — System fallback for body and heading contexts where Verlag is unavailable. The 0.1em tracking at 10px mirrors the wide-label pattern. · `--font-system-ui`
- **Substitute:** system-ui, -apple-system, Segoe UI
- **Weights:** 500, 600
- **Sizes:** 10, 14, 15
- **Line height:** 1.14–2.00
- **Letter spacing:** 0.1em at 10px
- **Role:** System fallback for body and heading contexts where Verlag is unavailable. The 0.1em tracking at 10px mirrors the wide-label pattern.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| eyebrow | 10px | 1.1 | 1.67px | `--text-eyebrow` |
| body | 14px | 1.4 | — | `--text-body` |
| body-lg | 16px | 1.38 | — | `--text-body-lg` |
| subheading | 18px | 1.35 | — | `--text-subheading` |
| heading-sm | 20px | 1.33 | — | `--text-heading-sm` |
| editorial | 22px | 1.55 | — | `--text-editorial` |
| display | 48px | 1 | — | `--text-display` |
| display-lg | 64px | 1 | — | `--text-display-lg` |

## Tokens — Spacing & Shapes

**Density:** compact

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 6 | 6px | `--spacing-6` |
| 7 | 7px | `--spacing-7` |
| 8 | 8px | `--spacing-8` |
| 9 | 9px | `--spacing-9` |
| 10 | 10px | `--spacing-10` |
| 12 | 12px | `--spacing-12` |
| 14 | 14px | `--spacing-14` |
| 16 | 16px | `--spacing-16` |
| 24 | 24px | `--spacing-24` |
| 36 | 36px | `--spacing-36` |
| 56 | 56px | `--spacing-56` |
| 64 | 64px | `--spacing-64` |
| 104 | 104px | `--spacing-104` |
| 133 | 133px | `--spacing-133` |
| 140 | 140px | `--spacing-140` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 16px |
| badges | 12px |
| images | 36px |
| buttons | 6px |
| navPill | 9999px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| subtle | `rgba(0, 0, 0, 0.06) 0px 0px 0px 1px, rgba(0, 0, 0, 0.08) ...` | `--shadow-subtle` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 24px
- **Element gap:** 10px

## Components

### Hero Headline
**Role:** Primary page title

64px Verlag Condensed weight 900, color #fefef7, letter-spacing 0.014em, line-height 1.0. Centered above subtext. This is the loudest element on the page — everything else is quieter.

### Hero Subtext
**Role:** Supporting paragraph under headline

16px Verlag weight 400, color #b3b3b3, line-height 1.38, max-width ~600px centered. Muted gray-on-black to recede behind the headline.

### Filled Primary Button
**Role:** Main call-to-action (GET STARTED, GET MESH FREE)

Background #fefef7, text #0f0f10, Verlag 600 at 14px, uppercase, letter-spacing ~0.063em, padding 14px 28px, border-radius 6px. No border. The bright white pill against the dark canvas is the strongest visual button — no shadow needed, contrast does the work.

### Outlined Amber Action
**Role:** Secondary or contextual link/action

Background transparent, border 1px solid #f2b98b, text #f2b98b, Verlag 600 at 14px, padding 8px 16px, border-radius 6px. The amber outline is the only chromatic interactive element — use sparingly for contextual actions, not for primary CTAs.

### Ghost Text Link
**Role:** Inline navigation and footer links

No background, no border, text #b3b3b3 or #fefef7, Verlag 400 at 14–16px. Underline appears on hover in #f2b98b.

### Centered Nav Pill
**Role:** Primary site navigation

Pill-shaped container (border-radius 9999px) with semi-transparent dark background, holding 4 nav items (RELEASES, RESOURCES, COMPANY, PRICING) in Verlag 600 at 12px uppercase, letter-spacing ~0.071em, text #fefef7. Sits centered between logo and sign-in actions.

### Sign In Link
**Role:** Authenticated entry point

Plain text 'SIGN IN' in Verlag 600 at 12px uppercase, letter-spacing ~0.071em, color #fefef7. Sits left of the primary CTA in the header.

### Eyebrow Label
**Role:** Section markers and small annotations

Verlag 600 at 9–10px uppercase, letter-spacing 0.083–0.167em, color #b3b3b3 or #f2b98b. The wide tracking is a signature — these read as editorial captions, not UI labels.

### Product Mockup Card
**Role:** App preview in the hero

Large card with background #1d1d1f, border-radius 16px, subtle hairline border + offset shadow (see elevation). Contains a three-column app UI mockup with sidebar nav, activity feed, and detail panel. Rounded avatar images at 36px radius sit inside.

### Activity Feed Row
**Role:** Item in the product mockup feed

Row layout with 24px avatar, bold name, action text, timestamp right-aligned. Verlag 400/600 at 12–14px, name in #fefef7, description in #b3b3b3, timestamp in #666666. Dividers are 1px #b3b3b3 at very low opacity.

### Avatar Group
**Role:** Stacked user avatars

Overlapping circular images (36px radius), 2–4 avatars shown with negative margin. No border, no shadow — the overlap itself creates the grouping effect.

### Badge / Tag
**Role:** Status and category markers

Pill or rounded-rect (12px radius), background transparent or very dark, text in Verlag 600 at 10–12px uppercase, letter-spacing ~0.063em, border 1px #fefef7 or #b3b3b3. Amber variant uses border #f2b98b for emphasis.

### Social Proof Logo Strip
**Role:** Brand logos under the hero

Horizontal row of monochrome white logos (Notion, Disney, Stanford, IDEO, Tumblr, McKinsey) on the dark canvas. Logos are uniformly sized, evenly spaced with 40–60px gaps, and rendered in #b3b3b3 or #fefef7 with a small uppercase eyebrow label above.

### Announcement Banner
**Role:** Top-of-page news or update

Single line of Verlag 400 at 14px centered above the hero, with a bold name ('Clay' in this case) and a right-arrow link. Color #b3b3b3 base, #fefef7 for the bolded name, amber #f2b98b for the arrow link.

## Do's and Don'ts

### Do
- Use #fefef7 (Bone White) as the filled CTA background on dark surfaces — it provides 18.9:1 contrast against #0f0f10 and reads as warm, not clinical.
- Set small UI labels to 9–10px Verlag 600 uppercase with 0.083–0.167em letter-spacing — the wide tracking is a signature of the system.
- Use Verlag Condensed weight 900 at 48–64px for display headlines only; line-height 1.0 lets the tall forms stack tightly.
- Reserve #f2b98b (Bronze Glow) for outlined actions, link underlines, and decorative rules — never as a fill, to keep it feeling like a warm signal, not a button color.
- Apply 36px border-radius to all avatar and product-mockup images; 16px for content cards; 6px for buttons and inline links; 12px for badges.
- Layer the warm gradient (linear-gradient(95deg, #d49065 0%, #fec99b 100%)) as a bottom-of-viewport atmospheric wash — it bleeds up behind content rather than being contained in a band.
- Keep body text at 14–16px Verlag 400 with line-height 1.35–1.55; let long-form copy breathe vertically rather than tightening it.

### Don't
- Do not use #f2b98b as a filled button background — the system uses white fills for primary actions and amber only for outlined accents.
- Do not introduce additional chromatic colors; the 3% colorfulness budget means any new hue must be earned by a new functional role.
- Do not use soft, large-radius drop shadows; the single shadow in the system is an offset hairline (negative X, positive Y) — keep elevation minimal and directional.
- Do not use letter-spacing below 0.013em on body text or above 0.167em on any label; the tracking scale is the system's typographic identity.
- Do not use serif faces (Chronicle) for more than one mid-page editorial accent per screen — it is a counterpoint, not a workhorse.
- Do not apply border-radius uniformly; the 6/12/16/36 hierarchy maps to element type and losing it flattens the visual grammar.
- Do not place bright white (#fefef7) on bright surfaces — it is reserved for dark-canvas text and CTA fills; on light sections switch to #0f0f10 or #1d1d1f.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Obsidian Canvas | `#0f0f10` | Page base, hero, footer — the ground plane |
| 1 | Graphite Layer | `#1d1d1f` | Product mockup card, elevated UI panels, secondary surfaces |
| 2 | Warm Horizon | `#d49065` | Gradient atmosphere zone in the lower viewport — decorative only |
| 3 | Cream Paper | `#f7f3ee` | Inverse light sections, gradient terminus, high-contrast blocks |
| 4 | Bone White | `#fefef7` | Filled CTA, nav-pill background, badge borders — the brightest interactive surface |

## Elevation

- **Product Mockup Card:** `rgba(0, 0, 0, 0.06) 0px 0px 0px 1px, rgba(0, 0, 0, 0.08) -8px 12px 22px 0px`

## Imagery

Imagery is sparse and product-centric. The hero features a large product-mockup card showing the Mesh app interface rather than lifestyle photography. Avatar groups use real circular portraits (36px radius) for social proof. A social-proof logo strip displays monochrome white partner logos. The lower viewport carries a warm amber-to-cream gradient as atmospheric backdrop — decorative, not informational. No stock photography, no 3D renders, no illustrations. Icons are minimal and monoline. The visual weight is carried by type and the gradient atmosphere, not by imagery.

## Layout

Centered, max-width 1200px page model with full-bleed dark canvas. The hero is a single centered column: announcement banner → large condensed headline → 2-line subtext → white filled CTA, with the product mockup card overlapping the lower viewport where the warm gradient begins. Navigation is a centered pill above the headline, with logo and sign-in/CTA flanking it. Below the hero, sections flow as centered single-column or 2-column text-plus-visual blocks with 80px vertical gaps. The social-proof logo strip is a full-width centered row. The overall rhythm is unhurried and editorial — generous section gaps with compact internal spacing. No sidebar, no sticky header pattern, no card grid layouts — the page reads top-to-bottom as a continuous narrative.

## Agent Prompt Guide

**Quick Color Reference**
- text (on dark): #fefef7
- text (muted): #b3b3b3
- text (subtle): #666666
- background (canvas): #0f0f10
- surface (elevated): #1d1d1f
- border (hairline): #b3b3b3
- accent (amber): #f2b98b
- primary action: #f2b98b (outlined action border)

**Example Component Prompts**

1. Create an Outlined Primary Action: Transparent background, #f2b98b border and text, 9999px radius, compact pill padding. Use it for the main CTA instead of a filled button.

2. *Centered nav pill*: 9999px radius, semi-transparent dark fill, padding 6px 8px, containing 4 items at 12px Verlag 600 uppercase, letter-spacing 0.071em, text #fefef7, separated by 16px gaps. Sits centered in a max-width 1200px header.

3. *Product mockup card*: 16px border-radius, background #1d1d1f, hairline border 1px #b3b3b3, offset shadow rgba(0,0,0,0.06) 0 0 0 1px + rgba(0,0,0,0.08) -8px 12px 22px 0. Contains a 3-column app UI with sidebar (avatar 36px radius), activity feed rows (14px Verlag 400 names in #fefef7, 12px timestamps in #666666, 1px #b3b3b3 dividers at low opacity), and right detail panel.

4. *Outlined amber action link*: transparent background, 1px solid #f2b98b border, 6px radius, padding 8px 16px, text 14px Verlag 600 uppercase, letter-spacing 0.063em, color #f2b98b. Use for secondary/contextual actions only.

5. *Eyebrow label*: 9–10px Verlag 600 uppercase, letter-spacing 0.167em, color #b3b3b3. Sits centered above section content with 24px margin-bottom. Reads as editorial caption, not UI label.

## Gradient System

The single approved gradient is the warm horizon wash: linear-gradient(95deg, #d49065 0%, #fec99b 100%). It is positioned in the lower viewport, bleeding upward behind content rather than being contained in a card or band. Treat it as atmospheric chrome, not a brand element — it never appears inside components, only behind them.

## Typography Personality

The system pairs three faces: Verlag (geometric grotesque) for UI and body, Verlag Condensed (compressed sans) for hero display, and Chronicle Text G1 (transitional serif) for occasional editorial accents. The wide-tracked all-caps label is the most recognizable typographic signature — 9–10px with 0.083–0.167em tracking reads as magazine sidebar text, not interface chrome. Body copy is unadorned 14–16px Verlag 400 with generous line-height; the voice is unhurried.

## Similar Brands

- **Linear** — Same dark-canvas editorial approach with monochrome neutrals, hairline borders, and a single restrained accent for actions
- **Arc** — Compact information-dense layout with wide-tracked all-caps labels and warm-tinted whites (#fefef7 family) instead of pure white
- **Notion** — Near-black canvas with white text, condensed display type for hero headlines, and minimal chromatic accent usage
- **Vercel** — Dark-first design with centered nav pill, white filled CTA pattern, and product-mockup-over-gradient hero composition
- **Pitch** — Editorial dark UI with serif accents on a sans body, wide-tracked labels, and a single warm gradient as atmosphere

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-obsidian-canvas: #0f0f10;
  --color-graphite-layer: #1d1d1f;
  --color-bone-white: #fefef7;
  --color-cream-paper: #f7f3ee;
  --color-ash-border: #b3b3b3;
  --color-slate-mute: #666666;
  --color-cool-steel: #868f97;
  --color-warm-pewter: #86868b;
  --color-pale-mist: #cccccc;
  --color-onyx: #000000;
  --color-bronze-glow: #f2b98b;
  --color-apricot-highlight: #ffaf7c;
  --color-amber-wash: #d49065;
  --gradient-amber-wash: linear-gradient(95deg, rgb(212, 144, 101) 0%, rgb(254, 201, 155) 100%);

  /* Typography — Font Families */
  --font-verlag: 'Verlag', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-verlag-condensed: 'Verlag Condensed', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-chronicle-text-g1-roman: 'Chronicle Text G1 Roman', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-system-ui: 'system-ui', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-eyebrow: 10px;
  --leading-eyebrow: 1.1;
  --tracking-eyebrow: 1.67px;
  --text-body: 14px;
  --leading-body: 1.4;
  --text-body-lg: 16px;
  --leading-body-lg: 1.38;
  --text-subheading: 18px;
  --leading-subheading: 1.35;
  --text-heading-sm: 20px;
  --leading-heading-sm: 1.33;
  --text-editorial: 22px;
  --leading-editorial: 1.55;
  --text-display: 48px;
  --leading-display: 1;
  --text-display-lg: 64px;
  --leading-display-lg: 1;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
  --font-weight-black: 900;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-6: 6px;
  --spacing-7: 7px;
  --spacing-8: 8px;
  --spacing-9: 9px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-14: 14px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-36: 36px;
  --spacing-56: 56px;
  --spacing-64: 64px;
  --spacing-104: 104px;
  --spacing-133: 133px;
  --spacing-140: 140px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 24px;
  --element-gap: 10px;

  /* Border Radius */
  --radius-md: 6px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-2xl-2: 20px;
  --radius-3xl: 24px;
  --radius-3xl-2: 36px;

  /* Named Radii */
  --radius-cards: 16px;
  --radius-badges: 12px;
  --radius-images: 36px;
  --radius-buttons: 6px;
  --radius-navpill: 9999px;

  /* Shadows */
  --shadow-subtle: rgba(0, 0, 0, 0.06) 0px 0px 0px 1px, rgba(0, 0, 0, 0.08) -8px 12px 22px 0px;

  /* Surfaces */
  --surface-obsidian-canvas: #0f0f10;
  --surface-graphite-layer: #1d1d1f;
  --surface-warm-horizon: #d49065;
  --surface-cream-paper: #f7f3ee;
  --surface-bone-white: #fefef7;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-obsidian-canvas: #0f0f10;
  --color-graphite-layer: #1d1d1f;
  --color-bone-white: #fefef7;
  --color-cream-paper: #f7f3ee;
  --color-ash-border: #b3b3b3;
  --color-slate-mute: #666666;
  --color-cool-steel: #868f97;
  --color-warm-pewter: #86868b;
  --color-pale-mist: #cccccc;
  --color-onyx: #000000;
  --color-bronze-glow: #f2b98b;
  --color-apricot-highlight: #ffaf7c;
  --color-amber-wash: #d49065;

  /* Typography */
  --font-verlag: 'Verlag', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-verlag-condensed: 'Verlag Condensed', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-chronicle-text-g1-roman: 'Chronicle Text G1 Roman', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-system-ui: 'system-ui', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-eyebrow: 10px;
  --leading-eyebrow: 1.1;
  --tracking-eyebrow: 1.67px;
  --text-body: 14px;
  --leading-body: 1.4;
  --text-body-lg: 16px;
  --leading-body-lg: 1.38;
  --text-subheading: 18px;
  --leading-subheading: 1.35;
  --text-heading-sm: 20px;
  --leading-heading-sm: 1.33;
  --text-editorial: 22px;
  --leading-editorial: 1.55;
  --text-display: 48px;
  --leading-display: 1;
  --text-display-lg: 64px;
  --leading-display-lg: 1;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-6: 6px;
  --spacing-7: 7px;
  --spacing-8: 8px;
  --spacing-9: 9px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-14: 14px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-36: 36px;
  --spacing-56: 56px;
  --spacing-64: 64px;
  --spacing-104: 104px;
  --spacing-133: 133px;
  --spacing-140: 140px;

  /* Border Radius */
  --radius-md: 6px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-2xl-2: 20px;
  --radius-3xl: 24px;
  --radius-3xl-2: 36px;

  /* Shadows */
  --shadow-subtle: rgba(0, 0, 0, 0.06) 0px 0px 0px 1px, rgba(0, 0, 0, 0.08) -8px 12px 22px 0px;
}
```
