# Iteration 1: Memory Store / Index / Lifecycle Review

## Focus
Reviewed the scope document and sampled the non-search memory write/index/lifecycle surface under `.opencode/skills/system-spec-kit/mcp_server/`, emphasizing atomic save ordering, soft-delete retention behavior, chunked memory lifecycle, background job state, and cancellation helpers.

## Scorecard
- Dimensions covered: correctness, security, traceability, maintainability
- Files reviewed: 11
- New findings: P0=0 P1=2 P2=0
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 1.00

## Findings

### P0, Blocker
- None.

### P1, Required
- **F001**: Atomic save can commit index state before durable file promotion, `.opencode/skills/system-spec-kit/mcp_server/handlers/save/atomic-index-memory.ts:360-378`. The atomic helper writes the pending file, calls `indexPrepared`, and only then promotes the pending file to the final path. The canonical caller's `indexPrepared` calls `processPreparedMemory()` (`memory-save.ts:3930-3938`), whose non-chunk path commits the `memory_index` write via `writeTransaction.immediate()` before returning (`memory-save.ts:2564-2685`), and `createMemoryRecord()` persists the row and metadata in its own transaction (`create-record.ts:310-365`). If `promotePendingFile()` fails after the DB commit, the catch path only cleans up the pending file unless `promotedToFinalPath` is already true (`atomic-index-memory.ts:387-410`), so committed index/ledger state can point at content that never reached the final file. This violates the atomic save contract for rename-after-commit failures.

```json
{
  "findingId": "F001",
  "claim": "Atomic save commits index state before pending-file promotion, so a final rename failure can leave memory_index state for content that was not durably written.",
  "evidenceRefs": [
    ".opencode/skills/system-spec-kit/mcp_server/handlers/save/atomic-index-memory.ts:360-378",
    ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts:2564-2685",
    ".opencode/skills/system-spec-kit/mcp_server/handlers/save/create-record.ts:310-365"
  ],
  "counterevidenceSought": "Checked atomicIndexMemory failure handling, processPreparedMemory write transaction, create-record transaction, and atomic-index-memory tests for a post-commit promote-failure rollback; no DB rollback or cleanup path was present for promote failure after successful indexPrepared.",
  "alternativeExplanation": "The retry may eventually promote the file on a later attempt, but if promotion fails persistently or the process exits after the committed index and before a successful rename, the committed row remains inconsistent.",
  "finalSeverity": "P1",
  "confidence": 0.88,
  "downgradeTrigger": "Downgrade if atomicIndexMemory moves promotion before commit or adds a transactionally verified cleanup that deletes/supersedes the committed memory row on promote failure.",
  "transitions": [
    { "iteration": 1, "from": null, "to": "P1", "reason": "Initial discovery" }
  ]
}
```

- **F002**: Soft-delete tombstones do not tombstone chunk children, `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:82-98`. Chunked indexing creates a parent record and child rows (`chunking-orchestrator.ts:137-141`) and stamps each child with `parent_id`, `chunk_index`, and the same importance tier (`chunking-orchestrator.ts:344-351`). The schema only cascades child cleanup on a real `DELETE` through `parent_id INTEGER REFERENCES memory_index(id) ON DELETE CASCADE` (`vector-index-schema.ts:3121`). In soft-delete mode, `tombstoneMemory()` only updates `deleted_at` on the requested id (`memory-crud-delete.ts:91-98`), so deleting a chunked parent does not update child rows and does not trigger the cascade. Retention's purgeable tombstone scan then selects only rows whose own `deleted_at IS NOT NULL` (`memory-retention-sweep.ts:148-171`), leaving child rows outside the purge path unless another caller separately tombstones each child.

```json
{
  "findingId": "F002",
  "claim": "Soft-delete mode tombstones only the requested parent memory row and does not tombstone chunk children, leaving child rows active after deleting a chunked memory parent.",
  "evidenceRefs": [
    ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:82-98",
    ".opencode/skills/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:137-141",
    ".opencode/skills/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:344-351",
    ".opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:3121",
    ".opencode/skills/system-spec-kit/mcp_server/lib/governance/memory-retention-sweep.ts:148-171"
  ],
  "counterevidenceSought": "Checked the single-delete tombstone helper, chunk parent/child insertion, schema cascade, retention tombstone predicate, and tombstone tests. Existing tests cover repeated tombstone timestamp but not parent-child tombstone propagation.",
  "alternativeExplanation": "Hard-delete mode relies on ON DELETE CASCADE, but soft-delete mode is an UPDATE, so the cascade does not apply; bulk-by-folder may tombstone children separately only when those rows are selected individually.",
  "finalSeverity": "P1",
  "confidence": 0.85,
  "downgradeTrigger": "Downgrade if soft delete explicitly cascades deleted_at to children or all retrieval/retention/projection paths prove child rows under a tombstoned parent are unreachable and later purged.",
  "transitions": [
    { "iteration": 1, "from": null, "to": "P1", "reason": "Initial discovery" }
  ]
}
```

### P2, Suggestion
- None.

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | pass | hard | `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/006-deep-review-017-021-remediation/review-r2/scopes/B-rest-of-002/spec.md:6-14` | Findings stay within declared write/index/lifecycle scope. |
| checklist_evidence | pass | hard | `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/006-deep-review-017-021-remediation/review-r2/scopes/B-rest-of-002/spec.md:1` | Scope has no checklist; skipped as not applicable. |
| feature_catalog_code | partial | advisory | `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts:203-205` | Feature comments advertise indexing/write wrappers, but F001/F002 show gaps. |
| playbook_capability | partial | advisory | `.opencode/skills/system-spec-kit/mcp_server/tests/atomic-index-memory.vitest.ts:205-224`, `.opencode/skills/system-spec-kit/mcp_server/tests/causal-edge-tombstones.vitest.ts:139` | Existing tests cover adjacent behavior but miss these two cases. |

## Assessment
- New findings ratio: 1.00
- Dimensions addressed: correctness, security, traceability, maintainability
- Novelty justification: Both findings are new to this lineage and are grounded in direct source evidence.

## Ruled Out
- Retention tombstone partition alone: intended behavior under the tombstone flag, asserted by `memory-retention-sweep.vitest.ts:143-176`.
- Background index job table initialization: context-server initializes `maintenance_jobs` and crash-recovers running scan jobs at boot.

## Dead Ends
- No P0 was confirmed after re-reading cited code.

## Recommended Next Focus
Remediate F001 and F002, then add regression tests that inject `promotePendingFile` failure after successful `indexPrepared`, and tests that delete a chunked parent under `SPECKIT_SOFT_DELETE_TOMBSTONES=true`.
Review verdict: CONDITIONAL
