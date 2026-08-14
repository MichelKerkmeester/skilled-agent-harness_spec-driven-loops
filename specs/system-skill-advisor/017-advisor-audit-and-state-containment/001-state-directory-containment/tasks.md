---
title: "Tasks: 001 State Directory Containment"
description: "Task breakdown for 001 State Directory Containment."
trigger_phrases:
  - "advisor-018-001"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/017-advisor-audit-and-state-containment/001-state-directory-containment"
    last_updated_at: "2026-07-27T17:50:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Authored from research"
    next_safe_action: "Choose the anchoring strategy"
    blockers: []
    key_files:
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "advisor-018-001"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: 001 State Directory Containment

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

- [ ] T001 Re-verify each writer at its cited file:line against current HEAD
- [ ] T002 Decide the anchor: marker walk-up, git toplevel, or launcher env var
- [ ] T003 Write the boundary test first, asserting no leak into ANY subtree
- [ ] T004 Land the shared anchored resolver
- [ ] T005 Convert workspace-root.ts to the shared resolver
- [ ] T006 Convert mk-spec-gate.js and mk-cli-dispatch-audit.js
- [ ] T007 Convert the launcher and remaining writers named in the research
- [ ] T008 Prove a writer run from inside a skill folder no longer leaks
- [ ] T009 Untrack the 160 tracked files, then delete the 40 directories
- [ ] T010 Add the .gitignore backstop and prove the root .opencode/ is unaffected
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] Execute the approved dispositions one at a time
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] Re-run every evidence command and record the result
- [ ] `validate.sh --strict` exits 0
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
