---
title: "DLR-059 -- Fan-out pair replay: census, label gate and stub-backend skip"
description: "Validate the fan-out pair replay in score-fanout-pairs.cjs: the zero-call default census, the label-gate stop under 40 labeled pairs and the Deem stub-backend skip."
version: 1.9.0.0
---

# DLR-059 -- Fan-out pair replay: census, label gate and stub-backend skip

This document captures the validation contract, execution flow, and metadata for `DLR-059`.

---

## 1. OVERVIEW

Validates the zero-call census and the gate lines in `score-fanout-pairs.cjs`.

### Why This Matters

The census shows the merge's own decision on every candidate duplicate pair before any
backend is scored. It must do that with zero model calls and zero files written. The
label gate then keeps a run below 40 labeled pairs from spending any call and the Deem
gate keeps a stub backend from being scored as the model. No run has printed a `verdict`
line, so this scenario claims none.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm the default run prints the census prefixes and stops at the label gate with no model call and no file written, and confirm the Deem gate skips a stub backend with `deem arm skipped: stub backend`.
- Layer partition: offline fan-out pair replay.
- Real user request: `Run the fan-out pair replay census and confirm it stops at the label gate without calling a backend, then show the test suite skipping a stub Deem backend.`
- Expected signals: The census prefixes `runs:`, `pairs:`, `class near-line:`, `class cross-body:` and `merge decisions:` on stdout. The final line `stop: fewer than 40 labeled pairs`. The asserted line `deem arm skipped: stub backend` in `deem gate skips a stub backend`. Exit 0 from both commands and no file written by the census run.
- Pass/fail: PASS only if the census run exits 0 with its census prefixes and ends `stop: fewer than 40 labeled pairs` and the test run exits 0 with 42 tests passing and `deem gate skips a stub backend` asserting `deem arm skipped: stub backend`. FAIL otherwise.

---

## 3. TEST EXECUTION

### Prerequisites

- Working directory is repository root.
- `.skilled/skills/system-deep-loop/runtime/scripts/score-fanout-pairs.cjs` present.

### Prompt

- Prompt: `Run the fan-out pair replay census and confirm it stops at the label gate without calling a backend, then show the test suite skipping a stub Deem backend.`

### Commands

1. `node .skilled/skills/system-deep-loop/runtime/scripts/score-fanout-pairs.cjs` and capture stdout and the exit status.
2. `cd .skilled/skills/system-deep-loop/runtime && npx vitest run tests/unit/score-fanout-pairs.vitest.ts` and capture the summary line.

### Expected Outcome

Command 1 exits 0 and prints in order `runs: research=<n> review=<n>`, `pairs: research=<n>
review=<n>`, `class near-line: research=<n> review=<n>` and `class cross-body: research=<n>
review=<n>`, then one `merge decisions: <class> <loop> dedup-on same=<n> different=<n>
dedup-off same=<n> different=<n>` line per class and loop, then `title rule: <loop>=<n> of
<n> findings carry a title` and `body fields: <loop>=<n> of <n> findings carry a body field`
for each loop, then `merge undecidable: <n>`. The run ends on `stop: fewer than 40 labeled
pairs` because no labels are filled in. The counts read the live tree so a later run may
differ.

Command 2 reports 42 tests passing with exit 0. `label reader stops under 40 pairs` asserts
`stop: fewer than 40 labeled pairs` and `label reader stops under 10 cross-body` asserts
`stop: fewer than 10 labeled cross-body pairs`. The case `deem gate skips a stub backend`
asserts `deem arm skipped: stub backend`, the line the Deem gate prints when the health
response reports `backend=stub`. The label gate runs before the backend gates, so a run
that names `--deem --out <dir>` under the gate prints `deem arm skipped: label gate` and
writes only `report.json`. Past the gate the stub-backend line appears on a run whose
`cli-deem` health response reports `backend=stub` and no call is made.

### Evidence

- Source excerpts from `scripts/score-fanout-pairs.cjs` showing the anchors named in the commands above, read from the current files rather than recalled.
- Captured stdout and exit status for every command run in this section.
- `git status --porcelain` output before and after command 1, showing the census run wrote no file.
- Output from `tests/unit/score-fanout-pairs.vitest.ts` naming the assertions that carry the expected signals.
- A triage note for any non-PASS outcome that names which expected signal was absent or contradicted.

### Failure Triage

- Exit 2 before any census line: a switch was missing its value or `--jev` or `--deem` ran without `--out <dir>`, which prints `--deem needs --out <dir> so every call is recorded` or the matching `--jev` line and refuses before the census.
- `deem arm skipped: label gate` in place of `deem arm skipped: stub backend`: the label gate stopped the run before the backend gates, so the Deem gate never read the health response.
- `deem arm skipped: stub backend` missing from the suite: the health response did not report `backend=stub` or the `deem gate skips a stub backend` case failed.

---

## 4. SOURCE FILES

### Implementation

| File | Role |
|---|---|
| `scripts/score-fanout-pairs.cjs` | Census printing in `main`, `gateState` label gate, `deemGate` skip reasons |

### Validation

| File | Role |
|---|---|
| `tests/unit/score-fanout-pairs.vitest.ts` | 42 tests, including the label gate and Deem gate cases |

---

## 5. SOURCE METADATA

- Group: Fan-Out
- Playbook ID: DLR-059
- Feature catalog entry: `feature-catalog/fanout/fanout-pair-replay.md`
- Scenario file path: `manual-testing-playbook/fanout/fanout-pair-replay.md`
- Canonical root source: `manual-testing-playbook/manual-testing-playbook.md`
- Expected verdict mode: GREEN when the census prints its prefixes and stops at the label gate and the suite asserts the stub-backend skip
- Wall-time estimate: 5-10 min
