---
title: "Changelog: Phase 2: template-and-example-defect-repair [054-weak-model-spec-authoring/002-template-and-example-defect-repair]"
description: "Chronological changelog for the Phase 2: template-and-example-defect-repair phase."
trigger_phrases:
  - "weak model spec authoring template and example defect repair changelog"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-10-24

> Spec folder: `specs/system-speckit/054-weak-model-spec-authoring/002-template-and-example-defect-repair` (Level 3)
> Parent packet: `specs/system-speckit/054-weak-model-spec-authoring`

### Summary

A model that copies a system-spec-kit example or follows the authoring checklist no longer meets a broken line. The 18 example descriptions are whole sentences, the checklist names a packet that exists, the style guide says table in both places, the dead `templates/.hashes` file is gone and every ledger row owned by this phase is fixed.

### Added

- An exact-match applier that refuses to edit unless the old text occurs once, with a `DELETE LINE` form for the one row that removes a line.
- Four review-driven fixes for second copies of defects already repaired.

### Changed

- 18 example descriptions are now whole sentences, and the verification checklist line in the examples matches the template.
- Stale paths, folder names and command names are corrected in the template and workflow references.
- Three compiled deep-loop contracts and the scaffold golden snapshot are regenerated, because both record the changed text.
- Five ledger evidence commands now test the document text instead of a disk fact that stays true after the fix.

### Fixed

- The dead `templates/.hashes` file is deleted. It listed files that no longer exist and nothing read it.
- The checklist path in the authoring workflow now points at a packet that exists.
- The style guide wording is consistent in both places that mention tables.

### Verification

- Strict validation of this phase folder: RESULT: PASSED
- Known rows applied: 25 of 25 with no path outside the target
- Recheck after the review fixes: 0 residual hits
- Suite against the phase 001 start: matching summary lines on the fourth run, exit=0
- Review: 4 findings, all applied

### Files Changed

| File | Action | What changed |
|---|---|---|
| `templates/examples/level-*/` (18 docs) | Modified | Whole-sentence descriptions and the verification checklist line |
| `templates/README.md, templates/CONTRACT.md` and two more | Modified | Stale paths and folder names |
| `references/workflows/*.md, references/templates/*.md` (10 docs) | Modified | Checklist paths, style guide wording, stale command names |
| `templates/.hashes` | Deleted | Listed files that no longer exist |
| `.skilled/commands/deep/assets/compiled/*.contract.markdown` (3) | Regenerated | New digest of the auto mode contract |
| `runtime/cli/tests/snapshots/scaffold-golden-snapshots.vitest.ts.snap` | Regenerated | New packet pointer lines for Levels 2, 3 and 3+ |

### Follow-Ups

- The suite needs more than its default time bound on a loaded machine. Later runs set `SPECKIT_TEST_RUN_TIMEOUT_MS=1800000`.
- The suite comparison reads summary lines only, so a differing line needs a read of the failing tests.
