---
title: "Tasks: 115/002 — skill dir rename"
description: "Mechanical task list for the skill dir rename phase."
trigger_phrases: ["115 002 tasks"]
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/116-deep-skill-evolution/001-ai-council/002-rename-sk-skill"
    last_updated_at: "2026-05-21T00:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "Authored 115/002 tasks.md"
    next_safe_action: "Author 115/002 implementation-summary.md"
    blockers: []
    key_files: ["spec.md", "plan.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000115002"
      session_id: "115-002-tasks-init"
      parent_session_id: null
    completion_pct: 15
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Tasks: 115/002 — skill dir rename

---

<!-- ANCHOR:notation -->
## Task Notation
- `T###` ID; `[P]` parallel; `[D:T###]` depends on
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
- [ ] T001 Verify `001/scratch/rename-plan.json` exists + this phase's file_scope is defined
- [ ] T002 Verify `git status --short .opencode/skills/deep-ai-council` clean
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
- [ ] T010 [D:T001,T002] `git mv .opencode/skills/deep-ai-council .opencode/skills/sk-ai-council`
- [ ] T011 [D:T010] Build sed file-list excluding `changelog/v1.0.0.0.md` and `changelog/v2*.md`
- [ ] T012 [D:T011] `sed -i '' 's/deep-ai-council/sk-ai-council/g'` per file
- [ ] T013 [D:T012] Update SKILL.md frontmatter `name: sk-ai-council`
- [ ] T014 [D:T012] Create `changelog/v3.0.0.0.md` with rename rationale
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
- [ ] T020 [D:T014] `rg "deep-ai-council" .opencode/skills/sk-ai-council/` → hits ONLY in `changelog/v1.0.0.0.md` + `v2*.md`
- [ ] T021 [D:T020] `bash validate.sh --strict 002/` exit 0
- [ ] T022 [D:T021] Author `implementation-summary.md` with what-built / verification / decisions
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria
- [ ] All tasks marked `[x]`
- [ ] Strict validate PASS
- [ ] Handoff to 006-reindex (sequential after 002-005 all done)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References
- Spec: `spec.md` | Plan: `plan.md`
- Parent: `../spec.md` | Pattern source: `../../114-small-ai-model-optimization/007-sk-prompt-small-model-rename/`
- Memory: [[feedback_delete_not_archive_or_comment]], [[feedback_rename_grep_case_insensitive]]
<!-- /ANCHOR:cross-refs -->
