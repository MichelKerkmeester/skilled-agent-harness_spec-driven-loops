---
title: Spec Memory Launcher Lease
description: PID-file single-writer lease for the mk-spec-memory launcher.
---

# Spec Memory Launcher Lease

`mk-spec-memory-launcher.cjs` uses a launcher-local PID file to prevent duplicate spec-memory MCP daemons from racing the same SQLite stores.

---

## 1. OVERVIEW

### Purpose

Define the launcher-local PID-file lease that prevents duplicate mk-spec-memory MCP daemons from racing the same SQLite stores.

### When to Use

Load this reference when diagnosing `LEASE_HELD_BY:<pid>`, stale launcher state, strict single-writer behavior, or manual lease cleanup.

### Core Principle

The launcher may reclaim stale owners, but it must not open a second writer when the recorded owner process is still alive.

### Lease Summary

The launcher lease is a process-boundary guard. Before bootstrap work begins, the launcher reads `.opencode/skills/system-spec-kit/mcp_server/database/.mk-spec-memory-launcher.json` and probes the recorded PID with `process.kill(pid, 0)`.

If the recorded process is alive, the launcher calls `bridgeOrReportLeaseHeld()`, which first attempts to bridge stdio through the existing daemon's session proxy so the second client survives a daemon recycle transparently; it only prints `LEASE_HELD_BY:<pid>` to stdout and exits with code `0` when bridge fallback is unavailable (for example, the bridge module is missing or `SPECKIT_LAUNCHER_BRIDGE_DISABLED=1`). If the recorded process is gone, the launcher logs `staleReclaimed: true`, continues boot, and overwrites the PID file after bootstrap succeeds.

---

## 2. PID-FILE FORMAT

The PID file lives beside the spec-memory launcher database state:

```text
.opencode/skills/system-spec-kit/mcp_server/database/.mk-spec-memory-launcher.json
```

The active lease payload is intentionally small. `pid`, `startedAt`, and `ownerPid` are always present; `childPid` and `modelServerPid` are optional, written only when the launcher has spawned the corresponding child (a context-server child and a model-server process, respectively):

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

## 3. ENV-VAR OVERRIDE

Set `MK_SPEC_MEMORY_STRICT_SINGLE_WRITER=0` or `MK_SPEC_MEMORY_STRICT_SINGLE_WRITER=false` to bypass the duplicate-start exit.

When disabled, the launcher logs:

```text
MK_SPEC_MEMORY_STRICT_SINGLE_WRITER is disabled; skipping lease check
```

Use this only for deliberate local testing. The default behavior is strict single-writer enforcement.

---

## 4. STALE RECLAIM PATH

Stale reclaim handles interrupted owners, especially `SIGKILL` or host crashes that prevent normal cleanup.

1. Launcher reads the PID file.
2. `process.kill(pid, 0)` throws `ESRCH`.
3. Launcher logs `staleReclaimed: true`.
4. Bootstrap proceeds.
5. Launcher writes a fresh PID file for its own process before spawning `context-server.js`.

If the OS has reused the recorded PID for another live process, the launcher treats the lease as held. Remove the PID file manually only after verifying no real `mk-spec-memory-launcher.cjs` owner is running.

---

## 5. RELATED

- `.opencode/bin/mk-spec-memory-launcher.cjs` owns the inline PID-file primitive.
- `.opencode/skills/system-spec-kit/references/memory/memory_system.md` documents spec-memory storage behavior.
- Internal design notes define the propagation contract.
