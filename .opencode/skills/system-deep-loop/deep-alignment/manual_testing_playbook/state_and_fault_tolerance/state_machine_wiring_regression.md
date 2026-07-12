---
title: "DAL-031 -- End-to-end state-machine wiring regression"
description: "Verify the shipped regression test drives the whole loop (SCOPE -> DISCOVER -> ITERATE -> CONVERGE -> REPORT -> REMEDIATE), and that the loopType decision (REQ-001) is honestly a self-contained manual coverage check, not a reused convergence.cjs code path."
version: 1.0.0.0
---

# DAL-031 -- End-to-end state-machine wiring regression

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DAL-031`.

---

## 1. OVERVIEW

This scenario validates the end-to-end wiring for `DAL-031`. The objective is to verify that the shipped regression test drives the whole loop — SCOPE (`scoping.cjs`) -> DISCOVER (seeded corpus) -> ITERATE (`partition-corpus.cjs`) -> CONVERGE (`check-convergence.cjs`) -> REPORT (`reduce-alignment-state.cjs`) -> REMEDIATE (`remediate-hook.cjs`) — proving the seams between the scripts, and that the loopType decision (REQ-001) is honestly documented: `runtime/scripts/convergence.cjs`'s loopType enum does not accept `"alignment"`, so `check-convergence.cjs` is the NFR-R01-sanctioned self-contained manual coverage check, with Option A (extend the enum) recorded as a scoped future recommendation rather than performed here.

### WHY THIS MATTERS

The wiring test is the mode's one real automated regression: it proves the six single-shot scripts compose into a correct loop. And the loopType decision is a place where the honest engineering choice (a self-contained coverage check, not a misleading reuse of a graph-based composite that would report permanent near-failure) is documented rather than glossed — verifying it keeps that honesty visible.

---

## 2. SCENARIO CONTRACT

Operators should run this as a real orchestrator-led check rather than a synthetic command-matrix exercise. The scenario is only complete when the operator can explain the behavior back to a user in plain language.

- Objective: Verify the wiring test passes end-to-end and that check-convergence.cjs is the documented NFR-R01 manual fallback.
- Real user request: Does the whole loop actually fit together, and why does alignment have its own convergence script instead of reusing the shared one?
- Prompt: `Validate deep-alignment end-to-end wiring by running state-machine-wiring.test.cjs, and confirm check-convergence.cjs is the documented NFR-R01 manual fallback (convergence.cjs's enum does not accept "alignment").`
- Expected execution process: Run the wiring test and confirm it prints its pass line; read `state_machine_wiring.md` §2's state-to-script map and §5's loopType decision; confirm `convergence.cjs`'s enum rejects `"alignment"`.
- Desired user-facing outcome: The user is told the six loop scripts compose correctly (the regression passes), and that alignment uses its own coverage check because the shared convergence engine's loopType enum does not accept alignment — a documented, scoped decision, not an oversight.
- Expected signals: `node scripts/tests/state-machine-wiring.test.cjs` runs all four tests and prints the pass line; `state_machine_wiring.md` §2's state-to-script map matches the scripts exercised; §5 documents that `convergence.cjs`'s loopType enum (research/review/council/context) does not accept "alignment", so `check-convergence.cjs` is the NFR-R01-sanctioned self-contained coverage check, and Option A (extend the enum) is a scoped future recommendation, not done here.
- Pass/fail posture: PASS if the wiring test passes and the loopType decision is documented as described (with `convergence.cjs`'s enum confirmed to exclude "alignment"). FAIL if the test fails or the loopType rationale is missing/contradicted by the real enum.

---

## 3. TEST EXECUTION

### RECOMMENDED ORCHESTRATION PROCESS

1. Restate the user request in plain language before inspecting implementation details.
2. Follow the listed command sequence in order so the regression run precedes the loopType-decision reading.
3. Capture evidence that would let another operator reproduce the verdict without re-deriving the scenario.
4. Return a short user-facing explanation, not just raw implementation notes.
### Prompt
Validate deep-alignment end-to-end wiring by running state-machine-wiring.test.cjs, and confirm check-convergence.cjs is the documented NFR-R01 manual fallback (convergence.cjs's enum does not accept "alignment").
### Commands
1. `bash: node .opencode/skills/system-deep-loop/deep-alignment/scripts/tests/state-machine-wiring.test.cjs; echo "exit=$?"`
2. `bash: sed -n '24,36p' .opencode/skills/system-deep-loop/deep-alignment/references/state_machine_wiring.md`
3. `bash: rg -n "loopType !== 'research'|loopType !== 'review'|loopType !== 'council'|loopType !== 'context'" .opencode/skills/system-deep-loop/runtime/scripts/convergence.cjs`
4. `bash: rg -n 'NFR-R01|documented manual coverage check|Option A|extend the enum|Do not silently reuse' .opencode/skills/system-deep-loop/deep-alignment/references/state_machine_wiring.md .opencode/skills/system-deep-loop/deep-alignment/scripts/check-convergence.cjs`
### Expected
The wiring test prints `[deep-alignment] state-machine wiring regression passed` and exits `0`, having driven SCOPE->DISCOVER->ITERATE->CONVERGE->REPORT->REMEDIATE across the four test cases. §2's state-to-script map names the six scripts. `convergence.cjs`'s validation line confirms its enum accepts only research/review/council/context (not "alignment"). §5 and the `check-convergence.cjs` header document the NFR-R01 self-contained-coverage-check decision and the scoped Option-A recommendation.
### Evidence
Capture the passing test line + exit 0, the §2 state-to-script map, the `convergence.cjs` enum-rejection line, and the §5/header loopType rationale.
### Pass/Fail
PASS if the wiring test passes and the loopType decision is documented as described (with `convergence.cjs`'s enum confirmed to exclude "alignment"). FAIL if the test fails or the loopType rationale is missing or contradicted by the real enum.
### Failure Triage
If the wiring test fails, isolate which of the four test functions failed and map it to the offending seam (scoping/partition/convergence/reducer/remediate). If `convergence.cjs`'s enum actually accepts "alignment", the §5 rationale is stale and should be re-verified against the live file.
---

## 4. SOURCE FILES

### PLAYBOOK SOURCES

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page, integrated alignment protocol, and scenario summary |
| `state-and-fault-tolerance/` | State category; the wiring regression is run directly here |

### IMPLEMENTATION AND RUNTIME ANCHORS

| File | Role |
|---|---|
| `.opencode/skills/system-deep-loop/deep-alignment/scripts/tests/state-machine-wiring.test.cjs` | The end-to-end wiring regression (4 tests) |
| `.opencode/skills/system-deep-loop/deep-alignment/references/state_machine_wiring.md` | §2 state-to-script map; §5 loopType decision |
| `.opencode/skills/system-deep-loop/deep-alignment/scripts/check-convergence.cjs` | Header documents the NFR-R01 self-contained coverage check |
| `.opencode/skills/system-deep-loop/runtime/scripts/convergence.cjs` | The shared engine whose loopType enum excludes "alignment" |

---

## 5. SOURCE METADATA

- Group: STATE AND FAULT TOLERANCE
- Playbook ID: DAL-031
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `state-and-fault-tolerance/state-machine-wiring-regression.md`
