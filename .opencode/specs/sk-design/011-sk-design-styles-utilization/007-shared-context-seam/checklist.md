---
title: "Verification Checklist: shared corpus-context seam"
description: "Level-2 verification checklist for the shared corpus-context seam (CORPUS_CONTEXT_PLAN v1, common proof/handoff fields, five shared fixtures). All items unchecked — implementation not started."
trigger_phrases:
  - "shared context seam checklist"
  - "corpus context plan verification"
  - "sk-design shared seam checklist"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-design/011-sk-design-styles-utilization/007-shared-context-seam"
    last_updated_at: "2026-07-18T13:40:00Z"
    last_updated_by: "claude"
    recent_action: "Authored the shared-context-seam Level-2 planning scaffold"
    next_safe_action: "Build CORPUS_CONTEXT_PLAN v1 envelope and shared proof fields"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-context-seam-011-007"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: shared corpus-context seam

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
  - **Evidence**: pending — implementation not started
- [ ] CHK-002 [P0] Technical approach defined in plan.md
  - **Evidence**: pending — implementation not started
- [ ] CHK-003 [P1] Phase 004 retrieval output shape available to feed the intake/registry route
  - **Evidence**: pending — implementation not started


<!-- /ANCHOR:pre-impl -->
---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] `CORPUS_CONTEXT_PLAN v1` envelope carries 0 hydrated styles
  - **Evidence**: pending — implementation not started
- [ ] CHK-011 [P0] Hub stays routing-only; no mode-specific fields in the hub
  - **Evidence**: pending — implementation not started
- [ ] CHK-012 [P1] Seven common proof/handoff fields defined once and reused
  - **Evidence**: pending — implementation not started
- [ ] CHK-013 [P1] Package structure follows sk-design shared conventions
  - **Evidence**: pending — implementation not started


<!-- /ANCHOR:code-quality -->
---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] All acceptance criteria met (REQ-001..REQ-006)
  - **Evidence**: pending — implementation not started
- [ ] CHK-021 [P0] Five shared fixtures validate against the schema
  - **Evidence**: pending — implementation not started
- [ ] CHK-022 [P1] Negative results (no-fit, unavailable, generation-mismatch, unknown-rights, anchor:null) pass as successful evidence
  - **Evidence**: pending — implementation not started
- [ ] CHK-023 [P1] Authority-order guard blocks corpus evidence from selecting a mode or proving accessibility/performance
  - **Evidence**: pending — implementation not started


<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-024 [P0] `CORPUS_CONTEXT_PLAN v1`, common fields, and five fixtures all built and validated
  - **Evidence**: pending — implementation not started
- [ ] CHK-025 [P1] Hub intake/registry route emits the envelope once phase 004 retrieval lands
  - **Evidence**: pending — implementation not started


<!-- /ANCHOR:fix-completeness -->
---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets in the shared package
  - **Evidence**: pending — implementation not started
- [ ] CHK-031 [P1] Provenance/use-label and unknown-rights fixture enforce rights handling
  - **Evidence**: pending — implementation not started


<!-- /ANCHOR:security -->
---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized
  - **Evidence**: pending — implementation not started
- [ ] CHK-041 [P1] Schema and field definitions documented
  - **Evidence**: pending — implementation not started
- [ ] CHK-042 [P2] Parent phase-map updated with successor `../008-interface-audit-pilots/`
  - **Evidence**: pending — implementation not started


<!-- /ANCHOR:docs -->
---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Shared package kept OUT of the hub
  - **Evidence**: pending — implementation not started
- [ ] CHK-051 [P1] scratch/ cleaned before completion
  - **Evidence**: pending — implementation not started


<!-- /ANCHOR:file-org -->
---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | 0/8 |
| P1 Items | 10 | 0/10 |
| P2 Items | 1 | 0/1 |

**Verification Date**: pending
**Verified By**: pending — implementation not started

<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
