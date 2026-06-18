# Deep Review Strategy

## Topic

Review target: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/013-vector-read-path-resilience`

Artifact root: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/013-vector-read-path-resilience/review/lineages/gpt-3`

## Review Dimensions

- [x] Correctness: checked shard quarantine, repair swap, live attachment, and the fault-injection test.
- [x] Security: checked path handling and observability disclosure boundaries.
- [x] Traceability: checked spec requirements, task evidence, implementation summary, and test evidence.
- [x] Maintainability: checked repair workflow clarity, query benchmark helper, and observability state shape.

## Completed Dimensions

| Dimension | Iteration | Verdict | Notes |
|-----------|-----------|---------|-------|
| Correctness | 001 | CONDITIONAL | Found F001, an active live-connection self-heal gap. |
| Security | 002 | PASS | No secret, path traversal, or privilege boundary finding identified in scoped code. |
| Traceability | 003 | CONDITIONAL | Spec-code coverage is partial because F001 weakens REQ-001. |
| Maintainability | 004 | CONDITIONAL | No extra finding beyond F001; playbook/code capability remains partial. |
| Stabilization | 005 | CONDITIONAL | No new findings; active P1 remains. |

## Running Findings

| Severity | Active | Notes |
|----------|--------|-------|
| P0 | 0 | None. |
| P1 | 1 | F001 blocks unconditional release readiness. |
| P2 | 0 | None. |

## Findings

| ID | Severity | Status | Title | Evidence |
|----|----------|--------|-------|----------|
| F001 | P1 | Active | Repair swap leaves the live connection attached to the stale shard | `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts:608`; `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:1233-1242`; `.opencode/skills/system-spec-kit/mcp_server/tests/vector-shard-read-path-resilience.vitest.ts:149-160` |

## What Worked

- Reading the shard attach path and repair reindex path together exposed the attached-handle boundary.
- The tests showed the exact missing assertion: they verify the file on disk after repair, not the current connection's attached `active_vec` query surface.

## What Failed

- Treating the atomic rename as sufficient for live self-heal misses SQLite's open-handle semantics.

## Exhausted Approaches

- No evidence supported a P0 classification; the issue is a live-process degradation requiring fix, not proven data loss or security exposure.

## Ruled Out Directions

- Quarantine path traversal: shard paths are derived from database/profile paths, and the test asserts the shard stays under the temp DB directory.
- KNN query shape regression: implementation keeps scalar JOIN because the benchmark threshold was not met.

## Next Focus

Remediate F001 by detaching/re-attaching `active_vec` after the staged shard swap or by swapping only after the active connection has released the shard, then add a test that queries `active_vec.vec_<dim>` or `vector_search` on the same connection after repair completion.

## Known Context

- `resource-map.md` not present. Skipping coverage gate.
- The spec is Level 1 and marked complete, with live-corpus benchmark sizing blocked by MCP `E040`.
- User supplied `config.fanout_lineage_artifact_dir`; artifact root was bound directly without running the resolveArtifactRoot node command.

## Cross-Reference Status

| Protocol | Gate | Status | Evidence |
|----------|------|--------|----------|
| spec_code | hard | partial | REQ-001 claims zero-manual self-heal; F001 shows same-process attachment remains stale. |
| checklist_evidence | hard | pass | `tasks.md:50-81` provides checked evidence for tasks. |
| feature_catalog_code | advisory | partial | Feature exists but current-process self-heal remains incomplete. |
| playbook_capability | advisory | partial | Implementation summary does not mention live reattachment after swap. |

## Files Under Review

| File | Coverage | Notes |
|------|----------|-------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-store.ts` | reviewed | Attach, probe, quarantine, rebuild scheduling. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts` | reviewed | Staging write, atomic rename, completion, reattach call. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts` | reviewed | Benchmark helper and scalar JOIN retention. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/observability/retrieval-observability.ts` | reviewed | Degraded-vector state transitions. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/vector-shard-read-path-resilience.vitest.ts` | reviewed | Fault-injection test misses same-connection active_vec assertion. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/vector-dimension-source.vitest.ts` | reviewed | Dimension source coverage. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/vector-knn-query-shape-benchmark.vitest.ts` | reviewed | Benchmark threshold coverage. |

## Review Boundaries

- Max iterations: 6.
- Completed iterations: 5.
- Target files were read-only.
- Outputs were written only under the provided lineage artifact root.

## Non-Goals

- No code or spec remediation was performed.
- No paths outside the lineage artifact root were written.

## Stop Conditions

- Stopped after all dimensions and required traceability protocols had coverage plus one stabilization pass.
- Final verdict remains CONDITIONAL because one active P1 finding remains.
