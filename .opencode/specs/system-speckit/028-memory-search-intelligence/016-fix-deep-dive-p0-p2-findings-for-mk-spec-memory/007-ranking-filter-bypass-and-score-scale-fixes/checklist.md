---
title: "Verification Checklist: Phase 007 - Ranking Filter Bypass and Score Scale Fixes"
description: "Level 3 verification checklist for the Group-A flag plumbing, filter-bypass, score-scale, and gate-fix clusters, including fix-completeness classes and baseline/eval-delta evidence."
trigger_phrases:
  - "ranking filter bypass"
  - "score scale fixes"
  - "flag read root cause"
  - "phase 007 checklist"
  - "verification checklist"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/016-fix-deep-dive-p0-p2-findings-for-mk-spec-memory/007-ranking-filter-bypass-and-score-scale-fixes"
    last_updated_at: "2026-07-03T10:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored Level 3 planning docs from deep-dive research sources"
    next_safe_action: "Capture baselines, then run the confirm-before-fix pass on 🟡 findings"
    blockers: []
    key_files:
      - "checklist.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "planning-007-ranking-filter-bypass-and-score-scale-fixes"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Phase 007 - Ranking Filter Bypass and Score Scale Fixes

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
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

- [ ] CHK-001 [P0] Requirements documented in spec.md (REQ-001 through REQ-024 with acceptance criteria)
- [ ] CHK-002 [P0] Technical approach defined in plan.md (four clusters, FIX ADDENDUM surfaces, inventories)
- [ ] CHK-003 [P1] Dependencies identified and available (006 harness status confirmed before cluster 3 starts)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Code passes lint/format checks (mcp_server tsc plus lint clean)
- [ ] CHK-011 [P0] No console errors or warnings in test and build output
- [ ] CHK-012 [P1] Error handling implemented (empty injection sets, missing community members, degenerate n of 2 evidence)
- [ ] CHK-013 [P1] Code follows project patterns (no ephemeral packet/finding IDs in code comments; durable WHY only)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] All acceptance criteria met (each REQ row verified with its stated check)
- [ ] CHK-021 [P0] Manual testing complete (live CLI probes: T-0211/T-0212/REQ-214 symptoms gone on warm daemon)
- [ ] CHK-022 [P1] Edge cases tested (empty minState, all-equal fusion, explicit-0 knobs, stopword-only graph query)
- [ ] CHK-023 [P1] Error scenarios validated (mid-session flag toggle, deleted community member, zero-candidate rescue)
- [ ] CHK-024 [P0] Adversarial bypass battery green: per entry lane x filter class, excluded rows stay excluded (tasks T023/T050)
- [ ] CHK-025 [P0] Group-A toggle matrix passes for all six member flag classes, cold start and warm toggle (task T014)
- [ ] CHK-026 [P0] Baseline captured before first code edit and eval-delta reported after: vitest whole-gate plus 006-harness completeRecall@3 with no regression (tasks T001/T002/T051/T052)
- [ ] CHK-027 [P1] Telemetry truthfulness verified: causalBoosted, communityDelta, graphContribution non-zero only when boosts genuinely apply (task T053)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`.
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep (all lanes appending rows post-filter enumerated).
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests (score-scale symbol consumers per FIX ADDENDUM).
- [ ] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases (tenant-scope re-application battery).
- [ ] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed (lane x filter x flag matrix from plan.md).
- [ ] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state (flag toggles under warm daemon, explicit-0 env knobs).
- [ ] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets
- [ ] CHK-031 [P0] Input validation implemented (gate battery re-applied on every side-entry lane)
- [ ] CHK-032 [P1] Auth/authz working correctly (tenant/user/agent scope filters enforceable on trigger-lane and rescue rows; NFR-S01)
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized (statuses and completed tasks reconciled)
- [ ] CHK-041 [P1] Code comments adequate (durable WHY at fix sites; no finding IDs embedded)
- [ ] CHK-042 [P2] Stage2/search architecture doc notes updated where score semantics changed
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in scratch/ only (baseline artifacts live in scratch/)
- [ ] CHK-051 [P1] scratch/ cleaned before completion (baselines summarized into implementation-summary.md evidence first)
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 18 | 0/18 |
| P1 Items | 24 | 0/24 |
| P2 Items | 9 | 0/9 |

**Verification Date**: Pending (set when phase verification runs)
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

- [ ] CHK-100 [P0] Architecture decisions documented in decision-record.md (ADR-001 headroom, ADR-002 trigger weight, ADR-003 flags/rollout)
- [ ] CHK-101 [P1] All ADRs have status (Proposed/Accepted); statuses updated when A/B results land
- [ ] CHK-102 [P1] Alternatives documented with rejection rationale
- [ ] CHK-103 [P2] Migration path documented (threshold consumers of the normalization scale inventoried before headroom change)
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION

- [ ] CHK-110 [P1] NFR-P01 met: warm memory_search p50 within 50ms of baseline after flag-plumbing and gate re-application
- [ ] CHK-111 [P1] NFR-R01 honored: default-ON fixes revertable per-cluster; ranking-order changes flag-gated per ADR-003
- [ ] CHK-112 [P2] Load testing completed (repeated warm searches; no added event-loop lag from per-request flag reads)
- [ ] CHK-113 [P2] Performance benchmarks documented (before/after p50 recorded with the eval-delta report)
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS

- [ ] CHK-120 [P0] Rollback procedure documented and tested (per-cluster revert; cluster-3 flag off as first-line rollback)
- [ ] CHK-121 [P0] Feature flag configured (cluster-3 phase flag per ADR-003; default OFF until eval-delta clean)
- [ ] CHK-122 [P1] Monitoring/alerting configured (telemetry fields truthful so causalBoosted/communityDelta can be watched)
- [ ] CHK-123 [P1] Runbook created (flag toggle plus revert steps recorded in implementation-summary.md)
- [ ] CHK-124 [P2] Deployment runbook reviewed
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION

- [ ] CHK-130 [P1] Security review completed (tenant-scope invariant across all entry lanes)
- [ ] CHK-131 [P1] Dependency licenses compatible (no new dependencies expected; confirm none added)
- [ ] CHK-132 [P2] OWASP Top 10 checklist completed (access-control class relevant to scope filters)
- [ ] CHK-133 [P2] Data handling compliant with requirements (no schema or data migrations in this phase)
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

- [ ] CHK-140 [P1] All spec documents synchronized (spec/plan/tasks/checklist/decision-record consistent at close)
- [ ] CHK-141 [P1] API documentation complete (tool-surface docs updated if envelope fields change meaning; else noted not-applicable)
- [ ] CHK-142 [P2] User-facing documentation updated (search command docs if flag defaults change)
- [ ] CHK-143 [P2] Knowledge transfer documented (implementation-summary.md carries the delivery story and eval-delta table)
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: SIGN-OFF

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Michel Kerkmeester | Technical Lead | [ ] Approved | |
| Michel Kerkmeester | Product Owner | [ ] Approved | |
| Michel Kerkmeester | QA Lead | [ ] Approved | |
<!-- /ANCHOR:sign-off -->

---

<!--
Level 3 checklist - Full verification + architecture
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
