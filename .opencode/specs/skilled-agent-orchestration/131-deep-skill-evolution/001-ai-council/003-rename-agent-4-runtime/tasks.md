---
title: "Tasks: 115/003 — agent runtime rename"
description: "4-runtime mirror rename task list."
trigger_phrases: ["115 003 tasks"]
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/131-deep-skill-evolution/001-ai-council/003-rename-agent-4-runtime"
    last_updated_at: "2026-05-21T00:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "Authored 115/003 tasks.md"
    next_safe_action: "Author 115/003 impl-summary"
    blockers: []
    key_files: ["spec.md", "plan.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000115003"
      session_id: "115-003-tasks-init"
      parent_session_id: null
    completion_pct: 15
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Tasks: 115/003 — agent runtime rename

---

<!-- ANCHOR:notation -->
## Task Notation
T### IDs; [P] parallel; [D:T###] depends on
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
- [ ] T001 Verify 001/scratch/rename-plan.json present
- [ ] T002 git status --short clean for 4 agent paths
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
- [ ] T010 [P] git mv .opencode/agents/deep-ai-council.md → ai-council.md + sed body
- [ ] T011 [P] git mv .claude/agents/deep-ai-council.md → ai-council.md + sed body
- [ ] T012 [P] git mv .codex/agents/deep-ai-council.toml → ai-council.toml + sed body
- [ ] T013 [P] git mv .gemini/agents/deep-ai-council.md → ai-council.md + sed body
- [ ] T014 [P] Update 4 README.txt files (literal substitution where present)
- [ ] T015 [D:T010..T013] Verify frontmatter `name: ai-council` in all 4 files
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
- [ ] T020 [D:T015] rg "deep-ai-council" .opencode/agents/ .claude/agents/ .codex/agents/ .gemini/agents/ → 0
- [ ] T021 [D:T020] validate.sh --strict 003 exit 0
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria
- All tasks [x]; strict validate PASS
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References
- Spec: `spec.md` | Plan: `plan.md` | Parent: `../spec.md`
- Memory: [[feedback_new_agent_mirror_all_runtimes]], [[feedback_rename_grep_case_insensitive]]
<!-- /ANCHOR:cross-refs -->
