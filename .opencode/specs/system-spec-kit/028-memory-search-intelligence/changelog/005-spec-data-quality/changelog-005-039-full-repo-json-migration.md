---
title: "Changelog: Full-Repo JSON Migration [005-spec-data-quality/006-generated-metadata-build/039-full-repo-json-migration]"
description: "Chronological changelog for the full-repo json migration phase."
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

> Spec folder: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/005-spec-data-quality/006-generated-metadata-build/039-full-repo-json-migration` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/005-spec-data-quality`

### Summary

Built a scoped per-folder migration driver and ran it tree-wide to regenerate every `description.json` and `graph-metadata.json` onto the new format. The driver enumerates every spec folder that carries `spec.md` or `description.json`, archives included, and regenerates both generated files through the scoped per-folder path only, never the legacy whole-tree walk and never the aggregate cache. The `z_archive` tree migrates like any other track. The `z_future` staging tree is enumerated for coverage but recorded skipped on the hardened writer rule per an operator amendment, since the writer refuses graph-metadata under `z_future`. This migration is what earned the packet 028 flag flips.

### Added

- `scripts/graph/migrate-generated-json.ts`, the Stage 3 driver. It enumerates every spec folder under `.opencode/specs`, regenerates the description side through `generatePerFolderDescription` plus `savePerFolderDescription` and the graph side through the scoped `runBackfill({ specFolder })`, sets `SPECKIT_IDENTITY_MERGE_SAFETY` and `SPECKIT_IDEMPOTENT_DESCRIPTION_WRITES` on for the run and restores them after, reports one bad folder failed and continues, and supports `--dry-run`, `--only`, `--limit` and a `--verify` companion that aggregates the integrity validator.
- `scripts/tests/migrate-generated-json.vitest.ts`, ten tests proving full coverage including archives, the scoped-path-only call pattern, sibling isolation, a byte-stable second run, and a zero-violation validator pass.

### Changed

- Regenerated every `description.json` across the tree onto the new format, `z_archive` included, committed batched by track.
- Regenerated every eligible `graph-metadata.json` onto the new format, committed batched by track. A folder whose graph-metadata path the hardened writer refuses is recorded skipped on the writer rule and neither file is written, so the migration never leaves an inconsistent half-pair.

### Fixed

- A `depends_on` load-tolerance issue and the `z_future` writer-rule boundary were closed to bring the tree to zero violations under the integrity validator. `z_future` is excluded per the operator amendment rather than rewritten.

### Verification

- Migration driver vitest - PASS, 10 of 10, covers archive plus future enumeration, scoped-only calls, sibling isolation, byte-stable second run, zero-violation validator.
- Driver typecheck - PASS, `tsc --noEmit -p scripts/tsconfig.json` exit 0.
- Live full-repo run plus integrity validator - PASS, 2049 folders checked, 0 violations, validate-clean.
- Byte-stable second run - PASS, a second migration run produced 0 diff.
- z scope - `z_archive` migrated as a normal track, `z_future` excluded per the operator amendment.
- Docs gate - PASS, `validate.sh --strict` on this folder exit 0.

### Files Changed

- `.opencode/skills/system-spec-kit/scripts/graph/migrate-generated-json.ts`: created the Stage 3 scoped per-folder migration driver.
- `.opencode/skills/system-spec-kit/scripts/tests/migrate-generated-json.vitest.ts`: created the ten-test suite.
- `.opencode/specs/**/description.json`: regenerated onto the new format tree-wide, `z_archive` included, committed batched by track.
- `.opencode/specs/**/graph-metadata.json`: regenerated onto the new format for eligible folders, committed batched by track.

### Follow-Ups

- This migration is the gate the flag flips depended on. The byte-stable, zero-violation tree let `SPECKIT_IDENTITY_MERGE_SAFETY`, `SPECKIT_IDEMPOTENT_DESCRIPTION_WRITES`, and `SPECKIT_GENERATED_METADATA_GRANDFATHER` graduate in the phase 040 benchmark. The drift gate and generator hardening graduated only after the migration was re-run with their field-writing flags set on, which backfilled `source_doc_hashes` and `source_fingerprint` tree-wide.
