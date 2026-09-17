# Portrait — Style Reference
> polaroid memory wall on cream paper. A bright, off-white scrapbook where deep-navy ink provides the only text, the only structural lines, and the only border color — with a single hand-drawn rainbow that appears once, on the Sign up button and on the italicized word forever, and never again.

**Theme:** light

Portrait is a sunlit, deeply personal canvas for identity: a near-white page where a single deep-navy ink carries almost all text and structural lines, and color appears only as warm pastel surface washes or a signature rainbow that bleeds through italicized words, button borders, and small decorative strokes. The type system is two-voice — Switzer for steady UI, Basier Circle for giant display headlines that compress tight against each other — and the geometry favors generous rounding (24px cards, 28px pill buttons) with barely-there shadows that let content float rather than stamp itself. Everything reads like a scrapbook: scattered tilted photo cards, mint and peach and sky-blue tints, a thin rainbow border around the Sign up button, and a sticky pill nav that hovers above the page with a whisper of elevation. The overall density is comfortable, the rhythm is calm, and the brand voice is warm but restrained — let the user be loud, keep the frame quiet.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Portrait Ink | `#08304c` | `--color-portrait-ink` | Primary text, heading strokes, outlined action borders — the single deep navy that holds the entire type and structural line system |
| Nautical Teal | `#084e72` | `--color-nautical-teal` | Secondary brand ink for nav strokes, icons, and accent text where Ink feels too heavy |
| Rainbow Spectrum | `linear-gradient(90deg, rgb(38, 192, 255), rgb(230, 0, 194) 20%, rgb(255, 73, 78) 40%, rgb(255, 161, 62) 60%, rgb(255, 200, 55) 80%, rgb(0, 204, 61))` | `--color-rainbow-spectrum` | Supporting palette color for small decorative accents when the core palette needs contrast. Do not promote it to the primary CTA color |
| Lavender Violet | `#8e51ff` | `--color-lavender-violet` | Decorative spectrum color — appears only as part of the rainbow gradient, never as a standalone fill |
| Cobalt Pop | `#3b82f6` | `--color-cobalt-pop` | Decorative spectrum color — appears only as part of the rainbow gradient composition |
| Grape Vibrant | `#ad46ff` | `--color-grape-vibrant` | Decorative spectrum color — appears only as part of the rainbow gradient composition |
| Cherry Red | `#ff4940` | `--color-cherry-red` | Decorative spectrum color — appears only as part of the rainbow gradient composition |
| Tangerine Warm | `#ffa130` | `--color-tangerine-warm` | Decorative spectrum color — appears only as part of the rainbow gradient composition |
| Sunflower Yellow | `#ffc837` | `--color-sunflower-yellow` | Decorative spectrum color — appears only as part of the rainbow gradient composition |
| Leaf Green | `#00cc3d` | `--color-leaf-green` | Decorative spectrum color — appears only as part of the rainbow gradient composition |
| Charcoal Outline | `#353535` | `--color-charcoal-outline` | Universal stroke and heavy text color — every hairline border, icon outline, and default UI line lives here |
| Graphite Body | `#2c2c2c` | `--color-graphite-body` | Body text and icon strokes where Portrait Ink feels too cool — slightly warmer reading tone |
| Slate Helper | `#797979` | `--color-slate-helper` | Muted helper text, secondary nav text, and decorative borders that should recede behind primary ink |
| Iron Quiet | `#585858` | `--color-iron-quiet` | Quiet icon strokes and low-emphasis nav accents |
| Ash Divider | `#dedede` | `--color-ash-divider` | Light dividers and structural hairlines on neutral surfaces |
| Fog Edge | `#c7c7c7` | `--color-fog-edge` | Disabled state borders and placeholder strokes |
| Mist Hairline | `#eeeeee` | `--color-mist-hairline` | Card surface tint and the lightest possible structural divider |
| White Canvas | `#ffffff` | `--color-white-canvas` | Page background and the universal surface above which all color floats |
| Mint Wash | `#d7ffe2` | `--color-mint-wash` | Soft pastel surface tint used on badge chips and small highlighted areas |
| Sky Wash | `#e8f1ff` | `--color-sky-wash` | Soft section background, alternate surface, and quiet card fill |
| Peach Wash | `#ffebd6` | `--color-peach-wash` | Soft pastel surface tint used on warm-accent chips and highlighted areas |

## Tokens — Typography

### Switzer — Universal body and UI face — paragraphs, buttons, nav, links, tags, helper text, and small display moments. Reads neutral, geometric, and friendly. The 0.14em tracked all-caps variant at 10–11px is reserved for tiny eyebrow labels and New badges. · `--font-switzer`
- **Substitute:** Inter, Manrope, or General Sans
- **Weights:** 400, 500, 540, 600, 700
- **Sizes:** 10, 11, 12, 14, 16, 18, 20, 24, 36px
- **Line height:** 1.00–1.50
- **Letter spacing:** 0.0250em at small sizes, 0.1400em for all-caps eyebrow labels
- **OpenType features:** `"liga" 0`
- **Role:** Universal body and UI face — paragraphs, buttons, nav, links, tags, helper text, and small display moments. Reads neutral, geometric, and friendly. The 0.14em tracked all-caps variant at 10–11px is reserved for tiny eyebrow labels and New badges.

### Basier Circle — Headline and hero voice only — reserved for the largest statements and key brand moments. The dramatic negative tracking at 76px (about -4.25px) pulls characters together so multi-line headlines lock into a tight block rather than a loose stack. Mixed with Switzer for subhead and body. · `--font-basier-circle`
- **Substitute:** Plus Jakarta Sans, General Sans, or Satoshi
- **Weights:** 500, 600
- **Sizes:** 16, 18, 20, 31, 39, 44, 49, 76px
- **Line height:** 1.00–1.20
- **Letter spacing:** -0.056em at 76px down to -0.013em at 16px — the display type breathes in by nearly 4px at the largest size
- **Role:** Headline and hero voice only — reserved for the largest statements and key brand moments. The dramatic negative tracking at 76px (about -4.25px) pulls characters together so multi-line headlines lock into a tight block rather than a loose stack. Mixed with Switzer for subhead and body.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 10px | 1.5 | 1.4px | `--text-caption` |
| body | 16px | 1.5 | — | `--text-body` |
| body-lg | 18px | 1.45 | — | `--text-body-lg` |
| subheading | 20px | 1.43 | -0.26px | `--text-subheading` |
| heading-sm | 31px | 1.1 | -0.4px | `--text-heading-sm` |
| heading | 44px | 1.08 | -1.15px | `--text-heading` |
| heading-lg | 49px | 1.04 | -1.96px | `--text-heading-lg` |
| display | 76px | 1 | -4.25px | `--text-display` |

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
| 20 | 20px | `--spacing-20` |
| 24 | 24px | `--spacing-24` |
| 28 | 28px | `--spacing-28` |
| 32 | 32px | `--spacing-32` |
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |
| 56 | 56px | `--spacing-56` |
| 64 | 64px | `--spacing-64` |
| 80 | 80px | `--spacing-80` |
| 128 | 128px | `--spacing-128` |
| 144 | 144px | `--spacing-144` |
| 160 | 160px | `--spacing-160` |

### Border Radius

| Element | Value |
|---------|-------|
| nav | 28px |
| tags | 9999px |
| cards | 24px |
| images | 24px |
| inputs | 16px |
| buttons | 28px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| md | `rgba(0, 0, 0, 0.03) 0px 16px 16px -8px, rgba(0, 0, 0, 0.0...` | `--shadow-md` |
| subtle | `oklab(0 0 0 / 0.08) 0px 0px 0px 1px, rgba(0, 0, 0, 0.03) ...` | `--shadow-subtle` |
| subtle-2 | `oklab(0 0 0 / 0.04) 0px 0px 0px 1px, rgba(0, 0, 0, 0.03) ...` | `--shadow-subtle-2` |
| subtle-3 | `oklab(0 0 0 / 0.06) 0px 0px 0px 1px, rgba(0, 0, 0, 0.07) ...` | `--shadow-subtle-3` |
| subtle-4 | `oklab(0 0 0 / 0.1) 0px 0px 0px 1px, rgba(0, 0, 0, 0.04) 1...` | `--shadow-subtle-4` |
| subtle-5 | `oklab(0 0 0 / 0.1) 0px 0px 0px 1px` | `--shadow-subtle-5` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 16px
- **Element gap:** 16px

## Components

### Floating Pill Nav
**Role:** Primary site navigation

White pill-shaped bar, 28px radius, floating centered above the page with a soft 6-layer shadow. Contains the Portrait wordmark with a tiny rainbow square icon, a center 'New — Introducing Portrait Wallet' announcement pill, and Login + Sign up actions on the right. Height approximately 56px, horizontal padding 20px.

### Rainbow Outline CTA
**Role:** Primary sign-up action

Pill button, 28px radius, transparent fill, 1.5px rainbow-gradient border (blue → magenta → red → orange → yellow → green at 90deg). Text in Portrait Ink (#08304c), 16px Switzer 500, 16px horizontal padding by 10px vertical. The most visible branded element on the page.

### Ghost Text Button
**Role:** Secondary nav and inline action

No background, no border. Text in Portrait Ink, 14–16px Switzer 500. Used for Login and 'Already have a Portrait? Login'. Sits quietly next to the rainbow CTA.

### Domain Search Input
**Role:** URL claim field in hero

Large pill input, ~9999px radius, white fill with a very faint border. 60–64px tall, ~600px wide. Contains light gray 'portrait.so/' prefix text and a darker typed username. Internal border-radius nested with the rainbow CTA inside it, so the two share one continuous border line.

### Photo Profile Card
**Role:** Tile showing a user piece — photo, link card, or article preview

White card, 24px radius, 1px oklab outline at 4% opacity, optional soft multi-layer shadow. Contains an image area with 24px top radius, a title in Portrait Ink, a short meta line in Slate Helper, and sometimes a small external-link arrow. Padding 16px on text areas. Tiles appear in a varied grid — some taller (2:3 portrait), some wider (16:9).

### Article Snippet Card
**Role:** Linked blog or note preview

White card, 24px radius, 1px outline. Compact horizontal layout: small square thumbnail, a date in Slate Helper at 12px, a two-line headline in Portrait Ink at 14–16px Switzer 500, and a Read more link with an external arrow. Tight 12–16px internal padding.

### Eyebrow Label Pill
**Role:** Small status or category tag

Tiny pill, 9999px radius, one of the pastel wash backgrounds (#d7ffe2, #e8f1ff, #ffebd6). Text in matching darker tone, 10–11px Switzer 600 with 0.14em tracking, uppercase. Used for 'New', 'Early access', and category labels. 3px vertical, 8px horizontal padding.

### Wallet Feature Card
**Role:** Product feature preview for Portrait Wallet

Small horizontal card with the wallet card thumbnail on the left, 'Portrait Wallet' title, a 'New' pill in pastel, and 'Get early access now' helper text. Right arrow icon in Charcoal Outline. White background, 16–24px radius, subtle outline.

### Display Headline Block
**Role:** Hero and section headlines

Basier Circle 600 at 44–76px, line-height 1.0–1.08, negative letter-spacing up to -4.25px. Portrait Ink color. One italicized word inside the headline is filled with the rainbow gradient (currently 'forever' and 'one'). The compression of the type makes the block feel like a single sculptural mass.

### Hero Photo Collage
**Role:** Scattered photo tiles around the hero headline

Individual photo cards at varied sizes, each 24px radius, tilted at 3–6 degrees, partially overlapping page edges. No drop shadow — they read as Polaroids pressed flat against the canvas with the same 1px hairline outline. White background bleeds through any rotation gap.

### Announcement Pill
**Role:** In-nav promotional badge

Small pill inside the floating nav, sky-blue (#e8f1ff) background, 'New' label in pastel ink, followed by 'Introducing Portrait Wallet' in Portrait Ink, and a tiny down-arrow icon. 6–8px vertical padding, 12px horizontal.

### Hero Subtext
**Role:** Supporting paragraph below the display headline

Switzer 400 at 18px, line-height 1.45, Portrait Ink or Graphite Body. Centered, max-width approximately 520px, sits 24–32px below the headline block.

## Do's and Don'ts

### Do
- Use the full-spectrum linear-gradient (blue → magenta → red → orange → yellow → green at 90deg) as a 1.5px outline on at most one CTA per view, and on at most one italicized word per headline.
- Set body type in Switzer 400 at 16–18px with 1.45–1.5 line-height; reserve Basier Circle for display sizes 31px and above.
- Pull the headline tracking tight: -4.25px at 76px, -1.96px at 49px, -1.15px at 44px. The compression is what makes the display feel sculptural.
- Use Portrait Ink (#08304c) as the single text and structural-line color across the entire interface; switch to Graphite Body (#2c2c2c) only for body copy that sits on a warm or pastel background.
- Cap every shadow at 8% black opacity, and stack 3–6 thin layers with negative offsets rather than a single heavy drop. Add a 1px oklab hairline at 4–10% opacity instead of a shadow when the surface needs separation.
- Use 24px radius for cards, 28px radius for buttons, 9999px for tags and small chips. The card/button differential is deliberate — buttons are slightly rounder than the cards they sit on.
- Keep the page canvas pure white (#ffffff) and let color appear only as soft pastel washes on small surfaces, never as a full section background.

### Don't
- Do not introduce a new brand hue — the palette is two navy inks plus a single rainbow gradient. Any additional chromatic color dilutes the signature.
- Do not use filled colored buttons. The primary action is always a rainbow-outlined pill; secondary actions are ghost text only.
- Do not add heavy drop shadows. A shadow darker than rgba(0,0,0,0.1) breaks the paper-on-paper language.
- Do not set body or display type in the rainbow gradient. The gradient is reserved for borders and one italicized word per headline — full-text rainbow reads as a different brand entirely.
- Do not mix Switzer and Basier Circle at the same size. Switzer owns 10–24px, Basier Circle owns 31px and up. Same-size mixing looks like a font fallback error.
- Do not use a sans-serif fallback for Basier Circle's negative tracking. The compression is the brand — only a geometric humanist with matching proportions should substitute.
- Do not center-align body paragraphs longer than three lines; the centered hero subtext is a one-off compositional choice, not a layout default.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Canvas | `#ffffff` | Page background — the warm white paper the entire scrapbook sits on |
| 2 | Card | `#ffffff` | Photo cards, profile tiles, and content cards float on white with a barely-perceptible 1px outline |
| 3 | Sticky Nav | `#ffffff` | Floating pill navigation bar — same white as the canvas but elevated by a soft shadow |
| 4 | Tinted Wash | `#e8f1ff` | Pale sky-blue background for highlighted nav items, info chips, and soft category badges |

## Elevation

- **Floating Nav Bar:** `0 16px 16px -8px rgba(0,0,0,0.03), 0 10px 10px -5px rgba(0,0,0,0.03), 0 5px 5px -2.5px rgba(0,0,0,0.03), 0 3px 3px -1.5px rgba(0,0,0,0.03), 0 2px 2px -1px rgba(0,0,0,0.03), 0 1px 1px -0.5px rgba(0,0,0,0.03)`
- **Profile Card:** `0 0 0 1px oklab(0 0 0 / 0.08), 0 16px 16px -8px rgba(0,0,0,0.03), 0 10px 10px -5px rgba(0,0,0,0.03), 0 5px 5px -2.5px rgba(0,0,0,0.03), 0 3px 3px -1.5px rgba(0,0,0,0.03), 0 2px 2px -1px rgba(0,0,0,0.03), 0 1px 1px -0.5px rgba(0,0,0,0.03)`
- **Elevated Card:** `0 0 0 1px oklab(0 0 0 / 0.06), 0 20px 20px -10px rgba(0,0,0,0.07), 0 10px 10px -5px rgba(0,0,0,0.04), 0 5px 5px -2.5px rgba(0,0,0,0.03), 0 3px 3px -1.5px rgba(0,0,0,0.03), 0 2px 2px -1px rgba(0,0,0,0.03), 0 1px 1px -0.5px rgba(0,0,0,0.03)`

## Imagery

Imagery is photographic, full-bleed inside Polaroid-style cards, and treated as personal memorabilia rather than product shots: outdoor portraits, candid smiles, golden retriever in a meadow, friends at a restaurant, a person on a cliffside, gap-year Indonesia travel, smoothies in a green cup. Every photo is cropped tight on its subject, sits inside a 24px-radius card with a 1px hairline outline, and floats at a slight rotation in the hero collage. No illustrations, no 3D renders, no abstract graphics. The only product visual is the orange leather wallet card mock in the Wallet section. Color treatment is natural and unfiltered — slightly warm, slightly soft, with the kind of color cast you get from a phone camera in golden hour. The orange wallet and the dark green smoothie are the only images that carry strong saturated color; everything else is desaturated enough to recede behind the rainbow accent.

## Layout

Centered, max-width 1200px contained layout with generous breathing room. The hero is a single centered stack: eyebrow text → 2–3 line display headline with one rainbow-italicized word → subtext paragraph → domain search input with embedded rainbow CTA → login link. Tilted photo cards scatter around the hero edges, partially cropped by the viewport, as if pinned to a wall. Below the hero, a profile card grid (masonry-like, 2–4 columns) shows the user's tiles at varied aspect ratios — portrait photos, horizontal link cards, article snippets. Sections are separated by 80px vertical gaps with no dividers or alternating background bands; the entire page is one continuous white canvas. A sticky floating pill nav hovers at the top, centered, with a soft drop shadow. A final 'Portrait Wallet' promotion card sits centered at the bottom of the page as a standalone product teaser. Navigation is the pill nav only — no sidebar, no mega-menu, no footer beyond minimal links.

## Agent Prompt Guide

**Quick Color Reference**
- text: #08304c (Portrait Ink)
- background: #ffffff
- border: #353535 (Charcoal Outline) at 1px, or pastel wash on chips
- accent: rainbow gradient — linear-gradient(90deg, #26c0ff, #e600c2 20%, #ff4940 40%, #ffa130 60%, #ffc837 80%, #00cc3d)
- pastel washes: #d7ffe2, #e8f1ff, #ffebd6
- primary action: #08304c (outlined action border)

**Example Component Prompts**

1. Create a hero headline: 76px Basier Circle weight 600, line-height 1.0, letter-spacing -4.25px, color #08304c. Insert the italicized word 'forever' and fill it with the rainbow linear-gradient(90deg, #26c0ff, #e600c2 20%, #ff4940 40%, #ffa130 60%, #ffc837 80%, #00cc3d). Center the block at max-width 900px.

2. Create a rainbow-outline pill button: 28px border-radius, transparent background, 1.5px border using the full rainbow gradient (90deg, six stops), 16px Switzer 500 text in #08304c, padding 10px 18px. The only saturated UI action in the system.

3. Create a photo profile card: white surface, 24px border-radius, 1px outline in oklab(0 0 0 / 0.04), padding 0 on the image (16px on text), Basier Circle or Switzer 500 title in #08304c at 16px, Slate Helper (#797979) meta line at 12px Switzer 400, optional 10px 16px 14px shadow at rgba(0,0,0,0.04).

4. Create a pastel eyebrow pill: 9999px radius, #e8f1ff background, text 'New' in matching darker tone at 10px Switzer 600 uppercase with 0.14em letter-spacing, 3px vertical and 8px horizontal padding.

5. Create a floating sticky nav: 28px radius, white background, soft 6-layer shadow capped at 3% opacity each, 56px height, 20px horizontal padding. Contains a small rainbow square icon + 'Portrait' wordmark, a center 'New — Introducing Portrait Wallet' pill, and a Login ghost link + a rainbow-outline Sign up pill on the right.

## Gradient System

Portrait uses exactly one signature gradient — the full-spectrum rainbow — and reuses it across three contexts only:

1. A 1.5px border on the primary Sign up button (90deg, evenly spaced from blue to green).
2. A text fill on at most one italicized word per headline (90deg, same stops).
3. A tiny 8–12px square brand icon next to the wordmark (90deg, same stops).

A second, much rarer gradient appears on the Wallet card mock — a 165–170deg spectrum used to simulate light bending across the leather texture, with a dark navy segment splitting the rainbow into two halves. This is product-specific, not a system token.

A single soft radial gradient (lavender at 78% → 44% → transparent) appears once on a hero background, used to create a subtle warm-cool falloff behind the headline. Do not reuse it elsewhere.

## Iconography

Icons are 1.5–2px stroke, rounded line caps, drawn from a single outlined set. Color is Charcoal Outline (#353535) by default, Portrait Ink (#08304c) when sitting on a pastel wash, and white when on a dark surface. No filled icons, no multicolor icons, no icons that mimic the rainbow. The only 'iconic' brand mark is the 8–12px square rainbow gradient swatch used as the Portrait favicon, nav mark, and tab indicator.

## Similar Brands

- **Linktree** — Same centered hero with a domain-claim input as the primary action, scattered card grid below, and a single CTA on each screen
- **Bento** — Same scrapbook-card aesthetic with varied tile aspect ratios, tight hairline outlines, and one accent hue driving the brand
- **Read.cv** — Same restrained two-voice type system, generous card radii, and warm off-white canvas treating the page as a personal portfolio
- **Candy Mail** — Same playful use of a single rainbow gradient as the only saturated accent on a calm, light, type-led interface

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-portrait-ink: #08304c;
  --color-nautical-teal: #084e72;
  --color-rainbow-spectrum: #26c0ff;
  --gradient-rainbow-spectrum: linear-gradient(90deg, rgb(38, 192, 255), rgb(230, 0, 194) 20%, rgb(255, 73, 78) 40%, rgb(255, 161, 62) 60%, rgb(255, 200, 55) 80%, rgb(0, 204, 61));
  --color-lavender-violet: #8e51ff;
  --color-cobalt-pop: #3b82f6;
  --color-grape-vibrant: #ad46ff;
  --color-cherry-red: #ff4940;
  --color-tangerine-warm: #ffa130;
  --color-sunflower-yellow: #ffc837;
  --color-leaf-green: #00cc3d;
  --color-charcoal-outline: #353535;
  --color-graphite-body: #2c2c2c;
  --color-slate-helper: #797979;
  --color-iron-quiet: #585858;
  --color-ash-divider: #dedede;
  --color-fog-edge: #c7c7c7;
  --color-mist-hairline: #eeeeee;
  --color-white-canvas: #ffffff;
  --color-mint-wash: #d7ffe2;
  --color-sky-wash: #e8f1ff;
  --color-peach-wash: #ffebd6;

  /* Typography — Font Families */
  --font-switzer: 'Switzer', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-basier-circle: 'Basier Circle', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.5;
  --tracking-caption: 1.4px;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-body-lg: 18px;
  --leading-body-lg: 1.45;
  --text-subheading: 20px;
  --leading-subheading: 1.43;
  --tracking-subheading: -0.26px;
  --text-heading-sm: 31px;
  --leading-heading-sm: 1.1;
  --tracking-heading-sm: -0.4px;
  --text-heading: 44px;
  --leading-heading: 1.08;
  --tracking-heading: -1.15px;
  --text-heading-lg: 49px;
  --leading-heading-lg: 1.04;
  --tracking-heading-lg: -1.96px;
  --text-display: 76px;
  --leading-display: 1;
  --tracking-display: -4.25px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-w540: 540;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-28: 28px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-56: 56px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-128: 128px;
  --spacing-144: 144px;
  --spacing-160: 160px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 16px;
  --element-gap: 16px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-2xl-2: 20px;
  --radius-3xl: 24px;
  --radius-3xl-2: 28px;
  --radius-3xl-3: 32px;

  /* Named Radii */
  --radius-nav: 28px;
  --radius-tags: 9999px;
  --radius-cards: 24px;
  --radius-images: 24px;
  --radius-inputs: 16px;
  --radius-buttons: 28px;

  /* Shadows */
  --shadow-md: rgba(0, 0, 0, 0.03) 0px 16px 16px -8px, rgba(0, 0, 0, 0.03) 0px 10px 10px -5px, rgba(0, 0, 0, 0.03) 0px 5px 5px -2.5px, rgba(0, 0, 0, 0.03) 0px 3px 3px -1.5px, rgba(0, 0, 0, 0.03) 0px 2px 2px -1px, rgba(0, 0, 0, 0.03) 0px 1px 1px -0.5px;
  --shadow-subtle: oklab(0 0 0 / 0.08) 0px 0px 0px 1px, rgba(0, 0, 0, 0.03) 0px 16px 16px -8px, rgba(0, 0, 0, 0.03) 0px 10px 10px -5px, rgba(0, 0, 0, 0.03) 0px 5px 5px -2.5px, rgba(0, 0, 0, 0.03) 0px 3px 3px -1.5px, rgba(0, 0, 0, 0.03) 0px 2px 2px -1px, rgba(0, 0, 0, 0.03) 0px 1px 1px -0.5px;
  --shadow-subtle-2: oklab(0 0 0 / 0.04) 0px 0px 0px 1px, rgba(0, 0, 0, 0.03) 0px 16px 16px -8px, rgba(0, 0, 0, 0.03) 0px 10px 10px -5px, rgba(0, 0, 0, 0.03) 0px 5px 5px -2.5px, rgba(0, 0, 0, 0.03) 0px 3px 3px -1.5px, rgba(0, 0, 0, 0.03) 0px 2px 2px -1px, rgba(0, 0, 0, 0.03) 0px 1px 1px -0.5px;
  --shadow-subtle-3: oklab(0 0 0 / 0.06) 0px 0px 0px 1px, rgba(0, 0, 0, 0.07) 0px 20px 20px -10px, rgba(0, 0, 0, 0.04) 0px 10px 10px -5px, rgba(0, 0, 0, 0.03) 0px 5px 5px -2.5px, rgba(0, 0, 0, 0.03) 0px 3px 3px -1.5px, rgba(0, 0, 0, 0.03) 0px 2px 2px -1px, rgba(0, 0, 0, 0.03) 0px 1px 1px -0.5px;
  --shadow-subtle-4: oklab(0 0 0 / 0.1) 0px 0px 0px 1px, rgba(0, 0, 0, 0.04) 10px 16px 14px 0px;
  --shadow-subtle-5: oklab(0 0 0 / 0.1) 0px 0px 0px 1px;

  /* Surfaces */
  --surface-canvas: #ffffff;
  --surface-card: #ffffff;
  --surface-sticky-nav: #ffffff;
  --surface-tinted-wash: #e8f1ff;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-portrait-ink: #08304c;
  --color-nautical-teal: #084e72;
  --color-rainbow-spectrum: #26c0ff;
  --color-lavender-violet: #8e51ff;
  --color-cobalt-pop: #3b82f6;
  --color-grape-vibrant: #ad46ff;
  --color-cherry-red: #ff4940;
  --color-tangerine-warm: #ffa130;
  --color-sunflower-yellow: #ffc837;
  --color-leaf-green: #00cc3d;
  --color-charcoal-outline: #353535;
  --color-graphite-body: #2c2c2c;
  --color-slate-helper: #797979;
  --color-iron-quiet: #585858;
  --color-ash-divider: #dedede;
  --color-fog-edge: #c7c7c7;
  --color-mist-hairline: #eeeeee;
  --color-white-canvas: #ffffff;
  --color-mint-wash: #d7ffe2;
  --color-sky-wash: #e8f1ff;
  --color-peach-wash: #ffebd6;

  /* Typography */
  --font-switzer: 'Switzer', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-basier-circle: 'Basier Circle', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.5;
  --tracking-caption: 1.4px;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-body-lg: 18px;
  --leading-body-lg: 1.45;
  --text-subheading: 20px;
  --leading-subheading: 1.43;
  --tracking-subheading: -0.26px;
  --text-heading-sm: 31px;
  --leading-heading-sm: 1.1;
  --tracking-heading-sm: -0.4px;
  --text-heading: 44px;
  --leading-heading: 1.08;
  --tracking-heading: -1.15px;
  --text-heading-lg: 49px;
  --leading-heading-lg: 1.04;
  --tracking-heading-lg: -1.96px;
  --text-display: 76px;
  --leading-display: 1;
  --tracking-display: -4.25px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-28: 28px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-56: 56px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-128: 128px;
  --spacing-144: 144px;
  --spacing-160: 160px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-2xl-2: 20px;
  --radius-3xl: 24px;
  --radius-3xl-2: 28px;
  --radius-3xl-3: 32px;

  /* Shadows */
  --shadow-md: rgba(0, 0, 0, 0.03) 0px 16px 16px -8px, rgba(0, 0, 0, 0.03) 0px 10px 10px -5px, rgba(0, 0, 0, 0.03) 0px 5px 5px -2.5px, rgba(0, 0, 0, 0.03) 0px 3px 3px -1.5px, rgba(0, 0, 0, 0.03) 0px 2px 2px -1px, rgba(0, 0, 0, 0.03) 0px 1px 1px -0.5px;
  --shadow-subtle: oklab(0 0 0 / 0.08) 0px 0px 0px 1px, rgba(0, 0, 0, 0.03) 0px 16px 16px -8px, rgba(0, 0, 0, 0.03) 0px 10px 10px -5px, rgba(0, 0, 0, 0.03) 0px 5px 5px -2.5px, rgba(0, 0, 0, 0.03) 0px 3px 3px -1.5px, rgba(0, 0, 0, 0.03) 0px 2px 2px -1px, rgba(0, 0, 0, 0.03) 0px 1px 1px -0.5px;
  --shadow-subtle-2: oklab(0 0 0 / 0.04) 0px 0px 0px 1px, rgba(0, 0, 0, 0.03) 0px 16px 16px -8px, rgba(0, 0, 0, 0.03) 0px 10px 10px -5px, rgba(0, 0, 0, 0.03) 0px 5px 5px -2.5px, rgba(0, 0, 0, 0.03) 0px 3px 3px -1.5px, rgba(0, 0, 0, 0.03) 0px 2px 2px -1px, rgba(0, 0, 0, 0.03) 0px 1px 1px -0.5px;
  --shadow-subtle-3: oklab(0 0 0 / 0.06) 0px 0px 0px 1px, rgba(0, 0, 0, 0.07) 0px 20px 20px -10px, rgba(0, 0, 0, 0.04) 0px 10px 10px -5px, rgba(0, 0, 0, 0.03) 0px 5px 5px -2.5px, rgba(0, 0, 0, 0.03) 0px 3px 3px -1.5px, rgba(0, 0, 0, 0.03) 0px 2px 2px -1px, rgba(0, 0, 0, 0.03) 0px 1px 1px -0.5px;
  --shadow-subtle-4: oklab(0 0 0 / 0.1) 0px 0px 0px 1px, rgba(0, 0, 0, 0.04) 10px 16px 14px 0px;
  --shadow-subtle-5: oklab(0 0 0 / 0.1) 0px 0px 0px 1px;
}
```
