---
title: "Implementation Plan: Phase 23: reply-harness-blinded-judge"
description: "One read-only Node script in sk-communication's reply harness joins masked replies to their committed files, scores the harness's mechanical baseline on three levels, stops at a label gate of 20 operator-graded replies and then, behind --jev or --deem and each backend's own checks, scores one rubric score per reply and dimension under a keep rule fixed in the spec."
trigger_phrases:
  - "reply harness judge plan"
  - "judge-agreement plan"
  - "blinded judge keep rule"
  - "masked reply baseline plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 23: reply-harness-blinded-judge

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js ESM (`.mjs`), standard library only, as the harness's other four scripts |
| **Framework** | None. The script spawns `score.mjs`, `cli-deem` and `jev` as child processes |
| **Storage** | None. It reads committed runs and an operator-named labels file, and writes only under `--out` |
| **Testing** | `node --test` (proposed, confirmed at T002), with a fixture run and stub `cli-deem` and `jev` binaries |

### Overview
The script works in two slices. Slice 1 makes no model call: it joins each masked reply to its committed reply file by SHA-256, runs `score.mjs` unchanged for the mechanical baseline, maps both the baseline and the operator's grades onto three levels and prints the label gate, headroom and power lines. Slice 2 adds a Deem arm and a Jev arm, each behind its own switch and checks, that ask one `score` per reply and rubric dimension and print one verdict per column under the spec's Keep Rule.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

Evidence: `BE` is `scratch/w4-build/build-evidence.md` and `SE` is `scratch/w4-session/session-evidence.md`; where the two disagree, `SE` wins.

### Definition of Ready
- [x] The operator released this phase on 2026-09-29 (parent goal D3, amended by the "Bind and release" answer), so this is a check, not a wait. Builds run in number order, and disjoint builds may run in parallel. Evidence: the release is the build's stated precondition and the build ran under it (`BE` section 1, `SE` section 1)
- [x] The Keep Rule in `spec.md` section 4 is unchanged since this plan, and no model run has happened. Evidence: the census prints the `keep rule:` line with the spec's order and thresholds, and no model ran: every run used logging stubs and the census stops at the label gate (`SE` section 2)
- [x] T002 has recorded the owner's test runner and the baseline `git status --porcelain`. Evidence: `node --test .skilled/skills/sk-communication/benchmark/reply-harness/` printed `tests 0` (the harness shipped no test file) and `baseline/git-status-pre.txt` holds the 6-line pre-build porcelain (`BE` section 1)

### Definition of Done
- [x] Every REQ in `spec.md` section 4 meets its acceptance criteria, or is listed as waiting on the label gate. Evidence: REQ-001 to REQ-014 are built, covered by `tests 43, pass 43, fail 0` and the proof runs; the criteria needing operator labels or a live run are listed in `implementation-summary.md` Known Limitations as waiting on the label gate (`SE` sections 2 and 3)
- [x] `node --test judge-agreement.test.mjs` exits 0 with at least 18 passed and 0 failed. Evidence: `tests 43`, `pass 43`, `fail 0`, exit 0 (`SE` section 2)
- [x] The zero-call census on the three committed runs is recorded in `goal.md`'s log, and so is a verdict line or the label gate's `stop:` line. Evidence: the counts, the baseline and `stop: fewer than 20 labeled replies` are in `goal.md`'s log, recorded by this closure pass (`SE` section 2)
- [x] Cross-family review leaves no open P0 or P1 finding (parent goal D5). Evidence: Pi MiMo on the code `VERDICT: PASS` with 4 P2; Devin DeepSeek on the docs found 2 P1 and 3 P2, both P1 closed and the recheck `VERDICT: PASS`; 7 P2 recorded and not chased (`SE` section 3)
- [x] `validate_document.py` exits 0 on every skill doc changed (parent goal D6), and `validate.sh --strict` on this phase prints `RESULT: PASSED`. Evidence: exit 0 on all 8 changed docs (`SE` section 2), and `validate.sh --strict` prints `RESULT: PASSED`, run by this closure pass (results in `implementation-summary.md` Verification)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
One read-only measurement script with a zero-call default and two dormant arms, the shape of phase 017's `score-track-narrowing.mjs`. Nothing in the harness imports it, and it imports nothing from the harness, so the harness runs as today.

### Key Components
- **Census and join**: reads each `--masked` directory, takes the text after the `Reply A:` or `Reply B:` line, hashes it and matches it to a reply file under a `--replies` directory. It prints masked, distinct, matched and unmatched counts.
- **Mechanical baseline**: spawns `score.mjs --condition after --replies <dir> --out <tmp>/scores.json` once per replies directory, with `<tmp>` outside the repository and removed after the read. The condition value only labels that output, because no `--prompts` is passed. Each reply's seven `dimensionScores` map to `absent`, `partly met` or `fully met`.
- **Labels and gate**: parses the operator's JSONL, checks all seven dimensions and conflicts, and prints `stop: fewer than 20 labeled replies` below the gate.
- **Deem arm**: `cli-deem health`, then one `cli-deem score` per cell, the state on stdin and closed.
- **Jev arm**: the identity line, the three checks, one `jev auth test --provider P`, then three `jev score --provider P` per cell with no answer cache.
- **Verdict**: the spec's Keep Rule per column, one `verdict <backend>:` line, `report.json` and `calls.jsonl` under `--out`.

### Data Flow
Masked files and replies directories go into the census. The census and `score.mjs` produce the matched replies with their baseline levels. The labels file adds the operator's grades. Below the gate the run stops. Past it, each requested arm that passes its checks asks its cells, and the verdict step compares the column with the baseline on the same measured replies.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state. The order is:

1. **Setup.** Confirm the release, read the owner's harness scripts, record the test runner and the pre-run `git status --porcelain`, and build the fixture run.
2. **Slice 1, zero calls.** Census and join, the baseline through `score.mjs`, the labels parser and gate, headroom, power and the default output. Run it on the three committed runs and log the counts.
3. **Slice 2, the arms.** The Deem gate and arm, then the Jev gate and arm, the payload gate, the exit table, the records and the verdict per column.
4. **Docs.** The README row, then sk-communication's `SKILL.md`, `README.md`, changelog, feature catalog and playbook through sk-doc.
5. **Runs and review.** Past the label gate, one live `--deem --out` run, a `--jev` run only on the operator's flag, then cross-family review and the parent's commit.

Who builds (parent goal D5): a fresh Opus 5.5 xhigh build orchestrator sends single-change briefs to Devin `deepseek-v4-1-flash-max` and Pi `llmgateway/mimo-v2.6-pro` at thinking `high`, verifies each result and gets the code reviewed by a model of another family. P0 and P1 findings are fixed, and P2 findings are recorded.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The test file builds a fixture run in a temporary directory: two replies directories of three cases each, one masked directory from them and one reply edited after masking, so the join has one unmatched row. Stub `cli-deem` and `jev` scripts on a temporary `PATH` answer from a table and append one line per call to their logs. Each public surface gets a happy path and one edge case, as REQ-013 lists, and the verdict cases feed stub answers chosen to land on `keep`, `kill`, `stop (margin)`, `stop (coverage)` and, for Jev, `stop (flips)`. The live runs are proof, not tests: a stub or fake-server verdict never counts (Keep Rule).
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Needed for | State at planning |
|------------|-----------|-------------------|
| The operator's release | Any build step | Released 2026-09-29 (parent goal D3, amended by the operator's "Bind and release"). Builds run in number order, and disjoint builds may run in parallel |
| `score.mjs` and `python3` | The mechanical baseline | Present. `score.mjs` spawns the scanner through `python3` |
| The three committed blind runs | The census | Present, 42 masked files |
| 20 graded replies | Any model call | None graded |
| `cli-deem` from phase 008 and the served Deem | The Deem arm | Phase 008 Complete. Server health is checked at run time |
| `jev` 0.6.2 and a credential for provider P | The Jev arm | `jev --version` printed `jev 0.6.2` on 2026-09-29. The credential is checked at run time |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

The build adds two files and edits docs only. `git revert` of the build commit removes the script and its test and restores the README, `SKILL.md`, changelog, catalog and playbook. A run changes no tracked file, so no run needs a rollback. A report directory the operator named is deleted by hand if unwanted.
<!-- /ANCHOR:rollback -->

---
