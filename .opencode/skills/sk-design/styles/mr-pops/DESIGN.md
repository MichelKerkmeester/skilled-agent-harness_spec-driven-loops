# Mr. Pops — Style Reference
> retro ice cream parlor on cream paper. A bright white shopfront with cherry-red trim, stacked marquee letters, and warm cream cards beneath full-bleed food photography.

**Theme:** light

Mr. Pops reads like a sunlit ice cream parlor printed on cream cardstock: warm white canvas, massive condensed display type set tight over full-bleed lifestyle photography, and a single cherry-red used almost exclusively as outline and stroke. The dominant gesture is bold — Cervo display hits 144px with 0.75 line-height and 0.05em positive tracking, stacked four lines deep — but the chrome stays airy: thin red borders, pill buttons, 40px corners, and cream-tinted secondary surfaces instead of gray. Neutrals (black, white, warm cream) carry the structure while the red punctuates. Components should feel like a hand-stamped menu card: generous whitespace, confident borders, no drop shadows, and photography that bleeds to the edge of the screen.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Cherry Marquee | `#b00e2f` | `--color-cherry-marquee` | Brand accent, heading text, link color, icon stroke, outlined button border, footer headline — vivid warm red used as the single chromatic signal across an otherwise cream-and-white interface |
| Cream Bisque | `#fee5ca` | `--color-cream-bisque` | Secondary surface for cards, callout panels, and the cart/bag detail button — warm near-white that reads as paper, not gray |
| Canvas White | `#ffffff` | `--color-canvas-white` | Page background, card surface, input fill, button text on dark |
| Ink Black | `#000000` | `--color-ink-black` | Primary body text, icon fills, heavy borders, SVG fill — the only true dark |
| Slate Mid | `#aaaaaa` | `--color-slate-mid` | Muted secondary text, disabled placeholders, low-emphasis dividers |

## Tokens — Typography

### Cervo — Display and headings only. Set extremely tight (line-height 0.75 on the 144px hero, 0.9 on 64-72px) and tracked slightly outward at 0.05em — the condensed letterforms and compressed leading make the headline read as a hand-painted sign rather than a web type block. Weight 400 carries the body, weight 500 amplifies emphasis within the display. · `--font-cervo`
- **Substitute:** Oswald, Bebas Neue, Antonio
- **Weights:** 400, 500
- **Sizes:** 16px, 18px, 22px, 42px, 64px, 72px, 144px
- **Line height:** 0.75, 0.90, 1.00
- **Letter spacing:** 0.05em at all sizes
- **Role:** Display and headings only. Set extremely tight (line-height 0.75 on the 144px hero, 0.9 on 64-72px) and tracked slightly outward at 0.05em — the condensed letterforms and compressed leading make the headline read as a hand-painted sign rather than a web type block. Weight 400 carries the body, weight 500 amplifies emphasis within the display.

### HelveticaNeueCyr — Body, UI, navigation, footer, input, captions. Light 400 weight throughout with generous 1.3-1.4 leading on running text — the whisper-weight keeps chrome from competing with the Cervo display, so the marquee headline always wins the eye. · `--font-helveticaneuecyr`
- **Substitute:** Helvetica Neue, Inter, Arial
- **Weights:** 400
- **Sizes:** 12px, 15px, 16px, 18px
- **Line height:** 1.15, 1.20, 1.30, 1.40
- **Role:** Body, UI, navigation, footer, input, captions. Light 400 weight throughout with generous 1.3-1.4 leading on running text — the whisper-weight keeps chrome from competing with the Cervo display, so the marquee headline always wins the eye.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.4 | — | `--text-caption` |
| body-sm | 15px | 1.3 | — | `--text-body-sm` |
| subheading | 18px | 1.3 | — | `--text-subheading` |
| heading-sm | 22px | 1.2 | — | `--text-heading-sm` |
| heading | 42px | 1 | 0.05px | `--text-heading` |
| heading-lg | 64px | 0.9 | 0.05px | `--text-heading-lg` |
| display | 144px | 0.75 | 0.05px | `--text-display` |

## Tokens — Spacing & Shapes

**Density:** spacious

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 5 | 5px | `--spacing-5` |
| 6 | 6px | `--spacing-6` |
| 8 | 8px | `--spacing-8` |
| 9 | 9px | `--spacing-9` |
| 10 | 10px | `--spacing-10` |
| 12 | 12px | `--spacing-12` |
| 14 | 14px | `--spacing-14` |
| 16 | 16px | `--spacing-16` |
| 20 | 20px | `--spacing-20` |
| 30 | 30px | `--spacing-30` |
| 36 | 36px | `--spacing-36` |
| 38 | 38px | `--spacing-38` |
| 40 | 40px | `--spacing-40` |
| 46 | 46px | `--spacing-46` |
| 58 | 58px | `--spacing-58` |
| 60 | 60px | `--spacing-60` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 40px |
| buttons | 300px |
| smallElements | 5px |
| featuredPanels | 60px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 40px
- **Card padding:** 30px
- **Element gap:** 10px

## Components

### Marquee Display Headline
**Role:** Hero and section title

Cervo weight 400, 144px on hero / 64-72px on sections, line-height 0.75-0.9, letter-spacing 0.05em, color Ink Black with selective words recolored Cherry Marquee. Sits as four stacked uppercase lines over a full-bleed photograph.

### Cherry Outline Button
**Role:** Primary call to action

1-2px solid Cherry Marquee border, transparent fill, Cherry Marquee text, 300px (pill) radius, 16-20px horizontal padding, Cervo or HelveticaNeueCyr at 16px. The signature button — red outline, white interior, never a filled red block.

### Cream Filled Button
**Role:** Secondary call to action (cart, bag, less prominent action)

Cream Bisque (#fee5ca) background, no border or 1px Ink Black, Ink Black text, 300px radius, 30px horizontal padding. Used for the shopping bag indicator and supporting actions that should feel warm rather than urgent.

### Ghost Navigation Item
**Role:** Top nav links (Flavours, Menu)

Text-only or 1px Ink Black border with rounded 300px radius, HelveticaNeueCyr 15-16px, black text. Sits in a row at the top-right of the screen with generous 30px horizontal gap between items.

### Cream Bisque Card
**Role:** Featured product, flavor panel, content block

Cream Bisque background, 40px corner radius, 30px padding, no border. Lifts warm content from the white canvas without using shadow. Sits inside a section with generous vertical breathing room.

### Hero Photograph Frame
**Role:** Full-bleed lifestyle / food photography

Edge-to-edge image with no padding. Text overlays sit directly on the photo using a high-contrast black or white headline. No gradient scrim, no dark overlay — the photo and type share the same z-plane.

### Inline Red Label
**Role:** Section link or 'FLAVOURS' style trigger

Cherry Marquee text in Cervo or HelveticaNeueCyr uppercase, often paired with a thin circle outline and small caret/arrow icon. Reads as a stamped label, not a button.

### Paragraph Block
**Role:** Long-form body copy beside the hero

HelveticaNeueCyr 16px weight 400, line-height 1.3-1.4, Ink Black, max-width roughly 400-500px so it sits as a narrow column next to the headline.

### Cart Badge
**Role:** Top-right shopping bag count

Small 1px Ink Black border square or rounded container with the count digit inside, positioned inline with the nav row.

### Scroll Cue Arrow
**Role:** Down-arrow prompt at the bottom of the hero

Thin Ink Black line forming a downward chevron or arrow with a vertical stem, positioned in the bottom-right of the hero. Decorative gesture, not an interactive element.

### Footer Band
**Role:** Site footer

Cervo or HelveticaNeueCyr at 16-18px, Ink Black text, Cherry Marquee accent for links and headings. No background tint — sits on canvas white with 36-40px top padding.

## Do's and Don'ts

### Do
- Stack Cervo display type four lines deep and let line-height collapse to 0.75 on the 144px hero size.
- Use Cherry Marquee (#b00e2f) as outline, link, and accent text — never as a filled button background.
- Set 0.05em positive letter-spacing on every Cervo size from 22px upward.
- Build every interactive element with a 300px (pill) radius.
- Lift secondary content with Cream Bisque (#fee5ca) fills at 40px radius, not with shadows.
- Let hero photography bleed edge-to-edge with text overlaid directly on the image — no scrim.
- Keep body copy in HelveticaNeueCyr weight 400 at 15-16px with 1.3-1.4 line-height so the display type stays the loudest thing on the page.

### Don't
- Don't fill a button solid Cherry Marquee — the brand signal is the red outline, not a red block.
- Don't apply drop shadows to cards, buttons, or panels — depth comes from cream surfaces, not elevation stacks.
- Don't set Cervo with line-height above 1.0 on display sizes; the compressed leading is the signature.
- Don't introduce gray or cool neutrals — every neutral should be warm (cream, white) or pure black.
- Don't use a second chromatic accent — Cherry Marquee is the only color allowed beyond the cream/black/white system.
- Don't switch the canvas to dark or use a dark-mode pattern — the brand is locked to a sunlit light theme.
- Don't set negative letter-spacing on Cervo — the 0.05em outward tracking is what makes the marquee read as signage.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Page Canvas | `#ffffff` | Default page background, all structural sections |
| 1 | Cream Card | `#fee5ca` | Featured panels, secondary callouts, warm-toned surface lift |

## Elevation

The system avoids drop shadows entirely. Depth is created by warm cream surfaces, thick 1-2px colored borders, and the photographic bleed behind text — never by stacked shadow layers. If a component needs to feel elevated, give it a cream-tinted surface, not a shadow.

## Imagery

Full-bleed lifestyle and food photography is the primary visual. Images fill the viewport edge-to-edge with no padding, no rounded corners, no gradient overlay — the photograph and the display type share the same plane. Subjects are hands holding ice cream bars, lips, and scoops, shot warm and close, cropped tight. The treatment is editorial and tactile rather than product-on-white: the object is held by a person, not staged on a surface. There are no illustrations, no abstract graphics, no 3D renders. Icons are minimal — thin outlines or 1px ink strokes that match the button-outline system. Imagery is image-heavy at the hero and text-dominant in supporting sections, so each section alternates between a photograph-first block and a copy-first block.

## Layout

The page is full-bleed at the hero (photograph fills the viewport, headline overlays top-left) and max-width 1200px centered for body sections. The hero uses an asymmetric composition: a massive stacked headline anchored to the left, a narrow paragraph column to the right of the headline, and a 'FLAVOURS' inline trigger tucked between them. Navigation is a minimal top bar with logo top-left and three items (cart, Flavours, Menu) pushed to the top-right, separated by 30px gaps. Below the hero, sections alternate between cream Bisque cards on a white canvas and white sections with red-outlined interactive elements, with 36-40px vertical breathing room between bands. Content arrangement is asymmetric — text-left/image-right is the dominant pattern, with cards and flavor blocks arranged in a single full-width column rather than multi-column grids. The overall density is spacious: every element has air around it, and the design uses the white canvas as a structural material, not just a background.

## Agent Prompt Guide

**Quick Color Reference**
- text: #000000 (Ink Black)
- background: #ffffff (Canvas White)
- border: #b00e2f (Cherry Marquee) for accent outlines; #000000 for neutral borders
- accent: #b00e2f (Cherry Marquee) for headings, links, icons, outlines
- surface: #fee5ca (Cream Bisque) for secondary cards and the cream button
- primary action: #b00e2f (filled action)

**Example Component Prompts**
1. Build a hero section: edge-to-edge photograph fills the viewport. Cervo weight 400 at 144px, line-height 0.75, letter-spacing 0.05em, uppercase, color #000000, stacked in four lines top-left. One word in the third line recolored #b00e2f. A paragraph of 16px HelveticaNeueCyr weight 400 in #000000 sits in a ~440px column to the right of the headline.
2. Build a Cherry Marquee outline button: 1px solid #b00e2f border, transparent fill, #b00e2f text, 300px border-radius, 16px HelveticaNeueCyr, 30px horizontal padding, 10px vertical padding.
3. Build a Cream Bisque secondary button: #fee5ca background, no border, #000000 text, 300px border-radius, 16px HelveticaNeueCyr, 30px horizontal padding.
4. Build a Cream Bisque content card: #fee5ca background, 40px border-radius, 30px padding, 22px Cervo weight 400 heading in #000000 with 0.05em tracking, 16px HelveticaNeueCyr body text below in #000000.
5. Build the top navigation: logo top-left in #b00e2f, three items (cart, 'Flavours', 'Menu') top-right, 1px #000000 borders on the two text links, 300px radius, 15px HelveticaNeueCyr, 30px gap between items.

## Similar Brands

- **Magnum** — Same warm cream-and-red palette, lifestyle food photography cropped tight, and confidence with a single bold accent color across an otherwise neutral interface
- **Häagen-Dazs** — Edge-to-edge food photography with serif/display type overlaid, cream surface cards, and an editorial rather than e-commerce-density page rhythm
- **Salt & Straw** — Warm cream backgrounds, single chromatic accent, display type that plays off photography, and a parlor-brand voice that favors personality over UI density
- **Jeni's Splendid Ice Creams** — Bold condensed display type over lifestyle imagery, pill-shaped buttons with outlined treatment, and a hand-stamped menu-card feeling rather than a typical storefront grid

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-cherry-marquee: #b00e2f;
  --color-cream-bisque: #fee5ca;
  --color-canvas-white: #ffffff;
  --color-ink-black: #000000;
  --color-slate-mid: #aaaaaa;

  /* Typography — Font Families */
  --font-cervo: 'Cervo', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-helveticaneuecyr: 'HelveticaNeueCyr', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.4;
  --text-body-sm: 15px;
  --leading-body-sm: 1.3;
  --text-subheading: 18px;
  --leading-subheading: 1.3;
  --text-heading-sm: 22px;
  --leading-heading-sm: 1.2;
  --text-heading: 42px;
  --leading-heading: 1;
  --tracking-heading: 0.05px;
  --text-heading-lg: 64px;
  --leading-heading-lg: 0.9;
  --tracking-heading-lg: 0.05px;
  --text-display: 144px;
  --leading-display: 0.75;
  --tracking-display: 0.05px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;

  /* Spacing */
  --spacing-5: 5px;
  --spacing-6: 6px;
  --spacing-8: 8px;
  --spacing-9: 9px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-14: 14px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-30: 30px;
  --spacing-36: 36px;
  --spacing-38: 38px;
  --spacing-40: 40px;
  --spacing-46: 46px;
  --spacing-58: 58px;
  --spacing-60: 60px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 40px;
  --card-padding: 30px;
  --element-gap: 10px;

  /* Border Radius */
  --radius-md: 5px;
  --radius-3xl: 40px;
  --radius-full: 60px;
  --radius-full-2: 300px;

  /* Named Radii */
  --radius-cards: 40px;
  --radius-buttons: 300px;
  --radius-smallelements: 5px;
  --radius-featuredpanels: 60px;

  /* Surfaces */
  --surface-page-canvas: #ffffff;
  --surface-cream-card: #fee5ca;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-cherry-marquee: #b00e2f;
  --color-cream-bisque: #fee5ca;
  --color-canvas-white: #ffffff;
  --color-ink-black: #000000;
  --color-slate-mid: #aaaaaa;

  /* Typography */
  --font-cervo: 'Cervo', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-helveticaneuecyr: 'HelveticaNeueCyr', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.4;
  --text-body-sm: 15px;
  --leading-body-sm: 1.3;
  --text-subheading: 18px;
  --leading-subheading: 1.3;
  --text-heading-sm: 22px;
  --leading-heading-sm: 1.2;
  --text-heading: 42px;
  --leading-heading: 1;
  --tracking-heading: 0.05px;
  --text-heading-lg: 64px;
  --leading-heading-lg: 0.9;
  --tracking-heading-lg: 0.05px;
  --text-display: 144px;
  --leading-display: 0.75;
  --tracking-display: 0.05px;

  /* Spacing */
  --spacing-5: 5px;
  --spacing-6: 6px;
  --spacing-8: 8px;
  --spacing-9: 9px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-14: 14px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-30: 30px;
  --spacing-36: 36px;
  --spacing-38: 38px;
  --spacing-40: 40px;
  --spacing-46: 46px;
  --spacing-58: 58px;
  --spacing-60: 60px;

  /* Border Radius */
  --radius-md: 5px;
  --radius-3xl: 40px;
  --radius-full: 60px;
  --radius-full-2: 300px;
}
```
