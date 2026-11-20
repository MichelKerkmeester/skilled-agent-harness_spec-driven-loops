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
- [ ] T003 List every engine path that reads or walks the overlay folder (`.skilled/commands/doctor/scripts/overlay-engine.cjs`). Verify: the list is in `implementation-summary.md`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Classify each overlay-folder README as shipping or documentation only (`.skilled/commands/doctor/scripts/overlay-engine.cjs`). Verify: the classifier tests in `.skilled/commands/doctor/scripts/tests/overlay-engine-readmes.test.cjs` pass.
- [ ] T005 Add the docs leg to `status --audit`: DOCS lines, `docs=`, the `--json` `docs` key and the skipped line (`.skilled/commands/doctor/scripts/overlay-engine.cjs`). Verify: the docs-leg tests pass and the no-README adopter keeps its exit code.
- [ ] T006 Keep a documentation-only README out of apply, adopt, capture, `repin --stage` and every report (`.skilled/commands/doctor/scripts/overlay-engine.cjs`). Verify: one passing test per command.
- [ ] T007 Refuse a manifest that lists one layout-link path twice (`.skilled/commands/doctor/scripts/overlay-engine.cjs`). Verify: the duplicate-path test passes and the tree is byte-identical after the refused `apply`.
- [ ] T008 [P] Describe README roles, the DOCS lines and the duplicate refusal (`.skilled/skills/system-skilled-doctor/references/overlays.md`, `.skilled/commands/doctor/assets/doctor-overlay-presentation.txt`, `.skilled/commands/doctor/overlay.md`). Verify: `rg -n 'DOCS' <each file>` prints a line.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T009 Run the new tests against the engine at `bf6806ad4b3`. Verify: every behavior-change test fails there.
- [ ] T010 Run the engine, guard and contract suites (`.skilled/commands/doctor/scripts/tests/`). Verify: each exits 0, the engine suite with more than 294 tests.
- [ ] T011 Run `status --audit` on Barter's tree with the old and the new engine. Verify: the `RESULT:` line and exit code match.
- [ ] T012 Run the @review pass and fix until it approves. Verify: the final `Review status:` line is a pass.
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

- [x] CHK-001 [P0] Requirements documented in spec.md
- [x] CHK-002 [P0] Technical approach defined in plan.md
- [x] CHK-003 [P1] sk-doc's validator exists at `.skilled/skills/sk-doc/scripts/validate_document.py`
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] `node --check .skilled/commands/doctor/scripts/overlay-engine.cjs` exits 0
- [ ] CHK-011 [P0] The engine suite prints `fail 0`
- [ ] CHK-012 [P1] A missing validator prints one `DOCS     skipped:` line instead of failing
- [ ] CHK-013 [P1] No code comment carries a spec path or id: the pre-commit comment-hygiene gate passes
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] Every row of `acceptance-criteria.md` is `Met`
- [ ] CHK-021 [P0] The Barter `status --audit` comparison matches the old engine's result and exit code
- [ ] CHK-022 [P1] The walk skip list and the unfollowed link are tested
- [ ] CHK-023 [P1] The no-README adopter keeps its result with and without `--audit`
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

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

- [ ] CHK-030 [P0] The validator is spawned with an argument array and no shell
- [ ] CHK-031 [P0] The walk never follows a link out of the overlay folder
- [ ] CHK-032 [P1] N/A: the change touches no authentication
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] `spec.md`, `plan.md` and `tasks.md` name the same DOCS lines as the contract
- [ ] CHK-041 [P1] Code comments state the durable reason for the advisory severity
- [ ] CHK-042 [P2] `overlays.md` describes the README roles
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in scratch/ only
- [ ] CHK-051 [P1] scratch/ holds only the contract and `.gitkeep` at completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 9 | 2/9 |
| P1 Items | 11 | 1/11 |
| P2 Items | 1 | 0/1 |

**Verification Date**: 2026-11-20
<!-- /ANCHOR:summary -->

---



