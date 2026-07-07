---
title: "Implementation Summary: Code-Graph Workspace-Root + IPC Socket Reconnect Fix [template:level_2/implementation-summary.md]"
description: "Restored mk_code_index MCP reconnection by fixing two stacked startup crashes: stray-dir-induced workspace mis-resolution and an over-strict IPC socket-dir check that rejected the required /tmp path."
trigger_phrases:
  - "code index reconnect summary"
  - "mk_code_index fix summary"
  - "OUTSIDE_WORKSPACE fix"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-code-graph/007-code-graph-buildout/003-code-graph-workspace-root-fix"
    last_updated_at: "2026-05-26T08:30:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Implemented + verified both fixes; authored spec docs"
    next_safe_action: "Reconnect mk_code_index in Claude Code (/mcp)"
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
    answered_questions:
      - "Why -32000? Server crashed on startup before the bridge could connect."
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 003-code-graph-workspace-root-fix |
| **Completed** | 2026-05-26 |
| **Level** | 2 |
| **Base SHA** | 03824a9c44 (uncommitted working tree) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

`mk_code_index` now reconnects. The `/mcp` panel reported `Failed to reconnect to mk_code_index: -32000` — a generic JSON-RPC failure that masked the real story: the code-graph server was crashing during startup, so the launcher's bridge had nothing to connect to. There were **two** independent crashes stacked on top of each other; fixing the first revealed the second.

### Fix 1 — Workspace-root resolution survives stray `.opencode/` dirs
`resolveWorkspaceRoot()` used to return the first ancestor that *contained* a `.opencode/` child. A stray, untracked `.opencode/skills/system-code-graph/.opencode/` artifact (an advisor-state file written to the wrong relative path) satisfied that test, so the "workspace root" resolved to the skill directory. The canonical DB dir (`.opencode/.spec-kit/code-graph/database`) then sat *outside* that root, and `resolveCanonicalDbDir` threw `CanonicalDbDirError: OUTSIDE_WORKSPACE`, killing the process. The resolver now walks the running module's **own ancestry** for the path segment literally named `.opencode` and returns its parent — stray sibling/child `.opencode/` dirs are never on that path, so they can't shadow the real root. The 5 stray dirs were also deleted.

### Fix 2 — IPC socket accepts the required `/tmp` dir
Once Fix 1 let startup proceed, `resolveIpcSocketPath()` threw because the configured `SPECKIT_IPC_SOCKET_DIR=/tmp/mk-code-index` wasn't within `process.cwd()`. That check came from a security-hardening commit (`759bc3dbc2`) and applied only to code-index — the sibling servers (`mk-spec-memory`, `mk-skill-advisor`) never had it, which is why they worked. But `/tmp` is mandatory here: the in-workspace socket path is 121 chars, over the macOS `sun_path` 104-char limit. The fix introduces an allowed-roots set — workspace + `os.tmpdir()` + `/tmp` — and gates both `resolveIpcSocketPath` and `canUnlinkExistingSocket` on it. The unlink owner-check (socket-type + matching uid) is preserved, so the hardening intent survives while the legitimate `/tmp` location is permitted.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `…/mcp_server/core/config.ts` | Modified | Anchor `resolveWorkspaceRoot()` on on-path `.opencode`; import `basename` (+18/−2 vs working tree) |
| `…/mcp_server/lib/ipc/socket-server.ts` | Modified | Allowed-roots helpers; relax socket-dir + unlink checks; import `os` (+41/−8) |
| `…/mcp_server/dist/**` | Modified | Rebuilt via `tsc --build` |
| `.opencode/skills/{system-code-graph,system-skill-advisor,sk-doc,system-spec-kit}/**/.opencode/` | Deleted | 5 stray untracked artifact dirs |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Each root cause was reproduced by running the launcher directly before any edit, and verified after. Final verification: `tsc` typecheck + `tsc --build` both exit 0; the launcher starts clean and logs `[ipc-bridge] socket listening at /private/tmp/mk-code-index/daemon-ipc.sock`; a restart reclaims the stale socket without `EADDRINUSE`; and a real MCP JSON-RPC handshake returns `initialize → mk-code-index 1.0.0` and `tools/list → 8 tools`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Anchor resolver on the on-path `.opencode` segment rather than first-containing-ancestor | Immune to stray sibling/child `.opencode/` dirs, which were the actual failure mode |
| Allow `os.tmpdir()` AND `/tmp` explicitly | On macOS `os.tmpdir()` is `/var/folders/…`, not `/tmp`; the config + project convention use `/tmp`, so both roots are needed |
| Keep the unlink owner-check | Preserves the security-hardening intent; only the location constraint is relaxed |
| Didn't touch sibling servers | They never had the strict check and are unaffected — out of scope |
| Level 2 despite ~50 LOC | Path-resolution + socket-security boundary raises risk above the LOC band |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `npm run typecheck` | PASS (exit 0) |
| `npm run build` (`tsc --build`) | PASS (exit 0); `dist/core/config.js` shows `basename(current) === '.opencode'` |
| Launcher startup (DB resolution) | PASS — no `OUTSIDE_WORKSPACE`; workspace root = `…/Public` |
| IPC socket bind | PASS — `socket listening at /private/tmp/mk-code-index/daemon-ipc.sock`, mode `0600` |
| Stale-socket restart | PASS — rebound, no `EADDRINUSE` throw |
| MCP `initialize` | PASS — `mk-code-index 1.0.0` |
| MCP `tools/list` | PASS — 8 tools (code_graph_scan/query/status/context/classify_query_intent/verify/apply, detect_changes) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- The MCP connection self-heals on the next reconnect/session; the running `/mcp` panel may still show the stale `-32000` until a reconnect.
- Pre-existing latent mismatch between `config.ts` `defaultDir` fallback (`mcp_server/database`) and the documented canonical DB dir remains — already flagged in-code for a separate system-code-graph follow-up; out of scope here.
- Resolver assumes no `.opencode` segment nests *on the module's own path* (true for the framework layout); a deeper marker (`.git`) was considered and deferred.
<!-- /ANCHOR:limitations -->
