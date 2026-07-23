---
title: "In-Flight State Classification: Cutover Disposition for Legacy Runtime Rows"
description: "Classifies in-flight legacy state rows against a frozen census contract into upcast, pin, fork, migrate or block dispositions."
---

# In-Flight State Classification

---

## 1. OVERVIEW

Runtime primitives that decide what happens to an in-flight (already running) legacy state row when a `system-deep-loop` workflow mode cuts over to the new ledger-backed runtime. A frozen census contract pins the exact state-backend rows and their per-mode policy. The classifier turns evidence about each row into a disposition (`UPCAST`, `PIN`, `FORK`, `MIGRATE`, `BLOCK`) and a cutover-readiness gate compiles those dispositions into a per-mode handling plan before the cutover proceeds.

## 2. CONTENTS

| File | Purpose |
|------|---------|
| `frozen-census-policy.ts` | Pinned census contract (schema and base SHAs, row count) and the per-row disposition policy keyed by workflow mode |
| `inflight-state-classifier.ts` | Builds and verifies classification manifests, freshness digests and disposition proofs from the census and evidence |
| `inflight-state-types.ts` | Closed disposition and reason-code vocabularies plus evidence and manifest contracts |
| `phase-014-classification-gate.ts` | Turns classification evidence into a per-mode handling plan and cutover readiness verdict |
| `index.ts` | Public API barrel |

## 3. CONSUMERS

- `.opencode/skills/system-deep-loop/runtime/lib/mixed-version-fixtures/reducer-resume-oracle.ts` runs authored fixtures through this classifier to prove resume correctness

## 4. TESTS

- `.opencode/skills/system-deep-loop/runtime/tests/unit/inflight-state-classification.vitest.ts`
