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
- Expected execution process: run the replay with a report folder, then check the report
- Expected signals: the replay prints one line per hub, `hub=sk-code gold=1 unscored=1 surface slice not replayed`, `router reads: not measured` and the stop line `replay verdict: stop (prose arm covers 0 of 58 rows) N=58 P=0 keyword_f1=n/a prose_f1=n/a`.
- Desired user-visible outcome: the per-hub replay counts and a plain statement that the keyword arm is not kept or dropped until the prose arm covers enough rows
- Pass/fail: PASS if the replay exits 0, the report is written and the replay stops at the coverage line. FAIL if the report is missing or the replay prints `replay verdict: keep` or `replay verdict: drop`.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Replay the Stage-Two leaf routes and tell me whether the keyword arm is worth keeping.`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| SKL-008 | Replay Stage-Two leaf routes | Replay the Stage-Two leaf routes with zero model calls and confirm the replay stops at prose coverage | `Replay the Stage-Two leaf routes and tell me whether the keyword arm is worth keeping.` | 1. `bash: node .skilled/skills/sk-doc/sk-create-skill/scripts/leaf-route-replay.cjs --report /tmp/replay-report` -> 2. `bash: test -f /tmp/replay-report/report.json` -> 3. `bash: rm -rf /tmp/replay-report` | Step 1: one line per hub, `hub=sk-code gold=1 unscored=1 surface slice not replayed`, `router reads: not measured`, `replay verdict: stop (prose arm covers 0 of 58 rows) N=58 P=0 keyword_f1=n/a prose_f1=n/a` and exit 0. Step 2: exit 0 | The exact prompt, the replay output with its exit status and the report folder | PASS if the replay exits 0, the report is written and the replay stops on prose coverage. FAIL on a missing report or a `keep` or `drop` verdict | 1. Read `replayVerdict` in the report for the `N` and `P` behind the stop. 2. Check that the run passed no `--prose` file |

### Commands

1. `bash: node .skilled/skills/sk-doc/sk-create-skill/scripts/leaf-route-replay.cjs --report /tmp/replay-report`
2. `bash: test -f /tmp/replay-report/report.json`
3. `bash: rm -rf /tmp/replay-report`

### Expected

Step 1 prints the replay and writes the report folder. Step 2 confirms the report is there. Step 3 removes the temporary folder.

### Evidence

Capture the prompt, the replay output with its exit status and the report folder.

### Pass / Fail

- **Pass**: the replay exits 0, the report is written and the run prints `replay verdict: stop (prose arm covers 0 of 58 rows)`.
- **Fail**: the report is missing or the run prints `replay verdict: keep` or `replay verdict: drop`.

### Failure Triage

1. Read `replayVerdict` in the report for the `N` and `P` behind the stop.
2. Check that the run passed no `--prose` file, since covered rows can turn the stop into `keep` or `drop`.

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
| [`scripts/leaf-route-replay.cjs`](../../scripts/leaf-route-replay.cjs) | Keyword-arm replay, read recount and replay verdict |
| [`scripts/tests/leaf-route-replay.test.cjs`](../../scripts/tests/leaf-route-replay.test.cjs) | Unit coverage on parsing, scoring, transcripts, verdicts, baselines and keep-rule math |
| [`SKILL.md`](../../SKILL.md) | Resource domain that names the script |

---

## 5. SOURCE METADATA

- Group: PARENT HUB
- Playbook ID: SKL-008
- Canonical root source: [`manual-testing-playbook.md`](../manual-testing-playbook.md)
- Feature file path: `parent-hub/replay-stage-two-leaf-routes.md`
