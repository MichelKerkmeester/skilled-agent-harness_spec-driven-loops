---
title: "444 -- Authored Continuity Snapshot"
description: "Manual check that authored continuity snapshots are disabled by default, refresh only markdown continuity artifacts when enabled, and create no memory rows or index mutations."
version: 3.6.0.1
---

# 444 -- Authored Continuity Snapshot

## 1. OVERVIEW

This scenario validates the authored PreCompact snapshot flag. The feature is opt-in and markdown-native: it refreshes authored continuity artifacts before compaction, but it must not mint memory rows or mutate the index.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm authored continuity snapshot default-off, flag-on markdown refresh, and disabled rollback behavior.
- Real user request: `Validate that precompact continuity snapshotting only refreshes authored docs when enabled and never creates memory rows.`
- Prompt: `Validate SPECKIT_AUTHORED_CONTINUITY_SNAPSHOT with disabled, enabled, and disabled rollback steps.`
- Expected execution process: Prepare a sandbox spec folder with handover and continuity frontmatter, run the PreCompact hook with the flag unset, enable the flag and rerun, compare authored docs and memory/index counters, then disable and verify no further doc changes.
- Expected signals: Disabled mode leaves ladder docs byte-for-byte unchanged; enabled mode refreshes `handover.md` and `_memory.continuity` only; returned or logged counters show `createdMemoryRecords=0` and `indexMutations=0`; disabling restores no-op behavior.
- Desired user-visible outcome: The operator can prove the snapshot is markdown-only and opt-in.
- Pass/fail: PASS only when enabled mode updates the authored continuity docs without adding memory/index state and disabled modes are no-op.

---

## 3. TEST EXECUTION

### Prompt

```text
Validate SPECKIT_AUTHORED_CONTINUITY_SNAPSHOT with disabled, enabled, and disabled rollback steps.
```

### Commands

1. Create a disposable spec folder containing `handover.md` and an `implementation-summary.md` with `_memory.continuity` frontmatter.
2. Record file checksums and `memory_stats({ limit: 1 })` or another available row-count baseline.
3. Unset the flag: `unset SPECKIT_AUTHORED_CONTINUITY_SNAPSHOT`; restart the hook process if needed.
4. Invoke the PreCompact hook or `authored-continuity-snapshot` helper against the sandbox and capture output.
5. Verify checksums and memory/index counters are unchanged.
6. Enable the flag: `export SPECKIT_AUTHORED_CONTINUITY_SNAPSHOT=1`; rerun the hook/helper.
7. Inspect `handover.md` and `_memory.continuity` for refreshed goal, decision, progress, and gotcha facets.
8. Capture helper output or logs showing `createdMemoryRecords=0` and `indexMutations=0`.
9. Disable the flag, rerun, and verify no further authored doc changes occur.

### Expected

- Disabled mode is byte-for-byte no-op for sandbox continuity docs.
- Enabled mode updates only authored continuity files.
- Memory row count and index mutation counters remain unchanged.
- Disabled rollback is no-op again.

### Evidence

Checksums before/after each run, hook/helper output, memory/index counter snapshots, and the refreshed continuity excerpt from enabled mode.

### Pass / Fail

- **Pass**: enabled mode refreshes only markdown continuity docs with zero memory rows and zero index mutations, and disabled modes are no-op.
- **Fail**: the feature runs while disabled, creates memory rows, mutates the index, or rewrites unrelated files.

### Failure Triage

Inspect `lib/continuity/authored-continuity-snapshot.ts`, PreCompact hook wiring, and `tests/openltm-continuity-resilience.vitest.ts`. Confirm the sandbox contains the authored ladder files before expecting updates.

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `feature-flag-reference/authored-continuity-snapshot.md` | Scenario contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `mcp_server/lib/continuity/authored-continuity-snapshot.ts` | Snapshot helper |
| `mcp_server/hooks/claude/compact-inject.ts` | PreCompact integration point |
| `mcp_server/tests/openltm-continuity-resilience.vitest.ts` | Snapshot and disabled-mode regression coverage |

---

## 5. SOURCE METADATA

- Group: Feature Flag Reference
- Playbook ID: 444
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `feature-flag-reference/authored-continuity-snapshot.md`
