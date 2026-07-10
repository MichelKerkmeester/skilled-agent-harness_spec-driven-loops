---
title: "Spec: 022/013 Remove Voyage/Cohere Cloud Rerankers"
description: "Operator directive: remove voyage/cohere as reranker providers. Their auto-resolution from API-key presence (VOYAGE_API_KEY / COHERE_API_KEY) created a silent re-routing footgun — setting those keys for embedding purposes would also activate cloud reranking. The only supported reranker is now the local sidecar (Qwen3-Reranker-0.6B)."
trigger_phrases:
  - "022/013 remove voyage cohere"
  - "remove voyage cohere reranker"
  - "cloud reranker footgun removal"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/022-hardcoded-default-remediation-arc/013-remove-voyage-cohere-residue"
    last_updated_at: "2026-05-23T21:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "Removed voyage + cohere reranker providers"
    next_safe_action: "Strict validate + commit"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/shared/embeddings/registry.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/cross-encoder.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/search-flags.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/evidence-gap-detector.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md"
      - ".opencode/skills/system-spec-kit/feature_catalog/19--feature-flag-reference/05-5-embedding-and-api.md"
      - ".opencode/skills/system-spec-kit/mcp_server/tests/cross-encoder-extended.vitest.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/tests/cross-encoder-circuit-breaker.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000002b16"
      session_id: "016-002-022-013"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Voyage stays as an EMBEDDINGS provider (separate surface, explicit opt-in via EMBEDDINGS_PROVIDER); only the reranker side is removed"
      - "Cohere is not used by spec-kit embeddings at all (cocoindex has its own separate cohere/embed-v4.0 path); removal here doesn't affect cocoindex"
      - "Frozen benchmark artifacts under benchmarks/* are preserved per sk-doc convention"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Spec: 022/013 Remove Voyage/Cohere Cloud Rerankers

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|---|---|
| Phase | 013 |
| Title | Remove Voyage/Cohere Cloud Rerankers (auto-routing footgun) |
| Level | 1 |
| Parent | 022-hardcoded-default-remediation-arc |
| Predecessor | 022/012 (llama-cpp residue removal); 022/011 (Step 4a filled voyage/cohere placeholders which are now removed entirely) |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

Two separate gates in the cross-encoder pipeline activated cloud reranking whenever `VOYAGE_API_KEY` or `COHERE_API_KEY` was present in the environment:

- `search-flags.ts:hasAnyCrossEncoderOptInSignal()` enabled the cross-encoder gate on either key.
- `cross-encoder.ts:resolveProvider()` then auto-routed to `voyage` (preferred) or `cohere` (fallback) when either key was present.

Voyage and Cohere also sell embeddings under the same API keys. An operator setting `VOYAGE_API_KEY` to use Voyage as their *embeddings* provider would unintentionally also activate Voyage *reranking* — every query would round-trip to `api.voyageai.com/v1/rerank` whether they wanted that or not. The local sidecar (`Qwen/Qwen3-Reranker-0.6B`) is the production reranker; the cloud paths were dormant footguns.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope (shipped this packet)

8 live files, ~340 LOC net removal:

- `shared/embeddings/registry.ts` — `RerankerProvider` type union narrowed to `'local'`; `RERANKER_CANONICAL` rows for `voyage` + `cohere` dropped; comment block rewritten
- `mcp_server/lib/search/cross-encoder.ts` — `PROVIDER_CONFIG` reduced to local-only; `rerankVoyage()` + `rerankCohere()` functions deleted (~90 LOC); `resolveProvider()` no longer auto-routes on API keys; switch case branches removed; barrel exports trimmed; header + circuit-breaker + maxDocuments comments updated
- `mcp_server/lib/search/search-flags.ts` — `hasAnyCrossEncoderOptInSignal()` no longer treats VOYAGE/COHERE keys as activation signals; `looksLikeValidApiKey()` helper deleted (no remaining callers)
- `mcp_server/lib/search/evidence-gap-detector.ts` — comment about "long-term fix" updated to reference only `RERANKER_LOCAL=true`
- `mcp_server/ENV_REFERENCE.md` — §14 RERANKER intro rewritten with removal-narrative
- `feature_catalog/19--feature-flag-reference/05-5-embedding-and-api.md` — `COHERE_API_KEY` row deleted; `VOYAGE_API_KEY` row scoped to embeddings only; `RERANKER_LOCAL` description updated
- `mcp_server/tests/cross-encoder-extended.vitest.ts` — describes 2 (`rerankVoyage`), 3 (`rerankCohere`), 8 (provider priority) deleted; describe 5 routes test rewritten to use `SPECKIT_CROSS_ENCODER=true + RERANKER_LOCAL=true`; describes 6 + 7 cache/latency mocks updated to local response shape (`results:` not `data:`)
- `mcp_server/tests/cross-encoder-circuit-breaker.vitest.ts` — provider fixture strings `'voyage'`/`'cohere'` → `'local'`; "different providers have independent circuit states" test removed (no multi-provider isolation left)

Also deleted: `mcp_server/tests/reranker-eval-comparison.vitest.ts` (entire file was a Voyage/Cohere comparison skeleton; nothing left to compare).

### Out of Scope (intentionally preserved)

- **Voyage as an EMBEDDINGS provider** — separate surface (`shared/embeddings/factory.ts`), explicit opt-in via `EMBEDDINGS_PROVIDER=voyage`, no auto-activation. Stays.
- **Cohere as a cocoindex EMBEDDINGS provider** — `mcp-coco-index/references/settings_reference.md` lists `cohere/embed-v4.0` via litellm. Separate skill surface; out of scope here.
- Frozen benchmark artifacts under `benchmarks/*` — historical records per sk-doc benchmark template convention.
- z_archive specs, scratch dirs, iteration markdowns, and historical changelogs — all retain their voyage/cohere references as historical record.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Verification |
|----|-------------|--------------|
| R1 | Zero live `voyage`/`cohere`/`VOYAGE`/`COHERE` references in reranker context (excluding intentional removal-narrative comments + the embedder-side `voyage` retention) | `rg` sweep limited to non-archived, non-benchmark, non-changelog paths returns only the documented removal-narrative lines + Voyage-as-embedder rows |
| R2 | TypeScript compiles cleanly on the changed `.ts` files | `npx tsc --noEmit` exits 0 (modulo pre-existing baseUrl deprecation warning) |
| R3 | `cross-encoder-extended.vitest.ts` passes after rewrite | 23 of 23 tests pass |
| R4 | `cross-encoder-circuit-breaker.vitest.ts` passes after fixture rename | 8 of 8 tests pass |
| R5 | Setting `VOYAGE_API_KEY` alone (no `SPECKIT_CROSS_ENCODER=true`, no `RERANKER_LOCAL=true`) no longer activates any reranker — `provider === 'none'`, `scoringMethod === 'fallback'` | Covered by the rewritten describe 5 test |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

R1–R5 pass. Strict-validate exit 0 on this packet. The auto-routing footgun is closed: cloud rerankers can no longer be activated by API-key presence alone; reranking requires explicit opt-in via `SPECKIT_CROSS_ENCODER=true` AND `RERANKER_LOCAL=true`.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:approach -->
## 6. APPROACH

Single-pass main-agent direct edits. No CLI executor dispatch. Verification via `rg` sweep + `tsc --noEmit` + vitest on the two affected test files.
<!-- /ANCHOR:approach -->

<!-- ANCHOR:risks -->
## 7. RISKS & DEPENDENCIES

| Risk | Mitigation |
|------|------------|
| Operator was depending on Voyage/Cohere reranking via API key | Mitigated: per operator directive this auto-activation was the bug. If a cloud reranker is needed in the future, it should be wired via an explicit `RERANKER_PROVIDER=...` env var, not auto-resolved from embedding keys. |
| Activation now requires BOTH `SPECKIT_CROSS_ENCODER=true` AND `RERANKER_LOCAL=true` — clunkier UX | Documented in ENV_REFERENCE.md §14. The dual-opt-in is the conservative-defaults posture (no accidental activation). |
| Tests rewritten — possible test-coverage gap | Net coverage retained: 23 + 8 = 31 tests pass post-rewrite; the deleted tests covered cloud HTTP paths that no longer exist. |
| `reranker-eval-comparison.vitest.ts` deletion loses 3 always-passing tests (corpus + MRR + protocol doc) | Acceptable: the file was a comparison skeleton, and the underlying MRR computation has its own dedicated tests in `lib/eval/eval-metrics`. |
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 8. OPEN QUESTIONS

- Should the `Z_SCORE_THRESHOLD` in `evidence-gap-detector.ts` be revisited now that the cloud reranker path is gone? (The current 1.3 threshold reflects the "no real reranker available" floor — with `RERANKER_LOCAL=true` always available, the threshold could potentially rise back to 1.5. Out of scope for this packet.)
- Should `feature_catalog/19--feature-flag-reference/05-5-embedding-and-api.md` also drop the `EMBEDDING_DIM` row's mention of "Voyage 1024" since Voyage embeddings ARE still supported? (Decision: keep — Voyage embeddings stay.)
<!-- /ANCHOR:questions -->

<!-- ANCHOR:cross-links -->
## 9. CROSS-LINKS

- Parent arc: `../spec.md`
- Sibling: `012-remove-llama-cpp-residue` (same shape; immediate predecessor)
- Predecessor: `011-arc-022-followons` (Step 4a filled voyage/cohere RERANKER_CANONICAL placeholders that this packet removes entirely)
- Original cloud-reranker decision: `mcp_server/lib/search/cross-encoder.ts` T204/OQ-02 (2026-02-10) — reversed by this packet
<!-- /ANCHOR:cross-links -->

<!-- ANCHOR:nfr -->
## 10. NON-FUNCTIONAL REQUIREMENTS

- Net behavior change is the CLOSURE of an unintended re-routing footgun (positive change)
- 31 tests pass post-rewrite (no regression)
- TypeScript exit 0
- Code surface ~340 LOC smaller (cleaner, less attack surface)
<!-- /ANCHOR:nfr -->

<!-- ANCHOR:edge-cases -->
## 11. EDGE CASES

- Operator has `VOYAGE_API_KEY` set for embeddings only → reranker stays OFF (positive change vs. before).
- Operator has BOTH `VOYAGE_API_KEY` AND wants reranking → must now also set `SPECKIT_CROSS_ENCODER=true` AND `RERANKER_LOCAL=true`. Routes to local sidecar.
- Operator has only `SPECKIT_CROSS_ENCODER=true` set, no `RERANKER_LOCAL` → cross-encoder gate enabled but `resolveProvider()` returns null → fallback scoring with `scoringMethod='fallback'`.
- Pre-existing circuit-breaker state with provider name `voyage` or `cohere` in memory (post-restart, before deploy) → no impact; the Map is in-process state, cleared on restart.
<!-- /ANCHOR:edge-cases -->

<!-- ANCHOR:complexity -->
## 12. COMPLEXITY

LEVEL 1 code + doc + test cleanup. ~340 LOC net removed across 8 live files (plus 1 obsolete test file deleted). Zero behavior change for the now-supported path; positive change for the previously-silent-routing-to-cloud path.
<!-- /ANCHOR:complexity -->
