# Readwise — Style Reference
> A reader's annotated journal — quiet paper-white, serif headlines, and one blue pen.

**Theme:** light

Readwise presents a literary productivity workspace: a near-white canvas with a single editorial blue accent and warm yellow highlighter washes that literally visualize the product's purpose. The type system pairs a transitional serif (Charter) for headlines with a humanist sans (Mulish) for everything else, creating a bookish-but-modern reading-room atmosphere rather than a typical SaaS dashboard feel. Surfaces are flat and quiet — cards float on a cool paper-white (#f1f5f8) with hairline borders, almost no shadows, and rounded corners that feel like printed cards rather than app tiles. Yellow (#fff7ca) functions as a literal highlighter behind in-line emphasized text, not as a decorative accent — the product's identity IS the act of marking what matters. Components stay compact and text-forward, with one filled blue button carrying all the weight and everything else rendered in ghost or text-link form.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Pen Blue | `#478cd0` | `--color-pen-blue` | Blue supporting accent for decorative details and low-frequency emphasis. Do not promote it to the primary CTA color |
| Highlighter Yellow | `#fff7ca` | `--color-highlighter-yellow` | Yellow supporting accent for decorative details and low-frequency emphasis. |
| Reader Orange | `#fb9100` | `--color-reader-orange` | Orange supporting accent for decorative details and low-frequency emphasis |
| Paper White | `#ffffff` | `--color-paper-white` | Card surfaces, product screenshot backgrounds, button text on filled buttons, and the nav background. The topmost surface tier |
| Ink | `#1f1f1f` | `--color-ink` | Primary heading and body text. Near-black rather than pure black — softer on the eye, reads as printed ink rather than digital display |
| Page Mist | `#f1f5f8` | `--color-page-mist` | Page canvas background. A cool, very-light blue-gray that reads as off-white paper rather than a flat gray, giving the entire page a subtle blue cast |
| Deep Slate | `#2d2f33` | `--color-deep-slate` | Secondary text and dark surface details. Used in nav and component borders where a slightly different tone from Ink is needed |
| True Black | `#000000` | `--color-true-black` | Dark supporting neutral for text, icons, and strong contrast. |

## Tokens — Typography

### Charter — Editorial serif used exclusively for headlines and large display text. The choice of a transitional serif in a productivity SaaS is the site's signature move — it signals 'reading' and 'books' before any copy is read. Weight 400 at 50px with lineHeight 1.00 creates tight, book-title-style display; weight 600 at 29px handles section headlines. Substitute: Source Serif Pro or Lora if Charter is unavailable. · `--font-charter`
- **Substitute:** Source Serif Pro
- **Weights:** 400, 600
- **Sizes:** 22px, 29px, 50px
- **Line height:** 1.00–1.25
- **Letter spacing:** normal
- **Role:** Editorial serif used exclusively for headlines and large display text. The choice of a transitional serif in a productivity SaaS is the site's signature move — it signals 'reading' and 'books' before any copy is read. Weight 400 at 50px with lineHeight 1.00 creates tight, book-title-style display; weight 600 at 29px handles section headlines. Substitute: Source Serif Pro or Lora if Charter is unavailable.

### Mulish — Humanist sans for everything non-display: nav, body, buttons, labels, icons. The weight range is wide — 400 for body, 600 for buttons, 700/800 for bold tags and emphasis. Tighter lineHeight (1.09) at 11px keeps captions compact; 1.50 at 16–18px gives body copy room to breathe. Consistent -0.02em tracking across all sizes tightens the sans into a clean utility voice. · `--font-mulish`
- **Substitute:** Inter or DM Sans
- **Weights:** 400, 600, 700, 800
- **Sizes:** 11px, 14px, 16px, 18px, 22px
- **Line height:** 1.09–1.50
- **Letter spacing:** -0.02em
- **OpenType features:** `"tnum" on, "lnum" on`
- **Role:** Humanist sans for everything non-display: nav, body, buttons, labels, icons. The weight range is wide — 400 for body, 600 for buttons, 700/800 for bold tags and emphasis. Tighter lineHeight (1.09) at 11px keeps captions compact; 1.50 at 16–18px gives body copy room to breathe. Consistent -0.02em tracking across all sizes tightens the sans into a clean utility voice.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 11px | 1.09 | -0.22px | `--text-caption` |
| body-sm | 14px | 1.5 | -0.28px | `--text-body-sm` |
| body | 16px | 1.5 | -0.32px | `--text-body` |
| subheading | 18px | 1.5 | -0.36px | `--text-subheading` |
| heading-sm | 22px | 1.25 | -0.44px | `--text-heading-sm` |
| heading | 29px | 1.13 | — | `--text-heading` |
| display | 50px | 1 | — | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 8 | 8px | `--spacing-8` |
| 12 | 12px | `--spacing-12` |
| 20 | 20px | `--spacing-20` |
| 24 | 24px | `--spacing-24` |
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |
| 60 | 60px | `--spacing-60` |
| 64 | 64px | `--spacing-64` |

### Border Radius

| Element | Value |
|---------|-------|
| nav | 16px |
| tags | 10px |
| cards | 10px |
| buttons | 10px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 64px
- **Card padding:** 24px
- **Element gap:** 12px

## Components

### Primary CTA Button
**Role:** The main conversion action on hero and feature sections

Filled with Pen Blue (#478cd0), white text, Mulish 16px weight 600 uppercase tracking, 10px border-radius, 10px vertical / 24px horizontal padding. Single, confident button — no secondary action beside it on the hero.

### Ghost Sign In Button
**Role:** Top-right navigation action

White background, 1px True Black border, 10px radius, Mulish 14px weight 600, 10px vertical / 18px horizontal padding. Outlined, not filled — keeps the nav quiet.

### Feature Badge Tag
**Role:** Flags new or beta features in the nav

Reader Orange (#fb9100) pill background, white text, Mulish 11px weight 700, 10px radius, tightly padded (2–4px vertical, 6px horizontal). Small enough to be a footnote, colorful enough to catch the eye.

### Step Icon Circle
**Role:** Visual anchor for 'How it works' steps

36–40px filled circle with a white line-icon inside. Three instances use three different colors: Pen Blue, a desaturated purple, and Reader Orange. Each circle sits above a Charter 22px step title and a Mulish 14–16px description.

### Testimonial Card
**Role:** User social proof in horizontal scroll

White card on Page Mist canvas, 10px radius, 24px padding, hairline 1px border in #f1f5f8 (slightly darker than canvas), optional very soft shadow. Contains avatar, name, handle, date, and the tweet text in Mulish 14px. Twitter card aesthetic — looks like a screenshot, not a designed card.

### In-line Highlighted Text
**Role:** Emphasizes key phrases in body copy

Text wrapped in a Highlighter Yellow (#fff7ca) background wash, no border, no padding adjustment. The yellow extends slightly above and below the text baseline. This is the product's signature visual element — it IS the brand.

### Product Hero Mockup
**Role:** Shows the actual app on laptop and phone

Photorealistic laptop and iPhone frame, centered on Page Mist canvas, slight rotation/tilt for depth. The laptop screen shows the Daily Review interface; the phone shows a connected mobile view. Functions as the hero's primary visual — not an illustration, a real product shot.

### Navigation Bar
**Role:** Top-level site navigation

White background, 16px radius on the outer container (pill-shaped bar), horizontal layout: logo left, nav links center, Sign In button right. Tight vertical padding (~14px). Minimal, quiet, almost invisible.

### Text Link
**Role:** In-body navigation and references

Pen Blue (#478cd0), underlined, Mulish inherits surrounding text size. Used for usernames, hashtags, and references inside testimonial content. No special hover treatment needed — the underline IS the affordance.

### Section Heading
**Role:** Top-of-section titles like 'Here's how Readwise works:' and 'Here's what our users say:'

Charter 29px weight 400, Ink color, lineHeight 1.13, centered alignment. Sets the editorial tone immediately — a serif headline tells the reader they're in a book-adjacent space, not a dashboard.

## Do's and Don'ts

### Do
- Use Charter 50px weight 400 for hero display headlines, lineHeight 1.00, no letter-spacing adjustment — the tight leading makes the headline feel like a book title.
- Apply #fff7ca as a background wash behind 2–4 word phrases in body copy to signal emphasis; never as a full-surface background or button fill.
- Set the primary CTA as a solid #478cd0 button with white text, 10px radius, and 10/24px padding — no gradients, no shadows on the button itself.
- Use Mulish -0.02em tracking at all sizes; the tightened letter-spacing is what makes the sans feel like a deliberate choice rather than a default.
- Layer cards on the #f1f5f8 canvas with white #ffffff fills and hairline borders rather than relying on shadows for separation.
- Limit chromatic color to the single Pen Blue accent for actions and links; use Reader Orange only for the single 'Reader' feature badge.
- Pair every serif headline with Mulish body text at 16–18px — the contrast between transitional serif and humanist sans is the site's typographic identity.

### Don't
- Don't use Charter for body copy, nav, or buttons — it's reserved for headlines 22px and above.
- Don't apply #fff7ca to full card surfaces, section backgrounds, or large areas — it loses its meaning as a highlighter if it covers more than a line of text.
- Don't introduce additional accent colors beyond Pen Blue, Highlighter Yellow, and Reader Orange — the system is deliberately near-monochromatic.
- Don't use heavy drop shadows on cards or buttons; if elevation is needed, keep it soft (spread ≤ 20px) and tinted with Ink rather than pure black.
- Don't set display headlines in all-caps or with positive letter-spacing — Charter at 50px works because of its tight 1.00 leading and natural tracking.
- Don't use a filled colored button for secondary actions; use the Ghost Sign In style (white fill, 1px border) or a plain text link in Pen Blue.
- Don't set the page background to pure white #ffffff — Page Mist #f1f5f8 is what makes the white cards and product mockups read as elevated surfaces.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Page Canvas | `#f1f5f8` | Base page background. Cool off-white paper tone. |
| 1 | Card Surface | `#ffffff` | Testimonial cards, product mockup backgrounds, elevated content blocks. |
| 2 | Highlight Wash | `#fff7ca` | In-line emphasis behind text. Also used as a soft callout surface. |

## Elevation

- **Product mockup laptop frame:** `0 20px 40px rgba(31,31,31,0.15)`
- **Testimonial cards:** `0 2px 8px rgba(31,31,31,0.08)`

## Imagery

Product mockups dominate the visual hierarchy: a photorealistic laptop showing the Daily Review interface paired with an iPhone showing the mobile companion, both centered on the hero. The mockups are real product screenshots, not illustrations or 3D renders. Below the hero, user-generated content (tweet screenshots) provides social proof in a horizontal scrolling row — treated as found objects rather than designed cards. The only illustration is three small circular step icons in the 'How it works' section, each a flat filled circle with a white line-glyph. No lifestyle photography, no abstract graphics, no decorative imagery — every visual either shows the product or shows what users say about it.

## Layout

Centered, max-width ~1200px page container with a near-full-bleed hero. The hero is a vertical stack: nav bar at top, large serif headline, sub-headline with inline yellow highlight, single blue CTA, then the product mockup below — no split-screen, no side-by-side text/image. Sections below the hero alternate between centered text-and-icon blocks (3-column grid for 'How it works') and horizontal-scrolling card rows (testimonials). Vertical rhythm is comfortable but not spacious — ~64px between sections, ~24px internal padding. The nav is a single horizontal bar, not sticky, with a pill-shaped container that sits on the Page Mist background. No sidebar, no mega-menu, no footer visible above the fold.

## Agent Prompt Guide

**Quick Color Reference**
- text: #1f1f1f
- background: #f1f5f8
- card surface: #ffffff
- border / hairline: #e2e8f0 (derive from #f1f5f8 family)
- highlight wash: #fff7ca
- primary action: no distinct CTA color
- feature badge: #fb9100 (Reader Orange, single-use)

**3-5 Example Component Prompts**

No distinct primary action color was observed; use the extracted neutral button treatments instead of inventing a filled CTA color.

2. **Section heading block**: Charter 29px weight 400, #1f1f1f, lineHeight 1.13, centered. Followed by 64px vertical gap to a 3-column grid of step cards on the #f1f5f8 canvas.

3. **Step card**: centered column. 40px filled circle in #478cd0 with a white line-icon. Below: Charter 22px weight 600 step title in #1f1f1f. Below: Mulish 16px weight 400 description in #1f1f1f, max-width 280px.

4. **Testimonial card**: #ffffff background, 10px radius, 24px padding, 1px hairline border (#e2e8f0), soft shadow 0 2px 8px rgba(31,31,31,0.08). Avatar 32px circle top-left, name in Mulish 14px weight 700 #1f1f1f, handle in Mulish 14px weight 400 #478cd0, date in Mulish 14px weight 400 #1f1f1f. Body text in Mulish 14px weight 400 #1f1f1f with #478cd0 underlined link text inline.

5. **Ghost nav button**: #ffffff background, 1px solid #000000 border, 10px radius, Mulish 14px weight 600 #1f1f1f, 10px vertical / 18px horizontal padding. Sits at the right edge of the nav bar.

## Typographic Identity

The serif/sans pairing is the single most distinctive choice in this system. Charter at 50px weight 400 with lineHeight 1.00 for the hero, Charter at 29px weight 400 for section headlines, then Mulish for everything from 22px down. The serif does not appear in body copy, nav, or buttons — it is a display-only face. This split is deliberate: the serif signals 'reading material / books / editorial', while Mulish handles all functional UI. Don't blur this boundary; don't set Charter at 14px or 16px, and don't let Mulish creep into the headline role.

## Similar Brands

- **Medium** — Same serif-display-headline + sans-body pairing on a near-white canvas, with a single accent color used sparingly for CTAs and links.
- **Substack** — Editorial serif headlines on a quiet paper-white background, product-first hero with a real screenshot, and an almost-monochromatic palette that lets the content carry the color.
- **Notion** — Comfortable density, minimal nav, product mockups as hero imagery, and a near-monochromatic palette with one accent color doing all the work.
- **Pocket (Mozilla)** — Reading-focused product with a single blue accent on white, testimonial-heavy social proof section, and compact typographic rhythm.

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-pen-blue: #478cd0;
  --color-highlighter-yellow: #fff7ca;
  --color-reader-orange: #fb9100;
  --color-paper-white: #ffffff;
  --color-ink: #1f1f1f;
  --color-page-mist: #f1f5f8;
  --color-deep-slate: #2d2f33;
  --color-true-black: #000000;

  /* Typography — Font Families */
  --font-charter: 'Charter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-mulish: 'Mulish', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 11px;
  --leading-caption: 1.09;
  --tracking-caption: -0.22px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.5;
  --tracking-body-sm: -0.28px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.32px;
  --text-subheading: 18px;
  --leading-subheading: 1.5;
  --tracking-subheading: -0.36px;
  --text-heading-sm: 22px;
  --leading-heading-sm: 1.25;
  --tracking-heading-sm: -0.44px;
  --text-heading: 29px;
  --leading-heading: 1.13;
  --text-display: 50px;
  --leading-display: 1;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
  --font-weight-extrabold: 800;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-60: 60px;
  --spacing-64: 64px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 64px;
  --card-padding: 24px;
  --element-gap: 12px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 10px;
  --radius-2xl: 16px;

  /* Named Radii */
  --radius-nav: 16px;
  --radius-tags: 10px;
  --radius-cards: 10px;
  --radius-buttons: 10px;

  /* Surfaces */
  --surface-page-canvas: #f1f5f8;
  --surface-card-surface: #ffffff;
  --surface-highlight-wash: #fff7ca;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-pen-blue: #478cd0;
  --color-highlighter-yellow: #fff7ca;
  --color-reader-orange: #fb9100;
  --color-paper-white: #ffffff;
  --color-ink: #1f1f1f;
  --color-page-mist: #f1f5f8;
  --color-deep-slate: #2d2f33;
  --color-true-black: #000000;

  /* Typography */
  --font-charter: 'Charter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-mulish: 'Mulish', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 11px;
  --leading-caption: 1.09;
  --tracking-caption: -0.22px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.5;
  --tracking-body-sm: -0.28px;
  --text-body: 16px;
  --leading-body: 1.5;
  --tracking-body: -0.32px;
  --text-subheading: 18px;
  --leading-subheading: 1.5;
  --tracking-subheading: -0.36px;
  --text-heading-sm: 22px;
  --leading-heading-sm: 1.25;
  --tracking-heading-sm: -0.44px;
  --text-heading: 29px;
  --leading-heading: 1.13;
  --text-display: 50px;
  --leading-display: 1;

  /* Spacing */
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-60: 60px;
  --spacing-64: 64px;

  /* Border Radius */
  --radius-md: 4px;
  --radius-lg: 10px;
  --radius-2xl: 16px;
}
```
