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

This folder injects nothing into any AI session, it is pure plumbing for the adapters that do. Two concerns live here: the kill-switch resolver that every adapter calls before doing anything, and the fail-open stdin/JSON helpers that the CommonJS adapters share. Keeping local copies is deliberate, it is what makes every adapter under `.opencode/hooks/` importable with zero dependency outside this tree, which is the point of the tree existing.

A second, independent ESM sibling (`hook-adapter-shared.mjs`) lives in `system-spec-kit/runtime/hooks/lib/` for that skill's own spec-gate adapters, which are not part of the fully-portable set. The two are allowed to drift in principle; in practice the file is small and stable enough that they shouldn't.

---

## 2. WHAT IT DOES

**Kill-switch resolver.** `hook-flags.cjs` exports `isHookEnabled(concern, env?, config?)`: default-on, so adding the guard changes no behavior until a flag is set. A hook goes silent when the master switch (`SYSTEM_HOOKS_DISABLED`, alias `MK_HOOKS_DISABLED`) or one of the concern's kill-switches is truthy (`1`/`true`/`yes`/`on`, case-insensitive). `concernFlag(concern)` derives the canonical env-var name: concerns listed in `CONCERN_CANONICAL` get their hand-set name (e.g. `goal` → `OPENCODE_GOAL_DISABLED`, `dispatch` → `CLI_DISPATCH_AUDIT_DISABLED`); every other concern falls back to the default shape `SYSTEM_<CONCERN>_DISABLED`. `LEGACY_ALIASES` maps each concern to the older `MK_`/`SPECKIT_`/plugin-owned names that also disable it, so operator config written against any generation keeps working.

Flags resolve from two sources: the live environment, and an optional operator config file (`hook-flags.env`, sibling of this folder, overridable via `HOOK_FLAGS_CONFIG`). The environment always wins over the file for a given key, so a persisted default can still be overridden per session. The config file is read once per process and cached; tests reset the cache via `_resetConfigCache()`.

At load, `hook-flags.cjs` calls `env-aliases.cjs.applyEnvAliases()`, which copies every legacy `MK_*` env value forward onto its new name (only when the new name is unset: a value set explicitly under the new name always wins). This bridges the rename from the opaque `MK_` prefix to self-describing prefixes that name the owning skill or surface.

**Adapter plumbing.** `hook-adapter-shared.cjs` provides `readStdin()` (bounded stdin collection via async iterator) and `parseJsonFailOpen(raw)` (JSON parsing that resolves to `null` instead of throwing). Twenty-eight lines, byte-identical behavior for every consumer.

**POSIX mirror.** `hook-flags.sh` exposes `hook_enabled <concern>` for shell entrypoints. It resolves the config file at source time (explicit `HOOK_FLAGS_CONFIG`, then `__hf_root`, then `git rev-parse --show-toplevel`). It checks the master switch and the default-shape `SYSTEM_<CONCERN>_DISABLED` only: it does not carry the `CONCERN_CANONICAL` overrides or `LEGACY_ALIASES`, so shell entrypoints that need those must use the Node resolver instead.

---

## 3. PER-RUNTIME DELIVERY

This concern has no per-runtime adapters: it is consumed by every other concern's adapters. Each module flavor exists so a different runtime's adapter can import it without a module-system mismatch:

| Flavor | File | Consumed by | Mechanism |
|---|---|---|---|
| CommonJS | `hook-flags.cjs` | Claude, Codex, Devin, Cursor (via `.mjs`), OpenCode plugins (via `createRequire`) | `require()`; calls `applyEnvAliases()` at load. |
| ESM | `hook-flags.mjs` | Cursor, Pi (via `.ts`), ESM adapters | `createRequire` facade over `.cjs`, zero drift. |
| TypeScript | `hook-flags.ts` | Pi, Claude `.ts` adapters | Typed `createRequire` facade over `.cjs`. |
| POSIX sh | `hook-flags.sh` | Shell entrypoints (dist-freshness, git hooks) | `source` + `hook_enabled <concern>`. Default-shape flags only. |
| CommonJS | `hook-adapter-shared.cjs` | `mcp-route-guard/{claude,codex,devin}`, `task-dispatch/{claude,devin}` | `require()`; `readStdin()` + `parseJsonFailOpen()`. |

The resolver family currently gates 21 concerns: `skill-advisor`, `spec-gate`, `completion`, `codex-watchdog`, `permission-policy`, `directive-lifecycle`, `dispatch`, `post-edit-quality`, `task-dispatch`, `mcp-route-guard`, `goal`, `git-preflight`, `session-lifecycle`, `git-worktree-guard`, `git-hooks-check`, `dist-freshness`, `session-cleanup`, `hook-install`, `git-commit-hooks`, `live-sync`, and `live-follow`. Pi's bundled SessionStart adapter calls `isHookEnabled()` separately for each of its five advisory concerns.

---

## 4. DIRECTORY TREE

```text
shared/
+-- hook-flags.cjs              # canonical kill-switch resolver (isHookEnabled, concernFlag, isTruthy, LEGACY_ALIASES)
+-- hook-flags.mjs              # ESM facade over .cjs (createRequire, zero drift)
+-- hook-flags.ts               # typed ESM facade over .cjs (for .ts adapters)
+-- hook-flags.sh               # POSIX sh mirror: hook_enabled <concern> (default-shape flags only)
+-- hook-flags.test.cjs         # node --test suite for the resolver
+-- env-aliases.cjs             # back-compat bridge: copies MK_* env values forward to new names at load
`-- hook-adapter-shared.cjs     # readStdin() + parseJsonFailOpen() for CommonJS adapters
```

---

## 5. KEY FILES

| File | Responsibility |
|---|---|
| `hook-flags.cjs` | Canonical kill-switch resolver. `isHookEnabled(concern, env?, config?)`, `concernFlag()`, `isTruthy()`, `loadConfigFile()`, `configPath()`, `_resetConfigCache()`. Owns `MASTER_FLAG`, `MASTER_ALIASES`, `CONCERN_CANONICAL`, `LEGACY_ALIASES`. Calls `env-aliases.cjs` at load. Config file cached per process. |
| `hook-flags.mjs` / `hook-flags.ts` | ESM/TS facades re-exporting `hook-flags.cjs` via `createRequire` (zero drift). |
| `hook-flags.sh` | POSIX sh mirror. `hook_enabled <concern>` returns 0 (enabled) unless the master or default-shape per-concern switch is truthy. Resolves config file at source time. Does not carry canonical-name overrides or legacy aliases. |
| `env-aliases.cjs` | Back-compat bridge. `applyEnvAliases(env?)` copies every legacy `MK_*` value forward to its new name when the new name is unset. `PREFIX_RULES` maps specific prefixes (`MK_GOAL_` → `OPENCODE_GOAL_`, `MK_CLI_DISPATCH_AUDIT_` → `CLI_DISPATCH_AUDIT_`, etc.); the catch-all `MK_` → `SYSTEM_` rule handles the rest. |
| `hook-adapter-shared.cjs` | `readStdin()` + `parseJsonFailOpen()`. Byte-identical behavior for every CommonJS consumer. |
| `hook-flags.test.cjs` | `node --test` suite: default-on, master switch, per-concern switch, `concernFlag` derivation, config-file merge, legacy-alias parity. |

---

## 6. CONFIGURATION

The resolver is itself the configuration mechanism for every other concern. Operators interact with it through env vars and the config file, not through this folder.

| Variable | Effect |
|---|---|
| `SYSTEM_HOOKS_DISABLED=1` | Master switch. Disables every concern across every runtime. |
| `MK_HOOKS_DISABLED=1` | Legacy alias of the master switch. |
| `SYSTEM_<CONCERN>_DISABLED=1` | Default-shape per-concern switch (e.g. `SYSTEM_TASK_DISPATCH_DISABLED=1`). Derivable via `concernFlag(concern)`. |
| `OPENCODE_GOAL_DISABLED=1` | Canonical name for `goal` (non-default shape). Six concerns have hand-set canonical names in `CONCERN_CANONICAL`; see the table below. |
| `HOOK_FLAGS_CONFIG` | Override path for the operator config file (default: `.opencode/hooks/hook-flags.env`). |

Concerns whose canonical name does not follow the default `SYSTEM_<CONCERN>_DISABLED` shape:

| Concern | Canonical flag |
|---|---|
| `goal` | `OPENCODE_GOAL_DISABLED` |
| `dispatch` | `CLI_DISPATCH_AUDIT_DISABLED` |
| `mcp-route-guard` | `MCP_ROUTE_GUARD_DISABLED` |
| `codex-watchdog` | `CODEX_HOOKS_WATCHDOG_DISABLED` |
| `git-preflight` | `SK_GIT_PREFLIGHT_DISABLED` |
| `post-edit-quality` | `SK_CODE_POST_EDIT_QUALITY_DISABLED` |

Each concern also honors a set of legacy aliases (`MK_`/`SPECKIT_`/plugin-owned names) listed in `LEGACY_ALIASES` inside `hook-flags.cjs`. The config file (`hook-flags.env`, copied from `hook-flags.env.example`, gitignored) lets an operator persist choices without exporting env vars every session; the environment always wins over the file.

---

## 7. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Imports | Node builtins only. `hook-flags.cjs` imports `node:fs`, `node:path`, and `./env-aliases.cjs`. `hook-adapter-shared.cjs` imports nothing. The ESM/TS facades import `node:module` only. |
| Growth | Only helpers genuinely shared by multiple concerns belong here; a concern-specific helper goes in that concern's `lib/`. |
| Failure | The resolver is default-on: a missing or unreadable config file, a missing env var, or any parse failure resolves to enabled. `parseJsonFailOpen` returns `null` instead of throwing. |
| Drift | The ESM/TS facades are zero-drift by construction (they re-export the `.cjs` implementation). The `.sh` mirror is a manual port and intentionally narrower (default-shape flags only). |

---

## 8. VALIDATION

```bash
node --test .opencode/hooks/shared/hook-flags.test.cjs
```

Expected result: all tests pass (default-on, master switch, per-concern switch, `concernFlag` derivation, config-file merge, legacy-alias parity).

`hook-adapter-shared.cjs` is covered by its consumers' own suites:

```bash
node --test .opencode/hooks/mcp-route-guard/lib/mcp-route-guard.test.cjs .opencode/plugins/tests/claude-task-dispatch-guard.test.cjs
```

Expected result: all tests pass.

---

## 9. RELATED

- [`../README.md`](../README.md): the unified hooks tree this helper serves, with the full kill-switch index and coverage matrix.
- [`../hook-flags.env.example`](../hook-flags.env.example): the operator config file template.
- [`../injection-contract.md`](../injection-contract.md): runtime injection visibility contract.
