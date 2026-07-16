# Iteration 001: Memory Save Atomicity and Lifecycle

## Focus

Reviewed the B-rest-of-002 scope for memory store/index/lifecycle correctness, security, data integrity, cancellation, and transaction-boundary risks. The one-pass audit emphasized `memory_index_scan`, job lifecycle, incremental index maintenance, idempotency receipts, and atomic memory save behavior.

## Scorecard

- Dimensions covered: correctness, security, traceability, maintainability
- Files reviewed: 9
- New findings: P0=0 P1=1 P2=0
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 1.00

## Findings

### P0, Blocker

- None.

### P1, Required

- **F001**: Atomic save can commit index rows before final file promotion. `atomicIndexMemory` calls `dependencies.indexPrepared` before it renames the pending file into place [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/save/atomic-index-memory.ts:362`, `.opencode/skills/system-spec-kit/mcp_server/handlers/save/atomic-index-memory.ts:378`]. The memory-save caller's `indexPrepared` path runs `processPreparedMemory`, whose normal non-chunked branch commits the `memory_index` write transaction at `writeTransaction.immediate()` before returning [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts:2565-2685`]. If `promotePendingFile` throws after that DB commit, the catch path cleans the pending file [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/save/atomic-index-memory.ts:387-390`] and only attempts original-file rollback when `promotedToFinalPath` is already true [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/save/atomic-index-memory.ts:394-407`]. That leaves a reachable failure window where the new DB row exists but neither the final file nor the pending file contains the committed content, contradicting the save atomicity intent around disk promotion and indexing [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts:3804-3810`].

Claim adjudication packet:

```json
{
  "findingId": "F001",
  "claim": "The atomic memory-save path can commit a memory_index row before final pending-file promotion, then delete the pending file on promotion failure, leaving the DB ahead of disk.",
  "evidenceRefs": [
    ".opencode/skills/system-spec-kit/mcp_server/handlers/save/atomic-index-memory.ts:362",
    ".opencode/skills/system-spec-kit/mcp_server/handlers/save/atomic-index-memory.ts:378",
    ".opencode/skills/system-spec-kit/mcp_server/handlers/save/atomic-index-memory.ts:387-390",
    ".opencode/skills/system-spec-kit/mcp_server/handlers/save/atomic-index-memory.ts:394-407",
    ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts:2565-2685"
  ],
  "counterevidenceSought": "Re-read the atomic helper, its memory-save caller, processPreparedMemory's write transaction, and transaction-manager pending-file recovery. The older transaction-manager helper leaves pending files for recovery on rename-after-DB failure, but this atomicIndexMemory path deletes the pending file in the catch path and does not expose dbCommitted recovery metadata.",
  "alternativeExplanation": "The code may assume fs.renameSync rarely fails on local disks. That does not remove the failure mode because the helper explicitly models rollback and retries, and the catch path makes recovery worse by deleting the pending content after a committed DB write.",
  "finalSeverity": "P1",
  "confidence": 0.88,
  "downgradeTrigger": "Downgrade if promotePendingFile is proven to run before any durable DB mutation, or if indexPrepared is wrapped in a transaction that rolls back when promotePendingFile throws and preserves the pending file for recovery.",
  "transitions": [
    { "iteration": 1, "from": null, "to": "P1", "reason": "Initial discovery" }
  ]
}
```

### P2, Suggestion

- None.

## Cross-Reference Results

| Protocol | Status | Gate | Evidence | Notes |
|---|---|---|---|---|
| spec_code | partial | hard | `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/006-deep-review-017-021-remediation/review-r2/scopes/B-rest-of-002/spec.md:6-14` | Scope asks for write-path safety and transaction boundaries; F001 is a confirmed gap. |
| checklist_evidence | pass | hard | `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/006-deep-review-017-021-remediation/review-r2/scopes/B-rest-of-002/spec.md:1-17` | No checklist exists in this narrow scope packet. |
| feature_catalog_code | partial | advisory | `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts:203-205` | Feature comments align with memory indexing/save surfaces; F001 is an implementation risk. |

## Assessment

- New findings ratio: 1.00
- Dimensions addressed: correctness, security, traceability, maintainability
- Novelty justification: One new P1 with direct transaction-boundary evidence. No P0 found. No inference-only findings recorded.

## Ruled Out

- Duplicate scan-lease release in `memory-index.ts`: `releaseScanLease` is idempotent via `scanLeaseReleased`, so repeated calls are safe.
- Cancel mirror growth in `job-store.ts`: terminal transitions remove ids from the in-process cancel mirror.

## Dead Ends

- SQL injection review of sampled job-store and mutation-ledger query construction did not produce a confirmed issue; user data was parameterized or coerced to numeric LIMIT/OFFSET values.

## Recommended Next Focus

Add a fault-injection regression for `atomicSaveMemory` where `promotePendingFile` throws after `indexPrepared` returns success, then make the DB/file rollback contract explicit.

Review verdict: CONDITIONAL
