---
title: "DOC-326 -- Doctor memory SIGINT cancellation"
description: "Manual scenario validating graceful Ctrl-C handling during /doctor memory full rebuild, including ADR-001 settle, snapshot restore, and exit 130."
version: 3.6.0.10
id: doctor-commands-doctor-memory-sigint-cancellation
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# DOC-326 -- Doctor memory SIGINT cancellation

## 1. OVERVIEW

This scenario validates cancellation safety for a full `/doctor memory --incremental=false` rebuild. It starts a real rebuild, sends Ctrl-C after roughly 30 seconds, and verifies the command lets the active per-file transaction settle, restores the pre-rebuild snapshot, records cancellation, and exits 130.

This scenario is destructive and requires a disposable Docker-backed sandbox. SKIP only when the Docker daemon is unavailable and `docker info` cannot connect — do not substitute a non-Docker sandbox, because ADR-001 only matters when real per-file transactions are exercised under process cancellation.

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
2. If Docker is unavailable, record `SKIP` with that missing-runtime blocker named explicitly, and stop.
3. Create a disposable Docker-backed workspace from the current repository.
4. Confirm both memory DBs exist and at least one pre-doctor snapshot can be created.
5. Record pre-rebuild checksums:
   - `shasum .opencode/skills/system-spec-kit/mcp-server/database/context-index__*.sqlite`
   - If `VOYAGE_API_KEY` is set for the sandbox, the active resolved profile may be Voyage; record that checksum as a valid profile-specific example, e.g. `.opencode/skills/system-spec-kit/mcp-server/database/context-index__voyage__voyage-4__1024__cloud.sqlite`.
6. Start `/doctor memory --incremental=false` in the real runtime.
7. After the command enters Phase 3 rebuild, send Ctrl-C after roughly 30 seconds.
8. Wait for the command to settle; record whether restore finishes within roughly 5 seconds after SIGINT handling begins.
9. Capture the process exit code.
10. Recompute both DB checksums and compare them to the pre-rebuild snapshot or copied pre-run DBs.
11. Capture the state log entry containing cancellation timestamp and rollback reason.

### Expected

The command catches SIGINT during Phase 3, allows the active per-file transaction to commit or abort per ADR-001, restores both memory DBs from the Phase 2 snapshots, writes a cancellation state log, and exits 130. The post-cancel index must match the pre-rebuild snapshot or the pre-run DB copy used as the comparison baseline.

### Evidence

- `docker info` output: a reachable daemon prints a `Client:` block followed by a populated `Server:` block; an unreachable daemon prints a `Client:` block and then reports `failed to connect to the docker API at unix://<socket path>` under `Server:` with no server details.
- When the daemon is reachable: the pre-rebuild and post-cancel checksums from Commands 5 and 10, the captured process exit code from Command 9, and the state log entry from Command 11 (cancellation timestamp and rollback reason).
- When the daemon is unreachable: the exact `docker info` failure text, confirming execution stopped before creating a disposable workspace, recording checksums, starting `/doctor memory --incremental=false`, sending Ctrl-C, capturing a state log, or comparing post-cancel checksums.

### Pass / Fail

- **Pass**: exit code is 130 and the post-cancel index matches the pre-rebuild snapshot or the pre-run DB copy used as the comparison baseline.
- **Fail**: exit code is not 130, the post-cancel index diverges from the snapshot, or the state log is missing the cancellation entry.

### Failure Triage

If exit code is not 130, inspect signal handling in the apply workflow before checking data integrity. If the index differs from the snapshot baseline, treat it as a hard failure even when the report says rollback completed. If the settle window is much longer than expected, compare the active file count and ADR-001 per-file transaction assumption against `decision-record.md`.

---

## 4. SOURCE FILES

- Root playbook: [manual-testing-playbook.md](../../manual-testing-playbook/manual-testing-playbook.md)
- Command entrypoint: `.opencode/commands/doctor/speckit.md`
- YAML asset: `.opencode/commands/doctor/assets/doctor-memory.yaml`
- Command contract: local doctor command behavior
- Decision context: local doctor command ADRs

---

## 5. SOURCE METADATA

- Group: Doctor Commands
- Playbook ID: DOC-326
- Command under test: `/doctor memory --incremental=false`
- Mode: single interactive mutation flow
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `doctor-commands/doctor-memory-sigint-cancellation.md`
- Runtime policy: Real execution only; Docker daemon required for truthful cancellation evidence.
- Destructive: Yes; Docker-backed disposable sandbox only.
