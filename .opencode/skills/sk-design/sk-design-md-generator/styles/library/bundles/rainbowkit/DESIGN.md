# RainbowKit — Style Reference
> Neon wallet modal floating in a black void — the blue-to-violet aurora glows through the dark.

**Theme:** dark

RainbowKit uses a midnight crypto-native language: a black canvas with floating dark cards, confident rounded sans-serif typography, and a single vivid blue-to-violet gradient as the brand's emotional core. The design lives in the gap between developer-tool severity and consumer-app approachability — heavy shadows create depth on a flat dark surface, inset white border highlights define button edges, and 9999px radii make every interactive feel like a friendly pill. Color is used surgically: a primary signal blue for action, the aurora gradient for the hero CTA, and pure white text against layered grays for hierarchy. Component modals float with dramatic 24px shadow stacks, previewing the toolkit's own product surfaces. The six-column partner grid below signals community trust at scale without resorting to testimonials.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Signal Blue | `#0e76fd` | `--color-signal-blue` | Primary CTA fill, active states, brand wordmark, link emphasis — the only chromatic blue with enough surface area to carry identity |
| Aurora Gradient | `linear-gradient(to right, rgb(56, 152, 255), rgb(122, 112, 255))` | `--color-aurora-gradient` | Hero CTA gradient, brand wordmark highlight, selected-state washes — flows from sky-blue to electric violet |
| Electric Violet | `#7a70ff` | `--color-electric-violet` | Gradient terminus, brand-secondary accent — appears only as the cool half of the aurora |
| Deep Iris | `#38228f` | `--color-deep-iris` | Violet wash for highlight backgrounds, decorative bands, and soft emphasis behind content. |
| Hyper Pink | `#ff5ca0` | `--color-hyper-pink` | Accent spectrum — demonstration option in the wallet-customization showcase, not a UI-state color |
| Ember Red | `#fa423c` | `--color-ember-red` | Accent spectrum — demonstration option in wallet-customization showcase |
| Solar Orange | `#ff801f` | `--color-solar-orange` | Accent spectrum — demonstration option in wallet-customization showcase |
| Toxic Green | `#1db847` | `--color-toxic-green` | Accent spectrum — demonstration option in wallet-customization showcase |
| Void | `#000000` | `--color-void` | Page canvas, deepest surfaces, inverted button borders — true black anchors the entire system |
| Obsidian | `#1b1c1e` | `--color-obsidian` | Card surfaces, code blocks, modal containers, body text on light — the workhorse elevated surface |
| Shadow | `#121314` | `--color-shadow` | Shadow tint color (used in box-shadow rgba), near-black with a hint of warmth |
| Graphite | `#25292e` | `--color-graphite` | Hairline borders, dividers, icon stroke, secondary text on dark — the most-used neutral border in the system |
| Slate | `#2f3334` | `--color-slate` | Secondary borders, subtle dividers between sections — sits between Graphite and Pewter |
| Carbon | `#353a3b` | `--color-carbon` | Tertiary icon fills, disabled-state borders, subtle backgrounds |
| Pewter | `#646566` | `--color-pewter` | Disabled button background, low-emphasis surfaces — never for text |
| Fog | `#95979c` | `--color-fog` | Muted helper text, icon secondary, placeholder text — the only gray that carries readable information |
| Snow | `#ffffff` | `--color-snow` | Primary text, inverted button fill, light-surface backgrounds, icon glyphs, hairline highlight borders |
| Mist | `#f0f1f5` | `--color-mist` | Light-theme surface fallback, very subtle off-white for section backgrounds on the demo |

## Tokens — Typography

### SFRounded — Primary typeface for all UI — rounded geometric sans, chosen because the soft terminals make technical Web3 copy feel approachable rather than intimidating · `--font-sfrounded`
- **Substitute:** Nunito, Inter (rounded variant), Avenir Next Rounded
- **Weights:** 400, 500, 600, 700, 800
- **Sizes:** 11px, 14px, 16px, 18px, 20px, 24px, 40px, 52px
- **Line height:** 1.00–1.33
- **Letter spacing:** Positive throughout (0.007–0.032em) — unusual for a display font; tracking opens up with size, giving headlines a roomy, friendly rhythm rather than the tight compressed look of typical tech brands
- **Role:** Primary typeface for all UI — rounded geometric sans, chosen because the soft terminals make technical Web3 copy feel approachable rather than intimidating

### SFMono — Code snippets, terminal commands, technical strings — the npm install command in the hero · `--font-sfmono`
- **Substitute:** JetBrains Mono, Fira Code, SF Mono
- **Weights:** 400
- **Sizes:** 14px
- **Line height:** 1.00
- **Letter spacing:** 0.0250em
- **Role:** Code snippets, terminal commands, technical strings — the npm install command in the hero

### system-ui — Fallback body copy when the web font hasn't loaded — barely visible because SFRounded dominates · `--font-system-ui`
- **Weights:** 400
- **Sizes:** 20px
- **Line height:** 1.05
- **Letter spacing:** 0.0170em
- **Role:** Fallback body copy when the web font hasn't loaded — barely visible because SFRounded dominates

### Arial — Arial — detected in extracted data but not described by AI · `--font-arial`
- **Weights:** 400
- **Sizes:** 13px, 16px
- **Line height:** 1.2
- **Role:** Arial — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 11px | 1.31 | 0.35px | `--text-caption` |
| body-sm | 14px | 1.29 | 0.35px | `--text-body-sm` |
| body | 16px | 1.25 | 0.27px | `--text-body` |
| subheading | 18px | 1.33 | 0.31px | `--text-subheading` |
| heading-sm | 20px | 1.2 | 0.3px | `--text-heading-sm` |
| heading | 24px | 1.17 | 0.43px | `--text-heading` |
| heading-lg | 40px | 1.05 | 0.88px | `--text-heading-lg` |
| display | 52px | 1 | 1.3px | `--text-display` |

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
| 64 | 64px | `--spacing-64` |
| 112 | 112px | `--spacing-112` |
| 128 | 128px | `--spacing-128` |
| 216 | 216px | `--spacing-216` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 9999px |
| cards | 24px |
| icons | 12px |
| pills | 9999px |
| inputs | 12px |
| modals | 24px |
| buttons | 9999px |
| codeBlocks | 12px |
| logoFrames | 9999px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| lg | `rgba(0, 0, 0, 0.4) 0px 8px 24px 0px` | `--shadow-lg` |
| subtle | `rgba(255, 255, 255, 0.12) 0px 0px 0px 1px inset` | `--shadow-subtle` |
| subtle-2 | `rgb(255, 255, 255) 0px 0px 0px 4px` | `--shadow-subtle-2` |
| xl | `rgba(27, 29, 31, 0.1) 0px 10px 30px 0px, rgba(27, 29, 31,...` | `--shadow-xl` |
| md | `rgba(0, 0, 0, 0.1) 0px 4px 12px 0px` | `--shadow-md` |
| xl-2 | `rgba(0, 0, 0, 0.32) 0px 8px 32px 0px` | `--shadow-xl-2` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 24px
- **Element gap:** 12px

## Components

### Gradient Primary CTA
**Role:** The hero action — invites the visitor into the documentation.

Filled button with linear-gradient(to right, #3898ff, #7a70ff), white text at 16px SFRounded weight 500, letter-spacing 0.27px. Padding 12px 24px. Radius 9999px (pill). White inset border highlight at rgba(255,255,255,0.12) for edge definition. On elevation: two-layer soft shadow.

### Solid Blue Pill Button
**Role:** Secondary CTAs and persistent nav actions like 'Connect Wallet'.

Background #0e76fd, white text, 16px SFRounded weight 500. Padding 6px 16px. Radius 9999px. Sits in the top-right of the nav. Compact, high-contrast, unmistakable.

### Ghost Nav Button (Logo + Version)
**Role:** Brand identification in the nav bar with version metadata.

Rainbow gradient icon (app-style) followed by 'RainbowKit' text in white at 14px weight 600, with a small version badge (1.3.10) using Pewter background, white text at 11px, radius 9999px, padding 1px 5px.

### Terminal Code Block
**Role:** Copy-paste installation command in the hero.

Dark surface (#1b1c1 or near-black) with a subtle white border. Contains monospace text (SFMono 14px) showing npm command. Includes a small copy-icon button on the right side. Padding ~12px 18px. Radius 12px.

### Wallet Connection Modal
**Role:** The product showcase — the actual RainbowKit component floating on the landing page.

Card at 24px radius, Obsidian surface (#1b1c1e), heavy shadow (rgba(0,0,0,0.4) 0px 8px 24px). Header row with title 'Connect a Wallet' and close X icon. Body has a 'Popular' label, then a list of wallet items (Rainbow, Coinbase Wallet, MetaMask, WalletConnect) with brand icons and right-arrow chevrons. A 'More' section below with Ledger Live. All text white at 16px SFRounded weight 500.

### Wallet List Item
**Role:** Selectable option inside the connection modal.

Row with: circular wallet brand icon (32px), wallet name in white 16px weight 500, optional right chevron. Subtle hover state would lift the row background. Padding ~12px vertical, 16px horizontal.

### What-is-a-Wallet Info Card
**Role:** Educational companion card explaining wallets next to the connection modal.

Same Obsidian surface and shadow as the modal. Contains a heading 'What is a Wallet?' in white 20px, followed by short paragraphs of body text (14-16px) and small inline feature icons. Functions as a secondary educational surface beside the primary action.

### Mobile Preview Card
**Role:** Showcases the wallet UI on a phone frame, demonstrating responsive behavior.

Vertical phone frame with rounded corners, displaying the same 'Connect a Wallet' modal scaled down. Background slightly lighter to separate from the canvas. Acts as a visual product screenshot, not an interactive component.

### Section Heading Block
**Role:** Centered section titles with supporting copy.

Centered text block. Main heading in white 20-24px SFRounded weight 600. Supporting paragraph in Fog (#95979c) 16px weight 400. Generous vertical spacing above and below. Used to introduce the partner grid.

### Partner Logo Grid Item
**Role:** Brand trust marker — a 6×n grid of partner logos.

Circular logo container (radius 9999px) with the brand's actual logo. Below: brand name in white 14px weight 500. Gap between items 40-60px horizontally. No background fill — the logo floats on Void. Logos are full-color brand assets, not monochrome.

### Inset Highlight Border
**Role:** The defining visual signature of interactive elements on dark surfaces.

1px inset border in rgba(255,255,255,0.12) applied to buttons and elevated cards. Creates a subtle lit-edge effect that mimics light catching the top of a physical surface — the only reason buttons read as 'raised' in a fully dark UI.

### Gradient Brand Wordmark
**Role:** The 'RainbowKit' hero title.

Text rendered with the aurora gradient (#3898ff → #7a70ff) as a CSS background-clip:text fill, at 40-52px SFRounded weight 700, letter-spacing 1.3px. The gradient is applied to the entire word, not individual letters.

## Do's and Don'ts

### Do
- Use 9999px radius for every button, tag, and pill — the radius is the brand's friendliness signal
- Apply the 1px inset white border (rgba(255,255,255,0.12)) to all elevated interactive elements on Obsidian surfaces
- Use the aurora gradient (linear-gradient(to right, #3898ff, #7a70ff)) only for primary hero CTAs and the wordmark — reserving it makes it feel premium
- Default to #0e76fd for all secondary action buttons and link emphasis
- Set body copy at 16px SFRounded weight 400 with 0.27px letter-spacing; headlines at 40-52px weight 700 with 0.88-1.3px letter-spacing
- Float product cards with rgba(0, 0, 0, 0.4) 0px 8px 24px 0px — the heavy shadow is what makes a modal feel like a window into the product
- Keep the canvas at true #000000 — never warm it with off-black, the void is the point

### Don't
- Don't use the chromatic accent colors (Hyper Pink, Ember Red, Solar Orange, Toxic Green) as semantic UI states — they are demonstration options, not success/error/warning tokens
- Don't apply shadow to text or the canvas itself — shadows belong to floating cards only, the background is shadowless
- Don't use negative letter-spacing — SFRounded is designed for positive tracking; tightening it fights the rounded letterforms
- Don't introduce a second body font — SFRounded handles everything from 11px captions to 52px displays; a serif or system fallback breaks the cohesion
- Don't place white or light-colored cards on the canvas — every surface must stay in the Obsidian/Graphite range to preserve the void
- Don't use #25292 for text — it's a border color, contrast on it is insufficient for readable copy
- Don't round images of phones or product screenshots with small radii — they should be 24px+ or fully inherit the device frame

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Void Canvas | `#000000` | Page background, full-bleed dark ground |
| 1 | Obsidian Card | `#1b1c1` | Modals, code blocks, elevated containers above the canvas |
| 2 | Graphite Edge | `#25292` | Hairline borders that separate and outline elements on Obsidian |
| 3 | Deep Iris Feature | `#38228f` | Brand-tinted card surface for premium or featured components |

## Elevation

- **Floating product cards and modals:** `rgba(0, 0, 0, 0.4) 0px 8px 24px 0px`
- **Button inset highlight:** `rgba(255, 255, 255, 0.12) 0px 0px 0px 1px inset`
- **Primary gradient button (hover/elevated):** `rgba(27, 29, 31, 0.1) 0px 10px 30px 0px, rgba(27, 29, 31, 0.04) 0px 5px 15px 0px`
- **Subtle elevated card:** `rgba(0, 0, 0, 0.1) 0px 4px 12px 0px`
- **Featured brand card:** `rgba(0, 0, 0, 0.32) 0px 8px 32px 0px`
- **Focus ring:** `rgb(255, 255, 255) 0px 0px 0px 4px`

## Imagery

Imagery is sparse and product-centric. The only visual content is product screenshots of the RainbowKit component itself (the wallet connection modal and a mobile phone preview) plus the six-column partner logo grid. Logos are full-color brand assets presented in circular frames (9999px radius), never monochrome duotones. No photography, no illustration, no abstract graphics, no 3D renders. The modal screenshots serve as both marketing visual and product proof — they ARE the hero. The void canvas is itself a design choice: the absence of decorative imagery signals developer-tool seriousness while the rounded typography and gradient CTA push back toward consumer-app warmth.

## Layout

Full-bleed dark canvas (#000000) with all content centered within a 1200px max-width. Hero: centered single-column stack — brand wordmark → H1 headline → subtext → terminal code block → gradient CTA. Below the hero, a floating product showcase zone overlaps the section boundary: a 2-column arrangement of the wallet connection modal (left), an educational info card (middle), and a mobile phone preview (right), each floating with heavy shadows. Section rhythm alternates: centered headline → 6-column partner logo grid → centered closing band. Vertical section gaps are large (80-120px) to let the dark canvas breathe. Navigation is a minimal top bar (logo+version left, single CTA right) with no mega-menu or sidebar. The mobile preview card overlaps into the next section to create visual flow between bands.

## Agent Prompt Guide

## Quick Color Reference
- text: #ffffff (primary), #95979c Fog (muted)
- background: #000000 Void (canvas), #1b1c1e Obsidian (cards)
- border: #25292e Graphite (hairlines), rgba(255,255,255,0.12) (inset highlights)
- accent: aurora gradient #3898ff → #7a70ff
- primary action: #0e76fd (filled action)

## Example Component Prompts

*Create a Primary Action Button: #0e76fd background, #ffffff text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.

**Solid Blue Nav Button**: Build a compact pill button with #0e76fd background, white 'Connect Wallet' text at 16px SFRounded weight 500, padding 6px 16px, radius 9999px, no shadow.

**Wallet Connection Modal Card**: Compose a card on #1b1c1e Obsidian with 24px radius, shadow rgba(0,0,0,0.4) 0px 8px 24px 0px. Header: 'Connect a Wallet' in white 16px SFRounded weight 600, with a small × close icon top-right at #95979c. Body: 'Popular' label in Fog 14px, then 4 list rows (Rainbow, Coinbase Wallet, MetaMask, WalletConnect) each with a 32px brand icon, white 16px name, and right chevron at #95979c.

**Terminal Code Block**: Render a dark code container at #1b1c1e Obsidian with 12px radius and a 1px Graphite border. Inside: monospace text 'npm init @rainbow-me/rainbowkit@latest' at 14px in SFMono, white. Right side: small copy icon at 16px in #95979c. Padding 12px 18px.

**Gradient Brand Wordmark**: Display 'RainbowKit' as text with the aurora gradient (linear-gradient(to right, #3898ff, #7a70ff)) applied via background-clip:text, at 40-52px SFRounded weight 700, letter-spacing 0.88-1.3px, white fill where the gradient is masked. Center it on the void canvas.

## Similar Brands

- **WalletConnect** — Same dark-void canvas with floating product modals and a single blue accent — the wallet-connection category has converged on this visual language
- **Privy** — Identical approach: black canvas, pill-shaped CTAs, rounded sans typography, and a blue-to-violet gradient as the primary brand moment
- **Dynamic** — Same midnight-mode UI with pill buttons, rounded geometry, and a single chromatic accent (blue) against pure black backgrounds
- **Web3Auth** — Developer-tool dark UI with floating auth modals, gradient brand moments, and rounded typography that softens the cryptographic seriousness
- **Stripe (docs)** — Same floating-card-on-dark approach for showcasing product components, though Stripe's accent is purple rather than blue

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-signal-blue: #0e76fd;
  --color-aurora-gradient: #3898ff;
  --gradient-aurora-gradient: linear-gradient(to right, rgb(56, 152, 255), rgb(122, 112, 255));
  --color-electric-violet: #7a70ff;
  --color-deep-iris: #38228f;
  --color-hyper-pink: #ff5ca0;
  --color-ember-red: #fa423c;
  --color-solar-orange: #ff801f;
  --color-toxic-green: #1db847;
  --color-void: #000000;
  --color-obsidian: #1b1c1e;
  --color-shadow: #121314;
  --color-graphite: #25292e;
  --color-slate: #2f3334;
  --color-carbon: #353a3b;
  --color-pewter: #646566;
  --color-fog: #95979c;
  --color-snow: #ffffff;
  --color-mist: #f0f1f5;

  /* Typography — Font Families */
  --font-sfrounded: 'SFRounded', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-sfmono: 'SFMono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-system-ui: 'system-ui', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-arial: 'Arial', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 11px;
  --leading-caption: 1.31;
  --tracking-caption: 0.35px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.29;
  --tracking-body-sm: 0.35px;
  --text-body: 16px;
  --leading-body: 1.25;
  --tracking-body: 0.27px;
  --text-subheading: 18px;
  --leading-subheading: 1.33;
  --tracking-subheading: 0.31px;
  --text-heading-sm: 20px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: 0.3px;
  --text-heading: 24px;
  --leading-heading: 1.17;
  --tracking-heading: 0.43px;
  --text-heading-lg: 40px;
  --leading-heading-lg: 1.05;
  --tracking-heading-lg: 0.88px;
  --text-display: 52px;
  --leading-display: 1;
  --tracking-display: 1.3px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
  --font-weight-extrabold: 800;

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
  --spacing-64: 64px;
  --spacing-112: 112px;
  --spacing-128: 128px;
  --spacing-216: 216px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 24px;
  --element-gap: 12px;

  /* Border Radius */
  --radius-md: 6px;
  --radius-xl: 12px;
  --radius-3xl: 24px;
  --radius-full: 9999px;

  /* Named Radii */
  --radius-tags: 9999px;
  --radius-cards: 24px;
  --radius-icons: 12px;
  --radius-pills: 9999px;
  --radius-inputs: 12px;
  --radius-modals: 24px;
  --radius-buttons: 9999px;
  --radius-codeblocks: 12px;
  --radius-logoframes: 9999px;

  /* Shadows */
  --shadow-lg: rgba(0, 0, 0, 0.4) 0px 8px 24px 0px;
  --shadow-subtle: rgba(255, 255, 255, 0.12) 0px 0px 0px 1px inset;
  --shadow-subtle-2: rgb(255, 255, 255) 0px 0px 0px 4px;
  --shadow-xl: rgba(27, 29, 31, 0.1) 0px 10px 30px 0px, rgba(27, 29, 31, 0.04) 0px 5px 15px 0px;
  --shadow-md: rgba(0, 0, 0, 0.1) 0px 4px 12px 0px;
  --shadow-xl-2: rgba(0, 0, 0, 0.32) 0px 8px 32px 0px;

  /* Surfaces */
  --surface-void-canvas: #000000;
  --surface-obsidian-card: #1b1c1;
  --surface-graphite-edge: #25292;
  --surface-deep-iris-feature: #38228f;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-signal-blue: #0e76fd;
  --color-aurora-gradient: #3898ff;
  --color-electric-violet: #7a70ff;
  --color-deep-iris: #38228f;
  --color-hyper-pink: #ff5ca0;
  --color-ember-red: #fa423c;
  --color-solar-orange: #ff801f;
  --color-toxic-green: #1db847;
  --color-void: #000000;
  --color-obsidian: #1b1c1e;
  --color-shadow: #121314;
  --color-graphite: #25292e;
  --color-slate: #2f3334;
  --color-carbon: #353a3b;
  --color-pewter: #646566;
  --color-fog: #95979c;
  --color-snow: #ffffff;
  --color-mist: #f0f1f5;

  /* Typography */
  --font-sfrounded: 'SFRounded', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-sfmono: 'SFMono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-system-ui: 'system-ui', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-arial: 'Arial', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 11px;
  --leading-caption: 1.31;
  --tracking-caption: 0.35px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.29;
  --tracking-body-sm: 0.35px;
  --text-body: 16px;
  --leading-body: 1.25;
  --tracking-body: 0.27px;
  --text-subheading: 18px;
  --leading-subheading: 1.33;
  --tracking-subheading: 0.31px;
  --text-heading-sm: 20px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: 0.3px;
  --text-heading: 24px;
  --leading-heading: 1.17;
  --tracking-heading: 0.43px;
  --text-heading-lg: 40px;
  --leading-heading-lg: 1.05;
  --tracking-heading-lg: 0.88px;
  --text-display: 52px;
  --leading-display: 1;
  --tracking-display: 1.3px;

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
  --spacing-64: 64px;
  --spacing-112: 112px;
  --spacing-128: 128px;
  --spacing-216: 216px;

  /* Border Radius */
  --radius-md: 6px;
  --radius-xl: 12px;
  --radius-3xl: 24px;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-lg: rgba(0, 0, 0, 0.4) 0px 8px 24px 0px;
  --shadow-subtle: rgba(255, 255, 255, 0.12) 0px 0px 0px 1px inset;
  --shadow-subtle-2: rgb(255, 255, 255) 0px 0px 0px 4px;
  --shadow-xl: rgba(27, 29, 31, 0.1) 0px 10px 30px 0px, rgba(27, 29, 31, 0.04) 0px 5px 15px 0px;
  --shadow-md: rgba(0, 0, 0, 0.1) 0px 4px 12px 0px;
  --shadow-xl-2: rgba(0, 0, 0, 0.32) 0px 8px 32px 0px;
}
```
