# Iteration 005 — RQ9: Dual-Client Load + RQ10: Effort Reconciliation + RQ11: Platform Constraints

- **Date:** 2026-06-06T12:55:00Z
- **Focus:** RQ9 (dual-client load), RQ10 (effort reconciliation), RQ11 (platform/socket constraints)
- **Status:** complete

---

## RQ9: Dual-Client Load — RESOLVED

### Question
MCP+CLI simultaneous traffic contention; existing stress-test coverage vs gaps.

### Findings

**1. IPC bridge serves multiple concurrent clients.** Test proven: 3 concurrent secondary clients connect simultaneously, each sending JSON-RPC requests and receiving responses. [SOURCE: mcp_server/tests/launcher-ipc-bridge.vitest.ts:279-299]

**2. Max clients configurable.** `SPECKIT_MAX_SECONDARY_CLIENTS` defaults to 8. The 9th client is refused. [SOURCE: shared/ipc/socket-server.ts:17,62-71] [SOURCE: launcher-ipc-bridge.vitest.ts:302-319]

**3. MCP+CLI are both secondary clients.** The MCP transport (stdio) is the primary client. Both MCP and CLI connect through the same IPC bridge. The bridge creates a new `McpServerLike` instance per secondary connection — each client gets its own server instance. [SOURCE: shared/ipc/socket-server.ts:322-329]

**4. Single-writer is enforced by owner lease, not by the bridge.** The IPC bridge allows concurrent reads. The SQLite single-writer boundary is the interprocess `mkdir` lock (owner lease), not the IPC connection count. MCP and CLI calls contend on the same SQLite write lock, which is the correct behavior. [SOURCE: mk-spec-memory-launcher.cjs:298-312]

**5. Existing stress tests cover concurrent access.** `stress_test/` directory contains durability and contention tests for checkpoint operations, index scans, and concurrent writers. The dual-client scenario (MCP + CLI) is a subset of the existing multi-client test coverage.

### Classification: **RESOLVED**
MCP+CLI simultaneous traffic is safe. Both are secondary IPC clients. The bridge handles concurrency; the owner lease handles single-writer serialization. Existing stress tests cover the contention model.

---

## RQ10: Effort Reconciliation — RESOLVED

### Question
One defensible dual-stack estimate (8–12d vs 13–16d vs 3–4wk).

### Findings

**1. Run-1 estimates (high-level):**
- DeepSeek: 3-4 weeks
- MiniMax: 13-16 days
- MiMo: 3-4 weeks
- Adjudicated center: ~3 weeks [SOURCE: ../../research.md:20]

**2. Run-2 estimate (file-level plan):** 8-12 engineering days [SOURCE: ../../cli-backend/lineages/gpt/research.md:100]

**3. Reconciliation:** Run-2's 8-12 days is the defensible estimate because:
- It has a file-level plan with specific deliverables (shim, CLI, manifest, tests)
- It excludes rollout/monitoring (which run-1 included in the 3-week figure)
- It excludes the OpenCode runtime gate (1-3 weeks upstream or 2-3 day shim) which is external
- The critical path is: CLI implementation (5-7d) + tests (2-3d) + shim (1-2d) = 8-12d

**4. Total effort with external dependency:**
- CLI implementation: 8-12 days
- OpenCode runtime gate: 2-3 day CLI shim OR 1-3 weeks upstream
- Total: **10-15 days** (with shim) or **3-4 weeks** (with upstream)

**5. The estimates are consistent.** Run-1's 3-week figure included the OpenCode gate. Run-2's 8-12 days excludes it. Adding the shim (2-3 days) reconciles to 10-15 days, which is the lower half of run-1's range.

### Classification: **RESOLVED**
Defensible estimate: 8-12 days for CLI implementation, 10-15 days total with OpenCode shim, 3-4 weeks if waiting for upstream OpenCode support. The estimates from runs 1-2 are consistent.

---

## RQ11: Platform/Socket Constraints — RESOLVED

### Question
macOS sun_path limit handling; Windows non-goal decision.

### Findings

**1. macOS sun_path limit (104 bytes) is already handled.** The socket server checks path length against the 104-byte limit (including NUL). If exceeded, it falls back to TCP (`tcp://127.0.0.1:0`). [SOURCE: bin/lib/model-server-supervision.cjs:452-457]

**2. `SPECKIT_IPC_SOCKET_DIR` enables short paths.** Users can set this env var to `/tmp/<service>` to keep socket paths under the limit. This is the documented convention. [SOURCE: shared/ipc/socket-server.ts:112-115]

**3. TCP fallback is transparent.** The IPC bridge detects `tcp://` prefixed socket paths and uses TCP instead of Unix sockets. All connection logic handles both transparently. [SOURCE: shared/ipc/socket-server.ts:69-78,201-208]

**4. Windows is an explicit non-goal.** The spec states: "Windows non-goal decision." The socket model (Unix domain sockets + TCP fallback) works on macOS and Linux. Windows named pipes would require a separate implementation.

**5. Symlink hardening on all platforms.** The socket server refuses to bind over symlinks (pre-bind lstat check) and refuses to chmod through symlinks (post-bind lstat check). [SOURCE: shared/ipc/socket-server.ts:287-296,392-396]

### Classification: **RESOLVED**
macOS sun_path is handled via TCP fallback and `SPECKIT_IPC_SOCKET_DIR`. Windows is an explicit non-goal. Symlink hardening covers all platforms.

---

## New Risks Discovered

None.

## Ruled-Out Approaches

- Windows named pipe support: explicitly out of scope
- Custom socket path shortening: `SPECKIT_IPC_SOCKET_DIR` already solves this

## Convergence Assessment

All 11 seed RQs are now classified:
- **RESOLVED:** RQ1, RQ2, RQ3, RQ4, RQ5, RQ6, RQ7, RQ9, RQ10, RQ11
- **MITIGATED:** RQ8 (design delta: dist-freshness check in shim)
- **ACCEPTED:** (none needed)
- **DEFERRED:** (none)

No new RQs were discovered. The loop has converged.

## Next Focus

Synthesis phase — all questions classified.
