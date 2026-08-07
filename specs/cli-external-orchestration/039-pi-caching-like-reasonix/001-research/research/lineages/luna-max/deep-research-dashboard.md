---
title: Deep Research Dashboard
description: Auto-generated reducer view over the research packet.
---

# Deep Research Dashboard - Session Overview

Auto-generated from JSONL state log, iteration files, findings registry, and strategy state. Never manually edited.

<!-- ANCHOR:overview -->
## 1. OVERVIEW

Reducer-generated observability surface for the active research packet.

<!-- /ANCHOR:overview -->
<!-- ANCHOR:status -->
## 2. STATUS
- Topic: Verify the lumo.md Reasonix vs Pi prompt-caching claims and scope feasibility of a Reasonix-style Pi caching plugin
- Started: 2026-08-06T10:11:39.936Z
- Status: COMPLETE
- Iteration: 20 of 20
- Session ID: fanout-luna-max-1786010864634-ls9fw0
- Parent Session: none
- Lifecycle Mode: new
- Generation: 1
- continuedFromRun: none
- stopReason: maxIterationsReached

<!-- /ANCHOR:status -->
<!-- ANCHOR:progress -->
## 3. PROGRESS

| # | Focus | Track | Ratio | Findings | Status |
|---|-------|-------|-------|----------|--------|
| 1 | Establish the lumo.md claim ledger | claim-ledger | 0.94 | 4 | complete |
| 2 | Reasonix cache invariants | reasonix-invariants | 0.83 | 4 | complete |
| 3 | Audit the Reasonix quantitative report | quantitative-audit | 0.78 | 4 | complete |
| 4 | Verify DeepSeek cache semantics | deepseek-semantics | 0.74 | 4 | complete |
| 5 | Audit Pi's native caching surface | pi-native-surface | 0.71 | 4 | complete |
| 6 | Compare Anthropic prompt caching | anthropic-semantics | 0.68 | 4 | complete |
| 7 | Audit OpenAI-compatible cache identity | openai-compatible-semantics | 0.64 | 4 | complete |
| 8 | Verify pi-cache-optimizer ownership and scope | package-audit | 0.61 | 4 | complete |
| 9 | Test Pi extension-hook feasibility | extension-feasibility | 0.58 | 4 | complete |
| 10 | Assess concurrent-agent cache sharing | concurrency-and-affinity | 0.55 | 4 | complete |
| 11 | Audit Pi context-engine capabilities | context-engine-gap | 0.52 | 4 | complete |
| 12 | Audit MCP and RPC boundaries | mcp-rpc-boundary | 0.49 | 4 | complete |
| 13 | Audit plan-mode availability | plan-mode-boundary | 0.46 | 4 | complete |
| 14 | Audit checkpoint and rewind support | checkpoint-rewind-boundary | 0.43 | 4 | complete |
| 15 | Audit cache observability and compaction invalidation | observability-and-invalidation | 0.41 | 4 | complete |
| 16 | Evaluate performance measurement feasibility | performance-measurement | 0.38 | 4 | complete |
| 17 | Stress invalidation and failure modes | invalidation-and-failure | 0.35 | 4 | complete |
| 18 | Define the minimum feasible plugin architecture | minimum-plugin-architecture | 0.32 | 4 | complete |
| 19 | Build the feasibility matrix and proof plan | feasibility-matrix | 0.29 | 4 | complete |
| 20 | Adversarial claim audit | adversarial-final-audit | 0.27 | 5 | complete |

- iterationsCompleted: 20
- keyFindings: 81
- openQuestions: 0
- resolvedQuestions: 4

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 4/4
- [x] Are the Reasonix ~99.8% cache-hit and ~$61→$12 cost claims independently documented and reproducible?
- [x] What prompt-caching behavior does Pi actually implement, and what do DeepSeek and Anthropic expose?
- [x] Does an official or verifiable `pi-cache-optimizer` extension exist, and what does Pi's extension surface permit?
- [x] Which claimed Pi feature gaps are real, and what is the smallest feasible Reasonix-style plugin scope?

<!-- /ANCHOR:questions -->
<!-- ANCHOR:uncovered-questions -->
## Uncovered Questions
- Count: 0
- None

<!-- /ANCHOR:uncovered-questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- newInfoRatio sparkline: █▇▆▆▆▅▅▅▄▄▄▃▃▃▂▂▂▂▁▁
- score sparkline: █▇▆▆▆▅▅▄▄▄▃▃▃▃▂▂▂▂▁▁
- Last 3 ratios: 0.32 -> 0.29 -> 0.27
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.55
- coverageBySources: {"api-docs.deepseek.com":3,"code":40,"docs.anthropic.com":1,"github.com":4,"other":2,"pi.dev":16,"platform.openai.com":1,"reasonix.io":1}
- Advisory events: none

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
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

<!-- /ANCHOR:dead-ends -->
<!-- ANCHOR:divergent-pivots -->
## 6A. DIVERGENT PIVOTS
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

<!-- /ANCHOR:divergent-pivots -->
<!-- ANCHOR:next-focus -->
## 7. NEXT FOCUS
[All tracked questions are resolved]

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 8. ACTIVE RISKS
- None active beyond normal research uncertainty.

<!-- /ANCHOR:active-risks -->
<!-- ANCHOR:blocked-stops -->
## 9. BLOCKED STOPS
No blocked-stop events recorded.

<!-- /ANCHOR:blocked-stops -->
<!-- ANCHOR:graph-convergence -->
## 10. GRAPH CONVERGENCE
- graphConvergenceScore: 0.00
- graphDecision: [Not recorded]
- graphBlockers: none recorded

<!-- /ANCHOR:graph-convergence -->
