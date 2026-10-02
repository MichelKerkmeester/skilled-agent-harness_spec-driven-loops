---
title: "SKL-008 -- Replay Stage-Two leaf routes"
description: "This scenario validates the Stage-Two leaf-route replay for `SKL-008`. It focuses on the zero-call default, the per-hub lines and the replay stop line."
version: 1.5.0.0
---

# SKL-008 -- Replay Stage-Two leaf routes

This document captures the operator contract for `SKL-008`.

---

## 1. OVERVIEW

This scenario validates the Stage-Two leaf-route replay and its verdict rule. It checks that the replay calls no model and that the verdict stops when the prose arm covers too few gold rows.

### Why This Matters

The replay exists to measure the keyword arm at zero cost. A run that spent a model call would break that promise. A verdict taken from rows the prose arm never covered would not be evidence.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `SKL-008` and read the replay and verdict lines before answering.

- Objective: replay the Stage-Two leaf routes per hub with zero model calls, then confirm the replay stops at prose coverage
- Realistic user request: `How well do the hub routers pick leaf routes today, and is the keyword arm still worth keeping?`
- Prompt: `Replay the Stage-Two leaf routes and tell me whether the keyword arm is worth keeping.`
- Expected execution process: place a logging stub `jev` binary first on `PATH`, run the replay with a report folder and no arm switch, then check the report and the stub log
- Expected signals: the replay prints one line per hub, `hub=sk-code gold=1 unscored=1 surface slice not replayed`, `hub=cli-classifier stage1-only`, `router reads: not measured` and the stop line `replay verdict: stop (prose arm covers 0 of 55 rows) N=55 P=0 keyword_f1=n/a prose_f1=n/a`. The stub log stays empty.
- Desired user-visible outcome: the per-hub replay counts and a plain statement that the keyword arm is not kept or dropped until the prose arm covers enough rows
- Pass/fail: PASS if the replay exits 0, the report is written, the replay stops at the coverage line and no stub call is logged. FAIL if a stub call is logged, the report is missing or the replay prints `replay verdict: keep` or `replay verdict: drop`.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Replay the Stage-Two leaf routes and tell me whether the keyword arm is worth keeping.`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| SKL-008 | Replay Stage-Two leaf routes | Replay the Stage-Two leaf routes with zero model calls and confirm the replay stops at prose coverage | `Replay the Stage-Two leaf routes and tell me whether the keyword arm is worth keeping.` | 1. `bash: mkdir -p /tmp/replay-stub && printf '#!/bin/sh\necho called >> /tmp/replay-stub/calls.log\nexit 1\n' > /tmp/replay-stub/jev && chmod +x /tmp/replay-stub/jev` -> 2. `bash: PATH="/tmp/replay-stub:$PATH" node .skilled/skills/sk-doc/sk-create-skill/scripts/leaf-route-replay.cjs --report /tmp/replay-report` -> 3. `bash: test -f /tmp/replay-report/report.json` -> 4. `bash: test ! -e /tmp/replay-stub/calls.log` -> 5. `bash: rm -rf /tmp/replay-stub /tmp/replay-report` | Step 2: one line per hub, `hub=sk-code gold=1 unscored=1 surface slice not replayed`, `hub=cli-classifier stage1-only`, `router reads: not measured`, `replay verdict: stop (prose arm covers 0 of 55 rows) N=55 P=0 keyword_f1=n/a prose_f1=n/a` and exit 0. Steps 3 and 4: exit 0 | The exact prompt, the replay output with its exit status, the report folder and the result of the stub log check | PASS if the replay exits 0, the report is written, the replay stops on prose coverage and no stub call is logged. FAIL on any stub call, a missing report or a `keep` or `drop` verdict | 1. Read `replayVerdict` in the report for the `N` and `P` behind the stop. 2. Check that the run passed no `--prose` file. 3. Check `PATH` for a real `jev` ahead of the stub |

### Commands

1. `bash: mkdir -p /tmp/replay-stub && printf '#!/bin/sh\necho called >> /tmp/replay-stub/calls.log\nexit 1\n' > /tmp/replay-stub/jev && chmod +x /tmp/replay-stub/jev`
2. `bash: PATH="/tmp/replay-stub:$PATH" node .skilled/skills/sk-doc/sk-create-skill/scripts/leaf-route-replay.cjs --report /tmp/replay-report`
3. `bash: test -f /tmp/replay-report/report.json`
4. `bash: test ! -e /tmp/replay-stub/calls.log`
5. `bash: rm -rf /tmp/replay-stub /tmp/replay-report`

### Expected

Step 1 builds a stub that logs any call. Step 2 prints the replay and writes the report folder. Step 3 confirms the report is there. Step 4 proves no stub ran. Step 5 removes the temporary folders.

### Evidence

Capture the prompt, the replay output with its exit status, the report folder and the result of the stub log check.

### Pass / Fail

- **Pass**: the replay exits 0, the report is written, the run prints `replay verdict: stop (prose arm covers 0 of 55 rows)` and no stub call is logged.
- **Fail**: a stub call is logged, the report is missing or the run prints `replay verdict: keep` or `replay verdict: drop`.

### Failure Triage

1. Read `replayVerdict` in the report for the `N` and `P` behind the stop.
2. Check that the run passed no `--prose` file, since covered rows can turn the stop into `keep` or `drop`.
3. Check `PATH` for a real `jev` ahead of the stub.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [`manual-testing-playbook.md`](../manual-testing-playbook.md) | Root package policy and scenario index |
| [`leaf-route-replay.md`](../../../feature-catalog/packet-authored-registry-routing/leaf-route-replay.md) | The sk-doc hub catalog entry for the script |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [`scripts/leaf-route-replay.cjs`](../../scripts/leaf-route-replay.cjs) | Keyword-arm replay, read recount, replay verdict and tie-break arms |
| [`scripts/tests/leaf-route-replay.test.cjs`](../../scripts/tests/leaf-route-replay.test.cjs) | Unit coverage on parsing, scoring, transcripts, verdicts and stub binaries |
| [`SKILL.md`](../../SKILL.md) | Resource domain that names the script |

---

## 5. SOURCE METADATA

- Group: PARENT HUB
- Playbook ID: SKL-008
- Canonical root source: [`manual-testing-playbook.md`](../manual-testing-playbook.md)
- Feature file path: `parent-hub/replay-stage-two-leaf-routes.md`
