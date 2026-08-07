# Deep Review Report: Vector Read-Path Resilience & Performance

## Executive Summary

Verdict: `CONDITIONAL`.

Active findings: P0=0, P1=1, P2=1. `hasAdvisories=true`.

Scope: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/013-vector-read-path-resilience` and the implementation/test files named by the packet.

Stop reason: `converged` after 6 iterations. All dimensions were covered and two stabilization passes found no new findings.

The review found one required correctness issue. The repair path can rebuild the shard file and mark health healthy, but the live process can remain attached to the old shard handle after the staged replacement is renamed over the active path.

## Planning Trigger

Route to remediation planning because active P1 F001 remains. The remediation should ensure the live `active_vec` attachment is rebound after repair completion and add a same-process vector query regression.

## Active Finding Registry

| ID | Severity | Dimension | Title | Evidence | Status |
|----|----------|-----------|-------|----------|--------|
| F001 | P1 | correctness | Repair completion leaves the live connection attached to the pre-swap shard handle | `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts:598-608`; `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts:650-651`; `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:1233-1256`; `.opencode/skills/system-spec-kit/mcp_server/tests/vector-shard-read-path-resilience.vitest.ts:152-160` | active |
| F002 | P2 | maintainability | Dimension mismatch warning mislabels profile-derived dimensions as schema-derived | `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:162-166`; `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:236-253`; `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:305-307` | active |

## Remediation Workstreams

1. Rebind live vector shard attachment after repair swap: after `fs.renameSync(stagingShardPath, activeShardPath)`, force the active connection to detach and reattach `active_vec`, or perform the swap through a path that is not already attached by `jobDb`.
2. Add same-process regression coverage: extend `vector-shard-read-path-resilience.vitest.ts` to run `vector_search()` or a direct `active_vec.vec_<dim>` query through the same `db` after repair completion and assert rebuilt IDs are visible.
3. Tighten diagnostic label: map `active_embedder_profile` and `startup_profile` sources to their real names in the dimension mismatch warning.

## Spec Seed

Add an acceptance note to REQ-001: the fault-injection self-heal test must verify the still-running DB connection can query rebuilt vectors after repair completion, not only that a new connection can read the rebuilt shard file.

## Plan Seed

- Update `attachActiveVectorShard` or repair completion to force reattachment when repair replaces an attached active shard.
- Add a regression that corrupts a shard, waits for repair completion, then queries through the original `db` handle.
- Re-run targeted vitest files and build.

## Traceability Status

| Protocol | Status | Gate | Summary |
|----------|--------|------|---------|
| spec_code | partial | hard | REQ-001 is implemented at file level but not fully proven for same-process query after repair. |
| checklist_evidence | partial | hard | Checked task evidence validates rebuilt file contents through a new connection, leaving same-connection recovery uncovered. |
| feature_catalog_code | pass | advisory | KNN benchmark and degraded-vector health surfaces exist. |
| playbook_capability | partial | advisory | Live-corpus benchmark sizing is blocked and documented by the implementation summary. |

## Deferred Items

- F002 is advisory and can be fixed with the same remediation packet or deferred if F001 is handled first.
- Live-corpus benchmark sizing remains blocked by the live MCP `E040` condition documented in the implementation summary.

## Audit Appendix

| Iteration | Focus | New P0 | New P1 | New P2 | Ratio | Verdict |
|-----------|-------|--------|--------|--------|-------|---------|
| 001 | correctness | 0 | 1 | 0 | 1.00 | CONDITIONAL |
| 002 | security | 0 | 0 | 0 | 0.00 | PASS |
| 003 | traceability | 0 | 0 | 0 | 0.50 | CONDITIONAL |
| 004 | maintainability | 0 | 0 | 1 | 1.00 | PASS |
| 005 | stabilization | 0 | 0 | 0 | 0.00 | PASS |
| 006 | convergence-replay | 0 | 0 | 0 | 0.00 | PASS |

Replay validation: JSONL records parse, all dimensions are covered, F001 has a typed claim-adjudication packet, and no P0 findings remain. Final verdict is `CONDITIONAL` because one active P1 remains.
