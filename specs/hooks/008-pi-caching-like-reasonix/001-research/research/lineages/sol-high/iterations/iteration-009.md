# Iteration 9: Compare provider caching models

## Focus

Test whether one “provider-agnostic” optimization can safely cover DeepSeek and Anthropic.

## Findings

- Anthropic supports automatic or explicit `cache_control`, with cache prefixes ordered as tools, system, then messages and provider-defined TTL and minimum-token rules. [SOURCE: https://platform.claude.com/docs/en/build-with-claude/prompt-caching]
- Anthropic’s explicit breakpoints can fail or silently skip caching when TTL ordering, breakpoint count, minimum length, or lookback rules are violated. [SOURCE: https://platform.claude.com/docs/en/build-with-claude/prompt-caching]
- DeepSeek needs no cache marker and matches previously persisted complete prefix units on a best-effort basis. [SOURCE: https://api-docs.deepseek.com/guides/kv_cache]
- A provider-agnostic extension can share diagnostics and stable-prefix policy, but request mutation must be adapter-specific and capability-gated.

## Sources Consulted

- `https://platform.claude.com/docs/en/build-with-claude/prompt-caching`
- `https://api-docs.deepseek.com/guides/kv_cache`

## Assessment

- newInfoRatio: 0.59
- Novelty justification: Demonstrates why common policy is feasible but common wire behavior is not.
- Confidence: High.

## Reflection

- Worked: Provider primary docs expose materially different activation and invalidation semantics.
- Failed/ruled out: Unconditional insertion of Anthropic-style cache markers across providers is ruled out.

## Recommended Next Focus

Verify `pi-cache-optimizer` existence, ownership, and release timing.
