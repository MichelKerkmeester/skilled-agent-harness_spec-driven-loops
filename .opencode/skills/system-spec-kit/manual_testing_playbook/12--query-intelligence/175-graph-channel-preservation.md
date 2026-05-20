---
title: "175 -- Graph channel preservation"
description: "Validates shouldPreserveGraph intent and entity-density gates plus the SPECKIT_GRAPH_CHANNEL_PRESERVATION flag rollback path."
audited_post_018: true
---

# 175 -- Graph channel preservation

## 1. OVERVIEW

This scenario validates the routing-layer override that preserves the graph (and degree) channel for find_decision and find_spec intents plus entity-rich short queries even at simple complexity tier.

---

## 2. SCENARIO CONTRACT

- Objective: Verify `shouldPreserveGraph` activates the graph channel under intent and entity-density gates, that telemetry reflects the activation, and that `SPECKIT_GRAPH_CHANNEL_PRESERVATION=false` cleanly reverts to pre-override behavior.
- Real user request: `Please validate graph channel preservation against a find_decision short query and an entity-dense query, and confirm I can disable the override via SPECKIT_GRAPH_CHANNEL_PRESERVATION=false.`
- Prompt: `Validate graph channel preservation: intent gate, entity-density gate, telemetry rate, and flag rollback.`
- Expected execution process: Issue a mix of find_decision, find_spec, entity-dense, and plain queries; capture trace envelopes plus `data.routing` rates; toggle the kill-switch and confirm reversion.
- Expected signals: `routingReasons` contains `graph-preserved-by-intent` for find_decision/find_spec queries; `routingReasons` contains `graph-preserved-by-entity-density` for entity-dense queries; `memory_health.data.routing.graphChannelInvocationRate` rises above zero after the mixed batch; setting `SPECKIT_GRAPH_CHANNEL_PRESERVATION=false` drops the rate to 0 on the same mix.
- Desired user-visible outcome: Pass/fail verdict with cited trace and rate evidence.
- Pass/fail: PASS when intent and density gates emit the documented reasons, telemetry rate moves with the mix, and the kill-switch reverts behavior. FAIL when gates do not emit reasons, rate stays at 0 default-on, or the kill-switch has no effect.

---

## 3. TEST EXECUTION

### Prompt

```
Validate graph channel preservation: intent gate, entity-density gate, telemetry rate, and flag rollback.
```

### Commands

1. Restart MCP child so telemetry state starts clean.
2. Issue 5 representative queries:
   - `memory_search({ query: "why did we pick the redis cache approach" })` (find_decision)
   - `memory_search({ query: "find the spec for task routing" })` (find_spec)
   - `memory_search({ query: "<two tokens that both hit known high-fanout titles>" })` (entity-density)
   - `memory_search({ query: "refactor module" })` (control, not preserved)
   - `memory_search({ query: "list recent changes" })` (control, not preserved)
3. Call `memory_health()` and inspect `data.routing.graphChannelInvocationRate` plus `channelInvocationRates.graph`. Assert the rate is non-zero (expect roughly 0.4-0.6 for the mix above).
4. Tail `.opencode/skills/system-spec-kit/mcp_server/data/search-decisions.jsonl` and confirm `routingReasons` includes `graph-preserved-by-intent` for the two find_* queries and `graph-preserved-by-entity-density` for the entity-dense query.
5. Set `SPECKIT_GRAPH_CHANNEL_PRESERVATION=false` in the MCP env, restart the server, repeat steps 2-3. Assert `graphChannelInvocationRate` drops to 0 and no `graph-preserved-*` reasons appear in the new tail.
6. Targeted Vitest: `cd .opencode/skills/system-spec-kit/mcp_server && npm exec -- vitest run tests/query-router.vitest.ts tests/entity-density.vitest.ts tests/routing-telemetry-stress.vitest.ts`.

### Expected

- find_decision and find_spec queries surface `graph-preserved-by-intent` in routingReasons.
- Entity-dense query surfaces `graph-preserved-by-entity-density`.
- `data.routing.graphChannelInvocationRate` is non-zero after the mixed batch.
- Flag-off run zeros the rate and removes the reasons.
- Three Vitest suites exit 0.

### Evidence

- Two `memory_health` responses (flag default-on vs default-off)
- Tail of search-decisions.jsonl spanning both runs
- Vitest summary

### Pass / Fail

- **Pass**: documented routingReasons appear in default-on, rate is non-zero, kill-switch fully reverts behavior, Vitest exits 0.
- **Fail**: missing routingReasons, rate stuck at 0 default-on, flag-off still emits preservation reasons, or Vitest fails.

### Failure Triage

Inspect `mcp_server/lib/search/query-router.ts:shouldPreserveGraph` for the intent and entity-density gates. Check `mcp_server/lib/search/entity-density.ts` cache lifecycle. Verify `mcp_server/lib/search/routing-telemetry.ts:recordInvocation` is being called from `routeQuery`. Confirm `isGraphChannelPreservationEnabled()` reads the env at request time, not module load.

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [12--query-intelligence/12-graph-channel-preservation.md](../../feature_catalog/12--query-intelligence/12-graph-channel-preservation.md)
- Source: `.opencode/skills/system-spec-kit/mcp_server/lib/search/query-router.ts`, `.opencode/skills/system-spec-kit/mcp_server/lib/search/entity-density.ts`, `.opencode/skills/system-spec-kit/mcp_server/lib/search/routing-telemetry.ts`
- Regression tests: `.opencode/skills/system-spec-kit/mcp_server/tests/query-router.vitest.ts`, `.opencode/skills/system-spec-kit/mcp_server/tests/entity-density.vitest.ts`, `.opencode/skills/system-spec-kit/mcp_server/tests/routing-telemetry-stress.vitest.ts`

---

## 5. SOURCE METADATA

- Group: Query intelligence
- Playbook ID: 175
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `12--query-intelligence/175-graph-channel-preservation.md`
