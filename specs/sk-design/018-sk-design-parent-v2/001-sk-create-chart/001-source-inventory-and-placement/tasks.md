---
title: "Tasks: Phase 1: source-inventory-and-placement"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "name"
  - "template"
  - "tasks core"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 1: source-inventory-and-placement

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

- [x] T001 Read the parent scope and this phase's spec, and confirm the write authority is this folder (spec.md, ../spec.md)
- [x] T002 Match the action against the repo rules trigger table and load every rule that fires (REPO RULES.md)
- [x] T003 [P] Capture the baseline validation result before writing anything, so a new failure is distinguishable from an old one
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Scan the clone into one row per file: bytes, text or binary, lines, Han, CJK punctuation (scratch/scan-source.mjs)
- [x] T005 Assign every row a disposition from one ordered rule list, failing loudly on an unmatched file (scratch/classify.mjs)
- [x] T006 Measure all 14 sk-doc mode folders and all 9 standalone siblings, then decide placement against that comparison (decision-record.md)
- [x] T007 Read both licences, trace every binary asset to its referencing file, and record the conflict found (research/inventory.md)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Reconcile the file set against git ls-files and confirm zero difference
- [x] T009 Recount the Han census with an independent method and confirm the totals agree
- [x] T010 Write the inventory, the decision record, and this packet's own tracking documents
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

- [x] CHK-001 [P0] Requirements documented in spec.md
- [x] CHK-002 [P0] Technical approach defined in plan.md
- [x] CHK-003 [P1] Dependencies identified and available (the clone, refetchable at the recorded commit)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks (the three scratch scripts run clean under node)
- [x] CHK-011 [P0] No console errors or warnings
- [x] CHK-012 [P1] Error handling implemented (classify.mjs exits non-zero on an unclassified file)
- [x] CHK-013 [P1] Code follows project patterns
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met (11 of 11 Met in acceptance-criteria.md)
- [x] CHK-021 [P0] Manual testing complete (both reconciliations run and read)
- [x] CHK-022 [P1] Edge cases tested (undecodable and zero-length files get their own class rather than a bucket)
- [x] CHK-023 [P1] Error scenarios validated (an unmatched file fails the classifier by design)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Not applicable, this phase diagnoses no defect. Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`.
- [x] CHK-FIX-002 [P0] Not applicable. Same-class producer inventory completed, or instance-only status proven by grep.
- [x] CHK-FIX-003 [P0] Not applicable. Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests.
- [x] CHK-FIX-004 [P0] Not applicable. Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases.
- [x] CHK-FIX-005 [P1] Not applicable. Matrix axes and row count are listed before completion is claimed.
- [x] CHK-FIX-006 [P1] Not applicable. Hostile env/global-state variant executed when tests or code read process-wide state.
- [x] CHK-FIX-007 [P1] Evidence is pinned to the upstream source commit 4eef5ce rather than a fix SHA or explicit diff range, not a moving branch-relative range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets
- [x] CHK-031 [P0] Input validation implemented (the scanner requires a root argument and exits otherwise)
- [x] CHK-032 [P1] Auth/authz working correctly (not applicable, no auth surface)
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized
- [x] CHK-041 [P1] Code comments adequate (each scratch script states why, carrying no ephemeral artifact labels)
- [x] CHK-042 [P2] README updated (not applicable, this packet ships no README)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only
- [x] CHK-051 [P1] scratch/ cleaned before completion (the three scripts and their outputs are kept deliberately, because the inventory claims reproducibility and they are what makes that true)
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 15 | 15/15 |
| P1 Items | 23 | 22/23 |
| P2 Items | 9 | 9/9 |

**Verification Date**: 2026-09-02
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: Architecture Verification

- [x] CHK-100 [P0] Architecture decisions documented in decision-record.md (ADR-001, ADR-002, ADR-003)
- [x] CHK-101 [P1] All ADRs have status (ADR-001 Accepted, ADR-002 Proposed, ADR-003 Accepted)
- [x] CHK-102 [P1] Alternatives documented with rejection rationale
- [x] CHK-103 [P2] Migration path documented (the dispositions are the migration list phase 4 executes)
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: Performance Verification

- [x] CHK-110 [P1] Response time targets met (NFR-P01 states not applicable, no runtime path changes)
- [x] CHK-111 [P1] Throughput targets met (not applicable)
- [x] CHK-112 [P2] Load testing completed (not applicable)
- [x] CHK-113 [P2] Performance benchmarks documented (not applicable)
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: Deployment Readiness

- [x] CHK-120 [P0] Rollback procedure documented (each ADR carries one, and this phase wrote nothing outside its own folder)
- [x] CHK-121 [P0] Feature flag configured (not applicable)
- [x] CHK-122 [P1] Monitoring/alerting configured (not applicable)
- [x] CHK-123 [P1] Runbook created (research/inventory.md section 2 records how to reproduce every number)
- [x] CHK-124 [P2] Deployment runbook reviewed (not applicable)
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: Compliance Verification

- [x] CHK-130 [P1] Security review completed (NFR-S01 honoured, nothing from the clone was executed during inventory)
- [ ] CHK-131 [P1] Dependency licenses compatible. BLOCKED. PolyForm Noncommercial against this repository's MIT grant. See ADR-002
- [x] CHK-132 [P2] OWASP Top 10 checklist completed (not applicable)
- [x] CHK-133 [P2] Data handling compliant with requirements
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: Documentation Verification

- [x] CHK-140 [P1] All spec documents synchronized
- [x] CHK-141 [P1] API documentation complete (not applicable)
- [x] CHK-142 [P2] User-facing documentation updated (not applicable)
- [x] CHK-143 [P2] Knowledge transfer documented (the inventory's findings table names the phase each one lands on)
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: Sign-Off

| Approver | Role | Status | Date |
|----------|------|--------|------|
| [Name] | Technical Lead | [ ] Approved | |
| [Name] | Product Owner | [ ] Approved | |
| [Name] | QA Lead | [ ] Approved | |
<!-- /ANCHOR:sign-off -->


