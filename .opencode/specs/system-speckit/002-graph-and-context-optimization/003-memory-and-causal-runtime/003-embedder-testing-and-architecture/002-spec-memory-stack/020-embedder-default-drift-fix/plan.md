---
title: "Plan: 016/002/020 Embedder Default Drift Fix"
description: "Shape-C registry-derived getCanonicalFallback() helper replacing 5 stale hardcoded defaults across shared/embeddings/* + sidecar-worker."
trigger_phrases:
  - "020 plan registry-derived helper"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/020-embedder-default-drift-fix"
    last_updated_at: "2026-05-23T11:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "Plan written post-execution to document the shipped approach"
    next_safe_action: "n/a — shipped; see implementation-summary.md"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/shared/embeddings/registry.ts"
      - ".opencode/skills/system-spec-kit/shared/embeddings/registry.test.ts"
    session_dedup:
      fingerprint: "sha256:00000000000000000000000000000000000000000000000000000000000020a1"
      session_id: "016-002-020-plan"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Shape choice locked at Shape C — see decision-record ADR-001."
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Plan: 016/002/020 Embedder Default Drift Fix

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

Two parallel Explore agents investigated the historic ADR decisions (ADR-013/014 in packets 004 + 015) and traced the embedder resolution chain in code. Both converged on the same architectural fix: replace 5 inline string constants with a single `getCanonicalFallback(provider)` helper in `registry.ts` whose ollama/hf-local return values are derived from `MANIFESTS[0]`. The decision-record.md captures the four architectural shapes considered (A delete + throw, B documented LAST_RESORT_FALLBACK constant, C registry-derived helper, D external JSON config) and the choice of Shape C.

### Overview

Resolution chain priority (already exists, see ADR-013/014):

1. Provider-specific env var (`VOYAGE_EMBEDDINGS_MODEL`, `OPENAI_EMBEDDINGS_MODEL`, `OLLAMA_EMBEDDINGS_MODEL`, `HF_EMBEDDINGS_MODEL`)
2. `vec_metadata.active_embedder_name` from SQLite (persisted via `embedder_set` MCP tool)
3. Cascade probe (`autoSelectActiveEmbedder()` at `auto-select.ts:506-524`) — local-first order per ADR-014: ollama → hf-local → openai → voyage
4. **Hardcoded fallback** — this is what 020 fixes

After 020 ships, step 4 still exists for defense-in-depth but always returns a registry-validated string. The fallback is reachable but cannot be stale.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- ADR-013/014 already shipped and referenced as predecessors.
- Registry MANIFESTS structure understood (lines 24–81 of `registry.ts`).
- 5 hardcoded-default sites enumerated and confirmed via repo-wide grep.
- Test convention identified (standalone assertions, see `shared/predicates/boolean-expr.test.ts`).

### Definition of Done

- All R1–R10 from spec.md §4 satisfied.
- Strict-validate PASS on this packet.
- `git status` shows clean working tree on the 6 source files + 1 new test file + 6 spec docs.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Single helper + registry-derived defaults. The function lives next to the registry it derives from (`shared/embeddings/registry.ts`), so a maintainer reading the registry sees the canonical-fallback API in the same file.

### Key Components

```typescript
export type CanonicalProvider = 'voyage' | 'openai' | 'hf-local' | 'ollama';

export class EmbedderNotConfiguredError extends Error { /* ... */ }

const CLOUD_CANONICAL: Readonly<Record<'voyage' | 'openai', string>> = Object.freeze({
  voyage: 'voyage-code-3',
  openai: 'text-embedding-3-small',
});

export function getCanonicalFallback(provider: CanonicalProvider): string {
  if (provider === 'voyage' || provider === 'openai') return CLOUD_CANONICAL[provider];
  const first = MANIFESTS[0];
  if (!first) throw new EmbedderNotConfiguredError('MANIFESTS array is empty');
  if (provider === 'ollama') return first.name;            // 'nomic-embed-text-v1.5'
  return `nomic-ai/${first.name}`;                          // 'nomic-ai/nomic-embed-text-v1.5'
}
```

### Data Flow

Each call site changes from a literal string default to a helper call:

```text
Before:  const DEFAULT_MODEL = 'BAAI/bge-base-en-v1.5';   // or 'jina-embeddings-v3'
After:   const DEFAULT_MODEL = getCanonicalFallback('<provider>');
```

Side-effect: `factory.ts:DEFAULT_PROVIDER_MODELS` becomes `Object.freeze({...})` since all 4 providers compute at module load.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

Verify the 5 sites still exist at their expected paths and lines. Confirm `MANIFESTS[0]` is `nomic-embed-text-v1.5` (ADR-013/014).

### Phase 2: Core Implementation

1. Append helper + class + cloud-canonical table to `registry.ts`.
2. Edit 5 call sites (`embeddings.ts`, `hf-local.ts`, `ollama.ts`, `factory.ts`, `sidecar-worker.ts`) — replace literal default + add `getCanonicalFallback` import.

### Phase 3: Verification

1. `npm run typecheck:root` → exit 0.
2. Author `registry.test.ts` with 23 invariant assertions.
3. `node --experimental-vm-modules shared/dist/embeddings/registry.test.js` → 23/23 ok, exit 0.
4. `rg "DEFAULT.*['\"]BAAI/bge-base"` + `rg "DEFAULT.*['\"]jina-embeddings-v3"` → 0 hits.
5. `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <packet> --strict` → PASS.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

### `shared/embeddings/registry.test.ts` (NEW, 23 assertions)

- **Integrity (2)**: MANIFESTS non-empty; listManifests().length === MANIFESTS.length
- **ADR consensus lock (3)**: MANIFESTS[0].name, dim, backend match ADR-013/014
- **Helper contract (4)**: getCanonicalFallback for all 4 providers returns the documented value
- **Regression guard (12)**: 3 banned legacy strings × 4 providers — `getCanonicalFallback(provider)` MUST NOT return any banned string
- **Error class (2)**: EmbedderNotConfiguredError extends Error and has correct `.name`

Test runner: `node --experimental-vm-modules shared/dist/embeddings/registry.test.js` post-tsc. Convention: standalone assertions, no Vitest dependency.

### Typecheck

`npm run typecheck:root` from `.opencode/skills/system-spec-kit/` covers all 3 sub-projects (shared, mcp_server, scripts).
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- ADR-013 (within-Ollama priority, packet 004) — shipped commit `847333a8f`.
- ADR-014 (cascade reorder + hf-local nomic default, packet 015) — shipped.
- Registry MANIFESTS array — must be non-empty and ordered with the operator-preferred canonical model at index 0.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

`git restore` on the 6 modified files. The new `registry.test.ts` and 6 spec docs are purely additive — `git rm` them.

The behavior change is benign: even if rolled back, the resolution chain still works for the 3 priority steps (env → DB → cascade probe). Only the step-4 fallback reverts to the legacy strings, which would re-introduce the drift but not crash the runtime.
<!-- /ANCHOR:rollback -->

<!-- ANCHOR:phase-deps -->
## 8. PHASE DEPENDENCIES

- Phase 2 (refactors) depends on Phase 1 (verify sites + read test convention).
- Phase 3 (verify) depends on Phase 2 completing all 5 site refactors + helper being in place.
- No external phase dependencies (this is a self-contained packet).
<!-- /ANCHOR:phase-deps -->

<!-- ANCHOR:effort -->
## 9. EFFORT ESTIMATE

| Phase | Estimate | Actual |
|---|---|---|
| Phase 1: Setup | 10 min | ~5 min |
| Phase 2: Core Implementation | 15 min | ~10 min |
| Phase 3: Verification | 10 min | ~5 min |
| Total | ~35 min | ~20 min |
<!-- /ANCHOR:effort -->

<!-- ANCHOR:enhanced-rollback -->
## 10. ENHANCED ROLLBACK

If the helper or test introduces a regression in some unforeseen way:

1. `git revert <commit>` on the squashed commit (single commit per `feat(016/002/020): ...` policy).
2. The fallback path returns to its pre-020 hardcoded behavior (still broken for fresh-init but unchanged for active operators).
3. `npm run typecheck:root` to confirm baseline.
4. No DB cleanup or state restore required — the helper is pure and never wrote to disk.
<!-- /ANCHOR:enhanced-rollback -->
