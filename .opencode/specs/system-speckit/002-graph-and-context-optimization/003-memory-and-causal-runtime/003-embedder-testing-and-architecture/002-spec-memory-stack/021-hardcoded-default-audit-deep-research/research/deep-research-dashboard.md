---
title: Deep Research Dashboard
description: Auto-generated reducer view over the research packet.
---

# Deep Research Dashboard - Session Overview

Auto-generated from JSONL state log, iteration files, findings registry, and strategy state. Never manually edited.

<!-- ANCHOR:overview -->
## 1. OVERVIEW

Reducer-generated observability surface for the active research packet.

<!-- /ANCHOR:overview -->
<!-- ANCHOR:status -->
## 2. STATUS
- Topic: Hardcoded-default anti-pattern audit across spec-memory, cocoindex, skill-advisor, code-graph, rerank-sidecar — find ADR-implementation drift like the BAAI and jina-embeddings-v3 leftovers that packet 020 fixed
- Started: 2026-05-23T11:37:27Z
- Status: INITIALIZED
- Iteration: 2 of 10
- Session ID: 021-hardcoded-default-audit-20260523T113727Z
- Parent Session: none
- Lifecycle Mode: new
- Generation: 1
- continuedFromRun: none

<!-- /ANCHOR:status -->
<!-- ANCHOR:progress -->
## 3. PROGRESS

| # | Focus | Track | Ratio | Findings | Status |
|---|-------|-------|-------|----------|--------|
| undefined | Broad repo-wide grep sweep for inline default patterns across all 5 subsystems. Found 3 P0 active-drift sites (same class as 020 BAAI/jina), 7 P1 latent-duplicate sites, 7 P2 cosmetic configs. | - | 0.85 | 0 | insight |
| undefined | CocoIndex Python subsystem — embedder config, reranker drift, chunking/scoring defaults, inline fallbacks. Cross-check vs May 2026 cocoindex arc ADRs (nomic-CodeRankEmbed + Qwen3-Reranker-0.6B promotion). Registry pattern conformance assessment. | - | 0.72 | 0 | insight |

- iterationsCompleted: 2
- keyFindings: 11
- openQuestions: 5
- resolvedQuestions: 0

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 0/5
- [ ] Which subsystems have similar "env → DB/config → hardcoded" resolution chains where the hardcoded fallback is unreachable in theory but stale in practice?
- [ ] Are there READMEs / INSTALL_GUIDE / doctor commands documenting outdated defaults?
- [ ] Do agent definitions reference deprecated model names or paths?
- [ ] Does the rerank-sidecar have similar drift (Qwen3-Reranker-0.6B is canonical per CocoIndex arc 2026-05-19, but other rerankers may be hardcoded)?
- [ ] Do other "cascade probe" patterns exist with stale per-tier defaults?

<!-- /ANCHOR:questions -->
<!-- ANCHOR:uncovered-questions -->
## Uncovered Questions
- Count: 5
- [ ] Which subsystems have similar "env → DB/config → hardcoded" resolution chains where the hardcoded fallback is unreachable in theory but stale in practice?
- [ ] Are there READMEs / INSTALL_GUIDE / doctor commands documenting outdated defaults?
- [ ] Do agent definitions reference deprecated model names or paths?
- [ ] Does the rerank-sidecar have similar drift (Qwen3-Reranker-0.6B is canonical per CocoIndex arc 2026-05-19, but other rerankers may be hardcoded)?
- [ ] Do other "cascade probe" patterns exist with stale per-tier defaults?

<!-- /ANCHOR:uncovered-questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- Last 3 ratios: 0.85 -> 0.72
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.72
- coverageBySources: {}

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
- None yet

<!-- /ANCHOR:dead-ends -->
<!-- ANCHOR:next-focus -->
## 7. NEXT FOCUS
Which subsystems have similar "env → DB/config → hardcoded" resolution chains where the hardcoded fallback is unreachable in theory but stale in practice?

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 8. ACTIVE RISKS
- None active beyond normal research uncertainty.

<!-- /ANCHOR:active-risks -->
<!-- ANCHOR:blocked-stops -->
## 9. BLOCKED STOPS
No blocked-stop events recorded.

<!-- /ANCHOR:blocked-stops -->
<!-- ANCHOR:graph-convergence -->
## 10. GRAPH CONVERGENCE
- graphConvergenceScore: 0.00
- graphDecision: [Not recorded]
- graphBlockers: none recorded

<!-- /ANCHOR:graph-convergence -->
