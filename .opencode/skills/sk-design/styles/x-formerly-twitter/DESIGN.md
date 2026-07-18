# X (formerly Twitter) — Style Reference
> blue wire on white newsprint. A stark, content-first timeline where one vivid blue punctures an otherwise monochrome interface, and pill-shaped controls signal action without weight.

**Theme:** light

X is a newswire on white paper: a content-first real-time conversation surface where the UI dissolves into the background so text and media carry the experience. The design is ruthlessly minimal — a three-column grid (left nav, center feed, right rail), hairline borders instead of shadows, and one chromatic accent (X Blue) that appears only on things you can tap. Typography is the product: TwitterChirp's custom letterforms with the ss01 stylistic set create a distinctive voice across every weight. Buttons are infinite-radius pills, surfaces are flat whites, and density stays compact to maximize feed real estate. Every visual choice reinforces the idea that X is a public square, not a software product — the chrome is scaffolding, the content is the building.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| X Blue | `#1d9bf0` | `--color-x-blue` | Follow buttons, link text, verified badges, active nav icons, bottom CTA accents — the only chromatic color in the system, used sparingly to mark anything interactive or trustworthy |
| Ink Black | `#0f1419` | `--color-ink-black` | Primary text, button text, icon fills — the dominant readable foreground on light surfaces |
| Graphite | `#536471` | `--color-graphite` | Secondary text, metadata, timestamps, muted icon fills, helper labels |
| Fog Gray | `#829aab` | `--color-fog-gray` | Tertiary text and disabled-state foreground |
| Paper White | `#ffffff` | `--color-paper-white` | Page background, card surfaces, modal surfaces, button text on chromatic fills |
| Mist Gray | `#eff3f4` | `--color-mist-gray` | Hover states, secondary surface fills, subtle dividers, input backgrounds |
| Hairline Gray | `#cfd9de` | `--color-hairline-gray` | 1px border strokes separating cards, inputs, nav sections, and buttons |
| Shadow Dust | `#e0e4e7` | `--color-shadow-dust` | Inset shadow base for inputs and select surfaces — 3% opacity black on this tone |
| Charcoal | `#4b4f53` | `--color-charcoal` | Dark-mode surface fill (previews, code blocks, dim button state) |

## Tokens — Typography

### TwitterChirp — Primary brand typeface across all UI — feeds, nav, buttons, headings, body. The custom letterforms with ss01 stylistic set create X's distinctive voice; the tightly compressed 0.80 lineHeight on small sizes maximizes information density in the feed. · `--font-twitterchirp`
- **Substitute:** Inter, system-ui, -apple-system
- **Weights:** 400, 500, 700, 800
- **Sizes:** 11px, 13px, 14px, 15px, 20px, 23px
- **Line height:** 0.80, 1.09, 1.14, 1.20, 1.22, 1.23, 1.33
- **OpenType features:** `"ss01" on`
- **Role:** Primary brand typeface across all UI — feeds, nav, buttons, headings, body. The custom letterforms with ss01 stylistic set create X's distinctive voice; the tightly compressed 0.80 lineHeight on small sizes maximizes information density in the feed.

### Times — System fallback for legacy rendering paths; not a design choice but a technical fallback that should never appear in production UI · `--font-times`
- **Substitute:** n/a
- **Weights:** 400, 700
- **Sizes:** 15px
- **Line height:** 1.20
- **Role:** System fallback for legacy rendering paths; not a design choice but a technical fallback that should never appear in production UI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 11px | 1.22 | — | `--text-caption` |
| body | 15px | 1.33 | — | `--text-body` |
| subheading | 20px | 1.2 | — | `--text-subheading` |
| heading | 23px | 1.09 | — | `--text-heading` |

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
| 40 | 40px | `--spacing-40` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 9999px |
| cards | 16px |
| inputs | 4px |
| modals | 16px |
| avatars | 9999px |
| buttons | 9999px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| subtle | `rgba(0, 0, 0, 0.03) 0px 0px 2px 0px inset` | `--shadow-subtle` |
| sm | `rgba(101, 119, 134, 0.2) 0px 0px 8px 0px, rgba(101, 119, ...` | `--shadow-sm` |

### Layout

- **Page max-width:** 990px
- **Card padding:** 12px
- **Element gap:** 4px

## Components

### Follow Button
**Role:** Primary action — subscribing to a user's timeline

Pill button, 9999px radius, #1d9bf0 background, #ffffff text, TwitterChirp 15px weight 700, padding 0 16px, height ~36px. On hover, background lightens to ~#1a8cd8. Followed state inverts to outlined: transparent background, #536471 border (1px), #536471 text.

### Post/Reply Button
**Role:** Composing a new post or reply

Pill button, 9999px radius, #1d9bf0 background, #ffffff text, TwitterChirp 15px weight 700, full-width in compose area, min-height 36px, padding 0 16px. Disabled state reduces opacity to ~50%.

### Ghost Nav Button
**Role:** Secondary nav actions (back, more menus)

Circular 36×36px button, 9999px radius, transparent background, #0f1419 icon fill, no border. On hover, background fills with #eff3f4.

### Tweet Card
**Role:** Single post in the feed timeline

Full-width card on white (#ffffff), 1px bottom border in #eff3f4, padding 12px 16px. Contains 40px circular avatar, display name (TwitterChirp 15px weight 700 #0f1419) with optional verified check in #1d9bf0, @handle (TwitterChirp 15px weight 400 #536471), timestamp (13px #536471), post body (15px #0f1419), and optional media. Three-dot overflow menu at top-right.

### Post Action Bar
**Role:** Engagement interactions on each post

Horizontal row of five icon+count groups: reply, retweet, like, view count, bookmark, share. Icons in #536471 at 18.75px. Active states: retweet turns #00ba7c green, like turns #f91880 pink. Numbers in TwitterChirp 13px #536471. Vertical spacing between icon groups auto-distributes.

### Sign Up Card (Right Sidebar)
**Role:** New user acquisition in right rail

Card with #ffffff background, 16px radius, 1px #eff3f4 border (or no border on flat variant), padding ~16px. Contains headline 'New to X?' (20px weight 800 #0f1419), subtext (15px #536471), three stacked buttons: 'Sign up with Google' (white bg, #cfd9de border, black Google icon), 'Sign up with Apple' (white bg, #cfd9de border, black Apple icon), 'Create account' (outlined pill, #cfd9de border, #0f1419 text, 9999px radius).

### Bottom Sticky CTA Bar
**Role:** Persistent acquisition prompt

Full-width sticky bar at viewport bottom, #1d9bf0 background, padding 12px 16px. Left side: headline 'Don't miss what's happening' (15px weight 700 #ffffff), subtext (13px #ffffff). Right side: two pill buttons — 'Log in' (white bg, #0f1419 text) and 'Sign up' (outline white border, #ffffff text), both 9999px radius, ~32px height.

### Profile Header
**Role:** User identity surface on profile pages

Top section with full-width banner image (auto-height, no radius), 133×133px circular avatar overlapping banner by ~33px, padding 16px below. Profile name (20px weight 800 #0f1419) with verified badge, @handle (15px #536471), bio (15px #0f1419), link (15px #1d9bf0), metadata row (join date, location in 15px #536471), follower/following counts (15px #0f1419, label #536471). Follow button positioned top-right as pill.

### Search Input
**Role:** Global search and query input

Rounded input with 4px radius, #eff3f4 background, padding 8px 12px, placeholder text 15px #536471. No visible border. Search icon prefix in #536471. On focus, adds inset shadow rgba(0,0,0,0.03) 0px 0px 2px 0px.

### Verified Badge
**Role:** Authenticity marker on accounts

Small inline icon (~16px) in #1d9bf0, placed immediately after display name. Filled badge with check mark. No text label in standard variant.

### Tab Bar (Posts/Replies/Media)
**Role:** Profile page content filter

Horizontal tab strip, no background, 1px bottom border #cfd9de spanning full width. Each tab: TwitterChirp 15px weight 500, #536471 inactive / #0f1419 active, padding 16px, centered text. Active tab has 2px #1d9bf0 underline at bottom edge.

### Avatar
**Role:** User identity thumbnail

Circular image, 9999px radius, sizes range from 32px (feed) to 40px (tweet cards) to 133px (profile header). Fallback: #cfd9de background with user initial in #0f1419.

### Dropdown Overlay
**Role:** Contextual menus and pickers

Floating card with #ffffff background, 16px radius, subtle shadow rgba(101,119,134,0.2) 0px 0px 8px 0px + rgba(101,119,134,0.25) 0px 1px 3px 1px, padding 4px 0. Menu items: TwitterChirp 15px #0f1419, padding 8px 12px, hover fills #eff3f4.

## Do's and Don'ts

### Do
- Use 9999px radius on all interactive buttons, tags, and avatars
- Apply TwitterChirp with font-feature-settings: "ss01" on all UI text
- Use #1d9bf0 exclusively for actionable elements: Follow buttons, links, verified badges, active states
- Separate cards with 1px borders in #eff3f4 or #cfd9de — never use shadows for card definition
- Use #0f1419 for primary text, #536471 for secondary text, and #829aab for tertiary/disabled
- Maintain the three-column layout: left nav (68px), center feed (600px), right rail (290px) within a 990px max-width
- Use #eff3f4 for hover states and secondary surface fills only

### Don't
- Don't introduce any chromatic color beyond #1d9bf0 — the single-accent rule defines the system
- Don't use shadows for card separation — use hairline borders only
- Don't use sharp or moderate radii (0-8px) on buttons, tags, or avatars — 9999px is mandatory for interactive surfaces
- Don't center body text or feed content — left-align everything for scannability
- Don't use weight 800 for body text — reserve for display names, headlines, and the 20-23px scale only
- Don't add decorative imagery, illustrations, or branded graphics — user content is the visual layer
- Don't use #000000 for text — use #0f1419 for the softer near-black that defines the system

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas | `#ffffff` | Page background — the entire app sits on pure white |
| 1 | Card | `#ffffff` | Post cards, profile sections, sidebar widgets — same white as canvas, defined only by hairline borders |
| 2 | Hover | `#eff3f4` | Interactive feedback on rows, links, nav items — the only secondary fill |
| 3 | Action | `#1d9bf0` | Filled button backgrounds, active states, accent washes |

## Elevation

- **Dropdown Overlay:** `rgba(101, 119, 134, 0.2) 0px 0px 8px 0px, rgba(101, 119, 134, 0.25) 0px 1px 3px 1px`
- **Input Fields:** `rgba(0, 0, 0, 0.03) 0px 0px 2px 0px inset`

## Imagery

Imagery is user-generated, not branded. Profile banners are user-uploaded photos or abstract color fields (often warm tones like the orange shown). Post media is user-uploaded images and videos displayed at full card width with no decorative treatment — no masks, no rounded corners on the media itself. The X logo is the only branded visual asset: a stark black geometric mark. Icons throughout are single-color, filled, simple geometric shapes (circles, arrows, hearts, retweet arrows) at ~18.75px, rendered in #0f1419 or #536471 with no multi-color treatments. There are no illustrations, no abstract decorative graphics, no product photography — the platform is a container for user content, and the visual language reinforces that by being completely transparent.

## Layout

Three-column desktop layout centered within ~990px max-width. Left column: icon-only vertical nav (~68px), black X logo at top, navigation icons stacked vertically centered. Center column: ~600px wide, the main content surface (feed, profile, explore). Right column: ~290px wide, sticky sidebar with search, sign-up card, and footer links. Profile pages add a full-bleed banner image at top spanning the center+right columns, with the avatar overlapping the banner/content boundary. Cards stack vertically with 0px gap (separated only by 1px #eff3f4 hairline borders). No alternating section bands — the entire page is one continuous white surface. A full-width sticky bottom bar (blue) appears as an acquisition prompt. Navigation is minimal: left icon rail on desktop, bottom tab bar on mobile.

## Agent Prompt Guide

## Quick Color Reference
- text (primary): #0f1419
- text (secondary): #536471
- background: #ffffff
- border: #cfd9de
- accent: #1d9bf0
- primary action: #1d9bf0 (filled action)

## Example Component Prompts

**1. Create a Follow Button:**
Pill button, 9999px radius, #1d9bf0 background, #ffffff text, TwitterChirp 15px weight 700 with font-feature-settings "ss01" on, padding 0 16px, height 36px. Hover: background #1a8cd8.

**2. Create a Tweet Card:**
Full-width card, #ffffff background, 1px bottom border #eff3f4, padding 12px 16px. Left: 40px circular avatar (9999px radius). Right: display name (TwitterChirp 15px weight 700 #0f1419) + verified badge (#1d9bf0 check icon) + @handle (15px weight 400 #536471) + timestamp (13px #536471). Body text: 15px #0f1419. Action bar below: five icon groups in #536471 at 18.75px, with counts in 13px #536471.

**3. Create a Profile Header:**
Full-width banner image (no radius, auto height ~200px). 133px circular avatar (9999px radius) overlapping banner bottom by ~33px, positioned 16px from left. Name: TwitterChirp 20px weight 800 #0f1419 + verified badge. Handle: 15px #536471. Bio: 15px #0f1419. Follow button top-right: pill 9999px, #1d9bf0 bg, #ffffff text, 15px weight 700.

**4. Create a Sign-Up Sidebar Card:**
Card with #ffffff background, 16px radius, no border, padding 16px. Headline: 'New to X?' at 20px weight 800 #0f1419. Subtext: 15px #536471. Three stacked buttons: two social auth buttons (#ffffff bg, 1px #cfd9de border, 9999px radius, black brand icon, 15px weight 500 #0f1419 text) and one 'Create account' outlined button (transparent bg, 1px #cfd9de border, #0f1419 text, 9999px radius, full width).

**5. Create a Bottom Sticky CTA Bar:**
Full-width sticky bar, #1d9bf0 background, padding 12px 16px. Left: headline 15px weight 700 #ffffff, subtext 13px #ffffff. Right: two pill buttons — 'Log in' (white bg, #0f1419 text) and 'Sign up' (1px white border, transparent bg, #ffffff text), both 9999px radius, ~32px height.

## Single-Accent Philosophy

X enforces a monochrome interface with exactly one chromatic accent. The system is designed so that if you removed all #1d9bf0 from the interface, you would still understand the entire information architecture — the blue is decoration layered onto a complete achromatic system, not a load-bearing color. This means: text hierarchy works without color (weight + #0f1419 vs #536471), card separation works without color (hairline borders), interactive affordance works without color (pill shape + cursor). The blue arrives only on things that demand attention: a button you haven't pressed yet, a link you haven't clicked, a verified account. This restraint is the brand — X feels confident because it doesn't reach for color to explain itself.

## Similar Brands

- **Reddit** — Same text-first content feed philosophy, hairline border card separation, single accent color (Reddit Orange vs X Blue) on an otherwise monochrome interface, pill-shaped action buttons
- **Threads** — Near-identical three-column layout, infinite-radius pill buttons, and the same minimal-chrome approach to surfacing social conversation; both treat the timeline as a content surface rather than a software product
- **Mastodon** — Same compact density, hairline borders instead of shadows, and content-first vertical feed; Mastodon's purple accent operates the same single-color-punctuation role as X Blue
- **Hacker News** — Same newswire-on-white-paper philosophy — pure typographic hierarchy, zero decorative chrome, information density prioritized over visual comfort, hairline separators between items

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-x-blue: #1d9bf0;
  --color-ink-black: #0f1419;
  --color-graphite: #536471;
  --color-fog-gray: #829aab;
  --color-paper-white: #ffffff;
  --color-mist-gray: #eff3f4;
  --color-hairline-gray: #cfd9de;
  --color-shadow-dust: #e0e4e7;
  --color-charcoal: #4b4f53;

  /* Typography — Font Families */
  --font-twitterchirp: 'TwitterChirp', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-times: 'Times', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 11px;
  --leading-caption: 1.22;
  --text-body: 15px;
  --leading-body: 1.33;
  --text-subheading: 20px;
  --leading-subheading: 1.2;
  --text-heading: 23px;
  --leading-heading: 1.09;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
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
  --spacing-40: 40px;

  /* Layout */
  --page-max-width: 990px;
  --card-padding: 12px;
  --element-gap: 4px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-2xl: 16px;
  --radius-full: 9999px;

  /* Named Radii */
  --radius-tags: 9999px;
  --radius-cards: 16px;
  --radius-inputs: 4px;
  --radius-modals: 16px;
  --radius-avatars: 9999px;
  --radius-buttons: 9999px;

  /* Shadows */
  --shadow-subtle: rgba(0, 0, 0, 0.03) 0px 0px 2px 0px inset;
  --shadow-sm: rgba(101, 119, 134, 0.2) 0px 0px 8px 0px, rgba(101, 119, 134, 0.25) 0px 1px 3px 1px;

  /* Surfaces */
  --surface-canvas: #ffffff;
  --surface-card: #ffffff;
  --surface-hover: #eff3f4;
  --surface-action: #1d9bf0;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-x-blue: #1d9bf0;
  --color-ink-black: #0f1419;
  --color-graphite: #536471;
  --color-fog-gray: #829aab;
  --color-paper-white: #ffffff;
  --color-mist-gray: #eff3f4;
  --color-hairline-gray: #cfd9de;
  --color-shadow-dust: #e0e4e7;
  --color-charcoal: #4b4f53;

  /* Typography */
  --font-twitterchirp: 'TwitterChirp', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-times: 'Times', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 11px;
  --leading-caption: 1.22;
  --text-body: 15px;
  --leading-body: 1.33;
  --text-subheading: 20px;
  --leading-subheading: 1.2;
  --text-heading: 23px;
  --leading-heading: 1.09;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-40: 40px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-2xl: 16px;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-subtle: rgba(0, 0, 0, 0.03) 0px 0px 2px 0px inset;
  --shadow-sm: rgba(101, 119, 134, 0.2) 0px 0px 8px 0px, rgba(101, 119, 134, 0.25) 0px 1px 3px 1px;
}
```
