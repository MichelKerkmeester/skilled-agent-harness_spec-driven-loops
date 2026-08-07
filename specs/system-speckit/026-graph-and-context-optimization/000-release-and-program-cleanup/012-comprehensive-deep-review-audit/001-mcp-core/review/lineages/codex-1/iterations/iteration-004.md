# Iteration 004 - Maintainability

Focus: whether the save pipeline decomposition, tests, and response surfaces introduce separate maintainability findings beyond the active correctness and traceability defects.

## Findings

No new P0, P1, or P2 findings were recorded in this pass.

## Evidence Checked

- `handlers/save/README.md` matches the broad module split for validation, duplicate detection, embedding, prediction-error arbitration, record creation, enrichment, atomic file promotion, and response formatting.
- `create-record.ts` centralizes identity resolution, same-path predecessor handling, lineage transition recording, post-insert metadata, BM25 indexing, and history rows.
- `atomic-index-memory.ts` keeps pending-file promotion and rollback behavior localized behind dependency hooks.
- `post-insert.ts` reports enrichment lanes with explicit status enums instead of collapsed booleans.
- `response-builder.ts` classifies save errors and carries post-mutation hook feedback into responses.

## Test Gaps Attached To Active Findings

- F001 needs regression coverage proving `memory_update` and `memory_delete` clear entity-density without waiting for TTL. Existing entity-density commit-hook tests cover direct invalidation plus bulk-delete/save surfaces, not update/delete.
- F002 needs a regression where a `success` row has `vec_memories_rowids` present but the active dimension-table row absent; dry-run planned mutations and apply changes should agree.
- F003 needs public docs/schema parity coverage or a lightweight docs contract check for the reconcile apply call shape.

These are not split into separate findings because they are direct remediation tests for existing active defects.

Review verdict: PASS
