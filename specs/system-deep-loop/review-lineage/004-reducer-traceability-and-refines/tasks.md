---
title: "Tasks: Correct deep-review reducer dead ends and refinement counting"
description: "Ordered failing-first test, reducer change and verification tasks for the deep-review reducer packet."
trigger_phrases:
  - "reducer traceability and refines tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Correct deep-review reducer dead ends and refinement counting

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

**Variables**: `R` is `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs`. `T` is `.skilled/skills/system-deep-loop/deep-review/scripts/tests/reduce-state-traceability-and-refines.test.cjs`. `P` is `.skilled/skills/system-deep-loop/deep-review/assets/prompt-pack-iteration.md.tmpl`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read the parser, registry and boundary functions in `R`. Observed: `rg -n "deadEndsSection|function buildFindingRegistry|function buildExhaustedApproaches|function deltaRecordToFinding|function findingDetailToFinding" R` printed 6 lines, naming the five symbols plus the dead-end return site.
- [x] T002 Read every `deadEnds` reader and every structured traceability reader. Observed: `rg -n "deadEnds|traceabilityChecks" R` listed `parseIterationFile` (lines 352 and 376), `buildExhaustedApproaches` (line 1842) and `buildTraceabilityRollup` (line 1405).
- [x] T003 Read the iteration 8 delta shape and the false BLOCKED strategy lines. Observed: `jq '.findingDetails[0] | {id, refinementOf, title}'` printed `{"id":"R1-P2-001","refinementOf":"R1-P2-001","title":"README treats an empty startup checksum as proof that the wrapper did not change"}`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Add the three failing-first cases to `T`, with a temporary review fixture, a minimal strategy file and the strategy assertion on `reduceReviewState(..., { write: false, createMissingAnchors: true })`. Observed: `node --test T` exited 1 with `traceability checks do not become blocked dead ends` and `a refines row folds into its target` failing, while `an id reuse without refines keeps both findings` passed. Saved in `scratch/red.txt`.
- [x] T005 Stop mapping `Traceability Checks` to dead ends in `parseIterationFile` at `R`. Observed: `node --test T` now passes the traceability case and the explicit `Dead Ends` assertion.
- [x] T006 Carry `refines` from `findingDetails[]` in `findingDetailToFinding` and from `type:"finding"` rows in `deltaRecordToFinding`, reading `record.refines || record.refinementOf` and normalizing it as text (`R`). Observed: the fold case reaches `upsertFinding` with `refines` populated from `refinementOf`.
- [x] T007 Fold a finding with a resolvable `refines` target in `upsertFinding` before the content-based id-reuse split, updating `lastSeen`, title, description and one transition, then return (`R`). Observed: the fold case passes with `openFindingsCount` 1, `lastSeen` 2 and the refinement title.
- [x] T008 Ignore transitions whose `from` equals `to` in the `persistentSameSeverity` and `severityChanged` filters (`R`). Observed: the fold case passes with `severityChanged` length 0 and the finding in `persistentSameSeverity`.
- [x] T009 Add one line to the iteration output contract in `P` that says to write `refines` with an existing finding id for a refinement and omit it for a new finding. Observed: `rg -n "refines" P` printed one line, at line 165.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Run the new owning test file. Observed: `node --test T` printed 4 tests, 4 pass, 0 fail, exit 0. Saved in `scratch/green.txt`.
- [x] T011 Run the existing reducer fallback suite for compatibility. Observed: `node --test .skilled/skills/system-deep-loop/deep-review/scripts/tests/reduce-state-summary-fallback.test.cjs` printed 1 test pass, exit 0.
- [x] T012 Run strict packet validation. Observed: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-deep-loop/review-lineage/004-reducer-traceability-and-refines --strict` printed `RESULT: PASSED`, exit 0.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] `node --test T` exits 0 and the strict validator prints `RESULT: PASSED`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance criteria**: See `acceptance-criteria.md`
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

- [x] CHK-001 [P0] `spec.md` names `R` and the evidence review. Observed: `rg -n "reduce-state.cjs:349|039-hop-dialog-goal-title" spec.md` printed the problem line and the measured-behavior lines.
- [x] CHK-002 [P0] `plan.md` names the fold point and the transition filter. Observed: `rg -n "upsertFinding|severityChanged" plan.md` printed lines 62, 65, 82 and 83.
- [x] CHK-003 [P1] Node and `node:test` are available. Observed: `node --version` printed v26.13.0, exit 0.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `R` parses as CommonJS. Observed: `node --check R` exited 0.
- [x] CHK-011 [P0] The new test file parses. Observed: `node --check T` exited 0.
- [x] CHK-012 [P1] The reducer exports stay unchanged. Observed: `node -p` printed `function function`.
- [x] CHK-013 [P1] No code comment names a spec path, packet id or REQ id. Observed: `rg -n "004-reducer|REQ-00|T00" R T` printed no line, exit 1 from no match.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] Traceability status lines do not enter the exhausted list. Observed: the traceability case in `T` passed.
- [x] CHK-021 [P0] An explicit `Dead Ends` entry still enters the exhausted list. Observed: the dead-end assertion in the traceability case passed.
- [x] CHK-022 [P0] A refines row folds into one finding and updates `lastSeen`, title and transitions. Observed: the fold case in `T` passed with one open finding and `lastSeen` 2.
- [x] CHK-023 [P0] An id reuse without refines keeps both findings. Observed: the unlinked reuse case in `T` passed with `openFindingsCount` 2.
- [x] CHK-024 [P1] An unknown refines target falls back to the ordinary insert path. Observed: the fallback case in `T` passed with one open finding and no throw.
- [x] CHK-025 [P1] The existing summary fallback suite still passes. Observed: T011 exited 0 with 1 test pass.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [x] CHK-FIX-001 [P0] Both findings name their class. The false BLOCKED entry is `cross-consumer`, the refinement count is `algorithmic`. Judgment from reading: the strategy line is consumer-visible output fixed at its producer, and the double count is an algorithm invariant. The packet prose states the effect without these two labels.
- [x] CHK-FIX-002 [P0] Same-class producer inventory is complete. Observed: `rg -n "deadEnds|refinementOf" R` printed the parser, the iteration shape, both converters and `buildExhaustedApproaches`.
- [x] CHK-FIX-003 [P0] Consumer inventory covers the strategy renderer, dashboard counts, `divergent-review-pivot.ts` and the existing reducer tests. Observed: `buildExhaustedApproaches` feeds the strategy anchor, `findingsBySeverity` feeds the dashboard, `divergent-review-pivot.ts` lines 271 and 272 read `registry.traceability`, and the existing suites ran.
- [x] CHK-FIX-004 [P0] Parser cases cover the traceability-only input, the explicit dead-end input, the resolved refines input and the unknown refines input. Observed: the four cases in `T` cover all four inputs and pass.
- [x] CHK-FIX-005 [P1] Matrix axes and rows are listed in `plan.md` under Affected Surfaces. Observed: the plan lists finding source, link state, severity change and dead-end source.
- [x] CHK-FIX-006 [P1] No process-wide state or environment variable is read by the new test cases. Observed: the test file reads no `process.env` value and only uses module exports plus a temp fixture.
- [x] CHK-FIX-007 [P1] Evidence pins the failing behavior to the evidence run path and current line numbers, not a moving branch range. Observed: `spec.md` cites the run path and exact pre-edit line numbers.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No credential or secret is added. Observed: `rg -n "token|secret|password" T` printed no line, exit 1 from no match.
- [x] CHK-031 [P0] `refines` is normalized and compared by map key, never evaluated. Observed: the fold reads `findingById.get(refinesId)` and `rg -n "eval\\(|new Function|Function\\(" R` printed no line.
- [x] CHK-032 [P1] No new file path or network call is introduced. Observed: `rg -n "http|fetch\\(|writeFile" T` printed only `fs.writeFileSync` calls for the temporary fixture.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] `spec.md`, `plan.md` and `tasks.md` name the same three test cases. Observed: `rg -c "traceability|refines|id reuse"` printed 30 in `spec.md`, 20 in `plan.md` and 19 in `tasks.md`.
- [x] CHK-041 [P1] The prompt template line says when to use `refines`. Observed: `rg -n "refines" P` printed one line, at line 165.
- [x] CHK-042 [P2] The reducer changelog is not required for this packet. No entry is planned. Observed: no changelog file was created.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] The new test lives beside the existing reducer tests. Observed: `ls .skilled/skills/system-deep-loop/deep-review/scripts/tests/reduce-state-*.test.cjs` listed both files.
- [x] CHK-051 [P1] No scratch file remains in the packet. Observed: `find specs/system-deep-loop/review-lineage/004-reducer-traceability-and-refines -name "*.tmp"` printed nothing. The `scratch/` directory holds the three evidence logs the build task asked for.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 14 | 14/14 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

One P0 row, CHK-FIX-001, is verified by reading rather than by a command. Its evidence note says so.

**Verification Date**: 2026-11-14
<!-- /ANCHOR:summary -->
