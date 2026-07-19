---
title: "Code Graph Launcher Lease"
description: "Owner and PID single-writer leases for the mk-code-index launcher."
trigger_phrases:
  - "code graph launcher lease"
  - "mk-code-index single writer"
  - "lease held by pid"
  - "stale lease reclaim"
importance_tier: "normal"
contextType: "implementation"
version: 1.2.0.8
---

# Code Graph Launcher Lease

`mk-code-index-launcher.cjs` uses an owner lease plus a launcher-local PID file to prevent duplicate code-graph MCP daemons from racing the same SQLite store.

---

## 1. OVERVIEW

### Purpose

The launcher lease is a process-boundary guard. Before bootstrap work begins, strict mode first acquires `.opencode/skills/system-code-graph/mcp-server/database/.code-graph-owner.json`. After bootstrap, the active launcher writes `.opencode/skills/system-code-graph/mcp-server/database/.mk-code-index-launcher.json` and probes any recorded PID with `process.kill(pid, 0)`.

### When to Use

- Debugging duplicate `mk-code-index` launcher starts.
- Explaining `LEASE_HELD_BY:<pid>` startup output.
- Changing single-writer or stale-reclaim behavior.

### Core Principle

One active owner owns the code-graph SQLite writer path; stale owners can be reclaimed only after liveness and heartbeat checks.

### Key Sources

In strict mode, `launcherMain()` calls `acquireOwnerLeaseFile()` before bootstrap. If a live owner or permission-unknown owner already holds the lease, the launcher calls `bridgeOrReportLeaseHeld()` instead of starting a second daemon. That path bridges this client's stdio to the owner-recorded IPC socket when the owner answers the deep liveness probe. It prints `LEASE_HELD_BY:<pid>` and exits only when the holder is not bridgeable, such as disabled bridging, no usable socket, bridge refusal or a respawn path that cannot safely take ownership.

If the socket is confirmed dead after the configured probe attempts, `bridgeOrReportLeaseHeld()` can take the respawn path. Respawn reaps the recorded owner child when allowed, clears that owner lease, acquires a new owner lease, rebuilds if needed, writes the PID lease and launches a replacement daemon. If the owner lease changes while waiting, the owner cannot be reaped, respawn is disabled or another launcher wins the new owner lease, the launcher reports `LEASE_HELD_BY:<pid>` with a reason suffix instead.

Only secondary code-index clients are reconnect-protected by the session proxy. The owner session is directly attached to the spawned daemon, so the code-index launcher has no transparent recycle for the owner itself; a new launcher/session must attach after owner-side failure. This is the intentional asymmetry with the spec-memory launcher.

---

## 2. LEASE PAYLOADS

Both lease files live beside the code-graph SQLite database:

```text
.opencode/skills/system-code-graph/mcp-server/database/.code-graph-owner.json
.opencode/skills/system-code-graph/mcp-server/database/.mk-code-index-launcher.json
```

The owner lease records the process that owns the single-writer path plus the socket route that secondary launchers should prefer:

```json
{
  "ownerPid": 12345,
  "ppid": 12344,
  "executablePath": "/path/to/node",
  "startedAtIso": "<ISO timestamp>",
  "lastHeartbeatIso": "<ISO timestamp>",
  "ttlMs": 60000,
  "canonicalDbDir": "/path/to/database",
  "socketPath": "/path/to/daemon-ipc.sock"
}
```

The PID lease remains intentionally small:

```json
{
  "pid": 12345,
  "startedAt": "<ISO timestamp>",
  "socketPath": "/path/to/daemon-ipc.sock"
}
```

The payloads are coordination hints, not durable session state. They do not store in-flight tool calls, replay queues, respawn logs or per-client attachments. `socketPath` can be missing on legacy PID leases; in that case the bridge helper recomputes the expected socket path and reports `no-bridge-socket` if no usable endpoint exists.

Writes are atomic: the launcher writes a process-specific temporary file, then renames it over the final path. Cleanup only removes a lease when it still matches the current owner process, so a disabled parallel launcher cannot cause an older process to delete a newer owner lease.

---

## 3. ENV-VAR OVERRIDE

Set `MK_CODE_INDEX_STRICT_SINGLE_WRITER=0` or `MK_CODE_INDEX_STRICT_SINGLE_WRITER=false` to bypass the duplicate-start exit.

When disabled, the launcher logs:

```text
MK_CODE_INDEX_STRICT_SINGLE_WRITER is disabled; skipping lease check
```

Use this only for deliberate local testing. The default behavior is strict single-writer enforcement.

---

## 4. STALE RECLAIM PATH

Stale reclaim handles interrupted owners, especially `SIGKILL` or host crashes that prevent normal cleanup.

1. Launcher reads the owner lease.
2. `classifyOwnerLease()` treats dead PIDs, orphaned owners and expired heartbeats as reclaimable.
3. Live or permission-unknown owners go through `bridgeOrReportLeaseHeld()` instead of a second daemon start.
4. After owner-lease acquisition, the launcher checks the PID lease and any legacy PID leases.
5. A dead PID lease logs `staleReclaimed: true`, bootstrap proceeds and the launcher writes a fresh PID lease after bootstrap succeeds.

If the OS has reused the recorded PID for another live process, the launcher treats the lease as held. Remove lease files manually only after verifying no real `mk-code-index-launcher.cjs` owner is running.

---

## 5. RELATED RESOURCES

- `.opencode/bin/mk-code-index-launcher.cjs` owns the owner and PID lease primitives.
- [`../config/database-path-policy.md`](../config/database-path-policy.md) documents the code-graph database directory.
- Internal design notes define the propagation contract.
