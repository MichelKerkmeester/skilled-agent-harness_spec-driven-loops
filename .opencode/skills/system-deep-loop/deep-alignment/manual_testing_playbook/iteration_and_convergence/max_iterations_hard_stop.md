---
title: "DAL-021 -- Max-iterations independent hard stop"
description: "Verify iterationsRun >= maxIterations forces STOP_MAX_ITERATIONS regardless of the coverage/stability AND-pair — an independent safety backstop applied after the AND-pair is evaluated."
version: 1.0.0.0
---

# DAL-021 -- Max-iterations independent hard stop

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DAL-021`.

---

## 1. OVERVIEW

This scenario validates the max-iterations hard stop for `DAL-021`. The objective is to verify that `check-convergence.cjs` returns `STOP_MAX_ITERATIONS` when `iterationsRun >= maxIterations` even if neither coverage nor stability has been met — an independent backstop applied after the AND-pair is evaluated, so a lane that never stabilizes cannot run forever.

### WHY THIS MATTERS

The hard cap is the ultimate safety net against a runaway loop on a large or perpetually-drifting corpus. It must fire regardless of the coverage/stability result; otherwise a lane that keeps discovering findings could consume unbounded context. The shipped wiring test asserts exactly this behavior.

---

## 2. SCENARIO CONTRACT

Operators should run this as a real orchestrator-led check rather than a synthetic command-matrix exercise. The scenario is only complete when the operator can explain the behavior back to a user in plain language.

- Objective: Verify the max-iterations hard stop fires independently of coverage/stability.
- Real user request: If a lane never settles, does the audit ever stop on its own?
- Prompt: `Validate the deep-alignment max-iterations hard stop: it fires independently of coverage/stability once the iteration cap is reached.`
- Expected execution process: Build a never-converging fixture (coverage < 100%, always new findings), run `checkConvergence` with a small `maxIterations`, and confirm `STOP_MAX_ITERATIONS` with `coverage.met:false` / `stability.stable:false`; corroborate with the shipped `testMaxIterationsIndependentHardStop`.
- Desired user-facing outcome: The user is told the loop always terminates at `maxIterations` even if not all artifacts were covered and findings were still appearing.
- Expected signals: with coverage not met and stability false, reaching `maxIterations` returns `STOP_MAX_ITERATIONS` (not `CONTINUE`); `check-convergence.cjs` applies the cap after the AND-pair; the wiring test's `testMaxIterationsIndependentHardStop` asserts exactly this (`coverage.met=false`, `stability.stable=false`, decision `STOP_MAX_ITERATIONS`); default cap is 10.
- Pass/fail posture: PASS if the cap forces STOP_MAX_ITERATIONS regardless of the unmet AND-pair. FAIL if the loop returns CONTINUE at or past the cap.

---

## 3. TEST EXECUTION

### RECOMMENDED ORCHESTRATION PROCESS

1. Restate the user request in plain language before inspecting implementation details.
2. Follow the listed command sequence in order so the source cap logic is confirmed before the fixture run.
3. Capture evidence that would let another operator reproduce the verdict without re-deriving the scenario.
4. Return a short user-facing explanation, not just raw implementation notes.
### Prompt
Validate the deep-alignment max-iterations hard stop: it fires independently of coverage/stability once the iteration cap is reached.
### Commands
1. `bash: rg -n 'STOP_MAX_ITERATIONS|maxIterationsHit|iterationRecords.length >= maxIterations|independent hard stop|DEFAULT_MAX_ITERATIONS' .opencode/skills/system-deep-loop/deep-alignment/scripts/check-convergence.cjs`
2. `bash: D=$(mktemp -d); mkdir -p "$D/alignment"; L="sk-doc::docs::docs/"; printf '{"alignmentTarget":"fx","lanes":[{"authority":"sk-doc","artifactClass":"docs","scope":{"type":"paths","values":["docs/"]}}]}' > "$D/alignment/deep-alignment-config.json"; printf '{"lanes":[{"laneId":"%s","authority":"sk-doc","artifactClass":"docs","scope":{"type":"paths","values":["docs/"]},"artifacts":[{"path":"docs/a.md"},{"path":"docs/b.md"},{"path":"docs/c.md"}]}]}' "$L" > "$D/alignment/deep-alignment-corpus.json"; printf '{"type":"iteration","laneId":"%s","artifactsChecked":1,"newFindingsRatio":1}\n{"type":"iteration","laneId":"%s","artifactsChecked":1,"newFindingsRatio":1}\n' "$L" "$L" > "$D/alignment/deep-alignment-state.jsonl"; node .opencode/skills/system-deep-loop/deep-alignment/scripts/check-convergence.cjs --spec-folder "$D" --max-iterations 2 --stability-window 2 --json`
3. `bash: rg -n 'testMaxIterationsIndependentHardStop|STOP_MAX_ITERATIONS|coverage.met, false|stability.stable, false' .opencode/skills/system-deep-loop/deep-alignment/scripts/tests/state-machine-wiring.test.cjs`
### Expected
The fixture (2 of 3 artifacts checked, always new findings, cap 2) returns `decision:STOP_MAX_ITERATIONS` with `coverage.met:false` (2/3) and `stability.stable:false`. The source shows the cap applied after the AND-pair; the wiring test asserts the same three facts.
### Evidence
Capture the STOP_MAX_ITERATIONS JSON (with the unmet coverage/stability), the source cap logic, and the wiring-test assertions.
### Pass/Fail
PASS if the cap forces STOP_MAX_ITERATIONS regardless of the unmet AND-pair. FAIL if the loop returns CONTINUE at or past the cap.
### Failure Triage
If the decision is CONTINUE, the cap is not applied independently (the finding). If it is CONVERGED, the coverage/stability computation is wrong — cross-reference DAL-020.
---

## 4. SOURCE FILES

### PLAYBOOK SOURCES

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page, integrated alignment protocol, and scenario summary |
| `iteration-and-convergence/` | Convergence category; `check-convergence.cjs` is exercised directly on a fixture here |

### IMPLEMENTATION AND RUNTIME ANCHORS

| File | Role |
|---|---|
| `.opencode/skills/system-deep-loop/deep-alignment/scripts/check-convergence.cjs` | `STOP_MAX_ITERATIONS` decision, independent cap logic |
| `.opencode/skills/system-deep-loop/deep-alignment/scripts/tests/state-machine-wiring.test.cjs` | `testMaxIterationsIndependentHardStop` regression |
| `.opencode/skills/system-deep-loop/deep-alignment/references/state_machine_wiring.md` | §4 "max-iterations is an independent hard stop" |

---

## 5. SOURCE METADATA

- Group: ITERATION AND CONVERGENCE
- Playbook ID: DAL-021
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `iteration-and-convergence/max-iterations-hard-stop.md`
