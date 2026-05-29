# Deep Review Strategy — 011 (opus-4.8 / Workflow-executed)

<!-- SPECKIT_TEMPLATE_SOURCE: deep-review-strategy | v2.2 -->

## Files Under Review

| File | Surface | Primary Dimension |
|------|---------|-------------------|
| `system-spec-kit/mcp_server/lib/search/vector-index-store.ts` | close_db / WAL checkpoint / shard / checkpointAllWal | Correctness |
| `system-spec-kit/mcp_server/lib/search/vector-index.ts` | barrel re-exports | Completeness |
| `system-spec-kit/mcp_server/context-server.ts` | fatalShutdown / SIGTERM·SIGINT·SIGHUP·SIGQUIT / runShutdownHooks | Correctness / Regression |
| `system-spec-kit/mcp_server/lib/runtime/shutdown-hooks.ts` | shutdown hook registry | Correctness |
| `system-code-graph/mcp_server/lib/ensure-ready.ts` | readiness / firstTimeAutoEstablish / indexWithTimeout | Correctness / Spec-Alignment |
| `system-code-graph/mcp_server/handlers/{query,context,scan,detect-changes}.ts` | read-path false-safe, scan, diff containment | Correctness / Security |
| `system-code-graph/mcp_server/lib/{code-graph-db,owner-lease,phase-runner,structural-indexer,index-scope-policy}.ts` | persistence / lease / abort signal / scope | Correctness / Security |
| `system-code-graph/mcp_server/tool-schemas.ts` + `tools/code-graph-tools.ts` | schema enforcement / dispatch | Security |
| Tests: `vector-index-store.vitest.ts`, `ensure-ready.vitest.ts`, `code-graph-default-scope.vitest.ts`, `code-graph-tool-args-validation.vitest.ts` | test-vs-claim | Completeness |
| Docs: `system-code-graph/ARCHITECTURE.md`, `SKILL.md` | docs-vs-code | Completeness |

## Cross-Reference Status

### Core (traceability)
- `spec_code`: 008/009/010 packets vs spec-memory shutdown code (iteration 4); 012 packet vs code-graph code (iteration 5).
- `checklist_evidence`: completeness/test coverage (iteration 6).

### Overlay
- Regression-risk overlay (iteration 8): shutdown teardown ordering after SIGHUP/SIGQUIT + checkpoint additions.
- Uncommitted-WIP overlay (iteration 9): checkpointAllWal + shard checkpoint-before-detach.
- Completeness-critic overlay (iteration 10): cross-fix interaction gaps.

## Known Context
- `resource-map.md` not present at init → coverage gate skipped.
- A parallel session is actively editing the same surface (context-server.ts, vector-index*.ts) + churning 1,379 graph-metadata.json. Review is against on-disk current files; findings cite current line numbers; uncommitted code is flagged.
- Prior incident: 026/004/012 FTS5 corruption (root cause: interrupted FTS5 write under abrupt kill). This review hardens the fixes that followed.

## Review Boundaries
- READ-ONLY. No file under review is modified.
- 4 dimensions × 10 iterations, fresh context each.
- Every P0 adversarially replayed (refute-or-confirm) before confirmation.
- Single state-writer: the main agent reduces the workflow's structured iteration outputs into this packet's canonical state.
