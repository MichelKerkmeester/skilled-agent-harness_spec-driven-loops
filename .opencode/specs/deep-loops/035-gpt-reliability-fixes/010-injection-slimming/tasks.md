---
title: "Tasks: Root-Policy Injection Slimming (P2)"
description: "Task stub for phase 010 of packet 035; closes F-027, F-029."
trigger_phrases:
  - "tasks"
  - "035 010 tasks"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/035-gpt-reliability-fixes/010-injection-slimming"
    last_updated_at: "2026-07-03T13:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Task stub scaffolded"
    next_safe_action: "Expand tasks when this phase starts"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "035-010-tasks"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Root-Policy Injection Slimming (P2)

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[B]` | Blocked |

**Task Format**: `T### Description`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Apply the requirement edits from `spec.md` §4, verifying quoted current-text against the live files first (closes F-027, F-029).
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T002 Re-run the acceptance cells (Prompt salience (indirect; supports the Gate-3 + presentation cells)) on gpt-fast-med + gpt-fast-high; confirm the baseline leg does not regress.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T003 Update docs, run `validate.sh --strict`, scoped commit + push.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] Requirement edits applied; acceptance cells moved to expected verdict; baseline green.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Parent**: `../spec.md`
- **Findings**: `../../034-gpt-reliability-research/research/findings-registry.md`
<!-- /ANCHOR:cross-refs -->
