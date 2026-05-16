---
title: "Tasks: 008-tier-d-execution"
description: "T001-T012 covering F4 hooks migration, F6 banners, F37 cross-reference table."
trigger_phrases:
  - "008 tier d tasks"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/005-docs/004-docs-quality-refactor/008-tier-d-execution"
    last_updated_at: "2026-05-16T00:00:00Z"
    last_updated_by: "claude-opus-4-7-1m"
    recent_action: "Authored tasks"
    next_safe_action: "Execute T003"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "008-tasks"
      parent_session_id: null
    completion_pct: 15
    open_questions: []
    answered_questions: []
---
# Tasks: 008-tier-d-execution

<!-- SPECKIT_LEVEL: 1 -->
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
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Scaffold 008 packet (6 files)
- [x] T002 Pre-flight verify NEW hook paths + OLD READMEs
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 F4: update `.devin/hooks.v1.json` UserPromptSubmit to system-skill-advisor NEW path
- [ ] T004 F4: update `.devin/hooks.v1.json` SessionStart to system-code-graph NEW path
- [ ] T005 F4: verify JSON parses
- [ ] T006 F6: add deprecation banner to 3 existing OLD READMEs (claude, codex, gemini)
- [ ] T007 F6: create devin/README.md at OLD location with deprecation banner
- [ ] T008 F37: add cross-reference table section to playbook root
- [ ] T009 Update deferred-decisions.md to mark F4/F6/F37 status as Done
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T010 validate.sh --strict on 008 packet
- [ ] T011 Refresh parent graph-metadata + spec.md PHASE MAP for 008
- [ ] T012 Fill 008 implementation-summary
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] T010 green
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Source-of-truth Tier D catalog**: `references/deferred-decisions.md`
<!-- /ANCHOR:cross-refs -->
