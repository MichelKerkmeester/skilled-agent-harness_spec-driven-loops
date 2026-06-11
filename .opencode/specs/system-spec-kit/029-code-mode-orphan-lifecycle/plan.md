---
title: "Implementation Plan: Code Mode MCP Orphan Lifecycle Fix"
description: "Add session-lifetime handling to the mcp-code-mode stdio server, rebuild dist, smoke-test the EOF exit, and reap the accumulated orphans."
trigger_phrases:
  - "code mode orphan plan"
  - "stdio lifecycle plan"
  - "orphan reap plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/029-code-mode-orphan-lifecycle"
    last_updated_at: "2026-06-11T16:30:00Z"
    last_updated_by: "claude-fable"
    recent_action: "Plan executed in full"
    next_safe_action: "None; complete"
---
# Implementation Plan: Code Mode MCP Orphan Lifecycle Fix

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Surface** | `.opencode/skills/mcp-code-mode/mcp_server/` (TypeScript, MCP SDK stdio server) |
| **Change kind** | ~25-line lifecycle addition, behavior otherwise unchanged |
| **Build** | `npm run build` (tsc) regenerates `dist/` |
| **Adoption** | New sessions only; live processes exit with their sessions |

### Overview
One new function, `exitWhenSessionEnds(transport)`, wired into `main()` before `mcp.connect`: stdin `end`/`close` handlers, `transport.onclose`, and an unref'd 15-second interval that exits when `process.ppid === 1`.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Root cause confirmed by reading `index.ts` (no lifecycle handling present)
- [x] Orphan population measured (16 PPID-1 processes, oldest 11 days)

### Definition of Done
- [x] Lifecycle handling shipped and `dist/` rebuilt
- [x] EOF smoke test passes (prompt exit 0)
- [x] Orphans reaped to zero, live servers untouched

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Standard stdio-MCP lifetime contract: the server's life is the session's life.

### Key Components
- stdin EOF/close handlers — the normal session-end signal
- `transport.onclose` — SDK-level transport teardown
- Reparent watchdog — hard-kill backstop, `unref`'d so it never holds the loop open

### Data Flow
1. Parent session ends; its side of the stdio pipe closes.
2. stdin delivers EOF (or, on a hard kill with no EOF, the watchdog observes `ppid === 1` within 15 seconds).
3. The server logs the reason to stderr and exits 0.

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Read `index.ts`, confirm absent lifecycle handling, measure orphan population

### Phase 2: Core Implementation
- [x] Add `exitWhenSessionEnds()` and wire into `main()`
- [x] `npm run build`, verify dist carries the fix

### Phase 3: Verification
- [x] Smoke: `node dist/index.js < /dev/null` exits 0 promptly
- [x] Reap the 16 orphans; verify census zero with live servers untouched

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Smoke | stdin EOF exit | `gtimeout 20 node dist/index.js < /dev/null` |
| Census | zero PPID-1 orphans, live servers intact | `ps` filter |
| Build | tsc clean | `npm run build` |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `@modelcontextprotocol/sdk` StdioServerTransport | External | Green | `onclose` hook unavailable |
| Local tsc build | Internal | Green | dist would lag the source fix |

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: any premature server exit during a live session.
- **Procedure**: revert the single `index.ts` edit, `npm run build`. No data or schema involved.

<!-- /ANCHOR:rollback -->
