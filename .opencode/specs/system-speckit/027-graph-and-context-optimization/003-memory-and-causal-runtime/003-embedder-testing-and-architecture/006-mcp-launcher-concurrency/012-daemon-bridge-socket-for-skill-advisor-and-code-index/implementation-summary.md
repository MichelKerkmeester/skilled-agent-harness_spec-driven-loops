---
title: "Implementation Summary: Daemon bridge socket for skill-advisor and code-index [template:level_1/implementation-summary.md]"
description: "Closes packet 010's daemon-side gap. Both skill-advisor and code-index daemons now bind IPC bridge sockets after stdio connect, and secondary launcher subprocesses (including the OpenCode plugin) attach via those sockets instead of exiting with LEASE_HELD_BY garbage."
trigger_phrases:
  - "012 implementation summary"
  - "daemon bridge socket implementation"
  - "advisor-server bridge socket"
  - "code-graph bridge socket"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/006-mcp-launcher-concurrency/012-daemon-bridge-socket-for-skill-advisor-and-code-index"
    last_updated_at: "2026-05-20T00:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "Implementation + smoke evidence; both daemons binding, both secondaries attaching via bridge"
    next_safe_action: "Strict validate + commit"
    blockers: []
    completion_state: "complete"
    key_files:
      - ".opencode/skills/system-skill-advisor/mcp_server/advisor-server.ts"
      - ".opencode/skills/system-skill-advisor/mcp_server/lib/ipc/socket-server.ts"
      - ".opencode/skills/system-code-graph/mcp_server/index.ts"
      - ".opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts"
      - ".opencode/bin/mk-skill-advisor-launcher.cjs"
---
# Implementation Summary: Daemon bridge socket for skill-advisor and code-index

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Status** | Complete |
| **Created** | 2026-05-20 |
| **Branch** | `main` |
| **Parent Arc** | `006-mcp-launcher-concurrency` |
| **Predecessor** | `010-multi-client-stdio-socket-bridge` (introduced launcher-side bridge for all 3 launchers; daemon-side only for spec-memory) |
| **Sibling** | `011-sun-path-and-stale-lease-followups` (flagged this work as REQ-006/T015) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

### Phase A — `socket-server.ts` copied to both target packages

Verbatim copy from `system-spec-kit/mcp_server/lib/ipc/socket-server.ts` to:
- `system-skill-advisor/mcp_server/lib/ipc/socket-server.ts`
- `system-code-graph/mcp_server/lib/ipc/socket-server.ts`

The file is generic (no spec-memory-specific code). It exports `resolveIpcSocketPath`, `startIpcSocketServer`, `getIpcBridgeStats`, `parseMaxClients`. Internal logic handles `SPECKIT_IPC_SOCKET_DIR` env override, `EADDRINUSE` retry, `fs.mkdirSync` of the socket dir, `0o600` chmod, and per-connection `StdioServerTransport` instances.

### Phase B — daemon refactors

**`advisor-server.ts`** (skill-advisor):
- 3 new imports from `./lib/ipc/socket-server.js`
- New `createAdvisorMcpServer(): Server` factory — wraps the previous top-level `new Server(...)` + `setRequestHandler(...)` calls
- `const server = createAdvisorMcpServer()` replaces the previous top-level construction
- New `ipcBridge: IpcSocketServerHandle | null` state var
- `shutdownAdvisor()` closes the bridge before tearing down `transport` and `skillGraphDaemon`
- `main()` calls `ipcBridge = await startIpcSocketServer({ socketPath: resolveIpcSocketPath(resolveSkillGraphDbDir()), createServer: () => createAdvisorMcpServer(), log: (m) => console.error(m) })` after `await server.connect(transport)`

**`system-code-graph/mcp_server/index.ts`**:
- Same factory pattern (`createCodeIndexMcpServer`)
- Added SIGTERM/SIGINT handlers + `shutdownCodeIndex(reason)` — the file had no signal handlers previously
- Imports `DATABASE_DIR` from `./core/config.js`
- `startIpcSocketServer` call wired inside the existing try/catch around `await server.connect(transport)`

### Phase C — launcher env-allowlist update

`mk-skill-advisor-launcher.cjs::CHILD_ENV_ALLOWLIST` gained 3 entries:
- `SPECKIT_IPC_SOCKET_DIR`
- `SPECKIT_LAUNCHER_BRIDGE_DISABLED`
- `SPECKIT_MAX_SECONDARY_CLIENTS`

Without this, the spawned `advisor-server.js` child never sees the runtime-config pin and resolves the default `<db-dir>/daemon-ipc.sock` path that overflows macOS `sun_path`. `mk-code-index-launcher.cjs` passes full `process.env`, so no allowlist change needed there.

### Phase D — built artifacts + smoke verification

Both `npm run build` invocations exit 0. Built outputs:
- `.opencode/skills/system-skill-advisor/mcp_server/dist/system-skill-advisor/mcp_server/advisor-server.js` (now has socket-server import + ipc-bridge close lines)
- `.opencode/skills/system-code-graph/dist/system-code-graph/mcp_server/index.js` (same)
- `.opencode/skills/system-{skill-advisor,code-graph}/{mcp_server/,}dist/.../lib/ipc/socket-server.js` (new modules)

<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The work landed in a single contiguous session on 2026-05-20:

1. **Diagnosis phase** confirmed packet 011's REQ-006 hypothesis: `advisor-server.ts` grep for `net.createServer|listen.*sock|SocketServer` returns 0 hits, while `context-server.ts:113` imports `socket-server.js`. Same applies to `system-code-graph/mcp_server/index.ts`. So `mk-spec-memory` is the only one of the three that binds the daemon-side bridge socket.

2. **Implementation phase** copied `socket-server.ts` into the two missing packages (210 LOC × 2; verbatim), refactored both daemon entrypoints to use the factory + bridge pattern, and added 3 env vars to skill-advisor's launcher allowlist.

3. **Build phase**: `npm run build` exits 0 in both packages — system-spec-kit's tsc binary is shared via the relative path in skill-advisor's package.json; code-graph has its own local tsc.

4. **Smoke phase** caught one issue: when stdin closes immediately, the child server exits before binding the bridge. Solution: hold stdin open via subshell `( sleep N; echo done ) | <launcher>` during the smoke test (this matches the real-world case where OpenCode keeps the launcher's stdin open for the MCP session lifetime).

5. **Verification phase** confirmed both daemons bind their bridge sockets within ~5s (skill-advisor) and ~10s (code-index — has slightly more startup work). Secondary launcher attachment then prints the canonical `bridging to lease holder pid=<n> socket=<path>` line.

The packet ships on `main` (per the project convention of no feature branches).
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:smoke -->
## Smoke Evidence (2026-05-20 session)

### Primary skill-advisor binds
```text
[mk-skill-advisor-launcher] loaded 1 env(s) from .env.local
[mk-skill-advisor-launcher] loaded 4 env(s) from .env
[mk-skill-advisor-launcher] DB: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/database/skill-graph.sqlite
[mk-skill-advisor-launcher] Skill graph: scanned=23 indexed=0 skipped=23 edges=81 rejected=0 deleted=0
[mk-skill-advisor-launcher] Skill graph daemon active=true
[ipc-bridge] socket listening at /tmp/mk-skill-advisor/daemon-ipc.sock
```
`/tmp/mk-skill-advisor/daemon-ipc.sock`: `srw-------@ 1 michelkerkmeester wheel 0 May 20 12:03`

### Primary code-index binds
```text
[mk-code-index-launcher] loaded 1 env(s) from .env.local
[mk-code-index-launcher] loaded 4 env(s) from .env
[mk-code-index-launcher] MAINTAINER_MODE=true: forcing all 5 INDEX_* to "true"
[mk-code-index-launcher] ready: {"start":"2026-05-20T10:05:57.094Z","end":"2026-05-20T10:05:57.095Z","actions":[],"server":".opencode/skills/system-code-graph/mcp_server/dist/index.js"}
[ipc-bridge] socket listening at /tmp/mk-code-index/daemon-ipc.sock
```
`/tmp/mk-code-index/daemon-ipc.sock`: `srw-------@ 1 michelkerkmeester wheel 0 May 20 12:06`

### Secondary skill-advisor launcher attaches (the actual end-user fix)
```text
[mk-skill-advisor-launcher] loaded 1 env(s) from .env.local
[mk-skill-advisor-launcher] loaded 4 env(s) from .env
[mk-skill-advisor-launcher] bridging to lease holder pid=86629 socket=/tmp/mk-skill-advisor/daemon-ipc.sock
```

### Secondary code-index launcher attaches
```text
[mk-code-index-launcher] loaded 1 env(s) from .env.local
[mk-code-index-launcher] loaded 4 env(s) from .env
[mk-code-index-launcher] MAINTAINER_MODE=true: forcing all 5 INDEX_* to "true"
[mk-code-index-launcher] bridging to lease holder pid=87044 socket=/tmp/mk-code-index/daemon-ipc.sock
```

Both `bridging to lease holder` lines confirm that secondary launchers are using the bridge socket instead of falling through to `LEASE_HELD_BY:<pid> (no-bridge-socket)`.
<!-- /ANCHOR:smoke -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

### D-001: Copy `socket-server.ts` instead of importing from a shared module
**Decision:** Each of the three packages (`system-spec-kit`, `system-skill-advisor`, `system-code-graph`) keeps its own copy of `socket-server.ts`.
**Rationale:** The packages are separate npm packages with independent dist trees. Sharing via npm linkage or a published package adds build-system complexity disproportionate to the 210-LOC file. Drift between copies is mitigated by the file being self-contained, well-typed, and rarely-edited (only changes when the protocol or transport semantics evolve).

### D-002: Factory pattern over a single shared `Server` instance
**Decision:** Each daemon now has a `createXxxMcpServer()` factory called once for the stdio transport and once per incoming bridge connection.
**Rationale:** `StdioServerTransport` and per-socket transports each bind a single `Server`. Reusing one `Server` across transports would violate the MCP SDK's transport ownership model. The factory is cheap (a `new Server({...})` + 2 `setRequestHandler` calls) and isolates per-connection capabilities. Shared state (SQLite, daemon process, lease) lives at the module level, where the existing strict-single-writer invariant continues to hold.

### D-003: Add 3 env vars to skill-advisor's `CHILD_ENV_ALLOWLIST` instead of widening the launcher to pass `process.env`
**Decision:** Surgical allowlist additions for `SPECKIT_IPC_SOCKET_DIR`, `SPECKIT_LAUNCHER_BRIDGE_DISABLED`, `SPECKIT_MAX_SECONDARY_CLIENTS`.
**Rationale:** The skill-advisor launcher's allowlist is a security/hygiene convention. Switching to full-env-pass would silently leak unrelated vars (CI tokens, custom shell config, etc.) to the child process. Adding the 3 socket-related vars explicitly is the smallest change that gets the fix to work.

### D-004: SIGTERM/SIGINT handlers in code-graph index.ts
**Decision:** Add explicit signal handlers + `shutdownCodeIndex()` to close the bridge cleanly. The file previously had none.
**Rationale:** Without explicit cleanup, the socket file persists after process exit, and the next primary start trips EADDRINUSE (handled by `socket-server.ts` via unlink-retry, but cleaner to clean up explicitly). Matches the pattern in `advisor-server.ts` and `context-server.ts`.

### D-005: Level 1 instead of Level 2
**Decision:** Authored as Level 1 even though the change touches 5 source files + 2 npm packages.
**Rationale:** Matches the arc convention (010, 009, 008, 007, 006 were all Level 1). The work is a well-defined extension of an existing pattern, not a new architecture. Level 1's required anchor set (metadata, problem, scope, requirements, success-criteria, risks, questions for spec; summary + 7 anchors for plan; notation + 3 phases + completion + cross-refs for tasks) covers the necessary documentation without checklist.md ceremony that doesn't apply to an extension packet.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

### Strict validate (this packet)
Observed 2026-05-21T10:17:49Z:

```text
$ bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/006-mcp-launcher-concurrency/012-daemon-bridge-socket-for-skill-advisor-and-code-index --strict
exit 0
+ PRIORITY_TAGS: No checklist found
+ FRONTMATTER_VALID: Frontmatter continuity basics present
+ FRONTMATTER_MEMORY_BLOCK: All spec-doc frontmatter memory blocks are structurally valid
+ SPEC_DOC_SUFFICIENCY: All targeted spec-doc anchors meet the sufficiency baseline
+ SECTIONS_PRESENT: Section presence covered by per-document manifest anchors
+ GRAPH_METADATA_PRESENT: Graph metadata checked

Summary: Errors: 0  Warnings: 0

RESULT: PASSED
```

### Built file integrity
```bash
node --check .opencode/skills/system-skill-advisor/mcp_server/dist/system-skill-advisor/mcp_server/advisor-server.js
node --check .opencode/skills/system-code-graph/dist/system-code-graph/mcp_server/index.js
# Expect: both Exit 0
```

### Bridge wiring presence in built files
```bash
grep -c "startIpcSocketServer" \
  .opencode/skills/system-skill-advisor/mcp_server/dist/system-skill-advisor/mcp_server/advisor-server.js \
  .opencode/skills/system-code-graph/dist/system-code-graph/mcp_server/index.js
# Expect: ≥1 hit each
```

### Smoke (replay)
See `## Smoke Evidence` section above for the 2026-05-20 session outputs.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **OpenCode plugin's `DEFAULT_BRIDGE_TIMEOUT_MS=1000` may still throttle real-world bridges.** The bridge's MCP transport timeout (`ADVISOR_MCP_TIMEOUT_MS`) is 8s. The plugin kills its bridge subprocess at 1s. With this packet, the bridge socket exists, but a complete MCP handshake through the socket may still exceed 1s under load. Tracked as proposed follow-on `013-plugin-bridge-timeout-tune`.

2. **Dead-PID rows in `skill_graph_daemon_lease` still need manual reclaim.** Packet 011 REQ-006 captured this separately. The bridge fix in this packet does not address dead-PID rows that point at exited processes — but those rows are blocked from being treated as "alive" by the lease-reclaim path's existing `kill(pid, 0)` probe at the file-lease level. The SQLite-table-level reclaim is what's still missing.

3. **Code-index has slower startup than skill-advisor (~10s vs ~5s before bridge socket binds).** The smoke evidence shows this. End-user impact: the OpenCode plugin's spawn-launcher subprocess for `mk_code_index` may need more time than for `mk_skill_advisor` before the bridge socket exists. The plugin's bridge timeout (item 1) becomes more critical here. Adjusting code-index startup ordering to bind the bridge earlier is a possible micro-optimization but not in scope.

4. **`socket-server.ts` is now duplicated 3x across the workspace.** D-001 explains the rationale. A future consolidation packet could reduce this to a single source.
<!-- /ANCHOR:limitations -->
