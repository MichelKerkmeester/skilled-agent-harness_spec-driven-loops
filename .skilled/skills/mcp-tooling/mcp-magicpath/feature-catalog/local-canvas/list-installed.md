---
title: "list_installed"
description: "Per-tool leaf for list_installed: list MagicPath components already present in the current project directory; path optional, defaults to the conventional component path. Read-only."
trigger_phrases:
  - "magicpath list installed tool"
  - "list installed magicpath"
  - "magicpath installed components"
version: 1.0.0.0
---

# list_installed

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Local directory scan for installed components. READ-ONLY. Canonical callable: `magicpath.list_installed({ path? })` (confirm via `tool_info` first).

| Contract item | Value |
|---|---|
| Required args | none |
| Optional args | `path: string` (directory to scan; defaults to the conventional component path) |
| Returns | MagicPath components already present in the current project directory |
| Boundary | Reads the directory; does not write it |

---

## 2. HOW IT WORKS

`list_installed` scans the current project directory for MagicPath components already present. The optional `path` selects the directory to scan and defaults to the conventional component path. It reads the directory; it does not write it, install anything, or modify a manifest. Calls are synchronous (no `await`, no returned Promise); inspect the returned value for an `error`/`code` field before using it.

---

## 3. SOURCE FILES

| File | Role |
|---|---|
| `../../references/tool-surface.md` | Args, bounds, result shape, and the local/canvas role (Sections 2-3) |
| `../../references/mutation-boundary.md` | The read-only boundary; `list_installed` reads the directory, it does not write it |

---

## 4. SOURCE METADATA

- Group: Local & canvas
- Canonical catalog source: `../feature-catalog.md`
- Domain overview: [local-canvas.md](local-canvas.md)
- Feature file path: `local-canvas/list-installed.md`
