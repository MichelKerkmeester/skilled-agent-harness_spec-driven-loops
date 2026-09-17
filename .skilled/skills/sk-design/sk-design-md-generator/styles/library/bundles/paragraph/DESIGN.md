# Paragraph — Style Reference
> Editorial letterpress on warm parchment — a literary journal where the only color is ink-blue and every border is a page edge

**Theme:** light

Paragraph reads like a literary journal that learned to type: a vast white parchment where serif headlines do the heavy lifting and a single periwinkle blue is the only chromatic voice. The warm taupe borders (#dbd5d2) replace cold grays everywhere, making every container feel like a page edge rather than a UI panel. Typography carries meaning — IvyOra serif at 64px with -0.03em tracking whispers editorial authority while Google Sans Flex at 14-16px keeps utility invisible. Layout breathes: centered compositions, generous vertical gaps, and pill-shaped controls at 24-28px radius that feel handwritten rather than engineered. Color is rationed — one blue for action, warm neutrals for everything else, no gradients, no decorative chrome.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Page Parchment | `#dbd5d2` | `--color-page-parchment` | Primary border color for all containers, cards, nav, body, and links — warm taupe that reads as paper edge, not digital gray |
| Ink Black | `#271f1b` | `--color-ink-black` | All text, icons, and heading strokes — warm near-black with brown undertone, never pure #000 |
| Sheet White | `#ffffff` | `--color-sheet-white` | Primary page canvas and white card surfaces. Do not promote it to the primary CTA color |
| Felt Gray | `#ededed` | `--color-felt-gray` | Secondary surface for badges, subtle panel backgrounds, and inactive card states |
| Margin Gray | `#888786` | `--color-margin-gray` | Muted helper text, secondary metadata, and inactive nav items |
| Periwinkle Action | `#4a83f5` | `--color-periwinkle-action` | Violet wash for highlight backgrounds, decorative bands, and soft emphasis behind content. Do not promote it to the primary CTA color |
| Cornflower Wash | `#b1cafb` | `--color-cornflower-wash` | Violet supporting accent for decorative details and low-frequency emphasis. Do not promote it to the primary CTA color |
| Dusk Periwinkle | `#cedaf3` | `--color-dusk-periwinkle` | Inset border and subtle blue-tinted edge on elevated or focused elements |

## Tokens — Typography

### IvyOra — Display and heading serif — used at 64px for hero headlines, 24px for section titles, and 18px for card titles. Weight stays at 400 across all sizes: the serif's contrast and tight tracking (-0.03em at display) do the visual work, not boldness. · `--font-ivyora`
- **Substitute:** Playfair Display, Cormorant Garamond, or Lora
- **Weights:** 400
- **Sizes:** 18px, 24px, 64px
- **Line height:** 1.00–1.56
- **Letter spacing:** -0.03em at 64px, -0.022em at 24px, -0.02em at 18px
- **Role:** Display and heading serif — used at 64px for hero headlines, 24px for section titles, and 18px for card titles. Weight stays at 400 across all sizes: the serif's contrast and tight tracking (-0.03em at display) do the visual work, not boldness.

### Google Sans Flex — Body, navigation, buttons, and utility text. Stays compact (14-18px) and invisible — its job is legibility, not personality. Weight 500 for nav active states, 400 for body, 600 reserved for button labels. · `--font-google-sans-flex`
- **Substitute:** Inter, system-ui, or -apple-system
- **Weights:** 400, 500, 600
- **Sizes:** 14px, 16px, 18px
- **Line height:** 1.25–1.63
- **Letter spacing:** normal
- **Role:** Body, navigation, buttons, and utility text. Stays compact (14-18px) and invisible — its job is legibility, not personality. Weight 500 for nav active states, 400 for body, 600 reserved for button labels.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 14px | 1.43 | — | `--text-caption` |
| body | 16px | 1.5 | — | `--text-body` |
| subheading | 18px | 1.56 | — | `--text-subheading` |
| heading | 24px | 1.33 | -0.528px | `--text-heading` |
| display | 64px | 1 | -1.92px | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 8px

**Density:** compact

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 8 | 8px | `--spacing-8` |
| 16 | 16px | `--spacing-16` |
| 24 | 24px | `--spacing-24` |
| 32 | 32px | `--spacing-32` |
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |
| 64 | 64px | `--spacing-64` |
| 96 | 96px | `--spacing-96` |
| 128 | 128px | `--spacing-128` |

### Border Radius

| Element | Value |
|---------|-------|
| nav | 28px |
| cards | 20px |
| badges | 24px |
| images | 16px |
| buttons | 24px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| subtle | `rgba(0, 0, 0, 0.05) 0px 1px 2px 0px, rgba(0, 0, 0, 0.02) ...` | `--shadow-subtle` |
| subtle-2 | `rgba(61, 122, 245, 0.4) 0px 0px 0px 1px inset, rgba(207, ...` | `--shadow-subtle-2` |
| subtle-3 | `rgba(0, 0, 0, 0.05) 0px 1px 2px 0px` | `--shadow-subtle-3` |
| subtle-4 | `rgba(219, 213, 210, 0.5) 0px 0px 0px 1px inset, rgba(255,...` | `--shadow-subtle-4` |
| md | `rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.1)...` | `--shadow-md` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 20px
- **Element gap:** 8px

## Components

### Filled Action Button
**Role:** Primary CTA — navigation, sign-in, collect actions

Pill-shaped, 24px radius, filled with #4a83f5, white text, Google Sans Flex 14px weight 500, 8px 16px padding, no border. The only element that carries chromatic fill — its rarity is the point.

### Ghost Text Link
**Role:** Secondary navigation — 'Start reading', inline links

No background, no border. Text in #271f1b at 14px Google Sans Flex weight 500, often followed by a → arrow (→) in the same color. Hover state is not a color shift — the arrow translates 4px right.

### Navigation Pill
**Role:** Top-bar navigation container

A single rounded container (28px radius) housing nav items ('Our Story', 'Explore', 'Agents', 'Docs'), 1px #dbd5d2 border, subtle dual-shadow: rgba(0,0,0,0.05) 0 1px 2px + rgba(0,0,0,0.02) 0 0 4px. The pill grouping makes nav feel like a single control, not scattered links.

### Top Header Bar
**Role:** Site-wide header with brand, nav, and CTA

White background, logo left (sparrow glyph + 'Paragraph' wordmark in Ink Black), centered nav pill, CTA right. 80px total height. No sticky behavior needed — content is sparse enough to scroll naturally.

### Hero Section (Split)
**Role:** Landing page hero

Left half: centered vertical stack — 64px IvyOra display headline (e.g. 'Where Ideas Thrive'), 18px subheading in #888786, filled blue CTA + ghost text link side by side. Right half: phone mockup device frame showing the product UI. Max-width 1200px, 80px vertical padding, generous left-aligned text block.

### Feature Card
**Role:** Explains product capabilities in the 'Why Paragraph?' section

White card, 20px radius, 1px #dbd5d2 border, 20px padding. Icon (16px, Ink Black stroke) top-left, IvyOra 18px heading-sm title, Google Sans Flex 16px body description below. No shadow — the border does the elevation work.

### Article Card
**Role:** Content discovery card in feed/grid

White surface, 20px radius, 1px #dbd5d2 border. Cover image fills top at 16px corner radius (independent from card radius). Below: source label and date row (Google Sans Flex 14px, #888786), IvyOra 18px title, Google Sans Flex 16px excerpt excerpting 2-3 lines. 4-column grid on desktop, 16-20px gap between cards.

### Carousel Pagination Dots
**Role:** Hero slide indicator

Five small circles centered below the hero. Active dot is Ink Black filled; inactive dots are #dbd5d2. 6px diameter, 6px gap. No text labels — position is the language.

### Section Heading (Centered Serif)
**Role:** Section title between content bands

IvyOra 24px heading, weight 400, centered, letter-spacing -0.022em. Optional subheading in Google Sans Flex 16px at #888786, centered, 12px gap below title. 48-64px padding above and below the heading block.

### Tag/Badge
**Role:** Source labels, category tags on article cards

Google Sans Flex 12px weight 500, #271f1b text on #ededed background, 24px radius (pill), 4px 8px padding. No border. Functions as quiet metadata punctuation.

### Product Preview Card (Phone Frame)
**Role:** Hero product mockup

Dark device frame (rounded rectangle, ~300×600px, 28px radius) containing a simulated app UI with white inner card, gradient hero banner, author avatar, social row, and filled blue Collect button. The dark frame contrasts the white page to draw the eye.

### Source/Author Row
**Role:** Byline strip on article cards and preview

Horizontal flex row: 24px circular avatar, source name (Google Sans Flex 14px weight 500, Ink Black), separator dot, date (14px, #888786). 8px gap between elements.

## Do's and Don'ts

### Do
- Use IvyOra (or serif substitute) for all headings and display text at 18px, 24px, and 64px only — never at body sizes or below 18px
- Apply letter-spacing of -0.03em to 64px display, -0.022em to 24px headings, -0.02em to 18px serif subheadings
- Use #dbd5d2 (warm taupe) for all borders — never cold gray; the warmth is the identity
- Reserve #4a83f5 for filled action buttons only; the accent's power comes from scarcity
- Set card and button radii to 20-28px; sharp corners would break the handwritten feel
- Center section headings and allow 80px vertical gaps between content bands
- Use Google Sans Flex weight 500 for active states and button labels, weight 400 for body

### Don't
- Do not introduce gradients anywhere — the system is flat by design
- Do not use bold (600+) weights in the serif — IvyOra stays at 400 always
- Do not use pure black (#000000) for text — always #271f1b for warmth
- Do not place chromatic color on non-action elements; blue is reserved for buttons
- Do not use cold grays (#e5e7eb, #d1d5db) for borders — always the warm #dbd5d2
- Do not add box-shadows to content cards — the 1px border is the only elevation
- Do not set hero or section headlines above 64px; restraint is the editorial voice

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas | `#ffffff` | Page background — the sheet |
| 1 | Card | `#ffffff` | Content cards on the same white sheet, defined by 1px warm-taupe borders |
| 2 | Recessed | `#ededed` | Badge and inactive panel backgrounds |

## Elevation

- **Navigation pill:** `rgba(0, 0, 0, 0.05) 0px 1px 2px 0px, rgba(0, 0, 0, 0.02) 0px 0px 4px 0px`
- **Active/focused nav item:** `rgba(61, 122, 245, 0.4) 0px 0px 0px 1px inset, rgba(207, 222, 252, 0.3) 0px 1px 0px 0px inset, rgba(10, 71, 194, 0.2) 0px -1px 0px 0px inset, rgba(13, 89, 242, 0.15) 0px 0px 16px 0px`
- **Article card hover:** `rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.1) 0px 4px 6px -4px`

## Imagery

Photography is absent — Paragraph uses a literary publication visual language built entirely from typography and layout. The only photographic content is user-uploaded cover images on article cards, which the system treats as raw content rather than styled brand imagery. The sole product visual is a phone-frame mockup in the hero containing a simulated app UI with a vibrant blue-to-magenta gradient banner (user-generated content, not brand asset). Icons are minimal line-art in Ink Black at 16px stroke. No decorative graphics, no abstract shapes, no 3D elements. The system trusts whitespace and serif headlines to do all atmospheric work.

## Layout

Max-width 1200px centered canvas on a pure white background. Pages follow a vertical scroll rhythm: hero split (text-left, device-right) → centered serif section heading → feature card grid (asymmetric, 1-2 cards per row) → article feed (4-column card grid). Section gaps are 80px, generous and consistent. No alternating dark bands, no full-bleed imagery. Navigation is a single top bar with no sticky behavior. The layout reads top-to-bottom like a magazine spread: open white space, serif headline, sparse content, repeat.

## Agent Prompt Guide

**Quick Color Reference**
- Text: #271f1b
- Background: #ffffff
- Border: #dbd5d2
- Muted text: #888786
- Accent: #4a83f5
- primary action: no distinct CTA color

**3-5 Example Component Prompts**

No distinct primary action color was observed; use the extracted neutral button treatments instead of inventing a filled CTA color.

2. **Article Card Grid:** 4-column grid, 20px gap, max-width 1200px. Each card: white #ffffff bg, 20px radius, 1px solid #dbd5d2 border, no shadow. Cover image at 16px radius fills top 60%. Below: source/date row (Google Sans Flex 14px, #888786) at 8px row gap, then IvyOra 18px heading-sm title (ls -0.36px), then Google Sans Flex 16px body excerpt in #271f1b at 2-3 line clamp.

3. **Feature Card:** White bg, 20px radius, 1px #dbd5d2 border, 20px padding. 16px line-art icon in #271f1b stroke at top-left. IvyOra 18px heading-sm title at 12px gap below icon. Google Sans Flex 16px body description at 8px gap below title.


5. **Centered Section Heading:** Pure white bg, 80px top/bottom padding. IvyOra 24px heading centered in #271f1b with -0.528px letter-spacing. Google Sans Flex 16px subheading centered in #888786 at 12px gap below.

## Editorial Restraint Principle

Paragraph's identity lives in what's absent. No shadows on cards (borders do elevation). No gradients anywhere. No bold weights in the serif. No cold grays. No decorative imagery. The system achieves atmosphere through subtraction: warm taupe borders instead of cold ones, a single periwinkle instead of a palette, 400-weight serif instead of 700. When building new screens, add only what serves the content — every new visual element dilutes the editorial voice.

## Similar Brands

- **Substack** — Same editorial serif + sans-serif pairing, centered compositions, generous whitespace, and minimal color — the literary publishing template
- **Medium** — White-canvas reading experience with serif display headlines and pill-shaped controls, though Paragraph is warmer and more restrained
- **Mirror.xyz (parent platform)** — Shares the same crypto-publishing context and warm border palette, but Paragraph tightens the typography and reduces the color count
- **Are.na** — Same quiet, text-first layout philosophy with warm neutrals and minimal chrome — the anti-SaaS approach to content platforms
- **Read.cv** — Pill-shaped navigation, single accent color, serif/sans typographic contrast, and warm-tinted neutrals create the same handwritten-meets-editorial feel

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-page-parchment: #dbd5d2;
  --color-ink-black: #271f1b;
  --color-sheet-white: #ffffff;
  --color-felt-gray: #ededed;
  --color-margin-gray: #888786;
  --color-periwinkle-action: #4a83f5;
  --color-cornflower-wash: #b1cafb;
  --color-dusk-periwinkle: #cedaf3;

  /* Typography — Font Families */
  --font-ivyora: 'IvyOra', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-google-sans-flex: 'Google Sans Flex', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.43;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-subheading: 18px;
  --leading-subheading: 1.56;
  --text-heading: 24px;
  --leading-heading: 1.33;
  --tracking-heading: -0.528px;
  --text-display: 64px;
  --leading-display: 1;
  --tracking-display: -1.92px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;

  /* Spacing */
  --spacing-unit: 8px;
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-96: 96px;
  --spacing-128: 128px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 20px;
  --element-gap: 8px;

  /* Border Radius */
  --radius-sm: 3px;
  --radius-2xl: 16px;
  --radius-2xl-2: 20px;
  --radius-3xl: 24px;
  --radius-3xl-2: 28px;
  --radius-full: 100px;

  /* Named Radii */
  --radius-nav: 28px;
  --radius-cards: 20px;
  --radius-badges: 24px;
  --radius-images: 16px;
  --radius-buttons: 24px;

  /* Shadows */
  --shadow-subtle: rgba(0, 0, 0, 0.05) 0px 1px 2px 0px, rgba(0, 0, 0, 0.02) 0px 0px 4px 0px;
  --shadow-subtle-2: rgba(61, 122, 245, 0.4) 0px 0px 0px 1px inset, rgba(207, 222, 252, 0.3) 0px 1px 0px 0px inset, rgba(10, 71, 194, 0.2) 0px -1px 0px 0px inset, rgba(13, 89, 242, 0.15) 0px 0px 16px 0px;
  --shadow-subtle-3: rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;
  --shadow-subtle-4: rgba(219, 213, 210, 0.5) 0px 0px 0px 1px inset, rgba(255, 255, 255, 0.8) 1px 1px 0px 0px inset;
  --shadow-md: rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.1) 0px 4px 6px -4px;

  /* Surfaces */
  --surface-canvas: #ffffff;
  --surface-card: #ffffff;
  --surface-recessed: #ededed;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-page-parchment: #dbd5d2;
  --color-ink-black: #271f1b;
  --color-sheet-white: #ffffff;
  --color-felt-gray: #ededed;
  --color-margin-gray: #888786;
  --color-periwinkle-action: #4a83f5;
  --color-cornflower-wash: #b1cafb;
  --color-dusk-periwinkle: #cedaf3;

  /* Typography */
  --font-ivyora: 'IvyOra', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-google-sans-flex: 'Google Sans Flex', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.43;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-subheading: 18px;
  --leading-subheading: 1.56;
  --text-heading: 24px;
  --leading-heading: 1.33;
  --tracking-heading: -0.528px;
  --text-display: 64px;
  --leading-display: 1;
  --tracking-display: -1.92px;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-96: 96px;
  --spacing-128: 128px;

  /* Border Radius */
  --radius-sm: 3px;
  --radius-2xl: 16px;
  --radius-2xl-2: 20px;
  --radius-3xl: 24px;
  --radius-3xl-2: 28px;
  --radius-full: 100px;

  /* Shadows */
  --shadow-subtle: rgba(0, 0, 0, 0.05) 0px 1px 2px 0px, rgba(0, 0, 0, 0.02) 0px 0px 4px 0px;
  --shadow-subtle-2: rgba(61, 122, 245, 0.4) 0px 0px 0px 1px inset, rgba(207, 222, 252, 0.3) 0px 1px 0px 0px inset, rgba(10, 71, 194, 0.2) 0px -1px 0px 0px inset, rgba(13, 89, 242, 0.15) 0px 0px 16px 0px;
  --shadow-subtle-3: rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;
  --shadow-subtle-4: rgba(219, 213, 210, 0.5) 0px 0px 0px 1px inset, rgba(255, 255, 255, 0.8) 1px 1px 0px 0px inset;
  --shadow-md: rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.1) 0px 4px 6px -4px;
}
```
