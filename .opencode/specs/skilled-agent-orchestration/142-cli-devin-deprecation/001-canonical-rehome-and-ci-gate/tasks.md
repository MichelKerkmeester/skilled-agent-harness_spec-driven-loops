---
title: "Tasks: Phase 1: canonical-rehome-and-ci-gate"
description: "Task list for cli-devin deprecation phase 1"
trigger_phrases:
  - "phase 1 tasks"
  - "canonical-rehome-and-ci-gate tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/142-cli-devin-deprecation/001-canonical-rehome-and-ci-gate"
    last_updated_at: "2026-06-08T17:38:17.105Z"
    last_updated_by: "deprecation-host"
    recent_action: "Phase 1 tasks completed"
    next_safe_action: "Proceed to phase 2"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "ctx-142-cli-devin-20260608151217"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 1: canonical-rehome-and-ci-gate

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read the Context Report §2 cluster + the target files before editing (READ-first, scope-locked)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 context-budget.md + per-model-budgets.json re-homed to sk-prompt-small-model (swe-1.6 dropped)
- [x] T003 output-verification.md + confidence-scoring-rubric.md + quota-fallback.md re-homed + de-cli-devin'd
- [x] T004 cli-opencode sentinel + prompt_templates + SKILL.md + pattern-index repointed
- [x] T005 check-prompt-quality-card-sync.sh cli_cards + cli_skills cleaned
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 Verify: check-prompt-quality-card-sync.sh exit 0 (GUARD PASS); jq empty per-model-budgets.json; grep 0 dead cli-devin canonical links
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] Verification passed (see implementation-summary.md)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Implementation**: See `implementation-summary.md`
- **Authoritative edit list**: `../context/context-report.md` §2
<!-- /ANCHOR:cross-refs -->
