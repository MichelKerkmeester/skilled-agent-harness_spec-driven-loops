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

Workspace single-writer lease semantics for the freshness daemon: lifecycle, contention recovery, stale lease handling, failure modes.

---

## 1. OVERVIEW

### Purpose

Defines workspace single-writer lease semantics for the advisor freshness daemon.

### When to Use

- Debugging daemon contention, stale lease files or SQLite busy failures.
- Reviewing launcher-boundary behavior or lease sidecar location.
- Checking why two advisor processes must not write concurrently.

### Core Principle

Only one advisor daemon may hold the workspace lease for a resolved database directory at a time.

### Key Sources

- `mcp_server/lib/daemon/lease.ts`
- [`freshness_contract.md`](./freshness_contract.md)
- [`db_path_policy.md`](../config/db_path_policy.md)

---

## 2. LEASE LIFECYCLE

### Launcher-Boundary Enforcement

The `mk-skill-advisor-launcher.cjs` script enforces single-writer semantics at process startup before opening the SQLite skill-graph database. It calls `isLeaseHeld()` from `lib/daemon/lease.ts` to probe the lease state:

- If `held === true && staleReclaimable === false`: the launcher prints `LEASE_HELD_BY:<ownerPid>` to stdout and exits with code 0 without opening the database.
- If `staleReclaimable === true`: the launcher logs `staleReclaimed: true` and continues normal bootstrap (the existing `acquireSkillGraphLease` call reclaims the lease).
- If `held === false`: the launcher continues normal bootstrap.

This enforcement is gated by the `MK_SKILL_ADVISOR_STRICT_SINGLE_WRITER` environment variable (default `1`/true). When set to `0` or `false`, the launcher logs a warning and continues without exiting (dev override).

### Acquire

Daemon attempts lease acquisition on startup. The lease database lives next to the canonical skill graph database directory as `skill-graph-daemon-lease.sqlite`. Canonical means lexical `path.resolve()` followed by `fs.realpathSync.native()` when the path exists; if the directory did not exist yet, the daemon creates it and canonicalizes again before deriving the `workspace_key`.

With the default configuration that directory is `.opencode/skills/system-skill-advisor/mcp_server/database/`. With `MK_SKILL_ADVISOR_DB_DIR` or `SYSTEM_SKILL_ADVISOR_DB_DIR`, the override relocates both `skill-graph.sqlite` and `skill-graph-daemon-lease.sqlite` together. On success the lease row records:

- holder PID
- holder owner ID
- acquisition timestamp
- expected heartbeat interval

If the lease is held by another live process, acquisition fails. The blocking process logs `lease-busy` plus waits with backoff.

### Heartbeat

The lease-holder updates the heartbeat timestamp every 30 seconds. Other daemon instances inspect the timestamp to decide whether the lease is still held.

### Release

On clean shutdown (SIGTERM, MCP server stop) the daemon releases the lease by deleting the lease record. Another waiting daemon then acquires.

### WAL and Busy Timeout Pragmas

Every skill-graph database open sets `PRAGMA journal_mode=WAL` and `PRAGMA busy_timeout=5000` to improve concurrency safety and handle short-term lock contention. If the filesystem is read-only (EACCES), WAL mode falls back to `journal_mode=DELETE` with a logged warning.

---

## 3. CONTENTION RECOVERY

When two daemons start within the heartbeat window, both attempt acquisition. The lease database enforces a single row per canonical database-directory `workspace_key`, so only one owner can hold the lease for a given SQLite directory. The loser logs `lease-busy holder=<pid>` plus retries with exponential backoff: 1s, 2s, 4s, 8s, 16s, capped at 30s.

If the lease holder responds with an MCP `advisor_status` call showing `live` trust state, the waiter accepts the holder as canonical plus exits without competing. If the holder is unresponsive past 3 retry cycles, the waiter inspects the heartbeat timestamp. If stale (>2x heartbeat interval), the waiter triggers stale-lease recovery (see §4).

---

## 4. STALE LEASE HANDLING

A lease is stale when:

1. The recorded PID does not exist in the process table, OR
2. The heartbeat timestamp is older than 2x the heartbeat interval (default 60s), OR
3. The lease row is present but no live owner can be verified.

Stale-lease recovery procedure:

1. Verify the PID is dead via `kill -0 <pid>`. If `ESRCH`, PID is gone.
2. Verify heartbeat timestamp is older than 60s.
3. If both confirmed, log `stale-lease detected holder=<pid> age=<seconds>`.
4. Delete the lease row.
5. Retry acquisition once via the normal lifecycle.

The lease row deletion is guarded by owner ID. If two daemons race on stale-lease cleanup, only one wins the re-acquisition.

### Legacy Probe During Rolling Starts

During the Phase 006 compatibility window, launcher startup also probes the old lease database at `.opencode/skills/.advisor-state/skill-graph-daemon-lease.sqlite`. If that legacy database contains a live owner, the launcher exits `0` with `LEASE_HELD_BY:<pid> ... (legacy path)` and does not open the skill graph DB. If the legacy owner is stale or dead, startup logs the stale legacy observation and proceeds with the canonical lease beside the resolved DB directory. The launcher observes but does not migrate the legacy database.

---

## 5. FAILURE MODES

| Failure | Symptom | Recovery |
|---|---|---|
| Lease holder PID killed without releasing | New daemon waits until the row is stale | Stale-lease recovery fires after heartbeat timeout. If recovery itself fails, inspect `skill-graph-daemon-lease.sqlite` beside the DB directory |
| Legacy rolling-start owner still alive | New launcher prints `LEASE_HELD_BY:<pid> ... (legacy path)` | Stop the old owner or wait for it to exit, then restart with the canonical lease path |
| Filesystem locks the lease database | Stale-lease cleanup fails with EBUSY or EPERM | Check filesystem permissions on the resolved database directory. Verify no antivirus or backup process is holding the file open |
| Two daemons acquire concurrently due to filesystem race | SQLite database shows corruption (rare on macOS APFS, possible on NFS) | Stop both daemons. Delete `skill-graph.sqlite{,-wal,-shm}`. Run `advisor_rebuild --force` |
| Heartbeat thread dies but main daemon continues | Lease ages out, waiter triggers stale-lease recovery, kills the lease | Restart the daemon (MCP server restart). Investigate why heartbeat thread crashed |
| Lease database corruption | Daemon refuses to read the lease | Delete `skill-graph-daemon-lease.sqlite`. Re-acquire. The lease format is non-critical state |

---

## 6. DATABASE DIRECTORY OVERRIDE CONSTRAINT

`MK_SKILL_ADVISOR_DB_DIR` and `SYSTEM_SKILL_ADVISOR_DB_DIR` override the skill graph database directory. The daemon lease database is co-located with that canonical directory, so two workspaces pointing at the same SQLite directory through different symlinks or path aliases share the same single-writer boundary.

This keeps "same SQLite file" and "same lease owner" aligned:

- Two launchers in different workspaces pointing at the same shared DB directory contend on the same lease and the second launcher exits with `LEASE_HELD_BY:<pid>`.
- Two launchers in one workspace pointing at different DB directories use different lease files and can run independently because they write different databases.

Recommended operator practice: keep strict single-writer mode enabled unless the intent is an isolated test run against separate DB directories.

---

## 7. CLEANUP ORDERING INVARIANT

The launcher keeps `process.on('exit', clearLeaseFile)` as a normal-exit backstop, but signal mirroring cannot rely on it. If a child exits due to `SIGKILL`, Node cannot run parent `exit` handlers after `process.kill(process.pid, 'SIGKILL')`. The launcher therefore calls `clearLeaseFile()` synchronously before mirroring any child exit signal, and parent signal handlers clear the lease before exiting after the 5s SIGKILL backstop.

---

## 8. RELATED

- [`freshness_contract.md`](./freshness_contract.md), daemon responsibilities plus trust state vocabulary
- [`db_path_policy.md`](../config/db_path_policy.md), where the lease file plus SQLite live
- [`validation_baselines.md`](../scoring/validation_baselines.md), latency baselines that depend on lease cleanliness
- `feature_catalog/01--daemon-and-freshness/lease.md`, feature inventory entry
- `manual_testing_playbook/05--auto-update-daemon/lease-single-writer.md`, operator scenario
- `mcp_server/lib/daemon/lease.ts`, source-of-truth implementation
