# Deep Review Report - B-rest-of-002

## Executive Summary
- Verdict: CONDITIONAL
- Active findings: P0=0, P1=2, P2=0
- hasAdvisories: false
- Scope: memory store/index/lifecycle code under `.opencode/skills/system-spec-kit/mcp_server/`, excluding the search/retrieval pipeline.
- Stop reason: maxIterationsReached after one configured fan-out iteration.
- Release readiness: in-progress

## Planning Trigger
Route to remediation planning. The review found two active P1 data-integrity defects in write/delete lifecycle behavior. No P0 was confirmed, so the verdict is CONDITIONAL rather than FAIL.

## Active Finding Registry
| ID | Severity | Category | Evidence | Summary |
|----|----------|----------|----------|---------|
| F001 | P1 | correctness | `.opencode/skills/system-spec-kit/mcp_server/handlers/save/atomic-index-memory.ts:360-378`; `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts:2564-2685`; `.opencode/skills/system-spec-kit/mcp_server/handlers/save/create-record.ts:310-365` | Atomic save can commit `memory_index` state before the pending file is promoted, leaving DB/file divergence if promotion fails. |
| F002 | P1 | data-integrity | `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:82-98`; `.opencode/skills/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:137-141`; `.opencode/skills/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:344-351`; `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:3121`; `.opencode/skills/system-spec-kit/mcp_server/lib/governance/memory-retention-sweep.ts:148-171` | Soft-delete mode tombstones only the requested row, so deleting a chunked parent can leave child rows active and outside tombstone purge selection. |

## Remediation Workstreams
| Workstream | Findings | Action |
|------------|----------|--------|
| Atomic save ordering | F001 | Promote the pending file before committing index state, or add a compensating transaction/cleanup path that deletes or invalidates the committed row if promotion fails. Add a regression with `promotePendingFile` throwing after successful `indexPrepared`. |
| Soft-delete chunk propagation | F002 | When tombstoning a parent row, tombstone all child rows in the same transaction and update active projection/cache cleanup accordingly. Add a regression for chunked parent delete under `SPECKIT_SOFT_DELETE_TOMBSTONES=true`. |

## Spec Seed
- Require atomic save to be all-or-nothing across durable file promotion and `memory_index`/ledger state.
- Require soft-delete tombstone semantics to preserve hard-delete cascade equivalence for chunk parent/child trees.

## Plan Seed
1. Add failing tests for F001 and F002.
2. Fix atomic save ordering or rollback committed rows on promotion failure.
3. Fix tombstone propagation to child rows and any active projection/cache rows.
4. Run targeted MCP server tests plus strict spec validation for the remediation packet.

## Traceability Status
| Protocol | Status | Gate | Notes |
|----------|--------|------|-------|
| spec_code | pass | hard | Findings match the scope's memory store/index/lifecycle write-safety target. |
| checklist_evidence | pass | hard | No checklist in scope folder; skipped as not applicable. |
| feature_catalog_code | partial | advisory | Feature comments claim indexing/write lifecycle surfaces; two P1 gaps remain. |
| playbook_capability | partial | advisory | Existing tests cover adjacent behavior but miss the confirmed cases. |

## Deferred Items
- No P2 advisories recorded.
- Broader performance review of scan tail phases was not completed in this one-iteration fan-out.

## Audit Appendix
| Iteration | Focus | P0 | P1 | P2 | Ratio | Verdict |
|-----------|-------|----|----|----|-------|---------|
| 1 | correctness/data-integrity write lifecycle | 0 | 2 | 0 | 1.00 | CONDITIONAL |

### Evidence Replay
- F001 replay: `atomicIndexMemory` writes pending content, calls `indexPrepared`, then promotes; `processPreparedMemory` commits the DB write before the helper promotion step. Claim adjudication passed.
- F002 replay: chunk children are separate rows with `parent_id`; soft delete performs an UPDATE on only the requested id; the schema cascade applies to DELETE only; retention tombstone purge filters on each row's own `deleted_at`. Claim adjudication passed.

### Convergence Replay
- Terminal stop reason: `maxIterationsReached`.
- Convergence saturation: not claimed.
- Required hard-gate evidence: present for both active findings.
