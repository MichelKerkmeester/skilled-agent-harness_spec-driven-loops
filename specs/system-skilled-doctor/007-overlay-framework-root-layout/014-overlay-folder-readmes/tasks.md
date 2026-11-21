---
title: "Tasks: Phase 14: overlay-folder-readmes"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "overlay folder readmes tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 14: overlay-folder-readmes

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

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Write the README contract the ai-speckit session follows (`scratch/overlay-readme-contract.md`, copied to the shared scratchpad). Verify: `diff` of the two copies prints nothing.
- [x] T002 Capture the gate baselines (`/tmp/ovl-gates/g-base2.txt`). Verify: the engine suite prints `pass 294`.
- [x] T003 List every engine path that reads or walks the overlay folder (`.skilled/commands/doctor/scripts/overlay-engine.cjs`). Verify: the list is in `implementation-summary.md`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Classify each overlay-folder README as shipping or documentation only (`.skilled/commands/doctor/scripts/overlay-engine.cjs`). Verify: the classifier tests in `.skilled/commands/doctor/scripts/tests/overlay-engine-readmes.test.cjs` pass.
- [x] T005 Add the docs leg to `status --audit`: DOCS lines, `docs=`, the `--json` `docs` key and the skipped line (`.skilled/commands/doctor/scripts/overlay-engine.cjs`). Verify: the docs-leg tests pass and the no-README adopter keeps its exit code.
- [x] T006 Keep a documentation-only README out of apply, adopt, capture, `repin --stage` and every report (`.skilled/commands/doctor/scripts/overlay-engine.cjs`). Verify: one passing test per command.
- [x] T007 Refuse a manifest that lists one layout-link path twice (`.skilled/commands/doctor/scripts/overlay-engine.cjs`). Verify: the duplicate-path test passes and the tree is byte-identical after the refused `apply`.
- [x] T008 [P] Describe README roles, the DOCS lines and the duplicate refusal (`.skilled/skills/system-skilled-doctor/references/overlays.md`, `.skilled/commands/doctor/assets/doctor-overlay-presentation.txt`, `.skilled/commands/doctor/overlay.md`). Verify: `rg -n 'DOCS' <each file>` prints a line.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Run the new tests against the engine at `bf6806ad4b3`. Verify: every behavior-change test fails there.
- [x] T010 Run the engine, guard and contract suites (`.skilled/commands/doctor/scripts/tests/`). Verify: each exits 0, the engine suite with more than 294 tests.
- [x] T011 Run `status --audit` on Barter's tree with the old and the new engine. Verify: the `RESULT:` line and exit code match.
- [x] T012 Run the @review pass and fix until it approves, at most five rounds as the brief caps it. Verify: the final `Review status:` line is a pass, or the cap is reached with what is left recorded. Evidence: rounds one to four each failed and were fixed. Round five failed on one P1, the capital sharp s, fixed red-first in `fcc8df4983f` with no sixth round; recorded in `implementation-summary.md` Known Limitations 5.
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
- [x] CHK-003 [P1] sk-doc's validator exists at `.skilled/skills/sk-doc/scripts/validate_document.py`
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `node --check .skilled/commands/doctor/scripts/overlay-engine.cjs` exits 0
- [x] CHK-011 [P0] The engine suite prints `fail 0`
- [x] CHK-012 [P1] A missing validator prints one `DOCS     skipped:` line instead of failing
- [x] CHK-013 [P1] No code comment carries a spec path or id: the pre-commit comment-hygiene gate passes
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] Every row of `acceptance-criteria.md` is `Met`
- [x] CHK-021 [P0] The Barter `status --audit` comparison matches the old engine's result and exit code
- [x] CHK-022 [P1] The walk skip list and the unfollowed link are tested
- [x] CHK-023 [P1] The no-README adopter keeps its result with and without `--audit`
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [x] CHK-FIX-001 [P0] Each review finding carries a class in the review reports: the spelling and case duplicates are `class-of-bug`, adopt's write order, the timeout and the readdir skip are `instance-only`.
- [x] CHK-FIX-002 [P0] Same-class producers: `duplicateLayoutLinkPath` is the only place the duplicate key is built, and the round-1 review proved it by grep against `exactManifestPaths` and the planner.
- [x] CHK-FIX-003 [P0] Consumers: every engine reader of the overlay folder is listed in `implementation-summary.md`, and the docs that quote the new lines are `overlays.md`, the presentation, the status workflow and `overlay.md`.
- [x] CHK-FIX-004 [P0] The duplicate table in `overlay-engine-fixes.test.cjs` runs `./a` with `a/`, `ext/.`, `x/../ext`, `a//b`, the case pair, an accented name in both forms, a nested case variant in both orders, a sharp-s spelling nested and listed twice, and distinct paths, each as its own subtest.
- [x] CHK-FIX-005 [P1] Matrix: two overlay placements (in-tree, sibling) by two README names, across apply, adopt, capture, guard, pre-commit, relayout and `repin --stage`; 46 readmes tests in all.
- [x] CHK-FIX-006 [P1] Process-wide state: the fixtures read `OVERLAY_ENGINE_UNDER_TEST` once to pick the engine file, used only for red-first runs. `OVERLAY_DOCS_VALIDATOR_TIMEOUT_MS` is passed only in the one spawned engine's env, and the case probe reads the fixture's own filesystem.
- [x] CHK-FIX-007 [P1] Evidence is pinned to commits `3a9f1567d95`, `6928c1eabe2`, `bcdf8d95037`, `b4a669a6c87`, `e29e24eb277` and `49c109910e1`, and red-first runs to the engine at `bf6806ad4b3`, `3a9f1567d95`, `b872197e348`, `ff969f029fb`, `09999719d31` and `e29e24eb277`.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] The validator is spawned with an argument array and no shell
- [x] CHK-031 [P0] The walk never follows a link out of the overlay folder
- [x] CHK-032 [P1] N/A: the change touches no authentication
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] `spec.md`, `plan.md` and `tasks.md` name the same DOCS lines as the contract
- [x] CHK-041 [P1] Code comments state the durable reason for the advisory severity
- [x] CHK-042 [P2] `overlays.md` describes the README roles
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only
- [x] CHK-051 [P1] scratch/ holds only the contract and `.gitkeep` at completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 9 | 9/9 |
| P1 Items | 11 | 11/11 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-11-20
<!-- /ANCHOR:summary -->

---



