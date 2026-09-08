---
title: "Tasks: Shared package post-remediation cleanup"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "shared cleanup tasks"
  - "profile cluster tasks"
  - "reader table tasks"
  - "verification checklist"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Shared package post-remediation cleanup

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

- [x] T001 Re-check every round-two row: consumer counts, file existence, the parity test's output (../003-shared-package-utilization/research/confirmed-findings.md)
- [x] T002 Read the profile cluster, the factory's candidate scan and the socket test's assertion style (.opencode/skills/system-spec-kit/shared)
- [x] T003 [P] List which files read each variable group (.opencode/skills/system-spec-kit/shared/README.md)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Remove the `main` field and the empty test globs (.opencode/skills/system-spec-kit/shared/package.json)
- [x] T005 Remove the database cluster and the extended type (.opencode/skills/system-spec-kit/shared/embeddings/profile.ts)
- [x] T006 Remove the scoring module, its README and its two tests; rewrite the two comments that cited it (.opencode/skills/system-spec-kit/shared/scoring)
- [x] T007 Export the socket file name and hold the two bin scripts to it; add the two utility tests; fix the test comment (.opencode/skills/system-spec-kit/shared/ipc/socket-server.test.ts)
- [x] T008 Drop the CLI re-export and point its test at the shared module (.opencode/skills/system-spec-kit/runtime/cli/core/tree-thinning.ts)
- [x] T009 Compute the reader table, reword the config row, drop the structure entries (.opencode/skills/system-spec-kit/shared/README.md)
- [x] T010 Drop the two baseline rows for removed READMEs (.opencode/skills/sk-doc/scripts/tests/code-folder/baseline-readme-verdicts.json)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 Build shared from clean and run its lane; rebuild the CLI and run the check gate; build the runtime; check dist freshness (.opencode/skills/system-spec-kit)
- [x] T012 Run the tree-thinning and index-scope suites; search for residue; run the sk-doc validator on the README (.opencode/skills/system-spec-kit/runtime)
- [x] T013 Run strict validation on this child, the lane and the parent; regenerate metadata; close the parent map row (../spec.md)
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

- [x] CHK-010 [P0] Code passes lint/format checks - three builds exit 0; `npm run check` exit 0
- [x] CHK-011 [P0] No console errors or warnings - dist freshness reports every output fresh
- [x] CHK-012 [P1] Error handling implemented - the JSONC test covers markers inside strings; the context-type test covers an unknown value
- [x] CHK-013 [P1] Code follows project patterns - the new tests use the package's script-style assertion helper
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met
- [x] CHK-021 [P0] Shared lane 12 files pass; tree-thinning 28; index-scope 7
- [x] CHK-022 [P1] Edge cases tested - comment markers inside JSON strings; a legacy alias; an unknown type
- [x] CHK-023 [P1] Error scenarios validated - the socket assertion reads the two bin scripts and would fail on a renamed literal
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`.
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep.
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests.
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases. - not applicable
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed.
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state. - not applicable
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets
- [x] CHK-031 [P0] Input validation implemented - not applicable
- [x] CHK-032 [P1] Auth/authz working correctly - not applicable
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized
- [x] CHK-041 [P1] Code comments adequate
- [x] CHK-042 [P2] README updated (if applicable)
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
