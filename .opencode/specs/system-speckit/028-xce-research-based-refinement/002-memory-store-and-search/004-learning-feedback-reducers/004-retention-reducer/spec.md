---
title: "004 Retention Reducer — Feedback Retention Learning"
description: "Level 2 child packet for learned retention and edge-floor reducer logic."
trigger_phrases:
  - "009 retention reducer"
  - "004 retention reducer"
  - "feedback-retention-reducer.ts"
  - "edge-tier-basement.ts"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-xce-research-based-refinement/002-memory-store-and-search/004-learning-feedback-reducers/004-retention-reducer"
    last_updated_at: "2026-06-10T11:40:00Z"
    last_updated_by: "gpt-5.5-fast"
    recent_action: "Implemented gated feedback retention reducer."
    next_safe_action: "Monitor shadow audits before active rollout."
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md", "checklist.md", "implementation-summary.md"]
    completion_pct: 100
---
# Feature Specification: Feedback Retention Reducer

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Implemented |
| **Parent Packet** | `system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/004-learning-feedback-reducers` |
| **Depends On** | `system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/004-learning-feedback-reducers/001-aggregator` |
| **Estimated LOC** | ~385 production LOC |
| **Language** | TypeScript |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

Retention currently follows rule-based TTL behavior. This child adds a feedback-aware retention reducer that can return `delete`, `extend`, or `protect` decisions while keeping constitutional/critical protection narrow and auditable.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Create `mcp_server/lib/feedback/feedback-retention-reducer.ts`.
- Create `mcp_server/lib/feedback/edge-tier-basement.ts`.
  - Verified: `STATE_LIMITS` is already a production export in `stage4-filter.ts`; the helper imports it without changing that file.
- Consume `001-aggregator` summaries and Phase 002's extended retention row shape.
- Implement `RetentionDecision = delete | extend | protect`.
- Add dry-run shadow path.
- Add feature flags `SPECKIT_FEEDBACK_RETENTION_LEARNING=false` and `SPECKIT_FEEDBACK_RETENTION_MODE=shadow|active`.

### Out of Scope
- Broadening tier floors to auto-derived edges.
- Active mutation before shadow evaluation.
- Causal-edge inference.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Add retention reducer consuming shared aggregation. | Important positive-feedback records can extend. |
| REQ-002 | Protect constitutional/critical and pinned records. | Expired constitutional rows are not deleted. |
| REQ-003 | Add narrow edge floor helper. | Only manual/authored high-tier pairs or explicit constitutional-chain evidence are floored. |
| REQ-004 | Support `dryRun` shadow decisions without writes. | Dry-run test observes no DB mutation. |
| REQ-005 | Gate active mode behind shadow evaluation and flags. | Flag matrix tests pass. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- Strict validation passes.
- Decision rules and edge-floor scope tests pass.
- Sweep integration writes audit entries for extend/protect/delete.
- Active mode cannot run without configured flag and eval gate.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `001-aggregator` | Requires weighted positive summary. | Hard dependency. |
| Dependency | Phase 002 | Requires retention row tier fields. | Parent hard dependency. |
| Risk | Exposure rewarded as value | Retain noisy memories. | Important-tier-only v1 boost and negative signal dampening. |
| Risk | Edge floor protects noise | Bad causal graph durability. | Narrow edge-floor rules. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

- Shadow-first and default-off.
- Auditable decisions.
- No active mutation without gate.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

- Constitutional record with expired `delete_after`.
- Pinned record with negative feedback.
- Important record with positive and reformulated signals.
- Normal/temporary record with positive exposure only.
- Auto-derived edge touching one high-tier endpoint.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:questions -->
## 9. OPEN QUESTIONS

- Whether `protect` clears `delete_after` or sets a distant future date remains an implementation choice, but the audit event must record the chosen behavior.
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
- `../005-env-tests-integration/spec.md`
<!-- /ANCHOR:related-docs -->
