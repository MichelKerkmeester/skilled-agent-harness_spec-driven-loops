---
title: "441 -- Soft-Delete Tombstones"
description: "Manual check that memory deletion remains hard-delete by default, writes tombstones only when explicitly enabled, and returns to hard-delete behavior when disabled."
version: 3.6.0.1
id: feature-flag-reference-soft-delete-tombstones
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# 441 -- Soft-Delete Tombstones

## 1. OVERVIEW

This scenario validates the soft-delete tombstone rollout gate. The default path must preserve existing hard-delete behavior. With tombstones enabled, delete paths preserve a first `deleted_at` timestamp and retention sweep targets the purgeable partition. Because recall filtering remains a follow-up risk, this scenario must run only in a disposable sandbox.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm default hard-delete behavior, flag-on tombstone write behavior, and disable rollback behavior.
- Real user request: `Validate that deletes are still hard deletes by default, then prove tombstones are written only when I opt in.`
- Prompt: `Validate SPECKIT_SOFT_DELETE_TOMBSTONES with default hard-delete, enabled tombstone, and disabled rollback steps.`
- Expected execution process: Save a sandbox memory and delete it with the flag unset; enable tombstones in a fresh process, save and delete another sandbox memory, inspect persistence fields; disable the flag and repeat hard-delete verification.
- Expected signals: Default and disabled runs remove the record from active storage; enabled run sets `deleted_at` without overwriting an existing timestamp on repeated delete; retention sweep dry-run or preview recognizes purgeable tombstone candidates.
- Desired user-visible outcome: The operator can state tombstones are opt-in only and default deletes remain unchanged.
- Pass/fail: PASS only when default and disabled paths are hard-delete and enabled path writes stable tombstone metadata.

---

## 3. TEST EXECUTION

### Prompt

```text
Validate SPECKIT_SOFT_DELETE_TOMBSTONES with default hard-delete, enabled tombstone, and disabled rollback steps.
```

### Commands

1. Create an isolated DB sandbox and record its path in the transcript.
2. Unset the flag: `unset SPECKIT_SOFT_DELETE_TOMBSTONES`; restart the daemon or handler process.
3. Save a sandbox memory with `memory_save({ filePath: "<absolute file A>", force: true })`, capture `ID_A`, then delete it with `memory_delete({ id: ID_A, confirm: true })`.
4. Verify `memory_list({ limit: 100, includeArchived: true })` or direct sandbox DB inspection no longer returns `ID_A` as an active or tombstoned row.
5. Enable tombstones: `export SPECKIT_SOFT_DELETE_TOMBSTONES=true`; restart the daemon or handler process.
6. Save a second sandbox memory, capture `ID_B`, delete it, then inspect the sandbox DB row for `deleted_at` and active/tombstone partition state.
7. Delete `ID_B` again or rerun the delete path and verify `deleted_at` is not overwritten.
8. Run `memory_retention_sweep({ dryRun: true })` or the retention preview path and capture tombstone purgeability counters if available.
9. Disable the flag, restart, save/delete `ID_C`, and verify the hard-delete behavior matches step 4.

### Expected

- `ID_A` and `ID_C` are removed by hard-delete semantics.
- `ID_B` remains only as a tombstoned row with a populated first `deleted_at` timestamp.
- Repeated tombstone delete does not change the first `deleted_at` value.
- Retention preview distinguishes purgeable tombstone rows from active rows.

### Evidence

BLOCKED before executing Commands step 1.

Actual scenario command requirement:

```text
1. Create an isolated DB sandbox and record its path in the transcript.
```

Actual user-level write constraint for this run:

```text
Do NOT modify, create, or delete any file OTHER than the single scenario file named below.
```

```text
ALLOWED WRITE PATHS
- .opencode/skills/system-spec-kit/manual_testing_playbook/feature_flag_reference/soft_delete_tombstones.md (this file only)
```

Because creating an isolated DB sandbox and saving sandbox memory files would create or modify files outside the single allowed write path, the scenario could not be executed without violating the run constraints. No sandbox DB path, `memory_save`, `memory_delete`, `deleted_at` inspection, retention preview, or sandbox cleanup transcript was produced.

### Pass / Fail

- **BLOCKED**: the required isolated DB sandbox and sandbox memory files cannot be created under the run's single-file write constraint.

### Failure Triage

Inspect schema v37 migration paths, delete handler branching, retention sweep partition logic, and `tests/causal-edge-tombstones.vitest.ts`. Confirm the sandbox DB is isolated before diagnosing recall behavior.

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `feature_flag_reference/soft_delete_tombstones.md` | Scenario contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `mcp_server/lib/search/vector-index-schema.ts` | Schema v37 tombstone partition fields and indexes |
| `mcp_server/handlers/memory-crud.ts` | Delete handler entrypoint |
| `mcp_server/tests/causal-edge-tombstones.vitest.ts` | Tombstone regression coverage |

---

## 5. SOURCE METADATA

- Group: Feature Flag Reference
- Playbook ID: 441
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `feature_flag_reference/soft_delete_tombstones.md`
