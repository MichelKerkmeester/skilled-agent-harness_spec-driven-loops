---
title: "033 -- Query complexity router (R15)"
description: "This scenario validates Query complexity router (R15) for `033`. It focuses on Confirm query-class routing."
audited_post_018: true
version: 3.6.0.15
---

# 033 -- Query complexity router (R15)

## 1. OVERVIEW

This scenario validates Query complexity router (R15) for `033`. It focuses on Confirm query-class routing.

---

## 2. SCENARIO CONTRACT


- Objective: Confirm query-class routing.
- Real user request: `Please validate Query complexity router (R15) against the documented validation surface and tell me whether the expected signals are present: Simple queries route to fewer channels; complex queries activate all channels; disabled flag falls back to default routing.`
- RCAF Prompt: `As a query-intelligence validation operator, validate Query complexity router (R15) against the documented validation surface. Verify simple queries route to fewer channels; complex queries activate all channels; disabled flag falls back to default routing. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: Simple queries route to fewer channels; complex queries activate all channels; disabled flag falls back to default routing
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS: Channel count increases with complexity class; disabled flag uses default routing; FAIL: All queries use same channels or flag-disabled produces error

---

## 3. TEST EXECUTION

### Prompt

```
As a query-intelligence validation operator, confirm query-class routing against the documented validation surface. Verify simple queries route to fewer channels; complex queries activate all channels; disabled flag falls back to default routing. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. Run simple/moderate/complex
2. Inspect selected channels
3. Disable flag fallback

### Expected

Simple queries route to fewer channels; complex queries activate all channels; disabled flag falls back to default routing

### Evidence

Command run from `.opencode/skills/system-spec-kit/mcp_server`:

```bash
npx vitest run tests/query-classifier.vitest.ts tests/query-router.vitest.ts tests/query-router-channel-interaction.vitest.ts
```

Observed output:

```text
 RUN  v4.1.9 /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit

(node:15234) ExperimentalWarning: SQLite is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
(node:15252) ExperimentalWarning: SQLite is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)

 Test Files  3 passed (3)
      Tests  173 passed (173)
   Start at  11:58:24
   Duration  978ms (transform 425ms, setup 29ms, import 648ms, tests 106ms, environment 0ms)
```

Command run from `.opencode/skills/system-spec-kit/mcp_server`:

```bash
npx vitest run tests/query-router.vitest.ts --reporter verbose
```

Observed output excerpts for selected channels and disabled flag fallback:

```text
 ✓ mcp_server/tests/query-router.vitest.ts > T026-01: Default Routing Config > T1: simple tier maps to exactly 2 channels (vector + fts) 2ms
 ✓ mcp_server/tests/query-router.vitest.ts > T026-01: Default Routing Config > T2: moderate tier maps to 3 channels (vector + fts + bm25) 0ms
 ✓ mcp_server/tests/query-router.vitest.ts > T026-01: Default Routing Config > T3: complex tier maps to all 5 channels 0ms
 ✓ mcp_server/tests/query-router.vitest.ts > T026-01: Default Routing Config > T4: ALL_CHANNELS constant contains all 5 channel names 0ms
 ✓ mcp_server/tests/query-router.vitest.ts > T026-02: getChannelSubset > T7: simple tier returns 2 channels with default config 0ms
 ✓ mcp_server/tests/query-router.vitest.ts > T026-02: getChannelSubset > T8: moderate tier returns 3 channels with default config 0ms
 ✓ mcp_server/tests/query-router.vitest.ts > T026-02: getChannelSubset > T9: complex tier returns all 5 channels with default config 1ms
 ✓ mcp_server/tests/query-router.vitest.ts > T026-04: routeQuery Convenience Function > T18: routes simple query to 2 channels 38ms
 ✓ mcp_server/tests/query-router.vitest.ts > T026-04: routeQuery Convenience Function > T19: routes complex query to all 5 channels 2ms
 ✓ mcp_server/tests/query-router.vitest.ts > T026-04: routeQuery Convenience Function > T22: routes moderate query to 3 channels 0ms
 ✓ mcp_server/tests/query-router.vitest.ts > T026-05: Feature Flag Disabled > T23: routeQuery returns all 5 channels when flag is disabled 0ms
 ✓ mcp_server/tests/query-router.vitest.ts > T026-05: Feature Flag Disabled > T24: routeQuery returns complex tier when flag is disabled (classifier fallback) 0ms
 ✓ mcp_server/tests/query-router.vitest.ts > T026-05: Feature Flag Disabled > T25: routeQuery returns all 5 channels for any query when flag is disabled 0ms
 ✓ mcp_server/tests/query-router.vitest.ts > T026-05: Feature Flag Disabled > T26: routeQuery with flag set to "false" returns all 5 channels 0ms

 Test Files  1 passed (1)
      Tests  85 passed (85)
   Start at  12:00:02
   Duration  716ms (transform 418ms, setup 21ms, import 555ms, tests 64ms, environment 0ms)
```

### Pass / Fail

- **PASS**: Channel count increases with complexity class (`simple` 2 channels, `moderate` 3 channels, `complex` all 5 channels), and `SPECKIT_COMPLEXITY_ROUTER=false` returns all 5 channels with complex-tier classifier fallback.

### Failure Triage

Verify complexity classification logic → Check channel mapping per class → Inspect feature flag fallback behavior

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [query-intelligence/query-complexity-router.md](../../feature_catalog/query-intelligence/query-complexity-router.md)

---

## 5. SOURCE METADATA

- Group: Query Intelligence
- Playbook ID: 033
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `query-intelligence/query-complexity-router-r15.md`
