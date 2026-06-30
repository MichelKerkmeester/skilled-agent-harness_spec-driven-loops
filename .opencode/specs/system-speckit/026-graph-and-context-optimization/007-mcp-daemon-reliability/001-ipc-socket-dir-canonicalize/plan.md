---
title: "Implementation Plan: Canonicalize missing IPC socket dirs in code-graph resolveIpcSocketPath"
description: "Make canonicalizePath realpath the nearest existing ancestor for a non-existent leaf and route resolveIpcSocketPath through it, so a missing /tmp socket dir canonicalizes to /private/tmp and passes the allowed-root check."
trigger_phrases:
  - "ipc socket dir canonicalize plan"
  - "resolveIpcSocketPath ancestor realpath"
  - "code-graph socket reboot fix"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability/001-ipc-socket-dir-canonicalize"
    last_updated_at: "2026-05-28T17:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Planned + implemented canonicalize-missing fix; built dist; test green"
    next_safe_action: "None; phase complete pending strict validate"
    blockers: []
    key_files:
      - ".opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000292"
      session_id: "029-001-plan"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Canonicalize missing IPC socket dirs in code-graph resolveIpcSocketPath

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (Node 25, ESM) |
| **Framework** | MCP server (system-code-graph) |
| **Storage** | N/A (path resolution + unix socket) |
| **Testing** | vitest |

### Overview
`resolveIpcSocketPath` only canonicalized the socket dir when it existed; a missing `/tmp/<service>` dir stayed literal and failed `isWithinAllowedSocketRoot` (which compares against canonicalized `/private/tmp`). The fix makes `canonicalizePath` realpath the nearest existing ancestor and re-append the missing tail, then routes `resolveIpcSocketPath` through it.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] Tests passing (vitest regression + existing suite unaffected)
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Pure path-resolution helper feeding a guard check; no architectural change.

### Key Components
- **`canonicalizePath`**: Now ancestor-aware — walks up to the nearest existing directory, `realpath`s it, and re-appends the missing tail segments.
- **`resolveIpcSocketPath`**: Uses `canonicalizePath(rawSocketDir)` instead of an `existsSync ? realpath : literal` ternary.
- **`isWithinAllowedSocketRoot` / `allowedSocketRoots`**: Unchanged; now receives a consistently-canonical candidate.

### Data Flow
`SPECKIT_IPC_SOCKET_DIR` → `path.resolve` → `canonicalizePath` (ancestor realpath) → allowed-root check → `startIpcSocketServer` `mkdirSync(dirname)` → bind socket.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `canonicalizePath` (helper) | Canonicalizes paths for the allowed-root comparison | update (ancestor-walk for missing leaf) | vitest `ipc-socket-resolve.vitest.ts` |
| `resolveIpcSocketPath` (producer) | Resolves the socket path + enforces the guard | update (use canonicalizePath) | regression test + build |
| `allowedSocketRoots` / `isWithinAllowedSocketRoot` (policy) | Defines/checks allowed roots | unchanged | reads canonical candidate; out-of-root still rejected |
| `startIpcSocketServer` (consumer) | mkdirs the socket dir + binds | unchanged | socket-server.ts:171 `mkdirSync(dirname, recursive)` creates the canonical dir |
| system-spec-kit / system-skill-advisor socket-servers | Sibling IPC servers | not a consumer (no allowed-root check) | `grep -c isWithinAllowedSocketRoot` = 0 in both |

Invariant: for any `SPECKIT_IPC_SOCKET_DIR` under an allowed root, resolution succeeds whether or not the leaf exists; for any dir outside allowed roots, resolution still throws.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Located the failure (mk_code_index -32000) and root cause via MCP logs
- [x] Confirmed only system-code-graph has the allowed-root check

### Phase 2: Core Implementation
- [x] `canonicalizePath` ancestor-walk for missing leaves
- [x] `resolveIpcSocketPath` routes through `canonicalizePath`
- [x] Rebuilt system-code-graph dist (tsc --build, exit 0)

### Phase 3: Verification
- [x] Regression test (missing-dir resolves; out-of-root rejects) — 2/2 pass
- [x] Removed the manual /tmp socket dir so the fix is self-sufficient on reconnect
- [x] Documentation updated
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `resolveIpcSocketPath` missing-dir + out-of-root | vitest |
| Manual | mk_code_index reconnect with no pre-created socket dir | /mcp reconnect (Phase 2) |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| system-code-graph dist rebuild | Internal | Green | Daemon would run old code on reconnect |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Socket resolution regresses or an unexpected dir is accepted.
- **Procedure**: Revert the two edits in `socket-server.ts` (restore the `existsSync` ternary + original `canonicalizePath`), rebuild dist. The guard logic is unchanged, so rollback is isolated.
<!-- /ANCHOR:rollback -->
