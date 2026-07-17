---
title: "073 -- Quality gate timer persistence"
description: "This scenario validates Quality gate timer persistence for `073`. It focuses on Confirm restart persistence."
audited_post_018: true
version: 3.6.0.17
id: memory-quality-and-indexing-quality-gate-timer-persistence
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# 073 -- Quality gate timer persistence

## 1. OVERVIEW

This scenario validates Quality gate timer persistence for `073`. It focuses on Confirm restart persistence.

---

## 2. SCENARIO CONTRACT


- Objective: Confirm restart persistence.
- Real user request: `Please validate Quality gate timer persistence against the documented validation surface and tell me whether the expected signals are present: Activation timestamp survives service restart; quality gate respects persisted timer; no timer reset on restart.`
- Prompt: `Validate quality gate timer persistence across service restart.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: Activation timestamp survives service restart; quality gate respects persisted timer; no timer reset on restart
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if activation timestamp persists across restart and quality gate honors the original timer

---

## 3. TEST EXECUTION

### Prompt

```
Validate quality gate timer persistence across service restart.
```

### Commands

1. set activation timestamp
2. restart service
3. verify persisted timestamp

### Expected

Activation timestamp survives service restart; quality gate respects persisted timer; no timer reset on restart

### Evidence

Scenario command surface read from this file:

```text
37: ### Commands
38: 
39: 1. set activation timestamp
40: 2. restart service
41: 3. verify persisted timestamp
42: 
43: ### Expected
44: 
45: Activation timestamp survives service restart; quality gate respects persisted timer; no timer reset on restart
```

Linked catalog validation surface read:

```text
27: The `qualityGateActivatedAt` timestamp in `save-quality-gate.ts` was stored purely in-memory. Every server restart reset the 14-day warn-only countdown, preventing the quality gate from graduating to enforcement mode. The fix adds SQLite persistence to the `config` table using the existing key-value store pattern. `isWarnOnlyMode()` lazy-loads from DB when the in-memory value is null. `setActivationTimestamp()` writes to both memory and DB. All DB operations are non-fatal with graceful fallback.
37: | `mcp_server/lib/validation/save-quality-gate.ts` | Lib | Pre-storage quality gate |
43: | `mcp_server/tests/save-quality-gate.vitest.ts` | Automated test | Quality gate tests |
```

Targeted documented test surface executed from `.opencode/skills/system-spec-kit/mcp_server`:

```text
$ npm test -- --run tests/save-quality-gate.vitest.ts -t "WO7" --reporter verbose

> @spec-kit/mcp-server@1.8.0 test
> node scripts/run-tests.mjs --run tests/save-quality-gate.vitest.ts -t WO7 --reporter verbose


 RUN  v4.1.9 /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit

stderr | mcp_server/tests/save-quality-gate.vitest.ts > Save Quality Gate (TM-04) > Warn-Only Mode (MR12) > WO7: runQualityGate does not reset persisted activation window on restart
INFO  [VectorIndex] Created vec_memories table with dimension 768
INFO  [VectorIndex] Schema migration complete: v41

 ✓ mcp_server/tests/save-quality-gate.vitest.ts > Save Quality Gate (TM-04) > Warn-Only Mode (MR12) > WO7: runQualityGate does not reset persisted activation window on restart 33ms

 Test Files  1 passed (1)
      Tests  1 passed | 82 skipped (83)
   Start at  13:34:05
   Duration  559ms (transform 337ms, setup 17ms, import 437ms, tests 33ms, environment 0ms)
```

Blocker: the scenario has no Preconditions section and its Commands section does not provide executable service-control commands or a concrete service identity for a real restart. The approved write constraint allows editing only this scenario file, while a real `setActivationTimestamp()` + service restart verification would require mutating the SQLite persistence store and restarting the backing service outside that single-file write path. The targeted automated regression passed, but it is not the real production service-restart transcript required by the scenario.

### Pass / Fail

- **BLOCKED**: The documented regression test `WO7: runQualityGate does not reset persisted activation window on restart` passes, but the scenario cannot be truthfully completed as a real service-restart verification because no executable restart command/service target is specified and the single-file write restriction prevents the required persisted timestamp mutation outside this scenario file.

### Failure Triage

Check persistence storage mechanism; verify timer read-on-startup logic; inspect for race conditions during restart

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [memory_quality_and_indexing/quality_gate_timer_persistence.md](../../feature_catalog/memory_quality_and_indexing/quality_gate_timer_persistence.md)

---

## 5. SOURCE METADATA

- Group: Memory Quality and Indexing
- Playbook ID: 073
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `memory_quality_and_indexing/quality_gate_timer_persistence.md`
