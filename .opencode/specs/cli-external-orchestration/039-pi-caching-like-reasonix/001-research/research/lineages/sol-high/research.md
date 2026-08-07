# Reasonix vs Pi Prompt Caching — SOL High Research Synthesis

## 1. Executive Verdict

The central architectural claim is directionally right but materially overstated. Reasonix historically engineered its loop around DeepSeek prefix stability; Pi exposes provider-aware cache behavior and an extension surface rather than one universal cache engine. The quantitative Reasonix figures are verified as a project-published single-workload report, not as an independent benchmark. The current `pi-cache-optimizer` package exists and already implements most of the credible narrow plugin scope, but it is a cataloged community extension rather than Pi core or a demonstrated first-party Pi component.

Recommendation for Phase 2: conditional GO for a source audit and controlled A/B evaluation of the existing optimizer; NO-GO for the all-in-one roadmap in `lumo.md` unless each adjacent product area receives an independent requirement and business case.

## 2. Method and Evidence Classes

Twenty iterations were run under `stopPolicy=max-iterations`; convergence signals were treated as telemetry and did not permit early synthesis. Claims are tagged by source class:

- **Provider primary** — API behavior or pricing documented by DeepSeek or Anthropic.
- **Project primary** — Reasonix or Pi project documentation/source; authoritative for claimed design, not independent performance.
- **Community package primary** — package catalog/source authored outside Pi core.
- **Local assertion** — `lumo.md` or packet text without an external citation.
- **Inference** — a conclusion derived from the cited contracts; requires live testing for operational confirmation.

## 3. Claim Audit

| `lumo.md` claim | Verdict | Evidence and qualification |
|---|---|---|
| Reasonix is cache-first by design | **Verified historically; still directionally current** | The v1 architecture pins an immutable prefix, appends history monotonically, and keeps volatile scratch out of the upstream prompt. Current docs still describe cache-aware context maintenance. [Project primary: https://github.com/esengine/DeepSeek-Reasonix/blob/v1/docs/ARCHITECTURE.md] [Project primary: https://github.com/esengine/deepseek-reasonix] |
| Reasonix reports ~99.8% cache hit | **Verified as a project report, not independently verified** | The project publishes a 99.82% token-weighted hit rate for 435M input tokens in one day. No raw request trace or provider export was located. [Project primary: https://github.com/esengine/DeepSeek-Reasonix] |
| Cost fell from ~$61 to ~$12 | **Verified as a project estimate; plausible, not reproducible from public evidence** | The figure is published with the same case. DeepSeek’s cache-hit discount makes the ratio plausible, but output cost, period pricing, and billing details are missing. [Project primary: https://github.com/esengine/DeepSeek-Reasonix] [Provider primary: https://api-docs.deepseek.com/news/news0802/] |
| Reasonix separately caches repository context, docs snippets, and intermediate reasoning | **Partially supported / overstated** | Stable prompt and append-only history are documented. A separate semantic object cache for these categories was not found; v1 volatile scratch is specifically kept out of the upstream prompt until distilled. [Project primary: https://github.com/esengine/DeepSeek-Reasonix/blob/v1/docs/ARCHITECTURE.md] |
| Reasonix is DeepSeek-only | **Historically verified; refuted as an unqualified current claim** | The v1 design explicitly rejected non-DeepSeek support. Current README documents configurable providers and OpenAI-compatible endpoints while remaining DeepSeek-native. [Project primary: https://github.com/esengine/DeepSeek-Reasonix/blob/v1/docs/ARCHITECTURE.md] [Project primary: https://github.com/esengine/deepseek-reasonix] |
| Pi has built-in prompt caching | **Partially verified** | Pi provider adapters expose cache retention, tool cache-control compatibility, session-affinity controls, and normalized cache usage. Providers own the actual caches. [Project primary: https://pi.dev/docs/latest/models] [Project primary: https://pi.dev/docs/latest/rpc] |
| Pi caches system prompts, tools, and static context provider-agnostically | **Overbroad** | Anthropic caches `tools → system → messages` using explicit/automatic breakpoints; DeepSeek automatically matches persisted prefixes. A common policy exists, not common wire semantics. [Provider primary: https://platform.claude.com/docs/en/build-with-claude/prompt-caching] [Provider primary: https://api-docs.deepseek.com/guides/kv_cache] |
| Official `pi-cache-optimizer` exists | **Existence verified; “official” refuted/ambiguous** | Version 2.8.0 was cataloged August 3, 2026, authored by `freescheme`, with source at `jiangge/pi-cache-optimizer`. Catalog inclusion is not evidence of Pi-core ownership. [Community package primary: https://pi.dev/packages/pi-cache-optimizer] [Community package primary: https://github.com/jiangge/pi-cache-optimizer] |
| Cached content can be shared among concurrent Pi agents | **Unknown and misleading without qualifiers** | Provider cache namespace, account, timing, and routing determine reuse. Anthropic states a first response must begin before concurrent requests can see a new entry. [Provider primary: https://platform.claude.com/docs/en/build-with-claude/prompt-caching] |
| Pi saves 70–90% on repetitive workloads | **Unsupported as a general claim** | No primary Pi benchmark supporting this range was located. Provider price ratios show possible savings, not realized Pi workload savings. |

## 4. Reasonix Cache Mechanics

Reasonix’s durable idea is prompt construction discipline, not a magical cache API:

1. Compute stable session material once and pin its identity.
2. Serialize the conversation and tool results in deterministic append order.
3. Keep volatile planning/scratch material out of the reusable prefix.
4. Compact or prune at explicit boundaries, accepting that a new prefix generation will warm separately.
5. Measure provider-reported cache-hit and miss tokens per turn and session.

These choices align with DeepSeek’s provider contract: caching is automatic, prefix-based, persisted in units, best-effort, and not guaranteed to hit. [Provider primary: https://api-docs.deepseek.com/guides/kv_cache]

## 5. Pi’s Actual Caching Surface

Pi is intentionally a small harness. Its core/provider layer already supplies:

- provider/model compatibility flags for cache retention, tool markers, and session affinity;
- normalized `cacheRead` and `cacheWrite` usage alongside token and cost totals;
- cache-aware compaction behavior for one-off summarization calls;
- extension hooks capable of inspecting/replacing the system prompt, observing messages and provider responses, registering commands, and persisting numeric state.

[Project primary: https://pi.dev/docs/latest/models] [Project primary: https://pi.dev/docs/latest/rpc] [Project primary: https://pi.dev/docs/latest/compaction] [Project primary: https://pi.dev/docs/latest/extensions]

This is provider-aware, not provider-neutral in the sense implied by `lumo.md`. DeepSeek needs stable prefixes but no markers; Anthropic supports explicit or automatic `cache_control`, TTLs, minimum lengths, breakpoint limits, and lookback rules. A safe extension must dispatch on actual adapter capabilities.

## 6. Existing Optimizer Overlap

`pi-cache-optimizer` already claims to:

- move uniquely identifiable stable prompt material ahead of dynamic context;
- compress skill listings and remove session-overview churn;
- request long retention only where compatible;
- add conservative `prompt_cache_key` fallback behavior;
- diagnose proxy routing and affinity gaps;
- collect numeric provider/model/session cache statistics;
- avoid storing prompts, payloads, headers, responses, or credentials.

[Community package primary: https://pi.dev/packages/pi-cache-optimizer]

Its documentation also states the correct limit: caching remains provider-side and best-effort. A competing plugin that implements only the bullets above would duplicate existing scope.

## 7. Feature-Gap Classification

| Feature named in `lumo.md` | Classification | Cache-plugin relevance |
|---|---|---|
| DeepSeek-native prefix discipline | **Real optimization surface, partly covered** by Pi adapters and optimizer | Core narrow scope |
| “Context Engine v2” | **Undefined label; functional absence largely refuted** by sessions and compaction | Only cache-aware compaction diagnostics belong |
| MCP first-class | **Absent from core; covered by packages** | Tool-schema stability matters; MCP transport does not belong |
| Plan mode | **Absent from core by design; extension-feasible** | Adjacent workflow, exclude |
| Checkpoints & rewind | **Conversation rewind/branching exists; filesystem rollback absent** | Exclude filesystem snapshots |
| Cost-control runtime | **Partly in core and optimizer** | Billing reconciliation and attribution are useful |
| Logging/monitoring | **Core usage plus package counters exist** | Extend only for proven missing metrics |
| Recovery & updates | **Package and session lifecycle exist; broad claim underspecified** | Exclude from cache scope |

Pi’s design principles explicitly list MCP and plan mode among features omitted from core but available through extensions/packages. [Project primary: https://pi.dev/docs/latest/usage]

## 8. Feasible Minimum Scope

The smallest credible product is a cache-discipline and observability companion with four responsibilities:

1. **Observe first:** fingerprint stable prompt regions and report churn sources without persisting prompt text.
2. **Capability diagnosis:** show the effective provider API, retention flags, affinity behavior, usage-field availability, and compaction boundaries.
3. **Guarded optimization:** opt-in deterministic normalization only for uniquely matched content; never mutate ambiguous or duplicated text.
4. **Measurement:** aggregate provider-reported input/cache-read/cache-write tokens by provider, model, session hash, and prefix generation; reconcile against a versioned price table or billing export.

This scope is feasible through documented Pi extension and provider surfaces. [Project primary: https://pi.dev/docs/latest/extensions]

## 9. Explicit Non-Goals

- No local KV cache or claim to control provider eviction.
- No universal cache marker across adapters.
- No MCP client, plan-mode framework, subagent manager, filesystem snapshot engine, or replacement session store.
- No raw prompt, response, header, or credential logging.
- No silent mutation by default.
- No savings promise derived from the Reasonix case or provider list pricing alone.

## 10. Rough Effort and Risk

These are planning estimates, not measured commitments:

| Workstream | Rough effort | Main uncertainty |
|---|---:|---|
| Audit existing optimizer source, tests, release provenance | 2–4 engineer-days | Code quality and hook coverage |
| Build repeatable A/B benchmark across DeepSeek + Anthropic + one OpenAI-compatible proxy | 3–7 engineer-days | Provider variance, cache warming, billing access |
| Contribute one bounded missing feature to existing package | 5–15 engineer-days | Upstream acceptance and adapter compatibility |
| Greenfield narrow multi-provider companion | 15–30 engineer-days | Final-wire visibility and long-tail providers |
| `lumo.md` all-in-one roadmap | 2–4 engineer-months minimum | Multiple independent products, security, recovery semantics |

The highest risks are silent behavioral changes from prompt rewriting, misleading attribution through routers, provider capability drift, cache namespace collisions, and confusing token hit rate with total cost savings.

## 11. Required Proof Before Implementation Approval

1. Pin Pi, optimizer, model, provider endpoint, and price-table versions.
2. Use at least three deterministic workload shapes: stable long system/tool prefix, growing tool-heavy conversation, and compaction boundary.
3. Run baseline and candidate with identical prompts, tool schemas, model settings, and request order.
4. Record provider-reported input, cache-read, cache-write, output, latency-to-first-token, total latency, errors, and final cost.
5. Segment results by cold/warm state, provider/model, prefix generation, session/affinity key, compaction, and concurrency.
6. Verify response/tool correctness, not only cache hits.
7. Repeat enough times to expose best-effort variance; report distributions rather than one headline rate.
8. Reconcile aggregate usage with provider billing before claiming savings.

## Eliminated Alternatives

- **All-in-one Reasonix parity plugin:** rejected because adjacent workflow features are independent products and several already exist.
- **Provider-neutral wire mutation:** rejected because DeepSeek and Anthropic cache activation rules differ materially.
- **New greenfield optimizer before auditing the existing package:** rejected as duplicate-risk.
- **Global cross-agent cache key:** rejected because namespace, isolation, attribution, and concurrency semantics are provider-dependent.
- **Headline savings target from one workload:** rejected because no general Pi benchmark supports 70–90%, and the Reasonix case is not independently reproducible.

## Divergence Map

- Saturated directions: Reasonix provenance, DeepSeek semantics, Pi core surface, optimizer existence, MCP/plan/session gaps.
- Pivots taken: historical-versus-current Reasonix scope; core-versus-package Pi capability; conversation rewind versus filesystem rollback.
- Remaining frontier: live source audit of `pi-cache-optimizer`, provider A/B measurement, and final-wire serialization tests.
- Council artifacts: none; divergent mode was not enabled.

## 12. Residual Open Questions

- Does the current optimizer preserve semantically equivalent system prompts byte-for-byte after every Pi provider adapter serializes them?
- Which exact cache hints and response fields survive common OpenAI-compatible proxies?
- Can the existing package’s benchmark and security test coverage support adoption without a fork?
- What minimum improvement over Pi core would justify ongoing maintenance?

## 13. Decision Inputs for Phase 2

Choose **adopt/contribute** if the source audit finds conservative mutations, coverage for the target providers, trustworthy data minimization, and a benchmarkable gap. Choose **fork** only when upstream direction blocks a required provider or safety contract. Choose **greenfield** only if the existing package cannot expose final-wire diagnostics or a needed cache-boundary API after a concrete proof-of-concept.

## 14. Source Reliability Notes

- DeepSeek and Anthropic pages are authoritative for provider behavior but not for Reasonix or Pi implementation quality.
- Reasonix repository text is authoritative for its intended architecture and self-reported case, not an independent benchmark.
- Pi documentation is authoritative for platform APIs and design boundaries.
- The optimizer catalog and repository are primary for its declared package behavior; declared behavior still requires source/test audit and live verification.
- Secondary articles and social reports were discovery pointers only and did not determine verdicts.

## 15. References

- [Provider primary] https://api-docs.deepseek.com/guides/kv_cache
- [Provider primary] https://api-docs.deepseek.com/news/news0802/
- [Provider primary] https://platform.claude.com/docs/en/build-with-claude/prompt-caching
- [Project primary] https://github.com/esengine/DeepSeek-Reasonix
- [Project primary, historical] https://github.com/esengine/DeepSeek-Reasonix/blob/v1/docs/ARCHITECTURE.md
- [Project primary, current spec] https://github.com/esengine/DeepSeek-Reasonix/blob/main-v2/docs/SPEC.md
- [Project primary] https://github.com/deepseek-ai/awesome-deepseek-agent/blob/main/docs/reasonix.md
- [Project primary] https://pi.dev/docs/latest
- [Project primary] https://pi.dev/docs/latest/usage
- [Project primary] https://pi.dev/docs/latest/models
- [Project primary] https://pi.dev/docs/latest/extensions
- [Project primary] https://pi.dev/docs/latest/sessions
- [Project primary] https://pi.dev/docs/latest/session-format
- [Project primary] https://pi.dev/docs/latest/compaction
- [Project primary] https://pi.dev/docs/latest/rpc
- [Community package primary] https://pi.dev/packages/pi-cache-optimizer
- [Community package primary] https://github.com/jiangge/pi-cache-optimizer
- [Community package primary] https://pi.dev/packages/pi-mcp-adapter

## 16. Convergence Report

- Stop reason: `maxIterationsReached`
- Total iterations: 20
- Questions answered: 6 / 6
- Remaining packet questions: 0; four implementation-validation questions carried forward
- Last three newInfoRatio values: 0.42, 0.39, 0.36
- Convergence threshold: 0.05
- Stop-policy behavior: no early synthesis; convergence was telemetry only
- Source diversity: provider docs, project docs/source, package catalog/source, and local claim/spec
- Graph gates: not applicable; no graph events were emitted

## 17. Lineage Conclusion

Reasonix demonstrates a valid cache-discipline pattern, but its headline workload does not establish a portable Pi savings target. Pi already owns the essential provider and extension primitives, and the community optimizer already occupies the obvious narrow feature space. The evidence supports evaluating and improving that package before building a new one.
