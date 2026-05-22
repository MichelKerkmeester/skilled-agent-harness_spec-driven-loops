---
title: "Implementation Plan: 116/003 — Review-Depth Schema and Prompt Contract"
description: "Plan for documenting and rendering the review-depth v2 contract."
trigger_phrases:
  - "116 review-depth schema plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/116-deep-review-complexity/003-review-depth-schema-and-prompt-contract"
    last_updated_at: "2026-05-22T00:00:00Z"
    last_updated_by: "gpt-5.5"
    recent_action: "Scaffolded phase 003 plan."
    next_safe_action: "Inspect state format and prompt-pack tests."
    blockers: []
    key_files: ["spec.md", "tasks.md"]
    session_dedup:
      fingerprint: "sha256:1160031000000000000000000000000000000000000000000000000000000000"
      session_id: "116-003-plan"
      parent_session_id: "116-003-review-depth-schema"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Implementation Plan: 116/003 — Review-Depth Schema and Prompt Contract

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Define the v2 review-depth state and prompt contract before validator or reducer changes rely on it.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

- [ ] Phase 002 fixtures exist.
- [ ] Prompt render tests assert review-depth terms.
- [ ] `validate.sh --strict` passes for this phase.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

Contract-first rollout: docs and rendered prompt define the obligations; later phases enforce and persist them.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

- [ ] Update state-format docs.
- [ ] Update prompt-pack template.
- [ ] Add prompt render assertions.
- [ ] Validate docs and targeted tests.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Run prompt-pack tests, targeted docs checks where available, and spec validation.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status |
|------------|------|--------|
| Phase 002 seeded fixtures | Test evidence | Planned |
| Current prompt-pack renderer | Test convention | To inspect |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 6. ROLLBACK PLAN

Revert only prompt/state doc changes and prompt render tests from this phase.
<!-- /ANCHOR:rollback -->
