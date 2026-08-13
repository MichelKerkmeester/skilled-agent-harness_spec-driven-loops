# Reasonix vs Pi Prompt Caching Research

## 1. Executive Verdict

The research supports a narrow Pi cache-discipline and observability companion, preferably by auditing and improving the existing `pi-cache-optimizer` package before creating a competing plugin. It does not support a broad "Reasonix parity" implementation, a provider-agnostic cache engine, automatic cross-agent cache sharing, or any universal 70-90% savings promise.

The Reasonix architectural pattern is credible: stable prefixes, append-only context, and volatile scratch isolation align with DeepSeek prefix-cache mechanics. The headline Reasonix numbers are project-published workload claims, not independently reproducible public benchmarks. Pi already exposes provider-aware cache, usage, compaction, session, and extension primitives; the remaining useful feature gap is measurement, diagnostics, and safe prefix discipline.

## 2. Method

The run used three independent `cli-codex` lineages:

| Lineage | Model | Effort | Iterations | Status |
|---|---|---:|---:|---|
| `sol-high` | `gpt-5.6-sol` | high | 20 | fulfilled after targeted retry |
| `terra-max` | `gpt-5.6-terra` | max | 20 | fulfilled |
| `luna-max` | `gpt-5.6-luna` | max | 20 | fulfilled |

`--stop-policy=max-iterations` was applied. Convergence was telemetry only; every lineage wrote 20 iteration files and a lineage-local `research.md`.

## 3. Source Reliability Classes

- **Provider primary:** DeepSeek, Anthropic, OpenAI provider documentation for cache behavior, token accounting, and pricing semantics.
- **Project primary:** Reasonix and Pi documentation or source for their intended behavior.
- **Community package primary:** Pi package registry or package source for `pi-cache-optimizer` behavior.
- **Local assertion:** `lumo.md` and packet text; useful as claim targets, not proof.
- **Inference:** conclusions drawn across primary sources; requires live provider testing before product claims.

## 4. Claim Ledger

| Claim | Verdict | Evidence |
|---|---|---|
| Reasonix is cache-first by design | Verified historically and directionally current | Reasonix v1 documents immutable prefix, append-only history, and volatile scratch separation; current docs still emphasize cache-aware context. Sources cited by SOL and TERRA: `github.com/esengine/DeepSeek-Reasonix/blob/v1/docs/ARCHITECTURE.md`, `github.com/esengine/deepseek-reasonix`. |
| Reasonix reached about 99.8% cache hits | Verified only as a project-published report | SOL records 99.82% over 435M input tokens as a project claim; no raw provider export or independent benchmark was found. |
| Reasonix cost fell from about $61 to about $12 | Plausible project estimate, not independently reproduced | DeepSeek cache-hit discounts make the direction plausible, but public evidence lacks the full request trace, output-token share, price date, and billing reconciliation. |
| Reasonix is DeepSeek-only | Historically true; overstated as a current unconditional claim | v1 rejected non-DeepSeek support; current Reasonix docs describe configurable/OpenAI-compatible endpoints while remaining DeepSeek-native. |
| Pi has provider-agnostic prompt caching | Overbroad | Pi has provider-aware retention, cache markers, session affinity, compaction, and usage fields; provider wire semantics remain different. Sources cited by lineages: `pi.dev/docs/latest/models`, `pi.dev/docs/latest/rpc`, `pi.dev/docs/latest/compaction`. |
| `pi-cache-optimizer` exists | Verified as a community extension; official/core status not proven | All lineages found the package page and repository (`pi.dev/packages/pi-cache-optimizer`, `github.com/jiangge/pi-cache-optimizer`). Catalog inclusion is not proof of Pi-core ownership. |
| Cached content shares among concurrent Pi agents | Unsupported / conditional unknown | Provider namespace, account, model, serialized prefix, routing affinity, and first-response timing govern sharing. No reviewed Pi source proves automatic sharing. |
| Pi saves 70-90% on repetitive workloads | Unsupported as a general claim | Provider price ratios permit savings in compatible repetitive workloads, but no primary Pi benchmark proves this range. |
| Pi lacks Context Engine v2, MCP, plan mode, and checkpoint/rewind | Mixed | Pi already has sessions, branches, compaction, extensions, and package-level capabilities; MCP and plan mode are intentionally outside core; filesystem rewind is not a cache-plugin requirement. |

## 5. Reasonix Cache Mechanics

Reasonix's durable lesson is prompt-construction discipline, not transferable control over a provider KV cache:

- keep a stable, deterministic prefix;
- append conversation/tool history monotonically where possible;
- isolate volatile scratch from reusable prefix material;
- compact only at explicit generation boundaries;
- measure provider-reported cache-read/cache-write/miss tokens per turn.

This matches DeepSeek's prefix-cache behavior: cache reuse depends on matching persisted prefixes and remains provider-side and best-effort.

## 6. Pi's Actual Caching Surface

Pi appears to expose enough primitives for diagnostics and guarded optimization:

- provider/model compatibility flags for cache retention and cache-control behavior;
- session affinity and provider routing concerns;
- normalized usage fields such as cache read/write where adapters expose them;
- compaction hooks and session tree behavior;
- extension hooks around agent startup, provider request/headers/response, compaction, and session navigation.

This is not a universal Pi-owned cache. A safe plugin must branch on provider/model capability and preserve provider-specific semantics.

## 7. Existing Optimizer Overlap

The existing `pi-cache-optimizer` package reportedly already targets the obvious narrow scope: stable-before-dynamic prompt ordering, compatibility diagnostics, cache-key fallback behavior, session/proxy affinity warnings, local stats, and data minimization. That makes greenfield duplication risky unless a source audit proves the package unsafe, unmaintained, or missing required final-wire diagnostics.

## 8. Feature Gap Table

| Feature named in `lumo.md` | Classification | Cache-plugin decision |
|---|---|---|
| DeepSeek-native prefix discipline | Real, partly covered | Include as observe-first diagnostics and opt-in normalization. |
| Context Engine v2 | Undefined / mostly covered by Pi session + compaction primitives | Exclude as a named product unless separately specified. |
| MCP first-class support | Outside Pi core but package/extension feasible | Exclude from cache plugin. |
| Plan mode | Outside core by design, extension-feasible | Exclude from cache plugin. |
| Checkpoints and rewind | Conversation branching exists; filesystem rollback not proven | Exclude from cache plugin. |
| Cost-control runtime | Partly covered by provider usage and optimizer counters | Include measured attribution only. |
| Logging and monitoring | Partly present | Include cache-specific telemetry only. |
| Recovery and updates | Broad and underspecified | Exclude. |

## 9. Feasible Minimum Scope

The smallest credible Phase 2 target is an observe-first companion with four responsibilities:

1. fingerprint stable and volatile prompt regions without storing raw prompts;
2. report prefix churn, provider capability, cache-control support, proxy limitations, and route affinity risks;
3. aggregate provider-reported input/cache-read/cache-write/output tokens, latency, errors, and cost by provider/model/session/prefix generation;
4. optionally normalize stable prompt ordering only when the content is uniquely identifiable and provider compatibility is known.

## 10. Required Proof Before Implementation

- Pin Pi, `pi-cache-optimizer`, provider endpoint, model, package, and price-table versions.
- Run paired baseline/optimized workloads with identical prompts, tool schemas, model settings, and request order.
- Cover repeated stable prefixes, growing tool-heavy conversations, compaction boundaries, model/provider switches, proxy failures, and concurrent namespaces.
- Record provider-reported cache-read/cache-write/miss/input/output tokens, latency-to-first-token, total latency, errors, and reconciled cost.
- Treat cache eligibility as unknown when the provider or proxy does not expose enough signal.

## 11. Eliminated Alternatives

- **Reasonix parity plugin:** rejected because MCP, plan mode, context engine, and filesystem rewind are separate products.
- **Provider-neutral cache engine:** rejected because DeepSeek, Anthropic, and OpenAI-compatible providers use different activation and accounting semantics.
- **Greenfield optimizer before source audit:** rejected because a community optimizer already exists.
- **Guaranteed cross-agent sharing:** rejected because namespace, routing, privacy, and attribution are provider-dependent.
- **Savings headline from Reasonix:** rejected because the Reasonix report is not a portable Pi benchmark.

## Divergence Map

- **Agreement:** all lineages recommend a narrow observe-first cache-discipline/telemetry scope and reject broad parity claims.
- **SOL emphasis:** `pi-cache-optimizer` may already implement most of the useful scope; audit/adopt before greenfield.
- **TERRA emphasis:** build only where provider route, cache eligibility, and accounting can be observed and controlled.
- **LUNA emphasis:** default to observe-only; prompt mutation is medium risk and must be opt-in.
- **Remaining frontier:** pinned source audit of `pi-cache-optimizer`, controlled A/B measurement, final-wire serialization checks, and provider/proxy affinity validation.

## 12. Open Questions

- Does `pi-cache-optimizer` preserve provider-serialized prompts safely across Pi versions and adapters?
- Which target provider routes expose trustworthy cached-token accounting through Pi?
- Does proxy/session affinity preserve cache namespace reuse under realistic concurrency?
- What measured savings, if any, occur on the actual target workload after output tokens and latency are included?

## 13. Decision Inputs For Phase 2

Recommendation: conditional GO for a source audit and controlled benchmark of the existing optimizer. Choose greenfield only if that audit finds a concrete missing capability that cannot be contributed upstream, such as final-wire diagnostics or safe provider-specific cache-boundary reporting.

## 14. Source Reliability Notes

DeepSeek, Anthropic, OpenAI, and Pi docs are primary for their own provider/platform behavior. Reasonix project docs are primary for Reasonix design and self-reported outcomes, not independent performance proof. Pi package pages and package repositories are primary for package existence and declared behavior, not proof of security or maintenance quality.

## 15. References

- `research/lineages/sol-high/research.md`
- `research/lineages/terra-max/research.md`
- `research/lineages/luna-max/research.md`
- `research/fanout-attribution.md`
- `research/resource-map.md`
- DeepSeek KV cache docs: `https://api-docs.deepseek.com/guides/kv_cache`
- DeepSeek pricing/news cited by lineages: `https://api-docs.deepseek.com/news/news0802/`, `https://api-docs.deepseek.com/quick_start/pricing-details-us`
- Anthropic prompt caching docs: `https://platform.claude.com/docs/en/build-with-claude/prompt-caching`
- Reasonix repositories cited by lineages: `https://github.com/esengine/DeepSeek-Reasonix`, `https://github.com/esengine/deepseek-reasonix`
- Pi docs cited by lineages: `https://pi.dev/docs/latest`, `https://pi.dev/docs/latest/models`, `https://pi.dev/docs/latest/extensions`, `https://pi.dev/docs/latest/compaction`, `https://pi.dev/docs/latest/sessions`, `https://pi.dev/docs/latest/rpc`
- Pi optimizer package/repo: `https://pi.dev/packages/pi-cache-optimizer`, `https://github.com/jiangge/pi-cache-optimizer`

## 16. Convergence Report

- Stop reason: `maxIterationsReached`
- Total iterations: 60 across 3 lineages
- Lineage iteration counts: `sol-high=20`, `terra-max=20`, `luna-max=20`
- Convergence threshold: `0.05`
- Stop policy: `max-iterations`; early convergence was not allowed to halt the run
- Merge result: 3 lineages merged, 101 key findings, `terra-max` non-canonical `findings` key coerced to `keyFindings`
- Runtime notes: `sol-high` first attempt refused Codex self-invocation before writing artifacts; targeted retry through the fan-out runner fulfilled. Timestamp-window warnings were emitted for all successful lineages and should be treated as telemetry warnings, not missing-artifact failures.

## 17. Research Conclusion

Reasonix validates a cache-discipline pattern but not a transferable Pi savings promise. Pi already has enough primitives and package ecosystem overlap that Phase 2 should audit, benchmark, and possibly improve `pi-cache-optimizer` rather than build an all-in-one Reasonix-style clone.
