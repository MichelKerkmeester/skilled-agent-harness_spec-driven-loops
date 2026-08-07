---
title: "Tasks: sk-design hub identity-and-registry conformance"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "sk-design hub identity-and-registry conformance"
  - "tasks"
importance_tier: "normal"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-design/014-template-conformance/007-hub-root/001-identity-and-registry"
    last_updated_at: "2026-07-27T10:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Author Level 2 tasks for template-conformance leaf"
    next_safe_action: "Execute T001 to begin the audit"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/ (8 hub-root identity/registry files)"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-author-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Tasks: sk-design hub identity-and-registry conformance

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

- [ ] T001 Enumerate all files under .opencode/skills/sk-design/ (8 hub-root identity/registry files)
- [ ] T002 Read .opencode/skills/sk-doc/create-skill/assets/parent-skill/parent-skill-hub-template.md (SKILL.md) + skill-readme-template.md (README.md) + parent-skill-description-template.json, parent-skill-graph-metadata-template.json, parent-skill-hub-router-template.json, parent-skill-registry-template.json (JSON companions); doctrine: .opencode/skills/sk-doc/create-skill/references/parent-skill/parent-skills-nested-packets.md
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 Audit .opencode/skills/sk-design/SKILL.md against .opencode/skills/sk-doc/create-skill/assets/parent-skill/parent-skill-hub-template.md (SKILL.md) + skill-readme-template.md (README.md) + parent-skill-description-template.json, parent-skill-graph-metadata-template.json, parent-skill-hub-router-template.json, parent-skill-registry-template.json (JSON companions); doctrine: .opencode/skills/sk-doc/create-skill/references/parent-skill/parent-skills-nested-packets.md
- [ ] T004 Audit .opencode/skills/sk-design/README.md against .opencode/skills/sk-doc/create-skill/assets/parent-skill/parent-skill-hub-template.md (SKILL.md) + skill-readme-template.md (README.md) + parent-skill-description-template.json, parent-skill-graph-metadata-template.json, parent-skill-hub-router-template.json, parent-skill-registry-template.json (JSON companions); doctrine: .opencode/skills/sk-doc/create-skill/references/parent-skill/parent-skills-nested-packets.md
- [ ] T005 Audit .opencode/skills/sk-design/description.json against .opencode/skills/sk-doc/create-skill/assets/parent-skill/parent-skill-hub-template.md (SKILL.md) + skill-readme-template.md (README.md) + parent-skill-description-template.json, parent-skill-graph-metadata-template.json, parent-skill-hub-router-template.json, parent-skill-registry-template.json (JSON companions); doctrine: .opencode/skills/sk-doc/create-skill/references/parent-skill/parent-skills-nested-packets.md
- [ ] T006 Audit .opencode/skills/sk-design/graph-metadata.json against .opencode/skills/sk-doc/create-skill/assets/parent-skill/parent-skill-hub-template.md (SKILL.md) + skill-readme-template.md (README.md) + parent-skill-description-template.json, parent-skill-graph-metadata-template.json, parent-skill-hub-router-template.json, parent-skill-registry-template.json (JSON companions); doctrine: .opencode/skills/sk-doc/create-skill/references/parent-skill/parent-skills-nested-packets.md
- [ ] T007 Audit .opencode/skills/sk-design/mode-registry.json against .opencode/skills/sk-doc/create-skill/assets/parent-skill/parent-skill-hub-template.md (SKILL.md) + skill-readme-template.md (README.md) + parent-skill-description-template.json, parent-skill-graph-metadata-template.json, parent-skill-hub-router-template.json, parent-skill-registry-template.json (JSON companions); doctrine: .opencode/skills/sk-doc/create-skill/references/parent-skill/parent-skills-nested-packets.md
- [ ] T008 Audit .opencode/skills/sk-design/hub-router.json against .opencode/skills/sk-doc/create-skill/assets/parent-skill/parent-skill-hub-template.md (SKILL.md) + skill-readme-template.md (README.md) + parent-skill-description-template.json, parent-skill-graph-metadata-template.json, parent-skill-hub-router-template.json, parent-skill-registry-template.json (JSON companions); doctrine: .opencode/skills/sk-doc/create-skill/references/parent-skill/parent-skills-nested-packets.md
- [ ] T009 Audit .opencode/skills/sk-design/leaf-manifest.json against .opencode/skills/sk-doc/create-skill/assets/parent-skill/parent-skill-hub-template.md (SKILL.md) + skill-readme-template.md (README.md) + parent-skill-description-template.json, parent-skill-graph-metadata-template.json, parent-skill-hub-router-template.json, parent-skill-registry-template.json (JSON companions); doctrine: .opencode/skills/sk-doc/create-skill/references/parent-skill/parent-skills-nested-packets.md
- [ ] T010 Audit .opencode/skills/sk-design/command-metadata.json against .opencode/skills/sk-doc/create-skill/assets/parent-skill/parent-skill-hub-template.md (SKILL.md) + skill-readme-template.md (README.md) + parent-skill-description-template.json, parent-skill-graph-metadata-template.json, parent-skill-hub-router-template.json, parent-skill-registry-template.json (JSON companions); doctrine: .opencode/skills/sk-doc/create-skill/references/parent-skill/parent-skills-nested-packets.md
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
