---
title: "Implementation Summary: Canonicalize missing IPC socket dirs in code-graph resolveIpcSocketPath"
description: "The code-graph MCP server no longer crashes (-32000) when its /tmp socket dir is missing; resolveIpcSocketPath now canonicalizes via the nearest existing ancestor so a reboot-cleared dir still passes the allowed-root check."
trigger_phrases:
  - "ipc socket dir canonicalize summary"
  - "mk-code-index -32000 fix"
  - "code-graph socket reboot resilience"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/007-mcp-daemon-reliability/001-ipc-socket-dir-canonicalize"
    last_updated_at: "2026-05-28T17:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Shipped canonicalize-missing fix + regression test; dist built; manual dir removed"
    next_safe_action: "None; phase 1 complete. Phase 2 (code_graph_scan) needs MCP reconnect"
    blockers: []
    key_files:
      - ".opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts"
      - ".opencode/skills/system-code-graph/mcp_server/tests/ipc-socket-resolve.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000294"
      session_id: "029-001-impl-summary"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 001-ipc-socket-dir-canonicalize |
| **Completed** | 2026-05-28 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The code-graph MCP server (`mk_code_index`) now survives a missing IPC socket directory. Previously it crashed at startup with `MCP error -32000` whenever `/tmp/mk-code-index` was absent (for example after a reboot clears `/tmp`), because the socket dir was only canonicalized when it already existed.

### Reboot-resilient socket-dir resolution

`canonicalizePath` now canonicalizes a path even when its leaf does not exist: it walks up to the nearest existing ancestor, `realpath`s that (so a symlinked root like macOS `/tmp` → `/private/tmp` normalizes), and re-appends the missing tail. `resolveIpcSocketPath` routes its socket dir through this helper instead of the old `existsSync ? realpath : literal` ternary. A missing `/tmp/mk-code-index` now resolves to `/private/tmp/mk-code-index`, which the allowed-root check accepts (it canonicalizes `/tmp` to `/private/tmp` too). The server then creates the dir on bind via the existing `mkdirSync`. The scope is `system-code-graph` only — its siblings (`system-spec-kit`, `system-skill-advisor`) have no allowed-root check and were never affected.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts` | Modified | `canonicalizePath` ancestor-walk; `resolveIpcSocketPath` uses it |
| `.opencode/skills/system-code-graph/mcp_server/tests/ipc-socket-resolve.vitest.ts` | Created | Regression test (missing-dir resolves; out-of-root rejects) |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Root cause was confirmed from the captured MCP server stderr (`resolveIpcSocketPath` threw "must stay within…") plus reading the function and `allowedSocketRoots`. The change touches only the branch that previously stayed literal/threw, so existing-dir resolution is byte-identical. Verified with a new vitest (2/2) and a clean `tsc --build`; the manual `/tmp/mk-code-index` dir was removed so the next reconnect proves the fix self-sufficient.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Fix `canonicalizePath` (ancestor-walk) rather than mkdir-in-resolve | Keeps resolution pure; `startIpcSocketServer` already `mkdirSync`s the dir on bind, so no side effect is needed in the resolver |
| Scope to system-code-graph only | Only it has the `isWithinAllowedSocketRoot` check; the two sibling socket-servers have no such guard, so the bug cannot occur there (corrected the initial "both servers" framing) |
| Preserve the out-of-root reject | The guard's intent (keep sockets under workspace/temp roots) is still valuable; only the missing-leaf canonicalization changed |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Regression test `ipc-socket-resolve.vitest.ts` | PASS (2/2: missing /tmp dir resolves; /var out-of-root throws) |
| `tsc --build` (system-code-graph) | PASS (exit 0; dist carries the fix) |
| Scope check: sibling socket-servers have the guard? | PASS (grep `isWithinAllowedSocketRoot` = 0 in system-spec-kit + system-skill-advisor) |
| Live reconnect (no pre-created dir) | Pending — folds into Phase 2 `/mcp` reconnect |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Live confirmation deferred.** The unit test + code inspection prove the fix; the live `mk_code_index` reconnect with no pre-created socket dir is verified in Phase 2 (which needs the reconnect anyway).
<!-- /ANCHOR:limitations -->
