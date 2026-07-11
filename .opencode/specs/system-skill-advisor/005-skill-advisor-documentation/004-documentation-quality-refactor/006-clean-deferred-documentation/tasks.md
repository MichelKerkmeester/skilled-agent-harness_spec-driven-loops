---
title: "Tasks: 006-clean-deferred-documentation"
description: "T001-T013 covering scaffold, Tier A edits, Tier B re-verify, Tier C Oxford sweep, validation, parent metadata refresh."
trigger_phrases:
  - "006 deferred cleanup tasks"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/005-skill-advisor-documentation/004-documentation-quality-refactor/006-clean-deferred-documentation"
    last_updated_at: "2026-05-16T00:00:00Z"
    last_updated_by: "claude-opus-4-7-1m"
    recent_action: "Authored tasks"
    next_safe_action: "Begin T003"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "006-tasks"
      parent_session_id: null
    completion_pct: 10
    open_questions: []
    answered_questions: []
---
# Tasks: 006-clean-deferred-documentation

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

- [x] T001 Scaffold 006 directory + 6 Level 1 files
- [x] T002 Strict-validate scaffold (expect 0 errors)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 [Tier A] F30: convert 3 plain-text refs in `references/skill-graph-extraction-plan.md` to markdown links (verify SKILL.md current line numbers first)
- [ ] T004 [Tier A] F33: add SOURCE FILES section to `manual_testing_playbook/native-mcp-tools/skill-graph-status.md`
- [ ] T005 [Tier A] F33: add SOURCE FILES section to `skill-graph-query.md`
- [ ] T006 [Tier A] F33: add SOURCE FILES section to `skill-graph-validate.md`
- [ ] T007 [Tier B] Re-verify F23 (compat/index.ts), F24 (plugin_bridges/mk-skill-advisor-bridge.mjs), F44 (scripts/fixtures/skill_advisor_regression_cases.jsonl) match INSTALL_GUIDE.md paths
- [ ] T008 [Tier B] Conditional INSTALL_GUIDE edit if any T007 path mismatches
- [ ] T009 [Tier C] Oxford comma sweep: `sed s/, and / and /g` + `s/, or / or /g` across all .md files excluding changelog/
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T010 Re-grep Oxford comma count (expect 0)
- [ ] T011 Spot-check 5 random files for grammar regressions after sweep
- [ ] T012 Refresh parent metadata: append 006 to children_ids[], advance last_active_child_id, add 006 row to PHASE DOCUMENTATION MAP
- [ ] T013 Strict-validate 006 + parent + all siblings (001 still WARN exempted)
- [ ] T014 Update implementation-summary.md with verification evidence
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] T010 + T013 green
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Source-of-truth deferred catalog**: 002/004/005 Known Limitations sections + 001 research.md §6 Provenance
<!-- /ANCHOR:cross-refs -->
