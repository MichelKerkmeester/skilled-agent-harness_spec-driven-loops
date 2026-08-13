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

`shared/` holds two helper families for the adapters in this tree:

1. `hook-flags.{cjs,mjs,ts}` — the canonical kill-switch resolver. `hook-flags.cjs` exports `isHookEnabled(concern, env?)` (default-on; honors the master `MK_HOOKS_DISABLED`, the per-concern `MK_<CONCERN>_DISABLED`, and legacy alias names), plus `concernFlag()`, `isTruthy()`, and the `LEGACY_ALIASES` table. `hook-flags.mjs` and `hook-flags.ts` are zero-drift facades that re-export the same functions via `createRequire`, so `.cjs`, `.mjs`, and TypeScript adapters all share one implementation. `hook-flags.test.cjs` covers the resolver under `node --test`.
2. `hook-adapter-shared.cjs` — `readStdin()` (bounded stdin collection) and `parseJsonFailOpen()` (JSON parsing that resolves to `null` instead of throwing).

Keeping local copies is deliberate — it is what makes every adapter under `.opencode/hooks/` importable with zero dependency outside this tree, which is the point of the tree existing.

A second, independent ESM sibling (`hook-adapter-shared.mjs`) lives in `system-spec-kit/mcp-server/hooks/lib/` for that skill's own spec-gate adapters, which are not part of the fully-portable set. The two are allowed to drift in principle; in practice the file is small and stable enough that they shouldn't.

---

## 2. KEY FILES

| File | Responsibility |
|---|---|
| `hook-flags.cjs` | Canonical kill-switch resolver: `isHookEnabled(concern, env?)`, `concernFlag()`, `isTruthy()`, `MASTER_FLAG`, `LEGACY_ALIASES`. |
| `hook-flags.mjs` / `hook-flags.ts` | ESM/TS facades re-exporting `hook-flags.cjs` via `createRequire` (zero drift). |
| `hook-flags.test.cjs` | `node --test` suite for the resolver, incl. cross-flavor parity. |
| `hook-adapter-shared.cjs` | `readStdin()` + `parseJsonFailOpen()`, byte-identical behavior for every consumer. |

`hook-flags` consumers: every runtime adapter and OpenCode plugin gated by a kill-switch concern (`mcp-route-guard`, `dispatch`, `post-edit-quality`, `task-dispatch`, `goal`, `spec-gate`, `skill-advisor`, `completion`, …). `hook-adapter-shared.cjs` consumers (5): `mcp-route-guard/{claude,codex,devin}/mcp-route-guard.cjs` and `task-dispatch/{claude,devin}/task-dispatch-guard.cjs`.

---

## 3. BOUNDARIES

| Boundary | Rule |
|---|---|
| Imports | Node builtins only. |
| Growth | Only helpers genuinely shared by multiple concerns belong here; a concern-specific helper goes in that concern's `lib/`. |

---

## 4. VALIDATION

The kill-switch resolver has its own suite:

```bash
node --test .opencode/hooks/shared/hook-flags.test.cjs
```

`hook-adapter-shared.cjs` is covered by the consumers' own suites:

```bash
node --test .opencode/hooks/mcp-route-guard/lib/mcp-route-guard.test.cjs .opencode/plugins/tests/claude-task-dispatch-guard.test.cjs
```

---

## 5. RELATED

- [`../README.md`](../README.md): the unified hooks tree this helper serves.
