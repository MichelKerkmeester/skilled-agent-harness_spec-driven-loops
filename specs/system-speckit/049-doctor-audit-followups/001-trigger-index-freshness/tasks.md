---
title: "Tasks: Phase 1: trigger-index-freshness"
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
# Tasks: Phase 1: trigger-index-freshness

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

- [ ] T001 Capture the baseline `--check` output into `scratch/baseline-check.json` and record the exit code and counts (`.skilled/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs`)
- [ ] T002 [P] Snapshot the current `phraseQuality` bucket into `scratch/baseline-phrase-quality.json` (`.skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/generation-diagnostics.json`)
- [ ] T003 Confirm `/doctor:rebuild`'s generator leg and its write targets (`.skilled/commands/doctor/rebuild.md`, `.skilled/commands/doctor/assets/doctor-rebuild.yaml`)
- [ ] T004 [P] Re-confirm each recorded finding against the current tree and mark any that no longer holds (`.skilled/skills/system-spec-kit/runtime/cli/retrieval/`, `references/retrieval/`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T005 Judge each phrase with the folder tokens of its owning documents, importing `packetFolderTokens` from `lib/grep-convention.mjs` (`.skilled/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs`)
- [ ] T006 State the counting rule for a phrase whose owning folders disagree, in the diagnostics contract comment and the conventions (`.skilled/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs`, `.skilled/skills/system-spec-kit/references/retrieval/retrieval-conventions.md`)
- [ ] T007 Add a case proving a folder-token phrase lands in `folder-token-fallback` (`.skilled/skills/system-spec-kit/runtime/cli/tests/trigger-index.vitest.ts`)
- [ ] T008 Keep the bucket promise true and remove the deleted-symlink claim (`.skilled/skills/system-spec-kit/runtime/cli/retrieval/README.md`)
- [ ] T009 Add the `--check` activity to phase 0 and demote the mtime sample to supporting evidence in phase 1 (`.skilled/commands/doctor/assets/doctor-speckit-retrieval.yaml`)
- [ ] T010 Name `/doctor:rebuild` as the owner of the byte-identical regeneration proof (`.skilled/commands/doctor/assets/doctor-speckit-retrieval.yaml`)
- [ ] T011 Correct the §9 root-coverage row and re-test then update the §2.5/§4 ripgrep version pins (`.skilled/skills/system-spec-kit/references/retrieval/retrieval-conventions.md`)
- [ ] T012 Correct the continuity `key_files` to the live runtime paths (`specs/system-speckit/033-system-speckit-v4/017-memory-database-decommission/001-trigger-index-replacement/acceptance-criteria.md`)
- [ ] T013 Regenerate the index and three sidecars through `/doctor:rebuild`, recording a deviation if its generator leg is run directly (`.skilled/skills/system-spec-kit/runtime/data/trigger-index.json`, `.skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T014 Confirm `--check --json` exits 0 with `fresh: true`, zero stale and zero missing (`.skilled/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs`)
- [ ] T015 Confirm the index and all three sidecars carry one `manifestHash` (`.skilled/skills/system-spec-kit/runtime/data/trigger-index.json`, `.skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/`)
- [ ] T016 Run the retrieval vitest suites and the `runtime/cli` test script (`.skilled/skills/system-spec-kit/runtime/cli/`)
- [ ] T017 Run `route-validate.sh` and its `--self-test` (`.skilled/commands/doctor/scripts/route-validate.sh`)
- [ ] T018 Validate the phase folder under strict mode and record `RESULT: PASSED` (`.skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh`)
- [ ] T019 Write the evidence rows and known limitations (`.skilled/commands/doctor/assets/doctor-speckit-retrieval.yaml`, `implementation-summary.md`)
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
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Code passes lint/format checks
- [ ] CHK-011 [P0] No console errors or warnings
- [ ] CHK-012 [P1] Error handling implemented
- [ ] CHK-013 [P1] Code follows project patterns
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met
- [ ] CHK-021 [P0] Manual testing complete
- [ ] CHK-022 [P1] Edge cases tested
- [ ] CHK-023 [P1] Error scenarios validated
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
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized
- [ ] CHK-041 [P1] Code comments adequate
- [ ] CHK-042 [P2] README updated (if applicable)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in scratch/ only
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

**Verification Date**: 2026-10-03
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
| Unassigned | Technical Lead | [ ] Approved | |
| Unassigned | Product Owner | [ ] Approved | |
| Unassigned | QA Lead | [ ] Approved | |
<!-- /ANCHOR:sign-off -->

