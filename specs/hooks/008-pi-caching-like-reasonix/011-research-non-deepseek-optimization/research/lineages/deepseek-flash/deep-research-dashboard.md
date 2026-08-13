# Deep Research Dashboard — deepseek-flash lineage

Lifecycle: `new` | Session: `fanout-deepseek-flash-1786253178211-cxy5n1` | Generation 1 | Status: complete

## Iteration Table

| run | focus | newInfoRatio | findings | status |
|-----|-------|--------------|----------|--------|
| 1 | Provider coverage audit | 0.95 | 5 | complete |
| 2 | Cache-hit-rate economics | 0.90 | 5 | complete |
| 3 | statsModel/ctxModel consolidation correctness | 0.85 | 4 | complete |
| 4 | Anthropic TTL-reordering path | 0.75 | 4 | complete |
| 5 | FooterMode/config persistence | 0.60 | 4 | complete |
| 6 | Test coverage breadth | 0.70 | 4 | complete |
| 7 | Error handling/fallback | 0.65 | 5 | complete |
| 8 | Gemini-specific path | 0.55 | 5 | complete |
| 9 | Cache economics/token accounting | 0.60 | 5 | complete |
| 10 | Maintainability/drift/comments | 0.60 | 4 | complete |

## Question Status

Answered: 3/7 (q2 guard semantics, q6 normalizer accounting, q7 test coverage). Partial: q1 (coverage matrix), q3 (adapter inventory + Gemini), q4 (economics), q5 (TTL repair).

## Convergence Trend

newInfoRatio: `0.95 -> 0.90 -> 0.85 -> 0.75 -> 0.60 -> 0.70 -> 0.65 -> 0.55 -> 0.60 -> 0.60` — descending with re-focus upticks, ending flat ~0.60. Average 0.72 (telemetry only; stop policy max-iterations).

## Dead Ends

- Static router determination for opencode/opencode-go (runtime-injected registry).
- Case-only echoed-id fragmentation (consolidation overwrites on any id difference).
- TTL-order fix suggestion as wrong-knob (supportsLongCacheRetention:false is coherent).
- Stale footer-mode cache (write paths sync module var).
- Gemini cacheWrite:0 accounting bug (official API has no write counter).
- Cross-provider denominator inconsistency (all normalizers full-prompt).
- Comment-hygiene violation (zero ephemeral labels in index.ts).
- payload-shape throw paths (asRecord/typeof guards safe).

## Blocked Stops

None (max-iterations stop policy; convergence was never the stop trigger).

## Graph Convergence

Not applicable (no graphEvents emitted).

## Next Focus

Synthesis complete. Follow-up (implementation) is a separate operator decision per research-only scope; recommendation order in `research.md` §7.

## Active Risks

- P0: prompt_cache_key injection has no 400 self-heal / per-model opt-out.
- P0: message_end silently drops stats on unrecognized echoed model ids.
- P1: Anthropic TTL repair unreachable for cacheControlFormat endpoints.
- P1: zero test coverage over the non-DeepSeek provider-specific surface.
- P1: ownership boundary allowlist duplicated across two forks, fixture-pinned only.
