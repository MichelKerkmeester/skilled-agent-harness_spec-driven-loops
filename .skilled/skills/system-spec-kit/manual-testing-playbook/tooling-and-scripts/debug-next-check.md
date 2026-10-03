---
title: "463 -- Debug next check"
description: "This scenario validates the debug next check for `463`. It focuses on a default run with a stub first on the path that starts no backend, the label-gate stop over 29 rows that prints no row text, the keep-rule run over 30 rows, and the suite that proves zero model calls."
version: 2.6.0.0
---

# 463 -- Debug next check

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `463`.

---

## 1. OVERVIEW

This scenario validates the debug next check for `463`. It focuses on a default run with a stub first on the path that starts no backend, the label-gate stop over 29 rows that prints no row text, the keep-rule run over 30 rows, and the suite that proves zero model calls.

The measurement was retired on 2026-10-03 at `verdict jev: stop (margin) K=36 M=36 A=26 B=29` (`~/.skilled/.labels/runs/050-031-jev-20261003`): Jev was right on fewer labeled rows than the constant `read_code` answer. This scenario still checks the zero-call census, because the script stays in place as the record of that measurement.

### Why This Matters

The scorer measures whether a model's choice of the cheapest next check beats the best constant answer on operator-labeled rows, and it calls no model on its default run, so the census shape has to be provable without any credential. A run over generated fixture rows shows the census and the label gate without opening a real backend, and a stub `jev` binary first on the path shows that nothing starts.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `463` and confirm the expected signals without contradictory evidence.

- Objective: confirm that a default run with a stub first on the path prints the census lines, starts no stub and exits 0, that the 29-row run prints its census, fixture and baseline lines and a last line `stop: fewer than 30 labeled rows` and starts no stub, that the 30-row run adds the `keep rule:` line without a backend, that the stub logs stay empty, that the two working-tree status captures match, and that the suite reports 28 passed
- Real user request: `Does a model pick a better next check than the best constant answer, and can I find out without calling a model?`
- Prompt: `Run the debug next check census with a stub first on the path, run it on a 29-row fixture and on a 30-row fixture, confirm nothing was called or changed, then run its test suite.`
- Expected execution process: the working-tree status is captured, a stub `jev` executable that logs every call is placed first on `PATH`, a 29-row and a 30-row fixture are generated under `/tmp` with labels cycling the four constants and every `jev_ok` false, the scorer runs with no switch, the stub logs are read, the scorer runs over the 29-row fixture and over the 30-row fixture with `--out` and no arm switch, the stub logs are read again, the status is captured again and compared and the vitest suite runs.
- Expected signals: step 4 prints `seam: none` (or one `seam: <path>` line per tracked hit), then `mined: debug_delegation=1 hypothesis_files=0` and `mined rows: 0`, and exits 0. Step 5 prints nothing. Step 6 prints the same census lines, then `fixture: rows=29 sha256=<hex>`, `labels: read_code=8 run_test=7 reproduce=7 instrument=7`, `constant read_code: 8/29`, `constant run_test: 7/29`, `constant reproduce: 7/29`, `constant instrument: 7/29`, `baseline: read_code 8/29` and a last line `stop: fewer than 30 labeled rows`, with no fixture row text on stdout and exit 0. Step 7 prints the same census lines, `fixture: rows=30 sha256=<hex>`, `labels: read_code=8 run_test=8 reproduce=7 instrument=7`, `constant read_code: 8/30`, `constant run_test: 8/30`, `constant reproduce: 7/30`, `constant instrument: 7/30`, `baseline: read_code 8/30` and one line starting `keep rule:`, and exits 0. Step 8 prints nothing. Step 9 prints nothing. Step 10 reports 28 passed and exits 0.
- Desired user-visible outcome: the census counts, the label-gate stop line, the keep-rule line and a statement that nothing was called or changed, with the evidence.
- Pass/fail: PASS if every signal holds. FAIL if a line is missing, step 5 prints a log line, step 6 prints anything beyond its last line, step 8 prints anything, step 9 shows a change or a test fails.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Run the debug next check census with a stub first on the path, run it on a 29-row fixture and on a 30-row fixture, confirm nothing was called or changed, then run its test suite.`

### Commands

1. `git status --porcelain > /tmp/dnc-463-before.txt`
2. `mkdir -p /tmp/dnc-463-stub && printf '#!/bin/sh\nname=${0##*/}\necho $name $* >> /tmp/dnc-463-stub/$name.log\nexit 2\n' | tee /tmp/dnc-463-stub/jev > /dev/null && chmod +x /tmp/dnc-463-stub/jev`
3. `for n in 29 30; do i=1; : > /tmp/dnc-463-$n.jsonl; while [ $i -le $n ]; do case $((i % 4)) in 1) l=read_code;; 2) l=run_test;; 3) l=reproduce;; 0) l=instrument;; esac; printf '{"id":"row-%d","symptom":"synthetic symptom","claim":"synthetic claim","evidence":"synthetic evidence","label":"%s","jev_ok":false}\n' "$i" "$l" >> /tmp/dnc-463-$n.jsonl; i=$((i+1)); done; done`
4. `PATH=/tmp/dnc-463-stub:$PATH node .skilled/skills/system-spec-kit/runtime/scripts/debug-next-check/score-debug-next-check.mjs`
5. `find /tmp/dnc-463-stub -name '*.log' -print`
6. `PATH=/tmp/dnc-463-stub:$PATH node .skilled/skills/system-spec-kit/runtime/scripts/debug-next-check/score-debug-next-check.mjs --fixture /tmp/dnc-463-29.jsonl --out /tmp/dnc-463-stop-out`
7. `PATH=/tmp/dnc-463-stub:$PATH node .skilled/skills/system-spec-kit/runtime/scripts/debug-next-check/score-debug-next-check.mjs --fixture /tmp/dnc-463-30.jsonl --out /tmp/dnc-463-keep-out`
8. `find /tmp/dnc-463-stub -name '*.log' -exec cat {} \;`
9. `git status --porcelain | diff /tmp/dnc-463-before.txt -`
10. `cd .skilled/skills/system-spec-kit/runtime && npx vitest run tests/debug-next-check.vitest.ts`

### Expected

Step 4 prints the census lines the scenario contract names and exits 0. Step 5 prints nothing. Step 6 prints the census, fixture, label, constant and baseline lines the scenario contract names, then `stop: fewer than 30 labeled rows`, and exits 0. Step 7 prints those lines for 30 rows, then one line starting `keep rule:`, and exits 0. Step 8 prints nothing. Step 9 prints nothing. Step 10 reports 28 passed and exits 0.

### Evidence

Capture step 4's stdout and exit status, step 5's empty output, step 6's last line and exit status, step 7's keep-rule line and exit status, step 8's empty output, step 9's empty diff and the suite's summary line with its exit status.

### Pass / Fail

- **Pass**: every named line is present, step 5 prints nothing, step 6 adds nothing beyond its last line, step 8 prints nothing, step 9 prints nothing and the suite passes.
- **Fail**: a named line is missing, step 5 prints a log line, step 6 prints anything beyond its last line, step 8 prints anything, step 9 shows a change or a test fails.

### Failure Triage

1. When step 4, 6 or 7 exits 2, the run refused its command line or its fixture: `--jev` without `--out` prints `--jev needs --out <dir> so every call is recorded`, a fixture path inside the repository prints `refused: fixture path inside the repository`, and a bad row prints its line number, row id and fault, so keep every generated file under `/tmp` and rerun step 3.
2. When a `seam: <path>` line prints in place of `seam: none`, or a `mined:` count differs, a tracked file changed the census: the seam search reads tracked files outside `specs/` and `runtime/cli/retrieval/fixtures/`, and leaves out every path whose name holds `debug-next-check`, since the scorer's own script, test and docs carry the search key (`SEAM_PATTERN` in its constants). Read the printed paths and counts as the current census before failing the step.
3. When step 8 prints anything, a run reached a backend: no arm switch is set, so the `jev` stub must log nothing.
4. When step 9 shows a change, name the path: the fixtures and both `--out` folders sit under `/tmp`, and the script writes only `report.json` and `calls.jsonl` under `--out`.
5. When step 10 exceeds a short command timeout, that is the suite's cost: each test spawns the script and each run searches the real repository, so the file takes about 171 s.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |
| `../../feature-catalog/tooling-and-scripts/debug-next-check.md` | Feature-catalog source describing the implementation contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.skilled/skills/system-spec-kit/runtime/scripts/debug-next-check/score-debug-next-check.mjs` | Prints the census lines, the label-gate stop line and the arm lines, and writes the report |
| `.skilled/skills/system-spec-kit/runtime/tests/debug-next-check.vitest.ts` | Twenty-eight cases over the census, the fixture reader and the arm, with a stub `jev` binary first on the path |

Provenance: runtime/tests/debug-next-check.vitest.ts

---

## 5. SOURCE METADATA

- Group: Tooling And Scripts
- Playbook ID: 463
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `tooling-and-scripts/debug-next-check.md`
