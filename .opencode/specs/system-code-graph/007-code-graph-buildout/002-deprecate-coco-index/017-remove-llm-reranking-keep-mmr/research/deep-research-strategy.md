---
title: Deep Research Strategy - 014 deprecation miss-finding
description: Session tracking for the deepseek-v4-pro deep-research audit of the 014 CocoIndex + LLM-reranker deprecation arc.
---

# Deep Research Strategy - Session Tracking

## 1. OVERVIEW

Persistent brain for the deep-research session auditing what the 014 deprecation arc (CocoIndex removal + LLM-reranker removal + 017 vestige cleanup + council pre-push-hook purge + comprehensive doc alignment) may have missed.

---

## 2. TOPIC
What did the 014 CocoIndex + LLM-reranker deprecation arc miss? Residual couplings/references to the removed CocoIndex / cross-encoder / rerank-sidecar, capability gaps from removing semantic code search + the LLM reranker, behavioral regressions in memory-search / confidence-scoring / the council subsystem, and doc inaccuracies that survived the alignment — across all touched surfaces (code, configs, hooks, runtime JSON, 4-runtime mirrors, docs).

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [ ] Q1: Are there hidden LIVE runtime couplings to the removed CocoIndex / cross-encoder / rerank-sidecar still in code (dangling imports, dead conditional branches, env-driven paths, `cocoIndexAvailable`-style flags, vector-channel warnings)?
- [ ] Q2: Are there residual references in non-obvious surfaces the doc/code sweeps under-covered — the 4-runtime mirrors (.gemini/.codex/.claude), MCP configs (opencode.json/.vscode/.mcp/.codex), runtime/DB JSON artifacts (skill-graph.json, advisor state), CI/hooks, `.gitignore`?
- [ ] Q3: Did removing semantic code search (CocoIndex) + the LLM reranker leave a real user-facing capability gap vs the replacements (HYBRID code-graph+Grep; algorithmic MMR), or strand a feature/flag/doc that promised the removed capability?
- [ ] Q4: Are there behavioral regressions introduced by the vestige removal — memory-search scoring/fusion, the 3-factor confidence (was the 0.20 truly inert?), result-explainability signals, the council test/CI story after the hook purge?
- [ ] Q5: Do docs (incl the just-aligned README/embedder_pluggability/feature_catalog/playbook AND the 4-runtime routing mirrors) still carry stale or contradictory claims about the removed features (cross-encoder, CodeRankEmbed default, ccc, sidecar, tool counts)?

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS
- Re-litigating the deprecation decision itself (CocoIndex/rerank removal is settled).
- Implementing fixes — this is research/audit only; findings feed a later remediation packet.
- Re-flagging intentionally-kept historical records (frozen benchmarks, z_archive, changelogs, decision-record rationale) UNLESS one is actually a LIVE coupling that should have been removed.
- The council pre-push-hook (already fully purged + verified this session).

---

## 5. STOP CONDITIONS
- Composite convergence: newInfoRatio below 0.05 across the rolling/MAD/entropy vote (graph-assisted), OR
- All 5 key questions answered with evidence, OR
- maxIterations (10) reached.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
[None yet]

<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
[None yet]

<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
[None yet]

<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
[No exhausted approach categories yet]

<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
[None yet]

<!-- /ANCHOR:ruled-out-directions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
Q1: Are there hidden LIVE runtime couplings to the removed CocoIndex / cross-encoder / rerank-sidecar still in code (dangling imports, dead conditional branches, env-driven paths, `cocoIndexAvailable`-style flags, vector-channel warnings)?

<!-- /ANCHOR:next-focus -->

<!-- MACHINE-OWNED: END -->

---

## 12. KNOWN CONTEXT
Prior work this session + arc (high confidence, from direct git/source inspection):
- CORE removal committed in 014/003 `b564013c0e` (deleted cross-encoder.ts/local-reranker.ts/reranker.ts/rerank-gate.ts + 7 tests; stripped stage3 Step-1; removed isCrossEncoderEnabled/isRerankerExpected + RerankGateDecision). Cloud Voyage/Cohere rerankers removed earlier in 022/013.
- 017 cleanup committed `74515e11f7` (confidence reranker_boost/hasRerankerSignal/rerankerScore/WEIGHT_RERANKER removed -> 3-factor; result-explainability reranker_support; decision-audit rerankTriggerRate; 20+ docs aligned to MMR-only; mk-spec-memory default = nomic-embed-text-v1.5; code-graph = tree-sitter/mk_code_index/8 tools; tool count 35/60).
- Council pre-push-hook purge committed `afbb4e0ab0` (hook + all refs deleted; council test fixed).
- A PRIOR 30-surface deep-REVIEW already ran on the deprecation (013-post-deprecation-deep-review, commit 50addeb2b6, cli-devin SWE-1.6) -- look for what IT missed too, not just re-cover it.
- CocoIndex (mcp-coco-index) + ccc CLI + rerank sidecar DELETED; system-code-graph is now tree-sitter structural (no embeddings). MMR diversity reranker (SPECKIT_MMR) KEPT.
- Documented kept exceptions (NOT misses): frozen benchmarks/, z_archive, embedder_pluggability historical decision (Path A rejected), process-sweep/RM-8 coco/rerank kill patterns, cli-* `pkill ccc search`.

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 10
- Convergence threshold: 0.05
- Per-iteration budget: 12 tool calls, 10 minutes
- Progressive synthesis: true
- research/research.md ownership: workflow-owned canonical synthesis output
- Executor: cli-opencode / deepseek/deepseek-v4-pro / reasoningEffort=high (--variant high, --pure, </dev/null), one-at-a-time with kill+RSS between dispatches
- Machine-owned sections: reducer controls Sections 3, 6, 7-11
- Canonical pause sentinel: research/.deep-research-pause
- Current generation: 1
- Started: 2026-05-26T04:07:10.049Z
