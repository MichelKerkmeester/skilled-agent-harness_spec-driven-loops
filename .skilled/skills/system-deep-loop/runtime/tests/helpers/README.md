---
title: "runtime test helpers"
description: "Shared child-process and fixture helpers for runtime tests and stub executors."
trigger_phrases:
  - "runtime test helpers"
  - "spawn cjs helper"
---

# Test Helpers

---

## 1. OVERVIEW

This folder contains the shared helpers for tests that invoke CommonJS runtime scripts or stand in for a fan-out lineage. They centralize spawn handling and result capture beside gateway-backed stub appends and fixture state. Suites can then assert command behavior without duplicating that handling.

---

## 2. FILES

| File | Responsibility |
|---|---|
| `completed-lineage-state.cjs` | Writes the state rows and one ledger frame of a finished lineage, so a stub executor passes the runner's checks. Callable with `require` or as `node completed-lineage-state.cjs <lineageDir> [research\|review ...]`, which prints usage and exits 2 when `<lineageDir>` is missing. |
| `gateway-backed-lineage.ts` | Builds shell and Node snippets that let a stub executor append its state rows through the real `append-mode-event.cjs` gateway. Also exports `resolveRepositoryRoot`. |
| `legacy-real-log.ts` | Reads the captured legacy research, review and journal JSONL logs and lists the records a compatibility decision blocks as `unknown-legacy-record`. |
| `spawn-cjs.ts` | Spawns a CommonJS runtime entry point and captures its process result for assertions. Also builds the hermetic child environment (`createHermeticEnv`). |

---

## 3. PUBLIC SURFACE

| Surface | Entry |
|---|---|
| Process helper | `spawn-cjs.ts` |
| Gateway stub helpers | `gateway-backed-lineage.ts` |
| Lineage state fixture | `completed-lineage-state.cjs` |
| Legacy log fixtures | `legacy-real-log.ts` |

The helpers are test-only. Suites that cross the CLI boundary import them, and stub executor scripts load `completed-lineage-state.cjs` directly.

---

## 4. SPINE ROLE

The helpers are the test harness seam between runtime scripts and process-level assertions. They verify the command boundary without becoming part of the production runtime spine.

---

## 5. VALIDATION

```bash
.skilled/skills/system-deep-loop/runtime/node_modules/.bin/vitest run --config .skilled/skills/system-deep-loop/runtime/vitest.config.ts tests/unit/spawn-cjs.vitest.ts tests/unit/hermetic-env.vitest.ts
```

Expected result: `Test Files  2 passed (2)`. These suites exercise `spawn-cjs.ts` directly. No type check covers this folder, because the runtime [`../../tsconfig.json`](../../tsconfig.json) includes only the library sources and excludes every test file.

---

## 6. RELATED

- [Runtime test index](../README.md)
- [Integration tests](../integration/README.md)
- [Runtime scripts](../../scripts/README.md)
