<!-- Generated: 2026-06-22 | Source: https://anobel.com | Pages: 5 | Framework: webflow | Format: v2 -->
<!-- This is not the official design system. Colors, fonts, and spacing may not be 100% accurate. -->

# Design System: A. Nobel & Zn

## 0. Brand Context

A. Nobel & Zn is a Dutch maritime total supplier providing ship bunkering, lubricants, ISPS terminal services, and online webshop access for the shipping industry. The site targets captains, fleet operators, port agents, and maritime procurement professionals who need fuel, services, and logistics support at scale.

- **Authoritative** — weight 600 headlines at 112px–49px on a near-black (`#0a0a0a`) and off-white (`#fefefe`) canvas signal operational confidence without promotional noise
- **Industrial** — the near-absence of chromaticity outside the blue secondary (`#06458c`) and orange primary (`#fd4f19`) mirrors a working port: functional color, not branded color
- **Direct** — body text at 16px/23.2px, buttons at 14px–16px weight 600, and uppercase 18px labels collapse navigation and CTA into immediate, scannable instructions
- **Dutch-pragmatic** — `lang="nl"` across all pages, `e2e2e2` / `cfcfcf` border grays replace decorative visual layers with structural clarity

Sources: `https://anobel.com`, `https://anobel.com/nl`, `https://anobel.com/`, `https://anobel.com/nl/scheepsbunkering`.

## 1. Visual Theme & Atmosphere

A. Nobel & Zn's website is maritime logistics rendered as visual infrastructure — a near-black and near-white canvas (`#0a0a0a` / `#fefefe`) where the only color signals are operational blue (`#06458c`) and the urgent orange of a port warning beacon (`#fd4f19`).

The overall page opens on a `#fefefe` background carrying `#0a0a0a` text at 16px/23.2px — a near-maximum 19.63:1 contrast ratio that treats reading like navigation: every word must survive scanning from a bridge console. The secondary blue `#06458c` anchors 7280 border elements and 3040 text instances across 4 pages, making it the structural chromatic axis — it marks links, section dividers, and interactive affordances with the same color a maritime chart uses for depth contours. The primary orange `#fd4f19` appears at only 56 total occurrences (44 border, 5 background, 5 icon, 2 gradient), reserved for a single destructive button variant and sparse highlight borders — it signals "pay attention" by being nearly absent.

The defining typographic element is `Silka Webfont` at weight 600 across every heading tier. There is no weight 700 anywhere in the system — the semibold at 600 is the ceiling. The display hero (112px/112px, weight 600) compresses "ISPS" into a four-letter industrial mark; headlines descend through 63px, 49px, and 21px at identical weight 600 with normal letter-spacing — no negative tracking, no OpenType features, no typographic ornament. This is typography that treats letters like hull plates: uniform thickness, straight edges, zero flourish.

Where the system departs from convention is in its refusal to use CSS `border` for structural separation. The extraction shows 5302 border-color usages via `#fefefe`, 9685 via `#0a0a0a`, and 7280 via `#06458c` — but these operate as explicit `border` properties with colors, not as shadow-borders or pseudo-elevations. The site uses color-on-color borders as spatial grammar: a `#0a0a0a` border on a `#fefefe` background, a `#06458c` border on a `#fefefe` card. No `box-shadow` tokens were extracted — the entire depth system is flat, defined by hard-edged color boundaries rather than atmospheric blur.

**Design Principles:**
- **Flat Color Borders**: Structural separation relies entirely on `border` with explicit hex colors — `#0a0a0a` at 9685 border occurrences, `#06458c` at 7280 — replacing elevation with chromatic adjacency (backed by 0 shadow tokens)
- **Single-Weight Typography**: Weight 600 is the only heading weight; body at 400 and 500 fills the lower register, creating a two-tier system where all headings share identical visual mass regardless of size

- Display at 112px/112px weight 600 Silka — text as industrial mark, four letters ("ISPS") occupying full viewport attention
- All headings at weight 600 across 112px, 63px, 49px, 21px — a single-weight family where size alone drives hierarchy
- Body text at 16px/23.2px Silka weight 400 — 1.45 line-height ratio producing generous reading lanes without decorative leading
- `#0a0a0a` on `#fefefe` at 19.63:1 contrast — text legibility engineered for scanning, not comfortable reading
- `#06458c` as the chromatic workhorse at 10405 total occurrences — border, text, and gradient color unified under a single secondary blue
- `#fd4f19` reserved at 56 occurrences — primary orange as the exception signal, not the default accent
- 2482 CSS rules inside `max-width: 991px` — a mobile-first responsive cascade where desktop is the exception
- `7px` border-radius dominating 170 button/div/a elements — the system's single dominant radius, used for interactive affordances
- Zero `box-shadow` tokens across 4531 elements — the entire site renders flat, depending on borders and contrast for spatial reading
- `cfcfcf` / `e2e2e2` at 119 and 75 occurrences serving as border and background grays — the only neutral mid-tones in a deliberately binary palette
- `lang="nl"` with Dutch sample texts throughout — the system is monolingual Dutch with no detected i18n strategy
- Gradient cards at `linear-gradient(rgba(6, 69, 140, 0.8), rgba(6, 69, 140, 0.8))` and `linear-gradient(rgba(253, 79, 25, 0.55), rgba(253, 79, 25, 0.55))` — flat-color overlays on card surfaces, not atmospheric depth

## 2. Color Palette & Roles

| Hex | Usage (measured) | Frequency | CSS var |
|-----|------------------|-----------|---------|
| `#0a0a0a` | border 9685, text 4258, background 10, icon 5, gradient 4 | 13962 | `--_color-primitives---neutral--1400` |
| `#06458c` | border 7280, text 3040, background 83, gradient 2 | 10405 | `--_color-primitives---secondary--500` |
| `#fefefe` | border 5302, text 2138, background 97, gradient 12 | 7549 | `--_color-primitives---neutral--0` |
| `#b4120e` | border 125, text 50 | 175 | `--_color-primitives---negative--700` |
| `#cfcfcf` | border 88, background 31 | 119 | `--_color-primitives---neutral--800` |
| `#e2e2e2` | border 57, background 18 | 75 | `--_color-primitives---neutral--700` |
| `#fd4f19` | border 44, background 5, icon 5, gradient 2 | 56 | `--_color-primitives---primary--500` |
| `#000000` | border 25, text 10 | 35 | - |
| `#031d3c` | border 20, gradient 4 | 24 | `--_color-primitives---secondary--1000` |
| `#043367` | background 6, gradient 4 | 10 | `--_color-primitives---secondary--800` |
| `#8591b3` | border 5 | 5 | `--_color-primitives---secondary--400` |

### Current Campaign Colors (Subject to change)

| Hex | Usage (measured) | Frequency | CSS var |
|-----|------------------|-----------|---------|
| `#4bae4f` | background 5 | 5 | `--_color-primitives---positive--500` |
| `#e6f4e5` | background 5 | 5 | `--_color-primitives---positive--100` |
| `#bb3a12` | border 4 | 4 | `--_color-primitives---primary--800` |

## 3. Typography Rules

| Role | Font | Size / Line | Weight | Letter-spacing | Transform |
|------|------|-------------|--------|----------------|-----------|
| div | `Silka Webfont` | 112px / 112px | 600 | normal | none |
| div | `Silka Webfont` | 63px / 75.6px | 600 | normal | none |
| h2 | `Silka Webfont` | 49px / 58.8px | 600 | normal | none |
| div | `Silka Webfont` | 21px / 25.2px | 600 | normal | none |
| div | `Silka Webfont` | 18px / 25.375px | 400 | normal | uppercase |
| div | `Silka Webfont` | 18px / 23.2px | 600 | normal | none |
| p | `Silka Webfont` | 18px / 16px | 500 | normal | none |
| body | `Silka Webfont` | 16px / 23.2px | 400 | normal | none |
| button | `Silka Webfont` | 16px / 23.2px | 600 | normal | none |
| html | `sans-serif` | 14px / normal | 400 | normal | none |
| button | `Silka Webfont` | 14px / 23.2px | 400 | normal | none |

## 4. Component Stylings

### Buttons

**Ghost Button**
- Background: `rgba(0, 0, 0, 0)`
- Text: `#fefefe`, `15.75px`, `Silka Webfont`, weight 600
- Padding: `0px 14px 0px 14px`
- Radius: `7px`
- Border: `1px solid rgba(0, 0, 0, 0)`
- Hover: border-color shifts to `#06458c` — the blue border appearance signals actionability against the transparent background
- Focus-visible: `rgb(207, 207, 207) solid 0px` outline
- Transition: `color 0.2s ease-out, background-color 0.2s ease-out, border-color 0.2s ease-out`
- Use: "Klant worden", "Diensten", "Dit is Nobel"

**Secondary Button**
- Background: `#fefefe`
- Text: `#0a0a0a`, `17.5px`, `Silka Webfont`, weight 600
- Padding: `0px 17.5px 0px 17.5px`
- Radius: `7px`
- Border: `1px solid #cfcfcf`
- Hover: border-color shifts to `#06458c` — the blue halo signals interactivity on an otherwise neutral button
- Focus-visible: `rgb(207, 207, 207) solid 0px` outline
- Transition: `color 0.2s ease-out, background-color 0.2s ease-out, border-color 0.2s ease-out`
- Use: "Cookie-instellingen", "Nee, bedankt!", "Ontdek meer"

**Primary Button**
- Background: `#06458c`
- Text: `#fefefe`, `17.5px`, `Silka Webfont`, weight 600
- Padding: `0px 17.5px 0px 17.5px`
- Radius: `7px`
- Hover: border-color shifts to `#06458c` — reinforces the filled state without color shift
- Focus-visible: `rgb(207, 207, 207) solid 0px` outline
- Transition: `color 0.2s ease-out, background-color 0.2s ease-out, border-color 0.2s ease-out`
- Use: "Alle cookies accepteren", "Webshop"

**Destructive Button**
- Background: `#fd4f19`
- Text: `#fefefe`, `16px`, `Silka Webfont`, weight 400
- Padding: `17.5px 17.5px 17.5px 17.5px`
- Radius: `10.5px`
- Border: `1px solid #bb3a12`
- Focus-visible: `rgb(207, 207, 207) solid 0px` outline
- Transition: `color 0.2s ease-out`
- Use: "Shop de bunkerproducten online."

### Cards & Containers

**Secondary Card**
- Background: `#f8f8f8`
- Text: `#06458c`, `16px`, `Silka Webfont`, weight 400
- Padding: `28px 28px 28px 28px`
- Radius: `14px`
- Border: `1px solid #f4f4f4`
- Transition: `all`
- Use: "Contact", "Vragen? Nobel staat klaar.", "info@anobel.nl"

**Branded Gradient Card**
- Gradient: `linear-gradient(rgba(6, 69, 140, 0.8), rgba(6, 69, 140, 0.8))` — a flat-blue overlay used as card surface treatment
- Secondary gradient: `linear-gradient(rgba(253, 79, 25, 0.55), rgba(253, 79, 25, 0.55))` — an orange overlay reserved for campaign cards
- Location: card-level decorative overlays, observed on `/nl/scheepsbunkering`

### Badges / Tags / Pills

**Primary Badge**
- Background: `#4bae4f`
- Text: `#0a0a0a`, `15.75px`, `Silka Webfont`, weight 600
- Radius: `100%`
- Padding: `0px 0px 0px 0px`
- Transition: `all`
- Use: campaign status indicators [INFERRED — no sample text captured]

**Variant-1 Badge**
- Background: `#e6f4e5`
- Text: `#0a0a0a`, `15.75px`, `Silka Webfont`, weight 600
- Radius: `100%`
- Padding: `0px 0px 0px 0px`
- Transition: `background-color 0.3s`
- Use: lighter status variant paired with Primary Badge [INFERRED — no sample text captured]

### Navigation

**Ghost Navigation**
- Background: `rgba(0, 0, 0, 0)`
- Text: `#0a0a0a`, `16px`, `Silka Webfont`, weight 400
- Radius: `0px`
- Padding: `0px 0px 0px 0px`
- Transition: `all`
- Use: "Cookie instellingen", navigation links, registration triggers

### Links

**Ghost Link**
- Background: `rgba(0, 0, 0, 0)`
- Text: `#06458c`, `15.75px`, `Silka Webfont`, weight 400
- Radius: `0px`
- Padding: `0px 0px 0px 0px`
- Hover: color shifts to `#031d3c`, border-color to `#031d3c` — darkens the blue to signal the link is traversable
- Focus-visible: `rgb(207, 207, 207) solid 4px` outline
- Focus: color shifts to `rgb(4, 42, 85)`, border-color to `rgb(4, 42, 85)`
- Active: color shifts to `rgb(9, 30, 55)`, border-color to `rgb(9, 30, 55)` — deepest blue at the point of activation
- Transition: `color 0.2s ease-out`
- Use: "privacy voorwaarden", "Klant worden"

### Footer

**Ghost Footer**
- Background: `rgba(0, 0, 0, 0)`
- Text: `#0a0a0a`, `16px`, `Silka Webfont`, weight 400
- Radius: `0px`
- Padding: `0px 0px 0px 0px`
- Transition: `all`
- Use: "Contact", "Vragen? Nobel staat klaar.", "info@anobel.nl"

## 5. Layout Principles

### Spacing System

Base unit: `4px`. The dominant spacing values across the system:

- 21px (137 occurrences) — internal card and component padding
- 56px (222 occurrences) — section-level vertical spacing, the system's primary gap
- 18px (85 occurrences) — compact component spacing
- 28px (126 occurrences) — card padding and medium component gaps
- 92px (92 occurrences) — large section separators
- 11px (93 occurrences) — tight internal spacing
- 14px (75 occurrences) — button and inline element padding
- 9px (114 occurrences) — micro-spacing between adjacent elements

Section spacing values: 56px, 70px, 72px, 90px, 92px, 744px.

### Grid & Container

Max content width: `100%` (full-width layout). Column counts range from 1 through 6 across pages. The hero uses a single-column full-width layout with 112px display text. Feature sections collapse into 2- and 3-column card grids. The video container is set to `0px` (edge-to-edge).

### Whitespace Philosophy

- **Clamp-based vertical rhythm**: Section spacing uses `clamp(2rem, 5vh, 4rem)` through `clamp(15rem, 30vh, 20rem)` across 6 distinct spacing tiers — vertical space scales with viewport, not content
- **Generous section breathing**: 56px–92px between sections with a 744px maximum (observed on the `/nl/scheepsbunkering` page), creating deliberate content islands rather than continuous scroll
- **Zero shadow, border-only separation**: With no `box-shadow` tokens, all spatial separation is achieved through `border` properties — a `#0a0a0a` border on white defines a section edge as crisply as a port container stack

### Border Radius Scale

- 7px: 170 occurrences — buttons, divs, links. The system's dominant radius.
- 10.5px: 64 occurrences — images, divs, links. A softer alternative for non-interactive surfaces.
- 14px: 37 occurrences — divs, images, sections. Card-level corner softening.
- 100%: 21 occurrences — pill badges, circular treatments.
- 0px 0px 14px 14px: 13 occurrences — bottom-only radius, asymmetric card treatments.
- 3.5px: 5 occurrences — micro-radius detail elements.

## 6. Depth & Elevation

**Flat.** Zero shadow tokens were extracted; the system uses no box-shadow elevation.

6 decorative gradients were captured (surface treatments, NOT a depth or elevation system):

| Gradient | Where |
|----------|-------|
| `linear-gradient(rgba(255, 255, 255, 0), rgba(255, 255, 255, 0) 71%, rgba(10, 10,` | decorative |
| `linear-gradient(90deg, rgb(254, 254, 254), rgba(254, 254, 254, 0))` | decorative |
| `linear-gradient(-90deg, rgb(254, 254, 254), rgba(254, 254, 254, 0))` | decorative |
| `linear-gradient(270deg, rgb(3, 29, 60), rgb(4, 51, 103) 15%, rgba(6, 69, 140, 0)` | card |
| `linear-gradient(rgba(6, 69, 140, 0.8), rgba(6, 69, 140, 0.8))` | decorative |
| `linear-gradient(rgba(253, 79, 25, 0.55), rgba(253, 79, 25, 0.55))` | card |

## 6.5. Motion System

### Motion Philosophy

Transition timing is slow by web standards — 300ms as the dominant duration (262 occurrences) with 150ms for hover feedback (12 occurrences). Motion serves as structural confirmation, not micro-interaction delight: elements shift color and border over 200ms-300ms `ease` and `ease-out` curves.

### Duration Scale

| Duration | Frequency | Use |
|----------|-----------|-----|
| 150ms | 12 | Hover color feedback on buttons and links |
| 300ms | 262 | System default — color, background-color, border-color transitions across components |
| 600ms | 46 | Large element transitions (swiper carousel, cookie banner reveal) |
| 5000000ms | 17 | Swiper infinite-loop timing parameter (not a visual transition) |

### Easing Functions

- `ease`: 327 occurrences — the system default; used on color, background, and border transitions
- `ease-out`: 152 occurrences — button and link hover exits; the deceleration creates a settling effect
- `ease-in-out`: 10 occurrences
- `linear`: 8 occurrences
- `cubic-bezier` variants: 38 occurrences across swiper carousel timing functions

### Enter/Exit Choreography

No dediated enter/exit animations were detected. The system relies on instant layout changes with transitional color and border properties over 200ms-300ms — elements appear at their final size and position, then transition their visual properties.

### Reduced-Motion Fallback

**Observed:** `prefers-reduced-motion: reduce` detected with 10 CSS rules. The system supports reduced-motion natively. 3 keyframe animation definitions exist: `spin` (transform rotation), `download-spin` (0.8s), and `swiper-preloader-spin` (1s).

## 7. Content & Voice

### Tone

- **Direct**: "Klant worden" (not "Become a customer today"), "Shop de bunkerproducten online" — imperative, no softening
- **Institutional**: "Uw maritieme totaalleverancier" — formal Dutch address ("uw"), positioning the brand as a partner, not a vendor
- **Functional**: "Wereldwijd de maritieme sector in vaart houden" — the value proposition is operational, not emotional
- **Transparent**: Cookie consent uses explicit categories ("Cookie-instellingen") with clear opt-out ("Nee, bedankt!") — no dark patterns

### Capitalization Rules

- Headlines: Sentence case ("Uw maritieme totaalleverancier.", "Wereldwijde bunkering.")
- Navigation: Sentence case ("Diensten", "Klant worden")
- Buttons: Sentence case ("Alle cookies accepteren", "Ontdek meer")
- Uppercase labels: `text-transform: uppercase` on `18px` weight 400 Silka — used for cookie banner headings and micro-labels

### Button Label Patterns

- Action + Object: "Klant worden", "Shop de bunkerproducten online"
- Navigation: "Diensten", "Webshop", "Ontdek meer"
- Consent: "Alle cookies accepteren", "Cookie-instellingen", "Nee, bedankt!"
- Brand: "Dit is Nobel"

### Error/Empty State Copy

No error or empty state copy was observed in the extraction. Cookie consent provides the only interactive decision flow: a banner with accept/configure/reject choices using direct Dutch copy.

### Emoji Policy

Observed: Zero emoji in any page content, navigation, buttons, or CTAs. Text-only communication throughout.

### Voice Examples

1. "Uw maritieme totaalleverancier." (hero headline)
2. "Wereldwijd de maritieme sector in vaart houden." (mission statement)
3. "Alle expertise op een locatie." (feature section heading)
4. "Shop uw Nobel producten online." (webshop CTA)
5. "Wij gebruiken Cookies! We gebruiken cookies om uw ervaring op onze website te verbeteren." (cookie consent banner)

### Vibe Paragraph

A. Nobel & Zn writes like a port operations manual — direct, unambiguous, and procedural. Copy assumes the reader knows what ISPS means, what bunkering entails, and why "wereldwijd" (worldwide) is a claim worth making. The use of formal Dutch "uw" throughout signals institutional reliability over casual engagement. The absence of hedging, exclamation marks beyond the cookie notice, and decorative language treats every word as a signal in a high-stakes operational environment where clarity prevents expensive mistakes.

## 8. Do's and Don'ts

### Do

- Use `#06458c` for all link colors — it is the system's chromatic anchor at 3040 text and 7280 border occurrences
- Use `#0a0a0a` on `#fefefe` for body text — the 19.63:1 ratio is the reading contract
- Use `7px` border-radius on all interactive elements — buttons, links, and interactive divs share this single dominant radius
- Use `Silka Webfont` at weight 600 for every heading level — 112px, 63px, 49px, 21px, and 18px all at the same weight
- Use weight 400 for body text (16px/23.2px) and weight 500 only for the rare 18px/16px paragraph style
- Use `color 0.2s ease-out` for hover transitions on links — the 0.2s duration is the link-specific timing
- Use `color 0.2s ease-out, background-color 0.2s ease-out, border-color 0.2s ease-out` for button transitions — the full property spread preserves state coherence
- Use flat `border` with explicit hex colors for all spatial separation — there are zero `box-shadow` tokens in the system
- Use `28px` padding on cards — it matches the 126-occurrence spacing tier and the extracted card variant
- Use `14px` border-radius for cards (`#f8f8f8` background) — the 37-occurrence radius distinguishes containers from buttons

### Don't

- Don't add `box-shadow` to any element — the system has zero shadow tokens; any shadow is an invention
- Don't use weight 700 (bold) anywhere — 600 is the ceiling, used exclusively for headings and buttons
- Don't use negative letter-spacing — all 11 typography levels use `normal` tracking; compressed text is not part of this system
- Don't use OpenType features — no `ss01`, `cv01`, or ligature features were detected; the font plays straight
- Don't use `#fd4f19` as a general accent — it appears at only 56 occurrences and is reserved for the destructive button variant and sparse highlight borders
- Don't exceed `14px` border-radius for containers — 10.5px and 14px are the maximums; higher values would contradict the system's flat-plane identity
- Don't use gradient overlays as depth — the 6 detected gradients are surface treatments on specific card locations, not an elevation system
- Don't center-align body text — the Dutch reading layout uses the full `100%` content width with left-aligned or grid-aligned text
- Don't add decorative icons — the 535-icon system uses stroke-width 1 at sizes 0-188px with mixed color modes; icons are functional, not ornamental
- Don't translate copy — the system is monolingual Dutch (`lang="nl"`) with zero detected i18n infrastructure; introducing other languages breaks the institutional voice

## 9. Accessibility Contract

### WCAG Target

**Inferred target:** WCAG 2.1 AA. Evidence: the dominant body-text pair (`#0a0a0a` on `#fefefe`) achieves 19.63:1 contrast, focus indicators are captured on links and buttons, and `prefers-reduced-motion` is supported natively.

### Contrast Ratios

| Role | Foreground | Background | Ratio | AA | AAA |
|------|-----------|------------|-------|-----|-----|
| Body text | `#0a0a0a` | `#fefefe` | 19.63:1 | Yes | Yes |
| Link text | `#06458c` | `#fefefe` | 9.31:1 | Yes | Yes |
| Primary button text | `#fefefe` | `#06458c` | 9.31:1 | Yes | Yes |
| Badge text | `#0a0a0a` | `#4bae4f` | 7.04:1 | Yes | Yes |
| Badge text (variant) | `#0a0a0a` | `#e6f4e5` | 17.38:1 | Yes | Yes |
| Card text | `#06458c` | `#f8f8f8` | 8.84:1 | Yes | Yes |
| Destructive button text | `#fefefe` | `#fd4f19` | 3.30:1 | No | No |
| Error text | `#b4120e` | `#fefefe` | 6.86:1 | Yes | No |
| Secondary button border | `#06458c` | `#cfcfcf` | 6.02:1 | Yes | No |
| Link on neutral | `#0a0a0a` | `#e2e2e2` | 15.28:1 | Yes | Yes |

The `#fefefe` on `#fd4f19` destructive button at 3.30:1 fails AA — this is the system's only substantive contrast failure in an interactive element.

### Focus Indicators

Focus is captured on links and buttons but is **not consistent** across components:

- **Link focus-visible**: `rgb(207, 207, 207) solid 4px` outline — a 4px gray ring unique to links
- **Button focus-visible**: `rgb(207, 207, 207) solid 0px` outline — a 0px outline on all button variants; functionally invisible
- **Link focus (non-visible)**: color shifts to `rgb(4, 42, 85)`, border-color to `rgb(4, 42, 85)` — state change without visible ring
- **Link active**: color shifts to `rgb(9, 30, 55)`, border-color to `rgb(9, 30, 55)` — deepest state without outline

The link 4px outline is the only visible focus indicator. Button `0px` focus-visible values provide no visual indication of focus.

### Touch/Click Targets

- Minimum observed interactive element: 34px width by 23px height — below the 44px WCAG 2.1 Success Criterion 2.5.5 target
- Ghost buttons: `0px 14px 0px 14px` padding with `15.75px` text — approximately 44px height
- Primary/Secondary buttons: `0px 17.5px 0px 17.5px` padding with `17.5px` text — approximately 53px touch area

### Reduced-Motion Support

**Observed:** `prefers-reduced-motion: reduce` detected with 10 CSS rules. The system respects the OS-level reduced-motion preference.

### ARIA Patterns

- `role="button"`: 10 instances
- `role="list"`: 55 instances
- `role="listitem"`: 266 instances
- `role="status"`: 5 instances
- Tab order: 140 tabbable elements, 0 positive tabindex values
- `lang="nl"` on `<html>`

Not observed: `aria-live` regions, skip navigation links, `aria-expanded` on dropdowns.

### Additional Notes

- Alt-text coverage: 23% (15 with alt, 51 without, 66 images total) — significantly below WCAG 1.1.1
- Minimum font size: 14px — meets the 12px informal readability floor but no smaller

## 10. Responsive Behavior

### Breakpoints

| Name | Width | CSS Rules | Key Changes |
|------|-------|-----------|-------------|
| Tablet landscape | max-width: 991px | 2482 | Primary responsive cascade; navigation collapse, section reflow |
| Mobile large | max-width: 767px | 1131 | Column reduction, heading size shifts |
| Mobile small | max-width: 479px | 1237 | Single-column layout, minimized spacing |
| Tablet portrait | max-width: 768px | 5 | Supplementary targeting |
| Large desktop | max-width: 5120px | 5 | Clamp upper-bound targeting |
| Desktop (hover) | min-width: 992px | 20 | Hover-enabled interactions restored |
| Pointer fine + hover | min-width: 768px and (hover:hover) | 87 | Precise pointer interactions enabled for desktop-class devices |
| Reduced motion | prefers-reduced-motion: reduce | 10 | Animation suppression |

The system is mobile-first: desktop-targeted breakpoints (min-width: 992px, min-width: 768px) carry only 20 and 87 rules respectively, while the max-width: 991px breakpoint carries 2482 rules.

### Collapsing Strategy

- Page padding: `5vw` (desktop) → `4rem` (tablet) → `2rem` (mobile-large) → `2rem` (mobile)
- Section spacing: `clamp()`-based values collapse with viewport height, from `clamp(15rem, 30vh, 20rem)` (display) to `clamp(2rem, 5vh, 4rem)` (extra-small)
- Navigation: collapses through max-width: 991px with 2482 rules governing menu transformation
- Feature grids: 6-column desktop → 3–2 column at 991px → single column at 479px
- Typography sizing: CSS variable system with `--_typography---size--h1` at `4rem`, `--_typography---size--h2` at `3.5rem`, scaling through `--_typography---size--h6` at `1.5rem` — breakpoint overrides likely exist within the 2482-rule 991px cascade [INFERRED — exact heading size remapping per breakpoint was not individually captured]

### Touch Targets

- Buttons at `15.75px`–`17.5px` font size with `14px`–`17.5px` horizontal padding produce ~44px–53px touch heights
- Navigation links at `16px` with `0px` padding rely on the surrounding nav container for touch area
- Minimum touch target observed: 34px × 23px — smaller than WCAG 2.5.5 recommendation at certain breakpoints

### Image Behavior

- Images use `10.5px` border-radius (64 occurrences) — softer than the 7px interactive-element radius
- Image containers use `14px` border-radius (37 occurrences) and asymmetric corner radii (`14px 0px 0px 14px`, `0px 0px 14px 14px`)
- Alt-text coverage at 23% indicates images are primarily decorative or the site relies on surrounding copy for context

## 11. State Matrix

| Component | Loading | Empty | Error | Disabled | Success |
|-----------|---------|-------|-------|----------|---------|
| Button (Primary) | - | n/a | - | - | - |
| Button (Ghost) | - | n/a | - | - | - |
| Link | Hover: color `#031d3c`, border `#031d3c`; Focus: color `rgb(4, 42, 85)`, border `rgb(4, 42, 85)`; Active: color `rgb(9, 30, 55)`, border `rgb(9, 30, 55)` | n/a | - | - | - |
| Card | - | "Contact" + info@anobel.nl fallback | - | - | - |
| Badge | - | - | - | - | Green bg `#4bae4f` or `#e6f4e5` with `#0a0a0a` text |

### Per-Variant State Detail

**Button Ghost**
- Hover: `border-color: #06458c` — blue border appears against transparent background
- Focus-visible: `outline: rgb(207, 207, 207) solid 0px` — no visible indicator
- No observed loading, disabled, or error states

**Button Secondary**
- Hover: `border-color: #06458c` — blue border replaces `#cfcfcf` neutral
- Focus-visible: `outline: rgb(207, 207, 207) solid 0px` — no visible indicator
- No observed loading, disabled, or error states

**Button Primary**
- Hover: `border-color: #06458c` — border appears against filled background
- Focus-visible: `outline: rgb(207, 207, 207) solid 0px` — no visible indicator
- No observed loading, disabled, or error states

**Button Destructive**
- Focus-visible: `outline: rgb(207, 207, 207) solid 0px` — no visible indicator
- No observed hover, loading, disabled, or error states

**Link Ghost**
- Hover: color `#031d3c`, border-color `#031d3c`, outline `none` — full state transition into deepest blue
- Focus-visible: `outline: rgb(207, 207, 207) solid 4px` — the system's only visible focus ring at 4px
- Focus: color `rgb(4, 42, 85)`, border-color `rgb(4, 42, 85)`, outline `none`
- Active: color `rgb(9, 30, 55)`, border-color `rgb(9, 30, 55)`, outline `none`
- Transition: `color 0.2s ease-out`

### Skeleton/Shimmer Patterns

No skeleton or shimmer loading states were observed in the extraction. The system appears to use instant content rendering without transitional loading placeholders.

## 12. Iconography

### Icon System

- **Library detected**: Custom SVG icon set (535 total icons, no identifiable open library)
- **Stroke width**: 1px (421 of 535 icons, 79% — the system default for outlined icons)
- **Color mode**: Mixed — 5 `currentColor` instances, 10 fixed-fill instances, 0 stroke-only
- **Style**: Outlined, with a minority of filled variants

### Sizing Scale

| Size | Frequency | Use |
|------|-----------|-----|
| 0px (viewport-relative) | 389 | Inline icons, navigation elements — inheriting size from parent context |
| 21px | 66 | Section-level icons, feature demarcation |
| 18px | 32 | Button icons, inline with 18px text |
| 14px | 12 | Small inline icons paired with body text |
| 25px | 16 | Medium display icons |
| 26px | 4 | Medium display variant |
| 96px | 4 | Large hero-level iconography |
| 188px | 5 | Full-size display marks |

### Icon-to-Text Alignment

Icons use `currentColor` for 5 instances and fixed fills for 10 instances. The 0px size distribution (389 icons) indicates the majority rely on parent container or viewport-relative sizing rather than fixed pixel dimensions.

### Substitution Recommendation

**Substitution:** Custom SVG icon set detected with 1px stroke weight. Closest open alternative: Lucide (1.5px default stroke, configurable to 1px via `strokeWidth` prop). The stroke-weight mismatch at 1px vs Lucide's 1.5px default is significant — when substituting, set `strokeWidth={1}` explicitly to match the source system's 79% stroke-weight-1 distribution.

## 13. Agent Prompt Guide

### Quick Color Reference

- Page background: `#fefefe`
- Primary text: `#0a0a0a`
- Link color: `#06458c`
- Primary button background: `#06458c`
- Primary button text: `#fefefe`
- Secondary button border: `#cfcfcf`
- Destructive button background: `#fd4f19`
- Card background: `#f8f8f8`
- Card border: `#f4f4f4`
- Light border/background: `#e2e2e2`
- Medium border: `#cfcfcf`
- Error text/border: `#b4120e`

### Self-Containment Checklist

Every prompt below satisfies:
- [ ] Font family, size, weight, line-height, letter-spacing specified
- [ ] All colors as hex (never "the primary color")
- [ ] Padding, radius, shadow values included
- [ ] OpenType features included if system uses them
- [ ] Hover/focus state values included
- [ ] Transition values included

**Test:** Can an AI agent build this component without looking anything else up?

### Example Component Prompts

- "Create a hero section on `#fefefe` background. Headline: `Silka Webfont`, weight 600, `112px` size, `112px` line-height, letter-spacing `normal`, color `#0a0a0a`, text `\"ISPS\"`. Subheadline: `Silka Webfont`, weight 600, `63px` size, `75.6px` line-height, letter-spacing `normal`, color `#0a0a0a`, text `\"Uw maritieme totaalleverancier.\"`. Full-width layout, `max-width: 100%`, section spacing `clamp(15rem, 30vh, 20rem)`. No shadow, no gradient."

- "Design a card component: background `#f8f8f8`, `1px solid #f4f4f4` border, `14px` border-radius, `28px 28px 28px 28px` padding. Title: `Silka Webfont`, weight 600, `21px` size, `25.2px` line-height, color `#06458c`. Body: `Silka Webfont`, weight 400, `16px` size, `23.2px` line-height, color `#0a0a0a`. Transition: `all`. Use: 'Contact' / 'Vragen? Nobel staat klaar.'"

- "Create a badge/pill: background `#4bae4f`, text `#0a0a0a`, font `Silka Webfont` weight 600 at `15.75px`, border-radius `100%`, padding `0px 0px 0px 0px`. Variant: background `#e6f4e5` with identical text styling, transition `background-color 0.3s`."

- "Build a primary button: background `#06458c`, text `#fefefe` at `17.5px` Silka Webfont weight 600, padding `0px 17.5px 0px 17.5px`, border-radius `7px`. Hover: `border-color: #06458c`. Focus-visible: `outline: rgb(207, 207, 207) solid 0px`. Transition: `color 0.2s ease-out, background-color 0.2s ease-out, border-color 0.2s ease-out`."

- "Build navigation: links use `Silka Webfont` weight 400 at `16px` size, `23.2px` line-height, color `#0a0a0a`, background `rgba(0, 0, 0, 0)`, border-radius `0px`, padding `0px`. Page-level padding: `5vw` on desktop, collapsing to `4rem` at 991px, `2rem` at 767px. No hover state observed on navigation links. ARIA: `role='list'` with `role='listitem'` children."

- "Create a destructive button: background `#fd4f19`, text `#fefefe` at `16px` Silka Webfont weight 400, padding `17.5px 17.5px 17.5px 17.5px`, border-radius `10.5px`, `1px solid #bb3a12` border. Focus-visible: `outline: rgb(207, 207, 207) solid 0px`. Transition: `color 0.2s ease-out`. Use: 'Shop de bunkerproducten online.' Note: `#fefefe` on `#fd4f19` fails AA contrast at 3.30:1."

### Iteration Guide

1. Every component uses `Silka Webfont` with no fallback font change — the system has exactly one font family
2. Weight 600 is the only heading weight; weight 400 is body; weight 500 appears exclusively at 18px/16px paragraph style
3. No `box-shadow` anywhere — use `border` with explicit hex colors for all spatial separation
4. Border-radius choices: `7px` for interactive elements (buttons, links), `14px` for cards, `10.5px` for images, `100%` for pills
5. `0.2s ease-out` is the link hover timing; `0.2s ease-out` three-property spread is the button transition
6. `#06458c` is the link color, primary button background, and card-text color — it is the system's only chromatic workhorse
7. Copy must be Dutch — the system is monolingual with `lang="nl"` and no i18n infrastructure
8. Focus indicators: `4px solid rgb(207, 207, 207)` outline on links; `0px` (invisible) on buttons — test focus with keyboard before shipping
