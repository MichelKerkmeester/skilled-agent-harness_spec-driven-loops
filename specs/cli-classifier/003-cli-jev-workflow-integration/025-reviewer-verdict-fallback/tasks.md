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

M below is `.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark`, S is `M/lib/score-verdict-fallback.cjs` and T is `M/tests/verdict-fallback.vitest.ts`. Vitest commands run from `.skilled/skills/system-deep-loop/deep-improvement/scripts`. Closure (2026-09-29): built and committed as `d657558a2e`. The build left no `scratch/w4-build/build-evidence.md`, so `SE` (`scratch/w4-session/session-evidence.md`) and its `notes.md` are the phase's build record, with the dispatch briefs in `scratch/w4-build/briefs/`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm the operator released this phase and that phase 024 is not building, since both edit deep-improvement's docs and `M/tests/README.md`. Parent goal D3, amended by the operator's "Bind and release", released this phase on 2026-09-29. Builds run in number order, and disjoint builds may run in parallel (parent `goal.md`). Evidence: the release is the build's stated precondition and the build ran under it; phase 024 is Complete (`024-hallucination-grader/spec.md` reads `Status | Complete`) and its build commit `fb3f9c0599` predates this build (`SE` section 1)
- [x] T002 Read the owner's contracts: `M/README.md`, `M/lib/README.md`, `M/tests/README.md`, `reviewer-scorer.cjs:67-205` and `:333-341`, `reviewer-schema.md` and `reviewer-regression.json`. Record the `npx vitest run model-benchmark/tests/` baseline (files, passed, failed) and the pre-run `git status --porcelain`. Route the code through sk-code's OpenCode route (`M/lib/`). Evidence: the baseline is recorded, `HEAD before this phase had 14 files and 205 tests`, and the pre-run and post-run `git status --porcelain` were equal; the design's section 1 premise table reopens every cited line in the reviewer scorer, its schema and the two workflow files, and every code brief routes through sk-code (`SE` sections 1 and 2)
- [x] T003 [P] Build the test fixtures inside T: a temporary profile with two reviewer fixtures, one recorded output with no verdict line, a labeled outputs file across the three verdicts, a report with one `none` case and stub `cli-deem` and `jev` scripts that log one line per call (T). Evidence: briefs c1 and c1b build the fixtures inside T, and T alone runs `Tests 31 passed (31)` (`SE` section 2)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Census: import `extractVerdict`, merge visible and hidden cases as `applyCase` (`reviewer-scorer.cjs:98-105`) does, replay each `reviewer_output`, count a case with no recorded output as `no recorded output` and never dispatch it, replay each `--outputs` row and count `per_test[].verdictMethod` in each `--reports` file. Print cases, hits and misses per source (S). REQ-002. Evidence: the default run with stub binaries first on `PATH` prints `fixture cases: 8 hits: 8 misses: 0`, and T pins the visible and hidden merge, the no-output case and the per-test `verdictMethod` counts (`SE` section 2; design section 3, tests 1, 2 and 5)
- [x] T005 Labels parser and gate: the JSONL shape, `pass`, `fail` or `block` only, `expectedVerdict` kept and never scored, the outputs file's SHA-256, `stop: fewer than 12 labeled regex-miss outputs` and `stop: no labeled <verdict> output` (S). REQ-003. Evidence: the default run prints `stop: fewer than 12 labeled regex-miss outputs`, and T pins the 11-row stop line, the missing `block` stop line and the bad-label row message; the exit-2 path itself is the recorded P2 (`SE` section 2; design section 3, tests 3, 4, 6 and 7)
- [x] T006 Baselines and zero-call output: the majority class, the loose rule and the baseline method with the loose rule winning a tie, `unknown` printed for reference, `margin: 0.10`, the `keep rule:` line, the power line, `no headroom` above 0.90 and `planned calls:`. No file written without `--out` (S). REQ-001. Evidence: the default run prints both baselines, `margin: 0.10`, the `keep rule:` line, the power line and the stop line, and T pins `no headroom`, `planned calls:` and the bare run that leaves the stub logs empty (`SE` section 2; design section 3, tests 6, 7, 10 and 11)
- [x] T007 Deem gate behind `--deem`: `cli-deem health` within 2,000 ms, the four skip lines, the "nothing leaves the machine" notice with planned calls and wall time (S). REQ-005, REQ-009. Evidence: `--deem --out <dir>` with a stub `cli-deem health` reporting backend `stub` exits 0 and adds only `deem arm skipped: stub backend`; T pins the health line and the four skip lines (`SE` section 2; design section 3, tests 12 and 13)
- [x] T008 Deem arm: the fixed `-q` and option descriptions printed verbatim with their SHA-256, three rotations per miss, the output on stdin and closed, modal pick and `unstable`, the Deem exit table and `calls.jsonl` lines with the commit pair (S). REQ-008, REQ-009. Evidence: T runs three fresh `cli-deem choice` calls per labeled miss on stub answers, one per order, and writes `calls.jsonl` lines with the commit pair; the review's P1 (the records dropped the picked key's probability) is closed by c11f and c11g, and the recheck prints `VERDICT: PASS` (`SE` section 3)
- [x] T009 Jev gate behind `--jev`: identity line, `command -v jev`, `jev --version` printing `jev 0.6.2`, `jev auth status --provider P`, the three skip lines, the payload class and the `--accept-payload` rule for an untracked outputs file (S). REQ-006, REQ-007. Evidence: `--jev --out <dir>` with a stub `auth status --provider official` exiting 3 exits 0 and adds only the identity line and `jev arm skipped: no credential`; T pins the version, credential and payload skips (`SE` section 2; design section 3, tests 14, 15 and 16)
- [x] T010 Jev arm: one `jev auth test --provider P`, then the same three orders per miss with no answer cache, the 90 s cap, the Jev exit table and `calls.jsonl` lines with version, provider and model (S). REQ-008, REQ-009. Evidence: T runs one `jev auth test --provider P` and the three orders per miss on stub answers with `calls.jsonl` lines holding version, provider and model; the live run waits on the operator (`SE` section 2; design section 3, tests 23 and the jev flips case)
- [x] T011 Verdict per column, exactly the spec's Keep Rule: coverage, kill, margin, sign test and flips in that order, integer counts and an exact p, the verdict line and `report.json` under `--out`, the requalify lines and `--out` required before any call (S). REQ-004, REQ-009, REQ-010. Evidence: T pins `keep`, `kill`, `stop (margin)`, `stop (coverage)` and `stop (flips)`, `report.json` and the requalify line under `--out`, and `--deem` without `--out` exiting 2 before any call; `--deem` without `--out` also exits 2 from the CLI with `--deem needs --out <dir> so every call is recorded` (`SE` section 2; design section 3, tests 17 to 22, 24 and 25)
- [x] T012 [P] READMEs: one row in `M/lib/README.md`, and the new test file with the suite counts in `M/tests/README.md`. Evidence: doc briefs d11 and d12 add the README rows; the review found 2 P1s in `lib/README.md` (the single-entrypoint and one-intra-lib-edge rows), closed by f1; the recheck prints `VERDICT: PASS` and `validate_document.py` exits 0 on both (`SE` sections 1 and 3)
- [x] T013 [P] Parent goal D6 docs through sk-doc: one sentence in `SKILL.md`, one line in `README.md`, the next changelog file, one catalog entry under `model-benchmark-mode/` with its index row, and one playbook scenario under `model-benchmark-mode/` with its index row (`.skilled/skills/system-deep-loop/deep-improvement/`). REQ-012. Evidence: doc briefs d13 to d19 write `SKILL.md` (version 1.19.0.0), `README.md`, `changelog/v1.19.0.0.md`, the catalog entry `feature-catalog/model-benchmark-mode/reviewer-verdict-fallback.md` with its index row, and the playbook scenario `manual-testing-playbook/model-benchmark-mode/verdict-fallback-census.md` (MB-052) with its index row; `validate_document.py` exits 0 on all nine docs; f2 adds the playbook's missing mentions and f3 clears the one new catalog warning, leaving `violations=36` with none in this phase's files (`SE` sections 1, 3 and 4)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T014 Tests: `npx vitest run model-benchmark/tests/verdict-fallback.vitest.ts` exits 0 with at least 16 passed and 0 failed, then the whole `model-benchmark/tests/` suite fails nothing beyond T002's baseline (T). REQ-011. Evidence: `npx vitest run model-benchmark/tests/verdict-fallback.vitest.ts` prints `Tests 31 passed (31)`, and `npx vitest run model-benchmark/tests/` prints `Test Files 15 passed (15)` and `Tests 236 passed (236)` against T002's baseline of 14 files and 205 tests; the whole deep-improvement suite's 46 `FAIL` names are identical to 024's baseline list (`SE` section 2)
- [x] T015 Zero-call census on today's fixtures with stub binaries first on `PATH`: expect `fixture cases: 8 hits: 8 misses: 0` and the gate line. Record them in `goal.md`'s log. Evidence: the default run prints `fixture cases: 8 hits: 8 misses: 0` and `stop: fewer than 12 labeled regex-miss outputs`, and neither stub log was written; recorded in `goal.md`'s log by this closure pass (`SE` section 2)
- [B] T016 Past the label gate only: one live `--deem --out <dir>` run on the operator's misses. Record the verdict line, the commit pair, the report path and p50 and p95 in `goal.md`'s log. Waits on 12 labeled misses from the operator. Open for the operator: no regex-miss output exists, so no labeled misses and no live `--deem` run; not part of this phase's completion (parent D4, `SE` section 6)
- [B] T017 Only when the operator passes `--jev`: one `--jev --out <dir>` run, recorded the same way with provider and model. The build never waits for the flag. Open for the operator: the labels, the `--jev` flag, `jev` 0.6.2 and a credential the `auth status` check resolves; not part of this phase's completion (parent D4, `SE` section 6)
- [x] T018 `git status --porcelain` matches T002's after every census and model run, and `grep -nE 'API_KEY|TYPESAFE|Bearer|Authorization'` on S prints nothing. REQ-007. Evidence: `git status --porcelain` was equal before and after every run, the key grep exits 1, and the comment hygiene checker exits 0 on the script and its test (`SE` section 2)
- [x] T019 `python3 .skilled/skills/sk-doc/scripts/validate_document.py` exits 0 on every doc T012 and T013 changed. REQ-012. Evidence: `validate_document.py` exits 0 on all nine changed docs, the catalog root with `--type feature_catalog` and the playbook root with `--type playbook` (`SE` section 3 and `logs/review-docs-ds.last.txt`)
- [x] T020 Cross-family review of S and T leaves no open P0 or P1 finding, P2 findings recorded (parent goal D5). Then the parent orchestrator commits with path-scoped commits. Evidence: the code review (Pi MiMo, 871 s) prints `VERDICT: FAIL` with 1 P1 and 3 P2; c11f and c11g close the P1 and the recheck prints `VERDICT: PASS`. The docs and step 6 review (DeepSeek on Cline, 354 s) prints `VERDICT: FAIL` with 2 P1 and 2 P2; f1 to f3 close them and the recheck prints `VERDICT: PASS`. The 4 remaining P2s are recorded in `goal.md`, and the commit `d657558a2e` holds 12 files, not pushed (`SE` sections 3 and 5)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`, or the phase closes at its label gate with T016 and T017 left `[B]` and listed in `implementation-summary.md` as waiting on the operator's labeled misses. Evidence: T001 to T015 and T018 to T020 are `[x]`, T016 and T017 stay `[B]` and listed, and the census prints `stop: fewer than 12 labeled regex-miss outputs` from the final state (parent D4)
- [x] No `[B]` blocked task remains other than those two. Evidence: this closure pass
- [x] Manual verification passed: the zero-call census ran on today's fixtures with stub binaries first on `PATH`. Evidence: the default run printed `fixture cases: 8 hits: 8 misses: 0` and the stop line with both stub logs unwritten, rerun by the session from the final state (`SE` section 2)
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
