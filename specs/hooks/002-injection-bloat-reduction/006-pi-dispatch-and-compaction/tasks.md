---
title: "Tasks: Pi Dispatch and Compaction"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "pi dispatch directive tasks"
  - "compact pi arbitration tasks"
importance_tier: "important"
contextType: "implementation"
parent: "hooks"
_memory:
  continuity:
    packet_pointer: "hooks/002-injection-bloat-reduction/006-pi-dispatch-and-compaction"
    last_updated_at: "2026-08-06T00:00:00Z"
    last_updated_by: "opus"
    recent_action: "Authored the task list for Pi dispatch directive compaction"
    next_safe_action: "Begin T001 once Phase 001 receipts land"
    blockers:
      - "001-measurement-and-receipts-foundation has not yet been built"
    key_files:
      - ".opencode/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts"
    session_dedup:
      fingerprint: "sha256:f9642af1d1d92d1e733bc11605d66e2fe4ca50dbc3beed39b8103bbb676242e5"
      session_id: "2026-08-06-hooks-002-006"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Pi Dispatch and Compaction

<!-- SPECKIT_LEVEL: 2 -->
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

Status: Planned - nothing below has been implemented yet; this list is the forward plan for the phase.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 [B] Enumerate the five preserved dispatch semantics (native default, explicit current-turn override, preload, anti-signal, child exclusion) (`prompt-advisor.ts`)
- [ ] T002 Map each semantic to a concrete test case
- [ ] T003 Locate the `PI_SUBAGENT_DISPATCH_DIRECTIVE` emission site and the advisor-failure fallback path (`prompt-advisor.ts`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Draft the compact directive candidate design against the five-semantics matrix (`prompt-advisor.ts`)
- [ ] T005 Design the prototype flag and its shadow-only evaluation path (`prompt-advisor.ts`)
- [ ] T006 Design the compaction-aware dedup reset (`prompt-advisor.ts`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T007 Build and execute the shadow-mode prototype; confirm zero output diff against the 554 B baseline while off
- [ ] T008 Run the five-semantics test matrix against the executed candidate
- [ ] T009 Run the fail-open negative control with the prototype flag both on and off
- [ ] T010 Record the executed byte count and compare against the 177 B ceiling and 424 B modeled saving
- [ ] T011 Document the per-block rollback procedure
- [ ] T012 Reconcile spec/plan/tasks/checklist/implementation-summary for this packet
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Five-semantics matrix and fail-open negative control both green
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
