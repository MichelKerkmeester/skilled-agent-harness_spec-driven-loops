# Stryds — Style Reference
> Aurora ringed midnight void

**Theme:** dark

Stryds is a poster-scale health manifesto: a near-black void ringed by a segmented spectrum gradient, with display typography that pushes past 100px to feel like a billboard, not a dashboard. The entire palette is monochrome — one canvas tone, one text tone, one border tone — broken only by Electric Lime, the single chromatic voice that makes CTAs and active states feel switched on. A massive circular gradient frame is the signature visual gesture, reappearing around hero text and content blocks like a health aura. Components are minimal and pill-shaped; the design has almost no elevation, no photography, and no illustration beyond the spectrum ring itself and a floating avatar. The result is an editorial, late-night broadcast feel: bold, confrontational, and deeply opinionated about digital wellness.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Electric Lime | `#a6ff00` | `--color-electric-lime` | Green action color for filled buttons, selected navigation states, and focused conversion moments. |
| Deep Violet | `#040126` | `--color-deep-violet` | Outlined action borders, subtle decorative borders — a near-black indigo that adds tonal depth to dark borders without breaking the monochrome canvas |
| Obsidian | `#101010` | `--color-obsidian` | Page canvas, outermost background, shadow tokens — the base void that every surface floats on |
| Carbon | `#171717` | `--color-carbon` | Card surfaces, elevated content panels — the only step above Obsidian in the surface stack |
| Slate | `#333333` | `--color-slate` | Hairline borders, card borders, subtle dividers — the structural border color, used more than any other in the system |
| Steel | `#3d3d3d` | `--color-steel` | Strokes, secondary card borders — a half-step lighter than Slate for layering borders on borders |
| Fog | `#6f6f6f` | `--color-fog` | Dark borders and separators for elevated surfaces and inverted UI. |
| Paper | `#fdfdfd` | `--color-paper` | Primary text, heading borders, illustration highlights — the only text color that reads as active |
| Void | `#000000` | `--color-void` | SVG fills, spectrum ring backing — pure black for graphic elements where absolute darkness is needed |

## Tokens — Typography

### SF Pro Display — Display and heading typography — the choice of SF Pro Display signals a premium, iOS-adjacent system voice. Weights 500-600 (never 700+) keep headings from feeling heavy; the brand's authority comes from size, not weight. Display sizes escalate to 184px, creating poster-scale type that dominates every section. Line-height tightens to 0.95 at the largest sizes, making individual letters feel monumental and architectural. · `--font-sf-pro-display`
- **Substitute:** Inter, system-ui, -apple-system
- **Weights:** 500, 600
- **Sizes:** 16, 21, 36, 44, 78, 109, 148, 184
- **Line height:** 0.95, 1.00, 1.10, 1.20, 1.25
- **Letter spacing:** -0.007em, -0.01em, -0.012em, -0.023em, -0.026em, -0.027em, -0.034em
- **Role:** Display and heading typography — the choice of SF Pro Display signals a premium, iOS-adjacent system voice. Weights 500-600 (never 700+) keep headings from feeling heavy; the brand's authority comes from size, not weight. Display sizes escalate to 184px, creating poster-scale type that dominates every section. Line-height tightens to 0.95 at the largest sizes, making individual letters feel monumental and architectural.

### Arial — Body, links, card text, button labels — deliberately a system fallback so it stays invisible. While SF Pro Display headlines shout at 184px, Arial whispers at 14px in the background. This split (premium display + neutral body) is a deliberate hierarchy choice: the display type does all the emotional work, the body text just delivers information. · `--font-arial`
- **Substitute:** system-ui, -apple-system, Helvetica Neue, sans-serif
- **Weights:** 400, 500
- **Sizes:** 14
- **Line height:** 1.43
- **Letter spacing:** -0.034em
- **Role:** Body, links, card text, button labels — deliberately a system fallback so it stays invisible. While SF Pro Display headlines shout at 184px, Arial whispers at 14px in the background. This split (premium display + neutral body) is a deliberate hierarchy choice: the display type does all the emotional work, the body text just delivers information.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 14px | 1.43 | -0.48px | `--text-caption` |
| body | 16px | 1.25 | 0.43px | `--text-body` |
| subheading | 21px | 1.25 | -0.15px | `--text-subheading` |
| heading-sm | 36px | 1.2 | -0.36px | `--text-heading-sm` |
| heading | 44px | 1.1 | -0.53px | `--text-heading` |
| heading-lg | 78px | 1 | -1.79px | `--text-heading-lg` |
| display | 109px | 1 | -2.83px | `--text-display` |
| display-lg | 148px | 1 | -4px | `--text-display-lg` |
| display-xl | 184px | 0.95 | -6.26px | `--text-display-xl` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 16 | 16px | `--spacing-16` |
| 20 | 20px | `--spacing-20` |
| 32 | 32px | `--spacing-32` |
| 80 | 80px | `--spacing-80` |
| 108 | 108px | `--spacing-108` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 40px |
| buttons | 100px |

### Layout

- **Section gap:** 80px
- **Card padding:** 80px
- **Element gap:** 16px

## Components

### Spectrum Ring Frame
**Role:** Signature visual frame — the defining element of the brand

A massive circular gradient ring that frames hero content. Built as a conic or radial gradient with color stops transitioning through green, teal, blue, purple, pink, and orange, with intentional gaps/breaks in the gradient creating a segmented, almost dashed appearance. The ring fills the viewport in hero contexts. The gradient is the only multicolor element in the entire system — every other component is monochrome. Stroke width is thick (appears ~20-30px), and the ring is set on a pure black (#000000) fill.

### Display Wordmark
**Role:** Brand name display in hero contexts

"Stryds" set at 148-184px in SF Pro Display weight 600, color #fdfdfd, letter-spacing -4 to -6.26px, line-height 0.95-1.0. Centered in the void inside the spectrum ring. The tight tracking and near-1.0 line-height make individual letters feel architectural and monumental rather than decorative.

### Manifesto Statement
**Role:** Large editorial statement block

Full-sentence copy like "Social apps are toxic" set at 109px in SF Pro Display weight 500, centered. The key word is in #fdfdfd (active), surrounding words in #6f6f6f (Fog, muted) — creating emphasis without color. Letter-spacing -2.83px, line-height 1.0. This is the brand's editorial voice made visual.

### Primary CTA Button (Filled)
**Role:** Main action button

100px border-radius (full pill), background #a6ff00 Electric Lime, text #101010 Obsidian at 14px Arial weight 500, padding 20px horizontal / 13px vertical. Often paired with a small icon (heart, sparkle) to the left of the label. No border, no shadow — the color contrast against the dark canvas provides all the visual weight needed.

### Secondary Outlined Button
**Role:** Secondary action or navigation

100px border-radius (full pill), transparent background, 1px border in #040126 Deep Violet, text in #040126 at 14px Arial weight 500, padding 20px horizontal / 13px vertical. The near-black border is visible only because it sits on the near-black canvas — it whispers rather than shouts, appropriate for less important actions.

### Floating Join Bar
**Role:** Persistent bottom CTA

A pill-shaped composite control floating at the bottom of hero sections. Contains a small brand icon + "Stryds" label in #fdfdfd, followed by a nested "Join" button in #a6ff00. The bar itself has no background — it floats on the canvas as a pure type + button composition. 100px border-radius on the inner CTA, no border on the outer label group.

### Feature Card
**Role:** Content block for features, stats, or sections

Background #171717 Carbon, 40px border-radius, 80px padding on all sides, 1px border in #333333 Slate. Content inside is left-aligned or centered, with heading at 44px SF Pro Display weight 600 in #fdfdfd and body text at 16px in #6f6f6f. The generous 80px padding is the signature — cards breathe heavily rather than packing information densely.

### User Avatar Badge
**Role:** Profile indicator floating from the spectrum ring

Small circular photo avatar (~60-80px diameter) positioned at the top of the spectrum ring, partially overlapping or peeking through the ring's edge. Full circle crop, no border, no shadow. The avatar's organic photographic content is the only real-world imagery in the system.

### Brand Subtitle
**Role:** Tagline or descriptor below display wordmark

"The Social Health App" or similar descriptive text set at 21px SF Pro Display weight 500, color #6f6f6f Fog, letter-spacing -0.15px, line-height 1.25. Centered below the display wordmark, providing context at a comfortable reading size while staying quiet enough to let the display type dominate.

### Hairline Divider
**Role:** Section separator

1px line in #333333 Slate or #3d3d3d Steel, full-width or constrained to content width. No padding, no label — pure visual separation between content blocks.

## Do's and Don'ts

### Do
- Use the spectrum ring as the primary visual frame for hero sections and large display statements — it is the brand's signature gesture
- Set display type between 78-184px in SF Pro Display weight 500-600; this is a poster-scale brand, not a SaaS dashboard
- Use #a6ff00 Electric Lime exclusively for CTA fills, active states, and accent dots — it is the only chromatic color and must stay rare
- Set all buttons to 100px border-radius (pill shape) and all cards to 40px border-radius — the system has no sharp corners or small radii
- Keep the canvas at #101010 Obsidian and cards at #171717 Carbon; use 1px #333333 borders, not shadows, to separate surfaces
- Pair display headlines with #fdfdfd active words and #6f6f6f Fog muted words to create emphasis without introducing color
- Maintain 80px section gaps and 80px card padding — the design breathes heavily; dense layouts break the editorial feel

### Don't
- Do not use box-shadows for elevation — Stryds is flat against the void, separated by borders not depth
- Do not introduce additional accent colors beyond Electric Lime; the monochrome discipline is what makes the lime feel urgent
- Do not set body text below 14px or use font-weight below 400; the brand speaks with confidence, not subtlety
- Do not use sharp corners or radii under 16px; every element is either pill-shaped (100px) or softly rounded (40px)
- Do not center content in narrow columns or constrain to a max-width under 1000px; let display type and the ring fill the viewport
- Do not use color to establish text hierarchy — use size, weight, and the #fdfdfd/#6f6f6f contrast pair instead
- Do not add gradients to UI components, buttons, or cards; gradients are reserved exclusively for the spectrum ring system

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 1 | Obsidian | `#101010` | Page canvas — the base void that all content floats on |
| 2 | Carbon | `#171717` | Card surfaces — the single elevation step above canvas, separated by hairline borders rather than shadow |
| 3 | Electric Lime | `#a6ff00` | Accent surface — CTA fills, active states, the only chromatic surface in the system |

## Elevation

Stryds deliberately avoids elevation. Components sit flat against the dark canvas, separated from it by hairline Slate (#333333) borders rather than box-shadows. The single shadow token detected (#101010) is negligible — a whisper of depth, not a lift. Visual hierarchy is built through size, weight, and the spectrum ring, not through stacking surfaces or casting shadows. This is an editorial design language pretending to be a product interface.

## Imagery

Stryds has almost no imagery in the traditional sense — no photography, no illustration, no product screenshots. The visual language is built entirely from the spectrum ring gradient (a segmented circular color wheel with gaps in green, teal, blue, purple, pink, and orange), massive typography, and a single small circular user avatar that peeks from the top of the ring. The ring itself functions as imagery: a decorative atmosphere element that frames content like a health aura. The only photographic content is the avatar — a candid portrait crop, not staged or lifestyle. The overall density is text-dominant and graphic-dominant; the spectrum ring and the 184px display type together occupy nearly all visual space.

## Layout

Full-bleed dark canvas with no max-width constraint. The hero pattern is a viewport-filling spectrum ring with centered display wordmark inside, subtitle below, and a floating pill CTA at the bottom. The page reads as a vertical scroll of editorial statements, each section either ring-framed or full-bleed dark. Content is centered, not left-aligned. Vertical rhythm is generous: 80-108px gaps between sections, 80px internal card padding. Navigation is minimal — likely a top-center logo or a floating pill. The layout is not a grid system; it's a sequence of poster-like moments, each breathing heavily before the next.

## Agent Prompt Guide

## Quick Color Reference
- background: #101010
- surface: #171717
- border: #333333
- text: #fdfdfd
- muted text: #6f6f6f
- primary action: #a6ff00 (filled action)

## Example Component Prompts

**1. Hero with Spectrum Ring**
Create a full-bleed hero section: #101010 canvas. A large circular gradient ring (conic-gradient through #a6ff00, teal, blue, purple, pink, orange, with intentional gaps) fills 80% of the viewport. Centered inside the ring: "Stryds" at 184px SF Pro Display weight 600, #fdfdfd, letter-spacing -6.26px, line-height 0.95. Below: "The Social Health App" at 21px SF Pro Display weight 500, #6f6f6f. At the bottom of the ring, a floating pill: 100px radius, #a6ff00 background, "Join" label at 14px Arial weight 500 in #101010, 20px horizontal padding.

**2. Manifesto Statement**
Create a statement section: #101010 background, vertically centered. Text "Social apps are toxic." at 109px SF Pro Display weight 500, centered. The word "toxic" in #fdfdfd, "Social apps are" in #6f6f6f. Letter-spacing -2.83px, line-height 1.0. 80px vertical padding above and below.

**3. Feature Card**
Create a feature card: #171717 background, 40px border-radius, 80px padding, 1px #333333 border. Heading at 44px SF Pro Display weight 600, #fdfdfd. Body text at 16px Arial weight 400, #6f6f6f, line-height 1.25. No shadow, no gradient.

**4. Secondary Outlined Button**
Create an outlined button: transparent background, 1px #040126 border, 100px border-radius, 20px horizontal padding / 13px vertical padding. Label at 14px Arial weight 500 in #040126. No shadow, no fill on hover.

## Spectrum Ring System

The spectrum ring is a conic gradient with color stops transitioning through the visible spectrum: Electric Lime (#a6ff00) → teal → blue → purple → pink → orange → back to lime. The gradient has intentional gaps (the ring appears broken/segmented, not continuous), creating a sense of motion and incompleteness. Stroke width is thick (~20-30px) relative to the ring diameter. The ring sits on a pure black (#000000) fill, so the gaps in the gradient reveal the black canvas behind it. At hero scale, the ring fills 70-90% of the viewport width. At section scale, it shrinks to frame individual content blocks. The ring is the only element allowed to be multicolor; every other component is strictly monochrome.

## Similar Brands

- **Whoop** — Same dark-canvas, single-neon-accent health-tech language — Whoop's red accent against near-black mirrors Stryds' Electric Lime against Obsidian
- **Calm** — Identical editorial-poster approach: dark background, minimal UI, single chromatic accent, large confident display type that treats the page as a broadcast rather than a product
- **Strava** — Both use bold display typography and dark mode to convey athletic intensity; the monospace-meets-poster scale type treatment is comparable
- **Apple Vision Pro** — Shares the SF Pro Display at massive sizes, the near-black canvas, and the circular gradient/spectrum visual motifs that frame content like a viewport

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-electric-lime: #a6ff00;
  --color-deep-violet: #040126;
  --color-obsidian: #101010;
  --color-carbon: #171717;
  --color-slate: #333333;
  --color-steel: #3d3d3d;
  --color-fog: #6f6f6f;
  --color-paper: #fdfdfd;
  --color-void: #000000;

  /* Typography — Font Families */
  --font-sf-pro-display: 'SF Pro Display', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-arial: 'Arial', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.43;
  --tracking-caption: -0.48px;
  --text-body: 16px;
  --leading-body: 1.25;
  --tracking-body: 0.43px;
  --text-subheading: 21px;
  --leading-subheading: 1.25;
  --tracking-subheading: -0.15px;
  --text-heading-sm: 36px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: -0.36px;
  --text-heading: 44px;
  --leading-heading: 1.1;
  --tracking-heading: -0.53px;
  --text-heading-lg: 78px;
  --leading-heading-lg: 1;
  --tracking-heading-lg: -1.79px;
  --text-display: 109px;
  --leading-display: 1;
  --tracking-display: -2.83px;
  --text-display-lg: 148px;
  --leading-display-lg: 1;
  --tracking-display-lg: -4px;
  --text-display-xl: 184px;
  --leading-display-xl: 0.95;
  --tracking-display-xl: -6.26px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-32: 32px;
  --spacing-80: 80px;
  --spacing-108: 108px;

  /* Layout */
  --section-gap: 80px;
  --card-padding: 80px;
  --element-gap: 16px;

  /* Border Radius */
  --radius-3xl: 40px;
  --radius-full: 100px;

  /* Named Radii */
  --radius-cards: 40px;
  --radius-buttons: 100px;

  /* Surfaces */
  --surface-obsidian: #101010;
  --surface-carbon: #171717;
  --surface-electric-lime: #a6ff00;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-electric-lime: #a6ff00;
  --color-deep-violet: #040126;
  --color-obsidian: #101010;
  --color-carbon: #171717;
  --color-slate: #333333;
  --color-steel: #3d3d3d;
  --color-fog: #6f6f6f;
  --color-paper: #fdfdfd;
  --color-void: #000000;

  /* Typography */
  --font-sf-pro-display: 'SF Pro Display', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-arial: 'Arial', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 14px;
  --leading-caption: 1.43;
  --tracking-caption: -0.48px;
  --text-body: 16px;
  --leading-body: 1.25;
  --tracking-body: 0.43px;
  --text-subheading: 21px;
  --leading-subheading: 1.25;
  --tracking-subheading: -0.15px;
  --text-heading-sm: 36px;
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: -0.36px;
  --text-heading: 44px;
  --leading-heading: 1.1;
  --tracking-heading: -0.53px;
  --text-heading-lg: 78px;
  --leading-heading-lg: 1;
  --tracking-heading-lg: -1.79px;
  --text-display: 109px;
  --leading-display: 1;
  --tracking-display: -2.83px;
  --text-display-lg: 148px;
  --leading-display-lg: 1;
  --tracking-display-lg: -4px;
  --text-display-xl: 184px;
  --leading-display-xl: 0.95;
  --tracking-display-xl: -6.26px;

  /* Spacing */
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-32: 32px;
  --spacing-80: 80px;
  --spacing-108: 108px;

  /* Border Radius */
  --radius-3xl: 40px;
  --radius-full: 100px;
}
```
