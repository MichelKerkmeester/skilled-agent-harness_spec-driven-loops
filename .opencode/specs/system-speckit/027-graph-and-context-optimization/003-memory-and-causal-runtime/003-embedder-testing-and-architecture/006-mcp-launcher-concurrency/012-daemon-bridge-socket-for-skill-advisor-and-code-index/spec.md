---
title: "Feature Specification: Daemon bridge socket for skill-advisor and code-index"
description: "Lift the IPC bridge-socket binding pattern from mk-spec-memory's socket-server.ts into the skill-advisor (advisor-server.ts) and code-index (index.ts) daemons so secondary launcher subprocesses can attach to the primary instead of exiting with LEASE_HELD_BY."
trigger_phrases:
  - "daemon bridge socket skill-advisor"
  - "daemon bridge socket code-index"
  - "secondary launcher attach"
  - "lease held by no bridge socket"
  - "opencode plugin bridge skill-advisor"
  - "skill_graph_daemon_lease attach"
  - "lift socket-server pattern"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/006-mcp-launcher-concurrency/012-daemon-bridge-socket-for-skill-advisor-and-code-index"
    last_updated_at: "2026-05-20T00:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "Implementation + smoke evidence captured"
    next_safe_action: "Validate, commit"
    blockers: []
    key_files:
      - ".opencode/skills/system-skill-advisor/mcp_server/advisor-server.ts"
      - ".opencode/skills/system-skill-advisor/mcp_server/lib/ipc/socket-server.ts"
      - ".opencode/skills/system-code-graph/mcp_server/index.ts"
      - ".opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts"
      - ".opencode/bin/mk-skill-advisor-launcher.cjs"
---
# Feature Specification: Daemon bridge socket for skill-advisor and code-index

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

Closes packet 010's daemon-side gap: secondary MCP launcher subprocesses (including the OpenCode plugin bridge) can now attach to the primary `mk_skill_advisor` and `mk_code_index` daemons via the IPC socket, instead of exiting with `LEASE_HELD_BY:<pid> (no-bridge-socket)` and breaking caller MCP handshakes.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-05-20 |
| **Branch** | `main` |
| **Parent Arc** | 006-mcp-launcher-concurrency |
| **Predecessor** | `011-sun-path-and-stale-lease-followups` (which documented this gap as REQ-006 / T015) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Packet 010 (`feat(016/006/010)` at commit `088cb82a0`) introduced the multi-client stdio↔socket bridge but shipped daemon-side binding only for `mk-spec-memory` (via `mcp_server/lib/ipc/socket-server.ts`). The commit message explicitly notes "DAEMON-SIDE (mk-spec-memory only this packet)". The skill-advisor and code-index daemons got launcher-side bridge code but never had a daemon socket to attach to. Result:

- `advisor-server.ts` opens only a `StdioServerTransport` — no `net.createServer` anywhere
- `system-code-graph/mcp_server/index.ts` opens only a `StdioServerTransport` — no `net.createServer` anywhere
- When a secondary launcher (e.g. the OpenCode plugin bridge at `.opencode/plugins/mk-skill-advisor.js`) spawns its own launcher subprocess and sees a live lease, it tries `maybeBridgeLeaseHolder()` → `getIpcSocketPath()` → finds no socket file → writes `LEASE_HELD_BY:<pid> (no-bridge-socket)` to stdout and exits
- The plugin's MCP client tries to parse that as JSON-RPC, fails, falls through to `buildLegacyBrief()`, reports `SYSTEM_SKILL_ADVISOR_UNAVAILABLE` after ~145ms (the operational symptom that triggered this packet)

### Purpose

Mirror `mk-spec-memory`'s daemon-side bridge socket binding into the skill-advisor and code-index daemons. After `await server.connect(stdioTransport)`, each daemon now:

1. Resolves a socket path via `resolveIpcSocketPath(<service-db-dir>)` (honors `SPECKIT_IPC_SOCKET_DIR` env override, same as spec-memory).
2. Calls `startIpcSocketServer({ socketPath, createServer })` to listen for secondary attachments.
3. Each incoming socket connection gets its own MCP `Server` instance (via the factory `createAdvisorMcpServer()` / `createCodeIndexMcpServer()`), preserving strict-single-writer semantics on the underlying state while accepting multiple concurrent JSON-RPC channels.
4. Closes the bridge handle on shutdown.

### Companion changes

- `mk-skill-advisor-launcher.cjs` env allowlist gains `SPECKIT_IPC_SOCKET_DIR`, `SPECKIT_LAUNCHER_BRIDGE_DISABLED`, and `SPECKIT_MAX_SECONDARY_CLIENTS` so the env-var pin from runtime configs reaches the spawned child advisor-server. The code-index launcher already passes the full `process.env` so it needs no allowlist change.
- `socket-server.ts` is copied verbatim from `system-spec-kit/mcp_server/lib/ipc/` into both target `mcp_server/lib/ipc/` dirs — the file is generic (no spec-memory-specific code) and copying preserves npm package independence.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Copy `socket-server.ts` into `system-skill-advisor/mcp_server/lib/ipc/` and `system-code-graph/mcp_server/lib/ipc/`.
- Refactor `advisor-server.ts`: extract `createAdvisorMcpServer()` factory, call `startIpcSocketServer` after stdio connect, close bridge on shutdown.
- Refactor `system-code-graph/mcp_server/index.ts`: same pattern with `createCodeIndexMcpServer()` factory + new `SIGTERM/SIGINT` handlers for clean bridge close.
- Add `SPECKIT_IPC_SOCKET_DIR`, `SPECKIT_LAUNCHER_BRIDGE_DISABLED`, `SPECKIT_MAX_SECONDARY_CLIENTS` to `mk-skill-advisor-launcher.cjs::CHILD_ENV_ALLOWLIST`.
- Rebuild both npm packages.
- Smoke-test: primary daemon binds, secondary launcher attaches via bridge.
- Update arc parent: phase-map row for 012, `children_ids`, `last_active_child_id`.

### Out of Scope

- **Dead-PID auto-reclaim in `skill_graph_daemon_lease`** — still tracked as a separate follow-on per packet 011 REQ-006. This packet closes the bridge-socket gap; the dead-PID reclaim is a different concern.
- Refactoring `socket-server.ts` into a shared library outside `system-spec-kit`. Each npm package keeps its own copy for now; sharing across packages requires a build-time dep that's heavier than the copy.
- Modifications to the OpenCode plugin (`.opencode/plugins/mk-skill-advisor.js`). The plugin doesn't need changes — once the daemons bind their bridge sockets, the plugin's spawn-launcher-as-MCP-transport pattern just works.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-skill-advisor/mcp_server/lib/ipc/socket-server.ts` | Create | Copy from `system-spec-kit/mcp_server/lib/ipc/socket-server.ts` |
| `.opencode/skills/system-skill-advisor/mcp_server/advisor-server.ts` | Modify | Extract factory; call `startIpcSocketServer` after stdio connect; close bridge on shutdown |
| `.opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts` | Create | Same copy |
| `.opencode/skills/system-code-graph/mcp_server/index.ts` | Modify | Same pattern + new SIGTERM/SIGINT handlers |
| `.opencode/bin/mk-skill-advisor-launcher.cjs` | Modify | Add 3 env vars to `CHILD_ENV_ALLOWLIST` |
| Arc parent `spec.md` | Modify | Add phase-map row for 012 |
| Arc parent `graph-metadata.json` | Modify | Add `012-*` to `children_ids`; update `last_active_child_id` |
| Built artifacts | Generate | `npm run build` in both mcp_server packages |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Primary skill-advisor daemon binds its IPC bridge socket | `srw-------` socket file appears at `$SPECKIT_IPC_SOCKET_DIR/daemon-ipc.sock` within ~3 seconds of cold start; log line `[ipc-bridge] socket listening at <path>` present |
| REQ-002 | Primary code-index daemon binds its IPC bridge socket | Same evidence for `/tmp/mk-code-index/daemon-ipc.sock` |
| REQ-003 | Secondary skill-advisor launcher attaches to bridge socket when lease is held | Spawning a second launcher while primary is alive produces `[mk-skill-advisor-launcher] bridging to lease holder pid=<primary-pid> socket=<path>` instead of `LEASE_HELD_BY:<pid> (no-bridge-socket)` |
| REQ-004 | Secondary code-index launcher attaches via bridge | Same evidence for code-index |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | `SPECKIT_IPC_SOCKET_DIR` reaches the spawned advisor-server child | `mk-skill-advisor-launcher.cjs::CHILD_ENV_ALLOWLIST` includes the var; child server resolves the correct socket path |
| REQ-006 | Bridge handle closes on shutdown | `shutdownAdvisor` / `shutdownCodeIndex` close the bridge before transport teardown; socket file is unlinked |
| REQ-007 | Build succeeds on both npm packages | `npm run build` exits 0 in both `system-skill-advisor/mcp_server` and `system-code-graph` |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Bridge socket files present under `/tmp/mk-skill-advisor/` and `/tmp/mk-code-index/` when their primary daemons are alive. Verified via smoke test on 2026-05-20.
- **SC-002**: Secondary launcher attach paths in both launchers print `bridging to lease holder pid=<n> socket=<path>` line on stderr.
- **SC-003**: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this-packet> --strict` exits 0.
- **SC-004**: OpenCode plugin (`mk-skill-advisor.js`) reports `last_bridge_status=success` instead of `fail_open` on next session restart — **not directly verified in this packet** because the plugin's state is read from a long-running runtime; SC-001..SC-003 cover the architectural fix that enables this outcome.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | `/tmp/<service>/` socket dir doesn't exist on a freshly-booted machine | `listen()` fails with `ENOENT` | `socket-server.ts:102` runs `fs.mkdirSync(path.dirname(socketPath), { recursive: true, mode: 0o700 })` before binding. Inherited from the spec-memory implementation. |
| Risk | Two skill-advisor daemons race-bind the same socket on cold start | EADDRINUSE | `socket-server.ts:148-162` already handles EADDRINUSE by `fs.unlinkSync` + retry. Lease-based single-writer (006 arc invariant) prevents legitimate concurrent primaries; only stale-socket case is real. |
| Risk | `createCodeIndexMcpServer()` factory creates a fresh `Server` per attachment, but the underlying SQLite/code-graph state is shared | Single-writer constraint at the SQLite layer (already enforced by the daemon lease) | Same pattern that `mk-spec-memory` uses; verified working in production for spec-memory since 010 |
| Dependency | `socket-server.ts` is now duplicated across 3 packages | Drift if spec-memory's implementation evolves but the copies don't | Acknowledged. A future packet may consolidate into a shared library, but the copy is well-defined and small (210 LOC); diff-based drift detection is straightforward |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should we consolidate the three `socket-server.ts` copies into a shared `system-spec-kit/shared/ipc/` module imported by all three packages? **DEFERRED**: requires npm linking or a dist-shipped package; small surface today; reconsider if drift becomes a real problem.
- Should `mk-code-index-launcher.cjs` also adopt an env allowlist (currently passes full `process.env`)? **DEFERRED**: out of scope; the launcher's current open-env policy works; tightening it is a separate hardening packet.
- Does the OpenCode plugin's `bridgeTimeoutMs = 1000` need raising now that the bridge actually works? **PROPOSED: yes** — the bridge subprocess needs more than 1s to complete a full MCP handshake. Tracked as a 013-plugin-bridge-timeout-tune follow-on.
<!-- /ANCHOR:questions -->
