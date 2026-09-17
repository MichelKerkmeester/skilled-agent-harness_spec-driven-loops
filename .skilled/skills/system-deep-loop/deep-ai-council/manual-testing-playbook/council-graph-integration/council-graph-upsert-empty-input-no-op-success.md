---
title: "DAC-020 -- runtime upsert CLI empty input no-op success"
description: "This scenario validates that `runtime upsert CLI` returns explicit no-op success on empty input rather than erroring. Anchors to council-graph-script.vitest.ts test 'treats empty upsert as an explicit no-op success'."
version: 2.3.0.5
---

# DAC-020 -- runtime upsert CLI empty input no-op success

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DAC-020`.

---

## 1. OVERVIEW

This scenario validates that calling `runtime upsert CLI` with empty `nodes` and empty `edges` arrays returns explicit no-op success (the response indicates `inserted: 0` or equivalent `noop: true` flag) instead of either erroring or silently swallowing the input.

### Why This Matters

Reducers and incremental updaters frequently issue diff-driven upserts where the diff for a given round may be empty (no new claims/disagreements/evidence since the previous tick). Erroring on empty input would force every caller to short-circuit defensively; silent success would hide actual bugs. The explicit no-op contract was added in 003 to remediate deep-review finding P1-001 and is enforced by a dedicated vitest test.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `DAC-020` and confirm the expected signals without contradictory evidence.

- Objective: Verify `runtime upsert CLI` returns explicit no-op success on empty input.
- Real user request: Try to upsert nothing into the council graph and tell me whether that errors or succeeds quietly.
- Prompt: `As a council-graph integration validator, call runtime upsert CLI with empty nodes and empty edges arrays and assert the response indicates explicit no-op success.`
- Expected execution process: Call `runtime upsert CLI` with `nodes: []` and `edges: []`; capture the response.
- Expected signals: Response is success (no thrown error, no error envelope), with `inserted: 0` (or equivalent `noop: true` indicator) and no rows written.
- Desired user-visible outcome: The user sees that empty upserts are explicitly safe and do not require defensive caller short-circuits.
- Pass/fail: PASS if response is explicit no-op success; FAIL if call errors or succeeds without communicating the no-op.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Pick a sandbox `(specFolder, sessionId)` pair (e.g. `specFolder='sandbox/dac-020', sessionId='dac-020-run-01'`).
2. Confirm initial state via `runtime status CLI` (counts likely 0).
3. Issue an empty `runtime upsert CLI` call.
4. Inspect the response shape for explicit no-op success.
5. Re-run `runtime status CLI`; confirm counts unchanged.

### Prompt

`As a council-graph integration validator, call runtime upsert CLI with empty nodes and empty edges arrays and assert the response indicates explicit no-op success.`

### Commands

1. `tool: runtime status CLI({ specFolder: 'sandbox/dac-020', sessionId: 'dac-020-run-01' })`
2. `tool: runtime upsert CLI({ specFolder: 'sandbox/dac-020', sessionId: 'dac-020-run-01', nodes: [], edges: [] })`
3. `tool: runtime status CLI({ specFolder: 'sandbox/dac-020', sessionId: 'dac-020-run-01' })`

### Expected

Step 2 returns explicit no-op success (e.g. `{ ok: true, inserted: 0, noop: true }` or equivalent shape per handler contract). Step 3 status counts equal step 1 counts.

### Evidence

Capture the empty-input response verbatim, plus before/after status counts.

### Pass / Fail

- **Pass**: Empty upsert returns success with explicit no-op indicator; counts unchanged.
- **Fail**: Empty upsert throws an error, returns a generic error envelope, or silently writes rows.

### Failure Triage

If the call errors, inspect `scripts/upsert.cjs` for the empty-input branch (added per remediation P1-001). If it succeeds without no-op indicator, the contract regressed — re-run `npx vitest run tests/council-graph-script.vitest.ts -t 'treats empty upsert as an explicit no-op success'` to confirm.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| DAC-020 | runtime upsert CLI empty input no-op | Verify empty payload returns explicit no-op success | `As a council-graph integration validator, call runtime upsert CLI with empty nodes and empty edges arrays and assert the response indicates explicit no-op success.` | status -> upsert (empty) -> status | Explicit no-op response + unchanged counts | runtime CLI responses + status counts | PASS if no-op success and unchanged counts | Inspect scripts/upsert.cjs empty-input branch |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `../manual-testing-playbook.md` | Root directory page and scenario summary |
| `feature-catalog/` | No feature catalog exists yet |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/skills/system-deep-loop/runtime/scripts/upsert.cjs` | runtime CLI script: explicit empty-input no-op branch (P1-001 remediation) |
| `.opencode/skills/system-deep-loop/runtime/tests/integration/council-graph-script.vitest.ts` | Test: "treats empty upsert as an explicit no-op success" |
| Internal design notes | CHK-020 lists this behavior |

---

## 5. SOURCE METADATA

- Group: COUNCIL GRAPH INTEGRATION
- Playbook ID: DAC-020
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `council-graph-integration/council-graph-upsert-empty-input-no-op-success.md`
