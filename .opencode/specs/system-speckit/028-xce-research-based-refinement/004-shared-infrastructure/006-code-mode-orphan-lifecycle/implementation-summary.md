---
title: "Implementation Summary: Code Mode MCP Orphan Lifecycle Fix"
description: "Shipped session-lifetime handling for the mcp-code-mode stdio server (stdin-EOF exit, transport-close exit, reparent watchdog) and reaped the 16 accumulated PPID-1 orphans."
trigger_phrases:
  - "code mode orphan summary"
  - "lifecycle fix shipped"
  - "orphan census zero"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-xce-research-based-refinement/004-shared-infrastructure/006-code-mode-orphan-lifecycle"
    last_updated_at: "2026-06-11T16:30:00Z"
    last_updated_by: "claude-fable"
    recent_action: "Shipped lifecycle fix + reaped orphans; census zero"
    next_safe_action: "None; complete. New sessions adopt automatically"
    blockers: []
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Status** | Complete |
| **Level** | 1 |
| **Branch** | `028-mcp-to-cli-tool-transition` |
| **Completed** | 2026-06-11 |

<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The mcp-code-mode stdio MCP server now ends with its session. A new `exitWhenSessionEnds(transport)` in `mcp_server/index.ts` exits the process on stdin EOF or close (the normal session-end signal), on transport close, and — for hard kills that deliver no EOF — when an unref'd 15-second watchdog observes the process reparented to PID 1. `dist/` was rebuilt so every new session adopts the behavior. The 16 accumulated PPID-1 orphans (oldest 11 days) were reaped in the same pass; live session-attached servers were left untouched and exit with their sessions.

<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Root cause read directly from `index.ts` (the 337-line server had zero lifecycle handling). The fix was authored by the orchestrator, rebuilt with `npm run build`, smoke-tested, and the reap executed with operator authorization after a single-process kill test proved signal delivery works from this session.

<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

- Exit 0 (not non-zero) on session end: this is a normal lifecycle event, not a failure.
- The watchdog is `unref`'d so it can never hold the event loop open and alter normal shutdown.
- Live processes were deliberately not signaled; their sessions end them naturally.

<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Build | PASS: `tsc` clean, dist carries the lifecycle handling |
| stdin EOF smoke | PASS: `node dist/index.js < /dev/null` exits 0 promptly with "shutting down: stdin closed" (previously hung indefinitely) |
| Orphan census | PASS: 16 reaped → 0 remaining; live session-attached servers untouched |

<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- The reparent watchdog polls every 15 seconds, so a no-EOF hard-kill orphan lives up to 15 seconds — bounded, versus forever before.
- Already-running servers keep the old code until their sessions end; adoption is complete once current sessions cycle.

<!-- /ANCHOR:limitations -->
