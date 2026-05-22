---
title: "Implementation Plan: 116/004 — Validator v2 Enforcement"
description: "Plan for warning/advisory validation and strict v2 review-depth checks."
trigger_phrases:
  - "116 validator v2 plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/116-deep-review-complexity/004-validator-v2-enforcement"
    last_updated_at: "2026-05-22T00:00:00Z"
    last_updated_by: "gpt-5.5"
    recent_action: "Scaffolded phase 004 plan."
    next_safe_action: "Implement warning surface, then v2 checks."
    blockers: []
    key_files: ["spec.md", "tasks.md"]
    session_dedup:
      fingerprint: "sha256:1160041000000000000000000000000000000000000000000000000000000000"
      session_id: "116-004-plan"
      parent_session_id: "116-004-validator-v2-enforcement"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Implementation Plan: 116/004 — Validator v2 Enforcement

---

<!-- ANCHOR:summary -->
## 1. SUMMARY
Add typed warnings first, then strict checks for explicit v2 standard/complex records.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
- [ ] Phase 002 fixtures exist.
- [ ] Phase 003 schema contract exists.
- [ ] Targeted validator tests pass.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
Version-gated enforcement: legacy reads stay non-blocking, explicit v2 records must satisfy semantic search-proof checks.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
- [ ] Add warning/advisory result support.
- [ ] Add v2 shape checks.
- [ ] Add ledger semantics checks.
- [ ] Add state/delta consistency checks.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
Run targeted post-dispatch validator vitest coverage and strict spec validation.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status |
|------------|------|--------|
| Phase 003 schema contract | Spec contract | Planned |
| Phase 002 validator fixtures | Test evidence | Planned |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 6. ROLLBACK PLAN
Revert validator and test changes from this phase only.
<!-- /ANCHOR:rollback -->
