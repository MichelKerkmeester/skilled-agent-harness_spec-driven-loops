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

- [ ] T001 Read `recommend-level.sh` end to end and record the current output for three representative invocations to `scratch/baseline.txt` (`.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh`)
- [ ] T002 Confirm the argument loop shape and the two boolean globals (`JSON_OUTPUT`, `RECOMMEND_PHASES`) the new flag should follow (`.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh`)
- [ ] T003 [P] Confirm the two phase test scripts are the only automated consumers of the script (`.skilled/skills/system-spec-kit/runtime/cli/tests/test-phase-validation.js`, `.skilled/skills/system-spec-kit/runtime/cli/tests/test-phase-system.js`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Add `QUIET=false` to the globals block beside `JSON_OUTPUT` (`.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh`)
- [ ] T005 Add the `--quiet)` case arm to the argument loop, setting `QUIET=true` and shifting one token (`.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh`)
- [ ] T006 Add the guarded early return at the top of `output_text()` that prints the recommended-level line and returns (`.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh`)
- [ ] T007 Add the `--quiet` entry to the file-header `OPTIONS` block (`.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh`)
- [ ] T008 Add the `--quiet` entry to the `show_help()` `OPTIONS` block (`.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh`)
- [ ] T009 [P] State the `--json` precedence in the help entry so a reader knows the two flags can be combined (`.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh`)
- [ ] T016 Keep the quiet branch confined to stdout so any warning the script writes to stderr still reaches stderr untouched, adding no stderr redirection to the guarded early return (REQ-008) (`.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T010 Diff the default output of the three baseline invocations against `scratch/baseline.txt` and confirm no change (`scratch/baseline.txt`)
- [ ] T011 Run `--loc 50 --files 2 --quiet` and confirm `wc -l` reports 1 and the line reads `Recommended Level: 0 (Quick)` (`.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh`)
- [ ] T012 Run `--loc 1000 --files 20 --architectural --api --db --json --quiet` and confirm the output still parses as JSON with `recommended_level: 3` (`.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh`)
- [ ] T013 Run both phase test scripts and confirm exit 0 (`.skilled/skills/system-spec-kit/runtime/cli/tests/test-phase-validation.js`, `.skilled/skills/system-spec-kit/runtime/cli/tests/test-phase-system.js`)
- [ ] T014 Check the error paths: `--quiet --loc` with no value and `--quiet --bogus` both print to stderr and exit 1 (`.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh`)
- [ ] T015 Fill `implementation-summary.md` with the delivered change and the observed verification results (`implementation-summary.md`)
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

## AI EXECUTION PROTOCOL

### Pre-Task Checklist

1. Read the whole of `recommend-level.sh` before editing it; the argument loop, the globals block and the output functions are separated by section banners, and a partial read is how a flag lands in the wrong one.
2. Capture the baseline output for T010 before changing a character, because a baseline taken after the edit proves nothing.
3. Confirm which output function the current invocation reaches before adding a branch to it.

### Execution Rules

| Rule | Meaning |
|------|---------|
| TASK-SEQ | Run T001 through T003 before any edit; they produce the baseline the verification depends on. |
| TASK-SCOPE | Edit `recommend-level.sh` only. A test fixture, a caller script or a second formatter is a different packet. |
| TASK-VERIFY | A task is complete only when its stated command was run and its output read, not when the edit looked right. |

### Status Reporting Format

Report each task as `T### - done | blocked - <one line of evidence>`. Evidence is the command and its result, for example `T011 - done - wc -l reported 1 and the line read Recommended Level: 0 (Quick)`.

### Blocked Task Protocol

Mark a task `[B]` and stop when the baseline cannot be captured, when a phase test script fails before the edit, or when the file no longer matches the structure T002 recorded. Record the blocking command and its output in the task line, then escalate rather than editing around it.

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

**Verification Date**: 2026-10-26
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: Architecture Verification

- [ ] CHK-100 [P0] Architecture decisions documented in `plan.md` as ADR-001 and ADR-002
- [ ] CHK-101 [P1] All ADRs carry a status (Proposed or Accepted)
- [ ] CHK-102 [P1] Alternatives documented with rejection rationale
- [ ] CHK-103 [P2] Migration path documented (not applicable: no stored state to migrate)
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: Performance Verification

- [ ] CHK-110 [P1] Response time targets met (NFR-P01)
- [ ] CHK-111 [P1] Throughput target met (not applicable: the script is a one-shot CLI with no sustained load)
- [ ] CHK-112 [P2] Load testing completed (not applicable)
- [ ] CHK-113 [P2] Performance benchmarks documented (not applicable)
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: Deployment Readiness

- [ ] CHK-120 [P0] Rollback procedure documented and tested
- [ ] CHK-121 [P0] Feature flag configured (not applicable: `--quiet` is opt-in per invocation)
- [ ] CHK-122 [P1] Monitoring/alerting configured (not applicable: no runtime service)
- [ ] CHK-123 [P1] Runbook created (not applicable: no deployment step)
- [ ] CHK-124 [P2] Deployment runbook reviewed (not applicable)
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: Compliance Verification

- [ ] CHK-130 [P1] Security review completed
- [ ] CHK-131 [P1] Dependency licenses compatible (not applicable: no dependency added)
- [ ] CHK-132 [P2] OWASP Top 10 checklist completed (not applicable: no network or user input surface)
- [ ] CHK-133 [P2] Data handling compliant with requirements (not applicable: the script handles no data)
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: Documentation Verification

- [ ] CHK-140 [P1] All spec documents synchronized
- [ ] CHK-141 [P1] API documentation complete (the help text is the API surface)
- [ ] CHK-142 [P2] User-facing documentation updated (the help text is the user-facing surface)
- [ ] CHK-143 [P2] Knowledge transfer documented
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: Sign-Off

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Operator | Technical Lead | [ ] Approved | |
| Operator | Product Owner | [ ] Approved | |
| Operator | QA Lead | [ ] Approved | |
<!-- /ANCHOR:sign-off -->
