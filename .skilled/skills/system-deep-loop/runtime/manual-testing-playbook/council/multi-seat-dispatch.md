---
title: "DLR-018 -- Multi-seat dispatch"
description: "Manual validation scenario for Multi-seat dispatch in the runtime/ skill."
version: 1.4.0.4
---

# DLR-018 -- Multi-seat dispatch

This document captures the realistic user-testing contract, execution flow, and metadata for `DLR-018`.

---

## 1. OVERVIEW

Runs seat executors in parallel for one council round; preserves seat result order; returns fulfilled or rejected per-seat outcomes plus round summary counts.

### Why This Matters

This is the per-round parallel-dispatch primitive that deep-ai-council consumes. If it drifts, council rounds can produce out-of-order seat results or lose per-seat error signals.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm multi-seat dispatch behaves as documented and remains aligned with its implementation and tests.
- Layer partition: council runtime.
- Real user request: `Validate Multi-seat dispatch and report whether the current source, dispatch surface, and tests agree with the runtime/ contract.`
- Expected signals: Promise.allSettled fan-out preserves seat order; fulfilled+rejected outcomes returned alongside round summary counts.
- Pass/fail: PASS if source inspection and matching tests prove the documented behavior; FAIL if expected signals are absent or contradicted.

---

## 3. TEST EXECUTION

### Prerequisites

- Working directory is repository root.
- `runtime/` source tree is present.
- Feature catalog entry exists at `feature-catalog/council/multi-seat-dispatch.md`.

### Prompt

- Prompt: `Validate Multi-seat dispatch and report whether the current source, dispatch surface, and tests agree with the runtime/ contract.`

### Commands

1. Inspect `lib/council/multi-seat-dispatch.cjs` for the implementation contract.
2. Inspect `tests/council/multi-seat-dispatch.vitest.ts` for the primary regression coverage.
3. Run or inspect the matching test assertions for this feature.
4. Capture the source lines, command output, or test assertions that prove the expected signals.
5. Record PASS or FAIL with rationale; record SKIP only when a named sandbox blocker — an unavailable native module, a missing runtime dependency, or an unavailable external CLI credential — prevents the command from running.

### Expected Outcome

Multi-seat dispatch matches the documented current reality, the source anchors are accurate, and validation evidence is reproducible.

### Evidence

- Source excerpts from `lib/council/multi-seat-dispatch.cjs` showing the anchors named in the commands above, read from the current files rather than recalled.
- Captured stdout and exit status for every command run in this section.
- Output from `tests/council/multi-seat-dispatch.vitest.ts` naming the assertions that carry the expected signals.
- A triage note for any non-PASS outcome that names which expected signal was absent or contradicted.

### Failure Triage

- Source file no longer exposes the documented function, type, or output field.
- Matching test coverage is missing, renamed, or contradicts the documented behavior.
- Seat order not preserved across completion order.
- Evidence is inferred from memory instead of captured from current source or command output.

---

## 4. SOURCE FILES

### Implementation

| File | Role |
|---|---|
| `lib/council/multi-seat-dispatch.cjs` | Parallel seat dispatcher with order-preserving result aggregation. |

### Validation

| File | Role |
|---|---|
| `tests/council/multi-seat-dispatch.vitest.ts` | Primary regression coverage for Multi-seat dispatch. |

---

## 5. SOURCE METADATA

- Group: Council
- Playbook ID: DLR-018
- Feature catalog entry: `feature-catalog/council/multi-seat-dispatch.md`
- Scenario file path: `manual-testing-playbook/council/multi-seat-dispatch.md`
- Canonical root source: `manual-testing-playbook/manual-testing-playbook.md`
- Expected verdict mode: GREEN when current tests and source anchors agree
- Wall-time estimate: 5-15 min
