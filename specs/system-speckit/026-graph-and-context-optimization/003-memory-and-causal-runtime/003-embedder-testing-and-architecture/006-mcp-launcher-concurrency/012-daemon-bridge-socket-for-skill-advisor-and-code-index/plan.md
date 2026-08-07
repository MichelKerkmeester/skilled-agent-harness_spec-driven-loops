---
title: "Implementation Plan: Daemon bridge socket for skill-advisor and code-index [template:level_1/plan.md]"
description: "Three-phase plan: socket-server copy + daemon refactor in both packages + launcher allowlist update + builds + smoke verification."
trigger_phrases:
  - "012 plan"
  - "daemon bridge socket plan"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/006-mcp-launcher-concurrency/012-daemon-bridge-socket-for-skill-advisor-and-code-index"
    last_updated_at: "2026-05-20T00:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "Plan authored"
    next_safe_action: "Validate strict"
    blockers: []
---
# Implementation Plan: Daemon bridge socket for skill-advisor and code-index

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Phase | What | Status |
|-------|------|--------|
| **A** | Copy `socket-server.ts` from system-spec-kit into the two target packages | Shipped in this packet |
| **B** | Refactor `advisor-server.ts` + `code-graph/index.ts` to extract MCP-server factories and call `startIpcSocketServer` after stdio connect | Shipped in this packet |
| **C** | Update `mk-skill-advisor-launcher.cjs::CHILD_ENV_ALLOWLIST` to pass `SPECKIT_IPC_SOCKET_DIR` through to the child server | Shipped in this packet |
| **D** | Rebuild both npm packages + smoke-verify primary binding + secondary attachment | Shipped in this packet (smoke evidence in `implementation-summary.md` §5) |
| **E** | Backfill arc parent and commit | Shipped in this packet |
| (follow-on) | Plugin-side `bridgeTimeoutMs` raise (currently 1000ms; bridge needs 5-8s for full MCP handshake) | Tracked as proposed follow-on `013-plugin-bridge-timeout-tune` |
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

1. Strict validate exits 0 on this packet via `validate.sh --strict`.
2. Primary daemon for each of `mk-skill-advisor` and `mk-code-index` binds `$SPECKIT_IPC_SOCKET_DIR/daemon-ipc.sock` within ~5s of cold start; log line `[ipc-bridge] socket listening at <path>` appears on stderr.
3. Secondary launcher subprocess for each service produces `[<service>-launcher] bridging to lease holder pid=<primary-pid> socket=<path>` on stderr (instead of `LEASE_HELD_BY ... (no-bridge-socket)`).
4. `npm run build` exits 0 on both `system-skill-advisor/mcp_server` and `system-code-graph`.
5. `node --check` on both compiled `advisor-server.js` and `code-graph/mcp_server/index.js` passes.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### What the daemon-side gain looks like

Each daemon previously did:
```
const server = new Server({...});
server.setRequestHandler(...);  // 1-2 handlers
const transport = new StdioServerTransport();
await server.connect(transport);
```

After this packet, each daemon does:
```
function createXxxMcpServer() {
  const s = new Server({...});
  s.setRequestHandler(...);
  return s;
}
const server = createXxxMcpServer();
const transport = new StdioServerTransport();
await server.connect(transport);
ipcBridge = await startIpcSocketServer({
  socketPath: resolveIpcSocketPath(<service-db-dir>),
  createServer: () => createXxxMcpServer(),
  log: (m) => console.error(m),
});
```

Plus `shutdown<Service>()` closes the bridge handle before transport teardown.

### Why the factory pattern matters

`StdioServerTransport` and the new per-socket transports each bind one `Server` instance. A single shared `Server` cannot be connected to multiple transports. So each secondary attachment creates a fresh `Server` via the factory. The underlying state (SQLite handle, skill graph daemon, code-graph DB) remains shared at the module level — that's the strict-single-writer invariant 006 arc enforces.

### Why the launcher allowlist matters (skill-advisor only)

`mk-skill-advisor-launcher.cjs::createChildEnv()` filters which env vars reach the spawned `advisor-server.js` child via a `CHILD_ENV_ALLOWLIST` Set. `SPECKIT_IPC_SOCKET_DIR` was not in that set, so the child resolved the default `<db-dir>/daemon-ipc.sock` path which exceeds the macOS `sun_path` 104-byte limit and `listen()` returns `EINVAL`. Adding the three socket-bridge env vars to the allowlist routes the runtime-config pin into the child process.

`mk-code-index-launcher.cjs` doesn't have this filter (passes full `process.env`), so no change needed there.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase A — socket-server.ts copy
- `cp .opencode/skills/system-spec-kit/mcp_server/lib/ipc/socket-server.ts .opencode/skills/system-skill-advisor/mcp_server/lib/ipc/socket-server.ts`
- Same `cp` for `system-code-graph`
- Verify `diff -q` returns identical files

### Phase B — daemon refactor
- `advisor-server.ts`:
  - Add 3 imports from `./lib/ipc/socket-server.js`
  - Extract handler registration into `createAdvisorMcpServer(): Server`
  - Replace top-level `const server = new Server(...)` with `const server = createAdvisorMcpServer()`
  - Add `ipcBridge: IpcSocketServerHandle | null = null` state
  - Add bridge close in `shutdownAdvisor`
  - In `main()`, append `ipcBridge = await startIpcSocketServer({ socketPath: resolveIpcSocketPath(resolveSkillGraphDbDir()), createServer: () => createAdvisorMcpServer(), log: (m) => console.error(m) })`
- `system-code-graph/mcp_server/index.ts`:
  - Same imports + factory pattern (`createCodeIndexMcpServer`)
  - Add SIGTERM/SIGINT handlers + `shutdownCodeIndex` (file previously had none)
  - Import `DATABASE_DIR` from `./core/config.js`
  - Append `startIpcSocketServer` call inside the existing try/catch around `await server.connect(transport)`

### Phase C — launcher allowlist
- Edit `mk-skill-advisor-launcher.cjs::CHILD_ENV_ALLOWLIST` to add 3 entries (`SPECKIT_IPC_SOCKET_DIR`, `SPECKIT_LAUNCHER_BRIDGE_DISABLED`, `SPECKIT_MAX_SECONDARY_CLIENTS`)

### Phase D — build + smoke
- `cd .opencode/skills/system-skill-advisor/mcp_server && npm run build` (exit 0)
- `cd .opencode/skills/system-code-graph && npm run build` (exit 0)
- Smoke test the primary binding for each daemon (stdin held open via subshell `( sleep N; ... )`)
- Smoke test the secondary attachment for each daemon (spawn second launcher while primary is alive)

### Phase E — arc parent + commit
- Add phase-map row to `006-mcp-launcher-concurrency/spec.md`
- Add `012-*` to `children_ids` in `006-mcp-launcher-concurrency/graph-metadata.json`
- Set `last_active_child_id` to 012
- Strict validate; commit
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test | What | Expected |
|------|------|----------|
| Build (skill-advisor) | `cd .opencode/skills/system-skill-advisor/mcp_server && npm run build` | Exit 0 |
| Build (code-graph) | `cd .opencode/skills/system-code-graph && npm run build` | Exit 0 |
| Built file integrity | `node --check` on both compiled JS | Exit 0 |
| Primary smoke (skill-advisor) | `SPECKIT_IPC_SOCKET_DIR=/tmp/mk-skill-advisor node ...launcher.cjs` with stdin held open ~5s | `/tmp/mk-skill-advisor/daemon-ipc.sock` exists + log shows `[ipc-bridge] socket listening at /tmp/mk-skill-advisor/daemon-ipc.sock` |
| Primary smoke (code-index) | same | `/tmp/mk-code-index/daemon-ipc.sock` exists + log shows `[ipc-bridge] socket listening at /tmp/mk-code-index/daemon-ipc.sock` |
| Secondary attach (skill-advisor) | Spawn second launcher while primary alive | stderr shows `[mk-skill-advisor-launcher] bridging to lease holder pid=<primary> socket=<path>` |
| Secondary attach (code-index) | same | stderr shows `[mk-code-index-launcher] bridging to lease holder pid=<primary> socket=<path>` |
| Strict validate | `validate.sh --strict <packet>` | Exit 0 |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- **Upstream**: `010-multi-client-stdio-socket-bridge` — established the launcher-side bridge pattern. This packet closes its daemon-side gap.
- **Sideways**: `011-sun-path-and-stale-lease-followups` — flagged this gap as REQ-006 (now closed) and as `mk-skill-advisor` mkdir-on-listen parity (now closed via the `socket-server.ts` copy's `fs.mkdirSync` at line 102).
- **Downstream**: Proposed `013-plugin-bridge-timeout-tune` — raise the OpenCode plugin's `bridgeTimeoutMs` from 1000ms to ~8000ms to match the bridge's MCP timeout, now that the bridge actually completes successfully.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

| Surface | How to roll back |
|---------|------------------|
| Source code (4 files) | `git checkout HEAD~1 -- <paths>` restores pre-packet state |
| Built artifacts | Re-run `npm run build` after revert; the old advisor-server.js had no bridge code |
| Launcher allowlist | `git checkout HEAD~1` removes the 3 added entries |
| Arc parent | `git checkout HEAD~1 -- 006-mcp-launcher-concurrency/{spec.md,graph-metadata.json}` |
| Packet folder | `rm -rf 012-daemon-bridge-socket-for-skill-advisor-and-code-index/` |
| Runtime state | Kill all daemons + clear lease state via the operational recipe in `../011-.../implementation-summary.md` §3 |

After rollback, the system returns to packet-011 state: `mk-spec-memory` binds, the other two daemons don't, and the OpenCode plugin reports `SYSTEM_SKILL_ADVISOR_UNAVAILABLE` again.
<!-- /ANCHOR:rollback -->
