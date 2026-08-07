# Iteration 002 — DeepSeek cache semantics

## Focus

What condition determines a DeepSeek context-cache hit?

## Evidence

- DeepSeek documents disk context caching and says a later request hits only when its prefix fully matches the cached prefix. [SOURCE: https://api-docs.deepseek.com/guides/kv_cache]

## Assessment

Confirmed: exact reusable prefixes are a provider constraint. This supports cache discipline, not a claimed hit rate.

## New Signal

Moved from generic caching language to a provider prerequisite. The preliminary convergence score is 0.84; it is telemetry only, so the loop continues to a distinct research angle.

Research iteration complete; stop policy remains `max-iterations`.
