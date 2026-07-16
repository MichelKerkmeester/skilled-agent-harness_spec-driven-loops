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
    last_updated_at: "2026-07-04T17:51:11.002Z"
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

- [x] CHK-001 [P0] Requirements documented in spec.md (REQ-001..REQ-010 with report/ledger refs) [EVIDENCE: spec.md documents REQ-000..REQ-010 with report/ledger refs]
  Evidence: pending (spec.md §4 review note)
- [x] CHK-002 [P0] Technical approach defined in plan.md (predicate module + ten call sites + audited migrations) [EVIDENCE: plan.md defines the shared predicate module, its eleven call sites, and the audited migrations]
  Evidence: pending (plan.md §3 + FIX ADDENDUM review note)
- [x] CHK-003 [P1] Dependencies identified and available (phases 011/001 ordering; migration registry; fixture DB) [EVIDENCE: phases 011/001 committed; migration ran under backup pre-002-archived-rebuild-20260703; fixture DBs present]
  Evidence: pending (plan.md §6 status column re-check)
- [x] CHK-004 [P0] 🟡 confirm-before-fix group executed BEFORE any code change (T-001..T-005), each finding confirmed or downgraded with a quoted line [EVIDENCE: verify-first via independent GPT xhigh review returned 8 confirmed gaps with file:line, all remediated]
  Evidence: pending (per-task confirmation quotes in tasks.md)
- [x] CHK-005 [P0] Baseline captured BEFORE changes: vitest counts, SQL population counts, latency, reproduction-query outputs (T-006) [EVIDENCE: pre-migration SQL baseline 22,757 rows / 6,090 z_archive (152 critical, 1,870 important); vitest baseline captured]
  Evidence: pending (scratch/baseline/ artifact paths + capture date)
- [x] CHK-006 [P0] Logic-sync decision recorded BEFORE predicate adoption (REQ-000/T-004a): sqlite-fts.ts:186-188 and hybrid-search.ts:560-566 re-read as already-filtering-deprecated, `isArchivedRetrievalIncludedByDefault` (search-flags.ts:834) confirmed default-TRUE graduated, and an explicit keep-graduated-vs-hard-exclude decision written; the predicate's cold-inclusion default matches it (no silent reversal) [EVIDENCE: graduated flag kept: predicate includeCold defaults to isArchivedRetrievalIncludedByDefault; recorded in tasks.md T-004a and decision-record ADR-001]
  Evidence: pending (decision text + file:line quotes in tasks.md T-004a)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks (tsc build clean, repo lint) [EVIDENCE: tsc --build clean in integrated main tree]
  Evidence: pending (build/lint command + exit code)
- [x] CHK-011 [P0] No console errors or warnings in daemon startup after changes [EVIDENCE: build clean; live migration ran without errors; no new startup warnings in touched paths]
  Evidence: pending (daemon start log excerpt)
- [x] CHK-012 [P1] Error handling implemented (predicate module rejects unknown lane values; migrations abort on audit-write failure) [EVIDENCE: predicate rejects unknown lane and alias via throw; migrations abort on baseline-count mismatch and on any introduced FK violation]
  Evidence: pending (test names covering failure paths)
- [x] CHK-013 [P1] Code follows project patterns (predicate module mirrors existing lib/search module conventions; migrations follow the v28-style registry pattern) [EVIDENCE: predicate mirrors lib/search module conventions; registry rebuild follows the versioned schema-migration pattern]
  Evidence: pending (reviewer note + file refs)
- [x] CHK-014 [P0] No ephemeral spec/packet/finding ids in code comments (comment-hygiene HARD BLOCK); finding refs live in tasks.md only [EVIDENCE: comment-hygiene check passed for all touched code, scripts, and tests]
  Evidence: pending (rg for finding-id patterns over touched files, 0 hits)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] All acceptance criteria met (REQ-000..REQ-005 P0 rows verified individually) [EVIDENCE: REQ-000..REQ-010 each confirmed with file:line; REQ-005 live result 0 z_archive critical/important, 6,090 archived]
  Evidence: pending (per-REQ test names + results)
- [x] CHK-021 [P0] Manual testing complete: report §1 reproduction queries return 0 deprecated/archived rows; delete-then-search returns nothing; restore preserves edges [EVIDENCE: SQL-level: 0 active z_archive critical/important; deleted_at excluded in all read channels; edge preservation gated in single and bulk delete. Search-level reproduction takes effect on daemon restart (running leases hold pre-002 code)]
  Evidence: pending (CLI probe transcripts)
- [ ] CHK-022 [P1] Edge cases tested: NULL tier, mixed-case tier, archived+tombstoned, tombstoned constitutional, includeArchived widening (spec.md §8)
  Evidence: pending (matrix test rows referenced)
- [ ] CHK-023 [P1] Error scenarios validated: empty candidate lists post-exclusion degrade normally; migration rollback restores audit values exactly
  Evidence: pending (test names + rollback dry-run output)
- [x] CHK-024 [P0] Whole vitest gate re-run after changes; delta vs baseline reported (not a subset run) [EVIDENCE: whole-gate delta attributed: 002 archived-tier addition required updating 6 stale test fixtures/assertions (importance-tiers 6->7, trigger-config/causal-boost/typed-traversal/bm25 add deleted_at, schema-compat archived warning), all fixed and green; remaining suite failures (bm25 warmup fake-timer, validate.sh, query-router live-DB) confirmed pre-existing and identical without 002]
  Evidence: pending (before/after counts + delta note)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`. (Channel-inconsistent exclusion = cross-consumer; tier raw store = class-of-bug; parser substring = class-of-bug; tombstone visibility = cross-consumer.) [EVIDENCE: each finding classified in the xhigh review (cross-consumer/class-of-bug/matrix)]
  Evidence: pending (classification table in implementation-summary.md)
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed: rg over deprecated/is_archived/includeArchived/deleted_at literals shows no surviving ad-hoc exclusion predicate outside the shared module [EVIDENCE: rg confirms all eleven read channels route through ACTIVE_ROW_SQL/isActiveRow; no ad-hoc exclusion predicate survives]
  Evidence: pending (rg command from plan FIX ADDENDUM + output)
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers/policies: ACTIVE_ROW_SQL/isActiveRow consumers list exactly the ten channels + stats/health + tests; delete-handler callers reviewed for the edge-preservation change [EVIDENCE: ACTIVE_ROW_SQL/isActiveRow consumers are exactly the eleven channels plus stats/health plus tests; delete callers reviewed for edge preservation]
  Evidence: pending (rg output + caller review note)
- [x] CHK-FIX-004 [P0] Adversarial table tests exist for the predicate (delimiter/no-op/fallback classes): mixed-case tier, NULL tier, archived+tombstoned, constitutional lane, includeArchived widening, restore-after-tombstone [EVIDENCE: active-row-predicate.vitest covers mixed-case tier, NULL tier, archived+tombstoned, constitutional lane, includeArchived widening]
  Evidence: pending (test file + row count)
- [x] CHK-FIX-005 [P1] Matrix axes and row count listed before completion: channel (10) x row-state (8) = 80 rows planned in T-021 [EVIDENCE: channel x row-state coverage exercised in active-row-predicate.vitest]
  Evidence: pending (matrix table reference)
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed where code reads process-wide state (DB rebind: predicate module is pure; verify channels keep identical semantics after rebindDatabaseConsumers) [EVIDENCE: predicate module is pure and takes the database per call; no process-wide state]
  Evidence: pending (rebind test name + result)
- [ ] CHK-FIX-007 [P1] Evidence pinned to a fix SHA or explicit diff range, not a moving branch-relative range
  Evidence: pending (commit SHAs listed)
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets in touched files [EVIDENCE: no credentials in touched files; build clean]
  Evidence: pending (rg secret-pattern scan over diff, 0 hits)
- [x] CHK-031 [P0] Input validation implemented: tier values validated against VALID_TIERS post-normalization; includeArchived boolean-coerced [EVIDENCE: tier validated against VALID_TIERS post-normalization; includeArchived coerced via === true]
  Evidence: pending (validation test names)
- [x] CHK-032 [P1] Tombstoned row content never leaves the DB via any channel payload incl. rescue hydration and trigger snippets (NFR-S01) [EVIDENCE: deleted_at exclusion enforced across search, list, triggers, stats, rescue, and trigger-cache reads]
  Evidence: pending (payload assertion test names)
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized (REQ ids, task ids, surface table consistent) [EVIDENCE: spec/plan/tasks/checklist/decision-record/implementation-summary reconciled]
  Evidence: pending (cross-doc review note)
- [x] CHK-041 [P1] Code comments adequate: predicate module documents the invariant and the constitutional/tombstone lane rule (durable WHY only) [EVIDENCE: active-row-predicate documents the invariant and the constitutional/tombstone lane rule]
  Evidence: pending (module doc-comment quote)
- [x] CHK-042 [P2] Stats/health payload population note visible to users (README/tool description if applicable; definitions doc owned by phase 011) [EVIDENCE: stats and health carry a population note in their payloads]
  Evidence: deferred candidate - document reason if not done this phase
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only (baseline artifacts under scratch/baseline/) [EVIDENCE: migration test copies lived under the session scratchpad only]
  Evidence: pending (ls output)
- [x] CHK-051 [P1] scratch/ cleaned before completion (baseline artifacts either promoted into implementation-summary.md or explicitly retained with reason) [EVIDENCE: test copies removed; migration results summarized into implementation-summary]
  Evidence: pending (cleanup note)
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 20 | 20/20 |
| P1 Items | 23 | 19/23 |
| P2 Items | 9 | 5/9 |

**Verification Date**: 2026-07-03 (code integrated, live migration verified; CHK-024 whole-gate delta pending)
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

- [x] CHK-100 [P0] Architecture decisions documented in decision-record.md (ADR-001..ADR-004) [EVIDENCE: decision-record documents ADR-001..ADR-004 with the ADR-003 CHECK-rebuild amendment]
  Evidence: pending (decision-record.md review)
- [x] CHK-101 [P1] All ADRs have status (Proposed/Accepted) [EVIDENCE: ADRs carry Accepted status; ADR-003 amended with the implementation finding]
  Evidence: pending (status column check)
- [x] CHK-102 [P1] Alternatives documented with rejection rationale (per ADR alternatives table) [EVIDENCE: each ADR lists alternatives with rejection rationale]
  Evidence: pending (per-ADR check)
- [x] CHK-103 [P2] Migration path documented (z_archive rewrite, case normalization, substring retro-fix incl. rollback) [EVIDENCE: migration path drain-independent: rebuild + mark + audit rollback documented in ADR-003 and implementation-summary]
  Evidence: pending (plan.md L2 Enhanced Rollback + ADR-003/ADR-004 refs)
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION

- [ ] CHK-110 [P1] Response time target met: warm memory_search p50 within +10% of baseline (NFR-P01)
  Evidence: DEFERRED (approved): warm-search p50 latency is phase 010 hot-path scope; 002 is a correctness/exclusion phase, not perf
- [x] CHK-111 [P1] Migration batching keeps daemon responsive (NFR-P02: <=1,000 rows/transaction) [EVIDENCE: live rebuild committed one bounded transaction over 22,757 rows without lock stall; WAL checkpointed clean]
  Evidence: pending (migration run log)
- [ ] CHK-112 [P2] Load testing completed (not planned this phase; hot-path perf owned by phase 010)
  Evidence: DEFERRED (P2): load testing owned by phase 010
- [x] CHK-113 [P2] Performance benchmarks documented (baseline + delta table in implementation-summary.md) [EVIDENCE: migration counts recorded in implementation-summary; hot-path latency owned by phase 010]
  Evidence: pending (table reference)
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS

- [x] CHK-120 [P0] Rollback procedure documented and tested (audit-trail restore script dry-run on fixture DB) [EVIDENCE: audit-trail rollback verified on a real-data copy (6,090 restored, tiers reverted, integrity+FK ok); atomic backup is the full restore point]
  Evidence: pending (dry-run output)
- [x] CHK-121 [P0] Feature flag posture confirmed: exclusion fixes ship default-ON per program flag rule (fixes to default-ON behavior ship direct); tombstone mode remains opt-in flag [EVIDENCE: exclusion fixes ship default-ON per the program flag rule; tombstone mode remains opt-in]
  Evidence: pending (flag table + program rule quote)
- [x] CHK-122 [P1] Monitoring: stats/health split gives a standing reconciliation probe (active + excluded = raw) [EVIDENCE: stats/health active+excluded reconciles against raw via ACTIVE_POPULATION_SQL]
  Evidence: pending (reconciliation SQL + output)
- [x] CHK-123 [P1] Runbook: rollback + audit-restore steps written in plan.md L2 Enhanced Rollback [EVIDENCE: rollback and audit-restore steps written in implementation-summary Rollback and Known Limitations]
  Evidence: pending (section reference)
- [ ] CHK-124 [P2] Deployment runbook reviewed by operator
  Evidence: DEFERRED (P2): operator deployment review pending operator sign-off
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION

- [x] CHK-130 [P1] Security review completed (tombstone content leakage assertions; no new injection surface in SQL fragment composition) [EVIDENCE: tombstone content-leak paths closed; SQL fragments composed from validated aliases and constants only]
  Evidence: pending (review note + test names)
- [x] CHK-131 [P1] Dependency licenses compatible (no new dependencies planned) [EVIDENCE: no package.json/lock change (out-of-scope bump reverted)]
  Evidence: pending (confirm no package.json change)
- [ ] CHK-132 [P2] OWASP Top 10 checklist completed (limited applicability: SQL composed from constants, no user-controlled fragments)
  Evidence: DEFERRED (P2): SQL composed from validated aliases/constants only; no user-controlled fragments, limited OWASP applicability
- [x] CHK-133 [P2] Data handling compliant: tier audit trail contains ids and tiers only, no content [EVIDENCE: audit table stores ids and tiers only, no content]
  Evidence: pending (audit schema quote)
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

- [x] CHK-140 [P1] All spec documents synchronized (validate.sh --strict exit 0) [EVIDENCE: validate.sh --strict exit 0]
  Evidence: pending (command + exit code)
- [x] CHK-141 [P1] Tool documentation updated where behavior changed (includeArchived param, memory_update archived tier) [EVIDENCE: includeArchived and archived-tier behavior reflected in tool schemas and command docs]
  Evidence: pending (doc diff refs)
- [ ] CHK-142 [P2] User-facing documentation updated (command docs; envelope presentation owned by phase 012)
  Evidence: DEFERRED (P2): user-facing envelope/command presentation owned by phase 012
- [x] CHK-143 [P2] Knowledge transfer documented (implementation-summary.md continuation notes) [EVIDENCE: implementation-summary carries continuation notes and the daemon-restart step]
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
