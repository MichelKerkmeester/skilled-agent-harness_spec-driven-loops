---
title: "Changelog: 031 Generated JSON Quality and Safety Research [003-spec-data-quality/005-shared-engine-and-research/031-generated-metadata-quality-research]"
description: "Chronological changelog for the 031 generated json quality and safety research phase."
trigger_phrases:
  - "phase changelog"
  - "nested changelog"
  - "phase completion"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-22

> Spec folder: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/003-spec-data-quality/005-shared-engine-and-research/031-generated-metadata-quality-research` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/003-spec-data-quality`

### Summary

A 10-angle read-only research study on the quality and safety of the spec-kit generated JSON metadata, the `description.json` and `graph-metadata.json` files and the generators that produce them. It sorted every finding into four safety classes, found broad-walk over-reach and non-idempotent writes dominant, converged on a shared spec-folder identity resolver and a first-class generated-metadata validator as the root-cause fixes, skeptically cross-checked the load-bearing claims, and produced 14 ranked proposals with a build order. This phase ships a diagnosis and a ranked plan, not a code change.

### Added

- `research/research.md`, the synthesized 10-angle ranked proposals, verification verdicts and recommended build order.
- `research/deltas/`, the ten per-angle finding sets.

### Changed

- No generator, parser, schema, or validator code was modified. Shipping a fix is an operator decision left to a later build phase.

### Fixed

- No fixes recorded. This study closes nothing, the proposals are documented not built.

### Verification

- Ranked proposal set written - `research/research.md` section 4 lists 14 ranked proposals across four safety classes.
- Per-angle evidence retained - `research/deltas/` holds the ten finding sets.
- Load-bearing claims cross-model verified - two CONFIRMED, four DOWNGRADED, one ALREADY-DONE by a claude skeptical pass.
- Status normalizer root cause confirmed - em-dash prose admitted at `graph-metadata-parser.ts:179-180`.
- Merge-path lineage root cause confirmed - `parent_id` and `children_ids` dropped at `graph-metadata-parser.ts:1149-1161`.
- No production code modified - only research artifacts written.
- `validate.sh --strict` on this phase exits clean.

### Files Changed

- `research/research.md`: the synthesized 10-angle ranked proposals, verification and build order.
- `research/deltas/`: the ten per-angle finding sets.

### Follow-Ups

- The operator decides which verified proposals warrant a build phase versus a backlog entry.
- The shared spec-folder identity resolver is the gating first build, since the validator path invariants and the merge-path lineage guard both depend on it.
- The behavioral fixes need a scoped migration, since existing files carry the prose statuses and prefixed paths the new contract rejects, so each should ship behind a default-off flag or a grandfather report mode.
