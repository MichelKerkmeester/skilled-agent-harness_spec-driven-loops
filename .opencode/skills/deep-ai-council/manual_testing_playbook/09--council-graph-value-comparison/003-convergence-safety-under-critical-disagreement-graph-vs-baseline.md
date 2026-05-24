---
title: "DAC-029 -- Convergence safety under critical disagreement: graph vs no-graph baseline"
description: "Real-world scenario where the graph PREVENTS premature stop. Two-of-three rule (no-graph baseline) would trigger convergence; graph returns STOP_BLOCKED because one critical disagreement is unresolved. Anchors to `runtime convergence CLI`."
---

# DAC-029 -- Convergence safety under critical disagreement: graph vs no-graph baseline

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DAC-029`.

---

## 1. OVERVIEW

This scenario validates that `runtime convergence CLI` provides a safety guarantee the no-graph two-of-three rule cannot: it blocks `STOP` decisions when a critical disagreement remains unresolved, even if 2 of 3 seats otherwise agree.

### Why This Matters

The two-of-three convergence rule is documented in `references/convergence_signals.md` and is the no-graph baseline for stop decisions. But "2 of 3 agree" can mask unresolved critical issues: seats A and B may both endorse Plan X while seat C's unresolved security concern about Plan X gets lost. Without graph: convergence triggers and the issue ships. With graph: `unresolvedCriticalDisagreements` is a hard `STOP_BLOCKED` signal — graph prevents premature convergence.

> **Automated test anchor:** `.opencode/skills/deep-loop-runtime/tests/integration/council-graph-value-scenarios.vitest.ts` test name `DAC-029 graph beats no-graph baseline`. Measured baseline-vs-graph ratios live in `.opencode/skills/deep-loop-runtime/tests/council-graph-value-report.json`.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `DAC-029` and confirm the with-graph path blocks the stop where the no-graph baseline would allow it.

- Objective: Demonstrate the graph provides a safety guarantee (block on unresolved critical) that the two-of-three baseline does not.
- Real-world situation: 3-seat council. Seat A endorses Plan X (claim `c1` SUPPORTS `decX`). Seat B endorses Plan X (claim `c2` SUPPORTS `decX`). Seat C raised DISAGREEMENT `d1` against Plan X carrying `metadata: { severity: 'critical' }` — no RESOLVES edge exists. Two-of-three baseline would trigger stop. Graph must return `STOP_BLOCKED`.
- Real user request: This council looks like it has 2 of 3 agreement on Plan X — can we stop, or is something blocking?
- Prompt: `As a council-graph integration validator, evaluate convergence on a seeded session where 2 of 3 seats agree on Plan X but seat C raised an unresolved critical disagreement; confirm the graph returns STOP_BLOCKED with the critical disagreement cited, contradicting the naive two-of-three baseline.`
- Expected execution process: Seed graph as above. Run baseline assessment ("count seat agreement"). Run `runtime convergence CLI`. Compare decisions.
- Expected signals: Baseline conclusion: 2 of 3 → stop allowed. Graph conclusion: `STOP_BLOCKED` with reason trace citing `d1` and `unresolvedCriticalDisagreements ≥ 1`.
- Desired user-visible outcome: Operator sees the graph protected against shipping an unresolved critical that the baseline would have missed.
- Pass/fail: PASS if graph returns `STOP_BLOCKED` and baseline would allow stop; FAIL if graph returns `STOP_ALLOWED` or `CONTINUE` despite the unresolved critical.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Seed: SESSION + 3 ROUNDs + 3 SEATs + DECISION `decX` + 2 CLAIMs (`c1`, `c2`) with SUPPORTS edges → `decX`; PROPOSES edges from Seat A and Seat B → `decX`. Add DISAGREEMENT `d1` with `metadata: { severity: 'critical' }` and no RESOLVES edge, with CONTRADICTS edge from `d1` → `decX`.
2. Run **no-graph baseline assessment**: count seat agreement on `decX` (Seat A yes, Seat B yes, Seat C dissent). Conclude per documented two-of-three rule.
3. Run **with-graph workflow**: `runtime convergence CLI` scoped to session.
4. Compare decisions; assert graph wins on safety.

### Prompt

`As a council-graph integration validator, evaluate convergence on a seeded session where 2 of 3 seats agree on Plan X but seat C raised an unresolved critical disagreement; confirm the graph returns STOP_BLOCKED with the critical disagreement cited, contradicting the naive two-of-three baseline.`

### Commands

**No-graph baseline:**

1. `bash: rg "Seat (A|B|C).*Plan X|endorses|dissent|disagree" <spec-folder>*.md` (operator tallies seat positions)
2. Operator applies documented two-of-three rule from `references/convergence_signals.md` → records "would converge" conclusion.

**With-graph:**

3. `tool: runtime upsert CLI({ specFolder: 'sandbox/dac-029', sessionId: 'dac-029-run-01', nodes: [...3 seats, decX, c1, c2, d1 critical...], edges: [...c1→decX SUPPORTS, c2→decX SUPPORTS, seatA→decX PROPOSES, seatB→decX PROPOSES, d1→decX CONTRADICTS...] })`
4. `tool: runtime convergence CLI({ specFolder: 'sandbox/dac-029', sessionId: 'dac-029-run-01' })`

### Expected

Baseline conclusion: 2 of 3 agreement → stop allowed (per documented rule). Graph conclusion: `decision: 'STOP_BLOCKED'`, reason trace cites `d1` and `unresolvedCriticalDisagreements >= 1`. The two answers disagree, and the graph's answer is the safety-preserving one.

### Evidence

Capture: baseline transcript + applied two-of-three reasoning, graph convergence response (decision + reason trace), one-line value summary ("graph blocked a stop the baseline would have allowed").

### Pass / Fail

- **Pass**: Graph returns `STOP_BLOCKED` with `d1` cited in the reason trace. Baseline reasoning would have allowed stop (two-of-three rule satisfied numerically).
- **Fail**: Graph returns `STOP_ALLOWED` or `CONTINUE` despite the unresolved critical. Reason trace omits `d1` or the critical-severity signal.

### Failure Triage

If graph returns `STOP_ALLOWED`, inspect `scripts/convergence.cjs` for the `unresolvedCriticalDisagreements` short-circuit (P1-002 remediation should make any non-zero critical force `STOP_BLOCKED`). If `CONTINUE` returned, the critical-severity classification on `d1` may not be flowing through `getUnresolvedCriticalDisagreements`.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| DAC-029 | Convergence safety under critical disagreement | Demonstrate graph blocks unsafe stop the baseline would allow | `As a council-graph integration validator, evaluate convergence on a seeded session where 2 of 3 seats agree on Plan X but seat C raised an unresolved critical disagreement; confirm the graph returns STOP_BLOCKED with the critical disagreement cited, contradicting the naive two-of-three baseline.` | baseline: tally seats -> apply two-of-three -> with-graph: upsert + convergence | STOP_BLOCKED with d1 cited vs baseline "would converge" | Baseline reasoning + graph convergence response | PASS if graph returns STOP_BLOCKED with critical cited | Inspect unresolvedCriticalDisagreements short-circuit |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `../manual_testing_playbook.md` | Root directory page and scenario summary |
| `../08--council-graph-integration/005-council-graph-convergence-three-state-decision-matrix.md` | Functional anchor for STOP_BLOCKED branch |
| `../04--convergence-and-rollback/001-two-of-three-agree-triggers-convergence.md` | The baseline rule this scenario challenges |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/skills/deep-loop-runtime/scripts/convergence.cjs` | Three-state decision logic |
| `.opencode/skills/deep-loop-runtime/lib/council/council-graph-query.ts` | `unresolvedCriticalDisagreements` calculator |
| `.opencode/skills/deep-loop-runtime/tests/integration/council-graph-script.vitest.ts` | "blocks convergence for empty derived graphs instead of returning false-safe success" + STOP_BLOCKED branch test |
| `.opencode/skills/deep-ai-council/references/convergence_signals.md` | Documents the baseline two-of-three rule |

---

## 5. SOURCE METADATA

- Group: COUNCIL GRAPH VALUE COMPARISON
- Playbook ID: DAC-029
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `09--council-graph-value-comparison/003-convergence-safety-under-critical-disagreement-graph-vs-baseline.md`
