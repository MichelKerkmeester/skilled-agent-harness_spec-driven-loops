# Iteration 18: Audit concurrent-agent cache sharing

## Focus

Verify the `lumo.md` statement that cached content can be shared among concurrent Pi agents.

## Findings

- Provider-side caches may reuse identical prefixes across requests within a provider-defined namespace, but DeepSeek only documents per-user isolation and best-effort persistence, not a Pi-managed shared cache. [SOURCE: https://api-docs.deepseek.com/news/news0802/]
- Anthropic notes that a cache entry is unavailable to concurrent requests until the first response begins, so simultaneous cold requests do not all benefit from the first write. [SOURCE: https://platform.claude.com/docs/en/build-with-claude/prompt-caching]
- Pi exposes session affinity controls for providers/proxies, which usually favor isolation or sticky routing rather than a documented shared cache among agents. [SOURCE: https://pi.dev/docs/latest/models]
- Verdict: “cached content can be shared among concurrent agents” is unknown as a general Pi claim and misleading without provider, account, timing, and namespace qualifiers.

## Sources Consulted

- `https://api-docs.deepseek.com/news/news0802/`
- `https://platform.claude.com/docs/en/build-with-claude/prompt-caching`
- `https://pi.dev/docs/latest/models`

## Assessment

- newInfoRatio: 0.42
- Novelty justification: Adds timing and namespace constraints that materially narrow the concurrency claim.
- Confidence: Medium-high.

## Reflection

- Worked: Provider rules contradict an unconditional cross-agent sharing statement.
- Failed/ruled out: Designing a global shared cache key by default is ruled out due to isolation and attribution risks.

## Recommended Next Focus

Threat-model prompt mutation, package installation, and cache telemetry.
