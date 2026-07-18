# Synthesia — Style Reference
> studio control room on white

**Theme:** light

Synthesia's visual language is a bright, white-canvas SaaS surface saturated with a single vivid indigo-violet accent that acts as electric punctuation against a calm, near-gray neutral stack. Typography carries the brand more than color: a custom geometric sans (Basiersquare) set in tight, aggressively tracked display weights — 88px and 56px headlines run at -0.04 to -0.05em letter-spacing, compressing letterforms into dense, architectural wordmarks. Components are lightweight and honest: 12px-radius buttons, 16-24px-radius cards, hairline borders in #e6eaf4 paired with whisper-soft shadows at 8% opacity, and pill-shaped badges in pale tints. The product metaphor is a 'video studio dashboard behind a clean editor's wall' — mostly white, but with dark indigo panels (#0d0f2c) where the AI video preview lives, creating a stage-light contrast between the marketing surface and the product surface.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Graphite Violet | `#333b52` | `--color-graphite-violet` | Body text, default borders, icon strokes — near-gray with a cool violet undertone carries all secondary content |
| Slate Gray | `#656c86` | `--color-slate-gray` | Muted body text, nav items, secondary button labels |
| Mist | `#969bb5` | `--color-mist` | Placeholder text, disabled input values, tertiary helper text |
| Hairline | `#d1d6e5` | `--color-hairline` | Input borders, dividers, secondary card borders |
| Cloud | `#e6eaf4` | `--color-cloud` | Card borders, soft shadow halos, light dividers — the primary neutral border for product surfaces |
| Paper | `#f5f8ff` | `--color-paper` | Card surface tint, section background wash — barely-there blue-white that warms the canvas without competing with content |
| Pure White | `#ffffff` | `--color-pure-white` | Page canvas, card surfaces, button text, inverted text on dark — the dominant background |
| Indigo Core | `linear-gradient(90deg, rgb(128, 152, 249), rgb(62, 87, 218) 50%, rgb(44, 67, 184))` | `--color-indigo-core` | Primary CTA fill, active nav, key icon accents — the single vivid saturated accent that makes interactive elements feel switched on; Three-stop gradient for CTA hovers, premium dark accents, and feature highlights |
| Indigo Glow | `linear-gradient(90deg, rgb(227, 235, 255), rgb(198, 215, 254) 50%, rgb(128, 152, 249))` | `--color-indigo-glow` | Hover states, gradient midtones, secondary link color — the lighter step of the brand ramp; Three-stop gradient for decorative text effects, hero accents, and section dividers |
| Lavender Mist | `#c6d7fe` | `--color-lavender-mist` | Light gradient start, soft tag fills, decorative wash — the pale end of the violet ramp for backgrounds |
| Midnight Indigo | `#0d0f2c` | `--color-midnight-indigo` | Headlines, dark hero panels, footer — near-black with violet depth, anchors dark sections and high-contrast typography |
| Deep Indigo | `#1f235b` | `--color-deep-indigo` | Badge text on light backgrounds, secondary heading color, dark UI text — a mid-step between midnight indigo and core indigo |
| Forest | `#1a280b` | `--color-forest` | Success badge text, positive state icons |
| Mint Tint | `#ebf6df` | `--color-mint-tint` | Success badge background wash |
| Ember | `#470800` | `--color-ember` | Error badge text, destructive state icons |
| Saffron | `#42230a` | `--color-saffron` | Warning/orange badge text — earthy orange-brown, not a bright alert orange |
| Buttercream | `#fffadb` | `--color-buttercream` | Warning badge background, soft warm highlight surface |
| G2 Coral | `#ff7345` | `--color-g2-coral` | Social proof badge accent (G2 review widget) — a single warm coral that breaks the cool palette for trust signals |

## Tokens — Typography

### Basiersquare Webfont — Single custom geometric sans used for everything from 12px body to 88px display. Weight 400 is the workhorse for body, nav, buttons, and small UI; weight 500 is reserved for headings, bold labels, and emphasis. The custom face's tight apertures and squared geometry are the brand's primary identity — substituting a standard sans will make the site look generic. · `--font-basiersquare-webfont`
- **Substitute:** Inter, Manrope, or DM Sans — all share the geometric, humanist character at similar weights
- **Weights:** 400, 500
- **Sizes:** 12px, 14px, 15px, 16px, 18px, 20px, 28px, 40px, 56px, 88px
- **Line height:** 1.00–1.60 (display: 1.04, body: 1.50, small text: 1.40–1.60)
- **Letter spacing:** Display: -0.05em at 88px, -0.04em at 56px, -0.035em at 40px. Subheading: -0.01em at 28px, -0.008em at 20px, -0.005em at 18px. Body: -0.004em at 16px, -0.002em at 15px. Eyebrow/badge: +0.04em at 12px (the only positive tracking, used for uppercase tags).
- **OpenType features:** `No detected font-feature-settings — Basiersquare runs on default OpenType features`
- **Role:** Single custom geometric sans used for everything from 12px body to 88px display. Weight 400 is the workhorse for body, nav, buttons, and small UI; weight 500 is reserved for headings, bold labels, and emphasis. The custom face's tight apertures and squared geometry are the brand's primary identity — substituting a standard sans will make the site look generic.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.6 | 0.48px | `--text-caption` |
| body-sm | 14px | 1.57 | -0.028px | `--text-body-sm` |
| body | 16px | 1.5 | -0.064px | `--text-body` |
| subheading-sm | 18px | 1.44 | -0.09px | `--text-subheading-sm` |
| subheading | 20px | 1.4 | -0.16px | `--text-subheading` |
| heading-sm | 28px | 1.21 | -0.28px | `--text-heading-sm` |
| heading | 40px | 1.1 | -1.4px | `--text-heading` |
| heading-lg | 56px | 1.04 | -2.24px | `--text-heading-lg` |
| display | 88px | 1 | -4.4px | `--text-display` |

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
| 72 | 72px | `--spacing-72` |
| 80 | 80px | `--spacing-80` |
| 96 | 96px | `--spacing-96` |
| 144 | 144px | `--spacing-144` |
| 168 | 168px | `--spacing-168` |
| 224 | 224px | `--spacing-224` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 16px |
| badges | 999px |
| inputs | 12px |
| avatars | 9999px |
| buttons | 12px |
| avatarsAlt | 15984px |
| largeCards | 24px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| md | `rgba(16, 24, 40, 0.08) 0px 2px 10px 0px, rgb(230, 234, 24...` | `--shadow-md` |
| md-2 | `rgba(16, 24, 40, 0.08) 0px 2px 16px 0px` | `--shadow-md-2` |
| md-3 | `rgba(16, 24, 40, 0.08) 0px 2px 10px 0px` | `--shadow-md-3` |
| subtle | `rgb(209, 214, 229) 0px 0px 0px 1px, rgba(16, 24, 40, 0.08...` | `--shadow-subtle` |
| lg | `rgba(16, 24, 40, 0.08) 0px 6px 20px 0px` | `--shadow-lg` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 24px
- **Element gap:** 16px

## Components

### Primary CTA Button
**Role:** Filled brand action — the single most prominent interactive element on any page

Background: #3e57da (Indigo Core). Text: #ffffff, Basiersquare 500 at 16px. Padding: 12px 18px. Border-radius: 12px. Shadow: 0px 2px 10px rgba(16,24,40,0.08). Arrow icon at 16px inline with text. Hover: deepens to gradient ramp (8098f9 → 3e57da → 2c43b8).

### Secondary Outlined Button
**Role:** Supporting action — paired with the primary CTA but visually subordinate

Background: #ffffff. Text: #0d0f2c (Midnight Indigo), Basiersquare 500 at 16px. Border: 1px solid #d1d6e5. Padding: 12px 18px. Border-radius: 12px. Shadow: 0px 2px 16px rgba(16,24,40,0.08). No arrow icon — minimalism signals lower priority.

### Ghost Text Button
**Role:** Tertiary navigation or inline link — blends into the flow

No background, no border. Text: #3e57da or #333b52, Basiersquare 400 at 15-16px. Underline on hover only. Used for inline links, nav items, and less critical actions.

### Pill Badge / Tag
**Role:** Category labels, feature tags, status indicators

Background: tinted (#f5f8ff, #fffadb, #ffebfc, #ebf6df, #d6fbff, #ffe7e0). Text: matching deep tone (#0d0f2c, #1a280b, #42230a, #26042f, #09202a). Border-radius: 999px (fully rounded). Padding: 4px 12px. Font: Basiersquare 500 at 12px, letter-spacing +0.04em for uppercase. No border, no shadow.

### Social Proof Badge (G2)
**Role:** Trust signal floating above the hero headline

White pill with #e6eaf4 border, 999px radius. Contains a small G2 icon (coral #ff7345), star rating text at 14px Basiersquare 500 in #0d0f2c, and a secondary text line in #656c86 at 12px. Subtle drop shadow at 8% opacity.

### Product Card (Light)
**Role:** Feature cards, template previews, video template tiles

Background: #ffffff. Border: 1px solid #e6eaf4. Border-radius: 16px. Padding: 0 (image fills top) or 24px (text-only variant). Shadow: 0px 2px 16px rgba(16,24,40,0.08). Image inside has 16px top radius matching card. Text content uses #0d0f2c for titles (18-20px) and #656c86 for descriptions (14-15px).

### Feature Highlight Card
**Role:** Section feature blocks with icon + heading + body

No background or border. Icon container: 48px circle in #f5f8ff with indigo icon at 24px. Heading: #0d0f2c, Basiersquare 500 at 20px, -0.16px tracking. Body: #333b52 at 15px. Vertical gap between icon and text: 16px. No card chrome — content breathes on the white canvas.

### Dark Video Preview Panel
**Role:** AI video player or product demo embed — the brand's signature dark surface

Background: #0d0f2c (Midnight Indigo). Border-radius: 16-24px. Contains a video frame, AI avatar, or demo screenshot. Text overlays: white (#ffffff) at 14-18px. Often paired with a lighter control panel on the left (avatar selector, script input) against the same dark fill.

### Tab Navigation Bar
**Role:** Product feature tabs (Create / Edit / Collaborate / Translate / Publish)

Container: #ffffff with #e6eaf4 1px border, 999px radius (pill container). Individual tabs: 12px 18px padding, Basiersquare 500 at 14px. Active tab: #3e57da background, white text. Inactive: #656c86 text on transparent. Smooth transition between active states.

### Avatar Thumbnail
**Role:** AI avatar selection tile, user profile picture

Border-radius: 15984px (full circle). Size: 48-64px. Border: 2px solid #e6eaf4 default; 2px solid #3e57da when selected. Image fills the circle. No shadow.

### Script Input Field
**Role:** Multi-line text input for AI video scripts

Background: #ffffff. Border: 1px solid #d1d6e5. Border-radius: 12px. Padding: 16px. Placeholder: #969bb5 (Mist) at 15px Basiersquare 400. Character counter below: #656c86 at 12px. Focus: border shifts to #3e57da with subtle box-shadow ring.

### Logo Wordmark
**Role:** Brand mark in nav and footer

Icon: stylized geometric mark in #3e57da (Indigo Core) — 32px height. Wordmark 'synthesia' in lowercase, Basiersquare 500 at 20px, #0d0f2c color. Icon and text horizontally aligned with 8px gap.

### Trust Logo Strip
**Role:** Enterprise client logos below the hero

Single row of 6-8 monochrome logos in #333b52 (Graphite Violet) on #ffffff background. Logos are desaturated to near-gray to maintain visual calm. Centered, with a caption above ('Trusted by over 90% of Fortune 100 companies') in #656c86 at 14px. Logos are typically 80-100px wide, 24px gap between.

### Floating Book Demo Widget
**Role:** Persistent conversion CTA anchored bottom-right

Small pill: avatar thumbnail (32px circle) + 'Book demo' text in Basiersquare 500 at 14px, #0d0f2c. Background: #ffffff. Border: 1px solid #e6eaf4. Border-radius: 999px. Shadow: 0px 6px 20px rgba(16,24,40,0.08). Sticky positioned, always visible.

## Do's and Don'ts

### Do
- Use #3e57da (Indigo Core) as the only filled button background — it must remain the single most saturated color on the page to preserve visual hierarchy.
- Set display headlines at 56px or 88px with letter-spacing -0.04em to -0.05em; tighter tracking makes the geometric letterforms feel architectural rather than airy.
- Pair every card with a 1px #e6eaf4 border AND a 2px 16px shadow at 8% opacity — neither alone is sufficient; the border defines the edge, the shadow lifts the surface.
- Use the gradient ramp (e3ebff → c6d7fe → 8098f9) only for decorative text highlights or section dividers, never for functional UI elements.
- Default to 12px radius for all buttons, inputs, and small controls; 16-24px for cards; 999px for pills — the radius scale is the visual rhythm of the system.
- Keep body text in #333b52 (Graphite Violet) — not pure #000000 — the subtle cool undertone ties text to the violet brand palette.
- Set the page max-width at 1200px and center content; hero sections may bleed full-width but text blocks must respect the 1200px container.

### Don't
- Don't introduce additional saturated colors beyond the indigo ramp — the system is deliberately monochromatic with one accent; adding a second brand color dilutes focus.
- Don't use letter-spacing 0 or positive tracking on display text — the negative tracking (-0.04em to -0.05em) is the signature typographic choice that distinguishes this from generic SaaS sites.
- Don't apply shadows to dark surfaces (#0d0f2c panels) — the dark fill is elevation; shadows on dark look muddy and unnecessary.
- Don't use fully rounded (999px) buttons — only badges, tabs, and the floating widget are pill-shaped; buttons are 12px radius to read as actionable, not decorative.
- Don't set text below 14px or above 88px — the type scale is a closed system with 10 steps; interpolating breaks the rhythm.
- Don't use #ffffff text on light card backgrounds or #333b52 text on the dark panel — contrast pairs must be verified: white on #0d0f2c is 18.7:1, but #333b52 on #0d0f2c fails accessibility.
- Don't stack more than two elevation levels on a single screen — the system is flat by design; deep shadow stacks look heavy and conflict with the editorial white-canvas feel.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas | `#ffffff` | Page background — pure white, the default state for all marketing and product surfaces |
| 1 | Cloud Wash | `#f5f8ff` | Section background tint for alternating bands — barely perceptible blue-white that separates content without hard dividers |
| 2 | Card Surface | `#ffffff` | Elevated cards on the canvas — same white but framed with #e6eaf4 hairline border and 2px 16px shadow |
| 3 | Product Panel | `#0d0f2c` | Dark product preview panels (AI video player) — deep midnight indigo that makes the video frame feel like a screen embedded in the page |

## Elevation

- **Card:** `0px 2px 16px 0px rgba(16, 24, 40, 0.08)`
- **Card with border:** `0px 2px 10px 0px rgba(16, 24, 40, 0.08), 0px 0px 0px 1px rgb(230, 234, 244)`
- **Nav / Button / Icon:** `0px 2px 10px 0px rgba(16, 24, 40, 0.08)`
- **Button with border:** `0px 0px 0px 1px rgb(209, 214, 229), 0px 2px 16px 0px rgba(16, 24, 40, 0.08)`
- **Elevated overlay:** `0px 6px 20px 0px rgba(16, 24, 40, 0.08)`

## Imagery

Imagery is product-led, not lifestyle. The visual system is dominated by screenshots of the Synthesia product itself: the video editor interface, avatar selection grids, template galleries, and AI video preview panels embedded in a dark indigo frame. Photography of real people appears only as AI avatar headshots — clean, studio-lit, neutral backgrounds. Abstract graphics are minimal: soft violet gradient washes behind text, a few decorative blob shapes on dark panels. The free demo section embeds a live video player with a human avatar as the hero visual. Logo strips use monochrome wordmarks. Overall: 70% product screenshots, 20% AI avatar photography, 10% abstract gradients — almost no stock lifestyle photography.

## Layout

Layout is a centered 1200px max-width container with full-bleed hero and section bands. The hero pattern is a centered headline stack (eyebrow badge → 88px headline → 18px subtext → CTA pair) over a white canvas, with a large product screenshot or video embed below. Sections alternate between white and #f5f8ff tinted backgrounds, separated by 80px vertical gaps. Feature sections use a 2-column text-left/image-right pattern, occasionally flipping. Social proof appears as a single-row logo strip. Dark product panels (#0d0f2c) are used sparingly — once or twice per page — to create stage-light contrast against the white surface. The free demo section is the signature full-width dark indigo block, spanning edge-to-edge with the video player as the visual anchor. Navigation is a minimal top bar: logo left, center nav links, language switcher + login + 'Get started' CTA right. The floating 'Book demo' widget is sticky bottom-right across all pages.

## Agent Prompt Guide

**Quick Color Reference**
- Text: #333b52 (body), #0d0f2c (headlines)
- Background: #ffffff (canvas), #f5f8ff (section tint), #0d0f2c (dark panel)
- Border: #e6eaf4 (cards), #d1d6e5 (inputs/buttons)
- Accent: #3e57da (Indigo Core — single brand accent)
- primary action: #3e57da (filled action)

**Example Component Prompts**
1. Create a Primary Action Button: #3e57da background, #ffffff text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.

2. *Feature card*: White background, 1px #e6eaf4 border, 16px radius, 0px 2px 16px rgba(16,24,40,0.08) shadow, 24px padding. Icon: 48px circle, #f5f8ff fill, indigo icon. Title: 20px Basiersquare 500, #0d0f2c. Body: 15px weight 400, #333b52.

3. *Dark video preview panel*: Background #0d0f2c, 24px radius, full-bleed. Video frame fills container with 16:9 aspect ratio. Overlay text in white at 14px Basiersquare 400. 'SYNTHESIA DEMO' tag in top-right: 12px Basiersquare 500, #8098f9 on transparent, uppercase.

4. *Pill badge*: Background #fffadb, text #42230a (saffron/brown), Basiersquare 500 at 12px, +0.48px tracking, 4px 12px padding, 999px radius. No border, no shadow.

5. *Script input field*: White background, 1px #d1d6e5 border, 12px radius, 16px padding. Placeholder 'Hey, Alex here!...' in #969bb5 at 15px weight 400. Character counter below: 12px #656c86.

## Gradient System

Two gradient ramps define the decorative color language:

1. **Light ramp** (#e3ebff → #c6d7fe → #8098f9): Used for text highlight effects (e.g., 'AI Video platform' in the hero headline gets a gradient fill), soft section dividers, and decorative washes. This is the 'daylight' version of the brand color.

2. **Deep ramp** (#8098f9 → #3e57da → #2c43b8): Used for CTA hover states, premium feature badges, and dark-accent highlights. This is the 'powered' version — use sparingly to maintain scarcity.

Never apply gradients to body text, borders, or backgrounds of functional UI elements. Gradients are decorative punctuation only.

## Dark Section Protocol

Dark indigo panels (#0d0f2c) are used for video previews and product demos. Rules:
- Never add shadows to dark surfaces
- Text on dark is always #ffffff, not #f5f8ff or #e6eaf4
- Accent elements on dark use #8098f9 (Indigo Glow), not #3e57da which reads as too dark
- Borders on dark are rgba(255,255,255,0.1) hairlines, not neutral grays
- The dark panel should always feel like an embedded screen, not a styled section

## Similar Brands

- **Descript** — Same single-accent strategy with a saturated brand color (Descript's purple) on a white canvas, and similar dark-panel video preview embeds in the hero
- **Runway** — Identical product-led layout with full-width dark video/demo sections breaking up white content bands, and a minimal single-accent color system
- **Notion** — Same near-gray neutrals with a subtle cool tint (not pure gray), generous whitespace, and hairline borders instead of heavy shadows
- **Linear** — Same aggressive negative letter-spacing on display headlines and a single vivid accent color that creates a quiet, premium feel
- **Loom** — Same floating bottom-right conversion widget pattern, product-screenshot-led hero, and white-canvas SaaS layout with a single blue-violet accent

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-graphite-violet: #333b52;
  --color-slate-gray: #656c86;
  --color-mist: #969bb5;
  --color-hairline: #d1d6e5;
  --color-cloud: #e6eaf4;
  --color-paper: #f5f8ff;
  --color-pure-white: #ffffff;
  --color-indigo-core: #3e57da;
  --gradient-indigo-core: linear-gradient(90deg, rgb(128, 152, 249), rgb(62, 87, 218) 50%, rgb(44, 67, 184));
  --color-indigo-glow: #8098f9;
  --gradient-indigo-glow: linear-gradient(90deg, rgb(227, 235, 255), rgb(198, 215, 254) 50%, rgb(128, 152, 249));
  --color-lavender-mist: #c6d7fe;
  --color-midnight-indigo: #0d0f2c;
  --color-deep-indigo: #1f235b;
  --color-forest: #1a280b;
  --color-mint-tint: #ebf6df;
  --color-ember: #470800;
  --color-saffron: #42230a;
  --color-buttercream: #fffadb;
  --color-g2-coral: #ff7345;

  /* Typography — Font Families */
  --font-basiersquare-webfont: 'Basiersquare Webfont', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.6;
  --tracking-caption: 0.48px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.57;
  --tracking-body-sm: -0.028px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.064px;
  --text-subheading-sm: 18px;
  --leading-subheading-sm: 1.44;
  --tracking-subheading-sm: -0.09px;
  --text-subheading: 20px;
  --leading-subheading: 1.4;
  --tracking-subheading: -0.16px;
  --text-heading-sm: 28px;
  --leading-heading-sm: 1.21;
  --tracking-heading-sm: -0.28px;
  --text-heading: 40px;
  --leading-heading: 1.1;
  --tracking-heading: -1.4px;
  --text-heading-lg: 56px;
  --leading-heading-lg: 1.04;
  --tracking-heading-lg: -2.24px;
  --text-display: 88px;
  --leading-display: 1;
  --tracking-display: -4.4px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;

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
  --spacing-72: 72px;
  --spacing-80: 80px;
  --spacing-96: 96px;
  --spacing-144: 144px;
  --spacing-168: 168px;
  --spacing-224: 224px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 24px;
  --element-gap: 16px;

  /* Border Radius */
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-3xl: 24px;
  --radius-full: 80px;
  --radius-full-2: 100px;
  --radius-full-3: 999px;
  --radius-full-4: 15984px;

  /* Named Radii */
  --radius-cards: 16px;
  --radius-badges: 999px;
  --radius-inputs: 12px;
  --radius-avatars: 9999px;
  --radius-buttons: 12px;
  --radius-avatarsalt: 15984px;
  --radius-largecards: 24px;

  /* Shadows */
  --shadow-md: rgba(16, 24, 40, 0.08) 0px 2px 10px 0px, rgb(230, 234, 244) 0px 0px 0px 1px;
  --shadow-md-2: rgba(16, 24, 40, 0.08) 0px 2px 16px 0px;
  --shadow-md-3: rgba(16, 24, 40, 0.08) 0px 2px 10px 0px;
  --shadow-subtle: rgb(209, 214, 229) 0px 0px 0px 1px, rgba(16, 24, 40, 0.08) 0px 2px 16px 0px;
  --shadow-lg: rgba(16, 24, 40, 0.08) 0px 6px 20px 0px;

  /* Surfaces */
  --surface-canvas: #ffffff;
  --surface-cloud-wash: #f5f8ff;
  --surface-card-surface: #ffffff;
  --surface-product-panel: #0d0f2c;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-graphite-violet: #333b52;
  --color-slate-gray: #656c86;
  --color-mist: #969bb5;
  --color-hairline: #d1d6e5;
  --color-cloud: #e6eaf4;
  --color-paper: #f5f8ff;
  --color-pure-white: #ffffff;
  --color-indigo-core: #3e57da;
  --color-indigo-glow: #8098f9;
  --color-lavender-mist: #c6d7fe;
  --color-midnight-indigo: #0d0f2c;
  --color-deep-indigo: #1f235b;
  --color-forest: #1a280b;
  --color-mint-tint: #ebf6df;
  --color-ember: #470800;
  --color-saffron: #42230a;
  --color-buttercream: #fffadb;
  --color-g2-coral: #ff7345;

  /* Typography */
  --font-basiersquare-webfont: 'Basiersquare Webfont', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.6;
  --tracking-caption: 0.48px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.57;
  --tracking-body-sm: -0.028px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.064px;
  --text-subheading-sm: 18px;
  --leading-subheading-sm: 1.44;
  --tracking-subheading-sm: -0.09px;
  --text-subheading: 20px;
  --leading-subheading: 1.4;
  --tracking-subheading: -0.16px;
  --text-heading-sm: 28px;
  --leading-heading-sm: 1.21;
  --tracking-heading-sm: -0.28px;
  --text-heading: 40px;
  --leading-heading: 1.1;
  --tracking-heading: -1.4px;
  --text-heading-lg: 56px;
  --leading-heading-lg: 1.04;
  --tracking-heading-lg: -2.24px;
  --text-display: 88px;
  --leading-display: 1;
  --tracking-display: -4.4px;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-56: 56px;
  --spacing-64: 64px;
  --spacing-72: 72px;
  --spacing-80: 80px;
  --spacing-96: 96px;
  --spacing-144: 144px;
  --spacing-168: 168px;
  --spacing-224: 224px;

  /* Border Radius */
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-3xl: 24px;
  --radius-full: 80px;
  --radius-full-2: 100px;
  --radius-full-3: 999px;
  --radius-full-4: 15984px;

  /* Shadows */
  --shadow-md: rgba(16, 24, 40, 0.08) 0px 2px 10px 0px, rgb(230, 234, 244) 0px 0px 0px 1px;
  --shadow-md-2: rgba(16, 24, 40, 0.08) 0px 2px 16px 0px;
  --shadow-md-3: rgba(16, 24, 40, 0.08) 0px 2px 10px 0px;
  --shadow-subtle: rgb(209, 214, 229) 0px 0px 0px 1px, rgba(16, 24, 40, 0.08) 0px 2px 16px 0px;
  --shadow-lg: rgba(16, 24, 40, 0.08) 0px 6px 20px 0px;
}
```
