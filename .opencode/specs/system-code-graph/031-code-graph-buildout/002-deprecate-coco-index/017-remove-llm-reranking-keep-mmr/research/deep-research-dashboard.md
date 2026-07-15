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
- Topic: What did the 014 CocoIndex + LLM-reranker deprecation arc miss? Residual couplings/references to removed CocoIndex/cross-encoder/rerank-sidecar, capability gaps, behavioral regressions in memory-search/confidence/council, and doc inaccuracies across all touched surfaces.
- Started: 2026-05-26T04:07:10.049Z
- Status: INITIALIZED
- Iteration: 5 of 10
- Session ID: 27ca9e78-0ad4-4691-b2be-9cfba2a410dc
- Parent Session: none
- Lifecycle Mode: new
- Generation: 1
- continuedFromRun: none

<!-- /ANCHOR:status -->
<!-- ANCHOR:progress -->
## 3. PROGRESS

| # | Focus | Track | Ratio | Findings | Status |
|---|-------|-------|-------|----------|--------|
| undefined | Live code surface sweep: 8 findings (2 P1 LIVE-STRANDED, 2 P2 DEAD/STALE, 4 INFO). Q1 partially answered. Zero dangling imports. Build coherent. | - | 0.45 | 0 | insight |
| undefined | 4-runtime mirror + non-obvious sweep: found P1 gemini search.toml cross-encoder docs (missed by prior 30-surface review), 2 P2 stale MCP configs (39 tools + Voyage reranker), verified P1 test assertion stale. 16 surfaces ruled out clean. Q2 answered. | - | 0.50 | 0 | insight |
| undefined | Q3 capability-gap: REAL-GAP semantic code search lost (intentional), COVERED MMR+rescue replaces cross-encoder, 7 new stranded promises (P1 OpenCode memory/search.md cross-encoder docs mis-match to Gemini finding, P2x5 code-graph routing/types/comments/validate-doc-refs, INFO registry stale mapping). Zero live cocoindex call sites. | - | 0.40 | 0 | insight |
| undefined | Q4 behavioral regressions (empirical): confirmed broken-test (sidecar-hardening, 3 fail/26 pass), NO-REGRESSION on rerank/rescue/confidence (47 pass/1 skip/0 fail), /doctor/speckit/council clean, confidence math verified inert. 4 findings: 1 BROKEN-TEST, 3 NO-REGRESSION. | - | 0.35 | 0 | insight |
| undefined | Q5 final doc sweep + command-mirror closure. Command blast radius limited to 2 search commands (already P1); 6 sibling commands clean; .codex/.claude have no memory commands. 1 new P3 finding: 5x cli-* SKILL.md stale 'ccc search' pkill references. 7 doc surfaces ruled INTENTIONAL-HISTORICAL. Complete 14-item catalogue finalized. CONVERGED. | - | 0.10 | 0 | insight |

- iterationsCompleted: 5
- keyFindings: 171
- openQuestions: 5
- resolvedQuestions: 0

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 0/5
- [ ] Q1: Are there hidden LIVE runtime couplings to the removed CocoIndex / cross-encoder / rerank-sidecar still in code (dangling imports, dead conditional branches, env-driven paths, `cocoIndexAvailable`-style flags, vector-channel warnings)?
- [ ] Q2: Are there residual references in non-obvious surfaces the doc/code sweeps under-covered — the 4-runtime mirrors (.gemini/.codex/.claude), MCP configs (opencode.json/.vscode/.mcp/.codex), runtime/DB JSON artifacts (skill-graph.json, advisor state), CI/hooks, `.gitignore`?
- [ ] Q3: Did removing semantic code search (CocoIndex) + the LLM reranker leave a real user-facing capability gap vs the replacements (HYBRID code-graph+Grep; algorithmic MMR), or strand a feature/flag/doc that promised the removed capability?
- [ ] Q4: Are there behavioral regressions introduced by the vestige removal — memory-search scoring/fusion, the 3-factor confidence (was the 0.20 truly inert?), result-explainability signals, the council test/CI story after the hook purge?
- [ ] Q5: Do docs (incl the just-aligned README/embedder_pluggability/feature_catalog/playbook AND the 4-runtime routing mirrors) still carry stale or contradictory claims about the removed features (cross-encoder, CodeRankEmbed default, ccc, sidecar, tool counts)?

<!-- /ANCHOR:questions -->
<!-- ANCHOR:uncovered-questions -->
## Uncovered Questions
- Count: 5
- [ ] Q1: Are there hidden LIVE runtime couplings to the removed CocoIndex / cross-encoder / rerank-sidecar still in code (dangling imports, dead conditional branches, env-driven paths, `cocoIndexAvailable`-style flags, vector-channel warnings)?
- [ ] Q2: Are there residual references in non-obvious surfaces the doc/code sweeps under-covered — the 4-runtime mirrors (.gemini/.codex/.claude), MCP configs (opencode.json/.vscode/.mcp/.codex), runtime/DB JSON artifacts (skill-graph.json, advisor state), CI/hooks, `.gitignore`?
- [ ] Q3: Did removing semantic code search (CocoIndex) + the LLM reranker leave a real user-facing capability gap vs the replacements (HYBRID code-graph+Grep; algorithmic MMR), or strand a feature/flag/doc that promised the removed capability?
- [ ] Q4: Are there behavioral regressions introduced by the vestige removal — memory-search scoring/fusion, the 3-factor confidence (was the 0.20 truly inert?), result-explainability signals, the council test/CI story after the hook purge?
- [ ] Q5: Do docs (incl the just-aligned README/embedder_pluggability/feature_catalog/playbook AND the 4-runtime routing mirrors) still carry stale or contradictory claims about the removed features (cross-encoder, CodeRankEmbed default, ccc, sidecar, tool counts)?

<!-- /ANCHOR:uncovered-questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- Last 3 ratios: 0.40 -> 0.35 -> 0.10
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.10
- coverageBySources: {}

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
- None yet

<!-- /ANCHOR:dead-ends -->
<!-- ANCHOR:next-focus -->
## 7. NEXT FOCUS
Q1: Are there hidden LIVE runtime couplings to the removed CocoIndex / cross-encoder / rerank-sidecar still in code (dangling imports, dead conditional branches, env-driven paths, `cocoIndexAvailable`-style flags, vector-channel warnings)?

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
