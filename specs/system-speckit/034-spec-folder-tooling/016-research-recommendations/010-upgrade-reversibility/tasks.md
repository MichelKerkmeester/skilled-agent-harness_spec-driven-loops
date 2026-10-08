---
title: "Tasks: Phase 10: upgrade-reversibility"
description: "The task list for Phase 10: upgrade-reversibility, each task naming its file. Every task is open because the phase is planned, not built."
trigger_phrases:
  - "upgrade reversibility tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 10: upgrade-reversibility

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
## Phase 1: Tree State and Manifest Infrastructure

- [ ] T001 Implement `isCommittedTree()` in `.skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs` with `git -C <REPO>`, and refuse `--apply` when REPO is not a git repository
- [ ] T002 Implement `writeManifest()` in `upgrade-legacy.mjs` at `<git-dir>/upgrade-legacy.manifest.json` (`git -C <REPO> rev-parse --absolute-git-dir`) to record HEAD SHA, baseline map and a before-image (blob id from `git hash-object -w`, or bytes) for each dirty file the run touches
- [ ] T003 Implement `readManifestIfExists()` in `upgrade-legacy.mjs` to load manifest and validate tree state match
- [ ] T004 Add test fixture `.skilled/skills/system-spec-kit/runtime/cli/tests/fixtures/upgrade-legacy-dirty-tree/` with uncommitted changes
- [ ] T005 Add test fixture `fixtures/upgrade-legacy-manifest-recovery/` with a pre-written manifest
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Dry Run Listing and Apply Logic

- [ ] T006 Modify dry run output in `upgrade-legacy.mjs` to add "Downgrades" section that lists each finding the baseline will downgrade
- [ ] T007 Add logic to `--apply` to refuse on dirty tree without manifest location, or write manifest before first change
- [ ] T008 Add logic to restore baseline from manifest on second run, if manifest exists and tree state matches
- [ ] T009 Add test `upgrade-legacy.vitest.ts::dirty-tree-writes-manifest` that runs `--apply` on dirty fixture and checks for manifest
- [ ] T010 Add test `upgrade-legacy.vitest.ts::manifest-recovery` that reads manifest in a different fixture context
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification and Documentation

- [ ] T011 Add test `upgrade-legacy.vitest.ts::dirty-tree-idempotent` that runs `--apply` twice and asserts zero plan diff on second run
- [ ] T012 Add test `upgrade-legacy.vitest.ts::dry-run-lists-downgrades` that checks dry run output for downgrade lines
- [ ] T013 Add test `upgrade-legacy.vitest.ts::dirty-tree-unwritable-manifest` that verifies tool refuses when manifest location is not writable
- [ ] T016 Add test `upgrade-legacy.vitest.ts::no-git-refuses-apply` that runs `--apply` in a sandbox with no git and expects a refusal before any write
- [ ] T017 Add test `upgrade-legacy.vitest.ts::manifest-before-image-restores` that restores a dirty file from the manifest and compares bytes
- [ ] T014 Update `.skilled/skills/system-spec-kit/runtime/cli/spec/README.md` to document manifest structure, location, and recovery procedure
- [ ] T015 Run full test suite `npm run test -- upgrade-legacy.vitest.ts` and verify all new tests pass
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
| P0 Items | [X] | [ ]/[X] |
| P1 Items | [Y] | [ ]/[Y] |
| P2 Items | [Z] | [ ]/[Z] |

**Verification Date**: 2026-10-08
<!-- /ANCHOR:summary -->

---



