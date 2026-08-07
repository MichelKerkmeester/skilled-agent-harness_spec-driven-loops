---
title: "Code Graph Phase 003: Workspace-Root and IPC Socket Reconnect Fix"
description: "Two stacked startup crashes prevented mk_code_index from reconnecting. A stray nested .opencode dir mis-resolved the workspace root and triggered OUTSIDE_WORKSPACE on the DB dir. An over-strict IPC socket check then rejected the required /tmp path. Both were fixed and the MCP handshake was verified end-to-end."
trigger_phrases:
  - "mk_code_index reconnect fix"
  - "OUTSIDE_WORKSPACE workspace root"
  - "IPC socket /tmp fix"
  - "code graph startup crash"
  - "-32000 JSON-RPC fix"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-26

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-code-graph/003-code-graph-workspace-root-fix` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-code-graph`

### Summary

The `/mcp` panel reported `Failed to reconnect to mk_code_index: -32000`. The generic JSON-RPC error code masked the real cause: the code-graph server was crashing before the launcher's bridge could connect. Investigation found two independent startup crashes stacked on top of each other.

Fix 1 corrected workspace-root resolution. `resolveWorkspaceRoot()` walked up to the first ancestor containing a `.opencode/` child, so a stray untracked artifact at `.opencode/skills/system-code-graph/.opencode/` satisfied the test and resolved the workspace to the skill directory. The canonical DB dir then sat outside that root and `resolveCanonicalDbDir` threw `CanonicalDbDirError: OUTSIDE_WORKSPACE`. The resolver now anchors on the `.opencode` segment in the running module's own path, which stray sibling or child dirs can never shadow.

Fix 2 corrected IPC socket validation. Once Fix 1 unblocked startup, `resolveIpcSocketPath()` threw because `SPECKIT_IPC_SOCKET_DIR=/tmp/mk-code-index` was not within `process.cwd()`. That check came from a security-hardening commit that applied only to code-index. The `/tmp` location is mandatory on macOS because the in-workspace socket path is 121 characters, which exceeds the `sun_path` 104-character limit. The fix introduces an allowed-roots set (workspace, `os.tmpdir()`, `/tmp`) for both path validation and the unlink check. The unlink owner check (socket-type plus uid match) is preserved. After both fixes, `mk_code_index` completes a clean MCP handshake and returns 8 tools.

### Added

- `canonicalizePath`, `allowedSocketRoots` and `isWithinAllowedSocketRoot` helpers in `lib/ipc/socket-server.ts`
- Allowed-roots gate on `resolveIpcSocketPath` covering workspace, `os.tmpdir()` and `/tmp`
- Stale-socket reclaim path so a restart rebinds without `EADDRINUSE`

### Changed

- `resolveWorkspaceRoot()` in `core/config.ts` now anchors on the on-path `.opencode` segment instead of first-containing-ancestor traversal
- `canUnlinkExistingSocket` uses the allowed-roots set while keeping socket-type and owner-uid checks
- 5 stray untracked `.opencode/` artifact dirs under `.opencode/skills/` deleted

### Fixed

- `CanonicalDbDirError: OUTSIDE_WORKSPACE` thrown at startup when a stray nested `.opencode/` dir mis-resolved the workspace root
- `resolveIpcSocketPath` throwing when the configured `/tmp` socket dir was not within `process.cwd()`
- `mk_code_index` failing to reconnect with `-32000` due to both stacked crashes

### Verification

| Check | Result |
|-------|--------|
| `npm run typecheck` | PASS (exit 0) |
| `npm run build` (`tsc --build`) | PASS (exit 0). `dist/core/config.js` confirms `basename(current) === '.opencode'` |
| Launcher startup (DB resolution) | PASS. No `OUTSIDE_WORKSPACE`. Workspace root resolves to `…/Public` |
| IPC socket bind | PASS. Socket listening at `/private/tmp/mk-code-index/daemon-ipc.sock`, mode `0600` |
| Stale-socket restart | PASS. Second run rebinds without `EADDRINUSE` |
| MCP `initialize` | PASS. Returns `mk-code-index 1.0.0` |
| MCP `tools/list` | PASS. Returns 8 tools (`code_graph_scan`, `code_graph_query`, `code_graph_status`, `code_graph_context`, `code_graph_classify_query_intent`, `code_graph_verify`, `code_graph_apply`, `detect_changes`) |
| Strict packet validation | PASS. `validate.sh --strict` exits 0 |

### Files Changed

| File | What changed |
|------|--------------|
| `.opencode/skills/system-code-graph/mcp_server/core/config.ts` | `resolveWorkspaceRoot()` anchored on on-path `.opencode` segment. `basename` import added. (+18/-2) |
| `.opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts` | Allowed-roots helpers added. Socket-dir and unlink checks relaxed to allowed roots. `os` import added. (+41/-8) |
| `.opencode/skills/system-code-graph/mcp_server/dist/**` | Rebuilt via `tsc --build` after both source changes |
| `.opencode/skills/**/.opencode/` | 5 stray untracked artifact dirs deleted (system-code-graph, system-skill-advisor, sk-doc, system-spec-kit) |

### Follow-Ups

- The `/mcp` panel may still show the stale `-32000` error until the next reconnect or session restart. The server self-heals on reconnect.
- A pre-existing mismatch between `config.ts` `defaultDir` fallback (`mcp_server/database`) and the documented canonical DB dir is already flagged in-code for a separate system-code-graph follow-up.
- The on-path `.opencode` anchor assumes no `.opencode` segment nests on the module's own path. A deeper marker such as `.git` was considered and deferred.
