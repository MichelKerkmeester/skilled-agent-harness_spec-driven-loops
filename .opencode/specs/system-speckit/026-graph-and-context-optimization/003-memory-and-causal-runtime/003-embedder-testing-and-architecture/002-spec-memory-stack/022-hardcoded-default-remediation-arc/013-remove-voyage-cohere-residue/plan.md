---
title: "Plan: 022/013 Remove Voyage/Cohere Cloud Rerankers"
description: "Single-pass surgical edits across 8 live files; close the cloud-reranker auto-routing footgun."
trigger_phrases:
  - "022/013 plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/022-hardcoded-default-remediation-arc/013-remove-voyage-cohere-residue"
    last_updated_at: "2026-05-23T21:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "Plan post-execution"
    next_safe_action: "n/a"
    blockers: []
    key_files: ["spec.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000002b17"
      session_id: "016-002-022-013-plan"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: ["Single-pass edits across 8 files; test rewrites complete; one obsolete test file deleted"]
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Plan: 022/013 Remove Voyage/Cohere Cloud Rerankers

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| Surface | TypeScript source (registry, cross-encoder, search-flags, evidence-gap-detector) + Markdown docs (ENV_REFERENCE, feature_catalog) + 2 vitest files |
| Verification | `rg` sweep + `tsc --noEmit` + vitest on the 2 affected test files |
| Risk | LOW — net positive (closes a silent re-routing footgun); no production reranker path lost (`local` sidecar remains) |

### Overview

Surgical removal of two cloud reranker providers (Voyage, Cohere) that were silently auto-activated whenever their API keys appeared in the environment. The local sidecar (`Qwen/Qwen3-Reranker-0.6B`) remains the sole supported reranker, gated explicitly by `SPECKIT_CROSS_ENCODER=true` + `RERANKER_LOCAL=true`.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- Operator confirmed scope: reranker side only, embedder-side Voyage stays
- Live-surface inventory produced (8 live files + 1 deletion)
- Frozen benchmark + changelog + z_archive exclusion list explicit

### Definition of Done

- R1–R5 from spec.md §4 pass
- Strict-validate `--strict` exit 0
- Parent `graph-metadata.json` children_ids includes `013-remove-voyage-cohere-residue`
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

Removal pattern with two compensating updates:
- `RerankerProvider` type union narrowed from `'local' | 'voyage' | 'cohere'` → `'local'`
- `resolveProvider()` no longer maps API-key presence to a provider; only `RERANKER_LOCAL=true` resolves to `'local'`
- `hasAnyCrossEncoderOptInSignal()` no longer treats VOYAGE/COHERE keys as cross-encoder activation; only `SPECKIT_CROSS_ENCODER=true` opts in
- Two-step activation: `SPECKIT_CROSS_ENCODER=true` gates the cross-encoder + `RERANKER_LOCAL=true` resolves to the local sidecar
- Test mocks updated from Voyage's `data: [...]` response shape to local's `results: [...]` shape
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Step 1 — Type + canonical registry (1 file)

`shared/embeddings/registry.ts`: narrow `RerankerProvider` type, drop two `RERANKER_CANONICAL` rows, rewrite the comment.

### Step 2 — Cross-encoder core (1 file)

`mcp_server/lib/search/cross-encoder.ts`: delete `voyage` + `cohere` entries from `PROVIDER_CONFIG`; delete `rerankVoyage()` + `rerankCohere()`; trim `resolveProvider()` to local-only; remove switch case branches; trim exports; update header + circuit-breaker + maxDocuments comments.

### Step 3 — Activation gate (1 file)

`mcp_server/lib/search/search-flags.ts`: remove API-key auto-opt-in from `hasAnyCrossEncoderOptInSignal()`; delete the now-unused `looksLikeValidApiKey()` helper.

### Step 4 — Doc + comment updates (3 files)

`mcp_server/lib/search/evidence-gap-detector.ts` Z_SCORE_THRESHOLD comment, `mcp_server/ENV_REFERENCE.md` §14 RERANKER intro, `feature_catalog/19--feature-flag-reference/05-5-embedding-and-api.md` rows.

### Step 5 — Test rewrites + deletion (3 test files)

`tests/cross-encoder-extended.vitest.ts` (rewrite), `tests/cross-encoder-circuit-breaker.vitest.ts` (rename fixtures), `tests/reranker-eval-comparison.vitest.ts` (DELETE entire file).

### Step 6 — Spec packet + parent metadata

Author 4 Level-1 docs + description.json + graph-metadata.json. Update parent `022-hardcoded-default-remediation-arc/graph-metadata.json` children_ids to 15. Strict-validate exit 0.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

- **R1 sweep**: `rg -i "voyage|cohere|VOYAGE|COHERE" .opencode/ -g '!z_archive/**' -g '!*/scratch/**' -g '!benchmarks/**' -g '!*/specs/**' -g '!changelog/**'` returns only documented removal-narrative comments + Voyage-as-embedder rows
- **R2 typecheck**: `npx tsc --noEmit -p .opencode/skills/system-spec-kit/mcp_server/tsconfig.json` no new errors
- **R3 + R4 vitest**: `npx vitest run tests/cross-encoder-extended.vitest.ts tests/cross-encoder-circuit-breaker.vitest.ts` → 31 of 31 pass
- **R5 manual check**: rewritten describe 5 test asserts `provider === 'none'` + `scoringMethod === 'fallback'` when only `SPECKIT_CROSS_ENCODER=true` is set
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- Sibling 012 (llama-cpp residue) — established the doc-cleanup-packet shape; this packet mirrors it
- 011 Step 4a — filled the now-removed voyage/cohere canonical placeholders
- Original arc 016 phases 003/006/007 — narrowed `BackendKind` for embedders; this packet completes the symmetric narrowing for the reranker type union
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

`git revert <commit-sha>` cleanly reverses all 8 edits + restores the deleted test file. No DB migrations, no env-var defaults to back out. Voyage/Cohere reranker code paths come back wholesale; the auto-activation footgun would also return.
<!-- /ANCHOR:rollback -->

<!-- ANCHOR:phase-deps -->
## 8. PHASE DEPENDENCIES

Depends only on existing arc 016 + arc 022/011 work. No coordination with in-flight work; commits cleanly under the 022 arc parent as the 15th child.
<!-- /ANCHOR:phase-deps -->

<!-- ANCHOR:effort -->
## 9. EFFORT ESTIMATE

| Step | Wall-clock |
|------|------------|
| 1 Type + registry | ~5 min |
| 2 Cross-encoder core | ~20 min |
| 3 Activation gate | ~5 min |
| 4 Doc updates | ~15 min |
| 5 Test rewrites | ~25 min |
| 6 Packet docs + metadata | ~20 min |
| **Total** | **~90 min** |
<!-- /ANCHOR:effort -->

<!-- ANCHOR:enhanced-rollback -->
## 10. ENHANCED ROLLBACK

If a downstream consumer needs cloud reranking after this ships: revert via `git revert <commit-sha>`. The 8 files snap back cleanly; the deleted `reranker-eval-comparison.vitest.ts` is also restored. The reverted code still has the auto-activation footgun, so any rollback should be temporary and followed by a deliberate `RERANKER_PROVIDER=...` env-var design (explicit, not API-key-gated).
<!-- /ANCHOR:enhanced-rollback -->
