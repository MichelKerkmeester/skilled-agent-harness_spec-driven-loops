---
title: "DAL-019 -- Corpus partitioning round-robin"
description: "Verify partition-corpus.cjs walks the discovered corpus lane-by-lane in declaration order (wrapping), slices batchSize unaudited artifacts per call using the reducer's checked count, skips zero/exhausted lanes, and returns done=true only when every corpus is exhausted."
version: 1.0.0.0
---

# DAL-019 -- Corpus partitioning round-robin

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DAL-019`.

---

## 1. OVERVIEW

This scenario validates corpus partitioning for `DAL-019`. The objective is to verify that `partition-corpus.cjs` reads the DISCOVER-state corpus and the reducer's per-lane `artifactsChecked` count, returns the next lane with unaudited artifacts remaining in corpus-declaration order (wrapping), slices `batchSize` (default 5) artifacts per call, skips a zero-length or fully-checked lane without ending the walk, and returns `{done:true}` only when every lane's corpus is exhausted.

### WHY THIS MATTERS

Unlike deep-review's fixed four-dimension rotation, deep-alignment's lanes are N-many with variable artifact counts, so "what to check next" is a real per-run decision. Stable lane-declaration-order round-robin keeps the walk deterministic and reproducible across calls; a wrong skip or terminal condition would leave artifacts unaudited or loop forever.

---

## 2. SCENARIO CONTRACT

Operators should run this as a real orchestrator-led check rather than a synthetic command-matrix exercise. The scenario is only complete when the operator can explain the behavior back to a user in plain language.

- Objective: Verify lane-declaration-order round-robin, batch slicing against the reducer's checked count, skip of exhausted/zero lanes, and the done=true terminal.
- Real user request: In a multi-lane run, how does it decide which artifacts to check next, and does it ever miss any?
- Prompt: `Validate deep-alignment corpus partitioning: lane-declaration-order round-robin, batch slicing against the reducer's checked count, skip of exhausted/zero lanes, and the done=true terminal.`
- Expected execution process: Build a two-lane corpus fixture, call `partitionCorpus` repeatedly appending iteration records that advance the checked counts, and confirm the slice rotates lanes in declaration order, skips exhausted lanes, and finally returns `{done:true}`.
- Desired user-facing outcome: The user is told the loop rotates through lanes in order, checks a batch at a time, skips lanes already done, and stops only when everything has been checked at least once.
- Expected signals: `resolveNextSlice` returns the next lane with unaudited artifacts in corpus-declaration order, wrapping; a fully-checked or zero-artifact lane is skipped without ending the walk; `{done:true}` only when all corpora are exhausted; this is distinct from deep-review's fixed four-dimension rotation.
- Pass/fail posture: PASS if the walk rotates in declaration order, skips exhausted/zero lanes, and terminates only when all are exhausted. FAIL if it re-slices an exhausted lane, skips an unchecked lane, or terminates early.

---

## 3. TEST EXECUTION

### RECOMMENDED ORCHESTRATION PROCESS

1. Restate the user request in plain language before inspecting implementation details.
2. Follow the listed command sequence in order so the fixture is built before the repeated partition calls.
3. Capture evidence that would let another operator reproduce the verdict without re-deriving the scenario.
4. Return a short user-facing explanation, not just raw implementation notes.
### Prompt
Validate deep-alignment corpus partitioning: lane-declaration-order round-robin, batch slicing against the reducer's checked count, skip of exhausted/zero lanes, and the done=true terminal.
### Commands
1. `bash: rg -n 'resolveNextSlice|DEFAULT_BATCH_SIZE|round-robin|declaration order|done: true|alreadyChecked >= totalArtifacts' .opencode/skills/system-deep-loop/deep-alignment/scripts/partition-corpus.cjs`
2. `bash: D=$(mktemp -d); mkdir -p "$D/alignment/deltas" "$D/alignment/iterations"; L1="sk-doc::docs::docs/"; L2="sk-git::git-history::main..HEAD"; printf '{"alignmentTarget":"fx","lanes":[{"authority":"sk-doc","artifactClass":"docs","scope":{"type":"paths","values":["docs/"]}},{"authority":"sk-git","artifactClass":"git-history","scope":{"type":"branchRange","from":"main","to":"HEAD"}}]}' > "$D/alignment/deep-alignment-config.json"; printf '{"lanes":[{"laneId":"%s","authority":"sk-doc","artifactClass":"docs","scope":{"type":"paths","values":["docs/"]},"artifacts":[{"path":"docs/a.md"},{"path":"docs/b.md"}]},{"laneId":"%s","authority":"sk-git","artifactClass":"git-history","scope":{"type":"branchRange","from":"main","to":"HEAD"},"artifacts":[{"path":"CHANGELOG.md","ref":"HEAD"}]}]}' "$L1" "$L2" > "$D/alignment/deep-alignment-corpus.json"; node .opencode/skills/system-deep-loop/deep-alignment/scripts/partition-corpus.cjs --spec-folder "$D" --json; echo "$L1|$L2|$D" > /tmp/dal019.env`
3. `bash: read L1 L2 D < <(awk -F'|' '{print $1, $2, $3}' /tmp/dal019.env); printf '{"type":"iteration","laneId":"%s","artifactsChecked":2,"newFindingsRatio":1}\n' "$L1" >> "$D/alignment/deep-alignment-state.jsonl"; node .opencode/skills/system-deep-loop/deep-alignment/scripts/partition-corpus.cjs --spec-folder "$D" --json; printf '{"type":"iteration","laneId":"%s","artifactsChecked":1,"newFindingsRatio":0}\n' "$L2" >> "$D/alignment/deep-alignment-state.jsonl"; node .opencode/skills/system-deep-loop/deep-alignment/scripts/partition-corpus.cjs --spec-folder "$D" --json`
### Expected
The first partition call returns lane 1 (`sk-doc`) with a 2-artifact slice. After recording lane 1 as fully checked, the next call returns lane 2 (`sk-git`) with its 1-artifact slice. After recording lane 2 checked, the final call returns `{done:true}`. The walk visited lanes in declaration order and never re-sliced an exhausted lane.
### Evidence
Capture the three partition results (lane1 slice -> lane2 slice -> done) and the source lines proving declaration-order rotation and the exhausted-lane skip.
### Pass/Fail
PASS if the walk rotates in declaration order, skips exhausted/zero lanes, and terminates only when all are exhausted. FAIL if it re-slices an exhausted lane, skips an unchecked lane, or terminates early.
### Failure Triage
If the second call returns lane 1 again despite it being fully checked, the `alreadyChecked >= totalArtifacts` skip is broken. If `done:true` appears while an unchecked lane remains, the terminal condition is wrong.
---

## 4. SOURCE FILES

### PLAYBOOK SOURCES

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page, integrated alignment protocol, and scenario summary |
| `iteration-and-convergence/` | Iteration category; `partition-corpus.cjs` is exercised directly on a fixture here |

### IMPLEMENTATION AND RUNTIME ANCHORS

| File | Role |
|---|---|
| `.opencode/skills/system-deep-loop/deep-alignment/scripts/partition-corpus.cjs` | `resolveNextSlice`, batch size, exhausted-lane skip, done terminal |
| `.opencode/skills/system-deep-loop/runtime/scripts/reduce-alignment-state.cjs` | Supplies the per-lane `artifactsChecked` count partitioning reads |
| `.opencode/skills/system-deep-loop/deep-alignment/references/state_machine_wiring.md` | §6 corpus-partitioning (lane round-robin) description |

---

## 5. SOURCE METADATA

- Group: ITERATION AND CONVERGENCE
- Playbook ID: DAL-019
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `iteration-and-convergence/corpus-partitioning-round-robin.md`
- Note: The laneId format is `authority::artifactClass::<scope-summary>`; the fixture above hard-codes the two expected laneIds so the state-log iteration records match what the reducer derives.
