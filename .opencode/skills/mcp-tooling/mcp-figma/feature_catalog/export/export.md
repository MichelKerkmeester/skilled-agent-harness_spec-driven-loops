---
title: "Export"
description: "Write assets and code out of the Figma document (PNG/SVG, CSS, Tailwind, JSX, Storybook), read-only against the document but always to an explicit output path with no silent overwrite."
trigger_phrases:
  - "figma export"
  - "figma export css"
  - "figma export-jsx"
  - "figma export-storybook"
  - "export figma asset"
version: 1.0.0.2
---

# Export (figma-ds-cli export / export-jsx / export-storybook)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Writes assets and code out of the document: PNG/SVG, CSS, Tailwind, JSX, and Storybook. Export is read-only with respect to the Figma document but writes local files, so it always requires an explicit output path and must never silently overwrite an existing file.

A typical caller names an output path and runs an export. Everything in this area is READ-ONLY against the Figma document, but the local-export rule applies: an explicit output path is mandatory and an existing-path collision is surfaced, never silently clobbered.

---

## 2. HOW IT WORKS

`figma-ds-cli export screenshot|node <node> <output>` exports a node as a screenshot, PNG, or SVG to an explicit path. `figma-ds-cli export css|tailwind <node> <output>` exports node styles as CSS or Tailwind, `figma-ds-cli export-jsx <node> <output>` exports a node as JSX, and `figma-ds-cli export-storybook <output>` exports components as Storybook stories. Each one takes an explicit output path. None of them change the Figma document, but because they write local files the agent picks a non-existing path and refuses or asks before overwriting an existing file.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `references/figma_cli_reference.md` | Shared | Export verb surface and output flags |
| `references/tool_surface.md` | Shared | READ-ONLY (explicit output) classification and no-overwrite rule |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `manual_testing_playbook/read-only/read-only-export.md` | Manual playbook | Export targets an explicit path and never silently overwrites |

---

## 4. SOURCE METADATA

- Group: Export
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `export/export.md`

Related references:
- [inspect.md](../inspect/inspect.md) covers the read-only inspect verbs that precede an export
- [a11y-and-analysis.md](../a11y-and-analysis/a11y-and-analysis.md) covers the other always-safe read-only area
