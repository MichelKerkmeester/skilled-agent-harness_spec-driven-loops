---
title: "Shared: Hook Adapter Helpers"
description: "Shared kill-switch resolver APIs and fail-open adapter plumbing, kept local so the tree has zero out-of-tree dependencies."
trigger_phrases:
  - "hook adapter shared"
  - "hooks shared helpers"
---

# Shared: Hook Adapter Helpers

---

## 1. OVERVIEW

This folder injects nothing into any AI session — it is pure plumbing for the adapters that do.

### Resolver API

`hook-flags.cjs` exports `isHookEnabled(concern, env?)` (default-on; honors `MK_HOOKS_DISABLED`, canonical per-concern flags, and registered aliases), plus `concernFlag()`, `isTruthy()`, and `LEGACY_ALIASES`. `hook-flags.mjs` and `hook-flags.ts` are zero-drift facades over that implementation. `hook-flags.sh` exposes the equivalent POSIX `hook_enabled <concern>` helper for shell entrypoints. The dist-freshness Python entrypoint carries the same logic in its local `_hook_enabled()` helper.

### Adapter plumbing

`hook-adapter-shared.cjs` provides `readStdin()` (bounded stdin collection) and `parseJsonFailOpen()` (JSON parsing that resolves to `null` instead of throwing).

### Currently wired consumers

The resolver family currently gates 22 concerns: `skill-advisor`, `spec-gate`, `completion`, `codex-watchdog`, `permission-policy`, `directive-lifecycle`, `dispatch`, `post-edit-quality`, `task-dispatch`, `mcp-route-guard`, `goal`, `git-preflight`, `spec-memory`, `session-lifecycle`, `git-worktree-guard`, `git-hooks-check`, `dist-freshness`, `session-cleanup`, `hook-install`, `git-commit-hooks`, `live-sync`, and `live-follow`. Pi's bundled SessionStart adapter calls `isHookEnabled()` separately for each of its five advisory concerns.

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

`hook-adapter-shared.cjs` consumers (5): `mcp-route-guard/{claude,codex,devin}/mcp-route-guard.cjs` and `task-dispatch/{claude,devin}/task-dispatch-guard.cjs`.

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
