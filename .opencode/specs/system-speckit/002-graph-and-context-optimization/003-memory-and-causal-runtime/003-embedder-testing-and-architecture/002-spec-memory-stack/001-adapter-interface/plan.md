---
title: "Plan: 016/001 EmbedderAdapter interface + EmbedderRegistry"
description: "3-step plan: design interface, build registry, ship tests."
trigger_phrases: ["016/001 plan"]
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/001-adapter-interface"
    last_updated_at: "2026-05-17T08:15:00Z"
    last_updated_by: "main_agent"
    recent_action: "Scaffolded plan stub"
    next_safe_action: "Native Claude @code agent picks up"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "016-001-plan"
      parent_session_id: null
    completion_pct: 5
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Plan: 016/001 EmbedderAdapter interface + EmbedderRegistry

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context
| Aspect | Value |
|--------|-------|
| Executor | Native Claude `@code` |
| Storage | `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/` (NEW directory) |
| Output | adapter.ts + registry.ts + types.ts + index.ts + vitest |
| Testing | `npx vitest run tests/embedder-registry.vitest.ts` |

### Overview
Foundational types only. No runtime wiring.


<!-- /ANCHOR:summary -->
<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Phase parent 016 scaffolded
- [x] Native Claude @code agent assigned

### Definition of Done
- [ ] adapter.ts + registry.ts + types.ts compile
- [ ] vitest covers registry hit/miss/all-6-entries
- [ ] tsc --noEmit clean
- [ ] strict-validate 016/001 exit 0


<!-- /ANCHOR:quality-gates -->
<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Interface sketch (the design target)
```ts
export type BackendKind = 'ollama' | 'llama-cpp' | 'api' | 'sentence-transformers';

export interface EmbedderAdapter {
  readonly name: string;            // "mxbai-embed-large-v1"
  readonly dim: number;              // 1024
  readonly backend: BackendKind;
  readonly prefixQuery?: string;     // "search_query: " for nomic-embed
  readonly prefixDocument?: string;  // "search_document: " for nomic-embed
  embed(texts: string[]): Promise<Float32Array[]>;
  ready(): Promise<boolean>;
}

export interface EmbedderManifest {
  name: string;
  dim: number;
  backend: BackendKind;
  ollamaName?: string;       // for backend=ollama (the `ollama pull` name)
  modelPath?: string;        // for backend=llama-cpp (GGUF path)
  apiUrl?: string;           // for backend=api
  prefixQuery?: string;
  prefixDocument?: string;
  notes?: string;
}
```


<!-- /ANCHOR:architecture -->
<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
1. Design interface signatures + types
2. Write skeleton adapters (NotImplemented stubs returning rejection)
3. Build registry with 6 manifest entries
4. Vitest coverage
5. tsc + strict-validate


<!-- /ANCHOR:phases -->
<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
- Vitest: registry returns correct adapter per name; missing name returns undefined; all 6 manifests have valid shape
- No integration tests (no runtime wired)


<!-- /ANCHOR:testing -->
<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
- Read-only inspection of existing `mcp_server/lib/search/` for embedder usage patterns
- No new npm deps in this phase


<!-- /ANCHOR:dependencies -->
<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
Pure additive — new files only. Rollback = `rm -rf mcp_server/lib/embedders/` + revert commit.

<!-- /ANCHOR:rollback -->
