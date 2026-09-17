---
title: "COMM-010 -- Claim omission veto and no-op recording"
description: "This scenario validates that a rewrite which drops a claim is rejected and that an unchanged candidate is recorded as a no-op rather than a pass."
catalog_applicable: true
version: 1.0.0.0
---

# COMM-010 -- Claim omission veto and no-op recording

This file is the canonical operator contract for the claim-coverage veto and the no-op change kind.

---

## 1. OVERVIEW

This scenario verifies two fidelity behaviors that share one guard: a candidate that loses a claim, caveat or requirement the source carried is rejected with the claim-omitted reason, and a candidate identical to its source is accepted with change kind no-op and records no structure or semantic pass marker.

### Why This Matters

A copy edit that silently drops "must" from a sentence has changed what the original promised. A provider that returns the input unchanged has done nothing, and a pass record that says otherwise hides that from the measurement.

---

## 2. SCENARIO CONTRACT

- Objective: Prove the claim-coverage veto rejects a dropped claim and the no-op path records itself as a no-op without earned pass markers.
- Real user request: `Verify that the projection rejects a rewrite which drops a required claim and records an unchanged rewrite as a no-op, then give me a PASS or FAIL verdict.`
- Prompt: `Verify that the projection rejects a rewrite which drops a required claim and records an unchanged rewrite as a no-op, then give me a PASS or FAIL verdict.`
- Expected execution process: Run the focused fidelity tests in the copy-editing instruction test file from the package directory.
- Expected signals: The Vitest command exits zero and reports the no-op case and the claim-omission case passing by name.
- Desired user-visible outcome: A verdict supported by both the rejection and the no-op evidence.
- Pass/fail: PASS if both named tests pass; FAIL if either fails or is absent; SKIP only if the supported Node runtime or installed dependencies are unavailable.

---

## 3. TEST EXECUTION

### Exact Command Sequence

1. Change directory to `.skilled/skills/sk-communication/cli-communication-projection/`.
2. Run `npm run test -- test/config/copy-editing-instruction.test.ts -t "claim omission and change kind"`.
3. Capture the exit status and the named Vitest summary.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| COMM-010 | Claim omission veto and no-op recording | Prove the dropped-claim rejection and the no-op record. | `Verify that the projection rejects a rewrite which drops a required claim and records an unchanged rewrite as a no-op, then give me a PASS or FAIL verdict.` | Step 2 above | Exit 0, the no-op and claim-omission tests named as passing | Vitest summary lines | PASS when both named tests pass | A failure names the test, open `src/fidelity/semantics.ts` for the claim extraction or `src/fidelity/validator.ts` for the guard |

### Evidence Review

Both behaviors sit inside the same guard in the validator, so a regression in one usually shows as a wrong marker count in the other. Read both test names in the summary, not only the exit status.

---

## 4. SOURCE FILES

### Playbook And Catalog Sources

| File | Role |
|---|---|
| `../manual-testing-playbook.md` | The playbook that routes here |
| `../../feature-catalog/provider-and-privacy/provider-adapters-and-execution.md` | The catalog entry that narrates the instruction, the veto and the no-op record |

### Implementation Sources

| File | Role |
|---|---|
| `../../cli-communication-projection/src/fidelity/validator.ts` | The guard that scopes the pass markers, the claim-coverage veto and the change kind |
| `../../cli-communication-projection/src/fidelity/semantics.ts` | The claim extraction and survival check |
| `../../cli-communication-projection/test/config/copy-editing-instruction.test.ts` | The named tests this scenario runs |
