---
title: "Tasks: sk-design shared corpus-context conformance"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "sk-design shared corpus-context conformance"
  - "tasks"
importance_tier: "normal"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-design/014-template-conformance/006-shared/006-corpus-context"
    last_updated_at: "2026-07-27T10:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Author Level 2 tasks for template-conformance leaf"
    next_safe_action: "Execute T001 to begin the audit"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/shared/corpus-context/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-author-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Tasks: sk-design shared corpus-context conformance

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
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Enumerate all files under .opencode/skills/sk-design/shared/corpus-context/
- [ ] T002 Read .opencode/skills/sk-doc/create-skill/references/shared/overview.md directory rules + package_skill.py file-type gates (no authored corpus-context/ template)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 Audit .opencode/skills/sk-design/shared/corpus-context/README.md against .opencode/skills/sk-doc/create-skill/references/shared/overview.md directory rules + package_skill.py file-type gates (no authored corpus-context/ template)
- [ ] T004 Audit .opencode/skills/sk-design/shared/corpus-context/validate-context-plan.mjs against .opencode/skills/sk-doc/create-skill/references/shared/overview.md directory rules + package_skill.py file-type gates (no authored corpus-context/ template)
- [ ] T005 Audit .opencode/skills/sk-design/shared/corpus-context/corpus-runtime.mjs against .opencode/skills/sk-doc/create-skill/references/shared/overview.md directory rules + package_skill.py file-type gates (no authored corpus-context/ template)
- [ ] T006 Audit .opencode/skills/sk-design/shared/corpus-context/corpus-context-plan.mjs against .opencode/skills/sk-doc/create-skill/references/shared/overview.md directory rules + package_skill.py file-type gates (no authored corpus-context/ template)
- [ ] T007 Audit .opencode/skills/sk-design/shared/corpus-context/source-attestation.mjs against .opencode/skills/sk-doc/create-skill/references/shared/overview.md directory rules + package_skill.py file-type gates (no authored corpus-context/ template)
- [ ] T008 Audit .opencode/skills/sk-design/shared/corpus-context/tests/README.md against .opencode/skills/sk-doc/create-skill/references/shared/overview.md directory rules + package_skill.py file-type gates (no authored corpus-context/ template)
- [ ] T009 Audit .opencode/skills/sk-design/shared/corpus-context/tests/validate-context-plan.test.mjs against .opencode/skills/sk-doc/create-skill/references/shared/overview.md directory rules + package_skill.py file-type gates (no authored corpus-context/ template)
- [ ] T010 Audit .opencode/skills/sk-design/shared/corpus-context/tests/fixtures.mjs against .opencode/skills/sk-doc/create-skill/references/shared/overview.md directory rules + package_skill.py file-type gates (no authored corpus-context/ template)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T011 Re-read all touched files end-to-end
- [ ] T012 Run validate.sh --strict for this leaf
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
