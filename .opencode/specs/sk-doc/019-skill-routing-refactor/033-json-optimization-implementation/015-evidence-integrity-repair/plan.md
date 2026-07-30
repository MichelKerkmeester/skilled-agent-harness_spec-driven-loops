---
title: "Implementation Plan: Evidence Integrity and Completion-Claim Repair"
description: "Rewrite the rollout checklist so each item carries its own evidence, re-open and truthfully restate the three items that certify the regression as absent, reconcile the command-metadata phase's four contradictory status fields, and run the "
trigger_phrases:
  - "evidence integrity implementation plan"
importance_tier: "normal"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/033-json-optimization-implementation/015-evidence-integrity-repair"
    last_updated_at: "2026-07-30T10:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored phase spec"
    next_safe_action: "Begin execution per plan.md once upstream dependencies clear"
    blockers: []
    key_files:
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "033-json-optimization-implementation/015-evidence-integrity-repair"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Implementation Plan: Evidence Integrity and Completion-Claim Repair

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Rewrite the rollout checklist so each item carries its own evidence, re-open and truthfully restate the three items that certify the regression as absent, reconcile the command-metadata phase's four contradictory status fields, and run the strict validation the program claimed was externally blocked.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

No two checklist items share evidence text; the three regression items are re-opened and restated against measured figures; the command-metadata phase states one truth; validation errors are grouped by cause and each group is fixed, assigned or deferred with reasons; and the completion gate either passes or the completion claim is withdrawn.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

The checklist is a control, not documentation. Twenty-one completed items sharing one evidence blob is the mechanism that let a regression pass review, and three of those items assert precisely the property the upstream diagnosis disproves. The command-metadata phase and the strict-validation excuse are the same defect in smaller form: a claim standing where its evidence should be.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup groups the strict-validation failures by root cause and identifies which belong to this phase versus the metadata phase. Implementation rewrites the checklist evidence per item, re-opens and restates the three false items, and reconciles the contradictory fields. Verification re-runs the validator and sweeps for any remaining completion marker whose evidence a reader cannot check.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Duplicate evidence text is mechanically detectable, so the primary check is a scan for repeated blobs rather than a prose judgement. The validator supplies the second check, and the final sweep is manual against every remaining completion marker.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

Phase 013 supplies the measured figures without which the three regression items cannot be restated truthfully. Phase 016 owns the validation failures that share its generator root cause.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

All changes are documentation edits in one packet, revertible as a single commit. Re-opening checklist items is itself the conservative direction; no state is destroyed.
<!-- /ANCHOR:rollback -->
