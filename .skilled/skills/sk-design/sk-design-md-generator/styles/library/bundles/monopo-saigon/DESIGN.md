# monopo saigon — Style Reference
> Liquid iridescence behind editorial silence — a monochrome editorial gallery floating on molten light.

**Theme:** light

Monopo Saigon runs on radical monochrome discipline: pure black and white with whisper-thin grays, wrapped around massive Roobert typography that breathes across full-bleed canvases. The signature contrast lives between austere editorial restraint (sharp 0px corners on navigation and text links, generous whitespace, 4px-based rhythm) and a single expressive gesture — full-pill 75px-radius buttons that float like liquid over imagery. Hero environments lean into iridescent, fluid, chromatic atmospheres (greens dissolving into amber into deep oxblood) while the interface itself never picks up a hue, creating the feeling of a black-and-white editorial gallery floating on a river of liquid light. Type sets the temperature: weight 300 at 78px whispers, weight 400 at 225px fills the viewport, and weight 400 at 11px labels everything else with confident minimalism. Motion is expressive but patient — cubic-bezier(0.19, 1, 0.22, 1) ease curves stretching up to 1.25s transform transitions, letting elements glide rather than snap.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Obsidian | `#000000` | `--color-obsidian` | Primary text, SVG strokes, overlay fills — pure black carries all foreground information and graphic marks |
| Paper | `#ffffff` | `--color-paper` | Light text on dark surfaces, inverse labels, and high-contrast captions. Do not promote it to the primary CTA color |
| Inkstone | `#181818` | `--color-inkstone` | Footer body copy and secondary headings — softened black for long-form reading blocks |
| Felt Gray | `#6d6d6d` | `--color-felt-gray` | Muted helper text, address blocks, legal copy — quiet annotations that recede without disappearing |
| Slate Pill | `#636363` | `--color-slate-pill` | Filled neutral button background — the only solid fill used for actions like Accept |
| Ash Mist | `#9a9a9a` | `--color-ash-mist` | Mid-tone neutral for disabled or low-contrast surfaces in the surface stack |
| Pewter | `#808080` | `--color-pewter` | Secondary mid-tone neutral for hover or muted state layers |
| Iridescent Fade | `linear-gradient(90deg, rgb(160, 224, 171), rgb(255, 172, 46) 50%, rgb(165, 45, 37))` | `--color-iridescent-fade` | Chromatic accent appearing only inside the hero gradient wash — molten oxblood anchor of the iridescent atmosphere, not used in interface controls |

## Tokens — Typography

### Roobert — Primary typeface across all interface text, navigation, hero headlines, body, lists, and footers. The custom sans carries geometric clarity with humanist warmth; its wide weight range (300 whisper through 600 anchor) lets the system breathe from monumental 225px headlines down to 11px labels · `--font-roobert`
- **Substitute:** Inter or Söhne — both share Roobert's geometric-humanist balance and clean aperture
- **Weights:** 300, 400, 600
- **Sizes:** 11px, 12px, 16px, 18px, 29px, 30px, 39px, 45px, 54px, 78px, 94px, 225px
- **Line height:** 0.70–2.34 (tight 0.70–0.76 on display sizes, generous 1.58 on body)
- **Role:** Primary typeface across all interface text, navigation, hero headlines, body, lists, and footers. The custom sans carries geometric clarity with humanist warmth; its wide weight range (300 whisper through 600 anchor) lets the system breathe from monumental 225px headlines down to 11px labels

### Raleway — Reserved for specific heading contexts where a slightly more elegant, narrower sans introduces contrast — appears sparingly as a counterpoint to Roobert's bolder presence · `--font-raleway`
- **Substitute:** Montserrat or Jost
- **Weights:** 400
- **Sizes:** 54px
- **Line height:** 1.39
- **Role:** Reserved for specific heading contexts where a slightly more elegant, narrower sans introduces contrast — appears sparingly as a counterpoint to Roobert's bolder presence

### system-ui — Micro UI labels, cookie banner body, fine print — browser default fallback ensuring legibility at the smallest scale without committing to a custom face · `--font-system-ui`
- **Weights:** 400
- **Sizes:** 9px, 16px
- **Line height:** 1.15–1.32
- **Role:** Micro UI labels, cookie banner body, fine print — browser default fallback ensuring legibility at the smallest scale without committing to a custom face

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.19 | — | `--text-caption` |
| body-sm | 16px | 1.15 | — | `--text-body-sm` |
| body | 18px | 1.21 | — | `--text-body` |
| subheading | 39px | 1.19 | — | `--text-subheading` |
| subheading-lg | 45px | 1.15 | — | `--text-subheading-lg` |
| heading-sm | 54px | 1.39 | — | `--text-heading-sm` |
| heading | 78px | 1.1 | — | `--text-heading` |
| heading-lg | 94px | 0.76 | — | `--text-heading-lg` |
| display | 225px | 1.25 | — | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** spacious

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 8 | 8px | `--spacing-8` |
| 12 | 12px | `--spacing-12` |
| 28 | 28px | `--spacing-28` |
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |
| 64 | 64px | `--spacing-64` |
| 68 | 68px | `--spacing-68` |
| 152 | 152px | `--spacing-152` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 75px |
| cards | 0px |
| images | 0px |
| inputs | 0px |
| buttons | 75px |

### Layout

- **Page max-width:** 1078px
- **Section gap:** 46px
- **Card padding:** 34px
- **Element gap:** 14px

## Components

### Ghost Pill Button (Dark Surface)
**Role:** Primary action button used over iridescent or dark hero media

Transparent background, 1px solid rgba(255,255,255,0.3) border, #ffffff text, 75px border-radius (full pill), 11px vertical and 33px horizontal padding, Roobert 16px weight 400. The translucent border dissolves into the iridescent background while the pill silhouette stays unmistakable.

### Ghost Pill Button (Light Surface)
**Role:** Secondary action on white or light gray sections

Transparent background, 1px solid #000000 border, #000000 text, 75px border-radius, 11px vertical and 33px horizontal padding, Roobert 16px weight 400. Mirrors the dark-surface variant — same geometry, inverted palette.

### Filled Neutral Pill
**Role:** Cookie consent and utilitarian confirmations

rgba(55,55,55,0.78) background (functionally Slate Pill #636363), #ffffff text, 1px solid #ffffff border, 75px border-radius, 11px vertical and 33px horizontal padding. The only solid-filled action in the system — used sparingly for compliance and consent, never for primary marketing CTAs.

### Underline-Free Text Link
**Role:** Inline navigation, menu items, language switcher, footer links

No background, no border, 0px radius. Roobert 12–16px weight 400, color shifts between #ffffff (on dark) and #000000 (on light). Underlines are absent — context and weight set the link apart from body copy. Generous line-height (1.36 at 11px, 1.19 at 12px) keeps stacked menus airy.

### Hero Display Headline
**Role:** Full-viewport editorial title

Roobert 225px weight 400, line-height 1.25, #ffffff over iridescent dark media. Letter-spacing normal. The headline is the hero — no subhead, no CTA, just one monumental phrase centered in the viewport breathing against fluid light.

### Section Heading (Whisper Weight)
**Role:** Atmospheric headline for manifesto or feature sections

Roobert 78px weight 300, line-height 1.10. The 300-weight at this scale is anti-convention — most sites push 600–700 here. The whisper weight lets the headline feel like it is being spoken, not shouted, giving the editorial chamber its hushed authority.

### Section Heading (Anchor Weight)
**Role:** Bold editorial divider or statement

Roobert 94px weight 400, line-height 0.76. The tight line-height (0.76) is dramatic — text lines almost touch, creating a dense typographic block that reads as art object. Used for large statement moments where the text itself is visual.

### Project Card / List Row
**Role:** Featured work entry — paired image and title

Transparent background, 0px border-radius, no shadow. Image bleeds full-width within the 1078px container; title sits below in Roobert 16–18px weight 400. No card chrome — the card is content, not a container. Spacing between rows controlled by 14–46px gaps depending on section density.

### Language Switcher
**Role:** Top-bar locale selector (EN / VN / 中文)

Three inline text links in Roobert 12px weight 400, color #ffffff or #000000 depending on surface, 0px radius, separated by visual whitespace rather than dividers. Active locale carries the same color but slightly heavier visual weight through spacing alone.

### Rotating Scroll Indicator
**Role:** Bottom-left circular badge prompting downward exploration

Circular SVG badge with text tracing the circumference ('SCROLL DOWN · SCROLL DOWN'), rotating continuously at slow tempo. Sits at 0,0 of the bottom-left corner with small offset. Ink black stroke on transparent fill — a typographic punctuation mark, not a button.

### Footer Address Block
**Role:** Studio contact information

Roobert 11px weight 400 line-height 1.36, #6d6d6d Felt Gray text. Tight 8px top margins between lines create a compact address stack that recedes into the page. No dividers or labels — the muted gray does the work.

### Cookie Banner
**Role:** Compliance notice with single accept action

Fixed bottom bar, rgba(55,55,55,0.78) Slate Pill background, white body text in system-ui 9–16px, paired with Filled Neutral Pill 'Accept' button. Minimal copy, single action, no settings — the banner respects attention by asking for nothing beyond consent.

### Top Navigation Bar
**Role:** Persistent header with logo, locale, and menu

Fixed transparent header 66px tall. Logo wordmark top-left (Roobert 16px weight 400 'monopo saigon'), language switcher centered, menu stack right-aligned (WORK / MANIFESTO / SAIGON SOULS / TEAM / CONTACT at 11–12px weight 400). No background fill — the header is invisible until content scrolls behind it.

### Iridescent Hero Backdrop
**Role:** Atmospheric media behind hero headlines

Full-viewport organic gradient or video: soft sage green (rgb 160,224,171) dissolving through molten amber (rgb 255,172,46) into deep oxblood (rgb 165,45,37). Applied as a flowing, liquid texture — never as a flat gradient. This is the only chromatic surface in the entire system and exists only behind text, never as UI fill.

## Do's and Don'ts

### Do
- Set display headlines at 225px Roobert weight 400 and let them own the viewport — never crowd them with subheads or CTAs
- Use the 75px pill radius exclusively for buttons and tags — keep all other elements (cards, images, inputs) at 0px radius for sharp editorial contrast
- Reserve color for one iridescent hero backdrop per page — keep all interface text, borders, and fills strictly in the black/white/gray scale
- Use weight 300 at 78px for manifesto and atmospheric headlines to create whisper authority — never push above weight 400 at this scale
- Set line-height to 0.70–0.76 on display sizes above 78px to let lines lock together as typographic art objects
- Apply cubic-bezier(0.19, 1, 0.22, 1) easing to transform and color transitions with durations of 0.8–1.25s for patient, gliding motion
- Keep all interactive text links at 0px radius with no underlines — let spacing, color, and context signal affordance

### Don't
- Never introduce a chromatic UI color — black, white, and gray are the interface palette; the iridescent gradient is media only
- Never use box-shadow or elevation on cards, buttons, or images — the system relies on flat surfaces and hairline 1px borders
- Never set border-radius between 1px and 74px — the system jumps from sharp 0px to full 75px pill, no intermediate rounding
- Never use bold or heavy weights (600+) above 45px — large sizes should whisper at 300 or speak at 400, never shout
- Never center-align body copy in address blocks, lists, or project descriptions — left-align with 8–14px line gaps for editorial flow
- Never add gradients to buttons, badges, or UI controls — gradients belong only in the hero atmospheric media
- Never use Raleway for body or navigation — it is a heading accent only, and even there it appears sparingly
- Never fill the canvas with imagery — the system is text-dominant with one hero-sized visual gesture per page

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Paper | `#ffffff` | Primary canvas — most sections sit on pure white |
| 2 | Slate Pill | `#636363` | Filled button surface for cookie consent and neutral actions |
| 3 | Obsidian | `#000000` | Dark overlay and inverse section — full-bleed dark bands behind iridescent media |
| 4 | Ash Mist | `#9a9a9a` | Quiet mid-tone layer for inset panels or disabled zones |

## Elevation

The system deliberately avoids shadow elevation. Surfaces are distinguished by color inversion (white to black bands) and hairline 1px borders rather than stacked shadows. The lone 'elevation' gesture is the translucent slate pill on the cookie banner, which uses background opacity rather than shadow to separate from content.

## Imagery

Imagery is theatrical and singular: one massive iridescent fluid texture dominates the hero — organic greens dissolving through amber into oxblood like oil on water or molten glass. It reads as full-bleed atmospheric media, possibly video or shader-driven canvas, and occupies the entire viewport as a singular sensory moment rather than a repeated pattern. Project showcases use contained editorial photography (tight product crops, campaign stills) presented without frames or borders — the image is the content. No illustration, no icons beyond tiny UI glyphs, no decorative shapes. Iconography is minimal or absent; the rotating circular text badge functions as the system's only typographic ornament. Overall density: text-dominant with one hero-sized visual gesture, then long quiet editorial stretches of typography and product imagery.

## Layout

Layout is max-width contained at 1078px, centered, with full-bleed dark hero sections breaking the container. The hero is full-viewport: centered monumental headline (Un i ted, Unbound) floating over iridescent media, minimal navigation floating at top, single rotating badge at bottom-left. Body sections follow a spacious editorial rhythm — generous 46px section gaps create breathing room between blocks, alternating between white and dark (black with white type) bands. Content arrangement is asymmetric: text-left/image-right and image-left/text-right alternations dominate, with no centered stacks outside the hero. Card grids appear as single-column project lists rather than multi-column grids — each project gets the full width with its image and title. Navigation is a transparent top bar with logo left, locale center, menu right — no sticky color shift, no shadow, just invisible persistence. The footer is a compact three-column address block (Tokyo, Saigon, London) with quiet 11px copy. Overall: editorial magazine pacing in a digital frame.

## Agent Prompt Guide

**Quick Color Reference**
- text primary: #000000
- text muted: #6d6d6d
- background: #ffffff
- dark overlay / inverse section: #000000
- border (light surface): #000000
- border (dark surface): rgba(255,255,255,0.3)
- accent: none — the only chromatic color is the iridescent hero gradient, which is media only
- primary action: no distinct CTA color

**3 Example Component Prompts**
No distinct primary action color was observed; use the extracted neutral button treatments instead of inventing a filled CTA color.

2. Build a project list row: transparent background, 0px radius, no shadow. Full-bleed image at the top within the 1078px container, sharp corners. Project title below in Roobert 16px weight 400, color #000000. 46px gap to the next row. No card chrome, no borders, no padding around the content itself.

3. Build a Ghost Pill Button on a light surface: transparent background, 1px solid #000000 border, 75px border-radius, 11px padding-top and padding-bottom, 33px padding-left and padding-right. Label in Roobert 16px weight 400, color #000000. No hover fill — animate border opacity and letter-spacing on transition with cubic-bezier(0.19, 1, 0.22, 1) over 0.8s.

## Motion Personality

Motion is expressive but unhurried — the system treats transitions as slow camera moves rather than UI snaps. The signature curve is cubic-bezier(0.19, 1, 0.22, 1) (a gentle ease-out) applied to transform, color, and opacity at 0.8s and 1.25s durations. Shorter easing uses plain 'ease' at 0.4s for color and opacity micro-transitions. A rotating animation runs continuously on the scroll-indicator badge at slow tempo. Transforms dominate over positional animation — elements glide, slide, and reveal through transform rather than repositioning layout. The 1.25s duration on transforms (69 occurrences) signals that the studio prefers patience over responsiveness; nothing should feel abrupt. Border transitions (6 occurrences) and flex-basis shifts are rare and reserved for layout reveals, not micro-interactions.

## Similar Brands

- **Resn** — Same liquid iridescent hero treatment behind monochrome editorial typography and full-pill ghost buttons
- **Active Theory** — Same immersive full-bleed dark hero with single monumental headline and restrained monochrome chrome around it
- **Locomotive** — Same editorial agency rhythm — oversized whisper-weight headlines, generous 46px+ section gaps, and zero shadow elevation
- **Pentagram** — Same austere black-and-white editorial system with sharp 0px corners and custom geometric sans (Roobert echoing Pentagram's house faces)

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-obsidian: #000000;
  --color-paper: #ffffff;
  --color-inkstone: #181818;
  --color-felt-gray: #6d6d6d;
  --color-slate-pill: #636363;
  --color-ash-mist: #9a9a9a;
  --color-pewter: #808080;
  --color-iridescent-fade: #a02d25;
  --gradient-iridescent-fade: linear-gradient(90deg, rgb(160, 224, 171), rgb(255, 172, 46) 50%, rgb(165, 45, 37));

  /* Typography — Font Families */
  --font-roobert: 'Roobert', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-raleway: 'Raleway', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-system-ui: 'system-ui', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.19;
  --text-body-sm: 16px;
  --leading-body-sm: 1.15;
  --text-body: 18px;
  --leading-body: 1.21;
  --text-subheading: 39px;
  --leading-subheading: 1.19;
  --text-subheading-lg: 45px;
  --leading-subheading-lg: 1.15;
  --text-heading-sm: 54px;
  --leading-heading-sm: 1.39;
  --text-heading: 78px;
  --leading-heading: 1.1;
  --text-heading-lg: 94px;
  --leading-heading-lg: 0.76;
  --text-display: 225px;
  --leading-display: 1.25;

  /* Typography — Weights */
  --font-weight-light: 300;
  --font-weight-regular: 400;
  --font-weight-semibold: 600;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-28: 28px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-68: 68px;
  --spacing-152: 152px;

  /* Layout */
  --page-max-width: 1078px;
  --section-gap: 46px;
  --card-padding: 34px;
  --element-gap: 14px;

  /* Border Radius */
  --radius-lg: 10px;
  --radius-full: 75.024px;

  /* Named Radii */
  --radius-tags: 75px;
  --radius-cards: 0px;
  --radius-images: 0px;
  --radius-inputs: 0px;
  --radius-buttons: 75px;

  /* Surfaces */
  --surface-paper: #ffffff;
  --surface-slate-pill: #636363;
  --surface-obsidian: #000000;
  --surface-ash-mist: #9a9a9a;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-obsidian: #000000;
  --color-paper: #ffffff;
  --color-inkstone: #181818;
  --color-felt-gray: #6d6d6d;
  --color-slate-pill: #636363;
  --color-ash-mist: #9a9a9a;
  --color-pewter: #808080;
  --color-iridescent-fade: #a02d25;

  /* Typography */
  --font-roobert: 'Roobert', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-raleway: 'Raleway', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-system-ui: 'system-ui', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.19;
  --text-body-sm: 16px;
  --leading-body-sm: 1.15;
  --text-body: 18px;
  --leading-body: 1.21;
  --text-subheading: 39px;
  --leading-subheading: 1.19;
  --text-subheading-lg: 45px;
  --leading-subheading-lg: 1.15;
  --text-heading-sm: 54px;
  --leading-heading-sm: 1.39;
  --text-heading: 78px;
  --leading-heading: 1.1;
  --text-heading-lg: 94px;
  --leading-heading-lg: 0.76;
  --text-display: 225px;
  --leading-display: 1.25;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-28: 28px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-68: 68px;
  --spacing-152: 152px;

  /* Border Radius */
  --radius-lg: 10px;
  --radius-full: 75.024px;
}
```
