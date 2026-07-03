---
title: "Verification Checklist: Phase 3: content-hash-normalization-and-save-dedup-lanes [template:level_3/checklist.md]"
description: "Pre-implementation verification checklist covering content-hash normalization, save dedup lane gating, PE-gate lane reachability, the P0 full-auto canonical save fix, and baseline-before-delta test evidence."
trigger_phrases:
  - "content hash normalization checklist"
  - "save dedup lanes verification"
  - "snapshot churn supersede checks"
  - "parity tests un-skip evidence"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/016-fix-deep-dive-p0-p2-findings-for-mk-spec-memory/003-content-hash-normalization-and-save-dedup-lanes"
    last_updated_at: "2026-07-03T12:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored Level 3 planning docs (spec, plan, tasks, checklist, decision-record)"
    next_safe_action: "Run T001 confirm-before-fix probes and T002 vitest baseline before any code change"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/tests/memory-save-integration.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/003-content-hash-normalization-and-save-dedup-lanes"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Phase 3: content-hash-normalization-and-save-dedup-lanes

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

- [ ] CHK-001 [P0] Requirements documented in spec.md (REQ-001..REQ-009 with report/ledger refs)
- [ ] CHK-002 [P0] Technical approach defined in plan.md (FIX ADDENDUM inventories + phases + testing + rollback)
- [ ] CHK-003 [P1] Dependencies identified and available (phase 002 predicate status; migration registry slot)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Code passes lint/format checks (`mcp_server` tsc build clean)
- [ ] CHK-011 [P0] No console errors or warnings in save-path probes
- [ ] CHK-012 [P1] Error handling implemented (atomic failure injection paths still roll back cleanly)
- [ ] CHK-013 [P1] Code follows project patterns (migration follows v28-style registry pattern; no finding IDs in code comments)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] All acceptance criteria met (REQ-001..REQ-007 Given/When/Then verified with test names)
- [ ] CHK-021 [P0] Manual testing complete (T023 live probes recorded)
- [ ] CHK-022 [P1] Edge cases tested (normalization adversarial table: CRLF-in-fence, fingerprint-shaped body line, no continuity block, empty content)
- [ ] CHK-023 [P1] Error scenarios validated (recon disabled, force=true, tombstoned predecessor, atomic failure injection)
- [ ] CHK-024 [P0] SC-001: re-save of unchanged file returns `unchanged` with no new row and no predecessor retirement (live probe output attached)
- [ ] CHK-025 [P0] SC-002: edited same-path re-save routes UPDATE/REINFORCE with the predecessor as target (test + live probe)
- [ ] CHK-026 [P0] SC-005: full-auto canonical save completes without POST_SAVE_FINGERPRINT self-reject; `planner-first and fallback parity` block un-skipped (no `describe.skip` at memory-save-integration.vitest.ts:526) and green
- [ ] CHK-027 [P0] SC-003: continuity-timestamp-only churn produces zero new `tier='deprecated'` snapshots (row-count evidence before/after probe)
- [ ] CHK-028 [P1] SC-004: "packet 028 memory search intelligence status" query returns one row per logical doc from the save/dedup side (pipeline collapse test + live query)
- [ ] CHK-029 [P1] SC-006 baseline-before-delta: T002 baseline numbers AND post-change full-gate numbers both recorded; delta reported (no bare "no regressions" claim)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`.
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep (sha256 producers beyond memory-parser.ts:914).
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests (`computeContentHash`, `buildContinuityFingerprint`, `canonicalResultId`, exclusion params).
- [ ] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases (normalization must not rewrite body text resembling continuity lines).
- [ ] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed (16 pairwise rows from plan.md).
- [ ] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state (planner-mode env resolution in `resolveSavePlannerMode`).
- [ ] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets
- [ ] CHK-031 [P0] Input validation implemented (normalization scoped to the frontmatter continuity block only; empty-content handling unchanged)
- [ ] CHK-032 [P1] Auth/authz working correctly (tenant/user/agent scope params preserved in the modified `findSimilarMemories` call)
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized (REQ ↔ T ↔ ADR cross-references intact after implementation)
- [ ] CHK-041 [P1] Code comments adequate (durable WHY only; no packet/finding IDs)
- [ ] CHK-042 [P2] README updated (if applicable; save_workflow doc note if lane semantics change user-visibly)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in scratch/ only (t001-confirmations, t003-inventories, probe outputs)
- [ ] CHK-051 [P1] scratch/ cleaned before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 19 | 0/19 |
| P1 Items | 25 | 0/25 |
| P2 Items | 9 | 0/9 |

**Verification Date**: Pending (phase not yet implemented)
<!-- /ANCHOR:summary -->

---

<!-- Append to Level 2 checklist.md -->

---

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

- [ ] CHK-100 [P0] Architecture decisions documented in decision-record.md (ADR-001..ADR-003)
- [ ] CHK-101 [P1] All ADRs have status (Proposed/Accepted)
- [ ] CHK-102 [P1] Alternatives documented with rejection rationale
- [ ] CHK-103 [P2] Migration path documented (dual-compare window and its retirement condition)
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION

- [ ] CHK-110 [P1] Response time targets met (NFR-P01: normalization <1ms per document hash; save-path latency unchanged vs baseline)
- [ ] CHK-111 [P1] Throughput targets met (no full-corpus re-hash at migration time; scan throughput unchanged)
- [ ] CHK-112 [P2] Load testing completed (bulk re-save probe over a large spec folder)
- [ ] CHK-113 [P2] Performance benchmarks documented (before/after save-probe timings)
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS

- [ ] CHK-120 [P0] Rollback procedure documented and tested (`git revert` + dist rebuild; dual-compare is read-side so no data repair)
- [ ] CHK-121 [P0] Feature flag configured (not applicable — fixes to default-ON behavior ship direct per program cross-cutting rules; recorded as N/A with reason)
- [ ] CHK-122 [P1] Monitoring/alerting configured (save-result statuses observable in daemon logs; deprecated-row count probe scripted)
- [ ] CHK-123 [P1] Runbook created (T023 live-probe commands recorded in implementation-summary.md)
- [ ] CHK-124 [P2] Deployment runbook reviewed
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION

- [ ] CHK-130 [P1] Security review completed (normalization scope + injection surface unchanged)
- [ ] CHK-131 [P1] Dependency licenses compatible (no new dependencies expected)
- [ ] CHK-132 [P2] OWASP Top 10 checklist completed (N/A for local save path; record reason)
- [ ] CHK-133 [P2] Data handling compliant with requirements (no destructive migration; stored bytes untouched)
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

- [ ] CHK-140 [P1] All spec documents synchronized
- [ ] CHK-141 [P1] API documentation complete (memory_save result statuses: `unchanged`, dedup/tombstone visibility fields)
- [ ] CHK-142 [P2] User-facing documentation updated (save_workflow reference if result semantics change)
- [ ] CHK-143 [P2] Knowledge transfer documented (implementation-summary.md continuation notes)
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: SIGN-OFF

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Michel Kerkmeester | Technical Lead | [ ] Approved | |
| Michel Kerkmeester | Product Owner | [ ] Approved | |
| Deep-review agent (per program rules) | QA Lead | [ ] Approved | |
<!-- /ANCHOR:sign-off -->

---

<!--
Level 3 checklist - Full verification + architecture
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
