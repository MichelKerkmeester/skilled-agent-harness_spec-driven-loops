---
title: "Deep Research Strategy — Luna Max"
description: "Reducer-owned strategy for the detached Luna research lineage."
contextType: research
---

# Deep Research Strategy — Luna Max

## 1. TOPIC

Verify the `lumo.md` Reasonix vs Pi prompt-caching claims and scope feasibility of a Reasonix-style Pi caching plugin.

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [x] Are the Reasonix ~99.8% cache-hit and ~$61→$12 cost claims independently documented and reproducible?
- [x] What prompt-caching behavior does Pi actually implement, and what do DeepSeek and Anthropic expose?
- [x] Does an official or verifiable `pi-cache-optimizer` extension exist, and what does Pi's extension surface permit?
- [x] Which claimed Pi feature gaps are real, and what is the smallest feasible Reasonix-style plugin scope?

<!-- /ANCHOR:key-questions -->

## 3. NON-GOALS

- Do not implement or prototype a Pi plugin.
- Do not decide the Phase 2 GO/NO-GO; provide evidence and feasibility bounds only.
- Do not modify Pi, Reasonix, cli-pi, or runtime code.
- Do not mutate the parent spec, other lineages, or any path outside this lineage directory.

## 4. STOP CONDITIONS

- Run exactly 20 iterations; convergence is telemetry only.
- Every iteration must produce cited findings, a JSONL record, and a delta file.
- Synthesize only after iteration 20, preserving unknowns and ruled-out directions.

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- Are the Reasonix ~99.8% cache-hit and ~$61→$12 cost claims independently documented and reproducible?
- What prompt-caching behavior does Pi actually implement, and what do DeepSeek and Anthropic expose?
- Does an official or verifiable `pi-cache-optimizer` extension exist, and what does Pi's extension surface permit?
- Which claimed Pi feature gaps are real, and what is the smallest feasible Reasonix-style plugin scope?

<!-- /ANCHOR:answered-questions -->

<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- Reading the local claim source beside primary project documentation exposed which statements were quotations of project claims versus general conclusions. (iteration 1)
- Comparing the project architecture with the official provider guide separated application policy from provider behavior. (iteration 2)
- Recasting the claim as a token-and-cost ledger prevented the hit-rate percentage from being treated as a savings percentage. (iteration 3)
- The official guide provides concrete A+B versus A+B+C examples and usage fields instead of relying on marketing language. (iteration 4)
- Reading the model and extension docs together shows where a plugin should observe or coordinate rather than duplicate core behavior. (iteration 5)
- Provider docs plus Pi's compatibility table exposed the exact adapter boundary. (iteration 6)
- Comparing OpenAI's API reference with Pi's compatibility fields made the forwarding boundary concrete. (iteration 7)
- Package metadata and repository README jointly answered the existence question and exposed the first-party boundary. (iteration 8)
- Reading the lifecycle order and mutability rules together clarifies where a cache policy can observe without replacing provider serialization. (iteration 9)
- Combining session docs with provider affinity controls exposed the missing namespace and routing assumptions. (iteration 10)
- The official compaction page exposes both behavior and extension interception points in one place. (iteration 11)
- Official usage and RPC docs make the protocol distinction explicit. (iteration 12)
- Official usage plus package catalog pages provide the needed core-versus-package distinction. (iteration 13)
- Session and compaction docs establish the native lifecycle events; the package page establishes the community implementation. (iteration 14)
- Cross-provider usage docs plus Pi lifecycle docs define a bounded diagnostics model. (iteration 15)
- Pi release notes and provider usage docs identify concrete counters beyond wall-clock timing. (iteration 16)
- Provider compatibility docs and the existing package's warnings expose real failure modes rather than hypothetical abstractions. (iteration 17)
- The prior gap and failure analysis removed unrelated workflow features from the cache design. (iteration 18)
- Classifying by API boundary and test dependency prevents unsupported implementation promises. (iteration 19)
- An adversarial ledger prevents project self-reports and ecosystem package claims from being promoted to provider guarantees. (iteration 20)

<!-- /ANCHOR:what-worked -->

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- No independent request log or billing export is published with the Reasonix report. (iteration 1)
- The public docs do not expose a portable cache object or a provider-neutral serialization contract. (iteration 2)
- Public documentation does not include the raw usage ledger behind the reported day. (iteration 3)
- Provider eviction and routing behavior cannot be established from client documentation alone. (iteration 4)
- The docs do not promise one normalized cache-counter schema across providers. (iteration 5)
- No common provider-neutral cache API is documented. (iteration 6)
- Provider-specific headers cannot be validated without an actual gateway or model request. (iteration 7)
- Package documentation alone cannot establish production reliability or long-term compatibility. (iteration 8)
- The generic response hook does not establish one cross-provider hit counter. (iteration 9)
- No public source proves cross-agent shared hits under concurrent mutable requests. (iteration 10)
- Documentation cannot show the cache-rate impact of custom summaries. (iteration 11)
- Package ecosystem quality cannot be inferred from core documentation. (iteration 12)
- No cache-specific behavior is exposed by plan-mode packages. (iteration 13)
- No source measures provider cache reuse after a restored session. (iteration 14)
- No common usage schema exists, so normalization must preserve raw provider fields. (iteration 15)
- No public paired run validates the lumo target values. (iteration 16)
- Proxy behavior remains unobservable until a real endpoint is exercised. (iteration 17)
- Documentation cannot choose between adopting the existing community package and creating a separate one. (iteration 18)
- The public package page cannot answer maintenance, compatibility, or benchmark questions. (iteration 19)
- The remaining questions require live provider traffic, package source review, and controlled billing evidence unavailable in read-only research. (iteration 20)

<!-- /ANCHOR:what-failed -->

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### A generic TTL field independent of provider adapter configuration would conceal billing and expiration differences rather than solve them. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: A generic TTL field independent of provider adapter configuration would conceal billing and expiration differences rather than solve them.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A generic TTL field independent of provider adapter configuration would conceal billing and expiration differences rather than solve them.

### A global cache namespace shared by all projects and agents is a dead end for correctness and privacy; sharing must be explicit and scoped. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: A global cache namespace shared by all projects and agents is a dead end for correctness and privacy; sharing must be explicit and scoped.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A global cache namespace shared by all projects and agents is a dead end for correctness and privacy; sharing must be explicit and scoped.

### A GO decision based only on the lumo percentages is ruled out; live provider benchmarks and a package/source audit remain prerequisites. -- BLOCKED (iteration 20, 1 attempts)
- What was tried: A GO decision based only on the lumo percentages is ruled out; live provider benchmarks and a package/source audit remain prerequisites.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A GO decision based only on the lumo percentages is ruled out; live provider benchmarks and a package/source audit remain prerequisites.

### A latency-only benchmark is insufficient; cache reads can alter cost and input processing without mapping cleanly to end-to-end latency. -- BLOCKED (iteration 16, 1 attempts)
- What was tried: A latency-only benchmark is insufficient; cache reads can alter cost and input processing without mapping cleanly to end-to-end latency.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A latency-only benchmark is insufficient; cache reads can alter cost and input processing without mapping cleanly to end-to-end latency.

### A monolithic “Context Engine v2” that owns Pi session persistence, MCP, plan mode, rewind, provider adapters, and cache state is ruled out as an unnecessarily broad scope. -- BLOCKED (iteration 18, 1 attempts)
- What was tried: A monolithic “Context Engine v2” that owns Pi session persistence, MCP, plan mode, rewind, provider adapters, and cache state is ruled out as an unnecessarily broad scope.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A monolithic “Context Engine v2” that owns Pi session persistence, MCP, plan mode, rewind, provider adapters, and cache state is ruled out as an unnecessarily broad scope.

### A plugin-level guarantee of cache persistence or a 100% hit rate is ruled out by DeepSeek's best-effort eviction contract. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: A plugin-level guarantee of cache persistence or a 100% hit rate is ruled out by DeepSeek's best-effort eviction contract.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A plugin-level guarantee of cache persistence or a 100% hit rate is ruled out by DeepSeek's best-effort eviction contract.

### A portable implementation that assumes all providers accept the same cache marker, retention policy, or prefix semantics is ruled out by Reasonix's DeepSeek-specific architecture and Pi's provider-specific configuration fields. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: A portable implementation that assumes all providers accept the same cache marker, retention policy, or prefix semantics is ruled out by Reasonix's DeepSeek-specific architecture and Pi's provider-specific configuration fields.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A portable implementation that assumes all providers accept the same cache marker, retention policy, or prefix semantics is ruled out by Reasonix's DeepSeek-specific architecture and Pi's provider-specific configuration fields.

### A provider-agnostic claim that all Pi models share one cache protocol is unsupported. The documented fields explicitly vary by provider API and model compatibility. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: A provider-agnostic claim that all Pi models share one cache protocol is unsupported. The documented fields explicitly vary by provider API and model compatibility.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A provider-agnostic claim that all Pi models share one cache protocol is unsupported. The documented fields explicitly vary by provider API and model compatibility.

### A single “works on DeepSeek” smoke test is insufficient for the proposed provider-agnostic wording and would not test Pi's Anthropic/OpenAI compatibility paths. -- BLOCKED (iteration 19, 1 attempts)
- What was tried: A single “works on DeepSeek” smoke test is insufficient for the proposed provider-agnostic wording and would not test Pi's Anthropic/OpenAI compatibility paths.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A single “works on DeepSeek” smoke test is insufficient for the proposed provider-agnostic wording and would not test Pi's Anthropic/OpenAI compatibility paths.

### A universal “Reasonix for Pi” implementation that promises raw KV reuse, guaranteed cross-provider sharing, or guaranteed savings is unsupported by every primary provider contract reviewed. -- BLOCKED (iteration 20, 1 attempts)
- What was tried: A universal “Reasonix for Pi” implementation that promises raw KV reuse, guaranteed cross-provider sharing, or guaranteed savings is unsupported by every primary provider contract reviewed.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A universal “Reasonix for Pi” implementation that promises raw KV reuse, guaranteed cross-provider sharing, or guaranteed savings is unsupported by every primary provider contract reviewed.

### A web search cannot reconstruct the missing request-level accounting. Only provider usage data or a controlled replay can close that gap. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: A web search cannot reconstruct the missing request-level accounting. Only provider usage data or a controlled replay can close that gap.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A web search cannot reconstruct the missing request-level accounting. Only provider usage data or a controlled replay can close that gap.

### Adding git snapshot/restore logic to the first cache-plugin scope is ruled out. -- BLOCKED (iteration 14, 1 attempts)
- What was tried: Adding git snapshot/restore logic to the first cache-plugin scope is ruled out.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Adding git snapshot/restore logic to the first cache-plugin scope is ruled out.

### Approving the lumo roadmap's time/overhead targets as commitments is ruled out; no implementation estimate or benchmark evidence was found in the reviewed sources. -- BLOCKED (iteration 19, 1 attempts)
- What was tried: Approving the lumo roadmap's time/overhead targets as commitments is ruled out; no implementation estimate or benchmark evidence was found in the reviewed sources.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Approving the lumo roadmap's time/overhead targets as commitments is ruled out; no implementation estimate or benchmark evidence was found in the reviewed sources.

### Assuming that one `prompt_cache_key` works across providers, models, or proxies is ruled out; the key is defined by the OpenAI-compatible API and Pi only forwards provider-specific configuration. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: Assuming that one `prompt_cache_key` works across providers, models, or proxies is ruled out; the key is defined by the OpenAI-compatible API and Pi only forwards provider-specific configuration.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Assuming that one `prompt_cache_key` works across providers, models, or proxies is ruled out; the key is defined by the OpenAI-compatible API and Pi only forwards provider-specific configuration.

### Assuming that Pi session persistence alone makes concurrent agents share provider cache state is ruled out. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: Assuming that Pi session persistence alone makes concurrent agents share provider cache state is ruled out.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Assuming that Pi session persistence alone makes concurrent agents share provider cache state is ruled out.

### Claiming that Pi lacks any native context engine or compaction path is ruled out by the official compaction documentation. -- BLOCKED (iteration 11, 1 attempts)
- What was tried: Claiming that Pi lacks any native context engine or compaction path is ruled out by the official compaction documentation.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Claiming that Pi lacks any native context engine or compaction path is ruled out by the official compaction documentation.

### Describing plan mode as unavailable in the Pi ecosystem is ruled out; it is available through packages even though it is not core. -- BLOCKED (iteration 13, 1 attempts)
- What was tried: Describing plan mode as unavailable in the Pi ecosystem is ruled out; it is available through packages even though it is not core.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Describing plan mode as unavailable in the Pi ecosystem is ruled out; it is available through packages even though it is not core.

### Early synthesis before iteration 20 is ruled out by the max-iterations policy; the observed convergence telemetry never changed the stop policy. -- BLOCKED (iteration 20, 1 attempts)
- What was tried: Early synthesis before iteration 20 is ruled out by the max-iterations policy; the observed convergence telemetry never changed the stop policy.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Early synthesis before iteration 20 is ruled out by the max-iterations policy; the observed convergence telemetry never changed the stop policy.

### Implementing a client-side KV cache through ordinary Pi extension hooks is ruled out; the hooks operate on prompts, payloads, headers, and responses, not model-internal tensors. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: Implementing a client-side KV cache through ordinary Pi extension hooks is ruled out; the hooks operate on prompts, payloads, headers, and responses, not model-internal tensors.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Implementing a client-side KV cache through ordinary Pi extension hooks is ruled out; the hooks operate on prompts, payloads, headers, and responses, not model-internal tensors.

### Importing or coupling directly to another router/package's internal globals is a dead end for a durable plugin; use documented Pi hooks and optional versioned integrations only. -- BLOCKED (iteration 18, 1 attempts)
- What was tried: Importing or coupling directly to another router/package's internal globals is a dead end for a durable plugin; use documented Pi hooks and optional versioned integrations only.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Importing or coupling directly to another router/package's internal globals is a dead end for a durable plugin; use documented Pi hooks and optional versioned integrations only.

### Including MCP as a required dependency of the caching plugin is ruled out for the minimal scope. -- BLOCKED (iteration 12, 1 attempts)
- What was tried: Including MCP as a required dependency of the caching plugin is ruled out for the minimal scope.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Including MCP as a required dependency of the caching plugin is ruled out for the minimal scope.

### Inferring an 80.3% cost saving directly from a 99.82% cache-hit ratio is ruled out; the variables do not match and the published report omits the required ledger. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Inferring an 80.3% cost saving directly from a 99.82% cache-hit ratio is ruled out; the variables do not match and the published report omits the required ledger.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Inferring an 80.3% cost saving directly from a 99.82% cache-hit ratio is ruled out; the variables do not match and the published report omits the required ledger.

### Logging complete prompts as cache keys is a privacy and storage dead end. A production plugin should hash or structurally summarize stable sections and make raw logging opt-in. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: Logging complete prompts as cache keys is a privacy and storage dead end. A production plugin should hash or structurally summarize stable sections and make raw logging opt-in.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Logging complete prompts as cache keys is a privacy and storage dead end. A production plugin should hash or structurally summarize stable sections and make raw logging opt-in.

### Making plan mode a dependency of the caching plugin is ruled out. -- BLOCKED (iteration 13, 1 attempts)
- What was tried: Making plan mode a dependency of the caching plugin is ruled out.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Making plan mode a dependency of the caching plugin is ruled out.

### Measuring cache performance through rewind features alone is a dead end; rewind changes history and files but supplies no provider cache usage evidence. -- BLOCKED (iteration 14, 1 attempts)
- What was tried: Measuring cache performance through rewind features alone is a dead end; rewind changes history and files but supplies no provider cache usage evidence.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Measuring cache performance through rewind features alone is a dead end; rewind changes history and files but supplies no provider cache usage evidence.

### No public Reasonix document exposes a client-side KV store that could be transplanted into Pi; pursuing raw KV reuse would exceed the documented API boundary. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: No public Reasonix document exposes a client-side KV store that could be transplanted into Pi; pursuing raw KV reuse would exceed the documented API boundary.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No public Reasonix document exposes a client-side KV store that could be transplanted into Pi; pursuing raw KV reuse would exceed the documented API boundary.

### Persisting full prompt text in a cache ledger is a dead end for privacy and storage; fingerprints and counters are sufficient for first-pass diagnostics. -- BLOCKED (iteration 15, 1 attempts)
- What was tried: Persisting full prompt text in a cache ledger is a dead end for privacy and storage; fingerprints and counters are sufficient for first-pass diagnostics.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Persisting full prompt text in a cache ledger is a dead end for privacy and storage; fingerprints and counters are sufficient for first-pass diagnostics.

### Rebuilding the same stable-prefix and footer-stat features without first auditing the existing package would duplicate an available implementation. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: Rebuilding the same stable-prefix and footer-stat features without first auditing the existing package would duplicate an available implementation.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Rebuilding the same stable-prefix and footer-stat features without first auditing the existing package would duplicate an available implementation.

### Reimplementing provider cache markers in a plugin's first version is ruled out; Pi already owns provider-specific cache-control serialization and retention settings. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Reimplementing provider cache markers in a plugin's first version is ruled out; Pi already owns provider-specific cache-control serialization and retention settings.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Reimplementing provider cache markers in a plugin's first version is ruled out; Pi already owns provider-specific cache-control serialization and retention settings.

### Replacing Pi's compaction implementation solely to improve cache reuse is a dead end until a controlled benchmark shows the native path causes material cache loss. -- BLOCKED (iteration 11, 1 attempts)
- What was tried: Replacing Pi's compaction implementation solely to improve cache reuse is a dead end until a controlled benchmark shows the native path causes material cache loss.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Replacing Pi's compaction implementation solely to improve cache reuse is a dead end until a controlled benchmark shows the native path causes material cache loss.

### Retrying every miss with a modified payload is a dead end: it can double cost and alter model behavior while still not guaranteeing a cache hit. -- BLOCKED (iteration 17, 1 attempts)
- What was tried: Retrying every miss with a modified payload is a dead end: it can double cost and alter model behavior while still not guaranteeing a cache hit.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Retrying every miss with a modified payload is a dead end: it can double cost and alter model behavior while still not guaranteeing a cache hit.

### Search-result snippets alone cannot establish cache semantics or first-party ownership; they were retained only as discovery pointers. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Search-result snippets alone cannot establish cache semantics or first-party ownership; they were retained only as discovery pointers.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Search-result snippets alone cannot establish cache semantics or first-party ownership; they were retained only as discovery pointers.

### Searching RPC docs for cache-sharing primitives is a dead end; RPC transports agent control messages and does not define provider prompt caching. -- BLOCKED (iteration 12, 1 attempts)
- What was tried: Searching RPC docs for cache-sharing primitives is a dead end; RPC transports agent control messages and does not define provider prompt caching.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Searching RPC docs for cache-sharing primitives is a dead end; RPC transports agent control messages and does not define provider prompt caching.

### Silent automatic mutation of unsupported provider payloads is ruled out as a safe default. -- BLOCKED (iteration 17, 1 attempts)
- What was tried: Silent automatic mutation of unsupported provider payloads is ruled out as a safe default.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Silent automatic mutation of unsupported provider payloads is ruled out as a safe default.

### The assertion that `pi-cache-optimizer` is an official Pi feature is ruled out by the package's listed author and package-level presentation. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: The assertion that `pi-cache-optimizer` is an official Pi feature is ruled out by the package's listed author and package-level presentation.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The assertion that `pi-cache-optimizer` is an official Pi feature is ruled out by the package's listed author and package-level presentation.

### The claim that Reasonix's published metrics are already an independent benchmark is ruled out; the available evidence is a project README report without request traces, model configuration, or a reproducible baseline. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: The claim that Reasonix's published metrics are already an independent benchmark is ruled out; the available evidence is a project README report without request traces, model configuration, or a reproducible baseline.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The claim that Reasonix's published metrics are already an independent benchmark is ruled out; the available evidence is a project README report without request traces, model configuration, or a reproducible baseline.

### Treating “Pi has RPC” as evidence that Pi has first-party MCP is ruled out. -- BLOCKED (iteration 12, 1 attempts)
- What was tried: Treating “Pi has RPC” as evidence that Pi has first-party MCP is ruled out.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating “Pi has RPC” as evidence that Pi has first-party MCP is ruled out.

### Treating a cache miss as a correctness failure is ruled out; misses are normal provider behavior and must remain observable without blocking the request. -- BLOCKED (iteration 17, 1 attempts)
- What was tried: Treating a cache miss as a correctness failure is ruled out; misses are normal provider behavior and must remain observable without blocking the request.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating a cache miss as a correctness failure is ruled out; misses are normal provider behavior and must remain observable without blocking the request.

### Treating Anthropic `cache_control` and DeepSeek implicit prefix reuse as interchangeable mechanisms is ruled out. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Treating Anthropic `cache_control` and DeepSeek implicit prefix reuse as interchangeable mechanisms is ruled out.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating Anthropic `cache_control` and DeepSeek implicit prefix reuse as interchangeable mechanisms is ruled out.

### Treating cache keys as an API-controlled object is a dead end for native DeepSeek caching; the documented interface is the serialized prompt plus response usage counters. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Treating cache keys as an API-controlled object is a dead end for native DeepSeek caching; the documented interface is the serialized prompt plus response usage counters.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating cache keys as an API-controlled object is a dead end for native DeepSeek caching; the documented interface is the serialized prompt plus response usage counters.

### Treating footer counters or a single session's hit percentage as proof of cost savings is ruled out without provider usage and price reconciliation. -- BLOCKED (iteration 16, 1 attempts)
- What was tried: Treating footer counters or a single session's hit percentage as proof of cost savings is ruled out without provider usage and price reconciliation.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating footer counters or a single session's hit percentage as proof of cost savings is ruled out without provider usage and price reconciliation.

### Treating one cumulative session hit rate as sufficient performance evidence is ruled out; rates must be segmented by prefix generation, provider, model, and cache namespace. -- BLOCKED (iteration 15, 1 attempts)
- What was tried: Treating one cumulative session hit rate as sufficient performance evidence is ruled out; rates must be segmented by prefix generation, provider, model, and cache namespace.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating one cumulative session hit rate as sufficient performance evidence is ruled out; rates must be segmented by prefix generation, provider, model, and cache namespace.

### Treating Pi's native `/tree` and session branching as filesystem checkpoint/rewind is ruled out. -- BLOCKED (iteration 14, 1 attempts)
- What was tried: Treating Pi's native `/tree` and session branching as filesystem checkpoint/rewind is ruled out.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating Pi's native `/tree` and session branching as filesystem checkpoint/rewind is ruled out.

### Treating session affinity as evidence of cache sharing is a dead end. Affinity affects routing and may improve locality, but cache reuse still depends on the serialized prompt and provider policy. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: Treating session affinity as evidence of cache sharing is a dead end. Affinity affects routing and may improve locality, but cache reuse still depends on the serialized prompt and provider policy.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating session affinity as evidence of cache sharing is a dead end. Affinity affects routing and may improve locality, but cache reuse still depends on the serialized prompt and provider policy.

### Using plan-mode package features as evidence of prompt-cache behavior is a category error; the package controls tool permissions and workflow, not provider caching. -- BLOCKED (iteration 13, 1 attempts)
- What was tried: Using plan-mode package features as evidence of prompt-cache behavior is a category error; the package controls tool permissions and workflow, not provider caching.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Using plan-mode package features as evidence of prompt-cache behavior is a category error; the package controls tool permissions and workflow, not provider caching.

<!-- /ANCHOR:exhausted-approaches -->

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- Search-result snippets alone cannot establish cache semantics or first-party ownership; they were retained only as discovery pointers. (iteration 1)
- The claim that Reasonix's published metrics are already an independent benchmark is ruled out; the available evidence is a project README report without request traces, model configuration, or a reproducible baseline. (iteration 1)
- A portable implementation that assumes all providers accept the same cache marker, retention policy, or prefix semantics is ruled out by Reasonix's DeepSeek-specific architecture and Pi's provider-specific configuration fields. (iteration 2)
- No public Reasonix document exposes a client-side KV store that could be transplanted into Pi; pursuing raw KV reuse would exceed the documented API boundary. (iteration 2)
- A web search cannot reconstruct the missing request-level accounting. Only provider usage data or a controlled replay can close that gap. (iteration 3)
- Inferring an 80.3% cost saving directly from a 99.82% cache-hit ratio is ruled out; the variables do not match and the published report omits the required ledger. (iteration 3)
- A plugin-level guarantee of cache persistence or a 100% hit rate is ruled out by DeepSeek's best-effort eviction contract. (iteration 4)
- Treating cache keys as an API-controlled object is a dead end for native DeepSeek caching; the documented interface is the serialized prompt plus response usage counters. (iteration 4)
- A provider-agnostic claim that all Pi models share one cache protocol is unsupported. The documented fields explicitly vary by provider API and model compatibility. (iteration 5)
- Reimplementing provider cache markers in a plugin's first version is ruled out; Pi already owns provider-specific cache-control serialization and retention settings. (iteration 5)
- A generic TTL field independent of provider adapter configuration would conceal billing and expiration differences rather than solve them. (iteration 6)
- Treating Anthropic `cache_control` and DeepSeek implicit prefix reuse as interchangeable mechanisms is ruled out. (iteration 6)
- Assuming that one `prompt_cache_key` works across providers, models, or proxies is ruled out; the key is defined by the OpenAI-compatible API and Pi only forwards provider-specific configuration. (iteration 7)
- Treating session affinity as evidence of cache sharing is a dead end. Affinity affects routing and may improve locality, but cache reuse still depends on the serialized prompt and provider policy. (iteration 7)
- Rebuilding the same stable-prefix and footer-stat features without first auditing the existing package would duplicate an available implementation. (iteration 8)
- The assertion that `pi-cache-optimizer` is an official Pi feature is ruled out by the package's listed author and package-level presentation. (iteration 8)
- Implementing a client-side KV cache through ordinary Pi extension hooks is ruled out; the hooks operate on prompts, payloads, headers, and responses, not model-internal tensors. (iteration 9)
- Logging complete prompts as cache keys is a privacy and storage dead end. A production plugin should hash or structurally summarize stable sections and make raw logging opt-in. (iteration 9)
- A global cache namespace shared by all projects and agents is a dead end for correctness and privacy; sharing must be explicit and scoped. (iteration 10)
- Assuming that Pi session persistence alone makes concurrent agents share provider cache state is ruled out. (iteration 10)
- Claiming that Pi lacks any native context engine or compaction path is ruled out by the official compaction documentation. (iteration 11)
- Replacing Pi's compaction implementation solely to improve cache reuse is a dead end until a controlled benchmark shows the native path causes material cache loss. (iteration 11)
- Including MCP as a required dependency of the caching plugin is ruled out for the minimal scope. (iteration 12)
- Searching RPC docs for cache-sharing primitives is a dead end; RPC transports agent control messages and does not define provider prompt caching. (iteration 12)
- Treating “Pi has RPC” as evidence that Pi has first-party MCP is ruled out. (iteration 12)
- Describing plan mode as unavailable in the Pi ecosystem is ruled out; it is available through packages even though it is not core. (iteration 13)
- Making plan mode a dependency of the caching plugin is ruled out. (iteration 13)
- Using plan-mode package features as evidence of prompt-cache behavior is a category error; the package controls tool permissions and workflow, not provider caching. (iteration 13)
- Adding git snapshot/restore logic to the first cache-plugin scope is ruled out. (iteration 14)
- Measuring cache performance through rewind features alone is a dead end; rewind changes history and files but supplies no provider cache usage evidence. (iteration 14)
- Treating Pi's native `/tree` and session branching as filesystem checkpoint/rewind is ruled out. (iteration 14)
- Persisting full prompt text in a cache ledger is a dead end for privacy and storage; fingerprints and counters are sufficient for first-pass diagnostics. (iteration 15)
- Treating one cumulative session hit rate as sufficient performance evidence is ruled out; rates must be segmented by prefix generation, provider, model, and cache namespace. (iteration 15)
- A latency-only benchmark is insufficient; cache reads can alter cost and input processing without mapping cleanly to end-to-end latency. (iteration 16)
- Treating footer counters or a single session's hit percentage as proof of cost savings is ruled out without provider usage and price reconciliation. (iteration 16)
- Retrying every miss with a modified payload is a dead end: it can double cost and alter model behavior while still not guaranteeing a cache hit. (iteration 17)
- Silent automatic mutation of unsupported provider payloads is ruled out as a safe default. (iteration 17)
- Treating a cache miss as a correctness failure is ruled out; misses are normal provider behavior and must remain observable without blocking the request. (iteration 17)
- A monolithic “Context Engine v2” that owns Pi session persistence, MCP, plan mode, rewind, provider adapters, and cache state is ruled out as an unnecessarily broad scope. (iteration 18)
- Importing or coupling directly to another router/package's internal globals is a dead end for a durable plugin; use documented Pi hooks and optional versioned integrations only. (iteration 18)
- A single “works on DeepSeek” smoke test is insufficient for the proposed provider-agnostic wording and would not test Pi's Anthropic/OpenAI compatibility paths. (iteration 19)
- Approving the lumo roadmap's time/overhead targets as commitments is ruled out; no implementation estimate or benchmark evidence was found in the reviewed sources. (iteration 19)
- A GO decision based only on the lumo percentages is ruled out; live provider benchmarks and a package/source audit remain prerequisites. (iteration 20)
- A universal “Reasonix for Pi” implementation that promises raw KV reuse, guaranteed cross-provider sharing, or guaranteed savings is unsupported by every primary provider contract reviewed. (iteration 20)
- Early synthesis before iteration 20 is ruled out by the max-iterations policy; the observed convergence telemetry never changed the stop policy. (iteration 20)

<!-- /ANCHOR:ruled-out-directions -->

<!-- ANCHOR:divergence-frontier -->
## 10A. SATURATED DIRECTIONS AND DIVERGENCE FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

<!-- /ANCHOR:divergence-frontier -->

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. CARRIED-FORWARD OPEN QUESTIONS
- Are the reported hit rate and cost reduction arithmetically and operationally reproducible from provider telemetry? (iteration 1)
- Which portions of Pi's current provider and extension surface already cover the proposed plugin? (iteration 1)
- What exactly does DeepSeek guarantee, and which parts are best effort? (iteration 2)
- How much of prefix construction is already handled by Pi's provider adapters? (iteration 2)
- Does Pi surface provider usage and cache counters without an extension rewrite? (iteration 3)
- What are DeepSeek's exact cache-unit and eviction semantics? (iteration 3)
- Which providers use different cache-control mechanisms from DeepSeek? (iteration 4)
- Which Pi provider adapters already serialize stable prefixes and expose retention settings? (iteration 4)
- Does Pi's extension hook expose enough request and response metadata to measure hit/miss tokens reliably? (iteration 5)
- Can a plugin preserve stable prefixes without fighting session compaction and provider adapter normalization? (iteration 5)
- Does the existing community optimizer implement these provider distinctions or flatten them? (iteration 6)
- What provider-level identity and affinity controls does Pi expose for OpenAI-compatible caches? (iteration 6)
- Does `pi-cache-optimizer` merely expose these provider controls, or does it add a distinct stable-prefix policy? (iteration 7)
- What security and lifecycle boundaries does Pi apply to third-party packages? (iteration 7)
- What security and maintenance risks would justify a separate plugin rather than adopting or contributing to this package? (iteration 8)
- Which claimed Pi feature gaps are real after separating core, extension, and package capabilities? (iteration 8)
- Can concurrent Pi agents safely share an affinity namespace? (iteration 9)
- How should session persistence, branching, and compaction interact with stable-prefix fingerprints? (iteration 9)
- What is the smallest plugin contract that remains useful with default isolation? (iteration 10)
- Are the claimed Pi feature gaps about core functionality, package availability, or this specific cache policy? (iteration 10)
- What cache diagnostics survive compaction without exposing prompt contents? (iteration 11)
- Is a cache-oriented compaction policy better expressed as a separate extension or as a contribution to Pi's existing compaction hooks? (iteration 11)
- Are checkpoint and rewind gaps similarly filled by packages? (iteration 12)
- Is native plan mode absent only from core, or already covered by maintained packages? (iteration 12)
- Which feature-gap claims should be marked “core gap, ecosystem covered” in the synthesis? (iteration 13)
- Does Pi core have checkpoint/rewind support, or only session branching and package extensions? (iteration 13)
- What performance and invalidation risks remain for an opt-in prefix policy? (iteration 14)
- What cache diagnostics should be retained across compaction or rewind boundaries? (iteration 14)
- Which performance claims can be tested without implementing the plugin? (iteration 15)
- What exact minimal plugin data model supports these segments without coupling to provider-specific usage schemas? (iteration 15)
- Which benchmark scenarios are required before approving a Phase 2 implementation? (iteration 16)
- Which provider usage fields can be normalized safely in a plugin? (iteration 16)
- Which capabilities should be opt-in versus safe by default? (iteration 17)
- What is the smallest persistence format for invalidation and provider diagnostics? (iteration 17)
- Is adopting/contributing to `pi-cache-optimizer` lower risk than a separate package? (iteration 18)
- Which parts of this architecture need live provider tests before implementation approval? (iteration 18)
- Which lumo claims remain unknown rather than false? (iteration 19)
- Which recommendation should the final synthesis make: adopt/audit the existing package, contribute upstream, or build a separate narrow plugin? (iteration 19)
- Can the existing `pi-cache-optimizer` package meet the required security, maintenance, and provider-coverage bar after a pinned source audit? (iteration 20)
- What savings and overhead appear in controlled DeepSeek, Anthropic, and OpenAI-compatible runs with and without the extension? (iteration 20)

<!-- /ANCHOR:carried-forward-open-questions -->

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[All tracked questions are resolved]

<!-- /ANCHOR:next-focus -->

## 12. KNOWN CONTEXT

- Local claim source: `.opencode/specs/hooks/008-pi-caching-like-reasonix/lumo.md`.
- Local phase plan and requirements: parent `spec.md`, `plan.md`, and `tasks.md`; read-only context only.
- Parent fan-out packet config requests 20 iterations with `stopPolicy=max-iterations`; this lineage is the Luna/max branch.
- The current child runtime is already `cli-codex`; recursive same-kind dispatch is guarded, so this lineage executes in the current child while retaining executor provenance in artifacts.

## 13. RESEARCH BOUNDARIES

- Max iterations: 20.
- Convergence threshold: 0.05; ignored for stopping because stop policy is `max-iterations`.
- Per-iteration target: 3–5 evidence actions and no more than 12 tool calls.
- Sources: primary project repositories, official provider/API documentation, and local source files; secondary search results only for discovery.
- Citations: every finding uses `[SOURCE: ...]` or `[INFERENCE: ...]`.
