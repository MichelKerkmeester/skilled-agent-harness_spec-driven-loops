---
title: "Shared: Hook Adapter Helpers"
description: "Shared hook plumbing: the kill-switch resolver, fail-open stdin/JSON helpers and the read-only per-runtime session readers, kept local so the tree has zero out-of-tree dependencies."
trigger_phrases:
  - "hook adapter shared"
  - "hooks shared helpers"
---

# Shared: Hook Adapter Helpers

---

## 1. OVERVIEW

This folder injects nothing into an AI session. It is plumbing for the adapters that do. A resolver decides whether a hook runs at all. Two helpers read stdin and parse JSON without throwing. A reader package resolves one exact session id per runtime.

Keeping local copies is deliberate, because it makes every adapter under `.skilled/hooks/` importable with no dependency outside this tree. That is the point of the tree existing.

A second ESM sibling lives in `system-spec-kit/runtime/hooks/lib/`. That copy, `hook-adapter-shared.mjs`, serves the spec-gate adapters of that skill. Those adapters are not part of the fully-portable set. The two copies may drift in principle, but in practice the file is small and stable enough that they should not.

---

## 2. HOW IT WORKS

**The resolver.** `hook-flags.cjs` exports `isHookEnabled(concern, env?, config?)`. It is default-on, so adding the guard changes no behavior until a flag is set. A hook goes silent when the master switch (`SYSTEM_HOOKS_DISABLED`, alias `MK_HOOKS_DISABLED`) or one of the concern's kill-switches is truthy (`1`/`true`/`yes`/`on`, case-insensitive).

A short list of concerns is default-off instead. That list is `DEFAULT_OFF` in `hook-flags.cjs`, and today it holds one entry: `session-handover`. A default-off concern answers enabled only when its enable flag is truthy. That flag is read from the same two sources as the kill-switches.

For `session-handover` the caller names its runtime through a fourth `options.runtime` argument. The enable flag is that runtime's `SYSTEM_SESSION_HANDOVER_<RUNTIME>_ENABLED` (`CLAUDE`, `CODEX`, `PI`, `OPENCODE`, `CURSOR`, `DEVIN` or `VIBE`) when it holds a non-empty value, `1` on and `0` off. Otherwise `SYSTEM_SESSION_HANDOVER_ENABLED` decides when it holds a non-empty value.

With both blank, a runtime that `DEFAULT_ON_RUNTIMES` lists for the concern is on. Today that is `claude` alone, so Claude Code hands over by default. Every other runtime, and a caller that names none, stays off.

Each key resolves environment first, then config file, before that rule applies. A config-file `SYSTEM_SESSION_HANDOVER_CLAUDE_ENABLED=0` therefore beats an environment `SYSTEM_SESSION_HANDOVER_ENABLED=1` for Claude Code. The master switch and the concern's kill-switch still win over every enable flag.

A switch also answers to a second spelling. `SYSTEM_SESSION_HANDOVER_*` falls back to `SYSTEM_IN_SESSION_HANDOVER_*` while the main name is blank.

`concernFlag(concern)` derives the canonical env-var name. Concerns listed in `CONCERN_CANONICAL` get their hand-set name, such as `goal` → `OPENCODE_GOAL_DISABLED` and `dispatch` → `CLI_DISPATCH_AUDIT_DISABLED`. Every other concern falls back to the default shape `SYSTEM_<CONCERN>_DISABLED`.

`LEGACY_ALIASES` maps some concerns to older `MK_`, `SPECKIT_` or plugin-owned names that also disable them. Some concerns, such as `session-handover`, `live-sync` and `git-commit-hooks`, have none.

`isFlagOn(name, env?, config?)` answers the same question for one named switch that is not a hook concern. The `SPECKIT_SKIP_VALIDATION` and `SKDOC_SKIP_VALIDATION` validation switches are the example. The environment answers whenever the name is set there, even to an empty value. The config file answers otherwise.

**Where flags come from.** Flags resolve from two sources: the live environment and an optional operator config file. The file is `hook-flags.env`, a sibling of this folder, overridable via `HOOK_FLAGS_CONFIG`. The environment always wins over the file for a given key, so a persisted default can still be overridden per session.

The config file is read once per process and cached, and tests reset the cache via `_resetConfigCache()`. In the file a `#` after a space or tab ends a value. So `SYSTEM_SKILL_ADVISOR_DISABLED=1  # why` reads as `1`.

Every reader of the file applies that rule: `hook-flags.cjs`, `hook-flags.sh`, sk-doc's `validation_switch.py` and sk-code's `check-dist-staleness.sh`. A test in `hook-flags.test.cjs` holds all four to the same answers.

**The env bridge.** At load, `hook-flags.cjs` calls `env-aliases.cjs.applyEnvAliases()`. That copies every legacy `MK_*` env value forward onto its new name. It copies only when the new name is unset, so a value set under the new name always wins. So an operator who still exports an `MK_` name keeps that setting under its current name.

**Adapter plumbing.** `hook-adapter-shared.cjs` provides `readStdin({ timeoutMs })` and `parseJsonFailOpen(raw)`. The reader resolves at a 3000 ms deadline with the bytes read so far, and it rejects on a stream error. A stream past its byte cap resolves to an empty string instead of throwing. The parser resolves to `null` instead of throwing.

CommonJS adapters `require()` the file, and ESM adapters import `readStdin` and `parseJsonFailOpen` by name. Node reads those names from the `module.exports` object literal. Behavior is byte-identical for every consumer.

**Session readers.** `session-readers/` resolves one exact session id per runtime. It projects the store's records into the shared `HistoryEntry` list and writes nothing. Its `capabilities` export is the source of truth for which runtimes are `ready`. Cursor stays `gated` until its PreCompact delivery is confirmed. The decision-capture sweeps keep their own readers and remain the writers.

**The POSIX mirror.** `hook-flags.sh` exposes `hook_enabled <concern>` for shell entrypoints. It resolves the config file at source time: explicit `HOOK_FLAGS_CONFIG`, then `__hf_root`, then `git rev-parse --show-toplevel`.

It checks the master switch and the default-shape `SYSTEM_<CONCERN>_DISABLED`. It also carries the `session-handover` enable switches, the runtime one included. It does not carry the `CONCERN_CANONICAL` overrides or `LEGACY_ALIASES`. Shell entrypoints that need those must use the Node resolver instead.

`hook_flag_on <name>` checks one named switch with the same precedence. It refuses any name that is not a plain variable name before the resolver's `eval` sees it. Shell entrypoints load the file with `source` and then call `hook_enabled <concern>`. `.skilled/bin/worktree-guard.sh` sources it, as do the git hooks and `validate.sh`.

**Boundaries.** Imports are Node builtins only. `hook-flags.cjs` imports `node:fs`, `node:path` and `./env-aliases.cjs`. `hook-adapter-shared.cjs` imports nothing. `payload-dir.mjs` imports `node:fs`, `node:path` and `node:url`. The ESM facade imports `node:module` only.

Only helpers genuinely shared by multiple concerns belong here. A concern-specific helper goes in that concern's `lib/`.

The resolver is default-on. A missing or unreadable config file, a missing env var or any parse failure resolves to enabled. A default-off concern resolves to off in the same cases, except on a runtime `DEFAULT_ON_RUNTIMES` lists, which is `claude`. `parseJsonFailOpen` returns `null` instead of throwing.

The ESM facade is zero-drift by construction, because it re-exports the `.cjs` implementation, while the `.sh` mirror is a manual port and intentionally narrower.

---

## 3. DIRECTORY TREE

```text
shared/
+-- hook-flags.cjs                   # canonical kill-switch resolver
+-- hook-flags.mjs                   # ESM facade over .cjs
+-- hook-flags.sh                    # POSIX sh mirror
+-- hook-flags.test.cjs              # node --test suite for the resolver
+-- env-aliases.cjs                  # copies MK_* env values forward at load
+-- hook-adapter-shared.cjs          # readStdin() + parseJsonFailOpen()
+-- hook-adapter-shared.test.cjs     # node --test suite for the reader
+-- hook-stdin-deadline.test.mjs     # node --test suite for the deadline
+-- payload-dir.mjs                  # where a payload cwd points, and whether a hook may write there
+-- session-reader-declarations.mjs  # rebuilds or checks the .d.mts files
+-- dsh/                             # DSH loader and fan-out leaf marker
+-- session-readers/                 # one reader per runtime, plus identity, index and project
`-- tests/                           # DSH loader test and plugin test helpers
```

`dsh/` holds `dsh-llm.mjs`, which resolves the dsh packages from the running dsh binary. It also holds `session-role.mjs`, which marks a fan-out leaf.

`session-readers/` holds one reader per runtime plus `identity.mjs`, `index.mjs` and `project.mjs`. Each file has a `.d.mts` type file beside it. Its own README stays.

`tests/` holds the DSH loader test and the fake plugin contexts the DSH adapter suites use. `tests/session-readers/` holds the reader suites.

---

## 4. KEY FILES

| File | Responsibility |
|---|---|
| `hook-flags.cjs` | Canonical kill-switch resolver. Exports `isHookEnabled(concern, env?, config?)`, `isFlagOn(name, env?, config?)`, `concernFlag()`, `isTruthy()`, `loadConfigFile()`, `configPath()` and `_resetConfigCache()`. Owns `MASTER_FLAG`, `MASTER_ALIASES`, `CONCERN_CANONICAL` and `LEGACY_ALIASES`. Calls `env-aliases.cjs` at load. Caches the config file per process. |
| `hook-flags.mjs` | ESM facade over `hook-flags.cjs` through `createRequire`. Zero drift. |
| `hook-flags.sh` | POSIX sh mirror. `hook_enabled <concern>` returns 0 unless the master or default-shape switch is truthy. `hook_flag_on <name>` returns 0 when one named switch is truthy. Resolves the config file at source time. Also carries the `session-handover` enable switches. Carries no canonical-name override and no legacy alias. |
| `env-aliases.cjs` | Back-compat bridge. `applyEnvAliases(env?)` copies every legacy `MK_*` value forward when the new name is unset. `PREFIX_RULES` maps specific prefixes, such as `MK_GOAL_` → `OPENCODE_GOAL_` and `MK_CLI_DISPATCH_AUDIT_` → `CLI_DISPATCH_AUDIT_`. The catch-all `MK_` → `SYSTEM_` rule handles the rest. |
| `hook-adapter-shared.cjs` | `readStdin({ timeoutMs })` and `parseJsonFailOpen()`. The reader resolves at a 3000 ms deadline with the bytes read so far. The parser returns `null` on bad JSON. |
| `hook-flags.test.cjs` | `node --test` suite. Covers default-on, the master switch, the per-concern switch, `concernFlag` derivation, config-file merge, legacy-alias parity, named-switch precedence in both resolvers and trailing comments in all four readers of the file. |
| `hook-adapter-shared.test.cjs` | `node --test` suite. A never-closed stdin resolves at the deadline and its process exits. Complete input comes back whole. |
| `hook-stdin-deadline.test.mjs` | `node --test` suite. With stdin left open and never written, each ESM adapter in its list exits 0 at the deadline with its fail-open output. The adapters no other suite spawns still answer a normal payload. |
| `payload-dir.mjs` | `sessionDirFor(cwd)` resolves a payload's relative cwd against the checkout and falls back to the checkout when none is given. `existingDirectory(path)` is true only for an absolute path that already exists as a directory, so a payload cannot make a hook create a tree wherever it names. The Vibe session-lifecycle, decision-capture and ask-surface adapters import it, and `.vibe/plugins/repo-guards/lib/hook-io.mjs` re-exports it for the Vibe guards. |
| `session-readers/` | Read-only reader package. `readSession()` resolves one exact session id per runtime and projects it into the shared `HistoryEntry` list. It writes nothing. Claude, Codex, Pi, OpenCode, Devin, DSH and Vibe are `ready`. Cursor is `gated`. See [`session-readers/index.mjs`](./session-readers/index.mjs). |
| `session-reader-declarations.mjs` | Rebuilds the committed `session-readers/*.d.mts` declarations that TypeScript callers read. With `--check` it reports any that no longer match their source. The compiler will not overwrite a declaration in place, so a plain build never refreshes them. It builds in a temporary copy and borrows the TypeScript compiler that the system-spec-kit skill installs. No hook loads it. |
| `dsh/` | Loader and leaf marker for the DSH adapters. `dsh-llm.mjs` resolves the dsh packages from the running dsh binary. `session-role.mjs` marks a fan-out leaf. |
| `tests/` | Shared test layer for the DSH adapters. `dsh-llm.test.mjs` checks the loader. `dsh-plugin-harness.mjs` builds fake plugin contexts. |

Three module flavors exist so a different runtime's adapter can import the resolver without a module-system mismatch. `hook-flags.cjs` serves Claude, Codex, Devin, Cursor (via `.mjs`) and the OpenCode plugins (via `createRequire`). `hook-flags.mjs` serves Cursor, Pi (via `.ts`) and the ESM adapters. `hook-flags.sh` serves the shell entrypoints, such as the git hooks, `validate.sh` and `.skilled/bin/worktree-guard.sh`. Dist-freshness carries its own Python port.

`hook-adapter-shared.cjs` has two consumer groups. CommonJS adapters `require()` it, such as `mcp-route-guard/{claude,codex,devin}`, `subagent-dispatch-guard/{claude,devin}`, `post-edit-quality/{claude,codex,devin}`, `overlay-guard/{claude,codex,devin}`, `ask-surface-guard/{claude,lib}` and `env-secret-guard/command-hook`. ESM adapters import `import { readStdin }` from it, such as `classifier-injection-screen/{claude,devin}`, `cli-dispatch/{claude,codex,cursor,devin}` (preflight), `cli-dispatch/{claude,codex,devin}` (audit), `goal/{cursor,devin}`, `mcp-route-guard/cursor`, `subagent-dispatch-guard/{cursor,claude}`, `session-handover/{claude,codex}`, `decision-capture/{claude,devin,vibe}` and `overlay-guard/cursor`. The session-handover adapters also import `parseJsonFailOpen`. The relative specifier climbs from the adapter's runtime folder to the hooks root and then into `shared/`. Node reads the named exports from the CommonJS file.

The resolver family gates these concerns:

- `skill-advisor`, `spec-gate`, `completion`, `codex-watchdog` and `permission-policy`
- `directive-lifecycle`, `dispatch`, `dispatch-guard`, `post-edit-quality` and `task-dispatch`
- `mcp-route-guard`, `goal`, `git-preflight`, `session-lifecycle` and `git-worktree-guard`
- `git-hooks-check`, `dist-freshness`, `session-cleanup`, `hook-install` and `git-commit-hooks`
- `live-sync`, `live-follow`, `injection-screen`, `session-handover` and `primary-reconcile`
- `overlay-guard`, `decision-capture`, `ask-surface` and `env-secret-guard`

Pi's bundled SessionStart adapter calls `isHookEnabled()` separately for each advisory concern.

---

## 5. CONFIGURATION

The resolver is itself the configuration mechanism for every other concern. Operators interact with it through env vars and the config file, not through this folder.

| Variable | Effect |
|---|---|
| `SYSTEM_HOOKS_DISABLED=1` | Master switch. Disables every concern across every runtime. |
| `MK_HOOKS_DISABLED=1` | Legacy alias of the master switch. |
| `SYSTEM_<CONCERN>_DISABLED=1` | Default-shape per-concern switch, such as `SYSTEM_TASK_DISPATCH_DISABLED=1`. Derivable via `concernFlag(concern)`. |
| `SYSTEM_SESSION_HANDOVER_ENABLED=1` | Enable flag for `session-handover`, the one default-off concern. Without it, or a runtime's own flag, the concern stays silent on every runtime but Claude Code. A set value, `1` or `0`, decides for Claude Code too. `SYSTEM_SESSION_HANDOVER_DISABLED=1` and the master switch still win. |
| `SYSTEM_SESSION_HANDOVER_<RUNTIME>_ENABLED=1` or `=0` | Per-runtime enable flag for `session-handover`, one each for `CLAUDE`, `CODEX`, `PI`, `OPENCODE`, `CURSOR`, `DEVIN` and `VIBE`. A non-empty value wins over `SYSTEM_SESSION_HANDOVER_ENABLED` for that runtime. An empty or unset value falls back to it. `SYSTEM_SESSION_HANDOVER_ENABLED=1` with `SYSTEM_SESSION_HANDOVER_CLAUDE_ENABLED=0` is on for every runtime except Claude Code. The disable switch and the master switch still win. |
| `OPENCODE_GOAL_DISABLED=1` | Canonical name for `goal`, which does not follow the default shape. Six concerns have hand-set canonical names in `CONCERN_CANONICAL`. See the table below. |
| `HOOK_FLAGS_CONFIG` | Override path for the operator config file. The default is `.skilled/hooks/hook-flags.env`. |

Concerns whose canonical name does not follow the default `SYSTEM_<CONCERN>_DISABLED` shape:

| Concern | Canonical flag |
|---|---|
| `goal` | `OPENCODE_GOAL_DISABLED` |
| `dispatch` | `CLI_DISPATCH_AUDIT_DISABLED` |
| `mcp-route-guard` | `MCP_ROUTE_GUARD_DISABLED` |
| `codex-watchdog` | `CODEX_HOOKS_WATCHDOG_DISABLED` |
| `git-preflight` | `SK_GIT_PREFLIGHT_DISABLED` |
| `post-edit-quality` | `SK_CODE_POST_EDIT_QUALITY_DISABLED` |

`LEGACY_ALIASES` maps some concerns to older `MK_`, `SPECKIT_` or plugin-owned names that also disable them. Some concerns, such as `session-handover`, `live-sync` and `git-commit-hooks`, have none. The config file is `hook-flags.env`, copied from `hook-flags.env.example` and gitignored. It lets an operator persist choices without exporting env vars every session. The environment always wins over the file.

---

## 6. VALIDATION

Run from the repository root.

```bash
node --test .skilled/hooks/shared/hook-flags.test.cjs
```

Expected result: all tests pass. The suite covers default-on, the master switch, the per-concern switch, `concernFlag` derivation, config-file merge, legacy-alias parity, named-switch precedence and trailing comments.

`hook-adapter-shared.cjs` is covered by its consumers' own suites:

```bash
node --test .skilled/hooks/mcp-route-guard/lib/mcp-route-guard.test.cjs .opencode/plugins/tests/claude-task-dispatch-guard.test.cjs
```

Expected result: all tests pass.

The stdin deadline has its own suites. The first checks the reader itself. The second checks that each ESM adapter exits at the deadline when its stdin never closes:

```bash
node --test .skilled/hooks/shared/hook-adapter-shared.test.cjs .skilled/hooks/shared/hook-stdin-deadline.test.mjs
```

Expected result: all tests pass. The second suite takes about 3 seconds because it waits out the reader's deadline.

The session readers have their own suite:

```bash
node --test .skilled/hooks/shared/tests/session-readers/*.test.mjs
```

Expected result: every test passes. That includes the store-unchanged check that every reader leaves the seven fixture stores untouched. It also includes the declaration check, which is skipped when the TypeScript compiler is not installed.

After changing a reader's exports or return shapes, rebuild its declarations:

```bash
node .skilled/hooks/shared/session-reader-declarations.mjs
```

---

## 7. RELATED

- [`../README.md`](../README.md): the unified hooks tree this helper serves, with the full kill-switch index and coverage matrix.
- [`../hook-flags.env.example`](../hook-flags.env.example): the operator config file template.
- [`../injection-contract.md`](../injection-contract.md): runtime injection visibility contract.
- [`./session-readers/README.md`](./session-readers/README.md): the reader package contract and its failure codes.
