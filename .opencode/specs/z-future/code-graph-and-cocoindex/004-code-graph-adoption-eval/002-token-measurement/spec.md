---
title: "Feature Specification: 002 Token Measurement"
description: "Token measurement helper for reading session analytics DB rows after eval task sessions complete."
trigger_phrases:
  - "027 006 002 token measurement"
  - "session analytics token measurement"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "z_future/code-graph-and-cocoindex/004-code-graph-adoption-eval/002-token-measurement"
    last_updated_at: "2026-05-12T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Scaffolded Level 2 child packet"
    next_safe_action: "Implement token-measurement helper after 001 lands"
    blockers: ["Depends on 001-harness-skeleton"]
    key_files: ["spec.md", "plan.md", "tasks.md", "checklist.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "027-006-002-token-measurement"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Feature Specification: 002 Token Measurement

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Planned |
| **Created** | 2026-05-12 |
| **Parent Packet** | `system-spec-kit/028-code-graph-and-cocoindex/004-code-graph-adoption-eval` |
| **Depends On** | `001-harness-skeleton` |
| **Estimated LOC** | ~25 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The eval harness needs per-session token counts to test the RQ8 token-reduction claim. Without a small helper over session analytics, report generation would either duplicate DB access logic or omit the metric that makes the evaluation useful.

### Purpose
Implement `lib/eval/token-measurement.ts` to read `prompt_tokens`, `completion_tokens`, and `total_tokens` from session analytics rows by `session_id`, returning a compact result that the harness can attach to each task run.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Query session analytics storage by session id.
- Return prompt, completion, and total token counts.
- Represent missing analytics rows explicitly.

### Out of Scope
- Session analytics schema changes.
- Report rendering.
- Provider subprocess lifecycle.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `mcp_server/lib/eval/token-measurement.ts` | Create | Token metrics helper over session analytics DB |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Read token metrics by session id | Helper returns prompt, completion, and total tokens for known sessions |
| REQ-002 | Handle missing analytics rows | Helper returns structured missing state instead of throwing ambiguous errors |
| REQ-003 | Preserve harness row compatibility | Return shape can be serialized into eval result rows |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Keep DB access localized | CLI and report generator do not query analytics directly |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- Token helper can be called from the harness after each task session.
- Missing token rows are distinguishable from zero-token rows.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | 001 harness skeleton | High | Wait for stable result/session id contract |
| Dependency | session analytics DB | High | Use existing DB helper instead of new storage |
| Risk | Missing session rows | Medium | Return explicit missing state and let dispatcher retry/account |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

- **NFR-P01**: Token lookup should be a single indexed query.
- **NFR-R01**: Missing rows must not crash the whole harness.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

- Session id is null or empty.
- Session exists but token columns are null.
- Analytics DB is temporarily unavailable.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 10. COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | Low | Bounded child packet with a narrow implementation surface |
| Risk | Medium | Integration with the parent harness contract must stay aligned |
| Dependencies | Medium | Depends on the declared predecessor packets |

<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 9. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Parent**: `../spec.md`
- **Predecessor**: `../001-harness-skeleton/spec.md`
<!-- /ANCHOR:related-docs -->

