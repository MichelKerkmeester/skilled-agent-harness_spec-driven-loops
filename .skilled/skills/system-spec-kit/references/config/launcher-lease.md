---
title: Launcher Lease
description: PID-file single-writer lease for the skill-advisor launcher.
trigger_phrases:
  - "skill advisor launcher lease"
  - "pid-file single-writer lease"
  - "stale reclaim path"
  - "lease env-var override"
importance_tier: normal
contextType: implementation
version: 3.6.0.6
---

# Launcher Lease

`system-skill-advisor-launcher.cjs` uses a launcher-local PID file to prevent duplicate advisor MCP daemons from racing the same SQLite stores.

---

## 1. OVERVIEW

### Purpose

Define the launcher-local PID-file lease that prevents duplicate advisor MCP daemons from racing the same SQLite stores.

### When to Use

Load this reference when diagnosing `LEASE_HELD_BY:<pid>`, stale launcher state, strict single-writer behavior, or manual lease cleanup.

### Core Principle

The launcher may reclaim stale owners, but it must not open a second writer when the recorded owner process is still alive.

### Lease Summary

The launcher lease is a process-boundary guard. Before bootstrap work begins, the launcher reads `.system-skill-advisor-launcher.json` from its database directory and probes the recorded PID with `process.kill(pid, 0)`.

If the recorded process is alive, the launcher calls `bridgeOrReportLeaseHeld()`, which first attempts to bridge stdio through the existing daemon's session proxy so the second client survives a daemon recycle transparently; it only prints `LEASE_HELD_BY:<pid>` to stdout and exits with code `0` when bridge fallback is unavailable (for example, the bridge module is missing or `SPECKIT_LAUNCHER_BRIDGE_DISABLED=1`). If the recorded process is gone, the launcher logs `staleReclaimed: true`, continues boot, and overwrites the PID file after bootstrap succeeds.

---

## 2. PID-FILE FORMAT

The PID file lives beside the launcher's database state, under `SYSTEM_SKILL_ADVISOR_DB_DIR`:

```text
<SYSTEM_SKILL_ADVISOR_DB_DIR>/.system-skill-advisor-launcher.json
```

The active lease payload is intentionally small. `pid`, `startedAt`, and `ownerPid` are always present; `childPid` and `modelServerPid` are optional, written only when the launcher has spawned the corresponding child (a daemon child and a model-server process, respectively):

```json
{
  "pid": 12345,
  "startedAt": "2026-05-18T07:52:00.000Z",
  "ownerPid": 12345,
  "childPid": 12346,
  "modelServerPid": 12347
}
```

Writes are atomic: the launcher writes a process-specific temporary file, then renames it over the final path. Cleanup only removes the file when its `pid` still matches the current launcher process, so a disabled parallel launcher cannot cause an older process to delete a newer owner lease.

---

## 3. NO BYPASS FLAG

The retired spec-memory launcher carried an env-var bypass for the duplicate-start exit. The advisor launcher exposes no equivalent flag: the lease check always runs, and strict single-writer enforcement is the only behavior. Diagnose a `LEASE_HELD_BY:<pid>` line by finding the recorded owner, not by disabling the guard.

---

## 4. STALE RECLAIM PATH

Stale reclaim handles interrupted owners, especially `SIGKILL` or host crashes that prevent normal cleanup.

1. Launcher reads the PID file.
2. `process.kill(pid, 0)` throws `ESRCH`.
3. Launcher logs `staleReclaimed: true`.
4. Bootstrap proceeds.
5. Launcher writes a fresh PID file for its own process before spawning `advisor-server.js`.

If the OS has reused the recorded PID for another live process, the launcher treats the lease as held. Remove the PID file manually only after verifying no real `system-skill-advisor-launcher.cjs` owner is running.

---

## 5. RELATED

- `.opencode/bin/system-skill-advisor-launcher.cjs` owns the inline PID-file primitive.
- `.opencode/skills/system-spec-kit/references/retrieval/retrieval-conventions.md` covers spec-folder retrieval, which needs no launcher and no lease.
- Internal design notes define the propagation contract.
