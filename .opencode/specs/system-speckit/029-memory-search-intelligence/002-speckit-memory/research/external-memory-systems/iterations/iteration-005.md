# Iteration 5 (Kimi lineage — fix proven): Letta char-limit cross-check + Kimi-contract validation

> Model: **Kimi K2.7** (`kimi-for-coding/k2p7`, NO `--variant`, tight scope + ≤4-read cap, 1200s); read-only opencode seat; orchestrator-written. newInfoRatio 0.3 (cross-check/refinement), 1 finding.
> **Purpose:** confirm the Kimi dispatch fix after 2× 600s timeouts. Result: clean 863-byte block in exactly 4 reads (exit 0) → **Kimi contract proven; lineage unblocked** with tight-scope + read-cap + 1200s + no-variant.

## Finding (1 — refines iter-4)
- **LT-char-limit-advisory-only** (NO-TRANSFER, L/M) — Letta's core-memory block char-limit is **advisory only**: it never auto-evicts/compacts a block over its limit; it surfaces `chars_current`/`chars_limit` in the rendered `<memory_blocks>` prompt and relies on the LLM to self-edit. The only compaction path (`compact_messages`) is **message-level + token-threshold + sliding-window**, not block-size-triggered. `block.py:20`; `memory.py:154-165`; `compact.py:135-168`; `summarizer_config.py:76-82`. → C7-A. **Refines iter-4 `LT-self-edit-char-limit-blocks`:** that framed it as "model-aware eviction"; Kimi clarifies there is *no automatic eviction* — a block-size compaction trigger would be a net-new build (hence NO-TRANSFER for that specific framing).

## Note
This proves the Kimi fix (see research.md Kimi-diagnosis). The other Kimi-lineage iterations (seam-mapping the candidates to our TS internals) can now run with this config in the continuation.
