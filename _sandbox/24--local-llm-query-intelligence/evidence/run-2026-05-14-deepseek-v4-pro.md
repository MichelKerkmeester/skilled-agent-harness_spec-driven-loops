# 24 Local-LLM Memory Substrate Validation — 2026-05-14

Executor: cli-opencode / deepseek-v4-pro (high variant)

Started: 2026-05-14 08:51:59

## Summary Table
| # | Title | Verdict | Key observation |
|---|-------|---------|------------------|
| 401 | Paraphrase recall | FAIL | embedding circuit breaker open, 214 failed embeddings, vector channel unavailable (lexical-only fallback) |
| 402 | Synonymy across vocabularies | FAIL | Pair A Jaccard 25%, vector channel offline, CocoIndex all errored |
