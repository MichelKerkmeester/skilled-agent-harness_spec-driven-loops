---
title: "DLR-043 -- Coverage-graph fuzzy merge"
description: "Manual validation scenario for Coverage-graph fuzzy merge in the deep-loop-runtime skill."
version: 1.4.0.15
---

# DLR-043 -- Coverage-graph fuzzy merge

This document captures the realistic user-testing contract, execution flow, and metadata for `DLR-043`.

---

## 1. OVERVIEW

Adds deterministic fuzzy-merge query helpers for near-duplicate coverage nodes without mutating graph rows.

### Why This Matters

Deep-loop runtime features are shared by multiple workflow modes. Manual validation keeps the documented contract aligned with shipped source, tests, and operator-visible behavior.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm Coverage-graph fuzzy merge behaves as documented and remains aligned with its implementation and tests.
- Layer partition: coverage graph runtime.
- Real user request: `Validate Coverage-graph fuzzy merge and report whether the current source, script surface, and tests agree with the deep-loop-runtime contract.`
- Expected signals: Similarity thresholding, category guard, bounded namespace behavior, and query-only consolidation candidate tests.
- Pass/fail: PASS only if the matching test command exits 0 and source inspection confirms the documented behavior; FAIL if the test is not run, exits non-zero, or expected signals are absent or contradicted.

---

## 3. TEST EXECUTION

### Prerequisites

- Working directory is repository root.
- `deep-loop-runtime` source tree is present.
- Feature catalog entry exists at `feature_catalog/06--coverage-graph/coverage-graph-fuzzy-merge.md`.

### Steps

1. Inspect `lib/coverage-graph/coverage-graph-query.ts` for the implementation contract.
2. Inspect `tests/unit/coverage-graph-query.vitest.ts` for the matching regression coverage.
3. Run `bash: cd .opencode/skills/deep-loop-runtime && PATH=/opt/homebrew/bin:$PATH npm test -- tests/unit/coverage-graph-query.vitest.ts` and require EXIT 0.
4. Capture the source lines and EXIT 0 test command output that prove the expected signals.
5. Record PASS, PARTIAL, FAIL, or SKIP with rationale.

### Expected Outcome

Coverage-graph fuzzy merge matches the documented current reality, the source anchors are accurate, and validation evidence is reproducible.

### Failure Modes

- Source file no longer exposes the documented function, type, script argument, output field, or YAML step.
- Matching test coverage is missing, renamed, or contradicts the documented behavior.
- Script, runtime, YAML, or dashboard output changes without corresponding catalog and playbook updates.
- Evidence is inferred from memory instead of captured from current source or command output.

---

## 4. SOURCE ANCHORS

### Implementation

| File | Role |
|---|---|
| `lib/coverage-graph/coverage-graph-query.ts` | coverage-graph fuzzy merge. |

### Validation

| File | Role |
|---|---|
| `tests/unit/coverage-graph-query.vitest.ts` | Primary regression coverage for Coverage-graph fuzzy merge. |

---

## 5. SOURCE_METADATA

- Group: Coverage graph
- Playbook ID: DLR-043
- Feature catalog entry: `feature_catalog/06--coverage-graph/coverage-graph-fuzzy-merge.md`
- Scenario file path: `manual_testing_playbook/06--coverage-graph/coverage-graph-fuzzy-merge.md`
- Source phase: `.opencode/specs/system-deep-loop/030-deep-loop-improved/002-deep-loop-runtime/014-coverage-graph-fuzzy-merge`
- Expected verdict mode: GREEN when current tests and source anchors agree
- Wall-time estimate: 5-15 min
