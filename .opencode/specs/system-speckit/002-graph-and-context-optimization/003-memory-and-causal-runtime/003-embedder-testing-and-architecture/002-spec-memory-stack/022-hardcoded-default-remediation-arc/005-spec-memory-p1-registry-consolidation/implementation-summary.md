---
title: "Implementation Summary: 022/005"
description: "cli-opencode + deepseek-v4-pro dispatch consolidated 5 spec-memory files to registry.ts canonical. 7 P1 closed."
trigger_phrases: ["022/005 shipped"]
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/022-hardcoded-default-remediation-arc/005-spec-memory-p1-registry-consolidation"
    last_updated_at: "2026-05-23T18:10:00Z"
    last_updated_by: "main_agent"
    recent_action: "Shipped via cli-opencode"
    next_safe_action: "Phase 007 dispatched"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/shared/embeddings/registry.ts"
      - ".opencode/skills/system-spec-kit/shared/embeddings/providers/voyage.ts"
      - ".opencode/skills/system-spec-kit/shared/embeddings/providers/openai.ts"
      - ".opencode/skills/system-spec-kit/shared/embeddings/auto-select.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/cross-encoder.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000002255"
      session_id: "016-002-022-005-summary"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: ["7 P1 closed; voyage/cohere reranker canonical placeholders for future fill"]
---
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Implementation Summary: 022/005 Spec-Memory P1 Registry Consolidation

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|---|---|
| Status | Complete |
| Shipped | 2026-05-23 |
| Files changed | 5 |
| Typecheck | exit 0 |
| Vitest | 678 pass, 3 pre-existing failures (unrelated) |
| Findings closed | 7 P1 |
| Wall-clock | ~12 min cli-opencode dispatch |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:what-built -->
## 2. WHAT WAS BUILT

- `registry.ts`: added `RerankerProvider` type, `RERANKER_CANONICAL` frozen object, `getRerankerFallback(provider)` helper. RERANKER_CANONICAL keys: `local: 'cross-encoder/ms-marco-MiniLM-L-6-v2'`; `voyage` + `cohere` are empty-string placeholders pending canonical name establishment.
- `providers/voyage.ts:13`: `DEFAULT_MODEL = getCanonicalFallback('voyage')` (was inline `'voyage-code-3'`).
- `providers/openai.ts:13`: `DEFAULT_MODEL = getCanonicalFallback('openai')` (was inline `'text-embedding-3-small'`).
- `auto-select.ts`:
  - VOYAGE_MODEL / OPENAI_MODEL / HF_LOCAL_MODEL all derived from `getCanonicalFallback()`
  - OLLAMA_PRIORITY now derived from `MANIFESTS` (7 manifests vs prior 4 hardcoded inline)
- `cross-encoder.ts:54`: PROVIDER_CONFIG.local.model = `getRerankerFallback('local')`
<!-- /ANCHOR:what-built -->

<!-- ANCHOR:how-delivered -->
## 3. HOW IT WAS DELIVERED

cli-opencode + deepseek-v4-pro --variant high single-wave dispatch with HALT-on-failure + bundle gate. PID 37723. ~12 min wall-clock. Prompt at /tmp/005-prompt.md.
<!-- /ANCHOR:how-delivered -->

<!-- ANCHOR:decisions -->
## 4. KEY DECISIONS

- **RERANKER_CANONICAL with placeholders.** voyage/cohere reranker model names are not established defaults in the codebase; using empty-string placeholders is honest. Callers must guard with `getRerankerFallback(provider) !== ''` if they support those providers.
- **OLLAMA_PRIORITY widening.** Derivation from MANIFESTS exposed 7 vs 4 manifests. "First match wins" semantics preserved; cascade just probes more options before falling back.
<!-- /ANCHOR:decisions -->

<!-- ANCHOR:verification -->
## 5. VERIFICATION

Per dispatch self-reported PHASE 005 STATUS block:
- All targets PASS; typecheck exit 0; bundle gate PASS; 678 vitest pass; 0 new failures.
<!-- /ANCHOR:verification -->

<!-- ANCHOR:limitations -->
## 6. KNOWN LIMITATIONS

- voyage/cohere RERANKER_CANONICAL empty placeholders (callers must guard).
- Pre-existing vitest failures (DB fixtures, tool count, sidecar-hardening) persist.

### Commit Handoff

```
fix(022/005): spec-memory P1 registry consolidation via cli-opencode + deepseek-v4-pro

Closes 7 P1 audit findings via cli-opencode dispatch:
- registry.ts: added RerankerProvider type + RERANKER_CANONICAL frozen object
  + getRerankerFallback(provider) helper (local: cross-encoder/ms-marco-MiniLM-L-6-v2;
  voyage/cohere empty placeholders for future fill)
- providers/voyage.ts + providers/openai.ts: DEFAULT_MODEL derives from getCanonicalFallback
- auto-select.ts: VOYAGE_MODEL/OPENAI_MODEL/HF_LOCAL_MODEL derive from getCanonicalFallback;
  OLLAMA_PRIORITY derives from MANIFESTS (7 manifests vs prior 4 hardcoded)
- cross-encoder.ts:54: PROVIDER_CONFIG.local.model uses getRerankerFallback('local')

Bundle gate PASS: typecheck exit 0; 678 vitest pass; 3 pre-existing failures
(DB fixtures, tool count, sidecar-hardening) confirmed unrelated.
```

Paths:

```
.opencode/skills/system-spec-kit/shared/embeddings/registry.ts
.opencode/skills/system-spec-kit/shared/embeddings/providers/voyage.ts
.opencode/skills/system-spec-kit/shared/embeddings/providers/openai.ts
.opencode/skills/system-spec-kit/shared/embeddings/auto-select.ts
.opencode/skills/system-spec-kit/mcp_server/lib/search/cross-encoder.ts
.opencode/specs/system-spec-kit/.../022-.../005-spec-memory-p1-registry-consolidation/
```
<!-- /ANCHOR:limitations -->
