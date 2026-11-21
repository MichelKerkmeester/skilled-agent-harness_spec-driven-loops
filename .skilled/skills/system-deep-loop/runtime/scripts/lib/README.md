---
title: "runtime scripts internal library"
description: "CLI-only guards and writer-lock helpers shared by runtime scripts."
trigger_phrases:
  - "runtime scripts lib"
  - "CLI guards"
---

# Scripts Internal Library

---

## 1. OVERVIEW

This folder contains the internal CommonJS helpers used by runtime CLI scripts. It validates command inputs, protects writer-lock ownership, classifies subprocess failures, maps errors to exit behavior and installs signal cleanup.

The folder is intentionally narrower than the [runtime library](../../lib/README.md). It owns CLI infrastructure, not domain state or mode policy.

---

## 2. FILES

| File | Responsibility |
|---|---|
| `cli-guards.cjs` | Validates namespaces and paths, coordinates the exclusive writer lock, classifies lineage failures, maps CLI errors to exit codes and installs signal cleanup. It also reads the final answer from a Claude stream-json log, detects pending-question and quota-exhaustion text and provides synchronous stdin and sleep helpers. `maybeThrowTestFault` throws a synthetic fault when `DEEP_LOOP_TEST_FAULT` is set, for contract tests. |

---

## 3. PUBLIC SURFACE

| Surface | Entry |
|---|---|
| CLI guard helpers | `cli-guards.cjs` |

Top-level scripts import these helpers for command-boundary checks. They are not a consumer-facing runtime API.

---

## 4. SPINE ROLE

The helper sits at the outer edge of the runtime spine. It protects the transition from process arguments and subprocess outcomes into durable script behavior before domain modules mutate state.

---

## 5. VALIDATION

The runtime typecheck covers only the TypeScript under `../../lib/`, so it does not check this folder. From the repository root, syntax-check the helper and run the tests that exercise it through the runtime configuration.

```bash
node --check .skilled/skills/system-deep-loop/runtime/scripts/lib/cli-guards.cjs
.skilled/skills/system-deep-loop/runtime/node_modules/.bin/vitest run --config .skilled/skills/system-deep-loop/runtime/vitest.config.ts cli-guards
```

---

## 6. RELATED

- [Runtime scripts](../README.md)
- [Runtime overview](../../README.md)
- [Runtime tests](../../tests/README.md)
