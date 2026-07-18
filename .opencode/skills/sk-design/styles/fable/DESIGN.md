# Fable — Style Reference
> a literary reading nook with cream paper and ink — the book is the art

**Theme:** mixed

Fable reads like an editorial book club brought to life: generous cream surfaces, large warm serif headlines, and alternating full-bleed colored bands (forest green and sky blue) that frame colorful flat-illustration scenes. Typography is the loudest voice — Heldane Display at near-black weight with tight 0.86–0.94 line-heights produces a literary, slightly compressed headline look, while Inter handles every utility and body line at modest sizes with strong negative tracking. Buttons are stadium-pill shapes (60px radius) in two tones — dark on cream, white on color — and book covers themselves become the primary decorative motif, treated as editorial artwork rather than thumbnails. The overall rhythm is section-band driven: each full-bleed color block introduces a single concept with a headline, supporting copy, a single pill CTA, and an illustration or product preview on the right.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Fable Forest | `#064c37` | `--color-fable-forest` | Full-bleed dark section background, first-screen hero band — deep botanical green that makes the warm cream and orange illustration pop |
| Storybook Sky | `#43a1d7` | `--color-storybook-sky` | Full-bleed mid section background — cerulean blue band that carries product-feature storytelling between cream and green sections |
| Paper Cream | `#f7f4ee` | `--color-paper-cream` | Hairline borders, dividers, input outlines, and card edges on light surfaces. |
| Ink | `#161015` | `--color-ink` | Primary heading and display text — near-black with a violet undertone that warms the editorial serif without losing contrast |
| Charcoal Plum | `#292229` | `--color-charcoal-plum` | Filled pill button background, dark card surfaces, secondary heading color |
| Graphite | `#3f383d` | `--color-graphite` | Body text, paragraph copy, secondary UI text — warm dark gray that reads softer than pure black on cream |
| Char | `#070607` | `--color-char` | Footer background, darkest surface — reserved for terminal bands and footer chrome |
| Pure White | `#ffffff` | `--color-pure-white` | Page background, reverse-mode button fill (on dark sections), text on dark surfaces |
| Fog | `#ededed` | `--color-fog` | Subtle image placeholders, soft dividers, muted card backgrounds when a lighter neutral than cream is needed |

## Tokens — Typography

### Inter — All UI, body, button, link, and supporting text. Negative letter-spacing across the scale tightens Inter into an editorial companion to Heldane — at 16px body the tracking reads noticeably tighter than default. Weights 400 for body, 500 for labels/buttons, 600–700 reserved for emphasis. · `--font-inter`
- **Substitute:** Inter (already Google Fonts), or DM Sans
- **Weights:** 400, 500, 600, 700
- **Sizes:** 8px, 10px, 12px, 14px, 15px, 16px, 18px, 20px, 24px, 30px
- **Line height:** 1.00–1.60 (1.50 typical body, 1.25 for tight UI rows, 1.00 for inline tags)
- **Letter spacing:** -0.42px at 10px (-0.042em), -0.30px at 15px (-0.020em), -0.27px at 18px (-0.015em), -0.24px at 20px (-0.012em), -0.21px at 24px (-0.012em equivalent), tightening as size increases
- **OpenType features:** `"ss01" on, "cv11" on`
- **Role:** All UI, body, button, link, and supporting text. Negative letter-spacing across the scale tightens Inter into an editorial companion to Heldane — at 16px body the tracking reads noticeably tighter than default. Weights 400 for body, 500 for labels/buttons, 600–700 reserved for emphasis.

### Heldane Display — Editorial display headlines at 48–80px. Near-regular weight (400) with tight tracking and compressed line-heights creates a literary, magazine-cover feel — the headline is the hero, not a shout. The 22–26px usage at weight 500 handles mid-size editorial subtitles. · `--font-heldane-display`
- **Substitute:** Fraunces, Lora, or Playfair Display
- **Weights:** 400, 500
- **Sizes:** 22px, 26px, 48px, 72px, 80px
- **Line height:** 0.86–1.09 (extremely tight on display: 0.86 at 80px, 0.88 at 72px, 0.94 at 48px, 1.08–1.09 at 22–26px)
- **Role:** Editorial display headlines at 48–80px. Near-regular weight (400) with tight tracking and compressed line-heights creates a literary, magazine-cover feel — the headline is the hero, not a shout. The 22–26px usage at weight 500 handles mid-size editorial subtitles.

### Aktiv Grotesk — Aktiv Grotesk — detected in extracted data but not described by AI · `--font-aktiv-grotesk`
- **Weights:** 400
- **Sizes:** 13px
- **Line height:** 1.5
- **Role:** Aktiv Grotesk — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.5 | -0.2px | `--text-caption` |
| body-sm | 14px | 1.43 | -0.25px | `--text-body-sm` |
| body | 16px | 1.5 | -0.32px | `--text-body` |
| subheading | 20px | 1.33 | -0.4px | `--text-subheading` |
| heading-sm | 24px | 1.42 | -0.48px | `--text-heading-sm` |
| heading | 30px | 1.25 | -0.66px | `--text-heading` |
| heading-lg | 48px | 0.94 | — | `--text-heading-lg` |
| display | 72px | 0.88 | — | `--text-display` |

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
| 52 | 52px | `--spacing-52` |
| 80 | 80px | `--spacing-80` |
| 100 | 100px | `--spacing-100` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 12px |
| buttons | 60px |
| largeCards | 48px |
| smallChips | 8px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| lg | `rgba(0, 0, 0, 0.4) 0px 4px 20px 0px` | `--shadow-lg` |
| lg-2 | `rgba(0, 0, 0, 0.6) 0px 4px 20px 0px` | `--shadow-lg-2` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 24px
- **Element gap:** 24px

## Components

### Filled Pill Button — Dark
**Role:** Primary CTA on cream and white sections

Stadium-pill (60px radius), background #292229, white Inter text at 16px weight 500, padding 16px 28px, no border. Subtle shadow rgba(0,0,0,0.4) 0 4px 20px. Letter-spacing follows body tracking (~-0.32px).

### Filled Pill Button — White
**Role:** Primary CTA on colored bands (forest green, sky blue)

Stadium-pill (60px radius), background #ffffff, Ink (#161015) text at 16px weight 500, padding 16px 28px, no border. Same 60px radius and shadow as dark variant — only fill and text color invert.

### Ghost Text Link
**Role:** Secondary inline actions in nav and body copy

No background, 1px underline, Inter 16px weight 500, color #161015, no padding. Used for nav items and inline editorial links.

### Display Headline Section
**Role:** Hero and feature section headline block

Two-column layout: left column holds Heldane Display headline at 48–80px weight 400, line-height 0.86–0.94, color #161015 (on light) or #ffffff (on dark bands), max-width ~520px. Right column holds a 1:1 illustration or product mockup with generous negative space. 80px vertical padding top/bottom.

### Book Cover Tile
**Role:** Primary content unit — book cover grid items

No card chrome — book covers sit directly on the section background (cream or dark green). Slight 2–4px bottom shadow rgba(0,0,0,0.2) to lift covers off the page. 8–12px gap between covers. Arranged in a horizontally-scrolling row or 6-column grid.

### Cream Card
**Role:** General content card on white or colored backgrounds

Background #f7f4ee, radius 12px, padding 24px, no border. Optional lift shadow rgba(0,0,0,0.6) 0 4px 20px for elevated cards. Internal spacing: 16px between heading and body, 24px between card sections.

### Elevated Feature Card
**Role:** Phone mockup container and large feature blocks

Background #ffffff, radius 48px (large rounded card), padding 32–40px, shadow rgba(0,0,0,0.6) 0 4px 20px. Used to frame device mockups and product previews on colored section bands.

### Navigation Bar
**Role:** Top-of-page site navigation

Transparent or solid section-color background, no border, horizontal layout with logo left, center links, account/cart icons right. Nav links in Inter 14–16px weight 500. Logo is a small mark with the wordmark — minimal, no background fill.

### Section Band
**Role:** Full-bleed colored content section

Edge-to-edge background color (forest green, sky blue, or cream), internal max-width 1200px centered, vertical padding 80–120px. Contains a Display Headline Section or book grid. No visible borders between bands — the color change is the divider.

### Book Cover Grid Row
**Role:** Horizontal strip of book covers

Single row of 6–8 book covers, 12px gaps, no card frames, slight scale-on-hover. Sits inside a cream or dark-green Section Band. Overhangs the max-width slightly to imply the row scrolls or continues.

### Illustration Scene
**Role:** Brand artwork in hero and feature sections

Flat, dimensional illustration of a person with bold solid color blocks (orange, teal, pink, white). Placed in the right column of a Display Headline Section, roughly 1:1 aspect ratio, with floating geometric accents (stars, circles) in brand colors. No stroke outlines — color blocks define the form.

### Phone Mockup Frame
**Role:** Product screenshot container on feature bands

White phone bezel with rounded corners (radius 36px), screen content visible at 9:16 aspect, floats inside an Elevated Feature Card. Subtle drop shadow lifts it above the blue section background.

## Do's and Don'ts

### Do
- Use Heldane Display at weight 400 (never 500+) for all headlines 48px and above — the near-regular weight is the editorial signature
- Use the stadium-pill 60px radius for every button — filled dark on cream, filled white on colored bands, never square or small-radius
- Alternate full-bleed section bands: Fable Forest → cream → Storybook Sky → cream, using color as the primary section divider instead of hairlines or spacing
- Set Inter body text with negative letter-spacing matching the scale (-0.32px at 16px, -0.66px at 30px) — default Inter tracking breaks the editorial feel
- Use Paper Cream (#f7f4ee) as the default card and page surface over pure white — the warm off-white is the brand's "page"
- Let book covers speak for themselves: no card frames, no overlays, no badges — just the cover on a clean surface with 8–12px gaps
- Tighten display headline line-height to 0.86–0.94 at sizes 48–80px so lines lock together visually like editorial print

### Don't
- Don't use square or 4–8px radius buttons — the 60px pill is non-negotiable and defines the brand voice
- Don't place headlines on pure white over 24px — pair every display headline with either a cream, forest, or sky background
- Don't use chromatic color for CTAs — buttons are always dark or white; #43a1d7 and #064c37 are backgrounds only, never fills
- Don't introduce gradients, glows, or colored shadows — the only shadow allowed is the simple 0 4px 20px black drop
- Don't use Heldane Display for body, captions, or UI labels — it is headline-only at 22px+; everything else is Inter
- Don't add card borders or hairline dividers inside Section Bands — let the color contrast do the structural work
- Don't use 100% black for body or heading text — Ink (#161015) and Charcoal Plum (#292229) keep the warm editorial tone

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Page Canvas | `#ffffff` | Base page background between colored section bands |
| 1 | Paper Cream | `#f7f4ee` | Warm card surface, light section bands, signature brand surface |
| 2 | Soft Fog | `#ededed` | Image placeholders, muted inset surfaces |
| 3 | Storybook Sky | `#43a1d7` | Full-bleed mid-page blue band for feature storytelling |
| 4 | Fable Forest | `#064c37` | Full-bleed dark hero band — primary brand color moment |
| 5 | Char Footer | `#070607` | Darkest terminal surface for footer chrome |

## Elevation

- **Filled Pill Button:** `0 4px 20px 0 rgba(0, 0, 0, 0.4)`
- **Cream Card / Elevated Feature Card:** `0 4px 20px 0 rgba(0, 0, 0, 0.6)`
- **Book Cover Tile:** `0 2px 8px 0 rgba(0, 0, 0, 0.2)`

## Imagery

Illustration is the hero imagery style: flat, dimensional, color-block figures of people reading or interacting with books, painted in bold solids — burnt orange clothing, teal trousers, warm skin tones, pink and white accents. Scenes include floating geometric confetti (stars, circles, plus signs) in brand yellow/blue. The illustrations are roughly 1:1, sit in the right column of two-column sections, and are unsigned editorial-feeling. Photography is almost entirely book cover artwork, treated as editorial content — no lifestyle photography, no people photography outside the illustrations. The visual density is illustration-and-type-forward with very little photographic surface.

## Layout

Max-width 1200px centered, but section bands break to full-bleed edge-to-edge. Hero and feature sections are always two-column: left text block (max-width ~520px) with headline + sub + single pill CTA, right illustration or phone mockup. After every Display Headline Section, a full-width Book Cover Grid Row runs edge-to-edge with slight overhang, implying a horizontal scroll. Section rhythm alternates: dark green band → cream band → blue band → cream band → dark footer. Navigation is a minimal transparent top bar with logo left, two center links, and two right-side icons (account, cart). No sidebar, no mega-menu, no sticky header behavior — the sections themselves carry the eye through the page.

## Agent Prompt Guide

**Quick Color Reference**
- text (primary): #161015
- text (body): #3f383d
- background (page): #ffffff
- background (card/surface): #f7f4ee
- border: none (use color bands instead)
- accent (decorative): #43a1d7
- primary action: #292229 (filled action)

**Example Component Prompts**
1. *Create a hero section on Fable Forest (#064c37) full-bleed background, 80px vertical padding, max-width 1200px centered. Left column: headline in Heldane Display 72px weight 400, color #ffffff, line-height 0.88. Subtext in Inter 18px weight 400, color #ffffff, line-height 1.5, max-width 460px. Filled Pill Button — White: #ffffff background, Ink (#161015) text, 60px radius, padding 16px 28px, Inter 16px weight 500. Right column: 1:1 illustration of a reader with a bird, floating orange and yellow geometric accents.*

2. *Create a Cream Card on a white page: background #f7f4ee, radius 12px, padding 24px, shadow 0 4px 20px rgba(0,0,0,0.6). Heading in Inter 24px weight 600, color #161015, letter-spacing -0.48px. Body in Inter 16px weight 400, color #3f383d, letter-spacing -0.32px, line-height 1.5. 16px gap between heading and body.*

3. *Create a Book Cover Grid Row: horizontal row of 6 book covers, 12px gap, no card frames, covers sit directly on a Storybook Sky (#43a1d7) section background. Each cover has a subtle 0 2px 8px rgba(0,0,0,0.2) shadow. Row slightly overhangs the 1200px max-width to imply a scrollable strip.*

4. *Create a Display Headline on a cream section: Heldane Display 80px weight 400, color #161015, line-height 0.86, max-width 560px, letter-spacing 0. Below it a sub in Heldane Display 26px weight 500, line-height 1.08, color #3f383d. No underline, no italic.*

5. *Create a phone mockup in an Elevated Feature Card on a Storybook Sky (#43a1d7) section: card background #ffffff, radius 48px, padding 40px, shadow 0 4px 20px rgba(0,0,0,0.6). Inside, a phone with 36px corner-radius bezel, screen showing a book list UI in Inter. Card sits in the right half of the section, left half holds a Display Headline Section in Ink color.*

## Section Band System

Sections are the primary structural device, not cards or dividers. Use this sequence for any new page:

1. **Fable Forest (#064c37)** — opening hero or brand-moment section, white text, white pill CTA, large illustration right
2. **Paper Cream (#f7f4ee)** — explanatory or community section, dark Ink text, dark pill CTA
3. **Storybook Sky (#43a1d7)** — product feature section, dark Ink text, dark pill CTA, phone mockup or illustration right
4. **Paper Cream (#f7f4ee)** — secondary feature or social-proof section
5. **Char (#070607)** — terminal footer band

Never put two bands of the same color adjacent. Never introduce a third chromatic background — the two-color (green + blue) rotation is the system.

## Similar Brands

- **Bookshop.org** — Same editorial serif-headline + cream-surface approach with book covers as primary content units
- **The New Yorker digital** — Same tight-line-height display serif and warm off-white reading surface for literary content
- **Substack homepage** — Same full-bleed color-band section structure with left-text/right-illustration split and pill CTAs
- **Headspace** — Same flat-illustration character art with bold color-block clothing floating against solid color backgrounds
- **MagicLinks / Literati** — Same book-discovery grid pattern with covers as the dominant visual, cream and dark contrast

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-fable-forest: #064c37;
  --color-storybook-sky: #43a1d7;
  --color-paper-cream: #f7f4ee;
  --color-ink: #161015;
  --color-charcoal-plum: #292229;
  --color-graphite: #3f383d;
  --color-char: #070607;
  --color-pure-white: #ffffff;
  --color-fog: #ededed;

  /* Typography — Font Families */
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-heldane-display: 'Heldane Display', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-aktiv-grotesk: 'Aktiv Grotesk', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --tracking-caption: -0.2px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.43;
  --tracking-body-sm: -0.25px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.32px;
  --text-subheading: 20px;
  --leading-subheading: 1.33;
  --tracking-subheading: -0.4px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.42;
  --tracking-heading-sm: -0.48px;
  --text-heading: 30px;
  --leading-heading: 1.25;
  --tracking-heading: -0.66px;
  --text-heading-lg: 48px;
  --leading-heading-lg: 0.94;
  --text-display: 72px;
  --leading-display: 0.88;

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
  --spacing-28: 28px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-52: 52px;
  --spacing-80: 80px;
  --spacing-100: 100px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 24px;
  --element-gap: 24px;

  /* Border Radius */
  --radius-sm: 2px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-3xl: 24px;
  --radius-full: 48px;
  --radius-full-2: 60px;

  /* Named Radii */
  --radius-cards: 12px;
  --radius-buttons: 60px;
  --radius-largecards: 48px;
  --radius-smallchips: 8px;

  /* Shadows */
  --shadow-lg: rgba(0, 0, 0, 0.4) 0px 4px 20px 0px;
  --shadow-lg-2: rgba(0, 0, 0, 0.6) 0px 4px 20px 0px;

  /* Surfaces */
  --surface-page-canvas: #ffffff;
  --surface-paper-cream: #f7f4ee;
  --surface-soft-fog: #ededed;
  --surface-storybook-sky: #43a1d7;
  --surface-fable-forest: #064c37;
  --surface-char-footer: #070607;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-fable-forest: #064c37;
  --color-storybook-sky: #43a1d7;
  --color-paper-cream: #f7f4ee;
  --color-ink: #161015;
  --color-charcoal-plum: #292229;
  --color-graphite: #3f383d;
  --color-char: #070607;
  --color-pure-white: #ffffff;
  --color-fog: #ededed;

  /* Typography */
  --font-inter: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-heldane-display: 'Heldane Display', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-aktiv-grotesk: 'Aktiv Grotesk', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --tracking-caption: -0.2px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.43;
  --tracking-body-sm: -0.25px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.32px;
  --text-subheading: 20px;
  --leading-subheading: 1.33;
  --tracking-subheading: -0.4px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.42;
  --tracking-heading-sm: -0.48px;
  --text-heading: 30px;
  --leading-heading: 1.25;
  --tracking-heading: -0.66px;
  --text-heading-lg: 48px;
  --leading-heading-lg: 0.94;
  --text-display: 72px;
  --leading-display: 0.88;

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
  --spacing-52: 52px;
  --spacing-80: 80px;
  --spacing-100: 100px;

  /* Border Radius */
  --radius-sm: 2px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-3xl: 24px;
  --radius-full: 48px;
  --radius-full-2: 60px;

  /* Shadows */
  --shadow-lg: rgba(0, 0, 0, 0.4) 0px 4px 20px 0px;
  --shadow-lg-2: rgba(0, 0, 0, 0.6) 0px 4px 20px 0px;
}
```
