---
title: "DAL-023 -- Nothing-to-converge and vacuous-lane exclusion"
description: "Verify zero applicable lanes returns NOTHING_TO_CONVERGE, and that a lane which discovered zero artifacts is excluded from both sides of the coverage ratio (NOT_APPLICABLE) rather than blocking or falsely passing convergence."
version: 1.0.0.0
---

# DAL-023 -- Nothing-to-converge and vacuous-lane exclusion

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DAL-023`.

---

## 1. OVERVIEW

This scenario validates the zero-signal edge cases for `DAL-023`. The objective is to verify that `check-convergence.cjs` returns `NOTHING_TO_CONVERGE` when there are zero applicable lanes (no lanes resolved, or every lane discovered zero artifacts), and that a single lane which discovered zero artifacts is excluded from both sides of the coverage ratio (vacuously covered) while the reducer marks it `NOT_APPLICABLE` — so it neither blocks convergence nor gets folded into a false PASS.

### WHY THIS MATTERS

A lane whose scope matched nothing on disk is a legitimate outcome (an empty or unreachable scope). It must not silently pass as "checked" nor stall the run. And an entirely empty run must report "nothing to converge" and exit cleanly rather than looping. The shipped wiring test asserts both behaviors.

---

## 2. SCENARIO CONTRACT

Operators should run this as a real orchestrator-led check rather than a synthetic command-matrix exercise. The scenario is only complete when the operator can explain the behavior back to a user in plain language.

- Objective: Verify zero applicable lanes -> NOTHING_TO_CONVERGE, and a zero-artifact lane is excluded from the coverage ratio and marked NOT_APPLICABLE.
- Real user request: What happens if my scope matches nothing, or one of several lanes finds nothing?
- Prompt: `Validate deep-alignment's nothing-to-converge signal and vacuous-lane handling: zero applicable lanes -> NOTHING_TO_CONVERGE, and a zero-artifact lane is excluded from the coverage ratio.`
- Expected execution process: Run `checkConvergence` on a zero-lane fixture (expect NOTHING_TO_CONVERGE), then on a two-lane fixture where one lane has zero artifacts and the other is fully checked and stable (expect CONVERGED with the empty lane excluded from `coverage.discovered` and marked NOT_APPLICABLE by the reducer).
- Desired user-facing outcome: The user is told an empty run reports "nothing to converge", and a lane that found nothing is set aside (NOT_APPLICABLE) rather than counted as covered or blocking the run.
- Expected signals: `checkConvergence` returns `NOTHING_TO_CONVERGE` when `registry.overall.nothingToConverge`; `computeArtifactCoverage` skips a lane with zero discovered artifacts on both sides of the ratio; the reducer marks that lane `NOT_APPLICABLE`; the wiring test's `testZeroLanesCleanExit` and `testZeroArtifactLaneIsNotApplicable` assert both behaviors.
- Pass/fail posture: PASS if a zero-lane run reports NOTHING_TO_CONVERGE and a vacuous lane is excluded + NOT_APPLICABLE while the applicable lane converges. FAIL if an empty run loops/errors or a vacuous lane blocks or falsely passes convergence.

---

## 3. TEST EXECUTION

### RECOMMENDED ORCHESTRATION PROCESS

1. Restate the user request in plain language before inspecting implementation details.
2. Follow the listed command sequence in order so the zero-lane case is checked before the mixed vacuous-lane case.
3. Capture evidence that would let another operator reproduce the verdict without re-deriving the scenario.
4. Return a short user-facing explanation, not just raw implementation notes.
### Prompt
Validate deep-alignment's nothing-to-converge signal and vacuous-lane handling: zero applicable lanes -> NOTHING_TO_CONVERGE, and a zero-artifact lane is excluded from the coverage ratio.
### Commands
1. `bash: rg -n 'NOTHING_TO_CONVERGE|nothingToConverge|vacuous|excluded from both sides|laneDiscovered === 0' .opencode/skills/system-deep-loop/deep-alignment/scripts/check-convergence.cjs .opencode/skills/system-deep-loop/runtime/scripts/reduce-alignment-state.cjs`
2. `bash: D=$(mktemp -d); mkdir -p "$D/alignment"; printf '{"alignmentTarget":"empty","lanes":[]}' > "$D/alignment/deep-alignment-config.json"; printf '{"lanes":[]}' > "$D/alignment/deep-alignment-corpus.json"; node .opencode/skills/system-deep-loop/deep-alignment/scripts/check-convergence.cjs --spec-folder "$D" --json`
3. `bash: D=$(mktemp -d); mkdir -p "$D/alignment"; L0="sk-doc::docs::docs/nonexistent/"; L1="sk-git::git-history::main..HEAD"; printf '{"alignmentTarget":"mixed","lanes":[{"authority":"sk-doc","artifactClass":"docs","scope":{"type":"paths","values":["docs/nonexistent/"]}},{"authority":"sk-git","artifactClass":"git-history","scope":{"type":"branchRange","from":"main","to":"HEAD"}}]}' > "$D/alignment/deep-alignment-config.json"; printf '{"lanes":[{"laneId":"%s","authority":"sk-doc","artifactClass":"docs","scope":{"type":"paths","values":["docs/nonexistent/"]},"artifacts":[]},{"laneId":"%s","authority":"sk-git","artifactClass":"git-history","scope":{"type":"branchRange","from":"main","to":"HEAD"},"artifacts":[{"path":"CHANGELOG.md","ref":"HEAD"}]}]}' "$L0" "$L1" > "$D/alignment/deep-alignment-corpus.json"; printf '{"type":"iteration","laneId":"%s","artifactsChecked":1,"newFindingsRatio":0}\n{"type":"iteration","laneId":"%s","artifactsChecked":1,"newFindingsRatio":0}\n' "$L1" "$L1" > "$D/alignment/deep-alignment-state.jsonl"; node .opencode/skills/system-deep-loop/deep-alignment/scripts/check-convergence.cjs --spec-folder "$D" --stability-window 2 --json; node .opencode/skills/system-deep-loop/runtime/scripts/reduce-alignment-state.cjs "$D" | rg -n 'NOT_APPLICABLE|overallVerdict'`
### Expected
Command 2 (zero lanes) returns `decision:NOTHING_TO_CONVERGE`. Command 3 returns `decision:CONVERGED` with `coverage.discovered:1` (the empty sk-doc lane excluded, only the sk-git lane's 1 artifact counted), and the reducer marks the empty lane `NOT_APPLICABLE`.
### Evidence
Capture the NOTHING_TO_CONVERGE decision, the CONVERGED decision with `coverage.discovered:1`, and the reducer's NOT_APPLICABLE verdict for the empty lane.
### Pass/Fail
PASS if the zero-lane run reports NOTHING_TO_CONVERGE and the vacuous lane is excluded + NOT_APPLICABLE while the applicable lane converges. FAIL if an empty run loops/errors or a vacuous lane blocks or falsely passes convergence.
### Failure Triage
If `coverage.discovered` is 2 in command 3, the vacuous lane is being counted as coverable (the finding). If the empty run errors instead of NOTHING_TO_CONVERGE, the overall.nothingToConverge signal is not wired.
---

## 4. SOURCE FILES

### PLAYBOOK SOURCES

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page, integrated alignment protocol, and scenario summary |
| `iteration-and-convergence/` | Convergence category; `check-convergence.cjs` + the reducer are exercised on fixtures here |

### IMPLEMENTATION AND RUNTIME ANCHORS

| File | Role |
|---|---|
| `.opencode/skills/system-deep-loop/deep-alignment/scripts/check-convergence.cjs` | `NOTHING_TO_CONVERGE` decision; `computeArtifactCoverage` vacuous-lane exclusion |
| `.opencode/skills/system-deep-loop/runtime/scripts/reduce-alignment-state.cjs` | `NOT_APPLICABLE` verdict; `nothingToConverge` rollup flag |
| `.opencode/skills/system-deep-loop/deep-alignment/scripts/tests/state-machine-wiring.test.cjs` | `testZeroLanesCleanExit`, `testZeroArtifactLaneIsNotApplicable` |

---

## 5. SOURCE METADATA

- Group: ITERATION AND CONVERGENCE
- Playbook ID: DAL-023
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `iteration-and-convergence/nothing-to-converge-and-vacuous-lane.md`
