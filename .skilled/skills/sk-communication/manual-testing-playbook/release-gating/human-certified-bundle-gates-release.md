---
title: "COMM-008 -- Human-certified bundle gates release"
description: "This scenario validates that release requires a complete, fresh, passing, human-certified evidence bundle."
catalog_applicable: true
version: 1.0.0.0
---

# COMM-008 -- Human-certified bundle gates release

This file is the canonical operator contract for the positive release-readiness boundary.

---

## 1. OVERVIEW

This scenario verifies that the package release gate returns `release-ready` only for a complete, fresh, passing bundle whose evaluation lane is human-certified.

### Why This Matters

Fail-closed negative tests prove unsafe evidence is rejected; a positive boundary test is also required to show the exact complete evidence shape that can authorize release.

---

## 2. SCENARIO CONTRACT

- Objective: Prove only the complete human-certified evidence bundle yields a release-ready decision and all manifest lanes pass.
- Real user request: `Verify that only a complete, fresh, passing, human-certified evidence bundle can release the projection package, then return PASS or FAIL with evidence.`
- Prompt: `Verify that only a complete, fresh, passing, human-certified evidence bundle can release the projection package, then return PASS or FAIL with evidence.`
- Expected execution process: Run the focused positive release-gate test from the package directory and inspect its manifest assertions.
- Expected signals: Vitest exits zero with one passing focused test; the decision is `release-ready`; the manifest contains eight entries and every entry has status `pass`.
- Desired user-visible outcome: A verdict that names the successful decision and the complete passing-lane count.
- Pass/fail: PASS if the focused test passes and all three release signals match; FAIL if it fails, is not selected, the decision differs, the manifest census differs, or any entry is not passing; SKIP only if Node or installed dependencies are unavailable.

---

## 3. TEST EXECUTION

### Exact Command Sequence

1. Change directory to `.opencode/skills/sk-communication/cli-communication-projection/`.
2. Run `npm run test -- test/release/release-gate.test.ts -t "releases only a complete, fresh, passing, human-certified bundle"`.
3. Capture the exit status and focused-test summary.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| COMM-008 | Human-certified bundle gates release | Prove the complete human-certified evidence boundary authorizes release. | `Verify that only a complete, fresh, passing, human-certified evidence bundle can release the projection package, then return PASS or FAIL with evidence.` | 1. `bash: cd .opencode/skills/sk-communication/cli-communication-projection` -> 2. `package: npm run test -- test/release/release-gate.test.ts -t "releases only a complete, fresh, passing, human-certified bundle"` -> 3. Capture exit status and focused-test summary. | Exit zero; one focused test passes; decision is `release-ready`; manifest has eight passing entries. | Command transcript, exit status, passing test name, decision, and manifest census. | PASS if all signals match; FAIL if the command fails or any release signal differs; SKIP only if Node or installed dependencies are unavailable. | 1. Rerun the complete release-gate test file; 2. inspect the human evaluation fixture; 3. inspect evidence freshness bounds; 4. inspect manifest entry construction and abort reasons. |

### Evidence Review

The focused test is a positive boundary, not a waiver for the full package gate. Release review still requires `npm run check` and the manual critical-path scenarios selected for the run.

---

## 4. SOURCE FILES

### Playbook And Catalog Sources

| File | Role |
|---|---|
| [Root playbook](../manual-testing-playbook.md) | Package policy and scenario index. |
| [Release readiness and rollback catalog entry](../../feature-catalog/packaging-and-release/release-readiness-and-rollback.md) | Complete release-evidence and rollback contract. |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [Release gate](../../../../../.opencode/skills/sk-communication/cli-communication-projection/src/release/release-gate.ts) | Evaluates the dated evidence bundle. |
| [Release evidence contracts](../../../../../.opencode/skills/sk-communication/cli-communication-projection/src/release/evidence.ts) | Manifest lanes, decisions, and reason codes. |
| [Release gate tests](../../../../../.opencode/skills/sk-communication/cli-communication-projection/test/release/release-gate.test.ts) | Positive and fail-closed release evidence. |

---

## 5. SOURCE METADATA

- Group: Release Gating
- Playbook ID: COMM-008
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `release-gating/human-certified-bundle-gates-release.md`
- Catalog entry: `packaging-and-release/release-readiness-and-rollback.md`
- Prompt equality requirement: the SCENARIO CONTRACT prompt equals the 9-column table Exact Prompt cell and the root summary prompt.
