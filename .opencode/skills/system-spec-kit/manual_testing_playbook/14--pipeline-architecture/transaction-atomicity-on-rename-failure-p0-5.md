---
title: "115 -- Transaction atomicity on rename failure (P0-5)"
description: "This scenario validates Transaction atomicity on rename failure (P0-5) for `115`. It focuses on Verify that pending file is preserved (not deleted) when rename fails after DB commit, enabling recovery on next startup."
audited_post_018: true
version: 3.6.0.16
---

# 115 -- Transaction atomicity on rename failure (P0-5)

## 1. OVERVIEW

This scenario validates Transaction atomicity on rename failure (P0-5) for `115`. It focuses on Verify that pending file is preserved (not deleted) when rename fails after DB commit, enabling recovery on next startup.

---

## 2. SCENARIO CONTRACT


- Objective: Verify that pending file is preserved (not deleted) when rename fails after DB commit, enabling recovery on next startup.
- Real user request: `Please validate Transaction atomicity on rename failure (P0-5) against executeAtomicSave() and tell me whether the expected signals are present: Rename failure returns {success:false, dbCommitted:true}; pending file preserved on disk after failure; recoverAllPendingFiles discovers and recovers the pending file.`
- Prompt: `Validate transaction atomicity on rename failure (P0-5) against executeAtomicSave() and return pass/fail with cited evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: Rename failure returns {success:false, dbCommitted:true}; pending file preserved on disk after failure; recoverAllPendingFiles discovers and recovers the pending file
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if pending file survives rename failure and recovery function can find and process it

---

## 3. TEST EXECUTION

### Prompt

```
Validate transaction atomicity on rename failure (P0-5) against executeAtomicSave() and return pass/fail with cited evidence.
```

### Commands

1. **Precondition:** Read transaction-manager.ts to understand pendingPath logic.
2. Trigger `executeAtomicSave()` with a path that will cause rename to fail (e.g., read-only target directory)
3. Verify the function returns `{ success: false, dbCommitted: true }`
4. Verify the pending file still exists on disk (not deleted)
5. Verify `recoverAllPendingFiles()` can find and recover the pending file

### Expected

Rename failure returns {success:false, dbCommitted:true}; pending file preserved on disk after failure; recoverAllPendingFiles discovers and recovers the pending file

### Evidence

Executed from `.opencode/skills/system-spec-kit/mcp_server`:

```text
[transaction-manager] rename failed after DB commit; pending file kept for recovery: /var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/txn-atomic-rename-failure-Nvgr7d/memory/atomic_pending.md (EACCES: permission denied, rename '/var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/txn-atomic-rename-failure-Nvgr7d/memory/atomic_pending.md' -> '/var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/txn-atomic-rename-failure-Nvgr7d/memory/atomic.md')
{
  "root": "/var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/txn-atomic-rename-failure-Nvgr7d",
  "afterFailure": {
    "result": {
      "success": false,
      "filePath": "/var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/txn-atomic-rename-failure-Nvgr7d/memory/atomic.md",
      "error": "Rename failed after DB commit: EACCES: permission denied, rename '/var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/txn-atomic-rename-failure-Nvgr7d/memory/atomic_pending.md' -> '/var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/txn-atomic-rename-failure-Nvgr7d/memory/atomic.md'",
      "dbCommitted": true
    },
    "dbOperationCalled": true,
    "dbOperationCompleted": true,
    "filePath": "/var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/txn-atomic-rename-failure-Nvgr7d/memory/atomic.md",
    "pendingPath": "/var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/txn-atomic-rename-failure-Nvgr7d/memory/atomic_pending.md",
    "pendingExistsAfterFailure": true,
    "finalExistsAfterFailure": false,
    "pendingContentAfterFailure": "# Atomic rename failure\n",
    "metricsAfterFailure": {
      "totalAtomicWrites": 0,
      "totalDeletes": 0,
      "totalRecoveries": 0,
      "totalErrors": 1,
      "lastOperationTime": null
    }
  },
  "afterRecovery": {
    "recovery": [
      {
        "path": "/var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/txn-atomic-rename-failure-Nvgr7d/memory/atomic_pending.md",
        "recovered": true
      }
    ],
    "pendingExistsAfterRecovery": false,
    "finalExistsAfterRecovery": true,
    "finalContentAfterRecovery": "# Atomic rename failure\n",
    "metricsAfterRecovery": {
      "totalAtomicWrites": 0,
      "totalDeletes": 0,
      "totalRecoveries": 1,
      "totalErrors": 1,
      "lastOperationTime": "2026-07-02T13:41:37.535Z"
    }
  }
}
(node:18652) ExperimentalWarning: SQLite is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
```

### Pass / Fail

- **PASS**: pending file survived rename failure and `recoverAllPendingFiles()` found and recovered it.

### Failure Triage

Inspect executeAtomicSave error handling for rename failures; verify pending file cleanup is skipped when dbCommitted=true; check recoverAllPendingFiles scan logic

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [14--pipeline-architecture/atomic-pending-file-recovery.md](../../feature_catalog/14--pipeline-architecture/atomic-pending-file-recovery.md)

---

## 5. SOURCE METADATA

- Group: Pipeline Architecture
- Playbook ID: 115
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `14--pipeline-architecture/transaction-atomicity-on-rename-failure-p0-5.md`
