---
title: "Plan: Multi-client stdio-socket launcher bridge"
description: "Implementation plan for sharing one MCP daemon across multiple launcher clients via an IPC bridge."
trigger_phrases:
  - "010 bridge plan"
importance_tier: "useful"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/006-mcp-launcher-concurrency/010-multi-client-stdio-socket-bridge"
    last_updated_at: "2026-05-19T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Plan complete"
    next_safe_action: "Commit source-only changes"
    blockers: []
---
# Plan: Multi-client stdio-socket launcher bridge

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Add a daemon-side JSON-RPC socket listener and launcher-side stdio bridge. Optimize for preserving the 006 strict-single-writer invariant: one daemon process, one SQLite handle, multiple client transports.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

| Gate | Verification |
|------|--------------|
| Spec validation | `validate.sh <010> --strict` |
| Type safety | `npm --prefix .opencode/skills/system-spec-kit/mcp_server run typecheck` |
| Bridge tests | `npx vitest --run launcher-ipc-bridge` |
| Launcher regression | `npx vitest --run launcher` |
| Build | `npm --prefix .opencode/skills/system-spec-kit/mcp_server run build` |
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

The primary launcher still acquires the lease and starts the daemon. After stdio connects, the daemon opens `daemon-ipc.sock` and accepts bounded secondary socket clients. Each socket client receives a new MCP `Server` instance with the same request handlers, while all handler modules and database state remain process-local to the primary daemon.

Launchers use a shared CommonJS helper to resolve the socket path and pipe stdin/stdout to the lease holder. If bridge mode is disabled, missing, or refused, the old lease-held diagnostic remains the fallback.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

| Phase | Output |
|-------|--------|
| Phase 1 | Read predecessor invariants and launcher/server entrypoints. |
| Phase 2 | Add shared launcher bridge and daemon socket listener. |
| Phase 3 | Wire lease-held branches across all three launchers. |
| Phase 4 | Add health report field, docs, tests, and packet docs. |
| Phase 5 | Run verification gates and prepare source-only commit handoff. |
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Use Vitest for deterministic bridge logic and launcher branch behavior. Socket-dependent tests return early only when the local OS sandbox rejects `net.listen()` with `EPERM`; on a normal host they exercise actual byte forwarding, MCP `tools/list`, concurrent secondary clients, the client cap, and listener cleanup.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- 006 arc lease invariants remain authoritative.
- 009 EPERM parity remains in the lease liveness probes.
- 011 lazy guard means the IPC listener must start outside guarded memory runtime initialization.
- MCP SDK `StdioServerTransport` accepts custom readable/writable streams and can wrap a socket.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Set `SPECKIT_LAUNCHER_BRIDGE_DISABLED=1` to force legacy secondary-launcher exit behavior without reverting code. Full code rollback is a source-only revert of the 010 commit; no database migration is involved.
<!-- /ANCHOR:rollback -->
