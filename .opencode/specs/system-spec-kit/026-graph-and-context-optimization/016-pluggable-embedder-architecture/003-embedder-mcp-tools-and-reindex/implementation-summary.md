---
title: "Summary: 016/003 Embedder MCP tools + re-index orchestrator"
description: "Implemented embedder MCP tools, background re-index orchestration, and verification coverage."
trigger_phrases: ["016/003 summary"]
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-pluggable-embedder-architecture/003-embedder-mcp-tools-and-reindex"
    last_updated_at: "2026-05-17T07:05:00Z"
    last_updated_by: "codex"
    recent_action: "Implemented and verified phase 016/003"
    next_safe_action: "Use embedder_set in 016/004 to run the mxbai swap"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/embedder-list.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/embedder-set.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/embedder-status.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "016-003-summary"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Summary: 016/003 Embedder MCP tools + re-index orchestrator

<!-- ANCHOR:metadata -->
## 1. METADATA
| Field | Value |
|-------|-------|
| Status | Shipped |
| Branch | main |
| Wall-clock estimate | 5-8 hours |


<!-- /ANCHOR:metadata -->
<!-- ANCHOR:what-built -->
## 2. WHAT WAS BUILT
- `handlers/embedder-list.ts`: lists registered manifests, marks the active embedder, and probes adapter readiness with bounded timeouts.
- `handlers/embedder-set.ts`: validates manifest names, lazy-creates the target dim table, starts a background re-index job, and returns job status metadata.
- `handlers/embedder-status.ts`: reports an explicit job or the active queued/running job.
- `lib/embedders/reindex.ts`: persists `embedder_jobs`, batches embedding work, writes to `vec_<dim>`, supports cancel/resume, and flips active pointers only after full success.
- Tool schemas, runtime validation, dispatch, and startup crash-resume registration are wired for the three new MCP tools.
- Vitest coverage was added for the three handlers and the orchestrator state machine, including a 10-memory fixture path.


<!-- /ANCHOR:what-built -->
<!-- ANCHOR:how-delivered -->
## 3. HOW IT WAS DELIVERED
Delivered directly in the system-spec-kit MCP server on `main`. The implementation reuses the existing vector-index database connection and envelope conventions, and keeps the old `vec_memories` table untouched.


<!-- /ANCHOR:how-delivered -->
<!-- ANCHOR:decisions -->
## 4. KEY DECISIONS
- Job state uses a dedicated `embedder_jobs` table rather than overloading generic settings rows.
- Batched embed defaults to 50 and is configurable via `EMBEDDER_REINDEX_BATCH_SIZE`.
- Crash-resume is started from MCP server startup via `resumeReindexJobs(database)`.
- Cancel is graceful: it marks the job cancelled and the loop halts between batches.
- Partial target-table writes are isolated in `vec_<newdim>` and are safe to overwrite on retry.


<!-- /ANCHOR:decisions -->
<!-- ANCHOR:verification -->
## 5. VERIFICATION
| Check | Result |
|-------|--------|
| `npm run build` | Pass |
| `npx tsc --noEmit` | Pass |
| `npx vitest run tests/embedder-list.vitest.ts` | Pass |
| `npx vitest run tests/embedder-set.vitest.ts` | Pass |
| `npx vitest run tests/embedder-status.vitest.ts` | Pass |
| `npx vitest run tests/embedder-reindex.vitest.ts` | Pass |
| `npx vitest run tests/context-server.vitest.ts` | Pass, 42 tools |
| `npx vitest run tests/embedder-registry.vitest.ts` | Pass |
| `npx vitest run tests/embedder-ollama.vitest.ts` | Pass |
| `npx vitest run tests/embedder-schema.vitest.ts` | Pass |
| `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .../003-embedder-mcp-tools-and-reindex --strict` | Pass |


<!-- /ANCHOR:verification -->
<!-- ANCHOR:limitations -->
## 6. KNOWN LIMITATIONS
- Re-index pauses if ollama is unreachable mid-run (recoverable on next start)
- Cancel doesn't roll back partial writes (those are isolated in vec_<newdim>; safe to overwrite on retry)
- Large corpora (>100k memories) may need pagination tuning (default 50 batch may be too small)

<!-- /ANCHOR:limitations -->
