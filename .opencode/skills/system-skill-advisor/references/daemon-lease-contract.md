---
title: "Daemon Lease Contract"
description: "Workspace single-writer lease semantics for the freshness daemon: lifecycle, contention recovery, stale lease handling, failure modes."
trigger_phrases:
  - "daemon lease contract"
  - "advisor lease semantics"
  - "single writer lease"
importance_tier: "important"
---

# Daemon Lease Contract

<!-- sk-doc-template: skill_reference -->

---

<!-- ANCHOR:1-overview -->
## 1. OVERVIEW

The freshness daemon holds a workspace single-writer lease so two concurrent advisor processes never race on the SQLite skill graph file. This doc defines lease acquisition, heartbeat, release, contention recovery plus stale lease handling. For freshness state transitions see [`freshness-contract.md`](./freshness-contract.md). Source-of-truth: `mcp_server/lib/daemon/lease.ts`.

<!-- /ANCHOR:1-overview -->

---

<!-- ANCHOR:2-lease-lifecycle -->
## 2. LEASE LIFECYCLE

### Launcher-Boundary Enforcement

The `mk-skill-advisor-launcher.cjs` script enforces single-writer semantics at process startup before opening the SQLite skill-graph database. It calls `isLeaseHeld()` from `lib/daemon/lease.ts` to probe the lease state:

- If `held === true && staleReclaimable === false`: the launcher prints `LEASE_HELD_BY:<ownerPid>` to stdout and exits with code 0 without opening the database.
- If `staleReclaimable === true`: the launcher logs `staleReclaimed: true` and continues normal bootstrap (the existing `acquireSkillGraphLease` call reclaims the lease).
- If `held === false`: the launcher continues normal bootstrap.

This enforcement is gated by the `MK_SKILL_ADVISOR_STRICT_SINGLE_WRITER` environment variable (default `1`/true). When set to `0` or `false`, the launcher logs a warning and continues without exiting (dev override).

### Acquire

Daemon attempts lease acquisition on startup. The lease database lives at `.opencode/skills/.advisor-state/skill-graph-daemon-lease.sqlite`. On success it records:

- holder PID
- holder hostname (via owner ID)
- acquisition timestamp
- expected heartbeat interval

If the lease is held by another live process, acquisition fails. The blocking process logs `lease-busy` plus waits with backoff.

### Heartbeat

The lease-holder updates the heartbeat timestamp every 30 seconds. Other daemon instances inspect the timestamp to decide whether the lease is still held.

### Release

On clean shutdown (SIGTERM, MCP server stop) the daemon releases the lease by deleting the lease record. Another waiting daemon then acquires.

### WAL and Busy Timeout Pragmas

Every skill-graph database open sets `PRAGMA journal_mode=WAL` and `PRAGMA busy_timeout=5000` to improve concurrency safety and handle short-term lock contention. If the filesystem is read-only (EACCES), WAL mode falls back to `journal_mode=DELETE` with a logged warning.

<!-- /ANCHOR:2-lease-lifecycle -->

---

<!-- ANCHOR:3-contention-recovery -->
## 3. CONTENTION RECOVERY

When two daemons start within the heartbeat window, both attempt acquisition. The lease file uses atomic create (open-with-O_EXCL) so only one wins. The loser logs `lease-busy holder=<pid>` plus retries with exponential backoff: 1s, 2s, 4s, 8s, 16s, capped at 30s.

If the lease holder responds with an MCP `advisor_status` call showing `live` trust state, the waiter accepts the holder as canonical plus exits without competing. If the holder is unresponsive past 3 retry cycles, the waiter inspects the heartbeat timestamp. If stale (>2x heartbeat interval), the waiter triggers stale-lease recovery (see §4).

<!-- /ANCHOR:3-contention-recovery -->

---

<!-- ANCHOR:4-stale-lease-handling -->
## 4. STALE LEASE HANDLING

A lease is stale when:

1. The recorded PID does not exist in the process table, OR
2. The heartbeat timestamp is older than 2x the heartbeat interval (default 60s), OR
3. The recorded hostname differs from the current host (cross-host lease leak).

Stale-lease recovery procedure:

1. Verify the PID is dead via `kill -0 <pid>`. If `ESRCH`, PID is gone.
2. Verify heartbeat timestamp is older than 60s.
3. If both confirmed, log `stale-lease detected holder=<pid> age=<seconds>`.
4. Delete the lease file.
5. Retry acquisition once via the normal lifecycle.

The lease file deletion is atomic. If two daemons race on stale-lease cleanup, only one wins the re-acquisition.

<!-- /ANCHOR:4-stale-lease-handling -->

---

<!-- ANCHOR:5-failure-modes -->
## 5. FAILURE MODES

| Failure | Symptom | Recovery |
|---|---|---|
| Lease holder PID killed without releasing | New daemon waits forever in `lease-busy` loop | Stale-lease recovery fires after 60s heartbeat timeout. If recovery itself fails, manually delete `mcp_server/database/.skill-graph.lease` |
| Hostname mismatch (cross-host lease leak) | Lease file claims a hostname that is not the current host | Stale-lease recovery fires immediately. The lease file should not survive a workstation reboot if cleanup runs |
| Filesystem locks the lease file | Stale-lease cleanup fails with EBUSY or EPERM | Check filesystem permissions on `mcp_server/database/`. Verify no antivirus or backup process is holding the file open |
| Two daemons acquire concurrently due to filesystem race | SQLite database shows corruption (rare on macOS APFS, possible on NFS) | Stop both daemons. Delete `skill-graph.sqlite{,-wal,-shm}`. Run `advisor_rebuild --force` |
| Heartbeat thread dies but main daemon continues | Lease ages out, waiter triggers stale-lease recovery, kills the lease | Restart the daemon (MCP server restart). Investigate why heartbeat thread crashed |
| Lease file checksum mismatch (corruption) | Daemon refuses to read the lease | Delete the lease file. Re-acquire. The lease format is non-critical state (rebuilds from runtime metadata) |

<!-- /ANCHOR:5-failure-modes -->

---

<!-- ANCHOR:6-related -->
## 6. RELATED

- [`freshness-contract.md`](./freshness-contract.md), daemon responsibilities plus trust state vocabulary
- [`db-path-policy.md`](./db-path-policy.md), where the lease file plus SQLite live
- [`validation-baselines.md`](./validation-baselines.md), latency baselines that depend on lease cleanliness
- `feature_catalog/01--daemon-and-freshness/02-lease.md`, feature inventory entry
- `manual_testing_playbook/05--auto-update-daemon/002-lease-single-writer.md`, operator scenario
- `mcp_server/lib/daemon/lease.ts`, source-of-truth implementation

<!-- /ANCHOR:6-related -->
