---
title: "runtime council tests"
description: "Vitest coverage for council dispatch, scoring, cost guards and session state."
trigger_phrases:
  - "runtime council tests"
  - "council test suite"
---

# Council Tests

---

## 1. OVERVIEW

This folder tests the council runtime contracts. It covers multi-seat dispatch, adjudicator verdict scoring, budget and cost guard behavior, round-state JSONL records and session-state hierarchy.

The suite is the executable verification surface for council primitives used by the mode workflow.

---

## 2. FILES

| File | Responsibility |
|---|---|
| `adjudicator-verdict-scoring.vitest.ts` | Checks adjudicator verdict scoring and evidence weighting. |
| `cost-guards.vitest.ts` | Checks council cost limits and fail-closed guard behavior. |
| `multi-seat-dispatch.vitest.ts` | Checks multi-seat dispatch requests and returned seat outcomes. |
| `round-state-jsonl.vitest.ts` | Checks round-state JSONL serialization and recovery. |
| `session-state-hierarchy.vitest.ts` | Checks council session-state hierarchy and ownership. |

---

## 3. PUBLIC SURFACE

| Surface | Entry |
|---|---|
| Test command | `vitest run -- tests/council` |
| Covered boundary | Council dispatch and durable round-state contracts |

The files are tests rather than importable production modules. They protect the council APIs exposed by the runtime library.

---

## 4. SPINE ROLE

Council tests verify the multi-seat branch of the runtime spine after event and state contracts are established. They assert that dispatch outcomes, scored verdicts and session state remain durable and bounded.

---

## 5. VALIDATION

```bash
.opencode/skills/system-deep-loop/runtime/node_modules/.bin/vitest run --config .opencode/skills/system-deep-loop/runtime/vitest.config.ts tests/council
```

---

## 6. RELATED

- [Runtime test index](../README.md)
- [Runtime library](../../lib/README.md)
- [Runtime overview](../../README.md)
