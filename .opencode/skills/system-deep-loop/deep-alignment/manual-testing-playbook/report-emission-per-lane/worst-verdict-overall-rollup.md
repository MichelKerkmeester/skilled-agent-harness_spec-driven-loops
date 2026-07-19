---
title: "DAL-027 -- Worst-verdict overall rollup"
description: "Verify the overall verdict is the WORST per-lane verdict (via VERDICT_SEVERITY_RANK), never an average — a single FAIL lane fails the run, NOT_APPLICABLE never raises the verdict, and an all-NOT_APPLICABLE run reports a trivial PASS flagged nothingToConverge."
version: 1.0.0.0
---

# DAL-027 -- Worst-verdict overall rollup

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DAL-027`.

---

## 1. OVERVIEW

This scenario validates the overall-verdict rollup for `DAL-027`. The objective is to verify that `buildOverallRollup` derives the overall verdict as the WORST per-lane verdict via `VERDICT_SEVERITY_RANK` (FAIL=3 > CONDITIONAL=2 > PASS=1 > NOT_APPLICABLE=0), never an average — a single FAIL lane fails the whole run regardless of clean lanes, `NOT_APPLICABLE` never raises the verdict, and an all-`NOT_APPLICABLE` run reports a trivial `PASS` flagged `nothingToConverge`. Per-lane verdicts derive P0->FAIL / P1->CONDITIONAL / else PASS (zero-artifact -> NOT_APPLICABLE).

### WHY THIS MATTERS

Averaging would let one stuck, failing lane be masked by several converged clean lanes — a named risk in the mode's own design. The worst-verdict rule guarantees a single P0 anywhere forces the run to FAIL, which is the only safe rollup for a conformance audit.

---

## 2. SCENARIO CONTRACT

Operators should run this as a real orchestrator-led check rather than a synthetic command-matrix exercise. The scenario is only complete when the operator can explain the behavior back to a user in plain language.

- Objective: Verify a single FAIL lane fails the run, NOT_APPLICABLE never raises the verdict, and an all-NA run is a trivial PASS flagged nothingToConverge.
- Real user request: If one authority fails but the others pass, what is the overall verdict?
- Prompt: `Validate deep-alignment's worst-verdict rollup: a single FAIL lane fails the run, NOT_APPLICABLE never raises the verdict, and an all-NA run is a trivial PASS flagged nothingToConverge.`
- Expected execution process: Build a fixture with one clean (PASS) lane and one P0 (FAIL) lane, run the reducer, confirm overall FAIL; then an all-empty-lane fixture, confirm overall PASS with `nothingToConverge:true`; read `VERDICT_SEVERITY_RANK` and `buildOverallRollup`.
- Desired user-facing outcome: The user is told the overall verdict is the worst lane's verdict — one FAIL means the run fails — and that a run where nothing was applicable is a flagged trivial pass, not a real evidenced pass.
- Expected signals: `buildOverallRollup` uses `VERDICT_SEVERITY_RANK` (FAIL=3 > CONDITIONAL=2 > PASS=1 > NOT_APPLICABLE=0) to pick the worst; a FAIL lane among clean lanes yields overall FAIL; an all-NOT_APPLICABLE run yields `verdict:'PASS'` with `nothingToConverge:true`; per-lane verdict derives P0->FAIL / P1->CONDITIONAL / else PASS (zero-artifact -> NOT_APPLICABLE).
- Pass/fail posture: PASS if the overall verdict is the worst per-lane verdict and the all-NA case is a flagged trivial pass. FAIL if verdicts are averaged or a FAIL lane is masked.

---

## 3. TEST EXECUTION

### RECOMMENDED ORCHESTRATION PROCESS

1. Restate the user request in plain language before inspecting implementation details.
2. Follow the listed command sequence in order so the mixed-verdict fixture is checked before the all-NA case.
3. Capture evidence that would let another operator reproduce the verdict without re-deriving the scenario.
4. Return a short user-facing explanation, not just raw implementation notes.
### Prompt
Validate deep-alignment's worst-verdict rollup: a single FAIL lane fails the run, NOT_APPLICABLE never raises the verdict, and an all-NA run is a trivial PASS flagged nothingToConverge.
### Commands
1. `bash: rg -n 'VERDICT_SEVERITY_RANK|worstVerdict|buildOverallRollup|nothingToConverge|never an average|single FAIL lane' .opencode/skills/system-deep-loop/runtime/scripts/reduce-alignment-state.cjs`
2. `bash: D=$(mktemp -d); mkdir -p "$D/alignment/deltas"; L1="sk-doc::docs::docs/"; L2="sk-git::git-history::main..HEAD"; printf '{"alignmentTarget":"fx","lanes":[{"authority":"sk-doc","artifactClass":"docs","scope":{"type":"paths","values":["docs/"]}},{"authority":"sk-git","artifactClass":"git-history","scope":{"type":"branchRange","from":"main","to":"HEAD"}}]}' > "$D/alignment/deep-alignment-config.json"; printf '{"type":"iteration","laneId":"%s","artifactsChecked":1,"newFindingsRatio":0}\n{"type":"iteration","laneId":"%s","artifactsChecked":1,"newFindingsRatio":1}\n' "$L1" "$L2" > "$D/alignment/deep-alignment-state.jsonl"; printf '{"type":"finding","laneId":"%s","finding":{"severity":"P0","type":"invalid-subject-format","message":"bad","artifactRef":"abc"}}\n' "$L2" > "$D/alignment/deltas/iter-002.jsonl"; node .opencode/skills/system-deep-loop/runtime/scripts/reduce-alignment-state.cjs "$D" | rg -n 'overallVerdict'`
3. `bash: D=$(mktemp -d); mkdir -p "$D/alignment"; L="sk-doc::docs::docs/x/"; printf '{"alignmentTarget":"empty","lanes":[{"authority":"sk-doc","artifactClass":"docs","scope":{"type":"paths","values":["docs/x/"]}}]}' > "$D/alignment/deep-alignment-config.json"; printf '{"type":"iteration","laneId":"%s","artifactsChecked":0,"newFindingsRatio":0}\n' "$L" > "$D/alignment/deep-alignment-state.jsonl"; node -e "const {reduceAlignmentState}=require('./.opencode/skills/system-deep-loop/runtime/scripts/reduce-alignment-state.cjs'); const {registry}=reduceAlignmentState('$D',{write:false}); console.log('overall:',registry.overall.verdict,'nothingToConverge:',registry.overall.nothingToConverge,'lane0:',registry.lanes[0].verdict);"`
### Expected
Command 2: one PASS lane (sk-doc, no findings) plus one FAIL lane (sk-git, a P0) yields `overallVerdict: FAIL` — the FAIL is not averaged away. Command 3: an all-empty-lane run yields `overall: PASS` with `nothingToConverge: true` and the lane verdict `NOT_APPLICABLE`. The source shows `VERDICT_SEVERITY_RANK` and the worst-verdict selection.
### Evidence
Capture the mixed-fixture `overallVerdict: FAIL`, the all-NA `PASS`/`nothingToConverge:true`/`NOT_APPLICABLE`, and the `VERDICT_SEVERITY_RANK` source.
### Pass/Fail
PASS if the overall verdict is the worst per-lane verdict and the all-NA case is a flagged trivial pass. FAIL if verdicts are averaged or a FAIL lane is masked.
### Failure Triage
If the mixed fixture yields anything other than FAIL, the worst-verdict rollup is masking the failing lane (the named design risk realized). If the all-NA case yields a PASS without `nothingToConverge:true`, a caller could mistake zero coverage for a real pass.
---

## 4. SOURCE FILES

### PLAYBOOK SOURCES

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page, integrated alignment protocol, and scenario summary |
| `report-emission-per-lane/` | Report category; the reducer's rollup is exercised on fixtures here |

### IMPLEMENTATION AND RUNTIME ANCHORS

| File | Role |
|---|---|
| `.opencode/skills/system-deep-loop/runtime/scripts/reduce-alignment-state.cjs` | `VERDICT_SEVERITY_RANK`, `buildLaneEntry` verdict derivation, `buildOverallRollup` |

---

## 5. SOURCE METADATA

- Group: REPORT EMISSION PER LANE
- Playbook ID: DAL-027
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `report-emission-per-lane/worst-verdict-overall-rollup.md`
