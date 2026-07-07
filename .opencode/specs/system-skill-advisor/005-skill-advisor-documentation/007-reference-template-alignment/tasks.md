---
title: "Tasks: System Skill Advisor Reference Template Alignment"
description: "Task list for canonicalizing system-skill-advisor references, updating smart-router navigation, and validating documentation."
trigger_phrases:
  - "system skill advisor reference alignment tasks"
importance_tier: "important"
contextType: "documentation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/005-skill-advisor-documentation/007-reference-template-alignment"
    last_updated_at: "2026-05-24T07:27:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Completed reference template alignment and validation"
    next_safe_action: "Packet complete; use this folder as validation evidence for the reference cleanup"
    blockers: []
    key_files:
      - ".opencode/skills/system-skill-advisor/SKILL.md"
      - ".opencode/skills/system-skill-advisor/README.md"
      - ".opencode/skills/system-skill-advisor/references/"
    session_dedup:
      fingerprint: "sha256:1111111111111111111111111111111111111111111111111111111111111111"
      session_id: "system-skill-advisor-reference-template-alignment-2026-05-24"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Use compatibility stubs."
      - "Create a new spec packet."
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: System Skill Advisor Reference Template Alignment

<!-- SPECKIT_LEVEL: 3 -->

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

- [x] T001 Create Level 3 cleanup packet.
- [x] T002 Inspect current advisor reference inventory.
- [x] T003 [P] Inspect current sk-doc reference template rules.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Move canonical references into focused subfolders.
- [x] T005 Add compatibility stubs at old root paths.
- [x] T006 Align canonical reference bodies to the sk-doc template pattern.
- [x] T007 Update `system-skill-advisor/SKILL.md` smart router and resource map.
- [x] T008 Update active README/install/database/feature/playbook links.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Run structure extraction on changed skill, README, references and stubs.
- [x] T010 Run sk-doc validators for skill, README, references and stubs.
- [x] T011 Run quick validation for `system-skill-advisor`.
- [x] T012 Run rg stale-path and template-shape checks.
- [x] T013 Run strict packet validation.
- [x] T014 Reconcile completion metadata and final evidence.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Documentation validation passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Verification Checklist**: See `checklist.md`
<!-- /ANCHOR:cross-refs -->
