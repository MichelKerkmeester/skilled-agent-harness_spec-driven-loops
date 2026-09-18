---
title: "Tasks: Phase 14: fix-pre-existing-defects-found-by-migration"
description: "Ordered tasks for the pre-existing defects phases 12 and 13 recorded, and the CI jobs that keep them from returning."
trigger_phrases:
  - "pre-existing defects tasks"
  - "phase 14 tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 14: fix-pre-existing-defects-found-by-migration

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

- [x] T001 Size each defect and find its cause before choosing a fix
- [x] T002 Run every sk-doc script test and the standalone deep-loop suite for a baseline
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Start scaffolded skills at `1.0.0.0` and fix the scaffolded reports index (`.skilled/skills/sk-doc/sk-create-skill/scripts/init_skill.py`)
- [x] T004 Refresh the durable-directory manifest, drop the deleted README from the verdict baseline, follow the renamed directive heading, and bring four validator fixtures up to the current rules (`.skilled/skills/sk-doc/scripts/tests/`)
- [x] T005 Move the cli-cursor README paragraph out of its frontmatter (`.skilled/skills/cli-external-orchestration/cli-cursor/benchmark/README.md`)
- [x] T006 Send test runs' council graph writes to a scratch directory, with a guard test (`.skilled/skills/system-deep-loop/runtime/`)
- [x] T007 Back up and reinstall the Codex hooks from the main checkout (`~/.codex/hooks.json`)
- [x] T008 Rewrite 22 hook-flags imports to stay inside their own source root, and resolve each from its run location
- [x] T009 [P] Make four session scripts source hook-flags relative to themselves, and pick hook-flags config by the sentinel and by real path
- [x] T010 [P] Name the search root as the checkout names it (`.skilled/skills/system-spec-kit/runtime/cli/retrieval/rg-wrapper.mjs`)
- [x] T011 [P] Log three plugins' advisories under the selected source root (`.opencode/plugins/`)
- [x] T012 Add the deep-loop and sk-doc CI workflows, a test runner, and a manifest refresh mode (`.github/workflows/`)
- [x] T013 Regenerate the trigger index after the phase docs are final
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T014 Run each new test against the code before its fix and confirm it fails
- [x] T015 Run the node gate, the standalone deep-loop suite and every sk-doc script test
- [x] T016 Run the sk-doc job in a clean clone under Node 22
- [x] T017 Run the deep-loop job in a clean clone under Node 22
- [x] T018 Push both branches after the operator's go-ahead and watch CI
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

- [x] CHK-010 [P0] Code passes lint/format checks. Every commit passed the pre-commit gates
- [x] CHK-011 [P0] No console errors or warnings introduced
- [x] CHK-012 [P1] Error handling implemented. Every hook-flags lookup stays fail-open
- [x] CHK-013 [P1] Code follows project patterns. The new parsers and helpers copy their siblings
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met. AC-009 is met by 23 green runs on `c2c3fd42c0`
- [x] CHK-021 [P0] Manual testing complete
- [x] CHK-022 [P1] Edge cases tested. The `.opencode`-only layout for every changed caller
- [x] CHK-023 [P1] Error scenarios validated. Each new test fails against the code before its fix
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each finding has a class. Scaffold version: `algorithmic`. Unrun tests: `matrix/evidence`. Council database: `test-isolation`. Root-name hardcodes: `class-of-bug`. Codex hooks: `instance-only`.
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed with the `rg` commands in `plan.md`.
- [x] CHK-FIX-003 [P0] Consumer inventory completed for every changed helper and constant.
- [x] CHK-FIX-004 [P0] Path fixes carry layout tests for both source-root names.
- [x] CHK-FIX-005 [P1] Matrix axes listed: two layouts by four kinds of caller.
- [x] CHK-FIX-006 [P1] The council database guard runs with the real environment the helper sets.
- [x] CHK-FIX-007 [P1] Evidence pinned to `09dc188d3c..HEAD` on the phase branch.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets
- [x] CHK-031 [P0] No private home-derived path in any tracked file
- [x] CHK-032 [P1] No gate bypass variable used
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized
- [x] CHK-041 [P1] No ephemeral ids in code comments
- [x] CHK-042 [P2] Workflows README updated
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in the session scratchpad only
- [x] CHK-051 [P1] scratch/ holds nothing but its placeholder
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-09-19
<!-- /ANCHOR:summary -->

---
