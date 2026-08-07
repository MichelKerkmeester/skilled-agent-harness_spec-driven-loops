# Iteration 001: Memory Store / Index / Lifecycle Soft-Delete Review

## Focus
Single-pass review of the B-rest-of-002 scope: memory store, index, delete, retention, and lifecycle behavior outside the main search/retrieval review surface. The pass emphasized write-path safety, retention semantics, soft-delete behavior, and cancellation/lifecycle hotspots.

## Scorecard
- Dimensions covered: correctness, security, traceability, maintainability
- Files reviewed: 9
- New findings: P0=0 P1=2 P2=0
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 1.00

## Findings

### P0, Blocker
- None.

### P1, Required
- **F001**: Soft-delete path leaves tombstoned rows visible through active projection retrieval. `memory_delete` switches from `vectorIndex.deleteMemory()` to an `UPDATE memory_index SET deleted_at = COALESCE(...), updated_at = datetime('now')` when `SPECKIT_SOFT_DELETE_TOMBSTONES=true`, but this branch does not remove `active_memory_projection`, vector/BM25 state, or otherwise guarantee active recall predicates exclude the row [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:82-99]. The active recall index is explicitly partial on `deleted_at IS NULL`, showing the intended active/tombstone split [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:232-236], yet at least trigger phrase retrieval joins `active_memory_projection` and builds its `WHERE` conditions without a `deleted_at IS NULL` predicate [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:718-743]. Impact: a caller can receive `deleted: 1` while the tombstoned memory remains in an active projection-backed retrieval path. This is a data-integrity and deletion-contract failure, not just a cleanup delay.
- **F002**: Soft-delete retention mode skips expired active rows instead of sweeping `delete_after` records. The tool contract says `memory_retention_sweep` sweeps expired governed records where `memory_index.delete_after` is in the past [SOURCE: .opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:503-506]. With `SPECKIT_SOFT_DELETE_TOMBSTONES=true`, candidate selection adds `AND deleted_at IS NOT NULL`, so active expired rows with `deleted_at IS NULL` are excluded from both selection and the in-transaction revalidation path [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/governance/memory-retention-sweep.ts:142-173]. The current test codifies that behavior by leaving active expired id `2` in place while purging only tombstoned expired id `1` [SOURCE: .opencode/skills/system-spec-kit/mcp_server/tests/memory-retention-sweep.vitest.ts:143-176]. Impact: enabling soft-delete tombstones can make ephemeral/governed TTL expiry non-enforcing for active rows unless some other path tombstones them first; no such first-stage retention tombstoning path was found in the scoped search.

### P2, Suggestion
- None.

## Claim Adjudication Packets
```json
{
  "findingId": "F001",
  "claim": "When soft-delete tombstones are enabled, memory_delete marks deleted_at but leaves the row eligible for active projection-backed trigger retrieval because the tombstone branch does not remove active projections and the trigger query lacks a deleted_at filter.",
  "evidenceRefs": [
    ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:82-99",
    ".opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:232-236",
    ".opencode/skills/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:718-743"
  ],
  "counterevidenceSought": "Read causal-edge tombstone tests and vector delete cleanup to check whether tombstoning intentionally performs complete active cleanup elsewhere; hard-delete cleanup exists, but the soft-delete branch only updates memory_index.deleted_at.",
  "alternativeExplanation": "Search callers might globally filter deleted_at outside exactTriggerSearch, but the cited trigger query constructs and executes its own memory_index query without that predicate, so this explanation does not cover the active projection path.",
  "finalSeverity": "P1",
  "confidence": 0.84,
  "downgradeTrigger": "Downgrade if all production retrieval entry points are proven to filter tombstoned IDs before returning results, or if tombstoneMemory is changed to remove active projections and caches while preserving recoverability.",
  "transitions": [
    {
      "iteration": 1,
      "from": null,
      "to": "P1",
      "reason": "Initial discovery"
    }
  ]
}
```

```json
{
  "findingId": "F002",
  "claim": "With soft-delete tombstones enabled, memory_retention_sweep ignores active rows whose delete_after is expired because candidate selection requires deleted_at IS NOT NULL.",
  "evidenceRefs": [
    ".opencode/skills/system-spec-kit/mcp_server/lib/governance/memory-retention-sweep.ts:142-173",
    ".opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:503-506",
    ".opencode/skills/system-spec-kit/mcp_server/tests/memory-retention-sweep.vitest.ts:143-176"
  ],
  "counterevidenceSought": "Searched the scoped MCP server code for other SET deleted_at or retention_expired paths that would tombstone active expired rows before purge; only explicit delete handlers set deleted_at.",
  "alternativeExplanation": "The soft-delete flag may intentionally define retention as purge-only for previously tombstoned records, but that contradicts the public tool description unless a separate tombstoning phase is documented and wired.",
  "finalSeverity": "P1",
  "confidence": 0.82,
  "downgradeTrigger": "Downgrade if the public contract is updated to say soft-delete mode only purges pre-tombstoned records and a separate scheduled tombstoning path is documented/tested for active expired records.",
  "transitions": [
    {
      "iteration": 1,
      "from": null,
      "to": "P1",
      "reason": "Initial discovery"
    }
  ]
}
```

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|---|---|---|---|---|
| spec_code | partial | hard | `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/006-deep-review-017-021-remediation/review-r2/scopes/B-rest-of-002/spec.md:13-14` | Scope asks for retention/write-lifecycle review; two P1 lifecycle drifts found. |
| checklist_evidence | pass | hard | `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/006-deep-review-017-021-remediation/review-r2/scopes/B-rest-of-002/spec.md:1-20` | No checklist.md exists for this fan-out scope; marked not applicable. |
| feature_catalog_code | partial | advisory | `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:503-506` | Retention tool description does not describe the tombstone-only candidate partition. |

## Assessment
- New findings ratio: 1.00
- Dimensions addressed: correctness, security, traceability, maintainability
- Novelty justification: Both findings are new lifecycle contract failures in soft-delete behavior, not duplicates of hard-delete causal-edge cleanup concerns.

## Ruled Out
- Hard-delete causal-edge leak: ruled out because vector delete ancillary cleanup sweeps causal edges and tests cover hard-delete edge tombstoning [SOURCE: .opencode/skills/system-spec-kit/mcp_server/tests/causal-edge-tombstones.vitest.ts:60-137].
- Retention hard-delete cleanup gap: ruled out because retention tests verify FTS, active projection, and causal references are cleaned on hard purge [SOURCE: .opencode/skills/system-spec-kit/mcp_server/tests/memory-retention-sweep.vitest.ts:257-287].

## Dead Ends
- MCP tool execution was unnecessary; scope explicitly allowed Grep/Read fallback and direct file evidence was sufficient.

## Recommended Next Focus
Define the soft-delete lifecycle contract and fix either the tombstone delete path or all active retrieval predicates. Then decide whether `memory_retention_sweep` should tombstone active expired rows, purge all expired rows, or expose a separate tombstone/purge two-phase contract.
Review verdict: CONDITIONAL
