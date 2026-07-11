---
title: "Helpers: Shared Test Utilities"
description: "Shared continuation-log helpers used by the plugin test suite."
trigger_phrases:
  - "test helpers folder"
---

# Helpers: Shared Test Utilities

---

## 1. OVERVIEW

`helpers/` holds shared utility functions for the sibling `*.test.cjs` files in `.opencode/plugins/tests/`. It centralizes continuation-log reading and environment-variable restoration so individual test files do not duplicate that logic.

Current state:

- One module, `continuation-log.cjs`, exporting two functions.
- Consumed by four test files through `require('./helpers/continuation-log.cjs')`.

---

## 2. KEY FILES

| File | Responsibility |
|---|---|
| `continuation-log.cjs` | Reads continuation-log entries from a state directory and restores environment variables after a test |

---

## 3. ENTRYPOINTS

| Entrypoint | Type | Purpose |
|---|---|---|
| `readContinuationEntries(stateDir)` | Function | Reads `.continuation.log` from `stateDir`, parses each line as JSON and returns the entries. Returns an empty array when the file does not exist |
| `restoreEnv(name, value)` | Function | Sets `process.env[name]` to `value`, or deletes the key when `value` is `undefined` |

Consumed by:

- `mk-goal-lifecycle.test.cjs`
- `mk-goal-state.test.cjs`
- `mk-goal-continuation.test.cjs`
- `mk-goal-capabilities.test.cjs`

---

## 4. RELATED

- [`Tests README`](../README.md)
