---
title: "Tasks: Remove the unused nested spec changelog generator, templates and docs"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "remove nested changelog tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Remove the unused nested spec changelog generator, templates and docs

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation
<!-- FILL: Keep the prefix table and add the two shell variables this task list uses. GOOD: `R` is `scripts/rotate-logs.sh`. `A` is `logs/archive/`. WEAK: Variables are defined below. -->

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

`K` is `.skilled/skills/system-spec-kit`. `C` is `.skilled/skills/sk-doc/sk-create-changelog`. `P` is `specs/system-speckit/spec-folder-tooling/006-remove-nested-changelog`. Run every command from the repository root unless a task says `cd $K/runtime/cli`.

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
<!-- FILL: Replace the sample tasks with the real setup steps. Each task names a file and a verify command. GOOD: T001 Confirm `logs/archive/` holds 10 archives. Verify: `ls logs/archive | wc -l` prints 10. WEAK: T001 Set up the project. -->

- [x] T001 Build the CLI and record the baseline suite counts (`$P/scratch/baseline.txt`). Verify: the file holds the vitest `cli` summary, `test:legacy` and `test:validation` exit codes and the sk-doc pytest summary. Evidence: `scratch/baseline.txt`: build exit 0, vitest 2 failed | 2611 passed | 20 skipped (2633), legacy 27/0, validation 12/12, pytest 443 passed.
- [x] T002 [P] Record the reference inventory (`$P/scratch/inventory-before.txt`). Verify: `rg -l -i 'nested.?changelog|templates/changelog' .skilled > $P/scratch/inventory-before.txt` and the file lists the generator, the test and the docs. Evidence: `scratch/inventory-before.txt`, 55 files.
- [x] T003 [P] Record the packet changelog count (`$P/scratch/baseline.txt`). Verify: the REQ-003 `find` prints 1410. Evidence: `scratch/baseline.txt` packet changelogs 1410.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
<!-- FILL: Write one implementation task per file change. Add a `Verify:` line with the command and its expected output. GOOD: T002 Add the `--keep <n>` branch. Verify: `--keep 3` leaves 3 archives. WEAK: T002 Implement the feature. -->

- [x] T004 Delete the generator and its test (`$K/runtime/cli/spec-folder/nested-changelog.ts`, `$K/runtime/cli/tests/nested-changelog.vitest.ts`). Verify: `ls` on both fails. Evidence: `git status` shows both files `D`; `ls` fails.
- [x] T005 Drop the three re-exports and the import (`$K/runtime/cli/spec-folder/index.ts`). Verify: `rg -n 'NestedChangelog' $K/runtime/cli/spec-folder/index.ts` prints nothing. Evidence: `rg -n NestedChangelog spec-folder/index.ts` prints nothing.
- [x] T006 Drop the consumer row (`$K/runtime/cli/core/spec-root-registry.ts`) and the allowlist row (`$K/runtime/cli/retrieval/fixtures/residue-allowlist.json`). Verify: `rg -n 'nested-changelog' ` on both prints nothing. Evidence: Rows removed; `rg nested-changelog` on both prints nothing.
- [x] T007 Rebuild and remove the orphaned build output (`$K/runtime/cli/dist/spec-folder/nested-changelog.*`). Verify: `npm run build` in `runtime/cli` exits 0, and `ls dist/spec-folder/nested-changelog*` fails. Evidence: `npm run build` exit 0; `dist/spec-folder/nested-changelog.*` gone; `check-source-dist-alignment` passes.
- [x] T008 Delete the templates and the workflow reference (`$K/templates/changelog/`, `$K/references/workflows/nested-changelog.md`). Verify: `ls` on both fails. Evidence: Both `D` in `git status`.
- [x] T009 Remove the routing rows (`$K/ROUTER.md`, `$K/leaf-manifest.json`, `$K/leaf-aliases.json`). Verify: `bash $K/runtime/cli/spec/check-card-sync.sh` prints `CARD SYNC OK`. Evidence: `check-card-sync.sh` prints CARD SYNC OK.
- [x] T010 [P] Delete the catalog entry and playbook scenario 458 with their index rows (`$K/feature-catalog/`, `$K/manual-testing-playbook/`). Verify: `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs $K/manual-testing-playbook` exits 0. Evidence: `validate-playbook-package.cjs` PASS on the system-spec-kit playbook.
- [x] T011 [P] Reword the system-spec-kit docs (`$K/README.md`, `$K/runtime/cli/spec-folder/README.md`, `$K/templates/README.md`, `$K/templates/CONTRACT.md`, `$K/references/workflows/quick-reference.md`, `$K/references/templates/template-guide.md`, `$K/references/validation/validation-rules.md`). Verify: `rg -n -i 'nested-changelog|templates/changelog' ` on them prints nothing. Evidence: `rg -n -i "nested-changelog|templates/changelog"` on the listed docs prints only the kept historical path lines in validation-rules.
- [x] T012 [P] Update sk-create-changelog: drop CHG-012 and its rows, and say the generator is removed in SKILL, README, ROUTER, template section 7 and references (`$C/`). Verify: the playbook validator exits 0 on `$C/manual-testing-playbook`, and `rg -n 'packet_local' $C/ROUTER.md` still prints the refusal route. Evidence: sk-create-changelog playbook validator PASS, 14 scenarios; ROUTER.md:34 and :73 still carry `packet_local`.
- [x] T013 Regenerate the derived files: trigger index, sk-doc durable-directory manifest and README verdict baseline. Verify: `generate-trigger-index.mjs` exits 0, and `test_readme_manifest.py` and `test_readme_verdict_parity.py` pass. Evidence: Trigger index rebuilt, exit 0; durable manifest diff drops one entry (derived_count 929 to 928); verdict baseline count 1143; `test_readme_manifest.py` SUMMARY reproducible, `test_readme_verdict_parity.py` PARITY PASS. Activation manifest re-minted to c59d6853 at generation 5: `compiled-route-manifest.test.cjs` 48/48, sync check 55/55.
- [x] T014 Write a release entry and bump the version for system-spec-kit and sk-doc (`$K/changelog/`, `.skilled/skills/sk-doc/changelog/`). Verify: `check_changelog_shape.py` and `hvr_scan.py` on each exit 0. Evidence: v2.13.3.0, v1.5.3.0 and v2.9.16.0 pass `check_changelog_shape.py`; `hvr_scan.py` 0 hard blockers.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
<!-- FILL: Write one verification task per requirement. Each one runs a command. GOOD: T003 Run both invocations. Verify: `ls logs/archive | wc -l` prints 3 and 10. WEAK: T003 Test everything. -->

- [x] T015 Rerun the baseline suites (`$P/scratch/after.txt`). Verify: vitest `cli` passes with the baseline count minus the 13 deleted tests, and the other three match the baseline. Evidence: `scratch/after.txt`: second full run 2 failed (same two as baseline) | 2598 passed | 20 skipped (2620) = baseline minus 13; legacy 27/0, validation 12/12, pytest 443 passed.
- [x] T016 Run the REQ-001 search and the REQ-003 count. Verify: the search lists only the sk-create-changelog refusal text, and `find` prints 1410. Evidence: REQ-001 search lists two history files (see implementation-summary Known Limitations); REQ-003 `find` prints 1410.
- [x] T017 Run the save path once (`$K/runtime/cli/dist/continuity/generate-context.js`). Verify: `node ... --help` prints usage and exit 0. Evidence: `generate-context.js --help` exit 0.
- [x] T018 Run `validate.sh --strict` on the packet. Verify: it prints `RESULT: PASSED`. Evidence: `validate.sh --strict` RESULT: PASSED.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria
<!-- FILL: Keep the three completion lines and add the one artifact that proves the phase is done. GOOD: `--keep 3` leaves 3 archives and the suite passes. WEAK: Work is complete. -->

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
- [x] `$P/scratch/after.txt` matches the baseline minus the deleted test
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References
<!-- FILL: Name the spec and plan files. Add the decision record when the packet has one. GOOD: Specification: `spec.md`. Plan: `plan.md`. WEAK: See the other docs. -->

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Deprecation packet**: `specs/system-speckit/spec-authoring-and-continuity/003-weak-model-spec-authoring/025-deprecate-nested-changelogs`
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
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation
<!-- FILL: Write one check per setup fact, each with a command. GOOD: CHK-001 [P0] The start commit is in `goal.md` section 4. WEAK: Setup is ready. -->

- [x] CHK-001 [P0] Requirements documented in spec.md Evidence: spec.md REQ-001 to REQ-006.
- [x] CHK-002 [P0] Technical approach defined in plan.md Evidence: plan.md sections 1-7.
- [x] CHK-003 [P1] The baseline in `$P/scratch/baseline.txt` exists before T004 runs Evidence: baseline.txt written before T004.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality
<!-- FILL: Write one check per file rule. A command must answer it. GOOD: CHK-010 [P0] `bash -n scripts/rotate-logs.sh` exits 0. WEAK: Code is clean. -->

- [x] CHK-010 [P0] `npm run build` in `$K/runtime/cli` exits 0 Evidence: build exit 0.
- [x] CHK-011 [P0] `evals/check-source-dist-alignment.ts` reports no orphaned build output Evidence: check-source-dist-alignment passes.
- [x] CHK-012 [P1] No code comment names a spec path or packet number Evidence: No line added to any .ts file; `git diff HEAD -- "*.ts"` holds deletions only.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist
<!-- FILL: Write one check per acceptance criterion. GOOD: CHK-020 [P0] `--keep 3` leaves 3 archives. WEAK: Tests pass. -->

- [x] CHK-020 [P0] All acceptance criteria met Evidence: acceptance-criteria.md rows Met.
- [x] CHK-021 [P0] `generate-context.js --help` prints usage after the rebuild Evidence: help exit 0.
- [x] CHK-022 [P1] `tests/spec-root-registry.vitest.ts` and `tests/card-sync.vitest.ts` pass Evidence: Both files pass inside the full vitest run (not among the failures).
- [x] CHK-023 [P1] A nested changelog request still routes to the sk-create-changelog refusal Evidence: `compiled-route.cjs --hub sk-doc --prompt "write a nested changelog for this packet"` routes to sk-create-changelog; its `packet_local` route refuses.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS
<!-- FILL: Write this section when the packet fixes a reported finding. Delete it otherwise. GOOD: CHK-FIX-001 [P0] Every finding names one class. WEAK: All findings handled. -->

- [x] CHK-FIX-001 [P1] N/A: no reported finding. The removal is an operator request. Evidence: N/A as written.
- [x] CHK-FIX-002 [P0] Same-class inventory: `$P/scratch/inventory-before.txt` and the REQ-001 search after. Evidence: inventory-before.txt (55) and the REQ-001 search after.
- [x] CHK-FIX-003 [P0] Consumer inventory: the symbol search in plan.md prints no hit outside deleted files. Evidence: Symbol search prints no hit outside released changelogs.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security
<!-- FILL: Write one check per security surface. Write `N/A` with a reason when none applies. GOOD: CHK-030 [P0] `scripts/rotate-logs.sh` reads no credential. WEAK: Security is fine. -->

- [x] CHK-030 [P0] No hardcoded secrets in any changed file Evidence: Deletions and doc rewording only; no credential added.
- [x] CHK-031 [P1] N/A: no input handling changes Evidence: N/A.
- [x] CHK-032 [P1] N/A: no auth surface Evidence: N/A.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation
<!-- FILL: Write one check per document that must agree. GOOD: CHK-040 [P1] `spec.md` and `tasks.md` both name `--keep <n>`. WEAK: Docs are updated. -->

- [x] CHK-040 [P1] Spec/plan/tasks synchronized Evidence: Test count corrected to 13 in spec docs.
- [x] CHK-041 [P1] The kept packet changelogs are described as history wherever a doc mentions them Evidence: README:309, quick-reference and spec-folder README call the kept files history.
- [x] CHK-042 [P2] Released changelogs are left unchanged Evidence: This packet edits no released changelog. All 20 release notes it found modified were voice-rewrite pilot files, committed with that packet in `e673c77ba93`.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization
<!-- FILL: Write one check per file location rule. GOOD: CHK-050 [P1] Test copies live under `scratch/test/`. WEAK: Files are organized. -->

- [x] CHK-050 [P1] Baseline and inventory files in `$P/scratch/` only Evidence: baseline.txt, after.txt and inventory-before.txt are in scratch/.
- [x] CHK-051 [P1] scratch/ cleaned before completion Evidence: No temp output left; scratch keeps only the three evidence files.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary
<!-- FILL: Count the boxes by priority and write the three totals. GOOD: P0 12, P1 13, P2 1. WEAK: Most items done. -->

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 9 | 9/9 |
| P1 Items | 11 | 11/11 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-11-15
<!-- /ANCHOR:summary -->

---



