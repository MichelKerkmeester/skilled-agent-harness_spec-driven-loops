---
title: "Tasks: doc realignment to the parity keystone"
description: "Task breakdown for realigning the skill docs to the post-007 parity reality. All tasks complete."
trigger_phrases:
  - "doc realignment tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/143-sk-design-interface/008-doc-realignment"
    last_updated_at: "2026-06-14T10:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "All realignment tasks complete"
    next_safe_action: "Validate and commit"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-148-008-doc-realignment"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: doc realignment to the parity keystone

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

- `[x]` complete, `[ ]` pending, `[P]` parallelizable.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] Inventory affected doc surfaces in both skills
- [x] Scaffold 008 + register in the 148 parent
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] [P] Opus agent A: feature_catalog parity section (3 entries) + integration-boundary update
- [x] [P] Opus agent B: playbook parity scenarios (ID-008, ID-009) + README parity paragraph
- [x] [P] Opus agent C: mcp-magicpath README parity subsection + scripts README helper docs
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] Both skills `package_skill.py` valid; counts reconciled (13 features, 9 scenarios)
- [x] No duplicated protocol content (docs point to claude_design_parity.md)
- [x] `validate.sh --strict` on the packet
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] feature_catalog, playbook, READMEs reflect the post-007 reality
- [x] sk-doc valid; both skills valid
- [x] Protocol single-sourced; no bloat
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- New reality: `.opencode/skills/sk-design-interface/references/claude_design_parity.md`
- Source build: `../007-claude-design-parity-build/`
- Skills: `.opencode/skills/sk-design-interface/`, `.opencode/skills/mcp-magicpath/`
<!-- /ANCHOR:cross-refs -->
