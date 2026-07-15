---
title: "Verification Checklist: Code-Graph Workspace-Root + IPC Socket Reconnect Fix [template:level_2/checklist.md]"
description: "Verification Date: 2026-05-26"
trigger_phrases:
  - "code index reconnect checklist"
  - "workspace root checklist"
  - "ipc socket checklist"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-code-graph/031-code-graph-buildout/003-code-graph-workspace-root-fix"
    last_updated_at: "2026-05-26T08:30:00Z"
    last_updated_by: "claude-opus"
    recent_action: "All P0/P1 checklist items verified"
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
# Verification Checklist: Code-Graph Workspace-Root + IPC Socket Reconnect Fix

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md
- [x] CHK-002 [P0] Technical approach defined in plan.md
- [x] CHK-003 [P1] Root causes reproduced before fixing (launcher evidence)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `tsc --noEmit` typecheck passes (exit 0)
- [x] CHK-011 [P0] `tsc --build` succeeds; `dist` regenerated with new logic
- [x] CHK-012 [P1] Error handling preserved (typed throws on disallowed socket dir)
- [x] CHK-013 [P1] Code follows sibling-server patterns (spec-memory/skill-advisor)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] REQ-001..003 met (no OUTSIDE_WORKSPACE; socket binds; 8 tools)
- [x] CHK-021 [P0] Manual launcher + MCP handshake verified
- [x] CHK-022 [P1] Edge case: stale-socket restart reclaim (REQ-004)
- [x] CHK-023 [P1] Edge case: stray sibling `.opencode/` ignored by resolver
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Findings classed: resolver = `algorithmic`; socket = `class-of-bug` (security-hardening over-reach), `cross-consumer` (3 sibling servers checked)
- [x] CHK-FIX-002 [P0] Same-class producer inventory: `grep` across all `*/socket-server.ts` — only code-index had the strict check
- [x] CHK-FIX-003 [P0] Consumer inventory: `resolveWorkspaceRoot`, `resolveIpcSocketPath`, `canUnlinkExistingSocket` call sites in `index.ts` reviewed
- [x] CHK-FIX-004 [P0] Path/resolver adversarial cases covered: stray sibling dir, outside-root socket, non-existent dir, stale-socket reclaim, fallback to cwd
- [x] CHK-FIX-005 [P1] Matrix axes listed: {server} × {socket dir = workspace | os.tmpdir | /tmp | disallowed}
- [x] CHK-FIX-006 [P1] Hostile-state variant: socket owned by another uid → not unlinked (owner check)
- [x] CHK-FIX-007 [P1] Evidence pinned to current working-tree state + rebuilt dist
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets
- [x] CHK-031 [P0] Socket dir validated against an allowed-roots set (not unrestricted)
- [x] CHK-032 [P1] Unlink hardening intact: socket-type + owner-uid match required; socket file mode `0600`
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] spec/plan/tasks/checklist synchronized
- [x] CHK-041 [P1] In-code comments explain the sun_path rationale + resolver assumption
- [x] CHK-042 [P2] README update — N/A (internal launcher behavior unchanged)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] No temp files left outside scratch/
- [x] CHK-051 [P1] 5 stray `.opencode/` artifact dirs removed
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 11 | 11/11 |
| P1 Items | 11 | 11/11 |
| P2 Items | 2 | 2/2 |
<!-- /ANCHOR:summary -->
