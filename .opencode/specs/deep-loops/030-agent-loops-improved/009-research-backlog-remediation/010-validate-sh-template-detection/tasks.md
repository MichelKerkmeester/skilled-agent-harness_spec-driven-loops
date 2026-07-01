---
title: "Tasks: Validate.sh Template-Scaffold Detection"
description: "Task list for the SCAFFOLD_NEVER_TOUCHED validate.sh rule."
trigger_phrases:
  - "validate.sh template detection tasks"
importance_tier: "medium"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/030-agent-loops-improved/009-research-backlog-remediation/010-validate-sh-template-detection"
    last_updated_at: "2026-07-01T08:30:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Authored tasks"
    next_safe_action: "Dispatch implementation to MiMo v2.5 ultraspeed via cli-opencode"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sonnet-009-remediation"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Validate.sh Template-Scaffold Detection

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

`[x]` complete, `[ ]` pending.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Read the existing `PLACEHOLDER_FILLED` rule implementation as the pattern reference
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T002 Implement `SCAFFOLD_NEVER_TOUCHED`: check title `[template:`, `packet_pointer: "scaffold/`, `last_updated_by: "template-author"` against a Complete-status claim
- [ ] T003 Wire the new rule into the severity table and summary output alongside existing rules
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T004 Test fixture: scaffold-signature + Complete claim → new rule fails
- [ ] T005 Test fixture: genuinely complete folder → new rule passes
- [ ] T006 Confirm existing rules' behavior is unchanged (no regressions in validate.sh's own test coverage, if any)
- [ ] T007 Run validate.sh against `008-loop-systems-remediation` (post child-007 fix) — confirm it now passes the new rule
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

All 7 tasks complete; new rule catches the exact drift class from F-010; no regressions to existing rules.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Spec: `./spec.md` · Plan: `./plan.md` · Implementation summary: `./implementation-summary.md`
- Source finding: `../../research/research_archive/20260701T071133Z-gen1/research.md` §4.2 (F-010), §5#18
<!-- /ANCHOR:cross-refs -->
