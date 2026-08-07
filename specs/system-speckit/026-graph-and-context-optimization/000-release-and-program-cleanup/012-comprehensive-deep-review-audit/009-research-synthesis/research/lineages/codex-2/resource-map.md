# Resource Map

## Charter

| Path | Role |
|---|---|
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/009-research-synthesis/spec.md` | Research charter and five key questions. |

## Tool Contracts And Memory Runtime

| Path | Role |
|---|---|
| `.opencode/skills/system-spec-kit/mcp_server/INSTALL_GUIDE.md` | Public operator docs for memory tools. |
| `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts` | Public MCP tool definitions. |
| `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts` | Runtime Zod schemas and allowed parameter lists. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/embedding-reconcile.ts` | Reconcile implementation and consumed options. |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts` | Bulk scan governance validation and index dispatch. |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-ingest.ts` | Async ingest governance validation and job creation. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/ops/job-queue.ts` | Async ingest job shape and persisted fields. |
| `.opencode/skills/system-spec-kit/mcp_server/context-server.ts` | Ingest queue processor wiring. |

## Memory Correctness

| Path | Role |
|---|---|
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/entity-density.ts` | Entity-density cache behavior and invalidation API. |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/mutation-hooks.ts` | Shared post-mutation cache invalidation. |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-update.ts` | CRUD update hook caller. |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts` | CRUD delete hook caller. |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts` | Direct save invalidation and DB/file finalization warning. |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/save/atomic-index-memory.ts` | Pending-file, indexing, and promotion order. |

## Security Calibration

| Path | Role |
|---|---|
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts` | Governed search pipeline and community fallback append. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/community-search.ts` | Community summary scan and member-id extraction. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/search-flags.ts` | Default-on fallback flags. |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/causal-graph.ts` | Causal link and unlink handlers. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/storage/causal-edges.ts` | Raw causal edge insert/delete behavior. |

## Metadata Drift Evidence

| Path | Role |
|---|---|
| `004-026-integrity/review/lineages/codex-4/review-report.md` | Independent 026 metadata/changelog drift findings. |
| `004-026-integrity/review/lineages/codex-1/review-report.md` | Independent 026 graph/changelog/status drift findings. |
| `008-027-launch-state/review/lineages/codex-1/review-report.md` | 027 parent/child metadata and status drift findings. |
| `006-governance-skdoc-skcode/review/lineages/codex-3/review-report.md` | Audit-control packet missing required metadata. |

## Deep-Loop Fan-Out

| Path | Role |
|---|---|
| `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs` | CLI lineage spawn, timeout, stdout salvage, and exit-code handling. |
| `.opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs` | Concurrency-capped pool and summary accounting. |
| `.opencode/skills/deep-loop-runtime/tests/unit/fanout-run.vitest.ts` | Fanout-run integration coverage. |
| `.opencode/skills/deep-loop-runtime/tests/unit/fanout-pool.vitest.ts` | Pool concurrency/failure isolation tests. |
| `.opencode/commands/deep/assets/deep_start-research-loop_auto.yaml` | Research fan-out orchestration contract. |
| `.opencode/commands/deep/assets/deep_start-review-loop_auto.yaml` | Review fan-out orchestration contract. |
