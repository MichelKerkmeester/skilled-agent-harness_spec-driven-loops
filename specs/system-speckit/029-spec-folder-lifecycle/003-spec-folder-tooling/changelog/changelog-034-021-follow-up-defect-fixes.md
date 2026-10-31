---
title: "Changelog: Phase 21: follow-up-defect-fixes [034-spec-folder-tooling/021-follow-up-defect-fixes]"
description: "Chronological changelog for the Phase 21: follow-up-defect-fixes phase."
trigger_phrases:
  - "spec folder tooling follow up defect fixes changelog"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-10-11

> Spec folder: `specs/system-speckit/034-spec-folder-tooling/021-follow-up-defect-fixes` (Level 2)
> Parent packet: `specs/system-speckit/034-spec-folder-tooling`

### Summary

The recorded fixes address link handling, graph status derivation, changelog generation, launcher behavior and test hygiene. The packet closed after its evidence was pinned, the commits were pushed and CI completed.

### Added

- [P] [2] Green: confine the CLI root and add the report-root check. Evidence: scratch/evidence/lane-2-backfill.txt, Green.
- [1] REQ-019: refuse linked spec.md at both healer level reads. Evidence: scratch/evidence/lane-1-healer.txt, LANE 1 ADDENDUM, GREEN and MUTANTS.
- [1] REQ-023: add unknown-option and missing-path checks for every healer mode. Evidence: scratch/evidence/lane-1-healer.txt, LANE 1 ADDENDUM 2, GREEN and MUTANTS.
- [5] REQ-024: add and test the upgrade-legacy apply-lock refusal. Evidence: scratch/evidence/lane-5-upgrade-legacy.txt, section 2, Test counts and Mutant M5-c.
- REQ-017: rebuild the trigger index after the deprecated track deletion. Evidence: scratch/evidence/lane-24-final-gate.txt, section 1. The rebuild and --check exited 0 with zero obsolete paths and zero untrusted docs.
- CHK-002 Technical approach in plan.md names each lane write set, red case and mutant. Evidence: plan.md, section 3 lane table and affected-surfaces addendum.

### Changed

- Read the 020 evidence each requirement names and re-read each cited line in the current tree. Record moved lines. Evidence: scratch/evidence/lane-25-closeout-checks.txt, Check 1.
- Record the starting numbers before any edit for the CLI suite, root project, doctor suites, hooks suite, launcher test, Hermes plugin tests, leaf tests and strict validates. Evidence: scratch/evidence/lane-25-closeout-checks.txt, Check 2.
- Record the repository root and specs listings for the residue checks. Evidence: scratch/evidence/lane-25-closeout-checks.txt, Check 3, setup listing.
- Bring the operator's answers to decisions 1 to 4 into spec.md section 10 and clear each pending mark in plan.md section 3. Evidence: scratch/evidence/lane-1-healer.txt, Operator decision 1. lane-3-archive.txt, Operator decision 2. lane-10-child-marker.txt, Operator decisions applied.
- [P] [1] Run mutant M1-a and recheck the healer same-class inventory. Evidence: scratch/evidence/lane-1-healer.txt, MUTANT M1-a and SAME-CLASS INVENTORY.
- [P] [2] Red: reproduce the outside-root write and the unanchored report write. Evidence: scratch/evidence/lane-2-backfill.txt, Red.

### Fixed

- [P] [1] Red: rebuild the B-11 fixture with a linked parent outside every root and no --roots. Evidence: scratch/evidence/lane-1-healer.txt, RED (unfixed code).
- [P] [1] Green: add the no-anchor refusal in folderRefusal and state it in the healer README. Evidence: scratch/evidence/lane-1-healer.txt, GREEN (fixed code).
- [P] [1] Run the seven healer files and add --roots only to cases the run names. Evidence: scratch/evidence/lane-1-healer.txt, GREEN (fixed code) and NEIGHBOR.
- [P] [3] Red: reproduce the archive alias move and dangling link. Evidence: scratch/evidence/lane-3-archive.txt, Red (unfixed archive.sh).
- [P] [3] Green: refuse linked archive arguments before a copy. Evidence: scratch/evidence/lane-3-archive.txt, Green (fixed archive.sh).
- [P] [3] Run the archive mutant and existing archive cases. Evidence: scratch/evidence/lane-3-archive.txt, Mutant proof and Restore refusal.

### Verification

- Lane evidence - Red, green and mutant results are recorded per lane where available. Open work is listed in Known Limitations.
- G7 final gate - 19 job wrappers exited 0. 115 of 117 steps returned rc 0. The two failures are listed in Known Limitations 10 and 11.
- CLI suite - T002: 176 files, 1,953 passed, 20 skipped. G7: 177 files, 2,012 passed, 20 skipped, 0 failed.
- Root project - T002: 1,306 passed, 1 failed, 13 skipped. G7: 1,316 passed, 0 failed, 13 skipped. T046-26 now passes.
- Deep-loop - T002: 2,879 passed, 0 failed, 8 skipped. G7: 2,895 passed, 1 failed, 8 skipped. The whole job passed alone with 2,896 passed and 8 skipped.
- Hooks - T002: 186 passed, 0 failed. G7: 186 passed, 0 failed.
- Doctor - T002: 7 suites passed. G7: 7 suites passed, 0 failed, plus 11 of 11 Vitest tests.
- Hostile environment - T002: 13 files. 345 passed, 2 skipped. 3 files. 159 passed. Validation 148 passed. G7: 17 files. 445 passed, 2 skipped. 4 files. 211 passed. Validation 148 passed, 0 failed.

### Files Changed

| File | Action | What changed |
|---|---|---|
| `.skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs, its tests and .skilled/skills/system-spec-kit/runtime/cli/spec/README.md` | Modified | Add the no-root refusal, refuse linked spec.md level reads and give removed --mode and --json flags specific guidance. Evidence: scratch/evidence/lane-1-healer.txt, GREEN and LANE 1 ADDENDUM, plus scratch/evidence/lane-14-removed-flags.txt, Messages and Required CLI test command. |
| `.skilled/skills/system-spec-kit/runtime/cli/graph/backfill-graph-metadata.ts and its tests` | Modified | Confine backfill writes to the repository and validate prune-report roots. Evidence: scratch/evidence/lane-2-backfill.txt, Green and Mutants. |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/archive.sh and its tests` | Modified | Refuse linked archive and restore arguments before moving folders. Evidence: scratch/evidence/lane-3-archive.txt, Green, RESTORE REFUSAL and Mutant M3-b. |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs, tests and README` | Modified | Refuse linked manifests in check mode. Evidence: scratch/evidence/lane-4-leaf-check.txt, Green, Mutant M4-a and Hub check. |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs and its tests` | Modified | Refuse linked manifests and dot-segment roots. Evidence: scratch/evidence/lane-5-upgrade-legacy.txt, Green and Mutants. |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs and its tests` | Modified | Refuse apply reads through links, avoid parse-content leaks and guard the measured re-derive inputs. The neighbor behavior remains open. Evidence: scratch/evidence/lane-6-repair-derived.txt, Green, Round 2 and Round 3. |
| `.skilled/skills/system-spec-kit/runtime/cli/spec-folder/nested-changelog.ts and its tests` | Modified | Preserve every Files Changed row and strip inline HTML comments. Evidence: scratch/evidence/lane-7-changelog.txt, Green and Mutants. |
| `.skilled/skills/system-spec-kit/runtime/lib/graph/graph-metadata-parser.ts, .skilled/skills/system-spec-kit/runtime/lib/graph/generated-metadata-drift.ts and tests` | Modified | Count children without metadata as incomplete and handle linked canonical docs at the source readers. Evidence: scratch/evidence/lane-8-lean-parent.txt, sections 9 and 10. |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/ci-rule-set-comparison.vitest.ts and .skilled/skills/system-spec-kit/runtime/tests/folder-discovery-integration.vitest.ts` | Modified | Clean test scratch output and measure T046-26 after warm-up. The real-load run remains open. Evidence: scratch/evidence/lane-9-test-hygiene.txt, Green, Red (b) and Mutant M9-b. |
| `.skilled/bin/worktree-session.sh, .skilled/bin/tests/worktree-session.test.sh, .hermes/plugins/repo-guards/__init__.py and its tests` | Modified | Keep dispatched-child and launcher markers separate and fix the shellcheck pattern. Evidence: scratch/evidence/lane-10-child-marker.txt, Green, Mutants and Follow-up. |
| `spec.md, plan.md, tasks.md, acceptance-criteria.md and implementation-summary.md` | Modified | Record decisions, cite lane evidence and leave unresolved work pending. |
| `.skilled/changelog/skilled/v4.0.0.4.md and .skilled/skills/system-spec-kit/changelog/v2.7.1.0.md` | Modified | Name upgrade-legacy.manifest.json and correct the Linked Paths and Lean Parents text. Add the frontmatter-fill entry. Both validate VALID with 0 issues. Evidence: scratch/evidence/decision-ledger.txt:52 and the release-note headings at .skilled/changelog/skilled/v4.0.0.4.md:202, .skilled/changelog/skilled/v4.0.0.4.md:208, .skilled/changelog/skilled/v4.0.0.4.md:224, .skilled/skills/system-spec-kit/changelog/v2.7.1.0.md:196, .skilled/skills/system-spec-kit/changelog/v2.7.1.0.md:202 and .skilled/skills/system-spec-kit/changelog/v2.7.1.0.md:218. |
| `.skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/heal-spec-docs-lane-modes.md` | Modified | Correct the unknown-argument sentence and name all three folder refusals. The document validates VALID with 0 issues. Evidence: scratch/evidence/lane-15-refusal-wording.txt, Review fix P2-7, scratch/evidence/decision-ledger.txt:52. |
| `.skilled/skills/system-spec-kit/runtime/api/index.ts and backfill-graph-metadata.ts` | Modified | Export getSpecsBasePaths and import it through the public runtime API. The CLI check passes its import policy. Evidence: scratch/evidence/lane-26-import-policy.txt:4 and scratch/evidence/lane-26-import-policy.txt:63. |
| `validation-gate-hardening.vitest.ts and strict-pass-freshness.vitest.ts` | Modified | Remove only root scratch created by each test run. Evidence: scratch/evidence/lane-27-root-scratch.txt:18, scratch/evidence/lane-27-root-scratch.txt:25 and scratch/evidence/lane-27-root-scratch.txt:52. |
| `upgrade-legacy.vitest.ts` | Modified | Add the dangling reversibility-manifest case for dry run and apply. Evidence: scratch/evidence/lane-28-dangling-manifest.txt:4, scratch/evidence/lane-28-dangling-manifest.txt:10 and scratch/evidence/lane-28-dangling-manifest.txt:22. |
| `specs/sk-communication/` | Deleted | Remove the deprecated track before corpus selection. The impact check covered 1072 tracked files. Evidence: scratch/evidence/decision-ledger.txt:44. |

### Follow-Ups

- Two phase parents are expected to change from complete to in_progress on their next re-derive. Neither was re-derived here. Evidence: scratch/evidence/lane-8-lean-parent.txt, sections 8 and 9.
- Lane 9's 20.7 load average on 18 cores was its baseline before the fix. Lane 21 supplies under-load green and mutant evidence. G7 ran with load sampled and every suite this phase touches met or beat T002. Two gate steps failed outside this phase. Evidence: scratch/evidence/lane-21-t046-under-load.txt:16, :25 and :37. See scratch/evidence/lane-24-final-gate.txt, sections 4 to 6.
- Only Bash 3.2.57 was available. The Bash 5.2 check was not run. The restore red was reproduced by its mutant in a mirror and was not run against the unfixed repository. Evidence: scratch/evidence/lane-3-archive.txt, Bash check and restore refusal note.
- The backfill CLI was not run end to end on a fixture and other folder-discovery callers were not assessed further. Evidence: scratch/evidence/lane-8-lean-parent.txt, section 10, folder-discovery finding and Limit.
- The 016 child document pass and the 015 T022 corpus apply-twice run are recorded. The dry run inspected 4335 packets, with 4282 passing and 53 failing. 011 goal criterion 3 remains open by design. Evidence: scratch/evidence/lane-17-t022-corpus.txt:13, scratch/evidence/lane-17-t022-corpus.txt:30, scratch/evidence/lane-17-t022-corpus.txt:117 and scratch/evidence/lane-20-016-residual-boxes.txt:40.
- The healer parser does not accept --flag=value for existing flags. The removed --mode and --json flags now receive specific messages. Evidence: scratch/evidence/lane-14-removed-flags.txt, parser note and Messages.
