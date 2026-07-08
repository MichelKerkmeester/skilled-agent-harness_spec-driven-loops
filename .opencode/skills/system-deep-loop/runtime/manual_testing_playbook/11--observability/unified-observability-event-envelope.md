---
title: "DLR-049 -- Unified observability event envelope"
description: "Manual validation scenario for Unified observability event envelope in the runtime/ skill."
version: 1.4.0.15
---

# DLR-049 -- Unified observability event envelope

This document captures the realistic user-testing contract, execution flow, and metadata for `DLR-049`.

---

## 1. OVERVIEW

Adds a unified observability event envelope and routes core runtime emitters through it without migrating legacy rows.

### Why This Matters

Deep-loop runtime features are shared by multiple workflow modes. Manual validation keeps the documented contract aligned with shipped source, tests, and operator-visible behavior.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm Unified observability event envelope behaves as documented and remains aligned with its implementation and tests.
- Layer partition: observability runtime.
- Real user request: `Validate Unified observability event envelope and report whether the current source, script surface, and tests agree with the runtime/ contract.`
- Expected signals: Envelope normalization, append behavior, core emitter wiring, and status/convergence parity coverage.
- Pass/fail: PASS if source inspection and matching tests prove the documented behavior; FAIL if expected signals are absent or contradicted.

---

## 3. TEST EXECUTION

### Prerequisites

- Working directory is repository root.
- `runtime/` source tree is present.
- Feature catalog entry exists at `feature_catalog/11--observability/unified-observability-event-envelope.md`.

### Steps

1. Inspect `lib/deep-loop/observability-events.cjs` for the implementation contract.
2. Inspect `lib/council/round-state-jsonl.cjs` for the implementation contract.
3. Inspect `scripts/convergence.cjs` for the implementation contract.
4. Inspect `scripts/fanout-run.cjs` for the implementation contract.
5. Inspect `scripts/status.cjs` for the implementation contract.
6. Inspect `.opencode/commands/deep/assets/deep_research_auto.yaml` for the implementation contract.
7. Inspect `tests/unit/observability-events.vitest.ts` for the matching regression coverage.
8. Inspect `tests/integration/status-script.vitest.ts` for the matching regression coverage.
9. Run or inspect the matching test assertions for this feature.
10. Capture the source lines, command output, or test assertions that prove the expected signals.
11. Record PASS, PARTIAL, FAIL, or SKIP with rationale.

### Expected Outcome

Unified observability event envelope matches the documented current reality, the source anchors are accurate, and validation evidence is reproducible.

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
| `lib/deep-loop/observability-events.cjs` | unified observability event envelope. |
| `lib/council/round-state-jsonl.cjs` | unified observability event envelope. |
| `scripts/convergence.cjs` | unified observability event envelope. |
| `scripts/fanout-run.cjs` | unified observability event envelope. |
| `scripts/status.cjs` | unified observability event envelope. |
| `.opencode/commands/deep/assets/deep_research_auto.yaml` | unified observability event envelope. |

### Validation

| File | Role |
|---|---|
| `tests/unit/observability-events.vitest.ts` | Primary regression coverage for Unified observability event envelope. |
| `tests/integration/status-script.vitest.ts` | Primary regression coverage for Unified observability event envelope. |

---

## 5. SOURCE_METADATA

- Group: Observability
- Playbook ID: DLR-049
- Feature catalog entry: `feature_catalog/11--observability/unified-observability-event-envelope.md`
- Scenario file path: `manual_testing_playbook/11--observability/unified-observability-event-envelope.md`
- Source phase: `.opencode/specs/system-deep-loop/030-deep-loop-improved/006-ux-observability-automation/003-unified-observability-event-envelope`
- Expected verdict mode: GREEN when current tests and source anchors agree
- Wall-time estimate: 5-15 min
