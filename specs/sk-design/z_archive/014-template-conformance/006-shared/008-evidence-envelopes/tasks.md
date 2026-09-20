---
title: "Tasks: sk-design shared evidence-envelopes conformance"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "sk-design shared evidence-envelopes conformance"
  - "tasks"
importance_tier: "normal"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-design/014-template-conformance/006-shared/008-evidence-envelopes"
    last_updated_at: "2026-07-27T10:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Author Level 2 tasks for template-conformance leaf"
    next_safe_action: "Execute T001 to begin the audit"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/shared/evidence-envelopes/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-author-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Tasks: sk-design shared evidence-envelopes conformance

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

- [ ] T001 Enumerate all files under .opencode/skills/sk-design/shared/evidence-envelopes/
- [ ] T002 Read .opencode/skills/sk-doc/create-skill/references/shared/overview.md directory rules + package_skill.py file-type gates (no authored evidence-envelopes/ template; bespoke shared subdir)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 Audit .opencode/skills/sk-design/shared/evidence-envelopes/motion-character-handoff.md against .opencode/skills/sk-doc/create-skill/references/shared/overview.md directory rules + package_skill.py file-type gates (no authored evidence-envelopes/ template; bespoke shared subdir)
- [ ] T004 Audit .opencode/skills/sk-design/shared/evidence-envelopes/owned-asset-manifest.md against .opencode/skills/sk-doc/create-skill/references/shared/overview.md directory rules + package_skill.py file-type gates (no authored evidence-envelopes/ template; bespoke shared subdir)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T005 Re-read all touched files end-to-end
- [ ] T006 Run validate.sh --strict for this leaf
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
