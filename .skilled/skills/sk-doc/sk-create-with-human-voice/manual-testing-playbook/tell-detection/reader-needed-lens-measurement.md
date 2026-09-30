---
title: "HVT-004 -- The reader-needed lens measurement"
description: "This scenario validates the reader-needed lens measurement for `HVT-004`. It confirms the zero-call run prints the census and the stop line and calls no backend, and a stub-backend run prints its skip line and nothing else."
stage: routing
version: 1.2.0.0
---

# HVT-004 -- The reader-needed lens measurement

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `HVT-004`.

---

## 1. OVERVIEW

This scenario validates the reader-needed lens measurement for `HVT-004`. It confirms the zero-call run prints the census and the stop line and calls no backend, and a stub-backend run prints its skip line and nothing else.

### Why This Matters

`scripts/hvr_reader_lens.py` measures offline whether a Jev or Deem `noul` flags the three reader-needed Human Voice Rules tells better than the scanner's floor, which flags none of them: synonym cycling, significance inflation and false ranges. The default run makes no model call, writes no file and holds no credential.

Everything a run can print before the operator's labels exist is the census and the stop line, and a transcript that reads those as a measurement is reading the sample frame as a result. The quiet parts carry the same weight as the printed ones: both stub logs stay empty, `git status --porcelain` is unchanged and no run has printed a `verdict` line.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `HVT-004` and confirm the expected signals without contradictory evidence.

- Objective: confirm the zero-call run prints the census and the label-gate stop while both stub logs stay empty and the tree is unchanged, and a stub-backend run prints its skip line and nothing else and writes no file
- Real user request: `Before I label anything, what has the reader-needed lens measured so far, and did anything leave the machine?`
- Prompt: `Run the reader-needed lens with the two stubs first on PATH, once with no switch and once with --deem, and tell me what it printed and whether anything left the machine.`
- Expected execution process: the orchestrator writes two logging stub binaries first on PATH, runs the lens with `--labels` at a scratch path that holds no rows and reads both stub logs, then runs it again with `--deem --out` and reads `git status --porcelain` before and after
- Expected signals: step 4 prints the census lines, the three `question` lines, `margin: 0.10`, the `keep rule:` line, `labels: labeled=0 of 150` and `stop: fewer than 150 labeled rows`, then `exit=0`. Step 5 reports zero lines for both stub logs. Step 6 prints the same lines plus `deem arm skipped: stub backend` and `exit=0`. Step 7 finds one `health` line in the Deem stub log, no line in the Jev stub log and no file under `out`. Step 8 prints nothing. Step 9 shows one added line and nothing else
- Desired user-visible outcome: the author sees the census and the stop line as the whole result before the labels exist, and sees the lens call no backend by default and refuse a stub backend at the health check without measuring anything
- Pass/fail: PASS if every expected signal appears and both runs end with `exit=0`. FAIL if a run exits non-zero, the `stop:` line is missing, a stub log holds a call the run should not have made, a file appears under `out` or the tree changed

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Run the reader-needed lens with the two stubs first on PATH, once with no switch and once with --deem, and tell me what it printed and whether anything left the machine.`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| HVT-004 | The reader-needed lens measurement | Print the census and the label-gate stop with zero calls, then skip a stub backend | `Run the reader-needed lens with the two stubs first on PATH, once with no switch and once with --deem, and tell me what it printed and whether anything left the machine.` | 1. `bash: SCRATCH=$(mktemp -d /tmp/hvr-reader-lens.XXXXXX); mkdir -p "$SCRATCH/bin" "$SCRATCH/out"; git status --porcelain > "$SCRATCH/status-before.txt"` -> 2. `agent: write the two stub binaries below to $SCRATCH/bin/cli-deem and $SCRATCH/bin/jev exactly as given` -> 3. `bash: chmod +x "$SCRATCH/bin/cli-deem" "$SCRATCH/bin/jev"; : > "$SCRATCH/bin/cli-deem.log"; : > "$SCRATCH/bin/jev.log"` -> 4. `bash: PATH="$SCRATCH/bin:$PATH" python3 .skilled/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_reader_lens.py --labels "$SCRATCH/labels.jsonl" > "$SCRATCH/default.txt"; code=$?; cat "$SCRATCH/default.txt"; echo "exit=$code"` -> 5. `bash: wc -l "$SCRATCH/bin/cli-deem.log" "$SCRATCH/bin/jev.log"` -> 6. `bash: PATH="$SCRATCH/bin:$PATH" python3 .skilled/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_reader_lens.py --deem --out "$SCRATCH/out" --labels "$SCRATCH/labels.jsonl" > "$SCRATCH/deem.txt"; code=$?; cat "$SCRATCH/deem.txt"; echo "exit=$code"` -> 7. `bash: cat "$SCRATCH/bin/cli-deem.log" "$SCRATCH/bin/jev.log"; find "$SCRATCH/out" -type f` -> 8. `bash: git status --porcelain > "$SCRATCH/status-after.txt"; diff "$SCRATCH/status-before.txt" "$SCRATCH/status-after.txt"` -> 9. `bash: diff "$SCRATCH/default.txt" "$SCRATCH/deem.txt"` -> 10. `bash: rm -rf "$SCRATCH"` | Step 4 prints `census: commit=<40hex> files=<n> sections=<n> flagged=<n> in_band_5_80=<n> refused=<n>`, one `census: category=<c> candidates=<n>` line per category, the three `question` lines, `margin: 0.10`, the `keep rule:` line, `labels: labeled=0 of 150` and `stop: fewer than 150 labeled rows`, then `exit=0`. Step 5 reports `0` and `0`. Step 6 prints the same lines plus `deem arm skipped: stub backend` and `exit=0`. Step 7 finds one `health` line in `cli-deem.log`, nothing in `jev.log` and no file under `out`. Step 8 prints nothing. Step 9 shows one added line | The prompt, the reply text and the full output of steps 4 to 9 with each exit line, both stub logs, the `find` result and the `git status --porcelain` capture | PASS if every signal appears and both runs end with `exit=0`. FAIL if a run exits non-zero, the `stop:` line is missing, a stub log holds a call beyond the one `health` line, a file appears under `out` or the tree changed | 1. A missing `stop: fewer than 150 labeled rows` line means the run read a labels file that holds labels, since the commands point `--labels` at a scratch path that must not exist. 2. A stub log line after step 4 means the default run spawned a backend, since only `--jev` and `--deem` may spawn anything. 3. A diff beyond the added skip line is either a changed `commit=` value, meaning the repository moved between the two runs, or a health reply the stub does not print. 4. A transcript quoting a `verdict` line has invented one, because no run has printed one |

### Commands

1. `bash: SCRATCH=$(mktemp -d /tmp/hvr-reader-lens.XXXXXX); mkdir -p "$SCRATCH/bin" "$SCRATCH/out"; git status --porcelain > "$SCRATCH/status-before.txt"`
2. `agent: write the two stub binaries below to $SCRATCH/bin/cli-deem and $SCRATCH/bin/jev exactly as given`
3. `bash: chmod +x "$SCRATCH/bin/cli-deem" "$SCRATCH/bin/jev"; : > "$SCRATCH/bin/cli-deem.log"; : > "$SCRATCH/bin/jev.log"`
4. `bash: PATH="$SCRATCH/bin:$PATH" python3 .skilled/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_reader_lens.py --labels "$SCRATCH/labels.jsonl" > "$SCRATCH/default.txt"; code=$?; cat "$SCRATCH/default.txt"; echo "exit=$code"`
5. `bash: wc -l "$SCRATCH/bin/cli-deem.log" "$SCRATCH/bin/jev.log"`
6. `bash: PATH="$SCRATCH/bin:$PATH" python3 .skilled/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_reader_lens.py --deem --out "$SCRATCH/out" --labels "$SCRATCH/labels.jsonl" > "$SCRATCH/deem.txt"; code=$?; cat "$SCRATCH/deem.txt"; echo "exit=$code"`
7. `bash: cat "$SCRATCH/bin/cli-deem.log" "$SCRATCH/bin/jev.log"; find "$SCRATCH/out" -type f`
8. `bash: git status --porcelain > "$SCRATCH/status-after.txt"; diff "$SCRATCH/status-before.txt" "$SCRATCH/status-after.txt"`
9. `bash: diff "$SCRATCH/default.txt" "$SCRATCH/deem.txt"`
10. `bash: rm -rf "$SCRATCH"`

### Stub binaries

Step 2 writes these two files, with these exact bytes.

`$SCRATCH/bin/cli-deem`:

```sh
#!/bin/sh
echo "$@" >> "$(dirname "$0")/cli-deem.log"
if [ "$1" = "health" ]; then
  echo stub >&2
  exit 3
fi
exit 3
```

`$SCRATCH/bin/jev`:

```sh
#!/bin/sh
echo "$@" >> "$(dirname "$0")/jev.log"
if [ "$1" = "--version" ]; then
  echo 'jev 0.6.2'
  exit 0
fi
exit 3
```

> **Note on the stubs**: the stub `cli-deem` here is a `PATH` stub that refuses at the Deem gate, not a mocked model, and the stub `jev` answers only `--version`. No model is imitated and no model answer is faked. The stubs exist so the run can show that nothing is called and that a stub backend is refused at the health check.

### Expected

Step 4 reads the tracked skill docs at the run's commit and prints `census: commit=<40hex> files=<n> sections=<n> flagged=<n> in_band_5_80=<n> refused=<n>` first, then one `census: category=<c> candidates=<n>` line for `synonym-cycling`, `significance-inflation` and `false-ranges` in that order. The three `question <c> sha256=<64hex>: <text>` lines, `margin: 0.10` and `keep rule: coverage 10*M >= 9*K, kill 5*TP < 3*(TP+FP) in every category, precision TP+FP >= 1 and 5*TP >= 4*(TP+FP), margin 10*(A-B) >= M, sign test p < 0.05, flips 10*F <= 3*M (jev only), keep at two categories passing` follow on every run, and the scratch labels path holds no rows, so the run prints `labels: labeled=0 of 150` and `stop: fewer than 150 labeled rows` and stops the summary there. Step 5 finds both stub logs empty, because the default run spawns nothing. Step 6 prints the same lines and adds `deem arm skipped: stub backend`, because the gate runs `cli-deem health` once and reads `stub` on its stderr as a stub backend. Step 7 finds that one `health` line and no file under `out`, because a skipped arm writes no `report.json` and records no call. Step 8 shows the tree unchanged and step 9 shows the one added line and nothing else, because both runs read the same tree.

### Evidence

Capture the prompt exactly as typed, the census from step 4, both stub logs, the `git status --porcelain` capture and the exit codes of both runs, together with the reply text and the two diffs. No `verdict` line is part of this evidence, because no run has printed one.

### Pass / Fail

- **Pass**: every expected signal appears, both runs end with `exit=0`, both stub logs hold only the calls steps 5 and 7 show and the `git status --porcelain` capture is unchanged.
- **Fail**: a run exits non-zero, the `stop:` line is missing, a stub log holds a call the run should not have made, a file appears under `out`, the tree changed or a transcript claims a `verdict` line.

### Failure Triage

1. A missing `stop: fewer than 150 labeled rows` line means the run read a labels file that holds labels. The commands point `--labels` at a scratch path that must not exist before step 4.
2. Any line in a stub log after step 4 means the default run spawned a backend. Only `--jev` and `--deem` may spawn anything.
3. A diff that shows more than the added `deem arm skipped: stub backend` line is either a `commit=` value that changed, meaning the repository moved between the two runs and both must be re-run at the same `HEAD`, or a health reply the stub does not print. A `git status --porcelain` diff naming a path no run touched is the tree moving under the scenario, and the capture must be repeated at a quiet moment.
4. A transcript quoting a `verdict` line has invented one. No run of this script has printed a verdict, so a scenario that records one has graded a measurement that does not exist.

### Optional Supplemental Checks

Repeat step 6 with `--jev --out "$SCRATCH/out-jev"` in place of `--deem --out "$SCRATCH/out"` and confirm the run adds `jev: path=<path> provider=official` and `jev arm skipped: no credential`, because the stub answers `--version` with `jev 0.6.2` and exits 3 on `auth status --provider official`, and that the Jev stub log holds exactly those two calls and no file is written. A bad invocation is refused before any call: `--jev` or `--deem` without `--out` exits 2 and prints `--jev and --deem need --out <dir> so every call is recorded`.

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
| [`scripts/hvr_reader_lens.py`](../../scripts/hvr_reader_lens.py) | Prints the census, the questions, the label gate and the backend skip lines |
| [`scripts/tests/test_hvr_reader_lens.py`](../../scripts/tests/test_hvr_reader_lens.py) | The frame, census, draw, gate and arm checks on a fixture repository with stub backends |
| [`scripts/hvr_scan.py`](../../scripts/hvr_scan.py) | The unchanged scanner whose findings mark the sections the lens draws |

---

## 5. SOURCE METADATA

- Group: TELL DETECTION
- Playbook ID: HVT-004
- Canonical root source: [`manual-testing-playbook.md`](../manual-testing-playbook.md)
- Feature file path: `tell-detection/reader-needed-lens-measurement.md`