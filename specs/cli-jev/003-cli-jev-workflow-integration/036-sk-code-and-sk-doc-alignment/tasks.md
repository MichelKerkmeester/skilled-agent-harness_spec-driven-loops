---
title: "Tasks: Phase 36: sk-code-and-sk-doc-alignment"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "alignment task batches"
  - "header batch tasks"
  - "stderr tag tasks"
  - "doc fix tasks"
  - "alignment verification checklist"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 36: sk-code-and-sk-doc-alignment

<!-- SPECKIT_LEVEL: 2 -->
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

The plan's five phases map onto the three sections below: the header batch (plan phase 1) sits in Phase 1, the stderr and doc batches (plan phases 2 and 3) in Phase 2, and the review and proof tasks (plan phases 4 and 5) in Phase 3. Every batch is written by DeepSeek V4.1 Flash and reviewed by MiMo v2.6 Pro, with the reverse for any MiMo fix (parent goal D5, this phase's D5). Every check runs from `089693d899` or the final state. No task is `[x]` while the phase is Planned. Closure (2026-09-30): built and committed as `46d3795333`, with the evidence under `scratch/verify/`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Headers, the 9 files findings.md C1 lists, executor DeepSeek V4.1 Flash (parent D5). Each file gains the missing `COMPONENT:` or `MODULE:` marker in the header style it already uses: the seven box headers keep their box and gain `COMPONENT:` on the name line, `hvr_reader_lens.py` gains the marker on its Python divider line, and `judge-agreement.test.mjs` gains the three-line header its sibling uses, carrying the `MODULE:` marker. Check: `verify_alignment_drift.py --check-exact-headers --fail-on-warn` over the staged copy prints `Errors: 0`. Evidence: `[alignment-drift] PASS`, `Scanned files: 34`, `Errors: 0`, `Warnings: 0` (`scratch/verify/drift.txt`), and MiMo's C1 check is met (`scratch/verify/review-mimo.txt`).
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 Stderr tags, the 11 scripts, executor DeepSeek V4.1 Flash (parent D5), after T001 lands on the same files. Prefix `[<script-name>] ` at the default stderr writer or at each direct `process.stderr.write` diagnostic in `.skilled/hooks/goal/lib/build-verifier-fixture.cjs` (six writes, lines 383-413), `.skilled/hooks/goal/lib/score-verifier-labeled-set.cjs` (five writes, lines 424-456), `.skilled/hooks/goal/lib/count-pi-goal-nudges.mjs` (line 52), `.skilled/skills/cli-classifier/benchmark/injection-screen/score-injection-screen.mjs`, `.skilled/skills/sk-communication/benchmark/reply-harness/judge-agreement.mjs`, `.skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs` (line 1518), `.skilled/skills/sk-doc/sk-create-skill/scripts/leaf-route-replay.cjs` (line 1529), `.skilled/skills/sk-doc/sk-create-skill/scripts/score-clarify-default.cjs` (line 1436), `.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/score-verdict-fallback.cjs`, `.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/score-d4-agreement.cjs` and `.skilled/skills/system-deep-loop/deep-review/scripts/score-residue-flagger.cjs` (line 1474). `cli-deem.mjs` keeps its JSON stderr contract, the `deps.err` writers in tests stay untouched, and stdout report lines do not change (C2). Check: every stderr diagnostic in the 11 scripts starts `[<script-name>] `, no bare `error:` diagnostic remains in them, and each changed script's own suite passes. One test asserts an exact stderr string, so it is updated in the same step. Evidence: all 11 scripts pass a grep for untagged `process.stderr.write` or `console.error` diagnostics, 0 untagged each (this pass). `cli-deem.mjs` keeps its JSON stderr. `scratch/verify/tests-final.txt` equals `scratch/verify/tests-baseline.txt`, 12 node or python suites at rc=0 plus vitest `Tests 63 passed (63)`, and MiMo's C2 check is met.
- [x] T003 Playbook transcripts and catalog Feature ID lines, executor DeepSeek V4.1 Flash (parent D5). Remove the dated "Observed on ..." paragraphs from `.skilled/skills/cli-classifier/manual-testing-playbook/hub-routing/alias-still-resolves.md` (section Recorded Result, lines 67-72) and `.skilled/skills/cli-classifier/manual-testing-playbook/hub-routing/judgment-request-routes-to-transport.md` (lines 70-75), keeping each expected answer shape. Delete the one `- Feature ID: F0NN` bullet in `.skilled/skills/system-deep-loop/runtime/feature-catalog/fanout/fanout-pair-replay.md` (line 111), `.skilled/skills/system-deep-loop/runtime/feature-catalog/scoring/severity-replay.md` (line 77), `.skilled/skills/system-deep-loop/runtime/feature-catalog/scoring/stop-hint-replay.md` (line 77) and `.skilled/skills/system-deep-loop/runtime/feature-catalog/scoring/stop-rater-replay.md` (line 84). Nothing else in those files changes (D1, D2). Check: `validate-playbook-package.cjs --package .skilled/skills/cli-classifier/manual-testing-playbook` exits 0 with status PASS, and `validate_catalog_package.py --json` lists no violation whose leaf is one of the packet's 28 catalog entries. Evidence: `PASS package=cli-classifier tier=FAIL_CLOSED scenarios=6 categories=2 operator=6 routing_gold_excluded=0 violations=0 warnings=0`, exit 0 (`scratch/verify/pb.txt`), and `743 violations fleet-wide, 0 on the packet's 28 catalog entries` (`scratch/verify/catalog.txt`). MiMo's D1 and D2 checks are met.
- [x] T004 HVR prose fixes, executor DeepSeek V4.1 Flash (parent D5). Split the five prose semicolons at `.skilled/skills/sk-communication/manual-testing-playbook/release-gating/offline-judge-census-stops-at-label-gate.md` lines 32 and 47, `.skilled/skills/system-deep-loop/runtime/feature-catalog/fanout/fanout-pair-replay.md` line 98, `.skilled/skills/system-spec-kit/changelog/v4.2.0.0.md` line 28 and `.skilled/skills/cli-classifier/benchmark/reports/README.md` line 27. Replace the prose use of the banned word at `.skilled/skills/cli-classifier/manual-testing-playbook/manual-testing-playbook.md` line 143 and `.skilled/skills/sk-design/benchmark/reports/2026-09-27--manual-testing-playbook--hub-routing-replay/skill-benchmark-report.md` lines 68, 74, 192, 205, 231 and 235 with "script", "runner" or "check". Path and link text keeps the folder name (D3). Check: `hvr_scan.py` over the packet's docs reports hard blockers only on the recorded false positives. Evidence: `hvr hard blockers: 2`, both `harness` inside `reply-harness` link paths at `offline-judge-census-stops-at-label-gate.md:68-69`, the recorded false positives (`scratch/verify/hvr-summary.txt`). MiMo's D3 check is met.
- [x] T005 READMEs, executor DeepSeek V4.1 Flash (parent D5). Create `.skilled/skills/cli-classifier/benchmark/injection-screen/README.md` in the shape of the sibling code-folder README: what the check measures, the files, how to run it and the label gate. Add the missing `judge-agreement.test.mjs` row to `.skilled/skills/sk-communication/benchmark/reply-harness/README.md` beside its `judge-agreement.mjs` row (D4). Check: `validate_document.py` returns VALID on both and each DQI lands at band good or better. Evidence: `validate_document.py`: 90 docs, 0 invalid (`scratch/verify/docs-validate.txt`), and the new README reads DQI 82, band good, `VALID` with 0 issues (this pass). MiMo's D4 check is met.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 MiMo v2.6 Pro reviews every DeepSeek V4.1 Flash diff, read-only. The diff list is the batches in `plan.md` section 4: T001 headers, T002 stderr, T003 transcripts and catalog bullets, T004 prose, T005 READMEs. Check: one review file per batch with a verdict, every P0 and P1 finding named with file and line, and each review's file hashes equal before and after the read. Evidence: MiMo v2.6 Pro at high over 1490 s, `VERDICT: PASS` in one review file covering all six batches, C1, C2, D1, D2, D3 and D4 all met, no P0 or P1, one P2 recorded at `leaf-route-replay.cjs:3-4` (`scratch/verify/review-mimo.txt`).
- [x] T007 DeepSeek V4.1 Flash reviews any MiMo fix, read-only, with the reverse direction from T006. Check: a review verdict for each fix, no open P0 or P1 finding, and the P2 findings recorded in `implementation-summary.md` under Known Limitations. Evidence: closed as not needed, MiMo wrote no change to reverse-review, and the P2 is recorded in `implementation-summary.md` (session evidence, "Cross-family review").
- [x] T008 The session runs the proof commands and closes, executor the orchestrating session. Stage the copy of the 34 in-scope code files with `raw/mode-routing-run.sh` left out and run `verify_alignment_drift.py --check-exact-headers --fail-on-warn` over it. Run the stderr grep and each changed script's suite. Run `validate-playbook-package.cjs` and `validate_catalog_package.py --json`. Run `hvr_scan.py` and `validate_document.py`. Run comment hygiene over the 31 scripts, the key grep and `validate.sh --strict`. Record each result line in `goal.md`'s log and `acceptance-criteria.md`, then commit path-scoped and refresh the derived metadata with `repair-derived.cjs --apply`. Check: the five completion criteria in `goal.md` each pass from the final state, and `raw/mode-routing-run.sh` is byte-identical to `089693d899`. Evidence: each criterion passed with its result line in `acceptance-criteria.md`, a `git diff` against `089693d899` for the raw script prints nothing (this pass), and the build is committed as `46d3795333`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`, or a task reports its blocker with the command output that shows it. Evidence: T001 to T008 are `[x]` and T007 closes as not needed, with its session evidence quoted in the task.
- [x] No `[B]` blocked task remains. Evidence: no task carries `[B]`.
- [x] The five completion criteria in `goal.md` all pass from the final state. Evidence: their result lines are in `goal.md`'s log and `acceptance-criteria.md`.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Goal**: See `goal.md`
- **Acceptance criteria**: See `acceptance-criteria.md`
- **Audit source**: `scratch/audit/findings.md` and the lists beside it
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md across C1, C2, D1 to D4. Evidence: `spec.md` REQ-001 to REQ-012, with C1, C2 and D1 to D4 in section 3.
- [x] CHK-002 [P0] Technical approach defined in plan.md with the five batches and their checks. Evidence: `plan.md` section 4 lists the five phases and their checks.
- [x] CHK-003 [P1] Dependencies identified and available, including the two executors and the validators. Evidence: `plan.md` section 6. DeepSeek V4.1 Flash wrote each batch and MiMo v2.6 Pro reviewed them (session evidence).
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `verify_alignment_drift.py --check-exact-headers --fail-on-warn` over the staged 34-file copy prints `Errors: 0` and `Warnings: 0`. Evidence: `[alignment-drift] PASS`, `Scanned files: 34`, `Findings: 0`, `Errors: 0`, `Warnings: 0` (`scratch/verify/drift.txt`).
- [x] CHK-011 [P0] Comment hygiene reports 0 violations on the 31 scripts. Evidence: 31 `rc=0` lines (`scratch/verify/hygiene.txt`).
- [x] CHK-012 [P1] Every C2 stderr diagnostic carries its `[<script-name>]` prefix. Evidence: 11 of 11 scripts report 0 untagged stderr or console diagnostics (this pass), and MiMo's C2 check is met (`scratch/verify/review-mimo.txt`).
- [x] CHK-013 [P1] No header changes style: a box stays a box, and no file edits an executable line. Evidence: the `46d3795333` diff adds marker and prefix lines only, and every changed suite matches baseline (`scratch/verify/tests-final.txt`).
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] Each changed script's own test suite passes. Evidence: 12 node or python suites at rc=0 plus vitest `Tests 63 passed (63)`, identical to baseline (`scratch/verify/tests-final.txt`).
- [x] CHK-021 [P0] Stdout report lines and `cli-deem`'s JSON stderr are unchanged. Evidence: the suite outputs equal baseline and MiMo's C2 check finds the injected `deps.err` writers untouched (`scratch/verify/review-mimo.txt`).
- [x] CHK-022 [P1] The staged copy holds the 34 in-scope code files with `raw/mode-routing-run.sh` left out. Evidence: `scratch/verify/code34.txt` lists 34 paths and no `raw/mode-routing-run.sh`.
- [x] CHK-023 [P1] `raw/mode-routing-run.sh` is byte-identical to its `089693d899` copy. Evidence: a `git diff` against `089693d899` prints nothing (this pass).
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`. Evidence: `plan.md`'s FIX ADDENDUM holds the producer and consumer inventory per batch, so the header and doc batches are instance fixes and the stderr batch is one class over the 11 scripts.
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep. Evidence: the header and stderr `rg` inventories are in `plan.md`'s FIX ADDENDUM, and MiMo's C1 and C2 checks name no missed producer (`scratch/verify/review-mimo.txt`).
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests. Evidence: `plan.md`'s FIX ADDENDUM names the consumers, including the two validators, the label gate and `cli-deem.test.mjs`, and the suites match baseline (`scratch/verify/tests-final.txt`).
- [x] CHK-FIX-004 [P0] Security, path, parser and redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases. Evidence: not applicable. The batches change header comments, stderr string prefixes and doc prose, so no delimiter, path or parser case changed (the `46d3795333` diff).
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed: five groups with totals 9, 11, 2, 4, 7 and 2. Evidence: `plan.md`'s matrix axes line lists those totals, and the scope groups in `spec.md` section 3 match.
- [x] CHK-FIX-006 [P1] Hostile env or global-state variant executed when tests or code read process-wide state. Evidence: not applicable. The changed lines add header comments and stderr prefixes only and read no new process-wide state (the `46d3795333` diff), with every suite at baseline (`scratch/verify/tests-final.txt`).
- [x] CHK-FIX-007 [P1] Evidence is pinned to the audit's revision `089693d899` or the batch's own commit, not a moving branch-relative range. Evidence: the audit revision `089693d899`, the build commit `46d3795333` and the outputs under `scratch/verify/`.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets in any changed file. Evidence: the key grep exits 1 with no match over the 27 changed skill files and the new README (`scratch/verify/keys.txt`).
- [x] CHK-031 [P0] The key grep over the changed scripts exits 1. Evidence: `key grep exit=1 (no match)` (`scratch/verify/keys.txt`).
- [x] CHK-032 [P1] No `.env` file or key store is read, written or printed. Evidence: no changed file reads a `.env` file or key store. `score-injection-screen.mjs` refuses a `.env` basename in its corpus walk and holds no credential, and the key grep exits 1 (`scratch/verify/keys.txt`).
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan, tasks and acceptance criteria stay synchronized. Evidence: this closure pass updated all four in one pass.
- [x] CHK-041 [P1] Code comments carry no spec path, phase number or requirement id. Evidence: 31 of 31 hygiene clean (`scratch/verify/hygiene.txt`).
- [x] CHK-042 [P2] `injection-screen/README.md` and the reply check README row are written per D4. Evidence: `validate_document.py` reports 90 docs, 0 invalid (`scratch/verify/docs-validate.txt`), the new README reads DQI 82 at band good (this pass), and MiMo's D4 check is met.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files and the staged copy stay in `scratch/` only. Evidence: the staged copy and every proof output sit under `scratch/verify/`, and `46d3795333` holds no temp file outside `scratch/`.
- [x] CHK-051 [P1] `scratch/` cleanup does not remove the audit source. Evidence: `scratch/audit/findings.md` and its lists are present and committed.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-09-30
<!-- /ANCHOR:summary -->

---
