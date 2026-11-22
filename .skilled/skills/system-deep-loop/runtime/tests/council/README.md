---
title: "runtime council tests"
description: "Vitest coverage for the seat dispatch used by the divergent pivot."
trigger_phrases:
  - "runtime council tests"
  - "council test suite"
---

# Council Tests

---

## 1. OVERVIEW

This folder tests the one council runtime contract that remains: the parallel seat dispatch in [`../../lib/council/multi-seat-dispatch.cjs`](../../lib/council/multi-seat-dispatch.cjs).

The suite is the executable verification surface for `dispatchCouncilSeats`, the helper the divergent pivot calls to convene seats for a stalled research or review run.

---

## 2. FILES

| File | Responsibility |
|---|---|
| `multi-seat-dispatch.vitest.ts` | Checks multi-seat dispatch requests, order-preserving results and returned seat outcomes. |

---

## 3. PUBLIC SURFACE

| Surface | Entry |
|---|---|
| Test command | The command in section 5, VALIDATION |
| Covered boundary | Seat dispatch and per-seat outcome aggregation |

The file is a test rather than an importable production module. It protects the seat-dispatch API exposed by the runtime library.

---

## 4. SPINE ROLE

Council tests verify the multi-seat branch of the runtime spine after event and state contracts are established. They assert that dispatch outcomes stay ordered and that per-seat failures are captured rather than thrown.

---

## 5. VALIDATION

```bash
.skilled/skills/system-deep-loop/runtime/node_modules/.bin/vitest run --config .skilled/skills/system-deep-loop/runtime/vitest.config.ts tests/council
```

Expected result: Vitest prints `Test Files  1 passed (1)` and exits 0.

---

## 6. RELATED

- [Runtime test index](../README.md)
- [Runtime library](../../lib/README.md)
- [Runtime overview](../../README.md)
