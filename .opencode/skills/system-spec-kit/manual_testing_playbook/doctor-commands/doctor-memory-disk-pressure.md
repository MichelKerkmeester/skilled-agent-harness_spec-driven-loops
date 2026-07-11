---
title: "DOC-327 -- Doctor memory disk pressure"
description: "Manual scenario validating /doctor memory refusal when the snapshot disk-free preflight has less than two times the memory DB total available."
version: 3.6.0.10
---

# DOC-327 -- Doctor memory disk pressure

## 1. OVERVIEW

This scenario validates the `/doctor memory` disk-pressure refusal path. It runs the real command inside a disposable filesystem whose free space is below the snapshot threshold, then confirms Phase 2 refuses before creating snapshots or mutating the index.

The behavior is user-observable: the command should fail clearly with free-vs-required disk numbers and leave the memory DB untouched.

---

## 2. SCENARIO CONTRACT

- Objective: Snapshot preflight refuses when disk free is less than two times total memory DB size.
- Real user request: `Run /doctor memory --incremental=true with disk near full. Verify the command refuses cleanly.`
- Prompt: `Run /doctor memory --incremental=true with disk near full. Verify the command refuses cleanly.`
- Prompt voice: Natural-human.
- Exact command sequence: create disposable low-free-space fixture -> place workspace inside it -> run `/doctor memory --incremental=true` -> verify refusal, no snapshot, and unchanged DB checksum.
- Expected signals: disk-free preflight runs, refusal message includes free and required bytes, exit is nonzero, no snapshot is created, index checksum is unchanged.
- Desired user-visible outcome: A concise failure verdict explaining the disk pressure and proving the index was untouched.
- Pass/fail: PASS if the command refuses before snapshot or mutation and reports the disk calculation.

---

## 3. TEST EXECUTION

### Prompt

```
Run /doctor memory --incremental=true with disk near full. Verify the command refuses cleanly.
```

### Commands

1. Use a disposable workspace, never the live repository.
2. Create a low-free-space filesystem fixture so `df` reports less than the Phase 2 requirement. On macOS, use a small APFS image; on Linux, use a loopback or container volume created from a truncated fixture.
3. Copy the disposable workspace into the fixture and confirm:
   - `df -k .`
   - free space is less than `2 * (active resolved profile DB bytes + vector DB bytes)`. If the sandbox sets `VOYAGE_API_KEY`, include the profile-specific Voyage DB in the total instead.
4. Record pre-run checksums for both memory DBs.
5. Confirm there are no pre-existing scenario snapshots:
   - `rm -f .opencode/skills/system-spec-kit/mcp_server/database/context-index*.sqlite.pre-doctor-memory.*.bak`
6. Run `/doctor memory --incremental=true` through the real runtime.
7. Capture the refusal output and process exit code.
8. Confirm no matching snapshot exists:
   - `test -z "$(ls .opencode/skills/system-spec-kit/mcp_server/database/context-index__*.sqlite.pre-doctor-memory.*.bak 2>/dev/null)"`
9. Recompute both DB checksums and compare them to the pre-run values.

### Expected

The command reaches Phase 2 in `.opencode/commands/doctor/assets/doctor_memory.yaml`, calculates current DB total size and free space, refuses because `free_space < 2x DB total`, prints a clear diagnostic containing free and required values, exits nonzero, and does not create a `pre-doctor-memory` snapshot or mutate either live DB.

### Evidence

- BLOCKED before command execution: the scenario requires creating a disposable low-free-space filesystem fixture and copying the workspace into it, but the active task constraints state: `Do NOT modify, create, or delete any file OTHER than the single scenario file named below.`
- No `df -k .` output from a low-free-space fixture was captured because creating the fixture would violate the allowed write path.
- No DB size calculation, DB checksums, `/doctor memory --incremental=true` refusal output, exit code, or snapshot check was captured because the precondition fixture could not be created under the active constraints.

### Pass / Fail

- **BLOCKED**: The required disposable low-free-space fixture cannot be created without violating the active instruction that no file may be created, modified, or deleted except this scenario file.

### Failure Triage

If the command proceeds, inspect Phase 2 disk-free preflight in `doctor_memory.yaml`. If a snapshot is created despite refusal text, treat it as a fail because mutation boundaries were crossed. If checksums differ, inspect whether `memory_index_scan` started before the disk check; Phase 2 must halt before Phase 3.

---

## 4. SOURCE FILES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Command entrypoint: `.opencode/commands/doctor/speckit.md`
- YAML asset: `.opencode/commands/doctor/assets/doctor_memory.yaml`
- Command contract: local doctor command behavior
- Decision context: local doctor command ADRs

---

## 5. SOURCE METADATA

- Group: Doctor Commands
- Playbook ID: DOC-327
- Command under test: `/doctor memory --incremental=true`
- Mode: single interactive mutation flow
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `doctor-commands/doctor-memory-disk-pressure.md`
- Runtime policy: Real execution only; disk pressure must come from a real constrained filesystem.
- Destructive: Yes, but sandbox-only; refusal should prevent mutation.
