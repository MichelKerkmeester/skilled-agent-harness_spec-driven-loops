---
title: "COMM-007 -- Compatibility doctor selects original-only"
description: "This scenario validates that an incompatible protocol major produces a blocking doctor report and original-only route selection."
catalog_applicable: true
version: 1.0.0.0
---

# COMM-007 -- Compatibility doctor selects original-only

This file is the canonical operator contract for fail-closed compatibility diagnosis.

---

## 1. OVERVIEW

This scenario verifies that a critical compatibility check, represented by an incompatible protocol major, makes the doctor choose original-only presentation.

### Why This Matters

Unknown or incompatible runtime facts must degrade safely. Continuing with projection after a critical compatibility failure could corrupt presentation or suppress the only trustworthy original.

---

## 2. SCENARIO CONTRACT

- Objective: Prove a critical compatibility failure yields a blocking report and `original-only` route selection.
- Real user request: `Run the compatibility doctor against an incompatible protocol major and verify it selects original-only, then return PASS or FAIL with evidence.`
- Prompt: `Run the compatibility doctor against an incompatible protocol major and verify it selects original-only, then return PASS or FAIL with evidence.`
- Expected execution process: Run the focused critical-block doctor test from the package directory and inspect the named outcome in the test source and summary.
- Expected signals: Vitest exits zero with one passing focused test; the asserted report has `overallDecision: "blocked"` and `routeSelection: "original-only"`.
- Desired user-visible outcome: A verdict that names original-only as the safe doctor selection.
- Pass/fail: PASS if the focused test passes and both asserted report fields match; FAIL if the test fails, is not selected, or the doctor keeps the proposed projection route; SKIP only if Node or installed dependencies are unavailable.

---

## 3. TEST EXECUTION

### Exact Command Sequence

1. Change directory to `.opencode/skills/sk-communication/cli-communication-projection/`.
2. Run `npm run test -- test/doctor/doctor.test.ts -t "selects original-only whenever a critical check blocks"`.
3. Capture the exit status and focused-test summary.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| COMM-007 | Compatibility doctor selects original-only | Prove incompatible protocol evidence fails closed. | `Run the compatibility doctor against an incompatible protocol major and verify it selects original-only, then return PASS or FAIL with evidence.` | 1. `bash: cd .opencode/skills/sk-communication/cli-communication-projection` -> 2. `package: npm run test -- test/doctor/doctor.test.ts -t "selects original-only whenever a critical check blocks"` -> 3. Capture exit status and focused-test summary. | Exit zero; one focused test passes; test assertions require a `blocked` overall decision and `original-only` route selection. | Command transcript, exit status, passing test name, and asserted outcome fields. | PASS if all signals match; FAIL if the command fails or the doctor does not select original-only; SKIP only if Node or installed dependencies are unavailable. | 1. Rerun the complete doctor test file; 2. inspect the mutated protocol version fixture; 3. inspect compatibility check severity; 4. inspect route derivation in `doctor.ts`. |

### Evidence Review

The report's blocking status is necessary but not sufficient; evidence must also show that route selection is exactly `original-only`.

---

## 4. SOURCE FILES

### Playbook And Catalog Sources

| File | Role |
|---|---|
| [Root playbook](../manual-testing-playbook.md) | Package policy and scenario index. |
| [Compatibility doctor catalog entry](../../feature-catalog/packaging-and-release/compatibility-doctor.md) | Current fail-closed diagnosis contract. |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [Compatibility doctor](../../../../../.opencode/skills/sk-communication/cli-communication-projection/src/doctor/doctor.ts) | Runs checks and derives route selection. |
| [Doctor checks](../../../../../.opencode/skills/sk-communication/cli-communication-projection/src/doctor/checks.ts) | Version, capability, reachability, privacy, and tier checks. |
| [Doctor tests](../../../../../.opencode/skills/sk-communication/cli-communication-projection/test/doctor/doctor.test.ts) | Ready, degraded, blocking, and malformed-input outcomes. |

---

## 5. SOURCE METADATA

- Group: Release Gating
- Playbook ID: COMM-007
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `release-gating/compatibility-doctor-selects-original-only.md`
- Catalog entry: `packaging-and-release/compatibility-doctor.md`
- Prompt equality requirement: the SCENARIO CONTRACT prompt equals the 9-column table Exact Prompt cell and the root summary prompt.
