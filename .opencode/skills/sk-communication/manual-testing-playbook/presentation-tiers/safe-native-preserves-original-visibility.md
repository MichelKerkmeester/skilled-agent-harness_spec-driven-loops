---
title: "COMM-005 -- Safe-native preserves original visibility"
description: "This scenario validates that append and sidecar presentation retain the original and failed commits fall back to original-only."
catalog_applicable: true
version: 1.0.0.0
---

# COMM-005 -- Safe-native preserves original visibility

This file is the canonical operator contract for safe-native presentation and display failure fallback.

---

## 1. OVERVIEW

This scenario verifies that safe-native append and sidecar paths keep the original visible and that a failed atomic commit exposes no uncommitted projection.

### Why This Matters

Constrained display surfaces cannot guarantee 1:1 replacement. Their safety promise is that the original remains visible until a validated projection has actually been committed through an allowed boundary.

---

## 2. SCENARIO CONTRACT

- Objective: Prove safe-native display modes preserve original visibility and display commit failures choose original-only.
- Real user request: `Verify that safe-native append and sidecar presentation keep the original visible, including commit failures, then report PASS or FAIL with evidence.`
- Prompt: `Verify that safe-native append and sidecar presentation keep the original visible, including commit failures, then report PASS or FAIL with evidence.`
- Expected execution process: Run the focused failed-atomic-commit display test and the focused successful-sidecar visibility test from the package directory.
- Expected signals: Both Vitest commands exit zero with one passing focused test; the named tests cover failed atomic commit fallback and sidecar projection with the original still visible.
- Desired user-visible outcome: A verdict supported by both failure and allowed-degradation evidence.
- Pass/fail: PASS if both focused tests pass; FAIL if either fails, is not selected, or evidence permits suppressing the original on a constrained or failed path; SKIP only if Node or installed dependencies are unavailable.

---

## 3. TEST EXECUTION

### Exact Command Sequence

1. Change directory to `packages/cli-communication-projection/`.
2. Run `npm run test -- test/clients/display.test.ts -t "never suppresses the original when the atomic commit fails"`.
3. Run `npm run test -- test/clients/sidecar.test.ts -t "shows the projection separately while leaving the original visible"`.
4. Capture both exit statuses and focused-test summaries.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| COMM-005 | Safe-native preserves original visibility | Prove constrained and failed presentation never hides the original. | `Verify that safe-native append and sidecar presentation keep the original visible, including commit failures, then report PASS or FAIL with evidence.` | 1. `bash: cd packages/cli-communication-projection` -> 2. `package: npm run test -- test/clients/display.test.ts -t "never suppresses the original when the atomic commit fails"` -> 3. `package: npm run test -- test/clients/sidecar.test.ts -t "shows the projection separately while leaving the original visible"` | Both commands exit zero; each reports one passing focused test; failed commit and sidecar-original-visible test names appear. | Both transcripts, exit statuses, and passing test names. | PASS if all signals match; FAIL if either command fails, a test is missing, or original visibility is false on these paths; SKIP only if Node or installed dependencies are unavailable. | 1. Rerun both complete client test files; 2. inspect result `mode` and visibility fields; 3. inspect `display.ts` commit-failure handling; 4. inspect `sidecar.ts` degradation handling. |

### Evidence Review

Evidence must cover both halves of the contract. A safe sidecar result does not prove failed atomic commits retain the original, and commit fallback alone does not prove allowed degradations keep both views visible.

---

## 4. SOURCE FILES

### Playbook And Catalog Sources

| File | Role |
|---|---|
| [Root playbook](../manual-testing-playbook.md) | Package policy and scenario index. |
| [Capability-aware presentation catalog entry](../../feature-catalog/fidelity-and-render/capability-aware-presentation.md) | Current full-projection and safe-native contract. |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [Display client](../../../../../packages/cli-communication-projection/src/clients/display.ts) | Atomic and append display application. |
| [Sidecar client](../../../../../packages/cli-communication-projection/src/clients/sidecar.ts) | Sidecar degradation with original visibility. |
| [Client display tests](../../../../../packages/cli-communication-projection/test/clients/display.test.ts) | Failed commit and append behavior. |
| [Sidecar tests](../../../../../packages/cli-communication-projection/test/clients/sidecar.test.ts) | Separate-view visibility and fallback. |

---

## 5. SOURCE METADATA

- Group: Presentation Tiers
- Playbook ID: COMM-005
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `presentation-tiers/safe-native-preserves-original-visibility.md`
- Catalog entry: `fidelity-and-render/capability-aware-presentation.md`
- Prompt equality requirement: the SCENARIO CONTRACT prompt equals the 9-column table Exact Prompt cell and the root summary prompt.
