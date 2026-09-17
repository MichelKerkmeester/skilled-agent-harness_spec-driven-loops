# ChatGPT — Style Reference
> graphite ink on warm paper

**Theme:** light

ChatGPT uses a graphite-on-paper language: near-white canvas (#f9f9f9 sidebar) with the main conversation surface staying white, near-black ink for all primary text and icons, and zero chromatic accents. The entire UI is achromatic — meaning is carried by weight (600 headings, 400 body, 500 for emphasis) and spatial rhythm rather than color. Surfaces stay flat; elevation comes from a single hairline border at 1px rgba(0,0,0,0.05) rather than shadow. Controls are small, square-ish (10px radius), and chrome-light so the written response dominates. The system reads as restrained utility software — every pixel earns its place.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Sidebar Mist | `#f9f9f9` | `--color-sidebar-mist` | Sidebar and secondary surface backgrounds — page chrome recedes behind the conversation |
| Pure White | `#ffffff` | `--color-pure-white` | Main canvas and elevated surface — primary reading area, elevated panels, inverted text backgrounds |
| Graphite Ink | `#0d0d0d` | `--color-graphite-ink` | Primary headings, body text, and icon fills on light surfaces. Do not promote it to the primary CTA color |
| Mid Ash | `#5d5d5d` | `--color-mid-ash` | Secondary text and icons — supporting labels, metadata |
| Hollow | `#8f8f8f` | `--color-hollow` | Tertiary text, disabled states, muted helper copy |
| Hairline | `#0000001a` | `--color-hairline` | 1px borders and dividers — rgba black at ~10% opacity, the sole structural separator |
| Hover Veil | `#0000000d` | `--color-hover-veil` | Supporting palette color for small decorative accents when the core palette needs contrast. Do not promote it to the primary CTA color |
| Ink Press | `#000000` | `--color-ink-press` | Pressed/inverted surface fill, tooltips, scrim — true black for max contrast moments |
| Deep Charcoal | `#00000080` | `--color-deep-charcoal` | Modal scrim overlay — 50% black behind dialogs and drawers |
| Edge Gray | `#e6e6e6` | `--color-edge-gray` | Stronger divider or inactive surface — used sparingly as a higher-contrast border alternative |

## Tokens — Typography

### -apple-system-body — System UI font — the entire interface renders in -apple-system / BlinkMacSystemFont / Segoe UI, inheriting the OS typeface rather than shipping a custom face. This is a deliberate utility choice: zero font load, native rendering, automatic dark-mode adaptation on macOS/iOS. Body copy sits at 16px/1.5, fine print at 14px/1.43. The 24px/600 step is the sole display tier, reserved for welcome headings — never stretched for marketing drama. · `--font-apple-system-body`
- **Substitute:** system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif
- **Weights:** 400
- **Sizes:** 14px, 16px, 24px
- **Line height:** 1.43
- **Letter spacing:** normal
- **Role:** System UI font — the entire interface renders in -apple-system / BlinkMacSystemFont / Segoe UI, inheriting the OS typeface rather than shipping a custom face. This is a deliberate utility choice: zero font load, native rendering, automatic dark-mode adaptation on macOS/iOS. Body copy sits at 16px/1.5, fine print at 14px/1.43. The 24px/600 step is the sole display tier, reserved for welcome headings — never stretched for marketing drama.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 14px | 1.43 | — | `--text-caption` |
| body | 16px | 1.5 | — | `--text-body` |
| heading | 24px | 1.33 | — | `--text-heading` |

## Tokens — Spacing & Shapes

**Density:** compact

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 6 | 6px | `--spacing-6` |
| 8 | 8px | `--spacing-8` |
| 10 | 10px | `--spacing-10` |
| 12 | 12px | `--spacing-12` |
| 16 | 16px | `--spacing-16` |
| 20 | 20px | `--spacing-20` |

### Border Radius

| Element | Value |
|---------|-------|
| nav | 10px |
| cards | 10px |
| links | 16px |
| badges | 0px |
| buttons | 10px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 24px
- **Card padding:** 16px
- **Element gap:** 6px

## Components

### Sidebar Item (Ghost Button)
**Role:** Navigation row in the left rail

Transparent background, Graphite Ink (#0d0d0d) text and icon, 10px border-radius, 6px vertical padding, 10px horizontal padding. On hover: fills with Hover Veil (#0000000d). No active state color — active is implied by position or a subtle background tint.

### Compact Icon Button
**Role:** Toolbar action (new chat, search, images)

Transparent fill, 10px radius, 6px vertical / 8px horizontal padding, Graphite Ink icon at 16px. Behaves as the sidebar item but tighter. Hover wash via #0000000d.

### Pill Primary Button (Log In)
**Role:** Account entry action at the bottom of the sidebar

Pure White (#ffffff) fill, Graphite Ink (#0d0d0d) text, 1px Hairline (#0000001a) border, fully rounded radius (16777272px → effectively pill), 0px vertical / 16px horizontal padding. Weight 500 at 14px. The only border-bearing control on the page.

### Sidebar Footer Block
**Role:** Tail stack of links and CTA at sidebar bottom

Hollow vertical stack with no background, 10px row-gap, Hairline (#0000001a) top divider at 1px separating it from the chat list.

### Helper Text Block
**Role:** Body-sm description under a link in the sidebar footer

Hollow (#8f8f8f) 12-14px regular text, line-height 1.43, no background, acts as secondary helper copy next to a primary action.

### Conversation Card
**Role:** Recent chat row in the sidebar list

Transparent default with 10px radius and 6px vertical padding. On hover: #0000000d wash. Title in Graphite Ink at 14px/500 weight; preview in Hollow at 13px.

### Hairline Divider
**Role:** Section separator

1px solid Hairline (#0000001a). The only structural divider in the system — no double rules, no shadows.

### Surface Card (Elevated Panel)
**Role:** Floating panel or popover

Pure White (#ffffff) background, 10px radius, 1px Hairline border. Elevation is expressed by border, not shadow. Matches the elevation token #ffffff.

### Tooltip
**Role:** Hover label on icon buttons

Ink Press (#000000) fill, white text, small radius. Uses the --bg-tooltip token. Compact, no arrow ornamentation visible.

### Scrim Overlay
**Role:** Modal backdrop

Deep Charcoal (#00000080) at 50% opacity. Single-layer, no blur.

### Badge / Chip
**Role:** Tag or status indicator

Sidebar Mist (#f9f9f9) background, Graphite Ink text, 0px radius (square corners — a deliberate break from the 10px button radius), no padding wrapper. Used for low-prominence labels.

## Do's and Don'ts

### Do
- Use Graphite Ink (#0d0d0d) for all primary text and icons — never pure #000 for body text; reserve #000 for pressed states, tooltips, and scrims.
- Set element gap to 6px and section gap to 24px; rhythm comes from consistent 6/10/16/24 increments, not arbitrary spacing.
- Keep the entire interface achromatic — no brand blue, no green status, no red error. State changes are communicated by weight, fill veil, and position, not hue.
- Use 10px border-radius for all buttons, sidebar items, and cards. Only the Log In CTA breaks the system with a full pill radius.
- Render all text in the system font stack (-apple-system, system-ui, BlinkMacSystemFont). Do not load custom webfonts.
- Express elevation with a 1px Hairline border (#0000001a), never with box-shadow. The system is flat by conviction.
- Use #0000000d (5% black veil) for every hover state — the interface breathes, it does not flash.

### Don't
- Do not introduce any chromatic accent color — the UI is intentionally grayscale and adding a brand hue breaks the signal that color = data, never decoration.
- Do not use shadows for elevation. Hairline borders only; shadows make a flat utility interface feel ornamental.
- Do not set button text or icons to pure #000000; use #0d0d0d for softer 18.5:1 contrast. Pure black belongs only on inverted surfaces.
- Do not mix pill radii and 10px radii within the same control group — pick one radius per control type and stay consistent.
- Do not use text larger than 24px anywhere in the UI; the display tier is intentionally modest to keep the interface conversational, not promotional.
- Do not add background fills to navigation rows in their default state — chrome should recede until hovered.
- Do not load custom webfonts; the system font is a load-time and a11y advantage, not a compromise.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Sidebar Canvas | `#f9f9f9` | Left rail background, sets off the main conversation area |
| 1 | Conversation Canvas | `#ffffff` | Main reading and writing surface where the chat thread lives |
| 2 | Elevated Panel | `#ffffff` | Popovers, menus, and floating UI — same white but bordered with hairline to lift above the canvas |

## Elevation

Elevation is expressed exclusively through 1px hairline borders (#0000001a) on white surfaces, never through drop shadows. The interface is flat by conviction: shadows would make a utility product feel ornamental and would compete with the conversation text that is the actual product. The only exception is the tooltip, which uses a true black fill (#000) to invert against the light surface.

## Imagery

No photography, no illustrations, no product screenshots. The interface is pure UI — iconography is monochrome line icons (16px, 1.5px stroke implied by nav/fill count), icons-only visual language. No decorative imagery occupies space; the conversation text and user-generated content are the only visual content. Avatar circles for user/assistant messages are minimal solid fills. Density is text-dominant — the interface exists to frame text.

## Layout

Two-column shell: a fixed-width sidebar (260-280px) on the left with a 52px header strip (model selector + account) and a scrollable chat history, and a flexible main column that hosts the conversation thread with a generous max-width of ~720-768px centered horizontally for reading comfort. The hero is implicit — the first screen shows the welcome state (24px/600 headline, helper copy, login CTA stacked in the lower-left of the sidebar). Vertical rhythm uses 24px section gaps and 6px element gaps. No alternating dark/light bands — the entire page is a single light surface with one sidebar accent. Navigation is a minimal vertical list with no top-bar global nav; the brand is absent from the viewport chrome.

## Agent Prompt Guide

## Quick Color Reference
- text: #0d0d0d (Graphite Ink — primary text and icons)
- background: #ffffff (Pure White — main canvas)
- sidebar background: #f9f9f9 (Sidebar Mist — left rail)
- border: #0000001a (Hairline — 1px rgba black at ~10%)
- secondary text: #5d5d5d (Mid Ash)
- muted text: #8f8f8f (Hollow)
- primary action: no distinct CTA color

## Example Component Prompts
1. Sidebar navigation item: 10px border-radius, transparent background, Graphite Ink (#0d0d0d) 14px regular text and 16px icon, 6px vertical padding and 10px horizontal padding. On hover, fill with #0000000d at the same radius. No border in default state.
2. Welcome heading: 24px weight 600 Graphite Ink (#0d0d0d), line-height 1.33, letter-spacing normal, system font stack. Followed by 16px/400 body copy in Graphite Ink at line-height 1.5.
3. Pill Log In button at sidebar bottom: Pure White (#ffffff) fill, 1px Hairline (#0000001a) border, fully rounded radius (9999px), Graphite Ink text at 14px weight 500, 0px vertical / 16px horizontal padding. No fill change on hover — only border darkens to #00000026.
4. Hairline divider: 1px solid #0000001a, full container width, no margin — sits flush between sidebar sections.
5. Helper copy block: Hollow (#8f8f8f) 14px regular text at line-height 1.43, no background, used as secondary description beneath a primary action link in the sidebar footer.

## Similar Brands

- **Linear** — Same achromatic-by-default philosophy with a single subtle background tint for the sidebar; relies on hairline borders and weight rather than color to communicate hierarchy
- **Notion** — Near-identical system font usage, 10-12px radius on controls, grayscale-only interface where the document content provides all visual interest
- **Vercel** — Minimal utility UI with hairline 1px borders instead of shadows, system fonts, and zero chromatic accents in the chrome
- **Things 3 (Cultured Code)** — Quiet grayscale sidebar + white main surface, restrained typographic scale, and structural separation through dividers rather than elevation

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-sidebar-mist: #f9f9f9;
  --color-pure-white: #ffffff;
  --color-graphite-ink: #0d0d0d;
  --color-mid-ash: #5d5d5d;
  --color-hollow: #8f8f8f;
  --color-hairline: #0000001a;
  --color-hover-veil: #0000000d;
  --color-ink-press: #000000;
  --color-deep-charcoal: #00000080;
  --color-edge-gray: #e6e6e6;

  /* Typography — Font Families */
  --font-apple-system-body: '-apple-system-body', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.43;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-heading: 24px;
  --leading-heading: 1.33;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;

  /* Spacing */
  --spacing-6: 6px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 24px;
  --card-padding: 16px;
  --element-gap: 6px;

  /* Border Radius */
  --radius-lg: 10px;
  --radius-2xl: 16px;

  /* Named Radii */
  --radius-nav: 10px;
  --radius-cards: 10px;
  --radius-links: 16px;
  --radius-badges: 0px;
  --radius-buttons: 10px;

  /* Surfaces */
  --surface-sidebar-canvas: #f9f9f9;
  --surface-conversation-canvas: #ffffff;
  --surface-elevated-panel: #ffffff;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-sidebar-mist: #f9f9f9;
  --color-pure-white: #ffffff;
  --color-graphite-ink: #0d0d0d;
  --color-mid-ash: #5d5d5d;
  --color-hollow: #8f8f8f;
  --color-hairline: #0000001a;
  --color-hover-veil: #0000000d;
  --color-ink-press: #000000;
  --color-deep-charcoal: #00000080;
  --color-edge-gray: #e6e6e6;

  /* Typography */
  --font-apple-system-body: '-apple-system-body', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.43;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-heading: 24px;
  --leading-heading: 1.33;

  /* Spacing */
  --spacing-6: 6px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;

  /* Border Radius */
  --radius-lg: 10px;
  --radius-2xl: 16px;
}
```
