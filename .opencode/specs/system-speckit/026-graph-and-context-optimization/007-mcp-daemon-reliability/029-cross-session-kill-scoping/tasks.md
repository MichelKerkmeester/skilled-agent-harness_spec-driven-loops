---
title: "Tasks: Cross-Session Kill Scoping [system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability/029-cross-session-kill-scoping/tasks]"
description: "Forensics, two fixes, five drills, one salvage."
trigger_phrases:
  - "kill scoping tasks"
  - "026 007 016 tasks"
importance_tier: "normal"
contextType: "tasks"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability/029-cross-session-kill-scoping"
    last_updated_at: "2026-06-06T17:05:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Both fixes shipped and drilled; live index salvaged"
    next_safe_action: "Run an embedding reconcile pass on the recovered index"
    blockers: []
    key_files:
      - "tasks.md"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Cross-Session Kill Scoping

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Forensics: rank disconnect root causes from logs + source; verify childPid lease and stale-lockdir reclaim already shipped by prior phases (no change needed)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 Cleanup scoping: remove PPID fallback, add kill-time ancestry re-proof + attributable log fields (.opencode/scripts/session-cleanup.sh)
- [x] T003 Integrity gate: marker-gated quick_check at open + corruption-variant needs-rebuild sentinel writer (mcp_server/lib/search/vector-index-store.ts); tsc clean; dist rebuilt
- [x] T004 Live-index salvage: sqlite3 .recover to verified candidate; reversible swap with original preserved (mcp_server/database/)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T005 Scoping drills: no-identity no-op; foreign-session isolation (target survives); own-session kill with ancestor_ok=yes
- [x] T006 Integrity drills: structural corruption + marker → FATAL + sentinel + throw; clean DB + marker → normal init
- [x] T007 Post-swap probe: quick_check ok; memory_index 9,888 rows (2 lost), 368 orphans parked in lost_and_found
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] REQ-001..REQ-003 verified with drill evidence
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Sibling owners**: RC-3 → `../007-bridge-liveness-reap`; RC-1 → `../005-provider-dispose`; RC-2 → `../006-graceful-exit-watchdog`
- **Origin**: surfaced while closing the 028 MCP→CLI transition program's incident class
<!-- /ANCHOR:cross-refs -->
