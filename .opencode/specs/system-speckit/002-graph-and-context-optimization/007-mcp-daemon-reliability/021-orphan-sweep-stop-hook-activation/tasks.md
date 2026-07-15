---
title: "Tasks: Orphan-sweep Stop-hook activation"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "orphan sweep stop hook tasks"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/007-mcp-daemon-reliability/021-orphan-sweep-stop-hook-activation"
    last_updated_at: "2026-06-07T17:20:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Marked implementation + verification tasks complete"
    next_safe_action: "Phase 022 RC-2 ownership re-election"
    blockers: []
    key_files:
      - ".opencode/scripts/session-cleanup.sh"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-026-007-021-orphan-sweep-stop-hook-activation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Orphan-sweep Stop-hook activation

<!-- SPECKIT_LEVEL: 2 -->

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

- [x] T001 Confirm `session-cleanup.sh` no-ops without a session pid + refuses a PPID guess (safety contract)
- [x] T002 Confirm `orphan-mcp-sweeper.sh` is orphan-only + pid-independent + supports `--dry-run`
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Add `SCRIPT_DIR` + `SPECKIT_STOP_HOOK_ORPHAN_SWEEP` mode + `SPECKIT_ORPHAN_SWEEPER_BIN` override (`session-cleanup.sh`)
- [x] T004 Add `run_orphan_sweep_fallback` (off/dry-run/live) and wire it into the no-session-pid branch (`session-cleanup.sh`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T005 `bash -n` + functional smoke (off no-op; dry-run --dry-run; live no-flag)
- [x] T006 Add `launcher-stop-hook-orphan-sweep.vitest.ts` (off/dry-run/live/unknown via a stub sweeper); 4 pass
- [x] T007 `validate.sh --strict` for this packet
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Tests + syntax verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
