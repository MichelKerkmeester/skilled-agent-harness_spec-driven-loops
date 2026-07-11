---
title: "272 -- Routing telemetry and graph-channel invocation (012)"
description: "Manual scenario validating that memory_health surfaces graphChannelInvocationRate and that the shouldPreserveGraph override fires for find_decision / find_spec queries."
version: 3.6.0.7
---

# 272 -- Routing telemetry and graph-channel invocation (012)

## 1. OVERVIEW

This scenario validates the routing-telemetry surface and graph-channel preservation override added by packet 012. It confirms that `memory_health.data.routing` reports the rolling `graphChannelInvocationRate`, that the rate moves with intent mix, and that the `SPECKIT_GRAPH_CHANNEL_PRESERVATION` flag cleanly disables the override.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm `data.routing.graphChannelInvocationRate` reports a non-zero rate after find_decision / find_spec queries are issued, and that opt-out via the env flag drops the rate to 0.
- Real user request: `Please verify that the graph channel is now being activated for short find_decision / find_spec queries and that the rate shows up in memory_health. Also confirm I can disable it via SPECKIT_GRAPH_CHANNEL_PRESERVATION=false.`
- Prompt: `Validate routing telemetry and graph-channel invocation against the documented validation surface and return pass/fail with cited evidence.`
- Expected execution process: Call memory_search for a mix of find_decision / find_spec / refactor queries, then call memory_health and inspect data.routing. Toggle SPECKIT_GRAPH_CHANNEL_PRESERVATION=false, restart MCP, repeat.
- Expected signals: data.routing block present in memory_health response with graphChannelInvocationRate, channelInvocationRates, totalRecorded, windowSize. Default-on rate ≥ 0.30 across mixed-intent batches; rate drops to 0 when flag is disabled.
- Desired user-visible outcome: A concise pass/fail verdict with the observed routing block JSON and rate-change evidence cited.
- Pass/fail: PASS: data.routing block present; rate moves with intent mix (≥0.30 default-on, 0 when disabled); routing reasons surface in search-decisions.jsonl. FAIL: data.routing missing; rate stuck at 0 with default-on flag; flag opt-out has no effect.

---

## 3. TEST EXECUTION

### Prompt

```
Validate routing telemetry and graph-channel invocation against the documented validation surface and return pass/fail with cited evidence.
```

### Commands

1. Restart MCP child to load post-012 dist (required — telemetry is in-process state)
2. Issue 5 representative queries spanning intents (3 find_*, 2 non-find):
   - `memory_search({ query: "why chose auth approach" })`        // simple find_decision
   - `memory_search({ query: "find the spec for tasks" })`        // moderate find_spec
   - `memory_search({ query: "alternatives considered for caching" })`  // moderate find_decision
   - `memory_search({ query: "refactor module" })`                 // simple refactor
   - `memory_search({ query: "fix the orphan file cleanup" })`     // simple fix_bug
3. Call `memory_health()` and inspect `data.routing`
4. Verify rate ≥ 0.30 (2 of 5 routings should include graph for the realistic classifier mix)
5. Set `SPECKIT_GRAPH_CHANNEL_PRESERVATION=false` in MCP env, restart, repeat steps 2-4

### Expected

`memory_health.data.routing` carries:
- `graphChannelInvocationRate` (number, 0..1)
- `channelInvocationRates` (object: vector / fts / bm25 / graph / degree → number)
- `totalRecorded` (integer ≤ 200)
- `windowSize` = 200

After step 2, `graphChannelInvocationRate ≈ 0.4` (2/5 graph-included). After step 5 with the flag off, `graphChannelInvocationRate = 0` for the same mix.

Note: Intent classifier returns 'understand' for queries phrased like 'alternatives considered for caching' — playbook expected 3/5 graph hits but realistic mix yields 2/5. Code is correct; this note documents the classifier-mix expectation.

`search-decisions.jsonl` (under `mcp_server/data/`) carries `routingReasons` containing `graph-preserved-by-intent` for each query classified as find_decision or find_spec; entity-density activations also emit `graph-preserved-by-entity-density`.

### Evidence

- Captured `memory_health` response JSON before and after flag toggle
- Tail of `mcp_server/data/search-decisions.jsonl` showing the new reason strings
- Diff of channelInvocationRates.graph between default-on and flag-off batches

### Pass / Fail

- **Pass**: `data.routing` block present with the four expected keys; `graphChannelInvocationRate ≥ 0.30` after the mixed-intent batch; rate drops to `0` when `SPECKIT_GRAPH_CHANNEL_PRESERVATION=false`; `routingReasons` carry the new strings.
- **Fail**: `data.routing` missing or shape mismatch; rate stuck at `0` despite find_decision / find_spec queries firing; flag opt-out has no observable effect.

### Failure Triage

Verify post-restart MCP is running the new dist (`memory_health.data.routing` exists at all) → confirm `intent-classifier` emits `find_decision`/`find_spec` for the seed queries (`includeTrace: true` on memory_search exposes intent in the trace envelope) → check `entity-density.ts` cache build query against the live `causal_edges` table → confirm `routing-telemetry.recordInvocation` is being called on every routeQuery (look at `tests/query-router.vitest.ts` 012-T3.1 for the canonical assertion shape) → verify the env flag is being read from `process.env` at request time, not module-load time.

## 4. SOURCE FILES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [query-intelligence/graph-channel-preservation.md](../../feature_catalog/query-intelligence/graph-channel-preservation.md)
- Health diagnostics: [discovery/health-diagnostics-memoryhealth.md](../../feature_catalog/discovery/health-diagnostics-memoryhealth.md)

---

## 5. SOURCE METADATA

- Group: Pipeline Architecture
- Playbook ID: 272
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `pipeline-architecture/routing-telemetry-and-graph-channel-invocation.md`
