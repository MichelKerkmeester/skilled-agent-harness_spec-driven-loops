# Iteration 001 — RQ1: Daemon-Bypass Enforcement + RQ3: Lease/Spawn Races

- **Date:** 2026-06-06T12:35:00Z
- **Focus:** RQ1 (daemon-bypass enforcement) and RQ3 (lease/spawn races) — the two HIGH-severity structural risks
- **Status:** complete

---

## RQ1: Daemon-Bypass Enforcement — RESOLVED

### Question
Can the public CLI provably never open the database directly? What admin direct-DB paths exist? What is the unix-socket trust model?

### Findings

**1. Public CLI is IPC-only by design.** The proposed `spec-memory` CLI architecture (run-2 verdict) calls the daemon via `daemon-ipc.sock` JSON-RPC, identical to how MCP clients connect. The CLI is another IPC client — it does NOT open `better-sqlite3` directly. [SOURCE: ../../cli-backend/lineages/gpt/research.md:42]

**2. Admin direct-DB path exists: `cli.ts`.** The existing `cli.ts` opens the database directly via `better-sqlite3` for maintenance operations (stats, bulk-delete, reindex, schema-downgrade). This is the ONLY non-daemon code path that touches the DB. It is explicitly an admin tool, not part of the public 37-tool CLI surface. [SOURCE: mcp_server/cli.ts:1-13]

**3. Socket permission model is defense-in-depth:**
- Socket dir created with `mode: 0o700` (owner-only) [SOURCE: shared/ipc/socket-server.ts:266]
- Pre-existing dirs checked: must be owned by current uid, not group/world-writable [SOURCE: shared/ipc/socket-server.ts:271-278]
- Symlink at socket path rejected before bind (prevents chmod redirection) [SOURCE: shared/ipc/socket-server.ts:287-291]
- Post-bind: lstat verifies real socket (not symlink), then `chmod 0o600` [SOURCE: shared/ipc/socket-server.ts:392-396]
- Stale socket reclaim: only if parent is within allowed roots AND socket is owned by current uid [SOURCE: shared/ipc/socket-server.ts:146-178]

**4. Allowed socket roots:** workspace root, `os.tmpdir()`, `/tmp`. Enforced by `isWithinAllowedSocketRoot()`. [SOURCE: shared/ipc/socket-server.ts:117-127]

**5. CLI cannot bypass daemon.** The public CLI surface will be generated from `TOOL_DEFINITIONS` and call through IPC. There is no design path for the public CLI to open the database. The admin `cli.ts` remains separate and is NOT part of the migration scope.

### Classification: **RESOLVED**
The public CLI is provably IPC-only. Admin direct-DB paths (`cli.ts`) exist but are explicitly out of scope for the CLI migration. Socket permissions (0o600, uid ownership, symlink rejection) provide defense-in-depth.

---

## RQ3: Lease/Spawn Races — RESOLVED

### Question
CLI auto-spawn vs MCP-owned daemon: what happens? Two CLIs spawning simultaneously? Who reaps a CLI-spawned daemon?

### Findings

**1. Owner lease is the single-writer gate.** The launcher acquires `.spec-memory-owner.json` via exclusive `open('wx')` (atomic create). Only one launcher can hold this lease at a time. [SOURCE: mk-spec-memory-launcher.cjs:298-312]

**2. Lease classification prevents stale ownership.** Before claiming a lease, the launcher classifies it:
- `stale-pid`: owner PID is dead → reclaim
- `ppid-1-orphan`: owner's parent is init → reclaim  
- `stale-heartbeat-reclaim`: heartbeat expired (>2x TTL of 60s) → reclaim
- `live-owner`: active owner → bridge or exit [SOURCE: mk-spec-memory-launcher.cjs:346-363]

**3. Two launchers racing a stale lease:** After reclaiming, the launcher re-reads the lease file to confirm it won. If another launcher wrote in between, the re-read detects the mismatch and the loser yields. [SOURCE: mk-spec-memory-launcher.cjs:391-402]

**4. CLI auto-spawn uses the same launcher.** The proposed CLI auto-spawn would invoke `mk-spec-memory-launcher.cjs` (the existing launcher), which has all the lease protection. There is no new spawn path — the CLI falls back to the same launcher that MCP clients use. [SOURCE: ../../cli-backend/lineages/gpt/research.md:26]

**5. Bootstrap lock prevents concurrent builds.** The `acquireBootstrapLock()` uses `mkdir` (atomic on POSIX) with stale reclaim (mtime-based). Only one launcher builds the daemon at a time. [SOURCE: mk-spec-memory-launcher.cjs:1151-1193]

**6. CLI-spawned daemon lifetime:** When the CLI spawns via the launcher, the launcher owns the daemon child process. The launcher's heartbeat (30s interval, 60s TTL) keeps the owner lease alive. When the launcher exits (or its parent exits), the lease becomes stale and the next launcher reclaims it. The daemon is reaped by the launcher's child exit handler. [SOURCE: mk-spec-memory-launcher.cjs:1229-1251]

**7. Orphan risk: mitigated by existing mechanisms.** The 2026-06-06 observation of 6 orphaned `mk-skill-advisor` launchers was caused by a different service's launcher, not `mk-spec-memory`. The spec-memory launcher has:
- Owner lease heartbeat with TTL
- `ppid-1-orphan` detection
- RSS watchdog with crash-loop guard
- Process tree reaping on shutdown [SOURCE: mk-spec-memory-launcher.cjs:427-442, 1104-1121]

### Classification: **RESOLVED**
CLI auto-spawn reuses the existing launcher with full lease protection. Simultaneous spawns are handled by the atomic owner lease + re-read CAS. Daemon lifetime is managed by the launcher's heartbeat and child reaping. The orphan risk is mitigated by ppid-1 detection and stale-heartbeat reclaim.

---

## New Risks Discovered

None in this iteration. The lease and socket mechanisms are well-defended.

---

## Ruled-Out Approaches

- Direct DB access from the public CLI: impossible by design (IPC-only surface)
- New spawn mechanism for CLI: unnecessary; existing launcher handles it

## Next Focus

Iteration 2: RQ2 (Schema-drift mechanics) + RQ4 (Retryable taxonomy)
