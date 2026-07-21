# GitHub — Style Reference
> cosmic command deck with bioluminescent waypoints — a dark, atmospheric workspace where a single green glow marks the path forward

**Theme:** dark

GitHub operates as a deep-space developer observatory: near-black canvas layered with translucent glass surfaces, bathed in violet radial atmosphere, and punctuated by a single warm-green CTA that reads like a terminal cursor brought into the UI. Mona Sans carries the voice — weight 425 at 64px with -0.035em tracking makes display copy feel engineered rather than marketed, while body text sits at 400/16px with generous 1.5 line-height for code-adjacent readability. Surfaces float through subtle rgba whites (0.06, 0.15, 0.2) rather than raised shadows; borders do the elevation work at #21262d. Pill-shaped navigation and tag elements at 60px radius contrast with the 6px sharp-rectangle buttons, creating a deliberate two-shape vocabulary. Color is used surgically: violet/blue/purple gradients generate ambient depth behind hero sections, bright green signals the one action that matters, and the rest of the page recedes into grayscale.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Deep Void | `#0d1117` | `--color-deep-void` | Page canvas, section backgrounds, footer — the absolute darkness that lets all other layers float |
| Abyss | `#000000` | `--color-abyss` | Hero section canvas, deepest background layer, terminal/code surfaces |
| Carbon | `#090d0a` | `--color-carbon` | Button surface, near-black accent fill |
| Obsidian | `#151a22` | `--color-obsidian` | Elevated button surface, card depth, input fields on dark canvas |
| Slate Edge | `#21262d` | `--color-slate-edge` | Hairline borders, card outlines, divider rules — the primary border that does elevation work |
| Iron | `#3d4145` | `--color-iron` | Card surface background, subtle elevated panel |
| Fog | `#484f58` | `--color-fog` | Secondary borders, stronger dividers between content blocks |
| Mercury | `#818b98` | `--color-mercury` | Muted borders, inactive form outlines |
| Ash | `#9ea0a2` | `--color-ash` | Mid-gray borders, icon strokes at reduced contrast |
| Pearl | `#a4aea6` | `--color-pearl` | Body text, secondary copy, muted nav labels, icon fills at 183 instances — the workhorse neutral |
| Moss | `#7c8980` | `--color-moss` | Tertiary headings, low-emphasis section titles that should recede |
| Snow | `#ffffff` | `--color-snow` | Primary headings, primary text, button text, nav labels — the foreground voice |
| Terminal Green | `#08872b` | `--color-terminal-green` | Primary CTA fill (Sign up for GitHub) — the one warm color in the system, deliberately evokes a terminal cursor |
| Phosphor | `#5fed83` | `--color-phosphor` | Green wash for highlight backgrounds, decorative bands, and soft emphasis behind content. Do not promote it to the primary CTA color |
| Canopy | `#0d3024` | `--color-canopy` | Gray wash for highlight backgrounds, decorative bands, and soft emphasis behind content. Use as a supporting accent, not as a status color |
| Ultraviolet | `#8c93fb` | `--color-ultraviolet` | Featured card border accent — signals the selected or highlighted card in a grid |
| Sky | `#8dd6ff` | `--color-sky` | Body text accent, icon fills, link text — the cool companion to warm green, 73 instances making it the second-most-present chromatic color |
| Cobalt | `#1f6feb` | `--color-cobalt` | Link/button accent at low frequency, icon-secondary token — reserved for marketing moments |

## Tokens — Typography

### Mona Sans — Primary interface and display typeface — custom GitHub typeface with variable weight axis. Weight 425 at 64px display is the signature choice: lighter than conventional bold but heavier than regular, creating a confident but engineered voice. Mona Sans Mono at 12px uppercase handles micro-labels (nav, button tags) with its 0.015em tracking giving labels a technical, stamped feel. · `--font-mona-sans`
- **Substitute:** Inter
- **Weights:** 400, 425, 440, 460, 480, 500, 600, 800
- **Sizes:** 12, 14, 16, 18, 22, 24, 40, 48, 64
- **Line height:** 1.00, 1.08, 1.18, 1.20, 1.30, 1.40, 1.50
- **Letter spacing:** -0.035em at display (64px) compressing to 0.01em at body (18px)
- **OpenType features:** `\"ss01\" on, \"cv11\" on`
- **Role:** Primary interface and display typeface — custom GitHub typeface with variable weight axis. Weight 425 at 64px display is the signature choice: lighter than conventional bold but heavier than regular, creating a confident but engineered voice. Mona Sans Mono at 12px uppercase handles micro-labels (nav, button tags) with its 0.015em tracking giving labels a technical, stamped feel.

### Mona Sans Mono — Monospaced companion for code-related labels, small-caps tags, and terminal-feel micro-text · `--font-mona-sans-mono`
- **Substitute:** JetBrains Mono
- **Weights:** 400, 480, 500
- **Sizes:** 12, 14, 16
- **Line height:** 1.50
- **Letter spacing:** 0.0150em
- **Role:** Monospaced companion for code-related labels, small-caps tags, and terminal-feel micro-text

### Mona Sans VF — Mona Sans VF — detected in extracted data but not described by AI · `--font-mona-sans-vf`
- **Weights:** 400, 600
- **Sizes:** 14px, 16px, 24px
- **Line height:** 1, 1.43, 1.5
- **Role:** Mona Sans VF — detected in extracted data but not described by AI

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.5 | 0.18px | `--text-caption` |
| body-sm | 14px | 1.5 | — | `--text-body-sm` |
| body | 16px | 1.5 | — | `--text-body` |
| body-lg | 18px | 1.5 | 0.18px | `--text-body-lg` |
| subheading | 22px | 1.4 | — | `--text-subheading` |
| heading-sm | 24px | 1.5 | — | `--text-heading-sm` |
| heading | 40px | 1.2 | — | `--text-heading` |
| heading-lg | 48px | 1 | — | `--text-heading-lg` |
| display | 64px | 1.08 | -2.24px | `--text-display` |

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
| 44 | 44px | `--spacing-44` |
| 48 | 48px | `--spacing-48` |
| 64 | 64px | `--spacing-64` |
| 80 | 80px | `--spacing-80` |
| 96 | 96px | `--spacing-96` |

### Border Radius

| Element | Value |
|---------|-------|
| tags | 9999px |
| cards | 24px |
| images | 16px |
| inputs | 6px |
| buttons | 6px |
| pillButtons | 60px |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 64-96px
- **Card padding:** 24px
- **Element gap:** 16-24px

## Components

### Primary CTA Button (Green)
**Role:** The single high-intent action button — sign-up, subscribe

Fill: #08872b. Text: #ffffff, Mona Sans 16px/400. Border: none. Radius: 6px. Padding: 6px 20px. This is the only chromatic filled button in the system. The warm green deliberately avoids the cool blue convention of SaaS CTAs, reading instead as a terminal-cursor accent. Never use for secondary actions.

### Ghost Button
**Role:** Secondary actions, navigation elements, icon buttons

Fill: transparent. Text/border: #ffffff. Radius: 0px (for icon buttons) or 60px (for text pills). Padding: 8px. Used 15× in the raw data as the dominant button variant — GitHub's default interaction surface is transparent, with border or text doing the signaling.

### Pill Button (Nav Tag)
**Role:** Topic tags, filter pills, category selectors in tab navigation

Fill: transparent. Text: #ffffff. Border: 1px solid #ffffff (or rgba(255,255,255,0.3) at rest). Radius: 60px. Padding: 8px 16px. The 60px radius creates the soft, rounded nav-tab vocabulary seen in the Code/Plan/Collaborate/Automate/Secure tab row.

### Outlined Action Button (Subtle)
**Role:** Tertiary actions like \"Try GitHub Copilot\" — invites without demanding

Fill: rgba(31, 35, 40, 0.4). Text: #8dd6ff. Border: 1px solid #ffffff. Radius: 6px. Padding: 6px 20px. Pairs with the green CTA as a cooler, less committed alternative. The blue text signals informational rather than transactional intent.

### Email Input Field
**Role:** Hero email capture and form inputs

Fill: transparent. Text: #000000 (renders on light inline form). Border: 1px solid #21262d. Radius: 8px. Padding: 18px 12px 0 18px (asymmetric top padding suggests floating-label pattern). Placeholder: #a4aea6 at 16px. The 8px radius is slightly softer than the 6px button radius, creating a subtle input/button rhythm.

### Glass Surface Card
**Role:** Feature cards, highlight panels, tab content containers

Fill: rgba(255, 255, 255, 0.06) to rgba(255, 255, 255, 0.2). Border: 1px solid rgba(255, 255, 255, 0.1). Radius: 24px. Backdrop-filter: blur(20px). No box-shadow. The card sits as a frosted panel on the dark canvas. The 24px radius is the signature card corner — never use 4px or 8px for major cards.

### Featured Card (Violet Border)
**Role:** Highlighted or selected card variant

Fill: rgba(255, 255, 255, 0.06). Border: 1px solid #8c93fb. Radius: 24px. The violet border signals this card is special — a feature highlight, selected state, or premium tier. Use sparingly (3 instances in the data confirms rarity).

### Top Navigation Bar
**Role:** Site-wide persistent navigation

Height: ~64px. Fill: transparent over page background. Logo: GitHub octocat (white) at left. Nav items: Mona Sans 16px/400, #ffffff, with dropdown chevrons. Search field: dark fill #151a22, 8px radius, with 

### Section Header Block
**Role:** Intro to each major page section

Centered stack: optional 3D icon or illustration at top, then headline (Mona Sans 40px/460, #ffffff, 1.2 line-height), then body text (18px/400, #a4aea6, 0.01em tracking, 1.5 line-height, max-width ~640px). The headline uses weight 460 — lighter than conventional bold — giving it a quiet confidence.

### Tab Navigation Row
**Role:** In-page content switching (Code/Plan/Collaborate/Automate/Secure)

Horizontal row of pill buttons (60px radius, 1px white border, 8px 16px padding). Active state: white fill or stronger border. Inactive: transparent with faint border. Sits above tab content with 32px gap.

### Hero Gradient Banner
**Role:** Atmospheric depth behind hero headlines and illustrations

Radial gradient from rgba(167, 162, 255, 0.5) at center to transparent, filtered with blur(60px). Positioned behind hero copy to create a soft purple glow that makes the dark canvas feel inhabited rather than empty. No sharp edges — always diffused.

### IDE/Device Frame Screenshot
**Role:** Product evidence — shows the actual product in a recognizable frame

Browser-chrome or IDE window with traffic-light dots, tab bar with file names (game.ts, characters.module.css), and a code editor inside. Border-radius: 8px on the outer frame, 6px on internal panels. Sits inside a glass card or floats on a gradient halo.

### Footer Link Grid
**Role:** Site-wide navigation, legal, and ecosystem links

Dark background (#0d1117). 4-column grid of link lists, each column headed by Mona Sans 16px/600 #ffffff. Links: 14px/400, #a4aea6, with 12px vertical spacing. Column headers: uppercase or weight-differentiated. No borders between columns — whitespace does the separation.

## Do's and Don'ts

### Do
- Use the 6px radius for all filled buttons (green CTA and outlined variants) and the 60px pill radius for navigation tags and filter chips — never mix these two shape vocabularies within the same component type
- Set body text to Mona Sans 16px/400 at 1.5 line-height — this is the single most-used type setting in the system (402 instances) and defines the reading rhythm
- Use #08872b Terminal Green exclusively for the one primary CTA per screen; never apply it to secondary actions, tags, or decorative elements where it would dilute its terminal-cursor specificity
- Build all cards with rgba(255,255,255,0.06–0.2) fills and 1px borders at rgba(255,255,255,0.1) — never use opaque card backgrounds or drop shadows; the frosted-glass effect is the card identity
- Apply the -0.035em letter-spacing at 64px display size and ease toward 0.01em at 18px body — this tracking curve is what makes Mona Sans feel engineered rather than generic
- Place a radial purple gradient halo (filtered with blur(60px)) behind hero content to create atmospheric depth — the page should never feel like flat black
- Use Mona Sans Mono 12px/500 with uppercase and 0.015em tracking for micro-labels, nav tags, and code-adjacent metadata — this stamps technical credibility onto otherwise plain labels

### Don't
- Do not use 4px or 8px radius on feature cards — the 24px radius is what makes a card read as a GitHub glass panel; smaller radii will make it look like a form field
- Do not introduce blue as a primary action color — GitHub's CTA is the warm green #08872b, a deliberate rejection of the SaaS blue convention
- Do not apply drop shadows to cards or buttons — elevation is expressed through translucency and blur, never through shadow stacks
- Do not set body text below 16px or above 18px for paragraph copy — the type scale is deliberately narrow at the reading range
- Do not use solid purple or violet fills on buttons or large surfaces — violet appears only as a card border accent (#8c93fb) and inside gradient halos, never as a flat background
- Do not mix the display weight 425 with conventional 700 bold — the 425 weight is Mona Sans's variable-axis sweet spot, lighter than bold but with more presence than regular
- Do not use #1f6feb Cobalt for general link text or icons at scale — it is reserved for low-frequency marketing moments; general link/accent text uses #8dd6ff Sky

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Void | `#0d1117` | Base page canvas |
| 1 | Abyss | `#000000` | Hero sections, terminal contexts |
| 2 | Carbon | `#151a22` | Elevated buttons, input fields |
| 3 | Iron | `#3d4145` | Card surface fill |
| 4 | Glass | `#ffffff0f` | Translucent overlay panels with backdrop blur |
| 5 | Frost | `#ffffff33` | Highest translucency, floating tooltips and modals |

## Elevation

Elevation is achieved through translucency and blur rather than drop shadows. Cards float on the dark canvas via rgba(255,255,255,0.06–0.2) fills with backdrop-filter blur(20px), and 1px borders at #21262d do the structural work. The only shadow tokens detected are ultra-subtle (#1b1f230a) for card-header depth. This creates a screen-of-glass effect where content appears suspended in dark space.

## Imagery

Illustration and 3D character mascots dominate the visual language: soft, rounded 3D blob creatures in saturated greens, pinks, and purples float in cosmic arrangements against the dark canvas. Product screenshots appear inside device frames (IDE windows, browser chrome) as hero evidence rather than lifestyle photography. Iconography is consistently outlined/stroked at 1.5–2px weight in #a4aea6 or #8dd6ff. Gradient halos (radial purple/violet) sit behind hero illustrations to create depth. No real photography of people or environments — the visual identity stays synthetic and engineered.

## Layout

Full-bleed dark page with no max-width constraint on the canvas itself; content blocks center within ~1200px. Hero is a centered headline (64px display) over a violet radial gradient halo, with an inline email-capture form (input + green CTA + ghost button) as the only action surface. Below the fold, sections alternate: centered icon + headline + body text (header pattern), then 3-column card grids with translucent surfaces, then tabbed content areas with pill-tab navigation. Vertical rhythm runs at 64–96px section gaps. Navigation is a slim top bar (~64px) with logo, dropdown menus, search field, and ghost sign-in/up buttons. Footer is a multi-column link grid in 4 columns. Z-pattern reading flow: hero CTA → feature tabs → customer logos → secondary CTA → footer.

## Agent Prompt Guide

primary action: #08872b (filled action)
Create a Primary Action Button: #08872b background, #ffffff text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.

## Gradient System

Gradients are atmospheric tools, not decorative ones. They create depth behind hero content and never appear as fills on buttons, cards, or text. Three families:\n\n1. **Purple Hero Halos** — radial-gradient from rgba(167,162,255,0.5) to transparent, always passed through blur(60px) filter. Position behind centered hero headlines and illustrations.\n\n2. **Violet Beam** — linear-gradient from rgba(120,115,203,0.2) at 60% to rgb(89,147,212) at 100%. Used as section-transition washes where dark content meets dark content but needs visual separation.\n\n3. **Green Trace** — linear-gradient from rgba(39,50,231,0) to rgba(95,237,131,0.5). Rarely used, signals a transition from neutral to action-aligned sections.\n\nAll gradients are heavily diffused (40–60px blur) and never have sharp edges. They sit at 0.3–0.6 opacity maximum and are positioned absolutely behind content.

## Motion Philosophy

Motion is restrained and purposeful. Primary easing is `ease` (cubic-bezier(0.25, 0.1, 0.25, 1)) for the vast majority of transitions. Expressive eases — `cubic-bezier(0.5, 0.16, 0.1, 1)` and `cubic-bezier(0.16, 1, 0.3, 1)` — are reserved for entrance animations and scroll-driven reveals. Durations cluster at 0.2s (44×) for micro-interactions and 0.4s (12×) for larger state changes. Transform and opacity are the most-animated properties (41× and 24×), confirming that motion is about position and visibility, not size or color. Grid-template-rows animations (8×) suggest accordions or expanding content panels. Never animate box-shadow, border-color, or background-color on hover — use opacity or transform instead to stay GPU-friendly.

## Similar Brands

- **Vercel** — Same dark canvas with frosted glass cards, violet/purple gradient halos behind hero content, and a single warm accent color for CTAs
- **Linear** — Dark-mode product interface with translucent surfaces, minimal border-based elevation, and a restrained chromatic palette where one accent does the signaling
- **Supabase** — Developer-tool dark theme with green accent CTAs, monospaced micro-labels, and the same border-does-the-elevation approach to cards
- **Railway** — Deep-dark canvas with purple/violet atmospheric gradients and a single functional accent color — same strategy of letting the canvas recede so content leads
- **Resend** — Dark marketing site with glassmorphic cards, centered hero typography at large display sizes, and pill-shaped navigation over translucent surfaces

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-deep-void: #0d1117;
  --color-abyss: #000000;
  --color-carbon: #090d0a;
  --color-obsidian: #151a22;
  --color-slate-edge: #21262d;
  --color-iron: #3d4145;
  --color-fog: #484f58;
  --color-mercury: #818b98;
  --color-ash: #9ea0a2;
  --color-pearl: #a4aea6;
  --color-moss: #7c8980;
  --color-snow: #ffffff;
  --color-terminal-green: #08872b;
  --color-phosphor: #5fed83;
  --color-canopy: #0d3024;
  --color-ultraviolet: #8c93fb;
  --color-sky: #8dd6ff;
  --color-cobalt: #1f6feb;

  /* Typography — Font Families */
  --font-mona-sans: 'Mona Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-mona-sans-mono: 'Mona Sans Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-mona-sans-vf: 'Mona Sans VF', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --tracking-caption: 0.18px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.5;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-body-lg: 18px;
  --leading-body-lg: 1.5;
  --tracking-body-lg: 0.18px;
  --text-subheading: 22px;
  --leading-subheading: 1.4;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.5;
  --text-heading: 40px;
  --leading-heading: 1.2;
  --text-heading-lg: 48px;
  --leading-heading-lg: 1;
  --text-display: 64px;
  --leading-display: 1.08;
  --tracking-display: -2.24px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-w425: 425;
  --font-weight-w440: 440;
  --font-weight-w460: 460;
  --font-weight-w480: 480;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-extrabold: 800;

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
  --spacing-44: 44px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-96: 96px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 64-96px;
  --card-padding: 24px;
  --element-gap: 16-24px;

  /* Border Radius */
  --radius-md: 6px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-3xl: 24px;
  --radius-full: 48px;
  --radius-full-2: 60px;
  --radius-full-3: 9999px;

  /* Named Radii */
  --radius-tags: 9999px;
  --radius-cards: 24px;
  --radius-images: 16px;
  --radius-inputs: 6px;
  --radius-buttons: 6px;
  --radius-pillbuttons: 60px;

  /* Surfaces */
  --surface-void: #0d1117;
  --surface-abyss: #000000;
  --surface-carbon: #151a22;
  --surface-iron: #3d4145;
  --surface-glass: #ffffff0f;
  --surface-frost: #ffffff33;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-deep-void: #0d1117;
  --color-abyss: #000000;
  --color-carbon: #090d0a;
  --color-obsidian: #151a22;
  --color-slate-edge: #21262d;
  --color-iron: #3d4145;
  --color-fog: #484f58;
  --color-mercury: #818b98;
  --color-ash: #9ea0a2;
  --color-pearl: #a4aea6;
  --color-moss: #7c8980;
  --color-snow: #ffffff;
  --color-terminal-green: #08872b;
  --color-phosphor: #5fed83;
  --color-canopy: #0d3024;
  --color-ultraviolet: #8c93fb;
  --color-sky: #8dd6ff;
  --color-cobalt: #1f6feb;

  /* Typography */
  --font-mona-sans: 'Mona Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-mona-sans-mono: 'Mona Sans Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-mona-sans-vf: 'Mona Sans VF', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.5;
  --tracking-caption: 0.18px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.5;
  --text-body: 16px;
  --leading-body: 1.5;
  --text-body-lg: 18px;
  --leading-body-lg: 1.5;
  --tracking-body-lg: 0.18px;
  --text-subheading: 22px;
  --leading-subheading: 1.4;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.5;
  --text-heading: 40px;
  --leading-heading: 1.2;
  --text-heading-lg: 48px;
  --leading-heading-lg: 1;
  --text-display: 64px;
  --leading-display: 1.08;
  --tracking-display: -2.24px;

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
  --spacing-44: 44px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-96: 96px;

  /* Border Radius */
  --radius-md: 6px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-3xl: 24px;
  --radius-full: 48px;
  --radius-full-2: 60px;
  --radius-full-3: 9999px;
}
```
