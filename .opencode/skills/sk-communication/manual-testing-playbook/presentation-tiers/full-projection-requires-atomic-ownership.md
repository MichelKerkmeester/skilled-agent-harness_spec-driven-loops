---
title: "COMM-004 -- Full projection requires atomic ownership"
description: "This scenario validates that full projection is limited to a client-owned complete message with an atomic render decision."
catalog_applicable: true
version: 1.0.0.0
---

# COMM-004 -- Full projection requires atomic ownership

This file is the canonical operator contract for the full-projection presentation tier.

---

## 1. OVERVIEW

This scenario verifies that a client can atomically replace one complete visible message only when it owns both the complete message and the atomic render decision.

### Why This Matters

Claiming full 1:1 projection without both ownership guarantees risks hiding an incomplete original or presenting a candidate the client cannot commit atomically.

---

## 2. SCENARIO CONTRACT

- Objective: Prove the full-projection path performs one atomic replacement only at a client-owned complete-message boundary.
- Real user request: `Verify that a client-owned complete message uses an atomic full projection only when it owns the render decision, then report PASS or FAIL with evidence.`
- Prompt: `Verify that a client-owned complete message uses an atomic full projection only when it owns the render decision, then report PASS or FAIL with evidence.`
- Expected execution process: Run the focused client-display atomic replacement test from the package directory and inspect its result.
- Expected signals: Vitest exits zero with one passing focused test; `atomically replaces one complete visible message` is selected; no append path is used by the tested outcome.
- Desired user-visible outcome: A verdict tied to the ownership-gated atomic replacement behavior.
- Pass/fail: PASS if the focused test passes and the named full-projection behavior is exercised; FAIL if it fails, is not selected, or evidence shows append or original-only instead of the expected atomic replacement; SKIP only if Node or installed dependencies are unavailable.

---

## 3. TEST EXECUTION

### Exact Command Sequence

1. Change directory to `packages/cli-communication-projection/`.
2. Run `npm run test -- test/clients/display.test.ts -t "atomically replaces one complete visible message"`.
3. Capture the exit status and focused-test summary.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| COMM-004 | Full projection requires atomic ownership | Prove client-owned complete-message replacement is atomic. | `Verify that a client-owned complete message uses an atomic full projection only when it owns the render decision, then report PASS or FAIL with evidence.` | 1. `bash: cd packages/cli-communication-projection` -> 2. `package: npm run test -- test/clients/display.test.ts -t "atomically replaces one complete visible message"` -> 3. Capture exit status and focused-test summary. | Exit zero; one focused test passes; the atomic-replacement test name appears; no failing test appears. | Command transcript, exit status, and passing test name. | PASS if all signals match; FAIL if the command fails, the test is not selected, or the outcome is not atomic replacement; SKIP only if Node or installed dependencies are unavailable. | 1. Rerun the full display test file; 2. inspect ownership values in the fixture; 3. inspect `applyDisplayPresentation`; 4. inspect runtime capability tier resolution. |

### Evidence Review

The scenario proves the positive full-projection boundary. `COMM-005` separately proves that constrained or failed presentation never suppresses the original.

---

## 4. SOURCE FILES

### Playbook And Catalog Sources

| File | Role |
|---|---|
| [Root playbook](../manual-testing-playbook.md) | Package policy and scenario index. |
| [Capability-aware presentation catalog entry](../../feature-catalog/fidelity-and-render/capability-aware-presentation.md) | Current display-mode contract. |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [Display client](../../../../../packages/cli-communication-projection/src/clients/display.ts) | Applies atomic replacement and append outcomes. |
| [Render decision](../../../../../packages/cli-communication-projection/src/render/decision.ts) | Selects digest-checked supported render modes. |
| [Client display tests](../../../../../packages/cli-communication-projection/test/clients/display.test.ts) | Atomic ownership and commit behavior. |

---

## 5. SOURCE METADATA

- Group: Presentation Tiers
- Playbook ID: COMM-004
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `presentation-tiers/full-projection-requires-atomic-ownership.md`
- Catalog entry: `fidelity-and-render/capability-aware-presentation.md`
- Prompt equality requirement: the SCENARIO CONTRACT prompt equals the 9-column table Exact Prompt cell and the root summary prompt.
