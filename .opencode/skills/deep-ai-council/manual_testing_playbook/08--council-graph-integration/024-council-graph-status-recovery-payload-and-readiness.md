---
title: "DAC-024 -- runtime status CLI recovery payload and readiness"
description: "This scenario validates that `runtime status CLI` returns readiness, counts, schema version, signals, and a namespace-scoped `recovery` payload — never false-safe empty success on missing or corrupt graph state for `DAC-024`. Anchors to council-graph-script.vitest.ts test 'blocks convergence for empty derived graphs instead of returning false-safe success' and the P2-001 recovery payload remediation."
---

# DAC-024 -- runtime status CLI recovery payload and readiness

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DAC-024`.

---

## 1. OVERVIEW

This scenario validates that `runtime status CLI` reports readiness, counts, schema version, current signals, and a bounded namespace-scoped `recovery` payload that callers can use to drive cleanup/replay decisions. The status surface must never return false-safe empty success on missing or stale state.

### Why This Matters

Callers need to know whether the graph is empty-because-pristine, empty-because-deleted, stale, or corrupted — so they can decide between replay-from-artifacts or block-and-escalate. Returning a generic `{ ready: true, counts: 0 }` for all three cases hides recovery decisions and breaks audit. The bounded `recovery` payload was added as P2-001 remediation in 003 to surface namespace-scoped cleanup guidance directly in the status response.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `DAC-024` and confirm the expected signals without contradictory evidence.

- Objective: Verify `runtime status CLI` returns readiness + counts + schema version + signals + namespace-scoped `recovery` payload, with no false-safe empty success.
- Real user request: Tell me whether the council graph is ready to use and how to recover if it is broken.
- Prompt: `As a council-graph integration validator, call runtime status CLI against (a) a missing/empty graph, (b) a stale or corrupted graph, and (c) a healthy fully-populated session; assert each response shape and recovery payload.`
- Expected execution process: Call `runtime status CLI` against three distinct namespace states; inspect the response shape including the `recovery` payload.
- Expected signals: Each response includes `counts`, `schemaVersion`, `signals`, and a `recovery` payload scoped to the input `(specFolder, sessionId)`. Empty/missing case is explicitly distinguishable from healthy case.
- Desired user-visible outcome: The user knows graph health and how to recover without leaving the status response.
- Pass/fail: PASS if response shape is complete and recovery payload is namespace-scoped; FAIL if status returns generic empty success on missing state or recovery payload is global rather than namespace-scoped.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Call `runtime status CLI` on a never-touched namespace (e.g., `sandbox/dac-024-empty`).
2. Seed a session, then simulate stale state (e.g., delete a row outside the namespace via a fixture, or use an older `schemaVersion`).
3. Seed and populate a healthy session (`sandbox/dac-024-healthy`).
4. Call `runtime status CLI` on each.
5. Inspect each response for `counts`, `schemaVersion`, `signals`, and `recovery` payload.

### Prompt

`As a council-graph integration validator, call runtime status CLI against (a) a missing/empty graph, (b) a stale or corrupted graph, and (c) a healthy fully-populated session; assert each response shape and recovery payload.`

### Commands

1. `tool: runtime status CLI({ specFolder: 'sandbox/dac-024-empty', sessionId: 'never-touched' })`
2. `tool: runtime upsert CLI({ specFolder: 'sandbox/dac-024-stale', sessionId: 'dac-024-stale-01', nodes: [...minimal...] })`
3. `tool: runtime status CLI({ specFolder: 'sandbox/dac-024-stale', sessionId: 'dac-024-stale-01' })`
4. `tool: runtime upsert CLI({ specFolder: 'sandbox/dac-024-healthy', sessionId: 'dac-024-healthy-01', nodes: [...full...], edges: [...] })`
5. `tool: runtime status CLI({ specFolder: 'sandbox/dac-024-healthy', sessionId: 'dac-024-healthy-01' })`

### Expected

All three status responses include `counts`, `schemaVersion`, `signals`, and a `recovery` payload scoped to the input `(specFolder, sessionId)`. The empty case is distinguishable from the healthy case by counts and readiness fields.

### Evidence

Capture all three status responses verbatim, highlighting the `recovery` payload field-set and namespace scope.

### Pass / Fail

- **Pass**: All three responses include the full shape; `recovery` payload references only the input namespace.
- **Fail**: Empty case returns false-safe success indistinguishable from healthy case; recovery payload missing or globally scoped.

### Failure Triage

If recovery payload missing, inspect `scripts/status.cjs` for the P2-001 remediation (`recovery` field assembly). If payload references rows outside the input namespace, inspect `lib/council/council-graph-db.ts` `getRecoveryPayload` (or equivalent) for namespace filter regression.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| DAC-024 | Status recovery payload + readiness | Verify status returns counts/schema/signals + namespace-scoped recovery | `As a council-graph integration validator, call runtime status CLI against (a) a missing/empty graph, (b) a stale or corrupted graph, and (c) a healthy fully-populated session; assert each response shape and recovery payload.` | status (empty) -> upsert + status (stale) -> upsert + status (healthy) | Full shape + namespace-scoped recovery payload across all 3 cases | 3 status responses | PASS if shape complete and recovery is namespace-scoped | Inspect status handler P2-001 recovery assembly |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `../manual_testing_playbook.md` | Root directory page and scenario summary |
| `feature_catalog/` | No feature catalog exists yet |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/skills/deep-loop-runtime/scripts/status.cjs` | runtime CLI script: counts/schema/signals + recovery payload (P2-001 remediation) |
| `.opencode/skills/deep-loop-runtime/lib/council/council-graph-db.ts` | Storage layer: counts + namespace filter |
| `.opencode/skills/deep-loop-runtime/tests/integration/council-graph-script.vitest.ts` | Test: "blocks convergence for empty derived graphs instead of returning false-safe success" |
| `.opencode/skills/deep-ai-council/references/integration/graph_support.md` §5 | Documents the recovery contract |

---

## 5. SOURCE METADATA

- Group: COUNCIL GRAPH INTEGRATION
- Playbook ID: DAC-024
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `08--council-graph-integration/024-council-graph-status-recovery-payload-and-readiness.md`
