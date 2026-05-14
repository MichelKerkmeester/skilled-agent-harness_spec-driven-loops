---
title: "401 Paraphrase Recall FSRS Memory"
trigger_phrases: ["fsrs", "spaced repetition", "memory scheduler", "forgetting curve", "optimal review intervals"]
importance_tier: "normal"
---

# 401 Paraphrase Recall Test

## Context

The FSRS (Free Spaced Repetition Scheduler) algorithm is used for spaced repetition scheduling. It predicts memory stability and difficulty per item, then schedules reviews at optimal intervals to minimize forgetting.

The current memory MCP substrate uses an embedding model to perform semantic search. When a user stores information about FSRS using one vocabulary, then queries using different phrasing (e.g., "forgetting curve scheduling"), the system should bridge the lexical gap via vector similarity.

## Decision

The memory index should use semantic vector search rather than pure lexical matching. This enables paraphrase recall where the stored content and the query share semantic meaning but not surface words.

## Implementation Notes

- FSRS predicts retrievability, stability, and difficulty parameters per flashcard
- The scheduler computes optimal review intervals using a forgetting-curve model
- Memory stability decays over time; FSRS estimates the decay rate per item
- This approach outperforms fixed-schedule algorithms like SM-2

## Evidence

- Test run date: 2026-05-14
- Executor: deepseek-v4-pro
- Active provider: llama-cpp / unsloth-embeddinggemma-300m-GGUF
- Embedding dimension: 768, dtype: q8
- Vector channel status: degraded (circuit breaker open)

## Next Steps

Verify that a paraphrased query ("apply forgetting-curve scheduling to memory items") retrieves this memory in top-3 results despite low lexical overlap between query and stored content.
