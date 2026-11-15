---
title: "Council Primitives"
description: "Parallel seat dispatch for the divergent pivot in research and review runs."
---

# Council Primitives

---

## 1. OVERVIEW

`multi-seat-dispatch.cjs` runs seat executors in parallel for one deliberation round, preserves seat result order and returns fulfilled or rejected per-seat outcomes plus round summary counts. The divergent pivot in `lib/deep-loop/divergent-pivot.ts` is its only caller, convening seats when a stalled research or review run is ready to pivot.

The folder holds nothing else.

---

## 2. CONTENTS

| File | Purpose |
|------|---------|
| `multi-seat-dispatch.cjs` | Exports `dispatchCouncilSeats(options)`: normalizes seats, dispatches them under a concurrency cap and returns `round_id`, timestamps, per-seat `results` and a `summary` of total, succeeded, failed and all_failed. |

---

## 3. CONSUMERS

- `lib/deep-loop/divergent-pivot.ts`, the only caller, through `dispatchCouncilSeats`.

---

## 4. TESTS

- `tests/council/multi-seat-dispatch.vitest.ts`
