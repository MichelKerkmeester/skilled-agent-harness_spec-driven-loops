# NEVERHACK — Style Reference
> encrypted command terminal on cold marble

**Theme:** light

NEVERHACK operates in a stark, high-trust sovereign-cybersecurity register: near-white canvas, near-black navy type (#0a0f1f), and a single electric violet (#6b2bea) that activates only for AI surface. Hierarchy is carved through weight and scale, not decoration — the 72px display headlines paired with a quiet 11–17px body voice create a clinical, operator-grade tension. Components feel like equipment, not marketing: pill-shaped controls, hairline borders on cool gray (#e5e7eb), and a distinctive purple-tinted shadow system (rgba(40,30,93,*)) that makes every elevated surface feel on-brand rather than generic. A muted signal red (#dc2626) is reserved exclusively for critical/emergency semantics — CERT, crisis, hazard — so it never gets confused with the violet brand voice.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Sovereign Ink | `#0a0f1f` | `--color-sovereign-ink` | Primary text, headlines, nav, core UI — near-black with a barely-perceptible blue cast that separates it from pure black and lets violet accents feel native |
| Signal White | `#ffffff` | `--color-signal-white` | Card surfaces, elevated panels, button text on dark fills |
| Mist Surface | `#f6f7fc` | `--color-mist-surface` | Page canvas, soft card backgrounds, subtle wash sections |
| Cool Hairline | `#e5e7eb` | `--color-cool-hairline` | Borders, dividers, input outlines, structural separators — the single neutral that holds the whole UI together |
| Shadow Lichen | `#d8d7e2` | `--color-shadow-lichen` | Card inset shadow tint, quiet elevation layer |
| Carbon Gray | `#4e4e4e` | `--color-carbon-gray` | Secondary text, supporting copy, muted labels |
| Ash Gray | `#999999` | `--color-ash-gray` | Button shadow tint, disabled affordances, tertiary text |
| Sovereign Violet | `linear-gradient(rgba(107, 43, 234, 0.06) 0%, rgb(247, 248, 252) 100%)` | `--color-sovereign-violet` | Brand accent, AI surface highlights, chat response fills, decorative strokes, badge dots, icon accents — defines the AI-native identity; Hero section ambient gradient: fades from a 6%-opacity violet into Mist Surface, signaling AI atmosphere without hard color blocking |
| Violet Wash | `#afa9fd` | `--color-violet-wash` | Tinted backgrounds for AI-adjacent surfaces, soft highlight washes, capability tags |
| Cyber Cyan | `#28d3fe` | `--color-cyber-cyan` | Blue wash for highlight backgrounds, decorative bands, and soft emphasis behind content. Do not promote it to the primary CTA color |
| Alert Crimson | `radial-gradient(circle at 70% 35%, rgba(220, 38, 38, 0.22) 0%, rgba(0, 0, 0, 0) 60%)` | `--color-alert-crimson` | Critical/emergency state only — CERT badges, crisis CTAs, hazard indicators. Never used decoratively; its scarcity is its meaning; Radial emergency glow behind critical badges — 22% opacity at upper-right, fading to transparent |
| Crimson Glow | `#f4baba` | `--color-crimson-glow` | Red supporting accent for decorative details and low-frequency emphasis. Use as a supporting accent, not as a status color |
| Info Blue | `#2563eb` | `--color-info-blue` | Informational badges, neutral data callouts, non-critical status indicators |

## Tokens — Typography

### Roobert — Single-family system. Roobert's geometric-humanist forms handle the full scale from 11px micro-labels to 72px display headlines. The custom face's slightly condensed proportions and subtle stroke contrast make headlines feel like terminal readouts rather than marketing copy. Weight 400 carries most UI; weight 500 is reserved for nav items, button labels, and emphasis. Letter-spacing tightens aggressively as size grows: -0.03em at 72px down to neutral at body sizes; micro-labels and ALL-CAPS badges open up to +0.08–0.12em for legibility · `--font-roobert`
- **Substitute:** Inter (closest free alternative), then Söhne or General Sans
- **Weights:** 400, 500
- **Sizes:** 11px, 12px, 13px, 14px, 15px, 16px, 17px, 18px, 22px, 24px, 32px, 34px, 40px, 52px, 72px
- **Line height:** 1.00–1.63 (display: 1.00–1.08, headings: 1.20–1.45, body: 1.50–1.63)
- **Letter spacing:** Display 72px: -2.16px (-0.03em); 52px: -1.30px (-0.025em); 40px: -0.80px (-0.02em); 32px: -0.48px (-0.015em); 24px: -0.24px (-0.01em); 18–22px: -0.09px (-0.005em); 14–17px: 0; ALL-CAPS badges/eyebrows: +0.88 to +1.32px (+0.08 to +0.12em)
- **Role:** Single-family system. Roobert's geometric-humanist forms handle the full scale from 11px micro-labels to 72px display headlines. The custom face's slightly condensed proportions and subtle stroke contrast make headlines feel like terminal readouts rather than marketing copy. Weight 400 carries most UI; weight 500 is reserved for nav items, button labels, and emphasis. Letter-spacing tightens aggressively as size grows: -0.03em at 72px down to neutral at body sizes; micro-labels and ALL-CAPS badges open up to +0.08–0.12em for legibility

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 11px | 1.55 | 0.88px | `--text-caption` |
| body-sm | 14px | 1.55 | — | `--text-body-sm` |
| body | 16px | 1.6 | — | `--text-body` |
| body-lg | 18px | 1.63 | -0.09px | `--text-body-lg` |
| subheading | 22px | 1.45 | -0.11px | `--text-subheading` |
| heading-sm | 24px | 1.3 | -0.24px | `--text-heading-sm` |
| heading | 32px | 1.2 | -0.48px | `--text-heading` |
| heading-lg | 40px | 1.12 | -0.8px | `--text-heading-lg` |
| display | 52px | 1.08 | -1.3px | `--text-display` |
| display-xl | 72px | 1 | -2.16px | `--text-display-xl` |

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
| 48 | 48px | `--spacing-48` |
| 56 | 56px | `--spacing-56` |
| 64 | 64px | `--spacing-64` |
| 80 | 80px | `--spacing-80` |
| 96 | 96px | `--spacing-96` |
| 128 | 128px | `--spacing-128` |
| 144 | 144px | `--spacing-144` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 14px |
| badges | 9999px |
| buttons | 9999px |
| nav-pills | 18px |
| inner-cards | 10px |
| small-elements | 6px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| subtle | `rgba(0, 0, 0, 0.4) 0px 0px 1px 0px, rgba(0, 0, 0, 0.08) 0...` | `--shadow-subtle` |
| subtle-2 | `rgb(235, 232, 228) 0px 0px 0px 0.5px inset, rgba(0, 0, 0,...` | `--shadow-subtle-2` |
| subtle-3 | `rgba(40, 30, 93, 0.06) 0px 1px 2px 0px` | `--shadow-subtle-3` |
| xl | `rgba(40, 30, 93, 0.25) 0px 30px 45px -30px, rgba(0, 0, 0,...` | `--shadow-xl` |
| md | `rgba(40, 30, 93, 0.04) 0px 4px 12px -4px, rgba(0, 0, 0, 0...` | `--shadow-md` |
| subtle-4 | `rgba(0, 0, 0, 0.06) 0px 0px 0px 1px, rgba(0, 0, 0, 0.04) ...` | `--shadow-subtle-4` |
| subtle-5 | `rgb(235, 232, 228) 0px 0px 0px 0.5px inset, rgba(0, 0, 0,...` | `--shadow-subtle-5` |
| xl-2 | `rgba(40, 30, 93, 0.18) 0px 50px 100px -20px, rgba(40, 30,...` | `--shadow-xl-2` |
| lg | `rgba(220, 38, 38, 0.32) 0px 12px 24px -10px, rgba(0, 0, 0...` | `--shadow-lg` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 80px
- **Card padding:** 32px
- **Element gap:** 12px

## Components

### Primary Filled Button (Dark)
**Role:** Default CTA for key actions: 'Ask PROMETHEUS', 'How we work', 'Explore capabilities'

Pill-shaped, 9999px radius, Sovereign Ink (#0a0f1f) fill, Signal White (#ffffff) text, 12px 24px padding, Roobert 15px weight 500. Subtle elevation: rgba(0,0,0,0.4) 0px 0px 1px + rgba(0,0,0,0.08) 0px 4px 8px. Acts as the grounded counterpart to violet AI surface.

### Ghost Outlined Button
**Role:** Secondary CTA, paired alongside primary dark button

Pill shape, transparent fill, 1px Sovereign Ink border, Sovereign Ink text, 12px 24px padding, 15px weight 500. No shadow. Pairs with the dark CTA to form the standard two-button hero/section pattern.

### Nav Pill Button (Active State)
**Role:** Active nav highlight, as seen on 'Cyber AI' in header

Pill shape with 18px radius (or 9999px for fully rounded), 8px 16px padding, Sovereign Ink fill, Signal White text, 13px weight 500. The slightly tighter radius vs other pills makes it feel more like a tab.

### Alert Emergency Button
**Role:** Reserved for CERT/crisis actions only — 'Activate emergency response'

Pill shape, 9999px radius, Alert Crimson (#dc2626) fill, Signal White text, 12px 24px padding, 15px weight 500. Elevated with soft warm red shadow tint. Never use for standard CTAs — its scarcity preserves urgency.

### Capability Card
**Role:** Three-up feature cards in 'End-to-end cyber coverage' section

14px border radius, white surface, 1px Cool Hairline (#e5e7eb) border, 32px internal padding. Elevated with the brand purple-tinted shadow: rgba(40,30,93,0.04) 0px 4px 12px -4px + rgba(0,0,0,0.03) 0px 1px 2px. Contains an eyebrow label (12px ALL-CAPS +0.08em), a 22–24px heading, body copy, and a 'Learn more →' link.

### Highlight Card (Capability Expanded)
**Role:** Larger 'Technology Resale' style card with sub-list and visual treatment

16–20px border radius, Mist Surface (#f6f7fc) or white fill, 1px Cool Hairline border, generous 32–40px padding. Contains a violet dot indicator, heading, description, and an embedded sub-card with numbered list (01/02/03). The sub-card uses 10px radius and lighter surface for nesting.

### Principle Card
**Role:** Three-column principle cards in 'Three principles, one operating standard'

No visible border or background — pure typographic structure on canvas. Each card: short colored top-underline (violet, blue, or cyan, 2–3px tall, ~24px wide), 24–32px heading, body copy below. The color underline is the only decorative anchor.

### Chat Surface (AI Interaction)
**Role:** Hero chat widget showing AI conversation

Rounded card ~18px radius, white surface, multi-layer purple-tinted shadow stack. Contains: a light gray (#e5e7eb) user message bubble (rounded ~14px), a vibrant Sovereign Violet (#6b2bea) AI response bubble (rounded ~14px, white text), and a message input with a subtle 1px border. The violet bubble is the strongest brand-color moment on the page.

### Eyebrow Label / Tag
**Role:** ALL-CAPS section identifiers: 'SOVEREIGN CYBERSECURITY & AI', 'CAPABILITIES'

12px Roobert weight 500, ALL-CAPS, +0.12em letter-spacing, Sovereign Violet (#6b2bea) or Carbon Gray color. No background, no border. Sets context before each major section.

### Category Badge
**Role:** Tag above capability card titles: 'AI', 'MSP', 'CRITICAL'

Inline pill, small radius (~6px), 10px vertical / 12px horizontal padding, 11–12px weight 500, ALL-CAPS +0.08em. Color signals category: violet-tinted for AI, neutral for MSP, crimson-tinted for CRITICAL.

### Sector Ticker Bar
**Role:** Horizontal scrolling industry sector labels: 'Finance, Health, Industry, Telecoms...'

Borderless row on white, single 1px top + bottom hairline in Cool Hairline. Each label: 13–14px Roobert weight 400, Carbon Gray, 24–32px horizontal padding. Repetition is the visual — no decoration needed.

### Top Banner (Notification)
**Role:** Slim announcement bar at very top of page

Thin band (~40px), white or very light background, 1px bottom border. Centered text: 12–13px, contains a violet sparkle/dot icon and a violet 'Access the report →' link.

### Header / Navigation Bar
**Role:** Primary site navigation

White background, 1px bottom border Cool Hairline, ~64–72px height. Left: NEVERHACK wordmark + N monogram. Center: 6–7 nav items in 15px weight 500 Sovereign Ink. Right: ghost 'Sign in' text, three text nav items, one dark 'Cyber AI' pill, 'Contact' text. Logo mark is a stylized 'N' in negative space within a square.

### Input Field (Chat Input)
**Role:** Message entry in chat widget

Pill shape (~999px radius), white fill, 1px Cool Hairline border, 12–16px padding. Placeholder 'Enter your message' in 14px Carbon Gray. Optional icon buttons (up-arrow submit, mic) at right edge, 32×32 hit targets.

## Do's and Don'ts

### Do
- Use 9999px radius for all interactive elements: buttons, badges, chat input, nav pills
- Set the primary CTA to Sovereign Ink (#0a0f1f) on Signal White text — never let Alert Crimson become the default action
- Apply the purple-tinted shadow stack (rgba(40,30,93,*) values) to all elevated cards and chat surfaces for brand-coherent depth
- Tighten letter-spacing aggressively at large sizes: -0.03em at 72px, -0.025em at 52px, -0.02em at 40px
- Open letter-spacing on ALL-CAPS eyebrows and badges: +0.08 to +0.12em for legibility at small sizes
- Reserve Alert Crimson (#dc2626) exclusively for CERT, crisis, emergency, and hazard contexts — its rarity is the signal
- Use Sovereign Violet (#6b2bea) as the AI signature: chat responses, brand dots, capability tags, decorative strokes

### Don't
- Don't use Alert Crimson for non-critical actions, marketing copy, or decorative emphasis — it loses meaning through overuse
- Don't pair Sovereign Violet with Alert Crimson in the same component — the two chromatic accents must stay in separate semantic lanes
- Don't add shadows to text, icons, or small UI elements — elevation belongs only on cards, chat surfaces, and the primary CTA
- Don't use 72px or 52px display sizes for sub-headings or section intros — those are hero-only; step down to 32–40px for section openers
- Don't introduce new chromatic colors beyond the defined palette — the 5% colorfulness is the brand contract
- Don't use pure black (#000000) for body text — Sovereign Ink (#0a0f1f) is the only acceptable text color; black is reserved for nav border accents and button micro-details
- Don't apply soft radius (6–14px) to buttons or interactive controls — only cards, inputs, and nested elements use measured radii

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Page Canvas | `#f6f7fc` | Base page background, subtle off-white with cool cast that separates content from pure white surfaces |
| 1 | Card Surface | `#ffffff` | Default card and panel background, chat widget, elevated content blocks |
| 2 | Nested Surface | `#f6f7fc` | Sub-cards inside larger cards, inset content, visual differentiation within parent surfaces |
| 3 | Tinted Wash | `#afa9fd` | Sparse highlight surfaces for AI context, capability tag backgrounds — use only for emphasis, never as full sections |

## Elevation

- **Primary Button (Dark):** `rgba(0, 0, 0, 0.4) 0px 0px 1px 0px, rgba(0, 0, 0, 0.08) 0px 4px 8px 0px`
- **Capability Card:** `rgba(40, 30, 93, 0.04) 0px 4px 12px -4px, rgba(0, 0, 0, 0.03) 0px 1px 2px 0px`
- **Chat / AI Surface:** `rgba(40, 30, 93, 0.25) 0px 30px 45px -30px, rgba(0, 0, 0, 0.1) 0px 18px 36px -18px`
- **Inset Card Border:** `rgb(235, 232, 228) 0px 0px 0px 0.5px inset, rgba(0, 0, 0, 0.04) 0px 1px 1px 0px, rgba(0, 0, 0, 0.04) 0px 4px 4px 0px`
- **Body Text Subtle Lift:** `rgba(40, 30, 93, 0.06) 0px 1px 2px 0px`

## Imagery

Visuals are sparse and purposeful: abstract 3D gradient orbs (violet-to-blue and crimson-to-pink) appear as card hero images, tightly cropped in rounded containers. No lifestyle photography, no people, no real-world environments. The visual language is: glowing liquid-metal sculptures on pure color, suggesting AI computation and threat energy. Icons are thin-line monochrome (1.5px stroke) in Sovereign Ink, with occasional violet accent. The overall density is text-dominant — imagery punctuates rather than narrates, occupying roughly 20% of any given section.

## Layout

Max-width 1200px centered, generous section gaps (80px+) between bands. Hero is a two-column split: left holds eyebrow + 52–72px display headline + body + two-button group; right holds the floating AI chat widget, vertically centered against the headline. Sections alternate between full-width white bands and subtle Mist Surface (#f6f7fc) washes, separated by hairline borders rather than heavy dividers. Feature sections use a 3-column card grid with equal-width cards and consistent 12–24px gutters. Principle sections drop to borderless 3-column typographic grids. Sector ticker sits as a single full-width borderless row between hero and content. Navigation is a sticky top bar with right-aligned utility nav and one dark accent pill marking the current context.

## Agent Prompt Guide

**Quick Color Reference**
- text: #0a0f1f (Sovereign Ink)
- background: #f6f7fc (Mist Surface)
- card: #ffffff (Signal White)
- border: #e5e7eb (Cool Hairline)
- accent: #6b2bea (Sovereign Violet)
- primary action: #dc2626 (filled action)

**Example Component Prompts**
1. Create a Primary Action Button: #dc2626 background, #ffffff text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.
2. *AI Chat Card*: 18px radius, #ffffff fill, shadow rgba(40,30,93,0.25) 0px 30px 45px -30px + rgba(0,0,0,0.1) 0px 18px 36px -18px. User message bubble: #e5e7eb fill, #0a0f1f text, 14px. AI response bubble: #6b2bea fill, #ffffff text, 14px weight 500. Input: pill 999px radius, 1px #e5e7eb border, 14px placeholder in #4e4e4e.
3. *Capability Card*: 14px radius, #ffffff fill, 1px #e5e7eb border, shadow rgba(40,30,93,0.04) 0px 4px 12px -4px + rgba(0,0,0,0.03) 0px 1px 2px. Category badge: 6px radius, 10px 12px padding, 11px ALL-CAPS weight 500, #6b2bea on #afa9fd wash. Heading 24px weight 500 #0a0f1f. Body 16px weight 400 #4e4e4e. 'Learn more →' link in #6b2bea, 15px weight 500.
4. *Critical Alert Card*: 14px radius, #ffffff fill, 1px #e5e7eb border. Badge: 9999px radius, #dc2626 fill, 11px ALL-CAPS #ffffff weight 500. Heading 24px weight 500 #0a0f1f. CTA: 9999px radius, #dc2626 fill, #ffffff text, 12px 24px padding, 15px weight 500, shadow with warm red tint.
5. *Principle Column*: No border, no background. Top accent: 2px tall × 24px wide colored bar (use #6b2bea, #2563eb, or #28d3fe). Heading 24px weight 500 #0a0f1f. Body 16px weight 400 #4e4e4e, line-height 1.60.

## Shadow System Philosophy

Every shadow in this system uses either pure neutral black at low opacity or the brand purple base (rgb 40,30,93) at low opacity. The purple-tinted shadows are the signature: they make even a generic card lift feel on-brand. Never use warm brown or cool blue shadows — the purple cast is non-negotiable for brand coherence. Elevation is used sparingly: only on primary CTAs, capability cards, and the chat/AI surface. Most UI is flat, separated by 1px hairline borders.

## Color Rationing

The 5% colorfulness target is a hard contract. 95% of the rendered page should be neutrals (Sovereign Ink, Signal White, Mist Surface, Cool Hairline). The remaining 5% splits between Sovereign Violet (AI surface, ~3.5%) and Alert Crimson (critical state, ~1.5%). Cyber Cyan appears at <0.5% — a single accent per page maximum. If violet starts appearing on non-AI elements, the brand signal dilutes.

## Similar Brands

- **CrowdStrike** — Same sovereign-cybersecurity register: dark navy type on white canvas, pill-shaped controls, hairline borders, and a single accent color reserved for threat/AI context
- **Anthropic** — Near-identical chat-surface treatment with violet AI response bubbles, restrained palette, and 72px display headlines paired with quiet 15–17px body text
- **Linear** — Same pill-button geometry, hairline border system, and the discipline of using one chromatic accent (violet here, purple there) against a near-monochrome neutral system
- **Hugging Face** — Same comfortable density with 4px base, generous card padding, and the practice of letting eyebrows and badges carry the only chromatic punctuation
- **Palantir** — Same operator-grade typographic tension: oversized display headlines with 1.00 line-height next to clinical body copy, signal red reserved exclusively for critical state

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-sovereign-ink: #0a0f1f;
  --color-signal-white: #ffffff;
  --color-mist-surface: #f6f7fc;
  --color-cool-hairline: #e5e7eb;
  --color-shadow-lichen: #d8d7e2;
  --color-carbon-gray: #4e4e4e;
  --color-ash-gray: #999999;
  --color-sovereign-violet: #6b2bea;
  --gradient-sovereign-violet: linear-gradient(rgba(107, 43, 234, 0.06) 0%, rgb(247, 248, 252) 100%);
  --color-violet-wash: #afa9fd;
  --color-cyber-cyan: #28d3fe;
  --color-alert-crimson: #dc2626;
  --gradient-alert-crimson: radial-gradient(circle at 70% 35%, rgba(220, 38, 38, 0.22) 0%, rgba(0, 0, 0, 0) 60%);
  --color-crimson-glow: #f4baba;
  --color-info-blue: #2563eb;

  /* Typography — Font Families */
  --font-roobert: 'Roobert', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 11px;
  --leading-caption: 1.55;
  --tracking-caption: 0.88px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.55;
  --text-body: 16px;
  --leading-body: 1.6;
  --text-body-lg: 18px;
  --leading-body-lg: 1.63;
  --tracking-body-lg: -0.09px;
  --text-subheading: 22px;
  --leading-subheading: 1.45;
  --tracking-subheading: -0.11px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.3;
  --tracking-heading-sm: -0.24px;
  --text-heading: 32px;
  --leading-heading: 1.2;
  --tracking-heading: -0.48px;
  --text-heading-lg: 40px;
  --leading-heading-lg: 1.12;
  --tracking-heading-lg: -0.8px;
  --text-display: 52px;
  --leading-display: 1.08;
  --tracking-display: -1.3px;
  --text-display-xl: 72px;
  --leading-display-xl: 1;
  --tracking-display-xl: -2.16px;

  /* Typography — Weights */
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
  --spacing-28: 28px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-56: 56px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-96: 96px;
  --spacing-128: 128px;
  --spacing-144: 144px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 32px;
  --element-gap: 12px;

  /* Border Radius */
  --radius-md: 6px;
  --radius-lg: 10px;
  --radius-xl: 14px;
  --radius-2xl: 18px;
  --radius-2xl-2: 22px;
  --radius-full: 999px;
  --radius-full-2: 9999px;

  /* Named Radii */
  --radius-cards: 14px;
  --radius-badges: 9999px;
  --radius-buttons: 9999px;
  --radius-nav-pills: 18px;
  --radius-inner-cards: 10px;
  --radius-small-elements: 6px;

  /* Shadows */
  --shadow-subtle: rgba(0, 0, 0, 0.4) 0px 0px 1px 0px, rgba(0, 0, 0, 0.08) 0px 4px 8px 0px;
  --shadow-subtle-2: rgb(235, 232, 228) 0px 0px 0px 0.5px inset, rgba(0, 0, 0, 0.04) 0px 1px 1px 0px, rgba(0, 0, 0, 0.04) 0px 4px 4px 0px;
  --shadow-subtle-3: rgba(40, 30, 93, 0.06) 0px 1px 2px 0px;
  --shadow-xl: rgba(40, 30, 93, 0.25) 0px 30px 45px -30px, rgba(0, 0, 0, 0.1) 0px 18px 36px -18px;
  --shadow-md: rgba(40, 30, 93, 0.04) 0px 4px 12px -4px, rgba(0, 0, 0, 0.03) 0px 1px 2px 0px;
  --shadow-subtle-4: rgba(0, 0, 0, 0.06) 0px 0px 0px 1px, rgba(0, 0, 0, 0.04) 0px 1px 2px 0px, rgba(0, 0, 0, 0.04) 0px 2px 4px 0px;
  --shadow-subtle-5: rgb(235, 232, 228) 0px 0px 0px 0.5px inset, rgba(0, 0, 0, 0.4) 0px 0px 1px 0px, rgba(0, 0, 0, 0.04) 0px 1px 1px 0px, rgba(0, 0, 0, 0.04) 0px 4px 4px 0px;
  --shadow-xl-2: rgba(40, 30, 93, 0.18) 0px 50px 100px -20px, rgba(40, 30, 93, 0.12) 0px 30px 60px -30px, rgba(10, 15, 31, 0.08) 0px 8px 24px -8px;
  --shadow-lg: rgba(220, 38, 38, 0.32) 0px 12px 24px -10px, rgba(0, 0, 0, 0.06) 0px 2px 4px 0px;

  /* Surfaces */
  --surface-page-canvas: #f6f7fc;
  --surface-card-surface: #ffffff;
  --surface-nested-surface: #f6f7fc;
  --surface-tinted-wash: #afa9fd;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-sovereign-ink: #0a0f1f;
  --color-signal-white: #ffffff;
  --color-mist-surface: #f6f7fc;
  --color-cool-hairline: #e5e7eb;
  --color-shadow-lichen: #d8d7e2;
  --color-carbon-gray: #4e4e4e;
  --color-ash-gray: #999999;
  --color-sovereign-violet: #6b2bea;
  --color-violet-wash: #afa9fd;
  --color-cyber-cyan: #28d3fe;
  --color-alert-crimson: #dc2626;
  --color-crimson-glow: #f4baba;
  --color-info-blue: #2563eb;

  /* Typography */
  --font-roobert: 'Roobert', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 11px;
  --leading-caption: 1.55;
  --tracking-caption: 0.88px;
  --text-body-sm: 14px;
  --leading-body-sm: 1.55;
  --text-body: 16px;
  --leading-body: 1.6;
  --text-body-lg: 18px;
  --leading-body-lg: 1.63;
  --tracking-body-lg: -0.09px;
  --text-subheading: 22px;
  --leading-subheading: 1.45;
  --tracking-subheading: -0.11px;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.3;
  --tracking-heading-sm: -0.24px;
  --text-heading: 32px;
  --leading-heading: 1.2;
  --tracking-heading: -0.48px;
  --text-heading-lg: 40px;
  --leading-heading-lg: 1.12;
  --tracking-heading-lg: -0.8px;
  --text-display: 52px;
  --leading-display: 1.08;
  --tracking-display: -1.3px;
  --text-display-xl: 72px;
  --leading-display-xl: 1;
  --tracking-display-xl: -2.16px;

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
  --spacing-48: 48px;
  --spacing-56: 56px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-96: 96px;
  --spacing-128: 128px;
  --spacing-144: 144px;

  /* Border Radius */
  --radius-md: 6px;
  --radius-lg: 10px;
  --radius-xl: 14px;
  --radius-2xl: 18px;
  --radius-2xl-2: 22px;
  --radius-full: 999px;
  --radius-full-2: 9999px;

  /* Shadows */
  --shadow-subtle: rgba(0, 0, 0, 0.4) 0px 0px 1px 0px, rgba(0, 0, 0, 0.08) 0px 4px 8px 0px;
  --shadow-subtle-2: rgb(235, 232, 228) 0px 0px 0px 0.5px inset, rgba(0, 0, 0, 0.04) 0px 1px 1px 0px, rgba(0, 0, 0, 0.04) 0px 4px 4px 0px;
  --shadow-subtle-3: rgba(40, 30, 93, 0.06) 0px 1px 2px 0px;
  --shadow-xl: rgba(40, 30, 93, 0.25) 0px 30px 45px -30px, rgba(0, 0, 0, 0.1) 0px 18px 36px -18px;
  --shadow-md: rgba(40, 30, 93, 0.04) 0px 4px 12px -4px, rgba(0, 0, 0, 0.03) 0px 1px 2px 0px;
  --shadow-subtle-4: rgba(0, 0, 0, 0.06) 0px 0px 0px 1px, rgba(0, 0, 0, 0.04) 0px 1px 2px 0px, rgba(0, 0, 0, 0.04) 0px 2px 4px 0px;
  --shadow-subtle-5: rgb(235, 232, 228) 0px 0px 0px 0.5px inset, rgba(0, 0, 0, 0.4) 0px 0px 1px 0px, rgba(0, 0, 0, 0.04) 0px 1px 1px 0px, rgba(0, 0, 0, 0.04) 0px 4px 4px 0px;
  --shadow-xl-2: rgba(40, 30, 93, 0.18) 0px 50px 100px -20px, rgba(40, 30, 93, 0.12) 0px 30px 60px -30px, rgba(10, 15, 31, 0.08) 0px 8px 24px -8px;
  --shadow-lg: rgba(220, 38, 38, 0.32) 0px 12px 24px -10px, rgba(0, 0, 0, 0.06) 0px 2px 4px 0px;
}
```
