---
title: "Deep Research Strategy: Hardcoded-Default Audit (021)"
sessionId: 021-hardcoded-default-audit-20260523T113727Z
createdAt: 2026-05-23T11:38:11Z
---

# Deep Research Strategy: Hardcoded-Default Audit (021)

## 1. OVERVIEW

Persistent brain for the 10-iter deep-research audit on hardcoded-default anti-patterns across spec-memory, cocoindex, skill-advisor, code-graph, and rerank-sidecar.

## 2. TOPIC

Hardcoded-default anti-pattern audit across spec-memory, cocoindex, skill-advisor, code-graph, rerank-sidecar — find ADR-implementation drift like the BAAI and jina-embeddings-v3 leftovers that packet 020 fixed.

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [ ] Which subsystems have similar "env → DB/config → hardcoded" resolution chains where the hardcoded fallback is unreachable in theory but stale in practice?
- [ ] Are there READMEs / INSTALL_GUIDE / doctor commands documenting outdated defaults?
- [ ] Do agent definitions reference deprecated model names or paths?
- [ ] Does the rerank-sidecar have similar drift (Qwen3-Reranker-0.6B is canonical per CocoIndex arc 2026-05-19, but other rerankers may be hardcoded)?
- [ ] Do other "cascade probe" patterns exist with stale per-tier defaults?

<!-- /ANCHOR:key-questions -->

## 4. NON-GOALS

- Implementing fixes (research only; remediation is a follow-on)
- Auditing prompt drift in agent definitions for non-default model references
- Touching spec-folder doc drift (separate sk-doc audit)

## 5. STOP CONDITIONS

- newInfoRatio < 0.05 across 3 consecutive iterations (convergence)
- 10 iterations reached (max)
- All 5 subsystems audited with at least 1 deep iteration each

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
[None yet]

<!-- /ANCHOR:answered-questions -->

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
[None yet]

<!-- /ANCHOR:what-worked -->

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
[None yet]

<!-- /ANCHOR:what-failed -->

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
[No exhausted approach categories yet]

<!-- /ANCHOR:exhausted-approaches -->

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
[None yet]

<!-- /ANCHOR:ruled-out-directions -->

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
Which subsystems have similar "env → DB/config → hardcoded" resolution chains where the hardcoded fallback is unreachable in theory but stale in practice?

<!-- /ANCHOR:next-focus -->
<!-- MACHINE-OWNED: END -->

## 12. KNOWN CONTEXT

Predecessor 020 fixed 5 hardcoded embedder defaults in spec-memory:
- shared/embeddings.ts:873 (DEFAULT_MODEL_NAME — was BAAI)
- shared/embeddings/providers/hf-local.ts:13 (DEFAULT_MODEL — was BAAI)
- shared/embeddings/providers/ollama.ts:14 (DEFAULT_MODEL — was JINA, pre-ADR-013 bug)
- shared/embeddings/factory.ts:143-148 (DEFAULT_PROVIDER_MODELS — 4 inline strings)
- mcp_server/lib/embedders/sidecar-worker.ts:68 (DEFAULT_MODEL — was BAAI)

Shape-C registry-derived helper getCanonicalFallback(provider) closed the gap. 23 invariant assertions in registry.test.ts lock the contract.

Audit suspects (5 subsystems):
1. spec-memory — embedder fixed; what else? reranker defaults, parser defaults, search routing
2. CocoIndex (Python) — nomic-CodeRankEmbed canonical per 2026-05-19 arc; verify no drift
3. skill-advisor — model defaults, threshold defaults
4. code-graph — parser engine defaults, skip-list, fallback adapters
5. rerank-sidecar — Qwen3-Reranker-0.6B canonical; verify no drift

**iter-001 findings (3 P0 + 7 P1 + 7 P2)**:
- P0-1: `shared/embeddings/profile.ts:192` — inline `'jina-embeddings-v3'` ollama fallback
- P0-2: `shared/embeddings/profile.ts:195` — inline `'BAAI/bge-base-en-v1.5'` hf-local fallback
- P0-3: `shared/embeddings.ts:774` — inline `'jina-embeddings-v3'` in detectConfiguredModelName
- P1: 7 latent duplicates between auto-select.ts / openai.ts / voyage.ts and the registry
- P2: 7 cosmetic configs in indexer-types / edge-drift / cross-encoder

## 13. RESEARCH BOUNDARIES

- Max iterations: 10
- Convergence threshold: 0.05
- Per-iteration budget: 12 tool calls, 30 minutes
- Progressive synthesis: true (default)
- research/research.md ownership: workflow-owned canonical synthesis output
- Lifecycle branches: `resume`, `restart` (live); `fork`, `completed-continue` (deferred)
- Machine-owned sections: reducer controls Sections 3, 6, 7-11
- Canonical pause sentinel: `research/.deep-research-pause`
- Capability matrix: `.opencode/skills/deep-research/assets/runtime_capabilities.json`
- Capability resolver: `.opencode/skills/deep-research/scripts/runtime-capabilities.cjs`
- Current generation: 1
- Started: 2026-05-23T11:37:27Z
