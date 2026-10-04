---
title: "HVT-004 -- The reader-needed lens measurement"
description: "This scenario validates the reader-needed lens measurement for `HVT-004`. It confirms the zero-call run prints the census, the questions and the label-gate stop, writes no file and exits 0."
stage: routing
version: 1.2.0.0
---

# HVT-004 -- The reader-needed lens measurement

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `HVT-004`.

---

## 1. OVERVIEW

This scenario validates the reader-needed lens measurement for `HVT-004`. It confirms the zero-call run prints the census, the questions and the label-gate stop, writes no file and exits 0.

### Why This Matters

`scripts/hvr_reader_lens.py` measures offline how two no-call comparators and a flag-nothing floor read the three reader-needed Human Voice Rules tells: synonym cycling, significance inflation and false ranges. The default run makes no model call, writes no file and holds no credential.

Everything a run can print before the operator's labels exist is the census and the stop line, and a transcript that reads those as a measurement is reading the sample frame as a result. The quiet parts carry the same weight as the printed ones: no file is written, `git status --porcelain` is unchanged and no run prints a measurement beyond the label gate.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `HVT-004` and confirm the expected signals without contradictory evidence.

- Objective: confirm the zero-call run prints the census, the questions, the keep rule and the label-gate stop, writes no file and leaves the tree unchanged
- Real user request: `Before I label anything, what has the reader-needed lens measured so far?`
- Prompt: `Run the reader-needed lens against a scratch labels path and tell me what it printed.`
- Expected execution process: the orchestrator runs the lens with `--labels` at a scratch path that holds no rows, reads `git status --porcelain` before and after and checks the scratch root for written files
- Expected signals: step 2 prints the census lines, the three `question` lines, `margin: 0.10`, the `keep rule:` line, `labels: labeled=0 of 150` and `stop: fewer than 150 labeled rows`, then `exit=0`. Step 3 lists no file of the lens's own. Step 4 prints nothing
- Desired user-visible outcome: the author sees the census and the stop line as the whole result before the labels exist, and sees the lens write no file
- Pass/fail: PASS if every expected signal appears and the run ends with `exit=0`. FAIL if the run exits non-zero, the `stop:` line is missing, a file appears under the scratch root or the tree changed

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Run the reader-needed lens against a scratch labels path and tell me what it printed.`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| HVT-004 | The reader-needed lens measurement | Print the census, the questions and the label-gate stop with zero calls and write nothing | `Run the reader-needed lens against a scratch labels path and tell me what it printed.` | 1. `bash: SCRATCH=$(mktemp -d /tmp/hvr-reader-lens.XXXXXX); git status --porcelain > "$SCRATCH/status-before.txt"` -> 2. `bash: python3 .skilled/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_reader_lens.py --labels "$SCRATCH/labels.jsonl" > "$SCRATCH/run.txt"; code=$?; cat "$SCRATCH/run.txt"; echo "exit=$code"` -> 3. `bash: find "$SCRATCH" -type f` -> 4. `bash: git status --porcelain > "$SCRATCH/status-after.txt"; diff "$SCRATCH/status-before.txt" "$SCRATCH/status-after.txt"` -> 5. `bash: rm -rf "$SCRATCH"` | Step 2 prints `census: commit=<40hex> files=<n> sections=<n> flagged=<n> in_band_5_80=<n> refused=<n>`, one `census: category=<c> candidates=<n>` line per category, the three `question` lines, `margin: 0.10`, the `keep rule:` line, `labels: labeled=0 of 150` and `stop: fewer than 150 labeled rows`, then `exit=0`. Step 3 lists only the scratch files the scenario itself wrote. Step 4 prints nothing | The prompt, the reply text and the full output of steps 2 to 4 with the exit line, the `find` result and the `git status --porcelain` capture | PASS if every signal appears and the run ends with `exit=0`. FAIL if the run exits non-zero, the `stop:` line is missing, a file appears under the scratch root or the tree changed | 1. A missing `stop: fewer than 150 labeled rows` line means the run read a labels file that holds labels, since the command points `--labels` at a scratch path that must not exist. 2. A `labels.jsonl` under the scratch root means the run drew a sample instead of reading one. 3. A `git status --porcelain` diff naming a path no run touched means the tree moved under the scenario, and the capture must be repeated at a quiet moment. 4. A transcript quoting a `baseline` line has invented one, because a run with no labels stops at the gate |

### Commands

1. `bash: SCRATCH=$(mktemp -d /tmp/hvr-reader-lens.XXXXXX); git status --porcelain > "$SCRATCH/status-before.txt"`
2. `bash: python3 .skilled/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_reader_lens.py --labels "$SCRATCH/labels.jsonl" > "$SCRATCH/run.txt"; code=$?; cat "$SCRATCH/run.txt"; echo "exit=$code"`
3. `bash: find "$SCRATCH" -type f`
4. `bash: git status --porcelain > "$SCRATCH/status-after.txt"; diff "$SCRATCH/status-before.txt" "$SCRATCH/status-after.txt"`
5. `bash: rm -rf "$SCRATCH"`

### Expected

Step 2 reads the tracked skill docs at the run's commit and prints `census: commit=<40hex> files=<n> sections=<n> flagged=<n> in_band_5_80=<n> refused=<n>` first, then one `census: category=<c> candidates=<n>` line for `synonym-cycling`, `significance-inflation` and `false-ranges` in that order. The three `question <c> sha256=<64hex>: <text>` lines, `margin: 0.10` and `keep rule: coverage 10*M >= 9*K, kill 5*TP < 3*(TP+FP) in every category, precision TP+FP >= 1 and 5*TP >= 4*(TP+FP), margin 10*(A-B) >= M, sign test p < 0.05, keep at two categories passing` follow on every run, and the scratch labels path holds no rows, so the run prints `labels: labeled=0 of 150` and `stop: fewer than 150 labeled rows` and stops the summary there. Step 3 lists only the two scratch files the scenario itself wrote, because the run creates no `report.json`, no `calls.jsonl` and no `labels.jsonl`. Step 4 shows the tree unchanged.

### Evidence

Capture the prompt exactly as typed, the census from step 2, the `find` result, the `git status --porcelain` capture and the exit code, together with the reply text and the diff. No `baseline` line is part of this evidence, because a run with no labels stops at the gate.

### Pass / Fail

- **Pass**: every expected signal appears, the run ends with `exit=0`, the scratch root holds only the scenario's own files and the `git status --porcelain` capture is unchanged.
- **Fail**: the run exits non-zero, the `stop:` line is missing, the lens writes a file, the tree changed or a transcript claims a `baseline` line.

### Failure Triage

1. A missing `stop: fewer than 150 labeled rows` line means the run read a labels file that holds labels. The command points `--labels` at a scratch path that must not exist before step 2.
2. A `labels.jsonl` under the scratch root means a draw ran. The default run only reads a labels file.
3. A `git status --porcelain` diff naming a path no run touched means the tree moved under the scenario, and the capture must be repeated at a quiet moment.
4. A transcript quoting a `baseline` line has invented one, because a run with no labels stops at the gate.

### Optional Supplemental Checks

Run `--draw --seed 7 --labels $SCRATCH/labels.jsonl` and confirm the run prints `draw: seed=7 commit=<40hex> rows=150`, one `draw: category=<c> rows=50 candidate_rows=<n>` line per category and `draw: wrote <path>`, then exits 0. A draw over a labels file that already holds a label exits 2 with `draw refused: <path> holds a label`.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [`manual-testing-playbook.md`](../manual-testing-playbook.md) | Root directory page and scenario summary |
| No feature-catalog entry | This packet ships no `feature-catalog/`, so no catalog cross-reference exists for this scenario |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [`scripts/hvr_reader_lens.py`](../../scripts/hvr_reader_lens.py) | Prints the census, the questions, the keep rule and the label gate lines |
| [`scripts/tests/test_hvr_reader_lens.py`](../../scripts/tests/test_hvr_reader_lens.py) | The frame, census, draw, gate and baseline checks on a fixture repository with a stub scanner |
| [`scripts/hvr_scan.py`](../../scripts/hvr_scan.py) | The unchanged scanner whose findings mark the sections the lens draws |

---

## 5. SOURCE METADATA

- Group: TELL DETECTION
- Playbook ID: HVT-004
- Canonical root source: [`manual-testing-playbook.md`](../manual-testing-playbook.md)
- Feature file path: `tell-detection/reader-needed-lens-measurement.md`
