---
title: "Feature Specification: Code Mode MCP Orphan Lifecycle Fix"
description: "The mcp-code-mode stdio MCP server had no session-lifetime handling, so hard-killed sessions left permanent PPID-1 orphans that piled up for days and degraded shared infrastructure. Add stdin-EOF exit, transport-close exit, and a reparent watchdog."
trigger_phrases:
  - "code mode orphan lifecycle"
  - "mcp-code-mode ppid orphan fix"
  - "stdio server stdin eof exit"
importance_tier: "normal"
contextType: "implementation"
status: "completed"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-xce-research-based-refinement/004-shared-infrastructure/006-code-mode-orphan-lifecycle"
    last_updated_at: "2026-06-11T16:30:00Z"
    last_updated_by: "claude-fable"
    recent_action: "Shipped lifecycle fix + reaped 16 accumulated orphans"
    next_safe_action: "None; complete. New sessions adopt automatically"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-code-mode/mcp_server/index.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-11-029-orphan-lifecycle"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- SPECKIT_LEVEL: 1 -->

# Feature Specification: Code Mode MCP Orphan Lifecycle Fix

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-11 |
| **Branch** | `028-mcp-to-cli-tool-transition` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | system-spec-kit/027-xce-research-based-refinement |
| **Predecessor** | None |
| **Successor** | None |
| **Handoff Criteria** | Server exits on stdin EOF; orphan census stays at zero across session churn |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The mcp-code-mode stdio MCP server (`mcp_server/index.ts`) connected its transport and never handled session end: no stdin-EOF handler, no transport-close handler, no parent watchdog. A hard-killed parent session left the process alive, reparented to PID 1, permanently. Sixteen such orphans (up to 11 days old) had accumulated and degraded shared daemon infrastructure, contributing to bridge-probe timeouts in new sessions.

### Purpose
Make the server's lifetime equal its parent session's lifetime, so orphans can never accumulate again, and reap the existing orphan population.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Lifecycle handling in `index.ts`: exit on stdin EOF/close, exit on transport close, and a 15-second reparent watchdog (exit when `process.ppid` becomes 1) for hard kills that deliver no EOF.
- Rebuild `dist/` so new sessions adopt the fix.
- One-time reap of the 16 accumulated PPID-1 orphans (operator-authorized).

### Out of Scope
- Any change to the server's tool surface, UTCP client, or registered tools.
- Touching live session-attached server processes (they adopt on natural session end).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/mcp-code-mode/mcp_server/index.ts` | Modify | Add `exitWhenSessionEnds()` lifecycle handling |
| `.opencode/skills/mcp-code-mode/mcp_server/dist/*` | Rebuild | `npm run build` output |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)
- **REQ-001**: The server exits promptly when its stdin reaches EOF or closes.
- **REQ-002**: The server exits when reparented to PID 1, even if no EOF is delivered.

### P1 - Required (complete OR user-approved deferral)
- **REQ-003**: The watchdog must not keep the event loop alive on its own (`unref`), so normal shutdown paths are unaffected.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- `node dist/index.js < /dev/null` exits 0 promptly instead of hanging.
- Orphan census (`ps` for PPID-1 `mcp-code-mode/mcp_server/dist/index.js`) is zero after the reap and stays zero across session churn.
- Build (`tsc`) clean; dist contains the lifecycle handling.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- **Premature exit risk**: stdin EOF only occurs when the parent's pipe closes, which is session end by definition for a stdio MCP server. The watchdog only fires on reparenting to PID 1.
- **Live processes**: running servers keep the old code in memory; they exit with their sessions naturally, so no live process needed touching.
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->
