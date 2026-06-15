---
title: "Verification Checklist: Machine-checkable evidence contract schema in post-dispatch-validate and the agent IO contract [template:level_3/checklist.md]"
description: "Verification Date: 2026-06-15"
trigger_phrases:
  - "verification"
  - "checklist"
  - "name"
  - "template"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "scaffold/009-evidence-contract"
    last_updated_at: "2026-06-15T14:06:40Z"
    last_updated_by: "template-author"
    recent_action: "Initialized Level 3 template"
    next_safe_action: "Replace continuity placeholders"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/009-evidence-contract"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
# Verification Checklist: Machine-checkable evidence contract schema in post-dispatch-validate and the agent IO contract

<!-- SPECKIT_LEVEL: 3 -->
<!--
SELF-CHECK:
- Confirm every required item has concrete evidence before marking it complete.
- Keep optional deferrals explicit, owned, and separate from blockers.
FAILURE MODES:
- Rubber-stamping the checklist, vague tested-claims, and hidden blocker deferrals.
-->

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

- [ ] CHK-001 [P0] The five fields and their acceptance criteria are documented in spec.md (REQ-001 through REQ-008)
- [ ] CHK-002 [P0] The advisory-not-blocking approach is defined in plan.md and ADR-001
- [ ] CHK-003 [P1] Dependencies on phases 003 (measurement) and 008 (provenance) are noted and resolved
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] `evidence-contract.ts` type-checks and `post-dispatch-validate.ts` compiles after the edit
- [ ] CHK-011 [P0] `grep` for the five field names across `deep-loop-runtime` no longer returns zero hits
- [ ] CHK-012 [P1] Malformed evidence is handled by returning an advisory, never by throwing
- [ ] CHK-013 [P1] Evidence warnings reuse the existing `PostDispatchAdvisory` type and `warnings` channel
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] Present, absent, and malformed evidence states each have a passing `vitest` case
- [ ] CHK-021 [P0] A record with no evidence metadata passes with `ok: true` and no evidence warning (backward-compatible)
- [ ] CHK-022 [P1] Per-field edge cases (wrong-type, unknown-enum, partial set) warn and name the field path
- [ ] CHK-023 [P1] No new entry was added to `PostDispatchFailureReason`
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`.
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep.
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests.
- [ ] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases.
- [ ] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed.
- [ ] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state.
- [ ] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets in the new module or tests
- [ ] CHK-031 [P0] Evidence fields are validated as untrusted data and never executed or interpreted as instructions
- [ ] CHK-032 [P1] No auth surface is touched (internal schema only) - confirmed by the Files to Change table
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] spec/plan/tasks/checklist synchronized
- [ ] CHK-041 [P1] Code comments state durable WHY only - no spec paths or artifact ids embedded (comment-hygiene HARD rule)
- [ ] CHK-042 [P1] `agent-io-contract.md` documents the `AGENT_IO_EVIDENCE v1` group and the absence-never-blocks rule
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in scratch/ only
- [ ] CHK-051 [P1] scratch/ cleaned before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 14 | 0/14 |
| P1 Items | 20 | 0/20 |
| P2 Items | 13 | 0/13 |

**Verification Date**: 2026-06-15 (PLANNED - verification runs at implementation)
<!-- /ANCHOR:summary -->

---

<!-- Append to Level 2 checklist.md -->

---

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

- [ ] CHK-100 [P0] The advisory-not-blocking decision is documented in decision-record.md (ADR-001)
- [ ] CHK-101 [P1] ADR-001 carries a status
- [ ] CHK-102 [P1] The blocking-gate alternative is documented with its rejection rationale
- [ ] CHK-103 [P2] Producer-retrofit path is named as a follow-on phase (migration note)
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION

- [ ] CHK-110 [P1] Evidence validation adds no measurable latency (in-memory check on already-parsed records, per NFR-P01)
- [ ] CHK-111 [P2] No throughput target applies - validation is synchronous and per-record
- [ ] CHK-112 [P2] No load test needed - the check is bounded by the five fields
- [ ] CHK-113 [P2] No performance benchmark needed for an in-memory schema check
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS

- [ ] CHK-120 [P0] Rollback procedure documented in plan.md (remove the validator call)
- [ ] CHK-121 [P2] No feature flag needed - the change is advisory-only by design
- [ ] CHK-122 [P2] No monitoring/alerting needed for an internal advisory check
- [ ] CHK-123 [P2] No runbook needed - rollback is a single-call revert
- [ ] CHK-124 [P2] Deployment runbook not applicable
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION

- [ ] CHK-130 [P2] No external security review needed - internal schema, no new attack surface
- [ ] CHK-131 [P2] No new dependencies introduced
- [ ] CHK-132 [P2] OWASP review not applicable - no network or user input boundary added
- [ ] CHK-133 [P1] Evidence fields are treated as inert data, never interpreted as instructions
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

- [ ] CHK-140 [P1] spec/plan/tasks/checklist/decision-record synchronized
- [ ] CHK-141 [P1] `agent-io-contract.md` documents the contract (the API doc for this feature)
- [ ] CHK-142 [P2] No user-facing documentation - the contract is internal to agent dispatch
- [ ] CHK-143 [P2] Knowledge transfer covered by the documented contract group
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: SIGN-OFF

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Packet owner | Technical Lead | [ ] Approved | |
| Packet owner | Product Owner | [ ] Approved | |
| Packet owner | QA Lead | [ ] Approved | |
<!-- /ANCHOR:sign-off -->

---

<!--
Level 3 checklist - Full verification + architecture
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->

