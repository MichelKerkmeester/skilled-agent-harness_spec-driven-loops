---
title: DESIGN.md Style Reference Format
version: 1.0.0.4
description: "The authoritative Style Reference section specification: named colour tokens, semantic type scale, named components, conditional measured Motion, Surfaces, Elevation, Agent Prompt Guide, Similar Brands, and copy-paste Quick Start — every value verbatim from tokens.json."
trigger_phrases:
  - design md format specification
  - style reference schema
  - design md section order
  - named colour tokens
  - quick start css tailwind
  - measured motion section
  - agent prompt guide section
  - similar brands section
importance_tier: important
contextType: implementation
---

# DESIGN.md Style Reference Format

> The v3 schema produces a **Style Reference**: a named, role-driven, ship-ready design
> system handoff — not an extraction report. It matches the reference house style:
> confident and grounded, with copy-paste CSS + Tailwind. Every value is still verbatim
> from `tokens.json`; what changes from v2 is the voice (named + restrained, not
> mechanical + hedged) and the section set.

---

## 0. CARDINAL RULES (unchanged from the fidelity contract)

1. Every hex, px, weight, radius, duration, and shadow is copied **verbatim** from
   `tokens.json`. Never estimate, round, or invent a value.
2. **No false systems.** Do not assert a relationship, cause, or system the data
   contradicts: no "gradient-as-depth" when there are 0 shadow tokens, no "focus is
   consistent" when `focusIndicator.consistent` is false. This guard is absolute.
3. **Confident but grounded.** DO assign evocative semantic names, state roles plainly,
   and infer Similar Brands — these are grounded inferences, not fabricated data. The
   line is: name and characterize what IS there; never invent what is NOT.
4. **No mechanical noise.** Never print raw frequency dumps ("border 9685, text 4258"),
   the extractor's internal CSS var names (`--_color-primitives---neutral--1400`), or
   placeholder labels ("div", "Variant-1"). Frequency DECIDES prominence/role; it is not
   displayed.
5. **Restraint over purple prose.** Characterize in one grounded clause, not a paragraph
   of metaphor. "A warm-tinted near-black" beats "letters like hull plates."
6. A section with no backing data is **omitted** (when conditional) or stamped
   `_No <X> data was extracted._` — never filled with invention.

---

## 1. FILE HEADER

```
# <Brand or Domain> — Style Reference
> <one-line evocative tagline — the design's essence in a phrase>

**Theme:** light | dark | mixed
```

- Brand name: from the page title / wordmark when available, else the domain.
- Tagline: a single grounded, evocative phrase (e.g. "Broadsheet financial broadside —
  the masthead itself is the design"). Characterizes; does not fabricate facts.
- Theme: `light` if the page background is light, `dark` if dark, `mixed` if it
  alternates full-bleed light and dark sections.

## 2. INTRO PARAGRAPH (unlabeled, directly under the header)

One paragraph, 4–6 sentences. Characterize the system's voice: canvas, the dominant
type move, how color is rationed, layout density, what carries the page. Every
characterizing claim must map to a real token (a hex, a size, a weight). Restrained, not
purple. No assumed audience ("targets captains and port agents") unless the page states
it.

## 3. `## Tokens — Colors`

A table, most-prominent first:

```
| Name | Value | Token | Role |
|------|-------|-------|------|
| Obsidian Ink | `#121613` | `--color-obsidian-ink` | Primary text, borders, image frames — a warm-tinted near-black |
```

- **Name:** evocative + grounded (hue + lightness + character). "Linen", "Obsidian Ink",
  "Voltage", "Sage", "Mist". Neutrals by lightness (Snow/Linen → Ink/Obsidian/Void);
  hued by family + character (Voltage/Azure/Ember). Be consistent within a doc.
- **Value:** 6-digit lowercase hex, verbatim. Gradients render their full
  `linear-gradient(...)` value.
- **Token:** `--color-<kebab-name>` derived from the Name. NEVER the extractor's internal
  var. (The Quick Start §16 re-uses these exact slugs.)
- **Role:** where it is used (grounded in the measured usage) + one characterizing
  clause. No frequency numbers. For a supporting accent, add a usage guard
  ("Do not promote it to the primary CTA color").
- L1/L2 colours in the main table. L3 in a `### Current Campaign Colors (Subject to
  change)` sub-table. L4 excluded entirely.

## 4. `## Tokens — Typography`

Per-font block, then a Type Scale table.

```
### <Font Family> — <role prose> · `--font-<slug>`
- **Substitute:** <closest open/system substitute>
- **Weights:** <comma list, verbatim>
- **Sizes:** <comma list, verbatim>
- **Line height:** <range or list, verbatim>
- **Letter spacing:** <per-size, verbatim; omit if all normal>
- **OpenType features:** `<value>` (omit if none)
- **Role:** <the role prose, repeated as the bullet>
```

Then:

```
### Type Scale
| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| body | 16px | 1.4 | -0.32px | `--text-body` |
| display | 140px | 0.9 | -1.4px | `--text-display` |
```

- Role names are **semantic** — `caption, body-sm, body, subheading, heading-sm,
  heading, heading-lg, display, hero` — mapped by size rank, NEVER the raw DOM tag
  ("div"). Map the extracted levels onto this scale by ascending size.
- Token: `--text-<role>`.

## 5. `## Tokens — Spacing & Shapes`

```
**Base unit:** <Npx>   (omit if no clear base)
**Density:** compact | comfortable | spacious

### Spacing Scale
| Name | Value | Token |
|------|-------|-------|
| 8 | 8px | `--spacing-8` |

### Border Radius
| Element | Value |
|---------|-------|
| buttons | 7px |
| cards | 14px |

### Shadows
| Name | Value | Token |
|------|-------|-------|
| lg | `<shadow value>` | `--shadow-lg` |
   (omit the whole Shadows block when 0 shadow tokens)

### Layout
- **Page max-width:** <value>
- **Section gap:** <value>
- **Card padding:** <value>
- **Element gap:** <value>
```

- Density: `spacious` if section gaps are large relative to content; `compact` if tight.
- Border Radius: map measured radii to element roles (buttons/cards/inputs/badges/etc.).

## 6. `## Components`

```
### <Named Component>
**Role:** <one line — what it is and where it's used>

<prose with EXACT values: background, text (color + size + family + weight), padding,
radius, border, hover/focus states, transition, and an example label or use.>
```

- Name components by function: Primary CTA, Secondary Button, Ghost Link, Nav Header,
  Card, Badge, Footer. NEVER "Variant-1" — if a variant cannot be characterized, fold it
  into the nearest named component or describe it by its distinguishing property
  ("a lighter green status variant").
- Only include states that were actually captured. Do not repeat an invisible "0px
  focus" line on every component — characterize it once where it matters (and flag it in
  Accessibility / Agent Guide if it is an a11y problem).

## 7. `## Do's and Don'ts`

`### Do` and `### Don't` bullet lists. Each bullet cites a concrete value and reads as an
instruction ("Use `#06458c` for all link colors", "Do not add `box-shadow` — there are
zero shadow tokens; any shadow is an invention").

## 8. `## Surfaces`

```
| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas | `#fefefe` | Full-bleed page background |
| 1 | Card | `#f8f8f8` | Card surfaces |
```

Derive levels from the background colours actually used, ordered base → elevated. If
cards share the canvas hex, say so ("same hex as canvas — cards are defined by radius +
padding, not fill").

## 9. `## Elevation`

Either a per-component shadow list, or — when there are 0 shadow tokens — a prose line
stating the system is flat and HOW depth is achieved instead (border, tonal contrast,
whitespace). This is the honest replacement for the old "gradient-as-depth" failure.

## 10. `## Imagery`

Prose: what imagery the site uses and its treatment (B&W, full-bleed, rounded, etc.),
grounded in what was observed. If no meaningful imagery signal was extracted, say so
plainly rather than inventing a visual language.

## 11. `## Layout`

Prose: max-width, hero structure, section rhythm, nav behavior, grid vs asymmetric —
grounded in the breakpoint/spacing/column data.

## 12. `## Motion`

This section is conditional and deterministic. Emit it only when the extracted
`MotionSystem.durationScale` contains at least one measured duration band. Words such as
"motion", "animation", or a duration in page copy never activate it.

```
## Motion

**Reduced-motion query:** detected | not detected

### Duration Scale

| Band | Duration |
|------|----------|
| small | `150ms` |

### Timing Functions

**Primary:** `ease-out`

**Observed:** `ease-out`, `linear`

### Keyframe Animations

| Name | Type | Duration | Properties |
|------|------|----------|------------|
| fade-in | entrance | `300ms` | opacity |
```

- Copy duration bands, timing functions, keyframe names/types/durations/properties, and
  reduced-motion detection directly from `tokens.json.motionSystem`.
- Omit Timing Functions or Keyframe Animations subsections when their measured arrays
  are empty. Never fill them from defaults or prose.
- The formatter emits this section into the locked pre-rendered block. The WRITE phase
  pastes it unchanged, and validation rejects any altered value.
- This measured section does not infer `motionCharacter`; that semantic handoff belongs
  to authored design decisions, not extracted evidence.

## 13. `## Agent Prompt Guide`

```
### Quick Color Reference
- background: <hex>
- text (primary): <hex>
- border: <hex>
- accent / primary action: <hex or "no distinct CTA color">

### Example Component Prompts
1. <fully-specified, copy-paste component prompt with every value inline>
... (3–5 total)
```

If no distinct CTA/action colour was observed, say "no distinct CTA color" — do not
invent one.

## 14. `## Similar Brands`

3–5 brands with a one-line WHY each, as **confident grounded inference** from the
observed system (palette discipline, type scale, layout rhythm). This section is
explicitly inferential and that is allowed — it characterizes the design's family, it
does not fabricate the site's own data.

## 15. `## Quick Start`

Two fenced code blocks, every value verbatim from tokens, slugs matching §3/§4/§5.

````
### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-<name>: <hex>;
  ...
  /* Typography — Font Families */
  --font-<slug>: '<family>', <fallback stack>;
  /* Typography — Scale */
  --text-<role>: <size>;
  --leading-<role>: <lh>;
  --tracking-<role>: <ls>;
  /* Typography — Weights */
  --font-weight-<name>: <weight>;
  /* Spacing */
  --spacing-<n>: <Npx>;
  /* Layout */
  --page-max-width: <value>;
  /* Border Radius */
  --radius-<name>: <value>;
  /* Shadows */   (omit if none)
  --shadow-<name>: <value>;
  /* Surfaces */
  --surface-<name>: <hex>;
}
```

### Tailwind v4

```css
@theme {
  /* same --color-*, --font-*, --text-*, --leading-*, --tracking-*, --spacing-*,
     --radius-*, --shadow-* tokens (no --surface-*, no --page-max-width) */
}
```
````

- Every `--color-*` slug and value MUST match a row in §3; every `--text-*`/`--spacing-*`
  MUST match §4/§5. A validator check (Quick-Start consistency) enforces this.
- This block is what makes the output ship-ready — it is not optional.

---

## Section presence

| Section | Required | Omit when |
|---|---|---|
| Header + intro | yes | — |
| Tokens — Colors | yes | — |
| Tokens — Typography | yes | — |
| Tokens — Spacing & Shapes | yes | — |
| Components | yes | — |
| Do's and Don'ts | yes | — |
| Surfaces | yes | — |
| Elevation | yes | render "flat" when 0 shadows, never omit |
| Imagery | conditional | no imagery signal — stamp ABSENT |
| Layout | yes | — |
| Motion | conditional | `MotionSystem.durationScale` has no measured entries |
| Agent Prompt Guide | yes | — |
| Similar Brands | yes | — |
| Quick Start | yes | — |
