---
title: "Tasks: Phase 24: retention-tightening"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "goal state retention tightening tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/026-goal-opencode-plugin/024-retention-tightening"
    last_updated_at: "2026-07-04T19:00:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Executed and verified both deliverables"
    next_safe_action: "Phase complete"
    blockers: []
    key_files:
      - ".opencode/plugins/mk-goal.js"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "032-phase-024-retention-tightening-20260704"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 24: retention-tightening

<!-- SPECKIT_LEVEL: 1 -->

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

- [x] T001 Run `node --test .opencode/plugins/tests/*.test.cjs` fresh. Evidence: baseline `# tests 110`, `# pass 110`, `# fail 0`.
- [x] T002 `rg -n "DEFAULT_ACTIVE_RETENTION_DAYS|ACTIVE_RETENTION_DAYS"` across the test suite. Evidence: zero hits — no test pins the literal default, safe to change.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 [REQ-001] Change `DEFAULT_ACTIVE_RETENTION_DAYS` from `30` to `2` in `mk-goal.js:34`. Evidence: `Edit` applied; `node --check` clean.
- [x] T004 [P] [REQ-001] Update `ENV_REFERENCE.md:683` default column to `2`. Evidence: `Edit` applied.
- [x] T005 [P] [REQ-001] Update `goal_plugin.md:61` default column to `2`. Evidence: `Edit` applied.
- [x] T006 Run the full suite again. Evidence: `# tests 110`, `# pass 110`, `# fail 0` — unchanged.
- [x] T007 [REQ-002] Confirm exact archive scope with the operator before touching runtime data (`AskUserQuestion`: literal-all-43 vs only-older-than-2-days). Evidence: operator selected "only the 26 files older than 2 days."
- [x] T008 [REQ-002] Execute the migration. Evidence: first attempt via unquoted `for f in $(find ...)` failed safely (bash word-splitting collapsed the multi-line list into one argument; `mv` errored "File name too long"; verified 0 files actually moved). Redone via `find ... -print0 | xargs -0 -I{} mv {} .archive/`, immune to word-splitting.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 `node --check .opencode/plugins/mk-goal.js`; comment hygiene (`sk-code/code-quality/scripts/check-comment-hygiene.sh` — path relocated by the concurrent sk-code parent-hub conversion, re-located and used the current path); alignment drift (`sk-code/code-verify/assets/scripts/verify_alignment_drift.py`, also relocated). Evidence: all three clean/PASS, 0 findings/errors/warnings/violations.
- [x] T010 Post-move counts. Evidence: active remaining = 17, archived = 26 (sums to the pre-migration 43); archive directory mode `drwx------` (0700, matches `ensureGoalArchiveDir`); oldest surviving active file mtime = Jul 2 18:55, exactly at the cutoff boundary.
- [x] T011 Write `implementation-summary.md`; set this phase's spec.md Status to Complete.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
