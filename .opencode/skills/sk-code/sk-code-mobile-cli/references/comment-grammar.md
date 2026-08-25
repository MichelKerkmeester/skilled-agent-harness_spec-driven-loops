---
title: Source Comment Grammar
description: The natural source-comment convention for MODULE banners, numbered section banners, module headers, markup labels, purpose lines, and greppable frozen-seam notes in the Pi Remote app.
trigger_phrases:
  - "module banner comment"
  - "box drawing section banner"
  - "natural comment convention"
  - "markup section comment"
  - "durable why comment"
  - "do not edit note"
  - "read an editability seam"
  - "comment grammar scan"
  - "comment only diff verifier"
importance_tier: normal
contextType: implementation
version: 1.7.0.0
---

# Source Comment Grammar

The app uses a small, human-readable comment grammar. A `MODULE:` banner and numbered box-drawing
sections make structure easy to scan; plain-English comments explain the durable WHY at the edit site.
The former `@ds` prefix is retired. Do not add it to new comments or treat it as a current contract.

---

## 1. OVERVIEW

### Core Principle

A comment earns its place by carrying knowledge the code cannot state itself. Structure is uniform;
prose is short, human, and reason-bearing. The same convention describes editable presentation seams and
frozen boundaries without a special marker vocabulary.

### When to Use

- Adding or editing a comment in any `.svelte` or `.ts` source file
- Writing the opening banner or a `<script module>` header
- Labeling a markup region or explaining a function, effect, or CSS rule
- Recording why a token, slot, state presentation, layout, theme remap, or catalog surface is editable
- Marking a frozen accessibility, security, logic, or primitive boundary
- Proving a diff changed comments only

### Key Sources

- `app-mobile/src/shared/state/turns.ts` (a canonical banner layout)
- `scripts/naming/scan-comments.mjs` (the measuring scan)
- `scripts/naming/verify-comment-only.mjs` (the comment-only diff proof)

---

## 2. THE BANNERS AND LABELS

Every source file keeps its `MODULE:` banner and the numbered ALL-CAPS section banners drawn with
box-drawing rules (`─`). `turns.ts` opens with `MODULE: Derived Conversational Turns`; sections such as
`1. IMPORTS`, `2. TYPE DEFINITIONS`, and `3. TURN GROUPING` keep the source structure visible without
making a reader inspect every body. `scan-comments.mjs` treats a file with no `─` rule line as missing
its banner and reports it.

### Module islands

Each `<script module>` island gets a plain-English header comment that says what the island holds. Keep
the banner outside the island and put the header immediately inside it:

```svelte
<script module>
  // This module holds the shared model-effort options used by the catalog and stories.
</script>
```

### Markup regions

Label each meaningful markup region with an HTML section comment. Name the region in ordinary language:

```svelte
<!-- section: composer loading state -->
```

### Functions, effects, and CSS rules

Put one short human-voice purpose comment immediately above each function, effect, and CSS rule when the
purpose is not already obvious from the code. Say why the part exists, not what its name already says:

```ts
// Keeps reconnect state from resetting while the relay is still proving liveness.
function preserveReconnectState() { ... }

// Prevents synchronous reducer reads from re-triggering this effect.
$effect(() => { ... });
```

```css
/* Keeps the code viewport readable when its content is wider than the card. */
.rich--code-preview { ... }
```

---

## 3. WHAT A COMMENT CARRIES

A comment states the durable WHY that a reader cannot infer from the code beside it. It is never:

- **Narration** — restating what the next line does.
- **A restated name** — echoing the identifier the line already names.
- **A multi-line prose essay** — keep the reason on one line at the edit site.
- **A retired marker** — write the meaning as natural prose instead of reviving the former prefix.

Other mechanical rules the scan counts:

- **Sentence-case starts.** A prose comment begins uppercase; directives, quoted identifiers, and code
  markers are the narrow exceptions.
- **No commented-out code.** Delete obsolete code instead of preserving a second, inert copy.
- **Purpose lines stay local.** Put the one-line reason beside the function, effect, CSS rule, or markup
  region it explains.
- **Frozen notes stay on one line.** The note begins exactly `Do not edit —` and keeps its durable reason
  on that same line.

---

## 4. THE NATURAL EDITABILITY CONVENTION

The nearest durable-purpose comment is the seam at an edit site. Its prose keeps the meaning that used to
be split across surface, slot, state, variant, edit, catalog, and theme markers:

| Concept | Natural wording to leave at the edit site | What may change |
| --- | --- | --- |
| Surface | Name the component or layout contract and why it owns the presentation. | The presentation of that surface. |
| Slot | Label the markup region and explain the content it arranges. | Order or label of the region, not its filling logic. |
| State | Name the visible state and its presentation purpose. | Color, spacing, type, or layout for that state. |
| Variant | Explain what alternate presentation the rule provides. | The variant's presentation. |
| Token edit | Name the semantic role or component token and its intended blast radius. | A role for shared retinting or a component token for one surface. |
| Catalog | Say that the region is a read-only preview of the surface, state, and theme. | The preview presentation, not runtime behavior. |
| Theme remap | Explain which role resolves differently in light, dark, or system-dark mode. | The intended per-theme presentation. |
| Frozen seam | Begin the same-line note with `Do not edit — <why>`. | Nothing in the protected region. |

### The four edit classes

1. **Token edits** retint a semantic role for every surface that plays it, or a component token for one
   surface. Never change a frozen `--pi-*` primitive. The nearby purpose line names the role and blast
   radius.
2. **Slot edits** reorder or relabel a labeled template region. The logic that fills the region remains
   untouched.
3. **State edits** restyle the presentation of a visible state. The state machine and status text stay
   protected, each with a `Do not edit —` note when the boundary is not obvious from the code.
4. **Layout edits** adjust spacing, grid, and flow inside the owned presentation rule or region.

### How to read a seam

At an edit site, read the nearest purpose comment and the surrounding section label. If the prose names a
presentation concern — token, slot, state, variant, theme, or layout — the corresponding presentation is
editable; use the browser-free resolver to prove that only the intended values moved. If the nearest note
begins `Do not edit —`, stop: the reason identifies an accessibility guarantee, security boundary, logic
path, frozen primitive, or other protected contract.

The full designer walkthrough with worked examples is `feature-catalog/design-system/designer-editability.md`;
the read-only preview index is `app-mobile/catalog.html`.

---

## 5. THE GATES

- `node scripts/naming/scan-comments.mjs` reports files without banners, lowercase comment starts,
  commented-out code, markup/comment structure, `Do not edit —` fence counts, and multi-line fence
  explanations. `--json` emits the same counts for packet deltas.
- `node scripts/naming/verify-comment-only.mjs <ref>` proves a change touched comments only: it strips
  comment lines from both sides and compares the residue, failing if any code line differs.

---

## 6. RELATED REFERENCES

- `editability-guardrails.md` — the protected fence list, the `Do not edit —` counter, and the
  presentation-only boundary.
- `css-class-naming-bem.md` — the class grammar whose purpose and state comments follow this convention.
- `scoped-style-ownership.md` — where an owned CSS rule lives and how its purpose is recorded.
- `verification.md` — the resolver proof for an intended presentation or token change.
