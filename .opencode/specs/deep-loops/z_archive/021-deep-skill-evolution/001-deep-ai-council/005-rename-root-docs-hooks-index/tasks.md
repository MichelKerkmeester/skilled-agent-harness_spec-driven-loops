---
title: "Tasks: 115/005 — root docs + hooks + skills index"
description: "4-file mechanical task list"
trigger_phrases: ["115 005 tasks"]
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/116-deep-skill-evolution/001-ai-council/005-rename-root-docs-hooks-index"
    last_updated_at: "2026-05-21T00:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "Authored 005 tasks.md"
    next_safe_action: "Author 005 impl-summary"
    blockers: []
    key_files: ["spec.md", "plan.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000115005"
      session_id: "115-005-tasks-init"
      parent_session_id: null
    completion_pct: 15
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Tasks: 115/005

---

<!-- ANCHOR:notation -->
## Task Notation
T### IDs; [P] parallel
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
- [x] T001 Read target root docs
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
- [x] T010 [P] sed README.md
- [x] T011 [P] sed AGENTS.md (CLAUDE.md auto via symlink)
- [x] T013 [P] sed .opencode/skills/README.md
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
- [x] T020 rg "sk-ai-council" on 4 files = 0
- [x] T021 validate.sh --strict 005 exit 0
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria
All tasks [x]; rg = 0; strict validate PASS
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References
Spec/Plan/Parent linked
<!-- /ANCHOR:cross-refs -->
