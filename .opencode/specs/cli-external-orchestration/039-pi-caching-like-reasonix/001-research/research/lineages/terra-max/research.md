# Reasonix vs Pi Prompt Caching — Research Synthesis

## Verdict

Build a narrow cache-discipline and observability companion for Pi, not a full Reasonix-style clone. That scope is feasible only for a provider and route where cache eligibility can be observed and controlled. It should improve stable-prefix construction, compatibility diagnostics, and measurement; it must not promise a hit rate, savings percentage, concurrent-agent sharing, or workspace rewind.

This synthesis completed all 20 required iterations. The convergence threshold was crossed as telemetry at iteration 18, but max-iterations kept the loop running through the final scope and negative-evidence angles.

## Claim Ledger

| lumo.md claim | Verdict | Why |
|---|---|---|
| Reasonix is cache-first | Confirmed as a first-party architecture description | Reasonix documents immutable prefix / append-only log / volatile scratch and cache-hit metrics. [SOURCE: https://github.com/esengine/DeepSeek-Reasonix/blob/v1/docs/ARCHITECTURE.md] |
| Reasonix got ~99.8% hit and ~$61→~$12 | Self-reported, not independently verified | The project presents this as a workload outcome; no independent controlled benchmark was found in this lineage. [SOURCE: https://github.com/esengine/deepseek-reasonix] |
| Reasonix is DeepSeek-only | Overstated | It is marketed as DeepSeek-native, but its README also describes OpenAI-compatible endpoint configuration. [SOURCE: https://github.com/esengine/deepseek-reasonix] |
| Pi has built-in prompt caching | Partly true, but too broad | Pi supports provider compatibility/cache-control request shaping; that is not a Pi-owned universal cache. [SOURCE: https://github.com/earendil-works/pi/blob/main/packages/coding-agent/docs/custom-provider.md] |
| pi-cache-optimizer exists | Confirmed as installable package | The Pi registry lists an extension installed with pi install npm:pi-cache-optimizer; the listing alone does not establish it as bundled core. [SOURCE: https://pi.dev/packages/pi-cache-optimizer] |
| Cached content shares among concurrent agents | Unsupported | The reviewed package page describes provider-side optimization and local footer statistics, not automatic concurrent-agent cache sharing. [SOURCE: https://pi.dev/packages/pi-cache-optimizer] |
| Pi provides 70–90% savings | Unsupported | No primary source reviewed here substantiates that figure; cache economics depend on provider, prefix repetition, pricing, and route affinity. [SOURCE: https://pi.dev/packages/pi-cache-optimizer] |
| Pi is missing checkpoints and rewind | Partly false | Pi documents session trees, forks, clones, and navigation. A workspace snapshot/rollback primitive was not verified. [SOURCE: https://pi.dev/docs/latest/sessions] |
| Pi is missing MCP and plan mode | Accurate for core, not for all extension behavior | Pi explicitly omits built-in MCP and plan mode; extensions can add commands and integration patterns. [SOURCE: https://pi.dev/docs/latest/usage] [SOURCE: https://pi.dev/docs/latest/extensions] |

The original claims under review are recorded in lumo.md. [SOURCE: .opencode/specs/cli-external-orchestration/039-pi-caching-like-reasonix/lumo.md:1-20]

## Why the Narrow Scope Wins

DeepSeek says cache reuse depends on a fully matching prefix. [SOURCE: https://api-docs.deepseek.com/guides/kv_cache] The existing Pi optimizer already targets provider-side cache behavior through stable-before-dynamic ordering, compatibility checks, cache-key fallback, and local statistics, while warning that proxies and session affinity can defeat compatibility. [SOURCE: https://pi.dev/packages/pi-cache-optimizer]

So the practical v1 is a companion layer, preferably extending or interoperating with the existing optimizer:

1. Assemble a deterministic stable prefix before volatile task state.
2. Detect provider, cache-control format, proxy limitations, and route-affinity risks before a run.
3. Emit a structured per-session measurement record: provider/model, prompt-prefix hash, cached/uncached tokens when exposed, cost, latency, and optimizer version.
4. Provide a paired baseline/optimized workload runner or export, with the same task corpus and model settings.
5. Surface cache eligibility unknown instead of fabricating a cache-hit claim when the provider cannot expose the signal.

## Explicit Non-Goals for v1

- Controlling the provider’s actual KV cache or guaranteeing hits.
- Automatic cache sharing among concurrent agents.
- Replacing a generic context engine.
- First-class MCP implementation.
- Workspace checkpoint/rewind. That needs filesystem or VCS snapshot semantics, locking, retention, and recovery testing beyond Pi’s conversation-tree controls.

## Feasibility

Conditional go. Pi’s extension API documents custom tools, commands, UI, footers, and session operations including fork, tree navigation, and compaction. [SOURCE: https://pi.dev/docs/latest/extensions] That is sufficient for cache-discipline logic and telemetry. The limiting factors are external: provider API semantics, whether cached-token data is surfaced, and proxy/session routing behavior.

A full Reasonix parity project is not a cache plugin. It becomes four or five separate products: cache discipline, context management, MCP integration, planning workflows, and durable workspace recovery. Keeping those separate is more credible and easier to validate.

## Required Validation Before Shipping

- Select one provider/model and a route with documented cache support.
- Record a no-optimizer baseline using the exact same repetitive workload.
- Run an optimized variant with stable-prefix ordering and identical prompts/tool definitions.
- Compare provider-reported cached/uncached token counts, cost, and latency; record route and prefix hash.
- Test a proxy/session-affinity failure case as a negative control.
- Publish results as workload-specific measurements, not a universal savings claim.

## Open Questions

- Whether the intended provider path exposes usable cached-token accounting in Pi.
- Whether session affinity can be made deterministic through the deployment proxy.
- Whether pi-cache-optimizer has support/ownership guarantees beyond registry publication.
- What the measured outcome is for the actual target workload.

## Source Notes

Provider mechanics are supported by DeepSeek’s official documentation. Pi behavior is supported by Pi’s official documentation, registry page, and source documentation. Reasonix architecture and outcome figures are first-party project claims; only the architecture is treated as confirmed design, while numeric outcomes remain unverified.
