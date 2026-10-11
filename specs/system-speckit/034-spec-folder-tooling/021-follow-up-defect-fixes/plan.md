---
title: "Implementation Plan: Phase 21: follow-up-defect-fixes"
description: "Ten original code lanes with follow-up rounds, the 016 audit, open-box work and a final gate."
trigger_phrases:
  - "follow up defect fixes plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 21: follow-up-defect-fixes

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node CJS and MJS scripts, TypeScript run through tsx, bash 3.2 and 5.2, Python 3 for the Hermes plugin |
| **Framework** | The spec-kit runtime CLI and its libraries, the worktree launcher and the Hermes repo-guards plugin |
| **Storage** | No code lane applies a repair to the real specs tree. The 016 audit and open-box lanes update only the named child task records |
| **Testing** | vitest (`npm --prefix .skilled/skills/system-spec-kit/runtime/cli test` and the root project), `node` for the sk-create-skill `.test.cjs` files, `bash .skilled/bin/tests/worktree-session.test.sh` and `python3 -m unittest` for the Hermes plugin |

### Overview
Phase 020 found the original defects behind REQ-001 to REQ-016. Ten code lanes handle that work. Follow-up lanes 13 to 23 record inside-link behavior, removed flags, refusal wording, the 009 compatibility run, the 015 corpus run, the hostile rerun, the review, residual-box checks and per-mode validation. Residual lanes res1 and res2 close evidence-backed work. Fix lanes fixA to fixN address the review findings, the description defect and the later closeout fixes. Lanes 24 and 25 record the final gate and closeout checks. G7 ran after the generated-metadata re-derive and trigger-index rebuild. It recorded 115 of 117 steps with rc 0. The two failures are outside this phase. Evidence: scratch/evidence/lane-24-final-gate.txt, sections 1 and 4 to 6, and scratch/evidence/lane-29-final-rederive.txt. Evidence records red, green and mutant runs where available. Missing runs remain open in tasks.md and acceptance-criteria.md.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] The lane's defect is re-read in the current tree, and its line numbers are confirmed or corrected in the lane's evidence file.
- [ ] The operator has answered every decision needed by the planned lane round.
- [ ] The red run is saved in `scratch/evidence/` and was captured on the unfixed code.

### Definition of Done
- [ ] The green run and each mutant run are saved in `scratch/evidence/`, and the acceptance row names all three.
- [ ] The lane's own test files pass, and the lane's neighbor checks named in section 3 pass.
- [ ] `validate.sh --strict` prints RESULT: PASSED on this folder at closeout.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Refuse, then act. A tool that checks a link refuses it at the step that reads, writes or moves, and it refuses before it touches any byte. A generator that cuts or leaks text is fixed at the producer. A test that depends on the machine or leaves residue is fixed in the test.

### Key Components

The write sets do not overlap, so lanes 2, 4, 5, 6, 7, 8 and 9 can run in parallel at once. Lanes 1, 3 and 10 run in parallel with them once their decision is answered. Lanes 11 and 12 follow the code lanes. Follow-up lanes 13 to 23, residual lanes res1 and res2 and fix lanes fixA to fixN record new evidence and review fixes. Lanes 24 and 25 record the final gate and closeout checks. The final 19-job gate runs after generated metadata and the trigger index are rebuilt. Paths are relative to `.skilled/skills/system-spec-kit/runtime/` unless they start with a dot.

| Lane | REQ | Files (write set) | Red case first | Mutant that proves the changed guard | Neighbor checks |
|------|-----|-------------------|----------------|--------------------------------------|-----------------|
| 1. Healer no-roots rule | REQ-001 | `cli/spec/heal-spec-docs.cjs`, `cli/tests/heal-symlink-containment.vitest.ts` and `cli/spec/README.md`. Only if the baseline names them, also `cli/tests/heal-anchor-repair.vitest.ts`, `heal-lane-modes.vitest.ts`, `heal-provenance.vitest.ts`, `anchor-repair-sample.vitest.ts` and `heal-target-parity.vitest.ts` | The B-11 fixture rebuilt under `scratch/`: a linked parent outside every root, the working directory outside every repository, no `--roots`. Today the apply exits 0 and the outside `spec.md` digest changes | M1-a: the no-anchor branch of `folderRefusal` returns null again, so the new case fails on the outside digest. Decision 1 answered "Refuse, ask for --roots" | The seven healer files, 135 of 135 at the end of 020. The upgrade-legacy heal step, which passes `--folder` inside a repository |
| 2. Backfill root | REQ-002, REQ-003 | cli/graph/backfill-graph-metadata.ts and cli/tests/graph-metadata-backfill.vitest.ts | (a) The CLI runs --all --root on an anchored fixture outside the repository. (b) executeBackfill writes a report under a root without an .opencode anchor | M2-a removes the CLI containment check. M2-b removes the report-root check. Decision D7 measures containment against the working directory repository | backfill-prune-report-gate.vitest.ts and scoped-backfill-boundary.vitest.ts stay green |
| 3. Archive alias | REQ-004 | `cli/spec/archive.sh`, `cli/tests/archive-track.vitest.ts` | `specs/002-alias` is a relative link to `specs/001-real`. `archive.sh --force specs/002-alias` exits 0 today, moves `001-real` and leaves `002-alias` dangling | M3-a: the new argument link check is removed, so the case sees exit 0 and a dangling alias. Decision 2 answered "Refuse a linked argument" | Every existing case of `archive-track.vitest.ts`, whose count T002 records |
| 4. Leaf manifest check | REQ-005 | `.skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs`, its `tests/generate-leaf-manifest-scopes.test.cjs` and the scripts `README.md` | A `leaf-manifest.json` link to an outside file with fresh bytes: `--check` prints OK and exits 0 today. A dangling link under `--check` | M4-a: the link check in `runCheck` is removed, so the fresh-bytes case exits 0 again | `ci-leaf-manifest-freshness.test.cjs`, `leaf-resource-contract.test.cjs` and the `--check` run on every hub, all exit 0 |
| 5. upgrade-legacy reads | REQ-006, REQ-007 | `cli/spec/upgrade-legacy.mjs`, `cli/tests/upgrade-legacy.vitest.ts` | (a) The reversibility manifest in the git dir is a link to an outside manifest whose recorded HEAD matches, and the run reuses its baseline today. (b) `--roots linkOut/../specs`, where `linkOut` points outside, is accepted today as `REPO/specs` | M5-a: the link check in `readManifestIfExists` is removed, so case (a) reads through. M5-b: the `..` refusal in `resolveRoots` is removed, so case (b) is accepted | The 53 cases of `upgrade-legacy.vitest.ts` from the end of 020 |
| 6. repair-derived apply reads | REQ-008, REQ-009 | `cli/spec/repair-derived.cjs`, `cli/tests/repair-derived.vitest.ts` | (a) The 020 race preload, extended to record every path that `fs.readFileSync` and `fs.openSync` receive, plants a link to an outside file after planning. The record shows the outside path read today. (b) A `description.json` turned into invalid JSON with a marker string after planning, with no link: the FAILED line carries the marker today | M6-a: the apply read helper skips its link check, so case (a) records the outside read. M6-b: the apply catch reports `err.message` again, so case (b) finds the marker | The 29 cases of `repair-derived.vitest.ts` from the end of 020, including both race cases |
| 7. Changelog generator | REQ-010, REQ-011 | `cli/spec-folder/nested-changelog.ts`, `cli/tests/nested-changelog.vitest.ts` | (a) A fixture whose implementation summary lists 13 files: the output has 12 rows today. (b) A paragraph with an inline `<!-- ... -->` comment, one of them spanning a line break: the comment text reaches the output today | M7-a: `rows.slice(0, 12)` is restored, so case (a) counts 12. M7-b: the comment strip in `cleanInlineMarkdown` is removed, so case (b) finds the comment | The rest of `nested-changelog.vitest.ts` |
| 8. Lean parent status | REQ-012 | lib/graph/graph-metadata-parser.ts and runtime/tests/graph-metadata-schema.vitest.ts | A child folder without loadable graph-metadata.json must prevent a false complete rollup. A parent with no loadable child keeps its stored status | M8-a removes the missing-child guard. M8-b changes the all-child rule to some-child. D5 sets the corrected rule | The rest of graph-metadata-schema.vitest.ts and a dry-run flip list. No metadata is applied during the scan |
| 9. Test hygiene | REQ-013, REQ-014 | cli/tests/ci-rule-set-comparison.vitest.ts and runtime/tests/folder-discovery-integration.vitest.ts | (a) The comparison test must not leave a root scratch folder. (b) T046-26 uses repeated calls after warm-up and must pass under real CPU load | M9-a removes scratch cleanup. M9-b adds a 6 ms delay to the measured function | The other cases in both files and the root project. Lane 21 records the under-load green and 6 ms mutant failure |
| 10. Child marker | REQ-015, REQ-016 | `.skilled/bin/worktree-session.sh`, `.skilled/bin/tests/worktree-session.test.sh`, `.hermes/plugins/repo-guards/__init__.py`, `.hermes/plugins/repo-guards/tests/test_repo_guards.py` | (a) A stub runtime that prints its environment, launched through the launcher in a fixture repository: it sees `AI_SESSION_CHILD=1` today. (b) The Hermes plugin with only `AI_SESSION_CHILD=1` set runs the gate classify core today | M10-a: line 458 exports `AI_SESSION_CHILD=1` again, so case (a) fails. M10-b: child detection no longer reads the new launcher marker, so a nested call allocates a second worktree in the dry-run plan. M10-c: `_orchestrated_leaf` requires the pair again, so case (b) fails. Decision 3 answered "A dedicated marker", with the marker named `SKILLED_WORKTREE_SESSION` or similar, and decision 4 answered "AI_SESSION_CHILD=1 alone" | `worktree-guard.sh` behavior unchanged. The gate core's `isChildSession` unchanged. The rest of both test files |
| 1 R2. Healer level reads | REQ-019 | cli/spec/heal-spec-docs.cjs and cli/tests/heal-symlink-containment.vitest.ts | A linked spec.md must not supply the level used to write sibling docs | M1-b removes the declaredLevel link check. M1-c removes the levelFromSpec link check | The seven healer files and mutants M1-b and M1-c |
| 1 R3. Healer arguments | REQ-023 | cli/spec/heal-spec-docs.cjs and healer tests | Unknown options and missing --folder or --roots values in every mode | Add argument checks that exit 2 before work begins | Evidence: scratch/evidence/lane-1-healer.txt, LANE 1 ADDENDUM 2, GREEN and MUTANTS |
| 3 R2. Archive restore | REQ-018 | cli/spec/archive.sh and cli/tests/archive-track.vitest.ts | A restore argument through a linked track exits 1 and moves nothing | M3-b removes the restore refusal and reproduces the unfixed move | Green and M3-b are recorded. The unfixed checkout red was not run |
| 5 R2. Apply lock | REQ-024 | cli/spec/upgrade-legacy.mjs and cli/tests/upgrade-legacy.vitest.ts | An existing .skilled/release/.apply.lock prevents apply | The code check exits 2 before changes | Evidence: scratch/evidence/lane-5-upgrade-legacy.txt, section 2, Test counts and Mutant M5-c. The four focused lock cases pass. The full-file neighbor failure is recorded in the evidence. |
| 6 R2. Re-derive child read | REQ-020 | cli/spec/repair-derived.cjs and cli/tests/repair-derived.vitest.ts | Measure paths the child reads after planning, then refuse a link before the child starts | M6-c removes the guard and restores the measured reads | The round 2 measurement records 12 reads in scratch/evidence/lane-6-repair-derived.txt |
| 6 R3. Narrow re-derive guard | REQ-020 | cli/spec/repair-derived.cjs and cli/tests/repair-derived.vitest.ts | The guard covers the measured read set and allows an unrelated in-packet changelog link | Add the narrow check and prove the live in-packet link remains allowed | Evidence: scratch/evidence/lane-6-repair-derived.txt, Round 3, Green and Mutant M6-d. The upgrade-legacy neighbor check still fails for an in-packet linked plan.md. Follow-on handling of internal links remains open. |
| 8 R2. Missing-child rollup | REQ-012 | lib/graph/graph-metadata-parser.ts and runtime/tests/graph-metadata-schema.vitest.ts | A child without loadable metadata counts as incomplete. With no loadable child, preserve the parent's stored status | M8-a removes the missing-child rule. M8-b changes every-child to some-child | Evidence in scratch/evidence/lane-8-lean-parent.txt, sections 4 and 9 |
| 8 R3. Linked source readers | REQ-025 | lib/graph/graph-metadata-parser.ts, lib/graph/generated-metadata-drift.ts and their tests | readDoc refuses a link before reading. computeSourceDocHashes skips linked source docs | M8-c restores the linked read. M8-d restores the linked hash | Evidence in scratch/evidence/lane-8-lean-parent.txt, Linked canonical docs during metadata derivation |
| 10 R2. Launcher follow-up | REQ-021, REQ-022 | .skilled/bin/worktree-session.sh and .skilled/bin/tests/worktree-session.test.sh | Fix SC2088 without changing the tilde case. Export SYSTEM_SPEC_GATE_ENFORCE=0 only for dispatched children | M10-d restores the export on every exec-in-place path | Evidence in scratch/evidence/lane-10-child-marker.txt, Follow-up section |
| 11. 016 child audit | REQ-026 | The 016 child task records for 003, 009, 011 and 015 | Reconcile each open box with its evidence and the child's status | No code mutant. The audit record is the proof | Lane 11 records the audit in scratch/evidence/lane-11-016-audit.txt, VERDICT. Later child-box follow-up is recorded in lanes 12, 16, 18, 20 and 23. |
| 12. 016/011 boxes | REQ-026 | The 016/011 task record and the approved 009 and 015 follow-up records | Run the requested checks and manual steps, then record each status with evidence | No code mutant. Child task evidence is the proof | Lane 11 records the audit, lane 16 the approved 009 run, lane 18 the hostile rerun, lane 20 the residual boxes and lane 23 the per-mode checks. The T022 corpus apply-twice run is complete. 011 goal criterion 3 remains open by design. Evidence: scratch/evidence/lane-20-016-residual-boxes.txt:40, scratch/evidence/lane-23-015-per-mode.txt:426 and scratch/evidence/decision-ledger.txt:63 |
| 13. Inside links | REQ-027 | Graph readers, source hashing, re-derive guard and tests | Outside directory link and inside-link controls | Outside-link and inside-link mutants | scratch/evidence/lane-13-inside-links.txt, Scope and Test counts before and after |
| 14. Removed healer flags | REQ-028 | Healer argument parser and CLI tests | Removed --mode and --json plus unknown-option control | Generic-message mutant | scratch/evidence/lane-14-removed-flags.txt, Messages and Required CLI test command |
| 15. Refusal wording | REQ-029 | Healer folder refusal and tests | Plain outside-root folder and linked-parent control | Old-message mutant | scratch/evidence/lane-15-refusal-wording.txt, Review fix P2-1 and P2-7 |
| 16. 009 compatibility run | REQ-026 | Sandbox v3 checkout and 016/009 task record | Operator-approved move and upgrade approvals | No code mutant | scratch/evidence/lane-16-009-compat-run.txt, Outcome and p8-validate |
| 17. 015 corpus run | REQ-026 | Throwaway clone and 016/015 T022 | Apply 1 moved passing packets from 4282 of 4335 to 4335 of 4335. Apply 2 planned no changes | No code mutant | scratch/evidence/lane-17-t022-corpus.txt:30, scratch/evidence/lane-17-t022-corpus.txt:31 and scratch/evidence/lane-17-t022-corpus.txt:117 |
| 18. Hostile rerun | REQ-026 | Upgrade-legacy and anchor-repair tests | Non-default TMPDIR and hostile environment | CHK-FIX-006 rerun | scratch/evidence/lane-18-hostile-rerun.txt, Plain run and Hostile run output |
| 19. Opus review | REQ-031 | Reviewed build and affected tests | Review found seven P2 findings, six confirmed by a run | Mutants and focused suites are recorded in the review evidence | scratch/evidence/lane-19-opus-review.txt, Verdict and Findings |
| fixA. System-link wording and catalog flags | REQ-031 | Healer wording and tooling catalog | P2-1 and P2-7 | Old-message mutant and stale-text check | scratch/evidence/lane-15-refusal-wording.txt, Review fix P2-1 and P2-7 |
| fixB. Directory links and rollup | REQ-031 | Graph parser, source hash, re-derive guard and tests | P2-2 linked directories and P2-6 incomplete-child rollup | Four mutants | scratch/evidence/lane-13-inside-links.txt, Review fix P2-2 and P2-6 |
| fixC. Archive prefix and restore wording | REQ-031 | archive.sh and archive-track tests | P2-3 absolute-prefix walk and P2-4 restore verb | Two mutants | scratch/evidence/lane-3-archive.txt, Review fix P2-3 and P2-4 |
| fixD. Release-note manifest name | REQ-031 | Two release notes | P2-5 names upgrade-legacy.manifest.json | Both documents validate VALID with 0 issues | scratch/evidence/decision-ledger.txt:52 |
| fixE. Catalog folder refusals | REQ-031 | System-spec-kit tooling catalog | Symbolic Links paragraph names all three folder refusals | Document validates VALID with 0 issues | scratch/evidence/decision-ledger.txt:52 |
| 20. 016 residual boxes | REQ-026 | 016 child plan and goal records | Check each residual box against its source evidence | No code mutant. Each box verdict is the proof | Four boxes are ticked. 011 goal criterion 3 remains open by design. Evidence: scratch/evidence/lane-20-016-residual-boxes.txt:11, scratch/evidence/lane-20-016-residual-boxes.txt:21, scratch/evidence/lane-20-016-residual-boxes.txt:31 and scratch/evidence/lane-20-016-residual-boxes.txt:40 |
| 21. T046-26 under load | REQ-014 | Final code, an unmutated control and a 6 ms mutant | Run with 18 busy loops, one per core, while an upgrade-legacy apply also runs | The mutant fails at 6.69 ms against the 5 ms limit | Final code and control pass. Evidence: scratch/evidence/lane-21-t046-under-load.txt:25, scratch/evidence/lane-21-t046-under-load.txt:30, scratch/evidence/lane-21-t046-under-load.txt:33 and scratch/evidence/lane-21-t046-under-load.txt:37 |
| 22. Fill description | REQ-032 | Frontmatter description inference and affected packet docs | Missing description reads a frontmatter key as its body sentence | Revert mutant restores the defect | Red, green, mutant, build, 40 repairs and before-and-after packet validation are recorded. Evidence: scratch/evidence/lane-22-fill-description.txt:12, scratch/evidence/lane-22-fill-description.txt:15, scratch/evidence/lane-22-fill-description.txt:73, scratch/evidence/lane-22-fill-description.txt:76 and scratch/evidence/lane-22-fill-description.txt:121 |
| 23. 015 per-mode validation | REQ-026 | Five scratch packet copies with a mode-specific defect | Apply each lane mode by itself | No code mutant. The action and strict validation are the checks | Each mode reports an action and the packet prints RESULT: PASSED. Evidence: scratch/evidence/lane-23-015-per-mode.txt:78, scratch/evidence/lane-23-015-per-mode.txt:167, scratch/evidence/lane-23-015-per-mode.txt:252, scratch/evidence/lane-23-015-per-mode.txt:330 and scratch/evidence/lane-23-015-per-mode.txt:426 |
| res1. 016 residual-box check | REQ-026 | 016 children 003, 009, 011 and 015 | Recheck each residual box | No code mutant. Each verdict is the proof | 003 plan section 7.4, 011 SH-01 and goal criterion 1 and 015 phase 13 fixtures are ticked. 011 goal criterion 3 stays open by design. Evidence: scratch/evidence/decision-ledger.txt:56 and scratch/evidence/lane-20-016-residual-boxes.txt:40 |
| res2 (LUNA). 015 T022 and per-mode follow-up | REQ-026 | Throwaway clone and per-mode scratch packets | The orchestrator ran the T022 apply-twice corpus in lane 17. res2 ticked 015 T022 and ran the per-mode probe in lane 23 | No code mutant | Corpus apply 2 planned no changes and each of the five mode validations passed. Evidence: scratch/evidence/decision-ledger.txt:63, scratch/evidence/lane-17-t022-corpus.txt:117, scratch/evidence/lane-23-015-per-mode.txt:78, scratch/evidence/lane-23-015-per-mode.txt:167, scratch/evidence/lane-23-015-per-mode.txt:252, scratch/evidence/lane-23-015-per-mode.txt:330 and scratch/evidence/lane-23-015-per-mode.txt:426 |
| fixF (DeepSeek). 016 child task corrections | REQ-026 | 016/009 and 016/011 tasks.md | Relabel ticked boxes from OPEN to Was open and restore the 009 CHK-023 move-step and manifest-refusal coverage | No code mutant. The corrected task rows are the proof | Evidence: scratch/evidence/decision-ledger.txt:55, ../016-research-recommendations/009-doctor-update-compatibility/tasks.md:130 and ../016-research-recommendations/011-anchor-repair-mode/tasks.md:61 |
| fixG (DeepSeek). Residual-box wording | REQ-026 | 016/003 plan and 016/011 Known Limitations | Record the 011 goal criterion 3 limitation and correct the 003 box status | No code mutant. The corrected wording is the proof | Evidence: scratch/evidence/decision-ledger.txt:56 and scratch/evidence/lane-20-016-residual-boxes.txt:40 |
| fixH. Frontmatter description fill | REQ-032 | Frontmatter description inference, tests and 40 affected descriptions | Missing description receives body text after leading frontmatter blocks | Revert mutant restores the title-key defect | Red, green, mutant, repair and packet validation checks pass. Evidence: scratch/evidence/lane-22-fill-description.txt:3, scratch/evidence/lane-22-fill-description.txt:73, scratch/evidence/lane-22-fill-description.txt:76 and scratch/evidence/lane-22-fill-description.txt:121 |
| fixI (DeepSeek). Release-note wording | REQ-032 | Both release notes | Correct the Linked Paths and Lean Parents wording and add the frontmatter-fill entry | No code mutant. The updated release notes are the proof | .skilled/changelog/skilled/v4.0.0.4.md:202, .skilled/changelog/skilled/v4.0.0.4.md:208, .skilled/changelog/skilled/v4.0.0.4.md:224, .skilled/skills/system-spec-kit/changelog/v2.7.1.0.md:196, .skilled/skills/system-spec-kit/changelog/v2.7.1.0.md:202 and .skilled/skills/system-spec-kit/changelog/v2.7.1.0.md:218 |
| fixJ (DeepSeek). 015 Known Limitations wording | REQ-026 | 016/015 implementation-summary.md | Correct Known Limitations items 5 and 11 | No code mutant. The updated limitation entries are the proof | ../016-research-recommendations/015-lane-rules-as-heal-modes/implementation-summary.md:194 and ../016-research-recommendations/015-lane-rules-as-heal-modes/implementation-summary.md:200 |
| fixK (DeepSeek). 016 evidence prefixes | REQ-026 | 016/009 tasks.md, 016/011 plan.md, 016/015 tasks.md and implementation-summary.md | Point packet evidence to ../../021-follow-up-defect-fixes/ | No code mutant. The corrected evidence links are the proof | ../016-research-recommendations/009-doctor-update-compatibility/tasks.md:62, ../016-research-recommendations/011-anchor-repair-mode/plan.md:180, ../016-research-recommendations/015-lane-rules-as-heal-modes/tasks.md:69 and ../016-research-recommendations/015-lane-rules-as-heal-modes/implementation-summary.md:190 |
| fixL (LUNA). Backfill import policy | REQ-033 | Runtime API and backfill CLI | Import getSpecsBasePaths from @spec-kit/runtime/api | No code mutant. The CLI policy check and import are the proof | scratch/evidence/lane-26-import-policy.txt:4 and scratch/evidence/lane-26-import-policy.txt:63 |
| fixM (LUNA). Root scratch cleanup | REQ-034 | validation-gate-hardening.vitest.ts and strict-pass-freshness.vitest.ts | Remove only root scratch created by each test run | Cleanup-reverted mutant restores the residue | Both test files pass and root scratch is absent. Evidence: scratch/evidence/lane-27-root-scratch.txt:18, scratch/evidence/lane-27-root-scratch.txt:25 and scratch/evidence/lane-27-root-scratch.txt:52 |
| fixN (LUNA). Dangling reversibility manifest test | REQ-035 | upgrade-legacy.vitest.ts | Refuse the dangling manifest link in dry run and apply | The mutant fails its dry-run stderr assertion | The target stays absent and the full file passes. Evidence: scratch/evidence/lane-28-dangling-manifest.txt:4, scratch/evidence/lane-28-dangling-manifest.txt:10 and scratch/evidence/lane-28-dangling-manifest.txt:22 |
| 24. Final gate (orchestrator) | REQ-017 | Packet metadata, trigger index and 19-job suite | Re-derive generated metadata, rebuild the trigger index, run the final gate with load sampled and validate the 034 parent | No code mutant. The gate jobs and strict validations are the proof | G7 completed with 115 of 117 steps returning rc 0. The two failures are recorded as outside this phase. Evidence: scratch/evidence/lane-24-final-gate.txt, sections 4 to 6, and scratch/evidence/lane-29-final-rederive.txt. |
| 25. Closeout checks (clA2, DeepSeek) | REQ-026, REQ-033 to REQ-035 | The five packet documents and closeout evidence | Recheck requirement citations, baselines, listings, edge cases, inventories, secrets, comments and test style | No code mutant. The closeout report is the proof | scratch/evidence/lane-25-closeout-checks.txt, Checks 1 to 11 |

### Data Flow
Defect, then requirement, then lane. Each lane records the evidence available for its red, green and mutant runs. Follow-up rounds use the same lane evidence file when it records that round. Lanes 11 and 12 reconcile child task records. Lanes 13 to 23, res1, res2 and fixA to fixN record the later fixes and evidence. Lanes 24 and 25 record the gate and closeout checks. The closeout gate follows metadata re-derivation and trigger-index rebuild. Acceptance rows stay Unmet when required evidence is still open.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `folderRefusal` in `heal-spec-docs.cjs` | Judges a `--folder` for all three healer modes | Update (lane 1) | The no-roots case and mutant M1-a |
| upgrade-legacy heal step (`upgrade-legacy.mjs` line 949) | Calls the healer with `--folder` and no `--roots`, inside a repository | Unchanged, a consumer | The upgrade-legacy suite stays green |
| Backfill CLI entry and `writePruneReportArtifact` | Write graph metadata and the prune report | Update (lane 2) | Cases (a) and (b), mutants M2-a and M2-b |
| `create.sh`, `fingerprint-docset-generation.sh` and the upgrade-legacy listing | Call the backfill with a folder or import it, never with an outside `--root` | Unchanged, consumers | `rg -n "backfill-graph-metadata"` over the runtime saved to the lane evidence |
| `archive_spec` in `archive.sh` | Resolves and moves a packet | Update (lane 3) | The alias case and mutant M3-a |
| `runCheck` in `generate-leaf-manifest.cjs` | Compares the committed manifest | Update (lane 4) | The linked manifest case and mutant M4-a |
| `readManifestIfExists` and `resolveRoots` in `upgrade-legacy.mjs` | Read the reversibility manifest and resolve the roots | Update (lane 5) | Cases (a) and (b), mutants M5-a and M5-b |
| repair-derived apply closures and apply catch | Re-read a target at write time and report a failure | Update (lane 6) | Cases (a) and (b), mutants M6-a and M6-b |
| `nested-changelog.ts` | Writes the phase changelog | Update (lane 7) | Cases (a) and (b), mutants M7-a and M7-b |
| `derivePhaseParentRollup` in `graph-metadata-parser.ts` | Derives status from all phase child folders | Update (lane 8 R2) | Missing-metadata cases and the dry-run flip list in lane-8-lean-parent.txt |
| `readDoc` and `computeSourceDocHashes` | Read canonical graph source documents and hash them | Update (lane 8 R3) | Linked canonical doc cases in lane-8-lean-parent.txt |
| Readers of `AI_SESSION_CHILD` | The gate core, `worktree-guard.sh`, the launcher and the Hermes plugin | Launcher and Hermes plugin updated (lane 10), the gate core and the guard unchanged | Consumer grep classed in the lane evidence |

| Healer level readers declaredLevel and levelFromSpec | Read spec.md to choose a level for sibling docs | Update (lane 1 R2) | Linked spec.md case and mutants M1-b and M1-c in lane-1-healer.txt |
| Healer argument parser | Reads options and their path values | Update (lane 1 R3) | Unknown option and missing value checks in all healer modes. Evidence: lane-1-healer.txt, LANE 1 ADDENDUM 2, GREEN and MUTANTS |
| archive.sh restore path | Resolves and moves an archived packet | Update (lane 3 R2) | Linked-track restore case and mutant M3-b in lane-3-archive.txt |
| upgrade-legacy apply lock | Protects the release apply operation | Update (lane 5 R2) | Refuse while .skilled/release/.apply.lock exists. Evidence: lane-5-upgrade-legacy.txt, section 2, Test counts and Mutant M5-c |
| repair-derived re-derive child | Starts graph backfill after an apply | Update (lane 6 R2 and R3) | Round 3 targeted suite passes, but the upgrade-legacy neighbor check fails for an in-packet linked plan.md. Internal-link follow-up remains open |
| Generated metadata source readers | Read or hash canonical spec docs | Update (lane 8 R3) | Linked document cases in lane-8-lean-parent.txt |
| Launcher tilde pattern and gate enforcement | Resolves a worktree path and passes environment to the child | Update (lane 10 R2) | shellcheck and environment cases in lane-10-child-marker.txt |
| 016 child task records | Track audit and operator-approved open-box runs | Updated (lanes 11, 12, 16, 18, 20, 23 and fixF, fixG, fixJ, fixK) | The 009 run, T022 run, per-mode checks and residual-box evidence are recorded. 011 goal criterion 3 stays open by design. Evidence: scratch/evidence/lane-20-016-residual-boxes.txt:40, scratch/evidence/lane-23-015-per-mode.txt:426, scratch/evidence/decision-ledger.txt:55, scratch/evidence/decision-ledger.txt:56, scratch/evidence/decision-ledger.txt:63 and sibling task and summary files |

| Packet-local graph source links | readDoc, computeSourceDocHashes and the re-derive guard | Follow real paths inside the packet and refuse or skip outside and dangling links | scratch/evidence/lane-13-inside-links.txt, Scope and Test counts before and after |
| Removed healer flags | The argument parser explains removed --mode and --json flags | Update | scratch/evidence/lane-14-removed-flags.txt, Messages and Required CLI test command |
| Healer refusal wording | Plain outside-root folders differ from folders reached through a link | Update | scratch/evidence/lane-15-refusal-wording.txt, Plain folder and linked-parent cases |
| 016/009 compatibility | The approved v3 sandbox move and upgrade run | Completed in sandbox | scratch/evidence/lane-16-009-compat-run.txt, Outcome and p8-validate |
| 016/015 T022 corpus | The orchestrator ran the throwaway-clone corpus apply twice in lane 17. res2 (LUNA) ticked 015 T022 and ran the per-mode probe in lane 23 | Complete | scratch/evidence/decision-ledger.txt:63, scratch/evidence/lane-17-t022-corpus.txt:117 and scratch/evidence/lane-23-015-per-mode.txt:426 |
| 016/011 hostile check | Hostile TMPDIR and process environment for the affected suites | Completed | scratch/evidence/lane-18-hostile-rerun.txt, Hostile run output |
| Deep review | The build review and seven P2 findings | Findings fixed by fixA to fixE | scratch/evidence/lane-19-opus-review.txt, Verdict and Findings |
| P2-1 and P2-7 | System-link wording and the unknown-option catalog sentence | Updated | scratch/evidence/lane-15-refusal-wording.txt, Review fix P2-1 and P2-7 |
| P2-2 and P2-6 | Linked-directory containment and phase-parent rollup | Updated | scratch/evidence/lane-13-inside-links.txt, Review fix P2-2 and P2-6 |
| P2-3 and P2-4 | Archive prefix walk and restore wording | Updated | scratch/evidence/lane-3-archive.txt, Review fix P2-3 and P2-4 |
| P2-5 | Release-note sentence names upgrade-legacy.manifest.json | Updated | scratch/evidence/decision-ledger.txt:52 |
| Catalog refusal paragraph | Names all three folder refusals | Updated | scratch/evidence/decision-ledger.txt:52 |
| Release-note wording (fixI, DeepSeek) | Both release notes | Correct Linked Paths and Lean Parents text and add the frontmatter-fill entry | Both documents contain all three changes. Evidence: .skilled/changelog/skilled/v4.0.0.4.md:202, :208, :224 and .skilled/skills/system-spec-kit/changelog/v2.7.1.0.md:196, :202, :218 |
| 016/015 Known Limitations (fixJ, DeepSeek) | Items 5 and 11 | Record the resolved plan item and current verification status | ../016-research-recommendations/015-lane-rules-as-heal-modes/implementation-summary.md:194, :200 |
| 016 child evidence links (fixK, DeepSeek) | 009 tasks, 011 plan, 015 tasks and 015 summary | Use the packet-relative ../../021-follow-up-defect-fixes/ prefix | Sibling records show the updated links at tasks.md:62, plan.md:180, tasks.md:69 and implementation-summary.md:190 |
| Backfill import policy (fixL, LUNA) | Public runtime API and backfill CLI | Import getSpecsBasePaths through @spec-kit/runtime/api | scratch/evidence/lane-26-import-policy.txt:4 and :63 |
| Repository-root scratch cleanup (fixM, LUNA) | validation-gate-hardening and strict-pass-freshness tests | Remove only a scratch parent created by each run | scratch/evidence/lane-27-root-scratch.txt:18, :25 and :52 |
| Dangling reversibility manifest (fixN, LUNA) | upgrade-legacy test | Refuse the dangling link before dry-run or apply can create its target | scratch/evidence/lane-28-dangling-manifest.txt:4, :10 and :22 |
| Final 19-job gate (lane 24, orchestrator) | Packet metadata, trigger index and suite | Rebuild generated data and run the final gate | Completed with 115 of 117 steps returning rc 0. The two failures are recorded outside this phase. Evidence: scratch/evidence/lane-24-final-gate.txt, sections 4 to 6. |
| Closeout checks (lane 25, clA2, DeepSeek) | Packet requirements, task evidence and checklists | Verify the baseline, edge cases, inventories and document status | scratch/evidence/lane-25-closeout-checks.txt, Checks 1 to 11 |
| Closeout metadata and retrieval index | Generated metadata and trigger index are rebuilt before the gate | Completed | Lane 24 records the trigger-index rebuild and G7. Lane 29 records the post-pass re-derive and strict validations. |
| 30. Post-rebase gate G8 (orchestrator) | REQ-017 | 15 commits rebased onto b62e142852 | Run G8 on the rebased tree and explain each nonzero step | No code mutant. Rerun changed TypeScript lint with the corrected file list | scratch/evidence/lane-30-post-rebase-gate.txt, SUMMARY and EVERY STEP |
| Post-push CI record (orchestrator) | REQ-017 | Push b62e142852..01db8367c3 to main | Record every workflow and the corpus-pin failure | No code mutant. Compare the pin failure with main's prior run | scratch/evidence/post-push-ci.txt, CI ON and THE ONE FAILURE |

Required inventories:
- **Same-class producers** (class-of-bug rows, lanes 1 and 6): every read or write in the healer and in `repair-derived.cjs` that takes a path from user input. The 020 inventory (`scratch/evidence/closure-same-class-write-inventory.txt` in phase 020) is the starting list, and each lane rechecks it against the current tree.
- **Consumers of a changed symbol**: `rg -n "AI_SESSION_CHILD" --glob '*.{sh,mjs,cjs,ts,py}' .skilled .hermes .claude .opencode` for lane 10, with each hit classed as a reader or a setter. `rg -n "readManifestIfExists|resolveRoots"` for lane 5. `rg -n "deriveStatus"` for lane 8.
- **Matrix axes and row counts**: lane 1 covers three modes with unknown-option, missing --folder and missing --roots cases plus one known-flag control per mode, for 12 cases total. The eight-file healer run passed 151 of 151. Lane 3 covers archive and restore against linked and plain paths. Lane 10 covers the dispatched child, launched descendant, linked-worktree session, top-level launch and descendant dry run. The launcher run and its control each passed 54 of 54. Evidence: scratch/evidence/lane-1-healer.txt:112, scratch/evidence/lane-1-healer.txt:120 and scratch/evidence/lane-10-child-marker.txt:86 to 105.
- **Algorithm invariant** (lane 8): a parent derives complete only when it has at least one child and every child has loadable metadata with status complete. A missing child document counts as incomplete. When no child metadata is loadable, preserve the stored status.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Path refusal (adversarial) | An outside link, an inside link, a dangling link and a plain path for lanes 1 to 6 | vitest and `node` |
| Generator output | Row count at 12 and 13, and an inline comment on one line and across a line break | vitest |
| Status derivation | A lean parent with all children complete, one child in progress, a child with no metadata and no children | vitest |
| Test hygiene | The repository root listing before and after a run, and T046-26 under CPU load | `ls`, vitest and a busy-loop load script under `scratch/` |
| Launcher and plugin | The launched runtime's environment, the dry-run plan for a nested call and the plugin's leaf rule | `worktree-session.test.sh` and `python3 -m unittest` |
| Mutants | One per changed guard, each in a scratch mirror built like phase 020's | The lane's own test command |
| Final gate | The CLI suite with `SPECKIT_TEST_RUN_TIMEOUT_MS=3600000`, the root project, the doctor `run-all.sh`, the hooks `node --test`, the launcher test, the plugin tests and the leaf tests | The commands in section 1 |

Starting numbers from the end of phase 020, which T002 re-captures before any edit. The CLI suite passed 1953 with 20 skipped and 0 failed. The doctor suites passed 7 of 7. The hooks suite passed 186 with 0 failed and 3 skipped. The root project failed only T046-26.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Operator decisions D1-D27 | Operator | Green, answers recorded in spec.md section 10 | Execution evidence remains open for the lane rounds and closeout steps marked pending |
| Phase 020 committed at `7a0f0b4375` | Internal | Green | None |
| tsx loader under the skill's `node_modules` | Internal | Green | Lane 2 cannot spawn the CLI without it |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A lane's green run turns red after a later edit, or a neighbor check from section 3 fails and the cause is the lane's change.
- **Procedure**: Restore that lane's files from `7a0f0b4375`, rerun the lane's red case and confirm it fails again. The other lanes are unaffected, because no two lanes share a file.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup (T001-T004) --> Original lanes and follow-up rounds -->
                    Decisions 1-27 -->
                                        Lane 11 audit --> Lane 12 child runs --> Lanes 13-19 and fixA-fixE
                                                                                 |
                                                                                 v
                            Metadata re-derive and trigger-index rebuild --> Final 19-job gate, commit, push and CI
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Every lane |
| Lanes 2, 4, 7, 8 and 9 | Setup | Follow-up rounds, lanes 11 and 12 |
| Follow-up rounds 1, 3, 5, 6, 8 and 10 | Setup and answered decisions | Lanes 11 and 12 |
| Lane 11 | Existing lane evidence | Lane 12 |
| Lane 12 | Lane 11 audit | Lane 13 |
| Lanes 13-19 and fixA-fixE | Lanes 11 and 12 | Closeout gate |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 30 minutes, mostly the starting suite runs |
| Core Implementation | Med | About 1 hour per lane for lanes 3, 4, 5, 7 and 9, and about 2 hours each for lanes 1, 2, 6, 8 and 10, run in parallel. The figures assume phase 020's lanes of similar size, which took about that long |
| Verification | Med | 1 to 2 hours, mostly the full CLI suite |
| **Total** | | **About 4 to 6 hours of wall time with parallel lanes** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Each red run is saved before its fix is written.
- [ ] Each lane's files are listed in `spec.md` section 3.
- [ ] Lane 8's dry-run flip list is saved before the parser change is committed.

### Rollback Procedure
1. Restore the lane's files from `7a0f0b4375`.
2. Rerun the lane's red case and confirm it fails again.
3. Rerun the lane's neighbor checks and confirm they match the starting numbers.
4. Record the rollback in this packet's implementation summary.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A. Lane 8 changes derived status only when a backfill runs, and no lane runs one in apply mode.
<!-- /ANCHOR:enhanced-rollback -->
