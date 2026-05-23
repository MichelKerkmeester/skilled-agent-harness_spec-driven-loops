---
title: "DOC-326 -- Doctor memory SIGINT cancellation"
description: "Manual scenario validating graceful Ctrl-C handling during /doctor memory full rebuild, including ADR-001 settle, snapshot restore, and exit 130."
---

# DOC-326 -- Doctor memory SIGINT cancellation

## 1. OVERVIEW

This scenario validates cancellation safety for a full `/doctor memory --incremental=false` rebuild. It starts a real rebuild, sends Ctrl-C after roughly 30 seconds, and verifies the command lets the active per-file transaction settle, restores the pre-rebuild snapshot, records cancellation, and exits 130.

This scenario is destructive and requires a disposable Docker-backed sandbox. If Docker is not available, the truthful verdict is `UNAUTOMATABLE`, because ADR-001 only matters when real per-file transactions are exercised under process cancellation.

---

## 2. SCENARIO CONTRACT

- Objective: Graceful SIGINT cancellation with snapshot restore and no half-rebuilt index.
- Real user request: `Start a full rebuild and Ctrl-C it after about 30 seconds. Verify the index is not half-rebuilt.`
- Prompt: `Start a full rebuild and Ctrl-C it after ~30 seconds. Verify the index isn't half-rebuilt.`
- Prompt voice: Natural-human.
- Exact command sequence: verify Docker -> create disposable workspace -> record pre-rebuild DB checksum -> start full apply -> send SIGINT -> wait for settle -> compare restored DB checksum and exit code.
- Expected signals: SIGINT caught, current per-file transaction settles within roughly 5 seconds, snapshots restored, state log records cancel timestamp, process exits 130.
- Desired user-visible outcome: A cancellation verdict proving the index matches the pre-rebuild snapshot rather than a partial rebuild.
- Pass/fail: PASS only when exit code is 130 and the post-cancel index matches the pre-rebuild snapshot.

---

## 3. TEST EXECUTION

### Prompt

```
Start a full rebuild and Ctrl-C it after ~30 seconds. Verify the index isn't half-rebuilt.
```

### Commands

1. Verify Docker daemon availability:
   - `docker info`
2. If Docker is unavailable, mark the scenario `UNAUTOMATABLE` and stop.
3. Create a disposable Docker-backed workspace from the current repository.
4. Confirm both memory DBs exist and at least one pre-doctor snapshot can be created.
5. Record pre-rebuild checksums:
   - `shasum .opencode/skills/system-spec-kit/mcp_server/database/context-index__*.sqlite`
   - If `VOYAGE_API_KEY` is set for the sandbox, the active resolved profile may be Voyage; record that checksum as a valid profile-specific example, e.g. `.opencode/skills/system-spec-kit/mcp_server/database/context-index__voyage__voyage-4__1024__cloud.sqlite`.
6. Start `/doctor memory --incremental=false` in the real runtime.
7. After the command enters Phase 3 rebuild, send Ctrl-C after roughly 30 seconds.
8. Wait for the command to settle; record whether restore finishes within roughly 5 seconds after SIGINT handling begins.
9. Capture the process exit code.
10. Recompute both DB checksums and compare them to the pre-rebuild snapshot or copied pre-run DBs.
11. Capture the state log entry containing cancellation timestamp and rollback reason.

### Expected

The command catches SIGINT during Phase 3, allows the active per-file transaction to commit or abort per ADR-001, restores both memory DBs from the Phase 2 snapshots, writes a cancellation state log, and exits 130. The post-cancel index must match the pre-rebuild snapshot or the pre-run DB copy used as the comparison baseline.

### Evidence

- `docker info` transcript proving the daemon was available, or the `UNAUTOMATABLE` reason if not.
- Pre-rebuild checksums for both memory DBs.
- Transcript showing Ctrl-C was sent during rebuild.
- State log with cancel timestamp, rollback reason, and snapshot restore paths.
- Exit code `130`.
- Post-cancel checksums matching the pre-rebuild snapshot or pre-run copied DBs.

### Pass / Fail

- **PASS**: SIGINT is caught, restore completes after the ADR-001 settle window, exit code is 130, and post-cancel DB checksums match the pre-rebuild snapshot baseline.
- **FAIL**: Exit code is not 130, restore is skipped, the post-cancel DB differs from the snapshot baseline, or the command leaves a half-rebuilt index.
- **SKIP**: Only use `SKIP` for a temporary sandbox setup failure after Docker availability is proven.
- **UNAUTOMATABLE**: Docker daemon is unavailable; do not substitute a mock cancellation test.

### Failure Triage

If exit code is not 130, inspect signal handling in the apply workflow before checking data integrity. If the index differs from the snapshot baseline, treat it as a hard failure even when the report says rollback completed. If the settle window is much longer than expected, compare the active file count and ADR-001 per-file transaction assumption against `decision-record.md`.

---

## 4. SOURCE FILES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Command entrypoint: `.opencode/commands/doctor/help.md`
- YAML asset: `.opencode/commands/doctor/assets/doctor_memory.yaml`
- Command contract: local doctor command behavior
- Decision context: local doctor command ADRs

---

## 5. SOURCE METADATA

- Group: Doctor Commands
- Playbook ID: DOC-326
- Command under test: `/doctor memory --incremental=false`
- Mode: single interactive mutation flow
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `23--doctor-commands/326-doctor-memory-sigint-cancellation.md`
- Runtime policy: Real execution only; Docker daemon required for truthful cancellation evidence.
- Destructive: Yes; Docker-backed disposable sandbox only.
