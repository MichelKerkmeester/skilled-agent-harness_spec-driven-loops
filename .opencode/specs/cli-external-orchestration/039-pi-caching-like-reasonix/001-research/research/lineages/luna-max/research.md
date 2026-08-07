---
title: "Research — Reasonix vs Pi prompt caching"
description: "Twenty-iteration verification of lumo.md claims and feasibility of a Reasonix-style Pi caching extension."
contextType: research
---

# Reasonix vs Pi prompt caching

## Verdict

The research supports a narrow, opt-in Pi extension for cache discipline and observability. It does not support building “Reasonix parity” as a provider-agnostic cache engine, nor does it validate the reported 70–90% savings target.

The safest next step is to audit and pin the existing community `pi-cache-optimizer` package before creating a competing implementation. If a separate plugin is still warranted, start in observe-only mode and add prompt mutation only behind provider capability checks.

## Stop semantics

- Executed exactly 20 iterations under the requested `max-iterations` policy.
- Convergence threshold: `0.05`; convergence remained telemetry only and did not trigger early synthesis.
- Latest recorded composite convergence score: `0.5478`; the loop stopped because the iteration cap was reached, not because the evidence converged.
- All four tracked questions are resolved as evidence classifications, but live provider measurements remain open prerequisites.
- Resource evidence is emitted in [`resource-map.md`](resource-map.md). The map was absent at init and was generated from the lineage deltas during synthesis.

## Claim audit

| `lumo.md` claim | Verdict | Evidence |
|---|---|---|
| Reasonix reached about 99.8% cache hits and reduced roughly `$61` to `$12` | Project-documented, not independently reproduced. The reduction is about 80.3%, which cannot be derived from hit rate alone without miss tokens, output tokens, model, and price ledger. | [Reasonix README](https://github.com/esengine/deepseek-reasonix), [DeepSeek pricing](https://api-docs.deepseek.com/quick_start/pricing-details-us), [`lumo.md:1-5`](../../../../lumo.md) |
| Reasonix relies on stable, byte-identical prefixes and append-only context | Verified for the documented Reasonix design and consistent with DeepSeek's prefix-cache contract. | [Reasonix architecture](https://github.com/esengine/DeepSeek-Reasonix/blob/v1/docs/ARCHITECTURE.md), [DeepSeek KV cache](https://api-docs.deepseek.com/guides/kv_cache) |
| Pi has provider-agnostic prompt caching | Partially supported. Pi has provider-aware retention, cache markers, affinity, and usage behavior; the docs do not define one universal cache protocol. | [Pi model compatibility](https://pi.dev/docs/latest/models), [Pi providers](https://pi.dev/docs/latest/providers), [`lumo.md:8-19`](../../../../lumo.md) |
| `pi-cache-optimizer` is official | Not supported. It is a verifiable community extension whose package metadata identifies `freescheme`; catalog version fields are volatile. | [Pi package page](https://pi.dev/packages/pi-cache-optimizer), [package repository](https://github.com/jiangge/pi-cache-optimizer) |
| Concurrent Pi agents share cached content and save 70–90% | Conditional/unknown. Sharing requires matching provider, model, serialized prefix, namespace, and routing; no reviewed source proves the percentage or cross-agent result. | [Pi sessions](https://pi.dev/docs/latest/sessions), [OpenAI cache identity](https://platform.openai.com/docs/api-reference/responses-streaming/response/refusal/delta), [DeepSeek KV cache](https://api-docs.deepseek.com/guides/kv_cache) |
| Pi lacks a Context Engine v2, MCP, plan mode, and checkpoints/rewind | Mixed. Pi already has compaction, branch summarization, sessions, and extension hooks. MCP and plan mode are intentionally outside core; filesystem rewind is package-level. | [Pi usage](https://pi.dev/docs/latest/usage), [Pi compaction](https://pi.dev/docs/latest/compaction), [Pi rewind package](https://pi.dev/packages/pi-rewind) |

## What is technically feasible

Pi's extension surface is sufficient for a companion layer that:

- fingerprints stable and volatile prompt sections without persisting raw prompts;
- reports prefix changes and invalidation reasons at session, branch, compaction, model, and provider boundaries;
- delegates provider-specific cache retention, cache-control markers, cache keys, and session affinity to Pi's compatibility configuration;
- captures provider usage counters where the adapter exposes them, preserving provider-specific fields rather than inventing a universal schema;
- offers read-only diagnostics and an explicit enabled/disabled comparison mode.

The relevant hooks are `before_agent_start`, `before_provider_request`, `before_provider_headers`, `after_provider_response`, `session_before_compact`, and `session_before_tree`. [Pi extensions](https://pi.dev/docs/latest/extensions), [Pi compaction hooks](https://pi.dev/docs/latest/compaction)

Prompt rewriting is medium risk. It can improve a DeepSeek common prefix, but it can also change Anthropic breakpoint ordering, conflict with provider-specific serialization, or diverge from Pi's internal system-prompt view. Default behavior should be observe-only; mutation should be opt-in and fail open when provider capability is unknown. [Pi model compatibility](https://pi.dev/docs/latest/models), [DeepSeek KV cache](https://api-docs.deepseek.com/guides/kv_cache), [package compatibility notes](https://github.com/jiangge/pi-cache-optimizer)

## Explicit non-goals

The first version should not attempt to provide:

- raw model KV-cache persistence or transfer;
- guaranteed cache residency, hit rates, or cost savings;
- one cache-key or TTL abstraction across all providers;
- unconditional cross-agent cache sharing;
- MCP, plan mode, filesystem checkpoints, or a replacement context engine;
- automatic retries after cache misses or unsupported provider parameters.

Those behaviors are outside the documented Pi extension/provider boundary or are contradicted by provider best-effort semantics. [DeepSeek KV cache](https://api-docs.deepseek.com/guides/kv_cache), [Pi usage](https://pi.dev/docs/latest/usage), [Pi compaction](https://pi.dev/docs/latest/compaction)

## Required proof before implementation approval

Run paired enabled/disabled workloads with fixed Pi, provider, model, package, price sheet, prompt sequence, proxy route, and session lifecycle. Include:

1. repeated identical prefixes with changing dynamic tails;
2. DeepSeek, Anthropic, and one OpenAI-compatible endpoint;
3. compaction and branch navigation;
4. model/provider switches and unsupported proxy parameters;
5. isolated versus explicitly shared namespaces under concurrency;
6. provider usage counters, output tokens, latency, and reconciled cost.

Report results by provider, model, prefix generation, and namespace. The Reasonix numbers remain hypotheses until this evidence exists. [DeepSeek usage](https://api-docs.deepseek.com/guides/kv_cache), [Anthropic pricing/usage](https://docs.anthropic.com/en/docs/about-claude/pricing), [OpenAI cached tokens](https://platform.openai.com/docs/api-reference/responses-streaming/response/refusal/delta)

## Residual unknowns

- Whether the existing community package meets the required security, maintenance, and Pi-version compatibility bar after a pinned source audit.
- Actual savings and overhead under controlled provider traffic.
- Whether a given proxy preserves routing affinity and accepts the advertised retention/key parameters.
- Whether concurrent shared namespaces improve cache reuse enough to justify their privacy and attribution complexity.

## References

- Local source: `.opencode/specs/cli-external-orchestration/039-pi-caching-like-reasonix/lumo.md:1-78`.
- Local routing context: `.opencode/skills/cli-external-orchestration/cli-pi/SKILL.md` and `.opencode/skills/cli-external-orchestration/cli-pi/references/mcp-and-third-party-packages.md`.
- Generated evidence inventory: [`resource-map.md`](resource-map.md).
- Primary provider and project sources are linked inline above.
