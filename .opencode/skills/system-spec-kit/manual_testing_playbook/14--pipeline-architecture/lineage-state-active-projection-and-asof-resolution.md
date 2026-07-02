---
title: "129 -- Lineage state active projection and asOf resolution"
description: "This scenario validates Lineage state active projection and asOf resolution for `129`. It focuses on Verify append-first lineage projection and deterministic `asOf` resolution."
audited_post_018: true
version: 3.6.0.18
---

# 129 -- Lineage state active projection and asOf resolution

## 1. OVERVIEW

This scenario validates Lineage state active projection and asOf resolution for `129`. It focuses on Verify append-first lineage projection and deterministic `asOf` resolution.

---

## 2. SCENARIO CONTRACT


- Objective: Verify append-first lineage projection, deterministic `asOf` resolution, and timestamp ordering across non-ISO or timezone variants.
- Real user request: `` Please validate Lineage state active projection and asOf resolution against cd .opencode/skills/system-spec-kit/mcp_server and tell me whether the expected signals are present: Targeted suite passes; transcript shows active projection selection, deterministic `asOf` resolution, malformed-chain detection, and timestamp-order coverage for non-ISO or timezone variants. ``
- Prompt: `Validate lineage state active projection and asOf resolution in the MCP server and return pass/fail with cited evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: Targeted suite passes; transcript shows active projection selection, deterministic `asOf` resolution, malformed-chain detection, and timestamp-order coverage for non-ISO or timezone variants
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if `memory-lineage-state.vitest.ts` completes with all tests passing and the transcript shows both valid and malformed lineage cases plus timestamp-order coverage that depends on parsed epoch comparisons

---

## 3. TEST EXECUTION

### Prompt

```
Validate lineage state active projection and asOf resolution in the MCP server and return pass/fail with cited evidence.
```

### Commands

1. `cd .opencode/skills/system-spec-kit/mcp_server`
2. `npm test -- --run tests/memory-lineage-state.vitest.ts`
3. Inspect the output for active projection, `asOf`, integrity failure coverage, and timestamp-order coverage for variant date formats

### Expected

Targeted suite passes; transcript shows active projection selection, deterministic `asOf` resolution, malformed-chain detection, and timestamp-order coverage for non-ISO or timezone variants

### Evidence

Command 1:

```console
$ cd .opencode/skills/system-spec-kit/mcp_server
```

Output:

```console
(no output)
```

Command 2:

```console
$ npm test -- --run tests/memory-lineage-state.vitest.ts

> @spec-kit/mcp-server@1.8.0 test
> node scripts/run-tests.mjs --run tests/memory-lineage-state.vitest.ts


 RUN  v4.1.9 /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit


 Test Files  1 passed (1)
      Tests  16 passed (16)
   Start at  15:01:27
   Duration  611ms (transform 310ms, setup 13ms, import 387ms, tests 153ms, environment 0ms)
```

Observed comparison against Expected: the targeted suite passed with `1 passed (1)` test file and `16 passed (16)` tests, but the transcript did not show active projection selection, deterministic `asOf` resolution, malformed-chain detection, or timestamp-order coverage for non-ISO or timezone variants.

### Pass / Fail

- **FAIL**: `memory-lineage-state.vitest.ts` completed with all tests passing, but the actual transcript did not show both valid and malformed lineage cases plus timestamp-order coverage that depends on parsed epoch comparisons.

### Failure Triage

Re-run `npm test -- --run tests/memory-lineage-state.vitest.ts -t asOf`; inspect `validateTransitionInput()` in `lib/storage/lineage-state.ts` and `lib/search/vector-index-schema.ts` if projection or timestamp assertions drift

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [14--pipeline-architecture/lineage-state-active-projection-and-asof-resolution.md](../../feature_catalog/14--pipeline-architecture/lineage-state-active-projection-and-asof-resolution.md)

---

## 5. SOURCE METADATA

- Group: Pipeline Architecture
- Playbook ID: 129
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `14--pipeline-architecture/lineage-state-active-projection-and-asof-resolution.md`
