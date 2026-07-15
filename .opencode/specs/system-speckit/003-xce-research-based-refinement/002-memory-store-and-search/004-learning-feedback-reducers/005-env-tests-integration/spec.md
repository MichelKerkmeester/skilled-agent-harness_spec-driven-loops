---
title: "005 Env Tests Integration"
description: "Level 2 closeout child for ENV_REFERENCE flags and integration tests across feedback reducer consumers."
trigger_phrases:
  - "009 env tests integration"
  - "005 env tests"
  - "feedback reducer integration"
  - "ENV_REFERENCE feedback flags"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/003-xce-research-based-refinement/002-memory-store-and-search/004-learning-feedback-reducers/005-env-tests-integration"
    last_updated_at: "2026-06-10T11:55:00Z"
    last_updated_by: "gpt-5.5-fast"
    recent_action: "Completed env docs and reducer integration tests"
    next_safe_action: "Parent closeout can review this child"
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md", "checklist.md", "implementation-summary.md"]
    completion_pct: 100
---
# Feature Specification: Feedback Reducer Env and Integration Closeout

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Parent Packet** | `system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/004-learning-feedback-reducers` |
| **Depends On** | `001-aggregator`, `003-causal-reducer`, `004-retention-reducer` |
| **Estimated LOC** | ~100 LOC/docs |
| **Language** | TypeScript + docs |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The two feedback reducer consumers introduce separate default-off flags and cross-consumer safety expectations. This closeout child verifies that flags are documented and integration behavior remains coherent across the reducers.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Document `SPECKIT_SESSION_TRACE_CAUSAL_INFERENCE`.
- Document `SPECKIT_FEEDBACK_RETENTION_LEARNING` and `SPECKIT_FEEDBACK_RETENTION_MODE`.
- Add integration tests spanning aggregator plus the two consumers.
- Verify default-off behavior across all consumers.

### Out of Scope
- Implementing the consumer internals owned by children 002, 003, and 004.
- Changing Phase 027 root metadata.
- Live rollout decisions beyond documented eval gates.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Document all feedback reducer flags in `ENV_REFERENCE.md`. | Grep finds the three shipped reducer flags; the older four-flag wording is stale because the aggregator is read-only and flagless. |
| REQ-002 | Add integration coverage across aggregator and consumers. | Tests prove flag-off default safety. |
| REQ-003 | Verify active mutation requires configured gates. | Retention active mode blocked without eval gate. |
| REQ-004 | Confirm consumer independence after aggregator. | Tests or docs show 002/003/004 can run independently after 001. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- Strict validation passes.
- Env docs include every flag and default value.
- Integration tests cover flag-off behavior across all consumers.
- Parent can be considered scaffold-complete after this child lands.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Children 001-004 | Closeout cannot verify missing modules. | Hard dependency list. |
| Risk | Flag drift | Operators enable wrong behavior. | Single ENV_REFERENCE update with defaults. |
| Risk | Integration gaps | Consumers pass unit tests but fail together. | Cross-consumer integration tests. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

- Documentation must state safe defaults.
- Integration tests must avoid live external services.
- Tests should be deterministic and local.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

- All flags unset.
- Each consumer flag enabled individually.
- Retention learning enabled with shadow mode.
- Retention active mode requested without eval gate.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:questions -->
## 9. OPEN QUESTIONS

- Exact integration test file layout depends on the final modules from children 002-004.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:complexity -->
## COMPLEXITY ASSESSMENT

Level 2 is appropriate: this child is implementation-sized, verification-focused, and bounded to one reducer surface.
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- `../001-aggregator/spec.md`
- `../003-causal-reducer/spec.md`
- `../004-retention-reducer/spec.md`
<!-- /ANCHOR:related-docs -->
