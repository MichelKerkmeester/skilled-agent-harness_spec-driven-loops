---
title: "Tasks: Phase 23: reply-harness-blinded-judge"
description: "Ordered tasks for the reply-harness judge measurement: setup and baselines, the zero-call census and label gate, the Deem and Jev arms with their verdicts, the sk-communication docs and the gated live runs."
trigger_phrases:
  - "reply harness judge tasks"
  - "judge-agreement tasks"
  - "blinded judge verification"
  - "reply harness label gate"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 23: reply-harness-blinded-judge

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`

H below is `.skilled/skills/sk-communication/benchmark/reply-harness`, S is `H/judge-agreement.mjs` and T is `H/judge-agreement.test.mjs`. Closure (2026-09-29): built and committed as `b5e71ae777`. `BE` is `scratch/w4-build/build-evidence.md` and `SE` is `scratch/w4-session/session-evidence.md`; where the two disagree, `SE` wins.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm the operator released this phase. Parent goal D3, amended by the operator's "Bind and release", released it on 2026-09-29. Builds run in number order, and disjoint builds may run in parallel (parent `goal.md`). Evidence: the release is the build's stated precondition and the build ran under it on 2026-09-29 (`BE` section 1, `SE` section 1)
- [x] T002 Read the owner's harness before writing: `H/README.md`, `blind.mjs`, `score.mjs`, `compare.mjs`, `rubric.json` and `release-gate.md`. Record the test runner the build uses, `node --test` unless the owner names another, and the pre-run `git status --porcelain`. Route the code through sk-code's OpenCode route (`H/`). Evidence: `node --test .skilled/skills/sk-communication/benchmark/reply-harness/` printed `tests 0`, `pass 0`, `fail 0`, so the runner is `node --test` and the harness shipped no test file, and `baseline/git-status-pre.txt` holds the 6-line pre-build porcelain. A search of `scratch/w4-build/briefs/` finds `sk-code` named in every code brief, 01 to 12 (`BE` section 1)
- [x] T003 [P] Build the fixture run inside T: two replies directories of three cases each, one masked directory made by `blind.mjs`, one reply edited after masking, a labels file and stub `cli-deem` and `jev` scripts that log one line per call (T). Evidence: briefs 01 and 05 built the fixture and the logging stubs, and `node --test T` from the final state prints `tests 43`, `pass 43`, `fail 0`. The built fixture is three replies directories of seven cases, two masked directories and an edit-after-masking option, where this task names two directories of three cases; it covers every case this task lists (`SE` section 2)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Census and join: read each `--masked` directory, take the text after `Reply A:` or `Reply B:`, match it by SHA-256 to a file under a `--replies` directory, print masked, distinct, matched and unmatched counts (S). REQ-002. Evidence: brief 01. The final-state run prints `masked: 42`, `distinct: 38`, `matched: 38`, `unmatched: 0`, exit 0 (`SE` section 2; rerun by this closure pass)
- [x] T005 Mechanical baseline: spawn `score.mjs` unchanged once per replies directory into a temporary `--out` outside the repository, remove it after the read, map each of the seven `dimensionScores` to three levels, and exit 2 naming the spawn if `score.mjs` fails (S). REQ-003. Evidence: briefs 02 and 06b. The run prints `baseline: score.mjs dimension scores, 0 = absent, 1 = fully met, between = partly met` and `baseline levels: absent=65 partly met=20 fully met=174` with `no baseline: 1`, where dispatch 06b made a missing or empty reply file cost only that reply its baseline (`SE` section 2; rerun by this closure pass)
- [x] T006 Labels parser and gate: the JSONL shape, all seven dimensions, the `stop: label conflict` exit 2, the labels SHA-256 and `stop: fewer than 20 labeled replies` (S). REQ-004. Evidence: briefs 03 and 04. The run prints `labels: none`, `labeled: 0`, `baseline agreement: n/a` and `stop: fewer than 20 labeled replies`, exit 0, and the tests pin a missing dimension, a grade outside the levels, a same-reply conflict and 19 graded below the gate (`SE` section 2)
- [x] T007 Zero-call output: baseline agreement overall and per dimension, `margin: 0.10`, the `keep rule:` line, the power line, `no headroom` above 0.90 and `planned calls:`. No file written without `--out` (S). REQ-001. Evidence: briefs 04 and 06. The run prints `margin: 0.10`, the `keep rule:` line, the power line and the stop line, writes no file and leaves both stub logs empty (`p1 stub log lines: 0`, `SE` section 2)
- [x] T008 Deem gate behind `--deem`: `cli-deem health` within 2,000 ms, the four skip lines, the "nothing leaves the machine" notice with planned calls and wall time (S). REQ-006, REQ-010. Evidence: brief 08. `proof.sh` p2 exits 0 with `p2 tail: deem arm skipped: stub backend` and its stdout prefix byte-identical to the census (`SE` section 2)
- [x] T009 Deem arm: one `cli-deem score` per cell with the masked text on stdin and closed, the dimension's `judgeGuidance` as `-q`, three levels in fixed order, rounding, the Deem exit table and `calls.jsonl` lines with the commit pair (S). REQ-009, REQ-010. Evidence: briefs 09 and 10. The tests measure every reply and dimension on stub answers and write one `calls.jsonl` line per call, 43 of 43 passing; the live cells wait at T018 (`SE` section 2)
- [x] T010 Jev gate behind `--jev`: identity line, `command -v jev`, `jev --version` printing `jev 0.6.2`, `jev auth status --provider P`, the three skip lines, the payload class and the `--accept-payload` rule for untracked masked files (S). REQ-007, REQ-008. Evidence: briefs 11 and 11b. `proof.sh` p3 exits 0 with the identity line `jev: path=<stub>/jev provider=official`, then `jev arm skipped: no credential`, and the stdout prefix byte-identical to the census (`SE` section 2)
- [x] T011 Jev arm: one `jev auth test --provider P`, then three `jev score --provider P` per cell with no answer cache, the 90 s cap, the Jev exit table and `calls.jsonl` lines with version, provider and model (S). REQ-009, REQ-010. Evidence: brief 12, including the three-rerun flip case on stub answers. The live cells wait at T019 (`SE` section 2)
- [x] T012 Verdict per column, exactly the spec's Keep Rule: coverage, kill, margin, sign test and flips in that order, integer counts and an exact p, the verdict line and `report.json` under `--out`, requalify lines and `--out` required before any call (S). REQ-005, REQ-010, REQ-011. Evidence: briefs 07, 10 and 12. The tests pin `keep`, `stop (margin)`, `kill`, `stop (coverage)` and a Jev `stop (flips)` on stub answers, and `--deem` without `--out` exits 2 before any read (`SE` section 2)
- [x] T013 Per-dimension table for each column that ran, reported and never deciding (S). REQ-012. Evidence: brief 07's `summarizeColumn` returns `perDimension` beside the baseline's counts and `decideVerdict` never reads it; 43 of 43 tests pass (`SE` section 2)
- [x] T014 README: one "What each piece does" row and one run-order step naming the script, its zero-call default and its two switches (`H/README.md`). Evidence: brief 13. `validate_document.py` exits 0 on the changed `H/README.md`, and `test_readme_verdict_parity.py` ends `PARITY PASS: verdict diff is empty` with the harness README's verdict moved from fail to pass (`SE` sections 2 and 4)
- [x] T015 [P] Parent goal D6 docs through sk-doc: one sentence in `SKILL.md`, one line in `README.md`, the next changelog file, one catalog entry under `evaluation-and-observability/` with its index row, and one playbook scenario under `release-gating/` covering the census and a stub skip with its index row (`.skilled/skills/sk-communication/`). REQ-014. Evidence: briefs 14 to 20, 18b and `fix/f1.md` wrote the seven docs, each `validate_document.py` exit 0. The recheck confirms the playbook scenario and its `### COMM-011` index section name `--jev` and its gate, `grep -c -- --jev` printing 1 in each (`SE` sections 1 to 3)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T016 Tests: `node --test` on T exits 0 with at least 18 passed and 0 failed, covering every case REQ-013 lists (T). REQ-013. Evidence: `tests 43`, `pass 43`, `fail 0`, exit 0 from the final state, where the harness shipped no test file at baseline (`SE` section 2)
- [x] T017 Zero-call census on the three committed runs and their six replies directories, stub binaries first on `PATH`. Expect `masked: 42`, `distinct: 38`, `matched: 38` and the label gate line. Record the counts and the baseline in `goal.md`'s log. Evidence: `proof.sh` p1 exits 0 with `p1 stub log lines: 0`, and the counts and the baseline are in `goal.md`'s log, recorded by this closure pass (`BE` sections 1 and 2, `SE` section 2)
- [B] T018 Past the label gate only: one live `--deem --out <dir>` run. Record the verdict line, the commit pair, the report path and p50 and p95 in `goal.md`'s log for the parent goal's log. Waits on 20 graded replies from the operator. Open for the operator: 0 of 38 distinct replies are graded and the census stops at `stop: fewer than 20 labeled replies`, so this run needs the operator's grades first. Not part of this phase's completion (parent D4, `SE` section 5)
- [B] T019 Only when the operator passes `--jev`: one `--jev --out <dir>` run, recorded the same way with provider and model. The build never waits for the flag. Open for the operator: the `--jev` flag and the labels, plus `jev` 0.6.2 and a credential the gate resolves. Not part of this phase's completion (parent D4, `SE` section 5)
- [x] T020 `git status --porcelain` matches T002's after every run, and `grep -nE 'API_KEY|TYPESAFE|Bearer|Authorization'` on S prints nothing. REQ-008. Evidence: `proof.sh` records `p6-grep rc=1` and `porcelain identical: yes`, sk-communication paths also compared on their own and equal (`SE` section 2)
- [x] T021 `python3 .skilled/skills/sk-doc/scripts/validate_document.py` exits 0 on every doc T014 and T015 changed. REQ-014. Evidence: exit 0 on all 8 changed docs, the catalog index with `--type feature_catalog` and the playbook index with `--type playbook` (`SE` section 2)
- [x] T022 Cross-family review of S and T leaves no open P0 or P1 finding, P2 findings recorded (parent goal D5). Then the parent orchestrator commits with path-scoped commits. Evidence: Pi MiMo on the code `VERDICT: PASS` with 4 P2, Devin DeepSeek on the docs `VERDICT: FAIL` with 2 P1 and 3 P2; both P1 closed (leaf manifest regenerated, `--jev` named in the playbook scenario and its index) and the recheck `VERDICT: PASS`; 7 P2 recorded and not chased. Committed as `b5e71ae777`, 14 files (`SE` sections 3 and 4)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`, or the phase closes at its label gate with T018 and T019 left `[B]` and listed in `implementation-summary.md` as waiting on the operator's grades. Evidence: T001 to T017 and T020 to T022 are `[x]`, T018 and T019 stay `[B]` and `implementation-summary.md` lists them, and the census prints `stop: fewer than 20 labeled replies` from the final state (parent D4)
- [x] No `[B]` blocked task remains other than those two. Evidence: this closure pass
- [x] Manual verification passed: the zero-call census ran on the committed runs with stub binaries first on `PATH`. Evidence: `p1 rc=0` and `p1 stub log lines: 0`, rerun by the session from the final state (`SE` section 2)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Goal**: See `goal.md`
- **Research record**: R6 in `../001-deep-research/research/research.md` section 11, carried by `../007-classifier-deep-research/research/research.md` section 12
<!-- /ANCHOR:cross-refs -->

---
