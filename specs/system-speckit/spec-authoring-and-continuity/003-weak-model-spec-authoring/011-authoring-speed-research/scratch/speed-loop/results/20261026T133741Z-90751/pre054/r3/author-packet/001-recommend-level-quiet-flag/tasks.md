---
title: "Tasks: Add a quiet flag to recommend-level.sh"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "recommend level quiet flag tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Add a quiet flag to recommend-level.sh

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

- [ ] T001 Read `recommend-level.sh` end to end and confirm that `output_text()` is the only producer of the `Recommended Level:` line (`.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh`)
- [ ] T002 Capture the pre-change baseline: run the fixture matrix (level bands 0-3 x default and `--no-recommend-phases` x default and `--json`) and save stdout to `scratch/baseline/` (`.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh`)
- [ ] T003 [P] Confirm no existing caller passes an argument that a `--quiet` arm could shadow (`rg -n 'recommend-level\.sh' .skilled/skills/system-spec-kit`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Add the `QUIET_OUTPUT=false` global beside `JSON_OUTPUT` (`.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh`)
- [ ] T005 Add the `--quiet)` case arm to the argument parser (`.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh`)
- [ ] T006 Add `format_level_line()` and replace the first `echo` in `output_text()` with a call to it, keeping the printed bytes identical (`.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh`)
- [ ] T007 Add `output_quiet()` that calls `format_level_line()` and returns (`.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh`)
- [ ] T008 Extend the output dispatch with the quiet branch ahead of the text branch (`.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh`)
- [ ] T009 [P] Add the `--quiet` plus `--json` conflict guard after argument parsing, writing to stderr and exiting 1 (`.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh`)
- [ ] T010 [P] Document `--quiet` in the header option block and in `show_help()` (`.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T011 Write the quiet-path suite: one-line assertion and exact line text for all four level bands (`.skilled/skills/system-spec-kit/runtime/cli/tests/recommend-level-quiet.vitest.ts`)
- [ ] T012 Write the parity case: default-mode stdout equals the captured baseline byte for byte (`.skilled/skills/system-spec-kit/runtime/cli/tests/recommend-level-quiet.vitest.ts`)
- [ ] T013 Write the conflict and precedence cases: `--quiet --json` exits 1 with empty stdout, `--quiet --help` prints help and exits 0 (`.skilled/skills/system-spec-kit/runtime/cli/tests/recommend-level-quiet.vitest.ts`)
- [ ] T014 Run the new suite through the `cli` vitest project and confirm it is collected without a config change (`.skilled/skills/system-spec-kit/runtime/cli/tests/`)
- [ ] T015 Run `node tests/test-phase-validation.js` and `node tests/test-phase-system.js` and confirm both still pass (`.skilled/skills/system-spec-kit/runtime/cli/tests/`)
- [ ] T016 Diff the post-change default output against `scratch/baseline/` and confirm an empty diff (`.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh`)
- [ ] T017 Update the packet docs with the verification evidence (`specs/zz-bench-authoring/001-recommend-level-quiet-flag/implementation-summary.md`)
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

- [ ] CHK-010 [P0] Code passes lint/format checks (`bash -n` on the script and shellcheck if available)
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

Applies to additive feature work as follows: the producer and consumer inventory covers the script's output paths, and there is no path, redaction, parser or security surface to test adversarially, so CHK-FIX-004 is recorded as N/A at completion with that reason.

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
- [ ] CHK-032 [P1] Auth/authz working correctly — N/A, the script has no auth surface; recorded as N/A at completion
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

**Verification Date**: 2026-10-26
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: Architecture Verification

- [ ] CHK-100 [P0] Architecture decisions documented as ADR-001, ADR-002 and ADR-003 in `plan.md`
- [ ] CHK-101 [P1] All ADRs have status (Proposed/Accepted)
- [ ] CHK-102 [P1] Alternatives documented with rejection rationale
- [ ] CHK-103 [P2] Migration path documented (if applicable)
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: Performance Verification

- [ ] CHK-110 [P1] Response time targets met (NFR-P01)
- [ ] CHK-111 [P1] Throughput targets met (NFR-P02)
- [ ] CHK-112 [P2] Load testing completed — N/A, the script is a single-shot CLI
- [ ] CHK-113 [P2] Performance benchmarks documented
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: Deployment Readiness

- [ ] CHK-120 [P0] Rollback procedure documented and tested
- [ ] CHK-121 [P0] Feature flag configured — satisfied by design: `--quiet` is itself the opt-in, and no other flag gates the change
- [ ] CHK-122 [P1] Monitoring/alerting configured — N/A, local CLI with no telemetry
- [ ] CHK-123 [P1] Runbook created — N/A, the rollback procedure in `plan.md` section 7 is the whole runbook
- [ ] CHK-124 [P2] Deployment runbook reviewed
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: Compliance Verification

- [ ] CHK-130 [P1] Security review completed
- [ ] CHK-131 [P1] Dependency licenses compatible — N/A, no new dependency
- [ ] CHK-132 [P2] OWASP Top 10 checklist completed — N/A, no web surface
- [ ] CHK-133 [P2] Data handling compliant with requirements — N/A, the script persists nothing
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
