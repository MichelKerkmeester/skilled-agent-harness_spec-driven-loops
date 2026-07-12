---
title: "DAL-028 -- Finding dedup and fail-closed severity"
description: "Verify findings dedup across iterations via findingDedupKey (contentHash else severity|type|artifact|message), that a re-emitted finding counts once, and that a finding without a recognized P0/P1/P2 severity is dropped (fail-closed) rather than counted."
version: 1.0.0.0
---

# DAL-028 -- Finding dedup and fail-closed severity

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DAL-028`.

---

## 1. OVERVIEW

This scenario validates finding deduplication and fail-closed severity for `DAL-028`. The objective is to verify that `buildLaneEntry` dedups findings across iterations via `findingDedupKey` (preferring a supplied `contentHash`, else a `severity|type|artifact|message` fallback that deliberately does not reach for an adapter-specific field), that a re-emitted finding (a re-checked artifact that still fails) counts once, and that a finding whose severity is not a recognized P0/P1/P2 is dropped (fail-closed, never guessed) rather than counted, with `SEVERITY_WEIGHTS` (P0=10, P1=5, P2=1) driving the composite score.

### WHY THIS MATTERS

Across a multi-iteration dry run, the same open finding is re-emitted each time an artifact is re-checked; counting it repeatedly would inflate severity totals and could block convergence. And a finding with a malformed severity must not be silently bucketed — dropping it fail-closed keeps the registry honest.

---

## 2. SCENARIO CONTRACT

Operators should run this as a real orchestrator-led check rather than a synthetic command-matrix exercise. The scenario is only complete when the operator can explain the behavior back to a user in plain language.

- Objective: Verify repeated findings count once and an unrecognized-severity finding is dropped rather than guessed.
- Real user request: If the same issue shows up in three iterations, is it counted three times? And what about a finding with a weird severity?
- Prompt: `Validate deep-alignment finding dedup and fail-closed severity: repeated findings count once, and an unrecognized-severity finding is dropped rather than guessed.`
- Expected execution process: Build a fixture whose deltas emit the same P1 finding twice plus one finding with a bogus severity, run the reducer, and confirm the lane's `findingsBySeverity` counts the P1 once and ignores the bogus one; read `findingDedupKey`, `normalizeSeverity`, and `SEVERITY_WEIGHTS`.
- Desired user-facing outcome: The user is told a recurring finding is counted once, and a finding without a valid P0/P1/P2 severity is dropped rather than mis-classified.
- Expected signals: `findingDedupKey` prefers `contentHash`, else a `severity|type|artifact|message` fallback that does not reach for an adapter-specific field; `buildLaneEntry` keeps only the first occurrence per key; `normalizeSeverity` returns null for a non-P0/P1/P2 value and that finding is skipped; `SEVERITY_WEIGHTS` (P0=10, P1=5, P2=1) drive the composite score.
- Pass/fail posture: PASS if a repeated finding counts once and a bogus-severity finding is dropped, with the composite score matching the weighted open findings. FAIL if a duplicate inflates the count or a bogus severity is bucketed.

---

## 3. TEST EXECUTION

### RECOMMENDED ORCHESTRATION PROCESS

1. Restate the user request in plain language before inspecting implementation details.
2. Follow the listed command sequence in order so the dedup/severity source is confirmed before the fixture run.
3. Capture evidence that would let another operator reproduce the verdict without re-deriving the scenario.
4. Return a short user-facing explanation, not just raw implementation notes.
### Prompt
Validate deep-alignment finding dedup and fail-closed severity: repeated findings count once, and an unrecognized-severity finding is dropped rather than guessed.
### Commands
1. `bash: rg -n 'findingDedupKey|normalizeSeverity|SEVERITY_WEIGHTS|not counted \(fail-closed|if \(!severity\) continue|byKey.has' .opencode/skills/system-deep-loop/runtime/scripts/reduce-alignment-state.cjs`
2. `bash: D=$(mktemp -d); mkdir -p "$D/alignment/deltas"; L="sk-doc::docs::docs/"; printf '{"alignmentTarget":"fx","lanes":[{"authority":"sk-doc","artifactClass":"docs","scope":{"type":"paths","values":["docs/"]}}]}' > "$D/alignment/deep-alignment-config.json"; printf '{"type":"iteration","laneId":"%s","artifactsChecked":1,"newFindingsRatio":1}\n{"type":"iteration","laneId":"%s","artifactsChecked":1,"newFindingsRatio":0}\n' "$L" "$L" > "$D/alignment/deep-alignment-state.jsonl"; printf '{"type":"finding","laneId":"%s","finding":{"severity":"P1","type":"dqi-below-threshold","message":"same","artifactPath":"docs/a.md"}}\n{"type":"finding","laneId":"%s","finding":{"severity":"P9","type":"weird","message":"bogus","artifactPath":"docs/a.md"}}\n' "$L" "$L" > "$D/alignment/deltas/iter-001.jsonl"; printf '{"type":"finding","laneId":"%s","finding":{"severity":"P1","type":"dqi-below-threshold","message":"same","artifactPath":"docs/a.md"}}\n' "$L" > "$D/alignment/deltas/iter-002.jsonl"; node -e "const {reduceAlignmentState}=require('./.opencode/skills/system-deep-loop/runtime/scripts/reduce-alignment-state.cjs'); const {registry}=reduceAlignmentState('$D',{write:false}); const l=registry.lanes[0]; console.log('findingsBySeverity:',JSON.stringify(l.findingsBySeverity),'open:',l.openFindings.length,'composite:',l.compositeScore);"`
### Expected
The lane reports `findingsBySeverity: {P0:0, P1:1, P2:0}` (the identical P1 emitted across iter-001 and iter-002 counted once), `open: 1` (the bogus-severity P9 finding dropped by `normalizeSeverity`), and `composite: 5` (one P1 x weight 5). The source shows `findingDedupKey`, the `if (!severity) continue` fail-closed skip, and `SEVERITY_WEIGHTS`.
### Evidence
Capture the deduped `findingsBySeverity`/`open`/`composite` values and the source lines proving the dedup key and the fail-closed severity skip.
### Pass/Fail
PASS if the repeated P1 counts once, the P9 is dropped, and the composite equals the weighted open findings. FAIL if the duplicate inflates the count (P1:2) or the bogus severity is bucketed.
### Failure Triage
If `open` is 2 or 3, either the dedup key is not collapsing the repeated finding or the bogus severity is being counted. Inspect `findingDedupKey`'s fallback and `normalizeSeverity`'s null return.
---

## 4. SOURCE FILES

### PLAYBOOK SOURCES

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page, integrated alignment protocol, and scenario summary |
| `report-emission-per-lane/` | Report category; the reducer's dedup/severity logic is exercised on a fixture here |

### IMPLEMENTATION AND RUNTIME ANCHORS

| File | Role |
|---|---|
| `.opencode/skills/system-deep-loop/runtime/scripts/reduce-alignment-state.cjs` | `findingDedupKey`, `normalizeSeverity` fail-closed skip, `SEVERITY_WEIGHTS`, `buildLaneEntry` |

---

## 5. SOURCE METADATA

- Group: REPORT EMISSION PER LANE
- Playbook ID: DAL-028
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `report-emission-per-lane/finding-dedup-and-fail-closed-severity.md`
