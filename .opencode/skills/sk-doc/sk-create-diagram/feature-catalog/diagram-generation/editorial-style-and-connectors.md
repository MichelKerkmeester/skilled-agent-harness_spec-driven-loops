---
title: "Editorial style and connectors"
description: "The shared editorial design system every diagram draws against: semantic color and typography tokens, the 4px grid, the complexity budget, and the five non-negotiable connector rules."
trigger_phrases:
  - "Editorial style and connectors"
  - "diagram design system"
  - "mandatory connector rules"
  - "4px grid complexity budget"
  - "diagram style guide"
version: 1.0.0.0
---

# Editorial style and connectors

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

The shared editorial design system every diagram draws against: semantic color and typography tokens, the 4px grid, the complexity budget, and the five non-negotiable connector rules.

This is the visual contract behind every diagram the packet produces. Colors and typography are referred to by semantic role and resolved in `references/style-guide.md`, the single source of truth for tokens, so changing that file re-skins every future diagram without touching type-specific logic. The caller is the agent drawing the diagram, and the failure modes are the ones the taste gate catches: off-grid coordinates, over-accented focal signals, and connectors that a reader cannot trace.

---

## 2. HOW IT WORKS

### Design tokens and skins

All colors, typography, and tokens live in `references/style-guide.md` as semantic roles — `paper`, `ink`, `muted`, `accent`, `link`, and derived roles — and the hex values are looked up there rather than inlined. The default skin is a cool editorial palette (white-smoke paper, jet-black ink, atomic-tangerine accent, blue-slate muted). A light-to-dark inversion rule flips the RGB of ink-toned alpha colors, a small series palette is opt-in for the radar type only, and a separate fixed terminal skin provides the terminal-window register without being affected by onboarding. Typography is load-bearing: the page title uses Instrument Serif, human-readable names use Geist sans, technical sublabels use Geist Mono, and JetBrains Mono is never used as a blanket dev font.

### Layout, grid, and budget

The 4px grid is non-negotiable: every font size, coordinate, node dimension, gap, and radius is divisible by 4 (stroke widths and opacity values are exempt). Each diagram stays within the complexity budget of 9 nodes, 12 arrows/transitions, 2 focal (accent) elements, and 2 annotation callouts; per-type ceilings live in the relevant `references/type-*.md`. The page layout is a header (eyebrow, title, optional subtitle), the diagram container, varied-width summary cards, and a footer, with the legend as a horizontal bottom strip separated by a hairline — never floating inside the diagram area.

### Mandatory connector rules

Five connector rules apply to every diagram of every type. Off-axis connectors use rounded right-angle elbows (quarter-arc `r=8`, minimum `r=6`); a straight `<line>` is reserved for endpoints that share an x or y coordinate, and diagonals are an automatic fail. Every arrow label has an opaque mask rect and a visible 6-10px gap above its connector. No two connectors overlap, share a stroke path, or run on top of each other — crossings use the bridge/hop primitive and offsets of at least 12px. Connectors entering or exiting the same box edge fan out with their own attach points at least 12px apart. A connector never routes behind a box that is not its source or destination, except when the box is geometrically unavoidable, and then the stroke is dashed, the label sits at the visible end, and no arrowhead lands on the intervening box.

### Templates and variants

Every diagram ships from a copied template in `assets/` — `template.html` (minimal light, default), `template-dark.html`, `template-full.html` (full editorial), and `template-terminal.html`. The sketchy variant applies a displacement filter to any minimal variant, and the consultant-special quadrant example ships alongside the quadrant reference. Creating a diagram means copying the closest variant, loading the matching type reference, replacing the eyebrow/title/SVG body with prefixed accessible IDs, and running the taste gate before delivery.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `references/style-guide.md` | Shared | Semantic token roles, typography font stack, stroke/radius/spacing tokens, node type-to-treatment mapping, and the terminal skin |
| `SKILL.md` (Design system, Core SVG primitives, Layout and spacing, RULES) | Handler | The 4px grid, complexity budget, five mandatory connector rules, and the taste-gate checklist |
| `assets/template*.html` (template, template-dark, template-full, template-terminal) | Shared | The four output variants every diagram is copied from |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `manual-testing-playbook/diagram-generation/editorial-style-and-connectors.md` | Manual playbook | Scenario DIA-002 verifies the 4px grid, accent limit, five connector rules, typography roles, and the bottom legend strip |
| `references/style-guide.md` | Reference | Anchor for the design-system rules the taste gate checks against |

---

## 4. SOURCE METADATA

- Group: DIAGRAM GENERATION
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `diagram-generation/editorial-style-and-connectors.md`

Related references:
- [primitive-variants.md](primitive-variants.md) — the on-demand primitives (callouts, sketchy, terminal, icons) layered on this design system
- [type-selection-and-routing.md](type-selection-and-routing.md) — the type conventions that pair with the always-loaded style guide
