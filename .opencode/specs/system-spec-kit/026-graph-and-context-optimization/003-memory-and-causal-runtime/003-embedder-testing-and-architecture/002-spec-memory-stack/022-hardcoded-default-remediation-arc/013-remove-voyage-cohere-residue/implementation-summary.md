---
title: "Implementation Summary: 022/013 Remove Voyage/Cohere Cloud Rerankers"
description: "Closed the cloud-reranker auto-routing footgun. 8 files modified + 1 test file deleted; 31/31 tests pass; ~340 net LOC removed."
trigger_phrases:
  - "022/013 summary"
  - "voyage cohere removal complete"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/002-spec-memory-stack/022-hardcoded-default-remediation-arc/013-remove-voyage-cohere-residue"
    last_updated_at: "2026-05-23T21:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "Shipped — 8 files modified, 1 deleted, R1-R5 PASS"
    next_safe_action: "Commit + parent metadata update"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000002b19"
      session_id: "016-002-022-013-summary"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "R1-R5 all pass; auto-routing footgun closed; 31/31 tests pass post-rewrite"
---
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Implementation Summary: 022/013 Remove Voyage/Cohere Cloud Rerankers

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|------|-------|
| Status | Complete |
| Shipped | 2026-05-23 |
| Files changed | 8 modified + 1 deleted |
| Net LOC | ~−340 (cleaner surface) |
| Tests | 31/31 pass post-rewrite (23 cross-encoder-extended + 8 circuit-breaker) |
| Wall-clock | ~90 min |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:what-built -->
## 2. WHAT WAS BUILT

### Code (4 files)

- `shared/embeddings/registry.ts` — `RerankerProvider` type narrowed `'local' | 'voyage' | 'cohere'` → `'local'`; `RERANKER_CANONICAL` voyage/cohere rows removed; comment rewritten to document the 022/013 removal rationale.
- `mcp_server/lib/search/cross-encoder.ts` — Deleted `PROVIDER_CONFIG.voyage` + `.cohere` entries (~16 LOC), `rerankVoyage()` (~40 LOC), `rerankCohere()` (~40 LOC), case branches in `rerankResults()` switch (~6 LOC), barrel exports for those functions. Updated `resolveProvider()` to no longer auto-route on API-key presence (only `RERANKER_LOCAL=true` resolves to `'local'`). Header comment + circuit-breaker comment + `maxDocuments` comment updated to drop voyage/cohere narrative.
- `mcp_server/lib/search/search-flags.ts` — `hasAnyCrossEncoderOptInSignal()` no longer auto-enables on `VOYAGE_API_KEY` or `COHERE_API_KEY` presence; only `SPECKIT_CROSS_ENCODER=true` opts in. The now-unused `looksLikeValidApiKey()` helper deleted.
- `mcp_server/lib/search/evidence-gap-detector.ts` — Z_SCORE_THRESHOLD comment updated to reference only `RERANKER_LOCAL=true` as the activation path.

### Docs (2 files)

- `mcp_server/ENV_REFERENCE.md` §14 RERANKER — intro paragraph rewritten with removal narrative + activation instructions.
- `feature_catalog/19--feature-flag-reference/05-5-embedding-and-api.md` — `COHERE_API_KEY` row deleted; `VOYAGE_API_KEY` row scoped to embeddings only with note that reranker support was removed in 022/013; `RERANKER_LOCAL` description updated to reflect it is now the only activation path.

### Tests (2 modified + 1 deleted)

- `tests/cross-encoder-extended.vitest.ts` — describes 2 (`rerankVoyage`), 3 (`rerankCohere`), 8 (provider priority) deleted entirely. Describe 5 routes test rewritten to use `SPECKIT_CROSS_ENCODER=true + RERANKER_LOCAL=true` instead of `VOYAGE_API_KEY`; "routes to Cohere" test removed; "does not route from RERANKER_LOCAL alone" test rewritten as "returns fallback when SPECKIT_CROSS_ENCODER set but RERANKER_LOCAL not set". Cache + latency mocks updated from Voyage's `data: [...]` response shape to local's `results: [...]` shape.
- `tests/cross-encoder-circuit-breaker.vitest.ts` — All `'voyage'` and `'cohere'` fixture strings replaced with `'local'`. The "different providers have independent circuit states" test removed entirely (multi-provider isolation is no longer a meaningful contract — there's only one provider).
- `tests/reranker-eval-comparison.vitest.ts` — DELETED. The entire file was a Voyage/Cohere reranker quality comparison skeleton (3 always-passing tests + 2 mock-backed remote-provider eval tests). With the providers gone, the comparison is meaningless. The underlying MRR computation has its own dedicated tests in `lib/eval/eval-metrics`.

### Out-of-scope hits preserved

- 4 hits in `benchmarks/benchmark-2026-05-20/` and other dated benchmark folders — frozen historical artifacts per sk-doc benchmark template convention.
- `changelog/v1.2.0.0.md` + `changelog/v3.4.0.0.md` — historical release notes that legitimately describe past Voyage/Cohere support.
- z_archive specs, scratch markdowns, iteration files — all retain their references as historical record.
- `mcp-coco-index/SKILL.md` keywords list mention of `voyage-code-3` — that's the EMBEDDING model name in cocoindex's separate provider registry; out of scope.
- `mcp-coco-index/references/settings_reference.md` rows for Cohere embeddings via litellm — separate skill surface; out of scope.
<!-- /ANCHOR:what-built -->

<!-- ANCHOR:how-delivered -->
## 3. HOW IT WAS DELIVERED

~90 min total wall-clock. Single-pass main-agent direct edits via the Edit tool, batched per file. No CLI executor dispatch.

1. **Live-surface inventory** via `rg` with explicit exclusions, then filtered to reranker-related hits.
2. **Code edits first** (smallest blast radius): registry → cross-encoder → search-flags → evidence-gap-detector.
3. **Test rewrites second** — the cross-encoder-extended file required surgical describe-block deletion + mass `process.env.VOYAGE_API_KEY = '...'` → `SPECKIT_CROSS_ENCODER='true' + RERANKER_LOCAL='true'` replacement + mock response shape switch.
4. **Doc edits third**: ENV_REFERENCE and feature_catalog rows.
5. **Iterative verification**: ran tests after each major edit, found one test still using the old response shape and one circuit-breaker test broken by the multi-provider collapse — fixed both.
6. **Spec packet authored** after all edits + tests pass.
<!-- /ANCHOR:how-delivered -->

<!-- ANCHOR:decisions -->
## 4. KEY DECISIONS

- **Reranker-only scope.** Voyage stays as an EMBEDDINGS provider (separate surface, explicit `EMBEDDINGS_PROVIDER=voyage` opt-in, no auto-activation). The footgun was specifically the reranker side because of the dual-gate auto-activation in `search-flags.ts` + `cross-encoder.ts`.
- **Two-step activation kept.** Post-013 the cross-encoder still requires BOTH `SPECKIT_CROSS_ENCODER=true` + `RERANKER_LOCAL=true`. Could have been simplified to a single flag, but that's a behavior change beyond the scope of this packet.
- **`reranker-eval-comparison.vitest.ts` deleted entirely.** Could have kept the 3 always-passing tests (corpus + MRR + protocol-doc), but they all referenced the removed providers and a comparison contract that no longer exists. The underlying MRR helper has its own dedicated tests.
- **Circuit-breaker provider-name strings updated to `'local'`.** The Map<string, CircuitState> doesn't care about the key value, but documenting test fixtures with the removed provider names was misleading.
- **`looksLikeValidApiKey()` helper deleted.** No remaining callers post-removal; TS noUnusedLocals would have flagged it.
<!-- /ANCHOR:decisions -->

<!-- ANCHOR:verification -->
## 5. VERIFICATION

| Requirement | Check | Result |
|-------------|-------|--------|
| R1 | `rg -i "voyage|cohere|VOYAGE|COHERE" .opencode/ -g '!z_archive/**' -g '!*/scratch/**' -g '!benchmarks/**' -g '!*/specs/**' -g '!changelog/**'` | Only intentional hits remain (removal-narrative comments + Voyage-as-embedder rows + cocoindex's separate cohere/embed-v4.0 entry) — PASS |
| R2 | `npx tsc --noEmit -p .opencode/skills/system-spec-kit/mcp_server/tsconfig.json` | No new errors; only pre-existing `TS5101 baseUrl deprecation` warning — PASS |
| R3 | `npx vitest run tests/cross-encoder-extended.vitest.ts` | 23/23 pass — PASS |
| R4 | `npx vitest run tests/cross-encoder-circuit-breaker.vitest.ts` | 8/8 pass — PASS |
| R5 | Manual test review | Rewritten describe 5 test confirms `SPECKIT_CROSS_ENCODER=true` alone (no `RERANKER_LOCAL`) yields `provider === 'none'`, `scoringMethod === 'fallback'` — PASS |
<!-- /ANCHOR:verification -->

<!-- ANCHOR:limitations -->
## 6. KNOWN LIMITATIONS

- **Activation now requires two env vars.** `SPECKIT_CROSS_ENCODER=true` AND `RERANKER_LOCAL=true`. Future cleanup could collapse these into a single flag, but that's behavior change outside this packet's scope.
- **Voyage embedding API key alone no longer activates ANY reranker.** Previously it silently activated cloud reranking; now it silently activates nothing. If operators expect reranking when only `VOYAGE_API_KEY` is set, they need to add `SPECKIT_CROSS_ENCODER=true` + `RERANKER_LOCAL=true` to their env.
- **Z_SCORE_THRESHOLD in evidence-gap-detector.ts still at 1.3** — that floor was set for the "no real reranker available" configuration. With the local sidecar always available via `RERANKER_LOCAL=true`, the threshold could rise back to 1.5. Out of scope; flagged as an open question.
- **No re-introduction path for cloud rerankers.** If a future need arises, the right pattern is an explicit `RERANKER_PROVIDER=voyage|cohere|local` env var, not API-key-gated auto-resolution. Document this in the next packet if it comes up.

### Commit Handoff

```
fix(022/013): remove voyage/cohere cloud rerankers — close auto-routing footgun

Operator directive: voyage/cohere cloud reranker support is a silent
re-routing footgun. Setting VOYAGE_API_KEY or COHERE_API_KEY for any
purpose (especially embeddings, since Voyage sells both) would
auto-activate the corresponding cloud reranker. Every query would
round-trip to api.voyageai.com/v1/rerank or api.cohere.ai/v1/rerank
whether the operator wanted that or not.

This packet removes both providers entirely from the reranker surface:

Code (4 files):
- shared/embeddings/registry.ts: RerankerProvider type narrowed to 'local';
  RERANKER_CANONICAL rows for voyage/cohere deleted.
- mcp_server/lib/search/cross-encoder.ts: PROVIDER_CONFIG entries +
  rerankVoyage() + rerankCohere() + switch case branches deleted.
  resolveProvider() no longer auto-routes on API-key presence.
- mcp_server/lib/search/search-flags.ts: hasAnyCrossEncoderOptInSignal()
  no longer treats VOYAGE/COHERE keys as opt-in signals; only
  SPECKIT_CROSS_ENCODER=true opts in.
- mcp_server/lib/search/evidence-gap-detector.ts: Z_SCORE_THRESHOLD
  comment updated.

Docs (2 files):
- ENV_REFERENCE.md §14 RERANKER intro rewritten.
- feature_catalog/19--feature-flag-reference/05-5-embedding-and-api.md:
  COHERE_API_KEY row deleted; VOYAGE_API_KEY row scoped to embeddings
  only.

Tests (2 modified + 1 deleted):
- tests/cross-encoder-extended.vitest.ts: voyage/cohere describes
  removed; routes test rewritten to use SPECKIT_CROSS_ENCODER=true +
  RERANKER_LOCAL=true; mock response shapes updated.
- tests/cross-encoder-circuit-breaker.vitest.ts: 'voyage'/'cohere'
  fixture strings → 'local'; multi-provider isolation test removed.
- tests/reranker-eval-comparison.vitest.ts: DELETED (Voyage/Cohere
  comparison skeleton no longer applicable).

Verification: rg sweep limited to live paths returns only the
documented removal-narrative + Voyage-as-embedder rows; tsc --noEmit
clean; 23 + 8 = 31 tests pass post-rewrite.

Out of scope (preserved): Voyage as EMBEDDING provider stays;
cocoindex's cohere/embed-v4.0 embedding path stays; frozen benchmarks
and changelogs and z_archive specs retain their voyage/cohere
references as historical record.

Activation post-013: SPECKIT_CROSS_ENCODER=true AND RERANKER_LOCAL=true
(both required) → cross-encoder enabled, routes to local sidecar at
http://localhost:8765/rerank (Qwen/Qwen3-Reranker-0.6B). Any other
env-var combination → no reranking.
```

Explicit paths:

```
.opencode/skills/system-spec-kit/shared/embeddings/registry.ts
.opencode/skills/system-spec-kit/mcp_server/lib/search/cross-encoder.ts
.opencode/skills/system-spec-kit/mcp_server/lib/search/search-flags.ts
.opencode/skills/system-spec-kit/mcp_server/lib/search/evidence-gap-detector.ts
.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md
.opencode/skills/system-spec-kit/feature_catalog/19--feature-flag-reference/05-5-embedding-and-api.md
.opencode/skills/system-spec-kit/mcp_server/tests/cross-encoder-extended.vitest.ts
.opencode/skills/system-spec-kit/mcp_server/tests/cross-encoder-circuit-breaker.vitest.ts
.opencode/skills/system-spec-kit/mcp_server/tests/reranker-eval-comparison.vitest.ts  (DELETED)
.opencode/specs/.../022-hardcoded-default-remediation-arc/013-remove-voyage-cohere-residue/  (NEW packet)
.opencode/specs/.../022-hardcoded-default-remediation-arc/graph-metadata.json  (children_ids updated to 15)
```
<!-- /ANCHOR:limitations -->
