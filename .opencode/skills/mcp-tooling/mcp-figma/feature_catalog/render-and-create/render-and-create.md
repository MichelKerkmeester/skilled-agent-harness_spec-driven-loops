---
title: "Render and create"
description: "Author content in the Figma document behind gates: render JSX nodes, create frames/icons/images and primitives, lay out, duplicate, componentize, and generate variants; eval/raw/run are arbitrary execution."
trigger_phrases:
  - "figma render jsx"
  - "figma create frame"
  - "figma authoring"
  - "figma variants"
  - "figma eval raw run"
importance_tier: "important"
version: 1.0.0.1
---

# Render and create (figma-ds-cli render / create / set)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Authors content in the document: renders JSX-described nodes, creates frames, icons, images, and primitives, lays out and arranges, duplicates, converts to components, and generates variants and combos. This is the write direction, and every verb here is gated.

Every verb in this area changes the Figma document and is MUTATING (with an ARBITRARY subset for `eval`/`raw`/`run`). A typical caller proposes an authoring action, the agent describes the effect and a rollback and confirms an explicit target, then the verb runs. `--dry-run` variants of arrange, unstack, use, and combos are read-only previews.

---

## 2. HOW IT WORKS

### Render and create primitives

`figma-ds-cli render <jsx>` renders a JSX-described node into the document and `figma-ds-cli render-batch <source>` renders multiple nodes in one pass. The source-verified create primitives are `figma-ds-cli create frame|icon|image ...`; top-level shape, text, and group aliases are `figma-ds-cli rect|ellipse|text|line|component|group|autolayout ...`. (Note the doc drift: REFERENCE shows `create rect/circle`, but source proves `create frame/icon/image` plus the top-level aliases.) Prefer `render`/`render-batch` over `eval` for visual nodes, because `eval` bypasses positioning.

### Layout, transform, and generation

`figma-ds-cli set <prop> <value>` sets a property (fill and others; supports `var:name`). Layout verbs `figma-ds-cli sizing|padding|gap|align <node> ...` adjust sizing, padding, gap, and alignment. `figma-ds-cli arrange|unstack <node> [--dry-run]` arranges or unstacks nodes with a read-only preview, `figma-ds-cli duplicate <node>` duplicates a node, and `figma-ds-cli node to-component <node>` converts a node into a component. `figma-ds-cli variants|sizes|combos ... [--dry-run]` generates component variants, sizes, or combos; `figma-ds-cli shadcn add <component>` adds shadcn primitives; and `figma-ds-cli screenshot-url | recreate-url <url>` captures or recreates a design from a URL. All of these are MUTATING.

### Arbitrary execution

`figma-ds-cli eval|raw|run ...` runs arbitrary code or commands and can do anything, so it is tagged ARBITRARY: treat it as mutating and review the code or command before running it.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `references/figma_cli_reference.md` | Shared | Render, create, layout, and generation verb surface |
| `references/tool_surface.md` | Shared | MUTATING and ARBITRARY gating taxonomy |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `manual_testing_playbook/safety-gate/destructive-verb-refused.md` | Manual playbook | The gate that authoring and destructive verbs share, proven via negative control |

---

## 4. SOURCE METADATA

- Group: Render and Create
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `render-and-create/render-and-create.md`

Related references:
- [design-system-extract-and-import.md](../design-system-extract-and-import/design-system-extract-and-import.md) covers import, the other gated write verb
- [tokens-and-variables.md](../tokens-and-variables/tokens-and-variables.md) covers token authoring and the destructive bulk deletes
