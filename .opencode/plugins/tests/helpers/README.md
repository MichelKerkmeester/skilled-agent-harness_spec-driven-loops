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

`helpers/` holds shared utility functions for the sibling `*.test.cjs` files in `.opencode/plugins/tests/`. It centralizes continuation-log reading and environment-variable restoration so individual test files do not duplicate that logic. The helpers are CJS (`.cjs`) so they can be `require()`'d directly by the CJS test shells.

Current state: one module, `continuation-log.cjs`, exporting two functions. It is consumed by four goal-plugin test files through `require('./helpers/continuation-log.cjs')`.

---

## 2. WHAT'S HERE / INVENTORY

| File | Consumers | Responsibility |
|---|---|---|
| `continuation-log.cjs` | `opencode-goal-lifecycle.test.cjs`, `opencode-goal-state.test.cjs`, `opencode-goal-continuation.test.cjs`, `opencode-goal-capabilities.test.cjs` | Reads continuation-log entries from a state directory and restores environment variables after a test. |

---

## 3. DIRECTORY TREE

```text
helpers/
+-- README.md
`-- continuation-log.cjs
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
| No external deps | Node builtins only (`node:fs/promises`, `node:path`). |

---

## 7. VALIDATION

The helpers are exercised by their consuming suites; there is no standalone helper test. Run the consuming suites to validate:

```bash
node --test .opencode/plugins/tests/opencode-goal-lifecycle.test.cjs \
         .opencode/plugins/tests/opencode-goal-state.test.cjs \
         .opencode/plugins/tests/opencode-goal-continuation.test.cjs \
         .opencode/plugins/tests/opencode-goal-capabilities.test.cjs
```

Expected result: all four suites pass (confirms the helpers behave as their consumers expect).

```bash
node --check .opencode/plugins/tests/helpers/continuation-log.cjs
```

Expected result: no syntax error.

---

## 8. RELATED

- [`../README.md`](../README.md): the plugin test suites that consume these helpers.
- [`../../README.md`](../../README.md): the plugin entrypoints under test.
