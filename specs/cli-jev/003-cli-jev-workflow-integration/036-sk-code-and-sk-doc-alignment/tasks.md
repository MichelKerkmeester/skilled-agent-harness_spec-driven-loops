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

The plan's five phases map onto the three sections below: the header batch (plan phase 1) sits in Phase 1, the stderr and doc batches (plan phases 2 and 3) in Phase 2, and the review and proof tasks (plan phases 4 and 5) in Phase 3. Every batch is written by DeepSeek V4.1 Flash and reviewed by MiMo v2.6 Pro, with the reverse for any MiMo fix (parent goal D5, this phase's D5). Every check runs from `089693d899` or the final state. No task is `[x]` while the phase is Planned.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Headers, the 9 files findings.md C1 lists, executor DeepSeek V4.1 Flash (parent D5). Each file gains the missing `COMPONENT:` or `MODULE:` marker in the header style it already uses: the seven box headers keep their box and gain `COMPONENT:` on the name line, `hvr_reader_lens.py` gains the marker on its Python divider line, and `judge-agreement.test.mjs` gains the three-line header its sibling uses, carrying the `MODULE:` marker. Check: `verify_alignment_drift.py --check-exact-headers --fail-on-warn` over the staged copy prints `Errors: 0`
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T002 Stderr tags, the 11 scripts, executor DeepSeek V4.1 Flash (parent D5), after T001 lands on the same files. Prefix `[<script-name>] ` at the default stderr writer or at each direct `process.stderr.write` diagnostic in `.skilled/hooks/goal/lib/build-verifier-fixture.cjs` (six writes, lines 383-413), `.skilled/hooks/goal/lib/score-verifier-labeled-set.cjs` (five writes, lines 424-456), `.skilled/hooks/goal/lib/count-pi-goal-nudges.mjs` (line 52), `.skilled/skills/cli-classifier/benchmark/injection-screen/score-injection-screen.mjs`, `.skilled/skills/sk-communication/benchmark/reply-harness/judge-agreement.mjs`, `.skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs` (line 1518), `.skilled/skills/sk-doc/sk-create-skill/scripts/leaf-route-replay.cjs` (line 1529), `.skilled/skills/sk-doc/sk-create-skill/scripts/score-clarify-default.cjs` (line 1436), `.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/score-verdict-fallback.cjs`, `.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/score-d4-agreement.cjs` and `.skilled/skills/system-deep-loop/deep-review/scripts/score-residue-flagger.cjs` (line 1474). `cli-deem.mjs` keeps its JSON stderr contract, the `deps.err` writers in tests stay untouched, and stdout report lines do not change (C2). Check: every stderr diagnostic in the 11 scripts starts `[<script-name>] `, no bare `error:` diagnostic remains in them, and each changed script's own suite passes. One test asserts an exact stderr string, so it is updated in the same step
- [ ] T003 Playbook transcripts and catalog Feature ID lines, executor DeepSeek V4.1 Flash (parent D5). Remove the dated "Observed on ..." paragraphs from `.skilled/skills/cli-classifier/manual-testing-playbook/hub-routing/alias-still-resolves.md` (section Recorded Result, lines 67-72) and `.skilled/skills/cli-classifier/manual-testing-playbook/hub-routing/judgment-request-routes-to-transport.md` (lines 70-75), keeping each expected answer shape. Delete the one `- Feature ID: F0NN` bullet in `.skilled/skills/system-deep-loop/runtime/feature-catalog/fanout/fanout-pair-replay.md` (line 111), `.skilled/skills/system-deep-loop/runtime/feature-catalog/scoring/severity-replay.md` (line 77), `.skilled/skills/system-deep-loop/runtime/feature-catalog/scoring/stop-hint-replay.md` (line 77) and `.skilled/skills/system-deep-loop/runtime/feature-catalog/scoring/stop-rater-replay.md` (line 84). Nothing else in those files changes (D1, D2). Check: `validate-playbook-package.cjs --package .skilled/skills/cli-classifier/manual-testing-playbook` exits 0 with status PASS, and `validate_catalog_package.py --json` lists no violation whose leaf is one of the packet's 28 catalog entries
- [ ] T004 HVR prose fixes, executor DeepSeek V4.1 Flash (parent D5). Split the five prose semicolons at `.skilled/skills/sk-communication/manual-testing-playbook/release-gating/offline-judge-census-stops-at-label-gate.md` lines 32 and 47, `.skilled/skills/system-deep-loop/runtime/feature-catalog/fanout/fanout-pair-replay.md` line 98, `.skilled/skills/system-spec-kit/changelog/v4.2.0.0.md` line 28 and `.skilled/skills/cli-classifier/benchmark/reports/README.md` line 27. Replace the prose use of the banned word at `.skilled/skills/cli-classifier/manual-testing-playbook/manual-testing-playbook.md` line 143 and `.skilled/skills/sk-design/benchmark/reports/2026-09-27--manual-testing-playbook--hub-routing-replay/skill-benchmark-report.md` lines 68, 74, 192, 205, 231 and 235 with "script", "runner" or "check". Path and link text keeps the folder name (D3). Check: `hvr_scan.py` over the packet's docs reports hard blockers only on the recorded false positives
- [ ] T005 READMEs, executor DeepSeek V4.1 Flash (parent D5). Create `.skilled/skills/cli-classifier/benchmark/injection-screen/README.md` in the shape of the sibling code-folder README: what the check measures, the files, how to run it and the label gate. Add the missing `judge-agreement.test.mjs` row to `.skilled/skills/sk-communication/benchmark/reply-harness/README.md` beside its `judge-agreement.mjs` row (D4). Check: `validate_document.py` returns VALID on both and each DQI lands at band good or better
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T006 MiMo v2.6 Pro reviews every DeepSeek V4.1 Flash diff, read-only. The diff list is the batches in `plan.md` section 4: T001 headers, T002 stderr, T003 transcripts and catalog bullets, T004 prose, T005 READMEs. Check: one review file per batch with a verdict, every P0 and P1 finding named with file and line, and each review's file hashes equal before and after the read
- [ ] T007 DeepSeek V4.1 Flash reviews any MiMo fix, read-only, with the reverse direction from T006. Check: a review verdict for each fix, no open P0 or P1 finding, and the P2 findings recorded in `implementation-summary.md` under Known Limitations
- [ ] T008 The session runs the proof commands and closes, executor the orchestrating session. Stage the copy of the 34 in-scope code files with `raw/mode-routing-run.sh` left out and run `verify_alignment_drift.py --check-exact-headers --fail-on-warn` over it. Run the stderr grep and each changed script's suite. Run `validate-playbook-package.cjs` and `validate_catalog_package.py --json`. Run `hvr_scan.py` and `validate_document.py`. Run comment hygiene over the 31 scripts, the key grep and `validate.sh --strict`. Record each result line in `goal.md`'s log and `acceptance-criteria.md`, then commit path-scoped and refresh the derived metadata with `repair-derived.cjs --apply`. Check: the five completion criteria in `goal.md` each pass from the final state, and `raw/mode-routing-run.sh` is byte-identical to `089693d899`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`, or a task reports its blocker with the command output that shows it
- [ ] No `[B]` blocked task remains
- [ ] The five completion criteria in `goal.md` all pass from the final state
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

- [ ] CHK-001 [P0] Requirements documented in spec.md across C1, C2, D1 to D4
- [ ] CHK-002 [P0] Technical approach defined in plan.md with the five batches and their checks
- [ ] CHK-003 [P1] Dependencies identified and available, including the two executors and the validators
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] `verify_alignment_drift.py --check-exact-headers --fail-on-warn` over the staged 34-file copy prints `Errors: 0` and `Warnings: 0`
- [ ] CHK-011 [P0] Comment hygiene reports 0 violations on the 31 scripts
- [ ] CHK-012 [P1] Every C2 stderr diagnostic carries its `[<script-name>]` prefix
- [ ] CHK-013 [P1] No header changes style: a box stays a box, and no file edits an executable line
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] Each changed script's own test suite passes
- [ ] CHK-021 [P0] Stdout report lines and `cli-deem`'s JSON stderr are unchanged
- [ ] CHK-022 [P1] The staged copy holds the 34 in-scope code files with `raw/mode-routing-run.sh` left out
- [ ] CHK-023 [P1] `raw/mode-routing-run.sh` is byte-identical to its `089693d899` copy
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`.
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep.
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests.
- [ ] CHK-FIX-004 [P0] Security, path, parser and redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases.
- [ ] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed: five groups with totals 9, 11, 2, 4, 7 and 2.
- [ ] CHK-FIX-006 [P1] Hostile env or global-state variant executed when tests or code read process-wide state.
- [ ] CHK-FIX-007 [P1] Evidence is pinned to the audit's revision `089693d899` or the batch's own commit, not a moving branch-relative range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets in any changed file
- [ ] CHK-031 [P0] The key grep over the changed scripts exits 1
- [ ] CHK-032 [P1] No `.env` file or key store is read, written or printed
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec, plan, tasks and acceptance criteria stay synchronized
- [ ] CHK-041 [P1] Code comments carry no spec path, phase number or requirement id
- [ ] CHK-042 [P2] `injection-screen/README.md` and the reply check README row are written per D4
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files and the staged copy stay in `scratch/` only
- [ ] CHK-051 [P1] `scratch/` cleanup does not remove the audit source
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 0 |
| P1 Items | 13 | 0 |
| P2 Items | 1 | 0 |

**Verification Date**: 2026-09-30
<!-- /ANCHOR:summary -->

---
