---
title: "077 -- Tier-2 fallback channel forcing"
description: "This scenario validates Tier-2 fallback channel forcing for `077`. It focuses on Confirm force-all-channels in tier-2."
audited_post_018: true
version: 3.6.0.16
id: retrieval-enhancements-tier-2-fallback-channel-forcing
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# 077 -- Tier-2 fallback channel forcing

## 1. OVERVIEW

This scenario validates Tier-2 fallback channel forcing for `077`. It focuses on Confirm force-all-channels in tier-2.

---

## 2. SCENARIO CONTRACT


- Objective: Confirm force-all-channels in tier-2.
- Real user request: `Please validate Tier-2 fallback channel forcing against the documented validation surface and tell me whether the expected signals are present: Tier-2 fallback activates all search channels; channel options show forceAllChannels=true; results include contributions from all channels.`
- RCAF Prompt: `As a retrieval-enhancement validation operator, validate Tier-2 fallback channel forcing against the documented validation surface. Verify tier-2 fallback activates all search channels; channel options show forceAllChannels=true; results include contributions from all channels. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: Tier-2 fallback activates all search channels; channel options show forceAllChannels=true; results include contributions from all channels
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if tier-2 fallback forces all channels active and results show multi-channel contribution

---

## 3. TEST EXECUTION

### Prompt

```
As a retrieval-enhancement validation operator, validate Tier-2 fallback channel forcing against the documented validation surface. Verify tier-2 fallback activates all search channels; channel options show forceAllChannels=true; results include contributions from all channels. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. trigger tier-2 fallback
2. inspect options
3. confirm all channels forced

### Expected

Tier-2 fallback activates all search channels; channel options show forceAllChannels=true; results include contributions from all channels

### Evidence

Command run:

```bash
npx vitest run tests/hybrid-search.vitest.ts -t "C138-P0-FB-T2"
```

Observed output:

```text
 RUN  v4.1.9 /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit

(node:52863) ExperimentalWarning: SQLite is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)

 Test Files  1 passed (1)
      Tests  1 passed | 98 skipped (99)
   Start at  22:33:32
   Duration  916ms (transform 381ms, setup 13ms, import 485ms, tests 356ms, environment 0ms)
```

Tier-2 trigger and options evidence observed in `mcp-server/lib/search/hybrid-search.ts`:

```text
1126:   if (planKind === 'tiered') {
1127:     const trigger = checkDegradation(primaryResults);
1128:     if (!trigger) {
1129:       return { allowedChannels, stages };
1130:     }
1131: 
1132:     const retryOptions = applyAllowedChannelOverrides(options, allowedChannels, {
1133:       ...overrides,
1134:       minSimilarity: TIERED_FALLBACK_MIN_SIMILARITY,
1135:       forceAllChannels: true,
1136:     });
```

Channel forcing evidence observed in `mcp-server/lib/search/hybrid-search.ts`:

```text
1346:     const allPossibleChannels: ChannelName[] = ['vector', 'fts', 'bm25', 'graph', 'degree'];
1347:     const activeChannels = options.forceAllChannels
1348:       ? new Set<ChannelName>(allPossibleChannels)
1349:       : new Set<ChannelName>(routeResult.channels);
```

Per-channel contribution evidence observed in `mcp-server/lib/search/hybrid-search.ts`:

```text
1404:     // Vector channel — gated by query-complexity routing
1405:     if (activeChannels.has('vector') && embedding && vectorSearchFn) {
1437:     // FTS channel (internal error handling in ftsSearch) — gated by query-complexity routing
1438:     if (activeChannels.has('fts')) {
1447:     // BM25 channel (internal error handling in bm25Search) — gated by query-complexity routing
1448:     if (activeChannels.has('bm25')) {
1463:     const useGraph = (options.useGraph !== false) && activeChannels.has('graph');
1490:     if (activeChannels.has('degree') && db && isDegreeBoostEnabled()) {
```

Regression evidence observed in `mcp-server/tests/hybrid-search.vitest.ts`:

```text
1161:   it('C138-P0-FB-T2: tier-2 fallback forces all channels for simple-routed queries', async () => {
1164:     process.env.SPECKIT_SEARCH_FALLBACK = 'true';
1165:     process.env.SPECKIT_COMPLEXITY_ROUTER = 'true';
1167:     let graphSearchCallCount = 0;
1168:     const lowRecallVectorSearch = () => [{ id: 1, similarity: 0.01, content: 'vector low confidence' }];
1169:     const trackingGraphSearch = (_query: string, _options: Record<string, unknown>) => {
1170:       graphSearchCallCount++;
1171:       return [{ id: 999, score: 0.6, content: 'graph fallback candidate' }];
1184:       // "auth" is a simple query; Tier 1 routes to a subset of channels.
1185:       // Limit=1 guarantees degradation (count < 3), so Tier 2 should run and
1186:       // Force-enable all channels, including graph.
1188:       await hybridSearch.searchWithFallback('auth', embedding, { limit: 1 });
1190:       expect(graphSearchCallCount).toBeGreaterThanOrEqual(1);
```

### Pass / Fail

- **PASS**: The targeted regression passed; Tier-2 retry options set `forceAllChannels: true`; forced options activate `vector`, `fts`, `bm25`, `graph`, and `degree`; and the regression confirms a graph fallback candidate contributes during Tier-2 fallback.

### Failure Triage

Inspect tier-2 trigger conditions; verify forceAllChannels flag propagation; check channel activation logic

## 4. SOURCE FILES
- Root playbook: [manual-testing-playbook.md](../../manual-testing-playbook/manual-testing-playbook.md)
- Feature catalog: [retrieval-enhancements/tier-2-fallback-channel-forcing.md](../../feature-catalog/retrieval-enhancements/tier-2-fallback-channel-forcing.md)

---

## 5. SOURCE METADATA

- Group: Retrieval Enhancements
- Playbook ID: 077
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `retrieval-enhancements/tier-2-fallback-channel-forcing.md`
