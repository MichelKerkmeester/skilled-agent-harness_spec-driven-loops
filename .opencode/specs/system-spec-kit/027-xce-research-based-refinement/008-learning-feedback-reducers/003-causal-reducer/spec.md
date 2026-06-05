---
title: "003 Causal Reducer — Session Trace Edges"
description: "Level 2 child packet for deferred session-trace causal edge inference."
trigger_phrases:
  - "009 causal reducer"
  - "003 causal reducer"
  - "session-trace-causal-reducer.ts"
  - "auto-session edges"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/008-learning-feedback-reducers/003-causal-reducer"
    last_updated_at: "2026-06-05T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Applied 2026-06-05 audit rescope: relation-vocab alignment"
    next_safe_action: "Implement tasks.md with RELATION_TYPES-aligned coverage targets."
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md", "checklist.md", "implementation-summary.md"]
    completion_pct: 0
---
# Feature Specification: Session-Trace Causal Reducer

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Spec-Scaffolded |
| **Parent Packet** | `system-spec-kit/027-xce-research-based-refinement/008-learning-feedback-reducers` |
| **Depends On** | `system-spec-kit/027-xce-research-based-refinement/008-learning-feedback-reducers/001-aggregator` |
| **Estimated LOC** | ~265 production LOC |
| **Language** | TypeScript |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

Session traces already record `search_shown` and `result_cited` events, but those signals are never converted into weak causal edges. This child adds a deferred reducer that infers bounded `ENABLED(A -> B)` edges from same-session evidence.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Create `mcp_server/lib/feedback/session-trace-causal-reducer.ts`.
- Read feedback events ordered by `(session_id, timestamp)`.
- For each citation, select 3-5 prior shown sources where `A !== B`.
- Emit `ENABLED` edges at strength `0.3` with `created_by='auto-session'`.
  - AUDIT 2026-06-05: candidate `ENABLED` edges are valid per `RELATION_TYPES` but ABSENT from `DEFAULT_RELATION_TARGETS`; the reducer must validate against `RELATION_TYPES`/schema and align coverage targets before applying the relation floor.
- Preserve manual-edge guard behavior from Phase 002.
- Keep invocation deferred only.
- Add default-off flag `SPECKIT_SESSION_TRACE_CAUSAL_INFERENCE=false`.

### Out of Scope
- Live per-event reducer firing.
- Retention learning.
- Coco rerank learning.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Add deferred session-trace reducer. | No calls from live feedback logging paths. |
| REQ-002 | Deterministically select prior `search_shown` sources. | Same-query sources preferred; cap enforced. |
| REQ-003 | Emit weak auto-session `ENABLED` edges at strength 0.3. | First-run edge inspection passes. |
| REQ-004 | Preserve manual edges and idempotency. | Existing manual edges are skipped; re-run is bounded. |
| REQ-005 | Feature flag defaults off. | Flag-off creates no edges. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- Strict validation passes.
- Reducer tests prove source selection, caps, manual protection, idempotency, and flag-off behavior.
- Code review confirms no live invocation path.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `001-aggregator` | Shared feedback semantics. | Hard dependency. |
| Dependency | Phase 002 | Auto-session cap and manual guard safety. | Parent hard dependency and implementation precheck. |
| Risk | Noisy inferred edges | Ranking pollution. | Deferred only, weak strength, caps, default-off flag. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

- Deferred invocation only.
- Idempotent per `(session_id, A, B)` pair.
- Enforce existing edge caps.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

- Citation with no prior shown source.
- Citation where candidate source equals target.
- Existing manual edge for same pair.
- Re-run over same session.
- Edge cap reached.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:questions -->
## 9. OPEN QUESTIONS

- Whether the explicit maintenance entrypoint is MCP-only or also a CLI command can be decided during implementation.
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
