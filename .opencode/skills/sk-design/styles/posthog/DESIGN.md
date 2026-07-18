# PostHog — Style Reference
> Warm paper desktop pinned to cork — a tactile beige workspace where every interface element is a printed artifact, not a floating panel.

**Theme:** light

PostHog presents as a desktop operating system for product development — a warm, tactile workspace where the page itself is a file manager. A sandy beige canvas (#e1d7c2) sets the desk surface; white application windows with 1px hairline borders float on top, pinned like paper. Radii are aggressively small (4px almost everywhere) and shadows are nearly absent, giving the system a flat, printed, almost editorial feel rather than a glassmorphic SaaS one. Typography pairs Open Runde (geometric warmth, tracking-tight at -0.025em) with IBM Plex Sans Variable (developer-tool precision) and ui-monospace for code. Color is rationed: Signal Blue for live links and active states, Amber for the single primary action, Flame Orange for tags, Moss Green for confirmation. Elevation is achieved through the surface stack (beige → cream → white) and hairline borders, not depth — the whole system reads as paper pinned to a corkboard, not cards floating in space.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Sandy Desk | `#e1d7c2` | `--color-sandy-desk` | Muted UI surface for disabled controls, low-emphasis panels, and placeholder blocks. |
| Paper White | `#ffffff` | `--color-paper-white` | Application window and card surfaces — the primary elevated layer above the sandy desk, used for main content areas and popovers |
| Cream Paper | `#fdfdf8` | `--color-cream-paper` | Slightly warm off-white for secondary card surfaces and hover states — bridges between the sandy desk and pure white windows |
| Soft Linen | `#eeefe9` | `--color-soft-linen` | Tertiary surface for nested cards, secondary buttons, and subtle washes — the middle stop in the surface stack |
| Pale Stone | `#e5e7e0` | `--color-pale-stone` | Quaternary surface for hover backgrounds, selected list items, and disabled states |
| Deep Moss | `#23251d` | `--color-deep-moss` | Primary text and heading color — near-black with a faint olive warmth, never pure #000 |
| Olive Char | `#4d4f46` | `--color-olive-char` | Body text, secondary icons, and SVG fills — the workhorse neutral that gives the system its slightly earthy character |
| Sage Gray | `#65675e` | `--color-sage-gray` | Muted body text, inactive tab labels, and tertiary content — used when text must recede but remain legible |
| Ash Green | `#9ea096` | `--color-ash-green` | Disabled controls, placeholder text, and low-emphasis icon fills — the gray with just enough green to feel on-brand |
| Faded Pewter | `#b3b3af` | `--color-faded-pewter` | Hairline borders and subtle dividers — slightly cool against the warm canvas |
| Warm Mist | `#bfc1b7` | `--color-warm-mist` | Primary hairline border color — the most frequent border in the system, warm enough to harmonize with the sandy canvas |
| Pure Black | `#000000` | `--color-pure-black` | Icon fills, dark-mode text, and maximum-contrast glyphs |
| Signal Blue | `linear-gradient(90deg, rgb(1, 67, 203), rgb(43, 111, 244) 24.04%, rgb(210, 52, 1) 46.63%, rgb(255, 101, 31) 65.87%, rgb(251, 160, 0) 83.17%, rgb(1, 67, 203))` | `--color-signal-blue` | Blue action color for filled buttons, selected navigation states, and focused conversion moments.; Multi-stop brand gradient spanning blue → blue → orange-red → orange → amber → blue — used for the logo wordmark and occasional text-gradient decoration |
| Amber Glow | `#eb9d2a` | `--color-amber-glow` | Yellow action color for filled buttons, selected navigation states, and focused conversion moments. |
| Dark Amber | `#cd8407` | `--color-dark-amber` | CTA hover and active states, pressed link backgrounds — the deeper shade of Amber Glow |
| Burnished Gold | `#b17816` | `--color-burnished-gold` | Outlined action borders and underline accents on links — the amber system uses this for ghost/outline variants |
| Marigold | `#f1a82c` | `--color-marigold` | Decorative illustration fills, icon accents, and the PostHog logo gradient mid-stop — not for UI controls |
| Flame Orange | `#f54e00` | `--color-flame-orange` | Orange wash for highlight backgrounds, decorative bands, and soft emphasis behind content |
| Moss Green | `#6aa84f` | `--color-moss-green` | Green wash for highlight backgrounds, decorative bands, and soft emphasis behind content. Use as a supporting accent, not as a status color |

## Tokens — Typography

### Open Runde — Primary brand typeface for headings, body, and most UI text. The tight -0.025em tracking pulls letterforms together for a compact, confident feel. Weight 800 at 24px creates impact headlines; weight 400 at 15px is the workhorse body size. The geometric warmth distinguishes it from neutral sans-serifs. · `--font-open-runde`
- **Substitute:** Inter Tight, DM Sans
- **Weights:** 400, 500, 600, 700, 800
- **Sizes:** 12px, 13px, 14px, 15px, 18px, 19px, 20px, 21px, 24px, 36px
- **Line height:** 1.33, 1.40, 1.43, 1.50, 1.56, 1.71
- **Letter spacing:** -0.025em (applied to 18px, 19px, 21px, and 24px sizes)
- **Role:** Primary brand typeface for headings, body, and most UI text. The tight -0.025em tracking pulls letterforms together for a compact, confident feel. Weight 800 at 24px creates impact headlines; weight 400 at 15px is the workhorse body size. The geometric warmth distinguishes it from neutral sans-serifs.

### IBM Plex Sans Variable — Secondary UI typeface for navigation, controls, form labels, and developer-facing micro-copy. Its mechanical precision complements Open Runde's warmth — the two together signal 'friendly but technical'. Used at 13px/500 for nav items and 14px/400 for button labels. · `--font-ibm-plex-sans-variable`
- **Substitute:** IBM Plex Sans, Inter
- **Weights:** 400, 500, 600, 700
- **Sizes:** 12px, 13px, 14px, 15px, 16px
- **Line height:** 1.00, 1.25, 1.33, 1.38, 1.43, 1.50, 1.71
- **Role:** Secondary UI typeface for navigation, controls, form labels, and developer-facing micro-copy. Its mechanical precision complements Open Runde's warmth — the two together signal 'friendly but technical'. Used at 13px/500 for nav items and 14px/400 for button labels.

### ui-monospace — Code contexts, keyboard shortcuts, and technical metadata — the system monospace for inline code and terminal-style displays · `--font-ui-monospace`
- **Substitute:** SFMono-Regular, Menlo, Consolas
- **Weights:** 400
- **Sizes:** 14px
- **Line height:** 1.43
- **Role:** Code contexts, keyboard shortcuts, and technical metadata — the system monospace for inline code and terminal-style displays

### Source Code Pro — Source Code Pro — detected in extracted data but not described by AI · `--font-source-code-pro`
- **Weights:** 500
- **Sizes:** 14px
- **Line height:** 1.43
- **Role:** Source Code Pro — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| micro | 12px | 1.33 | — | `--text-micro` |
| caption | 14px | 1.43 | — | `--text-caption` |
| body | 16px | 1.5 | — | `--text-body` |
| subheading | 19px | 1.56 | -0.475px | `--text-subheading` |
| heading | 21px | 1.4 | -0.525px | `--text-heading` |
| heading-lg | 24px | 1.33 | -0.6px | `--text-heading-lg` |
| display | 36px | 1.5 | — | `--text-display` |

## Tokens — Spacing & Shapes

**Density:** compact

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 5 | 5px | `--spacing-5` |
| 6 | 6px | `--spacing-6` |
| 8 | 8px | `--spacing-8` |
| 9 | 9px | `--spacing-9` |
| 10 | 10px | `--spacing-10` |
| 12 | 12px | `--spacing-12` |
| 14 | 14px | `--spacing-14` |
| 16 | 16px | `--spacing-16` |
| 17 | 17px | `--spacing-17` |
| 20 | 20px | `--spacing-20` |
| 24 | 24px | `--spacing-24` |
| 32 | 32px | `--spacing-32` |
| 34 | 34px | `--spacing-34` |
| 64 | 64px | `--spacing-64` |
| 144 | 144px | `--spacing-144` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 9999px |
| cards | 4px |
| inputs | 4px |
| buttons | 4px |
| windows | 6px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| xl | `rgba(0, 0, 0, 0.25) 0px 25px 50px -12px` | `--shadow-xl` |

### Layout

- **Page max-width:** 958px
- **Section gap:** 48px
- **Card padding:** 16px
- **Element gap:** 8px

## Components

### Application Window
**Role:** Main content container that mimics a desktop OS window

White surface (#ffffff), 6px border-radius, 1px solid #bfc1b7 border, no shadow. Contains a title bar with filename (e.g., 'home.mdx') and window controls (minimize, maximize, close). Uses backdrop-filter: blur(8px) on the title bar for frosted-glass effect. Internal padding: 16px 32px. This is the signature container — every major content area lives inside one.

### Sidebar File Entry
**Role:** File/folder representation in the left sidebar

Vertical stack item with a small icon (16-20px) above a text label. Label uses IBM Plex Sans 13px/500, color #4d4f46. Hover state shifts background to #e5e7e0. Active state shows Signal Blue (#2f80fa) icon fill. 4px border-radius on hover backgrounds. Spacing: 8px between icon and label, 16px between entries.

### Amber CTA Button
**Role:** Primary action button — the system's single filled CTA

Background: #eb9d2a, text color: #23251d (Deep Moss), 4px border-radius, padding 6px 12px, font: IBM Plex Sans 14px/500. On hover: background shifts to #cd8407. Border: none. The amber against sandy canvas creates a 'pressed paper sticker' effect. Used for 'Get started – free' and 'Install with AI'.

### Ghost Toolbar Button
**Role:** Icon-only or text-only control in the formatting toolbar

Transparent background, text/icon color #23251d, 4px border-radius, padding 2px 4px. On hover: background #e5e7e0. Used for B/I/U toggles, alignment controls, and toolbar dropdowns. Minimal weight — these are utility controls, not actions.

### Outlined Action Button
**Role:** Secondary action with visible border

Transparent background, 1.5px solid #b17816 (Burnished Gold) border, text color #b17816, 4px border-radius, padding 6px 12px. Used for 'Install with AI' alongside the amber CTA. The gold border signals 'available action' without competing with the filled amber.

### Tab Bar Item
**Role:** Horizontal tab in the content section navigation

Inactive: text #65675 (Sage Gray), IBM Plex Sans 13px/500, no background, 6px 6px 0px 0px top-radius, padding 10px 12px. Active: background #ffffff, text #2f80fa (Signal Blue), 2px solid #2f80fa bottom border. The blue bottom-border is the active indicator — no fill change needed.

### Tag Pill
**Role:** Small categorical badge or status indicator

Full pill radius (9999px), padding 2px 8px, font size 12px/400. Background varies by category: #f54e00 (Flame Orange) for feature tags, #6aa84f (Moss Green) for status, #f1a82c (Marigold) for highlights. Text color: #ffffff for saturated backgrounds, #23251d for lighter ones. The pill shape is the system's only rounded element.

### Hairline Divider
**Role:** Section separator and content boundary

1px solid #bfc1b7 (Warm Mist) horizontal line. Used between content blocks, around card containers, and as window borders. This is the primary elevation mechanism — the system uses borders, not shadows, to define structure.

### Window Title Bar
**Role:** Top bar of an Application Window with filename and controls

Height ~36px, background #ffffff with backdrop-filter: blur(8px), 1px solid #bfc1b7 bottom border. Center filename in IBM Plex Sans 13px/500. Left: tab/icon. Right: window control dots. The frosted glass on this bar is one of the few blur effects in the system.

### Text Link
**Role:** Inline and standalone hyperlinks

Color #111827 (near-black) for standard links, #2f80fa (Signal Blue) for active/live links, #b17816 (Burnished Gold) for links with amber system context. Underline: 1.5px solid matching text color, offset 3px. Font: Open Runde 15px/400. No background change on hover — only underline opacity or color shift.

### Product Feature Card
**Role:** Highlight card for product features in grid layouts

Background: #ffffff, border: 1px solid #bfc1b7, 4px border-radius, padding 16px. No shadow. Contains a small colored icon (Signal Blue, Marigold, or Flame Orange), a heading at 19px/600, and body text at 15px/400. Hover: background shifts to #eeefe9.

### Navigation Bar
**Role:** Top-level site navigation

Transparent background on sandy canvas, no border. Items: IBM Plex Sans 13px/500, color #4d4f46, padding 4px 8px. Active item: color #23251d with 1px #23251d bottom border. 'Get started – free' sits on the right as an Amber CTA Button.

### Illustrated Decoration Panel
**Role:** Decorative illustration area flanking content

Isometric/flat illustrations with thick outlines (2px), warm color palette matching the sandy canvas. Characters and objects use Olive Char (#4d4f46) line work with selective Marigold, Signal Blue, and Flame Orange fills. Illustrations bleed to the right edge — they are not contained in cards.

## Do's and Don'ts

### Do
- Use Sandy Desk (#e1d7c2) as the page canvas — never use pure white or gray as the outer background
- Apply 4px border-radius to all cards, buttons, and inputs — this is the system's signature shape choice and deviation breaks the OS metaphor
- Use 1px solid #bfc1b7 borders for element separation instead of shadows; the system has no floating cards
- Use Amber Glow (#eb9d2a) for the single primary CTA per page; use Burnished Gold (#b17816) outlined buttons for secondary actions
- Apply -0.025em letter-spacing to all Open Runde text at 18px and above to maintain the compact, tight feel
- Use Open Runde for headings and body, IBM Plex Sans for UI controls and nav, ui-monospace for code — never mix roles
- Use Signal Blue (#2f80fa) exclusively for active states, live links, and the 'powered by AI' highlight — it is the only blue in the system

### Don't
- Don't add drop shadows to cards or windows — the system uses hairline borders, not depth, for structure
- Don't use border-radius larger than 6px on containers — 4px is the norm, and larger radii break the 'paper artifact' metaphor
- Don't introduce new chromatic accent colors — the system uses exactly four: Signal Blue, Amber Glow, Flame Orange, Moss Green
- Don't use pure white (#ffffff) as a page background — it must be Sandy Desk (#e1d7c2) or a surface stop in the linen/cream range
- Don't use the PostHog Spectrum gradient for UI controls — it is reserved for the logo wordmark and decorative text
- Don't use rounded pill shapes (9999px) on anything larger than a tag — pills are only for small status indicators
- Don't use pure black (#000000) for text — always use Deep Moss (#23251d) to maintain the system's slightly warm character

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Sandy Desk | `#e1d7c2` | Page-level canvas — the 'desk' the entire desktop OS metaphor sits on |
| 1 | Pale Stone | `#e5e7e0` | Hover and selected-item backgrounds — subtle surface shift for interactive states |
| 2 | Soft Linen | `#eeefe9` | Nested card and secondary surface — used inside white windows for grouped content |
| 3 | Cream Paper | `#fdfdf8` | Off-white variant for secondary windows and popover surfaces |
| 4 | Paper White | `#ffffff` | Primary application window and elevated card surface — the 'paper' pinned to the corkboard |

## Elevation

- **Modal overlay:** `rgba(0, 0, 0, 0.25) 0px 25px 50px -12px`

## Imagery

Illustrations are flat, isometric-ish, with thick 2px outlines in Olive Char (#4d4f46). Characters and objects use selective fills from the brand palette — Marigold, Signal Blue, Flame Orange — against the sandy canvas. The illustrations are content-specific (a person at a desk with basketball, a hedge maze with figures) and function as atmospheric decoration flanking the main window. No photography is used. Icons are mono-weight, outlined or filled in Olive Char/Deep Moss, with Signal Blue for active states. The visual language is 'tactile diagram' — everything looks like it could be cut out of paper and pinned to a corkboard.

## Layout

The page models a desktop OS workspace: a full-bleed Sandy Desk (#e1d7c2) canvas with a left sidebar (60-100px wide) containing file/folder icons, a central Application Window (max-width 958px, centered) that contains all primary content, and a right-side illustration panel that bleeds off-edge. The Application Window has a title bar with filename, a toolbar with formatting controls, and a tabbed content area. Navigation is a minimal top bar with left-aligned links and a right-aligned Amber CTA. Content within the window uses vertical rhythm: headings, body text, and feature grids stack with 17-48px gaps. Sections within the window are separated by hairline dividers, not background changes. The overall density is compact — elements are close together with minimal whitespace, reinforcing the 'workspace' metaphor over a 'marketing page' layout.

## Agent Prompt Guide

**Quick Color Reference**
- text: #23251d (Deep Moss)
- background: #e1d7c2 (Sandy Desk)
- card/window surface: #ffffff (Paper White)
- border: #bfc1b7 (Warm Mist)
- accent: #2f80fa (Signal Blue)
- primary action: #eb9d2a (filled action)

**Example Component Prompts:**

1. Create a Primary Action Button: #eb9d2a background, #000000 text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.

2. Create an Application Window: white background (#ffffff), border 1px solid #bfc1b7, border-radius 6px, padding 32px. Title bar: 36px tall, backdrop-filter blur(8px), filename in IBM Plex Sans 13px/500 centered, window control dots on the right. No drop shadow on the window itself.

3. Create a content tab bar: horizontal row of tabs, inactive tabs in #65675e IBM Plex Sans 13px/500, active tab in #2f80fa with a 2px solid #2f80fa bottom border. Tab background: #ffffff for active, transparent for inactive. Padding 10px 12px per tab.

4. Create a sidebar file entry: vertical stack with a 20px icon above a text label. Label: IBM Plex Sans 13px/500, color #4d4f46. On hover: background #e5e7e0, 4px border-radius. Active state: icon fill shifts to #2f80fa. Spacing: 8px between icon and label.

5. Create a text link: color #111827, Open Runde 15px/400, underline 1.5px solid #111827 offset 3px. For live/active links, change color to #2f80fa. For links in amber-system context, use #b17816. No background change on hover.

## Desktop OS Metaphor

The entire design system is built around a desktop OS metaphor. The sandy canvas is the desk, the white Application Window is a document opened on screen, the left sidebar is a file manager, and the title bar with filename ('home.mdx') reinforces that everything is a file. This is not decorative — it informs every component choice: the 4px radii mimic OS UI chrome, the hairline borders mimic window outlines, the toolbar mimics a text editor, and the lack of shadows mimics flat OS design. New screens should maintain this metaphor: when building a new page, frame it as 'opening a file' or 'viewing a document' rather than a marketing landing page.

## Motion Personality

Motion is expressive but restrained. The system uses 0.15s ease for micro-interactions (color, background, border, fill transitions — 34 instances each), giving a snappy, responsive feel. Longer animations (3-6.7s) use ease-in-out and are reserved for decorative floating illustrations ('scattered-float') and hero carousel fades. The text-gradient-wizard-scroll animation cycles the PostHog Spectrum gradient on the logo. Timing functions skew heavily toward plain 'ease' (1501 instances) over custom curves — the system is not trying to be clever with easing, just consistent.

## Similar Brands

- **Linear** — Same compact density, small border-radii, and developer-tool precision aesthetic with minimal shadows
- **Raycast** — Desktop-application metaphor extended to the web, with file-manager sidebars and window-like content areas
- **Vercel** — Tight tracking on geometric sans-serifs, hairline-border card system, and monochrome-with-single-accent color philosophy
- **Cal.com** — Warm sandy/beige background with small radii, flat surfaces, and a tactile 'printed' quality rather than glassmorphic
- **Cursor** — Developer-tool UI that frames the product as a desktop application with file-like content containers

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-sandy-desk: #e1d7c2;
  --color-paper-white: #ffffff;
  --color-cream-paper: #fdfdf8;
  --color-soft-linen: #eeefe9;
  --color-pale-stone: #e5e7e0;
  --color-deep-moss: #23251d;
  --color-olive-char: #4d4f46;
  --color-sage-gray: #65675e;
  --color-ash-green: #9ea096;
  --color-faded-pewter: #b3b3af;
  --color-warm-mist: #bfc1b7;
  --color-pure-black: #000000;
  --color-signal-blue: #2f80fa;
  --gradient-signal-blue: linear-gradient(90deg, rgb(1, 67, 203), rgb(43, 111, 244) 24.04%, rgb(210, 52, 1) 46.63%, rgb(255, 101, 31) 65.87%, rgb(251, 160, 0) 83.17%, rgb(1, 67, 203));
  --color-amber-glow: #eb9d2a;
  --color-dark-amber: #cd8407;
  --color-burnished-gold: #b17816;
  --color-marigold: #f1a82c;
  --color-flame-orange: #f54e00;
  --color-moss-green: #6aa84f;

  /* Typography — Font Families */
  --font-open-runde: 'Open Runde', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-ibm-plex-sans-variable: 'IBM Plex Sans Variable', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-ui-monospace: 'ui-monospace', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-source-code-pro: 'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-micro: 12px;
  --leading-micro: 1.33;
  --text-caption: 14px;
  --leading-caption: 1.43;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-subheading: 19px;
  --leading-subheading: 1.56;
  --tracking-subheading: -0.475px;
  --text-heading: 21px;
  --leading-heading: 1.4;
  --tracking-heading: -0.525px;
  --text-heading-lg: 24px;
  --leading-heading-lg: 1.33;
  --tracking-heading-lg: -0.6px;
  --text-display: 36px;
  --leading-display: 1.5;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
  --font-weight-extrabold: 800;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-5: 5px;
  --spacing-6: 6px;
  --spacing-8: 8px;
  --spacing-9: 9px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-14: 14px;
  --spacing-16: 16px;
  --spacing-17: 17px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-34: 34px;
  --spacing-64: 64px;
  --spacing-144: 144px;

  /* Layout */
  --page-max-width: 958px;
  --section-gap: 48px;
  --card-padding: 16px;
  --element-gap: 8px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-full: 9999px;

  /* Named Radii */
  --radius-tags: 9999px;
  --radius-cards: 4px;
  --radius-inputs: 4px;
  --radius-buttons: 4px;
  --radius-windows: 6px;

  /* Shadows */
  --shadow-xl: rgba(0, 0, 0, 0.25) 0px 25px 50px -12px;

  /* Surfaces */
  --surface-sandy-desk: #e1d7c2;
  --surface-pale-stone: #e5e7e0;
  --surface-soft-linen: #eeefe9;
  --surface-cream-paper: #fdfdf8;
  --surface-paper-white: #ffffff;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-sandy-desk: #e1d7c2;
  --color-paper-white: #ffffff;
  --color-cream-paper: #fdfdf8;
  --color-soft-linen: #eeefe9;
  --color-pale-stone: #e5e7e0;
  --color-deep-moss: #23251d;
  --color-olive-char: #4d4f46;
  --color-sage-gray: #65675e;
  --color-ash-green: #9ea096;
  --color-faded-pewter: #b3b3af;
  --color-warm-mist: #bfc1b7;
  --color-pure-black: #000000;
  --color-signal-blue: #2f80fa;
  --color-amber-glow: #eb9d2a;
  --color-dark-amber: #cd8407;
  --color-burnished-gold: #b17816;
  --color-marigold: #f1a82c;
  --color-flame-orange: #f54e00;
  --color-moss-green: #6aa84f;

  /* Typography */
  --font-open-runde: 'Open Runde', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-ibm-plex-sans-variable: 'IBM Plex Sans Variable', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-ui-monospace: 'ui-monospace', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-source-code-pro: 'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography — Scale */
  --text-micro: 12px;
  --leading-micro: 1.33;
  --text-caption: 14px;
  --leading-caption: 1.43;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-subheading: 19px;
  --leading-subheading: 1.56;
  --tracking-subheading: -0.475px;
  --text-heading: 21px;
  --leading-heading: 1.4;
  --tracking-heading: -0.525px;
  --text-heading-lg: 24px;
  --leading-heading-lg: 1.33;
  --tracking-heading-lg: -0.6px;
  --text-display: 36px;
  --leading-display: 1.5;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-5: 5px;
  --spacing-6: 6px;
  --spacing-8: 8px;
  --spacing-9: 9px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-14: 14px;
  --spacing-16: 16px;
  --spacing-17: 17px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-34: 34px;
  --spacing-64: 64px;
  --spacing-144: 144px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-xl: rgba(0, 0, 0, 0.25) 0px 25px 50px -12px;
}
```
