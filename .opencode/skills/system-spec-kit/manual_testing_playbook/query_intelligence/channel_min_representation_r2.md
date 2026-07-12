---
title: "035 -- Channel min-representation (R2)"
description: "This scenario validates Channel min-representation (R2) for `035`. It focuses on Confirm top-k channel diversity rule."
audited_post_018: true
version: 3.6.0.15
---

# 035 -- Channel min-representation (R2)

## 1. OVERVIEW

This scenario validates Channel min-representation (R2) for `035`. It focuses on Confirm top-k channel diversity rule.

---

## 2. SCENARIO CONTRACT


- Objective: Confirm top-k channel diversity rule.
- Real user request: `Please validate Channel min-representation (R2) against the documented validation surface and tell me whether the expected signals are present: Each channel represented in top-k results even when one channel dominates; quality floor prevents low-relevance injection.`
- RCAF Prompt: `As a query_intelligence validation operator, validate Channel min-representation (R2) against the documented validation surface. Verify each channel represented in top-k results even when one channel dominates; quality floor prevents low-relevance injection. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: Each channel represented in top-k results even when one channel dominates; quality floor prevents low-relevance injection
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS: All active channels have >=1 representative in top-k; quality floor prevents sub-threshold entries; FAIL: Channel missing from top-k or sub-threshold results injected

---

## 3. TEST EXECUTION

### Prompt

```
As a query_intelligence validation operator, confirm top-k channel diversity rule against the documented validation surface. Verify each channel represented in top-k results even when one channel dominates; quality floor prevents low-relevance injection. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. Run dominance query
2. Inspect pre/post representation
3. Verify quality floor

### Expected

Each channel represented in top-k results even when one channel dominates; quality floor prevents low-relevance injection

### Evidence

Validation surface read from `../../feature_catalog/query_intelligence/channel_min_representation.md`:

```text
29: After fusion, the system checks that every channel which returned results has at least one representative in the top-k window after fusion. Results below a 0.005 quality floor are excluded from promotion because forcing a bad result into the top-k is worse than missing a channel. The floor was lowered from 0.2 to 0.005 during Sprint 8 remediation because RRF scores typically fall in the 0.01-0.03 range, and the original 0.2 threshold was filtering out virtually all RRF-sourced results.
31: The architecture is two-layered: `channel-representation.ts` performs the core analysis and appends promoted items to the result list without re-sorting. The pipeline-level wrapper `channel-enforcement.ts` calls the core function and then globally re-sorts the combined list (window + tail + promotions) by score descending so ranking integrity is preserved. This separation keeps the core function pure (append-only, no sort side-effect) while the wrapper guarantees callers always receive a score-ordered list. The net effect: you see results from diverse retrieval strategies rather than one dominant channel. Runs behind the `SPECKIT_CHANNEL_MIN_REP` flag (default: enabled / graduated).
48: | `mcp_server/tests/channel-representation.vitest.ts` | Automated test | Core analysis: promotion logic, quality floor, multi-source counting (18 tests) |
49: | `mcp_server/tests/channel-enforcement.vitest.ts` | Automated test | Wrapper: score ordering after promotion, precision verification, edge cases (20 tests) |
```

Implementation read from `mcp_server/lib/search/channel-representation.ts`:

```text
6: /** Calibration reference for raw-RRF-scale relevance scores (~0.01-0.03), retained
7:  * from when promotion was floor-gated: the threshold was lowered 0.2 -> 0.005 because
8:  * the original 0.2 assumed normalized [0,1] scores and silently rejected ALL raw RRF
9:  * results. NOTE: channel-min-representation promotion no longer gates on this value —
10:  * to guarantee representation it promotes each under-represented channel's best result
11:  * even below the floor (see the `analyzeChannelRepresentation` rules below). The constant
12:  * is kept as the documented calibration anchor, not an active promotion gate. */
17: export const QUALITY_FLOOR = 0.005;
69:  * Rules:
70:  *  - Only checks channels that actually returned results (no phantom penalties).
71:  *  - A channel is under-represented when it has 0 results in topK.
72:  *  - Missing channels promote their best result, even below QUALITY_FLOOR.
```

Implementation read from `mcp_server/lib/search/channel-enforcement.ts`:

```text
73:  *  - Promoted items are normalized into the existing fused score range, then
74:  *    reserved inside the inspected top-k window when capacity allows.
75:  *  - Missing channels promote their best result even below QUALITY_FLOOR;
76:  *    the floor still governs non-representation quality filtering elsewhere.
```

Dominance/pre-post representation validation command:

```text
$ npx vitest run tests/channel-representation.vitest.ts tests/channel-enforcement.vitest.ts

 RUN  v4.1.9 /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit


 Test Files  2 passed (2)
      Tests  39 passed (39)
   Start at  11:34:50
   Duration  255ms (transform 57ms, setup 23ms, import 61ms, tests 15ms, environment 0ms)
```

Quality-floor targeted validation command:

```text
$ npx vitest run tests/channel-enforcement.vitest.ts -t "T9: active channels below 0.005 still receive representatives" --reporter verbose

 RUN  v4.1.9 /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit

 ↓ mcp_server/tests/channel-enforcement.vitest.ts > T028 Channel Enforcement + Precision Verification > T1: enforcement applies when flag enabled and channel is missing
 ↓ mcp_server/tests/channel-enforcement.vitest.ts > T028 Channel Enforcement + Precision Verification > T2: enforcement does not apply when flag is disabled
 ↓ mcp_server/tests/channel-enforcement.vitest.ts > T028 Channel Enforcement + Precision Verification > T3: topK parameter limits the inspection window to the first N results
 ↓ mcp_server/tests/channel-enforcement.vitest.ts > T028 Channel Enforcement + Precision Verification > T4: promoted results appear in results list and metadata reflects the promotion
 ↓ mcp_server/tests/channel-enforcement.vitest.ts > T028 Channel Enforcement + Precision Verification > T5: promoted raw scores are normalized into the fused range before sorting
 ↓ mcp_server/tests/channel-enforcement.vitest.ts > T028 Channel Enforcement + Precision Verification > T6: all channels represented — top-3 is identical before and after enforcement
 ↓ mcp_server/tests/channel-enforcement.vitest.ts > T028 Channel Enforcement + Precision Verification > T7: one channel missing — top-3 includes its representative
 ↓ mcp_server/tests/channel-enforcement.vitest.ts > T028 Channel Enforcement + Precision Verification > T8: promotions with lower scores reserve a top-k slot
 ✓ mcp_server/tests/channel-enforcement.vitest.ts > T028 Channel Enforcement + Precision Verification > T9: active channels below 0.005 still receive representatives 1ms
 ↓ mcp_server/tests/channel-enforcement.vitest.ts > T028 Channel Enforcement + Precision Verification > reserves top-k slots for active channels even when their best result is below the floor
 ↓ mcp_server/tests/channel-enforcement.vitest.ts > T028 Channel Enforcement + Precision Verification > T10: multiple missing channels — each receives at most 1 promotion
 ↓ mcp_server/tests/channel-enforcement.vitest.ts > T028 Channel Enforcement + Precision Verification > T11: when router returns ≥2 channels both present in top-k, no promotion is triggered
 ↓ mcp_server/tests/channel-enforcement.vitest.ts > T028 Channel Enforcement + Precision Verification > T12: empty fusedResults — returns empty results without crashing
 ↓ mcp_server/tests/channel-enforcement.vitest.ts > T028 Channel Enforcement + Precision Verification > T13: single fused result — returns correctly without crashing
 ↓ mcp_server/tests/channel-enforcement.vitest.ts > T028 Channel Enforcement + Precision Verification > T14: all channel result sets empty — no promotions, results pass through
 ↓ mcp_server/tests/channel-enforcement.vitest.ts > T028 Channel Enforcement + Precision Verification > T15: topK=0 — empty inspection window, full results returned without promotions
 ↓ mcp_server/tests/channel-enforcement.vitest.ts > T028 Channel Enforcement + Precision Verification > T16: topK larger than results length — full list is inspected, no out-of-bounds
 ↓ mcp_server/tests/channel-enforcement.vitest.ts > T028 Channel Enforcement + Precision Verification > T17: promoted items preserve extra fields from the channel result
 ↓ mcp_server/tests/channel-enforcement.vitest.ts > T028 Channel Enforcement + Precision Verification > T18: channelCounts reflects per-channel counts across the full result list
 ↓ mcp_server/tests/channel-enforcement.vitest.ts > T028 Channel Enforcement + Precision Verification > SANITY: QUALITY_FLOOR is 0.005 and is exported from channel-representation
 ↓ mcp_server/tests/channel-enforcement.vitest.ts > T028 Channel Enforcement + Precision Verification > T19: preserves global score order when topK is smaller than result list

 Test Files  1 passed (1)
      Tests  1 passed | 20 skipped (21)
   Start at  11:36:17
   Duration  118ms (transform 41ms, setup 14ms, import 40ms, tests 2ms, environment 0ms)
```

Actual below-floor values read from `mcp_server/tests/channel-enforcement.vitest.ts`:

```text
293:   it('T9: active channels below 0.005 still receive representatives', () => {
294:     const fused: FusedResult[] = [
295:       makeFused('a1', 0.9, 'vector'),
296:     ];
297:     const channels = new Map<string, ChannelResult[]>([
298:       ['vector', [makeChannel('a1', 0.9)]],
299:       ['bm25',   [makeChannel('b1', 0.004)]],  // just below floor (0.005)
300:       ['graph',  [makeChannel('g1', 0.001)]],  // well below floor
301:     ]);
303:     const result = enforceChannelRepresentation(fused, channels);
305:     expect(result.enforcement.promotedCount).toBe(2);
306:     expect(result.results).toHaveLength(3);
307:     expect(result.enforcement.underRepresentedChannels).toContain('bm25');
308:     expect(result.enforcement.underRepresentedChannels).toContain('graph');
```

Top-k representation targeted validation command:

```text
$ npx vitest run tests/channel-enforcement.vitest.ts -t "reserves top-k slots for active channels even when their best result is below the floor" --reporter verbose

 RUN  v4.1.9 /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit

 ↓ mcp_server/tests/channel-enforcement.vitest.ts > T028 Channel Enforcement + Precision Verification > T1: enforcement applies when flag enabled and channel is missing
 ↓ mcp_server/tests/channel-enforcement.vitest.ts > T028 Channel Enforcement + Precision Verification > T2: enforcement does not apply when flag is disabled
 ↓ mcp_server/tests/channel-enforcement.vitest.ts > T028 Channel Enforcement + Precision Verification > T3: topK parameter limits the inspection window to the first N results
 ↓ mcp_server/tests/channel-enforcement.vitest.ts > T028 Channel Enforcement + Precision Verification > T4: promoted results appear in results list and metadata reflects the promotion
 ↓ mcp_server/tests/channel-enforcement.vitest.ts > T028 Channel Enforcement + Precision Verification > T5: promoted raw scores are normalized into the fused range before sorting
 ↓ mcp_server/tests/channel-enforcement.vitest.ts > T028 Channel Enforcement + Precision Verification > T6: all channels represented — top-3 is identical before and after enforcement
 ↓ mcp_server/tests/channel-enforcement.vitest.ts > T028 Channel Enforcement + Precision Verification > T7: one channel missing — top-3 includes its representative
 ↓ mcp_server/tests/channel-enforcement.vitest.ts > T028 Channel Enforcement + Precision Verification > T8: promotions with lower scores reserve a top-k slot
 ↓ mcp_server/tests/channel-enforcement.vitest.ts > T028 Channel Enforcement + Precision Verification > T9: active channels below 0.005 still receive representatives
 ✓ mcp_server/tests/channel-enforcement.vitest.ts > T028 Channel Enforcement + Precision Verification > reserves top-k slots for active channels even when their best result is below the floor 1ms
 ↓ mcp_server/tests/channel-enforcement.vitest.ts > T028 Channel Enforcement + Precision Verification > T10: multiple missing channels — each receives at most 1 promotion
 ↓ mcp_server/tests/channel-enforcement.vitest.ts > T028 Channel Enforcement + Precision Verification > T11: when router returns ≥2 channels both present in top-k, no promotion is triggered
 ↓ mcp_server/tests/channel-enforcement.vitest.ts > T028 Channel Enforcement + Precision Verification > T12: empty fusedResults — returns empty results without crashing
 ↓ mcp_server/tests/channel-enforcement.vitest.ts > T028 Channel Enforcement + Precision Verification > T13: single fused result — returns correctly without crashing
 ↓ mcp_server/tests/channel-enforcement.vitest.ts > T028 Channel Enforcement + Precision Verification > T14: all channel result sets empty — no promotions, results pass through
 ↓ mcp_server/tests/channel-enforcement.vitest.ts > T028 Channel Enforcement + Precision Verification > T15: topK=0 — empty inspection window, full results returned without promotions
 ↓ mcp_server/tests/channel-enforcement.vitest.ts > T028 Channel Enforcement + Precision Verification > T16: topK larger than results length — full list is inspected, no out-of-bounds
 ↓ mcp_server/tests/channel-enforcement.vitest.ts > T028 Channel Enforcement + Precision Verification > T17: promoted items preserve extra fields from the channel result
 ↓ mcp_server/tests/channel-enforcement.vitest.ts > T028 Channel Enforcement + Precision Verification > T18: channelCounts reflects per-channel counts across the full result list
 ↓ mcp_server/tests/channel-enforcement.vitest.ts > T028 Channel Enforcement + Precision Verification > SANITY: QUALITY_FLOOR is 0.005 and is exported from channel-representation
 ↓ mcp_server/tests/channel-enforcement.vitest.ts > T028 Channel Enforcement + Precision Verification > T19: preserves global score order when topK is smaller than result list

 Test Files  1 passed (1)
      Tests  1 passed | 20 skipped (21)
   Start at  11:36:09
   Duration  109ms (transform 38ms, setup 15ms, import 33ms, tests 2ms, environment 0ms)
```

Actual top-k representation values read from `mcp_server/tests/channel-enforcement.vitest.ts`:

```text
311:   it('reserves top-k slots for active channels even when their best result is below the floor', () => {
312:     const fused: FusedResult[] = [
313:       makeFused('a1', 0.95, 'vector'),
314:       makeFused('a2', 0.9, 'vector'),
315:       makeFused('a3', 0.85, 'vector'),
316:     ];
317:     const channels = new Map<string, ChannelResult[]>([
318:       ['vector', [makeChannel('a1', 0.95), makeChannel('a2', 0.9), makeChannel('a3', 0.85)]],
319:       ['bm25',   [makeChannel('b1', 0.004)]],
320:       ['graph',  [makeChannel('g1', 0.001)]],
321:     ]);
323:     const result = enforceChannelRepresentation(fused, channels, 3);
324:     const topSources = new Set(result.results.slice(0, 3).map(r => r.source));
326:     expect(topSources).toEqual(new Set(['vector', 'bm25', 'graph']));
327:     expect(result.enforcement.promotedCount).toBe(2);
```

Runner availability errors encountered while trying to execute a direct one-off import without adding files:

```text
$ node --import tsx/esm -e "console.log('tsx ok')"
node:internal/modules/package_json_reader:314
  throw new ERR_MODULE_NOT_FOUND(packageName, fileURLToPath(base), null);
        ^

Error [ERR_MODULE_NOT_FOUND]: Cannot find package 'tsx' imported from /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/
    at Object.getPackageJSONURL (node:internal/modules/package_json_reader:314:9)
    at packageResolve (node:internal/modules/esm/resolve:768:81)
    at moduleResolve (node:internal/modules/esm/resolve:855:18)
    at defaultResolve (node:internal/modules/esm/resolve:985:11)
    at #cachedDefaultResolve (node:internal/modules/esm/loader:747:20)
    at ModuleLoader.resolve (node:internal/modules/esm/loader:724:38)
    at ModuleLoader.getModuleJobForImport (node:internal/modules/esm/loader:320:38)
    at onImport.tracePromise.__proto__ (node:internal/modules/esm/loader:680:36)
    at TracingChannel.tracePromise (node:diagnostics_channel:350:14)
    at ModuleLoader.import (node:internal/modules/esm/loader:679:21) {
  code: 'ERR_MODULE_NOT_FOUND'
}

Node.js v22.23.1
```

```text
$ npx tsx -e "console.log('tsx ok')"
sh: tsx: command not found
```

### Pass / Fail

- **FAIL**: The top-k representation behavior is present, but the quality-floor expectation did not hold: passing validation explicitly shows active channels with scores `0.004` and `0.001` below `QUALITY_FLOOR = 0.005` still receive representatives/promotions.

### Failure Triage

Verify min-representation algorithm → Check quality floor threshold → Inspect channel priority ordering

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [query_intelligence/channel_min_representation.md](../../feature_catalog/query_intelligence/channel_min_representation.md)

---

## 5. SOURCE METADATA

- Group: Query Intelligence
- Playbook ID: 035
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `query_intelligence/channel_min_representation_r2.md`
