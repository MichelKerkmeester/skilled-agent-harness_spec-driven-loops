---
title: "DAL-030 -- Malformed JSONL surfaces corruptionWarnings, never crashes"
description: "Verify the reducer's parseJsonlDetailed collects malformed lines into corruptionWarnings (line, truncated raw, error) and sets hasCorruption, rather than dropping them silently or crashing, and that check-convergence.cjs best-effort-skips malformed lines."
version: 1.0.0.0
---

# DAL-030 -- Malformed JSONL surfaces corruptionWarnings, never crashes

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DAL-030`.

---

## 1. OVERVIEW

This scenario validates fault tolerance for `DAL-030`. The objective is to verify that the reducer's `parseJsonlDetailed` collects malformed state-log lines into a `corruptionWarnings` array (each with a `line` number, a truncated `raw` snippet, and the `error`) and sets `hasCorruption`, rather than dropping them silently or crashing, and that `check-convergence.cjs`'s `readJsonlIterationRecords` best-effort-skips unparseable lines while still counting the well-formed `iteration` records.

### WHY THIS MATTERS

A partially-corrupted state log (a truncated write, a concurrent-append race) must not crash a run or silently vanish evidence. Surfacing corruption as a visible, line-cited warning is fail-visible behavior — the operator sees exactly what could not be parsed — while the convergence check still derives an ordered view from the good lines.

---

## 2. SCENARIO CONTRACT

Operators should run this as a real orchestrator-led check rather than a synthetic command-matrix exercise. The scenario is only complete when the operator can explain the behavior back to a user in plain language.

- Objective: Verify malformed state-log JSONL becomes corruptionWarnings in the registry (fail-visible), and convergence still derives an ordered iteration view.
- Real user request: What happens if the state log gets partially corrupted mid-run?
- Prompt: `Validate deep-alignment fault tolerance: malformed state-log JSONL becomes corruptionWarnings in the registry (fail-visible), and convergence still derives an ordered iteration view.`
- Expected execution process: Build a state log with one good and one malformed line, run the reducer, confirm `corruptionWarnings` is populated and `hasCorruption` is true (no crash), then run `check-convergence.cjs` and confirm it still counts the good iteration.
- Desired user-facing outcome: The user is told corrupted lines are surfaced as line-cited warnings (not silently dropped, not a crash), and the run still proceeds off the well-formed records.
- Expected signals: `parseJsonlDetailed` returns `{records, corruptionWarnings}` where each warning has `{line, raw, error}` and `raw` is truncated past 200 chars; the reducer's registry carries `corruptionWarnings` + `hasCorruption`; `check-convergence.cjs readJsonlIterationRecords` skips unparseable lines (best-effort) and still counts well-formed `iteration` records.
- Pass/fail posture: PASS if the malformed line becomes a line-cited corruptionWarning (no crash) and convergence still counts the good iteration. FAIL if the reducer crashes, silently drops the bad line without a warning, or convergence miscounts.

---

## 3. TEST EXECUTION

### RECOMMENDED ORCHESTRATION PROCESS

1. Restate the user request in plain language before inspecting implementation details.
2. Follow the listed command sequence in order so the reducer's corruption surfacing is checked before the convergence best-effort skip.
3. Capture evidence that would let another operator reproduce the verdict without re-deriving the scenario.
4. Return a short user-facing explanation, not just raw implementation notes.
### Prompt
Validate deep-alignment fault tolerance: malformed state-log JSONL becomes corruptionWarnings in the registry (fail-visible), and convergence still derives an ordered iteration view.
### Commands
1. `bash: rg -n 'parseJsonlDetailed|corruptionWarnings|hasCorruption|slice\(0, 200\)|Malformed lines are the reducer' .opencode/skills/system-deep-loop/runtime/scripts/reduce-alignment-state.cjs .opencode/skills/system-deep-loop/deep-alignment/scripts/check-convergence.cjs`
2. `bash: D=$(mktemp -d); mkdir -p "$D/alignment"; L="sk-doc::docs::docs/"; printf '{"alignmentTarget":"fx","lanes":[{"authority":"sk-doc","artifactClass":"docs","scope":{"type":"paths","values":["docs/"]}}]}' > "$D/alignment/deep-alignment-config.json"; printf '{"type":"iteration","laneId":"%s","artifactsChecked":1,"newFindingsRatio":0}\n{this is not json\n' "$L" > "$D/alignment/deep-alignment-state.jsonl"; node -e "const {reduceAlignmentState}=require('./.opencode/skills/system-deep-loop/runtime/scripts/reduce-alignment-state.cjs'); const {registry}=reduceAlignmentState('$D',{write:false}); console.log('hasCorruption:',registry.hasCorruption,'warnings:',JSON.stringify(registry.corruptionWarnings));"`
3. `bash: D=$(mktemp -d); mkdir -p "$D/alignment"; L="sk-doc::docs::docs/"; printf '{"alignmentTarget":"fx","lanes":[{"authority":"sk-doc","artifactClass":"docs","scope":{"type":"paths","values":["docs/"]}}]}' > "$D/alignment/deep-alignment-config.json"; printf '{"lanes":[{"laneId":"%s","authority":"sk-doc","artifactClass":"docs","scope":{"type":"paths","values":["docs/"]},"artifacts":[{"path":"docs/a.md"}]}]}' "$L" > "$D/alignment/deep-alignment-corpus.json"; printf '{"type":"iteration","laneId":"%s","artifactsChecked":1,"newFindingsRatio":0}\nGARBAGE LINE\n{"type":"iteration","laneId":"%s","artifactsChecked":1,"newFindingsRatio":0}\n' "$L" "$L" > "$D/alignment/deep-alignment-state.jsonl"; node .opencode/skills/system-deep-loop/deep-alignment/scripts/check-convergence.cjs --spec-folder "$D" --stability-window 2 --json`
### Expected
Command 2: the reducer does NOT crash; `hasCorruption:true` and `corruptionWarnings` contains one entry with the offending `line` number, a `raw` snippet, and an `error`. Command 3: convergence counts the two well-formed iterations (skipping `GARBAGE LINE`) and reports `iterationsRun:2` with a normal decision — the malformed line is skipped, not fatal.
### Evidence
Capture the reducer's `hasCorruption:true` + line-cited warning and the convergence `iterationsRun:2` despite the garbage line.
### Pass/Fail
PASS if the malformed line becomes a line-cited corruptionWarning (no crash) and convergence still counts the good iterations. FAIL if the reducer crashes, silently drops the bad line without a warning, or convergence miscounts.
### Failure Triage
If the reducer throws instead of returning `corruptionWarnings`, the fail-visible contract is broken. If `iterationsRun` is 3 (counting the garbage line) or 1 (dropping a good one), inspect `readJsonlIterationRecords`'s parse guard.
---

## 4. SOURCE FILES

### PLAYBOOK SOURCES

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page, integrated alignment protocol, and scenario summary |
| `state-and-fault-tolerance/` | State category; the reducer + convergence corruption handling is exercised on fixtures here |

### IMPLEMENTATION AND RUNTIME ANCHORS

| File | Role |
|---|---|
| `.opencode/skills/system-deep-loop/runtime/scripts/reduce-alignment-state.cjs` | `parseJsonlDetailed` corruptionWarnings + hasCorruption |
| `.opencode/skills/system-deep-loop/deep-alignment/scripts/check-convergence.cjs` | `readJsonlIterationRecords` best-effort skip of malformed lines |

---

## 5. SOURCE METADATA

- Group: STATE AND FAULT TOLERANCE
- Playbook ID: DAL-030
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `state-and-fault-tolerance/malformed-jsonl-corruption-warnings.md`
