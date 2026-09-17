# SST — Style Reference
> Code terminal in a gallery. The config file is the artwork; everything else is a clean white frame.

**Theme:** light

SST's design language reads like a developer's terminal wrapped in a polished product page. A monospaced code block anchors the hero — the syntax-highlighted config is the visual hero, not a decorative illustration. Typography is strictly two-family: IBM Plex Mono carries every code surface, technical label, and inline command, while Rubik Variable handles all prose, navigation, and UI chrome. The palette is austere and off-black: a signature dark indigo-violet (#303055) drives headings, body, and links, sitting on a pure white canvas with a barely-tinted lavender-gray (#e8e8f2) as the only soft surface accent. Code syntax uses four muted-but-distinct hues (purple, blue, teal, red-brown) that never bleed into the surrounding UI. Components are minimal and flat: 4px-rounded ghost buttons, pill-shaped nav controls, hairline borders, zero decorative shadows.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| SST Ink | `#303055` | `--color-sst-ink` | Headings, body text, links, primary text color — dark indigo-violet replaces the conventional near-black, giving every word a faint cool cast that signals developer-tool seriousness without feeling heavy |
| Code Plum | `#8844ae` | `--color-code-plum` | Code syntax highlighting for strings, property names, and keywords — the most vivid color in the system, reserved exclusively for inside code blocks |
| Code Cobalt | `#3b61b0` | `--color-code-cobalt` | Code syntax for method names, object keys, and function calls — paired with Code Plum to create the two-color syntax core |
| Code Teal | `#096e72` | `--color-code-teal` | Code syntax for type annotations, decorators, and select tokens — deeper teal that reads as technical rather than decorative |
| Code Rust | `#984e4d` | `--color-code-rust` | Red supporting accent for decorative details and low-frequency emphasis |
| Slate | `#403f53` | `--color-slate` | Secondary body text, descriptions, paragraph copy — sits one step lighter than SST Ink for prose that shouldn't compete with headings |
| Fog | `#767682` | `--color-fog` | Muted helper text, icon fills, secondary button text, navigation metadata — the mid-gray that makes UI chrome recede |
| Mist | `#a8a8b0` | `--color-mist` | Lightest text, disabled states, subtle icon outlines, and hairlines — the floor of the gray scale |
| Obsidian | `#111111` | `--color-obsidian` | Occasional maximum-contrast text and borders where absolute black is required |
| Lavender Mist | `#e8e8f2` | `--color-lavender-mist` | Subtle surface tint for code-block backgrounds, tag pills, and soft card fills — a whisper of violet that ties back to SST Ink |
| Paper | `#ffffff` | `--color-paper` | Light supporting surface for subtle backgrounds and section separation. Do not promote it to the primary CTA color |

## Tokens — Typography

### IBM Plex Mono — The code and technical voice — used for all code blocks, terminal output, inline code, API identifiers, and the 48px hero command line. Weight 600 highlights the shell prompt, file names, and key tokens inside code. The negative tracking tightens monospaced characters into dense, readable blocks. · `--font-ibm-plex-mono`
- **Substitute:** JetBrains Mono, Fira Code, Space Mono
- **Weights:** 400, 600
- **Sizes:** 14, 16, 18, 48
- **Line height:** 1.00–1.80
- **Letter spacing:** -0.021em
- **Role:** The code and technical voice — used for all code blocks, terminal output, inline code, API identifiers, and the 48px hero command line. Weight 600 highlights the shell prompt, file names, and key tokens inside code. The negative tracking tightens monospaced characters into dense, readable blocks.

### Rubik Variable — The product and prose voice — all navigation, headings, body copy, button labels, footer text, and UI metadata. Weight 400 is the default body, 500 for nav and button emphasis, 600 for headings. Positive tracking (0.016–0.056em) appears on uppercase eyebrows and small labels, giving them a controlled, technical stamp rather than decorative flair. · `--font-rubik-variable`
- **Substitute:** Inter, IBM Plex Sans, Geist
- **Weights:** 400, 500, 600
- **Sizes:** 9, 12, 13, 14, 16, 18, 20
- **Line height:** 1.00–1.80
- **Letter spacing:** 0.016em–0.056em (uppercase tracking)
- **Role:** The product and prose voice — all navigation, headings, body copy, button labels, footer text, and UI metadata. Weight 400 is the default body, 500 for nav and button emphasis, 600 for headings. Positive tracking (0.016–0.056em) appears on uppercase eyebrows and small labels, giving them a controlled, technical stamp rather than decorative flair.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.5 | — | `--text-caption` |
| body | 14px | 1.8 | — | `--text-body` |
| heading-sm | 18px | 1.5 | — | `--text-heading-sm` |
| heading | 20px | 1.5 | — | `--text-heading` |
| display | 48px | 1.1 | -1.01px | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 8 | 8px | `--spacing-8` |
| 12 | 12px | `--spacing-12` |
| 16 | 16px | `--spacing-16` |
| 24 | 24px | `--spacing-24` |
| 32 | 32px | `--spacing-32` |
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |
| 72 | 72px | `--spacing-72` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 4px |
| cards | 8px |
| inputs | 4px |
| buttons | 4px |
| code-blocks | 8px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 64px
- **Card padding:** 16px
- **Element gap:** 10-16px

## Components

### Code Block
**Role:** Hero centerpiece and content illustration

8px radius, #e8e8f2 or white background, 1px hairline border at #e8e8f2. Content in IBM Plex Mono: shell prompt '> ' in SST Ink, command (e.g. 'npm i sst') in weight 600 SST Ink, file references in weight 600, string values in Code Plum #8844ae, object keys/values in Code Cobalt #3b61b0, type annotations in Code Teal #096e72. Padding 16px. Subtle 1px border and faint shadow give it physical presence without heaviness.

### Ghost Nav Button
**Role:** Primary navigation links

Transparent background, no border. Rubik Variable 14px weight 500, SST Ink #303055. 4px radius available on hover/active states. Inactive nav items use Fog #767682.

### Text Link / Inline Action
**Role:** In-content navigation and call-to-action

Rubik Variable 14-16px weight 500, SST Ink #303055, no underline by default, underline or color shift on hover. Followed by a '>' chevron in the same color. No filled background — this is a text-first system.

### New Badge Pill
**Role:** Feature announcement marker

Outlined pill: 1px border in #e8e8f2, transparent fill, 4px vertical / 8px horizontal padding. Label 'NEW' in Rubik Variable 9-12px weight 600, uppercase, 0.056em tracking, SST Ink.

### Search Bar
**Role:** Global search trigger in header

Pill-shaped (9999px or large radius) with #e8e8f2 background, no visible border. Rubik Variable 12-14px weight 400 placeholder in Fog #767682. Contains a small '⌘K' shortcut hint in mono font on the right.

### Console Button
**Role:** Header utility action

Pill-shaped, transparent background, 1px border in #e8e8f2. Rubik Variable 12-14px weight 500, SST Ink text. 4px effective border-radius visually, or fully rounded.

### Brand Logo Mark
**Role:** Top-left identity anchor

Cloud icon followed by 'SST' wordmark in Rubik Variable 14-16px weight 600, SST Ink. Compact, no background, sits flush-left in the header.

### Social Proof Logo Strip
**Role:** Trust signal under hero CTA

Horizontal row of 5-6 grayscale company logos at ~60-80% opacity or Fog #767682 fill, even spacing (~24-32px gap), no borders. The 'LOVED BY THOUSANDS OF TEAMS' eyebrow above uses Rubik Variable 9-12px uppercase, 0.056em tracking, Mist #a8a8b0.

### Hero Text Block
**Role:** Primary value proposition

Right column of hero. Headline in Rubik Variable 48px weight 500, SST Ink, -0.021em tracking. Subtext in Rubik Variable 16-18px weight 400, Slate #403f53, 1.65-1.8 line height. No background or border.

### Terminal Command Line
**Role:** Inline shell prompt visual

Precedes the CTA cluster. Rubik Mono / IBM Plex Mono 14px weight 400, Mist #a8a8b0 for the prompt arrow, SST Ink weight 600 for the command. Reads like pasted terminal output.

### Footer Link Group
**Role:** Secondary navigation in footer

Left: copyright '© 2026 Anomaly Innovations' in Rubik Variable 12-13px weight 400, Mist #a8a8b0. Right: 'Guide / About / Contact' text links and 4 social icons in Fog #767682, 16-24px gap, no separators.

## Do's and Don'ts

### Do
- Use IBM Plex Mono for every code surface, terminal command, file name, and technical identifier — never substitute a proportional font in code contexts.
- Use Rubik Variable at 14px weight 400 for all prose body text on a #ffffff canvas with 1.8 line height.
- Apply the dark indigo SST Ink (#303055) as the single heading and link color — do not introduce additional heading colors.
- Reserve the four code syntax hues (Plum, Cobalt, Teal, Rust) exclusively for inside code blocks and inline `code` spans — never use them for UI accents, badges, or buttons.
- Use Lavender Mist (#e8e8f2) as the only surface tint above white — for code-block backgrounds, tag fills, and search input fields.
- Set all border-radius to 4px (buttons, tags, inputs) or 8px (cards, code blocks) — do not introduce intermediate or larger radii.
- Keep navigation and CTAs as text or ghost buttons with no filled backgrounds — the system communicates action through type weight and the '>' chevron, not through colored fills.

### Don't
- Do not use a distinct filled CTA button background — there is no CTA color in this system; primary actions are text links with chevrons.
- Do not apply code syntax colors (#8844ae, #3b61b0, #096e72, #984e4d) to UI elements, icons, badges, or marketing surfaces outside code contexts.
- Do not add drop shadows to cards, buttons, or navigation — elevation is reserved for the code block only.
- Do not mix the two font families within a single content role — Plex Mono is for code, Rubik is for prose; never let them overlap in the same element type.
- Do not use #000000 or near-black for body text — use SST Ink #303055 or Slate #403f53 to preserve the cool violet cast.
- Do not introduce gradients, textures, or decorative backgrounds — surfaces are strictly flat #ffffff or #e8e8f2.
- Do not use large border-radius (pill shapes, 16px+) on structural elements like cards or panels — keep them at 8px max.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Paper | `#ffffff` | Page canvas and primary card surfaces |
| 1 | Lavender Mist | `#e8e8f2` | Code-block backgrounds, subtle tag fills, soft surface elevation |

## Elevation

- **Code Block:** `0 0 0 1px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.04)`

## Imagery

The site is essentially imageless. The hero visual is a syntax-highlighted code block, not a photograph, illustration, or 3D render. The only graphical elements are the cloud logo mark, monochrome company logos in the social-proof strip, and small social icons in the footer. No lifestyle photography, no product screenshots, no abstract graphics. The visual identity IS the code.

## Layout

Two-column hero with the code block on the left and headline + subtext on the right, both vertically centered. Header is a single-row sticky bar: brand mark left, nav links center, utility controls (search, console) right. Below the hero, content flows in centered max-width ~1200px bands. The social-proof logo strip sits as a quiet horizontal band. Footer is a single row with copyright left and link cluster + social icons right, separated by generous whitespace. Vertical rhythm uses 64px section gaps with 10-16px element gaps. The page reads as a single document, not a scrolling app.

## Agent Prompt Guide

**Quick Color Reference**
- Text / heading: #303055
- Body text: #403f53
- Muted / helper text: #767682
- Surface tint (code bg, tags): #e8e8f2
- Canvas: #ffffff
- Code syntax accents: #8844ae (strings), #3b61b0 (keys), #096e72 (types), #984e4d (templates)
- primary action: no distinct CTA color

**Example Component Prompts**

1. *Code Block*: Create an 8px-radius code block with #e8e8f2 background, 1px #e8e8f2 border, and 16px padding. Shell prompt '> npm i' in IBM Plex Mono 14px weight 400 #a8a8b0, command 'sst' in weight 600 #303055. String '"example.com"' in #8844ae, object keys like 'memory', 'image' in #3b61b0, values in #303055.

2. *Hero Text Block*: Headline at 48px Rubik weight 500, #303055, -1.01px letter-spacing. Subtext at 18px Rubik weight 400, #403f53, 1.65 line-height. No background or border.

3. *New Badge Pill*: Transparent fill, 1px #e8e8f2 border, 4px radius, 4px/8px padding. Label 'NEW' in Rubik 9px weight 600, uppercase, 0.056em tracking, #303055.

4. *Search Bar*: Pill shape, #e8e8f2 background, no border. Placeholder in Rubik 14px weight 400, #767682. Right-side shortcut hint '⌘K' in IBM Plex Mono 12px, #a8a8b0.

5. *Social Proof Strip*: 'LOVED BY THOUSANDS OF TEAMS' eyebrow in Rubik 9px weight 600, uppercase, 0.056em tracking, #a8a8b0. Below: 5 grayscale logos in #767682, 32px gap, no borders.

## Similar Brands

- **Vercel** — Same developer-first aesthetic: white canvas, monochrome palette dominated by near-black text, monospaced code as hero visual, minimal ghost-style navigation.
- **Railway** — Shares the two-font system (sans for UI, mono for terminal/commands), flat surfaces, and text-link CTAs with chevrons rather than filled buttons.
- **Astro** — Similar doc-as-marketing layout: code blocks carry the brand, navigation is text-only, and the color palette is nearly monochromatic with a single subtle surface tint.
- **Linear** — Comparable restraint in palette (achromatic with one near-black) and 4-8px border-radius system, though Linear uses more elevation where SST stays flat.

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-sst-ink: #303055;
  --color-code-plum: #8844ae;
  --color-code-cobalt: #3b61b0;
  --color-code-teal: #096e72;
  --color-code-rust: #984e4d;
  --color-slate: #403f53;
  --color-fog: #767682;
  --color-mist: #a8a8b0;
  --color-obsidian: #111111;
  --color-lavender-mist: #e8e8f2;
  --color-paper: #ffffff;

  /* Typography — Font Families */
  --font-ibm-plex-mono: 'IBM Plex Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-rubik-variable: 'Rubik Variable', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --text-body: 14px;
  --leading-body: 1.8;
  --text-heading-sm: 18px;
  --leading-heading-sm: 1.5;
  --text-heading: 20px;
  --leading-heading: 1.5;
  --text-display: 48px;
  --leading-display: 1.1;
  --tracking-display: -1.01px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-72: 72px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 64px;
  --card-padding: 16px;
  --element-gap: 10-16px;

  /* Border Radius */
  --radius-sm: 1px;
  --radius-md: 4px;
  --radius-lg: 8px;

  /* Named Radii */
  --radius-tags: 4px;
  --radius-cards: 8px;
  --radius-inputs: 4px;
  --radius-buttons: 4px;
  --radius-code-blocks: 8px;

  /* Surfaces */
  --surface-paper: #ffffff;
  --surface-lavender-mist: #e8e8f2;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-sst-ink: #303055;
  --color-code-plum: #8844ae;
  --color-code-cobalt: #3b61b0;
  --color-code-teal: #096e72;
  --color-code-rust: #984e4d;
  --color-slate: #403f53;
  --color-fog: #767682;
  --color-mist: #a8a8b0;
  --color-obsidian: #111111;
  --color-lavender-mist: #e8e8f2;
  --color-paper: #ffffff;

  /* Typography */
  --font-ibm-plex-mono: 'IBM Plex Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-rubik-variable: 'Rubik Variable', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --text-body: 14px;
  --leading-body: 1.8;
  --text-heading-sm: 18px;
  --leading-heading-sm: 1.5;
  --text-heading: 20px;
  --leading-heading: 1.5;
  --text-display: 48px;
  --leading-display: 1.1;
  --tracking-display: -1.01px;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-72: 72px;

  /* Border Radius */
  --radius-sm: 1px;
  --radius-md: 4px;
  --radius-lg: 8px;
}
```
