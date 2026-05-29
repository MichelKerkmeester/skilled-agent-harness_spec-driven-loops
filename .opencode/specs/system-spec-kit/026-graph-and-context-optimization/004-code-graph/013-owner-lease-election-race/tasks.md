---
title: "Tasks: owner-lease election race (OR-R-01)"
description: "Task Format: T### [P?] Description (file path). Phase 1 investigation complete; Phase 2-3 fix + verification deferred pending owner decision."
trigger_phrases:
  - "OR-R-01 tasks"
  - "election race fix tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/004-code-graph/013-owner-lease-election-race"
    last_updated_at: "2026-05-29T14:30:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Investigation tasks complete; fix tasks queued (deferred)"
    next_safe_action: "Owner decision on Option B, then execute Phase 2-3"
    blockers:
      - "Phase 2-3 blocked on owner risk-decision"
    key_files:
      - "tasks.md"
    completion_pct: 50
    open_questions: []
    answered_questions: []
---
# Tasks: Owner-Lease Election Race (OR-R-01)

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

> Investigation phase — COMPLETE.

- [x] T001 Trace the launcher launch-election flow (`mk-code-index-launcher.cjs`)
- [x] T002 Confirm `writeLeaseFile` runs outside `if (lockHeld)` and the reprobe is non-atomic (948-954)
- [x] T003 Confirm the daemon does not re-elect (only heartbeat refresh + self-shutdown, `index.ts:46-55`)
- [x] T004 Classify severity (P2 benign-transient; corruption path closed by OR-1-01) and draft fix options
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

> Fix phase — DEFERRED pending the owner risk-decision (Option A vs B).

- [B] T005 Make `writeLeaseFile()` exclusive (O_EXCL), clearing a stale PID lease first (Option B) (`mk-code-index-launcher.cjs`)
- [B] T006 Ensure the EEXIST path bridges/exits cleanly so a loser never `launchServer`s (`mk-code-index-launcher.cjs`)
- [B] T007 Verify the bootstrap-lock-loser take-over behavior is preserved (or intentionally changed) (`mk-code-index-launcher.cjs`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

> DEFERRED — runs after the Phase 2 fix lands.

- [B] T008 Two-launcher concurrent-reclaim election test; assert a single `launchServer` (`tests/launcher-lease.vitest.ts`)
- [B] T009 Full suite green + `launcher-lease` stable across repeated runs
- [B] T010 Update `implementation-summary.md` + the review-r2-opus report (mark OR-R-01 resolved)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All Phase 2-3 tasks marked `[x]` (currently `[B]`, blocked on the owner decision)
- [ ] No `[B]` blocked tasks remaining
- [ ] Two-launcher election test passes; full suite green
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Investigation**: See `implementation-summary.md`
- **Source finding**: `../011-source-bug-and-misalignment-audit/review-r2-opus/review-report.md` §10 (OR-R-01)
<!-- /ANCHOR:cross-refs -->

---
