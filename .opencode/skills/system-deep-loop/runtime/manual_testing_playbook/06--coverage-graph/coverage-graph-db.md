---
title: "DLR-011 -- Coverage graph DB"
description: "Manual validation scenario for Coverage graph DB in the runtime/ skill."
version: 1.4.0.4
---

# DLR-011 -- Coverage graph DB

This document captures the realistic user-testing contract, execution flow, and metadata for `DLR-011`.

---

## 1. OVERVIEW

Owns the SQLite schema, namespace scoping, node and edge mutations, snapshots, and connection lifecycle.

### Why This Matters

Graph state is the convergence evidence layer for deep-review and deep-research. Session scoping, schema stability, and signal correctness prevent one run from polluting another.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm coverage graph db behaves as documented and remains aligned with its implementation and tests.
- Layer partition: coverage graph runtime.
- Real user request: `Validate Coverage graph DB and report whether the current source, script surface, and tests agree with the runtime/ contract.`
- Expected signals: Session-scoped graph behavior, schema/query/signal outputs, and matching integration or lifecycle evidence.
- Pass/fail: PASS only if the matching test command exits 0 and source inspection confirms the documented behavior; FAIL if the test is not run, exits non-zero, or expected signals are absent or contradicted.

---

## 3. TEST EXECUTION

### Prerequisites

- Working directory is repository root.
- `runtime/` source tree is present.
- Feature catalog entry exists at `feature_catalog/06--coverage-graph/coverage-graph-db.md`.

### Steps

1. Inspect `lib/coverage-graph/coverage-graph-db.ts` for the implementation contract.
2. Inspect `tests/lifecycle/db-open-close.vitest.ts` for the primary regression coverage.
3. Run the matching test command for this feature and require EXIT 0; source inspection alone is not sufficient.
4. Capture the source lines and EXIT 0 test command output that prove the expected signals.
5. Record PASS, PARTIAL, FAIL, or SKIP with rationale.

### Expected Outcome

Coverage graph DB matches the documented current reality, the source anchors are accurate, and validation evidence is reproducible.

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
| `lib/coverage-graph/coverage-graph-db.ts` | Schema v2, node and edge CRUD, snapshots, stats, composite namespace keys, and DB lifecycle. |

### Validation

| File | Role |
|---|---|
| `tests/lifecycle/db-open-close.vitest.ts` | Primary regression coverage for Coverage graph DB. |

---

## 5. SOURCE_METADATA

- Group: Coverage graph
- Playbook ID: DLR-011
- Feature catalog entry: `feature_catalog/06--coverage-graph/coverage-graph-db.md`
- Scenario file path: `manual_testing_playbook/06--coverage-graph/coverage-graph-db.md`
- Expected verdict mode: GREEN when current tests and source anchors agree
- Wall-time estimate: 5-15 min

