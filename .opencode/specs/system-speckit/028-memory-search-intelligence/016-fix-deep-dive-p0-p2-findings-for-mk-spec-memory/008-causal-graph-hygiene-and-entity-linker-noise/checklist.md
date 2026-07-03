---
title: "Verification Checklist: Phase 8: causal-graph-hygiene-and-entity-linker-noise"
description: "Level 3 verification gates for the causal-graph hygiene phase: fix completeness, migration evidence, architecture ADRs, and deployment/rollback readiness."
trigger_phrases:
  - "causal graph hygiene verification"
  - "entity linker noise checklist"
  - "edge ratchet verification"
  - "cooccurrence migration evidence"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/016-fix-deep-dive-p0-p2-findings-for-mk-spec-memory/008-causal-graph-hygiene-and-entity-linker-noise"
    last_updated_at: "2026-07-03T13:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Remediated REWORK: CHK-020 verify-first P1-2/P1-4, session-trace producer + flag updates"
    next_safe_action: "Execute tasks.md Phase 1 before checking any item"
    blockers: []
    key_files:
      - "checklist.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-03-028-016-008-planning-authoring"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Phase 8: causal-graph-hygiene-and-entity-linker-noise

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

- [ ] CHK-001 [P0] Requirements documented in spec.md (REQ-001..REQ-012 with acceptance criteria)
- [ ] CHK-002 [P0] Technical approach defined in plan.md (clusters A-G, FIX ADDENDUM surfaces)
- [ ] CHK-003 [P1] Dependencies identified and available (002 predicate signature, 007 consumer status, absorbed 028/006/002 contract read, DB copy prepared)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Code passes lint/format checks
- [ ] CHK-011 [P0] No console errors or warnings in daemon startup after changes
- [ ] CHK-012 [P1] Error handling implemented (per-memory linking containment, migration batch failure paths)
- [ ] CHK-013 [P1] Code follows project patterns (parameterized SQL, versioned migrations, maintenance-handle pattern; no finding IDs in code comments)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] All acceptance criteria met (REQ-001..REQ-002 evidenced; REQ-003..REQ-013 met or deferred with approval, incl. verify-first P1-2/P1-4 and the session-trace reducer)
- [ ] CHK-021 [P0] Manual testing complete (T029 probes: histogram, no-op-save strengths, twin identity, lock scope; evidence pasted below or linked)
- [ ] CHK-022 [P1] Edge cases tested (empty graph, pseudo-node endpoints, reversed pairs, deleted-memory endpoints, missed snapshot day, DB rebind)
- [ ] CHK-023 [P1] Error scenarios validated (unresolvable refs, poisoned memory in save path, provider stall during consolidation)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`.
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep (all writers of `'supports'`/co-occurrence edges and of edge strengths: entity-linker `:865`, the session-trace reducer, causal-links-processor).
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests (relation literals, `derived_id`, `rule_version`, strength readers).
- [ ] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases (fuzzy-fallback removal, migration re-run, zero-new-edges save).
- [ ] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed (provenance × relation × endpoint × path per plan.md FIX ADDENDUM).
- [ ] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state (DB rebind cache reset; dual-DB cache keys).
- [ ] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets
- [ ] CHK-031 [P0] Input validation implemented (parameterized migration/linker SQL; no new interpolation surface after fallback removal)
- [ ] CHK-032 [P1] Auth/authz working correctly (n/a for local daemon; confirm no new external surface introduced)
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized (statuses, absorbed-contract references, ADR outcomes)
- [ ] CHK-041 [P1] Code comments adequate (durable WHY only; finding/task IDs stay in spec docs per comment-hygiene)
- [ ] CHK-042 [P2] README updated (if applicable; graph/stage2 docs note the co-occurrence relation and strength derivation)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in scratch/ only (DB copies, dry-run outputs)
- [ ] CHK-051 [P1] scratch/ cleaned before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 15 | 0/15 |
| P1 Items | 23 | 0/23 |
| P2 Items | 9 | 0/9 |

**Verification Date**: Pending (set at phase close)
<!-- /ANCHOR:summary -->

---

<!-- Level 3 addendum -->

---

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

- [ ] CHK-100 [P0] Architecture decisions documented in decision-record.md (ADR-001 disposition, ADR-002 naming, ADR-003 surrogate regeneration)
- [ ] CHK-101 [P1] All ADRs have status (Proposed/Accepted); ratified from dry-run evidence before phase close
- [ ] CHK-102 [P1] Alternatives documented with rejection rationale
- [ ] CHK-103 [P2] Migration path documented (forward + reverse migration pair, batching, idempotency)
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION

- [ ] CHK-110 [P1] Response time targets met (NFR-P01: no full-corpus linking/catalog scan inside a single save; save latency bounded)
- [ ] CHK-111 [P1] Throughput targets met (NFR-P02 n/a; migration batches keep the daemon responsive during the run)
- [ ] CHK-112 [P2] Load testing completed (N no-op saves in a loop: stable strengths and stable latency)
- [ ] CHK-113 [P2] Performance benchmarks documented (before/after save-path timing if linker changes move hot-path cost)
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS

- [ ] CHK-120 [P0] Rollback procedure documented and tested (reverse migration rehearsed on the DB copy; cluster commits individually revertable)
- [ ] CHK-121 [P0] Feature flag configured (if applicable: co-occurrence opt-in for causal boost; session-trace reducer stays default-OFF behind `SPECKIT_SESSION_TRACE_CAUSAL_INFERENCE`; absorbed P1-2/P1-4 stay on their gated paths)
- [ ] CHK-122 [P1] Monitoring/alerting configured (histogram probe command recorded for post-deploy spot checks)
- [ ] CHK-123 [P1] Runbook created (migration run + reversal steps in plan.md Enhanced Rollback)
- [ ] CHK-124 [P2] Deployment runbook reviewed
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION

- [ ] CHK-130 [P1] Security review completed (parameterized SQL audit on changed statements)
- [ ] CHK-131 [P1] Dependency licenses compatible (no new dependencies expected)
- [ ] CHK-132 [P2] OWASP Top 10 checklist completed (injection surface review only; local daemon)
- [ ] CHK-133 [P2] Data handling compliant with requirements (provenance preserved through migration for audit)
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

- [ ] CHK-140 [P1] All spec documents synchronized (spec/plan/tasks/checklist/decision-record/implementation-summary consistent at close)
- [ ] CHK-141 [P1] API documentation complete (if applicable: relation semantics documented where graph consumers read them)
- [ ] CHK-142 [P2] User-facing documentation updated (memory command docs unaffected; note if histogram semantics surface anywhere)
- [ ] CHK-143 [P2] Knowledge transfer documented (implementation-summary.md carries the ratified ADR outcomes and probe commands)
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: SIGN-OFF

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Michel Kerkmeester | Technical Lead | [ ] Approved | |
| Michel Kerkmeester | Product Owner | [ ] Approved | |
| Executing seat (AI) | QA Lead | [ ] Approved | |
<!-- /ANCHOR:sign-off -->

---

<!--
Level 3 checklist - Full verification + architecture
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
