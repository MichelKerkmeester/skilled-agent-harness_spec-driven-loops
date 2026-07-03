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
      Tests  17 passed (17)
   Start at  13:03:18
   Duration  882ms (transform 374ms, setup 27ms, import 491ms, tests 211ms, environment 0ms)
```

Supplemental evidence command:

```console
$ npm test -- --run tests/memory-lineage-state.vitest.ts --reporter=verbose

> @spec-kit/mcp-server@1.8.0 test
> node scripts/run-tests.mjs --run tests/memory-lineage-state.vitest.ts --reporter=verbose

PASS mcp_server/tests/memory-lineage-state.vitest.ts > Memory lineage state > records append-first versions and resolves active plus asOf reads deterministically
PASS mcp_server/tests/memory-lineage-state.vitest.ts > Memory lineage state > resolves asOf reads by parsed epoch across timezone-offset lineage windows
PASS mcp_server/tests/memory-lineage-state.vitest.ts > Memory lineage state > resolves lineage reads from any chain member even when the active projection row is missing
PASS mcp_server/tests/memory-lineage-state.vitest.ts > Memory lineage state > detects malformed predecessor chains and projection drift
PASS mcp_server/tests/memory-lineage-state.vitest.ts > Memory lineage state > rejects backwards valid_from timestamps and warns when a predecessor is already superseded

Test Files  1 passed (1)
     Tests  17 passed (17)
```

Observed comparison against Expected: the targeted suite passed with `1 passed (1)` test file and `17 passed (17)` tests. The verbose transcript now shows active projection selection, deterministic `asOf` resolution, malformed-chain detection, and timestamp-order coverage that depends on parsed epoch comparisons for timezone-offset lineage windows.

### Pass / Fail

- **PASS**: `memory-lineage-state.vitest.ts` completed with all tests passing, and the verbose transcript shows both valid and malformed lineage cases plus timestamp-order coverage that depends on parsed epoch comparisons.

### Regression Triage

Re-run `npm test -- --run tests/memory-lineage-state.vitest.ts -t asOf`; inspect `validateTransitionInput()` and `resolveLineageAsOf()` in `lib/storage/lineage-state.ts` and `lib/search/vector-index-schema.ts` if projection or timestamp assertions drift.

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [14--pipeline-architecture/lineage-state-active-projection-and-asof-resolution.md](../../feature_catalog/14--pipeline-architecture/lineage-state-active-projection-and-asof-resolution.md)

---

## 5. SOURCE METADATA

- Group: Pipeline Architecture
- Playbook ID: 129
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `14--pipeline-architecture/lineage-state-active-projection-and-asof-resolution.md`
