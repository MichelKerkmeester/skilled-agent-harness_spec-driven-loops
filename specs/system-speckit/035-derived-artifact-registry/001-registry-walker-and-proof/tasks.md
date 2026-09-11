---
title: "Tasks: Phase 1: registry, walker and proof"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "task breakdown"
  - "implementation tasks"
  - "verification checklist"
  - "task dependencies"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 1: registry, walker and proof

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

- [ ] T001 Read `runtime/cli/lib/validator-registry.json` and record the reader conventions the new registry will follow
- [ ] T002 [P] Test the `make -q` claim against one registry entry and record the answer in plan ADR-002
- [ ] T003 Define the entry schema: `id`, source globs, generator command, target paths and the per-tool exit mapping
- [ ] T004 [P] Read the fingerprint recipe in `runtime/cli/graph/backfill-graph-metadata.ts` and the corpus hash recipe in `runtime/cli/retrieval/generate-trigger-index.mjs`
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T005 Write `runtime/cli/lib/derived-artifacts.json` with the packet metadata entry
- [ ] T006 Add the compiled routing entry, delegating its check to `.opencode/bin/compiled-route-guard.cjs`
- [ ] T007 Add the trigger index entry, reproducing the corpus hash recipe the index generator defines
- [ ] T008 Write the walker argument handling, `--check` and `--write`, in `runtime/cli/spec/derive-artifacts.mjs`
- [ ] T009 Implement the packet entry check and its stored hash recomputation
- [ ] T010 Implement the routing entry check and its exit normalization
- [ ] T011 Implement the trigger entry check and its exit normalization
- [ ] T012 Implement `--write`, dispatching each stale entry to its declared generator
- [ ] T013 Sort every reported set by path so two runs print identical output
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T014 Build the scratch worktree helper in `runtime/tests/derive-artifacts.vitest.ts`
- [ ] T015 Add the packet entry staling case
- [ ] T016 Add the routing entry staling case
- [ ] T017 Add the trigger entry staling case
- [ ] T018 Assert `--check` leaves `git status --porcelain` byte-identical
- [ ] T019 Assert the `--write` round trip returns the stale set to its pre-staling baseline
- [ ] T020 Delete one registry entry and confirm its case fails
- [ ] T021 Run `validate.sh --strict` on this phase and record the result
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
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

- [ ] CHK-001 [P0] Requirements documented in spec.md
- [ ] CHK-002 [P0] Technical approach defined in plan.md
- [ ] CHK-003 [P1] Dependencies identified and available
- [ ] CHK-004 [P0] The three wrapped tools' exit codes observed and recorded before normalization is written
- [ ] CHK-005 [P0] The fingerprint recipe the walker recomputes matches the generator's, checked line by line
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Code passes lint/format checks
- [ ] CHK-011 [P0] No console errors or warnings
- [ ] CHK-012 [P1] Error handling implemented
- [ ] CHK-013 [P1] Code follows project patterns
- [ ] CHK-014 [P1] Every reported set is sorted before printing
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met
- [ ] CHK-021 [P0] Manual testing complete
- [ ] CHK-022 [P1] Edge cases tested
- [ ] CHK-023 [P1] Error scenarios validated
- [ ] CHK-024 [P0] One staling case runs per registry entry and each fails when its entry is removed
- [ ] CHK-025 [P0] `--check` writes nothing, asserted by `git status --porcelain` equality
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`.
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep.
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests.
- [ ] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases.
- [ ] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed.
- [ ] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state.
- [ ] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets
- [ ] CHK-031 [P0] Input validation implemented
- [ ] CHK-032 [P1] Auth/authz working correctly
- [ ] CHK-033 [P0] No write path is reachable without `--write`
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized
- [ ] CHK-041 [P1] Code comments adequate
- [ ] CHK-042 [P2] README updated (if applicable)
- [ ] CHK-043 [P1] The `make -q` answer is recorded in plan ADR-002
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in scratch/ only
- [ ] CHK-051 [P1] scratch/ cleaned before completion
- [ ] CHK-052 [P0] The scoped diff is three new files and no modified tracked file
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 17 | 0/17 |
| P1 Items | 13 | 0/13 |
| P2 Items | 2 | 0/2 |

**Verification Date**: pending phase execution
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: Architecture Verification

- [ ] CHK-100 [P0] Architecture decisions documented in decision-record.md
- [ ] CHK-101 [P1] All ADRs have status (Proposed/Accepted)
- [ ] CHK-102 [P1] Alternatives documented with rejection rationale
- [ ] CHK-103 [P2] Migration path documented (if applicable)
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: Performance Verification

- [ ] CHK-110 [P1] Response time targets met (NFR-P01)
- [ ] CHK-111 [P1] Throughput targets met (NFR-P02)
- [ ] CHK-112 [P2] Load testing completed
- [ ] CHK-113 [P2] Performance benchmarks documented
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: Deployment Readiness

- [ ] CHK-120 [P0] Rollback procedure documented and tested
- [ ] CHK-121 [P0] Feature flag configured (if applicable)
- [ ] CHK-122 [P1] Monitoring/alerting configured
- [ ] CHK-123 [P1] Runbook created
- [ ] CHK-124 [P2] Deployment runbook reviewed
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: Compliance Verification

- [ ] CHK-130 [P1] Security review completed
- [ ] CHK-131 [P1] Dependency licenses compatible
- [ ] CHK-132 [P2] OWASP Top 10 checklist completed
- [ ] CHK-133 [P2] Data handling compliant with requirements
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: Documentation Verification

- [ ] CHK-140 [P1] All spec documents synchronized
- [ ] CHK-141 [P1] API documentation complete (if applicable)
- [ ] CHK-142 [P2] User-facing documentation updated
- [ ] CHK-143 [P2] Knowledge transfer documented
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: Sign-Off

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Phase owner | Technical Lead | pending | |
| Operator | Product Owner | pending | |
<!-- /ANCHOR:sign-off -->


