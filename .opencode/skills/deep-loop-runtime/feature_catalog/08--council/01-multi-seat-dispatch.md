---
title: "Multi-seat dispatch"
description: "Runs seat executors in parallel for one council round; preserves seat result order; returns fulfilled or rejected per-seat outcomes plus round summary counts."
---

# Multi-seat dispatch

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. CURRENT REALITY](#2--current-reality)
- [3. SOURCE FILES](#3--source-files)
- [4. SOURCE METADATA](#4--source-metadata)

---

## 1. OVERVIEW

Runs seat executors in parallel for one council round; preserves seat result order; returns fulfilled or rejected per-seat outcomes plus round summary counts.

This feature belongs to the council group and is catalogued as F018 in the `deep-loop-runtime` inventory.

---

## 2. CURRENT REALITY

Promise.allSettled-based fan-out across N seats per council round. Each seat receives the round prompt and an isolated workspace; results are preserved in seat order regardless of completion order. Per-round summary counts (fulfilled / rejected / total) emitted to the round JSONL alongside per-seat outcomes.

The implementation is source-backed and covered by runtime-owned tests under `.opencode/skills/deep-loop-runtime/tests/council/`. Treat this as shipped behavior, not a roadmap claim.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `lib/council/multi-seat-dispatch.cjs` | Runtime | Parallel seat dispatcher with order-preserving result aggregation. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `tests/council/multi-seat-dispatch.vitest.ts` | Test | Primary regression coverage for Multi-seat dispatch. |

---

## 4. SOURCE METADATA

- Group: Council
- Canonical catalog source: `feature_catalog.md`
- Feature ID: F018
- Feature file path: `08--council/01-multi-seat-dispatch.md`
- Primary sources: `lib/council/multi-seat-dispatch.cjs`, `tests/council/multi-seat-dispatch.vitest.ts`
