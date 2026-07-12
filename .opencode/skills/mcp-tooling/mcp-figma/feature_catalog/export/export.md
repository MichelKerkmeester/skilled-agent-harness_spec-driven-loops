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

`figma-ds-cli export screenshot [-o file] [-s scale] [-f png|jpg|svg|pdf]` exports the selected node or current page as a screenshot, PNG, or SVG; `figma-ds-cli export node <nodeId> [-o file] [-s scale] [-f png|svg|pdf|jpg]` exports one specific node by id. `figma-ds-cli export css` and `figma-ds-cli export tailwind` export the file's variables as CSS custom properties or a Tailwind config and take no node or output argument in this release. `figma-ds-cli export-jsx [nodeId] [-o file] [--pretty]` exports a node (or the selection) as JSX, and `figma-ds-cli export-storybook [nodeId] [-o file]` exports Storybook stories; both print to stdout unless `-o`/`--output` names a file. None of these change the Figma document, but every form that writes a local file needs an explicit output path, and the agent refuses or asks before overwriting an existing one.

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
| `manual_testing_playbook/read_only/read_only_export.md` | Manual playbook | Export targets an explicit path and never silently overwrites |

---

## 4. SOURCE METADATA

- Group: Export
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `export/export.md`

Related references:
- [inspect.md](../inspect/inspect.md) covers the read-only inspect verbs that precede an export
- [a11y-and-analysis.md](../a11y_and_analysis/a11y_and_analysis.md) covers the other always-safe read-only area
