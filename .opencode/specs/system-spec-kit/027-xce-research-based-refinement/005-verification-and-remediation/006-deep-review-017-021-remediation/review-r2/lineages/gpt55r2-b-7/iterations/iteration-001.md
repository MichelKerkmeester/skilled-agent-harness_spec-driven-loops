# Iteration 001: Memory Store / Index / Lifecycle Broad Pass

## Focus
Reviewed scope B-rest-of-002 for correctness, security, data-integrity, cancellation, retention, and lifecycle risks in the memory store/index/write paths. The scope excludes the dedicated search/retrieval pipeline, but store/delete visibility was checked where needed to validate deletion semantics.

## Scorecard
- Dimensions covered: correctness, security, traceability, maintainability
- Files reviewed: 13
- New findings: P0=0 P1=2 P2=0
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 1.00
- Iteration verdict: CONDITIONAL

## Findings

### P0, Blocker
None.

### P1, Required
- **F001**: Governed scan/ingest rows can survive metadata failure without scope and retention fields. `memory_index_scan` passes a governed ingest decision into `indexSingleFile` [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:1047-1052], and async ingest forwards the captured governance decision to the same helper [SOURCE: .opencode/skills/system-spec-kit/mcp_server/context-server.ts:2199-2209]. `indexMemoryFile` then calls `processPreparedMemory`, which commits the row, and applies governed scope/provenance/retention metadata only afterward [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts:2888-2899]. Unlike the direct `memory_save` handler, this scan/ingest branch has no rollback/cleanup if `applyPostInsertMetadata` throws; the direct path explicitly wraps metadata in a transaction and deletes the orphaned row on failure [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts:3730-3756]. A transient SQLite error, missing migrated column, or other post-insert metadata failure can therefore leave a governed row indexed without tenant/session/retention metadata, violating the governed ingest boundary.

```json
{
  "findingId": "F001",
  "claim": "Governed scan/ingest can commit a memory row before applying tenant/session/retention metadata and lacks the direct-save rollback cleanup if that metadata step fails.",
  "evidenceRefs": [
    ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:1047-1052",
    ".opencode/skills/system-spec-kit/mcp_server/context-server.ts:2199-2209",
    ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts:2888-2899",
    ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts:3730-3756"
  ],
  "counterevidenceSought": "Checked the direct memory_save path for rollback cleanup, checked scan and async ingest call sites for governance threading, and checked indexMemoryFile for equivalent transaction/cleanup around applyPostInsertMetadata.",
  "alternativeExplanation": "applyPostInsertMetadata normally succeeds and uses an allowed-column list, but normal success does not remove the failure-path gap because the direct handler already treats metadata failure as cleanup-worthy.",
  "finalSeverity": "P1",
  "confidence": 0.86,
  "downgradeTrigger": "Downgrade if indexMemoryFile wraps governed post-insert metadata in the same transaction as row creation or deletes the created row on metadata failure, with a regression test for scan/ingest metadata failure.",
  "transitions": [
    { "iteration": 1, "from": null, "to": "P1", "reason": "Initial discovery" }
  ]
}
```

- **F002**: Soft-delete mode tombstones memory rows but leaves them active in projection-backed readers. With `SPECKIT_SOFT_DELETE_TOMBSTONES=true`, single delete only sets `deleted_at` on `memory_index` and returns success [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:82-99]. Tier bulk delete uses the same tombstone-only helper [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:54-70]. The active projection table does not store a tombstone flag [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2095-2100], and the prepared count/list/path readers join `active_memory_projection` without `m.deleted_at IS NULL` [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:1834-1850] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:1875-1889]. Vector KNN query shapes also join the active projection without excluding tombstoned rows [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:163-199]. A successful delete in soft-delete mode can therefore leave the deleted memory visible as the active row until a later purge, violating delete semantics and retention expectations.

```json
{
  "findingId": "F002",
  "claim": "When soft-delete tombstones are enabled, memory_delete and memory_bulk_delete only stamp deleted_at while active projection-backed readers still include the row without filtering tombstones.",
  "evidenceRefs": [
    ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:82-99",
    ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:54-70",
    ".opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2095-2100",
    ".opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:1834-1850",
    ".opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:1875-1889",
    ".opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:163-199"
  ],
  "counterevidenceSought": "Checked both single and tier bulk delete tombstone helpers, active projection schema, list/count/path prepared statements, and vector KNN query joins for a deleted_at predicate or projection cleanup.",
  "alternativeExplanation": "Retention sweep can later purge tombstoned expired rows, but delete tools return success immediately and callers expect deleted rows to stop surfacing before purge.",
  "finalSeverity": "P1",
  "confidence": 0.88,
  "downgradeTrigger": "Downgrade if delete tombstoning removes or repoints active_memory_projection rows and all projection-backed readers exclude deleted_at IS NOT NULL rows, covered by a soft-delete regression test.",
  "transitions": [
    { "iteration": 1, "from": null, "to": "P1", "reason": "Initial discovery" }
  ]
}
```

### P2, Suggestion
None.

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| `spec_code` | partial | hard | `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/006-deep-review-017-021-remediation/review-r2/scopes/B-rest-of-002/spec.md:6-14` | Scope maps to memory store/index/lifecycle files; two write-path safety defects confirmed. |
| `checklist_evidence` | partial | hard | `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/006-deep-review-017-021-remediation/review-r2/scopes/B-rest-of-002/spec.md:1-17` | No checklist artifact exists in this scope packet. |
| `feature_catalog_code` | partial | advisory | `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:77-78`; `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-ingest.ts:31-32` | Feature catalog surfaces exist; governed rollback semantics are inconsistent. |
| `playbook_capability` | blocked | advisory | n/a | No playbook artifact was present in the scope packet. |

## Assessment
- New findings ratio: 1.00
- Dimensions addressed: correctness, security, traceability, maintainability
- Novelty justification: F001 and F002 are distinct lifecycle defects with different control flags and call paths.
- Verdict mapping: P1 findings present, no P0 findings, therefore `Review verdict: CONDITIONAL`.

## Ruled Out
- Retention hard-delete orphaning: `delete_memory_from_database` wraps vector payload deletion, ancillary cleanup, causal sweep, embedding-cache cleanup, and `memory_index` deletion in a transaction [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:717-780].
- Background scan cancellation draining no-op batches: `processBatches` breaks on `shouldAbort` and skips inter-batch delay when cancellation is requested [SOURCE: .opencode/skills/system-spec-kit/mcp_server/utils/batch-processor.ts:149-177].

## Dead Ends
- Causal edge deletion during hard delete did not produce a confirmed issue in this pass.
- Retention sweep TOCTOU did not produce a confirmed issue because expired rows are revalidated inside the delete transaction.

## Recommended Next Focus
Fix F001 and F002, then run targeted tests for governed scan/ingest metadata failure and soft-delete tombstone visibility in projection-backed readers.
Review verdict: CONDITIONAL
