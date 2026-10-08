---
title: "Tasks: Phase 1: spec-template-anchor-nesting"
description: "The task list for Spec template anchor nesting, each task naming its file. Every task is done and carries its evidence."
trigger_phrases:
  - "spec template anchor nesting tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 1: spec-template-anchor-nesting

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

- [x] T001 Verify the current template anchor positions: opener at line 184 (unconditional), closers at lines 399 (L1/L2/L3) and 425 (L3+). Evidence: `git show HEAD:<template> | grep -n 'ANCHOR:questions'` returns 184, 399 and 425
- [x] T002 Identify all per-level Open Questions headings: L1 at line 307, L2 at 303, L3 at 392, L3+ at 389. Evidence: `grep -n 'OPEN QUESTIONS'` on the baseline template returns 303, 307, 389 and 392
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Add a per-level opening tag for each level (L1, L2, L3, L3+) directly above the level's Open Questions heading, guarded by the level conditional (`.skilled/skills/system-spec-kit/templates/core/spec.md.tmpl`). Evidence: four openers now at template lines 302 (L2), 307 (L1), 390 (L3+) and 394 (L3), each directly above its heading, and the unconditional opener at old line 184 is gone
- [x] T004 Move the shared closer from line 399 to just before RELATED DOCUMENTS (for L1/L2/3 closer). Done differently: the closer was not moved. At line 399 it already sat directly after Question 2, so only the opener moved and the closer stayed (now line 405); the snapshot diff shows no closer change for L1, L2 and L3
- [x] T005 Move the L3+ closer from line 425 to just before RELATED DOCUMENTS in the L3+ conditional block. Evidence: it now sits at line 401 inside an `IF level:3+` block, directly after Question 1, and RELATED DOCUMENTS follows the closer in the 3+ snapshot
- [x] T006 Add `assert` calls to the test to check no anchor nesting, pairing and order (`.skilled/skills/system-spec-kit/runtime/cli/tests/scaffold-golden-snapshots.vitest.ts`). Done with vitest `expect` inside one helper, `expectAnchorsWellOrdered`, instead of `assert` calls. It tracks the open anchor, fails on nesting, on a closer with no matching opener and on an unclosed anchor, and skips fenced code. It runs on the spec.md of L1, L2, L3 and L3+, the phase-parent spec, and (after review round 1) the review and research spec templates
- [x] T007 Run `npx vitest run runtime/cli/tests/scaffold-golden-snapshots.vitest.ts` to capture new snapshots. Evidence: 12 passed, 3 snapshots updated (2, 3, 3+). As a negative control, the new assertions failed 2 tests against the old template ("2-spec.md: anchor nfr nested inside questions", "3+-spec.md: approval-workflow nested inside questions")
- [x] T008 Review the snapshot diff to verify only anchor positions changed. Evidence: the diff for the 2, 3 and 3+ spec entries is only the questions opener and closer moving. Review round 1 later added one new `review-spec.md` entry, which is an addition, not a change
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Create a test L2 packet with `create.sh` and verify the spec.md passes `validate.sh --strict` on ANCHORS_VALID. Evidence: `create.sh --level 2` render under a throwaway `specs/zz-gate-001/` path, `validate.sh --strict` RESULT: PASSED with Errors 0 (ANCHORS_VALID is an ERROR-severity rule), and a node stack check found no nesting and no unclosed anchor. An L1 render passed the same checks. The throwaway folder was removed
- [x] T010 Create a test L3 packet and verify the spec.md has the fixed anchor layout. Evidence: `create.sh --level 3` render, `validate.sh --strict` RESULT: PASSED, and a node stack check found no nesting and no unclosed anchor
- [x] T011 Create a test L3+ packet and verify the spec.md has the fixed anchor layout. Evidence: `create.sh --level 3+` render, `validate.sh --strict` RESULT: PASSED, and a node stack check found no nesting and no unclosed anchor
- [x] T012 Run the full spec-kit test suite: `npx vitest run runtime/cli/tests` and verify no regressions. Evidence: ran as `npm --prefix .skilled/skills/system-spec-kit/runtime/cli test` (the cli vitest project plus the legacy and validation suites) at the wave 1 final gate: rc 0, 162 files passed and 3 skipped, 1648 tests passed and 19 skipped, 0 failed, against a baseline of 161 files and 1639 passed
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`. T001 to T012 are ticked above; T004 was done differently and says so
- [x] No `[B]` blocked tasks remaining. No task carries a `[B]` marker
- [x] Manual verification passed. `create.sh` renders at L1, L2, L3 and L3+ each passed `validate.sh --strict` and a node anchor stack check (T009 to T011)
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

- [x] CHK-001 [P0] Requirements documented in spec.md. REQ-001 to REQ-005 in spec.md section 4
- [x] CHK-002 [P0] Technical approach defined in plan.md. plan.md sections 1 to 3
- [x] CHK-003 [P1] Dependencies identified and available. plan.md section 6 lists the template pipeline and vitest snapshot infrastructure; the spec names no other phase as a dependency
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks. `npm --prefix .skilled/skills/system-spec-kit/runtime/cli run check` (lint plus the boundary checks): rc 0; CLI typecheck rc 0; build rc 0
- [x] CHK-011 [P0] No console errors or warnings. A re-run of `scaffold-golden-snapshots.vitest.ts` in CI mode printed 12 passed and no error; its only notice is Vite's configLoader warning about `vitest.config.ts`, a file this phase did not touch
- [x] CHK-012 [P1] Error handling implemented. Each assertion in `expectAnchorsWellOrdered` carries a label naming the document and the offending anchor, which is how the negative control reported "anchor nfr nested inside questions"
- [x] CHK-013 [P1] Code follows project patterns. The helper uses vitest `expect` and the render helpers already in the file; review round 1 raised one P1 (a template the test never rendered), fixed in round 1
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met. AC-001 to AC-005 are Met in acceptance-criteria.md
- [x] CHK-021 [P0] Manual testing complete. `create.sh` renders at L1, L2, L3 and L3+ (T009 to T011)
- [x] CHK-022 [P1] Edge cases tested. All four levels are rendered and asserted, because the closer position differs between L3+ and the others; the phase-parent, review and research spec templates are asserted too
- [x] CHK-023 [P1] Error scenarios validated. Against the old template the new assertions failed 2 tests with named messages ("2-spec.md: anchor nfr nested inside questions", "3+-spec.md: approval-workflow nested inside questions")
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`. The one finding (review round 1 P1: `review.spec.md.tmpl` not rendered by the golden test) is `matrix/evidence`, a template missing from the render matrix
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep. The spec-shaped templates are `spec.md.tmpl` (L1, L2, L3, L3+), the phase-parent spec, `review.spec.md.tmpl` and `research.spec.md.tmpl`; the golden test now asserts anchor order on all of them. Review found the review template flat and the research template was already rendered. `rg 'ANCHOR:questions'` over `templates/` finds the anchor in those templates plus the three `templates/examples/` specs, and an awk scan found no other anchor inside the questions anchor in any of the three examples
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests. plan.md lists the anchor consumers (`template-structure.js`, the spec merger, the validator) and the one producer (`create.sh` through `render_template`); none changed code, and the wave 1 suite stayed green (1648 passed, 0 failed)
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases. not applicable: the change moves literal anchor comments in a template and adds a test helper that reads rendered text; no security, path, parser or redaction code changed
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed. Axes: four spec.md levels (1, 2, 3, 3+) plus the phase-parent, review and research spec renders. Snapshots: 3 updated (2, 3, 3+), 1 added (review-spec), 25 entries in the file against 24 at the baseline; 12 tests in the file, all passing
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state. not applicable: the new helper reads only the rendered string it is given and no environment or global state
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range. The phase is uncommitted, so the range is the working-tree diff of the three files in spec.md against `c85ec7f880` (template +7/-4, test +40/-1, snapshot +106/-6), with the test baseline taken at the same SHA. Re-pin to the wave 1 commit SHA once it exists
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets. The diff of the three changed files holds only anchor comments, regexes and test code
- [x] CHK-031 [P0] Input validation implemented. not applicable: no runtime input is parsed; the helper checks rendered template text inside a test
- [x] CHK-032 [P1] Auth/authz working correctly. not applicable: no authentication or authorization surface is touched
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized. spec.md, tasks.md, acceptance-criteria.md, implementation-summary.md and goal.md were closed together and `validate.sh --strict` passes
- [x] CHK-041 [P1] Code comments adequate. The one new comment states why the anchors must stay flat and balanced, with no packet or task labels
- [x] CHK-042 [P2] README updated (if applicable). not applicable: the change fixes a template to match its intended layout and changes no documented behavior
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only. The throwaway `create.sh` renders went to `specs/zz-gate-001/` and were removed
- [x] CHK-051 [P1] scratch/ cleaned before completion. `scratch/` holds only `.gitkeep`
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-10-08
<!-- /ANCHOR:summary -->

---



