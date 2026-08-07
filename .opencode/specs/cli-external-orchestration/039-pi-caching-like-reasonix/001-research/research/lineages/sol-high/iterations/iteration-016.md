# Iteration 16: Classify context engine and compaction claims

## Focus

Compare the proposed “Context Engine v2” gap with Pi’s actual context lifecycle.

## Findings

- Pi has automatic compaction, manual `/compact`, branch summarization, structured compaction entries, and extension hooks that can replace summaries. [SOURCE: https://pi.dev/docs/latest/compaction]
- Compaction rebuilds the active context from summary plus retained tail; this is incremental lifecycle management, though it is not branded “Context Engine v2.” [SOURCE: https://pi.dev/docs/latest/session-format]
- Pi intentionally uses fresh routing session IDs and disables prompt-cache writes where supported for one-off compaction requests, showing cache-aware treatment of low-reuse prompts. [SOURCE: https://pi.dev/docs/latest/compaction]
- Verdict: “Context Engine v2 missing” is unverifiable as a named comparison and largely refuted as a functional absence. Cache-aware compaction tuning is a plausible narrow gap.

## Sources Consulted

- `https://pi.dev/docs/latest/compaction`
- `https://pi.dev/docs/latest/session-format`

## Assessment

- newInfoRatio: 0.48
- Novelty justification: Reframes a vague branded gap into documented lifecycle features and one narrow optimization opportunity.
- Confidence: High for Pi behavior; low for the undefined Reasonix label.

## Reflection

- Worked: Concrete compaction data structures replace branding-based comparison.
- Failed/ruled out: Building a second session/context engine inside the optimizer is ruled out.

## Recommended Next Focus

Classify cost control, logging, and monitoring claims.
