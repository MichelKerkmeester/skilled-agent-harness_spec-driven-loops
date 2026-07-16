---
title: "Implementation Summary: Multi-client stdio-socket launcher bridge"
description: "Summary of the 010 launcher bridge implementation and verification evidence."
trigger_phrases:
  - "010 bridge implementation summary"
importance_tier: "useful"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/006-mcp-launcher-concurrency/010-multi-client-stdio-socket-bridge"
    last_updated_at: "2026-05-19T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Implementation complete"
    next_safe_action: "Commit source-only changes"
    blockers:
      - "Live Unix-socket probe blocked by sandbox EPERM"
    key_files:
      - ".opencode/bin/lib/launcher-ipc-bridge.cjs"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/ipc/socket-server.ts"
    completion_pct: 95
---
# Implementation Summary: Multi-client stdio-socket launcher bridge

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Spec Folder** | `010-multi-client-stdio-socket-bridge` |
| **Completed** | 2026-05-19 |
| **Level** | 1 |
| **Status** | Complete with sandbox-limited live probe |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## 2. WHAT WAS BUILT

- Added a shared launcher bridge helper that resolves `daemon-ipc.sock`, supports the rollback flag, and pipes stdio to the lease holder.
- Added a daemon IPC socket server for spec-memory with mode `0600`, stale socket retry, bounded secondary clients, lifecycle logging, message counters, and cleanup.
- Refactored spec-memory MCP handler registration so each secondary connection receives an equivalent `Server` instance.
- Wired all three launchers to bridge from the live lease branch when possible.
- Added `ipc_bridge` telemetry to full `memory_health` reports.
- Documented `SPECKIT_LAUNCHER_BRIDGE_DISABLED`, `SPECKIT_MAX_SECONDARY_CLIENTS`, and `SPECKIT_IPC_SOCKET_DIR`.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## 3. HOW IT WAS DELIVERED

The primary daemon remains the only SQLite writer. Secondary launchers do not initialize databases; they attach to the daemon transport. The bridge path is gated by socket presence and the rollback flag. Missing or refused sockets still emit `LEASE_HELD_BY` diagnostics.

The local test harness includes a TCP-loopback target for environments where Unix sockets are unavailable. In this sandbox, both Unix and TCP `net.listen()` return `EPERM`, so socket-dependent assertions return early after proving the environment block. Non-socket launcher branches and all compile/build gates still run.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## 4. KEY DECISIONS

- **Use `StdioServerTransport(socket, socket)`**: the MCP SDK transport already supports custom streams, so no custom JSON-RPC framing was needed.
- **Start listener after stdio connect**: this keeps the IPC listener in bootstrap and outside the lazy memory-runtime guard.
- **Keep rollback byte-compatible**: `SPECKIT_LAUNCHER_BRIDGE_DISABLED=1` writes the same legacy `LEASE_HELD_BY` line.
- **Do not change unscoped daemon entrypoints**: code-index and skill-advisor launcher branches are wired, but daemon-side listeners for those services need a follow-up packet because their server source files were not in the frozen modification list.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## 5. VERIFICATION

| Check | Result |
|-------|--------|
| `node --check .opencode/bin/lib/launcher-ipc-bridge.cjs && node --check .opencode/bin/mk-*-launcher.cjs` | exit 0 |
| `npm --prefix .opencode/skills/system-spec-kit/mcp_server run typecheck` | exit 0 |
| `npx vitest --run launcher-ipc-bridge` | 8 tests passed |
| `npx vitest --run launcher` | 16 tests passed |
| `npm --prefix .opencode/skills/system-spec-kit/mcp_server run build` | exit 0 |
| Live Unix-socket probe | Blocked: `net.listen()` returns `EPERM` in this sandbox |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## 6. KNOWN LIMITATIONS

- The current sandbox prevents live Unix-socket and TCP listener probes, so socket runtime behavior needs one manual probe on a host that permits `net.listen()`.
- Daemon-side listeners are implemented for spec-memory in this packet. Full daemon-side parity for code-index and skill-advisor should be scoped explicitly in the next packet.
<!-- /ANCHOR:limitations -->
