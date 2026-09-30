---
title: "Tasks: Phase 24: hallucination-grader"
description: "Ordered tasks for the D4 hallucination grader test: setup and baselines, the zero-call census and label gate, the unknown-grader startup check, the Deem and Jev arms with their verdicts, the deep-improvement docs and the gated live runs."
trigger_phrases:
  - "hallucination grader tasks"
  - "score-d4-agreement tasks"
  - "grader startup check tasks"
  - "d4 label gate"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 24: hallucination-grader

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

M below is `.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark`, S is `M/scorer/score-d4-agreement.cjs` and T is `M/tests/d4-agreement.vitest.ts`. Vitest commands run from `.skilled/skills/system-deep-loop/deep-improvement/scripts`. Closure (2026-09-29): built and committed as `fb3f9c0599`. The build orchestrator left no `scratch/w4-build/build-evidence.md`, so `SE` (`scratch/w4-session/session-evidence.md`) is the phase's build record, with the dispatch briefs in `scratch/w4-build/briefs/` and the pre-build baselines in `scratch/w4-build/baseline/`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm the operator released this phase and that phase 025 is not building, since both edit deep-improvement's docs and `M/tests/README.md`. Parent goal D3, amended by the operator's "Bind and release", released this phase on 2026-09-29. Builds run in number order, and disjoint builds may run in parallel (parent `goal.md`). Evidence: the release is the build's stated precondition and the build ran under it (`SE` section 1); phase 025 remains unbuilt, its `implementation-summary.md` still reading "Nothing is built yet", confirmed by this closure pass
- [x] T002 Read the owner's contracts: `M/README.md`, `M/scorer/README.md`, `M/tests/README.md`, `run-benchmark.cjs:560-584`, `score-model-variant.cjs:207-226` and `:232-305`, and `scorer/deterministic/hallucination-flag.cjs`. Record the `npx vitest run model-benchmark/tests/` baseline (files, passed, failed) and the pre-run `git status --porcelain`. Route the code through sk-code's OpenCode route (`M/`). Evidence: `scratch/w4-build/baseline/` holds `vitest-model-benchmark-before.txt` (`Test Files 13 passed (13)`, `Tests 171 passed (171)`) and `git-status-before.txt` (2 lines) beside the deep-improvement and doc baselines, and every code brief routes through sk-code (`SE` section 1)
- [x] T003 [P] Build the test fixtures inside T: three fixtures, one with an `allowlist`, one output per fixture plus one with no fixture, a labels file and stub `cli-deem` and `jev` scripts that log one line per call (T). Evidence: briefs 03 to 12 built the fixtures, the labels file and the logging stubs inside T, and T alone runs `Tests 32 passed (32)` (`SE` section 2, proof 4)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Census: list `<id>.md` and `<id>.run<k>.md` under `--outputs`, map each to `<id>.json` under `--fixtures` (default `benchmark-fixtures/`), print outputs, matched, unmatched and `allowlist: <n> of <fixtures>` (S). REQ-003. Evidence: brief 03. `node S --outputs <dir>` prints `outputs: 21`, `matched: 21`, `unmatched: 0`, `allowlist: 0 of 21`, and the boundary with one output named `no-such-fixture.md` prints `outputs: 22`, `matched: 21`, `unmatched: 1` (`SE` section 2, proof 2)
- [x] T005 Deterministic baseline: a temporary virtual fixture with the fixture's `allowlist` or `{}`, one spawn of `hallucination-flag.cjs` per labeled output, a score below 1.0 read as `yes`, and exit 2 naming the output when the spawn fails or its JSON does not parse, never a default score (S). REQ-003. Evidence: brief 05. The run prints the `baseline check:`, `baseline majority:` and `baseline method:` lines, and T pins an unlisted flag reading `yes`, an allowlisted flag reading `no` and the check-on-tie and majority rules (`SE` section 2, proofs 2 and 4)
- [x] T006 Labels parser and gate: the JSONL shape, `yes` or `no` only, the labels SHA-256, `stop: fewer than 30 labeled outputs` and `stop: fewer than 5 labeled <yes|no> outputs` (S). REQ-004. Evidence: brief 04. The run prints `labels: none` and `stop: fewer than 30 labeled outputs`, and T pins `labels row 1: hallucinated must be yes or no, got "maybe"`, the duplicate and name errors and the class-gate stop lines (`SE` section 2, proofs 2 and 4)
- [x] T007 Zero-call output: the baseline method (deterministic check or majority class, the check on a tie) and its accuracy, `margin: 0.10`, the `keep rule:` line, the power line, `no headroom` above 0.90 and `planned calls:`. No file written without `--out` (S). REQ-002. Evidence: brief 07. The run prints `margin: 0.10`, the `keep rule:` line, the power line and `stop: fewer than 30 labeled outputs`, writes no file and leaves both stub logs empty, and T pins `no headroom` and `planned calls: jev 91, deem 30` (`SE` section 2, proofs 2 and 4)
- [x] T008 Negative control, then the fallback fix. First run `node M/run-benchmark.cjs --profile default --outputs-dir <tmp> --scorer 5dim --grader jev` and record that it runs with mock D4 scores. Then add the guard after `run-benchmark.cjs:577` (exit 2, a message naming the value and the usage line, before the profile loads) and the throw in `buildGraderFn` for a kind outside `noop`, `mock` and `llm` (`M/run-benchmark.cjs`, `M/scorer/score-model-variant.cjs`). REQ-001. Evidence: briefs 01 and 02 add the guard and the throw, and the session reruns both from the final state: exit 2 with `run-benchmark: unknown --grader 'jev' (expected noop, mock or llm)` and the usage line before any profile load (`SE` section 2, proof 1). The pre-fix negative-control run was never recorded, because the build orchestrator left no `build-evidence.md`; this closure pass confirms the pre-fix behavior by reading `fb3f9c0599^`'s files, where `run-benchmark.cjs` holds no `VALID_GRADERS` (grep count 0) and `buildGraderFn` falls through to `mode = graderKind === 'llm' ? 'real' : 'mock'`, so `--grader jev` scored with the mock stub
- [x] T009 One case in `M/tests/run-benchmark-hardening.vitest.ts` for the exit 2 and one in `M/tests/scorer.vitest.ts` for the throw. REQ-001. Evidence: briefs 01 and 02 add `describe('unknown grader kind')` and the throw case, both passing in the green suite (`SE` section 2, proof 4)
- [x] T010 Deem gate behind `--deem`: `cli-deem health` within 2,000 ms, the four skip lines, the "nothing leaves the machine" notice with planned calls and wall time (S). REQ-006, REQ-010. Evidence: brief 08. `--deem` with a stub health reporting backend `stub` prints `deem arm skipped: stub backend` and exits 0 (`SE` section 2, proof 3), and T pins the health line, the four skip lines and the notice (`SE` section 2, proof 4)
- [x] T011 Deem arm: one `cli-deem noul` per output with the fixed `-q` printed verbatim first, the state on stdin and closed, the 0.5 threshold, the Deem exit table and `calls.jsonl` lines with the commit pair (S). REQ-009, REQ-010, REQ-012. Evidence: brief 11. T runs one `cli-deem noul` per labeled output on stub answers, prints `verdict deem: keep ...` and writes 30 `calls.jsonl` lines each holding `modelId`, `modelCommit` and `sourceCommit`; the live run waits at T020 (`SE` section 2, proof 4)
- [x] T012 Jev gate behind `--jev`: identity line, `command -v jev`, `jev --version` printing `jev 0.6.2`, `jev auth status --provider P`, the three skip lines, the payload class and the `--accept-payload` rule for untracked outputs (S). REQ-007, REQ-008. Evidence: brief 09. `--jev` with a stub whose `auth status` exits 3 prints `jev: path=<stub>/jev provider=official` then `jev arm skipped: no credential`, exit 0, and the stub log holds only `cli-deem health`, `jev --version` and `jev auth status --provider official` (`SE` section 2, proof 3)
- [x] T013 Jev arm: one `jev auth test --provider P`, then three `jev noul --provider P` per output with no answer cache, the 90 s cap, the Jev exit table and `calls.jsonl` lines with version, provider and model (S). REQ-009, REQ-010. Evidence: brief 12. T runs one `jev auth test` and three reruns per output on stub answers with `calls.jsonl` lines holding `jevVersion`, `provider` and `model`; the live run waits at T021 (`SE` section 2, proof 4)
- [x] T014 Verdict per column, exactly the spec's Keep Rule: coverage, kill, margin, sign test and flips in that order, integer counts and an exact p, the verdict line and `report.json` under `--out`, the requalify lines and `--out` required before any call (S). REQ-005, REQ-010, REQ-011. Evidence: briefs 10 to 12. T pins `keep`, `kill`, `stop (margin)`, `stop (coverage)` and a Jev `stop (flips)` with exact p values, `report.json` under `--out`, the `requalify: model commit changed` case, and `--deem` without `--out` exiting 2 before any call (`SE` section 2, proof 4)
- [x] T015 [P] READMEs: one row in `M/scorer/README.md`, and the new test file with the suite counts in `M/tests/README.md`. Evidence: doc briefs e3 and e4 write the scorer README tree line and table row and the tests README file row and totals, 158 across 12 to 205 across 14 (`SE` section 1). The review found P2s in these rows: the `d4-agreement.vitest.ts` count cell is empty (32) and two sibling counts are stale, recorded in `goal.md`'s log (`SE` section 3)
- [x] T016 [P] Parent goal D6 docs through sk-doc: the scoring line at `SKILL.md:222` and one new sentence, one line in `README.md`, the next changelog file, one catalog entry under `scoring-system/` with its index row, the grader paragraph of `model-benchmark-mode/opt-in-5dim-scorer.md`, and one playbook scenario under `five-d-scorer/` with its index row (`.skilled/skills/system-deep-loop/deep-improvement/`). REQ-014. Evidence: briefs 14 to 19 create `changelog/v1.18.0.0.md`, the catalog entry `scoring-system/hallucination-grader-agreement.md` with its index rows, the grader sentence of `model-benchmark-mode/opt-in-5dim-scorer.md` and the playbook scenario `five-d-scorer/unknown-grader-and-d4-census.md` with its index rows, and doc briefs e1 and e2 finish `SKILL.md` (version 1.17.2.0 to 1.18.0.0) and `README.md`. `validate_document.py` exits 0 on all 10 changed docs (`SE` sections 1 and 2). The review found P2s in `SKILL.md:222` and `README.md:108`, recorded in `goal.md`'s log (`SE` section 3)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T017 Tests: `npx vitest run model-benchmark/tests/d4-agreement.vitest.ts model-benchmark/tests/run-benchmark-hardening.vitest.ts model-benchmark/tests/scorer.vitest.ts` exits 0 with at least 16 new passing cases and 0 failed, then the whole `model-benchmark/tests/` suite fails nothing beyond T002's baseline (T). REQ-013. Evidence: `npx vitest run model-benchmark/tests/` prints `Test Files 14 passed (14)`, `Tests 205 passed (205)` against T002's baseline `13 passed`, `171 passed`, and T alone `Tests 32 passed (32)` where REQ-013 asks for at least 16; the whole deep-improvement suite's 46 `FAIL` lines are identical to `baseline/full-suite-fail-names-before.txt` (`diff` empty) (`SE` section 2, proof 4)
- [x] T018 After the fix, the T008 command exits 2 and prints the usage line, and `--grader noop` exits as it did at T002. Record both in `goal.md`'s log. REQ-001. Evidence: from the final state `node M/run-benchmark.cjs --profile default --outputs-dir <empty dir> --scorer 5dim --grader jev` exits 2 with `run-benchmark: unknown --grader 'jev' (expected noop, mock or llm)` and the usage line, and the same with `--grader noop --output <scratch file>` exits 0; both recorded in `goal.md`'s log by this closure pass (`SE` section 2, proof 1)
- [x] T019 Zero-call census on the fixture outputs, stub binaries first on `PATH`: record the counts, `allowlist: 0 of 21` on the real fixtures and the gate line in `goal.md`'s log. Evidence: `node S --outputs <dir>` with one output per fixture exits 0 with `outputs: 21`, `matched: 21`, `unmatched: 0`, `allowlist: 0 of 21`, `labels: none`, the baseline lines, `margin: 0.10`, the keep-rule line, the power line and `stop: fewer than 30 labeled outputs`, the stub call log never created; recorded in `goal.md`'s log by this closure pass (`SE` section 2, proof 2)
- [B] T020 Past the label gate only: one live `--deem --out <dir>` run on the operator's outputs. Record the verdict line, the commit pair, the report path and p50 and p95 in `goal.md`'s log. Waits on 30 labeled outputs from the operator. Open for the operator: no output carries a label, so the scorer stops at `stop: fewer than 30 labeled outputs` and no arm calls. Not part of this phase's completion (parent D4, `SE` section 5)
- [B] T021 Only when the operator passes `--jev`: one `--jev --out <dir>` run, recorded the same way with provider and model. The build never waits for the flag. Open for the operator: the `--jev` flag and the labels, plus `jev` 0.6.2 and a credential `jev auth status --provider P` resolves. Not part of this phase's completion (parent D4, `SE` section 5)
- [x] T022 `git status --porcelain` matches T002's after every census and model run, and `grep -nE 'API_KEY|TYPESAFE|Bearer|Authorization'` on S prints nothing. REQ-008. Evidence: `git status --porcelain` is equal before and after the census runs, and the grep on S exits 1 (`SE` section 2, proof 5)
- [x] T023 `python3 .skilled/skills/sk-doc/scripts/validate_document.py` exits 0 on every doc T015 and T016 changed. REQ-014. Evidence: exit 0 on all 10 changed docs (`SE` section 2)
- [x] T024 Cross-family review of the guard, the throw, S and T leaves no open P0 or P1 finding, P2 findings recorded (parent goal D5). Then the parent orchestrator commits with path-scoped commits. Evidence: Pi MiMo on the code `VERDICT: PASS` (870 s) with 1 P2, Devin DeepSeek on the docs `VERDICT: PASS` (523 s) with 2 P2, both marking REQ-001 to REQ-014 met and Devin running playbook scenario 5D-051 end to end; 4 P2 findings recorded and not chased (parent D5). Committed as `fb3f9c0599`, 17 files (`SE` sections 3 and 4)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`, or the phase closes at its label gate with T020 and T021 left `[B]` and listed in `implementation-summary.md` as waiting on the operator's labels. Evidence: T001 to T019 and T022 to T024 are `[x]`, T020 and T021 stay `[B]` and `implementation-summary.md` lists them, and S prints `stop: fewer than 30 labeled outputs` from the final state (parent D4)
- [x] No `[B]` blocked task remains other than those two. Evidence: this closure pass
- [x] Manual verification passed: the unknown-grader exit and the zero-call census ran with stub binaries first on `PATH`. Evidence: proofs 1 and 2, rerun by the session from the final state (`SE` section 2)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Goal**: See `goal.md`
- **Research record**: R7 in `../001-deep-research/research/research.md` section 11, carried by `../004-deep-research-expansion/research/research.md` section 11 and `../007-classifier-deep-research/research/research.md` section 12
<!-- /ANCHOR:cross-refs -->

---
