---
title: "DLR-019 -- Round-state JSONL"
description: "Manual validation scenario for Round-state JSONL in the deep-loop-runtime skill."
---

# DLR-019 -- Round-state JSONL

This document captures the realistic user-testing contract, execution flow, and metadata for `DLR-019`.

---

## 1. OVERVIEW

Appends per-round JSONL records with a lock-file single-writer guard; repairs corrupt trailing JSONL before append; fsyncs writes; exposes round-state readers for resume.

### Why This Matters

Council rounds must survive partial-write crashes. If round-state-jsonl drifts, mid-round crashes corrupt state irrecoverably or block resume.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm round-state JSONL behaves as documented and remains aligned with its implementation and tests.
- Layer partition: council runtime durability primitives.
- Real user request: `Validate Round-state JSONL and report whether the current source, persistence surface, and tests agree with the deep-loop-runtime contract.`
- Expected signals: lockfile guard prevents concurrent writers; jsonl-repair runs before append; fsync forces durability; reader API rehydrates round state.
- Pass/fail: PASS if source inspection and matching tests prove the documented behavior; FAIL if expected signals are absent or contradicted.

---

## 3. TEST EXECUTION

### Prerequisites

- Working directory is repository root.
- `deep-loop-runtime` source tree is present.
- Feature catalog entry exists at `feature_catalog/08--council/round-state-jsonl.md`.

### Steps

1. Inspect `lib/council/round-state-jsonl.cjs` for the implementation contract.
2. Inspect `tests/council/round-state-jsonl.vitest.ts` for the primary regression coverage.
3. Run or inspect the matching test assertions for this feature.
4. Capture the source lines, command output, or test assertions that prove the expected signals.
5. Record PASS, PARTIAL, FAIL, or SKIP with rationale.

### Expected Outcome

Round-state JSONL matches the documented current reality, the source anchors are accurate, and validation evidence is reproducible.

### Failure Modes

- Lockfile path or naming changes without corresponding catalog/playbook updates.
- JSONL repair step removed or weakened.
- fsync skipped or made conditional without doc update.
- Evidence is inferred from memory instead of captured from current source or command output.

---

## 4. SOURCE ANCHORS

### Implementation

| File | Role |
|---|---|
| `lib/council/round-state-jsonl.cjs` | Lock-guarded JSONL append + repair + fsync + reader API. |

### Validation

| File | Role |
|---|---|
| `tests/council/round-state-jsonl.vitest.ts` | Primary regression coverage for Round-state JSONL. |

---

## 5. SOURCE_METADATA

- Group: Council
- Playbook ID: DLR-019
- Feature catalog entry: `feature_catalog/08--council/round-state-jsonl.md`
- Scenario file path: `manual_testing_playbook/08--council/round-state-jsonl.md`
- Expected verdict mode: GREEN when current tests and source anchors agree
- Wall-time estimate: 5-15 min
