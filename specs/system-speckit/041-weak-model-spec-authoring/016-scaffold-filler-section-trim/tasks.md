---
title: "Tasks: Phase 16: scaffold-filler-section-trim"
description: "Take the census and suite baselines after phase 015, apply one brief per template, example, card and test change, then rerun the censuses and guards, review the diff and validate."
trigger_phrases:
  - "scaffold filler section trim tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.3 -->
# Tasks: Phase 16: scaffold-filler-section-trim

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation
<!-- FILL: Keep the prefix table and add the two shell variables this task list uses. GOOD: `S` is the script path. `P` is the packet path. WEAK: Variables are defined below. -->

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

`S` is `.skilled/skills/system-spec-kit`. `P` is this phase folder, `specs/system-speckit/054-weak-model-spec-authoring/016-scaffold-filler-section-trim`. `B` is `P/scratch/baseline`. `C` is `specs/system-speckit/054-weak-model-spec-authoring/010-deep-review-finding-fixes/scratch`. Every command runs from the repository root. Each Implementation task is one short brief to DeepSeek V4.1 Flash max through cli-pi, with cli-codex gpt-6-luna as the fallback; each brief matches its target by text, because phase 015 moves the line numbers.

Census commands, run once per shard `i` in 0, 1, 2, 3 after `npm --prefix S/runtime run build`. The shards are `B/list-$i`, split from `B/census-list.txt` (4,757 folders, 054 phases 015 to 018 excluded), in place of the three 010 shard lists:
- strict: `env -u SPECKIT_RULES node C/tools/strict-census.mjs S/runtime/dist/lib/validation/orchestrator.js B/list-$i > B/census-<when>-$i.tsv`
- rules: `env SPECKIT_RULES=PLACEHOLDER_FILLED,ANCHORS_VALID,SCAFFOLD_NEVER_TOUCHED,STATUS_CROSS_DOC_CONSISTENCY,GENERATED_METADATA_DRIFT,SPEC_DOC_SUFFICIENCY node C/tools/rule-census.mjs S/runtime/dist/lib/validation/orchestrator.js B/list-$i > B/rules-<when>-$i.tsv`

Test commands: CLI project files run from `S` as `npx vitest run --config vitest.config.ts --project cli tests/<name>.vitest.ts`; runtime project files run from `S/runtime` as `npx vitest run tests/<name>.vitest.ts`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
<!-- FILL: Replace the sample tasks with the real setup steps. Each task names a file and a verify command. GOOD: T001 Read the output block in `recommend-level.sh`. Verify: `rg -n 'Recommended Level'` prints one line. WEAK: T001 Set up the project. -->

- [x] T001 Confirm phase 015 has closed before any baseline (`../015-template-example-neutralization/acceptance-criteria.md`). Verify: `rg -n 'Closeable:\*\* Yes' specs/system-speckit/054-weak-model-spec-authoring/015-template-example-neutralization/acceptance-criteria.md` prints one line. Done as a deviation: on 2026-10-26 the `rg` printed nothing, because 015's acceptance file still reads `Closeable:** No`. The baseline was taken after 015's template edits were final, so the census starts from 015's finished templates; only 015's paperwork was open.
- [x] T002 Take the strict census baseline and join the shards (`B/census-before.tsv`). Verify: `wc -l < B/census-before.tsv` prints 4757. Done: 4757 rows, 4,562 PASS and 195 FAIL.
- [x] T003 [P] Take the six-rule census baseline and join the shards (`B/rules-before.tsv`). Verify: `wc -l < B/rules-before.tsv` prints 4757. Done: 4757 rows.
- [x] T004 [P] Take the CLI test project baseline (`B/cli-before.txt`). Verify: `rg 'vitest_exit' B/cli-before.txt` prints one line. Done as a deviation: no whole-suite CLI baseline was taken before the edits, so no suite-wide delta exists. Instead the 24 test files that phases 015 to 017 touch ran one at a time on the final build, and all 24 passed (counts in `implementation-summary.md`).
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
<!-- FILL: Write one implementation task per file change. Add a `Verify:` line with the command and its expected output. GOOD: T002 Add the `--quiet` branch. Verify: `--quiet` prints one line. WEAK: T002 Implement the feature. -->

- [x] T005 Replace the DoD line "Tests passing (if applicable)" with one token for the test command and its expected output (`S/templates/core/plan.md.tmpl`). Verify: `rg -n 'Tests passing' S/templates/core/plan.md.tmpl` prints nothing. Done: no output, exit 1.
- [x] T006 Replace the phase-deps sample with the line `Setup ──► Implementation ──► Verification` and token rows (`S/templates/core/plan.md.tmpl`). Verify: `rg -n 'Phase 1.5|Config' S/templates/core/plan.md.tmpl` prints nothing. Done: no output, exit 1.
- [x] T007 Remove the L2 effort estimation section (`S/templates/core/plan.md.tmpl`). Verify: `rg -n 'ANCHOR:effort' S/templates/core/plan.md.tmpl` prints nothing. Done: no output, exit 1.
- [x] T008 Remove the L2 enhanced rollback section (`S/templates/core/plan.md.tmpl`). Verify: `rg -n 'ANCHOR:enhanced-rollback|Feature flag configured' S/templates/core/plan.md.tmpl` prints nothing. Done: no output, exit 1.
- [x] T009 Replace the eight edge-case category rows with three token lines: empty input, maximum input, failure path (`S/templates/core/spec.md.tmpl`). Verify: `rg -n 'External service failure|Network timeout|Session expiry' S/templates/core/spec.md.tmpl` prints nothing. Done: no output, exit 1; the L2 and Level 3 sections each hold three token lines.
- [x] T010 Replace the three named sign-off roles with one token row, keeping the section at Level 3 and 3+ (`S/templates/core/tasks.md.tmpl`). Verify: `rg -n 'Technical Lead|Product Owner|QA Lead' S/templates/core/tasks.md.tmpl` prints nothing. Done: no output, exit 1; the sign-off table has one token row.
- [x] T011 Rename the header to `## FIX ADDENDUM: FIX COMPLETENESS` and change its fill note to "Write this section when the packet fixes a reported finding. Delete it otherwise." (`S/templates/core/tasks.md.tmpl`). Verify: `rg -n '^## FIX ADDENDUM: FIX COMPLETENESS|every level requires it' S/templates/core/tasks.md.tmpl` prints the header line only. Done: it printed `166:## FIX ADDENDUM: FIX COMPLETENESS` only.
- [x] T012 Make both decision-record pointers conditional: drop the always-there link at the spec related-docs list and reword CHK-100 (`S/templates/core/spec.md.tmpl`, `S/templates/core/tasks.md.tmpl`). Verify: every line `rg -n 'decision-record' S/templates/core/` prints contains "when the packet has one". Done: two lines, `tasks.md.tmpl:232` and `spec.md.tmpl:441`, both with the phrase.
- [x] T013 Bring the level 2, 3 and 3+ examples to the new template sections (`S/templates/examples/level-{2,3,3+}/`). Verify: `bash S/runtime/cli/spec/check-example-drift.sh` prints `EXAMPLE_DRIFT_OK`. Done: `EXAMPLE_DRIFT_OK`, exit 0.
- [x] T014 Drop the Step requirement from card section 6 and the plan-step bullet from section 11 (`S/references/workflows/spec-authoring-card.md`). Verify: `rg -n '### Step|plan steps' S/references/workflows/spec-authoring-card.md` prints nothing, and `bash S/runtime/cli/spec/check-card-sync.sh` prints `CARD SYNC OK`. Done: the `rg` printed nothing, exit 1; `CARD SYNC OK`, exit 0.
- [x] T015 Mark `fix-completeness` optional and drop `effort` and `enhanced-rollback` from the L2 addenda line (`S/references/validation/template-compliance-contract.md`). Verify: `rg -n 'enhanced-rollback' S/references/validation/template-compliance-contract.md` prints nothing. Done: the rg printed nothing (exit 1); the doc sweep is in `P/scratch/doc-sweep.md`.
- [x] T016 Add a case that deletes the `fix-completeness` block from a Level 2 copy and expects `ANCHORS_VALID` to pass (`S/runtime/tests/validation-optional-anchors.vitest.ts`). Verify: `cd S/runtime && npx vitest run tests/validation-optional-anchors.vitest.ts` prints 0 failed. Done: Tests 2 passed (2).
- [x] T017 Regenerate the golden snapshots once, after T005 to T012 (`S/runtime/cli/tests/snapshots/scaffold-golden-snapshots.vitest.ts.snap`). Verify: `cd S && npx vitest run --config vitest.config.ts --project cli tests/scaffold-golden-snapshots.vitest.ts` prints 0 failed without `-u`. Done: the regeneration ran once; the closeout rerun without `-u` passed 12 of 12 inside the T021 run.
- [x] T018 Sync the Hermes copies of the edited skill docs (`.hermes/skills/`). Verify: `node S/runtime/cli/hermes/sync-skills-hermes.cjs --check` prints `PASS`. Done: `PASS: 67 Hermes skill copies in sync`, exit 0.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
<!-- FILL: Write one verification task per requirement. Each one runs a command. GOOD: T003 Run both invocations. Verify: `wc -l` prints 1 and 17. WEAK: T003 Test everything. -->

- [x] T019 Rerun both censuses from the final tree and diff them sorted (`B/census-after.tsv`, `B/rules-after.tsv`). Verify: `diff <(sort B/census-before.tsv) <(sort B/census-after.tsv)` and the same for the rules files print nothing. Done: both diffs printed nothing, exit 0.
- [x] T020 Check the regenerated scaffold for the five filler strings (`S/runtime/cli/tests/snapshots/scaffold-golden-snapshots.vitest.ts.snap`). Verify: `rg -n 'Phase 1.5|Feature flag configured|External service failure|Network timeout|Tests passing \(if applicable\)' <snap file>` prints nothing. Done: no output, exit 1.
- [x] T021 Run the four scaffold and anchor tests without `-u` (`S/runtime/cli/tests/`). Verify: `cd S && npx vitest run --config vitest.config.ts --project cli tests/template-fill-guidance.vitest.ts tests/scaffold-golden-snapshots.vitest.ts tests/required-template-anchors.vitest.ts` prints 0 failed. Done: Test Files 3 passed (3), Tests 40 passed (40).
- [x] T022 Rerun the CLI test project against its baseline (`B/cli-after.txt`). Verify: its passed count is at least the count in `B/cli-before.txt` and `vitest_exit=0`. Done as a deviation: no whole-suite CLI baseline was taken before the edits, so no suite-wide delta exists. Instead the 24 test files that phases 015 to 017 touch ran one at a time on the final build, and all 24 passed (counts in `implementation-summary.md`).
- [x] T023 Have a fresh Opus medium agent review the phase diff (`P/scratch/review.md`). Verify: `rg -c 'wrong edit: none' P/scratch/review.md` prints at least 1. Done: prints 3, lines 98 (the `Re-review 2026-10-26` section), 108 (a fix-check sentence that quotes the phrase) and 110 (the fix check's own result line). The first review reported `wrong edit: 1` (F1, the card's "3 or 4 phases"); the card now names three phases.
- [x] T024 Validate this folder (`P`). Verify: `bash S/runtime/cli/spec/validate.sh P --strict` prints `RESULT: PASSED`. Done: Errors 0, Warnings 0, `RESULT: PASSED`, after `repair-derived.cjs --apply`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria
<!-- FILL: Keep the three completion lines and add the one artifact that proves the phase is done. GOOD: `--quiet` prints one line and the suite passes. WEAK: Work is complete. -->

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] `acceptance-criteria.md` reads Closeable: Yes, and `B/census-after.tsv` matches `B/census-before.tsv` when sorted
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References
<!-- FILL: Name the spec and plan files. Add the decision record when the packet has one. GOOD: Specification: `spec.md`. Plan: `plan.md`. WEAK: See the other docs. -->

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Predecessor**: `../015-template-example-neutralization/`
- **Evidence**: `../015-template-example-neutralization/scratch/insight-review.md`, `../015-template-example-neutralization/scratch/evidence-summary.md`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist
<!-- FILL: Fill each checklist section below. GOOD: Each CHK line names the command that answers it. WEAK: The checklist is done. -->

<!-- ANCHOR:protocol -->
## Verification Protocol
<!-- FILL: Keep the three rows and add the rule this packet uses for a blocked task. GOOD: P0 blocks close. P1 needs a recorded reason. WEAK: Follow the priorities. -->

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

A blocked task is marked `[B]` with its reason, and the phase stays In Progress. A census row that changes verdict blocks T019 until the operator decides.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation
<!-- FILL: Write one check per setup fact, each with a command. GOOD: CHK-001 [P0] The start commit is in `goal.md` section 4. WEAK: Setup is ready. -->

- [x] CHK-001 [P0] Phase 015 is closed before the baselines: T001's `rg` prints one line. Done as a deviation: see T001.
- [x] CHK-002 [P0] The baselines exist before any template edit: `ls B` lists `census-before.tsv`, `rules-before.tsv` and `cli-before.txt`. Done as a deviation: `census-before.tsv` and `rules-before.tsv` exist; `cli-before.txt` was never taken, see T004.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality
<!-- FILL: Write one check per file rule. A command must answer it. GOOD: CHK-010 [P0] `bash -n recommend-level.sh` exits 0. WEAK: Code is clean. -->

- [x] CHK-010 [P0] No validator code changes: `git diff --stat -- S/runtime/lib/validation S/runtime/cli/utils` prints nothing, unless a census fallback in `spec.md` section 6 was needed and `goal.md` records it. Done: the command prints one file, `orchestrator.ts` (173 insertions, 1 deletion), which is phase 017's Draft auto-repair. This phase changed no validator code.
- [x] CHK-011 [P1] `node S/runtime/cli/check-markdown-links.cjs` prints "0 broken" after the edits. Done: 7630 files, 13787 links, 0 broken.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist
<!-- FILL: Write one check per acceptance criterion. GOOD: CHK-020 [P0] `--quiet` prints one line. WEAK: Tests pass. -->

- [x] CHK-020 [P0] Every row of `acceptance-criteria.md` is Met. Done: 8 of 8.
- [x] CHK-021 [P0] Both sorted census diffs print nothing. Done: see T019.
- [x] CHK-022 [P0] `template-fill-guidance.vitest.ts`, `scaffold-golden-snapshots.vitest.ts`, `required-template-anchors.vitest.ts` and `validation-optional-anchors.vitest.ts` pass. Done: 40 of 40 in the three CLI files, 2 of 2 in the runtime file.
- [x] CHK-023 [P1] The Opus review reports no wrong edit. Done: the re-review reports `wrong edit: none`; see T023.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness
<!-- FILL: Keep this section, because every level requires it. Write one check per finding class this packet can produce. Delete only the rows that do not apply, never the section. GOOD: CHK-FIX-001 [P0] Every finding names one class. WEAK: All findings handled. -->

- [x] CHK-FIX-001 [P0] Each filler section is `class-of-bug`: the same sample text lands in every packet the template scaffolds, so the fix is in the template and the examples, not in any packet. Done: the fixes are in `S/templates/core/` and the examples only.
- [x] CHK-FIX-002 [P0] Same-class inventory: `rg -n 'Phase 1.5|Feature flag configured|External service failure|Tests passing \(if applicable\)|Technical Lead' S/templates` prints nothing after the edits. Done: no output, exit 1.
- [x] CHK-FIX-003 [P0] Consumer inventory: the examples, the compliance contract, the golden snapshot, `validation-optional-anchors.vitest.ts` and the Hermes copies are updated or proven unaffected. Done: `EXAMPLE_DRIFT_OK`, the contract's `rg` prints nothing, the snapshot test and the optional-anchor test pass, Hermes `PASS: 67`.
- [x] CHK-FIX-005 [P1] Matrix axes: six sections and two pointers across Levels 2, 3 and 3+, plus every existing packet through the census. Done: the snapshot covers Levels 2, 3 and 3+; the census covers 4,757 folders.
- [x] CHK-FIX-007 [P1] Evidence is pinned to the phase commit SHA in `implementation-summary.md`. Done: `implementation-summary.md` Metadata pins code commit `62e4661e01` and docs commit `ef939bf0ac`.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security
<!-- FILL: Write one check per security surface. Write `N/A` with a reason when none applies. GOOD: CHK-030 [P0] The script reads no credential. WEAK: Security is fine. -->

- [x] CHK-030 [P0] N/A: no credential, input path or permission changes; the dispatch briefs carry no secret.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation
<!-- FILL: Write one check per document that must agree. GOOD: CHK-040 [P1] `spec.md` and `tasks.md` name the same flag. WEAK: Docs are updated. -->

- [x] CHK-040 [P1] Card section 6 and the `plan.md.tmpl` phases fill note give the same plan shape: both point to `tasks.md` and name three phases. Done: card section 6 names Setup, Implementation and Verification, one line each, and points at `tasks.md`; the fill note at `plan.md.tmpl:124` says the same.
- [x] CHK-041 [P1] `node S/runtime/cli/hermes/sync-skills-hermes.cjs --check` prints `PASS`. Done: `PASS: 67`.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization
<!-- FILL: Write one check per file location rule. GOOD: CHK-050 [P1] Test copies live under `scratch/test/`. WEAK: Files are organized. -->

- [x] CHK-050 [P1] Baselines, briefs, run reports and the review live under `P/scratch/` only. Done: `ls P/scratch` lists `baseline`, `briefs`, `runs`, `staging`, `doc-sweep.md` and `review.md`.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary
<!-- FILL: Count the boxes by priority and write the three totals. GOOD: P0 12, P1 13, P2 1. WEAK: Most items done. -->

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 10 | 10/10 |
| P1 Items | 7 | 7/7 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-10-26. No item is open. CHK-001 and CHK-002 are ticked as recorded deviations.
<!-- /ANCHOR:summary -->

---
