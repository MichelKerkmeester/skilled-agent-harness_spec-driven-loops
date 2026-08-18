---
title: The @ds Editability Grammar
description: The inline-comment grammar that marks every editable seam and every frozen line across the Pi Remote stylesheet and components.
version: 1.0.0.0
---

# The `@ds` Editability Grammar

`@ds` is an inline-comment vocabulary migrated across `apps/pi-remote-web/src/style.css` and the
components. It tells a low-code designer — or an agent editing on their behalf — exactly where a change
is safe, what kind of change a region accepts, and where the frozen lines sit. It changes no runtime
behavior; it is documentation embedded at the edit site.

---

## 1. THE TERMS

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

## 2. THE FOUR EDIT CLASSES

1. **Token edits** — retint a role (`@ds edit: tokens` on a semantic `--…`) or a surface (a component
   `--…`). Never a `--pi-*` primitive.
2. **Slot edits** — reorder or relabel a `@ds slot:` region in a component's template; the surrounding
   logic that fills it is off-limits.
3. **State edits** — restyle a `@ds state:` block's presentation (color, spacing, type, layout). The
   state **machine** and the status **text** are `@ds guardrail: do-not-edit`.
4. **Layout edits** — adjust spacing, grid, and flow inside a `@ds edit: layout` block.

---

## 3. HOW TO READ A SEAM

At any edit site, find the nearest `@ds` comment. If it is an `@ds edit:` / `slot:` / `state:` /
`variant:` seam, the presentation is yours to change; verify with the resolvers that the resolved value
moved only where intended. If it is `@ds guardrail: do-not-edit`, stop — that region is an accessibility
guarantee, a security boundary, or logic, and the reason is stated in the comment. The full designer
walkthrough with worked examples is `apps/pi-remote-web/src/design-system/designer-guide.md`; the live
index is `catalog.html`.
