---
title: "Shared: Hook Adapter Helpers"
description: "The one helper every CommonJS adapter in this tree shares: stdin collection and fail-open JSON parsing, kept local so the tree has zero out-of-tree dependencies."
trigger_phrases:
  - "hook adapter shared"
  - "hooks shared helpers"
---

# Shared: Hook Adapter Helpers

---

## 1. OVERVIEW

This folder injects nothing into any AI session — it is pure plumbing for the adapters that do.

`shared/` holds the single helper file the CommonJS adapters in this tree have in common: `hook-adapter-shared.cjs`, providing `readStdin()` (bounded stdin collection) and `parseJsonFailOpen()` (JSON parsing that resolves to `null` instead of throwing). Keeping a local copy is deliberate — it is what makes every adapter under `.opencode/hooks/` importable with zero dependency outside this tree, which is the point of the tree existing.

A second, independent ESM sibling (`hook-adapter-shared.mjs`) lives in `system-spec-kit/mcp-server/hooks/lib/` for that skill's own spec-gate adapters, which are not part of the fully-portable set. The two are allowed to drift in principle; in practice the file is small and stable enough that they shouldn't.

---

## 2. KEY FILES

| File | Responsibility |
|---|---|
| `hook-adapter-shared.cjs` | `readStdin()` + `parseJsonFailOpen()`, byte-identical behavior for every consumer. |

Consumers (5): `mcp-route-guard/{claude,codex,devin}/mcp-route-guard.cjs` and `task-dispatch/{claude,devin}/task-dispatch-guard.cjs`.

---

## 3. BOUNDARIES

| Boundary | Rule |
|---|---|
| Imports | Node builtins only. |
| Growth | Only helpers genuinely shared by multiple concerns belong here; a concern-specific helper goes in that concern's `lib/`. |

---

## 4. VALIDATION

Covered by the consumers' own suites:

```bash
node --test .opencode/hooks/mcp-route-guard/lib/mcp-route-guard.test.cjs .opencode/plugins/tests/claude-task-dispatch-guard.test.cjs
```

---

## 5. RELATED

- [`../README.md`](../README.md): the unified hooks tree this helper serves.
