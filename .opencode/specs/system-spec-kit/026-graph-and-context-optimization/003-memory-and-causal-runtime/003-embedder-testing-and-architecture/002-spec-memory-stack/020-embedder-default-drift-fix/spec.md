---
title: "Spec: 016/002/020 Embedder Default Drift Fix — getCanonicalFallback() registry-derived helper eliminates 5 hardcoded defaults"
description: "ADR-013/014 migrated the canonical spec-memory embedder to nomic-ai/nomic-embed-text-v1.5 but 5 hardcoded TS defaults survived (4 BAAI + 1 jina). When the resolution chain fell through to those stale strings the runtime loaded a model not in the registry — triggering circuit-breaker flapping, 1978 failed records, 786 null-embedding errors, 754 stuck pending. This packet adds getCanonicalFallback(provider) in registry.ts as the single source of truth, refactors all 5 sites, and locks the contract with 23 invariant assertions in registry.test.ts."
trigger_phrases:
  - "embedder default drift fix"
  - "getCanonicalFallback helper"
  - "embedder hardcoded default removal"
  - "registry-derived embedder fallback"
  - "016/002/020 default drift"
  - "ADR-013 ADR-014 implementation cleanup"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/002-spec-memory-stack/020-embedder-default-drift-fix"
    last_updated_at: "2026-05-23T11:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "Shipped getCanonicalFallback helper + 5 refactors + 23-assertion invariant test"
    next_safe_action: "MCP daemon restart in parent execution context"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/shared/embeddings/registry.ts"
      - ".opencode/skills/system-spec-kit/shared/embeddings/registry.test.ts"
      - ".opencode/skills/system-spec-kit/shared/embeddings.ts"
      - ".opencode/skills/system-spec-kit/shared/embeddings/factory.ts"
      - ".opencode/skills/system-spec-kit/shared/embeddings/providers/hf-local.ts"
      - ".opencode/skills/system-spec-kit/shared/embeddings/providers/ollama.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-worker.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000002020"
      session_id: "016-002-020"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Where do the hardcoded defaults live? 5 sites (4 BAAI + 1 jina) across shared/embeddings/* and mcp_server/lib/embedders/*"
      - "Architecture shape? Shape C from explore — registry-derived helper, NOT throw-on-unconfigured"
      - "Cloud providers in registry? No — frozen CLOUD_CANONICAL table inside registry.ts (cloud has no local registry array)"
      - "Test convention? Standalone assertions (no Vitest) matching shared/predicates/boolean-expr.test.ts"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Spec: 016/002/020 Embedder Default Drift Fix — getCanonicalFallback() registry-derived helper

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|---|---|
| Status | Complete (shipped 2026-05-23) |
| Type | Code refactor + invariant test + ADR (Shape C) |
| Owner | Main agent |
| Parent | `../spec.md` (002-spec-memory-stack) |
| Predecessor | 015-cascade-reorder-and-nomic-hf-local-default (ADR-014 — shipped 1 of 6 hardcoded defaults; 020 closes the remaining 5) |
| Supersedes | None |
| Triggered by | 2026-05-23 production incident: circuit-breaker flapping, 4251 failed records |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

ADR-013 (operator override) and ADR-014 (cascade reorder + nomic hf-local default) migrated the canonical embedder to `nomic-ai/nomic-embed-text-v1.5` via the registry MANIFESTS + `vec_metadata.active_embedder_name`. In practice 5 hardcoded string constants survived ADR-013/014 and continued to point at pre-ADR models:

| File | Line | Stale value | Class |
|---|---|---|---|
| `shared/embeddings.ts` | 873 | `'BAAI/bge-base-en-v1.5'` | Pre-ADR-014 (stale) |
| `shared/embeddings/providers/hf-local.ts` | 13 | `'BAAI/bge-base-en-v1.5'` | Pre-ADR-014 (stale) |
| `shared/embeddings/providers/ollama.ts` | 14 | `'jina-embeddings-v3'` | Pre-ADR-013 (stale — bake-off winner that operator overrode) |
| `shared/embeddings/factory.ts` | 143–148 | 4 inline strings | Pre-ADR-014 (stale) |
| `mcp_server/lib/embedders/sidecar-worker.ts` | 68 | `'BAAI/bge-base-en-v1.5'` | Pre-ADR-014 (stale) |

When the resolution chain fell through to step 4 (the hardcoded fallback), the runtime instantiated a model that the registry didn't recognize. The hf-local adapter would fail to load, the circuit breaker would trip, and the cascade would not recover because the "next" provider's hardcoded fallback was equally stale. The 2026-05-23 incident exposed this: 1978 records marked failed, 786 returned `Embedding generation returned null`, 754 stuck pending, causal-graph coverage 10.98% (target 60%).

Purpose: eliminate the entire class of "hardcoded default drift" by making the registry the single source of truth. Adding a new winner to MANIFESTS[0] auto-updates every fallback site; the test suite catches any caller that returns a banned legacy string.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

In scope:
- **Helper**: new `getCanonicalFallback(provider)` + `EmbedderNotConfiguredError` + `CLOUD_CANONICAL` in `shared/embeddings/registry.ts`.
- **5 hardcoded-default refactors**: 4 BAAI sites + 1 jina site replaced with `getCanonicalFallback(provider)` calls.
- **Invariant test**: new `shared/embeddings/registry.test.ts` (23 assertions; standalone convention matching `shared/predicates/boolean-expr.test.ts`).
- **Typecheck + test runner verification**: `npm run typecheck:root` exit 0; `node --experimental-vm-modules shared/dist/embeddings/registry.test.js` 23/23 ok.
- **ADR-001/002/003** in this packet's decision-record.md (Shape C choice, cloud-canonical exclusion from MANIFESTS, standalone-assertion test convention).

Out of scope:
- Re-implementing the embedder provider abstraction (preserves ADR-013/014 design).
- Adding cloud providers (`voyage`, `openai`) to MANIFESTS array (different operational semantics).
- Restarting the spec-memory MCP daemon (handled in sibling `116-deep-skill-evolution` execution context).
- Changing the `embedder_set` MCP tool semantics.
- Auditing other repo subsystems for similar hardcoded-default drift (deferred to follow-on deep-research packet).
- Touching CocoIndex's embedder defaults (different code path; healthy).
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| # | Requirement |
|---|---|
| R1 | `getCanonicalFallback(provider: CanonicalProvider): string` exported from `shared/embeddings/registry.ts`. |
| R2 | Local providers (`ollama`, `hf-local`) derive their fallback from `MANIFESTS[0].name`. Cloud providers (`voyage`, `openai`) return strings from a frozen `CLOUD_CANONICAL` table. |
| R3 | `EmbedderNotConfiguredError` exported; thrown if MANIFESTS is empty. |
| R4 | All 5 hardcoded-default sites refactored to call `getCanonicalFallback(provider)`. |
| R5 | `npm run typecheck:root` exit code = 0 after refactor. |
| R6 | New `shared/embeddings/registry.test.ts` with 23 invariant assertions including ADR consensus lock + regression guard against 3 banned legacy strings. |
| R7 | `node --experimental-vm-modules shared/dist/embeddings/registry.test.js` reports 23/23 ok, exit 0. |
| R8 | `rg "DEFAULT.*['\"]BAAI/bge-base"` in `.opencode/skills/system-spec-kit/` returns 0 hits. |
| R9 | `rg "DEFAULT.*['\"]jina-embeddings-v3"` in `.opencode/skills/system-spec-kit/` returns 0 hits. |
| R10 | Strict-validate PASS on this packet. |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- All R1–R10 satisfied.
- Future drift is structurally impossible: re-ordering `MANIFESTS` auto-updates every fallback site; the regression-guard assertions block any caller from returning a banned legacy string.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:approach -->
## 6. APPROACH

Phase 1 — helper authoring (~10 min):
1. Append `getCanonicalFallback` + `EmbedderNotConfiguredError` + `CLOUD_CANONICAL` to `shared/embeddings/registry.ts` after the existing `MANIFESTS` export.

Phase 2 — 5 site refactors (~15 min):
1. `embeddings.ts:873` → `getCanonicalFallback('hf-local')` + import.
2. `hf-local.ts:13` → `getCanonicalFallback('hf-local')` + import.
3. `ollama.ts:14` → `getCanonicalFallback('ollama')` + import (CATCHES `jina-embeddings-v3` BUG).
4. `factory.ts:143-148` → all 4 providers derived from `getCanonicalFallback(...)` + `Object.freeze({...})` + import.
5. `sidecar-worker.ts:68` → `getCanonicalFallback('hf-local')` + import (via `@spec-kit/shared/embeddings/registry`).

Phase 3 — test + verify (~10 min):
1. Author `shared/embeddings/registry.test.ts` with 23 invariant assertions.
2. `npm run typecheck:root` exit 0.
3. `node --experimental-vm-modules shared/dist/embeddings/registry.test.js` 23/23 ok.
4. `rg DEFAULT...BAAI/bge-base` repo-wide → 0 hits.
5. `rg DEFAULT...jina-embeddings-v3` repo-wide → 0 hits.
<!-- /ANCHOR:approach -->

<!-- ANCHOR:risks -->
## 7. RISKS & DEPENDENCIES

Risks:
- **Behavior change**: when step 4 of the resolution chain fires (rare; init-only), the returned model now matches ADR consensus rather than the legacy string. This is the intended fix. No production caller should observe a regression because the previous "BAAI" path was already broken.
- **MANIFESTS array reorder**: any future re-ordering of `MANIFESTS` will silently change `getCanonicalFallback('ollama')` and `('hf-local')`. The invariant test locks the FIRST entry to `nomic-embed-text-v1.5` per ADR-013/014 — re-ordering MUST update the test to match the new operator decision.

Dependencies:
- ADR-013 (within-Ollama priority, packet 004) — shipped.
- ADR-014 (cascade reorder + hf-local nomic default, packet 015) — shipped.
- Registry MANIFESTS array as the canonical source.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 8. OPEN QUESTIONS

All answered during execution (see frontmatter `answered_questions`). Follow-on questions (out of scope, deferred to deep-research packet):

- Are there OTHER stale hardcoded defaults elsewhere in the repo (CocoIndex, skill-advisor, code-graph, rerank-sidecar) following the same anti-pattern?
- Do READMEs / INSTALL_GUIDE / doctor commands document outdated embedder defaults?
- Do other resolution chains have the same "env → DB → hardcoded fallback" structure where step 4 should be unreachable?
<!-- /ANCHOR:questions -->

<!-- ANCHOR:nfr -->
## 9. NON-FUNCTIONAL REQUIREMENTS

- **Performance**: `getCanonicalFallback()` is a synchronous pure function over compile-time constants. O(1). No runtime cost.
- **Reliability**: Throws `EmbedderNotConfiguredError` if MANIFESTS is empty (programmer error; should never fire in production).
- **Maintainability**: Single source of truth. Adding a new winner to MANIFESTS[0] auto-updates every fallback site.
- **Observability**: Existing call-site warning patterns (e.g. `sidecar-worker.ts:getModelName`) continue to fire when the fallback is reached.
<!-- /ANCHOR:nfr -->

<!-- ANCHOR:edge-cases -->
## 10. EDGE CASES

- **MANIFESTS empty**: `getCanonicalFallback('ollama' | 'hf-local')` throws `EmbedderNotConfiguredError`. Test coverage: CHK-008 + assertions in `registry.test.ts`.
- **Unknown provider**: TypeScript prevents this at compile time via the `CanonicalProvider` union type.
- **MANIFESTS[0] not in HuggingFace org**: `getCanonicalFallback('hf-local')` returns `nomic-ai/<name>`. If a future MANIFESTS[0] uses a different HF org, the hf-local branch logic needs updating (currently hardcoded to `nomic-ai/...` prefix). Acceptable trade-off: only one HF prefix in current registry.
- **Caller bypasses helper**: a future refactor could re-introduce a hardcode. The regression-guard test (12 assertions × 4 providers × 3 banned strings) catches this at test-time.
<!-- /ANCHOR:edge-cases -->

<!-- ANCHOR:complexity -->
## 11. COMPLEXITY

| Dimension | Score | Justification |
|---|---|---|
| LOC changed | ~50 | helper + 5 single-line refactors + 23-assertion test |
| Files touched | 6 modified + 1 new test | bounded surface |
| Behavior risk | Low | only step-4 fallback path changes; active code paths unchanged |
| Architectural risk | Low | preserves existing resolution chain shape; replaces inline literals with registry-derived getter |
| Total complexity | **Low** | Mechanical refactor with strong type + test coverage |
<!-- /ANCHOR:complexity -->

<!-- ANCHOR:cross-links -->
## 12. CROSS-LINKS

- **Predecessor**: `../015-cascade-reorder-and-nomic-hf-local-default/` (ADR-014, 1 of 6 shipped)
- **Bake-off origin**: `../004-spec-memory-embedder-bake-off/` (ADR-001..ADR-013)
- **Helper file**: `.opencode/skills/system-spec-kit/shared/embeddings/registry.ts`
- **Invariant test**: `.opencode/skills/system-spec-kit/shared/embeddings/registry.test.ts`
- **Refactored sites**: 5 files listed in `_memory.continuity.key_files`
- **Sibling-arc context**: `skilled-agent-orchestration/116-deep-skill-evolution/` (the open-advisories work that unblocked this fix)
<!-- /ANCHOR:cross-links -->
