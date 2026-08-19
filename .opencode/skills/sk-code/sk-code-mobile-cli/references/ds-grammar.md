---
title: The @ds Editability Grammar
description: The inline-comment grammar that marks every editable seam and every frozen line across the Pi Remote stylesheet and components.
trigger_phrases:
  - "ds editability grammar"
  - "ds guardrail do not edit"
  - "ds edit tokens seam"
  - "ds edit layout seam"
  - "reading a ds seam"
  - "four edit classes"
  - "frozen accessibility guardrail"
  - "designer guide walkthrough"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# The `@ds` Editability Grammar

`@ds` is an inline-comment vocabulary across `apps/pi-remote-web/src/style.css` and its components that marks every editable seam and every frozen line. It changes no runtime behavior — it is documentation embedded at the edit site.

---

## 1. OVERVIEW

### Core Principle

`@ds` comments mark every editable seam and every frozen line so a designer — or an agent editing on their behalf — knows exactly where a change is safe and what kind of change a region accepts.

### When to Use

- Editing `apps/pi-remote-web/src/style.css` or its components and needing to know which regions are safe to change
- Determining whether a code seam is a token, slot, state, or layout edit versus a frozen guardrail
- Verifying a resolved value moved only where intended after an edit
- Consulting the designer walkthrough or catalog for worked examples

### Key Sources

- `apps/pi-remote-web/src/style.css`
- `apps/pi-remote-web/src/design-system/designer-guide.md`
- `catalog.html`

---

## 2. THE TERMS

| Term | Marks | A designer may… |
| --- | --- | --- |
| `@ds surface:` | one reusable component/layout contract (e.g. `status`, `focus-ring`, a card) | read it as the unit of the system |
| `@ds slot:` | a named, typed region inside a surface | reorder / relabel the region (not its logic) |
| `@ds state:` | a discrete appearance (idle · loading · ready · empty · offline · error · …) | restyle the state's **presentation** |
| `@ds variant:` | an alternative presentation of a surface | restyle a variant |
| `@ds edit:` | an explicitly editable seam — `@ds edit: tokens` / `@ds edit: layout` | change tokens or spacing/grid/flow here |
| `@ds guardrail: do-not-edit` | a frozen accessibility / security / logic seam | **never** cross it |
| `@ds catalog:` | the read-only preview surface (`catalog.html`) | browse every surface × state × theme |
| `@ds theme:` | a light / dark semantic remap block | read how a role remaps per theme |

---

## 3. THE FOUR EDIT CLASSES

1. **Token edits** — retint a role (`@ds edit: tokens` on a semantic `--…`) or a surface (a component
   `--…`). Never a `--pi-*` primitive.
2. **Slot edits** — reorder or relabel a `@ds slot:` region in a component's template; the surrounding
   logic that fills it is off-limits.
3. **State edits** — restyle a `@ds state:` block's presentation (color, spacing, type, layout). The
   state **machine** and the status **text** are `@ds guardrail: do-not-edit`.
4. **Layout edits** — adjust spacing, grid, and flow inside a `@ds edit: layout` block.

---

## 4. HOW TO READ A SEAM

At any edit site, find the nearest `@ds` comment. If it is an `@ds edit:` / `slot:` / `state:` /
`variant:` seam, the presentation is yours to change; verify with the resolvers that the resolved value
moved only where intended. If it is `@ds guardrail: do-not-edit`, stop — that region is an accessibility
guarantee, a security boundary, or logic, and the reason is stated in the comment. The full designer
walkthrough with worked examples is `apps/pi-remote-web/src/design-system/designer-guide.md`; the live
index is `catalog.html`.

---

## 5. RELATED REFERENCES

- `theme-remap.md` — how the `@ds theme:` light / dark / system-dark remap blocks work, role by role.
- `component-tokens.md` — the component-layer tokens an `@ds edit: tokens` seam most often targets.
- `retint-recipes.md` — the worked recipes for a token-class edit end to end.
