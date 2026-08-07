# Iteration 17 (Opus lineage — NATIVE): verify the iter-11/12 NET-NEW candidates

> Model: **Opus 4.8 NATIVE** (read-only). Orchestrator-written. newInfoRatio **0.4**. Refute-by-default verify of the 4 NET-NEWs against live `mcp_server/` code. **2 GO, 2 REFINE** — and a confirmed consolidation.

## Verdicts
1. **CG-agentic-tool-loop → GO.** `memory-context.ts:1298-1311` (`executeStrategy` switch) + `:973-1051` — each strategy is one straight-line retrieval call (quick→triggers, deep/focused→single `handleMemorySearch`, resume→ladder). No agent loop, no tool dispatch, no observe→re-query. **Confirmed static mode router; the ReAct-as-a-strategy gap is real and additive.** (Highest lev/eff in the campaign: H/L.)
2. **LT-per-component-recall-budget → GO.** `pressure-monitor.ts:65-95` (`getPressureLevel`) is a single `tokenCount/tokenBudget` ratio → one level, no section keys; budget path uses one flat `estimateTokens(JSON.stringify(result))`. Grep for perSection/sectionBudget/componentBudget = 0 hits. **Per-section budget gap is real.** (Minor: the candidate named `assembleResult`, which doesn't exist as a fn — behavior is right, name is wrong.)
3. **CG-post-retrieval-summarization → REFINE.** "Never LLM-summarizes" is TRUE (grep messages.create/completions.create/callLLM in lib/search+handlers = 0). BUT the budget path BOTH char-slices content fields (`memory-context.ts:692-720`, `originalValue.slice(0,mid)`) AND drops results (`:793-801`). So scope the claim to "no *semantic/LLM* compression" — the structural truncation exists. Low value anyway (L/S).
4. **CG-summary-retrieval-channel → REFINE.** RRF fusion channel list is fixed at `hybrid-search.ts:1310` = `['vector','fts','bm25','graph','degree']` (+`trigger`) — no community/summary lane. BUT a summary channel DOES exist at **stage1 candidate-gen** (`stage1-candidate-gen.ts:44 querySummaryEmbeddings`, flag `isMemorySummariesEnabled`), and community injects in **stage2-fusion** (`:1139-1146 applyCommunityBoost`) AND as the post-pipeline fallback. So scope to "not a *weighted RRF lane*," not "no summary retrieval at all."

## CONSOLIDATION confirmed
**CG-summary-retrieval-channel ≡ GR-community-search-channel.** Same underlying gap: neither community nor summary is a first-class *weighted RRF fusion lane* — both are bolt-ons (summary = stage1 candidate-gen; community = stage2 inject + post-pipeline fallback). Merge → **MEM-fused-summary-channel** (promote to fused RRF lanes).

## MOST-LIKELY-WRONG
`CG-summary-retrieval-channel` — its "participates only as a POST-pipeline fallback, never inside the pipeline" framing is false (community injects in stage2; summary embeddings are a stage1 channel). Only "never a *weighted RRF lane*" survives.

## Net effect
The two H-leverage NET-NEWs (`CG-agentic-tool-loop` H/L, `LT-per-component-recall-budget` H/M) **hold as clean GOs**. The two channel/summarization candidates are real-but-narrower REFINEs and consolidate with existing findings. Verification backbone is now complete across all banked NET-NEWs.

## Next Focus
Feed verified set into synthesis/06. Remaining discovery frontier = Cognee ECL/ingest depth + Letta sleep-time + Graphiti `resolve_extracted_edge` + per-candidate blast-radius (per iter-18 saturation read).
