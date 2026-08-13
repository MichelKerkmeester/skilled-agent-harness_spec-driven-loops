---
title: "Spec Memory Hook: OpenCode Continuity Retrieval"
description: "OpenCode plugin that surfaces Spec-Kit memory continuity into a session; an OpenCode-plugin-only concern with no cross-runtime hook equivalent."
trigger_phrases:
  - "spec memory plugin"
  - "continuity retrieval hook"
importance_tier: "reference"
contextType: "reference"
---

# Spec Memory Hook: OpenCode Continuity Retrieval

---

## 1. OVERVIEW

Index of the spec-memory concern (real code at `.opencode/plugins/mk-spec-memory.js`, mirrored here). The plugin bridges the Spec-Kit Memory MCP into an OpenCode session so continuity and prior-work context are retrievable at runtime. This is an **OpenCode-plugin-only** concern by design — it hooks OpenCode's plugin API and has no equivalent lifecycle event on the other runtimes (see the hub coverage matrix).

Honors the `spec-memory` kill-switch (`isHookEnabled`; `MK_SPEC_MEMORY_DISABLED`, legacy `MK_SPEC_MEMORY_PLUGIN_DISABLED` / `SPECKIT_SPEC_MEMORY_PLUGIN_DISABLED`, or the master `MK_HOOKS_DISABLED`), default-on.

## 2. KEY FILES

| Runtime | Adapter |
|---|---|
| `opencode/` | `mk-spec-memory.js` (browsability symlink → `../../../plugins/`) |

## 3. BOUNDARIES

- **Advisory only, fail-open.** Surfaces context; never blocks.
- **Real code stays in `.opencode/plugins/`.** The entry here is a documentation-mirror symlink; the OpenCode loader globs `.opencode/plugins/`, not this tree.

## 4. RELATED

- [`../README.md`](../README.md) — the hub index and coverage matrix.
- [`../../plugins/README.md`](../../plugins/README.md) — the OpenCode plugins.
