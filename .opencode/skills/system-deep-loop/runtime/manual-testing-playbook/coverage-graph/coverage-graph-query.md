---
title: "DLR-012 -- Coverage graph query"
description: "Manual validation scenario for Coverage graph query in the runtime/ skill."
version: 1.4.0.4
---

# DLR-012 -- Coverage graph query

This document captures the realistic user-testing contract, execution flow, and metadata for `DLR-012`.

---

## 1. OVERVIEW

Builds coverage-gap, contradiction, provenance-chain, unverified-claim, and hot-node read models.

### Why This Matters

Graph state is the convergence evidence layer for deep-review and deep-research. Session scoping, schema stability, and signal correctness prevent one run from polluting another.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm coverage graph query behaves as documented and remains aligned with its implementation and tests.
- Layer partition: coverage graph runtime.
- Real user request: `Validate Coverage graph query and report whether the current source, script surface, and tests agree with the runtime/ contract.`
- Expected signals: Session-scoped graph behavior, schema/query/signal outputs, and matching integration or lifecycle evidence.
- Pass/fail: PASS only if the matching test command exits 0 and source inspection confirms the documented behavior; FAIL if the test is not run, exits non-zero, or expected signals are absent or contradicted.

---

## 3. TEST EXECUTION

### Prerequisites

- Working directory is repository root.
- `runtime/` source tree is present.
- Feature catalog entry exists at `feature-catalog/coverage-graph/coverage-graph-query.md`.

### Steps

1. Inspect `lib/coverage-graph/coverage-graph-query.ts` for the implementation contract.
2. Inspect `tests/unit/coverage-graph-query.vitest.ts` for the primary unit regression coverage, and `tests/integration/query-script.vitest.ts` for end-to-end script-surface coverage.
3. Run the matching test command for this feature and require EXIT 0; source inspection alone is not sufficient.
4. Capture the source lines and EXIT 0 test command output that prove the expected signals.
5. Record PASS, PARTIAL, FAIL, or SKIP with rationale.

### Expected Outcome

Coverage graph query matches the documented current reality, the source anchors are accurate, and validation evidence is reproducible.

### Failure Modes

- Source file no longer exposes the documented function, type, script argument, or output field.
- Matching test coverage is missing, renamed, or contradicts the documented behavior.
- Script or runtime output changes without corresponding catalog and playbook updates.
- Evidence is inferred from memory instead of captured from current source or command output.

---

## 4. SOURCE ANCHORS

### Implementation

| File | Role |
|---|---|
| `lib/coverage-graph/coverage-graph-query.ts` | Session-scoped query helpers for research and review coverage graph reads. |

### Validation

| File | Role |
|---|---|
| `tests/unit/coverage-graph-query.vitest.ts` | Primary unit regression coverage for Coverage graph query (8 tests). |
| `tests/integration/query-script.vitest.ts` | End-to-end script-surface coverage for Coverage graph query. |

---

## 5. SOURCE_METADATA

- Group: Coverage graph
- Playbook ID: DLR-012
- Feature catalog entry: `feature-catalog/coverage-graph/coverage-graph-query.md`
- Scenario file path: `manual-testing-playbook/coverage-graph/coverage-graph-query.md`
- Expected verdict mode: GREEN when current tests and source anchors agree
- Wall-time estimate: 5-15 min

