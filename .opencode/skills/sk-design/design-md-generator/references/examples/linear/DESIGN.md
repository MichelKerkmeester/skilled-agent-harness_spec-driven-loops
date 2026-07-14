---
title: Linear Style Reference Example
description: Gold-standard dark v3 Style Reference example for studying measured Linear design tokens, typography, surfaces, and component prose.
trigger_phrases:
  - Linear DESIGN.md example
  - dark style reference example
  - study Linear design tokens
importance_tier: normal
contextType: reference
version: 1.0.0.0
---

# Linear — Style Reference
> A near-black product canvas where content surfaces through luminance, and a single indigo is the only thing allowed to glow.

**Theme:** dark

Linear builds on a near-black canvas (`#08090a`), against which Snow text (`#f7f8f8`) sits at 19.74:1 contrast — the dominant pairing across the entire surface. Inter Variable carries every word, ranging from a 10px caption to a 72px hero, with hierarchy driven by tracking that tightens as size grows (-0.15px at 10px down to -1.584px at the largest heading). Colour is rationed hard: most of the 43 tokens are achromatic grays stepping from Snow through Steel (`#8a8f98`) and Slate (`#62666d`) to the Ink near-blacks, and Azure 3 (`#5e6ad2`) is the one indigo reserved for the brand accent and badges. Surfaces are not painted in — interactive elements are built from near-transparent white overlays (`rgba(255,255,255,0.01)` to `0.05`) that only resolve into panels through hairline borders and a deep 16-token shadow stack. Layout runs edge to edge at 100% width with section spacing that swings from 48px up past 200px, framing each block as a self-contained slab. Berkeley Mono handles code, the one place the system leaves its sans-serif voice.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Snow | `#f7f8f8` | `--color-snow` | borders, text, backgrounds — a near-white |
| Slate | `#62666d` | `--color-slate` | borders, text, icons — a mid gray |
| Light Azure | `#d0d6e0` | `--color-light-azure` | borders, text, icons — a light blue |
| Steel | `#8a8f98` | `--color-steel` | borders, text, icons — a light gray |
| Linen | `#e2e4e7` | `--color-linen` | borders, text, backgrounds — a soft off-white |
| Light Magenta | `#f79ce0` | `--color-light-magenta` | borders, text — a light magenta |
| Obsidian | `#202122` | `--color-obsidian` | borders, gradients, backgrounds — a deep near-black |
| Teal | `#55cdff` | `--color-teal` | borders, text, backgrounds — a teal |
| Ink | `#000000` | `--color-ink` | backgrounds — a near-black |
| Ink 2 | `#08090a` | `--color-ink-2` | text, borders, backgrounds — a near-black |
| Ember | `#ffc47c` | `--color-ember` | borders, text — a orange |
| Light Azure 2 | `#8fa4ff` | `--color-light-azure-2` | borders, text — a light blue |
| Sage | `#89d196` | `--color-sage` | borders, text — a green-gray |
| Voltage | `#00ff05` | `--color-voltage` | backgrounds — a green |
| Graphite | `#383b3f` | `--color-graphite` | borders, backgrounds, icons — a dark gray |
| Crimson | `#d6303d` | `--color-crimson` | text, borders — a red |
| Voltage 2 | `#008d2c` | `--color-voltage-2` | text, borders — a green |
| Crimson 2 | `#eb5757` | `--color-crimson-2` | borders, backgrounds, text — a red |
| Ink 3 | `#0f1011` | `--color-ink-3` | backgrounds — a near-black |
| Crimson 3 | `#ff0000` | `--color-crimson-3` | backgrounds — a red |
| Azure | `#6d78d5` | `--color-azure` | borders, text — a blue |
| Voltage 3 | `#27a644` | `--color-voltage-3` | borders, text — a green |
| Azure 2 | `#6366f1` | `--color-azure-2` | backgrounds — a blue |
| Obsidian 2 | `#323334` | `--color-obsidian-2` | borders, icons — a deep near-black |
| Teal 2 | `#02b8cc` | `--color-teal-2` | backgrounds, icons — a teal |
| Azure 3 | `#5e6ad2` | `--color-azure-3` | backgrounds, icons — a blue |
| Indigo | `#8b5cf6` | `--color-indigo` | backgrounds — a indigo |
| Obsidian 3 | `#28282c` | `--color-obsidian-3` | backgrounds — a deep near-black |
| Light Azure 3 | `#b2d5ff` | `--color-light-azure-3` | gradients — a light blue |
| Light Indigo | `#dfd1ff` | `--color-light-indigo` | gradients — a light indigo |
| Steel 2 | `#9c9da1` | `--color-steel-2` | icons, backgrounds — a light gray |
| Obsidian 4 | `#161718` | `--color-obsidian-4` | backgrounds — a deep near-black |
| Teal 3 | `#10b981` | `--color-teal-3` | backgrounds — a teal |
| Deep Teal | `#0f3338` | `--color-deep-teal` | backgrounds — a deep teal |
| Deep Crimson | `#422222` | `--color-deep-crimson` | backgrounds — a deep red |
| Citron | `#e4f222` | `--color-citron` | backgrounds — a yellow |
| Slate 2 | `#5b5c5a` | `--color-slate-2` | icons — a mid gray |
| Crimson 4 | `#e3484e` | `--color-crimson-4` | icons — a red |
| Ember 2 | `#ff7236` | `--color-ember-2` | icons — a orange |
| Azure 4 | `#4354b8` | `--color-azure-4` | icons — a blue |
| Ember 3 | `#e5591d` | `--color-ember-3` | icons — a orange |
| Slate 3 | `#808080` | `--color-slate-3` | backgrounds — a mid gray |
| Graphite 2 | `#505050` | `--color-graphite-2` | backgrounds — a dark gray |

## Tokens — Typography

### Inter Variable — the entire interface, caption to hero · `--font-inter`
- **Substitute:** Inter, system sans-serif
- **Weights:** 400, 510, 590 (loaded as a 100–900 variable axis)
- **Sizes:** 10px, 11px, 12px, 13px, 14px, 15px, 16px, 17px, 20px, 24px, 32px, 48px, 64px, 72px
- **Line height:** 15px through 72px, tracking each size 1.2–1.5×
- **Letter spacing:** tightens with size — normal at the small UI sizes, -0.182px at 14px, -0.704px at 32px, down to -1.584px at the largest heading
- **Role:** Sole UI, body, label, navigation, and headline typeface. The three weights do strict duty — 400 for body and reading, 510 for UI and interactive labels, 590 for headings and emphasis.

### Berkeley Mono — code and technical labels · `--font-berkeley-mono`
- **Substitute:** Fira Code, JetBrains Mono, monospace
- **Weights:** 400 (loaded as a 100–900 variable axis)
- **Sizes:** 12px (the code-block size)
- **Role:** Reserved for inline code, code blocks, and technical fragments. It is the only break from Inter Variable in the system, marking machine text as distinct from prose.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 10px | 15px | -0.15px | `--text-caption` |
| caption-strong | 11px | 15.4px | normal | `--text-caption-strong` |
| body-sm | 12px | 16.8px | normal | `--text-body-sm` |
| body | 13px | 19.5px | -0.13px | `--text-body` |
| body-md | 14px | 21px | -0.182px | `--text-body-md` |
| subheading | 15px | 24px | -0.165px | `--text-subheading` |
| subheading-lg | 16px | 24px | normal | `--text-subheading-lg` |
| label | 17px | 27.2px | normal | `--text-label` |
| heading-sm | 20px | 26.6px | -0.24px | `--text-heading-sm` |
| heading | 24px | 31.92px | -0.288px | `--text-heading` |
| heading-lg | 32px | 36px | -0.704px | `--text-heading-lg` |
| display | 48px | 48px | -1.056px | `--text-display` |
| display-lg | 64px | 64px | -1.408px | `--text-display-lg` |
| hero | 72px | 72px | -1.584px | `--text-hero` |

Roles map by ascending size, not DOM tag — the 13px body level (-0.13px tracking, weight 400) is the reading default, while the 590-weight 16px and 24px levels are the heading voices. Tracking scales with size: it is barely there at body and reaches -1.584px at the 72px hero, so large type reads as compressed rather than loose.

## Tokens — Spacing & Shapes

**Base unit:** 4px
**Density:** spacious

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
| 36 | 36px | `--spacing-36` |
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |
| 56 | 56px | `--spacing-56` |
| 60 | 60px | `--spacing-60` |
| 64 | 64px | `--spacing-64` |
| 68 | 68px | `--spacing-68` |
| 72 | 72px | `--spacing-72` |
| 80 | 80px | `--spacing-80` |
| 96 | 96px | `--spacing-96` |
| 128 | 128px | `--spacing-128` |

### Border Radius

| Element | Value |
|---------|-------|
| a | 4px |
| a | 6px |
| span | 2px |
| div | 50% |
| div | 12px |
| div | 8px |
| div | 12px 12px 0px 0px |
| div | 22px |
| button | 9999px |
| span | 2px 0px 0px 2px |
| span | 0px 2px 2px 0px |
| div | 16px |
| div | 4px 0px 0px 4px |
| div | 7px |
| div | 0px 4px 4px 0px |
| div | 20px |
| button | 5px |
| div | 400px |
| div | 1px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| 1 | `rgba(8, 9, 10, 0.6) 0px 4px 32px 0px` | `--shadow-1` |
| 2 | `rgba(0, 0, 0, 0.2) 0px 4px 24px 0px` | `--shadow-2` |
| 3 | `rgba(0, 0, 0, 0.2) 0px 0px 12px 0px inset` | `--shadow-3` |
| 4 | `rgba(0, 0, 0, 0.4) 0px 2px 4px 0px` | `--shadow-4` |
| 5 | `rgba(0, 0, 0, 0) 0px 8px 2px 0px, rgba(0, 0, 0, 0.01) 0px 5px 2px 0px, rgba(0, 0, 0, 0.04) 0px 3px 2px 0px, rgba(0, 0, 0, 0.07) 0px 1px 1px 0px, rgba(0, 0, 0, 0.08) 0px 0px 1px 0px` | `--shadow-5` |
| 6 | `rgba(94, 106, 210, 0.03) 0px 0px 0px 7.10205px` | `--shadow-6` |
| 7 | `rgba(0, 0, 0, 0.1) 0px 0px 0px 2px` | `--shadow-7` |
| 8 | `rgba(0, 0, 0, 0.2) 0px 0px 0px 1px` | `--shadow-8` |
| 9 | `rgb(35, 37, 42) 0px 0px 0px 1px inset` | `--shadow-9` |
| 10 | `rgba(0, 0, 0, 0.03) 0px 1.2px 0px 0px` | `--shadow-10` |
| 11 | `rgba(0, 0, 0, 0.4) 0px 1px 0px 0px` | `--shadow-11` |
| 12 | `rgba(8, 9, 10, 0.1) 0px 0px 0px 1px, rgba(8, 9, 10, 0.4) 0px 0px 64px 0px` | `--shadow-12` |
| 13 | `rgb(35, 37, 42) 1px 0px 0px 0px inset` | `--shadow-13` |
| 14 | `rgba(0, 0, 0, 0.33) 0px 0px 0px 1px` | `--shadow-14` |
| 15 | `rgba(94, 106, 210, 0.094) 0px 0px 0px 0.695475px` | `--shadow-15` |
| 16 | `rgba(255, 255, 255, 0.03) 0px 0px 0px 1px inset, rgba(255, 255, 255, 0.04) 0px 1px 0px 0px inset, rgba(0, 0, 0, 0.6) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 4px 4px 0px` | `--shadow-16` |

### Layout
- **Page max-width:** 100%

## Components

### Primary CTA
**Role:** The "Get started" / "Contact sales" action in the navigation and hero.

Background `rgba(255,255,255,0.05)`, text Snow (`#f7f8f8`), Inter Variable 510 at 13px, border-radius 4px, no padding inset. The fill is a layered inset-and-border shadow stack — `rgba(255,255,255,0.03) 0px 0px 0px 1px inset, rgba(255,255,255,0.04) 0px 1px 0px 0px inset, rgba(0,0,0,0.6) 0px 0px 0px 1px, rgba(0,0,0,0.1) 0px 4px 4px 0px` (token `--shadow-16`) — so the button reads as raised glass rather than a solid colour. Transition: background 0.1s.

### Ghost Button
**Role:** Low-emphasis navigation action, the most common button on the page.

Background transparent, text `#ffffff`, Inter Variable 400 at 13.3333px, border-radius 4px, horizontal padding 4px, no border or shadow. Transition: background 0.16s cubic-bezier(0.25, 0.46, 0.45, 0.94). It carries no fill until interaction — the affordance is the label, not a box.

### Secondary Button
**Role:** Muted secondary action, Slate label on a faint overlay.

Background `rgba(255,255,255,0.05)`, text Slate (`#62666d`), Inter Variable 400 at 13.3333px, border-radius 2px, 1px solid `rgba(255,255,255,0.05)` border, shadow `rgba(0,0,0,0.03) 0px 1.2px 0px 0px` (token `--shadow-10`). Transition: all. The 2px radius is the tightest corner in the system — controls are squarer than containers.

### Ghost Link
**Role:** Primary navigation and content links ("Product", "Resources").

Background transparent, text Snow (`#f7f8f8`), Inter Variable 400 at 16px, border-radius 6px, horizontal padding 8px, no border. Transition: all. The 6px radius gives links a tap target even though the fill is invisible at rest.

### Card
**Role:** Content panels — feed items, agent output, embedded code.

Background `rgba(255,255,255,0.01)` — a 1% white wash on the near-black canvas — text Snow (`#f7f8f8`), Inter Variable 400 at 16px, border-radius 6px, padding 12px 20px 16px 15px, 1px solid `rgba(255,255,255,0.08)` border, shadow `rgba(0,0,0,0.2) 0px 0px 0px 1px` (token `--shadow-8`). The card is defined by its hairline border and one-pixel ring shadow, not by fill.

### Input
**Role:** Form and code-entry fields.

Background `rgba(255,255,255,0.02)`, text Light Azure (`#d0d6e0`), Inter Variable 400 at 13.3333px, border-radius 6px, padding 12px 14px, 1px solid `rgba(255,255,255,0.08)` border, shadow `rgba(0,0,0,0.2) 0px 0px 0px 1px` (token `--shadow-8`). Transition: all. Shares the card's border-and-ring construction one shade lighter on the fill.

### Badge
**Role:** Status pill — the one place the brand indigo fills a shape.

Background Azure 3 (`#5e6ad2`), text Snow (`#f7f8f8`), Inter Variable 400 at 16px, border-radius 9999px (full pill), horizontal padding 3px. Transition: background-color 0.15s. This is the only component with a solid chromatic fill; everywhere else colour is a border or a near-transparent overlay.

### Footer Bar
**Role:** Bottom navigation strip with the product menu.

Background Ink 2 (`#08090a`), text Snow (`#f7f8f8`), Inter Variable 400 at 16px, border-radius 0px, top border 1px solid `rgb(35,37,42)`. Transition: all. The footer is the one surface painted in a solid near-black rather than built from an overlay.

## Do's and Don'ts

### Do
- Use `#08090a` (Ink 2) as the canvas and `#f7f8f8` (Snow) for text — the 19.74:1 pairing is the system's spine.
- Build buttons and cards from near-transparent white overlays (`rgba(255,255,255,0.01)` for cards through `0.05` for buttons), not solid fills.
- Use Azure 3 (`#5e6ad2`) as the single brand accent — badge fills and icon highlights only.
- Reach for the inset-plus-ring shadow stack (`--shadow-16`) to make a control read as raised glass instead of a flat block.
- Keep the 2px button radius and 6px card/link radius distinct — controls are squarer than containers.
- Step grays from Snow through Steel (`#8a8f98`) and Slate (`#62666d`) to the Ink near-blacks for borders and secondary text; reserve every other hue for accents.

### Don't
- Don't give buttons a solid background colour — the system is built on overlays at 0.01–0.05 white opacity; a solid fill breaks the glass language.
- Don't promote Azure 3 (`#5e6ad2`) to a text or border colour — it is the badge-and-icon accent, not a structural ink.
- Don't drop the 1px ring shadow (`--shadow-8`) from cards and inputs — the hairline ring is what separates the panel from the canvas, since the fill is only 1–2% white.
- Don't set headings below weight 590 — 400 is body, 510 is UI, and 590 is the heading voice; mixing them flattens the hierarchy.
- Don't rely on a focus ring for keyboard affordance — focus styles were not captured in this system, so do not assume a visible indicator exists.
- Don't use Berkeley Mono outside code — it marks machine text; using it for prose erases that signal.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas | `#f7f8f8` | Full-bleed page background |
| 1 | Linen | `#e2e4e7` | Surface / panel |
| 2 | Azure 2 | `#6366f1` | Surface / panel |
| 3 | Teal | `#55cdff` | Surface / panel |

The measured product surface inverts this light listing: the canvas the components actually live on is Ink 2 (`#08090a`), with panels emerging as 1–2% white overlays rather than painted fills. The lighter tokens above appear as section washes and accent panels, not as the primary reading background.

## Elevation

Depth is real here — 16 shadow tokens carry it. The system runs two distinct shadow families. The first is the **ring**: zero-blur, near-zero-offset shadows that act as hairline borders — `rgba(0,0,0,0.2) 0px 0px 0px 1px` (`--shadow-8`) rings every card and input, `rgb(35,37,42) 0px 0px 0px 1px inset` (`--shadow-9`) lines panels from within, and `rgba(94,106,210,0.094) 0px 0px 0px 0.695475px` (`--shadow-15`) tints a ring with the brand indigo. The second is **ambient lift**: soft, large-radius drops like `rgba(8,9,10,0.6) 0px 4px 32px 0px` (`--shadow-1`) and `rgba(8,9,10,0.1) 0px 0px 0px 1px, rgba(8,9,10,0.4) 0px 0px 64px 0px` (`--shadow-12`) that float modals and menus off the canvas. The signature stack is `--shadow-16`, which combines two inset highlights (white at 0.03 and 0.04) with an outer dark ring and a 4px drop, so a button glows from within while sitting on the page. Individual layer opacities stay low — most at 0.2 or under — so the depth reads as light, not theatre.

## Imagery

No structural imagery data was extracted beyond the icon and gradient signals. The system carries 615 icons at fixed colour, drawn at a 14px and 16px size scale — a dense, uniform icon set rather than illustration. 13 gradient tokens exist as decorative surface washes — tonal section treatments built from the indigo and teal accents, not a depth mechanism (depth is the shadow stack). Product surfaces lean on UI chrome, code blocks, and feed cards rather than photography, so the visual texture is type, border, and icon.

## Layout

Full-width fluid layout: page max-width is 100% with full-width content alignment. Section spacing is spacious and irregular, sampled from 48px and 56px for tight gaps up through 96px, 128px, and 200px+ for major breaks — whitespace frames each block as a self-contained slab. Column grids range from single column up through 2, 3, 4, 5, 6, and a 12-column grid for dense feature sections. Breakpoints fire at max-width 1280px, 1024px, 640px, and 600px, with dedicated `(hover:none) and (pointer:coarse)` and `(prefers-reduced-motion)` queries — the system adapts to coarse pointers and honours reduced-motion. The base spacing unit is 4px, and the scale runs 4px through 128px in even steps.

## Agent Prompt Guide

### Quick Color Reference
- background (canvas): `#08090a` (Ink 2)
- text (primary): `#f7f8f8` (Snow)
- text (secondary): `#62666d` (Slate)
- border / hairline: `rgba(255,255,255,0.08)`
- accent / brand: `#5e6ad2` (Azure 3) — badges and icon highlights only

### Example Component Prompts

1. Create a primary CTA button on a near-black canvas: background `rgba(255,255,255,0.05)`, text `#f7f8f8`, Inter at 13px weight 510, border-radius 4px. Apply the raised-glass shadow stack `rgba(255,255,255,0.03) 0px 0px 0px 1px inset, rgba(255,255,255,0.04) 0px 1px 0px 0px inset, rgba(0,0,0,0.6) 0px 0px 0px 1px, rgba(0,0,0,0.1) 0px 4px 4px 0px`. Transition background 0.1s. Label: "Get started".

2. Create a content card: background `rgba(255,255,255,0.01)`, text `#f7f8f8`, Inter at 16px weight 400, border-radius 6px, padding 12px 20px 16px 15px, 1px solid `rgba(255,255,255,0.08)` border, shadow `rgba(0,0,0,0.2) 0px 0px 0px 1px`. No solid fill — the hairline border and 1px ring define it.

3. Create a status badge: background `#5e6ad2`, text `#f7f8f8`, Inter at 16px weight 400, border-radius 9999px (full pill), horizontal padding 3px, transition background-color 0.15s. This is the only solid-colour component.

4. Create a ghost navigation link: background transparent, text `#f7f8f8`, Inter at 16px weight 400, border-radius 6px, horizontal padding 8px, no border, transition all. No fill at rest — the label is the affordance.

5. Create a form input: background `rgba(255,255,255,0.02)`, text `#d0d6e0`, Inter at 13.3333px weight 400, border-radius 6px, padding 12px 14px, 1px solid `rgba(255,255,255,0.08)` border, shadow `rgba(0,0,0,0.2) 0px 0px 0px 1px`, transition all.

## Similar Brands

- **Vercel** — Near-black product canvas, achromatic gray scale with a single accent, and shadow-as-border hairlines built from near-transparent overlays.
- **Raycast** — Dark command-surface UI, indigo accent rationed to one signal, dense fixed-colour icon set over photography.
- **Stripe** — Inter-family discipline, three-weight type system, and chromatic restraint where one hue is reserved for interactive signals.
- **Resend** — Near-black canvas with a single saturated indigo accent and overlay-built panels rather than painted fills.
- **Cron** — Restrained dark product surface, geometric sans across every element, and elevation carried by tinted ring shadows.

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-snow: #f7f8f8;
  --color-slate: #62666d;
  --color-light-azure: #d0d6e0;
  --color-steel: #8a8f98;
  --color-linen: #e2e4e7;
  --color-light-magenta: #f79ce0;
  --color-obsidian: #202122;
  --color-teal: #55cdff;
  --color-ink: #000000;
  --color-ink-2: #08090a;
  --color-ember: #ffc47c;
  --color-light-azure-2: #8fa4ff;
  --color-sage: #89d196;
  --color-voltage: #00ff05;
  --color-graphite: #383b3f;
  --color-crimson: #d6303d;
  --color-voltage-2: #008d2c;
  --color-crimson-2: #eb5757;
  --color-ink-3: #0f1011;
  --color-crimson-3: #ff0000;
  --color-azure: #6d78d5;
  --color-voltage-3: #27a644;
  --color-azure-2: #6366f1;
  --color-obsidian-2: #323334;
  --color-teal-2: #02b8cc;
  --color-azure-3: #5e6ad2;
  --color-indigo: #8b5cf6;
  --color-obsidian-3: #28282c;
  --color-light-azure-3: #b2d5ff;
  --color-light-indigo: #dfd1ff;
  --color-steel-2: #9c9da1;
  --color-obsidian-4: #161718;
  --color-teal-3: #10b981;
  --color-deep-teal: #0f3338;
  --color-deep-crimson: #422222;
  --color-citron: #e4f222;
  --color-slate-2: #5b5c5a;
  --color-crimson-4: #e3484e;
  --color-ember-2: #ff7236;
  --color-azure-4: #4354b8;
  --color-ember-3: #e5591d;
  --color-slate-3: #808080;
  --color-graphite-2: #505050;
  /* Typography — Scale */
  --text-t0: 10px;
  --leading-t0: 15px;
  --text-t1: 10px;
  --leading-t1: 15px;
  --text-t2: 11px;
  --leading-t2: 15.4px;
  --text-t3: 12px;
  --leading-t3: 16.8px;
  --text-t4: 12px;
  --leading-t4: 16.8px;
  --text-t5: 12px;
  --leading-t5: 16.8px;
  --text-t6: 12px;
  --leading-t6: 16.8px;
  --text-t7: 13px;
  --leading-t7: 19.5px;
  --text-t8: 13px;
  --leading-t8: normal;
  --text-t9: 13px;
  --leading-t9: 19.5px;
  --text-t10: 14px;
  --leading-t10: 21px;
  --text-t11: 14px;
  --leading-t11: 21px;
  --text-t12: 14px;
  --leading-t12: 21px;
  --text-t13: 14px;
  --leading-t13: 24px;
  --text-t14: 15px;
  --leading-t14: 24px;
  --text-t15: 15px;
  --leading-t15: 24px;
  --text-t16: 15px;
  --leading-t16: 24px;
  --text-t17: 15px;
  --leading-t17: 22px;
  --text-t18: 16px;
  --leading-t18: 24px;
  --text-h4: 16px;
  --leading-h4: 24px;
  --text-t20: 16px;
  --leading-t20: 24px;
  --text-t21: 17px;
  --leading-t21: 27.2px;
  --text-t22: 17px;
  --leading-t22: 27.2px;
  --text-h3: 20px;
  --leading-h3: 26.6px;
  --text-t24: 24px;
  --leading-t24: 31.92px;
  --text-h3: 24px;
  --leading-h3: 31.92px;
  --text-t26: 24px;
  --leading-t26: 31.92px;
  --text-t27: 32px;
  --leading-t27: 36px;
  --text-h2: 48px;
  --leading-h2: 48px;
  --text-h1: 64px;
  --leading-h1: 64px;
  --text-h2: 72px;
  --leading-h2: 72px;
  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-28: 28px;
  --spacing-32: 32px;
  --spacing-36: 36px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-56: 56px;
  --spacing-60: 60px;
  --spacing-64: 64px;
  --spacing-68: 68px;
  --spacing-72: 72px;
  --spacing-80: 80px;
  --spacing-96: 96px;
  --spacing-128: 128px;
  /* Layout */
  --page-max-width: 100%;
  /* Border Radius */
  --radius-a: 4px;
  --radius-a: 6px;
  --radius-span: 2px;
  --radius-div: 50%;
  --radius-div: 12px;
  --radius-div: 8px;
  --radius-div: 12px 12px 0px 0px;
  --radius-div: 22px;
  --radius-button: 9999px;
  --radius-span: 2px 0px 0px 2px;
  --radius-span: 0px 2px 2px 0px;
  --radius-div: 16px;
  --radius-div: 4px 0px 0px 4px;
  --radius-div: 7px;
  --radius-div: 0px 4px 4px 0px;
  --radius-div: 20px;
  --radius-button: 5px;
  --radius-div: 400px;
  --radius-div: 1px;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-snow: #f7f8f8;
  --color-slate: #62666d;
  --color-light-azure: #d0d6e0;
  --color-steel: #8a8f98;
  --color-linen: #e2e4e7;
  --color-light-magenta: #f79ce0;
  --color-obsidian: #202122;
  --color-teal: #55cdff;
  --color-ink: #000000;
  --color-ink-2: #08090a;
  --color-ember: #ffc47c;
  --color-light-azure-2: #8fa4ff;
  --color-sage: #89d196;
  --color-voltage: #00ff05;
  --color-graphite: #383b3f;
  --color-crimson: #d6303d;
  --color-voltage-2: #008d2c;
  --color-crimson-2: #eb5757;
  --color-ink-3: #0f1011;
  --color-crimson-3: #ff0000;
  --color-azure: #6d78d5;
  --color-voltage-3: #27a644;
  --color-azure-2: #6366f1;
  --color-obsidian-2: #323334;
  --color-teal-2: #02b8cc;
  --color-azure-3: #5e6ad2;
  --color-indigo: #8b5cf6;
  --color-obsidian-3: #28282c;
  --color-light-azure-3: #b2d5ff;
  --color-light-indigo: #dfd1ff;
  --color-steel-2: #9c9da1;
  --color-obsidian-4: #161718;
  --color-teal-3: #10b981;
  --color-deep-teal: #0f3338;
  --color-deep-crimson: #422222;
  --color-citron: #e4f222;
  --color-slate-2: #5b5c5a;
  --color-crimson-4: #e3484e;
  --color-ember-2: #ff7236;
  --color-azure-4: #4354b8;
  --color-ember-3: #e5591d;
  --color-slate-3: #808080;
  --color-graphite-2: #505050;
  /* Typography — Scale */
  --text-t0: 10px;
  --leading-t0: 15px;
  --text-t1: 10px;
  --leading-t1: 15px;
  --text-t2: 11px;
  --leading-t2: 15.4px;
  --text-t3: 12px;
  --leading-t3: 16.8px;
  --text-t4: 12px;
  --leading-t4: 16.8px;
  --text-t5: 12px;
  --leading-t5: 16.8px;
  --text-t6: 12px;
  --leading-t6: 16.8px;
  --text-t7: 13px;
  --leading-t7: 19.5px;
  --text-t8: 13px;
  --leading-t8: normal;
  --text-t9: 13px;
  --leading-t9: 19.5px;
  --text-t10: 14px;
  --leading-t10: 21px;
  --text-t11: 14px;
  --leading-t11: 21px;
  --text-t12: 14px;
  --leading-t12: 21px;
  --text-t13: 14px;
  --leading-t13: 24px;
  --text-t14: 15px;
  --leading-t14: 24px;
  --text-t15: 15px;
  --leading-t15: 24px;
  --text-t16: 15px;
  --leading-t16: 24px;
  --text-t17: 15px;
  --leading-t17: 22px;
  --text-t18: 16px;
  --leading-t18: 24px;
  --text-h4: 16px;
  --leading-h4: 24px;
  --text-t20: 16px;
  --leading-t20: 24px;
  --text-t21: 17px;
  --leading-t21: 27.2px;
  --text-t22: 17px;
  --leading-t22: 27.2px;
  --text-h3: 20px;
  --leading-h3: 26.6px;
  --text-t24: 24px;
  --leading-t24: 31.92px;
  --text-h3: 24px;
  --leading-h3: 31.92px;
  --text-t26: 24px;
  --leading-t26: 31.92px;
  --text-t27: 32px;
  --leading-t27: 36px;
  --text-h2: 48px;
  --leading-h2: 48px;
  --text-h1: 64px;
  --leading-h1: 64px;
  --text-h2: 72px;
  --leading-h2: 72px;
  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-28: 28px;
  --spacing-32: 32px;
  --spacing-36: 36px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-56: 56px;
  --spacing-60: 60px;
  --spacing-64: 64px;
  --spacing-68: 68px;
  --spacing-72: 72px;
  --spacing-80: 80px;
  --spacing-96: 96px;
  --spacing-128: 128px;
  /* Border Radius */
  --radius-a: 4px;
  --radius-a: 6px;
  --radius-span: 2px;
  --radius-div: 50%;
  --radius-div: 12px;
  --radius-div: 8px;
  --radius-div: 12px 12px 0px 0px;
  --radius-div: 22px;
  --radius-button: 9999px;
  --radius-span: 2px 0px 0px 2px;
  --radius-span: 0px 2px 2px 0px;
  --radius-div: 16px;
  --radius-div: 4px 0px 0px 4px;
  --radius-div: 7px;
  --radius-div: 0px 4px 4px 0px;
  --radius-div: 20px;
  --radius-button: 5px;
  --radius-div: 400px;
  --radius-div: 1px;
}
```
