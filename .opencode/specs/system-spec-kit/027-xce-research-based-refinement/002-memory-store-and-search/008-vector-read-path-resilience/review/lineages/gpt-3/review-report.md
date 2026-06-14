# Deep Review Report

## Executive Summary

Verdict: CONDITIONAL

Active findings: P0=0, P1=1, P2=0. The reviewed implementation covers the intended shard probe, quarantine, repair scheduling, dimension source, benchmark helper, and observability paths, but one active P1 blocks unconditional release readiness: after repair swaps the rebuilt shard file into place, the live database connection can remain attached to the old shard handle.

Scope: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/013-vector-read-path-resilience` and the code/tests named by its implementation summary.

hasAdvisories: false

Stop reason: all dimensions covered with one stabilization pass; active P1 remains.

## Planning Trigger

Route to remediation planning for F001. The fix should make same-process vector search observe the rebuilt shard before degraded-vector health returns to `healthy`.

## Active Finding Registry

| ID | Severity | Status | Dimension | Title | Evidence |
|----|----------|--------|-----------|-------|----------|
| F001 | P1 | active | correctness | Repair swap leaves the live connection attached to the stale shard | `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts:608`; `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:1233-1242`; `.opencode/skills/system-spec-kit/mcp_server/tests/vector-shard-read-path-resilience.vitest.ts:149-160` |

## Remediation Workstreams

| Workstream | Findings | Action |
|------------|----------|--------|
| Live shard reattachment | F001 | After staging rename, explicitly detach and reattach `active_vec`, or perform the swap only after releasing the existing attachment. Ensure the connection used by the daemon queries the rebuilt shard before marking repair healthy. |
| Regression coverage | F001 | Extend the fault-injection test to query the same connection's `active_vec.vec_<dim>` or run `vector_search` after repair completion, not only reopen the shard file by path. |

## Spec Seed

- Add acceptance evidence for current-process searchability after repair: corrupted shard -> quarantine -> rebuild -> same live connection returns rebuilt vectors without restart.

## Plan Seed

1. Reproduce F001 with a same-connection post-repair assertion.
2. Add explicit detach/reattach semantics around the repair completion swap.
3. Verify degraded-vector health returns to `healthy` only after same-connection vector search sees the rebuilt rows.

## Traceability Status

| Protocol | Gate | Status | Summary |
|----------|------|--------|---------|
| spec_code | hard | partial | REQ-001 is not fully proven because the live connection can remain on a stale attached shard. |
| checklist_evidence | hard | pass | Level 1 task evidence exists in `tasks.md`. |
| feature_catalog_code | advisory | partial | Feature exists, but current-process repair completion is partial. |
| playbook_capability | advisory | partial | Operational summary does not cover live reattachment after swap. |

## Deferred Items

- Live-corpus benchmark sizing remains blocked by the previously recorded MCP `E040`; this review did not rerun live health or benchmark commands.

## Audit Appendix

| Iteration | Focus | New P0 | New P1 | New P2 | Ratio |
|-----------|-------|--------|--------|--------|-------|
| 001 | correctness | 0 | 1 | 0 | 1.00 |
| 002 | security | 0 | 0 | 0 | 0.00 |
| 003 | traceability | 0 | 0 | 0 | 0.00 |
| 004 | maintainability | 0 | 0 | 0 | 0.00 |
| 005 | stabilization | 0 | 0 | 0 | 0.00 |

Replay validation: JSONL, registry, strategy, dashboard, iterations, and this report agree on one active P1 and a CONDITIONAL verdict.

Evidence density: F001 has four file:line evidence references and a typed adjudication packet.

Convergence: dimension coverage is 4/4; required traceability protocols covered as pass/partial; stabilization pass produced no new findings.
