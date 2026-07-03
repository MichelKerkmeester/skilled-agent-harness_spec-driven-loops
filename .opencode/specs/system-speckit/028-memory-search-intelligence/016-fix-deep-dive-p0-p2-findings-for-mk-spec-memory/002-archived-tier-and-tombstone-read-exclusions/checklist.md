---
title: "Verification Checklist: Phase 2: archived-tier-and-tombstone-read-exclusions"
description: "P0/P1/P2 verification gates with evidence slots for the shared active-row predicate, archived tier, tombstone visibility, tier hygiene migrations, and stats/health split."
trigger_phrases:
  - "archived tier exclusion"
  - "tombstone read filter"
  - "deprecated rows ranking"
  - "predicate verification checklist"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "scaffold/002-archived-tier-and-tombstone-read-exclusions"
    last_updated_at: "2026-07-03T13:30:00Z"
    last_updated_by: "plan-remediation"
    recent_action: "Remediated REWORK: added CHK-006 logic-sync gate and widened CHK-020 to REQ-000"
    next_safe_action: "Fill evidence slots as tasks complete; no [x] without evidence"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/002-archived-tier-and-tombstone-read-exclusions"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Phase 2: archived-tier-and-tombstone-read-exclusions

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

Evidence slots: every item carries an `Evidence:` line. Fill it with a test name + result, an rg/SQL command + output, or a file:line quote before checking the box.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Requirements documented in spec.md (REQ-001..REQ-010 with report/ledger refs)
  Evidence: pending (spec.md §4 review note)
- [ ] CHK-002 [P0] Technical approach defined in plan.md (predicate module + ten call sites + audited migrations)
  Evidence: pending (plan.md §3 + FIX ADDENDUM review note)
- [ ] CHK-003 [P1] Dependencies identified and available (phases 011/001 ordering; migration registry; fixture DB)
  Evidence: pending (plan.md §6 status column re-check)
- [ ] CHK-004 [P0] 🟡 confirm-before-fix group executed BEFORE any code change (T-001..T-005), each finding confirmed or downgraded with a quoted line
  Evidence: pending (per-task confirmation quotes in tasks.md)
- [ ] CHK-005 [P0] Baseline captured BEFORE changes: vitest counts, SQL population counts, latency, reproduction-query outputs (T-006)
  Evidence: pending (scratch/baseline/ artifact paths + capture date)
- [ ] CHK-006 [P0] Logic-sync decision recorded BEFORE predicate adoption (REQ-000/T-004a): sqlite-fts.ts:186-188 and hybrid-search.ts:560-566 re-read as already-filtering-deprecated, `isArchivedRetrievalIncludedByDefault` (search-flags.ts:834) confirmed default-TRUE graduated, and an explicit keep-graduated-vs-hard-exclude decision written; the predicate's cold-inclusion default matches it (no silent reversal)
  Evidence: pending (decision text + file:line quotes in tasks.md T-004a)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Code passes lint/format checks (tsc build clean, repo lint)
  Evidence: pending (build/lint command + exit code)
- [ ] CHK-011 [P0] No console errors or warnings in daemon startup after changes
  Evidence: pending (daemon start log excerpt)
- [ ] CHK-012 [P1] Error handling implemented (predicate module rejects unknown lane values; migrations abort on audit-write failure)
  Evidence: pending (test names covering failure paths)
- [ ] CHK-013 [P1] Code follows project patterns (predicate module mirrors existing lib/search module conventions; migrations follow the v28-style registry pattern)
  Evidence: pending (reviewer note + file refs)
- [ ] CHK-014 [P0] No ephemeral spec/packet/finding ids in code comments (comment-hygiene HARD BLOCK); finding refs live in tasks.md only
  Evidence: pending (rg for finding-id patterns over touched files, 0 hits)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] All acceptance criteria met (REQ-000..REQ-005 P0 rows verified individually)
  Evidence: pending (per-REQ test names + results)
- [ ] CHK-021 [P0] Manual testing complete: report §1 reproduction queries return 0 deprecated/archived rows; delete-then-search returns nothing; restore preserves edges
  Evidence: pending (CLI probe transcripts)
- [ ] CHK-022 [P1] Edge cases tested: NULL tier, mixed-case tier, archived+tombstoned, tombstoned constitutional, includeArchived widening (spec.md §8)
  Evidence: pending (matrix test rows referenced)
- [ ] CHK-023 [P1] Error scenarios validated: empty candidate lists post-exclusion degrade normally; migration rollback restores audit values exactly
  Evidence: pending (test names + rollback dry-run output)
- [ ] CHK-024 [P0] Whole vitest gate re-run after changes; delta vs baseline reported (not a subset run)
  Evidence: pending (before/after counts + delta note)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`. (Channel-inconsistent exclusion = cross-consumer; tier raw store = class-of-bug; parser substring = class-of-bug; tombstone visibility = cross-consumer.)
  Evidence: pending (classification table in implementation-summary.md)
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed: rg over deprecated/is_archived/includeArchived/deleted_at literals shows no surviving ad-hoc exclusion predicate outside the shared module
  Evidence: pending (rg command from plan FIX ADDENDUM + output)
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers/policies: ACTIVE_ROW_SQL/isActiveRow consumers list exactly the ten channels + stats/health + tests; delete-handler callers reviewed for the edge-preservation change
  Evidence: pending (rg output + caller review note)
- [ ] CHK-FIX-004 [P0] Adversarial table tests exist for the predicate (delimiter/no-op/fallback classes): mixed-case tier, NULL tier, archived+tombstoned, constitutional lane, includeArchived widening, restore-after-tombstone
  Evidence: pending (test file + row count)
- [ ] CHK-FIX-005 [P1] Matrix axes and row count listed before completion: channel (10) x row-state (8) = 80 rows planned in T-021
  Evidence: pending (matrix table reference)
- [ ] CHK-FIX-006 [P1] Hostile env/global-state variant executed where code reads process-wide state (DB rebind: predicate module is pure; verify channels keep identical semantics after rebindDatabaseConsumers)
  Evidence: pending (rebind test name + result)
- [ ] CHK-FIX-007 [P1] Evidence pinned to a fix SHA or explicit diff range, not a moving branch-relative range
  Evidence: pending (commit SHAs listed)
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets in touched files
  Evidence: pending (rg secret-pattern scan over diff, 0 hits)
- [ ] CHK-031 [P0] Input validation implemented: tier values validated against VALID_TIERS post-normalization; includeArchived boolean-coerced
  Evidence: pending (validation test names)
- [ ] CHK-032 [P1] Tombstoned row content never leaves the DB via any channel payload incl. rescue hydration and trigger snippets (NFR-S01)
  Evidence: pending (payload assertion test names)
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized (REQ ids, task ids, surface table consistent)
  Evidence: pending (cross-doc review note)
- [ ] CHK-041 [P1] Code comments adequate: predicate module documents the invariant and the constitutional/tombstone lane rule (durable WHY only)
  Evidence: pending (module doc-comment quote)
- [ ] CHK-042 [P2] Stats/health payload population note visible to users (README/tool description if applicable; definitions doc owned by phase 011)
  Evidence: deferred candidate - document reason if not done this phase
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in scratch/ only (baseline artifacts under scratch/baseline/)
  Evidence: pending (ls output)
- [ ] CHK-051 [P1] scratch/ cleaned before completion (baseline artifacts either promoted into implementation-summary.md or explicitly retained with reason)
  Evidence: pending (cleanup note)
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 17 | 0/17 |
| P1 Items | 13 | 0/13 |
| P2 Items | 4 | 0/4 |

**Verification Date**: pending (set when verification runs)
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

- [ ] CHK-100 [P0] Architecture decisions documented in decision-record.md (ADR-001..ADR-004)
  Evidence: pending (decision-record.md review)
- [ ] CHK-101 [P1] All ADRs have status (Proposed/Accepted)
  Evidence: pending (status column check)
- [ ] CHK-102 [P1] Alternatives documented with rejection rationale (per ADR alternatives table)
  Evidence: pending (per-ADR check)
- [ ] CHK-103 [P2] Migration path documented (z_archive rewrite, case normalization, substring retro-fix incl. rollback)
  Evidence: pending (plan.md L2 Enhanced Rollback + ADR-003/ADR-004 refs)
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION

- [ ] CHK-110 [P1] Response time target met: warm memory_search p50 within +10% of baseline (NFR-P01)
  Evidence: pending (before/after latency numbers)
- [ ] CHK-111 [P1] Migration batching keeps daemon responsive (NFR-P02: <=1,000 rows/transaction)
  Evidence: pending (migration run log)
- [ ] CHK-112 [P2] Load testing completed (not planned this phase; hot-path perf owned by phase 010)
  Evidence: deferred - phase 010 scope
- [ ] CHK-113 [P2] Performance benchmarks documented (baseline + delta table in implementation-summary.md)
  Evidence: pending (table reference)
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS

- [ ] CHK-120 [P0] Rollback procedure documented and tested (audit-trail restore script dry-run on fixture DB)
  Evidence: pending (dry-run output)
- [ ] CHK-121 [P0] Feature flag posture confirmed: exclusion fixes ship default-ON per program flag rule (fixes to default-ON behavior ship direct); tombstone mode remains opt-in flag
  Evidence: pending (flag table + program rule quote)
- [ ] CHK-122 [P1] Monitoring: stats/health split gives a standing reconciliation probe (active + excluded = raw)
  Evidence: pending (reconciliation SQL + output)
- [ ] CHK-123 [P1] Runbook: rollback + audit-restore steps written in plan.md L2 Enhanced Rollback
  Evidence: pending (section reference)
- [ ] CHK-124 [P2] Deployment runbook reviewed by operator
  Evidence: pending (review note)
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION

- [ ] CHK-130 [P1] Security review completed (tombstone content leakage assertions; no new injection surface in SQL fragment composition)
  Evidence: pending (review note + test names)
- [ ] CHK-131 [P1] Dependency licenses compatible (no new dependencies planned)
  Evidence: pending (confirm no package.json change)
- [ ] CHK-132 [P2] OWASP Top 10 checklist completed (limited applicability: SQL composed from constants, no user-controlled fragments)
  Evidence: deferred with reason if unchanged
- [ ] CHK-133 [P2] Data handling compliant: tier audit trail contains ids and tiers only, no content
  Evidence: pending (audit schema quote)
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

- [ ] CHK-140 [P1] All spec documents synchronized (validate.sh --strict exit 0)
  Evidence: pending (command + exit code)
- [ ] CHK-141 [P1] Tool documentation updated where behavior changed (includeArchived param, memory_update archived tier)
  Evidence: pending (doc diff refs)
- [ ] CHK-142 [P2] User-facing documentation updated (command docs; envelope presentation owned by phase 012)
  Evidence: deferred candidate - document reason if out of scope
- [ ] CHK-143 [P2] Knowledge transfer documented (implementation-summary.md continuation notes)
  Evidence: pending (summary reference)
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: SIGN-OFF

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Michel Kerkmeester | Technical Lead | [ ] Approved | |
| Michel Kerkmeester | Product Owner | [ ] Approved | |
| AI executor (self-check) + operator review | QA Lead | [ ] Approved | |
<!-- /ANCHOR:sign-off -->

---

<!--
Level 3 checklist - Full verification + architecture
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
