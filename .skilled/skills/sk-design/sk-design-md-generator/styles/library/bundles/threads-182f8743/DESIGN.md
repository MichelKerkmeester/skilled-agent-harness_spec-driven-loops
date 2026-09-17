# Threads — Style Reference
> Quiet monochrome paper feed

**Theme:** light

Threads reads as a monochrome whisper — a near-white canvas (#fafafa) holding a single narrow feed column framed by a sparse icon-only sidebar. Almost every surface, border, and icon is rendered in black-to-gray neutrals, with color appearing only as functional punctuation: the indigo-blue (#385898) for verified badges, links, and hover states, and a brighter blue (#0095f6) for the primary follow action. Components are flat, hairline-bordered, and generously rounded — 18px on post cards, fully pill-shaped (1000px) on buttons and tags, 8px on media thumbnails. The system avoids elevation entirely; cards sit on the canvas with 1px borders rather than shadows, giving the interface a printed-on-paper feel rather than a stacked-product feel. Typography is system-ui at small compact sizes (12–15px), with bold 600 used for usernames and post bodies remain at 400, creating a text-first social reader where avatars and short replies are the visual content.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Ink | `#000000` | `--color-ink` | Primary text, icon strokes, hairline borders, Log in button — the structural black that carries almost all interface weight |
| Paper | `#fafafa` | `--color-paper` | Page canvas, card surface background — the off-white that makes the whole feed feel like printed paper |
| Concrete | `#d5d5d5` | `--color-concrete` | Dividers and separator borders between feed sections |
| Graphite | `#969696` | `--color-graphite` | Muted helper text, inactive icons, disabled state borders, timestamp labels |
| Charcoal | `#424242` | `--color-charcoal` | Secondary body text, icon detail strokes, post metadata |
| Hover Mist | `#efefef` | `--color-hover-mist` | Soft section background, alternate surface, and quiet card fill. Do not promote it to the primary CTA color |
| Verified Indigo | `#385898` | `--color-verified-indigo` | Verified badges, inline links, outlined hover state on action buttons — the only chromatic brand color, used as a quiet signature rather than a loud accent |
| Signal Blue | `#0095f6` | `--color-signal-blue` | Follow button, primary outlined action color, clickable link emphasis — vivid blue reserved for moments that must demand a tap |

## Tokens — Typography

### system-ui — All text rendering — post bodies at 15px/400, usernames and timestamps at 13px/600, caption-sized metadata at 12px/700. System font stack keeps the feed platform-native and weight-driven hierarchy rather than size-driven hierarchy. · `--font-system-ui`
- **Substitute:** -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif
- **Weights:** 400, 600, 700
- **Sizes:** 12px, 13px, 15px
- **Line height:** 1.33–1.40
- **Letter spacing:** normal
- **Role:** All text rendering — post bodies at 15px/400, usernames and timestamps at 13px/600, caption-sized metadata at 12px/700. System font stack keeps the feed platform-native and weight-driven hierarchy rather than size-driven hierarchy.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.4 | — | `--text-caption` |
| body-sm | 13px | 1.4 | — | `--text-body-sm` |
| body | 15px | 1.4 | — | `--text-body` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** compact

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 8 | 8px | `--spacing-8` |
| 12 | 12px | `--spacing-12` |
| 16 | 16px | `--spacing-16` |
| 20 | 20px | `--spacing-20` |
| 24 | 24px | `--spacing-24` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 1000px |
| cards | 18px |
| media | 8px |
| inputs | 8px |
| avatars | 1000px |
| buttons | 1000px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| md | `rgba(0, 0, 0, 0.04) 0px 0px 12px 0px, rgb(250, 250, 250) ...` | `--shadow-md` |
| md-2 | `rgba(0, 0, 0, 0.04) 0px 0px 12px 0px` | `--shadow-md-2` |

### Layout

- **Page max-width:** 600px
- **Card padding:** 16px
- **Element gap:** 12px

## Components

### Post Card
**Role:** Primary content container for each feed item

White surface (#ffffff) on canvas (#fafafa), 18px border-radius, 1px solid #d5d5d5 bottom border between stacked posts, 16px horizontal padding, 12px vertical padding. Contains avatar (32px, 1000px radius), username row, post body, optional media (8px radius), and action bar. No shadow — separation is purely through hairline dividers and whitespace.

### Sidebar Nav Icon Button
**Role:** Persistent left-rail navigation

24px outlined icon in #000000, no background, no border. Hover state shifts to #efefef wash. 9999px radius hit target with generous padding. Compose/create button is a slightly larger outlined square with a + glyph.

### Post Action Button
**Role:** Like, comment, repost, share — inline below each post

24px outlined icon (heart, bubble, repeat, paper-plane) in #000000 stroke, no fill, no background. Counts sit to the right in 13px/400 #424242. Hover state: icon shifts to #385898 indigo. 8px gap between icon and count.

### Verified Badge
**Role:** Trust indicator next to usernames

Small filled indigo check (#385898) icon, ~14px, sits inline after display name. One of the only saturated color uses in the entire interface.

### Log In Button (Top Right)
**Role:** Primary authentication CTA

Black (#000000) filled pill, 1000px radius, 12px 16px padding, white text at 13px/600. The only filled button in the system — inverted from everything else around it.

### Media Thumbnail
**Role:** Attached images and video previews in posts

8px border-radius, 1px solid #d5d5d5 border, full-width of post card minus padding. Reel/video overlays get a small carousel-dot indicator at bottom.

### Avatar
**Role:** User identity mark throughout the feed

Circular (1000px radius), 32px–40px depending on context, 1px solid #d5d5d5 border. Never receives shadow or elevation. Verified accounts get the indigo check adjacent.

### Follow Button
**Role:** Primary outlined action on user profiles and suggestions

Outlined pill, 1000px radius, 1px solid #0095f6 border, #0095f6 text at 13px/600, transparent background. On press fills to #0095f6 with white text. No shadow.

### Username Row
**Role:** Identity line at the top of every post

13px/600 username in #000000, dot separator, 13px/400 timestamp in #969696, verified badge inline if applicable. 4px gap between avatar and text block.

### Top Bar
**Role:** Persistent page header

White (#ffffff) background, 1px bottom border #d5d5d5, 56px height, centered page title ('Home') at 15px/600, Log in button anchored right. No logo — the Threads glyph lives in the sidebar.

### Sidebar
**Role:** Left navigation rail

~80px wide, white background, icons stacked vertically with 24px gaps. Threads logo at top, then Home, Search, Compose (+), Activity (heart), Profile. Active item gets a 4px left border in #000000.

### Empty State / Divider
**Role:** Visual breaks between post groups

1px solid #d5d5d5 horizontal line, no label, no icon. The system relies on whitespace and hairlines rather than cards-with-shadows to create rhythm.

## Do's and Don'ts

### Do
- Use #fafafa as the page canvas and #ffffff for card surfaces — never invert this relationship
- Use 1px solid #d5d5d5 borders for all separation; never use shadows on cards or navigation
- Use 1000px border-radius for all buttons, avatars, and tags — pills are the default, not the exception
- Use system-ui at 15px/400 for all post bodies, 13px/600 for usernames, 12px/700 for metadata — weight drives hierarchy, not size
- Use #385898 only for verified badges, inline links, and hover-state icon tints — this indigo is the interface's only chromatic signature
- Use #0095f6 outlined buttons (not filled) for follow and other primary actions — filled actions should be the black Log in button only
- Use 18px radius for post cards and 8px radius for media thumbnails — two radius values carry the entire visual language

### Don't
- Don't add shadows to post cards, the top bar, or the sidebar — the system is intentionally flat
- Don't use color on resting-state action icons — black outlined icons only; color is a hover signal
- Don't use multiple font families or sizes below 12px — the system is typographically monotone
- Don't fill buttons with brand color — the follow button is outlined, only Log in is filled (and it fills with black, not blue)
- Don't add gradients, illustrations, or decorative imagery — Threads shows no brand art anywhere
- Don't use more than two border-radius values in a single view — 18px for cards, 8px for media, 1000px for everything round
- Don't add card padding beyond 16px horizontal / 12px vertical — the system is compact and information-dense

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas | `#fafafa` | Page background, feed container |
| 1 | Card | `#ffffff` | Post card surface, sidebar background |
| 2 | Hover Wash | `#efefef` | Subtle hover and pressed state on interactive rows |
| 3 | Inverse | `#000000` | Log in button, dark icons, text on light |

## Elevation

- **Post Card:** `none — 1px solid #d5d5d5 bottom border instead of shadow`
- **Top Bar:** `none — 1px solid #d5d5d5 bottom border`
- **Sidebar:** `none — right border 1px solid #d5d5d5`
- **Log In Button:** `none — filled black on white without elevation`

## Imagery

User-generated content dominates — selfies, screenshots, short vertical video, food photos. No brand illustration, no stock photography, no decorative graphics. Avatars are real user photos at 32–40px. Post media is full-width-of-card, 8px radius, uncropped portrait or landscape. Reels/video use a thin progress bar. The interface itself is icon-only: outlined 24px glyphs (heart, bubble, repeat, paper-plane, search, plus, home) in monochrome black, no filled variants in resting state. No icons are colored — even the verified badge is a tiny inline element rather than a visual feature.

## Layout

Fixed three-column desktop layout: ~80px left sidebar (icon-only nav, Threads logo at top), centered feed column max-width ~600px, large empty right margin. The feed is the page — no hero, no marketing content, no navigation beyond the sidebar. Vertical scroll is a single column of post cards separated by hairline dividers. The top bar (56px) spans full width with centered 'Home' title and a right-aligned Log in button. Mobile collapses to a single full-width feed with a bottom tab bar. Density is compact: 12px gaps between post elements, 16px card padding, posts are tight rectangles — the system optimizes for scroll length and information density over breathing room.

## Agent Prompt Guide

**Quick Color Reference**
- background: #fafafa
- card: #ffffff
- border: #d5d5d5
- text: #000000
- muted text: #969696
- accent (verified, links, hover): #385898
- primary action: #385898 (outlined action border)

**3-5 Example Component Prompts**

1. Create a post card: white #ffffff surface, 18px radius, 1px solid #d5d5d5 bottom border, 16px horizontal padding, 12px vertical padding. Top row: 32px circular avatar (1000px radius) with 4px gap to a 13px/600 username in #000000, a dot separator, and 13px/400 timestamp in #969696. Optional verified badge (#385898) inline after username. Body text: 15px/400 #000000, line-height 21px. No shadow.

2. Create a post action bar: 24px outlined icons (heart, bubble, repeat, paper-plane) in #000000 stroke, no fill, 8px gap between icon and count. Counts in 13px/400 #424242. Hover state: icon color shifts to #385898. Icons aligned left, share icon aligned right. 8px vertical padding above and below.

3. Create a Log in button: filled #000000 pill, 1000px border-radius, 12px vertical and 16px horizontal padding, white text at 13px/600 system-ui. No border, no shadow.

4. Create a follow button (outlined action): transparent background, 1px solid #0095f6 border, 1000px border-radius, 8px vertical and 16px horizontal padding, text in #0095f6 at 13px/600. On press: background fills to #0095f6, text to #ffffff.

5. Create a top bar: white #ffffff background, 1px solid #d5d5d5 bottom border, 56px height, centered 'Home' title at 15px/600 #000000, Log in button anchored 16px from right edge. Full viewport width.

## Similar Brands

- **Twitter/X (post-rebrand)** — Same monochrome feed-first aesthetic, outlined action icons, hairline borders, system font, minimal elevation
- **Mastodon web client** — Same near-white canvas, centered single-column feed, pill buttons, monochrome icons, verified-badge-as-only-accent approach
- **Bluesky** — Same paper-white background, black-on-white text, outlined icon action bar, compact post card rhythm with hairline dividers
- **LinkedIn feed** — Same 18px-radius post cards, 1px gray dividers between posts, avatar-plus-username-plus-timestamp header pattern

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-ink: #000000;
  --color-paper: #fafafa;
  --color-concrete: #d5d5d5;
  --color-graphite: #969696;
  --color-charcoal: #424242;
  --color-hover-mist: #efefef;
  --color-verified-indigo: #385898;
  --color-signal-blue: #0095f6;

  /* Typography — Font Families */
  --font-system-ui: 'system-ui', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.4;
  --text-body-sm: 13px;
  --leading-body-sm: 1.4;
  --text-body: 15px;
  --leading-body: 1.4;

  /* Typography — Weights */
  --font-weight-regular: 400;
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

  /* Layout */
  --page-max-width: 600px;
  --card-padding: 16px;
  --element-gap: 12px;

  /* Border Radius */
  --radius-sm: 1px;
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-2xl: 18px;
  --radius-3xl: 24px;
  --radius-full: 1000px;

  /* Named Radii */
  --radius-tags: 1000px;
  --radius-cards: 18px;
  --radius-media: 8px;
  --radius-inputs: 8px;
  --radius-avatars: 1000px;
  --radius-buttons: 1000px;

  /* Shadows */
  --shadow-md: rgba(0, 0, 0, 0.04) 0px 0px 12px 0px, rgb(250, 250, 250) 0px 0px 0px 48px;
  --shadow-md-2: rgba(0, 0, 0, 0.04) 0px 0px 12px 0px;

  /* Surfaces */
  --surface-canvas: #fafafa;
  --surface-card: #ffffff;
  --surface-hover-wash: #efefef;
  --surface-inverse: #000000;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-ink: #000000;
  --color-paper: #fafafa;
  --color-concrete: #d5d5d5;
  --color-graphite: #969696;
  --color-charcoal: #424242;
  --color-hover-mist: #efefef;
  --color-verified-indigo: #385898;
  --color-signal-blue: #0095f6;

  /* Typography */
  --font-system-ui: 'system-ui', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.4;
  --text-body-sm: 13px;
  --leading-body-sm: 1.4;
  --text-body: 15px;
  --leading-body: 1.4;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;

  /* Border Radius */
  --radius-sm: 1px;
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-2xl: 18px;
  --radius-3xl: 24px;
  --radius-full: 1000px;

  /* Shadows */
  --shadow-md: rgba(0, 0, 0, 0.04) 0px 0px 12px 0px, rgb(250, 250, 250) 0px 0px 0px 48px;
  --shadow-md-2: rgba(0, 0, 0, 0.04) 0px 0px 12px 0px;
}
```
