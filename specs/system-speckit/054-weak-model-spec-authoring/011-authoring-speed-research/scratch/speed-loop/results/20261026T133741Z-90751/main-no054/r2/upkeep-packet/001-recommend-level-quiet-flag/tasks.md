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

- [ ] T001 Read `recommend-level.sh` end to end and note the section numbers for globals, formatters, parser and dispatch (`.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh`)
- [ ] T002 Capture the default output for `--loc 50 --files 2`, `--loc 200 --files 5 --api` and `--loc 500 --files 15 --auth --api --db --architectural` into `scratch/baseline-*.txt` (`scratch/`)
- [ ] T003 Confirm no caller passes `--quiet` today and record the empty result (`scratch/`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Add `QUIET_OUTPUT=false` to the globals block beside `JSON_OUTPUT` (`recommend-level.sh`)
- [ ] T005 Parse `--quiet` in the argument loop and set `QUIET_OUTPUT=true` (`recommend-level.sh`)
- [ ] T006 Add `output_quiet()` to section 4, printing only `Recommended Level: ${RECOMMENDED_LEVEL} (${LEVEL_NAME})` (`recommend-level.sh`)
- [ ] T007 Branch to `output_quiet` first in section 7, before the JSON check (`recommend-level.sh`)
- [ ] T008 Add `--quiet` to the `--help` OPTIONS block and to the header comment's OPTIONS list, naming the precedence over `--json` (`recommend-level.sh`)
- [ ] T013 Keep warnings on stderr for REQ-007: route only stdout through `output_quiet()` and leave every `>&2` warning write untouched, so `--quiet` trims stdout only (`recommend-level.sh`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T009 Add the regression test covering the quiet line for all four level buckets, the quiet-plus-JSON line, the unchanged default report and the exit codes (`runtime/cli/tests/recommend-level-quiet.vitest.ts`)
- [ ] T010 Run the new test and the neighbouring `runtime/cli/tests` spec-script tests (`runtime/cli/tests/`)
- [ ] T011 Diff the three default-output captures against post-change runs and confirm an empty diff (`scratch/`)
- [ ] T012 Run strict validation on this packet and fix what it reports (`specs/zz-bench-authoring/001-recommend-level-quiet-flag/`)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
- [ ] Default output byte-identical for all three captures
- [ ] `--quiet` prints one line for every level bucket
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance Criteria**: See `acceptance-criteria.md`
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

- [ ] CHK-010 [P0] `output_text()` and `output_json()` are unchanged in the diff
- [ ] CHK-011 [P0] The new parser arm follows the shape of the existing boolean arms
- [ ] CHK-012 [P1] The help text and the header comment both name the flag
- [ ] CHK-013 [P1] No packet, task or ADR id appears in the script's comments
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met
- [ ] CHK-021 [P0] The new regression test passes
- [ ] CHK-022 [P1] The four level buckets each print their own quiet line
- [ ] CHK-023 [P1] `--quiet --json` prints the text line and exits 0
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

Not a bug fix. There is no review finding, no finding class and no same-class producer to inventory, so the fix-completeness rows do not apply to this packet.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets
- [ ] CHK-031 [P0] The flag accepts no value and adds no input parsing
- [ ] CHK-032 [P1] Error paths keep writing to stderr and keep exit 1
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized
- [ ] CHK-041 [P1] The script's comments describe the flag's behavior
- [ ] CHK-042 [P2] README updated (not applicable; it does not list script flags)
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
| P0 Items | 11 | 0/11 |
| P1 Items | 20 | 0/20 |
| P2 Items | 9 | 0/9 |

**Verification Date**: 2026-10-26
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: Architecture Verification

- [ ] CHK-100 [P0] ADR-001 records the quiet-versus-JSON precedence in plan.md
- [ ] CHK-101 [P1] The ADR has a status
- [ ] CHK-102 [P1] Rejected alternatives carry a reason
- [ ] CHK-103 [P2] Migration path documented (not applicable; the flag is additive)
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: Performance Verification

- [ ] CHK-110 [P1] The quiet run adds no subprocess and stays within bash startup noise
- [ ] CHK-111 [P1] The quiet line matches the level the full report names for the same input
- [ ] CHK-112 [P2] Load testing completed (not applicable; local CLI)
- [ ] CHK-113 [P2] Performance benchmarks documented (not applicable; no throughput path)
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: Deployment Readiness

- [ ] CHK-120 [P0] Rollback procedure documented and tested in plan.md §7
- [ ] CHK-121 [P0] Feature flag configured (the CLI flag is the switch; no separate toggle)
- [ ] CHK-122 [P1] Monitoring/alerting configured (not applicable; local CLI)
- [ ] CHK-123 [P1] Runbook created (the help text is the runbook for one flag)
- [ ] CHK-124 [P2] Deployment runbook reviewed
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: Compliance Verification

- [ ] CHK-130 [P1] Security review completed
- [ ] CHK-131 [P1] Dependency licenses compatible (no new dependency)
- [ ] CHK-132 [P2] OWASP Top 10 checklist completed (not applicable; no network or user input)
- [ ] CHK-133 [P2] Data handling compliant with requirements (no data read or written)
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: Documentation Verification

- [ ] CHK-140 [P1] All spec documents synchronized
- [ ] CHK-141 [P1] API documentation complete (the `--help` block is the API surface)
- [ ] CHK-142 [P2] User-facing documentation updated (not applicable; no user-facing doc lists this flag)
- [ ] CHK-143 [P2] Knowledge transfer documented
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: Sign-Off

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Packet owner | Technical Lead | Pending | |
| Track owner | Product Owner | Pending | |
| Reviewer | QA Lead | Pending | |
<!-- /ANCHOR:sign-off -->
