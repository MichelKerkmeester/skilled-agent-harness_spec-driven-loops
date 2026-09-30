---
title: "DLR-057 -- Stop-hint replay"
description: "Manual validation scenario for Stop-hint replay in the runtime/ skill."
version: 1.7.0.0
---

# DLR-057 -- Stop-hint replay

This document captures the realistic user-testing contract, execution flow, and metadata for `DLR-057`.

---

## 1. OVERVIEW

Adds `scripts/score-stop-hint.cjs`, an offline replay of one stop-rater report that scores its recorded stops as confirm-mode hints and changes no gate and no live loop. A run reads one `report.json`, makes no model call in any mode, and writes nothing unless `--out` asks for a report. `--jev` and `--deem` add the rater's recorded model columns to the two columns every report carries, `legacy` and `sources`.

### Why This Matters

The replay must stay offline in every mode, a refusal must name its reason before any output line, and a report whose gold the rater never confirmed must end at one stop line with no write. Logging stubs first on `PATH` prove no run calls anything, and the two gate shapes prove the stop line is the accepted end state when no confirmed gold exists.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm the stop-hint replay refuses a report it cannot score with exit 2 and a named reason on stderr, stops at the gate stop with one line and no write, skips a model column the rater recorded none of without changing the rest of its output, and makes no model call in any mode.
- Layer partition: scoring runtime.
- Real user request: `Run the stop-hint replay on the fixture reports with logging stubs first on PATH and confirm the refusals name their reason on stderr, the gate stop prints one line and writes nothing, the missing model columns skip by name without changing the rest, no stub is called, and the suite passes.`
- Expected signals: `rater report not found: /tmp/dlr-057/empty/report.json` and `rater report is not JSON: /tmp/dlr-057/broken/report.json` on stderr with empty stdout and exit 2, `stop: rater report has no confirmed gold` as the whole stdout with exit 0 in both gate shapes, the keep rule line first on every run past the gate, `jev column skipped: rater report has none` and `deem column skipped: rater report has none` as the only difference between the default and the `--jev --deem` runs, no stub log file after any run, `git status --porcelain` unchanged, and 28 passing tests.
- Pass/fail: PASS if every run prints its expected lines with the stated exit code and the stub logs stay absent in every run. FAIL if a refusal exits 0 or leaves stdout non-empty, the gate stop writes a file or prints anything besides its one line, a skip run changes anything besides its two skip lines, a stub log appears, the working tree changes, or a test fails.

---

## 3. TEST EXECUTION

### Prerequisites

- Working directory is repository root.
- `runtime/` source tree is present.
- Feature catalog entry exists at `feature-catalog/scoring/stop-hint-replay.md`.
- `node`, `git` and `npx` are available on the PATH.

### Prompt

- Prompt: `Run the stop-hint replay on the fixture reports with logging stubs first on PATH and confirm the refusals name their reason on stderr, the gate stop prints one line and writes nothing, the missing model columns skip by name without changing the rest, no stub is called, and the suite passes.`

### Commands

Run from the repository root.

1. `rm -rf /tmp/dlr-057 && mkdir -p /tmp/dlr-057/bin /tmp/dlr-057/stop /tmp/dlr-057/nogate /tmp/dlr-057/good /tmp/dlr-057/empty /tmp/dlr-057/broken`
2. `printf '#!/bin/sh\necho "$*" >> /tmp/dlr-057/jev.log\nexit 0\n' > /tmp/dlr-057/bin/jev && printf '#!/bin/sh\necho "$*" >> /tmp/dlr-057/cli-deem.log\nexit 0\n' > /tmp/dlr-057/bin/cli-deem && chmod +x /tmp/dlr-057/bin/jev /tmp/dlr-057/bin/cli-deem`
3. `node -e 'const fs=require("fs");const w=(p,o)=>fs.writeFileSync(p,JSON.stringify(o,null,2)+"\n");const mk=(gate)=>({gate,lineages:[{gold:2,lastIteration:5,stops:{legacy:1,sources:2}},{gold:4,lastIteration:6,stops:{legacy:3,sources:3}}]});w("/tmp/dlr-057/stop/report.json",mk({label:{passed:false}}));w("/tmp/dlr-057/nogate/report.json",mk({label:null}));const L=[];for(let i=0;i<20;i+=1)L.push({gold:2,lastIteration:5,stops:{legacy:1+(i%3),sources:2}});w("/tmp/dlr-057/good/report.json",{gate:{label:{passed:true}},lineages:L})' && printf '{' > /tmp/dlr-057/broken/report.json`
4. `git status --porcelain > /tmp/dlr-057/porcelain.before`
5. `PATH=/tmp/dlr-057/bin:$PATH node .skilled/skills/system-deep-loop/runtime/scripts/score-stop-hint.cjs --rater-report /tmp/dlr-057/empty > /tmp/dlr-057/missing.txt 2> /tmp/dlr-057/missing.err; echo "exit=$?"; cat /tmp/dlr-057/missing.err`
6. `PATH=/tmp/dlr-057/bin:$PATH node .skilled/skills/system-deep-loop/runtime/scripts/score-stop-hint.cjs --rater-report /tmp/dlr-057/broken > /tmp/dlr-057/broken.txt 2> /tmp/dlr-057/broken.err; echo "exit=$?"; cat /tmp/dlr-057/broken.err`
7. `PATH=/tmp/dlr-057/bin:$PATH node .skilled/skills/system-deep-loop/runtime/scripts/score-stop-hint.cjs --rater-report /tmp/dlr-057/stop > /tmp/dlr-057/stop.txt 2> /tmp/dlr-057/stop.err; echo "exit=$?"; cat /tmp/dlr-057/stop.txt`
8. `PATH=/tmp/dlr-057/bin:$PATH node .skilled/skills/system-deep-loop/runtime/scripts/score-stop-hint.cjs --rater-report /tmp/dlr-057/nogate > /tmp/dlr-057/nogate.txt 2> /tmp/dlr-057/nogate.err; echo "exit=$?"; diff /tmp/dlr-057/stop.txt /tmp/dlr-057/nogate.txt`
9. `PATH=/tmp/dlr-057/bin:$PATH node .skilled/skills/system-deep-loop/runtime/scripts/score-stop-hint.cjs --rater-report /tmp/dlr-057/good > /tmp/dlr-057/default.txt 2> /tmp/dlr-057/default.err; echo "exit=$?"; head -n 1 /tmp/dlr-057/default.txt`
10. `PATH=/tmp/dlr-057/bin:$PATH node .skilled/skills/system-deep-loop/runtime/scripts/score-stop-hint.cjs --rater-report /tmp/dlr-057/good --jev --deem > /tmp/dlr-057/skip.txt 2> /tmp/dlr-057/skip.err; echo "exit=$?"; diff /tmp/dlr-057/default.txt /tmp/dlr-057/skip.txt`
11. `grep -v -e '^jev column skipped: rater report has none$' -e '^deem column skipped: rater report has none$' /tmp/dlr-057/skip.txt > /tmp/dlr-057/stripped.txt; diff /tmp/dlr-057/default.txt /tmp/dlr-057/stripped.txt`
12. `PATH=/tmp/dlr-057/bin:$PATH node .skilled/skills/system-deep-loop/runtime/scripts/score-stop-hint.cjs --rater-report /tmp/dlr-057/good --jev --deem --out /tmp/dlr-057/out-good > /tmp/dlr-057/out.txt 2> /tmp/dlr-057/out.err; echo "exit=$?"; node -e 'const fs=require("fs"),c=require("crypto");const r=JSON.parse(fs.readFileSync("/tmp/dlr-057/out-good/report.json","utf8"));const d=c.createHash("sha256").update(fs.readFileSync("/tmp/dlr-057/good/report.json")).digest("hex");console.log("path",r.rater.path);console.log("sha match",r.rater.sha256===d,r.rater.sha256.length);console.log("gate",r.gate.passed);console.log("skipped",Object.keys(r.skipped).sort().join(" "))'`
13. `PATH=/tmp/dlr-057/bin:$PATH node .skilled/skills/system-deep-loop/runtime/scripts/score-stop-hint.cjs --rater-report /tmp/dlr-057/stop --jev --deem --out /tmp/dlr-057/out-stop > /tmp/dlr-057/out-stop.txt 2> /tmp/dlr-057/out-stop.err; echo "exit=$?"; cat /tmp/dlr-057/out-stop.txt; ls -d /tmp/dlr-057/out-stop`
14. `ls /tmp/dlr-057/jev.log /tmp/dlr-057/cli-deem.log`
15. `git status --porcelain > /tmp/dlr-057/porcelain.after; diff /tmp/dlr-057/porcelain.before /tmp/dlr-057/porcelain.after`
16. `cd .skilled/skills/system-deep-loop/runtime && npx vitest run tests/unit/score-stop-hint.vitest.ts`
17. Record PASS or FAIL with rationale. Record SKIP only when a named sandbox blocker (an unavailable native module, a missing runtime dependency, or an unavailable external CLI credential) prevents a command from running.

### Expected Outcome

The stop-hint replay matches the documented current reality, every expected line prints with its stated exit code, and validation evidence is reproducible.

- Step 5 prints `exit=2` with empty stdout and this stderr: `rater report not found: /tmp/dlr-057/empty/report.json`.
- Step 6 prints `exit=2` with empty stdout and this stderr: `rater report is not JSON: /tmp/dlr-057/broken/report.json`.
- Step 7 prints `exit=0` and this stdout, the whole of it: `stop: rater report has no confirmed gold`.
- Step 8 prints `exit=0` and its diff prints nothing, because an unarmed report stops the same way.
- Step 9 prints `exit=0` and this first line:

```
keep rule: coverage 10*M >= 9*K, kill p_loss < 0.05, precision 10*W >= 9*(W+L), savings 5*W >= M, sign test p_win < 0.05, flips 10*F <= C (jev only)
```

- Step 10 prints `exit=0` and its diff shows exactly two added lines, `jev column skipped: rater report has none` and `deem column skipped: rater report has none`.
- Step 11 prints nothing, because removing the two skip lines leaves the run byte-identical to the one in step 9.
- Step 12 prints `exit=0` and its report check prints:

```
path /tmp/dlr-057/good/report.json
sha match true 64
gate true
skipped deem jev
```

- Step 13 prints `exit=0` and this stdout, the whole of it: `stop: rater report has no confirmed gold`, and `ls -d /tmp/dlr-057/out-stop` reports that the directory does not exist.
- Step 14 reports that `/tmp/dlr-057/jev.log` and `/tmp/dlr-057/cli-deem.log` do not exist, because no run called a stub.
- Step 15 prints nothing from the diff, because the working tree is unchanged.
- Step 16 prints `exit=0` with 28 passing tests and 0 failing.

### Evidence

- Captured stdout, stderr and exit status for every command run in this section, including the four diff outputs.
- The files under `/tmp/dlr-057`: `missing.err`, `broken.err`, `stop.txt`, `nogate.txt`, `default.txt`, `skip.txt`, `stripped.txt`, `out.txt`, `out-stop.txt`, `porcelain.before`, `porcelain.after`, `report.json` under `out-good`, and the absent `jev.log` and `cli-deem.log`.
- Output from `tests/unit/score-stop-hint.vitest.ts` naming the assertions that carry the expected signals.
- A triage note for any non-PASS outcome that names which expected signal was absent or contradicted.

### Failure Triage

- A stub log appears in a run that should call nothing. Find which code path spawns a process: the replay is stdlib-only and calls nothing in any mode.
- A refusal exits 0 or prints nothing on stderr. Check `main` and `readRaterReport` in `scripts/score-stop-hint.cjs`.
- The gate stop prints anything besides its one line, or an `--out` run writes a report for a stopped report. Check the gate stop's early return and the report write in `main`.
- A skip run changes anything besides its two skip lines. Check `selectColumns` and the print order in `main`.
- The report check or the test count differs from the expected lines. The fixture shape, the script or the test file changed since this scenario was recorded.
- Evidence is inferred from memory instead of captured from current source or command output.

---

## 4. SOURCE FILES

### Implementation

| File | Role |
|---|---|
| `scripts/score-stop-hint.cjs` | Offline stop-hint replay: the report reader, the gate stop, the columns and the optional report write. |

### Validation

| File | Role |
|---|---|
| `tests/unit/score-stop-hint.vitest.ts` | Primary regression coverage for Stop-hint replay. |

---

## 5. SOURCE METADATA

- Group: Scoring
- Playbook ID: DLR-057
- Feature catalog entry: `feature-catalog/scoring/stop-hint-replay.md`
- Scenario file path: `manual-testing-playbook/scoring/stop-hint-replay.md`
- Canonical root source: `manual-testing-playbook/manual-testing-playbook.md`
