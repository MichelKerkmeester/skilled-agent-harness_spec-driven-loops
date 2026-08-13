# Iteration 16: Evaluate performance measurement feasibility

## Focus

Turn the lumo performance targets into an evidence plan and identify the runtime signals Pi already exposes.

## Findings

- Pi's recent release notes describe request-wide input pricing tiers and opt-in cache-miss visibility, which are useful for cost accounting and user diagnostics. Pi also documents provider-specific cached-token usage for at least some providers, so performance measurement is not limited to wall-clock timing. [SOURCE: https://pi.dev/news; https://pi.dev/news/releases/0.50.2]
- The community optimizer exposes local provider/model counters and a verify-effect workflow that compares repeated similar turns. This is a practical measurement pattern, but its counters are package-owned and should not be treated as provider billing evidence unless tied to response usage fields. [SOURCE: https://pi.dev/packages/pi-cache-optimizer]
- A valid benchmark needs paired enabled/disabled runs with the same model, provider, prompt sequence, session lifecycle, proxy route, and price sheet. It should report hit/miss tokens, output tokens, latency, and total cost segmented by prefix generation. No public source supplies those paired results for the lumo figures. [INFERENCE: https://api-docs.deepseek.com/guides/kv_cache; https://pi.dev/news]
- The lumo target of less than 5% overhead and 70–90% savings is an unverified acceptance target, not an observed result in the sources reviewed. It should remain a hypothesis until a controlled benchmark measures both CPU/runtime overhead and provider billing. [SOURCE: .opencode/specs/hooks/008-pi-caching-like-reasonix/lumo.md:35-48,66-78]

## Ruled Out

- Treating footer counters or a single session's hit percentage as proof of cost savings is ruled out without provider usage and price reconciliation.

## Dead Ends

- A latency-only benchmark is insufficient; cache reads can alter cost and input processing without mapping cleanly to end-to-end latency.

## Questions Remaining

- Which provider usage fields can be normalized safely in a plugin?
- Which benchmark scenarios are required before approving a Phase 2 implementation?

## Sources Consulted

- `https://pi.dev/news`
- `https://pi.dev/news/releases/0.50.2`
- `https://pi.dev/packages/pi-cache-optimizer`
- `https://api-docs.deepseek.com/guides/kv_cache`
- `.opencode/specs/hooks/008-pi-caching-like-reasonix/lumo.md:35-48,66-78`

## Assessment

- newInfoRatio: 0.38
- Novelty justification: The broad performance targets are converted into a paired benchmark and explicitly separated from existing Pi diagnostics.
- Confidence: High for the measurement requirements; low for the magnitude of any savings until a benchmark runs.

## Reflection

- What worked and why: Pi release notes and provider usage docs identify concrete counters beyond wall-clock timing.
- What did not work and why: No public paired run validates the lumo target values.
- What I would do differently: Archive raw request usage and the exact Pi/provider/package versions with every benchmark.

## Recommended Next Focus

Stress invalidation and failure modes: proxy routing, provider parameter rejection, TTL ordering, compaction, and concurrent updates.

