---
title: "Verification Checklist: Hooks Compat And Consumer Cutover"
description: "Checklist for validating the L3 005 spec-doc scaffold and the later consumer-cutover implementation."
trigger_phrases:
  - "013 009 005 checklist"
  - "advisor consumer cutover verification"
  - "hooks compat checklist"
importance_tier: "critical"
contextType: "checklist"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/013-skill-advisor-semantic-lane/009-system-skill-advisor-extraction/005-hooks-compat-and-consumer-cutover"
    last_updated_at: "2026-05-14T12:45:00Z"
    last_updated_by: "codex"
    recent_action: "COMPACT authored checklist"
    next_safe_action: "Use checklist during implementation"
    blockers: []
    key_files:
      - "checklist.md"
      - "spec.md"
      - "plan.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0130090050000000000000000000000000000000000000000000000000000000"
      session_id: "013-009-005-hooks-compat-consumer-cutover"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
# Verification Checklist: Hooks Compat And Consumer Cutover

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | Hard blocker | Cannot claim implementation complete until checked |
| **[P1]** | Required | Must complete or get explicit deferral |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## PRE-IMPLEMENTATION

- [x] CHK-001 [P0] Required source reading reflected in docs. Evidence: `spec.md` and `decision-record.md` cite parent ADR-001, parent phase, sibling 003 shape, consumer bridge/hook/shim/doctor/install surfaces.
- [x] CHK-002 [P0] REQ-001 through REQ-008 authored. Evidence: `spec.md` requirements table contains eight rows.
- [x] CHK-003 [P0] Three-phase plan authored with required headers. Evidence: `plan.md` contains `ARCHITECTURE`, `IMPLEMENTATION PHASES`, and `ROLLBACK PLAN`; `tasks.md` contains `PHASE 1: SETUP`, `PHASE 2: IMPLEMENTATION`, and `PHASE 3: VERIFICATION`.
- [ ] CHK-004 [P0] Child 004 standalone server availability confirmed before implementation begins.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## CODE QUALITY

- [ ] CHK-010 [P0] `system_skill_advisor` is the primary production route for all advisor callers.
- [ ] CHK-011 [P0] `spec_kit_memory` advisor registration is proxy-only or migration-hint-only per ADR-003.
- [ ] CHK-012 [P0] Tool ids remain stable as `advisor_*`.
- [ ] CHK-013 [P0] OpenCode bridge no longer imports old `dist/skill_advisor` or `skill_advisor/schemas` paths.
- [ ] CHK-014 [P0] Python shim routes through `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py`.
- [ ] CHK-015 [P0] Doctor update and skill-advisor doctor assets point at standalone advisor package/server.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## TESTING

- [ ] CHK-016 [P0] OpenCode skill-advisor plugin bridge smoke passed.
- [ ] CHK-017 [P0] Prompt-time hook smoke passed for available Claude, Codex, Gemini, and OpenCode surfaces.
- [ ] CHK-018 [P0] Python shim native and fallback smoke passed.
- [ ] CHK-019 [P0] `/doctor:update --cleanup-legacy=false` or approved safe dry-run equivalent passed during implementation.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX COMPLETENESS

- [ ] CHK-020 [P0] Consumer inventory completed with every `advisor_*` hit classified.
- [ ] CHK-021 [P0] Stale-reference grep executed and every remaining hit classified.
- [ ] CHK-022 [P0] Proxy removal targets recorded for child 006.
- [ ] CHK-023 [P1] Deprecation logs checked for remaining legacy callers before removal.
- [ ] CHK-024 [P1] Old docs and tests that reference memory-side advisor ownership classified as historical or cleanup.
- [x] CHK-025 [P0] Strict spec validation passed for the 005 docs scaffold. Evidence: `validate.sh .../005-hooks-compat-and-consumer-cutover --strict` exited 0.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## SECURITY

- [ ] CHK-030 [P0] Proxy path does not expose prompt text or stack traces in deprecation logs.
- [ ] CHK-031 [P0] OpenCode plugin bridge preserves prompt-size caps and fail-open parsing.
- [ ] CHK-032 [P1] Doctor workflow path validation still blocks writes outside approved targets.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## DOCUMENTATION

- [x] CHK-040 [P0] Architecture decisions documented. Evidence: `decision-record.md` ADR-001 through ADR-005.
- [x] CHK-041 [P0] Proxy versus fail-fast tradeoff documented. Evidence: ADR-003.
- [x] CHK-042 [P0] Tool-id stability implications documented. Evidence: ADR-002.
- [x] CHK-043 [P1] Plugin bridge import strategy documented. Evidence: ADR-004.
- [x] CHK-044 [P1] Doctor update target change documented. Evidence: ADR-005.
- [ ] CHK-045 [P1] Both install guides explain dual-MCP topology and deprecation window.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## FILE ORGANIZATION

- [x] CHK-050 [P0] Authored markdown files stay inside 005 scope. Evidence: `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, `implementation-summary.md`.
- [x] CHK-051 [P0] Metadata files stay inside 005 scope. Evidence: `description.json` and `graph-metadata.json`.
- [ ] CHK-052 [P1] Implementation pass avoids sibling 001/002/003/004/006 edits unless explicitly re-scoped.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| Documentation P0 Items | 13 | 13/13 |
| Implementation P0 Items | 17 | 0/17 |
| P1 Items | 8 | 2/8 |

**Verification Date**: 2026-05-14
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

- [x] CHK-100 [P0] Architecture decisions documented in `decision-record.md`.
- [x] CHK-101 [P1] All ADRs have accepted status.
- [x] CHK-102 [P1] Alternatives documented with rejection rationale.
- [x] CHK-103 [P2] Migration path documented through child 006 cleanup.
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION

- [ ] CHK-110 [P1] Prompt-time hook timeout behavior unchanged after cutover.
- [ ] CHK-111 [P1] Plugin bridge smoke stays within existing timeout budget.
- [ ] CHK-112 [P2] Advisor validation latency recorded if `advisor_validate` is run.
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS

- [ ] CHK-120 [P0] Rollback procedure documented and tested for the implementation patch.
- [ ] CHK-121 [P0] Legacy proxy deprecation behavior documented before release.
- [ ] CHK-122 [P1] Child 006 cleanup handoff recorded.
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION

- [ ] CHK-130 [P1] Deprecation logs confirmed to avoid sensitive prompt content.
- [ ] CHK-131 [P1] Install guides reviewed for stale topology claims.
- [ ] CHK-132 [P2] Archive or historical references labelled if left in place.
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

- [x] CHK-140 [P1] Spec, plan, tasks, checklist, decision record, and implementation summary synchronized for the docs scaffold.
- [ ] CHK-141 [P1] Implementation verification evidence added after code cutover.
- [ ] CHK-142 [P2] Operator-facing install-guide examples smoke-tested.
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: SIGN-OFF

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Operator | Packet owner | Pending implementation pass | 2026-05-14 |
<!-- /ANCHOR:sign-off -->
