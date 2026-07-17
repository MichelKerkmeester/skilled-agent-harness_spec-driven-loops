---
title: "Tasks: 022/013 Remove Voyage/Cohere Cloud Rerankers"
description: "8 file edits + 1 deletion + verification + spec packet."
trigger_phrases:
  - "022/013 tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/022-hardcoded-default-remediation-arc/013-remove-voyage-cohere-residue"
    last_updated_at: "2026-05-23T21:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "Tasks complete"
    next_safe_action: "n/a"
    blockers: []
    key_files: ["spec.md", "plan.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000002b18"
      session_id: "016-002-022-013-tasks"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: ["All 8 edits + 1 deletion + 31/31 tests passing"]
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Tasks: 022/013 Remove Voyage/Cohere Cloud Rerankers

<!-- ANCHOR:notation -->
## 1. TASK NOTATION
`[x]` complete | `[ ]` pending | `[~]` deferred | `[T###]` id
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## 2. PHASE 1: SETUP
- [x] [T001] [P1] Operator confirmed scope: reranker-side only; embedder-side Voyage stays
- [x] [T002] [P1] Live-surface inventory: 8 modified files + 1 deleted test file
- [x] [T003] [P1] Out-of-scope confirmed: changelogs + benchmarks + z_archive + scratch (frozen historical)
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## 3. PHASE 2: IMPLEMENTATION
- [x] [T004] [P1] `shared/embeddings/registry.ts` — `RerankerProvider` type narrowed to `'local'`; `RERANKER_CANONICAL` voyage + cohere rows removed; comment rewritten
- [x] [T005] [P1] `mcp_server/lib/search/cross-encoder.ts` — `PROVIDER_CONFIG.voyage` + `.cohere` deleted; `rerankVoyage()` + `rerankCohere()` functions deleted; `resolveProvider()` API-key checks removed; switch cases removed; barrel exports trimmed; header + circuit-breaker + maxDocuments comments updated
- [x] [T006] [P1] `mcp_server/lib/search/search-flags.ts` — `hasAnyCrossEncoderOptInSignal()` no longer treats VOYAGE/COHERE keys as opt-in signals; `looksLikeValidApiKey()` helper deleted
- [x] [T007] [P1] `mcp_server/lib/search/evidence-gap-detector.ts` — Z_SCORE_THRESHOLD comment updated to reference only `RERANKER_LOCAL=true`
- [x] [T008] [P1] `mcp_server/ENV_REFERENCE.md` §14 RERANKER intro rewritten with removal-narrative
- [x] [T009] [P1] `feature_catalog/feature-flag-reference/05-5-embedding-and-api.md` — `COHERE_API_KEY` row deleted; `VOYAGE_API_KEY` row scoped to embeddings only; `RERANKER_LOCAL` description updated
- [x] [T010] [P1] `mcp_server/tests/cross-encoder-extended.vitest.ts` — describes 2/3/8 deleted; describe 5 routes test rewritten; cache/latency mocks updated to `results:` shape
- [x] [T011] [P1] `mcp_server/tests/cross-encoder-circuit-breaker.vitest.ts` — `'voyage'`/`'cohere'` fixture strings → `'local'`; multi-provider isolation test removed
- [x] [T012] [P1] `mcp_server/tests/reranker-eval-comparison.vitest.ts` DELETED (entire file was a Voyage/Cohere comparison skeleton)
- [x] [T013] [P1] Author spec.md, plan.md, tasks.md, implementation-summary.md, description.json, graph-metadata.json
- [x] [T014] [P1] Update parent graph-metadata.json children_ids to include `013-remove-voyage-cohere-residue`
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## 4. PHASE 3: VERIFICATION
- [x] [T015] [P0] R1 sweep: `rg -i "voyage|cohere|VOYAGE|COHERE" .opencode/ -g '!z_archive/**' -g '!*/scratch/**' -g '!benchmarks/**' -g '!*/specs/**' -g '!changelog/**'` returns only intentional removal-narrative + Voyage-as-embedder hits
- [x] [T016] [P0] R2 typecheck: `npx tsc --noEmit -p .opencode/skills/system-spec-kit/mcp_server/tsconfig.json` no new errors
- [x] [T017] [P0] R3 cross-encoder-extended.vitest.ts: 23/23 pass
- [x] [T018] [P0] R4 cross-encoder-circuit-breaker.vitest.ts: 8/8 pass
- [x] [T019] [P0] R5 manual: rewritten test confirms `SPECKIT_CROSS_ENCODER=true` alone yields `provider === 'none'`, `scoringMethod === 'fallback'`
- [x] [T020] [P0] Strict-validate `--strict` exit 0 on this packet
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## 5. COMPLETION CRITERIA
20 of 20 tasks complete. R1–R5 from spec.md §4 all pass.
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## 6. CROSS-REFERENCES
spec.md R1–R5 ↔ T015–T019. plan.md Steps 1–6 ↔ Phases 1–3 (Steps 1–5 implementation = Phase 2; Step 6 verification = Phase 3; setup pre-work = Phase 1).
<!-- /ANCHOR:cross-refs -->
