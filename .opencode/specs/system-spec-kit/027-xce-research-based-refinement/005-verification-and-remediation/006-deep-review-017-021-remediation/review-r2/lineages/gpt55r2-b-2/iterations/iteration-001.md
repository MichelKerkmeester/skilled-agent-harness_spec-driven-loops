# Iteration 001 - Correctness/Security/Data Integrity

## Dispatcher
- Session: `fanout-gpt55r2-b-2-1781761339355-o7qylx`
- Focus dimension: correctness/security/data-integrity
- Max iterations: 1
- Artifact directory: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/006-deep-review-017-021-remediation/review-r2/lineages/gpt55r2-b-2`

## Files Reviewed
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/006-deep-review-017-021-remediation/review-r2/scopes/B-rest-of-002/spec.md`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-list.ts`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/save/dedup.ts`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/save/create-record.ts`
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-store.ts`
- `.opencode/skills/system-spec-kit/mcp_server/lib/governance/memory-retention-sweep.ts`
- `.opencode/skills/system-spec-kit/mcp_server/lib/ops/job-store.ts`
- `.opencode/skills/system-spec-kit/mcp_server/lib/ops/job-queue.ts`
- `.opencode/skills/system-spec-kit/mcp_server/lib/storage/transaction-manager.ts`
- `.opencode/skills/system-spec-kit/mcp_server/lib/storage/causal-edges.ts`

## Findings - New

### P0
- None.

### P1
- **F001**: Soft-deleted memory rows remain active to list/retrieval/dedup surfaces - `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:91` - The soft-delete branch stamps `deleted_at` but does not remove `active_memory_projection`; active prepared statements and `memory_list` continue selecting `memory_index` without `deleted_at IS NULL`, and same-path dedup can return `unchanged` from that tombstoned row. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:91-98] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:1834-1845] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-list.ts:127-135] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/save/dedup.ts:102-107] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/save/dedup.ts:269-279]

```json
{
  "claim": "Soft-deleted memory rows remain active to list/retrieval/dedup surfaces.",
  "evidenceRefs": [
    ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:91-98",
    ".opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:1834-1845",
    ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-list.ts:127-135",
    ".opencode/skills/system-spec-kit/mcp_server/handlers/save/dedup.ts:102-107",
    ".opencode/skills/system-spec-kit/mcp_server/handlers/save/dedup.ts:269-279"
  ],
  "counterevidenceSought": "Checked the soft-delete implementation for active projection removal and checked active/list/dedup queries for deleted_at filtering.",
  "alternativeExplanation": "Retention sweep later purges tombstones, but that does not make delete semantics correct while the tombstone remains active and re-save is short-circuited.",
  "finalSeverity": "P1",
  "confidence": 0.88,
  "downgradeTrigger": "Downgrade only if all user-facing read/dedup/search paths are proven to exclude tombstoned rows before returning results."
}
```

### P2
- None.

## Traceability Checks
| Protocol | Level | Status | Evidence | Notes |
|---|---|---|---|---|
| `spec_code` | core | partial | `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/006-deep-review-017-021-remediation/review-r2/scopes/B-rest-of-002/spec.md:7-14` | Spot-check covered the requested memory store/lifecycle code but not every listed surface in one iteration. |
| `checklist_evidence` | core | partial | n/a | Scope folder has no `checklist.md`; no checked completion claims to validate. |
| `feature_catalog_code` | overlay | partial | reviewed file feature catalog comments | Broad surface not exhausted due `maxIterations=1`. |
| `playbook_capability` | overlay | notApplicable | n/a | No playbook artifact in scope. |

## Confirmed-Clean Surfaces
- Maintenance job store terminal transitions clear the in-process cancel mirror on terminal state transitions. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/ops/job-store.ts:261-268]
- Ingest queue records actual failure count separately from truncated stored errors before deciding terminal failed/complete state. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/ops/job-queue.ts:612-663]
- Transaction manager pending-file recovery refuses to rename pending content when the DB row is not committed. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/storage/transaction-manager.ts:401-406]

## Ruled Out
- Retention sweep orphaned causal edges was not recorded as a finding because `vectorIndex.deleteMemory` calls ancillary cleanup including causal edge sweep. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:740-752]

## Next Focus
- Continue with cancellation/progress boundaries in `memory-index.ts` post-processing and causal relation lifecycle if another iteration is allowed.

Review verdict: CONDITIONAL
