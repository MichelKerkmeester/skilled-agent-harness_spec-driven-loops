---
title: "Implementation Plan: Code-Graph Workspace-Root + IPC Socket Reconnect Fix [template:level_2/plan.md]"
description: "Two surgical fixes in the code-graph MCP server: anchor workspace-root resolution on the on-path .opencode segment, and allow OS temp / /tmp as IPC socket roots. Rebuild dist, remove stray dirs, verify via launcher + MCP handshake."
trigger_phrases:
  - "code index reconnect plan"
  - "workspace root resolver plan"
  - "ipc socket fix plan"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-code-graph/031-code-graph-buildout/003-code-graph-workspace-root-fix"
    last_updated_at: "2026-05-26T08:30:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Both fixes implemented + verified"
    next_safe_action: "Reconnect mk_code_index"
    blockers: []
    key_files:
      - ".opencode/skills/system-code-graph/mcp_server/core/config.ts"
      - ".opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Code-Graph Workspace-Root + IPC Socket Reconnect Fix

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (ESM, nodenext), Node 25 |
| **Framework** | MCP SDK (`@modelcontextprotocol/sdk`) |
| **Storage** | SQLite at `.opencode/.spec-kit/code-graph/database` |
| **Testing** | `tsc --build` + launcher smoke + MCP JSON-RPC handshake |

### Overview
The `mk_code_index` server crashed at startup for two stacked reasons. First, `resolveWorkspaceRoot()` returned the first ancestor *containing* a `.opencode/` child, which a stray nested `.opencode/` inside the skill falsely matched — mis-resolving the root to the skill dir and throwing `OUTSIDE_WORKSPACE` on the canonical DB dir. Second (masked by the first), `resolveIpcSocketPath()` rejected the `/tmp` socket dir mandated by `.mcp.json` because of an over-strict workspace-only check added in a security-hardening commit.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Both root causes reproduced via direct launcher run
- [x] `/tmp` requirement confirmed (sun_path 121 > 104)
- [x] Sibling-server pattern reviewed (spec-memory, skill-advisor)

### Definition of Done
- [x] `typecheck` + `build` pass
- [x] Launcher starts clean; socket binds; handshake returns 8 tools
- [x] Docs (spec/plan/tasks/checklist/impl-summary) written + strict-validated
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Launcher bridge → daemon MCP server (stdio) + multi-client IPC socket bridge.

### Key Components
- **`core/config.ts` → `resolveWorkspaceRoot()`**: derives workspace root for DB-dir containment.
- **`lib/ipc/socket-server.ts` → `resolveIpcSocketPath()` / `canUnlinkExistingSocket()`**: locate + safely reclaim the IPC socket.

### Data Flow
`launcher.cjs` sets env (DB dir, `/tmp` socket dir) → spawns `dist/index.js` → `config.js` resolves DB dir (REQ-001) → `index.js` starts IPC bridge via `resolveIpcSocketPath` (REQ-002) → MCP client connects.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `config.ts:resolveWorkspaceRoot` | Producer of workspace root for DB containment | update | Launcher no OUTSIDE_WORKSPACE; root = `…/Public` |
| `socket-server.ts:resolveIpcSocketPath` | Producer of socket path; gate on socket dir | update | Binds `/private/tmp/mk-code-index/daemon-ipc.sock` |
| `socket-server.ts:canUnlinkExistingSocket` | Policy: safe stale-socket reclaim | update (same allowed-roots helper) | Restart reclaims stale socket; owner check intact |
| `mk-spec-memory` / `mk-skill-advisor` socket-server | Sibling producers | not a consumer (never had the strict check) | `grep` shows no `isWithinWorkspace` in their resolvers |
| `dist/**` | Compiled output | update (rebuilt) | `grep` confirms new logic in `dist/core/config.js` |

Inventories run:
- Strict socket check across servers: `grep -n "isWithinWorkspace\|must stay within" <each>/socket-server.ts` → only code-index had it.
- Resolver pattern: `grep -rln "resolveWorkspaceRoot"` → code-index `config.ts` is the affected one.

Algorithm invariant (resolver): the workspace root is the parent of the `.opencode` segment that lies on the running module's own ancestry path; sibling/child `.opencode` dirs are never on that path.
Algorithm invariant (socket): socket dir must lie within {cwd, os.tmpdir(), /tmp}; unlink additionally requires socket-type + owner-uid match.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Resolver + cleanup
- [x] Anchor `resolveWorkspaceRoot()` on on-path `.opencode` (import `basename`)
- [x] Remove 5 stray `.opencode/` dirs (confirmed untracked + canonical copies intact)
- [x] Rebuild; verify DB crash gone

### Phase 2: IPC socket
- [x] Add `allowedSocketRoots()` / `isWithinAllowedSocketRoot()` helpers (import `os`)
- [x] Relax `resolveIpcSocketPath` + `canUnlinkExistingSocket` to allowed roots
- [x] Rebuild

### Phase 3: Verification
- [x] Launcher clean start + socket bind
- [x] Stale-socket restart reclaim
- [x] MCP `initialize` + `tools/list` (8 tools)
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Static | Type safety | `tsc --noEmit`, `tsc --build` |
| Smoke | Launcher startup, socket bind | direct `node` run |
| Integration | MCP handshake | JSON-RPC `initialize` + `tools/list` over stdio |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `@modelcontextprotocol/sdk` | External | Green | n/a |
| macOS `sun_path` limit | Platform | Green (worked around) | Would block socket bind |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Server regresses or socket security concern.
- **Procedure**: `git checkout` the two source files + `npm run rebuild` in `system-code-graph`. Stray-dir deletions are not reverted (regenerable artifacts).
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Resolver + cleanup) ──► Phase 2 (IPC socket) ──► Phase 3 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Resolver + cleanup | None | IPC socket (crash #1 masks #2) |
| IPC socket | Resolver | Verify |
| Verify | IPC socket | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Resolver + cleanup | Low | ~30 min |
| IPC socket | Med | ~45 min |
| Verification | Low | ~20 min |
| **Total** | | **~1.5 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Rollback Procedure
1. `git checkout -- .opencode/skills/system-code-graph/mcp_server/core/config.ts .opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts`
2. `cd .opencode/skills/system-code-graph && npm run rebuild`
3. Smoke-test the launcher.

### Data Reversal
- **Has data migrations?** No.
<!-- /ANCHOR:enhanced-rollback -->
