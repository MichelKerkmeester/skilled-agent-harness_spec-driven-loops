---
title: "Plan: 016/002 Ollama backend + dim-tagged schema"
description: "Implement OllamaAdapter + ensureVecTableForDim + active-embedder pointer."
trigger_phrases: ["016/002 plan"]
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-pluggable-embedder-architecture/002-ollama-backend-and-multi-dim-schema"
    last_updated_at: "2026-05-17T06:50:50Z"
    last_updated_by: "codex"
    recent_action: "Delivered two-layer swap mechanism and registry adapter factory"
    next_safe_action: "Phase 016/003 MCP tools + reindex orchestrator"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "016-002-plan"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Plan: 016/002 Ollama backend + dim-tagged schema

<!-- ANCHOR:summary -->
## 1. SUMMARY
| Aspect | Value |
|--------|-------|
| Executor | cli-codex gpt-5.5 high fast |
| Storage | `mcp_server/lib/embedders/adapters/` + `mcp_server/lib/embedders/schema.ts` |
| Testing | mocked-HTTP vitest + sqlite schema vitest |


<!-- /ANCHOR:summary -->
<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
### Definition of Done
- [x] OllamaAdapter compiles + tests pass (`npm run build`, `npx tsc --noEmit`, `npx vitest run tests/embedder-ollama.vitest.ts`)
- [x] `ensureVecTableForDim(dim)` works for 768, 1024, 384 (`npx vitest run tests/embedder-schema.vitest.ts`)
- [x] Existing vec_768 + 008 corpus untouched (`node dist/cli.js stats`, prohibited search files diff clean)
- [x] Active-embedder pointer reads/writes via existing `vec_metadata` settings rows


<!-- /ANCHOR:quality-gates -->
<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
```ts
// schema.ts
export function ensureVecTableForDim(db: Database, dim: number): void {
  // CREATE TABLE IF NOT EXISTS vec_<dim> (id INTEGER PRIMARY KEY, vec BLOB);
}
export function getActiveEmbedder(db: Database): { name: string; dim: number } { ... }
export function setActiveEmbedder(db: Database, name: string, dim: number): void { ... }

// adapters/ollama.ts
export class OllamaAdapter implements EmbedderAdapter {
  async embed(texts: string[]): Promise<Float32Array[]> {
    const prefixed = texts.map(t => `${this.prefixDocument ?? ''}${t}`);
    // POST http://localhost:11434/api/embeddings { model, prompt }
    // Aggregate results, return Float32Array[]
  }
  async ready(): Promise<boolean> {
    // GET http://localhost:11434/api/tags, check model present
  }
}
```


<!-- /ANCHOR:architecture -->
<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
1. Implement OllamaAdapter against 016/001 interface
2. Implement schema helpers (lazy create + active pointer)
3. Add registry `getAdapter()` bridge without switching existing retrieval callers
4. Vitest coverage
5. Verify packet 008 vec_768 untouched


<!-- /ANCHOR:phases -->
<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
- HTTP-mocked OllamaAdapter tests (no live ollama dependency)
- Schema vitest with in-memory sqlite
- 008 sample re-run (read-only check that vec_768 + memory_search still work)


<!-- /ANCHOR:testing -->
<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
- 016/001 EmbedderAdapter interface (BLOCKER)
- Existing `mcp_server/lib/search/vector-index-schema.ts` (extend, don't replace)
- Codex K commit `8ec4f1491` — preserve untouched
- npm dep: none new (HTTP via Node fetch; sqlite via existing better-sqlite3)


<!-- /ANCHOR:dependencies -->
<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
Additive — new files + ONE additive column in settings table. Rollback = revert commit + drop new tables.

<!-- /ANCHOR:rollback -->

