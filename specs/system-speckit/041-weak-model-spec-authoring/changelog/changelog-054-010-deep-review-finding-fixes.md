---
title: "Changelog: Phase 10: deep-review-finding-fixes [054-weak-model-spec-authoring/010-deep-review-finding-fixes]"
description: "Chronological changelog for the Phase 10: deep-review-finding-fixes phase."
trigger_phrases:
  - "weak model spec authoring deep review finding fixes changelog"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-10-25

> Spec folder: `specs/system-speckit/054-weak-model-spec-authoring/010-deep-review-finding-fixes` (Level 3)
> Parent packet: `specs/system-speckit/054-weak-model-spec-authoring`

### Summary

Phase 010 fixed the nine P1 findings and every reproducing P2 from the 2026-10-25 deep review of the closed packet, in three lanes: gate code, guidance and guards, and playbook, records and review tooling. Every gate change reads the v2.3 template stamp, so v2.2 docs keep their verdicts. Of the 63 P2 ledger rows, 59 are fixed and 4 did not reproduce. The fix tasks are done. The final rebuild, suite and census reruns, the two closing reviews and the phase commit are still open, so the phase is not closed.

### Added

- A track containment test, a post-edit scan test and a required-anchor test, each written to fail on the unchanged code first.
- A 36-cell parity matrix for the placeholder gate that pins the mixed-line, fence, indented-fence and angle-bracket shapes.
- Seeded-defect cases for both guards and an add-on note check in the fill-guidance test.
- A fan-out root case for the deep-review resource-map step.
- The P2 outcome ledger in `scratch/p2-ledger.md`, with one verdict and its evidence per registry entry.

### Changed

- `create.sh` refuses a `--track` value that is absolute or holds `.`, `..` or an empty segment, before any folder is made.
- The validator, the shell placeholder rule and the standalone `check-placeholders.sh` share one marker scan with the same code-span, fence and title rules on v2.3 lines.
- `ANCHORS_VALID` reports each template-required anchor a v2.3 doc lacks, and its registry entry describes the error.
- A v2.3 `spec.md` is read across every Status row, both by the status classifier and by the validator's Draft test.
- `SCAFFOLD_NEVER_TOUCHED` checks a v2.3 `spec.md` for a `[template:` title.
- A generated description on a v2.3 spec ends at a clause boundary before falling back to a word boundary.
- The trigger-index corpus walker passes `core.fsmonitor=false` to its git call.
- The authoring card narrows its example claim to section shape, counts tasks in every state, counts tokens across every packet doc, names the `graph-metadata.json` write and hands continuity to the authoring checklist.
- Every task line in the four level examples carries a `Verify:` clause, and the links and checklist notes carry a good and a weak example.
- The plan and implement commands, their prompt contracts and the markdown agent name the card and the token rule, and the agent's runtime mirrors were synced.
- Both deep-review workflows skip the root resource-map reducer at a fan-out root, and the compiled deep contracts were recompiled.
- Dated correction notes in phases 005, 006, 008 and 009 and in the parent spec, beside the original text.

### Fixed

- Both guards exit with a message when `rg` is missing. The drift guard fails on reordered anchors and a missing level, and the card guard runs every check, requires the checklist's example route and reads every mode.
- `template-mapping.md` teaches the value-token form and describes `decision-record.md` as created on request.
- The retired `/spec_kit:` prefix in one template and five reference docs.
- The playbook scenario for authoring from the card checks containment before cleanup, removes its output and scaffolds with `--with-goal`. Two guard scenarios list `rg` and `awk` as preconditions.

### Verification

- Before census: 4,719 folder rows for the strict run and for the six-rule run, recorded before the first edit
- Six-rule census after lane A: no difference from the baseline
- P2 ledger: 63 rows, 59 Fixed and 4 Not reproduced, each with evidence under `scratch/evidence/`
- One P2 item, the L3+ clarifier for three plan notes, was not reproduced: those sections render only at Level 3 and above
- Open: the final rebuild, both suite reruns, the final censuses, the recursive strict run of the packet and the two closing reviews

### Files Changed

| File | Action | What changed |
|---|---|---|
| `.skilled/skills/system-spec-kit/runtime/` | Modified | Gate code, guards, corpus walker and tests |
| `.skilled/skills/system-spec-kit/templates/` | Modified | Fill notes, sample tasks and example task lines |
| `.skilled/skills/system-spec-kit/references/`, `assets/`, `feature-catalog/`, `manual-testing-playbook/` | Modified | Card, mapping, references, catalog and scenarios |
| `.skilled/commands/speckit/` and `.skilled/agents/markdown.md` with its mirrors | Modified | Card and token rule named |
| `.skilled/commands/deep/assets/` and `.skilled/skills/system-deep-loop/runtime/tests/unit/` | Modified | Fan-out root skip, recompiled contracts and its test |
| Phase 005, 006, 008 and 009 docs and the parent `spec.md` | Modified | Dated correction notes |

### Follow-Ups

- Run the open verification tasks, the two closing reviews and the phase commit before the phase reads Complete.
- Raise the version carriers for system-spec-kit and system-deep-loop to match their new release records.
