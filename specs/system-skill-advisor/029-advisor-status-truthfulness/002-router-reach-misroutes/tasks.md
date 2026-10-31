---
title: "Tasks: Phase 2: router-reach-misroutes"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "router reach misroutes tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 2: router-reach-misroutes

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Verify the advisor answers live with a generation number before any fleet run and record the evidence (`scratch/live-fleet.log`) [EVIDENCE: advisor_status live, generation 19, trustState live before the first run]
- [x] T002 Recompute the hub inventory from disk (directories carrying both `ROUTER.md` and `mode-registry.json`) and confirm the probe command shape (`scratch/reproduction.md`) [EVIDENCE: 7 hubs with ROUTER.md and mode-registry.json; probe command unchanged (scratch/reproduction.md)]
- [x] T003 [P] Transcribe the audit's recorded wrong-hub and outranked rows for later comparison (`scratch/reproduction.md`) [EVIDENCE: 32 audit rows transcribed with declaring hub and audit winners (scratch/reproduction.md)]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Run the full live fleet with no `--hub` filter and no `--limit`, recording complete output, advisor generation and exit status (`scratch/live-fleet.log`) [EVIDENCE: scratch/live-fleet.log: wrong-hub 0, outranked 0, generation 19, exit 0]
- [x] T005 Classify every recorded phrase as reproduced, no-longer-reproduced or probe-error, naming the live winner for each reproduced case (`scratch/reproduction.md`) [EVIDENCE: scratch/reproduction.md: 0 reproduced, 32 no longer reproduced, 0 probe-error]
- [x] T006 Fix each reproduced wrong-hub phrase in the declaring hub's intent signals (`graph-metadata.json`) [EVIDENCE: no reproduced wrong-hub phrase; no edit needed]
- [x] T007 Fix each reproduced outranked phrase at its declaration site or against the competing declaration, per the recorded winner (`graph-metadata.json`, `ROUTER.md`) [EVIDENCE: no reproduced outranked phrase; no edit needed]
- [x] T008 Add or adjust an allowlist entry only with a decision record naming the phrase, winner and rationale (`router-reach-allowlist.json`) [EVIDENCE: no allowlist change; git diff empty]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Probe every edited hub individually and confirm the phrase now reaches it (`ci-router-vocabulary-reach.cjs --hub <id>`) [EVIDENCE: no hub edited; fleet run covers every hub]
- [x] T010 Rerun the full fleet live and record the counts, generation and exit status (`scratch/verification.log`) [EVIDENCE: scratch/verification.log: wrong-hub 0, outranked 0, generation 29, exit 0]
- [x] T011 Rerun the doctor route validator and record exit 0 (`bash .skilled/commands/doctor/scripts/route-validate.sh`) [EVIDENCE: route-validate.sh exit 0, 9 routes validated]
- [x] T012 Sync `acceptance-criteria.md` with the observed evidence for each row (`acceptance-criteria.md`) [EVIDENCE: acceptance-criteria.md 4/4 Met]
- [x] T013 [P] Record the final limitation state in `implementation-summary.md` when the phase closes (`implementation-summary.md`) [EVIDENCE: implementation-summary.md Known Limitations records the final state]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

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

- [x] CHK-001 [P0] Requirements documented in spec.md [EVIDENCE: spec.md REQ-001..004]
- [x] CHK-002 [P0] Technical approach defined in plan.md [EVIDENCE: plan.md ADR-001 live-first]
- [x] CHK-003 [P1] Dependencies identified and available [EVIDENCE: runtime build and better-sqlite3 available]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks [EVIDENCE: N/A: no code changed in this phase]
- [x] CHK-011 [P0] No console errors or warnings [EVIDENCE: N/A: no code changed in this phase]
- [x] CHK-012 [P1] Error handling implemented [EVIDENCE: N/A: no code changed in this phase]
- [x] CHK-013 [P1] Code follows project patterns [EVIDENCE: N/A: no code changed in this phase]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met [EVIDENCE: acceptance-criteria.md 4/4 Met]
- [x] CHK-021 [P0] Manual testing complete [EVIDENCE: two live fleet runs and 32 single-phrase probes]
- [x] CHK-022 [P1] Edge cases tested [EVIDENCE: close-margin phrases recorded]
- [x] CHK-023 [P1] Error scenarios validated [EVIDENCE: stale-generation run failed closed as designed]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`. [EVIDENCE: matrix/evidence: every recorded row classified live]
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep. [EVIDENCE: N/A: no producer changed]
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests. [EVIDENCE: N/A: no phrase changed]
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases. [EVIDENCE: N/A: no security, path, parser or redaction fix]
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed. [EVIDENCE: phrase class x declaring hub axes in reproduction.md (32 rows, 7 hubs)]
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state. [EVIDENCE: N/A: no env-reading code changed]
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range. [EVIDENCE: evidence pinned to the uncommitted working-tree diff; the parent session commits it]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets [EVIDENCE: N/A: no code changed in this phase]
- [x] CHK-031 [P0] Input validation implemented [EVIDENCE: N/A: no code changed in this phase]
- [x] CHK-032 [P1] Auth/authz working correctly [EVIDENCE: N/A: no auth surface changed]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized [EVIDENCE: spec, plan, tasks and acceptance criteria agree]
- [x] CHK-041 [P1] Code comments adequate [EVIDENCE: N/A: no code changed in this phase]
- [x] CHK-042 [P2] README updated (if applicable) [EVIDENCE: N/A: no README covers these fields]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only [EVIDENCE: evidence files only under scratch/]
- [x] CHK-051 [P1] scratch/ cleaned before completion [EVIDENCE: scratch/ holds only the evidence files the tasks name]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 15 | 15/15 |
| P1 Items | 23 | 23/23 |
| P2 Items | 9 | 9/9 |

**Verification Date**: 2026-10-03
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: Architecture Verification

- [x] CHK-100 [P0] Architecture decisions documented in decision-record.md [EVIDENCE: ADR-001 lives in plan.md (no separate decision-record.md in this phase)]
- [x] CHK-101 [P1] All ADRs have status (Proposed/Accepted) [EVIDENCE: ADR-001 Accepted]
- [x] CHK-102 [P1] Alternatives documented with rejection rationale [EVIDENCE: plan.md lists rejected alternatives]
- [x] CHK-103 [P2] Migration path documented (if applicable) [EVIDENCE: N/A: no migration]
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: Performance Verification

- [x] CHK-110 [P1] Response time targets met (NFR-P01) [EVIDENCE: N/A: no code changed in this phase]
- [x] CHK-111 [P1] Throughput targets met (NFR-P02) [EVIDENCE: N/A: no throughput target]
- [x] CHK-112 [P2] Load testing completed [EVIDENCE: N/A: diagnostic surface, no load test]
- [x] CHK-113 [P2] Performance benchmarks documented [EVIDENCE: N/A]
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: Deployment Readiness

- [x] CHK-120 [P0] Rollback procedure documented and tested [EVIDENCE: N/A: nothing to roll back]
- [x] CHK-121 [P0] Feature flag configured (if applicable) [EVIDENCE: N/A: no feature flag]
- [x] CHK-122 [P1] Monitoring/alerting configured [EVIDENCE: N/A: diagnostic surface]
- [x] CHK-123 [P1] Runbook created [EVIDENCE: N/A: doctor panel route asset is the runbook]
- [x] CHK-124 [P2] Deployment runbook reviewed [EVIDENCE: N/A]
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: Compliance Verification

- [x] CHK-130 [P1] Security review completed [EVIDENCE: N/A: no code changed in this phase]
- [x] CHK-131 [P1] Dependency licenses compatible [EVIDENCE: N/A: no code changed in this phase]
- [x] CHK-132 [P2] OWASP Top 10 checklist completed [EVIDENCE: N/A]
- [x] CHK-133 [P2] Data handling compliant with requirements [EVIDENCE: N/A: no code changed in this phase]
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: Documentation Verification

- [x] CHK-140 [P1] All spec documents synchronized [EVIDENCE: phase docs synchronized]
- [x] CHK-141 [P1] API documentation complete (if applicable) [EVIDENCE: N/A: no API change]
- [x] CHK-142 [P2] User-facing documentation updated [EVIDENCE: N/A: no user-facing change]
- [x] CHK-143 [P2] Knowledge transfer documented [EVIDENCE: implementation-summary.md and reproduction.md]
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: Sign-Off

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Parent session | Technical Lead | Pending review at commit | |
| Operator | Product Owner | Pending | |
| Parent session | QA Lead | Pending review at commit | |
<!-- /ANCHOR:sign-off -->

