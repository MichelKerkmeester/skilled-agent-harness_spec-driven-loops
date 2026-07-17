# Resource Map - gpt55r2-b-10

## Scope Entry

- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/006-deep-review-017-021-remediation/review-r2/scopes/B-rest-of-002/spec.md`

## Store And Index Lifecycle

- `.opencode/skills/system-spec-kit/mcp_server/context-server.ts` - initializes async ingest queue with `indexSingleFile` callback.
- `.opencode/skills/system-spec-kit/mcp_server/lib/ops/job-queue.ts` - async ingest worker state machine and per-file error accounting.
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-ingest.ts` - start/status/cancel handlers and public ingest job response shape.
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts` - scan path, `indexSingleFile`, and successful-status classification.
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts` - `indexMemoryFile` and `processPreparedMemory` returned failure statuses.

## Delete And Retention Lifecycle

- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts` - single and folder delete, soft tombstone helper.
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts` - tier bulk delete, soft tombstone helper.
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts` - hard-delete cleanup behavior.
- `.opencode/skills/system-spec-kit/mcp_server/lib/governance/memory-retention-sweep.ts` - retention sweep tombstone/purge behavior, inspected via grep results.

## Active Consumer Cross-Checks

- `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts` - vector, multi-concept, folder, and usage query paths.
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts` - FTS5/BM25 search path.
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/hybrid-search.ts` - trigger, structural, and channel aggregation paths.
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts` - causal graph search seed paths.
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/recovery-payload.ts` - recovery payload graph-neighbor seed query.
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts` - usage-ranking metadata lookup.

## Produced Artifacts

- `deep-review-config.json`
- `deep-review-state.jsonl`
- `deep-review-findings-registry.json`
- `deep-review-strategy.md`
- `deep-review-dashboard.md`
- `prompts/iteration-001.md`
- `iterations/iteration-001.md`
- `deltas/iter-001.jsonl`
- `review-report.md`
- `resource-map.md`
