---
title: "DAC-022 -- runtime query CLI five modes return prompt-safe context"
description: "This scenario validates that all 5 query modes (`unresolved_disagreements`, `evidence_chain`, `decision_support`, `convergence_blockers`, `hot_nodes`) return bounded prompt-safe context for `DAC-022`. Anchors to council-graph-script.vitest.ts test 'upserts prompt-safe council graph data and queries unresolved disagreements and decision support'."
---

# DAC-022 -- runtime query CLI five modes return prompt-safe context

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DAC-022`.

---

## 1. OVERVIEW

This scenario validates that `runtime query CLI` exposes all five documented query modes (`unresolved_disagreements`, `evidence_chain`, `decision_support`, `convergence_blockers`, `hot_nodes`) and that each returns bounded, prompt-safe context that respects the caller-supplied `limit` parameter.

### Why This Matters

The query surface is the council synthesis caller's primary handle into derived graph state. A regression in any single mode (handler omission, broken filter, ignored limit) silently degrades council synthesis quality without breaking the smoke-test that exercises only one mode. Exhaustively walking the documented mode set catches partial-handler regressions.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `DAC-022` and confirm the expected signals without contradictory evidence.

- Objective: Verify all 5 documented `runtime query CLI` modes return prompt-safe bounded context.
- Real user request: Show me each query view the council graph supports against a fully-populated session.
- Prompt: `As a council-graph integration validator, seed a fully-populated council session and call runtime query CLI with each of the five documented modes; assert each returns bounded prompt-safe context.`
- Expected execution process: Upsert one SESSION + 2 ROUNDs + 3 SEATs + claims/evidence/disagreements/decisions/recommendations to populate the graph; iterate `mode in ['unresolved_disagreements', 'evidence_chain', 'decision_support', 'convergence_blockers', 'hot_nodes']` with `limit: 5`; assert each response shape and limit compliance.
- Expected signals: All 5 modes return success; each response respects `limit: 5`; metadata contains only allowlisted scalars.
- Desired user-visible outcome: The user sees that all 5 query modes are wired and return useful structural context.
- Pass/fail: PASS if all 5 modes succeed and respect bounds; FAIL if any mode errors, returns unbounded results, or leaks non-allowlisted metadata.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Pick a sandbox `(specFolder, sessionId)` pair (e.g. `specFolder='sandbox/dac-022', sessionId='dac-022-run-01'`).
2. Upsert SESSION + 2 ROUNDs + 3 SEATs + 4 CLAIMs + 4 EVIDENCE + 3 DISAGREEMENTs + 2 DECISIONs + 1 RECOMMENDATION with appropriate edges (PARTICIPATES_IN, PROPOSES, SUPPORTS, CONTRADICTS, EVIDENCE_FOR, RESOLVES, RECOMMENDS).
3. Iterate the 5 query modes with `limit: 5`.
4. Inspect each response's result-count and metadata field-set.

### Prompt

`As a council-graph integration validator, seed a fully-populated council session and call runtime query CLI with each of the five documented modes; assert each returns bounded prompt-safe context.`

### Commands

1. `tool: runtime upsert CLI({ specFolder: 'sandbox/dac-022', sessionId: 'dac-022-run-01', nodes: [...full node set...], edges: [...full edge set...] })`
2. `tool: runtime query CLI({ specFolder: 'sandbox/dac-022', sessionId: 'dac-022-run-01', mode: 'unresolved_disagreements', limit: 5 })`
3. `tool: runtime query CLI({ specFolder: 'sandbox/dac-022', sessionId: 'dac-022-run-01', mode: 'evidence_chain', limit: 5 })`
4. `tool: runtime query CLI({ specFolder: 'sandbox/dac-022', sessionId: 'dac-022-run-01', mode: 'decision_support', limit: 5 })`
5. `tool: runtime query CLI({ specFolder: 'sandbox/dac-022', sessionId: 'dac-022-run-01', mode: 'convergence_blockers', limit: 5 })`
6. `tool: runtime query CLI({ specFolder: 'sandbox/dac-022', sessionId: 'dac-022-run-01', mode: 'hot_nodes', limit: 5 })`

### Expected

Steps 2-6 each return success with at most 5 results, prompt-safe metadata only.

### Evidence

Capture all 5 query responses showing mode name, result count, and metadata field-set.

### Pass / Fail

- **Pass**: All 5 modes succeed, each respects `limit: 5`, metadata contains only allowlisted scalars (`confidence`, `confidenceScore`, `planConfidence`, `severity`, `priority`, `status`).
- **Fail**: Any mode returns unknown-mode error, returns more than 5 results, or leaks non-allowlisted metadata keys.

### Failure Triage

If a mode errors with "unknown mode", inspect `scripts/query.cjs` mode dispatch + `schemas/tool-input-schemas.ts` mode enum. If a mode ignores `limit`, inspect `lib/council/council-graph-query.ts` per-mode query helper.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| DAC-022 | Five query modes prompt-safe context | Verify all 5 modes return bounded prompt-safe results | `As a council-graph integration validator, seed a fully-populated council session and call runtime query CLI with each of the five documented modes; assert each returns bounded prompt-safe context.` | upsert (full set) -> query x5 (each mode, limit 5) | All 5 modes succeed with bounded prompt-safe metadata | 5 query responses | PASS if all 5 modes wired and bounded | Inspect query handler mode dispatch + per-mode helpers |

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
| `.opencode/skills/deep-loop-runtime/scripts/query.cjs` | runtime CLI script: per-mode dispatch |
| `.opencode/skills/deep-loop-runtime/lib/council/council-graph-query.ts` | Per-mode query helpers |
| `.opencode/skills/deep-loop-runtime/scripts/query.cjs` | Runtime query-type dispatch for `unresolved_disagreements`, `evidence_chain`, `decision_support`, `convergence_blockers`, and `hot_nodes` |
| `.opencode/skills/deep-loop-runtime/tests/integration/council-graph-script.vitest.ts` | Test: "upserts prompt-safe council graph data and queries unresolved disagreements and decision support" |
| `.opencode/skills/deep-loop-workflows/ai-council/references/integration/graph_support.md` | Documents the five query modes |

---

## 5. SOURCE METADATA

- Group: COUNCIL GRAPH INTEGRATION
- Playbook ID: DAC-022
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `08--council-graph-integration/council-graph-query-five-modes-prompt-safe-context.md`
