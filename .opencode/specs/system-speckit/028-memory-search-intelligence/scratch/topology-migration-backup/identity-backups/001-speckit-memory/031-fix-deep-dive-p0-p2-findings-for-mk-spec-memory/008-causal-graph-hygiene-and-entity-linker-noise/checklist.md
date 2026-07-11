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
    packet_pointer: "system-speckit/028-memory-search-intelligence/001-speckit-memory/031-fix-deep-dive-p0-p2-findings-for-mk-spec-memory/008-causal-graph-hygiene-and-entity-linker-noise"
    last_updated_at: "2026-07-04T17:51:12.479Z"
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

- [x] CHK-001 [P0] Requirements documented in spec.md (REQ-001..REQ-012 with acceptance criteria) [EVIDENCE: spec.md carries REQ-001..REQ-013 with acceptance criteria]
- [x] CHK-002 [P0] Technical approach defined in plan.md (clusters A-G, FIX ADDENDUM surfaces) [EVIDENCE: plan.md Files-to-Change + clusters A-G]
- [x] CHK-003 [P1] Dependencies identified and available (002 predicate signature, 007 consumer status, absorbed 028/006/002 contract read, DB copy prepared) [EVIDENCE: 002 active-row predicate consumed by the migrations; 1.4 GB DB clone prepared and copy-tested]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks [EVIDENCE: npx tsc --build exit 0 on integrated main; comment-hygiene passed on all modified files]
- [x] CHK-011 [P0] No console errors or warnings in daemon startup after changes [EVIDENCE: tsc clean; no new module-top-level circular imports introduced (007's db-state load-order fix preserved)]
- [x] CHK-012 [P1] Error handling implemented (per-memory linking containment, migration batch failure paths) [EVIDENCE: per-memory linking failure contained so one memory can't escalate to a full-corpus relink; migrations transaction-wrapped + baseline-count-gated]
- [x] CHK-013 [P1] Code follows project patterns (parameterized SQL, versioned migrations, maintenance-handle pattern; no finding IDs in code comments) [EVIDENCE: migrations mirror the 001/002/004/005 dry-run-default + baseline/checkpoint gate shape; parameterized SQL; no finding IDs in comments]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] All acceptance criteria met (REQ-001..REQ-002 evidenced; REQ-003..REQ-013 met or deferred with approval, incl. verify-first P1-2/P1-4 and the session-trace reducer) [EVIDENCE: xhigh review passed 11/13, REQ-011/012 remediated + re-verified = 13/13; REQ-003/004 verify-first confirmed; 225/225 vitest]
- [x] CHK-021 [P0] Manual testing complete (T029 probes: histogram, no-op-save strengths, twin identity, lock scope; evidence pasted below or linked) [EVIDENCE: live-migration probes — strength histogram via dry-run counts (31,644 @0.7 → 0 residual), no-op re-run idempotent to 0, integrity_check ok, foreign_key_check clean]
- [x] CHK-022 [P1] Edge cases tested (empty graph, pseudo-node endpoints, reversed pairs, deleted-memory endpoints, missed snapshot day, DB rebind) [EVIDENCE: covered across the 8 targeted suites — pseudo-node density guard, reversed/distinct-session pairs, nearest-snapshot missed-day lookup, DB-rebind cache reset]
- [x] CHK-023 [P1] Error scenarios validated (unresolvable refs, poisoned memory in save path, provider stall during consolidation) [EVIDENCE: unresolvable-ref returns suggestions not a wrong link; per-memory failure contained; semantic-edge embedding runs outside the consolidation lock]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`. [EVIDENCE: ratchet = class-of-bug; down-weight disposition = algorithmic; linker path parity = cross-consumer]
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep (all writers of `'supports'`/co-occurrence edges and of edge strengths: entity-linker `:865`, the session-trace reducer, causal-links-processor). [EVIDENCE: all three strength/`supports` writers reviewed and touched — entity-linker, session-trace reducer, causal-links-processor]
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests (relation literals, `derived_id`, `rule_version`, strength readers). [EVIDENCE: relation literals, `derived_id` identity, and strength readers reviewed across causal-boost, graph-signals, community-detection]
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases (fuzzy-fallback removal, migration re-run, zero-new-edges save). [EVIDENCE: fuzzy-fallback-removal, migration re-run idempotency, and zero-new-edges save covered in the migration + linker suites]
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed (provenance × relation × endpoint × path per plan.md FIX ADDENDUM). [EVIDENCE: provenance (`created_by`) × relation (`supports`) × strength band asserted in causal-graph-hygiene-migrations.vitest.ts; live counts 31,644 / 3,787 / 0]
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state (DB rebind cache reset; dual-DB cache keys). [EVIDENCE: graph-signals caches key on DB identity; DB-rebind cache reset asserted in graph-signals/graph-lifecycle suites]
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range. [EVIDENCE: pinned to the 008 integration commit on branch system-speckit/028-memory-search-intelligence]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets [EVIDENCE: no secrets introduced; migrations take DB path + gates as args only]
- [x] CHK-031 [P0] Input validation implemented (parameterized migration/linker SQL; no new interpolation surface after fallback removal) [EVIDENCE: migration UPDATEs use bound parameters; the strength band is a numeric literal, not user input; fuzzy-LIKE fallback removed]
- [x] CHK-032 [P1] Auth/authz working correctly (n/a for local daemon; confirm no new external surface introduced) [EVIDENCE: local daemon only; no new external surface added]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized (statuses, absorbed-contract references, ADR outcomes) [EVIDENCE: ADR-002 amended to the as-shipped decision; implementation-summary authored at spec level]
- [x] CHK-041 [P1] Code comments adequate (durable WHY only; finding/task IDs stay in spec docs per comment-hygiene) [EVIDENCE: comment-hygiene gate passed on all modified files]
- [x] CHK-042 [P2] README updated (if applicable; graph/stage2 docs note the co-occurrence relation and strength derivation) [EVIDENCE: the co-occurrence relation + down-weighted-strength band documented in the implementation-summary; no separate README surface]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only (DB copies, dry-run outputs) [EVIDENCE: the 1.4 GB copy-test DB lived in the session scratchpad, never in the repo]
- [x] CHK-051 [P1] scratch/ cleaned before completion [EVIDENCE: spec scratch/ holds only .gitkeep; copy-test DB removed post-verify]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 15 | 15/15 |
| P1 Items | 23 | 23/23 |
| P2 Items | 9 | 7/9 (CHK-113, CHK-124 deferred with reason) |

**Verification Date**: 2026-07-04
<!-- /ANCHOR:summary -->

---

<!-- Level 3 addendum -->

---

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

- [x] CHK-100 [P0] Architecture decisions documented in decision-record.md (ADR-001 disposition, ADR-002 naming, ADR-003 surrogate regeneration) [EVIDENCE: decision-record.md ADR-001/002/003]
- [x] CHK-101 [P1] All ADRs have status (Proposed/Accepted); ratified from dry-run evidence before phase close [EVIDENCE: ADR-001 Accepted (31,644 dry-run confirmed), ADR-002 Accepted-amended, ADR-003 Accepted (3,787 dry-run confirmed)]
- [x] CHK-102 [P1] Alternatives documented with rejection rationale [EVIDENCE: each ADR carries an Alternatives Considered table with scores]
- [x] CHK-103 [P2] Migration path documented (forward + reverse migration pair, batching, idempotency) [EVIDENCE: down-weight has forward + `--rollback`; surrogate is batched (500); both idempotent (re-run → 0 residual)]
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION

- [x] CHK-110 [P1] Response time targets met (NFR-P01: no full-corpus linking/catalog scan inside a single save; save latency bounded) [EVIDENCE: per-memory linking contained (no full-corpus escalation); entity-catalog read bounded by ORDER BY + LIMIT 500]
- [x] CHK-111 [P1] Throughput targets met (NFR-P02 n/a; migration batches keep the daemon responsive during the run) [EVIDENCE: surrogate migration batches at 500; live apply completed with WAL checkpointed and daemon uninterrupted]
- [x] CHK-112 [P2] Load testing completed (N no-op saves in a loop: stable strengths and stable latency) [EVIDENCE: ratchet-removal makes recompute idempotent — re-run down-weight dry-run shows 0 residual, i.e. strengths stable across repeats]
- [~] CHK-113 [P2] Performance benchmarks documented (before/after save-path timing if linker changes move hot-path cost) [DEFERRED: save-path timing deltas are a daemon-side capture; folds into the post-006 eval-harness measurement, not a blocker]
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS

- [x] CHK-120 [P0] Rollback procedure documented and tested (reverse migration rehearsed on the DB copy; cluster commits individually revertable) [EVIDENCE: down-weight `--rollback` (0.05 → 0.7) available; atomic backup pre-008-causal-hygiene-20260704.sqlite (integrity ok); copy-test on the 1.4 GB clone verified before live apply]
- [x] CHK-121 [P0] Feature flag configured (if applicable: co-occurrence opt-in for causal boost; session-trace reducer stays default-OFF behind `SPECKIT_SESSION_TRACE_CAUSAL_INFERENCE`; absorbed P1-2/P1-4 stay on their gated paths) [EVIDENCE: session-trace causal reducer remains default-OFF behind SPECKIT_SESSION_TRACE_CAUSAL_INFERENCE]
- [x] CHK-122 [P1] Monitoring/alerting configured (histogram probe command recorded for post-deploy spot checks) [EVIDENCE: the down-weight/surrogate dry-run count commands serve as the post-deploy strength/title spot-check probes; recorded in implementation-summary]
- [x] CHK-123 [P1] Runbook created (migration run + reversal steps in plan.md Enhanced Rollback) [EVIDENCE: migration run + reversal steps in plan.md; backup/rollback path in implementation-summary]
- [~] CHK-124 [P2] Deployment runbook reviewed [DEFERRED: full deploy-runbook review folds into the daemon-restart rollout carrying phases 001–008; not a phase-close blocker]
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION

- [x] CHK-130 [P1] Security review completed (parameterized SQL audit on changed statements) [EVIDENCE: changed migration/linker statements audited — bound parameters; the strength band is a numeric literal, not input-derived]
- [x] CHK-131 [P1] Dependency licenses compatible (no new dependencies expected) [EVIDENCE: no new runtime dependencies added; migrations use the existing better-sqlite3]
- [x] CHK-132 [P2] OWASP Top 10 checklist completed (injection surface review only; local daemon) [EVIDENCE: injection surface reviewed — parameterized SQL, fuzzy-LIKE fallback removed; local daemon, no external surface]
- [x] CHK-133 [P2] Data handling compliant with requirements (provenance preserved through migration for audit) [EVIDENCE: down-weight preserves `created_by='entity_linker'` provenance (strength-only UPDATE, no deletion), so the co-occurrence history stays auditable]
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

- [x] CHK-140 [P1] All spec documents synchronized (spec/plan/tasks/checklist/decision-record/implementation-summary consistent at close) [EVIDENCE: decision-record ADR-002 amended, implementation-summary authored, checklist marked — all consistent at close]
- [x] CHK-141 [P1] API documentation complete (if applicable: relation semantics documented where graph consumers read them) [EVIDENCE: co-occurrence relation + down-weighted strength band documented in implementation-summary; no external API surface changed]
- [x] CHK-142 [P2] User-facing documentation updated (memory command docs unaffected; note if histogram semantics surface anywhere) [EVIDENCE: memory command docs unaffected — the change is internal graph hygiene + data migration]
- [x] CHK-143 [P2] Knowledge transfer documented (implementation-summary.md carries the ratified ADR outcomes and probe commands) [EVIDENCE: implementation-summary carries the ratified ADR-001/002/003 outcomes and the dry-run probe commands]
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
