---
title: "Local & Canvas"
description: "MagicPath local directory and web canvas: list MagicPath components already present in the current project directory, and read the components and images currently selected on the web canvas plus the open projects. Both read-only; selection is safe to call speculatively."
trigger_phrases:
  - "magicpath installed"
  - "magicpath list installed"
  - "magicpath selection"
  - "magicpath canvas"
version: 1.0.0.0
---

# Local & Canvas (list_installed / selection)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Carries the project directory and the web canvas. `list_installed` lists MagicPath components already present in the current project directory. `selection` reads the components and images currently selected on the MagicPath web canvas, plus the projects the user has open. `selection` returns empty collections when nothing is selected or no canvas is open, so it is safe to call speculatively.

Both tools are READ-ONLY. Neither writes a file or modifies the canvas.

---

## 2. HOW IT WORKS

`magicpath.list_installed({ path? })` takes an optional `path` (directory to scan; defaults to the conventional component path) and returns the MagicPath components already present in that directory. `magicpath.selection({})` takes no arguments and returns the canvas selection plus the open projects; when nothing is selected or no canvas is open, it returns empty collections, so it is safe to call without first checking whether a canvas is open. Calls are synchronous (no `await`, no returned Promise); inspect the returned value for an `error`/`code` field before using it.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `references/tool-surface.md` | Shared | Local/canvas tool arguments, bounds, and the speculative-call safety |
| `references/credential-setup.md` | Shared | The credential these tools require |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `references/mutation-boundary.md` | Reference | The read-only boundary; `list_installed` reads the directory, it does not write it |

---

## 4. SOURCE METADATA

- Group: Local & canvas
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `local-canvas/local-canvas.md`

Per-tool leaves in this domain:
- [list-installed.md](list-installed.md) - MagicPath components already in the project directory
- [selection.md](selection.md) - web-canvas selection plus open projects (safe to call speculatively)

Related references:
- [projects.md](../projects/projects.md) covers `active_project`, the lighter peer of `selection`
- [components.md](../components/components.md) covers `inspect_component`, the read path for a selected component
