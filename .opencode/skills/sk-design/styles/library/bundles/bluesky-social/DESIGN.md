# Bluesky Social — Style Reference
> Morning dispatch beneath open sky

**Theme:** light

Bluesky uses an austere reading-first language: near-white canvas, hairline borders, compact Inter typography, and a single saturated blue that punctuates action and identity. The interface deliberately strips visual noise — no shadows, no gradients, no decorative geometry — letting user-generated content carry every ounce of visual weight. Pill-shaped controls and fully rounded avatars inject warmth into what would otherwise be a clinical three-column grid, while cool desaturated grays keep the chrome recede behind the feed. This is a content-forward social surface where the system is nearly invisible and the posts are the only spectacle.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Sky Signal | `#006aff` | `--color-sky-signal` | Brand accent — the single chromatic punctuation in a monochrome interface. Active nav items, inline links, hashtag chips, and filled primary buttons |
| Slate Type | `#405168` | `--color-slate-type` | Primary text and nav labels — a cool, slightly desaturated near-black that reads softer than pure ink on the warm-white canvas |
| Hazy Steel | `#8798b0` | `--color-hazy-steel` | Secondary icons, metadata, timestamps, and muted helper text. The cool tint keeps it visually adjacent to Sky Signal without competing |
| Whisper Border | `#dce2ea` | `--color-whisper-border` | Hairline dividers and card borders. The only structural line work in the system — it defines edges without adding weight |
| Fog Surface | `#eff2f6` | `--color-fog-surface` | Subtle fill for hover states, secondary buttons, and search input backgrounds. Sits one step above the canvas without creating contrast drama |
| Mist Canvas | `#f9fafb` | `--color-mist-canvas` | Page background — a barely-warm off-white that prevents the harshness of pure white during long reading sessions |
| Paper | `#ffffff` | `--color-paper` | Card and surface background. The single step up from the canvas that gives post cards their boundary via border, not shadow |
| Ink | `#000000` | `--color-ink` | Body text on cards and highest-contrast foreground. Used sparingly where maximum legibility is required |

## Tokens — Typography

### InterVariable — Sole typeface for all UI — navigation, post bodies, metadata, buttons, inputs. The variable axis is critical: the scale ranges from 8px timestamps to 24px tab headers, so the weight axis must flex smoothly across that range without optical hiccups. No display sizes exist — this is a feed UI, not a landing page. · `--font-intervariable`
- **Substitute:** Inter (static) or system-ui
- **Weights:** 400, 500, 600, 700
- **Sizes:** 8px, 11px, 12px, 13px, 15px, 16px, 24px
- **Line height:** 1.00, 1.13, 1.20, 1.25, 1.30, 1.33
- **Letter spacing:** normal (0)
- **OpenType features:** `"cv11", "ss03"`
- **Role:** Sole typeface for all UI — navigation, post bodies, metadata, buttons, inputs. The variable axis is critical: the scale ranges from 8px timestamps to 24px tab headers, so the weight axis must flex smoothly across that range without optical hiccups. No display sizes exist — this is a feed UI, not a landing page.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 11px | 1.25 | — | `--text-caption` |
| body-sm | 12px | 1.25 | — | `--text-body-sm` |
| body | 13px | 1.25 | — | `--text-body` |
| body-lg | 15px | 1.25 | — | `--text-body-lg` |
| heading-sm | 16px | 1.25 | — | `--text-heading-sm` |
| heading | 24px | 1.25 | — | `--text-heading` |

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

### Border Radius

| Element | Value |
|---------|-------|
| cards | 21px |
| inputs | 999px |
| avatars | 999px |
| buttons | 999px |
| nav-pills | 4px |
| media-embed | 12px |

### Layout

- **Section gap:** 24px
- **Card padding:** 12px
- **Element gap:** 8px

## Components

### Primary Filled Button
**Role:** Account creation and key conversions

Fill: #006aff. Text: #ffffff, InterVariable weight 700, 15px. Padding: 10px 20px. Border-radius: 999px (fully pill). No border, no shadow. The only chromatic surface in the entire interface — its rarity makes it unmissable.

### Ghost Text Button
**Role:** Secondary actions like Sign In

Fill: transparent. Text: #006aff, InterVariable weight 600, 15px. No border, no background. Padding: 10px 0. Sits inline next to filled buttons as a low-emphasis companion.

### Post Card
**Role:** Single feed item containing author, text, and optional media

Background: #ffffff. Border: 1px solid #dce2ea. Border-radius: 21px. Padding: 12px. No shadow. Internal layout: 40px avatar on left, content stack on right with 8px gap. Separated from next card by 12px vertical gap.

### Tab Navigation Item
**Role:** Feed selector at top of center column

Text: #405168, InterVariable weight 500, 16px for inactive. Weight 700 for active state. No background fill, no underline, no pill container. Active state communicates purely through weight shift. Optional sparkle icon suffix at #006aff.

### Circular Avatar
**Role:** User identity thumbnail in posts and sidebar

Border-radius: 999px. Standard size: 40px in post cards, 20px in action bars. No border. Fallback to colored initial block when image unavailable.

### Post Action Bar
**Role:** Reply, repost, like, bookmark, share row beneath post text

Icons: #8798b0 stroke, 1.5px weight. Count text: InterVariable weight 500, 12px, #8798b0. Spacing: 12px between action groups. Active/liked state flips icon color to #006aff and count to #405168. No backgrounds on action items.

### Search Input
**Role:** Top of right sidebar

Background: #eff2f6. Border: none. Border-radius: 999px. Padding: 8px 12px 8px 36px (left padding reserves room for search icon). Placeholder text: #8798b0, 15px weight 400. Search icon: #8798b0, 16px, positioned absolute left 12px.

### Trending Widget Card
**Role:** Sidebar module showing ranked topics

Background: #ffffff. Border: 1px solid #dce2ea. Border-radius: 21px. Padding: 12px. Header: InterVariable 16px weight 700, #405168. List items: numbered (1–5 in #8798b0 weight 500, 12px) with topic text in #405168 weight 500, 15px. Row gap: 8px.

### Hashtag / Inline Link
**Role:** Clickable text references within post bodies

Color: #006aff. Weight: inherits from body text. No underline by default; underline appears on hover. The blue link color is the only thing that makes it visually distinct from surrounding body text.

### Language Selector
**Role:** Locale dropdown in left sidebar

Text: #405168, 13px weight 500. Trailing chevron at #8798b0. No border, no background. Sits as a plain text link with dropdown affordance.

### Scroll-to-Top FAB
**Role:** Floating button that appears after scrolling

Background: #ffffff. Border: 1px solid #dce2ea. Border-radius: 999px. Size: 40px circle. Icon: up arrow in #405168, stroke 1.5px. No shadow — border alone communicates its floating status.

### Media Embed
**Role:** Image or video attached to a post

Border-radius: 12px. Full width within post card content area. Max-height constrained with object-fit: cover. No border, no shadow. A small timestamp overlay in the bottom-left corner at InterVariable 8px, #ffffff on translucent dark background.

## Do's and Don'ts

### Do
- Use #006aff as the only chromatic color in the interface — reserve it for active states, links, and the primary button
- Apply 999px border-radius to all buttons, tags, avatars, and inputs for the signature pill language
- Use #dce2ea 1px borders to define card and widget boundaries — never use shadows for this purpose
- Keep the type scale compact: body text at 15px, metadata at 12px, never exceed 24px for any UI heading
- Let user-uploaded photos and video be the only vivid visual content in the feed
- Set page background to #f9fafb and card surfaces to #ffffff — never invert this relationship
- Use #8798b0 for all secondary icons, timestamps, and metadata text

### Don't
- Never add drop shadows to cards, buttons, or floating elements
- Never use gradients of any kind — the palette is strictly flat
- Never introduce a second accent color — the monochrome-with-one-blue system is the identity
- Never use sharp corners on interactive elements — pills and 12px+ radii only
- Never add decorative illustration, stock photography, or branded graphics to the chrome
- Never use a background darker than #eff2f6 for surface differentiation
- Never exceed 24px for headings — this is a feed UI, not a marketing page

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Mist Canvas | `#f9fafb` | Page background — visible in gutters and behind all content |
| 1 | Paper | `#ffffff` | Post cards, sidebar widgets, and all elevated content surfaces |
| 2 | Fog Surface | `#eff2f6` | Interactive fills — search input, hover states, secondary controls |

## Elevation

The system is deliberately flat. Zero shadows are used anywhere — not even for floating action buttons or modals. Card boundaries are created exclusively by #dce2ea hairline borders at 1px. The scroll-to-top button achieves its floating quality through a border alone, not a drop shadow. This eliminates any depth ambiguity and keeps the reading surface visually calm. Elevation is expressed through border weight, not z-axis offset.

## Imagery

The visual language is entirely content-driven with zero decorative chrome. The interface contains no illustrations, no branded graphics, no abstract shapes, and no stock photography. The only imagery present is user-uploaded: circular avatars (40px standard) for identity, and rectangular media embeds (12px radius, full-width within post cards) for photos and videos. Media embeds are contained — never full-bleed or overlapping. There are no icons used decoratively; the icon set is functional only (search, reply, repost, like, bookmark, share, chevron, scroll-arrow), all rendered as 1.5px stroke in #8798b0. The design's visual richness comes entirely from what users post, not from the system itself.

## Layout

Fixed three-column app layout with no top navigation bar. Left sidebar (~260px) contains the brand mark, join prompt, and language selector. Center column (~600px) holds the feed with a sticky tab bar at the top (Discover / Feeds). Right sidebar (~300px) holds search and trending. Columns are separated by ~20px gutters over the #f9fafb canvas. The layout is not max-width centered — it fills the viewport with the three columns maintaining fixed widths and the remaining space distributing as outer margins. There is no footer. The hero pattern is not applicable — the first screen is a live feed, not a marketing surface. Section rhythm within the center column is uniform: post cards stack with consistent 12px gaps, no alternating bands, no dividers between cards beyond the card's own border. Navigation is minimal: two text tabs at the top of the feed, a language dropdown, and the scroll-to-top floating button. The density is information-rich — the interface prioritizes showing more posts per scroll over generous breathing room.

## Agent Prompt Guide

**Quick Color Reference**
- Text: #000000 (body) / #405168 (nav/labels) / #8798b0 (metadata/icons)
- Background: #f9fafb (page) / #ffffff (cards) / #eff2f6 (interactive fill)
- Border: #dce2ea (1px hairline)
No distinct primary action color was observed; use the extracted neutral button treatments instead of inventing a filled CTA color.
- primary action: no distinct CTA color

**Example Component Prompts**

1. *Post Card*: White background (#ffffff), 1px border #dce2ea, 21px radius, 12px padding. Left: 40px circular avatar (999px radius). Right: author name in InterVariable 15px weight 700 #000000, handle at 15px weight 400 #8798b0. Body text 15px weight 400 #000000. Action bar below: reply/repost/like/bookmark icons in #8798b0, 12px gaps, counts in 12px weight 500 #8798b0.


3. *Search Input*: Background #eff2f6, no border, 999px radius, height 36px. Search icon #8798b0 at left 12px. Placeholder "Search" in #8798b0, InterVariable 15px weight 400.

4. *Trending Widget*: White card (#ffffff), 1px border #dce2ea, 21px radius, 12px padding. Header "Trending" in InterVariable 16px weight 700 #405168. List of 5 items, each with #8798b0 number (12px weight 500) and topic text in #405168 15px weight 500. 8px row gap.

5. *Tab Navigation*: Two text tabs side by side with 16px gap. Inactive: InterVariable 16px weight 500 #405168. Active: same size, weight 700 #405168. No background, no underline, no pill container. Active state is communicated purely by weight shift.

## Similar Brands

- **Mastodon** — Same three-column feed layout, same hairline-border card approach, same monochrome palette with a single accent color, same compact Inter-class typography
- **Hacker News** — Same information-dense feed philosophy with near-zero chrome, content-first visual hierarchy, and minimal use of color as functional punctuation
- **Threads** — Same social-feed three-column structure and restrained monochrome UI, though Threads adds more image-forward treatment
- **Tildes** — Same text-first community feed with flat surfaces, hairline dividers, and pill-shaped interactive elements
- **Pinterest** — Same fully-rounded pill buttons and card-based feed grid, though Pinterest is far more image-saturated

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-sky-signal: #006aff;
  --color-slate-type: #405168;
  --color-hazy-steel: #8798b0;
  --color-whisper-border: #dce2ea;
  --color-fog-surface: #eff2f6;
  --color-mist-canvas: #f9fafb;
  --color-paper: #ffffff;
  --color-ink: #000000;

  /* Typography — Font Families */
  --font-intervariable: 'InterVariable', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 11px;
  --leading-caption: 1.25;
  --text-body-sm: 12px;
  --leading-body-sm: 1.25;
  --text-body: 13px;
  --leading-body: 1.25;
  --text-body-lg: 15px;
  --leading-body-lg: 1.25;
  --text-heading-sm: 16px;
  --leading-heading-sm: 1.25;
  --text-heading: 24px;
  --leading-heading: 1.25;

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

  /* Layout */
  --section-gap: 24px;
  --card-padding: 12px;
  --element-gap: 8px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 21px;
  --radius-full: 999px;

  /* Named Radii */
  --radius-cards: 21px;
  --radius-inputs: 999px;
  --radius-avatars: 999px;
  --radius-buttons: 999px;
  --radius-nav-pills: 4px;
  --radius-media-embed: 12px;

  /* Surfaces */
  --surface-mist-canvas: #f9fafb;
  --surface-paper: #ffffff;
  --surface-fog-surface: #eff2f6;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-sky-signal: #006aff;
  --color-slate-type: #405168;
  --color-hazy-steel: #8798b0;
  --color-whisper-border: #dce2ea;
  --color-fog-surface: #eff2f6;
  --color-mist-canvas: #f9fafb;
  --color-paper: #ffffff;
  --color-ink: #000000;

  /* Typography */
  --font-intervariable: 'InterVariable', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 11px;
  --leading-caption: 1.25;
  --text-body-sm: 12px;
  --leading-body-sm: 1.25;
  --text-body: 13px;
  --leading-body: 1.25;
  --text-body-lg: 15px;
  --leading-body-lg: 1.25;
  --text-heading-sm: 16px;
  --leading-heading-sm: 1.25;
  --text-heading: 24px;
  --leading-heading: 1.25;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 21px;
  --radius-full: 999px;
}
```
