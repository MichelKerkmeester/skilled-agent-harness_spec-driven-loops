---
title: "Verification Checklist: bounded STUDY exemplars for design-md-generator"
description: "Level 2 verification checklist for the reversible pre-WRITE STUDY phase. All items pending — scaffold; implementation not started. Mark [x] with evidence only once each control is built and verified."
trigger_phrases:
  - "md generator study checklist"
  - "STUDY exemplar verification"
  - "source-leak gate checklist"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-design/011-sk-design-styles-utilization/006-md-generator-study-exemplars"
    last_updated_at: "2026-07-18T13:40:00Z"
    last_updated_by: "claude"
    recent_action: "Authored the L2 STUDY-exemplars scaffold"
    next_safe_action: "Implement STUDY module after phases 004 and 005 land"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-mdgen-study-011-006"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: bounded STUDY exemplars for design-md-generator

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Requirements documented in spec.md
  - **Evidence**:
- [ ] CHK-002 [P0] Technical approach defined in plan.md
  - **Evidence**:
- [ ] CHK-003 [P0] Dependencies 004 (retrieval) and 005 (schema contract) available
  - **Evidence**:
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] STUDY is a separate, reversible pre-WRITE phase (STUDY-off path unchanged)
  - **Evidence**:
- [ ] CHK-011 [P0] Code passes lint/format and type checks
  - **Evidence**:
- [ ] CHK-012 [P1] STUDY failures fall back to the no-STUDY path without corrupting output
  - **Evidence**:
- [ ] CHK-013 [P1] Code follows existing design-md-generator patterns
  - **Evidence**:
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] De-literalized transformer emits no verbatim source values or phrases
  - **Evidence**:
- [ ] CHK-021 [P0] Two-signal leak gate (exact-value + normalized-span) discards and retries without STUDY on every seeded leak
  - **Evidence**:
- [ ] CHK-022 [P1] Reversibility proven — STUDY-disabled output byte-identical to pre-STUDY WRITE path
  - **Evidence**:
- [ ] CHK-023 [P1] Adversarial + counterfactual fixtures pass
  - **Evidence**:
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] The source-leak finding class is fixed as `cross-consumer` (both prompt-injection and authored-draft boundaries), not `instance-only`.
  - **Evidence**:
- [ ] CHK-FIX-002 [P0] Consumer inventory completed for `buildWritePrompt`, `buildPlan`, and `runGuided` before wiring STUDY.
  - **Evidence**:
- [ ] CHK-FIX-003 [P0] Leak gate has adversarial table tests for exact-value, normalized-span, joined-input, and shared-vocabulary no-op cases.
  - **Evidence**:
- [ ] CHK-FIX-004 [P1] Matrix axes (signal type x STUDY on/off x retry outcome) and row count listed before completion is claimed.
  - **Evidence**:
- [ ] CHK-FIX-005 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range.
  - **Evidence**:
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] Provenance / rights / injection envelope carried with every STUDY bundle
  - **Evidence**:
- [ ] CHK-031 [P0] No raw few-shot shortcut path ships exemplars without transformation + provenance + leakage controls
  - **Evidence**:
- [ ] CHK-032 [P1] Generation-guarded hydration prevents stale-bundle injection
  - **Evidence**:
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized
  - **Evidence**:
- [ ] CHK-041 [P1] STUDY on/off switch and no-STUDY fallback documented
  - **Evidence**:
- [ ] CHK-042 [P2] Proposed file-change list reconciled with actual edits at build time
  - **Evidence**:
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in scratch/ only
  - **Evidence**:
- [ ] CHK-051 [P1] scratch/ cleaned before completion
  - **Evidence**:
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 0/12 |
| P1 Items | 10 | 0/10 |
| P2 Items | 1 | 0/1 |

**Verification Date**: pending
**Verified By**: pending

<!-- /ANCHOR:summary -->
