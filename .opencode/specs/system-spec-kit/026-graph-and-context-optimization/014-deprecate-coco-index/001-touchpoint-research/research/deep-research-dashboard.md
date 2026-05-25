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
- Topic: Map every LIVE touchpoint for deprecating mcp-coco-index + system-rerank-sidecar and decoupling system-code-graph from CocoIndex, into a classified resource map (DELETE / EDIT-decouple / EDIT-remove-ref / LEAVE-historical) plus a dependency-ordered deprecation phase DAG. Historical spec docs under .opencode/specs stay frozen.
- Started: 2026-05-25T06:58:00Z
- Status: INITIALIZED
- Iteration: 12 of 12
- Session ID: dr-014-001-touchpoint-20260525
- Parent Session: none
- Lifecycle Mode: new
- Generation: 1
- continuedFromRun: none

<!-- /ANCHOR:status -->
<!-- ANCHOR:progress -->
## 3. PROGRESS

| # | Focus | Track | Ratio | Findings | Status |
|---|-------|-------|-------|----------|--------|
| undefined | RQ1 live-reference inventory seed | - | 0.90 | 0 | complete |
| undefined | RQ2 rerank-sidecar consumers + memory fallback | - | 0.70 | 0 | complete |
| undefined | RQ3 code-graph decouple edit-set | - | 0.85 | 0 | complete |
| undefined | RQ4 semantic-search vacuum + replacement policy | - | 0.80 | 0 | complete |
| undefined | RQ5 4-runtime mirror + configs | - | 0.75 | 0 | complete |
| undefined | RQ7 deletion completeness | - | 0.65 | 0 | complete |
| undefined | RQ6 deprecation phase DAG + ordering + risk | - | 0.80 | 0 | complete |
| undefined | RQ1 completeness + dedup sweep | - | 0.07 | 0 | complete |
| undefined | dynamic/runtime refs + final coupling verification | - | 0.05 | 0 | complete |
| undefined | pre-synthesis consolidation + RQ acceptance | - | 0.03 | 0 | complete |
| undefined | DeepSeek adversarial validation pass 1 | - | 0.15 | 0 | complete |
| undefined | DeepSeek adversarial validation pass 2 final | - | 0.62 | 0 | complete |

- iterationsCompleted: 12
- keyFindings: 0
- openQuestions: 7
- resolvedQuestions: 0

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 0/7
- [ ] RQ1: Exhaustive, deduplicated inventory of every LIVE file referencing coco / cocoindex / cocoindex_code / ccc CLI, with a per-file mutation class (DELETE / EDIT-decouple / EDIT-remove-ref / LEAVE-historical). Dedup across all spellings.
- [ ] RQ2: All consumers of `system-rerank-sidecar`. Confirm/deny mk-spec-memory is the only non-coco consumer; trace `cross-encoder.ts` local branch, `ensure-rerank-sidecar.cjs`, launcher wiring, `SPECKIT_CROSS_ENCODER` / `RERANKER_LOCAL` flags, reaper/telemetry. Define exactly what mk-spec-memory loses and the safe fallback.
- [ ] RQ3: Precise edit-set to decouple `system-code-graph` from CocoIndex — sever `ccc_status`/`ccc_reindex`/`ccc_feedback` tools, the `code_graph_classify_query_intent` semantic/hybrid routing, `ccc_bridge_integration` doc, glossary/router refs — while keeping the structural skill green (tests, tool-schemas, code-graph-boundary.ts).
- [ ] RQ4: Semantic-search vacuum. Every agent/command/CLAUDE.md/AGENTS.md route that sends "find code by concept" to CocoIndex; the replacement policy options (drop / repoint to memory_search / grep + code-graph) + a recommendation.
- [ ] RQ5: 4-runtime mirror + configs. Every opencode.json / .vscode/mcp.json / .gemini / .claude / .codex + mirrored agent/command + MCP registration edit. The x4 multiplier.
- [ ] RQ6: Dependency-correct phase DAG + ordering (decouple before delete), rollback points, per-phase verify gates, risk register, and the NEGATIVE-knowledge list (things that look related but are NOT in scope).
- [ ] RQ7: Deletion completeness — venv, daemon sockets/pids (~/.cocoindex_code/), gitignored index dirs (.cocoindex_code/), HuggingFace model cache, install/doctor scripts, git hooks, benchmarks.

<!-- /ANCHOR:questions -->
<!-- ANCHOR:uncovered-questions -->
## Uncovered Questions
- Count: 7
- [ ] RQ1: Exhaustive, deduplicated inventory of every LIVE file referencing coco / cocoindex / cocoindex_code / ccc CLI, with a per-file mutation class (DELETE / EDIT-decouple / EDIT-remove-ref / LEAVE-historical). Dedup across all spellings.
- [ ] RQ2: All consumers of `system-rerank-sidecar`. Confirm/deny mk-spec-memory is the only non-coco consumer; trace `cross-encoder.ts` local branch, `ensure-rerank-sidecar.cjs`, launcher wiring, `SPECKIT_CROSS_ENCODER` / `RERANKER_LOCAL` flags, reaper/telemetry. Define exactly what mk-spec-memory loses and the safe fallback.
- [ ] RQ3: Precise edit-set to decouple `system-code-graph` from CocoIndex — sever `ccc_status`/`ccc_reindex`/`ccc_feedback` tools, the `code_graph_classify_query_intent` semantic/hybrid routing, `ccc_bridge_integration` doc, glossary/router refs — while keeping the structural skill green (tests, tool-schemas, code-graph-boundary.ts).
- [ ] RQ4: Semantic-search vacuum. Every agent/command/CLAUDE.md/AGENTS.md route that sends "find code by concept" to CocoIndex; the replacement policy options (drop / repoint to memory_search / grep + code-graph) + a recommendation.
- [ ] RQ5: 4-runtime mirror + configs. Every opencode.json / .vscode/mcp.json / .gemini / .claude / .codex + mirrored agent/command + MCP registration edit. The x4 multiplier.
- [ ] RQ6: Dependency-correct phase DAG + ordering (decouple before delete), rollback points, per-phase verify gates, risk register, and the NEGATIVE-knowledge list (things that look related but are NOT in scope).
- [ ] RQ7: Deletion completeness — venv, daemon sockets/pids (~/.cocoindex_code/), gitignored index dirs (.cocoindex_code/), HuggingFace model cache, install/doctor scripts, git hooks, benchmarks.

<!-- /ANCHOR:uncovered-questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- Last 3 ratios: 0.03 -> 0.15 -> 0.62
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.62
- coverageBySources: {}

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
- None yet

<!-- /ANCHOR:dead-ends -->
<!-- ANCHOR:next-focus -->
## 7. NEXT FOCUS
RQ1: Exhaustive, deduplicated inventory of every LIVE file referencing coco / cocoindex / cocoindex_code / ccc CLI, with a per-file mutation class (DELETE / EDIT-decouple / EDIT-remove-ref / LEAVE-historical). Dedup across all spellings.

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
