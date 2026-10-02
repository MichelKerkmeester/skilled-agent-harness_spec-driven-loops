---
title: "DLR-058 -- Severity replay"
description: "Manual validation scenario for Severity replay in the runtime/ skill."
version: 1.8.0.0
---

# DLR-058 -- Severity replay

This document captures the realistic user-testing contract, execution flow, and metadata for `DLR-058`.

---

## 1. OVERVIEW

Adds `scripts/score-severity-replay.cjs`, an offline severity replay over the tracked deep-review findings registries. It measures whether a Jev severity choice would separate real P0 findings from false ones better than the recorded severity, and it changes no severity, no registry and no review gate. A default run makes no model call and writes no file. `--write-label-sheet <path>` writes one JSON line per P0 finding with an empty `label` for the operator to fill with `real`, `P1`, `P2` or `not_a_finding`, and `--labels <file>` reads the filled sheet back. Below 20 labeled P0 negatives the label gate stops the run before any backend is reached, and past the gate the requested arm meets its backend gate by name.

### Why This Matters

The replay must stay offline on every run, the label gate must stop a run before any backend is spawned, and a backend gate must skip by name without changing the census or the keep rule lines. Logging stubs first on `PATH` prove the census run and the label-gate stop call nothing.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm the severity replay prints the census with no model call, writes the label sheet outside the repository, stops at the label gate below 20 labeled P0 negatives with one stop line and its arm skip line, and passes the suite.
- Layer partition: scoring runtime.
- Real user request: `Run the severity replay with logging stubs first on PATH and confirm the census prints with no model call, the label sheet lands outside the repository, the label gate stops below 20 labeled P0 negatives and skips its arm, no stub is called, and the suite passes.`
- Expected signals: the census block on every run, `label sheet: /tmp/dlr-058/labels.jsonl rows=<n>` outside the repository, `stop: fewer than 20 labeled P0 negatives` with `jev arm skipped: label gate` and exit 0 on the label-gate stop, no stub log after any run, `report.json` as the only file in the `--out` directory, an unchanged `git status --porcelain`, and 28 passing tests.
- Pass/fail: PASS if every run prints its expected lines with the stated exit code and no stub log holds a choice call. FAIL if a census line is missing, the label-gate stop spawns a stub or prints an arm line beside its skip line, a stub log holds a call, an `--out` directory holds a `calls.jsonl`, the working tree changes, or a test fails.

---

## 3. TEST EXECUTION

### Prerequisites

- Working directory is repository root.
- `runtime/` source tree is present.
- Feature catalog entry exists at `feature-catalog/scoring/severity-replay.md`.
- `node`, `git` and `npx` are available on the PATH.

### Prompt

- Prompt: `Run the severity replay with logging stubs first on PATH and confirm the census prints with no model call, the label sheet lands outside the repository, the label gate stops below 20 labeled P0 negatives and skips its arm, no stub is called, and the suite passes.`

### Commands

Run from the repository root.

1. `rm -rf /tmp/dlr-058 && mkdir -p /tmp/dlr-058/bin /tmp/dlr-058/out-stop`
2. `printf '#!/bin/sh\necho "$*" >> /tmp/dlr-058/jev.log\nexit 0\n' > /tmp/dlr-058/bin/jev && chmod +x /tmp/dlr-058/bin/jev`
3. `git status --porcelain > /tmp/dlr-058/porcelain.before`
4. `PATH=/tmp/dlr-058/bin:$PATH node .skilled/skills/system-deep-loop/runtime/scripts/score-severity-replay.cjs > /tmp/dlr-058/census.txt 2> /tmp/dlr-058/census.err; echo "exit=$?"; cat /tmp/dlr-058/census.txt`
5. `PATH=/tmp/dlr-058/bin:$PATH node .skilled/skills/system-deep-loop/runtime/scripts/score-severity-replay.cjs --write-label-sheet /tmp/dlr-058/labels.jsonl > /tmp/dlr-058/sheet.txt 2> /tmp/dlr-058/sheet.err; echo "exit=$?"; grep '^label sheet:' /tmp/dlr-058/sheet.txt`
6. `node -e 'const fs=require("fs");const rows=fs.readFileSync("/tmp/dlr-058/labels.jsonl","utf8").trim().split("\n").slice(0,20).map(line=>JSON.parse(line));for(const r of rows)r.label="P1";fs.writeFileSync("/tmp/dlr-058/labels-20.jsonl",rows.map(r=>JSON.stringify(r)).join("\n")+"\n")' && wc -l < /tmp/dlr-058/labels-20.jsonl`
7. `PATH=/tmp/dlr-058/bin:$PATH node .skilled/skills/system-deep-loop/runtime/scripts/score-severity-replay.cjs --jev --out /tmp/dlr-058/out-stop > /tmp/dlr-058/stop.txt 2> /tmp/dlr-058/stop.err; echo "exit=$?"; tail -n 2 /tmp/dlr-058/stop.txt`
8. `ls /tmp/dlr-058/out-stop; ls /tmp/dlr-058/jev.log`
9. `git status --porcelain > /tmp/dlr-058/porcelain.after; diff /tmp/dlr-058/porcelain.before /tmp/dlr-058/porcelain.after`
10. `cd .skilled/skills/system-deep-loop/runtime && npx vitest run tests/unit/score-severity-replay.vitest.ts`
11. Record PASS or FAIL with rationale. Record SKIP only when a named sandbox blocker (an unavailable native module, a missing runtime dependency, or an unavailable external CLI credential) prevents a command from running.

### Expected Outcome

The severity replay matches the documented current reality, every expected line prints with its stated exit code, and validation evidence is reproducible.

- Step 4 prints `exit=0` and this stdout, the whole of it, as recorded on 2026-09-29:

```
registries: 413
findings: 2771 (P0 96, P1 1298, P2 1377, other 0)
transitions: P1 -> P0 2
transitions: P1 -> P1 19
transitions: P1 -> P2 6
transitions: P1 -> resolved 11
transitions: P2 -> P1 2
transitions: P2 -> P2 6
transitions: P2 -> resolved 5
transitions: none -> P0 45
transitions: none -> P1 879
transitions: none -> P2 938
p0 rows: 95 in 37 registries (one 21, two or more 16)
phrases: 3270 review iteration files; "downgraded from P0" 0; "from P0 to P1" 1; "from P0 to P2" 1; "retracted from P0" 1; "P0 was retracted" 1
labels needed: 20 P0 negatives among 95 P0 rows
labels: none
labeled: 0 (real 0, P1 0, P2 0, not_a_finding 0)
labels dropped: 0
baseline: right 0 of 0
question: Which severity does this review finding deserve?
margin: 0.10
keep rule: coverage 10*M >= 9*K, kill p_loss < 0.05, margin 10*(A-B) >= M, sign test p_win < 0.05, flips 10*F <= C
power: a keep needs at least 5 wins with no loss, since 0.5^5 is 0.031
stop: fewer than 20 labeled P0 negatives
```

- The counts read the live tree at run time, so a later run may print different numbers in the same lines. One of the 95 P0 rows comes from a test fixture registry under `deep-review/scripts/tests/fixtures/`.
- Step 5 prints `exit=0` and this line: `label sheet: /tmp/dlr-058/labels.jsonl rows=<n>`, with `<n>` the `p0 rows:` count of the census (95 in the recorded run). The sheet holds one JSON line per P0 row with `registry`, `finding_id`, `title`, `dimension`, `evidence_refs` and an empty `label`.
- Step 6 prints `20`.
- Step 7 prints `exit=0` and these two lines, the end of its stdout:

```
stop: fewer than 20 labeled P0 negatives
jev arm skipped: label gate
```

- Step 8 prints `report.json` for the out directory and reports that `/tmp/dlr-058/jev.log` does not exist, because no run has called a stub.
- Step 9 prints nothing from the diff, because the working tree is unchanged.
- Step 10 exits 0 with 28 passing tests and 0 failing.

### Evidence

- Captured stdout, stderr and exit status for every command run in this section, including the diff output.
- The files under `/tmp/dlr-058`: `census.txt`, `census.err`, `sheet.txt`, `sheet.err`, `labels.jsonl`, `labels-20.jsonl`, `stop.txt`, `stop.err`, `porcelain.before`, `porcelain.after`, `report.json` under `out-stop`, and the absent `jev.log`.
- Output from `tests/unit/score-severity-replay.vitest.ts` naming the assertions that carry the expected signals.
- A triage note for any non-PASS outcome that names which expected signal was absent or contradicted.

### Failure Triage

- A stub log appears in a run that should call nothing. Find which code path spawns a process: the census run and the label-gate stop reach no backend gate.
- The label-gate stop prints anything beside its stop line and its arm skip line, or its `--out` directory holds a `calls.jsonl`. Check the gate ordering and the call log in `main`.
- The census block or the keep rule lines differ between two runs of one tree. Check `censusLines` and the print order in `main`.
- The census counts, the sheet row count or the test count differ from the recorded values. The counts read the live tree at run time, so the tree or the script changed since this scenario was recorded.
- Evidence is inferred from memory instead of captured from current source or command output.

---

## 4. SOURCE FILES

### Implementation

| File | Role |
|---|---|
| `scripts/score-severity-replay.cjs` | Offline severity replay: the census, the label sheet and label gate, the backend gate and the optional `report.json` write. |

### Validation

| File | Role |
|---|---|
| `tests/unit/score-severity-replay.vitest.ts` | Primary regression coverage for Severity replay. |

---

## 5. SOURCE METADATA

- Group: Scoring
- Playbook ID: DLR-058
- Feature catalog entry: `feature-catalog/scoring/severity-replay.md`
- Scenario file path: `manual-testing-playbook/scoring/severity-replay.md`
- Canonical root source: `manual-testing-playbook/manual-testing-playbook.md`
