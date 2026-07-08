---
title: "DLR-038 -- Byte-offset log regions"
description: "Manual validation scenario for Byte-offset log regions in the runtime/ skill."
version: 1.4.0.15
---

# DLR-038 -- Byte-offset log regions

This document captures the realistic user-testing contract, execution flow, and metadata for `DLR-038`.

---

## 1. OVERVIEW

Stamps seekable byte-region metadata on iteration records and surfaces those offsets in the deep-research dashboard.

### Why This Matters

Deep-loop runtime features are shared by multiple workflow modes. Manual validation keeps the documented contract aligned with shipped source, tests, and operator-visible behavior.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm Byte-offset log regions behaves as documented and remains aligned with its implementation and tests.
- Layer partition: observability runtime.
- Real user request: `Validate Byte-offset log regions and report whether the current source, script surface, and tests agree with the runtime/ contract.`
- Expected signals: Stamped offset fields, readable byte slices, schema fields, and reducer dashboard output coverage.
- Pass/fail: PASS if source inspection and matching tests prove the documented behavior; FAIL if expected signals are absent or contradicted.

---

## 3. TEST EXECUTION

### Prerequisites

- Working directory is repository root.
- `runtime/` source tree is present.
- Feature catalog entry exists at `feature_catalog/11--observability/byte-offset-log-regions.md`.

### Steps

1. Inspect `lib/deep-loop/post-dispatch-validate.ts` for the implementation contract.
2. Inspect `.opencode/commands/deep/assets/deep_research_auto.yaml` for the implementation contract.
3. Inspect `.opencode/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs` for the implementation contract.
4. Inspect `tests/unit/post-dispatch-validate.vitest.ts` for the matching regression coverage.
5. Inspect `tests/unit/deep-research-reduce-state.vitest.ts` for the matching regression coverage.
6. Inspect `.opencode/skills/system-deep-loop/deep-research/scripts/reduce-state-sparkline.test.cjs` for the matching regression coverage.
7. Run or inspect the matching test assertions for this feature.
8. Capture the source lines, command output, or test assertions that prove the expected signals.
9. Record PASS, PARTIAL, FAIL, or SKIP with rationale.

### Expected Outcome

Byte-offset log regions matches the documented current reality, the source anchors are accurate, and validation evidence is reproducible.

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
| `lib/deep-loop/post-dispatch-validate.ts` | byte-offset log regions. |
| `.opencode/commands/deep/assets/deep_research_auto.yaml` | byte-offset log regions. |
| `.opencode/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs` | byte-offset log regions. |

### Validation

| File | Role |
|---|---|
| `tests/unit/post-dispatch-validate.vitest.ts` | Primary regression coverage for Byte-offset log regions. |
| `tests/unit/deep-research-reduce-state.vitest.ts` | Primary regression coverage for Byte-offset log regions. |
| `.opencode/skills/system-deep-loop/deep-research/scripts/reduce-state-sparkline.test.cjs` | Primary regression coverage for Byte-offset log regions. |

---

## 5. SOURCE_METADATA

- Group: Observability
- Playbook ID: DLR-038
- Feature catalog entry: `feature_catalog/11--observability/byte-offset-log-regions.md`
- Scenario file path: `manual_testing_playbook/11--observability/byte-offset-log-regions.md`
- Source phase: `.opencode/specs/system-deep-loop/030-deep-loop-improved/002-runtime//009-byte-offset-log-regions`
- Expected verdict mode: GREEN when current tests and source anchors agree
- Wall-time estimate: 5-15 min
