---
title: "Changelog: Phase 17: heal-cli-and-compat-yaml-simplification [034-spec-folder-tooling/017-heal-cli-and-compat-yaml-simplification]"
description: "Chronological changelog for the Phase 17: heal-cli-and-compat-yaml-simplification phase."
trigger_phrases:
  - "spec folder tooling heal cli and compat yaml simplification changelog"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-10-10

> Spec folder: `specs/system-speckit/034-spec-folder-tooling/017-heal-cli-and-compat-yaml-simplification` (Level 2)
> Parent packet: `specs/system-speckit/034-spec-folder-tooling`

### Summary

The lane-mode command line now takes only --apply, --folder and --roots. The compat action states its failed-step rule in one key. A new test fails if the refusals in upgrade-baseline.json stop being ordered by mode, then document, then reason. No lane mode and no part of upgrade-legacy.mjs changed.

### Added

- Add the refusal-order case: refusals from two or more modes across two or more documents, asserting the exact refusals array (tests/upgrade-legacy.vitest.ts)
- CHK-011 No new warning in the two vitest files or the doctor test
- CHK-013 No ids or spec paths added to code comments

### Changed

- Remove the --mode parsing and its unknown-mode error, and pass no modes from the CLI (heal-spec-docs.cjs:1363-1379, :1390)
- Remove --mode from the usage comment, the README row and the README usage line, and the unknown-mode assertions (heal-spec-docs.cjs:23, spec/README.md:113, :271, heal-lane-modes.vitest.ts:587-591)
- Rerun the phase 15 two-pass corpus check from plain output on a scratch copy, and record each count AC-019 names (raw output to scratch/)
- Remove the --json branch, its usage text, README bracket and assertions, and rename the case to lane-modes-cli-dry-run (heal-spec-docs.cjs:1362, :1392-1395, :23, spec/README.md:271, heal-lane-modes.vitest.ts:567-585)
- [P] Fold step_failure into on_step_failure, keeping every clause of both (doctor-update-compat-action.yaml:125-126)
- [P] Point the five failed-step phrase checks at on_step_failure (doctor-update-compat.test.cjs:823-827)

### Fixed

- Record the CLI suite's pass and fail counts before any change (npm --prefix .skilled/skills/system-spec-kit/runtime/cli test, raw output to scratch/)
- Show the case is discriminating: with the sort call bypassed locally it fails, and restored it passes (upgrade-legacy.mjs:1159, not committed)
- CHK-FIX-001 Each recommendation has a finding class: all four are instance-only
- CHK-FIX-002 Same-class producer inventory completed
- CHK-FIX-003 Consumer inventory rerun after the edits (T012)
- CHK-FIX-004 No security, path, parser or redaction logic changes, so no adversarial table applies

### Verification

- CLI suite before the change - 1775 tests passed, 19 skipped, 0 failed, across 171 files (scratch/baseline-summary.txt)
- CLI suite after the change - 1776 tests passed, 19 skipped, 0 failed, across 171 files. The one extra test is the new order case (scratch/cli-summary.txt)
- Companion script suites - Every count equals the baseline, for example 266 passed in the modules suite and 101 passed in the validation-system suite, with 0 failed in each
- The two changed vitest files - 82 of 82 passed (scratch/vitest-two-summary.txt)
- Doctor compat test - 21 passed, 0 failed (scratch/doctor-summary.txt)
- Order test against mutations - The unmutated run passes. All five sort mutations fail it (scratch/mutation-results.txt)
- Corpus two-pass from plain output - Pass 1 applied 264 and refused 132. Pass 2 applied 0 and refused the same 132. Copy hashes unchanged (scratch/corpus-summary.txt)
- Search for the removed flags and field - No tracked file outside specs/ names --lane-modes with a removed flag, and the base commit does. The only step_failure left is the test's assertion that the key is undefined (scratch/search.txt, scratch/recheck.txt)

### Files Changed

| File | Action | What changed |
|---|---|---|
| `.skilled/skills/system-spec-kit/runtime/cli/tests/upgrade-legacy.vitest.ts` | Modified | Adds the refusal-order case, 47 lines |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs` | Modified | Drops --mode and --json from runLaneModesCli and from the usage comment |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/README.md` | Modified | Drops both flags from the heal-spec-docs.cjs row and from the usage line |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/heal-lane-modes.vitest.ts` | Modified | Drops the --json and unknown-mode assertions and the helper's extra-arguments parameter, and renames the case to lane-modes-cli-dry-run |
| `.skilled/commands/doctor/assets/doctor-update-compat-action.yaml` | Modified | One on_step_failure key in phase_4_move |
| `.skilled/commands/doctor/scripts/tests/doctor-update-compat.test.cjs` | Modified | Reads the failed-step phrases from on_step_failure |
| `specs/system-speckit/034-spec-folder-tooling/spec.md and graph-metadata.json` | Modified | Row 17 of the phase map reads Complete, and the metadata lists this child |
| `This packet's documents and scratch/` | Modified | Status, evidence and the eight small evidence files |

### Follow-Ups

- The CLI suite creates folders in the real specs/ root while it runs. The corpus run's real-tree hash diff caught nine .md files under specs/001-scaffold-gate-phase-probe that were not there before. The suite also makes a .repair-fixture- directory under the real specs root, in two places in repair-derived.vitest.ts. The hash diff lists additions only, so no file that already existed changed its hash. Both kinds of folder were gone once the suite finished. This packet does not fix it, because the tests are outside its scope. The cheap fix is to point those tests at a temporary directory. A run that dies mid-suite could leave a folder behind, which is inferred and not observed.
- The flag removal rests on the operator's word. A search of this repository finds no caller, but a script elsewhere is not visible from here. If one exists, --mode and --json are now ignored, so --mode <name> --apply runs all five lane modes. Every mode acts only on proof, so that run is the default one and not a wrong one.
- The corpus copy and the full run logs are not in the packet. They stayed in the session scratch area outside the repository, and scratch/ keeps only their summary lines.
