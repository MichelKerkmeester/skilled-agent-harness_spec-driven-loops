---
title: "inspect_component"
description: "Per-tool leaf for inspect_component: read a component's source, dependencies, and imports without installing anything and without a package manifest; the safe read path and the only way to read a component into a non-React project. Read-only."
trigger_phrases:
  - "magicpath inspect component tool"
  - "inspect component magicpath"
  - "magicpath component source"
version: 1.0.0.0
---

# inspect_component

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Component source, dependencies, and imports without installing. READ-ONLY. Canonical callable: `magicpath.inspect_component({ generated_name })` (confirm via `tool_info` first).

| Contract item | Value |
|---|---|
| Required args | `generated_name: string` (the component generated name, such as `wispy-river-5234`) |
| Optional args | none |
| Returns | The component's source, dependencies, and import information |
| Safety | **Writes no files and needs no package manifest**; the safe way to read a component, and the only way to read one into a non-React project |

---

## 2. HOW IT WORKS

`inspect_component` reads a component's source, dependencies, and imports for one `generated_name` (the value `search_components` returns). It writes no files and needs no package manifest, so it is the safe read path: it does not install the component, does not touch the project's `package.json`, and works in a non-React project where installation is not an option. The `generated_name` is the component's generated identifier, not a display name; get it from `search_components` or `list_components`. Calls are synchronous (no `await`, no returned Promise); inspect the returned value for an `error`/`code` field before using it.

---

## 3. SOURCE FILES

| File | Role |
|---|---|
| `../../references/tool-surface.md` | Args, bounds, result shape, and the search-before-detail funnel (Sections 2-3) |
| `../../references/mutation-boundary.md` | The read-only boundary; `inspect_component` writes no files by design |

---

## 4. SOURCE METADATA

- Group: Components
- Canonical catalog source: `../feature-catalog.md`
- Domain overview: [components.md](components.md)
- Feature file path: `components/inspect-component.md`
