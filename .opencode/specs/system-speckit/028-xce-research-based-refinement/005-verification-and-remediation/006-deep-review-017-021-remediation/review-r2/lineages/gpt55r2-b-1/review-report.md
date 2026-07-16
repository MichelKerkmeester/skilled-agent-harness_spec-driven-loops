# Deep Review Report

## Executive Summary

Verdict: CONDITIONAL.

The one-iteration fan-out lineage found one active P1 and no P0s. The P1 is a data-integrity gap in atomic memory save ordering: DB indexing can commit before the pending file is promoted, and promotion failure can delete the pending content. Release readiness remains `in-progress` until F001 is remediated or disproved.

| Severity | Active |
|---|---:|
| P0 | 0 |
| P1 | 1 |
| P2 | 0 |

Scope: `.opencode/skills/system-spec-kit/mcp_server/` memory store/index/lifecycle code for B-rest-of-002. `hasAdvisories=false`.

## Planning Trigger

Route to remediation planning because the active P1 affects write-path atomicity and can leave persisted index state inconsistent with disk state after a failure in final file promotion.

## Active Finding Registry

| ID | Severity | Dimension | Title | Evidence | Status |
|---|---|---|---|---|---|
| F001 | P1 | correctness | Atomic save can commit index rows before final file promotion | `.opencode/skills/system-spec-kit/mcp_server/handlers/save/atomic-index-memory.ts:362`, `.opencode/skills/system-spec-kit/mcp_server/handlers/save/atomic-index-memory.ts:378`, `.opencode/skills/system-spec-kit/mcp_server/handlers/save/atomic-index-memory.ts:387-390`, `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts:2565-2685` | active |

## Remediation Workstreams

| Workstream | Findings | Action |
|---|---|---|
| Atomic save rollback | F001 | Ensure file promotion and DB mutation are ordered or transactionally coupled so promotion failure cannot leave a committed DB row without durable file content. Preserve pending content for recovery if rollback cannot be guaranteed. |
| Regression coverage | F001 | Add a fault-injection test that forces `promotePendingFile` to throw after `indexPrepared` success and verifies no active `memory_index` row remains without matching disk content. |

## Spec Seed

- Specify the atomic save invariant: after `memory_save` returns an error, either no new active `memory_index` row exists or the final file/pending recovery path contains the exact committed content.
- Specify expected behavior for `promotePendingFile` failures after DB mutation: rollback, recovery marker, or explicit error metadata with preserved pending file.

## Plan Seed

- Reproduce F001 with dependency injection in `atomicIndexMemory` using a successful `indexPrepared` and throwing `promotePendingFile`.
- Change the implementation so DB mutation occurs after final promotion where possible, or make DB mutation rollbackable from the same failure boundary.
- If rollback cannot cover all paths, stop deleting the pending file in the promotion-failure branch and surface recovery metadata.
- Verify normal save, rejected save, promotion failure, and retry behavior.

## Traceability Status

| Protocol | Status | Gate | Summary |
|---|---|---|---|
| spec_code | partial | hard | Scope asked for write safety and transaction boundaries; F001 confirms a gap. |
| checklist_evidence | pass | hard | No checklist exists in the scope packet, so no checked evidence claims were present. |
| feature_catalog_code | partial | advisory | Memory save/index feature surfaces were sampled. |
| playbook_capability | skipped | advisory | No playbook was present for this narrow scope packet. |

## Deferred Items

- Continue with a second lineage pass if desired for deeper coverage of `chunking-orchestrator.ts`, `memory-ingest.ts`, and retention sweep paths.
- No P2-only advisories were recorded.

## Audit Appendix

| Item | Result |
|---|---|
| Iterations | 1 |
| Stop reason | `maxIterationsReached` |
| Claim adjudication | F001 passed with confidence 0.88 |
| Convergence replay | Max-iteration hard stop; active P1 yields CONDITIONAL |
| Resource map | Not present at init |
| Target files modified | None |

Replay notes: JSONL contains one config record, one iteration record, one claim-adjudication event, and one synthesis-complete event. The iteration file ends with the required final verdict line.
