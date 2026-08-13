# Iteration 20: Adversarial claim audit

## Focus

Audit every material `lumo.md` assertion against the evidence collected, with convergence treated as telemetry only and the max-iterations stop preserved.

## Findings

- Reasonix's 99.82% hit-rate and approximately $61-to-$12 report is verified as project-published, not independently reproduced. The arithmetic reduction is about 80.3%, and the missing request ledger prevents deriving it from the hit rate alone. [SOURCE: https://github.com/esengine/deepseek-reasonix; INFERENCE: https://api-docs.deepseek.com/quick_start/pricing-details-usd]
- Reasonix's DeepSeek-native, exact-prefix, deterministic-serialization design is verified. DeepSeek's official contract is automatic, prefix-based, usage-visible, and best effort, so a Pi plugin can improve prefix stability and telemetry but cannot guarantee provider cache residency or savings. [SOURCE: https://github.com/esengine/DeepSeek-Reasonix/blob/v1/docs/ARCHITECTURE.md; https://api-docs.deepseek.com/guides/kv_cache]
- Pi has a real provider-aware caching surface: retention settings, Anthropic cache markers, OpenAI-compatible cache keys/affinity, cache-miss notices, and extension hooks. It does not have one universal cache protocol or raw KV-cache access. [SOURCE: https://pi.dev/docs/latest/models; https://pi.dev/docs/latest/extensions; https://pi.dev/docs/latest/settings]
- `pi-cache-optimizer` is a verifiable community extension with material overlap, not an official Pi feature. Concurrent sharing, 70–90% savings, roadmap duration, and a general provider-agnostic cache engine remain conditional or unverified. The smallest feasible scope is an opt-in, observe-first extension for fingerprints, provider-aware controls, counters, namespaces, and invalidation; adopt or audit the existing package before building a competing implementation. [SOURCE: https://pi.dev/packages/pi-cache-optimizer; https://github.com/jiangge/pi-cache-optimizer; INFERENCE: https://pi.dev/docs/latest/extensions]
- The feature-gap claims are mixed: Pi core intentionally omits MCP, plan mode, and built-in checkpoint/rewind, but core does include sessions, compaction, and branch summarization; community packages cover several omitted workflows. None of those workflow packages is required for a caching plugin. [SOURCE: https://pi.dev/docs/latest/usage; https://pi.dev/docs/latest/compaction; https://pi.dev/packages/pi-rewind]

## Ruled Out

- Early synthesis before iteration 20 is ruled out by the max-iterations policy; the observed convergence telemetry never changed the stop policy.
- A GO decision based only on the lumo percentages is ruled out; live provider benchmarks and a package/source audit remain prerequisites.

## Dead Ends

- A universal “Reasonix for Pi” implementation that promises raw KV reuse, guaranteed cross-provider sharing, or guaranteed savings is unsupported by every primary provider contract reviewed.

## Questions Remaining

- Can the existing `pi-cache-optimizer` package meet the required security, maintenance, and provider-coverage bar after a pinned source audit?
- What savings and overhead appear in controlled DeepSeek, Anthropic, and OpenAI-compatible runs with and without the extension?

## Sources Consulted

- `.opencode/specs/hooks/008-pi-caching-like-reasonix/lumo.md:1-78`
- `https://github.com/esengine/deepseek-reasonix`
- `https://github.com/esengine/DeepSeek-Reasonix/blob/v1/docs/ARCHITECTURE.md`
- `https://api-docs.deepseek.com/guides/kv_cache`
- `https://pi.dev/docs/latest/models`
- `https://pi.dev/docs/latest/extensions`
- `https://pi.dev/docs/latest/compaction`
- `https://pi.dev/docs/latest/usage`
- `https://pi.dev/packages/pi-cache-optimizer`
- `https://github.com/jiangge/pi-cache-optimizer`

## Assessment

- newInfoRatio: 0.27
- Novelty justification: The final pass maps the local claims to verified, partially supported, unsupported, and unknown categories while preserving the required full iteration count.
- Confidence: High for the evidence classification and plugin boundary; low for quantitative savings and build-versus-adopt until live tests and source audit.

## Reflection

- What worked and why: An adversarial ledger prevents project self-reports and ecosystem package claims from being promoted to provider guarantees.
- What did not work and why: The remaining questions require live provider traffic, package source review, and controlled billing evidence unavailable in read-only research.
- What I would do differently: Start the next phase with a pinned package audit and a minimal provider matrix before writing implementation code.

## Recommended Next Focus

Synthesis only: emit the resource map and `research.md`, record max-iterations completion, and preserve the live-test blockers.

