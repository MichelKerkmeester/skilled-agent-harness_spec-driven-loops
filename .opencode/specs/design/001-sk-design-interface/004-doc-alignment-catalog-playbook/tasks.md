---
title: "Tasks: sk-design-interface doc alignment, catalog, playbook"
description: "Task breakdown for the sk-doc alignment of sk-design-interface: feature catalog, manual testing playbook, reference alignment, assets README, and graph-metadata reconciliation."
trigger_phrases:
  - "sk-design-interface doc alignment tasks"
  - "feature catalog and playbook tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "design/001-sk-design-interface/004-doc-alignment-catalog-playbook"
    last_updated_at: "2026-06-13T19:20:00Z"
    last_updated_by: "claude-opus"
    recent_action: "All doc-alignment tasks complete"
    next_safe_action: "Operator commits the skill doc changes"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design-interface/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-148-004-doc-alignment-catalog-playbook"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: sk-design-interface doc alignment, catalog, playbook

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

- `[x]` complete, `[ ]` pending, `[P]` parallelizable.
- Authoring done by fresh markdown agents via the /create workflows; shared-file reconciliation by the orchestrator.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] Identify `/create:feature-catalog` and `/create:testing-playbook` + sk-doc templates
- [x] Review exemplars (deep-review feature catalog, sk-code-review playbook)
- [x] Scaffold the 004 spec folder as the Gate-3 home and register it in the parent
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] [P] Agent: author `feature_catalog/` (index + 10 features in 5 sections)
- [x] [P] Agent: author `manual_testing_playbook/` (index + 7 scenarios in 6 sections)
- [x] [P] Agent: align the three references to the sk-doc reference template (substance preserved)
- [x] Orchestrator: add FC + PB pointers to SKILL.md
- [x] Orchestrator: graph-metadata key_files + summary + the nine-CSV count fix
- [x] Orchestrator: add `assets/data/README.md`; restore the license/notice files deleted from the worktree
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] `validate_document.py` on the new FC, PB, and reference docs (agent-run)
- [x] `package_skill.py` reports the skill valid
- [x] `validate.sh --strict` on the 004 packet
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] Feature catalog + manual testing playbook present and sk-doc valid
- [x] All references aligned; assets documented; graph-metadata accurate
- [x] License/notice files present on disk; `design_principles.md` substance preserved
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Skill: `.opencode/skills/sk-design-interface/`
- Feature catalog: `feature_catalog/feature_catalog.md`
- Playbook: `manual_testing_playbook/manual_testing_playbook.md`
- Parent: `../spec.md` (phase map)
<!-- /ANCHOR:cross-refs -->
