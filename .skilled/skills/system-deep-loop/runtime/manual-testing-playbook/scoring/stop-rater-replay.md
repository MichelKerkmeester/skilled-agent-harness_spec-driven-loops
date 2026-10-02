---
title: "DLR-056 -- Stop-rater replay"
description: "Manual validation scenario for Stop-rater replay in the runtime/ skill."
version: 1.6.0.0
---

# DLR-056 -- Stop-rater replay

This document captures the realistic user-testing contract, execution flow, and metadata for `DLR-056`.

---

## 1. OVERVIEW

Adds `scripts/score-stop-rater.cjs`, an offline replay of the recorded deep-research lineages that changes no stop. A run prints the census and makes zero model calls by default. `--jev` opens one arm only after `--gold-reads` confirms the derived gold the census printed.

### Why This Matters

The replay must stay offline unless an operator switch asks for a model arm, and every call the switch opens is recorded. A logging Jev stub first on `PATH` proves the default run calls nothing, and the label gate keeps the arm closed until the operator's reads confirm the derived gold.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm the stop-rater replay makes zero model calls by default, stops at the label gate before the Jev check, skips Jev when credentials are missing, and leaves the working tree unchanged.
- Layer partition: scoring runtime.
- Real user request: `Run the offline stop-rater replay with a logging Jev stub first on PATH and confirm the default run makes zero model calls, the label gate stops the arm, missing credentials skip Jev, and the suite passes.`
- Expected signals: No stub call in the default run, `stop: fewer than 5 confirmed lineages` before the Jev check, `jev arm skipped: no credential` after the label gate, `git status --porcelain` unchanged, and the stop-rater suite passes.
- Pass/fail: PASS if every run prints its expected lines with the stated exit code and the stub logs stay absent in the runs that call nothing. FAIL if the default run calls a stub, the label gate opens the Jev arm without confirmed reads, the working tree changes, or a test fails.

---

## 3. TEST EXECUTION

### Prerequisites

- Working directory is repository root.
- `runtime/` source tree is present.
- Feature catalog entry exists at `feature-catalog/scoring/stop-rater-replay.md`.
- `node`, `git` and `npx` are available on the PATH.

### Prompt

- Prompt: `Run the offline stop-rater replay with a logging Jev stub first on PATH and confirm the default run makes zero model calls, the label gate stops the arm, missing credentials skip Jev, and the suite passes.`

### Commands

Run from the repository root.

1. `rm -rf /tmp/dlr-056 && mkdir -p /tmp/dlr-056/bin`
2. `printf '#!/bin/sh\necho "$*" >> /tmp/dlr-056/jev.log\nif [ "$1" = "--version" ]; then echo "jev 0.6.2"; exit 0; fi\nexit 3\n' > /tmp/dlr-056/bin/jev && chmod +x /tmp/dlr-056/bin/jev`
3. `git status --porcelain > /tmp/dlr-056/porcelain.before`
4. `PATH=/tmp/dlr-056/bin:$PATH node .skilled/skills/system-deep-loop/runtime/scripts/score-stop-rater.cjs > /tmp/dlr-056/default.txt; echo "exit=$?"; cat /tmp/dlr-056/default.txt; test ! -e /tmp/dlr-056/jev.log && echo "no Jev calls"`
5. `PATH=/tmp/dlr-056/bin:$PATH node .skilled/skills/system-deep-loop/runtime/scripts/score-stop-rater.cjs --jev --out /tmp/dlr-056/out-gate > /tmp/dlr-056/gate.txt; echo "exit=$?"; diff /tmp/dlr-056/default.txt /tmp/dlr-056/gate.txt; test ! -e /tmp/dlr-056/jev.log && echo "no Jev calls"; ls /tmp/dlr-056/out-gate`
6. Build `/tmp/dlr-056/reads.jsonl`, one row `{lineage, gold_iteration, labeler}` per lineage, from the first five entries the `reads:` line printed. Those rows are the operator's confirmation of the derived gold. `node -e 'const fs=require("fs");const line=fs.readFileSync("/tmp/dlr-056/default.txt","utf8").split("\n").find((l)=>l.startsWith("reads: "));const rows=line.slice(7).split(" | ").slice(0,5).map((s)=>{const m=s.match(/^(.*) g=(\d+)$/);return JSON.stringify({lineage:m[1],gold_iteration:Number(m[2]),labeler:"operator"})});fs.writeFileSync("/tmp/dlr-056/reads.jsonl",rows.join("\n")+"\n")'`
7. `PATH=/tmp/dlr-056/bin:$PATH node .skilled/skills/system-deep-loop/runtime/scripts/score-stop-rater.cjs --gold-reads /tmp/dlr-056/reads.jsonl --jev --out /tmp/dlr-056/out-skip > /tmp/dlr-056/skip.txt; echo "exit=$?"; diff /tmp/dlr-056/default.txt /tmp/dlr-056/skip.txt; cat /tmp/dlr-056/jev.log; ls /tmp/dlr-056/out-skip`
8. `git status --porcelain > /tmp/dlr-056/porcelain.after; diff /tmp/dlr-056/porcelain.before /tmp/dlr-056/porcelain.after`
9. `cd .skilled/skills/system-deep-loop/runtime && npx vitest run tests/unit/score-stop-rater.vitest.ts`
10. Record PASS or FAIL with rationale. Record SKIP only when a named sandbox blocker (an unavailable native module, a missing runtime dependency, or an unavailable external CLI credential) prevents a command from running.

### Expected Outcome

The stop-rater replay matches the documented current reality, every expected line prints with exit 0, and validation evidence is reproducible.

- Step 4 prints `exit=0` and this stdout, where the `reads:` line lists sampled lineages as `<path> g=<gold>`:

```
lineages: tracked 486 no config 37 forced 235 no deltas 92 kept 122 no gold 106 sampled 16 inert 4
gold: derived on 16 of 16 sampled
reads: <path> g=<gold> | <path> g=<gold> | ...
method recorded: right 5 of 16
method legacy: right 5 of 16
method sources: right 4 of 16
baseline: legacy right 5 of 16
question counts: 12 of 16 sampled lineages carry key/answered counts
margin: 0.10
keep rule: coverage 10*M >= 9*K, kill p_loss < 0.05, margin 10*(A-B) >= M, sign test p_win < 0.05, flips 10*F <= C (jev only)
power: a keep needs at least 5 wins with no loss, since 0.5^5 = 0.03125 < 0.05
planned calls: jev 718
```

- Step 4 reports that `/tmp/dlr-056/jev.log` does not exist, because no stub was called.
- Step 5 prints `exit=0` and the diff shows one added line, `stop: fewer than 5 confirmed lineages`. The Jev stub log still does not exist, and `/tmp/dlr-056/out-gate` holds only `report.json`.
- Step 6 writes five rows to `/tmp/dlr-056/reads.jsonl`.
- Step 7 prints `exit=0` and the diff shows two added lines, `jev: path=/tmp/dlr-056/bin/jev provider=official` and `jev arm skipped: no credential`. `/tmp/dlr-056/jev.log` holds `--version` and `auth status --provider official`, and `/tmp/dlr-056/out-skip` holds only `report.json`.
- Step 8 prints nothing from the diff, because the working tree is unchanged.
- Step 9 prints `exit=0` with 58 passing tests and 0 failing.

### Evidence

- Captured stdout and exit status for every command run in this section, including the three diff outputs.
- The files under `/tmp/dlr-056`: `default.txt`, `gate.txt`, `skip.txt`, `reads.jsonl`, `jev.log`, `porcelain.before`, `porcelain.after`, and `report.json` under `out-gate` and `out-skip`.
- Output from `tests/unit/score-stop-rater.vitest.ts` naming the assertions that carry the expected signals.
- A triage note for any non-PASS outcome that names which expected signal was absent or contradicted.

### Failure Triage

- A stub log appears in a run that should call nothing. Find which code path spawns a backend without `--jev`.
- The label gate prints no stop line without reads. Check `labelGate` and the `--gold-reads` parse in `scripts/score-stop-rater.cjs`.
- A run exits 2 with nothing on stdout. The reads file holds a bad row and stderr names it, or `--jev` ran without `--out`.
- The census counts or the test count differ from the expected lines. The tracked corpus or the test file changed since this scenario was recorded.
- Evidence is inferred from memory instead of captured from current source or command output.

---

## 4. SOURCE FILES

### Implementation

| File | Role |
|---|---|
| `scripts/score-stop-rater.cjs` | Offline stop-rater replay: the census, the label gate and the opt-in Jev arm. |

### Validation

| File | Role |
|---|---|
| `tests/unit/score-stop-rater.vitest.ts` | Primary regression coverage for the Jev stop-rater replay. |

---

## 5. SOURCE METADATA

- Group: Scoring
- Playbook ID: DLR-056
- Feature catalog entry: `feature-catalog/scoring/stop-rater-replay.md`
- Scenario file path: `manual-testing-playbook/scoring/stop-rater-replay.md`
- Canonical root source: `manual-testing-playbook/manual-testing-playbook.md`
