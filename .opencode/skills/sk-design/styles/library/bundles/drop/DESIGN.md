# Drop — Style Reference
> lavender editorial spread in bold serif. Lavender dusk washing over stark white pages, anchored by a confident slab-serif voice that commands the page like a broadsheet headline.

**Theme:** light

Drop operates as an editorial-tech hybrid: crisp sans-serif body type (ABC Normal) meets a confident slab-serif display (Ivar Display) that dominates the page at near-poster scale, anchoring an otherwise restrained palette of black, white, and a soft lavender (#b8afda) that recurs as the chromatic signature. The page alternates between near-white surfaces and a black editorial band, with vivid orange and electric yellow reserved as hard punctuation for revenue figures, data callouts, and the new-world narrative. Components lean pill-shaped (1440px radius is ubiquitous for buttons, tags, and nav), card radii cluster between 16-24px, and the system avoids shadows almost entirely — contrast comes from hard color blocks, not elevation. The overall attitude is that of a confident magazine spread that also happens to be a product page.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Obsidian | `#101010` | `--color-obsidian` | Neutral form states, badge text, and quiet UI feedback where color should stay understated. Do not promote it to the primary CTA color |
| Pure White | `#ffffff` | `--color-pure-white` | Page canvas, card surfaces, text on dark fills — the default surface that 60%+ of the page lives on |
| Carbon | `#1a1a1a` | `--color-carbon` | Dark card surfaces for product mockups and the dark editorial band, barely distinguishable from Obsidian to create depth without color |
| Mint Cream | `#e5ede4` | `--color-mint-cream` | Light pastel surface tint, used sparingly for soft card backgrounds that need warmth without chromatic commitment |
| Sage Mist | `#c7d8c5` | `--color-sage-mist` | Near-gray green surface wash, appears as a muted canvas tint on light sections and soft card backgrounds |
| Ash Gray | `#9b9b9b` | `--color-ash-gray` | Muted helper text, secondary borders, inactive UI elements — handles every de-emphasized text or border role |
| Lavender Mist | `#b8afda` | `--color-lavender-mist` | Dominant chromatic accent, large section backgrounds, circle diagram fills, decorative borders — carries the brand's pastel identity and appears more than any other chromatic color |
| Ember Orange | `#eb652b` | `--color-ember-orange` | Orange wash for highlight backgrounds, decorative bands, and soft emphasis behind content. |
| Electric Yellow | `#f6f361` | `--color-electric-yellow` | Secondary accent for borders, highlights, and decorative geometric elements — neon-charged against black to create energy |

## Tokens — Typography

### ABC Normal — Workhorse sans for body, nav, buttons, badges, and even large display sizes. The 300 weight is the signature — lightweight and editorial rather than the 600+ bold most SaaS sites use for headlines, giving Drop a quiet authority. Letter-spacing tightens aggressively at larger sizes (from -0.005em at 16px to -0.041em at 177px). · `--font-abc-normal`
- **Substitute:** Inter, Söhne, or General Sans
- **Weights:** 300, 400, 500
- **Sizes:** 11, 12, 14, 15, 16, 18, 21, 22, 29, 30, 43, 48, 66, 75, 95, 160, 177
- **Line height:** 0.80–1.35
- **Letter spacing:** -0.0410em, -0.0360em, -0.0330em, -0.0300em, -0.0290em, -0.0270em, -0.0240em, -0.0190em, -0.0170em, -0.0160em, -0.0150em, -0.0140em, -0.0130em, -0.0120em, -0.0050em
- **Role:** Workhorse sans for body, nav, buttons, badges, and even large display sizes. The 300 weight is the signature — lightweight and editorial rather than the 600+ bold most SaaS sites use for headlines, giving Drop a quiet authority. Letter-spacing tightens aggressively at larger sizes (from -0.005em at 16px to -0.041em at 177px).

### Ivar Display — Reserved exclusively for the largest display headings — the 'OLD WORLD' / 'NEW WORLD' editorial moments. A serif with 0.78 line-height and -0.043em tracking at 169px creates slab-like density that reads as printed editorial rather than web type. Weight stays at 400 even at poster scale, trusting the size and serif personality to carry authority. · `--font-ivar-display`
- **Substitute:** Tiempos Headline, Canela, or Playfair Display
- **Weights:** 400
- **Sizes:** 60, 72, 93, 156, 169
- **Line height:** 0.78–1.00
- **Letter spacing:** -0.0430em, -0.0310em, -0.0300em, -0.0120em
- **Role:** Reserved exclusively for the largest display headings — the 'OLD WORLD' / 'NEW WORLD' editorial moments. A serif with 0.78 line-height and -0.043em tracking at 169px creates slab-like density that reads as printed editorial rather than web type. Weight stays at 400 even at poster scale, trusting the size and serif personality to carry authority.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.35 | — | `--text-caption` |
| body-sm | 14px | 1.35 | — | `--text-body-sm` |
| body | 16px | 1.3 | -0.08px | `--text-body` |
| subheading | 18px | 1.2 | -0.36px | `--text-subheading` |
| heading-sm | 22px | 1.15 | -0.66px | `--text-heading-sm` |
| heading | 30px | 1.1 | -0.87px | `--text-heading` |
| heading-lg | 48px | 1 | -1.44px | `--text-heading-lg` |
| display | 75px | 0.9 | -2.48px | `--text-display` |
| display-xl | 177px | 0.8 | -7.26px | `--text-display-xl` |

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
| 32 | 32px | `--spacing-32` |
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |
| 72 | 72px | `--spacing-72` |
| 120 | 120px | `--spacing-120` |
| 144 | 144px | `--spacing-144` |

### Border Radius

| Element | Value |
|---------|-------|
| nav | 9999px |
| cards | 16px |
| badges | 9999px |
| buttons | 9999px |
| small-ui | 4px |
| hero-cards | 36-40px |
| large-cards | 24px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80-120px
- **Card padding:** 14-16px
- **Element gap:** 5-8px

## Components

### Primary Pill Button
**Role:** Filled action button for demos and key conversions

Obsidian (#101010) fill, white text, ABC Normal 16px weight 400, 1440px radius (full pill), 14px vertical × 18px horizontal padding. No shadow. Optional small arrow icon after label in 12-14px. The absence of a chromatic CTA color makes this near-black button the unmistakable action — restrained but commanding.

### Ghost Pill Button
**Role:** Secondary action with no fill

Transparent background, 1px Obsidian border, Obsidian text, 1440px radius, 12-14px vertical × 18px horizontal padding. Used for 'Login' and secondary CTAs in the nav.

### Text Link with Underline
**Role:** Inline and footer navigation links

No background, text color inherits, 1px Obsidian underline with 4-8px offset. The underline is the entire affordance — no color change on hover, just weight or opacity.

### Navigation Bar
**Role:** Top-level site navigation

White background, 1440px (full pill) for the 'Request a Demo' button. Logo left, nav center (Use Cases / Resources / Company with chevron dropdowns), Login + CTA right. ABC Normal 14-16px weight 400 for links, 12-14px for button text. Sits directly on white canvas with no border or shadow.

### Hero Split Card — Black
**Role:** Left-side product showcase card in the hero

Obsidian (#101010) background, large 24-40px border radius (asymmetric — typically 36-40px), contains a centered product mockup with a subtle phone/device frame. The card's darkness creates a visual anchor that balances the lavender card beside it.

### Hero Split Card — Lavender
**Role:** Right-side product showcase card in the hero

Lavender Mist (#b8afda) background, 36-40px radius, contains a dark product mockup floating on the lavender surface. Pairs with the black card to create a 50/50 chromatic tension in the hero.

### Brand Logo Strip
**Role:** Social proof footer of the hero

Row of 8-9 grayscale partner/brand logos on white canvas, ABC Normal weight 400, evenly spaced with no dividers. Logos are monochrome black or near-black, no color treatment.

### Editorial Display Section — Dark
**Role:** Full-bleed dark band for the 'Old World' narrative

Obsidian or Carbon (#1a1a1a) background, full viewport width. Headline uses Ivar Display at 156-169px weight 400, line-height 0.78-0.80, lavender or white fill. The serif at this scale functions as environmental typography — the band IS the message.

### Editorial Display Section — Light
**Role:** Full-bleed light band for the 'New World' narrative

White or very light canvas, Ivar Display headline at 156-169px, but the 'NEW' word is filled in Ember Orange (#eb652b) while 'WORLD' stays black. The color split within a single headline is a signature editorial technique — two colors, one phrase, maximal impact.

### Circle Comparison Diagram
**Role:** Data visualization showing audience/engagement/customer scale

Three circles of decreasing size (Social Audience → Engaged → Customers), filled with Lavender Mist at varying opacity, dark or light outlines, placed on a black or white background. The size delta tells the story without numbers. Labels in ABC Normal 11-14px weight 500, uppercase tracking.

### Revenue Callout
**Role:** Large monetary figure tied to the narrative

ABC Normal 48-66px weight 300 or 400, right-aligned. On dark sections: white text. On light sections: Ember Orange text with a small pill badge above showing the label. The 300-weight at this size is the most dramatic moment in the body type — thin enough to feel editorial, large enough to demand attention.

### Section Pill Badge
**Role:** Inline label or tag for categorizing content

Lavender Mist or Electric Yellow background, Obsidian text, 1440px radius, 8-12px vertical × 14-20px horizontal padding, ABC Normal 11-12px weight 500, uppercase, letter-spacing slightly positive. Functions as a section marker ('THE OLD WORLD' / 'THE NEW WORLD').

### Product Mockup Frame
**Role:** Device or UI screenshot container inside cards

White or dark surface with 16-24px radius, often floating with generous padding inside the parent card. Contains realistic UI screenshots of the product (story replies, customer profiles with circular avatars and percentage callouts).

## Do's and Don'ts

### Do
- Use Ivar Display only at 60px or larger — below that, it loses its editorial power and competes with the sans-serif body
- Use 1440px radius for every button, badge, and tag — the full pill is the most consistent shape in the system
- Reach for Lavender Mist (#b8afda) as the default chromatic surface before any other color — it carries brand identity more than orange or yellow
- Set display headlines to line-height 0.78-0.90 to let the serif slabs sit close together like editorial body type
- Use weight 300 or 400 in ABC Normal for body and even sub-headings — reserve 500 for tags, labels, and nav only
- Place Ember Orange only on revenue figures, the 'new world' headline split, and single-word accents — one orange moment per section maximum
- Keep card padding tight (14-16px) and let the large border-radius and background color do the visual work — no shadows needed

### Don't
- Never use Ivar Display for body text, nav links, or anything below 60px — the serif personality overwhelms at small sizes
- Do not introduce a second chromatic accent color beyond the existing three (lavender, orange, yellow) — the palette is deliberately small
- Do not use box-shadows for elevation — Drop separates surfaces with hard color contrast (white vs black vs lavender), not depth
- Do not set display headlines to line-height above 1.0 — the tight leading is what makes the type feel printed rather than web-rendered
- Do not use sharp corners (0px radius) on any interactive element — even small UI should use at least 4-8px radius
- Do not place orange and yellow adjacent to each other — they vibrate against each other; let white or black separate them
- Do not center-align body text — left-align everything except display headlines and revenue figures

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas | `#ffffff` | Default page background, dominant surface across all light sections |
| 1 | Sage Mist | `#c7d8c5` | Near-gray green surface tint for soft card backgrounds and section washes |
| 2 | Mint Cream | `#e5ede4` | Warmer light tint for accent cards that need separation from pure white |
| 3 | Lavender Mist | `#b8afda` | Chromatic surface for hero cards, diagram fills, and large decorative blocks |
| 4 | Carbon | `#1a1a1a` | Dark surface for product mockup cards and the editorial dark band |
| 5 | Obsidian | `#101010` | Deepest dark surface for full-bleed editorial sections and primary CTA fills |

## Elevation

Drop avoids shadows entirely. Surface separation comes from hard color contrast — white against black against lavender — rather than from any sense of physical depth. The design reads as flat editorial print, not skeuomorphic UI. This is a deliberate choice: shadows would soften the bold typographic impact and undermine the magazine-spread metaphor.

## Imagery

Product mockups dominate the visual language: phone-shaped device frames containing realistic UI screenshots of the Drop product (story reply interfaces, customer profile cards with circular avatars, engagement metrics). Mockups are always contained within cards, never full-bleed, and float on contrasting surfaces (dark cards on lavender, light cards on dark). No lifestyle photography, no abstract illustrations, no decorative graphics beyond the circle comparison diagram. Brand logos appear as flat monochrome wordmarks. The visual language is restrained — typography and color do the work that stock photography would in a more conventional SaaS site.

## Layout

Full-width sections that alternate between near-white canvas and a black editorial band, each section breaking at viewport edges with no max-width container. The hero uses a two-column split: bold serif-style sans headline left (half width) with a supporting paragraph and CTA, paired with a 50/50 split of two large cards (black + lavender) below spanning the full content width. Sections are anchored by oversized serif display headlines at 156-169px that function as environmental typography, with the narrative content (circles diagram, revenue figures) sitting beneath. The overall rhythm is dramatic: quiet light sections punctuated by one or two high-contrast dark editorial bands, each carrying a massive headline. Navigation is a minimal top bar with no sticky behavior, and the page never uses a sidebar.

## Agent Prompt Guide

## Quick Color Reference
- Text: #101010
- Background: #ffffff
- Border: #101010
- Accent: #b8afda (Lavender Mist)
- Punctuation: #eb652b (Ember Orange)
- Highlight: #f6f361 (Electric Yellow)
- primary action: no distinct CTA color

## Example Component Prompts

No distinct primary action color was observed; use the extracted neutral button treatments instead of inventing a filled CTA color.

2. **Create a section pill badge**: 1440px radius, #b8afda background, #101010 text, ABC Normal 12px weight 500 uppercase, 8px vertical × 16px horizontal padding. Label: 'THE NEW WORLD'.

3. **Create an editorial display headline**: Ivar Display 169px weight 400, line-height 0.80, letter-spacing -0.043em. First word in #eb652b, remaining words in #101010. Text: 'the NEW WORLD'.

4. **Create a hero split card pair**: Two cards side by side, each 50% width with 36-40px border radius. Left card: #101010 background with a white product mockup centered inside. Right card: #b8afda background with a dark product mockup centered inside. No shadows.

5. **Create a revenue callout block**: ABC Normal 66px weight 300, #eb652b color, right-aligned. Above it, a pill badge: 1440px radius, #f6f361 background, #101010 text, 12px weight 500. Text: 'REVENUE'.

## Similar Brands

- **Linear** — Same editorial-grade typography with oversized display headlines and tight letter-spacing, pill-shaped buttons, and a near-monochrome palette punctuated by one chromatic accent
- **Arc browser** — Shared pastel-meets-bold contrast with large serif or slab display type, flat surfaces with no shadows, and full-pill buttons as the dominant shape
- **Pitch** — Same magazine-spread approach to product marketing: confident serif display, restrained chromatic palette, and dramatic dark/light section alternation
- **Vercel** — Similar restraint in body type (clean sans, weight 400 default) and reliance on massive typographic moments rather than illustration or photography
- **Attio** — Shared editorial confidence: large display type, soft pastel accents against monochrome, and pill-shaped components as a recurring motif

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-obsidian: #101010;
  --color-pure-white: #ffffff;
  --color-carbon: #1a1a1a;
  --color-mint-cream: #e5ede4;
  --color-sage-mist: #c7d8c5;
  --color-ash-gray: #9b9b9b;
  --color-lavender-mist: #b8afda;
  --color-ember-orange: #eb652b;
  --color-electric-yellow: #f6f361;

  /* Typography — Font Families */
  --font-abc-normal: 'ABC Normal', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-ivar-display: 'Ivar Display', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.35;
  --text-body-sm: 14px;
  --leading-body-sm: 1.35;
  --text-body: 16px;
  --leading-body: 1.3;
  --tracking-body: -0.08px;
  --text-subheading: 18px;
  --leading-subheading: 1.2;
  --tracking-subheading: -0.36px;
  --text-heading-sm: 22px;
  --leading-heading-sm: 1.15;
  --tracking-heading-sm: -0.66px;
  --text-heading: 30px;
  --leading-heading: 1.1;
  --tracking-heading: -0.87px;
  --text-heading-lg: 48px;
  --leading-heading-lg: 1;
  --tracking-heading-lg: -1.44px;
  --text-display: 75px;
  --leading-display: 0.9;
  --tracking-display: -2.48px;
  --text-display-xl: 177px;
  --leading-display-xl: 0.8;
  --tracking-display-xl: -7.26px;

  /* Typography — Weights */
  --font-weight-light: 300;
  --font-weight-regular: 400;
  --font-weight-medium: 500;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-72: 72px;
  --spacing-120: 120px;
  --spacing-144: 144px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80-120px;
  --card-padding: 14-16px;
  --element-gap: 5-8px;

  /* Border Radius */
  --radius-md: 4.32px;
  --radius-lg: 7.92px;
  --radius-2xl: 16.02px;
  --radius-3xl: 24.48px;
  --radius-3xl-2: 31.68px;
  --radius-3xl-3: 36px;
  --radius-3xl-4: 40.32px;
  --radius-full: 1440px;

  /* Named Radii */
  --radius-nav: 9999px;
  --radius-cards: 16px;
  --radius-badges: 9999px;
  --radius-buttons: 9999px;
  --radius-small-ui: 4px;
  --radius-hero-cards: 36-40px;
  --radius-large-cards: 24px;

  /* Surfaces */
  --surface-canvas: #ffffff;
  --surface-sage-mist: #c7d8c5;
  --surface-mint-cream: #e5ede4;
  --surface-lavender-mist: #b8afda;
  --surface-carbon: #1a1a1a;
  --surface-obsidian: #101010;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-obsidian: #101010;
  --color-pure-white: #ffffff;
  --color-carbon: #1a1a1a;
  --color-mint-cream: #e5ede4;
  --color-sage-mist: #c7d8c5;
  --color-ash-gray: #9b9b9b;
  --color-lavender-mist: #b8afda;
  --color-ember-orange: #eb652b;
  --color-electric-yellow: #f6f361;

  /* Typography */
  --font-abc-normal: 'ABC Normal', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-ivar-display: 'Ivar Display', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.35;
  --text-body-sm: 14px;
  --leading-body-sm: 1.35;
  --text-body: 16px;
  --leading-body: 1.3;
  --tracking-body: -0.08px;
  --text-subheading: 18px;
  --leading-subheading: 1.2;
  --tracking-subheading: -0.36px;
  --text-heading-sm: 22px;
  --leading-heading-sm: 1.15;
  --tracking-heading-sm: -0.66px;
  --text-heading: 30px;
  --leading-heading: 1.1;
  --tracking-heading: -0.87px;
  --text-heading-lg: 48px;
  --leading-heading-lg: 1;
  --tracking-heading-lg: -1.44px;
  --text-display: 75px;
  --leading-display: 0.9;
  --tracking-display: -2.48px;
  --text-display-xl: 177px;
  --leading-display-xl: 0.8;
  --tracking-display-xl: -7.26px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-72: 72px;
  --spacing-120: 120px;
  --spacing-144: 144px;

  /* Border Radius */
  --radius-md: 4.32px;
  --radius-lg: 7.92px;
  --radius-2xl: 16.02px;
  --radius-3xl: 24.48px;
  --radius-3xl-2: 31.68px;
  --radius-3xl-3: 36px;
  --radius-3xl-4: 40.32px;
  --radius-full: 1440px;
}
```
