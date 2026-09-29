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

M below is `.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark`, S is `M/scorer/score-d4-agreement.cjs` and T is `M/tests/d4-agreement.vitest.ts`. Vitest commands run from `.skilled/skills/system-deep-loop/deep-improvement/scripts`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Confirm the operator released this phase and that phase 025 is not building, since both edit deep-improvement's docs and `M/tests/README.md`. Parent goal D3, amended by the operator's "Bind and release", released this phase on 2026-09-29. Builds run in number order, and disjoint builds may run in parallel (parent `goal.md`)
- [ ] T002 Read the owner's contracts: `M/README.md`, `M/scorer/README.md`, `M/tests/README.md`, `run-benchmark.cjs:560-584`, `score-model-variant.cjs:207-226` and `:232-305`, and `scorer/deterministic/hallucination-flag.cjs`. Record the `npx vitest run model-benchmark/tests/` baseline (files, passed, failed) and the pre-run `git status --porcelain`. Route the code through sk-code's OpenCode route (`M/`)
- [ ] T003 [P] Build the test fixtures inside T: three fixtures, one with an `allowlist`, one output per fixture plus one with no fixture, a labels file and stub `cli-deem` and `jev` scripts that log one line per call (T)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Census: list `<id>.md` and `<id>.run<k>.md` under `--outputs`, map each to `<id>.json` under `--fixtures` (default `benchmark-fixtures/`), print outputs, matched, unmatched and `allowlist: <n> of <fixtures>` (S). REQ-003
- [ ] T005 Deterministic baseline: a temporary virtual fixture with the fixture's `allowlist` or `{}`, one spawn of `hallucination-flag.cjs` per labeled output, a score below 1.0 read as `yes`, and exit 2 naming the output when the spawn fails or its JSON does not parse, never a default score (S). REQ-003
- [ ] T006 Labels parser and gate: the JSONL shape, `yes` or `no` only, the labels SHA-256, `stop: fewer than 30 labeled outputs` and `stop: fewer than 5 labeled <yes|no> outputs` (S). REQ-004
- [ ] T007 Zero-call output: the baseline method (deterministic check or majority class, the check on a tie) and its accuracy, `margin: 0.10`, the `keep rule:` line, the power line, `no headroom` above 0.90 and `planned calls:`. No file written without `--out` (S). REQ-002
- [ ] T008 Negative control, then the fallback fix. First run `node M/run-benchmark.cjs --profile default --outputs-dir <tmp> --scorer 5dim --grader jev` and record that it runs with mock D4 scores. Then add the guard after `run-benchmark.cjs:577` (exit 2, a message naming the value and the usage line, before the profile loads) and the throw in `buildGraderFn` for a kind outside `noop`, `mock` and `llm` (`M/run-benchmark.cjs`, `M/scorer/score-model-variant.cjs`). REQ-001
- [ ] T009 One case in `M/tests/run-benchmark-hardening.vitest.ts` for the exit 2 and one in `M/tests/scorer.vitest.ts` for the throw. REQ-001
- [ ] T010 Deem gate behind `--deem`: `cli-deem health` within 2,000 ms, the four skip lines, the "nothing leaves the machine" notice with planned calls and wall time (S). REQ-006, REQ-010
- [ ] T011 Deem arm: one `cli-deem noul` per output with the fixed `-q` printed verbatim first, the state on stdin and closed, the 0.5 threshold, the Deem exit table and `calls.jsonl` lines with the commit pair (S). REQ-009, REQ-010, REQ-012
- [ ] T012 Jev gate behind `--jev`: identity line, `command -v jev`, `jev --version` printing `jev 0.6.2`, `jev auth status --provider P`, the three skip lines, the payload class and the `--accept-payload` rule for untracked outputs (S). REQ-007, REQ-008
- [ ] T013 Jev arm: one `jev auth test --provider P`, then three `jev noul --provider P` per output with no answer cache, the 90 s cap, the Jev exit table and `calls.jsonl` lines with version, provider and model (S). REQ-009, REQ-010
- [ ] T014 Verdict per column, exactly the spec's Keep Rule: coverage, kill, margin, sign test and flips in that order, integer counts and an exact p, the verdict line and `report.json` under `--out`, the requalify lines and `--out` required before any call (S). REQ-005, REQ-010, REQ-011
- [ ] T015 [P] READMEs: one row in `M/scorer/README.md`, and the new test file with the suite counts in `M/tests/README.md`
- [ ] T016 [P] Parent goal D6 docs through sk-doc: the scoring line at `SKILL.md:222` and one new sentence, one line in `README.md`, the next changelog file, one catalog entry under `scoring-system/` with its index row, the grader paragraph of `model-benchmark-mode/opt-in-5dim-scorer.md`, and one playbook scenario under `five-d-scorer/` with its index row (`.skilled/skills/system-deep-loop/deep-improvement/`). REQ-014
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T017 Tests: `npx vitest run model-benchmark/tests/d4-agreement.vitest.ts model-benchmark/tests/run-benchmark-hardening.vitest.ts model-benchmark/tests/scorer.vitest.ts` exits 0 with at least 16 new passing cases and 0 failed, then the whole `model-benchmark/tests/` suite fails nothing beyond T002's baseline (T). REQ-013
- [ ] T018 After the fix, the T008 command exits 2 and prints the usage line, and `--grader noop` exits as it did at T002. Record both in `goal.md`'s log. REQ-001
- [ ] T019 Zero-call census on the fixture outputs, stub binaries first on `PATH`: record the counts, `allowlist: 0 of 21` on the real fixtures and the gate line in `goal.md`'s log
- [ ] T020 [B] Past the label gate only: one live `--deem --out <dir>` run on the operator's outputs. Record the verdict line, the commit pair, the report path and p50 and p95 in `goal.md`'s log. Waits on 30 labeled outputs from the operator
- [ ] T021 [B] Only when the operator passes `--jev`: one `--jev --out <dir>` run, recorded the same way with provider and model. The build never waits for the flag
- [ ] T022 `git status --porcelain` matches T002's after every census and model run, and `grep -nE 'API_KEY|TYPESAFE|Bearer|Authorization'` on S prints nothing. REQ-008
- [ ] T023 `python3 .skilled/skills/sk-doc/scripts/validate_document.py` exits 0 on every doc T015 and T016 changed. REQ-014
- [ ] T024 Cross-family review of the guard, the throw, S and T leaves no open P0 or P1 finding, P2 findings recorded (parent goal D5). Then the parent orchestrator commits with path-scoped commits
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`, or the phase closes at its label gate with T020 and T021 left `[B]` and listed in `implementation-summary.md` as waiting on the operator's labels
- [ ] No `[B]` blocked task remains other than those two
- [ ] Manual verification passed: the unknown-grader exit and the zero-call census ran with stub binaries first on `PATH`
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
