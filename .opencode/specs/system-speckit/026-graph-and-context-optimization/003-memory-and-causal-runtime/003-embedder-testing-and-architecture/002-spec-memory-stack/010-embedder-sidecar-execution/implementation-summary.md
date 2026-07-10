---
title: "Implementation Summary: Embedder Sidecar Execution"
description: "Local in-process embedder runtimes now route through lazy child-process sidecars by policy, with MCP-owned cache/vector writes and health telemetry for live workers."
trigger_phrases:
  - "embedder sidecar execution summary"
  - "sidecar_workers implementation summary"
  - "embedder sidecar commit handoff"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/010-embedder-sidecar-execution"
    last_updated_at: "2026-05-19T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Verified sidecar execution packet"
    next_safe_action: "Commit scoped files"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-worker.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/embedders/execution-router.ts"
    session_dedup:
      fingerprint: "sha256:0160020103333333333333333333333333333333333333333333333333333333"
      session_id: "phase-016-002-010"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## METADATA

| Field | Value |
|-------|-------|
| **Spec Folder** | `system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/002-spec-memory-stack/010-embedder-sidecar-execution` |
| **Completed** | 2026-05-19 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## WHAT WAS BUILT

The embedder layer now has a process-boundary execution router. In `auto`, local in-process providers use a lazy sidecar, while Ollama, Voyage, and OpenAI stay direct. `direct` preserves in-process behavior for debugging, and `sidecar` forces worker execution for any provider.

### Sidecar Lifecycle

`sidecar-client.ts` implements `EmbedderAdapter` over JSONL stdio. It forks on first `embed()`, pings before each request, correlates numeric response ids, prefixes worker stderr with `[sidecar:<pid>]`, evicts idle workers, and shuts workers down on process exit hooks.

### Worker Execution

`sidecar-worker.ts` reads JSONL requests from stdin, lazily creates a shared embedding provider in the child process, returns vectors to stdout, and converts provider errors into structured error responses.

### Router and Call Sites

`execution-router.ts` centralizes `SPECKIT_EMBEDDER_EXECUTION` policy and caches one sidecar per provider/model tuple. Query embedding and reindex jobs now request adapters through this router, so cache writes, vector writes, job updates, and active pointer mutation remain in the MCP process.

### Health Telemetry

Full `memory_health` reports include `sidecar_workers`, keyed by provider/model, with pid, model, last request time, idle age, and request count.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.ts` | Created | Sidecar client lifecycle and protocol |
| `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-worker.ts` | Created | Child-process provider runner |
| `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/execution-router.ts` | Created | Direct/sidecar policy routing |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts` | Modified | Query embedding router use |
| `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts` | Modified | Reindex router use |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-health.ts` | Modified | `sidecar_workers` full-report field |
| `.opencode/skills/system-spec-kit/mcp_server/tests/embedder-sidecar.vitest.ts` | Created | Sidecar lifecycle and router tests |
| `.opencode/skills/system-spec-kit/references/memory/embedder_architecture.md` | Modified | Sidecar execution docs |
| `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md` | Modified | Sidecar env vars |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/002-spec-memory-stack/010-embedder-sidecar-execution/` | Created | Level 1 packet docs and metadata |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## HOW IT WAS DELIVERED

The change adds an execution layer without moving storage authority. The sidecar only owns provider runtime memory and vector generation; the MCP process keeps cache lookup/store, vector table writes, and reindex job state.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## KEY DECISIONS

| Decision | Why |
|----------|-----|
| Keep `auto` direct for Ollama | Ollama model memory already lives outside the MCP daemon |
| Sidecar `hf-local` by default | Transformers.js model state is the current in-process RSS risk |
| Cache sidecars by provider/model | Avoids warm pools across multiple models while reusing the active worker |
| Keep DB writes in MCP process | Avoids cross-process SQLite ownership and consistency failure modes |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## VERIFICATION

| Check | Result |
|-------|--------|
| `npm --prefix .opencode/skills/system-spec-kit/mcp_server run typecheck` | PASS |
| `npx vitest --run embedder-sidecar` | PASS, 1 file / 10 tests |
| `npx vitest --run embedder` | PASS, 10 files / 64 tests |
| `npm --prefix .opencode/skills/system-spec-kit/mcp_server run build` | PASS |
| Integration probe | PASS, built client handled 5 requests on one worker, idle-evicted, and respawned |
| `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <010> --strict` | PASS, `RESULT: PASSED` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## KNOWN LIMITATIONS

1. **First local embedding after idle pays spawn and model load.** This is intentional; `SPECKIT_EMBEDDER_EXECUTION=direct` is available for debugging or latency-sensitive local sessions.
2. **Future local providers still need concrete provider implementations.** The router reserves sidecar policy for `sentence-transformers` and `llama-cpp`, but this packet does not reintroduce those backends.

## Commit Handoff

Codex sandbox blocks direct `.git/index.lock` writes in some sessions, so stage these exact source paths from a normal shell after verification:

```bash
git add \
  .opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.ts \
  .opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-worker.ts \
  .opencode/skills/system-spec-kit/mcp_server/lib/embedders/execution-router.ts \
  .opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts \
  .opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts \
  .opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-health.ts \
  .opencode/skills/system-spec-kit/mcp_server/tests/embedder-sidecar.vitest.ts \
  .opencode/skills/system-spec-kit/references/memory/embedder_architecture.md \
  .opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md \
  .opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/002-spec-memory-stack/010-embedder-sidecar-execution/

git commit -m "feat(016/002/010): embedder sidecar execution for local backends"
```
<!-- /ANCHOR:limitations -->
