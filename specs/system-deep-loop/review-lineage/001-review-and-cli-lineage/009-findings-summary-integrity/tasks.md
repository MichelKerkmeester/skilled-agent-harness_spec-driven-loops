---
title: "Tasks: Phase 9: findings-summary-integrity"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "findings summary integrity tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 9: findings-summary-integrity

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

- [x] T001 Scaffold the phase under the parent (`009-findings-summary-integrity/`)
- [x] T002 Trace the phantom rows to their cause (`reduce-state.cjs:625`, `:811`-`:832`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Regression tests first: a `findingId` delta row and a cumulative summary (`.skilled/skills/system-deep-loop/deep-review/scripts/tests/reduce-state-summary-fallback.test.cjs:295`, `:317`, `:376`). Evidence: red on the HEAD reducer, exit 1 for each case (AC-001, AC-002, AC-006); the lane did not record its own red run, so the phase recorded it from a mirror run.
- [x] T004 Accept `findingId` in `deltaRecordToFinding` (`.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:626`). Evidence: AC-001, one-file test exit 0 with `tests 1 pass 1`.
- [x] T005 Make the summary fallback cumulative-aware (`.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:801`, `:1079`). Evidence: AC-002 and AC-003.
- [x] T006 Review the change with a fresh SWE session. Evidence: rv-open requested changes at `specs/hooks/023-session-relaunch-loop/scratch/run-ledger.md:468`, and rv2 reviewed the fixes at `specs/hooks/023-session-relaunch-loop/scratch/run-ledger.md:474` and `specs/hooks/023-session-relaunch-loop/scratch/run-ledger.md:475`.
- [x] T010 Accept `findingId` in the verifier's delta enumeration (`.skilled/skills/system-deep-loop/runtime/scripts/verify-iteration.cjs:200`, `:205`) with two table cases (`.skilled/skills/system-deep-loop/runtime/tests/unit/verify-iteration.vitest.ts:623`, `:624`). Evidence: AC-005, vitest 31 of 31 exit 0.
- [x] T011 Merge the main and delta iteration records in the resolved-id scans, add the iteration-type guard and the comment at `summaryIsCumulative` (`.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:801`, `:815`, `:1079`, `:1093`). Evidence: AC-006 and `specs/hooks/023-session-relaunch-loop/scratch/run-ledger.md:471`.
- [x] T012 Disposition the review findings in scope. Evidence: the string-only verifier id is accepted with its rationale at `specs/hooks/023-session-relaunch-loop/scratch/run-ledger.md:475`, the rv2 P0 is disproved live at `specs/hooks/023-session-relaunch-loop/scratch/run-ledger.md:475`, and the Pi findings belong to `specs/hooks/023-session-relaunch-loop/005-deep-review-remediation/`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 Run the deep-loop script tests. Evidence: the summary-fallback test exits 0 with `tests 1 pass 1 fail 0`, and `runtime/tests/unit/verify-iteration.vitest.ts` exits 0 with 31 of 31. The five `STALE_SOURCE_DIGEST` failures in the full unit folder are inherited from main and recorded as pre-existing at `specs/hooks/023-session-relaunch-loop/scratch/run-ledger.md:473`.
- [x] T008 Rerun the reducer on the relaunch-loop review folder and confirm P2 12 with no `SUMMARY-` row. Evidence: AC-004, the rerun on a scratch copy exits 0 and reproduces the on-disk open findings exactly.
- [x] T009 Strict validation of this phase. Evidence: `validate.sh` on this folder with `--strict` exits 0 and prints `RESULT: PASSED`, Errors 0, Warnings 0 (recorded in implementation-summary.md).
- [x] T013 Repair derived outputs and save continuity for this phase. Evidence: `repair-derived.cjs --folder` with `--apply` exits 0 (`repaired=1`), then the continuity save exits 0 after its two compact fields were shortened to pass the writer's checks.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed (the AC-004 rerun on a scratch copy of the relaunch-loop packet)
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

- [x] CHK-010 [P0] Code passes lint/format checks. Evidence: `node --check` exits 0 on `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs` and `.skilled/skills/system-deep-loop/runtime/scripts/verify-iteration.cjs`; no separate lint step is configured for these two files in this phase.
- [x] CHK-011 [P0] No console errors or warnings. Evidence: the one-file summary-fallback run and the verify-iteration vitest run printed no warning lines (grep for `warn` and `deprecat` returned 0 in both outputs).
- [x] CHK-012 [P1] Error handling implemented. Evidence: a malformed delta still fails closed (`.skilled/skills/system-deep-loop/deep-review/scripts/tests/reduce-state-summary-fallback.test.cjs:258`), and the one-file run exits 0.
- [x] CHK-013 [P1] Code follows project patterns. Evidence: the fresh SWE reviews rv-open and rv2 (`specs/hooks/023-session-relaunch-loop/scratch/run-ledger.md:468`, `:475`) found no pattern defect in the reducer change.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met. Evidence: acceptance-criteria.md AC-001 to AC-007 all Met.
- [x] CHK-021 [P0] Manual testing complete. Evidence: the reducer rerun on a scratch copy of the packet (AC-004) is the manual check; no live behavior changed.
- [x] CHK-022 [P1] Edge cases tested. Evidence: a row with both keys registers under `id` only, with no summary-only row (`.skilled/skills/system-deep-loop/deep-review/scripts/tests/reduce-state-summary-fallback.test.cjs:446`). A row whose `findingId` is empty creates no finding, and its run pads exactly as it would without the row (`.skilled/skills/system-deep-loop/deep-review/scripts/tests/reduce-state-summary-fallback.test.cjs:474`). Both passed on the first run with no reducer change; the suite reports pass 1, fail 0.
- [x] CHK-023 [P1] Error scenarios validated. Evidence: malformed delta and invalid reducer flags fail closed (`.skilled/skills/system-deep-loop/deep-review/scripts/tests/reduce-state-summary-fallback.test.cjs:258`, `:276`), and the one-file run exits 0.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`. Evidence: both reducer defects are `class-of-bug` (the id key and the summary shape are read by more than one producer), as recorded in the AC-001 and AC-002 rows.
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep. Evidence: `rg -n "record\.id\b" .skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs` returns one intake site at `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:626`.
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests. Evidence: `rg -n "summary-only" .skilled/skills/system-deep-loop` lists the producer at `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:850` (unchanged) and the test assertions in `.skilled/skills/system-deep-loop/deep-review/scripts/tests/reduce-state-summary-fallback.test.cjs`.
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases. Evidence: not applicable in the delimiter, joined-input and outside-root sense, since the fix is a key-name alias and not a parser of delimited text. Covered: the no-op case (a row with neither key does not enumerate, `verify-iteration.vitest.ts:624`) and the fallback cases (`reduce-state-summary-fallback.test.cjs:119`, `:410`, `:428`). The both-keys and empty-key cases are covered at `reduce-state-summary-fallback.test.cjs:446` and `:474`.
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed. Evidence: axes are id key (`id`, `findingId`, neither) by summary shape (per run, cumulative, absent), and the cases are the fourteen `testX` calls in `reduce-state-summary-fallback.test.cjs` plus the two verifier table rows.
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state. Evidence: the reducer refuses a spec folder outside the approved roots or the OS temp dir, so the scratch rerun set `TMPDIR` to the scratch root, and the reducer exited 0 under that variant.
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range. Evidence: the fix is uncommitted on top of `b830fd0276`, the same base as packet 005; the commit SHA is added at commit time.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets. Evidence: a pattern scan of the added lines for secret, password, api-key, token and bearer found 0 matches.
- [x] CHK-031 [P0] Input validation implemented. Evidence: a row with neither key is dropped (`verify-iteration.vitest.ts:624`), and a malformed delta fails closed (`reduce-state-summary-fallback.test.cjs:258`).
- [x] CHK-032 [P1] Auth/authz working correctly. Evidence: not applicable, since the phase changes no authentication or authorization surface.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized. Evidence: spec.md (REQ-005 to REQ-007), plan.md (affected surfaces and Definition of Done) and acceptance-criteria.md (AC-005 to AC-007) all name the verifier and the resolved-id scan change.
- [x] CHK-041 [P1] Code comments adequate. Evidence: the comment at `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:796` states the cumulative-summary trade-off that REQ-006 required.
- [x] CHK-042 [P2] README updated (if applicable). Evidence: the row for `reduce-state-summary-fallback.test.cjs` in `.skilled/skills/system-deep-loop/deep-review/scripts/tests/README.md:20` now names the `findingId` key, running-total summaries and delta-only resolutions; `validate_document.py` reports it valid.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only. Evidence: the red-run mirror and the rerun copy live in the session scratchpad, outside the repository.
- [x] CHK-051 [P1] scratch/ cleaned before completion. Evidence: the packet scratch folder holds only `.gitkeep`.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-10-18
<!-- /ANCHOR:summary -->

---
