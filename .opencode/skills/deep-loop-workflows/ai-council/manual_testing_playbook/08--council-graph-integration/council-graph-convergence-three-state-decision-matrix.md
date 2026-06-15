---
title: "DAC-023 -- runtime convergence CLI three-state decision matrix"
description: "This scenario validates that `runtime convergence CLI` emits `CONTINUE`, `STOP_ALLOWED`, or `STOP_BLOCKED` based on agreement, evidence, confidence, and unresolved-critical-disagreement signals for `DAC-023`. Anchors to council-graph-script.vitest.ts tests for all three convergence buckets."
---

# DAC-023 -- runtime convergence CLI three-state decision matrix

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DAC-023`.

---

## 1. OVERVIEW

This scenario validates that `runtime convergence CLI` correctly classifies a session into one of three decision buckets — `STOP_ALLOWED`, `CONTINUE`, or `STOP_BLOCKED` — based on the documented signals (`agreementRatio`, `dissentDensity`, `evidenceDepth`, `unresolvedCriticalDisagreements`, `decisionConfidence`).

### Why This Matters

The three-state output is the council orchestrator's primary stop/continue/escalate signal. Two-state regressions (collapsing CONTINUE into STOP_ALLOWED) silently let councils declare convergence prematurely. The CONTINUE branch was added explicitly as P1-002 remediation in 003 to remove a false-safe success path. This scenario seeds three sessions to exercise all three buckets.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `DAC-023` and confirm the expected signals without contradictory evidence.

- Objective: Verify `runtime convergence CLI` returns the correct bucket for each of three documented signal configurations.
- Real user request: Decide whether the council should stop, continue, or block on three different setups.
- Prompt: `As a council-graph integration validator, seed three council-graph sessions hitting STOP_ALLOWED, CONTINUE, and STOP_BLOCKED branches; call runtime convergence CLI on each and assert the returned decision bucket and reason trace.`
- Expected execution process: Build three sessions: (a) high agreement + sufficient evidence + no critical disagreement; (b) below-threshold agreement + decent evidence + no critical disagreement; (c) critical unresolved disagreement regardless of agreement; call `runtime convergence CLI` on each.
- Expected signals: Session (a) → `STOP_ALLOWED`; (b) → `CONTINUE`; (c) → `STOP_BLOCKED`. Each response includes a reason trace naming the deciding signal(s).
- Desired user-visible outcome: The user sees that convergence math distinguishes the three states cleanly.
- Pass/fail: PASS if all three buckets fire correctly and reason traces are present; FAIL if any session returns the wrong bucket or omits the reason trace.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Use three sandbox sessions: `dac-023-stop-allowed`, `dac-023-continue`, `dac-023-stop-blocked`.
2. Seed session (a) with high `agreementRatio` (e.g., 0.9), sufficient `evidenceDepth`, no DISAGREEMENT marked critical.
3. Seed session (b) with below-threshold `agreementRatio` (e.g., 0.4), enough evidence but no critical blocker.
4. Seed session (c) with at least one DISAGREEMENT carrying `severity: 'critical'` and no RESOLVES edge.
5. Call `runtime convergence CLI` on each.

### Prompt

`As a council-graph integration validator, seed three council-graph sessions hitting STOP_ALLOWED, CONTINUE, and STOP_BLOCKED branches; call runtime convergence CLI on each and assert the returned decision bucket and reason trace.`

### Commands

1. `tool: runtime upsert CLI({ specFolder: 'sandbox/dac-023', sessionId: 'dac-023-stop-allowed', nodes: [...high agreement, no critical...], edges: [...] })`
2. `tool: runtime convergence CLI({ specFolder: 'sandbox/dac-023', sessionId: 'dac-023-stop-allowed' })`
3. `tool: runtime upsert CLI({ specFolder: 'sandbox/dac-023', sessionId: 'dac-023-continue', nodes: [...low agreement, no critical...], edges: [...] })`
4. `tool: runtime convergence CLI({ specFolder: 'sandbox/dac-023', sessionId: 'dac-023-continue' })`
5. `tool: runtime upsert CLI({ specFolder: 'sandbox/dac-023', sessionId: 'dac-023-stop-blocked', nodes: [...critical unresolved disagreement...], edges: [...] })`
6. `tool: runtime convergence CLI({ specFolder: 'sandbox/dac-023', sessionId: 'dac-023-stop-blocked' })`

### Expected

Step 2 → `decision: 'STOP_ALLOWED'`; step 4 → `decision: 'CONTINUE'`; step 6 → `decision: 'STOP_BLOCKED'`. Each response includes a reason trace naming the deciding signal(s).

### Evidence

Capture all three convergence responses showing decision bucket + reason trace.

### Pass / Fail

- **Pass**: All three buckets fire correctly with reason traces.
- **Fail**: Any session returns the wrong bucket; CONTINUE branch missing (collapsed into STOP_ALLOWED); critical disagreement does not block.

### Failure Triage

If CONTINUE missing, inspect `scripts/convergence.cjs` for the P1-002 remediation branch. If critical disagreement does not block, inspect `lib/council/council-graph-query.ts` `unresolvedCriticalDisagreements` calc + threshold logic. Re-run `npx vitest run tests/council-graph-script.vitest.ts -t 'continues convergence when non-blocking thresholds are not met'` and `'blocks convergence for empty derived graphs instead of returning false-safe success'` to confirm.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| DAC-023 | Convergence three-state decision matrix | Verify STOP_ALLOWED / CONTINUE / STOP_BLOCKED buckets | `As a council-graph integration validator, seed three council-graph sessions hitting STOP_ALLOWED, CONTINUE, and STOP_BLOCKED branches; call runtime convergence CLI on each and assert the returned decision bucket and reason trace.` | upsert + convergence x3 (one per bucket) | Three buckets correctly classified with reason traces | 3 convergence responses | PASS if all 3 buckets fire correctly | Inspect convergence handler P1-002 branch + critical-disagreement calc |

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
| `.opencode/skills/deep-loop-runtime/scripts/convergence.cjs` | runtime CLI script: three-state decision logic |
| `.opencode/skills/deep-loop-runtime/lib/council/council-graph-query.ts` | Per-signal helpers (`agreementRatio`, `dissentDensity`, etc.) |
| `.opencode/skills/deep-loop-runtime/tests/integration/council-graph-script.vitest.ts` | Tests: "allows convergence when ... thresholds are met", "continues convergence when non-blocking thresholds are not met", "blocks convergence for empty derived graphs..." |
| `.opencode/skills/deep-loop-workflows/ai-council/references/integration/graph_support.md` §4 | Documents the convergence signals |

---

## 5. SOURCE METADATA

- Group: COUNCIL GRAPH INTEGRATION
- Playbook ID: DAC-023
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `08--council-graph-integration/council-graph-convergence-three-state-decision-matrix.md`
