---
title: "selection"
description: "Per-tool leaf for selection: the components and images currently selected on the MagicPath web canvas, plus the projects the user has open; returns empty collections when nothing is selected or no canvas is open, so it is safe to call speculatively. Read-only."
trigger_phrases:
  - "magicpath selection tool"
  - "selection magicpath"
  - "magicpath canvas selection"
version: 1.0.0.0
---

# selection

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Web-canvas selection and open projects. READ-ONLY. Canonical callable: `magicpath.selection({})` (confirm via `tool_info` first).

| Contract item | Value |
|---|---|
| Required args | none |
| Optional args | none |
| Returns | The components and images currently selected on the MagicPath web canvas, plus the projects the user has open |
| Safety | **Returns empty collections when nothing is selected or no canvas is open**, so it is safe to call speculatively |

---

## 2. HOW IT WORKS

`selection` returns the components and images currently selected on the MagicPath web canvas, plus the projects the user has open. When nothing is selected or no canvas is open, it returns empty collections rather than failing, so it is safe to call without first checking whether a canvas is open. When only the project context is needed, prefer the lighter [`active_project`](../projects/active-project.md). Calls are synchronous (no `await`, no returned Promise); inspect the returned value for an `error`/`code` field before using it.

---

## 3. SOURCE FILES

| File | Role |
|---|---|
| `../../references/tool-surface.md` | Args, bounds, result shape, and the speculative-call safety (Sections 2-3) |
| `../../references/credential-setup.md` | The credential this tool requires |

---

## 4. SOURCE METADATA

- Group: Local & canvas
- Canonical catalog source: `../feature-catalog.md`
- Domain overview: [local-canvas.md](local-canvas.md)
- Feature file path: `local-canvas/selection.md`
