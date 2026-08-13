# Iteration 5: Audit Pi's native caching surface

## Focus

Determine what Pi already exposes across providers and extensions before assigning those responsibilities to a new caching plugin.

## Findings

- Pi's model configuration includes provider-specific cache fields: Anthropic-style `cache_control` markers, OpenAI prompt-cache retention, and optional session-affinity headers for OpenAI-compatible providers. This is a real provider-aware layer, but it is configuration per adapter rather than a universal cache algorithm. [SOURCE: https://pi.dev/docs/latest/models]
- Pi exposes `PI_CACHE_RETENTION=long` for extended provider caching where supported, and its release notes describe different retention windows for Anthropic and OpenAI. The setting changes provider retention behavior; it does not create a local cache or make unsupported providers cacheable. [SOURCE: https://pi.dev/docs/latest/environment-variables; https://pi.dev/news/releases/0.50.2]
- Pi's official settings include `showCacheMissNotices`, which supports user-visible diagnostics for cache misses. Combined with provider usage data, that is closer to observability than to Reasonix's context-rewriting policy. [SOURCE: https://pi.dev/docs/latest/settings]
- Pi's extension API has `before_provider_request`, which can inspect or replace the final provider payload, and `before_agent_start` exposes structured system-prompt inputs. These hooks are sufficient to prototype stable-prefix enforcement and diagnostics, but payload rewrites can diverge from Pi's internal system-prompt view. [SOURCE: https://pi.dev/docs/latest/extensions]

## Ruled Out

- Reimplementing provider cache markers in a plugin's first version is ruled out; Pi already owns provider-specific cache-control serialization and retention settings.

## Dead Ends

- A provider-agnostic claim that all Pi models share one cache protocol is unsupported. The documented fields explicitly vary by provider API and model compatibility.

## Questions Remaining

- Does Pi's extension hook expose enough request and response metadata to measure hit/miss tokens reliably?
- Can a plugin preserve stable prefixes without fighting session compaction and provider adapter normalization?

## Sources Consulted

- `https://pi.dev/docs/latest/models`
- `https://pi.dev/docs/latest/environment-variables`
- `https://pi.dev/news/releases/0.50.2`
- `https://pi.dev/docs/latest/settings`
- `https://pi.dev/docs/latest/extensions`

## Assessment

- newInfoRatio: 0.71
- Novelty justification: Pi's native fields and lifecycle hooks reduce the proposed plugin surface and establish that caching is already partly provider-aware.
- Confidence: High for documented API availability; medium for exact per-provider payload shapes because custom model configuration can override defaults.

## Reflection

- What worked and why: Reading the model and extension docs together shows where a plugin should observe or coordinate rather than duplicate core behavior.
- What did not work and why: The docs do not promise one normalized cache-counter schema across providers.
- What I would do differently: Inspect representative payloads for DeepSeek, Anthropic, and OpenAI-compatible models in a controlled Pi run.

## Recommended Next Focus

Compare provider-specific cache semantics in Pi: DeepSeek prefix caching, Anthropic cache-control/TTL, and OpenAI-compatible retention or affinity.
