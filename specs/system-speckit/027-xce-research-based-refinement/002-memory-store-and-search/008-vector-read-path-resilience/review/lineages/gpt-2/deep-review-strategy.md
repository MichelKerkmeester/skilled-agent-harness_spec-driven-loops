# Deep Review Strategy: Vector Read-Path Resilience & Performance

<!-- ANCHOR:topic -->
## Topic

Review lineage `gpt-2` for `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/013-vector-read-path-resilience`.

Artifact binding: `artifact_dir` was bound directly to `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/013-vector-read-path-resilience/review/lineages/gpt-2` from `config.fanout_lineage_artifact_dir`; no artifact-root resolver command was run.
<!-- /ANCHOR:topic -->

<!-- ANCHOR:review-dimensions -->
## Review Dimensions

| Dimension | Status | Iterations | Notes |
|-----------|--------|------------|-------|
| correctness | complete | 1, 5, 6 | One active P1 found on same-process shard attachment after repair. |
| security | complete | 2 | No exploit path, secret exposure, or unsafe path expansion found in reviewed scope. |
| traceability | complete | 3, 6 | Core protocols partially pass because REQ-001 evidence misses same-connection query verification. |
| maintainability | complete | 4, 6 | One P2 diagnostic-label issue found. |
<!-- /ANCHOR:review-dimensions -->

<!-- ANCHOR:completed-dimensions -->
## Completed Dimensions

- [x] Correctness: `CONDITIONAL`, active F001.
- [x] Security: `PASS`, no findings.
- [x] Traceability: `CONDITIONAL`, F001 maps to REQ-001 evidence gap.
- [x] Maintainability: `PASS`, advisory F002.
<!-- /ANCHOR:completed-dimensions -->

<!-- ANCHOR:running-findings -->
## Running Findings

| Severity | Active | Finding IDs |
|----------|--------|-------------|
| P0 | 0 | none |
| P1 | 1 | F001 |
| P2 | 1 | F002 |
<!-- /ANCHOR:running-findings -->

<!-- ANCHOR:what-worked -->
## What Worked

- Iteration 1 compared the repair swap in `reindex.ts` against the attach path in `vector-index-store.ts` and found the live-handle gap.
- Iteration 3 cross-checked completion claims against tests and confirmed the current fixture validates the rebuilt file from a new connection, not the live connection.
- Iterations 5 and 6 replayed the same evidence and found no stronger P0 security or data-loss claim.
<!-- /ANCHOR:what-worked -->

<!-- ANCHOR:what-failed -->
## What Failed

- Treating `vectorIds(shardPath)` as end-to-end self-heal evidence is insufficient because it opens a fresh SQLite connection.
- `memory_health` state alone is insufficient proof of repaired vector search because health is driven by observability counters, not a post-repair same-connection query.
<!-- /ANCHOR:what-failed -->

<!-- ANCHOR:exhausted-approaches -->
## Exhausted Approaches

- Security escalation for F001 was checked and rejected: the issue is stale live attachment behavior, not arbitrary path write, auth bypass, or secret exposure.
- Resource-map coverage audit is not applicable because the target spec folder has no `resource-map.md`.
<!-- /ANCHOR:exhausted-approaches -->

<!-- ANCHOR:ruled-out-directions -->
## Ruled-Out Directions

- P0 severity for F001: rejected because the rebuilt shard file is written and the issue appears bounded to the current live connection until detach/reopen, not confirmed data loss.
- Query-shape adoption issue: rejected because the benchmark helper honors the greater-than-20-percent gate and production search intentionally keeps scalar JOIN.
<!-- /ANCHOR:ruled-out-directions -->

<!-- ANCHOR:next-focus -->
## Next Focus

Remediate F001 by detaching and reattaching `active_vec` after the staged shard swap, or by ensuring the repair worker never renames over an attached shard without rebinding the live connection. Add a regression that runs `vector_search()` on the same `db` after repair completion.
<!-- /ANCHOR:next-focus -->

<!-- ANCHOR:known-context -->
## Known Context

- `resource-map.md not present. Skipping coverage gate`.
- The packet claims completion, with a documented live-corpus benchmark blocker caused by live MCP `E040`.
- Spec Kit Memory trigger lookup rejected the fanout id as a server-managed memory session; this lineage uses it only as deep-review lineage metadata.
<!-- /ANCHOR:known-context -->

<!-- ANCHOR:cross-reference-status -->
## Cross-Reference Status

| Protocol | Level | Status | Evidence | Notes |
|----------|-------|--------|----------|-------|
| spec_code | core | partial | `spec.md:104`, `reindex.ts:598-608`, `vector-index-store.ts:1233-1256` | REQ-001 is not fully proven for same-process query after repair. |
| checklist_evidence | core | partial | `tasks.md:59`, `tasks.md:71`, `vector-shard-read-path-resilience.vitest.ts:152-160` | Completion evidence checks rebuilt file but not live attached query. |
| feature_catalog_code | overlay | pass | `vector-index-queries.ts:132-238`, `retrieval-observability.ts:198-213` | Benchmark and health surfaces exist. |
| playbook_capability | overlay | partial | `implementation-summary.md:107-108` | Live-corpus sizing remained blocked, documented rather than hidden. |
<!-- /ANCHOR:cross-reference-status -->

<!-- ANCHOR:files-under-review -->
## Files Under Review

| File | Coverage | Notes |
|------|----------|-------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-store.ts` | reviewed | Attach/probe/dimension-source paths checked. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts` | reviewed | Repair staging and swap path checked. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts` | reviewed | KNN benchmark and scalar search path checked. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/observability/retrieval-observability.ts` | reviewed | Degraded-vector counters checked. |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-health.ts` | reviewed | Health payload integration checked. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/vector-shard-read-path-resilience.vitest.ts` | reviewed | Fault-injection coverage checked. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/vector-dimension-source.vitest.ts` | reviewed | Dimension-source coverage checked. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/vector-knn-query-shape-benchmark.vitest.ts` | reviewed | Benchmark gate coverage checked. |
<!-- /ANCHOR:files-under-review -->

<!-- ANCHOR:review-boundaries -->
## Review Boundaries

- Max iterations: 6.
- Scope: read-only review of the target packet implementation and tests.
- Allowed writes: this lineage directory only.
- Non-goals: implementing fixes, changing production code, running the artifact-root resolver.
- Stop conditions: all dimensions covered with stabilization, or max iterations reached.
<!-- /ANCHOR:review-boundaries -->
