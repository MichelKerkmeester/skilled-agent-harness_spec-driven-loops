---
title: "Primitive variants"
description: "Four on-demand primitives loaded only on explicit request: annotation callouts, the sketchy filter, the terminal skin, and the monochrome icon library."
trigger_phrases:
  - "Primitive variants"
  - "annotation callout"
  - "sketchy filter"
  - "terminal window skin"
  - "diagram icon library"
version: 1.0.0.0
---

# Primitive variants

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Four on-demand primitives loaded only on explicit request: annotation callouts, the sketchy filter, the terminal skin, and the monochrome icon library.

The core SVG building blocks (background, arrow markers, node boxes, arrow labels, legend) are always part of a diagram. These primitives are distinct, optional registers layered on top when the user explicitly asks for an editorial aside, a hand-drawn register, CLI chrome, or iconography. Each lives in its own `references/primitives/primitive-*.md` file and is loaded on demand rather than on every diagram, because each trades away some of the default design-system grammar in exchange for its specific effect.

---

## 2. HOW IT WORKS

### Annotation callouts

An annotation callout is an italic Instrument Serif aside with a dashed Bézier leader and a landing dot — marginalia that marks a detail without competing with the primary grammar. The italic-plus-serif combination is load-bearing (italic sans or mono is not allowed), the dashed leader distinguishes it from primary arrows, callouts sit in margins (top-right, bottom-left) and never inside the active diagram area, and at most 2 callouts may appear per diagram.

### Sketchy filter

The sketchy variant is an SVG displacement filter (`feTurbulence` plus `feDisplacementMap`) that wobbles strokes into a hand-drawn editorial register without changing the layout. The critical rule is that shapes are filtered but text is not — text sits in a sibling group outside the filtered group so legibility stays crisp. Tuning parameters cover `baseFrequency`, `numOctaves`, `scale`, and `seed`, and the filter is meant for essay-style pages, not technical documentation, dense labels, or dark variants.

### Terminal skin

The terminal window primitive wraps any diagram in a fake terminal window — a titlebar with three macOS-style dots, a `$` prompt line, and monospace type throughout. It is a second, fixed skin with its own nine-token palette that is not part of the light/dark inversion rule and is not affected by onboarding; every diagram in this register uses the same tokens regardless of host brand. The one-accent rule still holds (one dot is accent, the other two are soft), pure black is banned, and typography runs about 1-2px above the default scale because monospace reads small.

### Icon library

The icon library is a monochrome 24×24 set used in IT/cloud diagrams, with each glyph using `currentColor` so it inherits the active skin or any user-onboarded brand palette. Icons are organized into categories (compute, people, network, data, Kubernetes, action, DevOps, brand, data stack, language, statistical tools, file formats) with license attribution per icon; generic icons are stroked at 1.5px and brand silhouettes are filled. The gallery in `assets/icons.html` is the browse surface, and its specimen glyphs are decorative (`aria-hidden="true"`).

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `references/primitives/primitive-annotation.md` | Shared | The callout grammar (italic serif text, dashed Bézier leader, landing dot), margin rule, and 2-per-diagram cap |
| `references/primitives/primitive-sketchy.md` | Shared | The displacement-filter grammar, tuning parameters, and the filter-shapes-not-text rule |
| `references/primitives/primitive-terminal.md` | Shared | The fixed terminal skin tokens, titlebar chrome, monospace typography, and one-accent rule |
| `references/primitives/primitive-icons.md` | Shared | The monochrome icon library with per-icon SVG snippets, categories, and license attribution |
| `assets/icons.html`, `assets/templates/template-terminal.html` | Shared | The icon gallery and the terminal template variant the primitive is applied to |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `manual-testing-playbook/diagram-generation/primitive-variants.md` | Manual playbook | Scenario DIA-004 verifies callout limits, the sketchy filter on shapes only, the terminal skin, and the icon library |
| `references/primitives/primitive-annotation.md` | Reference | Anchor for the callout grammar exercised in the scenario |

---

## 4. SOURCE METADATA

- Group: DIAGRAM GENERATION
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `diagram-generation/primitive-variants.md`

Related references:
- [editorial-style-and-connectors.md](editorial-style-and-connectors.md) — the base design system these primitives layer on
- [onboarding-flow.md](onboarding-flow.md) — the brand onboarding that the terminal skin intentionally does not inherit
