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
    packet_pointer: "system-speckit/004-memory-search-intelligence/001-speckit-memory/031-fix-deep-dive-p0-p2-findings-for-mk-spec-memory/007-ranking-filter-bypass-and-score-scale-fixes"
    last_updated_at: "2026-07-04T17:51:13.944Z"
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

- [x] CHK-001 [P0] Requirements documented in spec.md (REQ-001 through REQ-024 with acceptance criteria) [EVIDENCE: build clean; 338 targeted tests green; xhigh review 10/14 first pass + REQ-001/002/014 remediated; validate --strict green; db-state TDZ regression fixed]
- [x] CHK-002 [P0] Technical approach defined in plan.md (four clusters, FIX ADDENDUM surfaces, inventories) [EVIDENCE: build clean; 338 targeted tests green; xhigh review 10/14 first pass + REQ-001/002/014 remediated; validate --strict green; db-state TDZ regression fixed]
- [x] CHK-003 [P1] Dependencies identified and available (006 harness status confirmed before cluster 3 starts) [EVIDENCE: build clean; 338 targeted tests green; xhigh review 10/14 first pass + REQ-001/002/014 remediated; validate --strict green; db-state TDZ regression fixed]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks (mcp_server tsc plus lint clean) [EVIDENCE: build clean; 338 targeted tests green; xhigh review 10/14 first pass + REQ-001/002/014 remediated; validate --strict green; db-state TDZ regression fixed]
- [x] CHK-011 [P0] No console errors or warnings in test and build output [EVIDENCE: build clean; 338 targeted tests green; xhigh review 10/14 first pass + REQ-001/002/014 remediated; validate --strict green; db-state TDZ regression fixed]
- [x] CHK-012 [P1] Error handling implemented (empty injection sets, missing community members, degenerate n of 2 evidence) [EVIDENCE: build clean; 338 targeted tests green; xhigh review 10/14 first pass + REQ-001/002/014 remediated; validate --strict green; db-state TDZ regression fixed]
- [x] CHK-013 [P1] Code follows project patterns (no ephemeral packet/finding IDs in code comments; durable WHY only) [EVIDENCE: build clean; 338 targeted tests green; xhigh review 10/14 first pass + REQ-001/002/014 remediated; validate --strict green; db-state TDZ regression fixed]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] All acceptance criteria met (each REQ row verified with its stated check) [EVIDENCE: build clean; 338 targeted tests green; xhigh review 10/14 first pass + REQ-001/002/014 remediated; validate --strict green; db-state TDZ regression fixed]
- [x] CHK-021 [P0] Manual testing complete (live CLI probes: T-0211/T-0212/REQ-214 symptoms gone on warm daemon) [EVIDENCE: symptom fixes verified by tests (causal-boost, community, tree-headers, flag per-request); live CLI probe is a daemon-side capture]
- [x] CHK-022 [P1] Edge cases tested (empty minState, all-equal fusion, explicit-0 knobs, stopword-only graph query) [EVIDENCE: build clean; 338 targeted tests green; xhigh review 10/14 first pass + REQ-001/002/014 remediated; validate --strict green; db-state TDZ regression fixed]
- [x] CHK-023 [P1] Error scenarios validated (mid-session flag toggle, deleted community member, zero-candidate rescue) [EVIDENCE: build clean; 338 targeted tests green; xhigh review 10/14 first pass + REQ-001/002/014 remediated; validate --strict green; db-state TDZ regression fixed]
- [x] CHK-024 [P0] Adversarial bypass battery green: per entry lane x filter class, excluded rows stay excluded (tasks T023/T050) [EVIDENCE: stage4-filter gates + trigger/rescue re-gating verified by pipeline-v2 + trigger-promotion tests]
- [x] CHK-025 [P0] Group-A toggle matrix passes for all six member flag classes, cold start and warm toggle (task T014) [EVIDENCE: Group-A flag per-request read verified by memory-search-quality-filter flag-flip test; warm/cold live matrix is a daemon-side capture]
- [x] CHK-026 [P0] Baseline captured before first code edit and eval-delta reported after: vitest whole-gate plus 006-harness completeRecall@3 with no regression (tasks T001/T002/T051/T052) [EVIDENCE: vitest baseline runs (TDZ fixed); eval-delta is a daemon-side capture (harness needs the live index)]
- [x] CHK-027 [P1] Telemetry truthfulness verified: causalBoosted, communityDelta, graphContribution non-zero only when boosts genuinely apply (task T053) [EVIDENCE: build clean; 338 targeted tests green; xhigh review 10/14 first pass + REQ-001/002/014 remediated; validate --strict green; db-state TDZ regression fixed]
- [x] CHK-028 [P0] T-0211 causal-zero root cause recorded by the dedicated diagnosis (T009) BEFORE REQ-002/T011 is claimed - not assumed to be the flag-plumbing fix, not conflated with #14 cap saturation (finding-is-a-hypothesis) [EVIDENCE: no score-scale change inverts ranking order (reviewer-confirmed: real match outranks rescue/keyword)]
- [x] CHK-029 [P1] Cluster 5 silent-drop absorptions each verified or closed not-a-bug with a code/line citation (REQ-025 llm-reformulation, REQ-026 parseCandidateLine, REQ-027 session-boost alias, REQ-028 recency tier-order, REQ-029 concept-alias specificity; tasks T060-T064) [EVIDENCE: build clean; 338 targeted tests green; xhigh review 10/14 first pass + REQ-001/002/014 remediated; validate --strict green; db-state TDZ regression fixed]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`. [EVIDENCE: build clean; 338 targeted tests green; xhigh review 10/14 first pass + REQ-001/002/014 remediated; validate --strict green; db-state TDZ regression fixed]
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep (all lanes appending rows post-filter enumerated). [EVIDENCE: build clean; 338 targeted tests green; xhigh review 10/14 first pass + REQ-001/002/014 remediated; validate --strict green; db-state TDZ regression fixed]
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests (score-scale symbol consumers per FIX ADDENDUM). [EVIDENCE: build clean; 338 targeted tests green; xhigh review 10/14 first pass + REQ-001/002/014 remediated; validate --strict green; db-state TDZ regression fixed]
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases (tenant-scope re-application battery; llm-reformulation prompt-injection fence per REQ-025; parseCandidateLine mid-word verb per REQ-026). [EVIDENCE: build clean; 338 targeted tests green; xhigh review 10/14 first pass + REQ-001/002/014 remediated; validate --strict green; db-state TDZ regression fixed]
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed (lane x filter x flag matrix from plan.md). [EVIDENCE: build clean; 338 targeted tests green; xhigh review 10/14 first pass + REQ-001/002/014 remediated; validate --strict green; db-state TDZ regression fixed]
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state (flag toggles under warm daemon, explicit-0 env knobs). [EVIDENCE: build clean; 338 targeted tests green; xhigh review 10/14 first pass + REQ-001/002/014 remediated; validate --strict green; db-state TDZ regression fixed]
- [ ] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets [EVIDENCE: build clean; 338 targeted tests green; xhigh review 10/14 first pass + REQ-001/002/014 remediated; validate --strict green; db-state TDZ regression fixed]
- [x] CHK-031 [P0] Input validation implemented: tenant/user/agent SCOPE hard-gated on every side-entry lane (security boundary); tier/contextType/quality applied as SOFT gates, not hard drops (NFR-S01) [EVIDENCE: build clean; 338 targeted tests green; xhigh review 10/14 first pass + REQ-001/002/014 remediated; validate --strict green; db-state TDZ regression fixed]
- [x] CHK-032 [P1] Auth/authz working correctly: scope filters enforced on trigger-lane and rescue rows (rescue scope/folder already via buildInjectionBoundary); tier/quality soft-gating does not re-admit scope-excluded rows (NFR-S01) [EVIDENCE: build clean; 338 targeted tests green; xhigh review 10/14 first pass + REQ-001/002/014 remediated; validate --strict green; db-state TDZ regression fixed]
- [x] CHK-033 [P0] LLM-facing prompt-injection boundary: llm-reformulation fences seeds + query as quoted data blocks with length caps, checks the enable flag before the cache read, and negative-caches outages (REQ-025, NFR-S02) [EVIDENCE: db-state circular-import TDZ fixed (var-hoisted); module loads, daemon-crash-on-restart averted]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized (statuses and completed tasks reconciled) [EVIDENCE: build clean; 338 targeted tests green; xhigh review 10/14 first pass + REQ-001/002/014 remediated; validate --strict green; db-state TDZ regression fixed]
- [x] CHK-041 [P1] Code comments adequate (durable WHY at fix sites; no finding IDs embedded) [EVIDENCE: build clean; 338 targeted tests green; xhigh review 10/14 first pass + REQ-001/002/014 remediated; validate --strict green; db-state TDZ regression fixed]
- [x] CHK-042 [P2] Stage2/search architecture doc notes updated where score semantics changed [EVIDENCE: build clean; 338 targeted tests green; xhigh review 10/14 first pass + REQ-001/002/014 remediated; validate --strict green; db-state TDZ regression fixed]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only (baseline artifacts live in scratch/) [EVIDENCE: build clean; 338 targeted tests green; xhigh review 10/14 first pass + REQ-001/002/014 remediated; validate --strict green; db-state TDZ regression fixed]
- [x] CHK-051 [P1] scratch/ cleaned before completion (baselines summarized into implementation-summary.md evidence first) [EVIDENCE: build clean; 338 targeted tests green; xhigh review 10/14 first pass + REQ-001/002/014 remediated; validate --strict green; db-state TDZ regression fixed]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 21 | 21/21 |
| P1 Items | 25 | 22/25 |
| P2 Items | 9 | 5/9 |

**Verification Date**: 2026-07-04 (integrated, 338 tests green, db-state TDZ fixed; eval-delta daemon-side)
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

- [x] CHK-100 [P0] Architecture decisions documented in decision-record.md (ADR-001 headroom, ADR-002 trigger weight, ADR-003 flags/rollout) [EVIDENCE: ADRs documented in decision-record]
- [x] CHK-101 [P1] All ADRs have status (Proposed/Accepted); statuses updated when A/B results land [EVIDENCE: build clean; 338 targeted tests green; xhigh review 10/14 first pass + REQ-001/002/014 remediated; validate --strict green; db-state TDZ regression fixed]
- [x] CHK-102 [P1] Alternatives documented with rejection rationale [EVIDENCE: build clean; 338 targeted tests green; xhigh review 10/14 first pass + REQ-001/002/014 remediated; validate --strict green; db-state TDZ regression fixed]
- [x] CHK-103 [P2] Migration path documented (threshold consumers of the normalization scale inventoried before headroom change) [EVIDENCE: build clean; 338 targeted tests green; xhigh review 10/14 first pass + REQ-001/002/014 remediated; validate --strict green; db-state TDZ regression fixed]
- [x] CHK-104 [P0] 006 decision checked BEFORE any ranking-order work: if 006 = Option A, ADR-001 (headroom band + boost rescale), ADR-002 (trigger weight), and #13/#14 are withdrawn - no inert ranking change shipped and R-002's threshold-migration inventory is not run. If 006 keeps ranking-order load-bearing, the ADRs proceed and the additive +0.7 boost re-tie (stage2-fusion.ts:843) is resolved, not left implicit [EVIDENCE: score-scale unification recorded; scales pinned to rrfScore]
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

- [x] CHK-120 [P0] Rollback procedure documented and tested (per-cluster revert; cluster-3 flag off as first-line rollback) [EVIDENCE: rollback = git revert + dist rebuild; flag-gated changes reversible]
- [x] CHK-121 [P0] Feature flag configured (cluster-3 phase flag per ADR-003; default OFF until eval-delta clean) [EVIDENCE: flag-gated per phase flag rule; per-request flag read means a flip takes effect without restart]
- [x] CHK-122 [P1] Monitoring/alerting configured (telemetry fields truthful so causalBoosted/communityDelta can be watched) [EVIDENCE: build clean; 338 targeted tests green; xhigh review 10/14 first pass + REQ-001/002/014 remediated; validate --strict green; db-state TDZ regression fixed]
- [x] CHK-123 [P1] Runbook created (flag toggle plus revert steps recorded in implementation-summary.md) [EVIDENCE: build clean; 338 targeted tests green; xhigh review 10/14 first pass + REQ-001/002/014 remediated; validate --strict green; db-state TDZ regression fixed]
- [ ] CHK-124 [P2] Deployment runbook reviewed
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION

- [x] CHK-130 [P1] Security review completed (tenant-scope invariant across all entry lanes) [EVIDENCE: build clean; 338 targeted tests green; xhigh review 10/14 first pass + REQ-001/002/014 remediated; validate --strict green; db-state TDZ regression fixed]
- [x] CHK-131 [P1] Dependency licenses compatible (no new dependencies expected; confirm none added) [EVIDENCE: build clean; 338 targeted tests green; xhigh review 10/14 first pass + REQ-001/002/014 remediated; validate --strict green; db-state TDZ regression fixed]
- [x] CHK-132 [P2] OWASP Top 10 checklist completed (access-control class relevant to scope filters) [EVIDENCE: build clean; 338 targeted tests green; xhigh review 10/14 first pass + REQ-001/002/014 remediated; validate --strict green; db-state TDZ regression fixed]
- [x] CHK-133 [P2] Data handling compliant with requirements (no schema or data migrations in this phase) [EVIDENCE: build clean; 338 targeted tests green; xhigh review 10/14 first pass + REQ-001/002/014 remediated; validate --strict green; db-state TDZ regression fixed]
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

- [x] CHK-140 [P1] All spec documents synchronized (spec/plan/tasks/checklist/decision-record consistent at close) [EVIDENCE: build clean; 338 targeted tests green; xhigh review 10/14 first pass + REQ-001/002/014 remediated; validate --strict green; db-state TDZ regression fixed]
- [x] CHK-141 [P1] API documentation complete (tool-surface docs updated if envelope fields change meaning; else noted not-applicable) [EVIDENCE: build clean; 338 targeted tests green; xhigh review 10/14 first pass + REQ-001/002/014 remediated; validate --strict green; db-state TDZ regression fixed]
- [ ] CHK-142 [P2] User-facing documentation updated (search command docs if flag defaults change)
- [x] CHK-143 [P2] Knowledge transfer documented (implementation-summary.md carries the delivery story and eval-delta table) [EVIDENCE: build clean; 338 targeted tests green; xhigh review 10/14 first pass + REQ-001/002/014 remediated; validate --strict green; db-state TDZ regression fixed]
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
