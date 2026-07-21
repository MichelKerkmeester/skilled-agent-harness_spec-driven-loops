# Pitch — Style Reference
> violet stage spotlight on white. A deep purple gradient floods the hero like theater lighting, then the page steps down into a clean, flat slate workspace where one bright violet does all the work.

**Theme:** light

Pitch is a stage-lit productivity platform: the hero floods with a vivid violet gradient like theatrical lighting, then the rest of the page settles into a clean slate-and-white workspace where color is rationed to functional punctuation. Typography pairs a wide-tracked geometric sans (Eina01) for UI with a heavy, tightly-tracked display sans (Mark Pro) for headlines — the two voices create a clear hierarchy between product surface and marketing voice. Surfaces are flat white with soft, low-opacity shadows; the violet (#6b53ff) carries every action and brand mark, a single warm yellow (#ffd02c) injects energy accents, and a near-black charcoal (#2b2a35) does the heavy lifting for text. Components are compact and confident — pill buttons, small radii (6–20px), tight 20px padding, and a deliberate absence of decoration. The page rhythm alternates between immersive dark-violet full-bleed bands and bright content sections, producing a theatrical pacing from spectacle to substance.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Signal Violet | `#6b53ff` | `--color-signal-violet` | Violet supporting accent for decorative details and low-frequency emphasis. Do not promote it to the primary CTA color |
| Lighter Violet | `#8d49f7` | `--color-lighter-violet` | Secondary brand accent, gradient highlight stops, icon fills, decorative violet washes — a brighter cousin used when Signal Violet would feel too heavy |
| Deep Indigo | `#371789` | `--color-deep-indigo` | Dark brand text, deep gradient end-stops, footer/marketing accent on white sections — the shadow side of the violet family |
| Solar Yellow | `linear-gradient(90deg, #ffd02c, #ff9e2c)` | `--color-solar-yellow` | Energy accent — slide preview highlights, decorative bursts, gradient start, illustration fills. Used sparingly as visual punctuation, never as a functional color; Warm accent gradient — linear-gradient(90deg, #ffd02c, #ff9e2c) for decorative bursts and illustration gradients |
| Ember Orange | `#ffa000` | `--color-ember-orange` | Orange supporting accent for decorative details and low-frequency emphasis. Do not promote it to the primary CTA color |
| Slate Ink | `#2b2a35` | `--color-slate-ink` | Primary text, heading text, icon strokes, dark surface fill — the dominant achromatic doing all reading work (1,700+ occurrences) |
| Carbon | `#1e1d28` | `--color-carbon` | Secondary dark text, card text on light surfaces — a step lighter than Slate Ink for subordinate copy |
| Steel | `#3f4250` | `--color-steel` | Muted body text, secondary headings, dark-mode support text |
| Fog | `#6f7387` | `--color-fog` | Supporting neutral for secondary UI, dividers, and muted labels. |
| Ash | `#95959a` | `--color-ash` | Tertiary borders, subtle dividers, light-mode shadow tint at low opacity |
| Mist | `#dddfe5` | `--color-mist` | Hairline borders, card outlines, button shadows — the lightest visible structural line |
| Marble | `#f0eff4` | `--color-marble` | Page canvas background — slightly cooler than pure white, sets product sections apart from card surfaces |
| Paper | `#ffffff` | `--color-paper` | Light supporting surface for subtle backgrounds and section separation. Do not promote it to the primary CTA color |
| Shadow Violet | `#0a0359` | `--color-shadow-violet` | Deep shadow color tinted violet (rgba 0.3) — appears only in the hero card's large ambient shadow, giving elevation an on-brand cool cast |
| Hero Stage | `linear-gradient(90deg, rgb(83, 24, 235), rgb(171, 110, 249))` | `--color-hero-stage` | Primary hero gradient end-stop — linear gradient(90deg, #5718eb, #ab6ef9) fills the entire first screen behind the headline |

## Tokens — Typography

### Eina01 — Primary UI and body font. Used for navigation, buttons, body copy, list items, badges, and subheadings up to 28px. Its signature is a wide +0.1em letter-spacing applied consistently — this airiness gives the UI a measured, deliberate pace rather than dense SaaS compression. Substitute: Inter or Manrope (both geometric sans with similar x-height). · `--font-eina01`
- **Substitute:** Inter
- **Weights:** 400, 600, 700, 800
- **Sizes:** 13, 14, 15, 16, 18, 22, 24, 28
- **Line height:** 1.2–1.6
- **Letter spacing:** 0.1em
- **Role:** Primary UI and body font. Used for navigation, buttons, body copy, list items, badges, and subheadings up to 28px. Its signature is a wide +0.1em letter-spacing applied consistently — this airiness gives the UI a measured, deliberate pace rather than dense SaaS compression. Substitute: Inter or Manrope (both geometric sans with similar x-height).

### Mark Pro — Display and headline font only. Used for hero headlines (60–80px), section headings (42px), and small uppercase labels (13px). The display sizes carry tight negative tracking (-0.02em at 60–80px, -0.01em at 27–28px) that contrasts with Eina01's openness — the two fonts create a deliberate tight/wide duality. Substitute: Söhne (closest match) or Inter at heavy weight. · `--font-mark-pro`
- **Substitute:** Söhne
- **Weights:** 700, 800
- **Sizes:** 13, 27, 28, 42, 60, 80
- **Line height:** 1.0–1.4
- **Letter spacing:** -0.02em at 60–80px, -0.01em at 27–28px, 0.1em at 13px (uppercase labels)
- **Role:** Display and headline font only. Used for hero headlines (60–80px), section headings (42px), and small uppercase labels (13px). The display sizes carry tight negative tracking (-0.02em at 60–80px, -0.01em at 27–28px) that contrasts with Eina01's openness — the two fonts create a deliberate tight/wide duality. Substitute: Söhne (closest match) or Inter at heavy weight.

### Arial — Arial — detected in extracted data but not described by AI · `--font-arial`
- **Weights:** 400
- **Sizes:** 13px
- **Line height:** 1.2
- **Role:** Arial — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 13px | 1.6 | 1.3px | `--text-caption` |
| body | 16px | 1.6 | 1.6px | `--text-body` |
| body-lg | 18px | 1.6 | 1.8px | `--text-body-lg` |
| subheading | 22px | 1.4 | 2.2px | `--text-subheading` |
| heading-sm | 24px | 1.3 | 2.4px | `--text-heading-sm` |
| heading | 28px | 1.2 | 2.8px | `--text-heading` |
| heading-lg | 42px | 1.1 | -0.42px | `--text-heading-lg` |
| display | 72px | 1 | -1.44px | `--text-display` |

## Tokens — Spacing & Shapes

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 5 | 5px | `--spacing-5` |
| 6 | 6px | `--spacing-6` |
| 8 | 8px | `--spacing-8` |
| 10 | 10px | `--spacing-10` |
| 12 | 12px | `--spacing-12` |
| 15 | 15px | `--spacing-15` |
| 16 | 16px | `--spacing-16` |
| 20 | 20px | `--spacing-20` |
| 24 | 24px | `--spacing-24` |
| 30 | 30px | `--spacing-30` |
| 32 | 32px | `--spacing-32` |
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |
| 120 | 120px | `--spacing-120` |
| 159 | 159px | `--spacing-159` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 26px |
| small | 3px |
| badges | 20px |
| inputs | 6px |
| buttons | 20px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| md | `rgba(0, 0, 0, 0.15) 0px 3px 10px 0px` | `--shadow-md` |
| xl | `rgba(103, 110, 144, 0.2) 0px 8px 26px 0px` | `--shadow-xl` |
| xl-2 | `rgba(43, 42, 53, 0.25) 0px 6px 27px 0px` | `--shadow-xl-2` |
| xl-3 | `rgba(43, 42, 53, 0.5) 0px 6px 27px 0px` | `--shadow-xl-3` |
| xl-4 | `rgba(10, 3, 89, 0.3) 0px 20px 90px 0px, rgba(0, 0, 0, 0.0...` | `--shadow-xl-4` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 20px
- **Element gap:** 20px

## Components

### Filled Primary Button
**Role:** Primary action — the main CTA on a page or section.

Background #6b53ff, white text, 20px border-radius (pill), 12px vertical × 20px horizontal padding, Eina01 weight 600 at 14–15px with 0.1em tracking. Optional right arrow icon in white. The high radius is signature — these buttons read as soft pills, not rectangles.

### Inverted/White Filled Button
**Role:** Secondary action on light backgrounds, primary on dark sections.

Background #ffffff, text #2b2a35, 20px radius, 12px × 20px padding, Eina01 weight 600. Used for 'Sign up' in the dark navigation and for 'Sign up for free' on the hero gradient — the white pill is the counterweight to the violet pill.

### Ghost/Outlined Button
**Role:** Low-emphasis action, used over colored or image backgrounds.

Transparent background, 1.5px white border, white text, 20px radius, 12px × 20px padding. 'Log in' in the header uses this treatment — it sits in the dark navigation without competing with the white 'Sign up' pill.

### Pill Badge/Tag
**Role:** Category tags, feature labels, inline metadata.

20px border-radius, 4px vertical × 12px horizontal padding, Eina01 weight 600 at 13px with 0.1em tracking and uppercase. Violet fill with white text for active tags, neutral fill for passive ones. Compact and self-contained.

### Feature Card
**Role:** Marketing feature blocks with image, title, and description.

White (#ffffff) surface, 26px border-radius, 20px padding, soft shadow rgba(0,0,0,0.15) 0px 3px 10px. Optionally escalates to the deep violet ambient shadow rgba(10,3,89,0.3) 0px 20px 90px for hero feature cards. Generous internal whitespace with image-top, text-below composition.

### Testimonial Card
**Role:** Social proof blocks with avatar, quote, and attribution.

Violet (#6b53ff) background, 26px radius, white text, circular avatar photo (60–80px diameter) with a yellow ring border (#ffd02c). The violet fill makes testimonials visually loud — they're meant to be the emotional peak of a section.

### Hero Section
**Role:** First-screen brand impression.

Full-bleed background with linear-gradient(90deg, #5718eb, #ab6ef9). Centered white headline (Mark Pro weight 700–800 at 60–80px, -0.02em tracking, line-height 1.0), white subtext (Eina01 weight 400 at 18px), and two-button row (white pill + violet pill). Optional 3D illustrative elements float in the corners with soft violet glow.

### Navigation Bar
**Role:** Top-level site navigation.

Transparent background sitting directly on the hero gradient. White text (Eina01 weight 600 at 15px, 0.1em tracking). Logo mark on the left (violet 'P' glyph on a white rounded square). Right-aligned: ghost 'Log in' + white-filled 'Sign up'. No background fill until scroll.

### Announcement Banner
**Role:** Top-of-page news/feature announcement.

White background, centered single-line text in Eina01 weight 400 at 13–14px. Dark text body with a violet 'See what's new →' link in weight 600. Hairline bottom border in #dddfe5. 2px vertical padding — minimal height to stay non-intrusive.

### Tab/Segment Control
**Role:** Switching between audience-specific feature views.

Horizontal row of uppercase Eina01 labels (weight 600, 13px, 0.1em tracking) in #6f7387. Active tab is #6b53ff with a 2px violet underline bar. No background fill on the row itself — the underline alone carries the active state.

### Checklist Item
**Role:** Feature list with checkmark icons.

Violet checkmark icon (#6b53ff, ~20px) left-aligned, dark text label in Eina01 weight 400 at 16–18px to its right. 15px vertical gap between items. The violet check is the only color — everything else is monochrome charcoal.

### Cookie Consent Card
**Role:** GDPR/privacy notification overlay.

White surface, ~16px radius, soft shadow, fixed-position bottom-left. Body text in Eina01 at 13px, 'Agree' button in violet #6b53ff, 'More options' as a text link. Compact — must not dominate the viewport.

### Client Logo Strip
**Role:** Social proof — brands using the product.

Horizontal row of grayscale client logos (#2b2a35 or near-black) at uniform height (~24–32px), evenly spaced with generous gaps. Logos desaturate to gray to avoid competing with the violet brand. Sits centered on a white or #f0eff4 band.

### Slide Preview/Product Card
**Role:** Inline product mockup showing the editor or a finished deck.

White surface, 6px–16px radius, 20px padding, contained within a larger card. Shows actual product UI (toolbar, canvas, slide thumbnails). Sits on a light gray (#f0eff4) background to separate the product from the marketing page.

## Do's and Don'ts

### Do
- Use Signal Violet (#6b53ff) as the exclusive fill for primary action buttons and brand marks — never substitute with another color
- Apply 20px border-radius to all buttons, badges, and pill-shaped elements; 26px for larger cards; 6px for inputs and small tags
- Use Eina01 at 0.1em letter-spacing for all UI text — this wide tracking is the system's signature rhythm
- Reserve Mark Pro (weight 700–800) for display headlines at 42px and above with tight -0.02em tracking
- Use the hero gradient linear-gradient(90deg, #5718eb, #ab6ef9) as a full-bleed section background for maximum-emphasis content blocks
- Keep card padding at 20px and element gaps at 20px for the standard product surface rhythm
- Use soft shadows only — rgba(0,0,0,0.15) 0px 3px 10px is the default; escalate to the violet-tinted deep shadow only for hero feature cards

### Don't
- Don't introduce new accent colors — Solar Yellow (#ffd02c) and Ember Orange (#ffa000) are decorative-only, never use for buttons or status
- Don't use Eina01 at display sizes above 28px — switch to Mark Pro for anything larger to maintain the tight/wide duality
- Don't apply tight negative tracking to Eina01 — its 0.1em positive spacing is non-negotiable for the UI voice
- Don't use heavy borders or hard outlines on cards — the system signals elevation through soft shadows and background contrast, not strokes
- Don't place body text directly on the violet hero gradient at small sizes — minimum 16px white text, or move text to a white card surface
- Don't use Deep Indigo (#371789) as a button fill — it's a text and gradient color, not an interactive surface
- Don't mix purple and yellow on the same component — they serve different functions (violet = action, yellow = energy) and combining them muddles the hierarchy

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Marble | `#f0eff4` | Page canvas — the default background for content sections below the hero |
| 1 | Paper | `#ffffff` | Card and panel surfaces — sits one step above Marble, the primary product surface |
| 2 | Elevated Paper | `#ffffff` | Modals, popovers, floating toolbars — same white but distinguished by stronger shadow and/or border |
| 3 | Hero Stage | `#5718eb` | Full-bleed brand sections — the violet gradient, reserved for hero and major emotional peaks |

## Elevation

- **Standard card / image container:** `0px 3px 10px rgba(0, 0, 0, 0.15)`
- **Elevated feature card:** `0px 8px 26px rgba(103, 110, 144, 0.2)`
- **Hero feature card (ambient lift):** `0px 20px 90px rgba(10, 3, 89, 0.3), 0px 0px 0px 1px rgba(0, 0, 0, 0.02)`
- **Primary button (active/pressed state):** `0px 6px 27px rgba(43, 42, 53, 0.5)`

## Imagery

Visuals are a mix of product screenshots (the editor UI, slide thumbnails) and 3D-rendered decorative objects — a compass, a gear, a clock — that float with soft violet glows in the corners of content sections. Product screenshots are always contained within rounded white cards (16–26px radius) with soft shadows, never full-bleed. The 3D objects are stylized, slightly glossy, and tinted with brand violet and warm yellow to feel cohesive with the hero. Photography is absent — no lifestyle shots, no human photography in marketing (human presence is limited to circular avatar crops in testimonial cards). The overall visual density is moderate: text-dominant with product visuals as supporting evidence rather than spectacle.

## Layout

The page is a vertical scroll of alternating full-width bands: a violet gradient hero (centered headline, two-button row, decorative 3D objects in corners) → product preview band (centered slide editor card on white) → client logo strip (centered, generous spacing) → 'for the whole team' section (centered text + tabbed feature blocks) → testimonial band (violet card with circular avatar) → checklist section (two-column: image left, checkmark list right). Max content width is ~1200px centered. Navigation is a transparent top bar that overlays the hero and likely solidifies on scroll. Section gaps are 80px — generous enough for theatrical pacing, tight enough to maintain momentum. The rhythm is: dark violet hero → white product band → gray social proof → white feature section → violet testimonial → white checklist. This alternating dark/light cadence creates visual punctuation without needing dividers.

## Agent Prompt Guide

**Quick Color Reference**
- Primary text: #2b2a35
- Secondary text: #1e1d28
- Muted text: #6f7387
- Background (canvas): #f0eff4
- Card surface: #ffffff
- Border: #dddfe5
- primary action: no distinct CTA color
- Accent: #ffd02c (decorative yellow only)

**Example Component Prompts**

1. **Hero section**: Full-bleed background linear-gradient(90deg, #5718eb, #ab6ef9). Centered white headline at 60px Mark Pro weight 700, letter-spacing -0.02em, line-height 1.0. White subtext at 18px Eina01 weight 400, letter-spacing 0.1em. Two buttons side by side: white-filled pill (white bg, #2b2a35 text, 20px radius, 12px 20px padding) and violet-filled pill (#6b53ff bg, white text, 20px radius).

2. **Feature card**: White (#ffffff) surface, 26px border-radius, 20px padding, shadow 0px 3px 10px rgba(0,0,0,0.15). Image fills the top with 6px radius. Title in Eina01 weight 700 at 22px, #2b2a35, 0.1em tracking. Body in Eina01 weight 400 at 16px, #3f4250.

3. **Testimonial card**: Violet (#6b53ff) background, 26px radius, 20px padding. Circular avatar (72px diameter) with 3px #ffd02c border ring. Quote in Eina01 weight 400 at 18px, white, 0.1em tracking. Attribution name in Eina01 weight 700 at 14px, white.

4. **Tab control**: Horizontal row, no background. Labels in Eina01 weight 600 at 13px, 0.1em tracking, uppercase. Inactive tabs in #6f7387, active tab in #6b53ff with a 2px violet underline bar (4px below text, 100% width of label).

5. **Checklist item**: 20px violet (#6b53ff) checkmark icon left-aligned. Label in Eina01 weight 400 at 18px, #2b2a35, 0.1em tracking, 15px gap from icon. Items separated by 15px vertical space.

## Duality Principle

The system runs on a tight/wide duality: Mark Pro is tight (-0.02em) and heavy, Eina01 is wide (+0.1em) and light. This is not a style choice but a hierarchy tool — when you see tight tracking, you're in the headline voice (marketing, emotion); when you see wide tracking, you're in the product voice (interface, utility). Never collapse the two into one tracking style. This is the single most distinctive choice in the system.

## Color Rationing

Violet is rationed, not splashed. On a given screen, violet should appear on: one primary CTA, the logo, the active tab indicator, and checkmark icons — and nothing else. If you find yourself reaching for violet on a third component, that's a signal to use charcoal instead. The single yellow accent is even more rationed: one decorative element per section maximum, always small, always supporting — never competing with the violet.

## Similar Brands

- **Notion** — Same minimal-light canvas approach with a single brand color (Notion's black) rationed across actions, and similarly soft shadows on white cards with 16–20px radii
- **Linear** — Same tight typographic discipline with a single chromatic accent (Linear's purple) and generous use of grayscale for structure — though Pitch leans more expressive with the violet hero gradient
- **Figma** — Shares the 3D-illustrated product marketing language (floating geometric objects, product UI screenshots in contained white cards) and a similar punchy single-accent palette
- **Framer** — Same dark-gradient hero → white content section rhythm, with the brand color flooding the first screen and then retreating to a clean workspace below
- **Webflow** — Both use a vivid single-hue brand color (Webflow's blue, Pitch's violet) as the sole interactive accent against a near-white workspace with soft elevation

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-signal-violet: #6b53ff;
  --color-lighter-violet: #8d49f7;
  --color-deep-indigo: #371789;
  --color-solar-yellow: #ffd02c;
  --gradient-solar-yellow: linear-gradient(90deg, #ffd02c, #ff9e2c);
  --color-ember-orange: #ffa000;
  --color-slate-ink: #2b2a35;
  --color-carbon: #1e1d28;
  --color-steel: #3f4250;
  --color-fog: #6f7387;
  --color-ash: #95959a;
  --color-mist: #dddfe5;
  --color-marble: #f0eff4;
  --color-paper: #ffffff;
  --color-shadow-violet: #0a0359;
  --color-hero-stage: #5718eb;
  --gradient-hero-stage: linear-gradient(90deg, rgb(83, 24, 235), rgb(171, 110, 249));

  /* Typography — Font Families */
  --font-eina01: 'Eina01', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-mark-pro: 'Mark Pro', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-arial: 'Arial', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 13px;
  --leading-caption: 1.6;
  --tracking-caption: 1.3px;
  --text-body: 16px;
  --leading-body: 1.6;
  --tracking-body: 1.6px;
  --text-body-lg: 18px;
  --leading-body-lg: 1.6;
  --tracking-body-lg: 1.8px;
  --text-subheading: 22px;
  --leading-subheading: 1.4;
  --tracking-subheading: 2.2px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.3;
  --tracking-heading-sm: 2.4px;
  --text-heading: 28px;
  --leading-heading: 1.2;
  --tracking-heading: 2.8px;
  --text-heading-lg: 42px;
  --leading-heading-lg: 1.1;
  --tracking-heading-lg: -0.42px;
  --text-display: 72px;
  --leading-display: 1;
  --tracking-display: -1.44px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
  --font-weight-extrabold: 800;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-5: 5px;
  --spacing-6: 6px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-15: 15px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-30: 30px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-120: 120px;
  --spacing-159: 159px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 20px;
  --element-gap: 20px;

  /* Border Radius */
  --radius-sm: 3px;
  --radius-md: 6px;
  --radius-lg: 10px;
  --radius-2xl: 16px;
  --radius-2xl-2: 20px;
  --radius-3xl: 26px;
  --radius-full: 56px;

  /* Named Radii */
  --radius-cards: 26px;
  --radius-small: 3px;
  --radius-badges: 20px;
  --radius-inputs: 6px;
  --radius-buttons: 20px;

  /* Shadows */
  --shadow-md: rgba(0, 0, 0, 0.15) 0px 3px 10px 0px;
  --shadow-xl: rgba(103, 110, 144, 0.2) 0px 8px 26px 0px;
  --shadow-xl-2: rgba(43, 42, 53, 0.25) 0px 6px 27px 0px;
  --shadow-xl-3: rgba(43, 42, 53, 0.5) 0px 6px 27px 0px;
  --shadow-xl-4: rgba(10, 3, 89, 0.3) 0px 20px 90px 0px, rgba(0, 0, 0, 0.02) 0px 0px 0px 1px;

  /* Surfaces */
  --surface-marble: #f0eff4;
  --surface-paper: #ffffff;
  --surface-elevated-paper: #ffffff;
  --surface-hero-stage: #5718eb;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-signal-violet: #6b53ff;
  --color-lighter-violet: #8d49f7;
  --color-deep-indigo: #371789;
  --color-solar-yellow: #ffd02c;
  --color-ember-orange: #ffa000;
  --color-slate-ink: #2b2a35;
  --color-carbon: #1e1d28;
  --color-steel: #3f4250;
  --color-fog: #6f7387;
  --color-ash: #95959a;
  --color-mist: #dddfe5;
  --color-marble: #f0eff4;
  --color-paper: #ffffff;
  --color-shadow-violet: #0a0359;
  --color-hero-stage: #5718eb;

  /* Typography */
  --font-eina01: 'Eina01', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-mark-pro: 'Mark Pro', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-arial: 'Arial', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 13px;
  --leading-caption: 1.6;
  --tracking-caption: 1.3px;
  --text-body: 16px;
  --leading-body: 1.6;
  --tracking-body: 1.6px;
  --text-body-lg: 18px;
  --leading-body-lg: 1.6;
  --tracking-body-lg: 1.8px;
  --text-subheading: 22px;
  --leading-subheading: 1.4;
  --tracking-subheading: 2.2px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.3;
  --tracking-heading-sm: 2.4px;
  --text-heading: 28px;
  --leading-heading: 1.2;
  --tracking-heading: 2.8px;
  --text-heading-lg: 42px;
  --leading-heading-lg: 1.1;
  --tracking-heading-lg: -0.42px;
  --text-display: 72px;
  --leading-display: 1;
  --tracking-display: -1.44px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-5: 5px;
  --spacing-6: 6px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-15: 15px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-30: 30px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-120: 120px;
  --spacing-159: 159px;

  /* Border Radius */
  --radius-sm: 3px;
  --radius-md: 6px;
  --radius-lg: 10px;
  --radius-2xl: 16px;
  --radius-2xl-2: 20px;
  --radius-3xl: 26px;
  --radius-full: 56px;

  /* Shadows */
  --shadow-md: rgba(0, 0, 0, 0.15) 0px 3px 10px 0px;
  --shadow-xl: rgba(103, 110, 144, 0.2) 0px 8px 26px 0px;
  --shadow-xl-2: rgba(43, 42, 53, 0.25) 0px 6px 27px 0px;
  --shadow-xl-3: rgba(43, 42, 53, 0.5) 0px 6px 27px 0px;
  --shadow-xl-4: rgba(10, 3, 89, 0.3) 0px 20px 90px 0px, rgba(0, 0, 0, 0.02) 0px 0px 0px 1px;
}
```
