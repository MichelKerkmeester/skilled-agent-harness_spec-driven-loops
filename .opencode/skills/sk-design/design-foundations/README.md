---
title: foundations
description: Static visual-system skill for color, typography, layout, spacing, hierarchy, responsive adaptation, data visualization and design tokens. Turns a visual direction into a coherent token system, then hands implementation to sk-code.
trigger_phrases:
  - "design foundations"
  - "color system"
  - "typography scale"
  - "design tokens"
  - "responsive adaptation"
importance_tier: normal
contextType: implementation
version: 1.0.1.0
---

# foundations

> Turn a visual direction into a coherent static system: OKLCH color, a type scale, layout rhythm, responsive adaptation and named tokens that `sk-code` can build without guessing.

---

## 1. AT A GLANCE

| Aspect | What you get |
|---|---|
| **Use it for** | Building or correcting the static visual system: color, type, spacing, layout, hierarchy, responsive adaptation, data visualization and design tokens |
| **Invoke with** | "OKLCH", "palette", "typography scale", "spacing", "responsive", "design tokens" or auto-routing on static-system intent |
| **Works on** | Any surface needing a token system, pairing with the shared register for posture and with `sk-code` for implementation |
| **Produces** | A named token system (color, type, spacing) with contrast evidence, responsive rules and explicit risks, ready for handoff |

---

## 2. OVERVIEW

### Why This Skill Exists

A visual direction is not a system. Someone picks a brand teal and a heading font, and the gaps stay open: which neutral steps, what the contrast pairs are, how the layout reflows on a phone, how a chart encodes the data, what dark mode actually does. Left to defaults, those gaps fill with the median AI look, gray text on color, arbitrary spacing, a desktop design shrunk until it fits. This skill closes the gaps in order, so the result reads as a deliberate system rather than a pile of one-off values.

### What It Does

The skill owns the static visual system for the `sk-design` family: color, type, layout, spacing, hierarchy, responsive adaptation, data visualization and token vocabulary. It reads the shared Brand-vs-Product register first, because that one call sets the color strategy and the density everything else inherits, then builds the system in layers and produces a compact handoff. It does not invent the overall direction, that is `interface`, and it does not animate, that is `motion`. The canonical entry point is `SKILL.md`, and the fill-in scaffold in `assets/token_starter.md` is the fastest way to a concrete system.

---

## 3. QUICK START

**Step 1: Let the advisor route a static-system task here, or read the skill directly.**

```bash
cat .opencode/skills/sk-design/design-foundations/SKILL.md
```

**Step 2: Set the register, then fill the token scaffold.**

Read `../shared/register.md`, decide Brand or Product, then open the scaffold and fill the OKLCH ramp, the type scale and the spacing scale:

```bash
cat .opencode/skills/sk-design/design-foundations/assets/token_starter.md
```

The register answers carry into the scaffold, so a restrained product UI and an expressive brand page never get the same defaults.

**Step 3: Verify the system before handing it off.**

```bash
python3 .opencode/skills/sk-doc/scripts/package_skill.py .opencode/skills/sk-design/ --check
```

Exit code 0 means the skill and its docs validate.

---

## 4. HOW IT WORKS

The skill never picks values first. It names the system role, grounds the constraints, then builds in layers and tests each layer against the parent anti-slop base before producing a handoff.

1. Name the role: brand surface, product UI, marketing page, data UI or multi-platform adaptation.
2. Ground the constraints: existing brand colors, design-system tokens, target platforms, the contrast bar, the density bar and whichever axis the brief pins.
3. Build in layers: color primitives and semantic tokens, the type scale and measure, the spacing and layout system, then any data visualization and context adaptation the surface needs.
4. Test every token for a purpose, so no free axis drifts to the median AI look.
5. Produce a compact handoff: named tokens, usage rules, responsive breakpoints and explicit risks.

### The Register Sets The Defaults

Before any axis, the skill reads `../shared/register.md` to decide whether the surface IS the product or SERVES it. Brand spends color and whitespace on one memorable move. Product stays restrained and dense. That single call sets the color strategy and the token density, which is why a landing page and an admin dashboard built here do not end up with the same palette and the same spacing rhythm by accident.

### Adaptation Is Rethinking, Not Shrinking

Responsive work here adapts the experience to the context rather than scaling pixels. The context adaptation matrix reads four dimensions, device and viewport, input method, connection and posture, then rethinks layout, interaction, content and navigation per target. A phone, a tablet and a print export each get a deliberate treatment, and core functionality survives every one.

### Data Is Its Own Encoding Discipline

When a surface carries charts or tables, the skill treats the encoding as the design. A chart matches the question rather than the dataset shape, every visual channel carries one variable, and color-for-data uses a sequential, diverging or categorical scale chosen by the question, kept separate from brand color. Numeric tables right-align with tabular numerals so magnitude reads down the column.

### Styles-Library Utilization

Foundations consumes the shared zero-hydration plan through the relationship adapter in [`corpus/`](./corpus/README.md). The selected mode can hydrate one coherent anchor and bounded axis owners, then emit a typed compatibility graph and a transformation ledger bound to source evidence. Unresolved relationships remain `not-assessed`, and corpus evidence never locks a target-measured value.

The authority order is user brief and owned system, selected-mode judgment, target evidence and deterministic checks, corpus reference evidence, then transport output. Corpus relationships can explain compatibility, but downstream contrast, gamut, rhythm, responsive and extraction checks keep authority.

### Private Procedure Cards

The maintainer-facing cards in [`procedures/`](./procedures/) support mode-local evidence gathering after the public `foundations` mode is chosen. The three cards are `component_system_inventory.md`, `hierarchy_rhythm_review.md` and `tweakable_design_controls.md`. They are not user-selectable routes.

---

## 5. INTEGRATION & NAVIGATION

### When To Use This Skill

Reach for it whenever a task needs a static visual system or a fix to one: a color system or OKLCH palette, a type scale or measure problem, layout rhythm and spacing, responsive adaptation, a data visualization layer or a token system for handoff. Skip it when the overall direction is still open, that starts in `interface`, and skip it for pure animation, which is `motion`. Once the static system is fully specified and only code remains, hand off to `sk-code`.

### Related Skills

| Skill | Relationship |
|---|---|
| `interface` | Supplies the distinctive direction this skill systematizes into tokens |
| `motion` | Consumes the static tokens when defining motion materials and interaction states |
| `audit` | Scores the finished system for accessibility, responsiveness, theming and anti-slop risk |
| `sk-code` | Implements the token system in the detected stack after the static decisions are made |

---

## 6. TROUBLESHOOTING

| What you see | Why | Fix |
|---|---|---|
| The palette drifts to a generic blue or gray | The register was skipped, so no posture set the color strategy | Read `../shared/register.md`, set Brand or Product, then pull the brand hue from evidence in `assets/token_starter.md` |
| The mobile view feels wrong, not just small | The desktop design was scaled instead of rethought | Work the matrix in `references/layout/adaptation_matrix.md` across layout, interaction, content and navigation |
| A chart looks rich but reads dishonestly | The bar axis is truncated or color carries a value a length already shows | Apply `references/data_viz.md`, start bar axes at zero and keep one variable per channel |
| `sk-code` has to guess token roles or breakpoints | The handoff shipped values without roles or rules | Name semantic roles and breakpoint intent before values, per the handoff checklist in `token_starter.md` |

---

## 7. VERIFICATION

| Check | How to run it |
|---|---|
| Skill structure | `python3 .opencode/skills/sk-doc/scripts/package_skill.py .opencode/skills/sk-design/ --check` reports the skill valid |
| README structure | `python3 .opencode/skills/sk-doc/scripts/validate_document.py .opencode/skills/sk-design/design-foundations/README.md --type readme` reports zero issues |
| Manual scenarios | Run `manual_testing_playbook/manual_testing_playbook.md`. Release is ready when every scenario PASSes or is SKIP for environment reasons only |

---

## 8. RELATED DOCUMENTS

| Document | Purpose |
|---|---|
| [`SKILL.md`](./SKILL.md) | Runtime instructions and routing: WHEN TO USE, SMART ROUTING, HOW IT WORKS, RULES, REFERENCES |
| [`references/color/oklch_workflow.md`](./references/color/oklch_workflow.md) | OKLCH conversion, palette generation, contrast and gamut |
| [`references/color/palette_theming.md`](./references/color/palette_theming.md) | Color dosage, semantic roles, tinted neutrals, surface scales and dark mode |
| [`references/type/typography_system.md`](./references/type/typography_system.md) | Type roles, scale, pairing, measure and text rendering checks |
| [`references/layout/layout_responsive.md`](./references/layout/layout_responsive.md) | Spacing, rhythm, hierarchy, grids and the responsive base |
| [`references/layout/adaptation_matrix.md`](./references/layout/adaptation_matrix.md) | Device, input and context adaptation as rethinking per context, not pixel scaling |
| [`references/data_viz.md`](./references/data_viz.md) | Chart-type selection, axis and encoding, color-for-data scales and data-table alignment |
| [`assets/token_starter.md`](./assets/token_starter.md) | Fill-in scaffold for an OKLCH ramp, type scale and spacing scale, keyed to the register |
| [`procedures/`](./procedures/) | Three maintainer-facing procedure cards for component-system inventory, hierarchy and rhythm review and tweakable design controls |
| [`../shared/register.md`](../shared/register.md) | The shared Brand-vs-Product register, set first. It sets the color strategy and density this skill inherits |
| [Skills Library](../README.md) | The skill catalog and routing front door |
