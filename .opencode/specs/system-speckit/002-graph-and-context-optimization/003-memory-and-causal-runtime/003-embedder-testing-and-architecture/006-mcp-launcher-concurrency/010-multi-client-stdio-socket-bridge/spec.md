---
title: "Multi-client stdio-socket launcher bridge"
description: "Add a launcher bridge so secondary MCP launcher instances can attach to the primary daemon over an IPC socket instead of exiting with LEASE_HELD_BY."
trigger_phrases:
  - "multi-client launcher bridge"
  - "stdio socket bridge"
  - "010 bridge"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/006-mcp-launcher-concurrency/010-multi-client-stdio-socket-bridge"
    last_updated_at: "2026-05-19T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Implemented bridge source and docs"
    next_safe_action: "Commit source-only changes on main"
    blockers: []
    key_files:
      - ".opencode/bin/lib/launcher-ipc-bridge.cjs"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/ipc/socket-server.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/context-server.ts"
      - ".opencode/bin/mk-spec-memory-launcher.cjs"
      - ".opencode/bin/mk-code-index-launcher.cjs"
      - ".opencode/bin/mk-skill-advisor-launcher.cjs"
---
# Multi-client stdio-socket launcher bridge

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

Secondary MCP launcher sessions should attach to the already-running daemon instead of reporting a failed MCP connection.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-05-19 |
| **Branch** | `main` |
| **Parent Arc** | 006-mcp-launcher-concurrency |
| **Predecessor** | `009-launcher-eperm-parity-fix` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The 006 arc made the three MCP launchers strict-single-writer. That protected SQLite, but a second MCP host session saw `LEASE_HELD_BY:<pid>` and an immediate launcher exit, which the host interpreted as JSON-RPC `-32000`.

This packet preserves the single writer invariant while allowing multiple stdio MCP clients to share one daemon. The primary daemon keeps the SQLite handle. Secondary launchers bridge their stdio streams to the daemon IPC socket when the live lease holder exposes one.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

| Area | In scope |
|------|----------|
| Daemon IPC | Add a spec-memory daemon socket listener at `<dbDir>/daemon-ipc.sock` after stdio connect. |
| Launchers | Add bridge mode to mk-spec-memory, mk-code-index, and mk-skill-advisor lease-held branches. |
| Shared code | Add `.opencode/bin/lib/launcher-ipc-bridge.cjs` and `mcp_server/lib/ipc/socket-server.ts`. |
| Health and docs | Expose bridge counters in full memory health and document the operator flags. |
| Tests | Add targeted Vitest coverage for bridge helper, lease-held branches, daemon listener behavior, concurrency cap, and cleanup. |

Out of scope: changing the lease owner model, opening additional SQLite writers, generated `dist/` artifacts in the commit, and non-MCP health-check invocation behavior.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

- **REQ-001**: The primary spec-memory daemon starts an IPC listener after stdio `server.connect()` and before lazy memory runtime initialization.
- **REQ-002**: Secondary launchers bridge stdio to the IPC socket when a live lease exists and the bridge is not disabled.
- **REQ-003**: `SPECKIT_LAUNCHER_BRIDGE_DISABLED=1` preserves legacy `LEASE_HELD_BY` output.
- **REQ-004**: Missing or refused sockets fall back to `LEASE_HELD_BY` diagnostics instead of opening a second daemon.
- **REQ-005**: The daemon caps secondary clients with `SPECKIT_MAX_SECONDARY_CLIENTS` defaulting to 8.
- **REQ-006**: Full `memory_health` reports include bridge path, active secondary count, and message counters.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Strict packet validation passes.
- **SC-002**: MCP server typecheck and build pass.
- **SC-003**: `launcher-ipc-bridge` Vitest suite passes with at least 8 tests.
- **SC-004**: Existing launcher regression tests still pass.
- **SC-005**: A real socket-capable host can start the daemon, observe `<dbDir>/daemon-ipc.sock` mode `0600`, and send `tools/list` through a secondary bridge.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Risk | Mitigation |
|------|------------|
| Multiplexing could accidentally bypass single-writer safety | Only the primary daemon owns SQLite; secondary clients are transports into the same process. |
| Socket file could survive a crash | Listener retries once on `EADDRINUSE`, shutdown closes clients and unlinks the socket. |
| Too many secondary sessions could overload the daemon | Default cap is 8 and can be tuned via `SPECKIT_MAX_SECONDARY_CLIENTS`. |
| Rollback may be needed during operator debugging | `SPECKIT_LAUNCHER_BRIDGE_DISABLED=1` restores legacy lease-held exit behavior. |
| Sandbox verification blocks real sockets | Local tests self-skip socket assertions on `EPERM`; type/build/static paths still run. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Code-index and skill-advisor launchers now have bridge branches, but their daemon entrypoints are outside this packet's frozen source-modification list. Full multi-service daemon-side parity should be handled by a follow-up packet that explicitly scopes those server entrypoints.
<!-- /ANCHOR:questions -->
