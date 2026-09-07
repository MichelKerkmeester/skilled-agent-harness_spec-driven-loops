---
title: "Tasks: Pre-existing test repair"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "test repair tasks"
  - "freshness fixture tasks"
  - "manifest suite tasks"
  - "verification checklist"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Pre-existing test repair

<!-- SPECKIT_LEVEL: 2 -->

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

- [x] T001 Reproduce both failures and record the assertion output (.opencode/skills/system-spec-kit/runtime)
- [x] T002 Read what the freshness rule hashes and which document it binds a claim to (.opencode/skills/system-spec-kit/runtime/cli/validation/continuity-freshness.ts)
- [x] T003 [P] Run the manifest checker by hand and count the entries it calls untracked (specs/system-deep-loop/036-deep-loop-innovation/004-gate-closeout-and-drift/001-whole-system-gate/check-goal-file-manifest.sh)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Move the fixture's checkbox evidence into tasks.md, drop the retired document, and land every stale edit on the implementation summary (.opencode/skills/system-spec-kit/runtime/tests/continuity-freshness.vitest.ts)
- [x] T005 Build the tracked manifest from this test and the checker instead of reading another packet's goal manifest (.opencode/skills/system-spec-kit/runtime/cli/tests/recursive-child-manifest.vitest.ts)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 Run both suites in isolation (.opencode/skills/system-spec-kit/runtime)
- [x] T007 Run the full CLI project, the runtime suites beside the fixture and the check gate (.opencode/skills/system-spec-kit/runtime/cli)
- [x] T008 Run strict validation on this child and the parent, regenerate metadata, close the parent map row (../spec.md)
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
- [x] CHK-003 [P1] Dependencies identified and available
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks - `npm run check` exits 0
- [x] CHK-011 [P0] No console errors or warnings - both suites report only passes
- [x] CHK-012 [P1] Error handling implemented - the untracked and git-unavailable cases keep their assertions
- [x] CHK-013 [P1] Code follows project patterns - fixtures stay in temporary directories the suites remove
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met
- [x] CHK-021 [P0] Both suites pass in isolation and inside their projects
- [x] CHK-022 [P1] Edge cases tested - flag off, flag on, enforce; tracked, untracked, git unavailable
- [x] CHK-023 [P1] Error scenarios validated - both original failures were reproduced with their assertion output before the change
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`.
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep.
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests.
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases. - not applicable
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed.
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state. - the fake-git case still runs with a hostile PATH
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets
- [x] CHK-031 [P0] Input validation implemented - not applicable to a test fixture
- [x] CHK-032 [P1] Auth/authz working correctly - not applicable
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized
- [x] CHK-041 [P1] Code comments adequate
- [x] CHK-042 [P2] README updated (if applicable) - none needed
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only
- [x] CHK-051 [P1] scratch/ cleaned before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 11 | 11/11 |
| P1 Items | 11 | 11/11 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-09-07
<!-- /ANCHOR:summary -->

---
