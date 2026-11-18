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

`.skilled/hooks/shared/` holds the code every hook adapter under `.skilled/hooks/` imports, so a hook that needs one of these helpers finds it inside the hooks tree. A few adapters still import a skill-owned module on purpose. Nothing in this folder writes to a session. It answers the questions an adapter asks before it acts.

Current state:

- The kill-switch resolver decides whether a hook runs. It answers on by default, so adding a guard changes no behavior until an operator sets a flag.
- The JSON parser never throws, and a failed parse returns `null`. The stdin reader resolves at its deadline, resolves an empty string past its byte cap and rejects only on a stream error.
- Imports are Node builtins only. That is what keeps the hooks tree portable.
- The session readers resolve one exact session id per runtime and write nothing.

A second copy of the stdin helper serves the spec-gate adapters inside the system-spec-kit skill. Those adapters sit outside the portable set. This folder does not import that copy.

---

## 2. ARCHITECTURE

An adapter sits between a runtime and its payload. It asks this folder one question at a time, then finishes its own work and exits. The switch check comes first, so a disabled concern exits before any payload is read.

```text
╭──────────────────────────────────────────────────────────────╮
│  runtime hooks across every supported runtime                │
╰───────────────────────────────┬──────────────────────────────╯
                                │ payload on standard input
                                ▼
╭──────────────────────────────────────────────────────────────╮
│                    .skilled/hooks/shared/                    │
│                                                              │
│  hook-flags.cjs            may this concern run?             │
│  hook-adapter-shared.cjs   what arrived on standard input?   │
│  payload-dir.mjs           which directory may it write to?  │
│  cli-entry.mjs             is this module the entry script?  │
│  session-readers/          what did that session record?     │
╰──────────────────────────────────────────────────────────────╯
                                │ answer
                                ▼
╭──────────────────────────────────────────────────────────────╮
│  the adapter's own work, then exit                           │
╰──────────────────────────────────────────────────────────────╯

Dependency direction: adapter ──▶ shared
Nothing here imports a hook adapter.
```

---

## 3. PACKAGE TOPOLOGY

Three module flavors exist so an adapter can reach the resolver without a module-system mismatch.

```text
hook-flags.mjs  ──▶  hook-flags.cjs  ──▶  env-aliases.cjs
    facade             resolver             prefix bridge

hook-flags.sh        independent shell port, no import
```

Allowed direction runs from the facade through the resolver to the alias bridge. The facade re-exports the resolver, so both module systems run one implementation.

Nothing here imports a concern folder, and the resolver never imports the readers or the stdin helpers.

CommonJS adapters require the resolver file. ESM adapters import the facade. Shell entrypoints source the port.

---

## 4. DIRECTORY TREE

```text
shared/
+-- hook-flags.cjs                     # kill-switch resolver, the single implementation
+-- hook-flags.mjs                     # ESM facade over the resolver
+-- hook-flags.sh                      # POSIX shell port of the resolver
+-- env-aliases.cjs                    # copies legacy MK_* values onto their current names
+-- hook-adapter-shared.cjs            # readStdin() and parseJsonFailOpen()
+-- payload-dir.mjs                    # which directory a payload names, and whether it may receive a write
+-- cli-entry.mjs                      # is the calling module the script node was started with
+-- session-reader-declarations.mjs    # rebuilds or checks the committed declaration files
+-- hook-flags.test.cjs                # resolver suite
+-- hook-adapter-shared.test.cjs       # stdin reader suite
+-- hook-stdin-deadline.test.mjs       # deadline suite over the ESM adapters
+-- dsh/                               # dsh package loader and the fan-out leaf marker
+-- session-readers/                   # one read-only reader per runtime
+-- tests/                             # shared plugin contexts and the suites beside them
`-- README.md
```

---

## 5. KEY FILES

| File | Responsibility |
|---|---|
| `hook-flags.cjs` | Canonical resolver. Exports `isHookEnabled`, `hookFlagDecision`, `isFlagOn`, `concernFlag`, `runtimeEnableFlag`, `isTruthy`, `loadConfigFile`, `switchAlias`, `configPath` and `_resetConfigCache`, plus the tables `MASTER_FLAG`, `MASTER_ALIASES`, `CONCERN_CANONICAL`, `LEGACY_ALIASES`, `DEFAULT_OFF`, `DEFAULT_ON_RUNTIMES`, `RUNTIMES` and `SWITCH_ALIAS_PREFIXES`. Calls the alias bridge at load and caches the config file per process. |
| `hook-flags.mjs` | ESM facade. Loads the resolver through `createRequire`, so `.mjs` adapters and ESM plugins read one implementation. Its named exports are `isHookEnabled`, `hookFlagDecision`, `concernFlag`, `runtimeEnableFlag`, `isTruthy`, `MASTER_FLAG`, `LEGACY_ALIASES`, `DEFAULT_OFF`, `RUNTIMES`, `loadConfigFile` and `configPath`. Its default export is the whole resolver, so reach `isFlagOn` and the other tables through the default import. |
| `hook-flags.sh` | POSIX shell port. `hook_enabled <concern> [runtime]` returns 1 when the concern is off. `hook_flag_on <name>` checks one named switch and refuses any name that is not a plain variable name. Resolves the config file when it is sourced. Carries the same master switch and the same default-shape concern switch as the Node resolver. It also carries the `session-handover` enable switches. Carries no canonical override and no per-concern legacy alias, though it honors the legacy master alias `MK_HOOKS_DISABLED`. |
| `env-aliases.cjs` | `applyEnvAliases(env?)` copies each `MK_*` value onto its current name when that name is unset. `PREFIX_RULES` lists the specific prefixes first and the catch-all `MK_` → `SYSTEM_` rule last. |
| `hook-adapter-shared.cjs` | `readStdin({ timeoutMs, maxBytes })` resolves at 3000 ms with the bytes received so far, rejects on a stream error and resolves an empty string past the byte cap. `parseJsonFailOpen(raw)` returns `null` on bad JSON. |
| `payload-dir.mjs` | `sessionDirFor(cwd)` resolves a relative payload directory against the checkout and falls back to the checkout. `existingDirectory(path)` is true only for an absolute path that already exists as a directory, so a payload cannot cause a hook to create a tree wherever it names. |
| `cli-entry.mjs` | `isCliEntry(importMetaUrl, entryArg)` compares both paths after `realpathSync`, so a hook reached through a symlinked `.skilled` tree still runs its main step. |
| `session-reader-declarations.mjs` | Development tool. Rebuilds the committed declaration files beside each session reader, or reports stale ones with `--check`. Builds in a temporary copy and borrows the TypeScript compiler that the system-spec-kit skill installs. No hook loads it. |
| `hook-flags.test.cjs` | Resolver suite. Covers default-on, the master switch, the per-concern switch, `concernFlag` derivation, config-file merge, legacy-alias parity, named-switch precedence in both resolvers and trailing comments in every reader of the file. |
| `hook-adapter-shared.test.cjs` | Reader suite. It checks that input ending before the deadline comes back whole, that a stream past the cap resolves empty, that the default cap is 64 MiB and that a never-closed stream resolves at the deadline. |
| `hook-stdin-deadline.test.mjs` | Suite that spawns each listed ESM adapter with stdin left open. Every one exits 0 at the deadline with its fail-open output, and the adapters that no other suite spawns still answer a normal payload. |

`dsh/` holds the loader for the dsh packages and the marker that labels a fan-out leaf. `session-readers/` holds one reader per runtime, a dispatcher, an identity helper and a projection module. `tests/` holds the fake plugin contexts and the suites that sit beside them.

---

## 6. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Imports | Node builtins only. `hook-flags.cjs` also requires `./env-aliases.cjs`. Nothing here imports a concern or a skill. |
| Exports | The resolver, the stdin reader, the payload rules, the CLI-entry check and the session readers. |
| Ownership | A helper that two or more concerns use belongs here. A helper that only one concern uses belongs in that concern's own lib folder. |

Main flow:

```text
╭──────────────────────────────────────────╮
│ runtime starts a hook                    │
╰──────────────────────────────────────────╯
                  │
                  ▼
┌──────────────────────────────────────────┐
│ hook-flags.cjs decides the concern       │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│ readStdin() collects the payload         │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│ parseJsonFailOpen() shapes it            │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│ the adapter's own work, then exit 0      │
└──────────────────────────────────────────┘
```

A disabled concern stops at the second box. It never reads a payload.

### Switch resolution

`isHookEnabled` answers in this order and stops at the first rung that applies.

1. The master switch `SYSTEM_HOOKS_DISABLED`, or its legacy alias `MK_HOOKS_DISABLED`. A truthy value disables every concern on every runtime.
2. The concern's kill switch from `concernFlag()`, or one of its `LEGACY_ALIASES`.
3. For a concern in `DEFAULT_OFF`, the runtime enable switch, then the global enable switch, then the runtime default.
4. Anything left over is on.

A truthy value is `1`, `true`, `yes` or `on`, compared without regard to case after trimming. A value that is not a string is false. Every rung reads the environment first and the config file second for the same key.

Two concerns are off until their enable switch is set. They are `session-handover` and `claude-user-hook-sync`. For `session-handover` the caller names its runtime in `options.runtime`, and that runtime's `SYSTEM_SESSION_HANDOVER_<RUNTIME>_ENABLED` answers while it holds a value. With both of those switches blank, `session-handover` is on for Claude Code alone, because `DEFAULT_ON_RUNTIMES` lists `claude`.

A switch also answers to a second spelling. `SYSTEM_SESSION_HANDOVER_*` falls back to `SYSTEM_IN_SESSION_HANDOVER_*` while the main name is blank.

`hookFlagDecision` returns the same answer with the switch that decided it and a reason of `master`, `kill`, `runtime`, `global` or `default`.

### The config file

The operator config file sits beside this folder, so a choice can persist without an exported variable each session. `HOOK_FLAGS_CONFIG` overrides the path. The file is read once per process, and a test clears the cache with `_resetConfigCache()`.

Four readers share one parse rule, and a test holds all four to the same answers: `hook-flags.cjs`, `hook-flags.sh`, sk-doc's validation switch and sk-code's dist-staleness check. In the file, a hash character after a space or tab ends a value, so a trailing comment still counts. Surrounding quotes on a value are stripped.

Concerns whose kill switch does not follow the default shape:

| Concern | Kill switch |
|---|---|
| `goal` | `OPENCODE_GOAL_DISABLED` |
| `dispatch` | `CLI_DISPATCH_AUDIT_DISABLED` |
| `mcp-route-guard` | `MCP_ROUTE_GUARD_DISABLED` |
| `codex-watchdog` | `CODEX_HOOKS_WATCHDOG_DISABLED` |
| `git-preflight` | `SK_GIT_PREFLIGHT_DISABLED` |
| `post-edit-quality` | `SK_CODE_POST_EDIT_QUALITY_DISABLED` |

Every other concern follows the default shape `SYSTEM_<CONCERN>_DISABLED`.

---

## 7. ENTRYPOINTS

| Entrypoint | Type | Purpose |
|---|---|---|
| `isHookEnabled` | Function | Whether a concern may run on a named runtime. |
| `hookFlagDecision` | Function | The same answer plus the switch that decided it. |
| `isFlagOn` | Function | Whether one named switch outside the concern set is truthy. |
| `concernFlag` | Function | The canonical kill-switch name for a concern. |
| `readStdin` | Function | The payload text, with a 3000 ms deadline and a byte cap. |
| `parseJsonFailOpen` | Function | The parsed payload, or `null`. |
| `sessionDirFor` | Function | The directory a payload's working directory names. |
| `existingDirectory` | Function | Whether that directory may receive a write. |
| `isCliEntry` | Function | Whether the calling module is the script node started. |
| `readSession` | Function | One exact session as the shared entry list. |
| `loadSession` | Function | One exact session as raw neutral records. |
| `hook_enabled` | Shell | The shell port of `isHookEnabled`, runtime argument included. |
| `hook_flag_on` | Shell | The shell port of `isFlagOn`. |
| `session-reader-declarations.mjs` | CLI | Rebuilds or checks the reader declaration files. |

### Declaration rebuild

A reader change that alters an export or a return shape leaves its committed declaration behind, and the compiler refuses to overwrite a declaration in place. The script deletes the old files and rebuilds them.

```bash
node .skilled/hooks/shared/session-reader-declarations.mjs --check
```

Expected output: `STATUS=OK session-reader-declarations: 22 file(s) current`, exit 0. Exit 1 means a declaration is stale, exit 2 means the compiler failed, and exit 3 means the compiler or the Node types are not installed. Run the same command without `--check` to rewrite them.

---

## 8. VALIDATION

Run from the repository root.

```bash
node --test .skilled/hooks/shared/hook-flags.test.cjs
```

Expected output: `pass 31` and `fail 0`.

```bash
node --test .skilled/hooks/shared/hook-adapter-shared.test.cjs
```

Expected output: `pass 5` and `fail 0`.

```bash
node --test .skilled/hooks/shared/hook-stdin-deadline.test.mjs
```

Expected output: `pass 22` and `fail 0`, after about 4 seconds. Each adapter has to wait out the reader's deadline.

```bash
node --test .skilled/hooks/shared/tests/*.test.mjs
```

Expected output: `pass 4` and `fail 0`. The dsh loader test reports itself skipped when dsh is not installed.

```bash
node --test .skilled/hooks/shared/tests/session-readers/*.test.mjs
```

Expected output: `pass 109` and `fail 0`. That run includes the check that every reader leaves its fixture store untouched.

---

## 9. RELATED

- [Hooks hub](../README.md): the kill-switch index and the runtime coverage matrix.
- [Session readers](./session-readers/README.md): the reader contract and its failure codes.
- [DSH helpers](./dsh/README.md): the package loader and the fan-out leaf marker.
- [Shared tests](./tests/README.md): the fake plugin contexts and the suites beside them.
- [Injection contract](../injection-contract.md): what each runtime injects, stated per runtime.
- [Config template](../hook-flags.env.example): the operator config file to copy.
