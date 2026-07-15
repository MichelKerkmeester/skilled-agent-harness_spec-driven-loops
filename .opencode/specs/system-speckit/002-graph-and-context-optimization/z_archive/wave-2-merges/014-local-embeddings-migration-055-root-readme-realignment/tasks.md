---
title: "Tasks: Phase D root README realignment"
description: "Task tracker for Phase D: 3-pass pipeline + sonnet @markdown writer."
trigger_phrases:
  - "055 tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/z_archive/wave-2-merges/014-local-embeddings-migration-055-root-readme-realignment"
    last_updated_at: "2026-05-15T12:55:00Z"
    last_updated_by: "main_agent"
    recent_action: "Created task list"
    next_safe_action: "T004 compose Pass 1 prompt"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:febbe79ce669f07ec4d9a72624b8a10fc23fa159c5c1acf7c5a9dad5b2ca4506"
      session_id: "055-tasks"
      parent_session_id: null
    completion_pct: 10
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase D root README realignment

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[B]` | Blocked |

<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Scaffold packet (7 files)
- [x] T002 Confirm cli-devin + cli-opencode + Task-tool auth carryover
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## PHASE 2: IMPLEMENTATION

- [ ] T003 Compose Pass 1 prompt at `/tmp/devin-055-pass1.md`
- [ ] T004 Dispatch cli-devin
- [ ] T005 Verify `research/root-readme-context-bundle.json` exists
- [ ] T006 Compose Pass 2 prompt at `/tmp/opencode-055-pass2.md`
- [ ] T007 Dispatch cli-opencode + deepseek-v4-pro
- [ ] T008 Verify `research/root-readme-delta-verified.md` exists
- [ ] T009 Compose Task-tool @markdown prompt with verified delta + voice directive
- [ ] T010 Dispatch Task tool subagent_type=markdown
- [ ] T011 Verify `./README.md` updated + `research/root-readme-edit-evidence.md` exists
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## PHASE 3: VERIFICATION

- [ ] T012 git diff `./README.md` shows surgical edits only
- [ ] T013 Manual review of voice/structure preservation
- [ ] T014 Strict-validate packet (exit 0)
- [ ] T015 Fill implementation-summary with results
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]` or `[B]`
- [ ] Root README realigned with surgical edits
- [ ] Strict-validate exits 0
- [ ] Single commit on `main`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Resource Map**: See `resource-map.md`
<!-- /ANCHOR:cross-refs -->
