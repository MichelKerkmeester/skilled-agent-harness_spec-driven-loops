# Krisp — Style Reference
> Warm cream paper, inked in indigo, lit by a violet spark — a confident editorial-tech feel.

**Theme:** light

Krisp uses a warm-cream-and-violet language built on a single geometric humanist sans (Plus Jakarta Sans). The canvas is a soft warm beige rather than sterile white, giving the entire surface a paper-like, approachable quality. Deep indigo violet (#131032) doubles as both the primary text color and a dramatic dark section background — the same hue reading as authoritative copy on light surfaces and as immersive night-mode on dark. Vivid violet (#614efa) is the lone saturated accent, used sparingly on filled buttons and link emphasis, while a violet-to-cyan gradient sweeps through hero display text to make 'Voice AI' feel like it is lit from within. The system stays calm: soft cards, pill-shaped tabs, thin hairlines, no heavy shadows, and color restricted to small functional moments rather than broad washes.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Midnight Iris | `#131032` | `--color-midnight-iris` | Primary text, headings, and dark section backgrounds — the deepest near-black with a violet undertone carries the same identity across both light copy and immersive dark bands |
| Iris Spark | `#614efa` | `--color-iris-spark` | Filled buttons, link emphasis, active states, gradient stops — the only vivid saturated color in the palette, used as a small functional spark against the cream canvas |
| Violet Mist | `#dfdcfe` | `--color-violet-mist` | Soft accent washes, tag backgrounds, decorative highlights — a near-white violet tint that echoes Iris Spark at very low intensity |
| Cyan Glow | `#98c8ff` | `--color-cyan-glow` | Supporting palette color for small decorative accents when the core palette needs contrast. |
| Mint Whisper | `#eafdfa` | `--color-mint-whisper` | Pill badge and announcement tag backgrounds — a barely-there cool tint to differentiate informational chips from the warm cream canvas |
| Iris Halo | `#8374fb` | `--color-iris-halo` | Soft highlight overlays and secondary gradient midtones — a lighter violet used in multi-stop gradients |
| Fog | `#918f9f` | `--color-fog` | Muted body copy, helper text, secondary labels — the primary low-emphasis text color against cream and white surfaces |
| Shadow | `#5b5971` | `--color-shadow` | Stronger secondary text, metadata — deeper than Fog for labels that need more presence without reaching Midnight Iris |
| Ash | `#a1a1aa` | `--color-ash` | Disabled text, placeholder content, very low-emphasis UI elements |
| Slate | `#1a1a22` | `--color-slate` | Supporting neutral for secondary UI, dividers, and muted labels. Do not promote it to the primary CTA color |
| Charcoal | `#24232d` | `--color-charcoal` | Secondary dark text, very dark UI elements |
| Hairline | `#e7e7ea` | `--color-hairline` | Borders, dividers, card outlines — a cool light gray that separates surfaces on the warm cream canvas |
| Silver | `#cccccc` | `--color-silver` | Shadows, very subtle borders, disabled surface tones |
| Snow | `#ffffff` | `--color-snow` | Card surfaces, button text, dark-section text — pure white for maximum contrast on dark backgrounds |
| Cloud | `#f7f7f8` | `--color-cloud` | Secondary surface, footer background — a cool off-white that sits one step below Snow |
| Warm Paper | `#f2ece2` | `--color-warm-paper` | Dominant page canvas — a warm beige that replaces the typical cold white SaaS background, giving the entire site a tactile, editorial feel |

## Tokens — Typography

### Plus Jakarta Sans — Single-family geometric humanist sans used for every text role from 10px badges to 58px display headlines · `--font-plus-jakarta-sans`
- **Substitute:** Inter, DM Sans, General Sans
- **Weights:** 400, 500, 600, 700
- **Sizes:** 10, 14, 16, 18, 20, 22, 26, 36, 42, 48, 58
- **Line height:** 1.14–1.78 depending on size
- **Role:** Single-family geometric humanist sans used for every text role from 10px badges to 58px display headlines

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 10px | 1.6 | — | `--text-caption` |
| body-sm | 14px | 1.43 | — | `--text-body-sm` |
| body | 16px | 1.63 | — | `--text-body` |
| body-lg | 18px | 1.62 | — | `--text-body-lg` |
| subheading | 20px | 1.5 | — | `--text-subheading` |
| heading | 26px | 1.45 | — | `--text-heading` |
| heading-lg | 36px | 1.33 | — | `--text-heading-lg` |
| display-sm | 42px | 1.2 | — | `--text-display-sm` |
| display | 48px | 1.17 | — | `--text-display` |
| display-lg | 58px | 1.14 | — | `--text-display-lg` |

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
| 32 | 32px | `--spacing-32` |
| 40 | 40px | `--spacing-40` |
| 56 | 56px | `--spacing-56` |
| 80 | 80px | `--spacing-80` |
| 88 | 88px | `--spacing-88` |
| 100 | 100px | `--spacing-100` |
| 120 | 120px | `--spacing-120` |
| 140 | 140px | `--spacing-140` |
| 160 | 160px | `--spacing-160` |
| 240 | 240px | `--spacing-240` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 16px |
| icons | 4px |
| pills | 9999px |
| badges | 12px |
| buttons | 8px |
| largeCards | 20-24px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 96px
- **Card padding:** 24px
- **Element gap:** 16px

## Components

### Filled Violet Button
**Role:** Primary action button — solid Iris Spark fill with white text

Background: #614efa (Iris Spark). Text: #ffffff, Plus Jakarta Sans weight 600, 16px. Border radius: 8px. Padding: 12px 20px. Optional caret/chevron icon after label in white. No shadow on default state. On hover, darken background slightly. This is the signature action style — small, confident, rounded-but-not-pill.

### Dark Outline Button
**Role:** Secondary action button — used for 'Book a demo' and similar

Background: #1a1a22 (Slate). Text: #ffffff, Plus Jakarta Sans weight 600, 16px. Border radius: 8px. Padding: 12px 20px. No border. This near-black filled button provides the neutral counterweight to the violet primary action, preventing the palette from becoming monochromatic.

### Text Link Button
**Role:** Inline action with chevron — used in nav for 'Get Krisp' with dropdown indicator

Background: transparent. Text: #131032 (Midnight Iris), Plus Jakarta Sans weight 600, 16px. Small downward chevron in #131032 adjacent to text. No underline. Hover: shift to #614efa.

### Pill Tab Selector
**Role:** Segmented control for switching between meeting states (During / After / Before Meeting)

Container: rounded 9999px, background transparent or very light fill. Active tab: #ffffff (Snow) background with #131032 (Midnight Iris) text, weight 500-600. Inactive tab: transparent background with #918f9f (Fog) text. Transition between tabs is a simple white pill slide. Border-radius: 9999px makes these feel like physical toggles.

### Announcement Pill Badge
**Role:** Eyebrow tag above hero headline — 'Introducing Accent Conversion' style

Background: #eafdfa (Mint Whisper). Text: #131032 (Midnight Iris), Plus Jakarta Sans weight 500, 14px. Border radius: 9999px (pill). Padding: 6px 14px. Inline display above headlines as a contextual label.

### Gradient Display Headline
**Role:** Signature hero text treatment — 'Voice AI' portion of the headline

Text: Plus Jakarta Sans weight 700, 48-58px. Background: linear-gradient(90deg, #614efa 0%, #98c8ff 100%) applied via background-clip: text with transparent fill. Sits alongside plain Midnight Iris text in the same headline to create contrast between 'lit' and 'static' words.

### Feature Card
**Role:** Content card for feature grids — 'Multilingual meeting support', '1-click sharing'

Background: #ffffff (Snow) or #f7f7f8 (Cloud) sitting on Warm Paper canvas. Border: 1px solid #e7e7ea (Hairline) — very subtle. Border radius: 16px. Padding: 32px 28px. Icon: small outlined violet icon at top, 24px size, color #614efa. Title: Plus Jakarta Sans weight 600, 20-22px, #131032. Body: weight 400, 16px, #918f9f. No drop shadow — surface shift provides separation.

### Dark Feature Section Card
**Role:** Feature card variant on dark Midnight Iris background

Background: slightly lighter than the section canvas (transparent or a subtle lift). Border: 1px solid rgba(255,255,255,0.1) or #24232d. Border radius: 16px. Padding: 32px 28px. Icon: small dot or icon in #614efa or coral accent. Title: white #ffffff, weight 600, 20-22px. Body: rgba(255,255,255,0.7) or #918f9f, weight 400, 16px. A thin coral-red accent bar or dot appears to the left of the title — a small warm punctuation against the cool dark canvas.

### Customer Logo Strip
**Role:** Social proof band showing client logos (Medium, Okta, Skechers, Autodesk, Sony, Cisco, ServiceTitan, GitHub)

Layout: single horizontal row, evenly distributed, 8 logos visible. Logos: rendered in a single muted gray tone (filter: grayscale + opacity 0.6-0.8, color #918f9f) — not full color. No labels or captions. Sits on Warm Paper canvas with generous vertical padding (48-64px above and below).

### Top Navigation Bar
**Role:** Site header with logo, menu, and actions

Background: #ffffff (Snow) or transparent over Warm Paper. Left: wordmark 'krisp' in #131032, Plus Jakarta Sans weight 700, 22px. Center-left: nav links in #131032 weight 500, 16px, with small chevron-down icons on items with submenus. Right: 'Sign in' as plain text link, 'Book a demo' as Dark Outline Button, 'Get Krisp' as Filled Violet Button with chevron. Sticky on scroll. Height: 64-72px. Border-bottom: none or 1px #e7e7ea.

### Webby Award Sticker
**Role:** Floating badge in bottom-right corner — '20th Annual Webby Awards, Vote for Krisp'

Background: #ffffff (Snow). Border: 1px solid #e7e7ea. Border radius: 12px. Padding: 8px 12px. Text: #131032 weight 500, 10-12px, two lines. Small Webby logo icon to the left. Fixed position, bottom-right. Subtle shadow on hover.

### Icon
**Role:** UI iconography for features and navigation

Style: outlined, 1.5-2px stroke weight, 20-24px size. Color: #614efa (Iris Spark) on light cards, #ffffff on dark cards, #131032 in nav. Geometric and minimal — people, share, microphone, globe motifs. Stroke caps: round.

## Do's and Don'ts

### Do
- Use #f2ece2 (Warm Paper) as the default page canvas — never substitute pure white at the root level
- Apply the Iris Spark to Cyan Glow gradient only on display-size headlines (42px+); never on body or heading text
- Use 8px border-radius for all buttons and small interactive elements; 16px for cards; 9999px for pills and tabs
- Double-duty #131032 (Midnight Iris) as both text color on light surfaces and background color on dark sections — the hue reads as the same brand identity in both contexts
- Separate action button styles by fill: Iris Spark (#614efa) for one type, Slate (#1a1a22) for the other — never use two violet buttons side by side
- Use Hairline (#e7e7ea) at 1px for card borders and dividers; achieve elevation through surface color shifts rather than shadows
- Keep #918f9f (Fog) as the only muted body text color; never use Ash (#a1a1aa) for primary copy

### Don't
- Don't introduce new saturated colors — Iris Spark is the only vivid hue, and it should appear at most 1-2 times per viewport
- Don't apply drop shadows to cards or panels — surface shifts on the Warm Paper canvas are the elevation system
- Don't use pure #000000 for text — Midnight Iris (#131032) carries the brand undertone
- Don't place white cards on white backgrounds; always layer Snow (#ffffff) on Warm Paper (#f2ece2) or Cloud (#f7f7f8) for separation
- Don't use gradients on body, heading, or subheading text — the gradient treatment is reserved for display headlines only
- Don't use border-radius larger than 8px on buttons — the 8px radius is the button signature, not pills
- Don't show customer logos in full color — they must be muted to grayscale/gray to maintain the quiet editorial feel

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Warm Paper | `#f2ece2` | Dominant page canvas — warm beige base for all light sections |
| 1 | Cloud | `#f7f7f8` | Cool off-white secondary surface, often used for footer and large quiet bands |
| 2 | Snow | `#ffffff` | Card surfaces and elevated panels — pure white on top of Warm Paper for definition |
| 3 | Mint Whisper | `#eafdfa` | Accent chip and pill surfaces — a barely-there cool tint for informational tags |
| 4 | Midnight Iris | `#131032` | Dark immersive section background — inverts the color hierarchy with white text and violet accents |

## Elevation

Krisp intentionally avoids heavy shadows. Elevation is achieved through surface color shifts (Warm Paper → Snow for cards, Warm Paper → Midnight Iris for dark sections) rather than drop shadows. The only shadow usage is extremely subtle (Silver #cccccc with low opacity) for button press states and card hover lift. This keeps the design feeling flat, modern, and editorial rather than skeuomorphic.

## Imagery

Krisp's visual language is overwhelmingly UI-driven with no photography, no illustrations, and no product screenshots in the visible sections. The imagery vocabulary is purely typographic and geometric: gradient-filled display text, thin outlined icons (people, microphone, globe, share, chat) in Iris Spark violet, and abstract conic-gradient decorative elements in the background of dark sections. Customer logos in the social proof band are rendered in muted gray rather than full brand color, keeping the visual hierarchy focused on the copy and violet accents. The result is an editorial, almost magazine-like aesthetic where type and color do the storytelling that photography would normally carry.

## Agent Prompt Guide

primary action: no distinct CTA color
**Quick Color Reference:**
- text: #131032 (Midnight Iris)
- background: #f2ece2 (Warm Paper)
- card/surface: #ffffff (Snow)
- border: #e7e7ea (Hairline)
- muted text: #918f9f (Fog)
- accent/filled button: #614efa (Iris Spark)
- dark section background: #131032 (Midnight Iris)

**Example Component Prompts:**

1. **Create a hero section on Warm Paper canvas (#f2ece2).** Eyebrow pill badge: Mint Whisper background (#eafdfa), Midnight Iris text (#131032), 14px weight 500, 9999px radius, padding 6px 14px. Display headline at 48px Plus Jakarta Sans weight 700: split into two parts — first word(s) in the linear-gradient(90deg, #614efa 0%, #98c8ff 100%) text-fill treatment, remaining words in solid #131032. Subtext at 18px weight 400, #918f9f. Single filled button: #614efa background, white text weight 600, 8px radius, padding 12px 20px.

2. **Create a 2x2 feature card grid.** Canvas: Warm Paper (#f2ece2). Each card: white (#ffffff) background, 1px Hairline (#e7e7ea) border, 16px radius, padding 32px 28px. Top of each card: 24px outlined icon in Iris Spark (#614efa) with 1.5px stroke. Title: 22px weight 600, #131032. Body: 16px weight 400, #918f9f. 24px gap between cards.

3. **Create a dark feature section.** Full-bleed background #131032, padding 80-96px vertical. Section heading: 36px weight 600, #ffffff, left-aligned. Cards below: transparent or very subtle lift background, 16px radius, padding 32px 28px, thin border rgba(255,255,255,0.1). Each card title: 22px weight 600, #ffffff, preceded by a small 6px coral-red dot. Body: 16px weight 400, #918f9f. Use a pill-shaped tab selector (9999px radius) at the top with Snow (#ffffff) active state.

4. **Create a customer logo strip.** Single row on Warm Paper canvas, 8 logos evenly distributed. Each logo rendered in grayscale with opacity 0.6-0.7, color #918f9f. 48-64px vertical padding above and below. No labels or captions. Logos scale to ~80px height max.

5. **Create a sticky top navigation.** White background, 64px height, full width with max-width 1200px inner container. Left: 'krisp' wordmark in #131032, 22px weight 700. Center-left: 5 nav items in #131032 weight 500, 16px, with small chevron-down icons on 3 items. Right cluster: 'Sign in' as plain text link (#131032), 'Book a demo' as dark filled button (#1a1a22 background, white text, 8px radius, 12px 20px padding), 'Get Krisp' as violet filled button (#614efa background, white text, 8px radius, 12px 20px padding, with small downward chevron icon).

## Signature Gradient

The violet-to-cyan gradient (linear-gradient(90deg, #614efa 0%, #98c8ff 100%)) is reserved for display-size headline words only. It creates the 'Voice AI' signature where the brand term appears illuminated against the plain Midnight Iris remainder of the headline. Secondary gradients (violet→coral, violet→magenta) appear sparingly in decorative conic and linear gradients on dark sections and illustration accents. Never apply these gradients to body text, buttons, or background fills wider than a single display word.

## Similar Brands

- **Linear** — Same single-family geometric sans, dark-section/light-section alternation, and minimal shadow approach — though Linear leans cool-gray where Krisp leans warm-cream
- **Notion** — Similar restrained accent-color philosophy, pill-shaped UI elements, and clean editorial typography at display sizes
- **Framer** — Same warm-canvas-plus-bold-gradient-headline hero pattern and violet/indigo accent color family
- **Descript** — Same AI-tool category, similar comfortable density, and gradient-text display treatment on hero headlines
- **Loom** — Similar light-canvas SaaS with single vivid accent color, soft hairline cards, and pill-tab navigation patterns

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-midnight-iris: #131032;
  --color-iris-spark: #614efa;
  --color-violet-mist: #dfdcfe;
  --color-cyan-glow: #98c8ff;
  --color-mint-whisper: #eafdfa;
  --color-iris-halo: #8374fb;
  --color-fog: #918f9f;
  --color-shadow: #5b5971;
  --color-ash: #a1a1aa;
  --color-slate: #1a1a22;
  --color-charcoal: #24232d;
  --color-hairline: #e7e7ea;
  --color-silver: #cccccc;
  --color-snow: #ffffff;
  --color-cloud: #f7f7f8;
  --color-warm-paper: #f2ece2;

  /* Typography — Font Families */
  --font-plus-jakarta-sans: 'Plus Jakarta Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.6;
  --text-body-sm: 14px;
  --leading-body-sm: 1.43;
  --text-body: 16px;
  --leading-body: 1.63;
  --text-body-lg: 18px;
  --leading-body-lg: 1.62;
  --text-subheading: 20px;
  --leading-subheading: 1.5;
  --text-heading: 26px;
  --leading-heading: 1.45;
  --text-heading-lg: 36px;
  --leading-heading-lg: 1.33;
  --text-display-sm: 42px;
  --leading-display-sm: 1.2;
  --text-display: 48px;
  --leading-display: 1.17;
  --text-display-lg: 58px;
  --leading-display-lg: 1.14;

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
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-56: 56px;
  --spacing-80: 80px;
  --spacing-88: 88px;
  --spacing-100: 100px;
  --spacing-120: 120px;
  --spacing-140: 140px;
  --spacing-160: 160px;
  --spacing-240: 240px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 96px;
  --card-padding: 24px;
  --element-gap: 16px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-2xl-2: 20px;
  --radius-3xl: 24px;
  --radius-3xl-2: 32px;
  --radius-full: 48px;
  --radius-full-2: 9999px;

  /* Named Radii */
  --radius-cards: 16px;
  --radius-icons: 4px;
  --radius-pills: 9999px;
  --radius-badges: 12px;
  --radius-buttons: 8px;
  --radius-largecards: 20-24px;

  /* Surfaces */
  --surface-warm-paper: #f2ece2;
  --surface-cloud: #f7f7f8;
  --surface-snow: #ffffff;
  --surface-mint-whisper: #eafdfa;
  --surface-midnight-iris: #131032;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-midnight-iris: #131032;
  --color-iris-spark: #614efa;
  --color-violet-mist: #dfdcfe;
  --color-cyan-glow: #98c8ff;
  --color-mint-whisper: #eafdfa;
  --color-iris-halo: #8374fb;
  --color-fog: #918f9f;
  --color-shadow: #5b5971;
  --color-ash: #a1a1aa;
  --color-slate: #1a1a22;
  --color-charcoal: #24232d;
  --color-hairline: #e7e7ea;
  --color-silver: #cccccc;
  --color-snow: #ffffff;
  --color-cloud: #f7f7f8;
  --color-warm-paper: #f2ece2;

  /* Typography */
  --font-plus-jakarta-sans: 'Plus Jakarta Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 10px;
  --leading-caption: 1.6;
  --text-body-sm: 14px;
  --leading-body-sm: 1.43;
  --text-body: 16px;
  --leading-body: 1.63;
  --text-body-lg: 18px;
  --leading-body-lg: 1.62;
  --text-subheading: 20px;
  --leading-subheading: 1.5;
  --text-heading: 26px;
  --leading-heading: 1.45;
  --text-heading-lg: 36px;
  --leading-heading-lg: 1.33;
  --text-display-sm: 42px;
  --leading-display-sm: 1.2;
  --text-display: 48px;
  --leading-display: 1.17;
  --text-display-lg: 58px;
  --leading-display-lg: 1.14;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-56: 56px;
  --spacing-80: 80px;
  --spacing-88: 88px;
  --spacing-100: 100px;
  --spacing-120: 120px;
  --spacing-140: 140px;
  --spacing-160: 160px;
  --spacing-240: 240px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-2xl-2: 20px;
  --radius-3xl: 24px;
  --radius-3xl-2: 32px;
  --radius-full: 48px;
  --radius-full-2: 9999px;
}
```
