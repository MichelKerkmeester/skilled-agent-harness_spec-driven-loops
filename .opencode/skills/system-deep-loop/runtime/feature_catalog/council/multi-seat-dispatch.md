---
title: "Multi-seat dispatch"
description: "Runs seat executors in parallel for one council round; preserves seat result order; returns fulfilled or rejected per-seat outcomes plus round summary counts."
trigger_phrases:
  - "multi-seat dispatch"
  - "multi-seat-dispatch.cjs"
  - "dispatch council seats"
  - "parallel seat execution"
  - "per-seat outcome aggregation"
version: 1.4.0.4
---

# Multi-seat dispatch

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Runs seat executors in parallel for one council round; preserves seat result order; returns fulfilled or rejected per-seat outcomes plus round summary counts.

This feature belongs to the council group and is catalogued as F018 in the `runtime/` inventory.

---

## 2. HOW IT WORKS

Promise.allSettled-based fan-out across N seats per council round. Each seat receives the round prompt and an isolated workspace; results are preserved in seat order regardless of completion order. Per-round summary counts (fulfilled / rejected / total) emitted to the round JSONL alongside per-seat outcomes.

The implementation is source-backed and covered by runtime-owned tests under `.opencode/skills/system-deep-loop/runtime/tests/council/`. Treat this as shipped behavior, not a roadmap claim.

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
- Feature file path: `council/multi-seat-dispatch.md`
- Primary sources: `lib/council/multi-seat-dispatch.cjs`, `tests/council/multi-seat-dispatch.vitest.ts`
Related references:
- [round-state-jsonl.md](round-state-jsonl.md) — Round-state JSONL
