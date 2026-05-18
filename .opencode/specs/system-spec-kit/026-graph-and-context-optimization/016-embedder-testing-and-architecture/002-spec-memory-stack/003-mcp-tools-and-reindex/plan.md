---
title: "Plan: 016/003 Embedder MCP tools + re-index orchestrator"
description: "MCP tools + background orchestrator + crash-resume."
trigger_phrases: ["016/003 plan"]
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/002-spec-memory-stack/003-mcp-tools-and-reindex"
    last_updated_at: "2026-05-17T08:15:00Z"
    last_updated_by: "main_agent"
    recent_action: "Scaffolded plan stub"
    next_safe_action: "After 016/002 lands; cli-devin SWE-1.6 picks up"
    blockers: ["016/002"]
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "016-003-plan"
      parent_session_id: null
    completion_pct: 5
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Plan: 016/003 Embedder MCP tools + re-index orchestrator

<!-- ANCHOR:summary -->
## 1. SUMMARY
| Aspect | Value |
|--------|-------|
| Executor | cli-devin SWE-1.6 paired dispatch |
| Storage | `mcp_server/handlers/embedder-*.ts` + `mcp_server/lib/embedders/reindex.ts` |
| Testing | vitest with mocked OllamaAdapter; handler-level + orchestrator state-machine |


<!-- /ANCHOR:summary -->
<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
### Definition of Done
- [ ] 3 MCP tools registered + schema-validated
- [ ] Orchestrator handles batched re-embed + progress persistence + resume
- [ ] cat-18 vitest tool count updated 39 → 42
- [ ] All P0 requirements pass


<!-- /ANCHOR:quality-gates -->
<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
```ts
// reindex.ts
export interface ReindexJob {
  id: string;            // emb-swap-<utc>
  fromName: string;
  toName: string;
  toDim: number;
  total: number;
  processed: number;
  status: 'queued' | 'running' | 'completed' | 'failed' | 'cancelled';
  startedAt: string;
  updatedAt: string;
  error?: string;
}

export async function startReindex(opts: { toName: string }): Promise<string /* jobId */>
export async function getJobStatus(jobId: string): Promise<ReindexJob>
export function cancelJob(jobId: string): Promise<void>

// handlers/embedder-set.ts
export async function handleEmbedderSet({ name }): Promise<{ jobId, eta }> {
  const manifest = EmbedderRegistry.get(name);
  if (!manifest) throw new MCPError('UNKNOWN_EMBEDDER', { name });
  ensureVecTableForDim(db, manifest.dim);
  const jobId = await startReindex({ toName: name });
  return { jobId, eta: estimateEta(memoryCount, manifest) };
}
```

Two-phase swap:
1. **Embed-all phase**: read each memory, embed with new model, write to vec_<newdim>
2. **Flip phase**: ONLY when 100% embedded successfully, update settings active_embedder_name + active_embedder_dim atomically


<!-- /ANCHOR:architecture -->
<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
1. Implement 3 handlers (list / set / status)
2. Register in tool-schemas.js + update cat-18 vitest (39 → 42)
3. Implement reindex orchestrator with batched embed + progress persistence
4. Implement crash-resume (state machine reads jobState on MCP start)
5. Vitest coverage


<!-- /ANCHOR:phases -->
<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
- Handler vitest with mocked registry + mocked orchestrator
- Orchestrator state-machine vitest: happy path, crash-then-resume, cancel, error
- Integration vitest: small fixture corpus (10 memories), mocked OllamaAdapter, end-to-end swap


<!-- /ANCHOR:testing -->
<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
- 016/001 EmbedderAdapter interface
- 016/002 OllamaAdapter + schema layer
- mk-spec-memory MCP infrastructure (handlers/, tool-schemas.js)


<!-- /ANCHOR:dependencies -->
<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
Additive. Rollback = revert commit + drop embedder_jobs table (if added). Vec tables stay (no data loss).

<!-- /ANCHOR:rollback -->


