---
title: "DLR-034 -- Lifecycle taxonomy guards"
description: "Manual validation scenario for Lifecycle taxonomy guards in the runtime/ skill."
version: 1.4.0.15
---

# DLR-034 -- Lifecycle taxonomy guards

This document captures the realistic user-testing contract, execution flow, and metadata for `DLR-034`.

---

## 1. OVERVIEW

Promotes loop lifecycle status and stop-reason taxonomy with legal transitions and a one-shot paused-wait resume gate.

### Why This Matters

Deep-loop runtime features are shared by multiple workflow modes. Manual validation keeps the documented contract aligned with shipped source, tests, and operator-visible behavior.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm Lifecycle taxonomy guards behaves as documented and remains aligned with its implementation and tests.
- Layer partition: lifecycle runtime.
- Real user request: `Validate Lifecycle taxonomy guards and report whether the current source, script surface, and tests agree with the runtime/ contract.`
- Expected signals: Taxonomy export, legal-transition map, backward-compatible literals, and one-shot resume gate coverage.
- Pass/fail: PASS if source inspection and matching tests prove the documented behavior; FAIL if expected signals are absent or contradicted.

---

## 3. TEST EXECUTION

### Prerequisites

- Working directory is repository root.
- `runtime/` source tree is present.
- Feature catalog entry exists at `feature_catalog/10--lifecycle/lifecycle-taxonomy-guards.md`.

### Steps

1. Inspect `lib/deep-loop/lifecycle-taxonomy.cjs` for the implementation contract.
2. Inspect `tests/unit/lifecycle-taxonomy-guards.vitest.ts` for the matching regression coverage.
3. Run or inspect the matching test assertions for this feature.
4. Capture the source lines, command output, or test assertions that prove the expected signals.
5. Record PASS, PARTIAL, FAIL, or SKIP with rationale.

### Expected Outcome

Lifecycle taxonomy guards matches the documented current reality, the source anchors are accurate, and validation evidence is reproducible.

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
| `lib/deep-loop/lifecycle-taxonomy.cjs` | lifecycle taxonomy + transition guards. |

### Validation

| File | Role |
|---|---|
| `tests/unit/lifecycle-taxonomy-guards.vitest.ts` | Primary regression coverage for Lifecycle taxonomy guards. |

---

## 5. SOURCE_METADATA

- Group: Lifecycle
- Playbook ID: DLR-034
- Feature catalog entry: `feature_catalog/10--lifecycle/lifecycle-taxonomy-guards.md`
- Scenario file path: `manual_testing_playbook/10--lifecycle/lifecycle-taxonomy-guards.md`
- Source phase: `.opencode/specs/system-deep-loop/030-deep-loop-improved/002-runtime//005-lifecycle-taxonomy-guards`
- Expected verdict mode: GREEN when current tests and source anchors agree
- Wall-time estimate: 5-15 min
