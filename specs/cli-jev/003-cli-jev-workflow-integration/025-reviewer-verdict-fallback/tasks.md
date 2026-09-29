---
title: "Tasks: Phase 25: reviewer-verdict-fallback"
description: "Ordered tasks for the reviewer verdict fallback test: setup and baselines, the zero-call regex-miss census and label gate, the Deem and Jev choice arms with their verdicts, the deep-improvement docs and the gated live runs."
trigger_phrases:
  - "reviewer verdict fallback tasks"
  - "score-verdict-fallback tasks"
  - "regex miss census tasks"
  - "reviewer fallback label gate"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 25: reviewer-verdict-fallback

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

M below is `.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark`, S is `M/lib/score-verdict-fallback.cjs` and T is `M/tests/verdict-fallback.vitest.ts`. Vitest commands run from `.skilled/skills/system-deep-loop/deep-improvement/scripts`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Confirm the operator released this phase and that phase 024 is not building, since both edit deep-improvement's docs and `M/tests/README.md`. Parent goal D3, amended by the operator's "Bind and release", released this phase on 2026-09-29. Builds run in number order, and disjoint builds may run in parallel (parent `goal.md`)
- [ ] T002 Read the owner's contracts: `M/README.md`, `M/lib/README.md`, `M/tests/README.md`, `reviewer-scorer.cjs:67-205` and `:333-341`, `reviewer-schema.md` and `reviewer-regression.json`. Record the `npx vitest run model-benchmark/tests/` baseline (files, passed, failed) and the pre-run `git status --porcelain`. Route the code through sk-code's OpenCode route (`M/lib/`)
- [ ] T003 [P] Build the test fixtures inside T: a temporary profile with two reviewer fixtures, one recorded output with no verdict line, a labeled outputs file across the three verdicts, a report with one `none` case and stub `cli-deem` and `jev` scripts that log one line per call (T)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Census: import `extractVerdict`, merge visible and hidden cases as `applyCase` (`reviewer-scorer.cjs:98-105`) does, replay each `reviewer_output`, count a case with no recorded output as `no recorded output` and never dispatch it, replay each `--outputs` row and count `per_test[].verdictMethod` in each `--reports` file. Print cases, hits and misses per source (S). REQ-002
- [ ] T005 Labels parser and gate: the JSONL shape, `pass`, `fail` or `block` only, `expectedVerdict` kept and never scored, the outputs file's SHA-256, `stop: fewer than 12 labeled regex-miss outputs` and `stop: no labeled <verdict> output` (S). REQ-003
- [ ] T006 Baselines and zero-call output: the majority class, the loose rule and the baseline method with the loose rule winning a tie, `unknown` printed for reference, `margin: 0.10`, the `keep rule:` line, the power line, `no headroom` above 0.90 and `planned calls:`. No file written without `--out` (S). REQ-001
- [ ] T007 Deem gate behind `--deem`: `cli-deem health` within 2,000 ms, the four skip lines, the "nothing leaves the machine" notice with planned calls and wall time (S). REQ-005, REQ-009
- [ ] T008 Deem arm: the fixed `-q` and option descriptions printed verbatim with their SHA-256, three rotations per miss, the output on stdin and closed, modal pick and `unstable`, the Deem exit table and `calls.jsonl` lines with the commit pair (S). REQ-008, REQ-009
- [ ] T009 Jev gate behind `--jev`: identity line, `command -v jev`, `jev --version` printing `jev 0.6.2`, `jev auth status --provider P`, the three skip lines, the payload class and the `--accept-payload` rule for an untracked outputs file (S). REQ-006, REQ-007
- [ ] T010 Jev arm: one `jev auth test --provider P`, then the same three orders per miss with no answer cache, the 90 s cap, the Jev exit table and `calls.jsonl` lines with version, provider and model (S). REQ-008, REQ-009
- [ ] T011 Verdict per column, exactly the spec's Keep Rule: coverage, kill, margin, sign test and flips in that order, integer counts and an exact p, the verdict line and `report.json` under `--out`, the requalify lines and `--out` required before any call (S). REQ-004, REQ-009, REQ-010
- [ ] T012 [P] READMEs: one row in `M/lib/README.md`, and the new test file with the suite counts in `M/tests/README.md`
- [ ] T013 [P] Parent goal D6 docs through sk-doc: one sentence in `SKILL.md`, one line in `README.md`, the next changelog file, one catalog entry under `model-benchmark-mode/` with its index row, and one playbook scenario under `model-benchmark-mode/` with its index row (`.skilled/skills/system-deep-loop/deep-improvement/`). REQ-012
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T014 Tests: `npx vitest run model-benchmark/tests/verdict-fallback.vitest.ts` exits 0 with at least 16 passed and 0 failed, then the whole `model-benchmark/tests/` suite fails nothing beyond T002's baseline (T). REQ-011
- [ ] T015 Zero-call census on today's fixtures with stub binaries first on `PATH`: expect `fixture cases: 8 hits: 8 misses: 0` and the gate line. Record them in `goal.md`'s log
- [ ] T016 [B] Past the label gate only: one live `--deem --out <dir>` run on the operator's misses. Record the verdict line, the commit pair, the report path and p50 and p95 in `goal.md`'s log. Waits on 12 labeled misses from the operator
- [ ] T017 [B] Only when the operator passes `--jev`: one `--jev --out <dir>` run, recorded the same way with provider and model. The build never waits for the flag
- [ ] T018 `git status --porcelain` matches T002's after every census and model run, and `grep -nE 'API_KEY|TYPESAFE|Bearer|Authorization'` on S prints nothing. REQ-007
- [ ] T019 `python3 .skilled/skills/sk-doc/scripts/validate_document.py` exits 0 on every doc T012 and T013 changed. REQ-012
- [ ] T020 Cross-family review of S and T leaves no open P0 or P1 finding, P2 findings recorded (parent goal D5). Then the parent orchestrator commits with path-scoped commits
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`, or the phase closes at its label gate with T016 and T017 left `[B]` and listed in `implementation-summary.md` as waiting on the operator's labeled misses
- [ ] No `[B]` blocked task remains other than those two
- [ ] Manual verification passed: the zero-call census ran on today's fixtures with stub binaries first on `PATH`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Goal**: See `goal.md`
- **Research record**: R5 and open question 6 in `../001-deep-research/research/research.md` sections 11 and 12, carried by `../007-classifier-deep-research/research/research.md` sections 12 and 13
<!-- /ANCHOR:cross-refs -->

---
