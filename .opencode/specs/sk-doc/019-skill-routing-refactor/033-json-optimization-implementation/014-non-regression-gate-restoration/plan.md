---
title: "Implementation Plan: Restore and Wire the Non-Regression Gate"
description: "Repair the scorer-eval baseline ratchet so it runs green against a decided baseline, resolve the review bucket falling below its own declared minimum, wire the ratchet into the routing workflow, and prove by deliberate mutation that the wir"
trigger_phrases:
  - "gate restoration implementation plan"
importance_tier: "normal"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/033-json-optimization-implementation/014-non-regression-gate-restoration"
    last_updated_at: "2026-07-30T10:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored phase spec"
    next_safe_action: "Begin execution per plan.md once upstream dependencies clear"
    blockers: []
    key_files:
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "033-json-optimization-implementation/014-non-regression-gate-restoration"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Implementation Plan: Restore and Wire the Non-Regression Gate

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Repair the scorer-eval baseline ratchet so it runs green against a decided baseline, resolve the review bucket falling below its own declared minimum, wire the ratchet into the routing workflow, and prove by deliberate mutation that the wired gate fails when a metric moves.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

The ratchet passes 7 of 7; the corpus hash pin matches live with prior hashes recorded; the review bucket meets its minimum or the minimum changes with written rationale; a real CI run shows the job failing when the ratchet fails; a deliberate mutation is observed to trip the gate; and both declared floors keep their current values.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

The ratchet is the only test that pins holdout accuracy exactly and enforces the release floors, and it is currently both failing and unreferenced by any workflow. The golden-prompt suite that the program did wire checks a weaker property and passes straight through the regression. Restoring the ratchet and adding it to the existing routing workflow closes the gap without changing the scorer.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup records the ratchet's current failure modes and confirms it appears in no workflow. Implementation sets its baseline from the upstream disposition, resolves the corpus hash pin and the bucket minimum, and adds the suite to the workflow. Verification runs it in CI and proves it catches a deliberately introduced movement.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The ratchet is itself the test under repair, so verification is adversarial: introduce a routing change known to move a metric, confirm the gate fails, then revert. A gate never observed failing has not been shown to work.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

Phase 013 supplies the baseline values. Wiring a gate to a contested number would freeze the dispute into CI, so this phase cannot close before that disposition exists.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

The workflow change is one line and revertible. The ratchet baseline change is a single file whose prior contents are recorded in the same commit, so the previous pin can be restored exactly.
<!-- /ANCHOR:rollback -->
