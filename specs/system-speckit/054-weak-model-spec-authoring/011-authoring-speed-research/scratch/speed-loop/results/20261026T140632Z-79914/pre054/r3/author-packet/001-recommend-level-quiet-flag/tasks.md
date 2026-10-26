---
title: "Tasks: Add a quiet flag to recommend-level.sh"
description: "Ordered tasks for adding --quiet to recommend-level.sh, with the baseline capture, the script edit, the regression case and the verification evidence that closes each one."
trigger_phrases:
  - "recommend level quiet flag tasks"
  - "recommend-level.sh quiet verification"
  - "quiet flag task breakdown"
importance_tier: "normal"
contextType: "implementation"
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

Every task below is pending. This packet plans the change and records the evidence each task must produce. No line of `recommend-level.sh` is edited by this packet.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Capture the current text output for the fixture set, default phases and `--no-recommend-phases`, into `scratch/baseline-text.txt` (`.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh`)
- [ ] T002 Capture the current JSON output for the same fixtures into `scratch/baseline-json.txt` (`.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh`)
- [ ] T003 [P] Record both suite baselines, `test-phase-system.js` at 27 passed and `test-phase-validation.js` at 51 passed, in `scratch/baseline-suites.txt` (`.skilled/skills/system-spec-kit/runtime/cli/tests/`)
- [ ] T004 [P] Confirm the consumer inventory: four `--json` invocations and no text-output parser (`.skilled/commands/speckit/assets/`, `.skilled/skills/system-spec-kit/runtime/cli/tests/`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T005 Add `QUIET=false` beside `JSON_OUTPUT=false` in the configuration block (`recommend-level.sh`)
- [ ] T006 Add the `--quiet` branch to the option parser next to `--json|-j` (`recommend-level.sh`)
- [ ] T007 Add the `--quiet` line to the file-header OPTIONS block with the same wording as the help text (`recommend-level.sh`)
- [ ] T008 Add the matching `--quiet` line to the `show_help` OPTIONS list (`recommend-level.sh`)
- [ ] T009 Return early from `output_text()` after the level line when `QUIET` is true, leaving the line text untouched (`recommend-level.sh`)
- [ ] T010 Leave `output_json()` and the output dispatch unchanged, so `--json` still wins (`recommend-level.sh`)
- [ ] T011 Run `bash -n` on the script and confirm the syntax check exits 0 (`recommend-level.sh`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T012 Add the quiet case to the recommend-level fixtures, asserting one line, exact text and exit 0 (`test-phase-system.js`)
- [ ] T013 Add the `--quiet --json` precedence assertion to the same case, confirming the full document (`test-phase-system.js`)
- [ ] T014 Diff the default text and JSON output against the Phase 1 baselines and confirm both diffs are empty (`scratch/`)
- [ ] T015 Run both suites and compare to the baseline counts, 28 and 51 passed with 0 failures (`tests/`)
- [ ] T016 Confirm `--quiet --help` prints the help text and exits 0, and that a bad argument still exits 1 under `--quiet` (`recommend-level.sh`)
- [ ] T017 Update this packet with the observed evidence and run `validate.sh --strict` (`acceptance-criteria.md`, `implementation-summary.md`)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
- [ ] Both suite counts recorded with their exit codes
- [ ] Default output diff empty against the Phase 1 baseline
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Closure Gate**: See `acceptance-criteria.md`
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
- [ ] CHK-004 [P0] Baseline text and JSON output captured before the first edit
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Code passes lint/format checks
- [ ] CHK-011 [P0] No console errors or warnings
- [ ] CHK-012 [P1] Error handling implemented
- [ ] CHK-013 [P1] Code follows project patterns
- [ ] CHK-014 [P1] `bash -n` exits 0 on the edited script
- [ ] CHK-015 [P1] The change stays bash 3.2 compatible
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met
- [ ] CHK-021 [P0] Manual testing complete
- [ ] CHK-022 [P1] Edge cases tested
- [ ] CHK-023 [P1] Error scenarios validated
- [ ] CHK-024 [P0] Quiet output asserted at one line with exact text
- [ ] CHK-025 [P0] `--quiet --json` asserted to print the full document
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
- [ ] CHK-033 [P1] The flag takes no value, so no new parse surface exists
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized
- [ ] CHK-041 [P1] Code comments adequate
- [ ] CHK-042 [P2] README updated (if applicable)
- [ ] CHK-043 [P1] Both OPTIONS lists name the flag with the same wording
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
| P0 Items | 18 | 0/18 |
| P1 Items | 27 | 0/27 |
| P2 Items | 9 | 0/9 |

**Verification Date**: 2026-10-26
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: Architecture Verification

- [ ] CHK-100 [P0] Architecture decisions documented in `plan.md` ADR-001 and ADR-002
- [ ] CHK-101 [P1] All ADRs have status (Proposed/Accepted)
- [ ] CHK-102 [P1] Alternatives documented with rejection rationale
- [ ] CHK-103 [P2] Migration path documented (if applicable)
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: Performance Verification

- [ ] CHK-110 [P1] Response time targets met (NFR-P01)
- [ ] CHK-111 [P1] Line count matches the matrix for every output mode
- [ ] CHK-112 [P2] Load testing completed
- [ ] CHK-113 [P2] Performance benchmarks documented
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: Deployment Readiness

- [ ] CHK-120 [P0] Rollback procedure documented and tested
- [ ] CHK-121 [P0] The flag defaults to off, so an existing caller sees no change
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
- [ ] CHK-141 [P1] Help text documents every accepted option
- [ ] CHK-142 [P2] User-facing documentation updated
- [ ] CHK-143 [P2] Knowledge transfer documented
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: Sign-Off

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Packet author | Technical Lead | [ ] Approved | |
| Packet author | Product Owner | [ ] Approved | |
| Packet author | QA Lead | [ ] Approved | |
<!-- /ANCHOR:sign-off -->

