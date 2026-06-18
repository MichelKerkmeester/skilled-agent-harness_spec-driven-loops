# Iteration 4 (Letta system; DeepSeek lineage — Kimi reassigned): Letta/MemGPT — memory tiers / compaction / budgeting

> Model: **DeepSeek v4 Pro** (`deepseek/deepseek-v4-pro --variant high`), read-only opencode seat; orchestrator-written. **Reassigned from Kimi K2.7** (which timed out 2× at 600s). newInfoRatio 0.8, 5 findings.

## Focus
Mine Letta's self-editing memory tiers (core blocks / archival / recall), eviction/compaction, and context budgeting — diff against 028's dominance cap (C7-A) + context-budget.

## Findings (5)
1. **LT-self-edit-char-limit-blocks** (EXTENDS C7-A, **H/M**) — core blocks render `chars_current`/`chars_limit` inline; the LLM self-edits (`core_memory_replace`) near the limit, choosing what to evict/summarize, vs a blind hard cap. `schemas/memory.py:154-166` + `functions/function_sets/base.py:246-279` + `schemas/block.py:20` (CORE_MEMORY_BLOCK_CHAR_LIMIT=100000). → `mcp_server/lib/search/pipeline/stage4-filter.ts` (C7-A + STATE_LIMITS). Makes the cap model-aware.
2. **LT-compaction-fallback-ladder** (NET-NEW, M/M) — on summarization failure descends `self_compact_all → self_compact_sliding_window → all`, + post-compaction token verification with re-compaction if still over. `services/summarizer/compact.py:193-346, 350-413`. → stage4-filter + recall assembly (today: single-pass, no recovery).
3. **LT-sliding-window-pct-keep** (EXTENDS C7-A, M/L) — keep a configurable `sliding_window_percentage` of the window after summarization; clip summary via `clip_chars` (50000). `services/summarizer/summarizer_config.py:48-88`. → STATE_LIMITS (fixed ints today; this is a tunable ratio adapting to window size).
4. **LT-external-memory-size-in-prompt** (EXTENDS decision-envelope, L/L) — archival/recall sizes injected into the system prompt (`external_memory_summary`) so the model knows what's available externally without spending content tokens. `schemas/memory.py:23-65` + `agent.py:1401-1416`. → `search-decision-envelope.ts` + `progressive-disclosure.ts` (counts exist API-level, not as model-visible prompt tokens).
5. **LT-approx-token-counter** (NET-NEW, L/L) — fast `bytes/4 × 1.3`-margin token estimate for compaction threshold checks, avoiding tokenizer loads. `services/context_window_calculator/token_counter.py:87-100`. → context-budget (no fast approximate path today).

## Next Focus
4 systems now covered (Mem0/Cognee/Graphiti/Letta). Continuation: deepen each (Mem0 merge logic, Graphiti dedup/community, Cognee retrievers, Letta sleep-time compute), cross-cutting + Advisor/Deep-Loop transfers, then Opus adversarial-verify + GO synthesis. See research.md CONTINUATION RECIPE. Resolve Kimi viability for its lineage.
