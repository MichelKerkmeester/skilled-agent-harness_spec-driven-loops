<!-- Generated: 2026-06-21 | Source: https://anobel.com/nl | Pages: 5 | Framework: webflow | Format: v2 -->
<!-- This is not the official design system. Colors, fonts, and spacing may not be 100% accurate. -->

# Design System: Anobel

## 0. Brand Context

A. Nobel & Zn is a maritime total supplier serving global shipping, providing equipment, services, and logistics to vessels worldwide. The website anchors the company's century of nautical expertise in a digital storefront for the Dutch maritime industry.

Target audience: Maritime procurement officers, ship operators, port authorities, and vessel maintenance teams operating in the global shipping sector. The site serves both existing clients seeking supplies and new customers evaluating partnership.

- **Established** — the 112px weight 600 display headline projects institutional confidence without decorative ornament, matching the company's century-plus history
- **Technical** — the deep navy palette (#06458c through #031d3c) echoes nautical instrumentation and maritime industrial signaling
- **Direct** — button labels at 18px weight 600 with tight 1.29 line-height communicate action without marketing flourish ("Klant worden", "Diensten")
- **Maritime** — the gradient system moves through oceanic blue depths from #031d3c to #06458c, tying the visual identity to the sea

Sources: https://anobel.com/nl (5 pages crawled)

## 1. Visual Theme & Atmosphere

Anobel's website is a study in maritime industrial confidence — a near-black canvas (#0a0a0a) where saturated navy (#06458c) and bright signal orange (#fd4f19) surface with the precision of nautical instrumentation, not the soft gradients of consumer SaaS.

The page opens on the deepest near-black (#0a0a0a) that anchors all 13,809 occurrences across borders, text, and backgrounds — it is the visual ocean on which every other color floats. Against this dark expanse, Nobel Navy (#06458c) carries 10,393 occurrences as the system's chromatic backbone: 7,271 border uses, 3,038 text uses, and 82 background uses. Bright White (#fefefe) appears 7,511 times as the primary light text and border color on dark surfaces, creating a high-contrast reading experience at 19.63:1 against #0a0a0a. The overall impression is of a ship's bridge at night — dark, instrumented, with blue and white signals cutting through the dark.

The Silka Webfont defines the typographic personality. Deployed at a single weight (600) across all headings from 112px display down to 21px subheadings, it creates a monoweight hierarchy where size alone carries the structure. At 112px, "ISPS" fills the viewport as a single-word industrial declaration — no tracking adjustment, no stylistic alternates, just pure geometric letterforms at maximum scale. Body text switches to weight 400 at 16px with a relaxed 1.45 line-height, while uppercase cookie-consent text runs at 18px weight 400 — a rare legal/administrative voice that sits outside the 600-weight heading system.

The design is flat: `tokens.json` records zero box-shadow tokens, so there is no shadow-based elevation. The six gradients that exist are decorative surface treatments — image-edge fades (`linear-gradient(90deg, rgb(254,254,254), rgba(254,254,254,0))`), a bottom-fade overlay for text-on-image legibility, a navy card sweep that fades to transparent, and two solid color washes (navy `rgba(6,69,140,0.8)`, orange `rgba(253,79,25,0.55)`). They sit on specific cards and decorative divs; they are not a depth or elevation technique.

**Design Principles:**
- **Monoweight Hierarchy**: Weight 600 across all headings from 112px to 21px — size and position alone establish information architecture
- **Flat & Shadowless**: zero box-shadow elevation (`shadowTokens: 0`); depth is not modeled — the six gradients present are decorative overlays, not an elevation system
- **Signal Accent Isolation**: #fd4f19 appears exclusively on the Destructive button (1 occurrence) — orange is a warning, never decoration
- **Binary Radius Vocabulary**: Two dominant radii govern the system — 7px for interactive controls, 10.5px for cards and containers

**Key Characteristics:**
- Silka Webfont at weight 600 across all heading levels — a monoweight typographic identity that builds hierarchy through scale alone
- Near-black #0a0a0a as the system's dominant color at 13,809 occurrences — the canvas from which all signals emerge
- Nobel Navy #06458c at 10,393 occurrences as the chromatic anchor — border, text, and background workhorse
- Bright White #fefefe at 7,511 occurrences — high-contrast text at 19.63:1 against #0a0a0a on dark surfaces
- Flat design with zero box-shadow; six decorative gradients (image-edge fades, directional content fades, solid color washes) used as surface treatments, not elevation
- Signal Orange #fd4f19 confined to a single Destructive button — accent as alarm, not decoration
- Two-radius system: 7px governs buttons (164 occurrences) and 10.5px governs cards and images (64 occurrences)
- 112px display typography for single-word industrial declarations — "ISPS" at weight 600, line-height 1.00
- Uppercase body text at 18px weight 400 for legal/consent copy — a distinct administrative typographic voice
- 56px as the dominant spacing value at 222 occurrences — section-level vertical rhythm
- Dutch-language button labels with weight 600 at tight line-height: "Klant worden", "Diensten"
- Gradient overlay technique: `rgba(6,69,140,0.8)` and `rgba(253,79,25,0.55)` as semi-transparent washes

Where most maritime-industrial sites default to heavy bold headlines and steel-blue grays, Anobel commits to a single weight, a single chromatic family, and lets size and luminance carry the entire visual hierarchy.

## 2. Color Palette & Roles

### Brand Colors

- **Nobel Navy** (`#06458c`): frequency 10,393. Used as border (7,271), text (3,038), background (82). The chromatic backbone of the system — a saturated medium navy that functions as brand anchor, interactive accent, and structural border color simultaneously. Carries more blue luminosity than corporate navy, reading as maritime rather than financial.
- **Midnight Navy** (`#031d3c`): frequency 24. Used as border (20), gradient endpoint (4). The deepest navy in the scale, appearing almost exclusively as gradient origins and dark borders. At lightness 0.23, it anchors the dark end of the navy spectrum.
- **Deep Navy** (`#043367`): frequency 10. Used as background (6), gradient midpoint (4). An intermediate navy at lightness 0.33 that bridges Midnight Navy to Nobel Navy in gradient transitions. A system-level color, not a content color.
- **Signal Orange** (`#fd4f19`): frequency 56. Used as border (44), background (5), icon (5). A high-chroma orange reserved for the single Destructive button. The system's only warm signal — deployed as a warning, never as decoration or secondary accent.
- **Rust Red** (`#b4120e`): frequency 140. Used as border (100), text (40). A deep, muted red with warm undertones at lightness 0.49. Functions as a secondary accent for borders and occasional text emphasis, distinct from the brighter campaign reds.

### Structural Colors

- **Abyssal Black** (`#0a0a0a`): frequency 13,809. Used as border (9,578), text (4,212), background (10). The system's foundation — a near-black with imperceptible warmth that avoids the harshness of pure black. It is the dominant surface, the primary text color on light backgrounds, and the default border color. At 19.63:1 against #fefefe, it delivers maximum readability.
- **Bright White** (`#fefefe`): frequency 7,511. Used as border (5,277), text (2,128), background (94). The primary light text color on dark #0a0a0a surfaces, and the background for Secondary buttons and light-mode elements. An off-white that prevents the clinical glare of pure #ffffff.
- **Pure Black** (`#000000`): frequency 35. Used as border (25), text (10). True black, deployed sparingly — primarily as structural borders and minimum-contrast elements. The system prefers #0a0a0a for text and dominant surfaces.
- **Pale Gray** (`#cfcfcf`): frequency 115. Used as border (84), background (31). The mid-tone structural gray. Functions as Secondary button borders, the inconsistent focus indicator outline, and occasional background fills. The bridge between the system's dark and light extremes.
- **Cloud Gray** (`#e2e2e2`): frequency 75. Used as border (57), background (18). A lighter gray for subtle borders and section-background alternation. Sits above Pale Gray in the luminance scale.
- **Steel Blue** (`#8591b3`): frequency 5. Used as border (5). A muted blue-gray border color at the system level. Low frequency signals specialized use — likely section dividers or decorative rules.

### Color Boundary Rules

- The navy scale (#031d3c, #043367, #06458c) is the permanent brand chromatic palette. These colors may appear in backgrounds, borders, text, and gradients across all components.
- Signal Orange (#fd4f19) is a destructive-action signal. It must never appear in navigation, primary CTAs, or decorative contexts. Its presence always communicates warning or irreversible action.
- Rust Red (#b4120e) is a supporting accent for borders and emphasis text. It is not a button color and should not replace Nobel Navy for interactive elements.
- Pale Gray (#cfcfcf) and Cloud Gray (#e2e2e2) are structural divider and background colors. They are not text colors and should not appear as primary content.
- Campaign colors (L3) are documented below and change per launch cycle. Do not treat them as system-level tokens.

### Current Campaign Colors

> Extracted: 2026-06-21. These colors are campaign-level and will change with the next product launch.

| Hex | Name | Context | Expires |
|-----|------|---------|---------|
| `#d31510` | Campaign Crimson | Badge background (Destructive badge) | Next product launch |
| `#f5e9e9` | Campaign Blush | Badge background (Primary badge) | Next product launch |
| `#bb3a12` | Campaign Copper | Destructive button border | Next product launch |

## 3. Typography Rules

### Font Family

- **Primary**: `Silka Webfont`, geometric sans-serif with weight range 400–600
- **Fallback**: `sans-serif`
- **Icon font**: `webflow-icons` (Webflow system icon set)
- **OpenType Features**: None detected. The font runs at its default glyph set across all sizes.

### Hierarchy

| Role | Font | Size | Weight | Line Height | Letter Spacing | Features | Notes |
|------|------|------|--------|-------------|----------------|----------|-------|
| Display Hero | Silka Webfont | 112px (7.00rem) | 600 | 1.00 (tight) | normal | - | Maximum scale, single-word headlines — "ISPS" |
| Hero Heading | Silka Webfont | 63px (3.94rem) | 600 | 1.20 | normal | - | Primary h1, hero taglines — "Uw maritieme totaalleverancier." |
| Section Heading | Silka Webfont | 49px (3.06rem) | 600 | 1.20 | normal | - | h2/h3 section titles — "Wereldwijd de maritieme sector in vaart houden." |
| Subheading Large | Silka Webfont | 21px (1.31rem) | 600 | 1.20 | normal | - | Card titles, feature subheadings — "Nobel lanceert: unieke eigen puzzel." |
| Body CTA | Silka Webfont | 18px (1.13rem) | 600 | 1.29 | normal | - | Button labels, call-to-action links — "Wij gebruiken Cookies!" |
| Body Uppercase | Silka Webfont | 18px (1.13rem) | 400 | 1.41 | normal | - | `text-transform: uppercase` — legal/consent body copy |
| Body Content | Silka Webfont | 18px (1.13rem) | 500 | 0.89 | normal | - | Niche content at tight line-height — "LNG, GTL & HVO" |
| Body | Silka Webfont | 16px (1.00rem) | 400 | 1.45 | normal | - | Standard body text, navigation, base reading size |
| Body Strong | Silka Webfont | 16px (1.00rem) | 600 | 1.45 | normal | - | Emphasized body, button labels — "Klant worden" |
| UI Small | Silka Webfont | 14px (0.88rem) | 400 | 1.66 | normal | - | Secondary navigation, small UI labels — "Diensten" |
| HTML Base | sans-serif | 14px (0.88rem) | 400 | normal | normal | - | Browser default, `html` element base style |

### Named Strategies

- **Monoweight hierarchy**: Weight 600 governs all headings from 112px to 21px — there is no weight 700 or 300 in the system. Hierarchy is communicated through size and position, not weight contrast. This creates a unified typographic voice where every heading belongs to the same family at the same confidence level.
- **Single-width geometric identity**: Silka Webfont's consistent stroke width and geometric construction create a technical, engineered feel at every size. At 112px, the letterforms read as industrial signage; at 14px, they remain legible and purposeful.
- **Administrative typographic voice**: Uppercase body text at 18px weight 400 with 1.41 line-height serves as a distinct register for legal notices and consent copy. This separates administrative text from marketing content without introducing a second font family.
- **Size-only heading ladder**: The heading scale compresses from 112px → 63px → 49px → 21px with identical weight and line-height (1.20 for 63px/49px/21px). The 112px display breaks the 1.20 pattern with 1.00 line-height — a deliberate tightness for single-word impact.

## 4. Component Stylings

### Links

**Ghost Link**
- Background: `rgba(0,0,0,0)` (transparent)
- Text: `rgb(6,69,140)` (#06458c)
- Font: 15.75px Silka Webfont, weight 400
- Radius: 0px
- Padding: 0px
- Use: Inline navigation links, content hyperlinks (206 occurrences)

### Buttons

**Ghost Button**
- Background: `rgba(0,0,0,0)` (transparent)
- Text: `rgb(254,254,254)` (#fefefe)
- Font: 15.75px Silka Webfont, weight 600
- Radius: 7px
- Padding: 0px 14px
- Border: `1px solid rgba(0,0,0,0)` — invisible border reserving box-model space
- Use: Transparent navigation CTAs on dark backgrounds (132 occurrences)

**Secondary Button**
- Background: `rgb(254,254,254)` (#fefefe)
- Text: `rgb(10,10,10)` (#0a0a0a)
- Font: 17.5px Silka Webfont, weight 600
- Radius: 7px
- Padding: 0px 17.5px
- Border: `1px solid rgb(207,207,207)` (#cfcfcf) — Pale Gray border defines the button edge against light backgrounds
- Use: Secondary actions, cookie consent — "Wij gebruiken Cookies!" (17 occurrences)

**Primary Button**
- Background: `rgb(6,69,140)` (#06458c)
- Text: `rgb(254,254,254)` (#fefefe)
- Font: 17.5px Silka Webfont, weight 600
- Radius: 7px
- Padding: 0px 17.5px
- Use: Primary CTAs, main calls to action (10 occurrences)

**Destructive Button**
- Background: `rgb(253,79,25)` (#fd4f19)
- Text: `rgb(254,254,254)` (#fefefe)
- Font: 16px Silka Webfont, weight 400
- Radius: 10.5px — distinct from the 7px interactive-button radius, matching card radius
- Padding: 17.5px (all sides) — generous all-around padding signals high-stakes action
- Border: `1px solid rgb(187,58,18)` (#bb3a12 campaign copper)
- Use: Destructive or irreversible actions — the single most visually urgent element on the page (1 occurrence)

### Navigation

**Ghost Navigation**
- Background: `rgba(0,0,0,0)` (transparent)
- Text: `rgb(10,10,10)` (#0a0a0a)
- Font: 16px Silka Webfont, weight 400
- Radius: 0px
- Padding: 0px
- Use: Main navigation links — "Diensten" (14 occurrences)

### Footer

**Ghost Footer**
- Background: `rgba(0,0,0,0)` (transparent)
- Text: `rgb(10,10,10)` (#0a0a0a)
- Font: 16px Silka Webfont, weight 400
- Radius: 0px
- Padding: 0px
- Use: Footer links and legal copy (117 occurrences)

### Badges / Tags

**Primary Badge**
- Background: `rgb(245,233,233)` (#f5e9e9 campaign blush)
- Text: `rgb(10,10,10)` (#0a0a0a)
- Font: 15.75px Silka Webfont, weight 600
- Radius: `100%` — fully rounded pill shape
- Padding: 0px
- Use: Informational badges, category labels (6 occurrences)

**Destructive Badge**
- Background: `rgb(211,21,16)` (#d31510 campaign crimson)
- Text: `rgb(10,10,10)` (#0a0a0a)
- Font: 15.75px Silka Webfont, weight 600
- Radius: `100%` — fully rounded pill shape
- Padding: 0px
- Use: Warning or urgency badges (5 occurrences)

### Cards

**Secondary Card**
- Background: `rgb(248,248,248)` — a light gray-white distinct from #fefefe
- Text: `rgb(6,69,140)` (#06458c)
- Font: 16px Silka Webfont, weight 400
- Radius: 10.5px — the system's container radius, distinct from the 7px button radius
- Padding: 21px (all sides) — generous internal spacing
- Border: `1px solid rgb(244,244,244)` — near-invisible border for structural definition
- Use: Content cards, feature containers (4 occurrences)

## 5. Layout Principles

### Spacing System

Base unit: 4px. Scale: `4px, 28px, 56px, 72px, 92px`.

The scale is sparse — only five values — reflecting a system that favors consistent, repeatable spacing over granular adjustment.

Top spacing frequencies:
- 56px (222 occurrences) — dominant section-level vertical rhythm, the system's primary spatial beat
- 21px (132 occurrences) — internal component padding, card-to-content spacing
- 28px (123 occurrences) — secondary vertical gap, likely sub-section spacing
- 9px (114 occurrences) — compact internal spacing, inline gaps
- 92px (92 occurrences) — large section separation, hero-to-content transitions
- 11px (90 occurrences) — micro-spacing, icon-to-text gaps
- 18px (79 occurrences) — medium internal spacing
- 14px (74 occurrences) — small element spacing

### Grid & Container

- **Max content width**: 100% — full-width layout throughout, no centered max-width container
- **Column counts**: 1, 2, 3, 4, 5, 6 — flexible column grid with six-column maximum
- **Content alignment**: Full-width — sections span the viewport without constraining to a central column
- **Section spacing**: Clusters at 56px, 70px, 72px, 90px, 92px, and 744px — the 744px outlier suggests a dedicated full-viewport hero or feature section

### Whitespace Philosophy

- **Section-first spacing**: Unlike systems that distribute spacing evenly across components, Anobel concentrates whitespace at section boundaries — 56px (222 occurrences) and 92px (92 occurrences) dominate, with component-internal spacing at lower frequencies.
- **Sparse scale, high repetition**: The spacing scale contains only five values (4, 28, 56, 72, 92), but individual values repeat hundreds of times. This creates visual consistency through disciplined reuse rather than fine-grained adjustment.
- **Full-width commitment**: With `maxContentWidth: 100%`, the system avoids the centered-column convention entirely. Content spans edge-to-edge, with whitespace managed through internal padding rather than container margins.

### Border Radius Scale

- 7px (164 occurrences, DOMINANT): Ghost, Secondary, and Primary buttons — the interactive-element workhorse radius
- 10.5px (64 occurrences): Cards, images, the Destructive button — container-level radius, distinct from interactive controls
- 14px (37 occurrences): Larger containers, section wrappers, decorative elements
- 100% (21 occurrences): Badges and pills — fully rounded
- 0px 0px 14px 14px (13 occurrences): Bottom-rounded containers
- 3.5px (5 occurrences): Micro-rounding on small elements
- 14px 14px 0px 0px (4 occurrences): Top-rounded containers
- 50% (4 occurrences): Circular elements
- 14px 0px 0px 14px (4 occurrences): Left-rounded elements
- 225px 0px 0px 14px (4 occurrences): Asymmetric decorative rounding
- 0px 0px 0px 17.5px (1 occurrence): Single-corner rounding

## 6. Depth & Elevation

**Principle: Flat, no elevation.** `tokens.json` records **zero box-shadow tokens** — the system has no shadow-based elevation and does not model depth. The six gradients that exist are decorative surface treatments (image-edge fades, directional content fades, and solid color washes), not an elevation or depth scale.

### Decorative Gradients

The system has no shadows. The six extracted gradients are unrelated decorative overlays on specific cards and decorative divs — do not read them as an elevation system:

| Gradient | Value | Count | Where / use |
|----------|-------|-------|-------------|
| Navy color wash | `linear-gradient(rgba(6,69,140,0.8), rgba(6,69,140,0.8))` | 1 | Solid navy overlay at 80% opacity on a decorative div |
| Navy card sweep | `linear-gradient(270deg, rgb(3,29,60), rgb(4,51,103) 15%, rgba(6,69,140,0) 28%, rgba(255,255,255,0))` | 1 | Card background that fades navy out to transparent |
| White edge fade | `linear-gradient(90deg, rgb(254,254,254), rgba(254,254,254,0))` (+ `-90deg` variant) | 2 | Directional fade of content into transparency |
| Bottom legibility fade | `linear-gradient(rgba(255,255,255,0), rgba(255,255,255,0) 71%, rgba(10,10,10,0.8))` | 1 | Bottom-fade overlay for text-on-image legibility |
| Orange tint | `linear-gradient(rgba(253,79,25,0.55), rgba(253,79,25,0.55))` | 1 | Solid orange overlay at 55% opacity on a card |

**Dominant treatment:** Flat. The system uses **zero box-shadow** and no elevation model. The gradients above are decorative washes and fades, not depth cues.

## 6.5. Motion System

**Motion philosophy:** Motion serves utility, not spectacle. Transitions are predominantly `ease` (62 occurrences) — the browser default that communicates responsiveness without character. A smaller population of `ease-out` (30 occurrences) provides gentle deceleration for reveals. The system includes swiper carousel keyframe animations (`spin`, `swiper-preloader-spin`) for content rotation, and crucially respects `prefers-reduced-motion` (10 media query rules detected).

### Duration Scale

| Token | Duration | Frequency | Use |
|-------|----------|-----------|-----|
| small | 100ms | - | Quick hover feedback, micro-interactions |
| medium | 300ms | - | Standard transitions, button state changes |
| large | 600ms | - | Section reveals, card transitions |
| xl | 5000000ms | - | Swiper carousel autoplay interval — not a UI transition |

### Easing Functions

- **Primary**: `ease` — 62 occurrences, the system default for most transitions
- **Decelerate**: `ease-out` — 30 occurrences, content reveals and entrance animations
- **Smooth**: `cubic-bezier(0.4, 0, 0.2, 1)` — 4 occurrences, Material-style standard easing
- **Snappy**: `cubic-bezier(0.33, ...)` — 3 occurrences, quick interactions
- **Symmetric**: `ease-in-out` — 2 occurrences, looped or ping-pong animations
- **Gradual**: `cubic-bezier(0.625, ...)` — 2 occurrences, slow-build transitions
- **Constant**: `linear` — 2 occurrences, progress indicators, spinners
- **Subtle**: `cubic-bezier(0.25, ...)` — 1 occurrence, delicate hover transitions
- **Swiper variable**: `var(--swiper-wrapper-transition-timing-function, initial)` — 2 occurrences, carousel transitions

### Keyframes

Detected: `spin`, `swiper-preloader-spin` — rotation animations for loading spinners and carousel preloaders. Duration: 0.8s (`spin`).

### Reduced-Motion Fallback

**Observed:** `prefers-reduced-motion` support detected (10 media query rules). The system respects the user's OS-level motion preference.

**Recommended policy:** When `prefers-reduced-motion: reduce` is active, replace swiper carousel autoplay with static display, disable spinner rotation animations, and collapse all transitions to instant (0ms) state changes. Preserve opacity-based reveals at 0ms.

## 7. Content & Voice

### Tone

- **Institutional**: "Uw maritieme totaalleverancier." — a declarative statement of identity, not a marketing proposition
- **Direct**: "Klant worden" — imperative verb form, minimal syllable count, no softening language
- **Established**: "A. Nobel & Zn" — the full company name with partnership suffix signals generational continuity
- **Administrative**: "Wij gebruiken Cookies!" — direct legal disclosure with exclamation, not apology

### Capitalization Rules

- Headlines: Sentence case — "Uw maritieme totaalleverancier.", "Wereldwijd de maritieme sector in vaart houden."
- Buttons: Sentence case — "Klant worden", "Wij gebruiken Cookies!"
- Navigation: Title Case implied for short labels — "Diensten" (single-word, capitalized)
- Legal/consent: Sentence case — cookie notice text
- Display: ALL CAPS for acronyms — "ISPS" (inherently uppercase as an abbreviation)

### Button Label Patterns

- Action verb: "Klant worden" (Become a customer)
- Navigation: "Diensten" (Services)
- Consent: "Wij gebruiken Cookies!" (We use Cookies!)
- Service category: "LNG, GTL & HVO" (fuel types, shown as content label)

### Error/Empty State Copy

Not directly observed in extraction. Based on the institutional-direct tone, error messages should be brief and factual in Dutch: action-oriented without apology, using the formal "u" address consistent with "Uw maritieme totaalleverancier."

### Emoji Policy

None observed. Zero emoji in headings, buttons, navigation, or body copy. The brand communicates through typography and color alone.

### Voice Examples

1. "ISPS" — display hero, 112px weight 600 (homepage)
2. "Uw maritieme totaalleverancier." — hero heading, 63px weight 600 (homepage)
3. "Wereldwijd de maritieme sector in vaart houden." — section heading, 49px weight 600 (about/mission)
4. "Nobel lanceert: unieke eigen puzzel." — subheading, 21px weight 600 (blog/announcement)
5. "Wij gebruiken Cookies!" — CTA button, 18px weight 600 (cookie consent)

### Vibe Paragraph

Anobel writes like a maritime institution that has been in business for over a century and sees no need to persuade. Copy is declarative and functional — identity statements, not value propositions. The formal "uw" address maintains professional distance while the exclamation mark on "Wij gebruiken Cookies!" adds a single note of Dutch directness to an otherwise restrained voice. The absence of emoji, marketing superlatives, and softening language signals a brand that lets its navy-blue palette and century of expertise speak.

## 8. Do's and Don'ts

### Do

- Use Silka Webfont at weight 600 for all headings from 112px to 21px — the monoweight hierarchy is the typographic identity
- Use #0a0a0a for primary text on light backgrounds and #fefefe for text on dark #0a0a0a surfaces — the 19.63:1 contrast ratio is the reading baseline
- Use 7px border-radius for all interactive buttons (Ghost, Secondary, Primary) — this is the interactive-element radius workhorse at 164 occurrences
- Use 10.5px border-radius for Cards and the Destructive button — container radius is distinct from interactive radius
- Keep surfaces flat — the design uses no box-shadow and no elevation model; the only gradients are decorative overlays (color washes and edge fades), not depth cues
- Use #06458c for all interactive text, links, and primary button backgrounds — it is the sole chromatic interactive color
- Reserve #fd4f19 exclusively for destructive or warning actions — it is a signal, not a decoration
- Use 56px as the primary section-level vertical gap — it is the dominant spatial beat at 222 occurrences
- Apply `text-transform: uppercase` at 18px weight 400 for legal and consent copy — the administrative typographic voice
- Use sentence case for all Dutch-language buttons and headlines
- Keep padding consistent: 0px horizontal-only for Ghost buttons, generous all-sides for the Destructive button (17.5px)

### Don't

- Don't use weight 700 or weight 300 on Silka Webfont — the system operates exclusively at 400, 500, and 600; introducing weight 700 would break the monoweight heading identity
- Don't apply 7px border-radius to Cards — cards and containers use 10.5px; applying the button radius to cards would blur the interactive-vs-container distinction that 164 vs 64 occurrences establishes
- Don't use #fd4f19 for primary CTAs, navigation, or decorative elements — at 56 occurrences confined to a single button, orange signals destruction only; using it elsewhere would dilute the warning signal
- Don't add box-shadow or any elevation effect — the design is flat (`shadowTokens: 0`); and don't treat the decorative gradients as a depth system, they are surface overlays only
- Don't place #06458c text on #0a0a0a backgrounds — the 2.11:1 ratio fails all accessibility thresholds; Nobel Navy text requires a light background or must be inverted to #fefefe
- Don't use Pale Gray #cfcfcf as a text color — it is a border and background color only (84 border uses, 0 text uses)
- Don't center content at a fixed max-width — the system uses 100% width; introducing a max-width container would contradict the full-width layout commitment
- Don't skip the 1px transparent border on Ghost Buttons — the `1px solid rgba(0,0,0,0)` reserves box-model space to prevent layout shift when the button gains a visible border on state change
- Don't use Pill radius (100%) on buttons — pill shapes are reserved exclusively for badges; buttons use 7px or 10.5px
- Don't translate button labels to English — the site is Dutch-language; "Klant worden" and "Diensten" are the observed patterns

## 9. Accessibility Contract

**Inferred target:** WCAG 2.1 AA. Evidence: `prefers-reduced-motion` media queries detected (10 rules), minimum font size of 14px observed, and explicit focus indicator defined. Contrast performance is mixed — several common pairings fail.

### Contrast Ratios

| Role | Foreground | Background | Ratio | AA Normal | AA Large | AAA |
|------|-----------|------------|-------|-----------|----------|-----|
| Body text (light on dark) | `#fefefe` | `#0a0a0a` | 19.63:1 | Pass | Pass | Pass |
| Body text (dark on light) | `#0a0a0a` | `#fefefe` | 19.63:1 | Pass | Pass | Pass |
| CTA text on brand | `#fefefe` | `#06458c` | 9.31:1 | Pass | Pass | Pass |
| Brand text on gray | `#06458c` | `#cfcfcf` | 6.02:1 | Pass | Pass | Fail |
| Brand text on light | `#06458c` | `rgba(255,255,255,0)` | 9.38:1 | Pass | Pass | Pass |
| Dark text on brand | `#0a0a0a` | `#06458c` | 2.11:1 | **Fail** | **Fail** | **Fail** |
| Brand text on transparent | `#06458c` | `rgba(0,0,0,0)` | 2.24:1 | **Fail** | **Fail** | **Fail** |
| Dark text on transparent | `#0a0a0a` | `rgba(0,0,0,0)` | 1.06:1 | **Fail** | **Fail** | **Fail** |
| White on white | `#fefefe` | `#fefefe` | 1.00:1 | **Fail** | **Fail** | **Fail** |
| Brand on brand | `#06458c` | `#06458c` | 1.00:1 | **Fail** | **Fail** | **Fail** |
| Red accent on transparent | `#b4120e` | `rgba(0,0,0,0)` | 3.03:1 | **Fail** | **Fail** | **Fail** |
| White on transparent | `#fefefe` | `rgba(255,255,255,0)` | 1.01:1 | **Fail** | **Fail** | **Fail** |

**Failing pairs note:** Five common pairings fail AA for normal text, primarily when #06458c or #0a0a0a text renders over dark/transparent backgrounds. The transparent-background failures (rgba(0,0,0,0)) likely occur on elements that inherit a solid background from a parent — the contrast tool sees the transparent computed value but the rendered experience may differ. The #0a0a0a-on-#06458c failure at 2.11:1 is a genuine concern for any dark-text-on-navy-background usage.

### Focus Indicators

**Consistent:** No. Focus indication style varies across the site.

**Observed style:** `outline: rgb(207,207,207) solid 4px` — a 4px Pale Gray (#cfcfcf) solid outline. This was detected on some but not all interactive elements. The inconsistency means some interactive controls may lack visible focus indication entirely.

**Recommendation:** Standardize to a single focus style — `outline: #06458c solid 2px` with `outline-offset: 2px` would use the brand color for focus, improving both consistency and contrast (9.31:1 against #fefefe, though only 2.11:1 against #0a0a0a — a light outline on dark background requires a different color).

### Touch/Click Targets

- Minimum observed interactive element: 34px × 23px — below WCAG 2.1 Success Criterion 2.5.5 (44×44px target size)
- Button padding provides additional touch area: Ghost buttons at 0px 14px horizontal, Secondary/Primary at 0px 17.5px
- Destructive button: 17.5px all-sides padding creates the largest touch target among buttons
- Minimum font size: 14px (meets WCAG minimum for body text)

### Reduced-Motion Support

**Observed:** Yes — 10 `prefers-reduced-motion` media query rules detected. Swiper carousel animations, spinner keyframes, and CSS transitions are gated behind the user's OS preference.

### ARIA Patterns

| Role | Count | Context |
|------|-------|---------|
| `button` | 8 | Interactive button elements |
| `list` | 55 | Navigation and content lists |
| `listitem` | 266 | List items within navigation and content |
| `status` | 5 | Live region status announcements |

ARIA usage is basic — standard `button`, `list`, and `listitem` roles cover interactive and structural elements. No `aria-live` regions for dynamic content updates were detected beyond `status` roles. No `aria-expanded`, `aria-label`, or `aria-describedby` patterns were observed.

## 10. Responsive Behavior

### Breakpoints

| Name | Width | CSS Rules | Key Changes |
|------|-------|-----------|-------------|
| Desktop (max) | 991px max-width | 2,482 | Primary responsive threshold — likely triggers tablet layout |
| Mobile Large | 767px max-width | 1,131 | Secondary threshold — single-column layouts |
| Mobile Small | 479px max-width | 1,237 | Smallest viewport — maximum simplification |
| Tablet Portrait | 768px max-width | 5 | Minor adjustment threshold |
| Ultra-Wide | 5120px max-width | 5 | 5K display ceiling |
| Wide QHD | 2560px max-width | 5 | 1440p display ceiling |
| Wide FHD | 1920px max-width | 5 | 1080p display ceiling |
| Standard Wide | 1440px max-width | 5 | Standard desktop ceiling |
| Motion | prefers-reduced-motion | 10 | Accessibility gate for animations |
| Hover | hover:hover | 35 | Touch-device hover suppression |

### Touch Targets

- Ghost buttons rely on text size (15.75px) and horizontal padding (0px 14px) for touch area — minimal vertical touch surface
- Secondary/Primary buttons at 17.5px font size with horizontal-only padding — touch height equals font line-height
- Destructive button with 17.5px all-sides padding provides the largest touch target
- Navigation links at 16px weight 400 with 0px padding — touch area depends on surrounding layout
- Minimum detected target of 34×23px is below the WCAG 44×44px recommendation

### Collapsing Strategy

- Column grid: 6-column maximum at widest → collapses through 5, 4, 3, 2, to single column at 479px
- The 991px breakpoint (2,482 rules) is the primary layout reconfiguration point — likely the tablet/desktop boundary
- 767px breakpoint (1,131 rules) triggers major mobile reflow — navigation likely switches from horizontal to toggle
- 479px breakpoint (1,237 rules) handles the smallest screens — maximum simplification
- Section spacing likely compresses from 92px/56px dominant values to tighter values at mobile
- Display Hero at 112px likely scales down significantly at mobile breakpoints — text at this size would overflow small viewports

### Image Behavior

- Images use 10.5px border-radius (64 occurrences) — the container radius applied to media
- Asymmetric corner rounding observed: `14px 0px 0px 14px` for left-rounded images, `0px 0px 14px 14px` for bottom-rounded
- Cards contain images with matching 10.5px radius and 21px internal padding
- Edge-to-edge full-width layout means images have no container max-width constraint

## 11. State Matrix

| Component | Loading | Empty | Error | Disabled | Success |
|-----------|---------|-------|-------|----------|---------|
| Button (Primary) | Swiper preloader spin, 0.8s rotation | n/a | - | - | - |
| Button (Destructive) | - | n/a | - | - | - |
| Button (Ghost/Secondary) | - | n/a | - | - | - |
| Link (Ghost) | - | n/a | - | - | - |
| Card | Gradient overlay `rgba(6,69,140,0.8)` as decorative state | - | - | - | - |
| Badge | - | - | - | - | - |
| Navigation | - | - | - | - | - |

State observations are sparse — the extraction did not capture interactive state changes (hover, focus, active, disabled) for most components beyond the focus indicator outline. Loading states reference the swiper `spin` keyframe animation at 0.8s, which applies to carousel preloaders.

### Skeleton/Shimmer Patterns

No skeleton or shimmer loading patterns were observed. The site likely relies on spinner animations (swiper preloader `spin` keyframe) for loading states rather than content-placeholder skeletons.

## 12. Iconography

### Icon System

- **Library detected**: Custom SVG icons via Webflow icon system (`webflow-icons` font)
- **Stroke weight**: 1px — thin, minimal stroke
- **Grid sizes observed**: 0px, 18px, 21px — three distinct icon dimensions
- **Style**: Mixed — 5 occurrences use `currentColor` (inheriting text color), 10 occurrences use fixed fill colors, 0 occurrences are stroke-only
- **Total icons**: 535 across all extracted pages

### Sizing Scale

| Size | Frequency | Use |
|------|-----------|-----|
| 0px | - | Hidden/decorative icons, possibly spacer elements |
| 18px | - | Inline with body text (16px–18px), button companions |
| 21px | - | Larger UI icons, section markers |

### Icon-to-Text Alignment

- Icons primarily use `currentColor` (5 occurrences) to inherit surrounding text color — principally #06458c and #fefefe
- Fixed-fill icons (10 occurrences) do not respond to text color changes — likely decorative or brand-locked elements
- Zero stroke-only icons suggests icons are either solid-filled or font-based, not outlined
- The 1px stroke weight combined with currentColor inheritance creates fine, text-harmonized icon lines

### Substitution Recommendation

**Substitution:** Custom Webflow icon font detected. Closest open alternatives: **Lucide** (matching 1px default stroke weight, 24px grid — slightly larger than the observed 18–21px range) or **Phosphor Icons** (thin weight variant at 1px stroke). When substituting, use `currentColor` on all functional icons and reserve fixed fills for brand-locked decorative icons only.

## 13. Agent Prompt Guide

### Quick Color Reference

- Primary background/dark surface: Abyssal Black (`#0a0a0a`)
- Light text/surface: Bright White (`#fefefe`)
- Brand accent/interactive: Nobel Navy (`#06458c`)
- Destructive signal: Signal Orange (`#fd4f19`)
- Structural borders: Pale Gray (`#cfcfcf`), Cloud Gray (`#e2e2e2`)
- Pure black structural: Pure Black (`#000000`)
- Gradient dark endpoint: Midnight Navy (`#031d3c`)
- Gradient midpoint: Deep Navy (`#043367`)
- Secondary accent: Rust Red (`#b4120e`)
- Steel border: Steel Blue (`#8591b3`)

### Self-Containment Checklist

Every prompt below satisfies:
- [ ] Font family, size, weight, line-height, letter-spacing specified
- [ ] All colors as hex (never "the primary color")
- [ ] Padding, radius, shadow/gradient values included
- [ ] Hover/focus state values included where observed
- [ ] Transition values included where observed

**Test:** Can an AI agent build this component without looking anything else up?

### Example Component Prompts

- "Build a Primary CTA button: background `#06458c`, text `#fefefe`, font Silka Webfont 17.5px weight 600 line-height 1.29, border-radius 7px, padding 0px 17.5px, no border, no shadow. Text label example: 'Klant worden'. This is the primary action button on the page."

- "Build a Secondary button: background `#fefefe`, text `#0a0a0a`, font Silka Webfont 17.5px weight 600 line-height 1.29, border-radius 7px, padding 0px 17.5px, border `1px solid #cfcfcf`, no shadow. Text label example: 'Wij gebruiken Cookies!'. Use for secondary actions and consent prompts."

- "Build a Ghost button: background transparent, text `#fefefe`, font Silka Webfont 15.75px weight 600, border-radius 7px, padding 0px 14px, border `1px solid rgba(0,0,0,0)`. Use on dark `#0a0a0a` backgrounds only — the invisible border reserves box-model space for state changes."

- "Build a Destructive button: background `#fd4f19`, text `#fefefe`, font Silka Webfont 16px weight 400, border-radius 10.5px, padding 17.5px all sides, border `1px solid #bb3a12`. Use exclusively for irreversible or warning actions. The 10.5px radius matches Card radius, not the 7px button radius."

- "Create a Card component: background `rgb(248,248,248)`, text `#06458c`, font Silka Webfont 16px weight 400, border-radius 10.5px, padding 21px all sides, border `1px solid rgb(244,244,244)`. Optionally apply the decorative navy overlay `linear-gradient(270deg, #031d3c, #043367 15%, rgba(6,69,140,0) 28%, rgba(255,255,255,0))` (a fade-out wash, not a depth cue). No box-shadow."

- "Build a navigation bar: links use Silka Webfont 16px weight 400, color `#0a0a0a`, padding 0px, border-radius 0px, background transparent. Navigation labels are Dutch sentence case: 'Diensten'. Include a right-aligned Ghost CTA button at 15.75px weight 600, text `#fefefe`, radius 7px, padding 0px 14px, on a dark `#0a0a0a` nav background."

- "Create a Primary Badge: background `#f5e9e9`, text `#0a0a0a`, font Silka Webfont 15.75px weight 600, border-radius 100%, padding 0px. For a Destructive Badge variant, change background to `#d31510` and keep all other properties identical. Badges are fully rounded pills, distinct from the 7px and 10.5px radius of buttons and cards."

### Iteration Guide

1. Start every component with Silka Webfont — weight 600 for headings and CTAs, weight 400 for body text and navigation, weight 500 for niche content only
2. Text-on-dark uses `#fefefe`; text-on-light uses `#0a0a0a` — never place `#06458c` text on `#0a0a0a` backgrounds (2.11:1 contrast ratio fails)
3. Interactive radius is 7px; container radius is 10.5px — never swap these; the 164-occurrence button radius and 64-occurrence card radius serve distinct visual roles
4. The design is flat — zero box-shadow and no elevation model; do not add depth effects. The decorative gradients (color washes, edge fades) are surface overlays only, not a depth system
5. `#fd4f19` means destruction — it belongs exclusively on the Destructive button; never use it for primary CTAs, navigation, badges, or decoration
6. Respect the two-radius vocabulary: 7px (interactive), 10.5px (containers), 100% (badges only) — do not introduce intermediate radii like 8px, 12px, or pill-shaped buttons
7. Section spacing defaults to 56px vertical — the dominant spatial beat at 222 occurrences; use 92px for major section transitions, 28px for sub-section gaps
8. All headings use weight 600 — there is no weight 700, 300, or 400 in the heading system; hierarchy comes from size alone (112px → 63px → 49px → 21px)

## 17. Design Tokens Dictionary

| Token | Value | Category | Notes |
|-------|-------|----------|-------|
| `--_typography---line-height--body` | `145%` | typography | Body text line-height |
| `--_typography---size--h1` | `4rem` | typography | h1 font size (64px at default root) |
| `--_typography---line-height--heading` | `120%` | typography | Heading line-height ratio |
| `--_typography---size--h2` | `3.5rem` | typography | h2 font size (56px) |
| `--_typography---size--h3` | `3rem` | typography | h3 font size (48px) |
| `--_typography---size--h4` | `2.5rem` | typography | h4 font size (40px) |
| `--_typography---size--h5` | `2rem` | typography | h5 font size (32px) |
| `--_typography---size--h6` | `1.5rem` | typography | h6 font size (24px) |
| `--_typography---line-height--component` | `100%` | typography | Component text line-height |
| `--_layout---radius--small` | `.25rem` | layout | 4px radius (small elements) |
| `--_layout---radius--base` | `.5rem` | layout | 8px radius (base) |
| `--_layout---radius--extra-small` | `.125rem` | layout | 2px radius (micro elements) |
| `--_layout---radius--extra-large` | `1rem` | layout | 16px radius (large containers) |
| `--_layout---radius--large` | `.75rem` | layout | 12px radius (medium-large) |
| `--_layout---radius--circle` | `100%` | layout | Pill/circle radius |
| `--_layout---radius--none` | `0px` | layout | Square, no rounding |
| `--_layout---radius--display` | `1.5rem` | layout | 24px radius (display elements) |
| `--_layout---spacing--extra-small` | `clamp(2rem,5vh,4rem)` | layout | Responsive small spacing |
| `--_layout---spacing--medium` | `clamp(6rem,10vh,8rem)` | layout | Responsive medium spacing |
| `--_layout---spacing--large` | `clamp(7.5rem,15vh,12.5rem)` | layout | Responsive large spacing |
| `--_layout---spacing--small` | `clamp(4rem,7.5vh,6rem)` | layout | Responsive small spacing |
| `--_layout---spacing--extra-large` | `clamp(12.5rem,25vh,17.5rem)` | layout | Responsive extra-large spacing |

Semantic CSS tokens define a systematic typography and layout scale that maps to the extracted design values. Spacing tokens use `clamp()` for viewport-responsive scaling, while radius tokens use fixed `rem` units. Two deleted variable records (`typography-size--h4`, `typography-size--h6`, `typography-line-height--caption`) suggest an active token system under revision, with the `_typography---` and `_layout---` prefix convention indicating a structured design-token naming hierarchy.
