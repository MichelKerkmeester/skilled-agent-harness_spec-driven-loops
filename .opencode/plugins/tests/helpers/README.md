---
title: "Helpers: Shared Test Utilities"
description: "Shared continuation-log and env-restore helpers used by the plugin test suites in the parent directory."
trigger_phrases:
  - "test helpers folder"
  - "continuation-log helper"
---

# Helpers: Shared Test Utilities

---

## 1. OVERVIEW

`helpers/` holds shared utility functions for the sibling `*.test.cjs` files in `.skilled/plugins/tests/`. It centralizes continuation-log reading and environment-variable restoration so individual test files do not duplicate that logic, and it reads the plugin inventory and scans plugin sources for the v2 suites. The helpers are CJS (`.cjs`) so they can be `require()`'d directly by the CJS test shells.

Current state: two modules. `continuation-log.cjs` exports two functions and is consumed by four goal-plugin test files through `require('./helpers/continuation-log.cjs')`. `plugin-inventory.cjs` reads the plugin inventory and uses a rolldown AST parse to find the event names each plugin compares against; it is consumed by `plugin-inventory.test.cjs`, `v2-registration.test.cjs` and `v2-hard-plugins.test.cjs`.

---

## 2. WHAT'S HERE / INVENTORY

| File | Consumers | Responsibility |
|---|---|---|
| `continuation-log.cjs` | `opencode-goal-lifecycle.test.cjs`, `opencode-goal-state.test.cjs`, `opencode-goal-continuation.test.cjs`, `opencode-goal-capabilities.test.cjs` | Reads continuation-log entries from a state directory and restores environment variables after a test. |
| `plugin-inventory.cjs` | `plugin-inventory.test.cjs`, `v2-registration.test.cjs`, `v2-hard-plugins.test.cjs` | Reads the plugin inventory and scans each plugin's source with rolldown's AST parser for the event names it compares against, reporting the checks it cannot trace. |

---

## 3. DIRECTORY TREE

```text
helpers/
+-- README.md
+-- continuation-log.cjs
`-- plugin-inventory.cjs
```

---

## 4. KEY FILES

| File | Responsibility |
|---|---|
| `continuation-log.cjs` | Exports `readContinuationEntries(stateDir)` and `restoreEnv(name, value)`. Uses `node:fs/promises` and `node:path` only. |

### Entrypoints

| Entrypoint | Type | Purpose |
|---|---|---|
| `readContinuationEntries(stateDir)` | `async Function` | Reads `.continuation.log` from `stateDir`, parses each line as JSON, and returns the entries. Returns an empty array when the file does not exist (`ENOENT`); re-throws any other read/parse error. |
| `restoreEnv(name, value)` | `Function` | Sets `process.env[name]` to `value`, or deletes the key when `value` is `undefined`. Used to restore env state after a test toggles a kill-switch. |

---

## 5. CONFIGURATION

None. The helpers are pure utility functions with no configuration surface.

---

## 6. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| CJS | `.cjs` so the CJS test shells can `require()` directly. |
| Fail-open on missing file | `readContinuationEntries` returns `[]` on `ENOENT`; re-throws any other error so a genuine parse failure is not silently swallowed. |
| No side effects on success | `restoreEnv` mutates only the named env key. |
| No external deps in `continuation-log.cjs` | Node builtins only (`node:fs/promises`, `node:path`). `plugin-inventory.cjs` resolves `rolldown/parseAst` from the repository root. |

---

## 7. VALIDATION

The helpers are exercised by their consuming suites; there is no standalone helper test. Run the consuming suites to validate:

```bash
node --test .skilled/plugins/tests/opencode-goal-lifecycle.test.cjs \
         .skilled/plugins/tests/opencode-goal-state.test.cjs \
         .skilled/plugins/tests/opencode-goal-continuation.test.cjs \
         .skilled/plugins/tests/opencode-goal-capabilities.test.cjs
```

Expected result: all four suites pass (confirms the helpers behave as their consumers expect).

```bash
node --check .skilled/plugins/tests/helpers/continuation-log.cjs
```

Expected result: no syntax error.

```bash
node --check .opencode/plugins/tests/helpers/plugin-inventory.cjs
```

Expected result: no syntax error.

---

## 8. RELATED

- [`../README.md`](../README.md): the plugin test suites that consume these helpers.
- [`../../README.md`](../../README.md): the plugin entrypoints under test.
