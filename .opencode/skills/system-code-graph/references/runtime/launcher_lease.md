---
title: Code Graph Launcher Lease
description: PID-file single-writer lease for the mk-code-index launcher.
---

# Code Graph Launcher Lease

`mk-code-index-launcher.cjs` uses a launcher-local PID file to prevent duplicate code-graph MCP daemons from racing the same SQLite store.

---

## 1. OVERVIEW

### Purpose

The launcher lease is a process-boundary guard. Before bootstrap work begins, the launcher reads `.opencode/.spec-kit/code-graph/database/.mk-code-index-launcher.json` and probes the recorded PID with `process.kill(pid, 0)`.

### When to Use

- Debugging duplicate `mk-code-index` launcher starts.
- Explaining `LEASE_HELD_BY:<pid>` startup output.
- Changing single-writer or stale-reclaim behavior.

### Core Principle

One active launcher owns the code-graph SQLite writer path; stale owners can be reclaimed only after a PID liveness check.

### Key Sources

If the recorded process is alive, the new launcher prints `LEASE_HELD_BY:<pid>` to stdout and exits with code `0`. If the recorded process is gone, the launcher logs `staleReclaimed: true`, continues boot, and overwrites the PID file after bootstrap succeeds.

---

## 2. PID-FILE FORMAT

The PID file lives beside the code-graph SQLite database:

```text
.opencode/.spec-kit/code-graph/database/.mk-code-index-launcher.json
```

The active lease payload is intentionally small:

```json
{
  "pid": 12345,
  "startedAt": "2026-05-18T07:52:00.000Z"
}
```

Writes are atomic: the launcher writes a process-specific temporary file, then renames it over the final path. Cleanup only removes the file when its `pid` still matches the current launcher process, so a disabled parallel launcher cannot cause an older process to delete a newer owner lease.

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

1. Launcher reads the PID file.
2. `process.kill(pid, 0)` throws `ESRCH`.
3. Launcher logs `staleReclaimed: true`.
4. Bootstrap proceeds.
5. Launcher writes a fresh PID file for its own process.

If the OS has reused the recorded PID for another live process, the launcher treats the lease as held. Remove the PID file manually only after verifying no real `mk-code-index-launcher.cjs` owner is running.

---

## 5. RELATED RESOURCES

- `.opencode/bin/mk-code-index-launcher.cjs` owns the inline PID-file primitive.
- [`../config/database_path_policy.md`](../config/database_path_policy.md) documents the code-graph database directory.
- Internal design notes define the propagation contract.
