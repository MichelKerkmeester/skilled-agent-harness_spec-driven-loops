---
title: "Claim Continuity"
description: "Tracks claim identity across loop iterations by matching, folding and replaying claim events into a disposable frontier projection."
---

# Claim Continuity

---

## 1. OVERVIEW

Identity substrate that lets a later loop iteration recognize a claim it already saw. Claim matching normalizes display aliases so wording differences do not create a new identity. The reducer recomputes the full projection from the retained event journal. The frontier only extends after the base and claim frontiers agree at the same ledger cursor. The shadow comparator runs this projection beside the legacy path without changing what legacy callers see.

## 2. CONTENTS

| File | Purpose |
|------|---------|
| `claim-continuity-events.ts` | `createClaimContinuityEventRegistry`, the closed event manifest, including read contracts for sibling relationships |
| `claim-continuity-types.ts` | `ClaimContinuityError`, the bounded failure that never substitutes an unverified claim projection |
| `claim-frontier.ts` | `createClaimContinuityFrontier`, creating the compact extension only after base and claim frontiers agree |
| `claim-matching.ts` | `normalizeClaimAlias`, normalizing display aliases for exact lookup without treating wording as identity |
| `claim-reducer.ts` | `recomputeClaimContinuityState`, recomputing the complete disposable projection from the retained event journal |
| `claim-replay.ts` | `createClaimContinuityReplayComponentRegistry`, binding replay to the complete content-addressed identity projection |
| `claim-service.ts` | `ClaimContinuityService`, the authorized dark service whose legacy readers and writers stay outside this boundary |
| `claim-shadow.ts` | `compareClaimShadow`, comparing projections without changing the result returned by the legacy path |
| `index.ts` | Public API surface |

## 3. CONSUMERS

- `.opencode/skills/system-deep-loop/runtime/lib/cycle-detection/cycle-observation.ts`
- `.opencode/skills/system-deep-loop/runtime/lib/cycle-detection/cycle-detection-types.ts`
- `.opencode/skills/system-deep-loop/runtime/lib/cycle-detection/cycle-detection-policy.ts`

## 4. TESTS

- `.opencode/skills/system-deep-loop/runtime/tests/unit/claim-continuity.vitest.ts`

## 5. RELATED

- [`runtime/lib README`](../README.md)
- [`deep-loop/continuity-identity`](../deep-loop/continuity-identity/README.md)
- [`cycle-detection`](../cycle-detection/README.md)
