---
title: "Tasks: Code README Cleanup"
description: "PENDING task list for per-directory code readme sweep."
trigger_phrases:
  - "028 release cleanup code readmes tasks"
  - "code-readmes cleanup tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/005-release-cleanup/001-code-readmes"
    last_updated_at: "2026-06-19T00:00:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Created PENDING cleanup tasks"
    next_safe_action: "Run discovery"
    blockers: []
    key_files:
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-tasks-001-code-readmes"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Tasks: Code README Cleanup

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

- [ ] T001 Run discovery for per-directory code readme sweep.
- [ ] T002 Save candidate paths as phase evidence.
- [ ] T003 Confirm packet 030 is not in the candidate list.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Review every candidate document against current source files.
- [ ] T005 Remove stale file, feature and route claims.
- [ ] T006 Apply HVR voice edits.
- [ ] T007 Keep out-of-scope document families unchanged.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Run em dash scan.
- [ ] T009 Run semicolon character scan.
- [ ] T010 Run stale-reference scan.
- [ ] T011 Run strict validation for this child folder.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`.
- [ ] No `[B]` blocked tasks remaining.
- [ ] Manual verification evidence is recorded.
- [ ] Strict validation exits 0.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Parent**: See `../spec.md`
<!-- /ANCHOR:cross-refs -->
