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

H below is `.skilled/skills/sk-communication/benchmark/reply-harness`, S is `H/judge-agreement.mjs` and T is `H/judge-agreement.test.mjs`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Confirm the operator released this phase. Parent goal D3, amended by the operator's "Bind and release", released it on 2026-09-29. Builds run in number order, and disjoint builds may run in parallel (parent `goal.md`)
- [ ] T002 Read the owner's harness before writing: `H/README.md`, `blind.mjs`, `score.mjs`, `compare.mjs`, `rubric.json` and `release-gate.md`. Record the test runner the build uses, `node --test` unless the owner names another, and the pre-run `git status --porcelain`. Route the code through sk-code's OpenCode route (`H/`)
- [ ] T003 [P] Build the fixture run inside T: two replies directories of three cases each, one masked directory made by `blind.mjs`, one reply edited after masking, a labels file and stub `cli-deem` and `jev` scripts that log one line per call (T)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Census and join: read each `--masked` directory, take the text after `Reply A:` or `Reply B:`, match it by SHA-256 to a file under a `--replies` directory, print masked, distinct, matched and unmatched counts (S). REQ-002
- [ ] T005 Mechanical baseline: spawn `score.mjs` unchanged once per replies directory into a temporary `--out` outside the repository, remove it after the read, map each of the seven `dimensionScores` to three levels, and exit 2 naming the spawn if `score.mjs` fails (S). REQ-003
- [ ] T006 Labels parser and gate: the JSONL shape, all seven dimensions, the `stop: label conflict` exit 2, the labels SHA-256 and `stop: fewer than 20 labeled replies` (S). REQ-004
- [ ] T007 Zero-call output: baseline agreement overall and per dimension, `margin: 0.10`, the `keep rule:` line, the power line, `no headroom` above 0.90 and `planned calls:`. No file written without `--out` (S). REQ-001
- [ ] T008 Deem gate behind `--deem`: `cli-deem health` within 2,000 ms, the four skip lines, the "nothing leaves the machine" notice with planned calls and wall time (S). REQ-006, REQ-010
- [ ] T009 Deem arm: one `cli-deem score` per cell with the masked text on stdin and closed, the dimension's `judgeGuidance` as `-q`, three levels in fixed order, rounding, the Deem exit table and `calls.jsonl` lines with the commit pair (S). REQ-009, REQ-010
- [ ] T010 Jev gate behind `--jev`: identity line, `command -v jev`, `jev --version` printing `jev 0.6.2`, `jev auth status --provider P`, the three skip lines, the payload class and the `--accept-payload` rule for untracked masked files (S). REQ-007, REQ-008
- [ ] T011 Jev arm: one `jev auth test --provider P`, then three `jev score --provider P` per cell with no answer cache, the 90 s cap, the Jev exit table and `calls.jsonl` lines with version, provider and model (S). REQ-009, REQ-010
- [ ] T012 Verdict per column, exactly the spec's Keep Rule: coverage, kill, margin, sign test and flips in that order, integer counts and an exact p, the verdict line and `report.json` under `--out`, requalify lines and `--out` required before any call (S). REQ-005, REQ-010, REQ-011
- [ ] T013 Per-dimension table for each column that ran, reported and never deciding (S). REQ-012
- [ ] T014 README: one "What each piece does" row and one run-order step naming the script, its zero-call default and its two switches (`H/README.md`)
- [ ] T015 [P] Parent goal D6 docs through sk-doc: one sentence in `SKILL.md`, one line in `README.md`, the next changelog file, one catalog entry under `evaluation-and-observability/` with its index row, and one playbook scenario under `release-gating/` covering the census and a stub skip with its index row (`.skilled/skills/sk-communication/`). REQ-014
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T016 Tests: `node --test` on T exits 0 with at least 18 passed and 0 failed, covering every case REQ-013 lists (T). REQ-013
- [ ] T017 Zero-call census on the three committed runs and their six replies directories, stub binaries first on `PATH`. Expect `masked: 42`, `distinct: 38`, `matched: 38` and the label gate line. Record the counts and the baseline in `goal.md`'s log
- [ ] T018 [B] Past the label gate only: one live `--deem --out <dir>` run. Record the verdict line, the commit pair, the report path and p50 and p95 in `goal.md`'s log for the parent goal's log. Waits on 20 graded replies from the operator
- [ ] T019 [B] Only when the operator passes `--jev`: one `--jev --out <dir>` run, recorded the same way with provider and model. The build never waits for the flag
- [ ] T020 `git status --porcelain` matches T002's after every run, and `grep -nE 'API_KEY|TYPESAFE|Bearer|Authorization'` on S prints nothing. REQ-008
- [ ] T021 `python3 .skilled/skills/sk-doc/scripts/validate_document.py` exits 0 on every doc T014 and T015 changed. REQ-014
- [ ] T022 Cross-family review of S and T leaves no open P0 or P1 finding, P2 findings recorded (parent goal D5). Then the parent orchestrator commits with path-scoped commits
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`, or the phase closes at its label gate with T018 and T019 left `[B]` and listed in `implementation-summary.md` as waiting on the operator's grades
- [ ] No `[B]` blocked task remains other than those two
- [ ] Manual verification passed: the zero-call census ran on the committed runs with stub binaries first on `PATH`
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
