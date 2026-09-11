---
title: "Diagram Style Guide"
description: "The single source of truth for diagram colors, typography, stroke, radius, and spacing tokens, plus how to customize the skin."
trigger_phrases:
  - "style guide tokens"
  - "diagram semantic roles"
  - "paper ink accent muted tokens"
  - "node type treatment"
  - "typography font stack"
  - "customize diagram skin"
  - "terminal skin palette"
importance_tier: important
contextType: implementation
version: 1.2.0.13
---

# Diagram Style Guide

A semantic token reference for diagram colors, typography, strokes, radii, and spacing.

---

## 1. OVERVIEW

### Core Principle

Change this file and every diagram the skill produces inherits the new skin without touching any type-specific logic. The default skin is a cool editorial palette — white-smoke paper, jet-black ink, atomic-tangerine accent, blue-slate muted — designed to look good out of the box. Swap these values (or run [`onboarding.md`](onboarding.md)) to apply a brand.

### Tokens

#### Semantic roles

Every token is referred to by **semantic role**, not by its hex value. Type references (`type-*.md`) and SKILL.md say `accent`, not `#eb6c36`.

| Role | Purpose | Default (light) | Default (dark) |
|---|---|---|---|
| `paper` | Page background, default node fill | `#f5f5f5` (white-smoke) | `#2d3142` (jet-black) |
| `paper-2` | Diagram container bg, secondary fill | `#ececec` | `#393e53` |
| `ink` | Primary text, primary stroke | `#2d3142` (jet-black) | `#f5f5f5` (white-smoke) |
| `muted` | Secondary text, default arrow stroke | `#4f5d75` (blue-slate) | `#bfc0c0` (silver) |
| `soft` | Sublabels, boundary labels | `#7a8399` | `#8e98ac` |
| `rule` | Hairline borders | `rgba(45,49,66,0.12)` | `rgba(245,245,245,0.12)` |
| `rule-solid` | Stronger borders, baselines | `rgba(79,93,117,0.25)` (muted at 0.25) | `rgba(191,192,192,0.25)` |
| `accent` | Focal / 1–2 max per diagram | `#eb6c36` (atomic-tangerine) | `#f08a59` |
| `accent-tint` | Fill for accent-bordered boxes | `rgba(235,108,54,0.08)` | `rgba(240,138,89,0.10)` |
| `link` | HTTP/API calls, external arrows | `#2e5aa8` | `#6a95d8` |

> **Brand palette source:** this skin maps to a five-color brand palette — `jet-black #2d3142`, `silver #bfc0c0`, `white-smoke #f5f5f5`, `atomic-tangerine #eb6c36`, `blue-slate #4f5d75`. The `soft`, `rule`, and `link` tokens are derived (lighter slate, ink-at-opacity, and a saturated variant in the blue-slate hue family) to cover roles the brand palette doesn't name directly.

> **Note:** The example files under `assets/` carry the current role values above; what they do not yet do is read them from one source. Thirty-two of thirty-four type their hex values inline, which a later phase repaints from [derivation-record.md](derivation-record.md).

#### Inversion rule (light → dark)

There is no formula. The dark values are hand-picked: the accent moves from `#eb6c36` to `#f08a59` by hue, saturation and lightness together, so no single rule reproduces it, and the warm `rgba(28,25,23, X)` spelling this section once described appears in none of the examples. Every value, its kind and its origin are recorded in [derivation-record.md](derivation-record.md); a value derived by a rule (ink at an alpha, accent at an alpha) is marked as such there and re-derived by the corpus check.

#### Series palette (multi-series charts and typed-chip vocabularies)

A small set of desaturated, editorial-tone colors for two cases: a chart type that must distinguish overlapping entities (**radar**, **line**), and a diagram whose chips name a closed vocabulary a reader has to tell apart (**data-flow**, **process**, **dp-integration**, **it-state**). The "1-focal" rule still holds — `accent` is reserved for the focal series; the palette below covers the rest.

| Token | Light | Dark | Notes |
|---|---|---|---|
| `series-1` | `#7c8f6f` (sage) | `#9caf8f` | Non-focal series |
| `series-2` | `#5c7899` (dusty-blue) | `#82a0c0` | Non-focal series |
| `series-3` | `#b8915a` (mustard) | `#d3ad7a` | Non-focal series |
| `series-4` | `#9c6b50` (rust-brown) | `#b88670` | Non-focal series |
| `series-5` | `#6e6479` (slate) | `#8d8298` | Non-focal series |

Fills sit at `0.18` opacity light, `0.22` dark; strokes use the full color. A chip that carries a label is a mark with text on it, so its fill clears the `text-on-mark` gate at 4.5:1 against the label colour; all five of these do. **Everything else uses muted-ink variants** — architecture, swimlane and the rest. The series palette is opt-in where overlapping shapes or a typed vocabulary demand distinguishable color, not a license to add color elsewhere.

#### Terminal skin (opt-in alternate)

A self-contained palette for the terminal-window primitive (see [primitive-terminal.md](../primitives/primitive-terminal.md)) — a CLI-chrome register for dev-tool posts and technical social cards. It does not replace the default skin above and isn't affected by onboarding; it's a second, fixed skin you opt into per-diagram.

| Token | Hex | Purpose |
|---|---|---|
| `terminal-page` | `#0a0a0a` | Page background behind the window |
| `terminal-paper` | `#141414` | Window body, node fill |
| `terminal-bar` | `#1b1b1b` | Titlebar strip |
| `terminal-border` | `#2b2b2b` | Window border, hairlines |
| `terminal-ink` | `#f5f5f5` | Primary text, primary stroke (same white-smoke as default `ink`) |
| `terminal-muted` | `#9a9a9a` | Secondary text, sublabels, ring stroke |
| `terminal-soft` | `#5c5c5c` | Tertiary — inactive dots, spokes |
| `terminal-accent` | `#ff5a36` | The one accent — focal station, prompt sign, active dot |
| `terminal-accent-tint` | `rgba(255,90,54,0.12)` | Fill for accent-bordered boxes |

**1-accent rule still holds.** Everything that isn't `terminal-ink` or `terminal-muted`/`terminal-soft` should be `terminal-accent` — never introduce a second hue.

---

## 2. TYPOGRAPHY

| Role | Family | Size | Weight | Usage |
|---|---|---|---|---|
| `title` | Instrument Serif | 1.75rem | 400 | Page H1 |
| `node-name` | Geist (sans) | 12px | 600 | Human-readable labels |
| `sublabel` | Geist Mono | 9px | 400 | Port, protocol, URL, field type |
| `eyebrow` | Geist Mono | 7–8px | 500, tracked 0.18em, uppercase | Type tags, axis labels |
| `arrow-label` | Geist Mono | 8px | 400, tracked 0.06em | Arrow annotations |
| `callout` | Instrument Serif *italic* | 14px | 400 | Editorial asides only |

### Font stack

```html
<link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Geist:wght@400;500;600&family=Geist+Mono:wght@400;500;600&display=swap" rel="stylesheet">
```

**Fallback chains ship already.** Every template root declares them — `--font-sans: 'Geist', system-ui, sans-serif;` · `--font-serif: 'Instrument Serif', serif;` · `--font-mono: 'Geist Mono', ui-monospace, monospace;` (`assets/diagrams/starter-light.html` and its three siblings) — and every inline SVG `font-family` resolves to one of those chains. A file opened with no network therefore renders in the fallback face, not in a browser default. The Google Fonts link above is the one remote resource a diagram may carry; the corpus check allowlists that host and nothing else.

**Load-bearing rule:** Mono is for *technical* content (ports, commands, URLs, field types). Names go in Geist sans. Page title is Instrument Serif. Italic Instrument Serif is reserved for annotation callouts (see [primitive-annotation.md](../primitives/primitive-annotation.md)). **Never JetBrains Mono** as a blanket "dev" font.

---

## 3. STROKE, RADIUS, SPACING

| Token | Value | Use |
|---|---|---|
| `stroke-thin` | `0.8` | Tag-box outlines, leaf nodes |
| `stroke-default` | `1` | Most strokes |
| `stroke-strong` | `1.2` | Emphasis strokes |
| `radius-sm` | `4` | Small tags |
| `radius-md` | `6` | Node boxes |
| `radius-lg` | `8` | Containers, rings |
| `grid` | `4` | Every coord, size, and gap is divisible by 4 (hard rule) |

---

## 4. NODE TYPE → TREATMENT

Semantic role combinations — reference these by name in type specs.

| Type | Fill | Stroke |
|---|---|---|
| `focal` (1–2 max) | `accent-tint` | `accent` |
| `backend` | `#ffffff` (white) | `ink` |
| `store` | `ink @ 0.05` | `muted` |
| `external` | `ink @ 0.03` | `ink @ 0.30` |
| `input` | `muted @ 0.10` | `soft` |
| `optional` | `ink @ 0.02` | `ink @ 0.20` dashed `4,3` |
| `security` | `accent @ 0.05` | `accent @ 0.50` dashed `4,4` |

The stroke is what separates these types, not the fill. Every fill above except `focal` and `backend`
is ink or muted at a low alpha, so flattened against the paper they land within about 4% of each
other — measurably one grey. That is deliberate: the fill says "this is a node", the stroke says which
kind, and a drawing where five node types carried five distinguishable fills would spend all of its
colour on the chrome.

It follows that a legend swatch keying these types shows near-identical fills and distinct strokes, and
that is faithful rather than a defect. A reviewer measuring only the fills will call them one grey and
be right about the measurement and wrong about the legend. What a swatch must match is the treatment
the drawing actually uses to tell the type apart, which the corpus check holds for dash patterns.

---

## 5. CUSTOMIZING THE SKIN

Three options:

1. **Run onboarding** — see [`onboarding.md`](onboarding.md). Drop a URL; the skill extracts the palette + fonts and rewrites this file.
2. **Edit by hand** — change the hex values in the tables above. Run the pre-output taste gate afterward to verify the accent still reads as "focal" against the new paper color.
3. **Brand handoff** — paste your existing design-token JSON into a new section here and map its tokens to the semantic roles above.

### Constraints (don't break these)

- **Contrast**: `ink` must hit WCAG AA on `paper`. `muted` must hit AA on `paper` for 11px+ text.
- **One accent**: pick one color for `accent`. Two accents erases the focal signal.
- **No rainbow palette**: if your brand ships 8 colors, pick 3 (paper, ink, accent). The rest become `muted` variants.
- **Serif + sans + mono**: three families, not more. If brand typography is all sans, keep Instrument Serif for `title` and `callout` anyway — the contrast is load-bearing.
- **Paper is warm-neutral, not pure white**: pure white turns the design sterile. Pick a cream, bone, or light grey with a hint of warmth.
- **Dot pattern is the default ground**: the 22×22 dot pattern carries the paper, and 26 of the 34 worked forms use it. Drop it for a clean `paper` fill when the drawing is dense enough that the pattern competes with it — the eight that do are the security matrix, both import examples, the IT current-state, medallion, org chart, consultant quadrant and venn, each of them a figure whose own fills already cover most of the page. The pattern sits at ~10% opacity of `ink` on `paper`: visible but quiet.
- **Container is clean by default**: the diagram sits directly on the page paper, no secondary container background or border. A framed variant (`paper-2` bg + `rule` border + 8px radius + padding) is available as an opt-in for card-heavy layouts, but don't reach for it by default — the extra chrome fights the figure.
