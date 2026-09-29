---
title: "DRV-069 -- Residue flagger measurement"
description: "Verify that the residue flagger measurement script runs its census and label gate with zero model calls by default and skips a stub backend behind --deem with one skip line."
version: 1.11.0.0
---

# DRV-069 -- Residue flagger measurement

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DRV-069`.

---

## 1. OVERVIEW

This scenario validates residue flagger measurement for `DRV-069`. The objective is to verify that `.skilled/skills/system-deep-loop/deep-review/scripts/score-residue-flagger.cjs` holds its zero-call default, a default run spawning no backend and writing no file, and that a stub backend behind `--deem` is skipped with one skip line.

### WHY THIS MATTERS

Operators need proof that a default measurement pass touches no backend and writes no file, and that an unusable backend stops its arm with a skip line instead of spending calls or leaving a partial report.

---

## 2. SCENARIO CONTRACT

Operators should run this as a real orchestrator-led check rather than a synthetic command-matrix exercise. The scenario is only complete when the operator can explain the behavior back to a user in plain language.

- Objective: Verify that a default run of `score-residue-flagger.cjs` makes zero model calls and writes nothing, and that a stub backend behind `--deem` is skipped with `deem arm skipped: stub backend`.
- Real user request: Run the residue flagger measurement and tell me it made no model calls, then run it against my stub Deem backend and show me the skip.
- Prompt: `Run the residue flagger measurement with the logging stubs first on PATH and report whether the default pass makes zero calls and the stub Deem backend is skipped cleanly.`
- Expected execution process: Run the default pass first and capture its full stdout and exit code, then run the `--deem` pass against the stub and compare the two outputs line by line so the only difference is the skip line.
- Desired user-facing outcome: The user is told that the default pass printed the census and the stop line with zero backend calls and zero writes, and that the stub backend produced one skip line, exit 0, and no report directory.
- Expected signals: The census line prints first, the fixed `margin:`, `keep rule:` and `instruction` lines print before any call, `stop: fewer than 100 labeled rows` prints while fewer than 100 rows carry a label, and the `--deem` pass adds exactly `deem arm skipped: stub backend`.
- Pass/fail posture: PASS if the default pass makes zero calls and writes nothing and the `--deem` pass adds only `deem arm skipped: stub backend`. FAIL if any stub log records a call, any file or directory appears, or the two outputs differ by more than the skip line.

---

## 3. TEST EXECUTION

### RECOMMENDED ORCHESTRATION PROCESS

1. Restate the user request in plain language before inspecting implementation details.
2. Follow the listed command sequence in order with `$STUB_BIN` first on `PATH`, where `$STUB_BIN` holds a logging stub each for `cli-deem` and `jev` and the `cli-deem` stub's `health` reports backend `stub`.
3. Capture evidence that would let another operator reproduce the verdict without re-deriving the scenario.
4. Return a short user-facing explanation, not just raw implementation notes.
### Prompt
Run the residue flagger measurement with the logging stubs first on PATH and report whether the default pass makes zero calls and the stub Deem backend is skipped cleanly.
### Commands
1. `bash: PATH="$STUB_BIN:$PATH" node .skilled/skills/system-deep-loop/deep-review/scripts/score-residue-flagger.cjs > /tmp/residue-default.out 2>&1; echo "exit=$?"`
2. `bash: PATH="$STUB_BIN:$PATH" node .skilled/skills/system-deep-loop/deep-review/scripts/score-residue-flagger.cjs --deem --out /tmp/residue-deem-skip > /tmp/residue-deem.out 2>&1; echo "exit=$?"`
3. `bash: diff /tmp/residue-default.out /tmp/residue-deem.out; git status --porcelain; test -e /tmp/residue-deem-skip && echo "report directory created" || echo "no report directory"`
### Expected
The default pass exits 0 and prints `census: commit=<sha12> files=<n> tables=<n> rows=<n> skipped=<n>` first, then the `severity`, `dimension`, `header` and `resolvable:` lines, `margin: 0.10`, the `keep rule:` line, the two `instruction` lines with their `sha256=` digests, and `stop: fewer than 100 labeled rows` while fewer than 100 rows carry a label, leaving both stub logs unwritten and the worktree unchanged. The `--deem` pass exits 0 and adds one line, `deem arm skipped: stub backend`. The `diff` reports that one added line and the report directory is absent.
### Evidence
Capture the two stdout files, the two exit codes, the `diff` output, both stub logs, and `git status --porcelain` from before and after the runs.
### Pass/Fail
PASS if both runs exit 0, the default pass makes zero calls and writes nothing, and the `--deem` pass adds only `deem arm skipped: stub backend` with no report directory. FAIL if any stub log records a call, any file or directory appears, or the outputs differ by more than the skip line.
### Failure Triage
Start with the `diff` output and the two exit codes, then read the stub logs to see whether either run spawned a call. If the skip line is missing, check the stub `health` output against `readDeemHealth` in the script, and note that a `--jev` run prints `jev: path=<path to jev> provider=official` and `jev arm skipped: no credential` when its own credential check fails.
---

## 4. SOURCE FILES

### PLAYBOOK SOURCES

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page, integrated review protocol, and scenario summary |
| `../../feature-catalog/review-dimensions/residue-flagger-measurement.md` | Feature catalog entry for the measurement surface this scenario covers |

### IMPLEMENTATION AND RUNTIME ANCHORS

| File | Role |
|---|---|
| `.skilled/skills/system-deep-loop/deep-review/scripts/score-residue-flagger.cjs` | Measurement script under test, inspect `USAGE`, `main`, `labelGate`, `deemGate` and `jevGate` |
| `.skilled/skills/system-deep-loop/deep-review/scripts/residue-flagger-labels.jsonl` | Default labels file beside the script, read by the label gate |
| `.skilled/skills/system-deep-loop/deep-review/scripts/tests/score-residue-flagger.test.cjs` | Node test for the script, run with `node --test` |

---

## 5. SOURCE METADATA

- Group: ENTRY POINTS AND MODES
- Playbook ID: DRV-069
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `entry-points-and-modes/residue-flagger-measurement.md`
- Feature catalog status: `feature-catalog/` exists under `.skilled/skills/system-deep-loop/deep-review/` and this scenario cites `review-dimensions/residue-flagger-measurement.md`.
