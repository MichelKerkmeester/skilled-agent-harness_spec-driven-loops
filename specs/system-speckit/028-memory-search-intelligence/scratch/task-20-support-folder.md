# Task 20 Support-Folder Declassification

## Contract Dry Run

- Source: `003-spec-data-quality/029-vague-query-model-benchmark` exists.
- Destination: `003-spec-data-quality/vague-query-model-benchmark` is absent.
- Immediate `spec.md`: absent; the source is not a governed phase.
- Inventory: 288 files, including exactly 144 raw JSONL files.
- Pre-move aggregate SHA-256: `aca3c62038e2d00c8a11fcd9d6b9f0182cd87ebeb83deaed3f865ec215e63823`.
- JSONL validation: every nonblank line in all 144 raw files parses as a JSON object.
- Rollback: rename the destination back to the source and restore the exact active-reference patch if any post-move gate fails.

## Reference Classification

- Active support navigation: `003-spec-data-quality/SUMMARY.md`, parent generated child inventory, Task 8 ledger, topology helper, manifest, and migration log.
- Historical provenance: migration manifest old/new path fields and dated changelog evidence retain numbered labels.
- Separate governed benchmark: references under `005-shared-engine-and-research` and `006-generated-metadata-build/009-search-quality-fixes` describe the former governed benchmark phase, not this raw-output support directory; they remain unchanged.

## Planned Verification

- Preserve all 288 file hashes and the aggregate hash across the move.
- Preserve all 144 JSONL files byte-for-byte and line-parse them again.
- Require 173 governed phases, 7 numbered support directories, and 180 numbered directories.
- Refresh only `003-spec-data-quality/graph-metadata.json` through the official scoped generator if its child inventory changes.
- Require generated integrity and root `PHASE_LINKS`, run packet strict validation, and run `git diff --check`.
