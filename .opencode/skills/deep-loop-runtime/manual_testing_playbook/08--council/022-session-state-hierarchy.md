---
title: "DLR-022 -- Session state hierarchy"
description: "Manual validation scenario for Session state hierarchy in the deep-loop-runtime skill."
---

# DLR-022 -- Session state hierarchy

This document captures the realistic user-testing contract, execution flow, and metadata for `DLR-022`.

## 1. OVERVIEW

Creates and validates the ADR-002 session->topic->round state shape, including stable topic-NNN-slug and round-NNN ids.

### Why This Matters

This is the council state-shape contract. If it drifts, downstream tools that traverse session->topic->round (dashboards, resume logic, audit tooling) break silently.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm session state hierarchy behaves as documented and remains aligned with its implementation and tests.
- Layer partition: council state shape.
- Real user request: `Validate Session state hierarchy and report whether the current id shape, validator rules, and tests agree with the deep-loop-runtime contract.`
- Expected signals: 3-level session/topic/round shape; topic ids `topic-NNN-slug`; round ids `round-NNN`; validator rejects malformed/duplicate/out-of-order ids.
- Pass/fail: PASS if source inspection and matching tests prove the documented behavior; FAIL if expected signals are absent or contradicted.

---

## 3. TEST EXECUTION

### Prerequisites

- Working directory is repository root.
- `deep-loop-runtime` source tree is present.
- Feature catalog entry exists at `feature_catalog/08--council/05-session-state-hierarchy.md`.

### Steps

1. Inspect `lib/council/session-state-hierarchy.cjs` for the implementation contract and id shape rules.
2. Inspect `tests/council/session-state-hierarchy.vitest.ts` for the primary regression coverage.
3. Run or inspect the matching test assertions for this feature.
4. Capture the source lines, command output, or test assertions that prove the expected signals.
5. Record PASS, PARTIAL, FAIL, or SKIP with rationale.

### Expected Outcome

Session state hierarchy matches the documented current reality, the id shape rules agree with ADR-002, and validation evidence is reproducible.

### Failure Modes

- Topic id shape drifts from `topic-NNN-slug` without ADR amendment.
- Round id shape drifts from `round-NNN`.
- Validator weakens (accepts malformed/duplicate/out-of-order ids without flagging).
- Evidence is inferred from memory instead of captured from current source or command output.

---

## 4. SOURCE ANCHORS

### Implementation

| File | Role |
|---|---|
| `lib/council/session-state-hierarchy.cjs` | 3-level session/topic/round state constructor + validator with stable ids. |

### Validation

| File | Role |
|---|---|
| `tests/council/session-state-hierarchy.vitest.ts` | Primary regression coverage for Session state hierarchy. |

---

## 5. SOURCE_METADATA

- Group: Council
- Playbook ID: DLR-022
- Feature catalog entry: `feature_catalog/08--council/05-session-state-hierarchy.md`
- Scenario file path: `manual_testing_playbook/08--council/022-session-state-hierarchy.md`
- Expected verdict mode: GREEN when current tests and source anchors agree
- Wall-time estimate: 5-15 min
