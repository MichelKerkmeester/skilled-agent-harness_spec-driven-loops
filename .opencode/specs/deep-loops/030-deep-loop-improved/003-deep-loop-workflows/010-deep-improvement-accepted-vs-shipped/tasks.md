---
title: "Tasks: Deep-Improvement Candidate Accepted vs Canonical Shipped Split"
description: "Completed task ledger for two-phase promotion, branch preservation, and rollback work."
trigger_phrases:
  - "accepted vs shipped deep improvement"
  - "promotion_blocked_branch_preserved"
  - "rollback candidate deep improvement"
  - "two-step promotion gate"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/030-deep-loop-improved/003-deep-loop-workflows/010-deep-improvement-accepted-vs-shipped"
    last_updated_at: "2026-07-01T22:20:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Replaced scaffold content with spec-grounded complete info"
    next_safe_action: "Regenerate metadata and run recursive strict validation"
    blockers: []
    key_files:
      - ".opencode/skills/deep-loop-workflows/deep-improvement/scripts/shared/promote-candidate.cjs"
      - ".opencode/skills/deep-loop-workflows/deep-improvement/references/shared/promotion_gate_contract.md"
      - ".opencode/skills/deep-loop-workflows/deep-improvement/references/shared/promotion_rules.md"
      - ".opencode/skills/deep-loop-workflows/deep-improvement/scripts/shared/rollback-candidate.cjs"
      - ".opencode/skills/deep-loop-workflows/deep-improvement/assets/improvement_config.json"
    session_dedup:
      fingerprint: "sha256:1111111111111111111111111111111111111111111111111111111111111111"
      session_id: "scaffold-content-remediation-004"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Deep-Improvement Candidate Accepted vs Canonical Shipped Split

<!-- SPECKIT_LEVEL: 1 -->

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

- [x] T001 Read the completed spec and capture promotion split requirements (`spec.md`).
- [x] T002 Confirm leaf 009 score-delta gate dependency (`spec.md`).
- [x] T003 [P] Identify promotion script, rollback script, docs, and config surfaces.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Split `promote-candidate.cjs` into accept and ship phases.
- [x] T005 Emit `promotion_blocked_branch_preserved` on gate failures.
- [x] T006 Preserve the candidate branch when either phase fails.
- [x] T007 Create `rollback-candidate.cjs` for canonical tree restoration.
- [x] T008 Update promotion gate contract docs (`promotion_gate_contract.md`).
- [x] T009 Update promotion rules docs (`promotion_rules.md`).
- [x] T010 Add branch preservation policy to config (`improvement_config.json`).
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 Verify accept and ship phases are separately callable.
- [x] T012 Verify ship-phase failure emits preservation event and keeps branch.
- [x] T013 Verify rollback restores canonical tree while keeping preserved branch accessible.
- [x] T014 Update plan and task docs to reflect the completed promotion split (`plan.md`, `tasks.md`).
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`.
- [x] No `[B]` blocked tasks remaining.
- [x] Manual verification passed according to the completed specification.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
