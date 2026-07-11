---
title: "080 -- Pipeline and mutation hardening"
description: "This scenario validates Pipeline and mutation hardening for `080`. It focuses on Confirm mutation hardening bundle, including chunked-save finalize rollback safety."
audited_post_018: true
version: 3.6.0.17
---

# 080 -- Pipeline and mutation hardening

## 1. OVERVIEW

This scenario validates Pipeline and mutation hardening for `080`. It focuses on Confirm mutation hardening bundle, including chunked-save finalize rollback safety.

---

## 2. SCENARIO CONTRACT


- Objective: Confirm mutation hardening bundle including chunked-save finalization rollback safety.
- Real user request: `Please validate Pipeline and mutation hardening against the documented validation surface and tell me whether the expected signals are present: CRUD mutations are atomic (all-or-nothing); error handling cleans up partial state; no orphaned records on failure; chunked-save finalize failures remove staged chunk trees; safe-swap rollback keeps old children linked; parent BM25 is preserved on all-chunks-failed rollback.`
- Prompt: `Validate pipeline and mutation hardening against the documented validation surface and return pass/fail with cited evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: CRUD mutations are atomic (all-or-nothing); error handling cleans up partial state; no orphaned records on failure; chunked-save finalize failures remove staged chunk trees; safe-swap rollback keeps old children linked; parent BM25 is preserved on all-chunks-failed rollback
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if all mutation paths are atomic, error handling leaves no partial state, and chunked-save rollback paths preserve old children/BM25 while cleaning staged replacements

---

## 3. TEST EXECUTION

### Prompt

```
Validate pipeline and mutation hardening against the documented validation surface and return pass/fail with cited evidence.
```

### Commands

1. Execute CRUD/mutation paths
2. Force a chunked PE finalize failure and verify compensating cleanup removes the staged chunk tree
3. Force safe-swap finalize failure and verify old children keep their original parent link
4. Force all chunk inserts to fail and verify the parent BM25 document remains unchanged
5. Inspect DB/error traces for orphaned rows or partial supersede state

### Expected

CRUD mutations are atomic (all-or-nothing); error handling cleans up partial state; no orphaned records on failure; chunked-save finalize failures remove staged chunk trees; safe-swap rollback keeps old children linked; parent BM25 is preserved on all-chunks-failed rollback

### Evidence

Executed from `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit`.

Command: `npx vitest run mcp_server/tests/handler-memory-save.vitest.ts -t "cleans up a newly created chunk tree when chunked PE supersede finalize fails" --reporter verbose`

```text
 RUN  v4.1.6 /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit

(node:89440) ExperimentalWarning: SQLite is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
 ↓ mcp_server/tests/handler-memory-save.vitest.ts > Handler Memory Save (T518) [deferred - requires DB test fixtures] > atomic-save failure injection > cleans up a newly created chunk tree when chunked PE supersede finalize fails

 Test Files  1 skipped (1)
      Tests  66 skipped (66)
   Start at  15:22:12
   Duration  1.43s (transform 956ms, setup 0ms, import 1.34s, tests 0ms, environment 0ms)
```

Command: `npx vitest run mcp_server/tests/chunking-orchestrator-swap.vitest.ts --reporter verbose`

```text
 RUN  v4.1.6 /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit

(node:89246) ExperimentalWarning: SQLite is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
stderr | mcp_server/tests/chunking-orchestrator-swap.vitest.ts > T013: staged swap regressions > successful swap deletes old children and links new children atomically
[memory-save] Chunking /tmp/specs/test-safe-swap/memory.md: anchor strategy, 2 chunks

stderr | mcp_server/tests/chunking-orchestrator-swap.vitest.ts > T013: staged swap regressions > swap failure rolls back: old children remain and staged children are cleaned
[memory-save] Chunking /tmp/specs/test-safe-swap/memory-fail.md: anchor strategy, 2 chunks

stderr | mcp_server/tests/chunking-orchestrator-swap.vitest.ts > T013: staged swap regressions > swap failure rolls back: old children remain and staged children are cleaned
[memory-save] Re-chunk swap failed for parent 1: forced finalize swap failure

stderr | mcp_server/tests/chunking-orchestrator-swap.vitest.ts > T013: staged swap regressions > fails safe-swap finalization when old-child bulk delete fails and keeps old children linked
[memory-save] Chunking /tmp/specs/test-safe-swap/memory-delete-fail.md: anchor strategy, 2 chunks

stderr | mcp_server/tests/chunking-orchestrator-swap.vitest.ts > T013: staged swap regressions > fails safe-swap finalization when old-child bulk delete fails and keeps old children linked
[memory-save] Re-chunk swap failed for parent 1: Failed to delete old chunk rows: 2, 3

stderr | mcp_server/tests/chunking-orchestrator-swap.vitest.ts > T013: staged swap regressions > does not mutate parent BM25 document when all chunk inserts fail for an existing parent
[memory-save] Chunking /tmp/specs/test-safe-swap/memory-bm25-rollback.md: anchor strategy, 2 chunks

stderr | mcp_server/tests/chunking-orchestrator-swap.vitest.ts > T013: staged swap regressions > does not mutate parent BM25 document when all chunk inserts fail for an existing parent
[memory-save] Failed to index chunk 1: forced metadata failure for all chunks

stderr | mcp_server/tests/chunking-orchestrator-swap.vitest.ts > T013: staged swap regressions > does not mutate parent BM25 document when all chunk inserts fail for an existing parent
[memory-save] Failed to index chunk 2: forced metadata failure for all chunks
[memory-save] Chunked indexing aborted: all 2 chunks failed (existing parent retained) for /tmp/specs/test-safe-swap/memory-bm25-rollback.md

 ✓ mcp_server/tests/chunking-orchestrator-swap.vitest.ts > T013: staged swap regressions > successful swap deletes old children and links new children atomically 4ms
 ✓ mcp_server/tests/chunking-orchestrator-swap.vitest.ts > T013: staged swap regressions > swap failure rolls back: old children remain and staged children are cleaned 2ms
 ✓ mcp_server/tests/chunking-orchestrator-swap.vitest.ts > T013: staged swap regressions > fails safe-swap finalization when old-child bulk delete fails and keeps old children linked 2ms
 ✓ mcp_server/tests/chunking-orchestrator-swap.vitest.ts > T013: staged swap regressions > does not mutate parent BM25 document when all chunk inserts fail for an existing parent 2ms

 Test Files  1 passed (1)
      Tests  8 passed (8)
   Start at  15:22:03
   Duration  568ms (transform 328ms, setup 0ms, import 485ms, tests 19ms, environment 0ms)
```

Command: `npx vitest run mcp_server/tests/memory-crud-extended.vitest.ts mcp_server/tests/deferred-features-integration.vitest.ts mcp_server/tests/transaction-manager.vitest.ts mcp_server/tests/preflight.vitest.ts --reporter verbose`

```text
 RUN  v4.1.6 /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit

stderr | mcp_server/tests/transaction-manager.vitest.ts
[factory] Failed to read active-embedder metadata from /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/database/context-index.sqlite: database is locked; continuing provider cascade.

 ✓ mcp_server/tests/transaction-manager.vitest.ts > Transaction Manager Unit Tests > Execute atomic save with rollback 1ms
 ✓ mcp_server/tests/transaction-manager.vitest.ts > Transaction Manager Unit Tests > Execute atomic save with pending file cleanup on failure 0ms
 ✓ mcp_server/tests/transaction-manager.vitest.ts > Transaction Atomicity Tests (T192-T200) > T192: execute_atomic_save() wraps file + DB op in transaction 1ms
 ✓ mcp_server/tests/transaction-manager.vitest.ts > Transaction Atomicity Tests (T192-T200) > T194: file cleanup on DB operation failure 0ms
stderr | mcp_server/tests/memory-crud-extended.vitest.ts > handleMemoryDelete - Causal Edge Cleanup > EXT-CE2: Causal edge cleanup failure aborts delete transaction
stderr | mcp_server/tests/memory-crud-extended.vitest.ts > handleMemoryUpdate - Embedding Regeneration > EXT-ER1: Embedding failure without partial rolls back
[memory-update] Embedding regeneration failed, rolling back update [requestId=f2013cf2-762b-46d5-81af-3c42f77a2797]: Mock embedding failure

 ✓ mcp_server/tests/memory-crud-extended.vitest.ts > handleMemoryDelete - Causal Edge Cleanup > EXT-CE1: Causal edges cleaned up on single delete 0ms
 ✓ mcp_server/tests/memory-crud-extended.vitest.ts > handleMemoryDelete - Causal Edge Cleanup > EXT-CE2: Causal edge cleanup failure aborts delete transaction 1ms
 ✓ mcp_server/tests/memory-crud-extended.vitest.ts > handleMemoryDelete - Causal Edge Cleanup > EXT-CE3: No edge cleanup when delete fails 0ms
 ✓ mcp_server/tests/memory-crud-extended.vitest.ts > handleMemoryDelete - Bulk Delete Transaction > EXT-BD5: Bulk delete cleans causal edges for each memory 0ms
 ✓ mcp_server/tests/memory-crud-extended.vitest.ts > handleMemoryUpdate - Embedding Regeneration > EXT-ER1: Embedding failure without partial rolls back 0ms

 Test Files  4 passed (4)
      Tests  141 passed | 23 skipped (164)
   Start at  15:22:22
   Duration  1.12s (transform 1.26s, setup 0ms, import 905ms, tests 1.01s, environment 0ms)
```

### Pass / Fail

- **BLOCKED**: The executable safe-swap/BM25 rollback and CRUD/transaction cleanup surfaces passed, but the required chunked PE finalize cleanup scenario is currently inside `describe.skip('atomic-save failure injection', ...)`; Vitest reported `Test Files  1 skipped (1)` and `Tests  66 skipped (66)`, so the staged chunk-tree cleanup expectation could not be executed in the current repo state.

### Failure Triage

Inspect transaction wrappers on CRUD handlers plus chunked finalize paths; verify cleanup logic on error paths; check for orphaned chunk rows, unsuperseded predecessors, or parent BM25 drift after failures

---

### Prompt

```
As a pipeline validation operator, validate Checkpoint restore barrier blocks mutation traffic against 1) Session A: start checkpoint_restore(name,clearExisting:false) and hold it in the active restore window using the restore test harness or barrier hook. Verify all guarded mutation paths return E_RESTORE_IN_PROGRESS while restore maintenance is active. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. Session A: start checkpoint_restore(name,clearExisting:false) and hold it in the active restore window using the restore test harness or barrier hook
2. Session B: memory_save(filePath)
3. Session B: memory_index_scan(specFolder)
4. Session B: memory_bulk_delete(tier:\"temporary\",confirm:true,specFolder)
5. capture the barrier errors from all three mutation calls

### Expected

All guarded mutation paths return `E_RESTORE_IN_PROGRESS` while restore maintenance is active

### Evidence

Restore-in-progress evidence + three mutation error envelopes

### Pass / Fail

- **Pass**: each guarded mutation path fails fast with `E_RESTORE_IN_PROGRESS` before restore exit
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

If any call slips through, inspect restore barrier reads in `memory-save`, `memory-index`, and `memory-bulk-delete` handlers

---

### Prompt

```
As a pipeline validation operator, validate Checkpoint restore barrier clears after restore exit against 1) Start checkpoint_restore(name,clearExisting:false) and keep it active long enough to observe a blocked mutation. Verify mutation is blocked only during restore maintenance and becomes available again after restore exit. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. Start checkpoint_restore(name,clearExisting:false) and keep it active long enough to observe a blocked mutation
2. Attempt memory_save(filePath) or memory_index_scan(specFolder) and capture E_RESTORE_IN_PROGRESS
3. Let checkpoint_restore complete successfully or fail
4. Retry the same mutation call
5. confirm the retry no longer returns E_RESTORE_IN_PROGRESS

### Expected

Mutation is blocked only during restore maintenance and becomes available again after restore exit

### Evidence

Before/after mutation responses + restore completion or failure output

### Pass / Fail

- **Pass**: the post-restore retry no longer returns `E_RESTORE_IN_PROGRESS`
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

If the retry still reports restore-in-progress, inspect the `restoreCheckpoint()` barrier release in the storage layer `finally` path

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [pipeline-architecture/pipeline-and-mutation-hardening.md](../../feature_catalog/pipeline-architecture/pipeline-and-mutation-hardening.md)

---

## 5. SOURCE METADATA

- Group: Pipeline Architecture
- Playbook ID: 080
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `pipeline-architecture/pipeline-and-mutation-hardening.md`
