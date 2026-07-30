---
title: "Task Breakdown: Evidence Integrity and Completion-Claim Repair"
description: "Tasks for evidence integrity and completion-claim repair."
trigger_phrases:
  - "evidence integrity task breakdown"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/033-json-optimization-implementation/015-evidence-integrity-repair"
    last_updated_at: "2026-07-30T10:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored phase spec"
    next_safe_action: "Begin execution per plan.md once upstream dependencies clear"
    blockers: []
    key_files:
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "033-json-optimization-implementation/015-evidence-integrity-repair"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Task Breakdown: Evidence Integrity and Completion-Claim Repair

---

<!-- ANCHOR:notation -->
## Task Notation

`[ ]` pending, `[x]` complete with evidence; `T-nn` execution order.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T-01 Run the validator per folder and group its errors by root cause
- [ ] T-02 Identify which error groups belong here and which share the metadata phase's generator cause
- [ ] T-03 Scan the rollout checklist for repeated evidence text and record how many items share each blob
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T-04 Rewrite each checklist item so its evidence names the specific artifact section supporting that item
- [ ] T-05 Re-open the three items covering top-1 delta, top-3 across slices, and absence of unexplained regression
- [ ] T-06 Restate those three against the upstream measured figures, recording an accepted delta explicitly if the regression was accepted rather than fixed
- [ ] T-07 Reconcile the command-metadata phase so status, delivery, verification and continuity agree
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T-08 Confirm no two checklist items share identical evidence text
- [ ] T-09 Re-run the validator and confirm the assigned groups are resolved or explicitly deferred
- [ ] T-10 Either confirm the completion gate passes, or withdraw the completion claim
- [ ] T-11 Sweep every remaining completion marker in the packet for evidence a reader can independently check
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

No two checklist items share evidence text; the three regression items are re-opened and restated against measured figures; the command-metadata phase states one truth; validation errors are grouped by cause and each group is fixed, assigned or deferred with reasons; and the completion gate either passes or the completion claim is withdrawn.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- `spec.md` — requirements and acceptance criteria
- `plan.md` — architecture, sequencing and rollback
- `../spec.md` — parent program
<!-- /ANCHOR:cross-refs -->
