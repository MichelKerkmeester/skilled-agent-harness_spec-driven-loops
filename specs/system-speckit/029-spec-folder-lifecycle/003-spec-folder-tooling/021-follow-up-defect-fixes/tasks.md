---
title: "Tasks: Phase 21: follow-up-defect-fixes"
description: "Task list for ten original code lanes and their follow-ups, with 016 audit work and final verification."
trigger_phrases:
  - "follow up defect fixes tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 21: follow-up-defect-fixes

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed, with the evidence named on the line |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] [lane] Description (file path)`. Evidence paths are relative to this packet's `scratch/evidence/` folder. Each mutant runs in a scratch mirror, never in the repository.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read the 020 evidence each requirement names and re-read each cited line in the current tree. Record moved lines. Evidence: scratch/evidence/lane-25-closeout-checks.txt, Check 1.
- [x] T002 Record the starting numbers before any edit for the CLI suite, root project, doctor suites, hooks suite, launcher test, Hermes plugin tests, leaf tests and strict validates. Evidence: scratch/evidence/lane-25-closeout-checks.txt, Check 2.
- [x] T003 Record the repository root and specs listings for the residue checks. Evidence: scratch/evidence/lane-25-closeout-checks.txt, Check 3, setup listing.
- [x] T004 Bring the operator's answers to decisions 1 to 4 into spec.md section 10 and clear each pending mark in plan.md section 3. Evidence: scratch/evidence/lane-1-healer.txt, Operator decision 1. lane-3-archive.txt, Operator decision 2. lane-10-child-marker.txt, Operator decisions applied.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

Each code lane saves a red run on the unfixed code, a green run after the fix and one run per mutant. A lane edits only the files `plan.md` section 3 gives it.

### Lane 1: healer no-roots rule (REQ-001)
- [x] T005 [P] [1] Red: rebuild the B-11 fixture with a linked parent outside every root and no --roots. Evidence: scratch/evidence/lane-1-healer.txt, RED (unfixed code).
- [x] T006 [P] [1] Green: add the no-anchor refusal in folderRefusal and state it in the healer README. Evidence: scratch/evidence/lane-1-healer.txt, GREEN (fixed code).
- [x] T007 [P] [1] Run the seven healer files and add --roots only to cases the run names. Evidence: scratch/evidence/lane-1-healer.txt, GREEN (fixed code) and NEIGHBOR.
- [x] T008 [P] [1] Run mutant M1-a and recheck the healer same-class inventory. Evidence: scratch/evidence/lane-1-healer.txt, MUTANT M1-a and SAME-CLASS INVENTORY.

### Lane 2: backfill root (REQ-002, REQ-003)
- [x] T009 [P] [2] Red: reproduce the outside-root write and the unanchored report write. Evidence: scratch/evidence/lane-2-backfill.txt, Red.
- [x] T010 [P] [2] Green: confine the CLI root and add the report-root check. Evidence: scratch/evidence/lane-2-backfill.txt, Green.
- [x] T011 [P] [2] Run mutants M2-a and M2-b and inventory backfill consumers. Evidence: scratch/evidence/lane-2-backfill.txt, Mutants and Other checks.

### Lane 3: archive alias (REQ-004)
- [x] T012 [P] [3] Red: reproduce the archive alias move and dangling link. Evidence: scratch/evidence/lane-3-archive.txt, Red (unfixed archive.sh).
- [x] T013 [P] [3] Green: refuse linked archive arguments before a copy. Evidence: scratch/evidence/lane-3-archive.txt, Green (fixed archive.sh).
- [x] T014 [P] [3] Run the archive mutant and existing archive cases. Evidence: scratch/evidence/lane-3-archive.txt, Mutant proof and Restore refusal.

### Lane 4: leaf manifest check (REQ-005)
- [x] T015 [P] [4] Red: reproduce fresh-byte and dangling-link failures under --check. Evidence: scratch/evidence/lane-4-leaf-check.txt, Red (unfixed code).
- [x] T016 [P] [4] Green: refuse a linked manifest under --check and update the scripts README. Evidence: scratch/evidence/lane-4-leaf-check.txt, Green (fixed code) and Files changed.
- [x] T017 [P] [4] Run mutant M4-a and the hub checks. Evidence: scratch/evidence/lane-4-leaf-check.txt, Mutant M4-a and Hub check.

### Lane 5: upgrade-legacy reads (REQ-006, REQ-007)
- [x] T018 [P] [5] Red: reproduce linked manifest reads and accepted dot-segment roots. Evidence: scratch/evidence/lane-5-upgrade-legacy.txt, Red.
- [x] T019 [P] [5] Green: refuse linked manifests and dot-segment roots. Evidence: scratch/evidence/lane-5-upgrade-legacy.txt, Green, whole file after the fix.
- [x] T020 [P] [5] Run mutants M5-a and M5-b. Evidence: scratch/evidence/lane-5-upgrade-legacy.txt, Mutants M5-a and M5-b.

### Lane 6: repair-derived apply reads (REQ-008, REQ-009)
- [x] T021 [P] [6] Red: reproduce the post-planning outside read and parse-content leak. Evidence: scratch/evidence/lane-6-repair-derived.txt, Red (unfixed code, new cases only).
- [x] T022 [P] [6] Green: refuse apply reads through links and report parse failures without file content. Evidence: scratch/evidence/lane-6-repair-derived.txt, Green (fixed code).
- [x] T023 [P] [6] Run mutants M6-a and M6-b and recheck the same-class inventory. Evidence: scratch/evidence/lane-6-repair-derived.txt, Mutants and Same-class inventory.

### Lane 7: changelog generator (REQ-010, REQ-011)
- [x] T024 [P] [7] Red: reproduce the 13-row cut and inline comment leak. Evidence: scratch/evidence/lane-7-changelog.txt, Red.
- [x] T025 [P] [7] Green: remove the row cut and strip inline HTML comments. Evidence: scratch/evidence/lane-7-changelog.txt, Green.
- [x] T026 [P] [7] Run mutants M7-a and M7-b. Evidence: scratch/evidence/lane-7-changelog.txt, Mutant M7-a and Mutant M7-b.

### Lane 8: lean parent status (REQ-012)
- [x] T027 [P] [8] Red: test the missing-metadata child, mixed child states and no-child case. Evidence: scratch/evidence/lane-8-lean-parent.txt, sections 2 and 4.
- [x] T028 [P] [8] Green: change derivePhaseParentRollup so a missing-metadata child counts as incomplete and no loadable child preserves the stored status. Evidence: scratch/evidence/lane-8-lean-parent.txt, sections 9 and 10.
- [x] T029 [P] [8] Run mutants M8-a and M8-b and record the read-only flip list. Evidence: scratch/evidence/lane-8-lean-parent.txt, sections 8 and 9, Mutants.

### Lane 9: test hygiene (REQ-013, REQ-014)
- [x] T030 [P] [9, 21] Red: the scratch leak red and the under-load mutant failure are recorded. Evidence: scratch/evidence/lane-9-test-hygiene.txt, Red (a) and Red (b). scratch/evidence/lane-21-t046-under-load.txt:31, scratch/evidence/lane-21-t046-under-load.txt:34 and scratch/evidence/lane-21-t046-under-load.txt:37.
- [x] T031 [P] [9, 21] Green: clean up the comparison-test scratch parent and measure T046-26 after warm-up under load. Evidence: scratch/evidence/lane-9-test-hygiene.txt, Green, after the fixes. scratch/evidence/lane-21-t046-under-load.txt:25, scratch/evidence/lane-21-t046-under-load.txt:28 and scratch/evidence/lane-21-t046-under-load.txt:30.
- [x] T032 [P] [9, 21] Run mutants M9-a and M9-b. Evidence: scratch/evidence/lane-9-test-hygiene.txt, Mutant M9-a and Mutant M9-b. scratch/evidence/lane-21-t046-under-load.txt:31, scratch/evidence/lane-21-t046-under-load.txt:34 and scratch/evidence/lane-21-t046-under-load.txt:35.

### Lane 10: child marker (REQ-015, REQ-016)
- [x] T033 [P] [10] Classify readers and setters of AI_SESSION_CHILD. Evidence: scratch/evidence/lane-10-child-marker.txt, AI_SESSION_CHILD consumers.
- [x] T034 [P] [10] Red: reproduce launcher child-marker leakage and the Hermes child-classification failure. Evidence: scratch/evidence/lane-10-child-marker.txt, Red (before the fix).
- [x] T035 [P] [10] Green: change launcher marker handling and the Hermes leaf rule. Evidence: scratch/evidence/lane-10-child-marker.txt, Green (after the fix) and Follow-up.
- [x] T036 [P] [10] Run mutants M10-a, M10-b, M10-c and M10-d. Evidence: scratch/evidence/lane-10-child-marker.txt, Mutants and Follow-up mutant M10-d.
- [x] T041 [3] REQ-018: refuse a linked restore argument before moving the packet. Evidence: scratch/evidence/lane-3-archive.txt, RESTORE REFUSAL and Mutant M3-b.
- [x] T042 [1] REQ-019: refuse linked spec.md at both healer level reads. Evidence: scratch/evidence/lane-1-healer.txt, LANE 1 ADDENDUM, GREEN and MUTANTS.
- [x] T043 [6, 13] REQ-020: resolve the in-packet linked plan.md neighbor failure with the internal-link policy and rerun the upgrade-legacy neighbor suite. Evidence: scratch/evidence/lane-13-inside-links.txt, Test counts before and after.
- [x] T044 [10] REQ-021: fix SC2088 without changing the tilde case. Evidence: scratch/evidence/lane-10-child-marker.txt, Follow-up: case pattern.
- [x] T045 [10] REQ-022: export SYSTEM_SPEC_GATE_ENFORCE=0 only for dispatched children. Evidence: scratch/evidence/lane-10-child-marker.txt, Follow-up: ENFORCE scope.
- [x] T046 [1] REQ-023: add unknown-option and missing-path checks for every healer mode. Evidence: scratch/evidence/lane-1-healer.txt, LANE 1 ADDENDUM 2, GREEN and MUTANTS.
- [x] T047 [5] REQ-024: add and test the upgrade-legacy apply-lock refusal. Evidence: scratch/evidence/lane-5-upgrade-legacy.txt, section 2, Test counts and Mutant M5-c.
- [x] T048 [8] REQ-025: fix the source readers so linked canonical docs are refused or skipped. Evidence: scratch/evidence/lane-8-lean-parent.txt, Linked canonical docs during metadata derivation.
- [x] T049 [11] REQ-026: attach the 016 child audit evidence. Evidence: scratch/evidence/lane-11-016-audit.txt, Verdict and validate results.
- [x] T050 [12] REQ-026: reconcile the 016 child boxes with the approved runs and closeout evidence. Evidence: scratch/evidence/lane-12-anchor-repair-boxes.txt, Boxes 1 to 4 and Open Items. scratch/evidence/lane-16-009-compat-run.txt:16. scratch/evidence/lane-18-hostile-rerun.txt:37 and scratch/evidence/lane-18-hostile-rerun.txt:42. scratch/evidence/lane-20-016-residual-boxes.txt:11, scratch/evidence/lane-20-016-residual-boxes.txt:21, scratch/evidence/lane-20-016-residual-boxes.txt:31 and scratch/evidence/lane-20-016-residual-boxes.txt:40. scratch/evidence/lane-23-015-per-mode.txt:78, scratch/evidence/lane-23-015-per-mode.txt:167, scratch/evidence/lane-23-015-per-mode.txt:252, scratch/evidence/lane-23-015-per-mode.txt:330 and scratch/evidence/lane-23-015-per-mode.txt:426. scratch/evidence/decision-ledger.txt:55, scratch/evidence/decision-ledger.txt:56 and scratch/evidence/decision-ledger.txt:63. The ledger records fixJ at scratch/evidence/decision-ledger.txt:84 and fixK at scratch/evidence/decision-ledger.txt:85. The 015 summary shows fixJ at ../016-research-recommendations/015-lane-rules-as-heal-modes/implementation-summary.md:194 and :200. The four corrected fixK prefixes appear at ../016-research-recommendations/009-doctor-update-compatibility/tasks.md:62, ../016-research-recommendations/011-anchor-repair-mode/plan.md:180, ../016-research-recommendations/015-lane-rules-as-heal-modes/tasks.md:69 and ../016-research-recommendations/015-lane-rules-as-heal-modes/implementation-summary.md:190.
- [x] T051 [13] REQ-027: allow inside-packet file and directory links while refusing or skipping outside and dangling links. Evidence: scratch/evidence/lane-13-inside-links.txt, Scope and Test counts before and after.
- [x] T052 [14] REQ-028: give the removed --mode and --json flags specific guidance and keep the generic message for other unknown flags. Evidence: scratch/evidence/lane-14-removed-flags.txt, Messages and Required CLI test command.
- [x] T053 [15] REQ-029: distinguish a plain folder outside the specs root from a folder reached through a linked parent. Evidence: scratch/evidence/lane-15-refusal-wording.txt, Plain folder and linked-parent cases.
- [x] T054 [16] REQ-026: complete the operator-approved 016/009 compatibility run in the sandbox v3 checkout. Evidence: scratch/evidence/lane-16-009-compat-run.txt, Outcome and p8-validate.
- [x] T055 [17] REQ-026: run the 016/015 T022 corpus apply twice in a throwaway clone. Apply 1 moved passing packets from 4282 of 4335 to 4335 of 4335. Apply 2 planned no changes, changed no files and kept all 4335 packets passing. Evidence: scratch/evidence/lane-17-t022-corpus.txt:30, scratch/evidence/lane-17-t022-corpus.txt:31, scratch/evidence/lane-17-t022-corpus.txt:110, scratch/evidence/lane-17-t022-corpus.txt:112 and scratch/evidence/lane-17-t022-corpus.txt:117.
- [x] T056 [18] REQ-026: rerun CHK-FIX-006 under a plain non-default TMPDIR and a hostile environment. Evidence: scratch/evidence/lane-18-hostile-rerun.txt, Plain run and Hostile run output.
- [x] T057 [19] REQ-031: record the fresh review and its seven P2 findings. Evidence: scratch/evidence/lane-19-opus-review.txt, Verdict and Findings.
- [x] T058 [fixA] REQ-031: fix P2-1 system-link wording and P2-7 catalog flags wording. Evidence: scratch/evidence/lane-15-refusal-wording.txt, Review fix P2-1 and P2-7.
- [x] T059 [fixB] REQ-031: fix P2-2 linked-directory containment and P2-6 incomplete-child rollup. Evidence: scratch/evidence/lane-13-inside-links.txt, Review fix P2-2 and P2-6.
- [x] T060 [fixC] REQ-031: fix P2-3 archive prefix walking and P2-4 restore wording. Evidence: scratch/evidence/lane-3-archive.txt, Review fix P2-3 and P2-4.
- [x] T061 [fixD] REQ-031: name upgrade-legacy.manifest.json in both release notes. Evidence: scratch/evidence/decision-ledger.txt:52. Both documents validate VALID with 0 issues.
- [x] T062 [fixE] REQ-031: update the catalog Symbolic Links paragraph to name all three folder refusals. Evidence: scratch/evidence/decision-ledger.txt:52. The document validates VALID with 0 issues.
- [x] T063 REQ-030: delete the deprecated specs/sk-communication track and complete its impact check. Evidence: scratch/evidence/decision-ledger.txt:44.
- [x] T071 [21] REQ-014: run T046-26 under full CPU load on the final code, its unmutated control and the 6 ms mutant. The final code and control pass and the mutant fails. Evidence: scratch/evidence/lane-21-t046-under-load.txt:25, scratch/evidence/lane-21-t046-under-load.txt:30, scratch/evidence/lane-21-t046-under-load.txt:34 and scratch/evidence/lane-21-t046-under-load.txt:37.
- [x] T072 [20] REQ-026: recheck each residual 016 child box against its evidence. Four boxes are ticked and 011 goal criterion 3 remains open by design. Evidence: scratch/evidence/lane-20-016-residual-boxes.txt:11, scratch/evidence/lane-20-016-residual-boxes.txt:21, scratch/evidence/lane-20-016-residual-boxes.txt:31 and scratch/evidence/lane-20-016-residual-boxes.txt:40.
- [x] T073 [23] REQ-026: run each of the five 015 lane modes alone on a matching defect and validate the packet after apply. Evidence: scratch/evidence/lane-23-015-per-mode.txt:78, scratch/evidence/lane-23-015-per-mode.txt:167, scratch/evidence/lane-23-015-per-mode.txt:252, scratch/evidence/lane-23-015-per-mode.txt:330 and scratch/evidence/lane-23-015-per-mode.txt:426.
- [x] T074 [22, fixH] REQ-032: reproduce the frontmatter description defect, pass the fixed-code checks and revert mutant, repair all 40 descriptions and compare packet validations before and after. Evidence: scratch/evidence/lane-22-fill-description.txt:12, scratch/evidence/lane-22-fill-description.txt:15, scratch/evidence/lane-22-fill-description.txt:73, scratch/evidence/lane-22-fill-description.txt:76 and scratch/evidence/lane-22-fill-description.txt:121.
- [x] T075 [26, fixL] REQ-033: import getSpecsBasePaths through the public runtime API and pass the CLI import-policy check. Evidence: scratch/evidence/lane-26-import-policy.txt:4 and scratch/evidence/lane-26-import-policy.txt:63.
- [x] T076 [27, fixM] REQ-034: clean only repository-root scratch created by the validation-gate and strict-freshness tests. Evidence: scratch/evidence/lane-27-root-scratch.txt:18, scratch/evidence/lane-27-root-scratch.txt:25 and scratch/evidence/lane-27-root-scratch.txt:52.
- [x] T077 [28, fixN] REQ-035: refuse a dangling reversibility-manifest link in dry run and apply without creating its target. Evidence: scratch/evidence/lane-28-dangling-manifest.txt:4, scratch/evidence/lane-28-dangling-manifest.txt:10 and scratch/evidence/lane-28-dangling-manifest.txt:22.
- [x] T078 [8 R4, fixR] REQ-036: treat a stored text-null parent id as JSON null in the merge so the next re-derive clears it and METADATA_DISK_PATH_CONSISTENCY passes. The review fix also covers a stored " NULL " in the merge test, quotes the stored parent in the path-check detail and normalizes the text at parse in `graph-metadata-schema.ts`. A fresh Opus high read-only review found no P0 or P1 and three P2s, and all three are fixed. Evidence: scratch/evidence/lane-text-null-parent.txt:4, scratch/evidence/lane-text-null-parent.txt:9, scratch/evidence/lane-text-null-parent.txt:10, scratch/evidence/lane-text-null-parent.txt:16, scratch/evidence/lane-text-null-parent.txt:17, scratch/evidence/lane-text-null-review-fixes.txt:4, scratch/evidence/lane-text-null-review-fixes.txt:8, scratch/evidence/lane-text-null-review-fixes.txt:11, scratch/evidence/lane-text-null-review-fixes.txt:15 and scratch/evidence/lane-text-null-review-fixes.txt:19.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T037 Run the final gate from the final state. Evidence: scratch/evidence/lane-24-final-gate.txt, section 4. G7 ran all 19 jobs with 115 of 117 steps returning rc 0. The two failed steps are documented in sections 4 and 6.
- [x] T038 Compare the repository root and specs listings with T003. Evidence: scratch/evidence/lane-25-closeout-checks.txt, Check 3, and scratch/evidence/lane-24-final-gate.txt, section 4, ROOT RESIDUE AFTER THE GATE. The root and specs listings were compared with T003. Root scratch/ was absent after fixM. The ignored .pytest_cache at the root predates G7.
- [x] T039 Run strict validation on this folder and the 034 parent, then reconcile acceptance rows. Evidence: scratch/evidence/lane-29-final-rederive.txt. The 021 packet and the 034 parent printed RESULT: PASSED.
- [x] T040 Write the implementation summary and the 021 changelog entry. Evidence: implementation-summary.md, Metadata and How It Was Delivered. ../changelog/changelog-034-021-follow-up-defect-fixes.md exists and will be regenerated by the orchestrator after this pass.
- [x] T064 REQ-026: finish the 016 child task document pass and align each child status with its evidence. Evidence: scratch/evidence/lane-20-016-residual-boxes.txt:11, scratch/evidence/lane-20-016-residual-boxes.txt:21, scratch/evidence/lane-20-016-residual-boxes.txt:31, scratch/evidence/lane-20-016-residual-boxes.txt:40, scratch/evidence/lane-23-015-per-mode.txt:78, scratch/evidence/lane-23-015-per-mode.txt:167, scratch/evidence/lane-23-015-per-mode.txt:252, scratch/evidence/lane-23-015-per-mode.txt:330 and scratch/evidence/lane-23-015-per-mode.txt:426. The sibling 015 summary records items 5 and 11 at ../016-research-recommendations/015-lane-rules-as-heal-modes/implementation-summary.md:194 and ../016-research-recommendations/015-lane-rules-as-heal-modes/implementation-summary.md:200. fixF and fixG are recorded in scratch/evidence/decision-ledger.txt:55 and scratch/evidence/decision-ledger.txt:56. The ledger records fixJ at scratch/evidence/decision-ledger.txt:84 and fixK at scratch/evidence/decision-ledger.txt:85. The 015 summary shows fixJ at ../016-research-recommendations/015-lane-rules-as-heal-modes/implementation-summary.md:194 and :200. The four corrected fixK prefixes appear at ../016-research-recommendations/009-doctor-update-compatibility/tasks.md:62, ../016-research-recommendations/011-anchor-repair-mode/plan.md:180, ../016-research-recommendations/015-lane-rules-as-heal-modes/tasks.md:69 and ../016-research-recommendations/015-lane-rules-as-heal-modes/implementation-summary.md:190.
- [x] T065 REQ-017: re-derive generated metadata after the packet document pass. Evidence: scratch/evidence/lane-29-final-rederive.txt. The 021 packet repaired one derived item and the second preview found nothing repairable.
- [x] T066 REQ-017: rebuild the trigger index after the deprecated track deletion. Evidence: scratch/evidence/lane-24-final-gate.txt, section 1. The rebuild and --check exited 0 with zero obsolete paths and zero untrusted docs.
- [x] T067 REQ-017: run the final 19-job gate with load sampled and validate the 034 parent. Evidence: scratch/evidence/lane-24-final-gate.txt, sections 4 and 5, and scratch/evidence/lane-29-final-rederive.txt. G7 recorded 115 of 117 steps with rc 0. Every suite this phase touches met or beat T002. The 034 parent printed RESULT: PASSED. The two failed steps are documented in lane-24 section 6.
- [x] T068: commit the packet work after the final gate. Evidence: scratch/evidence/post-push-ci.txt, Pushed range, all 15 commits. scratch/evidence/decision-ledger.txt:97 records the sandbox-test repair commit with the file-only remint bypass.
- [x] T069: push the branch. Evidence: scratch/evidence/post-push-ci.txt, PUSH, exit 0, b62e142852..01db8367c3 HEAD -> main.
- [x] T070: record CI results. Evidence: scratch/evidence/post-push-ci.txt, CI ON and THE ONE FAILURE. Thirteen of 14 workflows succeeded. Routing Registry Drift Guard failed on main's corpus pin.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked [x]. Evidence: each completed task row above names its supporting record. The closeout rows cite scratch/evidence/lane-30-post-rebase-gate.txt, scratch/evidence/post-push-ci.txt, implementation-summary.md and ../changelog/changelog-034-021-follow-up-defect-fixes.md.
- [x] No `[B]` blocked tasks remain. Evidence: tasks.md, Phases 1 to 3, no blocked task rows.
- [x] Every acceptance row is Met and the final gate evidence is saved. Evidence: acceptance-criteria.md, section 2. G7 evidence appears in scratch/evidence/lane-24-final-gate.txt, sections 4 to 6. G8 evidence appears in scratch/evidence/lane-30-post-rebase-gate.txt, SUMMARY. Post-push CI evidence appears in scratch/evidence/post-push-ci.txt, CI ON.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance criteria**: See `acceptance-criteria.md`
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

- [x] CHK-001 [P0] Requirements in spec.md name their evidence, class and lane. Evidence: spec.md, section 4, REQ-001 to REQ-035.
- [x] CHK-002 [P0] Technical approach in plan.md names each lane write set, red case and mutant. Evidence: plan.md, section 3 lane table and affected-surfaces addendum.
- [x] CHK-003 [P1] The four original operator decisions are carried into spec.md and plan.md. Evidence: lane-1-healer.txt, Operator decision 1. lane-3-archive.txt, Operator decision 2. lane-10-child-marker.txt, Operator decisions applied.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Each lane's files pass their lint or type check: `tsc --noEmit` for the TypeScript lanes, `bash -n` for the launcher and archive and `python3 -m py_compile` for the plugin. Evidence: scratch/evidence/lane-25-closeout-checks.txt, Check 4. The two nonzero gate steps are outside this packet's write set.
- [x] CHK-011 [P0] No new console error or warning in any lane's test output beyond the refusal lines the cases expect. Evidence: scratch/evidence/lane-25-closeout-checks.txt, Check 5.
- [x] CHK-012 [P1] Each refusal returns its documented exit status and writes, reads or moves nothing through the refused path. Evidence: scratch/evidence/lane-13-inside-links.txt, Review fix P2-2 and Test counts before and after.
- [x] CHK-013 [P1] Each new test keeps the helpers and style of its neighbors. Evidence: scratch/evidence/lane-25-closeout-checks.txt, Check 11.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria are met. Evidence: acceptance-criteria.md, section 2, AC-001 to AC-035. AC-017 records the G7 exceptions and both strict validation results.
- [x] CHK-021 [P0] Manual testing: the B-11 fixture and archive alias fixture run once from a shell, with exit status read. Evidence: scratch/evidence/lane-25-closeout-checks.txt, Check 6.
- [x] CHK-022 [P1] Edge cases cover outside, inside, dangling and plain cases for lanes 1 to 6 and the boundary rows for lanes 7 and 8. Evidence: scratch/evidence/lane-25-closeout-checks.txt, Check 7 and scratch/evidence/lane-28-dangling-manifest.txt:22.
- [x] CHK-023 [P1] Error scenarios cover a post-planning link, invalid JSON, dangling manifest and unanchored report root. Evidence: lane-6-repair-derived.txt, Red and Green. lane-4-leaf-check.txt, Red and Green. lane-2-backfill.txt, Red and Green.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class in spec.md section 4. Evidence: spec.md, section 4, REQ-001 to REQ-035.
- [x] CHK-FIX-002 [P0] Same-class producer inventories are rechecked for lanes 1 and 6, and instance-only status is shown for other findings. Evidence: lane-1-healer.txt, SAME-CLASS INVENTORY. lane-6-repair-derived.txt, Same-class inventory.
- [x] CHK-FIX-003 [P0] Consumer inventories cover the changed backfill CLI, manifest and roots helpers, graph derivation and AI_SESSION_CHILD. Evidence: scratch/evidence/lane-25-closeout-checks.txt, Check 8.
- [x] CHK-FIX-004 [P0] Path fixes include delimiter, joined-input, outside-root, no-op and fallback tests. Evidence: scratch/evidence/lane-12-anchor-repair-boxes.txt, Box 1, and scratch/evidence/lane-25-closeout-checks.txt, Check 7.
- [x] CHK-FIX-005 [P1] Matrix axes and row counts for lanes 1 and 10 are listed before completion. Evidence: plan.md, section 3, Required inventories, and scratch/evidence/lane-12-anchor-repair-boxes.txt, Box 2.
- [x] CHK-FIX-006 [P1] Hostile environment checks run for lanes that read process-wide state. Evidence: scratch/evidence/lane-18-hostile-rerun.txt:37 and scratch/evidence/lane-18-hostile-rerun.txt:42. The final hostile run passed 122 of 122 tests.
- [x] CHK-FIX-007 [P1] Evidence is pinned to the pushed range b62e142852..01db8367c3. Evidence: scratch/evidence/post-push-ci.txt, Pushed range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets appear in changed files. Evidence: scratch/evidence/lane-25-closeout-checks.txt, Check 9.
- [x] CHK-031 [P0] Input validation covers --folder, --root, --roots and archive arguments. Evidence: lane-1-healer.txt, LANE 1 ADDENDUM 2, GREEN. lane-2-backfill.txt, Green. lane-3-archive.txt, Green. lane-5-upgrade-legacy.txt, Green and section 2, Test counts.
- [x] CHK-032 [P1] Error messages do not echo the content of a refused or unparsed file. Evidence: lane-6-repair-derived.txt, Red and Green.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] The spec, plan, tasks and acceptance criteria record the same completed status and current evidence. Evidence: spec.md, Metadata and Decisions 34 to 37. plan.md, lanes 30 and post-push CI record. tasks.md, Phase 3 and Verification Summary. acceptance-criteria.md, Metadata and Closure Statement.
- [x] CHK-041 [P1] Code comments state the durable reason and contain no packet or task id. Evidence: scratch/evidence/lane-25-closeout-checks.txt, Check 10.
- [x] CHK-042 [P2] The healer usage and leaf scripts README describe the changed behavior. Evidence: lane-1-healer.txt, GREEN (fixed code). lane-4-leaf-check.txt, Files changed.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temporary files stay in scratch/. Evidence: scratch/ contains only evidence/ and the empty scaffold .gitkeep. The .gitkeep is not a temporary file.
- [x] CHK-051 [P1] scratch/ is cleaned before completion. Evidence: scratch/ contains only evidence/ and the empty scaffold .gitkeep. The .gitkeep is not a temporary file.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-10-11. All tasks and checklist items are complete. The pushed range and CI record appear in scratch/evidence/post-push-ci.txt.
<!-- /ANCHOR:summary -->

---
