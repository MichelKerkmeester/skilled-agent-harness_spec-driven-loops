# Iteration 002 — Q2: Does the false-green guard still fire in a clean env?

## Focus

Q2 (primary): When both daemons actually connect (no `runner:` SKIP rows), does scenario 410 still PASS/PARTIAL — and can the guard at `substrate-runner-harness.vitest.ts:79-83` be bypassed by an all-SKIP false green?

## Actions Taken

1. Traced `runner:` row emission logic in `connectSharedClient` (run-substrate-stress-harness.mjs:376-416) to determine exactly when diagnostic=null vs diagnostic={SKIP/FAIL}.
2. Traced 410 verdict path in `runScenario` (run-substrate-stress-harness.mjs:643-658) — latency path vs generic path and under what conditions each fires.
3. Traced the guard assertion (`substrate-runner-harness.vitest.ts:79-83`) — computed `memoryOwnerSkipped` from `skippedConnections`, conditional assertion on 410 verdict.
4. Traced the `assembleVerdict` function (run-substrate-stress-harness.mjs:573-633) for SKIP conditions.
5. Enumerated all paths that produce scenario SKIP with no runner SKIP row; evaluated guard coverage on each.
6. Evaluated whether listTools() failure is a separate failure mode from connect failure.

## Findings

### F-008: `runner:` rows are emitted ONLY on connect-throw (run-substrate-stress-harness.mjs:376-393 vs 394-416)

`connectSharedClient` returns `diagnostic: null` only when BOTH `client.connect(transport)` AND `client.listTools()` succeed without throwing (lines 376-393). In that happy path, no `runner:` row is emitted to the TSV.

Every other path — connect throws OR listTools throws — enters the catch at line 394:
- `liveOwner !== null` (live daemon holds lease) → `runner:${name}` SKIP (lines 400-404)
- `liveOwner === null` (no live owner) → `runner:${name}` FAIL (lines 405-410)

**Critical corollary**: `listTools()` throwing while the daemon is alive (zombie/unresponsive) does NOT produce a SKIP row. It produces `liveOwner !== null` → SKIP... wait no, let me re-read:

Lines 397-404:
```javascript
const liveOwner = liveOwnerForService(name);
const diagnostic = liveOwner
  ? { scenario: `runner:${name}`, verdict: 'SKIP', ... }
  : { scenario: `runner:${name}`, verdict: 'FAIL', ... };
```

So:
- If daemon is alive (liveOwner !== null) → SKIP row, regardless of WHY the connect/listTools threw.
- If daemon is dead (liveOwner === null) → FAIL row, regardless of WHY.

The SKIP row means "a live owner holds the lease" — the specific error (connect refused vs listTools threw vs timeout) doesn't affect the classification. The SKIP row is emitted whenever the harness cannot spawn a dedicated child because a live owner holds the lease — it does NOT require that the connect succeeded.

**Evidence**: run-substrate-stress-harness.mjs:394-416 (entire catch block)

---

### F-009: The guard catches the all-SKIP false green when daemons connect cleanly

The guard at substrate-runner-harness.vitest.ts:79-83:
```typescript
const memoryOwnerSkipped = skippedConnections.some((row) => row.scenario === 'runner:mk-spec-memory');
if (!memoryOwnerSkipped) {
  const memoryScenario = scenarioRows.find((row) => row.scenario === '410');
  expect(['PASS', 'PARTIAL'], '410 (memory) should run, not SKIP/FAIL').toContain(memoryScenario?.verdict);
}
```

`memoryOwnerSkipped` is `false` (guard fires) when there is NO `runner:mk-spec-memory` SKIP row in the TSV. This means both:
- `connectSharedClient` returned `diagnostic: null` for mk-spec-memory (connect + listTools both succeeded), AND
- No `runner:` SKIP row was emitted for mk-spec-memory

In this clean-connect state, `runScenario` is called for 410. Two paths:

**Path A — `memory_search` present** (run-substrate-stress-harness.mjs:654):
```javascript
if (scenario === 410 && toolNameSets.mk_spec_memory?.has('memory_search')) {
  return { scenario, ...(await runLatencyScenario(clients.mk_spec_memory)) };
}
```
Returns `{ verdict: 'PASS' | 'PARTIAL' | 'FAIL' }` from `runLatencyScenario`. Guard assertion PASS/PARTIAL/FAIL — PASS and PARTIAL pass the guard; FAIL would fail the earlier line-72 assertion (verdict must not be FAIL).

**Path B — `memory_search` absent** (run-substrate-stress-harness.mjs:655-657):
Falls through to `runGenericScenario` → `checkToolAvailability` returns `{ available: false, tool: 'memory_search', reason: ... }` → `assembleVerdict` returns `{ scenario: '410', verdict: 'SKIP', key_metric: 'memory_search unavailable', ... }` (run-substrate-stress-harness.mjs:583-589).

In Path B, 410 produces a SKIP row with no runner row. `memoryOwnerSkipped = false`. The guard fires:
```typescript
expect(['PASS', 'PARTIAL'], '410 (memory) should run, not SKIP/FAIL').toContain('SKIP');
```
Assertion FAILS → test fails. Guard catches the false green.

**Evidence**: substrate-runner-harness.vitest.ts:79-83 + run-substrate-stress-harness.mjs:583-589

---

### F-010: The ONLY way to bypass the guard is via the PID-recycling F-005 path

For the guard NOT to fire (`memoryOwnerSkipped = true`), a `runner:mk-spec-memory` SKIP row must exist in the TSV. This row is only emitted when `connectSharedClient` catch block fires AND `liveOwnerForService(name)` returns non-null (run-substrate-stress-harness.mjs:398-404).

For `liveOwnerForService` to return non-null when the daemon is NOT actually alive (i.e., for the SKIP to be a false green masking a genuine crash), the PID in the lease file must be recycled to a live unrelated process. This is exactly F-005 from iteration 1.

There is no other mechanism:
- `listTools()` throwing with a live daemon → `liveOwner !== null` → SKIP row (correct, daemon IS alive)
- `listTools()` throwing with a dead daemon → `liveOwner === null` → FAIL row (correct, daemon IS dead)
- Successful connect but empty toolNames → no runner row → guard fires on any 410 SKIP

**Evidence**: run-substrate-stress-harness.mjs:394-416 (catch block), 358-364 (liveOwnerForService null path)

---

### F-011: `listTools()` failure is NOT an independent false-green pathway

The harness has no special handling for "connect succeeded but listTools failed" vs "connect failed". Both enter the same catch block and are classified solely by `liveOwnerForService`. This means:

- If daemon is alive: listTools error → SKIP row → `memoryOwnerSkipped = true` → guard does NOT fire → 410 is allowed to SKIP (correct, because the harness can't spawn a dedicated child).
- If daemon is dead: listTools error → FAIL row → test fails at line 58.

There is no scenario where a dead daemon produces a SKIP row unless PID recycling has occurred (F-005/F-010).

**Evidence**: run-substrate-stress-harness.mjs:376-393 (try block includes listTools), 394-416 (catch block handles both)

---

### F-012: 410 guard is specifically about tool availability, not harness infrastructure failure

The guard comment at substrate-runner-harness.vitest.ts:75-78:
> "The memory-backed scenario (410) must actually run against the daemon — this guards against an all-SKIP false green when the daemon connects but silently exposes no tools."

The guard specifically guards against: daemon connects, `listTools()` succeeds, returns ZERO tools or returns tools that don't include `memory_search`, causing 410 to fall through to SKIP. In this case, the earlier verdict-loop at line 72 (`expect(['PASS', 'SKIP', 'PARTIAL']).toContain(verdict)`) would PASS for 410 (SKIP is tolerated), but the guard at 79-83 specifically catches the 410 SKIP case and escalates it to a test failure.

This is the correct behavior for a "clean env" validation test: in a clean env where the operator daemon is NOT running, the harness SHOULD be able to spawn dedicated children and 410 SHOULD execute `memory_search` calls. If it doesn't, the test should fail.

**Evidence**: substrate-runner-harness.vitest.ts:75-83

---

## Ruled Out

### RO-005: listTools() zombie/unresponsive daemon produces false-green SKIP without PID recycling

If a daemon is alive but `listTools()` hangs/throws (zombie unresponsive daemon), `liveOwnerForService` returns non-null (the PID IS alive), so the verdict is SKIP. This is correct behavior — the daemon IS alive (PID is alive), the harness correctly identifies it can't spawn a dedicated child, and the SKIP is legitimate. Not a false green.

**Reason**: `isPidAlive` only checks if the PID is alive, not if the daemon is responsive. This is the same semantic as F-003 (childPid not checked). A zombie process that doesn't respond to `listTools()` is still a live process.

---

### RO-006: Empty `toolNames` Set bypasses guard silently

If `listTools()` returns a non-empty list but `toolNames` ends up empty (e.g., `listed.tools.map()` on an empty array), `toolNameSets.mk_spec_memory?.has('memory_search')` returns false → 410 SKIPs → guard fires → assertion fails. Not a silent bypass.

---

### RO-007: `memoryScenario?.verdict` being undefined bypasses guard

If the 410 row is absent from scenarioRows, `memoryScenario` is `undefined`, `memoryScenario?.verdict` is `undefined`, and `expect(['PASS', 'PARTIAL']).toContain(undefined)` throws. The test fails rather than silently passing.

---

## Questions Answered

| Q | Answer |
|---|--------|
| Q2 (focus): false-green guard fires in clean env? | **YES, it fires and catches the all-SKIP false green.** When both daemons connect cleanly (no `runner:` SKIP rows), the guard at vitest ts:79-83 asserts 410 must be PASS or PARTIAL. If 410 SKIPs (e.g., `memory_search` not in toolNames), the assertion fails and the test fails. The guard is NOT bypassed by any mechanism except PID recycling (F-005), which was identified in iteration 1. |

## Questions Remaining

- **Q3**: Does the evidence TSV reproducibly show `runner:*` SKIP with owning pids and a stable explanation?
- **Q4**: Is the ~1437 `graph-metadata.json` churn pre-existing + operator background rescans, not harness-produced?
- **Q5**: Is the `SPECKIT_CODE_GRAPH_MAINTAINER_MODE=true` leak genuinely sidestepped by skip-not-fail, or merely hidden?

## Next Focus

Q3: Validate that the evidence TSV produced by the harness contains stable, reproducible `runner:* SKIP` rows with owning PIDs and that the harness TSV format is deterministic across runs.
