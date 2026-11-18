---
title: "Divergent pivot seat cap and council retry"
description: "A divergent pivot council runs at most three seats per attempt, and a retryable first-attempt quorum failure reopens the pivot once as attempt 2."
trigger_phrases:
  - "divergent pivot seat cap"
  - "council quorum retry"
  - "maxCouncilSeatOutputs"
  - "pivot attempt 2"
version: 1.0.1.0
---

# Divergent pivot seat cap and council retry

## 1. OVERVIEW

A divergent pivot runs a council of seats. The seat cap is three per council attempt. When the first attempt misses council quorum in a retryable way, the workflow reopens the pivot once as attempt 2, and that retry is the only re-entry.

---

## 2. HOW IT WORKS

### Seat Cap

`maxCouncilSeatOutputs` defaults to 3 in `runtime/lib/deep-loop/divergent-pivot.ts`. The research and review pivot scripts scope the seat count to the current pivot id and attempt.

### One Retry

When finalize reports a retryable council quorum failure, the research and review command workflows reopen the pivot once as attempt 2. The skip condition stops any further retry, so attempt 2 never reopens.

### Attempt Identity

Seat event ids include the attempt number, so attempt 2 does not reuse attempt 1 event ids or seat paths. `runtime/scripts/divergent-pivot.cjs` carries the attempt number and the retry signal through its `prepare` and `finalize` subcommands, which is the seam the workflows call.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/divergent-pivot.ts` | Shared | Seat cap default, seat scope and retryable quorum result. |
| `.skilled/skills/system-deep-loop/runtime/scripts/divergent-pivot.cjs` | Script | Carries the attempt number and retry signal through `prepare` and `finalize`. |
| `.skilled/skills/system-deep-loop/deep-research/scripts/divergent-research-pivot.ts` | Script | Scopes the research seat count to the pivot id and attempt. |
| `.skilled/skills/system-deep-loop/deep-review/scripts/divergent-review-pivot.ts` | Script | Scopes the review seat count to the pivot id and attempt. |
| `.skilled/commands/deep/assets/deep-review.yaml` | Command workflow | Reopens the pivot once as attempt 2 after a retryable quorum failure. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.skilled/skills/system-deep-loop/runtime/tests/integration/divergent-pivot.vitest.ts` | Vitest | Seat scope, the attempt-2 retry, and attempt identity cases. |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/divergent-pivot-seat-scope.vitest.ts` | Vitest | Seat-count scope per pivot id and attempt. |
| `.skilled/skills/system-deep-loop/runtime/tests/council/multi-seat-dispatch.vitest.ts` | Vitest | Multi-seat dispatch with any seat ids, unchanged by this behavior. |
| `.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/council/divergent-council-quorum-retry.md` | Manual playbook | DLR-062: three seats per attempt and one retry after a first-attempt quorum miss. |

---

## 4. SOURCE METADATA

- Group: Council
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `council/divergent-pivot-seat-cap-and-retry.md`

Related references:
- [multi-seat-dispatch.md](multi-seat-dispatch.md) - Multi-seat dispatch
