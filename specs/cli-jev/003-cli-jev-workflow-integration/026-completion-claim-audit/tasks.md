---
title: "Tasks: Phase 26: completion-claim-audit"
description: "Ordered tasks for the completion claim audit: setup and fixtures, the zero-call census with per-word counts and label gate, the Deem and Jev noul arms with their verdicts, the system-spec-kit docs and the gated live runs."
trigger_phrases:
  - "completion claim audit tasks"
  - "score-completion-claims tasks"
  - "completion claim census tasks"
  - "completion claim label gate"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 26: completion-claim-audit

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

R below is `.skilled/skills/system-spec-kit/runtime`, S is `R/scripts/completion-claim-audit/score-completion-claims.mjs` and T is `R/tests/completion-claim-audit.vitest.ts`. Vitest commands run from R. F is phase 003's fixture `.skilled/hooks/goal/lib/verifier-labeled-set.jsonl`.
Closure (2026-09-29): built and committed as `1a0fb2ea33`. The build left no `scratch/w4-build/build-evidence.md`, so `SE` (`scratch/w4-session/session-evidence.md`) and its `notes.md` are the phase's build record, with the dispatch briefs in `scratch/w4-build/briefs/`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm the operator released this phase. Parent goal D3, amended by the operator's "Bind and release", released it on 2026-09-29. Builds run in number order, and disjoint builds may run in parallel (parent `goal.md`). Evidence: the build ran under the release; the build commit `1a0fb2ea33` sits directly on phase 025's build commit `d657558a2e`, and phase 025 reads `Status | Complete` (`025-reviewer-verdict-fallback/spec.md`; `git log` at this closure pass)
- [x] T002 Read the owner's contracts: `R/scripts/README.md`, `R/lib/hooks/completion-evidence-sentinel.cjs:55-120` and its exports at `:553-578`, `R/hooks/claude/completion-evidence-stop.cjs` and `R/scripts/compaction-recall/score-compaction-recall.mjs`. Record the `npx vitest run tests/completion-evidence-sentinel.vitest.ts tests/hook-completion-evidence-stop.vitest.ts tests/completion-evidence-pi-extension.vitest.ts` baseline (files, passed, failed) and the pre-run `git status --porcelain`. Route the code through sk-code's OpenCode route. Evidence: the design's section 1 premise table reopens every cited line at the worktree HEAD and marks each `ok`; the recorded baseline is the runtime root suite, 108 files and 1,305 tests before against 109 files and 1,328 tests after, with the same failing-name list, and `git status --porcelain` was equal before and after; every code brief carries the sk-code route (`SE` section 2; design section 1)
- [x] T003 [P] Build synthetic fixtures in `R/tests/completion-claim-audit-fixtures/`: rows with claims inside and outside the tail, one per pattern word, false-fire and missed-claim turns, a labels file across both classes and stub `cli-deem` and `jev` scripts that log one line per call. No real conversation text. Evidence: the 13 fixture files hold synthetic text only, and the test file builds stub `cli-deem` and `jev` binaries in a temp directory that log one line per call; the commit `1a0fb2ea33` holds all 13 (`SE` section 5; design section 3)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Census: load `detectCompletionClaim` and `COMPLETION_CLAIM_PATTERN` from the sentinel through `createRequire`, run the detector on each row's `raw_text`, record the first pattern word in each fired row's 400-character tail and print `rows:`, `fires:` and one count per word. No row text in any output (S). REQ-002. Evidence: the default run prints `rows: 50 fires: 4` and the per-word line, and T pins the census happy and edge cases and the per-word split (`SE` section 2; design section 3, tests 1 to 4)
- [x] T005 Labels parser and gate: the JSONL shape, `claim` of `yes` or `no` only, unknown ids exit 2 naming the row, the labels file's SHA-256, `stop: fewer than 30 labeled rows` and `stop: fewer than 5 labeled <yes|no> rows` (S). REQ-004. Evidence: the default run prints `stop: fewer than 30 labeled rows`, and T pins the `labels happy`, `labels edge (unknown id)`, `labels edge (bad value)` and `class gate edge` cases (`SE` section 2; design section 3)
- [x] T006 Regex errors and zero-call output: false fires and missed claims with their per-word split, the regex's accuracy, `margin: 0.10`, the `keep rule:` line, the power line, `no headroom` above 0.90 and `planned calls:`. No file written without `--out` (S). REQ-001, REQ-003. Evidence: the default run prints `margin: 0.10`, the `keep rule:` line, the power line and the stop line with both stub logs unwritten, and T pins `headroom edge`, the `planned calls:` gate and the `default run` case that finds no fixture text on stdout (`SE` section 2; design section 3)
- [x] T007 Deem gate behind `--deem`: `cli-deem health` within 2,000 ms, the four skip lines, the "nothing leaves the machine" notice with planned calls and wall time at 60.5 ms per call (S). REQ-006, REQ-010. Evidence: `--deem --out <dir>` with a stub `cli-deem health` reporting backend `stub` exits 0 and adds only `deem arm skipped: stub backend`, and T pins the health line and the four skip reasons (`SE` section 2; design section 3)
- [x] T008 Deem arm: the fixed `-q` printed verbatim, one `noul` per labeled row with the tail on stdin and closed, 0.5 as the `yes` threshold, the Deem exit table and `calls.jsonl` lines with the commit pair (S). REQ-009, REQ-010. Evidence: T runs one `cli-deem noul` per labeled row on stub answers, asserts the 0.5 threshold, and reads `calls.jsonl` records holding `wallMs`, `exitCode`, `modelId`, `modelCommit` and `sourceCommit`; the live run waits at the label gate (`SE` sections 2 and 6; design section 3)
- [x] T009 Jev gate behind `--jev`: identity line, `command -v jev`, `jev --version` printing `jev 0.6.2`, `jev auth status --provider P`, the three skip lines, `--accept-payload` with `jev arm skipped: payload not accepted` and the payload class and token estimate (S). REQ-007, REQ-008. Evidence: `--jev --out <dir>` with a stub `auth status` exiting 3 exits 0 and adds only the identity line and `jev arm skipped: no credential`; T pins the pinned-version and credential skips and the `payload gate edge` case, and the build's runs record the payload skip line (`SE` section 2; `scratch/w4-session/docs/facts.txt`)
- [x] T010 Jev arm: one `jev auth test --provider P`, then three `noul` calls per row with no answer cache, the modal call, the Jev exit table and `calls.jsonl` lines with version, provider and model (S). REQ-009, REQ-010. Evidence: T runs one `jev auth test --provider P` and three `noul` calls per row with the modal call and no cache, and reaches `verdict jev: stop (flips)` with `F=30`; the live run waits at the label gate (`SE` section 6; design section 3)
- [x] T011 Verdict per column, exactly the spec's Keep Rule: coverage, kill, margin, sign test and flips in that order, `flips: n/a (commit pair)` for Deem, integer counts and an exact p, the verdict line and `report.json` under `--out`, the requalify lines and `--out` required and outside the repository before any call (S). REQ-005, REQ-010, REQ-011. Evidence: T pins `keep`, `kill`, `stop (margin)`, `stop (coverage)` and `stop (flips)`, `report.json` and the `requalify:` line, and the CLI exits 2 with `--deem needs --out <dir> so every call is recorded` before any call (`SE` section 2; design section 3)
- [x] T012 [P] One inventory row and one tree line for S in `R/scripts/README.md`. Evidence: doc brief d1 adds both; fix f2 changes the tree line to `# Audit of the completion-claim detector, zero-call by default`; `validate_document.py` exits 0 (`SE` sections 1 and 3)
- [x] T013 [P] Parent goal D6 docs through sk-doc: one sentence in `SKILL.md`, one line in `README.md`, the next changelog file after `v4.3.0.0.md`, one catalog entry under `feature-catalog/tooling-and-scripts/` with its index row and one playbook scenario under `manual-testing-playbook/tooling-and-scripts/` with its index row (`.skilled/skills/system-spec-kit/`). REQ-013. Evidence: doc briefs d2 to d6b write `SKILL.md` at version 4.5.0.0 with the Quick Reference Commands row, `README.md`, `changelog/v4.5.0.0.md`, the catalog entry `completion-claim-audit.md` with its index row and the playbook scenario 462 with its index row; all eight docs pass `validate_document.py` exit 0; fix f1 corrects the catalog's allowlist sentence, the docs review's P1; the Hermes copy is regenerated (`SE` sections 1, 3 and 4)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T014 Tests: `npx vitest run tests/completion-claim-audit.vitest.ts` exits 0 with at least 16 passed and 0 failed, then the sentinel's three suites fail nothing beyond T002's baseline (T). REQ-012. Evidence: the run prints `Tests 23 passed (23)` against REQ-012's floor of 16, and the runtime root suite went from 108 files and 1,305 tests to 109 files and 1,328 tests with the same failing names before and after (`SE` section 2)
- [x] T015 Zero-call census on F with stub binaries first on `PATH`: expect `rows: 50 fires: 4` and `stop: fewer than 30 labeled rows`, both stub logs empty and no 40-character slice of any row's text in stdout. Record the counts in `goal.md`'s log. Evidence: the default run from the final state prints `rows: 50 fires: 4` and the stop line with both stub logs unwritten and no row-text slice on stdout, recorded in `goal.md`'s log by this closure pass (`SE` section 2)
- [B] T016 Past the label gate only: one live `--deem --out <dir>` run on the operator's labeled rows. Record the verdict line, the commit pair, the report path and p50 and p95 in `goal.md`'s log. Waits on 30 labels from the operator. Open for the operator: no claim label exists, so the census prints `stop: fewer than 30 labeled rows` from the final state and no arm opened; not part of this phase's completion (parent D4, `SE` section 6)
- [B] T017 Only when the operator passes `--jev --accept-payload`: one `--jev --out <dir>` run, recorded the same way with provider and model. The build never waits for the flag. Open for the operator: the labels, the `--jev` flag, `jev` 0.6.2, a credential the `auth status` check resolves and `--accept-payload`; not part of this phase's completion (parent D4, `SE` section 6)
- [x] T018 `git status --porcelain` matches T002's after every census and model run, and `grep -nE 'API_KEY|TYPESAFE|Bearer|Authorization'` on S prints nothing. REQ-008. Evidence: `git status --porcelain` was equal before and after every run; the key grep exits 1, run by this closure pass; a 40-character slice of each of the 50 rows was searched in every run's stdout and none was found; the code review records no comment-hygiene violation (`SE` sections 2 and 3; `facts.txt`)
- [x] T019 `python3 .skilled/skills/sk-doc/scripts/validate_document.py` exits 0 on every doc T012 and T013 changed. REQ-013. Evidence: `validate_document.py` exits 0 on all eight docs the doc steps changed, and the session revalidated both fixes f1 and f2 at exit 0 (`SE` sections 1, 2 and 3)
- [x] T020 Cross-family review of S and T leaves no open P0 or P1 finding, P2 findings recorded (parent goal D5). Then the parent orchestrator commits with path-scoped commits. Evidence: the code review (Pi MiMo, 857 s, read only) prints `VERDICT: PASS` with 4 P2; the docs review (DeepSeek on Cline, 422 s) prints `VERDICT: FAIL` with 1 P1 and 2 P2, fix f1 closes the P1 and fix f2 the tree-line P2, and the recheck (60 s) prints `VERDICT: PASS` with nothing new at P0 or P1; the 3 P2 findings are recorded in `goal.md`, and the commit `1a0fb2ea33` holds 24 files, not pushed (`SE` sections 3 and 5)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`, or the phase closes at its label gate with T016 and T017 left `[B]` and listed in `implementation-summary.md` as waiting on the operator's labels. Evidence: T001 to T015 and T018 to T020 are `[x]`, T016 and T017 stay `[B]` and listed, and the census prints `stop: fewer than 30 labeled rows` from the final state (parent D4)
- [x] No `[B]` blocked task remains other than those two. Evidence: this closure pass
- [x] Manual verification passed: the zero-call census ran on phase 003's fixture with stub binaries first on `PATH`. Evidence: the default run printed `rows: 50 fires: 4` and the stop line with both stub logs unwritten, rerun by the session from the final state (`SE` section 2)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Goal**: See `goal.md`
- **Research record**: R4 and open question 9 in `../001-deep-research/research/research.md` sections 11 and 12, carried by `../007-classifier-deep-research/research/research.md` sections 12 and 13
<!-- /ANCHOR:cross-refs -->

---
